// imp-95152 offline cover runner (heavy-compute lane; single-threaded,
// deterministic, bit-reproducible - no randomness in the cover path).
// The imp-95150 PD2 v-chart hybrid machinery UNCHANGED, plus LEMMA TF
// (test-vector-field fan): when a cell fails the fixed-vector certificate
// (post polish + tail-solve), probe S=2 directional fans along a fixed
// candidate-axis list; a fan whose slabs all certify retires the cell (each
// slab is a sub-box of the cell certified by the SAME cap machinery with
// its OWN test vector - a piecewise-constant position-dependent test-vector
// field; the slabs partition the cell along one axis, so the union covers
// it). If no S=2 fan retires, escalate the measured-best axis to S=4; if
// that still fails, push the failing slabs of the best axis as children
// (certified slabs retired) - the split direction is measured, not blind.
// With TF=0 the code path is bit-identical to the imp-95150 runner.
//
// Usage: node scripts/imp-95152-tf-fan-offline-cover.mjs T FLOOR BUDGET PD2 DUMP TF [GATE]
//   T = 1 (heavy block at middle head position) or 2 (highest head position)
//   FLOOR = rate floor, BUDGET = max cells, PD2 = 1/0, DUMP = 1/0,
//   TF = 0 off (bit-identical to imp-95150) / 1 full / 2 retire-only,
//   GATE = TF bound gate (default 1.05)
// A/B RECORD at the 47/200 middle wall, T=1, budget 6e6 (baseline
// imp-95150 runner: 62 unresolved, ~100 s):
//   TF=1 GATE=1.05: 489 unresolved, 208 s, 28.1M fan evals - NET-NEGATIVE
//   TF=1 GATE=1.01: stack blowup via the 4-ary pushes (6.28M unresolved
//                   in the drain), 538 s - CATASTROPHIC
//   TF=2 GATE=1.05: 59 unresolved, 459 s, 49.4M fan evals - count-neutral
//                   (59 vs 62) at 4.6x cost - NIL
// Verdict: the piecewise test-vector field is SOUND and flips the recorded
// stall cells locally (see the imp-95152 module demos) but does NOT shrink
// the cover tree; the 47/200 wall is total-tree-size, not local
// resolvability.
// BAT=1 env runs the seeded cap-domination + witness batteries instead.
const argv = process.argv.slice(2);
const T = parseInt(argv[0] ?? "2", 10);
const FLOOR_NUM = parseFloat(argv[1] ?? "0.236");
const BUDGET = parseFloat(argv[2] ?? "9e6");
const USE_PD2 = (argv[3] ?? "1") === "1";
const DUMP = (argv[4] ?? "0") === "1";
// TF modes: 0 = off (bit-identical to the imp-95150 runner), 1 = full
// (S=2 probes + best-axis S=4 escalation, failing slabs pushed as the
// children), 2 = retire-only (S=2 probes retire complete fans; any failure
// falls back to the blind binary split - isolates the retire mechanism
// from the measured-direction push)
const TF_MODE = parseInt(argv[5] ?? "1", 10);
const USE_TF = TF_MODE > 0;
const TF_GATE = parseFloat(argv[6] ?? "1.05");
// candidate fan axes, priority-ordered from the imp-95151 stall-cell probe:
// yM (6) and the heaviest packet position v4 (3) carry the ridge conflict,
// then yI (7), v2 (1), yO (5)
const TF_AXES = [6, 3, 7, 1, 5];

let RATE_FLOOR = FLOOR_NUM;
const MU_CL = 9 / 10;
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
const R4 = sqrtHi(4);

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

