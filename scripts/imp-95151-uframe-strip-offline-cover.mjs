// imp-95151 offline cover runner (heavy-compute lane; single-threaded,
// deterministic, bit-reproducible - no randomness in the cover path).
//
// The imp-95147 8-D u-frame L1 chart (quadrupled block at the MIDDLE head
// position, singles eliminated by per-entry corner sups) UPGRADED with the
// two sound caps that post-date its recorded stall records:
//   - LEMMA QC (imp-95148): quotient corner cap keeping the satellite
//     denominator mass, capQC = (sum w_i^hi r_i) / D4lo with
//     D4lo^2 = 1 + 2 sum over pairs of w_j^lo w_l^lo gLo(mu_hi sep_lo);
//   - LEMMA PD2 (imp-95150): satellite-floored deletion denominators - the
//     LEMMA PD perturbations are divided by the deleted-config norm floors
//     Dprime >= sqrt(1 + 2 sum over remaining pairs of w^lo w^lo gLo) >= 1;
//   - LEMMA PS shifted polish (imp-95148) + the inert tail-solve step
//     (imp-95150; sound for any positive Collatz-Wielandt vector).
// The mu axis is STRIP-RESTRICTED: the cover runs over [FLOOR, MUHI] only
// and glues to THEOREM VU (imp-95150: middle position certified at every
// common rate >= 239/1000) - the per-rate statements are independent, so a
// union certificate needs cover MUHI >= 239/1000 with overlap.
//
// Usage: node scripts/imp-95151-uframe-strip-offline-cover.mjs FLOOR MUHI BUDGET QC PD2 DUMP
//   FLOOR = rate floor of the cover, MUHI = mu upper edge of the cover
//   BUDGET = max cells, QC = 1/0, PD2 = 1/0, DUMP = 1/0 (print stall cells)
//   BAT=1 env: run the seeded cap-domination battery instead of the cover.
// Production commands and their outputs are baked into
// src/data/imp-95151-uframe-strip-closure.js.
const argv = process.argv.slice(2);
const FLOOR_NUM = parseFloat(argv[0] ?? "0.238");
const MUHI_NUM = parseFloat(argv[1] ?? "0.2395");
const BUDGET = parseFloat(argv[2] ?? "9e6");
const USE_QC = (argv[3] ?? "1") === "1";
const USE_PD2 = (argv[4] ?? "1") === "1";
const DUMP = (argv[5] ?? "0") === "1";
const USE_JR = (argv[6] ?? "1") === "1";

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
      let s = v[i]; // +I shift (LEMMA PS): kills bipartite oscillation, same Perron vector
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

const BLOCKS = [
  [1, 2],
  [4, 8],
  [16, 32],
  [64, 128],
  [256, 512],
];
const T = 1; // quadrupled block at the MIDDLE head position (the open strip)

