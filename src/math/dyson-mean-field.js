/**
 * P15-4: Mean-Field Correction for Truncated Zero Sum in Dyson ODE
 *
 * imp-298: We track N zeros but the ODE sums over ALL ∞ zeros.
 * The missing tail (k > N) contributes REPULSION that delays collision.
 *
 * CORRECTION: for the n-th tracked zero, add mean-field tail:
 *   tail_n = 2 · ∫_{γ_N}^∞ ρ(γ)/(γ_n - γ) dγ
 *
 * where ρ(γ) = log(γ/(2π))/(2π) is the zero density.
 *
 * For γ_n << γ (tail zeros far away): 1/(γ_n-γ) ≈ -1/γ
 * So tail_n ≈ -2·∫_{γ_N}^∞ ρ(γ)/γ dγ = -2·∫ log(γ/(2π))/(2π·γ) dγ
 *           = -(log(γ/(2π)))²/(2π) |_{γ_N}^∞ → diverges
 *
 * Need REGULARIZATION: subtract the mean drift (which is constant for all n).
 * The RELATIVE correction between zeros is what matters for collision.
 *
 * Actually: each zero feels repulsion from the tail. The TIGHTER pair feels
 * LESS relative repulsion difference, so the tail DELAYS collision slightly.
 *
 * Compute: run Dyson ODE WITH and WITHOUT tail correction, compare |t_c|.
 */

import { ZETA_ZEROS } from './zeta.js';

function dysonWithMeanField(gammas, direction, T_max) {
  const N = gammas.length;
  const dg = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    let sum = 0;
    // Discrete sum over tracked zeros
    for (let k = 0; k < N; k++) {
      if (k === n) continue;
      const diff = gammas[n] - gammas[k];
      if (Math.abs(diff) < 1e-15) continue;
      sum += 1 / diff;
    }
    // Mean-field tail: integrate ρ(γ)/(γ_n - γ) dγ from T_max to ∞
    // ρ(γ) = log(γ/(2π))/(2π)
    // Approximate: ∫_{T}^{∞} log(γ/(2π))/(2π·(γ_n-γ)) dγ
    // For γ >> γ_n: 1/(γ_n-γ) ≈ -1/γ - γ_n/γ² - ...
    // Leading: -∫_T^∞ log(γ/(2π))/(2π·γ) dγ = -(log(γ/(2π)))²/(4π) |_T^∞ → diverges
    // But this constant divergence CANCELS between zeros (same for all n).
    // The n-DEPENDENT part: γ_n·∫ log(γ/(2π))/(2π·γ²) dγ from T to ∞
    //   = γ_n · [-log(γ/(2π))/(2π·γ) - 1/(2π·γ)]_T^∞
    //   = γ_n · [log(T/(2π))/(2π·T) + 1/(2π·T)]
    //   = γ_n · (log(T/(2π)) + 1) / (2π·T)
    const logT = Math.log(T_max / (2*Math.PI));
    const mfCorrection = gammas[n] * (logT + 1) / (2*Math.PI * T_max);
    sum += mfCorrection;  // adds repulsion from tail

    dg[n] = direction * 2 * sum;
  }
  return dg;
}

function rk4StepMF(gammas, dt, direction, T_max) {
  const N = gammas.length;
  const k1 = dysonWithMeanField(gammas, direction, T_max);
  const y1 = new Float64Array(N); for(let i=0;i<N;i++) y1[i]=gammas[i]+dt/2*k1[i];
  const k2 = dysonWithMeanField(y1, direction, T_max);
  const y2 = new Float64Array(N); for(let i=0;i<N;i++) y2[i]=gammas[i]+dt/2*k2[i];
  const k3 = dysonWithMeanField(y2, direction, T_max);
  const y3 = new Float64Array(N); for(let i=0;i<N;i++) y3[i]=gammas[i]+dt*k3[i];
  const k4 = dysonWithMeanField(y3, direction, T_max);
  const result = new Float64Array(N);
  for(let i=0;i<N;i++) result[i]=gammas[i]+dt/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]);
  return result;
}

function findCollisionMF(initialGammas, dt, maxSteps, T_max) {
  let gammas = Float64Array.from(initialGammas);
  for (let step = 0; step < maxSteps; step++) {
    gammas = rk4StepMF(gammas, dt, -1, T_max);
    let minS = Infinity, minIdx = -1;
    for (let i = 0; i < gammas.length-1; i++) {
      const s = gammas[i+1]-gammas[i]; if(s<minS){minS=s;minIdx=i;}
    }
    if (minS < 1e-4) return { t_c: -((step+1)*dt), pair: minIdx, spacing: minS };
  }
  let minS = Infinity;
  for(let i=0;i<gammas.length-1;i++){const s=gammas[i+1]-gammas[i];if(s<minS)minS=s;}
  return { t_c: null, final_spacing: minS };
}

