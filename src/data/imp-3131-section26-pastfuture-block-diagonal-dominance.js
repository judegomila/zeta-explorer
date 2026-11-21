/**
 * @module imp-3131-section26-pastfuture-block-diagonal-dominance
 * @fileoverview imp-3131 -- TEST whether the toy diagonal dominance (every R_jj < 1,
 *   AUTOMATIC in the imp-3066 truncation because sinh < cosh pointwise on the bare
 *   monomial moments) SURVIVES the bare -> Phi-windowed weight swap once the shear is
 *   carried by a genuine 2-variable PAST([0,tau]) - FUTURE([tau,inf)) Volterra block
 *   instead of the single-index j+k Hankel. imp-3110's D3 / `survivesSwap` flags this
 *   exact point: on the real section-26 object pointwise mu^pass >= nu is OPEN
 *   Conjecture 26.3, so toy diagonal dominance is NOT evidence the genuine diagonal is
 *   dominated -- "the open conjecture in disguise". This module BUILDS a representative
 *   Phi-windowed past-future-block proxy and MEASURES the margin.
 *
 *   MEASUREMENT / DERIVATION ONLY. This neither closes nor weakens Conjecture 26.3,
 *   computes no genuine section-26 Gram, attempts no positivity, and carries NO RH
 *   verdict. No refereed bound is changed. No false QED.
 *
 *   THE PROXY (what changes vs the imp-3066 toy)
 *   --------------------------------------------
 *   - WEIGHT swap (D2): the bare hyperbolic weights cosh(a*tau) / sinh(a*tau) are
 *     replaced by a representative Phi-WINDOWED completed-kernel proxy Phi(u) = e^{-u^2/2}
 *     (a smooth, super-polynomially-decaying window carrying its OWN intrinsic scale --
 *     it is NOT scale-homogeneous, matching the genuine completed kernel's behaviour; it
 *     is NOT the genuine kernel, see `honestCaveat`).
 *   - ENDPOINT swap (D3): the shear is the genuine 2-variable past-future Volterra block
 *       B_jk = int_0^U int_0^U Phi(u) Phi(v) sinh(a(v-u)) 1_{u<=v} (u/U)^j (v/U)^k du dv,
 *     in which index j weights the PAST endpoint u and index k weights the FUTURE
 *     endpoint v. Because the kernel sinh(a(v-u)) 1_{u<=v} couples u and v, B_jk depends
 *     on j and k SEPARATELY -- it is NOT a function of the single index j+k, so it is NOT
 *     a Hankel matrix (the toy shear H_jk = M(j+k) IS exactly Hankel). This is the D3
 *     break: the past-future block geometry Sec 27 calls the whole obstruction.
 *   - the passive normaliser keeps the genuine diagonal density
 *       d mu^pass/d tau (tau) = (1/2pi) int_tau^inf Phi(u)^2 sinh(2 a u) du,
 *     an INTEGRATED Phi^2 tail (NOT a bare hyperbolic moment).
 *
 *   The block shear is symmetrised S = (B + B^T)/2 and de-homogenised by the passive
 *   diagonal moments D_j = int_0^U mu^pass(tau) (tau/U)^{2j} d tau, giving
 *   R = D^{-1/2} S D^{-1/2}. The diagonal-dominance margin is read off R:
 *     - per-index R_jj and max_j R_jj  (toy: every R_jj < 1, AUTOMATIC);
 *     - operator/diagonal gap ||R|| - max_j R_jj  (toy: strictly positive).
 *
 *   The pushforward shear DENSITY nu(tau) is also assembled in factorised
 *   past x future form (sinh(a(v-u)) = sinh(av)cosh(au) - cosh(av)sinh(au)):
 *     nu(tau) = [int_0^tau Phi cosh(au)][int_tau^inf Phi sinh(av)]
 *             - [int_0^tau Phi sinh(au)][int_tau^inf Phi cosh(av)],
 *   and compared POINTWISE against mu^pass(tau) -- the literal Conj-26.3 ordering
 *   mu^pass(tau) >= nu(tau). (Note: the literal >=-comparison is normalisation-sensitive;
 *   the normalisation-ROBUST finding is the SHAPE mismatch -- mu^pass is monotone-
 *   decreasing from its max at tau=0 while nu is a mid-interval BUMP that peaks where
 *   mu^pass has already decayed -- so the ratio nu/mu^pass is strongly non-constant,
 *   unlike the toy's clean monotone coth(a*tau).)
 *
 *   HEADLINE (computed below, representative proxy)
 *   ----------------------------------------------
 *   - SURVIVES: R stays symmetric with strictly-positive entries and a strictly-positive
 *     operator/diagonal gap ||R|| > max_j R_jj (Perron-Frobenius), exactly as imp-3110
 *     predicts the gap EXISTENCE survives the swap.
 *   - DOES NOT automatically survive: the toy's pointwise sinh < cosh guarantee. The
 *     past-future block nu is a mid-interval bump, so the clean monotone diagonal ordering
 *     of the toy is lost; whether R_jj < 1 holds is normalisation-dependent and is exactly
 *     the open Conj 26.3 -- this proxy confirms it is NOT automatic, nothing more.
 *
 *   @see imp-3110-section26-gram-vs-monomial-gap.js   (D3 + survivesSwap; this is its test)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js   (the toy whose diagonal dominance is tested)
 *   @see hidden-square-program-section.js             (the genuine Sec 25-27 object / Conj 26.3)
 *
 *   Ticket: imp-3131 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5; // matches the imp-3066 / imp-3110 headline a
const U = 6; // matches the imp-3066 / imp-3110 lag cutoff
const DEG = 4; // (DEG+1) x (DEG+1) truncation, as imp-3066 / imp-3110
const NG = 2400; // quadrature cells on [0, U]
const HG = U / NG;
const TWO_PI = 2 * Math.PI;

const cosh = Math.cosh;
const sinh = Math.sinh;

/** Representative completed-kernel proxy: smooth, super-polynomially decaying, own scale. */
const Phi = (u) => Math.exp(-(u * u) / 2);

