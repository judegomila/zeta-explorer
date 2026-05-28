// @module data/hidden-square-program-section
// imp-1219: structured record of §25 + §26 + §27 of the user's paper at
// research-inputs/twin_ladder_consolidated_v52.pdf — the "hidden-square
// program" chain of reductions from off-diagonal commutator → measure
// domination → endpoint-Hankel Volterra contraction.
//
// PURPOSE
// -------
// These three sections form ONE logical attack program against the no-ghost
// theorem (Conj 17.3 / Ka ⪰ 0 for every a > 0). Each section reduces the
// previous obstruction to a tighter, more numerically-tractable statement:
//
//   §25 (commutator):  K_a = K_a^diag + (off-diagonal shear) — diagonal
//                      passive channel is positive; off-diagonal shear is
//                      the exact obstruction. Hidden-square target stated.
//   §26 (measure dom): reduce shear to a SCALAR measure-domination
//                      inequality µ^pass_{a,Φ} ≥ ν_{a,Φ}.
//   §27 (endpoint-Hankel): replace scalar domination with the sharper
//                      block-positivity / Volterra-contraction target.
//
// The chain forms the ACTUAL computational program — every step is
// numerically checkable via finite-window certificates, and the final
// endpoint-Hankel Volterra contraction is the concrete target for a
// rigorous proof.

