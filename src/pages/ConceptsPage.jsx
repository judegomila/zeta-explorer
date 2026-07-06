import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import PageHeader from '../components/PageHeader.jsx';

const CATEGORIES = [
  { id: 'foundations', label: 'Foundations', color: '#3b82f6' },
  { id: 'zeta', label: 'Zeta Function', color: '#10b981' },
  { id: 'primes', label: 'Prime Numbers', color: '#f59e0b' },
  { id: 'analysis', label: 'Complex Analysis', color: '#8b5cf6' },
  { id: 'physics', label: 'Physics & Circuits', color: '#06b6d4' },
  { id: 'rmt', label: 'Random Matrices', color: '#ec4899' },
  { id: 'quantum', label: 'Quantum Mechanics', color: '#f43f5e' },
  { id: 'thermo', label: 'Thermodynamics', color: '#fb923c' },
  { id: 'info', label: 'Information Theory', color: '#a78bfa' },
  { id: 'geometry', label: 'Geometry & Twistors', color: '#14b8a6' },
  { id: 'proof', label: 'Proof Strategies', color: '#ef4444' },
];

const CONCEPTS = [
  // Foundations
  {
    id: 'complex-number',
    category: 'foundations',
    term: 'Complex Number',
    symbol: 's = \\sigma + it',
    definition: 'A number with a real part and an imaginary part. In zeta function theory, we write s = sigma + it where sigma is the real part and t is the imaginary part.',
    formula: 's = \\sigma + it, \\quad \\sigma = \\operatorname{Re}(s), \\quad t = \\operatorname{Im}(s)',
    intuition: 'Think of the complex plane as a 2D map. Moving left-right changes sigma (convergence/divergence), moving up-down changes t (oscillation frequency).',
  },
  {
    id: 'analytic-continuation',
    category: 'foundations',
    term: 'Analytic Continuation',
    definition: 'Extending a function beyond its original domain of definition by requiring it to remain "smooth" (analytic). The zeta series only converges for sigma > 1, but analytic continuation defines it everywhere (except s = 1).',
    formula: '\\zeta(s) = \\sum_{n=1}^{\\infty} n^{-s} \\;\\text{(for }\\sigma > 1\\text{)} \\;\\longrightarrow\\; \\text{extends to all } s \\neq 1',
    intuition: 'Like extending a smooth curve beyond where you can see it — the mathematics forces a unique extension.',
  },
  {
    id: 'convergence',
    category: 'foundations',
    term: 'Convergence',
    definition: 'An infinite series converges if its partial sums approach a finite limit. The Dirichlet series for zeta converges when sigma > 1 (each term n^{-s} shrinks fast enough).',
    formula: '\\sum_{n=1}^{N} n^{-s} \\to \\zeta(s) \\text{ as } N \\to \\infty \\quad (\\sigma > 1)',
    intuition: 'Adding smaller and smaller numbers can give a finite total — like 1/2 + 1/4 + 1/8 + ... = 1.',
  },
  {
    id: 'gamma-function',
    category: 'foundations',
    term: 'Gamma Function',
    symbol: '\\Gamma(s)',
    definition: 'The extension of the factorial to complex numbers. For positive integers, Gamma(n) = (n-1)!. Appears in the functional equation of zeta.',
    formula: '\\Gamma(s) = \\int_0^{\\infty} t^{s-1} e^{-t}\\,dt, \\quad \\Gamma(n) = (n-1)!',
    intuition: 'A smooth curve that passes through the factorial points: Gamma(1) = 1, Gamma(2) = 1, Gamma(3) = 2, Gamma(4) = 6, ...',
  },

  // Zeta Function
  {
    id: 'zeta-function',
    category: 'zeta',
    term: 'Riemann Zeta Function',
    symbol: '\\zeta(s)',
    definition: 'The central object: defined by the Dirichlet series for sigma > 1, extended to all complex numbers by analytic continuation. Its zeros encode the distribution of prime numbers.',
    formula: '\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s} = \\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}}',
    intuition: 'A function that "sees" all primes simultaneously through the Euler product, and "remembers" them through its zeros.',
  },
  {
    id: 'euler-product',
    category: 'zeta',
    term: 'Euler Product',
    definition: 'The product formula expressing zeta as a product over primes. This is the bridge between additive (sum over integers) and multiplicative (product over primes) number theory.',
    formula: '\\zeta(s) = \\prod_{p} \\frac{1}{1 - p^{-s}} = \\frac{1}{1-2^{-s}} \\cdot \\frac{1}{1-3^{-s}} \\cdot \\frac{1}{1-5^{-s}} \\cdots',
    intuition: 'In the Twin-Ladder Bridge model, each factor is one oscillator stage. The product is the cascade transfer function.',
  },
  {
    id: 'functional-equation',
    category: 'zeta',
    term: 'Functional Equation',
    definition: 'The symmetry xi(s) = xi(1-s) relating zeta at s to zeta at 1-s. This is the deepest structural property of the zeta function.',
    formula: '\\xi(s) = \\tfrac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s) = \\xi(1-s)',
    intuition: 'A mirror symmetry about the line sigma = 1/2. In the Twin-Ladder Bridge model, it is the lossless bridge coupling direct and dual ladders.',
  },
  {
    id: 'critical-strip',
    category: 'zeta',
    term: 'Critical Strip',
    definition: 'The vertical strip 0 < sigma < 1 in the complex plane. All nontrivial zeros of zeta lie in this strip. The critical LINE is the vertical line sigma = 1/2 within it.',
    formula: '\\{s \\in \\mathbb{C} : 0 < \\operatorname{Re}(s) < 1\\}',
    intuition: 'The "interesting zone" — outside this strip, we understand zeta well. Inside, the zeros live.',
  },
  {
    id: 'nontrivial-zeros',
    category: 'zeta',
    term: 'Nontrivial Zeros',
    definition: "The complex numbers rho where zeta(rho) = 0, excluding the 'trivial' zeros at negative even integers (-2, -4, -6, ...). RH says all nontrivial zeros have Re(rho) = 1/2.",
    formula: '\\zeta(\\rho) = 0, \\quad \\rho = \\tfrac{1}{2} + i\\gamma_n \\quad \\text{(if RH holds)}',
    intuition: 'Frequencies at which the oscillator chain achieves perfect destructive interference.',
  },
  {
    id: 'riemann-hypothesis',
    category: 'zeta',
    term: 'Riemann Hypothesis (RH)',
    definition: 'The conjecture that ALL nontrivial zeros of zeta have real part exactly 1/2. Unproven since 1859. Worth $1,000,000 (Clay Millennium Prize).',
    formula: '\\zeta(\\rho) = 0,\\; \\rho \\neq -2n \\;\\Longrightarrow\\; \\operatorname{Re}(\\rho) = \\tfrac{1}{2}',
    intuition: 'All resonances of the prime oscillator chain occur at the energy minimum / impedance-matched point.',
  },
  {
    id: 'xi-function',
    category: 'zeta',
    term: 'Xi Function',
    symbol: '\\xi(s)',
    definition: 'The completed zeta function: entire (no pole), symmetric under s -> 1-s, real-valued on the critical line. Its zeros are exactly the nontrivial zeros of zeta.',
    formula: '\\xi(s) = \\tfrac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s)',
    intuition: 'A "cleaned-up" version of zeta with the pole and trivial zeros removed, making the symmetry manifest.',
  },

  // Primes
  {
    id: 'prime-number',
    category: 'primes',
    term: 'Prime Number',
    definition: 'A positive integer greater than 1 whose only divisors are 1 and itself. The building blocks of all integers via unique factorization.',
    formula: 'p \\in \\{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, \\ldots\\}',
    intuition: 'The atoms of arithmetic. In the Twin-Ladder Bridge model, each prime is one oscillator in the chain.',
  },
  {
    id: 'pnt',
    category: 'primes',
    term: 'Prime Number Theorem',
    definition: 'The number of primes up to x is approximately x/ln(x). Proved in 1896 by Hadamard and de la Vallee Poussin.',
    formula: '\\pi(x) \\sim \\frac{x}{\\ln x} \\quad \\text{as } x \\to \\infty',
    intuition: 'Primes thin out logarithmically — around x, roughly 1 in ln(x) numbers is prime.',
  },
  {
    id: 'von-mangoldt',
    category: 'primes',
    term: 'Von Mangoldt Function',
    symbol: '\\Lambda(n)',
    definition: 'Equals log(p) if n is a prime power p^k, and zero otherwise. The "weighted" indicator function for primes and prime powers.',
    formula: '\\Lambda(n) = \\begin{cases} \\log p & \\text{if } n = p^k \\\\ 0 & \\text{otherwise} \\end{cases}',
    intuition: 'Each prime oscillator contributes energy log(p) — the von Mangoldt function detects these contributions.',
  },
  {
    id: 'explicit-formula',
    category: 'primes',
    term: 'Explicit Formula',
    definition: "Connects the prime counting function to the zeros of zeta. Each zero contributes an oscillatory correction to the 'smooth' prime distribution.",
    formula: '\\psi(x) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\log(2\\pi) - \\tfrac{1}{2}\\log(1-x^{-2})',
    intuition: 'The impulse response of the oscillator chain: primes = smooth background + sum of oscillations at zero frequencies.',
  },

  // Complex Analysis
  {
    id: 'pole',
    category: 'analysis',
    term: 'Pole',
    definition: 'A point where a function "blows up" to infinity. Zeta has a single pole at s = 1 with residue 1.',
    formula: '\\zeta(s) \\sim \\frac{1}{s-1} \\quad \\text{as } s \\to 1',
    intuition: 'The Bost-Connes phase transition — the boundary between convergent and divergent Euler product.',
  },
  {
    id: 'residue',
    category: 'analysis',
    term: 'Residue',
    definition: 'The coefficient of 1/(s-a) in the Laurent expansion of a function near a pole at s = a. Controls the strength of the singularity.',
    formula: '\\operatorname{Res}_{s=1} \\zeta(s) = 1',
    intuition: 'How strongly the function blows up — for zeta, the simple pole at s = 1 has residue exactly 1.',
  },
  {
    id: 'contour-integral',
    category: 'analysis',
    term: 'Contour Integral',
    definition: 'Integration along a path in the complex plane. The explicit formula and many zeta results are derived using contour integrals.',
    formula: '\\frac{1}{2\\pi i} \\oint f(s)\\,ds = \\sum \\text{residues}',
    intuition: 'Walking along a path in the complex plane and adding up values — residues at poles inside the path contribute.',
  },

  // Physics & Circuits
  {
    id: 'euler-factor',
    category: 'physics',
    term: 'Euler Factor (Oscillator Stage)',
    symbol: 'H_p(s)',
    definition: 'The contribution of a single prime p to the Euler product. In the Twin-Ladder Bridge model, this is the transfer function of one LC resonator.',
    formula: 'H_p(s) = \\frac{1}{1 - p^{-s}}, \\quad L_p = \\log p, \\quad C_p = \\frac{1}{\\log p}',
    intuition: 'One oscillator in the chain — it resonates at universal frequency omega_0 = 1 with impedance Z_0 = log(p).',
  },
  {
    id: 'quality-factor',
    category: 'physics',
    term: 'Quality Factor',
    symbol: 'Q',
    definition: 'Measures how underdamped an oscillator is. Higher Q means sharper resonance. In the Twin-Ladder Bridge model, Q = 1/(2 sigma) is universal for all primes.',
    formula: 'Q = \\frac{1}{2\\sigma}, \\quad Q = 1 \\text{ at } \\sigma = \\tfrac{1}{2} \\text{ (critical damping)}',
    intuition: 'At sigma = 1/2, every prime oscillator is critically damped — not too sharp, not too broad.',
  },
  {
    id: 'impedance',
    category: 'physics',
    term: 'Impedance',
    symbol: 'Z',
    definition: 'Opposition to signal flow, generalizing resistance to include frequency-dependent (reactive) effects. In the Twin-Ladder Bridge model, characteristic impedance Z_0(p) = log(p).',
    formula: 'Z_0(p) = \\sqrt{L_p/C_p} = \\log p',
    intuition: 'How much each prime "resists" signal propagation — bigger primes have higher impedance.',
  },
  {
    id: 'transfer-function',
    category: 'physics',
    term: 'Transfer Function',
    definition: 'The ratio of output to input as a function of complex frequency s. The zeta function IS the transfer function of the entire oscillator cascade.',
    formula: 'H(s) = \\frac{\\text{output}}{\\text{input}} = \\prod_p H_p(s) = \\zeta(s)',
    intuition: 'A complete description of how the system transforms signals at every frequency.',
  },
  {
    id: 'scattering-matrix',
    category: 'physics',
    term: 'Scattering Matrix',
    symbol: '\\mathbf{S}',
    definition: 'Relates incident and reflected waves at a network port. The bridge scattering matrix encodes the functional equation, with transmission coefficient S₂₁ = χ(s).',
    formula: 'S_{21} = \\chi(s), \\quad |\\chi(\\tfrac{1}{2}+it)| = 1 \\;\\Rightarrow\\; |S_{11}|^2 + |S_{21}|^2 = 1 \\text{ (on critical line)}',
    intuition: 'How much signal the bridge transmits (χ) vs. reflects — lossless at σ = ½, lossy elsewhere.',
  },
  {
    id: 'hamiltonian',
    category: 'physics',
    term: 'Hamiltonian',
    symbol: '\\mathcal{H}',
    definition: 'Total energy of the system: kinetic (oscillator amplitudes) + potential (mismatch + bridge coupling). Minimized at sigma = 1/2.',
    formula: '\\mathcal{H} = T + V_{\\text{mismatch}} + V_{\\text{bridge}}',
    intuition: 'The "cost function" of the oscillator chain — nature minimizes energy, pushing zeros to sigma = 1/2.',
  },

  // Random Matrix Theory
  {
    id: 'gue',
    category: 'rmt',
    term: 'Gaussian Unitary Ensemble (GUE)',
    definition: 'A probability distribution on Hermitian matrices invariant under unitary conjugation. Its eigenvalue spacing statistics match zeta zero spacings.',
    formula: 'P_{\\text{GUE}}(s) = \\frac{32}{\\pi^2} s^2 e^{-4s^2/\\pi} \\quad \\text{(Wigner surmise for spacing)}',
    intuition: 'Random matrices with special symmetry — their eigenvalues repel each other in the same way zeta zeros do.',
  },
  {
    id: 'eigenvalue-repulsion',
    category: 'rmt',
    term: 'Eigenvalue Repulsion',
    definition: "The phenomenon where eigenvalues of random matrices (and zeta zeros) tend to avoid clustering. The probability of two eigenvalues being very close is suppressed quadratically.",
    formula: 'P(|\\gamma_m - \\gamma_n| < \\varepsilon) \\sim \\varepsilon^2 \\quad \\text{(quadratic repulsion)}',
    intuition: 'Zeros push each other apart like same-charge particles — they are more evenly spaced than random points.',
  },
  {
    id: 'pair-correlation',
    category: 'rmt',
    term: 'Pair Correlation',
    definition: "Montgomery's function measuring how zeta zeros are correlated. The match with GUE is the deepest known connection between number theory and physics.",
    formula: 'R_2(r) = 1 - \\left(\\frac{\\sin \\pi r}{\\pi r}\\right)^2',
    intuition: 'A fingerprint of the zero distribution — and it matches the fingerprint of random matrix eigenvalues.',
  },

  // Quantum Mechanics
  {
    id: 'hilbert-polya',
    category: 'quantum',
    term: 'Hilbert–Pólya Conjecture',
    definition: 'The idea that the nontrivial zeros of ζ(s) are eigenvalues of a self-adjoint operator. If such an operator exists, RH follows because self-adjoint operators have real eigenvalues, forcing Im(ρ) to be real (i.e. Re(ρ) = ½).',
    formula: '\\hat{H}\\psi_n = \\gamma_n \\psi_n, \\quad \\gamma_n = \\text{Im}(\\rho_n)',
    intuition: 'Zeta zeros as energy levels of a quantum system. In the Twin-Ladder Bridge model, the Hamiltonian H is a candidate for this operator.',
  },
  {
    id: 'berry-keating',
    category: 'quantum',
    term: 'Berry–Keating Conjecture',
    symbol: '\\hat{H} = x\\hat{p} + \\hat{p}x',
    definition: 'The proposal that the Hilbert–Pólya operator is H = xp (position times momentum), quantized with appropriate boundary conditions. The semiclassical eigenvalues match zeta zero spacings.',
    formula: '\\hat{H}_{BK} = -i\\hbar\\left(x\\frac{d}{dx} + \\frac{1}{2}\\right)',
    intuition: 'The simplest quantum Hamiltonian whose classical dynamics (x(t) = x₀eᵗ, p(t) = p₀e⁻ᵗ) gives hyperbolic flow — matching the structure of the functional equation.',
  },
  {
    id: 'quantum-chaos',
    category: 'quantum',
    term: 'Quantum Chaos',
    definition: 'The study of quantum systems whose classical counterparts are chaotic. The Bohigas–Giannoni–Schmit conjecture says that quantum chaotic systems have GUE statistics — the same statistics as zeta zeros.',
    formula: '\\text{BGS: Quantum chaos} \\Longrightarrow \\text{GUE statistics} \\Longleftrightarrow \\text{Zeta zero statistics}',
    intuition: 'If zeta zeros are eigenvalues of a quantum chaotic system, their spacing statistics (GUE) would be explained.',
  },
  {
    id: 'spectral-determinant',
    category: 'quantum',
    term: 'Spectral Determinant',
    symbol: '\\det(\\hat{H} - E)',
    definition: 'The determinant of (H - E·I) for an operator H. Its zeros are the eigenvalues of H. The xi function ξ(s) plays the role of a spectral determinant for the hypothetical Hilbert–Pólya operator.',
    formula: '\\xi(s) = \\xi(0) \\prod_{\\rho} \\left(1 - \\frac{s}{\\rho}\\right) \\quad \\longleftrightarrow \\quad \\det(\\hat{H} - E) = \\prod_n (E_n - E)',
    intuition: 'The Hadamard product of ξ looks exactly like a spectral determinant — each zero is an "eigenvalue."',
  },
  {
    id: 'scattering-resonance',
    category: 'quantum',
    term: 'Scattering Resonance',
    definition: 'In quantum scattering, a resonance is a complex energy where the S-matrix has a pole. The Twin-Ladder Bridge model maps zeta zeros to transmission nulls of the oscillator cascade — frequencies where the cascade output vanishes via total destructive interference.',
    formula: 'S(E) = \\frac{E - E_r + i\\Gamma/2}{E - E_r - i\\Gamma/2}, \\quad \\text{resonance at } E = E_r',
    intuition: 'At a zeta zero, the cascade transfer function vanishes: ζ(ρ) = 0 means the oscillator stages interfere destructively, producing zero net output.',
  },
  {
    id: 'path-integral',
    category: 'quantum',
    term: 'Path Integral & Zeta',
    symbol: '\\int \\mathcal{D}[x] \\, e^{iS[x]/\\hbar}',
    definition: 'Feynman\'s path integral sums over all trajectories. The Euler product can be viewed as a "discrete path integral" over prime trajectories, where each prime contributes a phase factor.',
    formula: '\\zeta(s) = \\prod_p \\frac{1}{1-p^{-s}} = \\prod_p \\sum_{k=0}^{\\infty} p^{-ks} \\sim \\int \\mathcal{D}[\\text{prime paths}] \\, e^{-S}',
    intuition: 'The Euler product sums over all "histories" of prime factorizations, weighted by p⁻ˢ — a discrete analog of the path integral.',
  },

  // Thermodynamics
  {
    id: 'bost-connes',
    category: 'thermo',
    term: 'Bost–Connes System',
    definition: 'A quantum statistical mechanical system whose partition function is ζ(β) at inverse temperature β. It has a phase transition at β = 1 (σ = 1 for zeta), where symmetry breaking selects a prime.',
    formula: 'Z(\\beta) = \\text{Tr}(e^{-\\beta H}) = \\zeta(\\beta) = \\sum_n n^{-\\beta}',
    intuition: 'The zeta function IS a partition function. The pole at s = 1 is a genuine phase transition. The Twin-Ladder Bridge model makes this physical: σ controls "temperature" of the oscillator chain.',
  },
  {
    id: 'free-energy',
    category: 'thermo',
    term: 'Free Energy',
    symbol: 'F = -T \\ln Z',
    definition: 'In the ZPO thermodynamic interpretation, F = -(1/σ)·ln ζ(σ+it). At σ = ½, the free energy is at a critical point. The free energy landscape determines equilibrium states.',
    formula: 'F(\\sigma, t) = -\\frac{1}{\\sigma} \\ln|\\zeta(\\sigma + it)| + V_{\\text{bridge}}(\\sigma)',
    intuition: 'Zeros of ζ correspond to F → -∞ (divergent free energy) — thermodynamic "singularities" where the system undergoes qualitative change.',
  },
  {
    id: 'partition-function',
    category: 'thermo',
    term: 'Partition Function',
    symbol: 'Z(\\beta)',
    definition: 'The central object of statistical mechanics: sum of Boltzmann weights over all states. For the ZPO system, Z(β) = ζ(β) with β = σ as inverse temperature.',
    formula: 'Z(\\beta) = \\sum_n e^{-\\beta E_n} = \\sum_n n^{-\\sigma} = \\zeta(\\sigma) \\quad (\\text{for }t=0)',
    intuition: 'Each integer n is a "microstate" with energy E_n = log n. The partition function sums their Boltzmann weights.',
  },
  {
    id: 'phase-transition',
    category: 'thermo',
    term: 'Phase Transition',
    definition: 'At σ = 1, the zeta/partition function diverges — a genuine phase transition. For σ > 1 (low temperature): ordered phase, convergent sum. For σ < 1 (high temperature): disordered phase, requires analytic continuation.',
    formula: '\\zeta(\\sigma) \\to \\infty \\text{ as } \\sigma \\to 1^+ \\quad (\\text{critical temperature } T_c = 1)',
    intuition: 'Like ice melting: above the critical temperature, the ordered structure (convergent sum) breaks down. The critical strip 0 < σ < 1 is the "mixed phase."',
  },
  {
    id: 'specific-heat',
    category: 'thermo',
    term: 'Specific Heat & Zeros',
    symbol: 'C_v',
    definition: 'The specific heat C_v = β² ∂²(log Z)/∂β² measures energy fluctuations (variance of the energy). Near zeta zeros, C_v diverges (the system becomes infinitely sensitive to temperature changes).',
    formula: 'C_v(\\sigma, t) = \\sigma^2 \\frac{\\partial^2}{\\partial \\sigma^2} \\left[\\sigma \\cdot F(\\sigma,t)\\right]',
    intuition: 'Zeta zeros are "thermodynamic singularities" where the specific heat blows up — like critical points in real physical systems.',
  },
  {
    id: 'kms-state',
    category: 'thermo',
    term: 'KMS State',
    definition: 'A thermal equilibrium state in quantum statistical mechanics satisfying the Kubo–Martin–Schwinger condition. In the Bost–Connes system, KMS states at inverse temperature β > 1 are parameterized by embeddings of the algebraic closure of Q.',
    formula: '\\omega(AB) = \\omega(B \\alpha_{i\\beta}(A)) \\quad \\text{(KMS condition)}',
    intuition: 'At low temperature (σ > 1), the system "chooses" a prime — spontaneous symmetry breaking. At high temperature (σ < 1), all primes are equally weighted.',
  },

  // Information Theory
  {
    id: 'shannon-entropy',
    category: 'info',
    term: 'Shannon Entropy of Euler Product',
    symbol: 'H(P)',
    definition: 'Treating |H_p(s)|² as probability weights, the Shannon entropy measures how uniformly the Euler product energy is distributed across primes. At σ = ½, entropy is maximized (uniform distribution).',
    formula: 'H(\\sigma) = -\\sum_p \\frac{|H_p(s)|^2}{\\sum_q |H_q(s)|^2} \\log_2 \\frac{|H_p(s)|^2}{\\sum_q |H_q(s)|^2}',
    intuition: 'At σ = ½, every prime contributes equally — maximum disorder, maximum entropy. Off the critical line, some primes dominate.',
  },
  {
    id: 'channel-capacity',
    category: 'info',
    term: 'Channel Capacity',
    symbol: 'C',
    definition: 'The maximum rate of reliable information transmission through the twin-ladder channel. The "noise" is the impedance mismatch between direct and dual ladders. At σ = ½: zero noise, infinite capacity.',
    formula: 'C(\\sigma) = \\tfrac{1}{2} \\log_2(1 + \\text{SNR}), \\quad \\text{SNR} = \\frac{|\\zeta(s)|^2}{|Z_D - Z_{D^*}|^2}',
    intuition: 'The critical line is the "optimal operating point" for the twin-ladder viewed as a communication channel.',
  },
  {
    id: 'fisher-info',
    category: 'info',
    term: 'Fisher Information',
    symbol: 'I_F(\\sigma)',
    definition: 'Measures sensitivity of the Euler product output to changes in σ. The Fisher information diverges at zeta zeros — the system has infinite sensitivity to σ-perturbation, which "pins" zeros to σ = ½.',
    formula: 'I_F(\\sigma) = \\sum_p \\left(\\frac{\\partial}{\\partial \\sigma} \\log|H_p(s)|\\right)^2 \\;\\to\\; \\infty \\text{ at zeros}',
    intuition: 'At a zero, any tiny shift in σ causes a huge change in the output — the system is maximally informative about its position.',
  },
  {
    id: 'kl-divergence',
    category: 'info',
    term: 'KL Divergence from Critical Line',
    symbol: 'D_{\\text{KL}}',
    definition: 'The Kullback–Leibler divergence between the Euler factor distribution at σ and at σ = ½. Measures "extra bits" needed to describe the system off the critical line. Minimum (= 0) at σ = ½.',
    formula: 'D_{\\text{KL}}(P_\\sigma \\| P_{1/2}) = \\sum_p P_\\sigma(p) \\log \\frac{P_\\sigma(p)}{P_{1/2}(p)} \\geq 0',
    intuition: 'The critical line is the information-theoretic equilibrium. Moving away costs information — the system "wants" to be at σ = ½.',
  },
  {
    id: 'mutual-info',
    category: 'info',
    term: 'Mutual Information (Direct-Dual)',
    symbol: 'I(D; D^*)',
    definition: 'The mutual information between the direct ladder ζ(s) and dual ladder ζ(1-s). Maximized when the bridge χ(s) is unitary (|χ| = 1), which occurs at σ = ½.',
    formula: 'I(D; D^*) = H(D) + H(D^*) - H(D, D^*) \\quad \\text{max at } \\sigma = \\tfrac{1}{2}',
    intuition: 'The two ladders "know most about each other" at σ = ½ — maximum correlation, maximum information sharing through the bridge.',
  },
  {
    id: 'rate-distortion',
    category: 'info',
    term: 'Rate-Distortion of ζ(s)',
    definition: 'How many prime oscillators K are needed to approximate ζ(s) to distortion D? The rate-distortion curve R(D) measures the "complexity" of the zeta function in prime-oscillator bits.',
    formula: 'R(D) = \\min\\{K : |\\zeta(s) - \\prod_{p \\leq p_K} H_p(s)| \\leq D\\}',
    intuition: 'A few small primes capture most of ζ — the zeta function is "compressible" in the prime oscillator basis.',
  },
  {
    id: 'kolmogorov-complexity',
    category: 'info',
    term: 'Kolmogorov Complexity',
    symbol: 'K(x)',
    definition: 'The length of the shortest program that outputs string x. Rational numbers have K = O(log N) for N digits, while algorithmically random numbers (like Chaitin\'s Omega) have K ~ N. If ζ(2n+1) has K > O(log N), it must be irrational.',
    formula: 'K(x|N) = \\min\\{|p| : U(p) = x_1 x_2 \\cdots x_N\\}',
    intuition: 'How compressible is a number? Rational numbers repeat (low complexity). If ζ(3)\'s digits resist compression, it cannot be rational.',
  },
  {
    id: 'chaitin-omega',
    category: 'info',
    term: 'Chaitin\'s Constant',
    symbol: '\\Omega',
    definition: 'The halting probability — the probability that a random program halts. Omega is algorithmically random: K(Omega|N) >= N - O(1). Knowing N bits of Omega solves all halting problems up to size N.',
    formula: '\\Omega = \\sum_{p \\text{ halts}} 2^{-|p|}, \\quad K(\\Omega|N) \\geq N - O(1)',
    intuition: 'The most "random" number that can be defined. A benchmark for maximum incompressibility, against which we can measure ζ values.',
  },

  // Geometry & Twistors
  {
    id: 'twistor',
    category: 'geometry',
    term: 'Twistor',
    symbol: 'Z^{\\alpha} = (\\omega^A, \\pi_{A\'})',
    definition: 'A point in Penrose twistor space. In the ZPO mapping, s = σ + it maps to a 4-component twistor with ω encoding displacement from the critical line and π encoding prime-phase oscillation.',
    formula: 'Z^\\alpha = \\left(\\sigma - \\tfrac{1}{2},\\; \\frac{t}{2\\pi},\\; \\cos(t\\log 2),\\; \\sin(t\\log 2)\\right)',
    intuition: 'A different coordinate system for the s-plane that makes the critical line condition geometric — it becomes "two vectors being perpendicular."',
  },
  {
    id: 'dual-twistor',
    category: 'geometry',
    term: 'Dual Twistor',
    symbol: 'W_\\alpha',
    definition: 'The mirror image of the twistor under s → 1-s (the functional equation). The dual twistor W_α encodes the reflected point with ω measuring displacement from the other side.',
    formula: 'W_\\alpha = \\left(\\tfrac{1}{2} - \\sigma,\\; \\frac{t}{2\\pi},\\; \\cos(t\\log 2),\\; -\\sin(t\\log 2)\\right)',
    intuition: 'If the twistor is the "right-hand view" of the s-plane, the dual twistor is the "left-hand view" — they agree at σ = ½.',
  },
  {
    id: 'incidence-relation',
    category: 'geometry',
    term: 'Twistor Incidence Relation',
    definition: 'The condition Z·W = 0 (twistor is "incident" on dual twistor). In the ZPO mapping, this reduces to 2(σ-½)cos(t log 2) = 0, satisfied iff σ = ½ (away from special t-values).',
    formula: 'Z^\\alpha W_\\alpha = 2(\\sigma - \\tfrac{1}{2})\\cos(t \\log 2) = 0 \\;\\Longleftrightarrow\\; \\sigma = \\tfrac{1}{2}',
    intuition: 'The critical line is where twistor and dual twistor are "perpendicular" — a geometric restatement of the symmetry condition.',
  },
  {
    id: 'intertwiner',
    category: 'geometry',
    term: 'Intertwiner (Bridge as Twistor Map)',
    symbol: 'I: Z \\to W',
    definition: 'The map from twistor to dual twistor via the bridge χ(s). Unitary when |χ(s)| = 1 (on the critical line). This is the twistor analog of the lossless bridge in the twin-ladder model.',
    formula: 'I(Z) = \\chi(s) \\cdot W, \\quad |\\chi(\\tfrac{1}{2}+it)| = 1 \\;\\Rightarrow\\; I \\text{ is unitary}',
    intuition: 'The bridge between the two ladders, viewed in twistor space. It maps one view to the other without losing information — but only on the critical line.',
  },
  {
    id: 'weil-explicit',
    category: 'geometry',
    term: 'Weil Explicit Formula',
    definition: 'A duality formula relating sums over zeros to sums over primes. The prime side uses log(p) weights, the zero side uses test function evaluations at ρ. Central to Connes\' approach.',
    formula: '\\sum_\\rho \\hat{g}(\\rho) = \\hat{g}(0) + \\hat{g}(1) - \\sum_{p,k} \\frac{\\log p}{p^{k/2}}\\left[g(k\\log p) + g(-k\\log p)\\right]',
    intuition: 'Primes and zeros are "Fourier dual" — knowing all primes determines all zeros and vice versa. The explicit formula is the conversion rule.',
  },
  {
    id: 'weil-quadratic',
    category: 'geometry',
    term: 'Weil Quadratic Form',
    definition: 'A sesquilinear form W(g*g̃) whose positivity is equivalent to RH. Connes (2026) showed that extremizing this form using only primes < 13 approximates the first 50 zeros to extraordinary precision.',
    formula: 'W(g \\star \\tilde{g}) \\geq 0 \\;\\Longleftrightarrow\\; \\text{RH}',
    intuition: 'RH is equivalent to a quadratic form being positive — like saying a surface always curves upward. And remarkably, a few small primes encode this curvature.',
  },

  // Proof Strategies
  {
    id: 'hilbert-polya',
    category: 'proof',
    term: 'Hilbert-Pólya Conjecture',
    definition: 'The conjecture that there exists a self-adjoint operator A on a Hilbert space whose eigenvalues are the imaginary parts of the zeta zeros. Self-adjointness forces real eigenvalues, which forces Re(ρ) = ½.',
    formula: 'A\\psi_n = \\gamma_n \\psi_n, \\quad A = A^\\dagger \\;\\Rightarrow\\; \\gamma_n \\in \\mathbb{R} \\;\\Rightarrow\\; \\text{Re}(\\rho_n) = \\tfrac{1}{2}',
    intuition: 'If the zeros are eigenvalues of a "nice" (self-adjoint) operator, they MUST be real — and that IS the Riemann Hypothesis. The ZPO gap S5 is exactly this.',
  },
  {
    id: 'darlington-synthesis',
    category: 'proof',
    term: 'Darlington Synthesis',
    definition: 'A classical circuit theory result: a lossless 2-port network has all transmission zeros on the imaginary axis. If the twin-ladder is such a network, its zeros (= zeta zeros) must be at σ = ½.',
    formula: 'S^\\dagger S = I \\;\\Rightarrow\\; |S_{21}(s_0)| = 0 \\;\\Rightarrow\\; |S_{11}(s_0)| = 1 \\;\\Rightarrow\\; s_0 \\text{ on } j\\omega \\text{ axis}',
    intuition: 'A lossless network cannot have zeros off the symmetry axis — energy conservation prevents it. The twin ladder "wants" to be lossless, but proving it for infinite networks is Gap S7.',
  },
  {
    id: 'davenport-heilbronn',
    category: 'proof',
    term: 'Davenport-Heilbronn Function',
    definition: 'A function that has a functional equation AND a unitary bridge, but has zeros OFF the critical line. This proves that bridge unitarity alone cannot prove RH — the Euler product structure is essential.',
    formula: 'f(s) = \\frac{1-i\\kappa}{2}L(s,\\chi_1) + \\frac{1+i\\kappa}{2}L(s,\\bar{\\chi}_1)',
    intuition: 'The "evil twin" of ζ: it passes many tests but fails RH. Any proof strategy that works on D-H is automatically wrong for ζ.',
  },
  {
    id: 'selberg-trace',
    category: 'proof',
    term: 'Selberg Trace Formula',
    definition: 'Relates spectral data (eigenvalues of the Laplacian on a surface) to geometric data (lengths of closed geodesics). Analogous to the Weil explicit formula, with "eigenvalues ↔ zeros" and "geodesics ↔ primes".',
    formula: '\\sum_n h(r_n) = \\frac{\\text{Area}}{4\\pi}\\int h(r)\\,r\\tanh(\\pi r)\\,dr + \\sum_\\gamma \\frac{\\log N(\\gamma)}{N(\\gamma)^{1/2} - N(\\gamma)^{-1/2}} \\hat{h}(\\log N(\\gamma))',
    intuition: 'The "spectral = geometric" duality: eigenvalues encode geodesic lengths. The ZPO twin ladder is a discrete version: "zeros encode prime frequencies."',
  },
  {
    id: 'li-criterion',
    category: 'proof',
    term: 'Li\'s Criterion',
    definition: 'RH is equivalent to all Li coefficients being non-negative. The n-th Li coefficient is a sum over zeros: positive coefficients mean zeros are "well-behaved" (on the critical line).',
    formula: '\\lambda_n = \\sum_\\rho \\left[1 - \\left(1 - \\frac{1}{\\rho}\\right)^n\\right] \\geq 0 \\;\\forall n \\;\\Longleftrightarrow\\; \\text{RH}',
    intuition: 'A checkable condition: compute these numbers and verify they are positive. Finite checks support RH but cannot prove it for all n.',
  },
  {
    id: 'connes-operator',
    category: 'proof',
    term: 'Connes\' Spectral Approach (2026)',
    definition: 'Alain Connes showed that extremizing the Weil quadratic form — restricted to data from only primes less than 13 — yields approximations to the first 50 zeta zeros with accuracy up to 10^{-55}. The approximating values provably lie exactly on the critical line.',
    formula: '\\min_{g} W(g \\star \\tilde{g}) \\;\\text{using } p < 13 \\;\\Rightarrow\\; \\gamma_1 \\approx 14.1347\\ldots \\;(\\text{error} < 10^{-55})',
    intuition: 'The "letter through time": primes 2,3,5,7,11 contain enough information to locate 50 zeros with extreme precision. This is the ultimate compression — 5 numbers encoding 50.',
  },

  // ── Additional Physics & Circuits ──
  {
    id: 'nyquist-criterion',
    category: 'physics',
    term: 'Nyquist Stability Criterion',
    definition: 'A graphical test for feedback system stability: plot the loop gain L(jω) as ω sweeps from -∞ to +∞. The number of encirclements of the critical point -1 equals the number of unstable closed-loop poles. In the Twin-Ladder Bridge model, zeta zeros correspond to frequencies where the Nyquist plot crosses the unit circle.',
    formula: 'N = Z - P, \\quad Z = \\text{closed-loop poles}, \\; P = \\text{open-loop poles}, \\; N = \\text{encirclements of } -1',
    intuition: 'Draw a circle around -1 and count how many times the frequency response curve wraps around it. Each wrap means an unstable mode.',
  },
  {
    id: 'bode-plot',
    category: 'physics',
    term: 'Bode Diagram',
    definition: 'A pair of plots showing magnitude (dB) and phase (degrees) of a transfer function versus log-frequency. In the Twin-Ladder Bridge model, the Bode plot of the cascade reveals the spectral signature of each prime oscillator as a resonance peak at ω = log(p).',
    formula: '|H(j\\omega)|_{\\text{dB}} = 20\\log_{10}|H(j\\omega)|, \\quad \\angle H(j\\omega) = \\arg H(j\\omega)',
    intuition: 'A "fingerprint" of the system showing how it amplifies or attenuates each frequency. Each prime adds a bump at its characteristic frequency.',
  },
  {
    id: 'cue',
    category: 'rmt',
    term: 'Circular Unitary Ensemble (CUE)',
    definition: 'The ensemble of N×N unitary matrices distributed according to Haar measure. Models the scattering matrix of quantum systems with time-reversal symmetry breaking. The bridge χ(s) on the critical line is a 1×1 CUE matrix (random phase).',
    formula: 'U \\in \\text{CUE}(N) \\;\\Leftrightarrow\\; U^\\dagger U = I, \\quad P(U) = \\text{Haar measure}',
    intuition: 'Random unitary matrices — like spinning a wheel of phases. The ZPO bridge at σ=½ is a "random phase multiplier" consistent with CUE statistics.',
  },
  {
    id: 'wigner-surmise',
    category: 'rmt',
    term: 'Wigner Surmise',
    definition: 'The approximate nearest-neighbor spacing distribution for GUE random matrices. Zeros of ζ repel each other with this exact distribution — they avoid being too close, unlike random points.',
    formula: 'p(s) = \\frac{32}{\\pi^2} s^2 e^{-4s^2/\\pi}, \\quad s = \\text{normalized spacing}',
    intuition: 'Zeta zeros "push each other apart" like energy levels of a quantum system. This repulsion pattern matches GUE random matrices perfectly.',
  },
  {
    id: 'eta-function',
    category: 'zeta',
    term: 'Dirichlet Eta Function',
    symbol: '\\eta(s)',
    definition: 'The alternating Dirichlet series η(s) = Σ(-1)^{n-1}/n^s. Converges for Re(s) > 0 (broader than ζ). Related to ζ by η(s) = (1-2^{1-s})ζ(s). Used for regularization in Gap S4 to extend the cascade into the critical strip.',
    formula: '\\eta(s) = \\sum_{n=1}^{\\infty} \\frac{(-1)^{n-1}}{n^s} = (1 - 2^{1-s})\\zeta(s)',
    intuition: 'An "alternating version" of ζ that converges in the critical strip. It lets us compute ζ(s) where the Euler product fails, at the cost of dividing by (1-2^{1-s}).',
  },
  {
    id: 'riemann-siegel-formula',
    category: 'zeta',
    term: 'Riemann-Siegel Formula',
    definition: 'An asymptotic formula for computing the Riemann-Siegel Z function (and hence ζ on the critical line) efficiently. The main sum has only √(t/2π) terms, making it practical for large t.',
    formula: 'Z(t) = 2\\sum_{n \\leq \\sqrt{t/2\\pi}} n^{-1/2} \\cos(\\theta(t) - t \\log n) + O(t^{-1/4})',
    intuition: 'A shortcut for computing ζ on the critical line — instead of infinite sums, you only need ~√t terms. Each term is a cosine at the "prime harmonic" frequency.',
  },
  {
    id: 'theta-function',
    category: 'zeta',
    term: 'Riemann-Siegel Theta Function',
    symbol: '\\theta(t)',
    definition: 'The smooth phase function that converts ζ(½+it) to the real-valued Z(t). Encodes the global phase accumulated from the gamma function factor in the functional equation.',
    formula: '\\theta(t) = \\arg\\Gamma\\!\\left(\\frac{1}{4} + \\frac{it}{2}\\right) - \\frac{t}{2}\\log\\pi \\;\\approx\\; \\frac{t}{2}\\log\\frac{t}{2\\pi e} - \\frac{\\pi}{8}',
    intuition: 'The "clock" that keeps track of how many full cycles ζ has completed along the critical line. Zero crossings of Z(t) — where θ(t) synchronizes with the Euler product — give the zeta zeros.',
  },
  {
    id: 'chebyshev-psi',
    category: 'primes',
    term: 'Chebyshev Psi Function',
    symbol: '\\psi(x)',
    definition: 'The sum of von Mangoldt values up to x: ψ(x) = Σ_{n≤x} Λ(n). A weighted prime counting function whose "staircase" jumps at prime powers. The explicit formula decomposes it into zeta zero oscillations.',
    formula: '\\psi(x) = \\sum_{n \\leq x} \\Lambda(n) = x - \\sum_{\\rho} \\frac{x^{\\rho}}{\\rho} - \\frac{\\zeta\'(0)}{\\zeta(0)} + O(1)',
    intuition: 'A staircase that jumps by log(p) at each prime p and prime power. The ZPO explicit formula decomposes this staircase into oscillating modes — one per zeta zero.',
  },
  {
    id: 'dirichlet-l-function',
    category: 'zeta',
    term: 'Dirichlet L-Function',
    symbol: 'L(s, \\chi)',
    definition: 'A generalization of ζ(s) twisted by a Dirichlet character χ. Each L-function has its own Euler product and zeros. The Grand RH states all nontrivial zeros of all L-functions lie on Re(s) = ½.',
    formula: 'L(s, \\chi) = \\sum_{n=1}^{\\infty} \\frac{\\chi(n)}{n^s} = \\prod_p \\frac{1}{1 - \\chi(p)p^{-s}}',
    intuition: 'Each character χ "reweights" the prime oscillators. The Davenport-Heilbronn function is built from L-functions but lacks a proper Euler product — which is why its zeros can be off the critical line.',
  },
  {
    id: 'bohr-sommerfeld',
    category: 'quantum',
    term: 'Bohr-Sommerfeld Quantization',
    definition: 'A semiclassical rule for finding eigenvalues: the action integral around a classical orbit must be an integer multiple of 2π. Berry-Keating applied this to H = xp to approximate zeta zeros.',
    formula: '\\oint p\\,dx = 2\\pi\\hbar(n + \\tfrac{1}{2}) \\;\\Rightarrow\\; E_n \\approx \\frac{2\\pi n}{\\log(n/2\\pi e)}',
    intuition: 'Standing waves on a drum: only certain frequencies fit exactly. Similarly, the ZPO "drum" (the prime oscillator chain) only resonates at frequencies corresponding to zeta zeros.',
  },
  {
    id: 'borwein-acceleration',
    category: 'analysis',
    term: 'Borwein Acceleration',
    definition: 'A method for accelerating the convergence of the alternating eta series from O(N^{-σ}) to O(3^{-N}). Uses Chebyshev coefficients to reweight partial sums, achieving exponential convergence.',
    formula: '\\zeta(s) \\approx \\frac{-1}{d_N(1-2^{1-s})} \\sum_{k=0}^{N} \\frac{(-1)^k(d_k - d_N)}{(k+1)^s}, \\quad \\text{error} = O(3^{-N})',
    intuition: 'A mathematical "turbo boost" for computing ζ(s) — by cleverly reweighting terms, exponentially faster convergence than brute-force summation.',
  },
  {
    term: 'Noncommutative Geometry (Connes)',
    category: 'quantum',
    definition: 'Connes\' framework replaces classical spaces with operator algebras. For RH, the key space is the adele class space A_Q/Q* — the quotient of adeles by rationals. The zeta zeros emerge as the spectrum of a "Frobenius-like" operator on this space. Connes showed (2026) that restricting the Weil quadratic form to primes < 13 approximates 50 zeros to 10^{-55} accuracy.',
    formula: '\\text{Spec}(\\Theta|_{\\mathcal{H}}) = \\{\\gamma_n : \\zeta(\\tfrac{1}{2} + i\\gamma_n) = 0\\}',
    intuition: 'Replace classical geometry with "quantum geometry" where coordinates don\'t commute. In this world, the primes encode a hidden operator whose eigenvalues ARE the zeta zeros.',
  },
  {
    term: 'Adele Class Space',
    category: 'quantum',
    definition: 'The space A_Q/Q* where A_Q is the ring of adeles (restricted product of all completions of Q — the reals and all p-adic fields Q_p). The quotient by Q* implements the "global" constraint. Connes showed L²(A_Q/Q*) carries a natural representation of the idele class group whose spectral decomposition encodes the Riemann zeros.',
    formula: '\\mathbb{A}_\\mathbb{Q} = \\mathbb{R} \\times \\prod_p^{\\prime} \\mathbb{Q}_p, \\quad \\mathcal{H} = L^2(\\mathbb{A}_\\mathbb{Q}/\\mathbb{Q}^*)',
    intuition: 'Imagine gluing together all possible "views" of the integers — the real line and every p-adic world — into one unified space. The zeta function lives naturally on this space.',
  },
  {
    term: 'Spectral Realization of Zeros',
    category: 'quantum',
    definition: 'The Hilbert-Polya dream made precise: there exists a self-adjoint operator on a Hilbert space whose eigenvalues are the nontrivial zeros of ζ(s). Connes\' approach constructs this space as L²(A_Q/Q*) and the operator as the infinitesimal generator of scaling (the "absorption spectrum" of the adele class space). The ZPO coupling matrix M_jk is a finite-dimensional approximation to this operator.',
    formula: 'M_{jk} = \\gamma_j \\delta_{jk} + \\sum_p \\frac{\\log p}{p} \\cos((\\gamma_j - \\gamma_k)\\log p)',
    intuition: 'The ZPO matrix uses prime-indexed coupling to approximate the infinite-dimensional Connes operator. As the matrix grows, its eigenvalues converge to the actual zeta zeros.',
  },

  // ── New Proof-Status Concepts ──
  {
    id: 'c-h-wall',
    category: 'proof',
    term: 'C_H Wall (Gronwall Obstruction)',
    definition: "The unresolved Gronwall amplification constant C_H that bounds backward heat-flow in the ZPO collision analysis. C_H exists (the flow is bounded) but pinning its numerical value is as hard as RH itself — making it an \"RH-hard\" obstruction. This wall is the primary gap blocking a fully rigorous E_flow bound.",
    formula: 'E_{\\text{flow}} \\leq C_H \\cdot |t_c|^{1/2}, \\quad C_H \\text{ finite} \\Longleftrightarrow \\text{RH}',
    intuition: "Like a speed limit that exists but whose exact value requires solving RH to certify — the wall that currently blocks unconditional rigor in the backward-flow analysis.",
  },
  {
    id: 'phase-vortex-rh',
    category: 'proof',
    term: 'Phase Vortex & RH',
    definition: "The argument of zeta(s) defines a phase field (vector field of constant-argument curves) in the complex plane. At each zero rho, the phase winds by 2pi around a vortex center. RH asserts all vortex centers lie on the critical line sigma = 1/2. The /vortex-field visualization shows this flow directly.",
    formula: '\\arg\\zeta(\\sigma+it) \\text{ winds } 2\\pi \\text{ around } \\rho \\;\\Longleftrightarrow\\; \\zeta(\\rho) = 0',
    intuition: "Zeros are hurricanes in the phase landscape of zeta. RH says all the hurricanes form a single straight line. Vortices off the critical line would mean an off-line zero.",
  },
  {
    id: 'rh-equivalence',
    category: 'proof',
    term: 'RH-Equivalent Statement',
    definition: "A proposition S is RH-equivalent if S is provably equivalent to the Riemann Hypothesis (S iff RH). There are hundreds of such reformulations: Li's criterion (all lambda_n >= 0), Weil positivity, explicit PNT error bounds, and the Volterra operator norm ||V_{a,Phi}|| <= 1. Proving any one unconditionally proves RH.",
    formula: 'S \\Longleftrightarrow \\text{RH}, \\quad \\text{e.g., } \\lambda_n \\geq 0 \\;\\forall n,\\; \\|V\\|_{op} \\leq 1,\\; W(g) \\geq 0',
    intuition: "Different faces of the same crystal. Each RH-equivalent statement is a new attack surface. The ZPO program contributes several new equivalences through the oscillator-chain collapse theorems.",
  },
  {
    id: 'pcc-free',
    category: 'proof',
    term: 'PCC-Free Route',
    definition: "A proof strategy is PCC-free if it avoids assuming the Montgomery Pair-Correlation Conjecture (PCC). Of the 13 primary ZPO paper conjectures, 5 are SUBSUMED-BY-RH through a shared Montgomery PCC obstruction across all live ESY-closure routes — meaning any route through these conjectures implicitly depends on PCC. A PCC-free route navigates around this obstruction without invoking pair-correlation statistics. See /route-map and /pcc-route-exhaustion.",
    formula: '\\text{PCC: } \\int_\\alpha^\\beta \\!\\left(1 - \\tfrac{\\sin^2(\\pi u)}{(\\pi u)^2}\\right)du \\;\\Longleftrightarrow\\; \\text{GUE statistics for zeros}',
    intuition: "PCC-free does NOT mean RH-free: the Riemann Hypothesis is still the target. It only means the proof route does not secretly lean on unproven pair-correlation statistics. Five ZPO routes share a single PCC wall — a PCC-free route must find a path that avoids this shared obstruction entirely.",
  },
  {
    id: 'ch-wall',
    category: 'proof',
    term: 'C_H Wall',
    symbol: 'C_H',
    definition: "The principal unresolved constant barrier in the ZPO program. C_H = C_shock * C_Lip / 4 enters the Gronwall backward-flow integral, which diverges at the eigenvalue collision time t_c, making the C_H discharge RH-equivalent and unconditionally undischargeable by the current route. imp-2640 confirmed the Gronwall discharge fails; imp-2632 showed the OLS-fitted t_c is not rigorous. See /state-of-program and the overclaim-ledger for full C_H-pending status.",
    formula: 'C_H = \\frac{C_{\\mathrm{shock}} \\cdot C_{\\mathrm{Lip}}}{4}',
    intuition: "C_H is the #1 named wall in the route map. Every integral certificate bounding the backward Gronwall flow must ultimately pin C_H to an explicit value — and no unconditional bound exists yet. Until C_H is certified, every beat estimate is an honest ceiling only.",
  },
  {
    id: 'honest-ceiling',
    category: 'proof',
    term: 'Honest Ceiling',
    definition: "Project-standard label for a constant or estimate that is numerically consistent with being an upper bound across all tested N, but is NOT a rigorous unconditional upper bound. Honest-ceiling results are reported with explicit disclaimers and recorded in the overclaim-ledger. The canonical example is the finite-N* beat: empirically below threshold but blocked by C_H. See /state-of-program.",
    intuition: "A ceiling you can measure but not yet prove. The value never exceeds the threshold in experiments, but an undischarged constant (like C_H) means the ceiling could in principle be higher. Honest-ceiling is the opposite of a certified interval-arithmetic bound.",
  },
  {
    id: 'overclaim-ledger',
    category: 'proof',
    term: 'Overclaim Ledger',
    definition: "The canonical registry of claims caught and corrected during development (src/data/overclaim-ledger.js). Records 6 overclaims with status labels: WITHDRAWN (thin-strip E_trunc/kappa_T height mismatch, imp-2630), CORRECTED (kappa_T height-uniformity, imp-2625; E_coll placeholder constants, imp-2661), REGRADED (1/y continuum amplification, imp-2621), RETRACTED (Volterra K_a norm collapse, imp-2660), and DOWNGRADED (Section-27 LINK B two-way collapse, imp-2666). Each page citing a corrected claim must import from this shared registry and render a consistent transparency ledger.",
    intuition: "An honest project keeps a public log of its mistakes. The Overclaim Ledger records every claim that turned out to be wrong, overstated, or based on a flawed argument — along with how it was caught and what the correction is. Not a sign of failure but of rigour.",
  },
  {
    id: 'finite-n-beat',
    category: 'proof',
    term: "Finite-N* Beat (Estimate)",
    symbol: 'E_{\\text{coll}}(N^*) < 0.2',
    definition: "The observation that at N*=1e4 the computed eigenvalue-collision energy E_coll falls below the Lambda <= 0 threshold (~0.2). This is a numerical estimate, not a rigorous unconditional result. The beat is rigorous-modulo-C_H: if the undischarged constant C_H were certified from above, the estimate would become unconditional. Until C_H is certified, the N* beat is an honest-ceiling result, never a QED finite-N beat. The claim of a rigorously-pinned E_coll (imp-2633) was corrected and logged in the overclaim-ledger. See /state-of-program.",
    formula: 'E_{\\text{coll}}(N^*) < 0.2 \\;(\\text{numerical, rigorous-modulo-}C_H)',
    intuition: "The computation says below threshold at N=10000, but the proof says we cannot yet certify this unconditionally because C_H is unknown. Like a measurement with an unresolved systematic error — the central value looks good, but the error bar has no certified bound until C_H is discharged.",
  },
  {
    id: 'sigma-conditional-share-decomposition',
    category: 'proof',
    term: 'Conditional-Share Decomposition sigma(N)',
    symbol: '\\sigma(N)',
    definition: "The three-term ratio sigma(N) = E_coll / (E_trunc + E_flow + E_coll) that tracks how much of the total assembly energy is attributable to eigenvalue-collision (E_coll) versus truncation (E_trunc, N-independent) and backward Gronwall flow (E_flow). E_coll dominates at large N (it scales like sqrt(log T0 / N)), so sigma(N) starts near 1 for small N and decays toward 0 as N grows. This is a diagnostic ratio for tracking which term drives the total, NOT itself an RH bound.",
    formula: '\\sigma(N) = \\frac{E_{\\text{coll}}}{E_{\\text{trunc}} + E_{\\text{flow}} + E_{\\text{coll}}}',
    intuition: "Think of it as a pie chart with three slices (truncation, flow, collision) that changes shape as N grows: at small N the collision slice is nearly the whole pie, and as N grows the other two slices catch up. Two DIFFERENT landmarks get read off this curve and are easy to conflate: the CROSSOVER is where a component-equality condition holds (e.g. E_coll = E_trunc, a closed-form fixed point in N, imp-33723), while the HALVING point is where the composite ratio itself equals one half (sigma(N) = 1/2, an empirical bisection, imp-33582/imp-3444). They live in the same ~3.3e9 region and agree to within about 0.4%, but they answer different questions — one asks when two raw energy terms are equal, the other asks when the SHARE crosses the midpoint — so a close numerical match is a cross-validation, not a proof that they are the same landmark.",
  },
  {
    id: 'nhalf-ncross-axis-invariant-ordering',
    category: 'proof',
    term: 'Axis-Invariant N_half < N_cross Ordering',
    symbol: 'N_{\\text{half}} < N_{\\text{cross}}',
    definition: "The finding (imp-34290, building on imp-33848) that the strict ordering between the sigma=1/2 halving landmark N_half and the E_coll=E_trunc crossover N_cross survives no matter which axis is used to locate them. The original proof bisected both landmarks in N using the Newton-inverted height T0=effectiveHeightForN(N). Relocating both landmarks directly on the HEIGHT axis (bisecting in T0) and recovering N via the exact Riemann-von Mangoldt forward count N=zeroCountAtHeight(T0) reproduces the same ordering with only a ~6e-15 (machine-epsilon) shift in the separation -- confirming the ~0.4% gap is an intrinsic property of the landmark pair, not an artifact of which axis (height or count) it is read on.",
    formula: '\\frac{d(\\log N)}{d(\\log T_0)} = \\frac{T_0}{N}\\cdot\\frac{\\log(T_0/2\\pi)}{2\\pi} \\approx 1.056',
    intuition: "If two thresholds are truly ordered, it should not matter whether you measure the ordering in feet or in meters -- the conversion factor just rescales both sides consistently, it cannot flip which one is bigger. Here the two rulers are the HEIGHT axis (T0) and the ZERO-COUNT axis (N), linked by the Riemann-von Mangoldt density Jacobian (~1.056 in this region). The height gap between the two landmarks (~0.379%) and the count gap (~0.400%) are the same underlying separation stretched by that Jacobian, and the ordering N_half < N_cross survives the stretch on both rulers -- a cross-check of consistency, not a new bound.",
  },
  {
    id: 'eflow-gronwall-residual-collapse',
    category: 'proof',
    term: 'E_flow (Gronwall Backward-Flow Term)',
    symbol: 'E_{\\text{flow}} \\sim \\frac{\\log T_0}{T_0}',
    definition: "E_flow is the smallest of the three energy terms in the sigma(N) conditional-share decomposition (alongside the N-independent E_trunc and the collision term E_coll): a benign, unconditionally-bounded correction that arises from the backward Gronwall flow (imp-2845). Because E_flow decays like log T0 / T0, it shrinks fast down the tail, so the leading closed-form crossover derivations (imp-33723, imp-33743) drop it as negligible and solve the simpler two-term balance E_coll = E_trunc * thr/(1-thr). That leading form already matches the empirical bisection to within a fraction of a percent -- the remaining gap is not noise, it is exactly the size of the term that was dropped.",
    formula: '\\text{leading: } N_{\\text{cross}} = \\left(\\frac{C_C(1-thr)}{E_{\\text{trunc}}\\, thr}\\right)^{2}\\log T_0 \\;\\to\\; \\text{restored: } N_{\\text{cross}} = \\left(\\frac{C_C(1-thr)}{(E_{\\text{trunc}}+E_{\\text{flow}})\\, thr}\\right)^{2}\\log T_0',
    intuition: "Think of the closed-form crossover as a leading-order Taylor approximation with one small term left out on purpose because it looked negligible. At the far-tail landmark (sigma < 0.1, thr = 0.1) the leading form already lands within ~7.38e-5 relative of the empirical bisection (imp-33743, visualized in imp-34355) -- but that residual is not rounding error, since it is ~54x tighter than the ~0.4% residual at the halving landmark (thr = 1/2), and E_flow/E_trunc shrinks by that same ~54x factor between the two landmarks. Plugging E_flow back into the balance (replacing E_trunc with E_trunc + E_flow) closes the gap from ~7.38e-5 all the way to ~1.33e-15 -- machine epsilon -- confirming the entire leading-order residual was E_flow and nothing else (no grid or discretization artifact). It is a clean illustration of how a project can quantify exactly what an approximation left out, rather than just asserting it was small.",
  },
  {
    id: 'eflow-gronwall-offset-attribution-and-robustness',
    category: 'proof',
    term: 'E_flow Gronwall Offset: 95.7% Leading Term, Robust to the A1-Trap Constant',
    symbol: '\\text{relOffset} \\approx 2r + \\delta L,\\; r = E_{\\text{flow}}/E_{\\text{trunc}}',
    definition: "imp-34270 makes the E_flow attribution above explicit at the halving landmark (thr = 1/2): dividing the crossover balance (E_flow dropped) by the halving balance (E_flow restored) gives relOffset = 1 - [L(N_half)/L(N_cross)]/(1+r)^2, which expands to relOffset ~ 2r + deltaL. The doubling (2r, not r) comes from E_coll ~ N^{-1/2}: a fractional bump to the collision target produces a DOUBLED fractional shift in the crossover N. Plugging in the measured r = E_flow/E_trunc ~ 1.91e-3, the leading term 2r = 3.811454e-3 alone accounts for 95.74% of the full measured offset (3.981092e-3); the remaining ~4.3% is deltaL, the log T0 drift between the two landmarks -- and the exact division form reproduces the measured offset to <1e-6 relative, an identity of the two defining equations rather than a fit. imp-34348 then asks whether that 95.7% split is a fragile artifact of one hard-coded constant: E_flow carries a Gronwall trapezoid factor GRONWALL = exp(TC_A1_TRAP) with TC_A1_TRAP = 2.37e-4 (the imp-2762-certified A1-trap upper bound). Sweeping TC_A1_TRAP across its ENTIRE honest uncertainty band [0, 4.74e-4] -- from no amplification at all to double the certified worst case -- moves the leading-2r share only from 95.73884% to 95.73897%, a swing of about 1.3 parts per million.",
    formula: '\\text{leading: } 2r = 3.811454\\times 10^{-3}\\ (95.74\\%) \\quad \\delta L = 1.811946\\times 10^{-4}\\ (4.26\\%) \\quad \\Delta(\\text{share}) \\approx 1.34\\times 10^{-6}\\ \\text{across the full } t_c \\text{ band}',
    intuition: "Two separate questions, two separate modules. First: does the ~0.4% gap between the closed-form crossover and the halving landmark actually decompose the way imp-33723 guessed? imp-34270 forms the explicit two-term split and checks it lands -- 95.7% leading Gronwall term, 4.3% log-T0 drift, no free parameter, reproduced to machine precision. Second, and more important for trusting the number: does that 95.7%/4.3% split depend sensitively on the one hard-coded constant feeding E_flow? If the A1-trap constant TC_A1_TRAP were miscalibrated, would the headline 95.7% figure swing wildly? imp-34348 answers no -- walking the constant across its ENTIRE certified uncertainty band (from zero amplification up to double the certified ceiling) moves the leading share by under two parts per million, six-figure invariance. The reason is structural, not coincidental: E_flow enters both numerator and denominator of the share (2r / (2r + deltaL)) roughly linearly, so its overall size mostly cancels out of the ratio -- only the SPLIT depends on the constant, and that split is protected by the fact that GRONWALL never strays far from 1. Together the two results say: the 95.7% attribution is a real, formed identity (not just a named guess), and it is not a lever anyone could move by tweaking an uncertain input constant.",
  },
  {
    id: 'crossover-surplus-composite-exponent-limit',
    category: 'proof',
    term: 'Crossover-Surplus Composite Exponent -> 3',
    symbol: '\\text{surplus}(thr) \\sim thr^3 \\;\\text{(as } thr \\to 0\\text{)}',
    definition: "The crossover surplus (imp-34174/imp-34248) is a small correction term whose size shrinks as the threshold thr shrinks, and its log-log slope (the 'composite exponent') looked like it was settling near ~2.88 -- a plausible-looking non-round number -- when fit over the accessible numerical range down to thr = 0.01. imp-34329 pushed the fit far deeper into the tail (thr down to 1e-12) and found the exponent does NOT keep drifting down toward that plateau: it bottoms out at a shallow minimum ~2.8711 and then climbs back up, monotonically, toward exactly 3.",
    formula: '\\text{local } r\\text{-exponent} = 2 - \\frac{c}{\\log T_0},\\quad c \\approx 4.4 \\;\\Rightarrow\\; \\text{composite} = 1 + r\\text{-exponent} \\to 3',
    intuition: "Fitting a power law over a finite window can be fooled by a slowly-fading correction hitching a ride on the true exponent. Here the surplus is built from a clean thr^1 prefactor times a ratio r(thr) that behaves like thr^2 wrapped in a log(T0)-dependent correction -- and log(T0) itself grows as thr shrinks, so on any FINITE stretch of the tail the measured slope reads a bit shallower than 2 (giving a composite a bit shallower than 3, like the observed ~2.88). What imp-34329 shows is that this softening correction decays like 1/log(T0) -- so it never stops shrinking, it just shrinks slowly (logarithmically). Push the fit far enough into the tail and the correction becomes negligible, the measured exponent swings back up past its shallow minimum, and the true, exactly-round limiting value of 3 is what remains. The lesson: a numerically-fit exponent that looks like it is settling at a non-round value can still be an in-between reading of a slow-decaying correction, not the asymptotic truth -- you only find out by checking whether pushing deeper keeps moving the number, or turns it around.",
  },
  {
    id: 'eflow-ratio-r-exponent-limit',
    category: 'proof',
    term: 'Isolated E_flow-Ratio r-Exponent -> 2 (From Below)',
    symbol: 'r(thr) \\sim thr^2 \\;\\text{(as } thr \\to 0\\text{)}',
    definition: "The companion result to the composite-exponent-to-3 finding above: factoring the crossover surplus as surplus(thr) = P(thr) . r(thr) (imp-34248) isolates r(thr), the E_flow-to-E_trunc ratio, whose own log-log slope was measured DROPPING below 2 across imp-34248's ladder (2.985, 2.235, 1.978, 1.897, down to a deep-tail OLS reading of ~1.917). imp-34349 derives the analytic limit of this isolated r-exponent directly and confirms it is exactly 2, approached from below, with leading correction -4/log T0 -- the same logarithmically-slow mechanism as the composite exponent, but read on the r-factor alone rather than the full surplus.",
    formula: '\\frac{d\\log r}{d\\log thr} = 2 - \\frac{4}{\\log T_0},\\quad 2 - \\text{exponent} \\sim \\frac{4}{\\log T_0} = \\frac{2}{-\\log thr + C/2}',
    intuition: "The self-consistent crossover pins T0(thr) ~ const . thr^-2 (the log(T0) factors that would otherwise iterate cancel out), so log T0 grows like -2 log thr. Since r ~ (log T0)^2 / T0, differentiating log r in log thr gives exactly 2 minus a correction that shrinks like 1/log T0 -- logarithmically slow, so halving the gap to 2 requires SQUARING thr, not just halving it. That slow shrinkage is why the measured local exponent looked like it might be settling at a sub-2 constant near ~1.875: pushing the ladder from thr = 0.005 down to thr = 0.0001 shows it turn around and climb back toward 2 (1.8752 -> 1.8764 -> 1.8820 -> 1.8887), and the gap-times-log(T0) product stabilises right at the derived leading coefficient 4. Same lesson as the composite-exponent explainer: a sub-round numerically-fit exponent can be an in-between reading of a slow correction rather than the true asymptotic value -- here confirmed on the isolated r-factor in addition to the full composite.",
  },
  {
    id: 'crossover-surplus-sub-cluster-narrative',
    category: 'proof',
    term: 'Crossover-Surplus Sub-Cluster: One Chain, Four Modules',
    symbol: '\\text{surplus}(thr) = P(thr)\\, r(thr) \\;\\to\\; thr^1 \\cdot thr^2 = thr^3',
    definition: "Four modules build one chain and are easy to read out of order, so here is the thread in one place. (1) imp-34174 DEFINES the surplus: generalising the imp-33848 halving-vs-crossover gap to an arbitrary threshold thr gives the closed form surplus(thr) = thr(1-thr) r / (1 + (1-thr) r), with r = E_flow/E_trunc at the thr-crossover, and tabulates it collapsing 4.744e-4 -> 4.213e-9 across thr in {0.5,...,0.01}. (2) imp-34248 FACTORISES that closed form as surplus = P(thr) . r(thr): a prefactor P that -> thr linearly, times the E_flow ratio r whose measured local exponent looked like it was drifting down toward ~1.9 (not 2) over the accessible range -- making the composite exponent look like it was settling near ~2.88, not the round 3 a naive thr . thr^2 count would predict. (3) imp-34329 pushes the composite-exponent fit far deeper into the tail and shows it does NOT keep sliding: it bottoms at a shallow minimum ~2.8711 and climbs back, monotonically, toward exactly 3. (4) imp-34349 does the same derivation on the ISOLATED r-factor alone and confirms its exponent is exactly 2, approached from below, with the same leading correction -4/log T0 driving both climbs.",
    formula: '\\text{surplus}(thr) \\sim thr^1_{\\text{(imp-34174/34248 prefactor)}} \\cdot thr^{2 - 4/\\log T_0}_{\\text{(imp-34349 r-exponent)}} \\;\\xrightarrow{thr \\to 0}\\; thr^3_{\\text{(imp-34329 composite limit)}}',
    intuition: "One way to get lost in this cluster is to read the four modules in isolation and see four different-looking numbers (a closed form, a factorisation, ~2.88, ~2). They are the same object at increasing resolution. imp-34174 writes down the exact surplus; imp-34248 splits it into a clean thr^1 piece and a messier r(thr) piece and notices the messier piece looks like it is settling below its natural power; imp-34329 and imp-34349 both diagnose the SAME cause -- log T0 growing as thr shrinks softens the exponent by a term that decays like 1/log T0, logarithmically slowly -- once on the combined surplus, once on the isolated ratio, and both recover the same round limit (3 and 2, respectively, related by the fixed +1 from the prefactor). Reading them as one chain rather than five separate modules is the point: definition, factorisation, and two confirmations of the identical slow-correction mechanism at two different resolutions.",
  },
  {
    id: 'fartail-composite-exponent-cohort-exactly-3',
    category: 'proof',
    term: 'Far-Tail Composite-Exponent Cohort: A_r (log T0)^2 thr^3 and the Constant c=4',
    symbol: '\\text{surplus}(thr) = A_r (\\log T_0)^2\\, thr^3 (1+o(1)),\\quad A_r \\approx 5.264698\\times10^{-6}',
    definition: "Five modules (imp-34329, imp-34407, imp-34412, imp-34414, imp-34428) close out the crossover-surplus-sub-cluster narrative above by pinning down both the limiting power (exactly 3) and the size of the logarithmic correction that makes any FINITE numerical reading undershoot it. imp-34329 pushes the composite-exponent ladder deep into the tail (thr down to 1e-12) and finds it does not settle at the ~2.88 plateau -- it bottoms at a shallow minimum ~2.8711 and climbs back, monotonically, toward 3, fitting the local softening as r-exponent = 2 - c/log T0 with a secant-measured c~4.4. imp-34407 derives that constant analytically: since the crossover pins log T0 ~ -2 log thr + const, the leading correction is EXACTLY c=4 (two factors of 2: the square on log T0 in r ~ (log T0)^2 thr^2, times the slope 2 of log T0 in -log thr) -- not log(2pi), and not the measured 4.4. imp-34412 extends the deep probe three more decade-pairs, to thr=1e-18, and shows the composite climbing on with no plateau (2.949 -> 2.959) and the secant correction c descending 4.33 -> 4.27 toward the derived 4. imp-34414 corroborates all of this independently by expanding the exact closed form directly rather than extrapolating secants, confirming the leading power is exactly thr^3 with coefficient A_r ~ 5.264698e-6. imp-34428 reconciles the last gap -- why the secant c reads ~4.4-4.5 rather than the derived 4 -- by fitting a two-parameter model with an explicit 1/log^2 T0 term: on the instantaneous exponents the leading coefficient collapses to c1~4.01 (confirming the derivation), while on the coarser decade secants it stays near 4.46 because a genuine 1/log^2 T0 term cannot fully absorb a finite-window finite-difference artifact.",
    formula: '\\frac{d\\log\\,\\text{surplus}}{d\\log\\,thr} = 3 - \\frac{4}{\\log T_0} + O\\!\\left(\\frac{1}{\\log^2 T_0}\\right) \\;\\xrightarrow{thr\\to 0}\\; 3',
    intuition: "The whole cohort is one cautionary tale about fitting exponents on finite data, told in five acts. Act one (imp-34329): a numerically fit exponent looked like it was settling near a plausible-but-wrong ~2.88 -- until pushing the fit ten more orders of magnitude into the tail revealed it had only paused at a shallow minimum before turning back up. Act two (imp-34407): rather than trust yet another finite-precision fit for the correction constant, derive it -- the self-consistent crossover forces log T0 to grow like -2 log thr, and that single fact alone pins the correction coefficient at exactly 4, a clean small integer, not the messier 4.4 the secants suggested. Act three (imp-34412): push deeper still (three more decade-pairs, thr=1e-18) and check the climb doesn't stall -- it doesn't, and the secant correction visibly descends toward the derived 4. Act four (imp-34414): stop extrapolating altogether and just expand the known closed form directly -- the leading behaviour surplus ~ A_r(log T0)^2 thr^3 drops straight out, with no fitting involved, corroborating every earlier reading. Act five (imp-34428): finally explain why the coarse secants still read high (~4.46) even though the true instantaneous constant is 4 -- a genuine next-order 1/log^2 T0 term accounts for part of the gap, and the rest is an ordinary finite-difference window artifact, not a new physical effect. None of this touches any RH bound: the underlying component model is the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; E_flow remains the benign mesoscopic-Gronwall term (imp-2845) untouched from the divergent C_Lip collision-Gronwall; C_mb stays GUE-conditional per imp-486; Platt-Trudgian Lambda<=0.2 remains the SOTA unconditional bound; no QED.",
  },
  {
    id: 'fixed-band-peak-log-family-divergence',
    category: 'proof',
    term: 'Fixed-Band Peak Third-Difference: Slow Logarithmic-Family Divergence',
    symbol: '\\text{third\\_diff}(x) \\sim K x^{-p(x)},\\; p(x) \\downarrow \\;(x = k^*-k_{\\text{end}} \\to 0)',
    definition: "The fixed-band (k<=10) peak's third differences grow steadily as kEnd approaches the surrogate resid_exp zero k*~21.28095 (imp-34268 F3), reaching +0.057428 at the last computable rung kEnd=21.25. imp-34253 already read the peak itself as diverging LOGARITHMICALLY (peak ~ A - B ln x, weak coefficient B~0.085), rather than a genuine pole. imp-34346 confirms this at the level of the third differences: a log-log power-law fit of third_diff against the pole gap x=k*-kEnd gives an effective order p~0.937 over the pole-dominated tail, but the LOCAL order measured from just the last pair of nodes drops further to ~0.671 -- the effective order keeps DECREASING as x shrinks. A true integer-order pole would hold its order steady or rising; only a sub-power, logarithmic-family divergence produces an order that keeps falling toward the pole.",
    formula: 'p_{\\text{tail}} \\approx 0.937 \\;(R^2\\approx 0.95) \\;\\to\\; p_{\\text{local}} \\approx 0.671 \\;\\text{(decreasing as } x\\to 0\\text{)}',
    intuition: "A simple pole like 1/x has a constant order 1 no matter how closely you zoom in -- the exponent in a log-log plot stays flat. A logarithm like -ln(x) is sneakier: differenced discretely, it still LOOKS like a power law locally, but the effective exponent you read off keeps sliding down the closer you get to zero, because ln(x) grows far slower than any x^(-p) with p>0. That is exactly the signature imp-34346 finds -- the fitted order drops from ~0.937 on the wider tail to ~0.671 on the last pair of nodes, consistent with imp-34253's independent reading that the underlying peak itself is a weak logarithmic divergence (B~0.085), not a genuine pole. The honest caveat: with a fixed step h=0.25 much larger than the remaining gap x~0.031 at kEnd=21.25, the discrete third difference smears the singularity across a wide stencil, so this is an EFFECTIVE order from finite differences, not a rigorous continuous exponent -- the finer sub-pole windows needed to sharpen it are themselves undefined (resid_exp loses digits past kEnd>=21.5, per imp-34253/imp-34346's shared SUB-GAP-imp-34346-continuous-order-blocked). None of this changes any RH bound: the pole itself is a surrogate-model artifact of the inherited imp-3220/imp-3406 extrapolation, not a physical singularity; C_mb remains GUE-conditional per imp-486, Platt-Trudgian Lambda<=0.2 remains the SOTA unconditional bound, and there is no QED.",
  },
  {
    id: 'coefficient-vs-exponent-residue-reconciliation',
    category: 'proof',
    term: 'Two Residues, One Pole: Coefficient vs. Exponent',
    symbol: 'g(k) = R\\,(k-k^*)^{p},\\quad R = \\tfrac{E_\\star}{m},\\; p = -1',
    definition: "The eflow_over_resid ratio has a simple pole at k* ~ 21.28095, and two earlier modules each report a \"residue\" there that looks wildly different: imp-34310 reads R ~ -1.979e-8 (a raw-ratio measurement), while imp-34247 reads exactly +1 (a log-derivative measurement). imp-34398 shows these are not competing estimates of the same number -- they are two DIFFERENT features of the same leading term g(k) = R (k-k*)^{-1}. R (the imp-34310 number) is the COEFFICIENT: it carries the physical amplitude (E_star, the value of eflow_attr at the pole) divided by the local slope m of the vanishing denominator, so it has units and a sign. The +1 (the imp-34247 number) is the EXPONENT: taking a log first (ln g = ln|R| + p ln(k-k*)) and then differentiating makes the coefficient R cancel out entirely, leaving only the bare pole order p=-1 (reported as +1 in imp-34247's k*-k convention).",
    formula: '\\ln g = \\ln|R| + p\\ln(k-k^*) \\;\\Rightarrow\\; \\frac{d}{dk}\\ln g = \\frac{p}{k-k^*} \\;(R\\text{ cancels})',
    intuition: "Think of a coin: R is the coin's face value (it matters whether it is a penny or a dollar), while the pole order +1 is just \"this is a coin\" -- a count, not an amount. imp-34310 weighed the coin (amplitude, ~8 orders of magnitude below 1, and negative because E_star>0 while the slope m<0). imp-34247 only asked \"is this a simple pole or a double pole\", and taking a logarithmic derivative is precisely the trick that erases the coin's value and leaves only its type: rescaling R by 5e7 in imp-34398's stress test left the log-derivative reading unchanged to under 1e-6. So the ~8-order-of-magnitude gap and the sign flip between the two published residues are not a bug or a discrepancy to resolve -- they are the expected difference between measuring an amplitude and measuring an order of the SAME monomial, bridged by one shared quantity (the resid_exp local slope m). Measurement/derivation only; the underlying component model is the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; C_mb remains GUE-conditional per imp-486; Platt-Trudgian Lambda<=0.2 remains the SOTA unconditional bound; no QED.",
  },
  {
    id: 'sigma-vs-product-gap-log2pi-shift',
    category: 'proof',
    term: 'Sigma Channel vs. Product Channel: the log(2pi) Shift',
    symbol: '1 - \\frac{\\text{gapSigma}}{\\text{gapProduct}} = \\frac{1+\\log 2\\pi}{\\log T_0}',
    definition: "Two different modules each measure a small \"approach gap\" to the value 1/2, built from the exact same underlying finite-N residual, but they do NOT agree with each other -- and imp-34328/imp-34415 explain why. Write u = log(T0/2pi) and log T0 = u + log(2pi). The PRODUCT channel (imp-34197) multiplies the shared residual by log T0, and the log(2pi) piece cancels exactly, leaving a clean gapProduct = 1/(2u). The SIGMA channel (imp-33816) is the bare sigma-exponent shortfall 1/2 - p(N); it never gets multiplied by log T0, so it keeps the log(2pi) offset and its leading term is gapSigma ~ 1/(2 log T0) instead. The two gaps are not competing measurements of one law -- they are the same residual read on two different axes (u for the product, log T0 for the sigma exponent), and the axes differ by the constant log(2pi) = 1.83788.",
    formula: '\\text{gapSigma}\\cdot\\log T_0 + \\text{gapProduct} = \\tfrac12 \\ \\text{(exact complement)}, \\qquad \\text{gapProduct}=\\frac{1}{2u},\\ \\ \\text{gapSigma}\\sim\\frac{1}{2\\log T_0}',
    intuition: "Picture two rulers marking off the same physical gap, but one ruler is calibrated in inches and the other in centimeters offset by a fixed conversion constant -- they will never read the identical number, yet both are correctly measuring the same thing. Here the \"conversion constant\" is log(2pi): the product channel's multiplication by log T0 happens to cancel it exactly, while the sigma channel's raw reading keeps it. That is why gapSigma * log T0 + gapProduct = 1/2 EXACTLY at every rung (imp-34328 F2) even though gapSigma and gapProduct themselves never match. Because the mismatch is a genuine log(2pi)/log T0 term rather than noise, it fades only LOGARITHMICALLY: imp-34415 shows the ratio gapSigma/gapProduct first climbs above 0.99 only once log10 N passes roughly 124.9 -- an astronomically deep height, illustrating how slowly a log(2pi)-sized additive shift washes out of a ratio that itself decays like 1/log T0. Diagnostic exposition only; conditional-share cross-check, not an RH bound; the component model is the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; C_mb remains GUE-conditional per imp-486; Platt-Trudgian Lambda<=0.2 remains the SOTA unconditional bound; no QED.",
  },
  {
    id: 'coupling-ratio-205-vs-2-reconciliation',
    category: 'proof',
    term: 'Coupling Ratio ~2.05 vs. Limit 2: Two Readings of One Slowly-Decaying Excess',
    symbol: '\\text{coupling}(N_{\\text{cross}}) = 2 + \\frac{2}{\\log T_0} + O\\!\\left(\\frac{1}{\\log^2 T_0}\\right)',
    definition: "imp-34447 read the coupling-ratio residual/(E_flow/E_trunc) turn-over across four closed-form crossover landmarks (2.089015, 2.078776, 2.066432, 2.057639) and concluded qualitatively that it 'converges to a finite limit ~2.05' -- the value at the then-deepest thr=0.001 landmark. imp-34487 added a fifth, ultra-deep thr=0.0001 landmark (2.050855) and, rather than reading off the latest number, fit the excess-above-2 sequence directly against x=1/log T0: as shallower landmarks are dropped from the fit the intercept collapses toward zero and the slope toward 2, pinning the finite limit at the LEADING value 2 (approached from above as ~2/log T0), not ~2.05. The two readings are not in conflict -- '~2.05' was never claimed as the asymptote, only the value reachable at that landmark's depth, and the ratio never once crosses below 2 in either module.", formula: '\\text{excess}(N_{\\text{cross}}) \\equiv \\text{coupling}-2 = \\frac{2}{\\log T_0} + O\\!\\left(\\frac{1}{\\log^2 T_0}\\right) \\;\\xrightarrow{\\log T_0 \\to \\infty}\\; 0^{+}',
    intuition: "Think of watching a ball roll down a very long, very gently sloped hill toward a wall at height 2: at any finite point in the video you can quote the ball's current height (2.09, then 2.08, then 2.07, ..., then 2.05) and each is a perfectly honest reading -- but none of those readings IS the wall. imp-34447 only had four frames of the video and reported the last one it could see, correctly flagging that the drift was decaying rather than constant-rate. imp-34487 added a fifth, much deeper frame and then did something different: instead of reporting a number, it fit the whole trajectory to 1/log T0 and extrapolated where the ball is headed -- and the fit gets cleaner (R^2 climbing from 0.9887 to 0.99999) the more of the shallow, early frames it drops, with the intercept converging to exactly 2. That is why both readings survive at once: the structural relation coupling = residual/r -> 2 as r = E_flow/E_trunc -> 0 (imp-34270/imp-34351) fixes the true asymptote at 2, while log T0 grows so slowly with N that the 2/log T0 excess is still ~0.05-0.09 at every landmark depth humans can actually reach in this project's closed-form crossover ladder -- so '~2.05' and 'converges to 2' describe the SAME curve, one naming where it currently is and the other naming where it is going. Measurement/extrapolation only, on the inherited imp-3220/imp-3406 component model, NOT a rigorous asymptotic; changes no bound; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a>=0 untouched; NO QED; Platt-Trudgian Lambda<=0.2 remains the SOTA unconditional bound.",
  },
  {
    id: 'etrunc-floor-vs-lpt-ingredient-not-competitor',
    category: 'proof',
    term: 'E(N) -> E_trunc: An Ingredient of L_pt, Not a Rival Bound',
    symbol: 'E(N) \\xrightarrow{N\\to\\infty} E_{\\text{trunc\\_pt}} \\approx 3.06\\times10^{-5} \\;\\subset\\; L_{pt} = L_{\\text{cond}} + E_{\\text{trunc\\_pt}}',
    definition: "imp-34434 tabulates the bridge total E(N) = E_trunc + E_flow(N) + E_coll(N) and finds it monotone decreasing with no interior minimum, settling on an N-independent floor E_trunc_pt ~ 3.06e-5 as N -> infinity. It is tempting to read that floor as a competing estimate of the Lambda beat -- since 3.06e-5 sits roughly 3954x below L_pt~0.121 (imp-459) and roughly 6536x below the Platt-Trudgian SOTA bound 0.2 -- but that comparison is a category confusion. E_trunc_pt is not an independent quantity racing L_pt to a smaller number; per imp-459's definition L_pt(sigma,N0) = L_cond(N0) + E_trunc_pt(sigma), it is already one of the two additive pieces INSIDE L_pt's assembly.",
    formula: 'L_{pt} = \\underbrace{L_{\\text{cond}}(N_0)}_{\\text{tcProj+E\\_flow+E\\_coll at }N_0} + \\underbrace{E_{\\text{trunc\\_pt}}(\\sigma)}_{\\text{the imp-34434 floor}},\\quad E_{\\text{trunc\\_pt}}=\\frac{2\\,e_I(\\sigma)}{\\kappa(\\sigma)}\\,T_{PT}^{-\\kappa(\\sigma)}',
    intuition: "E(N) is a bridge assembly-error budget (imp-2564): Lambda(N) <= |t_c(N)| + E(N) is the actual inequality, not E(N) itself. So E(N) -> E_trunc_pt says only that the assembly-error floor shrinks to a fixed constant as N grows -- it says nothing directly about Lambda. That same constant, E_trunc_pt (the Ingham zero-density truncation term at Platt-Trudgian's verified height T_PT=3e12), is precisely the piece imp-459 ADDS to L_cond to build the finite-height beat L_pt: at the optimized sigma_opt=0.75 it evaluates to ~3.06e-5, pushing L_pt down to ~0.121. Comparing imp-34434's floor to L_pt is therefore comparing a sub-term to the whole sum it is already folded into -- like noting that a company's shipping-cost line item is smaller than its total revenue and concluding shipping costs are outcompeting revenue. The correct reading: as sigma and N0 are tuned (imp-447 -> imp-459), driving E_trunc_pt down is exactly HOW L_pt was improved from ~sigma=0.61's looser bound toward ~0.121, not a rival path to a smaller bound. None of this changes any RH bound: the component model is the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; C_mb remains GUE-conditional per imp-486; Platt-Trudgian Lambda<=0.2 remains the SOTA unconditional bound; no QED.",
  },
  {
    id: 'imp-2564-headline-vs-bridge-reframing',
    category: 'proof',
    term: 'Headline vs. Bridge: What a t_c Bound Actually Buys',
    symbol: '\\Lambda \\le -t_c(N) + E(N) \\;\\xrightarrow{\\,t_c\\ge 0\\,}\\; \\Lambda \\le E(N)',
    definition: "The finite-N bridge sandwiches Lambda between two faces built from the particle collision time t_c(N): |Lambda + t_c(N)| <= E(N), i.e. Lambda in [-t_c(N) - E(N), -t_c(N) + E(N)]. imp-2564 traces which face each kind of t_c bound actually feeds. A LOWER bound t_c(N) >= L feeds the HEADLINE (upper) face: Lambda <= -L + E(N). With only the trivial L = 0 (every collision time is non-negative), this already reads Lambda <= E(N) -- so the headline inequality needs NOTHING sharper than t_c >= 0, and the entire remaining burden falls on the bridge error E(N) going to zero.",
    formula: '\\text{(lower bound on }t_c\\text{)}\\;t_c\\ge L \\Rightarrow \\Lambda\\le -L+E(N);\\qquad \\text{(upper bound)}\\;t_c\\le U \\Rightarrow \\Lambda\\ge -U-E(N)\\le 0',
    intuition: "SG1 and its descendants (local-virial shock bounds, Theta-contraction) work hard to produce UPPER bounds on t_c(N) -- tighter and tighter ceilings on how large the collision time can be. imp-2564's sign audit shows this effort feeds the OTHER face of the bracket: an upper bound t_c <= U only gives Lambda >= -U - E(N), a number that is always <= 0 and so is permanently swamped by the unconditional Rodgers-Tao floor Lambda >= 0 -- it moves nothing on the headline RH inequality Lambda <= 0. What SG1-style bounds DO buy is fidelity of the finite-N particle model to the true continuum object, which is exactly what the bridge constants E(N) measure (how well the truncated N-particle collision process tracks the real Lambda). So a sharper t_c(N) bound is real progress on connection fidelity -- shrinking E(N) -- even though it is invisible to the headline face, where the trivial t_c >= 0 already suffices and the whole lever is E(N) -> 0. Audit/reframing only, no new Lambda value: C_mb remains GUE-conditional per imp-486; Platt-Trudgian Lambda<=0.2 remains the SOTA unconditional bound; no QED.",
  },
  {
    id: 'residexp-peak-location-resolution-floor',
    category: 'proof',
    term: 'Why the Deep-Rung Argmax k* Only Has ~6-7 Reliable Digits',
    symbol: '\\delta k \\sim \\sqrt{\\frac{2\\,\\epsilon_f}{|f_2|}} \\approx 7.2\\times10^{-8}',
    definition: "imp-34228 pinned the double-precision ternary-search peak of resid_exp(k) at k_true~8.8210915878573530, sitting ~4.27e-11 below a stored 10-sig-fig anchor 8.8210915879 -- raising the question of whether that tiny offset is a real feature. imp-34368 answers it by measuring the peak-location floor directly: the curvature at the peak is stable at f2~-0.036196 (a genuine signal), but resid_exp itself carries an RMS evaluation noise eps_f~9.4e-17 (~6.5 ulp of the peak value ~0.0653366) from f64 rounding accumulated across the underlying regression. Feeding a noisy function value into a smooth maximum blurs the location of that maximum by dk ~ sqrt(2 eps_f/|f2|) ~ 7.2e-8 -- and re-running the identical ternary search from ten different starting brackets confirms it directly, scattering the returned peak by ~9e-8 (std ~2.5e-8), matching the formula to a factor ~1.25.",
    formula: '\\epsilon_f \\sim 6.5\\,\\text{ulp}(f_{\\text{peak}}) \\approx 9.4\\times10^{-17}, \\;\\; |f_2| \\approx 0.036196 \\;\\Rightarrow\\; \\delta k \\approx 7.2\\times10^{-8} \\;\\Rightarrow\\; k^* = 8.82109\\underbrace{15878\\ldots}_{\\text{noise past here}}',
    intuition: "Near a smooth maximum, the function is locally flat -- it looks like f(k) = f_peak - (1/2)|f2|(k-k*)^2 -- so any noise eps_f riding on the function VALUE gets amplified into an uncertainty on the LOCATION by dividing by the (small) curvature and taking a square root: a flatter peak (smaller |f2|) or noisier evaluations (bigger eps_f) both blur the argmax more. Here eps_f is fixed at roughly 6-7 ulp by ordinary f64 rounding inside resid_exp's own internal regression -- not a bug, just the ordinary cost of floating-point accumulation -- and that noise floor translates to a location blur of ~7.2e-8. Since k*~8.82 has one digit before the decimal point, a location blur at the 7-8th decimal place means only about 6-7 of the digits reported for k* (through '8.82109') are trustworthy; everything past that point is evaluation noise, confirmed because ten independent re-runs of the SAME search return ten different peaks scattered across almost exactly that same ~1e-7 window. The only lever that lowers the floor is raising the WORKING precision of the resid_exp evaluation itself (e.g. bignum/double-double, which shrinks eps_f) -- switching to an analytic derivative does not help, because a derivative estimate inherits and even amplifies the same f64 value noise. Measurement/noise-characterization only, on the inherited imp-3220/imp-3406 descriptive surrogate, NOT a rigorous asymptotic; C_mb remains GUE-conditional per imp-486; changes no bound; Platt-Trudgian Lambda<=0.2 remains the SOTA unconditional bound; no QED.",
  },
  {
    id: 'drift-residual-curvature-floor',
    category: 'proof',
    term: 'Why a Finite-Difference Drift Residual Is a Curvature Reading',
    symbol: 'C_{th} = -\\frac{1}{q_1}\\left(\\frac{q_2}{2q_1}-\\frac{q_3}{6q_1}\\right),\\;\\; C_{q_2}/C_{th}\\approx 0.98',
    definition: "The crossover exponent m(N) = d(log N)/d(log E_coll) is measured in this project by a central finite difference on nodes N(1 +/- h) rather than a true derivative, and that measurement carries a small, shrinking residual against the closed-form exponent as N climbs the 1e13..1e14 ladder. imp-34531 shows this residual is exactly the O(h^2) truncation error of the central difference, with coefficient C_th built from the 1st/2nd/3rd log-N derivatives of q=log E_coll: about 98% of C_th is the pure second-derivative (curvature) term, and the remaining ~2% is a third-derivative correction -- so the residual shrinking down the ladder is the drift exponent's curvature relaxing, not noise or an unrelated drift.",
    formula: 'q(p)=\\log E_{coll}(p),\\; p=\\log N;\\;\\; \\text{measured} - \\text{true} = \\frac{h^2}{q_1}\\left(\\frac{q_2}{2q_1}-\\frac{q_3}{6q_1}\\right) + O(h^4)',
    intuition: "A central difference never returns an exact derivative -- it returns the true slope plus a small overshoot set by how much the function curves between the two sample points, exactly the same way estimating a hill's steepness from two nearby marker posts misses by an amount that depends on how much the hill bends between them, not on how steep it is. Here that overshoot is almost entirely (~98%) the plain second-derivative curvature of q=log E_coll in log N, with a small third-derivative correction (~2%) accounting for the fact that the two sample nodes are not perfectly symmetric in log N once you look one order further. That is why the raw residual and the closed-form second derivative shrink in lockstep down the N=1e13..1e14 ladder, constant to within ~6%: the residual IS a faithful, if slightly impure, proxy for the drift exponent's curvature, and the ~2% impurity is fully accounted for rather than being an unexplained gap. Measurement/attribution only, on the inherited imp-3220/imp-3406 extrapolation which is NOT a rigorous asymptotic; C_mb remains GUE-conditional per imp-486; changes no bound; Platt-Trudgian Lambda<=0.2 remains the SOTA unconditional bound; no QED.",
  },
];

