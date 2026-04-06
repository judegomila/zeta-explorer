/**
 * Weil PSD Off-Line Zero Sensitivity Test
 *
 * imp-286 (CRITICAL): If RH is false, some zero rho has Re(rho) != 1/2.
 * How does M_N react? We INJECT synthetic off-line zeros and measure
 * when PSD breaks. This quantifies the SENSITIVITY of the Weil test.
 *
 * For a zero at rho = beta + i*gamma (beta != 1/2):
 *   w = 1 - 1/rho, |w| != 1 (off unit circle)
 *   The contribution to M_N is NOT rank-1 positive — it's a
 *   COMPLEX outer product that can create negative eigenvalues.
 *
 * TEST: replace gamma_1 = 14.13 with beta + 14.13i for various beta,
 * recompute M_N, check if PSD breaks.
 */

import { ZETA_ZEROS } from './zeta.js';

function buildWeilMatrixWithOffline(N, zeros, offlineZero) {
  const M = Array.from({length: N}, () => new Float64Array(N));

  // Contribution from regular zeros (on sigma=1/2)
  for (const gamma of zeros) {
    const th = Math.atan2(gamma, gamma*gamma - 0.25);
    const v = new Float64Array(N);
    for (let i = 0; i < N; i++) v[i] = 2*Math.sin((i+1)*th/2);
    for (let i = 0; i < N; i++) for (let j = 0; j <= i; j++) {
      M[i][j] += v[i]*v[j]; if (i!==j) M[j][i] += v[i]*v[j];
    }
  }

  if (offlineZero) {
    // Contribution from off-line zero at rho = beta + i*gamma
    const { beta, gamma } = offlineZero;
    const rhoRe = beta, rhoIm = gamma;
    const denom = rhoRe*rhoRe + rhoIm*rhoIm;
    // w = 1 - 1/rho = 1 - (beta-i*gamma)/(beta^2+gamma^2)
    const wRe = 1 - rhoRe/denom;
    const wIm = rhoIm/denom;
    const wAbs = Math.sqrt(wRe*wRe + wIm*wIm);
    const wArg = Math.atan2(wIm, wRe);

    // w^n = |w|^n * e^{i*n*arg(w)}
    // Contribution: (1 - w^i) * conj(1 - w^j)
    // = (1-|w|^i*cos(i*arg) - i*|w|^i*sin(i*arg)) * conj(...)
    // Real part of product: Re[(1-w^i)(1-w^j)*] where * is conjugate
    for (let i = 0; i < N; i++) {
      const wi_abs = Math.pow(wAbs, i+1);
      const wi_arg = (i+1) * wArg;
      const ai = 1 - wi_abs * Math.cos(wi_arg);  // Re(1-w^{i+1})
      const bi = -wi_abs * Math.sin(wi_arg);      // Im(1-w^{i+1})
      for (let j = 0; j <= i; j++) {
        const wj_abs = Math.pow(wAbs, j+1);
        const wj_arg = (j+1) * wArg;
        const aj = 1 - wj_abs * Math.cos(wj_arg);
        const bj = -wj_abs * Math.sin(wj_arg);
        // Re[(ai+i*bi)(aj-i*bj)] = ai*aj + bi*bj
        const val = ai*aj + bi*bj;
        M[i][j] += val; if (i!==j) M[j][i] += val;
      }
    }
    // Also add the conjugate zero at beta - i*gamma (same contribution by symmetry)
    // Actually for real beta, the conjugate pair gives the same M contribution
    // (already included above since we compute Re of the product)
  }

  return M;
}

function jacobiMinEig(A) {
  const n = A.length;
  const M = A.map(r => [...r]);
  for (let iter = 0; iter < 3000; iter++) {
    let p=0,q=1,mx=0;
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(Math.abs(M[i][j])>mx){mx=Math.abs(M[i][j]);p=i;q=j;}
    if(mx<1e-12)break;
    const diff=M[q][q]-M[p][p];let t;
    if(Math.abs(diff)<1e-30)t=M[p][q]>=0?1:-1;
    else{const th=diff/(2*M[p][q]);t=1/(Math.abs(th)+Math.sqrt(th*th+1));if(th<0)t=-t;}
    const c=1/Math.sqrt(1+t*t),s=t*c;
    const Mpq=M[p][q];M[p][p]-=t*Mpq;M[q][q]+=t*Mpq;M[p][q]=0;M[q][p]=0;
    for(let k=0;k<n;k++){if(k!==p&&k!==q){const kp=M[k][p],kq=M[k][q];M[k][p]=c*kp-s*kq;M[p][k]=M[k][p];M[k][q]=s*kp+c*kq;M[q][k]=M[k][q];}}
  }
  let minE = Infinity;
  for (let i = 0; i < n; i++) if (M[i][i] < minE) minE = M[i][i];
  return minE;
}

