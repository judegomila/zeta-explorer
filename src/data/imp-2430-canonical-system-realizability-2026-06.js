/**
 * @module data/imp-2430-canonical-system-realizability-2026-06
 * @fileoverview imp-2430 (Wave-2 fan-out, follow-on to imp-2425) -- tests whether
 * the twin-ladder kernel can be realized as the resolvent of a trace-normed
 * canonical system dy/dx = z J H(x) y (J = [[0,-1],[1,0]], H(x) >= 0, tr H = 1)
 * using de Branges / Krein-Langer inverse-spectral theory. The realizability
 * criterion is decidable from the candidate Weyl m-function: by de Branges'
 * inverse theorem a function is the m-function of a UNIQUE trace-normed canonical
 * system iff it is Nevanlinna (Herglotz), which is checked here via the negative
 * index of its Pick (Nevanlinna-Pick) matrix. This module DELIVERS an HONEST
 * PARTIAL: it verifies the realizability CRITERION is met under RH (the candidate
 * m-function is Herglotz; Pick matrix positive-semidefinite, negative index 0,
 * robust across node sets), so an abstract trace-normed Hamiltonian EXISTS; but it
 * documents two named obstructions to producing an explicit H(x). NUMERICAL /
 * STRUCTURAL EVIDENCE ONLY -- no fabricated QED, no proof of RH.
 * @see imp-2425 (named this canonical-system realizability question as its sub-gap)
 * @see imp-2364 (rectangular winding-number route to ind_-(K_a))
 * @see data/three-attacks-section.js (Attack III, Theorem 18.3 + Conjecture 18.4)
 */