export const HIDDEN_SQUARE_PROGRAM_SECTION = Object.freeze({
  id: 'hidden-square-program-section',
  ticket: 'imp-1219',
  paperSourcePath: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  paperSections: '§25 + §26 + §27',
  paperPageRange: '37-51',
  generatedAt: '2026-05-28T16:50:00Z',

  title: 'The Hidden-Square Program (§25–27)',
  oneLine:
    'Three sequential reductions of the no-ghost obstruction: commutator → ' +
    'measure domination → endpoint-Hankel Volterra contraction.',

  // ── §25 Off-Diagonal Commutator and the Hidden-Square Attempt ──────────
  commutator: Object.freeze({
    sectionId: '§25',
    title: 'Off-Diagonal Commutator and the Hidden-Square Attempt',
    pages: '37-42',
    setup: 'X(w) = ξ(1/2 + w); E_a(z) = X(a − iz); E_a^#(z) = X(−a − iz)',
    kernel: 'K_a(w, z) = (E_a(z) E_a(w̄) − E_a^#(z) E_a^#(w̄)) / (2πi (w̄ − z))',
    cosineSineDecomposition: Object.freeze({
      A_a: 'A_a(z) := ∫_0^∞ Φ(u) cosh(au) cos(zu) du',
      B_a: 'B_a(z) := ∫_0^∞ Φ(u) sinh(au) sin(zu) du',
      E_a: 'E_a(z) = A_a(z) − i B_a(z), E_a^#(z) = A_a(z) + i B_a(z)',
    }),
    wronskianForm: 'K_a(w, z) = (A_a(z) B_a(w̄) − B_a(z) A_a(w̄)) / (π (w̄ − z))',
    commutatorIntegrand:
      'C_a(w, z; u, v) = cosh(au) sinh(av) cos(zu) sin(w̄v) − sinh(au) cosh(av) sin(zu) cos(w̄v)',
    diagonalPassiveChannel:
      'K_a^diag is the strict diagonal u = v part of the double integral; positive by construction',
    offDiagonalObstruction:
      'The u ≠ v part of the double integral is the off-diagonal shear: the exact obstruction to K_a ⪰ 0',
    keyConjecture25_2:
      'Conjecture 25.2 (Off-diagonal absorption / hidden square): For every a > 0 there exist a positive ' +
      'measure space (Ω_a, dν_a) and functions Ψ_a(z, ω), constructed DIRECTLY from the completed Riemann ' +
      'kernel Φ, such that K_a(w, z) = ∫_{Ω_a} Ψ_a(z, ω) Ψ_a(w̄, ω) dν_a(ω). Equivalent to no-ghost theorem.',
    keyConjecture25_3:
      'Conjecture 25.3 (Triangular commutator absorption): There exists a Volterra/triangular transform T_a ' +
      'on the kernel variable such that K_a = T_a^* K_a^diag T_a + L_a^* L_a, with L_a a positive residual.',
    finiteWindowConsequence:
      'Practical: pick test set Z = {z_1, ..., z_N} ⊂ ℂ+, build matrices G_a(Z), G_a^diag(Z). The condition ' +
      'λ_min(G_a^pass_{U}(Z)) > ‖G_a(Z) − G_a^pass_{U}(Z)‖_2 gives a finite-window no-ghost CERTIFICATE.',
    verdict:
      'Identifies positive diagonal passive channel + isolates off-diagonal shear as the exact obstruction. ' +
      'Not yet RH — the symmetry argument that would close the hidden square is missing (§25.5).',
  }),

  // ── §26 Measure Domination and Volterra Absorption ────────────────────
  measureDomination: Object.freeze({
    sectionId: '§26',
    title: 'Measure Domination and Volterra Absorption of the Off-Diagonal Shear',
    pages: '42-47',
    diagonalChannelKernel:
      'K_a^diag(w, z) = (1/(2π)) ∫_0^∞ Φ(u)² sinh(2au) sin((w̄−z)u)/(w̄−z) du',
    quadraticFormFactorization:
      '⟨c, K_a^diag(Z) c⟩ = ∫_0^∞ P_{Z,c}(τ) dµ_{a,Φ}^diag(τ),  P_{Z,c}(t) = (1/2)(|F_+|² + |F_−|²)',
    diagonalMeasureDensity:
      'dµ_{a,Φ}^diag/dτ = (1/(2π)) ∫_τ^∞ Φ(u)² sinh(2au) du',
    scalarDominationTarget:
      'Sufficient condition for K_a ⪰ 0: µ_{a,Φ}^pass ≥ ν_{a,Φ} as positive measures, where ν_{a,Φ} is the ' +
      'shear-control measure derived from the off-diagonal part.',
    keyConjecture26_3:
      'Conjecture 26.3 (Scalar bridge-domination): For every a > 0 there exists a positive passive core ' +
      'measure µ_{a,Φ}^pass — obtained from diagonal AND near-diagonal parts of the completed Riemann ' +
      'kernel — such that µ_{a,Φ}^pass ≥ ν_{a,Φ}. If this holds, K_a ⪰ 0 for every a > 0 and no-ghost follows.',
    keyConjecture26_4:
      'Conjecture 26.4 (Volterra absorption): For each a > 0, the off-diagonal shear of the shifted bridge ' +
      'is absorbed by a Volterra/triangular transform of the diagonal channel.',
    structuralReduction:
      'The hidden-square problem is reduced to a SCALAR measure-domination problem over the positive channel P_{Z,c}. ' +
      'This is a 1D Stieltjes-style comparison — much more tractable than a 2D operator-kernel positivity question.',
    verdict:
      'Crucial reduction: the no-ghost theorem becomes a scalar measure-comparison inequality. The ' +
      'remaining work is to construct µ_{a,Φ}^pass explicitly and verify the domination.',
  }),

  // ── §27 Endpoint-Hankel Renormalization ───────────────────────────────
  endpointHankel: Object.freeze({
    sectionId: '§27',
    title: 'Endpoint-Hankel Renormalization and the Volterra-Contraction Target',
    pages: '47-51',
    shearMeasureDensity:
      'ν_{a,Φ} is the pushforward of the positive density Φ(u) Φ(v) sinh(a(v−u)) 1_{u≤τ≤v} through intervals [u, v]',
    volterraHankelStructure:
      'Volterra–Hankel object: one variable lives in the past endpoint interval [0, τ], the other lives in ' +
      'the future tail [τ, ∞). Past–future block structure.',
    whyRawDiagonalCannotDominate:
      'The raw diagonal measure µ_{a,Φ}^diag cannot dominate ν_{a,Φ} pointwise because the shear has ' +
      'mass that lives BETWEEN past and future endpoints — invisible to a diagonal-only measure.',
    endpointBridgeNecessity:
      'A KERNEL-SIDE endpoint bridge is required: the past-tail and future-tail contributions must be ' +
      'individually renormalized before any domination can hold.',
    blockPositivityFormulation:
      'Hidden-square problem ⇔ block positivity [[I, V_{a,Φ}], [V_{a,Φ}^*, I]] ⪰ 0, where V_{a,Φ} is the ' +
      'past–future Volterra operator built from Φ and sinh(a·).',
    keyConjecture27_2:
      'Conjecture 27.2 (Endpoint-Hankel Volterra contraction): For every a > 0, the off-diagonal bridge ' +
      'shear operator V_{a,Φ} satisfies ‖V_{a,Φ}‖ ≤ 1 (operator norm in L²([0, ∞))). Equivalent to the ' +
      'block-positivity condition, hence equivalent to K_a ⪰ 0.',
    finiteWindowDiagnostic:
      'For each finite window U, build the truncated V_{a,Φ,U} on L²([0, U]) and compute its operator norm. ' +
      'Conjecture 27.2 predicts ‖V_{a,Φ,U}‖ ↗ 1 as U → ∞ but never exceeds 1. Numerical verification at ' +
      'increasing U is a concrete test of the chain of reductions.',
    verdict:
      'The CONCRETE COMPUTATIONAL TARGET. Three reductions in: a single operator-norm bound on a ' +
      'Volterra-Hankel operator is the entire content of no-ghost = RH. Numerically tractable; ' +
      'the rigorous proof is the remaining research-grade work.',
  }),

  // ── Synthesis: the chain of reductions ────────────────────────────────
  chainOfReductions: Object.freeze({
    line1: '§17 no-ghost theorem: K_a ⪰ 0 for every a > 0',
    line2: '§25 ↓ commutator decomposition: K_a = K_a^diag + (off-diagonal shear), K_a^diag ⪰ 0 by construction',
    line3: '§25 ↓ hidden-square target (Conj 25.2 / 25.3): factor K_a = ∫ Ψ Ψ̄ dν via Φ alone',
    line4: '§26 ↓ scalar measure domination (Conj 26.3): µ_{a,Φ}^pass ≥ ν_{a,Φ}',
    line5: '§27 ↓ block positivity / Volterra contraction (Conj 27.2): ‖V_{a,Φ}‖ ≤ 1 in L²',
    line6: 'Concrete numerical test: truncated operator norm at finite window',
  }),

  // ── Implications for the wider proof program ─────────────────────────
  implicationsForRH: Object.freeze({
    twinLadderConnection:
      'Conjecture 25.2 IS the hidden-square form of Route C from §16 (closure-routes). The hidden-square ' +
      'program is the explicit reduction of Route C to a concrete operator-theoretic target.',
    sharedPCCObstruction:
      'Per imp-1184: even after the three reductions, the off-diagonal shear of V_{a,Φ} ultimately involves ' +
      'pair-correlation structure of Riemann zeros (via Φ). Without Montgomery PCC, even the operator-norm ' +
      'bound is conditional. Same 50-year obstruction.',
    whatThisGives:
      'A CONCRETE NUMERICAL PROGRAM where every step is finite-window certifiable. Even without closing ' +
      'PCC, the truncated V_{a,Φ,U} operator norm can be measured on real Riemann-zero data, giving ' +
      'empirical evidence for the no-ghost conjecture at finite scale (analogous to imp-1162 / 1166 / 1183 ' +
      'for the lin-stat universality).',
    futureExperiment:
      'imp-1219-sub-volterra-norm-pilot: implement the truncated V_{a,Φ,U} operator on the imp-1162 grid, ' +
      'compute the operator norm for a ∈ {0.5, 0.2, 0.1, 0.05, 0.025}, verify ‖V‖ ≤ 1 empirically across ' +
      'the regime that exposed the §S adaptive refinement barrier.',
  }),

  references: Object.freeze({
    paper: 'research-inputs/twin_ladder_consolidated_v52.pdf §25-27',
    closureRoutes: 'src/data/closure-routes-section.js (imp-1197) — §16 four closure routes',
    blaschkeGhosts: 'src/data/blaschke-ghosts-section.js (imp-1198) — §17 no-ghost statement',
    freezingBridge: 'src/data/freezing-bridge-section.js (imp-1221) — §23 freezing approach',
    deBranges: 'L. de Branges, Hilbert Spaces of Entire Functions (1968) — kernel positivity foundations',
    volterra: 'Volterra-type operators; see Halmos, Hilbert Space Problem Book',
  }),
});

