#!/usr/bin/env node
// scripts/imp-3917-per-term-majorant-crossvalidate.mjs
// imp-3917 OFFLINE COMPUTE: PER-TERM cross-validation of the imp-3898 rigorous
// path-local majorant
//     e_j := d ln t_j/dT = 8 P_j/D_j  <=  8 / s_min(j)^2
// against a directly MEASURED (centered finite-difference) per-term elasticity,
// term-by-term over every active term j on the representative [1e4,1e6] plateaus
// 0/4/9, at thetaBar=0.99 (T = H^2/(8*thetaBar)).
//
// imp-3898 proved the per-term majorant ANALYTICALLY and certified only the
// Psi-weighted AGGREGATE against imp-3874. imp-3874 baked only per-plateau
// aggregate scalars (logSensBase, sminBase); the per-term inequality was never
// confronted with measured per-term e_j. This script CLOSES that: it measures
// e_j by finite difference of ln t_j = -2 ln D_j and confirms
//     e_j^FD <= 8 / s_min(j)^2   for EVERY active term j,
// with the nearest single-gap terms (m_j = 1, path gaps g_{a-1}, g_{a+1}) TIGHT
// at e_j = 8/D_j^2 (ratio = 1), and flags any near-saturation term.
//
// SETTING (imp-3725 gap-domination bootstrap, unchanged):
//   s_l(T)  = sqrt(max(g_l(0)^2 - 8T, 0))
//   D_j(T)  = sum of s_l over the gap path from the record pair a outward to j
//   P_j(T)  = sum of 1/s_l over that path
//   s_min(j)= min of s_l over that path (running min, path-local smallest gap)
//   t_j     = 4 H^2 / D_j^2,   e_j = d ln t_j/dT = 8 P_j/D_j
// Per-term FD: ln t_j(T +- h) = const - 2 ln D_j(T +- h), so
//   e_j^FD = (ln D_j(T-h) - ln D_j(T+h)) / h    (centered, 4H^2 cancels).
//
// Run:  node_modules/.bin/esbuild scripts/imp-3917-per-term-majorant-crossvalidate.mjs \
//         --bundle --format=cjs --platform=node --outfile=/tmp/imp3917.cjs \
//       && node /tmp/imp3917.cjs

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const Z = ZEROS_EXTENDED;
const N_MIN = 10000;
const N_MAX = 1000000;

if (Z.length < N_MAX) throw new Error(`zero table too short: ${Z.length}`);

// gaps g[i] = Z[i+1] - Z[i], 0-indexed.
const G = new Float64Array(N_MAX - 1);
for (let i = 0; i < N_MAX - 1; i++) {
  const d = Z[i + 1] - Z[i];
  if (!(d > 0)) throw new Error(`non-positive gap at ${i}: ${d}`);
  G[i] = d;
}

// Reproduce the imp-3725 running-min plateau structure.
let H = Infinity;
let argmin = -1;
for (let i = 0; i < N_MIN - 1; i++) {
  if (G[i] < H) { H = G[i]; argmin = i; }
}
const plateaus = [{ plateauIndex: 0, startN: N_MIN, endN: null, H, a: argmin }];
for (let N = N_MIN + 1; N <= N_MAX; N++) {
  const i = N - 2;
  if (G[i] < H) {
    plateaus[plateaus.length - 1].endN = N - 1;
    H = G[i];
    plateaus.push({ plateauIndex: plateaus.length, startN: N, endN: null, H, a: i });
  }
}
plateaus[plateaus.length - 1].endN = N_MAX;

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

// s_l at three horizons (T, T+h, T-h) in one shot.
function shrunk(g, c8T) { const v = g * g - c8T; return v > 0 ? Math.sqrt(v) : 0; }