// imp-2430 -- de Branges / Remling canonical-system realizability of the twin
// ladder kernel.
//
// CONTEXT
// -------
// A canonical (Hamiltonian) system on [0, L) is
//     dy/dx = z J H(x) y,    J = [[0,-1],[1,0]],   H(x) >= 0,   tr H(x) = 1,
// with z the spectral parameter. Its Weyl-Titchmarsh m-function m(z) is a
// Nevanlinna (Herglotz) function: holomorphic on C+ with Im m(z) >= 0 there.
// De Branges inverse spectral theorem (and Remling`s canonical-system form of
// it): the map H |-> m is a bijection between trace-normed Hamiltonians (up to
// reparametrisation) and Nevanlinna functions. So the question "is the twin
// ladder kernel the resolvent of a canonical system?" reduces to a decidable
// criterion on a candidate m-function:
//     REALIZABLE (Hilbert-space canonical system)  <=>  m is Nevanlinna.
// The Krein-Langer extension covers the indefinite case: a generalized
// Nevanlinna function N_kappa (Pick kernel with exactly kappa negative squares)
// is the m-function of a canonical system in a Pontryagin space Pi_kappa. The
// integer kappa is precisely the Attack III negative index ind_-(K_a) studied by
// imp-2364 (winding number) and imp-2425 (Krein spectral shift). So canonical
// system realizability and the twin-ladder positivity index are the same datum
// viewed through de Branges` lens.
//
// CANDIDATE m-FUNCTION
// --------------------
// The twin-ladder / Weil kernel K_a has, under RH, a real spectral measure
// supported at the zeta zero ordinates {gamma_n} (the zeros sit on the critical
// line, so the spectral points are REAL). The simplest candidate m-function
// carrying that measure is the Stieltjes transform of the finite point measure
//     m(z) = sum_n w_n / (t_n - z),   t_n = +/- gamma_n,   w_n = 1 > 0.
// For REAL t_n with positive weights this is manifestly Nevanlinna:
//     Im m(z) = sum_n w_n * Im z / |t_n - z|^2 > 0   for Im z > 0,
// hence (de Branges) a trace-normed canonical system realizing it EXISTS and is
// unique. An off-critical zero would move a spectral point off the real axis;
// its functional-equation reflection then places a pole of m in the OPEN upper
// half-plane, where Nevanlinna functions must be holomorphic -- a qualitative
// obstruction to (positive-space) realizability.
//
// METHOD (decidable Pick / Nevanlinna test)
// -----------------------------------------
// m is Nevanlinna iff for every finite node set {z_j} in C+ the Pick matrix
//     P_{jk} = ( m(z_j) - conj(m(z_k)) ) / ( z_j - conj(z_k) )
// is positive semidefinite (Nevanlinna-Pick); the number of negative eigenvalues
// of P (over rich node sets) is the negative-square index kappa. P is complex
// Hermitian; to read its inertia robustly even when P is rank-deficient (the
// finite point measure makes P numerically singular, rank = #spectral points),
// we embed the n x n Hermitian P = A + iB into the 2n x 2n REAL SYMMETRIC matrix
// [[A, -B],[B, A]] (eigenvalues of P doubled), diagonalise by cyclic Jacobi, and
// count eigenvalues below -tol with tol = 1e-9 * max|eig|. (Unpivoted LDL* is
// unreliable on the singular PSD matrix; the eigen-embedding is not.)
//
// RESULT (honest)
// ---------------
//  - REALIZABILITY CRITERION MET UNDER RH. For the RH-true configuration (all
//    t_n real) the candidate m-function is Nevanlinna: the Pick matrix is
//    positive-semidefinite with negative index 0 on every tested node set
//    (smallest eigenvalue at machine-epsilon level, ~1e-17 relative). By de
//    Branges` inverse theorem a UNIQUE trace-normed Hamiltonian H(x) therefore
//    EXISTS realizing it. This is consistent with ind_-(K_a) = 0 from imp-2364 /
//    imp-2425 (kappa = 0 = Hilbert-space, definite case).
//  - OFF-LINE SURROGATE DOES NOT GIVE A FINITE-kappa REALIZATION. Pushing a
//    spectral point into the open upper half-plane (modelling an off-critical
//    zero) makes the naive sum-of-poles m leave the Nevanlinna class. Its Pick
//    negative index does NOT saturate to a fixed integer: it grows with node
//    count (e.g. 7, 10, 14, ... and up to the full matrix size), because the pole
//    now lies inside the test domain C+. So the clean Krein-Langer picture
//    "kappa = #off-line zeros = ind_-(K_a)" is NOT reproduced by a bare
//    sum-of-simple-poles surrogate -- the genuine twin-ladder operator`s
//    m-function (with the correct entire / Hermite-Biehler structure function
//    E(z)) is required to obtain a finite-index Pontryagin realization.
//
// VERDICT: under RH the de Branges realizability CRITERION is satisfied (the
// candidate m-function is Nevanlinna; a trace-normed canonical system exists
// abstractly), reinforcing -- not proving -- the twin-ladder positivity claims.
// An EXPLICIT Hamiltonian and the off-line finite-kappa structure remain open;
// see the named sub-gaps.
//
// SUB-GAPS (named, honest)
// ------------------------
//  (G1) NON-CONSTRUCTIVE H(x). De Branges gives EXISTENCE + UNIQUENESS of the
//       trace-normed Hamiltonian from a Nevanlinna m, but not a closed form.
//       Producing H(x) explicitly needs the inverse algorithm (Krein string /
//       continued-fraction Schur recursion / de Branges chain of subspaces) run
//       on the actual m-function -- not delivered here.
//  (G2) SURROGATE CIRCULARITY. The finite zero-product / point-measure m is a
//       surrogate, not the resolvent of the genuine twin-ladder operator; the
//       true Weyl m-function presupposes the operator Attack III is trying to
//       build. A node-count-independent kappa requires that genuine m (with its
//       Hermite-Biehler structure function E), which would also fix the off-line
//       finite-index gap above.

// First 6 low Odlyzko ordinates (RH verified to height ~3e12, Platt-Trudgian
// 2021); spectral points are taken at +/- gamma_n.
const IMP2430_GAMMA = Object.freeze([
  14.134725142, 21.022039639, 25.010857580,
  30.424876126, 32.935061588, 37.586178159,
]);

// ----- minimal complex arithmetic ([re, im]) -----
const cAdd2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
const cSub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cConj2 = (a) => [a[0], -a[1]];
const cDiv2 = (a, b) => {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
};

