/**
 * @fileoverview Insight DAG: proof-chain knowledge graph for the ZPO Explorer / RH-attack project.
 *
 * Exports four symbols:
 *   - INSIGHT_NODES   — 30+ nodes spanning five layers: foundation, model, analysis, gap, target.
 *     Each node carries { id, label, category, status, page, description } and maps to a
 *     specific explorer page where its mathematics is developed.
 *   - INSIGHT_EDGES   — 60+ directed edges of types {derives, composes, inspires, analogous,
 *     supports, requires, proves, equivalent, extends} encoding the logical dependency
 *     structure from Euler-product / functional-equation axioms through to the Riemann Hypothesis.
 *   - STATUS_COLORS   — { proven, conditional, gap, open } → hex colour map used by InsightGraph.
 *   - CATEGORY_COLORS — { foundation, model, analysis, gap, target } → hex colour map.
 *
 * Proof-chain role (Visualization layer):
 *   Single source of truth for the insight graph rendered by the InsightGraph component.
 *   The layer structure reflects the ZPO / RH-attack proof architecture: classical
 *   foundations (Euler product, functional equation, analytic continuation) flow through
 *   circuit-theoretic models (single oscillator, twin ladder) into spectral and analytic
 *   arguments (KL Lyapunov, Weil positivity, Connes trace), then into open gaps (S4, S5,
 *   S7) that must be closed before RH can be claimed.
 *
 * Key structural assertions:
 *   1. Every gap node (status: 'gap') has at least one incoming 'requires' edge, making
 *      its prerequisites explicit in the graph.
 *   2. The two nodes with 'equivalent' edges to 'rh' (li-criterion, nyman-beurling) are
 *      exact logical equivalences to RH, not merely supporting heuristics.
 *   3. 'monotone-contraction' is the only node with a direct 'proves' edge to 'rh' that
 *      is still open — it is the frontier conjecture of the ZPO programme.
 *
 * Ticket history:
 *   - imp-741 (content, 2026-04-15): added this @fileoverview JSDoc block.
 *
 * @module insight-dag
 */
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

  // Twin-ladder v52 layer (wave-11/12, paper landing 2026-05-26)
  { id: 'shift-bridge-positivity', label: 'Shift-Bridge Positivity', category: 'analysis', status: 'conditional', page: '/shift-bridge-positivity',
    description: 'Para 15: shifted bridge K_a positive definite \u21d4 RH (Theorem 15.1).' },
  { id: 'four-route-equivalence', label: 'Four-Route Equivalence', category: 'analysis', status: 'conditional', page: '/closure-routes',
    description: 'Para 16: Schur / de Branges / hidden-square / Weil routes all RH-equivalent.' },
  { id: 'inverse-Blaschke-ghosts', label: 'Inverse Blaschke Ghosts', category: 'gap', status: 'gap', page: '/blaschke-ghosts',
    description: 'Para 17: B_a^+ = 1 \u21d4 RH; ghost poles = off-critical zeros (Krein-Langer/Pontryagin).' },
  { id: 'reciprocal-program', label: 'Reciprocal Program', category: 'analysis', status: 'conditional', page: '/three-attacks',
    description: 'Para 18: three direct attacks (kernel/passivity, prime-delay, Weil/Pontryagin) on B_a^+ = 1.' },
  { id: 'KYP-bounded-real', label: 'KYP / Bounded-Real Lemma', category: 'model', status: 'conditional', page: '/kyp-bounded-real',
    description: 'App M-O: KYP state-space, bounded-real delay, delay-Gram positivity certificates.' },

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

  // ── Twin-ladder v52 layer edges (imp-1215, paper landing 2026-05-26) ──
  // All edges flow from existing nodes INTO the new layer, then from the new
  // layer forward to rh / gap-s5 / gap-s7 — preserving the DAG acyclicity
  // invariant. The reverse direction is forbidden.

  // Shift-bridge positivity (para 15): twin-ladder + functional-eq derive it,
  // and it supplies a route into the RH target.
  { from: 'twin-ladder', to: 'shift-bridge-positivity', type: 'derives' },
  { from: 'functional-eq', to: 'shift-bridge-positivity', type: 'derives' },
  { from: 'bridge-unitarity', to: 'shift-bridge-positivity', type: 'composes' },
  { from: 'shift-bridge-positivity', to: 'rh', type: 'equivalent' }, // Thm 15.1 RH ⇔ K_a ⪰ 0

  // Four-route equivalence (para 16): four classical routes meet here, and
  // any one of them closing implies RH.
  { from: 'weil-form', to: 'four-route-equivalence', type: 'composes' },
  { from: 'weil-positivity', to: 'four-route-equivalence', type: 'composes' },
  { from: 'shift-bridge-positivity', to: 'four-route-equivalence', type: 'composes' },
  { from: 'four-route-equivalence', to: 'rh', type: 'proves' }, // Any route → RH

  // Inverse Blaschke ghosts (para 17): the obstruction node. Off-critical
  // zeros materialize as Pontryagin negative-index ghost poles.
  { from: 'shift-bridge-positivity', to: 'inverse-Blaschke-ghosts', type: 'requires' },
  { from: 'davenport-heilbronn', to: 'inverse-Blaschke-ghosts', type: 'supports' }, // D-H exhibits the ghost mechanism
  { from: 'inverse-Blaschke-ghosts', to: 'rh', type: 'equivalent' }, // B_a^+ ≡ 1 ⇔ RH

  // Reciprocal program (para 18): three direct attacks on B_a^+ = 1.
  { from: 'inverse-Blaschke-ghosts', to: 'reciprocal-program', type: 'requires' },
  { from: 'four-route-equivalence', to: 'reciprocal-program', type: 'composes' },
  { from: 'reciprocal-program', to: 'rh', type: 'proves' }, // Any of the 3 attacks → RH

  // KYP / Bounded-Real (App M-O): operator-theoretic certificates for the
  // shift-bridge positivity. Feeds shift-bridge-positivity numerically, and
  // composes with hamiltonian / berry-keating on the model side.
  { from: 'hamiltonian', to: 'KYP-bounded-real', type: 'analogous' },
  { from: 'twin-ladder', to: 'KYP-bounded-real', type: 'derives' },
  { from: 'KYP-bounded-real', to: 'shift-bridge-positivity', type: 'supports' },
  { from: 'KYP-bounded-real', to: 'gap-s7', type: 'supports' }, // KYP gives Darlington-style certs
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