// 8-D u-frame cell [q1..q4, yO, yM, yI, mu] (imp-95147 makeCell(1, true)
// verbatim) + LEMMA QC quotient corner cap + LEMMA PD2 deletion-norm floors
function cellU(b) {
  const [q1a, q2a, q3a, q4a, yOa, yMa, yIa, ma] = b.lo;
  const [q1c, q2c, q3c, q4c, yOc, yMc, yIc, mc] = b.hi;
  const sep = (hiQ, loQ) => Math.min(16, Math.max(0, hiQ - loQ));
  const G12 = gLo(mc * sep(q2c, q1a));
  const G13 = gLo(mc * sep(q3c, q1a));
  const G14 = gLo(mc * sep(q4c, q1a));
  const G23 = gLo(mc * sep(q3c, q2a));
  const G24 = gLo(mc * sep(q4c, q2a));
  const G34 = gLo(mc * sep(q4c, q3a));
  const Gmin = Math.min(G12, G13, G14, G23, G24, G34);
  const FI = mcF(G34, yIa, yIc);
  const G34hi = Math.min(1, gcap(ma * Math.max(0, q4a - q3c)));
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
  const G23hi = Math.min(1, gcap(ma * Math.max(0, q3a - q2c)));
  const G24hi = Math.min(1, gcap(ma * Math.max(0, q4a - q2c)));
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
  const G24capHi = Math.min(1, gcap(ma * Math.max(0, q4a - q2c)));
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
  // LEMMA PD2 floors (>= 1): deleted-config renormalized norms floored via
  // arc lower corners and gLo entries (renormalized weights dominate both)
  const w1loQ = w1lo;
  const w2loQ = yOa * w2Mlo;
  const w3loQ = yOa * yMa * w3Ilo;
  const w4loQ = yOa * yMa * yIa;
  const D2pLo = USE_PD2
    ? Math.sqrt(1 + 2 * (w1loQ * w3loQ * G13 + w1loQ * w4loQ * G14 + w3loQ * w4loQ * G34)) * (1 - 1e-12)
    : 1;
  const D3pLo = USE_PD2
    ? Math.sqrt(1 + 2 * (w1loQ * w2loQ * G12 + w1loQ * w4loQ * G14 + w2loQ * w4loQ * G24)) * (1 - 1e-12)
    : 1;
  const D23pLo = USE_PD2 ? Math.sqrt(1 + 2 * w1loQ * w4loQ * G14) * (1 - 1e-12) : 1;
  // LEMMA QC: full-quotient corner cap (numerator weight upper corners over
  // the norm floor built from lower corners and gLo entries)
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
  const w4hi4c = yOc * yMc * yIc;
  const qlo = [q1a, q2a, q3a, q4a];
  const qhi = [q1c, q2c, q3c, q4c];
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
    let m = Math.min(full, capD2, capD3, capP23);
    if (USE_QC) {
      const capQC = (w1hi * r1 + w2hi4 * r2 + w3hi4 * r3 + w4hi4c * r4) / D4lo;
      if (capQC < m) m = capQC;
    }
    return m * (1 + 1e-12);
  };
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => {
    M[i][j] = x;
    M[j][i] = x;
  };
  // singles eliminated by per-entry corner sups (imp-95147 header (4)):
  // block 0 single roams [1, 2], block 2 single roams [16, 32]
  const singles = { 0: [BLOCKS[0][0], BLOCKS[0][1]], 2: [BLOCKS[2][0], BLOCKS[2][1]] };
  for (let x = 0; x < 3; x++) {
    for (let y = x + 1; y < 3; y++) {
      if (x === T) {
        const [sLo] = singles[y];
        const caps = [0, 1, 2, 3].map((i) => gcap(ma * Math.max(0, sLo - qhi[i])));
        set(x, y, bondQ(caps));
      } else if (y === T) {
        const sHi = singles[x][1];
        const caps = [0, 1, 2, 3].map((i) => gcap(ma * Math.max(0, qlo[i] - sHi)));
        set(x, y, bondQ(caps));
      } else {
        const sHi = singles[x][1];
        const sLo = singles[y][0];
        set(x, y, gcap(ma * Math.max(0, sLo - sHi)));
      }
    }
  }
  for (const c of [3, 4]) {
    const edge = BLOCKS[c][0];
    for (const bh of [0, 1, 2]) {
      if (bh === T) {
        const caps = [0, 1, 2, 3].map((i) => gcap(ma * Math.max(0, edge - qhi[i])));
        set(bh, c, R4 * bondQ(caps));
      } else {
        const sHi = singles[bh][1];
        set(bh, c, R4 * gcap(ma * Math.max(0, edge - sHi)));
      }
    }
  }
  set(3, 4, 4 * gcap(ma * (BLOCKS[4][0] - BLOCKS[3][1])));
  // LEMMA JR context: expose bondQ and the corner data so the joint heavy-row
  // cap can be evaluated with vector-dependent composite numerators
  M.bondQ = bondQ;
  M.ctx = { qlo, qhi, ma };
  return M;
}