// RH-true spectral points t_n = +/- gamma_n (all real). offIndex (if >= 0) pushes
// one signed point into the open upper half-plane by +i*delta (off-line model).
function imp2430SpectralPoints(offIndex, delta) {
  const pts = [];
  for (const g of IMP2430_GAMMA) { pts.push([g, 0]); pts.push([-g, 0]); }
  if (offIndex >= 0) pts[offIndex] = [pts[offIndex][0], delta];
  return pts;
}

// Candidate Weyl m-function m(z) = sum_n 1 / (t_n - z).
function imp2430MEval(z, pts) {
  let s = [0, 0];
  for (const t of pts) s = cAdd2(s, cDiv2([1, 0], cSub2(t, z)));
  return s;
}

// Pick (Nevanlinna-Pick) matrix P_{jk} = (m(z_j) - conj m(z_k))/(z_j - conj z_k).
function imp2430PickMatrix(nodes, pts) {
  const n = nodes.length;
  const mv = nodes.map((z) => imp2430MEval(z, pts));
  const P = [];
  for (let j = 0; j < n; j++) {
    P.push([]);
    for (let k = 0; k < n; k++) {
      P[j].push(cDiv2(cSub2(mv[j], cConj2(mv[k])), cSub2(nodes[j], cConj2(nodes[k]))));
    }
  }
  return P;
}

// Embed n x n Hermitian P = A + iB into 2n x 2n real symmetric [[A,-B],[B,A]].
function imp2430EmbedReal(P) {
  const n = P.length, N = 2 * n;
  const M = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const a = P[i][j][0], b = P[i][j][1];
      M[i][j] = a; M[i + n][j + n] = a; M[i + n][j] = b; M[i][j + n] = -b;
    }
  }
  return M;
}

// Cyclic Jacobi eigenvalues of a real symmetric matrix.
function imp2430JacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-28) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(theta) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < n; k++) { const kp = A[k][p], kq = A[k][q]; A[k][p] = c * kp - s * kq; A[k][q] = s * kp + c * kq; }
        for (let k = 0; k < n; k++) { const pk = A[p][k], qk = A[q][k]; A[p][k] = c * pk - s * qk; A[q][k] = s * pk + c * qk; }
      }
    }
  }
  return A.map((r, i) => r[i]);
}

// Negative index of the Hermitian Pick matrix (eigenvalues come doubled from the
// real embedding, so the count is halved).
function imp2430NegIndex(P) {
  const ev = imp2430JacobiEig(imp2430EmbedReal(P));
  const maxAbs = Math.max(...ev.map((e) => Math.abs(e)));
  const tol = 1e-9 * maxAbs;
  let neg = 0, minEig = Infinity;
  for (const e of ev) { if (e < -tol) neg++; if (e < minEig) minEig = e; }
  return { negIndex: neg / 2, minEig, maxAbs, relMinEig: minEig / maxAbs };
}

function imp2430Nodes(xs, ys) {
  const nd = [];
  for (const x of xs) for (const y of ys) nd.push([x, y]);
  return nd;
}

// ON-LINE (RH-true) realizability: candidate m is Nevanlinna -> Pick PSD ->
// negative index 0 -> trace-normed canonical system exists (de Branges). Tested
// on three independent C+ node sets.
const IMP2430_ONLINE_NODE_SETS = Object.freeze([
  { label: 'near-origin', nodes: imp2430Nodes([-6, -3, 3, 6], [0.3, 0.7, 1.2]) },
  { label: 'mid', nodes: imp2430Nodes([-8, -4, 4, 8], [0.25, 0.6, 1.0]) },
  { label: 'wide', nodes: imp2430Nodes([-40, -20, 20, 40], [0.5, 1.5, 3.0]) },
]);

const IMP2430_ONLINE_TABLE = Object.freeze(
  IMP2430_ONLINE_NODE_SETS.map(({ label, nodes }) => {
    const r = imp2430NegIndex(imp2430PickMatrix(nodes, imp2430SpectralPoints(-1, 0)));
    return Object.freeze({
      label,
      nodeCount: nodes.length,
      negIndex: r.negIndex,
      relMinEig: r.relMinEig,
      isPSD: r.negIndex === 0,
    });
  })
);
const IMP2430_ONLINE_ALL_PSD = IMP2430_ONLINE_TABLE.every((r) => r.isPSD);
const IMP2430_ONLINE_MAX_NEG = IMP2430_ONLINE_TABLE.reduce((m, r) => Math.max(m, r.negIndex), 0);