export const HIDDEN_SQUARE_PROGRAM_SECTION_ASSERTIONS = [
  {
    id: 'imp1219-paper-source-path-correct',
    why: 'The paper-source-path field must point at the actual PDF in research-inputs/.',
    holds: () => HIDDEN_SQUARE_PROGRAM_SECTION.paperSourcePath === 'research-inputs/twin_ladder_consolidated_v52.pdf',
  },
  {
    id: 'imp1219-three-sections-covered',
    why: 'Page combines §25 + §26 + §27 — all three sub-records must be present and non-empty.',
    holds: () => {
      const r = HIDDEN_SQUARE_PROGRAM_SECTION;
      return r.commutator.sectionId === '§25' &&
             r.measureDomination.sectionId === '§26' &&
             r.endpointHankel.sectionId === '§27';
    },
  },
  {
    id: 'imp1219-key-conjectures-named',
    why: 'The 5 load-bearing conjectures from the three sections (25.2, 25.3, 26.3, 26.4, 27.2) must be ' +
         'cited so the reader can trace each reduction step to its named claim.',
    holds: () => {
      const r = HIDDEN_SQUARE_PROGRAM_SECTION;
      return r.commutator.keyConjecture25_2.includes('25.2') &&
             r.commutator.keyConjecture25_3.includes('25.3') &&
             r.measureDomination.keyConjecture26_3.includes('26.3') &&
             r.measureDomination.keyConjecture26_4.includes('26.4') &&
             r.endpointHankel.keyConjecture27_2.includes('27.2');
    },
  },
  {
    id: 'imp1219-chain-of-reductions-six-lines',
    why: 'The chain-of-reductions synthesis paragraph must have all 6 lines (no-ghost → commutator → ' +
         'hidden-square → scalar domination → block positivity → numerical test). Missing any line ' +
         'breaks the pedagogical narrative.',
    holds: () => {
      const c = HIDDEN_SQUARE_PROGRAM_SECTION.chainOfReductions;
      const lines = ['line1', 'line2', 'line3', 'line4', 'line5', 'line6'];
      return lines.every((k) => c[k] && c[k].length > 20);
    },
  },
  {
    id: 'imp1219-final-target-is-volterra-norm',
    why: 'The §27 endpoint-Hankel verdict must identify the concrete computational target as a single ' +
         'operator-norm bound (‖V_{a,Φ}‖ ≤ 1). This is the actual numerical test that ties §25-27 to ' +
         'finite-window verification.',
    holds: () => {
      const v = HIDDEN_SQUARE_PROGRAM_SECTION.endpointHankel.keyConjecture27_2;
      return v.includes('V_{a,Φ}') && v.includes('1');
    },
  },
  {
    id: 'imp1219-twin-ladder-connection-named',
    why: 'The page must explicitly link Conj 25.2 to Route C of §16 (closure-routes) so readers see how ' +
         'the hidden-square program slots into the four-route framework.',
    holds: () => HIDDEN_SQUARE_PROGRAM_SECTION.implicationsForRH.twinLadderConnection.includes('Route C'),
  },
  {
    id: 'imp1219-shared-pcc-obstruction-honest',
    why: 'Per imp-1184: all live ESY-closure routes share Montgomery PCC. The hidden-square chain does ' +
         'not bypass this obstruction. Honest scope MUST surface this so readers don\'t mistake the ' +
         'chain of reductions for an unconditional path.',
    holds: () => {
      const i = HIDDEN_SQUARE_PROGRAM_SECTION.implicationsForRH.sharedPCCObstruction;
      return i.includes('PCC') && i.includes('imp-1184');
    },
  },
  {
    id: 'imp1219-future-experiment-named',
    why: 'A concrete follow-up ticket (imp-1219-sub-volterra-norm-pilot) must be named so the reader has ' +
         'an actionable next step from the page.',
    holds: () => HIDDEN_SQUARE_PROGRAM_SECTION.implicationsForRH.futureExperiment.includes('volterra-norm-pilot'),
  },
];
