/**
 * @module freezing-bridge-section
 * @fileoverview Structured rendering of §23 of
 *   research-inputs/twin_ladder_consolidated_v52.pdf
 *   "Freezing, Bridge Renormalization, and a Targeted No-Ghost Attack"
 *
 * §23 isolates the question "can the older freezing tools remove or rule out
 * the inverse-Blaschke ghost factor in the shifted bridge R_a?" The answer is
 * recorded precisely across seven subsections:
 *
 *   23.1 What a freeze can and cannot do
 *        — Proposition 23.1: ghost freezing is DIAGNOSTIC, not a proof.
 *   23.2 Schur-complement freezing preserves negative index
 *        — Proposition 23.2: ind_- (Q) = ind_- (C) + ind_- (Q_eff); a ghost
 *          mode cannot be DESTROYED by freezing, only MOVED.
 *   23.3 Endpoint bridges as finite-window positivity repairs
 *        — Lemma 23.3: a finite-window positive certificate
 *          lambda_min(G^fr) > ||E||_2 ⇒ G_a(Z) > 0 on the sampled subspace.
 *   23.4 Frozen coherent-shell domination
 *        — Principle 23.4: rigorous no-ghost on H_W from a frozen-shell
 *          positivity margin m_U dominating the tail bound eps_U.
 *   23.5 Can a clever freeze finish the proof?
 *        — Conjecture 23.5 (Passive frozen-bridge closure):  a kernel-derived
 *          frozen bridge whose passivity is structural and whose residual is
 *          uniformly controlled would close RH.
 *   23.6 A practical next experiment
 *        — 5-step protocol: shifted bridge Gram on dense mesh, frozen
 *          approximation, interval-arithmetic certification of negative index.
 *   23.7 Conclusion of the freeze attack
 *        — Freezing is an INERTIA-PRESERVING REDUCTION TOOL + finite-window
 *          CERTIFICATION ENGINE, not a proof shortcut. The real analytic step
 *          is a passive frozen-bridge closure surviving the limits
 *          U → ∞, W ↗ C+, a ↓ 0.
 *
 * The verdict from §23.5 is the load-bearing answer: NO, a clever freeze
 * cannot finish the proof unless the freeze is DERIVED from the completed
 * kernel / prime-delay structure and is automatically passive before any
 * zero information is inserted.
 *
 * **What this file exports**
 * - `FREEZING_BRIDGE_SECTION` — frozen record consumed by
 *   src/pages/FreezingBridgePage.jsx (imp-1221).
 * - `FREEZING_BRIDGE_SECTION_ASSERTIONS` — build-time tripwires auto-discovered
 *   by scripts/run-assertions.mjs.
 *
 * **Scope.** Reference doc only — no numerics. Pure rendering target.
 *
 * **Ticket.** imp-1221 (medium / sonnet bucket).
 */