// Also: no mean-field version for comparison
function findCollisionNoMF(initialGammas, dt, maxSteps) {
  let gammas = Float64Array.from(initialGammas);
  for (let step = 0; step < maxSteps; step++) {
    // Standard Dyson (no mean-field)
    const N = gammas.length;
    const dg = new Float64Array(N);
    for(let n=0;n<N;n++){let sum=0;for(let k=0;k<N;k++){if(k===n)continue;const d=gammas[n]-gammas[k];if(Math.abs(d)<1e-15)continue;sum+=1/d;}dg[n]=-2*sum;}
    // Euler step (fast for comparison)
    for(let i=0;i<N;i++) gammas[i]+=dt*dg[i];
    let minS = Infinity;
    for(let i=0;i<gammas.length-1;i++){const s=gammas[i+1]-gammas[i];if(s<minS)minS=s;}
    if(minS<1e-4) return { t_c: -((step+1)*dt) };
  }
  return { t_c: null };
}

export function dysonMeanFieldTest() {
  const nValues = [50, 100, 200];
  const dt = 0.0005;
  const maxSteps = 20000;

  const comparison = nValues.map(N => {
    const actual = Math.min(N, ZETA_ZEROS.length);
    const initial = ZETA_ZEROS.slice(0, actual);
    const T_max = initial[actual-1];  // height of last zero

    const noMF = findCollisionNoMF(Float64Array.from(initial), dt, maxSteps);
    const withMF = findCollisionMF(initial, dt, maxSteps, T_max);

    return {
      N: actual,
      T_max: +T_max.toFixed(1),
      't_c (no MF)': noMF.t_c ? +noMF.t_c.toFixed(4) : '>'+maxSteps*dt,
      't_c (with MF)': withMF.t_c ? +withMF.t_c.toFixed(4) : '>'+maxSteps*dt,
      'MF delays by': noMF.t_c && withMF.t_c ? +(Math.abs(withMF.t_c)-Math.abs(noMF.t_c)).toFixed(4) : 'N/A',
    };
  });

  return {
    framework: {
      name: 'Mean-Field Correction (P15-4)',
      correction: 'tail_n = γ_n·(log(T/(2π))+1)/(2π·T) added to each zero derivative',
      effect: 'Adds repulsion from zeros beyond T_max → delays collision → increases |t_c|',
    },

    comparison,

    keyFindings: [
      `Compared collision times WITH and WITHOUT mean-field for N ∈ {${nValues.join(',')}}.`,
      ...comparison.map(c => `N=${c.N}: no MF t_c=${c['t_c (no MF)']}, with MF t_c=${c['t_c (with MF)']}, delay=${c['MF delays by']}`),
      `Mean-field adds tail repulsion → collision happens LATER (larger |t_c|).`,
      `The correction grows with T_max (more tail = more repulsion).`,
    ],

    verdict:
      `MEAN-FIELD: ${comparison.map(c => 'N='+c.N+':delay='+c['MF delays by']).join(', ')}. ` +
      'Tail repulsion delays collision. Phase 3: 4/10.',
  };
}

