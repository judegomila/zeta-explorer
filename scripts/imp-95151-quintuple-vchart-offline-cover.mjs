// imp-95151 offline cover runner (heavy-compute lane; single-threaded,
// deterministic, bit-reproducible - no randomness in the cover path).
// THEOREM QN (quintuple-block rung, k = 5): the imp-95150 v-chart hybrid
// machinery extended by LEMMA EPN-4 - the FOURTH nested fold level (arcs
// yO/yM/yI/yJ; the route imp-95147 NAMED as "+1 position +1 arc axis per
// extra packet" but never ran). Weights of the five packets in the heavy
// block: w1 = xO, w2 = yO xM, w3 = yO yM xI, w4 = yO yM yI xJ,
// w5 = yO yM yI yJ (x = sqrt(1 - y^2)); exact and onto the nonneg sphere.
// Chart axes: [v1..v5, vB, yO, yM, yI, yJ, mu] - 11-D hybrid (dropped
// lower single pinned at its per-entry consistent worst corner, carried).
// Partners per entry (min over all, every approximation inflates caps):
//   full   - EPN-4 nested aySup/mcF fold + LEMMA KC cone cap at k = 5
//   capD2..capD5 - LEMMA PD deletion of one middle/inner packet with
//            LEMMA PD2 satellite-floored denominators (kept-pair floors)
//   capP234 - sequential deletion of packets 2,3,4 down to the {1,5} pair
//   capQC  - LEMMA QC quotient corner cap over all five packets
// Tail rows: sqrt(5) inflation (Cauchy-Schwarz on unit block mass at
// occupancy <= 5), entry (3,4) factor 5; LEMMA RM-QN closure moves the
// closure rate 9/10 -> 19/20 = 0.95 because sqrt(5) g(2 x 0.9) > 1 while
// sqrt(5) g(2 x 0.95) < 1 (certified as a Perron bound in-module).
//
// Usage: node scripts/imp-95151-quintuple-vchart-offline-cover.mjs T FLOOR BUDGET DUMP
//   T = heavy-block head position (0 lowest / 1 middle / 2 highest)
//   FLOOR = rate floor, BUDGET = max cells, DUMP = 1/0
// BAT=1 env runs the seeded batteries instead (EPN-4 identity, cap
// domination vs true 5-packet configs, witness E <= 0).
const argv = process.argv.slice(2);
const T = parseInt(argv[0] ?? "2", 10);
const FLOOR_NUM = parseFloat(argv[1] ?? "0.244");
const BUDGET = parseFloat(argv[2] ?? "2e7");
const DUMP = (argv[3] ?? "0") === "1";

let RATE_FLOOR = FLOOR_NUM;
const MU_CL = 19 / 20; // RM-QN closure rate (sqrt(5) inflation needs 0.95)
const EHALF_HI = 0.60653067;
const TAILSLACK = 1e-19;
const V3_FLOOR = 1e-8;
const V4_FLOOR = 1e-10;

const gFun = (z) => Math.exp(-z) * (1 + z);
function expTrunc(z, N) {
  let s = 1, t = 1;
  for (let n = 1; n <= N; n++) { t = (t * -z) / n; s += t; }
  return s;
}
function gcap(z) {
  if (z <= 4) return (expTrunc(z, 60) + 1e-8) * (1 + z);
  if (z <= 15) return (expTrunc(z, 60) + 1e-6) * (1 + z);
  return Math.pow(EHALF_HI, Math.floor(z)) * (1 + 1e-9);
}
function gLo(z) {
  if (z >= 50) return 0;
  const v = (expTrunc(z, 59) - 1e-8) * (1 + z);
  return Math.max(0, v);
}
const sqrtHi = (w) => Math.sqrt(Math.max(0, w)) * (1 + 1e-12);
const R5 = sqrtHi(5);

function kcSup(A, G) {
  const n = A.length;
  let best2 = 0;
  for (const a of A) if (a * a > best2) best2 = a * a;
  if (G < 1) {
    const d = 1 - G;
    for (let mask = 1; mask < 1 << n; mask++) {
      const idx = [];
      for (let i = 0; i < n; i++) if (mask & (1 << i)) idx.push(i);
      const m = idx.length;
      if (m < 2) continue;
      let S1 = 0;
      for (const i of idx) S1 += A[i];
      const c = G / (1 + (m - 1) * G);
      let ok = true, v = 0;
      for (const i of idx) {
        const x = (A[i] - c * S1) / d;
        if (x < -1e-9) { ok = false; break; }
        v += A[i] * x;
      }
      if (ok && v > best2) best2 = v;
    }
  }
  return sqrtHi(best2) * (1 + 1e-9);
}
function ayP(C, A, B, G, ya, yc) {
  const xa2 = 1 - ya * ya, xc2 = 1 - yc * yc;
  const xa = Math.sqrt(xa2), xc = Math.sqrt(xc2);
  const q11 = A * A - C, q22 = B * B - C, q12 = A * B - C * G;
  const Qa = xa2 * q11 + ya * ya * q22 + 2 * xa * ya * q12 + 1e-9 * C;
  const Qc = xc2 * q11 + yc * yc * q22 + 2 * xc * yc * q12 + 1e-9 * C;
  if (!(Qa <= 0 && Qc <= 0)) return false;
  const cross = xa * xc * q11 + ya * yc * q22 + (xa * yc + xc * ya) * q12 + 1e-9 * C;
  if (cross <= 0) return true;
  return cross * cross <= Qa * Qc;
}
function fsqAt(y, A, B, G) {
  const x = Math.sqrt(Math.max(0, 1 - y * y));
  const N = x * A + y * B;
  return (N * N) / (1 + 2 * x * y * G);
}
function aySup(A, B, G, ya, yc) {
  let C = Math.max(fsqAt(ya, A, B, G), fsqAt(yc, A, B, G)) * (1 + 1e-9);
  if (ayP(C, A, B, G, ya, yc)) return sqrtHi(C);
  let Cf = Math.max(A * A, B * B);
  if (G < 1) {
    const Cint = (A * A + B * B - 2 * A * B * G) / (1 - G * G);
    if (Cint > Cf) Cf = Cint;
  }
  return sqrtHi(Cf * (1 + 1e-9));
}
function mcF(G, ya, yc) {
  let s;
  const sAt = (y) => 2 * y * Math.sqrt(Math.max(0, 1 - y * y));
  const yStar = Math.SQRT1_2;
  if (ya <= yStar && yStar <= yc) s = 1;
  else s = Math.max(sAt(ya), sAt(yc));
  return sqrtHi((1 + s) / (1 + s * G)) * (1 + 1e-12);
}
function cwRatio(M, v) {
  let mx = -Infinity;
  for (let i = 0; i < 5; i++) {
    let s = TAILSLACK;
    for (let j = 0; j < 5; j++) s += M[i][j] * v[j];
    const r = s / v[i];
    if (r > mx) mx = r;
  }
  return mx * (1 + 1e-12);
}
function polish(M, v0, iters) {
  let v = v0.slice();
  for (let it = 0; it < iters; it++) {
    const w = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
      let s = v[i];
      for (let j = 0; j < 5; j++) s += M[i][j] * v[j];
      w[i] = s;
    }
    const n = Math.hypot(...w);
    for (let i = 0; i < 5; i++) v[i] = w[i] / n;
    v[3] = Math.max(v[3], V3_FLOOR);
    v[4] = Math.max(v[4], V4_FLOOR);
  }
  return v;
}