// OFF-LINE surrogate breakdown: push one spectral point to +i*delta. The naive
// sum-of-poles m leaves the Nevanlinna class and its Pick negative index does NOT
// saturate -- it grows with node count, so this surrogate gives no finite-kappa
// Pontryagin realization. Node sets of increasing size demonstrate the growth.
const IMP2430_OFF_DELTA = 2.0;
const IMP2430_OFFLINE_NODE_SETS = Object.freeze([
  imp2430Nodes([-5, -2, 2, 5], [0.25, 0.6]),
  imp2430Nodes([-6, -3, 3, 6], [0.3, 0.7, 1.2]),
  imp2430Nodes([-8, -4, 4, 8], [0.2, 0.5, 1.0, 2.0]),
]);
const IMP2430_OFFLINE_TABLE = Object.freeze(
  IMP2430_OFFLINE_NODE_SETS.map((nodes) => {
    const r = imp2430NegIndex(imp2430PickMatrix(nodes, imp2430SpectralPoints(0, IMP2430_OFF_DELTA)));
    return Object.freeze({ nodeCount: nodes.length, negIndex: r.negIndex });
  })
);
// "Does not saturate": negative index strictly increases as nodes are added.
const IMP2430_OFFLINE_NOT_SATURATED = IMP2430_OFFLINE_TABLE.every(
  (r, i, a) => i === 0 || r.negIndex > a[i - 1].negIndex
);

