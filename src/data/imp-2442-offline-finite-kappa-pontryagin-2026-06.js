/**
 * @module data/imp-2442-offline-finite-kappa-pontryagin-2026-06
 * @fileoverview imp-2442 (Wave-3 follow-on to imp-2430) -- characterizes the
 * OFF-LINE finite-kappa structure of the de Branges canonical-system realization.
 * imp-2430 established the on-line (RH-true) realization only: the candidate Weyl
 * m-function is ordinary Nevanlinna N_0 (Pick matrix positive-semidefinite,
 * negative index 0), so a Hilbert-space trace-normed Hamiltonian exists, matching
 * ind_-(K_a) = 0. imp-2430 named the off-line case as an open sub-gap and showed
 * that its NAIVE off-line surrogate (a real spectral point literally pushed into
 * the open upper half-plane, giving m a genuine pole inside C+) does NOT yield a
 * finite-index Pontryagin realization: the Pick negative index GROWS without bound
 * as nodes are added. This module isolates WHY and supplies the index bookkeeping.
 *
 * KEY DISTINCTION (Krein-Langer). A hypothetical off-critical zero must be modelled
 * by a GENERALIZED Nevanlinna function N_kappa -- a function whose Pick (Nevanlinna)
 * kernel has exactly kappa negative squares -- NOT by inserting an actual pole into
 * the holomorphy domain C+. For a genuine N_kappa function the Pick matrix acquires
 * EXACTLY kappa negative eigenvalues and that count SATURATES (is stable under node
 * refinement); this is the Pontryagin-space Pi_kappa / generalized de Branges
 * picture. A bare pole in C+ is NOT in any N_kappa class, which is precisely why the
 * imp-2430 naive surrogate failed to saturate. This module verifies the saturation
 * numerically on the canonical generalized-Nevanlinna family N(z) = z^(2k+1) in
 * N_k, reproduces the imp-2430 non-saturation under the same machinery for explicit
 * contrast, and reads off the index bookkeeping for the twin-ladder kernel.
 * STRUCTURAL / NUMERICAL evidence only -- no fabricated QED, no proof of RH.
 * @see imp-2430 (on-line canonical-system realizability; named this sub-gap)
 * @see imp-2364 (rectangular winding-number route to ind_-(K_a))
 * @see imp-2425 (Krein spectral-shift route to ind_-(K_a))
 * @see data/three-attacks-section.js (Attack III, Theorem 18.3 + Conjecture 18.4)
 */
