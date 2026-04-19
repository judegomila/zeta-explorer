/**
 * imp-857 alt-path (dolphin-skin analog): phase-locked traveling-wave
 * forcing of the interval Dyson flow.
 *
 * MOTIVATION
 * ----------
 * Dolphin skin reduces turbulent drag by running a compliant traveling wave
 * whose phase velocity tracks the near-wall streak cycle (Kramer 1960s;
 * Choi-Clayton 2001; Nakanishi-Fukagata 2012 for MEMS upstream-traveling
 * walls → ~30% skin-friction reduction via phase-matched cancellation of
 * the Reynolds-stress production term). In our zeta fluid picture the
 * Dyson/Burgers flow ∂_t m + m ∂_x m = -ν m_xx has a "skin" at the
 * Riemann-zero spacing scale and the wrapping-effect blow-up in the
 * interval RK4 is the moral equivalent of turbulent stress amplification.
 *
 * HYPOTHESIS
 * ----------
 * Adding a small traveling-wave perturbation to the Dyson drift
 *
 *   dg_k/dt = -2·Σ_{j≠k} 1/(g_k − g_j)  +  ε·cos(k₀·g_k − ω·t)
 *
 * with (k₀, ω) tuned so that the phase velocity ω/k₀ = π·ρ_mean matches
 * the GUE bulk-density velocity cancels part of the wrapper-expansion
 * mode of the RK4, analogously to upstream-traveling-wall cancellation
 * of streak production. At ε → 0 the collision-time asymptotic is
 * recovered (the perturbation is O(ε) in integral norm), but the
 * wrapper-width growth rate can drop significantly for modest ε.
 *
 * WHAT THIS SCRIPT DOES
 * ---------------------
 * Runs N = 500 backward Dyson interval-RK4 under three regimes:
 *   R0: ε = 0 (baseline)
 *   R1: ε = 0.01 (weak phase-locked)
 *   R2: ε = 0.05 (moderate)
 * Measures min-gap interval width at each step. Reports the step-by-step
 * ratio width_R1 / width_R0 and width_R2 / width_R0. If these ratios are
 * < 1 after N_step steps, the forcing is reducing wrapper expansion — a
 * positive empirical signal for the imp-857-sub-scale-to-N10k sub-gap.
 *
 * LIMITATIONS (read first)
 * ------------------------
 *   1. Breaks Dyson permutation invariance (different g_k see different
 *      forcing). A rigorous deployment requires a commutator bound on
 *      [H_forcing, H_dyson]. The memo
 *      (src/math/imp-857-phased-forcing-memo.js) documents the
 *      outstanding bound.
 *   2. Uses a simple cos-interval enclosure |cos([a,b])| ⊆
 *      [cos(mid) − width/2, cos(mid) + width/2], valid because
 *      |cos'| ≤ 1. Tight enough for the ULP-scale time intervals we
 *      actually encounter.
 *   3. This is a PROTOTYPE. Promotion to a certified bound on C_mb at
 *      N = 10⁴ requires the directed-rounding backend of the main
 *      imp-857 sub-gap AND the commutator proof of item 1.
 *
 * Sign convention matches interval-dyson-integrator.mjs: positive dt
 * corresponds to BACKWARD flow toward the Calogero-Moser collision.
 */

import {
  addInterval,
  subInterval,
  mulInterval,
  reciprocalInterval,
  dysonDriftInterval,
} from './interval-dyson-integrator.mjs';
import { ZEROS_EXTENDED } from '../data/zeros-to-1e6.js';

// ---- cos interval primitive -----------------------------------------------

// Valid interval enclosure of cos on [lo, hi]. Uses |cos'(x)| ≤ 1 to get
// cos([lo, hi]) ⊆ [cos(mid) − width/2, cos(mid) + width/2]. Tight for the
// ULP-scale widths the Dyson integrator actually sees.
function cosInterval(a) {
  const mid = 0.5 * (a[0] + a[1]);
  const halfWidth = 0.5 * (a[1] - a[0]);
  const c = Math.cos(mid);
  const lo = Math.max(-1, c - halfWidth);
  const hi = Math.min(1, c + halfWidth);
  // One-ULP outward inflation so the result conservatively dominates any
  // IEEE 754 directed-rounding result of Math.cos at mid.
  const eps = Math.max(Math.abs(lo), Math.abs(hi)) * 2.22e-16 + 5e-324;
  return [lo - eps, hi + eps];
}

// Scalar-times-interval helper.
function scalarMul(k, a) {
  if (k === 0) return [0, 0];
  if (k > 0) return [k * a[0], k * a[1]];
  return [k * a[1], k * a[0]];
}

// ---- Forced Dyson drift ---------------------------------------------------

