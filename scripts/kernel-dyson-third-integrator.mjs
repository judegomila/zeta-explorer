#!/usr/bin/env node
/**
 * Offline sidecar for imp-2743: a THIRD, independent integrator of the
 * isolated-nearest-pair backward Calogero-Moser flow
 *
 *     dd/dtau = -4 / d        (d = nearest gap; backward collision flow)
 *
 * to triangulate the kernel-vs-dyson N=10K agreement. PATH A is the analytic
 * pair-ODE (t_c = d_min^2 / 8); PATH B is the full N-body Float64 RK4 from
 * imp-514. This sidecar adds PATH C: a high-order adaptive integrator from a
 * DIFFERENT method family than RK4 -- Bulirsch-Stoer (Gragg modified-midpoint
 * sub-stepping + polynomial Richardson extrapolation), reaching effective
 * order >= 8 (the DOP853-role independent route). A two-integrator agreement
 * can share a discretization bug; a third, different-family method catches it.
 *
 * Result is baked as a literal into src/data/kernel-vs-dyson-crossverify.js so
 * the build-time module stays light (no integration, no heavy imports).
 *
 * Run: node scripts/kernel-dyson-third-integrator.mjs
 */

// N=10K row from dyson-ladder-extended-cache.json (imp-514)
const D_MIN = 0.0376985;     // initialMinGap at N=10000
const TC_RK4 = 0.00017772;   // PATH B measured (Float64 RK4)

// Backward CM flow for the isolated nearest pair.
const f = (d) => -4.0 / d;

// Gragg modified-midpoint method: nSub sub-steps of size H/nSub over [t, t+H].
function modifiedMidpoint(y0, H, nSub) {
  const h = H / nSub;
  let ym = y0;
  let yn = y0 + h * f(y0);
  for (let i = 1; i < nSub; i++) {
    const yNext = ym + 2.0 * h * f(yn);
    ym = yn;
    yn = yNext;
  }
  // Final smoothing average (Gragg)
  return 0.5 * (ym + yn + h * f(yn));
}

// One Bulirsch-Stoer step: extrapolate modified-midpoint results over the
// sub-step sequence to step-size -> 0 via Neville polynomial extrapolation.
// Returns { y, err } where err estimates the local extrapolation error.
function bulirschStoerStep(y0, H) {
  const seq = [2, 4, 6, 8, 10, 12, 14, 16]; // even sub-step counts
  const T = [];
  let prevTop = null;
  let bestErr = Infinity;
  for (let k = 0; k < seq.length; k++) {
    T[k] = modifiedMidpoint(y0, H, seq[k]);
    // Neville extrapolation in the variable (H/n)^2
    for (let j = k - 1; j >= 0; j--) {
      const ratio = (seq[k] / seq[j]) ** 2;
      T[j] = T[j + 1] + (T[j + 1] - T[j]) / (ratio - 1.0);
    }
    if (prevTop !== null) {
      const err = Math.abs(T[0] - prevTop);
      if (err < bestErr) bestErr = err;
      if (err < 1e-14 * (Math.abs(T[0]) + 1e-30)) {
        return { y: T[0], err };
      }
    }
    prevTop = T[0];
  }
  return { y: T[0], err: bestErr };
}

// Integrate from d_min down to a small threshold with adaptive step control,
// then add the exact isolated-pair analytic tail (negligible, ~1e-6 of t_c).
function integrateCollision(dMin) {
  const TOL = 1e-13;
  const yThresh = 1e-3 * dMin; // stop before the singularity
  let tau = 0.0;
  let y = dMin;
  let H = (dMin * dMin) / 8.0 * 0.1; // initial guess ~ 10% of expected t_c
  let maxResidual = 0.0; // max |y^2 - (dMin^2 - 8 tau)| along the path
  let steps = 0;
  const HARD_CAP = 100000;
  while (y > yThresh && steps < HARD_CAP) {
    // shrink step if it would overshoot the threshold region
    if (y + H * f(y) < yThresh) H *= 0.5;
    const { y: yNew, err } = bulirschStoerStep(y, H);
    if (err > TOL * (Math.abs(yNew) + 1e-30) && H > 1e-18) {
      H *= 0.6; // reject, retry smaller
      continue;
    }
    y = yNew;
    tau += H;
    const residual = Math.abs(y * y - (dMin * dMin - 8.0 * tau));
    if (residual > maxResidual) maxResidual = residual;
    // grow step if comfortably under tolerance
    if (err < 0.1 * TOL * (Math.abs(y) + 1e-30)) H *= 1.5;
    steps++;
  }
  // Exact isolated-pair tail from y -> 0: remaining tau = y^2 / 8.
  const tauC = tau + (y * y) / 8.0;
  return { tauC, maxResidual, steps, yFinal: y };
}

// --- Empirical order check on the same flow (sanity: confirm high order) ---
// Compare BS single-step error scaling against a known-exact reference.
function orderCheck() {
  const y0 = 1.0;
  // exact: y(H) solves y^2 = y0^2 - 8H  => y = sqrt(1 - 8H)
  const H = 0.01;
  const exact = Math.sqrt(1.0 - 8.0 * H);
  const { y } = bulirschStoerStep(y0, H);
  return Math.abs(y - exact);
}

const res = integrateCollision(D_MIN);
const tcPairAnalytic = (D_MIN * D_MIN) / 8.0;

const relVsAnalytic = Math.abs(res.tauC - tcPairAnalytic) / tcPairAnalytic;
const relVsRK4 = Math.abs(res.tauC - TC_RK4) / TC_RK4;
const sigFigsVsRK4 = Math.max(0, Math.floor(-Math.log10(relVsRK4)));

console.log(JSON.stringify({
  method: 'Bulirsch-Stoer (Gragg modified-midpoint + polynomial Richardson extrapolation, effective order >= 8)',
  d_min: D_MIN,
  tcThirdIntegrator: res.tauC,
  tcPairAnalytic,
  tcRK4: TC_RK4,
  relVsAnalytic,
  relVsRK4,
  sigFigsVsRK4,
  maxPathResidual: res.maxResidual,
  steps: res.steps,
  singleStepErrorVsExact: orderCheck(),
}, null, 2));