const BASE = [1, 4, 16, 64, 256];

// interval helper: effective two-body arc t = n / hypot(x, n)
const foldArc = (nLo, nHi, xLo, xHi) => [
  Math.max(0, (nLo / Math.hypot(xHi, nLo)) * (1 - 1e-12)),
  Math.min(1, (nHi / Math.hypot(xLo, nHi)) * (1 + 1e-12)),
];

function makeCellV5(T, hasMu) {
  const others = [0, 1, 2].filter((b) => b !== T);
  const bA = others[0], bB = others[1]; // bA dropped (pinned worst corner)
  return function cellV(b) {
    let [v1a, v2a, v3a, v4a, v5a] = b.lo;
    let [v1c, v2c, v3c, v4c, v5c] = b.hi;
    const vBa = b.lo[5], vBc = b.hi[5];
    const [yOa, yMa, yIa, yJa] = [b.lo[6], b.lo[7], b.lo[8], b.lo[9]];
    const [yOc, yMc, yIc, yJc] = [b.hi[6], b.hi[7], b.hi[8], b.hi[9]];
    const muAxLo = hasMu ? b.lo[10] : RATE_FLOOR;
    const muAxHi = hasMu ? b.hi[10] : MU_CL;
    v2a = Math.max(v2a, v1a);
    v3a = Math.max(v3a, v2a);
    v4a = Math.max(v4a, v3a);
    v5a = Math.max(v5a, v4a);
    v4c = Math.min(v4c, v5c);
    v3c = Math.min(v3c, v4c);
    v2c = Math.min(v2c, v3c);
    v1c = Math.min(v1c, v2c);
    let mLo = Math.max(RATE_FLOOR, muAxLo);
    let mHi = Math.min(MU_CL, muAxHi);
    const axBase = [BASE[T], BASE[T], BASE[T], BASE[T], BASE[T], BASE[bB]];
    const los = [v1a, v2a, v3a, v4a, v5a, vBa];
    const his = [v1c, v2c, v3c, v4c, v5c, vBc];
    for (let k = 0; k < axBase.length; k++) {
      const l = los[k] / (2 * axBase[k]);
      const h = his[k] / axBase[k];
      if (l > mLo) mLo = l;
      if (h < mHi) mHi = h;
    }
    const bandMin = (f, bps) => {
      let best = Math.min(f(mLo), f(mHi));
      for (const b2 of bps) {
        if (b2 > mLo && b2 < mHi) {
          const v = f(b2);
          if (v < best) best = v;
        }
      }
      return Math.max(0, best);
    };
    const sepV = (hiV, loV) => Math.min(48, Math.max(0, hiV - loV));
    const pairSepLB = (bx, by, vxHi, vyLo) => {
      const By = BASE[by];
      const Bx2 = 2 * BASE[bx];
      const cands = [mLo, mHi];
      const b1 = vyLo / By;
      const b2 = vxHi / Bx2;
      if (b1 > mLo && b1 < mHi) cands.push(b1);
      if (b2 > mLo && b2 < mHi) cands.push(b2);
      let best = Infinity;
      for (const m of cands) {
        const v = Math.max(m * By, vyLo) - Math.min(m * Bx2, vxHi);
        if (v < best) best = v;
      }
      return Math.max(0, best);
    };
    const tailSepLB = (bx, by, vxHi) => {
      const By = BASE[by];
      const Bx2 = 2 * BASE[bx];
      const cands = [mLo, mHi];
      const b2 = vxHi / Bx2;
      if (b2 > mLo && b2 < mHi) cands.push(b2);
      let best = Infinity;
      for (const m of cands) {
        const v = m * By - Math.min(m * Bx2, vxHi);
        if (v < best) best = v;
      }
      return Math.max(0, best);
    };
    const vlo = [v1a, v2a, v3a, v4a, v5a];
    const vhi = [v1c, v2c, v3c, v4c, v5c];
    // within-heavy-block pairwise Gram floors and caps
    const GF = {}, GH = {};
    for (let i = 0; i < 5; i++) {
      for (let j = i + 1; j < 5; j++) {
        GF[`${i}${j}`] = gLo(sepV(vhi[j], vlo[i]));
        GH[`${i}${j}`] = Math.min(1, gcap(Math.max(0, vlo[j] - vhi[i])));
      }
    }
    const G12 = GF["01"], G13 = GF["02"], G14 = GF["03"], G15 = GF["04"];
    const G23 = GF["12"], G24 = GF["13"], G25 = GF["14"];
    const G34 = GF["23"], G35 = GF["24"], G45 = GF["34"];
    const G23Hi = GH["12"], G24Hi = GH["13"], G25Hi = GH["14"];
    const G34Hi = GH["23"], G35Hi = GH["24"], G45Hi = GH["34"];
    let Gmin = 1;
    for (const k in GF) if (GF[k] < Gmin) Gmin = GF[k];
    // arc corner cosines
    const w1lo = Math.sqrt(Math.max(0, 1 - yOc * yOc));
    const w1hi = sqrtHi(1 - yOa * yOa);
    const xMlo = Math.sqrt(Math.max(0, 1 - yMc * yMc));
    const xMhi = sqrtHi(1 - yMa * yMa);
    const xIlo = Math.sqrt(Math.max(0, 1 - yIc * yIc));
    const xIhi = sqrtHi(1 - yIa * yIa);
    const xJlo = Math.sqrt(Math.max(0, 1 - yJc * yJc));
    const xJhi = sqrtHi(1 - yJa * yJa);
    // ---- LEMMA EPN-4 full nested fold geometry ----
    // level J: fold packets (4,5), local weights (xJ, yJ)
    const FJ = mcF(G45, yJa, yJc);
    const D45hi = sqrtHi(1 + 2 * xJhi * yJc * G45Hi);
    const D45lo = Math.sqrt(1 + 2 * xJlo * yJa * G45) * (1 - 1e-12);
    // level I: fold packet 3 with the {4,5} composite (unit local coeffs
    // a3 = xI, a4 = yI xJ, a5 = yI yJ)
    const [tIlo, tIhi] = foldArc(yIa * D45lo, yIc * D45hi, xIlo, xIhi);
    const G3E = Math.max(Math.min(G34, G35), ((xJlo * G34 + yJa * G35) / D45hi) * (1 - 1e-12));
    const FI = mcF(G3E, tIlo, tIhi);
    const a3lo = xIlo, a3hi = xIhi;
    const a4lo = yIa * xJlo, a4hi = Math.min(1, yIc * xJhi);
    const a5lo = yIa * yJa, a5hi = yIc * yJc;
    const D345hi = sqrtHi(1 + 2 * (a3hi * a4hi * G34Hi + a3hi * a5hi * G35Hi + a4hi * a5hi * G45Hi));
    const D345lo =
      Math.sqrt(1 + 2 * (a3lo * a4lo * G34 + a3lo * a5lo * G35 + a4lo * a5lo * G45)) * (1 - 1e-12);
    // level M: fold packet 2 with the {3,4,5} composite (unit local coeffs
    // b2 = xM, b3 = yM a3, b4 = yM a4, b5 = yM a5)
    const [tMlo, tMhi] = foldArc(yMa * D345lo, yMc * D345hi, xMlo, xMhi);
    const G2E = Math.max(
      Math.min(G23, G24, G25),
      ((a3lo * G23 + a4lo * G24 + a5lo * G25) / D345hi) * (1 - 1e-12)
    );
    const FM = mcF(G2E, tMlo, tMhi);
    const b2lo = xMlo, b2hi = xMhi;
    const b3lo = yMa * a3lo, b3hi = Math.min(1, yMc * a3hi);
    const b4lo = yMa * a4lo, b4hi = Math.min(1, yMc * a4hi);
    const b5lo = yMa * a5lo, b5hi = yMc * a5hi;
    const D2345hi = sqrtHi(
      1 +
        2 *
          (b2hi * b3hi * G23Hi +
            b2hi * b4hi * G24Hi +
            b2hi * b5hi * G25Hi +
            b3hi * b4hi * G34Hi +
            b3hi * b5hi * G35Hi +
            b4hi * b5hi * G45Hi)
    );
    const D2345lo =
      Math.sqrt(
        1 +
          2 *
            (b2lo * b3lo * G23 +
              b2lo * b4lo * G24 +
              b2lo * b5lo * G25 +
              b3lo * b4lo * G34 +
              b3lo * b5lo * G35 +
              b4lo * b5lo * G45)
      ) * (1 - 1e-12);
    // level O: fold packet 1 with the {2..5} composite
    const [tOlo, tOhi] = foldArc(yOa * D2345lo, yOc * D2345hi, w1lo, w1hi);
    const G1E = Math.max(
      Math.min(G12, G13, G14, G15),
      ((b2lo * G12 + b3lo * G13 + b4lo * G14 + b5lo * G15) / D2345hi) * (1 - 1e-12)
    );
    const FO = mcF(G1E, tOlo, tOhi);
    // global weight corners
    const w2lo5 = yOa * xMlo, w2hi5 = Math.min(1, yOc * xMhi);
    const w3lo5 = yOa * yMa * xIlo, w3hi5 = Math.min(1, yOc * yMc * xIhi);
    const w4lo5 = yOa * yMa * yIa * xJlo, w4hi5 = Math.min(1, yOc * yMc * yIc * xJhi);
    const w5lo5 = yOa * yMa * yIa * yJa, w5hi5 = yOc * yMc * yIc * yJc;
    const pertOf = (whi, r) => (whi >= 0.999 ? Infinity : (whi * r) / Math.sqrt(1 - whi * whi));
    // LEMMA QC quotient denominator floor over all five packets
    const wloArr = [w1lo, w2lo5, w3lo5, w4lo5, w5lo5];
    let qcS = 0;
    for (let i = 0; i < 5; i++)
      for (let j = i + 1; j < 5; j++) qcS += wloArr[i] * wloArr[j] * GF[`${i}${j}`];
    const D5lo = Math.sqrt(1 + 2 * qcS) * (1 - 1e-12);
    // ---- capD2: delete packet 2, kept {1,3,4,5} = fold 1 vs {3,4,5} ----
    const [tD2lo, tD2hi] = foldArc(yOa * yMa * D345lo, yOc * yMc * D345hi, w1lo, w1hi);
    const G1E345 = Math.max(
      Math.min(G13, G14, G15),
      ((a3lo * G13 + a4lo * G14 + a5lo * G15) / D345hi) * (1 - 1e-12)
    );
    const FD2 = mcF(G1E345, tD2lo, tD2hi);
    const D2pLo =
      Math.sqrt(
        1 +
          2 *
            (w1lo * w3lo5 * G13 +
              w1lo * w4lo5 * G14 +
              w1lo * w5lo5 * G15 +
              w3lo5 * w4lo5 * G34 +
              w3lo5 * w5lo5 * G35 +
              w4lo5 * w5lo5 * G45)
      ) * (1 - 1e-12);
    // ---- capD3: delete packet 3, kept {1,2,4,5}: fold (4,5) by yJ, then 2
    // with the {4,5} composite (arc ratio yM yI D45 / xM), then 1 ----
    const r245hi = (yMc * yIc * D45hi) / Math.max(1e-300, xMlo);
    const r245lo = (yMa * yIa * D45lo) / Math.max(1e-300, xMhi);
    const t245hi = Math.min(1, (r245hi / Math.hypot(1, r245hi)) * (1 + 1e-12));
    const t245lo = Math.max(0, (r245lo / Math.hypot(1, r245lo)) * (1 - 1e-12));
    const G2E45 = Math.max(Math.min(G24, G25), ((xJlo * G24 + yJa * G25) / D45hi) * (1 - 1e-12));
    const F245 = mcF(G2E45, t245lo, t245hi);
    // {2,4,5} unit local coeffs c = (xM, yM yI xJ, yM yI yJ)/h245,
    // h245 = sqrt(1 - yM^2 (1 - yI^2))
    const c2lo = (xMlo / Math.hypot(xMlo, yMc * yIc)) * (1 - 1e-12);
    const c2hi = Math.min(1, (xMhi / Math.hypot(xMhi, yMa * yIa)) * (1 + 1e-12));
    const c4lo = ((yMa * yIa * xJlo) / Math.hypot(xMhi, yMa * yIa)) * (1 - 1e-12);
    const c4hi = Math.min(1, ((yMc * yIc * xJhi) / Math.hypot(xMlo, yMc * yIc)) * (1 + 1e-12));
    const c5lo = ((yMa * yIa * yJa) / Math.hypot(xMhi, yMa * yIa)) * (1 - 1e-12);
    const c5hi = Math.min(1, ((yMc * yIc * yJc) / Math.hypot(xMlo, yMc * yIc)) * (1 + 1e-12));
    const D245hi = sqrtHi(1 + 2 * (c2hi * c4hi * G24Hi + c2hi * c5hi * G25Hi + c4hi * c5hi * G45Hi));
    const D245lo =
      Math.sqrt(1 + 2 * (c2lo * c4lo * G24 + c2lo * c5lo * G25 + c4lo * c5lo * G45)) * (1 - 1e-12);
    const h245hi = sqrtHi(1 - yMa * yMa * (1 - yIc * yIc));
    const h245lo = Math.sqrt(Math.max(0, 1 - yMc * yMc * (1 - yIa * yIa))) * (1 - 1e-12);
    const [tD3lo, tD3hi] = foldArc(yOa * h245lo * D245lo, yOc * h245hi * D245hi, w1lo, w1hi);
    const G1E245 = Math.max(
      Math.min(G12, G14, G15),
      ((c2lo * G12 + c4lo * G14 + c5lo * G15) / D245hi) * (1 - 1e-12)
    );
    const FD3 = mcF(G1E245, tD3lo, tD3hi);
    const D3pLo =
      Math.sqrt(
        1 +
          2 *
            (w1lo * w2lo5 * G12 +
              w1lo * w4lo5 * G14 +
              w1lo * w5lo5 * G15 +
              w2lo5 * w4lo5 * G24 +
              w2lo5 * w5lo5 * G25 +
              w4lo5 * w5lo5 * G45)
      ) * (1 - 1e-12);
    // ---- capD4: delete packet 4, kept {1,2,3,5}: fold (3,5) by ratio
    // yI yJ / xI, then 2 with {3,5}, then 1 ----
    const r35hi = (yIc * yJc) / Math.max(1e-300, xIlo);
    const r35lo = (yIa * yJa) / Math.max(1e-300, xIhi);
    const t35hi = Math.min(1, (r35hi / Math.hypot(1, r35hi)) * (1 + 1e-12));
    const t35lo = Math.max(0, (r35lo / Math.hypot(1, r35lo)) * (1 - 1e-12));
    const F35 = mcF(G35, t35lo, t35hi);
    const x35lo = Math.sqrt(Math.max(0, 1 - t35hi * t35hi));
    const x35hi = sqrtHi(1 - t35lo * t35lo);
    const D35hi = sqrtHi(1 + 2 * x35hi * t35hi * G35Hi);
    const D35lo = Math.sqrt(1 + 2 * x35lo * t35lo * G35) * (1 - 1e-12);
    const h35hi = sqrtHi(1 - yIa * yIa * (1 - yJc * yJc));
    const h35lo = Math.sqrt(Math.max(0, 1 - yIc * yIc * (1 - yJa * yJa))) * (1 - 1e-12);
    const r235hi = (yMc * h35hi * D35hi) / Math.max(1e-300, xMlo);
    const r235lo = (yMa * h35lo * D35lo) / Math.max(1e-300, xMhi);
    const t235hi = Math.min(1, (r235hi / Math.hypot(1, r235hi)) * (1 + 1e-12));
    const t235lo = Math.max(0, (r235lo / Math.hypot(1, r235lo)) * (1 - 1e-12));
    const G2E35 = Math.max(Math.min(G23, G25), ((x35lo * G23 + t35lo * G25) / D35hi) * (1 - 1e-12));
    const F235 = mcF(G2E35, t235lo, t235hi);
    // {2,3,5} unit local coeffs e = (xM, yM xI, yM yI yJ)/h235,
    // h235 = sqrt(1 - (yM yI)^2 (1 - yJ^2))
    const h235hi = sqrtHi(1 - yMa * yMa * yIa * yIa * (1 - yJc * yJc));
    const h235lo = Math.sqrt(Math.max(0, 1 - yMc * yMc * yIc * yIc * (1 - yJa * yJa))) * (1 - 1e-12);
    const e2lo = (xMlo / h235hi) * (1 - 1e-12);
    const e2hi = Math.min(1, (xMhi / Math.max(1e-300, h235lo)) * (1 + 1e-12));
    const e3lo = ((yMa * xIlo) / h235hi) * (1 - 1e-12);
    const e3hi = Math.min(1, ((yMc * xIhi) / Math.max(1e-300, h235lo)) * (1 + 1e-12));
    const e5lo = ((yMa * yIa * yJa) / h235hi) * (1 - 1e-12);
    const e5hi = Math.min(1, ((yMc * yIc * yJc) / Math.max(1e-300, h235lo)) * (1 + 1e-12));
    const D235hi = sqrtHi(1 + 2 * (e2hi * e3hi * G23Hi + e2hi * e5hi * G25Hi + e3hi * e5hi * G35Hi));
    const D235lo =
      Math.sqrt(1 + 2 * (e2lo * e3lo * G23 + e2lo * e5lo * G25 + e3lo * e5lo * G35)) * (1 - 1e-12);
    const [tD4lo, tD4hi] = foldArc(yOa * h235lo * D235lo, yOc * h235hi * D235hi, w1lo, w1hi);
    const G1E235 = Math.max(
      Math.min(G12, G13, G15),
      ((e2lo * G12 + e3lo * G13 + e5lo * G15) / D235hi) * (1 - 1e-12)
    );
    const FD4 = mcF(G1E235, tD4lo, tD4hi);
    const D4pLo =
      Math.sqrt(
        1 +
          2 *
            (w1lo * w2lo5 * G12 +
              w1lo * w3lo5 * G13 +
              w1lo * w5lo5 * G15 +
              w2lo5 * w3lo5 * G23 +
              w2lo5 * w5lo5 * G25 +
              w3lo5 * w5lo5 * G35)
      ) * (1 - 1e-12);
    // ---- capD5: delete packet 5, kept {1,2,3,4}: fold (3,4) by ratio
    // yI xJ / xI, then 2 with {3,4}, then 1 ----
    const r34hi = (yIc * xJhi) / Math.max(1e-300, xIlo);
    const r34lo = (yIa * xJlo) / Math.max(1e-300, xIhi);
    const t34hi = Math.min(1, (r34hi / Math.hypot(1, r34hi)) * (1 + 1e-12));
    const t34lo = Math.max(0, (r34lo / Math.hypot(1, r34lo)) * (1 - 1e-12));
    const F34d = mcF(G34, t34lo, t34hi);
    const x34lo = Math.sqrt(Math.max(0, 1 - t34hi * t34hi));
    const x34hi = sqrtHi(1 - t34lo * t34lo);
    const D34dhi = sqrtHi(1 + 2 * x34hi * t34hi * G34Hi);
    const D34dlo = Math.sqrt(1 + 2 * x34lo * t34lo * G34) * (1 - 1e-12);
    const h34hi = sqrtHi(1 - yIa * yIa * yJa * yJa);
    const h34lo = Math.sqrt(Math.max(0, 1 - yIc * yIc * yJc * yJc)) * (1 - 1e-12);
    const r234hi = (yMc * h34hi * D34dhi) / Math.max(1e-300, xMlo);
    const r234lo = (yMa * h34lo * D34dlo) / Math.max(1e-300, xMhi);
    const t234hi = Math.min(1, (r234hi / Math.hypot(1, r234hi)) * (1 + 1e-12));
    const t234lo = Math.max(0, (r234lo / Math.hypot(1, r234lo)) * (1 - 1e-12));
    const G2E34d = Math.max(Math.min(G23, G24), ((x34lo * G23 + t34lo * G24) / D34dhi) * (1 - 1e-12));
    const F234 = mcF(G2E34d, t234lo, t234hi);
    // {2,3,4} unit local coeffs f = (xM, yM xI, yM yI xJ)/h234,
    // h234 = sqrt(1 - (yM yI yJ)^2)
    const h234hi = sqrtHi(1 - yMa * yMa * yIa * yIa * yJa * yJa);
    const h234lo = Math.sqrt(Math.max(0, 1 - yMc * yMc * yIc * yIc * yJc * yJc)) * (1 - 1e-12);
    const f2lo = (xMlo / h234hi) * (1 - 1e-12);
    const f2hi = Math.min(1, (xMhi / Math.max(1e-300, h234lo)) * (1 + 1e-12));
    const f3lo = ((yMa * xIlo) / h234hi) * (1 - 1e-12);
    const f3hi = Math.min(1, ((yMc * xIhi) / Math.max(1e-300, h234lo)) * (1 + 1e-12));
    const f4lo = ((yMa * yIa * xJlo) / h234hi) * (1 - 1e-12);
    const f4hi = Math.min(1, ((yMc * yIc * xJhi) / Math.max(1e-300, h234lo)) * (1 + 1e-12));
    const D234dhi = sqrtHi(1 + 2 * (f2hi * f3hi * G23Hi + f2hi * f4hi * G24Hi + f3hi * f4hi * G34Hi));
    const D234dlo =
      Math.sqrt(1 + 2 * (f2lo * f3lo * G23 + f2lo * f4lo * G24 + f3lo * f4lo * G34)) * (1 - 1e-12);
    const [tD5lo, tD5hi] = foldArc(yOa * h234lo * D234dlo, yOc * h234hi * D234dhi, w1lo, w1hi);
    const G1E234 = Math.max(
      Math.min(G12, G13, G14),
      ((f2lo * G12 + f3lo * G13 + f4lo * G14) / D234dhi) * (1 - 1e-12)
    );
    const FD5 = mcF(G1E234, tD5lo, tD5hi);
    const D5pLo =
      Math.sqrt(
        1 +
          2 *
            (w1lo * w2lo5 * G12 +
              w1lo * w3lo5 * G13 +
              w1lo * w4lo5 * G14 +
              w2lo5 * w3lo5 * G23 +
              w2lo5 * w4lo5 * G24 +
              w3lo5 * w4lo5 * G34)
      ) * (1 - 1e-12);
    // ---- capP234: sequential deletion of packets 2,3,4 to the {1,5} pair
    const y15hi = Math.min(1, (w5hi5 / Math.hypot(w1lo, w5hi5)) * (1 + 1e-12));
    const y15lo = Math.max(0, (w5lo5 / Math.hypot(w1hi, w5lo5)) * (1 - 1e-12));
    const F15 = mcF(G15, y15lo, y15hi);
    const s2lo = Math.max(w1lo, Math.sqrt(Math.max(0, 1 - w2hi5 * w2hi5)));
    const w3phi = Math.min(1, w3hi5 / Math.max(1e-300, s2lo));
    const s23lo = Math.max(w1lo, Math.sqrt(Math.max(0, 1 - w2hi5 * w2hi5 - w3hi5 * w3hi5)));
    const w4phi = Math.min(1, w4hi5 / Math.max(1e-300, s23lo));
    const D23qLo =
      Math.sqrt(1 + 2 * (w1lo * w4lo5 * G14 + w1lo * w5lo5 * G15 + w4lo5 * w5lo5 * G45)) * (1 - 1e-12);
    const D234qLo = Math.sqrt(1 + 2 * w1lo * w5lo5 * G15) * (1 - 1e-12);
    const caps5 = null;
    const bondQ = (caps) => {
      const [r1, r2, r3, r4, r5] = caps;
      // full EPN-4 nested fold
      const rJ = Math.min(aySup(r4, r5, G45, yJa, yJc), FJ * Math.max(r4, r5));
      const rI = Math.min(aySup(r3, rJ, G3E, tIlo, tIhi), FI * Math.max(r3, rJ));
      const rM = Math.min(aySup(r2, rI, G2E, tMlo, tMhi), FM * Math.max(r2, rI));
      const full = Math.min(aySup(r1, rM, G1E, tOlo, tOhi), FO * Math.max(r1, rM), kcSup(caps, Gmin));
      const pert2 = pertOf(w2hi5, r2) / D2pLo;
      const pert3 = pertOf(w3hi5, r3) / D3pLo;
      const pert4 = pertOf(w4hi5, r4) / D4pLo;
      const pert5 = pertOf(w5hi5, r5) / D5pLo;
      const capD2 = Math.min(aySup(r1, rI, G1E345, tD2lo, tD2hi), FD2 * Math.max(r1, rI)) + pert2;
      const rM245 = Math.min(aySup(r2, rJ, G2E45, t245lo, t245hi), F245 * Math.max(r2, rJ));
      const capD3 =
        Math.min(aySup(r1, rM245, G1E245, tD3lo, tD3hi), FD3 * Math.max(r1, rM245)) + pert3;
      const rJ35 = Math.min(aySup(r3, r5, G35, t35lo, t35hi), F35 * Math.max(r3, r5));
      const rM235 = Math.min(aySup(r2, rJ35, G2E35, t235lo, t235hi), F235 * Math.max(r2, rJ35));
      const capD4 =
        Math.min(aySup(r1, rM235, G1E235, tD4lo, tD4hi), FD4 * Math.max(r1, rM235)) + pert4;
      const rI34 = Math.min(aySup(r3, r4, G34, t34lo, t34hi), F34d * Math.max(r3, r4));
      const rM234 = Math.min(aySup(r2, rI34, G2E34d, t234lo, t234hi), F234 * Math.max(r2, rI34));
      const capD5 =
        Math.min(aySup(r1, rM234, G1E234, tD5lo, tD5hi), FD5 * Math.max(r1, rM234)) + pert5;
      const capP234 =
        Math.min(aySup(r1, r5, G15, y15lo, y15hi), F15 * Math.max(r1, r5)) +
        pert2 +
        pertOf(w3phi, r3) / D23qLo +
        pertOf(w4phi, r4) / D234qLo;
      const capQC = (w1hi * r1 + w2hi5 * r2 + w3hi5 * r3 + w4hi5 * r4 + w5hi5 * r5) / D5lo;
      return Math.min(full, capD2, capD3, capD4, capD5, capP234, capQC) * (1 + 1e-12);
    };
    const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
    const set = (i, j, x) => { M[i][j] = x; M[j][i] = x; };
    const singles = { [bB]: [vBa, vBc] };
    const sepFromDropped = (bs, vLoTgt, tgtBase) =>
      bandMin((m) => Math.max(vLoTgt, tgtBase * m) - 2 * BASE[bs] * m, [vLoTgt / tgtBase]);
    const sepToDropped = (bs, vHiSrc, srcBase) =>
      bandMin((m) => BASE[bs] * m - Math.min(vHiSrc, 2 * srcBase * m), [vHiSrc / (2 * srcBase)]);
    for (let x = 0; x < 3; x++) {
      for (let y = x + 1; y < 3; y++) {
        if (x === T) {
          const caps =
            y === bA
              ? [0, 1, 2, 3, 4].map((i) => gcap(sepToDropped(y, vhi[i], BASE[T])))
              : [0, 1, 2, 3, 4].map((i) => gcap(pairSepLB(x, y, vhi[i], singles[y][0])));
          set(x, y, bondQ(caps));
        } else if (y === T) {
          const caps =
            x === bA
              ? [0, 1, 2, 3, 4].map((i) => gcap(sepFromDropped(x, vlo[i], BASE[T])))
              : [0, 1, 2, 3, 4].map((i) => gcap(pairSepLB(x, y, singles[x][1], vlo[i])));
          set(x, y, bondQ(caps));
        } else {
          let sep;
          if (x === bA) sep = sepFromDropped(x, singles[y][0], BASE[y]);
          else if (y === bA) sep = sepToDropped(y, singles[x][1], BASE[x]);
          else sep = pairSepLB(x, y, singles[x][1], singles[y][0]);
          set(x, y, gcap(sep));
        }
      }
    }
    for (const c of [3, 4]) {
      for (const bh of [0, 1, 2]) {
        if (bh === T) {
          const caps = [0, 1, 2, 3, 4].map((i) => gcap(tailSepLB(bh, c, vhi[i])));
          set(bh, c, R5 * bondQ(caps));
        } else if (bh === bA) {
          set(bh, c, R5 * gcap(mLo * (BASE[c] - 2 * BASE[bh])));
        } else {
          const sHi = singles[bh][1];
          set(bh, c, R5 * gcap(tailSepLB(bh, c, sHi)));
        }
      }
    }
    set(3, 4, 5 * gcap(mLo * 128));
    return M;
  };
}

