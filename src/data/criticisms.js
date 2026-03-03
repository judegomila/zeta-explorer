/**
 * RH Rigor Check: Mathematical Criticisms of the ZPO Model
 *
 * Each entry identifies a specific claim or assumption in the ZPO (Zeta Prime Oscillator)
 * model, explains why it is mathematically problematic from a rigorous RH perspective,
 * provides a corrected formulation, and explains the reasoning.
 *
 * Severity levels:
 *   critical  — Breaks the logical chain; if unfixed, the argument is circular or invalid
 *   major     — Significant gap; the claim lacks proof or uses unjustified assumptions
 *   moderate  — Imprecision that could mislead; the idea has merit but the formulation is wrong
 *   minor     — Cosmetic or pedagogical issue; technically correct but poorly stated
 */

const criticisms = [
  // ═══════════════════════════════════════════════════════════
  //  CRITICAL ISSUES — Logical circularity / invalid reasoning
  // ═══════════════════════════════════════════════════════════
  {
    id: 'crit-001',
    title: 'Circular Reasoning: Hamiltonian Minimization Assumes What It Proves',
    severity: 'critical',
    category: 'logical',
    zpoComponent: 'Hamiltonian',
    originalClaim: `The Hamiltonian H(σ,t) = T + V_mismatch + V_bridge is minimized at σ = 1/2, which "explains" why zeros lie on the critical line.`,
    issue: `The Hamiltonian is **constructed** to have its minimum at σ = 1/2 by design. The bridge term V_bridge = 100·(1 - |χ(s)|)² has a prefactor of 100, chosen ad hoc to dominate the other terms. The impedance mismatch V = ½|Z_dir - Z_dual|² is symmetric about σ = 1/2 by construction (since dual uses s → 1-s). This is not a derivation — it is a tautology: we built a function that is symmetric about σ = 1/2, then observed it has a minimum there.

**The critical flaw:** Minimizing the Hamiltonian at σ = 1/2 does not imply that ζ(s) = 0 only at σ = 1/2. The zeros of ζ are determined by the cancellation condition ζ(s) = 0, not by energy minimization of an externally imposed potential. The Hamiltonian is not derived from ζ — it is reverse-engineered to peak at the critical line.`,
    mathematicalFix: `To make this rigorous, one must either:

1. **Derive** the Hamiltonian from first principles (e.g., as a Schrödinger operator whose eigenvalues are the zeta zeros, per the Hilbert-Pólya conjecture), or
2. **Prove** that the energy minimum implies a zero of ζ, establishing a theorem: "If H(σ₀, t₀) = min_σ H(σ, t₀), then ζ(σ₀ + it₀) = 0."

Neither has been done. The correct framing is: the ZPO Hamiltonian is an **analogy** that illustrates the symmetry of the functional equation, not a proof mechanism.`,
    latex: [
      'H(\\sigma, t) = \\underbrace{T(\\sigma,t)}_{\\text{defined to be symmetric}} + \\underbrace{\\frac{1}{2}|Z_{\\rm dir} - Z_{\\rm dual}|^2}_{\\text{symmetric by } s \\leftrightarrow 1-s} + \\underbrace{100(1-|\\chi|)^2}_{\\text{ad hoc weight}}',
      '\\text{Needed: } \\min_\\sigma H(\\sigma, t_0) = H(\\tfrac{1}{2}, t_0) \\;\\Longrightarrow\\; \\zeta(\\tfrac{1}{2}+it_0) = 0',
      '\\text{But this implication has not been proven.}'
    ],
    status: 'open',
    relatedCriticisms: ['crit-002', 'crit-003'],
    references: ['hilbert-polya', 'connes-1999', 'berry-keating-1999'],
  },

  {
    id: 'crit-002',
    title: 'The Euler Product Diverges in the Critical Strip',
    severity: 'critical',
    category: 'mathematical',
    zpoComponent: 'Euler Product / Oscillator Chain',
    originalClaim: `The product ∏_p 1/(1 - p^{-s}) represents the "cascade transfer function" of the oscillator chain, and its convergence properties determine the behavior of ζ(s).`,
    issue: `The Euler product **only converges absolutely for Re(s) > 1**. In the critical strip 0 < σ ≤ 1, the product diverges. This means the entire oscillator chain model — which is built on cascading Euler factors — is operating in a regime where the mathematical object it claims to represent (the Euler product) does not exist.

The Euler product does converge conditionally on σ = 1 (with t ≠ 0), but this requires careful ordering and does not extend to σ < 1. The ZPO model treats finite truncations of the Euler product as approximations to ζ(s) in the critical strip, but they are not: ∏_{p ≤ N} 1/(1 - p^{-s}) does not converge to ζ(s) for σ ≤ 1 as N → ∞.`,
    mathematicalFix: `The model should be reframed:

1. **For Re(s) > 1:** The oscillator chain is a valid representation — Euler product converges.
2. **For the critical strip:** Use analytic continuation (Borwein, Riemann-Siegel, etc.) and state explicitly that the "oscillator chain" is a **formal analogy**, not a convergent product.
3. **Alternative rigorous path:** Use the explicit formula $\\psi(x) = x - \\sum_\\rho \\frac{x^\\rho}{\\rho} - \\log(2\\pi) - \\frac{1}{2}\\log(1-x^{-2})$ which connects primes to zeros without requiring Euler product convergence in the critical strip.`,
    latex: [
      '\\prod_{p \\leq N} \\frac{1}{1-p^{-s}} \\xrightarrow{N\\to\\infty} \\begin{cases} \\zeta(s) & \\text{if } \\sigma > 1 \\\\ \\text{diverges} & \\text{if } 0 < \\sigma \\leq 1 \\end{cases}',
      '\\text{The ZPO model uses } \\zeta_N(s) = \\prod_{p \\leq p_N} (1-p^{-s})^{-1} \\text{ where convergence fails.}',
      '\\text{Correct: Use the explicit formula } \\psi(x) = x - \\sum_\\rho \\frac{x^\\rho}{\\rho} + \\cdots'
    ],
    status: 'open',
    relatedCriticisms: ['crit-001', 'crit-005'],
    references: ['titchmarsh-1986', 'edwards-1974'],
  },

  {
    id: 'crit-003',
    title: 'Bridge Unitarity Does Not Imply Zeros on Critical Line',
    severity: 'critical',
    category: 'logical',
    zpoComponent: 'Lossless Bridge',
    originalClaim: `The functional equation factor χ(s) has |χ(s)| = 1 precisely on the critical line σ = 1/2, making the bridge "lossless." This unitarity condition is presented as a mechanism forcing zeros to σ = 1/2.`,
    issue: `While it is true that |χ(½ + it)| = 1 (this follows from the functional equation and the symmetry of ξ(s)), this is a **property of the functional equation**, not a zero-location mechanism. The functional equation is:
$$\\zeta(s) = \\chi(s)\\zeta(1-s)$$

At a zero ρ with ζ(ρ) = 0: the equation gives 0 = χ(ρ)·ζ(1-ρ), which means either χ(ρ) = 0 (never happens) or ζ(1-ρ) = 0. This tells us zeros come in pairs {ρ, 1-ρ̄}, but says **nothing** about whether Re(ρ) = 1/2.

The bridge being "lossless" at σ = 1/2 is equivalent to restating the functional equation's symmetry. It does not provide new information about zero locations.`,
    mathematicalFix: `Separate two distinct facts:

1. **Fact (functional equation symmetry):** |χ(½+it)| = 1, so the bridge is "lossless" on the critical line. This is a known, proven identity.
2. **Open question (RH):** Whether all nontrivial zeros have Re(s) = 1/2. The unitarity of χ does not address this.

The correct statement is: "If RH is true, then the system is lossless at every zero. Conversely, a lossless bridge at σ = σ₀ means |χ(σ₀+it)| = 1, which only holds at σ₀ = ½." But this is not a proof — it is logically equivalent to assuming RH.`,
    latex: [
      '|\\chi(\\tfrac{1}{2}+it)| = 1 \\quad \\text{(proven: functional equation symmetry)}',
      '\\zeta(\\rho) = 0 \\implies \\zeta(1-\\bar{\\rho}) = 0 \\quad \\text{(zero pairing, not zero location)}',
      '\\text{Gap: } |\\chi(\\sigma_0+it_0)| = 1 \\iff \\sigma_0 = \\tfrac{1}{2} \\text{ does NOT imply } \\zeta(\\sigma_0+it_0) = 0'
    ],
    status: 'open',
    relatedCriticisms: ['crit-001', 'crit-006'],
    references: ['titchmarsh-1986', 'iwaniec-kowalski-2004'],
  },

  // ═══════════════════════════════════════════════════════════
  //  MAJOR ISSUES — Significant gaps in reasoning
  // ═══════════════════════════════════════════════════════════
  {
    id: 'crit-004',
    title: 'LC Resonator Analogy Has No Rigorous Justification',
    severity: 'major',
    category: 'mathematical',
    zpoComponent: 'Oscillator Stages',
    originalClaim: `Each prime p defines an LC resonator with inductance L_p = log(p) and capacitance C_p = 1/log(p). The quality factor Q_p = 1/(2σ) determines the bandwidth.`,
    issue: `The assignment L_p = log(p), C_p = 1/log(p) is **arbitrary**. The Euler factor 1/(1 - p^{-s}) can be written as a geometric series or a feedback system, but this does not uniquely determine LC values. Different circuit topologies (T-network, π-network, lattice) would give different component values with the same transfer function.

Furthermore, the claim Q_p = 1/(2σ) conflates the damping parameter σ with a physical dissipation mechanism. In a real LC circuit, Q is determined by resistance R; here σ is the real part of a complex frequency parameter. The "resonant frequency" ω_p = log(p) is also not a resonance of H_p(s) — the poles of H_p(s) = 1/(1-p^{-s}) are at s = 2πik/log(p) (on the imaginary axis), not at ω = log(p).`,
    mathematicalFix: `Be explicit about the analogy's limits:

1. The Euler factor 1/(1-p^{-s}) has poles at s = 2πik/log(p) for k ∈ ℤ. These are purely imaginary, corresponding to **undamped** resonances.
2. A more honest circuit model would identify: the "transfer function" H_p(s) = 1/(1-e^{-s·log p}) = 1/(1-z) where z = p^{-s}, which is a simple feedback loop with loop gain G = p^{-s}, not an LC resonator.
3. State that L_p, C_p are chosen by convention to make the analogy pretty, not derived from the mathematics.`,
    latex: [
      'H_p(s) = \\frac{1}{1-p^{-s}} \\text{ has poles at } s_k = \\frac{2\\pi i k}{\\log p}, \\; k \\in \\mathbb{Z}',
      '\\text{These are on } \\sigma = 0, \\text{ not at } \\omega = \\log p',
      'Q_p = \\frac{1}{2\\sigma} \\text{ is not a circuit quality factor — it is a mathematical identity}'
    ],
    status: 'open',
    relatedCriticisms: ['crit-002', 'crit-005'],
    references: ['cauer-1926', 'belevitch-1968'],
  },

  {
    id: 'crit-005',
    title: 'Impedance Matching Argument Is Insufficient for RH',
    severity: 'major',
    category: 'logical',
    zpoComponent: 'Direct/Dual Ladder Matching',
    originalClaim: `The direct ladder (computing ζ(s)) and dual ladder (computing ζ(1-s)) are "impedance matched" at σ = 1/2 because the transformation s → 1-s maps the critical line to itself. This matching is presented as a physical mechanism for RH.`,
    issue: `The impedance mismatch |Z_dir(s) - Z_dual(s)| is defined using finite truncations of the Euler product in a region where it diverges (see crit-002). Even if we accept the formal expression:

The mismatch is small at σ = 1/2 because the model defines Z_dual(s) = Z_dir(1-s), and the functional equation guarantees symmetry about σ = 1/2. But "impedance matching" in circuit theory means **no reflection at the junction** — it does not mean "the output is zero." A perfectly matched transmission line has maximum power transfer, not zero output.

The confusion is: ζ(s) = 0 requires **destructive interference** (cancellation), not impedance matching (maximum transfer). These are opposite physical phenomena.`,
    mathematicalFix: `The correct circuit-theoretic analog of a zero of ζ would be a **transmission zero**, not an impedance match. In filter theory:

- Impedance match → maximum power transfer (|S₁₁| = 0, |S₂₁| = 1)
- Transmission zero → zero output (|S₂₁| = 0)

The ZPO model should distinguish:
1. σ = 1/2 gives impedance matching (functional equation symmetry) — this is about the bridge, not about zeros
2. Zeros of ζ are transmission nulls where the cascade transfer function vanishes — a separate phenomenon

The correct question is: why does the cascade ∏ H_p(s) produce transmission zeros only on the critical line?`,
    latex: [
      '\\text{Impedance match: } Z_{\\rm dir}(s) = Z_{\\rm dual}(s) \\implies |S_{11}| = 0 \\text{ (no reflection)}',
      '\\text{Transmission zero: } \\zeta(s) = 0 \\implies |S_{21}| = 0 \\text{ (no transmission)}',
      '\\text{These are } \\textbf{different} \\text{ conditions! The model conflates them.}'
    ],
    status: 'open',
    relatedCriticisms: ['crit-001', 'crit-003'],
    references: ['berry-keating-1999'],
  },

  {
    id: 'crit-006',
    title: 'Reflection Coefficient Formula Is Physically Incorrect',
    severity: 'major',
    category: 'mathematical',
    zpoComponent: 'Scattering Matrix',
    originalClaim: `The reflection coefficient is defined as Γ = |1 - |χ(s)|| / (1 + |χ(s)|), which goes to zero when |χ| = 1 (σ = 1/2).`,
    issue: `The standard reflection coefficient in microwave/transmission line theory is:
$$\\Gamma = \\frac{Z_L - Z_0}{Z_L + Z_0}$$
which is a **complex** quantity involving actual impedances. The ZPO model uses |1 - |χ|| / (1 + |χ|), which:

1. Discards all phase information (uses magnitudes only)
2. Is not the standard Γ formula (missing the complex structure)
3. Does not correspond to any physical scattering parameter

For a true two-port network, the scattering matrix S has four parameters (S₁₁, S₁₂, S₂₁, S₂₂), and unitarity means S†S = I. The model computes |χ| and calls it "unitarity" but does not actually verify S†S = I for the full 2×2 matrix.`,
    mathematicalFix: `Define the scattering matrix properly:

The functional equation ζ(s) = χ(s)·ζ(1-s) can be written in matrix form for the "bridge" two-port. Define:
- a₁ = input wave from direct ladder = ζ_N(s) (partial product)
- b₁ = reflected wave back to direct ladder
- a₂ = input from dual ladder = ζ_N(1-s)
- b₂ = output to dual ladder

Then S should satisfy (b₁, b₂)ᵀ = S·(a₁, a₂)ᵀ with S derived from χ(s). The proper scattering matrix is:
$$S(s) = \\frac{1}{1+|\\chi|^2}\\begin{pmatrix} 1-|\\chi|^2 & 2\\chi \\\\ 2\\bar{\\chi} & |\\chi|^2-1 \\end{pmatrix}$$
which is unitary if and only if |χ| = 1.`,
    latex: [
      '\\Gamma_{\\text{ZPO}} = \\frac{|1-|\\chi||}{1+|\\chi|} \\quad \\text{(not a standard reflection coefficient)}',
      '\\Gamma_{\\text{correct}} = \\frac{Z_L - Z_0}{Z_L + Z_0} \\in \\mathbb{C} \\quad \\text{(complex, phase-sensitive)}',
      'S = \\frac{1}{1+|\\chi|^2}\\begin{pmatrix} 1-|\\chi|^2 & 2\\chi \\\\ 2\\bar{\\chi} & |\\chi|^2-1 \\end{pmatrix}'
    ],
    status: 'patched',
    patch: 'The scattering matrix should be computed as a full 2×2 complex matrix, not reduced to a scalar magnitude.',
    relatedCriticisms: ['crit-003', 'crit-005'],
    references: ['belevitch-1968'],
  },

  // ═══════════════════════════════════════════════════════════
  //  MODERATE ISSUES — Imprecisions that could mislead
  // ═══════════════════════════════════════════════════════════
  {
    id: 'crit-007',
    title: 'Energy Stored Formula Uses Wrong Physical Definition',
    severity: 'moderate',
    category: 'mathematical',
    zpoComponent: 'Oscillator Stages',
    originalClaim: `Energy stored in oscillator stage p is E_p = ½ L_p |H_p(s)|². This represents the "kinetic energy" of the oscillator.`,
    issue: `In a real LC circuit, the energy stored is E = ½L|I|² + ½C|V|², where I is the current and V the voltage. The ZPO model computes E = ½·log(p)·|H_p|², which uses the **transfer function magnitude** in place of current.

The transfer function H_p = 1/(1-p^{-s}) is a frequency-domain ratio (output/input), not a time-domain current. Using |H|² as if it were |I|² conflates:
- Transfer function (dimensionless gain)
- State variable (current or voltage with physical dimensions)

This makes the "energy" computation a dimensionally inconsistent quantity.`,
    mathematicalFix: `Either:
1. Define energy via the spectral density: E_p = ∫|H_p(iω)|² dω / (2π), which gives the total energy in the frequency band passed by the filter. This is Parseval's theorem applied to the impulse response.
2. Or use the Hilbert-Pólya energy framework: associate eigenvalues E_n = ½ + iγ_n with the zeros ρ_n = ½ + iγ_n, and define energy as the spectral parameter, not a circuit quantity.

The second approach connects to the actual mathematics of RH.`,
    latex: [
      'E_{\\text{ZPO}} = \\tfrac{1}{2} L_p |H_p(s)|^2 \\quad \\text{(dimensionally inconsistent)}',
      'E_{\\text{circuit}} = \\tfrac{1}{2}L|I|^2 + \\tfrac{1}{2}C|V|^2 \\quad \\text{(correct LC energy)}',
      'E_{\\text{spectral}} = \\frac{1}{2\\pi}\\int_{-\\infty}^{\\infty} |H_p(i\\omega)|^2 \\, d\\omega \\quad \\text{(Parseval)}'
    ],
    status: 'open',
    relatedCriticisms: ['crit-004'],
    references: [],
  },

  {
    id: 'crit-008',
    title: 'GUE Statistics Are a Consequence, Not an Explanation',
    severity: 'moderate',
    category: 'logical',
    zpoComponent: 'Statistics / Random Matrix Theory',
    originalClaim: `The zero spacing distribution matches GUE (Gaussian Unitary Ensemble) statistics, which is "consistent with" the oscillator model having a Hermitian Hamiltonian structure.`,
    issue: `The Montgomery-Odlyzko law (GUE statistics for zeta zeros) is a deep empirical observation confirmed to high precision. However:

1. GUE statistics arise from **many** systems, not just the ZPO model. Any Hermitian matrix model with time-reversal symmetry breaking will show GUE statistics. This is universality, not specificity.
2. The ZPO Hamiltonian H(σ,t) is **not** a quantum-mechanical operator — it is a classical energy function. It does not have eigenvalues in the operator sense. The GUE connection requires a **quantum Hamiltonian** (self-adjoint operator on L²) whose eigenvalues are the zeros.
3. Observing GUE consistency does not validate the ZPO model specifically — any model that reproduces GUE would be equally "consistent."`,
    mathematicalFix: `State precisely:
1. GUE statistics are a universal prediction: many Hamiltonians produce them
2. The ZPO Hamiltonian is classical, not quantum — it cannot have eigenvalues that are zeta zeros
3. The correct framework is: "There exists a self-adjoint operator T on some Hilbert space such that the eigenvalues of ½ + iT are the nontrivial zeros of ζ" (Hilbert-Pólya). The ZPO model is an **illustration**, not a construction of T.`,
    latex: [
      'P_{\\text{GUE}}(s) = \\frac{32}{\\pi^2}s^2 e^{-4s^2/\\pi} \\quad \\text{(universal — many sources)}',
      'T \\text{ self-adjoint on } \\mathcal{H} \\text{ with } \\text{spec}(T) = \\{\\gamma_n\\} \\quad \\text{(Hilbert-Pólya conjecture)}',
      'H_{\\text{ZPO}}(\\sigma,t) \\in \\mathbb{R} \\quad \\text{(classical function, not an operator)}'
    ],
    status: 'open',
    relatedCriticisms: ['crit-001'],
    references: ['montgomery-1973', 'odlyzko-1989', 'berry-keating-1999'],
  },

  {
    id: 'crit-009',
    title: 'Numerical Evidence for Finite Primes Does Not Extend to Infinitely Many',
    severity: 'moderate',
    category: 'numerical',
    zpoComponent: 'All Visualizations',
    originalClaim: `Visualizations showing 5–100 primes demonstrate convergence, matching, and minimization properties that support the ZPO model.`,
    issue: `All numerical demonstrations in the app use at most ~100 primes. The Euler product has infinitely many factors, and convergence behavior can change dramatically between finite and infinite products:

1. A partial Euler product with 100 primes covers primes up to 541. There are infinitely many primes beyond this.
2. In the critical strip, the partial products **oscillate increasingly** as more primes are added — the finite-prime behavior is qualitatively different from the limit.
3. The "impedance matching at σ = 1/2" observed with 20 primes could fail at 10⁶ primes.

In analytic number theory, many phenomena that appear stable for small N break down for large N (e.g., Mertens conjecture, Skewes' number).`,
    mathematicalFix: `Add explicit disclaimers: "This visualization uses N primes. The Euler product diverges for σ ≤ 1 as N → ∞."

Better: supplement the visual with:
1. Asymptotic analysis: how does the impedance mismatch scale with N?
2. Proven bounds: use the zero-free region |ζ(σ+it)| > c/(log t) for σ > 1 - c/log(t)
3. Reference the Riemann-von Mangoldt formula N(T) ~ T/(2π)·log(T/(2πe)) for zero count below height T`,
    latex: [
      '\\prod_{p \\leq p_N} \\frac{1}{1-p^{-s}} \\quad \\text{with } N \\leq 100 \\text{ covers primes } \\leq 541',
      '\\lim_{N\\to\\infty} \\text{ is qualitatively different for } \\sigma \\leq 1',
      'N(T) = \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e} + O(\\log T) \\quad \\text{(zero counting function)}'
    ],
    status: 'open',
    relatedCriticisms: ['crit-002'],
    references: ['titchmarsh-1986', 'ivic-2003'],
  },

  {
    id: 'crit-010',
    title: 'De Bruijn-Newman Constant Presentation Omits Key Context',
    severity: 'moderate',
    category: 'mathematical',
    zpoComponent: 'Supercritical / Li Criterion',
    originalClaim: `The de Bruijn-Newman constant Λ satisfies Λ ≤ 0 (possibly Λ = 0), and this is related to the "heat flow" in the ZPO model.`,
    issue: `The de Bruijn-Newman constant was proven to satisfy Λ ≥ 0 by Rodgers and Tao (2020). Combined with the known upper bound, this means Λ = 0 would be equivalent to RH. However:

1. The model shows "heat flow" as a smooth deformation, but the behavior of Ξ_λ(z) for λ > 0 involves the Newman conjecture (now Rodgers-Tao theorem) Λ ≥ 0, meaning RH sits at the boundary of a phase transition.
2. The visual may give the impression that Λ = 0 has been proven, when in fact only the non-strict inequality Λ ≥ 0 is known.
3. Current best bounds: 0 ≤ Λ ≤ 0.2 (Platt and Trudgian, 2021).`,
    mathematicalFix: `Show the full picture:
- Λ ≥ 0 (Rodgers-Tao 2020, Fields Medal work by Tao)
- Λ ≤ 0.2 (Platt-Trudgian 2021)
- RH ⟺ Λ = 0
- The "heat flow" deformation Ξ_λ preserves zeros on the real line for λ ≥ 0, and may move them off for λ < 0
- This is strong evidence FOR RH (the constant is very close to 0) but not a proof`,
    latex: [
      '0 \\leq \\Lambda \\leq 0.2 \\quad \\text{(Rodgers-Tao 2020; Platt-Trudgian 2021)}',
      '\\text{RH} \\iff \\Lambda = 0',
      '\\Xi_\\lambda(z) = \\int_0^\\infty e^{\\lambda u^2} \\Phi(u) \\cos(zu)\\,du'
    ],
    status: 'patched',
    patch: 'Display the known bounds for Λ and clearly distinguish between the theorem (Λ ≥ 0) and the conjecture (Λ = 0 ⟺ RH).',
    relatedCriticisms: [],
    references: ['rodgers-tao-2020'],
  },

  // ═══════════════════════════════════════════════════════════
  //  MINOR ISSUES — Cosmetic / pedagogical
  // ═══════════════════════════════════════════════════════════
  {
    id: 'crit-011',
    title: 'Terminology: "Lossless" Misused in Signal Processing Context',
    severity: 'minor',
    category: 'terminology',
    zpoComponent: 'Lossless Bridge',
    originalClaim: `The bridge is called "lossless" when |χ(s)| = 1.`,
    issue: `In signal processing and circuit theory, "lossless" means the system neither adds nor removes energy — it is a property of the **system** (network), not of a single frequency point. A system is lossless if its scattering matrix S(jω) is unitary for all real ω.

The ZPO model calls the bridge "lossless" based on |χ(s)| = 1 at specific (σ,t) values. But χ(s) is not a scattering parameter in the standard sense — it relates two different functions (ζ(s) and ζ(1-s)) rather than describing input-output at a single port.`,
    mathematicalFix: `Use more precise language: "The functional equation prefactor χ(s) has unit magnitude on the critical line, analogous to a lossless coupling in circuit theory." The qualifier "analogous to" is important.`,
    latex: [
      '|\\chi(\\tfrac{1}{2}+it)| = 1 \\quad \\forall t \\in \\mathbb{R} \\quad \\text{(unit magnitude on critical line)}',
      'S^\\dagger S = I \\quad \\forall \\omega \\quad \\text{(true losslessness — all frequencies)}'
    ],
    status: 'patched',
    patch: 'Prefix all "lossless" claims with "analogous to" or "in the sense that |χ| = 1."',
    relatedCriticisms: ['crit-003', 'crit-006'],
    references: [],
  },

  {
    id: 'crit-012',
    title: 'The Model Cannot Distinguish RH-True from RH-False Universes',
    severity: 'critical',
    category: 'logical',
    zpoComponent: 'Entire ZPO Framework',
    originalClaim: `The ZPO model provides physical/engineering intuition for why RH should be true, through energy minimization, impedance matching, and lossless bridge arguments.`,
    issue: `The definitive test of any RH approach is: can it distinguish between a world where RH is true and one where it is false?

Consider a hypothetical L-function L(s, χ_D) that violates GRH (has an off-line zero). The ZPO model could be applied to it identically:
- Build an "Euler product" ladder from its Euler factors
- Define a "dual ladder" via its functional equation
- Define a "bridge" from its gamma factors
- Compute a "Hamiltonian" with the same structure

The Hamiltonian would STILL be minimized at σ = 1/2 by construction, even though the function has off-line zeros. This means the ZPO argument proves too much — it would "prove" GRH for all L-functions, including hypothetical ones that violate it.

An argument that cannot be false is not a proof.`,
    mathematicalFix: `This is the deepest issue. To make the ZPO framework into a genuine approach to RH, one would need to:

1. Identify a **specific** property of the Riemann zeta function (as opposed to general L-functions) that the model uses
2. Show that this property implies zeros on the critical line
3. Show that the property fails for functions with off-line zeros (like the Davenport-Heilbronn function ζ_Q(√5))

The Davenport-Heilbronn function satisfies a functional equation but has zeros OFF the critical line. Any valid RH proof technique must fail when applied to it. The ZPO model does not.`,
    latex: [
      'f(s) = \\sum_{n=1}^\\infty \\frac{a_n}{n^s} \\text{ with functional equation, zeros off } \\sigma = \\tfrac{1}{2}',
      '\\text{Example: Davenport-Heilbronn } \\zeta_{\\mathbb{Q}(\\sqrt{5})}(s) \\text{ has off-line zeros}',
      '\\text{ZPO applied to DH function would still "minimize" at } \\sigma = \\tfrac{1}{2}'
    ],
    status: 'open',
    relatedCriticisms: ['crit-001', 'crit-003'],
    references: ['davenport-heilbronn-1936', 'iwaniec-kowalski-2004'],
  },
];

