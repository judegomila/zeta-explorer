export const INSIGHT_NODES = [
  // Foundation layer
  { id: 'euler-product', label: 'Euler Product', category: 'foundation', status: 'proven', page: '/oscillators',
    description: '\u03b6(s) = \u220f(1-p^{-s})^{-1} \u2014 each factor is a transfer function' },
  { id: 'functional-eq', label: 'Functional Equation', category: 'foundation', status: 'proven', page: '/hamiltonian',
    description: '\u03be(s) = \u03be(1-s) \u2014 direct/dual symmetry' },
  { id: 'analytic-cont', label: 'Analytic Continuation', category: 'foundation', status: 'proven', page: '/zeta',
    description: '\u03b6(s) defined for all s \u2260 1 via eta relation' },

  // Model layer
  { id: 'single-oscillator', label: 'Single Oscillator', category: 'model', status: 'proven', page: '/oscillators',
    description: 'H_p(s) = 1/(1-p^{-s}) as LC resonator' },
  { id: 'ladder-chain', label: 'Ladder Chain', category: 'model', status: 'proven', page: '/oscillators',
    description: 'Cascade of prime oscillators = Euler product' },
  { id: 'twin-ladder', label: 'Twin Ladder', category: 'model', status: 'proven', page: '/waves',
    description: 'Direct + Dual ladders coupled by bridge \u03c7(s)' },
  { id: 'bridge-unitarity', label: 'Bridge Unitarity', category: 'model', status: 'proven', page: '/control',
    description: '|\u03c7(\u00bd+it)| = 1 \u2014 lossless on critical line' },
  { id: 'hamiltonian', label: 'Hamiltonian', category: 'model', status: 'conditional', page: '/hamiltonian',
    description: 'H(\u03c3,t) minimized at \u03c3=\u00bd \u2014 conditional on operator construction' },

  // Analysis layer
  { id: 'kl-lyapunov', label: 'KL Lyapunov', category: 'analysis', status: 'conditional', page: '/spectral-attack',
    description: 'D_KL \u2192 0 at \u03c3=\u00bd as Lyapunov stability function' },
  { id: 'fisher-info', label: 'Fisher Information', category: 'analysis', status: 'conditional', page: '/spectral-attack',
    description: 'Fisher information diverges at zeros \u2014 confinement wall' },
  { id: 'unified-potential', label: 'Unified Potential', category: 'analysis', status: 'conditional', page: '/spectral-attack',
    description: '\u03a6(\u03c3,t) = weighted sum of 6 measures, minimum at \u03c3=\u00bd' },
  { id: 'gue-statistics', label: 'GUE Statistics', category: 'analysis', status: 'proven', page: '/statistics',
    description: 'Zero spacing matches Gaussian Unitary Ensemble' },
  { id: 'li-criterion', label: 'Li Criterion', category: 'analysis', status: 'conditional', page: '/statistics',
    description: '\u03bb_n \u2265 0 for all n \u27fa RH' },
  { id: 'weil-form', label: 'Weil Quadratic Form', category: 'analysis', status: 'conditional', page: '/spectral-attack',
    description: 'Extremizing W finds zeros using only small primes (Connes 2026)' },
  { id: 'twistor-incidence', label: 'Twistor Incidence', category: 'analysis', status: 'conditional', page: '/twistor',
    description: 'Z\u00b7W = 0 \u27fa \u03c3 = \u00bd \u2014 incidence relation' },
  { id: 'info-entropy', label: 'Information Entropy', category: 'analysis', status: 'conditional', page: '/info-theory',
    description: 'Shannon entropy maximized at \u03c3=\u00bd' },
  { id: 'chaitin-complexity', label: 'Chaitin Complexity', category: 'analysis', status: 'conditional', page: '/odd-zeta',
    description: 'Kolmogorov complexity bounds for \u03b6(odd) irrationality' },

  // Gap layer
  { id: 'gap-s4', label: 'S4: Regularization', category: 'gap', status: 'gap', page: '/gap-closing',
    description: 'Extend Euler product to critical strip via eta relation' },
  { id: 'gap-s5', label: 'S5: Hilbert-P\u00f3lya', category: 'gap', status: 'gap', page: '/gap-closing',
    description: 'Construct self-adjoint operator with spectrum = zeros' },
  { id: 'gap-s7', label: 'S7: Darlington', category: 'gap', status: 'gap', page: '/gap-closing',
    description: 'Prove infinite twin-ladder satisfies Darlington losslessness' },

  // Deep analysis layer
  { id: 'weil-positivity', label: 'Weil Positivity', category: 'analysis', status: 'conditional', page: '/spectral-attack',
    description: 'W[f] \u2265 0 \u21d4 H_ZPO positive semi-definite \u2014 Connes energy minimization' },
  { id: 'davenport-heilbronn', label: 'Davenport-Heilbronn', category: 'analysis', status: 'proven', page: '/gap-closing',
    description: 'Evil twin counterexample: functional eq without Euler product \u21d2 off-line zeros' },
  { id: 'berry-keating', label: 'Berry-Keating xp', category: 'model', status: 'conditional', page: '/hamiltonian',
    description: 'H = xp semiclassical quantization: prime orbits with period log p' },
  { id: 'bost-connes', label: 'Bost-Connes System', category: 'analysis', status: 'proven', page: '/statistics',
    description: 'Primon gas phase transition at \u03c3 = 1, supercritical equilibrium at \u03c3 = \u00bd' },
  { id: 'selberg-trace', label: 'Selberg Trace', category: 'analysis', status: 'proven', page: '/statistics',
    description: 'Spectral = geometric: eigenvalue sum = prime orbit sum' },
  { id: 'nyman-beurling', label: 'Nyman-Beurling', category: 'analysis', status: 'conditional', page: '/spectral-attack',
    description: 'RH \u21d4 density of fractional parts in L\u00b2(0,1)' },
  { id: 'spectral-form-factor', label: 'Spectral Form Factor', category: 'analysis', status: 'proven', page: '/statistics',
    description: 'K(\u03c4) dip-ramp-plateau confirms GUE quantum chaos' },
  { id: 'connes-trace', label: 'Connes Trace Formula', category: 'analysis', status: 'conditional', page: '/spectral-attack',
    description: 'Adele class space: zeros = eigenvalues of scaling flow' },

  // Frontier layer (2024-2026 research)
  { id: 'zeta-spectral-triple', label: 'Zeta Spectral Triple', category: 'analysis', status: 'conditional', page: '/reasoning',
    description: 'Connes 2025: rank-one perturbation of scaling operator. Self-adjoint for finite truncations.' },
  { id: 'guth-maynard', label: 'Guth-Maynard', category: 'analysis', status: 'proven', page: '/reasoning',
    description: 'Zero-density exponent 0.6 \u2192 0.52 via Dirichlet polynomial large value estimates (2024)' },
  { id: 'monotone-contraction', label: 'Monotone Contraction', category: 'gap', status: 'gap', page: '/reasoning',
    description: '\u2016\u0394_{N+1}\u2016 \u2264 \u2016\u0394_N\u2016\u00b7(1-c/p_{N+1}) \u2192 geometric convergence to unitarity' },
  { id: 'caratheodory-fejer', label: 'Carath\u00e9odory-Fej\u00e9r', category: 'analysis', status: 'proven', page: '/reasoning',
    description: 'Toeplitz PSD \u21d4 trigonometric polynomial \u2265 0 \u2014 guarantees self-adjointness' },

  // Target
  { id: 'rh', label: 'Riemann Hypothesis', category: 'target', status: 'open', page: '/formal-proof',
    description: 'All nontrivial zeros have Re(\u03c1) = \u00bd' },
];

