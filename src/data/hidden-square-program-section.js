// @module data/hidden-square-program-section
// imp-1219: structured record of §25 + §26 + §27 of the user's paper at
// research-inputs/twin_ladder_consolidated_v52.pdf — the "hidden-square
// program" chain of reductions from off-diagonal commutator → measure
// domination → endpoint-Hankel Volterra contraction.
//
// HISTORICAL SCOPE
// ----------------
// This record preserves the May 28 §25–27 proposal and its conjecture names.
// The June 18 verdict withdraws the bare Volterra contraction as a reduction;
// it takes precedence over the historical chain and pilot descriptions below.
// Finite algebraic identities survive, but an arithmetic identification with
// the abstract positive block operator is not supplied by the norm bound.

export const HIDDEN_SQUARE_PROGRAM_SECTION = Object.freeze({
  id: 'hidden-square-program-section',
  ticket: 'imp-1219',
  paperSourcePath: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  paperSections: '§25 + §26 + §27',
  paperPageRange: '37-51',
  generatedAt: '2026-05-28T16:50:00Z',
  currentStatus: Object.freeze({
    status: 'WITHDRAWN-AS-A-REDUCTION',
    effectiveDate: '2026-06-18',
    reference: 'section26-verdict-volterra-not-a-reduction-2026-06-18',
    notice: 'The May 28 bare-Volterra reduction was withdrawn on 2026-06-18. ' +
      'Historical Conj 27.2 and its finite norm pilot are not current evidence for arithmetic kernel positivity.',
  }),
  relativePositivity: Object.freeze({
    scope: 'Finite Hermitian K = P + S, with P positive definite and S Hermitian.',
    definitionMath: 'R=P^{-1/2}SP^{-1/2},\\qquad K=P^{1/2}(I+R)P^{1/2}',
    criterionMath: 'K\\succeq0\\quad\\iff\\quad I+R\\succeq0',
    normStatus: 'The bound ||R|| <= 1 is sufficient, not necessary in general.',
    counterexample: Object.freeze({ passive: 1, shear: 2, kernel: 3, relative: 2 }),
    counterexampleMath: 'P=1,\\quad S=2:\\quad K=3>0,\\quad R=2,\\quad\\|R\\|=2>1',
    specialCase: 'Norm at most one is equivalent only with additional structure, such as a proved ' +
      'symmetric spectrum of R or the normalized off-diagonal block [[I,V],[V*,I]].',
    limitations: 'This finite criterion does not identify the arithmetic kernel with that block. ' +
      'Semidefinite passive cores and infinite operators require separate compatibility and domain hypotheses.',
  }),

  title: 'The Hidden-Square Program (§25–27)',
  oneLine:
    'Historical May 28 proposal, withdrawn as a reduction on June 18: commutator → ' +
    'measure domination → endpoint-Hankel Volterra contraction.',

  // ── §25 Off-Diagonal Commutator and the Hidden-Square Attempt ──────────
  commutator: Object.freeze({
    sectionId: '§25',
    title: 'Off-Diagonal Commutator and the Hidden-Square Attempt',
    pages: '37-42',
    setup: 'X(w) = ξ(1/2 + w); E_a(z) = X(a − iz); E_a^#(z) = X(−a − iz)',
    kernel: 'K_a(w, z) = (E_a(z) E_a^#(w̄) − E_a^#(z) E_a(w̄)) / (2πi (w̄ − z))',
    cosineSineDecomposition: Object.freeze({
      A_a: 'A_a(z) := ∫_0^∞ Φ(u) cosh(au) cos(zu) du',
      B_a: 'B_a(z) := ∫_0^∞ Φ(u) sinh(au) sin(zu) du',
      E_a: 'E_a(z) = A_a(z) − i B_a(z), E_a^#(z) = A_a(z) + i B_a(z)',
    }),
    wronskianForm: 'K_a(w, z) = (A_a(z) B_a(w̄) − B_a(z) A_a(w̄)) / (π (w̄ − z))',
    kernelWronskianVerification:
      'imp-2840 audit: substituting E_a = A_a − iB_a and E_a^# = A_a + iB_a into the kernel numerator ' +
      'E_a(z)E_a^#(w̄) − E_a^#(z)E_a(w̄) (l.45/kernel) expands to the ANTISYMMETRIC de Branges Wronskian ' +
      '2i(A_a(z)B_a(w̄) − B_a(z)A_a(w̄)); dividing by 2πi(w̄−z) yields EXACTLY wronskianForm (l.51), so the ' +
      'two are algebraically consistent. The SYMMETRIC −2i(A_a(z)B_a(w̄) + B_a(z)A_a(w̄)) arises ONLY from ' +
      'the WRONG same-type pairing E_a(z)E_a(w̄) − E_a^#(z)E_a^#(w̄); the cross-pairing written here is the ' +
      'correct one. This REFUTES the imp-1265 dismissal of the sign as a cosmetic convention: the ' +
      'antisymmetry is load-bearing — a symmetric numerator would make K_a Hermitian-indefinite and break ' +
      'the no-ghost positivity target. (section27-identity-refutation, imp-1265, imp-2840.)',
    commutatorIntegrand:
      'C_a(w, z; u, v) = cosh(au) sinh(av) cos(zu) sin(w̄v) − sinh(au) cosh(av) sin(zu) cos(w̄v)',
    diagonalPassiveChannel:
      'The strict diagonal u=v has zero du dv measure. The displayed one-dimensional K_a^diag is a separately defined positive comparison kernel, not a nonzero part of the original double integral.',
    offDiagonalObstruction:
      'Deleting u=v leaves the full double integral unchanged. For a comparison kernel P, derive the signed residual S=K_a-P separately.',
    keyConjecture25_2:
      'Conjecture 25.2 (Off-diagonal absorption / hidden square): For every a > 0 there exist a positive ' +
      'measure space (Ω_a, dν_a) and functions Ψ_a(z, ω), constructed DIRECTLY from the completed Riemann ' +
      'kernel Φ, such that K_a(w, z) = ∫_{Ω_a} Ψ_a(z, ω) Ψ_a(w̄, ω) dν_a(ω). Equivalent to no-ghost theorem.',
    keyConjecture25_3:
      'Conjecture 25.3 (historical): an identity K_a=T_a^* P T_a+L_a^*L_a would suffice if proved with a separately defined P and controlled domains. The continuum-diagonal argument does not supply it.',
    finiteWindowConsequence:
      'For a rigorously enclosed finite Gram matrix G=P+S with P positive, lambda_min(P)>||S|| certifies that matrix only. All points, windows, and shifts still require coverage.',
    verdict:
      'The Wronskian identity survives. The claimed nonzero strict-diagonal channel does not. A hidden-square representation remains an open positivity target.',
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
      'A measure inequality µ_{a,Φ}^pass ≥ ν_{a,Φ} is sufficient only after proving that these measures control the exact signed residual. That derivation is not supplied by a strict-diagonal split.',
    keyConjecture26_3:
      'Conjecture 26.3 (historical scalar domination): a comparison-measure inequality is useful only after a valid bound on the exact signed residual is derived. Strict-diagonal mass cannot supply the passive core.',
    keyConjecture26_4:
      'Conjecture 26.4 (historical): Volterra absorption relative to a separately constructed positive comparison kernel is unproved.',
    structuralReduction:
      'The displayed one-dimensional kernel and measure define a comparison object. They do not establish a reduction of the two-dimensional kernel to scalar domination.',
    verdict:
      'Open comparison proposal: prove the exact residual identity and its domination before using a scalar inequality as an RH step.',
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
      'The strict diagonal has zero product measure. A separately defined comparison measure has no automatic domination relation to the exact residual.',
    endpointBridgeNecessity:
      'An endpoint bridge must retain the signed terms of the exact kernel. This audit does not prove every valid approach needs this construction.',
    blockPositivityFormulation:
      'Historical May 28 claim (withdrawn as a reduction on 2026-06-18): hidden-square problem ⇔ ' +
      'block positivity [[I, V_{a,Φ}], [V_{a,Φ}^*, I]] ⪰ 0, where V_{a,Φ} is the ' +
      'past–future Volterra operator built from Φ and sinh(a·).',
    keyConjecture27_2:
      'Historical Conjecture 27.2 (May 28; withdrawn as a reduction on 2026-06-18): For every a > 0, ' +
      'the off-diagonal bridge ' +
      'shear operator V_{a,Φ} satisfies ‖V_{a,Φ}‖ ≤ 1 (operator norm in L²([0, ∞))). Equivalent to the ' +
      'block-positivity condition, hence equivalent to K_a ⪰ 0.',
    finiteWindowDiagnostic:
      'For each finite window U, build the truncated V_{a,Φ,U} on L²([0, U]) and compute its operator norm. ' +
      'CAVEAT (section26-verdict-volterra-not-a-reduction-2026-06-18): the bare ‖V_{a,Φ,U}‖ is scale-' +
      'miscalibrated (‖V‖ ~ c² with c silently absorbing Φ’s super-exponentially-small scale), so the ' +
      'imp-1240 “5000× below 1” margin measures the WRONG object and is NOT empirical evidence for ' +
      'Conj 27.2. The ‖V‖≤1 finite-window number is a diagnostic of a refuted biconditional, not a test ' +
      'of the chain of reductions.',
    verdict:
      'REFUTED AS A REDUCTION (section26-verdict-volterra-not-a-reduction-2026-06-18, 2026-06-18). ' +
      'The claimed biconditional ‖V_{a,Φ}‖ ≤ 1 ⇔ K_a ⪰ 0 is FALSE: at the genuine Riemann Φ the two ' +
      'positivity conditions PROVABLY DECOUPLE, and the bare biconditional cannot be revived by any ' +
      'scalar normalization. So ‖V‖ ≤ 1 is NOT the entire content of no-ghost = RH. The appropriate ' +
      'finite relative-positivity criterion is K = P + S ⪰ 0 iff I + R ⪰ 0, for P > 0, S = S* and ' +
      'R = P^(−1/2) S P^(−1/2). The norm bound ||R|| <= 1 is sufficient, not generally necessary ' +
      '(P=1, S=2 gives K=3 and ||R||=2). A norm biconditional requires separately proved symmetric-spectrum ' +
      'or off-diagonal block structure; it is not an established arithmetic identification. ' +
      'Historical June 18 benchmark citation: Platt–Trudgian Λ ≤ 0.2; no new current bound is asserted here.',
  }),

  // ── Historical synthesis: withdrawn chain of reductions ────────────────────────────────
  chainOfReductions: Object.freeze({
    line1: 'Historical May 28 proposal (withdrawn June 18): §17 no-ghost theorem: K_a ⪰ 0 for every a > 0',
    line2: 'Historical May 28 proposal (withdrawn June 18): §25 ↓ commutator decomposition: K_a = K_a^diag + (off-diagonal shear), K_a^diag ⪰ 0 by construction',
    line3: 'Historical May 28 proposal (withdrawn June 18): §25 ↓ hidden-square target (Conj 25.2 / 25.3): factor K_a = ∫ Ψ Ψ̄ dν via Φ alone',
    line4: 'Historical May 28 proposal (withdrawn June 18): §26 ↓ scalar measure domination (Conj 26.3): µ_{a,Φ}^pass ≥ ν_{a,Φ}',
    line5: 'Historical May 28 proposal (withdrawn June 18): §27 ↓ block positivity / Volterra contraction (Conj 27.2): ‖V_{a,Φ}‖ ≤ 1 in L²',
    line6: 'Historical May 28 proposal (withdrawn June 18): Concrete numerical test: truncated operator norm at finite window',
  }),

  // ── Implications for the wider proof program ─────────────────────────
  implicationsForRH: Object.freeze({
    currentVerdict: 'Withdrawn as a reduction on 2026-06-18. The bare Volterra norm is not an established ' +
      'equivalent criterion for arithmetic kernel positivity.',
    finiteEvidence: 'The historical imp-1219-sub-volterra-norm-pilot is a diagnostic of the withdrawn ' +
      'proposal, not empirical evidence for no-ghost. The separate finite-Gram package retains its own finite-only scope.',
    remainingQuestion: 'A correctly normalized arithmetic factorization or comparison remains to be constructed. ' +
      'The valid abstract block norm criterion alone supplies no such identification.',
    historicalContext: 'The May 28 Route C and imp-1184 PCC discussion is preserved in the historical record as ' +
      'program context, not as a proved prerequisite or surviving reduction.',
  }),

  historicalImplicationsForRH: Object.freeze({
    twinLadderConnection:
      'Conjecture 25.2 is the hidden-square target of Route C. It remains a positivity objective; the proposed intermediate reductions are not established.',
    sharedPCCObstruction:
      'The imp-1184 PCC claim is route-specific. No result here proves Montgomery PCC is a prerequisite for the exact arithmetic positivity program.',
    whatThisGives:
      'A separation of the exact kernel, comparison proposals, and finite-matrix diagnostics. A small bare Volterra norm does not certify the RH target.',
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
    id: 'imp2840-kernel-numerator-is-antisymmetric-wronskian',
    why: 'imp-2840: the §25 kernel numerator E_a(z)E_a^#(w̄) − E_a^#(z)E_a(w̄) (kernel field) must expand ' +
         'to the ANTISYMMETRIC Wronskian 2i(A_a(z)B_a(w̄) − B_a(z)A_a(w̄)), reducing to wronskianForm after ' +
         'dividing by 2πi(w̄−z) — NOT the symmetric −2i(AB+BA) that the (false) imp-1265 cosmetic-sign ' +
         'dismissal would tolerate. Numerically certifies the kernel and wronskianForm fields are consistent.',
    holds: () => {
      // A_a(z), B_a(z), A_a(w̄), B_a(w̄) are free; the numerator identity is bilinear so reals certify it.
      const Az = 1.3, Bz = 0.7, Aw = 0.4, Bw = 2.1;
      const mul = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
      const sub = (a, b) => ({ re: a.re - b.re, im: a.im - b.im });
      const Ez = { re: Az, im: -Bz };       // E_a(z)
      const EzSharp = { re: Az, im: Bz };    // E_a^#(z)
      const Ew = { re: Aw, im: -Bw };        // E_a(w̄)
      const EwSharp = { re: Aw, im: Bw };    // E_a^#(w̄)
      const numerator = sub(mul(Ez, EwSharp), mul(EzSharp, Ew));
      const antisymmetric = { re: 0, im: 2 * (Az * Bw - Bz * Aw) };
      const symmetric = { re: 0, im: -2 * (Az * Bw + Bz * Aw) };
      const close = (a, b) => Math.abs(a.re - b.re) < 1e-12 && Math.abs(a.im - b.im) < 1e-12;
      const eq = HIDDEN_SQUARE_PROGRAM_SECTION.commutator;
      return close(numerator, antisymmetric) &&
             !close(numerator, symmetric) &&
             eq.kernelWronskianVerification.includes('imp-1265') &&
             eq.wronskianForm.includes('A_a(z) B_a(w̄) − B_a(z) A_a(w̄)');
    },
  },
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
    why: 'The historical chain-of-reductions synthesis must retain all 6 lines (no-ghost → commutator → ' +
         'hidden-square → scalar domination → block positivity → numerical test). Missing any line ' +
         'breaks the pedagogical narrative.',
    holds: () => {
      const c = HIDDEN_SQUARE_PROGRAM_SECTION.chainOfReductions;
      const lines = ['line1', 'line2', 'line3', 'line4', 'line5', 'line6'];
      return lines.every((k) => c[k] && c[k].length > 20);
    },
  },
  {
    id: 'imp1219-volterra-target-is-historical',
    why: 'Retain the historical operator-norm conjecture while making the June 18 withdrawal explicit.',
    holds: () => {
      const v = HIDDEN_SQUARE_PROGRAM_SECTION.endpointHankel.keyConjecture27_2;
      return v.includes('V_{a,Φ}') && v.includes('1') && v.includes('withdrawn') && v.includes('2026-06-18');
    },
  },
  {
    id: 'imp1219-twin-ladder-connection-named',
    why: 'The page must explicitly link Conj 25.2 to Route C of §16 (closure-routes) so readers see how ' +
         'the hidden-square program slots into the four-route framework.',
    holds: () => HIDDEN_SQUARE_PROGRAM_SECTION.historicalImplicationsForRH.twinLadderConnection.includes('Route C'),
  },
  {
    id: 'imp1219-shared-pcc-obstruction-honest',
    why: 'Preserve the dated imp-1184 PCC discussion as historical context, not a proved current prerequisite.',
    holds: () => {
      const i = HIDDEN_SQUARE_PROGRAM_SECTION.historicalImplicationsForRH.sharedPCCObstruction;
      return i.includes('PCC') && i.includes('imp-1184');
    },
  },
  {
    id: 'imp1219-future-experiment-named',
    why: 'Preserve the historical imp-1219-sub-volterra-norm-pilot identifier without promoting its old verdict.',
    holds: () => HIDDEN_SQUARE_PROGRAM_SECTION.historicalImplicationsForRH.futureExperiment.includes('volterra-norm-pilot'),
  },
  {
    id: 'hidden-square-current-withdrawal-precedes-history',
    why: 'A historical norm pilot must not override the later withdrawal.',
    holds: () => HIDDEN_SQUARE_PROGRAM_SECTION.currentStatus.status === 'WITHDRAWN-AS-A-REDUCTION' &&
      HIDDEN_SQUARE_PROGRAM_SECTION.currentStatus.effectiveDate === '2026-06-18',
  },
  {
    id: 'hidden-square-relative-norm-is-only-sufficient',
    why: 'P=1,S=2 is PSD but its normalized shear has norm2; the general criterion is I+R PSD.',
    holds: () => {
      const c = HIDDEN_SQUARE_PROGRAM_SECTION.relativePositivity.counterexample;
      return c.passive > 0 && c.kernel === c.passive + c.shear &&
        c.relative === c.shear / c.passive && c.kernel >= 0 && Math.abs(c.relative) > 1;
    },
  },
];
