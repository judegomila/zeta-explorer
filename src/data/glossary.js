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