export const FREEZING_BRIDGE_SECTION = Object.freeze({
  id: 'freezing-bridge-section',
  ticketId: 'imp-1221',
  title: 'Freezing, Bridge Renormalization, and a Targeted No-Ghost Attack',
  shortName: 'freezing bridge',
  paperSource: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  paperSection: '23',
  paperPageRange: [32, 36],
  paperSectionTitle:
    'Freezing, Bridge Renormalization, and a Targeted No-Ghost Attack',
  generatedAt: '2026-05-26T00:00:00Z',

  intro:
    'The preceding sections isolate the RH-equivalent obstruction as an ' +
    'inverse-Blaschke ghost factor in the shifted bridge ' +
    'R_a(w) = X(w - a) / X(w + a) on the right half-plane, where ' +
    'X(w) = xi(1/2 + w). Section 23 records the precise answer to the ' +
    'natural question: can freezing ladders, endpoint bridges, ' +
    'Schur-complement reduction, coherent shells, or viscosity smoothing ' +
    'REMOVE or RULE OUT this ghost factor? The short version: freezing ' +
    'cannot make an existing ghost disappear without changing the function, ' +
    'but it can turn ghost absence into a finite-window, interval-certifiable ' +
    'positivity problem. A freeze is therefore not a magic proof mechanism; ' +
    'it is a way to expose WHERE the proof must close.',

  shiftedBridgeRecallLaTeX:
    'R_a(w) \\;=\\; \\frac{X(w - a)}{X(w + a)}, \\qquad X(w) \\;=\\; \\xi\\!\\left(\\tfrac{1}{2} + w\\right), \\qquad \\Re w > 0.',

  // ── §23.1 ──────────────────────────────────────────────────────────────
  s23_1: Object.freeze({
    id: '23.1',
    name: 'What a freeze can and cannot do',
    paperContent:
      'Let P_a denote the right-half-plane ghost set P_a = { alpha = lambda - a : ' +
      'X(lambda) = 0, Re(lambda) > a }. For each alpha in P_a the right-half-plane ' +
      'Blaschke factor b_alpha(w) = (w - alpha) / (w + alpha) is unitary on the ' +
      'imaginary axis. For a finite subset G of P_a, the product B_G(w) = prod_{alpha in G} b_alpha(w) ' +
      'multiplies R_a to a pole-cleared function R_a,G^fr(w) = B_G(w) R_a(w) whose ' +
      'poles in the right half-plane are exactly those of P_a \\ G. Proposition 23.1 ' +
      '(Ghost freezing is DIAGNOSTIC, not a proof): multiplication by B_G removes ' +
      'ONLY the explicitly frozen ghost poles in G. If P_a \\ G is non-empty, ' +
      'R_a,G^fr still has right-half-plane poles. If G = P_a (every pole removed), ' +
      'then the pole-cleared function has boundary modulus one and is Schur — but ' +
      'the choice G = P_a is EQUIVALENT to knowing the offending zeros in advance. ' +
      'Thus a freeze can remove a KNOWN ghost from a model, but a proof of RH ' +
      'requires showing that no such ghost was present in the first place. The role ' +
      'of freezing is therefore to BUILD FINITE CERTIFICATES that would expose a ' +
      'ghost if one existed.',
    keyResult:
      'Proposition 23.1: Freezing removes only EXPLICITLY ENUMERATED ghost poles. ' +
      'If any pole of P_a is omitted from G, R_a,G^fr still has a right-half-plane ' +
      'pole. Total pole removal (G = P_a) is equivalent to KNOWING the offending ' +
      'zeros, hence is not available without RH.',
    kaTeXFormula:
      '\\mathcal P_a \\;=\\; \\{\\, \\alpha = \\lambda - a \\,:\\, X(\\lambda) = 0,\\; \\Re\\lambda > a \\,\\}, \\qquad b_\\alpha(w) = \\frac{w - \\alpha}{w + \\alpha}, \\qquad B_G(w) = \\prod_{\\alpha \\in G} b_\\alpha(w), \\qquad R_{a,G}^{\\mathrm{fr}}(w) = B_G(w)\\,R_a(w).',
    verdict: 'diagnostic-not-proof',
  }),

  // ── §23.2 ──────────────────────────────────────────────────────────────
  s23_2: Object.freeze({
    id: '23.2',
    name: 'Schur-complement freezing preserves negative index',
    paperContent:
      'The Hamiltonian sections interpreted freezing as Schur-complement (Feshbach) ' +
      'reduction. The same idea applies to the shifted bridge kernel. Decompose a ' +
      'finite Gram form Q into live (A) and frozen (C) sectors with cross-coupling B, ' +
      'with C invertible self-adjoint. The frozen EFFECTIVE form is Q_eff = A - B C^{-1} B^*. ' +
      'Proposition 23.2 (Freezing cannot HIDE ghosts): if C is invertible, then ' +
      'ind_- (Q) = ind_- (C) + ind_- (Q_eff), where ind_- denotes the number of negative ' +
      'eigenvalues counted with multiplicity. The proof uses the block factorization ' +
      'showing Q is congruent to Q_eff ⊕ C; Sylvester inertia invariance under congruence ' +
      'gives the result. Consequence: a negative ghost mode cannot be DESTROYED by freezing. ' +
      'It can only MOVE — either it remains in the frozen block C, or it reappears in ' +
      'the effective live form Q_eff. This is a useful safety principle for the program: ' +
      'any finite freezing scheme that appears to remove ghosts must account for ' +
      'inertia preservation.',
    keyResult:
      'Proposition 23.2 (Sylvester inertia preservation): ' +
      'ind_- (Q) = ind_- (C) + ind_- (Q_eff). A negative-index mode cannot be ' +
      'destroyed by Schur-complement freezing; it can only move between the frozen ' +
      'block C and the effective live form Q_eff = A - B C^{-1} B^*.',
    kaTeXFormula:
      'Q \\;=\\; \\begin{pmatrix} A & B \\\\ B^{*} & C \\end{pmatrix}, \\qquad Q_{\\mathrm{eff}} \\;=\\; A - B\\,C^{-1}\\,B^{*}, \\qquad \\operatorname{ind}_{-}(Q) \\;=\\; \\operatorname{ind}_{-}(C) + \\operatorname{ind}_{-}(Q_{\\mathrm{eff}}).',
    verdict: 'inertia-preserved-ghosts-move-not-vanish',
  }),

  // ── §23.3 ──────────────────────────────────────────────────────────────
  s23_3: Object.freeze({
    id: '23.3',
    name: 'Endpoint bridges as finite-window positivity repairs',
    paperContent:
      'The endpoint-bridge hierarchy from the coherent-shell section repairs local ' +
      'approximation errors. In the shifted bridge setting it is used as follows. ' +
      'Fix a > 0 and a finite set of test points Z = { z_1, ..., z_N } ⊂ C_+. ' +
      'Let G_a(Z) = ( K_a(z_j, z_k) )_{j,k=1..N} be the shifted bridge Gram matrix. ' +
      'A finite bridge approximation produces a computable matrix G^fr_{a,U}(Z) and an ' +
      'interval-enclosed error matrix E_{a,U}(Z) = G_a(Z) - G^fr_{a,U}(Z). ' +
      'Lemma 23.3 (Finite-window positive certificate): if lambda_min(G^fr_{a,U}(Z)) > ||E_{a,U}(Z)||_2, ' +
      'then G_a(Z) is positive definite on the sampled subspace. The proof is the ' +
      'straightforward inequality c* G_a(Z) c = c* G^fr_{a,U}(Z) c + c* E_{a,U}(Z) c ' +
      '>= (lambda_min(G^fr_{a,U}) - ||E_{a,U}||_2) ||c||^2. This is NOT a global proof, ' +
      'but it IS an honest bridge-certified finite experiment. Conversely, a NEGATIVE ' +
      'eigenvalue of G_a(Z) is a finite-window ghost witness — a falsifying mesh sample.',
    keyResult:
      'Lemma 23.3 (Finite-window positive certificate): on a finite mesh Z ⊂ C+, ' +
      'lambda_min(G^fr_{a,U}(Z)) > ||E_{a,U}(Z)||_2 ⇒ G_a(Z) ≻ 0 on the sampled ' +
      'subspace. A NEGATIVE eigenvalue is a finite-window GHOST WITNESS.',
    kaTeXFormula:
      'G_a(Z) \\;=\\; \\bigl(K_a(z_j, z_k)\\bigr)_{j,k=1}^{N}, \\qquad E_{a,U}(Z) \\;=\\; G_a(Z) - G^{\\mathrm{fr}}_{a,U}(Z), \\qquad \\lambda_{\\min}\\!\\left(G^{\\mathrm{fr}}_{a,U}(Z)\\right) \\;>\\; \\bigl\\|E_{a,U}(Z)\\bigr\\|_{2} \\;\\Longrightarrow\\; G_a(Z) \\;\\succ\\; 0.',
    verdict: 'finite-window-falsifier-channel',
  }),

  // ── §23.4 ──────────────────────────────────────────────────────────────
  s23_4: Object.freeze({
    id: '23.4',
    name: 'Frozen coherent-shell domination',
    paperContent:
      'There is an analogous prime-delay version. Let h be a coherent log-shell ' +
      'with auto-correlation C_h(r) = ∫_R h(u) h(u - r) du. The Weil / twin-ladder ' +
      'form has the schematic shape Q_TL[h] = A_∞[h] - 2 ∑_p ∑_{m>=1} (log p) p^{-m/2} ' +
      'Re C_h(m log p). For a shell cutoff U define the FROZEN FINITE-PRIME form ' +
      'Q_{TL,U}[h] by restricting the prime sum to m log p <= U, with tail T_U[h] = ' +
      'Q_TL[h] - Q_{TL,U}[h]. Principle 23.4 (Frozen-shell domination): a rigorous ' +
      'no-ghost certificate on a test class H_W follows from a positivity margin ' +
      'Q_{TL,U}[h] >= m_U ||h||^2 (h in H_W) and a tail bound |T_U[h]| <= eps_U ||h||^2 ' +
      'with eps_U < m_U. A global proof would require an exhaustion of the test spaces ' +
      'and UNIFORM control of the margins as U -> ∞, the windows expand, and a ↓ 0. ' +
      'This is the natural place where the ladder-freezing numerics can become ' +
      'PROOF-RELEVANT: the finite shell Q_{TL,U} is computable and interval-certifiable; ' +
      'the tail T_U is the analytic burden.',
    keyResult:
      'Principle 23.4 (Frozen-shell domination): no-ghost on H_W follows from a ' +
      'finite-shell positivity margin m_U on the FROZEN form Q_{TL,U} dominating ' +
      'the tail bound eps_U on T_U, with eps_U < m_U. Global proof needs uniform ' +
      'margins under U → ∞, W ↗, a ↓ 0.',
    kaTeXFormula:
      'Q_{\\mathrm{TL},U}[h] \\;\\geq\\; m_U\\,\\|h\\|^{2}, \\qquad \\bigl|T_U[h]\\bigr| \\;\\leq\\; \\varepsilon_U\\,\\|h\\|^{2}, \\qquad \\varepsilon_U \\;<\\; m_U \\quad (h \\in \\mathcal H_W).',
    verdict: 'finite-shell-numerics-meets-analytic-tail-burden',
  }),

  // ── §23.5 ──────────────────────────────────────────────────────────────
  s23_5: Object.freeze({
    id: '23.5',
    name: 'Can a clever freeze finish the proof?',
    paperContent:
      'The preceding facts rule out a false shortcut. A freeze can do ONE OF THREE ' +
      'things: (1) remove a KNOWN ghost by multiplying by its Blaschke factor; ' +
      '(2) move a ghost from one sector to another through a Schur complement; ' +
      '(3) certify positivity on a FINITE SUBSPACE with an explicit tail margin. ' +
      'NONE OF THESE, by itself, proves the ghost set is empty. The clever move must ' +
      'therefore be STRONGER: it must DERIVE a freeze from the completed kernel or ' +
      'prime-delay structure that is AUTOMATICALLY PASSIVE BEFORE any zero ' +
      'information is inserted. This motivates the decisive Conjecture 23.5 ' +
      '(Passive frozen-bridge closure): for every a > 0 and every finite window W ⊂ C+ ' +
      'there exists a kernel-derived frozen bridge K^pass_{a,U} such that (1) K^pass_{a,U} ' +
      'is positive definite by construction; (2) K_a - K^pass_{a,U} has rigorously bounded ' +
      'operator norm on W; (3) the positivity margin of K^pass_{a,U} dominates the residual ' +
      'uniformly under an exhaustion of W and as a ↓ 0. Then K_a ⪰ 0 for every a > 0, ' +
      'hence RH. The conjecture is NOT a restatement of RH provided K^pass_{a,U} and the ' +
      'residual bounds are constructed only from the completed kernel Phi, the gamma ' +
      'factor, and explicit prime-delay truncations. It would become CIRCULAR if the ' +
      'construction used the zero set or a pre-existing zero-free half-plane.',
    keyResult:
      'VERDICT: NO — a freeze ALONE cannot finish the proof. The three things a ' +
      'freeze can do (remove KNOWN ghosts, move ghosts via Schur, certify finite ' +
      'positivity) do not prove the ghost set is empty. The only viable path is a ' +
      'KERNEL-DERIVED, automatically-passive frozen bridge (Conjecture 23.5) whose ' +
      'construction does not use the zero set.',
    kaTeXFormula:
      'K^{\\mathrm{pass}}_{a,U} \\;\\succeq\\; 0, \\qquad \\bigl\\| K_a - K^{\\mathrm{pass}}_{a,U} \\bigr\\|_{\\mathrm{op}(W)} \\;\\to\\; 0 \\quad (U \\to \\infty,\\; W \\nearrow \\mathbb C_{+},\\; a \\downarrow 0) \\quad \\Longrightarrow \\quad K_a \\;\\succeq\\; 0 \\;\\;\\forall\\,a > 0 \\quad \\Longrightarrow \\quad \\text{RH}.',
    verdict: 'no-shortcut-but-passive-frozen-bridge-conjecture-is-the-target',
    cleverFreezeVerdict: 'NO',
    cleverFreezeVerdictExplained:
      'A freeze can remove KNOWN ghosts, can move ghosts via Schur reduction, and ' +
      'can certify positivity on finite subspaces. None of these proves the ghost ' +
      'set is empty. Conjecture 23.5 is the actual target: a passive ' +
      'frozen-bridge closure derived from the completed kernel that is automatically ' +
      'passive BEFORE any zero information is inserted, with residual bounds ' +
      'surviving the limits U → ∞, W ↗ C+, a ↓ 0.',
  }),

  // ── §23.6 ──────────────────────────────────────────────────────────────
  s23_6: Object.freeze({
    id: '23.6',
    name: 'A practical next experiment',
    paperContent:
      'The most concrete experiment suggested by Section 23 is a five-step ' +
      'pass/fail numerical protocol: (1) fix a > 0 and a rectangle W ⊂ C+; ' +
      '(2) build the shifted bridge Gram matrix G_a(Z) on a dense mesh Z ⊂ W; ' +
      '(3) build a frozen kernel / prime-shell approximation G^fr_{a,U}(Z) using ' +
      'Hermite-Gaussian or endpoint-jet bridge data; (4) certify lambda_min(G^fr_{a,U}) ' +
      'and the operator-norm bound ||G_a - G^fr_{a,U}|| by interval arithmetic; ' +
      '(5) track whether the certified NEGATIVE INDEX is zero. A nonzero index produces ' +
      'an explicit ghost witness; persistent zero index supports the no-ghost ' +
      'conjecture on that window. This converts the philosophical no-ghost statement ' +
      'into the SAME KIND of pass/fail numerical certification used earlier for ' +
      'zero-transfer windows. It is not a proof until the exhaustion and tail bounds ' +
      'are uniform, but it is the right FINITE VERSION of the proof target.',
    keyResult:
      'Practical experiment: build G_a(Z) on dense mesh Z ⊂ W ⊂ C+, build ' +
      'frozen approximation G^fr_{a,U}(Z), interval-certify lambda_min(G^fr_{a,U}) ' +
      'and ||G_a - G^fr_{a,U}||, and track whether ind_- = 0. A nonzero index ' +
      'is an explicit ghost witness; persistent zero index supports no-ghost on W.',
    kaTeXFormula:
      'Z \\subset W \\subset \\mathbb C_{+}, \\qquad G_a(Z) \\stackrel{?}{\\succ} 0 \\;\\;\\Longleftarrow\\;\\; \\lambda_{\\min}\\!\\left(G^{\\mathrm{fr}}_{a,U}(Z)\\right) \\;>\\; \\bigl\\|G_a(Z) - G^{\\mathrm{fr}}_{a,U}(Z)\\bigr\\|, \\qquad \\operatorname{ind}_{-}\\!\\left(G_a(Z)\\right) \\stackrel{?}{=} 0.',
    fiveSteps: Object.freeze([
      'Fix a > 0 and a rectangle W ⊂ C+.',
      'Build the shifted bridge Gram matrix G_a(Z) on a dense mesh Z ⊂ W.',
      'Build a frozen kernel / prime-shell approximation G^fr_{a,U}(Z) using Hermite-Gaussian or endpoint-jet bridge data.',
      'Interval-certify lambda_min(G^fr_{a,U}) and the operator-norm error ||G_a(Z) - G^fr_{a,U}(Z)||.',
      'Track the certified negative index ind_-(G_a(Z)). Nonzero = explicit ghost witness; persistent zero = no-ghost support on the window W.',
    ]),
    verdict: 'pass-fail-numerical-protocol-falsifier-ready',
  }),

  // ── §23.7 ──────────────────────────────────────────────────────────────
  s23_7: Object.freeze({
    id: '23.7',
    name: 'Conclusion of the freeze attack',
    paperContent:
      'Freezing is NOT a way to wish away the inverse-Blaschke obstruction. Properly ' +
      'used, it is an INERTIA-PRESERVING REDUCTION TOOL and a FINITE-WINDOW CERTIFICATION ' +
      'ENGINE. The next analytic step is therefore NOT merely "freeze more ladders". It ' +
      'is to find a KERNEL-DERIVED FROZEN BRIDGE whose positivity is STRUCTURAL and whose ' +
      'residual is controlled strongly enough to survive the limits U → ∞, W ↗ C+, ' +
      'a ↓ 0. If that PASSIVE FROZEN-BRIDGE CLOSURE is achieved, the no-ghost theorem ' +
      'follows and RH is proved.',
    keyResult:
      'Conclusion: the right deliverable is a passive frozen-bridge closure ' +
      'surviving U → ∞, W ↗ C+, a ↓ 0. That delivers no-ghost ⇒ RH.',
    kaTeXFormula:
      'U \\;\\to\\; \\infty, \\qquad W \\;\\nearrow\\; \\mathbb C_{+}, \\qquad a \\;\\downarrow\\; 0.',
    verdict: 'next-step-is-passive-frozen-bridge-closure-not-more-ladders',
  }),

  whyItMatters: [
    'Section 23 is the load-bearing answer to a recurring engine question: ' +
    'can we shortcut to no-ghost by being clever about WHICH things we freeze? ' +
    'The answer is NO — a freeze alone cannot prove the ghost set is empty. ' +
    'This avoids wasted engine cycles chasing freeze-based shortcuts and ' +
    'redirects effort to the actual target (Conjecture 23.5, passive ' +
    'frozen-bridge closure derived from the completed kernel).',

    'Section 23.3 (Finite-window positive certificate) and §23.6 (the 5-step ' +
    'practical experiment) supply a clean pass/fail FALSIFIER PROTOCOL: build ' +
    'a frozen approximation of the shifted bridge Gram matrix on a dense mesh, ' +
    'interval-certify lambda_min and operator-norm bounds, and track whether ' +
    'the negative index is zero. A nonzero finite-window negative index would ' +
    'be an explicit ghost witness that ends RH negatively. This converts the ' +
    'philosophical "no-ghost" hope into the SAME kind of pass/fail certification ' +
    'used for zero-transfer windows.',

    'Section 23.2 (Sylvester inertia under Schur freezing) is a safety ' +
    'principle for the whole program: a negative-index ghost mode cannot be ' +
    'destroyed by freezing, only moved. Any finite-scheme apparent ghost ' +
    'removal must account for inertia preservation. This is a tripwire for ' +
    'future "we removed the ghost!" claims — those claims must show WHERE ' +
    'the ind_- went, not just that it disappeared from the live form.',
  ],

  references: Object.freeze([
    {
      authors: ['J. Gomila'],
      year: 2026,
      title: 'Twin-Ladder Deformations of xi, Consolidated draft v52',
      venue: 'research-inputs/twin_ladder_consolidated_v52.pdf, §23 (pages 32-36)',
      role: 'primary-source',
      note:
        'Section 23 of the user paper; this file renders subsections 23.1-23.7.',
    },
    {
      authors: ['M. G. Krein', 'H. Langer'],
      year: 1977,
      title:
        'Uber die Q-Funktion eines pi-hermiteschen Operators im Raume Pi-kappa',
      venue: 'Acta Sci. Math. (Szeged) 34',
      role: 'pontryagin-negative-index-foundations',
      note:
        'Foundational reference for Pontryagin / negative-index decomposition; ' +
        'the Schur-complement inertia identity in Proposition 23.2 is the ' +
        'finite-dimensional shadow of this theory.',
    },
    {
      authors: ['H. Feshbach'],
      year: 1958,
      title: 'Unified theory of nuclear reactions',
      venue: 'Annals of Physics 5',
      role: 'schur-complement-physics-context',
      note:
        'Origin of the Schur-complement "freezing" interpretation as ' +
        'channel reduction in nuclear-physics scattering theory; underlies ' +
        'the §23.2 reading of frozen sectors.',
    },
    {
      authors: ['J. J. Sylvester'],
      year: 1852,
      title: "A demonstration of the theorem that every homogeneous quadratic polynomial",
      venue: 'Philosophical Magazine, ser. 4, 4',
      role: 'inertia-law-classical',
      note:
        "Sylvester's law of inertia under congruence — the classical fact " +
        'invoked in the proof of Proposition 23.2 (Schur-complement freezing ' +
        'preserves the negative index of a Hermitian form).',
    },
    {
      authors: ['L. de Branges'],
      year: 1968,
      title: 'Hilbert Spaces of Entire Functions',
      venue: 'Prentice-Hall, Englewood Cliffs',
      role: 'de-branges-kernel-foundations',
      note:
        'Foundational reference for the de Branges reproducing kernel K_a ' +
        'whose finite mesh restrictions appear in Lemma 23.3 and the §23.6 ' +
        'numerical protocol.',
    },
  ]),

  relatedSections: Object.freeze([
    {
      paperSection: '15',
      ticket: 'imp-1196',
      route: '/shift-bridge-positivity',
      label: 'Shift-Bridge Reflection Positivity (§15)',
      description:
        'Defines the shifted bridge (E_a, E_a^#, Theta_a, K_a), the threshold ' +
        'theorem Delta = 0 ⇔ RH, and the Godelian witness. Section 23 asks ' +
        'whether freezing can REMOVE the ghost factor identified there.',
    },
    {
      paperSection: '16',
      ticket: 'imp-1197',
      route: '/closure-routes',
      label: 'Four Equivalent Closure Routes (§16)',
      description:
        'Section 16 records four equivalent ways to close the bridge gap. ' +
        'Section 23.5 (Conjecture 23.5, passive frozen-bridge closure) is the ' +
        'natural §23 incarnation of those routes via the freezing route.',
    },
    {
      paperSection: '17',
      ticket: 'imp-1198',
      route: '/blaschke-ghosts',
      label: 'Inverse Blaschke Ghosts and the Pontryagin Decomposition (§17)',
      description:
        'Identifies each off-critical zero with an explicit inverse Blaschke ' +
        'ghost contributing a rank-one negative square. Section 23 asks ' +
        'whether freezing those ghosts can prove their absence.',
    },
    {
      paperSection: '18',
      ticket: 'imp-1199',
      route: '/three-attacks',
      label: 'Three Concrete Attack Programs (§18)',
      description:
        'Three concrete attack programs for the no-ghost target. The §23 ' +
        'verdict says freezing is a TOOL inside these attacks, not a ' +
        'standalone attack.',
    },
  ]),

  builtAt: '2026-05-26T00:00:00Z',
  byModel: 'sonnet-4-6',
  byChannel: 'subscription-worktree',
});

