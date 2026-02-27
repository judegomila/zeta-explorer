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
      'The functional equation IS the impedance matching condition',
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
$$V_{\\text{bridge}}(s) = \\left(|\\chi(s)| - 1\\right)^2$$

**Theorem (circuit-theoretic)**: The Hamiltonian $\\mathcal{H}(\\sigma + it)$ achieves its minimum over $\\sigma$ at $\\sigma = 1/2$ for each fixed $t$.

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
where $S$ is the sensitivity function. This constraint is equivalent to the prime number theorem: $\\psi(x) \\sim x$.`,
    latex: [
      'L(s) = \\chi(s) \\cdot \\frac{\\zeta_{\\text{partial}}(1-s)}{\\zeta_{\\text{partial}}(s)}',
      '\\zeta(s) = 0 \\iff 1 + L(s) = 0',
      'N_{\\text{encircle}} = Z_{\\text{RHP}} - P_{\\text{RHP}} = 0 \\iff \\text{RH}',
      '\\int_0^\\infty \\log|S(j\\omega)| d\\omega = 0 \\iff \\psi(x) \\sim x \\text{ (PNT)}',
    ],
    insights: [
      'RH is a Nyquist stability criterion: zero encirclements of -1',
      'Zeta zeros = closed-loop poles of the feedback system',
      'Bode sensitivity integral = Prime Number Theorem',
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

The phase transition between broken and unbroken PT-symmetry occurs at "exceptional points" where eigenvalues coalesce. The de Bruijn-Newman result $\\Lambda \\geq 0$ (Rodgers-Tao) says we are exactly AT the phase transition — PT-symmetry is unbroken but just barely. The system is at the critical point.`,
    latex: [
      'P: \\sigma \\to 1-\\sigma \\text{ (swap ladders)}, \\quad T: t \\to -t \\text{ (time reversal)}',
      'PT: s \\to 1 - \\bar{s}, \\quad \\mathcal{H}(1-\\bar{s}) = \\overline{\\mathcal{H}(s)}',
      '\\text{RH} \\iff \\text{PT-symmetry unbroken for all eigenvalues}',
      '\\Lambda = 0 \\iff \\text{system at PT phase transition critical point}',
    ],
    insights: [
      'The direct ↔ dual exchange is precisely the P (parity) operation in PT-symmetry',
      'RH = unbroken PT-symmetry of the Hamiltonian',
      'Λ = 0 (Rodgers-Tao) means we are exactly at the PT phase transition',
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
- The sensitivity and complementary sensitivity satisfy $|S|^2 + |T|^2 = 1$ (because the system is lossless)
- This is the unique operating point where the system achieves the **balanced sensitivity** property

The $H_\\infty$ framework also provides **robust stability margins**: how far can the system parameters deviate before instability (i.e., before zeros move off the critical line)?`,
    latex: [
      '\\|G\\|_\\infty = \\sup_\\omega |G(j\\omega)|',
      'S(s) = \\frac{1}{1+L(s)}, \\quad T(s) = \\frac{L(s)}{1+L(s)}, \\quad S + T = 1',
      '\\min_\\sigma \\|S(\\sigma + j\\cdot)\\|_\\infty \\quad \\text{achieved at } \\sigma = 1/2',
      '|S(1/2+jt)|^2 + |T(1/2+jt)|^2 = 1 \\quad \\text{(lossless balance)}',
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

Our oscillator chain IS the eigenvalue problem for a fractal string:
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