// LEMMA JR (joint heavy-row cap). Pointwise Collatz-Wielandt with a FIXED
// positive vector v: for every config point pt in the cell,
//   lambda(M_true(pt)) <= max_i (M_true(pt) v)_i / v_i.
// The heavy row (i = T = 1) sum is itself a single bond functional,
//   sum_j v_j b_j(pt) = sum_i w_i(pt) rhoEff_i(pt) / D(pt),
// with the composite per-packet numerator rhoEff_i = sum over targets j of
// v_j rho(pos_i, t_j) <= capsEff[i]. The carried fold machinery (aySup / KC /
// PD / QC) is kernel-agnostic in the per-packet numerator caps, so
// bondQ(capsEff) soundly caps the whole row sum while KEEPING the shared
// yO-arc and shared-denominator coupling the entrywise matrix discards.
// Per-packet target conflict (the down target wants q_i low, the up/tail
// targets want q_i high) is priced by subdividing [qlo_i, qhi_i] into JR_SUB
// sub-intervals: on each sub the decreasing down term is capped at the sub
// lower corner and the increasing up/tail terms at the sub upper corner; the
// max over subs covers the interval (every term is monotone in q_i since g
// is decreasing and the targets sit outside the heavy block on both sides).
// The other rows have no internal corner conflict (all their entries want
// the same single-position corner), so they stay entrywise. The final check
// max_i T_i(v)/v_i < 1 IS the certificate; the iteration that finds v is
// heuristic and does not need to converge.
const JR_SUB = 4;
function jrRow1Caps(M, v) {
  const { qlo, qhi, ma } = M.ctx;
  return [0, 1, 2, 3].map((i) => {
    let best = 0;
    for (let s = 0; s < JR_SUB; s++) {
      const qa = qlo[i] + ((qhi[i] - qlo[i]) * s) / JR_SUB;
      const qb = qlo[i] + ((qhi[i] - qlo[i]) * (s + 1)) / JR_SUB;
      const cap =
        v[0] * gcap(ma * Math.max(0, qa - BLOCKS[0][1])) +
        v[2] * gcap(ma * Math.max(0, BLOCKS[2][0] - qb)) +
        R4 * (v[3] * gcap(ma * Math.max(0, BLOCKS[3][0] - qb)) + v[4] * gcap(ma * Math.max(0, BLOCKS[4][0] - qb)));
      if (cap > best) best = cap;
    }
    return best * (1 + 1e-12);
  });
}
function jrValue(M, v0, iters) {
  let v = v0.slice();
  for (let i = 0; i < 5; i++) if (!(v[i] > 0)) v[i] = 1e-9;
  const Top = (u) => {
    const out = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
      if (i === 1) {
        out[i] = M.bondQ(jrRow1Caps(M, u)) * (1 + 1e-12);
        continue;
      }
      let s = TAILSLACK;
      for (let j = 0; j < 5; j++) s += M[i][j] * u[j];
      out[i] = s;
    }
    return out;
  };
  for (let it = 0; it < iters; it++) {
    const w = Top(v);
    for (let i = 0; i < 5; i++) w[i] += v[i]; // +I shift (LEMMA PS analogue)
    const n = Math.hypot(...w);
    for (let i = 0; i < 5; i++) v[i] = w[i] / n;
    v[3] = Math.max(v[3], V3_FLOOR);
    v[4] = Math.max(v[4], V4_FLOOR);
  }
  const t = Top(v);
  let mx = 0;
  for (let i = 0; i < 5; i++) mx = Math.max(mx, t[i] / v[i]);
  return mx * (1 + 1e-12);
}

