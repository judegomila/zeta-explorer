import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { InlineMath, BlockMath } from '../components/KaTeXMath.jsx';
import { EditorialHeader } from '../components/editorial/PostLayout.jsx';
import AnimationEmbed from '../components/AnimationEmbed.jsx';

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
    definition: 'In the Twin-Ladder Bridge thermodynamic interpretation, F = -(1/σ)·ln ζ(σ+it). At σ = ½, the free energy is at a critical point. The free energy landscape determines equilibrium states.',
    formula: 'F(\\sigma, t) = -\\frac{1}{\\sigma} \\ln|\\zeta(\\sigma + it)| + V_{\\text{bridge}}(\\sigma)',
    intuition: 'Zeros of ζ correspond to F → -∞ (divergent free energy) — thermodynamic "singularities" where the system undergoes qualitative change.',
  },
  {
    id: 'partition-function',
    category: 'thermo',
    term: 'Partition Function',
    symbol: 'Z(\\beta)',
    definition: 'The central object of statistical mechanics: sum of Boltzmann weights over all states. For the Twin-Ladder Bridge system, Z(β) = ζ(β) with β = σ as inverse temperature.',
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
    definition: 'A point in Penrose twistor space. In the Twin-Ladder Bridge mapping, s = σ + it maps to a 4-component twistor with ω encoding displacement from the critical line and π encoding prime-phase oscillation.',
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
    definition: 'The condition Z·W = 0 (twistor is "incident" on dual twistor). In the Twin-Ladder Bridge mapping, this reduces to 2(σ-½)cos(t log 2) = 0, satisfied iff σ = ½ (away from special t-values).',
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
    intuition: 'If the zeros are eigenvalues of a "nice" (self-adjoint) operator, they MUST be real — and that IS the Riemann Hypothesis. The Twin-Ladder Bridge gap S5 is exactly this.',
  },
  {
    id: 'darlington-synthesis',
    category: 'proof',
    term: 'Darlington Synthesis',
    definition: 'A classical synthesis theorem for positive-real rational impedances. Boundary losslessness and reciprocity alone do not force every transmission zero onto the imaginary axis; additional realization and minimum-phase hypotheses matter. It does not directly prove RH for the displayed cascade: S₂₁(s) = ζ(2s)/ζ(s) has generic zeta zeros as poles.',
    formula: 'S^\\dagger(i\\omega)S(i\\omega)=I\\quad\\not\\Longrightarrow\\quad \\text{all zeros of }S_{21}\\text{ lie on }i\\mathbb R',
    intuition: 'The all-pass example h(s)=(s-a)/(s+a) is boundary-unitary but has a right-half-plane zero. A valid RH route needs both a justified realization and a separate pole/divisor confinement theorem.',
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
    intuition: 'The "spectral = geometric" duality: eigenvalues encode geodesic lengths. The Twin-Ladder Bridge twin ladder is a discrete version: "zeros encode prime frequencies."',
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
    intuition: 'Random unitary matrices — like spinning a wheel of phases. The Twin-Ladder Bridge bridge at σ=½ is a "random phase multiplier" consistent with CUE statistics.',
  },
  {
    id: 'wigner-surmise',
    category: 'rmt',
    term: 'Wigner Surmise',
    definition: 'A simple approximation to the nearest-neighbor spacing law for GUE random matrices. Computed zeta-zero spacings show GUE-like repulsion, but full GUE universality is conjectural and the exact limiting GUE spacing law is the Gaudin distribution, not the Wigner surmise.',
    formula: 'p(s) = \\frac{32}{\\pi^2} s^2 e^{-4s^2/\\pi}, \\quad s = \\text{normalized spacing}',
    intuition: 'Finite computations strongly resemble random-matrix level repulsion; they are evidence, not a proof of RH or an exact Wigner-surmise law.',
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
    intuition: 'A staircase that jumps by log(p) at each prime p and prime power. The Twin-Ladder Bridge explicit formula decomposes this staircase into oscillating modes — one per zeta zero.',
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
    intuition: 'Standing waves on a drum: only certain frequencies fit exactly. Similarly, the Twin-Ladder Bridge "drum" (the prime oscillator chain) only resonates at frequencies corresponding to zeta zeros.',
  },
  {
    id: 'borwein-acceleration',
    category: 'analysis',
    term: 'Borwein Acceleration',
    definition: 'A method for accelerating the convergence of the alternating eta series from O(N^{-σ}) to O(3^{-N}). Uses Chebyshev coefficients to reweight partial sums, achieving exponential convergence.',
    formula: '\\zeta(s) \\approx \\frac{-1}{d_N(1-2^{1-s})} \\sum_{k=0}^{N} \\frac{(-1)^k(d_k - d_N)}{(k+1)^s}, \\quad \\text{error} = O(3^{-N})',
    intuition: 'A mathematical "turbo boost" for computing ζ(s) — by cleverly reweighting terms, exponentially faster convergence than exhaustive summation.',
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
    definition: 'The Hilbert-Polya dream made precise: there exists a self-adjoint operator on a Hilbert space whose eigenvalues are the nontrivial zeros of ζ(s). Connes\' approach constructs this space as L²(A_Q/Q*) and the operator as the infinitesimal generator of scaling (the "absorption spectrum" of the adele class space). The Twin-Ladder Bridge coupling matrix M_jk is a finite-dimensional approximation to this operator.',
    formula: 'M_{jk} = \\gamma_j \\delta_{jk} + \\sum_p \\frac{\\log p}{p} \\cos((\\gamma_j - \\gamma_k)\\log p)',
    intuition: 'The Twin-Ladder Bridge matrix uses prime-indexed coupling to approximate the infinite-dimensional Connes operator. As the matrix grows, its eigenvalues converge to the actual zeta zeros.',
  },

  // ── New Proof-Status Concepts ──
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
    intuition: "Different faces of the same crystal. Each RH-equivalent statement is a new approach map. The Twin-Ladder Bridge program contributes several new equivalences through the oscillator-chain collapse theorems.",
  },
  {
    id: 'pcc-free',
    category: 'proof',
    term: 'PCC-Free Route',
    definition: "A proof strategy is PCC-free if it avoids assuming the Montgomery Pair-Correlation Conjecture (PCC). Of the 13 primary Twin-Ladder Bridge paper conjectures, 5 are SUBSUMED-BY-RH through a shared Montgomery PCC obstruction across all live ESY-closure routes — meaning any route through these conjectures implicitly depends on PCC. A PCC-free route navigates around this obstruction without invoking pair-correlation statistics. See /route-map and /pcc-route-exhaustion.",
    formula: '\\text{PCC: } \\int_\\alpha^\\beta \\!\\left(1 - \\tfrac{\\sin^2(\\pi u)}{(\\pi u)^2}\\right)du \\;\\Longleftrightarrow\\; \\text{GUE statistics for zeros}',
    intuition: "PCC-free does NOT mean RH-free: the Riemann Hypothesis is still the target. It only means the proof route does not secretly lean on unproven pair-correlation statistics. Five Twin-Ladder Bridge routes share a single PCC wall — a PCC-free route must find a path that avoids this shared obstruction entirely.",
  },
  {
    id: 'ch-wall',
    category: 'proof',
    term: 'C_H Wall (Gronwall Obstruction)',
    symbol: 'C_H',
    definition: "The Gronwall amplification constant C_H = C_shock * C_Lip / 4 in the backward heat-flow collision analysis. C_H exists (the flow is bounded), but the Gronwall backward-flow integral diverges at the eigenvalue collision time t_c, so no unconditional numerical certification of C_H is available on this route: the discharge is closed, not pending. imp-2640 confirmed the Gronwall discharge fails; imp-2642 showed the 1/8 gap-to-time coefficient is leading-order only; imp-2632 showed the OLS-fitted t_c is not rigorous. C_H blocks the collision/backward-flow discharge specifically — it does not block E_flow, which is the benign mesoscopic-Gronwall term with an unconditional bound (imp-2845). The C_Lip field-channel reroute (imp-3933) bypasses this wall in the vector-field-error channel rather than discharging it. See /state-of-program.",
    formula: 'C_H = \\frac{C_{\\mathrm{shock}} \\cdot C_{\\mathrm{Lip}}}{4}',
    intuition: "A speed limit that exists but whose exact value the Gronwall route cannot certify — the divergent collision integral closes that route rather than leaving it pending. Until some other channel certifies the collision-side constant, every beat estimate that leans on it is a ceiling only.",
  },
  {
    id: 'honest-ceiling',
    category: 'proof',
    term: 'Ceiling',
    definition: "Project-standard label for a constant or estimate that is numerically consistent with being an upper bound across all tested N, but is NOT a rigorous unconditional upper bound. Ceiling results are reported with explicit disclaimers. The canonical example is the finite-N* beat: empirically below threshold but blocked by C_H. See /state-of-program.",
    intuition: "A ceiling you can measure but not yet prove. The value never exceeds the threshold in experiments, but an undischarged constant (like C_H) means the ceiling could in principle be higher. A ceiling is the opposite of a certified interval-arithmetic bound.",
  },
  {
    id: 'overclaim-ledger',
    category: 'proof',
    term: 'Correction Log',
    definition: "Internal correction log — during development some internal drafts overreached the evidence and were brought back in line; the record is kept in src/data/overclaim-ledger.js. The technically substantive corrections are reflected directly in the current status pages (the thin-strip beat is a dead artifact, imp-2630; the Volterra collapse is a reformulation, not a reduction).",
  },
  {
    id: 'finite-n-beat',
    category: 'proof',
    term: "Finite-N* Beat (Estimate)",
    symbol: 'E_{\\text{coll}}(N^*) < 0.2',
    definition: "The observation that at N*=1e4 the computed eigenvalue-collision energy E_coll falls below the Lambda <= 0 threshold (~0.2). This is a numerical estimate, not a rigorous unconditional result. The beat is rigorous-modulo-C_H: if the undischarged constant C_H were certified from above, the estimate would become unconditional. Until C_H is certified, the N* beat is a ceiling result, never a QED finite-N beat. The claim of a rigorously-pinned E_coll (imp-2633) was corrected internally. See /state-of-program.",
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
    definition: "imp-34270 makes the E_flow attribution above explicit at the halving landmark (thr = 1/2): dividing the crossover balance (E_flow dropped) by the halving balance (E_flow restored) gives relOffset = 1 - [L(N_half)/L(N_cross)]/(1+r)^2, which expands to relOffset ~ 2r + deltaL. The doubling (2r, not r) comes from E_coll ~ N^{-1/2}: a fractional bump to the collision target produces a DOUBLED fractional shift in the crossover N. Plugging in the measured r = E_flow/E_trunc ~ 1.91e-3, the leading term 2r = 3.811454e-3 alone accounts for 95.74% of the full measured offset (3.981092e-3); the remaining ~4.3% is deltaL, the log T0 drift between the two landmarks -- and the exact division form reproduces the measured offset to <1e-6 relative, an identity of the two defining equations rather than a fit. imp-34348 then asks whether that 95.7% split is a fragile artifact of one hard-coded constant: E_flow carries a Gronwall trapezoid factor GRONWALL = exp(TC_A1_TRAP) with TC_A1_TRAP = 2.37e-4 (the imp-2762-certified A1-trap upper bound). Sweeping TC_A1_TRAP across its ENTIRE uncertainty band [0, 4.74e-4] -- from no amplification at all to double the certified worst case -- moves the leading-2r share only from 95.73884% to 95.73897%, a swing of about 1.3 parts per million.",
    formula: '\\text{leading: } 2r = 3.811454\\times 10^{-3}\\ (95.74\\%) \\quad \\delta L = 1.811946\\times 10^{-4}\\ (4.26\\%) \\quad \\Delta(\\text{share}) \\approx 1.34\\times 10^{-6}\\ \\text{across the full } t_c \\text{ band}',
    intuition: "Two separate questions, two separate modules. First: does the ~0.4% gap between the closed-form crossover and the halving landmark actually decompose the way imp-33723 guessed? imp-34270 forms the explicit two-term split and checks it lands -- 95.7% leading Gronwall term, 4.3% log-T0 drift, no free parameter, reproduced to machine precision. Second, and more important for trusting the number: does that 95.7%/4.3% split depend sensitively on the one hard-coded constant feeding E_flow? If the A1-trap constant TC_A1_TRAP were miscalibrated, would the headline 95.7% figure swing wildly? imp-34348 answers no -- walking the constant across its ENTIRE certified uncertainty band (from zero amplification up to double the certified ceiling) moves the leading share by under two parts per million, six-figure invariance. The reason is structural, not coincidental: E_flow enters both numerator and denominator of the share (2r / (2r + deltaL)) roughly linearly, so its overall size mostly cancels out of the ratio -- only the SPLIT depends on the constant, and that split is protected by the fact that GRONWALL never strays far from 1. Together the two results say: the 95.7% attribution is a real, formed identity (not just a named guess), and it is not a quantity anyone could shift by tweaking an uncertain input constant.",
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
    intuition: "The whole cohort is one cautionary tale about fitting exponents on finite data, told in five acts. Act one (imp-34329): a numerically fit exponent looked like it was settling near a plausible-but-wrong ~2.88 -- until pushing the fit ten more orders of magnitude into the tail revealed it had only paused at a shallow minimum before turning back up. Act two (imp-34407): rather than trust yet another finite-precision fit for the correction constant, derive it -- the self-consistent crossover forces log T0 to grow like -2 log thr, and that single fact alone pins the correction coefficient at exactly 4, a clean small integer, not the messier 4.4 the secants suggested. Act three (imp-34412): push deeper still (three more decade-pairs, thr=1e-18) and check the climb doesn't stall -- it doesn't, and the secant correction visibly descends toward the derived 4. Act four (imp-34414): stop extrapolating altogether and just expand the known closed form directly -- the leading behaviour surplus ~ A_r(log T0)^2 thr^3 drops straight out, with no fitting involved, corroborating every earlier reading. Act five (imp-34428): finally explain why the coarse secants still read high (~4.46) even though the true instantaneous constant is 4 -- a genuine next-order 1/log^2 T0 term accounts for part of the gap, and the rest is an ordinary finite-difference window artifact, not a new physical effect. None of this touches any RH bound: the underlying component model is the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; E_flow remains the benign mesoscopic-Gronwall term (imp-2845) untouched from the divergent C_Lip collision-Gronwall; C_mb stays GUE-conditional per imp-486; no QED.",
  },
  {
    id: 'fixed-band-peak-log-family-divergence',
    category: 'proof',
    term: 'Fixed-Band Peak Third-Difference: Slow Logarithmic-Family Divergence',
    symbol: '\\text{third\\_diff}(x) \\sim K x^{-p(x)},\\; p(x) \\downarrow \\;(x = k^*-k_{\\text{end}} \\to 0)',
    definition: "The fixed-band (k<=10) peak's third differences grow steadily as kEnd approaches the surrogate resid_exp zero k*~21.28095 (imp-34268 F3), reaching +0.057428 at the last computable rung kEnd=21.25. imp-34253 already read the peak itself as diverging LOGARITHMICALLY (peak ~ A - B ln x, weak coefficient B~0.085), rather than a genuine pole. imp-34346 confirms this at the level of the third differences: a log-log power-law fit of third_diff against the pole gap x=k*-kEnd gives an effective order p~0.937 over the pole-dominated tail, but the LOCAL order measured from just the last pair of nodes drops further to ~0.671 -- the effective order keeps DECREASING as x shrinks. A true integer-order pole would hold its order steady or rising; only a sub-power, logarithmic-family divergence produces an order that keeps falling toward the pole.",
    formula: 'p_{\\text{tail}} \\approx 0.937 \\;(R^2\\approx 0.95) \\;\\to\\; p_{\\text{local}} \\approx 0.671 \\;\\text{(decreasing as } x\\to 0\\text{)}',
    intuition: "A simple pole like 1/x has a constant order 1 no matter how closely you zoom in -- the exponent in a log-log plot stays flat. A logarithm like -ln(x) is sneakier: differenced discretely, it still LOOKS like a power law locally, but the effective exponent you read off keeps sliding down the closer you get to zero, because ln(x) grows far slower than any x^(-p) with p>0. That is exactly the signature imp-34346 finds -- the fitted order drops from ~0.937 on the wider tail to ~0.671 on the last pair of nodes, consistent with imp-34253's independent reading that the underlying peak itself is a weak logarithmic divergence (B~0.085), not a genuine pole. The caveat: with a fixed step h=0.25 much larger than the remaining gap x~0.031 at kEnd=21.25, the discrete third difference smears the singularity across a wide stencil, so this is an EFFECTIVE order from finite differences, not a rigorous continuous exponent -- the finer sub-pole windows needed to sharpen it are themselves undefined (resid_exp loses digits past kEnd>=21.5, per imp-34253/imp-34346's shared SUB-GAP-imp-34346-continuous-order-blocked). None of this changes any RH bound: the pole itself is a surrogate-model artifact of the inherited imp-3220/imp-3406 extrapolation, not a physical singularity; C_mb remains GUE-conditional per imp-486,., and there is no QED.",
  },
  {
    id: 'coefficient-vs-exponent-residue-reconciliation',
    category: 'proof',
    term: 'Two Residues, One Pole: Coefficient vs. Exponent',
    symbol: 'g(k) = R\\,(k-k^*)^{p},\\quad R = \\tfrac{E_\\star}{m},\\; p = -1',
    definition: "The eflow_over_resid ratio has a simple pole at k* ~ 21.28095, and two earlier modules each report a \"residue\" there that looks wildly different: imp-34310 reads R ~ -1.979e-8 (a raw-ratio measurement), while imp-34247 reads exactly +1 (a log-derivative measurement). imp-34398 shows these are not competing estimates of the same number -- they are two DIFFERENT features of the same leading term g(k) = R (k-k*)^{-1}. R (the imp-34310 number) is the COEFFICIENT: it carries the physical amplitude (E_star, the value of eflow_attr at the pole) divided by the local slope m of the vanishing denominator, so it has units and a sign. The +1 (the imp-34247 number) is the EXPONENT: taking a log first (ln g = ln|R| + p ln(k-k*)) and then differentiating makes the coefficient R cancel out entirely, leaving only the bare pole order p=-1 (reported as +1 in imp-34247's k*-k convention).",
    formula: '\\ln g = \\ln|R| + p\\ln(k-k^*) \\;\\Rightarrow\\; \\frac{d}{dk}\\ln g = \\frac{p}{k-k^*} \\;(R\\text{ cancels})',
    intuition: "Think of a coin: R is the coin's face value (it matters whether it is a penny or a dollar), while the pole order +1 is just \"this is a coin\" -- a count, not an amount. imp-34310 weighed the coin (amplitude, ~8 orders of magnitude below 1, and negative because E_star>0 while the slope m<0). imp-34247 only asked \"is this a simple pole or a double pole\", and taking a logarithmic derivative is precisely the trick that erases the coin's value and leaves only its type: rescaling R by 5e7 in imp-34398's stress test left the log-derivative reading unchanged to under 1e-6. So the ~8-order-of-magnitude gap and the sign flip between the two published residues are not a bug or a discrepancy to resolve -- they are the expected difference between measuring an amplitude and measuring an order of the SAME monomial, bridged by one shared quantity (the resid_exp local slope m). Measurement/derivation only; the underlying component model is the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; C_mb remains GUE-conditional per imp-486; no QED.",
  },
  {
    id: 'resid-exp-pole-recovery-cohort-narrative',
    category: 'proof',
    term: 'resid_exp Pole-Recovery Cohort: Four Modules, One k*~21.28095',
    symbol: 'k^\\ast \\approx 21.28095,\\quad \\text{resid\\_exp}(k^\\ast) = 0,\\; \\text{eflow\\_attr}(k^\\ast) \\neq 0',
    definition: "Four modules probe the same surrogate simple pole (eflow_over_resid = eflow_attr/resid_exp at k*~21.28095) from four different angles and are easy to mistake for competing readings; they are actually complementary. (1) imp-34405 quantifies HOW CLOSE any numerical approach to k* can get before losing significant digits: the pole-location floor (set by k* being reported to only ~7 sig figs) gives a resolvable significant-digit count that falls from ~4.75 at k=21.00 to ~3.79 at k=21.25, roughly 27x looser than the deeper 7-sig-fig storage/cancellation floor. (2) imp-34406 checks the premise that makes this a GENUINE pole rather than a removable 0/0: it recovers the numerator eflow_attr directly on six rungs bracketing k* and finds it strictly positive (+4.5197e-15 at k*), monotone and smooth -- so the singularity is a true simple pole, confirmed independently of the imp-34405 digit-loss floor. (3) imp-34548 looks at a companion pole-leakage spacing metric and measures its LOCAL exponent between adjacent rungs, finding it FALLS (3.527 -> 2.928 -> 2.578) as the pole is approached rather than rising toward the k* the global cubic fit predicts -- explaining, directionally, why an earlier forward-integration extrapolation undershoots near-pole crossings. (4) imp-34550 pushes a naive 1/leak-root pole estimator two rungs tighter and finds its clean ~1/3-per-rung geometric convergence rate does NOT persist (new ratios ~0.476/0.377, up from ~0.341) -- but rules out the double-precision noise floor as the cause (residuals still ~1e3-1e4x above it), pinning the slowdown on the estimator's own higher-order bias instead.",
    formula: '\\text{sig}(d) = \\log_{10}\\!\\frac{d}{5\\times10^{-6}} \\;\\; (34405), \\quad \\text{eflow\\_attr}(k^\\ast) = +4.52\\times10^{-15} \\;\\; (34406), \\quad p_{\\text{local}} \\downarrow \\;\\; (34548), \\quad \\text{ratio}_{\\text{shrink}} \\uparrow 0.341 \\to 0.424 \\;\\; (34550)',
    intuition: "Read in isolation, these four modules look like they are reporting on unrelated aspects of the pole -- a digit-loss bound, a positivity check, a falling exponent, a stalling convergence rate. Read as one cohort, they form a single picture of what it takes to trust a numerical claim about a singularity you cannot evaluate AT: imp-34405 first asks 'how close can I even get?' and finds the limiting factor is not raw precision but how many digits the pole location itself is reported to. imp-34406 then closes off the one loophole that would make the whole exercise moot -- if the numerator vanished too, there would be no pole to resolve at all, so it directly recovers the numerator on both sides and confirms it stays cleanly nonzero. imp-34548 and imp-34550 both then stress-test DIFFERENT recovery/extrapolation strategies (a spacing-exponent fit and a pole-location estimator) and both find the same qualitative lesson: near-pole behavior does not simply extrapolate from mid-range fits -- the local exponent bends the wrong way, and the convergence rate decelerates -- but in both cases the cause is diagnosed and is NOT a floating-point precision wall (there is still 3-4 decades of margin below the true double-precision floor). None of this touches any RH bound: the pole is a surrogate-model artifact of the inherited imp-3220/imp-3406 extrapolation, not a physical singularity; C_mb remains GUE-conditional per imp-486; imp-3066 K_a>=0 is untouched; no QED.",
  },
  {
    id: 'sigma-vs-product-gap-log2pi-shift',
    category: 'proof',
    term: 'Sigma Channel vs. Product Channel: the log(2pi) Shift',
    symbol: '1 - \\frac{\\text{gapSigma}}{\\text{gapProduct}} = \\frac{1+\\log 2\\pi}{\\log T_0}',
    definition: "Two different modules each measure a small \"approach gap\" to the value 1/2, built from the exact same underlying finite-N residual, but they do NOT agree with each other -- and imp-34328/imp-34415 explain why. Write u = log(T0/2pi) and log T0 = u + log(2pi). The PRODUCT channel (imp-34197) multiplies the shared residual by log T0, and the log(2pi) piece cancels exactly, leaving a clean gapProduct = 1/(2u). The SIGMA channel (imp-33816) is the bare sigma-exponent shortfall 1/2 - p(N); it never gets multiplied by log T0, so it keeps the log(2pi) offset and its leading term is gapSigma ~ 1/(2 log T0) instead. The two gaps are not competing measurements of one law -- they are the same residual read on two different axes (u for the product, log T0 for the sigma exponent), and the axes differ by the constant log(2pi) = 1.83788.",
    formula: '\\text{gapSigma}\\cdot\\log T_0 + \\text{gapProduct} = \\tfrac12 \\ \\text{(exact complement)}, \\qquad \\text{gapProduct}=\\frac{1}{2u},\\ \\ \\text{gapSigma}\\sim\\frac{1}{2\\log T_0}',
    intuition: "Picture two rulers marking off the same physical gap, but one ruler is calibrated in inches and the other in centimeters offset by a fixed conversion constant -- they will never read the identical number, yet both are correctly measuring the same thing. Here the \"conversion constant\" is log(2pi): the product channel's multiplication by log T0 happens to cancel it exactly, while the sigma channel's raw reading keeps it. That is why gapSigma * log T0 + gapProduct = 1/2 EXACTLY at every rung (imp-34328 F2) even though gapSigma and gapProduct themselves never match. Because the mismatch is a genuine log(2pi)/log T0 term rather than noise, it fades only LOGARITHMICALLY: imp-34415 shows the ratio gapSigma/gapProduct first climbs above 0.99 only once log10 N passes roughly 124.9 -- an astronomically deep height, illustrating how slowly a log(2pi)-sized additive shift washes out of a ratio that itself decays like 1/log T0. Diagnostic exposition only; conditional-share cross-check, not an RH bound; the component model is the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; C_mb remains GUE-conditional per imp-486; no QED.",
  },
  {
    id: 'coupling-ratio-205-vs-2-reconciliation',
    category: 'proof',
    term: 'Coupling Ratio ~2.05 vs. Limit 2: Two Readings of One Slowly-Decaying Excess',
    symbol: '\\text{coupling}(N_{\\text{cross}}) = 2 + \\frac{2}{\\log T_0} + O\\!\\left(\\frac{1}{\\log^2 T_0}\\right)',
    definition: "imp-34447 read the coupling-ratio residual/(E_flow/E_trunc) turn-over across four closed-form crossover landmarks (2.089015, 2.078776, 2.066432, 2.057639) and concluded qualitatively that it 'converges to a finite limit ~2.05' -- the value at the then-deepest thr=0.001 landmark. imp-34487 added a fifth, ultra-deep thr=0.0001 landmark (2.050855) and, rather than reading off the latest number, fit the excess-above-2 sequence directly against x=1/log T0: as shallower landmarks are dropped from the fit the intercept collapses toward zero and the slope toward 2, pinning the finite limit at the LEADING value 2 (approached from above as ~2/log T0), not ~2.05. The two readings are not in conflict -- '~2.05' was never claimed as the asymptote, only the value reachable at that landmark's depth, and the ratio never once crosses below 2 in either module.", formula: '\\text{excess}(N_{\\text{cross}}) \\equiv \\text{coupling}-2 = \\frac{2}{\\log T_0} + O\\!\\left(\\frac{1}{\\log^2 T_0}\\right) \\;\\xrightarrow{\\log T_0 \\to \\infty}\\; 0^{+}',
    intuition: "Think of watching a ball roll down a very long, very gently sloped hill toward a wall at height 2: at any finite point in the video you can quote the ball's current height (2.09, then 2.08, then 2.07, ..., then 2.05) and each is a perfectly reading -- but none of those readings IS the wall. imp-34447 only had four frames of the video and reported the last one it could see, correctly flagging that the drift was decaying rather than constant-rate. imp-34487 added a fifth, much deeper frame and then did something different: instead of reporting a number, it fit the whole trajectory to 1/log T0 and extrapolated where the ball is headed -- and the fit gets cleaner (R^2 climbing from 0.9887 to 0.99999) the more of the shallow, early frames it drops, with the intercept converging to exactly 2. That is why both readings survive at once: the structural relation coupling = residual/r -> 2 as r = E_flow/E_trunc -> 0 (imp-34270/imp-34351) fixes the true asymptote at 2, while log T0 grows so slowly with N that the 2/log T0 excess is still ~0.05-0.09 at every landmark depth humans can actually reach in this project's closed-form crossover ladder -- so '~2.05' and 'converges to 2' describe the SAME curve, one naming where it currently is and the other naming where it is going. Measurement/extrapolation only, on the inherited imp-3220/imp-3406 component model, NOT a rigorous asymptotic; changes no bound; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a>=0 untouched; NO QED.",
  },
  {
    id: 'etrunc-floor-vs-lpt-ingredient-not-competitor',
    category: 'proof',
    term: 'E(N) -> E_trunc: An Ingredient of L_pt, Not a Rival Bound',
    symbol: 'E(N) \\xrightarrow{N\\to\\infty} E_{\\text{trunc\\_pt}} \\approx 3.06\\times10^{-5} \\;\\subset\\; L_{pt} = L_{\\text{cond}} + E_{\\text{trunc\\_pt}}',
    definition: "imp-34434 tabulates the bridge total E(N) = E_trunc + E_flow(N) + E_coll(N) and finds it monotone decreasing with no interior minimum, settling on an N-independent floor E_trunc_pt ~ 3.06e-5 as N -> infinity. It is tempting to read that floor as a competing estimate of the Lambda beat -- since 3.06e-5 sits roughly 3954x below L_pt~0.121 (imp-459) and roughly 6536x below the peer-reviewed Platt-Trudgian bound 0.2 -- but that comparison is a category confusion. E_trunc_pt is not an independent quantity racing L_pt to a smaller number; per imp-459's definition L_pt(sigma,N0) = L_cond(N0) + E_trunc_pt(sigma), it is already one of the two additive pieces INSIDE L_pt's assembly.",
    formula: 'L_{pt} = \\underbrace{L_{\\text{cond}}(N_0)}_{\\text{tcProj+E\\_flow+E\\_coll at }N_0} + \\underbrace{E_{\\text{trunc\\_pt}}(\\sigma)}_{\\text{the imp-34434 floor}},\\quad E_{\\text{trunc\\_pt}}=\\frac{2\\,e_I(\\sigma)}{\\kappa(\\sigma)}\\,T_{PT}^{-\\kappa(\\sigma)}',
    intuition: "E(N) is a bridge assembly-error budget (imp-2564): Lambda(N) <= |t_c(N)| + E(N) is the actual inequality, not E(N) itself. So E(N) -> E_trunc_pt says only that the assembly-error floor shrinks to a fixed constant as N grows -- it says nothing directly about Lambda. That same constant, E_trunc_pt (the Ingham zero-density truncation term at Platt-Trudgian's verified height T_PT=3e12), is precisely the piece imp-459 ADDS to L_cond to build the finite-height beat L_pt: at the optimized sigma_opt=0.75 it evaluates to ~3.06e-5, pushing L_pt down to ~0.121. Comparing imp-34434's floor to L_pt is therefore comparing a sub-term to the whole sum it is already folded into -- like noting that a company's shipping-cost line item is smaller than its total revenue and concluding shipping costs are outcompeting revenue. The correct reading: as sigma and N0 are tuned (imp-447 -> imp-459), driving E_trunc_pt down is exactly HOW L_pt was improved from ~sigma=0.61's looser bound toward ~0.121, not a rival path to a smaller bound. None of this changes any RH bound: the component model is the inherited imp-3220/imp-3406 extrapolation, not a rigorous asymptotic; C_mb remains GUE-conditional per imp-486; no QED.",
  },
  {
    id: 'imp-2564-headline-vs-bridge-reframing',
    category: 'proof',
    term: 'Headline vs. Bridge: What a t_c Bound Actually Buys',
    symbol: '\\Lambda \\le -t_c(N) + E(N) \\;\\xrightarrow{\\,t_c\\ge 0\\,}\\; \\Lambda \\le E(N)',
    definition: "The finite-N bridge sandwiches Lambda between two faces built from the particle collision time t_c(N): |Lambda + t_c(N)| <= E(N), i.e. Lambda in [-t_c(N) - E(N), -t_c(N) + E(N)]. imp-2564 traces which face each kind of t_c bound actually feeds. A LOWER bound t_c(N) >= L feeds the HEADLINE (upper) face: Lambda <= -L + E(N). With only the trivial L = 0 (every collision time is non-negative), this already reads Lambda <= E(N) -- so the headline inequality needs NOTHING sharper than t_c >= 0, and the entire remaining burden falls on the bridge error E(N) going to zero.",
    formula: '\\text{(lower bound on }t_c\\text{)}\\;t_c\\ge L \\Rightarrow \\Lambda\\le -L+E(N);\\qquad \\text{(upper bound)}\\;t_c\\le U \\Rightarrow \\Lambda\\ge -U-E(N)\\le 0',
    intuition: "SG1 and its descendants (local-virial shock bounds, Theta-contraction) work hard to produce UPPER bounds on t_c(N) -- tighter and tighter ceilings on how large the collision time can be. imp-2564's sign audit shows this effort feeds the OTHER face of the bracket: an upper bound t_c <= U only gives Lambda >= -U - E(N), a number that is always <= 0 and so is permanently swamped by the unconditional Rodgers-Tao floor Lambda >= 0 -- it moves nothing on the headline RH inequality Lambda <= 0. What SG1-style bounds DO buy is fidelity of the finite-N particle model to the true continuum object, which is exactly what the bridge constants E(N) measure (how well the truncated N-particle collision process tracks the real Lambda). So a sharper t_c(N) bound is real progress on connection fidelity -- shrinking E(N) -- even though it is invisible to the headline face, where the trivial t_c >= 0 already suffices and the decisive quantity is E(N) -> 0. Audit/reframing only, no new Lambda value: C_mb remains GUE-conditional per imp-486; no QED.",
  },
  {
    id: 'residexp-peak-location-resolution-floor',
    category: 'proof',
    term: 'Why the Deep-Rung Argmax k* Only Has ~6-7 Reliable Digits',
    symbol: '\\delta k \\sim \\sqrt{\\frac{2\\,\\epsilon_f}{|f_2|}} \\approx 7.2\\times10^{-8}',
    definition: "imp-34228 pinned the double-precision ternary-search peak of resid_exp(k) at k_true~8.8210915878573530, sitting ~4.27e-11 below a stored 10-sig-fig anchor 8.8210915879 -- raising the question of whether that tiny offset is a real feature. imp-34368 answers it by measuring the peak-location floor directly: the curvature at the peak is stable at f2~-0.036196 (a genuine signal), but resid_exp itself carries an RMS evaluation noise eps_f~9.4e-17 (~6.5 ulp of the peak value ~0.0653366) from f64 rounding accumulated across the underlying regression. Feeding a noisy function value into a smooth maximum blurs the location of that maximum by dk ~ sqrt(2 eps_f/|f2|) ~ 7.2e-8 -- and re-running the identical ternary search from ten different starting brackets confirms it directly, scattering the returned peak by ~9e-8 (std ~2.5e-8), matching the formula to a factor ~1.25.",
    formula: '\\epsilon_f \\sim 6.5\\,\\text{ulp}(f_{\\text{peak}}) \\approx 9.4\\times10^{-17}, \\;\\; |f_2| \\approx 0.036196 \\;\\Rightarrow\\; \\delta k \\approx 7.2\\times10^{-8} \\;\\Rightarrow\\; k^* = 8.82109\\underbrace{15878\\ldots}_{\\text{noise past here}}',
    intuition: "Near a smooth maximum, the function is locally flat -- it looks like f(k) = f_peak - (1/2)|f2|(k-k*)^2 -- so any noise eps_f riding on the function VALUE gets amplified into an uncertainty on the LOCATION by dividing by the (small) curvature and taking a square root: a flatter peak (smaller |f2|) or noisier evaluations (bigger eps_f) both blur the argmax more. Here eps_f is fixed at roughly 6-7 ulp by ordinary f64 rounding inside resid_exp's own internal regression -- not a bug, just the ordinary cost of floating-point accumulation -- and that noise floor translates to a location blur of ~7.2e-8. Since k*~8.82 has one digit before the decimal point, a location blur at the 7-8th decimal place means only about 6-7 of the digits reported for k* (through '8.82109') are trustworthy; everything past that point is evaluation noise, confirmed because ten independent re-runs of the SAME search return ten different peaks scattered across almost exactly that same ~1e-7 window. The only change that lowers the floor is raising the WORKING precision of the resid_exp evaluation itself (e.g. bignum/double-double, which shrinks eps_f) -- switching to an analytic derivative does not help, because a derivative estimate inherits and even amplifies the same f64 value noise. Measurement/noise-characterization only, on the inherited imp-3220/imp-3406 descriptive surrogate, NOT a rigorous asymptotic; C_mb remains GUE-conditional per imp-486; changes no bound; no QED.",
  },
  {
    id: 'drift-residual-curvature-floor',
    category: 'proof',
    term: 'Why a Finite-Difference Drift Residual Is a Curvature Reading',
    symbol: 'C_{th} = -\\frac{1}{q_1}\\left(\\frac{q_2}{2q_1}-\\frac{q_3}{6q_1}\\right),\\;\\; C_{q_2}/C_{th}\\approx 0.98',
    definition: "The crossover exponent m(N) = d(log N)/d(log E_coll) is measured in this project by a central finite difference on nodes N(1 +/- h) rather than a true derivative, and that measurement carries a small, shrinking residual against the closed-form exponent as N climbs the 1e13..1e14 ladder. imp-34531 shows this residual is exactly the O(h^2) truncation error of the central difference, with coefficient C_th built from the 1st/2nd/3rd log-N derivatives of q=log E_coll: about 98% of C_th is the pure second-derivative (curvature) term, and the remaining ~2% is a third-derivative correction -- so the residual shrinking down the ladder is the drift exponent's curvature relaxing, not noise or an unrelated drift.",
    formula: 'q(p)=\\log E_{coll}(p),\\; p=\\log N;\\;\\; \\text{measured} - \\text{true} = \\frac{h^2}{q_1}\\left(\\frac{q_2}{2q_1}-\\frac{q_3}{6q_1}\\right) + O(h^4)',
    intuition: "A central difference never returns an exact derivative -- it returns the true slope plus a small overshoot set by how much the function curves between the two sample points, exactly the same way estimating a hill's steepness from two nearby marker posts misses by an amount that depends on how much the hill bends between them, not on how steep it is. Here that overshoot is almost entirely (~98%) the plain second-derivative curvature of q=log E_coll in log N, with a small third-derivative correction (~2%) accounting for the fact that the two sample nodes are not perfectly symmetric in log N once you look one order further. That is why the raw residual and the closed-form second derivative shrink in lockstep down the N=1e13..1e14 ladder, constant to within ~6%: the residual IS a faithful, if slightly impure, proxy for the drift exponent's curvature, and the ~2% impurity is fully accounted for rather than being an unexplained gap. Measurement/attribution only, on the inherited imp-3220/imp-3406 extrapolation which is NOT a rigorous asymptotic; C_mb remains GUE-conditional per imp-486; changes no bound; no QED.",
  },
  {
    id: 'eflow-attr-metric-genuine-pole',
    category: 'proof',
    term: 'eflow_attr(k): the E_flow Attribution Weight Behind the k*~21.28095 Pole',
    symbol: '\\text{eflow\\_attr}(k) = \\frac{E_{\\text{flow}}}{E_N}\\,\\left|\\frac{d\\ln E_{\\text{flow}}}{d\\log_{10} N}\\right|,\\quad N = 10^{k+1}',
    definition: "eflow_attr is the numerator underneath the eflow_over_resid ratio (= eflow_attr / resid_exp) that develops a simple pole at k* ~ 21.28095: it multiplies the E_flow attribution SHARE (E_flow/E_N, the fraction of the total energy term carried by the benign Gronwall backward-flow piece) by the magnitude of E_flow's own local log-slope in log10 N. imp-34406 recovers eflow_attr directly on eight rungs bracketing k* and finds it strictly positive throughout (+4.5197e-15 at k* itself, the smallest rung on the bracket still +2.816e-15), smooth, and monotone decreasing -- ruling out a removable 0/0 singularity and confirming eflow_over_resid's k* pole is a GENUINE simple pole, since the only vanishing factor there is resid_exp, not this numerator.",
    formula: '\\text{eflow\\_attr}(k^\\ast) = +4.520\\times10^{-15} \\;\\; (\\text{imp-34406}); \\quad \\text{eflow\\_over\\_resid} = \\frac{\\text{eflow\\_attr}}{\\text{resid\\_exp}} \\;\\text{simple pole at } k^\\ast',
    intuition: "A ratio blowing up at a point could mean either a real pole (denominator vanishes, numerator does not) or a fake, removable 0/0 (both vanish together and cancel). eflow_attr is exactly the numerator that settles the question here: because it stays smooth, strictly positive, and finite-log-sloped across the whole bracket k=21.00..21.50 -- with no local zero, sign change, or kink at k* -- the singularity in eflow_over_resid can only come from the resid_exp denominator hitting zero, which is the signature of a genuine simple pole. imp-34599 plots the full eight-rung ladder (near-side imp-34406 rungs joined with the far-side imp-34572 rungs) through k*, giving one continuous, monotone picture of the metric on both sides of the pole. Measurement only, on the inherited imp-3220/imp-3406 extrapolation which is NOT a rigorous asymptotic; C_mb remains GUE-conditional per imp-486; changes no bound; no QED.",
  },
  {
    id: 'deflow-decay-observed-only-analytic-slope-match',
    category: 'proof',
    term: 'deflow(kEnd) Decays Like N^-1 (Up to Log Factors), Confirmed From Observed Rungs Alone',
    symbol: 'p(N) = p_\\infty - \\frac{c}{\\log N},\\;\\; p_\\infty^{\\text{observed}} \\approx 1.00073,\\;\\; |p_\\infty^{\\text{observed}} - 1| \\approx 7.3\\times10^{-4}',
    definition: "deflow(kEnd) = resid_full - resid_noflow is the small monotone falloff isolated in imp-34373, and imp-34448 fit its local decay exponent p(N) = -d log|deflow| / d log N, finding it rise toward an asymptote pInf ~ 1.000 -- but that fit mixed six directly-observed rungs (kMid 16.125..19.875) with several fit-extrapolated rows past the ~1e-15 double-precision floor. imp-34571 refits p = pInf - c/log(N) using ONLY the directly-observed rungs and checks the result against the analytic target: E_flow ~ log^3(N)/N forces d log E_flow / d log N -> -1, so deflow, which inherits the E_flow tail, should decay with exponent magnitude exactly 1 (i.e. like N^-1 up to log factors).",
    formula: '\\text{analytic target: } E_{\\text{flow}} \\sim \\frac{\\log^3 N}{N} \\Rightarrow \\left|\\frac{d\\log E_{\\text{flow}}}{d\\log N}\\right| \\to 1;\\;\\; \\text{observed-only refit: } p_\\infty \\approx 1.00073,\\; c \\approx 3.212',
    intuition: "The question is whether the pInf ~ 1.000 asymptote reported by imp-34448 is a real feature of the observed data or an artifact of extrapolating the fit past the floating-point noise floor. Restricting the same OLS refit to only the six rungs where deflow is still directly measured (well below both the fp floor kEnd~23 and the crossing kEnd*~21.281) reproduces pInf ~ 1.00073 on its own -- so the asymptote is carried by real, directly-observed data, not manufactured by the extrapolated tail. That observed-only pInf lands within ~7.3e-4 of the analytic target of exactly 1, and that residual is itself the same order as the expected 1/log(N) finite-rung correction at the deepest observed rung (~0.070) -- meaning the small gap is exactly the kind of leftover a finite sample should have, not evidence the analytic prediction is wrong. It also agrees with the imp-34448 full-window pInf (1.0005) to ~2.3e-4, so nothing shifts by excluding the extrapolated rows. imp-34617 further shows both residuals shrink as ~c/log(N) and extrapolate to ~0 within one standard error, confirming the ~7.3e-4 gap is a finite-rung correction that vanishes as N grows, not a permanent floor. Measurement only, on the inherited imp-3220/imp-3406 component model which is NOT a rigorous asymptotic; the analytic E_flow slope is a property of that surrogate, not the true residual; C_mb remains GUE-conditional per imp-486; changes no bound; establishes no operator positivity; no QED.",
  },
  {
    id: 'q3-share-error-roundoff-limited-plateau',
    category: 'proof',
    term: 'Why the Deep-Tail q3-Share Error Is a Roundoff PLATEAU, Not a U-Shaped Optimal-Step Trade-Off',
    symbol: '\\text{err}(dp) \\sim R_\\infty + \\frac{b}{dp^{m}},\\;\\; m \\approx 3.5,\\;\\; R_\\infty \\approx -0.0968\\;\\; (\\text{NOT } a\\,dp^2+\\tfrac{b}{dp})',
    definition: "imp-34573/imp-34587 traced the deep-vs-mid q3-share instability of the finite-difference decomposition C_th = C_q2 + C_q3 to the classic truncation-vs-roundoff trade-off imp-34566 named, err(dp) ~ a dp^2 + b/dp, and reported an intrinsic drift of ~ -7.5% by Richardson-extrapolating through dp = 2e-3. imp-34593 actually fits that model and finds it wrong on both counts: the truncation coefficient a is unmeasurably small (both the drift and the deep-group relative range are FLAT across dp = 6e-3 .. 1e-1, so a ~ 0 and the prescribed (b/2a)^(1/3) diverges -- there is no interior optimum), and the roundoff exponent is not 1 but m ~ 3.5 (R^2 ~ 0.99 in log-log, vs R^2 ~ 0.48 forcing m = 1), consistent with roundoff on the third-difference q3 = (4-point)/(2 dp^3).",
    formula: '\\text{drift}(dp)\\big|_{dp=6e{-3}..1e{-1}} \\approx -0.09682\\;\\; (\\text{flat}); \\quad dp^\\ast \\approx 2.61\\times10^{-3}\\;\\; (\\text{roundoff-floor crossing})',
    intuition: "A total-error curve with a real interior optimum looks like a U: truncation error grows as the step widens, roundoff error grows as the step shrinks, and somewhere in between the sum is minimized. Here the truncation side of that U never materializes -- q(p) = log E_coll is smooth and slowly varying enough in log N that its central-difference truncation term stays negligible all the way out to dp = 0.1, so the curve is not a U at all but a monotone-decreasing approach to a flat plateau, err(dp) ~ R_inf + b/dp^m, entirely set by roundoff. That reclassifies both what the 'optimal step' means (not a minimum of a genuine trade-off, but the point where the roundoff excess crosses some tolerance above the flat floor, here dp* ~ 2.6e-3) and what the intrinsic drift is: the plateau value ~ -9.7% sits about 29% deeper than the ~ -7.5% the parents got, because their Richardson extrapolation passed through dp = 2e-3, a point that (per imp-34611's independent-stencil crosscheck) sits in a below-optimal roundoff dip rather than on the plateau. Measurement/re-fit only, on the inherited imp-3220/imp-3406 component model which is NOT a rigorous asymptotic; C_mb remains GUE-conditional per imp-486; changes no bound; no QED.",
  },
  {
    id: 'discretization-diagnosis-toolkit',
    category: 'proof',
    term: 'The Discretization-Diagnosis Toolkit: Order, Step, and Closed-Form Cross-Checks',
    symbol: '\\text{order-invariant residual (fixed }h\\text{, rising FD order)} \\Rightarrow \\text{physical};\\;\\; \\text{order-convergent} \\Rightarrow \\text{discretization}',
    definition: "Three recent modules share one recurring question -- when a measured residual is small but nonzero, is it a genuine feature of the underlying surrogate function, or an artifact of how it was numerically measured? -- and answer it with three complementary triangulation techniques rather than trusting any single fixed-order, fixed-step calculation. imp-34753 varies the FINITE-DIFFERENCE STENCIL ORDER (4th, 6th, 8th) at fixed step size on identical footing: a residual that stays flat across rising order is ORDER-INVARIANT and real (the (log N)^(4/3) exponent shortfall held at ~6.1e-3 across all three orders), while a residual that shrinks by a roughly constant factor per order-step is ORDER-CONVERGENT and discretization (the q3*p^3 constant shrank ~5.1x per +2 order, extrapolating to one shared limit). imp-34756 instead varies the STEP SIZE of the finite difference (h=2e-3..2.5e-4) while restoring the next analytic order of a slowly-varying expansion: it found the converged analytic knee did NOT coincide with the direct central-difference root, off by ~9.2e-5 dex, and that both numeric routes hit roundoff onset near the same step h~5e-4 -- so the gap was discretization noise, not a missing physical term, since no higher expansion order closed it. imp-34757 uses a third check: cross-validating an independently DERIVED CLOSED FORM against a central-difference approximation over a dense grid of probes (63 points across three bands), confirming agreement to <1e-5 relative everywhere -- this guards the closed form itself against a silent derivation error, rather than diagnosing an already-observed residual.",
    formula: '\\underbrace{\\text{order }4\\to6\\to8}_{\\text{imp-34753: flat = physical}} \\quad \\underbrace{h: 2\\times10^{-3}\\to2.5\\times10^{-4}}_{\\text{imp-34756: step-refine + next order}} \\quad \\underbrace{\\text{closed form} \\approx \\text{FD to} < 10^{-5}}_{\\text{imp-34757: formula guard}}',
    intuition: "All three techniques approach the same blind spot from a different angle: a single finite-difference measurement at one step size and one accuracy order cannot, by itself, tell you whether a small leftover number is a real property of the function being measured or just the ordinary cost of approximating a derivative with nearby samples. Raising the STENCIL ORDER (imp-34753) asks whether a residual survives a strictly more accurate differencing rule -- if yes, it is real; if it shrinks in step with the order, it was truncation error. Shrinking the STEP SIZE while restoring an extra analytic term (imp-34756) asks the complementary question: does adding more analytic structure close the gap, or does the same gap reappear from two independent differencing routes at the same step where both start to wobble? When two unrelated central differences hit roundoff at the identical step and disagree by the same small amount, that agreement-in-disagreement is the signature of discretization, not missing physics. Cross-validating a CLOSED FORM against a dense finite-difference sweep (imp-34757) flips the direction of the check entirely: instead of asking whether a residual is real, it asks whether the analytic formula being trusted as ground truth is itself correct, by demanding it survive many probes across several bands rather than a handful of spot checks. Together the three form a standing toolkit: vary the stencil order to classify an existing residual, vary the step size (with an extra analytic order) to rule out a missing term, and cross-check a closed form densely before relying on it as the reference. All three operate only on the inherited imp-3220/imp-3406 descriptive surrogate and its derived quantities, which are NOT rigorous asymptotics; C_mb remains GUE-conditional per imp-486; none of these methodology notes changes any bound; no QED.",
  },
  {
    id: 'forward-vs-contraction-width-inflation',
    category: 'proof',
    term: 'Forward-Propagation vs Contraction Width Inflation in Interval Newton',
    symbol: 'w([T]-[dT]) = w([T]) + w([dT])\\;\\;(\\text{forward, compounds});\\quad N([T]) = m - \\frac{[f](m)}{[f\'([T])]}\\;\\;(\\text{Krawczyk, resets from the final residual})',
    definition: "imp-34865 instantiated two ways of running the SAME interval-Newton recurrence for the RvM-inverse [T0] with a directed-rounding surrogate (outward round by one relative EPS per elementary op) from the common (H2) bracket. FORWARD PROPAGATION carries the input interval through the depth-30 Newton chain by literally computing [T] - [dT] at each step; because interval subtraction ADDS the operand widths and w([dT]) ~ w([T]) near the fixed point, each step roughly DOUBLES the enclosure (measured factor 2.0000), reaching ~80% of the (H2) margin after 4 steps and CROSSING it by step ~5 (imp-34884 localized the first crossing to op-DAG depth d*=8, the very first [T]-dT subtraction; imp-34889 showed the crossing is band-wide across the admissible seed range, always at step 5). The KRAWCZYK CONTRACTION instead re-derives a fresh enclosure N([T]) = m - [f](m)/[f_prime]([T]) at every step; since f is monotone-increasing and convex on the relevant range (imp-34687), this operator is a genuine contraction whose output width is set only by the FINAL residual, not by the input width it started from -- so the contracted enclosure collapses ~12.5 orders below the margin instead of doubling every step.",
    formula: '\\underbrace{2^{n}\\;\\text{growth over }n\\text{ Newton steps, crossing at }n{\\approx}5}_{\\text{imp-34865/34884: forward propagation}} \\quad\\text{vs}\\quad \\underbrace{\\sim 10^{-12.5}\\times\\text{margin, never crosses}}_{\\text{imp-34865: Krawczyk contraction}}',
    intuition: "Think of passing a measurement down a chain of people, each one re-stating it with their own rounding: if each person's restatement is built by SUBTRACTING a correction from what the previous person said (interval Newton's [T]-[dT] update), the uncertainty of the correction ADDS to the uncertainty already carried forward, so the error roughly doubles at every hop -- after only a handful of hops it has swamped the original tolerance, even though the underlying quantity itself is converging just fine as a point value. Contrast that with someone who, instead of adjusting the previous answer, throws it away and RE-DERIVES a fresh answer from only the most recent evidence (the Krawczyk contraction, which recomputes m - f(m)/f'([T]) from the current bracket and the map's own monotone-convex shape): that fresh derivation's uncertainty is set purely by how sharp the final piece of evidence is, with no memory of how wide the input happened to be. The practical lesson is that the widely-used flat gamma(n_op) = n_op*eps/(1-n_op*eps) first-order width surrogate (imp-34799) is quietly built for the CONTRACTION style of bound (width scales linearly in the op count) and is silently invalid if applied to a forward-propagating interval Newton chain, where the true width instead grows geometrically in the number of Newton steps -- so any interval-Newton style recurrence should be checked for which of the two regimes it is actually in before its width is estimated by a flat per-op formula. FEASIBILITY / surrogate restatement only on the inherited imp-3220/imp-3406 crossover map; the imp-34687a certified directed-rounding layer and imp-34714a REMAIN OPEN; C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; no operator positivity; no RH verdict, NO QED.",
  },
  {
    id: 'crlibm-log-enclosure-not-a-surrogate-amplifier',
    category: 'proof',
    term: 'The Transcendental-Layer Blocker: a Two-Sided ULP Log Enclosure, Not a k*eps/gamma(n) Surrogate',
    symbol: '[\\mathrm{RD}(\\log x),\\,\\mathrm{RU}(\\log x)],\\;\\; \\text{width} \\le 1\\,\\mathrm{ulp} = 2^{-52} = \\mathrm{EPS} \\;\\;(\\text{NOT } k\\cdot\\mathrm{eps}/\\gamma(n))',
    definition: "imp-34840 decomposed the Krawczyk endpoint evaluation into an operation DAG (n_op ~ 49, depth ~ 30) and found the MARGIN axis feasible, then localized the genuine remaining blocker as the TRANSCENDENTAL layer: the chain calls Math.log several times (the inner RvM-inverse Newton loop, the outer g = K log T0, and g_prime), and instantiating a directed-rounding enclosure for those calls needs a two-sided ULP bound on log itself, NOT the flat k*eps/gamma(n) = n_op*eps/(1 - n_op*eps) first-order surrogate (imp-34799) used for the ordinary arithmetic ops. imp-34867 scoped exactly that layer and found it BENIGN rather than a blocker: a correctly-rounded / crlibm-style log has round-to-nearest per-call relative half-width 0.5 ulp = 2^-53 ~ 1.11e-16, and the two-sided directed enclosure [RD(log x), RU(log x)] has outward relative half-width <= 1 ulp = 2^-52 = EPS -- exactly the SAME per-call width as an ordinary directed-rounded +, -, or * -- so it contributes one unit-roundoff term to the gamma(n_op) accumulation rather than a special amplifier.",
    formula: '\\kappa_{\\log}(a) = \\frac{1}{|\\log a|};\\quad \\kappa_{\\log}(T_0/2\\pi) \\approx 0.0526,\\;\\; \\kappa_{\\log}(T_0) \\approx 0.0479 \\;\\;(\\text{both} \\ll 1 \\Rightarrow \\text{log CONTRACTS, does not amplify})',
    intuition: "The k*eps/gamma(n) surrogate is a bookkeeping shortcut built for elementary arithmetic: it assumes every op in the chain contributes one flat relative unit of roundoff, so the total width just accumulates linearly in the op count. It is tempting to worry that a transcendental call like log breaks that bookkeeping -- maybe it needs its own bespoke amplification factor, the way a near-singular division or a poorly-conditioned subtraction would. imp-34867 checks this directly instead of assuming it: a CORRECTLY-ROUNDED log (the crlibm/RLIBM/IEEE-754-2019-recommended-function style, which returns the floating-point number nearest the true value) is by definition no less accurate than round-to-nearest arithmetic, so its two-sided directed enclosure is no wider than one ULP -- the same one-unit-of-roundoff currency the gamma(n) formula already spends on every other op. And on THIS particular chain log is additionally well-behaved in the calculus sense: its relative condition number kappa_log(a) = 1/|log a| is far below 1 at both arguments actually used (T0/2pi ~ 1.82e8 and T0 ~ 1.14e9, both giving log a > 19), so instead of amplifying incoming uncertainty, every log call CONTRACTS it by roughly 20x. The genuine remaining gap is therefore not a width problem or a conditioning problem at all, but an ENGINEERING one: stock JS Math.log carries no ECMAScript-guaranteed ULP bound and has no directed round-down/round-up variants, so nothing in the standard runtime actually SUPPLIES the correctly-rounded two-sided log this analysis shows would suffice -- sharpening the imp-34687a sub-gap from \"supply directed rounding\" to \"supply a proven-ULP-bounded log with RD/RU variants\", which imp-34714a still leaves OPEN. Scoping/feasibility only on the inherited imp-3220/imp-3406 surrogate crossover map; C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; no operator positivity; no RH verdict, NO QED.",
  },
  {
    id: 'crossover-deriv-all-orders-sign-induction',
    category: 'proof',
    term: 'From Order-by-Order to All-Orders: the Crossover-Map Derivative Sign Induction',
    symbol: "P_{n+1}(u) = n\\,u\\,P_n(u) + (2n-1)P_n(u) - u\\,P_n'(u);\\quad a_k^{(n+1)} = n\\,a_{k-1}^{(n)} + (2n-1-k)\\,a_k^{(n)} \\ge n \\ge 2",
    definition: "imp-34793/imp-34822/imp-34842/imp-34859 established, ONE ORDER AT A TIME up to the sixth derivative, that the inherited imp-33723 crossover map g(N) = K log T0(N) has derivatives of the form g^(n)(N) = (-1)^(n+1) 2^n pi^n K P_n(u) / (T^n u^(2n-1)) with a numerator polynomial P_n(u) whose coefficients are all strictly positive -- so g^(n) carries the definite sign (-1)^(n+1) -- but each order was verified as its own separate computation, leaving the all-orders statement open. imp-34880 closes that gap: differentiating g^(n) once more on the Riemann-von Mangoldt footing dT/dN = 2pi/u, du/dN = 2pi/(Tu) yields the exact recurrence P_(n+1) = n u P_n + (2n-1) P_n - u P_n', i.e. in coefficients a_k^(n+1) = n a_{k-1}^(n) + (2n-1-k) a_k^(n), which reproduces the measured P_3..P_6 from the base P_2 = u+1 exactly, and then proves by induction that every P_n (n >= 2) has strictly positive coefficients: the only subtractive contribution, -u P_n', never appears alone -- it always combines with the +(2n-1) P_n term into the single multiplier (2n-1-k), and since deg P_n = n-1 caps k at n-1, that multiplier is bounded below by n >= 2 across the entire support of P_n.",
    formula: "a_{n-1}^{(n)} = (n-1)!\\;\\;(\\text{leading coefficient});\\qquad a_0^{(n)} = (2n-3)!!\\;\\;(\\text{constant coefficient})",
    intuition: "An order-by-order sign chain is like checking a staircase is safe by walking down it one step at a time and reporting back after each step -- reassuring, but silent about the step you haven't reached yet. The way to turn that into a guarantee about every step, including ones never individually walked, is to find the single mechanical RULE relating one step to the next and show that rule can never fail. Here that rule is the recurrence itself: going from P_n to P_(n+1) always adds a purely positive contribution (n u P_n, since n >= 2 > 0) and subtracts a purely positive one (u P_n'), and the fear would be that the subtraction eventually outweighs the addition at some coefficient. imp-34880's key observation is that the subtraction never stands alone -- differentiating g^(n) also produces a THIRD positive term, +(2n-1) P_n, and algebraically the subtractive and this new additive term FUSE into one combined multiplier (2n-1-k) that acts on a_k. Because the polynomial's own degree (n-1) caps how large k can ever get, that combined multiplier is trapped between a positive floor (n, at the top coefficient) and a large ceiling (2n-1, at the bottom coefficient) -- it can literally never turn negative, no matter how far the induction is carried. That is the difference between a proof and a long finite check: instead of re-verifying positivity at order 7, order 8, and so on forever, the induction shows the SAME non-negative-multiplier argument reproduces itself identically at every step, so checking it once at the general step certifies all orders simultaneously. Two closed forms -- the leading coefficient (n-1)! and the constant term (2n-3)!! -- fall out of the same recurrence as independent cross-checks that it was set up correctly. This is a rigorous, COMPLETE proof of coefficient positivity (hence the all-orders definite derivative sign) for the derivatives of the INHERITED imp-3220/imp-3406 surrogate crossover map ONLY; it establishes NO RH-level result, NO operator positivity, and changes NO bound. The C_mb GUE-conditional share per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), and imp-3066 K_a >= 0 are all UNTOUCHED; no RH verdict, NO QED.",
  },
  {
    id: 'krawczyk-certificate-precision-scope',
    category: 'proof',
    term: 'Scoping a Machine-Checkable Krawczyk Certificate: Which Precision Obligations Are Real',
    symbol: "[\\mathrm{RD},\\mathrm{RU}]\\;\\text{for every DAG op};\\quad \\text{log residual} \\sim 10\\text{ orders below the (H2) margin};\\quad n_{op}^{\\max}\\sim 8.60\\times10^{11} \\gg n_{op}\\sim 50",
    definition: "The imp-34865/34883/34884/34889 forward-breach and headroom modules all lean on the imp-34714a certified transcendental (Krawczyk existence-uniqueness) layer, which stays OPEN, and stand in for it with the imp-34799 gamma(n_op) eps first-order surrogate -- a bookkeeping bound whose machine fixed point F(m) = 0 EXACTLY is itself a double-precision ARTIFACT of never having instantiated a genuine directed-rounding evaluation. imp-34908 asks what replacing that surrogate with an actual machine-checkable certificate would demand, and separates the question into four parts: (A) which interval primitives need to be correctly-rounded, (B) how large the residual budget from the four transcendental log call-sites is, (C) where extended precision becomes mandatory rather than merely convenient, and (D) whether double precision is even feasible for the certificate arithmetic at all.",
    formula: "\\gamma(n_{op}) = \\frac{n_{op}\\,\\mathrm{eps}}{1-n_{op}\\,\\mathrm{eps}}\\;\\;(\\text{the surrogate this certificate would REPLACE, not instantiate})",
    intuition: "It is tempting to treat 'we need a rigorous certificate' as one big undifferentiated task, but imp-34908's contribution is to show the task cleanly decomposes, and that most of the pieces are already easy. Addition, subtraction, and multiplication are IEEE-754 correctly rounded at the hardware level -- JavaScript just never exposes the round-down/round-up modes, so a directed enclosure needs only a well-known error-free-transformation trick (TwoSum/Dekker-style splitting), not new mathematics. Division needs one extra step, a residual-corrected quotient, because JS division is not directly steerable either. The one genuinely open primitive is the transcendental log: IEEE-754 only RECOMMENDS, but does not MANDATE, correct rounding for it, so nothing in the standard guarantees a proven two-sided ULP bound on Math.log the way it does for the arithmetic ops. Having sorted the primitives, the natural next worry is whether the log calls -- there are about seven of them across the Newton loop -- could secretly be the dominant source of uncertainty. They are not: propagating one ULP of outward width per call through the contraction gives a residual roughly ten orders of magnitude below the (H2) bracket margin, so log accuracy is a correctness question, not a size question. That reframes the precision issue entirely: extended (double-double) precision is not needed because double is somehow too coarse for the interval WIDTH -- ordinary double precision clears that budget with about ten orders of margin to spare -- it is needed only as the internal MACHINERY to manufacture the two primitives JS cannot supply pre-rounded (a provably-correctly-rounded log, and the residual-corrected quotient). Stripped of everything else, closing the imp-34714a gap reduces to a single unmet engineering artifact: a proven-ULP two-sided log, obtainable either by binding an external correctly-rounded library (crlibm/RLIBM/MPFR) or by manufacturing one in double-double arithmetic with its own machine-checked ULP proof. This is a FEASIBILITY SCOPE only -- it enumerates what a certificate would require and confirms double precision is plausible, but it supplies no primitive, instantiates no directed-rounding layer, and does not discharge the imp-34714a or imp-34687a sub-gaps, which REMAIN OPEN. Scoping/assessment only on the inherited imp-3220/imp-3406 surrogate crossover map; C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, NO QED.",
  },
  {
    id: 'four-landmark-cluster-n-3-3e9',
    category: 'proof',
    term: 'The Four-Landmark Cluster Near N ~ 3.3e9',
    symbol: 'N_{\\text{half}} < N_{\\text{cross}} < N_* ,\\quad N_{\\text{cross}} \\in [3.109\\times10^9,\\,3.452\\times10^9]',
    definition: "imp-35009 tabulates four independently-derived landmarks that all land within a few percent of N ~ 3.3e9 and measures their pairwise relative spreads: the imp-33582 sigma(N)=1/2 halving point N_half (~3.267e9, an empirical bisection of the conditional share), the imp-33723 E_coll=E_trunc crossover N_cross (~3.280294e9, a closed-form Banach fixed point that reproduces the same bisection to ~1.7e-15), the imp-33721 sigmoid-inflection knee N_star (~3.38e9, where the sigma(N) decay-rate ramp changes from convex to concave), and the imp-34693 admissible Picard seed band centered on N_cross (half-width ~1.712e8, giving [3.109e9, 3.452e9]). Every pairwise spread among the three point-landmarks comes out under 4% (half-vs-cross ~0.40%, cross-vs-star ~2.95%, half-vs-star ~3.25%), and all three sit inside the seed band.",
    formula: '\\text{half-vs-cross} \\approx 0.40\\%,\\quad \\text{cross-vs-star} \\approx 2.95\\%,\\quad \\text{half-vs-star} \\approx 3.25\\%',
    intuition: "Four different questions -- 'where does the conditional share cross one half?' (N_half), 'where do two raw energy terms become equal?' (N_cross), 'where does the decay curve's bend flip direction?' (N_star), and 'what N-window is a Picard iteration allowed to seed from?' (the imp-34693 band) -- were each answered by a SEPARATE derivation, at a separate point in this project's history, using different machinery (bisection, closed-form fixed point, second-difference sign change, contraction-mapping admissibility). That they all land within a few percent of each other near N ~ 3.3e9 is worth noting precisely because none of the four derivations was built to target that number; the co-location is a consequence of the fact that all four live on the SAME underlying sigma(N) decay curve (the imp-3220/imp-3406 surrogate), so features of that one curve -- its midpoint, its component crossover, its inflection, and a workable neighborhood around it -- are bound to sit close together. This is a measurement of internal consistency across four already-published results, not a new derivation and not a proof that the cluster's tightness is structurally forced rather than a property of this particular curve; the C_mb GUE-conditional share (imp-486) is untouched, no operator positivity is established, and it changes no bound. NO QED.",
  },
  {
    id: 'banach-fixed-point-vs-bracketed-bisection-n-cross',
    category: 'proof',
    term: 'Banach Fixed Point vs. Bracketed Bisection: Why N_cross Self-Certifies',
    symbol: "N_{\\text{cross}} = (C_C/E_{\\text{trunc}})^2 \\log T_0(N_{\\text{cross}}),\\quad |g'(N_{\\text{cross}})| \\approx 4.54\\times10^{-2} \\ll 1",
    definition: "imp-3444 located the E_coll(N) = E_trunc crossover only by downslope BISECTION -- narrowing a bracket until the sign flip is resolved to machine precision, with no independent check that the bracket contains exactly one root. imp-33723 supplies a CLOSED FORM instead: squaring the crossover condition and solving for N gives the fixed-point equation N_cross = (C_C/E_trunc)^2 log T0(N_cross), i.e. N_cross = g(N_cross) for g(N) = K log T0(N). Because log T0(N) grows only logarithmically, g is a verified STRONG CONTRACTION at the root (|g_prime(N_cross)| ~ 4.54e-2 << 1), so the Banach fixed-point theorem guarantees a UNIQUE root and geometric convergence from any reasonable seed -- Picard iteration lands on N_cross ~ 3.280294e9 in ~5 steps, matching the bisected imp-3444 value to ~1.7e-15 relative. The ~0.4% residual between N_cross and the imp-33582 empirical halving landmark N_half is then re-measured FROM the closed-form root (not from a bisected bracket) and reproduces the identical offset attributed by imp-33601 to the Gronwall E_flow term -- confirming that gap is a genuine model quantity, not leftover discretization error from either root-finding method.",
    formula: 'g(N) = K \\log T_0(N),\\quad K = (C_C/E_{\\text{trunc}})^2,\\quad \\left|\\frac{N_{\\text{cross}}-N_{\\text{half}}}{N_{\\text{cross}}}\\right| \\approx 3.98\\times10^{-3} = \\frac{E_{\\text{flow}}}{E_{\\text{trunc}}}\\text{-driven}',
    intuition: "A bracketed bisection answers only 'somewhere in here the sign flips' -- it certifies a root exists in the bracket, but says nothing about whether that root is the ONLY one, and it inherits whatever width the bracket was cut to. A verified contraction answers a strictly stronger question: 'this map has exactly one fixed point, period, and here is the geometric rate at which any starting guess converges to it.' That is what makes the imp-33723 characterization self-certifying -- the |g_prime| << 1 measurement is itself the proof of uniqueness and convergence, carried inside the object, rather than an external bracket chosen by whoever ran the bisection. The payoff of having two independent methods that agree to 15 digits is that the ~0.4% gap to the neighboring N_half landmark can no longer be blamed on either method's numerics: since the closed-form root has no bracket to begin with, re-measuring the gap from it and getting the SAME ~0.4% offset (matching the imp-33601 E_flow attribution) shows the residual is a real, present physical term in the model, not noise from where a bisection happened to stop. Derivation/cross-check only, on the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) untouched; changes no bound; establishes no operator positivity; NO QED.",
  },
  {
    id: 'sharecoll-crossing-vs-sole-survivor-height',
    category: 'proof',
    term: 'shareColl Crossing N_cross vs. Sole-Survivor Height N*: Same E_coll, Different Denominator',
    symbol: 'N_{\\text{cross}}:\\ \\frac{E_{\\text{coll}}}{E(N)} = 0.01\\;<\\; N_*:\\ \\frac{E_{\\text{coll}}}{E_{\\text{trunc}}} = 0.01',
    definition: "Two deep-tail landmarks are easy to conflate because both are read off the same collision term E_coll falling to the 1% level, but they divide by different denominators. The imp-36097 shareColl < 1% crossing N_cross (~4.624381e13, log10 N ~ 13.6651) is the first N where the SHARE E_coll / E(N) drops below 0.01, using the full three-way split E(N) = E_trunc + E_flow + E_coll (imp-35889) as the denominator. The imp-35971 E_trunc sole-survivor height N* (~4.7214e13, log10 N* ~ 13.6741) is the first N where the RATIO-TO-TRUNC E_coll / E_trunc drops below 0.01, using only the fixed E_trunc = 3.06e-5 (imp-2631) as the denominator. imp-36155 quantifies the gap between them exactly: N* / N_cross ~ 1.020980 (~2.098% apart in N, ~0.009017 decades), and proves the ordering N_cross < N* is STRUCTURAL, not a tabulation coincidence: since E(N) = E_trunc + E_flow + E_coll > E_trunc strictly at every finite N, the share E_coll/E(N) is pointwise smaller than the ratio E_coll/E_trunc, so the share reaches the fixed 0.01 level first.",
    formula: '\\frac{N_*}{N_{\\text{cross}}} \\approx 1.020980,\\quad \\log_{10}\\!\\frac{N_*}{N_{\\text{cross}}} \\approx 0.009017,\\quad \\text{shareColl}(N_*) \\approx 9.90\\times10^{-3} < 0.01',
    intuition: "Two rulers measuring the same shrinking quantity E_coll will disagree about when it crosses a fixed mark if the rulers themselves are scaled differently. Here the SHARE ruler (E_coll over the full three-term total E(N)) is always a bit shorter than the RATIO-TO-TRUNC ruler (E_coll over the fixed E_trunc alone), because the share's denominator carries the extra positive mass of E_flow and E_coll itself on top of E_trunc. A quantity shrinking down the tail hits a shorter ruler's fixed mark sooner than a longer ruler's identical mark -- so the share-based crossing N_cross is structurally guaranteed to arrive before the ratio-based sole-survivor height N*, no matter how close the two numbers land numerically. The fingerprint of this is visible directly at N*: there, shareColl is already ~0.99% (just under the 1% line) even though the ratio-to-trunc is still exactly at the 1% line by definition -- the same collision mass, read through the fuller denominator, has already dipped below threshold. Measurement/cross-reference only, reusing both source literals verbatim; E_trunc = 3.06e-5 (imp-2631) and C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643, GUE-conditional per imp-486) are untouched; imp-35337a stays OPEN; establishes no operator positivity, changes no bound, NO QED.",
  },
  {
    id: 'seam-certificate-three-currencies',
    category: 'proof',
    term: 'Seam Certificate Currencies: COUNT, DEPTH y_min, PHASE theta',
    symbol: 'R \\le e^{-2x}\\Big[\\sum_{k=0}^{N-1}\\binom{K}{k}\\big(1+e^{x/K}\\big)^k\\Big]^2 \\;\\text{(COUNT)},\\qquad \\theta = \\frac{\\int_{\\mathbb R} f^2}{\\int_{\\mathbb R} g^2}\\;\\text{(PHASE)}',
    definition: "Across the signed seam-certificate chain (packets f_n(s) = e^{-mu_n|s-u_n|} with rates mu_n, centers u_n, amplitudes c_n, and shift ratio R = int_{s<0} f^2 / int_R f^2), the legs price the same shift-decay bound in three distinct currencies. COUNT (imp-95225 THEOREM SGN-C) bounds R via N, the number of DISTINCT rates, and the global depth-rate product x = m*d -- valid for arbitrary real amplitudes and arbitrary centers, uniform over coalescence. DEPTH y_min (imp-95233 PHASE-CERT depth argument) is a per-window GEOMETRY quantity, the minimum over rate-center pairs of (mu_m+mu_n)*min(u_m,u_n). PHASE theta (imp-95233 amplitude-sign functional) is the scale-invariant ratio of int f^2 to int g^2 (g = sum|c_n| f_n), measuring how the amplitude SIGN PATTERN pulls f away from its modulus envelope g.",
    formula: 'y_{\\min} = \\min_{m,n} (mu_m+mu_n)\\min(u_m,u_n), \\qquad x = m\\,d,\\qquad \\theta \\in (0,1]',
    intuition: "The three currencies answer three different questions about the same signed family, and imp-95255 settled which ones survive transcription into the paper's per-window framework. COUNT and DEPTH y_min are both GEOMETRY quantities -- built only from rates and centers -- so y_min inherits the same width-law port that already carries x_min into the paper framework (imp-95220/imp-95222), landing within a bracket that collapses onto x_min as the window grows (measured ratio y_min/x_min -> 1). PHASE theta is different in kind: it is a SIGN functional, not a geometry functional, and the transcription supplies only rates, centers, and amplitude MODULI (paper eq 14) -- no per-window sign pattern. So theta is OBSTRUCTED at the transcription step, not at the certificate step: on the fixed-amplitude family the paper actually ports, theta=1 identically and PHASE-CERT degenerates to the geometry-only FA-2 bound. Net effect: the COUNT and DEPTH legs of the seam chain are portable to the paper's Lambda<=0.2 benchmark; the PHASE leg is not, until a genuine per-window sign pattern is identified. Documentation of imp-95233/imp-95255 status only; changes no bound; NO QED.",
  },
  {
    id: 'montgomery-frequency-threshold-alpha-k1-h-0-8408p',
    category: 'proof',
    term: 'The Montgomery-Frequency Threshold: alpha_{k,h} > 1 iff k = 1 and h > 0.8408 p',
    symbol: '\\alpha_{k,h} = 1 + \\frac{\\log\\!\\big(1/(2\\pi(k-h/p))\\big)}{\\log T} \\;>\\; 1 \\iff k=1 \\text{ and } h > p\\Big(1-\\frac{1}{2\\pi}\\Big) = 0.8408\\,p',
    definition: "imp-95519 puts the zero-side phases of the localized barrier sum A_{k,h} into Montgomery's normalisation alpha_{k,h} = log u_{k,h} / log T, where u_{k,h} = v/(k - h/p) is the stationary-phase frequency of the (k,h) alias. Solving alpha_{k,h} > 1 directly gives the threshold k - h/p < 1/(2 pi), which for the dominant k=1 row is exactly h > p(1 - 1/(2 pi)) = 0.8408 p. At the active sieving prime p = 97 this singles out h in {82,...,96} -- 15 of the 96 aliases -- and those 15 aliases carry 59.26% of the named-scalar majorant 2 p^{-4/3} sum j^{-2/3} (imp-95519's alphaOverOneShare), because the largest-amplitude curvature-floor aliases are exactly the ones with h closest to p.",
    formula: '\\text{share}(\\alpha>1)\\big|_{p=97} = 59.26\\%,\\quad \\alpha_{\\max} = 1.0953\\;(N{=}690988),\\;\\; \\alpha_{\\min} = 0.468\\;(k{=}N)',
    intuition: "Montgomery's pair-correlation theorem, on RH, only pins down F(alpha) unconditionally-usefully inside the window |alpha| <= 1 -- that is the range his Fourier-transform argument actually controls. The threshold computed here says something uncomfortable about where the localized barrier sum's own mass sits: for the dominant k=1 aliases, crossing alpha=1 is not a rare edge case but the MAJORITY behavior -- just over 59% of the majorant mass at p=97 lives at alpha > 1, strictly outside Montgomery's provable range, and needs the full pair-correlation CONJECTURE (equivalent to prime-pair statements a la Goldston-Montgomery / Montgomery-Soundararajan) rather than the proven theorem. The remaining 41% at alpha in [0.47, 1) is in range only conditionally on RH, and even then F(alpha) there is a MEAN-SQUARE statement over gamma in [0,T], not the POINTWISE-in-T bound the barrier-sum contract actually needs. So the PCC consequence is layered, not binary: it is not that Montgomery's machinery is simply inapplicable, but that the majority alias mass needs a strictly stronger open conjecture, and even the minority in-range mass needs an upgrade (mean-square to pointwise) that a companion audit (imp-95604) shows is foreclosed by a Kronecker-sharp sqrt(H) transfer constant. Restatement of the imp-95519 zero-side accounting only; changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.",
  },
  {
    id: 'prime-side-double-bind-height-width-grh',
    category: 'proof',
    term: 'The imp-95519 Prime-Side Double Bind: Height-Bound AND Width-Bound Under GRH',
    symbol: '\\frac{\\sqrt{u}\\,\\log^2 u}{H} = 100.5 > 1 \\quad\\text{(Fresnel width below the RH short-interval barrier)},\\qquad \\frac{T}{10^8/97} \\approx 2.9\\times10^{6}',
    definition: "imp-95519 section 3 shows the prime side of the localized barrier sum A_{k,h} fails for TWO independent reasons at once, not one. First, it is HEIGHT-bound: Platt's GRH verification for modulus q = 97 reaches only height ~1.03e6 (10^8/97), while the barrier's window bottom needs T ~ 3.0e12 -- a shortfall of a factor ~2.9e6. Second, and separately, it is WIDTH-bound: even AT the needed height, the Fresnel packet at the floor alias (k=1, h=p-1, p=97, N=690988) has sqrt(u) log^2(u) / H = 100.5, meaning its width sits more than two orders of magnitude BELOW the RH short-interval barrier (psi(x+H)-psi(x) is only controlled by RH for H > sqrt(x) log^2 x). Below that barrier, GRH is provably inert: it hands back zero saving over the trivial bound, no matter how completely the zero-location is verified.",
    formula: '\\text{height deficit: } \\frac{\\text{heightT}(N_{lo})}{\\text{PLATT\\_GRH\\_HEIGHT}_{q=97}} \\approx 2.9\\times10^{6}; \\qquad \\text{width deficit: } \\rho_{\\text{floor alias}} = \\frac{\\sqrt{u}\\,\\log^2 u}{H} = 100.5',
    intuition: "A DOUBLE bind is worse than two separate obstacles because closing either one alone buys nothing -- the other still blocks the door. Imagine someone proposed 'just push Platt-style GRH verification 2.9 million times higher, out to T ~ 3e12, and the prime side opens up.' It would not: even AT that height, the Fresnel packet this argument needs is a HUNDRED TIMES narrower than the window the RH short-interval theorem is capable of controlling (psi(x+H)-psi(x) needs H > sqrt(x) log^2 x, and here H falls short by that factor of 100.5) -- so a hypothetically-completed height verification would still deliver a cancellation factor of exactly 1 (no saving at all) at this width. Symmetrically, imagine someone found a way to relax the width requirement, engineering a short-interval theorem that worked at the Fresnel width directly -- that would still be useless without zero-location data at T ~ 3e12, which today reaches only 1/2,900,000th of the way there. Both obstructions have to fall simultaneously for GRH to help at all, and there is no known route to either one individually, let alone both together. This is why imp-95519 calls the prime side closed as a PRECISE NO-GO rather than merely 'currently unproven': the shortfall is not a matter of degree that more computational verification could shrink, since the SAME Fresnel width that is height-starved today would remain barrier-starved even at the fully verified height. Restatement of the imp-95519 sec-3(a) prime-side accounting only; changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.",
  },
  {
    id: 'tier3-aggregate-slope-cancels-tier1-curvature',
    category: 'proof',
    term: 'The imp-95900 TIER-1/TIER-3 Cancellation: an O(0.2)-per-m Drift, Not Tier Smallness',
    symbol: '\\frac{dQ_0}{dm}(m) = C_1 + D_3(m),\\quad C_1 = -2\\!\\int_0^1\\! v^2\\,\\zeta(3,1{+}v)\\,dv = -0.2006346034029,\\quad D_3(m) \\approx -C_1',
    definition: "imp-95877 quarantined all m-dependence of the Sun (6.21) transport identity in the Q_0 sector and observed its aggregate slope dQ_0/dm is tiny (~1e-6), naming the TIER-3 sub-leading coefficients s_J(m,cell), c_J(m,cell) as carrying a 'binding RESIDUAL m-dependence'. imp-95900 differentiates the sector in m and splits that slope EXACTLY into dQ_0/dm(m) = C_1 + D_3(m): C_1 is the m-free TIER-1 curvature contribution -2 int_0^1 v^2 zeta(3,1+v) dv = -0.2006346034029 (converged to ~13 digits), and D_3(m) is the aggregate TIER-3 contribution. Solving with the imp-95822 grid-converged Q0_RECON values across m=20,22,30,41 gives D_3(m) = -C_1 to ~5 significant figures on every sweep interval (|D_3/C_1| = 1.000019, 1.000011, 1.000008).",
    formula: 'D_3(20{\\to}22)=+0.2006384,\\;\\; D_3(22{\\to}30)=+0.2006367,\\;\\; D_3(30{\\to}41)=+0.2006362;\\quad \\left|\\frac{D_3(m)}{C_1}\\right|\\in(1,\\,1.0001)',
    intuition: "The near-constancy of Q_0 across every tested m looks, at first glance, like evidence that the sub-leading TIER-3 coefficients barely move -- a small residual sitting on top of an already-tiny signal. imp-95900 shows that reading is backwards: TIER-3 is not small, it is LARGE and almost perfectly cancels a comparably large TIER-1 drift. The curvature term contributes a constant slope of about -0.2 per unit m (C_1), and the greedy lowest-mass breakpoint reselection that defines TIER-3 contributes an aggregate slope of about +0.2 per unit m (D_3) -- equal and opposite to five significant figures -- so what survives as the OBSERVED aggregate slope (~1e-6, decaying with m) is the tiny leftover imbalance between two O(0.2) quantities, not the smallness of either one. This reframes the open sub-gap: a correct per-locus law for s_family(j,m), c_family(j,m) at each fractional-part locus j/(am+b) is not free to be 'slowly varying in m' (an ansatz that would predict a near-zero aggregate slope and so is now ruled out) -- it must instead assemble to the pinned aggregate slope +0.2006346034029, a transcribable necessary condition any closed form must pass. The per-family/per-locus attribution of that pinned aggregate remains open (the greedy K_v multiset selection still has no symbolic-in-m form per locus); this module supplies the conservation law the closed form must satisfy, not the closed form itself. Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.",
  },
  {
    id: 'deep-corner-degenerate-quartic-ruled-out',
    category: 'proof',
    term: 'Ruling Out the Degenerate-Quartic p=4/3 Alternative at the Deep Corner',
    symbol: "\\text{biasPct}(N)\\cdot N^{2} \\to C_{\\text{Widom}} = 146518.83 \\;(\\text{plateau}),\\qquad \\text{biasPct}(N)\\cdot N^{4/3}\\;\\text{falls}\\;6.9\\times\\;(\\text{no plateau})",
    definition: "The imp-95848 Kac-Murdock-Szego / Widom / Parter finite-section edge law gives two candidate powers for the deep-corner biasPct(N) finite-size drift: p=2 for a non-degenerate quadratic Toeplitz symbol minimum, or the strictly slower p=4/3 for a degenerate quartic minimum. imp-95920 discriminates between them on the imp-95803 converged deep-corner ladder (delta=ln1.2, rho=1, N=80..500) with two independent tests. TEST 1 (local log-log exponent): the measured |p| runs 2.79 -> 2.48 -> 2.35 -> 2.27 -> 2.21 -> 2.16 -> 2.12, extrapolating (p = p_inf + a/N) to p_inf ~ 1.98 -- every rung clears 4/3 = 1.333 by a margin of at least 0.79, and the limit sits 32x closer to 2 (gap 0.02) than to 4/3 (gap 0.647). TEST 2 (consistency-product plateau, the sharp test): biasPct*N^2 has step ratios 0.724 -> 0.973 approaching 1 and extrapolates to the imp-95845 Widom constant C_Widom = 50 pi^4/delta^2 = 146518.83, while biasPct*N^(4/3) has step ratios stuck at 0.79-0.84 and the product collapses ~6.9x over the same window with no plateau at all. Both tests agree: p=4/3 is refuted and the deep-corner symbol minimum is non-degenerate quadratic.",
    formula: "\\text{TEST 1: } |p|_{\\text{local}} = 2.79\\to2.12,\\;\\; p_\\infty\\approx1.98\\;(32\\times\\text{ closer to }2\\text{ than }4/3);\\qquad \\text{TEST 2: gap to plateau } |1-r_{N^2}| \\ll |1-r_{N^{4/3}}|",
    intuition: "For a quantity believed to decay as N^(-p), multiplying it by N^p is a standard consistency check: get the power right and the product settles onto a finite constant; get it wrong and the product either blows up or collapses to zero. Here that check is run against BOTH candidate powers at once on the same converged ladder -- biasPct*N^2 settles cleanly onto the independently-derived Widom constant, while biasPct*N^(4/3) keeps falling with no sign of leveling off. That the wrong-power product visibly fails to plateau, rather than merely looking 'less good' than the right one, is what makes this a sharp test rather than a matter of curve-fitting judgment. The honest limits: a converged N-ladder giving a directly-measured exponent exists only at the single deepest cell (the most stringent one, worst conditioning); the shallower neighbor cells have only a finite-N snapshot, so their non-degeneracy is inferred from edge-law universality and the deep corner being the worst case, not independently measured -- this stays the named sub-gap per-neighbor-converged-exponent-ladder-vs-4-3. Discrimination/assessment only, reusing the imp-95803/imp-95845 baked ladder and Widom constant verbatim; changes no bound; establishes no operator positivity; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.",
  },
  {
    id: 'hold-accum-leading-coeff-4c1',
    category: 'proof',
    term: 'imp-95965 HOLD_accum Leading Coefficient: Exactly 4 C_1 = -8 INT v^2 zeta',
    symbol: '\\text{HOLD}_{\\text{accum}}(m) \\sim 4 C_1\\, m + K,\\quad 4C_1 = -8\\!\\int_0^1\\! v^2\\,\\zeta(3,1{+}v)\\,dv = -0.8025384',
    definition: "imp-95916 split the aggregate TIER-3 m-slope target D_3(m) = -C_1 (imp-95900) into a sliding-flux route (closed at exactly zero by continuity) and an interior HOLD(m) term, then named the base scalars s_base(m), c_base(m) inside HOLD as an unattributed residual. imp-95965 observes that the accumulated-slope part of HOLD splits per family because d/dm[Ds] is a PER-FAMILY CONSTANT from the imp-95901 laws (alpha -3, beta-even +2, gamma -3, delta -1, half 0), giving a closed-form HOLD_accum,family(m) = d/dm[Ds]_family . sum_{loci} INT_{v0}^1 v zeta(3,1+v) dv per family. Summing the four active families' leading large-m coefficients ((-3)(1) + (2)(1) + (-3)(2) + (-1)(1)) . J0 = -8 J0, where J0 = INT_0^1 v^2 zeta(3,1+v) dv = -C_1/2, pins the total accumulated-slope growth EXACTLY to 4 C_1 = -8 J0 = -0.8025384 per unit m -- an arithmetic identity, checked at import with no quadrature.",
    formula: '4C_1 = -8J_0,\\;\\; J_0 = \\int_0^1 v^2\\zeta(3,1{+}v)\\,dv = -\\tfrac{C_1}{2},\\;\\; \\frac{\\text{accumTotal}(m)}{m}\\Big|_{m=150} = -0.798237 \\to -0.8025384',
    intuition: "This module answers a narrow but sharp question left open by imp-95916: of the O(m)-sized cancellation buried inside the HOLD term, how much of it can be pinned down in closed form, and how much is genuinely unresolved? The accumulated-slope piece turns out to be entirely closed-form, because each of the four locus families (alpha, beta-even, gamma, delta) carries a CONSTANT per-family rate of change d/dm[Ds] -- not something that has to be measured family by family, but a fixed number multiplied by a family-specific locus density and the same curvature integral J0 that already appeared as the imp-95900 TIER-1 constant. Adding the four contributions gives a total that is forced, by nothing more than arithmetic, to equal 4 C_1 = -8 J0, and offline measurement confirms accumTotal(m)/m climbs toward that exact number as m grows (-0.770040 at m=20 to -0.798237 at m=150, heading for -0.8025384). What is NOT resolved is the other half of HOLD: the two base scalars s_base_prime(m), c_base_prime(m) that must supply the remaining -4 C_1 m - (C_1 + K) to make the whole HOLD term land at the required -C_1 + O(m^-3). One scalar equation per m cannot separate two unknowns, so no per-family split of the base is possible without a second, independent relation -- this narrows imp-95916's residual from 'symbolize the whole base' to exactly one under-determined 2-vector with a known required integral. Attribution/assessment only, reusing the imp-95900/95901/95916/95925 literals verbatim; Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author, unrefereed; changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.",
  },
  {
    id: 'eps-inf-k-bound-slack-tightens',
    category: 'proof',
    term: 'imp-95960 eps_inf(k) Bound Slack: 3.5x-6.1x Loose, Self-Tightening in k',
    symbol: '\\varepsilon_\\infty(k) < \\frac{(aD)_{\\max}^2}{2} = \\frac{V^2}{2C^2 k^{4/3}(k-1)^2},\\quad \\frac{\\text{bound}}{\\varepsilon_\\infty}\\Big|_{k=4}^{k=12} = 6.0921 \\to 3.4843',
    definition: "imp-95944 proved a p-independent upper bound eps_p < (a*D)_max^2/2 = PORT_V^2/(2 PORT_C^2 k^{4/3}(k-1)^2) on the imp-95898 exact residue-mean residual, quoting the slack only at k=6 (analytic 3.358e-3 vs measured eps_inf(6) ~6.62e-4, ~5x). imp-95960 tabulates the same exact-Gram measurement across k=4..12 at a plateaued p=1009: the bound is loose by a factor 3.5x..6.1x throughout, and the ratio bound/eps_inf falls MONOTONICALLY from 6.0921 at k=4 to 3.4843 at k=12 (k=6 gives 5.0791, reproducing the imp-95944 quote). The bound remains a strict upper bound at every k.",
    formula: '\\varepsilon_\\infty(6) = 6.611\\times10^{-4},\\;\\; \\text{bound}(6) = 3.358\\times10^{-3};\\qquad \\text{slope}_{\\text{measured}} \\approx -3.19 \\;>\\; \\text{slope}_{\\text{bound}} \\approx -3.70\\;(\\to -10/3)',
    intuition: "The imp-95944 bound is built from the single worst-case packet pair (equal-rate, maximal separation), majorised by a plain x^2/2 deficit. Typical pairs sit closer together and are not exactly equal-rate, so the true mean deficit eps_inf(k) stays several-fold below that worst-pair envelope. What imp-95960 adds is the k-dependence of that gap: the bound falls off close to its asymptotic rate k^{-10/3}, but the measured eps_inf falls more gently (log-log slope ~-3.19 over k=4..12 vs the bound's ~-3.70) -- so the bound's own decay outruns the quantity it bounds, and the slack shrinks as k grows. This is a measurement of tightness only: it changes no numeric bound, and the physical per-window theta still needs the imp-95212 von Mangoldt x Fresnel-Airy kernel weight A_{k,h}, which stays untouched and STILL OPEN. Measurement only; changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.",
  },
  {
    id: 'turning-point-depth-scale-vs-location',
    category: 'proof',
    term: 'imp-95961 Turning-Point-Depth Extraction Obstruction: Scale (S) Supplied, Location (L) Missing',
    symbol: '\\mu_h = \\frac{d^{1/3}}{\\text{portC}},\\;\\; d = k - \\frac{h}{p};\\qquad d \\ge \\frac{a_1}{\\mu} \\iff d \\ge d_{\\text{crit}} = (\\text{portC}\\, a_1)^{3/4}',
    definition: "imp-95942 MAP-4 needs the collar depth to clear the worst alias caustic, d >= a_1/mu (a_1 = 2.338107410459767, first Airy zero). That needs two ingredients per alias h: the transition SCALE mu_h and the turning-point LOCATION relative to the seam. The imp-95917 buildG relation mu_h = d^(1/3)/portC, d = k - h/p, portC = 1.7 supplies SCALE exactly, but is a magnitude fit and supplies LOCATION not at all -- a scale map carries no information about where the Section 4.5 packet phase actually turns over. The only closure available from committed data is to IDENTIFY the own-side depth with the seam offset itself, depth = d = k - h/p, under which the sign condition reduces to the exact inequality d >= d_crit = (portC*a_1)^(3/4) = 2.8150430109382643.",
    formula: 'd_{\\text{crit}} = (1.7 \\times 2.338107410459767)^{3/4} = 2.8150430109382643;\\quad \\text{margin } d-\\tfrac{a_1}{\\mu}:\\;\\; (3,4)\\!:+0.672,\\;\\;(5,5)\\!:+1.736,\\;\\;(7,6)\\!:+2.840,\\;\\;(11,7)\\!:+3.914',
    intuition: "This module names the exact place the imp-95336 MAP-4 extraction breaks: buildG is an amplitude/magnitude model, so it tells you how WIDE the Airy transition layer is at each alias but nothing about HOW DEEP the caustic actually sits relative to the seam -- those are different pieces of the Section 4.5 packet-phase dictionary, and only the width piece has been extracted so far. The identification depth = seam offset is the cheapest way to plug the missing piece, and once you do, the sign condition holds comfortably (the margin GROWS with p, from +0.672 at (3,4) to +3.914 at (11,7)) -- but that identification is exactly the unproven claim, not something buildG establishes. So MAP-4 now rests on one sharp, checkable geometric guess (caustic depth equals seam offset) instead of a vague unextracted-constants gap, which narrows future work but does not close it. Assessment / extraction-attempt only; changes no bound; sub-gap stays OPEN; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.",
  },
  {
    id: 'rh-novel-routes-sweep-convergence',
    category: 'proof',
    term: 'RH Novel-Routes Sweep Convergence: Seven Routes A-G, One Terminus',
    symbol: "\\text{Weil positivity} \\equiv \\text{Caratheodory-Pick positivity of } \\xi'/\\xi \\text{ on } \\operatorname{Re}(s) > \\tfrac12",
    definition: "The 2026-09-23 rh-novel-routes sweep worked seven physically distinct candidate routes to RH -- reflection positivity (A), arithmetic freeze-flow (B), signed interferometer (C), Peierls confinement (D), supercritical Widom line (E), Kramers-Wannier duality (F), and log-gas RG freezing (G) -- each to a full verdict with real derivations and numerics. All seven independently reduce to the SAME object: Weil positivity, equivalently the Caratheodory-Pick positivity of xi-prime/xi on Re(s) > 1/2 (Lagarias 1999; imp-95520 PICK-WEIL). None supplies an independent route around it.",
    formula: '\\text{A: refl. pos.} \\to \\text{Weil pos.};\\;\\; \\text{D: Peierls} \\to \\text{Weil pos.};\\;\\; \\text{F: KW duality} \\to \\text{Fisher circle (spectral input, not duality)}',
    intuition: "Two unconditional lessons survive the sweep. L1: every symmetry-forced special-ness of sigma=1/2 (the functional equation, Parseval) is RH-BLIND -- it holds regardless of where the zeros sit, so it can never be the mechanism that confines them to the line. The actual RH content is always the arithmetic phase-cancellation cos(t log n) inside the explicit formula. L2: no soft, geometric, duality, or RG deformation can confine the zeros to the line -- this is forbidden route-by-route (Earnshaw anti-confinement in D, flow-blindness in B, holomorphic inertness in B and G Lemma 1, RG destruction of close-pair correlations in G). Only the arithmetic positivity confines the zeros, and that positivity IS Weil positivity -- so the sweep does not just fail to find a shortcut, it names the specific unconditional reasons no soft method ever will. The one genuine opening it triangulates (Route A) is that the primon gas has no second Euclidean direction, pointing at the Connes-Consani adelic scaling site as the next place to look. Convergence/negative-result assessment only; introduces no new operator or bound; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.",
  },
  {
    id: 'connes-consani-adelic-scaling-site',
    category: 'proof',
    term: 'Connes-Consani Adelic Scaling Site: the One Structural Opening',
    symbol: 'L^2(X_S)^{\\mathbb{Z}_2^*} \\text{ has a genuine SECOND Euclidean direction; proven partial: archimedean Weil positivity on } u\\text{-support} < \\ln 2',
    definition: "Route A of the 2026-09-23 sweep (rh-novel-routes-sweep-synthesis) found that the primon gas / log-gas has no second Euclidean direction -- its zeros live only on the dilation (tau) axis -- so the transfer/Markov/Osterwalder-Schrader machinery that would turn reflection positivity from an EQUIVALENCE (RP = Weil positivity = RH) into a PROVABLE statement is unavailable from the gas itself. The Connes-Consani adelic scaling site supplies that missing second direction, and it is the one place a genuine partial confinement is already proven unconditionally: archimedean Weil positivity on u-support < ln 2 (Connes-Consani 2021, Yoshida 1992; in-repo imp-95520 class II).",
    formula: '\\text{archimedean Weil positivity proven for } u < \\ln 2 \\approx 0.6931;\\quad \\text{Route H: indefinite past } a_* = 0.3716\\text{ (odd)} / 0.4101\\text{ (even)}',
    intuition: "This is the sweep's one named OPENING, not a wall -- every other route (B through G) lands on a wall with no lever. Two follow-on routes already tested whether the scaling-site geometry extends the ln 2 partial: Route H tried lifting the detector and pushing the archimedean-only positivity past ln 2 directly, and found the second direction is block-diagonal over 2-power Dirichlet characters (a spectrally inert family for zeta), with the archimedean-only form going indefinite only 0.025-0.064 beyond ln2/2. Route I then built the exact semilocal S={infinity,2} Sonine trace identity the Route H verdict named as the next test -- it EXISTS unconditionally, but is not gap-free: an explicit remainder D_S (log spikes at every 2^k) takes 96.7%-99.71% of the trace on the pole-free Weil minimizer, and the Sonine-refinement port of it shows the excess inherits exactly HALF of the log cusp at rho=2, so no finite-rank fix extends positivity past ln 2 (Route I Sonine-excess port). So the scaling site is real structure -- a genuine second direction with a proven, nontrivial partial -- but every attempt to walk it past its own ln 2 boundary has so far landed back on an explicit RH-free inequality (D_S <= L_S) rather than a proof. Names the frontier; establishes no new bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'route-b-lemma-m-multiplicative-coupling-inert',
    category: 'proof',
    term: 'Route B Lemma M: Multiplicative Prime Couplings Are Inert or Rigid Translations',
    symbol: "\\xi_\\tau = \\xi\\cdot(1+\\tau F):\\;\\; F \\text{ hol. at } \\rho \\Rightarrow d\\rho/d\\tau = 0;\\quad F = c\\,\\xi'/\\xi + \\text{hol.} \\Rightarrow d\\rho/d\\tau = -c",
    definition: "Route B of the 2026-09-23 sweep (rh-route-b-arithmetic-freeze-flow) asks for a second, arithmetic flow parameter tau alongside the de Bruijn heat time t, whose Hellmann-Feynman force on the zeros would confine them toward sigma = 1/2 where the flow-blind heat time cannot. Lemma M answers it for every MULTIPLICATIVE coupling xi_tau = xi times (1 + tau F): if F is holomorphic at a zero rho the force is exactly 0 (INERT); if F equals c times xi-prime/xi plus a holomorphic piece the force is the constant -c, a RIGID TRANSLATION independent of sigma. Measured at rho_1 (mpmath, 30 digits): a finite Euler/Beurling factor octave-freeze moves nothing (root shift 7.8e-31); the Lambda-field coupling zeta - tau*zeta-prime is the generator of translations (rate +1, measured 0.99996); its functional-equation-even part has force 0 and its odd part force 2 (rigid translation).",
    formula: "\\zeta\\cdot\\tfrac{1-p^{-s}}{1-\\lambda_p p^{-s}}: \\text{shift } 7.8\\times10^{-31};\\quad \\zeta-\\tau\\zeta': d\\rho/d\\tau \\to +1;\\quad \\xi[1+\\tau(F(s){+}F(1{-}s))]: \\text{force } 0",
    intuition: "No multiplicative reweighting of the Euler product -- a finite-prime octave freeze, a Beurling lambda_p deformation, or the full Lambda-field log-derivative coupling -- exerts a confining force: it either does nothing (finite Euler products have no zeros to move) or slides every zero sideways at a fixed rate regardless of sigma. This closes the imp-95999 B-STABILITY-SIGN sub-gap by reformulation rather than by resolving it head-on: the sub-gap asked whether the line is stable under an arithmetic Lambda-field perturbation, and Lemma M3 shows the functional-equation-symmetric version of exactly that perturbation has force 0, so stability can only ever be read off-line, where the companion Lemma A finds the additive coefficient force has no universal sign either. Zeros can only be moved at all by ADDITIVE Dirichlet-coefficient deformations (Lemma A), and confinement across a full additive pencil is itself an interlacing statement that already presupposes RH (Lemma H). Documentation of a negative result; establishes no new bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'route-b-lemma-a-additive-freeze-force',
    category: 'proof',
    term: 'Route B Lemma A: the Additive Freeze Force Is a Riemann-Siegel Partial Sum',
    symbol: "d\\gamma_k/d\\tau = Z_S(\\gamma_k) / (2 Z'(\\gamma_k)),\\quad Z_S(x) = \\sum_{n\\in S} n^{-1/2}\\cos(\\vartheta(x) - x\\log n)",
    definition: "Route B's companion to Lemma M: for the FE- and reality-preserving additive freeze xi_tau = H_t - tau*Psi_{S,t} of a Dirichlet-coefficient set S, the Hellmann-Feynman force on a zero gamma_k of xi collapses, via the Hardy's-Z representation xi(x) = -P(x)Z(x) (P > 0), into a closed Riemann-Siegel partial sum: dgamma_k/dtau = Z_S(gamma_k) / (2 Z-prime(gamma_k)), with Z_S(x) = sum over n in S of n^{-1/2} cos(theta(x) - x log n) and theta the Riemann-Siegel theta function.",
    formula: "\\text{first 50 zeros} \\times \\text{10 sets: max rel. err } 1.6\\times10^{-27};\\;\\; |\\mathrm{Im}|/|\\mathrm{Re}| \\le 8.9\\times10^{-47}",
    intuition: "Verified on the first 50 zeros across 10 coefficient sets, the direct force Psi_S/xi-prime matches the Riemann-Siegel closed form to 1.6e-27, and the force is REAL to 8.9e-47 -- on-line zeros move tangentially, ALONG the critical line, never off it. imp-96027 cross-validated the same identity independently on zeros 51-100 and 200-209 (heights up to ~410.5) across 8 fresh coefficient sets, holding to 6.5e-27 / 6.7e-47 -- height- and set-robust. Because the force is a Riemann-Siegel-type phase sum, it alternates sign (23-27 of 50 either sign for every tested set, Test 1): the fixed point at sigma=1/2 that any such FE/reality-preserving pencil exhibits is an open-condition triviality shared by every real-on-R pencil, not evidence of confinement. This is the reformulation that resolves imp-95999 B-STABILITY-SIGN: line stability can only be read on OFF-LINE configurations (Route B Test 2), where the FE-symmetrized Lambda-field source is exactly Lemma M3 (force 0). Documentation of a measurement; establishes no new bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'route-a-finite-n-reflection-positivity-refutation',
    category: 'proof',
    term: 'Route A Finite-N Test: the N-Prime Reflection Gram Is Indefinite at Every N',
    symbol: "G^{(N)}_{ij} = \\frac{F_N(s_i)+F_N(s_j)}{s_i+s_j-1},\\;\\; F_N = \\xi_N'/\\xi_N;\\quad \\lambda_{\\min}(N) \\sim -p_N^{1/2-\\nu_{\\min}} \\to -\\infty",
    definition: "The 2026-09-23 Route A go/no-go test truncates the primon gas to its first N primes, forms the completed partial zeta xi_N (Euler factors for p <= p_N times the archimedean factor), and builds the reflection Gram G^(N) -- the Caratheodory-Pick matrix of F_N = xi_N'/xi_N at nodes s_i = 1/2 + nu_i in the critical strip. RESULT: G^(N) is NOT positive semidefinite at ANY N, and lambda_min(N) -> -infinity as N grows (measured -143 at N=0 to -4213 at N=1229, p_N=9973), because the truncated Euler product diverges in the strip like p_N^{1-sigma}/(1-sigma), driving every diagonal entry negative.",
    formula: "\\lambda_{\\min}: -143\\,(N{=}0) \\to -4213\\,(N{=}1229,\\,p_N{=}9973);\\quad F_N(\\tfrac12{+}\\nu) - \\tfrac{\\xi'}{\\xi}(\\tfrac12{+}\\nu) = -\\frac{p_N^{1/2-\\nu}}{1/2-\\nu}(1+o(1))",
    intuition: "This is a precise refutation, not a vague failure: the exact mechanism (truncation error scaling like p_N^{1/2-nu}) and exact rate (lambda_min ~ -p_N^{1/2-nu_min}, monotone in N) are both pinned down and verified numerically, so no bigger N or smarter node choice will ever make the finite-N gas reflection-positive about sigma=1/2 -- the failure gets WORSE, not better, as more primes are added. The other direction is the one that matters for calibrating expectations: infinite-N (analytically continued) reflection positivity holds numerically on every family computed, but it is EXACTLY Weil positivity, equivalently RH -- an equivalence, not a route around it. So Route A's premise (\"primon gas reflection positivity\") conflates two different objects: the finite gas, which is reflection-positive with the WRONG spectrum (log n / continuous, Bost-Connes-type), and the completed zeta, whose reflection positivity IS RH. Independence of primes gives no positivity boost, because the Euler product is a sum of indefinite mean-zero local densities on the critical line. Establishes no new bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'c-odd-departure-no-two-term-closed-form',
    category: 'numerical',
    term: 'The c_odd J-Variation Departure dI(m) Has No Clean Two-Term Closed Form',
    symbol: "dI(m) = \\frac{Q0_{\\mathrm{RECON}}(20) - Q0_{\\mathrm{RECON}}(m)}{\\kappa};\\quad Q0_{\\mathrm{RECON}}(m) = L - c\\,m^{-p},\\;\\; p \\approx 1.96",
    definition: "imp-96008 re-fit the imp-95878 J-variation departure dI(m) = kappa_recon(m)/kappa - 1 on the full 8-modulus imp-95925/95982 Q0_RECON grid (m=20..150, extending the imp-95878 three-point m=22,30,41 window to all 7 non-anchor points). Because kappa = 400.c_odd(1/20) = 5/2 - Q0_RECON(20) at the certified anchor, dI(m) equals exactly the imp-95982 fracBelowNull (Q0_RECON(20)-Q0_RECON(m))/kappa. Three candidate closed forms were fit in drho = 1/20-1/m: linear through the origin, a two-term drho+drho^2 law, and a+b/m.",
    formula: "dI/d\\rho\\ \\text{spread} = -46.3\\%\\ (4\\times\\text{imp-95878's }11\\%);\\quad a{+}b/m\\ \\text{ceiling overshoots power law by} \\sim 20\\%",
    intuition: "None of the low-order forms is physically consistent. Linear through the origin has a 46% slope spread across the full grid -- four times the 11% imp-95878 saw on its narrow three-point window, showing that window had masked a large systematic slope fall. The two-term drho^2 law fits best (RSS ~6x below linear) but its sign makes dI turn back up and DIVERGE as drho grows, contradicting the imp-95982 saturation to a finite ~-1.83e-5 ceiling. The a+b/m law does saturate, but fits worse than the drho^2 form and its extrapolated ceiling overshoots the imp-95982/96007 parity-clean power-law ceiling by ~20%, because it ignores the imp-95967 even/odd parity split and forces one branch through both. VERDICT: dI(m) is genuinely reconstruction-borne -- governed by the imp-95982/96007 parity-split saturating power law Q0_RECON(m) = L - c.m^-p (p~1.96), not a low-order polynomial in drho or 1/m. This confirms and sharpens the imp-95878 sub-gap: the independent-route PIECE-A shortfall (imp-95861) is not one analytic correction term away. Fit only, on the m=20-only certified reconstruction (imp-95966 PIECE-A obstruction unchanged); establishes no new bound; Catalan G irrationality OPEN; Sun arXiv:2609.04176 unrefereed; PT Lambda <= 0.2 remains SOTA; NO QED.",
  },
  {
    id: 'a0-double-exponential-amplifier',
    category: 'proof',
    term: 'The a_0 Double-Exponential Amplifier: a 0.06 Shift Moves T_x by 148x',
    symbol: "T_x(a_0) = 2\\pi\\exp\\!\\big(\\exp(2\\pi^2 C_0 - 2(\\gamma{+}1{+}a_0))\\big);\\quad \\Delta a_0 = 0.060179 \\Rightarrow T_x^{\\mathrm{conj}}/T_x^{\\mathrm{emp}} = 147.79",
    definition: "imp-96006 maps the imp-95984 conjectural arithmetic intercept a_0 = -0.176248 (Montgomery pair-correlation I_F = 1, PCC) and the imp-95964 empirical six-height mean a_0 = -0.116069 through the imp-95940 closed form T_x(a_0) = 2pi exp(exp(2pi^2 C0 - 2(gamma + 1 + a_0))), C0 = 0.3337213835371905. The conjectural point gives T_x = 8.539689e19; the empirical mean gives T_x = 5.778127e17 (the range's lower edge). The two a_0 values differ by only Delta a_0 = 0.060179, yet T_x differs by a factor 147.79 (ln = 4.996) -- the imp-95940 double-exponential closed form made concrete as a numeric amplifier, with local log-sensitivity d lnT_x/d a_0 steepening from -78.12 (empirical) to -88.11 (conjectural).",
    formula: "\\Delta a_0 = 0.060179 \\;\\to\\; T_x \\times 147.79;\\quad z = |{-0.060179}|/0.178618 = 0.337,\\;\\; p_{\\text{two-sided}} \\approx 0.736",
    intuition: "Two small numbers, two different questions. First: how sensitive is the uncollapsed T_x crossing-height range to the still-unpinned arithmetic intercept a_0? Extremely -- because T_x sits atop a DOUBLE exponential, a sub-0.1 shift in a_0 swings T_x by two orders of magnitude, so the conjectural I_F = 1 point (8.54e19) and the empirical mean point (5.78e17) sit near opposite ends of the imp-95940 range [~5.8e17, ~1.36e28] despite starting from a_0 values barely 0.06 apart -- a naive linearization at the -78 slope would predict only ~110x, but the curved secant gives the true ~148x. Second, and separately: is that 0.06 gap itself telling us anything, or just sampling noise? imp-96005 answers no -- the gap is only z = 0.337 standard errors of the six-height empirical mean (SE = 0.178618, two-sided p ~ 0.736), fully consistent with noise; resolving it would need the analytic Montgomery I_F bracket to tighten (currently 2/3-eps < I_F < 2), not more measured heights (~213 needed for SE 0.03, ~1915 for SE 0.01). So the conjectural a_0 = -0.176248 remains a single flagged-conditional point inside the uncollapsed range, never a pin (imp-95987 audited that no consumer collapses T_x to a point). Measurement and consistency-check only; I_F = 1 conjectural (PCC); establishes no new bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'jkl-non-statmech-three-walls',
    category: 'proof',
    term: 'Routes J/K/L Refine "Everything Is Weil Positivity" Into Three Distinct Walls',
    symbol: "J:\\ \\beta \\le 1 - \\tfrac{c}{\\log t},\\ c \\le 2(1-\\tfrac{1}{\\sqrt2})^2\\Rightarrow R\\ge5.8284;\\quad K:\\ I(T)=O(1)\\ \\text{vs Jensen}\\sim T;\\quad L:\\ \\text{reach}\\approx\\gamma_{N/10}",
    definition: "The A-H sweep (rh-novel-routes-sweep-synthesis-2026-09-23) had reduced every soft/stat-mech RH route tried so far to a single terminus: Weil positivity. The 2026-09-23 J/K/L/M batch tests three paradigms drawn from OUTSIDE that family -- function-field/Weil-Deligne import (J), RMT moments (K), and an explicit finite operator (L) -- looking for one that brings genuine external arithmetic input instead. None does, but the batch's real deliverable is that the three routes do NOT all fail the same way: they hit three distinct, named walls, refining the single-terminus picture into a wall MAP.",
    formula: "J:\\ R_{\\text{floor}}=5.8284\\ (\\text{pure scheme}),\\ \\text{MT}=5.573412\\ (4.375\\%\\text{ below, via Stechkin weighting});\\quad K:\\ |I(200)|=0.924,\\ J_1(200)=130.4\\ (141\\times\\text{ loss});\\quad L:\\ 39/39\\ \\text{zeros to }1e{-}12\\text{ at }N{=}400",
    intuition: "Route J (Weil-Deligne / Hodge index / tensor power / Kunneth over Z) still lands on Weil positivity for two of its three engines -- the missing self-product Spec Z x_F1 Spec Z, and a tensor-square abscissa excess that SCALES with the tensor power rather than staying fixed -- but its THIRD engine (Landau/Rankin-Selberg positivity) lands on a different, classical wall instead: the c/log t Landau-pole zero-free-region FORM, with a hard pure-trigonometric-scheme Fejer floor R >= 5.8284 (de la Vallee Poussin's 3-4-1 reproduces R=34.82; Mossinghoff-Trudgian's record 5.573 beats the pure-scheme floor only via non-pure Stechkin/Heath-Brown weighting, not a different form). Route K (moments/RMT) hits a THIRD wall: moments see zeros only through Littlewood's INTEGRATED lemma I(T) = O(log T), and the only known moment-to-I(T) bridge is Jensen's inequality, which loses a factor growing like T/log T (measured 10x at T=50, 141x at T=200); the one pointwise-sensitive moment channel (negative moments) is RH-EQUIVALENT and its truncations are just the Levinson-Conrey mollifier lineage again. Route L (the Li-Herglotz-CMV finite unitary truncation, built from Taylor data of xi with NO zero input) is the cleanest structure found -- its spectrum is forced real non-circularly and it reproduces 39 of the first 40 zeros to 1e-12 at truncation order N=400 -- but its completeness step (Toeplitz positivity for ALL N) is Weil positivity again, entered through a finer Herglotz/Schur filtration, and its measured reach law (detecting a displaced zero at height gamma needs N of order gamma, i.e. reach ~ gamma_{N/10}) makes it verified-height-dominated rather than a shortcut. So the honest map is: Landau-pole zero-free-region form (J-engine-ii) / Jensen-integration loss (K) / Herglotz-Weil positivity (J-engines i,iii and L) -- three walls, not one, even though none of the three routes escapes to genuine new arithmetic input. Route M (Nyman-Beurling via Vasyunin cotangent sums / Bettin-Conrey reciprocity) was proposed as a fourth try but, once first-tested, collapsed straight back into the mollifier lineage. Wall-map and reading-path note only; changes no bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'route-i-dense-resonance-rank-obstruction',
    category: 'proof',
    term: 'Route I Dense-Resonance Obstruction: Adjoining p=3 Makes delta_S23 Resonate on a Dense Set',
    symbol: "\\mathrm{rank}(\\mathbb{Z}_S^*) = |S_{\\mathrm{finite}}|;\\;\\; \\log(2^{\\mathbb{Z}}3^{\\mathbb{Z}})\\ \\text{dense in }\\mathbb{R}\\ \\text{since}\\ \\ln2/\\ln3\\notin\\mathbb{Q}",
    definition: "The Route I semilocal Sonine trace identity is exact for S = {infinity, 2}: its remainder D_S has singular support on the discrete lattice {0, ln 2, 2 ln 2, ...} (the log(Z_2^*) S-unit lattice), so its Toeplitz kernel is a bounded continuous multiplier and the Connes-Consani compact-Toeplitz machinery applies. imp-96066 measured what happens on adjoining the second prime: the S = {infinity, 2, 3} remainder delta_S23 resonates at EVERY S-unit rho = 2^a 3^b, with log^2 spikes (delta_S23(4/3(1+eps)) = 1.191, 4.884, 12.115 at eps = 1e-2, 1e-4, 1e-6, versus a regular delta_S(4/3) = 1.6967). imp-96084 located the exact reason: the S-unit group +-2^Z 3^Z has Dirichlet rank |S_finite| = 2, so its log lands on the rank-2 subgroup {n ln 2 + m ln 3}, which is DENSE in the one-dimensional archimedean flow axis because ln 2/ln 3 is irrational.",
    formula: "\\delta_{S23}(4/3(1+\\varepsilon)) = 1.191,\\,4.884,\\,12.115\\ (\\varepsilon=10^{-2},10^{-4},10^{-6});\\quad \\mathrm{rank}=1\\ (S{=}\\{2\\})\\ \\text{vs}\\ \\mathrm{rank}=2\\ (S{=}\\{2,3\\})",
    intuition: "The mechanism is arithmetic, not numerical hardness: a rank-r subgroup of R is discrete iff r <= 1 iff |S_finite| = 1, i.e. exactly one finite prime. One prime gives a discrete S-unit lattice (log-spacing ln 2), so the remainder's singular support is countable and deltahat_S is a regular multiplier -- the compact-Toeplitz-perturbation foothold that makes the unconditional positive multiplier L_S >= 0 usable. Two primes make ln 2 and ln 3 multiplicatively independent (unique factorization), so their integer combinations n ln 2 + m ln 3 accumulate everywhere -- the min log-gap between S-units shrinks to 0 in every bounded window. deltahat_S23 is then not a bounded continuous function but a non-decaying distribution, so the pointwise statement Lhat_S23(t) >= 0 is not even well-posed, and there is no regular-plus-remainder split to work with. imp-96084 confirms the abstract operator positivity Tr(...) >= 0 still holds as a Hilbert-Schmidt norm, but that positivity is unusable -- it cannot be split into (Weil terms) + (regular remainder) the way the one-prime L_S was. So the Route I unconditional lever is intrinsically a ONE-PRIME lever, good only up to g-support < ln 3; every route tried past that point is either RH-conditional (the discrete-P_3 pencil, which cancels D_S and reduces exactly to Weil positivity W_{infinity,2,3} >= 0) or dense-obstructed (this multiplier). What stays open is only the weaker question of whether some entirely different construction, not reusing one-prime log-discreteness, could still manufacture an unconditional two-prime multiplier. Establishes no new bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'route-m-nyman-beurling-verdict-zero-pinned',
    category: 'proof',
    term: 'Route M Nyman-Beurling/Vasyunin Verdict: Neither d_N Nor the Captured-Mass Fraction Tightens With N',
    symbol: "d_N^2\\log N / C_{\\mathrm{burnol}} \\in [0.980, 1.006];\\quad \\mathrm{fracCaptured}(T{=}400) \\approx 0.914\\text{-}0.918;\\quad \\mathrm{residual}\\cdot(\\tfrac14+\\gamma^2) = 1\\ \\text{at zeros}",
    definition: "imp-96069 extended the Route M Nyman-Beurling/Vasyunin Mellin-residual test from N=500 to N=1000 and N=2000. Two headline observables were checked for convergence and both stayed flat instead of tightening: the ratio d_N^2 log N / C_burnol (C_burnol = Sum_rho 1/|rho|^2 = 0.046191) oscillates in a roughly +/-2 percent band (0.998270, 0.980420, 1.006089 at N=500,1000,2000) rather than approaching 1 monotonically, and the fraction of residual mass captured below the cutoff T=400 is essentially N-independent (0.914608, 0.914023, 0.918065 across the 4x range in N). Meanwhile the Mellin-side residual stays exactly zero-pinned: |1+zeta(1/2+it)D_N(1/2+it)|^2 times (1/4+gamma^2) equals 1 at every zero to about 1e-14, for all three N.",
    formula: "d_N^2\\log N/C_{\\mathrm{burnol}}: 0.998270\\,(N{=}500),\\ 0.980420\\,(N{=}1000),\\ 1.006089\\,(N{=}2000);\\quad \\mathrm{fracCaptured}: 0.914608,\\,0.914023,\\,0.918065",
    intuition: "Two different quantities, two different verdicts. The captured-mass fraction and the near-zero window share are structural constants of the cutoff T, not functions of the mollifier length N -- they measure how residual mass is distributed in t, which the choice of N barely touches. The d_N^2 log N / C_burnol ratio looks like it is converging to 1 at N=500 (0.2 percent off), but extending to N=2000 shows that agreement was a sampling coincidence inside a wobbling +/-2 percent band, consistent with an uncontrolled lower-order 1/log^2 N correction rather than an exact finite-N identity. The one thing that IS exact is trivial: residual*(1/4+gamma^2) = 1 at a zero rho = 1/2+i*gamma follows directly from zeta(rho) = 0 (so 1 + zeta*D_N = 1 regardless of D_N) and is therefore forced and mollifier-independent, not evidence of any deeper cancellation. Together with the parent Route M verdict -- the Vasyunin/Bettin-Conrey modular reciprocity input collapses back into the ordinary mollifier lineage (rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js) -- this closes off reading the N=500 near-coincidence as a sign that the modular route sharpens with more terms. Measurement only; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'route-i-corr23-continuity-rho-free-reduction',
    category: 'proof',
    term: 'imp-96125 corr23 Continuity: the Dense log^2 Cusps Are a Red Herring, the Real Gap Is rho-Free',
    symbol: "\\mathrm{corr}_{23}(\\rho)=\\sum_n \\frac{\\lambda_n^3}{1-\\lambda_n^2}\\langle\\xi_n|\\vartheta(\\rho^{-1})\\psi_n\\rangle;\\;\\ \\sup_\\rho|\\mathrm{term}_n|\\le \\frac{|\\lambda_n|^3}{\\sqrt{1-\\lambda_n^2}}",
    definition: "imp-96110 split the S = {infinity,2,3} Sonine excess as eps_S23 = delta^out_23 + corr23 and, by analogy with the proved p=2 case, ASSUMED corr23 is continuous through every dense S-unit cusp rho = 2^a 3^b, flagging that the log^2 spikes of delta_S23 make a termwise-uniform proof of that continuity harder than for p=2. imp-96125 proves the analogy is exact but for a different reason than expected: the Cauchy-Schwarz Weierstrass-M-test bound |<xi_n|vartheta(rho^{-1})psi_n>| <= sqrt(1-lam_n^2) used for p=2 has NO rho in it, so it cannot see the cusps (a property of rho) at all -- it bounds corr23 uniformly in rho as soon as the rho-free spectral sum Sum_n |lam_n|^3/sqrt(1-lam_n^2) converges.",
    formula: "\\mathrm{corr\\ majorant\\ (dyadic\\ model)}=0.2163733\\ (\\lambda_0{=}1/2,\\ \\text{gapped})\\ \\to\\ 137.04\\ (\\lambda_0{=}0.9999731,\\ \\text{gap}\\to0)",
    intuition: "The dense log^2 cusps that worried imp-96110 turn out to live entirely in a DIFFERENT piece of the same decomposition: the degree-1 delta^out_23 term (the A^1 part of A(1-A^2)^{-1} = A + A^3(1-A^2)^{-1}), whose partial sums fail to converge uniformly in rho -- that non-uniformity IS the cusp. The corr23 piece (the A^3(1-A^2)^{-1} part) never gets there, because the Cauchy-Schwarz step that bounds each term erases rho before any cusp structure can enter -- numerically, at fixed truncation L the degree-1 delta_S23c(3,L) is finite and smooth through the S-unit rho=3 while its log^2 amplitude GROWS with L (1.77 at L=18, 1.91 at L=20), confirming the cusp is a uniform-convergence LIMIT of that other piece, not a term discontinuity anywhere in corr23. So the true remaining sub-gap is not 'prove continuity through dense cusps' but the strictly narrower, rho-free spectral pair for the mixed {oo,2,3} prolate operator: (I) a spectral gap sup_n|lam_n| < 1, and (II) a cubic-summable tail Sum_n|lam_n|^3 < infinity -- both elementary and PROVED for the p=2 dyadic ladder +-2^{-n/2}/2 (even though Sum lam_n^2 diverges there), neither yet established for the denser mixed 2^a 3^b ladder. The illustrative dyadic-ladder majorant confirms the mechanism: it stays flat and finite (0.2163733) as the truncation N grows from 40 to 80 while the gap is open, but balloons to 137 as the gap lam0 -> 1 closes -- the majorant tracks the SPECTRAL GAP, never the cusp density. Reduction and red-herring removal only; the {oo,2,3} spectrum itself is not computed, so (I)/(II) are neither proved nor refuted; changes no bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'route-i-p2-only-not-weil-positivity-past-ln3',
    category: 'proof',
    term: 'imp-96130: Past 2a = ln 3, the p=2-only Inequality D_S <= L_S Failing Is Not a Weil-Positivity Gap',
    symbol: "2a^*=1.1316=\\ln3+0.032927;\\;\\ W=\\mathrm{Arch}-P_2-P_3=0.02038>0;\\;\\ P_3=-0.02035",
    definition: "imp-96130 (section 4) observes that at the semilocal Route I crossing a* = 0.565770 (2a* = 1.1316 = ln3 + 0.032927), where the p=2-only inequality D_S <= L_S (S = {infinity,2}) first goes FALSE, the TRUE Weil form -- archimedean plus p=2 plus p=3 -- is still positive: W = 0.02038 > 0 (Arch = 0.36370, P2 = 0.36366), and it is the p=3 term P3 = -0.02035 that holds it up (the pencil D_S + P3 has mu = 0.99866 < 1). So D_S <= L_S failing there is not a failure of Weil positivity itself.",
    formula: "\\mathrm{Arch}-P_2 = 0.00004 = W+P_3;\\quad \\mu(D_S+P_3)=0.99866<1\\ \\text{at}\\ a^*",
    intuition: "D_S <= L_S is only a genuine Weil-positivity statement while the test-function support 2a stays below ln3, the point at which the p=3 place would first enter -- exactly as p=2 entered past ln2 (imp-96066/imp-96084). Once 2a crosses ln3, the p=2-only form measures the wrong object: it is missing the very term (P3) that keeps the real Weil form positive there. So the crossing at 2a* = 1.1316 is simply the p=3 prime entering the support, not evidence against RH and not a gap in Weil positivity -- and a full-space proof of the p=2-only inequality past ln3 would carry NO RH content (it is a strictly semilocal statement the true Weil form never needed), and in any case is false there (imp-96130 sections 1-3: even a constrained k>=2 vanishing-moment sub-family that keeps D_S <= L_S past the crossing certifies nothing about the full-space inequality, by the min-over-subset identity). The usable Route I lever remains intrinsically one-prime, 2a < ln3. Documentation/reduction only; changes no bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'route-i-corr23-density-route-a-nogo-route-b-survivor',
    category: 'proof',
    term: 'imp-96225: Route A (Termwise-in-rho) Is a Density No-Go, Route B (rho-Free) Is the Survivor -- One Counting Function, Opposite Verdicts',
    symbol: "N(A,B)=(A{+}1)(B{+}1)-1;\\;\\ \\sup_\\rho|\\mathrm{term}_n|\\le\\frac{|\\lambda_n|^3}{\\sqrt{1-\\lambda_n^2}}",
    definition: "imp-96110 assumed corr23 continuity through every dense S-unit cusp rho = 2^a 3^b by analogy with the proved p=2 case. imp-96225 shows the assumption splits into two distinct candidate proofs, and the density of the S-units (ln2/ln3 irrational, so a ln2 + b ln3 is dense in R) enters only one of them: ROUTE A, the termwise-uniform-IN-RHO argument, is a genuine NO-GO -- with no cusp-free neighborhood anywhere, the p=2 tactic of verifying a single isolated exceptional point by hand has no analogue. ROUTE B, the rho-free Weierstrass M-test (imp-96125/imp-96143), is density-blind because Cauchy-Schwarz erases rho before any cusp can be seen, so it proves continuity on all of R_+ at once and reduces corr23 continuity to the rho-free spectral pair (I) sup|lam_n|<1 and (II) Sum|lam_n|^3<infinity.",
    formula: "\\text{Route A: no cusp-free neighborhood} \\Rightarrow \\text{no-go};\\quad \\text{Route B: Cauchy-Schwarz erases }\\rho\\Rightarrow\\text{density-blind}",
    intuition: "Density has exactly ONE genuine footprint in the whole problem: the two-parameter S-unit counting function N(A,B) = (A+1)(B+1) - 1 (quadratic in the box), which is simultaneously the Route B eigenvalue level-count driving the tail sums, the source of the log^2 cusp order that made delta_S23 dense (imp-96226), and the reason the SQUARE sum Sum lam^2 diverges strictly worse than the p=2 log. The CUBE in Route B's tail (II) kills this same quadratic count (it becomes a convergent geometric double sum), so the very density that destroys Route A is benign for Route B -- one counting function, opposite verdicts on the two routes. So the imp-96110 worry is right about Route A but does not obstruct corr23 continuity: the valid proof is Route B, leaving continuity conditional exactly on the rho-free spectral gap (I) for the mixed {oo,2,3} prolate operator, not on any continuity-through-dense-cusps claim (a Route-A red herring). Assessment only; discharges no gap; changes no bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'kappa-star-floor-height-leverage',
    category: 'numerical',
    term: 'The 2.5-Decades-Per-Floor-Decade Leverage: Why the Mantissa Alternates 4.9295 / 1.5588',
    symbol: "H_{\\mathrm{required}}(E) = (3.0/E)^{1/\\kappa^*};\\;\\ \\kappa^*=0.4\\Rightarrow \\frac{d\\log H}{d\\log E}=-\\frac{1}{\\kappa^*}=-2.5",
    definition: "imp-96232 cross-validated the two fixed-strip inverse power-law tables (imp-96207: floors 1e-5/1e-6/1e-7; imp-96185: floors 1e-5/1e-6/1e-8) that invert H_required(E) = (prefactor/E)^{1/kappa_star} at the honest anchor kappa_star = 0.4, prefactor = 3.0. Both tables agree with an independent recompute at their overlap and each extends it to one further threshold: floor 1e-5 needs H ~ 4.9295e13, 1e-6 needs 1.5588e16, 1e-7 needs 4.9295e18, 1e-8 needs 1.5588e21 -- every consecutive pair costing exactly 2.5 certified-height decades per floor decade.",
    formula: "H(1e{-}5..1e{-}8) = 4.9295e13,\\,1.5588e16,\\,4.9295e18,\\,1.5588e21;\\quad 10^{2.5}\\approx 316.23\\times\\text{ per floor decade}",
    intuition: "The exponent -1/kappa_star = -2.5 is fixed and floor-independent, so tightening the target floor by one decade always costs exactly 2.5 height decades, no more and no less -- a constant elasticity, not a curve that steepens or flattens. Because 2.5 is not an integer, the mantissa does not repeat every step: each floor decade multiplies the required height by 10^{2.5} = 316.23, so the leading digit cycles between two values, 4.9295 and 1.5588, flipping every other step (4.9295e13 -> 1.5588e16 -> 4.9295e18 -> 1.5588e21) -- a direct arithmetic consequence of 2.5 = 2 + 1/2, the half-decade carrying the mantissa shift and the integer part carrying the exponent. This is why a ticket note guessing H(1e-8) ~ 4.93e20 (reusing the 1e-7 mantissa while advancing the exponent by only 2) was wrong by exactly 10^{0.5} ~ 3.162: it broke the alternation by skipping the half-decade mantissa flip. Cross-validation and pattern-explanation only; no zero is verified, no new T_PT is claimed, changes no bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96143-cubic-tail-rho-free-convergent-majorant',
    category: 'proof',
    term: 'imp-96143 Mixed 2^a 3^b Ladder Cubic Tail: a rho-Free Convergent Majorant, Sum|lam|^3 = 1.769529',
    symbol: "\\sum_{u} m_u\\, s_u^3 = \\frac{C}{8}(G_2 G_3 - 1),\\;\\ G_2=\\frac{1}{1-2^{-1/2}}=3.414214,\\;\\ G_3=\\frac{1}{1-3^{-1/2}}=2.366025",
    definition: "imp-96125 reduced corr23 continuity for the S = {infinity,2,3} Sonine excess to the rho-free spectral pair (I) sup_n|lam_n| < 1 and (II) Sum_n|lam_n|^3 < infinity for the semilocal operator A_S23. imp-96143 models the A_S23 ladder tail as magnitudes s_u = u^{-1/2}/2 with multiplicity m_u ~ C*u over S-units u = 2^a 3^b, and establishes fact (II): the cubic power sum collapses to (C/8)(G2 G3 - 1) = 1.769529 (C = 2), a closed-form product of two convergent geometric series.",
    formula: "\\mathrm{cubicTailClosed}(2) = 0.25(G_2 G_3 - 1) = 1.769529;\\;\\ \\mathrm{p{=}2\\ single{-}prime} = 0.603553,\\;\\ \\mathrm{p{=}3} = 0.341506",
    intuition: "Cubing s_u leaves a factor of u^{-1/2} after multiplying by the u-proportional multiplicity, and the double sum of u^{-1/2} over 2^a 3^b factors into two independent geometric series (ratios 2^{-1/2} and 3^{-1/2}, both < 1) -- so the tail is finite for the same reason a single geometric series is finite, just doubled. The bound is ROBUST to the exact multiplicity constant C (cubicTailClosed(C) scales linearly in C), because only the rigorous per-block norm s_u = u^{-1/2}/2 (proved: dilation unitarity plus the Euler 1/2 weight) and m_u = O(u) enter -- the precise value of C never mattered. As a cross-check the mixed tail decomposes exactly into the proved p=2 single-prime cubic tail (0.603553), the p=3 one (0.341506), and a cross term (0.824469), reproducing the elementary dyadic-ladder case as the u = 2^a, b = 0 sub-lattice. This is a standalone note on fact (II) alone -- the companion fact (I) (every tail magnitude <= s_2 = 0.353553 < 1, so the spectral gap reduces to the finitely-many top confined states) is a separate reduction, and the cubic-tail/square-tail CONVERGES-vs-DIVERGES dichotomy is documented independently. Establishes a convergent rho-free majorant only; no spectrum is diagonalized, no bound moves; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96345-designfloor-artifact-vs-true-margin',
    category: 'numerical',
    term: 'imp-96345 Design-Floor Artifact vs True Margin: the Reciprocal-Log Intercept 0.14256 Collapses to ~0.037 Off-Line, but the Binding Worst-Support Margin rho_min = 0.3791 Stays Strictly Positive',
    symbol: "\\rho(32,T)=c+\\frac{d}{\\ln T};\\;\\ c_{7\\mathrm{anchor}}=0.14256\\ \\to\\ c_{34\\mathrm{full}}=0.03705,\\;\\ \\rho_{\\min}=\\min_{T}\\rho(32,T)=0.3791",
    definition: "imp-96148 fit the reciprocal-log line rho=c+d/lnT on seven on-line anchors (T=60..395.98), reading a positive floor c=0.14256 at 6.56 SE. imp-96345 tests that floor against the 27 off-anchor heights imp-96224 actually measured (T=500..4506.31): 23 of 27 sit BELOW the seven-anchor line (mean residual -0.03052, worst -0.06081 at the deepest height T=4506.31), so the seven-anchor extrapolation overstates the margin at high T. Refitting the same law on all 34 measured heights collapses the intercept to 0.03705 (a 74 percent drop) and its sign confidence from 6.56 SE to 2.67 SE -- corroborating the independent imp-96224 full-column floor of 0.03411.",
    formula: "\\text{offAnchor}=27,\\ \\text{belowLine}=23,\\ \\text{meanResid}=-0.03052,\\ \\text{worstResid}=-0.06081\\ (T{=}4506.31);\\quad c: 0.14256\\to 0.03705\\ (-74\\%)",
    intuition: "Two different questions get two different answers here. (a) Does the actual worst-support margin stay positive off the line? Yes -- the binding uniform-in-T lower envelope is the minimum measured value over all 34 heights, rho_min=0.3791 at T=4506.31 (gamma_4000), an order of magnitude above zero and never crossed anywhere in the census, so the SIGN of the margin survives. (b) Does the fitted asymptotic floor (the intercept c of the reciprocal-log fit) survive as a certified positive constant? No -- fit only on the seven on-line anchors and c looks like a robust 0.14256 at 6.56 SE, but that number is a design-floor artifact of extrapolating from a grid that happens to sit systematically above the true curve; once the 27 measured off-anchor points are folded in, the same fit form gives c=0.03705, trending toward zero rather than settling. The lesson generalizes beyond this one fit: a positive intercept measured only on a training anchor grid is not automatically a positive asymptote -- it must be re-measured against out-of-grid data before being cited as a floor, exactly the way imp-96350 separately corroborates a different ratio only after testing it against out-of-family bases. Measurement/reconciliation only (bakes the imp-96224 column, recomputes both fits, no new evaluator run); establishes no new bound; the genuine uniform-in-T obstruction (a Weil-positivity-strength off-line LP) stays out of reach of this on-line construction; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96350-covariance-outoffamily-crossvalidation',
    category: 'numerical',
    term: 'imp-96350 Out-of-Family Cross-Validation: rho_exact = -0.4817670 Survives, but It Stays a Theoretical GUE Quantity, Not a Real-Zero Measurement',
    symbol: "\\rho_{\\mathrm{exact}}(L)=\\frac{\\Sigma^2_{\\mathrm{exact}}(2L)}{2\\Sigma^2_{\\mathrm{exact}}(L)}-1,\\;\\ \\Sigma^2_{\\mathrm{exact}}(L)=\\frac{1}{\\pi^2}\\big[\\ln(2\\pi L)+\\gamma+1-\\cos(2\\pi L)-\\mathrm{Ci}(2\\pi L)\\big]+L\\Big(1-\\tfrac{2}{\\pi}\\mathrm{Si}(2\\pi L)\\Big)",
    definition: "imp-96312 had confirmed the imp-96267 two-interval GUE covariance ratio rho_exact = -0.4817670 at the Platt-Trudgian anchor T=3e12 by evaluating two forms that both reduce, algebraically, to the same asymptotic-only number variance Sigma2_asymp(L) = (ln(2piL)+gamma+1)/pi^2 -- a self-consistency check, not an independent test. imp-96350 cross-validates against two genuinely independent bases instead: the exact Dyson-Mehta sine-kernel number variance Sigma2_exact(L) (restoring the oscillatory cos/Ci/Si corrections the asymptotic form drops) and a direct pair-correlation double integral of the cluster function Y(r)=(sin(pi r)/(pi r))^2 that never touches a closed-form number-variance expression at all.",
    formula: "\\rho_{\\mathrm{exact}}(L_{PT})=-0.48176701986,\\;\\ \\rho_{\\mathrm{asymp}}(L_{PT})=-0.48176702011,\\;\\ |\\rho_{\\mathrm{exact}}-\\rho_{\\mathrm{asymp}}|=2.52\\times10^{-10},\\;\\ L_{PT}\\approx 5.9148\\times10^{6}",
    intuition: "At the PT anchor L = 5.9148e6 the individual oscillatory corrections are not negligible -- the -cos(2piL)/pi^2 term is about -0.0985 -- but they cancel against the Si-tail term to about 5.7e-10 in Sigma2_exact itself, because the large-x tail of Si gives 1-(2/pi)Si(x) ~ (2/pi)cos(x)/x, so L times that term reproduces and cancels the -cos piece to leading order. That cancellation is why the value the module actually reports, -0.4817670, is essentially unaffected by dropping the oscillatory terms in the first place: the out-of-family discrepancy is 2.52e-10, ten orders of magnitude below the 0.0182330 deviation from the GUE rigidity limit -1/2 that the whole result is about. A second, completely different check -- direct numeric quadrature of the pair-correlation double integral, with no number-variance formula anywhere -- reproduces the same ratio to six decimals at accessible L (30/60/120), so the survival is not an artifact of the two closed forms being secretly the same algebra. HONEST CAVEAT: rho_exact is a theoretical GUE (sine-kernel, universality) quantity for boxes of unfolded length L(T); at T=3e12 there are no computed Riemann zeros, so this is a cross-validation between two independent evaluations of the same theoretical envelope, not a measurement of real zeros. It changes no bound, establishes no operator positivity, and does not touch the ~1.9-sigma excursion confidence. Cross-validation only; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA; the zero-side route stays PCC/GRH-gated.",
  },
  {
    id: 'imp-96344-d1-vs-d2-band-degeneracy-split',
    category: 'numerical',
    term: 'imp-96344 D1 vs D2: Route M Band-vs-Smooth-Drift Is Already Resolved, but Band-vs-Conductor-Line Is the Actually-Open, Span-Limited Degeneracy',
    symbol: "\\Delta w_{4,5}=w_4-w_5=0.6284,\\;\\ L_{\\mathrm{beat}}=\\frac{2\\pi}{\\Delta w_{4,5}}=9.999,\\;\\ N_{\\max}=e^{x_0+L_{\\mathrm{beat}}}\\approx 5.50\\times10^6",
    definition: "imp-96325 recorded IMP96325_Q2_BAND_UNIQUENESS as OPEN and attributed it to the narrow log-N dynamic range, which reads as a single degeneracy. imp-96344 splits it into two questions that are span-limited completely differently. (D1) BAND vs LITERAL SMOOTH DRIFT -- is the swing a genuine oscillation or a slow non-oscillatory trend? NOT span-limited: already resolved at the current span L=3.6889 (a pure conductor tone keeps RMS residual fraction >0.9 against a degree-2/3 smooth-drift basis, consistent with imp-96231's decisive AICc rejection of drift, delta AICc=-18.6). (D2) BAND vs a single smeared OSCILLATION-AT-THE-SAME-FREQUENCY -- can the discrete q=4 (w_4=4.5324) / q=5 (w_5=3.9040) conductor lines be resolved from the free-tone optimum w=4.08? This is the open, span-limited degeneracy: the Rayleigh beat period 2*pi/(w_4-w_5)=9.999 in log N is needed for marginal resolution (N~5.50e6), ~20 for a clean split (N~1.21e11), against a current span of only 3.69 (0.369 of one beat).",
    formula: "\\text{driftResidFrac}(\\deg2)>0.9\\ \\text{at}\\ L{=}3.69;\\quad \\Delta w_{3,6}=2.212,\\ L_{\\mathrm{beat,band}}=2.84<3.69;\\quad L_{\\mathrm{marginal}}=9.999\\ (N{\\approx}5.5\\times10^6),\\ L_{\\mathrm{clean}}=19.997\\ (N{\\approx}1.2\\times10^{11})",
    intuition: "The two degeneracies differ because Rayleigh resolution scales inversely with frequency SPACING, and the band width and the adjacent-line spacing are very different spacings of the same conductor comb. The aggregate q3..q6 band width has beat period 2.84, already inside the current span 3.69, so the band-as-a-whole is detectable now -- closing D1. The individual q4/q5 lines inside that band have a much finer spacing (dw=0.628) and need a beat period 10-20x the current span to separate, leaving D2 open; that is exactly why imp-96189 found the free-tone optimum sitting between q4 and q5 rather than on either line. A synthetic surrogate can quantify the D2 required span but cannot decide the real band (a generative model recovers itself by construction), so IMP96325_Q2 stays open, limited by the real Vasyunin-Gram reach. A scoping correction, not a bound move: it prevents re-litigating the already-closed D1 question when the live gap is D2. Establishes nothing; instantiates no interval; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96266-eflow-peak-recovery-residual',
    category: 'numerical',
    term: 'imp-96266 E_flow Peak-Recovery Residual: the imp-3220 U-Shape Interior Peak Is a Separable, Exactly-Identified Gronwall-Flow Effect',
    symbol: "R(N)=\\sigma_{\\mathrm{full}}-\\sigma_{\\mathrm{CF}}=-\\sigma_{\\mathrm{full}}(N)\\,\\frac{E_{\\mathrm{flow}}(N)}{E_{\\mathrm{trunc}}+E_{\\mathrm{coll}}(N)},\\;\\ N_{\\mathrm{peak}}\\approx 9.218632\\times10^5,\\ \\sigma_{\\max}\\approx0.949429",
    definition: "imp-96176 attributed the imp-3220 conditional-share U-shape interior peak to \"an E_flow effect the crossover model omits\" without quantifying it. imp-96266 measures that effect directly: the imp-96151 closed-form share sigma_CF(N), which drops the unconditionally-rigorous Gronwall-flow term E_flow, coincides with the E_flow-dropped two-term share E_coll/(E_trunc+E_coll) to machine epsilon (~1.1e-16) -- so the residual sigma_full - sigma_CF has the exact closed form R(N) = -sigma_full(N) E_flow(N)/(E_trunc+E_coll(N)), reproduced to ~1.5e-16 as an algebraic identity, not a fit.",
    formula: "\\frac{E_{\\mathrm{flow}}}{E_N}:\\ 1.38\\times10^{-1}\\ (N{=}10^3)\\ \\to\\ 3.06\\times10^{-2}\\ (\\text{peak})\\ \\to\\ 1.22\\times10^{-5}\\ (N{=}10^{12});\\quad \\sigma_{\\mathrm{recon}}=\\sigma_{\\mathrm{CF}}\\Big(1-\\frac{E_{\\mathrm{flow}}}{E_{\\mathrm{trunc}}+E_{\\mathrm{coll}}}\\Big)",
    intuition: "E_flow sits in the denominator of the residual, so it strictly suppresses the share -- and it suppresses the left arm of the U-shape (N small) far harder than the right arm, falling from 13.8% of E_N at N=1e3 to 3.06% at the peak (N~9.22e5) to 1.22e-5 at N=1e12. Without E_flow the two-term share E_coll/(E_trunc+E_coll) is monotone decreasing everywhere (no peak); the differential suppression is exactly what bends it into rising-then-falling, so the imp-3220 interior maximum is not an independent feature of the model but a manufactured consequence of one already-proved term (Gronwall flow) fading faster than another (GUE-conditional collapse). Re-applying the suppression to the peakless closed form, sigma_recon = sigma_CF(1 - E_flow/(E_trunc+E_coll)), recovers the full-share peak to 9.2e-4 in height and ~9% in location, and the recovered peak (N~9.22e5, sigma_max~0.949429) matches the imp-3220 landmark (0.9494) to 4 significant figures, cross-checking that the inherited sub-terms are wired correctly. Measurement/identity only: the component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, not a rigorous asymptotic, and the GUE-conditional C_mb (imp-486) stays untouched; changes no bound, establishes no operator positivity; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96317-eflow-etrunc-peak-ratio-stationarity-identity',
    category: 'numerical',
    term: 'imp-96187 F1: the imp-3220 U-Shape Peak Condition E_flow/E_trunc = a/b Is a Derived Stationarity Identity, Not a Numerical Coincidence',
    symbol: "\\frac{E_{\\mathrm{flow}}}{E_{\\mathrm{trunc}}}\\Big|_{\\mathrm{peak}}=\\frac{a}{b},\\;\\ a=\\frac{d\\ln g_t}{d\\ln N}\\approx0.4655,\\;\\ b=-\\frac{d\\ln g_f}{d\\ln N}\\approx0.3041",
    definition: "imp-96162 measured E_flow/E_trunc = 1.530 at the exact imp-3220 sigma U-shape interior peak and flagged the number without deriving it. imp-96187 (F1) closed that gap: writing sigma = 1/(1+g_t+g_f) with g_t = E_trunc/E_coll and g_f = E_flow/E_coll, the peak stationarity condition d sigma/d ln N = 0 forces g_t*a = g_f*b, i.e. E_flow/E_trunc |_peak = g_f/g_t |_peak = a/b exactly, where a and b are the local log-slopes of g_t and g_f at the peak. Derived a/b = 1.5306 matches the imp-96162 measured 1.5308 to ~1.1e-4, upgrading the ratio from a flagged empirical number to a forced identity.",
    formula: "a/b=1.5306\\ \\text{vs measured}\\ E_{\\mathrm{flow}}/E_{\\mathrm{trunc}}=1.5308\\ (\\Delta\\approx1.1\\times10^{-4});\\;\\ \\text{identity holds across a}\\ 0.25\\times\\!-\\!16\\times\\ E_{\\mathrm{trunc}}\\ \\text{sweep (imp-96292, F4)}",
    intuition: "Any local extremum of a sum of two power-law-like terms forces this slope-ratio relation between their ratio and their log-slopes at that extremum -- no coincidence is needed. imp-96292 (F4) confirmed the identity is genuine rather than a single-height fluke by sweeping E_trunc from 0.25x to 16x, which moves the peak height and drifts the value of a/b itself (from ~1.434 to ~2.040), while the identity E_flow/E_trunc |_peak = a/b keeps holding at each height to the same <2e-4 tolerance. This is a derivation/documentation upgrade only: it does not pin the peak LOCATION (see the separate imp-96187 F2 formula and F3 accident verdict), changes no bound, and establishes no operator positivity; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96435-three-basis-rho-quadrature-vs-truncation',
    category: 'numerical',
    term: 'imp-96389 Three-Basis rho Cross-Validation: |A-C| Is Quadrature Roundoff, |A-B| Is Analytic Truncation, and Basis C Is the Binding Floor',
    symbol: "|A-C|\\sim10^{-11}\\ (\\text{same sine kernel, quadrature roundoff});\\;\\ |A-B|: 1.76\\times10^{-6}(L{=}30)\\to4.71\\times10^{-9}(L{=}480)\\ (\\text{dropped oscillatory terms})",
    definition: "imp-96389 assembled the three existing independent evaluations of the GUE two-interval correlation rho(L) into one per-L table (L = 30/60/120/240/480): basis A, the exact Dyson-Mehta number variance (imp-96350/imp-96267); basis B, the asymptotic module that drops the oscillatory cos/Ci/Si terms (imp-96371); and basis C, the direct pair-correlation double integral evaluated by composite Simpson quadrature (imp-96369). No prior module had put all three side by side with their pairwise agreements and their per-basis roundoff floors.",
    formula: "\\text{directFloor}(L):\\ 7\\times10^{-14}(L{=}30)\\to7.5\\times10^{-13}(L{=}120)\\to3.2\\times10^{-12}(L{=}480)\\to8.1\\times10^{-12}(L{=}960)\\to\\sim10^{-8}\\ (L_{PT}\\approx5.9\\times10^{6})",
    intuition: "The three bases disagree for two genuinely different reasons, and it matters which is which. |A-C| is tiny (~1e-11) and shrinks further at every accessible L because C is just a numerical quadrature of the SAME sine-kernel integrand that A evaluates in closed form -- their gap is pure floating-point roundoff. |A-B|, in contrast, is 1.76e-6 at L=30 and only decays to 4.71e-9 by L=480, because B genuinely drops the oscillatory cos/Ci/Si corrections A keeps -- that gap is an analytic truncation (the small-L branch of the imp-96371 U-shaped discrepancy envelope), not numerics, so it cannot be closed by finer quadrature. The roundoff floors invert the naive expectation: A and B are closed forms good to ~1e-16 (machine epsilon of the ratio), but C suffers catastrophic cancellation in Var = L - 2*Integral, and that best-achievable error GROWS with L (~7e-14 at L=30 to ~8e-12 at L=960, reaching only ~1e-8 at the Platt-Trudgian anchor L~5.9e6) -- so despite tracking A the closest at every measured rung, basis C is the one that binds the accessible-L table's overall precision. All three bases still agree on rho to >= 6 figures at every rung, corroborating the imp-96350/imp-96371/imp-96369 out-of-family verdict from one consolidated table. Cross-validation only; rho is a theoretical GUE (sine-kernel) quantity with no computed zeros behind it; changes no bound; establishes no operator positivity; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96452-excursion-confidence-fixed-data-ceiling',
    category: 'numerical',
    term: 'imp-96452 The ~1.9-Sigma Excursion Confidence Is Capped by a Fixed Data Ceiling, Not by Verified Height',
    symbol: "z=\\frac{\\mathrm{relErr}}{\\sqrt{2/n_w}}=\\frac{0.159457}{\\sqrt{2/291}}=1.9234,\\;\\ n_w^{*}=n_w\\Big(\\frac{2}{z}\\Big)^2=314.63",
    definition: "imp-96430/imp-96184/imp-96128 repeatedly cite an untouched ~1.9-sigma significance for the single below-envelope number-variance dip at T=1.5e5, without ever quantifying what sets it or what would lift it. imp-96452 traces the figure to its imp-96089 origin, z = (dip depth relErr)/sqrt(2/n_w) = 0.159457/sqrt(2/291) = 1.9234, and asks the natural follow-up: how much more verified zero height would push it to a clean 2-sigma?",
    formula: "n_w\\ \\text{needed for}\\ z=2:\\ 315\\ (+24\\ \\text{windows},\\ +8.12\\%);\\quad \\text{dip span}\\ [1.05\\times10^5,1.95\\times10^5]\\ \\text{fully interior to}\\ T_{\\max}\\approx6.003\\times10^5",
    intuition: "The answer is counter-intuitive for a project whose main lever is usually MORE VERIFIED HEIGHT: here it does not help. The z-score has exactly three inputs -- the ~16% dip depth relErr (a fixed measured feature of the existing 10^6 Odlyzko ordinates), the window count n_w=291 from the deterministic +/-30% tiling around T=1.5e5, and the chi-square sampling model sqrt(2/n_w). Reaching z=2 at fixed depth needs n_w >= 315, but the dip's +/-30% span [1.05e5, 1.95e5] is fully INTERIOR to the existing ordinate range (top ordinate ~6.003e5) -- it is not clipped by the ceiling, so it is already every window the tiling admits there. Extending verified height adds zeros far above 6e5, contributing zero new windows at 1.5e5: pushing the frontier outward does nothing for a gap that already sits deep inside the frontier. The only genuine levers are diluting the measurement (widening the span mixes in a different statistic) or a new, distinct deep excursion elsewhere -- and the figure is already conservative besides, since imp-96128's exact GUE anti-correlation (rho=-0.464) would raise a naive z to ~3.18 if it were used instead of the deliberately pinned independence assumption. Assessment only; changes no bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96509-ar2-ar3-effective-count-extension',
    category: 'numerical',
    term: 'imp-96509 Extending the Excursion AR-1 Effective-Count Model to AR-2/AR-3: n_eff Rises to 1475/2322, z_eff to 4.33/5.43, Sign-Forbidden From the rho_crit Flip',
    symbol: "\\mathrm{VIF}=\\frac{1-\\sum_j\\phi_j\\rho_j}{(1-\\sum_j\\phi_j)^2},\\ n_{\\mathrm{eff}}=n_w/\\mathrm{VIF};\\ (\\mathrm{AR}\\text{-}1,2,3):\\ n_{\\mathrm{eff}}=794.78,1475.43,2321.70,\\ z_{\\mathrm{eff}}=3.1787,4.3310,5.4329",
    definition: "imp-96489's AR-1 effective-count model extrapolates every lag beyond rho_1=-0.4639782 geometrically (rho_1^k), which predicts the WRONG SIGN at lag 2 (+0.2153 instead of the true theoretical sine-process value ~-0.020) and the wrong magnitude at lag 3 (-0.0999 instead of ~-0.008). imp-96509 refits the closed-form AR(p) variance-inflation factor by Yule-Walker directly on the true (rho_1, rho_2) and (rho_1, rho_2, rho_3), rather than assuming the AR-1 geometric tail.",
    formula: "\\rho_1=-0.4639782\\ (\\text{imp-96489 exact}),\\ \\rho_2=-0.020,\\ \\rho_3=-0.008\\ (\\text{theoretical GUE lag caveats});\\ \\phi_{AR2}=(-0.603088,-0.299820),\\ \\phi_{AR3}=(-0.669909,-0.434231,-0.222872);\\ f=2.731192,5.070203,7.978362",
    intuition: "Forcing lag-2 down from the AR-1-implied +0.2153 to the true -0.020 makes the fitted process MORE anti-persistent (phi_2=-0.29982<0), so the effective window count RISES rather than falls; the lag-3 refinement pushes it further the same way, and both fits are stationary. Every added negative lag lifts z_eff strictly upward (3.179 -> 4.331 -> 5.433), confirming the imp-96489 caveat's \"same safe direction\" claim as a measurement rather than an assertion, and every fitted correlation stays negative -- sign-forbidden from reaching the positive flip threshold rho_crit=+0.57443 that would turn the dip into noise. The headline conservative floor z_cons=1.9234 (independence, VIF=1) is untouched and remains the quoted strict lower bound. HONEST CAVEAT (see also imp-96552's later headword): this AR(p) climb is MODEL-CONTINGENT -- it rests on the GUE sine-kernel tail-decay picture for lags k>=4, not on the three measured lags alone, and imp-96529 shows the best guaranteed model-free improvement over z_cons is exactly zero. Measurement/reconciliation only; changes no bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96512-excursion-ledger-byte-consistency',
    category: 'numerical',
    term: 'imp-96512 The imp-96493 Interior z-Scan and the imp-96089 Below-Envelope Dip Table Are Byte-Consistent Height-by-Height',
    symbol: "z(T)=\\mathrm{relErr}(T)/\\sqrt{2/n_w(T)};\\ \\ T{=}1.5\\times10^5:\\ n_w{=}291,\\ z{=}1.9234;\\ \\ T{=}3.0\\times10^5:\\ n_w{=}411,\\ z{=}0.0749",
    definition: "imp-96493's ten-height interior z-score scan (T>1.5e5) and the imp-96089/imp-96115 below-envelope dip table (T=1e4, 1.5e5, 3e5) are two independently built excursion significance ledgers over the same 10^6 Odlyzko ordinates. imp-96512 reconciles them height-by-height, since both share the imp-95562 sd(C-E) literal and the z=relErr/sqrt(2/n_w) formula and so MUST agree wherever a height appears in both.",
    formula: "\\text{overlap}=\\{1.5\\times10^5,\\,3.0\\times10^5\\},\\ \\max|\\Delta z|=0;\\ \\ T_{\\mathrm{CLIP}}=T_{\\max}/1.3\\approx4.6175\\times10^5",
    intuition: "The two ledgers overlap at exactly two heights, T=1.5e5 and T=3.0e5, and agree there to full double precision -- window counts n_w=291 and 411, z-scores 1.9234 and 0.0749, max delta z = 0 -- confirming they are two windows onto the same excursion measurement rather than conflicting estimates. T=1e4 sits below the imp-96493 interior floor T>1.5e5 (dip-table-only); the nine imp-96129 dense scan heights above 1.5e5 are scan-only. Every dip-table height (1e4, 1.5e5, 3e5) sits below the clip threshold T_CLIP=T_max/1.3~4.6175e5, i.e. in the unclipped interior, matching imp-96493 treating them as fully-interior. Cross-validation only; changes no bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96506-truncation-branch-floor-law',
    category: 'numerical',
    term: 'imp-96506 The Basis-C ppp*<16 Truncation Branch Floor Is Composite-Simpson h^4 Error, Not the L-Linear Cancellation Line',
    symbol: "\\mathrm{floor}=D\\cdot(\\mathrm{ppp}^*)^{\\beta},\\ \\beta\\approx-4.11\\ (\\text{Simpson order }{-}4);\\ \\ \\mathrm{floor}=C\\cdot L^{\\alpha},\\ \\alpha\\approx2.20=\\beta\\cdot\\gamma,\\ \\gamma\\approx-0.56",
    definition: "imp-96486 mapped WHERE the direct basis-C floor departs the imp-96430 L-linear cancellation model floor(L)=8.4e-15*L: as the optimal panels-per-period ppp* collapses 640->3 across L=960..5.9e6, the achievable floor tracks the cancellation line to within ~2-4x only while ppp*>=32 (L<=1e5), then departs into a ppp-TRUNCATION regime once ppp* falls through 16 (L>=3e5) -- an over-model growing 13.5x at L=3e5 to 573x at the Platt-Trudgian anchor L=5.9e6. imp-96486 localized WHERE the departure happens but did not fit the floor law of the truncation branch itself; imp-96506 fits it.",
    formula: "\\text{branch rungs}:\\ (L,\\mathrm{ppp}^*,\\mathrm{floor})=(3\\times10^5,16,3.394\\times10^{-8}),\\,(10^6,8,4.198\\times10^{-7}),\\,(3\\times10^6,6,3.360\\times10^{-6}),\\,(5.9\\times10^6,3,2.841\\times10^{-5});\\ \\ \\text{live }L{=}3\\times10^5\\text{ low-ppp sweep slope}\\approx-4.8",
    intuition: "Fitting the four imp-96486 truncation-branch rungs against ppp* gives floor = D*(ppp*)^beta with beta ~ -4.11 (D~3.09e-3, R^2~0.98) -- matching the composite-Simpson 4th-order (h^4) TRUNCATION error, not a cancellation asymptote. The raw floor-vs-L law floor = C*L^alpha comes out with alpha~2.20 (C~2.9e-20, R^2~0.99), and the two fits are consistent: alpha ~ beta*gamma, where gamma~-0.56 is the empirical log-log collapse rate d(log ppp*)/d(log L) as ppp* falls from 16 to 3. A LIVE fixed-L=3e5 sweep over ppp in {2,3,4,6,8} (below the ppp*=16 U-minimum) reproduces the mechanism directly, with a measured slope ~-4.8 (slightly steeper than the theoretical -4 because the sinc^2 integrand carries unresolved unit-scale oscillation at very coarse ppp). So the anchor ppp=3 truncation floor (~2.84e-5) is the h^4 truncation error at ppp*=3, not the extrapolated L-linear cancellation line (~4.96e-8) -- the branch imp-96486 only localized now has its floor law characterized. HONEST CAVEAT: rho is the theoretical GUE (sine-kernel, universality) two-interval correlation, not computed from real zeros, so every floor here is a double-precision quadrature/cancellation artifact of this direct integral; four rungs is a coarse fit (log-rms ~0.2-0.3) and the two largest inherit imp-96486 eval-budget-capped optima. Feasibility / cross-validation numerics only; changes no bound; establishes no operator positivity; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96539-basis-c-dejittered-crossover-projected-reach',
    category: 'numerical',
    term: 'imp-96539 The imp-96507 De-Jittered Basis-C Crossover L* ~ 5.4e12 Stabilizes the Central Value but Remains a Projected Reach, Not a Measurement',
    symbol: "\\text{slope}_{P50}\\approx1.96\\times10^{-15}/L;\\ L^*_{\\mathrm{central}}\\approx5.4\\times10^{12};\\ \\text{band}\\approx[4.0\\times10^{12},1.0\\times10^{13}];\\ L_{PT}=5.9\\times10^6",
    definition: "imp-96430's basis-C direct-floor sweep against the exact number-variance signal |rho+1/2| was jittery: a single L=960 endpoint slope and a six-rung mean slope were two ad-hoc statistics that gave a wide, unmodeled crossover gap [~1.3e12, ~2.5e12]. imp-96507 de-jitters the fit -- widening the panels-per-period ladder to [40..2560] so every rung reaches its true roundoff-dominated floor rather than a discretization-capped one, densifying to thirteen accessible-L rungs, and replacing the two ad-hoc slopes with a robust percentile fit (median P50, interquartile P25/P75) of the per-rung floor/L.",
    formula: "\\text{robust median slope}\\approx1.96\\times10^{-15}\\ \\text{per unit }L;\\ L^*_{\\mathrm{central}}\\approx5.4\\times10^{12}\\ (\\rho\\approx-0.4896);\\ \\text{even/odd cross-val agree to}<0.1\\%;\\ \\text{honest band}\\approx[4.0\\times10^{12},1.0\\times10^{13}]",
    intuition: "The de-jitter genuinely stabilizes the central value: recomputing the median slope on the even-indexed rungs alone versus the odd-indexed rungs alone reproduces L* to better than 0.1% (~5.394e12 vs ~5.395e12), so the crossover is no longer a coin-flip between which single rung or statistic was used. But the honest uncertainty band WIDENS rather than narrows once it becomes a real interquartile spread ([~4.0e12, ~1.0e13], P75-slope to P25-slope) instead of the two arbitrary endpoint/mean numbers imp-96430 quoted -- that old [1.3e12, 2.5e12] gap was never a statistical band, just the distance between two jitter-sensitive estimators. Either way, L* stays a PROJECTED reach: the direct basis-C double integral is never evaluated anywhere near L~1e12 (the accessible rungs stop at L=960, about ten orders of magnitude below the crossover), so the crossover is an extrapolation of an independence property, not a measured one -- and because min-over-ppp is grid-dependent (widening it can only shrink the measured floors), the central L*~5.4e12 should be read as an upper-ish estimate, with the conservative near edge at the P75-slope crossover ~4.0e12. At the Platt-Trudgian anchor L=5.9e6 the exact signal still beats even the conservative model floor by more than 1e6, but imp-96448's directly MEASURED anchor floor (headroom ~640) is the operative margin, not this L-linear model figure. Cross-validation / extrapolation numerics only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96553-independent-height-exponent-fit-reach',
    category: 'numerical',
    term: 'imp-96553 The Fixed 10^6 Odlyzko Set Cannot Decide the imp-96510 Systematic-vs-Noise Sub-Gap: SE(p) >= ~0.21 vs a Delta_p = 1/4 Separation',
    symbol: "K_{\\mathrm{indep}}(s)=\\left\\lfloor\\frac{\\log(T_{hi}/T_{lo})}{\\log g(s)}\\right\\rfloor+1,\\ \\ g(s)=\\frac{1+s}{1-s};\\ \\ SE(p)=\\frac{\\sigma}{\\log g\\cdot\\sqrt{K(K^2-1)/12}},\\ \\sigma=\\sqrt{\\pi^2/8}",
    definition: "imp-96510 left open whether the below-envelope number-variance dip depth relErr(T) is a genuine SYSTEMATIC deviation (relErr fixed, exponent p=0) or pure SAMPLING NOISE (relErr ~ T^(-1/4), exponent p=-1/4) -- a Delta_p=1/4 separation in the log-log slope -- asserting the fixed 10^6 Odlyzko ordinate set supplies \"too few\" mutually-independent unclipped heights to fit that exponent, without quantifying how few. imp-96528 quantifies it: at the sub-gap-native +/-30% span the set supplies only K_indep=6 mutually-independent interior heights (just 2 in the T>=1.5e5 excursion regime -- exactly the imp-96493 pair), and the irreducible per-height log-relErr scatter sigma=sqrt(pi^2/8)~1.11 (from Var(log chi^2_1)=pi^2/2) keeps the OLS slope error SE(p) large everywhere.",
    formula: "\\text{native }\\pm30\\%: K_{\\mathrm{indep}}=6\\ (\\text{full band}),\\ 2\\ (\\text{excursion regime});\\ \\ \\text{best reach at }\\pm10\\%: K_{\\mathrm{indep}}\\approx20,\\ SE(p)\\approx0.21,\\ \\text{separation}\\approx1.16\\sigma\\ (\\text{need}\\gtrsim3\\sigma)",
    intuition: "Relaxing the clip fraction toward +/-10% raises the raw independent-height count from 6 toward ~20, but this cuts both ways: narrower windows then measure a different, narrower-span statistic than the sub-gap-native +/-30% dip depth, and the exponent standard error still bottoms out near SE(p)~0.21 because the fixed ~1.5-decade ordinate lever arm and the irreducible single-height chi scatter sigma~1.11 dominate regardless of span. Against the Delta_p=1/4 gap between the systematic and sampling-noise readings, that SE(p) separates them by at most ~1.16 sigma (only ~0.58 sigma at the native +/-30%) -- far short of the ~2-3 sigma a decisive fit needs, so no relaxation of the fixed set can pin the exponent. This is a QUANTIFICATION of imp-96510's \"too few\" claim, not a new closure: the sub-gap stays open pending the higher / contiguous zero source imp-96510 already showed does not exist. Measurement only; changes no bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96572-sine-kernel-vif-conditional-certificate',
    category: 'numerical',
    term: 'imp-96543 Sine-Kernel Sign Certificate: VIF <= 1 Is Rigorous (Conditional), the Explicit Magnitude Constants Are Soft',
    symbol: "T_2(x)=\\left(\\frac{\\sin(\\pi x)}{\\pi x}\\right)^2\\ge0\\ \\Rightarrow\\ \\rho_k\\le0\\ \\forall k\\ge1\\ \\Rightarrow\\ \\mathrm{VIF}_n\\le1;\\ \\ z_{\\mathrm{eff}}\\ge z_{\\mathrm{cons}}=1.9234",
    definition: "imp-96529 showed the three measured lag correlations alone give ZERO model-free improvement over the independence floor z_cons=1.9234 -- a PSD-admissible spectral measure with an atom at frequency 0 matches them exactly yet drives VIF_291 above 1. imp-96543 closes that gap CONDITIONALLY: the GUE sine-kernel two-point cluster function T_2(x)=(sin(pi x)/(pi x))^2 is nonnegative everywhere, so every disjoint-box eigenvalue-count covariance is nonpositive (rho_k<=0 for all k>=1) and carries no spectral mass at theta=0 -- exactly what excludes the imp-96529 worst-case atom.",
    formula: "\\mathrm{VIF}_n=1+2\\sum_{k=1}^{n-1}\\left(1-\\tfrac{k}{n}\\right)\\rho_k\\le1\\ (\\text{sign level});\\ \\ \\mathrm{VIF}_{291}\\le1+2\\left(1-\\tfrac1{291}\\right)\\rho_1=0.075232,\\ z_{\\mathrm{eff}}\\ge7.012\\ (\\rho_1=-0.4639782)",
    intuition: "Two tiers, and only the weaker one is rigorous. SIGN level (robust): rho_k<=0 makes every Bartlett term of VIF_n=1+2 sum(1-k/n) rho_k nonpositive, so VIF_n<=1 term by term with no magnitudes needed -- this is the certificate the three numbers alone could not supply, and it converts z_cons into a genuine conditional-on-sine-kernel lower bound z_eff>=1.9234. MAGNITUDE level (soft): plugging in the one exactly-known lag rho_1=-0.4639782 (imp-96489 union identity) and dropping the (nonpositive) tail gives an explicit VIF_291<=0.0752, z_eff>=7.01 -- legitimate but not sharp, because the O(1/k^2) decay RATE anchored at rho_1 predicts rho_2~-0.116 while the tabulated theoretical rho_2=-0.020 is a much faster drop from a DIFFERENT (sine-process, not union-identity) calibration; folding rho_2, rho_3 in anyway gives VIF_291<=0.0197 (z>=13.7) but mixes two normalizations and is explicitly NOT the headline. A further warning sign: the imp-96509 AR-1 completion predicts rho_2=rho_1^2=+0.2153>0, which VIOLATES the sign theorem outright, so that model-contingent climb is a distinct, non-sine-kernel-consistent statement. Net: only the SIGN (VIF<=1, z>=1.9234) is rigorously delivered; z>=7.01 is an honest but soft refinement. Conditional on the GUE sine-kernel / Montgomery pair-correlation for the actual zeta zeros (UNPROVEN, GRH-flavored); changes no unconditional bound. Assessment only; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96571-vif-rho1-bound-rigor-assessment',
    category: 'numerical',
    term: 'imp-96571: The Exact-rho_1 Bound VIF_291 <= 0.0752 (z_eff >= 7.012) IS the Rigorous Headline, Not a Soft One',
    symbol: "\\mathrm{VIF}_{291}=\\underbrace{\\left[1+2\\left(1-\\tfrac1{291}\\right)\\rho_1\\right]}_{0.075232,\\ \\text{exact }\\rho_1\\text{ only}}+\\underbrace{2\\sum_{k=2}^{290}\\left(1-\\tfrac{k}{291}\\right)\\rho_k}_{\\le0\\ (\\text{sign theorem})}\\ \\Rightarrow\\ \\mathrm{VIF}_{291}\\le0.075232,\\ z_{\\mathrm{eff}}\\ge7.012",
    definition: "imp-96543 delivered VIF<=1 (z_eff>=1.9234) from the sign theorem alone, plus a further explicit VIF_291<=0.0752 (z_eff>=7.012) from the one exact lag rho_1, but flagged the magnitude level as SOFT and called only 1.9234 'the headline'. imp-96571 asks whether that softness actually caps the 0.0752 bound back down, or only the further sharpening to 0.0197 (z>=13.7).",
    formula: "\\mathrm{VIF}_{291}=0.075232+\\mathrm{TAIL},\\ \\ \\mathrm{TAIL}=2\\sum_{k=2}^{290}\\left(1-\\tfrac{k}{291}\\right)\\rho_k\\le0\\ \\Rightarrow\\ \\mathrm{VIF}_{291}\\le0.075232\\ (\\text{no tail magnitude used})",
    intuition: "Splitting the finite-window sum at the one exactly-known lag isolates the head term 0.075232 = 1+2(1-1/291)rho_1 from a tail whose every Bartlett weight (1-k/291) is strictly positive for 2<=k<=290; the sign theorem (rho_k<=0 for all k>=1) then forces every tail term to be <=0. Dropping that tail is therefore a one-sided, bound-ENLARGING discard -- the 0.0752 bound consumes only the EXACT rho_1 = -0.4639782 (imp-96489 union identity) and the SIGN of the rest, both the robust parts of imp-96543; it needs no tail decay rate, no tabulated rho_2/rho_3 magnitude, no scale calibration. The uncalibrated magnitudes only enter later, to REPLACE the discarded tail by a specific negative number and sharpen further to VIF_291<=0.0197 (z>=13.71) -- that refinement is correctly soft, but softness confined to a term the 0.0752 bound never used cannot propagate up and weaken it. imp-96567's independent direct-from-T_2 tail (sum_{k>=2} rho_k = -0.036, genuinely negative) confirms no hidden positive term could break the bound and puts the true VIF near 0.0032, safely under 0.0752. So imp-96543's placement of z_eff>=1.9234 as 'the headline' was over-conservative: the correct rigorous conditional headline is z_eff>=7.012. Conditional on the GUE sine-kernel / Montgomery pair correlation for the actual zeta zeros (UNPROVEN, GRH-flavored); changes no unconditional bound. Assessment only; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96597-rho1-tail-false-anchoring-reconciliation',
    category: 'numerical',
    term: "imp-96567: rho_1 Sits ~8.9x Above the O(1/k^2) Tail -- the imp-96543 rho_2~rho_1/4 Tension Was a False-Anchoring Artifact",
    symbol: "\\rho_k=-\\frac{1}{2\\pi^2\\Sigma^2}\\ln\\!\\left(\\frac{k^2}{k^2-1}\\right)\\ (k\\ge2);\\ \\ \\rho_1=\\frac{\\Sigma^2(2L)}{2\\Sigma^2(L)}-1=-0.4639782\\ (\\text{union identity, not the tail curve})",
    definition: "imp-96543 flagged a calibration tension: anchoring the O(1/k^2) decay-rate clause at the exact rho_1=-0.4639782 predicts rho_2~rho_1/4=-0.116, while the tabulated theoretical box value is rho_2=-0.020, a much faster drop. imp-96567 derives the box-averaged rho_k directly from the GUE two-point cluster function T_2(x)=(sin(pi x)/(pi x))^2 over the T=1.5e5 non-overlapping tiling (L=495.779) and shows the tension is a FALSE-ANCHORING artifact, not a genuine miscalibration.",
    formula: "\\rho_1/\\text{tail-coeff}=8.93\\times;\\ \\ \\rho_2^{\\text{false anchor}}=\\rho_1/4=-0.116\\ \\ \\text{vs}\\ \\ \\rho_2^{\\text{correct}}=-0.01495\\ (\\text{tabulated}\\ -0.020,\\ \\text{same order})",
    intuition: "Direct integration gives Sigma^2(L)=0.974834, rho_1=-0.463978 (reproducing the exact union value to six digits), rho_2=-0.014950, rho_3=-0.006121, and a closed-form tail Cov_k=-(1/(2 pi^2)) ln(k^2/(k^2-1)) for k>=2 that genuinely decays like O(1/k^2) with coefficient -0.051968. But rho_1 is not a point on that tail curve: touching adjacent boxes share an edge, so rho_1 is set instead by the union identity rho_1=Sigma^2(2L)/(2 Sigma^2(L))-1, dominated by the LOG divergence of the number variance -- a different mechanism from the k>=2 tail -- and it sits ~8.93x above the tail coefficient. Anchoring the O(1/k^2) law at rho_1 (giving rho_2~rho_1/4=-0.116) therefore mis-anchors it at the one lag that does not obey it; anchored correctly at its own tail coefficient the law gives rho_2=-0.0150, rho_3=-0.0061, the SAME order as the tabulated round -0.020/-0.008 (exact-log ratio ln(4/3)/ln(9/8)=2.4425 vs tabulated 2.5, both round approximations of the same log ratio). The tabulated magnitudes are, if anything, slightly more negative, so they do not overstate the imp-96543 VIF reduction; the k>=2 covariances further telescope to a small bounded tail (sum_{k>=2} rho_k=-0.036022), tiny against rho_1=-0.4640. Conditional on the GUE sine-kernel / Montgomery pair correlation for the actual zeta zeros (UNPROVEN, GRH-flavored); changes no unconditional bound. Measurement only; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96622-vasyunin-lammax-pre-asymptotic-reach',
    category: 'numerical',
    term: 'imp-96594: The Vasyunin lam_max Slope 0.3526 Is Unreachable in Practice -- 10% Agreement Needs N >= 10^37',
    symbol: "\\lambda_{\\max}(N)\\approx0.3526\\ln N+3.0247;\\ \\ r(N)=\\frac{\\lambda_{\\max}(N)}{\\ln N}=0.3526+\\frac{3.0247}{\\ln N}",
    definition: "imp-96443 fit the Route M Vasyunin Gram top eigenvalue to lam_max(N) = 0.3526 ln N + 3.0247, and imp-96562 FINDING 3 already flagged the fitted slope 0.3526 as reachable only 'for astronomically large N'. imp-96594 makes that qualitative caveat quantitative by solving the reach condition r(N)=0.3526+3.0247/ln N in closed form for the N where the ratio comes within a given percentage p of the asymptotic slope: ln N = 3.0247/(p * 0.3526).",
    formula: "N_{10\\%}\\ge10^{37.25},\\ \\ N_{1\\%}\\ge10^{372.55};\\ \\ \\text{compute ceiling (imp-96352)}\\ N=9916\\ \\Rightarrow\\ r(9916)\\ \\text{still }93.2\\%\\text{ above }0.3526",
    intuition: "Plugging p=0.10 and p=0.01 into ln N=a/(p b) with a=3.0247, b=0.3526 gives N>=1.8x10^37 for 10% agreement and N>=3.5x10^372 for 1% agreement -- the latter dwarfing the ~10^80 atoms in the observable universe by roughly 300 orders of magnitude. Against that, the imp-96352 verified compute ceiling for the Vasyunin Gram spectrum is only N=9916, where the measured ratio still sits 93.2% above the fitted 0.3526 target: the 10%-reach threshold exceeds the compute ceiling by a factor of 10^33.26. No bound moves and the slope is not proven -- this is a closed-form measurement of how far the 1/ln N pre-asymptotic correction has to decay before the fitted slope becomes numerically visible, confirming imp-96562's qualitative claim with an explicit, extreme N. Measurement only; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96749-krein-lammin-n-trend-uniform-gap-open',
    category: 'numerical',
    term: 'imp-96749: The sigma_2 Krein Floor Trends Toward a ~0.55-0.57 Plateau, but the Uniform-in-N Spectral Gap Stays OPEN',
    symbol: "\\lambda_{\\min}(T_a[\\sigma_2])\\big|_{N=52,\\,2a=\\ln3}=0.577015>0;\\ \\ \\mathrm{cond}(B_N)\\ge10^{13}\\ \\text{for}\\ N\\ge60\\ \\text{(Gram wall)}",
    definition: "rh-route-i-toeplitz-krein-certificate-2026-09-24 needs the TRUE operator inequality T_a[sigma_2]>=0 on L^2(-a,a) to persist past the interval-rigorous finite-certificate reach 2a<=0.96, an open analyticObstruction. imp-96749 tracks the Rayleigh-Ritz upper floor lambda_min(T_a[sigma_2]) as the Legendre-Galerkin truncation N grows (N=20..76) at 2a in {1.00, 1.05, ln3}, using the exact spherical-Bessel Fourier transform of the pole-free basis phi_n(x)=(a^2-x^2)^3 P_n(x/a) (no x-quadrature).",
    formula: "\\text{trusted window }N\\le52\\ (\\mathrm{cond}(B)\\le4.6\\times10^{12}):\\ \\ 2a{=}1.00:\\,9.003{\\to}8.313;\\ \\ 2a{=}1.05:\\,2.409{\\to}2.155;\\ \\ 2a{=}\\ln3:\\,0.625{\\to}0.577",
    intuition: "Inside the double-precision-trustworthy window (N<=~52-60, where the a-independent Gram condition number cond(B) stays below ~1e13) the floor decreases slowly and non-acceleratingly at every rung -- consistent with convergence to a positive plateau (~0.55-0.57 at 2a=ln3), not collapse. Past N~60 the decrements start GROWING again, but this coincides exactly with cond(B) crossing the 1e13 corruption wall: the (1-y^2)^6-weighted basis becomes near-linearly dependent there, so the re-acceleration is flagged a numerical Gram-conditioning artifact, not spectral evidence of the gap closing -- no extrapolated limit is baked from the corrupted tail. So the measurement is consistent with a positive N->infinity limit but does NOT settle it: an extended-precision or orthogonal-basis (diagonal Gram) recomputation is needed to push past the wall and confirm the plateau. Measurement only; the true operator positivity for 0.96<2a<ln3 remains OPEN; interval-rigorous certificate reach stays 2a<=0.96; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96750-interior-second-moment-upper-bound-reduction',
    category: 'numerical',
    term: 'imp-96750: The Interior Frobenius Second-Moment Upper Bound Reduces to One Weighted-Cotangent Lemma -- Term-Splitting Ruled Out, No Ceiling Posted',
    symbol: "T(M)=2\\sum_{b\\le M}Q(b)/b^2;\\ \\ Q(b)=\\!\\!\\sum_{a=2,(a,b)=1}^{b-1}\\!\\!I(a,b)^2/a^2\\ \\overset{?}{\\le}\\ s_0^*\\,b+O(1)\\ \\ (\\text{open})",
    definition: "imp-96750 attempts a rigorous one-sided upper asymptotic Int(N)<=s* log N for the imp-96667 interior Frobenius second moment, which would raise the rigorous Route M lower conditioning ceiling from T=2.594e7 toward F=3.775e7 (imp-97142 sizes this as an interval F in [3.7095e7, 3.8012e7], fPctVsLine in [-2.035%, +0.389%], once the imp-96667 slope band 5.66-5.80 is propagated -- not a certified single point). Using the imp-96708 sandwich Int(N)<=zeta(2) T(N) and an exact symmetric regrouping of T(M) by the larger coprime index b, the whole question is reduced rigorously to ONE uniform lemma: Q(b)<=s0* b + O(1) for an absolute constant s0*.",
    formula: "s^*=2\\zeta(2)s_0^*;\\ \\ s_0\\ \\text{measured}\\to1.75\\Rightarrow s^*\\approx5.76;\\ \\ T_{\\text{split}}(1200)=2801\\ \\text{vs true}\\ T(1200)=17.2\\ (163\\times,\\ \\text{grows like}\\ M\\log^2 M)",
    intuition: "The reduction is exact: the regrouped T(M) reproduces the imp-96708 checkpoint T(250)=11.757622 to all printed digits, and the measured window means of Q(b)/b rise 1.690 -> 1.729 -> 1.745 -> 1.751 toward a candidate s0~1.75, giving s*~5.76 -- consistent with the imp-96667 interior slope band 5.66-5.80. But the obvious attack, splitting I(a,b) into its arithmetic part C(a+b)+(1/2)(a-b)log(b/a) and its cotangent part -(pi/2)(V(a,b)+V(b,a)) and squaring separately, is proved to OVERSHOOT: the arithmetic part alone (from just the a=2 term) forces a lower bound growing like M log^2 M, not log M -- 163x too large at M=1200 and growing. So I(a,b) is the small residual of an O(b log b) cancellation between the two parts, and the one-sided lemma must bound I directly, with the cancellation intact -- exactly the Bettin-Conrey two-variable cotangent second moment as a one-sided upper constant, generalising the rigorous a=1 border case. That residual lemma is NOT established here. No improved rigorous ceiling is posted: T=2.594e7 stays the anchor, and the compute ceiling (N~9916) binds first by >2600x regardless. Reduction + obstruction only; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96740-basis-c-crossover-truncation-mechanism-transition',
    category: 'numerical',
    term: 'imp-96740: Basis-C Crossover-Set vs Truncation-Set ppp Regimes -- the Mechanism Transition Sits Just Below the PT Anchor',
    symbol: "L_{\\mathrm{transition}}\\in(5.5\\times10^6,\\,5.6\\times10^6];\\ \\ \\mathrm{ppp}^*\\ge4\\ (\\text{crossover-set})\\ \\to\\ \\mathrm{ppp}^*=3\\ (\\text{truncation-set});\\ \\ L_{PT}=5.9\\times10^6",
    definition: "imp-96716 pinned the basis-C best-floor optimum panels-per-period (ppp) mechanism transition first flagged unlocated by imp-96690: below L_transition the best-achievable floor is minimized by ppp in the CROSSOVER-SET regime (ppp>=4, where a finer panel count still improves the floor), while at and above L_transition the optimum drops into the TRUNCATION-SET regime (ppp pinned at 3, the value that survives up through the Platt-Trudgian anchor, before later collapsing to 2 at larger L). The transition brackets to L in (5.5e6, 5.6e6] -- just ~0.03 decades below the anchor L=5.9e6, so the anchor is the FIRST truncation-set rung, not deep inside that regime.",
    formula: "\\text{floor jump}\\approx49\\times\\ (6.033\\times10^{-7}\\to2.972\\times10^{-5});\\ \\ \\text{decades below anchor}\\approx0.028;\\ \\ \\text{geo-mid}\\approx5.55\\times10^6",
    intuition: "The crossover-set/truncation-set split is a competition between two error sources in the same direct double integral: within crossover-set, raising ppp still buys resolution against the sinc^2 oscillation, so the minimizing ppp climbs (5 -> 4) as L grows; but the Var=L-2*Int cancellation roundoff grows with L too, and once it overtakes the benefit of the finer grid the ppp=4 branch blows up (its own floor jumping 6.03e-7 -> 3.34e-5 across the same window) and the optimum falls back to the coarser ppp=3, which degrades more gracefully. That handoff is sharp, not gradual: every rung up to L=5.5e6 is crossover-set and every rung from L=5.6e6 on is truncation-set, with a ~49x floor jump at the boundary. Because the PT anchor L=5.9e6 lands only ~0.03 decades above this transition, it is best read as the first truncation-set rung rather than a representative interior point of that regime. HONEST CAVEAT: this is a property of the numerical scheme (where cancellation roundoff overtakes panel resolution), not of the analytic rho, which is the theoretical GUE two-interval correlation with no computed Riemann zeros behind it. Measurement only; changes no bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96746-krein-lp-conditioning-wall',
    category: 'numerical',
    term: 'The Route I Krein sigma_2 LP Conditioning Wall: eps -> 0 at 2a=1.0 Caps the Interval-Rigorous Reach at 2a=0.96',
    symbol: "\\varepsilon(2a)=200(1-2a)\\ \\xrightarrow{2a\\to1.0}\\ 0;\\ \\ \\mathrm{HiGHS\\ status\\ 4\\ for\\ }a\\ge0.50\\ (2a\\ge1.00)",
    definition: "The rh-route-i-toeplitz-krein-certificate-2026-09-24 finite-certificate LP for T_a[sigma_2]>=0 carries a certified design margin eps(2a)=200(1-2a) that decays linearly and hits exactly zero at 2a=1.0 -- precisely where the double-precision HiGHS solver starts returning status 4 (numerical difficulties) for a>=0.50. imp-96732 pins which of the two co-located walls -- vanishing margin vs. tail l1-norm blow-up -- is reached first, and finds it is the margin.",
    formula: "2a{=}0.98:\\varepsilon{=}4.0;\\ \\ 2a{=}0.99:\\varepsilon{=}2.0;\\ \\ 2a{=}1.00:\\varepsilon{=}0;\\ \\ l_1(2a{=}1.00)\\approx1.0\\times10^9\\ (\\text{only}\\ {\\sim}30\\ \\text{bits, still modest})",
    intuition: "At the eps wall (2a=1.0) the certified margin has vanished but the tail l1-norm is still only ~1e9 (~30 mantissa bits, well inside double range) -- the catastrophic l1 blow-up to ~1.7e16 only arrives by ln3=1.0986, long after the margin has already gone deeply negative (eps~-19.7 there). So the HiGHS status-4 failure at a>=0.50 is driven by the vanishing FEASIBILITY SLACK, not by coefficient magnitude: an LP with zero certified margin is numerically near-infeasible regardless of precision. This makes the wall COMPOSITE: for 0.96<2a<1.0 the margin is still strictly positive and l1 modest, so the double-precision stall there is plausibly a solver-conditioning artifact recoverable by extended precision (unverified); but at and past 2a=1.0 the margin has genuinely hit zero, and by ln3 it is negative -- there is nothing left for any working precision to certify. Reaching ln3 via this finite-certificate route is therefore blocked independently of solver precision. Explains WHY the interval-rigorous reach stops at 2a=0.96 rather than pushing further; changes no bound; the true operator lambda_min(T_a[sigma_2]) may still persist positive past 2a=1.0, but that is the separate uniform-in-N spectral-gap / de Branges existence question. RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96760-basis-c-real-zero-reach-uncorroborable',
    category: 'numerical',
    term: 'imp-96733: The GUE-only Basis-C Reach Ladder (L* ~ 8.1e7) Is Doubly Uncorroborable by Real Zeros',
    symbol: "\\mathrm{signal}_{\\mathrm{emp}}(L)\\approx15\\times..520\\times\\ \\text{smaller than}\\ \\mathrm{signal}_{\\mathrm{GUE}}(L);\\ \\ 2L_{\\mathrm{reach}}=6\\times..81\\times\\ \\text{the whole } 2\\times10^6\\text{-zero span}",
    definition: "imp-96690's above-anchor Basis-C reach ladder (rungs L=5.9e6..8.1e7) rests entirely on the theoretical GUE two-interval correlation rho_GUE(L)=Sigma2(2L)/(2Sigma2(L))-1, with no computed Riemann zeros behind any value. imp-96733 measures the empirical rho_emp from the first 2,001,052 real Odlyzko zeros (dataset zeros6, unfolded span ~2.0e6) at intermediate L=1e3..1e5 and tests whether it corroborates the ladder's signal |rho+1/2|.",
    formula: "L{=}1e3{:}\\ \\mathrm{signal}_{\\mathrm{emp}}{=}2.3\\times10^{-3};\\ \\ L{=}3e4{:}\\ 5.4\\times10^{-4};\\ \\ \\mathrm{signal}_{\\mathrm{GUE}}\\sim2.5\\times10^{-2}..3.4\\times10^{-2};\\ \\ L{=}1e5{:}\\ \\text{only}\\ {\\sim}9\\ \\text{windows (past ceiling)}",
    intuition: "Two independent obstructions, both measured. (1) At every tractable intermediate L (1e3..3e4, still ~30..1000 independent 2L windows) the empirical number variance has fully saturated to ~0.386-0.387, pinning rho_emp essentially at the rigidity limit -1/2: the empirical corroboration signal is 15x-520x SMALLER than the GUE ladder signal at the same L, meaning real zeros are MORE rigid than GUE there and simply do not reproduce the signal magnitude the reach projection tracks. (2) The measurement itself breaks down just above L~3e4 -- at L=1e5 only ~9 independent 2L windows fit the ~2e6 unfolded span and the Monte-Carlo estimator collapses to a finite-sample artifact, not a real signal. Worse, the reach rungs themselves (L=5.9e6..8.1e7) need an outer box 2L that is 6x-81x the ENTIRE unfolded span of the dataset -- not even one window fits, so the reach cannot be probed by real zeros at all, at any dataset size increment short of that. The discrepancy is in the SAFE direction (as in the earlier imp-96695 small-L measurement): real zeros under-shoot the GUE signal, so they do not contradict the shrinking-signal picture, they just cannot independently confirm it. Measurement only; moves no bound; recomputes no crossover; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96713-route-m-ceiling-reaudit-residual-invariant',
    category: 'numerical',
    term: 'imp-96713: The Route M Three-Ceiling Decomposition (T<F<M, Residual ~1.09x, Gap ~76%) Survives the Frobenius Update, and M/T=1.5842 Is Pivot-Invariant',
    symbol: "T{=}2.594\\times10^7 < F{=}3.775\\times10^7 < M{=}4.109\\times10^7;\\ \\ M/T=(F/T)(M/F)=1.5842",
    definition: "imp-96693 keyed the three Route M lam_max conditioning ceilings -- trace-domination T (rigorous lower), Frobenius F (fit), measured composed M -- to the imp-96684 eleven-rung Frobenius fit, reporting residual factor M/F~1.09x and gap-fraction (F-T)/(M-T)~76%. imp-96713 re-audits both figures after imp-96694 rebuilt the exact Vasyunin Gram to N=12000 and re-solved F to a fourteen-rung fit (3.7637e7 -> 3.7751e7, +0.30%).",
    formula: "F/T{:}\\,1.4511{\\to}1.4555;\\ \\ M/F{:}\\,1.0917{\\to}1.0884\\ (\\text{still rounds }1.09\\text{x});\\ \\ \\text{gap-fraction}{:}\\,0.7722{\\to}0.7797",
    intuition: "The strict ordering T<F<M survives the +0.30% Frobenius update, and both imp-96693 headline figures still hold: the residual factor M/F drifts slightly down (1.0917->1.0884, the enlarged fit sits closer to the measured ceiling) but still rounds to the reported 1.09x, while the gap-fraction drifts slightly up (0.7722->0.7797, still ~76-78%). The two drifts move in opposite directions and cancel exactly in the product, so the TOTAL ratio M/T=(F/T)*(M/F)=1.584164 is algebraically INVARIANT to which Frobenius pivot is used -- imp-96773 confirms this is not a Frobenius-specific artifact by re-deriving the same M/T through two independent Wolkowicz-Styan pivots and a fit-free geometric-mean pivot, all reproducing 1.5841640857 to machine precision. Only the SPLIT between the rigorous->fit leg and the fit->measured leg shifts; the total conditioning-ceiling overstatement does not. Accuracy audit only; no bound moved; no operator positivity established; the Frobenius and measured ceilings both still rest on a log-fit extrapolated ~four decades (only the trace ceiling is a rigorous lower bound); RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96722-bohr-lift-szego-edge-ceiling',
    category: 'proof',
    term: 'imp-96691 verdict: the Bohr-Lift / Multiplicative-Szego Route Yields a Coefficient Ceiling, Not the Exact Route M Edge Constant',
    symbol: "c\\le I(1,1)=\\log(2\\pi)-\\gamma=1.2606614015078126;\\ \\ c_{\\mathrm{measured}}=0.3526253785070698\\approx0.2797\\,I(1,1)",
    definition: "imp-96603 ruled out the additive Szego edge theorem for the multiplicative Vasyunin Gram. imp-96691 asked whether the Bohr lift z_j=p_j^{-s} -- the isometry between the Hardy space H^2 of Dirichlet series and H^2 of the infinite polytorus -- supplies a multiplicative-Szego analog that rigorously derives the measured 0.3526 log-growth coefficient of lam_max(G_N). It found a genuine PARTIAL closure: the multiplicative diagonal G_kk=I(1,1)/k alone gives the rigorous trace ceiling lam_max(G_N)<=trace(G_N)=I(1,1)H_N, so c<=I(1,1)=log(2 pi)-gamma=1.2606614015078126, with the log-shape forced by the zeta(s) pole at s=1 the lift carries.",
    formula: "\\text{trace ceiling: } c\\le1.2606614015078126;\\quad \\text{measured: } c=0.3526253785070698\\ (\\approx28\\%\\text{ of the ceiling})",
    intuition: "Two independent reasons block closing the ceiling down to the exact value. UNBOUNDED SYMBOL: the Bohr-lifted Vasyunin symbol inherits the same zeta(s) pole (divergence of Sum 1/k), so it is not bounded and Helson`s bounded-symbol multiplicative-Szego edge theorem -- which would force lam_max toward a constant ess-sup edge -- has no applicable statement here; the imp-96603 additive obstruction survives the passage to the multiplicative torus. ISOMETRY, NOT AN EDGE THEOREM: the Bohr lift transports the quadratic form faithfully but supplies no top-eigenvalue asymptotic by itself. The measured coefficient 0.3526253785070698 is only ~28% of the trace slope 1.2606614015078126, so pinning it needs a spectral-concentration estimate strictly beyond the soft trace bound. Documentation of the imp-96691 verdict only; establishes nothing; instantiates no interval; moves no bound; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-96830-vasyunin-second-moment-obstruction-mislocated',
    category: 'proof',
    term: 'imp-96795 Mis-Located the Coprime-Core Vasyunin Second-Moment Obstruction: the h-Uniform Moment Is Already in the Literature, the Real Gap Is a Coupled Weighted Tail Assembly',
    symbol: "T(N)=\\!\\!\\sum_{\\gcd(a,b)=1}\\!\\!\\frac{I(a,b)^2}{a^2b^2};\\ \\ \\sum_{(h,k)=1}c_0(h/k)^2\\sim c\\,k^2\\log k\\ \\text{(available, fixed-}k\\text{)}",
    definition: "imp-96795 named the obstruction to proving the coprime-core Vasyunin second moment T(N)=Sum_{gcd(a,b)=1,a,b<=N} I(a,b)^2/(a^2 b^2) satisfies a clean growth law as a missing UNIFORM (in both free arguments) Bettin-Conrey / Maier-Rassias cotangent-sum second moment. imp-96830's literature survey finds this mis-located: the fixed-denominator second moment Sum_{(h,k)=1} c_0(h/k)^2 ~ c k^2 log k, uniform in h for each fixed k (Maier-Rassias / Bettin-Drappeau), already exists in the literature -- the h-uniform leg imp-96795 asked for is not a gap at all.",
    formula: "\\text{measured: } T(N)\\sim3.54\\log N\\ \\text{(linear, imp-96828), NOT}\\ (\\log N)^2",
    intuition: "What T(N) actually needs is not a stronger moment theorem but an unwritten ASSEMBLY, for two independent reasons. COUPLING: the Vasyunin integral I(a,b) is a PRODUCT of two cotangent sums at DIFFERENT reduced denominators (one at k=b, one at h=a), so a fixed-k second moment -- which controls only one denominator -- cannot reach the coupled cross terms a two-argument uniform statement needs. WRONG REGIME: the 1/(a^2 b^2) weight concentrates T(N) on SMALL a,b, while the k^2 log k moment growth lives at LARGE denominators, the exact regime the weight suppresses; even a perfect joint second moment would not hand over T(N)'s growth constant, which is a slowly-accumulating TAIL effect, not the leading moment asymptotic -- corroborated by imp-96828's measured T(N)~3.54 log N (linear in log N), not the (log N)^2 a naive moment-count would suggest. So the obstruction sits strictly between the two poles imp-96795 offered: not a verbatim corollary (the coupled weighted tail assembly is unwritten in the literature) and not a deep open moment problem (the hard h-uniform leg is already available, and the target growth is only logarithmic). Literature assessment only; no growth law or bound proved; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-97032-krein-tail-edge-dip-structural-not-parametrisation',
    category: 'numerical',
    term: 'imp-97032: The kmax=5 Krein Design-F Tail-Edge Dip Is STRUCTURAL -- It Relocates With the Cutoff T and Survives Tail-Block Densification',
    symbol: "F(t)=\\sigma_2(t)+\\sum_k\\sum_j c_{k,j}t^k\\,\\mathrm{trig}_k(x_jt);\\ \\ T{=}40{:}\\min F{=}0.802\\ (t{\\approx}35.2)\\ \\xrightarrow{T\\to60}\\ \\min F{=}0.866\\ (t{\\approx}42.6)",
    definition: "imp-97013 (FINEH=3e-5) showed the kmax=5 Route I Krein cutting-plane guarded-LP residual for T_a[sigma_2]>=0 at 2a=1.00 is bound not by the guard term (which shrinks as predicted) but by the design F itself dipping below eps=1.0 in the tail band t~35-40, and it left open whether a larger cutoff T or a denser periodic tail block (spacing HP) would clear that dip. imp-97032 tests exactly those two levers and finds neither converges.",
    formula: "T{=}60,\\,HP{=}0.05{:}\\ \\text{residual walls at}\\ {-}0.167\\to{-}0.745;\\quad T{=}40,\\,HP{=}0.01{:}\\ \\text{residual plateaus}\\ {\\approx}{-}0.061\\ (F{=}0.953\\ \\text{at}\\ t{\\approx}35.9)",
    intuition: "Neither lever drives the guarded residual to >=0. Pushing the cutoff T from 40 to 60 does lift the OLD dip band (t~35-40 rises from F=0.802 to F~0.995, now above eps) -- but a NEW dip of comparable depth appears right at the new edge (F=0.866 at t~42.6), and the worst residual over the run walls non-monotonically, worsening to -0.745. Densifying the periodic tail block instead (HP 0.05 -> 0.01, ~31k tail rows/round) slowly lifts the fine-grid F (0.782 -> 0.953 over rounds) but plateaus near the original -0.056 residual with F still below eps. The pattern is the same either way: the dip is an edge effect of the kmax=5 top-family that tracks wherever the cutoff currently sits, not a discretisation artifact that a bigger T or finer tail spacing can dissolve. So the binding constraint is genuinely the design class, and clearing it needs a RICHER FAMILY (higher kmax or a different tail ansatz), not further tail parametrisation. Certified interval-rigorous reach is unchanged at 2a<=0.96; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-97161-single-cosine-arithmetic-obstruction',
    category: 'proof',
    term: 'imp-97161: At 2a = ln3 the Route I Arithmetic Obstruction Is a Single Rank-Controlled Cosine Perturbation at Frequency ln2, Lifted by (D^2+1/4)^2',
    symbol: 'K_{\\sigma_2}(u) = (D^2+\\tfrac14)^2\\big[K_{\\mathrm{arch}}(u) + K_{\\mathrm{prime}}(u)\\big],\\quad |u|\\le 2a',
    definition: "imp-97161 assesses the pole-free Weil symbol sigma_2(t)=(t^2+1/4)^2 w_1(t) at the binding half-width 2a=ln3, where w_1 is a smooth archimedean (log-drift) term plus a single arithmetic term -sqrt2 ln2 cos(t ln2). On the band |u|<=2a the inverse-Fourier kernel splits exactly as (D^2+1/4)^2 acting on an archimedean part K_arch plus a prime part K_prime consisting of two point masses at lags u=+-ln2.",
    formula: "\\ln 2 = 0.693147 < 2a=\\ln 3 = 1.098612 < 2\\ln 2 = \\ln 4 = 1.386294",
    intuition: "The prime frequency ln2 sits inside the certificate band ln3, but its next harmonic 2ln2=ln4 sits just outside it (ln4 > ln3) -- so at exactly 2a=ln3 only ONE prime cosine harmonic is captured by the kernel. That is why p=2 is the binding prime and 2a=ln3 is the threshold in the committed Toeplitz-Krein certificate: the entire arithmetic content of the obstruction, at this band, reduces to a single rank-controlled cosine term riding on top of an otherwise smooth archimedean kernel. Framing only -- the sharp coercivity constant c_sharp = lambda_min(P_a M_{sigma_2} P_a) implied by this splitting is bounded from above by finite-N numerics only (0.552/0.534/0.476, still descending), with no proven positive lower bound yet; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-97184-phase-preserving-panel-enclosure-vs-mode-wise-triangle-envelope',
    category: 'numerical',
    term: 'Phase-Preserving Panel Enclosure vs Mode-Wise Triangle Envelope (Krein Tail Majorant, Route B vs Route A)',
    symbol: "M(h)=\\sum_i (t_{i+1}{-}t_i)\\sup_{\\text{panel}_i}\\Big[\\sigma_2^{\\text{maj}}(t)\\,|g(t)|^2/(\\pi B)\\Big],\\ \\ g(t)=v_0\\cdot\\Phi(t)",
    definition: "Two ways to bound the Route I Krein tail residual <v0|R_T|v0> = (1/(pi B)) int_{|t|>T} sigma_2(t)|g(t)|^2 dt by a panel sum. Route B (phase-preserving) encloses g(t)=v0.Phi(t) AS ONE ENTITY on each panel -- taking the supremum of the actual coherent sum -- before squaring and multiplying by the sigma_2 majorant and the panel width. Route A (mode-wise triangle envelope) instead bounds each mode separately and sums the absolute values, sum_j |v0_j| |Phi_j(t)|, discarding the phase relationships between modes before squaring.",
    formula: "\\text{Route B: } M(h)/r_q\\ 2.278\\to1.421\\ (h{=}\\text{period}\\to\\text{period}/16);\\quad \\text{Route A: } 200.4\\times r_q\\ (\\text{diverges})",
    intuition: "imp-97184 measured both at the binding rung (N=100, 2a=ln3, T=4800, Tfar=60000, quadrature rq=5.381116e-4). Route B's panel majorant M(h) falls monotonically as panels narrow -- 2.278x rq at h=period down to 1.421x rq at h=period/16, trending toward ~1x -- landing within a small factor of the true value because keeping g as one coherent entity preserves the ~15 orders of inter-mode cancellation that make the tail small in the first place. Route A's mode-wise envelope, by discarding phase before summing, throws that cancellation away and diverges to 200.4x rq -- vacuous regardless of panel width. The lesson generalises beyond this one tail integral: whenever a quantity is a SQUARED COHERENT SUM over oscillatory modes, a majorant must enclose the sum before squaring (phase-preserving), not square-and-sum termwise (triangle envelope), or the bound inherits none of the cancellation the true quantity relies on. Framing/measurement only: the Route B panel supremum here is SAMPLED on a subgrid, not a certified interval enclosure, so no rigorous majorant is produced; interval-rigorous reach stays 2a<=0.96; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-97330-smalla-intercept-closed-form',
    category: 'proof',
    term: 'imp-97330: the Small-a Bettin-Conrey Intercept d_a Is a Clean Closed Form, Not a Residue-Driven Function',
    symbol: 'd_a = a\\left(C+\\tfrac12\\right) - \\tfrac{a}{2}\\log a = \\tfrac{a}{2}\\big(2C+1-\\log a\\big),\\quad C=\\tfrac{\\log 2\\pi-\\gamma}{2}',
    definition: "imp-97311 fit I(a,b) = kappa_a log b + d_a + o(1) with kappa_a = a/2 exact, but reported the intercept table d_1..d_5 = 1.13, 1.57, 1.74, 1.75, 1.63 as a non-monotone arithmetic function of a driven by the V(b,a) residue sum, left unpinned. imp-97330 measures d_a over a = 1..47 (prime and composite) and pins it exactly: d_a = a(C+1/2) - (a/2) log a, C = (log 2pi - gamma)/2, verified to a uniform o(1) tail (residual < 3e-5 for a<=14, ~-1.6e-6.a at larger b-windows) for every a tested.",
    formula: "d_1=1.130,\\ d_3=1.743,\\ d_4=1.749\\ (\\text{plateau straddling the peak});\\quad a^\\*=e^{2C}\\approx3.527,\\ d_{a^\\*}=\\tfrac{e^{2C}}{2}\\approx1.7635",
    intuition: "The non-monotone shape of the imp-97311 table looked arithmetic because the intercept rises then falls as a grows -- exactly the signature one would expect from a residue-sum contribution. imp-97330 shows the rise-then-fall is instead the ordinary shape of the smooth function (a/2)(2C+1-log a): decomposing I(a,b) term by term, the b-independent survivors are C.a (linear), -(a/2)log a (the arithmetic-looking log term), and +a/2 (the O(1) constant of the V(a,b) kernel, generalizing the rigorous a=1 border 1/2 of imp-96667 to -a/pi). The period-a oscillating V(b,a) residue sum that the ticket blamed for the shape has ZERO mean over residues -- it only contributes o(1) wobble, not the intercept itself. So d_a carries no prime/multiplicative signal; its peak at a=e^{2C}~3.53 (value e^{2C}/2~1.764) simply straddles the measured plateau d_3~1.743, d_4~1.749. The pin feeds the fixed-a asymptotic I(a,b) = (a/2)log(b/a) + a(C+1/2) + o(1) into the imp-97329 uniform crossover second moment, but does not by itself separate b^(1/2) from log^2 b (the fixed-a moment sum 1/4 still diverges, imp-97311) -- that separation still needs the uniform a~b remainder profile. Measurement + pin only; no coefficient of g(b) claimed; the rigorous anchor stays the trace ceiling T=2.594e7; compute N~9916 (imp-96352) binds first by >2600x; no operator positivity; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
  {
    id: 'imp-97575-well-vs-bulk-split-bound-obstruction',
    category: 'proof',
    term: 'imp-97537 Part B: the "Dominate the Well by the Positive Mass" Two-Window Split Crosses Zero at 2a=0.6026, Below Even ln2',
    symbol: 'Q(g) \\ge \\lambda_{\\min}(T_a[\\sigma_2^+]) - \\lambda_{\\max}(T_a[\\sigma_2^-]),\\quad \\sigma_2=\\sigma_2^+-\\sigma_2^-',
    definition: "imp-97537 Part B tests the naive strategy of bounding the confined-well negativity of sigma_2(t)=(t^2+1/4)^2 w_1(t) by splitting it into positive/negative parts and bounding the well's contribution by the positive far-field mass: lambda_min(T_a[sigma_2^+]) - lambda_max(T_a[sigma_2^-]). That split bound crosses zero at 2a=0.6026, weaker than the published ln2=0.6931 and far weaker than the interval-rigorous 2a<=0.96 Krein/LP certificate.",
    formula: "0.6026 < \\ln 2 = 0.693147 < \\tfrac12\\ln 3 \\cdot 2 = \\ln 3 = 1.098612 \\le 0.96\\text{-certificate reach}",
    intuition: "Splitting sigma_2 into sigma_2^+ and sigma_2^- discards the cancellation a single band-limited PW_a function must respect: it cannot simultaneously concentrate on the confined well and deplete the positive band and far field, because the same modulus |ghat|^2 samples all three at resolution pi/a. Bounding the well by the positive mass throws that correlation away, so the split bound collapses far earlier (2a=0.6026) than the true lambda_min(T_a[sigma_2]), which the correlation-preserving Krein/LP certificate keeps positive through 2a<=0.96. The correct handle for this kind of confined-well negativity is the correlation-preserving certificate, not a well-vs-bulk split. Documentation only; no coercivity constant claimed; no bound moves; RH open; NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.",
  },
];