function feasible5(T, lo, hi, hasMu) {
  const others = [0, 1, 2].filter((b) => b !== T);
  const axBase = [BASE[T], BASE[T], BASE[T], BASE[T], BASE[T], BASE[others[1]]];
  const clo = lo.slice(0, 6);
  const chi = hi.slice(0, 6);
  for (let k = 1; k < 5; k++) clo[k] = Math.max(clo[k], clo[k - 1]);
  for (let k = 3; k >= 0; k--) chi[k] = Math.min(chi[k], chi[k + 1]);
  for (let k = 0; k < 5; k++) if (clo[k] > chi[k]) return false;
  let mLo = hasMu ? Math.max(RATE_FLOOR, lo[10]) : RATE_FLOOR;
  let mHi = hasMu ? Math.min(MU_CL, hi[10]) : MU_CL;
  for (let k = 0; k < 6; k++) {
    const l = clo[k] / (2 * axBase[k]);
    const h = chi[k] / axBase[k];
    if (l > mLo) mLo = l;
    if (h < mHi) mHi = h;
  }
  return mLo <= mHi * (1 + 1e-12);
}

function cover(cellFn, feasFn, box0, scales, maxCells, tris, maxDepthCap, arcAxes) {
  const v0 = [0.7, 0.7, 0.14, 1e-3, 1e-8];
  const stack = [{ lo: box0.lo, hi: box0.hi, d: 0, v: v0 }];
  let n = 0, worst = -1, maxDepth = 0, unresolved = 0, pruned = 0;
  const dumps = [];
  while (stack.length) {
    const b = stack.pop();
    if (!feasFn(b.lo, b.hi)) { pruned++; continue; }
    const M = cellFn(b);
    let bound = cwRatio(M, b.v);
    let v = b.v;
    if (bound >= 1) {
      v = polish(M, b.v, 60);
      bound = cwRatio(M, v);
    }
    if (bound >= 1) {
      v = v.slice();
      const theta = 0.999;
      for (let it = 0; it < 4; it++) {
        let s3 = TAILSLACK;
        for (let j = 0; j < 5; j++) if (j !== 3) s3 += M[3][j] * v[j];
        v[3] = Math.max(V3_FLOOR, s3 / (theta - M[3][3]));
        let s4 = TAILSLACK;
        for (let j = 0; j < 5; j++) if (j !== 4) s4 += M[4][j] * v[j];
        v[4] = Math.max(V4_FLOOR, s4 / (theta - M[4][4]));
      }
      bound = cwRatio(M, v);
    }
    if (bound < 1) {
      n++;
      if (bound > worst) worst = bound;
      if (b.d > maxDepth) maxDepth = b.d;
      continue;
    }
    if (b.d >= maxDepthCap || n + stack.length > maxCells) {
      unresolved++;
      if (DUMP && dumps.length < 6) dumps.push({ lo: b.lo, hi: b.hi, bound });
      continue;
    }
    let ax = 0, wmax = -1;
    for (let k = 0; k < b.lo.length; k++) {
      let wk = b.hi[k] - b.lo[k];
      if (arcAxes && arcAxes.includes(k)) {
        const xw =
          Math.sqrt(Math.max(0, 1 - b.lo[k] * b.lo[k])) - Math.sqrt(Math.max(0, 1 - b.hi[k] * b.hi[k]));
        if (xw > wk) wk = xw;
      }
      const w = wk / scales[k];
      if (w > wmax) { wmax = w; ax = k; }
    }
    const m = (b.lo[ax] + b.hi[ax]) / 2;
    const c1 = { lo: [...b.lo], hi: [...b.hi], d: b.d + 1, v };
    c1.hi[ax] = m;
    const c2 = { lo: [...b.lo], hi: [...b.hi], d: b.d + 1, v };
    c2.lo[ax] = m;
    for (const c of [c1, c2]) {
      let ok = true;
      for (const [a1, a2] of tris) {
        if (c.lo[a1] > c.hi[a2]) { ok = false; break; }
      }
      if (ok) stack.push(c);
    }
  }
  if (DUMP) for (const d of dumps) console.log("UNRESOLVED:", JSON.stringify(d));
  return { cells: n, worst, maxDepth, unresolved, pruned };
}