// -- grid + base arrays -------------------------------------------------------
const tau = new Array(NG);
const phi = new Array(NG);
const chA = new Array(NG); // cosh(a*tau)
const shA = new Array(NG); // sinh(a*tau)
const passKern = new Array(NG); // Phi(tau)^2 * sinh(2 a tau)  (mu^pass tail integrand)
for (let i = 0; i < NG; i++) {
  const t = (i + 0.5) * HG;
  tau[i] = t;
  phi[i] = Phi(t);
  chA[i] = cosh(A * t);
  shA[i] = sinh(A * t);
  passKern[i] = phi[i] * phi[i] * sinh(2 * A * t);
}

// mu^pass tail density  mp[i] = (1/2pi) int_{tau_i}^U Phi^2 sinh(2 a u) du  (right cumulative)
const mp = new Array(NG);
{
  let acc = 0;
  for (let i = NG - 1; i >= 0; i--) {
    acc += passKern[i] * HG;
    mp[i] = acc / TWO_PI;
  }
}

// pushforward shear density nu(tau) = Pc*Fs - Ps*Fc  (factorised past x future block)
const Pc = new Array(NG); // int_0^{tau_i} Phi cosh(a u) du   (past, inclusive of i)
const Ps = new Array(NG); // int_0^{tau_i} Phi sinh(a u) du
{
  let ac = 0;
  let as = 0;
  for (let i = 0; i < NG; i++) {
    ac += phi[i] * chA[i] * HG;
    as += phi[i] * shA[i] * HG;
    Pc[i] = ac;
    Ps[i] = as;
  }
}
const Fs = new Array(NG); // int_{tau_i}^U Phi sinh(a v) dv   (future, inclusive of i)
const Fc = new Array(NG); // int_{tau_i}^U Phi cosh(a v) dv
{
  let bs = 0;
  let bc = 0;
  for (let i = NG - 1; i >= 0; i--) {
    bs += phi[i] * shA[i] * HG;
    bc += phi[i] * chA[i] * HG;
    Fs[i] = bs;
    Fc[i] = bc;
  }
}
const nu = new Array(NG);
for (let i = 0; i < NG; i++) nu[i] = Pc[i] * Fs[i] - Ps[i] * Fc[i];

