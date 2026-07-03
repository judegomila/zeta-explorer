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
      "verdict, no QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.",
    firstUsed: "imp-3558 (four-rung far-tail xi* band-max grid ladder extension to N=9600, xi_Nyq~5027), 2026",
    relatedTerms: [
      "PSD peak-slope maximizer xi* = 12.0870439 (transcendental root of P2(xi) = 0) (imp-3470)",
      "PSD peak-slope maximizer xi* = 12.0870439: U-invariance and global uniqueness (imp-3489, imp-3483)",
      "far-tail xi* replica-hiding grid threshold N_replica~764 (imp-3582)",
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