function runCoverHybrid5(T, maxCells) {
  const others = [0, 1, 2].filter((b) => b !== T);
  const rng = (bb) => [BASE[bb] * RATE_FLOOR, 2 * BASE[bb] * MU_CL];
  const [h1, h2] = rng(T);
  const [b1, b2] = rng(others[1]);
  const w = h2 - h1;
  const lo = [h1, h1, h1, h1, h1, b1, 0, 0, 0, 0, RATE_FLOOR];
  const hi = [h2, h2, h2, h2, h2, b2, 1, 1, 1, 1, MU_CL];
  const scales = [
    w * 0.35, w * 0.35, w * 0.35, w * 0.35, w * 0.35,
    (b2 - b1) * 0.35, 1.4, 1.1, 1.1, 1.1, 0.2,
  ];
  return cover(
    makeCellV5(T, true),
    (l, h) => feasible5(T, l, h, true),
    { lo, hi },
    scales,
    maxCells,
    [[0, 1], [1, 2], [2, 3], [3, 4]],
    110,
    [6, 7, 8, 9]
  );
}

// LEMMA RM-QN: penalty-free closure at 19/20 (sqrt(5)-inflated)
function rmQn() {
  const t = [
    [0, 2, 14, 62, 254],
    [2, 0, 8, 56, 248],
    [14, 8, 0, 32, 224],
    [62, 56, 32, 0, 128],
    [254, 248, 224, 128, 0],
  ];
  const M = t.map((row, i) =>
    row.map((x, j) => (x === 0 ? 0 : (i === 3 && j === 4) || (i === 4 && j === 3) ? 5 * gcap(MU_CL * x) : R5 * gcap(MU_CL * x)))
  );
  const v = polish(M, [0.7, 0.7, 0.14, 1e-3, 1e-8], 400);
  return cwRatio(M, v);
}