// deterministic DFS cover with warm-started vectors, LEMMA PS shifted
// polish, the inert tail-solve step, and the graded arc split rule
function cover(box0, scales, maxCells, tris, maxDepthCap, arcAxes) {
  const v0 = [0.7, 0.7, 0.14, 1e-3, 1e-8];
  const stack = [{ lo: box0.lo, hi: box0.hi, d: 0, v: v0 }];
  let n = 0;
  let worst = -1;
  let maxDepth = 0;
  let unresolved = 0;
  const dumps = [];
  while (stack.length) {
    const b = stack.pop();
    const M = cellU(b);
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
    if (bound >= 1 && USE_JR) {
      const jb = jrValue(M, v, 30);
      if (jb < bound) bound = jb;
    }
    if (bound < 1) {
      n++;
      if (bound > worst) worst = bound;
      if (b.d > maxDepth) maxDepth = b.d;
      continue;
    }
    if (b.d >= maxDepthCap || n + stack.length > maxCells) {
      unresolved++;
      if (DUMP && dumps.length < 12) dumps.push({ lo: b.lo, hi: b.hi, d: b.d, bound });
      continue;
    }
    let ax = 0;
    let wmax = -1;
    for (let k = 0; k < b.lo.length; k++) {
      let wk = b.hi[k] - b.lo[k];
      if (arcAxes && arcAxes.includes(k)) {
        const xw =
          Math.sqrt(Math.max(0, 1 - b.lo[k] * b.lo[k])) - Math.sqrt(Math.max(0, 1 - b.hi[k] * b.hi[k]));
        if (xw > wk) wk = xw;
      }
      const w = wk / scales[k];
      if (w > wmax) {
        wmax = w;
        ax = k;
      }
    }
    const m = (b.lo[ax] + b.hi[ax]) / 2;
    const c1 = { lo: [...b.lo], hi: [...b.hi], d: b.d + 1, v };
    c1.hi[ax] = m;
    const c2 = { lo: [...b.lo], hi: [...b.hi], d: b.d + 1, v };
    c2.lo[ax] = m;
    for (const c of [c1, c2]) {
      let ok = true;
      for (const [a1, a2] of tris) {
        if (c.lo[a1] > c.hi[a2]) {
          ok = false;
          break;
        }
      }
      if (ok) stack.push(c);
    }
  }
  return { cells: n, worst, maxDepth, unresolved, dumps };
}

