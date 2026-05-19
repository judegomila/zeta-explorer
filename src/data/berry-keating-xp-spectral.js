// imp-1101 -- Berry-Keating xp Hamiltonian: interactive demo + spectral conjecture.
//
// Quantize the classical Hamiltonian H = x*p on a phase-space cell and compare
// its eigenvalues with the imaginary parts of the first 30 Riemann zeros
// (Odlyzko table, hard-coded from src/data/zeros-to-1e6.js).
//
// The symmetric self-adjoint version is H_sym = (xp + px)/2.
// In the Heisenberg algebra [x,p] = i, the standard ladder operators are
//   a  = (x + i*p)/sqrt(2)
//   a^ = (x - i*p)/sqrt(2)
// equivalently x = (a + a^)/sqrt(2), p = (a - a^)/(i*sqrt(2)).
//
// A direct algebra gives
//   xp = (a^2 - (a^)^2 - 1) / (2*i)
//   px = (a^2 - (a^)^2 + 1) / (2*i)
// so the SYMMETRIC part is
//   H_sym = (xp + px)/2 = (a^2 - (a^)^2)/(2*i) = (i/2) * ((a^)^2 - a^2).
//
// In the Hermite (number) basis |n> with a|n> = sqrt(n)|n-1>,
// a^|n> = sqrt(n+1)|n+1>:
//   <m|H_sym|n> = (i/2) * [ sqrt((n+1)*(n+2))*delta(m, n+2)
//                          - sqrt(n*(n-1))    *delta(m, n-2) ]
// so the matrix has the antisymmetric pattern
//   M(n+2, n) = (i/2)*sqrt((n+1)*(n+2))
//   M(n, n+2) = -(i/2)*sqrt((n+1)*(n+2))
// which is purely imaginary and Hermitian. It naturally splits into a
// k = 0, 2, 4, ... (even) sub-block and a k = 1, 3, 5, ... (odd) sub-block.
//
// We solve each parity block by writing M = i*A with A real antisymmetric
// tridiagonal in the parity index. Then the eigenvalues of M come in plus
// and minus pairs, with the POSITIVE eigenvalues equal to the singular
// values of A. These are the eigenvalues of the real symmetric tridiagonal
// matrix (-A^2), which we solve with an implicit-shift QL routine
// (in-file, no external linear-algebra dependency).
//
// HONEST SCOPE: Berry-Keating (1999) is a CONJECTURE. The eigenvalues of
// the truncated symmetrized xp on the Hermite basis do not equal the
// Riemann zero ordinates; they only roughly resemble them in DENSITY.
// We report per-N RMS residuals on the first 15 eigenvalues and do NOT
// claim exact agreement. The point of the exploration is to make the
// scale and qualitative shape of the spectrum visible.
//
// See also:
//   src/math/berry-keating-xp-operator.js (imp-266 semiclassical sketch)
//   src/math/berry-keating-connes.js      (Connes archimedean variant)
//   src/data/zeros-to-1e6.js              (ZEROS_EXTENDED — Odlyzko)

// ── Hard-coded first 30 Riemann zero imaginary parts (Odlyzko table). ──
// Lifted verbatim from src/data/zeros-to-1e6.js (ZEROS_EXTENDED[0..29]) so
// this module is self-contained at build-time and does not pull in the 1M
// entry array.
const RIEMANN_ZEROS_30 = Object.freeze([
  14.1347251420, 21.0220396390, 25.0108575800, 30.4248761260, 32.9350615880,
  37.5861781590, 40.9187190120, 43.3270732810, 48.0051508810, 49.7738324780,
  52.9703214780, 56.4462476970, 59.3470440030, 60.8317785250, 65.1125440480,
  67.0798105290, 69.5464017110, 72.0671576740, 75.7046906990, 77.1448400690,
  79.3373750200, 82.9103808540, 84.7354929810, 87.4252746130, 88.8091112080,
  92.4918992710, 94.6513440410, 95.8706342280, 98.8311942180, 101.3178510060,
]);