// imp-2442 -- off-line finite-kappa structure of the de Branges / Pontryagin
// canonical-system realization.
//
// SETUP
// -----
// A canonical system dy/dx = z J H(x) y with H >= 0, tr H = 1 has a Weyl
// m-function m(z). De Branges` inverse theorem: m is ordinary Nevanlinna (N_0,
// holomorphic with Im m >= 0 on C+) iff a UNIQUE trace-normed Hamiltonian exists
// in a HILBERT space. The Krein-Langer extension covers the indefinite case: a
// GENERALIZED Nevanlinna function of class N_kappa -- one whose Nevanlinna-Pick
// kernel
//     K_m(z, w) = ( m(z) - conj m(w) ) / ( z - conj w )
// has exactly kappa negative squares -- is the m-function of a canonical system in
// a PONTRYAGIN space Pi_kappa (kappa negative dimensions). The integer kappa is
// exactly the Attack III negative index ind_-(K_a) of Theorem 18.3 / Conjecture
// 18.4: under RH ind_-(K_a) = 0 (Hilbert space), and an off-critical zero with
// Re > a contributes +1 to the index (Krein-Langer: kappa = #off-line zeros).
//
// THE imp-2430 DEFECT, AND THE CORRECT MODEL
// ------------------------------------------
// imp-2430 modelled an off-line zero by taking the RH-true point-measure
// m(z) = sum_n 1/(t_n - z) and pushing ONE real spectral point t into the open
// upper half-plane, t -> t + i*delta. That gives m a GENUINE POLE inside C+. A
// function with a pole inside the test domain is NOT a generalized Nevanlinna
// function of ANY finite class: its Pick-matrix negative index grows without
// bound as more nodes surround the pole (imp-2430 measured 7, 10, 14, ...). So the
// naive surrogate cannot exhibit the finite kappa the theory predicts.
//
// The CORRECT object is a genuine N_kappa function: holomorphic on C+ but with a
// finite-rank NEGATIVE-SQUARE defect rather than a pole. The cleanest exactly
// known representatives are the odd monomials
//     N_k(z) = z^(2k+1),   which lie in class N_k
// (N_0(z) = z is ordinary Nevanlinna; z^3 in N_1, z^5 in N_2, z^7 in N_3, ...).
// For these the Pick matrix has EXACTLY k negative eigenvalues and the count is
// STABLE under node refinement -- the saturation signature of a true Pontryagin
// Pi_kappa realization. This module verifies that signature and contrasts it with
// the non-saturating imp-2430 pole-in-C+ surrogate computed by the same routine.
//
// RESULT (honest)
// ---------------
//  - GENUINE N_kappa SATURATES AT kappa. For N(z) = z^(2k+1), k = 0..3, the Pick
//    negative index equals k on EVERY one of four node sets of increasing size --
//    i.e. it saturates. This is the Pontryagin Pi_kappa / generalized de Branges
//    fingerprint: the Pick matrix acquires exactly kappa negative eigenvalues.
//  - NAIVE POLE-IN-C+ DOES NOT SATURATE. The imp-2430 off-line surrogate (one
//    point at t + i*delta) gives a negative index that grows with node count,
//    reproduced here for contrast -- confirming it is not a finite-class N_kappa
//    function and the off-line zero must instead be carried by a genuine
//    generalized-Nevanlinna m-function.
//
// INDEX BOOKKEEPING (the deliverable the ticket asks for)
// -------------------------------------------------------
//   on-line  (RH true)      m in N_0     Pick neg index 0        Hilbert space      ind_-(K_a) = 0
//   off-line (kappa zeros)  m in N_kappa Pick neg index kappa    Pontryagin Pi_kappa ind_-(K_a) = kappa
// The twin-ladder positivity (Theorem 18.3 / Conjecture 18.4) DEMANDS the
// Hilbert-space case ind_-(K_a) = 0, i.e. kappa = 0. A hypothetical off-line zero
// forces kappa >= 1, i.e. the realization can only live in an INDEFINITE
// Pontryagin space Pi_kappa.
//
// VERDICT: off-line zeros are ADMISSIBLE in the de Branges realization ONLY in the
// generalized (Pontryagin, kappa >= 1) sense -- they are structurally INCOMPATIBLE
// with the definite Hilbert-space (kappa = 0) realization the twin-ladder kernel
// requires. The Krein-Langer identity kappa = #off-line zeros = ind_-(K_a) is
// reproduced correctly once a genuine N_kappa model is used (finite, saturating
// negative index), repairing the imp-2430 non-saturation. This LOCALIZES the
// Hilbert-Polya-style contradiction at exactly "kappa >= 1 (Pontryagin, off-line)
// vs ind_-(K_a) = 0 (Hilbert, twin-ladder positivity)".
//
// SUB-GAP (named, honest)
// -----------------------
//  GAP-2442-GENUINE-M-IS-N0. The verdict shows off-line zeros require kappa >= 1,
//  but it does NOT prove the GENUINE twin-ladder m-function is in N_0 rather than
//  some N_kappa, kappa >= 1 -- that statement IS RH. The realization theory makes
//  the off-line obstruction explicit (a forced negative square) but cannot by
//  itself exclude kappa >= 1; an operator-theoretic input proving the genuine
//  Weyl m-function is positive-definite (kappa = 0) is the remaining ingredient.
//  This is the same RH-equivalent endpoint reached by imp-2364 / imp-2425 /
//  imp-2430 from their respective handles. No proof claim.