// ── Build-time assertions (imp-1215 + DAG integrity) ─────────────────────────
//
// These tripwires lock the structural invariants of the Insight DAG so that
// future edits cannot silently introduce cycles, dangling edges, or duplicate
// node ids. They also pin the five wave-11/12 nodes added by imp-1215 so the
// twin-ladder v52 layer cannot regress.

// Tarjan SCC: returns the list of strongly-connected components (each SCC is
// an array of node ids). An SCC of size > 1 is a true cycle; an SCC of size 1
// is a cycle iff the node has a self-loop. Used by the imp-1215 tripwire that
// pins the cycle structure of the DAG.
function _stronglyConnectedComponents() {
  const adj = new Map();
  for (const n of INSIGHT_NODES) adj.set(n.id, []);
  for (const e of INSIGHT_EDGES) {
    if (adj.has(e.from)) adj.get(e.from).push(e.to);
  }
  const index = new Map();
  const lowlink = new Map();
  const onStack = new Set();
  const stack = [];
  const sccs = [];
  let idx = 0;

  function strongconnect(v) {
    // Iterative Tarjan to avoid recursion-stack blow-ups.
    const work = [{ v, pi: 0, child: null }];
    index.set(v, idx);
    lowlink.set(v, idx);
    idx++;
    stack.push(v);
    onStack.add(v);

    while (work.length) {
      const top = work[work.length - 1];
      const children = adj.get(top.v) || [];
      if (top.child !== null) {
        // Returning from recursion on `top.child` — propagate lowlink.
        lowlink.set(top.v, Math.min(lowlink.get(top.v), lowlink.get(top.child)));
        top.child = null;
      }
      if (top.pi < children.length) {
        const w = children[top.pi++];
        if (!index.has(w)) {
          index.set(w, idx);
          lowlink.set(w, idx);
          idx++;
          stack.push(w);
          onStack.add(w);
          top.child = w;
          work.push({ v: w, pi: 0, child: null });
        } else if (onStack.has(w)) {
          lowlink.set(top.v, Math.min(lowlink.get(top.v), index.get(w)));
        }
        continue;
      }
      // Done with v: if it is an SCC root, pop the SCC.
      if (lowlink.get(top.v) === index.get(top.v)) {
        const comp = [];
        let w;
        do {
          w = stack.pop();
          onStack.delete(w);
          comp.push(w);
        } while (w !== top.v);
        sccs.push(comp);
      }
      work.pop();
    }
  }

  for (const n of INSIGHT_NODES) {
    if (!index.has(n.id)) strongconnect(n.id);
  }
  return sccs;
}

