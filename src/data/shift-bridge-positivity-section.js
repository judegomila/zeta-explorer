/**
 * @module shift-bridge-positivity-section
 * @fileoverview Structured rendering of paragraph 15 of the user's paper
 * "Twin-Ladder Deformations of xi" v52
 * (research-inputs/twin_ladder_consolidated_v52.pdf, pages 22-26 of body /
 * pages 11-16 of cumulative ToC index). Section title:
 *   "15 Shift-Bridge Reflection Positivity and a Godelian Witness Principle".
 *
 * The section gives an RH-equivalent positivity formulation:
 *   - Centered completed function X(w) := xi(1/2 + w), which is even entire.
 *   - Horizontal zero-displacement parameter Delta := sup_{X(lambda)=0} |Re lambda|.
 *   - Shifted bridge functions E_a(z) := X(a - iz) (a > 0) and their reflected
 *     companions E_a^#(z) = X(-a - iz).
 *   - Shift-bridge ratio Theta_a(z) := E_a^#(z) / E_a(z) = X(w - a) / X(w + a)
 *     after the substitution w = -iz.
 *   - de Branges reproducing kernel K_a(w, z) attached to (E_a, E_a^#).
 *
 * Threshold theorem (Theorem 15.1): K_a is positive definite for every a > 0
 *   iff Delta = 0 iff RH. The bridge "thickness" needed for positivity is
 *   exactly the horizontal zero displacement Delta.
 *
 * Godelian witness (Section 15.5): an off-critical zero rho = 1/2 + delta + i gamma
 *   with delta > 0 manufactures, for every 0 < a < delta, an internal point
 *   z_rho(a) = -gamma + i(delta - a) in the upper half-plane at which
 *   E_a(z_rho(a)) = 0 — a "ghost" witness inside the bridge formalism that
 *   certifies the failure of self-consistency without recourse to an external
 *   logical sentence.
 *
 * Prime-delay interpretation (Section 15.7): the shift-bridge inequality
 *   |X(w - a)| < |X(w + a)| reads as
 *     "completed gamma/kernel drift > coherent prime-delay pull"
 *   on the half-plane Re(s) > 1/2, i.e. it is the pointwise counterpart of
 *   the quadratic Weil/twin-ladder positivity form built from log-prime delays
 *   (log p) p^{-m/2} e^{-iTm log p}.
 *
 * Conjectures (Section 15.9):
 *   - 15.2: Zero bridge-thickness / shift contractivity — for every a > 0
 *           and every w with Re(w) > 0, |X(w - a)| < |X(w + a)|, equivalently
 *           K_a is positive definite for every a > 0. (Equivalent to RH by
 *           the threshold theorem.)
 *   - 15.3: Shift-bridge positivity — the shifted bridge functions E_a are
 *           Hermite-Biehler for every a > 0.
 *   - 15.4: Prime-delay domination, infinitesimal form — Re(xi'/xi)(sigma + it) > 0
 *           for every sigma > 1/2, every t in R; equivalently the completed
 *           rightward drift of xi dominates the coherent prime-delay echo
 *           train in the half-plane to the right of the critical line.
 *
 * Principle 15.5 (No-ghost twin ladder): off-critical zero <=> upper-half-plane
 *   zero of E_a for some a > 0 <=> negative-norm / ghost witness in the
 *   shifted bridge. RH <=> absence of such witnesses for all a > 0.
 *
 * **What this file exports**
 * - `SHIFT_BRIDGE_POSITIVITY` — frozen record consumed by
 *   src/pages/ShiftBridgePositivityPage.jsx (imp-1196).
 * - `SHIFT_BRIDGE_POSITIVITY_ASSERTIONS` — build-time tripwires auto-discovered
 *   by scripts/run-assertions.mjs.
 *
 * **Scope.** Reference doc only — no numerics. Pure rendering target.
 *
 * **Ticket.** imp-1196 (subscription / opus-4-7).
 */

