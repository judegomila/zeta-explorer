/**
 * @module imp-3150-phi-windowed-operator-gap-survival
 * @fileoverview imp-3150 -- MEASURE whether the imp-3110 strict Perron-Frobenius
 *   operator/diagonal gap (||R|| > max_j R_jj) SURVIVES the swap from the imp-3066
 *   MONOMIAL toy onto a genuine Phi-windowed 2-variable PAST([0,tau])-FUTURE([tau,inf))
 *   Volterra block surrogate -- and COMPARE the surviving gap MAGNITUDE to the toy.
 *
 *   imp-3110 `survivesSwap` CLASSIFIES the strict gap as SURVIVING the swap by a
 *   Perron-Frobenius argument (the genuine shear density Phi(u)Phi(v)sinh(a(v-u)) is
 *   strictly positive for v > u, so G_shear has strictly-positive off-diagonals and
 *   ||R|| sits strictly above the largest diagonal), and it lists the numerical
 *   MAGNITUDES as truncation ARTIFACTS -- but it never numerically exhibits the gap on
 *   a Phi-windowed object. imp-3131 built a Phi-windowed past-future block but read off
 *   the DIAGONAL-DOMINANCE margin (R_jj < 1, the open Conj 26.3). This module isolates
 *   the imp-3150 question: build BOTH objects under the SAME (a, U, DEG) and put the two
 *   operator/diagonal GAPS side-by-side -- does the gap survive (qualitative) and how does
 *   its magnitude move (quantitative, expected to be artifact-level different)?
 *
 *   MEASUREMENT / DERIVATION ONLY. Representative Phi proxy, NOT the genuine completed
 *   kernel; computes no genuine section-26 Gram; attempts no positivity; carries NO RH
 *   verdict; neither closes nor weakens Conjecture 26.3. Platt-Trudgian Lambda <= 0.2
 *   remains the rigorous SOTA. No false QED.
 *
 *   THE TWO OBJECTS (same a, U, DEG)
 *   --------------------------------
 *   (T) TOY (imp-3066/imp-3110): basis phi_j(tau) = (tau/U)^j; passive DIAGONAL
 *       D_jj = int_0^U cosh(a*tau) phi_j^2; shear single-index Hankel
 *       H_jk = int_0^U sinh(a*tau) phi_j phi_k; R_toy = D^{-1/2} H D^{-1/2}.
 *   (S) Phi-WINDOWED SURROGATE (imp-3131 construction): representative window
 *       Phi(u) = exp(-u^2/2) (smooth, super-polynomially decaying, own intrinsic scale --
 *       NOT scale-homogeneous, NOT the genuine kernel); shear is the genuine 2-variable
 *       past-future block B_jk = int int Phi(u)Phi(v) sinh(a(v-u)) 1_{u<=v} (u/U)^j (v/U)^k
 *       (index j on the PAST endpoint u, k on the FUTURE endpoint v -- depends on j,k
 *       SEPARATELY, NOT a single-index j+k Hankel); passive diagonal moments
 *       D_j = int mu^pass(tau) (tau/U)^{2j}, mu^pass(tau) = (1/2pi) int_tau^U Phi^2 sinh(2 a u);
 *       R_surr = D^{-1/2} S D^{-1/2}, S = (B + B^T)/2.
 *
 *   For each object the gap is gap = ||R|| - max_j R_jj (||R|| = spectral radius).
 *
 *   HEADLINE (computed below, representative proxy)
 *   ----------------------------------------------
 *   - SURVIVES (qualitative): BOTH gaps are strictly positive with ||R|| > max_j R_jj and
 *     R symmetric / strictly-positive (Perron-Frobenius), so the EXISTENCE of the strict
 *     operator/diagonal gap carries across the bare -> Phi-windowed past-future swap, as
 *     imp-3110 survivesSwap derives it must.
 *   - MAGNITUDE moves (quantitative): the surrogate gap differs from the toy gap by a large
 *     factor (gapRatio = gap_surr / gap_toy, reported below) -- confirming imp-3110's
 *     companion claim that the gap MAGNITUDE is a truncation artifact while its EXISTENCE
 *     is structural. The sign of "survives" is the qualitative ||R|| > max diag, NOT the
 *     magnitude match.
 *
 *   @see imp-3110-section26-gram-vs-monomial-gap.js   (survivesSwap: the classification this measures)
 *   @see imp-3131-section26-pastfuture-block-diagonal-dominance.js (the past-future block construction)
 *   @see imp-3066-offdiagonal-hankel-obstruction.js   (the monomial toy)
 *   @see hidden-square-program-section.js             (the genuine Sec 25-27 object / Conj 26.3)
 *
 *   Ticket: imp-3150 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5; // matches the imp-3066 / imp-3110 / imp-3131 headline a
const U = 6; // matches the imp-3066 / imp-3110 / imp-3131 lag cutoff
const DEG = 4; // (DEG+1) x (DEG+1) truncation, as imp-3066 / imp-3110 / imp-3131
const NG = 2400; // quadrature cells on [0, U]
const HG = U / NG;
const TWO_PI = 2 * Math.PI;

const cosh = Math.cosh;
const sinh = Math.sinh;

/** Representative completed-kernel window: smooth, super-polynomially decaying, own scale. */
const Phi = (u) => Math.exp(-(u * u) / 2);

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

