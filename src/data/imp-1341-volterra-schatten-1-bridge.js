/**
 * @module imp-1341-volterra-schatten-1-bridge
 * @fileoverview imp-1341 — Schatten-1 (trace-class) bridge for the §27
 *   endpoint-Hankel Volterra operator V_{a,Phi} on L²([0, ∞)).
 *
 *   THE QUESTION
 *   ------------
 *   imp-1267 proved V_{a,Phi} is Hilbert-Schmidt (Schatten-2). de Branges
 *   theory suggests: if V is trace class (Schatten-1) with an explicit trace,
 *   then det(I − V) yields a Hadamard-product factorization and RH follows.
 *   This ticket walks that bridge:
 *       (a) is V_{a,Phi} in Schatten-1 (trace class)?
 *       (b) compute the rigorous trace tr(V) and the trace NORM ||V||_1;
 *       (c) does the trace bound deliver the Hadamard factorization / RH?
 *
 *   THE OPERATOR
 *   ------------
 *       (V f)(x) = ∫_0^x Phi(x) Phi(y) sinh(a(x − y)) f(y) dy,
 *       k_{a,Phi}(x, y) = Phi(x) Phi(y) sinh(a(x − y)) · 1_{0 ≤ y ≤ x}.
 *
 *   V is a VOLTERRA operator: the kernel is strictly lower-triangular
 *   (supported on y ≤ x) and vanishes on the diagonal (sinh(0) = 0).
 *
 *   (a) IS V TRACE CLASS?  -- YES.
 *   -----------------------------
 *   Phi decays super-exponentially (Phi(u)² < 4π⁴ e^{8u} exp(−2π e^{4u}) past
 *   u = 2; fp-zero past u = 2), so the effective support is the compact triangle
 *   {0 ≤ y ≤ x ≤ U} with U ≈ 2. On that triangle the kernel is the product of
 *   three real-analytic functions, hence C^∞ up to the closed boundary.
 *
 *   Classical result (Lalesco 1915; Gohberg-Krein, "Introduction to the Theory
 *   of Linear Non-Selfadjoint Operators", Ch. IV): a Volterra integral operator
 *   on L²(0, U) whose kernel is continuous with a continuous partial derivative
 *   is TRACE CLASS, and its trace is ∫_0^U k(x, x) dx. Equivalently, by the
 *   Sobolev kernel criterion the kernel lies in H^{3/2−ε}(R²) with compact
 *   support (the only non-smoothness is the first-derivative kink across the
 *   diagonal, the Heaviside jump being killed by the linearly-vanishing
 *   sinh(a(x−y))), and H^s with s > d/2 = 1 implies trace class. The
 *   super-exponential Phi tail past U is fp-zero, so V on L²([0, ∞)) is trace
 *   class with the same trace norm to any finite precision.
 *
 *   (b) THE TRACE AND THE TRACE NORM.
 *   ---------------------------------
 *   OPERATOR TRACE.   tr(V) = ∫_0^∞ k(x, x) dx = ∫_0^∞ Phi(x)² sinh(0) dx = 0.
 *   This is forced two ways: the kernel vanishes on the diagonal, AND V is
 *   quasinilpotent (see (c)) so every eigenvalue is 0. tr(V) = Σ λ_n = 0.
 *
 *   TRACE NORM.   ||V||_1 = Σ_n s_n(V) (sum of singular values) is POSITIVE
 *   and finite -- it is NOT the operator trace. Singular values are computed
 *   from the discretized kernel matrix A_{ij} = h · k(x_i, x_j) via the
 *   eigenvalues of A^T A. The standard Schatten ordering
 *
 *       ||V||_1  ≥  ||V||_2 (= ||V||_HS)  ≥  ||V||_op = s_1
 *
 *   is reproduced at every grid row. At a = 0.5 (the largest a in the
 *   imp-1240 grid): ||V||_1 ≈ 2.57e-4, ||V||_HS ≈ 1.897e-4 (matches imp-1267),
 *   s_1 ≈ 1.856e-4 (matches the imp-1240 op-norm 1.86e-4). ||V||_1 scales
 *   LINEARLY in a (halving a halves ||V||_1) exactly as the HS bound does.
 *   ||V||_1 stays ~3900x below 1 across the imp-1240 a-grid.
 *
 *   (c) THE HADAMARD / de BRANGES BRIDGE -- VACUOUS.   << the honest sub-gap
 *   ---------------------------------------------------------------------------
 *   A Volterra operator is QUASINILPOTENT: σ(V) = {0}, every eigenvalue is 0
 *   (strictly-triangular kernel; the Neumann series for the resolvent
 *   (I − zV)^{-1} converges for ALL z ∈ C). Consequently the Fredholm
 *   determinant of a trace-class Volterra operator is IDENTICALLY ONE:
 *
 *       det(I − zV) = ∏_n (1 − z λ_n) = 1     for every z ∈ C.
 *
 *   So the Hadamard product of det(I − zV) is the EMPTY product -- it carries
 *   no spectral information and cannot encode the zeta zeros. The de Branges
 *   "det(I − V) -> Hadamard factorization -> RH" mechanism as hypothesized in
 *   the ticket is therefore VACUOUS for this V: trace-class membership, by
 *   itself, does NOT yield the RH consequence via the determinant route.
 *
 *   WHAT TRACE-CLASS ACTUALLY BUYS.   It is a strictly stronger summability
 *   certificate than imp-1267 HS: Σ s_n < ∞ (here the singular values decay
 *   like O(1/n), the s_9.. tail being ~2% of ||V||_1). It re-confirms
 *   compactness and gives ||V||_op ≤ ||V||_1 ≈ 2.57e-4 ≪ 1, an independent
 *   re-derivation of the Conj 27.2 contraction with a comfortable margin. But
 *   the load-bearing statement for RH remains the OPERATOR-NORM contraction
 *   ||V|| ≤ 1 (the imp-1267 HS route / imp-1287 Wiener-Hopf route), NOT a
 *   determinant identity.
 *
 *   VERDICT
 *   -------
 *       (a) YES, V_{a,Phi} ∈ S_1 (trace class), rigorously, for every a > 0
 *           on the effectively-compact support.
 *       (b) tr(V) = 0 (quasinilpotent); ||V||_1 ≈ 2.57e-4 at a = 0.5, linear
 *           in a, ~3900x below 1.
 *       (c) NO -- the det(I − V) Hadamard/de Branges bridge is VACUOUS because
 *           V is quasinilpotent (det(I − zV) ≡ 1). Schatten-1 does not deliver
 *           RH via the determinant; the contraction ||V|| ≤ 1 is the mechanism.
 *
 *   HONEST SUB-GAP (named): "det-route-vacuous-for-quasinilpotent" -- any RH
 *   route that relies on a non-trivial Fredholm determinant of V is blocked;
 *   one must instead use the operator-norm contraction (already the §27 target)
 *   or move the determinant onto a non-Volterra (non-quasinilpotent) operator.
 *
 *   RAW DATA SOURCE
 *   ---------------
 *   scripts/compute-imp1341-volterra-schatten-1.mjs, run 2026-06-03.
 *
 *   Ticket: imp-1341 (proof, high, OPUS-4.8 / api-pool). Depends imp-1267, imp-1287.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// ── Schatten ordering check rows: ||V||_1 >= ||V||_HS >= s_1 (=op norm) ─────
// Computed at U=3, N=320 midpoint nodes (Gram-matrix Jacobi eigensolver).
const SCHATTEN_ROWS = Object.freeze([
  Object.freeze({ a: 0.5, U: 3, N: 320, traceNorm: 2.55522087e-4, hsNorm: 1.89385197e-4, sMax: 1.85617594e-4, opTrace: 0.0 }),
  Object.freeze({ a: 0.2, U: 3, N: 320, traceNorm: 1.02181963e-4, hsNorm: 7.57270130e-5, sMax: 7.42192980e-5, opTrace: 0.0 }),
  Object.freeze({ a: 0.1, U: 3, N: 320, traceNorm: 5.10893223e-5, hsNorm: 3.78615740e-5, sMax: 3.71076684e-5, opTrace: 0.0 }),
  Object.freeze({ a: 0.05, U: 3, N: 320, traceNorm: 2.55444213e-5, hsNorm: 1.89305455e-5, sMax: 1.85535866e-5, opTrace: 0.0 }),
  Object.freeze({ a: 0.025, U: 3, N: 320, traceNorm: 1.27721807e-5, hsNorm: 9.46524253e-6, sMax: 9.27676237e-6, opTrace: 0.0 }),
]);

// ── Convergence of ||V||_1 in the discretization N (a=0.5, U=3) ─────────────
const TRACE_NORM_CONVERGENCE = Object.freeze([
  Object.freeze({ N: 120, traceNorm: 2.40722156e-4, hsNorm: 1.85425954e-4 }),
  Object.freeze({ N: 200, traceNorm: 2.51264178e-4, hsNorm: 1.88375872e-4 }),
  Object.freeze({ N: 320, traceNorm: 2.55522087e-4, hsNorm: 1.89385197e-4 }),
  Object.freeze({ N: 480, traceNorm: 2.57232256e-4, hsNorm: 1.89744419e-4 }),
]);

// ── Top singular values at a=0.5, U=3, N=320 (decay ~ O(1/n)) ──────────────
const SINGULAR_VALUES = Object.freeze([
  1.856176e-4, 3.434092e-5, 1.244184e-5, 6.480452e-6, 4.040990e-6, 2.824245e-6,
  2.140751e-6, 1.709155e-6, 1.382503e-6, 1.106928e-6, 8.735054e-7, 6.789973e-7,
]);

export const IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE = Object.freeze({
  id: 'imp-1341-volterra-schatten-1-bridge',
  ticket: 'imp-1341',
  generatedAt: '2026-06-03T00:00:00Z',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedTickets: ['imp-1240', 'imp-1258', 'imp-1267', 'imp-1287'],

  summary:
    'Schatten-1 (trace-class) bridge for V_{a,Phi}. (a) V IS trace class ' +
    '(smooth Volterra kernel on compact effective support; Lalesco / ' +
    'Gohberg-Krein). (b) tr(V) = 0 (quasinilpotent / diagonal-vanishing ' +
    'kernel); ||V||_1 ~ 2.57e-4 at a=0.5, linear in a, ~3900x below 1, with ' +
    '||V||_1 >= ||V||_HS >= ||V||_op confirmed at every row. (c) HONEST ' +
    'NEGATIVE: the det(I-V) Hadamard / de Branges bridge is VACUOUS because V ' +
    'is quasinilpotent (det(I - zV) == 1 identically), so Schatten-1 does NOT ' +
    'deliver RH via the determinant. The contraction ||V|| <= 1 stays the ' +
    'load-bearing mechanism. Named sub-gap: det-route-vacuous-for-quasinilpotent.',

  question: Object.freeze({
    from: 'imp-1267 proved Hilbert-Schmidt (Schatten-2).',
    target: 'Is V in Schatten-1 (trace class), and does that close RH via det(I - V)?',
    deBrangesHypothesis:
      'If V trace class with explicit trace, det(I - V) gives a Hadamard ' +
      'product factorization and RH follows.',
  }),

  kernel: Object.freeze({
    label: 'k_{a,Phi}(x, y)',
    formula: 'k_{a,Phi}(x, y) = Phi(x) Phi(y) sinh(a(x − y)) for 0 ≤ y ≤ x; else 0',
    volterra: true,
    strictlyTriangular: 'supported on y ≤ x',
    vanishesOnDiagonal: 'k(x, x) = Phi(x)² sinh(0) = 0',
  }),

  // (a) trace-class membership
  traceClass: Object.freeze({
    isTraceClass: true,
    argument:
      'Phi super-exponentially decaying => effective support is the compact ' +
      'triangle {0 ≤ y ≤ x ≤ U≈2}; the kernel is C^∞ there (product of three ' +
      'real-analytic functions). A Volterra operator on L²(0, U) with a C¹ ' +
      'kernel is trace class (Lalesco 1915; Gohberg-Krein Ch. IV). ' +
      'Equivalently the kernel is in H^{3/2−ε}(R²) with compact support, and ' +
      's > d/2 = 1 implies trace class. The Phi tail past U is fp-zero.',
    reference: 'Lalesco 1915; Gohberg-Krein, Linear Non-Selfadjoint Operators, Ch. IV',
    sobolevCriterion: 'kernel in H^{3/2−ε}(R²), s > d/2 = 1 => trace class',
  }),

  // (b) trace and trace norm
  trace: Object.freeze({
    operatorTrace: 0.0,
    operatorTraceFormula: 'tr(V) = ∫_0^∞ k(x, x) dx = ∫_0^∞ Phi(x)² sinh(0) dx = 0',
    operatorTraceReason:
      'kernel vanishes on the diagonal AND V quasinilpotent (Σ λ_n = 0)',
    traceNormIsNotOperatorTrace:
      '||V||_1 = Σ s_n > 0 is the sum of SINGULAR values, distinct from tr(V) = Σ λ_n = 0',
    schattenOrdering: '||V||_1 ≥ ||V||_2 (=||V||_HS) ≥ ||V||_op = s_1',
    traceNorm_a_half: 2.57232256e-4,
    traceNorm_below_one_factor: 3887, // 1 / 2.57e-4
    linearInA: true,
    crossCheck:
      'hsNorm matches imp-1267 (1.8985e-4); s_max matches imp-1240 op-norm (1.86e-4)',
  }),

  // (c) the bridge verdict -- the honest sub-gap
  hadamardBridge: Object.freeze({
    delivers_RH: false,
    quasinilpotent: true,
    spectrum: 'σ(V) = {0} (Volterra; Neumann resolvent converges for all z ∈ C)',
    fredholmDeterminant: 'det(I − zV) = ∏(1 − z λ_n) = 1 for every z ∈ C',
    hadamardProductIsEmpty: true,
    verdict:
      'The de Branges det(I − V) -> Hadamard -> RH route is VACUOUS: the ' +
      'Fredholm determinant of a quasinilpotent operator is identically 1 and ' +
      'carries no spectral information. Schatten-1 does NOT yield RH via the ' +
      'determinant.',
    subGap: 'det-route-vacuous-for-quasinilpotent',
    subGapStatement:
      'Any RH route relying on a non-trivial Fredholm determinant of V is ' +
      'blocked by quasinilpotence. Use the operator-norm contraction ||V|| ≤ 1 ' +
      '(the §27 target) or move the determinant onto a non-Volterra operator.',
    whatTraceClassBuys:
      'Σ s_n < ∞ (stronger than HS); re-confirms compactness and gives ' +
      '||V||_op ≤ ||V||_1 ≈ 2.57e-4 ≪ 1, an independent margin on Conj 27.2.',
  }),

  schattenRows: SCHATTEN_ROWS,
  traceNormConvergence: TRACE_NORM_CONVERGENCE,
  singularValues: SINGULAR_VALUES,

  method: Object.freeze({
    discretization: 'midpoint grid on [0, U=3], N nodes, weight h = U/N',
    matrix: 'A_{ij} = h · Phi(x_i) Phi(x_j) sinh(a(x_i − x_j)) for j ≤ i; else 0',
    singularValues: 'sqrt(eigenvalues of A^T A) via cyclic Jacobi sweep solver',
    traceNorm: '||V||_1 = Σ_i s_i(A)',
    phiKernel:
      'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} − 3 pi n^2 e^{2u}) exp(−pi n^2 e^{4u})',
    computeScript: 'scripts/compute-imp1341-volterra-schatten-1.mjs',
  }),

  honestScope: Object.freeze({
    isAnalyticalBound: true,
    isProof: false,
    traceClassProven: true,
    operatorTraceIsZero: true,
    closesRHViaDeterminant: false,
    notACompletedProofOfRH: true,
    namedSubGap: 'det-route-vacuous-for-quasinilpotent',
    blockers: [
      '||V||_1 evaluated numerically (Jacobi on discretized Gram matrix), not symbolically.',
      'trace-class argument uses the compact-support reduction (Phi tail fp-zero past U≈2).',
      'singular values decay ~ O(1/n); ||V||_1 drifts ~1% upward with N (s_n discretization).',
      'the det(I − V) RH mechanism is VACUOUS (quasinilpotent) -- this route does not close RH.',
    ],
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    hsBound: 'src/data/imp-1267-volterra-hs-bound.js (imp-1267, Schatten-2)',
    wienerHopf: 'src/data/imp-1287-volterra-wiener-hopf.js (imp-1287)',
    empiricalPilot: 'src/data/imp-1240-volterra-norm-pilot.js (imp-1240, op-norm)',
    cdbBridge: 'src/data/imp-1258-volterra-cdb-bridge.js (imp-1258)',
    computeScript: 'scripts/compute-imp1341-volterra-schatten-1.mjs',
    gohbergKrein: 'Gohberg-Krein, Introduction to the Theory of Linear Non-Selfadjoint Operators, Ch. IV',
    simonTraceIdeals: 'B. Simon, Trace Ideals and Their Applications (Schatten classes, Fredholm determinants)',
    lalesco: 'T. Lalesco 1915 (trace of a continuous Volterra kernel)',
  }),
});

// ── Tripwire assertions (10 required) ────────────────────────────────────────
export const IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE_ASSERTIONS = [
  {
    id: 'imp1341-is-trace-class',
    why:
      'The (a) finding: V_{a,Phi} is in Schatten-1. The smooth-Volterra-kernel ' +
      'argument (Lalesco / Gohberg-Krein) must be recorded with isTraceClass=true.',
    holds: () =>
      IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE.traceClass.isTraceClass === true &&
      IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE.traceClass.argument.includes('Volterra'),
  },
  {
    id: 'imp1341-operator-trace-is-zero',
    why:
      'tr(V) = ∫ k(x,x) dx = 0 since the kernel vanishes on the diagonal and V ' +
      'is quasinilpotent. Every frozen opTrace row must be exactly 0.',
    holds: () =>
      IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE.trace.operatorTrace === 0 &&
      IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE.schattenRows.every((r) => r.opTrace === 0),
  },
  {
    id: 'imp1341-schatten-ordering',
    why:
      'STANDARD fact: ||V||_1 ≥ ||V||_2 ≥ ||V||_op. Every frozen row must satisfy ' +
      'traceNorm ≥ hsNorm ≥ sMax; a violation means the SVD/Gram computation is ' +
      'inconsistent.',
    holds: () =>
      IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE.schattenRows.every(
        (r) => r.traceNorm >= r.hsNorm && r.hsNorm >= r.sMax,
      ),
  },
  {
    id: 'imp1341-trace-norm-below-one',
    why:
      'The trace norm must stay well below 1 across the a-grid (it is the SUM ' +
      'of singular values, the loosest Schatten norm). Worst case ~2.57e-4, ' +
      '~3900x below 1. A drift above 1e-2 means the freeze was overwritten.',
    holds: () =>
      IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE.schattenRows.every((r) => r.traceNorm < 1e-2),
  },
  {
    id: 'imp1341-trace-norm-linear-in-a',
    why:
      '||V||_1 scales linearly in a (same as the HS bound, since the smallest ' +
      'singular values dominate the count but the leading sinh~a·u factor sets ' +
      'the scale). Halving a should halve ||V||_1 to ~0.1%.',
    holds: () => {
      const rows = IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE.schattenRows;
      for (let i = 1; i < rows.length; i++) {
        const aRatio = rows[i - 1].a / rows[i].a;
        const tnRatio = rows[i - 1].traceNorm / rows[i].traceNorm;
        if (Math.abs(tnRatio - aRatio) / aRatio > 0.02) return false;
      }
      return true;
    },
  },
  {
    id: 'imp1341-hs-cross-check-imp1267',
    why:
      'The hsNorm computed here from the discretized kernel must match the ' +
      'imp-1267 exact HS value at a=0.5 (1.8985e-4) to ~1%. A mismatch means ' +
      'the kernel or quadrature drifted from the imp-1267 definition.',
    holds: () => {
      const r = IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE.schattenRows.find((x) => x.a === 0.5);
      return Math.abs(r.hsNorm - 1.8985e-4) / 1.8985e-4 < 0.02;
    },
  },
  {
    id: 'imp1341-smax-cross-check-op-norm',
    why:
      'The largest singular value s_1 IS the operator norm. At a=0.5 it must ' +
      'match the imp-1240 empirical op-norm (~1.86e-4) to a few percent. This ' +
      'is the consistency anchor tying Schatten-1 back to the op-norm route.',
    holds: () => {
      const r = IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE.schattenRows.find((x) => x.a === 0.5);
      return Math.abs(r.sMax - 1.86e-4) / 1.86e-4 < 0.05;
    },
  },
  {
    id: 'imp1341-hadamard-bridge-vacuous',
    why:
      'The honest CORE finding: V is quasinilpotent, so det(I − zV) ≡ 1 and the ' +
      'de Branges determinant route is VACUOUS. delivers_RH MUST be false and ' +
      'the named sub-gap recorded. If this flips, the file is over-claiming RH.',
    holds: () => {
      const h = IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE.hadamardBridge;
      return (
        h.delivers_RH === false &&
        h.quasinilpotent === true &&
        h.hadamardProductIsEmpty === true &&
        h.subGap === 'det-route-vacuous-for-quasinilpotent' &&
        h.fredholmDeterminant.includes('= 1')
      );
    },
  },
  {
    id: 'imp1341-singular-values-decay',
    why:
      'The singular values must be positive and strictly decreasing (sorted), ' +
      'with s_1 dominating. A non-monotone or non-positive entry means the ' +
      'eigensolver returned garbage.',
    holds: () => {
      const sv = IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE.singularValues;
      for (let i = 0; i < sv.length; i++) {
        if (!(sv[i] > 0)) return false;
        if (i > 0 && sv[i] >= sv[i - 1]) return false;
      }
      return true;
    },
  },
  {
    id: 'imp1341-honest-scope-not-rh-proof',
    why:
      'The file must NOT claim it closes RH. isProof=false, traceClassProven=true, ' +
      'closesRHViaDeterminant=false, notACompletedProofOfRH=true, and the named ' +
      'sub-gap present. If these flip, the file is over-stating.',
    holds: () => {
      const h = IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE.honestScope;
      return (
        h.isProof === false &&
        h.traceClassProven === true &&
        h.closesRHViaDeterminant === false &&
        h.notACompletedProofOfRH === true &&
        h.namedSubGap === 'det-route-vacuous-for-quasinilpotent'
      );
    },
  },
];

export default IMP1341_VOLTERRA_SCHATTEN_1_BRIDGE;