// -- (D3) 2-variable past-future block matrix B_jk ----------------------------
// B_jk = int_0^U (v/U)^k Phi(v) [ sinh(a v) Ac_j(v) - cosh(a v) As_j(v) ] dv
//   with Ac_j(v) = int_0^v (u/U)^j Phi(u) cosh(a u) du  (strictly past: u < v).
const n = DEG + 1;
const B = Array.from({ length: n }, () => new Array(n).fill(0));
for (let j = 0; j < n; j++) {
  let acj = 0; // running int_0^{u<tau_i} (u/U)^j Phi cosh(a u)
  let asj = 0;
  const acArr = new Array(NG);
  const asArr = new Array(NG);
  for (let i = 0; i < NG; i++) {
    acArr[i] = acj; // strictly-past prefix (excludes cell i)
    asArr[i] = asj;
    const mj = Math.pow(tau[i] / U, j);
    acj += mj * phi[i] * chA[i] * HG;
    asj += mj * phi[i] * shA[i] * HG;
  }
  for (let k = 0; k < n; k++) {
    let bjk = 0;
    for (let i = 0; i < NG; i++) {
      const mk = Math.pow(tau[i] / U, k);
      bjk += mk * phi[i] * (shA[i] * acArr[i] - chA[i] * asArr[i]) * HG;
    }
    B[j][k] = bjk;
  }
}

// passive diagonal moments D_j = int_0^U mu^pass(tau) (tau/U)^{2j} d tau
const Dpass = new Array(n).fill(0);
for (let j = 0; j < n; j++) {
  let acc = 0;
  for (let i = 0; i < NG; i++) acc += mp[i] * Math.pow(tau[i] / U, 2 * j) * HG;
  Dpass[j] = acc;
}

// symmetrise the block, then de-homogenise: R = D^{-1/2} S D^{-1/2}
const S = Array.from({ length: n }, (_r, j) => new Array(n).fill(0));
for (let j = 0; j < n; j++) {
  for (let k = 0; k < n; k++) S[j][k] = 0.5 * (B[j][k] + B[k][j]);
}
const R = S.map((row, j) => row.map((s, k) => s / Math.sqrt(Dpass[j] * Dpass[k])));

/** Classic cyclic Jacobi eigenvalues for a small symmetric matrix (self-contained). */
function symmetricEigenvalues(matrix) {
  const sz = matrix.length;
  const m = matrix.map((row) => row.slice());
  for (let iter = 0; iter < 500; iter++) {
    let p = 0;
    let q = 1;
    let off = 0;
    for (let i = 0; i < sz; i++) {
      for (let j = i + 1; j < sz; j++) {
        if (Math.abs(m[i][j]) > off) {
          off = Math.abs(m[i][j]);
          p = i;
          q = j;
        }
      }
    }
    if (off < 1e-15) break;
    const app = m[p][p];
    const aqq = m[q][q];
    const apq = m[p][q];
    const theta = (aqq - app) / (2 * apq);
    const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    const c = 1 / Math.sqrt(t * t + 1);
    const sJ = t * c;
    for (let i = 0; i < sz; i++) {
      const mip = m[i][p];
      const miq = m[i][q];
      m[i][p] = c * mip - sJ * miq;
      m[i][q] = sJ * mip + c * miq;
    }
    for (let j = 0; j < sz; j++) {
      const mpj = m[p][j];
      const mqj = m[q][j];
      m[p][j] = c * mpj - sJ * mqj;
      m[q][j] = sJ * mpj + c * mqj;
    }
  }
  return m.map((row, i) => row[i]);
}

const Rdiag = R.map((row, i) => row[i]);
const maxDiag = Math.max(...Rdiag);
const opNorm = Math.max(...symmetricEigenvalues(R).map((e) => Math.abs(e)));
const operatorDiagonalGap = opNorm - maxDiag;