// seeded cap-domination battery (BAT=1): true 4-packet middle-heavy configs
// with singles roaming their FULL blocks vs enclosing finite u-cells - every
// upgraded entry cap (QC and PD2 included in the min) must dominate the
// sampled true bond; the LCG match with the module is required for reuse
function runBattery(nDraws, floor, muHi) {
  let seedState = 515151;
  const rnd = () => {
    seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
    return seedState / 0x7fffffff;
  };
  let viol = 0;
  let worst = -Infinity;
  let count = 0;
  for (let t = 0; t < nDraws; t++) {
    const mu = floor + rnd() * (muHi - floor);
    const us = [0, 0, 0, 0].map(() => 4 * (1 + rnd())).sort((a, b) => a - b);
    const uA = 1 + rnd();
    const uB = 16 * (1 + rnd());
    const yO = rnd();
    const yM = rnd();
    const yI = rnd();
    const dq = 0.001 + rnd() * 0.05;
    const dy = 0.001 + rnd() * 0.02;
    const lo = us.map((q) => q - dq * rnd()).concat([yO, yM, yI].map((y) => Math.max(0, y - dy * rnd())));
    const hi = us.map((q) => q + dq * rnd()).concat([yO, yM, yI].map((y) => Math.min(1, y + dy * rnd())));
    for (let k = 1; k < 4; k++) {
      if (lo[k] < lo[k - 1]) lo[k] = lo[k - 1];
      if (hi[k] < hi[k - 1]) hi[k] = hi[k - 1];
    }
    const dm = 0.0002 + rnd() * 0.002;
    lo.push(Math.max(floor, mu - dm * rnd()));
    hi.push(Math.min(muHi, mu + dm * rnd()));
    const M = cellU({ lo, hi });
    const w1 = Math.sqrt(1 - yO * yO);
    const w2 = yO * Math.sqrt(1 - yM * yM);
    const w3 = yO * yM * Math.sqrt(1 - yI * yI);
    const w4 = yO * yM * yI;
    const wv = [w1, w2, w3, w4];
    const vs = us.map((u) => mu * u);
    const rho = (a, b) => gFun(Math.abs(a - b));
    let s = 0;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) s += wv[i] * wv[j] * rho(vs[i], vs[j]);
    const D1 = Math.sqrt(1 + 2 * s);
    const bond = (tgtV) => {
      let bn = 0;
      for (let i = 0; i < 4; i++) bn += wv[i] * rho(vs[i], tgtV);
      return bn / D1;
    };
    const idx = { 0: mu * uA, 2: mu * uB };
    const checks = [];
    for (let x = 0; x < 3; x++) {
      for (let y = x + 1; y < 3; y++) {
        if (x === T) checks.push([bond(idx[y]), M[x][y]]);
        else if (y === T) checks.push([bond(idx[x]), M[x][y]]);
        else checks.push([rho(idx[x], idx[y]), M[x][y]]);
      }
    }
    for (const c of [3, 4]) {
      const edgeV = mu * BLOCKS[c][0];
      for (const bh of [0, 1, 2]) {
        if (bh === T) checks.push([2 * bond(edgeV), M[bh][c]]);
        else checks.push([2 * rho(idx[bh], edgeV), M[bh][c]]);
      }
    }
    checks.push([4 * rho(mu * BLOCKS[3][1], mu * BLOCKS[4][0]), M[3][4]]);
    // LEMMA JR battery: the joint heavy-row cap must dominate the true
    // weighted row sum for a random positive test vector (singles at their
    // sampled positions are dominated by the corner targets inside the cap)
    if (USE_JR) {
      const vr = [rnd() + 1e-3, rnd() + 1e-3, rnd() + 1e-3, rnd() * 1e-2 + 1e-6, rnd() * 1e-4 + 1e-9];
      const trueRow1 =
        vr[0] * bond(idx[0]) +
        vr[2] * bond(idx[2]) +
        vr[3] * 2 * bond(mu * BLOCKS[3][0]) +
        vr[4] * 2 * bond(mu * BLOCKS[4][0]);
      checks.push([trueRow1, M.bondQ(jrRow1Caps(M, vr))]);
    }
    for (const [tr, cap] of checks) {
      const r = tr / Math.max(cap, 1e-30);
      if (r > 1 + 1e-9) viol++;
      if (r > worst) worst = r;
    }
    count++;
  }
  return { viol, worst, count };
}

const t0 = Date.now();
if (process.env.BAT === "1") {
  const bat = runBattery(4000, FLOOR_NUM, MUHI_NUM);
  console.log(
    JSON.stringify({ mode: "battery", floor: FLOOR_NUM, muHi: MUHI_NUM, qc: USE_QC, pd2: USE_PD2, ...bat })
  );
  if (bat.viol > 0) process.exit(1);
} else {
  const [Blo, Bhi] = BLOCKS[T];
  const w = Bhi - Blo;
  const lo = [Blo, Blo, Blo, Blo, 0, 0, 0, FLOOR_NUM];
  const hi = [Bhi, Bhi, Bhi, Bhi, 1, 1, 1, MUHI_NUM];
  const scales = [w, w, w, w, 1, 0.55, 0.55, 0.08];
  const res = cover(
    { lo, hi },
    scales,
    BUDGET,
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    96,
    [4, 5, 6]
  );
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(
    JSON.stringify({
      mode: "cover",
      floor: FLOOR_NUM,
      muHi: MUHI_NUM,
      budget: BUDGET,
      qc: USE_QC,
      pd2: USE_PD2,
      cells: res.cells,
      unresolved: res.unresolved,
      worst: res.worst,
      maxDepth: res.maxDepth,
      secs: Number(secs),
    })
  );
  if (DUMP && res.dumps.length) {
    for (const d of res.dumps) console.log("STALL", JSON.stringify(d));
  }
}
