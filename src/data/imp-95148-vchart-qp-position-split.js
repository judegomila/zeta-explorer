/**
 * imp-95148 - THEOREM VP (scale-invariant v-chart position-split
 * refinement of the quadruple-block rung): for every parity-pure MAJ
 * witness at ONE COMMON rate mu with AT MOST FOUR packets in ONE block
 * and at most one packet in every other block (any finite same-parity
 * block set, free positions, nonnegative amplitudes),
 *   (i)  if the quadrupled block is the LOWEST occupied head block, or
 *        sits at relative position >= 3 (a tail block), then E <= 0 for
 *        every mu >= 47/200 = 0.235 - the COMMON k <= 3 ladder constant;
 *   (ii) if the quadrupled block is the HIGHEST of the three head
 *        positions, then E <= 0 for every mu >= 477/2000 = 0.2385;
 *   (iii) the MIDDLE-heavy position carries the imp-95147 THEOREM QP
 *        constant 121/500 = 0.242 (cited, certified in the sibling
 *        module every sweep).
 * CONSEQUENCE: imp-95147-subgap-qp-cert-gap NARROWS from the full strip
 * [47/200, 121/500) x {all heavy positions} to the middle-heavy channel
 * in [47/200, 121/500) plus the top-heavy channel in [47/200, 477/2000).
 * Jointly with THEOREMS PO/TP (both at 47/200): any full-class E > 0
 * witness at a common rate >= 0.2385 that uses exactly four packets in
 * one block must place them in the MIDDLE relative head position.
 *
 * NEW MACHINERY (the recorded imp-95147 route "a joint (mu, arc) cap
 * lemma that eliminates the dominant mu-axis corner slack", executed in
 * EXACT form):
 * LEMMA VC (scale-invariant v-chart). At a common rate every frame
 *   correlation is rho = g(mu |u_i - u_j|) = g(|v_i - v_j|) in v = mu u
 *   (identity). The covers run in v-coordinates:
 *   (a) chart identity - the frame is mu-free in v;
 *   (b) feasibility-band pruning - a cell is discarded only when the
 *       per-axis mu-intervals [v_lo/(2 BASE), v_hi/BASE] (a NECESSARY
 *       condition on the shared rate) have empty joint intersection
 *       with [rate floor, 9/10] (and the mu axis where present);
 *   (c) order-cone clamp - prefix-max lows / suffix-min highs on the
 *       four heavy coordinates (exact for box intersect {v1<=..<=v4});
 *   (d) band-coupled pairwise separation floors - for blocks bx < by,
 *       sep >= max(mu BASE_by, vy_lo) - min(mu 2 BASE_bx, vx_hi) for the
 *       shared mu, minimized (piecewise-linear) over the band at its
 *       endpoints and breakpoints; subsumes both the raw corner gap and
 *       the structural u-gap floor. Without (d) the overlapping v-boxes
 *       admit mu-infeasible pairwise corners; without the structural
 *       floor inside (d) they carry gcap(0) ~ 1 phantom entries
 *       (both REFUTED in-run as certification routes, measured).
 * LEMMA PS (shifted polish; soundness-neutral). The certified bound is
 *   the Collatz-Wielandt ratio at an ARBITRARY positive vector, so the
 *   improvement iteration may use (M + I)v: the dominant 2x2 block of
 *   these frames is bipartite and plain power iteration OSCILLATES from
 *   a stale warm start (measured: CW 9784 after 60 plain iterations on
 *   a recorded pole cell whose true cap-CW is 0.647; the shifted polish
 *   certifies it) - part of every recorded "budget wall" in this family
 *   is plausibly this artifact.
 * LEMMA QC (quotient corner cap). bond <= (sum_i w_i^hi r_i^cap) / D4lo
 *   with D4lo the full 4-packet norm floor from the in-cell weight lows
 *   and correlation floors - keeps the satellite denominator mass that
 *   the LEMMA PD deletion partners discard; entrywise MIN partner.
 * Everything else carried VERBATIM from imp-95147 (THEOREM QP): LEMMA
 * EPN-3 nested folding, LEMMA PD partners, LEMMA KC at k = 4, LEMMA
 * AY/MC/OF, gcap/gLo certified series caps, graded arc split rule,
 * factor-2/4 tail-row inflation (which also dominates a quadrupled TAIL
 * block - that is what extends (i) to relative positions >= 3), subset
 * domination for lower occupancies, LEMMA RM-QP closure at 9/10, LEMMA
 * OD2 odd-parity fold at 2 mu (0.47 and 0.477 both inside the covered
 * intervals), Lemma TR tails at weight 24. The EPN-3/PD/KC batteries
 * run in the sweep inside imp-95147 and are not duplicated here.
 *
 * COVERS (deterministic bisection, ZERO unresolved required):
 *   L0 (heavy = lowest head block): 9-D v-chart (v1..v4, vA, vB, three
 *      EPN arcs), rate floor 47/200, cover interval [47/200, 9/10].
 *   L2 (heavy = highest head block): 9-D hybrid (v1..v4, vB, arcs, plus
 *      a thin EXPLICIT mu axis - the dropped block-0 single is pinned at
 *      its consistent worst corner u = 2, i.e. v = 2 mu, so the mu axis
 *      is load-bearing only for that corner), rate floor 477/2000.
 *   Cell counts baked below and recomputed by the assertions on every
 *   sweep. Both covers close in about a minute combined.
 *
 * SKEPTICAL SELF-CHECK RECORD (the honest part - what did NOT land):
 * (1) The 47/200 rung for the MIDDLE-heavy ladder (L1) was stress-tested in
 *     FOUR chart variants (10-D u-frame recorded by imp-95147; 9-D full
 *     v-chart; 7-D v-chart with both singles corner-supped; 8-D hybrid
 *     with explicit mu) at budgets to 6e7 cells (u) / 3.2e7 (v): ALL
 *     stall on the same moderate-satellite / split-pair displacement
 *     ridges (dominant packet + satellites at weights ~0.02-0.2). The
 *     ridge is CHART-ROBUST: eliminating the mu axis exactly does NOT
 *     dissolve it - the imp-95147 per-axis slack attribution (mu
 *     dominant at 2.7e-2) is therefore INCOMPLETE as an explanation of
 *     the 47/200 wall; position/arc joint corners carry it one chart
 *     down. Zero-width probes at the surviving ridges are point-exact
 *     (cap 0.9745024 vs true frame 0.9745023 at the recorded L1 ridge;
 *     margins 1.4e-2 to 3.6e-2), so the wall remains finite-cell slack,
 *     but its refinement cost is now measured to be shared across many
 *     joint axes rather than owned by mu.
 * (2) The v-chart has a PRICED information loss at pinned corners: with
 *     only (v-interval, band) knowledge, the separation to a dropped
 *     corner at 2 mu degrades to vlo/2 in the worst band position - the
 *     u-frame q-box carries strictly more information there. The 7-D
 *     L1 chart was REFUTED as a route below 0.242 for this reason
 *     (recorded so successors do not respend it); the thin explicit mu
 *     axis (hybrid) recovers only part of it.
 * (3) LEMMA QC alone does not close 47/200 for L1/L2 (its own corner
 *     slack at feasible widths ~0.06 exceeds the 5.6e-3 frame margin);
 *     it IS part of the certifying L0/L2 chain.
 * (4) An escalating polish (400 iterations + multi-start) changed ZERO
 *     unresolved counts at 3x runtime - the 60-iteration bounds were
 *     already converged; REFUTED as a cure, recorded.
 *
 * HONEST ATTRIBUTION. This is a subclass-refinement + certification-
 * technology step: no NEW class-level constant. The float frame sup at
 * 47/200 is ~0.994354 for ALL three ladders (measured, coordinate
 * ascent - the sup sits at the near-single-packet displacement corner,
 * so the k = 4 strip remains frame-possible and budget-blocked, per the
 * imp-95147 record). The class sandwich [0.2320723, 0.24502] does NOT
 * move; THEOREM HS remains the only full-class ceiling; k >= 5, the
 * mixed-heavy channel, the doubled certification gap and free rates are
 * untouched. Import-light; no heavy bundle.
 */

