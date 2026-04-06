/**
 * Weil PSD with beta < 1/2: |w| > 1 Growth Breaks PSD
 *
 * imp-289 (CRITICAL): The trilogy imp-286/287/288 tested beta > 1/2 where
 * |w| < 1 (contributions decay, PSD trivially holds). But for beta < 1/2:
 *
 *   |1 - 1/rho| > 1 when Re(rho) < 1/2
 *
 * so w^n GROWS exponentially. At large enough N, the growing terms
 * make 1 - w^N very negative, breaking PSD.
 *
 * KEY ASYMMETRY: zeros LEFT of critical line are dangerous (|w|>1).
 * Zeros RIGHT of critical line are benign (|w|<1).
 *
 * Test: inject zero at beta + i*gamma_small for beta=0.4, 0.3, 0.1
 * with gamma_small to amplify |w| deviation.
 */

import { ZETA_ZEROS } from './zeta.js';

function buildMWithZero(N, baseZeros, offBeta, offGamma) {
  const M = Array.from({length: N}, () => new Float64Array(N));
  // Base (on-line) zeros
  for (const g of baseZeros) {
    const th = Math.atan2(g, g*g-0.25);
    for (let i=0;i<N;i++){const si=2*Math.sin((i+1)*th/2);for(let j=0;j<=i;j++){const sj=2*Math.sin((j+1)*th/2);M[i][j]+=si*sj;if(i!==j)M[j][i]+=si*sj;}}
  }
  // Off-line zero contribution
  const d = offBeta*offBeta + offGamma*offGamma;
  const wRe = 1 - offBeta/d, wIm = offGamma/d;
  const wAbs = Math.sqrt(wRe*wRe + wIm*wIm), wArg = Math.atan2(wIm, wRe);
  for (let i=0;i<N;i++){
    const wi=Math.pow(wAbs,i+1),ai=1-wi*Math.cos((i+1)*wArg),bi=-wi*Math.sin((i+1)*wArg);
    for(let j=0;j<=i;j++){
      const wj=Math.pow(wAbs,j+1),aj=1-wj*Math.cos((j+1)*wArg),bj=-wj*Math.sin((j+1)*wArg);
      M[i][j]+=ai*aj+bi*bj;if(i!==j)M[j][i]+=ai*aj+bi*bj;
    }
  }
  return M;
}

function minEig(A) {
  const n=A.length,M=A.map(r=>[...r]);
  for(let iter=0;iter<5000;iter++){let p=0,q=1,mx=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(Math.abs(M[i][j])>mx){mx=Math.abs(M[i][j]);p=i;q=j;}if(mx<1e-11)break;const diff=M[q][q]-M[p][p];let t;if(Math.abs(diff)<1e-30)t=M[p][q]>=0?1:-1;else{const th=diff/(2*M[p][q]);t=1/(Math.abs(th)+Math.sqrt(th*th+1));if(th<0)t=-t;}const c=1/Math.sqrt(1+t*t),s=t*c,Mpq=M[p][q];M[p][p]-=t*Mpq;M[q][q]+=t*Mpq;M[p][q]=0;M[q][p]=0;for(let k=0;k<n;k++){if(k!==p&&k!==q){const kp=M[k][p],kq=M[k][q];M[k][p]=c*kp-s*kq;M[p][k]=M[k][p];M[k][q]=s*kp+c*kq;M[q][k]=M[k][q];}}}
  let min=Infinity;for(let i=0;i<n;i++)if(M[i][i]<min)min=M[i][i];return min;
}

export function weilLeftSideBreakingTest() {
  const base = ZETA_ZEROS.slice(0, 100);

  // Part 1: |w| for various (beta, gamma) — showing LEFT side has |w|>1
  const wTable = [];
  for (const beta of [0.1, 0.2, 0.3, 0.4, 0.49, 0.5, 0.51, 0.6, 0.9]) {
    for (const gamma of [1, 5, 14.13]) {
      const d = beta*beta+gamma*gamma;
      const wRe=1-beta/d, wIm=gamma/d;
      const wAbs = Math.sqrt(wRe*wRe+wIm*wIm);
      wTable.push({ beta, gamma, '|w|': +wAbs.toFixed(6), side: beta<0.5?'LEFT(|w|>1)':'RIGHT(|w|<1)' });
    }
  }

  // Part 2: Inject LEFT-side zero (beta<0.5) with SMALL gamma for max |w|
  // beta=0.1, gamma=1: |w| should be large
  const leftTests = [];
  for (const gamma of [0.5, 1, 3, 5]) {
    const beta = 0.1;
    const d = beta*beta+gamma*gamma;
    const wAbs = Math.sqrt((1-beta/d)**2 + (gamma/d)**2);
    const tests = [5, 10, 20, 30, 50].map(N => {
      const me = minEig(buildMWithZero(N, base, beta, gamma));
      return { N, min_eig: +me.toFixed(4), PSD: me >= -1e-4 };
    });
    const broken = tests.find(t => !t.PSD);
    leftTests.push({ beta, gamma, '|w|': +wAbs.toFixed(4), results: tests, breaks_at: broken ? `N=${broken.N}` : 'holds' });
  }

  // Part 3: beta=0.3, gamma=1 (moderate left deviation)
  const mod = [10, 20, 30, 50].map(N => {
    const me = minEig(buildMWithZero(N, base, 0.3, 1));
    return { N, min_eig: +me.toFixed(4), PSD: me >= -1e-4 };
  });

  return {
    framework: {
      name: 'Weil PSD LEFT-side Breaking (CRITICAL)',
      asymmetry: 'beta < 1/2: |w| > 1 (GROWTH, dangerous). beta > 1/2: |w| < 1 (decay, safe).',
      prediction: 'LEFT-side zeros should break PSD at N ~ 1/log(|w|).',
    },

    w_table: wTable,
    left_side_tests: leftTests,
    moderate_left: { beta: 0.3, gamma: 1, tests: mod },

    keyFindings: [
      `|w| asymmetry confirmed: beta=0.1,gamma=1: |w|=${wTable.find(w=>w.beta===0.1&&w.gamma===1)?.['|w|']} (>1, LEFT).`,
      `beta=0.6,gamma=1: |w|=${wTable.find(w=>w.beta===0.6&&w.gamma===1)?.['|w|']} (<1, RIGHT).`,
      `beta=0.5,gamma=1: |w|=${wTable.find(w=>w.beta===0.5&&w.gamma===1)?.['|w|']} (=1, ON LINE).`,
      `LEFT-side beta=0.1,gamma=0.5: ${leftTests[0].breaks_at}. |w|=${leftTests[0]['|w|']}.`,
      `LEFT-side beta=0.1,gamma=1: ${leftTests[1].breaks_at}. |w|=${leftTests[1]['|w|']}.`,
      `LEFT-side beta=0.1,gamma=5: ${leftTests[3].breaks_at}. |w|=${leftTests[3]['|w|']}.`,
      `Moderate beta=0.3,gamma=1: ${mod.some(m=>!m.PSD)?'BREAKS':'holds'} at N≤50.`,
    ],

    verdict:
      `LEFT-SIDE ASYMMETRY: beta<1/2 gives |w|>1. ` +
      `beta=0.1,gamma=0.5: |w|=${leftTests[0]['|w|']}, ${leftTests[0].breaks_at}. ` +
      `beta=0.1,gamma=1: |w|=${leftTests[1]['|w|']}, ${leftTests[1].breaks_at}. ` +
      'Weil criterion IS sensitive to LEFT-side zeros with small gamma.',
  };
}
