// Historical §25–27 proposals, corrected 2026-09-30.
// The strict-diagonal split and bare Volterra collapse are not established reductions.
// See formalization/paper/rh-direction-audit-2026-09-30.md.

export const HIDDEN_SQUARE_PROGRAM_SECTION = Object.freeze({
  id: 'hidden-square-program-section',
  ticket: 'imp-1219',
  paperSourcePath: 'research-inputs/twin_ladder_consolidated_v52.pdf',
  paperSections: '§25 + §26 + §27',
  paperPageRange: '37-51',
  generatedAt: '2026-05-28T16:50:00Z',

  title: 'The Hidden-Square Program (§25–27)',
  oneLine: 'Historical hidden-square proposals: exact identities survive; the diagonal split and bare Volterra equivalence require correction.',

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
      'The abstract block [[I,V],[V*,I]] is positive iff ||V||<=1. Its identification with the exact K_a is an additional identity; the historical bare-operator identification was refuted.',
    keyConjecture27_2:
      'Conjecture 27.2 (historical): ||V_{a,Φ}||<=1 was proposed as equivalent to K_a>=0. That bare biconditional is refuted; a small computed norm is not evidence for RH.',
    finiteWindowDiagnostic:
      'For each finite window U, build the truncated V_{a,Φ,U} on L²([0, U]) and compute its operator norm. ' +
      'CAVEAT (section26-verdict-volterra-not-a-reduction-2026-06-18): the bare ‖V_{a,Φ,U}‖ is scale-' +
      'miscalibrated (‖V‖ ~ c² with c silently absorbing Φ’s super-exponentially-small scale), so the ' +
      'imp-1240 “5000× below 1” margin measures the WRONG object and is NOT empirical evidence for ' +
      'Conj 27.2. The ‖V‖≤1 finite-window number is a diagnostic of a refuted biconditional, not a test ' +
      'of the chain of reductions.',
    verdict:
      'For a finite matrix K=P+S with P>0, K>=0 iff I+R>=0, where R=P^(-1/2) S P^(-1/2). For a general self-adjoint residual, ||R||<=1 is sufficient, not necessary. Infinite-dimensional use needs domain control.',
  }),

  // ── Synthesis: the chain of reductions ────────────────────────────────
  chainOfReductions: Object.freeze({
    line1: '§17 target: exact K_a positive for every shift a>0',
    line2: '§25 correction: the strict diagonal has zero product measure; define a comparison P separately',
    line3: '§25 hidden-square target (25.2 / 25.3): a positive factorization is still unproved',
    line4: '§26 proposal (26.3): scalar domination needs a valid signed residual identity',
    line5: '§27 correction (27.2): bare Volterra contraction is not equivalent to exact kernel positivity',
    line6: 'Next diagnostic: replay the arithmetic certificate and retain each new prime-power contribution',
  }),

  // ── Implications for the wider proof program ─────────────────────────
  implicationsForRH: Object.freeze({
    twinLadderConnection:
      'Conjecture 25.2 is the hidden-square target of Route C. It remains a positivity objective; the proposed intermediate reductions are not established.',
    sharedPCCObstruction:
      'The imp-1184 PCC claim is route-specific. No result here proves Montgomery PCC is a prerequisite for the exact arithmetic positivity program.',
    whatThisGives:
      'A separation of the exact kernel, comparison proposals, and finite-matrix diagnostics. A small bare Volterra norm does not certify the RH target.',
    futureExperiment:
      'Retire the volterra-norm-pilot as evidence for RH. Replay the Toeplitz–Krein certificate and cross log(3) with the p=3 contribution included.',
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
    id: 'imp1219-bare-volterra-biconditional-withdrawn',
    why: 'The historical bare Volterra target must be explicitly marked refuted.',
    holds: () => {
      const v = HIDDEN_SQUARE_PROGRAM_SECTION.endpointHankel.keyConjecture27_2;
      return v.includes('V_{a,Φ}') && v.includes('refuted');
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
    why: 'The historical imp-1184 PCC statement must be scoped to its route.',
    holds: () => {
      const i = HIDDEN_SQUARE_PROGRAM_SECTION.implicationsForRH.sharedPCCObstruction;
      return i.includes('PCC') && i.includes('imp-1184');
    },
  },
  {
    id: 'imp1219-future-experiment-named',
    why: 'The next experiment follows the corrected arithmetic target.',
    holds: () => HIDDEN_SQUARE_PROGRAM_SECTION.implicationsForRH.futureExperiment.includes('p=3'),
  },
];
