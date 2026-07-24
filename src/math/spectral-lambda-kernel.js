/**
 * Spectral Lambda Kernel: finite GUE / spacing diagnostics
 *
 * HONEST STATUS: every GUE spacing input in this module is heuristic, and the
 * cascade Hamiltonian is a numerical surrogate with no proved spectral
 * correspondence to zeta zeros. The two-body value s_min^2 / 4 is a collision
 * proxy, not a rigorous upper bound for the de Bruijn-Newman constant.
 *
 * The module is useful for exploring scales and falsifying numerical models.
 * It cannot replace a uniform all-zero spacing theorem, the many-body Dyson
 * dynamics, or the exact Polymath15 hypotheses.
 *
 * HEURISTIC MODEL:
 *   - The GUE level repulsion gives P(spacing < s) ~ s^2 for small s
 *   - For N zeros up to height T: min spacing ~ 1/(N·density) ~ 1/N·(2π/log T)
 *   - Under backward heat flow: spacing shrinks at rate ~1/s
 *   - Collision time: t_c ~ -s_min^2 / 4 (from ds/dt = +2/s → s^2 = s_0^2 + 4t → t_c = -s_0^2/4)
 * None of these bullets supplies the uniform inequalities needed for Λ.
 */

import { ZETA_ZEROS } from './zeta.js';

// ── Spectral gap from cascade Hamiltonian ──────────────────────────────

function sievePrimes(N) {
  const s = new Uint8Array(N+1); const P = [];
  for(let n=2;n<=N;n++){if(!s[n]){P.push(n);for(let k=2*n;k<=N;k+=n)s[k]=1;}} return P;
}

function buildCascadeHamiltonian(K) {
  const primes = sievePrimes(K * 10).slice(0, K);
  const N = primes.length;
  const H = Array.from({length: N}, () => new Float64Array(N));
  for (let k = 0; k < N; k++) {
    H[k][k] = Math.log(primes[k]) * Math.log(primes[k]);  // ω_k² = log²(p_k)
    if (k < N-1) {
      const coupling = -1 / Math.sqrt(Math.log(primes[k]) * Math.log(primes[k+1]));
      H[k][k+1] = coupling;
      H[k+1][k] = coupling;
    }
  }
  return { H, primes };
}

function tridiagonalEigenvalues(H) {
  const N = H.length;
  const diag = new Float64Array(N);
  const offdiag = new Float64Array(N-1);
  for (let i = 0; i < N; i++) diag[i] = H[i][i];
  for (let i = 0; i < N-1; i++) offdiag[i] = H[i][i+1];

  // QR iteration for tridiagonal
  const M = Array.from({length: N}, () => new Float64Array(N));
  for (let i = 0; i < N; i++) { M[i][i] = diag[i]; if(i<N-1){M[i][i+1]=offdiag[i];M[i+1][i]=offdiag[i];} }

  for (let iter = 0; iter < 3000; iter++) {
    let p=0,q=1,mx=0;
    for(let i=0;i<N;i++)for(let j=i+1;j<N;j++)if(Math.abs(M[i][j])>mx){mx=Math.abs(M[i][j]);p=i;q=j;}
    if(mx<1e-12)break;
    const diff=M[q][q]-M[p][p];let t;
    if(Math.abs(diff)<1e-30)t=M[p][q]>=0?1:-1;
    else{const th=diff/(2*M[p][q]);t=1/(Math.abs(th)+Math.sqrt(th*th+1));if(th<0)t=-t;}
    const c=1/Math.sqrt(1+t*t),s=t*c,Mpq=M[p][q];
    M[p][p]-=t*Mpq;M[q][q]+=t*Mpq;M[p][q]=0;M[q][p]=0;
    for(let k=0;k<N;k++){if(k!==p&&k!==q){const kp=M[k][p],kq=M[k][q];M[k][p]=c*kp-s*kq;M[p][k]=M[k][p];M[k][q]=s*kp+c*kq;M[q][k]=M[k][q];}}
  }
  return Array.from({length:N},(_,i)=>M[i][i]).sort((a,b)=>a-b);
}

// ── Heuristic min-spacing scale from GUE statistics ───────────────────

// For N zeros in [0, T]: mean spacing δ = 2π/log(T/(2π))
// GUE prediction: P(normalized spacing < s) ≈ (π²/6)·s³ for small s
// Expected min normalized spacing among N pairs: s_min ~ N^{-1/3}
// (from: P(all spacings > s) = (1 - cs³)^N ≈ exp(-cNs³) → critical s ~ N^{-1/3})

