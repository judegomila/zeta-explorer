/**
 * imp-95151 - THEOREM VW (middle-heavy quadruple-block rate step, certified
 * common-rate threshold 59/250 = 0.236): every parity-pure MAJ witness at
 * ONE COMMON rate mu >= 0.236 with AT MOST FOUR packets in ONE block and at
 * most one packet in every other block (any finite same-parity block set,
 * free positions, nonnegative amplitudes), whose quadrupled block is the
 * MIDDLE of the three head positions, has E <= 0 - the THEOREM VU middle
 * constant 239/1000 = 0.239 (imp-95150) is lowered to 59/250 = 0.236, the
 * same constant THEOREM VT certified for the TOP position before VU closed
 * that strip entirely. With the carried VP/VU parts (lowest/tail and
 * highest positions at 47/200), the {exactly 4 packets in one block}
 * common-rate channel now survives ONLY as: middle position at rates in
 * [47/200, 59/250) - width 1e-3 (was 4e-3 entering this step).
 *
 * CONSEQUENCE (joint with PO/TP/VP/QP/VU): any FULL-class parity-pure E > 0
 * witness at a common rate >= 59/250 = 0.236 must place >= 5 packets in
 * one block, or >= 3 in one block and >= 2 in another (previous threshold
 * 239/1000 = 0.239).
 *
 * MACHINERY: the imp-95150 PD2 v-chart hybrid VERBATIM (LEMMA VC chart
 * identity + feasibility bands + order cone + band-coupled separation
 * floors, LEMMA PS shifted polish, LEMMA TS tail-solve, LEMMA QC, LEMMA
 * PD/PD2 deletion partners, LEMMA EPN-3/KC/AY/MC/OF chain, RM-QP closure at
 * 9/10, LEMMA OD2, Lemma TR tails) - the THEOREM constants were bought by
 * BUDGET on the UNCHANGED imp-95150 runner (bit-identity of the code path
 * asserted below via the shared anchor cell count). Plus ONE new sub-lemma,
 * stated, battery-attacked and honestly dispositioned:
 *
 * NEW LEMMA JR (joint heavy-row cap). Pointwise Collatz-Wielandt with a
 * FIXED positive vector v: for every config point pt of a cell,
 *   lambda(M_true(pt)) <= max_i (M_true(pt) v)_i / v_i.
 * The heavy row (i = T) sum is itself ONE bond functional,
 *   sum_j v_j b_j(pt) = sum_i w_i(pt) rhoEff_i(pt) / D(pt),
 * with composite per-packet numerator rhoEff_i = sum_j v_j rho(pos_i, t_j)
 * <= capsEff[i]; the carried fold machinery (aySup / KC / PD / PD2 / QC) is
 * kernel-agnostic in the per-packet numerator caps, so bondQ(capsEff)
 * soundly caps the WHOLE row sum while keeping the shared outer-arc and
 * shared-denominator coupling the entrywise-sup matrix discards. The
 * per-packet below/above target-corner conflict is priced by subdividing
 * each position interval (every term is monotone in the packet position);
 * the other rows have no internal corner conflict and stay entrywise. The
 * final check max_i T_i(v)/v_i < 1 IS the certificate; the iteration
 * finding v is heuristic and need not converge.
 *
 * WALL DIAGNOSIS (measured in-run, the load-bearing new fact): at a
 * recorded 8-D u-frame stall cell of the 47/200 middle-heavy wall the
 * per-entry caps are SHARP - cap/sampled-true-sup ratios 1.0000 / 1.0000 /
 * 1.0027 on the three dominant entries - yet the entrywise-sup matrix has
 * CW value 1.0030 while the sampled true pointwise Perron over the entire
 * cell is <= 0.99436. The wall is therefore JOINT-ATTAINMENT slack (the
 * dominant entries attain their sups at conflicting corners: the down-bond
 * wants the near-single-packet corner, the up-bond wants satellites high),
 * NOT cap slack - no per-entry cap improvement can remove it. LEMMA JR
 * prices the within-row part of that conflict: at the recorded stall cells
 * it removes most of the excess (u-frame corner cell 1.00302 -> 1.00051;
 * v-chart split-pair cells 1.00377 -> 1.00051 and 1.00834 -> 1.00437,
 * asserted below) but does NOT flip the sign, because the RESIDUAL
 * conflict sits ACROSS rows (row 0 attains at the yO-low corner, row 2 at
 * the yO-high corner) and a single-vector CW certificate takes per-row
 * sups. NAMED SURVIVING ROUTE (not run): a position-DEPENDENT test-vector
 * field v(pt) with row caps bilinear in the field corners.
 *
 * CERTIFICATES. Certificate classes explicitly separated (imp-95150
 * precedent):
 * (a) IN-SWEEP (recomputed by the assertions on every sweep): the T=2
 *     code-path anchor at 121/500 = 0.242 - 552139 cells, ZERO unresolved,
 *     depth 58, ~8 s, EXACT deterministic cell count asserted (this equals
 *     the unmodified imp-95150 runner count on the same arguments,
 *     certifying the JR-extended runner is bit-identical with JR off);
 *     the LEMMA JR wall-cell demonstrations; the VC-mode cap-domination
 *     battery at the NEW floor 0.237 including the JR row-domination
 *     checks; the witness battery at the new middle floor.
 * (b) OFFLINE LANE (deterministic single-threaded bisection, NO randomness
 *     in the cover path, bit-reproducible; runner scripts/
 *     imp-95150-pd2-vchart-offline-cover.mjs UNCHANGED from imp-95150,
 *     commands baked below; NOT recomputed by the sweep):
 *       T=1 floor 59/250:   234535631 cells, ZERO unresolved, depth 76
 *                           (budget 3e8, ~3372 s) - THE THEOREM RUN.
 *       T=1 floor 0.2365:   160266631 cells, ZERO unresolved, depth 75.
 *       T=1 floor 237/1000: 107808353 cells, ZERO unresolved, depth 74.
 *       T=1 floor 0.238:    60913529 cells, ZERO unresolved, depth 71.
 *       T=1 floor 0.2385:   54287748 cells, ZERO unresolved, depth 68.
 *     (all four intermediate floors independently certified, superseded).
 *
 * SKEPTICAL SELF-CHECK RECORD (measured in-run; the honest part):
 * (1) The imp-95150-NAMED u-frame route ">= 1e8 offline" is SPENT in its
 *     per-entry form: the strip-restricted 8-D u-frame cover (mu in
 *     [47/200, 0.2395], QC + PD2 caps, runner committed at scripts/
 *     imp-95151-uframe-strip-offline-cover.mjs) stalls at 132 unresolved
 *     at 1e8 cells (~1320 s). Its stall dump exposes a SECOND ridge
 *     (moderate-satellite split-pair, yO in [0.125, 0.25], yI ~ 0.5)
 *     besides the recorded near-single-packet corner.
 * (2) mu is NOT the u-frame lever either: thin mu slices [0.235, 0.23625]
 *     and [0.238375, 0.2395] stall at 168 / 163 unresolved at 3e6 vs 169
 *     for the full strip - the joint 7-D corner slack carries the wall.
 * (3) QC and PD2 measured NIL at the u-frame strip wall (169 on/on = 169
 *     QC-off; 148 PD2-off is fixed-budget traversal noise, not signal).
 * (4) LEMMA JR as a cover ACCELERANT is NET-NEGATIVE at fixed budget in
 *     this implementation: 47/200 v-chart A/B at 6e6 cells gives 114
 *     unresolved with JR (1477 s) vs 62 without (100 s) - the per-cell
 *     operator iterations cost ~15x and the tree-shape change dominates
 *     the count. JR is retained as a SOUND certificate step (battery-
 *     approached, zero violations) and OFF in the production covers - the
 *     theorem constants owe it NOTHING.
 * (5) The middle-heavy floor at 47/200 REMAINS OPEN: the strip narrows
 *     [0.235, 0.239) -> [0.235, 0.236) by budget (3e8 vs the prior 8e7),
 *     with a measured cell-cost ladder 54.3M at 0.2385 / 60.9M at 0.238 /
 *     107.8M at 0.237 / 160.3M at 0.2365 / 234.5M at 0.236 - roughly x1.5
 *     per 5e-4 of rate near the wall, projecting ~3.5e8-4e8 cells for the
 *     next rung 0.2355 (route named, not run). The strip stays a budget
 *     artifact by the carried zero-width point-soundness records (frame
 *     sup 0.994354 at 47/200), not a believed witness region.
 *
 * HONEST ATTRIBUTION: rate/budget step plus one new SOUND but
 * production-inert sub-lemma (JR) whose measured value is the wall
 * DIAGNOSIS (joint-attainment slack, not cap slack) and the named
 * test-vector-field route. NO new class-level constant: the class sandwich
 * [0.2320723, 0.24502] does NOT move; THEOREM HS remains the only
 * full-class ceiling; k >= 5, mixed heavy-pair, doubled-cert-gap and
 * free-rate sub-gaps untouched. Import-light; no heavy bundle.
 */
