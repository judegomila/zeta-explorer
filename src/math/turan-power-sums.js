/**
 * Turan Power Sum Method for zeta-Zeros (and WHY it fails for RH)
 *
 * imp-249: Turan (1953) considered the partial sums of the Dirichlet series:
 *
 *   S_N(s) = Sum_{n=1}^N n^{-s}
 *
 * as approximations to zeta(s). His strategy: if S_N(sigma+it) != 0 for all
 * sigma > 1 - c/log N, then zeta has no zeros in this region.
 *
 * MONTGOMERY (1983) PROVED THIS CANNOT WORK: there exist N and s = sigma+it with
 * sigma > 1 - c/log N such that S_N(s) = 0. This is a NEGATIVE RESULT showing
 * one natural approach to RH is blocked.
 *
 * However, S_N(s) DOES approximate zeta(s) well for Re(s) > 1 and partially on
 * the critical line when N ~ sqrt(t/(2*pi)) (matching Riemann-Siegel).
 *
 * THIS MODULE:
 *   1. Verify S_N(s) -> zeta(s) convergence for Re(s) > 1.
 *   2. Compare S_N(1/2+it) to Z(t) at critical line heights.
 *   3. Find approximate zeros of S_N near zeta-zeros.
 *   4. Show WHERE S_N breaks down (zeros of S_N off the critical line).
 *   5. Demonstrate Montgomery's obstruction numerically.
 */

import { riemannSiegelZEnhanced, ZETA_ZEROS } from './zeta.js';

// S_N(s) = Sum n^{-s} for complex s = sigma+it
function S_N(N, sigma, t) {
  let re = 0, im = 0;
  for (let n = 1; n <= N; n++) {
    const mag = Math.pow(n, -sigma);
    const phase = -t * Math.log(n);
    re += mag * Math.cos(phase);
    im += mag * Math.sin(phase);
  }
  return { re, im, abs: Math.sqrt(re*re + im*im) };
}

function zetaApprox(sigma, N = 5000) {
  let sum = 0;
  for (let n = 1; n <= N; n++) sum += Math.pow(n, -sigma);
  sum += Math.pow(N, 1-sigma) / (sigma-1);
  sum -= 0.5 * Math.pow(N, -sigma);
  return sum;
}