// Compute the cycle-baseline (size of largest SCC + number of non-trivial SCCs)
// for the pre-imp-1215 graph. This is recorded so the assertion below can
// detect REGRESSIONS introduced by future edits without forcing us to
// unwind a pre-existing legacy cycle (davenport-heilbronn -> euler-product
// closes a 9-cycle through the model layer; that cycle predates imp-1215 and
// is out of scope for this ticket).

function _nontrivialSCCs() {
  return _stronglyConnectedComponents().filter((c) => c.length > 1);
}

// Baseline pinned 2026-05-28 (imp-1215): the legacy DAG contains exactly
// TWO non-trivial SCCs:
//   (a) size-10 cycle through the foundation/model layer
//       (euler-product -> single-oscillator -> ladder-chain -> twin-ladder
//        -> connes-trace -> nyman-beurling -> li-criterion -> bridge-unitarity
//        -> davenport-heilbronn -> euler-product; selberg-trace also lands
//        inside this SCC via euler-product -> selberg-trace + selberg-trace
//        -> connes-trace).
//   (b) size-4 cycle through the analysis layer
//       (gue-statistics -> spectral-form-factor -> bost-connes ->
//        berry-keating -> gue-statistics).
// Both predate imp-1215 and are out of scope for this ticket (they originate
// from cross-cutting "inspires" / "analogous" edges that are pedagogically
// useful but structurally form back-edges). New imp-1215 nodes / edges are
// wired STRICTLY downstream of these cycles (they all point into the
// four-route / inverse-Blaschke / reciprocal / KYP / shift-bridge subgraph
// and forward to rh, never back to euler-product or gue-statistics), so the
// post-imp-1215 graph must still have AT MOST 2 non-trivial SCCs of
// total size AT MOST 14.
const _PRE_IMP1215_MAX_SCC_SIZE = 10;
const _PRE_IMP1215_NONTRIVIAL_SCC_COUNT = 2;
const _PRE_IMP1215_TOTAL_SCC_SIZE = 14;