function makeCellV(T, dropA, dropB, hasMu) {
  const others = [0, 1, 2].filter((b) => b !== T);
  const bA = others[0], bB = others[1];
  return function cellV(b) {
    let p = 4;
    let [v1a, v2a, v3a, v4a] = b.lo;
    let [v1c, v2c, v3c, v4c] = b.hi;
    let vAa = 0, vAc = 0, vBa = 0, vBc = 0;
    if (!dropA) { vAa = b.lo[p]; vAc = b.hi[p]; p++; }
    if (!dropB) { vBa = b.lo[p]; vBc = b.hi[p]; p++; }
    const [yOa, yMa, yIa] = [b.lo[p], b.lo[p + 1], b.lo[p + 2]];
    const [yOc, yMc, yIc] = [b.hi[p], b.hi[p + 1], b.hi[p + 2]];
    const muAxLo = hasMu ? b.lo[p + 3] : RATE_FLOOR;
    const muAxHi = hasMu ? b.hi[p + 3] : MU_CL;
    v2a = Math.max(v2a, v1a);
    v3a = Math.max(v3a, v2a);
    v4a = Math.max(v4a, v3a);
    v3c = Math.min(v3c, v4c);
    v2c = Math.min(v2c, v3c);
    v1c = Math.min(v1c, v2c);
    let mLo = Math.max(RATE_FLOOR, muAxLo);
    let mHi = Math.min(MU_CL, muAxHi);
    const axBase = [BASE[T], BASE[T], BASE[T], BASE[T]];
    const los = [v1a, v2a, v3a, v4a];
    const his = [v1c, v2c, v3c, v4c];
    if (!dropA) { axBase.push(BASE[bA]); los.push(vAa); his.push(vAc); }
    if (!dropB) { axBase.push(BASE[bB]); los.push(vBa); his.push(vBc); }
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
    const G12 = gLo(sepV(v2c, v1a));
    const G13 = gLo(sepV(v3c, v1a));
    const G14 = gLo(sepV(v4c, v1a));
    const G23 = gLo(sepV(v3c, v2a));
    const G24 = gLo(sepV(v4c, v2a));
    const G34 = gLo(sepV(v4c, v3a));
    const Gmin = Math.min(G12, G13, G14, G23, G24, G34);
    const FI = mcF(G34, yIa, yIc);
    const G34hi = Math.min(1, gcap(Math.max(0, v4a - v3c)));
    const w3Ilo = Math.sqrt(Math.max(0, 1 - yIc * yIc));
    const w3Ihi = sqrtHi(1 - yIa * yIa);
    const D34hi2 = sqrtHi(1 + 2 * w3Ihi * yIc * G34hi);
    const D34lo = Math.sqrt(1 + 2 * w3Ilo * yIa * G34) * (1 - 1e-12);
    const G2E = Math.max(Math.min(G23, G24), ((w3Ilo * G23 + yIa * G24) / D34hi2) * (1 - 1e-12));
    const w2Mhi = sqrtHi(1 - yMa * yMa);
    const w2Mlo = Math.sqrt(Math.max(0, 1 - yMc * yMc));
    const n2Hi = yMc * D34hi2;
    const n2Lo = yMa * D34lo;
    const ty2Hi = Math.min(1, (n2Hi / Math.hypot(w2Mlo, n2Hi)) * (1 + 1e-12));
    const ty2Lo = Math.max(0, (n2Lo / Math.hypot(w2Mhi, n2Lo)) * (1 - 1e-12));
    const FM = mcF(G2E, ty2Lo, ty2Hi);
    const w3lo = yMa * w3Ilo;
    const w3hi = yMc * w3Ihi;
    const w4lo = yMa * yIa;
    const w4hi = yMc * yIc;
    const G23hi = Math.min(1, gcap(Math.max(0, v3a - v2c)));
    const G24hi = Math.min(1, gcap(Math.max(0, v4a - v2c)));
    const D234hi = sqrtHi(1 + 2 * (w2Mhi * w3hi * G23hi + w2Mhi * w4hi * G24hi + w3hi * w4hi * G34hi));
    const D234lo =
      Math.sqrt(1 + 2 * (w2Mlo * w3lo * G23 + w2Mlo * w4lo * G24 + w3lo * w4lo * G34)) * (1 - 1e-12);
    const G1E = Math.max(
      Math.min(G12, G13, G14),
      ((w2Mlo * G12 + w3lo * G13 + w4lo * G14) / D234hi) * (1 - 1e-12)
    );
    const w1hi = sqrtHi(1 - yOa * yOa);
    const w1lo = Math.sqrt(Math.max(0, 1 - yOc * yOc));
    const n3Hi = yOc * D234hi;
    const n3Lo = yOa * D234lo;
    const ty3Hi = Math.min(1, (n3Hi / Math.hypot(w1lo, n3Hi)) * (1 + 1e-12));
    const ty3Lo = Math.max(0, (n3Lo / Math.hypot(w1hi, n3Lo)) * (1 - 1e-12));
    const FO = mcF(G1E, ty3Lo, ty3Hi);
    const w2hi4 = Math.min(1, yOc * sqrtHi(1 - yMa * yMa));
    const w3hi4 = Math.min(1, yOc * yMc * sqrtHi(1 - yIa * yIa));
    const pertOf = (whi, r) => (whi >= 0.999 ? Infinity : (whi * r) / Math.sqrt(1 - whi * whi));
    const g34Hi = yOc * yMc * D34hi2;
    const g34Lo = yOa * yMa * D34lo;
    const tD2Hi = Math.min(1, (g34Hi / Math.hypot(w1lo, g34Hi)) * (1 + 1e-12));
    const tD2Lo = Math.max(0, (g34Lo / Math.hypot(w1hi, g34Lo)) * (1 - 1e-12));
    const G1E34 = Math.max(Math.min(G13, G14), ((w3Ilo * G13 + yIa * G14) / D34hi2) * (1 - 1e-12));
    const FD2 = mcF(G1E34, tD2Lo, tD2Hi);
    const r24Hi = (yMc * yIc) / Math.max(1e-300, Math.sqrt(Math.max(0, 1 - yMc * yMc)));
    const r24Lo = (yMa * yIa) / Math.max(1e-300, sqrtHi(1 - yMa * yMa));
    const y24Hi = Math.min(1, (r24Hi / Math.hypot(1, r24Hi)) * (1 + 1e-12));
    const y24Lo = Math.max(0, (r24Lo / Math.hypot(1, r24Lo)) * (1 - 1e-12));
    const F24 = mcF(G24, y24Lo, y24Hi);
    const w2I24lo = Math.sqrt(Math.max(0, 1 - y24Hi * y24Hi));
    const w2I24hi = sqrtHi(1 - y24Lo * y24Lo);
    const G24capHi = Math.min(1, gcap(Math.max(0, v4a - v2c)));
    const D24hi = sqrtHi(1 + 2 * w2I24hi * y24Hi * G24capHi);
    const D24lo = Math.sqrt(1 + 2 * w2I24lo * y24Lo * G24) * (1 - 1e-12);
    const g24Hi = yOc * sqrtHi(1 - yMa * yMa * (1 - yIc * yIc)) * D24hi;
    const g24Lo = yOa * Math.sqrt(Math.max(0, 1 - yMc * yMc * (1 - yIa * yIa))) * D24lo;
    const tD3Hi = Math.min(1, (g24Hi / Math.hypot(w1lo, g24Hi)) * (1 + 1e-12));
    const tD3Lo = Math.max(0, (g24Lo / Math.hypot(w1hi, g24Lo)) * (1 - 1e-12));
    const G1E24 = Math.max(Math.min(G12, G14), ((w2I24lo * G12 + y24Lo * G14) / D24hi) * (1 - 1e-12));
    const FD3 = mcF(G1E24, tD3Lo, tD3Hi);
    const w4hi4 = yOc * yMc * yIc;
    const w4lo4 = yOa * yMa * yIa;
    const y14Hi = Math.min(1, (w4hi4 / Math.hypot(w1lo, w4hi4)) * (1 + 1e-12));
    const y14Lo = Math.max(0, (w4lo4 / Math.hypot(w1hi, w4lo4)) * (1 - 1e-12));
    const F14 = mcF(G14, y14Lo, y14Hi);
    const s2lo = Math.max(w1lo, Math.sqrt(Math.max(0, 1 - w2hi4 * w2hi4)));
    const w3phi = Math.min(1, w3hi4 / Math.max(1e-300, s2lo));
    const w1loQ = w1lo;
    const w2loQ = yOa * w2Mlo;
    const w3loQ = yOa * yMa * w3Ilo;
    const w4loQ = yOa * yMa * yIa;
    const D4lo = Math.sqrt(
      1 +
        2 *
          (w1loQ * w2loQ * G12 +
            w1loQ * w3loQ * G13 +
            w1loQ * w4loQ * G14 +
            w2loQ * w3loQ * G23 +
            w2loQ * w4loQ * G24 +
            w3loQ * w4loQ * G34)
    ) * (1 - 1e-12);
    // LEMMA PD2 floors: deleted-config renormalized norm floors (>= 1)
    let D2pLo = 1, D3pLo = 1, D23pLo = 1;
    if (USE_PD2) {
      D2pLo = Math.sqrt(1 + 2 * (w1loQ * w3loQ * G13 + w1loQ * w4loQ * G14 + w3loQ * w4loQ * G34)) * (1 - 1e-12);
      D3pLo = Math.sqrt(1 + 2 * (w1loQ * w2loQ * G12 + w1loQ * w4loQ * G14 + w2loQ * w4loQ * G24)) * (1 - 1e-12);
      D23pLo = Math.sqrt(1 + 2 * w1loQ * w4loQ * G14) * (1 - 1e-12);
    }
    const w4hi4c = yOc * yMc * yIc;
    const vlo = [v1a, v2a, v3a, v4a];
    const vhi = [v1c, v2c, v3c, v4c];
    const bondQ = (caps) => {
      const [r1, r2, r3, r4] = caps;
      const rI = Math.min(aySup(r3, r4, G34, yIa, yIc), FI * Math.max(r3, r4));
      const rM = Math.min(aySup(r2, rI, G2E, ty2Lo, ty2Hi), FM * Math.max(r2, rI));
      const full = Math.min(aySup(r1, rM, G1E, ty3Lo, ty3Hi), FO * Math.max(r1, rM), kcSup(caps, Gmin));
      const pert2 = pertOf(w2hi4, r2) / D2pLo;
      const pert3 = pertOf(w3hi4, r3) / D3pLo;
      const pert3p = pertOf(w3phi, r3) / D23pLo;
      const capD2 = Math.min(aySup(r1, rI, G1E34, tD2Lo, tD2Hi), FD2 * Math.max(r1, rI)) + pert2;
      const rI24 = Math.min(aySup(r2, r4, G24, y24Lo, y24Hi), F24 * Math.max(r2, r4));
      const capD3 = Math.min(aySup(r1, rI24, G1E24, tD3Lo, tD3Hi), FD3 * Math.max(r1, rI24)) + pert3;
      const capP23 = Math.min(aySup(r1, r4, G14, y14Lo, y14Hi), F14 * Math.max(r1, r4)) + pert2 + pert3p;
      const capQC = (w1hi * r1 + w2hi4 * r2 + w3hi4 * r3 + w4hi4c * r4) / D4lo;
      return Math.min(full, capD2, capD3, capP23, capQC) * (1 + 1e-12);
    };
    const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
    const set = (i, j, x) => { M[i][j] = x; M[j][i] = x; };
    const dropped = {};
    if (dropA) dropped[bA] = true;
    if (dropB) dropped[bB] = true;
    const singles = { [bA]: [vAa, vAc], [bB]: [vBa, vBc] };
    const sepFromDropped = (bs, vLoTgt, tgtBase) =>
      bandMin((m) => Math.max(vLoTgt, tgtBase * m) - 2 * BASE[bs] * m, [vLoTgt / tgtBase]);
    const sepToDropped = (bs, vHiSrc, srcBase) =>
      bandMin((m) => BASE[bs] * m - Math.min(vHiSrc, 2 * srcBase * m), [vHiSrc / (2 * srcBase)]);
    for (let x = 0; x < 3; x++) {
      for (let y = x + 1; y < 3; y++) {
        if (x === T) {
          const caps = dropped[y]
            ? [0, 1, 2, 3].map((i) => gcap(sepToDropped(y, vhi[i], BASE[T])))
            : [0, 1, 2, 3].map((i) => gcap(pairSepLB(x, y, vhi[i], singles[y][0])));
          set(x, y, bondQ(caps));
        } else if (y === T) {
          const caps = dropped[x]
            ? [0, 1, 2, 3].map((i) => gcap(sepFromDropped(x, vlo[i], BASE[T])))
            : [0, 1, 2, 3].map((i) => gcap(pairSepLB(x, y, singles[x][1], vlo[i])));
          set(x, y, bondQ(caps));
        } else {
          let sep;
          if (dropped[x] && dropped[y]) {
            sep = mLo * (BASE[y] - 2 * BASE[x]);
          } else if (dropped[x]) {
            sep = sepFromDropped(x, singles[y][0], BASE[y]);
          } else if (dropped[y]) {
            sep = sepToDropped(y, singles[x][1], BASE[x]);
          } else {
            sep = pairSepLB(x, y, singles[x][1], singles[y][0]);
          }
          set(x, y, gcap(sep));
        }
      }
    }
    for (const c of [3, 4]) {
      for (const bh of [0, 1, 2]) {
        if (bh === T) {
          const caps = [0, 1, 2, 3].map((i) => gcap(tailSepLB(bh, c, vhi[i])));
          set(bh, c, R4 * bondQ(caps));
        } else if (dropped[bh]) {
          set(bh, c, R4 * gcap(mLo * (BASE[c] - 2 * BASE[bh])));
        } else {
          const sHi = singles[bh][1];
          set(bh, c, R4 * gcap(tailSepLB(bh, c, sHi)));
        }
      }
    }
    set(3, 4, 4 * gcap(mLo * 128));
    return M;
  };
}

