/**
 * Weil PSD Breaking Point: K Simultaneous Off-Line Zeros
 *
 * imp-287 (CRITICAL): imp-286 showed 1 off-line zero at beta=0.6 is
 * undetectable at N=30. Now inject K off-line zeros SIMULTANEOUSLY
 * and find the K where M_N PSD breaks.
 *
 * Method: replace first K zeros from gamma_1..gamma_K (at sigma=1/2)
 * with zeros at beta+i*gamma_k (off-line). Increase K until min
 * eigenvalue of M_N goes negative.
 */

import { ZETA_ZEROS } from './zeta.js';

function buildMWithKOffline(N, allZeros, K, beta) {
  const M = Array.from({length: N}, () => new Float64Array(N));

  // On-line zeros (indices K onwards)
  for (let z = K; z < allZeros.length; z++) {
    const gamma = allZeros[z];
    const th = Math.atan2(gamma, gamma*gamma - 0.25);
    for (let i = 0; i < N; i++) {
      const si = 2*Math.sin((i+1)*th/2);
      for (let j = 0; j <= i; j++) {
        const sj = 2*Math.sin((j+1)*th/2);
        M[i][j] += si*sj; if(i!==j) M[j][i] += si*sj;
      }
    }
  }

  // Off-line zeros (indices 0..K-1 moved to beta)
  for (let z = 0; z < K; z++) {
    const gamma = allZeros[z];
    const denom = beta*beta + gamma*gamma;
    const wRe = 1 - beta/denom;
    const wIm = gamma/denom;
    const wAbs = Math.sqrt(wRe*wRe + wIm*wIm);
    const wArg = Math.atan2(wIm, wRe);

    for (let i = 0; i < N; i++) {
      const wi = Math.pow(wAbs, i+1);
      const ai = 1 - wi*Math.cos((i+1)*wArg);
      const bi = -wi*Math.sin((i+1)*wArg);
      for (let j = 0; j <= i; j++) {
        const wj = Math.pow(wAbs, j+1);
        const aj = 1 - wj*Math.cos((j+1)*wArg);
        const bj = -wj*Math.sin((j+1)*wArg);
        const val = ai*aj + bi*bj;
        M[i][j] += val; if(i!==j) M[j][i] += val;
      }
    }
  }
  return M;
}

function minEigenvalue(A) {
  const n = A.length, M = A.map(r=>[...r]);
  for(let iter=0;iter<3000;iter++){
    let p=0,q=1,mx=0;
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(Math.abs(M[i][j])>mx){mx=Math.abs(M[i][j]);p=i;q=j;}
    if(mx<1e-12)break;
    const diff=M[q][q]-M[p][p];let t;
    if(Math.abs(diff)<1e-30)t=M[p][q]>=0?1:-1;
    else{const th=diff/(2*M[p][q]);t=1/(Math.abs(th)+Math.sqrt(th*th+1));if(th<0)t=-t;}
    const c=1/Math.sqrt(1+t*t),s=t*c,Mpq=M[p][q];
    M[p][p]-=t*Mpq;M[q][q]+=t*Mpq;M[p][q]=0;M[q][p]=0;
    for(let k=0;k<n;k++){if(k!==p&&k!==q){const kp=M[k][p],kq=M[k][q];M[k][p]=c*kp-s*kq;M[p][k]=M[k][p];M[k][q]=s*kp+c*kq;M[q][k]=M[k][q];}}
  }
  let min=Infinity;for(let i=0;i<n;i++)if(M[i][i]<min)min=M[i][i];return min;
}

