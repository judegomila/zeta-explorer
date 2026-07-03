#!/usr/bin/env node
// scripts/imp-3728-thetabar-sensitivity-compute.mjs
// imp-3728 OFFLINE MEASUREMENT: sensitivity of the imp-3725 certified F_mb /
// K_paper enclosure to the FREE frozen-horizon parameter thetaBar in (0,1).
//
// The imp-3725 lemma fixes T = H^2/(8*thetaBar) and certifies, whenever the
// bootstrap self-consistency theta_N(thetaBar) >= thetaBar holds,
//   0 <= F_mb(N) <= (H^2/8)(1/theta_N - 1),  theta_N = 1 - Psi_N(T)/8,
//   Psi_N(T) = 4 H^2 * sum_j 1/D_j(T)^2,  s_l(T) = sqrt(max(g_l^2 - 8T, 0)).
// imp-3725 evaluated ONE thetaBar per plateau (the first of a coarse ladder
// that certified, always 0.99). This script MEASURES how the certified
// enclosure moves as thetaBar sweeps (0,1) and LOCATES the K_paper-minimizing
// thetaBar per plateau.
//
// Monotonicity fact (proven, not assumed): increasing thetaBar shrinks T, so
// every frozen gap s_l(T) is nondecreasing, every D_j(T) nondecreasing, hence
// Psi_N(T) is nonincreasing and theta_N(thetaBar) is nondecreasing. Since
// theta_N < 1 always (Psi > 0) while the constraint line thetaBar rises to 1,
// the feasible set is thetaBar <= thetaBar*, the unique fixed point
// theta_N(thetaBar*) = thetaBar*. K_paper is decreasing in theta_N, so the
// K_paper MINIMUM over the feasible set is attained at thetaBar = thetaBar*.
// This is a MEASUREMENT on the existing lemma: no ODE, no new Lambda bound,
// NO QED. imp-3066 UNTOUCHED; Platt-Trudgian Lambda <= 0.2 stays SOTA.
//
// Run:  node_modules/.bin/esbuild scripts/imp-3728-thetabar-sensitivity-compute.mjs \
//         --bundle --format=cjs --platform=node --outfile=/tmp/imp3728.cjs \
//       && node /tmp/imp3728.cjs

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const Z = ZEROS_EXTENDED;
const N_MIN = 10000;
const N_MAX = 1000000;
const RHO_FLOOR = 0.12751;
const INFLATE = 1 + 1e-6; // same conservative fp inflation as imp-3725

if (Z.length < N_MAX) throw new Error(`zero table too short: ${Z.length}`);

const G = new Float64Array(N_MAX - 1);
for (let i = 0; i < N_MAX - 1; i++) {
  const d = Z[i + 1] - Z[i];
  if (!(d > 0)) throw new Error(`non-positive gap at ${i}: ${d}`);
  G[i] = d;
}

// Rebuild the plateau structure exactly as imp-3725 does.
let H = Infinity;
let argmin = -1;
for (let i = 0; i < N_MIN - 1; i++) {
  if (G[i] < H) { H = G[i]; argmin = i; }
}
const anchorH = H;
const anchorArgmin = argmin;
const updates = [];
for (let N = N_MIN + 1; N <= N_MAX; N++) {
  const i = N - 2;
  if (G[i] < H) { H = G[i]; updates.push({ N, gapIndex: i, H: G[i] }); }
}
const plateaus = [];
plateaus.push({ plateauIndex: 0, startN: N_MIN, endN: updates.length ? updates[0].N - 1 : N_MAX, H: anchorH, a: anchorArgmin });
updates.forEach((u, i) => {
  plateaus.push({ plateauIndex: i + 1, startN: u.N, endN: i + 1 < updates.length ? updates[i + 1].N - 1 : N_MAX, H: u.H, a: u.gapIndex });
});

// theta_N(thetaBar) for a plateau: returns {theta, psiEnd} or null if a D_j
// degenerates to 0 (frozen horizon so large a whole gap-path collapses).
function thetaOf(p, thetaBar) {
  const { a, H: h, endN } = p;
  const T = (h * h) / (8 * thetaBar);
  const c8T = 8 * T;
  const s = (g) => { const v = g * g - c8T; return v > 0 ? Math.sqrt(v) : 0; };
  let sumEnd = 0;
  let D = 0;
  for (let j = a - 1; j >= 0; j--) {
    D += s(G[j]);
    if (D <= 0) return null;
    sumEnd += 1 / (D * D);
  }
  D = 0;
  for (let j = a + 2; j <= endN - 1; j++) {
    D += s(G[j - 1]);
    if (D <= 0) return null;
    sumEnd += 1 / (D * D);
  }
  const psiEnd = 4 * h * h * sumEnd * INFLATE;
  return { theta: 1 - psiEnd / 8, psiEnd };
}

function boundsAt(p, thetaBar, theta) {
  const { H: h, endN } = p;
  const FmbUpper = ((h * h) / 8) * (1 / theta - 1);
  const KrawBound = FmbUpper * h * (Math.sqrt(endN) / Math.log(endN));
  const KpaperBound = KrawBound / RHO_FLOOR;
  return { thetaBar, theta, psiEnd: 8 * (1 - theta), FmbUpper, RrelUpper: 1 / theta - 1, KrawBound, KpaperBound };
}