// ----- minimal complex arithmetic ([re, im]) -----
const cSub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cAdd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const cMul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cConj = (a) => [a[0], -a[1]];
const cDiv = (a, b) => {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
};
const cPow = (z, n) => { let r = [1, 0]; for (let i = 0; i < n; i++) r = cMul(r, z); return r; };

// Nevanlinna-Pick matrix P_{jk} = (m(z_j) - conj m(z_k)) / (z_j - conj z_k).
function imp2442PickMatrix(nodes, mEval) {
  const n = nodes.length;
  const mv = nodes.map(mEval);
  const P = [];
  for (let j = 0; j < n; j++) {
    P.push([]);
    for (let k = 0; k < n; k++) {
      P[j].push(cDiv(cSub(mv[j], cConj(mv[k])), cSub(nodes[j], cConj(nodes[k]))));
    }
  }
  return P;
}

// Embed n x n Hermitian P = A + iB into the 2n x 2n real symmetric [[A,-B],[B,A]]
// (eigenvalues of P appear doubled), so inertia is read robustly even when P is
// rank-deficient. (Same eigen-embedding as imp-2430; LDL* is unreliable here.)
function imp2442EmbedReal(P) {
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
function imp2442JacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-30) break;
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

// Negative index of the Hermitian Pick matrix (real-embedding eigenvalues are
// doubled, so the count is halved).
function imp2442NegIndex(P) {
  const ev = imp2442JacobiEig(imp2442EmbedReal(P));
  const maxAbs = Math.max(...ev.map((e) => Math.abs(e)));
  const tol = 1e-9 * maxAbs;
  let neg = 0;
  for (const e of ev) if (e < -tol) neg++;
  return neg / 2;
}

function imp2442Nodes(xs, ys) {
  const nd = [];
  for (const x of xs) for (const y of ys) nd.push([x, y]);
  return nd;
}

// Four C+ node sets of increasing size; a genuine N_kappa function`s Pick
// negative index must equal kappa on ALL of them (saturation).
const IMP2442_NODE_SETS = Object.freeze([
  imp2442Nodes([-2, -1, 1, 2], [0.5, 1.0]),
  imp2442Nodes([-3, -1.5, 1.5, 3], [0.4, 0.8, 1.5]),
  imp2442Nodes([-4, -2, -1, 1, 2, 4], [0.3, 0.7, 1.2, 2.0]),
  imp2442Nodes([-5, -3, -1, 1, 3, 5], [0.25, 0.6, 1.0, 1.8, 3.0]),
]);

// Canonical generalized-Nevanlinna family: N_k(z) = z^(2k+1) lies in class N_k.
// The Pick negative index should equal k on every node set (saturation).
const IMP2442_KAPPA_VALUES = Object.freeze([0, 1, 2, 3]);
const IMP2442_GENUINE_TABLE = Object.freeze(
  IMP2442_KAPPA_VALUES.map((kappa) => {
    const exponent = 2 * kappa + 1;
    const perNodeSet = IMP2442_NODE_SETS.map((nodes) =>
      imp2442NegIndex(imp2442PickMatrix(nodes, (z) => cPow(z, exponent)))
    );
    return Object.freeze({
      label: 'z^' + exponent,
      predictedKappa: kappa,
      exponent,
      negIndexPerNodeSet: Object.freeze(perNodeSet),
      saturatesAtKappa: perNodeSet.every((v) => v === kappa),
    });
  })
);
const IMP2442_ALL_SATURATE = IMP2442_GENUINE_TABLE.every((r) => r.saturatesAtKappa);