function expectedMinNormalizedSpacing(N) {
  return Math.pow(N, -1/3) * 1.5;  // GUE scaling with empirical constant
}

function meanSpacingAtHeight(T) {
  return 2 * Math.PI / Math.log(T / (2 * Math.PI));
}

// ── Two-body collision proxy (not a Lambda bound) ─────────────────────

// Under forward heat flow the tightest pair repels: dx_j/dt = Σ 1/(x_j-x_k).
// For the closest pair separated by s, the two-body leading-order ODE is:
//   ds/dt ≈ +2/s  (repulsion: integrate s·ds=2dt → s²=s₀²+4t)
//   Backward to t<0: s(t)²=s₀²+4t → collision at t_c=-s₀²/4
//
// The proxy |t_c| = s₀²/4 ignores the many-body terms and does not bound Λ.
//
// But s₀ = s_min_normalized × mean_spacing
// And s_min_normalized ~ N^{-1/3} from GUE
// And mean_spacing = 2π/log(T/(2π))

function gueHeuristicSpacingProxy(T, N_zeros) {
  const meanS = meanSpacingAtHeight(T);
  const minNorm = expectedMinNormalizedSpacing(N_zeros);
  const s0 = minNorm * meanS;
  const twoBodyCollisionProxy = s0 * s0 / 4;
  return {
    meanSpacing: meanS,
    minNormalized: minNorm,
    s0_raw: s0,
    twoBodyCollisionProxy,
  };
}

