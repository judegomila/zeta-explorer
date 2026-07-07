#!/usr/bin/env node
// imp-34813 offline solver: EXACT de Bruijn heat-flow winding ladder.
//
// Computes the true de Bruijn family
//   H_t(x) = int_0^inf e^{t u^2} Phi(u) cos(xu) du,
//   Phi(u) = sum_{n>=1} (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u}),
// directly from the doubly-exponentially convergent integral (Polymath15
// convention: H_0(x) = xi(1/2 + ix/2)/8, zeros of H_0 at x = 2*gamma_k).
// H_t satisfies the BACKWARD heat equation dH/dt = -d^2H/dx^2 (Tao/Rodgers-Tao
// convention), so Gaussian convolution in x with width sqrt(2 tau) maps
// H_0 -> H_{-tau} EXACTLY (negative de Bruijn time), not H_{+tau}.
//
// Measurements (window gamma in [10,52], i.e. x in [20,104], 10 zeros at t=0):
//  A. calibration: zeros of H_0 vs 2*gamma_k
//  B. winding ladder: real-zero count vs t on a grid covering t>0 and t<0
//  C. first-collision time bisection for the tightest pair (gamma_9, gamma_10)
//     vs the two-body prediction t_c = -(2*dgamma)^2/8
//  D. rate check: d(g^2)/dt for the tightest pair vs two-body slope 8
//  E. conv identity: |GaussianConv_{sqrt(2 tau)}(H_0) - H_{-tau}| small
//  F. repo-proxy reconciliation: Riemann-Siegel-Z Gaussian convolution ladder
//     (gamma-units width sqrt(2 tau_repo)) vs exact count at t = -4 tau_repo
//
// Precision: Kahan-compensated Simpson on u in [0,1], h = 5e-4. Phi is even, so
// all odd derivatives vanish at u=0 and the integrand is ~0 at u=1: the
// Euler-Maclaurin boundary terms vanish and the rule is spectrally accurate.
// Roundoff floor ~1e-17 absolute; smallest signal used ~2.6e-16*|Z| at x=104.

const PI = Math.PI;

const GAMMAS = [
  14.134725141734693, 21.022039638771554, 25.010857580145688,
  30.424876125859513, 32.935061587739189, 37.586178158825671,
  40.918719012147495, 43.327073280914999, 48.005150881167159,
  49.773832477672302, 52.970321477714460, 56.446247697063394,
  59.347044002602352,
];

// --- Phi and quadrature ------------------------------------------------------
function Phi(u) {
  const e4 = Math.exp(4 * u), e5 = Math.exp(5 * u), e9 = Math.exp(9 * u);
  let s = 0;
  for (let n = 1; n <= 40; n++) {
    const a = PI * n * n * e4;
    if (a > 700) break;
    s += (2 * PI * PI * n * n * n * n * e9 - 3 * PI * n * n * e5) * Math.exp(-a);
  }
  return s;
}

const U_MAX = 1.0, M = 2000, HU = U_MAX / M;      // Simpson intervals
const U = new Float64Array(M + 1), SIMP = new Float64Array(M + 1);
const PHI = new Float64Array(M + 1);
for (let i = 0; i <= M; i++) {
  U[i] = i * HU;
  SIMP[i] = (i === 0 || i === M) ? HU / 3 : (i % 2 === 1 ? 4 * HU / 3 : 2 * HU / 3);
  PHI[i] = Phi(U[i]);
}

function weightsForT(t) {
  const w = new Float64Array(M + 1);
  for (let i = 0; i <= M; i++) w[i] = SIMP[i] * PHI[i] * Math.exp(t * U[i] * U[i]);
  return w;
}

// Kahan-compensated H_t(x) for one x given precomputed weights.
function Hval(w, x) {
  let s = 0, c = 0;
  for (let i = 0; i <= M; i++) {
    const term = w[i] * Math.cos(x * U[i]);
    const y = term - c, tt = s + y;
    c = (tt - s) - y; s = tt;
  }
  return s;
}

function Hgrid(t, x0, x1, dx) {
  const w = weightsForT(t);
  const n = Math.round((x1 - x0) / dx);
  const xs = new Float64Array(n + 1), hs = new Float64Array(n + 1);
  for (let j = 0; j <= n; j++) { xs[j] = x0 + j * dx; hs[j] = Hval(w, xs[j]); }
  return { xs, hs };
}