if (process.env.BAT) {
  // ---- battery 1: LEMMA EPN-4 parametrization identity ----
  let seedState = 515151;
  const rnd = () => { seedState = (seedState * 1103515245 + 12345) & 0x7fffffff; return seedState / 0x7fffffff; };
  let idViol = 0, idWorst = 0;
  for (let t = 0; t < 4000; t++) {
    const yO = rnd(), yM = rnd(), yI = rnd(), yJ = rnd();
    const w1 = Math.sqrt(1 - yO * yO);
    const w2 = yO * Math.sqrt(1 - yM * yM);
    const w3 = yO * yM * Math.sqrt(1 - yI * yI);
    const w4 = yO * yM * yI * Math.sqrt(1 - yJ * yJ);
    const w5 = yO * yM * yI * yJ;
    const d = Math.abs(w1 * w1 + w2 * w2 + w3 * w3 + w4 * w4 + w5 * w5 - 1);
    if (d > 1e-12) idViol++;
    if (d > idWorst) idWorst = d;
    // inverse map (surjectivity onto the nonneg sphere octant)
    const a = [rnd(), rnd(), rnd(), rnd(), rnd()];
    const n = Math.hypot(...a);
    const u = a.map((x) => x / n);
    const yOr = Math.hypot(u[1], u[2], u[3], u[4]);
    const yMr = yOr < 1e-15 ? 0 : Math.hypot(u[2], u[3], u[4]) / yOr;
    const yIr = yOr * yMr < 1e-15 ? 0 : Math.hypot(u[3], u[4]) / (yOr * yMr);
    const yJr = yOr * yMr * yIr < 1e-15 ? 0 : u[4] / (yOr * yMr * yIr);
    const r1 = Math.sqrt(Math.max(0, 1 - yOr * yOr));
    const r2 = yOr * Math.sqrt(Math.max(0, 1 - yMr * yMr));
    const r3 = yOr * yMr * Math.sqrt(Math.max(0, 1 - yIr * yIr));
    const r4 = yOr * yMr * yIr * Math.sqrt(Math.max(0, 1 - yJr * yJr));
    const r5 = yOr * yMr * yIr * yJr;
    const rec = [r1, r2, r3, r4, r5];
    for (let i = 0; i < 5; i++) {
      const dd = Math.abs(rec[i] - u[i]);
      if (dd > 1e-9) idViol++;
      if (dd > idWorst) idWorst = dd;
    }
  }
  console.log("EPN4-identity:", JSON.stringify({ idViol, idWorst }));

  // ---- battery 2: cap domination - seeded true 5-packet configs vs
  // enclosing v-cells in production mode T at RATE_FLOOR ----
  seedState = 747474 + T;
  const others = [0, 1, 2].filter((b) => b !== T);
  const bA = others[0], bB = others[1];
  let viol = 0, feasViol = 0, worst = -Infinity, count = 0;
  const cellFn = makeCellV5(T, true);
  for (let t = 0; t < 3000; t++) {
    const mu = RATE_FLOOR + rnd() * (MU_CL - RATE_FLOOR);
    const us = [0, 0, 0, 0, 0].map(() => BASE[T] * (1 + rnd())).sort((a, b) => a - b);
    const uB = BASE[bB] * (1 + rnd());
    const uA = 1 + rnd(); // dropped single sampled ANYWHERE in its block
    const yO = rnd(), yM = rnd(), yI = rnd(), yJ = rnd();
    const dv = 0.001 + rnd() * 0.05;
    const dy = 0.001 + rnd() * 0.02;
    const vs = us.map((u) => mu * u);
    const vA = mu * uA * BASE[bA];
    const vB = mu * uB;
    const pos = [vs[0], vs[1], vs[2], vs[3], vs[4], vB];
    const arcs = [yO, yM, yI, yJ];
    const lo = pos.map((x) => x - dv * rnd()).concat(arcs.map((y) => Math.max(0, y - dy * rnd())));
    const hi = pos.map((x) => x + dv * rnd()).concat(arcs.map((y) => Math.min(1, y + dy * rnd())));
    for (let k = 1; k < 5; k++) {
      if (lo[k] < lo[k - 1]) lo[k] = lo[k - 1];
      if (hi[k] < hi[k - 1]) hi[k] = hi[k - 1];
    }
    const dm = 0.001 + rnd() * 0.02;
    lo.push(Math.max(RATE_FLOOR, mu - dm * rnd()));
    hi.push(Math.min(MU_CL, mu + dm * rnd()));
    if (!feasible5(T, lo, hi, true)) { feasViol++; continue; }
    const M = cellFn({ lo, hi });
    const w1 = Math.sqrt(1 - yO * yO);
    const w2 = yO * Math.sqrt(1 - yM * yM);
    const w3 = yO * yM * Math.sqrt(1 - yI * yI);
    const w4 = yO * yM * yI * Math.sqrt(1 - yJ * yJ);
    const w5 = yO * yM * yI * yJ;
    const wv = [w1, w2, w3, w4, w5];
    const rho = (a, b) => gFun(Math.abs(a - b));
    let s = 0;
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) s += wv[i] * wv[j] * rho(vs[i], vs[j]);
    const D1 = Math.sqrt(1 + 2 * s);
    const bond = (tgtV) => {
      let bn = 0;
      for (let i = 0; i < 5; i++) bn += wv[i] * rho(vs[i], tgtV);
      return bn / D1;
    };
    const idx = { [bA]: vA, [bB]: vB };
    const checks = [];
    for (let x = 0; x < 3; x++) {
      for (let y = x + 1; y < 3; y++) {
        if (x === T) checks.push([bond(idx[y]), M[x][y]]);
        else if (y === T) checks.push([bond(idx[x]), M[x][y]]);
        else checks.push([rho(idx[x], idx[y]), M[x][y]]);
      }
    }
    for (const c of [3, 4]) {
      const edgeV = mu * BASE[c];
      for (const bh of [0, 1, 2]) {
        if (bh === T) checks.push([R5 * bond(edgeV) / (1 + 1e-9), M[bh][c]]);
        else checks.push([R5 * rho(idx[bh], edgeV) / (1 + 1e-9), M[bh][c]]);
      }
    }
    checks.push([5 * rho(mu * 128, mu * 256) / (1 + 1e-9), M[3][4]]);
    for (const [tr, cap] of checks) {
      const r = tr / Math.max(cap, 1e-30);
      if (r > 1 + 1e-9) viol++;
      if (r > worst) worst = r;
    }
    count++;
  }
  console.log("cap-domination:", JSON.stringify({ T, floor: RATE_FLOOR, viol, feasViol, worst, count }));

  // ---- battery 3: witness E <= 0 at the floor (both parities, heavy
  // block up to 5 packets at every relative position) ----
  function kernelK(a, b, tau) {
    if (Math.abs(a - b) < 1e-9 * (a + b)) {
      const m = 0.5 * (a + b);
      return (Math.exp(-m * tau) * (1 + m * tau)) / m;
    }
    return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
  }
  seedState = 838383;
  let maxE = -Infinity, wViol = 0, wCount = 0;
  for (let t = 0; t < 5000; t++) {
    const odd = t % 2 === 1;
    const heavy = Math.floor(rnd() * 7);
    const occupied = [];
    for (let b = 0; b < 7; b++) if (b === heavy || rnd() >= 0.3) occupied.push(b);
    const mu = t % 3 === 0 ? RATE_FLOOR : RATE_FLOOR * (1 + 2 * rnd());
    const us = [], as = [], blocks = [];
    for (const b of occupied) {
      const base = Math.pow(4, b) * (odd ? 2 : 1);
      const reps = b === heavy ? 1 + Math.floor(rnd() * 5) : 1;
      for (let r = 0; r < reps; r++) {
        us.push(base * (1 + rnd()));
        as.push(rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd()));
        blocks.push(b);
      }
    }
    if (as.length === 0 || as.every((v) => v === 0)) continue;
    let E = 0;
    for (let i = 0; i < us.length; i++) E -= (as[i] * as[i]) / mu;
    for (let i = 0; i < us.length; i++) {
      for (let j = i + 1; j < us.length; j++) {
        const sgn = blocks[i] === blocks[j] ? -1 : 1;
        E += 2 * sgn * as[i] * as[j] * kernelK(mu, mu, Math.abs(us[i] - us[j]));
      }
    }
    if (E > maxE) maxE = E;
    if (E > 0) wViol++;
    wCount++;
  }
  console.log("witness:", JSON.stringify({ floor: RATE_FLOOR, maxE, wViol, wCount }));
  console.log("RM-QN at 19/20:", rmQn());
  process.exit(0);
}

const t0 = Date.now();
const res = runCoverHybrid5(T, BUDGET);
console.log(
  JSON.stringify({
    T,
    floor: RATE_FLOOR,
    budget: BUDGET,
    ...res,
    rmQn: rmQn(),
    secs: ((Date.now() - t0) / 1000).toFixed(1),
  })
);