function feasible(T, lo, hi, dropA, dropB, hasMu) {
  const others = [0, 1, 2].filter((b) => b !== T);
  const axBase = [BASE[T], BASE[T], BASE[T], BASE[T]];
  if (!dropA) axBase.push(BASE[others[0]]);
  if (!dropB) axBase.push(BASE[others[1]]);
  const nPos = axBase.length;
  const clo = lo.slice(0, nPos);
  const chi = hi.slice(0, nPos);
  for (let k = 1; k < 4; k++) clo[k] = Math.max(clo[k], clo[k - 1]);
  for (let k = 2; k >= 0; k--) chi[k] = Math.min(chi[k], chi[k + 1]);
  for (let k = 0; k < 4; k++) if (clo[k] > chi[k]) return false;
  let mLo = hasMu ? Math.max(RATE_FLOOR, lo[lo.length - 1]) : RATE_FLOOR;
  let mHi = hasMu ? Math.min(MU_CL, hi[hi.length - 1]) : MU_CL;
  for (let k = 0; k < clo.length; k++) {
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
  let fanEvals = 0, fanRetired2 = 0, fanRetired4 = 0, fanPushed = 0;
  const dumps = [];
  // fixed-vector certificate sequence (identical to the imp-95150 runner):
  // seed cwRatio, then LEMMA PS polish(60), then LEMMA TS tail-solve
  const evalBox = (bb) => {
    const M = cellFn(bb);
    let bound = cwRatio(M, bb.v);
    let v = bb.v;
    if (bound >= 1) {
      v = polish(M, bb.v, 60);
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
    return { bound, v };
  };
  // LEMMA TF: evaluate an S-slab fan of cell b along axis ax; each feasible
  // slab gets its own test vector (warm-chained); infeasible slabs contain
  // no valid config. Returns per-slab records.
  const fanEval = (b, ax, S, vSeed) => {
    const slabs = [];
    let worstF = -Infinity, nBad = 0;
    let seed = vSeed;
    for (let k = 0; k < S; k++) {
      const lo = b.lo.slice(), hi = b.hi.slice();
      // outer endpoints CLAMPED to the exact cell corners (soundness: the float
      // expression lo+((hi-lo)*S)/S can land one ulp below hi, leaving a sliver
      // of the cell uncovered by the slab union); interior endpoints share the
      // identical float expression between adjacent slabs - no interior gap.
      // NOTE: the header A/B cost record was measured BEFORE this clamp; the
      // clamp changes retirement decisions only in ulp-measure and TF is OFF in
      // every production cover, so no recorded constant depends on it.
      lo[ax] = k === 0 ? b.lo[ax] : b.lo[ax] + ((b.hi[ax] - b.lo[ax]) * k) / S;
      hi[ax] = k === S - 1 ? b.hi[ax] : b.lo[ax] + ((b.hi[ax] - b.lo[ax]) * (k + 1)) / S;
      if (!feasFn(lo, hi)) { slabs.push(null); continue; }
      fanEvals++;
      const r = evalBox({ lo, hi, v: seed });
      seed = r.v;
      slabs.push({ lo, hi, bound: r.bound, v: r.v });
      if (r.bound >= 1) nBad++;
      if (r.bound > worstF) worstF = r.bound;
    }
    return { slabs, worstF, nBad };
  };
  while (stack.length) {
    const b = stack.pop();
    if (!feasFn(b.lo, b.hi)) { pruned++; continue; }
    const { bound, v } = evalBox(b);
    if (bound < 1) {
      n++;
      if (bound > worst) worst = bound;
      if (b.d > maxDepth) maxDepth = b.d;
      continue;
    }
    if (
      USE_TF && bound < TF_GATE && b.d < maxDepthCap &&
      n + stack.length <= maxCells
    ) {
      // stage 1: S=2 probe fan on each candidate axis
      let bestAx = -1, bestWorst = Infinity, retired = false;
      for (const ax of TF_AXES) {
        if (!(b.hi[ax] - b.lo[ax] > 1e-12)) continue;
        const f = fanEval(b, ax, 2, v);
        if (f.nBad === 0) {
          for (const s of f.slabs) {
            if (!s) { pruned++; continue; }
            n++;
            if (s.bound > worst) worst = s.bound;
          }
          if (b.d + 1 > maxDepth) maxDepth = b.d + 1;
          fanRetired2++;
          retired = true;
          break;
        }
        if (f.worstF < bestWorst) { bestWorst = f.worstF; bestAx = ax; }
      }
      if (retired) continue;
      if (TF_MODE === 2) {
        // retire-only mode: no measured push; fall through to the blind
        // binary split below
      } else if (bestAx >= 0) {
        // stage 2: escalate the measured-best axis to S=4; certified slabs
        // retire, failing slabs become the children (measured split
        // direction replaces the blind max-width split)
        const f4 = fanEval(b, bestAx, 4, v);
        let anyPushed = false;
        for (const s of f4.slabs) {
          if (!s) { pruned++; continue; }
          if (s.bound < 1) {
            n++;
            if (s.bound > worst) worst = s.bound;
            continue;
          }
          let ok = true;
          for (const [a1, a2] of tris) {
            if (s.lo[a1] > s.hi[a2]) { ok = false; break; }
          }
          if (ok) {
            stack.push({ lo: s.lo, hi: s.hi, d: b.d + 2, v: s.v });
            anyPushed = true;
          }
        }
        if (b.d + 2 > maxDepth) maxDepth = b.d + 2;
        if (f4.nBad === 0) fanRetired4++;
        else if (anyPushed) fanPushed++;
        continue;
      }
    }
    if (b.d >= maxDepthCap || n + stack.length > maxCells) {
      unresolved++;
      if (DUMP && dumps.length < 6) {
        dumps.push({ lo: b.lo, hi: b.hi, bound });
        globalThis.__dumps = dumps;
      }
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
  return {
    cells: n, worst, maxDepth, unresolved, pruned,
    fanEvals, fanRetired2, fanRetired4, fanPushed,
  };
}

function runCoverHybrid(T, maxCells) {
  const others = [0, 1, 2].filter((b) => b !== T);
  const rng = (bb) => [BASE[bb] * RATE_FLOOR, 2 * BASE[bb] * MU_CL];
  const [h1, h2] = rng(T);
  const [b1, b2] = rng(others[1]);
  const w = h2 - h1;
  const lo = [h1, h1, h1, h1, b1, 0, 0, 0, RATE_FLOOR];
  const hi = [h2, h2, h2, h2, b2, 1, 1, 1, MU_CL];
  const scales = [w * 0.35, w * 0.35, w * 0.35, w * 0.35, (b2 - b1) * 0.35, 1.4, 1.1, 1.1, 0.2];
  return cover(
    makeCellV(T, true, false, true),
    (l, h) => feasible(T, l, h, true, false, true),
    { lo, hi },
    scales,
    maxCells,
    [[0, 1], [1, 2], [2, 3]],
    96,
    [5, 6, 7]
  );
}

function diagnose(b, T) {
  // recompute matrix, find binding row/entry with polished vector
  const cellFn = makeCellV(T, true, false, true);
  const M = cellFn(b);
  const v = polish(M, [0.7, 0.7, 0.14, 1e-3, 1e-8], 400);
  let bindRow = -1, worstR = -Infinity;
  for (let i = 0; i < 5; i++) {
    let s = TAILSLACK;
    for (let j = 0; j < 5; j++) s += M[i][j] * v[j];
    const r = s / v[i];
    if (r > worstR) { worstR = r; bindRow = i; }
  }
  // dominant entry in binding row by contribution
  let bindJ = -1, bc = -Infinity;
  for (let j = 0; j < 5; j++) {
    const c = M[bindRow][j] * v[j];
    if (c > bc) { bc = c; bindJ = j; }
  }
  // true sampled sup of each head-head entry over the cell (LCG samples)
  let ss = 987654321;
  const rn = () => { ss = (ss * 1103515245 + 12345) & 0x7fffffff; return ss / 0x7fffffff; };
  const others = [0, 1, 2].filter((x) => x !== T);
  const bB = others[1];
  const trueSup = {};
  const keys = [];
  for (let x = 0; x < 3; x++) for (let y = x + 1; y < 3; y++) keys.push([x, y]);
  for (const c of [3, 4]) for (let bh = 0; bh < 3; bh++) keys.push([bh, c]);
  for (const k of keys) trueSup[k.join("")] = 0;
  // feasibility band of the cell
  for (let s2 = 0; s2 < 4000; s2++) {
    // sample mu in the cell band
    const muLo0 = Math.max(RATE_FLOOR, b.lo[9] ?? RATE_FLOOR);
    const muHi0 = Math.min(MU_CL, b.hi[9] ?? MU_CL);
    // conservative: sample mu then positions within intersect; skip infeasible
    const mu = muLo0 + rn() * (muHi0 - muLo0);
    const vsr = [];
    let ok = true;
    for (let i = 0; i < 4; i++) {
      const lo = Math.max(b.lo[i], mu * BASE[T], i ? vsr[i - 1] : 0);
      const hi = Math.min(b.hi[i], 2 * mu * BASE[T]);
      if (lo > hi) { ok = false; break; }
      vsr.push(lo + rn() * (hi - lo));
    }
    if (!ok) continue;
    const loB = Math.max(b.lo[4], mu * BASE[bB]);
    const hiB = Math.min(b.hi[4], 2 * mu * BASE[bB]);
    if (loB > hiB) continue;
    const vB = loB + rn() * (hiB - loB);
    const yO = b.lo[5] + rn() * (b.hi[5] - b.lo[5]);
    const yM = b.lo[6] + rn() * (b.hi[6] - b.lo[6]);
    const yI = b.lo[7] + rn() * (b.hi[7] - b.lo[7]);
    const uA = 2; // dropped block-0 single pinned at u=2 -> v = 2mu
    const vA = 2 * mu;
    const w1 = Math.sqrt(1 - yO * yO);
    const w2 = yO * Math.sqrt(1 - yM * yM);
    const w3 = yO * yM * Math.sqrt(1 - yI * yI);
    const w4 = yO * yM * yI;
    const wv = [w1, w2, w3, w4];
    const rho = (a2, b2) => gFun(Math.abs(a2 - b2));
    let sD = 0;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) sD += wv[i] * wv[j] * rho(vsr[i], vsr[j]);
    const D1 = Math.sqrt(1 + 2 * sD);
    const bond = (t2) => { let bn = 0; for (let i = 0; i < 4; i++) bn += wv[i] * rho(vsr[i], t2); return bn / D1; };
    const idx = {};
    idx[others[0]] = vA;
    idx[bB] = vB;
    for (const [x, y] of keys) {
      let tv;
      if (y <= 2) {
        if (x === T) tv = bond(idx[y]);
        else if (y === T) tv = bond(idx[x]);
        else tv = rho(idx[x], idx[y]);
      } else {
        const edgeV = mu * BASE[y];
        if (x === T) tv = 2 * bond(edgeV);
        else if (x === 3) tv = 4 * rho(mu * 128, mu * 256);
        else tv = 2 * rho(idx[x], edgeV);
      }
      const kk = [x, y].join("");
      if (tv > trueSup[kk]) trueSup[kk] = tv;
    }
  }
  const capOf = (x, y) => M[Math.min(x, y)][Math.max(x, y)];
  const slacks = keys.map(([x, y]) => ({
    e: `${x}${y}`, cap: capOf(x, y), true_: trueSup[[x, y].join("")],
    ratio: trueSup[[x, y].join("")] / Math.max(1e-300, capOf(x, y)),
  }));
  slacks.sort((a, b2) => a.ratio - b2.ratio);
  console.log("DIAG:", JSON.stringify({
    bound: worstR, bindRow, bindJ, v: v.map((x) => x.toExponential(3)),
    lo: b.lo, hi: b.hi,
    slacks: slacks.map((s3) => `${s3.e}: cap=${s3.cap.toFixed(5)} true=${s3.true_.toFixed(5)} r=${s3.ratio.toFixed(4)}`),
  }, null, 1));
}

if (process.env.BAT) {
  // VC-style battery: production mode T at RATE_FLOOR, PD2 caps on - seeded
  // true in-class configs vs enclosing finite v-cells
  let seedState = 636363 + T;
  const rnd = () => { seedState = (seedState * 1103515245 + 12345) & 0x7fffffff; return seedState / 0x7fffffff; };
  const others = [0, 1, 2].filter((b) => b !== T);
  let viol = 0, feasViol = 0, worst = -Infinity, count = 0;
  for (let t = 0; t < 3000; t++) {
    const mu = RATE_FLOOR + rnd() * (MU_CL - RATE_FLOOR);
    const us = [0, 0, 0, 0].map(() => BASE[T] * (1 + rnd())).sort((a, b) => a - b);
    const uB = BASE[others[1]] * (1 + rnd());
    const yO = rnd(), yM = rnd(), yI = rnd();
    const dv = 0.001 + rnd() * 0.05;
    const dy = 0.001 + rnd() * 0.02;
    const vs = us.map((u) => mu * u);
    const vA = 2 * mu;
    const vB = mu * uB;
    const pos = [vs[0], vs[1], vs[2], vs[3], vB];
    const arcs = [yO, yM, yI];
    const lo = pos.map((x) => x - dv * rnd()).concat(arcs.map((y) => Math.max(0, y - dy * rnd())));
    const hi = pos.map((x) => x + dv * rnd()).concat(arcs.map((y) => Math.min(1, y + dy * rnd())));
    for (let k = 1; k < 4; k++) {
      if (lo[k] < lo[k - 1]) lo[k] = lo[k - 1];
      if (hi[k] < hi[k - 1]) hi[k] = hi[k - 1];
    }
    const dm = 0.001 + rnd() * 0.02;
    lo.push(Math.max(RATE_FLOOR, mu - dm * rnd()));
    hi.push(Math.min(MU_CL, mu + dm * rnd()));
    if (!feasible(T, lo, hi, true, false, true)) { feasViol++; continue; }
    const M = makeCellV(T, true, false, true)({ lo, hi });
    const w1 = Math.sqrt(1 - yO * yO);
    const w2 = yO * Math.sqrt(1 - yM * yM);
    const w3 = yO * yM * Math.sqrt(1 - yI * yI);
    const w4 = yO * yM * yI;
    const wv = [w1, w2, w3, w4];
    const rho = (a, b) => gFun(Math.abs(a - b));
    let s = 0;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) s += wv[i] * wv[j] * rho(vs[i], vs[j]);
    const D1 = Math.sqrt(1 + 2 * s);
    const bond = (tgtV) => {
      let bn = 0;
      for (let i = 0; i < 4; i++) bn += wv[i] * rho(vs[i], tgtV);
      return bn / D1;
    };
    const idx = { [others[0]]: vA, [others[1]]: vB };
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
        if (bh === T) checks.push([2 * bond(edgeV), M[bh][c]]);
        else checks.push([2 * rho(idx[bh], edgeV), M[bh][c]]);
      }
    }
    checks.push([4 * rho(mu * 128, mu * 256), M[3][4]]);
    for (const [tr, cap] of checks) {
      const r = tr / Math.max(cap, 1e-30);
      if (r > 1 + 1e-9) viol++;
      if (r > worst) worst = r;
    }
    count++;
  }
  console.log(JSON.stringify({ battery: `VC-mode-T${T}`, floor: RATE_FLOOR, viol, feasViol, worst, count }));

  // witness battery with updated position-resolved floors
  const MU_V0 = 47 / 200;
  const MU_MID = parseFloat(process.env.MIDFLOOR ?? "0.24");
  function kernelK(a, b, tau) {
    if (Math.abs(a - b) < 1e-9 * (a + b)) {
      const m = 0.5 * (a + b);
      return (Math.exp(-m * tau) * (1 + m * tau)) / m;
    }
    return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
  }
  seedState = 727272;
  let maxE = -Infinity, wviol = 0, wcount = 0;
  const posCounts = [0, 0, 0, 0];
  for (let t = 0; t < 5000; t++) {
    const odd = t % 2 === 1;
    const heavy = Math.floor(rnd() * 7);
    const occupied = [];
    for (let b = 0; b < 7; b++) if (b === heavy || rnd() >= 0.3) occupied.push(b);
    const relPos = occupied.indexOf(heavy);
    const floor = relPos === 1 ? MU_MID : MU_V0;
    const mu = t % 3 === 0 ? floor : floor * (1 + 2 * rnd());
    posCounts[Math.min(relPos, 3)]++;
    const us = [], as = [], blocks = [];
    for (const b of occupied) {
      const base = Math.pow(4, b) * (odd ? 2 : 1);
      const reps = b === heavy ? 1 + Math.floor(rnd() * 4) : 1;
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
    if (E > 0) wviol++;
    wcount++;
  }
  console.log(JSON.stringify({ battery: "witness", midFloor: MU_MID, maxE, wviol, wcount, posCounts }));
  process.exit(0);
}

if (process.env.TFDEMO) {
  // fan demo on the two imp-95151 baked 47/200 T=1 v-chart stall cells:
  // fixed-vector certificate fails; probe every candidate axis at S=2 and S=4
  const cellFn = makeCellV(1, true, false, true);
  const feasFn = (l, h) => feasible(1, l, h, true, false, true);
  const evalBox = (bb) => {
    const M = cellFn(bb);
    let bound = cwRatio(M, bb.v);
    let v = bb.v;
    if (bound >= 1) { v = polish(M, bb.v, 60); bound = cwRatio(M, v); }
    if (bound >= 1) {
      v = v.slice();
      const theta = 0.999;
      for (let it = 0; it < 4; it++) {
        let s3 = TAILSLACK; for (let j = 0; j < 5; j++) if (j !== 3) s3 += M[3][j] * v[j];
        v[3] = Math.max(V3_FLOOR, s3 / (theta - M[3][3]));
        let s4 = TAILSLACK; for (let j = 0; j < 5; j++) if (j !== 4) s4 += M[4][j] * v[j];
        v[4] = Math.max(V4_FLOOR, s4 / (theta - M[4][4]));
      }
      bound = cwRatio(M, v);
    }
    return { bound, v };
  };
  const stallA = {
    lo: [0.94, 0.94, 1.7225, 1.86921875, 3.76, 0.65625, 0.8125, 0.9921875, 0.235],
    hi: [0.9889062499999999, 0.9889062499999999, 1.77140625, 1.9181249999999999, 3.9556249999999995, 0.6875, 0.84375, 0.99609375, 0.24019531249999998],
  };
  const stallB = {
    lo: [0.94, 0.9889062499999999, 1.7225, 1.8203125, 3.76, 0.625, 0.8125, 0.9921875, 0.235],
    hi: [0.9889062499999999, 1.0378124999999998, 1.77140625, 1.9181249999999999, 4.151249999999999, 0.65625, 0.84375, 0.99609375, 0.24019531249999998],
  };
  const v0 = [0.7, 0.7, 0.14, 1e-3, 1e-8];
  for (const [cell, tag] of [[stallA, 'A'], [stallB, 'B']]) {
    const fixed = evalBox({ lo: cell.lo, hi: cell.hi, v: v0 });
    console.log(`cell ${tag}: fixed-vector bound = ${fixed.bound}`);
    for (const ax of [6, 3, 7, 1, 5, 0, 2, 4, 8]) {
      for (const S of [2, 4]) {
        let nBad = 0, worstF = -Infinity, feas = 0, seed = fixed.v;
        for (let k = 0; k < S; k++) {
          const lo = cell.lo.slice(), hi = cell.hi.slice();
          lo[ax] = k === 0 ? cell.lo[ax] : cell.lo[ax] + ((cell.hi[ax] - cell.lo[ax]) * k) / S;
          hi[ax] = k === S - 1 ? cell.hi[ax] : cell.lo[ax] + ((cell.hi[ax] - cell.lo[ax]) * (k + 1)) / S;
          if (!feasFn(lo, hi)) continue;
          feas++;
          const r = evalBox({ lo, hi, v: seed });
          seed = r.v;
          if (r.bound >= 1) nBad++;
          if (r.bound > worstF) worstF = r.bound;
        }
        console.log(`  ax=${ax} S=${S}: feas=${feas} nBad=${nBad} worst=${worstF}`);
      }
    }
  }
  process.exit(0);
}

if (process.env.TSCHECK) {
  const cell = JSON.parse(process.env.TSCHECK);
  const M = makeCellV(T, true, false, true)(cell);
  for (const i of [0, 1, 2, 3, 4]) console.log(`M row${i}:`, M[i].map((x) => x.toExponential(3)).join(" "));
  const rows = (v2) => [0, 1, 2, 3, 4].map((i) => { let s = 1e-19; for (let j = 0; j < 5; j++) s += M[i][j] * v2[j]; return (s / v2[i]).toFixed(6); });
  let v = polish(M, [0.7, 0.7, 0.14, 1e-3, 1e-8], 60);
  console.log("polish60:", rows(v).join(" "), "| v:", v.map((x) => x.toExponential(3)).join(" "));
  v = v.slice();
  const theta = 0.999;
  for (let it = 0; it < 4; it++) {
    let s3 = 1e-19; for (let j = 0; j < 5; j++) if (j !== 3) s3 += M[3][j] * v[j];
    v[3] = Math.max(V3_FLOOR, s3 / (theta - M[3][3]));
    let s4 = 1e-19; for (let j = 0; j < 5; j++) if (j !== 4) s4 += M[4][j] * v[j];
    v[4] = Math.max(V4_FLOOR, s4 / (theta - M[4][4]));
  }
  console.log("afterTS:", rows(v).join(" "), "| v:", v.map((x) => x.toExponential(3)).join(" "));
  const v3 = polish(M, v, 800);
  console.log("polish800:", rows(v3).join(" "), "| v:", v3.map((x) => x.toExponential(3)).join(" "));
  process.exit(0);
}

const t0 = Date.now();
const res = runCoverHybrid(T, BUDGET);
console.log(
  JSON.stringify({ T, floor: RATE_FLOOR, budget: BUDGET, pd2: USE_PD2, ...res, secs: (Date.now() - t0) / 1000 })
);
if (DUMP && globalThis.__dumps) for (const d of globalThis.__dumps) diagnose(d, T);
