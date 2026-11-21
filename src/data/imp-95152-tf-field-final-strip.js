/**
 * imp-95152 - HONEST PARTIAL (skeptical record): LEMMA TF (piecewise
 * test-vector-FIELD fan certificate) is SOUND and flips both recorded
 * 47/200 stall cells locally, but is MEASURED NET-NEGATIVE / NIL as a
 * cover accelerant; and the 0.2355 middle-rung budget attempt STALLS at
 * 4.5e8 cells - the measured cell-cost ladder BREAKS below 0.236, so
 * budget scaling into the final strip [47/200, 59/250) is priced OUT on
 * this frame. NO constant moves in this run.
 *
 * CONTEXT (chain state after imp-95151 / THEOREM VW): the {exactly 4
 * packets in one block} channel of the parity-pure MAJ occupancy ladder
 * survives ONLY as the middle head position at common rates in
 * [47/200, 59/250), width 1e-3. imp-95151 named ONE surviving route: a
 * position-dependent test-vector FIELD (the wall diagnosis was
 * JOINT-ATTAINMENT slack - the entrywise caps are sharp but no single
 * positive vector attains all rows at once). This run executes the
 * piecewise-CONSTANT form of that route and the next budget rung, and
 * records both outcomes.
 *
 * LEMMA TF (test-vector-field fan; SOUND, exercised by the demo and cover
 * assertions below). Let cell C be a box and split it into S closed slabs
 * along one axis: interior endpoints are the IDENTICAL float expression
 * for adjacent slabs and the outer endpoints are CLAMPED to the exact
 * cell corners, so the union of the closed slabs covers C exactly (no
 * float sliver). Each slab is a sub-box handed to the SAME cap machinery
 * (LEMMA VC v-chart + QC + PD2 chain carried UNCHANGED from imp-95150),
 * which returns an entrywise upper cap matrix valid on that slab; a slab
 * certifies when the pointwise Collatz-Wielandt max-ratio with its OWN
 * positive test vector (seed, LEMMA PS polish, LEMMA TS tail-solve,
 * warm-chained slab to slab - provenance of the vector is irrelevant to
 * validity) is < 1; an infeasible slab contains no valid configuration
 * (the same necessary-condition pruning every carried cover trusts). If
 * every feasible slab certifies, every configuration in C has E <= 0:
 * C is certified by a piecewise-constant position-dependent test-vector
 * FIELD - the certificate a single fixed vector cannot express when the
 * Perron vector rotates across the cell.
 *
 * MEASURED VERDICTS (the honest part; all re-measured on THIS code after
 * the outer-endpoint clamp, not inherited):
 * (1) TF FLIPS BOTH recorded 47/200 v-chart stall cells locally (in-sweep
 *     demo assertions on the imp-95151 baked cells): cell A fixed-vector
 *     bound 1.00377 -> yM-axis S=2 fan certifies (worst slab 0.99899);
 *     cell B 1.00834 -> yM S=2 is insufficient but yM S=4 certifies
 *     (worst slab 0.999959). The local mechanism works exactly as the
 *     imp-95151 diagnosis predicted.
 * (2) TF DOES NOT SHRINK THE WALL (A/B at the 47/200 middle wall, T=1,
 *     budget 6e6, runner scripts/imp-95152-tf-fan-offline-cover.mjs):
 *     baseline (TF off, bit-identical to the imp-95150 runner) 62
 *     unresolved / 93.5 s; TF full (S=2 probes + measured-axis S=4
 *     escalation + measured-direction push, gate 1.05) 489 unresolved /
 *     214.6 s / 28.1M fan evals - NET-NEGATIVE; TF retire-only (gate
 *     1.05) 59 unresolved / 460.6 s / 49.4M fan evals - count-neutral at
 *     4.9x cost, NIL; TF full at gate 1.01 - stack blowup through the
 *     4-ary pushes, CATASTROPHIC. VERDICT: the 47/200 wall is
 *     TOTAL-TREE-SIZE, not local resolvability - the piecewise-CONSTANT
 *     field form of the imp-95151-named route is SPENT as a wall lever
 *     (retained SOUND; the in-sweep 0.244 cover pair below shows the
 *     retire mechanism does shrink CELL COUNT, 128092 vs 209090, at
 *     ~3.4x time - a certificate-compression tool, not a wall tool).
 * (3) THE CELL LADDER BREAKS AT 0.2355: the next middle rung on the
 *     UNCHANGED imp-95150 runner (offline lane, deterministic,
 *     bit-reproducible; budget 4.5e8 = 1.9x the 0.236 theorem tree,
 *     6614 s) STALLS at 73 unresolved, budget-bound (depth 76 < cap 96).
 *     Measured growth per 5e-4 of rate: x1.487 (0.237), x1.463 (0.2365),
 *     x1.463 (0.236), then >= x1.92 WITH a 73-subtree unresolved
 *     remainder at 0.2355 - the growth is super-geometric below 0.236
 *     and the pure-budget route into the final strip is priced out.
 * (4) The 0.2355 stall ridge is the SAME family as the 47/200 records
 *     (6e6-budget dump, 80 unresolved, baked below): the
 *     near-single-packet displacement corner - yO in [1/32, 1/16] (almost
 *     all weight on the leading head packet), yM ~ 0.91, yI ~ 0.94, the
 *     three heavier packet positions near-coincident, mu PINNED at the
 *     floor; sampled cap/true ratios at the dominant bond entries 0.994 /
 *     0.972 / 0.945 (sharp) - joint-attainment slack again, the wall
 *     moves INTO the strip rather than resolving.
 * (5) A 9e8 full-strip run at floor 47/200 (2.9x the deepest prior
 *     record) was inherited in-flight from the prior engine run and its
 *     disposition is recorded in fullStripAttempt0235 below.
 *
 * WHAT DOES NOT CHANGE: every certified constant is CARRIED, none moves -
 * THEOREM VW middle floor 59/250, VU/VP top and low floors 47/200, the
 * joint >= 5-or-(3,2) threshold at 0.236, the class sandwich
 * [0.2320723, 0.24502] (THEOREM HS the only full-class ceiling). The
 * witness batteries at the UNCERTIFIED floors (middle 0.235/0.2355, 5000
 * seeds, zero E > 0, max E = -0.0247) keep the strip a budget artifact,
 * not a believed witness region. Changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * SURVIVING ROUTES for the final strip (named, NOT run):
 * (i) test-vector field BILINEAR in the field corners: per-row caps that
 *     are bilinear forms of corner vectors v(corner) - a genuinely
 *     different certificate class from the piecewise-constant fan, which
 *     is now measured and spent;
 * (ii) an analytic (non-cover) joint cap at the measured ridge - the
 *     near-single-packet displacement corner with position-resolved rate
 *     dependence below 0.236;
 * (iii) accept the strip as terminal for this frame: the k >= 5 and
 *     mixed-heavy-pair channels of imp-95144-subgap-k-packet-ladder are
 *     untouched and carry no such wall record yet.
 *
 * Import-light; no heavy bundle; all in-sweep assertions < ~45 s.
 */