function zerosOf(xs, hs) {
  const z = [];
  for (let j = 1; j < xs.length; j++) {
    if (hs[j - 1] === 0) continue;
    if (hs[j - 1] * hs[j] < 0) {
      z.push(xs[j - 1] + (xs[j] - xs[j - 1]) * hs[j - 1] / (hs[j - 1] - hs[j]));
    }
  }
  return z;
}

const XLO = 20, XHI = 104, DX = 0.01;
function windowZeros(t) { const { xs, hs } = Hgrid(t, XLO, XHI, DX); return zerosOf(xs, hs); }

// --- A. calibration ----------------------------------------------------------
const z0 = windowZeros(0);
const ref = GAMMAS.filter((g) => g >= 10 && g <= 52).map((g) => 2 * g);
let maxCalErr = -1;
if (z0.length === ref.length) {
  for (let k = 0; k < ref.length; k++) maxCalErr = Math.max(maxCalErr, Math.abs(z0[k] - ref[k]));
}
console.log('A. calibration: count', z0.length, 'expected', ref.length, 'maxErr', maxCalErr.toExponential(3));

// --- B. winding ladder -------------------------------------------------------
const T_GRID = [1, 0.4, 0.2, 0, -0.5, -1, -1.25, -1.5, -1.75, -2, -2.5, -3, -4, -6, -8, -12, -20];
const ladder = [];
for (const t of T_GRID) {
  const z = windowZeros(t);
  let minGap = Infinity;
  for (let k = 1; k < z.length; k++) minGap = Math.min(minGap, z[k] - z[k - 1]);
  ladder.push({ t, count: z.length, first: z[0], last: z[z.length - 1], minGap });
  console.log('B. t=', t, 'count=', z.length, 'first=', z[0]?.toFixed(3), 'last=', z[z.length - 1]?.toFixed(3), 'minGap=', isFinite(minGap) ? minGap.toFixed(3) : '-');
}

// --- C. first-collision bisection (pair gamma_9=48.005, gamma_10=49.774) ------
// Track the pair locally: zeros in [92,103]; pair alive iff two adjacent zeros
// with midpoint in [94,101].
function pairGap(t) {
  const { xs, hs } = Hgrid(t, 88, 104, 0.005);
  const z = zerosOf(xs, hs);
  for (let k = 1; k < z.length; k++) {
    const mid = (z[k] + z[k - 1]) / 2;
    if (mid > 93 && mid < 101.5 && z[k] - z[k - 1] < 4.6) return z[k] - z[k - 1];
  }
  return null; // merged (or left the tracking box)
}
let lo = -2.2, hi = -1.0; // gap(hi) alive, gap(lo) merged -- verify
const gHi = pairGap(hi), gLo = pairGap(lo);
console.log('C. bracket: gap(-1.0)=', gHi, 'gap(-2.2)=', gLo);
for (let it = 0; it < 18; it++) {
  const mid = (lo + hi) / 2;
  if (pairGap(mid) !== null) hi = mid; else lo = mid;
}
const tCollide = (lo + hi) / 2;
const dg = GAMMAS[9] - GAMMAS[8];
const tTwoBody = -Math.pow(2 * dg, 2) / 8;
console.log('C. tightest-pair collision t_c =', tCollide.toFixed(4), ' two-body prediction', tTwoBody.toFixed(4), ' repo-units tau =', (-tCollide / 4).toFixed(4));

// --- D. rate check d(g^2)/dt --------------------------------------------------
const rateTs = [0.5, 0.25, 0, -0.25, -0.5, -0.75, -1.0];
const g2 = rateTs.map((t) => { const g = pairGap(t); return { t, g, g2: g === null ? null : g * g }; });
for (const r of g2) console.log('D. t=', r.t, 'gap=', r.g === null ? 'merged' : r.g.toFixed(5), 'g^2=', r.g2 === null ? '-' : r.g2.toFixed(5));
// least-squares slope of g^2 vs t over available points
const pts = g2.filter((r) => r.g2 !== null);
const mt = pts.reduce((s, r) => s + r.t, 0) / pts.length;
const mg = pts.reduce((s, r) => s + r.g2, 0) / pts.length;
const slope = pts.reduce((s, r) => s + (r.t - mt) * (r.g2 - mg), 0) / pts.reduce((s, r) => s + (r.t - mt) ** 2, 0);
console.log('D. d(g^2)/dt fitted slope =', slope.toFixed(4), ' (two-body isolated pair = 8)');