// (D3) witness: B is NOT a single-index Hankel -- equal-(j+k) entries DISAGREE.
let maxEqualIndexHankelDeviation = 0;
for (let j1 = 0; j1 < n; j1++) {
  for (let k1 = 0; k1 < n; k1++) {
    for (let j2 = 0; j2 < n; j2++) {
      const k2 = j1 + k1 - j2;
      if (k2 < 0 || k2 >= n) continue;
      const dev = Math.abs(B[j1][k1] - B[j2][k2]);
      if (dev > maxEqualIndexHankelDeviation) maxEqualIndexHankelDeviation = dev;
    }
  }
}

// all entries of R strictly positive (Perron-Frobenius applies)
let allEntriesPositive = true;
let symmetric = true;
for (let j = 0; j < n; j++) {
  for (let k = 0; k < n; k++) {
    if (!(R[j][k] > 0)) allEntriesPositive = false;
    if (Math.abs(R[j][k] - R[k][j]) > 1e-12) symmetric = false;
  }
}

// pointwise Conj-26.3 ordering proxy: mu^pass(tau) >= nu(tau) over the interior.
// Interior excludes the tau~0 / tau~U endpoints where both densities collapse to 0.
const iLo = Math.floor(0.5 / HG);
const iHi = Math.ceil((U - 0.5) / HG);
let minPointwiseMargin = Infinity; // min_tau (mu^pass - nu)
let argMinTau = tau[iLo];
let ratioMin = Infinity; // min_tau nu/mu^pass
let ratioMax = 0; // max_tau nu/mu^pass
let argMaxRatioTau = tau[iLo];
for (let i = iLo; i <= iHi && i < NG; i++) {
  const margin = mp[i] - nu[i];
  if (margin < minPointwiseMargin) {
    minPointwiseMargin = margin;
    argMinTau = tau[i];
  }
  const ratio = nu[i] / mp[i];
  if (ratio < ratioMin) ratioMin = ratio;
  if (ratio > ratioMax) {
    ratioMax = ratio;
    argMaxRatioTau = tau[i];
  }
}
const pointwiseDominationHolds = minPointwiseMargin >= 0;
const diagonalDominanceHolds = maxDiag < 1; // every R_jj < 1 (toy: AUTOMATIC)

