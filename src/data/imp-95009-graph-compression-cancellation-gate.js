/**
 * imp-95009 — Finite-rank assessment of the graph-compression possible-gain family.
 *
 * Permutation atlas (Permuting the Zeta Twin Ladder, Sections 6.2 + 9) classifies
 * GRAPH COMPRESSIONS as the one rearrangement family with possible gain: for a
 * unitary direct/dual bridge U the graph isometry W_U v = 2^(-1/2)(v, Uv) gives
 *
 *     W_U* (R_+ (+) R_-) W_U = (R_+ + U* R_- U) / 2,
 *
 * whose anti-Hermitian part CAN in principle cancel (the operator analogue of
 * retaining both ladder phases in the P97 center). Two gates make the gain real:
 *   (i)  characteristic invariance: every scalar zero lifts to a characteristic
 *        vector of the compression (equivalently, an exact determinant identity),
 *        which forces the correlation-preserving relation U* R_- U = R_+ on the
 *        invariant sector;
 *   (ii) the cellwise Schur complement gap (eq. 31).
 *
 * This module operationalizes gate (i) versus the cancellation demand on an
 * EXPLICIT finite-rank model of the twin-ladder direct/dual channels and reports
 * a NAMED OBSTRUCTION with an exact algebraic certificate.
 *
 * Result: the invariance-preserving compression class and the anti-Hermitian
 * cancellation demand are in direct sign-conflict. Write A_+ = (R_+ - R_+†)/(2i)
 * for the anti-Hermitian generator of the direct channel and let R_- be the dual
 * channel produced by the twistor intertwiner J (Lemma 6.1, heat_compat_on_range),
 * R_- = J R_+ J†, J unitary.
 *   - Gate (i) pins U to the intertwiner class U = J, giving U* R_- U = R_+ exactly,
 *     so the average M = (R_+ + U* R_- U)/2 = R_+ and the anti-Hermitian parts
 *     REINFORCE (cancellation ratio kappa = 1: zero gain).
 *   - Genuine cancellation (anti-Hermitian part of M = 0) needs U* A_- U = -A_+,
 *     which for U = J V reduces to V* A_+ V = -A_+ : the generator must be unitarily
 *     similar to its own negative, i.e. spec(A_+) symmetric about 0.
 *   - A_+ is Hermitian, so spec(A_+) symmetric about 0  ==>  tr(A_+^k) = 0 for every
 *     odd k. A single nonzero odd moment is therefore an EXACT certificate that no
 *     unitary V (hence no invariance-preserving graph compression) can cancel the
 *     anti-Hermitian part. The twin-ladder direct residual carries a net retained
 *     phase and generically has nonvanishing odd moments.
 *
 * This is a finite-rank ASSESSMENT illustrating the operator structure. It changes
 * no bound and closes no gap (NO QED); no refereed bound is changed.
 * The Schur gate (ii) is a downstream refinement: it never opens because gate (i)
 * already forbids the cancellation the isometry alone appears to offer.
 */

// ── tiny complex dense-matrix helpers (entries are [re, im]) ────────────────
const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cconj = (a) => [a[0], -a[1]];

function matmul(A, B) {
  const n = A.length;
  const m = B[0].length;
  const k = B.length;
  const C = Array.from({ length: n }, () => Array.from({ length: m }, () => [0, 0]));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let s = [0, 0];
      for (let l = 0; l < k; l++) s = cadd(s, cmul(A[i][l], B[l][j]));
      C[i][j] = s;
    }
  }
  return C;
}

function adjoint(A) {
  const n = A.length;
  const m = A[0].length;
  const C = Array.from({ length: m }, () => Array.from({ length: n }, () => [0, 0]));
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) C[j][i] = cconj(A[i][j]);
  return C;
}

// (A - A†) / (2i) : the anti-Hermitian generator (a Hermitian matrix)
function antiHermGenerator(A) {
  const n = A.length;
  const Ad = adjoint(A);
  const C = Array.from({ length: n }, () => Array.from({ length: n }, () => [0, 0]));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const d = csub(A[i][j], Ad[i][j]); // (A - A†)
      // divide by 2i  ==  multiply by (-i/2)
      C[i][j] = cmul(d, [0, -0.5]);
    }
  }
  return C;
}

function trace(A) {
  let s = [0, 0];
  for (let i = 0; i < A.length; i++) s = cadd(s, A[i][i]);
  return s;
}

function matpow(A, p) {
  let R = A;
  for (let i = 1; i < p; i++) R = matmul(R, A);
  return R;
}

function frob(A) {
  let s = 0;
  for (const row of A) for (const e of row) s += e[0] * e[0] + e[1] * e[1];
  return Math.sqrt(s);
}

// ── the explicit finite-rank twin-ladder model ─────────────────────────────
// R_+ : direct-channel residual. Real diagonal heat masks + complex off-diagonal
// ladder-phase couplings, deliberately non-normal so a net retained phase persists.
const R_plus = [
  [[2.0, 0.0], [0.5, 0.3], [0.0, 0.1], [0.2, 0.0]],
  [[0.1, -0.2], [3.0, 0.0], [0.4, 0.5], [0.0, 0.0]],
  [[0.0, 0.0], [0.2, 0.1], [1.0, 0.0], [0.6, 0.2]],
  [[0.1, 0.0], [0.0, 0.0], [0.3, -0.4], [4.0, 0.0]],
];

// J : a nontrivial unitary twistor intertwiner (diagonal phase gate). J† J = I.
const PH = [
  [Math.cos(0.7), Math.sin(0.7)],
  [Math.cos(1.9), Math.sin(1.9)],
  [Math.cos(2.6), Math.sin(2.6)],
  [Math.cos(0.3), Math.sin(0.3)],
];
const J = Array.from({ length: 4 }, (_, i) =>
  Array.from({ length: 4 }, (_, j) => (i === j ? PH[i] : [0, 0]))
);
const Jd = adjoint(J);