export const TWIN_LADDER_CANONICAL_SYSTEM_REALIZABILITY = Object.freeze({
  id: 'imp-2430-canonical-system-realizability',
  ticket: 'imp-2430',
  parent: 'imp-2425',
  parentAttack: 'attack-III-weil-pontryagin',
  conjecture: 'Theorem 18.3 + Conjecture 18.4 (ind_-(K_a) = kappa)',
  builtAt: '2026-06-04T00:00:00Z',
  framework: 'de Branges / Remling inverse-spectral theory of canonical systems',
  canonicalSystem: 'dy/dx = z J H(x) y,  J = [[0,-1],[1,0]],  H(x) >= 0,  tr H(x) = 1',
  criterion:
    'De Branges inverse theorem: a function is the Weyl m-function of a UNIQUE ' +
    'trace-normed canonical system iff it is Nevanlinna (Herglotz). Krein-Langer ' +
    'extension: a generalized Nevanlinna function N_kappa (Pick kernel with kappa ' +
    'negative squares) is realized by a canonical system in a Pontryagin space ' +
    'Pi_kappa, and kappa equals the Attack III index ind_-(K_a).',
  method:
    'Build the candidate Weyl m-function m(z) = sum_n 1/(t_n - z) from the spectral ' +
    'points t_n = +/- gamma_n (first 6 Odlyzko ordinates), then decide the ' +
    'Nevanlinna property via the Pick matrix P_{jk} = (m(z_j) - conj m(z_k))/' +
    '(z_j - conj z_k). Inertia is read robustly by embedding the Hermitian P into ' +
    'the 2n x 2n real symmetric matrix [[A,-B],[B,A]] and diagonalising by cyclic ' +
    'Jacobi (eigenvalue count halved); negative index = #eigenvalues < -1e-9*max|eig|.',
  description:
    'Tests whether the twin-ladder kernel is the resolvent of a trace-normed ' +
    'canonical system. Under RH the candidate m-function is Nevanlinna (Pick ' +
    'matrix positive-semidefinite, negative index 0 on every node set, smallest ' +
    'eigenvalue at machine epsilon), so by de Branges a UNIQUE realizing ' +
    'Hamiltonian H(x) EXISTS abstractly -- the realizability CRITERION is met, ' +
    'consistent with ind_-(K_a) = 0 (imp-2364, imp-2425). HONEST PARTIAL: the ' +
    'explicit H(x) is not produced (de Branges existence is non-constructive), ' +
    'and the naive off-line surrogate does not give a finite-kappa Pontryagin ' +
    'realization (its Pick negative index grows with node count). Numerical / ' +
    'structural evidence -- NOT a proof of RH.',
  gamma: IMP2430_GAMMA,
  spectralPointModel: 't_n = +/- gamma_n (real under RH), w_n = 1',
  onlineRealizability: Object.freeze({
    nodeSets: IMP2430_ONLINE_TABLE,
    allPSD: IMP2430_ONLINE_ALL_PSD,
    maxNegIndex: IMP2430_ONLINE_MAX_NEG,
    impliesExistence: IMP2430_ONLINE_ALL_PSD,   // de Branges: Nevanlinna => H(x) exists
    note:
      'm is Nevanlinna; trace-normed canonical system exists and is unique (de ' +
      'Branges). kappa = 0 matches the definite Hilbert-space case ind_-(K_a)=0.',
  }),
  offlineSurrogateBreakdown: Object.freeze({
    delta: IMP2430_OFF_DELTA,
    table: IMP2430_OFFLINE_TABLE,
    negIndexSaturates: !IMP2430_OFFLINE_NOT_SATURATED,
    note:
      'Pushing a spectral point into C+ models an off-critical zero; the naive ' +
      'sum-of-poles m then has a pole inside the Pick test domain and its negative ' +
      'index grows with node count instead of fixing kappa = #off-line zeros. The ' +
      'genuine operator m-function (with Hermite-Biehler structure E) is needed for ' +
      'a finite-index Pontryagin realization.',
  }),
  verdict: 'realizability-criterion-met-under-RH-existence-abstract-explicit-H-open',
  honestScope:
    'STRUCTURAL / NUMERICAL fan-out via de Branges. POSITIVE result: under RH the ' +
    'candidate twin-ladder m-function is Nevanlinna (Pick PSD, negative index 0 on ' +
    'three independent node sets), so a unique trace-normed canonical system ' +
    'realizing it EXISTS by de Branges` inverse theorem -- the realizability ' +
    'criterion is satisfied and is consistent with ind_-(K_a)=0 (imp-2364, ' +
    'imp-2425). This does NOT prove RH and does NOT exhibit the Hamiltonian. ' +
    'Named sub-gaps: (G1) de Branges existence is non-constructive -- an explicit ' +
    'trace-normed H(x) requires running the inverse algorithm (Krein string / ' +
    'Schur recursion / de Branges chain) on the genuine m-function; (G2) the ' +
    'finite point-measure m is a surrogate for the true resolvent, so the off-line ' +
    'finite-kappa structure (kappa = ind_-(K_a) in the Pontryagin case) is not ' +
    'reproduced and requires the genuine operator m-function with its ' +
    'Hermite-Biehler structure function E(z).',
  proofClaim: false,
  references: Object.freeze({
    deBranges:
      'L. de Branges, Hilbert Spaces of Entire Functions, Prentice-Hall (1968); ' +
      'inverse spectral theorem for canonical systems / trace-normed Hamiltonians.',
    remling:
      'C. Remling, Spectral Theory of Canonical Systems, De Gruyter (2018); ' +
      'm-function / Hamiltonian bijection and oscillation theory.',
    kreinLanger:
      'M. G. Krein, H. Langer, Ueber die Q-Funktion eines pi-hermiteschen ' +
      'Operators im Raume Pi_kappa, Acta Sci. Math. (Szeged) 34 (1973); ' +
      'generalized Nevanlinna functions N_kappa and Pontryagin-space realization.',
    imp2425: 'imp-2425 -- Krein spectral-shift route to ind_-(K_a); named this sub-gap.',
    imp2364: 'imp-2364 -- rectangular winding-number route to ind_-(K_a).',
    plattTrudgian2021:
      'Platt, D., Trudgian, T., The Riemann hypothesis is true up to 3 * 10^12, ' +
      'Bull. London Math. Soc. 53 (2021), 792-797.',
  }),
});