// Forcing term F_k(t) = ε·cos(k₀·g_k − ω·t) on particle k.
// Interval-valued because g_k is an interval.
function forcingInterval(gk, k0, omega, t, eps) {
  if (eps === 0) return [0, 0];
  // arg = k₀·g_k − ω·t  (t is a scalar, ω scalar, k₀ scalar)
  const arg = [k0 * gk[0] - omega * t, k0 * gk[1] - omega * t];
  const c = cosInterval(arg);
  return scalarMul(eps, c);
}

// Forced drift for particle k: Dyson Coulomb + traveling-wave forcing.
function forcedDriftInterval(gammas, k, k0, omega, t, eps) {
  const dyson = dysonDriftInterval(gammas, k);
  if (dyson === null) return null;
  const force = forcingInterval(gammas[k], k0, omega, t, eps);
  return addInterval(dyson, force);
}

function forcedDriftVector(gammas, k0, omega, t, eps) {
  const N = gammas.length;
  const out = new Array(N);
  for (let k = 0; k < N; k++) {
    const d = forcedDriftInterval(gammas, k, k0, omega, t, eps);
    if (d === null) return null;
    out[k] = d;
  }
  return out;
}

// ---- Forced RK4 step -------------------------------------------------------

function forcedRk4Step(gammas, dt, k0, omega, t, eps) {
  const N = gammas.length;
  const dtI = [dt, dt];
  const half = [0.5, 0.5];
  const sixth = [1 / 6, 1 / 6];
  const two = [2, 2];

  const k1 = forcedDriftVector(gammas, k0, omega, t, eps);
  if (k1 === null) return null;

  const stage2 = new Array(N);
  for (let i = 0; i < N; i++) {
    stage2[i] = addInterval(
      gammas[i],
      mulInterval(mulInterval(half, dtI), k1[i]),
    );
  }
  const k2 = forcedDriftVector(stage2, k0, omega, t + 0.5 * dt, eps);
  if (k2 === null) return null;

  const stage3 = new Array(N);
  for (let i = 0; i < N; i++) {
    stage3[i] = addInterval(
      gammas[i],
      mulInterval(mulInterval(half, dtI), k2[i]),
    );
  }
  const k3 = forcedDriftVector(stage3, k0, omega, t + 0.5 * dt, eps);
  if (k3 === null) return null;

  const stage4 = new Array(N);
  for (let i = 0; i < N; i++) {
    stage4[i] = addInterval(gammas[i], mulInterval(dtI, k3[i]));
  }
  const k4 = forcedDriftVector(stage4, k0, omega, t + dt, eps);
  if (k4 === null) return null;

  const next = new Array(N);
  for (let i = 0; i < N; i++) {
    const s = addInterval(
      addInterval(k1[i], mulInterval(two, k2[i])),
      addInterval(mulInterval(two, k3[i]), k4[i]),
    );
    const incr = mulInterval(mulInterval(sixth, dtI), s);
    next[i] = addInterval(gammas[i], incr);
  }
  return next;
}

// ---- Wrapper-width tracer --------------------------------------------------

// Run nSteps of RK4 with forcing strength eps. Record min-gap width at
// every step. Returns array of { step, tAbs, minGapLo, minGapHi, width,
// maxIntervalWidth }.
function runForcedTrace(gammas0, dt, nSteps, { k0, omega, eps }) {
  let gammas = gammas0.map((g) => [g, g]);
  const trace = [];
  let tAbs = 0;
  for (let step = 0; step < nSteps; step++) {
    // Min-gap interval
    let minGapLo = Infinity;
    let minGapHi = Infinity;
    for (let i = 0; i < gammas.length - 1; i++) {
      const gap = subInterval(gammas[i + 1], gammas[i]);
      if (gap[0] < minGapLo) {
        minGapLo = gap[0];
        minGapHi = gap[1];
      }
    }
    // Max per-particle interval width (tracks wrapping).
    let maxW = 0;
    for (let i = 0; i < gammas.length; i++) {
      const w = gammas[i][1] - gammas[i][0];
      if (w > maxW) maxW = w;
    }
    trace.push({
      step,
      tAbs: +tAbs.toFixed(8),
      minGapLo: +minGapLo.toExponential(3),
      minGapHi: +minGapHi.toExponential(3),
      width: +(minGapHi - minGapLo).toExponential(3),
      maxIntervalWidth: +maxW.toExponential(3),
    });
    if (minGapLo <= 0) {
      trace[trace.length - 1].collisionDetected = true;
      break;
    }
    const next = forcedRk4Step(gammas, dt, k0, omega, tAbs, eps);
    if (next === null) {
      trace[trace.length - 1].forcedRk4Returned = 'null';
      break;
    }
    gammas = next;
    tAbs += dt;
  }
  return trace;
}