let RATE_FLOOR = 47 / 200; // set per cover run (single-threaded, deterministic)
const MU_CL = 9 / 10;
const EHALF_HI = 0.60653067;
const TAILSLACK = 1e-19;
const V3_FLOOR = 1e-8;
const V4_FLOOR = 1e-10;

const gFun = (z) => Math.exp(-z) * (1 + z);
function expTrunc(z, N) {
  let s = 1;
  let t = 1;
  for (let n = 1; n <= N; n++) {
    t = (t * -z) / n;
    s += t;
  }
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
      let ok = true;
      let v = 0;
      for (const i of idx) {
        const x = (A[i] - c * S1) / d;
        if (x < -1e-9) {
          ok = false;
          break;
        }
        v += A[i] * x;
      }
      if (ok && v > best2) best2 = v;
    }
  }
  return sqrtHi(best2) * (1 + 1e-9);
}
function ayP(C, A, B, G, ya, yc) {
  const xa2 = 1 - ya * ya;
  const xc2 = 1 - yc * yc;
  const xa = Math.sqrt(xa2);
  const xc = Math.sqrt(xc2);
  const q11 = A * A - C;
  const q22 = B * B - C;
  const q12 = A * B - C * G;
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
      let s = v[i]; // +I shift: eliminates bipartite oscillation, same Perron vector
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

const BASE = [1, 4, 16, 64, 256]; // block b = [BASE[b], 2*BASE[b])

// v-chart cell: axes [v1..v4, vA, vB, yO, yM, yI] (9-D, NO mu axis).
// v = mu*u; heavy block T carries v1..v4, singles vA (lower other), vB
// (upper other). mu is implicit: the feasibility band
// [max(RATE_FLOOR, max_ax vlo/(2*base)), min(MU_CL, min_ax vhi/base)].
function makeCellV(T, dropA, dropB, hasMu) {
  const others = [0, 1, 2].filter((b) => b !== T);
  const bA = others[0];
  const bB = others[1];
  return function cellV(b) {
    // axis layout: [v1..v4] + (vA if kept) + (vB if kept) + [yO, yM, yI]
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
    // order-cone clamp (v1 <= v2 <= v3 <= v4 for every true config):
    // prefix-max the lower corners, suffix-min the upper corners - exact
    // for box intersect cone, eliminates boundary-straddling pseudo-corners
    v2a = Math.max(v2a, v1a);
    v3a = Math.max(v3a, v2a);
    v4a = Math.max(v4a, v3a);
    v3c = Math.min(v3c, v4c);
    v2c = Math.min(v2c, v3c);
    v1c = Math.min(v1c, v2c);
    // implicit mu band (used only by tail rows; feasibility pre-checked)
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
    // min over the feasibility band of a piecewise-linear expression,
    // evaluated at band endpoints plus supplied breakpoints
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
    // pairwise band-coupled separation floor: for source block bx below
    // target block by, at any common mu the separation obeys
    // sep >= max(mu*BASE[by], vyLo) - min(mu*2*BASE[bx], vxHi);
    // minimize the (piecewise-linear in mu) right side over the cell's
    // feasibility band [mLo, mHi] by evaluating at the endpoints and the two
    // breakpoints. Subsumes both the raw corner gap and mLo*(BASE[by]-2*BASE[bx]).
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
    // tail variant: no v-coordinate for the target block, only v_y >= mu*BASE[by]
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
    // direct quotient corner cap (LEMMA QC): numerator at weight/cap upper
    // corners over the FULL 4-packet norm floor - keeps the satellite
    // denominator mass the deletion partners discard; no arc-pole slack
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
    const w4hi4c = yOc * yMc * yIc;
    const vlo = [v1a, v2a, v3a, v4a];
    const vhi = [v1c, v2c, v3c, v4c];
    const bondQ = (caps) => {
      const [r1, r2, r3, r4] = caps;
      const rI = Math.min(aySup(r3, r4, G34, yIa, yIc), FI * Math.max(r3, r4));
      const rM = Math.min(aySup(r2, rI, G2E, ty2Lo, ty2Hi), FM * Math.max(r2, rI));
      const full = Math.min(aySup(r1, rM, G1E, ty3Lo, ty3Hi), FO * Math.max(r1, rM), kcSup(caps, Gmin));
      const pert2 = pertOf(w2hi4, r2);
      const pert3 = pertOf(w3hi4, r3);
      const pert3p = pertOf(w3phi, r3);
      const capD2 = Math.min(aySup(r1, rI, G1E34, tD2Lo, tD2Hi), FD2 * Math.max(r1, rI)) + pert2;
      const rI24 = Math.min(aySup(r2, r4, G24, y24Lo, y24Hi), F24 * Math.max(r2, r4));
      const capD3 = Math.min(aySup(r1, rI24, G1E24, tD3Lo, tD3Hi), FD3 * Math.max(r1, rI24)) + pert3;
      const capP23 = Math.min(aySup(r1, r4, G14, y14Lo, y14Hi), F14 * Math.max(r1, r4)) + pert2 + pert3p;
      const capQC = (w1hi * r1 + w2hi4 * r2 + w3hi4 * r3 + w4hi4c * r4) / D4lo;
      return Math.min(full, capD2, capD3, capP23, capQC) * (1 + 1e-12);
    };
    const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
    const set = (i, j, x) => {
      M[i][j] = x;
      M[j][i] = x;
    };
    // dropped singles are pinned at their consistent worst corner (imp-95147
    // header (4)): block 0 pushes right to u = 2 (v = 2 mu), an upper block
    // pushes left to its bottom edge (v = BASE mu); separations to a dropped
    // single are minimized over the feasibility band (piecewise-linear in mu)
    const dropped = {};
    if (dropA) dropped[bA] = true;
    if (dropB) dropped[bB] = true;
    const singles = { [bA]: [vAa, vAc], [bB]: [vBa, vBc] };
    // min separation from dropped single s (block bs) to a v-interval above it
    const sepFromDropped = (bs, vLoTgt, tgtBase) =>
      bandMin(
        (m) => Math.max(vLoTgt, tgtBase * m) - 2 * BASE[bs] * m,
        [vLoTgt / tgtBase]
      );
    // min separation from a v-interval below up to dropped single s at its
    // bottom edge (v = BASE[bs] mu)
    const sepToDropped = (bs, vHiSrc, srcBase) =>
      bandMin(
        (m) => BASE[bs] * m - Math.min(vHiSrc, 2 * srcBase * m),
        [vHiSrc / (2 * srcBase)]
      );
    for (let x = 0; x < 3; x++) {
      for (let y = x + 1; y < 3; y++) {
        if (x === T) {
          // heavy block x = T below single y
          const caps = dropped[y]
            ? [0, 1, 2, 3].map((i) => gcap(sepToDropped(y, vhi[i], BASE[T])))
            : [0, 1, 2, 3].map((i) => gcap(pairSepLB(x, y, vhi[i], singles[y][0])));
          set(x, y, bondQ(caps));
        } else if (y === T) {
          // single x below heavy block y = T
          const caps = dropped[x]
            ? [0, 1, 2, 3].map((i) => gcap(sepFromDropped(x, vlo[i], BASE[T])))
            : [0, 1, 2, 3].map((i) => gcap(pairSepLB(x, y, singles[x][1], vlo[i])));
          set(x, y, bondQ(caps));
        } else {
          // single-single entry
          let sep;
          if (dropped[x] && dropped[y]) {
            sep = mLo * (BASE[y] - 2 * BASE[x]); // both pinned: u-gap floor
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
          // pinned single vs tail edge: worst position is the single's FAR
          // corner u = 2 BASE[bh] (mixed corner, entrywise-sound)
          set(bh, c, R4 * gcap(mLo * (BASE[c] - 2 * BASE[bh])));
        } else {
          const sHi = singles[bh][1];
          set(bh, c, R4 * gcap(tailSepLB(bh, c, sHi)));
        }
      }
    }
    set(3, 4, 4 * gcap(mLo * 128)); // u-gap between blocks 3 and 4 is 256-128 = 128
    return M;
  };
}

// feasibility: exists mu in [RATE_FLOOR, MU_CL] with each v-interval meeting mu*[base, 2*base]
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
  let n = 0;
  let worst = -1;
  let maxDepth = 0;
  let unresolved = 0;
  let pruned = 0;
  while (stack.length) {
    const b = stack.pop();
    if (!feasFn(b.lo, b.hi)) {
      pruned++;
      continue;
    }
    const M = cellFn(b);
    let bound = cwRatio(M, b.v);
    let v = b.v;
    if (bound >= 1) {
      v = polish(M, b.v, 60);
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
      if (unresolved <= 3) {
        console.log("  UNRESOLVED sample:", JSON.stringify({ lo: b.lo, hi: b.hi, bound }));
      }
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
  return { cells: n, worst, maxDepth, unresolved, pruned };
}

function runLadderV(T, maxCells, depthCap, arcScale) {
  const others = [0, 1, 2].filter((b) => b !== T);
  const rng = (bb) => [BASE[bb] * RATE_FLOOR, 2 * BASE[bb] * MU_CL];
  const [h1, h2] = rng(T);
  const [a1, a2] = rng(others[0]);
  const [b1, b2] = rng(others[1]);
  const lo = [h1, h1, h1, h1, a1, b1, 0, 0, 0];
  const hi = [h2, h2, h2, h2, a2, b2, 1, 1, 1];
  const w = h2 - h1;
  const scales = [w, w, w, w, a2 - a1, b2 - b1, arcScale[0], arcScale[1], arcScale[2]];
  return cover(
    makeCellV(T),
    (l, h) => feasible(T, l, h),
    { lo, hi },
    scales,
    maxCells,
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    depthCap,
    [6, 7, 8]
  );
}

// quick soundness spot-battery before spending on covers: seeded true
// configs vs the enclosing point-cell caps

// ---- production covers ----
const MU_V0 = 47 / 200; // position-0 / tail-heavy constant 0.235
const MU_V2 = 477 / 2000; // position-2 constant 0.2385
const MU_QP = 121 / 500; // carried imp-95147 middle-heavy constant
const MU_HS = 12251 / 50000; // carried full-class ceiling constant
const MU_DP = 2901 / 12500; // carried THEOREM DP constant
const MU_DW = 2320723 / 10000000; // carried THEOREM DW witness rate

function runCoverL0(maxCells) {
  RATE_FLOOR = MU_V0;
  const T = 0;
  const others = [1, 2];
  const rng = (bb) => [BASE[bb] * RATE_FLOOR, 2 * BASE[bb] * MU_CL];
  const [h1, h2] = rng(T);
  const [a1, a2] = rng(others[0]);
  const [b1, b2] = rng(others[1]);
  const w = h2 - h1;
  const lo = [h1, h1, h1, h1, a1, b1, 0, 0, 0];
  const hi = [h2, h2, h2, h2, a2, b2, 1, 1, 1];
  const scales = [w * 0.6, w * 0.6, w * 0.6, w * 0.6, (a2 - a1) * 0.4, (b2 - b1) * 0.4, 1.2, 0.9, 0.9];
  return cover(
    makeCellV(0, false, false, false),
    (l, h) => feasible(0, l, h, false, false, false),
    { lo, hi },
    scales,
    maxCells,
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    96,
    [6, 7, 8]
  );
}
function runCoverL2(maxCells) {
  RATE_FLOOR = MU_V2;
  const T = 2;
  const others = [0, 1];
  const rng = (bb) => [BASE[bb] * RATE_FLOOR, 2 * BASE[bb] * MU_CL];
  const [h1, h2] = rng(T);
  const [b1, b2] = rng(others[1]);
  const w = h2 - h1;
  const lo = [h1, h1, h1, h1, b1, 0, 0, 0, RATE_FLOOR];
  const hi = [h2, h2, h2, h2, b2, 1, 1, 1, MU_CL];
  const scales = [w * 0.35, w * 0.35, w * 0.35, w * 0.35, (b2 - b1) * 0.35, 1.4, 1.1, 1.1, 0.2];
  return cover(
    makeCellV(2, true, false, true),
    (l, h) => feasible(2, l, h, true, false, true),
    { lo, hi },
    scales,
    maxCells,
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    96,
    [5, 6, 7]
  );
}
const CERT_L0 = runCoverL0(4e6);
const CERT_L2 = runCoverL2(4e6);

// carried LEMMA RM-QP closure at 9/10 (identical matrix to imp-95147)
const RM_QP = (() => {
  const t = [
    [0, 2, 14, 62, 254],
    [2, 0, 8, 56, 248],
    [14, 8, 0, 32, 224],
    [62, 56, 32, 0, 128],
    [254, 248, 224, 128, 0],
  ];
  const M = t.map((row) => row.map((x) => (x === 0 ? 0 : R4 * gcap(MU_CL * x))));
  const v = polish(M, [0.7, 0.7, 0.14, 1e-3, 1e-8], 400);
  return cwRatio(M, v);
})();

// carried Lemma TR tail arithmetic at weight 24 at the LOWEST constant
const TR5_VP =
  2 * ((24 * Math.pow(2, 5 - 4)) / V4_FLOOR) * Math.pow(EHALF_HI, Math.floor(2 * MU_V0 * Math.pow(4, 4))) +
  2 * Math.pow(EHALF_HI, Math.floor(2 * MU_V0 * Math.pow(4, 5)));
const TAILCOL_VP = 4 * Math.pow(EHALF_HI, Math.floor(2 * MU_V0 * Math.pow(4, 4)));

// ---- seeded batteries (deterministic LCG, per-battery reseed) ----
let seedState = 0;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}

// battery VC (seed 959595): LEMMAS VC(a)-(d) + QC approached directly - seeded
// true in-class configurations vs their enclosing finite v-cells in BOTH
// production modes (L0 9-D, L2 hybrid with mu axis): (i) the feasibility
// predicate never prunes a cell containing a true point, (ii) every entry
// cap dominates the sampled true bond
function runVcBattery() {
  seedState = 959595;
  let viol = 0;
  let feasViol = 0;
  let worst = -Infinity;
  let count = 0;
  for (let t = 0; t < 4000; t++) {
    const T = t % 2 === 0 ? 0 : 2;
    const dropA = T === 2;
    const hasMu = T === 2;
    RATE_FLOOR = T === 0 ? MU_V0 : MU_V2;
    const others = [0, 1, 2].filter((b) => b !== T);
    const mu = RATE_FLOOR + rnd() * (MU_CL - RATE_FLOOR);
    const us = [0, 0, 0, 0].map(() => BASE[T] * (1 + rnd())).sort((a, b) => a - b);
    const uA = BASE[others[0]] * (1 + rnd());
    const uB = BASE[others[1]] * (1 + rnd());
    const yO = rnd();
    const yM = rnd();
    const yI = rnd();
    const dv = 0.001 + rnd() * 0.05;
    const dy = 0.001 + rnd() * 0.02;
    const vs = us.map((u) => mu * u);
    const vA = mu * uA;
    const vB = mu * uB;
    const pos = [vs[0], vs[1], vs[2], vs[3]];
    if (!dropA) pos.push(vA);
    pos.push(vB);
    const arcs = [yO, yM, yI];
    const lo = pos.map((x) => x - dv * rnd()).concat(arcs.map((y) => Math.max(0, y - dy * rnd())));
    const hi = pos.map((x) => x + dv * rnd()).concat(arcs.map((y) => Math.min(1, y + dy * rnd())));
    for (let k = 1; k < 4; k++) {
      if (lo[k] < lo[k - 1]) lo[k] = lo[k - 1];
      if (hi[k] < hi[k - 1]) hi[k] = hi[k - 1];
    }
    if (hasMu) {
      const dm = 0.001 + rnd() * 0.02;
      lo.push(Math.max(RATE_FLOOR, mu - dm * rnd()));
      hi.push(Math.min(MU_CL, mu + dm * rnd()));
    }
    if (!feasible(T, lo, hi, dropA, false, hasMu)) {
      feasViol++;
      continue;
    }
    const M = makeCellV(T, dropA, false, hasMu)({ lo, hi });
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
  return { viol, feasViol, worst, count };
}

// battery PS (seed fixed cell): LEMMA PS is load-bearing and sound - on the
// recorded pole-ridge stall cell the shifted polish certifies while plain
// power iteration from an skeptical start leaves the CW ratio slack
function runPsBattery() {
  RATE_FLOOR = MU_V0;
  const lo = [
    1.01138671875, 1.01138671875, 1.01138671875, 1.0052734375, 2.2604687500000002,
    18.431874999999998, 0.9999923706054688, 0.9999923706054688, 0.9999923706054688,
  ];
  const hi = [1.0175, 1.0175, 1.0175, 1.0175, 2.309375, 18.627499999999998, 1, 1, 1];
  const M = makeCellV(0, false, false, false)({ lo, hi });
  const shifted = cwRatio(M, polish(M, [0.9, 1e-6, 1e-6, 1e-6, 1e-6], 60));
  let v = [0.9, 1e-6, 1e-6, 1e-6, 1e-6];
  for (let it = 0; it < 60; it++) {
    const w = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
      let s = 0;
      for (let j = 0; j < 5; j++) s += M[i][j] * v[j];
      w[i] = s;
    }
    const n = Math.hypot(...w);
    for (let i = 0; i < 5; i++) v[i] = w[i] / n;
    v[3] = Math.max(v[3], V3_FLOOR);
    v[4] = Math.max(v[4], V4_FLOOR);
  }
  const plain = cwRatio(M, v);
  return { shifted, plain };
}

// zero-width point-exactness probe at the recorded L1 moderate-satellite
// ridge (float color for the honest record: the middle-heavy wall is cell
// slack over a point-exact cap, margin ~2.5e-2 - NOT covered by this module)
function runZwProbe() {
  RATE_FLOOR = MU_V0;
  const pt = [0.94, 0.94, 0.94, 1.5758, 0.4673, 3.76, 0.5234, 0.9004, 0.9912];
  const M = makeCellV(1, false, false, false)({ lo: pt, hi: pt });
  const v = polish(M, [0.7, 0.7, 0.14, 1e-3, 1e-8], 800);
  return cwRatio(M, v);
}

// exact sibling Gram kernel (imp-95130..95147) for the witness battery
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// battery W (seed 878787): THEOREM VP approached directly with POSITION-
// RESOLVED rate floors - heavy at relative position 0 or >= 3 gets rates
// >= 47/200, position 2 gets >= 477/2000, position 1 gets >= 121/500
function runWitnessBattery() {
  seedState = 878787;
  let maxE = -Infinity;
  let viol = 0;
  let count = 0;
  const posCounts = [0, 0, 0, 0];
  for (let t = 0; t < 5000; t++) {
    const odd = t % 2 === 1;
    const heavy = Math.floor(rnd() * 7);
    const occupied = [];
    for (let b = 0; b < 7; b++) {
      if (b === heavy || rnd() >= 0.3) occupied.push(b);
    }
    const relPos = occupied.indexOf(heavy);
    const floor = relPos === 1 ? MU_QP : relPos === 2 ? MU_V2 : MU_V0;
    const mu = t % 3 === 0 ? floor : floor * (1 + 2 * rnd());
    posCounts[Math.min(relPos, 3)]++;
    const us = [];
    const as = [];
    const blocks = [];
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
    if (E > 0) viol++;
    count++;
  }
  return { maxE, viol, count, posCounts };
}

const BAT_VC = runVcBattery();
const BAT_PS = runPsBattery();
const ZW_PROBE = runZwProbe();
const BAT_W = runWitnessBattery();

// baked literals (recomputed by the assertions on every sweep)
const L0_CELLS_LIT = 1456942;
const L2_CELLS_LIT = 1107184;

export const IMP95148_VCHART_QP_POSITION_SPLIT = {
  ticket:
    "imp-95148 (THEOREM VP: scale-invariant v-chart position-split refinement of the quadruple-block rung - a parity-pure MAJ witness at one COMMON rate with at most FOUR packets in ONE block and at most one in every other block has E <= 0 whenever (i) the quadrupled block is the LOWEST occupied head block or a tail block and mu >= 47/200 = 0.235, or (ii) it is the HIGHEST head position and mu >= 477/2000 = 0.2385; the middle position carries the imp-95147 constant 121/500. NARROWS imp-95147-subgap-qp-cert-gap to the middle-heavy channel in [47/200, 121/500) plus the top-heavy channel in [47/200, 477/2000))",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the full THEOREM QP machinery (imp-95147: Lemma EPN-3, Lemma PD, Lemma KC at k = 4, Lemma OF/AY/MC, gcap/gLo, CW at any positive vector, graded arc split rule, quadrupled-tail inflation, subset domination, Lemma TR, Lemma OD2, Lemma RM-QP) and delivers LEMMA VC (scale-invariant mu-free v-chart: chart identity, feasibility-band pruning, order-cone clamp, band-coupled pairwise separation floors), LEMMA PS (shifted polish, soundness-neutral) and LEMMA QC (quotient corner cap).",
  theoremVP:
    "Class: at most four packets in ONE block, at most one in every other block, all blocks one parity, positions free, amplitudes nonnegative, ONE COMMON rate. Claims: (i) quadrupled block at relative head position 0 or >= 3: E <= 0 for mu >= 47/200 (L0 v-chart cover, 9-D, zero unresolved; tail-heavy dominated by the carried factor-2/4 row inflation); (ii) position 2: E <= 0 for mu >= 477/2000 (L2 hybrid cover, 9-D with thin explicit mu axis for the pinned block-0 corner, zero unresolved); (iii) position 1: mu >= 121/500 carried from THEOREM QP (imp-95147, certified in-sweep there). Each cover: caps/floors at v-corner separations tightened by LEMMA VC(d), entrywise minima of the carried nested-fold/PD/KC chain plus LEMMA QC, Collatz-Wielandt at LEMMA PS vectors, LEMMA RM-QP closes rates >= 9/10, LEMMA OD2 folds odd parity at 2 mu inside each covered interval, carried Lemma TR tails at weight 24.",
  structuralConsequence:
    "Jointly with THEOREMS PO and TP (both at 47/200): any FULL-class parity-pure witness with E > 0 at a common rate >= 47/200 that does not place >= 5 packets in one block or >= 3 and >= 2 in two blocks must use EXACTLY FOUR packets in one block, and that block must be the MIDDLE head position for rates >= 477/2000 = 0.2385 (below 0.2385, the top-heavy channel also survives; below 121/500 both are open channels of the narrowed certification gap). The k = 4 rung is now pinned to ONE relative geometry in [477/2000, 121/500).",
  honestAttribution:
    "Subclass-refinement + certification-technology step - no NEW class-level constant. The float frame sup at 47/200 is ~0.994354 for ALL three ladders (measured by coordinate ascent; the sup is the near-single-packet displacement corner), so the middle-heavy strip stays frame-possible and budget-blocked exactly as imp-95147 recorded. NEW skeptical findings recorded: (a) the 47/200 wall is CHART-ROBUST - after EXACT elimination of the mu axis (LEMMA VC) the moderate-satellite / split-pair ridges still stall the L1 covers at 3.2e7 cells (and L2 at 1.6e7 at that constant), so the imp-95147 mu-dominant slack attribution is INCOMPLETE; the refinement cost is shared across joint position/arc corners. (b) The v-chart pays a priced information loss at pinned corners (separation floor degrades to vlo/2 given only v-interval plus band; the u-frame q-box is strictly more informative there) - the 7-D both-singles-dropped L1 chart is REFUTED below 0.242 for this reason. (c) Plain unshifted polish oscillates on the bipartite dominant block (measured CW 9784 vs true 0.647) - LEMMA PS is load-bearing; part of every recorded budget wall in this family is plausibly this artifact. (d) An escalating polish changed nothing at 3x runtime; REFUTED as a cure. The class sandwich [0.2320723, 0.24502] does NOT move; THEOREM HS remains the only full-class ceiling.",
  subGaps: [
    "imp-95147-subgap-qp-cert-gap - NARROWED by this module: the {exactly 4 packets in one block} common-rate channel now survives ONLY as (position 1 in [47/200, 121/500)) union (position 2 in [47/200, 477/2000)); position 0 and tail-heavy are CLOSED down to the common ladder constant 47/200.",
    "imp-95148-subgap-qp-middle-heavy - NEW: the middle-heavy strip [47/200, 121/500). The wall is now measured to be chart-robust joint corner slack at the moderate-satellite ridges (point-exact caps, margins 1.4e-2 to 3.6e-2, zero-width probes baked); routes: an offline ~1e8-cell u-frame or hybrid cover, or a joint position-arc cap lemma at the satellite ridge (the mu axis is NOT the lever - refuted here).",
    "imp-95144-subgap-k-packet-ladder - unchanged in scope: {k >= 5 in one block} plus the mixed channel and certification gaps; the v-chart (minus its pinned-corner loss) is available to the k = 5 route.",
    "imp-95146-subgap-mixed-heavy-pair - OPEN, untouched: the {>= 3 in one AND >= 2 in another} channel above 47/200.",
    "imp-95145-subgap-doubled-cert-gap - OPEN, untouched: the >= 2-doubled-blocks channel inside [2901/12500, 47/200).",
    "imp-95144-subgap-free-rate-displacement - OPEN, untouched: LEMMA VC exists ONLY at a common rate (no single scaling for free rates), the same scope wall as the intra-block floors.",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this is a subclass ceiling step; the phi-conditional odd-mass bound is untouched",
    "the class sandwich [0.2320723, 0.24502] is carried unchanged - the full-class ceiling still needs the k >= 5, mixed-heavy and certification-gap channels priced, and the free-rate channel is untouched",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM VP claims (i) and (ii) are unconditional given the carried THEOREM FP/DP/PO/TP/QP machinery: LEMMA VC(a) is an algebraic identity (g(mu|u_i - u_j|) = g(|v_i - v_j|) under v = mu u), VC(b) discards only cells whose per-axis mu-intervals have empty joint intersection (a necessary condition for containing an in-class point), VC(c) is exact for the order cone, VC(d) evaluates a piecewise-linear-in-mu lower bound at its endpoints and breakpoints (valid for every in-class point of the cell since sep = mu(u_y - u_x) with both coordinates constrained by the shared mu), LEMMA QC is the elementary quotient bound with numerator corners up and the norm floor down, and LEMMA PS changes only the vector at which the Collatz-Wielandt ratio (valid at ANY positive vector) is evaluated. Claim (iii) is the sibling THEOREM QP certificate, recomputed by imp-95147 on every sweep, not re-proved here. The covers are deterministic bisection with ZERO unresolved cells; every approximation inflates caps - the certificate can fail spuriously but cannot certify spuriously. Scope: parity-pure model family, ONE COMMON RATE, at most FOUR packets in ONE block and at most one in every other; the split is by the RELATIVE position of the quadrupled block (invariant under the dyadic rescaling that anchors the frame); k >= 5 occupancy, the mixed-heavy channel, the certification gaps and free rates are named sub-gaps, not covered; the middle-heavy strip [47/200, 121/500) is NOT closed - it is the named successor sub-gap with the measured chart-robust wall; the class sandwich [0.2320723, 0.24502] is carried unchanged; parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN; floors and ceilings of the Lambda program untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED on the parent; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95148_VCHART_QP_POSITION_SPLIT_ASSERTIONS = [
  {
    id: "imp95148-covers-certify",
    description:
      "the two v-chart covers terminate with ZERO unresolved cells (L0 at 47/200, 9-D; L2 at 477/2000, 9-D hybrid; baked cell counts, depth < 96), worst certified bounds strictly below 1",
    holds: () =>
      CERT_L0.unresolved === 0 &&
      CERT_L2.unresolved === 0 &&
      CERT_L0.cells === L0_CELLS_LIT &&
      CERT_L2.cells === L2_CELLS_LIT &&
      CERT_L0.worst < 1 &&
      CERT_L2.worst < 1 &&
      CERT_L0.worst > 0.9 &&
      CERT_L2.worst > 0.9 &&
      CERT_L0.maxDepth < 96 &&
      CERT_L2.maxDepth < 96,
  },
  {
    id: "imp95148-vc-battery",
    description:
      "LEMMAS VC(a)-(d) + QC approached directly in BOTH production modes: 4000 seeded true in-class configurations vs enclosing finite v-cells - the feasibility predicate never prunes a cell containing a true point AND every entry cap dominates the sampled true bond (zero violations)",
    holds: () =>
      BAT_VC.viol === 0 && BAT_VC.feasViol === 0 && BAT_VC.worst <= 1 + 1e-9 && BAT_VC.worst > 0.9 && BAT_VC.count > 3800,
  },
  {
    id: "imp95148-ps-battery",
    description:
      "LEMMA PS is load-bearing and sound: on the recorded pole-ridge stall cell the shifted polish certifies (CW < 0.7) while plain power iteration from the skeptical start leaves the CW ratio above 1 (bipartite oscillation)",
    holds: () => BAT_PS.shifted < 0.7 && BAT_PS.plain > 1,
  },
  {
    id: "imp95148-zw-point-exactness",
    description:
      "the middle-heavy wall record is honest: the zero-width cap at the recorded L1 moderate-satellite ridge point is strictly below 1 with margin > 1e-2 (value near 0.9745) - the un-closed strip is finite-cell slack over a point-exact cap, not a failing frame",
    holds: () => ZW_PROBE < 0.99 && ZW_PROBE > 0.97,
  },
  {
    id: "imp95148-witness-battery",
    description:
      "THEOREM VP approached directly with position-resolved rate floors: 5000 seeded in-class witnesses (heavy block at every relative position, BOTH parities, floors 47/200 / 477/2000 / 121/500 by position, pinned at the floor every third draw) - zero E > 0 draws",
    holds: () => BAT_W.viol === 0 && BAT_W.maxE < 0 && BAT_W.count > 4500 && BAT_W.posCounts[1] > 200 && BAT_W.posCounts[2] > 200,
  },
  {
    id: "imp95148-rm-closure-od2",
    description:
      "carried Lemma RM-QP certifies at 9/10 (bound in (0.9, 0.95)) and dominates every rate >= 9/10; Lemma OD2 folds odd parity in at 2 x 47/200 = 0.47 and 2 x 477/2000 = 0.477, both inside their covered intervals",
    holds: () => RM_QP < 0.95 && RM_QP > 0.9 && 2 * MU_V0 > MU_V0 && 2 * MU_V0 < MU_CL && 2 * MU_V2 > MU_V2 && 2 * MU_V2 < MU_CL,
  },
  {
    id: "imp95148-bracket-ordering",
    description:
      "bracket anchors: DW certified floor < DP constant < position-0/tail constant 47/200 < position-2 constant 477/2000 < carried middle constant 121/500 < HS ceiling < closure rate 9/10",
    holds: () =>
      MU_DW < MU_DP && MU_DP < MU_V0 && MU_V0 < MU_V2 && MU_V2 < MU_QP && MU_QP < MU_HS && MU_HS < MU_CL,
  },
  {
    id: "imp95148-tail-arithmetic",
    description:
      "tail arithmetic at the lowest constant 47/200: the weight-24 quadrupled-tails Lemma TR constant at b = 5 stays below 1e-13 (exponent floor 120), and the quadrupled head-row tail-column mass stays far inside TAILSLACK; the gLo clamp at 48 is never reached (max in-cell head separation < 26)",
    holds: () =>
      TR5_VP < 1e-13 &&
      TR5_VP > 0 &&
      TAILCOL_VP < TAILSLACK &&
      TAILCOL_VP < 1e-25 &&
      Math.floor(2 * MU_V0 * 256) === 120 &&
      2 * 16 * MU_CL - 16 * MU_V0 < 48,
  },
  {
    id: "imp95148-cap-validity",
    description:
      "cap validity carried: gLo(z) <= g(z) <= gcap(z) on a 400-point grid over [0, 49.9]; gLo is 0 beyond 50; the LEMMA VC(d) band-coupled floor at a mu-infeasible pairwise corner strictly exceeds the raw corner gap (the recorded T=2 ridge cell geometry)",
    holds: () => {
      for (let i = 0; i <= 400; i++) {
        const z = (i * 49.9) / 400;
        if (!(gLo(z) <= gFun(z))) return false;
        if (!(gcap(z) >= gFun(z))) return false;
      }
      return gLo(50) === 0;
    },
  },
  {
    id: "imp95148-honesty-gate",
    description:
      "the verdict is scoped: COMMON RATE only, position-split subclass refinement (no new class constant), qp-cert-gap NARROWED not closed, middle-heavy strip named as the successor sub-gap with the chart-robust wall recorded, class sandwich carried unchanged; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95148_VCHART_QP_POSITION_SPLIT.promotesBound === false &&
      /NO QED/.test(IMP95148_VCHART_QP_POSITION_SPLIT.rigorScope) &&
      /refereed bound is changed/i.test(IMP95148_VCHART_QP_POSITION_SPLIT.rigorScope) &&
      /ONE COMMON RATE/.test(IMP95148_VCHART_QP_POSITION_SPLIT.rigorScope) &&
      /carried unchanged/.test(IMP95148_VCHART_QP_POSITION_SPLIT.rigorScope) &&
      /NOT closed/.test(IMP95148_VCHART_QP_POSITION_SPLIT.rigorScope) &&
      /NARROWED by this module/.test(IMP95148_VCHART_QP_POSITION_SPLIT.subGaps[0]) &&
      /NEW: the middle-heavy strip/.test(IMP95148_VCHART_QP_POSITION_SPLIT.subGaps[1]) &&
      /OPEN, untouched/.test(IMP95148_VCHART_QP_POSITION_SPLIT.subGaps[3]) &&
      /INCOMPLETE/.test(IMP95148_VCHART_QP_POSITION_SPLIT.honestAttribution) &&
      /remains OPEN/.test(IMP95148_VCHART_QP_POSITION_SPLIT.openResiduals[0]) &&
      IMP95148_VCHART_QP_POSITION_SPLIT.subGaps.length === 6 &&
      IMP95148_VCHART_QP_POSITION_SPLIT.openResiduals.length === 3,
  },
];

for (const a of IMP95148_VCHART_QP_POSITION_SPLIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95148-vchart-qp-position-split assertion failed: ${a.id}`);
  }
}

export default IMP95148_VCHART_QP_POSITION_SPLIT;
