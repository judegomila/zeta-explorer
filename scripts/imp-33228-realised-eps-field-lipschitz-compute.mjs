#!/usr/bin/env node
// scripts/imp-33228-realised-eps-field-lipschitz-compute.mjs
// imp-33228 OFFLINE COMPUTE: measure a NUMERICAL eps'_true proxy for the
// imp-3933 field-robust bootstrap directly on the real Odlyzko zero table.
//
// imp-3933 carried an ASSUMED local-difference (field-Lipschitz) bound
//     |e_{l+1}(t) - e_l(t)| <= eps'_l * g_l(t)               (*)
// on the field error e_k = E(x_k,t) that the window-Dyson model omits, and
// certified all 10 plateaus of [1e4,1e6] with plenty of headroom (uniform
// eps'Max floor 22.9 on plateau0, up to 1216.6 on the deepest plateau). The
// sub-eps-certificate residual (imp-3933-sub-eps-certificate) only ESTIMATED
// the realised eps'_l (O(1e-3) near the record pair, O(10) at the window edge)
// and never measured it. This script measures it.
//
// WHAT THE OMITTED FIELD IS. The window model keeps only the positive-ordinate
// zeros inside the plateau window [1,endN]. Relative to the true xi backward-
// heat (Dyson/Calogero) field  F(g) = SUM_zeros 2/(g - x_zero), the omitted
// error at a within-window zero g = gamma_k has two pieces:
//   (M) MIRROR PAIRING: the conjugate zeros at -gamma_j (xi zeros come in
//       +-gamma pairs), contributing SUM_j 2/(gamma_k + gamma_j);
//   (T) ABOVE-WINDOW TAIL: the positive zeros with index > endN, contributing
//       SUM_{j>endN} 2/(gamma_k - gamma_j), modelled by the Riemann-von-Mangoldt
//       density rho(u) = (1/2pi) log(u/2pi).
//
// WHY THE LOCAL DIFFERENCE IS WELL DEFINED (the field itself is not). Each of
// (M),(T) is only conditionally convergent as a bare field, BUT the quantity
// (*) bounds is the LOCAL DIFFERENCE e_{l+1}-e_l, which is ABSOLUTELY convergent
// and the leading 1/g_l cancels EXACTLY:
//   eps'_l^{tail} = |E_tail(gamma_{l+1})-E_tail(gamma_l)| / g_l
//                 = INT_{W*}^{inf} 2 rho(u) / [(u-gamma_{l+1})(u-gamma_l)] du,
//   eps'_l^{mir}  = |E_mir(gamma_{l+1})-E_mir(gamma_l)| / g_l
//                 = INT_{0}^{inf}  2 rho(u) / [(gamma_{l+1}+u)(gamma_l+u)] du,
// using  1/(x-b) - 1/(x-a) = (b-a)/[(x-b)(x-a)]  and b-a = g_l. Both integrands
// decay like log(u)/u^2 -> the integrals converge with NO regularisation. The
// realised field-Lipschitz constant is eps'_l = eps'_l^{tail} + eps'_l^{mir},
// evaluated with the EXACT table ordinates gamma_l = Z[l], gamma_{l+1} = Z[l+1].
//
// W* = gamma_endN + 0.5/rho(gamma_endN): the first omitted zero sits about half
// a mean spacing above the window top; starting the RvM continuum at the top
// ordinate itself would introduce a spurious log singularity at the very top
// gap. This half-spacing midpoint offset keeps the top-edge value finite and
// is the standard RvM discretisation correction (documented, not hidden).
//
// Run:  node_modules/.bin/esbuild scripts/imp-33228-realised-eps-field-lipschitz-compute.mjs \
//         --bundle --format=cjs --platform=node --outfile=/tmp/imp33228.cjs \
//       && node /tmp/imp33228.cjs

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';

const Z = ZEROS_EXTENDED;
const N_MIN = 10000;
const N_MAX = 1000000;
const THETA_BAR = 0.99;
const INFLATE = 1 + 1e-6;
const TWO_PI = 2 * Math.PI;

if (Z.length < N_MAX) throw new Error(`zero table too short: ${Z.length}`);

const G = new Float64Array(N_MAX - 1);
for (let i = 0; i < N_MAX - 1; i++) {
  const d = Z[i + 1] - Z[i];
  if (!(d > 0)) throw new Error(`non-positive gap at ${i}: ${d}`);
  G[i] = d;
}

// RvM density rho(u) = (1/2pi) log(u/2pi)  (zeros per unit height at ordinate u)
function rho(u) {
  return Math.log(u / TWO_PI) / TWO_PI;
}