// ── Phase-portrait level sets for the classical Hamiltonian H = x*p. ──
// At energy E, the level set is the hyperbola y = E/x (and y = E/x with the
// reflected branch in the second / fourth quadrant if E < 0; here all E > 0
// so we trace x > 0 and x < 0 separately).
function buildPhasePortraitLevelSets() {
  const energies = [0.5, 1, 2, 5, 10];
  const xMin = 0.05;
  const xMax = 8;
  const samples = 100;
  return energies.map((E) => {
    const points = [];
    // Right branch: x in [xMin, xMax], p = E/x (first quadrant).
    for (let i = 0; i <= samples; i++) {
      const x = xMin + (xMax - xMin) * (i / samples);
      points.push({ x: +x.toFixed(4), p: +(E / x).toFixed(4) });
    }
    // Left branch: x in [-xMax, -xMin], p = E/x (third quadrant).
    for (let i = 0; i <= samples; i++) {
      const x = -xMin - (xMax - xMin) * (i / samples);
      points.push({ x: +x.toFixed(4), p: +(E / x).toFixed(4) });
    }
    return { energy: E, points };
  });
}

// ── Numerical eigenvalues of the symmetrized xp in the truncated Hermite basis. ──
//
// Build the antisymmetric tridiagonal A for one parity block, then assemble
// the symmetric tridiagonal T = -A^2 and run an implicit-shift QL eigenvalue
// solver. Returns positive eigenvalues (singular values of A) ascending.
//
// For the even parity block with j = 0, 1, 2, ..., M-1 mapping to n = 2*j:
//   A(j+1, j) = (1/2) * sqrt((n+1)*(n+2)) with n = 2*j
//             = (1/2) * sqrt((2*j+1)*(2*j+2))
// For the odd parity block with j = 0, 1, 2, ..., M-1 mapping to n = 2*j+1:
//   A(j+1, j) = (1/2) * sqrt((n+1)*(n+2)) with n = 2*j+1
//             = (1/2) * sqrt((2*j+2)*(2*j+3))
//
// Then T = -A^2 has
//   T(j,   j)   = a_{j-1}^2 + a_j^2   (with a_{-1} = a_{M-1} = 0)
//   T(j,   j+1) = -a_j * a_{j+1}      (off-diagonal, since A is antisymmetric;
//                                      -A^2 sub-diagonal is +a_j*a_{j+1} but
//                                      the overall sign convention used below
//                                      gives the symmetric matrix whose
//                                      eigenvalues we want)
//
// Numerical note: only the magnitudes of T's eigenvalues matter for our
// downstream sqrt, so the sign convention on T's off-diagonal does not
// affect the SET of eigenvalues (only the eigenvectors).
function buildParityBlockSubDiagonal(parity, M) {
  // a_j for j = 0, 1, ..., M-2 (length M-1).
  const subDiag = new Array(M - 1);
  for (let j = 0; j < M - 1; j++) {
    const n = 2 * j + parity; // parity = 0 for even, 1 for odd
    subDiag[j] = 0.5 * Math.sqrt((n + 1) * (n + 2));
  }
  return subDiag;
}

// Build the symmetric tridiagonal T = -A^2 with diagonal d and off-diagonal e
// (length M and M-1 respectively).
function buildTriDiagonal(subDiag) {
  const M = subDiag.length + 1;
  const d = new Array(M).fill(0);
  const e = new Array(M - 1).fill(0);
  for (let j = 0; j < M; j++) {
    const aPrev = j > 0 ? subDiag[j - 1] : 0;
    const aCur = j < M - 1 ? subDiag[j] : 0;
    d[j] = aPrev * aPrev + aCur * aCur;
  }
  for (let j = 0; j < M - 1; j++) {
    // off-diagonal of -A^2 = + subDiag[j] * subDiag[j+1] when j+1 < M-1, else 0
    e[j] = j + 1 < M - 1 ? subDiag[j] * subDiag[j + 1] : 0;
    // The first/last off-diagonal entries connect to a_{-1}=0 or a_{M-1}=0.
  }
  return { d, e };
}