// Minimal, hand-maintained map from imp-NNNN references that appear inside glossary
// text to the viz route they name, so those mentions can render as clickable links
// instead of plain text. Only entries confirmed to both (a) be named inline in a
// CONCEPTS definition/intuition string and (b) have a live /viz-impNNNN route in
// App.jsx are listed here -- add more pairs as new cross-references are confirmed.
const VIZ_REF_ROUTES = {
  'imp-34268': '/viz-imp34268-fixed-band-peak-reaccel-convexity-stitch',
  'imp-34355': '/viz-imp34355-fartail-crossover-residual-collapse',
  'imp-34599': '/viz-imp34599-full-ladder-through-pole',
};
const VIZ_REF_PATTERN = /(imp-\d{4,5})/g;

// imp-35065 scoping: the headword itself (the <h3> term above) can ALSO carry an
// optional per-concept route via a `headwordRoute` field on a CONCEPTS entry, wrapped
// in the same <Link> already imported for linkifyVizRefs -- no new import, so this does
// not violate the no-heavy-imports directive. No entry sets it yet: unlike the inline
// imp-NNNN mentions linkified above (a 1:1 text-token -> route match), most CONCEPTS
// entries are generic glossary terms or multi-ticket digests with no single canonical
// viz page, so populating headwordRoute needs a separate per-entry audit (out of scope
// here) to confirm which ids genuinely own one dedicated route before wiring them.