const USE_PD2 = true;
let USE_TF = false;
const TF_GATE = 1.05;
const TF_AXES = [6, 3, 7, 1, 5];
let RATE_FLOOR = 47 / 200;
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

// LEMMA TF support: the fixed-vector certificate sequence of the imp-95150
// runner (seed check, LEMMA PS polish(60), LEMMA TS tail-solve) factored so
// the fan can reuse it per slab
function makeEvalBox(cellFn) {
  return (bb) => {
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
}
// LEMMA TF fan: partition cell b into S closed slabs along axis ax (exact
// shared endpoints - slab k ends where slab k+1 begins, same float
// arithmetic); each feasible slab gets its own positive test vector
// (warm-chained); an infeasible slab contains no valid configuration. If
// every feasible slab certifies (bound < 1), the union of slabs covers the
// cell and the cell is certified by the piecewise-constant test-vector
// FIELD - the certificate the fixed vector cannot express when the Perron
// vector rotates across the cell.
function makeFanEval(cellFn, feasFn) {
  const evalBox = makeEvalBox(cellFn);
  return (b, ax, S, vSeed) => {
    let worstF = -Infinity, nBad = 0, seed = vSeed, feas = 0;
    for (let k = 0; k < S; k++) {
      const lo = b.lo.slice(), hi = b.hi.slice();
      // outer endpoints CLAMPED to the exact cell corners: float lo+((hi-lo)*S)/S
      // can land one ulp below hi, which would leave an uncovered sliver at the
      // top of the cell; interior endpoints share the identical float expression
      // between adjacent slabs, so the interior has no gap
      lo[ax] = k === 0 ? b.lo[ax] : b.lo[ax] + ((b.hi[ax] - b.lo[ax]) * k) / S;
      hi[ax] = k === S - 1 ? b.hi[ax] : b.lo[ax] + ((b.hi[ax] - b.lo[ax]) * (k + 1)) / S;
      if (!feasFn(lo, hi)) continue;
      feas++;
      const r = evalBox({ lo, hi, v: seed });
      seed = r.v;
      if (r.bound >= 1) nBad++;
      if (r.bound > worstF) worstF = r.bound;
    }
    return { worstF, nBad, feas };
  };
}

function cover(cellFn, feasFn, box0, scales, maxCells, tris, maxDepthCap, arcAxes) {
  const v0 = [0.7, 0.7, 0.14, 1e-3, 1e-8];
  const stack = [{ lo: box0.lo, hi: box0.hi, d: 0, v: v0 }];
  let n = 0, worst = -1, maxDepth = 0, unresolved = 0, pruned = 0;
  let fanEvals = 0;
  const evalBox = makeEvalBox(cellFn);
  const fanEv = makeFanEval(cellFn, feasFn);
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
    if (USE_TF && bound < TF_GATE && b.d < maxDepthCap && n + stack.length <= maxCells) {
      let retired = false;
      for (const ax of TF_AXES) {
        if (!(b.hi[ax] - b.lo[ax] > 1e-12)) continue;
        const f = fanEv(b, ax, 2, v);
        fanEvals += f.feas;
        if (f.nBad === 0) {
          n += f.feas;
          if (f.worstF > worst) worst = f.worstF;
          if (b.d + 1 > maxDepth) maxDepth = b.d + 1;
          retired = true;
          break;
        }
      }
      if (retired) continue;
    }
    if (b.d >= maxDepthCap || n + stack.length > maxCells) {
      unresolved++;
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
  return { cells: n, worst, maxDepth, unresolved, pruned, fanEvals };
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

// ---------------------------------------------------------------------------
// data object
// ---------------------------------------------------------------------------
export const IMP95152_TF_FIELD_FINAL_STRIP = {
  id: 'imp-95152',
  kind: 'honest-partial-adversarial-record',
  claim:
    'No constant moves. LEMMA TF (piecewise test-vector-field fan) is sound, flips both recorded 47/200 stall cells locally, and is measured NET-NEGATIVE / NIL as a cover accelerant; the 0.2355 middle-rung budget attempt stalls at 4.5e8 cells with 73 unresolved - the measured cell ladder breaks below 0.236 and pure budget scaling into the final strip [47/200, 59/250) is priced out on this frame.',
  lemmaTF: {
    statement:
      'Partition a cell into S closed slabs along one axis (interior endpoints the identical float expression for adjacent slabs, outer endpoints clamped to the exact cell corners, so the slab union covers the cell); certify each feasible slab with the carried cap machinery and its own positive test vector via pointwise Collatz-Wielandt; infeasible slabs contain no valid configuration. All feasible slabs < 1 certifies the cell by a piecewise-constant position-dependent test-vector field.',
    stallCellDemo: {
      cellA: {
        fixedVectorBound: 1.0037741949301178,
        certifyingFan: { axis: 'yM', S: 2, worstSlab: 0.9989891527540639 },
      },
      cellB: {
        fixedVectorBound: 1.008337599378848,
        fanS2Insufficient: true,
        certifyingFan: { axis: 'yM', S: 4, worstSlab: 0.9999585353949989 },
      },
    },
    wallAB: {
      config: 'T=1, floor 47/200, budget 6e6, scripts/imp-95152-tf-fan-offline-cover.mjs; re-measured post-clamp on this code',
      baseline: { unresolved: 62, secs: 93.466 },
      tfFullGate105: { unresolved: 489, secs: 214.576, fanEvals: 28085540, verdict: 'NET-NEGATIVE' },
      tfRetireOnlyGate105: { unresolved: 59, secs: 460.621, fanEvals: 49385614, verdict: 'count-neutral at 4.9x cost - NIL' },
      tfFullGate101: { unresolved: 6277872, secs: 544.708, fanEvals: 56885969, verdict: 'stack blowup through the 4-ary pushes - CATASTROPHIC' },
      verdict:
        'The 47/200 wall is total-tree-size, not local resolvability; the piecewise-CONSTANT form of the imp-95151-named test-vector-field route is SPENT as a wall lever.',
    },
    coverPair244: {
      note: 'In-sweep pair at T=2 floor 61/250: the TF retire mechanism shrinks the certified cover (fewer cells) at ~3.4x time - a certificate-compression tool, not a wall tool.',
      tfOff: { cells: 209090, unresolved: 0 },
      tfOn: { cells: 128092, unresolved: 0 },
    },
  },
  rungAttempt02355: {
    runner: 'scripts/imp-95150-pd2-vchart-offline-cover.mjs (UNCHANGED from imp-95150; offline lane, deterministic, bit-reproducible)',
    cmd: 'node scripts/imp-95150-pd2-vchart-offline-cover.mjs 1 0.2355 4.5e8 1 0',
    cells: 450000001, unresolved: 73, maxDepth: 76, secs: 6614.218,
    ladderBreak:
      'Measured growth per 5e-4 of rate: x1.487 into 0.237, x1.463 into 0.2365, x1.463 into 0.236 (all certified, zero unresolved), then >= x1.92 WITH a 73-subtree unresolved remainder at 0.2355 (budget-bound: depth 76 < cap 96). Super-geometric below 0.236.',
    stallRidgeDump: {
      cmd: 'node scripts/imp-95152-tf-fan-offline-cover.mjs 1 0.2355 6e6 1 1 0',
      unresolvedAt6e6: 80,
      ridge:
        'Near-single-packet displacement corner: yO in [1/32, 1/16], yM ~ 0.91, yI ~ 0.94, heavier packet positions near-coincident, mu pinned at the floor; sampled cap/true at the dominant bond entries 0.994/0.972/0.945 - joint-attainment slack, same family as the 47/200 records.',
    },
  },
  fullStripAttempt0235: {
    cmd: 'node scripts/imp-95150-pd2-vchart-offline-cover.mjs 1 0.235 9e8 1 0',
    status: 'PENDING-AT-COMMIT',
    note: 'Inherited in-flight from the prior engine run (2.9x the deepest prior wall record 3e8). Disposition owed by the successor if not patched below before commit.',
  },
  carried: {
    middleFloor: 59 / 250,
    topFloor: 47 / 200,
    lowAndTailFloor: 47 / 200,
    survivingStrip: [47 / 200, 59 / 250],
    jointThreshold: 59 / 250,
    classSandwich: [0.2320723, 0.24502],
  },
  witnessBatteries:
    'VC cap-domination at floor 0.2355 (3000 seeded true configs, zero violations, worst ratio 0.99963); witness batteries at the UNCERTIFIED middle floors 0.2355 and 0.235 (5000 seeds each, zero E > 0, max E = -0.0247): the strip stays a budget artifact, not a believed witness region.',
  survivingRoutes: [
    'Test-vector field BILINEAR in the field corners (per-row caps as bilinear forms of corner vectors) - a different certificate class from the measured piecewise-constant fan.',
    'An analytic (non-cover) joint cap at the near-single-packet displacement corner with position-resolved rate dependence below 0.236.',
    'Accept the strip as terminal for this frame; the k >= 5 and mixed-heavy-pair ladder channels carry no such wall record yet.',
  ],
  promotesBound: false,
  noQED: true,
  sota: 'No refereed bound is changed',
};

// ---------------------------------------------------------------------------
// self-executing assertions (throw on violation; import-light)
// ---------------------------------------------------------------------------
function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95152-tf-field-final-strip assertion failed: ${id}`);
}
const MEASURED = {};

// (1) series-cap sanity: gcap >= g >= gLo on a grid
for (let z = 0; z <= 24; z += 0.375) {
  assertI(gcap(z) >= gFun(z) && gFun(z) >= gLo(z), `imp95152-gcap-gLo-sandwich@${z}`);
}

// (2) IN-SWEEP ANCHOR (TF OFF): T=2 code path at 121/500 - EXACT
// deterministic cell count equal to the unmodified imp-95150 runner on the
// same arguments (bit-identity of the TF-extended code path with TF off)
USE_TF = false;
RATE_FLOOR = 121 / 500;
{
  const res = runCoverHybrid(2, 2e6);
  MEASURED.anchor = res;
  assertI(res.unresolved === 0, 'imp95152-anchor-t2-242-zero-unresolved');
  assertI(res.cells === 552139, `imp95152-anchor-t2-242-cell-count(${res.cells})`);
  assertI(res.worst < 1, 'imp95152-anchor-t2-242-worst-lt-1');
  assertI(res.fanEvals === 0, 'imp95152-anchor-t2-242-tf-inert');
}

// (3) LEMMA TF demo on the two imp-95151 baked 47/200 T=1 stall cells:
// the fixed-vector certificate FAILS on both; the yM-axis fan certifies
// cell A at S=2 and cell B at S=4 (S=2 is measurably insufficient on B) -
// the piecewise field flips both cells the fixed vector cannot
RATE_FLOOR = 47 / 200;
{
  const cellFn = makeCellV(1, true, false, true);
  const feasFn = (l, h) => feasible(1, l, h, true, false, true);
  const evalBox = makeEvalBox(cellFn);
  const fanEv = makeFanEval(cellFn, feasFn);
  const v0 = [0.7, 0.7, 0.14, 1e-3, 1e-8];
  const stallA = {
    lo: [0.94, 0.94, 1.7225, 1.86921875, 3.76, 0.65625, 0.8125, 0.9921875, 0.235],
    hi: [0.9889062499999999, 0.9889062499999999, 1.77140625, 1.9181249999999999, 3.9556249999999995, 0.6875, 0.84375, 0.99609375, 0.24019531249999998],
  };
  const stallB = {
    lo: [0.94, 0.9889062499999999, 1.7225, 1.8203125, 3.76, 0.625, 0.8125, 0.9921875, 0.235],
    hi: [0.9889062499999999, 1.0378124999999998, 1.77140625, 1.9181249999999999, 4.151249999999999, 0.65625, 0.84375, 0.99609375, 0.24019531249999998],
  };
  const d = IMP95152_TF_FIELD_FINAL_STRIP.lemmaTF.stallCellDemo;
  const fixedA = evalBox({ lo: stallA.lo, hi: stallA.hi, v: v0 });
  assertI(fixedA.bound > 1 && Math.abs(fixedA.bound - d.cellA.fixedVectorBound) < 2e-3, `imp95152-demo-A-fixed-fails(${fixedA.bound})`);
  const fanA = fanEv(stallA, 6, 2, fixedA.v);
  assertI(fanA.feas === 2 && fanA.nBad === 0, `imp95152-demo-A-yM-S2-certifies(${fanA.nBad})`);
  assertI(fanA.worstF < 1 && Math.abs(fanA.worstF - d.cellA.certifyingFan.worstSlab) < 2e-3, `imp95152-demo-A-worst(${fanA.worstF})`);
  const fixedB = evalBox({ lo: stallB.lo, hi: stallB.hi, v: v0 });
  assertI(fixedB.bound > 1 && Math.abs(fixedB.bound - d.cellB.fixedVectorBound) < 2e-3, `imp95152-demo-B-fixed-fails(${fixedB.bound})`);
  const fanB2 = fanEv(stallB, 6, 2, fixedB.v);
  assertI(fanB2.nBad > 0, 'imp95152-demo-B-yM-S2-insufficient');
  const fanB4 = fanEv(stallB, 6, 4, fixedB.v);
  assertI(fanB4.feas === 4 && fanB4.nBad === 0, `imp95152-demo-B-yM-S4-certifies(${fanB4.nBad})`);
  assertI(fanB4.worstF < 1 && Math.abs(fanB4.worstF - d.cellB.certifyingFan.worstSlab) < 2e-3, `imp95152-demo-B-worst(${fanB4.worstF})`);
  MEASURED.demo = {
    fixedA: fixedA.bound, fanAWorst: fanA.worstF, fanANBad: fanA.nBad,
    fixedB: fixedB.bound, fanB2NBad: fanB2.nBad, fanB4Worst: fanB4.worstF, fanB4NBad: fanB4.nBad,
  };
}

// (4) TF cover pair at T=2, floor 61/250: TF-off and TF-on (retire-only in
// this module) both certify with ZERO unresolved and EXACT deterministic
// cell counts; the TF cover is strictly smaller in cells - the retire
// mechanism is real even though the wall A/B is net-negative
RATE_FLOOR = 61 / 250;
{
  USE_TF = false;
  const off = runCoverHybrid(2, 2e6);
  assertI(off.unresolved === 0 && off.cells === 209090 && off.worst < 1, `imp95152-pair244-off(${off.cells},${off.unresolved})`);
  USE_TF = true;
  const on = runCoverHybrid(2, 2e6);
  USE_TF = false;
  assertI(on.unresolved === 0 && on.cells === 128092 && on.worst < 1, `imp95152-pair244-on(${on.cells},${on.unresolved})`);
  assertI(on.fanEvals > 1e6 && on.cells < off.cells, 'imp95152-pair244-tf-shrinks-cells');
  MEASURED.pair = { off, on };
}

// (5) VC-mode cap-domination battery at floor 0.2355 (the attempted rung),
// T=1 production mode: seeded true in-class configs vs enclosing finite
// v-cells, zero violations
RATE_FLOOR = 0.2355;
{
  let seedState = 636363 + 1;
  const rnd = () => { seedState = (seedState * 1103515245 + 12345) & 0x7fffffff; return seedState / 0x7fffffff; };
  const others = [0, 2];
  let viol = 0, worst = -Infinity, count = 0;
  const cellFn = makeCellV(1, true, false, true);
  for (let t = 0; t < 3000; t++) {
    const mu = RATE_FLOOR + rnd() * (MU_CL - RATE_FLOOR);
    const us = [0, 0, 0, 0].map(() => BASE[1] * (1 + rnd())).sort((a, b) => a - b);
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
    if (!feasible(1, lo, hi, true, false, true)) continue;
    const M = cellFn({ lo, hi });
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
        if (x === 1) checks.push([bond(idx[y]), M[x][y]]);
        else if (y === 1) checks.push([bond(idx[x]), M[x][y]]);
        else checks.push([rho(idx[x], idx[y]), M[x][y]]);
      }
    }
    for (const c of [3, 4]) {
      const edgeV = mu * BASE[c];
      for (const bh of [0, 1, 2]) {
        if (bh === 1) checks.push([2 * bond(edgeV), M[bh][c]]);
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
  assertI(count > 1200, `imp95152-vc-battery-count(${count})`);
  assertI(viol === 0, `imp95152-vc-battery-zero-violations(${viol}, worst ${worst})`);
  MEASURED.vc = { viol, worst, count };
}

// (6) witness battery at the UNCERTIFIED middle floor 47/200 (approaches the
// whole open strip): seeded in-class witnesses, both parities, zero E > 0
{
  function kernelK(a, b, tau) {
    if (Math.abs(a - b) < 1e-9 * (a + b)) {
      const m = 0.5 * (a + b);
      return (Math.exp(-m * tau) * (1 + m * tau)) / m;
    }
    return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
  }
  const MU_V0 = 47 / 200;
  const MU_MID = 47 / 200;
  let seedState = 727272;
  const rnd = () => { seedState = (seedState * 1103515245 + 12345) & 0x7fffffff; return seedState / 0x7fffffff; };
  let maxE = -Infinity, wviol = 0, wcount = 0;
  for (let t = 0; t < 5000; t++) {
    const odd = t % 2 === 1;
    const heavy = Math.floor(rnd() * 7);
    const occupied = [];
    for (let b = 0; b < 7; b++) if (b === heavy || rnd() >= 0.3) occupied.push(b);
    const relPos = occupied.indexOf(heavy);
    const floor = relPos === 1 ? MU_MID : MU_V0;
    const mu = t % 3 === 0 ? floor : floor * (1 + 2 * rnd());
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
  assertI(wcount > 2000, `imp95152-witness-count(${wcount})`);
  assertI(wviol === 0 && maxE <= 0, `imp95152-witness-zero-E-positive(maxE ${maxE})`);
  MEASURED.witness = { maxE, wviol, wcount };
}

// (7) baked-literal consistency: no constant moved, the rung attempt is
// recorded as a STALL, and the wall A/B is recorded as net-negative
{
  const d = IMP95152_TF_FIELD_FINAL_STRIP;
  assertI(d.carried.middleFloor === 59 / 250 && d.carried.survivingStrip[1] === 59 / 250, 'imp95152-carried-floor-unmoved');
  assertI(Math.abs(d.carried.survivingStrip[1] - d.carried.survivingStrip[0] - 1e-3) < 1e-12, 'imp95152-strip-width-unchanged');
  assertI(d.rungAttempt02355.unresolved > 0, 'imp95152-rung-recorded-as-stall');
  assertI(d.lemmaTF.wallAB.tfFullGate105.unresolved > d.lemmaTF.wallAB.baseline.unresolved, 'imp95152-tf-net-negative-recorded');
  assertI(d.lemmaTF.wallAB.tfRetireOnlyGate105.secs > 4 * d.lemmaTF.wallAB.baseline.secs, 'imp95152-tf-retire-cost-recorded');
  assertI(d.lemmaTF.coverPair244.tfOn.cells < d.lemmaTF.coverPair244.tfOff.cells, 'imp95152-tf-compression-recorded');
  assertI(d.promotesBound === false && d.noQED === true, 'imp95152-no-overclaim');
}

export const IMP95152_TF_FIELD_FINAL_STRIP_ASSERTIONS = [
  {
    id: 'imp95152-anchor-t2-242',
    description:
      'IN-SWEEP anchor (TF off): T=2 v-chart hybrid cover at 121/500 terminates with ZERO unresolved at the EXACT deterministic cell count 552139 and ZERO fan evaluations (bit-identity of the TF-extended code path with the unmodified imp-95150 runner)',
    holds: () => MEASURED.anchor.unresolved === 0 && MEASURED.anchor.cells === 552139 && MEASURED.anchor.worst < 1 && MEASURED.anchor.fanEvals === 0,
  },
  {
    id: 'imp95152-tf-demo-cell-A',
    description:
      'LEMMA TF demo at the first baked 47/200 stall cell: fixed-vector certificate FAILS (bound > 1) and the yM-axis S=2 fan certifies every slab (worst slab < 1) - the piecewise field flips the cell',
    holds: () => MEASURED.demo.fixedA > 1 && MEASURED.demo.fanANBad === 0 && MEASURED.demo.fanAWorst < 1,
  },
  {
    id: 'imp95152-tf-demo-cell-B',
    description:
      'LEMMA TF demo at the second baked stall cell: fixed vector FAILS, yM S=2 is measurably insufficient (some slab fails), yM S=4 certifies every slab',
    holds: () => MEASURED.demo.fixedB > 1 && MEASURED.demo.fanB2NBad > 0 && MEASURED.demo.fanB4NBad === 0 && MEASURED.demo.fanB4Worst < 1,
  },
  {
    id: 'imp95152-tf-cover-pair-244',
    description:
      'TF-on/TF-off deterministic cover pair at T=2 floor 61/250: both ZERO unresolved with EXACT counts (128092 TF-on vs 209090 TF-off) - the fan retire mechanism compresses the certified cover even though it is net-negative at the wall',
    holds: () => MEASURED.pair.off.cells === 209090 && MEASURED.pair.on.cells === 128092 && MEASURED.pair.off.unresolved === 0 && MEASURED.pair.on.unresolved === 0 && MEASURED.pair.on.fanEvals > 1e6,
  },
  {
    id: 'imp95152-vc-battery-02355',
    description:
      'VC-mode cap-domination battery at the attempted rung floor 0.2355 (T=1 production mode): > 1200 seeded true configs vs enclosing cells, zero violations',
    holds: () => MEASURED.vc.viol === 0 && MEASURED.vc.count > 1200 && MEASURED.vc.worst <= 1 + 1e-9,
  },
  {
    id: 'imp95152-witness-battery-strip',
    description:
      'Witness battery approaching the WHOLE open strip (middle floor 47/200, below every certified middle constant): > 2000 seeded in-class witnesses, both parities, zero E > 0',
    holds: () => MEASURED.witness.wviol === 0 && MEASURED.witness.maxE <= 0 && MEASURED.witness.wcount > 2000,
  },
  {
    id: 'imp95152-honest-record-literals',
    description:
      'Baked-literal consistency: no constant moved (middle floor stays 59/250, strip width 1e-3), the 0.2355 rung is recorded as a STALL (73 unresolved at 4.5e8), the TF wall A/B is recorded net-negative, no bound promotion, no QED',
    holds: () =>
      IMP95152_TF_FIELD_FINAL_STRIP.carried.middleFloor === 59 / 250 &&
      IMP95152_TF_FIELD_FINAL_STRIP.rungAttempt02355.unresolved === 73 &&
      IMP95152_TF_FIELD_FINAL_STRIP.lemmaTF.wallAB.tfFullGate105.unresolved > IMP95152_TF_FIELD_FINAL_STRIP.lemmaTF.wallAB.baseline.unresolved &&
      IMP95152_TF_FIELD_FINAL_STRIP.promotesBound === false &&
      IMP95152_TF_FIELD_FINAL_STRIP.noQED === true,
  },
];

for (const a of IMP95152_TF_FIELD_FINAL_STRIP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95152-tf-field-final-strip assertion failed: ${a.id}`);
  }
}

export default IMP95152_TF_FIELD_FINAL_STRIP;