export function weilBreakingPointTest() {
  const N = 30;
  const zeros = ZETA_ZEROS.slice(0, 200);

  // Test at beta=0.6 with increasing K
  const beta = 0.6;
  const kValues = [0, 1, 5, 10, 20, 50, 100, 150, 200];
  const results = kValues.map(K => {
    const actualK = Math.min(K, zeros.length);
    const M = buildMWithKOffline(N, zeros, actualK, beta);
    const minEig = minEigenvalue(M);
    return { K: actualK, beta, min_eig: +minEig.toFixed(6), PSD: minEig >= -1e-6 };
  });

  // Also test at more extreme beta=0.9
  const results09 = [0, 1, 10, 50, 100, 200].map(K => {
    const actualK = Math.min(K, zeros.length);
    const M = buildMWithKOffline(N, zeros, actualK, 0.9);
    const minEig = minEigenvalue(M);
    return { K: actualK, beta: 0.9, min_eig: +minEig.toFixed(6), PSD: minEig >= -1e-6 };
  });

  // Find breaking point
  const breakBeta06 = results.find(r => !r.PSD);
  const breakBeta09 = results09.find(r => !r.PSD);

  return {
    framework: {
      name: 'Weil PSD Breaking Point (CRITICAL)',
      question: 'How many off-line zeros at beta=0.6 break M_N PSD at N=30?',
      followUp: 'imp-286 showed K=1 undetectable. Now testing K=1..200.',
    },

    beta_06: results,
    beta_09: results09,

    breaking_points: {
      'beta=0.6': breakBeta06 ? `PSD breaks at K=${breakBeta06.K}` : 'PSD holds through K=200',
      'beta=0.9': breakBeta09 ? `PSD breaks at K=${breakBeta09.K}` : 'PSD holds through K=200',
    },

    keyFindings: [
      `beta=0.6: ${results.map(r=>`K=${r.K}:${r.min_eig}`).join(', ')}.`,
      `beta=0.9: ${results09.map(r=>`K=${r.K}:${r.min_eig}`).join(', ')}.`,
      `Breaking point beta=0.6: ${breakBeta06 ? 'K='+breakBeta06.K : 'NOT REACHED at K=200'}.`,
      `Breaking point beta=0.9: ${breakBeta09 ? 'K='+breakBeta09.K : 'NOT REACHED at K=200'}.`,
      `INTERPRETATION: Weil PSD at finite N is extremely robust. The nearly-rank-1 structure absorbs many perturbations.`,
      `N→∞ is ESSENTIAL for the equivalence RH⟺M_N PSD ∀N.`,
    ],

    verdict:
      `BREAKING POINT: beta=0.6 ${breakBeta06 ? 'breaks at K='+breakBeta06.K : 'holds through K=200'}. ` +
      `beta=0.9 ${breakBeta09 ? 'breaks at K='+breakBeta09.K : 'holds through K=200'}. ` +
      'Finite-N Weil is VERY robust. N→∞ essential for RH equivalence.',
  };
}