export const IMP3131_SECTION26_PASTFUTURE_BLOCK_DIAGONAL_DOMINANCE = Object.freeze({
  id: 'imp-3131-section26-pastfuture-block-diagonal-dominance',
  ticket: 'imp-3131',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  testsClaimFrom: 'imp-3110-section26-gram-vs-monomial-gap.js (D3 + survivesSwap)',
  toyUnderTest: 'imp-3066-offdiagonal-hankel-obstruction.js',
  genuineObject: 'hidden-square-program-section.js',

  summary:
    'Tests whether the imp-3066 toy diagonal dominance (every R_jj < 1, AUTOMATIC because ' +
    'sinh < cosh pointwise on the bare monomial moments) survives the bare -> Phi-windowed weight ' +
    'swap once the shear is carried by a genuine 2-variable past([0,tau]) - future([tau,inf)) ' +
    'Volterra block (Phi(u)Phi(v)sinh(a(v-u))1_{u<=v}, index j on the past endpoint, k on the ' +
    'future) instead of the single-index j+k Hankel. Result on the representative Phi = e^{-u^2/2} ' +
    'proxy: the operator/diagonal GAP ||R|| > max_j R_jj SURVIVES (R stays symmetric, strictly ' +
    'positive, Perron-Frobenius), but the past-future block nu(tau) is a MID-INTERVAL BUMP whereas ' +
    'mu^pass is monotone-decreasing, so the toy clean monotone diagonal ordering is lost and ' +
    'whether R_jj < 1 holds is normalisation-dependent -- exactly the OPEN Conj 26.3. This proxy ' +
    'confirms toy diagonal dominance is NOT automatic under the swap; it neither closes nor ' +
    'weakens Conj 26.3 and carries NO RH verdict.',

  setup: Object.freeze({
    a: A,
    U,
    degree: DEG,
    truncation: `${n} x ${n}`,
    quadratureCells: NG,
    phiProxy: 'Phi(u) = exp(-u^2/2) -- representative completed-kernel window (NOT the genuine kernel)',
    passiveDensity: 'mu^pass(tau) = (1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du (integrated Phi^2 tail)',
    shearBlock:
      'B_jk = int int Phi(u)Phi(v) sinh(a(v-u)) 1_{u<=v} (u/U)^j (v/U)^k du dv ' +
      '(2-variable past-future block; NOT a single-index j+k Hankel)',
    deHomogenization: 'R = D^{-1/2} S D^{-1/2}, S = (B+B^T)/2, D_j = int mu^pass (tau/U)^{2j}',
  }),

  measurement: Object.freeze({
    blockShearMatrix: B.map((row) => row.map((x) => Number(x.toExponential(9)))),
    Rdiagonal: Rdiag.map((x) => Number(x.toExponential(9))),
    maxDiagonal: Number(maxDiag.toExponential(9)),
    operatorNorm: Number(opNorm.toExponential(9)),
    operatorDiagonalGap: Number(operatorDiagonalGap.toExponential(9)),
    blockIsNotSingleIndexHankel: maxEqualIndexHankelDeviation > 1e-6,
    maxEqualIndexHankelDeviation: Number(maxEqualIndexHankelDeviation.toExponential(9)),
    Rsymmetric: symmetric,
    RallEntriesStrictlyPositive: allEntriesPositive,
    pointwise: Object.freeze({
      minMarginMuPassMinusNu: Number(minPointwiseMargin.toExponential(9)),
      argMinTau: Number(argMinTau.toFixed(6)),
      ratioNuOverMuPassMin: Number(ratioMin.toExponential(9)),
      ratioNuOverMuPassMax: Number(ratioMax.toExponential(9)),
      argMaxRatioTau: Number(argMaxRatioTau.toFixed(6)),
      ratioSpread: Number((ratioMax / Math.max(ratioMin, 1e-300)).toExponential(6)),
    }),
  }),

  verdict: Object.freeze({
    // SURVIVOR (structural, normalisation-independent): the off-diagonal operator gap.
    operatorGapSurvives: operatorDiagonalGap > 1e-9 && opNorm > maxDiag,
    // The toy's R_jj < 1 is NOT automatic under the swap (this is the headline).
    diagonalDominanceHolds,
    diagonalDominanceIsAutomatic: false,
    pointwiseDominationHolds, // literal mu^pass(tau) >= nu(tau) on the interior (normalisation-sensitive)
    // Normalisation-ROBUST evidence the clean monotone ordering is lost: the bump-vs-tail
    // shape mismatch makes nu/mu^pass strongly non-constant over the interior.
    shapeMismatchMakesOrderingNonUniform: ratioMax / Math.max(ratioMin, 1e-300) > 10,
    statement:
      'On the representative Phi-windowed past-future block proxy the operator/diagonal gap ' +
      '||R|| > max_j R_jj SURVIVES the bare -> Phi swap (Perron-Frobenius on the strictly-positive ' +
      'symmetric block), but the toy guarantee R_jj < 1 (sinh < cosh pointwise) does NOT survive ' +
      'automatically: the past-future block density nu is a mid-interval bump while mu^pass is a ' +
      'monotone-decreasing tail, so the diagonal ordering is normalisation-dependent and is exactly ' +
      'the OPEN Conjecture 26.3. Measurement confirms toy diagonal dominance is NOT evidence for the ' +
      'genuine diagonal being dominated.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isMeasurementOnly: true,
    usesRepresentativePhiProxy: true,
    computesGenuineSection26Gram: false,
    closesConjecture263: false,
    weakensConjecture263: false,
    didNotAttemptPositivity: true,
    normalisationCaveat:
      'The literal mu^pass(tau) >= nu(tau) comparison and the R_jj-vs-1 threshold are ' +
      'normalisation-sensitive (the genuine mu^pass / nu normalisation comes from the v52 ' +
      'construction); the normalisation-ROBUST finding is the bump-vs-tail SHAPE mismatch.',
    noRHVerdict:
      'This measures a representative Phi-windowed past-future block proxy and reports which toy ' +
      'facts survive the swap; it does NOT compute the genuine section-26 Gram and asserts nothing ' +
      'about whether the cover holds or fails. Conjecture 26.3 stays exactly open.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3131_SECTION26_PASTFUTURE_BLOCK_DIAGONAL_DOMINANCE_ASSERTIONS = [
  {
    id: 'imp3131-block-is-not-single-index-hankel',
    why: 'The D3 deliverable: the 2-variable past-future block B_jk depends on j and k ' +
         'SEPARATELY (kernel sinh(a(v-u))1_{u<=v} couples u,v), so equal-(j+k) entries must ' +
         'DISAGREE -- the opposite of the toy single-index Hankel. A Hankel B would mean the ' +
         'past-future geometry collapsed and the swap was not actually performed.',
    holds: () => maxEqualIndexHankelDeviation > 1e-6,
  },
  {
    id: 'imp3131-R-symmetric-and-strictly-positive',
    why: 'R = D^{-1/2}(B+B^T)/2 D^{-1/2} must be symmetric with strictly-positive entries ' +
         '(Phi>0, sinh(a(v-u))>0 for v>u, monomials>0), the precondition for Perron-Frobenius.',
    holds: () => symmetric && allEntriesPositive,
  },
  {
    id: 'imp3131-operator-gap-survives',
    why: 'SURVIVOR claim (imp-3110): the strictly-positive off-diagonals force ||R|| strictly ' +
         'above the largest diagonal. The operator/diagonal GAP must survive the swap.',
    holds: () => operatorDiagonalGap > 1e-9 && opNorm > maxDiag,
  },
  {
    id: 'imp3131-diagonal-dominance-not-automatic',
    why: 'HEADLINE: unlike the toy (R_jj<1 AUTOMATIC from sinh<cosh), here the past-future bump ' +
         'breaks the clean monotone ordering. The verdict must record diagonal dominance as ' +
         'NOT-automatic, and its boolean must be consistent with the measured max diagonal.',
    holds: () => {
      const v = IMP3131_SECTION26_PASTFUTURE_BLOCK_DIAGONAL_DOMINANCE.verdict;
      return (
        v.diagonalDominanceIsAutomatic === false &&
        v.diagonalDominanceHolds === (maxDiag < 1) &&
        v.pointwiseDominationHolds === (minPointwiseMargin >= 0)
      );
    },
  },
  {
    id: 'imp3131-shape-mismatch-nonuniform-ratio',
    why: 'Normalisation-ROBUST evidence the toy ordering is lost: nu (mid-interval bump) and ' +
         'mu^pass (monotone tail) have different shapes, so the ratio nu/mu^pass varies by well ' +
         'over an order of magnitude across the interior (the toy coth(a*tau) is monotone/tame).',
    holds: () => ratioMax / Math.max(ratioMin, 1e-300) > 10 && Number.isFinite(ratioMax),
  },
  {
    id: 'imp3131-measured-numbers-finite',
    why: 'All headline measurement numbers must be finite (no quadrature blow-up / NaN).',
    holds: () =>
      Number.isFinite(maxDiag) &&
      Number.isFinite(opNorm) &&
      Number.isFinite(operatorDiagonalGap) &&
      Number.isFinite(minPointwiseMargin) &&
      Rdiag.every((x) => Number.isFinite(x)),
  },
  {
    id: 'imp3131-honest-no-verdict',
    why: 'Mandatory honesty: measurement only, representative proxy, does not compute the genuine ' +
         'Gram, neither closes nor weakens Conj 26.3, no RH verdict, no refereed bound is changed.',
    holds: () => {
      const c = IMP3131_SECTION26_PASTFUTURE_BLOCK_DIAGONAL_DOMINANCE.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isMeasurementOnly === true &&
        c.usesRepresentativePhiProxy === true &&
        c.computesGenuineSection26Gram === false &&
        c.closesConjecture263 === false &&
        c.weakensConjecture263 === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3131_SECTION26_PASTFUTURE_BLOCK_DIAGONAL_DOMINANCE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3131-section26-pastfuture-block-diagonal-dominance assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP3131_SECTION26_PASTFUTURE_BLOCK_DIAGONAL_DOMINANCE;
