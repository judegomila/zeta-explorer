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