export function spectralLambdaKernelTest() {
  // Part 1: Cascade Hamiltonian spectral gaps
  const kValues = [5, 10, 20, 50];
  const spectralGaps = kValues.map(K => {
    const { H, primes } = buildCascadeHamiltonian(K);
    const eigs = tridiagonalEigenvalues(H);
    const gaps = [];
    for (let i = 1; i < eigs.length; i++) gaps.push(eigs[i] - eigs[i-1]);
    const minGap = Math.min(...gaps);
    return { K, min_spectral_gap: +minGap.toFixed(6), eig_1: +eigs[0].toFixed(4), eig_2: +eigs[1].toFixed(4) };
  });

  // Part 2: heuristic GUE spacing/collision proxies
  const scenarios = [
    { T: 1000, N: 649, label: 'Our T=1000' },
    { T: 1e6, N: 620000, label: 'T=10^6' },
    { T: 1e12, N: 3e11, label: 'T=10^12 (Platt scale)' },
    { T: 1e20, N: 4e18, label: 'T=10^20 (Odlyzko)' },
    { T: Infinity, N: Infinity, label: 'N→∞ (RH)' },
  ];

  const gueHeuristicEstimates = scenarios.filter(s => isFinite(s.T)).map(s => {
    const result = gueHeuristicSpacingProxy(s.T, s.N);
    return {
      label: s.label,
      T: s.T >= 1e6 ? s.T.toExponential(0) : s.T,
      N: s.N >= 1e6 ? s.N.toExponential(0) : s.N,
      mean_spacing: +result.meanSpacing.toFixed(4),
      gue_expected_min_normalized: +result.minNormalized.toFixed(6),
      gue_expected_s0_raw: +result.s0_raw.toFixed(6),
      two_body_collision_proxy: +result.twoBodyCollisionProxy.toFixed(6),
      rigorous_lambda_bound: false,
    };
  });

  // Part 3: reference values. Only the last two entries are rigorous bounds.
  const finiteDysonEstimate = 0.011;       // imp-304 numerical estimate
  const repositoryBound = 0.1787854;       // unreviewed computer-assisted theorem
  const peerReviewedBound = 0.2;           // Platt-Trudgian

  // Part 4: compare the heuristic scale with the finite stored zero sample
  const actual = ZETA_ZEROS;
  let actualMinSpacing = Infinity;
  for (let i = 1; i < actual.length; i++) {
    const s = actual[i] - actual[i-1];
    if (s < actualMinSpacing) actualMinSpacing = s;
  }
  const actualSampleTwoBodyProxy = actualMinSpacing * actualMinSpacing / 4;
  const predictedProxy = gueHeuristicSpacingProxy(actual[actual.length-1], actual.length);

  const validation = {
    actual_min_spacing: +actualMinSpacing.toFixed(6),
    actual_sample_two_body_proxy: +actualSampleTwoBodyProxy.toFixed(6),
    gue_predicted_min_spacing: +predictedProxy.s0_raw.toFixed(6),
    gue_predicted_two_body_proxy: +predictedProxy.twoBodyCollisionProxy.toFixed(6),
    proxy_ratio: +(actualSampleTwoBodyProxy / predictedProxy.twoBodyCollisionProxy).toFixed(4),
    interpretation:
      'Finite-sample calibration of a two-body GUE heuristic; it is not a ' +
      'validation of a Lambda bound or a theorem about all zeta-zero gaps.',
  };

  // Part 5: heuristic scaling only
  // proxy ~ s_min² ~ (N^{-1/3} × 2π/log T)²
  // At T~10^12, N~3×10^11: s_min ~ (3e11)^{-1/3} × 2π/27.6 ~ 1e-4 × 0.23 ~ 2.3e-5
  // two-body proxy ~ (2.3e-5)² / 4 ~ 1.3e-10. This is not a Lambda bound.

  return {
    framework: {
      name: 'Spectral Lambda Kernel (GUE / spacing diagnostic)',
      status: 'HEURISTIC AND NUMERICAL — NO RIGOROUS LAMBDA BOUND',
      insight:
        'Explore a two-body collision scale using GUE-predicted minimum ' +
        'spacing and a numerical cascade-Hamiltonian surrogate.',
      formula:
        'two-body proxy = s_min²/4 with heuristic ' +
        's_min = N^{-1/3} × 2π/log(T/(2π))',
      missingTheorem:
        'No proved map sends cascade eigenvalue gaps to zeta-zero gaps, GUE ' +
        'does not give a uniform every-pair lower bound, and the two-body ODE ' +
        'does not control the full many-body Newman flow.',
    },

    cascade_spectral_gaps: spectralGaps,
    gue_heuristic_estimates: gueHeuristicEstimates,

    finite_sample_calibration: validation,

    comparison: {
      'Finite Dyson estimate imp-304 (not rigorous)': finiteDysonEstimate,
      'GUE two-body proxy (not a bound)': predictedProxy.twoBodyCollisionProxy,
      'Repository computer-assisted bound (unreviewed)': repositoryBound,
      'Peer-reviewed Platt-Trudgian bound': peerReviewedBound,
      'RH (Λ=0)': 0,
    },

    heuristic_scaling_law: {
      formula: 'two-body proxy ~ (N^{-2/3} × (2π/log T)²) / 4',
      at_T_1e12: 'proxy ~ 1.3×10^{-10} under the GUE model',
      at_T_1e20: 'proxy ~ 10^{-14} under the GUE model',
      limit:
        'The model proxy tends to zero. This is consistent with RH but does ' +
        'not imply Lambda <= 0 or any rigorous Lambda upper bound.',
    },

    keyFindings: [
      `Cascade Hamiltonian spectral gaps: K=5:${spectralGaps[0].min_spectral_gap}, K=50:${spectralGaps[3].min_spectral_gap}.`,
      `GUE two-body proxy at T=1000: ${gueHeuristicEstimates[0].two_body_collision_proxy} (not a bound).`,
      `GUE two-body proxy at T=10^12: ${gueHeuristicEstimates[2].two_body_collision_proxy} (not a bound).`,
      `Finite-sample two-body proxy ${validation.actual_sample_two_body_proxy} versus GUE proxy ${validation.gue_predicted_two_body_proxy} (ratio ${validation.proxy_ratio}).`,
      'The GUE input is statistical and conjectural for this use; Polymath15 needs rigorous uniform control.',
      'The cascade Hamiltonian is a numerical surrogate, not a proved operator model for zeta zeros.',
      'No value computed by this module improves or establishes a rigorous Lambda bound.',
    ],

    verdict:
      'HEURISTIC / NUMERICAL DIAGNOSTIC ONLY. GUE spacing statistics, ' +
      'finite stored zeros, and cascade-Hamiltonian gaps do not produce a ' +
      'rigorous de Bruijn-Newman bound. The rigorous displayed references ' +
      'remain the repository theorem Lambda <= 0.1787854 (unreviewed) and ' +
      'the peer-reviewed Platt-Trudgian Lambda <= 0.2.',
  };
}