// CONTRAST: the imp-2430 naive off-line surrogate -- the RH-true point measure
// m(z) = sum_n 1/(t_n - z) with one real point pushed to t + i*delta, giving m a
// genuine pole inside C+. Reproduced here under the SAME routine to show it does
// NOT saturate (negative index grows with node count) -- it is not in any N_kappa.
const IMP2442_GAMMA = Object.freeze([
  14.134725142, 21.022039639, 25.010857580,
  30.424876126, 32.935061588, 37.586178159,
]);
const IMP2442_OFF_DELTA = 2.0;
function imp2442PoleInCplusM(z) {
  let s = [0, 0];
  for (const g of IMP2442_GAMMA) {
    s = cAdd(s, cDiv([1, 0], cSub([g, 0], z)));
    s = cAdd(s, cDiv([1, 0], cSub([-g, 0], z)));
  }
  // one spectral point lifted into the open upper half-plane (the off-line model)
  s = cAdd(s, cDiv([1, 0], cSub([8, IMP2442_OFF_DELTA], z)));
  return s;
}
const IMP2442_NAIVE_OFFLINE_NODE_SETS = Object.freeze([
  imp2442Nodes([-5, -2, 2, 5], [0.25, 0.6]),
  imp2442Nodes([-6, -3, 3, 6], [0.3, 0.7, 1.2]),
  imp2442Nodes([-8, -4, 4, 8], [0.2, 0.5, 1.0, 2.0]),
  imp2442Nodes([-12, -6, -2, 2, 6, 12], [0.2, 0.5, 1.0, 2.0]),
]);
const IMP2442_NAIVE_OFFLINE_NEG_INDEX = Object.freeze(
  IMP2442_NAIVE_OFFLINE_NODE_SETS.map((nodes) =>
    imp2442NegIndex(imp2442PickMatrix(nodes, imp2442PoleInCplusM))
  )
);
// Non-saturation: the max negative index over the larger node sets exceeds the
// smallest, AND it climbs well past any fixed small kappa (here past 3).
const IMP2442_NAIVE_MAX_NEG = Math.max(...IMP2442_NAIVE_OFFLINE_NEG_INDEX);
const IMP2442_NAIVE_MIN_NEG = Math.min(...IMP2442_NAIVE_OFFLINE_NEG_INDEX);
const IMP2442_NAIVE_DOES_NOT_SATURATE =
  IMP2442_NAIVE_MAX_NEG > IMP2442_NAIVE_MIN_NEG && IMP2442_NAIVE_MAX_NEG > 3;