export default function ConceptsPage() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = CONCEPTS.filter(c => {
    if (selectedCat !== 'all' && c.category !== selectedCat) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.term.toLowerCase().includes(q) || c.definition.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="page">
      <PageHeader title="Key Concepts & Definitions">
        <p>
          A reference guide to the mathematical ideas behind the Riemann Hypothesis and the
          Twin-Ladder Bridge model. Start with Foundations and work your way through.
        </p>
      </PageHeader>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search concepts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 6, border: '1px solid #334155',
            background: '#0f172a', color: '#e2e8f0', fontSize: 14, width: 220,
            outline: 'none',
          }}
        />
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          <button
            className={`filter-btn ${selectedCat === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCat('all')}
            aria-pressed={selectedCat === 'all'}
          >
            All ({CONCEPTS.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = CONCEPTS.filter(c => c.category === cat.id).length;
            return (
              <button
                key={cat.id}
                className={`filter-btn ${selectedCat === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCat(cat.id)}
                aria-pressed={selectedCat === cat.id}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Quick Notation Reference ─── */}
      <div className="card" style={{ marginBottom: 20, borderLeft: '3px solid #06b6d4' }}>
        <h3 style={{ color: '#06b6d4', fontSize: 14, marginBottom: 12 }}>Quick Notation Reference</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, fontSize: 12 }}>
          {[
            { sym: 's = \\sigma + it', meaning: 'Complex variable (real part σ, imaginary part t)' },
            { sym: '\\zeta(s)', meaning: 'Riemann zeta function' },
            { sym: '\\rho = \\tfrac{1}{2} + i\\gamma', meaning: 'Nontrivial zero (RH form)' },
            { sym: '\\chi(s)', meaning: 'Functional equation bridge factor' },
            { sym: '\\xi(s)', meaning: 'Completed zeta function (entire, symmetric)' },
            { sym: 'H_p(s) = (1-p^{-s})^{-1}', meaning: 'Euler factor / oscillator stage for prime p' },
            { sym: 'Q = 1/(2\\sigma)', meaning: 'Quality factor (Q = 1 at critical line)' },
            { sym: 'Z_0 = \\log p', meaning: 'Characteristic impedance of p-stage' },
            { sym: '\\Lambda(n)', meaning: 'Von Mangoldt function (log p if n = p^k)' },
            { sym: '\\psi(x)', meaning: 'Chebyshev function (weighted prime count)' },
            { sym: 'S^\\dagger S = I', meaning: 'Scattering matrix unitarity (lossless)' },
            { sym: '\\lambda_n', meaning: 'Li coefficients (RH ⟺ all ≥ 0)' },
          ].map(({ sym, meaning }, i) => (
            <div key={i} style={{ padding: '6px 8px', background: 'rgba(6,182,212,0.04)', borderRadius: 4, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ flexShrink: 0 }}><InlineMath tex={sym} /></span>
              <span style={{ color: '#94a3b8', fontSize: 11 }}>{meaning}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {filtered.map(concept => {
          const cat = CATEGORIES.find(c => c.id === concept.category);
          return (
            <div key={concept.id} className="card" style={{ borderColor: cat?.color + '30' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span className="tag" style={{
                  background: cat?.color + '15', color: cat?.color,
                  border: `1px solid ${cat?.color}30`, fontSize: 11,
                }}>
                  {cat?.label}
                </span>
                <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: 17 }}>{concept.term}</h3>
                {concept.symbol && (
                  <span style={{ marginLeft: 'auto' }}>
                    <InlineMath tex={concept.symbol} />
                  </span>
                )}
              </div>
              <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>
                {concept.definition}
              </p>
              {concept.formula && (
                <div style={{ margin: '8px 0' }}>
                  <BlockMath tex={concept.formula} />
                </div>
              )}
              {concept.intuition && (
                <div style={{
                  padding: '8px 12px', background: 'rgba(6,182,212,0.05)',
                  borderLeft: '2px solid #06b6d4', borderRadius: '0 6px 6px 0',
                  fontSize: 13, color: '#67e8f9', lineHeight: 1.6, marginTop: 8,
                }}>
                  <strong style={{ color: '#22d3ee' }}>Intuition:</strong> {concept.intuition}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Deep Dive: Connes' Noncommutative Geometry ─── */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid #f43f5e' }}>
        <h3 style={{ color: '#f43f5e', fontSize: 18, marginBottom: 16 }}>
          Deep Dive: Connes' Noncommutative Geometry Approach to RH
        </h3>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
          Alain Connes' approach is the most developed spectral framework for the Riemann Hypothesis.
          It provides the theoretical foundation for our ZPO operator construction (S5).
        </p>

        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.15)' }}>
            <h4 style={{ color: '#fb7185', fontSize: 14, marginBottom: 8 }}>1. The Adele Class Space</h4>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
              The starting point is the <strong>adele ring</strong> <InlineMath tex="\mathbb{A}_\mathbb{Q} = \mathbb{R} \times \prod'_p \mathbb{Q}_p" />,
              which packages all completions of ℚ (real and p-adic) into one object. The quotient{' '}
              <InlineMath tex="\mathbb{A}_\mathbb{Q} / \mathbb{Q}^*" /> is the <strong>adele class space</strong>.
              Connes showed that <InlineMath tex="L^2(\mathbb{A}_\mathbb{Q}/\mathbb{Q}^*)" /> carries a natural
              representation of the idele class group, and the spectral decomposition of this representation
              encodes the nontrivial zeros of ζ(s).
            </p>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <h4 style={{ color: '#60a5fa', fontSize: 14, marginBottom: 8 }}>2. The Weil Proof for Function Fields</h4>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
              For function fields over finite fields <InlineMath tex="\mathbb{F}_q" />, RH was proved by Weil (1948)
              using the <strong>Frobenius endomorphism</strong> acting on étale cohomology. The eigenvalues of Frobenius
              have absolute value <InlineMath tex="q^{1/2}" /> — this IS the Riemann Hypothesis in that setting.
              Connes' program aims to find the analogue of Frobenius for <InlineMath tex="\mathbb{Q}" />.
            </p>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <h4 style={{ color: '#6ee7b7', fontSize: 14, marginBottom: 8 }}>3. The Spectral Realization</h4>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
              On <InlineMath tex="L^2(\mathbb{A}_\mathbb{Q}/\mathbb{Q}^*)" />, the scaling action{' '}
              <InlineMath tex="f(x) \mapsto f(\lambda x)" /> generates a one-parameter group whose infinitesimal
              generator <InlineMath tex="\Theta" /> has spectrum related to the zeros of ζ(s). Connes proved that the
              "absorption spectrum" (where the representation fails to be unitary) coincides with{' '}
              <InlineMath tex="\{\gamma_n : \zeta(\tfrac{1}{2}+i\gamma_n)=0\}" />.
            </p>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <h4 style={{ color: '#fbbf24', fontSize: 14, marginBottom: 8 }}>4. Connection to ZPO</h4>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
              Our ZPO coupling matrix <InlineMath tex="M_{jk} = \gamma_j\delta_{jk} + \sum_p \frac{\log p}{p}\cos((\gamma_j-\gamma_k)\log p)" /> is
              a <strong>finite-dimensional approximation</strong> to Connes' operator Θ. The diagonal terms are
              the zeros themselves; the off-diagonal coupling via primes mirrors the action of Frobenius
              on cohomology. As the matrix size grows, the eigenvalues converge to the actual zeros —
              this is precisely the Deninger determinant convergence we demonstrated.
            </p>
            <BlockMath tex="\text{ZPO: } \det(sI - M_N) \;\xrightarrow{N\to\infty}\; \xi(s) = \det_\infty(s - \Theta)" />
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <h4 style={{ color: '#a78bfa', fontSize: 14, marginBottom: 8 }}>5. The 2026 Breakthrough</h4>
            <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.8 }}>
              Connes (2026) showed that extremizing the <strong>Weil quadratic form</strong> — using only
              data from primes {"<"} 13 — approximates the first 50 zeta zeros with accuracy up to{' '}
              <InlineMath tex="10^{-55}" />. The approximating values provably lie exactly on{' '}
              <InlineMath tex="\sigma = \tfrac{1}{2}" />. This demonstrates that an extraordinarily small
              amount of prime data encodes the zero locations with extreme precision — exactly what the
              Twin-Ladder Bridge framework predicts.
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, background: 'rgba(6,182,212,0.04)' }}>
        <h3 style={{ color: '#64748b', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/literature" style={{ color: '#06b6d4', fontSize: 13 }}>Literature</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/paper" style={{ color: '#06b6d4', fontSize: 13 }}>Paper</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/history" style={{ color: '#06b6d4', fontSize: 13 }}>History</Link>
          <span style={{ color: '#334155' }}>|</span>
          <Link to="/docs" style={{ color: '#06b6d4', fontSize: 13 }}>Documentation</Link>
        </div>
      </div>
    </div>
  );
}