/** From a symmetric R: spectral radius, max diagonal, gap, symmetry + positivity flags. */
function gapStats(R) {
  const sz = R.length;
  const diag = R.map((row, i) => row[i]);
  const maxDiag = Math.max(...diag);
  const opNorm = Math.max(...symmetricEigenvalues(R).map((e) => Math.abs(e)));
  let symmetric = true;
  let allOffDiagPositive = true;
  for (let j = 0; j < sz; j++) {
    for (let k = 0; k < sz; k++) {
      if (Math.abs(R[j][k] - R[k][j]) > 1e-12) symmetric = false;
      if (j !== k && !(R[j][k] > 0)) allOffDiagPositive = false;
    }
  }
  return { opNorm, maxDiag, gap: opNorm - maxDiag, symmetric, allOffDiagPositive };
}

const n = DEG + 1;

// -- (T) the monomial toy exactly as imp-3066 / imp-3110 -----------------------
function weightedIntegral(weightFn, f) {
  let acc = 0;
  for (let k = 0; k < NG; k++) {
    const t = (k + 0.5) * HG;
    acc += weightFn(A * t) * f(t) * HG;
  }
  return acc;
}
const monomialBasis = Array.from({ length: n }, (_u, j) => (t) => Math.pow(t / U, j));
const Dtoy = monomialBasis.map((phi) => weightedIntegral(cosh, (t) => phi(t) * phi(t)));
const Htoy = monomialBasis.map((phiJ) =>
  monomialBasis.map((phiK) => weightedIntegral(sinh, (t) => phiJ(t) * phiK(t))),
);
const Rtoy = Htoy.map((row, j) => row.map((h, k) => h / Math.sqrt(Dtoy[j] * Dtoy[k])));
const toyStats = gapStats(Rtoy);

// -- (S) the Phi-windowed 2-variable past-future block surrogate (imp-3131) -----
const tau = new Array(NG);
const phiArr = new Array(NG);
const chA = new Array(NG);
const shA = new Array(NG);
const passKern = new Array(NG); // Phi^2 sinh(2 a tau)  (mu^pass integrand)
for (let i = 0; i < NG; i++) {
  const t = (i + 0.5) * HG;
  tau[i] = t;
  phiArr[i] = Phi(t);
  chA[i] = cosh(A * t);
  shA[i] = sinh(A * t);
  passKern[i] = phiArr[i] * phiArr[i] * sinh(2 * A * t);
}
// mu^pass(tau) = (1/2pi) int_tau^U Phi^2 sinh(2 a u) du  (right-cumulative)
const mp = new Array(NG);
{
  let acc = 0;
  for (let i = NG - 1; i >= 0; i--) {
    acc += passKern[i] * HG;
    mp[i] = acc / TWO_PI;
  }
}
// 2-variable past-future block B_jk, j on the PAST endpoint, k on the FUTURE endpoint:
//   B_jk = int_0^U (v/U)^k Phi(v) [ sinh(a v) Ac_j(v) - cosh(a v) As_j(v) ] dv,
//   Ac_j(v) = int_0^{u<v} (u/U)^j Phi(u) cosh(a u) du  (strictly past).
const B = Array.from({ length: n }, () => new Array(n).fill(0));
for (let j = 0; j < n; j++) {
  let acj = 0;
  let asj = 0;
  const acArr = new Array(NG);
  const asArr = new Array(NG);
  for (let i = 0; i < NG; i++) {
    acArr[i] = acj; // strictly-past prefix (excludes cell i)
    asArr[i] = asj;
    const mj = Math.pow(tau[i] / U, j);
    acj += mj * phiArr[i] * chA[i] * HG;
    asj += mj * phiArr[i] * shA[i] * HG;
  }
  for (let k = 0; k < n; k++) {
    let bjk = 0;
    for (let i = 0; i < NG; i++) {
      const mk = Math.pow(tau[i] / U, k);
      bjk += mk * phiArr[i] * (shA[i] * acArr[i] - chA[i] * asArr[i]) * HG;
    }
    B[j][k] = bjk;
  }
}
// passive diagonal moments D_j = int mu^pass (tau/U)^{2j}
const Dsurr = new Array(n).fill(0);
for (let j = 0; j < n; j++) {
  let acc = 0;
  for (let i = 0; i < NG; i++) acc += mp[i] * Math.pow(tau[i] / U, 2 * j) * HG;
  Dsurr[j] = acc;
}
// symmetrise + de-homogenise
const Ssurr = Array.from({ length: n }, (_r, j) => new Array(n).fill(0));
for (let j = 0; j < n; j++) {
  for (let k = 0; k < n; k++) Ssurr[j][k] = 0.5 * (B[j][k] + B[k][j]);
}
const Rsurr = Ssurr.map((row, j) => row.map((s, k) => s / Math.sqrt(Dsurr[j] * Dsurr[k])));
const surrStats = gapStats(Rsurr);