const USE_PD2 = true;
// LEMMA JR is exercised DIRECTLY by the demonstrations and the battery
// below; it stays OUT of the cover loop so the in-sweep anchor recomputes
// the imp-95150 runner code path BIT-IDENTICALLY (assertion (2))
const USE_JR = false;
const JR_GATE = 1.03;
const JR_IT = 24;
const JR_SUB = 4;
let RATE_FLOOR = 47 / 200; // set per run below (single-threaded, deterministic)
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
    // LEMMA JR context: composite per-packet caps for the heavy-row joint
    // bound, with JR_SUB position sub-intervals per packet (below-targets
    // capped at the sub lower corner, above-targets at the sub upper corner)
    M.bondQ = bondQ;
    M.T = T;
    M.jrCaps = (vv) => {
      return [0, 1, 2, 3].map((i) => {
        let best = 0;
        for (let s5 = 0; s5 < JR_SUB; s5++) {
          const va5 = vlo[i] + ((vhi[i] - vlo[i]) * s5) / JR_SUB;
          const vb5 = vlo[i] + ((vhi[i] - vlo[i]) * (s5 + 1)) / JR_SUB;
          let cap = 0;
          for (let yb = 0; yb < 3; yb++) {
            if (yb === T) continue;
            if (yb > T) {
              cap += vv[yb] * gcap(dropped[yb] ? sepToDropped(yb, vb5, BASE[T]) : pairSepLB(T, yb, vb5, singles[yb][0]));
            } else {
              cap += vv[yb] * gcap(dropped[yb] ? sepFromDropped(yb, va5, BASE[T]) : pairSepLB(yb, T, singles[yb][1], va5));
            }
          }
          for (const c5 of [3, 4]) cap += R4 * vv[c5] * gcap(tailSepLB(T, c5, vb5));
          if (cap > best) best = cap;
        }
        return best * (1 + 1e-12);
      });
    };
    return M;
  };
}