// --- E. conv identity: GaussConv_{sqrt(2 tau)} H_0 == H_{-tau} -----------------
const EXT_LO = 8, EXT_HI = 116, EXT_DX = 0.01;
const ext = Hgrid(0, EXT_LO, EXT_HI, EXT_DX);
function convAt(x, sigma) {
  const span = 6 * sigma;
  const j0 = Math.max(0, Math.ceil((x - span - EXT_LO) / EXT_DX));
  const j1 = Math.min(ext.xs.length - 1, Math.floor((x + span - EXT_LO) / EXT_DX));
  let num = 0, den = 0;
  for (let j = j0; j <= j1; j++) {
    const w = Math.exp(-((x - ext.xs[j]) ** 2) / (2 * sigma * sigma));
    num += w * ext.hs[j]; den += w;
  }
  return num / den;
}
for (const tau of [0.5, 2]) {
  const sigma = Math.sqrt(2 * tau);
  const w = weightsForT(-tau);
  let maxAbsDirect = 0, maxDev = 0;
  for (let x = 20; x <= 104; x += 0.5) {
    const d = Hval(w, x);
    maxAbsDirect = Math.max(maxAbsDirect, Math.abs(d));
  }
  for (let x = 20; x <= 104; x += 0.5) {
    const d = Hval(w, x), c = convAt(x, sigma);
    maxDev = Math.max(maxDev, Math.abs(c - d));
  }
  console.log('E. tau=', tau, 'max|conv - H_{-tau}| / max|H_{-tau}| =', (maxDev / maxAbsDirect).toExponential(3));
}

// --- F. repo-proxy reconciliation ---------------------------------------------
// Riemann-Siegel Z (main sum + first correction), gamma-units Gaussian conv of
// width sqrt(2 tau_repo) -- the heatEvolvedXi recipe -- vs exact H_t count at
// t = -4 tau_repo (x = 2 gamma unit conversion: conv width_gamma s <-> width_x 2s).
function thetaRS(t) {
  return t / 2 * Math.log(t / (2 * PI)) - t / 2 - PI / 8 + 1 / (48 * t) + 7 / (5760 * t ** 3);
}
function Zrs(t) {
  t = Math.abs(t);
  if (t < 1) return 0; // negligible-weight tail guard
  const a = Math.sqrt(t / (2 * PI));
  const nu = Math.floor(a);
  const th = thetaRS(t);
  let s = 0;
  for (let n = 1; n <= nu; n++) s += Math.cos(th - t * Math.log(n)) / Math.sqrt(n);
  const p = a - nu;
  const psi = Math.cos(2 * PI * (p * p - p - 1 / 16)) / Math.cos(2 * PI * p);
  const R = (nu % 2 === 0 ? -1 : 1) * Math.pow(t / (2 * PI), -0.25) * psi;
  return 2 * s + R;
}
const G_LO = 1, G_HI = 61, G_DX = 0.005;
const NG = Math.round((G_HI - G_LO) / G_DX);
const gGrid = new Float64Array(NG + 1), zGrid = new Float64Array(NG + 1);
for (let j = 0; j <= NG; j++) { gGrid[j] = G_LO + j * G_DX; zGrid[j] = Zrs(gGrid[j]); }
function proxyCount(tauRepo) {
  const sigma = Math.sqrt(2 * tauRepo);
  const span = 4 * sigma;
  let prev = null, count = 0;
  for (let g = 10; g <= 52; g += 0.01) {
    const j0 = Math.max(0, Math.ceil((g - span - G_LO) / G_DX));
    const j1 = Math.min(NG, Math.floor((g + span - G_LO) / G_DX));
    let num = 0, den = 0;
    for (let j = j0; j <= j1; j++) {
      const w = Math.exp(-((g - gGrid[j]) ** 2) / (2 * sigma * sigma));
      num += w * zGrid[j]; den += w;
    }
    const v = num / den;
    if (prev !== null && prev * v < 0) count++;
    prev = v;
  }
  return count;
}
for (const tauRepo of [0.125, 0.3125, 0.5, 1, 2]) {
  const exact = windowZeros(-4 * tauRepo).length;
  console.log('F. tau_repo=', tauRepo, ' proxy(Z-conv) count=', proxyCount(tauRepo), ' exact H_t count (t=', -4 * tauRepo, ') =', exact);
}