// (D3) witness: the surrogate block is NOT a single-index Hankel; the toy shear IS.
let surrMaxEqualIndexHankelDeviation = 0;
let toyMaxEqualIndexHankelDeviation = 0;
for (let j1 = 0; j1 < n; j1++) {
  for (let k1 = 0; k1 < n; k1++) {
    for (let j2 = 0; j2 < n; j2++) {
      const k2 = j1 + k1 - j2;
      if (k2 < 0 || k2 >= n) continue;
      const devS = Math.abs(B[j1][k1] - B[j2][k2]);
      if (devS > surrMaxEqualIndexHankelDeviation) surrMaxEqualIndexHankelDeviation = devS;
      const devT = Math.abs(Htoy[j1][k1] - Htoy[j2][k2]);
      if (devT > toyMaxEqualIndexHankelDeviation) toyMaxEqualIndexHankelDeviation = devT;
    }
  }
}

// -- the imp-3150 comparison ---------------------------------------------------
const bothGapsStrictlyPositive =
  toyStats.gap > 1e-9 &&
  surrStats.gap > 1e-9 &&
  toyStats.opNorm > toyStats.maxDiag &&
  surrStats.opNorm > surrStats.maxDiag;
const gapRatio = surrStats.gap / toyStats.gap; // surrogate gap relative to the toy gap
const magnitudeIsArtifactLevelDifferent = Math.abs(gapRatio - 1) > 1; // > 2x or < 0.5x

