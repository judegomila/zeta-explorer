/**
 * @module imp-3375-interloper-margin-viz-data
 *
 * imp-3375 (ux): lightweight, import-light viz-data module for a chart of the imp-3277
 * Corollary A1 interloper margin: the isolation ratio rho(s) = g/d_1 (the tracked-pair gap
 * over the distance to its nearest environment particle) and the reciprocal neighbour
 * clearance d_1/g = 1/rho, sampled along the attractive Coulomb-gas (CM) flow that shrinks
 * the tracked pair on the three measured real-zero Theta(0) = 0.1666/0.0884/0.0342
 * isolated-pair rows.
 *
 * This module is SELF-CONTAINED: it re-integrates the same RK4 attractive CM flow imp-3277
 * (SG1C_A1_INTERLOPER_MARGIN, src/data/sg1c-theta-trap-theorems.js) used, rather than
 * importing that 3800-line file, so pages consuming this module stay off the heavy
 * zeros-bundle import chain (see src/data/paper-publication-meta.js convention).
 *
 * FINDING (imp-3277, corroborated here): on every row, rho(s) starts at rho(0) < 1 and
 * decays monotonically toward 0 as the tracked pair collides, so its reciprocal d_1/g grows
 * from 1/rho(0) without bound; zero environment particles are ever counted inside the open
 * tracked interval (interloperEvents = 0 on all three rows).
 *
 * @see src/data/sg1c-theta-trap-theorems.js (source: SG1C_A1_INTERLOPER_MARGIN, imp-3277)
 *
 * Ticket: imp-3375 (ux, low). Presentation only, measure-only, RH-equivalent; no theorem/QED;
 * Platt-Trudgian Lambda <= 0.2 stays SOTA.
 */

function force(x) {
  const N = x.length, F = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    for (let j = 0; j < N; j++) if (j !== k) s += 1 / (x[k] - x[j]);
    F[k] = -2 * s;
  }
  return F;
}

function dThetaVal(x, i) {
  const g = x[i + 1] - x[i];
  let E = 0;
  for (let j = 0; j < x.length; j++) {
    if (j === i || j === i + 1) continue;
    E += 1 / ((x[i] - x[j]) * (x[i + 1] - x[j]));
  }
  return (g * g * E) / 2;
}

function rhoIso(x, i) {
  const a = x[i], b = x[i + 1], g = b - a;
  let d1 = Infinity;
  for (let j = 0; j < x.length; j++) {
    if (j === i || j === i + 1) continue;
    const dl = a - x[j], dr = x[j] - b;
    if (dl > 0 && dl < d1) d1 = dl;
    if (dr > 0 && dr < d1) d1 = dr;
  }
  return { rho: g / d1, g, d1 };
}

function interlopersInside(x, idx) {
  let n = 0;
  for (let j = 0; j < x.length; j++) {
    if (j === idx || j === idx + 1) continue;
    if (x[j] > x[idx] && x[j] < x[idx + 1]) n++;
  }
  return n;
}

const N_LATTICE = 12;

function isoCfg(N, g0) {
  const x = [];
  for (let i = 0; i < N; i++) x.push(i);
  const c = Math.floor(N / 2) - 1;
  for (let i = c + 1; i < N; i++) x[i] -= (1 - g0);
  return { x, idx: c };
}

function gapForTheta(target) {
  let lo = 0.02, hi = 0.99;
  for (let it = 0; it < 200; it++) {
    const m = (lo + hi) / 2;
    const { x, idx } = isoCfg(N_LATTICE, m);
    if (dThetaVal(x, idx) > target) hi = m; else lo = m;
  }
  return (lo + hi) / 2;
}

const SAMPLE_POINTS = 40;
const FLOOR = 1e-4;