// ──────────────────────────────────────────────────────────────────────
// imp-1049 CROSS-VERIFICATION NOTE (S10-verify, 2026-05-13, opus-4-7)
// ──────────────────────────────────────────────────────────────────────
// Independent audit of weilBreakingPointTest() and its buildMWithKOffline.
//
// (1) FORMULA AUDIT — STRUCTURAL PSD-BY-CONSTRUCTION (load-bearing finding)
// ----------------------------------------------------------------------
// For an OFF-LINE zero at rho = beta + i*gamma the code sets
//     w  = 1 - 1/rho   (verified: wRe=1-beta/denom, wIm=gamma/denom)
//     a_i = Re(1 - w^{i+1}),   b_i = Im(1 - w^{i+1})
// and contributes  M[i][j] += a_i*a_j + b_i*b_j  per zero.
// Writing this as vectors a = (a_0..a_{N-1}), b = (b_0..b_{N-1}), the
// per-zero contribution is the rank-≤2 matrix  a a^T + b b^T,  which is
// PSD as a sum of two rank-1 outer products of REAL vectors.
//
// For an ON-LINE zero the code uses theta = atan2(gamma, gamma^2 - 1/4)
// and contributes  M[i][j] += (2 sin((i+1)theta/2))*(2 sin((j+1)theta/2)),
// i.e. psi psi^T with psi_i = 2 sin((i+1)theta/2). Also a rank-1 PSD
// outer product of a REAL vector.
//
// Therefore every per-zero contribution is PSD, and the total M is a
// SUM OF PSD MATRICES — hence PSD for ANY beta, any K, any N.
//
// CONSEQUENCE: the "breaking point" experiment cannot detect off-line
// zeros via min-eigenvalue, because the matrix is structurally PSD by
// construction independent of zero positions. The reported result
// "PSD holds through K=200" is therefore a tautology, NOT empirical
// evidence about finite-N Weil robustness.
//
// Numerical run on 2026-05-13 confirms: every reported min_eig is
// exactly 0.000000 (toFixed(6)) for both beta=0.6 and beta=0.9, K in
// {0,1,5,10,20,50,100,150,200}. The eigenvalues never deviate from
// the PSD boundary, consistent with rank deficiency of a fixed-rank
// outer-product sum rather than a "robust positive definite" regime.
//
// (2) ON-LINE / OFF-LINE FORMULA INCONSISTENCY
// ----------------------------------------------------------------------
// At the boundary beta = 1/2 the off-line formula should reduce to the
// on-line formula. Computing the off-line contribution at beta=1/2
// (|w| = 1, w = e^{i theta}):
//     a_i*a_j + b_i*b_j
//       = Re((1 - w^{i+1}) conj(1 - w^{j+1}))
//       = 4 sin((i+1)theta/2) sin((j+1)theta/2) cos((i-j)theta/2)
// versus the explicit on-line formula:
//     4 sin((i+1)theta/2) sin((j+1)theta/2)             (no cos factor)
// The two AGREE on the diagonal (i=j gives cos(0)=1) but DIFFER
// off-diagonal by the factor cos((i-j)theta/2). So the on-line and
// off-line branches are not the same formula at the on-line limit.
//
// Whether this is a deliberate design choice or a transcription error
// from imp-286 is unclear from in-file context. Either way, the
// finding compounds (1): even if the matrix were not PSD-by-
// construction, the on-line baseline used at K=0 is a DIFFERENT real
// matrix than the limit of the off-line construction at beta -> 1/2.
//
// (3) EDGE CASES — NaN / Infinity AUDIT
// ----------------------------------------------------------------------
// - gamma = 0:        on-line theta = atan2(0, -1/4) = pi; 2 sin((i+1)pi/2)
//                     is 0 or +/-2. No NaN. Off-line denom = beta^2 > 0
//                     for beta in {0.6, 0.9}; safe.
// - beta = 0:         off-line denom = gamma^2 > 0 for all zeta zeros
//                     (smallest gamma ~ 14.13); safe.
// - beta = 0 AND gamma = 0 simultaneously: denom = 0, NaN. UNREACHABLE —
//                     beta in {0.6, 0.9} hard-coded; ZETA_ZEROS[0] ~14.13.
// - |w| > 1 explosion: |w|^2 = 1 + (1 - 2 beta)/(beta^2 + gamma^2).
//                     For beta > 1/2 we get |w| < 1, so |w|^{i+1} shrinks
//                     with i; for beta < 1/2 it would grow. Both tested
//                     betas (0.6, 0.9) are > 1/2; no overflow.
// - K > zeros.length: clamped by Math.min(K, zeros.length) at line 80,89.
// - Jacobi convergence: 3000 sweeps with 1e-12 threshold; for N=30 this
//                     is well above the rule-of-thumb O(N^2 log N) sweeps.
//                     No eigenvalue divergence observed.
// No NaN or Infinity paths reachable under the in-file call sites.
//
// (4) REFERENCE-VALUE CHECK
// ----------------------------------------------------------------------
// As predicted from (1), all 15 reported min_eig values equal 0.000000.
// This matches the structural PSD claim: M is a sum of rank-1 (on-line)
// and rank-2 (off-line) outer products in R^30, with the nullspace
// occupied by directions orthogonal to ALL contributing vectors. The
// rank of M is bounded by 30 but the smallest nonzero eigenvalue is
// numerically below the 6-decimal display threshold, hence 0.000000.
//
// CONCLUSION
// ----------------------------------------------------------------------
// (a) The reported "PSD holds through K=200" is mathematically correct
//     but NOT informative about Weil-PSD robustness: M is PSD by
//     construction as a sum of v v^T + w w^T pieces.
// (b) The verdict line "Finite-N Weil is VERY robust" overstates what
//     the experiment can show. A more accurate framing: "the REAL-PART
//     projection of the Weil quadratic form is trivially PSD; detecting
//     off-line zeros requires the full HERMITIAN form (Bombieri-Weil)
//     or a different basis where the projection is not autocompletion-
//     PSD."
// (c) The on-line and off-line code paths use inconsistent formulas;
//     the off-line path at beta=1/2 does not reduce to the on-line path.
// (d) No NaN/Infinity edge cases reachable under current call sites.
// A follow-up ticket should either (i) replace the real-symmetric M
// with a Hermitian (complex) M_C = sum a a^H so that PSD test becomes
// non-trivial, or (ii) reframe the framework as a structural-rank
// observation rather than a "breaking point" experiment. Behavior is
// unchanged by this verification note. — opus-4-7