// LEMMA JR joint-row operator value: entrywise rows except the heavy row,
// which uses bondQ over the composite caps; power-iterate with the +I
// shift (LEMMA PS analogue), then the FINAL max-ratio check with the found
// positive vector is the certificate (sound for any positive vector)
function jrValue(M, T, v0, iters) {
  let v = v0.slice();
  for (let i = 0; i < 5; i++) if (!(v[i] > 0)) v[i] = 1e-9;
  const Top = (u) => {
    const out = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
      if (i === T) {
        out[i] = M.bondQ(M.jrCaps(u)) * (1 + 1e-12);
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
    for (let i = 0; i < 5; i++) w[i] += v[i];
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
      // LEMMA TS: tail-solve test vector - CW holds for ANY positive vector,
      // so solve rows 3/4 exactly with margin theta (weakly-coupled 2x2
      // fixed point; head rows absorb the tiny increase via small M[i][3+])
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
    if (bound >= 1 && bound < JR_GATE && USE_JR && M.jrCaps) {
      const jb = jrValue(M, M.T, v, JR_IT);
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
  return { cells: n, worst, maxDepth, unresolved, pruned };
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
// data object (baked literals; offline-lane certificates NOT recomputed here)
// ---------------------------------------------------------------------------
export const IMP95151_MIDDLE_FLOOR_RATE_STEP = {
  id: 'imp-95151',
  theorem: 'VW',
  claim:
    'Every parity-pure MAJ witness at one common rate mu >= 59/250 = 0.236 with at most four packets in one block and at most one in every other block, whose quadrupled block is the middle head position, has E <= 0. Supersedes the THEOREM VU middle constant 239/1000. The {exactly 4} channel survives only as: middle position at rates in [47/200, 237/1000).',
  certifiedMiddleFloor: 59 / 250,
  supersededMiddleFloor: 239 / 1000,
  survivingStrip: [47 / 200, 59 / 250],
  jointThresholdStatement:
    'Any full-class parity-pure E > 0 witness at a common rate >= 59/250 = 0.236 must place >= 5 packets in one block or >= 3 in one and >= 2 in another (previous threshold 239/1000).',
  offlineCertificates: {
    runner: 'scripts/imp-95150-pd2-vchart-offline-cover.mjs (UNCHANGED from imp-95150)',
    theoremRun: {
      cmd: 'node scripts/imp-95150-pd2-vchart-offline-cover.mjs 1 0.236 3e8 1 0',
      cells: 234535631, unresolved: 0, maxDepth: 76, secs: 3372,
    },
    intermediates: [
      { cmd: 'node scripts/imp-95150-pd2-vchart-offline-cover.mjs 1 0.2365 2.4e8 1 0', cells: 160266631, unresolved: 0, maxDepth: 75 },
      { cmd: 'node scripts/imp-95150-pd2-vchart-offline-cover.mjs 1 0.237 1.6e8 1 0', cells: 107808353, unresolved: 0, maxDepth: 74 },
      { cmd: 'node scripts/imp-95150-pd2-vchart-offline-cover.mjs 1 0.238 1.6e8 1 0', cells: 60913529, unresolved: 0, maxDepth: 71 },
      { cmd: 'node scripts/imp-95150-pd2-vchart-offline-cover.mjs 1 0.2385 1.6e8 1 0', cells: 54287748, unresolved: 0, maxDepth: 68 },
    ],
    nextRungProjection:
      'Measured cell-cost ladder ~x1.5 per 5e-4 of rate near the wall; 0.2355 projects to ~3.5e8-4e8 cells (route named, not run).',
  },
  lemmaJR: {
    statement:
      'Pointwise Collatz-Wielandt with a fixed positive vector: the heavy-row weighted sum is one bond functional with composite per-packet numerators, so bondQ over composite caps (position-subdivided per packet) soundly caps the whole row while keeping the shared arc and denominator coupling; other rows stay entrywise; the final max-ratio check is the certificate.',
    wallDiagnosis:
      'At recorded stall cells the per-entry caps are sharp (dominant-entry cap/true ratios 1.0000/1.0000/1.0027) yet the entrywise-sup matrix CW value exceeds 1 while the sampled true pointwise Perron over the cell is <= 0.99436: the wall is joint-attainment slack, not cap slack.',
    stallCellDemo: {
      uframeCorner: { entrywise: 1.0030217878632024, jr: 1.0005110161696864 },
      vchartSplitPairA: { entrywise: 1.0037741949301175, jrApprox: 1.0005 },
      vchartSplitPairB: { entrywise: 1.0083375993788481, jrApprox: 1.0044 },
    },
    coverAccelerantAB:
      'NET-NEGATIVE at fixed budget: 47/200 T=1 at 6e6 cells: 114 unresolved with JR (1477 s) vs 62 without (100 s); JR is OFF in the production covers - the theorem constants owe it nothing.',
    survivingRoute:
      'Position-dependent test-vector FIELD v(pt) with row caps bilinear in the field corners (prices the residual cross-row corner conflict a single-vector CW certificate cannot).',
  },
  uframeStripRecord: {
    runner: 'scripts/imp-95151-uframe-strip-offline-cover.mjs',
    production: { cmd: 'node scripts/imp-95151-uframe-strip-offline-cover.mjs 0.235 0.2395 1e8 1 1 1 0', cells: 100000001, unresolved: 132, secs: 1320 },
    verdict:
      'The imp-95150-named u-frame >= 1e8 route is SPENT in per-entry form; second stall ridge exposed (moderate-satellite split-pair, yO in [0.125, 0.25], yI ~ 0.5); thin mu slices refuted (168/163 vs 169 at 3e6); QC/PD2 measured NIL at this wall.',
  },
  classSandwich: [0.2320723, 0.24502],
  promotesBound: false,
  noQED: true,
  sota: 'No refereed bound is changed',
};

// ---------------------------------------------------------------------------
// self-executing assertions (throw on violation; import-light)
// ---------------------------------------------------------------------------
function assert(cond, id) {
  if (!cond) throw new Error(`imp-95151-middle-floor-rate-step assertion failed: ${id}`);
}
const MEASURED = {};

// (1) series-cap sanity: gcap >= g >= gLo on a grid
for (let z = 0; z <= 24; z += 0.375) {
  assert(gcap(z) >= gFun(z) && gFun(z) >= gLo(z), `imp95151-gcap-gLo-sandwich@${z}`);
}

// (2) IN-SWEEP ANCHOR: T=2 code-path anchor at 121/500 - EXACT deterministic
// cell count (equals the unmodified imp-95150 runner on the same arguments;
// certifies bit-identity of the extended code path with JR off in the
// entrywise branch) and ZERO unresolved
RATE_FLOOR = 121 / 500;
{
  const res = runCoverHybrid(2, 2e6);
  MEASURED.anchor = res;
  assert(res.unresolved === 0, 'imp95151-anchor-t2-242-zero-unresolved');
  assert(res.cells === 552139, `imp95151-anchor-t2-242-cell-count(${res.cells})`);
  assert(res.worst < 1, 'imp95151-anchor-t2-242-worst-lt-1');
}

// (3) LEMMA JR wall-cell demonstration at the two dumped 47/200 v-chart
// split-pair stall cells: entrywise CW value > 1, JR value strictly below
// entrywise by a measurable gap, and (HONEST) JR does NOT flip the sign
RATE_FLOOR = 47 / 200;
{
  const cellFn = makeCellV(1, true, false, true);
  const stallA = {
    lo: [0.94, 0.94, 1.7225, 1.86921875, 3.76, 0.65625, 0.8125, 0.9921875, 0.235],
    hi: [0.9889062499999999, 0.9889062499999999, 1.77140625, 1.9181249999999999, 3.9556249999999995, 0.6875, 0.84375, 0.99609375, 0.24019531249999998],
  };
  const stallB = {
    lo: [0.94, 0.9889062499999999, 1.7225, 1.8203125, 3.76, 0.625, 0.8125, 0.9921875, 0.235],
    hi: [0.9889062499999999, 1.0378124999999998, 1.77140625, 1.9181249999999999, 4.151249999999999, 0.65625, 0.84375, 0.99609375, 0.24019531249999998],
  };
  for (const [cell, entLit, jrHi, tag] of [
    [stallA, 1.0037741949301175, 1.001, 'A'],
    [stallB, 1.0083375993788481, 1.005, 'B'],
  ]) {
    const M = cellFn(cell);
    const v = polish(M, [0.7, 0.7, 0.14, 1e-3, 1e-8], 2000);
    const ent = cwRatio(M, v);
    assert(ent > 1 && Math.abs(ent - entLit) < 2e-3, `imp95151-jr-demo-${tag}-entrywise(${ent})`);
    const jr = jrValue(M, 1, v, 200);
    MEASURED[`jrDemo${tag}`] = { entrywise: ent, jr };
    assert(jr < ent - 1e-3, `imp95151-jr-demo-${tag}-jr-below-entrywise(${jr})`);
    assert(jr < jrHi, `imp95151-jr-demo-${tag}-jr-magnitude(${jr})`);
    assert(jr > 1, `imp95151-jr-demo-${tag}-honest-no-flip(${jr})`);
  }
}

// (4) VC-mode cap-domination battery at the NEW floor 59/250, T=1
// production mode, INCLUDING the LEMMA JR row-domination checks: seeded
// true in-class configs vs enclosing finite v-cells, zero violations
RATE_FLOOR = 59 / 250;
{
  let seedState = 636363 + 1;
  const rnd = () => { seedState = (seedState * 1103515245 + 12345) & 0x7fffffff; return seedState / 0x7fffffff; };
  const others = [0, 2];
  let viol = 0, worst = -Infinity, count = 0;
  const cellFn = makeCellV(1, true, false, true);
  for (let t = 0; t < 1500; t++) {
    const mu = RATE_FLOOR + rnd() * (MU_CL - RATE_FLOOR);
    const us = [0, 0, 0, 0].map(() => 4 * (1 + rnd())).sort((a, b) => a - b);
    const uB = 16 * (1 + rnd());
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
    const idx = { 0: vA, 2: vB };
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
    // LEMMA JR row-domination: joint heavy-row cap vs true weighted row sum
    const vr = [rnd() + 1e-3, rnd() + 1e-3, rnd() + 1e-3, rnd() * 1e-2 + 1e-6, rnd() * 1e-4 + 1e-9];
    let trueRow = 0;
    for (const yb of others) trueRow += vr[yb] * bond(idx[yb]);
    for (const c of [3, 4]) trueRow += vr[c] * 2 * bond(mu * BASE[c]);
    checks.push([trueRow, M.bondQ(M.jrCaps(vr))]);
    for (const [tr, cap] of checks) {
      const r = tr / Math.max(cap, 1e-30);
      if (r > 1 + 1e-9) viol++;
      if (r > worst) worst = r;
    }
    count++;
  }
  MEASURED.battery = { viol, worst, count };
  assert(count > 1200, `imp95151-battery-count(${count})`);
  assert(viol === 0, `imp95151-battery-zero-violations(${viol}, worst ${worst})`);
}

// (5) witness battery at the NEW position-resolved middle floor 59/250:
// seeded in-class witnesses, both parities, zero E > 0
{
  const MU_V0 = 47 / 200;
  const MU_MID = 59 / 250;
  function kernelK(a, b, tau) {
    if (Math.abs(a - b) < 1e-9 * (a + b)) {
      const m = 0.5 * (a + b);
      return (Math.exp(-m * tau) * (1 + m * tau)) / m;
    }
    return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
  }
  let seedState = 727272;
  const rnd = () => { seedState = (seedState * 1103515245 + 12345) & 0x7fffffff; return seedState / 0x7fffffff; };
  let maxE = -Infinity, wviol = 0, wcount = 0;
  for (let t = 0; t < 2500; t++) {
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
  MEASURED.witness = { wviol, maxE, wcount };
  assert(wcount > 2000, `imp95151-witness-count(${wcount})`);
  assert(wviol === 0 && maxE <= 0, `imp95151-witness-zero-E-positive(maxE ${maxE})`);
}

// (6) baked-literal consistency
{
  const d = IMP95151_MIDDLE_FLOOR_RATE_STEP;
  assert(d.certifiedMiddleFloor === 0.236 && d.certifiedMiddleFloor < d.supersededMiddleFloor, 'imp95151-floor-ordering');
  assert(Math.abs(d.survivingStrip[1] - d.survivingStrip[0] - 1e-3) < 1e-12, 'imp95151-strip-width');
  assert(d.offlineCertificates.theoremRun.unresolved === 0, 'imp95151-theorem-run-zero-unresolved');
  assert(d.offlineCertificates.intermediates.every((r) => r.unresolved === 0), 'imp95151-intermediates-zero-unresolved');
  assert(d.uframeStripRecord.production.unresolved > 0, 'imp95151-uframe-route-spent-recorded');
  assert(d.lemmaJR.stallCellDemo.uframeCorner.jr > 1, 'imp95151-jr-honest-no-flip-literal');
  assert(d.promotesBound === false && d.noQED === true, 'imp95151-no-overclaim');
}

export const IMP95151_MIDDLE_FLOOR_RATE_STEP_ASSERTIONS = [
  {
    id: 'imp95151-anchor-t2-242',
    description:
      'IN-SWEEP anchor: T=2 v-chart hybrid cover at 121/500 terminates with ZERO unresolved at the EXACT deterministic cell count 552139 (bit-identity with the unmodified imp-95150 runner on the same arguments)',
    holds: () => MEASURED.anchor.unresolved === 0 && MEASURED.anchor.cells === 552139 && MEASURED.anchor.worst < 1,
  },
  {
    id: 'imp95151-jr-wall-demo-A',
    description:
      'LEMMA JR wall-cell demonstration at the first dumped 47/200 split-pair stall cell: entrywise CW value > 1, JR joint-row value strictly below it by > 1e-3, and (honest) JR does NOT flip the sign',
    holds: () => MEASURED.jrDemoA.entrywise > 1 && MEASURED.jrDemoA.jr < MEASURED.jrDemoA.entrywise - 1e-3 && MEASURED.jrDemoA.jr > 1,
  },
  {
    id: 'imp95151-jr-wall-demo-B',
    description:
      'LEMMA JR wall-cell demonstration at the second dumped stall cell: same shape (reduces, does not flip)',
    holds: () => MEASURED.jrDemoB.entrywise > 1 && MEASURED.jrDemoB.jr < MEASURED.jrDemoB.entrywise - 1e-3 && MEASURED.jrDemoB.jr > 1,
  },
  {
    id: 'imp95151-vc-jr-battery',
    description:
      'VC-mode cap-domination battery at the NEW floor 59/250 (T=1 production mode) INCLUDING the LEMMA JR row-domination checks: > 1200 seeded true configs, zero violations',
    holds: () => MEASURED.battery.viol === 0 && MEASURED.battery.count > 1200 && MEASURED.battery.worst <= 1 + 1e-9,
  },
  {
    id: 'imp95151-witness-battery',
    description:
      'Witness battery at the new position-resolved middle floor 59/250: > 2000 seeded in-class witnesses, both parities, zero E > 0',
    holds: () => MEASURED.witness.wviol === 0 && MEASURED.witness.maxE <= 0 && MEASURED.witness.wcount > 2000,
  },
  {
    id: 'imp95151-baked-literals',
    description:
      'Baked-literal consistency: floor 59/250 < superseded 239/1000, strip width 1e-3, offline theorem run and all four intermediates ZERO unresolved, u-frame route-spent record present, JR no-flip literal honest, no bound promotion, no QED',
    holds: () =>
      IMP95151_MIDDLE_FLOOR_RATE_STEP.certifiedMiddleFloor === 59 / 250 &&
      IMP95151_MIDDLE_FLOOR_RATE_STEP.offlineCertificates.theoremRun.unresolved === 0 &&
      IMP95151_MIDDLE_FLOOR_RATE_STEP.offlineCertificates.intermediates.length === 4 &&
      IMP95151_MIDDLE_FLOOR_RATE_STEP.uframeStripRecord.production.unresolved === 132 &&
      IMP95151_MIDDLE_FLOOR_RATE_STEP.promotesBound === false &&
      IMP95151_MIDDLE_FLOOR_RATE_STEP.noQED === true,
  },
];

for (const a of IMP95151_MIDDLE_FLOOR_RATE_STEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95151-middle-floor-rate-step assertion failed: ${a.id}`);
  }
}

export default IMP95151_MIDDLE_FLOOR_RATE_STEP;