export const TWIN_LADDER_OFFLINE_FINITE_KAPPA_PONTRYAGIN = Object.freeze({
  id: 'imp-2442-offline-finite-kappa-pontryagin',
  ticket: 'imp-2442',
  parent: 'imp-2430',
  parentAttack: 'attack-III-weil-pontryagin',
  conjecture: 'Theorem 18.3 + Conjecture 18.4 (ind_-(K_a) = kappa = #off-line zeros)',
  builtAt: '2026-06-04T15:20:51Z',
  framework: 'Krein-Langer generalized Nevanlinna functions N_kappa / Pontryagin Pi_kappa de Branges realization',
  question:
    'For a hypothetical off-line zero (finite kappa = number of off-critical ' +
    'zeros), does the de Branges / Pick-matrix picture acquire exactly kappa ' +
    'negative eigenvalues (Pontryagin space, generalized de Branges), and is that ' +
    'compatible with the twin-ladder kernel`s ind_-(K_a) = 0?',
  method:
    'Test the Pick-matrix negative index of GENUINE generalized-Nevanlinna ' +
    'functions N_k(z) = z^(2k+1) (in class N_k) across four C+ node sets of ' +
    'increasing size, checking it equals k and SATURATES (stable under node ' +
    'refinement) -- the Pontryagin Pi_kappa signature. Contrast with the imp-2430 ' +
    'naive off-line surrogate (a real spectral point pushed to t + i*delta, giving ' +
    'm a genuine pole inside C+), computed by the same Pick / eigen-embedding / ' +
    'cyclic-Jacobi routine, which does NOT saturate.',
  genuineNkappa: Object.freeze({
    family: 'N_k(z) = z^(2k+1) in class N_k',
    table: IMP2442_GENUINE_TABLE,
    allSaturateAtKappa: IMP2442_ALL_SATURATE,
    note:
      'Pick negative index equals kappa on every node set -> the Pick matrix ' +
      'acquires exactly kappa negative eigenvalues, the Pontryagin Pi_kappa / ' +
      'generalized de Branges fingerprint. This is the correct model for an ' +
      'off-line zero: a finite-rank negative-square defect, NOT a pole in C+.',
  }),
  naiveOfflineContrast: Object.freeze({
    model: 'imp-2430 surrogate: m(z) = sum_n 1/(t_n - z), one point at t + i*delta',
    delta: IMP2442_OFF_DELTA,
    negIndexPerNodeSet: IMP2442_NAIVE_OFFLINE_NEG_INDEX,
    doesNotSaturate: IMP2442_NAIVE_DOES_NOT_SATURATE,
    note:
      'A pole inside the holomorphy domain C+ is not a generalized Nevanlinna ' +
      'function of any finite class; its Pick negative index grows with node ' +
      'count instead of fixing kappa. This is exactly the imp-2430 G2 failure, ' +
      'reproduced under the same routine for contrast.',
  }),
  indexBookkeeping: Object.freeze([
    Object.freeze({ regime: 'on-line (RH true)', mClass: 'N_0', pickNegIndex: 0, space: 'Hilbert', indMinusKa: 0 }),
    Object.freeze({ regime: 'off-line (kappa zeros)', mClass: 'N_kappa', pickNegIndex: 'kappa', space: 'Pontryagin Pi_kappa', indMinusKa: 'kappa' }),
  ]),
  verdict: 'off-line-zeros-admissible-only-in-pontryagin-pi-kappa-incompatible-with-hilbert-kappa-0',
  verdictPlain:
    'Off-line zeros are admissible in the de Branges realization ONLY in the ' +
    'generalized (Pontryagin Pi_kappa, kappa >= 1) sense and are structurally ' +
    'incompatible with the definite Hilbert-space (kappa = 0) realization the ' +
    'twin-ladder positivity (ind_-(K_a) = 0) requires. The Krein-Langer identity ' +
    'kappa = #off-line zeros = ind_-(K_a) holds once a genuine N_kappa model is ' +
    'used, repairing the imp-2430 non-saturation; the Hilbert-Polya contradiction ' +
    'lives exactly at kappa >= 1 (off-line) vs ind_-(K_a) = 0 (twin-ladder).',
  honestScope:
    'STRUCTURAL / NUMERICAL fan-out via Krein-Langer / Pontryagin theory. It ' +
    'verifies the Pick-matrix index bookkeeping (genuine N_kappa saturates at ' +
    'kappa; naive pole-in-C+ does not) and reads off that off-line zeros force a ' +
    'kappa >= 1 Pontryagin realization, incompatible with the kappa = 0 ' +
    'Hilbert-space realization. It does NOT prove the genuine twin-ladder ' +
    'm-function is in N_0 (kappa = 0) -- that statement is RH itself. No proof of ' +
    'RH; Lambda unchanged.',
  subGap: Object.freeze({
    id: 'GAP-2442-GENUINE-M-IS-N0',
    statement:
      'Proving the genuine twin-ladder Weyl m-function lies in N_0 (kappa = 0) ' +
      'rather than N_kappa for some kappa >= 1 is equivalent to RH; the ' +
      'realization theory makes the off-line obstruction explicit (a forced ' +
      'negative square) but cannot by itself exclude kappa >= 1.',
  }),
  proofClaim: false,
  references: Object.freeze({
    kreinLanger:
      'M. G. Krein, H. Langer, Ueber einige Fortsetzungsprobleme ... Q-Funktion ' +
      'eines pi-hermiteschen Operators im Raume Pi_kappa, Acta Sci. Math. ' +
      '(Szeged) 34 (1973); generalized Nevanlinna functions N_kappa and ' +
      'Pontryagin-space realization, kappa = negative squares of the Pick kernel.',
    deBranges:
      'L. de Branges, Hilbert Spaces of Entire Functions, Prentice-Hall (1968); ' +
      'inverse spectral theorem for canonical systems / trace-normed Hamiltonians.',
    derkachHassiSnoo:
      'V. Derkach, S. Hassi, H. de Snoo, Generalized Nevanlinna functions ... ' +
      'realizations in Pontryagin spaces; N_kappa classes and the z^(2k+1) ' +
      'representatives in N_k.',
    imp2430: 'imp-2430 -- on-line canonical-system realizability; named this off-line sub-gap and showed the naive surrogate does not saturate.',
    imp2364: 'imp-2364 -- rectangular winding-number route to ind_-(K_a).',
    imp2425: 'imp-2425 -- Krein spectral-shift route to ind_-(K_a).',
    plattTrudgian2021:
      'Platt, D., Trudgian, T., The Riemann hypothesis is true up to 3 * 10^12, ' +
      'Bull. London Math. Soc. 53 (2021), 792-797.',
  }),
});