// dual channel produced by the intertwiner: R_- = J R_+ J†
const R_minus = matmul(matmul(J, R_plus), Jd);

// ── measure gate (i): invariance-preserving compression U = J ──────────────
// U* R_- U with U = J  ==  J† (J R_+ J†) J  ==  R_+  (correlation-preserving)
const U = J;
const Ud = adjoint(U);
const UdRmU = matmul(matmul(Ud, R_minus), U);
const M_invariant = UdRmU.map((row, i) =>
  row.map((e, j) => cmul(cadd(e, R_plus[i][j]), [0.5, 0]))
); // (R_+ + U* R_- U)/2

const A_plus = antiHermGenerator(R_plus); // anti-Hermitian generator of the direct channel
const A_M = antiHermGenerator(M_invariant); // ... of the invariance-preserving average

// cancellation ratio under the invariance-preserving compression
const normAplus = frob(A_plus);
const kappaInvariant = normAplus > 0 ? frob(A_M) / normAplus : 0;

// ── the exact obstruction certificate: odd moments of A_+ ──────────────────
// A_+ Hermitian and spec(A_+) symmetric about 0  <=>  tr(A_+^k)=0 for all odd k.
// A single nonzero odd moment certifies that no unitary V gives V* A_+ V = -A_+,
// hence no invariance-preserving graph compression cancels the anti-Hermitian part.
const m1 = trace(A_plus)[0];
const m3 = trace(matpow(A_plus, 3))[0];
const m5 = trace(matpow(A_plus, 5))[0];

const ODD_MOMENTS = { m1, m3, m5 };
const oddMomentMax = Math.max(Math.abs(m1), Math.abs(m3), Math.abs(m5));

export const IMP_95009_GRAPH_COMPRESSION_CANCELLATION_GATE = {
  id: 'imp-95009',
  title: 'Graph-compression possible-gain family: finite-rank cancellation-vs-invariance assessment',
  proofSection: 'permutation-architecture',
  model: {
    rank: 4,
    directChannel: 'R_+ (real heat-mask diagonal + complex ladder-phase off-diagonals, non-normal)',
    intertwiner: 'J diagonal unitary phase gate (twistor heat-compat class, Lemma 6.1)',
    dualChannel: 'R_- = J R_+ J-dagger',
  },
  // gate (i): correlation-preserving compression reinforces rather than cancels
  invariancePreserving: {
    U: 'U = J (the intertwiner class fixed by characteristic invariance)',
    identity: 'U* R_- U = R_+ exactly, so M = (R_+ + U* R_- U)/2 = R_+',
    cancellationRatio: kappaInvariant, // = 1 to floating precision: zero gain
    interpretation: 'anti-Hermitian parts REINFORCE; the isometry alone yields no gain',
  },
  // the exact algebraic obstruction to cancellation under ANY invariance-preserving U
  obstruction: {
    name: 'anti-Hermitian spectral-symmetry obstruction',
    statement:
      'Cancellation under an invariance-preserving graph compression requires the ' +
      'anti-Hermitian generator A_+ to be unitarily similar to -A_+, i.e. spec(A_+) ' +
      'symmetric about 0; equivalently tr(A_+^k)=0 for every odd k. The twin-ladder ' +
      'direct residual carries a net retained phase, so an odd moment is nonzero.',
    oddMoments: ODD_MOMENTS,
    oddMomentMax,
    certified: oddMomentMax > 1e-9, // true: nonzero odd moment => no cancellation possible
  },
  schurGate: {
    equation: 31,
    status:
      'not reached: gate (i) already forbids the cancellation the isometry appears to ' +
      'offer, so the cellwise Schur gap g_A > ||E_aa|| etc. never opens a new margin.',
  },
  verdict:
    'NAMED OBSTRUCTION on a finite-rank model: characteristic invariance pins the ' +
    'direct/dual bridge to the intertwiner class (U* R_- U = R_+, kappa=1, no gain), ' +
    'while genuine anti-Hermitian cancellation demands spec(A_+) symmetric about 0, ' +
    'refuted here by a nonzero odd moment. Changes no bound; closes no gap; NO QED. ' +
    'No refereed bound is changed.',
};

// ── assertions (import-light; no heavy bundle) ─────────────────────────────
export const IMP_95009_ASSERTIONS = [
  {
    id: 'imp-95009-invariance-preserving-reinforces',
    holds: () => Math.abs(kappaInvariant - 1) < 1e-9,
    why: 'U = J gives U* R_- U = R_+ exactly, so the anti-Hermitian parts reinforce (kappa = 1): the correlation-preserving graph compression yields no gain.',
  },
  {
    id: 'imp-95009-odd-moment-certificate',
    holds: () => oddMomentMax > 1e-9,
    why: 'A nonzero odd moment tr(A_+^k) certifies spec(A_+) is not symmetric about 0, so no unitary V gives V* A_+ V = -A_+ and no invariance-preserving graph compression cancels the anti-Hermitian part.',
  },
  {
    id: 'imp-95009-dual-channel-unitarily-related',
    holds: () => {
      // R_- = J R_+ J† must have the same Frobenius norm as R_+ (unitary similarity)
      return Math.abs(frob(R_minus) - frob(R_plus)) < 1e-9;
    },
    why: 'The intertwiner J is unitary, so R_- = J R_+ J-dagger preserves the Frobenius norm of the direct channel: the dual channel is a genuine correlation-preserving image, not an independent operator.',
  },
];

export default IMP_95009_GRAPH_COMPRESSION_CANCELLATION_GATE;
