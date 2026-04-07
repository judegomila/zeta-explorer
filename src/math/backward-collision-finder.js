/**
 * P15-3: Backward Heat Flow Collision Finder
 *
 * imp-297 (CRITICAL): Using the Dyson ODE (imp-296), integrate backward
 * with INCREASING N to see how Λ estimate changes:
 *   N=20, 50, 100, 200, 500 zeros
 *
 * The collision time t_c should INCREASE (become more negative) as N grows
 * because more zeros add repulsion that delays the collision.
 *
 * imp-296 found t_c = -0.1435 with N=50. With more zeros, expect |t_c| to grow.
 * Extrapolating N→∞ gives the true Λ.
 */

import { ZETA_ZEROS } from './zeta.js';

function dysonDerivatives(gammas, direction) {
  const N = gammas.length;
  const dg = new Float64Array(N);
  for (let n = 0; n < N; n++) {
    let sum = 0;
    for (let k = 0; k < N; k++) {
      if (k === n) continue;
      const diff = gammas[n] - gammas[k];
      if (Math.abs(diff) < 1e-15) continue;
      sum += 1 / diff;
    }
    dg[n] = direction * 2 * sum;
  }
  return dg;
}

function rk4Step(gammas, dt, direction) {
  const N = gammas.length;
  const k1 = dysonDerivatives(gammas, direction);
  const y1 = new Float64Array(N); for (let i=0;i<N;i++) y1[i] = gammas[i] + dt/2*k1[i];
  const k2 = dysonDerivatives(y1, direction);
  const y2 = new Float64Array(N); for (let i=0;i<N;i++) y2[i] = gammas[i] + dt/2*k2[i];
  const k3 = dysonDerivatives(y2, direction);
  const y3 = new Float64Array(N); for (let i=0;i<N;i++) y3[i] = gammas[i] + dt*k3[i];
  const k4 = dysonDerivatives(y3, direction);
  const result = new Float64Array(N);
  for (let i=0;i<N;i++) result[i] = gammas[i] + dt/6*(k1[i]+2*k2[i]+2*k3[i]+k4[i]);
  return result;
}

function findCollision(initialGammas, dt, maxSteps) {
  let gammas = Float64Array.from(initialGammas);
  for (let step = 0; step < maxSteps; step++) {
    gammas = rk4Step(gammas, dt, -1);  // backward
    // Check min spacing
    let minS = Infinity, minIdx = -1;
    for (let i = 0; i < gammas.length-1; i++) {
      const s = gammas[i+1] - gammas[i];
      if (s < minS) { minS = s; minIdx = i; }
    }
    if (minS < 1e-4) {
      return { t_c: -((step+1) * dt), pair_index: minIdx, min_spacing: minS, steps: step+1 };
    }
  }
  // No collision found — return final state
  let minS = Infinity;
  for (let i = 0; i < gammas.length-1; i++) { const s = gammas[i+1]-gammas[i]; if (s<minS) minS=s; }
  return { t_c: null, final_spacing: minS, steps: maxSteps };
}

export function backwardCollisionFinderTest() {
  // Test with increasing N
  const nValues = [20, 50, 100, 200, 400, 870];
  const dt = 0.0005;
  const maxSteps = 40000;  // t goes to -20

  const results = nValues.map(N => {
    const actualN = Math.min(N, ZETA_ZEROS.length);
    const initial = ZETA_ZEROS.slice(0, actualN);
    const result = findCollision(initial, dt, maxSteps);
    return {
      N: actualN,
      t_c: result.t_c ? +result.t_c.toFixed(4) : 'no collision',
      '|t_c| (Λ est)': result.t_c ? +Math.abs(result.t_c).toFixed(4) : '>'+((maxSteps*dt).toFixed(1)),
      pair_index: result.pair_index,
      steps: result.steps,
    };
  });

  // Extrapolation: if |t_c| grows with N, fit |t_c| ~ a + b/N and extrapolate to N→∞
  const withCollision = results.filter(r => typeof r.t_c === 'number');
  let extrapolated = null;
  if (withCollision.length >= 3) {
    // Linear fit: |t_c| = a + b/N
    const xs = withCollision.map(r => 1/r.N);
    const ys = withCollision.map(r => r['|t_c| (Λ est)']);
    const n = xs.length;
    const sx = xs.reduce((a,b)=>a+b,0), sy = ys.reduce((a,b)=>a+b,0);
    const sxy = xs.reduce((s,x,i)=>s+x*ys[i],0), sx2 = xs.reduce((s,x)=>s+x*x,0);
    const b = (n*sxy-sx*sy)/(n*sx2-sx*sx);
    const a = (sy - b*sx)/n;
    extrapolated = { a: +a.toFixed(4), b: +b.toFixed(4), 'Λ_est(N→∞)': +a.toFixed(4) };
  }

  return {
    framework: {
      name: 'Backward Collision Finder (P15-3)',
      method: 'Dyson ODE backward with increasing N',
      prediction: '|t_c| grows with N; extrapolate to N→∞ for true Λ',
    },

    collision_vs_N: results,
    extrapolation: extrapolated,

    keyFindings: [
      `Collision search with N ∈ {${nValues.join(',')}}, dt=${dt}, max steps=${maxSteps}.`,
      ...results.map(r => `N=${r.N}: ${typeof r.t_c === 'number' ? 't_c='+r.t_c+' → Λ~'+r['|t_c| (Λ est)'] : 'no collision (Λ>'+r['|t_c| (Λ est)']+')'}`),
      extrapolated ? `Extrapolation |t_c| = ${extrapolated.a} + ${extrapolated.b}/N → Λ(N→∞) ≈ ${extrapolated['Λ_est(N→∞)']}` : 'Insufficient data for extrapolation',
    ],

    verdict:
      `COLLISION FINDER: ${results.filter(r=>typeof r.t_c==='number').length}/${results.length} found collisions. ` +
      (extrapolated ? `Extrapolated Λ(N→∞) ≈ ${extrapolated['Λ_est(N→∞)']}.` : 'Extrapolation pending.') +
      ' Phase 3: 3/10.',
  };
}