// ---- plateaus: identical running-min scan to imp-3725/imp-3933 ----
let H = Infinity;
let argmin = -1;
for (let i = 0; i < N_MIN - 1; i++) if (G[i] < H) { H = G[i]; argmin = i; }
const updates = [];
for (let N = N_MIN + 1; N <= N_MAX; N++) {
  const i = N - 2;
  if (G[i] < H) { H = G[i]; updates.push({ N, gapIndex: i, H: G[i] }); }
}
const plateaus = [{
  plateauIndex: 0, startN: N_MIN,
  endN: updates.length ? updates[0].N - 1 : N_MAX,
  H: G.slice(0, N_MIN - 1).reduce((m, v) => Math.min(m, v), Infinity), a: argmin,
}];
updates.forEach((u, i) => {
  plateaus.push({
    plateauIndex: i + 1, startN: u.N,
    endN: i + 1 < updates.length ? updates[i + 1].N - 1 : N_MAX,
    H: u.H, a: u.gapIndex,
  });
});

// ---- imp-3933 uniform eps'Max (theta bisection), recomputed for the comparison ----
function shrunkSq(g, T, eps) {
  if (eps === 0) return g * g - 8 * T;
  const oneMinusE = -Math.expm1(-2 * eps * T);
  return g * g * (1 - oneMinusE) - (4 / eps) * oneMinusE;
}
function psiOf(p, T, eps) {
  const { a, endN } = p;
  const s = (g) => { const v = shrunkSq(g, T, eps); return v > 0 ? Math.sqrt(v) : 0; };
  let sum = 0, D = 0;
  for (let j = a - 1; j >= 0; j--) { D += s(G[j]); if (D <= 0) return null; sum += 1 / (D * D); }
  D = 0;
  for (let j = a + 2; j <= endN - 1; j++) { D += s(G[j - 1]); if (D <= 0) return null; sum += 1 / (D * D); }
  return 4 * p.H * p.H * sum * INFLATE;
}
function certifiedAt(p, eps) {
  const h = p.H, T = (h * h) / (8 * THETA_BAR);
  const psi = psiOf(p, T, eps);
  if (psi === null) return false;
  return 1 - (psi + 2 * eps * h * h) / 8 >= THETA_BAR;
}
function epsMaxOf(p) {
  let lo = 0, hi = 4000;
  if (certifiedAt(p, hi)) return hi;
  for (let it = 0; it < 60; it++) { const m = (lo + hi) / 2; if (certifiedAt(p, m)) lo = m; else hi = m; }
  return lo;
}

// ---- realised eps'_l: convergent RvM integrals, exact-cancelled 1/g_l ----
// Simpson on the log substitution u = base*exp(s); integrand*du = f(u)*u.
function simpsonLog(f, base, sLo, sHi, n) {
  if (n % 2) n++;
  const hstep = (sHi - sLo) / n;
  let acc = 0;
  for (let k = 0; k <= n; k++) {
    const s = sLo + k * hstep;
    const u = base * Math.exp(s);
    const w = (k === 0 || k === n) ? 1 : (k % 2 ? 4 : 2);
    acc += w * f(u) * u; // * u from du = u ds
  }
  return acc * hstep / 3;
}
// tail: INT_{W*}^{inf} 2 rho(u) / [(u-b)(u-a)] du,  a=gamma_l < b=gamma_{l+1} <= W*.
// Substitution  p = 1/(u-a),  then  p = p0 * t^2  with p0 = 1/(W*-a), t in [0,1]:
//   integrand du -> 2 rho(u)/(1 - g p) * (2 p0 t) dt,  g = b-a.
// This maps the u=W* lower limit (where u-b can be O(spacing) for edge gaps) to
// t=1 -- densely resolved -- and the u=inf tail (where rho grows like log u) to
// t=0, where the Jacobian factor t kills the integrable log singularity (-> 0).
// No spurious edge spike, no near-singular under-resolution.
function epsTail(a, b, Wstar) {
  const g = b - a;
  const p0 = 1 / (Wstar - a);
  const n = 8000;
  const hstep = 1 / n;
  let acc = 0;
  for (let k = 0; k <= n; k++) {
    const t = k * hstep;
    let val;
    if (t === 0) {
      val = 0; // Jacobian t -> 0 dominates rho(u->inf) log growth
    } else {
      const p = p0 * t * t;
      const u = a + 1 / p;
      val = (2 * rho(u) / (1 - g * p)) * (2 * p0 * t); // * dp/dt = 2 p0 t
    }
    const w = (k === 0 || k === n) ? 1 : (k % 2 ? 4 : 2);
    acc += w * val;
  }
  return acc * hstep / 3;
}
// mirror: INT_{0}^{inf} 2 rho(u) / [(b+u)(a+u)] du  (a,b ~ 6e5; u<2pi region negligible)
function epsMir(a, b) {
  const base = a;
  return simpsonLog((u) => 2 * rho(u) / ((b + u) * (a + u)), base, -30, 25, 6000);
}

// sampled gap indices in [aIdx, topGap]: record pair, top 24 edge gaps, log-spaced interior.
function sampleGaps(aIdx, topGap) {
  const set = new Set([aIdx]);
  for (let d = 0; d < 24 && topGap - d >= aIdx; d++) set.add(topGap - d);
  const span = topGap - aIdx;
  if (span > 0) {
    const M = Math.min(240, span);
    for (let k = 0; k <= M; k++) {
      const frac = k / M;
      const idx = aIdx + Math.round(span * frac * frac); // denser toward the top edge
      if (idx >= aIdx && idx <= topGap) set.add(idx);
    }
  }
  return [...set].sort((x, y) => x - y);
}