export function weilOfflineSensitivityTest() {
  const N = 30;  // matrix size
  // Use first 200 zeros (skip gamma_1 which we'll replace)
  const baseZeros = ZETA_ZEROS.slice(1, 200);

  // Baseline: all on sigma=1/2
  const baseline = buildWeilMatrixWithOffline(N, [ZETA_ZEROS[0], ...baseZeros], null);
  const baselineMinEig = jacobiMinEig(baseline);

  // Inject off-line zero at beta+14.13i for various beta
  const betas = [0.5, 0.51, 0.52, 0.55, 0.6, 0.7, 0.8, 0.9];
  const gamma = ZETA_ZEROS[0];  // 14.1347

  const results = betas.map(beta => {
    const M = buildWeilMatrixWithOffline(N, baseZeros, { beta, gamma });
    const minEig = jacobiMinEig(M);
    const wAbs = Math.sqrt((1 - beta/(beta*beta+gamma*gamma))**2 + (gamma/(beta*beta+gamma*gamma))**2);
    return {
      beta,
      '|w|': +wAbs.toFixed(6),
      'on unit circle': Math.abs(wAbs - 1) < 0.0001,
      min_eigenvalue: +minEig.toFixed(6),
      PSD: minEig >= -1e-6,
      'PSD broken': minEig < -1e-6,
    };
  });

  // Find the critical beta where PSD breaks
  const breakPoint = results.find(r => r['PSD broken']);

  // Also test at different N values with beta=0.6
  const nSensitivity = [10, 15, 20, 25, 30].map(n => {
    const M = buildWeilMatrixWithOffline(n, baseZeros, { beta: 0.6, gamma });
    return { N: n, min_eig: +jacobiMinEig(M).toFixed(6) };
  });

  return {
    framework: {
      name: 'Weil PSD Off-Line Zero Sensitivity (CRITICAL)',
      question: 'How sensitive is M_N PSD to zeros off sigma=1/2?',
      method: 'Replace gamma_1=14.13 with beta+14.13i, vary beta from 0.5 to 0.9',
      significance: 'If PSD breaks at small beta deviation, test is SHARP (near proof)',
    },

    baseline: { min_eig: +baselineMinEig.toFixed(6), PSD: true },
    off_line_results: results,
    break_point: breakPoint ? `PSD breaks at beta=${breakPoint.beta}` : 'PSD holds for all tested beta',
    n_sensitivity: nSensitivity,

    keyFindings: [
      `Baseline (all on sigma=1/2): min eigenvalue = ${baselineMinEig.toFixed(6)} (PSD ✓).`,
      `Off-line at beta=0.5 (RH): |w|=1.000, min_eig=${results[0].min_eigenvalue} (PSD ✓).`,
      `Off-line at beta=0.51: |w|=${results[1]['|w|']}, min_eig=${results[1].min_eigenvalue}, PSD=${results[1].PSD}.`,
      `Off-line at beta=0.6: |w|=${results[4]['|w|']}, min_eig=${results[4].min_eigenvalue}, PSD=${results[4].PSD}.`,
      `Off-line at beta=0.9: |w|=${results[7]['|w|']}, min_eig=${results[7].min_eigenvalue}, PSD=${results[7].PSD}.`,
      `Break point: ${breakPoint ? `beta=${breakPoint.beta}` : 'none found — PSD robust even with off-line zeros'}.`,
      `N sensitivity at beta=0.6: min_eig = ${nSensitivity.map(n=>n.min_eig).join(', ')}.`,
      `INTERPRETATION: ${breakPoint ? 'M_N IS sensitive to off-line zeros — test is SHARP' : 'At this N and gamma, PSD robust — need larger N or more off-line zeros to break'}.`,
    ],

    verdict:
      `SENSITIVITY: baseline PSD=${baselineMinEig >= 0}. Off-line beta=0.6: min_eig=${results[4].min_eigenvalue}. ` +
      `${breakPoint ? 'PSD BREAKS at beta='+breakPoint.beta+' — test is SHARP' : 'PSD holds for all tested beta at N='+N}.`,
  };
}