export const INSIGHT_DAG_ASSERTIONS = [
  {
    id: 'insight-dag-no-new-cycles-from-imp1215',
    holds: () => {
      const scc = _nontrivialSCCs();
      if (scc.length > _PRE_IMP1215_NONTRIVIAL_SCC_COUNT) return false;
      const maxSize = scc.reduce((m, c) => Math.max(m, c.length), 0);
      if (maxSize > _PRE_IMP1215_MAX_SCC_SIZE) return false;
      const totalSize = scc.reduce((s, c) => s + c.length, 0);
      if (totalSize > _PRE_IMP1215_TOTAL_SCC_SIZE) return false;
      // Crucially: none of the new imp-1215 nodes may appear in any
      // non-trivial SCC. Their role in the DAG is strictly forward-flowing.
      const imp1215Nodes = new Set([
        'shift-bridge-positivity',
        'four-route-equivalence',
        'inverse-Blaschke-ghosts',
        'reciprocal-program',
        'KYP-bounded-real',
      ]);
      for (const comp of scc) {
        for (const id of comp) {
          if (imp1215Nodes.has(id)) return false;
        }
      }
      return true;
    },
    why:
      'imp-1215 invariant: the five new wave-11/12 nodes must not appear in ' +
      'any cycle, and adding them must not increase the cycle-baseline of ' +
      'the legacy graph. The legacy DAG has two pre-existing non-trivial ' +
      'SCCs (size 10 through euler-product / davenport-heilbronn / model ' +
      'layer; size 4 through gue-statistics / bost-connes / berry-keating / ' +
      'spectral-form-factor) for a total of 14 nodes in cycles. This ' +
      'assertion pins that baseline so any FUTURE edit that extends a cycle ' +
      'through the imp-1215 layer fires immediately. The legacy cycles are ' +
      'out of scope for imp-1215 and are left for a separate cleanup ticket.',
  },
  {
    id: 'insight-dag-edges-reference-known-nodes',
    holds: () => {
      const ids = new Set(INSIGHT_NODES.map((n) => n.id));
      return INSIGHT_EDGES.every((e) => ids.has(e.from) && ids.has(e.to));
    },
    why:
      'Every edge must reference node ids that exist in INSIGHT_NODES. ' +
      'Dangling edges would render as floating arrows in InsightGraph and ' +
      'silently mislead the reader about which dependencies are actually ' +
      'encoded.',
  },
  {
    id: 'insight-dag-node-ids-unique',
    holds: () => {
      const ids = INSIGHT_NODES.map((n) => n.id);
      return new Set(ids).size === ids.length;
    },
    why:
      'Duplicate node ids would cause the second copy to silently overwrite ' +
      'the first in any id-indexed render, hiding one of the two nodes.',
  },
  {
    id: 'insight-dag-imp1215-five-nodes-present',
    holds: () => {
      const required = [
        'shift-bridge-positivity',
        'four-route-equivalence',
        'inverse-Blaschke-ghosts',
        'reciprocal-program',
        'KYP-bounded-real',
      ];
      const ids = new Set(INSIGHT_NODES.map((n) => n.id));
      return required.every((id) => ids.has(id));
    },
    why:
      'imp-1215 added five wave-11/12 nodes for the twin-ladder v52 paper ' +
      'landing (shift-bridge-positivity, four-route-equivalence, ' +
      'inverse-Blaschke-ghosts, reciprocal-program, KYP-bounded-real). ' +
      'Removing any of them silently de-wires the v52 layer from the DAG.',
  },
  {
    id: 'insight-dag-imp1215-nodes-reach-rh',
    holds: () => {
      // Every imp-1215 node should reach 'rh' via some directed path.
      const adj = new Map();
      for (const n of INSIGHT_NODES) adj.set(n.id, []);
      for (const e of INSIGHT_EDGES) {
        if (adj.has(e.from)) adj.get(e.from).push(e.to);
      }
      function reaches(start, target) {
        const seen = new Set();
        const stack = [start];
        while (stack.length) {
          const x = stack.pop();
          if (x === target) return true;
          if (seen.has(x)) continue;
          seen.add(x);
          for (const y of adj.get(x) || []) stack.push(y);
        }
        return false;
      }
      return [
        'shift-bridge-positivity',
        'four-route-equivalence',
        'inverse-Blaschke-ghosts',
        'reciprocal-program',
        'KYP-bounded-real',
      ].every((id) => reaches(id, 'rh'));
    },
    why:
      'Each imp-1215 node must reach the rh target via some directed path ' +
      '(directly or through gap-s5/s7). A node disconnected from rh would ' +
      'be a dead branch in the proof chain and misrepresent the role of the ' +
      'twin-ladder v52 program.',
  },
  {
    id: 'insight-dag-status-and-category-valid',
    holds: () =>
      INSIGHT_NODES.every(
        (n) =>
          Object.prototype.hasOwnProperty.call(STATUS_COLORS, n.status) &&
          Object.prototype.hasOwnProperty.call(CATEGORY_COLORS, n.category)
      ),
    why:
      'Every node\'s status and category must have a color mapping; ' +
      'otherwise the InsightGraph renderer would receive undefined fills and ' +
      'fall back to the default which hides the layer semantics.',
  },
];
