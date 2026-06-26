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
    intuition: 'In the ZPO model, each factor is one oscillator stage. The product is the cascade transfer function.',
  },
  {
    id: 'functional-equation',
    category: 'zeta',
    term: 'Functional Equation',
    definition: 'The symmetry xi(s) = xi(1-s) relating zeta at s to zeta at 1-s. This is the deepest structural property of the zeta function.',
    formula: '\\xi(s) = \\tfrac{1}{2}s(s-1)\\pi^{-s/2}\\Gamma(s/2)\\zeta(s) = \\xi(1-s)',
    intuition: 'A mirror symmetry about the line sigma = 1/2. In the ZPO model, it is the lossless bridge coupling direct and dual ladders.',
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
    intuition: 'The atoms of arithmetic. In the ZPO model, each prime is one oscillator in the chain.',
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
    definition: 'The contribution of a single prime p to the Euler product. In the ZPO model, this is the transfer function of one LC resonator.',
    formula: 'H_p(s) = \\frac{1}{1 - p^{-s}}, \\quad L_p = \\log p, \\quad C_p = \\frac{1}{\\log p}',
    intuition: 'One oscillator in the chain — it resonates at universal frequency omega_0 = 1 with impedance Z_0 = log(p).',
  },
  {
    id: 'quality-factor',
    category: 'physics',
    term: 'Quality Factor',
    symbol: 'Q',
    definition: 'Measures how underdamped an oscillator is. Higher Q means sharper resonance. In the ZPO model, Q = 1/(2 sigma) is universal for all primes.',
    formula: 'Q = \\frac{1}{2\\sigma}, \\quad Q = 1 \\text{ at } \\sigma = \\tfrac{1}{2} \\text{ (critical damping)}',
    intuition: 'At sigma = 1/2, every prime oscillator is critically damped — not too sharp, not too broad.',
  },
  {
    id: 'impedance',
    category: 'physics',
    term: 'Impedance',
    symbol: 'Z',
    definition: 'Opposition to signal flow, generalizing resistance to include frequency-dependent (reactive) effects. In the ZPO model, characteristic impedance Z_0(p) = log(p).',
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
    intuition: 'Zeta zeros as energy levels of a quantum system. In the ZPO model, the Hamiltonian H is a candidate for this operator.',
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
    definition: 'In quantum scattering, a resonance is a complex energy where the S-matrix has a pole. The ZPO model maps zeta zeros to transmission nulls of the oscillator cascade — frequencies where the cascade output vanishes via total destructive interference.',
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
    intuition: 'The zeta function IS a partition function. The pole at s = 1 is a genuine phase transition. The ZPO model makes this physical: σ controls "temperature" of the oscillator chain.',
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
    definition: 'A graphical test for feedback system stability: plot the loop gain L(jω) as ω sweeps from -∞ to +∞. The number of encirclements of the critical point -1 equals the number of unstable closed-loop poles. In the ZPO model, zeta zeros correspond to frequencies where the Nyquist plot crosses the unit circle.',
    formula: 'N = Z - P, \\quad Z = \\text{closed-loop poles}, \\; P = \\text{open-loop poles}, \\; N = \\text{encirclements of } -1',
    intuition: 'Draw a circle around -1 and count how many times the frequency response curve wraps around it. Each wrap means an unstable mode.',
  },
  {
    id: 'bode-plot',
    category: 'physics',
    term: 'Bode Diagram',
    definition: 'A pair of plots showing magnitude (dB) and phase (degrees) of a transfer function versus log-frequency. In the ZPO model, the Bode plot of the cascade reveals the spectral signature of each prime oscillator as a resonance peak at ω = log(p).',
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
          Zeta Prime Oscillator model. Start with Foundations and work your way through.
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
              ZPO framework predicts.
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