export const SHIFT_BRIDGE_POSITIVITY = Object.freeze({
  ticketId: 'imp-1196',
  title: 'Shift-Bridge Reflection Positivity (§15)',
  shortName: 'shift-bridge positivity',
  paperSource: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  paperSection: '15',
  paperPageRange: [22, 26],
  paperSectionTitle:
    'Shift-Bridge Reflection Positivity and a Godelian Witness Principle',

  summary:
    'Section 15 of the v52 paper sharpens the informal "twin ladder admits ' +
    'only globally self-consistent zero configurations" idea into a precise ' +
    'and falsifiable positivity criterion. The completed function xi is ' +
    're-centered on the critical line as X(w) := xi(1/2 + w); X is even ' +
    'entire by the functional equation, and a zero rho = 1/2 + delta + i gamma ' +
    'of xi corresponds to a zero lambda = delta + i gamma of X. The ' +
    'horizontal zero-displacement parameter Delta := sup_{X(lambda)=0} |Re lambda| ' +
    'lies in [0, 1/2] and equals zero iff RH. For each a > 0 the shifted ' +
    'bridge E_a(z) := X(a - iz) is built with reflected companion ' +
    'E_a^#(z) = X(-a - iz); the de Branges ratio Theta_a = E_a^# / E_a is ' +
    'a Schur function on the upper half-plane iff |X(w - a)| < |X(w + a)| ' +
    'for every w with Re(w) > 0. The shift-bridge threshold theorem ' +
    '(Theorem 15.1) proves that a Schur Theta_a holds for every a > Delta ' +
    'and fails for every 0 < a < Delta; hence Delta = 0 iff K_a is positive ' +
    'definite for every a > 0 iff RH. The bridge "thickness" needed for ' +
    'positivity is exactly the maximum horizontal zero displacement Delta. ' +
    'An off-critical zero is a "Godelian witness": it manufactures a point ' +
    'z_rho(a) = -gamma + i(delta - a) in the upper half-plane at which ' +
    'E_a(z_rho(a)) = 0, i.e. an internal certificate of failed positivity ' +
    'in the bridge formalism itself. The prime-delay interpretation reads ' +
    'the same inequality as "completed gamma/kernel drift dominates coherent ' +
    'prime-delay pull" on the half-plane to the right of the critical line.',

  centeredCompletedFunction: {
    definitionLaTeX: 'X(w) \\;:=\\; \\xi\\!\\left(\\tfrac{1}{2} + w\\right)',
    evennessLaTeX: 'X(w) \\;=\\; X(-w)',
    zeroCorrespondenceLaTeX:
      '\\rho = \\tfrac{1}{2} + \\delta + i\\gamma \\;\\Longleftrightarrow\\; \\lambda = \\delta + i\\gamma, \\quad X(\\lambda) = 0',
    displacementLaTeX:
      '\\Delta \\;:=\\; \\sup_{\\lambda:\\,X(\\lambda)=0} |\\Re\\lambda| \\;=\\; \\sup_{\\rho} \\left|\\Re(\\rho) - \\tfrac{1}{2}\\right|',
    classicalStripLaTeX: '0 \\;\\le\\; \\Delta \\;\\le\\; \\tfrac{1}{2}',
    rhRestatementLaTeX: '\\text{RH} \\;\\Longleftrightarrow\\; \\Delta = 0',
    description:
      'Recentering xi at the critical line turns the functional equation ' +
      'xi(s) = xi(1 - s) into the evenness X(w) = X(-w). The Riemann ' +
      'Hypothesis is then the assertion that every zero lambda of X is ' +
      'purely imaginary, equivalently Delta = 0. The classical zero strip ' +
      '0 <= Re(rho) <= 1 forces 0 <= Delta <= 1/2.',
  },

  shiftedBridge: {
    EaLaTeX:
      'E_a(z) \\;:=\\; X(a - iz) \\;=\\; \\xi\\!\\left(\\tfrac{1}{2} + a - iz\\right), \\qquad a > 0',
    EaSharpLaTeX:
      'E_a^{\\#}(z) \\;:=\\; \\overline{E_a(\\bar z)} \\;=\\; X(-a - iz)',
    thetaRatioLaTeX:
      '\\Theta_a(z) \\;:=\\; \\frac{E_a^{\\#}(z)}{E_a(z)} \\;=\\; \\frac{X(-a - iz)}{X(a - iz)}',
    afterSubstitutionLaTeX:
      'w \\;=\\; -iz \\quad\\Longrightarrow\\quad \\Theta_a(z) \\;=\\; \\frac{X(w - a)}{X(w + a)}',
    contractivityLaTeX:
      '\\left|\\Theta_a(z)\\right| < 1 \\;\\Longleftrightarrow\\; \\left|X(w - a)\\right| < \\left|X(w + a)\\right| \\quad (\\Re w > 0)',
    inXiVariableLaTeX:
      '\\left|\\xi(s - a)\\right| \\;<\\; \\left|\\xi(s + a)\\right| \\qquad \\left(\\Re s > \\tfrac{1}{2}\\right)',
    kernelLaTeX:
      'K_a(w, z) \\;:=\\; \\frac{E_a(z)\\,\\overline{E_a(w)} - E_a^{\\#}(z)\\,\\overline{E_a^{\\#}(w)}}{2\\pi i\\,(\\bar w - z)}',
    description:
      'For each thickness a > 0 the shifted bridge pair (E_a, E_a^#) is a ' +
      'candidate Hermite-Biehler / de Branges structure pair. Its reproducing ' +
      'kernel K_a is positive definite iff Theta_a is a Schur function on ' +
      'the upper half-plane, iff the contractivity inequality ' +
      '|X(w - a)| < |X(w + a)| holds for every w with Re(w) > 0. In the ' +
      'original variable s = 1/2 + w this is the pointwise horizontal ' +
      'domination |xi(s - a)| < |xi(s + a)| on Re(s) > 1/2.',
  },

  thresholdTheorem: {
    label: 'Theorem 15.1 (Shift-bridge threshold)',
    statement:
      'Let X(w) := xi(1/2 + w) and Delta := sup_{lambda : X(lambda) = 0} |Re lambda|. ' +
      'If a > Delta, then for every w with Re(w) > 0 one has ' +
      '|X(w - a)| < |X(w + a)|; consequently Theta_a is a Schur function ' +
      'on the upper half-plane and the kernel K_a is positive definite. ' +
      'Conversely, if 0 < a < Delta, then E_a has a zero in the upper ' +
      'half-plane and K_a is NOT positive definite. Hence ' +
      'K_a >= 0 for every a > 0 if and only if Delta = 0 if and only if RH.',
    statementLaTeX:
      'K_a \\succeq 0 \\text{ for every } a > 0 \\;\\Longleftrightarrow\\; \\Delta = 0 \\;\\Longleftrightarrow\\; \\text{RH}',
    proofSketch:
      'Even and real-entire X has zeros in symmetric packets ' +
      '{lambda, -lambda, conj(lambda), -conj(lambda)}. For a same-height ' +
      'reflected pair lambda = delta +/- i gamma with delta > 0 the ' +
      'associated quadratic factor Q_{delta,gamma}(w) = (w - i gamma)^2 - delta^2 ' +
      'satisfies the explicit identity ' +
      '|Q_{delta,gamma}(w + a)|^2 - |Q_{delta,gamma}(w - a)|^2 = 8 a x (x^2 + Y^2 + a^2 - delta^2), ' +
      'where w = x + iy and Y = y - gamma. For a > delta this is strictly ' +
      'positive. For a critical-line factor lambda = i gamma the corresponding ' +
      'identity 4ax > 0 again gives strict growth under w - a -> w + a. ' +
      'Grouping the symmetric Hadamard product for X by these packets and ' +
      'passing from finite products to the locally uniform limit yields ' +
      '|X(w + a)| > |X(w - a)| on Re(w) > 0 whenever a > Delta. Conversely, ' +
      'if delta > a then a - iz = delta + i gamma is solvable with ' +
      'z = -gamma + i(delta - a) in the upper half-plane, so E_a vanishes ' +
      'there and the Hermite-Biehler / de Branges structure fails.',
    keyIdentityLaTeX:
      '|Q_{\\delta,\\gamma}(w + a)|^2 - |Q_{\\delta,\\gamma}(w - a)|^2 \\;=\\; 8 a x \\left(x^2 + Y^2 + a^2 - \\delta^2\\right)',
  },

  godelianWitness:
    'Suppose RH fails. Then there exists a zero rho = 1/2 + delta + i gamma ' +
    'with delta > 0. For any 0 < a < delta the zero itself manufactures an ' +
    'internal upper-half-plane point z_rho(a) = -gamma + i(delta - a) at ' +
    'which E_a(z_rho(a)) = 0. Equivalently, the putative Schur ratio ' +
    'Theta_a(z) = E_a^#(z) / E_a(z) has a pole in the upper half-plane. ' +
    'This is the "Godelian" aspect of the construction: a forbidden off-critical ' +
    'zero does not merely violate the desired positivity conclusion externally; ' +
    'it creates a WITNESS INSIDE the bridge formalism that certifies the ' +
    'failure of self-consistency. The word "Godelian" is used in an ' +
    'analogical, witness-producing sense — the argument does not invoke ' +
    'Godel\'s incompleteness theorem; it imports the structural pattern ' +
    '"off-critical zero  ==>  internal certificate of failed positivity." ' +
    'In twin-ladder language, z_rho(a) is a negative-norm / ghost witness ' +
    'for the completed ladder.',

  godelianWitnessPointLaTeX:
    'z_\\rho(a) \\;=\\; -\\gamma + i(\\delta - a), \\qquad 0 < a < \\delta \\;\\Longrightarrow\\; E_a(z_\\rho(a)) = 0',

  primeDelayInterpretation:
    'In the Euler region the logarithmic derivative ' +
    '-(zeta\'/zeta)(s) = sum_n Lambda(n)/n^s = sum_{p,m>=1} (log p) e^{-s m log p} ' +
    'expands as a Dirichlet sum over prime-delay rungs of length m log p. ' +
    'On the critical line s = 1/2 + iT the m-th rung at prime p contributes ' +
    'e^{-s m log p} = p^{-m/2} e^{-iTm log p}, i.e. the closed-loop transfer ' +
    'of an ideal delay-feedback cell with delay tau_p = log p. The shift-bridge ' +
    'inequality |X(w - a)| < |X(w + a)| can therefore be read as the pointwise ' +
    'DOMINATION PRINCIPLE "completed gamma/kernel drift > coherent prime-delay pull": ' +
    'the rightward drift of the completed gamma/kernel side dominates the ' +
    'coherent (log p) p^{-m/2} e^{-iTm log p} echo train on the half-plane to ' +
    'the right of the critical line. Letting a -> 0+ formally turns this into ' +
    'the infinitesimal form Re (xi\'/xi)(sigma + it) > 0 for sigma > 1/2, ' +
    'which is the pointwise drift version of Conjecture 15.4 — the pointwise ' +
    'counterpart of the quadratic Weil / twin-ladder positivity form.',

  primeDelayDriftLaTeX:
    '\\Re\\left(\\frac{\\xi\'}{\\xi}\\right)(\\sigma + it) > 0 \\qquad \\left(\\sigma > \\tfrac{1}{2}\\right)',

  conjectures: [
    {
      id: '15.2',
      label: 'Conjecture 15.2',
      shortName: 'Zero bridge-thickness / shift contractivity',
      statement:
        'For every a > 0 and every w with Re(w) > 0, |X(w - a)| < |X(w + a)|. ' +
        'Equivalently, the shifted de Branges kernel K_a is positive definite ' +
        'for every a > 0. By the shift-bridge threshold theorem this conjecture ' +
        'is EQUIVALENT TO RH; its value is that it turns the informal ' +
        'self-consistency idea into a precise, falsifiable, bridge-native ' +
        'criterion: RH is the assertion that the completed twin ladder has ' +
        'zero positivity gap.',
      statementLaTeX:
        '\\forall\\,a > 0,\\;\\forall\\,w\\text{ with }\\Re w > 0: \\quad |X(w - a)| < |X(w + a)|',
      equivalentToRH: true,
    },
    {
      id: '15.3',
      label: 'Conjecture 15.3',
      shortName: 'Shift-bridge positivity (Hermite-Biehler form)',
      statement:
        'The shifted bridge functions E_a(z) = xi(1/2 + a - iz) are Hermite-Biehler ' +
        'for every a > 0. (Equivalent to Conjecture 15.2 and hence to RH.)',
      statementLaTeX:
        '\\forall\\,a > 0:\\quad E_a(z) = \\xi\\!\\left(\\tfrac{1}{2} + a - iz\\right) \\text{ is Hermite-Biehler}',
      equivalentToRH: true,
    },
    {
      id: '15.4',
      label: 'Conjecture 15.4',
      shortName: 'Prime-delay domination, infinitesimal form',
      statement:
        'For every sigma > 1/2 and every t in R, Re (xi\'/xi)(sigma + it) > 0. ' +
        'Equivalently, the completed rightward drift of xi dominates the ' +
        'coherent prime-delay echo train in the half-plane to the right of ' +
        'the critical line. This is the a -> 0+ infinitesimal form of the ' +
        'shift-bridge inequality.',
      statementLaTeX:
        '\\forall\\,\\sigma > \\tfrac{1}{2},\\;\\forall\\,t \\in \\mathbb{R}:\\quad \\Re\\!\\left(\\tfrac{\\xi\'}{\\xi}\\right)\\!(\\sigma + it) > 0',
      equivalentToRH: true,
    },
  ],

  principle155: {
    label: 'Principle 15.5 (No-ghost twin ladder)',
    statement:
      'An off-critical zero is equivalent to an upper-half-plane zero of E_a ' +
      'for some a > 0, hence to a negative-norm / ghost witness in the shifted ' +
      'bridge. RH is equivalent to the absence of such witnesses for ALL ' +
      'bridge thicknesses a > 0.',
  },

  whyItMatters: [
    'Section 15 supplies the load-bearing positivity bridge for the v52 paper. ' +
    'Where the Riemann Hypothesis is classically posed as a statement about ' +
    'the locations of zeros, the shift-bridge threshold theorem recasts it as ' +
    'a one-parameter family of POSITIVITY statements: K_a >= 0 for every ' +
    'a > 0. This converts the "no off-critical zero" assertion into a ' +
    'CONTINUOUSLY PARAMETRIZED criterion, exposing a natural "thickness" ' +
    'variable a > 0 along which finite-a partial certificates can in principle ' +
    'be verified numerically while a -> 0+ remains the final analytic step.',

    'The Godelian witness mechanism is structurally important. If RH fails ' +
    'then the bridge formalism itself produces an internal point ' +
    'z_rho(a) = -gamma + i(delta - a) at which positivity breaks. This means ' +
    'the project does not need an EXTERNAL contradiction to falsify a ' +
    'positivity claim: an off-critical zero would itself produce a ghost ' +
    'witness IN THE BRIDGE. For the twin-ladder project this aligns the ' +
    'no-ghost language ("twin ladder admits only globally self-consistent ' +
    'zero configurations") with a precise object — the upper-half-plane ' +
    'zero of E_a — that can be searched for in computational experiments.',

    'The prime-delay reading (Section 15.7) links Section 15 directly to the ' +
    'Lambda attack. The infinitesimal form Re(xi\'/xi)(sigma + it) > 0 on ' +
    'Re(s) > 1/2 (Conjecture 15.4) is the pointwise counterpart of the ' +
    'quadratic Weil/twin-ladder positivity form built from log-prime delays. ' +
    'It is also tractable from existing project infrastructure: the ' +
    'finite-N* unconditional beat (imp-1086) and the imp-963 plateau data ' +
    'can be reused as a numerical audit (imp-1202 is queued for this).',
  ],

  references: [
    {
      authors: ['L. de Branges'],
      year: 1968,
      title: 'Hilbert Spaces of Entire Functions',
      venue: 'Prentice-Hall, Englewood Cliffs',
      role: 'foundational-text',
      note:
        'Standard reference for Hermite-Biehler / de Branges structure pairs ' +
        '(E, E^#), reproducing kernel K(w, z) = (E(z) E(w)* - E^#(z) E^#(w)*) / (2 pi i (w* - z)), ' +
        'Schur function characterization.',
    },
    {
      authors: ['M. Rosenblum', 'J. Rovnyak'],
      year: 1994,
      title: 'Topics in Hardy Classes and Univalent Functions',
      venue: 'Birkhauser Advanced Texts',
      role: 'modern-companion-text',
      note:
        'Modern self-contained treatment of de Branges spaces, Hermite-Biehler ' +
        'class, and bridge constructions; covers the Schur / inner-function ' +
        'side of the shifted-bridge identity used in Theorem 15.1.',
    },
    {
      authors: ['H. Iwaniec', 'E. Kowalski'],
      year: 2004,
      title: 'Analytic Number Theory',
      venue: 'AMS Colloquium Publications 53',
      role: 'standard-reference',
      note:
        'Sections on the explicit formula, completed xi, and horizontal ' +
        'monotonicity of |xi(s)| — context for the prime-delay interpretation ' +
        'of Section 15.7.',
    },
    {
      authors: ['B. Conrey', 'A. Ghosh'],
      year: 1988,
      title: 'On the Selberg class of Dirichlet series: small degrees',
      venue: 'Duke Math. J. 72',
      role: 'horizontal-monotonicity-context',
      note:
        'Classical horizontal-monotonicity results for |xi| play the role of ' +
        'the a -> 0+ limit Re(xi\'/xi)(sigma + it) > 0 (Conjecture 15.4); the ' +
        'global form is RH-equivalent.',
    },
    {
      authors: ['J. Gomila'],
      year: 2026,
      title: 'Twin-Ladder Deformations of xi, Consolidated draft v52',
      venue: 'research-inputs/twin_ladder_consolidated_v52.pdf (pages 22-26)',
      role: 'primary-source',
      note:
        'Section 15 of the user\'s own paper; the source this page renders.',
    },
  ],

  relatedSections: [
    {
      paperSection: '16',
      ticket: 'imp-1197',
      route: '/closure-routes',
      label: 'Four Equivalent Closure Routes',
      description:
        'Section 16 records four mathematically equivalent ways to close the ' +
        'Delta = 0 gap of Section 15: Schur contractivity (Route A), de Branges ' +
        'positivity (Route B), hidden-square kernel factorization (Route C), ' +
        'Weil / twin-ladder norm square (Route D).',
    },
    {
      paperSection: '17',
      ticket: 'imp-1198',
      route: '/blaschke-ghosts',
      label: 'Blaschke Ghosts and Pontryagin Indices',
      description:
        'Section 17 operationalizes the Godelian-witness picture: a putative ' +
        'off-critical zero is the inverse Blaschke factor of a single ghost ' +
        'in the right half-plane; counting ghosts gives the Pontryagin index ' +
        'of the failed positivity.',
    },
    {
      paperSection: '18',
      ticket: 'imp-1199',
      route: '/three-attacks',
      label: 'Three Concrete Attack Programs',
      description:
        'Section 18 reorganizes the four closure routes into three concrete ' +
        'attack programs: kernel/passivity (Attack I), prime-delay domination ' +
        '(Attack II, directly continuing Conjecture 15.4), and ' +
        'Weil/Pontryagin index closure (Attack III).',
    },
  ],

  projectRelevance: [
    {
      ticket: 'imp-1196',
      title: 'This ticket — ship /shift-bridge-positivity page',
      relation:
        'Renders Section 15 of the v52 paper as a dedicated app page so the ' +
        'shift-bridge positivity criterion is discoverable from the app nav.',
    },
    {
      ticket: 'imp-1202',
      title:
        'Audit Conjecture 15.4 (prime-delay domination) vs imp-1086 finite-N* beat',
      relation:
        'Numerical cross-check of Conjecture 15.4 against the imp-1086 finite-N* ' +
        'unconditional beat infrastructure; honest-partial verdict acceptable.',
    },
    {
      ticket: 'imp-1086',
      title: 'Finite-N* unconditional beat infrastructure',
      relation:
        'Existing finite-N* infrastructure that imp-1202 reuses to test the ' +
        'infinitesimal prime-delay domination form (Conjecture 15.4) at ' +
        'tractable heights.',
    },
  ],

  builtAt: '2026-05-26T00:00:00Z',
  byModel: 'opus-4-7',
  byChannel: 'subscription-worktree',
});

