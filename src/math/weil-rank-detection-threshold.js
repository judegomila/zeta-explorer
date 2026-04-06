/**
 * M_N Effective Rank Growth and Detection Threshold vs N
 *
 * imp-288 (CRITICAL): At what N does M_N become sensitive to off-line zeros?
 *
 * imp-276: effective rank 1(N=3) → 4(N=100)
 * imp-287: N=30 can't detect even 200 off-line zeros at beta=0.9
 *
 * The question: as N grows, does the effective rank eventually make M_N
 * sensitive to off-line zeros? If so, at what N?
 *
 * Strategy: for N=10,20,50,100,200, inject ALL zeros at beta=0.9 and
 * check min eigenvalue. When it goes negative, we've found the threshold.
 */

import { ZETA_ZEROS } from './zeta.js';

function buildAllOffline(N, zeros, beta) {
  const M = Array.from({length: N}, () => new Float64Array(N));
  for (const gamma of zeros) {
    const denom = beta*beta + gamma*gamma;
    const wRe = 1 - beta/denom, wIm = gamma/denom;
    const wAbs = Math.sqrt(wRe*wRe + wIm*wIm), wArg = Math.atan2(wIm, wRe);
    for (let i = 0; i < N; i++) {
      const wi = Math.pow(wAbs, i+1), ai = 1-wi*Math.cos((i+1)*wArg), bi = -wi*Math.sin((i+1)*wArg);
      for (let j = 0; j <= i; j++) {
        const wj = Math.pow(wAbs, j+1), aj = 1-wj*Math.cos((j+1)*wArg), bj = -wj*Math.sin((j+1)*wArg);
        const val = ai*aj + bi*bj;
        M[i][j] += val; if(i!==j) M[j][i] += val;
      }
    }
  }
  return M;
}

function buildOnline(N, zeros) {
  const M = Array.from({length: N}, () => new Float64Array(N));
  for (const gamma of zeros) {
    const th = Math.atan2(gamma, gamma*gamma-0.25);
    for (let i = 0; i < N; i++) {
      const si = 2*Math.sin((i+1)*th/2);
      for (let j = 0; j <= i; j++) {
        const sj = 2*Math.sin((j+1)*th/2);
        M[i][j] += si*sj; if(i!==j) M[j][i] += si*sj;
      }
    }
  }
  return M;
}

function eigenvalueStats(A) {
  const n = A.length, M = A.map(r=>[...r]);
  for(let iter=0;iter<5000;iter++){
    let p=0,q=1,mx=0;
    for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(Math.abs(M[i][j])>mx){mx=Math.abs(M[i][j]);p=i;q=j;}
    if(mx<1e-11)break;
    const diff=M[q][q]-M[p][p];let t;
    if(Math.abs(diff)<1e-30)t=M[p][q]>=0?1:-1;
    else{const th=diff/(2*M[p][q]);t=1/(Math.abs(th)+Math.sqrt(th*th+1));if(th<0)t=-t;}
    const c=1/Math.sqrt(1+t*t),s=t*c,Mpq=M[p][q];
    M[p][p]-=t*Mpq;M[q][q]+=t*Mpq;M[p][q]=0;M[q][p]=0;
    for(let k=0;k<n;k++){if(k!==p&&k!==q){const kp=M[k][p],kq=M[k][q];M[k][p]=c*kp-s*kq;M[p][k]=M[k][p];M[k][q]=s*kp+c*kq;M[q][k]=M[k][q];}}
  }
  const eigs = Array.from({length:n},(_,i)=>M[i][i]).sort((a,b)=>a-b);
  const rank = eigs.filter(e => Math.abs(e) > 1e-6).length;
  return { min: eigs[0], max: eigs[n-1], rank };
}