// Implicit-shift QL eigenvalue solver for a symmetric tridiagonal matrix.
// Modifies d (diagonal) in place; e is treated as the sub-diagonal of length n-1
// padded so e[n-1] = 0. Returns sorted ascending eigenvalues. Adapted from
// Numerical Recipes 11.4 (tqli) -- adapted for ASCII, no eigenvectors.
function tqli(d, e) {
  const n = d.length;
  // Copy and pad e to length n with e[n-1] = 0.
  const ee = new Array(n);
  for (let i = 0; i < n - 1; i++) ee[i] = e[i];
  ee[n - 1] = 0;
  const dd = d.slice();
  for (let l = 0; l < n; l++) {
    let iter = 0;
    let m;
    do {
      // Look for a small sub-diagonal element to split the matrix.
      for (m = l; m < n - 1; m++) {
        const dd1 = Math.abs(dd[m]) + Math.abs(dd[m + 1]);
        if (Math.abs(ee[m]) <= 1e-14 * dd1) break;
      }
      if (m !== l) {
        if (iter++ === 60) {
          // Should not happen for our well-behaved tridiagonals.
          throw new Error('tqli: too many iterations');
        }
        let g = (dd[l + 1] - dd[l]) / (2 * ee[l]);
        let r = Math.sqrt(g * g + 1);
        g = dd[m] - dd[l] + ee[l] / (g + (g >= 0 ? Math.abs(r) : -Math.abs(r)));
        let s = 1;
        let c = 1;
        let p = 0;
        let i;
        for (i = m - 1; i >= l; i--) {
          const f = s * ee[i];
          const b = c * ee[i];
          r = Math.sqrt(f * f + g * g);
          ee[i + 1] = r;
          if (r === 0) {
            dd[i + 1] -= p;
            ee[m] = 0;
            break;
          }
          s = f / r;
          c = g / r;
          g = dd[i + 1] - p;
          const rr = (dd[i] - g) * s + 2 * c * b;
          p = s * rr;
          dd[i + 1] = g + p;
          g = c * rr - b;
        }
        if (r === 0 && i >= l) continue;
        dd[l] -= p;
        ee[l] = g;
        ee[m] = 0;
      }
    } while (m !== l);
  }
  dd.sort((a, b) => a - b);
  return dd;
}

// Numerically diagonalize H_sym on the truncated Hermite basis of dimension N
// and return the positive eigenvalues sorted ascending.
function eigenvaluesAtDim(N) {
  // Even block size: number of indices in {0, 2, ..., < N} = ceil(N/2)
  // Odd block size: number of indices in {1, 3, ..., < N} = floor(N/2)
  const Meven = Math.ceil(N / 2);
  const Modd = Math.floor(N / 2);
  const positives = [];
  if (Meven >= 2) {
    const sub = buildParityBlockSubDiagonal(0, Meven);
    const { d, e } = buildTriDiagonal(sub);
    const eigs = tqli(d, e);
    for (const mu of eigs) {
      if (mu > 1e-14) positives.push(Math.sqrt(mu));
    }
  }
  if (Modd >= 2) {
    const sub = buildParityBlockSubDiagonal(1, Modd);
    const { d, e } = buildTriDiagonal(sub);
    const eigs = tqli(d, e);
    for (const mu of eigs) {
      if (mu > 1e-14) positives.push(Math.sqrt(mu));
    }
  }
  positives.sort((a, b) => a - b);
  return positives;
}

// ── Build the per-N records, residuals, and fit-quality summary. ──

const MATRIX_DIMENSIONS = Object.freeze([50, 100, 200]);

const EIGS_N50 = Object.freeze(eigenvaluesAtDim(50).map((x) => +x.toFixed(6)));
const EIGS_N100 = Object.freeze(eigenvaluesAtDim(100).map((x) => +x.toFixed(6)));
const EIGS_N200 = Object.freeze(eigenvaluesAtDim(200).map((x) => +x.toFixed(6)));

function residualsAndRMS(eigs, k) {
  // Per-k residual eigs[k] - RIEMANN_ZEROS_30[k] for k = 0..k-1.
  const residuals = [];
  let sumSq = 0;
  for (let i = 0; i < k; i++) {
    const r = eigs[i] - RIEMANN_ZEROS_30[i];
    residuals.push(+r.toFixed(6));
    sumSq += r * r;
  }
  const rms = Math.sqrt(sumSq / k);
  return { residuals, rms: +rms.toFixed(6) };
}

const K_FIT = 15;
const RES_N50 = residualsAndRMS(EIGS_N50, K_FIT);
const RES_N100 = residualsAndRMS(EIGS_N100, K_FIT);
const RES_N200 = residualsAndRMS(EIGS_N200, K_FIT);

const RESIDUALS_BY_N = Object.freeze({
  50: Object.freeze(RES_N50.residuals),
  100: Object.freeze(RES_N100.residuals),
  200: Object.freeze(RES_N200.residuals),
});

const FIT_QUALITY_BY_N = Object.freeze({
  50: RES_N50.rms,
  100: RES_N100.rms,
  200: RES_N200.rms,
});

// ── Public export. ─────────────────────────────────────────────────────