export default SHIFT_BRIDGE_POSITIVITY;

// ── Build-time tripwires ──────────────────────────────────────────────────────

export const SHIFT_BRIDGE_POSITIVITY_ASSERTIONS = [
  {
    id: 'imp1196-paper-page-range-section15',
    holds: () => {
      const r = SHIFT_BRIDGE_POSITIVITY.paperPageRange;
      return (
        Array.isArray(r) &&
        r.length === 2 &&
        Number.isInteger(r[0]) &&
        Number.isInteger(r[1]) &&
        r[0] < r[1] &&
        r[0] >= 10 &&
        r[1] <= 35 &&
        SHIFT_BRIDGE_POSITIVITY.paperSection === '15' &&
        typeof SHIFT_BRIDGE_POSITIVITY.paperSource === 'string' &&
        SHIFT_BRIDGE_POSITIVITY.paperSource.includes('twin_ladder_consolidated_v52')
      );
    },
    why:
      'Section 15 of the v52 paper lives on pages 22-26 of the body. The page ' +
      'range, the section number "15", and the paper-source filename must all ' +
      'be locked so an accidental rewrite (e.g. pointing at the wrong section ' +
      'or the wrong paper draft) is caught at build time.',
  },
  {
    id: 'imp1196-threshold-theorem-non-empty-and-rh-equivalent',
    holds: () => {
      const t = SHIFT_BRIDGE_POSITIVITY.thresholdTheorem;
      return (
        t &&
        typeof t.label === 'string' &&
        t.label.includes('15.1') &&
        typeof t.statement === 'string' &&
        t.statement.length >= 300 &&
        t.statement.includes('Delta = 0') &&
        t.statement.includes('RH') &&
        typeof t.statementLaTeX === 'string' &&
        t.statementLaTeX.includes('\\Delta') &&
        typeof t.proofSketch === 'string' &&
        t.proofSketch.length >= 300 &&
        typeof t.keyIdentityLaTeX === 'string' &&
        t.keyIdentityLaTeX.includes('\\delta')
      );
    },
    why:
      'The shift-bridge threshold theorem is the load-bearing equivalence of ' +
      'Section 15: Delta = 0 <=> K_a >= 0 for every a > 0 <=> RH. Statement ' +
      'and proof sketch must be substantive (>= 300 chars each) and must ' +
      'name both Delta = 0 and RH so an accidental truncation is caught.',
  },
  {
    id: 'imp1196-three-conjectures-15-2-15-3-15-4',
    holds: () => {
      const cs = SHIFT_BRIDGE_POSITIVITY.conjectures;
      if (!Array.isArray(cs) || cs.length !== 3) return false;
      const ids = cs.map((c) => c.id);
      const required = ['15.2', '15.3', '15.4'];
      if (!required.every((id) => ids.includes(id))) return false;
      return cs.every(
        (c) =>
          typeof c.id === 'string' &&
          typeof c.label === 'string' &&
          typeof c.statement === 'string' &&
          c.statement.length >= 100 &&
          typeof c.statementLaTeX === 'string' &&
          c.statementLaTeX.length >= 10 &&
          c.equivalentToRH === true
      );
    },
    why:
      'Section 15.9 lists exactly three new conjectures — 15.2 (zero ' +
      'bridge-thickness), 15.3 (shift-bridge Hermite-Biehler), 15.4 ' +
      '(prime-delay infinitesimal). All three must be present, each with ' +
      'a non-trivial statement and LaTeX form, each flagged as equivalent ' +
      'to RH. A missing or downgraded conjecture would mis-represent the paper.',
  },
  {
    id: 'imp1196-centered-completed-function-and-shifted-bridge-defined',
    holds: () => {
      const c = SHIFT_BRIDGE_POSITIVITY.centeredCompletedFunction;
      const s = SHIFT_BRIDGE_POSITIVITY.shiftedBridge;
      if (!c || !s) return false;
      const cKeys = [
        'definitionLaTeX',
        'evennessLaTeX',
        'zeroCorrespondenceLaTeX',
        'displacementLaTeX',
        'rhRestatementLaTeX',
      ];
      const sKeys = [
        'EaLaTeX',
        'EaSharpLaTeX',
        'thetaRatioLaTeX',
        'contractivityLaTeX',
        'kernelLaTeX',
      ];
      return (
        cKeys.every((k) => typeof c[k] === 'string' && c[k].length > 0) &&
        sKeys.every((k) => typeof s[k] === 'string' && s[k].length > 0) &&
        c.definitionLaTeX.includes('X(w)') &&
        c.displacementLaTeX.includes('\\Delta') &&
        s.EaLaTeX.includes('E_a') &&
        s.kernelLaTeX.includes('K_a')
      );
    },
    why:
      'The centered completed function X(w) = xi(1/2 + w) and the shifted ' +
      'bridge (E_a, E_a^#, Theta_a, K_a) are the two structural definitions ' +
      'on which Theorem 15.1 rests. All LaTeX fields must be present and ' +
      'name the right symbols (X, Delta, E_a, K_a). A regression to a ' +
      'broken or empty LaTeX string would render the page non-mathematical.',
  },
  {
    id: 'imp1196-godelian-witness-and-prime-delay-paragraphs',
    holds: () => {
      const g = SHIFT_BRIDGE_POSITIVITY.godelianWitness;
      const p = SHIFT_BRIDGE_POSITIVITY.primeDelayInterpretation;
      const gPoint = SHIFT_BRIDGE_POSITIVITY.godelianWitnessPointLaTeX;
      const drift = SHIFT_BRIDGE_POSITIVITY.primeDelayDriftLaTeX;
      return (
        typeof g === 'string' &&
        g.length >= 500 &&
        g.includes('Godelian') &&
        g.includes('z_rho') &&
        typeof p === 'string' &&
        p.length >= 500 &&
        (p.includes('prime-delay') || p.includes('prime delay')) &&
        typeof gPoint === 'string' &&
        gPoint.includes('z_\\rho') &&
        typeof drift === 'string' &&
        drift.includes('\\xi')
      );
    },
    why:
      'The Godelian-witness paragraph (Section 15.5) and the prime-delay ' +
      'interpretation (Section 15.7) are the two non-mathematical ' +
      'narrative pillars of Section 15. Each must be >= 500 chars, name the ' +
      'right anchor terms, and be backed by a LaTeX point z_rho(a) and a ' +
      'LaTeX drift inequality. Truncation would lose the pedagogical content.',
  },
  {
    id: 'imp1196-related-sections-link-1197-1198-1199',
    holds: () => {
      const rs = SHIFT_BRIDGE_POSITIVITY.relatedSections;
      if (!Array.isArray(rs) || rs.length !== 3) return false;
      const tickets = rs.map((r) => r.ticket).sort();
      const routes = rs.map((r) => r.route);
      return (
        JSON.stringify(tickets) ===
          JSON.stringify(['imp-1197', 'imp-1198', 'imp-1199']) &&
        routes.includes('/closure-routes') &&
        routes.includes('/blaschke-ghosts') &&
        routes.includes('/three-attacks') &&
        rs.every(
          (r) =>
            typeof r.paperSection === 'string' &&
            typeof r.label === 'string' &&
            typeof r.description === 'string' &&
            r.description.length >= 80
        )
      );
    },
    why:
      'Section 15 is part of a sibling cluster (Sections 16, 17, 18) ' +
      'mapped to tickets imp-1197 (/closure-routes), imp-1198 ' +
      '(/blaschke-ghosts), imp-1199 (/three-attacks). The relatedSections ' +
      'array must keep those three sibling pointers in lockstep so a ' +
      'rename / re-routing of any sibling page does not silently desync.',
  },
  {
    id: 'imp1196-references-min-3-with-de-branges-and-primary-source',
    holds: () => {
      const refs = SHIFT_BRIDGE_POSITIVITY.references;
      if (!Array.isArray(refs) || refs.length < 3) return false;
      const hasDeBranges = refs.some(
        (r) =>
          Array.isArray(r.authors) &&
          r.authors.some((a) => a.includes('de Branges'))
      );
      const hasPrimary = refs.some((r) => r.role === 'primary-source');
      return (
        hasDeBranges &&
        hasPrimary &&
        refs.every(
          (r) =>
            Array.isArray(r.authors) &&
            r.authors.length > 0 &&
            typeof r.year === 'number' &&
            typeof r.title === 'string' &&
            typeof r.role === 'string' &&
            typeof r.note === 'string'
        )
      );
    },
    why:
      'The reference list must include de Branges 1968 (the foundational ' +
      'Hilbert-Spaces-of-Entire-Functions text the bridge construction rests ' +
      'on) and the primary-source pointer back to the v52 paper. Without ' +
      'these the attribution chain breaks. Minimum 3 references with a ' +
      'fully-populated record per entry.',
  },
  {
    id: 'imp1196-summary-and-why-it-matters-substantive',
    holds: () => {
      const s = SHIFT_BRIDGE_POSITIVITY.summary;
      const w = SHIFT_BRIDGE_POSITIVITY.whyItMatters;
      return (
        typeof s === 'string' &&
        s.length >= 800 &&
        s.includes('Delta') &&
        s.includes('K_a') &&
        Array.isArray(w) &&
        w.length === 3 &&
        w.every((p) => typeof p === 'string' && p.length >= 300)
      );
    },
    why:
      'The summary (>= 800 chars) and the three why-it-matters paragraphs ' +
      '(>= 300 chars each) are the page\'s first-impression content. A ' +
      'shrink-to-stub regression would defeat the pedagogical purpose of ' +
      'shipping a dedicated /shift-bridge-positivity page in the first place.',
  },
];