// Locate thetaBar* = fixed point theta_N(thetaBar*) = thetaBar* by bisection
// on f(tb) = thetaOf(tb).theta - tb. f is decreasing (theta_N up, tb up faster
// near the top); feasible = f >= 0. Search the largest feasible tb.
function fixedPoint(p) {
  const g = (tb) => { const r = thetaOf(p, tb); return r ? r.theta - tb : -Infinity; };
  let lo = 0.5;      // known-feasible (theta approx 1 >> 0.5)
  let hi = 0.999999; // near the T -> H^2/8 wall
  if (g(lo) < 0) return null; // should not happen on these plateaus
  // If even hi is feasible, the wall is above our search; clamp to hi.
  if (g(hi) >= 0) { const r = thetaOf(p, hi); return { thetaStar: hi, theta: r.theta }; }
  for (let it = 0; it < 80; it++) {
    const mid = 0.5 * (lo + hi);
    if (g(mid) >= 0) lo = mid; else hi = mid;
  }
  const r = thetaOf(p, lo);
  return { thetaStar: lo, theta: r.theta };
}

const SAMPLE_TB = [0.5, 0.75, 0.9, 0.95, 0.99, 0.995, 0.999];

console.log('imp-3728 thetaBar sensitivity of the imp-3725 F_mb / K_paper enclosure');
console.log('anchor H at N=1e4:', anchorH, 'argmin:', anchorArgmin, 'updates:', updates.length);
console.log('');

const perPlateau = [];
for (const p of plateaus) {
  // baseline: imp-3725 headline choice thetaBar = 0.99
  const base = thetaOf(p, 0.99);
  const baseB = base ? boundsAt(p, 0.99, base.theta) : null;
  // optimum: max feasible thetaBar (fixed point)
  const fp = fixedPoint(p);
  const opt = fp ? boundsAt(p, fp.thetaStar, fp.theta) : null;
  // sensitivity samples
  const samples = SAMPLE_TB.map((tb) => {
    const r = thetaOf(p, tb);
    if (!r || r.theta < tb) return { thetaBar: tb, feasible: false };
    return { ...boundsAt(p, tb, r.theta), feasible: true };
  });
  perPlateau.push({ p, baseB, fp, opt, samples });

  console.log(`plateau ${p.plateauIndex} [${p.startN},${p.endN}] H=${p.H.toFixed(8)} a=${p.a}`);
  if (baseB) console.log(`  thetaBar=0.99 (imp-3725): theta=${baseB.theta.toFixed(8)} Kpaper<=${baseB.KpaperBound.toExponential(4)}`);
  if (opt) console.log(`  thetaBar*=${fp.thetaStar.toFixed(6)} (K-min): theta=${opt.theta.toFixed(8)} Kpaper<=${opt.KpaperBound.toExponential(4)}  improveVs0.99=${(baseB.KpaperBound / opt.KpaperBound).toFixed(3)}x`);
  const line = samples.map((sm) => sm.feasible ? `${sm.thetaBar}:${sm.KpaperBound.toExponential(2)}` : `${sm.thetaBar}:INFEASIBLE`).join('  ');
  console.log(`  sweep Kpaper: ${line}`);
}

const baseMax = Math.max(...perPlateau.map((x) => x.baseB.KpaperBound));
const optMax = Math.max(...perPlateau.map((x) => x.opt.KpaperBound));
console.log('');
console.log('sup Kpaper over [1e4,1e6] at thetaBar=0.99 :', baseMax.toExponential(6));
console.log('sup Kpaper over [1e4,1e6] at thetaBar*     :', optMax.toExponential(6));
console.log('additional margin from optimizing thetaBar :', (baseMax / optMax).toFixed(4), 'x');
console.log('carryforward K=0.2014 margin at thetaBar*   :', (0.2014 / optMax).toExponential(4), 'x');

// JSON dump for baking
console.log('\n===JSON===');
console.log(JSON.stringify({
  baselineThetaBar: 0.99,
  supKpaperBaseline: +baseMax.toExponential(8),
  supKpaperOptimal: +optMax.toExponential(8),
  extraMarginFromThetaBar: +(baseMax / optMax).toFixed(6),
  carryforwardMarginOptimal: +(0.2014 / optMax).toExponential(6),
  rows: perPlateau.map((x) => ({
    plateauIndex: x.p.plateauIndex,
    startN: x.p.startN,
    endN: x.p.endN,
    H: +x.p.H.toFixed(8),
    a: x.p.a,
    thetaBarBaseline: 0.99,
    thetaBaseline: +x.baseB.theta.toFixed(10),
    KpaperBaseline: +x.baseB.KpaperBound.toExponential(8),
    thetaBarStar: +x.fp.thetaStar.toFixed(8),
    thetaStar: +x.opt.theta.toFixed(10),
    FmbUpperStar: +x.opt.FmbUpper.toExponential(8),
    RrelUpperStar: +x.opt.RrelUpper.toExponential(8),
    KrawBoundStar: +x.opt.KrawBound.toExponential(8),
    KpaperBoundStar: +x.opt.KpaperBound.toExponential(8),
    improveFactor: +(x.baseB.KpaperBound / x.opt.KpaperBound).toFixed(6),
  })),
}, null, 1));