// ---- Main: N = 500 three-way comparison -----------------------------------

const N = Number(process.env.IMP857_N ?? 500);
const dt = Number(process.env.IMP857_DT ?? (N <= 600 ? 0.0003 : 0.0001));
const nSteps = Number(process.env.IMP857_NSTEPS ?? 200);

// Unfolded mean density ≈ 1 at this scale (we're using raw gamma_n which
// has density log(T)/(2π); for zeros in zeros-to-1e6.js at the bundled
// height, log(T)/(2π) ≈ 2…3). We use k₀ = π (gives wavelength 2) and
// ω = k₀·π·ρ_mean where ρ_mean is measured from the first-N gap mean.
const initial = ZEROS_EXTENDED.slice(0, N);
const meanGap = (initial[N - 1] - initial[0]) / (N - 1);
const rhoMean = 1 / meanGap;
const k0 = Math.PI;
const omega = k0 * Math.PI * rhoMean; // phase velocity ω/k₀ = π·ρ_mean

console.log(
  `N=${N}  dt=${dt}  nSteps=${nSteps}  meanGap=${meanGap.toFixed(6)}  ` +
  `rhoMean=${rhoMean.toFixed(4)}  k0=${k0.toFixed(4)}  ω=${omega.toFixed(4)}  ` +
  `phaseVel=ω/k₀=${(omega / k0).toFixed(4)}`,
);

const EPSILONS = [0, 0.01, 0.05];
const labels = ['ε=0 (baseline)', 'ε=0.01', 'ε=0.05'];
const traces = EPSILONS.map((eps) =>
  runForcedTrace(initial, dt, nSteps, { k0, omega, eps }),
);

// Print comparison table at a handful of step landmarks.
const marks = [1, 10, 50, 100, 150, 199].filter((s) => s < nSteps);
console.log();
console.log('step  |  maxIntervalWidth per regime  |  ratio (ε>0 / baseline)');
console.log('------|-------------------------------|----------------------');
for (const m of marks) {
  const row0 = traces[0][m] ?? traces[0][traces[0].length - 1];
  const row1 = traces[1][m] ?? traces[1][traces[1].length - 1];
  const row2 = traces[2][m] ?? traces[2][traces[2].length - 1];
  if (!row0 || !row1 || !row2) continue;
  const w0 = row0.maxIntervalWidth;
  const w1 = row1.maxIntervalWidth;
  const w2 = row2.maxIntervalWidth;
  const r1 = w0 > 0 ? (w1 / w0).toFixed(3) : 'n/a';
  const r2 = w0 > 0 ? (w2 / w0).toFixed(3) : 'n/a';
  console.log(
    `${String(m).padStart(5)} |  ${String(w0).padEnd(10)}  ${String(w1).padEnd(10)}  ${String(w2).padEnd(10)}  |  ${r1}  ${r2}`,
  );
}

// Summary verdict
const finalRow0 = traces[0][traces[0].length - 1];
const finalRow1 = traces[1][traces[1].length - 1];
const finalRow2 = traces[2][traces[2].length - 1];
console.log();
console.log('Final state:');
console.log(`  R0 (ε=0)    : step=${finalRow0.step}  maxW=${finalRow0.maxIntervalWidth}  minGap=${finalRow0.minGapLo}`);
console.log(`  R1 (ε=0.01) : step=${finalRow1.step}  maxW=${finalRow1.maxIntervalWidth}  minGap=${finalRow1.minGapLo}`);
console.log(`  R2 (ε=0.05) : step=${finalRow2.step}  maxW=${finalRow2.maxIntervalWidth}  minGap=${finalRow2.minGapLo}`);

const ratio1 = finalRow0.maxIntervalWidth > 0
  ? finalRow1.maxIntervalWidth / finalRow0.maxIntervalWidth
  : NaN;
const ratio2 = finalRow0.maxIntervalWidth > 0
  ? finalRow2.maxIntervalWidth / finalRow0.maxIntervalWidth
  : NaN;
console.log();
console.log(
  `Wrapper-width ratio at final step:  ε=0.01 / baseline = ${ratio1.toFixed(3)}  |  ε=0.05 / baseline = ${ratio2.toFixed(3)}`,
);
if (ratio1 < 0.9 || ratio2 < 0.9) {
  console.log('VERDICT: phase-locked forcing REDUCES wrapper-width growth — positive signal.');
} else if (ratio1 > 1.1 && ratio2 > 1.1) {
  console.log('VERDICT: phase-locked forcing AMPLIFIES wrapper width — wrong phase velocity or destabilizing.');
} else {
  console.log('VERDICT: no significant effect at tested ε — sweep larger ε or retune (k₀, ω).');
}