export default FREEZING_BRIDGE_SECTION;

// ── Build-time tripwires ──────────────────────────────────────────────────────

export const FREEZING_BRIDGE_SECTION_ASSERTIONS = [
  {
    id: 'imp1221-paper-page-range-section23',
    holds: () => {
      const r = FREEZING_BRIDGE_SECTION.paperPageRange;
      return (
        Array.isArray(r) &&
        r.length === 2 &&
        Number.isInteger(r[0]) &&
        Number.isInteger(r[1]) &&
        r[0] < r[1] &&
        r[0] >= 30 &&
        r[1] <= 40 &&
        FREEZING_BRIDGE_SECTION.paperSection === '23' &&
        typeof FREEZING_BRIDGE_SECTION.paperSource === 'string' &&
        FREEZING_BRIDGE_SECTION.paperSource.includes(
          'twin_ladder_consolidated_v52'
        )
      );
    },
    why:
      'Section 23 of the v52 paper lives on pages 32-36 of the body. The page ' +
      'range, the section number "23", and the paper-source filename must all ' +
      'be locked so an accidental rewrite (e.g. pointing at the wrong section ' +
      'or the wrong paper draft) is caught at build time.',
  },
  {
    id: 'imp1221-seven-subsections-present-and-well-formed',
    holds: () => {
      const expected = ['23.1', '23.2', '23.3', '23.4', '23.5', '23.6', '23.7'];
      const keys = ['s23_1', 's23_2', 's23_3', 's23_4', 's23_5', 's23_6', 's23_7'];
      for (let i = 0; i < keys.length; i++) {
        const s = FREEZING_BRIDGE_SECTION[keys[i]];
        if (!s) return false;
        if (s.id !== expected[i]) return false;
        if (typeof s.name !== 'string' || s.name.length < 10) return false;
        if (typeof s.paperContent !== 'string' || s.paperContent.length < 200) return false;
        if (typeof s.keyResult !== 'string' || s.keyResult.length < 60) return false;
        if (typeof s.kaTeXFormula !== 'string' || s.kaTeXFormula.length < 10) return false;
        if (typeof s.verdict !== 'string' || s.verdict.length < 5) return false;
      }
      return true;
    },
    why:
      'Section 23 has exactly seven subsections (23.1 through 23.7). Every ' +
      'subsection must be present with id, name, paperContent (>= 200 chars), ' +
      'keyResult (>= 60 chars), KaTeX formula, and a one-line verdict. A ' +
      'missing or stub subsection would mis-represent the paper.',
  },
  {
    id: 'imp1221-schur-complement-inertia-identity-stated',
    holds: () => {
      const s = FREEZING_BRIDGE_SECTION.s23_2;
      if (!s) return false;
      const wantBody = ['Schur', 'complement', 'inertia', 'ind_-', 'Q_eff'];
      const bodyHits = wantBody.every((token) => s.paperContent.includes(token));
      const wantLaTeX = ['Q_{\\mathrm{eff}}', 'C^{-1}', '\\operatorname{ind}'];
      const latexHits = wantLaTeX.every((token) => s.kaTeXFormula.includes(token));
      return (
        bodyHits &&
        latexHits &&
        s.verdict.includes('inertia') &&
        s.keyResult.includes('Q_eff')
      );
    },
    why:
      'Proposition 23.2 (Schur-complement freezing preserves negative index) is ' +
      'the structural safety principle of Section 23: a ghost mode cannot be ' +
      'destroyed by freezing, only moved. The paperContent must name the ' +
      'Schur complement, ind_-, and Q_eff; the KaTeX formula must include the ' +
      'Q_eff = A - B C^{-1} B^* definition.',
  },
  {
    id: 'imp1221-endpoint-bridge-finite-window-certificate-stated',
    holds: () => {
      const s = FREEZING_BRIDGE_SECTION.s23_3;
      if (!s) return false;
      const wantBody = [
        'Lemma 23.3',
        'lambda_min',
        'G^fr_{a,U}',
        'positive definite',
      ];
      const bodyHits = wantBody.every((tok) => s.paperContent.includes(tok));
      const wantLaTeX = ['\\lambda_{\\min}', 'G^{\\mathrm{fr}}_{a,U}', '\\succ'];
      const latexHits = wantLaTeX.every((tok) => s.kaTeXFormula.includes(tok));
      return bodyHits && latexHits;
    },
    why:
      'Lemma 23.3 is the falsifier engine of Section 23: a finite-window ' +
      'positive certificate from lambda_min(G^fr_{a,U}) > ||E_{a,U}||_2. The ' +
      'paperContent must name Lemma 23.3, lambda_min, and the frozen Gram ' +
      'G^fr_{a,U}; the KaTeX formula must include the certificate inequality ' +
      'with the right symbols.',
  },
  {
    id: 'imp1221-clever-freeze-verdict-is-no-and-conjecture-23-5-is-target',
    holds: () => {
      const s = FREEZING_BRIDGE_SECTION.s23_5;
      if (!s) return false;
      const wantBody = [
        /Conjecture 23\.5/,
        /passive/i,
        /kernel-derived/,
        /circular/i,
      ];
      const bodyHits = wantBody.every((re) => re.test(s.paperContent));
      return (
        bodyHits &&
        s.cleverFreezeVerdict === 'NO' &&
        typeof s.cleverFreezeVerdictExplained === 'string' &&
        s.cleverFreezeVerdictExplained.length >= 200 &&
        s.kaTeXFormula.includes('K^{\\mathrm{pass}}_{a,U}') &&
        s.kaTeXFormula.includes('\\text{RH}')
      );
    },
    why:
      'Section 23.5 is the load-bearing verdict of Section 23: NO, a clever ' +
      'freeze cannot finish the proof unless it is derived from the completed ' +
      'kernel and automatically passive before any zero information is ' +
      'inserted. The cleverFreezeVerdict field must be "NO", the explainer ' +
      'must be substantive (>= 200 chars), and the KaTeX formula must name ' +
      'K^pass_{a,U} and the RH conclusion.',
  },
  {
    id: 'imp1221-practical-experiment-has-five-steps',
    holds: () => {
      const s = FREEZING_BRIDGE_SECTION.s23_6;
      if (!s) return false;
      if (!Array.isArray(s.fiveSteps)) return false;
      if (s.fiveSteps.length !== 5) return false;
      return s.fiveSteps.every(
        (step) => typeof step === 'string' && step.length >= 30
      );
    },
    why:
      'Section 23.6 specifies a 5-step pass/fail experiment (fix a + W; build ' +
      'G_a(Z); build G^fr_{a,U}(Z); interval-certify lambda_min and operator ' +
      'norm; track negative index). The fiveSteps array must contain exactly ' +
      'five substantive entries (>= 30 chars each) so the protocol is ' +
      'rendered in full.',
  },
  {
    id: 'imp1221-related-sections-link-1196-1197-1198-1199',
    holds: () => {
      const rs = FREEZING_BRIDGE_SECTION.relatedSections;
      if (!Array.isArray(rs) || rs.length !== 4) return false;
      const tickets = rs.map((r) => r.ticket).sort();
      const expected = ['imp-1196', 'imp-1197', 'imp-1198', 'imp-1199'].sort();
      if (JSON.stringify(tickets) !== JSON.stringify(expected)) return false;
      const routes = rs.map((r) => r.route);
      const wantedRoutes = [
        '/shift-bridge-positivity',
        '/closure-routes',
        '/blaschke-ghosts',
        '/three-attacks',
      ];
      return (
        wantedRoutes.every((r) => routes.includes(r)) &&
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
      'Section 23 is part of the Twin-Ladder v52 cluster (§15-§18 in the ' +
      'shipped app: imp-1196 /shift-bridge-positivity, imp-1197 /closure-routes, ' +
      'imp-1198 /blaschke-ghosts, imp-1199 /three-attacks). All four sibling ' +
      'pointers must be present with non-trivial descriptions so a rename or ' +
      're-routing of any sibling page does not silently desync.',
  },
  {
    id: 'imp1221-references-min-3-with-primary-source-and-de-branges',
    holds: () => {
      const refs = FREEZING_BRIDGE_SECTION.references;
      if (!Array.isArray(refs) || refs.length < 3) return false;
      const hasPrimary = refs.some((r) => r.role === 'primary-source');
      const hasDeBranges = refs.some(
        (r) =>
          Array.isArray(r.authors) &&
          r.authors.some((a) => a.includes('de Branges'))
      );
      return (
        hasPrimary &&
        hasDeBranges &&
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
      'The reference list must include the primary-source pointer back to ' +
      'the v52 paper §23 and the de Branges 1968 foundational text for the ' +
      'K_a reproducing kernel used throughout. Minimum 3 references with a ' +
      'fully-populated record per entry.',
  },
];