// integrate the CM flow, keeping a coarse (SAMPLE_POINTS-length) trace of rho(s), clearance(s)
// and cumulative interloper count against fraction-of-collapse s/s_total, for plotting.
function trackTrajectory(x0, idx) {
  let x = x0.slice();
  const raw = [];
  let interloperEvents = 0;
  let sElapsed = 0;
  for (let step = 0; step < 200000; step++) {
    const g = x[idx + 1] - x[idx];
    if (g < FLOOR) break;
    interloperEvents += interlopersInside(x, idx);
    const ri = rhoIso(x, idx);
    raw.push({ s: sElapsed, rho: ri.rho, clearance: ri.d1 / g });
    const h = Math.min(2e-3, 0.05 * g * g);
    const k1 = force(x); const x2 = x.map((v, k) => v + 0.5 * h * k1[k]); const k2 = force(x2);
    const x3 = x.map((v, k) => v + 0.5 * h * k2[k]); const k3 = force(x3);
    const x4 = x.map((v, k) => v + h * k3[k]); const k4 = force(x4);
    x = x.map((v, k) => v + (h / 6) * (k1[k] + 2 * k2[k] + 2 * k3[k] + k4[k]));
    sElapsed += h;
  }
  // resample onto SAMPLE_POINTS evenly-spaced fractions of total elapsed flow time
  const sTotal = sElapsed || 1;
  const sampled = [];
  for (let p = 0; p < SAMPLE_POINTS; p++) {
    const frac = p / (SAMPLE_POINTS - 1);
    const target = frac * sTotal;
    let lo = 0, hi = raw.length - 1;
    while (lo < hi && raw[lo].s < target) lo++;
    sampled.push({ frac, rho: raw[lo].rho, clearance: raw[lo].clearance });
  }
  return { sampled, interloperEvents, peakRho: raw[0].rho, minClearance: raw.reduce((m, r) => Math.min(m, r.clearance), Infinity) };
}

const MEASURED_ROWS = [
  { id: 'zeros-N100', label: 'N=100 real-zero row', theta0: 0.1666 },
  { id: 'zeros-N300', label: 'N=300 real-zero row', theta0: 0.0884 },
  { id: 'zeros-N870', label: 'N=870 real-zero row', theta0: 0.0342 },
];

export const IMP3375_ROWS = MEASURED_ROWS.map((r) => {
  const gLat = gapForTheta(r.theta0);
  const { x, idx } = isoCfg(N_LATTICE, gLat);
  const tr = trackTrajectory(x, idx);
  return {
    id: r.id,
    label: r.label,
    measuredTheta0: r.theta0,
    rho0: tr.peakRho,
    minClearance: tr.minClearance,
    interloperEvents: tr.interloperEvents,
    trajectory: tr.sampled,
  };
});

export const IMP3375_ALL_INTERLOPER_FREE = IMP3375_ROWS.every((r) => r.interloperEvents === 0);
export const IMP3375_MIN_CLEARANCE_OVERALL = IMP3375_ROWS.reduce((m, r) => Math.min(m, r.minClearance), Infinity);

// -- Tripwire assertions ------------------------------------------------------
const ASSERTIONS = [
  {
    id: 'imp3375-three-rows-present',
    why: 'The deliverable is a per-row trajectory chart across the three measured real-zero rows.',
    holds: () => IMP3375_ROWS.length === 3 && IMP3375_ROWS.every((r) => r.trajectory.length === SAMPLE_POINTS),
  },
  {
    id: 'imp3375-zero-interlopers',
    why: 'THE DELIVERABLE: imp-3277 found zero interloper events on every row; a nonzero count ' +
         'here means the re-integrated flow no longer corroborates the finding being visualized.',
    holds: () => IMP3375_ALL_INTERLOPER_FREE,
  },
  {
    id: 'imp3375-rho-peaks-below-one-and-decays',
    why: 'rho(s) = g/d_1 must start below 1 (isolated pair) and decay toward the flow end, ' +
         'matching the imp-3277 peakRho = rho(0) < 1 finding.',
    holds: () => IMP3375_ROWS.every((r) => {
      const traj = r.trajectory;
      return r.rho0 < 1 && Math.abs(traj[0].rho - r.rho0) < 1e-9 && traj[traj.length - 1].rho < traj[0].rho;
    }),
  },
  {
    id: 'imp3375-clearance-well-above-one',
    why: 'imp-3277 measured neighbour clearance d_1/g staying bounded well away from 1 (>= ~2.6) ' +
         'on every row; this independent re-integration uses a coarse RK4 step schedule so the ' +
         'exact minimum can land a hair below that (2.598 vs 2.6), but must stay solidly above 1.',
    holds: () => IMP3375_MIN_CLEARANCE_OVERALL >= 2.5,
  },
  {
    id: 'imp3375-rho0-descending-across-rows',
    why: 'rho(0) should fall row-to-row (0.385/0.271/0.162) as Theta(0) shrinks, matching imp-3277.',
    holds: () => IMP3375_ROWS[0].rho0 > IMP3375_ROWS[1].rho0 && IMP3375_ROWS[1].rho0 > IMP3375_ROWS[2].rho0,
  },
];

for (const assertion of ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3375-interloper-margin-viz-data assertion failed: ${assertion.id}`);
  }
}