// ═══════════════════════════════════════════════════════════
//  Export utilities
// ═══════════════════════════════════════════════════════════

export function getAllCriticisms() {
  return criticisms;
}

export function getCriticismsByCategory() {
  const cats = {};
  criticisms.forEach(c => {
    if (!cats[c.category]) cats[c.category] = { name: c.category, count: 0 };
    cats[c.category].count++;
  });
  return Object.values(cats).sort((a, b) => b.count - a.count);
}

export function getCriticismsBySeverity() {
  const order = ['critical', 'major', 'moderate', 'minor'];
  const groups = {};
  order.forEach(s => groups[s] = []);
  criticisms.forEach(c => {
    if (groups[c.severity]) groups[c.severity].push(c);
  });
  return groups;
}

export function getCriticismById(id) {
  return criticisms.find(c => c.id === id);
}

export const SEVERITY_META = {
  critical: { label: 'Critical', color: '#ef4444', icon: '!!' },
  major: { label: 'Major', color: '#f59e0b', icon: '!' },
  moderate: { label: 'Moderate', color: '#3b82f6', icon: '~' },
  minor: { label: 'Minor', color: '#64748b', icon: '·' },
};

export const CATEGORY_META = {
  logical: { label: 'Logical Gap', color: '#ef4444' },
  mathematical: { label: 'Mathematical Error', color: '#f59e0b' },
  numerical: { label: 'Numerical Limitation', color: '#3b82f6' },
  terminology: { label: 'Terminology', color: '#64748b' },
};
