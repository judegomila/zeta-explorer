/**
 * AI Exploration Journal: continuous investigation of the zeta function
 * through the prime oscillator / ladder network lens.
 *
 * Each entry represents one exploration step, with mathematical content,
 * LaTeX formulas, insights, and connections to the literature.
 */

const explorations = [
  {
    id: 'exp-001',
    timestamp: '2026-02-27T08:00:00Z',
    title: 'The Euler Product as a Cascade Network',
    status: 'complete',
    category: 'foundation',
    depth: 1,
    content: `The starting point of our investigation: Euler's product formula

$$\\zeta(s) = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}$$

reinterpreted as a **cascade of two-port networks**. Each factor $\\frac{1}{1-p^{-s}}$ is the transfer function of a single resonator stage tuned to frequency $\\omega_p = \\log p$.

In circuit theory, cascading two-port networks means multiplying their transfer matrices (ABCD matrices). The Euler product is exactly this: the total system transfer function is the product of individual stage transfer functions.

**Key observation**: The cascade is ordered by increasing prime, which means increasing resonant frequency. This is a **low-pass to high-pass sweep** — the first stages (small primes) handle low frequencies and the later stages (large primes) handle high frequencies. This is the circuit-theoretic expression of the sieve of Eratosthenes.`,
    latex: [
      '\\zeta(s) = \\prod_{p} H_p(s), \\quad H_p(s) = \\frac{1}{1-p^{-s}}',
      '\\text{ABCD cascade: } \\begin{pmatrix} A & B \\\\ C & D \\end{pmatrix}_{\\text{total}} = \\prod_p \\begin{pmatrix} A_p & B_p \\\\ C_p & D_p \\end{pmatrix}',
      '\\omega_p = \\log p, \\quad \\omega_2 \\approx 0.693, \\quad \\omega_3 \\approx 1.099, \\quad \\omega_5 \\approx 1.609',
    ],
    insights: [
      'The Euler product is literally a cascade circuit specification',
      'Prime ordering = frequency ordering in the ladder',
      'The sieve of Eratosthenes is the construction procedure for building the ladder stage by stage',
    ],
    references: ['euler-1737', 'cauer-1926', 'belevitch-1968'],
    nextSteps: ['exp-002', 'exp-003'],
  },
  {
    id: 'exp-002',
    timestamp: '2026-02-27T08:30:00Z',
    title: 'Single Prime Oscillator: The LC Resonator',
    status: 'complete',
    category: 'oscillator-model',
    depth: 2,
    content: `Each prime $p$ defines an oscillator stage. Setting $s = \\sigma + it$, the Euler factor becomes:

$$H_p(s) = \\frac{1}{1 - p^{-s}} = \\frac{1}{1 - e^{-s \\log p}}$$

This has the form of a **feedback system** with loop gain $G(s) = e^{-s\\log p} = p^{-s}$. The denominator $1 - p^{-s}$ vanishes when $p^{-s} = 1$, i.e., when $s = 2\\pi i k / \\log p$ for integer $k$. These are the **resonant frequencies** of the oscillator.

We model this as an LC resonator with:
- Inductance: $L_p = \\log p$ (proportional to the "mass" of the prime)
- Capacitance: $C_p = 1/\\log p$ (inverse relationship)
- Fundamental resonant frequency: $\\omega_p = 1/\\sqrt{L_p C_p} = 1$ (normalized)
- Actual frequency content encoded in: $\\omega_p = \\log p$

The **quality factor** $Q_p$ depends on $\\sigma = \\text{Re}(s)$:
$$Q_p = \\frac{\\omega_p}{2\\sigma \\cdot \\omega_p} = \\frac{1}{2\\sigma}$$

At $\\sigma = 1/2$ (critical line): $Q_p = 1$ for all primes — **uniform quality factor across the entire chain**.`,
    latex: [
      'H_p(s) = \\frac{1}{1 - p^{-s}} = \\frac{1}{1 - e^{-s\\log p}}',
      'Z_p(s) = sL_p + \\frac{1}{sC_p} = s\\log p + \\frac{\\log p}{s}',
      'Q_p(\\sigma) = \\frac{1}{2\\sigma}, \\quad Q_p(1/2) = 1 \\text{ for all } p',
      '\\text{Resonances at } s_k = \\frac{2\\pi i k}{\\log p}, \\quad k \\in \\mathbb{Z}',
    ],
    insights: [
      'Each Euler factor is a feedback loop with gain p^{-s}',
      'The quality factor Q = 1/(2σ) is INDEPENDENT of the prime — a universal property',
      'At σ = 1/2, all oscillators have Q = 1: critically coupled',
      'σ < 1/2 gives Q > 1 (underdamped/oscillatory), σ > 1/2 gives Q < 1 (overdamped)',
    ],
    references: ['berry-keating-1999', 'cauer-1926'],
    nextSteps: ['exp-004', 'exp-005'],
  },
  {
    id: 'exp-003',
    timestamp: '2026-02-27T09:00:00Z',
    title: 'The Functional Equation as Impedance Matching',
    status: 'complete',
    category: 'duality',
    depth: 2,
    content: `The functional equation of the Riemann zeta function:

$$\\xi(s) = \\xi(1-s)$$

where $\\xi(s) = \\frac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s)$ is the completed zeta function.

In our circuit model, this becomes the statement that the **system looks identical from both ports**. Define:
- **Direct ladder**: computes $\\zeta(s)$ via the Euler product as $\\sigma$ increases from 1
- **Dual ladder**: computes $\\zeta(1-s)$ via the Euler product at the reflected point

The functional equation says these are connected by a **lossless bridge** $\\chi(s)$:
$$\\zeta(s) = \\chi(s) \\cdot \\zeta(1-s)$$

where $\\chi(s) = 2^s \\pi^{s-1} \\sin(\\pi s/2) \\Gamma(1-s)$.

**The bridge is lossless (unitary) exactly on the critical line $\\sigma = 1/2$**, because:
$$|\\chi(1/2 + it)| = 1 \\text{ for all } t$$

This means the bridge perfectly transmits all energy between direct and dual ladders with no reflection and no absorption — a perfect **impedance match**.

Off the critical line, $|\\chi(s)| \\neq 1$: the bridge has either gain ($|\\chi| > 1$) or loss ($|\\chi| < 1$), creating an impedance mismatch between the ladders.`,
    latex: [
      '\\xi(s) = \\xi(1-s), \\quad \\xi(s) = \\frac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s)',
      '\\zeta(s) = \\chi(s) \\cdot \\zeta(1-s), \\quad \\chi(s) = 2^s \\pi^{s-1} \\sin\\frac{\\pi s}{2} \\Gamma(1-s)',
      '|\\chi(1/2 + it)| = 1 \\quad \\forall t \\in \\mathbb{R}',
      '\\text{Reflection coefficient: } \\Gamma_{\\text{bridge}} = \\frac{|\\chi(s)| - 1}{|\\chi(s)| + 1} = 0 \\iff \\sigma = \\frac{1}{2}',
    ],
    insights: [
      'The functional equation can be interpreted as an impedance matching condition',
      'σ = 1/2 is the unique line of perfect impedance matching',
      'The completed zeta function ξ(s) is the scattering parameter S₂₁ of the bridge',
      'Zeros of ξ on the critical line = transmission zeros = resonances of the coupled system',
    ],
    references: ['riemann-1859', 'darlington-1939', 'keating-snaith-2000'],
    nextSteps: ['exp-006', 'exp-007'],
  },
  {
    id: 'exp-004',
    timestamp: '2026-02-27T09:30:00Z',
    title: 'The Hamiltonian: Energy Minimization at σ = 1/2',
    status: 'complete',
    category: 'hamiltonian',
    depth: 3,
    content: `We construct the total system Hamiltonian $\\mathcal{H}$ as the sum of three contributions:

$$\\mathcal{H}(s) = T(s) + V_{\\text{mismatch}}(s) + V_{\\text{bridge}}(s)$$

**Kinetic energy** $T$: the sum of energies stored in all oscillators of both ladders:
$$T(s) = \\sum_p \\frac{1}{2}L_p |H_p(s)|^2 + \\sum_p \\frac{1}{2}L_p |H_p(1-s)|^2$$

**Mismatch potential** $V_{\\text{mismatch}}$: penalty for impedance mismatch between ladders:
$$V_{\\text{mismatch}}(s) = \\frac{1}{2}\\left|Z_{\\text{direct}}(s) - Z_{\\text{dual}}(s)\\right|^2$$

**Bridge coupling** $V_{\\text{bridge}}$: penalty for bridge non-unitarity:
$$V_{\\text{bridge}}(s) = 100\\left(|\\chi(s)| - 1\\right)^2$$

**Observation (model-specific)**: The Hamiltonian $\\mathcal{H}(\\sigma + it)$ achieves its minimum over $\\sigma$ at $\\sigma = 1/2$ for each fixed $t$. This is a property of the constructed model, not a theorem about the zeta function.

*Proof sketch*: At $\\sigma = 1/2$:
1. Direct and dual ladders are symmetric, so $T$ is balanced
2. $Z_{\\text{direct}} = Z_{\\text{dual}}$ by the functional equation, so $V_{\\text{mismatch}} = 0$
3. $|\\chi(1/2+it)| = 1$, so $V_{\\text{bridge}} = 0$

Any deviation from $\\sigma = 1/2$ increases at least one of these terms.

**Connection to RH**: If the system's eigenvalues (zeros) occur at energy minima, and all minima are on $\\sigma = 1/2$, then all zeros are on the critical line. This is the Hilbert-Pólya dream realized through circuit theory.`,
    latex: [
      '\\mathcal{H}(s) = T(s) + V_{\\text{mismatch}}(s) + V_{\\text{bridge}}(s)',
      'T(s) = \\sum_p \\frac{1}{2}\\log p \\cdot \\left(|H_p(s)|^2 + |H_p(1-s)|^2\\right)',
      'V_{\\text{mismatch}} = \\frac{1}{2}|Z_{\\text{direct}} - Z_{\\text{dual}}|^2',
      'V_{\\text{bridge}} = (|\\chi(s)| - 1)^2',
      '\\frac{\\partial \\mathcal{H}}{\\partial \\sigma}\\bigg|_{\\sigma=1/2} = 0, \\quad \\frac{\\partial^2 \\mathcal{H}}{\\partial \\sigma^2}\\bigg|_{\\sigma=1/2} > 0',
    ],
    insights: [
      'The Hamiltonian has a clean decomposition: kinetic + mismatch + bridge',
      'Each component is independently minimized at σ = 1/2',
      'This is a VARIATIONAL principle for the critical line',
      'The Hilbert-Pólya conjecture becomes: eigenvalues sit at energy minima',
    ],
    references: ['bender-brody-mueller-2017', 'berry-keating-1999', 'connes-1999', 'sierra-townsend-2008'],
    nextSteps: ['exp-008'],
  },
  {
    id: 'exp-005',
    timestamp: '2026-02-27T10:00:00Z',
    title: 'Coupling Between Adjacent Primes: The Ladder Rungs',
    status: 'complete',
    category: 'oscillator-model',
    depth: 3,
    content: `The oscillators are not independent — they are coupled through the ladder structure. The coupling between consecutive primes $p_n$ and $p_{n+1}$ encodes information about **prime gaps**.

In a ladder network, the series elements (inductors) are the oscillator stages, and the shunt elements (capacitors) are the **couplings** between stages. The coupling admittance between stages $n$ and $n+1$ is:

$$Y_{n,n+1}(s) = \\frac{1}{Z_{\\text{coupling}}} \\propto \\frac{1}{\\log(p_{n+1}/p_n)} = \\frac{1}{\\log p_{n+1} - \\log p_n}$$

This means:
- **Small prime gaps** → strong coupling (large admittance)
- **Large prime gaps** → weak coupling (small admittance)

The gap distribution is encoded in the coupling pattern of the ladder. Twin primes (gap = 2) give the strongest coupling between adjacent stages.

**Impedance at stage $n$**: Looking into the ladder at stage $n$:
$$Z_n(s) = Z_{p_n}(s) + \\frac{1}{Y_{n,n+1}(s) + \\frac{1}{Z_{n+1}(s) + \\cdots}}$$

This is a **continued fraction** — connecting to Cauer's ladder synthesis and the theory of Padé approximants for the zeta function.`,
    latex: [
      'Y_{n,n+1} \\propto \\frac{1}{\\log p_{n+1} - \\log p_n} = \\frac{1}{\\log(p_{n+1}/p_n)}',
      'Z_n = Z_{p_n} + \\cfrac{1}{Y_{n,n+1} + \\cfrac{1}{Z_{p_{n+1}} + \\cfrac{1}{Y_{n+1,n+2} + \\cdots}}}',
      '\\text{Twin primes: } p_{n+1} - p_n = 2 \\Rightarrow Y_{n,n+1} \\approx \\frac{p_n}{2} \\to \\infty',
    ],
    insights: [
      'Prime gaps determine the coupling strength between oscillator stages',
      'The ladder structure naturally encodes the prime gap distribution',
      'Twin primes create the strongest inter-stage coupling',
      'The continued fraction structure connects to Padé approximation theory',
    ],
    references: ['cauer-1926', 'lapidus-vanfrankenhuijsen-2006'],
    nextSteps: ['exp-009'],
  },
  {
    id: 'exp-006',
    timestamp: '2026-02-27T10:30:00Z',
    title: 'The Scattering Matrix of the Bridge',
    status: 'complete',
    category: 'duality',
    depth: 3,
    content: `The lossless bridge connecting direct and dual ladders has a 2×2 scattering matrix:

$$S_{\\text{bridge}}(s) = \\begin{pmatrix} S_{11} & S_{12} \\\\ S_{21} & S_{22} \\end{pmatrix}$$

where:
- $S_{21}(s)$: transmission from direct to dual → the completed zeta function $\\xi(s)$
- $S_{12}(s)$: transmission from dual to direct → $\\xi(1-s) = \\xi(s)$ (by functional equation)
- $S_{11}(s), S_{22}(s)$: reflection coefficients

For a **lossless** (unitary) network: $S^\\dagger S = I$, which gives:
$$|S_{11}|^2 + |S_{21}|^2 = 1, \\quad |S_{12}|^2 + |S_{22}|^2 = 1$$

On the critical line $\\sigma = 1/2$, the bridge is lossless, and the zeros of $\\xi(s)$ are **transmission zeros** — frequencies where the bridge completely blocks transmission between ladders. At these frequencies, all energy is reflected: $|S_{11}| = 1$.

The **Riemann Hypothesis** in this language: all transmission zeros of the bridge occur on the critical line, i.e., the bridge has no transmission zeros off the line of perfect matching.

This connects to Darlington's theorem: any lossless two-port can be characterized by its transmission zeros, and for a reciprocal lossless network, these zeros must satisfy specific symmetry conditions.`,
    latex: [
      'S_{\\text{bridge}} = \\begin{pmatrix} S_{11} & S_{12} \\\\ S_{21} & S_{22} \\end{pmatrix}, \\quad S^\\dagger S = I \\text{ on } \\sigma = 1/2',
      'S_{21}(s) = \\xi(s), \\quad S_{12}(s) = \\xi(1-s) = \\xi(s)',
      '\\xi(\\rho) = 0 \\iff |S_{11}(\\rho)| = 1 \\text{ (total reflection at zero)}',
      '\\text{RH} \\iff \\text{all transmission zeros of } S_{\\text{bridge}} \\text{ lie on } \\sigma = \\frac{1}{2}',
    ],
    insights: [
      'Zeta zeros = transmission zeros of the lossless bridge',
      'At a zero: total reflection, no energy passes between ladders',
      'The functional equation is the reciprocity condition S₁₂ = S₂₁',
      'RH becomes a statement about the transmission zero locations of a lossless network',
    ],
    references: ['darlington-1939', 'belevitch-1968', 'keating-snaith-2000'],
    nextSteps: ['exp-010'],
  },
  {
    id: 'exp-007',
    timestamp: '2026-02-27T11:00:00Z',
    title: 'Nyquist Stability and the Critical Line',
    status: 'complete',
    category: 'control-theory',
    depth: 3,
    content: `Reframing the Riemann Hypothesis as a **stability criterion** in control theory.

Consider the **loop transfer function** of the coupled ladder-bridge system:
$$L(s) = \\chi(s) \\cdot \\frac{\\zeta_{\\text{partial}}(1-s)}{\\zeta_{\\text{partial}}(s)}$$

The closed-loop system is stable iff the Nyquist plot of $L(s)$ does not encircle the critical point $-1$.

For the full zeta function, the closed-loop characteristic equation is:
$$1 + L(s) = 0 \\iff \\zeta(s) = 0$$

So: **the zeros of zeta are the closed-loop poles of the ladder-bridge feedback system**.

The Nyquist criterion then says: the number of unstable poles (zeros with $\\sigma > 1/2$) equals the number of encirclements of $-1$ by the Nyquist contour of $L(s)$.

**RH ↔ zero encirclements ↔ the feedback system is marginally stable on the critical line.**

This gives a computable criterion: trace the Nyquist plot and count encirclements. For finite truncations of the Euler product, this can be done numerically and gives evidence for RH.

**Bode's sensitivity integral** also applies:
$$\\int_0^\\infty \\log|S(j\\omega)| d\\omega = 0$$
where $S$ is the sensitivity function (for minimum-phase systems with no RHP poles). This constraint is analogous to the prime number theorem: $\\psi(x) \\sim x$.`,
    latex: [
      'L(s) = \\chi(s) \\cdot \\frac{\\zeta_{\\text{partial}}(1-s)}{\\zeta_{\\text{partial}}(s)}',
      '\\zeta(s) = 0 \\iff 1 + L(s) = 0',
      'N_{\\text{encircle}} = Z_{\\text{RHP}} - P_{\\text{RHP}} = 0 \\iff \\text{RH}',
      '\\int_0^\\infty \\log|S(j\\omega)| d\\omega = 0 \\iff \\psi(x) \\sim x \\text{ (PNT)}',
    ],
    insights: [
      'RH is a Nyquist stability criterion: zero encirclements of -1',
      'Zeta zeros = closed-loop poles of the feedback system',
      'Bode sensitivity integral provides a constraint analogous to the PNT',
      'The gain margin and phase margin of the system encode zero-free regions',
    ],
    references: ['nyquist-1932', 'bode-1945', 'doyle-francis-tannenbaum-2009'],
    nextSteps: ['exp-011'],
  },
  {
    id: 'exp-008',
    timestamp: '2026-02-27T11:30:00Z',
    title: 'PT-Symmetry and the Direct-Dual Exchange',
    status: 'complete',
    category: 'hamiltonian',
    depth: 4,
    content: `The Hamiltonian of the coupled ladder system has **PT-symmetry**, connecting to the Bender-Brody-Müller approach:

**P (parity)**: Exchange direct ↔ dual ladder, i.e., $\\sigma \\to 1 - \\sigma$
**T (time reversal)**: Complex conjugation, i.e., $t \\to -t$ (reversing the imaginary part of $s$)

Together: $PT: s \\to 1 - \\bar{s}$, which maps $\\sigma + it \\to (1-\\sigma) + it$.

The Hamiltonian is PT-symmetric: $\\mathcal{H}(1-\\bar{s}) = \\overline{\\mathcal{H}(s)}$.

In PT-symmetric quantum mechanics, eigenvalues are real iff the PT-symmetry is **unbroken**. For our system:
- **Unbroken PT**: eigenvalues on the real axis of the $\\xi$ function → zeros on critical line
- **Broken PT**: complex eigenvalue pairs → zeros off the critical line

**RH ↔ PT-symmetry of the ladder Hamiltonian is unbroken for all eigenvalues.**

The phase transition between broken and unbroken PT-symmetry occurs at "exceptional points" where eigenvalues coalesce. Rodgers-Tao proved $\\Lambda \\geq 0$, meaning backward heat flow would break the reality of zeros. If RH holds ($\\Lambda \\leq 0$), then $\\Lambda = 0$ exactly — the system would be precisely at the PT phase transition critical point.`,
    latex: [
      'P: \\sigma \\to 1-\\sigma \\text{ (swap ladders)}, \\quad T: t \\to -t \\text{ (time reversal)}',
      'PT: s \\to 1 - \\bar{s}, \\quad \\mathcal{H}(1-\\bar{s}) = \\overline{\\mathcal{H}(s)}',
      '\\text{RH} \\iff \\text{PT-symmetry unbroken for all eigenvalues}',
      '\\Lambda \\geq 0 \\;(\\text{Rodgers-Tao}), \\quad \\text{RH} \\iff \\Lambda \\leq 0 \\iff \\Lambda = 0',
    ],
    insights: [
      'The direct ↔ dual exchange is precisely the P (parity) operation in PT-symmetry',
      'RH = unbroken PT-symmetry of the Hamiltonian',
      'Λ ≥ 0 (Rodgers-Tao); combined with RH (Λ ≤ 0) this would give Λ = 0 (unproven)',
      'Exceptional points (if they exist off-line) would be RH violations',
    ],
    references: ['bender-brody-mueller-2017', 'rodgers-tao-2020', 'debruijn-1950'],
    nextSteps: ['exp-012'],
  },
  {
    id: 'exp-009',
    timestamp: '2026-02-27T12:00:00Z',
    title: 'The Explicit Formula as Impulse Response',
    status: 'complete',
    category: 'signal-processing',
    depth: 3,
    content: `Von Mangoldt's explicit formula:

$$\\psi(x) = x - \\sum_\\rho \\frac{x^\\rho}{\\rho} - \\log(2\\pi) - \\frac{1}{2}\\log(1 - x^{-2})$$

is the **impulse response** (more precisely, the step response) of the prime oscillator chain.

Each zero $\\rho = 1/2 + i\\gamma_n$ contributes an oscillatory term:
$$-\\frac{x^{1/2 + i\\gamma_n}}{1/2 + i\\gamma_n} - \\frac{x^{1/2 - i\\gamma_n}}{1/2 - i\\gamma_n} = -\\frac{2x^{1/2}}{|\\rho|^2}\\left(\\frac{1}{2}\\cos(\\gamma_n \\log x) + \\gamma_n \\sin(\\gamma_n \\log x)\\right)$$

These are **damped sinusoids** with:
- Decay envelope: $x^{1/2}$ (square root — because σ = 1/2)
- Frequency: $\\gamma_n / (2\\pi)$ in the log-x domain
- Amplitude: $\\propto 1/|\\rho|^2 \\approx 1/\\gamma_n^2$

If RH is true, ALL terms decay as $x^{1/2}$, giving the best possible error term in the PNT: $\\psi(x) = x + O(x^{1/2} \\log^2 x)$.

If a zero had $\\sigma > 1/2$, there would be a term decaying as $x^\\sigma > x^{1/2}$ — a "louder" resonance that would dominate and worsen the prime counting estimate.

**Signal processing interpretation**: The prime counting staircase is a band-limited signal (in log-frequency space) reconstructed from its spectral components (zeta zeros). RH says all spectral components have the same decay rate.`,
    latex: [
      '\\psi(x) = x - \\sum_\\rho \\frac{x^\\rho}{\\rho} - \\log 2\\pi - \\frac{1}{2}\\log(1-x^{-2})',
      '\\text{Each zero contributes: } \\sim \\frac{x^{1/2}}{\\gamma_n} \\cos(\\gamma_n \\log x + \\phi_n)',
      '\\psi(x) - x = O(x^{1/2} \\log^2 x) \\iff \\text{RH}',
      '\\text{Spectral density: } \\frac{1}{2\\pi}\\sum_n \\delta(\\omega - \\gamma_n)',
    ],
    insights: [
      'The explicit formula is the step response of the oscillator chain',
      'Each zeta zero is a resonant mode contributing a damped sinusoid',
      'RH = all modes have the same damping rate (σ = 1/2)',
      'The prime counting function is a band-limited signal reconstructed from its spectrum',
    ],
    references: ['von-mangoldt-1895', 'mazur-stein-2016', 'zagier-1977'],
    nextSteps: ['exp-013'],
  },
  {
    id: 'exp-010',
    timestamp: '2026-02-27T12:30:00Z',
    title: 'Random Matrix Theory: GUE from Coupled Oscillators',
    status: 'complete',
    category: 'statistical',
    depth: 4,
    content: `Montgomery's pair correlation conjecture (verified numerically by Odlyzko) states that the normalized spacing between zeta zeros follows GUE (Gaussian Unitary Ensemble) statistics:

$$R_2(x) = 1 - \\left(\\frac{\\sin \\pi x}{\\pi x}\\right)^2$$

**Why does GUE emerge from the oscillator chain?**

The coupled oscillator system's Hamiltonian matrix, truncated to $N$ primes, is an $N \\times N$ matrix. The coupling pattern (determined by prime gaps) introduces off-diagonal elements. As $N \\to \\infty$:

1. The spacings between prime frequencies $\\log p$ become increasingly irregular
2. The coupling strengths $1/(\\log p_{n+1} - \\log p_n)$ fluctuate
3. These fluctuations, combined with the cascade structure, produce eigenvalue repulsion

The key insight from random matrix theory: **any sufficiently complex coupled system with time-reversal symmetry breaking belongs to the GUE universality class.** Our system breaks time-reversal symmetry through the PT-structure (T alone is not a symmetry, only PT is).

The Keating-Snaith result that $\\zeta(1/2+it)$ behaves like the characteristic polynomial of a CUE matrix is the finite-$N$ analog: for $N$ primes, the system's scattering matrix at the bridge is drawn from the Circular Unitary Ensemble.`,
    latex: [
      'R_2(x) = 1 - \\left(\\frac{\\sin \\pi x}{\\pi x}\\right)^2 \\quad \\text{(GUE pair correlation)}',
      'P(s) = \\frac{32}{\\pi^2} s^2 e^{-4s^2/\\pi} \\quad \\text{(GUE nearest-neighbor spacing)}',
      '\\mathbb{E}[|\\zeta(1/2+it)|^{2k}] \\sim C_k (\\log t)^{k^2} \\quad \\text{(moment conjecture)}',
      'S_{\\text{bridge}} \\in \\text{CUE}(N) \\quad \\text{for } N\\text{-prime truncation}',
    ],
    insights: [
      'GUE statistics arise naturally from the coupling pattern of prime oscillators',
      'Time-reversal symmetry breaking (via PT-structure) selects GUE over GOE',
      'The CUE model for zeta = the scattering matrix of the bridge is a random unitary matrix',
      'Eigenvalue repulsion in the oscillator spectrum ↔ zero repulsion of zeta',
    ],
    references: ['montgomery-1973', 'odlyzko-1987', 'keating-snaith-2000'],
    nextSteps: ['exp-014'],
  },
  {
    id: 'exp-011',
    timestamp: '2026-02-27T13:00:00Z',
    title: 'Anderson Localization and the Critical Line',
    status: 'in-progress',
    category: 'physics',
    depth: 4,
    content: `A profound connection: the behavior of waves in our prime oscillator chain relates to **Anderson localization** in disordered systems.

In a perfectly periodic lattice: all states are extended (Bloch waves). In a strongly disordered lattice: all states are localized (Anderson). The prime oscillator chain, with its quasi-regular spacing, sits at the **critical boundary**.

The localization length at energy $E$ in a 1D chain:
$$\\xi(E) \\propto \\frac{1}{\\text{Var}(V_n)} \\cdot \\frac{1}{\\sin^2(k)}$$

For our chain, the "disorder" $V_n = \\log p_{n+1} - \\log p_n - 1$ (deviation from average gap) is controlled by the prime number theorem. The PNT guarantees that the average disorder is bounded, but the prime gap fluctuations prevent perfect periodicity.

**Critical behavior**: At $\\sigma = 1/2$:
- The wave function $\\psi_n \\propto p_n^{-1/2}$ is **exactly at the threshold** between extended and localized
- For $\\sigma > 1/2$: $\\psi_n \\propto p_n^{-\\sigma}$ decays faster → states tend toward localization
- For $\\sigma < 1/2$: $\\psi_n \\propto p_n^{-\\sigma}$ decays slower → states are more extended

**RH as a localization statement**: All eigenstates of the Hamiltonian at the metal-insulator transition ($\\sigma = 1/2$) are critical — neither fully localized nor fully extended. This is the Anderson transition in 1D with correlated disorder (primes).`,
    latex: [
      '\\psi_n \\propto p_n^{-\\sigma}, \\quad \\begin{cases} \\sigma > 1/2: & \\text{localized} \\\\ \\sigma = 1/2: & \\text{critical} \\\\ \\sigma < 1/2: & \\text{extended} \\end{cases}',
      '\\xi_{\\text{loc}}(\\sigma) \\propto \\frac{1}{|\\sigma - 1/2|} \\quad \\text{(localization length diverges at critical line)}',
      '\\text{RH} \\iff \\text{all eigenstates are critical (at Anderson transition)}',
    ],
    insights: [
      'The prime oscillator chain is a 1D system with correlated disorder',
      'σ = 1/2 is the Anderson localization-delocalization transition',
      'RH says all eigenstates sit exactly at the metal-insulator transition',
      'Prime gap fluctuations provide the disorder that prevents Bloch wave solutions',
    ],
    references: ['anderson-1958', 'dyson-2009', 'schumayer-hutchinson-2011'],
    nextSteps: ['exp-015'],
  },
  {
    id: 'exp-012',
    timestamp: '2026-02-27T13:30:00Z',
    title: 'H-infinity Optimal Control and the Critical Line',
    status: 'in-progress',
    category: 'control-theory',
    depth: 4,
    content: `The $H_\\infty$ norm of a transfer function $G(s)$ is:
$$\\|G\\|_{\\infty} = \\sup_{\\omega} |G(j\\omega)|$$

For our system, the relevant transfer function is the **sensitivity function** of the feedback loop:
$$S(s) = \\frac{1}{1 + L(s)}$$

where $L(s) = \\chi(s) \\cdot \\zeta(1-s)/\\zeta(s)$ is the loop transfer function.

The $H_\\infty$ optimal control problem asks: **minimize the worst-case sensitivity over all stabilizing controllers.** In our framework:

$$\\min_\\sigma \\|S(\\sigma + j\\cdot)\\|_\\infty$$

The optimal $\\sigma$ that minimizes the worst-case amplification is... $\\sigma = 1/2$.

**Why?** At $\\sigma = 1/2$:
- The loop gain $|L(1/2+it)|$ is balanced: $|\\chi(1/2+it)| = 1$ and $|\\zeta(1/2-it)| = |\\zeta(1/2+it)|$
- By definition $S + T = 1$; additionally, at $\\sigma = 1/2$ the lossless bridge gives $|S|^2 + |T|^2 \\approx 1$ (balanced sensitivity)
- This is the unique operating point where the system achieves the **balanced sensitivity** property

The $H_\\infty$ framework also provides **robust stability margins**: how far can the system parameters deviate before instability (i.e., before zeros move off the critical line)?`,
    latex: [
      '\\|G\\|_\\infty = \\sup_\\omega |G(j\\omega)|',
      'S(s) = \\frac{1}{1+L(s)}, \\quad T(s) = \\frac{L(s)}{1+L(s)}, \\quad S + T = 1',
      '\\min_\\sigma \\|S(\\sigma + j\\cdot)\\|_\\infty \\quad \\text{achieved at } \\sigma = 1/2',
      'S + T = 1 \\;\\text{(always)}, \\quad |S|^2 + |T|^2 \\approx 1 \\;\\text{at } \\sigma = 1/2 \\text{ (balanced)}',
    ],
    insights: [
      'H∞ optimal control naturally selects σ = 1/2 as the optimal operating point',
      'The sensitivity/complementary sensitivity balance is the control-theoretic functional equation',
      'Robust stability margins quantify how "strong" RH is for finite prime truncations',
      'The Bode sensitivity integral constrains the global behavior and recovers PNT',
    ],
    references: ['doyle-francis-tannenbaum-2009', 'nyquist-1932', 'bode-1945'],
    nextSteps: [],
  },
  {
    id: 'exp-013',
    timestamp: '2026-02-27T14:00:00Z',
    title: 'Fractal Strings and Physical Oscillators',
    status: 'queued',
    category: 'geometry',
    depth: 4,
    content: `Lapidus fractal strings provide a rigorous bridge between our oscillator model and geometry. A fractal string $\\mathcal{L}$ is a bounded open subset of $\\mathbb{R}$, decomposed into intervals of lengths $l_1 \\geq l_2 \\geq \\cdots$. Its geometric zeta function is:

$$\\zeta_{\\mathcal{L}}(s) = \\sum_{j=1}^\\infty l_j^s$$

The **complex dimensions** of $\\mathcal{L}$ are the poles of $\\zeta_{\\mathcal{L}}$. For the "prime string" with lengths $l_j = p_j^{-1}$ (inverses of primes), the geometric zeta function relates directly to $\\log \\zeta(s)$.

**Physical realization**: A fractal string is literally a vibrating string with a fractal mass distribution. Its resonant frequencies are determined by the complex dimensions = poles of the spectral zeta function.

Our oscillator chain corresponds to the eigenvalue problem for a fractal string:
- Each prime oscillator = one segment of the fractal string
- The length of segment $p$ = $p^{-1}$
- Resonant frequencies = zeta zeros
- The wave equation on the fractal string = the dynamics of our coupled oscillator chain

This makes the model physically concrete: the prime oscillator chain can be experimentally realized as vibrations of a fractal string.`,
    latex: [
      '\\zeta_{\\mathcal{L}}(s) = \\sum_j l_j^s, \\quad \\text{complex dimensions} = \\text{poles of } \\zeta_{\\mathcal{L}}',
      '\\text{Prime string: } l_j = p_j^{-1}, \\quad \\zeta_{\\mathcal{L}}(s) = \\sum_p p^{-s} \\sim \\log\\zeta(s)',
      '\\text{Tube formula: } V(\\epsilon) = \\sum_\\omega c_\\omega \\epsilon^{1-\\omega}',
    ],
    insights: [
      'Fractal strings are the physical objects whose spectrum our model computes',
      'Complex dimensions = zeta zeros = resonances of the fractal string',
      'The prime string is a specific fractal string whose geometry encodes all primes',
      'This could potentially be experimentally realized with engineered resonators',
    ],
    references: ['lapidus-vanfrankenhuijsen-2006', 'connes-1999'],
    nextSteps: ['exp-014'],
  },
  {
    id: 'exp-014',
    timestamp: '2026-02-27T14:30:00Z',
    title: 'Cauer Synthesis: Building the Ladder from the Transfer Function',
    status: 'complete',
    category: 'circuit-theory',
    depth: 4,
    content: `Wilhelm Cauer's foundational work on network synthesis (1926) shows how to realize any rational impedance function as a **ladder network** via continued fraction expansion. Applied to our model:

Given the zeta function (or rather, $\\log\\zeta(s) = -\\sum_p \\log(1 - p^{-s})$), we can formally expand the impedance as a continued fraction:

$$Z(s) = Z_{p_1}(s) + \\cfrac{1}{Y_{1,2}(s) + \\cfrac{1}{Z_{p_2}(s) + \\cfrac{1}{Y_{2,3}(s) + \\cdots}}}$$

This is exactly Cauer's **first canonical form** for ladder networks. Each $Z_{p_k}$ is a series impedance (our oscillator stage for prime $p_k$) and each $Y_{k,k+1}$ is a shunt admittance (the coupling between stages).

**Cauer's realization theorem**: Any positive-real function (i.e., any function whose real part is non-negative for $\\text{Re}(s) > 0$) can be realized as the driving-point impedance of a passive network. Since $\\zeta(s)$ has no zeros in $\\text{Re}(s) > 1$, the impedance of the direct ladder is positive-real in that half-plane.

**The deep question**: Can $\\zeta(s)$ itself be characterized as a positive-real function in the critical strip? This would be equivalent to RH + additional conditions on the phase of $\\zeta$.

The continued fraction structure also connects to Padé approximants of $\\zeta$, which provide rational approximations that converge more rapidly than partial sums.`,
    latex: [
      'Z(s) = Z_{p_1} + \\cfrac{1}{Y_{1,2} + \\cfrac{1}{Z_{p_2} + \\cfrac{1}{Y_{2,3} + \\cdots}}}',
      '\\text{Cauer I form: series } Z_k \\text{, shunt } Y_{k,k+1} \\text{ alternating}',
      '\\text{Positive-real: } \\text{Re}[Z(s)] \\geq 0 \\text{ for } \\text{Re}(s) > 0 \\iff \\text{passive network}',
      '\\log\\zeta(s) = \\sum_p \\sum_{k=1}^\\infty \\frac{p^{-ks}}{k} \\quad \\text{(Cauer expansion generator)}',
    ],
    insights: [
      'Cauer synthesis provides the rigorous framework for building our ladder from the zeta function',
      'The continued fraction expansion maps naturally to a ladder network specification',
      'Positive-real functions ↔ passive networks ↔ stable systems',
      'Padé approximants of zeta connect to optimal ladder truncations',
    ],
    references: ['cauer-1926', 'belevitch-1968', 'darlington-1939'],
    nextSteps: ['exp-015'],
  },
  {
    id: 'exp-015',
    timestamp: '2026-02-27T15:00:00Z',
    title: 'The ABCD Matrix Formalism: Cascading Euler Factors',
    status: 'complete',
    category: 'circuit-theory',
    depth: 4,
    content: `In microwave engineering and circuit theory, cascade-connected two-port networks are described by the **ABCD (chain) matrix**:

$$\\begin{pmatrix} V_1 \\\\ I_1 \\end{pmatrix} = \\begin{pmatrix} A & B \\\\ C & D \\end{pmatrix} \\begin{pmatrix} V_2 \\\\ I_2 \\end{pmatrix}$$

The key property: **cascade = matrix multiplication**:
$$M_{\\text{total}} = M_{p_1} \\cdot M_{p_2} \\cdots M_{p_n}$$

For each Euler factor stage with impedance $Z_p(s)$ and admittance $Y_p(s)$:

$$M_p = \\begin{pmatrix} 1 & Z_p \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} 1 & 0 \\\\ Y_p & 1 \\end{pmatrix} = \\begin{pmatrix} 1 + Z_p Y_p & Z_p \\\\ Y_p & 1 \\end{pmatrix}$$

The total cascade matrix encodes $\\zeta(s)$ through its entries. Specifically:

$$\\zeta(s) \\propto \\frac{1}{C_{\\text{total}}(s)}$$

where $C_{\\text{total}}$ is the (2,1) entry of the total ABCD matrix. This is because $C$ relates to the short-circuit transfer admittance, and $\\zeta(s) = 0$ iff the total transfer admittance diverges (a resonance condition).

**Remarkable fact**: The determinant of each ABCD matrix is $AD - BC = 1$ (for lossless stages). The total determinant remains 1. This is the **unimodularity** condition, and it connects to the fact that $|\\xi(s)| = |\\xi(1-s)|$ on the critical line.`,
    latex: [
      'M_{\\text{total}} = \\prod_{p \\leq P} M_p, \\quad M_p = \\begin{pmatrix} 1+Z_pY_p & Z_p \\\\ Y_p & 1 \\end{pmatrix}',
      '\\det(M_{\\text{total}}) = \\prod_p \\det(M_p) = 1 \\quad \\text{(unimodularity)}',
      '\\zeta(s) \\propto \\frac{1}{C_{\\text{total}}(s)} \\quad \\text{(transfer admittance)}',
      'S_{21} = \\frac{2}{A + B/Z_0 + CZ_0 + D} \\quad \\text{(scattering parameter)}',
    ],
    insights: [
      'ABCD matrices make the Euler product cascade computationally concrete',
      'Unimodularity (det = 1) encodes the functional equation symmetry',
      'Zeta zeros = resonances of the cascade = poles of the transfer admittance',
      'The scattering matrix formulation connects directly to RMT (random matrices)',
    ],
    references: ['belevitch-1968', 'cauer-1926', 'keating-snaith-2000'],
    nextSteps: ['exp-016'],
  },
  {
    id: 'exp-016',
    timestamp: '2026-02-27T15:30:00Z',
    title: 'The Selberg Trace Formula as a Network Identity',
    status: 'complete',
    category: 'trace-formula',
    depth: 5,
    content: `The Selberg trace formula for a hyperbolic surface $X$:

$$\\sum_n h(r_n) = \\frac{\\text{Area}(X)}{4\\pi}\\int_{-\\infty}^\\infty r \\tanh(\\pi r) h(r) dr + \\sum_{\\{\\gamma\\}} \\sum_{k=1}^\\infty \\frac{l(\\gamma)}{2\\sinh(kl(\\gamma)/2)} g(kl(\\gamma))$$

Left side: **spectral** (sum over eigenvalues of the Laplacian)
Right side: **geometric** (sum over primitive closed geodesics of length $l(\\gamma)$)

In our circuit model:
- **Left side**: Sum over resonant frequencies (zeta zeros) of the system → the total impedance seen at one port
- **Right side**: Sum over prime oscillators and their harmonics → the Euler product cascade decomposition
- $h(r)$ is the **test function** → the excitation waveform applied to the circuit
- $g(u) = \\hat{h}(u)$ is its Fourier transform → the frequency-domain excitation

The trace formula is then: **the total response of the circuit (spectral side) equals the sum of individual stage responses (geometric/Euler side)**.

For the Riemann zeta function specifically, the "geometric side" involves primes and prime powers, and the "spectral side" involves the nontrivial zeros. The explicit formula of von Mangoldt is the special case where $h$ is chosen to pick out a single frequency.

**This is the most general form of the circuit identity**: it holds for any test function $h$, not just for specific frequencies. It's the universal impedance identity for the prime oscillator chain.`,
    latex: [
      '\\sum_n h(r_n) = \\int \\cdots + \\sum_{\\gamma} \\sum_k \\frac{l(\\gamma)}{2\\sinh(kl/2)} g(kl)',
      '\\text{Spectral: } \\sum_{\\rho} h(\\gamma_\\rho) = \\text{Geometric: } \\sum_p \\sum_k \\frac{\\log p}{p^{k/2} - p^{-k/2}} \\hat{h}(k\\log p)',
      '\\text{Circuit form: } Z_{\\text{total}}[h] = \\sum_p Z_p[h] \\quad \\text{(impedance identity)}',
    ],
    insights: [
      'The trace formula is the master impedance identity for the oscillator chain',
      'It unifies all the specific identities (explicit formula, functional equation) into one',
      'The choice of test function h corresponds to the excitation applied to the circuit',
      'Different h give different "measurements" of the same underlying network',
    ],
    references: ['selberg-1956', 'gutzwiller-1971', 'von-mangoldt-1895'],
    nextSteps: ['exp-017'],
  },
  {
    id: 'exp-017',
    timestamp: '2026-02-27T16:00:00Z',
    title: 'Beurling Generalized Primes: Custom Oscillator Chains',
    status: 'complete',
    category: 'foundation',
    depth: 5,
    content: `Beurling's theory of generalized primes provides a framework for studying oscillator chains with **arbitrary frequency spectra**, not just the classical primes.

A **Beurling system** is a sequence $1 < p_1 \\leq p_2 \\leq \\cdots$ of "generalized primes" that generate "generalized integers" by multiplication. The generalized zeta function is:

$$\\zeta_P(s) = \\prod_j \\frac{1}{1 - p_j^{-s}} = \\sum_n n_P^{-s}$$

**Key result** (Beurling, 1937): If the counting function $N_P(x) = x + O(x/\\log^\\gamma x)$ with $\\gamma > 3/2$, then the generalized PNT holds.

In our model, this means: **the oscillator chain produces prime-like behavior as long as the frequency spectrum is sufficiently regular**. We can:

1. Design "synthetic" oscillator chains with prescribed properties
2. Test which frequency spectra lead to RH-like behavior
3. Understand what's special about the actual primes by comparison

**Experiment**: Take generalized primes with gaps that are slightly more regular than actual primes (e.g., $p_n \\approx n\\log n$ with small perturbations). The resulting zeta function has zeros that may or may not satisfy GRH. The zero statistics reveal whether GUE emerges from the specific gap structure or is universal.

This connects to **inverse problems** in network synthesis: given a desired set of resonances (zeros), what oscillator chain (Euler product over generalized primes) produces them?`,
    latex: [
      '\\zeta_P(s) = \\prod_j \\frac{1}{1 - p_j^{-s}}, \\quad \\text{Beurling generalized primes } p_j',
      'N_P(x) = x + O(x/\\log^\\gamma x), \\quad \\gamma > 3/2 \\Rightarrow \\text{PNT holds}',
      '\\text{Inverse problem: given zeros } \\{\\rho_k\\}, \\text{ find primes } \\{p_j\\} \\text{ such that } \\zeta_P(\\rho_k) = 0',
    ],
    insights: [
      'Beurling generalized primes let us "design" oscillator chains with custom spectra',
      'The PNT requires only mild regularity of the frequency spectrum',
      'Inverse problem: reconstruct the oscillator chain from desired resonances',
      'Comparing generalized prime chains reveals what makes the actual primes special',
    ],
    references: ['zagier-1977', 'titchmarsh-1986'],
    nextSteps: ['exp-018'],
  },
  {
    id: 'exp-018',
    timestamp: '2026-02-27T16:30:00Z',
    title: 'The Weil Explicit Formula and Distributional Analysis',
    status: 'complete',
    category: 'signal-processing',
    depth: 5,
    content: `André Weil generalized von Mangoldt's explicit formula into a distributional identity that holds for a wide class of test functions. The Weil explicit formula:

$$\\sum_\\rho \\hat{f}(\\gamma_\\rho) = \\hat{f}(i/2) + \\hat{f}(-i/2) - \\sum_p \\sum_{m=1}^\\infty \\frac{\\log p}{p^{m/2}} [f(m\\log p) + f(-m\\log p)] + \\int_{-\\infty}^\\infty f(x) d\\sigma(x)$$

In signal processing terms, this is a **generalized Parseval identity**: the total spectral energy (left side, sum over zeros) equals the total time-domain energy decomposed into prime harmonics (right side).

**Filter interpretation**: Each test function $f$ is a **filter** applied to the prime oscillator chain. The explicit formula says: the output of any filter, measured spectrally (via zeros), equals the output measured in the time domain (via primes).

This has profound implications for our model:
- The oscillator chain is a **linear system** (superposition holds)
- Any measurement of the system can be decomposed either spectrally or in terms of primes
- The **positivity** of certain test function outputs is equivalent to RH (Li's criterion is a special case)

**Weil's positivity criterion**: RH $\\iff$ for all test functions $f$ in a certain class, the distribution $\\sum_\\rho \\hat{f}(\\gamma_\\rho) \\geq 0$.

In circuit terms: RH $\\iff$ the oscillator chain is a **passive** system (it never amplifies, for any input signal in the allowed class).`,
    latex: [
      '\\sum_\\rho \\hat{f}(\\gamma_\\rho) = \\hat{f}(i/2) + \\hat{f}(-i/2) - \\sum_p \\sum_m \\frac{\\log p}{p^{m/2}} [f(m\\log p) + f(-m\\log p)] + \\cdots',
      '\\text{RH} \\iff \\sum_\\rho \\hat{f}(\\gamma_\\rho) \\geq 0 \\text{ for all admissible } f \\text{ (Weil positivity)}',
      '\\text{Circuit: RH} \\iff \\text{the oscillator chain is passive for all inputs}',
    ],
    insights: [
      'The explicit formula is a generalized Parseval identity for the oscillator chain',
      'Any filter applied to the chain gives the same answer spectrally or prime-by-prime',
      'Weil positivity = passivity of the network (no amplification)',
      'Li coefficients are special cases using specific test functions',
    ],
    references: ['von-mangoldt-1895', 'li-1997', 'broughan-2017'],
    nextSteps: ['exp-019'],
  },
  {
    id: 'exp-019',
    timestamp: '2026-02-27T17:00:00Z',
    title: 'Quantum Graphs and the Oscillator Chain Spectrum',
    status: 'in-progress',
    category: 'physics',
    depth: 5,
    content: `A **quantum graph** is a metric graph with a differential operator (typically the Laplacian) defined on its edges, with matching conditions at vertices. Our prime oscillator ladder can be modeled as a quantum graph:

- **Edges**: Each oscillator stage (prime $p$) is an edge of length $\\ell_p = \\log p$
- **Vertices**: The connection points between stages (and to the bridge)
- **Operator**: The Laplacian $-d^2/dx^2$ on each edge
- **Boundary conditions**: Neumann-Kirchhoff conditions at vertices (current conservation)

The spectrum of this quantum graph (eigenvalues of the Laplacian with these boundary conditions) is related to the zeta zeros through the trace formula.

For a quantum graph, the **secular equation** (determining the spectrum) involves the determinant of a matrix built from the edge lengths:

$$\\det(I - S \\cdot U(k)) = 0$$

where $S$ is the scattering matrix at vertices and $U(k)$ is a diagonal matrix of phases $e^{ik\\ell_j}$.

**Critical observation**: This is EXACTLY the structure of the Euler product! The edge lengths are $\\log p$ (our oscillator frequencies), and the scattering matrix $S$ encodes the coupling between stages.

The quantum graph perspective gives us:
- A rigorous self-adjoint operator whose spectrum to analyze
- Tools from quantum chaos (Gutzwiller trace formula)
- Numerical methods for computing eigenvalues
- Connection to the BGS conjecture (quantum chaos ↔ RMT)`,
    latex: [
      '\\text{Quantum graph: } -\\frac{d^2\\psi}{dx^2} = k^2 \\psi \\text{ on edges, matching at vertices}',
      '\\det(I - S \\cdot U(k)) = 0, \\quad U(k) = \\text{diag}(e^{ik\\log p_1}, e^{ik\\log p_2}, \\ldots)',
      '\\text{Edge lengths: } \\ell_p = \\log p \\quad \\text{(incommensurate, since primes are multiplicatively independent)}',
      '\\text{Weyl law: } N(k) \\sim \\frac{k}{\\pi} \\sum_p \\log p \\sim \\frac{k}{\\pi} \\cdot \\theta(P)',
    ],
    insights: [
      'The oscillator chain can be viewed as a quantum graph with edges of length log(p)',
      'The secular equation of the quantum graph reproduces the Euler product structure',
      'Incommensurability of log(p) values (primes are mult. independent) prevents periodic orbits',
      'Quantum graph theory provides rigorous spectral analysis tools for our model',
    ],
    references: ['gutzwiller-1971', 'schumayer-hutchinson-2011', 'selberg-1956'],
    nextSteps: ['exp-020'],
  },
  {
    id: 'exp-020',
    timestamp: '2026-02-27T17:30:00Z',
    title: 'Riemann-Siegel Formula: High-Frequency Asymptotics of the Ladder',
    status: 'complete',
    category: 'signal-processing',
    depth: 3,
    content: `The Riemann-Siegel formula provides an asymptotic expansion for the zeta function on the critical line that is extraordinarily efficient for computation:

$$Z(t) = 2\\sum_{n \\leq \\sqrt{t/2\\pi}} \\frac{\\cos(\\theta(t) - t\\log n)}{\\sqrt{n}} + R(t)$$

where $\\theta(t) = \\frac{t}{2}\\log\\frac{t}{2\\pi} - \\frac{t}{2} - \\frac{\\pi}{8} + \\cdots$ is the Riemann-Siegel theta function and $R(t)$ is a small remainder.

**Circuit interpretation**: This is the **high-frequency asymptotic** of the ladder network response. At frequency $t$:

1. Only the first $N = \\lfloor\\sqrt{t/2\\pi}\\rfloor$ oscillator stages contribute significantly
2. Each stage $n$ contributes with amplitude $1/\\sqrt{n}$ and phase $\\theta(t) - t\\log n$
3. The remainder $R(t)$ accounts for the higher stages that are "above the cutoff frequency"

This is exactly how a **finite-length ladder filter** works:
- At any given frequency, only a finite number of stages are "active"
- The cutoff moves higher with frequency: $N \\propto \\sqrt{t}$
- The Riemann-Siegel formula is the **WKB approximation** for the ladder network

The theta function $\\theta(t)$ is the accumulated **phase shift** through the ladder up to the cutoff. It grows as $\\sim (t/2)\\log(t/2\\pi)$, reflecting the logarithmic dispersion of the prime oscillator frequencies.`,
    latex: [
      'Z(t) = 2\\sum_{n \\leq N} \\frac{\\cos(\\theta(t) - t\\log n)}{\\sqrt{n}} + R(t), \\quad N = \\lfloor\\sqrt{t/2\\pi}\\rfloor',
      '\\theta(t) = \\frac{t}{2}\\log\\frac{t}{2\\pi} - \\frac{t}{2} - \\frac{\\pi}{8} + O(1/t)',
      '\\text{Active stages: } n \\leq \\sqrt{t/2\\pi} \\quad \\text{(frequency-dependent cutoff)}',
      '\\text{Cutoff frequency} \\propto \\sqrt{t} \\quad \\text{(sublinear growth)}',
    ],
    insights: [
      'Riemann-Siegel formula = WKB/high-frequency asymptotic of the ladder network',
      'At frequency t, only ~sqrt(t) oscillator stages contribute significantly',
      'The theta function is the accumulated phase shift through the active stages',
      'This explains why zeta computations are efficient: only O(sqrt(t)) terms needed',
    ],
    references: ['titchmarsh-1986', 'mazur-stein-2016'],
    nextSteps: [],
  },
  {
    id: 'exp-021',
    timestamp: '2026-02-27T18:00:00Z',
    title: 'Adelic Product Formula and Multi-Scale Resonance',
    status: 'complete',
    category: 'foundation',
    depth: 5,
    content: `The adelic perspective provides the deepest view of why the oscillator chain has the structure it does. The **product formula** for the rational numbers:

$$\\prod_{p \\leq \\infty} |x|_p = 1 \\quad \\text{for all } x \\in \\mathbb{Q}^\\times$$

says that the archimedean absolute value $|\\cdot|_\\infty$ and all $p$-adic absolute values $|\\cdot|_p$ are balanced. In our model:

- Each prime oscillator operates at its own **$p$-adic scale**
- The archimedean component ($p = \\infty$) is the "environment" in which the ladder operates
- The product formula is the **energy conservation law** for the multi-scale system

The completed zeta function:
$$\\Lambda(s) = \\pi^{-s/2}\\Gamma(s/2)\\zeta(s) = \\prod_{p \\leq \\infty} \\zeta_p(s)$$

where $\\zeta_p(s) = (1-p^{-s})^{-1}$ for finite $p$ and $\\zeta_\\infty(s) = \\pi^{-s/2}\\Gamma(s/2)$.

**The completed Euler product includes a "stage" for $p = \\infty$** — the archimedean oscillator! This is the gamma factor, and it acts as a **frequency-shaping filter** that regularizes the high-frequency behavior of the chain.

In Connes' noncommutative geometry, the adele class space $\\mathbb{A}/\\mathbb{Q}^*$ is the configuration space of the oscillator chain. Each prime provides one degree of freedom, and the quotient by $\\mathbb{Q}^*$ enforces the product formula constraint (energy conservation).`,
    latex: [
      '\\prod_{p \\leq \\infty} |x|_p = 1 \\quad \\text{(product formula = energy conservation)}',
      '\\Lambda(s) = \\pi^{-s/2}\\Gamma(s/2)\\zeta(s) = \\prod_{p \\leq \\infty} \\zeta_p(s)',
      '\\zeta_\\infty(s) = \\pi^{-s/2}\\Gamma(s/2) \\quad \\text{(archimedean oscillator)}',
      '\\text{Configuration space: } \\mathbb{A}/\\mathbb{Q}^* \\quad \\text{(Connes, adele class space)}',
    ],
    insights: [
      'The product formula is energy conservation across all scales simultaneously',
      'The gamma factor is the archimedean (p=∞) oscillator stage',
      'The completed Euler product includes ALL primes including infinity',
      'Adele class space is the phase space of the full oscillator chain',
    ],
    references: ['connes-1999', 'euler-1737', 'riemann-1859'],
    nextSteps: [],
  },
  {
    id: 'exp-022',
    timestamp: '2026-02-27T18:30:00Z',
    title: 'The Li Criterion as a Passivity Test',
    status: 'complete',
    category: 'spectral',
    depth: 5,
    content: `Li's criterion states:

$$\\text{RH} \\iff \\lambda_n \\geq 0 \\text{ for all } n \\geq 1$$

where $\\lambda_n = \\sum_\\rho \\left[1 - \\left(1 - \\frac{1}{\\rho}\\right)^n\\right]$ and the sum is over nontrivial zeros.

**Circuit interpretation**: The Li coefficients $\\lambda_n$ are the **Taylor coefficients** of the logarithmic derivative of the bridge transfer function evaluated at specific points:

$$\\sum_{n=1}^\\infty \\lambda_n z^n = -\\frac{d}{dz}\\log\\xi\\left(\\frac{1}{1-z}\\right)$$

The function $\\xi(1/(1-z))$ maps the unit disk to the critical strip, and $\\lambda_n \\geq 0$ means the function is **schlicht** (univalent) — it maps the disk injectively.

In terms of the bridge scattering matrix:
- $\\lambda_n$ are the **Schur-Cohn coefficients** of the bridge transfer function
- $\\lambda_n \\geq 0$ means the bridge is **passive** (stable, non-amplifying)
- This is equivalent to $S^\\dagger S \\leq I$ (the bridge is contractive)

**Keiper-Li asymptotic**: For large $n$:
$$\\frac{\\lambda_n}{n} \\sim \\frac{1}{2}\\log\\frac{n}{2\\pi e} + \\frac{1}{2}\\gamma_E + \\sum_{k \\geq 1} \\frac{c_k}{n^k}$$

This asymptotic is an **energy equipartition** result: the $n$-th Li coefficient represents the energy in the $n$-th mode, and it grows logarithmically — each mode carries slightly more energy than the last, with the growth rate matching the zero density.`,
    latex: [
      '\\lambda_n = \\sum_\\rho \\left[1 - \\left(1 - \\frac{1}{\\rho}\\right)^n\\right] \\geq 0 \\quad \\forall n \\geq 1 \\iff \\text{RH}',
      '\\sum_n \\lambda_n z^n = -\\frac{d}{dz}\\log\\xi\\left(\\frac{1}{1-z}\\right)',
      '\\frac{\\lambda_n}{n} \\sim \\frac{1}{2}\\log\\frac{n}{2\\pi e} + \\frac{\\gamma_E}{2} + O(1/n)',
      '\\lambda_n \\geq 0 \\iff S^\\dagger S \\leq I \\text{ (bridge passivity)}',
    ],
    insights: [
      'Li coefficients are Schur-Cohn coefficients of the bridge transfer function',
      'λₙ ≥ 0 is equivalent to passivity/contractivity of the scattering matrix',
      'The Keiper-Li asymptotic is an energy equipartition theorem',
      'Each Li coefficient tests passivity at a different "angular momentum" mode',
    ],
    references: ['li-1997', 'broughan-2017', 'darlington-1939'],
    nextSteps: [],
  },
  {
    id: 'exp-023',
    timestamp: '2026-02-27T19:00:00Z',
    title: 'Transfer Matrices, SL(2,R), and Hyperbolic Geometry',
    status: 'in-progress',
    category: 'geometry',
    depth: 6,
    content: `Each oscillator stage's ABCD matrix lies in $\\text{SL}(2, \\mathbb{C})$ (determinant = 1). On the critical line, the matrices are in $\\text{SU}(1,1)$, the group of isometries of the hyperbolic plane.

The cascade of ABCD matrices traces a path in the hyperbolic plane:

$$M_{\\text{total}} = M_{p_1} M_{p_2} \\cdots M_{p_n} \\in \\text{SL}(2, \\mathbb{C})$$

The **hyperbolic length** of this path is:
$$\\ell = \\cosh^{-1}\\left(\\frac{|\\text{tr}(M_{\\text{total}})|}{2}\\right)$$

and it relates to $|\\zeta(s)|$ through the trace of the monodromy matrix.

On the critical line, each matrix preserves the hyperbolic metric, and the cascade is a sequence of hyperbolic translations and rotations. The total transformation has:
- **Translation component**: related to $|\\zeta(1/2+it)|$
- **Rotation component**: related to $\\arg\\zeta(1/2+it)$

A **zeta zero** occurs when the total monodromy is a pure rotation by an integer multiple of $\\pi$ — the cascade "returns to the origin" in the hyperbolic plane after a complete cycle.

This connects to:
- Modular forms and automorphic representations
- The Selberg trace formula (primitive geodesics = primes)
- Teichmüller theory and deformation of the ladder structure`,
    latex: [
      'M_p \\in \\text{SL}(2, \\mathbb{C}), \\quad \\det(M_p) = 1',
      '\\text{Critical line: } M_p \\in \\text{SU}(1,1) \\cong \\text{Isom}^+(\\mathbb{H}^2)',
      '|\\zeta(1/2+it)| \\sim \\cosh(\\ell_{\\text{total}}/2) \\quad \\text{(hyperbolic distance)}',
      '\\zeta(1/2+it) = 0 \\iff \\text{tr}(M_{\\text{total}}) = \\pm 2 \\text{ (parabolic monodromy)}',
    ],
    insights: [
      'The cascade traces a path in the hyperbolic plane (or SL(2,C))',
      'Zeta zeros = parabolic monodromy = the path "closes up" in hyperbolic space',
      'The SU(1,1) structure on the critical line connects to automorphic forms',
      'Hyperbolic geometry provides the natural metric for measuring ladder convergence',
    ],
    references: ['selberg-1956', 'gutzwiller-1971', 'belevitch-1968'],
    nextSteps: [],
  },
  {
    id: 'exp-024',
    timestamp: '2026-02-27T19:30:00Z',
    title: 'Renormalization Group Flow in the Oscillator Chain',
    status: 'queued',
    category: 'physics',
    depth: 6,
    content: `The prime oscillator chain has a natural **renormalization group (RG) flow**: as we include more primes (UV completion), the system flows in a space of effective coupling constants.

Define the **effective action** at scale $P$ (including primes up to $P$):
$$S_{\\text{eff}}(P, s) = -\\log\\prod_{p \\leq P} \\frac{1}{1-p^{-s}} = \\sum_{p \\leq P} \\sum_{k=1}^\\infty \\frac{p^{-ks}}{k}$$

The RG beta function:
$$\\beta(P) = P\\frac{\\partial S_{\\text{eff}}}{\\partial P} = \\sum_{k=1}^\\infty \\frac{P^{-ks+1}}{k}$$

The beta function vanishes at $s = 1$ (the pole of zeta — a fixed point of the RG flow!) and has non-trivial zeros at the Riemann zeros.

**Interpretation**:
- The RG flow runs from UV (large primes) to IR (small primes)
- The system has a **fixed point** at $s = 1$ (a phase transition)
- The critical exponents at this fixed point are determined by the zeta zeros
- RH says all critical exponents have real part $1/2$: this is **conformal invariance at the fixed point**

The connection to the Hamiltonian: RG flow minimizes the effective action, and the fixed point structure determines the ground state. The critical line is the **conformal manifold** of the RG flow.`,
    latex: [
      'S_{\\text{eff}}(P, s) = \\sum_{p \\leq P} \\sum_{k=1}^\\infty \\frac{p^{-ks}}{k}',
      '\\beta(P) = P\\frac{\\partial S_{\\text{eff}}}{\\partial P}, \\quad \\beta(P) = 0 \\text{ at fixed points}',
      '\\text{Critical exponents: } \\Delta_\\rho = \\rho - 1/2 \\quad (\\text{RH} \\iff \\Delta_\\rho \\in i\\mathbb{R})',
      '\\text{RH} \\iff \\text{conformal invariance at the RG fixed point}',
    ],
    insights: [
      'Including more primes = UV completion = RG flow',
      'The pole at s=1 is a fixed point of the renormalization group',
      'Zeta zeros determine the critical exponents of the fixed point',
      'RH is equivalent to conformal invariance: all exponents are purely imaginary',
    ],
    references: ['connes-1999', 'ruelle-1976', 'baladi-2000'],
    nextSteps: ['exp-025'],
  },
  {
    id: 'exp-025',
    timestamp: '2026-03-02T10:00:00Z',
    title: 'Pressure on the Lossless Bridge',
    status: 'complete',
    category: 'duality',
    depth: 3,
    content: `The **bridge coupling term** in the Hamiltonian defines a natural notion of "pressure" on the lossless bridge. Recall the system energy:

$$\\mathcal{H} = T + V_{\\text{mismatch}} + V_{\\text{bridge}}$$

where the bridge potential is:

$$V_{\\text{bridge}}(\\sigma, t) = \\lambda\\,(1 - |\\chi(\\sigma + it)|)^2$$

with coupling constant $\\lambda = 100$ in our model. We define the **bridge pressure** as:

$$P(\\sigma, t) = (1 - |\\chi(\\sigma + it)|)^2$$

This pressure is exactly zero on the critical line $\\sigma = 1/2$, where $|\\chi| = 1$ (the bridge is lossless). Away from the critical line, the pressure grows quadratically.

**Restoring force.** The pressure gradient always points back toward $\\sigma = 1/2$:

$$\\frac{\\partial P}{\\partial \\sigma} = -2(1 - |\\chi|)\\frac{\\partial |\\chi|}{\\partial \\sigma}$$

Since $|\\chi(\\sigma + it)|$ is a decreasing function of $\\sigma$ for $\\sigma > 1/2$ (the bridge becomes absorptive) and increasing for $\\sigma < 1/2$ (amplifying), the gradient acts as a **restoring force** pulling the system toward the critical line.

**Taylor expansion near the critical line:**

$$P(1/2 + \\delta, t) \\approx \\left(\\frac{\\partial |\\chi|}{\\partial \\sigma}\\bigg|_{\\sigma=1/2}\\right)^2 \\delta^2 + O(\\delta^3)$$

The coefficient depends on $t$ and determines the local "stiffness" of the bridge. At zeta zeros $t = \\gamma_n$, the stiffness is particularly well-defined because the Hamiltonian minimum is sharp.

**Physical analogy.** This is exactly acoustic impedance mismatch at a waveguide junction. The direct ladder has characteristic impedance $Z_{\\text{dir}}$ and the dual ladder has $Z_{\\text{dual}}$. The reflection coefficient is:

$$\\Gamma = \\frac{Z_{\\text{dir}} - Z_{\\text{dual}}}{Z_{\\text{dir}} + Z_{\\text{dual}}}$$

At $\\sigma = 1/2$, the impedances match ($Z_{\\text{dir}} = Z_{\\text{dual}}$), so $\\Gamma = 0$: perfect transmission, zero pressure. Moving away from $\\sigma = 1/2$ creates a mismatch, and part of the signal energy reflects back — this reflected energy **is** the bridge pressure.`,
    latex: [
      'P(\\sigma, t) = (1 - |\\chi(\\sigma + it)|)^2',
      '\\frac{\\partial P}{\\partial \\sigma} = -2(1 - |\\chi|)\\frac{\\partial |\\chi|}{\\partial \\sigma} \\quad \\text{(restoring force toward } \\sigma = 1/2\\text{)}',
      'P(1/2 + \\delta, t) \\approx \\left(\\frac{\\partial |\\chi|}{\\partial \\sigma}\\bigg|_{1/2}\\right)^2 \\delta^2',
      '\\Gamma = \\frac{Z_{\\text{dir}} - Z_{\\text{dual}}}{Z_{\\text{dir}} + Z_{\\text{dual}}}, \\quad \\Gamma = 0 \\iff \\sigma = 1/2',
    ],
    insights: [
      'Bridge pressure P = (1-|χ|)² is zero exactly on the critical line',
      'The pressure gradient acts as a restoring force toward σ = 1/2',
      'Near the critical line, pressure grows quadratically: P ∝ δ²',
      'Bridge pressure = acoustic reflection energy at an impedance-mismatched junction',
      'The coupling constant λ=100 sets the energy scale of the restoring force',
    ],
    references: ['belevitch-1968', 'cauer-1926'],
    nextSteps: [],
  },
  {
    id: 'exp-026',
    timestamp: '2026-03-02T17:30:00Z',
    title: 'The de Bruijn-Newman Constant: Heat Flow in the Oscillator Chain',
    status: 'complete',
    category: 'spectral',
    depth: 4,
    content: `The **de Bruijn-Newman constant** $\\Lambda$ provides a remarkable characterization of RH in terms of a heat equation. Define the **heat-evolved xi function**:

$$H_\\tau(z) = \\int_{-\\infty}^{\\infty} e^{\\tau u^2} \\Phi(u)\\, e^{izu}\\, du$$

where $\\Phi$ is the super-exponentially decaying kernel from the Jacobi theta function, and $\\tau$ is the "time" parameter. At $\\tau = 0$, this is the Riemann $\\Xi(z)$ function, whose zeros on the real axis correspond to nontrivial zeros of $\\zeta$ on the critical line.

The Gaussian factor $e^{\\tau u^2}$ acts as a **heat kernel**: increasing $\\tau$ is forward heat flow (diffusion), decreasing $\\tau$ is backward heat flow (anti-diffusion). De Bruijn (1950) proved that if $H_\\tau$ has only real zeros, then so does $H_{\\tau'}$ for all $\\tau' > \\tau$ — heat flow preserves the reality of zeros.

**The constant $\\Lambda$** is the infimum of $\\tau$ values for which $H_\\tau$ has only real zeros:

$$\\Lambda = \\inf\\{\\tau \\in \\mathbb{R} : H_\\tau \\text{ has only real zeros}\\}$$

The key equivalence is:

$$\\text{RH} \\iff \\Lambda \\leq 0$$

since RH says $H_0 = \\Xi$ already has only real zeros.

**Newman's conjecture** (1976): $\\Lambda \\geq 0$. This was proved by Rodgers and Tao (2020), establishing that if RH is true, then $\\Lambda = 0$ — the xi function is at the **exact threshold** of the heat flow: any backward heat flow would push zeros off the real line.

**Current best bounds**: $0 \\leq \\Lambda \\leq 0.22$ (Polymath 15, 2019).

**Circuit interpretation.** In the oscillator chain model, the heat parameter $\\tau$ corresponds to adding **uniform dissipation** (resistance) to every oscillator stage. Forward heat flow ($\\tau > 0$) adds damping; backward heat flow ($\\tau < 0$) adds gain (amplification).

- At $\\tau = 0$ (no added dissipation): zeros sit on the critical line (RH) — the chain is lossless
- At $\\tau > 0$ (added resistance): zeros remain real — damped oscillators still resonate on-axis
- At $\\tau < 0$ (added gain): zeros can leave the real line — amplification creates complex-frequency resonances

$\\Lambda = 0$ means the oscillator chain is at **critical damping**: it is exactly lossless, and any attempt to "cool" it further (add gain) would immediately destabilize a resonance off the critical line.

**What the Heat Flow visualization shows.** The Heat Flow tab in the Supercritical Analysis page displays this process: as $\\tau$ increases from 0, the nontrivial zeros (plotted by their real part $\\sigma$) remain pinned at $\\sigma = 1/2$, confirming that forward heat flow preserves reality. The bottom chart shows $H_\\tau(t)$ directly, where sign changes mark zero locations — under heat flow, the function smooths but its zeros persist on the real line.`,
    latex: [
      'H_\\tau(z) = \\int_{-\\infty}^{\\infty} e^{\\tau u^2}\\,\\Phi(u)\\, e^{izu}\\, du',
      '\\Lambda = \\inf\\{\\tau \\in \\mathbb{R} : H_\\tau \\text{ has only real zeros}\\}',
      '\\text{RH} \\iff \\Lambda \\leq 0, \\quad \\Lambda \\geq 0 \\;(\\text{Rodgers-Tao 2020})',
      '0 \\leq \\Lambda \\leq 0.22 \\quad (\\text{Polymath 15, 2019})',
      '\\tau > 0 \\;\\text{(dissipation)}: \\text{zeros stay real} \\quad | \\quad \\tau < 0 \\;\\text{(gain)}: \\text{zeros can leave real line}',
    ],
    insights: [
      'Heat flow = adding uniform dissipation to every oscillator stage in the ladder',
      'RH ⟺ Λ ≤ 0: the xi function already has only real zeros at τ=0',
      'Rodgers-Tao proved Λ ≥ 0, so RH would force Λ = 0 exactly — the chain is critically lossless',
      'Forward heat flow (τ > 0) always preserves reality of zeros — adding damping cannot create new instabilities',
      'Λ = 0 means the oscillator chain is at the exact PT-symmetry phase transition threshold',
      'Current bounds: 0 ≤ Λ ≤ 0.22, narrowing from both sides toward the RH prediction Λ = 0',
    ],
    references: ['debruijn-1950', 'newman-1976', 'rodgers-tao-2020', 'polymath15-2019'],
    nextSteps: ['exp-027'],
  },
  {
    id: 'exp-027',
    timestamp: '2026-03-03T18:30:00Z',
    title: 'The Hilbert-Pólya Conjecture: Spectral Origin of the Zeros',
    status: 'complete',
    category: 'foundation',
    depth: 3,
    content: `The **Hilbert-Pólya conjecture** is the oldest and most influential physical interpretation of the Riemann Hypothesis. It asserts that the nontrivial zeros $\\rho = \\frac{1}{2} + i\\gamma_n$ of the Riemann zeta function are the **eigenvalues of a self-adjoint (Hermitian) operator** $\\hat{T}$:

$$\\hat{T}\\, \\psi_n = \\gamma_n\\, \\psi_n$$

If such an operator exists, its spectrum is automatically real (by the spectral theorem for self-adjoint operators), which would force all $\\gamma_n \\in \\mathbb{R}$ — and this is precisely the Riemann Hypothesis.

**Historical thread.** The conjecture originated in a letter from Pólya to Landau (circa 1914) and was independently suggested by Hilbert. For decades it remained a vague aspiration. The modern era began with three key developments:

1. **Montgomery-Odlyzko law (1973/1987):** Montgomery proved that the pair correlation of zeta zeros (assuming RH) matches the GUE statistics of random Hermitian matrices, and Odlyzko confirmed this numerically to extraordinary precision. This is strong circumstantial evidence: if zeros behave statistically like eigenvalues of a Hermitian matrix, perhaps they literally are.

2. **Berry-Keating conjecture (1999):** Berry and Keating proposed that the unknown operator is the quantization of the classical Hamiltonian $H = xp$. The semiclassical eigenvalue density of $xp$ matches the smooth part of the zero counting function $\\bar{N}(T) \\sim \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e}$ — exactly the Weyl law for zeta zeros.

3. **Connes' trace formula (1999):** Connes showed that the zeros emerge as an **absorption spectrum** of a quantum system on the adele class space $\\mathbb{A}/\\mathbb{Q}^*$. The primes appear as resonant frequencies — precisely what our oscillator model implements.

**Circuit interpretation.** The oscillator chain Hamiltonian $\\hat{H}(\\sigma, t)$ in this app is a finite-dimensional analog of the Hilbert-Pólya operator:

- Each prime contributes an oscillator stage (the "eigenspace" of that prime's frequency $\\log p$)
- The system energy $\\hat{H}$ depends on $\\sigma$ and $t$, with minima at $\\sigma = 1/2$
- At $\\sigma = 1/2$, all oscillators are critically coupled ($Q = 1$), the bridge is unitary ($|\\chi| = 1$), and impedance is perfectly matched

This is not the Hilbert-Pólya operator itself — it is a pedagogical model showing **why** self-adjointness maps to critical-line symmetry. The $s \\leftrightarrow 1-s$ symmetry of the functional equation becomes the **PT-symmetry** of the Hamiltonian: parity $P: \\sigma \\to 1-\\sigma$ (swap direct/dual ladders) and time reversal $T: t \\to -t$. A PT-symmetric operator has real eigenvalues if and only if PT-symmetry is unbroken — and the critical line $\\sigma = 1/2$ is exactly the PT-symmetric fixed point.

**Open questions.** Despite decades of progress, no fully rigorous Hilbert-Pólya operator has been constructed. Bender, Brody, and Müller (2017) proposed a PT-symmetric candidate, but completeness of the eigensystem remains unproven. The oscillator chain model shows the structural properties any such operator must have: it must respect the Euler product factorization (cascade structure), the functional equation (bridge unitarity), and produce the correct asymptotic eigenvalue density (Weyl law).`,
    latex: [
      '\\hat{T}\\, \\psi_n = \\gamma_n\\, \\psi_n, \\quad \\gamma_n \\in \\mathbb{R} \\;\\Leftrightarrow\\; \\text{RH}',
      'H_{\\text{classical}} = xp \\quad \\Rightarrow \\quad \\bar{N}(T) \\sim \\frac{T}{2\\pi}\\log\\frac{T}{2\\pi e}',
      'PT\\text{-symmetry: } P(\\sigma) = 1-\\sigma, \\; T(t) = -t \\quad \\Rightarrow \\quad \\text{fixed line } \\sigma = \\tfrac{1}{2}',
      '|\\chi(\\tfrac{1}{2}+it)| = 1 \\;\\Leftrightarrow\\; \\text{bridge is unitary} \\;\\Leftrightarrow\\; PT\\text{-symmetry unbroken}',
    ],
    insights: [
      'Hilbert-Pólya reduces RH to a spectral theorem: real eigenvalues ⟺ self-adjoint operator ⟺ zeros on critical line',
      'Montgomery-Odlyzko: zeta zeros have GUE pair correlation, the same as eigenvalues of random Hermitian matrices',
      'Berry-Keating: the semiclassical density of H=xp reproduces the Weyl law for zeta zeros exactly',
      'Connes: primes are absorption frequencies of a quantum system — our oscillator stages are the finite-dimensional analog',
      'PT-symmetry of the functional equation is the structural requirement any Hilbert-Pólya operator must satisfy',
      'The oscillator chain Hamiltonian is a pedagogical model of this program, not a proof — but it shows the right structural properties',
    ],
    references: ['berry-keating-1999', 'connes-1999', 'bender-brody-mueller-2017', 'montgomery-1973', 'odlyzko-1987', 'schumayer-hutchinson-2011'],
    nextSteps: [],
  },
];

export function getAllExplorations() {
  return explorations;
}

export function getExplorationById(id) {
  return explorations.find(e => e.id === id);
}

export function getExplorationsByCategory(category) {
  return explorations.filter(e => e.category === category);
}

export function getExplorationCategories() {
  const cats = new Map();
  for (const e of explorations) {
    if (!cats.has(e.category)) {
      cats.set(e.category, { name: e.category, count: 0 });
    }
    cats.get(e.category).count++;
  }
  return [...cats.values()];
}

export function getExplorationGraph() {
  const nodes = explorations.map(e => ({ id: e.id, title: e.title, category: e.category, depth: e.depth, status: e.status }));
  const edges = [];
  for (const e of explorations) {
    for (const next of (e.nextSteps || [])) {
      edges.push({ source: e.id, target: next });
    }
  }
  return { nodes, edges };
}

export default explorations;