// PER-TERM cross-validation on one plateau at horizon T (thetaBar=0.99), with a
// centered relative step hRel for the per-term finite difference. Streams every
// active term j, tracking running D_j / P_j / s_min(j) at T and running
// D_j(T+h) / D_j(T-h) for the FD elasticity. Returns per-term aggregates only.
function crossValidate(p, T, hRel) {
  const { a, endN } = p;
  const h = hRel * T;
  const c8T = 8 * T, c8Tp = 8 * (T + h), c8Tm = 8 * (T - h);

  let active = 0;                 // number of active terms j scanned
  let allHold = true;             // every term satisfies e_j^FD <= 8/s_min(j)^2
  let allHoldAnalytic = true;     // every term satisfies e_j <= 8/s_min(j)^2
  let maxRatioFD = 0, argMaxRatioFD = -1;   // max e_j^FD / majorant_j
  let maxRatioAnalytic = 0;       // max e_j / majorant_j
  let maxFdVsAnalyticRel = 0;     // per-term FD vs analytic elasticity agreement
  let nearSat = 0;                // terms with ratio in (0.9, 1] (near-saturation)
  const nearest = [];             // the m_j=1 nearest single-gap terms (tightness)

  // One sweep helper over a directed path of gaps.
  function sweep(gapIndices) {
    let D = 0, P = 0, smin = Infinity;
    let Dp = 0, Dm = 0;           // D_j at T+h, T-h
    let firstOfPath = true;       // m_j = 1 marker (nearest single-gap term)
    for (const gi of gapIndices) {
      const sl = shrunk(G[gi], c8T);
      const slp = shrunk(G[gi], c8Tp);
      const slm = shrunk(G[gi], c8Tm);
      if (sl > 0) {
        D += sl; P += 1 / sl; if (sl < smin) smin = sl;
        if (slp > 0) Dp += slp;
        if (slm > 0) Dm += slm;
      }
      if (D <= 0) { firstOfPath = false; continue; }

      const eAnalytic = 8 * P / D;                 // exact per-term elasticity
      const eFD = (Math.log(Dm) - Math.log(Dp)) / h; // measured (centered FD)
      const majorant = 8 / (smin * smin);          // path-local majorant 8/s_min(j)^2

      const ratioFD = eFD / majorant;
      const ratioAnalytic = eAnalytic / majorant;
      active += 1;
      if (!(eFD <= majorant * (1 + 1e-9))) allHold = false;
      if (!(eAnalytic <= majorant * (1 + 1e-12))) allHoldAnalytic = false;
      if (ratioFD > maxRatioFD) { maxRatioFD = ratioFD; argMaxRatioFD = gi; }
      if (ratioAnalytic > maxRatioAnalytic) maxRatioAnalytic = ratioAnalytic;
      const fdRel = rel(eFD, eAnalytic);
      if (fdRel > maxFdVsAnalyticRel) maxFdVsAnalyticRel = fdRel;
      if (ratioFD > 0.9 && ratioFD <= 1.0 + 1e-9) nearSat += 1;

      if (firstOfPath) {
        // nearest single-gap term: D_j = s_l, s_min(j) = s_l = D_j, so the
        // majorant is TIGHT at 8/D_j^2 and ratio should equal 1.
        nearest.push({
          gapIndex: gi, Dj: +D.toExponential(8), sl: +sl.toExponential(8),
          eAnalytic: +eAnalytic.toExponential(8), eFD: +eFD.toExponential(8),
          majorant: +majorant.toExponential(8),
          ratioAnalytic: +ratioAnalytic.toExponential(8),
          ratioFD: +ratioFD.toExponential(8),
        });
        firstOfPath = false;
      }
    }
  }

  // left path: gaps a-1, a-2, ..., 0 (outward from the pair, decreasing index)
  const left = [];
  for (let gi = a - 1; gi >= 0; gi--) left.push(gi);
  sweep(left);
  // right path: gaps a+1, a+2, ..., endN-2 (outward, increasing index)
  const right = [];
  for (let gi = a + 1; gi <= endN - 2; gi++) right.push(gi);
  sweep(right);

  return {
    active, allHold, allHoldAnalytic,
    maxRatioFD, argMaxRatioFD, maxRatioAnalytic, maxFdVsAnalyticRel,
    nearSat, nearest,
  };
}

const TARGET = [0, 4, 9];
const out = [];
for (const pi of TARGET) {
  const p = plateaus[pi];
  const thetaBar = 0.99;
  const T = (p.H * p.H) / (8 * thetaBar);
  const r = crossValidate(p, T, 1e-6);
  // Dmin = min over the two nearest single-gap terms (should match imp-3898 Dmin).
  const Dmin = Math.min(...r.nearest.map((n) => n.Dj));
  out.push({
    plateauIndex: pi, startN: p.startN, endN: p.endN, H: +p.H.toFixed(8), a: p.a,
    thetaBar, activeTerms: r.active,
    allHoldFD: r.allHold, allHoldAnalytic: r.allHoldAnalytic,
    maxRatioFD: +r.maxRatioFD.toExponential(8),
    maxRatioAnalytic: +r.maxRatioAnalytic.toExponential(8),
    argMaxRatioFDGap: r.argMaxRatioFD,
    maxFdVsAnalyticRel: +r.maxFdVsAnalyticRel.toExponential(4),
    nearSaturationTerms: r.nearSat,
    Dmin: +Dmin.toExponential(8),
    nearest: r.nearest,
  });
}

console.log('=== imp-3917 PER-TERM path-local majorant cross-validation ===\n');
for (const r of out) {
  console.log(
    `plateau ${r.plateauIndex} [${r.startN},${r.endN}] H=${r.H} a=${r.a} ` +
    `activeTerms=${r.activeTerms}`,
  );
  console.log(
    `  allHoldFD=${r.allHoldFD} allHoldAnalytic=${r.allHoldAnalytic} ` +
    `maxRatioFD=${r.maxRatioFD} maxRatioAnalytic=${r.maxRatioAnalytic} ` +
    `maxFdVsAnalyticRel=${r.maxFdVsAnalyticRel} nearSat=${r.nearSaturationTerms} ` +
    `Dmin=${r.Dmin}`,
  );
  for (const n of r.nearest) {
    console.log(
      `  nearest gap=${n.gapIndex} Dj=${n.Dj} eA=${n.eAnalytic} eFD=${n.eFD} ` +
      `majorant=${n.majorant} ratioA=${n.ratioAnalytic} ratioFD=${n.ratioFD}`,
    );
  }
  console.log('');
}

console.log('===JSON===');
console.log(JSON.stringify({ thetaBar: 0.99, fdRelStep: 1e-6, rows: out }, null, 1));