function linkifyVizRefs(text) {
  if (!text) return text;
  const parts = text.split(VIZ_REF_PATTERN);
  return parts.map((part, i) => {
    const route = VIZ_REF_ROUTES[part];
    return route ? (
      <Link key={i} to={route} style={{ color: 'var(--brass)', textDecoration: 'underline' }}>
        {part}
      </Link>
    ) : (
      part
    );
  });
}

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
    <div className="ed-root">
      <EditorialHeader />
      <div className="ed-full" style={{ maxWidth: '72rem', padding: '28px 34px 70px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 className="ed-h1" style={{ marginBottom: 10 }}>Key Concepts &amp; Definitions</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, maxWidth: 760 }}>
            Prefer film? This glossary is also rendered as nine flash-card decks —
            start with the foundations deck below; the full series is on the{' '}
            <a href="#/animations" style={{ color: 'var(--blue)' }}>animations page</a>.
          </p>
          <AnimationEmbed id="concepts-foundations" />
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, maxWidth: 760 }}>
            A reference guide to the mathematical ideas behind the Riemann Hypothesis and the
            Twin-Ladder Bridge model. Start with Foundations and work your way through.
          </p>
        </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search concepts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '8px 12px', borderRadius: 6, border: '1px solid var(--hairline)',
            background: 'var(--paper2)', color: 'var(--ink)', fontSize: 14, width: 220,
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
      <div className="card" style={{ marginBottom: 20, borderLeft: '3px solid var(--blue)' }}>
        <h3 style={{ color: 'var(--blue)', fontSize: 14, marginBottom: 12 }}>Quick Notation Reference</h3>
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
            <div key={i} style={{ padding: '6px 8px', background: 'rgba(63,107,134,0.06)', borderRadius: 4, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ flexShrink: 0 }}><InlineMath tex={sym} /></span>
              <span style={{ color: 'var(--faint)', fontSize: 11 }}>{meaning}</span>
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
                <h3 style={{ margin: 0, color: 'var(--ink)', fontSize: 17 }}>
                  {concept.headwordRoute ? (
                    <Link to={concept.headwordRoute} style={{ color: 'var(--ink)', textDecoration: 'underline' }}>
                      {concept.term}
                    </Link>
                  ) : (
                    concept.term
                  )}
                </h3>
                {concept.symbol && (
                  <span style={{ marginLeft: 'auto' }}>
                    <InlineMath tex={concept.symbol} />
                  </span>
                )}
              </div>
              <p style={{ margin: '0 0 8px', color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.7 }}>
                {linkifyVizRefs(concept.definition)}
              </p>
              {concept.formula && (
                <div style={{ margin: '8px 0' }}>
                  <BlockMath tex={concept.formula} />
                </div>
              )}
              {concept.intuition && (
                <div style={{
                  padding: '8px 12px', background: 'rgba(63,107,134,0.07)',
                  borderLeft: '2px solid var(--blue)', borderRadius: '0 6px 6px 0',
                  fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 8,
                }}>
                  <strong style={{ color: 'var(--blue)' }}>Intuition:</strong> {linkifyVizRefs(concept.intuition)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Deep Dive: Connes' Noncommutative Geometry ─── */}
      <div className="card" style={{ marginTop: 32, borderLeft: '3px solid var(--terra-dk)' }}>
        <h3 style={{ color: 'var(--terra-dk)', fontSize: 18, marginBottom: 16 }}>
          Deep Dive: Connes' Noncommutative Geometry Approach to RH
        </h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8, marginBottom: 16 }}>
          Alain Connes' approach is the most developed spectral framework for the Riemann Hypothesis.
          It provides the theoretical foundation for our Twin-Ladder Bridge operator construction (S5).
        </p>

        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(194,58,28,0.06)', border: '1px solid rgba(194,58,28,0.20)' }}>
            <h4 style={{ color: 'var(--terra-dk)', fontSize: 14, marginBottom: 8 }}>1. The Adele Class Space</h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
              The starting point is the <strong>adele ring</strong> <InlineMath tex="\mathbb{A}_\mathbb{Q} = \mathbb{R} \times \prod'_p \mathbb{Q}_p" />,
              which packages all completions of ℚ (real and p-adic) into one object. The quotient{' '}
              <InlineMath tex="\mathbb{A}_\mathbb{Q} / \mathbb{Q}^*" /> is the <strong>adele class space</strong>.
              Connes showed that <InlineMath tex="L^2(\mathbb{A}_\mathbb{Q}/\mathbb{Q}^*)" /> carries a natural
              representation of the idele class group, and the spectral decomposition of this representation
              encodes the nontrivial zeros of ζ(s).
            </p>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(63,107,134,0.06)', border: '1px solid rgba(63,107,134,0.20)' }}>
            <h4 style={{ color: 'var(--blue)', fontSize: 14, marginBottom: 8 }}>2. The Weil Proof for Function Fields</h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
              For function fields over finite fields <InlineMath tex="\mathbb{F}_q" />, RH was proved by Weil (1948)
              using the <strong>Frobenius endomorphism</strong> acting on étale cohomology. The eigenvalues of Frobenius
              have absolute value <InlineMath tex="q^{1/2}" /> — this IS the Riemann Hypothesis in that setting.
              Connes' program aims to find the analogue of Frobenius for <InlineMath tex="\mathbb{Q}" />.
            </p>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(76,122,74,0.06)', border: '1px solid rgba(76,122,74,0.20)' }}>
            <h4 style={{ color: 'var(--green)', fontSize: 14, marginBottom: 8 }}>3. The Spectral Realization</h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
              On <InlineMath tex="L^2(\mathbb{A}_\mathbb{Q}/\mathbb{Q}^*)" />, the scaling action{' '}
              <InlineMath tex="f(x) \mapsto f(\lambda x)" /> generates a one-parameter group whose infinitesimal
              generator <InlineMath tex="\Theta" /> has spectrum related to the zeros of ζ(s). Connes proved that the
              "absorption spectrum" (where the representation fails to be unitary) coincides with{' '}
              <InlineMath tex="\{\gamma_n : \zeta(\tfrac{1}{2}+i\gamma_n)=0\}" />.
            </p>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(181,138,46,0.06)', border: '1px solid rgba(181,138,46,0.20)' }}>
            <h4 style={{ color: 'var(--brass-dk)', fontSize: 14, marginBottom: 8 }}>4. Connection to ZPO</h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
              Our Twin-Ladder Bridge coupling matrix <InlineMath tex="M_{jk} = \gamma_j\delta_{jk} + \sum_p \frac{\log p}{p}\cos((\gamma_j-\gamma_k)\log p)" /> is
              a <strong>finite-dimensional approximation</strong> to Connes' operator Θ. The diagonal terms are
              the zeros themselves; the off-diagonal coupling via primes mirrors the action of Frobenius
              on cohomology. As the matrix size grows, the eigenvalues converge to the actual zeros —
              this is precisely the Deninger determinant convergence we demonstrated.
            </p>
            <BlockMath tex="\text{ZPO: } \det(sI - M_N) \;\xrightarrow{N\to\infty}\; \xi(s) = \det_\infty(s - \Theta)" />
          </div>

          <div style={{ padding: '12px 16px', borderRadius: 8, background: 'rgba(140,106,29,0.06)', border: '1px solid rgba(140,106,29,0.20)' }}>
            <h4 style={{ color: 'var(--brass)', fontSize: 14, marginBottom: 8 }}>5. The 2026 Breakthrough</h4>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.8 }}>
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

      <div className="card" style={{ marginTop: 24, background: 'rgba(63,107,134,0.05)' }}>
        <h3 style={{ color: 'var(--faint)', fontSize: 13, marginBottom: 10 }}>Related Pages</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <Link to="/literature" style={{ color: 'var(--blue)', fontSize: 13 }}>Literature</Link>
          <span style={{ color: 'var(--hairline)' }}>|</span>
          <Link to="/paper" style={{ color: 'var(--blue)', fontSize: 13 }}>Paper</Link>
          <span style={{ color: 'var(--hairline)' }}>|</span>
          <Link to="/history" style={{ color: 'var(--blue)', fontSize: 13 }}>History</Link>
          <span style={{ color: 'var(--hairline)' }}>|</span>
          <Link to="/docs" style={{ color: 'var(--blue)', fontSize: 13 }}>Documentation</Link>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <Link
          to="/"
          style={{
            color: 'var(--brass-dk)',
            fontFamily: 'var(--ed-mono, var(--font-mono))',
            fontSize: 12,
            textDecoration: 'none',
          }}
        >
          ← the atlas
        </Link>
      </div>
      </div>
    </div>
  );
}