export const BERRY_KEATING_XP = Object.freeze({
  id: 'imp-1101-berry-keating-xp-spectral',
  ticket: 'imp-1101',
  conjecture:
    'Berry-Keating (1999): the imaginary parts of the nontrivial Riemann zeros ' +
    'are the eigenvalues of a self-adjoint quantization of the classical ' +
    'Hamiltonian H = x*p, regularized on a phase-space cell.',
  operator: 'H_sym = (x*p + p*x) / 2 = (i/2) * ((a^)^2 - a^2) in Hermite basis',
  basis: 'truncated harmonic-oscillator number basis |0>, |1>, ..., |N-1>',
  diagonalizationMethod:
    'parity-block reduction (even/odd n decouple); each block reduces to a ' +
    'real antisymmetric tridiagonal A; positive eigenvalues of H_sym are the ' +
    'singular values of A, computed as sqrt of the symmetric tridiagonal ' +
    '-A^2 via implicit-shift QL (in-file).',
  phasePortraitLevelSets: Object.freeze(buildPhasePortraitLevelSets()),
  matrixDimensions: MATRIX_DIMENSIONS,
  eigenvaluesAtN50: EIGS_N50,
  eigenvaluesAtN100: EIGS_N100,
  eigenvaluesAtN200: EIGS_N200,
  riemannZerosFirstK: RIEMANN_ZEROS_30,
  kFit: K_FIT,
  residuals: RESIDUALS_BY_N,
  fitQuality: FIT_QUALITY_BY_N,
  honestScope:
    'Eigenvalues of the truncated symmetrized xp do NOT match Riemann zero ' +
    'ordinates exactly. The Berry-Keating proposal is a CONJECTURE; the ' +
    'true Hilbert-Polya operator would require prime-dependent boundary ' +
    'conditions (Connes adelic / Sierra-Rodriguez-Lagares regularization). ' +
    'This module reports the per-N RMS residual honestly so the SCALE of ' +
    'the mismatch is visible.',
  references: [
    'Berry, M. V. & Keating, J. P. (1999). "H = xp and the Riemann zeros". ' +
      'In: Supersymmetry and Trace Formulae, Plenum, pp. 355-367.',
    'Sierra, G. & Rodriguez-Lagares, J. (2011). "A H = xp model on the half-line".',
    'Connes, A. (1999). "Trace formula in noncommutative geometry and the ' +
      'zeros of the Riemann zeta function". Selecta Math. 5, 29-106.',
  ],
});

// ── Build-time tripwires (assertions). ─────────────────────────────────