const results = plateaus.map((p) => {
  const topGap = p.endN - 2;            // 0-based gap index of the top window gap
  const W = Z[p.endN - 1];              // top ordinate gamma_endN
  const Wstar = W + 0.5 / rho(W);       // first omitted zero, half-spacing midpoint
  const epsMax = epsMaxOf(p);

  const epsAt = (l) => {
    const a = Z[l], b = Z[l + 1];
    const t = epsTail(a, b, Wstar);
    const m = epsMir(a, b);
    return { l, tail: t, mir: m, tot: t + m, distTop: W - b };
  };

  const recIdx = Math.min(Math.max(p.a, 0), topGap);
  const rec = epsAt(recIdx);

  let maxRow = rec;
  for (const l of sampleGaps(recIdx, topGap)) {
    const r = epsAt(l);
    if (r.tot > maxRow.tot) maxRow = r;
  }
  const edge = epsAt(topGap);

  return {
    plateauIndex: p.plateauIndex, startN: p.startN, endN: p.endN, H: p.H, a: p.a,
    W, Wstar, epsMax,
    recordEps: rec.tot, recordTail: rec.tail, recordMir: rec.mir, recordDistTop: rec.distTop,
    maxEps: maxRow.tot, maxEpsGap: maxRow.l, maxEpsDistTop: maxRow.distTop,
    edgeEps: edge.tot,
    headroomRecord: epsMax / rec.tot,
    headroomMax: epsMax / maxRow.tot,
    floorHeadroomMax: 22.9 / maxRow.tot, // vs the uniform eps'Max floor
  };
});

for (const r of results) {
  console.log(`plateau ${r.plateauIndex} [${r.startN},${r.endN}] H=${r.H.toFixed(8)} a=${r.a} W=${r.W.toFixed(3)}`);
  console.log(`  RECORD-PAIR realised eps'_a = ${r.recordEps.toExponential(4)} (tail ${r.recordTail.toExponential(3)} + mir ${r.recordMir.toExponential(3)}; dist-to-top ${r.recordDistTop.toFixed(1)})`);
  console.log(`  WINDOW-MAX realised eps'   = ${r.maxEps.toExponential(4)} at gap ${r.maxEpsGap} (dist-to-top ${r.maxEpsDistTop.toFixed(2)});  top-gap eps' = ${r.edgeEps.toExponential(4)}`);
  console.log(`  certified uniform eps'Max = ${r.epsMax.toFixed(3)};  headroom(record)=${r.headroomRecord.toExponential(3)}x  headroom(window-max)=${r.headroomMax.toExponential(3)}x`);
}

const maxRecord = Math.max(...results.map((r) => r.recordEps));
const maxWindow = Math.max(...results.map((r) => r.maxEps));
const minEpsMax = Math.min(...results.map((r) => r.epsMax));
const minHeadroomMax = Math.min(...results.map((r) => r.headroomMax));
const windowMaxUnderFloor = maxWindow < 22.9;

console.log('\n=== SUMMARY (realised field-Lipschitz eps_true proxy vs certified headroom) ===');
console.log('max record-pair realised eps\'_a over plateaus :', maxRecord.toExponential(4),
            '  (module estimate was O(1e-3))');
console.log('max window realised eps\' over plateaus (edge) :', maxWindow.toExponential(4),
            '  (module estimate was O(10) at window edge)');
console.log('min certified uniform eps\'Max over plateaus   :', minEpsMax.toFixed(3), '(floor 22.9)');
console.log('WINDOW-MAX realised eps\' < 22.9 eps\'Max FLOOR :', windowMaxUnderFloor);
console.log('min headroom (window-max) over plateaus       :', minHeadroomMax.toExponential(4), 'x');

console.log('\n===JSON===');
console.log(JSON.stringify({
  thetaBar: THETA_BAR,
  maxRecordEps: +maxRecord.toExponential(6),
  maxWindowEps: +maxWindow.toExponential(6),
  minEpsMax: +minEpsMax.toFixed(4),
  minHeadroomMax: +minHeadroomMax.toExponential(6),
  windowMaxUnderFloor,
  results: results.map((r) => ({
    plateauIndex: r.plateauIndex, startN: r.startN, endN: r.endN,
    H: +r.H.toFixed(8), a: r.a, W: +r.W.toFixed(4),
    recordEps: +r.recordEps.toExponential(6),
    maxEps: +r.maxEps.toExponential(6), maxEpsGap: r.maxEpsGap,
    edgeEps: +r.edgeEps.toExponential(6),
    epsMax: +r.epsMax.toFixed(4),
    headroomRecord: +r.headroomRecord.toExponential(6),
    headroomMax: +r.headroomMax.toExponential(6),
  })),
}, null, 1));
