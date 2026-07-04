/**
 * @module glossary
 * @fileoverview Internal glossary and wiki of every term and concept used
 * across the ZPO / RH attack project. Exports {@link glossary} (entries),
 * {@link glossaryStats}, {@link findByTerm}, and {@link findByCategory}.
 * Reference dictionary for the Glossary page; NOT part of the formal
 * proof chain. Module-doc added by imp-935.
 * @see imp-141
 */

/**
 * ZPO Math Explorer — Internal Glossary & Wiki
 *
 * imp-141: Definitions of every term and concept used in the project.
 * Serves as the backbone for understanding the full proof framework.
 */

export const glossary = [
  // ═══════════════════════════════════════════════════════════════════════
  // CORE FRAMEWORK TERMS
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'ZPO (Zeta Prime Oscillator)',
    category: 'framework',
    definition:
      'The central framework: treating each prime p as an LC resonator with impedance ' +
      'Z_p = 1/log(p), so that the cascade of all prime resonators produces ζ(s) as a ' +
      'network transfer function.',
    firstUsed: 'imp-001 (project inception)',
    relatedTerms: ['twin ladder', 'LC cascade', 'transfer matrix'],
  },
  {
    term: 'Twin Ladder',
    category: 'framework',
    definition:
      'A two-sided cascade network: direct ladder encoding ζ(s) + dual ladder encoding ζ(1-s) + ' +
      'bridge factor χ(s) coupling them. The functional equation ξ(s)=ξ(1-s) makes the bridge ' +
      'unitary on σ=½.',
    firstUsed: 'imp-004 (TwinLadderViz)',
    relatedTerms: ['direct ladder', 'dual ladder', 'bridge'],
  },
  {
    term: 'Bridge χ(s)',
    category: 'framework',
    definition:
      'The factor connecting ζ(s) and ζ(1-s): χ(s) = π^{s-½}·Γ((1-s)/2)/Γ(s/2). Satisfies ' +
      '|χ(½+it)| = 1 (bridge is lossless exactly on the critical line).',
    firstUsed: 'imp-003',
    relatedTerms: ['functional equation', 'lossless', 'twin ladder'],
  },
  {
    term: 'Transfer Matrix T_p',
    category: 'framework',
    definition:
      'The 2×2 matrix representing the p-th prime as a network section. Two embeddings: ' +
      '(A) Algebraic: T_p = [[1, p^{-s}], [p^{-s}, 1]] → S₂₁ = ζ(2s)/ζ(s); ' +
      '(B) Physical LC: T_p = [[cos θ, Z sin θ], [-sin θ/Z, cos θ]] with θ = s·log p, Z = 1/log p → ' +
      'S₂₁ = sec(ω·log P#). Both have det(T_p) = 1.',
    firstUsed: 'imp-002',
    relatedTerms: ['S-matrix', 'cascade', 'SL(2,R)', 'embedding'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // S-MATRIX CONCEPTS
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'S-matrix (scattering matrix)',
    category: 'scattering',
    definition:
      'The 2×2 matrix relating incoming and outgoing waves at the two ports of the cascade. ' +
      'For a symmetric 2-port: S = [[S₁₁, S₁₂], [S₂₁, S₂₂]] with S₁₁ = reflection, S₂₁ = transmission.',
    firstUsed: 'imp-030',
    relatedTerms: ['S₁₁', 'S₂₁', 'unitarity', 'Darlington'],
  },
  {
    term: 'S₂₁ (transmission coefficient)',
    category: 'scattering',
    definition:
      'The (2,1) entry of the scattering matrix: the amplitude transmitted from port 1 to port 2. ' +
      'For the Euler product cascade: S₂₁ = 2/(A+B+C+D) = ζ(2s)/ζ(s). ζ-zeros are POLES of S₂₁.',
    firstUsed: 'imp-121 (the 4-line induction)',
    relatedTerms: ['cascade', 'ζ(2s)/ζ(s)', 'poles', 'Darlington'],
  },
  {
    term: 'S₁₁ (reflection coefficient)',
    category: 'scattering',
    definition:
      'The (1,1) entry of the scattering matrix: amplitude reflected back to port 1. ' +
      'For the symmetric Euler cascade T_p=[[1,a],[a,1]]: S₁₁ ≡ 0 identically (perfect matching).',
    firstUsed: 'imp-130',
    relatedTerms: ['S-matrix', 'matching', 'symmetric'],
  },
  {
    term: 'Unitarity Deficit δ(P)',
    category: 'scattering',
    definition:
      'The deviation from losslessness: δ = |S₁₁|² + |S₂₁|² - 1 or ||S^T S - I||_F. ' +
      'Mertens bound: δ(P) = O(1/log P) → 0 as P → ∞ at σ=½.',
    firstUsed: 'imp-063',
    relatedTerms: ['Mertens', 'lossless', 'unitary'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MATHEMATICAL OBJECTS
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Euler Product',
    category: 'zeta',
    definition:
      'ζ(s) = Π_p (1-p^{-s})^{-1} for σ > 1 (Euler 1737). Converts a sum over integers ' +
      'to a product over primes.',
    firstUsed: 'imp-001',
    relatedTerms: ['ζ(s)', 'cascade', 'multiplicative'],
  },
  {
    term: 'Functional Equation',
    category: 'zeta',
    definition:
      'ξ(s) = ξ(1-s) where ξ(s) = ½s(s-1)π^{-s/2}Γ(s/2)ζ(s) (Riemann 1859). ' +
      'Symmetry about σ=½. Implies |χ(½+it)| = 1.',
    firstUsed: 'imp-003',
    relatedTerms: ['ξ(s)', 'χ(s)', 'σ=½', 'symmetry'],
  },
  {
    term: 'Critical Line',
    category: 'zeta',
    definition:
      'The vertical line Re(s) = σ = ½ in the complex plane. RH states all nontrivial ' +
      'ζ-zeros lie on this line.',
    firstUsed: 'imp-001',
    relatedTerms: ['RH', 'σ=½', 'lossless axis'],
  },
  {
    term: 'Primorial P#',
    category: 'number theory',
    definition:
      'The product of the first N primes: P_N# = p₁·p₂·...·p_N = 2·3·5·7·11·.... ' +
      'log(P#) = Σ log(p_k) appears in the physical cascade: S₂₁ = sec(ω·log P#).',
    firstUsed: 'imp-134',
    relatedTerms: ['primes', 'physical cascade', 'PNT'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // THEOREMS USED
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Mertens Theorems (1874)',
    category: 'theorem',
    definition:
      'Three theorems on prime sums: (1) Σ_{p≤x} log(p)/p = log x + O(1), ' +
      '(2) Σ_{p≤x} 1/p = log log x + M + O(1/log x), ' +
      '(3) Π_{p≤x}(1-1/p) = e^{-γ}/log x·(1+O(1/log x)). Unconditional (predate RH).',
    firstUsed: 'imp-063',
    relatedTerms: ['PNT', 'Rosser-Schoenfeld', 'δ(P)'],
  },
  {
    term: 'Rosser-Schoenfeld (1962)',
    category: 'theorem',
    definition:
      'Explicit constants for the Mertens theorems. M₃ ≤ 2.51012. Used in the explicit ' +
      'Mertens bound for δ(P). Unconditional.',
    firstUsed: 'imp-084',
    relatedTerms: ['Mertens', 'interval arithmetic', 'M₃'],
  },
  {
    term: 'Darlington Synthesis Theorem (1939)',
    category: 'theorem',
    definition:
      'For a lossless reciprocal 2-port network, transmission ZEROS (not poles) lie on ' +
      'the jω axis. Applies to S₂₁ zeros in circuit theory. Does NOT directly apply to ' +
      'ζ-zeros (which are POLES of the Euler product S₂₁).',
    firstUsed: 'imp-033',
    relatedTerms: ['lossless', 'transmission zeros', 'jω axis'],
  },
  {
    term: 'Lax-Phillips (1967)',
    category: 'theorem',
    definition:
      'Scattering theory: for a contraction semigroup Z(t) = P·e^{iHt}·P, the S-matrix ' +
      'POLES (resonances) lie in the lower half-plane Im(z) < 0. This is the correct tool ' +
      'for confining ζ-zeros (which are S₂₁ poles).',
    firstUsed: 'imp-034',
    relatedTerms: ['contraction semigroup', 'resonances', 'poles'],
  },
  {
    term: 'Trotter-Kato Theorem (1958)',
    category: 'theorem',
    definition:
      'If H_N → H_∞ in strong resolvent sense, then e^{iH_N t} → e^{iH_∞ t} strongly. ' +
      'Connects resolvent convergence to semigroup convergence.',
    firstUsed: 'imp-094',
    relatedTerms: ['resolvent', 'semigroup', 'strong convergence'],
  },
  {
    term: 'de Bruijn-Newman Constant Λ',
    category: 'theorem',
    definition:
      'Λ = inf{λ : Ξ_λ(x) has only real zeros}. De Bruijn (1950): Λ ≤ ½. Rodgers-Tao ' +
      '(2020): Λ ≥ 0. RH ⟺ Λ = 0.',
    firstUsed: 'imp-040',
    relatedTerms: ['heat flow', 'Rodgers-Tao', 'annealing'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PROOF STRUCTURE
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Cluster Point Argument',
    category: 'proof',
    definition:
      'Topological argument (imp-103): δ(S_N) → 0 means cluster points of {S_N} lie in O(2). ' +
      'Combined with det(S_N) = 1: cluster points in SO(2). Bypasses summability of ||S_{N+1}-S_N||.',
    firstUsed: 'imp-103',
    relatedTerms: ['topology', 'Bolzano-Weierstrass', 'SO(2)'],
  },
  {
    term: 'Embedding A vs B',
    category: 'proof',
    definition:
      'TWO different 2×2 matrix representations of the Euler factors: ' +
      '(A) Algebraic T=[[1,a],[a,1]] gives S₂₁ = ζ(2s)/ζ(s); ' +
      '(B) Physical LC T=[[cos θ, Z sin θ],...] gives S₂₁ = sec(ω·log P#). ' +
      'They are DIFFERENT mathematical objects with different zero/pole structures.',
    firstUsed: 'imp-134',
    relatedTerms: ['transfer matrix', 'cascade', 'S₂₁'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PHYSICS ANALOGIES
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Vacuum Bubbles',
    category: 'physics',
    definition:
      'Physical model: ζ-zeros are vapor bubbles in the |ζ| landscape (supercritical liquid). ' +
      'Bubble radius matches GUE prediction. Surface tension is TOPOLOGICAL (2π per bubble). ' +
      'σ=½ = saturation line.',
    firstUsed: 'imp-142',
    relatedTerms: ['thermodynamics', 'GUE', 'surface tension'],
  },
  {
    term: 'Mach-Zehnder Analogy',
    category: 'physics',
    definition:
      'The twin ladder is a 2-arm interferometer. Path 1 = ζ(s), Path 2 = ζ(1-s), ' +
      'phase = χ(s). ζ-zeros = dark fringes. RH = "dark fringes on line of max visibility (σ=½)".',
    firstUsed: 'imp-140',
    relatedTerms: ['twin ladder', 'interferometer', 'visibility'],
  },
  {
    term: 'String on T^∞',
    category: 'physics',
    definition:
      'ζ(s) IS EXACTLY the partition function of a bosonic string on the infinite torus ' +
      'T^∞ = Π S¹_{log p}. Winding state energy = log(n) by unique factorization. ' +
      'Hagedorn temperature β = 1 (pole of ζ). RH = phase transitions at β = ½.',
    firstUsed: 'imp-145',
    relatedTerms: ['partition function', 'Hagedorn', 'Lee-Yang'],
  },
  {
    term: 'Branched Flow / Superwires',
    category: 'physics',
    definition:
      'Physical phenomenon: waves propagating through weakly correlated random potentials ' +
      'form caustic channels ("superwires"). Proposed application: the prime-indexed bridge ' +
      'landscape may have branched flow caustics at σ=½.',
    firstUsed: 'imp-136 (queued)',
    relatedTerms: ['caustics', 'bridge', 'Heller'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'Interval Arithmetic',
    category: 'method',
    definition:
      'Computing with intervals [lo, hi] instead of floats, tracking rounding errors ' +
      'rigorously with IEEE 754 directed rounding. Used for machine-checked Mertens bound.',
    firstUsed: 'imp-068',
    relatedTerms: ['IEEE 754', 'certificate', 'Mertens bound'],
  },
  {
    term: 'Adversarial Testing',
    category: 'method',
    definition:
      'Running the proof chain on functions known to VIOLATE RH (Davenport-Heilbronn, ' +
      'Hurwitz ζ(s,¼), Epstein, planted zeros) to verify the proof steps correctly fail ' +
      'for counterexamples.',
    firstUsed: 'imp-107',
    relatedTerms: ['D-H', 'Hurwitz', 'Epstein'],
  },
  {
    term: 'Circularity Audit',
    category: 'method',
    definition:
      'Systematic check that no proof step assumes RH or any consequence. All proof steps ' +
      'audited (imp-108); found no circularity. Later revealed imp-126 circularity — ' +
      'demonstrated the audit method works.',
    firstUsed: 'imp-108',
    relatedTerms: ['honesty', 'self-correction', 'withdrawal'],
  },
  // ═══════════════════════════════════════════════════════════════════════
  // SESSION-FINDINGS (visual-geometries + honest-SOTA wave)
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'PCC-free',
    category: 'proof-status',
    definition:
      'Describes a route or argument that avoids the Montgomery Pair-Correlation Conjecture (PCC) ' +
      'as a hypothesis. Because PCC itself is an open conjecture, any proof of RH that assumes PCC ' +
      'is only a conditional result. PCC-free routes are strictly stronger: they close without ' +
      'invoking random-matrix universality or pair-correlation statistics. All surviving ' +
      'RH-equivalent routes in the current route map are required to be PCC-free.',
    firstUsed: 'v52 audit (2026)',
    relatedTerms: ['RH-equivalent', 'Montgomery PCC obstruction', 'closure routes'],
    link: '/pcc-route-exhaustion',
  },
  {
    term: 'RH-equivalent',
    category: 'proof-status',
    definition:
      'A statement that has been proved (unconditionally) to hold if and only if RH holds. ' +
      'An RH-equivalent is NOT a proof of RH; it merely transforms the problem. The Volterra ' +
      'norm collapse ||V_{a,Phi}|| <= 1 (imp-1258) and the Apéry-style irrationality-measure ' +
      'bracket for odd zeta values are canonical examples in this project. Contrast with ' +
      'ESTIMATE (numerical only) and CONDITIONAL (assumes an open hypothesis other than RH).',
    firstUsed: 'imp-1258',
    relatedTerms: ['PCC-free', 'C_H wall', 'Volterra norm', 'CONDITIONAL'],
    link: '/route-map',
  },
  {
    term: 'C_H wall',
    category: 'constant',
    definition:
      'The undischarged Gronwall-amplification constant C_H that appears in the collision-energy ' +
      'bound E_coll of the ZPO heat-flow route. C_H is the dominant obstacle to closing the ' +
      'route rigorously: it is an estimate (not a proved upper bound) because bounding it ' +
      'unconditionally requires controlling the Lipschitz modulus of the Calogero-Moser flow ' +
      'near particle collisions, which reduces back to RH-hardness. Until C_H is discharged, ' +
      'the heat-flow route remains CONDITIONAL-on-C_H rather than a full proof.',
    firstUsed: 'imp-2672 (2026)',
    relatedTerms: ['RH-equivalent', 'E_coll', 'Gronwall', 'heat flow', 'collision regularization'],
    link: '/route-map',
  },
  {
    term: 'Vortex field',
    category: 'visualization',
    definition:
      'A 2-D vector field derived from the gradient of arg zeta(sigma + it): each point ' +
      '(sigma, t) in the critical strip is assigned a velocity proportional to the local ' +
      'winding-rate of the Riemann zeta phase. Zeros of zeta appear as phase-vortex centres ' +
      'where the field rotates by 2pi. The /vortex-field visualization renders this flow; ' +
      'the RH connection is that all vortex centres on the physical strip should lie on sigma=1/2. ' +
      'This is an exploratory/geometric tool, NOT a proof method.',
    firstUsed: 'imp-2677 (2026)',
    relatedTerms: ['phase', 'arg zeta', 'critical line', 'PCC-free'],
    link: '/vortex-field',
  },
  {
    term: 'Vortex Exclusion (RH-equivalent)',
    category: 'proof-status',
    definition:
      'The statement that all phase-vortex centres of zeta(s) lie on the critical line sigma=1/2 ' +
      'is equivalent to RH by the argument principle: every zero rho contributes a 2pi winding, ' +
      'so an off-axis zero is an off-axis vortex and vice versa. ' +
      'This equivalence re-derives Lambda >= 0 (Rodgers-Tao 2020) from the winding geometry, ' +
      'but does NOT improve on the rigorous upper bound Lambda <= 0.2 (Platt-Trudgian). ' +
      'Vortex exclusion is an RH-equivalent reformulation — a proof that all vortex centres ' +
      'are on sigma=1/2 would unconditionally prove RH, but the exclusion argument itself ' +
      'cannot be certified without discharging the same obstacles.',
    firstUsed: 'imp-2677 (2026)',
    relatedTerms: ['Vortex field', 'RH-equivalent', 'PCC-free', 'de Bruijn-Newman Constant Λ'],
    link: '/vortex-field',
  },

  // ═══════════════════════════════════════════════════════════════════════
  // FRONTIER CONSTANTS (sg1c / Theta-trap / C_H analysis)
  // ═══════════════════════════════════════════════════════════════════════
  {
    term: 'C_shock (Holder-1/2 shock modulus)',
    category: 'constant',
    definition:
      'The cusp-scaling constant in the Holder-1/2 law g_min ~ C_shock * W_1^{1/2} near a ' +
      'particle collision in the Calogero-Moser flow. Closed form: C_shock(N) = sqrt(2 / (3 log gamma_N)), ' +
      'which evaluates to approx 0.2692 at the N*=1e4 assembly scale and decreases monotonically ' +
      'along the prime ladder (strictly below 1/3 everywhere). ' +
      'Of the two factors in C_H = C_shock * C_Lip / 4, C_shock is now pinned and bounded; ' +
      'the obstruction to closing the heat-flow route lies entirely in C_Lip. ' +
      'Cross-validated: the cusp-law log-log fit and the squared-gap finite-difference route ' +
      'agree to < 1e-9 (imp-3026).',
    firstUsed: 'imp-2786 (2026)',
    relatedTerms: ['C_H wall', 'C_Lip', 'Holder-1/2', 'Calogero-Moser'],
    link: '/spectral-attack',
  },
  {
    term: 'h=g^2 reconditioning (squared-gap coordinate)',
    category: 'method',
    definition:
      'The insight that the imp-2640 local collision-energy divergence (the integral of 2/g^2 ' +
      'blowing up as the pair gap g -> 0) is a PURE COORDINATE ARTIFACT of working in g, not a ' +
      'genuine obstruction. Passing to the squared gap h = g^2 makes the self-term cancel exactly: ' +
      'the relevant derivative 2g*(dg/dW) collapses to the flat constant C_shock^2 = 0.071289 ' +
      '(6 digits, measured flat across the bridge metric W = 1e-2 .. 1e-10), so the whole ' +
      'obstruction reduces to a SINGLE scalar modulus C_Theta. CAVEAT (why this is reconditioning, ' +
      'not a closure): the bounded constant C_shock^2/8 holds ONLY along the 1-parameter cusp family ' +
      'and ON the isolated-pair basin (the measured real-zero regime Theta(0) << 1/4); it breaks ' +
      'under any consistent-W_1 rank-1 move and is UNCONDITIONALLY FALSE off-basin (crowded ' +
      'near-uniform lattice: dTheta/dW_1 ~ 1/g0 blowup, adversary-exhibited 11.97 -> 95.78 as g0 ' +
      'halves). The basin restriction still rests on the unclosed multi-body isolation sign law. ' +
      'Grounded in ch-wall-frontier-verdict.',
    firstUsed: 'imp-2640 / ch-wall-frontier-verdict (2026)',
    relatedTerms: ['C_shock', 'C_H wall', 'C_Theta', 'isolation ratio rho', 'Lipschitz/Gronwall route foreclosure'],
    link: '/spectral-attack',
  },
  {
    term: 'Theta-trap',
    category: 'constant',
    definition:
      'The family of dynamical traps on the dimensionless pair-energy parameter ' +
      'Theta = g^2 E / 2 (gap^2 times environment energy / 2) for an adjacent pair ' +
      'in the Calogero-Moser flow. Four certified threshold levels: ' +
      '(1) Theta* = 1/4 — unconditional (Theorem A, sg1c-theta-trap-theorems); ' +
      '(2) Theta_b = (sqrt(73) - 5)/8 = 0.443 — sharp minimal-gap trap (Theorem B); ' +
      '(3) Theta_max(c) up to 1 for isolation ratio rho <= 0.72 (Theorem C); ' +
      '(4) excursion cap approx 0.5073 for the dressed refutation family. ' +
      'The band (0.443, 0.5073) is fully REFUTED: configs exist that cross upward. ' +
      'On actual zero configurations Theta(0) = 0.167 / 0.088 / 0.046, well below 1/4, ' +
      'so the unconditional trap already applies.',
    firstUsed: 'imp-theta-trap-sign-audit / sg1c-theta-trap-theorems (2026)',
    relatedTerms: ['C_shock', 'C_Lip', 'isolation ratio rho', 'excursion cap'],
    link: '/spectral-attack',
  },
  {
    term: 'isolation ratio rho',
    category: 'constant',
    definition:
      'The dimensionless ratio rho = g / d_1 of the minimal pair gap g to the nearest ' +
      'environment particle distance d_1 (Theorem C of sg1c-theta-trap-theorems). ' +
      'Self-isolation: d(rho)/ds < 0 strictly for every rho strictly below the ' +
      'worsening-onset threshold c* approx 0.93185 (imp-3005 closed form sqrt(2+sqrt(3))-1), ' +
      'so an isolated pair becomes more isolated over time. ' +
      'The Theorem-C basin operates at rho <= 0.72; this sits 0.207 below the open bracket ' +
      '[0.927, 0.943] for the global multi-body scan, certifying the basin unconditionally ' +
      '(imp-3006). Regime-separation threshold: rho* = 2/3, where Theta = 1/4 exactly.',
    firstUsed: 'sg1c-theta-trap-theorems / imp-3006 (2026)',
    relatedTerms: ['Theta-trap', 'C_Lip', 'C_H wall', 'excursion cap'],
    link: '/spectral-attack',
  },
  {
    term: 'excursion cap',
    category: 'constant',
    definition:
      'The maximum value of Theta that the tracked minimal pair can reach before ' +
      'minimality transfers to a competitor. For the symmetric 4-config refutation family ' +
      'the cap is exactly 1/2 (Lemma R1-T): the rising central pair carries Theta = 1/2 at ' +
      'the minimality-tie (uniform lattice), then an outer pair seizes minimality and Theta ' +
      'resets to 1/3. For the asymmetric / dressed variant the tie is pushed marginally to ' +
      'approx 0.5073 (measured; Lemma R1-T2). This cap is the reason the empirical ' +
      'sg1c 34-run trap held: all configs entering above ~0.51 still decreased (the lattice ' +
      'is the highest-excursion attractor and it decays). The residual is to extend ' +
      'the seizing dominance to ASYMMETRIC configs beyond the measured 0.5073.',
    firstUsed: 'sg1c-theta-trap-theorems (imp-3000 era, 2026)',
    relatedTerms: ['Theta-trap', 'isolation ratio rho', 'C_Lip'],
    link: '/spectral-attack',
  },
  {
    term: 'C_Lip',
    category: 'constant',
    definition:
      'The Lipschitz modulus of the Calogero-Moser flow, the dominant undischarged factor in ' +
      'C_H = C_shock * C_Lip / 4. ON the isolated-pair basin (rho <= 0.72): ' +
      'C_Lip_basin = g_min / (4 (1 - Theta)) [gap channel, finite]; C_Theta is bounded and ' +
      'subdominant. At N*=1e4: C_Lip_basin approx 9.42e-3 (nominal Theta -> 0) to 1.257e-2 ' +
      '(trapped ceiling Theta = 1/4). OFF the basin (crowded near-uniform lattice, rho >= 2/3): ' +
      'C_Lip diverges due to the linear-N norm-mismatch (C_Lip ~ N g0 / (4(1-Theta))). ' +
      'This off-basin divergence is NOT resolved by the basin-conditional reconditioning; ' +
      'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
    firstUsed: 'imp-3006 (ch-lip-basin-conditional-2026-06-30)',
    relatedTerms: ['C_H wall', 'C_shock', 'C_Theta', 'Theta-trap', 'isolation ratio rho'],
    link: '/spectral-attack',
  },
  {
    term: 'C_Theta',
    category: 'constant',
    definition:
      'The Theta-channel contribution to C_Lip in the reconditioning formula ' +
      'C_Lip_basin = g_min/(4(1-Theta)) + C_Theta. On the isolated-pair basin (rho < rho* = 2/3): ' +
      'C_Theta is bounded and vanishing — Theta ~ rho^2 -> 0 as the pair self-isolates, ' +
      'and dTheta/dW_1 ~ 2N g0/D^2 -> 0. Off the basin (crowded lattice, d_1 comoving with g): ' +
      'C_Theta acquires the 1/g0 divergence dTheta/dW_1 ~ 1/g0 with flat invariant ' +
      'g0 * dTheta/dW_1 = 16/27 = 0.59259 (certified by independent reproduction, imp-3022). ' +
      'The off-basin C_Theta blowup is the root cause of the C_H wall remaining open.',
    firstUsed: 'imp-3022 (ctheta-basin-scaling, 2026)',
    relatedTerms: ['C_Lip', 'C_H wall', 'isolation ratio rho', 'Theta-trap'],
    link: '/spectral-attack',
  },
  {
    term: 'isolation-constant ladder',
    category: 'constant',
    definition:
      'The three-rung hierarchy of the isolation constant c governing C_H: ' +
      '(1) Single nearest-neighbour (R2-T, two-body): c = 1, CLOSED in closed form — ' +
      'the isolated pair self-isolates exactly at separation rho = 1 (g_min = d_1). ' +
      '(2) Symmetric single-shell (K=1, one ring of K neighbours): ' +
      'c* = sqrt(2 + sqrt(3)) - 1 ~ 0.93185, CLOSED (imp-3005, analytic root of ' +
      'the shell-onset condition). ' +
      '(3) Global multi-body constant: currently OPEN, bracketed by numerical scan ' +
      'in (0.927, 0.943) (not yet closed in form). ' +
      'The open rung (3) is the sole deterministic forward move toward the C_H wall; ' +
      'closing it in closed form would make the isolation-bound argument unconditional. ' +
      'All three rungs are DISTINCT: c = 1 applies only to the strict two-body limit; ' +
      'c* = 0.93185 applies to the symmetric single-shell; the multi-body bracket ' +
      'applies to general N-body configurations. No QED — rung (3) remains open.',
    firstUsed: 'imp-3054 (isolation-constant ladder, 2026)',
    relatedTerms: ['isolation ratio rho', 'C_H wall', 'C_Lip', 'Theta-trap', 'C_shock'],
    link: '/spectral-attack',
  },
  {
    term: "Lipschitz/Gronwall route foreclosure",
    category: 'proof-status',
    definition:
      "FORECLOSED (RH-hard impossibility). The attempt to bound the C_H collision rate " +
      "via a finite N-uniform global-W_1 Lipschitz constant C_Lip is provably closed, " +
      "three independent ways: " +
      "(1) Holder-1/2 impossibility (airtight lower bound, WITNESSED): along the CM-flow cusp " +
      "family the minimal gap obeys g_min = C_shock * W_1^{1/2} with C_shock < 1/3 " +
      "(~0.2692 at N*=1e4, pinned by imp-2786). The Lipschitz quotient is therefore " +
      "C_Lip >= C_shock / (2 sqrt(W_1)) -> inf as W_1 -> 0. " +
      "Log-log fit across W_1 = 1e-2 .. 1e-12 pins the divergence exponent at exactly -1/2 " +
      "(imp-3047). The sole escape (cusp family non-realizable) is the RH-hard " +
      "two-sided spacing content. " +
      "(2) Norm-mismatch (exact closed form, numerics < 0.2%): the global W_1 = (1/N) Sum|Dx| " +
      "dilutes a microscopic 1-pair collision move (cost eps/N) across all N particles, " +
      "giving C_Lip(W_1,N) = N * g0 / (4(1-Theta)) -- linear in N, independent of the cusp. " +
      "(3) Refuted surrogates: tau_c-direct (object-substitution error, dg_min/dW_1 = 1.449/sqrt(W_1) " +
      "-> inf) and squared-gap h=g^2 (bounded constant C_shock^2/8 holds ONLY on the 1-parameter " +
      "cusp family; breaks under any consistent-W_1 rank-1 move or multiplicative fluctuation). " +
      "The sole surviving deterministic forward move is to close the multi-body isolation " +
      "constant c in closed form (currently bracketed at [0.927, 0.943], open; see isolation-constant " +
      "ladder), which would convert the route to a basin-conditional C_Lip bound. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA; no QED.",
    firstUsed: 'imp-3047 (ch-lip-impossibility-w1grid, 2026)',
    relatedTerms: ['C_Lip', 'C_H wall', 'C_shock', 'Holder-1/2 cusp', 'isolation-constant ladder', 'Theta-trap'],
    link: '/spectral-attack',
  },
  {
    term: 'Excess-fraction asymptotics (s0, C, K)',
    category: 'constant',
    definition:
      'Vocabulary for the relative price of the forced even cosh-completion in the excess-fraction ' +
      'cover. Let s = a*U be the single scale invariant (the imp-3064 a*U product; the U length scale ' +
      'cancels under de-homogenization tau = U*x), and let phi(a,U) = G(s)/F(s) be the excess fraction, ' +
      'the relative price of the forced even cosh-completion. The admissible (overflow) range is s > s0. ' +
      'Three companion quantities pin its shape: ' +
      '(1) ONSET s0 = arcsinh(1) ~ 0.881374 -- the overflow onset where F has a DOUBLE zero. ' +
      '(2) QUADRATIC-POLE onset constant C = sqrt2 * (1 - arcsinh1) ~ 0.167763 -- near onset the ' +
      'fraction blows up as phi ~ C / (s - s0)^2 (unbounded: the cover is infinitely expensive at onset). ' +
      '(3) LARGE-s decay constant K = 2 * (sqrt2 - arcsinh1) ~ 1.065680 -- for large overflow ' +
      'phi ~ K * e^{-s} (exponentially cheap: the cosh-completion costs almost nothing deep in the ' +
      'admissible range). Honest caveat: phi is a degree-0 SCALAR measure on the representative ' +
      'truncation -- it carries no RH verdict. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
    firstUsed: 'imp-3087/imp-3088 (excess-fraction phi asymptotics, 2026)',
    relatedTerms: ['a*U scale invariant', 'excess fraction phi', 'cosh-completion', 'overflow onset s0'],
    link: '/closure-routes',
  },
  {
    term: 'a*U scale invariant',
    category: 'constant',
    definition:
      'The single product s = a*U is the ONE scale invariant that governs BOTH sides of the mu^pass ' +
      'degree-0 cover: the SCALAR excess fraction phi (imp-3064) and the OPERATOR/diagonal gap (imp-3085). ' +
      'SCALAR side (imp-3064): both degree-0 masses factor as a pure 1/a prefactor times a function of s, ' +
      'with a*D_raw = F(s) = cosh(s) - sqrt(2) - s + arcsinh(1) and a*E = G(s) = sqrt(2) - arcsinh(1) - e^{-s}, ' +
      'so the prefactor cancels in the ratio and phi(a, U) = G(s)/F(s) depends on s alone. ' +
      'OPERATOR side (imp-3085): de-homogenizing the Hankel cross-term R_jk = H_jk / sqrt(D_jj * D_kk) cancels ' +
      'the shared lag-window U prefactor, so the operator norm ||R||, its diagonal, and the obstruction gap ' +
      '||R|| - max_j R_jj also depend on s alone -- equal-product cells coincide exactly, e.g. (a, U) = (0.5, 6) ' +
      'and (0.3, 10) both land at s = 3 with gap 3.6260954 and ||R|| 4.617014. ' +
      'WHY the U length scale cancels on both sides: U enters only through the de-homogenization tau = U*x on the ' +
      'scalar side and through the diagonal normalizer sqrt(D_jj * D_kk) on the operator side, so it drops out and ' +
      'the dimensionless shear-times-length product s = a*U is all that remains. ' +
      'Honest caveat: this is a DIAGNOSTIC structural tie, not a reduction -- the scalar side is a degree-0 ' +
      '(measure-only) quantity and the operator side is on the representative degree-4 monomial truncation, NOT the ' +
      'section-26 Gram; the exact a*U collapse is a toy artifact of the joint homogeneity of the monomial basis and ' +
      'the bare hyperbolic weight (imp-3110), and carries NO RH verdict. Platt-Trudgian Lambda <= 0.2 remains the ' +
      'rigorous SOTA.',
    firstUsed: 'imp-3085 (Hankel-gap a*U grid) cross-tied to imp-3064 (deficit/excess-fraction grid), 2026',
    relatedTerms: ['Excess-fraction asymptotics (s0, C, K)', 'excess fraction phi', 'cosh-completion', 'overflow onset s0'],
    link: '/closure-routes',
  },
  {
    term: 'Degree-0 bridge margin B/D(s) (NPHI-independent scale function)',
    category: 'constant',
    definition:
      'A THIRD scale-only quantity in the mu^pass degree-0 cover, alongside the imp-3064 excess fraction phi(s) ' +
      'and the imp-3085 operator gap: the ratio of the cosh-completion bridge mass B(a,U) = int_0^U (cosh(a*tau) - 1) ' +
      'd(tau) = sinh(aU)/a - U to the raw overflow deficit D_0(a,U) = int_{tauStar}^U (sinh(a*tau) - 1) d(tau) = ' +
      '[cosh(aU) - sqrt2 + arcsinh(1)]/a - U. With s = a*U the shared 1/a prefactor cancels EXACTLY, so ' +
      'B/D(s) = (sinh(s) - s) / (cosh(s) - s + arcsinh(1) - sqrt2) depends on the single scale variable s = a*U ' +
      'alone -- three distinct (a,U) cells sharing s = 3 (e.g. (0.5,6), (1,3), (0.25,12)) return an identical ratio ' +
      '1.073920 to machine precision, even though B and D_0 themselves scale as 1/a. B/D is strictly decreasing in ' +
      's, diverging to +inf as s -> arcsinh(1)+ (D_0 -> 0) and shrinking to 1+ as s -> inf, so the recorded 1.074 ' +
      '~7.4% surplus at the genuine cell s = 3 is a cell-specific value, not a universal constant. ' +
      'CONTRAST with imp-3085: both quantities track s = a*U alone and both cancel their 1/a (or U) prefactor in ' +
      'the ratio, but B/D is a purely SCALAR Lebesgue-integral ratio of the raw cosh/sinh weights with NO Phi^2 ' +
      'kernel anywhere in its definition, so it is NPHI-INDEPENDENT outright -- unlike the imp-3085 operator gap, ' +
      'which is computed on the Phi-weighted monomial Gram and only inherits s = a*U scale invariance as a property ' +
      'of that operator construction. Honest caveat: DIAGNOSTIC only, RH-equivalent, necessary-but-not-sufficient ' +
      '(mass-feasibility B > D_0 does not touch the surviving operator-level K_a >= 0 sign-positivity); Platt-Trudgian ' +
      'Lambda <= 0.2 remains the rigorous SOTA.',
    firstUsed: 'imp-3255 (bridge-margin closed form, 2026), companion to imp-3251 resolution sweep',
    relatedTerms: ['a*U scale invariant', 'mu^pass overflow-cover vocabulary (D_raw, D_pass, E(a))', 'Operator-side mu^pass vocabulary (de-homogenized R, endpoint-Hankel gap)'],
    link: '/closure-routes',
  },
  {
    term: 'mu^pass overflow-cover vocabulary (D_raw, D_pass, E(a))',
    category: 'constant',
    definition:
      'The three named functionals of the imp-3007 mu^pass overflow cover, all measured in the degree-0 ' +
      '(Lebesgue on the lag tau over [0, U]) scale-invariant, RH-equivalent class. nu(tau) = sinh(a*tau) is ' +
      'the bare overflow profile; w^pass(tau) = cosh(a*tau) is the smooth even cosh-completion; ' +
      'w^min(tau) = max(1, sinh(a*tau)) is the minimal kinked patch that just dominates nu. ' +
      '(1) D_raw(a) -- RAW degree-0 deficit mass: the total overshoot of nu over the bare diagonal on the ' +
      'overflow tail [tau_star, U], tau_star = arcsinh(1)/a, D_raw(a) = int_{tau_star}^{U} [sinh(a*tau) - 1] d(tau) ' +
      '= [cosh(a*tau)/a - tau]_{tau_star}^{U} (~13.07 at a = 0.5, U = 6; the 64%-class overflow the raw ' +
      'diagonal cannot dominate). ' +
      '(2) D_pass(a) -- POST-BRIDGE residual deficit: D_pass(a) = int_0^U [nu(tau) - w^pass(tau)]^+ d(tau) = 0 ' +
      'EXACTLY, since cosh(a*tau) - sinh(a*tau) = e^{-a*tau} > 0 pointwise, so the cosh-completion covers the ' +
      'entire degree-0 overflow and coveredFraction = (D_raw - D_pass)/D_raw = 1. ' +
      '(3) E(a) -- EXCESS passive mass of the cosh over the minimal cover: ' +
      'E(a) = int_0^U [cosh(a*tau) - max(1, sinh(a*tau))] d(tau) > 0, the quantified price of using the smooth ' +
      'even completion instead of the minimal kinked patch w^min. ' +
      'Honest note: this cover is SCALAR/diagnostic (degree-0, pointwise w^pass >= nu) and RH-EQUIVALENT, not an ' +
      'RH proof -- covering the degree-0 overflow is NECESSARY but NOT SUFFICIENT; the operator (section-26 Gram) ' +
      'step is open and Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
    firstUsed: 'imp-3007 (mu^pass overflow cover), 2026',
    relatedTerms: ['a*U scale invariant', 'cosh-completion', 'overflow onset s0', 'Excess-fraction asymptotics (s0, C, K)'],
    link: '/closure-routes',
  },
  {
    term: 'Operator-side mu^pass vocabulary (de-homogenized R, endpoint-Hankel gap)',
    category: 'constant',
    definition:
      'The operator-step counterpart to the scalar D_raw/D_pass/E cover: the four named objects of the ' +
      'imp-3007/imp-3066/imp-3084 frontier that decide whether covering the degree-0 overflow actually buys ' +
      'the RH-equivalent positivity. On the rescaled monomial truncation phi_j(tau) = (tau/U)^j the cover ' +
      'requires the operator inequality Gpass >= Gshear, equivalently K_a >= 0, equivalently a CONTRACTION. ' +
      '(1) DE-HOMOGENIZED R CONTRACTION -- R = Gpass^{-1/2} Gshear Gpass^{-1/2}, entrywise ' +
      'R_jk = H_jk / sqrt(D_jj * D_kk), where D_jj = int_0^U cosh(a*tau) phi_j^2 d(tau) is the passive ' +
      'diagonal and H_jk = int_0^U sinh(a*tau) phi_j phi_k d(tau) is the shear Hankel form. The cover holds ' +
      'iff R is a contraction (||R|| <= 1). ' +
      '(2) OFF-DIAGONAL ENDPOINT-HANKEL OBSTRUCTION -- the shear Gram Gshear is a genuinely OFF-DIAGONAL ' +
      'endpoint-Hankel form (its cross-terms H_jk, j != k, do not vanish), so the scalar pointwise cover ' +
      'w^pass >= nu does NOT diagonalize the operator step; the off-diagonal mass is the residual the scalar ' +
      'argument cannot see. ' +
      '(3) OPERATOR/DIAGONAL GAP -- the Perron-Frobenius quantity ||R|| - max_j R_jj, the spectral norm ' +
      '(largest eigenvalue, since R has strictly positive entries) minus the largest diagonal (the ' +
      'scalar-cover ceiling, always < 1). A strictly positive gap is exactly the amount by which the operator ' +
      'overshoots the diagonal the scalar cover controls; in the raw monomial basis it GROWS with the ' +
      'truncation degree (~1.79 at DEG = 2 to ~10.8 at DEG = 12, ill-conditioning artifact, imp-3084) rather ' +
      'than saturating. ' +
      '(4) phi = G(s)/F(s) a*U INVARIANT TIE -- de-homogenizing R cancels the shared lag-window U prefactor ' +
      'through the normalizer sqrt(D_jj * D_kk), so ||R||, its diagonal, and the gap depend on the single ' +
      'scale invariant s = a*U alone, exactly as the scalar excess fraction phi(a,U) = G(s)/F(s) does -- the ' +
      'one structural tie between the scalar and operator sides. ' +
      'Honest scope caveat: the scalar cover is NECESSARY but NOT SUFFICIENT; this operator contraction step is ' +
      'the RH-hard residual and is OPEN, and these objects live on the representative monomial truncation, NOT ' +
      'the section-26 Gram -- diagnostic only, no RH verdict. Platt-Trudgian Lambda <= 0.2 remains the rigorous ' +
      'SOTA.',
    firstUsed: 'imp-3066 (off-diagonal Hankel obstruction) / imp-3084 (operator/diagonal gap degree sweep), 2026',
    relatedTerms: ['mu^pass overflow-cover vocabulary (D_raw, D_pass, E(a))', 'a*U scale invariant', 'excess fraction phi', 'cosh-completion'],
    link: '/closure-routes',
  },
  {
    term: "Orthogonalization vocabulary (Cholesky L, Loewdin P^{-1/2}, pencil identity, basis-invariant norm)",
    category: 'method',
    definition:
      "Four tightly-coupled concepts introduced in imp-3086 (orthogonalized basis conditioning) to " +
      "assess whether the imp-3066 off-diagonal Hankel obstruction is intrinsic or a basis-conditioning " +
      "artifact of the ill-conditioned raw monomial basis phi_j = (tau/U)^j in the passive cosh inner product. " +
      "(1) TRIANGULAR GRAM-SCHMIDT L (Cholesky factor) -- write the full passive cosh Gram as P = G G^T " +
      "(Cholesky), then set L = G^{-1} (lower-triangular inverse). The rescaled basis psi = L phi is " +
      "cosh-orthonormal: L P L^T = I exactly. The TRUE de-homogenized pencil operator in this basis is " +
      "R_orth = L H L^T, where H is the shear sinh Hankel form. Because the passive Gram is now the " +
      "identity, R_orth is the genuine contraction matrix whose spectral norm decides the RH-equivalent " +
      "operator inequality -- no residual conditioning from the basis. " +
      "(2) LOEWDIN (SYMMETRIC) ORTHOGONALIZATION P^{-1/2} -- an independent second witness: diagonalize " +
      "P = V diag(lambda_i) V^T and form P^{-1/2} = V diag(lambda_i^{-1/2}) V^T. The symmetric " +
      "de-homogenized operator is R_sym = P^{-1/2} H P^{-1/2}. This is a DIFFERENT orthonormalization " +
      "of phi in the same cosh inner product (it minimizes the change-of-basis transformation), so the " +
      "two orthogonalizations together test whether results depend on the choice of orthonormalization. " +
      "(3) MATRIX-PENCIL IDENTITY -- the key algebraic fact tying (1) and (2): for any invertible L with " +
      "L P L^T = I, det(L H L^T - lambda I) = det(L)^2 det(H - lambda P). This means R_orth and R_sym " +
      "share the spectrum of the generalized pencil (H, P), independent of the specific orthonormalization " +
      "chosen. Both eigenvalue sets and hence both operator norms must be identical up to numerical precision. " +
      "(4) BASIS-INVARIANT OPERATOR NORM -- the headline finding: ||R_orth|| and ||R_sym|| agree to ~1e-13 " +
      "(relative difference < 1e-7). The operator norm of the true de-homogenized pencil is a BASIS " +
      "INVARIANT, not a conditioning artifact of the raw monomial basis. Yet orthogonalizing the FULL " +
      "passive Gram collapses the imp-3066 diagonal-only numbers dramatically (||R||: 4.62 -> 0.99, " +
      "operator/diagonal gap: 3.63 -> 0.09, off-diagonal Frobenius: 4.08 -> 0.69): the imp-3066 measured " +
      "gap was LARGELY a basis-conditioning artifact. A strictly-positive residual gap (~0.088) survives " +
      "orthogonalization, confirming the off-diagonal endpoint-Hankel obstruction is real but much smaller. " +
      "Honest scope: this is a STRUCTURAL/DIAGNOSTIC result on the representative monomial truncation (NOT " +
      "the section-26 Gram); the operator norm carries no RH verdict and positivity was not attempted. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3086 (orthogonalized basis conditioning), 2026",
    relatedTerms: ['Operator-side mu^pass vocabulary (de-homogenized R, endpoint-Hankel gap)', 'a*U scale invariant', 'excess fraction phi'],
    link: '/closure-routes',
  },
  {
    term: "onset quadratic-pole divergence",
    category: 'constant',
    definition:
      "The leading behavior of the excess fraction phi(s) = G(s)/F(s) as s -> 0+: " +
      "phi(s) ~ C / s^2, where C = sqrt(2)(1 - arcsinh(1)) ~ 0.16776 is the onset quadratic-pole constant. " +
      "The divergence arises because F(s) vanishes cubically near s=0 while G(s) vanishes only quadratically, " +
      "producing a 1/s^2 pole. Despite this non-integrable pointwise divergence the total mass " +
      "integral of phi converges because the exponential decay K*e^{-s} (K ~ 1.06568) takes over " +
      "past the crossover s_cross1. The constant C first appeared in imp-3112 as half of the " +
      "companion asymptotic pair (C for onset, K for large-s decay).",
    firstUsed: "imp-3112 (onset/decay asymptotic constants), 2026",
    relatedTerms: ['excess fraction phi', 'convergent tail mass', 'envelope crossover handoff (s_cross1)', 'a*U scale invariant'],
    link: '/section26',
  },
  {
    term: "envelope crossover handoff (s_cross1)",
    category: 'constant',
    definition:
      "The value of s = a*U at which the onset quadratic-pole envelope C/s^2 and the " +
      "exponential-decay envelope K*e^{-s} are equal in magnitude, marking the transition from " +
      "onset-dominated to decay-dominated behavior in phi(s) = G(s)/F(s). " +
      "For s < s_cross1 the onset divergence dominates; for s > s_cross1 the exponential tail " +
      "dominates. The handoff is relevant for numerical quadrature strategies: near s=0 the integrand " +
      "behaves as C/s^2 and needs special treatment, while large s is exponentially negligible. " +
      "Constants: C ~ 0.16776 (onset coefficient, imp-3112), K ~ 1.06568 (decay coefficient, imp-3112).",
    firstUsed: "imp-3112 (onset/decay asymptotic constants), 2026",
    relatedTerms: ['onset quadratic-pole divergence', 'excess fraction phi', 'convergent tail mass'],
    link: '/section26',
  },
  {
    term: "convergent tail mass",
    category: 'method',
    definition:
      "The total integral mass of the excess fraction phi(s) = G(s)/F(s) over s in (0, +inf), " +
      "which converges despite the onset quadratic-pole divergence phi ~ C/s^2 near s=0. " +
      "Convergence holds because the envelope crossover at s_cross1 transitions the integrand to " +
      "exponential decay K*e^{-s} before the onset singularity accumulates enough to diverge overall. " +
      "The tail mass is the resolution-sensitive quantity for computing average operator deficits: " +
      "the resolved genuine overflow fraction is ~0.209 (imp-3175), larger than the coarse-grid " +
      "snapshots 0.194 and 0.200 which both under-report the tail contribution at insufficient resolution.",
    firstUsed: "imp-3112 (onset/decay asymptotic constants) / imp-3175 (overflow fraction resolution), 2026",
    relatedTerms: ['onset quadratic-pole divergence', 'envelope crossover handoff (s_cross1)', 'excess fraction phi'],
    link: '/section26',
  },
  {
    term: "section-26-vs-monomial gap (D1-D4)",
    category: 'proof-status',
    definition:
      "The four concrete structural differences between the representative monomial truncation " +
      "(the numerical toy used in imp-3066 through imp-3086 conditioning studies) and the genuine " +
      "section-26 Gram, catalogued in imp-3110. " +
      "D1 BASIS: monomial truncation uses (tau/U)^j for j=0..DEG; section-26 uses the genuine " +
      "Hardy-space basis from the Xi functional equation -- different spanning sets. " +
      "D2 WEIGHT: monomial studies use the cosh passive inner product with measure cosh(tau) dtau; " +
      "section-26 uses the Xi-weighted inner product -- different measures. " +
      "D3 ENDPOINT: the monomial truncation cuts off sharply at tau = U; section-26 requires a " +
      "proper extension -- different support. " +
      "D4 DEHOMOGENIZATION: the toy normalization 1/sqrt(D_jj * D_kk) is a proxy; the genuine " +
      "section-26 analogue has not been computed. " +
      "The SURVIVES-swap vs TRUNCATION-ARTIFACT classification (imp-3110) tests which obstruction " +
      "findings persist under basis-swap (intrinsic) vs which vanish (toy artifact). " +
      "Honest scope: all numerical results through imp-3110 are on the D1-D4 monomial toy, NOT the " +
      "section-26 Gram; no RH verdict follows.",
    firstUsed: "imp-3110 (section-26 vs monomial gap classification), 2026",
    relatedTerms: ['Operator-side mu^pass vocabulary (de-homogenized R, endpoint-Hankel gap)', 'Orthogonalization vocabulary (Cholesky L, Loewdin P^{-1/2}, pencil identity, basis-invariant norm)', 'excess fraction phi'],
    link: '/closure-routes',
  },
  {
    term: "digamma transcendental isolation onset (c_asym)",
    category: 'constant',
    definition:
      "The asymmetric multi-body SG1c isolation onset constant c_asym = 0.90279, defined as the " +
      "unique root of the equation psi(g+1) + gamma + 2g - 2/g - 1/(g+1) = 0, where psi is the " +
      "digamma function and gamma is the Euler-Mascheroni constant (imp-3170). " +
      "Why transcendental: the log-derivative balance equation splits into two sides. " +
      "The NEAREST-NEIGHBOUR side telescopes to the rational expression v_0-v_{-1} = 1/g - 2, " +
      "closing algebraically. The OPPOSITE INFINITE UNIFORM LATTICE side does NOT telescope -- " +
      "its log-derivative sum converges to the digamma value psi(g+1) + gamma = " +
      "sum_{k>=1}[1/k - 1/(g+k)], an irreducibly transcendental series. " +
      "This forces the root to be transcendental: no algebraic closed form exists for c_asym, " +
      "unlike the symmetric single-shell onset c_sym = sqrt(2+sqrt(3)) - 1 (algebraic, one " +
      "telescoping shell). " +
      "Corrections from imp-3170: c_asym = 0.90279 corrects the imp-3045 numerical bracket " +
      "~0.9032-0.9039. The Theorem-C basin constant 0.72 is safely below c_asym with margin " +
      "c_asym - 0.72 = 0.1828 (drho/ds(0.72) = -1.1177 < 0). " +
      "Honest scope: this is deterministic CM-flow algebra on the opposite-unit-lattice R->inf " +
      "class only. The GLOBAL asymmetric isolation constant remains OPEN, bracketed ~(0.9016, 0.9028). " +
      "Basin preserved; Platt-Trudgian Lambda <= 0.2 stays SOTA. Not RH-hard; no QED.",
    firstUsed: "imp-3170 (sg1c-asym isolation closed-form), 2026",
    relatedTerms: [
      'asymmetric isolation onset (sg1c R2-T)',
      'symmetric isolation onset (c*)',
      'Theorem-C basin constant (0.72)',
      'telescoping sum',
      'digamma-difference isolation onset (c_half)',
    ],
    link: '/closure-routes',
  },
  {
    term: "digamma-difference isolation onset (c_half)",
    category: 'constant',
    definition:
      "The half-lattice lone-neighbour SG1c isolation onset c_half = 0.8980208880762339, " +
      "the L -> infinity limit of the imp-3194 sweep, now CLOSED in closed form (imp-3270) as " +
      "the unique root in (0,1) of R(rho) = 4 + 4 rho - 4/rho - 4/(rho+1) - " +
      "2 [psi(1 + 2/rho) - psi(1 + 1/rho)], where psi is the digamma function. " +
      "Setup: positions {-1, 0, rho} union {1 + k rho : k = 1..L}, tracked pair (0, rho) " +
      "against the FIXED lone left neighbour at -1 (the tie-robust branch; the naive " +
      "global-nearest selector locks onto a d_1 = 1 tie artifact at ~0.90625, imp-3249). " +
      "Why a DIFFERENCE of two digammas, unlike c_asym: c_asym's opposite lattice sits at " +
      "unit spacing, so its transcendental tail is the single value psi(g+1) + gamma. Here " +
      "the opposite lattice is spaced at rho itself (denser than unit, since rho < 1), and " +
      "the lone-neighbour distance (fixed at 1) and the lattice spacing (rho) are " +
      "incommensurate scales, so the divergent lattice sum resolves to the DIFFERENCE " +
      "psi(1 + 2/rho) - psi(1 + 1/rho) instead of a single digamma value. " +
      "Rigor: R(1) = 1 exactly (psi(3) - psi(2) = 1/2) and R -> -infinity as rho -> 0+, so a " +
      "root exists; dR/drho > 2/rho^2 > 0 strictly on (0,1], so R is strictly increasing and " +
      "the root is unique (not merely bracketed). The O(1/L) finite-size corrections cancel " +
      "exactly between the gap side and the lone-neighbour side, proving the O(1/L^2) " +
      "convergence order that imp-3194 could only measure empirically. " +
      "Located-onset chain (each an upper bound on the still-open global constant c_glob): " +
      "c_half = 0.89802 < structured tune 0.9015828 (imp-3021/3172) < c_asym = 0.9027902 " +
      "(imp-3170) < c* = 0.9318517 (imp-3005). c_half is now the tightest located ceiling. " +
      "Honest scope: c_half closes only this rho-spaced class, as its infimum approached at " +
      "L -> infinity (never attained at finite L); it is NOT proven to be the global " +
      "asymmetric infimum, which remains OPEN. The Theorem-C basin constant 0.72 stays safely " +
      "below with margin c_half - 0.72 = 0.178. Platt-Trudgian Lambda <= 0.2 remains the " +
      "rigorous SOTA; no QED.",
    firstUsed: "imp-3270 (sg1c-halflattice-lone-limit-closed-form), 2026",
    relatedTerms: [
      'digamma transcendental isolation onset (c_asym)',
      'isolation-constant ladder',
      'Theorem-C basin constant (0.72)',
      'asym-onset ledger rigor-status taxonomy',
    ],
    link: '/closure-routes',
  },
  {
    term: "golden-ratio residual-gap maximum (phi^{-5/2})",
    category: 'constant',
    definition:
      "The maximal value of the basis-invariant saturating gap G_sat = ||R_orth|| - max_j R_orth_jj " +
      "over all equal-product cells (a, U) with s = aU fixed is phi^{-5/2} (approximately 0.3003), " +
      "attained exactly on the cell locus cosh(aU) = phi, where phi = (1+sqrt(5))/2 is the golden ratio " +
      "(imp-3146, imp-3177). " +
      "The equal-s cell invariance (imp-3177) means G_sat depends only on s = aU, not on a and U " +
      "individually; the golden-ratio locus cosh(aU) = phi is the unique s-value that maximizes " +
      "G_sat over all s > 0. " +
      "Why basis-invariant: G_sat is defined via the Cholesky-Loewner pencil identity and is " +
      "unchanged by any orthonormal basis change -- it is a spectral invariant of the Gram operator, " +
      "not a coordinate artifact. " +
      "Why phi: the optimality condition reduces to a transcendental equation in cosh(s); the " +
      "golden-ratio root cosh(s) = phi emerges from the fixed-point relation phi^2 = phi + 1. " +
      "Honest scope: this is the obstruction maximum for the monomial-basis toy (D1-D4 gap from the " +
      "genuine section-26 Gram remains open); no RH verdict follows from this extremal value alone.",
    firstUsed: "imp-3146 (golden-ratio residual-gap max), imp-3177 (equal-product-cell invariance), 2026",
    relatedTerms: [
      'Orthogonalization vocabulary (Cholesky L, Loewdin P^{-1/2}, pencil identity, basis-invariant norm)',
      'section-26-vs-monomial gap (D1-D4)',
      'excess fraction phi',
      'digamma transcendental isolation onset (c_asym)',
    ],
    link: '/section26',
  },
  {
    term: "bridge-kernel sign-free / magnitude-binding split",
    category: 'proof-status',
    definition:
      "The imp-3197 decomposition of the K_a>=0 bridge obstruction into two separate questions: " +
      "a SIGN question (resolved, free) and a MAGNITUDE question (open, binding). " +
      "\n\nSign is Phi-only and free: the bridge kernel K_a(tau,tau') = sinh(a*tau') * Phi(tau) has " +
      "its sign pattern determined entirely by Phi -- the on-domain Phi autocorrelation is " +
      "nonneg by the SG1b pass, and the sinh factor is antisymmetric, giving a zero sign-gap. " +
      "No additional obstruction lives in the sign; this part is CLOSED. " +
      "\n\nMagnitude is the whole residual: the binding obstruction is the operator-norm " +
      "||Gshear|| ~ 0.876 (lag <= 0.2), which the 1D lag-stationary Toeplitz surrogate " +
      "(built from the Phi autocorrelation alone) captures at only ~3% -- a ~33x under-report. " +
      "The missing ~97% of ||Gshear|| comes from position concentration in the joint " +
      "(tau, tau') distribution, invisible to the 1D projection. " +
      "\n\nConsequence (RH-EQUIVALENT): the entire remaining difficulty of the K_a>=0 bridge " +
      "is a pure spectrum-magnitude question about |Gshear|. If ||Gshear|| could be shown " +
      "bounded below 1 by a complementary argument, the bridge would close. " +
      "Honest status: the magnitude obstruction is OPEN; no bound ||Gshear|| < 1 exists; " +
      "this is the residual sub-gap named in imp-3202. RH-EQUIVALENT; no QED; " +
      "Platt-Trudgian Lambda <= 0.2 stays SOTA.",
    firstUsed: "imp-3197 (mupass-bridge-sign-phi-only decomposition), 2026",
    relatedTerms: [
      'Gshear operator norm (||Gshear||)',
      'overflow fraction (lag-support)',
      'Toeplitz surrogate operator-norm capture ratio',
      'section-26-vs-monomial gap (D1-D4)',
      'golden-ratio residual-gap maximum (phi^{-5/2})',
    ],
    link: '/closure-routes',
  },
  {
    term: "algebraic vs geometric residual-gap convergence",
    category: 'numerical',
    definition:
      "The diagnostic that distinguishes power-law (algebraic) from exponential (geometric) " +
      "decay of the residual gap resid(DEG) = G(s) - gap(DEG) as the polynomial degree DEG " +
      "increases. " +
      "\n\nGeometric convergence: the ratio resid(DEG)/resid(DEG-2) converges to a CONSTANT " +
      "r < 1 as DEG grows. Each increment of DEG multiplies the residual by the same factor, " +
      "giving an exponential envelope resid ~ C * r^(DEG/2). " +
      "\n\nAlgebraic (power-law) convergence: the ratio resid(DEG)/resid(DEG-2) RISES TOWARD 1 " +
      "as DEG grows, never settling at a constant below 1. The envelope instead follows " +
      "resid ~ C * DEG^(-p) for some exponent p > 0. The ratio test detects this because " +
      "(DEG/(DEG-2))^(-p) -> 1 from above as DEG -> inf. " +
      "\n\nImp-3196 diagnostic: for the monomial-basis residual gap at equal-s cells " +
      "(s = a*U in 0.8..3.0), the ratio resid(DEG)/resid(DEG-2) rises toward 1 (observed " +
      "range ~0.78-0.91 at DEG=8-10), confirming an algebraic tail with fitted exponent " +
      "p rising monotonically from ~1.49 at s=0.8 to ~1.72 at s=3.0. The algebraic fit " +
      "achieves R^2 ~ 0.996-0.999 vs geometric fit R^2 ~ 0.96-0.97. " +
      "\n\nConsequence: the cosh-monomial basis is NOT exponentially efficient for this " +
      "problem; the gap(DEG) series converges slowly (power-law). Richardson extrapolation " +
      "(imp-3223) can extend the reach beyond the DEG<=10 conditioning ceiling (imp-3153). " +
      "A better-conditioned non-monomial basis (imp-3235) might recover geometric convergence.",
    firstUsed: "imp-3196 (residual-gap convergence-rate sweep), 2026",
    relatedTerms: [
      "section-26-vs-monomial gap (D1-D4)",
      "bridge-kernel sign-free / magnitude-binding split",
      "golden-ratio residual-gap maximum (phi^{-5/2})",
    ],
    link: '/closure-routes',
  },
  {
    term: "pointwise degree-0 cover margin (e^{-a*tau})",
    category: 'numerical',
    definition:
      "The exact scalar margin by which the passive term dominates the shear term at every " +
      "lag tau, at polynomial degree 0 (constant approximant). The passive kernel is " +
      "cosh(a*tau) and the shear kernel is sinh(a*tau); their difference is " +
      "cosh(a*tau) - sinh(a*tau) = e^{-a*tau}, which is strictly positive for all finite tau. " +
      "\n\nThis means the degree-0 cover is not merely a MEAN-level statement: the passive " +
      "term exceeds the shear term AT EVERY INDIVIDUAL LAG tau, not just on average. No " +
      "tau-interval can make sinh(a*tau) >= cosh(a*tau), so there is no local failure. " +
      "\n\nConsequences (imp-3156): the degree-0 occupation deficit D_pass = 0 exactly " +
      "(no lag is uncovered), and the covered fraction coveredFraction = 1 exactly. " +
      "Both hold for all shear weights a > 0 and all truncation windows, with no " +
      "finite-N or finite-tau corrections. " +
      "\n\nContrast with higher degrees: at degree >= 1 the approximant introduces a " +
      "sign-dependent shear component that can create local exceedances at large tau, " +
      "so the pointwise cover no longer holds automatically and the occupation deficit " +
      "becomes non-trivial.",
    firstUsed: "imp-3156 (pointwise passive-over-shear cover), 2026",
    relatedTerms: [
      "bridge-kernel sign-free / magnitude-binding split",
      "section-26-vs-monomial gap (D1-D4)",
    ],
    link: '/closure-routes',
  },
  {
    term: "saturating-gap closed form (tanh(aU) - tanh(aU/2))",
    category: 'numerical',
    definition:
      "The strictly-positive closed-form limit that the basis-invariant residual gap " +
      "||R_orth|| - max_j R_orth_jj saturates toward as the monomial truncation degree DEG " +
      "increases. R_orth = L H L^T is the orthogonalized shear operator (L = (Cholesky of " +
      "the FULL passive cosh Gram)^{-1}), so the passive Gram becomes the identity and the " +
      "gap is truly basis-invariant. " +
      "\n\nThe limit is pinned by two analytic anchors: (1) the operator norm ||R_orth|| " +
      "equals the largest cosh-weighted Rayleigh quotient of tanh(a*tau) on [0,U], which is " +
      "strictly bounded by tanh(a*U) and converges to it from below as DEG grows (imp-3104). " +
      "(2) The largest diagonal max_j R_orth_jj is permanently fixed at tanh(a*U/2) " +
      "(the constant-direction diagonal floor) regardless of DEG. Hence the gap converges " +
      "to tanh(a*U) - tanh(a*U/2) from below. " +
      "\n\nAt the headline cell a = 0.5, U = 6 this limit is tanh(3) - tanh(1.5) ~ 0.08991, " +
      "and the sweep over DEG in {2,4,6,8,10} confirms the gap rises monotonically " +
      "(0.08471 -> 0.08959) with strictly shrinking increments, reaching within 3.15e-4 " +
      "of the analytic limit at DEG = 10 -- a ~16x distance shrink across the sweep. " +
      "\n\nSIGNIFICANCE (imp-3125): the intrinsic basis-invariant obstruction neither grows " +
      "unbounded (no divergence) nor vanishes (no cancellation) -- it converges to a " +
      "strictly positive constant. This is a structural / diagnostic finding; the trend " +
      "carries no RH verdict.",
    firstUsed: "imp-3125 (orthogonalized residual gap degree sweep), 2026",
    relatedTerms: [
      "constant-direction diagonal floor (R_orth_00 = tanh(aU/2))",
      "orthogonalized shear operator (R_orth)",
      "section-26-vs-monomial gap (D1-D4)",
    ],
    link: '/closure-routes',
  },
  {
    term: "constant-direction diagonal floor (R_orth_00 = tanh(aU/2))",
    category: 'numerical',
    definition:
      "The largest diagonal of the orthogonalized shear operator R_orth = L H L^T, achieved " +
      "at the j = 0 (constant function) direction at every truncation degree DEG. It equals " +
      "the closed form R_orth_00 = (cosh(aU) - 1) / sinh(aU) = tanh(aU/2), " +
      "the cosh-weighted Rayleigh quotient of the constant function on [0, U]. " +
      "\n\nCRUCIAL PROPERTY: R_orth_00 is DEG-INDEPENDENT. Adding higher-degree monomials to " +
      "the basis cannot change the constant-function direction normalization, so the floor " +
      "is pinned at tanh(aU/2) to machine precision throughout the entire degree sweep. " +
      "\n\nAt the headline cell a = 0.5, U = 6 this floor is tanh(1.5) ~ 0.90515, confirmed " +
      "pinned across DEG in {2,4,6,8,10} in imp-3125. Combined with the operator norm " +
      "||R_orth|| converging to tanh(aU) from below (imp-3104), the fixed floor makes the " +
      "residual gap ||R_orth|| - max_j R_orth_jj converge to the saturating-gap closed form " +
      "tanh(aU) - tanh(aU/2) ~ 0.08991. " +
      "\n\nSIGNIFICANCE: because the floor is pinned, the only moving part in the gap is " +
      "the operator norm; the saturation rate is therefore set entirely by how fast " +
      "||R_orth|| climbs toward tanh(aU) as DEG increases.",
    firstUsed: "imp-3125 (orthogonalized residual gap degree sweep), 2026",
    relatedTerms: [
      "saturating-gap closed form (tanh(aU) - tanh(aU/2))",
      "orthogonalized shear operator (R_orth)",
    ],
    link: '/closure-routes',
  },
  {
    term: "analytic ceiling lemma (Q(f) <= tanh(aU))",
    category: 'numerical',
    definition:
      "The function-space-complete upgrade of the imp-3104 monomial DEG-sweep saturation: " +
      "over EVERY f in L2([0, U]) (not merely finite monomial truncations), the scalar " +
      "cosh passive-core Rayleigh quotient " +
      "Q(f) = int_0^U sinh(a*tau) f(tau)^2 dtau / int_0^U cosh(a*tau) f(tau)^2 dtau " +
      "satisfies Q(f) <= tanh(a*U) < 1. " +
      "\n\nPROOF SKETCH: sinh(a*tau) = cosh(a*tau)*tanh(a*tau), and tanh is strictly " +
      "increasing, so tanh(a*tau) <= tanh(a*U) pointwise on [0, U]. Integrating this " +
      "pointwise inequality against the nonnegative weight cosh(a*tau) f^2 gives the bound " +
      "for EVERY f -- no basis, no truncation, no degree required. " +
      "\n\nSHARP BUT NOT ATTAINED: the concentrating indicator family f_delta = " +
      "1_[U-delta,U] drives Q(f_delta) -> tanh(a*U) as delta -> 0+, so the bound is tight, " +
      "but equality would force all of f's mass onto the single point tau = U (Lebesgue-null), " +
      "impossible for an L2 function -- the supremum is never attained. " +
      "\n\nOPERATOR-ORDER COROLLARY: as quadratic forms H <= tanh(a*U) * P (P the cosh " +
      "passive Gram, H the sinh shear form), so the passive core dominates the shear form " +
      "with guaranteed normalized deficit >= 1 - tanh(a*U) > 0, and no scalar cosh passive " +
      "core can do better than this margin. " +
      "\n\nSIGNIFICANCE (imp-3288): imp-3104 only measured ||R_orth|| approaching tanh(a*U) " +
      "from below over finite monomial truncations; this lemma certifies the SAME ceiling " +
      "holds over the entire L2 span, closing the measured-from-below gap rigorously. " +
      "It is a NEGATIVE result about the SCALAR cosh passive core ONLY -- it does not touch " +
      "operator-positivity K_a >= 0, makes no claim about the cover, and carries no RH verdict.",
    firstUsed: "imp-3288 (analytic ceiling lemma, full-L2 upgrade), 2026",
    relatedTerms: [
      "saturating-gap closed form (tanh(aU) - tanh(aU/2))",
      "constant-direction diagonal floor (R_orth_00 = tanh(aU/2))",
      "orthogonalized shear operator (R_orth)",
    ],
    link: '/closure-routes',
  },
  {
    term: "asym-onset ledger rigor-status taxonomy",
    category: 'numerical',
    definition:
      "The four-tier classification applied to every row in the asymmetric-isolation onset " +
      "ledger, recording HOW the onset value was established and whether it is a valid " +
      "lower bound on the global isolation constant c_glob. " +
      "\n\nThe four tiers are:" +
      "\n\n(1) CLOSED-FORM-EXACT: onset derived analytically, e.g. the symmetric two-body " +
      "value c_sym = arctan(1)/pi ~ 0.25. Rigorously bounds c_glob from above IF it is a " +
      "genuine isolation transition; useless as a lower bound without proof." +
      "\n\n(2) CERTIFIED-NUMERICAL-INF: onset obtained by a certified numerical infimum " +
      "over a well-defined family, e.g. Config-B onset 0.9015828 (imp-3200) verified via " +
      "bisection to full integration tolerance. Provides a valid UPPER BOUND on c_glob " +
      "within the tested family; NOT a lower bound unless the family is provably exhaustive." +
      "\n\n(3) RANDOM-SCAN: onset found by random search over environment configurations. " +
      "Provides only a heuristic upper bound -- the search may have missed lower onsets. " +
      "Cannot bound c_glob from above certifiably, and certainly not from below." +
      "\n\n(4) SELECTOR-ARTIFACT: onset produced by a GLOBAL nearest-particle selector " +
      "(e.g. imp-3045/imp-3173/imp-3194 bisection over the global min-gap). The bisector " +
      "locks onto a TIE in the discrete spacing rather than a smooth isolation transition; " +
      "the recorded onset is an artifact of which particle pair the selector latches onto, " +
      "NOT a property of the environment. Selector-artifact rows are diagnostically useful " +
      "for understanding tie structure but DO NOT BOUND c_glob in any direction. " +
      "\n\nSIGNIFICANCE: confusing selector-artifact onsets with certified-numerical-inf " +
      "onsets is the primary source of false brackets in the asymmetric ledger. A row " +
      "that reads onset ~ 0.906 from a global-selector bisection looks numerically close " +
      "to the Config-B certified 0.9015828, but the two carry completely different " +
      "epistemic weight. Only certified-numerical-inf and closed-form-exact rows can " +
      "bracket c_glob; random-scan and selector-artifact rows cannot.",
    firstUsed: "imp-3246 (asym-onset ledger rigor-status taxonomy), 2026",
    relatedTerms: [
      "global asymmetric isolation constant (c_glob)",
      "selector-artifact onset (imp-3045/3173/3194)",
      "Config-B certified onset 0.9015828 (imp-3200)",
    ],
    link: '/spectral-attack',
  },
  {
    term: "hollow antisymmetric shear Gram (Gshear)",
    category: 'numerical',
    definition:
      "The de Branges Wronskian kernel Gshear(u,v) = q(u)p(v) - p(u)q(v), where " +
      "p(tau) = Phi(tau) cosh(a*tau) and q(tau) = Phi(tau) sinh(a*tau). " +
      "This kernel is ANTISYMMETRIC (Gshear(v,u) = -Gshear(u,v)) and HOLLOW: " +
      "Gshear(0,v) = 0 for every v, because sinh(0) = 0 forces q(0) = 0, " +
      "so the entire tau=0 row/column of the discretized Gram vanishes. " +
      "\n\nINDEFINITENESS: the operator associated with Gshear has a spectrum " +
      "symmetric about zero; its minimum eigenvalue is ~ -||Gshear|| (the operator " +
      "norm of |Gshear|), confirmed numerically across resolution in imp-3197 and " +
      "imp-3252. The spectral symmetry is the hallmark of an antisymmetric kernel: " +
      "if lambda is an eigenvalue then so is -lambda. " +
      "\n\nCRUCIAL OBSTRUCTION: no scalar multiple of the identity and no positive " +
      "diagonal operator can dominate Gshear in the semidefinite (Loewner) order. " +
      "Domination D >= Gshear requires D - Gshear >= 0, which forces D to have at " +
      "least as much negative spectral mass as Gshear. A scalar or diagonal passive " +
      "core K_a has all non-negative eigenvalues by construction, so K_a - Gshear " +
      "must have a negative eigenvalue of magnitude ~ ||Gshear||; the semidefinite " +
      "condition K_a >= Gshear is infeasible for any K_a >= 0. " +
      "\n\nSIGNIFICANCE (section 26 mupass verdict): this is the core reason why " +
      "no scalar or diagonal passive-core ansatz for the de Branges bridge can " +
      "dominate the shear term. The off-diagonal bridge would need to absorb the " +
      "entire negative spectral mass of Gshear, which the mupass deficit and " +
      "partial-isometry tautology analyses show is impossible without circular " +
      "construction (||R|| = 1.0000 only when Gpass = |Gshear|, i.e. the passive " +
      "core is defined by the very operator it is supposed to dominate).",
    firstUsed: "imp-3197 (mupass bridge sign analysis), 2026",
    relatedTerms: [
      "section-26 mupass operator verdict",
      "partial-isometry tautology (||R||=1.0000 exact)",
      "mass-feasibility vs operator-positivity",
      "asym-onset ledger rigor-status taxonomy",
      "rank-2 shear-Gram spectral reduction (Gshear = p q^T - q p^T)",
    ],
    link: '/spectral-attack',
  },
  {
    term: "rank-2 shear-Gram spectral reduction (Gshear = p q^T - q p^T)",
    category: 'numerical',
    definition:
      "The exact spectral structure behind the hollow antisymmetric shear Gram, obtained by " +
      "expanding sinh(a(v-u)) = sinh(av)cosh(au) - cosh(av)sinh(au). Writing " +
      "p_i = Phi_i cosh(a u_i) and q_i = Phi_i sinh(a u_i), the kernel becomes " +
      "Gshear = p q^T - q p^T -- a RANK-2 REAL ANTISYMMETRIC matrix, regardless of grid size N. " +
      "\n\nEXACT EIGENVALUES: on the 2D span{p, q}, the reduced 2x2 block has TRACE " +
      "<q,p> - <p,q> = 0 (identically, for any p, q) and DETERMINANT " +
      "|p|^2 |q|^2 - <p,q>^2 = mu^2 (a Cauchy-Schwarz-type quantity). A traceless 2x2 block with " +
      "determinant mu^2 has eigenvalues +/- i mu, so the Hermitian operator i*Gshear has exactly " +
      "two nonzero eigenvalues +/- mu, and every other direction (orthogonal to span{p,q}) is in " +
      "the kernel. Hence min eig(Gshear) = -mu = -||Gshear|| EXACTLY -- not a fine-resolution " +
      "limit, but an algebraic identity that holds at every N. imp-3252 confirms this numerically " +
      "via two independent routes (analytic rank-2 mu vs. power-iteration operator norm), agreeing " +
      "to ~1e-15 at every rung of the N in {160..800} ladder, with reduced-block trace 0 to machine " +
      "precision. " +
      "\n\nWHY IT FORCES THE PARTIAL-ISOMETRY TAUTOLOGY: because the +/- mu pairing is forced by " +
      "the rank-2 antisymmetric structure (not by any resolution or construction choice), the " +
      "Gpass = |Gshear| ansatz attaining ||R|| = 1.0000 is likewise forced -- it is a tautology of " +
      "the polar decomposition, holding identically rather than as a numerical coincidence.",
    firstUsed: "imp-3252 (shear-Gram min-eig symmetric-spectrum N-scaling), 2026",
    relatedTerms: [
      "hollow antisymmetric shear Gram (Gshear)",
      "partial-isometry tautology (||R||=1.0000 exact)",
      "section-26 mupass operator verdict",
    ],
    link: '/spectral-attack',
  },
  {
    term: "partial-isometry tautology (||R||=1.0000 exact)",
    category: 'numerical',
    definition:
      "In the section-26 mupass operator verdict, the passive-core ratio ||R|| is defined " +
      "as ||Gpass|| / ||Gshear||, where Gpass is the passive (positive-semidefinite) part of " +
      "a de Branges bridge ansatz. The verdict records ||R|| = 1.0000 EXACTLY in the case " +
      "where the ansatz is set to Gpass = |Gshear| (the absolute-value operator of Gshear). " +
      "\n\nWHY THIS IS CIRCULAR: When one sets Gpass := |Gshear|, the ratio trivially equals " +
      "||Gpass|| / ||Gshear|| = |||Gshear||| / ||Gshear|| = ||Gshear|| / ||Gshear|| = 1. " +
      "The polar decomposition of Gshear writes Gshear = R |Gshear|, where R is the partial " +
      "isometry part. Setting Gpass = |Gshear| therefore makes R the partial isometry of " +
      "Gshear itself -- R reads its answer off the very operator it is supposed to dominate. " +
      "No independent construction of a passive core occurs; the unit ratio is a tautology " +
      "of the polar decomposition, not an evidence that a genuine passive core can achieve " +
      "||R|| = 1. " +
      "\n\nCONSEQUENCE: The fact that ||R|| = 1.0000 for the choice Gpass = |Gshear| does " +
      "NOT mean a passive core can dominate Gshear in the Loewner (semidefinite) order. " +
      "Operator domination K_a >= Gshear requires K_a - Gshear >= 0; since Gshear is " +
      "indefinite (minimum eigenvalue ~ -||Gshear||), any K_a >= 0 fails this condition. " +
      "The tautological ||R|| = 1 merely confirms that |Gshear| has the same operator norm " +
      "as Gshear, which is true for any operator by definition of the absolute value. " +
      "\n\nSIGNIFICANCE: the tautology is NOT an independent passive-core construction. " +
      "A genuine passive-core bridge would need to construct Gpass from the physics of the " +
      "de Branges chain without referring to Gshear, and then show K_a >= Gshear. The " +
      "partial-isometry tautology forecloses this: any ansatz that sets Gpass proportional " +
      "to |Gshear| is circular, and no K_a >= 0 can dominate the indefinite Gshear.",
    firstUsed: "imp-3260 (partial-isometry tautology glossary), 2026",
    relatedTerms: [
      "hollow antisymmetric shear Gram (Gshear)",
      "section-26 mupass operator verdict",
      "mass-feasibility vs operator-positivity",
      "K_a >= 0 operator-order obstruction",
    ],
    link: '/spectral-attack',
  },
  {
    term: "mass-feasibility vs operator-positivity",
    category: "proof-status",
    definition:
      "Two distinct necessary conditions for the section26 bridge construction, carrying " +
      "entirely different epistemic weight.\n\n" +
      "MASS-FEASIBILITY (NECESSARY, NOT SUFFICIENT): The section26-mupass verdict finds that " +
      "the deg-2 occupation deficit (~9.28e-9) sits 3-4 orders of magnitude below the " +
      "off-diagonal bridge budget. This kills only one specific IMPOSSIBILITY route -- it rules " +
      "out the scenario where the deficit alone is too large for any passive-core construction " +
      "to absorb. It does NOT construct a passive core, does NOT establish K_a >= 0 in the " +
      "Loewner order, and does NOT close the bridge argument.\n\n" +
      "OPERATOR-POSITIVITY (BINDING REQUIREMENT): The residual obstruction is the operator " +
      "inequality K_a >= Gshear in the Loewner (semidefinite) order. Since Gshear is indefinite " +
      "(hollow antisymmetric shear Gram, minimum eigenvalue ~ -||Gshear|| ~ -4.8e-6), any " +
      "candidate passive core K_a >= 0 fails the domination condition K_a - Gshear >= 0. " +
      "Mass-feasibility arguments cannot bridge this gap: an operator with sufficiently large " +
      "total mass (trace) can still be indefinite and violate K_a >= Gshear pointwise.\n\n" +
      "CONSEQUENCE: reading the section26 deficit result as evidence that the bridge is " +
      "'almost closed' conflates a mass integral (scalar, positive) with an operator-order " +
      "condition (matrix inequality, signed). The correct summary is: mass-feasibility is " +
      "NECESSARY-BUT-NOT-SUFFICIENT; operator-positivity K_a >= 0 for the full bridge kernel " +
      "K_a = Gpass - Gshear is the binding open requirement (RH-EQUIVALENT).",
    firstUsed: "imp-3261 (mass-feasibility vs operator-positivity glossary), 2026",
    relatedTerms: [
      "partial-isometry tautology (||R||=1.0000 exact)",
      "hollow antisymmetric shear Gram (Gshear)",
      "section-26 mupass operator verdict",
      "K_a >= 0 operator-order obstruction",
    ],
    link: '/closure-routes',
  },
  {
    term: "section26-mupass residual = K_a >= 0 (RH-equivalent, not a reduction)",
    category: "proof-status",
    definition:
      "The 2026-06-30 section26-mupass operator verdict's final characterization of what " +
      "remains open after both surviving construction routes (mass-feasibility and " +
      "scalar/diagonal passive cores) are closed. The endpoint-bridge sign-positivity " +
      "derived from Phi ALONE (not from |Gshear|'s own spectrum) IS the no-ghost " +
      "positivity Gpass >= Gshear, equivalently ||R|| <= 1, equivalently the operator " +
      "inequality K_a >= 0 for the full bridge kernel K_a = Gpass - Gshear. This is an " +
      "INFORMATION-PRESERVING RESTATEMENT of RH-equivalence, not progress toward it: the " +
      "residual is exactly as hard as the operator-positivity condition itself, so the " +
      "verdict is correctly read as RH-EQUIVALENT and explicitly NOT a reduction below RH. " +
      "\n\nTHE DEGREE-0 MASS-BUDGET PROXY IS CIRCULAR: separately from the deg-2 " +
      "occupation-deficit mass-feasibility argument (see mass-feasibility vs " +
      "operator-positivity), the section26-mupass verdict also runs a degree-0 " +
      "(scale-invariant) mass-budget comparison -- the cosh-completion bridge mass " +
      "B = sinh(aU)/a - U ~ 14.04 against the raw degree-0 deficit mass D_0 ~ 13.07 " +
      "(B/D = 1.074, locked by imp-3267). This comparison is CIRCULAR: its budget proxy " +
      "IS ||V||, the Volterra operator norm that is itself the RH-equivalent quantity " +
      "under study, so a favorable B/D ratio cannot certify anything beyond what ||V|| " +
      "already encodes -- it restates the target, it does not independently bound it. " +
      "\n\nCONSEQUENCE: neither the deg-2 mass-feasibility margin nor the degree-0 B/D " +
      "ratio touches the binding requirement. Both are necessary-but-not-sufficient " +
      "mass checks; the sole surviving obstruction across the whole section26-mupass " +
      "cluster is the single operator-positivity statement K_a >= 0, RH-equivalent, " +
      "untouched. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA; no QED.",
    firstUsed: "imp-3397 (section26-mupass residual glossary), 2026",
    relatedTerms: [
      "mass-feasibility vs operator-positivity",
      "partial-isometry tautology (||R||=1.0000 exact)",
      "hollow antisymmetric shear Gram (Gshear)",
      "section-26 mupass operator verdict",
    ],
    link: '/closure-routes',
  },
  {
    term: "Theorem-B minimal-gap sharp threshold (Theta_b)",
    category: "constant",
    definition:
      "The EXACT sharp threshold Theta_b = (sqrt(73) - 5) / 8 = 0.443000... below which " +
      "the static minimal-gap trap dTheta/ds <= 0 is guaranteed for the adjacent pair in " +
      "the Calogero-Moser flow (Theorem B of sg1c-theta-trap-theorems). " +
      "\n\nPROOF SKETCH: Define normalized tensions mu_j = g^2 T_j (each mu_j <= 1/2 by " +
      "minimality of g) and Theta = g^2 E / 2 = (sum mu_j) / 2. The key object is the " +
      "quartic combination of power sums that appears in dTheta/ds; since power sums are " +
      "SCHUR-CONVEX, the worst-case (maximum) is achieved by the CAPPED-GREEDY profile, " +
      "which packs as much mass as possible at the cap mu = 1/2 and places the remainder " +
      "in one smaller particle. On this extremal profile the boundary condition reduces to " +
      "r(2r^2 + 7r - 3) <= 0, where Theta = 1/4 + r/2; setting the bracket to zero gives " +
      "the positive root r* = (-7 + sqrt(73)) / 4, hence Theta_b = 1/4 + r*/2 = (sqrt(73) - 5) / 8. " +
      "\n\nSHARPNESS (Theorem B is exact, not merely an upper estimate): The capped-greedy " +
      "profile is REALIZED by the environment configuration d_1 = g on one side, " +
      "d_2 ~ 1.185 g on the opposite side. This config achieves dTheta/ds = 0 exactly at " +
      "Theta_b, and dTheta/ds = +0.034 > 0 at Theta = 0.448 (just above threshold), " +
      "confirming the threshold is tight -- no static bound can cover Theta* > Theta_b. " +
      "\n\nWHAT THEOREM B BUYS vs THEOREM A (Theta* = 1/4): Theorem B broadens the trap to " +
      "a wider initial-condition class (all configs with Theta(0) <= 0.443, not just <= 1/4). " +
      "COLLISION-TIME CAVEAT: plugging Theta_b into the Corollary A1 ceiling gives a LARGER " +
      "constant 13 - sqrt(73) ~ 4.456 vs the Theorem A constant 6, i.e. t_c <= g_min(0)^2 / " +
      "(13 - sqrt(73)). So Theorem B trades a tighter ceiling for a broader hypothesis. " +
      "\n\nREFUTED BAND CONSEQUENCE: the capped-greedy saturating profile shows every Theta* in " +
      "(0.443, 0.5073) is CROSSED UPWARD by some explicit 4-particle family {-d, 0, 1, 1+d}. " +
      "Static bounds are provably exhausted at Theta_b; the residual R1 excursion cap is " +
      "purely DYNAMICAL (minimality-transfer argument). " +
      "\n\nHonest scope: Theorem B is a RIGOROUS STATIC bound on the isolated-pair basin. " +
      "The real-zero configurations measured have Theta(0) in {0.167, 0.088, 0.046}, well " +
      "below both 1/4 and 0.443, so Theorem A already applies there unconditionally. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA; no QED.",
    firstUsed: "sg1c-theta-trap-theorems / imp-3042 (Theorem-B sharpness tabulation), 2026",
    relatedTerms: [
      "Theta-trap",
      "excursion cap",
      "isolation ratio rho",
      "Lipschitz/Gronwall route foreclosure",
    ],
    link: "/spectral-attack",
  },
  {
    term: "E(N) bridge-constant reframing",
    category: "proof-status",
    definition:
      "The correct reading of the Step-4 bridge | Lambda + t_c(N) | <= E(N), from imp-2564, " +
      "establishing what SG1 / Theta / imp-2520 collision-bound descendants actually control " +
      "versus what governs the headline Lambda <= 0 route to RH.\n\n" +
      "HEADLINE INEQUALITY (Lambda <= E(N)): Inserting only the trivial lower bound t_c >= 0 " +
      "into the upper face of the bracket gives Lambda <= -0 + E(N) = E(N). Driving this to " +
      "<= 0 (RH) requires only E(N) -> 0. The trivial t_c >= 0 suffices for the headline; " +
      "no per-N sharpening of the collision time is needed for the Lambda upper bound itself.\n\n" +
      "WHAT COLLISION BOUNDS ACTUALLY BUY: SG1 and its descendants produce UPPER bounds " +
      "t_c(N) <= U. An upper bound feeds the LOWER face of the bracket: Lambda >= -U - E(N). " +
      "Since U, E(N) >= 0, this lower bound is always non-positive and is dominated by the " +
      "unconditional Rodgers-Tao floor Lambda >= 0. Upper bounds on t_c therefore do NOT " +
      "advance the headline Lambda <= 0 inequality directly.\n\n" +
      "FIDELITY ROLE (CORRECT FRAMING): What per-N collision bounds do control is the BRIDGE " +
      "CONSTANTS E(N) -- how faithfully the truncated N-particle collision proxy tracks the " +
      "true Lambda. A sharper collision-time estimate tightens E(N), making the per-N model a " +
      "more faithful surrogate of the infinite-volume limit. The SG1 / Theta program improves " +
      "model fidelity (shrinks E(N)), not headline-inequality leverage.\n\n" +
      "CONSEQUENCE: The roadmap narrative framing SG1 as the headline lever must be replaced " +
      "by: SG1 tightens E(N); only E(N) -> 0 closes the bridge to RH. This reframing was " +
      "established by the signed-direction audit of imp-2564 after two independent fanout " +
      "referees flagged a directional inconsistency in the t_c -> Lambda bookkeeping.",
    firstUsed: "imp-2564 (chain-direction audit), imp-3262 (glossary entry), 2026",
    relatedTerms: [
      "bridge error E(N)",
      "Step-4 bridge",
      "SG1 theta-contraction",
      "Rodgers-Tao floor (Lambda >= 0)",
      "collision time t_c(N)",
    ],
    link: '/closure-routes',
  },
  {
    term: "IEEE-754 kernel underflow horizon (de Bruijn-Newman Phi)",
    category: "numerical",
    definition:
      "The lag u at which the n=1 term of the kernel Phi(u) = sum_n (2 pi^2 n^4 e^{9u} - 3 pi n^2 " +
      "e^{5u}) exp(-pi n^2 e^{4u}) first drops below the smallest positive IEEE-754 double " +
      "(2^-1074) and is rounded to exactly 0.0. Solving pi X - ln(2 pi^2 X) = ln(1/2^-1074) for " +
      "X = e^{4u} gives the closed form u_horizon = (1/4) ln(X) ~ 1.367 -- a fixed point of the " +
      "double-precision representation, not a zero or root of Phi itself. " +
      "\n\nWHY IT MATTERS: imp-3199's raw overflow-panel sweep measured a support length ~1.2535 " +
      "for the interval [tau_1, tau_2] where |Phi| exceeds a numerical panel threshold, and read " +
      "tau_2 ~1.366 as a genuine Phi-autocorrelation crossover. imp-3216 showed tau_2 instead " +
      "PINS to this underflow horizon: it stays ~constant as the truncation window U grows " +
      "(measured support shrinks like 1/U while the true fraction (U - tau_1)/U rises to 1), " +
      "and the closed form above reproduces the bisection-measured horizon to within 0.01. " +
      "\n\nHONEST SCOPE: only tau_1 ~0.111 (the genuine nu/mu crossover) carries mathematical " +
      "content; lag-length diagnostics that treat tau_2 or the raw ~1.2535 measure as a Phi " +
      "structural feature are reporting arithmetic bookkeeping of double-precision underflow, " +
      "not a property of Phi. Sites built on the raw imp-3199 measurement should re-point to the " +
      "imp-3216 closed form (see imp-3315 consumer audit).",
    firstUsed: "imp-3216 (closed-form derivation), imp-3316 (glossary entry), 2026",
    relatedTerms: [
      "overflow-support-length (imp-3199)",
      "kernel Phi(u)",
      "underflow-horizon lock (imp-3312)",
      "nu/mu crossover",
    ],
    link: "/closure-routes",
  },
  {
    term: "two-tail underflow horizons (tau_mu, tau_nu) and the (1/4)ln2 band",
    category: "numerical",
    definition:
      "imp-3216 showed the section-26 overflow region [tau_1, tau_2] ends by arithmetic " +
      "underflow of the kernel rather than a genuine crossover. imp-3309 shows there are " +
      "actually TWO such underflow horizons, one per density, because the two densities " +
      "carry different tails in X = e^{4u}: nu(tau) carries a single-Phi tail " +
      "~2 pi^2 X exp(-pi X), while mu(tau) carries a Phi^2 tail ~4 pi^4 X^2 exp(-2 pi X). " +
      "Each underflows to exactly 0.0 once its magnitude drops below the smallest positive " +
      "IEEE-754 subnormal 2^-1074, giving two closed-form fixed points of the same threshold " +
      "L = ln(2^1074) ~ 744.44: pi X - ln(2 pi^2 X) = L for tau_nu ~ 1.370, and " +
      "2 pi X - ln(4 pi^4 X^2) = L for tau_mu ~ 1.199. Both reproduce their measured " +
      "bisection horizons to within ~3e-3." +
      "\n\nBAND-WIDTH FINGERPRINT: because the mu exponent (2 pi X) is exactly TWICE the nu " +
      "exponent (pi X), X_mu ~ X_nu/2 to leading order, so tau_nu - tau_mu ~ (1/4) ln 2 ~ " +
      "0.1733 -- matching the exact band width 0.17094. mu therefore underflows FIRST, " +
      "leaving a band (tau_mu, tau_nu) where nu > 0 = mu, exactly as imp-3216's decisive " +
      "check required. The (1/4)ln2 gap is a direct fingerprint of the tail-exponent ratio " +
      "(2 vs 1), not of any Phi-autocorrelation length." +
      "\n\nHONEST SCOPE: DIAGNOSTIC only, confirming imp-3216 finding E2 in closed form for " +
      "both horizons. It re-derives no absolute deficit magnitude and proves no positivity; " +
      "a nonzero overflow fraction is necessary-but-not-sufficient at operator order, and the " +
      "off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone obstruction. " +
      "No RH verdict; Platt-Trudgian Lambda <= 0.2 stays SOTA.",
    firstUsed: "imp-3309 (closed-form derivation of both horizons), 2026",
    relatedTerms: [
      "IEEE-754 kernel underflow horizon (de Bruijn-Newman Phi)",
      "overflow-support-length (imp-3199)",
      "underflow-horizon lock (imp-3312)",
      "kernel Phi(u)",
    ],
    link: "/closure-routes",
  },
  {
    term: "termwise structural nonnegativity of Phi (last flip u_1*)",
    category: 'proof-status',
    definition:
      "The imp-3257 elementary proof that Phi_NPHI(u) >= 0 on [0,U] for EVERY U >= 0 and " +
      "every truncation NPHI, upgrading the imp-3197 bridge-sign agreement from a one-cell " +
      "measurement to a structural guarantee. " +
      "\n\nArgument: the nth kernel summand factors as pi*n^2*e^{2u} * (2*pi*n^2*e^{2u} - 3), " +
      "times a strictly positive Gaussian exp(-pi*n^2*e^{4u}). The strictly positive prefactor " +
      "and Gaussian leave the summand's sign equal to sign(2*pi*n^2*e^{2u} - 3), which is " +
      "nonneg exactly for u >= u_n* = (1/2)*ln(3/(2*pi*n^2)). The rightmost (worst-case, " +
      "largest) threshold is u_1* = (1/2)*ln(3/(2*pi)) = -0.36963238887, strictly negative. " +
      "\n\nSince [0,U] lies entirely to the right of every u_n* (u_1* being the rightmost), " +
      "every summand is nonneg on [0,U] for all n >= 1, and truncating at any NPHI only drops " +
      "nonneg terms -- so the truncated partial sum Phi_NPHI(u) stays nonneg on [0,U] for all " +
      "U >= 0 and all NPHI. This upgrades the imp-3197 bridge-SIGN half of the K_a>=0 " +
      "obstruction from measured-at-one-cell to STRUCTURAL. " +
      "\n\nHonest scope: the argument is SUFFICIENT but conservative -- it only guarantees " +
      "Phi >= 0 on [u_1*, infinity), not the full classical de Bruijn-Newman positivity below " +
      "u_1* (irrelevant here since imp-3197 only needs [0,U], a subset of [u_1*, infinity)). " +
      "The bridge-MAGNITUDE half (the ||Gshear|| operator-norm question) remains entirely " +
      "open and untouched by this result. RH-EQUIVALENT; no QED; " +
      "Platt-Trudgian Lambda <= 0.2 stays SOTA.",
    firstUsed: "imp-3257 (termwise structural proof), 2026",
    relatedTerms: [
      'bridge-kernel sign-free / magnitude-binding split',
      'Gshear operator norm (||Gshear||)',
      'kernel Phi(u)',
    ],
    link: '/closure-routes',
  },
  {
    term: "lag-band (box) truncation destroys Toeplitz positive-definiteness; Fejer stays PD",
    category: 'method',
    definition:
      "imp-3310 finding (A): zeroing a positive Toeplitz kernel outside a lag band |u-v| <= " +
      "cutoff -- a BOX truncation in lag -- is not a valid passive core, even though the " +
      "untruncated kernel is PD everywhere. Measured directly: Cholesky factorization of the " +
      "box-truncated Phi-weighted cosh bridge symbol FAILS (a negative pivot appears) at both " +
      "test cutoffs (lag <= 0.2 and lag <= 0.4), so C^{-1/2} does not exist and the symmetric-" +
      "normalization evaluator cannot even be applied." +
      "\n\nWhy: a box truncation is equivalent to multiplying the kernel's Fourier symbol by the " +
      "Dirichlet kernel (the transform of a rectangular lag window), which is NOT nonnegative -- " +
      "it oscillates and goes negative between its main lobes. Convolving a positive spectral " +
      "density with an indefinite window can produce a spectrum that dips negative, and a " +
      "kernel with a negative-somewhere spectrum is not positive-definite. The FEJER " +
      "(triangular) lag window used instead is the Cesaro-averaged, hence squared-magnitude, " +
      "transform of the Dirichlet kernel -- its Fourier symbol is a sum of squares, so it is " +
      "manifestly nonnegative everywhere, and convolving with a nonnegative window preserves a " +
      "nonnegative (hence PD) spectrum. This is the classical Fejer-vs-Dirichlet PD distinction, " +
      "here forcing the imp-3310 core-assembly recipe away from any naive box-truncated bridge " +
      "and toward a triangular (or otherwise manifestly PSD) near-diagonal weight." +
      "\n\nHonest scope: this rules out one entire recipe class (box truncation) but does not by " +
      "itself construct the exact out-of-repo assembly recipe -- the admissible Fejer-dominated " +
      "family matches the verdict's qualitative SHAPE but not its absolute scalars (see imp-3310). " +
      "Diagnostic/constructive-constraint only; RH-equivalent; no QED; Platt-Trudgian Lambda <= 0.2 " +
      "stays SOTA.",
    firstUsed: "imp-3310 (mupass-passive-core-assembly-recipe, finding A), 2026",
    relatedTerms: [
      'bridge-kernel sign-free / magnitude-binding split',
      'Toeplitz surrogate operator-norm capture ratio',
      'Gshear operator norm (||Gshear||)',
      'kernel Phi(u)',
    ],
    link: '/closure-routes',
  },
  {
    term: "raw physical-diagonal conditioning artifact (Gpass future-tail underflow)",
    category: 'numerical',
    definition:
      "imp-3382 finding: the recorded divergence of the raw physical-diagonal passive-core " +
      "normalized operator norm ||R||(D) = ||Gpass^{-1/2} Gshear Gpass^{-1/2}|| -- growing " +
      "from ~34 to ~45 with quadrature resolution and reaching ~1e272 in a degree-100 " +
      "Legendre basis -- is a CONDITIONING/precision signature of inverting Gpass, not a " +
      "bounded operator norm blowing up." +
      "\n\nMechanism: the raw physical diagonal density m(tau) = (1/2pi) Phi(tau)^2 " +
      "sinh(2 a tau) is super-exponentially concentrated near tau <= ~0.3 and UNDERFLOWS to " +
      "0 beyond tau ~ 1.2 -- the Sec.27 future tail. Its Legendre moment (Gram) matrix " +
      "Gpass(D) is therefore catastrophically ill-conditioned: log10 lambda_min(Gpass(D)) ~ " +
      "-4.31 - 3.846*D (R^2 ~ 0.9999, ~7000x shrink per degree, constant log-differences => " +
      "GEOMETRIC decay, not factorial or power), extrapolating to cond(Gpass(100)) ~ 10^385. " +
      "Inverting that matrix is what manufactures the recorded ~1e272 at degree 100 -- a " +
      "precision artifact of representing an astronomically ill-conditioned matrix, not a " +
      "genuine operator-norm divergence." +
      "\n\nBy contrast, the WELL-POSED (regularized pseudo-inverse) ||R||(D) -- inverting " +
      "only the numerically resolvable block of Gpass -- PLATEAUS O(1), growing only " +
      "mildly from ~0.75 (D=1) to ~1.33 (D=6): the smooth rank-2 shear pair (Q, Pc) lives " +
      "almost entirely in the well-conditioned low-degree block and barely excites the " +
      "exponentially-tiny tail null-space." +
      "\n\nHonest scope: this confirms and sharpens the section26-mupass verdict that the raw " +
      "physical diagonal is NOT a valid asymptotic passive core and must be renormalized -- " +
      "it is a diagnostic of WHY the raw diagonal fails, necessary but not sufficient at " +
      "operator order. IEEE-754 double floors lambda_min(Gpass) below the representable " +
      "relative floor by degree ~4, so the geometric law is fit on degrees {1,2,3} and " +
      "extrapolated; matching the exact recorded constants needs the out-of-repo " +
      "extended-precision arbiter. MEASUREMENT/DIAGNOSTIC ONLY; RH-equivalent; the " +
      "off-diagonal endpoint-Hankel obstruction (imp-3066) is untouched; no QED; " +
      "Platt-Trudgian Lambda <= 0.2 stays SOTA.",
    firstUsed: "imp-3382 (rawdiagonal-R-degree-growth-law), 2026",
    relatedTerms: [
      'lag-band (box) truncation destroys Toeplitz positive-definiteness; Fejer stays PD',
      'Gshear operator norm (||Gshear||)',
      'Toeplitz surrogate operator-norm capture ratio',
      'kernel Phi(u)',
    ],
    link: '/closure-routes',
  },
  {
    term: "onset-signature Taylor coefficients (sign-alternating A1..A4)",
    category: 'constant',
    definition:
      "The Taylor coefficients of the imp-3064 excess fraction phi(s) = G(s)/F(s), expanded " +
      "around its double pole at s0 = arcsinh(1) (sinh s0 = 1, cosh s0 = sqrt2). Dividing out " +
      "the double pole with C = sqrt2*(1-arcsinh1) (the onset quadratic-pole constant) gives the " +
      "analytic ONSET SIGNATURE S(eps) = phi(s0+eps) eps^2/C = 1 + A1 eps + A2 eps^2 + A3 eps^3 " +
      "+ A4 eps^4 + ..., telescoped coefficient-by-coefficient from the double-zero Taylor blocks " +
      "of F and G at s0. Writing G0 = 1 - arcsinh(1) = G(s0), the four coefficients have closed " +
      "forms: A1 = (sqrt2-1)/G0 - sqrt2/6 ~ +3.25605 (imp-3155), A2 = -(2 sqrt2-1)/(6 G0) - 1/36 " +
      "~ -2.59666 (imp-3222), A3 = (2 sqrt2+1)/(36 G0) + 11 sqrt2/1080 ~ +0.91088 (imp-3383), and " +
      "A4 = (sqrt2-1)/G0 * (-1/36 - 19 sqrt2/1080) - 7/6480 ~ -0.18495 (imp-3383 bonus term, added " +
      "to enable a genuine [2/2] Pade). The signs SIGN-ALTERNATE (+, -, +, -); each closed form " +
      "was checked against an exact series division of num/den to 1e-16 and, for A3, against an " +
      "independent Richardson extrapolation of a direct finite-eps evaluation of phi. The four " +
      "coefficients feed the imp-3383 higher-order Pade resummations ([2/1], [1/2], [2/2]) of the " +
      "onset signature. Degree-0 scalar diagnostic only; RH-equivalent; the off-diagonal " +
      "endpoint-Hankel obstruction (imp-3066) is untouched; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
    firstUsed: "imp-3155 (A1), imp-3222 (A2), imp-3383 (A3, A4, sign-alternation), 2026",
    relatedTerms: ['onset quadratic-pole divergence', 'envelope crossover handoff (s_cross1)'],
    link: '/closure-routes',
  },
  {
    term: "section-26 overflow-region geometry: [tau_1 genuine, horizon arithmetic] with no interior re-crossover",
    category: "numerical",
    definition:
      "imp-3384 finding: the section-26 overflow region has exactly ONE genuine mathematical " +
      "endpoint -- the lower crossover tau_1 ~0.111 where mu > nu flips to nu > mu (imp-3216, " +
      "imp-3307) -- and NO second interior crossover back to nu < mu anywhere below the " +
      "underflow horizons. Scanning every sign change of (nu - mu) strictly below the imp-3309 " +
      "mu horizon tau_mu ~1.199 finds exactly one flip at every truncation and grid resolution: " +
      "at tau_1 the gap only WIDENS afterward (min(nu/mu) ~2.08 just above tau_1, rising to " +
      "~1.6e148 near tau_mu), so nu never re-approaches mu from above." +
      "\n\nWHY: nu carries a single-Phi tail ~exp(-pi X) while mu carries a Phi^2 tail " +
      "~exp(-2 pi X) (X = e^{4u}), so their ratio nu/mu ~ exp(pi X) diverges MONOTONICALLY once " +
      "past tau_1 -- there is no mechanism for it to turn back toward 1. The region can " +
      "therefore only close from above by arithmetic underflow of the two densities at their " +
      "separate IEEE-754 horizons (mu first, at tau_mu ~1.199; nu second, at tau_nu ~1.370), " +
      "never by a second genuine crossover." +
      "\n\nHONEST SCOPE: this closes the open question left by imp-3216/imp-3309 (whether a " +
      "second interior crossover could exist) but re-derives no absolute deficit magnitude " +
      "and proves no positivity. Diagnostic only, necessary-but-not-sufficient at operator " +
      "order -- the off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone " +
      "obstruction. No RH verdict; Platt-Trudgian Lambda <= 0.2 stays SOTA.",
    firstUsed: "imp-3384 (interior-crossover-below-horizon scan), 2026",
    relatedTerms: [
      "two-tail underflow horizons (tau_mu, tau_nu) and the (1/4)ln2 band",
      "IEEE-754 kernel underflow horizon (de Bruijn-Newman Phi)",
      "kernel Phi(u)",
    ],
    link: "/closure-routes",
  },
  {
    term: "section26-mupass ruled-out passive-core family ladder (band / additive-Fejer / smooth / sharp-compact)",
    category: "method",
    definition:
      "The search for a scalar/near-diagonal passive core reproducing the section26-mupass " +
      "verdict pair (||R_c|| = 0.876 at lag <= 0.2, 0.711 at lag <= 0.40, scale-free ratio " +
      "1.2321) has moved through four candidate families, each ruled out for a distinct reason: " +
      "\n\n(1) BAND-TRUNCATED symbol (imp-3310 finding A): a box truncation in lag is not even " +
      "PD -- its Fourier symbol is the (indefinite) Dirichlet kernel, so Cholesky fails and the " +
      "evaluator cannot be applied at all. " +
      "\n\n(2) ADDITIVE-FEJER core (imp-3310 finding B): manifestly PD (Fejer symbol is a sum " +
      "of squares) and reaches the target RATIO 1.2321 at a weight w* ~ 3.94, but not the " +
      "absolute pair -- at w* the individual magnitudes miss 0.876/0.711, so ratio-match and " +
      "magnitude-match are mutually incompatible in this one-parameter family. " +
      "\n\n(3) SMOOTH Gaussian/exponential core (imp-3385): the intrinsic lag-0.2/lag-0.40 " +
      "contrast ratio is structurally capped at ~1.01-1.03 regardless of width, far below " +
      "1.2321 -- smooth decay is too flat to supply the needed contrast at all. " +
      "\n\n(4) SHARP-COMPACT Wendland core (imp-3427): hard compact support closes most of the " +
      "contrast-ratio gap left by (3), climbing from ~1.035 (smooth) to ~1.218 (Wendland-C2), " +
      "within ~1.2% of the verdict ratio 1.2321 -- confirming that a hard lag cutoff, not " +
      "smoothness, supplies contrast. But the near-verdict ratio is attained only where BOTH " +
      "magnitudes have collapsed to ~0.06, nowhere near the verdict's 0.876/0.711 -- so ratio " +
      "and magnitude decouple again, just as in family (2)." +
      "\n\nThe surviving residual across all four rulings: a milder, shape-tuned core with far " +
      "stronger lag-cutoff sensitivity than smooth decay supplies, yet gentler than a hard " +
      "compact edge, remains unconstructed. " +
      "\n\nHonest scope: diagnostic/constructive-constraint only -- no family in this ladder " +
      "reproduces the absolute verdict pair, and none bears on the endpoint-Hankel operator-norm " +
      "step (imp-3066), the lone obstruction. RH-equivalent; no QED; Platt-Trudgian Lambda <= 0.2 " +
      "stays SOTA.",
    firstUsed: "imp-3310 / imp-3385 / imp-3427 (mupass passive-core family search), 2026",
    relatedTerms: [
      "lag-band (box) truncation destroys Toeplitz positive-definiteness; Fejer stays PD",
      "Toeplitz surrogate operator-norm capture ratio",
      "Gshear operator norm (||Gshear||)",
      "kernel Phi(u)",
    ],
    link: "/closure-routes",
  },
  {
    term: "PCC-free x RH-equivalent route-matrix conclusion (empty live-target set)",
    category: "method",
    definition:
      "The section26-mupass verdict's nextMove reads: \"redirect to PCC-free routes not yet " +
      "shown RH-equivalent.\" imp-3381 enumerates that target set against the closure family -- " +
      "twin-ladder routes A/B/C/D, the Volterra ||V|| <= 1 collapse, the normalized-R/mu^pass " +
      "passive core, and the endpoint-Hankel operator step (imp-3066) -- and finds it EMPTY: " +
      "every one of those routes is already shown RH-equivalent (Theorem 16.1 plus the section26 " +
      "verdicts), while the sole closure-family route that is NOT a reformulation of RH -- " +
      "ESY/Selberg-trace -- is blocked squarely by the shared Montgomery pair-correlation-" +
      "conjecture 50-year wall, so it is not PCC-free either." +
      "\n\nRead literally, the nextMove therefore points OUT of the K_a-positivity closure " +
      "family, not to an untried closure route. The two opportunities that ARE genuinely " +
      "PCC-free and not yet RH-equivalent live outside that family entirely: the C_H/G6a " +
      "Holder-1/2 shock modulus on the Lambda-upper side (RANKED_OPPORTUNITIES rank 1, gated by " +
      "the imp-2640 refuted-Gronwall obstruction), and the under-explored winding-under-heat-flow " +
      "thread (a topological Lyapunov re-derivation whose realistic ceiling still will not beat " +
      "Platt-Trudgian)." +
      "\n\nHONEST SCOPE: assessment/scoping only -- no positivity, no reduction, no QED. " +
      "Confirms the full-route-map verdict of no hidden shortcut below RH inside the closure " +
      "family; imp-3066 remains the lone operator obstruction; Platt-Trudgian Lambda <= 0.2 " +
      "stays SOTA.",
    firstUsed: "imp-3381 (PCC-free route enumeration), 2026",
    relatedTerms: [
      "section26-mupass ruled-out passive-core family ladder (band / additive-Fejer / smooth / sharp-compact)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
      "Volterra collapse ||V|| <= 1",
    ],
    link: "/closure-routes",
  },
  {
    term: "Rank-2 hollow-antisymmetry (shear Gram Gshear = p q^T - q p^T)",
    category: "method",
    definition:
      "imp-3404 shows the hollow-antisymmetric shear Gram Gshear(u,v) = Phi(u) Phi(v) sinh(a (v - u)) " +
      "factors, since sinh is odd, as Gshear = p q^T - q p^T with p_i = Phi_i cosh(a u_i) and " +
      "q_i = Phi_i sinh(a u_i) -- a RANK-2 real antisymmetric matrix. A rank-2 antisymmetric matrix " +
      "has at most two nonzero singular values, coming in an equal pair, so i Gshear has spectrum " +
      "{ +mu, -mu, 0, ..., 0 } (N - 2 EXACT zeros) with mu^2 = |p|^2 |q|^2 - <p,q>^2. Because there " +
      "are no intermediate eigenvalues to vary, the normalized spectrum { +1, 0, ..., 0, -1 } is " +
      "IDENTICAL at every (a, U, Phi) cell -- the imp-3351 cell-independent identity min eig(i Gshear) " +
      "= -||Gshear|| is therefore a TRIVIAL algebraic consequence of this rank-2 hollow antisymmetry, " +
      "not extra structure: there is nothing intermediate left to be cell-dependent. imp-3404 measured " +
      "this at N = 240 across all 16 imp-3085 grid cells via three independent routes (analytic mu, " +
      "power-iteration top singular value, Frobenius energy), finding the extremal pair carries the " +
      "entire spectral energy to machine precision at every cell." +
      "\n\nHONEST SCOPE: structural/diagnostic only -- does not construct a dominating passive core and " +
      "does not attempt the K_a >= 0 positivity. The binding RH-equivalent residual (the imp-3066 " +
      "off-diagonal endpoint-Hankel step) is untouched; Platt-Trudgian Lambda <= 0.2 stays SOTA. No QED.",
    firstUsed: "imp-3404 (rank-2 hollow-antisymmetry full-spectrum cell-independence), 2026",
    relatedTerms: [
      "cell-independent min-eig identity (imp-3351)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
      "Gshear operator norm (||Gshear||)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Wiener-Khinchin numerator-norm identity (||Ttilde|| = a sup_xi |d/dxi |Phihat(xi)|^2|)",
    category: "method",
    definition:
      "imp-3400 gives a CLOSED FORM for the fixed capture-ratio numerator norm ||Ttilde|| behind the " +
      "imp-3346 constant C_inf ~ 0.1751, which imp-3346 had left with no closed form. In the a -> 0 " +
      "linear-shear limit, the numerator operator is the lag-stationary convolution kernel " +
      "Ttilde(u,v) = a(v-u) R(|v-u|), where R is the Phi autocorrelation, so its operator norm equals " +
      "the sup of its (odd, purely imaginary) Fourier symbol. Multiplying R by the lag t under the sine " +
      "transform is exactly the xi-derivative of the cosine transform of R, and by Wiener-Khinchin that " +
      "cosine transform is the Phi power spectral density Rhat(xi) = |Phihat(xi)|^2. The result: " +
      "||Ttilde|| = a * sup_xi |d/dxi |Phihat(xi)|^2|, i.e. a times the PEAK SLOPE of the Phi power " +
      "spectrum, attained at a fixed frequency xi* ~ 12.05 stable across the window U. Numerically " +
      "certified by power-iterating Ttilde directly and comparing to the spectral-slope sup: the ratio " +
      "converges to 1 as U grows. Because Phihat is the transform of the truncated de Bruijn-Newman " +
      "kernel with no elementary maximizer, C_inf ~ 0.1751 stays a determined transcendental number -- " +
      "the identity is exact and symbolic, but its value is not elementary." +
      "\n\nHONEST SCOPE: closes the imp-3346 numerator-norm caveat with an exact operator identity, but " +
      "resolves it into a sharper obstruction (transcendence of the dBN spectral peak), not a proof. " +
      "The imp-3066 off-diagonal endpoint-Hankel K_a >= 0 magnitude remains the lone RH obstruction, " +
      "UNTOUCHED. No QED.",
    firstUsed: "imp-3400 (Ttilde spectral-slope closed form), 2026",
    relatedTerms: [
      "capture ratio C_inf (imp-3346)",
      "linear-shear limit (imp-3350)",
      "Phi position concentration (imp-3221)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "sigma(N) N-shape (interior min ~97.8, interior max ~9.22e5)",
    category: "numerical",
    definition:
      "imp-3406 extrapolated the imp-3220 GUE-conditional share sigma(N) = E_coll(N)/E(N) past the " +
      "N* = 10^6 assembly ceiling and found it is not the one-sided U-curve imp-3220 reported, but a " +
      "full N-SHAPE: sigma rises from small N, dips to an interior MIN near N ~ 97.8 (sigma ~ 0.841, " +
      "the exact argmin located by imp-3323), rises again to an interior MAX at N_max ~ 9.21863e5 " +
      "(sigma_max ~ 0.9494), and then DECAYS toward 0 as N grows further, because the constant " +
      "truncation floor E_trunc (imp-2631, ~3.06e-5) eventually dominates the vanishing collision term " +
      "E_coll ~ sqrt(log T0/N). This corrects the imp-3220 headline that sigma is 'widest ~94.9% exactly " +
      "at the N* = 10^6 ceiling': N* = 10^6 sits only 2.1e-5 below the true interior peak, so the " +
      "ceiling value is a flat-cap sampling coincidence, not evidence of an unbounded-widening frontier." +
      "\n\nHONEST SCOPE: measurement/extrapolation only. Does not change the GUE-conditional C_mb <= 1 " +
      "bridge assumption or touch the imp-3066 off-diagonal endpoint-Hankel obstruction; no RH claim, " +
      "no QED.",
    firstUsed: "imp-3406 (sigma(N) N-shape extrapolation past the 10^6 ceiling), 2026",
    relatedTerms: [
      "E(N) bridge-constant frontier (imp-3220)",
      "GUE-conditional share argmin (imp-3323)",
      "truncation floor E_trunc (imp-2631)",
    ],
    link: "/closure-routes",
  },
  {
    term: "sigma(N) machine-precision landmark ladder L1-L5 (imp-3444)",
    category: "numerical",
    definition:
      "imp-3444 bisected the full imp-3406 sigma(N) N-shape to machine precision on the identical " +
      "sub-term formulas, pinning five landmarks in strict N-order: (L1) interior MIN N ~ 97.7968, " +
      "sigma ~ 0.840968 (matches imp-3323); (L2) interior MAX N ~ 9.218633e5, sigma ~ 0.949429 " +
      "(matches imp-3406); (L3) the sigma(2)-recross, where the decaying right arm falls back through " +
      "the small-N start value sigma(2) ~ 0.911741, at N ~ 1.789296e7; (L4) the sigma = 0.5 crossing " +
      "at N ~ 3.267235e9; and (L5) the E_coll = E_trunc crossover (the vanishing GUE-conditional " +
      "collision term dropping through the constant truncation floor, imp-2631) at N ~ 3.280294e9. " +
      "L3 and L4 confirm the imp-3406 coarse quotes '~1.79e7' and '~3.27e9' to 3 significant figures. " +
      "The added finding: L4 and L5 are NEARLY COINCIDENT, only ~0.40% apart in N, because E_flow has " +
      "decayed to near-negligibility on the far right arm (E_flow/E_trunc ~ 1.9e-3 there) -- so the " +
      "half-share crossing essentially IS the floor-crossover, to sub-percent accuracy." +
      "\n\nHONEST SCOPE: measurement only, reusing exact imp-3220/imp-3323/imp-3406 sub-term formulas " +
      "with no re-derivation. Does not touch the imp-3066 off-diagonal endpoint-Hankel obstruction; " +
      "no RH claim, no QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.",
    firstUsed: "imp-3444 (sigma(N) N-shape landmark ladder bisected to machine precision), 2026",
    relatedTerms: [
      "sigma(N) N-shape (interior min ~97.8, interior max ~9.22e5) (imp-3406)",
      "GUE-conditional share argmin (imp-3323)",
      "truncation floor E_trunc (imp-2631)",
    ],
    link: "/closure-routes",
  },
  {
    term: "sigma(N) interior-MAX floor-value artifact (imp-3443)",
    category: "numerical",
    definition:
      "CAVEAT on the imp-3406 sigma(N) N-shape: imp-3443 re-ran the identical imp-3406 ternary search " +
      "over a 9-point grid spanning half to double the imp-2631 truncation floor E_trunc = 3.06e-5, and " +
      "found the interior MAX location N_max is NOT a robust landmark. N_max swings 6.7x over the 4x " +
      "floor range -- from ~2.356e6 (half floor) through the baseline ~9.219e5 (reproducing imp-3406 " +
      "exactly) down to ~3.501e5 (double floor) -- following a near power law N_max ~ (1/E_trunc)^1.376 " +
      "(R^2 ~ 0.99992, local elasticity dlnN_max/dlnE_trunc ~ -1.373); sigma_max rises as the floor " +
      "falls (0.9612 half, 0.9494 baseline, 0.9348 double). Mechanism: the interior MAX is where " +
      "g = (E_trunc+E_flow)/E_coll is minimized, and the E_trunc/E_coll arm scales LINEARLY in E_trunc, " +
      "so raising the floor pushes the balance to lower N. So the imp-3406/imp-3444 quoted turnover " +
      "N_max ~ 9.22e5 is a FLOOR-SENSITIVITY READOUT of the specific imp-2631 floor value, not an " +
      "intrinsic feature of the GUE-conditional share -- readers should not over-interpret the exact " +
      "location as a fixed landmark.",
    firstUsed: "imp-3443 (N_max-vs-E_trunc floor sensitivity power law), 2026",
    relatedTerms: [
      "sigma(N) N-shape (interior min ~97.8, interior max ~9.22e5) (imp-3406)",
      "sigma(N) machine-precision landmark ladder L1-L5 (imp-3444)",
      "truncation floor E_trunc (imp-2631)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Faulhaber-dominant leftmost-zero residual (residual*NPHI -> -1/2)",
    category: "numerical",
    definition:
      "imp-3347 recorded the leadingOrderResidual -- the gap between the measured leftmost genuine " +
      "zero u_0(NPHI) of the truncated de Bruijn-Newman kernel and the elementary closed-form estimate " +
      "u_0_lead = (1/2)ln(5/(2 pi N^2)) -- as bounded but unattributed, and imp-3402 re-attributed the " +
      "whole gap to 'Gaussian curvature'. imp-3403 decomposed it instead: the elementary estimate drops " +
      "TWO neglected pieces, the Faulhaber finite-N power-sum tails (sum n^4 ~ N^5/5, sum n^2 ~ N^3/3, " +
      "each missing an N^4/2, N^2/2 tail) and the Gaussian curvature (every exp(-pi n^2 e^{4u}) set to 1). " +
      "Solving the Gaussians=1 kernel with the EXACT power sums S2, S4 gives u_0_faulh = u_0_lead - " +
      "1/(2N) -- the Faulhaber correction ALONE reproduces the measured -1/(2N) leading shrink, " +
      "accounting for ~102.3% of the full residual at N=10 (residual*NPHI climbs -0.451 at N=10 toward " +
      "the clean limit -1/2 by N=1280). The leftover piece residual - residual_faulh is a SUBDOMINANT, " +
      "OPPOSITE-sign +O(1/N^2) term (only ~2.27% of |residual| at N=10, later pinned by imp-3441 to the " +
      "closed form 5/(14 pi)). So the imp-3347/imp-3402 attribution of the residual to Gaussian " +
      "curvature was imprecise: the leading O(1/N) shrink is the neglected Faulhaber power-sum tail, " +
      "and genuine Gaussian curvature enters only at the next order." +
      "\n\nHONEST SCOPE: measurement/re-attribution only, refines (does not overturn) the prior labeling. " +
      "The leftmost zero is a truncation artifact of a TRUNCATED kernel (the untruncated de " +
      "Bruijn-Newman Phi is positive on all of R); leaves the imp-3197/imp-3257 [0,U] window and the " +
      "imp-3066 off-diagonal endpoint-Hankel K_a >= 0 obstruction entirely untouched. RH-equivalent; " +
      "no positivity, no reduction, NO QED.",
    firstUsed: "imp-3403 (Faulhaber-vs-Gaussian-curvature residual decomposition), 2026",
    relatedTerms: [
      "leftmost genuine zero u_0(NPHI) (imp-3347)",
      "leftmost-zero drift-rate fit (imp-3402)",
      "Gaussian-curvature coefficient closed form 5/(14 pi) (imp-3441)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Gaussian-curvature coefficient closed form 5/(14 pi) (imp-3441)",
    category: "numerical",
    definition:
      "imp-3403 left the SUBDOMINANT piece of the leftmost-zero residual -- (residual - residual_faulh) " +
      "* N^2 -> ~0.114, opposite in sign to the dominant -1/(2N) Faulhaber term -- as a measured but " +
      "undertived constant. imp-3441 derives it in closed form. Writing x = e^{2u}, the truncated de " +
      "Bruijn-Newman kernel vanishes at x = 3A/(2 pi B) with the Gaussian-weighted moments " +
      "A = sum n^2 exp(-pi n^2 x^2), B = sum n^4 exp(-pi n^2 x^2). At the leftmost-zero scale " +
      "x ~ 5/(2 pi N^2) every Gaussian argument pi n^2 x^2 -> 0, so the curvature expansion " +
      "exp(-pi n^2 x^2) = 1 - pi n^2 x^2 + O(x^4 n^4) is valid, giving u_0 - u_0_faulh = (1/2) ln(x/x_f) " +
      "~ (1/2) pi x^2 (S6/S4 - S4/S2) against the Faulhaber-zero x_f = 3 S2/(2 pi S4). With the leading " +
      "power sums S2 ~ N^3/3, S4 ~ N^5/5, S6 ~ N^7/7 the moment-ratio step gives " +
      "S6/S4 - S4/S2 -> (5/7 - 3/5) N^2 = (4/35) N^2, and pi x^2 -> 25/(4 pi N^4), so the pieces compose " +
      "to (u_0 - u_0_faulh) * N^2 -> (1/2)(25/(4 pi))(4/35) = 5/(14 pi) = 0.1136821022, matching the " +
      "imp-3403 measured ~0.114 and reproducing its opposite-sign observation (5/(14 pi) > 0). A " +
      "self-computing NPHI ladder {10..5120} confirms the O(1/N) finite-N approach: piece * N^2 climbs " +
      "monotonically from 0.102313 (N=10) to 0.113660 (N=5120), tracking the model 5/(14 pi)(1 - 1/N) " +
      "to O(1/N^2), with the ratio to the closed form rising from 0.89999 to 0.99980." +
      "\n\nHONEST SCOPE: derivation/measurement only, pinning the coefficient of a truncation artifact " +
      "(the untruncated de Bruijn-Newman Phi is positive on all of R). Leaves the imp-3197/imp-3257 " +
      "[0, U] window and the binding imp-3066 off-diagonal endpoint-Hankel K_a >= 0 operator-norm " +
      "obstruction entirely untouched. RH-equivalent; no positivity, no reduction, no RH verdict, NO " +
      "QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3441 (Gaussian-curvature coefficient closed form 5/(14 pi)), 2026",
    relatedTerms: [
      "Faulhaber-dominant leftmost-zero residual (residual*NPHI -> -1/2) (imp-3403)",
      "leftmost genuine zero u_0(NPHI) (imp-3347)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "General lambda-scaling law (B(a/k,kU) = k*B(a,U), D_0(a/k,kU) = k*D_0(a,U))",
    category: "numerical",
    definition:
      "imp-3349 measured a single two-point identity, B(0.25,12) = 2*B(0.5,6) (and the same for " +
      "D_0) -- the k = 2 case. imp-3405 extends this to a WHOLE ladder of scale factors k in " +
      "{2, 3, 4, 6, 8}, run from two independent base cells (0.5,6), s = 3 and (0.4,10), s = 4, " +
      "each rung evaluated by direct composite-Simpson quadrature of the raw integrands " +
      "cosh(a tau) - 1 and sinh(a tau) - 1 (no antiderivative). Across every rung the scaled " +
      "masses match k times the base masses (e.g. base B(0.5,6) = 14.0357, and B(0.0625,48) at " +
      "k = 8 lands on 8*14.0357 = 112.286) to ~1e-15 relative, while s = a*U -- hence the ratio " +
      "B/D_0 = 1.07392 -- stays fixed along the whole ladder. This is the direct numerical face " +
      "of the imp-3255 closed form: at fixed s = a*U, B(a,U) = (sinh s - s)/a and D_0(a,U) = " +
      "(cosh s - s + arcsinh(1) - sqrt2)/a, so replacing a -> a/k and U -> kU multiplies the " +
      "shared 1/a prefactor by k exactly while sinh s - s and cosh s - s + arcsinh(1) - sqrt2 " +
      "are untouched." +
      "\n\nHONEST SCOPE: numerical certification of the scaling-law structure only. " +
      "Mass-feasibility B > D_0 kills the impossibility option but is NECESSARY-BUT-NOT-SUFFICIENT " +
      "-- the degree-0 budget proxy is circular (its budget IS ||V||). The operator-level " +
      "K_a >= 0 off-diagonal endpoint-Hankel positivity (imp-3066) remains the lone RH obstruction, " +
      "UNTOUCHED. No RH verdict, no QED; Platt-Trudgian Lambda <= 0.2 stays SOTA.",
    firstUsed: "imp-3405 (general k-ladder lambda-scaling law), 2026",
    relatedTerms: [
      "two-point mass-scale identity (imp-3349)",
      "bridge-ratio closed form B/D(s) (imp-3255)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "sinh-drift coefficient c(U) inherits the 1/U capture law (imp-3442)",
    category: "numerical",
    definition:
      "imp-3409 fit the O(a^2) sinh-nonlinearity residual e(a) = r(a) - r_lin ~ c a^2 of the mupass " +
      "capture ratio at the single cutoff U = 6 only (c ~ 1.58e-5), leaving its U-dependence unmapped. " +
      "imp-3442 reruns the identical sqrt(2)-geometric a-ladder fit at each U in the extended imp-3240 " +
      "grid {4,6,8,10,12,16,20} and extracts c(U): the coefficient DECREASES monotonically (2.38e-5 at " +
      "U = 4 down to 4.86e-6 at U = 20), tracking a near-1/U power law c(U) = k U^q with q ~ -0.96 " +
      "(R^2 ~ 0.997). The linear capture ratio r_lin(U) itself carries essentially the same slope over " +
      "the grid, q_lin ~ -0.94 (R^2 ~ 0.998) -- the two exponents agree to within ~0.02. So the O(a^2) " +
      "sinh-drift coefficient and the imp-3240 1/U capture decay SHARE a scaling: c(U) inherits the " +
      "r ~ C/U law, with the product c(U)*U near-constant (~9.5e-5) across the grid while c(U)*U^2 " +
      "grows monotonically, ruling out a 1/U^2 rate. Every per-U small-a exponent stays pinned at " +
      "p = 2.000 (R^2 = 1.000000), so the residual is a clean O(a^2) drift at every cutoff, with only " +
      "its coefficient sliding as ~1/U." +
      "\n\nHONEST SCOPE: numerical measurement only (fitted exponent over a finite U-grid, not a " +
      "symbolic identity; q sits ~4% short of exactly -1). Does not construct the missing off-diagonal " +
      "magnitude and does not attempt the imp-3066 K_a >= 0 positivity. RH-equivalent; no RH verdict, " +
      "no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3442 (sinh-drift coefficient c(U) U-scaling sweep), 2026",
    relatedTerms: [
      "O(a^2) sinh-nonlinearity residual (imp-3409)",
      "mupass capture ratio r ~ C/U law (imp-3240)",
      "linear-shear limit (imp-3350)",
    ],
    link: "/closure-routes",
  },
  {
    term: "C_inf three-route extrapolation consensus (imp-3346/3407/3445)",
    category: "numerical",
    definition:
      "Three independent extrapolation routes for the imp-3346 capture constant C_inf, run on the " +
      "same r*U vs 1/U geometric ladder, are tabulated here for a single at-a-glance comparison: the " +
      "imp-3346 headline first-order Richardson C_inf = 0.1751 (quoted to ~1e-4), the imp-3407 Aitken " +
      "Delta^2 acceleration C_inf = 0.1750631 (the low outlier), the imp-3407 second-order quadratic " +
      "Richardson C_inf = 0.1751079, and the imp-3445 Wynn epsilon top-triple {15, 22.5, 33.75} " +
      "acceleration C_inf = 0.1751107 (anchored on the newer N = 1350 rung). The quadratic and Wynn " +
      "top-triple values CLUSTER at ~0.17511, isolating the Aitken value 0.1750631 as the low outlier " +
      "since it drops the O(1/U^2) tail term. All four values agree with each other to within ~5e-5 " +
      "and fall inside the imp-3346 quoted 1e-4 precision band, but the honest sub-gap between the " +
      "clustered ~0.17511 estimate and the Aitken ~0.17506 estimate is NOT resolved to 1e-5 by any of " +
      "these routes." +
      "\n\nHONEST SCOPE: tabulation of existing numerical results only -- no new computation, no closed " +
      "form, no RH claim. The imp-3066 off-diagonal endpoint-Hankel obstruction is untouched; " +
      "Platt-Trudgian Lambda <= 0.2 remains SOTA.",
    firstUsed: "imp-3475 (three-route C_inf consensus tabulation), 2026",
    relatedTerms: [
      "capture ratio C_inf (imp-3346)",
      "Wiener-Khinchin numerator-norm identity (||Ttilde|| = a sup_xi |d/dxi |Phihat(xi)|^2|)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Second genuine-Phi autocorrelation moment M_2 and the degree-2 leading form B_2(a) ~ (a^2/2) M_2",
    category: "numerical",
    definition:
      "The degree-2 (absolute) bridge mass B_2(a,U) = int_0^U (cosh(a tau) - 1) A(tau) d(tau) weights " +
      "the same cosh(a tau) - 1 integrand used at degree 0 by the FIXED genuine-Phi autocorrelation " +
      "A(tau) = int Phi(s) Phi(s + tau) ds (imp-2686). Because A(tau) is negligible outside its support " +
      "(~[0, 0.6], far inside every cutoff U >= 6 on the imp-3405 k-ladder), the small-a Taylor expansion " +
      "cosh(a tau) - 1 = (a tau)^2/2 + O(a^4) carries through the whole integral, giving the closed leading " +
      "form B_2(a) ~ (a^2/2) M_2, where M_2 = int tau^2 A(tau) d(tau) ~ 4.54e-6 is the FIXED second moment " +
      "of A(tau) -- independent of both a and U. imp-3469 measured M_2 self-computingly (composite Simpson " +
      "on the precomputed A(tau) grid) and checked the leading form against the two base cells of the " +
      "degree-2 k-ladder, (a,U) = (0.5,6) and (0.4,10): the closed form reproduces both measured B_2 values " +
      "to within ~4e-4 relative. This is the ROOT CAUSE behind the imp-3469 degree-2 scaling break -- B_2 " +
      "scales as a^2 (exponent p = 2), not as the degree-0 exponent p = 1, because M_2 is a fixed constant " +
      "that never co-scales with the tau = k*sigma substitution used to rescale a and U." +
      "\n\nHONEST SCOPE: numerical characterization of the degree-2 bridge-mass leading form only. " +
      "Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility " +
      "ratio at all (the overflow deficit D_2 = 0 identically). The operator-level K_a >= 0 off-diagonal " +
      "endpoint-Hankel positivity (imp-3066) remains the lone RH obstruction, UNTOUCHED. No RH verdict, " +
      "no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3469 (degree-2 bridge-mass k-ladder scaling break), 2026",
    relatedTerms: [
      "General lambda-scaling law (B(a/k,kU) = k*B(a,U), D_0(a/k,kU) = k*D_0(a,U))",
      "genuine-Phi autocorrelation A(tau) (imp-2686)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Degree-0 vs degree-2 scaling BREAK: exponent contrast p=1 vs p=2 and the closed-form k^3 over-prediction",
    category: "numerical",
    definition:
      "imp-3405 certified the degree-0 lambda-scaling law B(a/k,kU) = k*B(a,U) -- exponent p = 1 in k. " +
      "imp-3469 ran the IDENTICAL k-ladder {2,3,4,6,8} on the degree-2 (absolute) bridge mass B_2(a,U) = " +
      "int_0^U (cosh(a tau) - 1) A(tau) d(tau) and found it obeys a DIFFERENT exponent, p = 2: " +
      "B_2(a/k,kU) = B_2(a,U)/k^2 to full precision (measured log(base/scaled)/log(k) = 2.0000..2.0005 " +
      "on every rung, both base cells). The mechanism is the SAME substitution tau = k*sigma that drives " +
      "the degree-0 law -- but at degree 0 it maps the Lebesgue weight to itself, while at degree 2 the " +
      "FIXED genuine-Phi autocorrelation A(tau) is left uncompensated (A(k*sigma) != A(sigma)), so the " +
      "k-prefactor from the substitution is not the whole story. Because the degree-0 law naively predicts " +
      "k*B_2(a,U) while the true degree-2 mass is B_2(a,U)/k^2, the degree-0 prediction OVER-predicts by " +
      "the exact closed factor k^3: the relative miss |k*B_2 - B_2/k^2| / (k*B_2) = 1 - 1/k^3, verified to " +
      "<1e-3 on every rung of both base cells (0.5,6),s=3 and (0.4,10),s=4 -- climbing from 0.875 at k=2 to " +
      "0.998 at k=8." +
      "\n\nHONEST SCOPE: numerical characterization of the exponent contrast between the two scaling laws " +
      "only, distinct from the imp-3405 degree-0 law itself and from the imp-3469 M_2-moment root-cause " +
      "entry above. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no " +
      "feasibility ratio at all (D_2 = 0 identically). The operator-level K_a >= 0 off-diagonal " +
      "endpoint-Hankel positivity (imp-3066) remains the lone RH obstruction, UNTOUCHED. No RH verdict, " +
      "no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3469 (degree-2 bridge-mass k-ladder scaling break), 2026",
    relatedTerms: [
      "General lambda-scaling law (B(a/k,kU) = k*B(a,U), D_0(a/k,kU) = k*D_0(a,U))",
      "Second genuine-Phi autocorrelation moment M_2 and the degree-2 leading form B_2(a) ~ (a^2/2) M_2",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "PSD peak-slope maximizer xi* = 12.0870439 (transcendental root of P2(xi) = 0)",
    category: "numerical",
    definition:
      "imp-3400 gave the capture-ratio numerator norm the closed form ||Ttilde|| = a * sup_xi " +
      "|d/dxi |Phihat(xi)|^2|, but left the maximizing frequency xi* as a coarse grid estimate ~12.05. " +
      "imp-3470 LOCATES xi* to machine precision by exploiting that the peak slope is attained where " +
      "the slope itself is stationary -- the PSD inflection P''(xi*) = 0, with P = C^2 + S^2 the power " +
      "spectral density built from the Fourier cos/sin parts C, S of the truncated de Bruijn-Newman " +
      "kernel Phi. Bracketing the coarse imp-3400 peak and bisecting P''(xi) = 0 pins xi* = 12.0870439, " +
      "U-INDEPENDENT (spread ~0 across the U ladder) and a genuine max (|P'| strictly smaller on both " +
      "sides, P'(xi*) < 0 on the falling flank). The equation P''(xi) = 0 is a trigonometric combination " +
      "of ten non-elementary dBN spectral integrals (Gaussian tails times log-frequency oscillation " +
      "under the substitution x = e^{4u}) -- a Mellin-type kernel with no elementary antiderivative -- " +
      "so xi* is TRANSCENDENTAL: the obstruction to a closed form for C_inf ~ 0.1751 is not the missing " +
      "||Ttilde|| identity (imp-3400 supplied it) but the transcendence of this spectral inflection.",
    firstUsed: "imp-3470 (PSD peak-slope maximizer xi* location and transcendence characterization), 2026",
    relatedTerms: [
      "Wiener-Khinchin numerator-norm identity (||Ttilde|| = a sup_xi |d/dxi |Phihat(xi)|^2|)",
      "capture ratio C_inf (imp-3346)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "height-dependent n_max FLOOR mechanism (imp-3465)",
    category: "numerical",
    definition:
      "CAVEAT sharpening imp-3443: the imp-3406 sigma(N) interior MAX at N_max ~ 9.22e5 is the " +
      "interior MIN of g = (E_trunc+E_flow)/E_coll, which exists because the FIXED imp-2631 " +
      "truncation floor E_trunc = 3.06e-5 makes the far arm E_trunc/E_coll ~ N^{1/2} strongly " +
      "increasing while E_flow/E_coll falls -- the two balance at an interior N. imp-3465 makes " +
      "the floor HEIGHT-DEPENDENT, E_trunc = E_trunc(T0) with T0 = effectiveHeightForN(N), across " +
      "a power family E_trunc ~ T0^{-k} and a quasi-constant log family. The constant control " +
      "(k=0) reproduces the imp-3406 turnover exactly, but EVERY positive power exponent DISSOLVES " +
      "it: with E_coll ~ N^{-1/2}, the far arm becomes E_trunc/E_coll ~ N^{k-1/2}, so any k>0 " +
      "flattens or inverts that arm and the PT-calibrated floor is amplified at low N -- the " +
      "interior minimum of g never forms, and sigma(N) is instead MONOTONE (decreasing for " +
      "k < k* = 1/2, increasing toward 1 for k > k*, exactly E_coll's N-decay rate). The " +
      "physically-motivated fixed-strip Ingham sigma=3/4 floor (k=0.4, matching imp-2631's own " +
      "3*T0^{-0.4}) is one such case: it DISSOLVES the turnover, leaving no interior maximum. " +
      "Only a logarithmically-slow (quasi-constant) floor preserves an interior max, landing " +
      "modestly below the fixed baseline. So the n_max landmark is set by the BOUNDARY, not an " +
      "interior stationary point, once the floor decays with height as physically expected -- " +
      "the imp-3406/imp-3443 turnover is a constant-floor artifact, not a genuine feature of the " +
      "GUE-conditional share.",
    firstUsed: "imp-3465 (height-dependent truncation-floor n_max collapse mechanism), 2026",
    relatedTerms: [
      "sigma(N) N-shape (interior min ~97.8, interior max ~9.22e5) (imp-3406)",
      "sigma(N) interior-MAX floor-value artifact (imp-3443)",
      "truncation floor E_trunc (imp-2631)",
    ],
    link: "/closure-routes",
  },
  {
    term: "critical capture-decay exponent k_c = 0.1966894 (imp-3486)",
    category: "numerical",
    definition:
      "imp-3465 found that the imp-3406 interior MAXIMUM of the GUE-conditional share " +
      "sigma(N) -- equivalently the interior MINIMUM of g(N) = (E_trunc+E_flow)/E_coll -- " +
      "survives only when the imp-2631 truncation floor E_trunc(T0;k) = 3.06e-5*(T_PT/T0)^k " +
      "decays slowly enough, and stated 'any k > 0 kills it' from a coarse grid whose smallest " +
      "positive sample was k = 0.2. imp-3486 LOCATES the exact threshold: two structurally " +
      "independent locators (bisecting the imp-3465 scan-grid classifyShape INTERIOR-to-BOUNDARY-LO " +
      "transition, and bisecting the smooth condition that the interior stationary min value of " +
      "g equals g at the N=1e2 window boundary) agree to ~8 significant digits on " +
      "k_c = 0.1966894. The interior min persists for 0 <= k < k_c and is gone above it. The " +
      "COLLAPSE MECHANISM is a boundary HANDOVER, not a saddle-node: at k_c the interior " +
      "stationary point of g still exists (N ~ 2.5e3), but its value is overtaken by the " +
      "amplified low-N floor, so the global minimum hands off to the N = 1e2 window boundary. " +
      "This sharpens imp-3465s verdict rather than contradicting it: k_c sits strictly between " +
      "the straddling grid samples k=0 and k=0.2, and strictly below the large-N limit-flip " +
      "exponent k* = 1/2. Because the collapse is a boundary handover, k_c is a threshold FOR " +
      "the imp-3465 diagnostic window (N=1e2), not a window-free structural constant. " +
      "Measurement only; RH-equivalent; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
    firstUsed: "imp-3486 (critical capture-decay exponent k_c location and handover mechanism), 2026",
    relatedTerms: [
      "height-dependent n_max FLOOR mechanism (imp-3465)",
      "sigma(N) N-shape (interior min ~97.8, interior max ~9.22e5) (imp-3406)",
      "truncation floor E_trunc (imp-2631)",
    ],
    link: "/closure-routes",
  },
  {
    term: "genuine-Phi autocorrelation MOMENT LADDER M_0..M_4 and the moment-indexed leading form R_n(a) ~ (a^n/n!) M_n",
    category: "numerical",
    definition:
      "imp-3469 measured a single rung of the degree-2 (absolute) bridge-mass Taylor structure: " +
      "B_2(a) ~ (a^2/2) M_2, where M_2 = int tau^2 A(tau) d(tau) is the fixed second moment of the " +
      "genuine-Phi autocorrelation A(tau) = int Phi(s) Phi(s + tau) ds (imp-2686). imp-3481 extends " +
      "this to a full moment-indexed LADDER by expanding both A-weighted generating masses C(a) = " +
      "int cosh(a tau) A(tau) d(tau) = sum a^{2j}/(2j)! M_{2j} and S(a) = int sinh(a tau) A(tau) " +
      "d(tau) = sum a^{2j+1}/(2j+1)! M_{2j+1} in a and peeling successive Taylor terms: R_0(a) = C(a), " +
      "R_1(a) = S(a), R_2(a) = C(a) - M_0 (the imp-3469 bridge mass B_2), R_3(a) = S(a) - a M_1, " +
      "R_4(a) = C(a) - M_0 - (a^2/2) M_2. Each remainder satisfies R_n(a) = (a^n/n!) M_n + O(a^{n+2}), " +
      "so every moment M_n (n = 0..4) is exactly the leading small-a coefficient of the n-th " +
      "remainder. MEASURED (NPHI = 10, imp-3469 Simpson grid): M_0 ~ 7.675e-4, M_1 ~ 4.518e-5, " +
      "M_2 ~ 4.537e-6 (reproduces the imp-3469 anchor to full precision), M_3 ~ 6.029e-7, " +
      "M_4 ~ 9.625e-8 -- positive and roughly geometrically decreasing. At the imp-3469 base a = 0.5 " +
      "every remainder matches its leading form (a^n/n!) M_n to < 1e-3 relative, and halving a " +
      "(0.5 -> 0.25 -> 0.125) quarters each residual (order-a^2 convergence), confirming the leading " +
      "form is genuine rather than a coincidental fit." +
      "\n\nHONEST SCOPE: measurement/derivation of the moment ladder and its Taylor structure only. " +
      "Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility " +
      "ratio at all (D_2 = 0 identically). The operator-level K_a >= 0 off-diagonal endpoint-Hankel " +
      "positivity (imp-3066) remains the lone RH obstruction, UNTOUCHED. No RH verdict, no QED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3481 (autocorrelation moment ladder extending the imp-3469 M_2 rung to n=0..4), 2026",
    relatedTerms: [
      "Second genuine-Phi autocorrelation moment M_2 and the degree-2 leading form B_2(a) ~ (a^2/2) M_2",
      "genuine-Phi autocorrelation A(tau) (imp-2686)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "closed-form degree-2 miss factor 1 - 1/k^3 (imp-3488)",
    category: "numerical",
    definition:
      "imp-3469 MEASURED, from a k-ladder {2,3,4,6,8}, that the imp-3405 degree-0 " +
      "scaling law k*B_2(a,U) over-predicts the degree-2 (absolute-measure) bridge mass " +
      "B_2(a/k, kU) by a closed factor 1 - 1/k^3, but only fitted it empirically. " +
      "imp-3488 DERIVES it: because the genuine-Phi autocorrelation A(tau) truncates " +
      "inside every cutoff U (imp-3482), B_2 is U-independent and small-a, with leading " +
      "form B_2(a) ~ (a^2/2) M_2 (M_2 the fixed second autocorrelation moment, imp-3481). " +
      "That leading term is exactly degree-2 HOMOGENEOUS in a, so B_2(a/k) = k^{-2} B_2(a) " +
      "-- the exponent p = 2 is analytic, not fitted. The degree-0 law instead multiplies " +
      "by k (one Lebesgue power), so the ratio of the degree-0 prediction to the actual " +
      "degree-2 mass is k*B_2(a) / (k^{-2} B_2(a)) = k^3: an over-prediction by EXACTLY " +
      "k^3, and a relative miss |k^{-3} - 1| = 1 - 1/k^3 (k >= 2). CERTIFIED against the " +
      "imp-3469 ladder on both base cells (0.5,6) and (0.4,10): the exact ratio " +
      "r_k = B_2(a/k)/B_2(a) reconciles the imp-3469 residual (1 - r_k/k), the derived " +
      "miss to the O(a^4) leading-form tail (< 1e-3), and the fitted exponent to 2 " +
      "(within 0.01) -- all to machine precision." +
      "\n\nHONEST SCOPE: derivation/certification only. The degree-2 face carries no " +
      "feasibility ratio at all (D_2 = 0 identically, imp-3482), so this establishes NO " +
      "operator positivity. The off-diagonal endpoint-Hankel obstruction K_a >= 0 " +
      "(imp-3066) remains UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 " +
      "remains the rigorous SOTA.",
    firstUsed: "imp-3488 (closed-form derivation of the degree-2 miss factor 1 - 1/k^3 and exponent p = 2), 2026",
    relatedTerms: [
      "genuine-Phi autocorrelation MOMENT LADDER M_0..M_4 (imp-3481)",
      "Second genuine-Phi autocorrelation moment M_2 and the degree-2 leading form B_2(a) ~ (a^2/2) M_2",
      "degree-0 lambda-scaling law B(a/k, kU) = k*B(a,U) (imp-3405)",
    ],
    link: "/closure-routes",
  },
  {
    term: "PSD peak-slope maximizer xi* = 12.0870439: U-invariance and global uniqueness (imp-3489, imp-3483)",
    category: "numerical",
    definition:
      "imp-3470 located xi* = 12.0870439, the root of the PSD curvature P2(xi) = 0 where the power-spectrum " +
      "slope |d/dxi |Phihat(xi)|^2| peaks, by bisecting a SINGLE bracket on the short {U=6, U=8} ladder and " +
      "described it as 'stable across the U ladder (spread ~0)'. Two follow-ups close the remaining gaps. " +
      "imp-3489 re-solves P2(xi) = 0 on the FULL imp-3240 capture-ratio grid U_GRID = {4, 6, 8, 10} and finds " +
      "xi* = 12.08704387272693 on EVERY window -- BIT-IDENTICAL, so the drift max_U xi* - min_U xi* is EXACTLY " +
      "0, not merely small. This exact (not approximate) invariance follows because the de Bruijn-Newman " +
      "kernel Phi has COMPACT EFFECTIVE SUPPORT (its Gaussian tail underflows to 0 by u ~ 1.4, inside the " +
      "shortest U = 4 window), so every window U >= 4 captures the entire nonzero Phi and the fixed panel " +
      "width H = 1/60 places identical quadrature nodes in every window. imp-3483 separately certifies that " +
      "xi* is the UNIQUE GLOBAL maximizer of the peak-slope objective sup_xi |P1(xi)|, not merely a local " +
      "stationary point: scanning P2(xi) across the full domain [0, 120] on a fine grid and bisecting every " +
      "sign change finds EXACTLY ONE root, with the flanking sign pattern (P2 < 0 below, P2 > 0 above) showing " +
      "|P1(xi)| is UNIMODAL, and an independent grid argmax of |P1| lands on the same xi*. Together the two " +
      "certifications upgrade the imp-3470 'stable' claim to xi* being a FIXED, U-independent, globally unique " +
      "transcendental number -- the sup behind C_inf ~ 0.1751." +
      "\n\nHONEST SCOPE: certification/measurement only. Neither result gives xi* an elementary closed form -- " +
      "the stationarity equation P2(xi) = 0 stays transcendental (imp-3470). C_inf ~ 0.1751 remains a determined " +
      "number requiring transcendental evaluation. This characterizes the numerator norm of the capture ratio; " +
      "it does NOT construct the missing magnitude or attempt the K_a >= 0 positivity. The off-diagonal " +
      "endpoint-Hankel obstruction (imp-3066) remains the lone RH obstruction, UNTOUCHED. No RH verdict, no " +
      "QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3489 and imp-3483 (U-independence certification and global-uniqueness certification of xi* = 12.0870439), 2026",
    relatedTerms: [
      "PSD peak-slope maximizer xi* = 12.0870439 (transcendental root of P2(xi) = 0) (imp-3470)",
      "closed-form degree-2 miss factor 1 - 1/k^3 (imp-3488)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Solver-independent operator-norm cross-validation of the capture constant C = 0.1751370 (imp-3485)",
    category: "numerical",
    definition:
      "imp-3467 assembled the capture constant C = ||Ttilde|| / (a * m0 * sigma_Phi) = 0.1751370 from a " +
      "single solver: power iteration on M^T M (260 steps, one fixed start vector) for the numerator norm " +
      "||Ttilde||, across the full imp-3240 U-grid {4, 6, 8, 10, 12, 16, 20}. imp-3485 recomputes ||Ttilde|| " +
      "by a STRUCTURALLY INDEPENDENT route -- a symmetric Lanczos (Krylov-subspace) tridiagonalization of " +
      "S = T^T T with full reorthogonalization, its top eigenvalue extracted by a cyclic Jacobi rotation " +
      "sweep, sharing no code path with the power-iteration solver -- and divides by the same exact rank-2 " +
      "shear-Gram denominator a * m0 * sigma_Phi. The independent norm reproduces the imp-3467 value to " +
      "relative error 1.7e-9 (U = 4) widening to 1.0e-4 (U = 20), so the imp-3467 assembly is NOT a " +
      "power-iteration artifact of one solver. Assembling C from the independent norm gives 0.174468 " +
      "(U = 4) rising to 0.175109 (U = 20), sitting below the closed-form 0.1751370 on every cell (the " +
      "Szego finite-section deficit) and converging upward, reproducing the imp-3467 ratio ladder " +
      "0.9962 to 0.9998 from a distinct solver. (A follow-up, imp-3505/imp-3525, later traced the residual " +
      "U = 20 gap to a stacked power-under-convergence and Lanczos Krylov-truncation deficit and collapsed " +
      "it to ~1e-11 by raising both solvers' budgets, confirming the two solvers agree to machine precision " +
      "once fully converged.)" +
      "\n\nHONEST SCOPE: cross-validation/measurement only, no new closed form. C = 0.1751370 characterizes " +
      "the capture-ratio numerator norm, not positivity. The off-diagonal endpoint-Hankel obstruction " +
      "K_a >= 0 (imp-3066) remains the lone RH obstruction, UNTOUCHED. No RH verdict, no QED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3485 (solver-independent Lanczos/Jacobi cross-validation of the imp-3467 capture constant C = 0.1751370), 2026",
    relatedTerms: [
      "Ttilde closed-form C-assembly across the imp-3240 U-grid (imp-3467)",
      "capture ratio C_inf (imp-3346)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/viz-imp3467-closed-form-c",
  },
  {
    term: "closed-form degree-3 (odd) miss factor 1 - 1/k^4 (imp-3510)",
    category: "numerical",
    definition:
      "imp-3488 derived the EVEN degree-2 miss factor 1 - 1/k^3 from the degree-2 bridge mass " +
      "B_2(a) ~ (a^2/2) M_2. imp-3510 derives the ODD analogue for the degree-3 (sinh, " +
      "absolute-measure) bridge mass B_3(a, U) = int_0^U (sinh(a tau) - a tau) A(tau) d(tau) = " +
      "S(a) - a*M_1, the imp-3481 odd remainder R_3. Because the genuine-Phi autocorrelation " +
      "A(tau) truncates inside every cutoff U (imp-3482), B_3 is U-independent and small-a, with " +
      "leading form B_3(a) ~ (a^3/6) M_3 (M_3 the fixed third autocorrelation moment, imp-3481). " +
      "That leading term is exactly degree-3 HOMOGENEOUS in a, so B_3(a/k) = k^{-3} B_3(a) -- the " +
      "exponent p = 3 is analytic, not fitted. The imp-3405 degree-0 law still multiplies by k " +
      "(one Lebesgue power), so the ratio of the degree-0 prediction to the actual degree-3 mass " +
      "is k*B_3(a) / (k^{-3} B_3(a)) = k^4: an over-prediction by EXACTLY k^4, and a relative miss " +
      "|k^{-4} - 1| = 1 - 1/k^4 (k >= 2). This shifts the imp-3488 even form one notch: " +
      "p: 2 -> 3, over-prediction k^3 -> k^4, miss 1 - 1/k^3 -> 1 - 1/k^4 -- the Lebesgue power " +
      "stays fixed at k^1 while the homogeneity power tracks the mass degree. CERTIFIED against a " +
      "degree-3 k-ladder {2,3,4,6,8} on the imp-3469 base cells (0.5,6) and (0.4,10): with " +
      "r_k = B_3(a/k)/B_3(a) the exact measured ratio, the degree-0 residual equals 1 - r_k/k " +
      "identically (< 1e-12), the derived miss 1 - 1/k^4 matches it to the closed leading-form " +
      "tail (r_k - 1/k^3)/k (< 1e-3, reconciled to r_k to < 1e-12), and the fitted exponent " +
      "matches 3 to the O(a^2) tail (within 0.01) -- all to machine precision." +
      "\n\nHONEST SCOPE: derivation/certification only. The degree-3 (odd) face carries no " +
      "feasibility ratio at all, so this establishes NO operator positivity. The off-diagonal " +
      "endpoint-Hankel obstruction K_a >= 0 (imp-3066) remains UNTOUCHED. No RH verdict, no QED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3510 (closed-form derivation of the degree-3 miss factor 1 - 1/k^4 and exponent p = 3), 2026",
    relatedTerms: [
      "closed-form degree-2 miss factor 1 - 1/k^3 (imp-3488)",
      "genuine-Phi autocorrelation MOMENT LADDER M_0..M_4 (imp-3481)",
      "degree-0 lambda-scaling law B(a/k, kU) = k*B(a,U) (imp-3405)",
    ],
    link: "/closure-routes",
  },
  {
    term: "NPHI >= 3 bit-invariance of the genuine-Phi autocorrelation support (imp-3508)",
    category: "numerical",
    definition:
      "imp-3482 certified D_2 = 0 identically by measuring, at the SINGLE de Bruijn-Newman kernel " +
      "truncation NPHI = 10, a hard genuine-Phi autocorrelation A(tau) underflow point (tau ~ 1.368) " +
      "and showing the degree-2 crossover tauStar = arcsinh(1)/a (1.7627 at a = 0.5, 2.2034 at a = 0.4) " +
      "sits strictly beyond it with margins 1.185460 and 1.626147. imp-3508 asks whether those numbers " +
      "are NPHI = 10 artifacts by recomputing the whole pipeline -- A(0), the 1e-12 support endpoint, " +
      "the hard underflow point, and both margins -- across the ladder NPHI = {6, 8, 10, 12, 16}. " +
      "RESULT: every one of those quantities is BIT-FOR-BIT IDENTICAL across the whole ladder. The " +
      "n >= 4 de Bruijn-Newman bands carry weight exp(-pi n^2 e^{4u}) that underflows below machine " +
      "epsilon over the entire s >= 0 autocorrelation domain, so adding them changes A(tau) by less " +
      "than one ULP. A small-NPHI probe {1, 2, 3, 4} locates the stabilization onset: NPHI = 1 and " +
      "NPHI = 2 still differ from the stable value (A(0) = 1.045694e-2 at NPHI = 1 vs the stable " +
      "1.047207e-2), but from NPHI = 3 upward A(0) = 0.01047206596649 is bit-identical -- the support " +
      "is set entirely by the n = 1, 2, 3 bands. Because the support endpoint is NPHI-invariant and " +
      "tauStar is NPHI-independent by construction, the imp-3482 underflow point and the imp-3469 " +
      "degree-2 strict-separation margin are therefore truncation-invariant to the last bit for " +
      "NPHI >= 3: no attainable dBN truncation can push tauStar inside the A support, so D_2 = 0 " +
      "identically holds NPHI-robustly, not merely at NPHI = 10." +
      "\n\nHONEST SCOPE: measurement/certification only, at the RH-equivalent scale class. This " +
      "certifies the NPHI-robustness of a support-separation FACT; it establishes NO operator " +
      "positivity, and the degree-2 face carries no feasibility ratio at all (D_2 = 0). The " +
      "off-diagonal endpoint-Hankel obstruction K_a >= 0 (imp-3066) remains UNTOUCHED. No RH verdict, " +
      "no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3508 (NPHI-ladder robustness certification of the imp-3482 underflow point and imp-3469 degree-2 margin), 2026",
    relatedTerms: [
      "closed-form degree-2 miss factor 1 - 1/k^3 (imp-3488)",
      "genuine-Phi autocorrelation MOMENT LADDER M_0..M_4 (imp-3481)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3485 U=20 residual floor is a Lanczos Krylov-truncation deficit, not power under-convergence (imp-3505)",
    category: "numerical",
    definition:
      "imp-3485 cross-validated the imp-3467 power-iteration operator norm ||Ttilde|| against an " +
      "independent m = 80 Lanczos/Jacobi solver and saw relative agreement widen from 1.7e-9 (U = 4) " +
      "to 1.0e-4 (U = 20), attributing the growth to 260-step power-iteration under-convergence " +
      "without sweeping the budget. imp-3505 sweeps the power-iteration budget {260..6500} at the " +
      "N = 800 (U = 20) section against a CONVERGED m = 160 Lanczos reference and finds two things: " +
      "(A) the under-convergence attribution is real -- the gap falls monotonically from 1.04e-4 at " +
      "260 steps and crosses 1e-9 at budget ~6250 (~24x the imp-3485 budget); (B) the imp-3485 " +
      "residual floor was NEVER an artifact of the power solver alone. Measured against the m = 80 " +
      "Lanczos value imp-3485 actually used (6.491213563635e-5), power iteration fully CONVERGES by " +
      "budget ~8320 to sigma = 6.491220876901e-5 (stable to 1e-14 out to 33280 steps) -- a value " +
      "sitting 1.13e-6 ABOVE the m = 80 reference, so the m = 80 gap floors at 1.13e-6 and never " +
      "reaches 1e-9. The m = 80 Lanczos reference is itself under-resolved at N = 800: enriching the " +
      "Krylov dimension to m >= 120 lifts it onto the power-converged value (agreement 6e-14), " +
      "confirming both solvers agree to machine precision once each is fully converged on its own terms." +
      "\n\nHONEST SCOPE: measurement/certification only -- separates two pre-existing solver error " +
      "sources and does not construct any new closed form. The off-diagonal endpoint-Hankel " +
      "obstruction K_a >= 0 (imp-3066) remains UNTOUCHED. No RH verdict, no QED. Platt-Trudgian " +
      "Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3505 (power-iteration budget sweep separating under-convergence from Lanczos Krylov-truncation deficit), 2026",
    relatedTerms: [
      "Solver-independent operator-norm cross-validation of the capture constant C = 0.1751370 (imp-3485)",
      "Ttilde closed-form C-assembly across the imp-3240 U-grid (imp-3467)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/viz-imp3467-closed-form-c",
  },
  {
    term: "Fitted moment-remainder tail EXPONENT p_n ~ 2, upgrading the imp-3481 worst-case ratio to a genuine decay law",
    category: "numerical",
    definition:
      "imp-3481 only certified that each moment-ladder remainder R_n(a) = (a^n/n!) M_n + O(a^{n+2}) " +
      "shrinks at order a^2 via a WORST-CASE per-halving ratio > 3.5 on the three-point ladder " +
      "{0.5, 0.25, 0.125} -- never a fitted decay exponent. imp-3502 sweeps a on the extended geometric " +
      "ladder {0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625}, computes the relative residual " +
      "r_n(a) = |R_n(a) - (a^n/n!)M_n| / |R_n(a)|, and least-squares fits ln r_n(a) vs ln a: the slope " +
      "is the tail exponent p_n, expected 2 since r_n(a) ~ const * a^2. MEASURED: n=0 p=1.99993 " +
      "(R^2=1.0000000, 6 rungs), n=1 p=1.99995 (R^2=1.0000000, 6 rungs), n=2 p=1.99878 " +
      "(R^2=0.9999996, 6 rungs), n=3 p=1.99995 (R^2=1.0000000, 4 rungs), n=4 p=1.97083 " +
      "(R^2=0.9999323, only 3 rungs). Every fitted exponent lies within 0.03 of 2 with R^2 > 0.9999, " +
      "upgrading the imp-3481 unfitted ratio claim to a genuine fitted decay law across the full " +
      "n = 0..4 moment ladder. The n=4 fit is limited to 3 rungs because R_4 = C - M_0 - (a^2/2)M_2 " +
      "subtracts O(M_0) ~ 7.7e-4 magnitude masses, so the residual numerator carries an absolute " +
      "M_0*eps ~ 1e-18 cancellation floor: below a = 0.125 the O(a^6) tail sinks under that floor " +
      "(numerator falls from 1.96e-17 at a = 0.125 to 4.9e-19 at a = 0.0625) and the local slope " +
      "decorrelates (1.94 -> 1.33 -> negative), so those rungs are excluded before fitting." +
      "\n\nHONEST SCOPE: measurement/certification only -- fits the numerical decay order of a " +
      "fixed-weight Taylor remainder and establishes NO operator positivity. Mass-feasibility is " +
      "NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility comparison at all " +
      "(imp-3469: D_2 = 0). The operator-level K_a >= 0 off-diagonal endpoint-Hankel obstruction " +
      "(imp-3066) remains UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains " +
      "the rigorous SOTA.",
    firstUsed: "imp-3502 (fitted moment-remainder tail exponent certifying the imp-3481 order-a^2 residual decay), 2026",
    relatedTerms: [
      "genuine-Phi autocorrelation MOMENT LADDER M_0..M_4 and the moment-indexed leading form R_n(a) ~ (a^n/n!) M_n (imp-3481)",
      "Second genuine-Phi autocorrelation moment M_2 and the degree-2 leading form B_2(a) ~ (a^2/2) M_2 (imp-3469)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Moment-tail CLOSED error certificate |R_n(a)-(a^n/n!)M_n| <= (a^(n+2)/(n+2)!) M_(n+2) e^(a T_A), valid for ALL n",
    category: "numerical",
    definition:
      "imp-3501 derived the moment-tail identity R_n(a) = (a^n/n!) M_n + O(a^{n+2}) but left the " +
      "residual as an unquantified big-O, with closed forms instantiated only for n = 0..4. imp-3532 " +
      "promotes it to an EXPLICIT closed bound valid for every n. Peeling the leading (m=n) term from " +
      "the imp-3501 moment-tail identity leaves the exact residual E_n(a) := R_n(a) - (a^n/n!)M_n = " +
      "sum_{k>=1} a^{n+2k}/(n+2k)! M_{n+2k}. Bounding termwise by absolute moments Mbar_j := " +
      "int_0^{T_A} tau^j |A(tau)| d(tau) >= |M_j| gives the decay bound Mbar_{n+2k} <= T_A^{2k-2} " +
      "Mbar_{n+2} on the compact support [0, T_A], and the binomial factorial bound " +
      "(n+2k)! >= (n+2)!(2k-2)! collapses the tail sum to (a^{n+2}/(n+2)!) Mbar_{n+2} cosh(a T_A) <= " +
      "(a^{n+2}/(n+2)!) Mbar_{n+2} e^(a T_A) -- the inner sum is exactly the even half of the " +
      "exponential series, i.e. cosh(a T_A). The bound is UNCONDITIONAL in the absolute moments; on " +
      "the effective support A(tau) >= 0 (measured moments all positive) Mbar = M and it collapses to " +
      "the ticket form with the sharper cosh(a T_A) constant available in place of e^(a T_A). Certified " +
      "against the imp-3481 ladder (M_0..M_6, T_A = 6) on a in {0.5, 0.25, 0.125} and n = 0..4: the " +
      "exact residual tail never exceeds the sharp cosh bound, which never exceeds the clean exp bound, " +
      "the per-term moment-decay domination holds, and cosh(a T_A) is strictly tighter than e^(a T_A) " +
      "on every rung." +
      "\n\nHONEST SCOPE: derivation/certification only -- supplies an explicit constant for the " +
      "small-a Taylor/moment error of the degree-2 (absolute-measure) masses and establishes NO " +
      "operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face " +
      "carries no feasibility comparison at all (imp-3469: D_2 = 0). The operator-level K_a >= 0 " +
      "off-diagonal endpoint-Hankel obstruction (imp-3066) remains UNTOUCHED. No RH verdict, no QED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3532 (closed error certificate promoting the imp-3501 O(a^{n+2}) moment-tail statement to an explicit all-n constant), 2026",
    relatedTerms: [
      "imp-3501 general-n moment-tail identity R_n(a) = (a^n/n!) M_n + O(a^{n+2})",
      "Fitted moment-remainder tail EXPONENT p_n ~ 2, upgrading the imp-3481 worst-case ratio to a genuine decay law (imp-3502)",
      "genuine-Phi autocorrelation MOMENT LADDER M_0..M_4 and the moment-indexed leading form R_n(a) ~ (a^n/n!) M_n (imp-3481)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Odd-degree (sinh) catastrophic-cancellation safety k-ladder, closed crossover k* (imp-3527)",
    category: "numerical",
    definition:
      "imp-3509 audited the EVEN (cosh) degree-2 catastrophic-cancellation safety of the near-cancelling " +
      "cosh(a tau) - 1 term across the imp-3510 k-ladder; imp-3527 supplies the missing ODD (degree-3) " +
      "analogue for the near-cancelling sinh(a tau) - a tau term of the degree-3 bridge mass " +
      "B_3(a,U) = int_0^U (sinh(a tau) - a tau) A(tau) d(tau). On rung k the worst small sinh argument is " +
      "x_k = a0*T_A/k; forming sinh(x_k) - x_k by direct subtraction and bounding the sinh rounding error " +
      "gives the relative cancellation error rho(k) = eps*x_k/(sinh(x_k) - x_k), whose small-x limit " +
      "(sinh(x) - x ~ x^3/6) is rho(k) ~ 6*eps*k^2/(a0*T_A)^2 -- GROWING like k^2, with leading coefficient " +
      "6, three times the imp-3509 degree-2 coefficient 2, because the odd difference cancels one order " +
      "deeper (x^3/6 vs x^2/2). The competing O(a^2) leading-form tail of B_3 -- " +
      "tail(k) = (a0^2/(20 k^2))(M_5/M_3), the gap from (a^3/6)M_3 to the next odd term (a^5/120)M_5 -- " +
      "SHRINKS like 1/k^2, so the safety margin tail/rho collapses like k^{-4}. Setting rho(k) = tail(k) " +
      "gives the closed-form crossover k* = [a0^4*T_A^2*M_5/(120*eps*M_3)]^{1/4}, with the crossover value " +
      "rho(k*) = tail(k*) cell-independent since a0/k* is constant. Measured on the imp-3510 ladder " +
      "{2,3,4,6,8,12,16,24} on two base cells: rho grows monotonically (5.29e-16 at k=2 to 8.54e-14 at " +
      "k=24 on S3, matching the closed form to <1%), the tail shrinks monotonically (9.11e-5 to 6.33e-7), " +
      "the margin tail/rho stays at least SIX orders of magnitude on every rung (down to ~7.4e6 at k=24 " +
      "on S3, ~3.0e6 on S4), and the crossover k* = 1252.52 (S3) / 1002.02 (S4) sits roughly 40-50x beyond " +
      "the largest tested rung k=24, where both errors equal ~2.32e-10." +
      "\n\nHONEST SCOPE: measurement/certification only -- certifies the floating-point cancellation-safety " +
      "of the degree-3 integrand across the k-ladder and establishes NO operator positivity. " +
      "Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 off-diagonal " +
      "endpoint-Hankel obstruction (imp-3066) remains UNTOUCHED. No RH verdict, no QED. Platt-Trudgian " +
      "Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3527 (derivation and measurement of the odd-degree sinh cancellation safety k-ladder and closed crossover k*), 2026",
    relatedTerms: [
      "closed-form degree-3 (odd) miss factor 1 - 1/k^4 (imp-3510)",
      "genuine-Phi autocorrelation MOMENT LADDER M_0..M_4 and the moment-indexed leading form R_n(a) ~ (a^n/n!) M_n (imp-3481)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Skew-Toeplitz top-singular-pair DEGENERACY and the power-iteration budget(N) ~ K N^2 law (imp-3530)",
    category: "numerical",
    definition:
      "imp-3505 tabulated the power-iteration step budget needed to reach 1e-9 relative agreement on the " +
      "skew-Toeplitz section norm ||Ttilde|| and observed it growing monotonically with the section size N " +
      "(160 -> 520 through 800 -> ~6250), attributing the growth to a shrinking top-singular gap without " +
      "fitting a closed predictor. imp-3530 shows the naive gap ratio lambda_2/lambda_1 is the WRONG " +
      "quantity: because Ttilde(u,v) = a(v-u) R(|v-u|) is SKEW-symmetric, the Gram S = T^T T has a " +
      "DEGENERATE top pair (lambda_1 = lambda_2 to machine precision at every N), so power iteration on S " +
      "actually converges at the rate set by the ratio to the NEXT DISTINCT eigenvalue, rho(N) = " +
      "lambda_3(N)/lambda_1(N). That ratio climbs monotonically toward 1 as N grows (0.977 at N=160 -> " +
      "0.999 at N=800), and since the Rayleigh-type eigenvalue error decays like rho^(2k), the budget to " +
      "reach a tolerance eps is budget(N) = C log(1/eps)/(-log rho(N)) with a single least-squares prefactor " +
      "C ~ 0.32 reproducing the imp-3505 ladder within a factor of 2 at every rung. The gap decay itself " +
      "closes as a power law -log rho(N) = A N^q with q ~ -1.97 (near the -2 section-gap heuristic), giving " +
      "the fully-closed predictor budget(N) ~ K N^2 that extrapolates a-priori budgets at untested N (1000, " +
      "1200, 1600) without re-sweeping." +
      "\n\nHONEST SCOPE: measurement/fit only -- closes a solver-cost predictor from the measured section " +
      "spectral gap and establishes NO operator positivity. The operator-level K_a >= 0 off-diagonal " +
      "endpoint-Hankel obstruction (imp-3066) remains UNTOUCHED. No RH verdict, no QED. Platt-Trudgian " +
      "Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3530 (identification of the skew-forced top-pair degeneracy and the closed budget(N) ~ K N^2 power-iteration cost fit), 2026",
    relatedTerms: [
      "imp-3505 power-iteration budget-to-1e-9 convergence sweep (the ladder fit here)",
      "imp-3467 Ttilde closed-form C_infinity assembly (the power-iteration route)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "sigma(N) post-peak local decay exponent p(N) = -dln sigma/dln N (imp-3529)",
    category: "numerical",
    definition:
      "imp-3406 pinned the imp-3220 GUE-conditional share sigma(N) = E_coll(N)/E(N) to an interior " +
      "MAXIMUM at N_max ~ 9.219e5 (sigma_max ~ 0.94943) and asserted it then decays MONOTONELY toward " +
      "0, while imp-3463 derived the FAR-tail leading form sigma(N) ~ (C_C/E_trunc) sqrt(logT0/N) valid " +
      "only far above the E_coll = E_trunc crossover (N >> 3.28e9). Neither pins down the decay RATE " +
      "across the intermediate regime between the two. imp-3529 measures the local power-law decay " +
      "exponent p(N) = -dln sigma/dln N (central difference in ln N on the exact imp-3220/imp-3406/" +
      "imp-3463 sub-terms) and finds it is NOT constant: p climbs monotonely from ~0 at the flat interior " +
      "maximum (a stationary point) up to the imp-3463 asymptotic value 1/2, approached FROM BELOW " +
      "(p ~ 0.473 at N=1e13, ~0.496 at N=1e50) because the slow logT0 growth keeps the measured exponent " +
      "just under the bare sqrt(1/N) rate. The half-decay point sigma = 1/2 lands EXACTLY at the imp-3444 " +
      "E_coll = E_trunc crossover N ~ 3.27e9, where p ~ 0.238 -- roughly halfway to the 1/2 asymptote, " +
      "marking the inflection of the decay steepening. So the post-peak arm is a single continuous " +
      "interpolation from a flat cap (p=0) to the far-tail sqrt law (p=1/2), not a single power law with " +
      "a fixed exponent." +
      "\n\nHONEST SCOPE: measurement/derivation only, quantifying the roadmap's qualitative monotone-decay " +
      "claim. Does not change the GUE-conditional C_mb <= 1 bridge assumption or touch the imp-3066 " +
      "off-diagonal endpoint-Hankel obstruction; no RH claim, no QED.",
    firstUsed: "imp-3529 (measurement of the sigma(N) post-peak local decay exponent p(N) and its 0 -> 1/2 drift), 2026",
    relatedTerms: [
      "sigma(N) N-shape (interior min ~97.8, interior max ~9.22e5) (imp-3406)",
      "sigma(N) machine-precision landmark ladder L1-L5 (imp-3444)",
      "sigma(N) far-tail decay (imp-3463)",
    ],
    link: "/closure-routes",
  },
  {
    term: "far-tail xi* band-max grid ladder: four grid-invariant rungs to N=9600, xi_Nyq~5027 (imp-3558)",
    category: "numerical",
    definition:
      "imp-3531 certified the imp-3511 far-tail |P1| decade-band-max grid ladder converged over three panel " +
      "counts N = {1200, 2400, 4800} (quadrature Nyquist xi_Nyq = pi N/U doubling 628 -> 1257 -> 2513), but " +
      "stopped there. imp-3558 reuses the imp-3531/imp-3511/imp-3470 P1 assembly VERBATIM and adds one more " +
      "doubling, N = 9600 (xi_Nyq ~ 5027), pushing the aliasing discriminator across a full 8x Nyquist span " +
      "(628 -> 5027) with FOUR grid-invariant rungs instead of three. Three legs of evidence persist at the " +
      "extended grid: (a) the far-tail band-max change keeps SHRINKING on every leg, including the new " +
      "4800 -> 9600 rung (3.89e-10 -> 2.07e-11 -> 1.28e-12, another ~16x shrink), so the Cauchy chain extends " +
      "cleanly with the finest-pair relative change staying < 1.1e-4 in every band; (b) the band argmax " +
      "LOCATIONS are bit-identical at all four rungs (drift 0: 12.07, 40, 80, 160.01, 320.01) while a " +
      "putative Nyquist replica of the true peak would move ~8797 across the widened ladder -- a fixed " +
      "location under a 8x Nyquist span is the sharpened signature of GENUINE decay, not aliasing; (c) the " +
      "far-tail ratio stays under 1% (~1.850e-4) and the band maxima decay MONOTONICALLY at every rung, with " +
      "the peak itself converging (~6.5894e-5, spread ~4e-8). So the imp-3511 no-missed-maximizer bound " +
      "survives another octave of refinement." +
      "\n\nHONEST SCOPE: measurement/certification only, hardening the imp-3511 tail bound by one further " +
      "doubling. It does NOT give xi* or the sup an elementary closed form -- the imp-3470 stationarity " +
      "equation stays transcendental -- and the convergence remains an EMPIRICAL Cauchy/O(H^2) observation " +
      "over a finite ladder N <= 9600, not an analytic quadrature error bound. The imp-3066 off-diagonal " +
      "endpoint-Hankel K_a >= 0 magnitude remains the lone RH obstruction, UNTOUCHED. RH-equivalent; no RH " +
      "verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA." +
      "\n\nCAVEAT (imp-3647): the drift-0 discriminator is decisive here only because all four rungs " +
      "(N>=1200) sit above the imp-3582 worst-case floor N_replica~764. Below a feature-specific fold-in " +
      "floor a folded-in replica can co-locate with the genuine peak at equal height while a coarse scan " +
      "still reports argmax drift 0 (the replica sits off the coarse grid node); below that floor the " +
      "decisive quantity is the in-band comb-peak COUNT, not the coarse argmax location.",
    firstUsed: "imp-3558 (four-rung far-tail xi* band-max grid ladder extension to N=9600, xi_Nyq~5027), 2026",
    relatedTerms: [
      "PSD peak-slope maximizer xi* = 12.0870439 (transcendental root of P2(xi) = 0) (imp-3470)",
      "PSD peak-slope maximizer xi* = 12.0870439: U-invariance and global uniqueness (imp-3489, imp-3483)",
      "far-tail xi* replica-hiding grid threshold N_replica~764 (imp-3582)",
      "sub-floor replica fold-in caveat: feature-specific floor N_fold, peak-count decisiveness (imp-3647)",
    ],
    link: "/closure-routes",
  },
  {
    term: "sigma(N) conditional-share crossing-spacing odds-ratio law N = K logT0 ((1-sigma)/sigma)^2 (imp-3556)",
    category: "numerical",
    definition:
      "imp-3529 loosely summarised the post-peak sigma(N) = E_coll(N)/E(N) drop as \"~0.4 per decade\" " +
      "early on, without root-solving the actual threshold crossings or deriving the spacing law. imp-3556 " +
      "root-solves (400-iter bisection in ln N, residual < 1e-9) the six post-peak crossings on the exact " +
      "imp-3220/imp-3406/imp-3463 sub-terms -- sigma < 0.9 at N=2.572e7, <0.75 at 3.172e8, <0.5 at 3.267e9, " +
      "<0.25 at 3.259e10, <0.1 at 3.213e11, <0.01 at 4.624e13 -- and derives the cancellation-free ODDS-RATIO " +
      "closed form N = K logT0(N) ((1-sigma)/sigma)^2, K = (C_C_PINNED/E_trunc)^2 = 1.5727e8, solved as a " +
      "fixed point on logT0. The law matches the exact roots with relative error EQUAL to the neglected " +
      "E_flow term, shrinking monotonically from 24.6% (sigma=0.9) to 1e-4% (sigma=0.01), so the interior " +
      "crossings 0.75/0.5/0.25/0.1 (odds ratios 1/3, 1, 3, 9) land ~1 decade of N apart. It also CORRECTS the " +
      "imp-3529 phrasing: -dsigma/dlog10N is not a flat ~0.4 constant but a LOGISTIC-in-lnN bump " +
      "(ln10/2) sigma(1-sigma)(1 - dln logT0/dln N), peaking at 0.2738/decade exactly at the imp-3444 " +
      "E_coll = E_trunc crossover (sigma ~ 0.4957, N ~ 3.39e9), trimmed below the ln10/8 = 0.2879 logistic " +
      "cap by logT0 drift, and vanishing at both the flat interior maximum and the far tail." +
      "\n\nHONEST SCOPE: measurement/derivation only, sharpening the imp-3529 decay-rate claim into an exact " +
      "root-solved spacing law with a quantified residual (the neglected E_flow term). Conditional-share " +
      "diagnostic under the GUE-conditional C_mb <= 1 bridge, not an RH bound; the imp-3066 off-diagonal " +
      "endpoint-Hankel obstruction is UNTOUCHED; no QED.",
    firstUsed: "imp-3556 (root-solve of the six sigma(N) post-peak threshold crossings and derivation of the odds-ratio spacing law + logistic drop profile), 2026",
    relatedTerms: [
      "sigma(N) post-peak local decay exponent p(N) = -dln sigma/dln N (imp-3529)",
      "sigma(N) machine-precision landmark ladder L1-L5 (imp-3444)",
      "sigma(N) far-tail decay (imp-3463)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Skew-Toeplitz gap-exponent CONVERGENCE to the -2 section-gap heuristic (imp-3555)",
    category: "numerical",
    definition:
      "imp-3530 fit the skew-Toeplitz top-pair-degenerate Gram gap decay -log rho(N) = A N^q on N=160..800 and " +
      "found q ~ -1.9725, calling it merely \"near\" the -2 section-gap heuristic without settling whether " +
      "extending the ladder would converge to -2 or drift away. imp-3555 extends the ladder above 800 with the " +
      "imp-3545-measured N=1000/1200/1600 rungs (baked -log rho literals, no Lanczos re-run) and reads the LOCAL " +
      "pairwise log-log slope q_local = log(li_{k+1}/li_k)/log(N_{k+1}/N_k) between every consecutive rung. The " +
      "local slope climbs MONOTONICALLY toward -2 through the whole ladder -- -1.9540 (160->240), -1.9671, " +
      "-1.9743, -1.9789, -1.9832, -1.9870 (640->800) -- and the two NEW above-800 rungs continue the identical " +
      "climb, -1.9896 (800->1000) and -1.9915 (1000->1200), landing within 0.0086 of -2. The extended global OLS " +
      "on the monotone N=160..1200 ladder (9 rungs) gives q = -1.9770 (R^2 = 0.99999), marginally CLOSER to -2 " +
      "than the imp-3530 base, so extending the ladder SHARPENS the exponent rather than loosening it. The lone " +
      "N=1600 rung is a NON-MONOTONE measurement artifact (its -log rho rises above the N=1200 value, the " +
      "imp-3545-flagged per-N non-monotonicity): naively including it collapses the OLS to q = -1.763 (R^2 " +
      "0.99999 -> 0.9605), a data-quality outlier, not the true exponent drifting from -2." +
      "\n\nHONEST SCOPE: measurement/fit only -- extends a section-gap decay ladder and certifies q -> -2 " +
      "numerically (a finite-N trend, not a proven asymptotic), excludes one non-monotone rung as an artifact, " +
      "and establishes NO operator positivity. The operator-level K_a >= 0 off-diagonal endpoint-Hankel " +
      "obstruction (imp-3066) remains UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains " +
      "the rigorous SOTA.",
    firstUsed: "imp-3555 (extension of the imp-3530 gap-decay ladder above N=800 and certification that the local log-log slope converges monotonically to the -2 section-gap heuristic), 2026",
    relatedTerms: [
      "Skew-Toeplitz top-singular-pair DEGENERACY and the power-iteration budget(N) ~ K N^2 law (imp-3530)",
      "imp-3545 power-iteration budget measured at N=1000/1200/1600 (the extension rungs)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Far-tail band-max midpoint quadrature: ANALYTIC O(H^2) error bound (imp-3550)",
    category: "numerical",
    definition:
      "imp-3531 certified the imp-3511 far-tail |P1| decade-band-max grid ladder converged over " +
      "successive panel-count doublings, but flagged that convergence as an EMPIRICAL Cauchy/O(H^2) " +
      "observation over a finite ladder, not an analytic error bound. imp-3550 closes that gap: P1 = " +
      "2(C C1 + S S1) is assembled from four composite-midpoint integrals of the smooth de Bruijn-Newman " +
      "integrand over [0, U], and the Euler-Maclaurin midpoint remainder int g - M_H[g] = " +
      "(H^2/24)[g_prime(U) - g_prime(0)] + O(H^4) gives the rigorous bound | int g - M_H[g] | <= " +
      "(U/24) H^2 sup|g_prime2|. Bounding the second derivatives of the trig-weighted integrand by " +
      "M2 + 2 xi M1 + xi^2 M0 (and the analogous H-sup-norm form for the u-weighted pair) and propagating " +
      "through P1 yields |P1_N(xi) - P1(xi)| <= K(xi) H^2, hence |bandMax_N - bandMax_exact| <= B_band H^2 " +
      "with B_band = sup_{(320,400]} K(xi). Halving H shrinks the certified error EXACTLY 4x (verified to " +
      "machine precision), and the imp-3531 empirical 2400 -> 4800 leg change sits UNDER the analytic " +
      "envelope B_band(H_2400^2 - H_4800^2), with the Richardson-extrapolated limit landing inside the " +
      "certified band about the N=4800 reading -- so the finite Cauchy ladder is now bracketed by an " +
      "a-priori formula instead of resting on a table of doublings alone." +
      "\n\nHONEST SCOPE: the bound is RIGOROUS but CONSERVATIVE -- the triangle-inequality sup|g_prime2| " +
      "(dominated by the xi^2 M0 term at xi ~ 400) over-estimates the true quadrature residual by orders " +
      "of magnitude, so it certifies the O(H^2) SCALING and brackets the ladder, not a sharp constant. It " +
      "does NOT give xi* or the sup an elementary closed form (the imp-3470 stationarity equation stays " +
      "transcendental), and it governs only the FINITE domain [0, 400] -- it is not a no-root proof at " +
      "arbitrarily large xi. RH-equivalent; the imp-3066 off-diagonal endpoint-Hankel K_a >= 0 magnitude " +
      "remains the lone obstruction, UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 " +
      "remains the rigorous SOTA.",
    firstUsed: "imp-3550 (Euler-Maclaurin midpoint analytic O(H^2) far-tail band-max error bound, upgrading the imp-3531 empirical Cauchy ladder), 2026",
    relatedTerms: [
      "far-tail xi* band-max grid ladder: four grid-invariant rungs to N=9600, xi_Nyq~5027 (imp-3558)",
      "PSD peak-slope maximizer xi* = 12.0870439 (transcendental root of P2(xi) = 0) (imp-3470)",
      "far-tail xi* replica-hiding grid threshold N_replica~764 (imp-3582)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Cosh-certificate OVER-ESTIMATION factor F_n(a) = cosh(a T_A)/S_n(a), ceiling 1<=F_n<=cosh(a T_A) (imp-3552)",
    category: "numerical",
    definition:
      "imp-3532 promoted the imp-3501 moment-tail residual to the closed sharp certificate " +
      "|R_n(a)-(a^n/n!)M_n| <= (a^(n+2)/(n+2)!) M_(n+2) cosh(a T_A) but only checked the bound HOLDS; " +
      "imp-3546 measured the reciprocal ratio |E_n(a)|/sharp -> 1 in the small-a limit without " +
      "quantifying the over-estimation across the full imp-3532 a-ladder. imp-3552 supplies that " +
      "profile: writing the exact residual tail as E_n(a) = L_n(a) S_n(a) with leading term " +
      "L_n(a) = (a^(n+2)/(n+2)!) M_(n+2) and residual-shape factor S_n(a) := |E_n(a)|/L_n(a) >= 1, the " +
      "over-estimation factor F_n(a) := bound_sharp(a,n)/|E_n(a)| = cosh(a T_A)/S_n(a) factors CLEANLY, " +
      "giving the closed ceiling 1 <= F_n(a) <= cosh(a T_A). MEASURED across a in {0.5, 0.25, 0.125, " +
      "0.0625}, rungs n=0..4 (reusing the imp-3481 ladder M_0..M_6, T_A=6): F_n(a) is ~10.06 at a=0.5 " +
      "(matching cosh 3 ~ 10.0677), ~2.35 at a=0.25, ~1.29 at a=0.125, and ~1.07 at a=0.0625 -- the " +
      "certificate sits up to ~10x above the exact residual at the top of the ladder, tightening " +
      "monotonically toward the a-limit 1. The over-estimation is DOMINATED by the cosh inflation " +
      "constant, not the residual shape: S_n(a) stays within [1, 1.00045] across the whole ladder " +
      "(residual within 0.045% of its leading term), and the decomposition identity F_n(a)*S_n(a) = " +
      "cosh(a T_A) reproduces to <1e-12 on every rung/a." +
      "\n\nHONEST SCOPE: measurement/certification only -- quantifies the over-estimation factor of an " +
      "explicit closed constant for the small-a moment-tail error of the degree-2 (absolute-measure) " +
      "masses and establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT, " +
      "and the degree-2 face carries no feasibility comparison at all (imp-3469: D_2 = 0). The " +
      "operator-level K_a >= 0 off-diagonal endpoint-Hankel obstruction (imp-3066) remains UNTOUCHED. " +
      "No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3552 (cosh-certificate over-estimation factor F_n(a), measuring how far the imp-3532 sharp certificate sits above the exact residual across the full a-ladder), 2026",
    relatedTerms: [
      "Moment-tail CLOSED error certificate |R_n(a)-(a^n/n!)M_n| <= (a^(n+2)/(n+2)!) M_(n+2) e^(a T_A), valid for ALL n",
      "genuine-Phi autocorrelation MOMENT LADDER M_0..M_4 and the moment-indexed leading form R_n(a) ~ (a^n/n!) M_n (imp-3481)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "SHARPENED xi*_inf quadrature residual band 1e-6 -> 1e-9 (imp-3551)",
    category: "numerical",
    definition:
      "imp-3548 confirmed xi*_inf ~ 12.0666876 is quadrature-scheme-invariant (an order-10 composite " +
      "Gauss-Legendre rule and a composite trapezoid + its own 1/N^2 Richardson limit agree with the " +
      "imp-3523 midpoint-extrapolated value), but explicitly declined to sharpen the residual band, " +
      "which stayed quoted at imp-3523s CONSERVATIVE 1e-6 even though its own converged Gauss-Legendre " +
      "tail moved by under 1e-8. imp-3551 closes that gap: it recomputes the extrapolation-free " +
      "composite 5-point Gauss-Legendre ladder (N = 45, 90, 180, 360, 720) with no extrapolation model " +
      "at all, and MEASURES the converged-tail bit-stability directly. The located root is already " +
      "12.0666876106 at N=90 and settles to 12.0666876100 by N=180, holding bit-stable thereafter " +
      "(deep tail N>=180 stable to under 5e-13); the converged-tail spread over N>=90 is ~6.5e-10, " +
      "dominated by the single N=90->180 settling step. The SHARPENED band is defined as the smallest " +
      "power-of-ten strictly ABOVE the measured spread: sharpenedBand = 10^ceil(log10(tailSpread)) = " +
      "1e-9 -- 1000x tighter than the imp-3523/imp-3548 conservative 1e-6. This tightened claim is " +
      "corroborated, not merely asserted: the independent composite trapezoid + Richardson limit " +
      "agrees with the Gauss-Legendre limit to ~1e-15, and both routes sit only ~4e-11 from the " +
      "imp-3523 8-figure headline 12.06668761 -- every independent discrepancy lands strictly inside " +
      "the sharpened 1e-9 band." +
      "\n\nHONEST SCOPE: measurement/certification only -- this sharpens the QUADRATURE-CONVERGENCE " +
      "residual band for the FIXED (NPHI=10, U=6) model that imp-3523 quoted, from 1e-6 to 1e-9. It " +
      "does NOT re-derive an analytic error bound, does NOT quantify the fixed NPHI/U truncation or " +
      "domain systematics (constant across the ladder, cancelling in the spread), and does NOT give " +
      "xi* a closed form -- the imp-3470 stationarity equation stays transcendental. RH-EQUIVALENT; " +
      "the operator-level off-diagonal endpoint-Hankel obstruction K_a >= 0 (imp-3066) remains " +
      "UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3551 (SHARPENED xi*_inf quadrature residual band, tightening the imp-3523/imp-3548 conservative 1e-6 band to a measured 1e-9 via an extrapolation-free Gauss-Legendre convergence study), 2026",
    relatedTerms: [
      "PSD peak-slope maximizer xi* = 12.0870439 (transcendental root of P2(xi) = 0) (imp-3470)",
      "far-tail xi* replica-hiding grid threshold N_replica~764 (imp-3582)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "CANCELLATION-FREE odd degree-3 remainder R_3(a) = sum_{m odd>=3} a^m/m! M_m (imp-3553)",
    category: "numerical",
    definition:
      "imp-3526 reformulated the EVEN degree-4 remainder R_4 (cosh) as a positive moment series to " +
      "eliminate its M_0*eps cancellation floor; imp-3553 extends that reformulation to the ODD " +
      "degree-3 remainder R_3 (sinh). Writing sinh(a tau) = sum_{m odd>=1} (a tau)^m/m! and peeling the " +
      "m=1 term gives R_3(a) = S(a) - a M_1 = sum_{m odd>=3} a^m/m! M_m, a sum of strictly POSITIVE " +
      "terms with NO subtraction of near-equal masses, so the residual tail R_3(a) - (a^3/6)M_3 = " +
      "sum_{m odd>=5} a^m/m! M_m is likewise clean and the relative residual r_3(a) ~ (a^2/20)(M_5/M_3) " +
      "is a genuine O(a^2) power law with no rounding floor. HONEST CORRECTION of the frontier-scout " +
      "premise: the odd form is NOT identically cancellation-prone to the even R_4 -- R_3 subtracts only " +
      "a M_1 (~2.3e-5 at a=0.5) versus R_4's M_0 (~7.7e-4), so its floor a0*M_1*eps~5.0e-21 sits ~34x " +
      "BELOW the R_4 floor M_0*eps~1.7e-19. The subtractive R_3 therefore survives the whole standard " +
      "six-rung ladder cleanly and only breaks down one octave deeper, for a<~0.008. On the extended " +
      "nine-rung ladder {0.5,..,0.001953125} the cancellation-free fit is p=1.99999 (|p-2|~1.2e-5, " +
      "R^2=0.99999999996), recovering the three deepest rungs the corrupted subtractive fit loses to " +
      "noise (p=1.85615, R^2=0.98499, relative residual rising 7.94e-8 -> 2.31e-8 -> 2.56e-8), " +
      "confirming R_3(a) = (a^3/6)M_3 + O(a^5) at the derived order p = 2." +
      "\n\nHONEST SCOPE: measurement/certification only -- reformulates and re-fits the numerical decay " +
      "order of a fixed-weight Taylor remainder and establishes NO operator positivity. Mass-feasibility " +
      "is NECESSARY-BUT-NOT-SUFFICIENT, and the degree-2 face carries no feasibility comparison at all " +
      "(imp-3469: D_2 = 0). The operator-level K_a >= 0 off-diagonal endpoint-Hankel obstruction " +
      "(imp-3066) remains UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the " +
      "rigorous SOTA.",
    firstUsed: "imp-3553 (CANCELLATION-FREE odd degree-3 remainder R_3 recovering three deep ladder rungs and sharpening the tail exponent fit to p=1.99999), 2026",
    relatedTerms: [
      "Fitted moment-remainder tail EXPONENT p_n ~ 2, upgrading the imp-3481 worst-case ratio to a genuine decay law (imp-3502)",
      "closed-form degree-3 (odd) miss factor 1 - 1/k^4 (imp-3510)",
      "Odd-degree (sinh) catastrophic-cancellation safety k-ladder, closed crossover k* (imp-3527)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Skew-Toeplitz N=1600 gap non-monotonicity: Krylov-truncation deficit, not a reversal (imp-3575)",
    category: "numerical",
    definition:
      "imp-3555 excluded the N=1600 rung of the skew-Toeplitz gap ladder -log rho(N) as a non-monotone " +
      "data-quality outlier (its -log rho = 6.4546e-4 sat ABOVE the N=1200 value 4.2946e-4) without testing " +
      "why. imp-3575 re-measures rho = lambda_3/lambda_1 at N=1600 (and the untested N=2000) with the Lanczos " +
      "Krylov depth grown past the imp-3545 m=200 reference and finds the N=1600 rho was STILL MOVING at " +
      "m=200: growing to m=240 shifts it +4.03e-4 (0.9993548 -> 0.9997580), then LOCKS (m=280/320/360 agree " +
      "to < 2e-14). At the N=1200 anchor the m=200 rho is ALREADY converged (stable to 1.3e-13), so the " +
      "deficit is N-SPECIFIC and GROWS with N -- the same imp-3505/imp-3537 pattern where m=80 sufficed below " +
      "N=800 but under-resolved N=800 itself, resurfacing one ladder rung up. The corrected N=1600 -log rho = " +
      "2.4204e-4 now sits BELOW N=1200 (not above it), so the ladder -log rho(N) is STRICTLY DECREASING " +
      "through N=2000 (6.1746e-4, 4.2946e-4, 2.4204e-4, 1.5509e-4) and the local log-log slope CONTINUES the " +
      "imp-3555 climb toward the -2 section-gap heuristic: -1.9933 (1200->1600), -1.9949 (1600->2000), both " +
      "sharper than the imp-3555 -1.9915 at 1000->1200. The converged top-6 Ritz spectrum stays " +
      "skew-symmetry PAIRED (lambda_1=lambda_2, lambda_3=lambda_4), confirming lambda_3 is a genuine level, " +
      "not a reorthogonalization ghost." +
      "\n\nHONEST SCOPE: measurement/correction only -- resolves a Krylov-truncation deficit in a previously " +
      "baked gap measurement and re-establishes monotonicity; does NOT construct the missing magnitude and " +
      "does NOT attempt the imp-3066 K_a >= 0 off-diagonal endpoint-Hankel positivity, which remains " +
      "UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3575 (re-measurement of the imp-3555 N=1600 non-monotone rung with a Krylov depth grown past m=200, attributing the non-monotonicity to lambda_3 truncation and restoring the -log rho(N) monotone climb toward -2), 2026",
    relatedTerms: [
      "Skew-Toeplitz gap-exponent CONVERGENCE to the -2 section-gap heuristic (imp-3555)",
      "imp-3545 power-iteration budget measured at N=1000/1200/1600 (the m=200 reference re-measured here)",
      "imp-3505/imp-3537 Krylov-truncation deficit pattern (m=80 under-resolving N=800)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Inner-A(tau) composite-Simpson truncation constant K_n^inner: clean O(h^4), monotone, tail-redistribution hypothesis falsified (imp-3576)",
    category: "numerical",
    definition:
      "imp-3547 reported the inner-fraction ladder over M_0..M_3 (0.911/0.963/0.903/0.955) as NON-MONOTONE " +
      "without deriving the underlying inner-truncation constant or explaining the pattern. imp-3576 isolates " +
      "the O(h^4) inner-A(tau) composite-Simpson truncation constant K_n^inner directly via a Richardson " +
      "inner-panel h-ladder (innerN 300->2400, outer moment grid held at the imp-3547-converged NM=1600, " +
      "inner error measured against a GL-exact inner reference). RESULT: the inner residual is clean O(h^4) at " +
      "every moment (observed order -> 4.000, K_n stable to <0.3% across the ladder) and K_n^inner is STRICTLY " +
      "MONOTONE DECREASING -- 6.88e-2, 2.45e-2, 5.51e-3, 1.28e-3, 3.14e-4 for M_0..M_4, a ~4x-per-rung decay -- " +
      "not non-monotone. The inner error density C(tau) is concentrated at the tau~0 overlap peak (|C(0)|~1.6) " +
      "and collapses to numerical zero by tau>=1 (C(1)~3e-68), because the two Phi(s), Phi(s+tau) factors only " +
      "overlap for small tau; the tau^n moment weight therefore moves mass AWAY from the curvature, " +
      "monotonically shrinking K_n^inner -- the exact opposite of the hypothesis that tau^n redistributes mass " +
      "toward a high-curvature tail, which is thereby FALSIFIED. The imp-3547 fractions are still reproduced " +
      "(<5e-3), because innerFraction = 1 - |sInner-ref|/|sBase-ref| cancels the |M_n| normalization and reduces " +
      "to a ratio of absolute residuals: its numerator (inner error removed) is the monotone K_n^inner h^4, but " +
      "its NON-MONOTONE parity alternation (even rungs M_0,M_2 near 0.90-0.91; odd rungs M_1,M_3 near " +
      "0.955-0.963) is carried entirely by the leftover |sInner-ref| term -- the OUTER moment-grid Simpson " +
      "residual plus GL-reference residual -- and is DECOUPLED from the inner truncation constant. So the " +
      "imp-3547 non-monotonicity is an outer-residual parity effect, not evidence of tail redistribution." +
      "\n\nHONEST SCOPE: certification/measurement only -- derives and characterizes a quadrature truncation " +
      "constant and explains an observed non-monotone fraction ladder; does NOT construct new structure and " +
      "does NOT attempt the imp-3066 K_a >= 0 off-diagonal endpoint-Hankel positivity, which remains " +
      "UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3576 (Richardson-ladder derivation of the O(h^4) inner-A(tau) Simpson truncation constant K_n^inner, showing it is monotone decreasing and falsifying the imp-3547 tail-redistribution hypothesis by localizing the non-monotonicity to the outer-residual ratio), 2026",
    relatedTerms: [
      "imp-3547 lower-moment Simpson residual localization and inner-fraction ladder (imp-3547)",
      "imp-3528 degree-4 moment Simpson refinement (imp-3528)",
      "imp-3481 moment ladder recipe (NPHI=10 A(tau) construction)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Degree-d bridge miss factor 1 - 1/k^(d+1): moment-independent, EXACTLY zero refinement shift (imp-3579)",
    category: "numerical",
    definition:
      "The imp-3488 degree-2 (1 - 1/k^3) and imp-3510 degree-3 (1 - 1/k^4) bridge-mass MISS-FACTOR constants " +
      "are DERIVED from the a^d homogeneity of the leading form (a^d/d!)M_d: the moment M_d is the leading " +
      "coefficient and CANCELS identically in the scaling ratio r_k = B_d(a/k)/B_d(a) = k^{-d}[1 + O(a^2)]. So " +
      "the derived constant 1 - 1/k^(d+1) is a PURE FUNCTION OF k that carries no moment at all. imp-3579 " +
      "propagates the imp-3557 refined moments (M_4 = 9.62528e-8, M_3, relative corrections ~1.55e-6 to " +
      "~5.41e-6 across M_2..M_5) through both miss factors and confirms this by direct computation: the " +
      "reported closed-form constants shift by EXACTLY ZERO under the refinement, on every k-ladder rung " +
      "{2,3,4,6,8} and both imp-3469 base cells (0.5,6) and (0.4,10). The only residual moment sensitivity " +
      "enters through the O(a^2) leading-form tail, where the ratio depends on M_(d+2)/M_d (degree-2: M_4/M_2; " +
      "degree-3: M_5/M_3); building the two-term model T_2(a)=(a^2/2)M_2+(a^4/24)M_4 and " +
      "T_3(a)=(a^3/6)M_3+(a^5/120)M_5 and evaluating with base-vs-converged moments gives a miss-factor shift " +
      "of only ~9.2e-11 (degree-2) / ~5.2e-11 (degree-3) -- four-plus orders below the propagated moment " +
      "correction (max ~3.8e-6 / ~5.4e-6) and ~seven orders inside the leading-form tail budgets " +
      "tail_2=(a^2/12)(M_4/M_2) ~4.4e-4 and tail_3=(a^2/20)(M_5/M_3) ~3.6e-4. The reported miss factors stand " +
      "UNPERTURBED by the imp-3557 refinement." +
      "\n\nHONEST SCOPE: certification/measurement only -- propagates a resolved quadrature-truncation correction " +
      "through existing miss-factor constants and adds NO new mathematical structure. Mass-feasibility remains " +
      "NECESSARY-BUT-NOT-SUFFICIENT (imp-3481); the operator-level K_a >= 0 off-diagonal endpoint-Hankel " +
      "positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the " +
      "rigorous SOTA.",
    firstUsed: "imp-3579 (propagation of the imp-3557 refined M_4/M_3 moments into the imp-3488/imp-3510 degree-2/degree-3 miss-factor constants, showing the derived 1 - 1/k^(d+1) carries no moment and shifts exactly zero, with the two-term model shift ~1e-10 confined to the O(a^2) tail), 2026",
    relatedTerms: [
      "imp-3557 refined M_4 leading-form propagation (imp-3557)",
      "imp-3488 degree-2 miss-factor closed form 1 - 1/k^3 (imp-3488)",
      "imp-3510 degree-3 miss-factor closed form 1 - 1/k^4 (imp-3510)",
      "imp-3481 autocorrelation moment ladder (imp-3481)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "sigma=1/2 <=> E_coll=E_trunc crossover coincidence: EXACTLY floor-invariant, flow-gap grows 0.228%->0.687% (imp-3580)",
    category: "numerical",
    definition:
      "imp-3556 certified at the SINGLE baseline E_trunc floor (3.06e-5) that the sigma(N)=1/2 half-decay of the " +
      "conditional collision share COINCIDES with the E_coll=E_trunc crossover (imp-3444), the two crossings " +
      "sitting only 0.40% apart. imp-3580 re-root-solves BOTH N_half (sigma=1/2) and N_x (E_coll=E_trunc) across " +
      "the imp-3443 half-to-double E_trunc floor grid (0.5x..2x baseline, five nodes) to separate what is " +
      "STRUCTURAL from what is a baseline-floor accident. (1) The coincidence ITSELF is EXACTLY floor-invariant: " +
      "dropping the tiny E_flow term, sigma=x/(1+x) with x=E_coll/E_trunc, so sigma=1/2 <=> x=1 <=> E_coll=E_trunc " +
      "for ANY floor -- root-solving confirms x(N_x)=1.000000 to machine precision at all five floors, with " +
      "sigma(N_x) sitting just under 1/2 (0.499727 down to 0.499184 as the floor rises from 0.5x to 2x). This is a " +
      "structural odds-ratio property, not a baseline accident. (2) The N_half/N_x ratio stays in the tight band " +
      "[0.99313, 0.99772] ~ 0.996 across the whole grid, with the baseline node reproducing imp-3556 to the last " +
      "digit (ratio 0.996019, N_x=3.280294e9, gap 0.398%). (3) HONEST REFINEMENT: the ~0.40% flow-gap is NOT a " +
      "floor-invariant constant -- it grows MONOTONICALLY with the floor, 0.228% (0.5x) -> 0.398% (1x, imp-3556) " +
      "-> 0.687% (2x), straddling the baseline reading. What IS invariant is the structural law behind it: " +
      "gap = 1 - N_half/N_x ~ 2 E_flow(N_x)/E_trunc (leading order), and the measured gap tracks this law across " +
      "the grid to within ~5% (e.g. 0.228% vs 0.218%, 0.687% vs 0.653%). So the coincidence is a genuine " +
      "E_flow/E_trunc property exactly as imp-3556 suspected, but the specific 0.40% is a baseline-floor READING " +
      "of that law, not a universal constant -- correcting a literal 'gap stays ~0.40%' expectation." +
      "\n\nHONEST SCOPE: measurement/certification only (400-iter bisection roots, residual < 1e-9) -- a " +
      "conditional-share diagnostic, NOT an RH bound. No positivity, no bridge closure, no RH claim, no QED. " +
      "imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity remains UNTOUCHED. Platt-Trudgian Lambda <= 0.2 " +
      "remains the rigorous SOTA.",
    firstUsed: "imp-3580 (re-root-solving the imp-3556 sigma=1/2 <=> E_coll=E_trunc crossover coincidence across the imp-3443 half-to-double E_trunc floor grid, showing the coincidence is exactly floor-invariant while the ~0.40% flow-gap is a baseline reading of a monotonically-growing structural law), 2026",
    relatedTerms: [
      "imp-3556 baseline half-decay <=> crossover certification (imp-3556)",
      "imp-3444 E_coll=E_trunc crossover landmark (imp-3444)",
      "imp-3443 half-to-double E_trunc floor sensitivity grid (imp-3443)",
      "imp-398 E_flow C_F prefactor (imp-398)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "moment-remainder tail exponent p=2: closed C_n=M_(n+2)/((n+1)(n+2)M_n) and the fit-bias law (imp-3581)",
    category: "numerical",
    definition:
      "imp-3502 and imp-3553 FIT the same-parity moment-remainder tail exponent to p~2 (imp-3553 sharpening the odd " +
      "degree-3 case to p=1.99999 on a nine-rung cancellation-free ladder) but neither DERIVED p=2 from the moment " +
      "structure nor explained the ~1.2e-5 shortfall from 2. imp-3581 supplies the closed derivation. From the " +
      "same-parity moment series R_n(a)=sum_{m>=n,step2} a^m/m! M_m (imp-3501), peeling the leading term gives the " +
      "relative residual r_n(a)=[R_n(a)-(a^n/n!)M_n]/[(a^n/n!)M_n]=C_n a^2[1+D_n a^2+O(a^4)] with the CLOSED leading " +
      "coefficient C_n=M_(n+2)/((n+1)(n+2)M_n) -- reducing to C_3=M_5/(20 M_3)~1.4573e-3 (matching the imp-3553 " +
      "a^2/20 M_5/M_3) and C_4=M_6/(30 M_4)~1.2329e-3 (matching the imp-3526 a^2/30 M_6/M_4). Since the leading power " +
      "of a is EXACTLY 2, the tail exponent p=2 is DERIVED, not fitted. The next-order coefficient " +
      "D_n=M_(n+4)/((n+3)(n+4)M_(n+2))-M_(n+2)/((n+1)(n+2)M_n) (D_3~-3.94e-4, D_4~-3.01e-4) gives the closed " +
      "least-squares fit-bias law p_fit=2+D_n cov(a^2,ln a)/var(ln a) over the geometric a-ladder: taking logs of the " +
      "residual model and fitting a straight line absorbs the D_n a^2 curvature into the measured slope. MEASURED, " +
      "this predicted p_fit reproduces the ACTUAL least-squares fit to ~1e-9 (odd nine-rung: fitted 1.99998842 vs " +
      "predicted 1.99998843, |p-2|~1.16e-5; even six-rung: fitted 1.99998204 vs predicted 1.99998205, |p-2|~1.80e-5), " +
      "so the imp-3553 1.99999 and the imp-3502 fits ARE the derived 2 up to a coefficient-quantified curvature bias, " +
      "NOT exponent drift. The leading coefficient is independently confirmed by r_n(a)/a^2 -> C_n (deepest clean " +
      "rung matches to relative 1.5e-9 for n=3, 7.4e-8 for n=4), and |p_fit-2| shrinks MONOTONICALLY as the ladder " +
      "deepens (6.66e-5 at 3 rungs -> 1.16e-5 at the imp-3553 nine rungs -> 3.19e-6 at 18 rungs), the nine-rung floor " +
      "set by the odd cancellation limit a0*M_1*eps~5e-21 (imp-3553)." +
      "\n\nHONEST SCOPE: measurement/derivation only -- derives the closed decay ORDER (p=2) and leading coefficient " +
      "of a fixed-weight Taylor remainder and certifies the fitted values equal it; establishes NO operator " +
      "positivity. Mass-feasibility remains NECESSARY-BUT-NOT-SUFFICIENT (the degree-2 face carries no feasibility " +
      "comparison, imp-3469: D_2=0); the operator-level K_a >= 0 off-diagonal endpoint-Hankel positivity (imp-3066) " +
      "is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3581 (closed derivation of the moment-remainder tail exponent p=2 and the fit-bias law p_fit=2+D_n cov(a^2,ln a)/var(ln a), certifying the imp-3553 fitted 1.99999 equals the derived 2 up to a fully-quantified O(a^2) curvature bias), 2026",
    relatedTerms: [
      "imp-3553 cancellation-free odd R_3 fit p=1.99999 (imp-3553)",
      "imp-3526 cancellation-free even R_4 fit (imp-3526)",
      "imp-3502 original tail-exponent fit (imp-3502)",
      "imp-3501 moment ladder general derivation (imp-3501)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "analytic replica-hiding grid threshold N_replica = xi_max U/pi ~ 764 (imp-3582)",
    category: "numerical",
    definition:
      "imp-3558 hardened the imp-3511 far-tail |P1| no-missed-maximizer bound to four grid-invariant " +
      "rungs (N in {1200,2400,4800,9600}) resting on an EMPIRICAL contrast: a sub-threshold aliasing " +
      "replica of the true peak would sit near 2 xi_Nyq - xi_true and move ~2(delta xi_Nyq)~8797 across " +
      "the widened ladder, whereas genuine peaks keep a bit-fixed argmax (drift 0). That is a numerical " +
      "contrast, not an analytic threshold -- imp-3558 never derived the grid size below which a replica " +
      "could still fold into the scanned band and co-locate with a genuine peak. imp-3582 supplies that " +
      "floor. Midpoint quadrature on [0,U] with N panels samples at spacing H=U/N and sampling frequency " +
      "omega_s=2 pi N/U=2 xi_Nyq (Nyquist xi_Nyq=pi N/U), so a genuine feature at xi_true produces its " +
      "first positive-baseband replica at L(xi_true)=2 xi_Nyq-xi_true. That replica is observable only if " +
      "it folds back into the scanned band (0,xi_max], xi_max=400: 0 < 2 xi_Nyq-xi_true <= xi_max. The " +
      "loosest in-band source (xi_true=xi_max) makes this possible only for xi_Nyq <= xi_max, i.e. " +
      "N <= N_replica = xi_max U/pi = 2400/pi ~ 763.94 (ceil 764, U=6). For N > N_replica the ENTIRE band " +
      "(0,400] is provably replica-free -- no first-order alias of any in-band feature can appear " +
      "anywhere in the band -- so the drift-0 observation is analytically DECISIVE, not merely a numerical " +
      "contrast. Two tighter refinements give context: the co-location floor (a replica landing within " +
      "the argmax resolution dxi of the largest genuine peak xi_peak_max~320.01) is N_colocate = " +
      "(xi_max+xi_peak_max)U/(2 pi) ~ 688; the main-maximizer floor (a replica of the global maximizer " +
      "xi* ~ 12.087, imp-3470) is only reachable below N ~ 394. The smallest imp-3558 rung N=1200 " +
      "(xi_Nyq~628.3) sits a factor ~1.57 above N_replica~764, so all four rungs are replica-free and the " +
      "argmax-drift-0 discriminator has an analytic floor underneath its empirical contrast." +
      "\n\nHONEST SCOPE: derivation/certification only, using the standard FIRST-order sampling-alias " +
      "model (higher-order images 2k xi_Nyq-xi_true, k>=2, fold in only at even smaller N, so k=1 is the " +
      "binding floor). It gives no closed form for xi* or the sup (the imp-3470 stationarity equation " +
      "stays transcendental), does not extend the finite domain (0,400], and measures the tail ratio, not " +
      "operator positivity. RH-EQUIVALENT necessary-but-not-sufficient; the imp-3066 off-diagonal " +
      "endpoint-Hankel K_a >= 0 magnitude is the lone obstruction, UNTOUCHED. No RH verdict, no QED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3582 (analytic replica-hiding grid threshold N_replica = xi_max U/pi ~ 764 hardening the imp-3558 argmax-drift-0 discriminator with an a-priori floor, all four ladder rungs sitting ~1.57x above it), 2026",
    relatedTerms: [
      "imp-3558 far-tail band-max grid ladder N=1200..9600 (imp-3558)",
      "imp-3511 no-missed-maximizer wide-range robustness (imp-3511)",
      "imp-3470 spectral peak xi* transcendental obstruction (imp-3470)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "m-fold aliasing replica ladder N_m = N_replica/m: floors 764/382/255, sup_m N_m = N_1 (imp-3601)",
    category: "numerical",
    definition:
      "imp-3582 derived the first-order (m=1) replica-hiding floor N_replica~764 and noted -- but did " +
      "not measure -- that higher-order aliasing images fold in only at smaller N, so the k=1 floor " +
      "'is the binding one.' imp-3601 DERIVES and MEASURES that whole claim. Sampling periodizes the " +
      "spectrum with period omega_s=2 xi_Nyq, so a baseband source at xi_true produces the full image " +
      "set {2 m xi_Nyq +/- xi_true : m=1,2,3,...}; the m=1 minus image is the imp-3582 first replica " +
      "and the m=2 minus image 4 xi_Nyq-xi_true is the SECOND fold (the fold of the first replica). " +
      "The m-th fold lands in the scanned band (0,xi_max] only for the loosest in-band source " +
      "xi_true=xi_max, giving the m-floor N <= N_m = xi_max U/(m pi) = N_replica/m. These floors " +
      "DECREASE monotonically in m: the first replica (m=1, N_replica~763.94, ceil 764) is the " +
      "LARGEST and therefore binding; the second fold sits at N_2=1200/pi~381.97 (ceil 382), the " +
      "third at N_3~254.65 (ceil 255), the fourth at N_4~190.99. So sup_m N_m = N_1 = N_replica -- no " +
      "higher fold ever raises the imp-3582/imp-3558 replica-free floor. As a bonus drift check, an " +
      "m-fold replica moves 2 m xi_Nyq per panel doubling, so the second fold shifts ~17593 across " +
      "the imp-3558 ladder 1200->9600 -- exactly 2x the ~8797 first-replica contrast -- meaning the " +
      "argmax-drift-0 discriminator unmasks a higher-order replica even more decisively than a " +
      "first-order one. The smallest imp-3558 rung N=1200 clears the second-fold floor by ~3.14x and " +
      "the first-replica floor by ~1.57x, so all four rungs sit above EVERY fold threshold." +
      "\n\nHONEST SCOPE: derivation/certification only, confirming the imp-3582 'k=1 is binding' remark " +
      "by measuring the full alias-image ladder, not a new closed form (the imp-3470 stationarity " +
      "equation stays transcendental) and not an extension of the finite-domain (0,400] measurement. " +
      "RH-EQUIVALENT necessary-but-not-sufficient; the imp-3066 off-diagonal endpoint-Hankel K_a >= 0 " +
      "magnitude is the lone obstruction, UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= " +
      "0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3601 (second-fold and general m-fold aliasing replica threshold ladder N_m=N_replica/m, certifying sup_m N_m=N_1~764 stays binding and no higher fold raises the imp-3582 floor), 2026",
    relatedTerms: [
      "analytic replica-hiding grid threshold N_replica = xi_max U/pi ~ 764 (imp-3582)",
      "far-tail xi* band-max grid ladder: four grid-invariant rungs to N=9600, xi_Nyq~5027 (imp-3558)",
      "sub-floor replica fold-in caveat: feature-specific floor N_fold, peak-count decisiveness (imp-3647)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "moment-remainder tail exponent ladder extended to n=5,6: C_5=M_7/(42 M_5), C_6=M_8/(56 M_6) (imp-3600)",
    category: "numerical",
    definition:
      "imp-3581 derived the closed p=2 moment-remainder tail exponent and the fit-bias law " +
      "p_fit=2+D_n cov(a^2,ln a)/var(ln a) for the same-parity remainder series R_n(a)=sum_{m>=n,step2} " +
      "a^m/m! M_m, but verified the closed C_n/D_n forms and the bias law only at n=3 (odd) and n=4 (even). " +
      "imp-3600 EXTENDS the certified ladder to the next rungs n=5 (odd sinh R_5) and n=6 (even cosh R_6), " +
      "measuring the A-weighted moments M_7..M_10 on the SAME NM=1600 [0,T_A] Simpson reference used by " +
      "imp-3581. The general closed leading coefficient C_n=M_(n+2)/((n+1)(n+2)M_n) reduces to " +
      "C_5=M_7/(42 M_5)~1.06348e-3 ((6)(7)=42) and C_6=M_8/(56 M_6)~9.31428e-4 ((7)(8)=56), with next-order " +
      "D_5~-2.3767e-4, D_6~-1.9186e-4. The predicted p_fit reproduces the ACTUAL least-squares log-log slope " +
      "to ~1e-9 at both new rungs (odd: fitted 1.99999301 vs predicted 1.99999302, slopeModelErr~6.4e-10, " +
      "|p-2|~6.99e-6; even: fitted 1.99998857 vs predicted 1.99998857, slopeModelErr~1.1e-9, |p-2|~1.14e-5), " +
      "independently confirmed by r_n(a)/a^2 -> C_n (deepest rung matches C_5 to 9.1e-10, C_6 to 4.7e-8). So " +
      "the exponent stays EXACTLY 2 at n=5,6 and the sub-2 fitted read-out is the derived O(a^2) curvature " +
      "bias, not exponent drift -- the imp-3581 derivation holds beyond the n=3,4 pair it originally tested." +
      "\n\nHONEST SCOPE: measurement/derivation only -- extends the certified rung set (to n=5,6) of a " +
      "fixed-weight Taylor-remainder decay ORDER and its leading coefficient; establishes NO operator " +
      "positivity. Mass-feasibility remains NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a >= 0 " +
      "off-diagonal endpoint-Hankel positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3600 (extends the imp-3581 closed moment-remainder tail exponent ladder to rungs n=5,6, certifying the fit-bias law reproduces the actual least-squares slope to ~1e-9 at both), 2026",
    relatedTerms: [
      "imp-3581 closed C_n/D_n derivation and fit-bias law, n=3,4 (imp-3581)",
      "imp-3618 remainder-tail exponent ladder n=7,8 (imp-3618)",
      "imp-3553 cancellation-free odd R_3 fit p=1.99999 (imp-3553)",
      "imp-3526 cancellation-free even R_4 fit (imp-3526)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Self-consistent O(eps^3) flow-gap expansion: resummed leading d1=-2/(1-lambda) (imp-3617)",
    category: "numerical",
    definition:
      "imp-3599 wrote the EXACT flow-gap identity gap = 1 - (L_half/L_x)/(1+eta)^2, eta = " +
      "E_flow(N_half)/E_trunc, and a perturbative O(eps^2) crude model 2 eps(1+lambda) - " +
      "(4 mu+4 lambda+3) eps^2 (eps = E_flow(N_x)/E_trunc) that closes ~94-95% of the imp-3580 leading-law " +
      "residual, leaving a ~5% tail (resid ~4.5e-4..1.9e-3 pp). imp-3617 pushes the SAME exact identity to a " +
      "self-consistent closed expansion in eps: writing Du = ln(N_half/N_x) = d1 eps + d2 eps^2 + " +
      "d3 eps^3 + O(eps^4) and solving the fixed point Du = ln(L_half/L_x) - 2 ln(1+eta) order by order " +
      "gives the resummed leading coefficient d1 = -2/(1-lambda) (lambda = d lnL/d lnN), the second " +
      "coefficient d2 = [(1/2) s d1^2 + 1 - 2 mu d1]/(1-lambda) -- FIRST requiring the slope-curvature " +
      "s = d^2 lnL/d(lnN)^2 and the E_flow log-curvature nu = d^2 lnE_flow/d(lnN)^2 -- and a third " +
      "coefficient d3 adding the log-N third derivative t. The gap follows from gap = 1 - exp(Du) " +
      "truncated consistently at each order. Re-root-solving both crossings across the imp-3443 " +
      "half-to-double E_trunc floor grid f in {0.5..2} (400-iter bisection, residual <1e-9, reproducing " +
      "imp-3580/imp-3599 to the last digit) and evaluating lambda, mu, s, nu, t by central finite " +
      "difference in ln N (step 1e-4, stable under step halving) shows geometric convergence: at f=0.5 " +
      "the residual falls 4.49e-4 (imp-3599) -> 6.54e-5 (leading d1) -> 1.38e-7 (O(eps^2)) -> 3.13e-10 " +
      "(O(eps^3)), a ~5-6 order-of-magnitude drop toward the ~1e-13 exact-identity floor, with the same " +
      "ratio-100+ per-order shrink at every floor node f in {0.5,0.75,1.0,1.5,2.0}. The resummed leading " +
      "term -d1 eps = 2 eps/(1-lambda) already beats the imp-3599 crude model outright, because the " +
      "2 lambda^2 eps piece the imp-3599 linearization 2 eps(1+lambda) dropped is the dominant part of " +
      "its residual tail." +
      "\n\nHONEST SUB-GAP imp-3617-fourthorder-fd-floor: the O(eps^3) truncation does NOT reach the " +
      "~1e-13 exact-identity floor; a plateau at ~3e-10..2.3e-8 pp survives from the neglected O(eps^4) " +
      "term and the finite-difference evaluation of the curvature slopes s, nu, t. The imp-3599 exact " +
      "identity remains the complete closed object; only the perturbative expansion is now truncated one " +
      "order further. Derivation/measurement only; no positivity, no bridge closure, no RH claim, NO QED. " +
      "RH-EQUIVALENT necessary-but-not-sufficient; the imp-3066 off-diagonal endpoint-Hankel K_a >= 0 " +
      "magnitude is the lone obstruction, UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains the rigorous " +
      "SOTA.",
    firstUsed: "imp-3617 (self-consistent O(eps^3) flow-gap expansion of the imp-3599 exact identity, driving the residual ~5-6 orders below the imp-3599 crude O(eps^2) tail toward the ~1e-13 exact floor), 2026",
    relatedTerms: [
      "imp-3599 exact flow-gap identity and O(eps^2) crude model (imp-3599)",
      "imp-3580 sigma-crossover floor invariance / leading gap law (imp-3580)",
      "imp-3556 baseline half-decay <=> crossover certification (imp-3556)",
      "imp-3443 half-to-double E_trunc floor grid (imp-3443)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "moment-remainder tail exponent ladder extended to n=7,8: C_7=M_9/(72 M_7), C_8=M_10/(90 M_8) (imp-3618)",
    category: "numerical",
    definition:
      "imp-3581 derived the closed p=2 moment-remainder tail exponent and the fit-bias law " +
      "p_fit=2+D_n cov(a^2,ln a)/var(ln a) for the same-parity remainder series R_n(a)=sum_{m>=n,step2} " +
      "a^m/m! M_m, and imp-3600 certified it at rungs n=5,6 (C_5=M_7/(42 M_5), C_6=M_8/(56 M_6)). imp-3618 " +
      "EXTENDS the certified ladder to the next rungs n=7 (odd sinh R_7) and n=8 (even cosh R_8), measuring " +
      "the A-weighted moments M_11..M_14 on the SAME NM=1600 [0,T_A] Simpson reference. The general closed " +
      "leading coefficient C_n=M_(n+2)/((n+1)(n+2)M_n) reduces to C_7=M_9/(72 M_7)~8.25809e-4 ((8)(9)=72) and " +
      "C_8=M_10/(90 M_8)~7.39567e-4 ((9)(10)=90), with next-order D_7~-1.5787e-4, D_8~-1.3198e-4. The predicted " +
      "p_fit reproduces the ACTUAL least-squares log-log slope to ~1e-9 at both new rungs (odd: fitted " +
      "1.99999536 vs predicted 1.99999536, slopeModelErr~3.9e-10, |p-2|~4.64e-6; even: fitted 1.99999214 vs " +
      "predicted 1.99999214, slopeModelErr~6.6e-10, |p-2|~7.86e-6), independently confirmed by r_n(a)/a^2 -> " +
      "C_n (deepest rung matches C_7 to 6.0e-10, C_8 to 3.2e-8). So the exponent stays EXACTLY 2 at n=7,8 and " +
      "the sub-2 fitted read-out remains the derived O(a^2) curvature bias, not exponent drift. Both new rungs " +
      "continue the monotone same-parity |p_fit-2| trend (odd n=3,5,7: 1.16e-5,6.99e-6,4.64e-6; even n=4,6,8: " +
      "1.80e-5,1.14e-5,7.86e-6), tracking the shrinking |D_n|." +
      "\n\nHONEST SCOPE: measurement/derivation only -- extends the certified rung set (to n=7,8) of a " +
      "fixed-weight Taylor-remainder decay ORDER and its leading coefficient; establishes NO operator " +
      "positivity. Mass-feasibility remains NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a >= 0 " +
      "off-diagonal endpoint-Hankel positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3618 (extends the imp-3581/imp-3600 closed moment-remainder tail exponent ladder to rungs n=7,8, certifying the fit-bias law reproduces the actual least-squares slope to ~1e-9 at both), 2026",
    relatedTerms: [
      "imp-3600 remainder-tail exponent ladder n=5,6 (imp-3600)",
      "imp-3581 closed C_n/D_n derivation and fit-bias law, n=3,4 (imp-3581)",
      "imp-3553 cancellation-free odd R_3 fit p=1.99999 (imp-3553)",
      "imp-3526 cancellation-free even R_4 fit (imp-3526)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Skew-Toeplitz SECOND gap sigma_2=lambda_5/lambda_1 also converges to -2, fixed ~8/3 amplitude ratio (imp-3602)",
    category: "numerical",
    definition:
      "imp-3575 certified the -2 section-gap heuristic only for the FIRST skew-Toeplitz gap rho=lambda_3/lambda_1, " +
      "while merely noting that the top-6 Gram Ritz spectrum is skew-symmetry PAIRED (lambda_1=lambda_2, " +
      "lambda_3=lambda_4, lambda_5=lambda_6), leaving a SECOND independent gap sigma_2=lambda_5/lambda_1 unmeasured. " +
      "imp-3602 re-ran the identical imp-3505/imp-3575 assembly (Ttilde(u,v)=a(v-u)R(|v-u|), NPHI=10, H0=0.025) with " +
      "a full-reorthogonalization Lanczos at converged Krylov depth m=min(N,440), extracting the top-six Ritz values " +
      "across the imp-3555 ladder N=160..2000. FOUND: (1) the second gap ALSO converges to the -2 heuristic -- its " +
      "local log-log exponent climbs monotonically from -1.9551 (160->240) to -1.9948 (1600->2000), " +
      "indistinguishable from the first-gap exponent at every step (< 2e-3 apart), with global fit q_2=-1.9813 " +
      "(R^2=0.99999) matching q_1=-1.9811; (2) the two gaps share ONE power law with a FIXED amplitude ratio: " +
      "-log sigma_2/-log rho is nearly constant across the ladder (2.6691 at N=160 down to 2.6667 at N=2000, mean " +
      "2.6671, tending to 8/3) -- the signature of a common N^-2 law with pair-index amplitude a_j proportional to " +
      "(j^2-1), giving a_3/a_2=8/3 exactly (reported as an EMPIRICAL structural observation, tested through only a " +
      "single ratio, not a derived law); (3) lambda_5=lambda_6 holds to relative < 2e-14 through N=1200 (< 1.1e-11 " +
      "at N=2000), confirming lambda_5 is a genuine third-pair level (imp-3596 adjacent-pairing), not a Lanczos " +
      "reorthogonalization ghost." +
      "\n\nHONEST SCOPE: measurement only -- extends a section-gap decay exponent one pair further and reports an " +
      "empirical amplitude ordering; establishes NO operator positivity. Mass-feasibility remains NECESSARY-BUT-" +
      "NOT-SUFFICIENT; the operator-level K_a >= 0 off-diagonal endpoint-Hankel positivity (imp-3066) is UNTOUCHED. " +
      "No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3602 (measures the second skew-Toeplitz gap sigma_2=lambda_5/lambda_1, certifies its convergence to the -2 section-gap heuristic, and reports the near-constant ~8/3 amplitude ratio against the first gap), 2026",
    relatedTerms: [
      "Skew-Toeplitz gap-exponent CONVERGENCE to the -2 section-gap heuristic (imp-3555)",
      "imp-3619 third skew-Toeplitz gap sigma_3=lambda_7/lambda_1 and pair j=4 amplitude corroboration (imp-3619)",
      "imp-3623/imp-3625 dense-solver resolution of the N=2000 third-pair Krylov artifact (imp-3654)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Skew-Toeplitz THIRD gap sigma_3=lambda_7/lambda_1 also converges to -2, j^2-1 amplitude law holds through pair j=4 (imp-3619)",
    category: "numerical",
    definition:
      "imp-3602 measured the SECOND skew-Toeplitz gap sigma_2=lambda_5/lambda_1, found it converges to the same " +
      "-2 section-gap exponent as the first gap rho=lambda_3/lambda_1, and reported the near-constant ratio " +
      "-log sigma_2/-log rho ~ 8/3, the signature of a common N^-2 law with pair-index amplitude a_j proportional " +
      "to (j^2-1) (a_3/a_2 = 8/3) -- tested through only a single ratio. imp-3619 measures the THIRD gap " +
      "sigma_3=lambda_7/lambda_1 (the fourth-pair/first-pair Gram-Ritz ratio) on the identical imp-3505/imp-3575/" +
      "imp-3602 assembly across N=160..2000 and finds (1) the third gap ALSO converges to the -2 heuristic: its " +
      "local log-log exponent climbs monotonically from -1.9568 (160->240) to -1.9948 (1600->2000), " +
      "indistinguishable from the first-gap exponent at every step (< 3e-3 apart), with global fit q_3=-1.9817 " +
      "(R^2=0.99999) matching q_1=-1.9811 -- so the -2 heuristic governs the FULL leading spectrum, not just the " +
      "first two gaps; (2) the j^2-1 amplitude law is corroborated at pair j=4 by TWO independent ratios: " +
      "-log sigma_3/-log rho tends cleanly to 5.00008 = a_4/a_2 = (16-1)/(4-1), and -log sigma_3/-log sigma_2 " +
      "tends to 1.87502 = a_4/a_3 = 15/8, upgrading the ordering from a single-ratio suggestion to a two-ratio " +
      "corroboration; (3) lambda_7=lambda_8 holds to < 4e-14 through N=1600, confirming lambda_7 is a genuine " +
      "fourth-pair level (imp-3596 adjacent-pairing), not a Lanczos reorthogonalization ghost." +
      "\n\nHONEST SCOPE: measurement/corroboration only -- extends a section-gap decay exponent and an EMPIRICAL " +
      "amplitude ordering one pair further; the j^2-1 law is still a candidate observation, NOT a derived law, " +
      "and establishes NO operator positivity. The operator-level K_a >= 0 off-diagonal endpoint-Hankel " +
      "obstruction (imp-3066) remains UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains " +
      "the rigorous SOTA.",
    firstUsed: "imp-3619 (measures the third skew-Toeplitz gap sigma_3=lambda_7/lambda_1, certifies its convergence to the -2 section-gap heuristic, and corroborates the imp-3602 j^2-1 amplitude law at pair j=4 via two independent ratios), 2026",
    relatedTerms: [
      "Skew-Toeplitz gap-exponent CONVERGENCE to the -2 section-gap heuristic (imp-3555)",
      "imp-3602 second gap sigma_2=lambda_5/lambda_1 and the j^2-1 amplitude law at pair j=3",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "sigma-crossover flow factor PINNED via the imp-398 closed form t_c(N)~1/log gamma_N (imp-3620)",
    category: "numerical",
    definition:
      "imp-3604 bounded the sigma=1/2 half-decay scale N_half and the E_coll=E_trunc crossover scale N_x " +
      "under the WHOLE Gronwall flow-factor bracket [1, exp(2*2.37e-4)=1.000474] (from the A1 Theta-trap " +
      "worst case |t_c| <= g_min^2/6 = 2.37e-4 and C_G in [1,2]), without committing to a specific t_c(N) " +
      "closed form -- leaving the N_half/N_x band [0.99313, 0.99772] a bracket. imp-3620 derives the flow " +
      "factor at the crossover scale from the NAMED imp-398 backward-flow-stability law t_c(N) ~ 1/log gamma_N, " +
      "giving the closed form t_c(N) = 2.37e-4 * log(gamma_{N*})/log(gamma_N) (N* = 1e4 anchor). At the " +
      "baseline crossover N_x = 3.280294e9 the height log gamma_{N_x} = 20.8576 is 2.27x the anchor log " +
      "gamma_{N*} = 9.1981, shrinking the collision time to t_c(N_x) = 1.0452e-4 (0.441x the anchor worst " +
      "case) and pinning the flow factor to exp(1*t_c(N_x)) = 1.0001045 (C_G=1) .. exp(2*t_c(N_x)) = " +
      "1.0002091 (C_G=2) -- only 22.05%..44.09% of the imp-3604 bracket, and strictly BELOW the imp-3580 " +
      "frozen value 1.000237, so the frozen node over-states the crossover-scale amplification by ~2.27x " +
      "by never applying the 1/log gamma_N shrink. Re-root-solving both crossings with this N-varying " +
      "closed form collapses the imp-3604 per-floor sub-bracket to a single pinned value: the N_half/N_x " +
      "band stays [0.99313, 0.99772] ~ 0.996 (f=1 reproducing imp-3580/imp-3604 at 0.996019 to the last " +
      "digit) but now with only ~2e-7..8e-7 residual C_G spread, versus the imp-3604 ~3e-6 flat-bracket " +
      "spread -- confirming imp-3604 was pessimistic at its endpoints." +
      "\n\nHONEST SCOPE: derivation/measurement only -- pins a Gronwall flow-factor sub-bracket using a " +
      "named closed-form collision-time law; establishes NO operator positivity. Mass-feasibility remains " +
      "NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a >= 0 off-diagonal endpoint-Hankel positivity " +
      "(imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3620 (derives the crossover-scale Gronwall flow factor from the imp-398 t_c(N)~1/log gamma_N closed form, pinning the imp-3604 flat flow-factor bracket to a single per-floor N_half/N_x value with ~4e-7 residual C_G spread), 2026",
    relatedTerms: [
      "imp-3604 sigma-crossover flow-factor bracket invariance [1,1.000474] (imp-3604)",
      "imp-3580 frozen-Gronwall floor invariance, ratio 0.996019 (imp-3580)",
      "imp-2644 A1 Theta-trap discharge, |t_c| <= g_min^2/6 = 2.37e-4, C_G in [1,2] (imp-2644)",
      "imp-398 backward-flow-stability law, t_c(N) ~ 1/log gamma_N",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "OUTER composite-Simpson truncation of the higher moments M_5..M_10 certified below the imp-3600 fit tolerance (imp-3621)",
    category: "numerical",
    definition:
      "imp-3600 fed the higher moments M_5..M_10 (from the NM=1600 composite-Simpson OUTER grid on [0,T_A]) into " +
      "the closed C_5=M_7/(42 M_5), C_6=M_8/(56 M_6) and next-order D_5, D_6 exponent-ladder brackets, reporting " +
      "the p=2 fit-bias law reproduces the actual least-squares slope to ~1e-9 -- but those higher moments never " +
      "received an OUTER-truncation cross-check (imp-3603 covered only M_0..M_4). imp-3621 holds the INNER A(tau) " +
      "rule identical (composite Simpson, INNER_N=1200 on [0,7]) on both paths and compares the imp-3600 outer-" +
      "Simpson moments against an independent imp-3603-class Gauss-Legendre OUTER reference (GL-24, 200 panels), " +
      "itself self-converged to ~1e-15 under panel doubling. MEASURED: the per-moment outer-Simpson relative gap " +
      "is ~1.31e-10 at M_5 and drops to the ~1e-15 rounding floor for M_6..M_10 (M_6 ~3.9e-13, M_7 ~1.8e-13, " +
      "M_8..M_10 ~1e-15) -- the worst case, ~1.31e-10, sits more than an ORDER OF MAGNITUDE below the imp-3600 " +
      "~1e-9 fit tolerance. The C_5, C_6, D_5, D_6 brackets reconstructed from the Simpson-outer moments match " +
      "those from the GL-outer moments to << 1e-9, so the imp-3600 |p_fit-2| read-outs (~6.99e-6, ~1.14e-5) carry " +
      "no residual outer-quadrature bias -- extending the imp-3603 M_0..M_4 Simpson-free confirmation to the " +
      "M_5..M_10 rungs imp-3600 actually feeds the p=2 ladder." +
      "\n\nHONEST SCOPE: cross-validation/measurement only -- bounds an outer quadrature-truncation error against " +
      "an independent reference; establishes NO operator positivity. Mass-feasibility remains NECESSARY-BUT-NOT-" +
      "SUFFICIENT; the operator-level K_a >= 0 off-diagonal endpoint-Hankel positivity (imp-3066) is UNTOUCHED. " +
      "No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3621 (bounds the imp-3600 M_5..M_10 outer composite-Simpson truncation against an independent Gauss-Legendre outer reference, certifying the max per-moment gap ~1.31e-10 sits over an order of magnitude below the ~1e-9 fit tolerance), 2026",
    relatedTerms: [
      "imp-3600 remainder-tail exponent ladder n=5,6 (imp-3600)",
      "imp-3603 inner-truncation Gauss-Legendre cross-validation, M_0..M_4 (imp-3603)",
      "imp-3581 closed C_n/D_n derivation and fit-bias law, n=3,4 (imp-3581)",
      "imp-3618 moment-remainder tail exponent ladder extended to n=7,8 (imp-3618)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3623/imp-3625 dense-solver resolution of the N=2000 skew-Toeplitz third-pair Krylov artifact (imp-3654)",
    category: "numerical",
    definition:
      "imp-3602 measured the third skew-Toeplitz pair lambda_5=lambda_6 (from the same lambda_5/lambda_1 second-gap " +
      "sigma_2 line as the first-gap rho) and found the pair spread DEGRADED from ~2e-14 at N=1600 to 1.010245749617736e-11 " +
      "at N=2000 under a fixed-depth m=440 Lanczos solve -- an apparent loss of the third-pair degeneracy right at the " +
      "deepest rung. imp-3623 re-extracted the top-6 Gram eigenvalues at N=1200/1600/2000 with an INDEPENDENT full-" +
      "spectrum solver (Householder tridiagonalization + implicit-QL, no Krylov subspace, no reorthogonalization): the " +
      "dense lambda_5=lambda_6 spread stays at machine precision (~1.18e-15) at every rung including N=2000, while the " +
      "dense route reproduces the imp-3602 Lanczos sigma_2=lambda_5/lambda_1=0.999586510492813 to a worst relative " +
      "difference ~2e-14 -- so the N=2000 pair loss is solver-specific, not a property of the underlying spectrum. " +
      "imp-3625 pinned down the mechanism directly on the Lanczos route: sweeping Krylov depth m in {440,480,560,640} at " +
      "the fixed N=2000 third pair shows the spread contracts from the m=440 reading of 1.010245749617736e-11 down to " +
      "~6.06e-15 at m=480 and stays at that machine-precision floor through m=640 (a ~540-1667x contraction), while the " +
      "second gap sigma_2 is unchanged across the whole depth sweep to <5e-14. CONCLUSION: the N=2000 lambda_5=lambda_6 " +
      "degeneracy loss is a fixed-depth Lanczos reorthogonalization under-resolution (a Krylov-depth artifact, in the " +
      "exact imp-3575 pattern one gap and one rung deeper), NOT a genuine third-pair splitting; lambda_5 remains a " +
      "genuine adjacent-paired third-pair level at every deep rung, and the depth artifact does not corrupt the -2 " +
      "section-gap exponent ladder or the sigma_2 amplitude, both of which are depth/solver-invariant." +
      "\n\nHONEST SCOPE: cross-validation/measurement only -- confirms a spectral degeneracy and its solver-dependent " +
      "artifact, establishes NO operator positivity. Mass-feasibility remains NECESSARY-BUT-NOT-SUFFICIENT; the " +
      "operator-level K_a >= 0 off-diagonal endpoint-Hankel positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3623/imp-3625 (dense Householder+QL cross-validation and Krylov-depth sweep jointly certify the imp-3602 N=2000 third-pair loss as a Lanczos reorthogonalization artifact, not a genuine splitting), 2026",
    relatedTerms: [
      "imp-3602 second skew-Toeplitz gap sigma_2 and (j^2-1) amplitude law (imp-3602)",
      "imp-3619 third skew-Toeplitz gap sigma_3 and pair j=4 amplitude corroboration (imp-3619)",
      "imp-3575 first-gap Krylov-depth artifact precedent (imp-3575)",
      "imp-3643 dense certification of the fourth-pair lambda_7=lambda_8 Krylov artifact (imp-3643)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3663 matched-pair Krylov depth law: m*(N) sub-linear/concave, correcting imp-3645s flat reading",
    category: "numerical",
    definition:
      "imp-3645 tried to fit the minimal-converged Lanczos Krylov depth m*(N) from two anchors at DIFFERENT pair " +
      "indices (N=1600 lambda_3 pair-2, m*=280; N=2000 lambda_5=lambda_6 pair-3, m*=480), leaving the growth form " +
      "under-determined and reading the same-pair depth as FLAT in N from the lambda_3 anchors (280 at both N=1600 " +
      "and N=2000). imp-3663 closed that gap by measuring m*(N) for a FIXED pair -- the lambda_5=lambda_6 third pair " +
      "-- across N in {1600,2000,2400}, obtaining the homogeneous anchor triple m*(1600)=360, m*(2000)=480, " +
      "m*(2400)=560 (the N=2000 value reproduces the imp-3625 baked pair56 exactly, confirming the identical " +
      "assembly). RESULT: the fixed-pair depth GENUINELY GROWS with N (360->480->560), correcting imp-3645s flat " +
      "reading, which was a grid-floor artifact of the lambda_3 pair locking near the smallest swept depth. The " +
      "growth is SUB-LINEAR/CONCAVE: two equal Delta N=400 steps give decelerating Delta m (120 then 80), so a " +
      "linear law is disfavoured (least-squares RMS ranks log ~4.7 < sqrt ~7.1 < linear ~9.4, linear worst). Log " +
      "vs sqrt is NOT discriminated -- the ~2.4-unit RMS gap sits below the +/-20 uncertainty from the 40-step " +
      "Krylov sub-depth grid (named residual sg-3663-log-vs-sqrt-fixed-pair). The matched-pair law also undercuts " +
      "imp-3645s pair-index-confounded bracket: measured m*(2400)=560 is below the bracket 644..680, and the " +
      "matched fits extrapolate N=3200 to ~706-767, far below imp-3645s linear-slope prediction of 1080." +
      "\n\nHONEST SCOPE: measurement/fit only -- discriminates the depth-law form as far as the grid allows (linear " +
      "ruled out; log vs sqrt left open); does NOT construct the missing magnitude and does NOT attempt the " +
      "imp-3066 K_a >= 0 positivity. RH-EQUIVALENT. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains " +
      "the rigorous SOTA.",
    firstUsed: "imp-3663 (matched-pair Krylov depth sweep at fixed pair index 3 across N=1600/2000/2400, closing sg-3645-matched-pair-depth-sweep), 2026",
    relatedTerms: [
      "imp-3645 skew-Toeplitz Krylov depth-vs-N law, two-anchor bracket (imp-3645)",
      "imp-3625 N=2000 lambda_5=lambda_6 Krylov-depth artifact resolution (imp-3625)",
      "imp-3575 first-gap Krylov-truncation deficit precedent (imp-3575)",
      "imp-3623/imp-3625 dense-solver resolution of the N=2000 skew-Toeplitz third-pair Krylov artifact (imp-3654)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3665 A-weight super-exponential decay confirmation: exp(-pi e^{4 tau}), no hard support endpoint",
    category: "numerical",
    definition:
      "imp-3646 based its C_n ~ (ln n)^2/(16 n^2) moment-ratio law on a claim that the autocorrelation weight " +
      "A(tau) = int_0^inf Phi(s) Phi(s + tau) ds (Phi the NPHI=10-truncated completed-Riemann kernel) decays " +
      "SUPER-exponentially, A(tau) ~ exp(-pi e^{4 tau}), with NO hard support endpoint -- quoting A(0.5) ~ 4.5e-11 " +
      "and A(1) ~ 3e-75 but never independently cross-checking the law or those magnitudes. imp-3665 recomputed " +
      "A(tau) at tau in {0.5,1,1.5,2} on a refined grid. Because A(1.5) ~ e^{-1267} ~ 1e-550 and A(2) ~ e^{-9363} ~ " +
      "1e-4067 UNDERFLOW IEEE-754 double (min ~1e-308, the naive integrand is exactly 0.0 there), A(tau) was " +
      "evaluated entirely in the LOG DOMAIN: ln Phi via a log-sum-exp over the kernel terms, and the Simpson " +
      "integral itself as a log-sum-exp of ln(weight)+lnPhi(s)+lnPhi(s+tau)+ln(h/3), so -ln A(tau) is exact at all " +
      "four tau (171.955, 1267.12, 9362.72, ...) with no term ever exponentiated at full scale. RESULT: the ratio " +
      "-ln A(tau)/(pi e^{4 tau}) -> 1 from above (1.0266, 1.0025, 0.99977, 0.99976) and the central-difference " +
      "slope d(-ln A)/dtau tracks 4 pi e^{4 tau} to <1% (ratio 0.9925 -> 0.9997 -> 0.9993 -> 0.9999): the leading " +
      "law and its slope are CONFIRMED as asymptotic. Extending the outer cutoff [0,7] -> [0,12] refines -ln A by " +
      "only ~1e-3 relative and never truncates, confirming NO compact-support edge -- the no-hard-endpoint premise " +
      "behind imp-3646 holds. ONE honest correction: the converged A(1) is ~2.1e-75, not the quoted 3e-75 -- " +
      "imp-3646's coarser n=1200 Simpson on [0,7] under-resolves the sharp near-s=0 peak of Phi(s)Phi(s+1); both " +
      "values are the SAME order and both satisfy the pi e^{4 tau} law, so this is a ~30% amplitude refinement, " +
      "not a change of regime. A(0.5) ~ 4.47e-11 matches the quoted 4.5e-11 to two figures." +
      "\n\nHONEST SCOPE: measurement/cross-check only -- confirms (and lightly corrects) the decay rate of a fixed " +
      "autocorrelation weight used inside a mass-feasibility diagnostic; establishes NO operator positivity. " +
      "Mass-feasibility remains NECESSARY-BUT-NOT-SUFFICIENT; the operator-level K_a >= 0 off-diagonal " +
      "endpoint-Hankel positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 " +
      "remains the rigorous SOTA.",
    firstUsed: "imp-3665 (log-domain cross-check of the imp-3646 A-weight super-exponential decay claim at tau in {0.5,1,1.5,2}), 2026",
    relatedTerms: [
      "imp-3646 remainder-tail moment-ratio asymptotics and C_n ~ (ln n)^2/(16 n^2) (imp-3646)",
      "imp-3581 remainder-tail exponent derivation, closed C_n/D_n law (imp-3581)",
      "imp-3501 general moment-ladder derivation R_n = sum a^m/m! M_m (imp-3501)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3671 G6a_shock_lipschitz structural-silence verdict: mesoscopic V0 does NOT supply a Hoelder-1/2 modulus",
    category: "proof",
    definition:
      "The roadmap Step-4 Polymath15-bridge sub-gap G6a_shock_lipschitz needs a Hoelder-1/2 modulus C_Lip in " +
      "|tau_c(x) - tau_c(x_prime)| <= C_Lip |x - x_prime|^{1/2} governing the SPATIAL regularity of the " +
      "collision-time field at the Burgers shock front. imp-3671 assessed whether the imp-3642 direct-flow " +
      "measurement of the mesoscopic density floor V0(gamma) -- exactly linear in log(gamma / 2 pi) and " +
      "respecting the Gronwall floor exp(-2 s / y_star^2) ~ 0.991 at y_star = 4 d -- could supply that modulus, " +
      "and found it STRUCTURALLY SILENT for two INDEPENDENT reasons. (S1) TYPE/DIMENSION MISMATCH: V0 is a " +
      "strip-SUP density scalar quantifying WHEN the shock forms (t_c ~ 1/(2 V0)); C_Lip is a spatial modulus " +
      "quantifying HOW the front bends in x. The strip sup erases the microscopic x-gradient structure, so a " +
      "single density-floor scalar carries no (x - x_prime) difference information and is the wrong TYPE of " +
      "object for a Hoelder-1/2 modulus, independent of scale. (S2) SCALE MISMATCH: the mesoscopic reading " +
      "lives at y_star = 4 d where the Gronwall floor is ~0.99, but the shock-front Lipschitz constant is a " +
      "nearest-pair quantity at strip height y -> 0. Writing y = y_star / k, the same floor is " +
      "floor_meso^{k^2}, collapsing from 0.991 (mesoscopic) to 0.865 at the mean spacing d, half-lost already " +
      "at ~0.46 d, and vacuous (~1.5e-10) by k=50 -- exactly imp-2520 negative-finding 1 that the nearest-pair " +
      "regime is a different, Gronwall-vacuous scale. What V0 DOES supply is the collision-TIME scale " +
      "t_c ~ 1/(2 V0), which per imp-2564 feeds the E(N) bridge CONSTANTS (imp-3661 already propagated it), " +
      "not the shock-front modulus. G6a_shock_lipschitz therefore stays OPEN." +
      "\n\nHONEST SCOPE: assessment/derivation only -- no positivity, no bridge closure, no RH claim, no QED. " +
      "imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian Lambda <= 0.2 " +
      "remains the rigorous SOTA.",
    firstUsed: "imp-3671 (assessing whether the imp-3642 mesoscopic V0 profile supplies a G6a_shock_lipschitz modulus), 2026",
    relatedTerms: [
      "imp-3642 sigma-crossover t_c direct-Dyson cross-check, V0 linear in log(gamma/2pi) (imp-3642)",
      "imp-3661 density-corrected t_c pin propagating the scale into E(N) bridge constants (imp-3661)",
      "imp-2520 shock time t_c ~ 1/(2 V0), negative-finding 1: nearest-pair is Gronwall-vacuous (imp-2520)",
      "imp-2564 per-N collision scale feeds E(N) bridge constants, not the headline inequality (imp-2564)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3643 dense-solver certifies skew-Toeplitz FOURTH pair lambda_7=lambda_8; N=2000 imp-3619 loss is a Krylov artifact",
    category: "numerical",
    definition:
      "imp-3619 read the third skew-Toeplitz gap sigma_3=lambda_7/lambda_1 off a full-reorthogonalization " +
      "Lanczos at Krylov depth m=min(N,440), reporting the lambda_7=lambda_8 pair degenerate to relative < 4e-14 " +
      "through N=1600 but DEGRADING to ~3.99e-11 at the deepest rung N=2000 -- leaving open whether that N=2000 " +
      "loss was a genuine near-degeneracy splitting or a Lanczos artifact, since imp-3623 had dense-certified only " +
      "the SECOND gap (top-6 spectrum). imp-3643 extends the SAME independent dense full-spectrum route imp-3623 " +
      "used (Householder tridiagonalization + implicit-QL, no Krylov subspace, no reorthogonalization) to the " +
      "top-8 Gram eigenvalues at the deep rungs N in {1200,1600,2000}. RESULT: (1) the dense sigma_3 reproduces " +
      "the imp-3619 Lanczos value to relative < 3.5e-14 at every deep rung (1.00e-15 at N=2000), so the imp-3619 " +
      "deepest sigma_3=0.9992248404950668 is a faithful reading, not a Lanczos-specific number; (2) CRUCIALLY, the " +
      "dense lambda_7=lambda_8 spread at N=2000 is 1.96e-16 -- machine precision -- while the imp-3619 Lanczos " +
      "spread there was 3.99e-11 (~2e5 larger), so the N=2000 degeneracy loss is a Lanczos m=440 reorthogonalization " +
      "artifact, NOT a genuine splitting: lambda_7 is a genuine FOURTH-pair level at N=2000. The dense spectrum is " +
      "four-pair adjacent-paired to < 2.2e-15 at every deep rung, and the dense top-6 reproduces the imp-3623 baked " +
      "deep top-6 to all printed digits (same-solver self-check)." +
      "\n\nHONEST SCOPE: dense cross-validation/measurement only -- certifies the imp-3619 deep sigma_3 and the " +
      "fourth-pair pairing against an independent solver; does NOT construct the missing magnitude and does NOT " +
      "attempt the imp-3066 K_a >= 0 positivity. RH-EQUIVALENT. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 " +
      "remains the rigorous SOTA.",
    firstUsed: "imp-3643 (dense Householder+QL cross-validation extends the imp-3623 second-gap certification two levels to certify the fourth pair lambda_7=lambda_8, resolving the imp-3619 N=2000 loss as a Krylov artifact), 2026",
    relatedTerms: [
      "imp-3619 third skew-Toeplitz gap sigma_3 and pair j=4 amplitude corroboration (imp-3619)",
      "imp-3623/imp-3625 dense-solver resolution of the N=2000 skew-Toeplitz third-pair Krylov artifact (imp-3654)",
      "imp-3668 dense certification of the fifth-pair lambda_9=lambda_10 (imp-3668)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3668 skew-Toeplitz FIFTH-pair adjacent-pairing dense certification: lambda_9=lambda_10, sigma_4 -> 1",
    category: "numerical",
    definition:
      "imp-3643 dense-certified the FOURTH skew-Toeplitz pair lambda_7=lambda_8 at the deep rungs N in " +
      "{1200,1600,2000}, extending the imp-3623 dense full-spectrum route (Householder tridiagonalization + " +
      "implicit-QL, no Krylov subspace, no reorthogonalization) to the top-8 Gram eigenvalues. imp-3668 pushes " +
      "the SAME independent dense solver one level further, to the top-10, to certify the FIFTH pair " +
      "lambda_9=lambda_10. RESULT: the dense fifth-pair spread is 0 to all printed digits at N=1200 and N=1600 " +
      "and 1.38e-15 at N=2000 -- i.e. < 1.4e-15 everywhere, the same machine-precision adjacent-pairing the " +
      "lower four pairs show, so the deep section spectrum is FIVE-pair adjacent-paired: lambda_1=lambda_2, " +
      "lambda_3=lambda_4, lambda_5=lambda_6, lambda_7=lambda_8, lambda_9=lambda_10. The fifth-pair amplitude " +
      "sigma_4=lambda_9/lambda_1 climbs monotonically toward 1 with depth: 0.9965699418447529 (N=1200), " +
      "0.9980654415282425 (N=1600), 0.9987600189865782 (N=2000) -- the same approach-to-1 the lower gaps show. " +
      "As a same-assembly self-check, the dense top-8 measured here reproduces the imp-3643 baked deep-rung " +
      "top-8 to all printed digits at every rung, confirming this is a faithful one-level extension of the " +
      "same solve rather than a re-tuned calculation." +
      "\n\nHONEST SCOPE: pairing-STRUCTURE cross-check/measurement only -- certifies the fifth-pair adjacent-" +
      "pairing degeneracy against an independent dense full-spectrum solver; does NOT establish the fifth-pair " +
      "amplitude LAW (a distinct pending Lanczos ticket), does NOT construct the missing magnitude, and does " +
      "NOT attempt the imp-3066 K_a >= 0 positivity. RH-EQUIVALENT. No RH verdict, no QED. Platt-Trudgian " +
      "Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3668 (dense Householder+QL cross-validation extends the imp-3643 fourth-pair certification one level to certify the fifth pair lambda_9=lambda_10 at the deep rungs), 2026",
    relatedTerms: [
      "imp-3643 dense certification of the fourth-pair lambda_7=lambda_8 Krylov artifact (imp-3643)",
      "imp-3623/imp-3625 dense-solver resolution of the N=2000 skew-Toeplitz third-pair Krylov artifact (imp-3654)",
      "imp-3619 third skew-Toeplitz gap sigma_3 and pair j=4 amplitude corroboration (imp-3619)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3670 observable fit-bias decay: |p_fit-2| = |D_n| covVar CONFIRMED, naive (ln n)^2/n^3 rate still drifting",
    category: "numerical",
    definition:
      "imp-3646 DERIVED the closed slowly-varying coefficient laws C_n = Q_n/((n+1)(n+2)) ~ (ln n)^2/(16 n^2) and " +
      "D_n = C_(n+2) - C_n ~ O((ln n)^2/n^3), from the Laplace saddle of the moment integrand (tau*(n) solving " +
      "n = 4 pi tau* e^{4 tau*}), but never MEASURED whether these propagate to the OBSERVABLE least-squares " +
      "fit-bias |p_fit - 2|. imp-3670 measures it across the rung ladder n=3..18 on the imp-3624/imp-3648 base " +
      "a-window (aHi=0.5, ratio=0.5, K=9). THREE readings: (1) the observable law is CONFIRMED -- |p_fit-2| equals " +
      "|D_n| cov(a^2,ln a)/var(ln a) to <= ~2e-9 at every rung, and decays monotonically 1.1575e-5 (n=3) -> " +
      "1.0786e-6 (n=18); (2) the NAIVE (ln n)^2/n^3 rate does NOT yet give a constant ratio -- |p_fit-2|/((ln n)^2/n^3) " +
      "is strictly increasing 2.59e-4 -> 7.53e-4 (~2.9x, still climbing at n=18), so the fully-simplified asymptotic " +
      "form is not reached at these finite rungs; (3) the drift is traced to the crude tau*(n) ~ (ln n)/4 substitution, " +
      "NOT an unmodeled term -- swapping in the ACTUAL Laplace saddle tau*(n)^2 is faithful, with |D_n|/|D_n^saddle| " +
      "falling monotonically to 1 from above (3.644 -> 1.095), mirroring imp-3646's own Q_n/tau*^2 -> 1 measurement. " +
      "Pure 1/n^3 (no log factor) drifts ~20x more, confirming the log-growing prefactor is real rather than an " +
      "artifact. Named residual sg-3670-lnn-saddle-not-asymptotic-at-n18: the (ln n)/4 substitution is pre-asymptotic " +
      "through n=18; a larger-n ladder or the exact saddle is needed to see the (ln n)^2/n^3 ratio plateau." +
      "\n\nHONEST SCOPE: measurement only, at the RH-equivalent scale class. This measures the observable decay of a " +
      "fixed-weight Taylor-remainder decay-order read-out against a derived slowly-varying rate; it establishes NO " +
      "operator positivity. Mass-feasibility is necessary-but-not-sufficient. The operator-level K_a >= 0 " +
      "sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is untouched. No RH verdict, no QED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3670 (measures the observable |p_fit-2| fit-bias decay against the imp-3646-derived (ln n)^2/n^3 rate across rungs n=3..18, confirming the law but finding the naive rate still pre-asymptotic), 2026",
    relatedTerms: [
      "imp-3646 remainder-tail moment-ratio asymptotics and the C_n/D_n log-divergent prefactor laws (imp-3646)",
      "imp-3648/imp-3667 base a-window fit-bias sensitivity cross-checks at n=7,9 (imp-3648)",
      "imp-3581 closed-form remainder-tail exponent derivation (imp-3581)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "completion degree (section-26 nu > mu overflow)",
    category: "numerical",
    definition:
      "The homogeneity degree of the measure the section-26 shear density nu(tau) and passive " +
      "diagonal density mu(tau) carry when their overflow region {tau : nu(tau) > mu(tau)} is " +
      "measured. DEGREE-2 (absolute occupation measure): nu and mu keep their raw Phi^2-weighted " +
      "magnitude, which is super-exponentially concentrated at small lag inside the crossover " +
      "tau_star = arcsinh(1)/a, so only ~0.209 of tau registers overflow (the imp-3175 " +
      "resolution-converged fraction). DEGREE-0 (scale-invariant normalized-spectral measure, the " +
      "RH-equivalent class): the normalized-R comparison Gpass^{-1/2} Gshear Gpass^{-1/2} quotients " +
      "the Phi^2 scale out, so the comparison reduces to bare shear sinh(a tau) vs bare diagonal 1, " +
      "raising the overflow fraction to ~0.64 (the verdict spectral figure; the geometric bare-crossover " +
      "proxy (U - tau_star)/U ~0.706 upper-bounds it). imp-3253 shows 0.209 and 0.64 are NOT distinct " +
      "objects -- they are the SAME nu > mu overflow event measured at two different completion " +
      "degrees, and the fraction rises monotonically as the degree is stripped from 2 toward 0. " +
      "A reader must not read 0.209 as a degree-0 number or 0.64 as a degree-2 number.",
    firstUsed: "imp-3253 (degree-2 vs degree-0 reconciliation of the two section-26 overflow headlines), 2026",
    relatedTerms: [
      "imp-3253 overflow-degree reconciliation (imp-3253)",
      "imp-3175 overflow-fraction resolution reconcile (imp-3175)",
      "imp-2686 mupass construction (imp-2686)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Lemma R1-FN (finite-N static excursion cap)",
    category: "theorem",
    definition:
      "Closes the STATIC half of the Theta-trap excursion question: for the global minimal " +
      "pair in ANY finite N-particle configuration, Theta = g^2 E / 2 <= 1 - 2/N, with the " +
      "uniform minimal-spacing lattice the PROVEN UNIQUE maximiser (equality iff N is even and " +
      "both sides are balanced). Proof: scaling the minimal gap to g=1 forces every gap >= 1, so " +
      "the r-th environment particle per side has cumulative distance s_r >= r and its term " +
      "T_r = 1/(s_r(s_r+1)) <= 1/(r(r+1)); the telescoping majorant sums to K_side/(K_side+1) per " +
      "side, and strict concavity of x/(x+1) forces the balanced split K_R = K_L = (N-2)/2, giving " +
      "the exact per-N maximum [K_R/(K_R+1)+K_L/(K_L+1)]/2 = 1 - 2/N for even N (odd N sits " +
      "strictly below, since a balanced split is unavailable). This upgrades the R1-T2 lattice " +
      "ladder Theta_K = K/(K+1) from a mere example reaching 1 to the PROVEN extremiser, and " +
      "explains cleanly why no absolute N-uniform cap Theta_exc < 1 can exist: sup_N(1 - 2/N) = 1, " +
      "so the excursion approaches 1 only in the N -> infinity limit on a long near-uniform " +
      "minimal lattice. CONSEQUENCE: with the static route fully accounted for, the only residual " +
      "is DYNAMICAL -- whether the attractive CM flow from generic (real-zero-like) data can ever " +
      "drive finite N-particle data onto such a long uniform minimal lattice (the R1-T4 / R2-T " +
      "reachability question). Unconditional; Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "SG1C_R1_FINITE_N_CAP (closes the static half of the R1 excursion-cap question in sharp closed form; per-N table added by imp-3363), 2026",
    relatedTerms: [
      "R1-T2 uniform K-shell lattice ladder Theta_K = K/(K+1) (imp-2608)",
      "R1-T4 / R2-T dynamical reachability residual (imp-2637)",
      "Theorem A unconditional Theta <= 1/4 trap (imp-2595)",
      "Corollary A1 isolated-minimal-pair self-enforcement (imp-2637)",
    ],
    link: "/spectral-attack",
  },
  {
    term: "imp-3714 G6a_shock_lipschitz modulus candidates K1-K4: consolidated status table",
    category: "proof",
    definition:
      "imp-3671 ruled the mesoscopic density floor V0 STRUCTURALLY SILENT on the open Step-4 " +
      "Polymath15-bridge sub-gap G6a_shock_lipschitz via two independent obstructions -- (S1) wrong " +
      "TYPE (no x-difference structure) and (S2) wrong SCALE (Gronwall-vacuous at the nearest-pair " +
      "limit). imp-3714 derived the JOINT requirement-set any admissible Hoelder-1/2 modulus object " +
      "must clear -- REQ-i two-point x-difference dependence (S1, imp-3693: the per-gap field " +
      "g_k = gamma_{k+1} - gamma_k is the minimal right-type object) AND REQ-ii a nearest-pair-scale " +
      "non-vacuous Gronwall floor (S2, imp-3708: needs a per-pair y2-adapted flow depth " +
      "s(y) ~ y^2) -- and enumerated four candidate constructions:" +
      "\n\n(K1) per-pair collision-time two-point correlation field off g_k, with per-pair depth " +
      "~ gap^2. Satisfies BOTH requirements by construction; needs the imp-3726 self-similar depth " +
      "reparameterization s_k = c g_k^2 (DERIVED, with residual gaps N1 heterogeneous-depth " +
      "contraction, N2 per-site adaptive integrator, N3 two-point extension still new)." +
      "\n(K2) scale-covariant collision-time field running the imp-3642 RK4 flow with per-site depth " +
      "s_k ~ g_k^2. Also satisfies BOTH; needs the SAME imp-3726 reparameterization as K1." +
      "\n(K3) equal-time two-point gap structure function S_2(r) = mean of (g_{k+r} - g_k)^2. " +
      "imp-3734 MEASURED it: clears REQ-i (a genuine two-point profile with a clean level-repulsion " +
      "anti-correlation at r=1 and a decorrelation plateau at 2*var) but FAILS REQ-ii -- it is purely " +
      "equal-time and attaches no flow depth, confirming the imp-3714 near-miss classification " +
      "empirically." +
      "\n(K4) direct Burgers / CM entropy-solution Hoelder-1/2 regularity bound on tau_c(x), bypassing " +
      "the mesoscopic Gronwall floor entirely. imp-3727 scoped it against the literature: it is the " +
      "ONE route dodging both S1 and S2 by construction, but the repo's only one-sided estimate " +
      "(the Lemma B Gronwall floor) is exactly the mechanism K4 must avoid recycling, so the gap " +
      "between repo ingredients and an admissible C_Lip certificate is essentially the WHOLE " +
      "Burgers/CM entropy-solution regularity theory; confirmed WHOLLY NEW." +
      "\n\nSo three candidates (K1, K2, K4) remain consistent with both requirements and one (K3) is " +
      "ruled out; none is fully present in the repo, and G6a_shock_lipschitz stays OPEN." +
      "\n\nHONEST SCOPE: consolidated status/reference only -- no positivity, no bridge closure, no RH " +
      "claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3714 (deriving the joint REQ-i/REQ-ii requirement-set and enumerating K1-K4), 2026",
    relatedTerms: [
      "imp-3671 G6a_shock_lipschitz structural-silence verdict (imp-3671)",
      "imp-3726 self-similar y2-adapted flow-depth schedule s_k = c g_k^2 (imp-3726)",
      "imp-3734 equal-time gap structure function S_2(r) measurement (imp-3734)",
      "imp-3727 K4 entropy-solution regularity scoping (imp-3727)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3726 self-similar backward-flow depth schedule s_k = c g_k^2: the scale-invariant Lemma B floor exp(-2c)",
    category: "proof",
    definition:
      "imp-3708 showed a SINGLE global backward-Dyson flow depth s is Gronwall-vacuous at the " +
      "nearest-pair scale: writing the Lemma B floor exp(-2 s / y^2) at shrinking strip height y = g_k " +
      "(the local gap, imp-3693) makes the exponent 2 s / g_k^2 -> infinity as g_k -> 0, collapsing the " +
      "floor to 0 (the imp-3671 floor_meso^{k^2} ladder). imp-3726 escapes this by making the depth " +
      "PER-PAIR instead of global: schedule s_k = c g_k^2, with c a fixed constant chosen once. " +
      "Substituting into the same floor formula gives exp(-2 s_k / g_k^2) = exp(-2 (c g_k^2) / g_k^2) = " +
      "exp(-2c) -- the g_k^2 cancels EXACTLY, so the floor is the SAME constant exp(-2c) at every pair " +
      "k, regardless of how small the local gap g_k becomes. Running each pair's flow only as deep as " +
      "the square of its own gap, rather than to one depth shared by all pairs, is what keeps " +
      "2 s_k / g_k^2 pinned at a constant instead of blowing up: the reparameterization is scale-" +
      "invariant by construction, not by a numerical coincidence. Both surviving G6a_shock_lipschitz " +
      "candidate constructions (K1, K2, imp-3714) require exactly this schedule. Residual gaps the " +
      "schedule does NOT close by itself: whether a heterogeneous-depth backward-Dyson RK4 integrated " +
      "with per-site s_k actually realizes exp(-2c) numerically (N1), what integrator adapts cleanly to " +
      "per-site depth (N2), and the two-point pair-separation extension REQ-i still needs on top (N3)." +
      "\n\nHONEST SCOPE: derivation/scoping of the depth schedule only; no construction shipped, no " +
      "numerical verification of the heterogeneous-depth flow, no positivity, no bridge closure. " +
      "imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains " +
      "the rigorous SOTA. NO QED.",
    firstUsed: "imp-3726 (deriving the self-similar depth schedule s_k = c g_k^2 that makes the Lemma B Gronwall floor scale-invariant, the escape from the imp-3708 floor_meso^{k^2} collapse of a single global depth), 2026",
    relatedTerms: [
      "imp-3714 G6a_shock_lipschitz modulus candidates K1-K4: consolidated status table (imp-3714)",
      "imp-3671 mesoscopic-vs-shock strip-height ladder: Gronwall floor collapse exp(-k^2 E_meso) (imp-3671)",
      "imp-3708 y2-adapted flow depth s(y) ~ y^2 as the REQ-ii escape (imp-3708)",
      "backward-flow-stability-gronwall Lemma B/C, density floor V0, shock time t_c ~ 1/(2 V0) (imp-2520)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3714 REQ-i/REQ-ii coupling: why the joint G6a modulus requirement-set is not two independent knobs",
    category: "proof",
    definition:
      "Distinct from the K1-K4 consolidated status table, this entry isolates imp-3714's COUPLING " +
      "argument for why an admissible G6a_shock_lipschitz Hoelder-1/2 modulus object cannot satisfy its " +
      "two requirements separately. REQ-i (two-point x-difference dependence, from the imp-3693 S1 " +
      "obstruction) demands an x-RESOLVED object; the per-gap field g_k = gamma_{k+1} - gamma_k is the " +
      "MINIMAL repo object clearing it. REQ-ii (nearest-pair-scale non-vacuous Gronwall floor, from the " +
      "imp-3708 S2 obstruction) demands the Lemma B floor exp(-2 s / y^2) stay bounded away from 0 " +
      "exactly where tau_c is defined, at g_k -> 0, y -> 0. The COUPLING: the only right-type object " +
      "clearing REQ-i, g_k, defines its collision time tau_c(k) at exactly that vacuous scale -- so " +
      "clearing REQ-i FORCES evaluation at the very scale where imp-3708 showed a fixed flow depth " +
      "collapses as floor_meso^{k^2}. REQ-ii is therefore NOT a free second knob to satisfy on a " +
      "different object; it must be secured on the SAME object, at the SAME scale, via a per-pair " +
      "y2-adapted depth s(y) ~ y^2 pinning 2 s(y) / y^2 = E_meso uniformly. This is why the four K1-K4 " +
      "candidates were scored jointly rather than independently: K1/K2/K4 build the adapted depth (or a " +
      "depth-free entropy route) directly into the x-resolved object, while K3 fails precisely because " +
      "its two-point structure carries no flow-depth argument to secure at the coupled scale. " +
      "REPO-INGREDIENT STATUS at a glance: g_k (imp-322/imp-325) and the CM/Dyson RK4 flow (imp-3642) " +
      "are IN REPO; the per-pair y2-adapted depth reparameterization (imp-3708's named sub-gap, derived " +
      "in flow form by imp-3726) and any two-point pair-separation extension are NEW for K1/K2; K4 needs " +
      "an entirely new entropy-solution regularity estimate. No candidate is fully in-repo. Concept-only; " +
      "no construction shipped, no positivity, no bridge closure, no RH claim, NO QED. imp-3066 " +
      "off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains " +
      "the rigorous SOTA.",
    firstUsed: "imp-3714 (REQUIREMENTS_COUPLED derivation and couplingReason), 2026",
    relatedTerms: [
      "imp-3714 G6a_shock_lipschitz modulus candidates K1-K4: consolidated status table (imp-3714)",
      "imp-3693 per-gap field g_k as the minimal right-type REQ-i object (imp-3693)",
      "imp-3708 y2-adapted flow depth s(y) ~ y^2 as the REQ-ii escape (imp-3708)",
      "imp-3726 self-similar depth reparameterization s_k = c g_k^2 (imp-3726)",
    ],
    link: "/closure-routes",
  },
  {
    term: "Rescue Gate / Rescue Budget K_max(N) (imp-486)",
    category: "numerical",
    definition:
      "The threshold K * log(N) / sqrt(N) < rho_min = 0.12751 that gates whether a " +
      "weaker unconditional bound C_mb <= K (K possibly > 1) still delivers the " +
      "finite-height beat L_pt(N) < 0.2 (Platt-Trudgian). Equivalently the rescue " +
      "budget K_max(N) = 0.12751 * sqrt(N) / log(N) is the largest K the gate admits " +
      "at height N; it is increasing in N and diverges, so every finite K is admitted " +
      "above some finite entry height N_min(K). C_mb enters L_pt = |t_c| + E_flow + " +
      "E_coll + E_trunc ONLY through this gate, not as an additive term (E_coll is " +
      "pinned by C_C = (1/8)*sqrt(3*pi), imp-399, independent of C_mb), so a weaker K " +
      "costs ENTRY HEIGHT, not headline value -- L_pt(N) is K-free below the gate, and " +
      "the guaranteed unconditional Lambda at a given K is simply E(N_min(K)).",
    firstUsed:
      "imp-486 (deriving rho_min = 0.12751 from the GUE-universality irreducibility " +
      "argument and the C_MB_RESCUE_TABLE), extended by imp-3275 (K-to-height map)",
    relatedTerms: [
      "C_mb Montgomery pair-correlation constant",
      "L_pt finite-height beat assembly (imp-452)",
      "imp-963 unconditional finite-K bound",
      "imp-3275 rescue budget K-to-height degradation map",
    ],
    link: "/viz-imp3377-rescue-budget-height-map",
  },
  {
    term: "Exact flow-gap identity gap = 1 - (L_half/L_x)/(1+eta)^2 (imp-3599)",
    category: "numerical",
    definition:
      "imp-3580 root-solved both the sigma=1/2 half-decay scale N_half and the E_coll=E_trunc " +
      "crossover scale N_x across the imp-3443 half-to-double E_trunc floor grid and found the " +
      "flow-gap gap = 1 - N_half/N_x tracks a leading law gap ~ 2 E_flow(N_x)/E_trunc within a " +
      "sqrt/log linearization, but with an unexplained residual of ~0.01-0.03 percentage points. " +
      "imp-3599 divides the two imp-3580 root conditions -- E_coll(N_x) = E_trunc and " +
      "E_coll(N_half) = E_trunc + E_flow(N_half) -- against the closed form E_coll = C_C sqrt(L/N) " +
      "(L = log T0) to get the EXACT identity gap = 1 - (L_half/L_x)/(1+eta)^2, eta = " +
      "E_flow(N_half)/E_trunc, with no linearization. This reproduces the imp-3580 root-solved gaps " +
      "to ~1e-14 at every floor -- the closed object the leading law approximated by setting " +
      "L_half/L_x = 1 and expanding (1+eta)^-2 ~ 1-2eta. Expanding to O(eps^2) (eps = " +
      "E_flow(N_x)/E_trunc) with the local log-log slopes lambda = d lnL/d lnN (the sqrt(N) " +
      "log-drift of L, lambda ~ 1/L ~ 0.043..0.048) and mu = d lnE_flow/d lnN at N_x gives the " +
      "next-order model gap = 2 eps(1+lambda) - (4 mu+4 lambda+3) eps^2, whose dominant correction " +
      "2 lambda eps is exactly the sign and size of the residual. Re-root-solving both crossings " +
      "per floor (400-iter bisection, residual <1e-9) shows the next-order model shrinks the " +
      "leading-law residual ~20x across f in {0.5,0.75,1.0,1.5,2.0} (0.00983->0.00045, 0.01413->" +
      "0.00068, 0.01826->0.00092, 0.02618->0.00141, 0.03376->0.00192 pp), closing ~94-95% of it " +
      "uniformly." +
      "\n\nHONEST SUB-GAP imp-3599-nextorder-residual-tail: a ~5% tail survives from the neglected " +
      "O(eps^3) term, the slope-expansion curvature, and the finite-difference evaluation of " +
      "lambda, mu -- the exact identity (A) is complete, only the perturbative closed expansion (B) " +
      "is truncated at O(eps^2) (imp-3617 later pushes this to O(eps^3), shrinking the tail a " +
      "further ~5-6 orders). Derivation/measurement only; no positivity, no bridge closure, no RH " +
      "claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3599 (dividing the imp-3580 root conditions into the exact flow-gap identity and its O(eps^2) next-order correction closing ~95% of the residual), 2026",
    relatedTerms: [
      "imp-3580 sigma-crossover floor invariance / leading gap law (imp-3580)",
      "imp-3617 self-consistent O(eps^3) flow-gap expansion (imp-3617)",
      "imp-3556 baseline half-decay <=> crossover certification (imp-3556)",
      "imp-3443 half-to-double E_trunc floor grid (imp-3443)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
  },
  {
    term: "sigma-crossover flow-factor invariance: x(N_x)=1 is 0% a frozen-Gronwall artifact, N_half/N_x band Gronwall-insensitive <1e-5 (imp-3604)",
    category: "numerical",
    definition:
      "imp-3580 froze the Gronwall amplification at the interior value exp(2.37e-4) (the imp-2644 A1 " +
      "worst-case trap, C_G=1) while root-solving the sigma=1/2 <=> E_coll=E_trunc crossover coincidence " +
      "across the imp-3443 floor grid. imp-3604 asks how much of that reported floor-invariance is an " +
      "artifact of freezing the multiplier, by re-root-solving BOTH N_half (sigma=1/2) and N_x " +
      "(E_coll=E_trunc) at the RIGOROUS flow-factor bracket endpoints Gronwall in [1, exp(4.74e-4)] -- " +
      "the full admissible range once C_G is allowed to range over [1,2] (imp-2644) and the large-N flow " +
      "law drives the exponent toward its N->infinity vanishing limit of 0. (1) The crossover itself is " +
      "FLOW-FACTOR-FREE BY CONSTRUCTION: N_x is defined by E_coll(N)=E_trunc, an equation E_flow never " +
      "enters, so x(N_x)=1.000000 and N_x come out byte-identical under Gronwall=1, exp(2.37e-4), and " +
      "exp(4.74e-4) at every floor -- the imp-3580 exact floor-invariance is 0% a frozen-constant " +
      "artifact; it is a structural property of the crossover definition. (2) N_half DOES see E_flow " +
      "and so moves with the flow factor, but because E_flow(N_x) is only 0.1%-0.3% of E_trunc at the " +
      "crossover scale while the whole bracket spans just [1, 1.000474], the N_half/N_x ratio band stays " +
      "[0.99313, 0.99772] ~ 0.996 to every published digit under all three flow factors, with the frozen " +
      "sub-node reproducing imp-3580 exactly (ratio 0.996019, N_x=3.280294e9). (3) The maximum possible " +
      "frozen-Gronwall artifact -- the full endpoint swing of any admissible N-dependent flow factor -- " +
      "is therefore exactly 0 on the crossover and < 1e-5 on the ratio (max per-floor swing ~3e-6, max " +
      "N_half relative swing ~3.3e-6), so the imp-3580 conclusions are robust to replacing the frozen " +
      "constant with any physically-admissible N-varying flow law." +
      "\n\nHONEST SCOPE: measurement/certification only (400-iter bisection roots, residual < 1e-9) -- a " +
      "conditional-share diagnostic, NOT an RH bound. No positivity, no bridge closure, no RH claim, no " +
      "QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity remains UNTOUCHED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3604 (re-root-solving the imp-3580 sigma-crossover floor-invariance across a rigorous N-varying flow-factor bracket [1, exp(4.74e-4)] in place of the frozen exp(2.37e-4), showing the x(N_x)=1 coincidence is 0% a frozen-constant artifact and the ~0.996 N_half/N_x band shifts by less than 1e-5), 2026",
    relatedTerms: [
      "sigma=1/2 <=> E_coll=E_trunc crossover coincidence (imp-3580)",
      "imp-3599 exact flow-gap identity (imp-3599)",
      "imp-2644 A1 Theta-trap C_G in [1,2] (imp-2644)",
      "imp-398 E_flow C_F prefactor and backward-flow t_c(N) law (imp-398)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "density-corrected crossover collision time t_c(N_x)~9.17e-5: the 2pi-in-the-log correction (imp-3642)",
    category: "numerical",
    definition:
      "imp-3620 derived the crossover-scale Gronwall flow factor from the imp-398 closed form t_c(N) ~ " +
      "1/log gamma_N, ASSERTING (never cross-checking) that the 1/log gamma_N shrink shape and its 0.4410 " +
      "anchor-to-crossover factor hold for the actual Step-2 backward-Dyson flow. imp-3642 runs that direct " +
      "check: it seeds a locally-uniform mesoscopic gas at the Riemann-von Mangoldt local density d = 2pi / " +
      "log(gamma / 2pi) across a ladder of heights from the anchor gamma_{N*} (log = 9.1981) to the " +
      "crossover gamma_{N_x} = exp(20.8576), integrates the attractive Calogero-Moser flow dx_k/ds = -2 sum " +
      "1/(x_k - x_j) by RK4, and measures the mesoscopic density floor V0(gamma) = sup_strip Im M that " +
      "governs the imp-2520 shock time t_c ~ 1/(2 V0). Two findings: (F1) the SHAPE is reproduced -- the " +
      "measured V0(gamma) is exactly linear in log(gamma / 2pi) (invariant V0/log(gamma/2pi) = 0.48458, " +
      "spread < 1e-9 across the ladder), so t_c ~ 1/(2 V0) is genuinely inverse-log, not a 1/log^2 " +
      "nearest-pair law, and the Lemma B Gronwall floor is respected along the flow at every rung (worst " +
      "ratio > 0.98). (F2) the ARGUMENT of the log is wrong in imp-3620/imp-398: the direct anchor-to-" +
      "crossover shrink is r_direct = 0.3870 (V0(N*)/V0(N_x)), not the assumed bare-height ratio 0.4410 -- " +
      "the actual flow shrinks with the LOCAL DENSITY log(gamma / 2pi), while imp-398 used the BARE " +
      "Riemann-von Mangoldt height log gamma_N. Missing the 2pi inside the log makes imp-398/imp-3620 " +
      "OVER-STATE the surviving crossover collision time by ~13.96%. (F3) re-anchoring the direct shape to " +
      "the same A1-trap 2.37e-4 constant gives the density-corrected t_c(N_x) = 2.37e-4 * 0.3870 = 9.1714e-5 " +
      "(vs imp-3620's 1.0452e-4) and the C_G=1 flow factor 1.0000917 (vs 1.0001045) -- still deep inside the " +
      "imp-3604 bracket [1, 1.000474], now at ~19.3% of it (down from imp-3620's 22.05%), moving TOWARD 1, " +
      "so the imp-3604/imp-3620 N_half/N_x band ~0.996 is unchanged at its published 6-digit precision." +
      "\n\nHONEST SCOPE: the seed is a locally-uniform MESOSCOPIC gas, so only the imp-2520 density-floor " +
      "SHOCK shape/ratio is measured, not the microscopic nearest-pair collision; the absolute shock " +
      "constant c_sh (imp-2520 SG1, OPEN) is untouched and the scale stays pinned to 2.37e-4 exactly as " +
      "imp-398 does. Measurement/derivation only, RH-equivalent, necessary-but-not-sufficient; no " +
      "positivity, no bridge closure, no RH claim, no QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 " +
      "positivity UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3642 (direct RK4 backward-Dyson integration cross-checking the imp-3620/imp-398 1/log gamma_N shrink shape: confirms the shape but corrects the anchor-to-crossover factor from the bare-height 0.4410 to the density-corrected 0.3870, moving the crossover flow-factor pin from 1.0001045 toward 1.0000917), 2026",
    relatedTerms: [
      "sigma-crossover flow factor PINNED via the imp-398 closed form t_c(N)~1/log gamma_N (imp-3620)",
      "imp-3604 sigma-crossover flow-factor bracket invariance [1,1.000474] (imp-3604)",
      "backward-flow-stability-gronwall Lemma B/C, density floor V0, shock time t_c ~ 1/(2 V0) (imp-2520)",
      "imp-2644 A1 Theta-trap discharge, |t_c| <= g_min^2/6 = 2.37e-4, C_G in [1,2] (imp-2644)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3646 remainder-tail moment-ratio asymptotics: LOG-DIVERGENT C_n ~ (ln n)^2/(16 n^2), NOT a fixed b^2/n^2 saturation",
    category: "numerical",
    definition:
      "imp-3581/imp-3600/imp-3618/imp-3638 gave the closed relative-residual coefficients C_n = M_(n+2)/((n+1)(n+2)M_n) " +
      "and D_n = C_(n+2) - C_n driving r_n(a) = C_n a^2 [1 + D_n a^2 + O(a^4)], certified rung-by-rung through n=9,10, " +
      "but never characterized the large-n behaviour of the driving moment ratio Q_n = M_(n+2)/M_n. A natural guess was " +
      "that Q_n SATURATES to a fixed A-scale ceiling b^2 (an endpoint/hard-support constant), giving C_n ~ b^2/n^2 with " +
      "a FIXED prefactor and D_n = O(1/n^3). imp-3646 measured Q_n across n=3..18 on the NM=1600 [0,T_A] Simpson moment " +
      "reference and REFUTED that guess: because the autocorrelation weight A(tau) = int Phi(s)Phi(s+tau) ds decays " +
      "SUPER-exponentially (A(tau) ~ exp(-pi e^{4 tau}), cross-checked in imp-3665) with NO hard support endpoint, " +
      "Q_n instead GROWS slowly and without bound (Q_3~0.02915, Q_10~0.08020, Q_18~0.12840) and n^2 C_n is STRICTLY " +
      "INCREASING over n=3..18 (0.0131 -> 0.1095): C_n is NOT a fixed b^2/n^2. The growth is governed by the Laplace " +
      "saddle of the moment integrand tau^n A(tau), peaking at tau*(n) solving n = 4 pi tau* e^{4 tau*}, with " +
      "Q_n/tau*(n)^2 -> 1 monotonically from above (1.207 at n=6 -> 1.040 at n=18, extended to 1.005 at n=40 by " +
      "imp-3664), so Q_n ~ tau*(n)^2 with tau*(n) ~ (1/4) ln n (plus a ln ln n correction, pinned exactly by imp-3664). " +
      "This yields the CLOSED slowly-varying laws C_n = Q_n/((n+1)(n+2)) ~ (ln n)^2/(16 n^2) -- O((ln n)^2/n^2), a " +
      "LOG-DIVERGENT n^2 C_n prefactor, not a finite constant -- D_n = C_(n+2) - C_n < 0 -> 0 like O((ln n)^2/n^3), and " +
      "|p_fit - 2| = |D_n| cov(a^2,ln a)/var(ln a) -> 0 like the same O((ln n)^2/n^3), confirmed at the observable level " +
      "by imp-3670. So: a genuine DECAY law holds (C_n, D_n, |p_fit-2| all -> 0) but there is NO finite-constant " +
      "n -> inf limit for Q_n or n^2 C_n." +
      "\n\nHONEST SCOPE: measurement/derivation of a mass-feasibility diagnostic's large-n rate only; establishes NO " +
      "operator positivity. Mass-feasibility remains NECESSARY-BUT-NOT-SUFFICIENT; the off-diagonal endpoint-Hankel " +
      "obstruction K_a >= 0 (imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the " +
      "rigorous SOTA.",
    firstUsed: "imp-3646 (measuring the driving moment ratio Q_n=M_(n+2)/M_n across n=3..18, refuting the fixed-b^2/n^2 saturation guess and deriving the closed log-divergent-prefactor decay laws C_n~(ln n)^2/(16 n^2), D_n and |p_fit-2| -> 0 as O((ln n)^2/n^3)), 2026",
    relatedTerms: [
      "imp-3665 A-weight super-exponential decay confirmation: exp(-pi e^{4 tau}), no hard support endpoint (imp-3665)",
      "imp-3664 moment-ratio saddle law extension to n=40 and sub-leading tau*(n) correction (imp-3664)",
      "imp-3670 observable |p_fit-2| fit-bias decay rate cross-check against the imp-3646 law (imp-3670)",
      "imp-3581 remainder-tail exponent derivation, closed C_n/D_n law (imp-3581)",
      "imp-3501 general moment-ladder derivation R_n = sum a^m/m! M_m (imp-3501)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3647 feature-specific fold-in floor N_fold(xi_true) vs the generic imp-3582 worst-case N_replica",
    category: "numerical",
    definition:
      "imp-3582 derived the generic replica-hiding grid floor N_replica = xi_max U/pi ~ 764 by taking the " +
      "LOOSEST possible in-band source, xi_true = xi_max = 400: for N above this floor, NO first-order " +
      "aliasing replica of ANY in-band feature can fold into the scanned band (0, 400], so the imp-3558 " +
      "argmax-drift-0 discriminator is decisive for every rung. imp-3647 asks the sharper, feature-specific " +
      "question: for a PARTICULAR planted source at xi_true (not the worst case), how far can N drop before " +
      "its own replica folds in? The fold-in condition 2 xi_Nyq - xi_true <= xi_max solves to " +
      "N_fold(xi_true) = (xi_max + xi_true) U/(2 pi), which is STRICTLY BELOW the generic 764 for any " +
      "xi_true < xi_max. For the imp-3622 planted feature xi_true = 250 this gives N_fold ~ 620.70 " +
      "(1950/pi), and imp-3647 measured the sub-floor ladder N in {400,512,640,700,764,900} directly: for " +
      "every N > 620.70 (including 764, 700, 640, all below the generic worst-case floor) the replica sits " +
      "outside the band and the discriminator stays decisive; for N < 620.70 (512, 400) the replica folds " +
      "in with EXACTLY the genuine peak's height (Dirichlet comb tie, rel. diff ~1e-15), producing two " +
      "equal in-band maxima and destroying decisiveness. So the generic 764 remains a correct upper bound " +
      "for ALL in-band sources, but it is conservative for any specific feature below the band ceiling; the " +
      "true failure point for a given feature is its own, lower N_fold(xi_true)." +
      "\n\nHONEST SCOPE: measurement/certification of a synthetic planted feature only, sharpening WHERE the " +
      "generic imp-3582 floor is conservative; establishes no new bound on the |P1| objective itself and " +
      "gives xi* no closed form. RH-equivalent; the imp-3066 off-diagonal endpoint-Hankel K_a >= 0 magnitude " +
      "is the lone obstruction, UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the " +
      "rigorous SOTA.",
    firstUsed: "imp-3647 (measuring the sub-floor fold-in crossover of the imp-3622 planted feature at xi_true=250, locating its feature-specific floor N_fold~620.70 strictly below the imp-3582 generic worst-case N_replica~764), 2026",
    relatedTerms: [
      "imp-3582 analytic replica-hiding grid threshold N_replica~764 (imp-3582)",
      "imp-3622 planted-feature argmax-drift test above the generic floor (imp-3622)",
      "imp-3558 four-rung far-tail argmax-drift-0 discriminator (imp-3558)",
      "imp-3681 sub-floor replica fold-in crossover visualization (imp-3681)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3671 mesoscopic-vs-shock strip-height ladder: Gronwall floor collapse exp(-k^2 E_meso)",
    category: "numerical",
    definition:
      "imp-3642 measured the worst mesoscopic Gronwall floor 0.991 at strip height y_star = 4 d (d the " +
      "local mean spacing), fixing the mesoscopic contraction exponent E_meso = -ln(0.991) = 0.009041 = " +
      "2 s / y_star^2. Writing any strip height as y = y_star / k, the SAME Gronwall floor exp(-2 s / y^2) " +
      "becomes floor(k) = exp(-k^2 * E_meso) = floor_meso^{k^2} -- a strip-height ladder that COLLAPSES as " +
      "k grows from the mesoscopic scale (k=1) toward the microscopic nearest-pair scale (k large): " +
      "k=1 (y_star=4d) gives 0.99100, the mesoscopic reading imp-3642 respects; k=4 (mean spacing d) is " +
      "already down to 0.86532; the floor crosses ONE HALF at k~8.76 (y~0.457 d), i.e. the mesoscopic " +
      "contraction is already half-lost above the mean spacing; and by k=50 (y~0.08 d, near the nearest-pair " +
      "scale) the floor is ~1.5e-10 -- numerically VACUOUS. This quantifies imp-3671's negative finding " +
      "(S2): the imp-3642 mesoscopic V0 reading sits on a Gronwall floor that is essentially trivial (~0.99) " +
      "at its own strip height, but the SAME floor formula, evaluated at the microscopic nearest-pair strip " +
      "height the G6a_shock_lipschitz modulus would need, is Gronwall-vacuous -- so no amount of refining " +
      "the mesoscopic V0 measurement can reach the shock front; the scale separation itself blocks it, " +
      "independent of the imp-3671 (S1) type/dimension obstruction.",
    firstUsed: "imp-3671 (deriving the strip-height ladder floor(k) = exp(-k^2 E_meso) from the imp-3642 measured floor 0.991, to quantify the mesoscopic-vs-shock scale separation), 2026",
    relatedTerms: [
      "imp-3671 G6a_shock_lipschitz structural-silence verdict: mesoscopic V0 does NOT supply a Hoelder-1/2 modulus (imp-3671)",
      "imp-3642 sigma-crossover t_c direct-Dyson cross-check, V0 linear in log(gamma/2pi) (imp-3642)",
      "imp-2520 shock time t_c ~ 1/(2 V0), negative-finding 1: nearest-pair is Gronwall-vacuous (imp-2520)",
      "imp-3691 half-floor scale k~8.76 vs the E(N) bridge assessment (imp-3691)",
      "imp-3700 mesoscopic-vs-shock scale-separation visualization (imp-3700)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3642 mesoscopic density-floor SLOPE invariant V0(gamma)/log(gamma/2pi)=0.48458",
    category: "numerical",
    definition:
      "Distinct from the imp-3642 collision-time t_c(N_x) reading (the 2pi-in-the-log correction to the " +
      "anchor-to-crossover shrink factor), this entry is about the SLOPE quantity itself: across the whole " +
      "imp-3642 height ladder (log gamma from 9.1981 at the anchor gamma_{N*} to 20.8576 at the crossover " +
      "gamma_{N_x}), the measured mesoscopic density floor V0(gamma) = sup_strip Im M(x + i y_star) " +
      "(y_star = 4 d, d = 2pi / log(gamma / 2pi) the Riemann-von Mangoldt mean spacing) divided by " +
      "log(gamma / 2pi) is CONSTANT to machine epsilon (mean 0.48458, spread < 1e-9): V0 is EXACTLY linear " +
      "in the log local density, with no curvature across more than eleven natural-log units of height. " +
      "That linearity is what makes the shock collision time t_c ~ 1/(2 V0) genuinely inverse-log rather " +
      "than following some other power of log gamma." +
      "\n\nimp-3707 later DERIVED the coefficient analytically from the equilibrium (uniform) Calogero-Moser " +
      "lattice via the Mittag-Leffler cotangent identity sup_x Im M = (pi/d) coth(pi y_star/d), giving " +
      "V0/log(gamma/2pi) = (1/2) coth(pi y_star/d), which equals 0.5000000000 at y_star = 4d (coth(4pi)-1 " +
      "~ 5e-11) and stays exactly 1/2 for every y_star >= 2d -- a universal continuum value, NOT strip-" +
      "height dependent. So the imp-3642 measured 0.48458 is NOT itself a closed form: it is the M = 161 " +
      "FINITE-BLOCK truncation of the continuum 1/2, with deficit 1.58e-2 matching the leading tail law " +
      "8/(pi M); the invariant climbs toward 1/2 as the block size grows (0.4687 at M=81 to 0.4994 at " +
      "M=4001). The candidate closed form c/(2pi) was tested and REJECTED -- it merely re-expresses V0 " +
      "itself. So the honest status is: machine-epsilon CONSTANT across height (confirmed, imp-3642), but " +
      "the constant's own VALUE is a finite-block artifact of the true universal 1/2 (imp-3707)." +
      "\n\nHONEST SCOPE: measurement/derivation of a mesoscopic density-floor diagnostic only; establishes " +
      "no operator positivity. RH-equivalent, necessary-but-not-sufficient; the off-diagonal endpoint-" +
      "Hankel obstruction K_a >= 0 (imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian " +
      "Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3642 (measuring V0(gamma)/log(gamma/2pi) constant to machine epsilon across an eleven-log-unit height ladder; imp-3707 later derived the exact continuum value 1/2 and identified 0.48458 as its M=161 finite-block truncation), 2026",
    relatedTerms: [
      "density-corrected crossover collision time t_c(N_x)~9.17e-5: the 2pi-in-the-log correction (imp-3642)",
      "backward-flow-stability-gronwall Lemma B/C, density floor V0, shock time t_c ~ 1/(2 V0) (imp-2520)",
      "imp-3671 mesoscopic-vs-shock strip-height ladder: Gronwall floor collapse exp(-k^2 E_meso) (imp-3671)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3713 exact-saddle ratio finite-n overshoot: R_n crosses 1 and dips BELOW at n* ~ 226",
    category: "numerical",
    definition:
      "imp-3670/imp-3685 tracked the exact-Laplace-saddle ratio R_n = |D_n|/|D_n^saddle| " +
      "(D_n = C_(n+2) - C_n from the imp-3646 closed moment-ratio coefficients, D_n^saddle from " +
      "C_n^saddle = tau*(n)^2/((n+1)(n+2)) with tau*(n) the exact root of n = 4 pi tau* e^{4 tau*}) " +
      "only out to n=40, where R_n sits comfortably above 1 (R_40 ~ 1.02438). imp-3713 extended the " +
      "same [0,T_A] Simpson-moment machinery to n=3..230 and found the approach to 1 is qualitatively " +
      "different from a simple decaying tail: R_n first falls within 1e-3 of 1 at n=152, and BOTH " +
      "ticket-candidate laws for the residual r_n = R_n - 1 (c/n and c/ln n) are REJECTED -- n*r_n and " +
      "(ln n)*r_n are both strictly DECREASING, not converging to a constant. The local exponent " +
      "p(n) = -d ln r_n/d ln n grows WITHOUT BOUND (1.72 at n=30 -> 4.00 at n=150), and the reason is " +
      "that R_n does not asymptote to 1 from above at all: it OVERSHOOTS, crossing 1 at a finite " +
      "n* ~ 226 (r_225 = +2.746e-6, r_226 = -2.314e-6, linear interp ~225.5) and continuing BELOW 1 " +
      "out to n=240. So the exact-saddle convergence is a finite-n zero-crossing of |D_n| - " +
      "|D_n^saddle|, not a power-law tail -- distinct from the separate sg-3670/sg-3685 question of " +
      "the CRUDE (ln n)^2/n^3 plateau rate, which never crosses zero." +
      "\n\nPROVENANCE UPDATE: imp-3713's own moment accumulation pinned n* only to +-1 (D_n loses " +
      "~log10(n/4) digits to cancellation). imp-3731 applied Neumaier-compensated summation and " +
      "pinned the crossing to n* = 225.5427323 (grid-stable to ~1e-9), also finding the sub-unity dip " +
      "is a bounded shallow well (deepest r_min ~ -1.129e-4 at n=276) that RECOVERS toward 1, not a " +
      "monotone dive. imp-3849 then showed imp-3731's own grid-convergence check had refined only the " +
      "outer moment panels while leaving the INNER A(tau) quadrature at the coarse imp-3713 resolution " +
      "-- converging that inner integral moves the crossing further in, to n* = 215.231, and deepens " +
      "the well roughly 5x (r_min ~ -5.845e-4 near n=500) before R_n again recovers toward 1. So the " +
      "QUALITATIVE finding here (finite-n overshoot below 1, not a plateau) is confirmed at every " +
      "refinement; the QUANTITATIVE crossing location keeps moving as quadrature resolution improves, " +
      "and imp-3735/imp-3848 traced the underlying driver to the n-difference of the imp-3646 " +
      "correction eps_n = Q_n/tau*(n)^2 - 1, which changes sign near n~149." +
      "\n\nHONEST SCOPE: measurement/characterization of a mass-feasibility diagnostic's finite-n " +
      "convergence shape only; establishes no operator positivity. RH-equivalent, necessary-but-not-" +
      "sufficient; the off-diagonal endpoint-Hankel obstruction K_a >= 0 (imp-3066) is UNTOUCHED. No " +
      "RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3713 (extending the exact-saddle ratio R_n to n=3..230, rejecting both c/n and c/ln n residual laws, and discovering the finite-n overshoot through 1 at n* ~ 226; imp-3731 and imp-3849 later refined the crossing location and well depth via compensated and inner-quadrature-converged re-measurement), 2026",
    relatedTerms: [
      "imp-3646 remainder-tail moment-ratio asymptotics: LOG-DIVERGENT C_n ~ (ln n)^2/(16 n^2), NOT a fixed b^2/n^2 saturation (imp-3646)",
      "imp-3731 Neumaier-compensated crossing pin n*=225.5427323 and shallow-well recovery (imp-3731)",
      "imp-3849 inner-quadrature-converged crossing n*=215.231 and 5x-deeper well (imp-3849)",
      "imp-3735 moment-ratio correction tail eps_n and its sign change near n~149 (imp-3735)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3715 fifth-pair Gram-spread rounding-floor model: worstPairSpread(N) sits at a few-ULP floor, not linear N*eps accumulation",
    category: "numerical",
    definition:
      "imp-3668 dense-certified the fifth adjacent Gram pair lambda_9 = lambda_10 at the deep rungs " +
      "N in {1200, 1600, 2000} via the independent Householder tred1 + implicit-QL tql1 route (all " +
      "eigenvalues, no Krylov, no reorthogonalization), tabulating worstPairSpread(N) = " +
      "|lambda_9 - lambda_10| / lambda_9 = 0, 0, 1.38e-15 across the three rungs -- but not its scaling " +
      "law. imp-3715 re-baked the three literals (import-light, arithmetic only) and tested two rounding " +
      "envelopes: (A) an N-INDEPENDENT few-ULP backward-error floor, spread ~ c_ulp * eps, versus " +
      "(B) a LINEAR-ACCUMULATION budget, spread ~ N * eps. RESULT: model (B) is decisively FALSIFIED -- " +
      "at N=2000 the linear budget N*eps = 4.44e-13 is ~323x the measured 1.38e-15 (using only 0.31% of " +
      "the budget), and N*eps already crosses the PAIR_TOL = 1e-14 degeneracy threshold at N ~ 45, so a " +
      "spread that tracked N*eps could not be degenerate to < 1.4e-15 at N=2000 -- yet it is. The " +
      "measured worst spread is only 6.20 ULP relative (1.38e-15 / eps = 6.195), the last-digit rounding " +
      "of the implicit-QL eigensolver on a genuinely degenerate pair -- the model (A) few-ULP floor, " +
      "N-independent. Extrapolating the floor (conservatively 10*eps ~ 2.22e-15) to the deeper rungs " +
      "N = 2400 / 2800 keeps the spread ~1e-15, an order of magnitude below PAIR_TOL, so the " +
      "double-precision solve is projected adequate there with no extended/quad-precision solve needed." +
      "\n\nHONEST SCOPE: a scaling MEASUREMENT and threat ASSESSMENT on a coarse 3-rung sample (two " +
      "rungs exactly 0) -- decisive against the linear model but not a resolved growth exponent; the " +
      "N=2400/2800 figures are a floor-model bound, not a fresh dense solve at those rungs. Distinct " +
      "from the imp-3692 independent Sturm-bisection verify of the same literals. Establishes no " +
      "fifth-pair amplitude law and attempts no operator positivity. RH-equivalent, necessary-but-not-" +
      "sufficient; the off-diagonal endpoint-Hankel obstruction K_a >= 0 (imp-3066) is UNTOUCHED. No " +
      "RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3715 (measuring the imp-3668 fifth-pair Gram-spread scaling across N=1200/1600/2000, falsifying the linear N*eps model, and projecting the few-ULP floor safe at N=2400/2800), 2026",
    relatedTerms: [
      "imp-3668 dense fifth-pair Gram degeneracy cross-validation (imp-3668)",
      "imp-3692 independent Sturm-bisection verify of the fifth-pair literals (imp-3692)",
      "imp-3688 sixth-pair dense certification whose margin this assessment informs (imp-3688)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3711 post-peak sigma(N) half-life landmark: strictly monotone decay past N_max ~ 9.22e5, sqrt-law tail, half-life at N ~ 4.04e9",
    category: "numerical",
    definition:
      "imp-3406 pinned the interior MAXIMUM of the GUE-conditional share sigma(N) = E_coll(N)/E(N) " +
      "at N_max ~ 9.219e5 (sigma_max ~ 0.949429) and predicted -- analytically only -- monotone decay " +
      "past it as the constant truncation floor E_trunc outlives the vanishing E_coll ~ sqrt(log T0/N). " +
      "imp-3711 continues that curve at N in {1.5e6, 2e6, 5e6, 1e7} (the 5e6 rung is NEW, absent from " +
      "the imp-3406 decade ladder), confirming sigma falls strictly: 0.948635, 0.947368, 0.938717, " +
      "0.926562. The decay SHAPE is gentle near the peak (log-log slope d ln sigma/d ln N ~ -0.023 at " +
      "1e7, where E_coll/E_trunc ~ 15.6) and steepens toward the sqrt-law asymptote -1/2 as E_coll " +
      "drops through the fixed floor E_trunc = 3.06e-5 (~-0.30 at 1e10, ~-0.45 at 1e12, ~-0.48 at " +
      "1e15) -- so the deep tail is a slow 1/sqrt(N) power law, not exponential. A new landmark, the " +
      "PEAK HALF-LIFE, is located by bisection: sigma first falls to sigma_max/2 ~ 0.474715 near " +
      "N_half ~ 4.04e9 (~3.64 decades above N_max), distinct from the imp-3406 absolute-0.5 crossing " +
      "at N ~ 3.27e9, which measures the fixed 0.5 level rather than halving from the peak." +
      "\n\nHONEST SCOPE: MODEL-ONLY continuation of the imp-3406 analytic curve -- the true empirical " +
      "E_coll(N) needs an O(N^2) Dyson/spectral run, infeasible past N ~ 10^5 on the active pool " +
      "(imp-1082), so none of these rungs are freshly-measured spectral rows. No positivity, no " +
      "bridge closure, no RH claim, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3711 (continuing the imp-3406 sigma(N) ladder past its 10^6 endpoint, adding the 5e6 rung, characterizing the sqrt-law decay shape, and locating the peak half-life at N ~ 4.04e9), 2026",
    relatedTerms: [
      "sigma(N) N-shape (interior min ~97.8, interior max ~9.22e5) (imp-3406)",
      "sigma(N) machine-precision landmark ladder L1-L5 (imp-3444)",
      "GUE-conditional share argmin (imp-3323)",
      "empirical E_coll O(N^2) native-backend infeasibility note (imp-1082)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3746 verification-provenance catalog: which deep-rung baked-literal families carry an INDEPENDENT reproduction vs remain single-source",
    category: "numerical",
    definition:
      "A cluster of tickets re-derived deep-rung baked literals through a STRUCTURALLY DIFFERENT " +
      "method than the one that first baked them, guarding against a transcription slip, an " +
      "offline-drift stale copy, or a solver-convergence bug before downstream tickets build on " +
      "those numbers. This entry catalogs which baked-literal families now clear that bar." +
      "\n\nDUAL-SOURCE (independently reproduced): (1) imp-3643's baked deep-rung dense top-8 Gram " +
      "eigenvalues (fourth-pair lambda_7=lambda_8, N=1200/1600/2000) -- imp-3669 re-typed the " +
      "imp-3505 Ttilde assembly from scratch and extracted the top-8 by STURM-SEQUENCE BISECTION " +
      "on the (shared) Householder tridiagonal, an eigenvalue-EXTRACTION routine entirely different " +
      "from imp-3643's EISPACK implicit-QL. Worst relative deviation 1.77e-15 across all three " +
      "rungs (machine precision), and the independent third-gap sigma_3=lambda_7/lambda_1 agrees " +
      "with the imp-3619 Lanczos value to worst 3.38e-14, below imp-3643's own XVAL_TOL=1e-13: " +
      "CONFIRMED, no transcription or drift. (2) imp-3668's baked deep-rung dense top-10 Gram " +
      "eigenvalues (fifth-pair lambda_9=lambda_10, same three rungs) -- imp-3692 extended the " +
      "identical Sturm-bisection lever two spectrum levels: worst top-10 relative deviation is " +
      "again 1.77e-15 (the first eight entries per rung are the same literals), and the independent " +
      "fifth-pair spread |lambda_9-lambda_10|/lambda_9 is <4e-16 at every rung (0 at N=1200/2000, " +
      "3.93e-16 at N=1600) against a 1e-14 pairing tolerance: CONFIRMED. (3) imp-3665's baked " +
      "log-domain A-weight decay exponents -ln A(tau) at tau in {0.5,1,1.5,2}, including the " +
      "extreme rungs A(1.5)~1e-550 and A(2)~1e-4067 -- imp-3709 reproduced them via a factored " +
      "(no max-subtraction) ln Phi kernel plus 10-point Gauss-Legendre on power-graded panels, in " +
      "place of imp-3665's log-sum-exp kernel and uniform composite Simpson. The -4067/-550 " +
      "EXPONENT ORDERS are confirmed exactly; the small-tau rungs match to <1e-5 relative; the two " +
      "extreme rungs initially differed by ~5.3e-4/2.8e-4 relative, diagnosed as imp-3665's own " +
      "uniform grid under-resolving the razor-sharp near-s=0 peak rather than a method disagreement " +
      "(imp-3736 later Richardson-refined imp-3665's own Simpson onto the graded-GL limit, " +
      "converging both paths to -ln A(1.5)=1267.7886 and -ln A(2)=9365.3190). (4) imp-3730's baked " +
      "A-weight subleading-correction limit c_inf ~ 0.3543, originally only a numeric extrapolation " +
      "from the last clean rungs c(5)/c(5.5) -- imp-3844 UPGRADED this from single-source numeric " +
      "extrapolation to an INDEPENDENT closed-form analytic derivation, c_inf = pi - ln(pi/2) - " +
      "ln(acc0) = -ln((pi/2)Phi(0)) = 0.35429228409357, with the geometric-approach coefficient " +
      "B = 3/(2 pi) = 0.477465 matching the imp-3730 measured e^{-1} step ratio exactly: CONFIRMED, " +
      "the extrapolated floor is not a curve-fitting artifact. (5) imp-3850 gave the imp-3730 " +
      "c(2.5)/c(3.0) rungs a dual-path anchor: pushing the uniform log-Simpson mesh to n=2.56e7 " +
      "(tau=2.5) and n=2.048e8 (tau=3.0), both offline-verified literals, climbs monotonically onto " +
      "the graded-GL limit -ln A(2.5)=69198.540665 and -ln A(3.0)=511309.612538, rel ~1e-11 at both " +
      "rungs, extending the imp-3736 dual-path reconciliation window from [1.5,2.0] to [1.5,3.0]: " +
      "CONFIRMED, c(2.5)=+0.357539 and c(3.0)=+0.355480 no longer rest on the graded-GL path alone." +
      "\n\nTRIPLE-SOURCE (upgraded past dual-source): (6) imp-3849's exact-saddle ratio ladder " +
      "R_n=|D_n|/|D_n^saddle| crossing unity at n*=215.231, located via composite Neumaier-" +
      "compensated Simpson -- imp-3868 first reproduced it with composite 5-point Gauss-Legendre " +
      "(n*=215.23246, agreeing to ~6e-8 of a rung), then imp-3895 added a THIRD, structurally " +
      "distinct rule, composite Clenshaw-Curtis on self-computed Chebyshev-extrema nodes, which " +
      "shares no node placement, weight pattern or error mechanism with either prior rule and " +
      "again lands on n*=215.23246 with r_226=-8.73698e-5 (agreeing with GL to ~8e-13): CONFIRMED, " +
      "this crossing is now the first family in this catalog upgraded from dual-source to " +
      "TRIPLE-source, retiring the quadrature-order/rule-family-artifact worry entirely (the " +
      "shared NPHI=10 kernel-truncation floor remains common to all three and is untouched)." +
      "\n\nSINGLE-SOURCE (no independent reproduction path applied yet): imp-3623/imp-3625's baked " +
      "deep-rung dense top-6 (third-pair lambda_5=lambda_6) has only been cross-validated against " +
      "the ORIGINAL imp-3602 Lanczos/Krylov solve, not re-extracted by an independent Sturm-" +
      "bisection route; imp-3688's baked deep-rung dense top-12 (sixth-pair lambda_11=lambda_12) " +
      "rests on the dense Householder+QL solve alone, with no Sturm-bisection or other structurally-" +
      "distinct cross-check yet. Both are direct candidates for the same independent-verify pattern " +
      "imp-3669/imp-3692 already applied one and two pairs below them." +
      "\n\nHONEST SCOPE: a provenance/status catalog only -- records which baked-literal families " +
      "have a second, structurally-distinct reproduction path and to what tolerance, so downstream " +
      "tickets can see verification coverage at a glance. No new derivation, no re-solve, and no " +
      "operator positivity; the off-diagonal endpoint-Hankel obstruction K_a >= 0 (imp-3066) is " +
      "UNTOUCHED. RH-EQUIVALENT; no RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the " +
      "rigorous SOTA.",
    firstUsed: "imp-3746 (cataloguing the imp-3669 Sturm-bisection third-gap, imp-3709 graded-Gauss-Legendre A-weight, and imp-3692 Sturm-bisection fifth-pair independent reproductions against the still-single-source imp-3623/imp-3625 third-pair and imp-3688 sixth-pair dense literals; imp-3930 later added imp-3895's Clenshaw-Curtis rule as a THIRD independent reproduction of the imp-3849/imp-3868 exact-saddle R_n crossing, the catalog's first triple-source upgrade), 2026",
    relatedTerms: [
      "imp-3643 dense-solver certifies skew-Toeplitz FOURTH pair lambda_7=lambda_8; N=2000 imp-3619 loss is a Krylov artifact (imp-3643)",
      "imp-3668 skew-Toeplitz FIFTH-pair adjacent-pairing dense certification: lambda_9=lambda_10, sigma_4 -> 1 (imp-3668)",
      "imp-3665 A-weight super-exponential decay confirmation: exp(-pi e^{4 tau}), no hard support endpoint (imp-3665)",
      "imp-3623/imp-3625 dense-solver resolution of the N=2000 skew-Toeplitz third-pair Krylov artifact (imp-3654)",
      "imp-3844 closed-form derivation of c_inf and B = 3/(2 pi), upgrading imp-3730 from numeric extrapolation to independent analytic derivation (imp-3844)",
      "imp-3850 dual-path -ln A(tau) reconciliation extended to tau in {2.5,3.0}, anchoring c(2.5)/c(3.0) (imp-3850)",
      "imp-3895 THIRD independent quadrature reproduction (Clenshaw-Curtis) of the imp-3849/imp-3868 exact-saddle R_n crossing, upgrading it to triple-source (imp-3895)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3727 K4 entropy-solution regularity scoping: the six hypotheses a Burgers/CM caustic-map route to G6a Hoelder-1/2 would need",
    category: "proof",
    definition:
      "imp-3714 enumerated candidate K4 -- a direct Burgers / Calogero-Moser entropy-solution " +
      "Hoelder-1/2 regularity bound on the collision-time field tau_c(x) -- as the ONE " +
      "G6a_shock_lipschitz construction that dodges both imp-3671 obstructions (S1 wrong type, S2 " +
      "wrong scale) without reading an existing mesoscopic field, but flagged it WHOLLY NEW. imp-3727 " +
      "scopes what K4 would actually require: the continuum limit of the attractive Dyson / CM flow " +
      "dx_k/ds = -2 sum_j 1/(x_k - x_j) obeys the complex inviscid Burgers equation " +
      "partial_s m + m partial_z m = 0 (Biane/Voiculescu free-probability form), whose real-line " +
      "reduction is a genuinely-nonlinear scalar conservation law; tau_c(x) is exactly its first-" +
      "crossing (caustic-envelope) functional, so a spatial-regularity estimate on tau_c(x) is a " +
      "shock-formation/caustic-map regularity estimate in the classical Lax/Oleinik/Kruzhkov sense, " +
      "with the 1/2 exponent tied to the square-root opening of a generic fold (A_2) caustic (an A_3 " +
      "cusp would give a different exponent)." +
      "\n\nSix hypotheses an argument yielding C_Lip would need: H1 conservation-law/Hamilton-Jacobi " +
      "structure for tau_c, H2 genuine nonlinearity (convex flux), H3 entropy admissibility " +
      "(Lax/Kruzhkov), H4 the Oleinik one-sided/semiconcavity BV bound, H5 fold caustic-type control " +
      "fixing the 1/2 exponent, and H6 characteristic-speed/Rankine-Hugoniot control. Checked against " +
      "the imp-3642 CM-flow machinery: only H6 is PARTIAL (the RK4 integrator computes discrete " +
      "characteristic speeds, but no continuum Lipschitz shock-speed bound is derived), H2 is LATENT " +
      "(the complex-Burgers hydrodynamic limit is standard but unwritten/uncertified in the repo), " +
      "and H1, H3, H4, H5 are ABSENT. Crucially the repo's only existing one-sided estimate, the " +
      "imp-2520 Lemma B Gronwall floor, is exactly the mesoscopic mechanism K4 is defined to BYPASS, " +
      "so it cannot be recycled to discharge H4." +
      "\n\nSo the gap between repo ingredients and an admissible C_Lip certificate along K4 is " +
      "essentially the whole Burgers/CM entropy-solution regularity theory (Oleinik/Kruzhkov/Hopf-Lax " +
      "semiconcavity plus Arnold fold-caustic classification); imp-3642 contributes only the discrete " +
      "characteristic map. K4 is confirmed WHOLLY NEW, consistent with the imp-3714 verdict, and " +
      "G6a_shock_lipschitz stays OPEN." +
      "\n\nHONEST SCOPE: literature-anchored hypothesis scoping/derivation only -- no estimate " +
      "shipped, no positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal " +
      "endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains the " +
      "rigorous SOTA.",
    firstUsed: "imp-3727 (scoping the six hypotheses H1-H6 a Burgers/CM entropy-solution regularity argument for tau_c(x) would require, and finding only H6 partial and H2 latent against the imp-3642 CM-flow machinery, with H1/H3/H4/H5 wholly absent), 2026",
    relatedTerms: [
      "imp-3714 G6a_shock_lipschitz modulus candidates K1-K4: consolidated status table (imp-3714)",
      "imp-3671 G6a_shock_lipschitz structural-silence verdict: S1 wrong type, S2 wrong scale (imp-3671)",
      "imp-3708 y2-adapted flow depth s(y) ~ y^2 as the REQ-ii escape (imp-3708)",
      "backward-flow-stability-gronwall Lemma B/C, the one-sided floor K4 must bypass (imp-2520)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3846 K4 caustic-regularity toolkit assessment: the four absent hypotheses form a dependency chain rooted at H2",
    category: "proof",
    definition:
      "imp-3727 gave a FLAT availability tally against the imp-3642 CM-flow machinery for the six K4 " +
      "hypotheses H1-H6: H6 partial, H2 latent, H1/H3/H4/H5 absent. imp-3846 walks the classical " +
      "caustic-regularity TOOLKIT tool-by-tool instead -- Oleinik one-sided E-condition (T1), Lax/" +
      "Dafermos genuinely-nonlinear shock-set structure (T2), Hopf-Lax value-function representation " +
      "(T3), Arnold A_2-fold/A_3-cusp caustic classification (T4), Bec-Khanin Lagrangian-map framework " +
      "(T5) -- and finds the toolkit is INTERNALLY COUPLED: T3 supplies H1, T2 supplies H3, T1 supplies " +
      "H4, T4 supplies H5, and EVERY one of T1, T2, T3 requires H2 (genuine nonlinearity / convex flux) " +
      "as a prerequisite (Oleinik decay needs f'' bounded below, Lax admissibility is stated for " +
      "genuinely-nonlinear flux, Hopf-Lax needs a convex Hamiltonian)." +
      "\n\nSo the four absent hypotheses are not independent gaps but a DEPENDENCY CHAIN " +
      "H2 -> {H1, H3} -> H4 -> (with H5) -> the Hoelder-1/2 modulus C_Lip, whose single unwritten ROOT " +
      "is H2 -- the repo never writes the continuum complex-inviscid-Burgers limit of the imp-3642 flow " +
      "nor certifies its flux is uniformly convex. T5 is the only tool with even partial availability: " +
      "the imp-3642 RK4 advances the discrete Lagrangian characteristic map (matching H6 at the " +
      "discrete level), but T5 reads regularity OFF an already-constructed continuum entropy solution, " +
      "so it is downstream of the H2-rooted chain, not a shortcut around it. The imp-2520 Lemma B " +
      "Gronwall floor still cannot discharge H4 or upgrade T5, being exactly the mesoscopic mechanism " +
      "K4 is defined to bypass." +
      "\n\nThis is a SCOPING REFINEMENT, not a closure: naming H2 as the root does not supply it, and " +
      "none of T1-T4 is discharged by the repo. K4 stays confirmed WHOLLY NEW (consistent with imp-3714 " +
      "/ imp-3727) and G6a_shock_lipschitz stays OPEN." +
      "\n\nHONEST SCOPE: literature-anchored scoping/derivation only -- no estimate shipped, no " +
      "positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel " +
      "K_a >= 0 positivity UNTOUCHED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA." +
      "\n\nSTATUS UPDATE (imp-3872): the H2 root named here is no longer merely 'latent' -- imp-3872 " +
      "empirically PROBES it, sampling kappa = (m_s - m_zz)/(m m_z) at 325 (height, time, z) points " +
      "along the imp-3642 RK4 flow and finding it single-signed at exactly 2 (the discrete analog of a " +
      "uniformly convex flux) with zero sign changes. That is still NOT a certificate: it does not " +
      "construct the continuum complex-inviscid-Burgers limit or prove it exists, so H2 stays UNWRITTEN " +
      "as a proof input and every one of T1-T4 above remains undischarged. The K4 route stays WHOLLY " +
      "NEW and G6a_shock_lipschitz stays OPEN.",
    firstUsed: "imp-3846 (walking the classical caustic-regularity toolkit tool-by-tool and refining the imp-3727 flat availability tally into a dependency chain rooted at H2), 2026",
    relatedTerms: [
      "imp-3727 K4 entropy-solution regularity scoping: the six hypotheses a Burgers/CM caustic-map route to G6a Hoelder-1/2 would need (imp-3727)",
      "imp-3714 G6a_shock_lipschitz modulus candidates K1-K4: consolidated status table (imp-3714)",
      "imp-3671 G6a_shock_lipschitz structural-silence verdict: S1 wrong type, S2 wrong scale (imp-3671)",
      "backward-flow-stability-gronwall Lemma B/C, the one-sided floor K4 must bypass (imp-2520)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
      "imp-3872 H2 discrete-flux convexity probe: kappa = 2 everywhere, viscosity shrinks ~518x (imp-3872)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3730 A-weight subleading correction limit c_inf ~ 0.3543: the third-of-a-log-unit floor above the leading pi e^{4 tau} decay",
    category: "numerical",
    definition:
      "The autocorrelation weight A(tau) = int_0^inf Phi(s) Phi(s + tau) ds (Phi the NPHI=10 " +
      "completed-Riemann kernel) decays super-exponentially as A(tau) ~ exp(-pi e^{4 tau}) " +
      "(imp-3665), so it is natural to ask what the SUBLEADING correction c(tau) = -ln A(tau) - " +
      "pi e^{4 tau} does as tau grows: settle to a positive constant, or decay to 0? imp-3716 " +
      "measured c(tau) positive and decreasing across [0.5,2.0] (0.617 -> 0.363) but its uniform " +
      "Simpson grid stalled past tau ~ 2.5 because the near-s=0 peak of Phi(s)Phi(s+tau) sharpens " +
      "like e^{4 tau} (width ~ 1/(4 pi e^{4 tau})), leaving sg-3716-correction-limit OPEN." +
      "\n\nimp-3730 resolved it with the imp-3709 peak-adapted quadrature (10-pt Gauss-Legendre on " +
      "power-graded panels clustering the collapsing peak, factored log-domain kernel so nothing " +
      "underflows at the ~1e-4067 magnitude class), converging c(tau) to <1e-9 out to tau ~ 6 -- " +
      "2.4x the uniform-grid ceiling. RESULT: c(tau) approaches a POSITIVE CONSTANT c_inf ~ 0.3543 " +
      "(extrapolated 0.354291 from the last clean rungs c(5)=0.354314, c(5.5)=0.354300); it does " +
      "NOT decay to 0. The decrement c(tau) - c_inf shrinks GEOMETRICALLY, c(tau) = c_inf + " +
      "B e^{-2 tau}, with the ratio of consecutive 0.5-step differences settling at ~0.367 = e^{-1}. " +
      "By tau = 5.5 the increment has collapsed below 1.5e-5 while c stays ~0.3543 -- the " +
      "correction never vanishes, it plateaus a third of a natural-log unit above the leading law " +
      "forever. imp-3844 later DERIVED this numeric floor in closed form: c_inf = pi - ln(pi/2) - " +
      "ln(acc0) = -ln((pi/2)Phi(0)) = 0.35429228409357, with the geometric-approach coefficient " +
      "B = 3/(2 pi) = 0.477465 (matching the imp-3730 measured e^{-1} step ratio, since 2 tau steps " +
      "of 0.5 give e^{-2*0.5}=e^{-1})." +
      "\n\nHONEST FLOOR: c is a difference of two O(pi e^{4 tau}) quantities, so ~11 of 16 double " +
      "digits cancel by tau=6 and the ladder goes noisy past tau ~ 6.5 -- a floating-point " +
      "cancellation floor, not a quadrature failure (the integral itself is bit-stable across a 4x " +
      "panel and grade 6->8 refinement there). The plateau is already reached before the floor " +
      "bites, so c_inf > 0 does not depend on pushing further." +
      "\n\nHONEST SCOPE: measurement/numerical result (later closed-form-derived), RH-equivalent, " +
      "necessary-but-not-sufficient; establishes NO operator positivity. The operator-level K_a >= 0 " +
      "off-diagonal endpoint-Hankel positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3730 (peak-adapted graded-GL measurement determining c(tau) approaches the positive constant c_inf ~ 0.3543 rather than decaying to 0, resolving the imp-3716 open sub-gap sg-3716-correction-limit), 2026",
    relatedTerms: [
      "imp-3665 A-weight super-exponential decay confirmation: exp(-pi e^{4 tau}), no hard support endpoint (imp-3665)",
      "imp-3709 peak-adapted graded Gauss-Legendre log-domain A-weight quadrature (imp-3709)",
      "imp-3844 closed-form derivation of c_inf and B = 3/(2 pi) (imp-3844)",
      "imp-3850 dual-path -ln A(tau) reconciliation extended to tau in {2.5,3.0} (imp-3850)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3735 moment-ratio correction eps_n = Q_n/tau*(n)^2 - 1: Laplace-variance decay order",
    category: "numerical",
    definition:
      "The imp-3646 closed moment-ratio coefficients satisfy C_n^saddle = tau*(n)^2/((n+1)(n+2)), " +
      "with tau*(n) the exact root of n = 4 pi tau* e^{4 tau*}, while the true Simpson-quadrature " +
      "moment ratio Q_n differs from this saddle value by a correction eps_n = Q_n/tau*(n)^2 - 1. " +
      "imp-3735 measured eps_n across n = 6..80 and tested it against three candidate decay laws: " +
      "the slow 16/(ln n)^2, the faster c/n, and the Laplace-variance order 1/(n(1+4 tau*(n))). Both " +
      "16/(ln n)^2 and c/n were REJECTED as poor fits; the data instead sits strictly between them, " +
      "consistent with the Laplace-variance order -- the reduced factor eps_n * n * (1 + 4 tau*(n)) " +
      "drifts toward 1 as n grows rather than settling immediately, so the local exponent " +
      "p(n) = -d ln eps_n/d ln n is UNBOUNDED rather than converging to a fixed power. This " +
      "unbounded local exponent is the same underlying drift that produces the imp-3713 finite-n " +
      "exact-saddle-ratio R_n crossing 1 at a finite n* rather than approaching it monotonically as " +
      "a clean power-law tail: eps_n changes sign near n ~ 149 (eps_148 = +7.60e-6, eps_149 = " +
      "-3.46e-6 at inner-quadrature convergence, imp-3849), directly tracking the location where " +
      "R_n dips below 1." +
      "\n\nHONEST SCOPE: measurement/characterization of a mass-feasibility diagnostic's finite-n " +
      "correction-term decay order only; establishes no operator positivity. RH-equivalent, " +
      "necessary-but-not-sufficient; the off-diagonal endpoint-Hankel obstruction K_a >= 0 " +
      "(imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the " +
      "rigorous SOTA.",
    firstUsed: "imp-3735 (measuring the eps_n = Q_n/tau*(n)^2 - 1 moment-ratio correction across n=6..80, rejecting both the slow 16/(ln n)^2 and faster c/n decay laws in favor of the intermediate Laplace-variance order 1/(n(1+4 tau*)), and identifying the unbounded local exponent that drives the imp-3713 finite-n saddle-ratio crossing), 2026",
    relatedTerms: [
      "imp-3646 remainder-tail moment-ratio asymptotics: LOG-DIVERGENT C_n ~ (ln n)^2/(16 n^2) (imp-3646)",
      "imp-3713 exact-saddle ratio finite-n overshoot: R_n crosses 1 at n* ~ 226 (imp-3713)",
      "imp-3849 inner-quadrature-converged crossing n*=215.231 and eps_n sign-change near n~149 (imp-3849)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3736 honest-status note: the imp-3665-vs-imp-3709 -ln A(2) gap is ENTIRELY grid-convergence residual, not a method disagreement",
    category: "numerical",
    definition:
      "PROVENANCE RECORD, not a new derivation: settles whether the ~2.6-natural-log-unit gap " +
      "between imp-3665's baked uniform-Simpson literal -ln A(2)=9362.72 and imp-3709's " +
      "independent graded-Gauss-Legendre value -ln A(2)=9365.32 (rel ~2.8e-4) reflected a genuine " +
      "disagreement between the two structurally different quadratures, or was simply an " +
      "under-converged grid. imp-3709's own partial Richardson ladder had stopped at n=2e5, " +
      "still ~0.08 short of the graded-GL value, so it only CONJECTURED the reconciliation " +
      "without demonstrating it." +
      "\n\nimp-3736 drove imp-3665's uniform log-Simpson ladder past that stopping point, to " +
      "n=8e5 (self-computing) and n=3.2e6 (offline-verified literal), and confirmed the graded-GL " +
      "path is already cutoff- and grade-invariant (hi=12/14/16 and grade 4/6 agree bit-for-bit), " +
      "i.e. a genuine converged value rather than a grid plateau. The uniform-Simpson -ln A(2) " +
      "climbs monotonically onto the graded-GL limit as n grows (9362.79 @ 12000 -> 9365.24 @ 2e5 " +
      "-> 9365.318968 @ 3.2e6), landing on a converged -ln A(1.5)=1267.788621 and " +
      "-ln A(2)=9365.318970, with the two independent paths agreeing to ~10 significant figures " +
      "(residual ~2e-6 absolute, rel ~2e-10) at full convergence." +
      "\n\nVERDICT: the gap was ENTIRELY grid-convergence residual in imp-3665's uniform grid, " +
      "which cannot resolve the near-s=0 integrand peak whose width collapses like " +
      "1/(4 pi e^{4 tau}) ~ 1e-5 at tau=2. imp-3665's precise literals (9362.72, 1267.12) were " +
      "~0.03-0.05% LOW -- a resolution refinement only. The A(2) ~ 1e-4067 super-exponential-decay " +
      "ORDER (log10 A(2)=-4067.31) is UNCHANGED; only the trailing literals refine onto " +
      "-ln A(2)=9365.3190." +
      "\n\nHONEST SCOPE: a convergence-provenance record only, at the RH-equivalent scale class. " +
      "No new derivation, no re-solve, and no operator positivity; the off-diagonal endpoint-Hankel " +
      "obstruction K_a >= 0 (imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian " +
      "Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3736 (driving imp-3665's uniform log-Simpson ladder past imp-3709's partial n=2e5 Richardson stop to full n=3.2e6 convergence, confirming the ~2.6-log-unit -ln A(2) gap is grid residual and both paths agree to ~10 sig figs), 2026",
    relatedTerms: [
      "imp-3665 A-weight super-exponential decay confirmation: exp(-pi e^{4 tau}), no hard support endpoint (imp-3665)",
      "imp-3709 peak-adapted graded Gauss-Legendre log-domain A-weight quadrature (imp-3709)",
      "imp-3746 verification-provenance catalog: which deep-rung baked-literal families carry an INDEPENDENT reproduction vs remain single-source (imp-3746)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-33223 honest-status note: sg-3844-watson-tail is now REDUCED-AND-PINNED (imp-3866 -> imp-3892), not open",
    category: "meta",
    definition:
      "PROVENANCE RECORD, not a new derivation: the sub-gap sg-3844-watson-tail (a rigorous " +
      "all-orders bound on the O(e^{-4 tau}) tail of c(tau) - (c_inf + B e^{-2 tau}), left external " +
      "by imp-3844) predates two closure steps, and some consumers -- notably imp-3867's own " +
      "honest-caveat text -- still describe it as fully open." +
      "\n\nimp-3866 first showed the tail splits into three STANDARD analytic-Watson remainders: " +
      "(R1) the dropped n>=2 kernel tail (super-exponentially small, measured as machine zero), " +
      "(R2) a Watson endpoint remainder controlled by radius-1 Cauchy estimates of the real-analytic " +
      "amplitude phi(t) = e^{-pi(1+t)} acc(s(t)), giving bracket(tau) = 2 pi - 3 e^{-2 tau} + rho(tau) " +
      "with |rho(tau)| <= K0 e^{-4 tau}, and (R3) the elementary ln(1+x) propagation remainder -- " +
      "leaving only ONE external piece, renamed sg-3866-watson-majorant-constant (a single explicit K0)." +
      "\n\nimp-3892 then PINNED that residual constant in closed form: K_lead = 2 phi'(0)/Phi(0) = " +
      "-2 pi + acc'(0)/(2 acc(0)) = -3.4120570431 (an exact finite sum over the NPHI=10 kernel), with " +
      "the next Watson coefficient K6 = +2.1066020628 reproducing imp-3866's measured rho/e^{-4 tau} " +
      "ratios to ~3e-5. Because rho is a negative constant plus a shrinking positive correction, " +
      "|rho(tau)| <= K0 e^{-4 tau} holds on tau >= 2 with the single explicit majorant K0 = 3.46." +
      "\n\nVERDICT: sg-3844-watson-tail is CERTIFIED-MODULO-ONE-EXPLICIT-CONSTANT, not an external " +
      "unknown -- the chain imp-3844 (leading terms) -> imp-3866 (reduction to three standard " +
      "estimates) -> imp-3892 (closed pin of the remaining K0) closes the tail bound end to end. " +
      "Consumers still citing sg-3844-watson-tail as open (e.g. imp-3867's honest-caveat text, " +
      "written before imp-3866/imp-3892 existed) describe a state that no longer holds; this note " +
      "is a status correction, not an edit to those modules." +
      "\n\nHONEST SCOPE: a provenance/status note only. It establishes NO operator positivity; the " +
      "off-diagonal endpoint-Hankel obstruction K_a >= 0 (imp-3066) is UNTOUCHED, the NPHI=10 kernel " +
      "truncation remains an upstream modeling choice, and this is a diagnostic-limit asymptotic, not " +
      "a theorem about zeros. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.",
    firstUsed: "imp-33223 (recording that imp-3866's three-remainder reduction plus imp-3892's closed pin K0=3.46 together certify sg-3844-watson-tail, and that consumers citing it as open predate that chain), 2026",
    relatedTerms: [
      "imp-3844 A-weight correction limit closed form: c_inf, B (imp-3844)",
      "imp-3866 Watson-tail bound assessment: three-remainder reduction of sg-3844-watson-tail (imp-3866)",
      "imp-3892 Watson majorant constant: closed pin K_lead=-3.4120570431, K0=3.46 (imp-3892)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3892 pinned Watson majorant constant: K0 = 2 phi'(0)/Phi(0), closing |rho(tau)| <= K0 e^{-4 tau}",
    category: "numerical",
    definition:
      "imp-3866's three-remainder reduction of sg-3844-watson-tail left exactly ONE piece external, " +
      "renamed sg-3866-watson-majorant-constant: a single explicit constant K0 in the bracket " +
      "remainder bound bracket(tau) = 2 pi - 3 e^{-2 tau} + rho(tau), |rho(tau)| <= K0 e^{-4 tau}. " +
      "imp-3892 PINS that constant in closed form by applying Watson's lemma to the two amplitudes " +
      "of the underlying real-analytic kernel phi(t) = e^{-pi(1+t)} acc(s(t))." +
      "\n\nThe leading Watson-bracket coefficient is K_lead = 2 phi'(0)/Phi(0) = " +
      "-2 pi + acc'(0)/(2 acc(0)) = -3.4120570431, an exact finite sum over the NPHI=10 kernel " +
      "truncation (with phi'(0) = e^{-pi}[-pi acc(0) + (1/4) acc'(0)]). The next-order coefficient " +
      "K6 = -(3/Phi(0)) psi'(0)/pi = +2.1066020628 (psi'(0) = phi'(0) - phi(0)/2) gives the closed " +
      "two-term model rho e^{4 tau} = K_lead + K6 e^{-2 tau}, which reproduces imp-3866's measured " +
      "rho/e^{-4 tau} ratios ~-3.406 at tau=2.5 and tau=3 to ~3e-5 -- confirming K_lead and K6 are " +
      "DERIVED, not fitted." +
      "\n\nBecause rho is a negative constant plus a shrinking positive correction, " +
      "|rho e^{4 tau}| <= |K_lead| + |K6| e^{-4} = 3.451 on tau >= 2, giving the single explicit " +
      "majorant K0 = 3.46 that closes the inequality sg-3866-watson-majorant-constant asked for." +
      "\n\nVERDICT: with K0 pinned, the imp-3866 reduction of sg-3844-watson-tail is " +
      "CLOSED-MODULO-STANDARD-WATSON-ESTIMATES rather than dependent on an external unknown." +
      "\n\nHONEST SCOPE: a constant-pin/asymptotic result only. Operator positivity -- the " +
      "off-diagonal endpoint-Hankel obstruction K_a >= 0 (imp-3066) -- is UNTOUCHED, the NPHI=10 " +
      "kernel truncation remains an upstream modeling choice, and this is necessary-but-not-sufficient " +
      "for RH. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3892 (deriving the closed leading Watson coefficient K_lead=2 phi'(0)/Phi(0)=-3.4120570431 and certified majorant K0=3.46 closing |rho(tau)|<=K0 e^{-4tau}), 2026",
    relatedTerms: [
      "imp-3866 Watson-tail bound assessment: three-remainder reduction of sg-3844-watson-tail (imp-3866)",
      "imp-33223 honest-status note: sg-3844-watson-tail is now REDUCED-AND-PINNED (imp-3866 -> imp-3892), not open",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3849 inner-quadrature-converged exact-saddle ratio: crossing moves to n*=215.231, well deepens ~5x to r_min=-5.845e-4 at n~500",
    category: "numerical",
    definition:
      "imp-3731 pinned the exact-saddle ratio R_n = |D_n|/|D_n^saddle| crossing at n* = 225.5427323 " +
      "\"grid-stable to ~1e-9\" and a shallow sub-unity well (r_min = -1.12857e-4 at n = 276), but its " +
      "grid-convergence self-check varied only the OUTER moment-panel count (NM: 3200 -> 6400) while " +
      "holding the INNER autocorrelation A(tau) quadrature FIXED at [0,7] with 1200 Simpson panels. " +
      "imp-3735 had already shown that at large n it is the INNER resolution, not the outer moment " +
      "grid, that limits the moment-ratio correction eps_n -- so imp-3731's \"~1e-9\" stability was " +
      "measured along the axis the answer is insensitive to." +
      "\n\nimp-3849 CONVERGED the inner A(tau) quadrature (4800 panels on [0,2], cross-checked against " +
      "7200, agreeing to ~8e-8) while reproducing the imp-3731 coarse-inner configuration alongside it " +
      "as an artifact probe (recovering imp-3731's r_226 = -2.314e-6 exactly). The converged inner " +
      "quadrature drives r_226 to -8.738e-5, a ~38x larger magnitude, which moves the crossing DOWN " +
      "~10 rungs to n* = 215.231 (r_215 = +2.030e-6, r_216 = -6.749e-6) -- so the imp-3731 crossing " +
      "was an inner-resolution artifact, not a converged value. The sub-unity well is also ~5x DEEPER " +
      "and ~2x further out: it bottoms at r_min = -5.845e-4 (R_n ~ 0.99942) on a broad plateau near " +
      "n = 500 (r_490 = -5.843e-4, r_500 = -5.845e-4, r_510 = -5.843e-4), not the imp-3731 r_min = " +
      "-1.13e-4 at n = 276. Past the well, R_n climbs slowly back toward 1 from below (r_500 = " +
      "-5.845e-4 -> r_620 = -5.686e-4), and the underlying eps_n = Q_n/tau*(n)^2 - 1 correction (imp-" +
      "3735) is shown to CHANGE SIGN near n = 149 (eps_148 = +7.60e-6, eps_149 = -3.46e-6), going " +
      "negative out to eps_300 = -5.05e-4 -- the eps-weighted step in D_n that drives the deeper " +
      "converged well. Cross-checks R_3 = 3.64422 (imp-3670/imp-3685), R_40 = 1.02440 (imp-3685 baked " +
      "1.02438), eps_40 = 9.994e-3 (imp-3735 converged 9.995e-3) tie the ladder to certified modules." +
      "\n\nHONEST SCOPE: measurement only, at the RH-equivalent scale class -- pins the CONVERGED shape " +
      "of a moment-ratio convergence diagnostic and establishes no operator positivity. The reported " +
      "values are grid-CONVERGENCE stable (inner 4800 vs 7200 panels agree to ~8e-8), but the shared " +
      "finite NPHI=10 kernel truncation and Simpson order remain a residual floor of this model, not a " +
      "certified error bound. imp-3731 assertions are LEFT INTACT: this is a corrected re-reading at " +
      "higher inner resolution, alongside it, not an edit of it. Mass-feasibility is necessary-but-not-" +
      "sufficient; the off-diagonal endpoint-Hankel obstruction K_a >= 0 (imp-3066) is UNTOUCHED. No RH " +
      "verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3849 (converging the inner A(tau) quadrature of the imp-3731 exact-saddle ratio measurement, moving the crossing to n*=215.231, deepening the well ~5x to r_min=-5.845e-4 at n~500, and locating the eps_n sign-change at n~149), 2026",
    relatedTerms: [
      "imp-3713 exact-saddle ratio finite-n overshoot: R_n crosses 1 and dips BELOW at n* ~ 226 (imp-3713)",
      "imp-3731 Neumaier-compensated crossing pin n*=225.5427323 and shallow-well recovery (imp-3731)",
      "imp-3735 moment-ratio correction eps_n = Q_n/tau*(n)^2 - 1: Laplace-variance decay order (imp-3735)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3848 next-order saddle correction: f_ppp(tau*) sign change drives L_n through 1, no asymptote",
    category: "numerical",
    definition:
      "The imp-3735 reduced moment-ratio drift factor L_n = eps_n * n(1+4 tau*) crosses 1 across " +
      "n=10..80 (2.064 -> 0.567) even though the leading Laplace-variance order pins L_n -> 1 at " +
      "leading order. imp-3848 computes the NEXT-ORDER saddle corrections that explain this drift. " +
      "Writing the moment ratio Q_n = <tau^2> under the density proportional to exp(f(tau)), " +
      "f = n ln tau + ln A(tau), with the imp-3665 model ln A ~ -pi e^{4 tau} and the saddle relation " +
      "4 pi e^{4 tau*} = n/tau*, the closed-form third and fourth tau-derivatives at the saddle are " +
      "f_ppp(tau*) = (2n/tau*^3)(1 - 8 tau*^2) and f_pppp(tau*) = -6n/tau*^4 - 64 n/tau*. The " +
      "skewness/kurtosis expansion gives L_n = 1 + C1 + C2 + C3, C1 = f_ppp sigma^2 tau* (sigma^2 = " +
      "-1/f_pp)." +
      "\n\nf_ppp(tau*) changes sign exactly at tau* = 1/sqrt(8) ~ 0.35355 (n ~ 18): C1 is POSITIVE " +
      "below and NEGATIVE above this crossing, sending L_n through 1 in the direction imp-3735 " +
      "measured. C1 does NOT settle back to 0 as n grows -- because C1 = (f_ppp sigma^3)(tau*/sigma) " +
      "and the amplification tau*/sigma = 2 sqrt(n tau*) outpaces the shrinking dimensionless skewness " +
      "f_ppp sigma^3, C1 grows without bound toward -4 tau* (0.400 at n=10 -> -1.077 at n=80). The " +
      "corrected series therefore predicts CONTINUED DESCENT of L_n below 1, not a plateau at 1 -- " +
      "though at this single-next-order truncation the prediction OVERSHOOTS (crossing 1 near n~15 " +
      "vs the measured n~48), so the result is direction-confirming, not a quantitative pin; the " +
      "dimensionless skewness and kurtosis both stay under 0.2 throughout, so the underlying Laplace " +
      "expansion itself remains valid at these n." +
      "\n\nHONEST SCOPE: measurement/characterization of a next-order saddle correction only; " +
      "establishes no operator positivity. RH-equivalent, necessary-but-not-sufficient; the " +
      "off-diagonal endpoint-Hankel obstruction K_a >= 0 (imp-3066) is UNTOUCHED. No RH verdict, " +
      "no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3848 (deriving the closed-form third/fourth-derivative saddle corrections to the imp-3735 moment-ratio drift factor L_n, showing the f_ppp sign change at tau*=1/sqrt(8) drives the measured crossing through 1 and the reconstructed C1 grows without bound toward -4 tau*, predicting continued descent rather than a plateau), 2026",
    relatedTerms: [
      "imp-3735 moment-ratio correction eps_n = Q_n/tau*(n)^2 - 1: Laplace-variance decay order (imp-3735)",
      "imp-3646 remainder-tail moment-ratio asymptotics: LOG-DIVERGENT C_n ~ (ln n)^2/(16 n^2) (imp-3646)",
      "imp-3713 exact-saddle ratio finite-n overshoot: R_n crosses 1 at n* ~ 226 (imp-3713)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3850 dual-path -ln A(tau) reconciliation window extended to [1.5,3.0]: c(2.5)=+0.357539 and c(3.0)=+0.355480 gain an independent second-path anchor",
    category: "numerical",
    definition:
      "imp-3736 drove the uniform log-Simpson and peak-adapted graded Gauss-Legendre quadratures " +
      "for A(tau) = int_0^inf Phi(s) Phi(s + tau) ds to self-consistent convergence and reconciled " +
      "them to ~10 significant figures at tau in {1.5, 2.0}, settling that the imp-3665 baked " +
      "literals were grid-convergence-low. imp-3730 then read the subleading correction " +
      "c(tau) = -ln A(tau) - pi e^{4 tau} out to tau ~ 6, but the rungs at tau in {2.5, 3.0} -- " +
      "exactly the window beyond the uniform-grid ceiling imp-3716 stalled at -- rested on the " +
      "graded-GL path alone." +
      "\n\nimp-3850 supplies the missing second path there: pushing the uniform log-Simpson mesh to " +
      "the peak-width-dictated refinement (n=2.56e7 at tau=2.5, n=2.048e8 at tau=3.0, both " +
      "offline-verified literals) makes it climb MONOTONICALLY, with no overshoot, onto the " +
      "cutoff- and grade-invariant graded-GL limit: -ln A(2.5)=69198.540665 (uniform-Simpson " +
      "69198.540663, residual ~1.6e-6 abs) and -ln A(3.0)=511309.612538 (uniform-Simpson " +
      "511309.612537, residual ~1.1e-6 abs), rel ~1e-11 at both rungs -- the same reconciliation " +
      "quality as the imp-3736 window. The imp-3730 rungs c(2.5)=+0.357539 and c(3.0)=+0.355480 " +
      "therefore now carry an INDEPENDENT second-path anchor rather than resting on the peak-adapted " +
      "path alone, extending the reconciled window from [1.5, 2.0] to [1.5, 3.0].",
    firstUsed: "imp-3850 (extending the imp-3736 dual-path -ln A(tau) reconciliation from tau in {1.5,2.0} to tau in {2.5,3.0}, giving the imp-3730 subleading-correction rungs c(2.5) and c(3.0) an independent second-path anchor via offline-verified uniform-Simpson literals at n=2.56e7/2.048e8), 2026",
    relatedTerms: [
      "imp-3730 A-weight subleading correction limit c_inf ~ 0.3543: the third-of-a-log-unit floor above the leading pi e^{4 tau} decay (imp-3730)",
      "imp-3736 honest-status note: the imp-3665-vs-imp-3709 -ln A(2) gap is ENTIRELY grid-convergence residual, not a method disagreement (imp-3736)",
      "imp-3873 offline-literal provenance reproduction closing the imp-3850 gap via a third structurally independent quadrature (imp-3873)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3854 thetaBar double-inertness: d theta_N/d thetaBar = O((H/Dmin)^2 (1-theta_N)), so the certified K_paper elasticity is thetaBar-robust to its fifth significant figure",
    category: "numerical",
    definition:
      "imp-3728 MEASURED that moving the frozen-horizon knob thetaBar to its per-plateau " +
      "feasibility fixed point thetaBar* improves sup K_paper on [1e4,1e6] by only 1.000014x, " +
      "but left the near-insensitivity unexplained. imp-3854 DERIVES it. Differentiating the " +
      "retardation Psi_N(T) with respect to the frozen horizon T shows each active-gap term " +
      "d ln t_j/dT <= 8/smin^2, where smin is the smallest individual shrunk gap; hence " +
      "0 <= dPsi_N/dT <= (8/smin^2) Psi_N (LEMMA 3854)." +
      "\n\nChaining through T = H^2/(8 thetaBar) gives d theta_N/d thetaBar <= " +
      "(1/thetaBar^2)(H/smin)^2 (1-theta_N): a PRODUCT of two independently small factors, " +
      "the near-degeneracy ratio (H/smin)^2 (<= ~2.4e-3) and the retardation deficit " +
      "1-theta_N (<= ~2.8e-3). Since 1-theta_N is itself O((H/Dmin)^2), the horizon-sensitivity " +
      "of theta_N is O((H/Dmin)^4) -- the knob is doubly inert -- and the certified K_paper " +
      "elasticity |d ln K_paper/d thetaBar| ~= (H/smin)^2/thetaBar^2 governed by the same small " +
      "parameter that makes Psi small in the first place. The analytic prediction matches the " +
      "imp-3728 measured relative K_paper change on all 10 plateaus to within a factor in " +
      "[0.79, 1.56], and the largest feasible relative K_paper shift is 1.4e-5, so the imp-3728 " +
      "carryforward margin 8.31e4x is stable to its fifth significant figure under ANY feasible " +
      "thetaBar. Derivation-only: no new Lambda bound, imp-3066 untouched, Platt-Trudgian " +
      "Lambda <= 0.2 remains SOTA, NO QED.",
    firstUsed: "imp-3854 (deriving the closed-form horizon-sensitivity bound dPsi_N/dT <= (8/smin^2) Psi_N and confirming the resulting O((H/Dmin)^2) prediction against the imp-3728 measured thetaBar-insensitivity), 2026",
    relatedTerms: [
      "imp-3728 fmb thetaBar-sensitivity measurement: moving thetaBar to its feasibility fixed point improves sup K_paper by only 1.000014x (imp-3728)",
      "imp-3847 near-degeneracy margin Dmin/H proxy underlying the (H/Dmin)^2 small parameter (imp-3847)",
      "imp-3725 F_mb plateau-domination bootstrap lemma this sensitivity bound is derived on top of (imp-3725)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-33225 per-gap eps'_l refinement: the imp-3933 field-robust certificate decouples so ONLY the record-pair value eps'_a binds, removing the window-top-edge O(10) eps' sensitivity",
    category: "proof",
    definition:
      "imp-3933 carried a SINGLE uniform eps' through the imp-3725 plateau-domination proof for " +
      "the perturbed-field class dx_k/dt = F_k^Dyson + e_k, |e_{l+1}-e_l| <= eps'_l g_l, and " +
      "certified all 10 plateaus of [1e4,1e6] up to eps'=20 (epsMax floor 22.9) -- but the " +
      "window-top-edge gaps, which need eps'_l = O(10), cleared the uniform certificate only " +
      "marginally. imp-33225 formalises and re-runs the PER-GAP variant imp-3933 named as the " +
      "recommended closure route (proof verbatim identical). Reading the derivation term by term, " +
      "eps' enters in exactly two places and they DECOUPLE by gap index: (A) the RECORD-PAIR " +
      "direct term 2 g_a (e_{a+1}-e_a) <= 2 eps'_a H^2 sees ONLY the record-pair value eps'_a; " +
      "(B) every OTHER gap enters only through its shrunk comparison gap s_l(T,eps'_l) inside the " +
      "retardation sum Psi = 4 H^2 SUM 1/D_j^2, which is near-inert because the horizon T = " +
      "H^2/(8 thetaBar) ~ 1e-4 makes 2 eps'_l T << 1 for eps'_l = O(10). Hence " +
      "theta({eps'_l}) = 1 - (Psi(T,{eps'_l}) + 2 eps'_a H^2)/8 carries eps'_a ALONE in the " +
      "binding term; the O(10) edge values live only inside near-inert Psi." +
      "\n\nThe offline compute (scripts/imp-33225-per-gap-eps-refinement-compute.mjs) certifies this " +
      "CONSERVATIVELY -- it feeds EVERY non-record gap the large edge value eps'=20 inside Psi " +
      "(maximal shrink) and only the record pair the module estimate eps'_a = 1e-3 in the direct " +
      "term. All 10 plateaus certify at thetaBar=0.99 with the whole per-gap budget costing a " +
      "theta deficit of at most 1.83e-5 versus the pristine eps'=0 base (vs the uniform eps'=20 " +
      "deficit ~6.3e-3, so ~340x less binding). The record-pair budget eps'_a_max ranges 22.9 " +
      "(plateau 1) up to 1216.7 (plateau 9), a >=2.29e4x headroom over the estimated eps'_a; the " +
      "far-gap Psi ceiling eps'Edge_ceil (largest edge value still certifying, Psi non-degenerate) " +
      "ranges 3.99e3 up to the 5e5 scan cap, a >=399x headroom over the O(10) window-edge " +
      "requirement. The window-top-edge O(10) eps' sensitivity is thus removed from the binding " +
      "constraint entirely: it can no longer degrade the certificate short of ~400x its actual " +
      "size. The ACTUAL per-gap eps'_l values (O(1e-3) near record pair, O(10) at edge) still await " +
      "the deterministic field-error certificate imp-3933-sub-eps-certificate; no new Lambda bound, " +
      "Platt-Trudgian Lambda <= 0.2 remains SOTA, NO QED.",
    firstUsed: "imp-33225 (formalising and re-certifying the per-gap eps'_l variant of the imp-3933 field-robust bootstrap: the record-pair direct term and the near-inert retardation sum Psi decouple, so only eps'_a binds; all 10 plateaus certify with record-pair budget >=22.9 and far-gap ceiling >=3.99e3), 2026",
    relatedTerms: [
      "imp-3933 field-channel reroute: the C_Lip/C_H wall is bypassed in the vector-FIELD-error channel with deterministic N-uniform transfer modulus 3H^4/64 (imp-3933)",
      "imp-3933-sub-eps-certificate: the still-open deterministic eps'_true derivation supplying the per-gap eps'_l values (imp-3933)",
      "imp-3725 F_mb plateau-domination bootstrap lemma the field-robust and per-gap variants are built on top of (imp-3725)",
      "imp-3854 thetaBar double-inertness: the same tiny-horizon smallness that makes Psi near-inert in eps'_l (imp-3854)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3933 eps'-field-robust plateau-domination bootstrap: a deterministic N-uniform collision-time transfer modulus in the vector-FIELD-error channel, rerouting the C_Lip breach point around the still-divergent W_1-channel",
    category: "proof",
    definition:
      "The C_Lip wall (C_H = C_shock*C_Lip/4) is PROVABLY closed in the W_1 channel " +
      "three ways (ch-wall-frontier verdicts, untouched here). imp-3933 reroutes the " +
      "perturbation CHANNEL instead: extend the imp-3725 gap-domination bootstrap from " +
      "the pure backward-Dyson field to any perturbed flow dx_k/dt = F_k^Dyson + e_k " +
      "satisfying the field-Lipschitz local-difference bound |e_{l+1}-e_l| <= eps' g_l " +
      "on every adjacent gap, SAME zero-table initial data as the unperturbed model. " +
      "Carrying eps' through the exact gap identity d(g_l^2)/dt = -8 + 4 g_l^2 " +
      "sum 1/((x_j-x_l)(x_j-x_{l+1})) + 2 g_l(e_{l+1}-e_l) gives two comparison-ODE " +
      "brackets: (LOWER) d(g^2)/dt >= -8 - 2 eps' g^2 has the exact solution " +
      "u(t) = g0^2 e^{-2 eps' t} - (4/eps')(1-e^{-2 eps' t}), strictly increasing in " +
      "g0, so t_c >= tLo(eps') = ln(1 + eps' H^2/4)/(2 eps'); (UPPER, retardation " +
      "bootstrap at thetaBar=0.99, horizon T = H^2/(8 thetaBar)) freezing the same " +
      "comparison solution at T gives t_c <= tHi(eps') = H^2/(8 theta(eps')), " +
      "theta(eps') = 1 - (Psi(T,eps') + 2 eps' H^2)/8 — all INITIAL-DATA functionals " +
      "of the zero table: no Gronwall flow-Jacobian, no W_1 modulus, no GUE/PCC input " +
      "anywhere. Any two flows in the class (the finite-N Dyson model at eps'=0 and " +
      "the true xi backward-heat-flow zero motion, once its eps'_true is certified) " +
      "share the SAME bracket from the SAME initial data, so " +
      "|t_c^true - t_c^model| <= W(eps') = tHi(eps') - tLo(eps'), with " +
      "dW/deps' ~ 3 H^4/64 matched to <0.5% on every plateau — the deterministic, " +
      "N-uniform 'C_Lip' the model-to-true transfer actually needs. Certified at " +
      "thetaBar=0.99 on all 10 H_raw plateaus of [1e4,1e6] for eps' up to 20 " +
      "(epsMax floor 22.9 at plateau 1, rising to 1216.6 at plateau 9); at eps'=1 " +
      "the full transfer width W(1) <= 5.17e-7 on every plateau — ~1.8e5x tighter " +
      "than the C_H-route W_1-Holder E_coll placeholder 0.0913 at N*=1e4." +
      "\n\nHONEST SCOPE: two sub-gaps stay OPEN and named — " +
      "imp-3933-sub-eps-certificate (a rigorous DETERMINISTIC eps'_true for the true " +
      "xi-flow vs the window-Dyson field, via mirror-zero pairing, RvM tail of " +
      "above-window zeros, and far-zero displacement control over the tiny horizon " +
      "T <= 1.8e-4; estimated O(1e-3) near the record pair but O(10) at the " +
      "window-top edge, addressed only PARTIALLY so far by imp-33224's exact " +
      "telescoping-kernel reduction and imp-33228's realised-proxy measurement, and " +
      "resolved from the BINDING-constraint side by imp-33225's per-gap decoupling) " +
      "and imp-3933-sub-bracket-rearchitecture (restate the E(N) collision-time " +
      "bridge so the model-to-true transfer routes through this field channel in " +
      "place of the C_H*W_1^{1/2} leg of E_coll — done by imp-33226, which found the " +
      "new binding leg reverts to E_trunc). The eps'=0 column reproduces the imp-3725 " +
      "enclosures exactly (cross-pinned). This is NOT a Lambda bound: the W_1-channel " +
      "C_Lip verdicts (RH-HARD-CONFIRMED) are NOT overturned, weakened, or bypassed " +
      "IN THAT CHANNEL, and Platt-Trudgian Lambda <= 0.2 REMAINS the rigorous SOTA. " +
      "NO false QED.",
    firstUsed: "imp-3933 (eps'-field-robust plateau-domination bootstrap: a deterministic N-uniform collision-time transfer modulus in the vector-field-error channel, certified on all 10 plateaus of [1e4,1e6], rerouting the C_Lip breach point around the still-divergent W_1-channel), 2026",
    relatedTerms: [
      "imp-3725 F_mb plateau-domination bootstrap lemma this bootstrap is the eps'-perturbed generalisation of (imp-3725)",
      "imp-33225 per-gap eps'_l refinement: removes the window-top-edge O(10) eps' sensitivity from the binding constraint (imp-33225)",
      "imp-3933-sub-eps-certificate: the still-open deterministic eps'_true derivation for the true xi-flow field-Lipschitz constant (imp-3933)",
      "imp-3933-sub-bracket-rearchitecture: routing the E(N) chain's model-to-true transfer through this field channel (imp-3933)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3844 closed-form derivation of the A-weight correction limit: c_inf = -ln((pi/2)Phi(0)) and the approach coefficient B = 3/(2 pi)",
    category: "proof",
    definition:
      "imp-3730 could only numerically extrapolate the subleading correction limit c_inf = " +
      "lim_{tau->inf} [-ln A(tau) - pi e^{4 tau}] (A(tau) = int_0^inf Phi(s) Phi(s+tau) ds, Phi " +
      "the NPHI=10 completed-Riemann kernel) to ~0.354291. imp-3844 DERIVES it in closed form via " +
      "a Watson/Laplace endpoint expansion at s=0. Writing Phi(u) = e^{-pi e^{4u}} acc(u) in the " +
      "imp-3709 factored-log form, every n>=2 term of acc(s+tau) carries " +
      "e^{-pi(n^2-1)e^{4(s+tau)}} <= e^{-3 pi e^{4 tau}} -> 0 super-exponentially, so only the n=1 " +
      "tail survives for tau large. The substitution t = e^{4s}-1 turns the s=0 boundary peak into " +
      "a pure e^{-T t} weight (T = pi e^{4 tau}), collapsing the tau-dependence to Watsons lemma: " +
      "A(tau) = e^{-T} (Phi(0)/4) [2 pi - 3 e^{-2 tau} + O(e^{-4 tau})]. Hence " +
      "c(tau) = -ln((pi/2) Phi(0)) + (3/(2 pi)) e^{-2 tau} + O(e^{-4 tau}), giving the CLOSED FORM " +
      "c_inf = -ln((pi/2) Phi(0)) = pi - ln(pi/2) - ln(acc0), acc0 = e^{pi} Phi(0) = " +
      "sum_{n>=1} (2 pi^2 n^4 - 3 pi n^2) e^{-pi(n^2-1)}, numerically 0.35429228409357 (matching " +
      "imp-3730s 0.354291 extrapolation), and the approach coefficient B = 3/(2 pi) = 0.477465 -- " +
      "previously only FIT by imp-3730 -- now DERIVED as the ratio of the -3 e^{-2 tau} sub-term to " +
      "the 2 pi leading term inside the bracket. The prediction c_inf + B e^{-2 tau} matches the " +
      "measured ladder to O(1e-8) at tau = 4..4.5, and the empirical step-ratio -> e^{-1} is now " +
      "explained exactly (e^{-2*0.5} = e^{-1})." +
      "\n\nHONEST SCOPE: analytic asymptotics (Watson/Laplace endpoint expansion) cross-checked " +
      "numerically, RH-equivalent, necessary-but-not-sufficient; establishes NO operator " +
      "positivity, the off-diagonal endpoint-Hankel K_a >= 0 step (imp-3066) is UNTOUCHED. Only " +
      "the leading term (c_inf) and first subleading coefficient (B) are derived and confirmed; " +
      "the all-orders O(e^{-4 tau}) tail bound is left open as sg-3844-watson-tail. This is a " +
      "derivation of a diagnostic limit, not a theorem about zeros: no RH verdict, no QED. " +
      "Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3844 (Watson/Laplace endpoint-expansion derivation of the imp-3730 A-weight correction limit c_inf and approach coefficient B in closed form, resolving them from fitted numerics to exact constants), 2026",
    relatedTerms: [
      "imp-3730 A-weight subleading correction limit c_inf ~ 0.3543: the numerical extrapolation this closed form derives exactly (imp-3730)",
      "imp-3709 peak-adapted graded Gauss-Legendre log-domain factored kernel form reused in the derivation (imp-3709)",
      "sg-3844-watson-tail: the still-open rigorous all-orders O(e^{-4 tau}) remainder bound (imp-3844)",
      "imp-3850 dual-path -ln A(tau) reconciliation extended to tau in {2.5,3.0} (imp-3850)",
      "imp-3867 independent structurally-distinct reproduction of c_inf and B via a direct completed-Riemann kernel path (imp-3867)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3867 independent reproduction of the imp-3844 A-weight closed-form constants via a structurally-distinct direct completed-Riemann kernel evaluation",
    category: "numerical",
    definition:
      "imp-3844 derived c_inf = -ln((pi/2) Phi(0)) = 0.35429228409357 and B = 3/(2 pi) = 0.477465 " +
      "through the imp-3709 FACTORED-LOG kernel form, which pulls a common e^{-pi e^{4u}} out of " +
      "every term and shifts the exponent to (n^2-1) before summing. imp-3867 checks both constants " +
      "along two STRUCTURALLY DISTINCT routes that avoid this factoring. Route (1), for c_inf: sum " +
      "the completed-Riemann kernel DIRECTLY at u=0, Phi(0) = sum_n (2 pi^2 n^4 - 3 pi n^2) " +
      "e^{-pi n^2}, with every term carrying its OWN e^{-pi n^2} weight rather than the shared " +
      "e^{-pi(n^2-1)} factor -- this reproduces Phi(0) = 0.44669690046712 to < 1e-14 of the " +
      "factored value, and an NPHI-truncation sweep (N = 1..15) shows the sum is fully converged by " +
      "N = 3, so c_inf is not an NPHI=10 artifact. Route (2), for B: integrate the imp-3844 " +
      "collapsed Laplace form A(tau) = e^{-T} int_0^inf e^{-T t} H_tau(t) dt (T = pi e^{4 tau}) with " +
      "a Gauss-LAGUERRE rule instead of the imp-3844 graded Gauss-Legendre-in-s quadrature; the " +
      "measured approach coefficient (c(tau) - c_inf)/e^{-2 tau} converges monotonically to " +
      "3/(2 pi) from above (0.4791 at tau=3 -> 0.477466 at tau=6), and the [6,7] finite difference " +
      "recovers B to < 5e-6. Both constants survive structurally distinct evaluation, confirming " +
      "the imp-3844 closed form is not a single-path numerical artifact." +
      "\n\nHONEST SCOPE: reproduction/cross-check only, RH-equivalent, necessary-but-not-sufficient. " +
      "Route (1) is a fully independent re-summation of the kernel boundary value; route (2) still " +
      "relies on the imp-3844 n=1-tail approximation and t = e^{4s}-1 substitution, and does NOT " +
      "bound the all-orders O(e^{-4 tau}) tail (sg-3844-watson-tail stays open). Establishes NO " +
      "operator positivity; the off-diagonal endpoint-Hankel K_a &gt;= 0 step (imp-3066) is " +
      "UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3867 (independent structurally-distinct reproduction of the imp-3844 A-weight closed-form constants c_inf and B via a direct completed-Riemann kernel evaluation and a Gauss-Laguerre collapsed-Laplace quadrature), 2026",
    relatedTerms: [
      "imp-3844 closed-form derivation of the A-weight correction limit: c_inf, B (imp-3844)",
      "imp-33210 direct-route reproduction extending imp-3867 from the leading c_inf to the subleading B (imp-33210)",
      "sg-3844-watson-tail: the still-open rigorous all-orders O(e^{-4 tau}) remainder bound (imp-3844)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3871 fifth/sixth-derivative saddle corrections: C4,C5 SHRINK (refuting imp-3848), and the residual L_n=1 crossing gap (n~18.4 vs n~48.6) is a MODEL-FIDELITY gap, not a truncation artifact",
    category: "numerical",
    definition:
      "imp-3848 truncated the saddle expansion of the reduced moment-ratio drift L_n = eps_n * " +
      "n(1+4 tau*) at third/fourth order (1 + C1 + C2 + C3) and found it OVERSHOOTS, crossing 1 " +
      "near n~15-17 rather than the measured n~48, conjecturing that growing higher-order Laplace " +
      "terms must partially cancel to close the gap. imp-3871 extends the closed-form derivatives " +
      "f^(k)(tau*) = n(-1)^(k-1)(k-1)!/tau*^k - 4^k P (P = pi e^{4 tau*}) to the fifth and sixth " +
      "order, giving C4 = tau* f^(5) sigma^4/4 and C5 = f^(6) sigma^6/8." +
      "\n\nTHREE findings. (1) C4, C5 SHRINK monotonically over n=10..60 (C4: 0.1307 -> 0.0007; " +
      "|C5|: 0.0169 -> 0.0002) -- REFUTING the imp-3848 growing-but-cancelling conjecture; the " +
      "saddle series is well-behaved and rapidly convergent, not a delicate cancellation. " +
      "(2) Adding C4, C5 moves the predicted crossing only from n~17.13 to n~18.34, CONVERGING " +
      "onto the fully-resummed model-integrand crossing n~18.38 obtained by exact saddle-centred " +
      "Simpson quadrature of tau^n exp(-pi e^{4 tau}) (grid-converged to ~1e-4; extended series " +
      "and exact model agree to ~4e-4 at n=18) -- the series has effectively converged by five " +
      "terms, leaving no room for higher terms to move the crossing further. (3) Since even the " +
      "EXACT model resummation crosses 1 near n~18.4 while the MEASURED L_n (built from the real " +
      "Phi-autocorrelation A(tau), reproducing the imp-3735 anchors) crosses near n~48.6, the " +
      "~30-unit gap is a MODEL-FIDELITY gap between the imp-3665 super-exponential surrogate " +
      "A(tau) ~ exp(-pi e^{4 tau}) and the real A(tau) -- NOT a truncation-order artifact. No " +
      "number of saddle terms can repair a model mismatch; the honest next step is a better " +
      "A(tau) surrogate, not more terms (imp-3893 later quantified this gap moment-by-moment as " +
      "a sub-3% multiplicative tilt T_n).",
    firstUsed: "imp-3871 (extending the imp-3848 saddle expansion to fifth/sixth-derivative corrections C4,C5, showing they shrink rather than grow, converge the truncated series onto the exact model-integrand crossing n~18.4, and localizing the remaining gap to the measured n~48.6 as a model-fidelity mismatch rather than a truncation artifact), 2026",
    relatedTerms: [
      "imp-3848 next-order saddle correction: f_ppp(tau*) sign change drives L_n through 1, no asymptote (imp-3848)",
      "imp-3735 moment-ratio correction eps_n = Q_n/tau*(n)^2 - 1: Laplace-variance decay order (imp-3735)",
      "imp-3893 quantifies the imp-3871 model-fidelity gap as a sub-3% moment-ratio tilt T_n (imp-3893)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3870 smin/Dmin slack REFUTATION: imp-3854's 'nearest zero is also the tightest gap, so smin~=Dmin' note is FALSE",
    category: "numerical",
    definition:
      "imp-3854 STEP-4 confirmed its O((H/Dmin)^2) thetaBar-elasticity prediction " +
      "against imp-3728 to a factor predictionRatio in [0.79, 1.56], crediting the " +
      "residual to smin/Dmin < 1 slack on the note that on the imp-3725 plateaus " +
      "the nearest zero is also the tightest individual shrunk gap, so smin ~= " +
      "Dmin. imp-3870 scanned the FULL endN system on all 10 plateaus for the " +
      "smallest individual shrunk gap smin and its offset from the record pair, " +
      "and REFUTES that note outright." +
      "\n\nTWO measurements. (1) smin/Dmin is UNIFORMLY TINY -- 0.0053 (plateau 9) " +
      "to 0.0224 (plateau 4), so (Dmin/smin)^2 ranges 1987x to 35493x; smin is " +
      "NOWHERE ~= Dmin. (2) The tightest individual gap ALWAYS sits FAR from the " +
      "record pair -- offsets from -259521 (plateau 7) to +418135 (plateau 9), " +
      "NEVER adjacent (|offset| = 1) on any plateau: the nearest zero is the " +
      "LARGEST-Dmin direction, and the tightest gap is a distant tail gap with " +
      "negligible 1/D_j^2 weight. Substituting the rigorous (H/smin)^2 for the " +
      "imp-3854 (H/Dmin)^2 would inflate the predicted relative K change by " +
      "(Dmin/smin)^2, so the smin/Dmin-slack hypothesis overshoots the measured " +
      "near-1 predictionRatio by 3-4 orders of magnitude, and smin/Dmin << 1 " +
      "holds on every plateau regardless of predictionRatio sign -- so smin/Dmin " +
      "slack does not correlate with predictionRatio and cannot be the residual " +
      "mechanism. CORRECTED PICTURE: the elasticity is dominated by the nearest-" +
      "neighbour Psi term, whose path-local smin equals Dmin, so (H/Dmin)^2 is " +
      "the sharp effective constant; the global (H/smin)^2 bound is a valid but " +
      "hugely loose over-bound charging every path with the far tail's tiny gap " +
      "(imp-3898 later derived the path-local majorant behind this). This " +
      "corrects an imp-3854 CHARACTERIZATION, not an inequality: LEMMA 3854 " +
      "(0 <= dPsi_N/dT <= (8/smin^2)Psi_N) stays a valid over-bound, and imp-3894 " +
      "went on to show the residual is ~99% the (H/Dmin)^2 proxy-accuracy factor " +
      "plus only a uniform ~1% endpoint-concavity slack. Measurement only; " +
      "imp-3066 untouched; Platt-Trudgian Lambda<=0.2 remains SOTA; NO QED.",
    firstUsed: "imp-3870 (scanning all 10 imp-3725 plateaus for the smallest individual shrunk gap smin and its offset from the record pair, refuting the imp-3854 smin~=Dmin note and relocating its predictionRatio residual to endpoint-concavity/dominant-term structure), 2026",
    relatedTerms: [
      "imp-3854 thetaBar double-inertness: d theta_N/d thetaBar = O((H/Dmin)^2 (1-theta_N)), so the certified K_paper elasticity is thetaBar-robust to its fifth significant figure (imp-3854)",
      "imp-3898 path-local horizon-elasticity bound sharpening the global (8/smin^2) ceiling via the nearest-cumulative distance Dmin (imp-3898)",
      "imp-3894 decomposes the imp-3854 predictionRatio residual into a ~99% (H/Dmin)^2 proxy-accuracy factor and a uniform ~1% endpoint-concavity slack (imp-3894)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3873 three-path -ln A(tau) provenance: uniform-Simpson, graded Gauss-Legendre and peak-scaled substitution-Simpson all land on -ln A(2.5)=69198.540665 and -ln A(3.0)=511309.612538",
    category: "numerical",
    definition:
      "imp-3850 extended the imp-3736 uniform-log-Simpson-vs-graded-Gauss-Legendre reconciliation of " +
      "A(tau) = int_0^inf Phi(s) Phi(s+tau) ds to tau in {2.5, 3.0}, but its uniform-Simpson anchors " +
      "there (-ln A(2.5)=69198.54066317 at n=2.56e7, -ln A(3.0)=511309.61253717 at n=2.048e8) were " +
      "OFFLINE-VERIFIED LITERALS, not self-computing at import: the near-s=0 peak width " +
      "1/(4 pi e^{4 tau}) collapses to ~5e-6 / ~6e-7, so a uniform [0,12] mesh needs those huge n " +
      "to seat enough nodes under the peak." +
      "\n\nimp-3873 closes that provenance gap with a THIRD, structurally independent, " +
      "SELF-COMPUTING quadrature: a peak-scaled substitution s = sigma*x, sigma = 1/(4 pi e^{4 tau}) " +
      "the analytic peak width, so A(tau) = sigma * int_0^Xmax g(sigma x) dx and a uniform mesh in x " +
      "resolves the rescaled O(1)-wide peak with only n<=8000 nodes -- neither the graded-GL " +
      "power-panel rule nor the uniform-[0,12] mesh. It climbs MONOTONICALLY from below (n=500 gap " +
      "~-2.3e-7 -> n=8000 gap ~-1.5e-11) onto the graded-GL limit, agreeing with it to <1e-9 " +
      "absolute and with the offline uniform-Simpson literals to within their documented ~1e-6 " +
      "absolute / ~1e-11 relative residual, and is domain-invariant (Xmax in {40,80,120} agree " +
      "<1e-9). All three structurally distinct paths -- uniform-Simpson (n=2.56e7/2.048e8), graded " +
      "Gauss-Legendre, and peak-scaled substitution-Simpson (n<=8000) -- now land on the same " +
      "-ln A(2.5)=69198.540665 and -ln A(3.0)=511309.612538, confirming the uniform-mesh shortfall " +
      "was pure under-resolution of the collapsing peak, not bias." +
      "\n\nACCURACY/PROVENANCE REPRODUCTION only, RH-equivalent, necessary-but-not-sufficient; the " +
      "off-diagonal endpoint-Hankel obstruction K_a >= 0 (imp-3066) is UNTOUCHED. No RH verdict, " +
      "no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3873 (closing the imp-3850 offline-verified-literal provenance gap by reproducing its uniform-Simpson anchors at tau in {2.5,3.0} with a third, structurally independent, self-computing peak-scaled substitution Simpson, converging all three paths onto -ln A(2.5)=69198.540665 and -ln A(3.0)=511309.612538), 2026",
    relatedTerms: [
      "imp-3850 dual-path -ln A(tau) reconciliation window extended to [1.5,3.0]: c(2.5)=+0.357539 and c(3.0)=+0.355480 gain an independent second-path anchor (imp-3850)",
      "imp-3736 honest-status note: the imp-3665-vs-imp-3709 -ln A(2) gap is ENTIRELY grid-convergence residual, not a method disagreement (imp-3736)",
      "imp-3730 A-weight subleading correction limit c_inf ~ 0.3543: the third-of-a-log-unit floor above the leading pi e^{4 tau} decay (imp-3730)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3866 Watson-tail reducibility: sg-3844-watson-tail splits into three standard remainders (R1)+(R2)+(R3)",
    category: "numerical",
    definition:
      "imp-3844 derived the LEADING Watson terms of the A-weight correction c(tau) - (c_inf + " +
      "B e^{-2 tau}) but left the rigorous all-orders O(e^{-4 tau}) tail bound external, named " +
      "sg-3844-watson-tail. This module shows the tail is REDUCIBLE, not an unknown: it splits into " +
      "three standard analytic-Watson remainder sources." +
      "\n\n(R1) DROPPED n>=2 TAIL: every n>=2 term of the shifted kernel Phi(s+tau) carries relative " +
      "size e^{-2T} (T = pi e^{4 tau}) against the leading n=1 term -- super-exponentially small, " +
      "measured as machine zero (< 1e-12) across the clean window tau in {2.5, 3, 3.5}." +
      "\n\n(R2) WATSON ENDPOINT REMAINDER: the slow amplitude phi(t) = e^{-pi(1+t)} acc(s(t)), " +
      "s(t) = (1/4) ln(1+t), is real-analytic on (-1, inf) with its nearest singularity at the " +
      "branch point t=-1, giving radius-1 Cauchy estimates |phi^(N)(0)/N!| <= M(r)/r^N (r<1) plus " +
      "e^{-pi t} far-tail decay. A split int_0^delta + int_delta^inf then yields bracket(tau) = " +
      "2 pi - 3 e^{-2 tau} + rho(tau) with |rho(tau)| <= K0 e^{-4 tau}. Measured rho(tau)/e^{-4 tau} " +
      "sits at a tau-independent constant ~ -3.406, confirming the remainder is genuinely O(e^{-4 tau})." +
      "\n\n(R3) THE -ln PROPAGATION: c(tau) = -ln((pi/2) Phi(0)) - ln(1+x), x = -(3/(2 pi)) e^{-2 tau} " +
      "+ rho/(2 pi); the elementary remainder |ln(1+x) - x| <= x^2/(2(1-|x|)) turns (R2) into " +
      "c(tau) - (c_inf + B e^{-2 tau}) = -rho/(2 pi) + (9/(8 pi^2)) e^{-4 tau} + O(e^{-6 tau}). Measured " +
      "[c(tau) - (c_inf + B e^{-2 tau})]/e^{-4 tau} ~ 0.657 matches this closed prediction to " +
      "O(e^{-2 tau}), direct evidence the derived order and constant are correct, not fitted." +
      "\n\nWHAT STAYS EXTERNAL: only the single explicit numeric K0 -- the radius-1 Cauchy majorant " +
      "M(r) at an optimised r<1 combined with the int_delta^inf split constant -- renamed " +
      "sg-3866-watson-majorant-constant. That is a finite majorant computation, not a missing " +
      "structural idea; imp-3892 later pinned it in closed form (K0 = 3.46)." +
      "\n\nHONEST SCOPE: an assessment with numerical corroboration, not a proof; mass-feasibility is " +
      "necessary-but-not-sufficient and the operator-level positivity obstruction K_a >= 0 " +
      "(imp-3066) is UNTOUCHED. NPHI=10 kernel truncation is an upstream modeling choice. No RH " +
      "verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3866 (assessing whether sg-3844-watson-tail is certifiable, and reducing it to three standard Watson-lemma remainder estimates corroborated numerically on the clean tau in {2.5,3,3.5} window), 2026",
    relatedTerms: [
      "imp-3844 A-weight correction limit closed form: c_inf, B (imp-3844)",
      "imp-33223 honest-status note: sg-3844-watson-tail is now REDUCED-AND-PINNED (imp-3866 -> imp-3892), not open",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3893 moment-fidelity tilt T_n = Q_n^true/Q_n^model: a sub-3% multiplicative tilt leveraged into the additive drift offset delta_n that closes the imp-3871 model-fidelity gap",
    category: "numerical",
    definition:
      "imp-3871 localized the ~30-unit L_n=1 crossing gap (surrogate n~18.4 vs measured n~48.6) " +
      "as a MODEL-FIDELITY mismatch between the imp-3665 super-exponential surrogate weight " +
      "A(tau) ~ exp(-pi e^{4 tau}) and the real Phi-autocorrelation A(tau), but never quantified " +
      "how the two weightings differ moment-by-moment. imp-3893 does exactly that, defining the " +
      "moment-ratio TILT T_n = Q_n^true/Q_n^model = (M_(n+2)^true/M_n^true)/(M_(n+2)^model/M_n^model)." +
      "\n\nTHREE findings. (1) The weighting discrepancy is a SUB-3% multiplicative tilt that SHRINKS " +
      "monotonically: T_n runs from 1.0313 at n=10 down to 1.0023 at n=80 -- the true and surrogate " +
      "moment ratios Q_n agree to better than 3% everywhere. (2) That tiny tilt is LEVERAGED by the " +
      "eps_n = Q_n/tau*^2 - 1 near-cancellation (a difference of two nearly-equal quantities) into an " +
      "additive drift offset delta_n = (T_n - 1) n(1+4 tau*) ~ 0.65-0.71, which supplies 94% (n=10) " +
      "rising to 99.8% (n=50) of the entire L_n^true - L_n^model discrepancy. (3) That ~0.7 offset " +
      "shifts the L_n=1 crossing by the full ~30 units, from the surrogate n~18.38 to the measured " +
      "n~48.58, reproducing the imp-3871 anchors exactly. Since delta_n is a property of the WEIGHT " +
      "(true A vs surrogate), not of the saddle expansion order, no number of Laplace terms can " +
      "produce it -- confirming and quantifying imp-3871." +
      "\n\nHONEST SCOPE: measurement/characterization only, RH-equivalent scale class; establishes NO " +
      "operator positivity. Mass-feasibility is necessary-but-not-sufficient; the operator-level " +
      "K_a >= 0 sign-positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian " +
      "Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3893 (quantifying the imp-3871 model-fidelity gap moment-by-moment as a sub-3% multiplicative moment-ratio tilt T_n leveraged by the eps_n near-cancellation into an additive drift offset that supplies 94-99.8% of the crossing gap and moves the L_n=1 crossing from n~18.4 to n~48.6), 2026",
    relatedTerms: [
      "imp-3871 fifth/sixth-derivative saddle corrections: C4,C5 SHRINK (refuting imp-3848), and the residual L_n=1 crossing gap (n~18.4 vs n~48.6) is a MODEL-FIDELITY gap, not a truncation artifact (imp-3871)",
      "imp-3735 moment-ratio correction eps_n = Q_n/tau*(n)^2 - 1: Laplace-variance decay order (imp-3735)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3894 predictionRatio decomposition: concavityFactor x proxyAccuracyFactor, closing the imp-3870-sub-concavity-fit sub-gap",
    category: "numerical",
    definition:
      "imp-3870 refuted the imp-3854 smin/Dmin attribution and relocated the " +
      "predictionRatio residual (measured in [0.79, 1.56] across the 10 imp-3725 " +
      "plateaus) to 'endpoint concavity + dominant-term structure', but left it a " +
      "characterization rather than a quantitative model (the named-open sub-gap " +
      "imp-3870-sub-concavity-fit). imp-3894 directly MEASURES both pieces and " +
      "decomposes predictionRatio EXACTLY as concavityFactor * proxyAccuracyFactor." +
      "\n\nconcavityFactor = deltaLnFmb / (eExactLeft * excursion) is the ratio of " +
      "the EXACT finite log change in F_mb over the feasible window to the left-" +
      "endpoint linear estimate; it is 0.9901-0.9928 on ALL 10 plateaus (<=1, since " +
      "theta_N is concave), a UNIFORM one-sided downward slack of at most ~1% -- " +
      "real, but an order of magnitude too small to be the [0.79,1.56] residual. " +
      "proxyAccuracyFactor = eExactLeft / kElasticityPerUnit compares the EXACT " +
      "left-endpoint elasticity to the (H/Dmin)^2 proxy imp-3854 used; it straddles " +
      "1 (0.798-1.602) and its sign matches sign(predictionRatio-1) on EVERY " +
      "plateau. So the residual's SIGN and nearly all of its magnitude are carried " +
      "by dominant-term proxy accuracy (imp-3870's other named driver), not by " +
      "concavity (which never flips sign) and not by smin/Dmin (imp-3870's " +
      "refuted hypothesis). reconstructed = concavityFactor * proxyAccuracyFactor " +
      "reproduces the imp-3854 predictionRatio on every plateau to within imp-3728 " +
      "improveFactor rounding. Measurement only; closes imp-3870-sub-concavity-fit " +
      "by decomposition, not elimination; no imp-3854 inequality is touched; " +
      "imp-3066 untouched; Platt-Trudgian Lambda<=0.2 remains SOTA; NO QED.",
    firstUsed: "imp-3894 (directly measuring the endpoint-concavity slack per imp-3725 plateau and decomposing the imp-3854/imp-3870 predictionRatio residual into concavityFactor x proxyAccuracyFactor), 2026",
    relatedTerms: [
      "imp-3870 smin/Dmin slack REFUTATION: imp-3854's 'nearest zero is also the tightest gap, so smin~=Dmin' note is FALSE (imp-3870)",
      "imp-3854 thetaBar double-inertness: d theta_N/d thetaBar = O((H/Dmin)^2 (1-theta_N)), so the certified K_paper elasticity is thetaBar-robust to its fifth significant figure (imp-3854)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3895 three-solver quadrature cross-confirmation: composite Simpson, 5-point Gauss-Legendre and Clenshaw-Curtis agree on the exact-saddle crossing n*=215.23",
    category: "numerical",
    definition:
      "imp-3849 located the exact-saddle ratio ladder R_n=|D_n|/|D_n^saddle| crossing " +
      "unity at n*=215.231 using composite Neumaier-compensated Simpson (order-4 " +
      "Newton-Cotes, equispaced nodes). imp-3868 reproduced it with composite 5-point " +
      "Gauss-Legendre (degree-9 exact, interior Gauss abscissae, O(h^10)) -- a different " +
      "order and node set. imp-3895 adds a THIRD, structurally distinct rule: composite " +
      "Clenshaw-Curtis, whose Chebyshev-extrema nodes cluster toward the panel ends " +
      "(unlike both prior rules) and whose error is governed by Chebyshev-coefficient " +
      "decay rather than a single O(h^p) Taylor exponent. The CC weights are " +
      "self-computed at load time (not transcribed) and validated in-module: monomial " +
      "exactness x^p, p=0..8, to <1e-13 and weight sum exactly 2." +
      "\n\nThe same NPHI=10 de Bruijn-Newman kernel and the same D_n/Q_n/saddle algebra " +
      "run through Clenshaw-Curtis give crossing n*=215.23246 (imp-3868 GL: 215.23246, " +
      "agreeing to ~6e-8 of a rung; imp-3849 Simpson: 215.231), r_226=-8.73698e-5 " +
      "(agreeing with GL to ~8e-13), the eps_n sign-change at n=149, and the well " +
      "minimum r_min=-5.844e-4 at n=500. Across all rungs the three rules agree to " +
      "~1e-6 (CC-vs-GL r_226 to ~1e-12) -- far below the ~6.7e-6-per-rung crossing " +
      "feature and the ~5.8e-4 well -- and the CC result is itself node-converged to " +
      "~4e-10 (360/240 vs 480/360 panels). Since Simpson (equispaced Newton-Cotes), " +
      "Gauss-Legendre (interior Gauss abscissae) and Clenshaw-Curtis (clustered " +
      "Chebyshev extrema) share no node placement, weight pattern or error mechanism, " +
      "the crossing cannot be an artifact of any single rule family. This also confirms " +
      "the imp-3731 inner=1200 crossing at 225.54 (r_226=-2.314e-6, ~38x smaller) was an " +
      "inner-A(tau)-quadrature-RESOLUTION artifact, independent of rule family." +
      "\n\nHONEST SCOPE: measurement/characterization only, RH-equivalent scale class; " +
      "retires the quadrature-order-artifact worry, not the shared NPHI=10 " +
      "kernel-truncation floor -- all three solvers share that truncation, so this " +
      "pins the crossing to the truncated-kernel model, not to a certified error bound. " +
      "Mass-feasibility is necessary-but-not-sufficient; the operator-level K_a>=0 " +
      "sign-positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian " +
      "Lambda<=0.2 remains the rigorous SOTA. imp-3849, imp-3868 and imp-3731 " +
      "assertions are LEFT INTACT.",
    firstUsed: "imp-3895 (re-deriving the imp-3849/imp-3868 exact-saddle crossing and eps_n sign-change through a third, structurally-distinct quadrature rule family -- composite Clenshaw-Curtis with Chebyshev-extrema nodes -- to retire the quadrature-order-artifact worry), 2026",
    relatedTerms: [
      "imp-3849 saddle-ratio well-depth inner-converged crossing n*=215.2 (composite Simpson)",
      "imp-3868 saddle-crossing Gauss-Legendre cross-solver confirmation of n*=215.23246",
      "imp-3731 saddle-ratio crossing extended-precision 225.54 -- shown to be an inner-quadrature-resolution artifact",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3896 logarithmic inviscid-window widening: the clean coarse-graining edge grows only ~log M, capping the hydrodynamic separation of scales",
    category: "numerical",
    definition:
      "imp-3872 found the finite-N viscosity fraction visc(y_star)=|m_zz|/|2 m m_z| " +
      "of the imp-3642 attractive-CM resolvent m(z)=sum_k 1/(z-x_k) shrinking ~500x " +
      "across the coarse-graining sweep y_star/d=2->8, but flagged that the finite " +
      "block edge (M=161) bounded the clean inviscid window to y_star/d in [2, 8]. " +
      "imp-3896 measures how that window widens as the block grows: sweeping " +
      "M=161, 321, 641, 1281 at the imp-3642 anchor height, the clean-window UPPER " +
      "EDGE (argmin over integer multipliers of visc(mult*d)) goes 8 -> 10 -> 11 -> " +
      "13 while the visc floor deepens 4.37e-4 -> 1.05e-5. The widening is " +
      "monotone but only LOGARITHMIC: doubling M lifts the edge by only ~1.5 d, so " +
      "edge/(M/2) FALLS from 9.9% to 2.0% -- the finite block edge recedes far " +
      "slower than the block grows, capping the hydrodynamic separation of scales " +
      "at ~log M. Brute particle-count growth cannot push the inviscid window to " +
      "the microscopic y->0 continuum." +
      "\n\nimp-3896 also checks whether the ~500x (2d->8d) shrinkage law persists " +
      "beyond the imp-3642 ladder (log gamma>20.86): the ratio visc(2d)/visc(8d) " +
      "measures 518.2x at the anchor, the crossover, and four heights beyond it " +
      "(log gamma=22, 25, 28, 32), identical to <1e-9 relative spread. This is " +
      "because at the s=0 seed the block is an exact rescaling by d (m~1/d, " +
      "mz~1/d^2, mzz~1/d^3), so visc depends only on the dimensionless multiplier " +
      "y_star/d -- the ~500x law is exactly SCALE-FREE, and the extra heights add " +
      "no independent evidence at s=0 since genuine height dependence lives only " +
      "in the s>0 RK4 flow imp-3872 already sampled." +
      "\n\nHONEST SCOPE: a scale-sizing MEASUREMENT, not a certificate -- it does " +
      "not widen the window to y->0, does not certify the m_zz->0 vanishing " +
      "viscosity, and does not write H2. H2 stays UNWRITTEN, the K4 route stays " +
      "WHOLLY NEW (consistent with imp-3714/3727/3846/3872/3891), and " +
      "G6a_shock_lipschitz stays OPEN. No positivity, no bridge closure, no RH " +
      "claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a>=0 UNTOUCHED; " +
      "Platt-Trudgian Lambda<=0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3896 (measuring how the imp-3872 clean inviscid window widens with block size M>161 and whether the ~500x m_zz viscosity-fraction shrinkage persists at heights beyond the imp-3642 ladder), 2026",
    relatedTerms: [
      "imp-3872 discrete-flux convexity probe -- the [2, 8] clean inviscid window and ~500x m_zz shrinkage this extends",
      "imp-3914 log-fit of the imp-3896 window edge and particle-budget extrapolation",
      "imp-3891 H2a continuum inviscid-Burgers limit written, H2b mean-field convergence OPEN",
      "imp-3642 sigma-crossover attractive-CM seed, spacing d and block reused",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3897 peak-scaled substitution-Simpson precision floor: import-time -ln A(tau) self-computation holds to ~1 ULP through tau=6, the tau~4 breakdown belongs to a fixed-panel companion rule",
    category: "numerical",
    definition:
      "imp-3873 reproduced the offline -ln A(tau) literals at tau in {2.5, 3.0} self-computingly " +
      "via a peak-scaled substitution s=sigma*x, sigma=1/(4 pi e^{4 tau}), which keeps the " +
      "collapsing A(tau)=int Phi(s)Phi(s+tau)ds peak O(1)-wide in x at every tau so a uniform " +
      "Simpson mesh (n<=8000) resolves it regardless of how far sigma shrinks. imp-3897 pushes " +
      "that scheme up to the imp-3730 cancellation floor tau=6 to LOCATE where import-time double " +
      "precision breaks down. FINDING: it does not. Against a peak-adequately-refined graded-GL " +
      "reference (hi=14, panels=400, grade=5) the substitution-Simpson tracks -ln A to <=1.41 ULP " +
      "of the magnitude at EVERY tau in {3.5, 4.0, 4.5, 5.0, 5.5, 6.0}, with its domain-invariance " +
      "(Xmax in {40, 80, 120}) and its n=4000->8000 refinement rung both staying at a few ULP. " +
      "Because -ln A ~ pi e^{4 tau} grows geometrically (3.78e6 at tau=3.5 to 8.32e10 at tau=6.0), " +
      "its absolute representation floor ulp(V)=|V|*2^-52 rises with it (8.4e-10 to 1.85e-5) -- " +
      "that rising floor, not any quadrature error, is what the substitution-Simpson saturates at." +
      "\n\nWHAT ACTUALLY BREAKS is the imp-3873 FIXED graded-GL companion (hi=14, panels=200, " +
      "grade=4): its gap to the substitution-Simpson jumps 1.2 ULP (tau=4.0) -> 1854 ULP (4.5) -> " +
      "9534 ULP (5.0) -> ~1.8e6 ULP (6.0). The onset is set by the fixed rule's innermost " +
      "power-panel width w_inner = hi*(1/panels)^grade = 8.75e-9 falling below the collapsing peak " +
      "scale sigma(tau): the crossover sigma(tau*)=w_inner solves to tau* ~ 4.006, matching the " +
      "observed 4.0->4.5 edge exactly. Refining the reference to grade-5/400 panels (w_inner=8.75e-11) " +
      "restores <=1.41-ULP agreement at the very tau where the fixed rule diverged by >1e3-1e6 ULP, " +
      "proving the divergence is fixed-rule under-resolution of the peak, NOT a double-precision " +
      "failure -- because the substitution-Simpson's node placement tracks sigma(tau) analytically " +
      "while a fixed node budget is blind to it. The genuine absolute double-precision floor " +
      "ulp(V)=|V|*2^-52=1 (V ~ 2^52, pi e^{4 tau} ~ 4.5e15) lands at tau ~ 8.73, well beyond the " +
      "tau~6 cancellation floor that actually bounds the clean window." +
      "\n\nHONEST SCOPE: an accuracy/provenance MEASUREMENT of a floating-point floor for a fixed " +
      "autocorrelation weight used inside a mass-feasibility diagnostic, at the RH-equivalent scale " +
      "class -- it establishes NO operator positivity. Mass-feasibility remains " +
      "necessary-but-not-sufficient; the operator-level K_a>=0 sign-positivity (imp-3066 " +
      "off-diagonal endpoint-Hankel step) stays the lone obstruction, UNTOUCHED. No RH verdict, " +
      "NO QED; Platt-Trudgian Lambda<=0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3897 (pushing the imp-3873 peak-scaled substitution-Simpson -ln A self-computation from tau=3.0 to the imp-3730 cancellation floor tau=6.0 to locate where import-time double precision breaks down, and diagnosing the apparent tau~4 breakdown as a fixed graded-GL companion rule's innermost-panel under-resolution rather than a precision floor), 2026",
    relatedTerms: [
      "imp-3873 offline-literal-independent reproduction -- the tau in {2.5, 3.0} substitution-Simpson scheme this extends to tau=6",
      "imp-3850 dual-path tau in {2.5, 3.0} reconciliation -- the offline-literal source",
      "imp-3709 log-domain independent reproduction -- the graded-GL reference path",
      "imp-3730 cancellation floor / imp-3866 Watson-tail reducibility -- the tau~6 ceiling that actually bounds the clean window (well short of the tau~8.73 genuine precision floor)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3898 path-local horizon-elasticity majorant: e_j <= 8/s_min(j)^2 sharpens the global 8/smin^2 ceiling to a tight 8/Dmin^2 nearest-term proxy",
    category: "numerical",
    definition:
      "imp-3874(e) verified the imp-3854 global-smin elasticity ceiling " +
      "0<=dPsi_N/dT<=(8/smin^2)Psi_N but found it 2000x-34000x loose; imp-3870 " +
      "traced the sharp effective scale to the nearest-neighbour Psi term " +
      "(j=a+-1), whose single-gap path has path-local minimum equal to Dmin, " +
      "giving effective constant (H/Dmin)^2. imp-3898 derives the mathematics " +
      "behind that observation directly: (1) a rigorous PER-TERM path-local " +
      "majorant e_j = d ln t_j/dT = 8 P_j/D_j <= 8/s_min(j)^2, where s_min(j) " +
      "is the minimum gap on term j's own path (proof: P_j<=m_j/s_min(j), " +
      "D_j>=m_j*s_min(j)), uniformly SHARPER than the global e_j<=8/smin^2 " +
      "since s_min(j)>=smin, and TIGHT at 8/Dmin^2 on the nearest single-gap " +
      "term; (2) the exact Psi-weighted-average identity " +
      "(dPsi/dT)/Psi = sum_j w_j e_j with w_j=(1/D_j^2)/(sum 1/D_k^2), which " +
      "concentrates weight on the nearest terms." +
      "\n\nimp-3898 then CERTIFIES live against the imp-3874 finite-difference " +
      "data that the Dmin effective constant 8/Dmin^2 (7.71/17.61/16.72 on " +
      "plateaus 0/4/9) reproduces the realised elasticity logSens " +
      "(8.06/14.56/17.45) to a factor sharpRatio in [0.83,1.05] -- a " +
      "2000x-35000x sharpening of the global 8/smin^2 ceiling (2279x-34004x " +
      "above realised)." +
      "\n\nHONEST LIMIT: 8/Dmin^2 is a sharp PROXY, not a certified upper " +
      "bound -- the realised elasticity EXCEEDS it by ~4.4-4.5% on plateaus " +
      "0 and 9, because far terms with small path-local gaps carry " +
      "above-Dmin elasticity at tiny weight. The certified object is the " +
      "weighted path-local majorant (dPsi/dT)/Psi <= 8 sum_j w_j/s_min(j)^2, " +
      "whose collapse to an explicit unconditional C/Dmin^2 needs the " +
      "per-term tail-weight profile -- named as the OPEN sub-gap " +
      "imp-3898-sub-tail-weight-constant (later closed numerically by " +
      "imp-3910 at C<=54.56, and cross-validated term-by-term by imp-3917). " +
      "LEMMA 3854 stays a valid over-bound; RH-free necessary-but-not-sufficient " +
      "measurement; imp-3066 off-diagonal endpoint-Hankel K_a>=0 UNTOUCHED; " +
      "Platt-Trudgian Lambda<=0.2 remains the rigorous SOTA; NO QED.",
    firstUsed: "imp-3898 (deriving the rigorous per-term path-local horizon-elasticity majorant and its sharp Dmin proxy, sharpening imp-3854/imp-3870/imp-3874), 2026",
    relatedTerms: [
      "imp-3870 refutation that smin~=Dmin -- the nearest-neighbour path-local scale this majorant formalizes",
      "imp-3874 finite-difference certification of the global 8/smin^2 ceiling this sharpens",
      "imp-3910 numerical collapse of the imp-3898-sub-tail-weight-constant sub-gap to C<=54.56",
      "imp-3917 per-term cross-validation of the e_j<=8/s_min(j)^2 majorant against measured finite-difference elasticity",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3899 caustic-stress resolvent-flux identity survival: m_s = 2 m m_z + m_zz holds to < 1e-12 residual up to 0.99 of the pre-collision budget",
    category: "numerical",
    definition:
      "imp-3872 verified the exact finite-N resolvent-flux identity " +
      "m_s = 2 m m_z + m_zz (m_s from the ACTUAL imp-3642 RK4 attractive " +
      "Calogero-Moser velocities, m/m_z/m_zz from the analytic resolvent " +
      "m(z,s) = sum_k 1/(z - x_k(s))) to a max relative residual < 1e-12, but " +
      "only over HALF the pre-collision shock budget on a block of M = 161. " +
      "The caustic (collision) time is exactly where the G6a K4 regularity " +
      "question lives, so imp-3899 STRESS-TESTS the identity where imp-3872 " +
      "stopped: it pushes the flow to 0.99 of the full pre-collision budget " +
      "1/(2 V0) and to larger blocks (M = 161, 241, 321), sampling the " +
      "resolvent on the mesoscopic strip z = x + i y_star (y_star = 4 d) at " +
      "five budget fractions approaching collision (0.50, 0.75, 0.90, 0.95, " +
      "0.99)." +
      "\n\nWHY IT MUST HOLD ALGEBRAICALLY: with f_k = 1/(z - x_k), " +
      "m = sum f_k, m_z = -sum f_k^2, m_zz = 2 sum f_k^3 and the attractive " +
      "velocity xdot_k = -2 sum_{j!=k} 1/(x_k - x_j), the finite-N field obeys " +
      "m_s = sum_k xdot_k f_k^2 = 2 m m_z + m_zz EXACTLY for ANY particle " +
      "configuration -- a pure algebraic identity independent of RK4 " +
      "integration accuracy. What the caustic CAN degrade is floating-point " +
      "conditioning: as the minimum inter-particle gap g_min collapses the " +
      "velocities develop O(1/g_min) magnitudes and catastrophic " +
      "cancellation, which could inflate the measured residual even though " +
      "the resolvent itself stays well-conditioned on the fixed y_star > 0 " +
      "strip." +
      "\n\nRESULT: the identity SURVIVES the caustic -- the max relative " +
      "residual stays < 1e-12 across every block size and every near-caustic " +
      "slice, even as the tightest inter-particle gap collapses to " +
      "g_min/d well below the seed spacing. The near-collision velocity " +
      "blow-up does not inflate the residual in double precision. This is a " +
      "self-consistency check that the discrete flux is read correctly, NOT " +
      "a certificate: it does not prove the mean-field/hydrodynamic limit " +
      "exists, does not certify convex-flux H2, and reads m on a mesoscopic " +
      "strip rather than the microscopic y->0 continuum. H2 stays UNWRITTEN " +
      "as a certificate, the K4 route stays WHOLLY NEW and " +
      "G6a_shock_lipschitz stays OPEN. imp-3066 off-diagonal endpoint-Hankel " +
      "K_a>=0 positivity UNTOUCHED; Platt-Trudgian Lambda<=0.2 remains the " +
      "rigorous SOTA; NO QED.",
    firstUsed: "imp-3899 (stress-testing the imp-3872 exact finite-N resolvent-flux identity near the caustic and at larger block sizes, finding it survives the near-collision velocity blow-up in double precision), 2026",
    relatedTerms: [
      "imp-3872 the P1 exact finite-N flux identity verification this extends to the caustic",
      "imp-3642 the attractive Calogero-Moser RK4 flow whose seed and integrator are reused",
      "imp-3846 names H2 the dependency-chain root; the caustic is exactly where K4 regularity lives",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3869 deep-tail exact-saddle ratio recovery: R_n stays below 1 through n=1424, climbing back toward it with no second well",
    category: "numerical",
    definition:
      "imp-3849 converged the inner A(tau) quadrature of the exact-saddle ratio R_n = |D_n|/|D_n^saddle| " +
      "and found a broad sub-unity well bottoming at r_min = -5.845e-4 near n = 500, with R_n climbing " +
      "slowly back toward 1 past the well but measured only out to n = 624. imp-3869 extended the " +
      "identical NPHI=10 kernel and inner-converged A(tau) quadrature (4800 panels on [0,2], self-" +
      "checked against 7200) from n = 624 to n = 1424 to see whether that recovery completes, reverses, " +
      "or develops a second feature." +
      "\n\nFOUR findings: (1) R_n stays BELOW 1 across the whole extended range and recovers toward 1 " +
      "MONOTONICALLY from below -- no second sign change and no second well, the imp-3849 n=500 well " +
      "remains the sole excursion. (2) The recovery does not complete by n = 1424: r_1424 = -3.828e-4, " +
      "only ~35% of the way back from the well minimum -5.845e-4 to 0, so this is a slow tail rather " +
      "than a fast return. (3) The only second feature is a shoulder in the recovery RATE (an " +
      "inflection of dr/dn) near n ~ 790, where the rate accelerates out of the well, peaks at roughly " +
      "2.71e-7 per rung, then decelerates monotonically -- a rate feature, not a value feature. (4) The " +
      "recovery tracks the imp-3735 Laplace-variance tail |eps_n| -> 0: eps_n stays negative and decays " +
      "(peak magnitude eps_350 = -5.144e-4, eps_1424 = -2.656e-4) with r_n/eps_n nearly constant at " +
      "1.29-1.44, so the eps-weighted step in D_n vanishing is what drags the ratio back toward 1. The " +
      "feature cascade reads: |eps|-peak near n ~ 350 -> well minimum at n = 500 -> recovery-rate " +
      "shoulder near n ~ 790, all inside one sub-unity excursion." +
      "\n\nHONEST SCOPE: measurement only, at the RH-equivalent scale class. Grid-stable to ~4.95e-7 in " +
      "the tail (looser than imp-3849's ~8e-8 up to n=624, worsening toward the A(tau) support edge). " +
      "A later re-measurement (imp-33230) extended this ladder further and found the recovery does not " +
      "simply asymptote to 1 along the naive 4/(n ln n) law -- see imp-33211/imp-33230 for the rate " +
      "fit and the P_r crossing of 1 near n ~ 1457; this entry documents the imp-3869 n<=1424 reading " +
      "only. No operator positivity established; the off-diagonal endpoint-Hankel obstruction K_a >= 0 " +
      "(imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the " +
      "rigorous SOTA.",
    firstUsed: "imp-3869 (extending the imp-3849 inner-converged exact-saddle ratio ladder from n=624 to n=1424, finding R_n stays below 1 and recovers monotonically with a single recovery-rate shoulder near n~790, tracking the imp-3735 |eps_n|->0 Laplace tail), 2026",
    relatedTerms: [
      "imp-3849 inner-quadrature-converged exact-saddle ratio: crossing moves to n*=215.231, well deepens ~5x to r_min=-5.845e-4 at n~500 (imp-3849)",
      "imp-3735 moment-ratio correction eps_n = Q_n/tau*(n)^2 - 1: Laplace-variance decay order (imp-3735)",
      "imp-33211 recovery-rate fit against the 4/(n ln n) law and the P_r crossing of 1 (imp-33211)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/viz-imp33214-saddle-ratio-deep-tail-recovery",
  },
  {
    term: "imp-3891 H2a/H2b split: the G6a K4 H2 root divides into a written algebraic limit and an open mean-field convergence theorem",
    category: "proof-status",
    definition:
      "imp-3872 empirically probed the imp-3846 dependency-chain root H2 (uniformly convex flux of the " +
      "hydrodynamic limit of the imp-3642 attractive Calogero-Moser flow) and found the exact finite-N flux " +
      "gradient single-signed (kappa=2, F''(m)=-2) but left H2 UNWRITTEN as a certificate. imp-3891 splits the " +
      "monolithic root H2 into two named sub-pieces of different status." +
      "\n\nH2a -- the continuum complex-inviscid-Burgers limit m_s + F(m)_z = 0, F(m) = -m^2, F'(m) = -2 m, " +
      "F''(m) = -2 (uniformly convex) -- is WRITTEN, algebraically exact. It follows from the finite-N " +
      "resolvent field m(z,s) = sum_k 1/(z-x_k(s)) obeying the EXACT identity m_s = 2 m m_z + m_zz (no large-N " +
      "limit needed), with the inviscid law recovered by the FORMAL vanishing-viscosity reduction m_zz -> 0. It " +
      "is the attractive-sign twin of the Menon-Pego / Biane repulsive complex-Burgers log-gas limit m_s = " +
      "-2 m m_z. Two ingredients are corroborated numerically: the seed-lattice resolvent m_M(z) converges to " +
      "the closed form (pi/d) cot(pi z/d) as the block grows (monotone, ~15x error drop over M=41->641), and " +
      "the exact identity holds to <1e-12 relative residual with kappa=2.000000000 along a short RK4 flow." +
      "\n\nH2b -- the empirical-measure mean-field CONVERGENCE THEOREM, that mu_M = (1/M) sum delta_{x_k(s)} " +
      "converges uniformly on a time interval to a measure solving m_s = 2 m m_z -- stays OPEN, named the " +
      "sub-gap sg-3891-attractive-mean-field-convergence, behind three obstructions: (O1) the singular " +
      "ATTRACTIVE kernel -2/(x_k-x_j) is neither Lipschitz nor repulsive, so standard singular-kernel " +
      "propagation-of-chaos results (Rogers-Shi/Chan/Cepa-Lepingle) that rely on repulsion to keep particles " +
      "apart do not apply off the shelf; (O2) the attractive flow drives finite-time collisions and the " +
      "inviscid limit shocks at exactly that caustic time tau_c, so any convergence theorem holds at best on " +
      "[0, tau_c) and breaks precisely where the downstream entropy-solution tools T1-T4 are needed; (O3) the " +
      "m_zz -> 0 vanishing viscosity used to derive H2a itself is only measured (imp-3872) on the mesoscopic " +
      "window y_star/d in [2, 8], uncontrolled at the microscopic y -> 0 continuum where the mean-field limit " +
      "lives." +
      "\n\nHONEST SCOPE: scoping/derivation only, RH-equivalent scale class -- establishes no operator " +
      "positivity, no bridge closure, no RH claim, NO QED. K4 stays WHOLLY NEW, G6a_shock_lipschitz stays " +
      "OPEN. The off-diagonal endpoint-Hankel obstruction K_a>=0 (imp-3066) is UNTOUCHED. Platt-Trudgian " +
      "Lambda<=0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3891 (writing the H2a continuum complex-inviscid-Burgers limit of the imp-3642 attractive-CM flow and scoping the open H2b empirical-measure mean-field convergence theorem behind three named obstructions), 2026",
    relatedTerms: [
      "imp-3872 discrete-flux convexity probe -- the empirical kappa=2 result whose unwritten certificate H2a/H2b splits",
      "imp-3846 G6a K4 caustic-regularity toolkit assessment -- names H2 the dependency-chain root",
      "imp-3896 logarithmic inviscid-window widening -- measures how far the O3 m_zz->0 window extends",
      "imp-33207 literature gap-map for the H2b sub-gap sg-3891-attractive-mean-field-convergence",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3851 fourth fifth-pair Gram-spread rung (N=2200): inconsistent local exponents decisively rule out a coherent power law",
    category: "numerical",
    definition:
      "imp-3733 had only TWO nonzero points on the imp-3668/imp-3715 fifth-pair Gram degeneracy spread " +
      "ladder worstPairSpread(N) = |lambda_9 - lambda_10| / lambda_9 (0.885 ULP at N=1800, 6.195 ULP at " +
      "N=2000) -- enough to reject an absurd N^18.47 power-law fit but not enough to check exponent " +
      "CONSISTENCY, since two points always define exactly one power law. imp-3851 re-ran the identical " +
      "imp-3643/imp-3668 dense solve (explicit Gram S = T^T T, Householder tred1 + implicit-QL tql1 for " +
      "ALL eigenvalues, no Krylov subspace, no reorthogonalization) at the intermediate rung N=2200. " +
      "RESULT: (1) worstPairSpread(2200) = 1.964592e-15 = 8.848 ULP -- a genuine nonzero FOURTH data " +
      "point, with the route reproducing the N=2000 rung EXACTLY on cross-check (pair910=1.375522e-15); " +
      "the ladder 0, 0, 1.97e-16, 1.38e-15, 1.96e-15 stays monotone non-decreasing at this stage. (2) With " +
      "THREE nonzero points the successive local power-law exponents are INCONSISTENT: " +
      "p(1800->2000) = 18.47 but p(2000->2200) = 3.74, a factor ~4.9 apart. A genuine power law " +
      "spread ~ N^p gives the SAME exponent between any pair of rungs; two wildly different local " +
      "exponents cannot come from one coherent growth law -- this is the signature of discrete last-digit " +
      "ULP quantization jitter between floor-level values, not a resolved N-dependence. All three " +
      "nonzero rungs (0.885, 6.195, 8.848 ULP) sit below the conservative 10-ULP backward-error floor, " +
      "making the N-INDEPENDENT few-ULP-floor model the consistent description. (3) The linear N*eps " +
      "model stays falsified on the resolved sample (N=2200 uses only 4.02e-3 of its 4.885e-13 budget)." +
      "\n\nHONEST SCOPE: a measurement adding ONE resolved nonzero rung, turning two nonzero points into " +
      "three -- enough to check exponent consistency (and decisively rule out a coherent power law via " +
      "the 18.47-vs-3.74 mismatch) but still not enough to pin a resolved growth exponent to few-percent " +
      "accuracy: the N-dependence is consistent with zero, not measured to be exactly zero. Does NOT " +
      "re-certify the pairing (imp-3668), does NOT establish the fifth-pair amplitude law sigma_4, and " +
      "does NOT attempt the imp-3066 K_a >= 0 positivity. The imp-33209/imp-33231 later rungs (N=2400, " +
      "N=2800) extend this same ladder and find it DIPS rather than grows, strengthening the floor " +
      "reading. RH-EQUIVALENT. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous " +
      "SOTA.",
    firstUsed: "imp-3851 (adding the N=2200 resolved dense fifth-pair rung to the imp-3733 sample and discriminating the few-ULP floor from residual growth via exponent inconsistency), 2026",
    relatedTerms: [
      "imp-3668 dense fifth-pair Gram degeneracy cross-validation (imp-3668)",
      "imp-3715 fifth-pair Gram-spread rounding-floor model (imp-3715)",
      "imp-3733 two-nonzero-point fifth-pair spread sample (imp-3733)",
      "imp-33209/imp-33231 later rungs (N=2400, N=2800) showing the ladder dips rather than grows",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/viz-imp33217-fifth-pair-spread-ulp-floor-ladder",
  },
  {
    term: "imp-3932 coefficient-dimension obstruction to Conjecture 22.1 (twin-ladder usefulness): a rigorous exponential-polynomial zero-count cap falsifying the strong global reading at the Platt-Trudgian 2021 benchmark",
    category: "proof",
    definition:
      "Conjecture 22.1 of twin_ladder_consolidated_v52.pdf claims a frozen-ladder " +
      "proxy Phi_fr(u) = Sum_j e^{-alpha_j u^2} P_j(u^2) (eq 20-21, coefficient " +
      "dimension D = Sum_j (K_j+1)) can beat a named classical baseline on " +
      "certified remainder at equal runtime. imp-3932 proves a four-lemma chain " +
      "that caps how much sign information any such proxy can certify. L1 " +
      "(Fourier closure): the Fourier transform of Phi_fr is Xi_fr(t) = " +
      "Sum_j e^{-t^2/(4 alpha_j)} Q_j(t), Q_j even of degree <= 2 K_j (each " +
      "t-derivative of a Gaussian-times-polynomial stays Gaussian-times-polynomial, " +
      "degree +1). L2 (classical, Polya-Szego Part V Problem 75, Rolle-induction " +
      "proof reproduced): an exponential polynomial with N distinct real exponents " +
      "and total coefficient count D has at most D-1 real zeros. L3 (sign-change " +
      "cap, via x = t^2): Xi_fr has at most D-1 sign changes on (0, infinity), a " +
      "SHARP cap (a single Gaussian times Hermite H_{2K} attains it). L4 (sign " +
      "transfer, IVT): if the frozen ladder certifies M alternating-sign nodes of " +
      "Xi at which its remainder stays below |Xi|, then D >= M+1." +
      "\n\nBENCHMARK COROLLARY: Platt-Trudgian 2021 verified M_sc = " +
      "12,363,153,437,138 sign changes of Xi up to height T0 = 3,000,175,332,800. " +
      "The hypothesis-free TASK FORM (certifying all M_sc sign changes) forces " +
      "D >= M_sc+1 = 12,363,153,437,139 stored coefficients, versus a " +
      "691,008-term Riemann-Siegel main sum at the same height -- equal runtime " +
      "fails by a factor > 1.789e7 under any per-coefficient-cost evaluation " +
      "model, plus an intrinsic Xi-scale precision floor of pi*T0/(4 ln 2) ~ " +
      "3.40e12 bits. The COMPARISON FORM needed an adversarial-referee repair " +
      "(a bare remainder comparison does not force a node sign change; a 2x " +
      "margin hypothesis restores it)." +
      "\n\nNAMED OBSTRUCTIONS keeping this a PARTIAL, not full, falsification: " +
      "(1) no unconditional runtime lower bound excludes an exotic short " +
      "straight-line evaluation of this specific coefficient family " +
      "(Paterson-Stockmeyer only gives an O(sqrt D) upper bound on generic " +
      "evaluation cost); (2) windowed/MODULATED proxies fall outside the real-" +
      "distinct-exponent hypothesis L2 needs, but imp-33233/imp-33251/imp-33278 " +
      "show this escape reconstructs the Odlyzko-Schonhage band-limited-" +
      "interpolation Nyquist floor at the SAME ~M_sc order (single-width weakens " +
      "the bound by at most 2x; multi-width/windowed reappears as a bandwidth " +
      "floor U = pi*M_sc/T0 that tracks (1/2)log(T0/2pi) - 1/2 exactly, verified " +
      "against the Riemann-von Mangoldt count and the omitted S(T) term); (3) at " +
      "small fixed heights the conjecture reduces to open constant-chasing. NO " +
      "Lambda bound is claimed; Platt-Trudgian Lambda <= 0.2 remains SOTA; imp-3066 " +
      "is untouched; NO false QED on Conjecture 22.1 in full generality.",
    firstUsed: "imp-3932 (coefficient-dimension obstruction to Conjecture 22.1, the sole never-pushed INDEPENDENT-NOVEL v52 conjecture per the imp-1210 audit, adversarially refereed with the comparison-form repair), 2026",
    relatedTerms: [
      "imp-33233 modulation-band-limit assessment: shows the windowed/MODULATED escape hatch does not clear an equal-runtime advantage (imp-33233)",
      "imp-33251 independent Nyquist-floor re-derivation from the raw Platt-Trudgian inputs (imp-33251)",
      "imp-33278 height sweep confirming the Nyquist bandwidth floor tracks (1/2)log(T0/2pi) - 1/2, not a shrinking representation (imp-33278)",
      "imp-33294 propagation of the omitted S(T) term through the Nyquist floor offset (imp-33294)",
      "imp-1210 literature audit: the source of the INDEPENDENT-NOVEL grading for Conjecture 22.1 (imp-1210)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-33207 attractive-mean-field literature gapmap (sg-3891-attractive-mean-field-convergence): why no singular-kernel propagation-of-chaos theorem covers the attractive Calogero-Moser sign",
    category: "proof",
    definition:
      "imp-3891 split the G6a K4 dependency root H2 into a WRITTEN algebraic half " +
      "H2a and an OPEN analytic half H2b -- the empirical-measure mean-field " +
      "CONVERGENCE THEOREM for the ATTRACTIVE singular -2/(x_k-x_j) Calogero-Moser " +
      "kernel of the imp-3642 Dyson flow -- naming it sg-3891-attractive-mean-" +
      "field-convergence behind three obstructions (O1 singular attractive kernel, " +
      "O2 finite-time collision shock, O3 uncertified vanishing viscosity). imp-" +
      "33207 scopes that sub-gap against the propagation-of-chaos literature. It " +
      "catalogues six singular-kernel mean-field theorems and the repulsion-" +
      "supplied ingredient each depends on: L1 Sznitman classical PoC needs a " +
      "globally Lipschitz kernel (the 1/x kernel is not even locally bounded, so " +
      "this touches neither sign); L2 Rogers-Shi/Cepa-Lepingle/Chan repulsive " +
      "Dyson-Calogero-Moser gets its limit from an a-priori NO-COLLISION estimate " +
      "(Bessel comparison) that the attractive sign makes FALSE -- collisions " +
      "occur in finite time; L3 Osada's Dirichlet-form/martingale approach needs " +
      "the repulsive potential to keep the reference Gibbs measure locally " +
      "integrable near coincidences, which the attractive sign destroys; L4 " +
      "Serfaty/Duerinckx modulated-energy Gronwalls a functional E >= 0 that is " +
      "coercive only for a positive-definite (repulsive) kernel g -- the " +
      "attractive sign flips g and E loses both its lower bound and coercivity. " +
      "(The module also lists L5 Jabin-Wang relative entropy and L6 Fournier-" +
      "Jourdain 2D vortex, whose good-sign/divergence-free ingredients likewise " +
      "fail at this sign.) Common thread: every route buys its limit with a " +
      "REPULSION-supplied ingredient, and the attractive sign removes exactly " +
      "that ingredient in each case -- so NO existing theorem covers the " +
      "attractive kernel and the obstruction is STRUCTURAL, not constant-" +
      "sharpening." +
      "\n\nWHAT A RIGOROUS ATTRACTIVE LIMIT WOULD ADDITIONALLY NEED: R1 a " +
      "controlled-collision estimate up to the collision time tau_c (repulsive " +
      "proofs get no-collision for free); R2 a new coercive Lyapunov functional " +
      "replacing the non-coercive log/Riesz modulated energy; R3 a shock-" +
      "consistent entropy-solution notion of convergence through the caustic, " +
      "which couples H2b to the downstream G6a K4 T1-T4 toolkit so it cannot be " +
      "closed in isolation; R4 uniform microscopic vanishing-viscosity control " +
      "m_zz -> 0 as y -> 0 (imp-3891's O3, only measured on y_star/d in [2,8] so " +
      "far)." +
      "\n\nNUMERICAL CORROBORATION (necessary, not sufficient): the SAME jittered " +
      "seed lattice run under both velocity signs shows the min nearest-neighbour " +
      "gap collapsing (0.5506 -> 0.4491) and the log-gas Lyapunov functional " +
      "L = sum log|x_j-x_k| descending (132.09 -> 129.71) under attraction, " +
      "versus the gap spreading (-> 0.6246) and L ascending (-> 134.23) under " +
      "repulsion -- the exact L4 modulated-energy dichotomy made concrete.",
    firstUsed: "imp-33207 (literature-scope assessment of the imp-3891 sub-gap sg-3891-attractive-mean-field-convergence)",
    relatedTerms: [
      "imp-3891 names H2b / sg-3891-attractive-mean-field-convergence and its three obstructions O1-O3 (imp-3891)",
      "imp-3872 the exact finite-N identity m_s = 2 m m_z + m_zz feeding R4 (imp-3872)",
      "imp-3846 names H2 the G6a K4 dependency root and its T1-T4 entropy-solution toolkit (imp-3846)",
      "imp-3642 the attractive Calogero-Moser RK4 flow whose seed lattice is reused (imp-3642)",
      "imp-3727 the entropy-solution regularity scoping R3 points to (imp-3727)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-33208 two-regime numerical verification of the imp-3892 pinned Watson majorant |rho(tau)| <= K0 e^{-4 tau}",
    category: "numerical",
    definition:
      "imp-3892 pinned the sole external constant of the imp-3866 three-remainder Watson " +
      "decomposition of sg-3844-watson-tail to a closed leading coefficient K_lead = " +
      "2 phi'(0)/Phi(0) = -3.4120570431 and a certified majorant K0 = 3.46, but that pin was " +
      "only checked against the three imp-3866 window points {2.5, 3, 3.5}. imp-33208 extends the " +
      "direct measurement of the realised bracket remainder ratio rhoRatio(tau) = rho(tau) e^{4 tau} " +
      "-- where bracket(tau) = exp(ln A_n1(tau) + T - ln(Phi(0)/4)) = 2 pi - 3 e^{-2 tau} + rho(tau) " +
      "-- to the full grid tau in {1.5, 2, 2.5, 3, 3.5, 4, 5, 6}, using the same imp-3709/imp-3850 " +
      "peak-adapted graded Gauss-Legendre -ln A(tau) ladder (HI=14, PANELS=1600, GRADE=6)." +
      "\n\nTHE RESULT IS TWO REGIMES. (A) RELIABILITY WINDOW tau in [1.5, 3.5]: the direct " +
      "reconstruction sits far above its own additive cancellation floor, and rhoRatio climbs " +
      "monotonically toward K_lead (-3.305, -3.373, -3.398, -3.407, -3.406 at tau=1.5..3.5), " +
      "staying strictly below the K0=3.46 majorant at every rung and reproducing the closed " +
      "two-term model K_lead + K6 e^{-2 tau} (K6 = +2.1066020628) within each per-tau floor -- " +
      "the tau=3.5 dip of ~8e-4 below tau=3.0 marks the floor onset, not a genuine reversal. (B) " +
      "FLOOR-SWAMPED WINDOW tau in {4, 5, 6}: bracket reconstructs an O(1) quantity from " +
      "ln A_n1 ~ -T, whose float representation carries absolute resolution ~ T * 2^{-52}, so the " +
      "induced noise on rhoRatio (~2 pi^2 e^{8 tau} eps) crosses the ~3.41 signal between tau=4 " +
      "and tau=5, making the apparent |rhoRatio| > K0 there the KNOWN imp-3730 additive " +
      "cancellation floor rather than a majorant violation -- the same closed two-term model " +
      "governs this window instead (residual sg-33208-high-tau-cancellation-floor, later closed " +
      "by direct double-double measurement in imp-33248)." +
      "\n\nVERDICT: the imp-3892 majorant is CONFIRMED directly on tau in [1.5, 3.5]; beyond that " +
      "the direct route cannot certify the bound numerically and the closed model takes over." +
      "\n\nHONEST SCOPE: measurement/verification only, certifying a bound literal, not RH; " +
      "NPHI=10 kernel truncation upstream; operator positivity -- the off-diagonal endpoint-Hankel " +
      "obstruction K_a >= 0 (imp-3066) -- UNTOUCHED; necessary-but-not-sufficient; no QED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-33208 (numerically verifying the imp-3892 pinned Watson majorant across the full tau in {1.5,...,6} grid on the imp-3850 graded-GL -ln A ladder), 2026",
    relatedTerms: [
      "imp-3892 Watson majorant constant: closed pin K_lead=-3.4120570431, K0=3.46 (imp-3892)",
      "imp-3866 Watson-tail bound assessment: three-remainder reduction of sg-3844-watson-tail (imp-3866)",
      "imp-33223 honest-status note: sg-3844-watson-tail is now REDUCED-AND-PINNED (imp-3866 -> imp-3892), not open",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-33211 deep-tail recovery-rate fit: |r_n| tracks 4/(n ln n) from below with no floor detected (later found to be a finite-window artifact)",
    category: "numerical",
    definition:
      "imp-3869 extended the imp-3849 inner-converged exact-saddle ratio ladder R_n = |D_n|/|D_n^saddle| " +
      "to n = 1424 and found R_n climbing monotonically back toward 1 from below, but never fitted the " +
      "decay RATE of r_n = R_n - 1 against the imp-3735 closed-form Laplace-variance law |eps_n| ~ " +
      "1/(n(1+4 tau*)) ~ 4/(n ln n). imp-33211 reuses the identical NPHI=10 kernel and inner-converged " +
      "A(tau) quadrature (4800 panels on [0,2], self-checked vs 7200) to fit that rate on n in [624, 1424]." +
      "\n\nFOUR findings: (1) |r_n| decays monotonically but SLOWER than 4/(n ln n) over the window: " +
      "L_r = |r_n| n (1+4 tau*) climbs 1.744 -> 3.048 and the local decay exponent p_r stays below 1 " +
      "(0.348 at n=720 -> 0.609 at n=1300), climbing toward the ~1 the law predicts asymptotically. " +
      "(2) The 4/(n ln n) curve reads as a tightening upper envelope approached FROM BELOW: P_r = " +
      "|r_n| (n ln n)/4 is monotone increasing and stays strictly below 1 across the whole tail (0.570 " +
      "at n=624 -> 0.990 at n=1424). (3) |r_n| and |eps_n| decay in lockstep, r_n/eps_n staying in " +
      "[1.292, 1.441], refining imp-3735's n<=80 reading. (4) BOUND AS MEASURED: no sub-unity floor is " +
      "detected at n=1424 -- |r_n| strictly decreasing with a positive, climbing local exponent -- so the " +
      "n<=1424 tail read as consistent with R_n -> 1 from below by extrapolation, though a floor could " +
      "not be rigorously excluded by finite-n measurement alone." +
      "\n\nHONEST SCOPE: measurement/fit only, at the RH-equivalent scale class; grid-stable to ~4.95e-7 " +
      "in the tail. The reaches-1-from-below reading was explicitly flagged as an extrapolation, not a " +
      "certified limit -- and that caveat proved essential: imp-33230 extended the identical ladder past " +
      "n=1424 and found P_r CROSSES 1 at n~1457, immediately above where imp-33211 stopped, so the " +
      "below-1 reading was a finite-window artifact of stopping one step short, not a genuine asymptote. " +
      "No operator positivity established; the off-diagonal endpoint-Hankel obstruction K_a >= 0 " +
      "(imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the " +
      "rigorous SOTA.",
    firstUsed: "imp-33211 (fitting the imp-3869 deep-tail exact-saddle ratio recovery rate against the imp-3735 Laplace-variance law 4/(n ln n) on n in [624,1424], finding P_r climbing to 0.990 with no floor detected as measured), 2026",
    relatedTerms: [
      "imp-3869 deep-tail exact-saddle ratio recovery: R_n stays below 1 through n=1424 (imp-3869)",
      "imp-3735 moment-ratio correction eps_n = Q_n/tau*(n)^2 - 1: Laplace-variance decay order (imp-3735)",
      "imp-33230 extends the ladder past n=1424 and finds P_r crosses 1 at n~1457, the imp-33211 below-1 reading was a finite-window artifact (imp-33230)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/viz-imp33243-recovery-rate-fit",
  },
  {
    term: "imp-33210 direct-route reproduction of the imp-3844 subleading A-weight coefficient B via a structurally-distinct log-sum-exp completed-Riemann kernel",
    category: "numerical",
    definition:
      "imp-3867 reproduced the LEADING imp-3844 A-weight constant c_inf = -ln((pi/2) Phi(0)) via a " +
      "fully independent direct completed-Riemann summation, but for the SUBLEADING coefficient " +
      "B = 3/(2 pi) = 0.477464829275686 it fell back on the imp-3844 collapsed Laplace form (Gauss-" +
      "Laguerre on A(tau) = e^{-T} int_0^inf e^{-T t} H_tau(t) dt), which still reuses the imp-3844 " +
      "n=1-tail collapse and t = e^{4s}-1 substitution -- so B rested, at bottom, on one analytic " +
      "path. imp-33210 closes that gap: it evaluates ln Phi(u) DIRECTLY as a per-term log-sum-exp " +
      "over the completed-Riemann terms, ln Phi(u) = logsumexp_n [ln(2 pi^2 n^4 e^{4u} - 3 pi n^2 " +
      "e^{2u}) - pi n^2 e^{4u}], with every term carrying its OWN e^{-pi n^2 e^{4u}} weight (no " +
      "common e^{-pi e^{4u}} factored out, unlike the imp-3709/imp-3844 factored-log form), then " +
      "forms A(tau) = int_0^inf Phi(s) Phi(s+tau) ds as the FULL two-factor product with ALL n " +
      "retained in both factors -- no analytic n=1-tail truncation of Phi(s+tau) and no t-" +
      "substitution collapse, leaving the Watson concentration entirely to the numerics. " +
      "Richardson-extrapolating the single-point coefficient b(tau) = (c(tau) - c_inf)/e^{-2 tau} " +
      "over the clean window [3, 3.5] recovers B = 0.477463967 (< 1e-6 from 3/(2 pi)), and a " +
      "disjoint window [3.25, 3.75] gives 0.477461899 (< 3e-6), with the single-point ladder " +
      "approaching B from the imp-3844 side as tau grows. Because this route shares none of the " +
      "imp-3844 analytic machinery -- no factored kernel, no n=1-tail truncation, no t-substitution, " +
      "no Gauss-Laguerre-on-the-collapsed-weight -- B = 3/(2 pi) is confirmed NOT a single-path " +
      "artifact, the last piece imp-3867 left resting on one route." +
      "\n\nHONEST SCOPE: reproduction/cross-check only, RH-equivalent, necessary-but-not-sufficient. " +
      "This is an independent NUMERICAL re-derivation of a diagnostic subleading coefficient; it does " +
      "NOT re-derive the Watson expansion symbolically and does NOT bound the all-orders " +
      "O(e^{-4 tau}) tail (sg-3844-watson-tail stays open). Establishes NO operator positivity; the " +
      "off-diagonal endpoint-Hankel K_a &gt;= 0 step (imp-3066) is UNTOUCHED. No RH verdict, no QED. " +
      "Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-33210 (direct-route reproduction of the imp-3844 subleading A-weight coefficient B via a structurally-distinct per-term log-sum-exp completed-Riemann kernel and full two-factor autocorrelation, extending imp-3867 from the leading c_inf to B), 2026",
    relatedTerms: [
      "imp-3844 closed-form derivation of the A-weight correction limit: c_inf, B (imp-3844)",
      "imp-3867 independent structurally-distinct reproduction of c_inf and B via a direct completed-Riemann kernel path (imp-3867)",
      "sg-3844-watson-tail: the still-open rigorous all-orders O(e^{-4 tau}) remainder bound (imp-3844)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-33212 NPHI-truncation stability of the imp-3849 exact-saddle features",
    category: "numerical",
    definition:
      "imp-3849 converged the inner autocorrelation A(tau) quadrature (inner [0,2], 4800 panels, " +
      "self-checked vs 7200 to ~8e-8) and located three exact-saddle-ratio features: the unity " +
      "crossing n* = 215.23124075, the eps_n = Q_n/tau*(n)^2 - 1 sign-change at n = 149, and a " +
      "sub-unity well bottoming at r_min = -5.845e-4 near n = 500. But imp-3849's own caveat named " +
      "one thing still unvaried: the de Bruijn-Newman completed-Riemann kernel truncation NPHI = 10 " +
      "(Phi(u) = sum_{n=1}^{NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) e^{-pi n^2 e^{4u}}), inherited " +
      "fixed by imp-3868 (Gauss-Legendre) and imp-3895 (Clenshaw-Curtis) alike. imp-33212 re-ran the " +
      "IDENTICAL imp-3849 pipeline at NPHI in {10, 14, 18} -- the only free parameter -- and found the " +
      "located features BIT-IDENTICAL across all three truncations: n* = 215.23124075, the eps sign-" +
      "change at n = 149, r_min = -5.8450e-4 at n = 500, and the cross-check r_226 = -8.7382e-5. The " +
      "whole-ladder maxima max_n |delta r_n| and max_n |delta eps_n| between successive NPHI are " +
      "EXACTLY 0.0 for both 10->14 and 14->18, because the added n = 11..18 kernel terms carry weight " +
      "~e^{-121 pi} ~ 1e-165 and smaller on the A(tau) support (u < ~1.37), underflowing the double-" +
      "precision round-off floor. So NPHI = 10 was NOT in fact a limiting residual floor for these " +
      "features -- the true floor stays the ~8e-8 inner-quadrature grid-convergence level imp-3849 " +
      "already reported, three-plus orders below the feature magnitudes. This complements imp-3918 " +
      "(quadrature-RULE independence across Simpson / Gauss-Legendre / Clenshaw-Curtis) by showing the " +
      "same features are also kernel-TRUNCATION independent." +
      "\n\nHONEST SCOPE: measurement only, RH-equivalent, model-systematic not a certified error bound. " +
      "This retires exactly ONE residual-floor question imp-3849 flagged; it establishes NO operator " +
      "positivity. Mass-feasibility is necessary-but-not-sufficient; the operator-level K_a &gt;= 0 " +
      "sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) remains UNTOUCHED. Platt-Trudgian " +
      "Lambda &lt;= 0.2 remains the rigorous SOTA. No RH verdict, no QED. imp-3849 / imp-3868 / imp-3895 " +
      "/ imp-3918 assertions are left intact -- this is a sensitivity measurement alongside them.",
    firstUsed: "imp-33212 (NPHI-truncation-stability sweep of the imp-3849 inner-converged exact-saddle features, showing NPHI=10 was not a limiting residual floor), 2026",
    relatedTerms: [
      "imp-3849 inner-converged exact-saddle features: n*, eps sign-change, well min (imp-3849)",
      "imp-3918 three-solver eps sign-change cross-validation (imp-3918)",
      "imp-3868 Gauss-Legendre second solver (imp-3868)",
      "imp-3895 Clenshaw-Curtis third solver (imp-3895)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-33232 refutation: imp-3919 crossover tau*>=6 is necessary but not sufficient",
    category: "numerical",
    definition:
      "imp-3919 derived the fixed-companion crossover tau*(panels,grade) = [grade*ln(panels) - " +
      "ln(4 pi hi)]/4 for the graded-GL A-weight quadrature, inverted it to size a minimal node " +
      "budget per grade {grade3:16704p, grade4:1470p, grade5:342p, grade6:130p, grade7:65p, " +
      "grade8:39p} so the innermost panel clears the peak sigma(6) = 1/(4 pi e^24) = 3.00e-12, and " +
      "validated the budget at a SINGLE point: tau=6, grade5 -> 0.83 ULP. It generalized that one " +
      "measurement to a headline ~2-order node-budget collapse (167040 -> 390 nodes) across the " +
      "grade sweep. imp-33232 independently regenerated the crossover and budget table exactly, " +
      "then ran EVERY tabulated minimal rule across the FULL clean window tau in [0.5,6] (12-point " +
      "grid) against a converged sigma-tracking substitution-Simpson reference (Xmax=120, " +
      "n=80000, well past imp-3919's own n<=8000/Xmax=40 rule, which is converged only near tau=6). " +
      "Result: only the shallow rows grade3..5 (panels>=342) honour <~1-ULP-class accuracy through " +
      "the window (few-ULP worst-case, sub-ULP at tau=6). The steep-grade node-savings rows " +
      "grade6/grade7/grade8 (130/65/39 panels) FAIL at tau=6 by ~157/~3548/~15400 ULP -- monotone " +
      "WORSE with grade -- despite tau*(panels,grade) all exceeding 6. Root cause: tau*>=6 only " +
      "forces the INNERMOST panel below the peak; consecutive graded panel widths jump by " +
      "~2^grade near the origin, so at grade8 the second panel is already ~256x the peak scale and " +
      "only ONE sub-peak GL-10 panel exists to resolve the collapsing peak, which cannot reach 1 " +
      "ULP. imp-33232 confirmed the breakdown is intrinsic, not a reference artifact, via a " +
      "substitution-independent cross-check: the grade8 minimal rule (39p) disagrees with a " +
      "16x-finer same-grade rule (624p) at tau=6 by ~1.5e4 ULP, while grade5 (342p) agrees with " +
      "an 8x-finer counterpart (2736p) to ~1.3 ULP. So imp-3919's node-savings collapse across the " +
      "grade sweep does not hold at fixed full-window accuracy -- the usable budget bottoms out " +
      "around panels~342 (grade<=5)." +
      "\n\nHONEST SCOPE: accuracy measurement / rule-design audit only, RH-equivalent, necessary-" +
      "but-not-sufficient. This audits a QUADRATURE node budget, not a mathematical floor -- it says " +
      "nothing about the imp-3730 cancellation floor near tau~6, which remains the binding limit on " +
      "the clean window. Establishes NO operator positivity; the off-diagonal endpoint-Hankel " +
      "K_a &gt;= 0 step (imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda " +
      "&lt;= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-33232 (independently verifying the imp-3919 fixed graded-GL crossover and minimal node-budget table across the full clean window tau in [0.5,6], not just the single tau=6 endpoint imp-3919 measured, and refuting the headline node-savings collapse for the steep-grade rows), 2026",
    relatedTerms: [
      "imp-3919 fixed-companion crossover and minimal graded-GL node budget (imp-3919)",
      "imp-3897 single-endpoint substitution-Simpson precision floor tau*~4.006 (imp-3897)",
      "imp-3730 cancellation floor near tau~6 on the clean window (imp-3730)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-33233 quantitative pinning of the modulation/window escape hatch (Conjecture 22.1)",
    category: "numerical",
    definition:
      "imp-3932 rigorously falsified the STRONG GLOBAL reading of Conjecture 22.1 for the paper's " +
      "own eq (20)-(21) frozen-ladder proxy (single Gaussian width times an even polynomial, or any " +
      "finite REAL-width Gaussian mixture) at the Platt-Trudgian 2021 benchmark, forcing a stored " +
      "coefficient dimension D >= M_sc + 1 = 12,363,153,437,139 against a 691,008-term Riemann-Siegel " +
      "main sum. It then NAMED the surviving obstructions, chief among them the windowed/MODULATED " +
      "proxy escape hatch, fenced off only qualitatively as \"= Odlyzko-Schonhage band-limited " +
      "interpolation, PARTIALLY-RELATED not novel\" with no quantitative bound. imp-33233 pins that " +
      "class boundary quantitatively in two regimes. (A) SINGLE-WIDTH modulation " +
      "Phi_fr(u) = e^{-alpha u^2} Sigma_c P_c(u^2) cos(t_c u) does NOT escape: multiplying Xi_fr(t) " +
      "by the entire, zero-free factor E(t) = e^{+t^2/(4 alpha)} (preserves the real zero set exactly) " +
      "turns it into a Polya-Szego exponential polynomial with distinct real exponents +/- t_c/(2 " +
      "alpha), so Polya-Szego Part V Problem 75 (L2 of imp-3932) still caps the real-zero count at " +
      "2 Sigma_c (2 K_c + 1) - 1, forcing D > M_sc/2 -- at the benchmark, D >= ceil(M_sc/2) = " +
      "6,181,576,718,569 stored coefficients, still exceeding the Riemann-Siegel main sum by a " +
      "factor > 8.9e6. Modulation with one width weakens the imp-3932 bound by at most 2x; it is not " +
      "an escape. (B) MULTI-WIDTH / genuinely windowed modulation cannot be cleared by a single " +
      "Gaussian multiplier, so L2 does not apply directly; but a proxy effectively supported in " +
      "|u| <= U is entire of exponential type <= U (Paley-Wiener), and the classical exponential-type " +
      "zero-density theorem (Levinson Gap and Density Theorems; Titchmarsh 8.71) bounds its real " +
      "zeros on (0, T0] by (U/pi) T0 (1 + o(1)). Certifying M_sc sign changes forces " +
      "U >= pi M_sc / T0 ~ 12.95 (order (1/2) log(T0/2pi), BOUNDED), and Whittaker-Kotelnikov-Shannon " +
      "sampling at spacing pi/U then needs (U/pi) T0 ~ M_sc real samples -- the storage/data " +
      "dimension reappears at the same ~M_sc order, and the representation IS Odlyzko-Schonhage " +
      "band-limited interpolation (published SOTA). NET VERDICT: the modulation/window class " +
      "boundary does NOT admit an equal-runtime certified-remainder advantage over Platt-Trudgian " +
      "2021 in either regime; imp-3932 surviving reading (i) stands, now quantitatively pinned " +
      "rather than merely fenced off. The genuinely open residue is narrowed to exactly two named " +
      "obstructions outside this machinery: (1) an algebraic-complexity RUNTIME-MODEL question -- " +
      "whether an exotic short straight-line program can evaluate the specific ~M_sc-coefficient " +
      "object in << M_sc operations (Paterson-Stockmeyer's O(sqrt(n)) nonscalar-mult bound does not " +
      "shrink the storage/sample read, and no unconditional per-evaluation lower bound is known); " +
      "and (2) the small fixed-height constant regime, open and benchmarkable but not the reading " +
      "the imp-1210 audit anchored to the Platt-Trudgian height." +
      "\n\nHONEST SCOPE: the single-width reduction is fully rigorous (E(t) is entire and nowhere " +
      "zero); the multi-width bound is rigorous for a compactly-supported window and a soft " +
      "effective-support bound for a Gaussian window, at the level of the eq (22) tail truncation " +
      "already carried by the paper. NO false QED: Conjecture 22.1 in full generality is NOT " +
      "resolved, and the named residual (runtime-model + small-height regime) is not hidden. " +
      "Independent of the de Bruijn-Newman constant; Polymath15 Lambda &lt;= 0.2 remains SOTA and " +
      "is untouched. The imp-1210 novelty verdict is unchanged.",
    firstUsed: "imp-33233 (quantitatively pinning the imp-3932 windowed/modulated proxy escape hatch for Conjecture 22.1 via a Polya-Szego zero-free-multiplier reduction for single-width modulation and a Paley-Wiener/Nyquist bound for multi-width/windowed modulation), 2026",
    relatedTerms: [
      "imp-3932 falsification of the strong global reading of Conjecture 22.1 (imp-3932)",
      "imp-1210 novelty audit of Conjecture 22.1 against Odlyzko-Schonhage (imp-1210)",
      "imp-1258 Volterra-norm two-way collapse (imp-1258)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-33234 saddle-window completion of the imp-33213 direct-vs-log A(tau) cross-check",
    category: "numerical",
    definition:
      "imp-33213 could cross-tabulate the imp-3893 direct Phi(s)Phi(s+tau) autocorrelation kernel " +
      "against the imp-3850 log-domain graded-GL A(tau) only at tau in {1.5,2,2.5,3}, because the " +
      "direct double-precision kernel underflows to exactly 0 once pi e^{4u} > ~709 (u > 1.367) -- " +
      "so the comparison never touched tau below the underflow edge, which is precisely where the " +
      "imp-3893 moments draw their support (the saddle window tau*(n) for n=10..80, spanning " +
      "tau* in [0.2701,0.5933])." +
      "\n\nimp-33234 fills that gap. Below u~1.37 BOTH machineries are representable: at each saddle " +
      "rung tau*(n), the direct kernel (int_0^7 phiKernel(s)phiKernel(s+tau) ds, inner Simpson) and " +
      "the log-domain value A_log=exp(-negLnA) (imp-33213's independent grade-5/300-panel graded-GL) " +
      "agree to worst 5.21e-7 relative at n=80 (A~1.3e-15), tightening to 2.51e-9 at n=10. The residual " +
      "is finite direct-Simpson resolution, not a kernel mismatch: at the hardest rung n=80 it falls " +
      "2.01e-3 -> 1.32e-4 -> 8.32e-6 -> 5.21e-7 -> 3.26e-8 over inner N=1200..19200, with ratios " +
      "15.3, 15.8, 16.0, 16.0 -- the textbook O(h^4) Simpson signature -- converging the direct form " +
      "onto the log-domain value." +
      "\n\nThis closes the imp-33213 below-underflow-edge gap: the two A(tau) machineries coincide " +
      "both above the underflow edge (log-domain only) and below it (both representable), on the " +
      "exact window the moment weight is actually built from. imp-33252 later Richardson-extrapolated " +
      "the n=80 rung to confirm the residual continues to vanish to the double-precision floor rather " +
      "than bottoming out." +
      "\n\nHONEST SCOPE: cross-validation/consistency only, RH-equivalent, necessary-but-not-sufficient; " +
      "establishes NO operator positivity. The off-diagonal endpoint-Hankel K_a >= 0 sign-positivity " +
      "(imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the " +
      "rigorous SOTA.",
    firstUsed: "imp-33234 (extending the imp-33213 direct-vs-log A(tau) cross-validation below the tau~1.37 direct-underflow edge into the saddle window tau*(n) in [0.27,0.59] for n=10..80, where both machineries are representable and agree to <1e-6 relative per rung, the direct form converging to the log value at the Simpson O(h^4) rate), 2026",
    relatedTerms: [
      "imp-33213 cross-validation that the imp-3893 moment weight and the imp-3850 dual-path -ln A(tau) ladder rest on the same autocorrelation (imp-33213)",
      "imp-3893 moment-fidelity tilt T_n quantifying the imp-3871 model-fidelity gap (imp-3893)",
      "imp-3850 dual-path -ln A(tau) reconciliation window extended to [1.5,3.0] (imp-3850)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-33235 literal cross-check of the imp-33213 reconciled -ln A(tau) ladder",
    category: "numerical",
    definition:
      "imp-33213 reported that an independent log-domain graded-GL reconstruction (grade 5, 300 " +
      "panels, cutoff hi=10) reproduces the imp-3736/imp-3850 reconciled -ln A(tau) ladder at all " +
      "four overlapping rungs tau in {1.5,2,2.5,3}. imp-33235 re-derives each literal from scratch " +
      "and answers the two questions that claim leaves open: is the residual genuine convergence " +
      "rather than a lucky quadrature coincidence, and is the imp-33213 configuration really " +
      "disjoint from the imp-3850 path it claims to corroborate." +
      "\n\nTHE TIE. All four literals (1.5 -> 1267.788621, 2.0 -> 9365.318970, 2.5 -> 69198.540665, " +
      "3.0 -> 511309.612538) reproduce from the g5/300/hi10 reconstruction to under 5e-7 absolute " +
      "(~4.8e-7, ~2.7e-7, ~2.5e-7, ~3.2e-7). Rounding the fresh reconstruction to the same 6 " +
      "decimals the ladder is stored at reproduces the stored literal EXACTLY at all four tau " +
      "(recon.toFixed(6) === ladder) -- so the entire sub-5e-7 residual is the truncation of the " +
      "7th decimal of the stored number, not reconstruction-precision drift." +
      "\n\nCONFIGURATION INVARIANCE. A third, structurally distinct graded-GL config (grade 6, 400 " +
      "panels, hi=12 -- disjoint from both imp-33213's g5/300/hi10 and imp-3850's g4/200/hi14) lands " +
      "on the same converged value to <= ~1 ULP (max spread ~6e-11 at the tau=3 rung). A residual " +
      "surviving a full change of grade, panel count, and cutoff is a property of A(tau) itself, " +
      "not an artifact of any one quadrature." +
      "\n\nPATH INDEPENDENCE. The imp-33213 grid (3000 nodes: g5/300/hi10) and the imp-3850 grid " +
      "(2000 nodes: g4/200/hi14) share ZERO node abscissae and only the trivial s=0 panel " +
      "breakpoint; the nearest cross-grid node is ~2.9e-12 away. Different grade, panel count, and " +
      "cutoff means the agreement is a genuine cross-path corroboration, not two evaluations of one " +
      "quadrature spelled differently." +
      "\n\nHONEST SCOPE: cross-check/consistency only, RH-equivalent, necessary-but-not-sufficient; " +
      "establishes NO operator positivity. The off-diagonal endpoint-Hankel K_a >= 0 sign-positivity " +
      "(imp-3066) is UNTOUCHED. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the " +
      "rigorous SOTA.",
    firstUsed: "imp-33235 (cross-checking the four imp-33213 log-domain reconciled -ln A(tau) literals against the imp-3736/imp-3850 ladder, pinning the sub-5e-7 residual as pure 6-decimal storage rounding and confirming configuration invariance across three disjoint graded-GL grids plus genuine node-abscissa independence between the imp-33213 and imp-3850 paths), 2026",
    relatedTerms: [
      "imp-33213 cross-validation that the imp-3893 moment weight and the imp-3850 dual-path -ln A(tau) ladder rest on the same autocorrelation (imp-33213)",
      "imp-3850 dual-path -ln A(tau) reconciliation window extended to [1.5,3.0] (imp-3850)",
      "imp-3736 A-weight quadrature convergence assessment (imp-3736)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3888 provenance audit of the imp-3849 R_40 cross-check",
    category: "numerical",
    definition:
      "imp-3849's inner-A(tau)-converged (4800-panel) saddle-ratio ladder cross-checks three prior " +
      "literals: R_3 against imp-3670/imp-3685, R_40 against imp-3685's baked value, and eps_40 " +
      "against imp-3735's converged value. imp-3888 is a read-only audit that imports all four " +
      "source modules directly (no re-derivation, no hand-typed literals) and recomputes the actual " +
      "deltas, to check whether the ~1e-5 informal tie bar stated in the imp-3849 ticket title " +
      "actually holds at all three checks." +
      "\n\nFINDING. Two of the three checks tie comfortably within that ~1e-5 bar: R_3 (imp-3849 " +
      "vs imp-3670/imp-3685) disagrees by ~3.18e-7, and eps_40 (imp-3849 vs imp-3735) disagrees by " +
      "~2.08e-7. The third, R_40 (imp-3849's ~1.02440 vs imp-3685's baked ~1.02438), disagrees by " +
      "~1.21e-5 -- slightly ABOVE the informal ~1e-5 bar, though still comfortably inside imp-3849's " +
      "own coded assertion tolerance for that specific check (1e-4)." +
      "\n\nWHY THE GAP IS REAL, NOT A BUG. R_3 is a small-n ratio that imp-3670 and imp-3685 both " +
      "measure identically, so it is inner-resolution-insensitive. R_40 sits far enough into the " +
      "ladder that imp-3849's converged 4800-panel inner A(tau) quadrature genuinely shifts the " +
      "ratio a few micro-units away from imp-3685's coarser [0,7]/1200-panel grid -- the same " +
      "inner-quadrature-resolution sensitivity axis that imp-3849/imp-3735 originally identified. " +
      "No literal is wrong; the informal ~1e-5 characterization in the imp-3849 ticket title is " +
      "simply tighter than the R_40 check actually warrants, and the audit records that honestly " +
      "instead of silently patching either module's literal." +
      "\n\nHONEST SCOPE: read-only verification/audit only; no bound changed; the off-diagonal " +
      "endpoint-Hankel K_a >= 0 sign-positivity (imp-3066) is UNTOUCHED. No RH verdict, no QED. " +
      "Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3888 (auditing whether the imp-3849 R_3/R_40/eps_40 cross-check literals tie to their certified imp-3670/imp-3685/imp-3735 source modules, finding R_40 sits just above the ticket's informal ~1e-5 bar but inside imp-3849's own 1e-4 assertion tolerance), 2026",
    relatedTerms: [
      "imp-3849 saddle-ratio well-depth inner-converged ladder (imp-3849)",
      "imp-3685 fit-bias saddle-plateau n=40 measurement (imp-3685)",
      "imp-3735 moment-ratio correction tail (imp-3735)",
      "storage-precision assertion tolerance trap (imp-2546, imp-2539)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
  {
    term: "imp-3893 extended moment tilt: the imp-33317 L_n=1 crossing residual is a model-side saddle multiplier, not a discarded true higher moment (imp-33531)",
    category: "measurement",
    definition:
      "imp-33531 quantifies where the imp-33317 ~0.0857-unit arithmetic-floor residual on the " +
      "L_n=1 model-vs-measurement crossing actually lives, by adding the NEXT term the imp-33317 " +
      "reconstruction explicitly drops. Measurement/fit only; no operator positivity, no bound, no QED." +
      "\n\nSETUP. imp-33317 reconstructs the drift as driftRecon1 = driftModel + delta_n with the " +
      "LINEAR moment-tilt term delta_n = (T_n - 1)*lever, where T_n = qTrue/qModel is the imp-3893 " +
      "tilt (ratio of the true moment ratio qTrue = M[n+2]/M[n] to the saddle-window model ratio " +
      "qModel), and lever = n*(1+4*ts). That reconstruction closes ~99.7 percent of the 30.2-unit " +
      "raw crossing gap but leaves CROSS_TRUE - CROSS_RECON1 = 0.08573749 units, with the per-n " +
      "second-order residual (driftTrue - driftRecon1) FLIPPING SIGN at n ~ 74.1 (positive below, " +
      "negative above)." +
      "\n\nEXTENDED TILT. The exact drift is driftTrue = (qModel*T_n/ts^2 - 1)*lever = driftModel + " +
      "(qModel/ts^2)*(T_n - 1)*lever, so the single term imp-33317 discards is the saddle-approx " +
      "multiplier mNext_n = (qModel/ts^2 - 1)*(T_n - 1)*lever -- built ENTIRELY from model-side " +
      "quantities (qModel and the saddle location ts; no qTrue). Adding it gives driftRecon2 = " +
      "driftRecon1 + mNext_n." +
      "\n\nFINDING. The next term closes the residual to MACHINE PRECISION: CROSS_RECON2 = 48.58434117 " +
      "vs CROSS_TRUE = 48.58434117, an extended residual gap of -3.7e-13 (fraction of the 0.0857 " +
      "residual closed = 1.0000000000). The per-n residual under driftRecon2 collapses to float noise " +
      "(max |residual| = 5.7e-14 across n=10..120), so there is NO persistent second residual and NO " +
      "surviving sign-flip -- the discarded higher moments of the true autocorrelation distribution " +
      "carry NOTHING at this order. The scout verdict guess that the 0.0857 was 'carried by the " +
      "discarded higher-moment terms' is thereby REFUTED: the residual is carried entirely by the " +
      "one model-side factor (qModel/ts^2 - 1), the deviation of the model moment ratio from its " +
      "saddle value ts^2, and the observed n ~ 74.1 sign-flip is just the sign change of " +
      "(qModel/ts^2 - 1)*(T_n - 1) itself, absorbed exactly by the extended reconstruction." +
      "\n\nHONEST SCOPE: measurement/fit only, run on the imp-33317 machinery verbatim (T_A=8, NM=3200, " +
      "INNER_FINE=4800, QUAD_N=150000, QUAD_W=16); delivers NO N-uniform certified constant and NO " +
      "operator bound. No RH verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-33531 (measuring whether adding the next higher moment term to the imp-3893 tilt closes the imp-33317 0.0857-unit L_n=1 crossing residual, finding the extended reconstruction closes it to -3.7e-13 machine precision and that the residual is a model-side saddle multiplier, not a discarded true higher moment), 2026",
    relatedTerms: [
      "imp-33317 tilt-closure crossing gap (imp-33317)",
      "imp-3893 moment tilt (imp-3893)",
      "saddle-ratio inner-quadrature axis (imp-3849, imp-3735)",
      "off-diagonal endpoint-Hankel obstruction (imp-3066)",
    ],
    link: "/closure-routes",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Statistics and categories
// ═══════════════════════════════════════════════════════════════════════════

export function glossaryStats() {
  const byCategory = {};
  glossary.forEach(entry => {
    byCategory[entry.category] = (byCategory[entry.category] || 0) + 1;
  });
  return {
    totalEntries: glossary.length,
    byCategory,
  };
}

export function findByTerm(term) {
  return glossary.find(e => e.term.toLowerCase() === term.toLowerCase());
}

export function findByCategory(category) {
  return glossary.filter(e => e.category === category);
}
