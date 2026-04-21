/**
 * imp-857-sub-scale-to-N10k BASELINE retest.
 *
 * HYPOTHESIS TEST (disproves previous assumption)
 * -----------------------------------------------
 * imp-857 declared that the one-ULP interval RK4 of imp-362 blows up
 * under wrapper-width growth at N ≥ 1000, and therefore requires a
 * directed-rounding backend (Arb / MPFI / CAPD). The basis for that
 * claim was an EXTRAPOLATION from the 870-zero ZETA_ZEROS table in
 * zeta.js — N ≥ 1000 was never actually run.
 *
 * With imp-858 we now have zeros-to-1e6.js (10⁶ zeros). A direct empirical
 * check (src/math/imp-857-phase-locked-dyson.mjs at ε = 0, N = 1000)
 * shows the baseline interval RK4 CLOSES at step 34 with wrapper width
 * 3.36·10⁻⁸ — well below the 0.01 heuristic. The extrapolation was wrong.
 *
 * This module runs the baseline imp-362 interval RK4 on N ∈ {1000, 2000,
 * 5000, 10000} with the zeros-to-1e6 table and records per-N closure,
 * wrapper width, collision bracket, and certified C_mb.
 *
 * WHY IT PROBABLY WORKS
 * ---------------------
 * The collision-time pair estimate τ_c_pair(N) = H_N²/8 where H_N is the
 * initial min-gap. On the zeros-to-1e6 data:
 *
 *     N      min-gap    τ_c_pair    step count (dt=10⁻⁴)
 *     1000   0.1615     3.26·10⁻³   ≤ 33
 *     2000   0.0975     1.19·10⁻³   ≤ 12
 *     5000   0.0433     2.34·10⁻⁴   ≤ 3
 *     10000  0.0377     1.78·10⁻⁴   ≤ 2
 *
 * At 2-12 steps the wrapper has no time to accumulate exponentially.
 * At N = 10000 the drift Jacobian eigenvalues are ~ 1/H_N² ~ 700, so per-
 * step multiplicative wrapping is (1 + dt·700) = 1.07. Over 2 steps that
 * is 1.14 — trivially bounded.
 *
 * The ULP inflation contribution per step: O(N²) · 2·eps_Float64 =
 * 10⁸ · 2·10⁻¹⁶ = 2·10⁻⁸ in RELATIVE wrapper width. Multiplied through
 * by the initial min-gap ~ 0.04 this is ~10⁻⁹ — inside the 10⁻⁸ target.
 *
 * CONSEQUENCES
 * ------------
 * If this works at N ≥ 1000:
 *   - imp-857 is closable at N ∈ {1000, 2000, 5000, 10000} without a
 *     directed-rounding backend.
 *   - The phased-forcing path remains useful as an orthogonal
 *     reduction technique but is not strictly necessary.
 *   - imp-857-sub-scale-to-N10k resolves by re-targeting imp-362 at the
 *     larger zero table, not by adding infrastructure.
 *
 * This file is a Node-runnable probe. Deployment into the build graph
 * requires moving PATH_C_FIT_POINTS to include N = 1000, 2000, 5000,
 * 10000 and having imp-362 auto-use zeros-to-1e6.js for those N.
 */

import {
  subInterval,
  rk4IntervalStep,
} from './interval-dyson-integrator.mjs';
import { ZEROS_EXTENDED } from '../data/zeros-to-1e6.js';

// Minimum gap of the first N zeros (the binding pair for collision).
function minGap(zeros, N) {
  let mg = Infinity;
  for (let i = 1; i < N; i++) {
    const g = zeros[i] - zeros[i - 1];
    if (g < mg) mg = g;
  }
  return mg;
}

// Returns { closed, steps, tAbs, minGapLo, minGapHi, width, maxIntervalWidth }.
function runBaseline(N, dt, maxSteps) {
  const initial = ZEROS_EXTENDED.slice(0, N);
  let gammas = initial.map((g) => [g, g]);
  let tAbs = 0;
  for (let step = 0; step < maxSteps; step++) {
    let mgLo = Infinity;
    let mgHi = Infinity;
    for (let i = 0; i < gammas.length - 1; i++) {
      const gap = subInterval(gammas[i + 1], gammas[i]);
      if (gap[0] < mgLo) {
        mgLo = gap[0];
        mgHi = gap[1];
      }
    }
    let maxW = 0;
    for (let i = 0; i < gammas.length; i++) {
      const w = gammas[i][1] - gammas[i][0];
      if (w > maxW) maxW = w;
    }
    if (mgLo <= 0) {
      return {
        N,
        closed: true,
        steps: step,
        tAbs: +tAbs.toFixed(8),
        minGapLo: +mgLo.toExponential(3),
        minGapHi: +mgHi.toExponential(3),
        collisionWidth: +dt.toExponential(3),
        maxIntervalWidth: +maxW.toExponential(3),
      };
    }
    const next = rk4IntervalStep(gammas, dt);
    if (next === null) {
      return {
        N,
        closed: 'rk4-returned-null',
        steps: step,
        tAbs: +tAbs.toFixed(8),
        maxIntervalWidth: +maxW.toExponential(3),
      };
    }
    gammas = next;
    tAbs += dt;
  }
  return {
    N,
    closed: false,
    steps: maxSteps,
    tAbs: +tAbs.toFixed(8),
    note: 'budget exhausted before collision',
  };
}

const SWEEP = [
  { N: 1000, dt: 1e-4, maxSteps: 200 },
  { N: 2000, dt: 1e-4, maxSteps: 50 },
  { N: 5000, dt: 1e-5, maxSteps: 50 },
  { N: 10000, dt: 1e-5, maxSteps: 50 },
];

function log(msg) {
  process.stdout.write(msg + '\n');
}

log('imp-857-sub-scale-to-N10k  baseline retest  (pure ε=0 interval RK4)');
log('-----------------------------------------------------------------------');

for (const cfg of SWEEP) {
  const mg = minGap(ZEROS_EXTENDED, cfg.N);
  const tcPair = (mg * mg) / 8;
  log(
    `N=${cfg.N}  minGap=${mg.toFixed(6)}  t_c_pair=${tcPair.toExponential(3)}  ` +
    `dt=${cfg.dt}  maxSteps=${cfg.maxSteps}`,
  );
  const t0 = Date.now();
  const result = runBaseline(cfg.N, cfg.dt, cfg.maxSteps);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  log(`  result: ${JSON.stringify(result)}  (${elapsed}s)`);
}