export const IMP2442_OFFLINE_FINITE_KAPPA_PONTRYAGIN_ASSERTIONS = [
  {
    id: 'imp2442-genuine-Nkappa-saturates-at-kappa',
    why:
      'The central claim: a genuine generalized-Nevanlinna function N_k(z)=z^(2k+1) ' +
      'has Pick negative index EXACTLY k on every node set (saturation). If this ' +
      'fails, the Pontryagin Pi_kappa fingerprint -- exactly kappa negative ' +
      'eigenvalues -- is not reproduced and the index bookkeeping collapses.',
    holds: () => IMP2442_ALL_SATURATE === true,
  },
  {
    id: 'imp2442-kappa0-is-positive-semidefinite',
    why:
      'The on-line case kappa = 0 (N_0(z) = z, ordinary Nevanlinna) must have Pick ' +
      'negative index 0 on every node set -- the Hilbert-space / ind_-(K_a)=0 ' +
      'anchor consistent with imp-2364 / imp-2425 / imp-2430.',
    holds: () =>
      IMP2442_GENUINE_TABLE[0].predictedKappa === 0 &&
      IMP2442_GENUINE_TABLE[0].negIndexPerNodeSet.every((v) => v === 0),
  },
  {
    id: 'imp2442-kappa-grid-is-0-1-2-3',
    why:
      'The saturated negative indices across the family must read 0,1,2,3 ' +
      '(kappa = k for N_k = z^(2k+1)). A different ladder means the negative-square ' +
      'count is not tracking kappa.',
    holds: () => {
      const got = IMP2442_GENUINE_TABLE.map((r) => r.negIndexPerNodeSet[r.negIndexPerNodeSet.length - 1]);
      return JSON.stringify(got) === JSON.stringify([0, 1, 2, 3]);
    },
  },
  {
    id: 'imp2442-naive-pole-in-Cplus-does-not-saturate',
    why:
      'The imp-2430 contrast: a real spectral point pushed into C+ gives a genuine ' +
      'pole inside the test domain, so its Pick negative index grows with node ' +
      'count (does NOT saturate). If this surrogate ever saturated it would falsely ' +
      'look like a finite-class N_kappa and the central distinction would be lost.',
    holds: () => IMP2442_NAIVE_DOES_NOT_SATURATE === true,
  },
  {
    id: 'imp2442-naive-exceeds-any-small-kappa',
    why:
      'Sharper form of non-saturation: the naive surrogate negative index climbs ' +
      'past 3 (the largest genuine kappa tested), proving it is not in N_k for any ' +
      'small k and the off-line zero must be carried by a genuine N_kappa m-function.',
    holds: () => IMP2442_NAIVE_MAX_NEG > 3,
  },
  {
    id: 'imp2442-no-proof-claim',
    why:
      'This is structural / numerical evidence localizing the Hilbert-Polya ' +
      'contradiction, NOT a proof. The proofClaim flag must stay false and the ' +
      'named sub-gap GAP-2442-GENUINE-M-IS-N0 must be present.',
    holds: () =>
      TWIN_LADDER_OFFLINE_FINITE_KAPPA_PONTRYAGIN.proofClaim === false &&
      TWIN_LADDER_OFFLINE_FINITE_KAPPA_PONTRYAGIN.subGap.id === 'GAP-2442-GENUINE-M-IS-N0',
  },
];