export function weilRankDetectionThresholdTest() {
  const zeros = ZETA_ZEROS.slice(0, 200);

  // Part 1: Effective rank growth (on-line, RH)
  const N_values = [5, 10, 20, 30, 50, 75, 100];
  const rankGrowth = N_values.map(N => {
    const M = buildOnline(N, zeros);
    const { min, max, rank } = eigenvalueStats(M);
    return { N, rank, min_eig: +min.toFixed(4), max_eig: +max.toFixed(2), 'rank/N': +(rank/N).toFixed(3) };
  });

  // Part 2: ALL zeros at beta=0.9 — does M_N eventually detect?
  const allOffline09 = N_values.map(N => {
    const M = buildAllOffline(N, zeros, 0.9);
    const { min, max, rank } = eigenvalueStats(M);
    return { N, beta: 0.9, rank, min_eig: +min.toFixed(4), PSD: min >= -1e-6 };
  });

  // Part 3: ALL zeros at beta=0.99 (very close to 1)
  const allOffline099 = N_values.map(N => {
    const M = buildAllOffline(N, zeros, 0.99);
    const { min, max, rank } = eigenvalueStats(M);
    return { N, beta: 0.99, rank, min_eig: +min.toFixed(4), PSD: min >= -1e-6 };
  });

  // Part 4: Single zero at beta=0.9 with SMALL gamma (gamma=1, not 14)
  // Small gamma means |w| deviates MORE from 1
  const smallGammaTest = N_values.filter(N => N <= 50).map(N => {
    const M = buildOnline(N, zeros.slice(1));
    // Add single off-line zero at 0.9 + 1i (small gamma!)
    const beta = 0.9, gamma = 1;
    const denom = beta*beta + gamma*gamma;
    const wRe = 1-beta/denom, wIm = gamma/denom;
    const wAbs = Math.sqrt(wRe*wRe+wIm*wIm);
    // w = 1 - 0.9/1.81 + i*1/1.81 = 1 - 0.497 + 0.552i = 0.503 + 0.552i
    // |w| = sqrt(0.253 + 0.305) = sqrt(0.558) = 0.747
    for (let i = 0; i < N; i++) {
      const wi = Math.pow(wAbs, i+1), wArg = Math.atan2(wIm, wRe);
      const ai = 1-wi*Math.cos((i+1)*wArg), bi = -wi*Math.sin((i+1)*wArg);
      for (let j = 0; j <= i; j++) {
        const wj = Math.pow(wAbs, j+1);
        const aj = 1-wj*Math.cos((j+1)*wArg), bj = -wj*Math.sin((j+1)*wArg);
        M[i][j] += ai*aj+bi*bj; if(i!==j) M[j][i] += ai*aj+bi*bj;
      }
    }
    const { min, rank } = eigenvalueStats(M);
    return { N, 'beta=0.9, gamma=1': true, '|w|': +wAbs.toFixed(4), min_eig: +min.toFixed(4), PSD: min >= -1e-6 };
  });

  return {
    framework: {
      name: 'M_N Rank Growth and Detection Threshold (CRITICAL)',
      question: 'At what N does M_N become sensitive to off-line zeros?',
      insight: 'Sensitivity requires effective rank >> 1. Low rank = trivially PSD.',
    },

    rank_growth_online: rankGrowth,
    all_offline_beta_09: allOffline09,
    all_offline_beta_099: allOffline099,
    small_gamma_test: smallGammaTest,

    keyFindings: [
      `On-line rank growth: ${rankGrowth.map(r=>`N=${r.N}:${r.rank}`).join(', ')}.`,
      `ALL off-line beta=0.9: ${allOffline09.map(r=>`N=${r.N}:${r.PSD?'PSD':'BROKEN'}`).join(', ')}.`,
      `ALL off-line beta=0.99: ${allOffline099.map(r=>`N=${r.N}:${r.PSD?'PSD':'BROKEN'}`).join(', ')}.`,
      `Small gamma=1, beta=0.9 (|w|=${smallGammaTest[0]?.['|w|']}): ${smallGammaTest.map(r=>`N=${r.N}:${r.PSD?'PSD':'BROKEN'}`).join(', ')}.`,
      `With small gamma, |w| deviates MORE from 1 → detection easier.`,
    ],

    verdict:
      `RANK GROWTH: ${rankGrowth.map(r=>r.rank).join('→')}. ` +
      `Small-gamma zero (|w|=${smallGammaTest[0]?.['|w|']}): ${smallGammaTest.some(r=>!r.PSD) ? 'BREAKS PSD' : 'still PSD'}.`,
  };
}