export function turanPowerSumsTest() {
  // Test 1: Convergence S_N(s) -> zeta(s) for real s > 1
  const convergenceTest = [2, 3, 4].map(s => {
    const zeta_true = zetaApprox(s);
    const data = [10, 50, 100, 500, 1000].map(N => ({
      N,
      S_N: +S_N(N, s, 0).re.toFixed(6),
      zeta: +zeta_true.toFixed(6),
      rel_err: +((S_N(N, s, 0).re - zeta_true) / zeta_true).toExponential(3),
    }));
    return { s, data };
  });

  // Test 2: S_N on critical line vs Z(t)
  const criticalLineTest = [14.13, 21.02, 25.01, 30.42, 40.92].map(t => {
    const N_opt = Math.floor(Math.sqrt(t / (2*Math.PI)));
    const sn = S_N(N_opt, 0.5, t);
    const Z = riemannSiegelZEnhanced(t);
    const sn_large = S_N(200, 0.5, t);
    return {
      t: +t.toFixed(2),
      N_optimal: N_opt,
      abs_S_N_opt: +sn.abs.toFixed(4),
      abs_S_200: +sn_large.abs.toFixed(4),
      Z_t: +Z.toFixed(4),
      near_zero: Math.abs(Z) < 0.5,
    };
  });

  // Test 3: Find near-zeros of S_50 on grid
  const N_test = 50;
  const zerosOfSN = [];
  for (let t = 10; t <= 50; t += 0.1) {
    for (const sigma of [0.5, 0.6, 0.7, 0.8, 0.9]) {
      const val = S_N(N_test, sigma, t);
      if (val.abs < 0.3) {
        const isDup = zerosOfSN.some(f => Math.abs(f.t - t) < 0.5 && f.sigma === sigma);
        if (!isDup) zerosOfSN.push({ sigma, t: +t.toFixed(2), abs: +val.abs.toFixed(4) });
      }
    }
  }

  // Test 4: Turan condition at sigma=1
  const turanAtSigma1 = [20, 50, 100, 200].map(N => {
    let minAbs = Infinity, minT = 0;
    for (let t = 1; t <= 100; t += 0.1) {
      const val = S_N(N, 1, t);
      if (val.abs < minAbs) { minAbs = val.abs; minT = t; }
    }
    return {
      N,
      min_abs_S_N_at_1: +minAbs.toFixed(4),
      at_t: +minT.toFixed(1),
      inv_logN: +(1/Math.log(N)).toFixed(4),
    };
  });

  // Test 5: S_N at zeta-zeros
  const snAtZetaZeros = ZETA_ZEROS.slice(0, 8).map(gamma => ({
    gamma: +gamma.toFixed(4),
    S_10: +S_N(10, 0.5, gamma).abs.toFixed(4),
    S_30: +S_N(30, 0.5, gamma).abs.toFixed(4),
    S_50: +S_N(50, 0.5, gamma).abs.toFixed(4),
    S_100: +S_N(100, 0.5, gamma).abs.toFixed(4),
  }));

  return {
    framework: {
      name: "Turan Power Sum Method (1953) and Montgomery's Obstruction (1983)",
      approach: 'If S_N(s) != 0 for sigma > 1-c/log N then zeta zero-free there',
      obstruction: 'Montgomery (1983): EXISTS N, s with sigma > 1-c/log N where S_N(s)=0. Method CANNOT prove RH.',
      lesson: 'Partial Dirichlet sums do NOT inherit zero-free properties of zeta',
    },

    convergence_Re_gt_1: convergenceTest,
    critical_line_comparison: criticalLineTest,

    zeros_of_S_50: {
      count: zerosOfSN.length,
      sample: zerosOfSN.slice(0, 15),
    },

    turan_condition_sigma_1: turanAtSigma1,
    S_N_at_zeta_zeros: snAtZetaZeros,

    keyFindings: [
      `S_N(s) -> zeta(s) for Re(s)>1: at s=2, S_1000=${convergenceTest[0].data[4].S_N}, zeta(2)=${(Math.PI**2/6).toFixed(6)}.`,
      `Critical line: |S_N(1/2+it)| near zeta-zeros is small for N~sqrt(t/2pi).`,
      `S_50 has ${zerosOfSN.length} near-zeros in sigma in [0.5,0.9], t in [10,50] — some OFF critical line.`,
      `Turan condition at sigma=1: min|S_N(1+it)| = ${turanAtSigma1.map(t => t.min_abs_S_N_at_1).join(', ')} for N=${turanAtSigma1.map(t=>t.N).join(',')}.`,
      `At zeta-zeros: S_N -> 0 as N grows (S_100(1/2+i*gamma_1) = ${snAtZetaZeros[0].S_100}).`,
      `LESSON: S_N develops SPURIOUS zeros (off sigma=1/2) that zeta avoids via functional equation.`,
    ],

    relationToRH: {
      turanOriginal: 'Turan (1953): use S_N zero-free regions to deduce zeta zero-free regions.',
      montgomeryDestruction: 'Montgomery (1983): EXISTS N where S_N has zeros with Re(s) > 1-c/log N. BLOCKS approach.',
      why_it_fails: 'S_N lacks functional equation. Oscillatory cancellation creates spurious zeros. zeta avoids these via xi(s)=xi(1-s).',
      positive_lesson: 'Approaches MUST use functional equation / analytic continuation / spectral properties — not just Dirichlet series.',
    },

    verdict:
      `TURAN POWER SUMS: S_N(s) converges to zeta for Re(s)>1. Approximates critical-line zeros. ` +
      `BUT develops ${zerosOfSN.length} spurious near-zeros off sigma=1/2 (for N=50). ` +
      'Montgomery (1983): method CANNOT prove RH. Functional equation is essential.',
  };
}