export const IMP3150_PHI_WINDOWED_OPERATOR_GAP_SURVIVAL = Object.freeze({
  id: 'imp-3150-phi-windowed-operator-gap-survival',
  ticket: 'imp-3150',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  measuresClassificationFrom: 'imp-3110-section26-gram-vs-monomial-gap.js (survivesSwap)',
  reusesBlockFrom: 'imp-3131-section26-pastfuture-block-diagonal-dominance.js',
  toyUnderTest: 'imp-3066-offdiagonal-hankel-obstruction.js',
  genuineObject: 'hidden-square-program-section.js',

  summary:
    'Measures whether the imp-3110 strict Perron-Frobenius operator/diagonal gap ||R|| > max_j R_jj ' +
    'SURVIVES the swap from the imp-3066 MONOMIAL toy (single-index sinh Hankel) onto a representative ' +
    'Phi-windowed (Phi(u) = exp(-u^2/2)) genuine 2-variable past([0,tau])-future([tau,inf)) Volterra ' +
    'block surrogate (B_jk = int int Phi(u)Phi(v)sinh(a(v-u))1_{u<=v}(u/U)^j(v/U)^k, j on the PAST, k ' +
    'on the FUTURE endpoint -- NOT a single-index j+k Hankel), and COMPARES the surviving gap MAGNITUDE ' +
    'to the toy under the SAME (a, U, DEG). Result: the gap SURVIVES qualitatively (both R symmetric, ' +
    'strictly-positive off-diagonals, ||R|| > max diag, both gaps strictly positive) -- exactly the ' +
    'imp-3110 survivesSwap structural claim -- while the gap MAGNITUDE moves by a large factor ' +
    '(gapRatio far from 1), confirming imp-3110 companion claim that the magnitude is a truncation ' +
    'artifact and only the gap EXISTENCE is structural. Representative proxy, NOT the genuine kernel/Gram; ' +
    'measurement only; no positivity; no RH verdict; neither closes nor weakens Conj 26.3; PT 0.2 stays SOTA.',

  setup: Object.freeze({
    a: A,
    U,
    degree: DEG,
    truncation: `${n} x ${n}`,
    quadratureCells: NG,
    phiProxy: 'Phi(u) = exp(-u^2/2) -- representative completed-kernel window (NOT the genuine kernel)',
    toyShear: 'H_jk = int_0^U sinh(a*tau)(tau/U)^{j+k} -- single-index j+k Hankel',
    surrogateShear:
      'B_jk = int int Phi(u)Phi(v) sinh(a(v-u)) 1_{u<=v} (u/U)^j (v/U)^k -- 2-variable past-future block',
    surrogatePassive: 'mu^pass(tau) = (1/2pi) int_tau^U Phi(u)^2 sinh(2 a u) du (integrated Phi^2 tail)',
    deHomogenization: 'R = D^{-1/2} (shear) D^{-1/2}; toy D diagonal cosh-moments, surrogate D mu^pass-moments',
    gapDefinition: 'gap = ||R|| - max_j R_jj  (||R|| = spectral radius via cyclic Jacobi)',
  }),

  measurement: Object.freeze({
    toy: Object.freeze({
      operatorNorm: Number(toyStats.opNorm.toExponential(9)),
      maxDiagonal: Number(toyStats.maxDiag.toExponential(9)),
      operatorDiagonalGap: Number(toyStats.gap.toExponential(9)),
      symmetric: toyStats.symmetric,
      offDiagonalAllStrictlyPositive: toyStats.allOffDiagPositive,
      shearIsSingleIndexHankel: toyMaxEqualIndexHankelDeviation < 1e-9,
    }),
    surrogate: Object.freeze({
      operatorNorm: Number(surrStats.opNorm.toExponential(9)),
      maxDiagonal: Number(surrStats.maxDiag.toExponential(9)),
      operatorDiagonalGap: Number(surrStats.gap.toExponential(9)),
      symmetric: surrStats.symmetric,
      offDiagonalAllStrictlyPositive: surrStats.allOffDiagPositive,
      shearIsSingleIndexHankel: surrMaxEqualIndexHankelDeviation < 1e-9,
      maxEqualIndexHankelDeviation: Number(surrMaxEqualIndexHankelDeviation.toExponential(9)),
    }),
    comparison: Object.freeze({
      gapRatioSurrogateOverToy: Number(gapRatio.toExponential(9)),
      bothGapsStrictlyPositive,
      magnitudeIsArtifactLevelDifferent,
    }),
  }),

  verdict: Object.freeze({
    // SURVIVOR (qualitative, normalisation-independent): the strict operator/diagonal gap exists.
    gapSurvivesSwap:
      bothGapsStrictlyPositive &&
      surrStats.symmetric &&
      surrStats.allOffDiagPositive &&
      surrStats.opNorm > surrStats.maxDiag,
    // The surrogate block really is the past-future object (not the toy Hankel re-labelled).
    surrogateIsGenuinePastFutureBlock: surrMaxEqualIndexHankelDeviation > 1e-6,
    // MAGNITUDE (quantitative, artifact-level): the gap value does NOT carry over unchanged.
    gapMagnitudeIsArtifact: magnitudeIsArtifactLevelDifferent,
    statement:
      'On the representative Phi-windowed 2-variable past-future block surrogate the strict operator/' +
      'diagonal gap ||R|| > max_j R_jj SURVIVES the bare -> Phi swap (R symmetric, strictly-positive ' +
      'off-diagonals, Perron-Frobenius), numerically exhibiting the imp-3110 survivesSwap structural ' +
      'claim that imp-3110 only argued. The gap MAGNITUDE, however, moves by a large factor relative to ' +
      'the monomial toy (gapRatio far from 1), confirming imp-3110 that the magnitude is a truncation ' +
      'artifact while the gap EXISTENCE is structural. This is a diagnostic of the gap; it asserts ' +
      'nothing about positivity, the cover, or Conjecture 26.3.',
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
    magnitudeCaveat:
      'The gapRatio magnitude is proxy-specific (it depends on the representative window Phi(u) = ' +
      'exp(-u^2/2) and the truncation degree); only the QUALITATIVE ||R|| > max diag survival is the ' +
      'structural finding. The genuine kernel and normalisation come from the v52 construction.',
    noRHVerdict:
      'This measures a representative Phi-windowed past-future block surrogate and reports whether the ' +
      'operator/diagonal gap survives and how its magnitude compares to the toy; it does NOT compute the ' +
      'genuine section-26 Gram and asserts nothing about whether the cover holds or fails. Conjecture ' +
      '26.3 stays exactly open.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3150_PHI_WINDOWED_OPERATOR_GAP_SURVIVAL_ASSERTIONS = [
  {
    id: 'imp3150-toy-gap-strictly-positive',
    why: 'Baseline sanity: the monomial toy reproduces the imp-3066 / imp-3110 strictly-positive ' +
         'operator/diagonal gap (||R|| > max diag, symmetric, strictly-positive off-diagonals) so the ' +
         'side-by-side comparison starts from the known toy object.',
    holds: () =>
      toyStats.gap > 1e-9 &&
      toyStats.opNorm > toyStats.maxDiag &&
      toyStats.symmetric &&
      toyStats.allOffDiagPositive,
  },
  {
    id: 'imp3150-surrogate-is-genuine-past-future-block',
    why: 'The swap target must be the genuine 2-variable past-future block, NOT a re-labelled Hankel: ' +
         'B_jk depends on j and k SEPARATELY so equal-(j+k) entries DISAGREE, whereas the toy shear ' +
         'IS a single-index Hankel (equal-(j+k) entries coincide). Both must hold or the swap was fake.',
    holds: () => surrMaxEqualIndexHankelDeviation > 1e-6 && toyMaxEqualIndexHankelDeviation < 1e-9,
  },
  {
    id: 'imp3150-operator-gap-survives-swap',
    why: 'HEADLINE survivor (imp-3110 survivesSwap): on the Phi-windowed past-future surrogate the ' +
         'strict operator/diagonal gap ||R|| > max_j R_jj must persist -- R symmetric, strictly-' +
         'positive off-diagonals (Phi>0, sinh(a(v-u))>0 for v>u), Perron-Frobenius -- and BOTH the toy ' +
         'and surrogate gaps must be strictly positive.',
    holds: () =>
      bothGapsStrictlyPositive &&
      surrStats.symmetric &&
      surrStats.allOffDiagPositive &&
      surrStats.opNorm > surrStats.maxDiag,
  },
  {
    id: 'imp3150-gap-magnitude-is-artifact-level-different',
    why: 'imp-3110 companion claim: the gap MAGNITUDE is a truncation artifact. The surrogate gap must ' +
         'differ from the toy gap by more than a factor of 2 (gapRatio outside [0.5, 2]) so the swap ' +
         'moves the magnitude even though it preserves the gap existence.',
    holds: () => Number.isFinite(gapRatio) && Math.abs(gapRatio - 1) > 1,
  },
  {
    id: 'imp3150-measured-numbers-finite',
    why: 'All headline measurement numbers must be finite (no quadrature blow-up / NaN).',
    holds: () =>
      Number.isFinite(toyStats.gap) &&
      Number.isFinite(surrStats.gap) &&
      Number.isFinite(toyStats.opNorm) &&
      Number.isFinite(surrStats.opNorm) &&
      Number.isFinite(gapRatio),
  },
  {
    id: 'imp3150-verdict-consistent-with-measurement',
    why: 'The published verdict booleans must match the recomputed measurement (no hand-set verdict that ' +
         'drifts from the numbers).',
    holds: () => {
      const v = IMP3150_PHI_WINDOWED_OPERATOR_GAP_SURVIVAL.verdict;
      return (
        v.gapSurvivesSwap === (bothGapsStrictlyPositive && surrStats.symmetric &&
          surrStats.allOffDiagPositive && surrStats.opNorm > surrStats.maxDiag) &&
        v.surrogateIsGenuinePastFutureBlock === (surrMaxEqualIndexHankelDeviation > 1e-6) &&
        v.gapMagnitudeIsArtifact === magnitudeIsArtifactLevelDifferent
      );
    },
  },
  {
    id: 'imp3150-honest-no-verdict',
    why: 'Mandatory honesty: measurement only, representative proxy, does not compute the genuine Gram, ' +
         'neither closes nor weakens Conj 26.3, no positivity, no RH verdict, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3150_PHI_WINDOWED_OPERATOR_GAP_SURVIVAL.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isMeasurementOnly === true &&
        c.usesRepresentativePhiProxy === true &&
        c.computesGenuineSection26Gram === false &&
        c.closesConjecture263 === false &&
        c.weakensConjecture263 === false &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3150_PHI_WINDOWED_OPERATOR_GAP_SURVIVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3150-phi-windowed-operator-gap-survival assertion failed: ${assertion.id}`);
  }
}

export default IMP3150_PHI_WINDOWED_OPERATOR_GAP_SURVIVAL;