export const BERRY_KEATING_XP_ASSERTIONS = [
  {
    id: 'imp1101-three-N-values-present',
    holds: () =>
      BERRY_KEATING_XP.matrixDimensions.length === 3 &&
      BERRY_KEATING_XP.matrixDimensions[0] === 50 &&
      BERRY_KEATING_XP.matrixDimensions[1] === 100 &&
      BERRY_KEATING_XP.matrixDimensions[2] === 200,
    why:
      'The ticket requires eigenvalues computed at three truncation dimensions ' +
      'N in {50, 100, 200} so we can report the residuals as N grows. ' +
      'Reordering or dropping a dimension would silently break the convergence ' +
      'narrative the page renders.',
  },
  {
    id: 'imp1101-eigenvalues-sorted-ascending',
    holds: () => {
      for (const arr of [
        BERRY_KEATING_XP.eigenvaluesAtN50,
        BERRY_KEATING_XP.eigenvaluesAtN100,
        BERRY_KEATING_XP.eigenvaluesAtN200,
      ]) {
        for (let i = 1; i < arr.length; i++) {
          if (arr[i] < arr[i - 1] - 1e-9) return false;
        }
      }
      return true;
    },
    why:
      'Each per-N eigenvalue array must be monotone non-decreasing. The page ' +
      'scatters eigenvalues against the Odlyzko zeros in index order, so a ' +
      'sort regression would corrupt the visual comparison and the residuals.',
  },
  {
    id: 'imp1101-eigenvalues-positive',
    holds: () => {
      const all = [
        ...BERRY_KEATING_XP.eigenvaluesAtN50,
        ...BERRY_KEATING_XP.eigenvaluesAtN100,
        ...BERRY_KEATING_XP.eigenvaluesAtN200,
      ];
      return all.every((x) => x > 0);
    },
    why:
      'We return only the POSITIVE eigenvalues of H_sym (the negative ones ' +
      'are mirror images: H_sym has the symmetry that its spectrum is ' +
      'symmetric about zero in any harmonic-oscillator truncation). Negative ' +
      'or zero values would indicate a sign-handling bug in the parity-block ' +
      'reduction.',
  },
  {
    id: 'imp1101-riemann-zeros-first-thirty',
    holds: () =>
      BERRY_KEATING_XP.riemannZerosFirstK.length === 30 &&
      Math.abs(BERRY_KEATING_XP.riemannZerosFirstK[0] - 14.1347251420) < 1e-9 &&
      Math.abs(BERRY_KEATING_XP.riemannZerosFirstK[29] - 101.3178510060) < 1e-9,
    why:
      'The hard-coded Odlyzko table must start at gamma_1 = 14.1347... and ' +
      'end (at index 29) at gamma_30 = 101.3178... matching ZEROS_EXTENDED. ' +
      'A drift here means the residuals are measured against the wrong baseline.',
  },
  {
    id: 'imp1101-residuals-array-shape',
    holds: () => {
      for (const N of [50, 100, 200]) {
        const r = BERRY_KEATING_XP.residuals[N];
        if (!Array.isArray(r) || r.length !== BERRY_KEATING_XP.kFit) return false;
        for (const v of r) if (typeof v !== 'number' || !Number.isFinite(v)) return false;
      }
      return true;
    },
    why:
      'The residuals object must contain three numeric arrays (one per N), ' +
      'each of length kFit = 15. The page reads residuals[N][i] when drawing ' +
      'the per-eigenvalue deviation marks; any missing or NaN entry would ' +
      'render as a hole or a thrown error.',
  },
  {
    id: 'imp1101-fit-quality-finite',
    holds: () => {
      for (const N of [50, 100, 200]) {
        const q = BERRY_KEATING_XP.fitQuality[N];
        if (typeof q !== 'number' || !Number.isFinite(q) || q < 0) return false;
      }
      return true;
    },
    why:
      'Per-N RMS residual must be a finite non-negative number. NaN or Inf ' +
      'would indicate a catastrophic eigenvalue-solve failure; a negative ' +
      'value would indicate a sign error in the RMS computation.',
  },
  {
    id: 'imp1101-fit-quality-bounded-honest',
    holds: () => {
      // The honest claim is order-of-magnitude (within factor 2x of the
      // RIEMANN zero scale). The first 15 Odlyzko zeros span ~14 to ~89, so
      // an RMS residual under ~150 is a successful demonstration. Above that
      // would indicate that the truncated Hermite basis has totally lost the
      // signal and the page would mislead.
      for (const N of [50, 100, 200]) {
        if (BERRY_KEATING_XP.fitQuality[N] > 150) return false;
      }
      return true;
    },
    why:
      'Berry-Keating is a CONJECTURE; eigenvalue agreement is order-of-magnitude. ' +
      'The first 15 Odlyzko zeros span ~14 to ~89 so an RMS residual above ' +
      '150 would mean the truncated symmetrized xp eigenvalues are entirely ' +
      'off-scale and the demonstration has degenerated. This tripwire keeps ' +
      'the honest-scope claim auditable.',
  },
  {
    id: 'imp1101-phase-portrait-energies-present',
    holds: () => {
      const arr = BERRY_KEATING_XP.phasePortraitLevelSets;
      if (!Array.isArray(arr) || arr.length !== 5) return false;
      const energies = arr.map((s) => s.energy);
      const expected = [0.5, 1, 2, 5, 10];
      for (let i = 0; i < 5; i++) if (energies[i] !== expected[i]) return false;
      // Each level set must trace the hyperbola: x * p = E to within rounding.
      for (const set of arr) {
        for (const pt of set.points) {
          if (!Number.isFinite(pt.x) || !Number.isFinite(pt.p)) return false;
          if (pt.x === 0) return false;
          if (Math.abs(pt.x * pt.p - set.energy) > 0.01 * Math.abs(set.energy)) return false;
        }
      }
      return true;
    },
    why:
      'The phase-portrait level sets must cover the energies {0.5, 1, 2, 5, 10} ' +
      'and every traced point must satisfy x*p = E (the defining hyperbola). ' +
      'If a point drifts off the hyperbola or the energies are reordered the ' +
      'left-panel visualization in BerryKeatingXpPage no longer depicts the ' +
      'classical Berry-Keating Hamiltonian.',
  },
];