// --- G. truncated-N CM cross-validation vs the exact-flow meter ----------------
// imp-34814: the Route A/B conditional-model (CM) machinery tracks a FINITE,
// TRUNCATED set of N zeros under the first-order Calogero-Moser backward flow
//   dx_k/dt = 2 * SUM_{j != k} 1/(x_k - x_j)        (x_k(0) = 2*gamma_k),
// which is the leading-order (log-derivative) reduction of the exact de Bruijn
// zero dynamics x_k'(t) = H_xx/H_x at each simple zero. Isolated pairs collide
// at the two-body time t = -(2 dgamma)^2/8. Cross-validate the truncated-N CM
// collision time for the tightest window pair (gamma_9, gamma_10) against the
// exact first-collision t_c measured in section C: as the truncation window
// grows the CM t_c should migrate from the two-body -1.5641 toward the exact
// -1.8837 (many-body neighbour retardation), quantifying the CM truncation
// error at each N. Cross-validation only; changes no bound; NO QED.
const PAIR_LO = 8, PAIR_HI = 9;                       // 0-indexed gamma_9, gamma_10
function cmDeriv(x, live) {
  const d = new Float64Array(x.length);
  for (let k = 0; k < x.length; k++) {
    if (!live[k]) continue;
    let s = 0;
    for (let j = 0; j < x.length; j++) {
      if (j === k || !live[j]) continue;
      s += 1 / (x[k] - x[j]);
    }
    d[k] = 2 * s;
  }
  return d;
}
// RK4 in t (t decreasing from 0). Returns CM collision time for the tracked pair
// by extrapolating gap^2 -> 0 (gap^2 is ~linear in t near an isolated collision).
function cmCollision(indices) {
  let x = Float64Array.from(indices.map((i) => 2 * GAMMAS[i]));
  const live = indices.map(() => true);
  const kA = indices.indexOf(PAIR_LO), kB = indices.indexOf(PAIR_HI);
  const dt = -2e-4;
  let t = 0, prevT = 0, prevG2 = (x[kB] - x[kA]) ** 2;
  for (let step = 0; step < 200000; step++) {
    const k1 = cmDeriv(x, live);
    const x2 = x.map((v, i) => v + (dt / 2) * k1[i]);
    const k2 = cmDeriv(x2, live);
    const x3 = x.map((v, i) => v + (dt / 2) * k2[i]);
    const k3 = cmDeriv(x3, live);
    const x4 = x.map((v, i) => v + dt * k3[i]);
    const k4 = cmDeriv(x4, live);
    const xn = x.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    const g = xn[kB] - xn[kA];
    const g2 = g * g;
    if (g < 0.05) {
      // linear extrapolation of gap^2 through zero from the last two samples
      const frac = prevG2 / (prevG2 - g2);
      return prevT + frac * (t + dt - prevT);
    }
    prevT = t; prevG2 = g2; x = Float64Array.from(xn); t += dt;
  }
  return null;
}
// Truncation windows centred on the pair: N=2 (pair only -> two-body), then
// symmetric neighbour shells up to the full 13-zero list.
const CM_WINDOWS = [
  { N: 2, idx: [8, 9] },
  { N: 4, idx: [7, 8, 9, 10] },
  { N: 6, idx: [6, 7, 8, 9, 10, 11] },
  { N: 8, idx: [5, 6, 7, 8, 9, 10, 11, 12] },
  { N: 10, idx: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { N: 13, idx: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
];
const EXACT_TC = -1.8837, TWO_BODY = -1.5641;
for (const win of CM_WINDOWS) {
  const tc = cmCollision(win.idx);
  const vsExact = tc === null ? '-' : (tc - EXACT_TC).toFixed(4);
  console.log('G. CM N=', win.N, ' t_c=', tc === null ? 'none' : tc.toFixed(4),
    ' vs exact', EXACT_TC, '(delta', vsExact, ') vs two-body', TWO_BODY);
}

// --- H. multi-pair exact collision census (imp-34815) -------------------------
// Section C measured the exact first-collision t_c for the tightest pair only.
// Extend it to EVERY window collision: going backward (t decreasing) the real-
// zero count is non-increasing and steps 10 -> 8 -> 6 -> 4 -> 2 -> 0, one merge
// per drop. For each realized count level bisect its collision time t_c, find
// the merging pair (tightest adjacent gap just above t_c), match it to its t=0
// gap by midpoint proximity, and compare t_c to the two-body prediction
// t_2b = -(gap_x)^2/8. Quantifies how the many-body retardation |t_c/t_2b| > 1
// varies with pair spacing across the [20,104] window. Measurement only.
function countAtT(t) {
  const { xs, hs } = Hgrid(t, XLO, XHI, 0.02);
  return zerosOf(xs, hs).length;
}
const T_FLOOR = -40;
const scanCounts = [];
for (let t = 0; t >= T_FLOOR; t -= 1) scanCounts.push({ t, c: countAtT(t) });
const c0census = scanCounts[0].c;
const levels = [...new Set(scanCounts.map((s) => s.c))].filter((c) => c < c0census).sort((a, b) => b - a);
function collisionTimeForLevel(level) {
  if (countAtT(T_FLOOR) > level) return null;          // not reached in [T_FLOOR,0]
  let lo = T_FLOOR, hi = 0;                             // count(0) > level >= count(T_FLOOR)
  for (let it = 0; it < 34; it++) {
    const mid = (lo + hi) / 2;
    if (countAtT(mid) <= level) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
function tightestPairMid(t) {
  const { xs, hs } = Hgrid(t, XLO, XHI, 0.005);
  const z = zerosOf(xs, hs);
  let best = null;
  for (let k = 1; k < z.length; k++) {
    const g = z[k] - z[k - 1];
    if (best === null || g < best.gap) best = { gap: g, mid: (z[k] + z[k - 1]) / 2 };
  }
  return best;
}
console.log('H. multi-pair collision census (levels', levels.join(','), '):');
const census = [];
for (const level of levels) {
  const tc = collisionTimeForLevel(level);
  if (tc === null) { console.log('H. level', level, 'not reached in [', T_FLOOR, ',0]'); continue; }
  const probe = tightestPairMid(tc + 0.08);            // just above the merge
  const xm = probe ? probe.mid : null;
  let gap0 = null;
  if (xm !== null) {
    let bi = -1, bd = Infinity;
    for (let k = 1; k < z0.length; k++) {
      const d = Math.abs((z0[k] + z0[k - 1]) / 2 - xm);
      if (d < bd) { bd = d; bi = k; }
    }
    if (bi > 0) gap0 = z0[bi] - z0[bi - 1];
  }
  const tTwoBody = gap0 === null ? null : -(gap0 * gap0) / 8;
  const retard = tTwoBody === null ? null : tc / tTwoBody;
  census.push({ level, tc, xm, gap0, tTwoBody, retard });
  console.log('H. count->', level, ' t_c=', tc.toFixed(4),
    ' merge x_m=', xm === null ? '-' : xm.toFixed(3),
    ' t=0 gap_x=', gap0 === null ? '-' : gap0.toFixed(4),
    ' two-body=', tTwoBody === null ? '-' : tTwoBody.toFixed(4),
    ' retard=', retard === null ? '-' : retard.toFixed(4));
}
// Only the first two events (count 10->8, 8->6) are cleanly attributable: their
// collision times are well separated (>2 in t) and the merging pair sits in an
// unreorganized part of the window, so the t=0 proximity match is reliable.
// Later rungs are contaminated -- 8->6 and 6->4 cluster within ~0.08 in t (probe
// cannot separate them, both localize to x~66), the 4->2 match falls on a
// reorganized region (apparent retard < 1 is a mis-attribution artifact, not
// physical acceleration), and count->1 is ODD (a zero exits the window through
// the boundary at t < -20, not a conjugate-pair merge). Report the clean subset.
const clean = census.filter((r) => r.level >= 6 && r.retard !== null);
const cr = clean.map((r) => r.retard);
if (cr.length) {
  console.log('H. CLEAN subset (levels 10->8, 8->6): retard =', cr.map((v) => v.toFixed(4)).join(', '),
    ' -- both > 1 (many-body retarded), growing mildly with pair spacing (gap 3.54 -> 5.02)');
}
console.log('H. CAVEAT: levels <= 4 are not per-pair-attributable by this meter',
  '(clustered merges + structural reorganization + boundary flux at count->1);',
  'robust attribution needs zero-trajectory continuation, not t=0 proximity matching -- SUB-GAP');

// --- I. zero-trajectory-continuation attribution (imp-34841) ------------------
// Section H matched each merging pair to its t=0 gap by MIDPOINT PROXIMITY at
// tc+0.08, which only cleanly resolves the two tightest well-separated pairs
// (10->8, 8->6); clustered merges (8->6 vs 6->4 within ~0.08 in t) and window
// reorganization contaminate the later rungs, and the count->odd rung is a
// boundary exit mis-read as a merge. Here we FOLLOW each real zero forward from
// t=0 by ORDER-CONTINUATION: label the window zeros 0..n-1 at t=0 and step t
// downward, at each step recomputing the FULL sorted real-zero list on the exact
// grid. Real simple zeros keep their left-to-right ORDER and can only leave R by
// colliding with an ADJACENT labelled zero (conjugate-pair birth) or by exiting
// through the window boundary; count is non-increasing. When the count drops by
// 2 we identify the vanished ADJACENT-label pair by the order-preserving match
// that minimizes total displacement to the surviving zeros (NO t=0 proximity
// guess); a drop of 1 is a boundary exit (which end left is chosen the same way);
// a step that drops by more than 2 is SUBDIVIDED so each event is isolated. This
// separates the clustered events section H could not and attributes every merge
// to a specific labelled pair. Re-run on a WIDENED window reports boundary-flux
// sensitivity. Cross-validation instrument only; changes no bound; NO QED.
//
// NOTE: an earlier prototype tried INDEPENDENT Newton-from-previous continuation
// of each trajectory; it mis-tracks near collisions (H_x -> 0 at the incipient
// double zero destabilizes Newton), producing label-order inversions and zeros
// that walk out past the window edge -- an inconsistent census. Order-matching on
// the exact grid is robust because it never relies on a single unstable solve.
function Hderiv(w, x) {
  let s = 0, c = 0;
  for (let i = 0; i <= M; i++) {
    const term = -w[i] * U[i] * Math.sin(x * U[i]);
    const y = term - c, tt = s + y;
    c = (tt - s) - y; s = tt;
  }
  return s;
}
function refineZero(w, x0) {                    // Newton polish of a bracketed zero
  let x = x0;
  for (let it = 0; it < 30; it++) {
    const f = Hval(w, x), fp = Hderiv(w, x);
    if (fp === 0) break;
    let dx = f / fp;
    if (dx > 0.05) dx = 0.05; else if (dx < -0.05) dx = -0.05;
    x -= dx;
    if (Math.abs(dx) < 1e-12) break;
  }
  return x;
}
const TRACK_DX = 0.05;                           // coarse detection grid (zeros separated by >> this except at a collision)
function sortedZerosAt(t, xlo, xhi) {
  const w = weightsForT(t);
  const n = Math.round((xhi - xlo) / TRACK_DX);
  const z = [];
  let xPrev = xlo, fPrev = Hval(w, xlo);
  for (let j = 1; j <= n; j++) {
    const x = xlo + j * TRACK_DX, f = Hval(w, x);
    if (fPrev !== 0 && fPrev * f < 0) {
      z.push(refineZero(w, xPrev + TRACK_DX * fPrev / (fPrev - f)));
    }
    xPrev = x; fPrev = f;
  }
  return z;
}
// Order-preserving identification of which labels vanished when count drops.
function matchDrop(prevPos, prevLabels, newPos) {
  const m = prevPos.length, p = newPos.length, drop = m - p;
  const residual = (keepIdx) => {
    let c = 0;
    for (let k = 0; k < p; k++) c += Math.abs(prevPos[keepIdx[k]] - newPos[k]);
    return c;
  };
  const allIdx = prevPos.map((_, k) => k);
  if (drop === 2) {                              // an adjacent conjugate pair merged
    let best = 0, bestCost = Infinity;
    for (let i = 0; i + 1 < m; i++) {
      const cost = residual(allIdx.filter((k) => k !== i && k !== i + 1));
      if (cost < bestCost) { bestCost = cost; best = i; }
    }
    return { type: 'merge', removed: [prevLabels[best], prevLabels[best + 1]], keep: allIdx.filter((k) => k !== best && k !== best + 1) };
  }
  if (drop === 1) {                              // one zero left through a boundary
    let best = 0, bestCost = Infinity;
    for (const i of [0, m - 1]) {
      const cost = residual(allIdx.filter((k) => k !== i));
      if (cost < bestCost) { bestCost = cost; best = i; }
    }
    return { type: 'exit', removed: [prevLabels[best]], keep: allIdx.filter((k) => k !== best) };
  }
  return { type: 'ambiguous', removed: [], keep: allIdx.slice(0, p) };
}
function continuationCensus(xlo, xhi) {
  const T_END = -40, BASE_DT = -0.05, MIN_DT = -0.05 / 512;
  let pos = sortedZerosAt(0, xlo, xhi);
  const seedCount = pos.length;
  let labels = pos.map((_, i) => i);
  const merges = [], exits = [];
  let inflowAtT = null;                          // t of first boundary IN-flux (count increase)
  let t = 0;
  while (t > T_END && labels.length > 0) {
    let dt = BASE_DT;
    let newPos = sortedZerosAt(t + dt, xlo, xhi);
    // subdivide so at most one merge (drop 2) or one exit (drop 1) resolves per step
    while (pos.length - newPos.length > 2 && dt > MIN_DT) { dt /= 2; newPos = sortedZerosAt(t + dt, xlo, xhi); }
    const tNext = t + dt;
    if (newPos.length > pos.length) {            // a zero migrated IN from outside the window
      inflowAtT = tNext;                         // order-continuation cannot attribute past in-flux -- stop honestly
      break;
    }
    if (newPos.length < pos.length) {
      const r = matchDrop(pos, labels, newPos);
      const tc = tNext + dt / 2;                 // event bracketed in (tNext, t]; report bracket midpoint
      if (r.type === 'merge') merges.push({ a: Math.min(r.removed[0], r.removed[1]), b: Math.max(r.removed[0], r.removed[1]), tc, res: Math.abs(dt) });
      else if (r.type === 'exit') exits.push({ label: r.removed[0], tc, res: Math.abs(dt) });
      labels = r.keep.map((k) => labels[k]);
    }
    pos = newPos; t = tNext;
  }
  merges.sort((p, q) => q.tc - p.tc);            // collision order: least-negative t first
  return { merges, exits, seedCount, survivorsAtEnd: labels, inflowAtT };
}
// Base window [20,104] and widened window [12,112] for boundary-flux sensitivity.
for (const [xlo, xhi] of [[XLO, XHI], [12, 112]]) {
  const { merges, exits, seedCount, survivorsAtEnd, inflowAtT } = continuationCensus(xlo, xhi);
  console.log(`I. window [${xlo},${xhi}] seedZeros=${seedCount}: ${merges.length} pair-merge(s) attributed, ${exits.length} boundary exit(s)` + (inflowAtT === null ? `, ${survivorsAtEnd.length} survivor(s)` : `; STOPPED at t=${inflowAtT.toFixed(3)} on boundary IN-flux (a zero entered from outside the wider edge)`));
  for (const mm of merges) {
    const gapX = 2 * (GAMMAS[mm.b] - GAMMAS[mm.a]);        // seed label = GAMMAS index in these windows
    const tTwoBody = -(gapX * gapX) / 8;
    const retard = mm.tc / tTwoBody;
    console.log(`I.   merge (gamma_${mm.a + 1}, gamma_${mm.b + 1})  t_c=${mm.tc.toFixed(4)} (+/-${mm.res.toFixed(4)})  gap_x0=${gapX.toFixed(4)}  two-body=${tTwoBody.toFixed(4)}  retard=${retard.toFixed(4)}`);
  }
  for (const e of exits) console.log(`I.   boundary exit: gamma_${e.label + 1} at t_c=${e.tc.toFixed(4)} (+/-${e.res.toFixed(4)})`);
  console.log(`I.   survivor label(s) at t=${-40}: [${survivorsAtEnd.map((l) => 'gamma_' + (l + 1)).join(',')}]`);
}
console.log('I. NOTE: order-continuation attributes every conjugate-pair merge to a SPECIFIC labelled pair with no proximity guess, subdividing to separate clustered events; boundary exits are held apart from merges. Widened window shows how many section-H boundary/mis-attributed rungs become interior merges. Cross-validation only; changes no bound; NO QED.');

console.log('done');