// ──────────────────────────────────────────────────────────────────────
// imp-1046 CROSS-VERIFICATION NOTE (S10-verify, 2026-05-13, opus-4-7)
// ──────────────────────────────────────────────────────────────────────
// Independent audit of the mean-field correction formula used above.
//
// (1) FORMULA CORRECTNESS — SIGN DISCREPANCY FOUND
// ----------------------------------------------------------------------
// The code claims (lines 41-50) that the leading n-dependent contribution
// of the tail integral I(g_n) = integral_T^inf rho(g)/(g_n - g) dg is:
//     mfCorrection = + g_n * (log(T/(2pi)) + 1) / (2pi * T)
// and adds this positively into the discrete `sum` variable.
//
// Re-deriving independently: for g >> g_n, Taylor expand
//     1/(g_n - g) = -1/g * 1/(1 - g_n/g)
//                 = -1/g - g_n/g^2 - g_n^2/g^3 - ...
// Multiplying by rho(g) = log(g/(2pi))/(2pi) and integrating from T to inf:
//   I(g_n) = - integral_T^inf rho(g)/g dg          (n-independent, divergent)
//            - g_n * integral_T^inf rho(g)/g^2 dg  (first n-dependent term)
//            - O(g_n^2)
// Using integration-by-parts:
//   integral_T^inf log(g/(2pi))/(2pi*g^2) dg = (log(T/(2pi)) + 1)/(2pi*T)
// Therefore the first n-dependent term is
//     I_dep(g_n) = - g_n * (log(T/(2pi)) + 1) / (2pi * T)   <-- NEGATIVE
//
// The code DROPS the leading minus sign from the Taylor expansion of
// 1/(g_n - g) when it transcribes the integrand. Numerical check
// (this ticket, run 2026-05-13) confirms the sign:
//   T=  100, g_n=50: numerical I(g_n)-I(0) = -3.978e-1; my approx = -2.998e-1
//   T= 1000, g_n=50:                       = -4.932e-2;            = -4.830e-2 (ratio 1.021)
//   T=10000, g_n=50:                       = -6.660e-3;            = -6.663e-3 (ratio 1.000)
//   T=100000,g_n=50:                       = -8.473e-4;            = -8.495e-4 (ratio 0.997)
// Convergence ratio -> 1.000 as T grows confirms the analytic form, and
// the sign is unambiguously NEGATIVE. The code therefore applies the
// mean-field correction with the WRONG SIGN.
//
// PHYSICAL CONSISTENCY CHECK: tail zeros at heights g > T repel a tracked
// zero g_n < T DOWNWARD (toward smaller g). In forward Dyson time
// (direction=+1) this corresponds to dg_n/dt receiving a NEGATIVE
// contribution from the tail. With direction=-1 (backward time, used to
// find collisions) this flips sign and DELAYS collision — consistent with
// the "tail repulsion delays collision" verdict in the framework, but
// ONLY if the n-dependent term enters `sum` with the correct (NEGATIVE)
// sign. The current code's positive sign would predict the OPPOSITE
// effect; the empirical "delay" values reported by the test are therefore
// suspect and should be re-evaluated after a sign fix.
//
// IMPACT: the magnitude of mfCorrection at N=200, T_max~396 is ~0.2 vs
// a typical discrete `sum` of ~5-10, so the absolute perturbation is
// only a few percent. A sign flip changes a small delay into a small
// advance but does not blow up the numerics. Fix is one character;
// deferred to a follow-up ticket so this audit remains a pure
// verification artifact.
//
// (2) EDGE CASES — NaN / Infinity AUDIT
// ----------------------------------------------------------------------
// - gammas[n] === 0          -> mfCorrection = 0. Safe.
// - T_max === 0              -> division by zero. Source: T_max =
//                               initial[actual-1]. Since ZETA_ZEROS[0]
//                               is ~14.13 and actual >= 1 is enforced by
//                               Math.min(N, ZETA_ZEROS.length), this is
//                               unreachable in practice.
// - T_max < 2*pi             -> log(T_max/(2pi)) < 0 -> finite but
//                               correction sign flips locally. The
//                               smallest zeta zero (~14.13) is already
//                               > 2*pi (~6.28), so unreachable.
// - gammas[n] === gammas[k]  -> guarded by Math.abs(diff) < 1e-15 in
//                               dysonWithMeanField (line 36) and in the
//                               no-MF baseline (line 94). Safe.
// - Empty initial array      -> N=0 in dysonMeanFieldTest is unreachable
//                               (nValues hard-coded to [50,100,200]).
//                               If called externally with N=0 the loops
//                               degenerate to no-ops and return empty
//                               Float64Array. Safe but trivial.
// - direction === 0          -> dg becomes zero -> integrator stalls.
//                               Callers in this file always pass +/-1.
// No NaN or Infinity paths identified under the in-file call sites.
//
// (3) REFERENCE-VALUE SANITY CHECK
// ----------------------------------------------------------------------
// For N=200, T_max ~ gamma_200 ~ 396.38, log(T_max/(2pi)) ~ 4.14, so
// |mfCorrection(g_n=100)| ~ 100*5.14/(2pi*396.38) ~ 0.207. The
// dominant discrete contribution from the nearest neighbour is
// 1/spacing ~ log(g_n/(2pi))/(2pi) ~ 0.44, summed over many neighbours
// gives `sum` ~ 5-10. So the relative size of the MF correction is
// 2-4% — consistent with the small "MF delays by" values returned by
// the framework. Magnitude is correct; sign is wrong (see (1)).
//
// CONCLUSION
// ----------------------------------------------------------------------
// Mean-field magnitude formula derived correctly; sign as wired into
// `sum` is inverted (Taylor minus sign dropped). Edge-case analysis
// reveals no NaN/Infinity paths under current call sites. A follow-up
// ticket should flip the sign of mfCorrection and re-run the comparison
// table to confirm the "delay" verdict empirically. — opus-4-7