export const INSIGHT_EDGES = [
  // Foundation -> Model
  { from: 'euler-product', to: 'single-oscillator', type: 'derives' },
  { from: 'single-oscillator', to: 'ladder-chain', type: 'composes' },
  { from: 'functional-eq', to: 'twin-ladder', type: 'derives' },
  { from: 'ladder-chain', to: 'twin-ladder', type: 'composes' },
  { from: 'functional-eq', to: 'bridge-unitarity', type: 'derives' },
  { from: 'twin-ladder', to: 'hamiltonian', type: 'derives' },
  { from: 'analytic-cont', to: 'gap-s4', type: 'requires' },

  // Model -> Analysis
  { from: 'bridge-unitarity', to: 'kl-lyapunov', type: 'inspires' },
  { from: 'ladder-chain', to: 'fisher-info', type: 'inspires' },
  { from: 'kl-lyapunov', to: 'unified-potential', type: 'composes' },
  { from: 'fisher-info', to: 'unified-potential', type: 'composes' },
  { from: 'bridge-unitarity', to: 'twistor-incidence', type: 'analogous' },
  { from: 'twin-ladder', to: 'info-entropy', type: 'inspires' },
  { from: 'info-entropy', to: 'chaitin-complexity', type: 'extends' },
  { from: 'euler-product', to: 'weil-form', type: 'derives' },
  { from: 'functional-eq', to: 'weil-form', type: 'derives' },
  { from: 'gue-statistics', to: 'gap-s5', type: 'supports' },
  { from: 'li-criterion', to: 'rh', type: 'equivalent' },

  // Analysis -> Gaps
  { from: 'hamiltonian', to: 'gap-s5', type: 'requires' },
  { from: 'unified-potential', to: 'gap-s5', type: 'supports' },
  { from: 'twin-ladder', to: 'gap-s7', type: 'requires' },
  { from: 'weil-form', to: 'gap-s5', type: 'supports' },
  { from: 'twistor-incidence', to: 'gap-s7', type: 'supports' },

  // Gaps -> RH
  { from: 'gap-s4', to: 'gap-s5', type: 'requires' },
  { from: 'gap-s4', to: 'gap-s7', type: 'requires' },
  { from: 'gap-s5', to: 'rh', type: 'proves' },
  { from: 'gap-s7', to: 'rh', type: 'proves' },

  // Creative cross-connections
  { from: 'weil-form', to: 'info-entropy', type: 'inspires' },
  { from: 'gue-statistics', to: 'unified-potential', type: 'supports' },
  { from: 'li-criterion', to: 'bridge-unitarity', type: 'derives' },
  { from: 'weil-form', to: 'chaitin-complexity', type: 'inspires' },
  { from: 'analytic-cont', to: 'twin-ladder', type: 'requires' },

  // Weil positivity connections
  { from: 'weil-form', to: 'weil-positivity', type: 'derives' },
  { from: 'hamiltonian', to: 'weil-positivity', type: 'inspires' },
  { from: 'weil-positivity', to: 'rh', type: 'supports' },
  { from: 'weil-positivity', to: 'gap-s5', type: 'supports' },

  // Davenport-Heilbronn connections
  { from: 'functional-eq', to: 'davenport-heilbronn', type: 'derives' },
  { from: 'davenport-heilbronn', to: 'euler-product', type: 'supports' },
  { from: 'davenport-heilbronn', to: 'gap-s7', type: 'supports' },
  { from: 'bridge-unitarity', to: 'davenport-heilbronn', type: 'inspires' },

  // Berry-Keating connections
  { from: 'berry-keating', to: 'hamiltonian', type: 'derives' },
  { from: 'single-oscillator', to: 'berry-keating', type: 'inspires' },
  { from: 'berry-keating', to: 'gap-s5', type: 'supports' },
  { from: 'berry-keating', to: 'gue-statistics', type: 'supports' },

  // Bost-Connes connections
  { from: 'euler-product', to: 'bost-connes', type: 'derives' },
  { from: 'analytic-cont', to: 'bost-connes', type: 'requires' },
  { from: 'bost-connes', to: 'unified-potential', type: 'inspires' },
  { from: 'bost-connes', to: 'gap-s4', type: 'supports' },

  // Deep cross-layer connections
  { from: 'davenport-heilbronn', to: 'weil-positivity', type: 'supports' }, // D-H shows Weil positivity fails without Euler product
  { from: 'twistor-incidence', to: 'weil-positivity', type: 'analogous' }, // Both encode sigma=1/2 as geometric condition
  { from: 'bost-connes', to: 'berry-keating', type: 'inspires' }, // Partition function connects to xp quantization
  { from: 'info-entropy', to: 'unified-potential', type: 'composes' }, // Shannon entropy is one of the 6 measures

  // Selberg trace connections
  { from: 'euler-product', to: 'selberg-trace', type: 'derives' },
  { from: 'selberg-trace', to: 'gue-statistics', type: 'derives' },
  { from: 'selberg-trace', to: 'berry-keating', type: 'inspires' },
  { from: 'ladder-chain', to: 'selberg-trace', type: 'analogous' }, // Ladder harmonics = geodesic lengths

  // Nyman-Beurling connections
  { from: 'analytic-cont', to: 'nyman-beurling', type: 'requires' },
  { from: 'nyman-beurling', to: 'rh', type: 'equivalent' },
  { from: 'ladder-chain', to: 'nyman-beurling', type: 'analogous' }, // Sub-ladder approximation = L² density
  { from: 'nyman-beurling', to: 'unified-potential', type: 'inspires' },

  // Spectral form factor connections
  { from: 'gue-statistics', to: 'spectral-form-factor', type: 'derives' },
  { from: 'spectral-form-factor', to: 'gap-s5', type: 'supports' },
  { from: 'berry-keating', to: 'spectral-form-factor', type: 'inspires' },

  // Connes trace formula connections
  { from: 'euler-product', to: 'connes-trace', type: 'derives' },
  { from: 'functional-eq', to: 'connes-trace', type: 'derives' },
  { from: 'connes-trace', to: 'weil-positivity', type: 'derives' },
  { from: 'connes-trace', to: 'gap-s5', type: 'supports' },
  { from: 'twin-ladder', to: 'connes-trace', type: 'analogous' }, // Twin ladder = archimedean/p-adic decomposition

  // Cross-cutting connections between new and old nodes
  { from: 'nyman-beurling', to: 'li-criterion', type: 'analogous' }, // Both are RH equivalences from different angles
  { from: 'selberg-trace', to: 'connes-trace', type: 'inspires' }, // Selberg trace generalizes to Connes trace
  { from: 'spectral-form-factor', to: 'bost-connes', type: 'inspires' }, // Both connect to thermodynamic ensembles
  { from: 'connes-trace', to: 'nyman-beurling', type: 'inspires' }, // Adelic framework contextualizes L² criterion

  // Zeta Spectral Triple connections (Connes 2025)
  { from: 'connes-trace', to: 'zeta-spectral-triple', type: 'derives' },
  { from: 'euler-product', to: 'zeta-spectral-triple', type: 'derives' },
  { from: 'bridge-unitarity', to: 'zeta-spectral-triple', type: 'analogous' }, // Bridge = rank-one perturbation
  { from: 'zeta-spectral-triple', to: 'gap-s5', type: 'supports' }, // Self-adjointness proven for finite case
  { from: 'zeta-spectral-triple', to: 'rh', type: 'supports' },
  { from: 'caratheodory-fejer', to: 'zeta-spectral-triple', type: 'derives' }, // C-F guarantees self-adjointness

  // Carathéodory-Fejér connections
  { from: 'weil-positivity', to: 'caratheodory-fejer', type: 'analogous' }, // Both are positivity conditions
  { from: 'caratheodory-fejer', to: 'gap-s7', type: 'supports' }, // C-F positivity ↔ Darlington losslessness

  // Guth-Maynard connections
  { from: 'euler-product', to: 'guth-maynard', type: 'derives' },
  { from: 'ladder-chain', to: 'guth-maynard', type: 'analogous' }, // Dirichlet polynomials = sub-ladders
  { from: 'guth-maynard', to: 'gap-s7', type: 'supports' }, // Tighter zero-density → tighter unitarity bounds

  // Monotone contraction connections
  { from: 'gap-s7', to: 'monotone-contraction', type: 'requires' },
  { from: 'davenport-heilbronn', to: 'monotone-contraction', type: 'supports' }, // D-H shows Euler product is essential
  { from: 'monotone-contraction', to: 'rh', type: 'proves' }, // If proven, RH follows
  { from: 'bost-connes', to: 'monotone-contraction', type: 'inspires' }, // Phase transition structure
];

// Status colors
export const STATUS_COLORS = {
  proven: '#10b981',
  conditional: '#f59e0b',
  gap: '#f97316',
  open: '#ef4444',
};

// Category colors
export const CATEGORY_COLORS = {
  foundation: '#3b82f6',
  model: '#8b5cf6',
  analysis: '#06b6d4',
  gap: '#f97316',
  target: '#ef4444',
};
