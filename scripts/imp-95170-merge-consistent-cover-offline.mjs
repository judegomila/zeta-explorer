/**
 * imp-95170 offline: MERGE-CONSISTENT COPOSITIVE COVER of the two-point class.
 *
 * Successor named by imp-95169 FINDING CT: the entrywise lower-matrix
 * enclosure of H = 2D - G is positionally inconsistent at doubled blocks
 * (within-block Gram entry at maximal width while cross entries sit at
 * minimal distances -- a fake extra packet). Fix (LEMMA MC): parametrize
 * each doubled middle block b by (u_b, s_b) with left packet u_b and
 * separation s_b >= 0 (right packet v_b = u_b + s_b <= R_b). Then in any
 * cell the within entry g(mu s) and the far-packet cross entries
 * g(mu (dNear + s)) are lower-bounded CONSISTENTLY in the same s-range:
 *   - within block b:            H_uv = g(mu s)            >= g(m2 sHiEff)
 *   - u_b to a LEFT external e:  d = u - x_e               >= u1 - x_e
 *   - v_b to a LEFT external e:  d = u + s - x_e           >= u1 + s1 - x_e
 *   - v_b to a RIGHT external e: d = x_e - v               >= x_e - vMax
 *   - u_b to a RIGHT external e: d = (x_e - v) + s         >= (x_e - vMax) + s1
 *                                and directly              >= x_e - u2 (take max)
 * every bound is valid for EVERY feasible configuration in the cell, so the
 * matrix H_MC is entrywise <= H(config) and, for z >= 0,
 * z^T H(config) z >= z^T H_MC z: cell copositive min >= simplexMin(H_MC).
 * Blocks 0/4 are pinned at their inner endpoints 2 / 256 by the recorded
 * THEOREM SA (arbitrary occupancy collapses, entrywise + Perron) plus
 * one-sided entry monotonicity (all other blocks lie on one side).
 *
 * Layered branch-and-bound: mu-layers from the band top 0.23209 down to the
 * recorded covered-band floor 0.2320727, geometric toward the copositive
 * crossing 0.23207238984; within a layer, 7-D adaptive bisection over
 * (mu, u1, s1, u2, s2, u3, s3), per-cell test simplexMin(H_MC) >= TAU.
 * Refused near-singular KKT supports mark the cell unresolved (split) --
 * strictly sound. Fail-fast: a cached failing witness z rejects most
 * failing cells in O(64) flops; split dim chosen by the bound gain of
 * collapsing each dim to its midpoint against the failing z.
 */

const g = (z) => Math.exp(-z) * (1 + z);

const MUF = 0.2320727; // recorded covered-band floor (target)
const RIGHT = 0.23209; // recorded unconditional-window floor
const CROSS = 0.23207238984117226; // imp-95169 copositive crossing (corner)
const TAU = 2e-8; // certificate threshold (float-safety margin)
const NUDGE = 1e-12;
const BOXES = [[4, 8], [16, 32], [64, 128]]; // middle blocks 1..3
const X0 = 2, X4 = 256; // pinned outer packets (THEOREM SA + monotonicity)
const N = 8;

// index layout: 0 = block0(2); 1,2 = block1 u,v; 3,4 = block2; 5,6 = block3; 7 = block4(256)
const BLKOF = [0, 1, 1, 2, 2, 3, 3, 4];

// ---------------------------------------------------------------------------
// exact H at a configuration (for batteries), flat 8x8
// ---------------------------------------------------------------------------
function exactH(xs, mu) {
  const H = new Float64Array(N * N);
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      const gij = g(mu * Math.abs(xs[i] - xs[j]));
      H[i * N + j] = BLKOF[i] === BLKOF[j] ? gij : -gij; // 2D - G
    }
  return H;
}

// ---------------------------------------------------------------------------
// support enumeration tables + preallocated buffers
// ---------------------------------------------------------------------------
const SUPPORTS = [];
for (let S = 1; S < (1 << N); S++) {
  const idx = [];
  for (let i = 0; i < N; i++) if (S & (1 << i)) idx.push(i);
  if (idx.length >= 2) SUPPORTS.push(idx);
}
const BUF_Hss = new Float64Array(64), BUF_Hr = new Float64Array(49),
  BUF_L = new Float64Array(49), BUF_rhs = new Float64Array(7),
  BUF_y = new Float64Array(7), BUF_t = new Float64Array(7), BUF_z = new Float64Array(8);

function quadZ(H, z) {
  let q = 0;
  for (let i = 0; i < N; i++) {
    const zi = z[i];
    if (zi === 0) continue;
    let row = 0;
    for (let j = 0; j < N; j++) row += H[i * N + j] * z[j];
    q += zi * row;
  }
  return q;
}

// CERTIFIED simplex lower bound by convex-face enumeration.
//
// The true simplex minimum equals the minimum over supports S of the true
// minimum of q(z) = z^T H z over the closed face F_S. Per face:
//  - If the reduced Hessian Hr(S) FAILS the positive-pivot float Cholesky,
//    the face is SKIPPED, rigorously: true Hr indefinite puts the face
//    minimum strictly on the relative boundary (smaller support); true Hr
//    PSD with lambda_min = eps has any interior dip below the boundary
//    value bounded by eps * diam^2 <= ~1e-15 (the unconstrained dip point
//    at depth (grad n)/eps leaves the simplex unless grad n <= eps), which
//    EPS_FACE absorbs.
//  - If Cholesky SUCCEEDS, q is convex on the face (up to ~1e-15 absorbed
//    in EPS_FACE), so for ANY feasible z~ in F_S with gamma = 2 Hss z~ the
//    Frank-Wolfe gap bound holds:
//        q(z) >= q(z~) - (gamma . z~ - min_a gamma_a) - EPS_FACE.
//    z~ is produced by an NNLS-style active-set refinement of the KKT
//    solution; at the constrained face optimum the gap is 0, and an
//    ill-conditioned or truncated refinement only LOOSENS the bound
//    (forces a split) -- it can never overcertify.
//  - A feasible point with value < failBelow proves the simplex min is
//    below failBelow (values are upper bounds) -- exact fail.
// Vertices are handled by the exact diagonal scan.
//
// Fail-fast: if failBelow is finite, return as soon as any face bound
// drops below it (zOut filled with the feasible witness z~).
const EPS_FACE = 1e-12;
const BUF_zc = new Float64Array(8), BUF_g = new Float64Array(8);
const BUF_free = new Int32Array(8);

// equality-KKT solve on the free coordinate set (indices into the face),
// writing the affine-critical point (sums to 1 over free coords) into out.
// Returns false if the reduced Cholesky fails.
function eqSolve(m, free, nf, out) {
  if (nf === 1) { out.fill(0); out[free[0]] = 1; return true; }
  const k = nf - 1, piv = free[nf - 1];
  for (let a = 0; a < k; a++)
    for (let b = 0; b < k; b++)
      BUF_Hr[a * k + b] = BUF_Hss[free[a] * m + free[b]] - BUF_Hss[free[a] * m + piv] -
        BUF_Hss[piv * m + free[b]] + BUF_Hss[piv * m + piv];
  for (let a = 0; a < k; a++) BUF_rhs[a] = -(BUF_Hss[free[a] * m + piv] - BUF_Hss[piv * m + piv]);
  for (let i = 0; i < k; i++)
    for (let j = 0; j <= i; j++) {
      let s = BUF_Hr[i * k + j];
      for (let q = 0; q < j; q++) s -= BUF_L[i * k + q] * BUF_L[j * k + q];
      if (i === j) {
        if (s <= 0) return false;
        BUF_L[i * k + i] = Math.sqrt(s);
      } else BUF_L[i * k + j] = s / BUF_L[j * k + j];
    }
  for (let i = 0; i < k; i++) {
    let s = BUF_rhs[i];
    for (let q = 0; q < i; q++) s -= BUF_L[i * k + q] * BUF_y[q];
    BUF_y[i] = s / BUF_L[i * k + i];
  }
  for (let i = k - 1; i >= 0; i--) {
    let s = BUF_y[i];
    for (let q = i + 1; q < k; q++) s -= BUF_L[q * k + i] * BUF_t[q];
    BUF_t[i] = s / BUF_L[i * k + i];
  }
  out.fill(0);
  let tm = 1;
  for (let a = 0; a < k; a++) { out[free[a]] = BUF_t[a]; tm -= BUF_t[a]; }
  out[free[nf - 1]] = tm;
  return true;
}

function simplexMin(H, failBelow, zOut) {
  let best = Infinity;
  let bestIdx = null, bestZ = null;
  for (let i = 0; i < N; i++) {
    const d = H[i * N + i];
    if (d < best) { best = d; bestIdx = [i]; bestZ = [1]; }
  }
  if (best < failBelow) {
    if (zOut) { zOut.fill(0); zOut[bestIdx[0]] = 1; }
    return { min: best, failed: true };
  }
  for (let si = 0; si < SUPPORTS.length; si++) {
    const idx = SUPPORTS[si];
    const m = idx.length;
    for (let a = 0; a < m; a++)
      for (let b = 0; b < m; b++) BUF_Hss[a * m + b] = H[idx[a] * N + idx[b]];
    // full-face convexity gate + initial KKT point
    for (let a = 0; a < m; a++) BUF_free[a] = a;
    if (!eqSolve(m, BUF_free, m, BUF_z)) continue; // rigorously skippable
    // NNLS-style active-set refinement toward the constrained face optimum:
    // walk from a feasible point toward the current equality solution,
    // blocking at zero boundaries; re-solve on the shrunken free set.
    let nf = m;
    let feasible = true;
    for (let a = 0; a < m; a++) if (BUF_z[a] < 0) feasible = false;
    if (!feasible) {
      // start from barycenter, walk toward BUF_z with blocking
      for (let a = 0; a < m; a++) BUF_zc[a] = 1 / m;
      for (let it = 0; it < 2 * m; it++) {
        let th = 1, blk = -1;
        for (let a = 0; a < nf; a++) {
          const i2 = BUF_free[a];
          if (BUF_z[i2] < BUF_zc[i2]) {
            const t2 = BUF_zc[i2] / (BUF_zc[i2] - BUF_z[i2]);
            if (t2 < th) { th = t2; blk = a; }
          }
        }
        if (blk < 0 || th >= 1) { for (let a = 0; a < nf; a++) { const i2 = BUF_free[a]; BUF_zc[i2] = BUF_z[i2]; } break; }
        for (let a = 0; a < nf; a++) { const i2 = BUF_free[a]; BUF_zc[i2] += th * (BUF_z[i2] - BUF_zc[i2]); }
        BUF_zc[BUF_free[blk]] = 0;
        BUF_free[blk] = BUF_free[nf - 1]; nf--;
        if (nf === 0) break;
        if (!eqSolve(m, BUF_free, nf, BUF_z)) break; // bail: bound from current zc
        let ok = true;
        for (let a = 0; a < nf; a++) if (BUF_z[BUF_free[a]] < 0) ok = false;
        if (ok) { for (let a = 0; a < m; a++) BUF_zc[a] = 0; for (let a = 0; a < nf; a++) BUF_zc[BUF_free[a]] = BUF_z[BUF_free[a]]; break; }
      }
    } else {
      for (let a = 0; a < m; a++) BUF_zc[a] = BUF_z[a];
    }
    // clip and renormalize (guards blocking roundoff)
    let sum = 0;
    for (let a = 0; a < m; a++) { if (BUF_zc[a] < 0) BUF_zc[a] = 0; sum += BUF_zc[a]; }
    if (!(sum > 0)) continue; // degenerate bail: vertices cover
    for (let a = 0; a < m; a++) BUF_zc[a] /= sum;
    // Frank-Wolfe gap bound at the refined feasible point
    let q2 = 0, gDot = 0, gMin = Infinity;
    for (let a = 0; a < m; a++) {
      let row = 0;
      for (let b = 0; b < m; b++) row += BUF_Hss[a * m + b] * BUF_zc[b];
      q2 += BUF_zc[a] * row;
      const ga = 2 * row;
      BUF_g[a] = ga;
      gDot += ga * BUF_zc[a];
      if (ga < gMin) gMin = ga;
    }
    const gap = Math.max(0, gDot - gMin);
    const faceLower = q2 - gap - EPS_FACE;
    if (faceLower < best) {
      best = faceLower; bestIdx = idx; bestZ = Array.from(BUF_zc.subarray(0, m));
      if (best < failBelow) {
        if (zOut) { zOut.fill(0); for (let a = 0; a < m; a++) zOut[idx[a]] = bestZ[a]; }
        return { min: best, failed: true };
      }
    }
  }
  if (zOut && bestIdx) { zOut.fill(0); for (let a = 0; a < bestIdx.length; a++) zOut[bestIdx[a]] = bestZ[a]; }
  return { min: best, failed: false };
}

// ---------------------------------------------------------------------------
// LEMMA MC merge-consistent cell lower matrix (flat 8x8)
// cell = [m1, m2, u1lo, u1hi, s1lo, s1hi, u2lo, u2hi, s2lo, s2hi, u3lo, u3hi, s3lo, s3hi]
// ---------------------------------------------------------------------------
const B_TMP = [{}, {}, {}];
function mcH(cell, H) {
  const m1 = cell[0], m2 = cell[1];
  for (let k = 0; k < 3; k++) {
    const uLo = cell[2 + 4 * k], uHi = cell[3 + 4 * k];
    const sLo = cell[4 + 4 * k], sHi = cell[5 + 4 * k];
    const R = BOXES[k][1];
    const b = B_TMP[k];
    b.uLo = uLo; b.uHi = uHi; b.sLo = sLo;
    b.sHiEff = Math.min(sHi, R - uLo);
    b.vLo = uLo + sLo;
    b.vMax = Math.min(uHi + sHi, R);
  }
  H.fill(0);
  for (let i = 0; i < N; i++) H[i * N + i] = 1;
  const setC = (i, j, dLo) => { const v = -g(m1 * dLo) - NUDGE; H[i * N + j] = v; H[j * N + i] = v; };
  for (let k = 0; k < 3; k++) {
    const v = g(m2 * B_TMP[k].sHiEff) - NUDGE;
    H[(1 + 2 * k) * N + (2 + 2 * k)] = v; H[(2 + 2 * k) * N + (1 + 2 * k)] = v;
  }
  setC(0, 7, X4 - X0);
  for (let k = 0; k < 3; k++) {
    const b = B_TMP[k], iu = 1 + 2 * k, iv = 2 + 2 * k;
    setC(0, iu, b.uLo - X0);
    setC(0, iv, b.vLo - X0);
    setC(7, iv, X4 - b.vMax);
    setC(7, iu, Math.max(X4 - b.uHi, (X4 - b.vMax) + b.sLo));
  }
  for (let k = 0; k < 3; k++)
    for (let l = k + 1; l < 3; l++) {
      const bk = B_TMP[k], bl = B_TMP[l];
      const iuk = 1 + 2 * k, ivk = 2 + 2 * k, iul = 1 + 2 * l, ivl = 2 + 2 * l;
      const dNear = bl.uLo - bk.vMax;
      setC(ivk, iul, dNear);
      setC(ivk, ivl, dNear + bl.sLo);
      setC(iuk, iul, Math.max(dNear + bk.sLo, bl.uLo - bk.uHi));
      setC(iuk, ivl, Math.max(dNear + bk.sLo + bl.sLo, bl.uLo - bk.uHi + bl.sLo));
    }
  return H;
}

// ---------------------------------------------------------------------------
// soundness battery: random cells x random feasible configs never dip below
// the MC cell bound; zero-width cells reproduce the exact matrix
// ---------------------------------------------------------------------------
function battery() {
  let st = 951701;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstViol = -Infinity, worstZeroWidth = 0, nCells = 0;
  const Hb = new Float64Array(N * N), He = new Float64Array(N * N);
  for (let t = 0; t < 300; t++) {
    const m1 = MUF + rnd() * (RIGHT - MUF);
    const m2 = Math.min(RIGHT, m1 + rnd() * (RIGHT - m1));
    const cell = [m1, m2];
    for (let k = 0; k < 3; k++) {
      const [L, R] = BOXES[k], W = R - L;
      const a = L + rnd() * W, b = Math.min(R, a + rnd() * W);
      const sa = rnd() * W, sb = Math.min(W, sa + rnd() * W);
      cell.push(a, b, sa, sb);
    }
    let feas = true;
    for (let k = 0; k < 3; k++)
      if (cell[2 + 4 * k] + cell[4 + 4 * k] > BOXES[k][1]) feas = false;
    if (!feas) continue;
    nCells++;
    mcH(cell, Hb);
    const bound = simplexMin(Hb, -Infinity, null).min;
    for (let c = 0; c < 60; c++) {
      const mu = m1 + rnd() * (m2 - m1);
      const xs = [X0];
      let ok = true;
      for (let k = 0; k < 3; k++) {
        const uLo = cell[2 + 4 * k], uHi = cell[3 + 4 * k];
        const sLo = cell[4 + 4 * k], sHi = cell[5 + 4 * k];
        const R = BOXES[k][1];
        const u = uLo + rnd() * (uHi - uLo);
        const sCap = Math.min(sHi, R - u);
        if (sCap < sLo - 1e-15) { ok = false; break; }
        const s = sLo + rnd() * Math.max(0, sCap - sLo);
        xs.push(u, u + s);
      }
      if (!ok) continue;
      xs.push(X4);
      const ex = simplexMin(exactH(xs, mu), -Infinity, null).min;
      worstViol = Math.max(worstViol, bound - ex);
    }
    const mu0 = m1;
    const xs0 = [X0];
    const cell0 = [mu0, mu0];
    for (let k = 0; k < 3; k++) {
      const u = cell[2 + 4 * k];
      const s = Math.min(cell[4 + 4 * k], BOXES[k][1] - u);
      xs0.push(u, u + s);
      cell0.push(u, u, s, s);
    }
    xs0.push(X4);
    mcH(cell0, Hb);
    const Hex0 = exactH(xs0, mu0);
    for (let i = 0; i < N * N; i++)
      worstZeroWidth = Math.max(worstZeroWidth, Math.abs(Hb[i] - Hex0[i]));
  }
  return { nCells, worstViol, worstZeroWidth };
}

// ---------------------------------------------------------------------------
// pocket demonstration (imp-95169 FINDING CT cell, re-expressed in (u,s))
// ---------------------------------------------------------------------------
function pocket() {
  const u1a = 5.5127, u1b = 5.5127 + 6.1e-5;
  const v1a = 7.99707, v1b = 7.99707 + 1.22e-4;
  const cell = [MUF, MUF + 4.32e-6,
    u1a, u1b, v1a - u1b, v1b - u1a,
    16, 32, 0, 16,
    64, 128, 0, 64];
  const H = new Float64Array(N * N);
  mcH(cell, H);
  const r = simplexMin(H, -Infinity, null);
  return { mcBound: r.min };
}

// ---------------------------------------------------------------------------
// layered branch-and-bound
// ---------------------------------------------------------------------------
const DIM_W = [2.0, 0.085, 0.085, 0.085, 0.085, 0.085, 0.085];
const lastFailZ = new Float64Array(N);
let haveFailZ = false;

function coverLayer(m1, m2, budgetCells, deadline, label) {
  const root = new Float64Array([m1, m2, 4, 8, 0, 4, 16, 32, 0, 16, 64, 128, 0, 64]);
  const stack = [root];
  let cells = 0, leaves = 0, maxDepthSeen = 0, worstCert = Infinity, fastRejects = 0;
  const depths = [0];
  const H = new Float64Array(N * N), Hd = new Float64Array(N * N);
  const zf = new Float64Array(N);
  let lastLog = Date.now();
  while (stack.length) {
    if (cells >= budgetCells || Date.now() > deadline) {
      return { done: false, cells, leaves, maxDepthSeen, worstCert, fastRejects, unresolved: stack.length };
    }
    if (Date.now() - lastLog > 30000) {
      lastLog = Date.now();
      console.log(JSON.stringify({ progress: label, cells, leaves, stack: stack.length, maxDepthSeen }));
    }
    const cell = stack.pop();
    const depth = depths.pop();
    cells++;
    let infeas = false;
    for (let k = 0; k < 3; k++)
      if (cell[2 + 4 * k] + cell[4 + 4 * k] > BOXES[k][1] + 1e-15) infeas = true;
    if (infeas) { leaves++; continue; }
    mcH(cell, H);
    let failed = false;
    if (haveFailZ && quadZ(H, lastFailZ) < TAU) {
      zf.set(lastFailZ);
      failed = true;
      fastRejects++;
    } else {
      const r = simplexMin(H, TAU, zf);
      if (r.failed) {
        failed = true;
        lastFailZ.set(zf); haveFailZ = true;
      } else {
        leaves++; worstCert = Math.min(worstCert, r.min);
        maxDepthSeen = Math.max(maxDepthSeen, depth);
        continue;
      }
    }
    // split: gain-based -- for the failing z, evaluate the bound with each
    // dim collapsed to its midpoint; split the dim with the largest gain
    const q0 = quadZ(H, zf);
    let bd = -1, bg = 0;
    for (let d = 0; d < 7; d++) {
      const lo = d === 0 ? 0 : 2 * d, hi = lo + 1;
      if (cell[hi] - cell[lo] < 1e-13) continue;
      const a = cell[lo], b = cell[hi], mid = 0.5 * (a + b);
      cell[lo] = mid; cell[hi] = mid;
      mcH(cell, Hd);
      const gain = quadZ(Hd, zf) - q0;
      cell[lo] = a; cell[hi] = b;
      if (gain > bg) { bg = gain; bd = d; }
    }
    if (bd < 0) {
      // fallback: widest weighted dim
      let bw = -Infinity;
      for (let d = 0; d < 7; d++) {
        const lo = d === 0 ? 0 : 2 * d, hi = lo + 1;
        const w = (cell[hi] - cell[lo]) * DIM_W[d];
        if (w > bw && cell[hi] - cell[lo] > 1e-13) { bw = w; bd = d; }
      }
      if (bd < 0) {
        return { done: false, cells, leaves, maxDepthSeen, worstCert, fastRejects, unresolved: stack.length + 1, stuck: Array.from(cell) };
      }
    }
    const lo = bd === 0 ? 0 : 2 * bd, hi = lo + 1;
    const mid = 0.5 * (cell[lo] + cell[hi]);
    const c1 = cell.slice(), c2 = cell.slice();
    c1[hi] = mid; c2[lo] = mid;
    stack.push(c1, c2);
    depths.push(depth + 1, depth + 1);
  }
  return { done: true, cells, leaves, maxDepthSeen, worstCert, fastRejects, unresolved: 0 };
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
const t0 = Date.now();
console.log("== battery ==");
const bat = battery();
console.log(JSON.stringify(bat));
if (bat.worstViol > 1e-12) throw new Error(`SOUNDNESS VIOLATION: ${bat.worstViol}`);
if (bat.worstZeroWidth > 1e-11) throw new Error(`ZERO-WIDTH MISMATCH: ${bat.worstZeroWidth}`);

console.log("== pocket demonstration ==");
console.log(JSON.stringify(pocket()));

console.log("== corner cross-check vs imp-95169 literal ==");
// binding corner (2,4,8,16,16,64,64,256) at the SD floor: recorded exact
// copositive min literal 2.277710241741729e-7 (imp-95169 FINDING CG)
{
  const Hc = exactH([2, 4, 8, 16, 16, 64, 64, 256], MUF);
  const mc = simplexMin(Hc, -Infinity, null).min;
  console.log(JSON.stringify({ cornerMinAtFloor: mc, recorded: 2.277710241741729e-7, diff: mc - 2.277710241741729e-7 }));
  if (Math.abs(mc - 2.277710241741729e-7) > 1e-11) throw new Error(`CORNER LITERAL MISMATCH: ${mc}`);
}

console.log("== layered cover ==");
const WALL_MS = Number(process.env.WALL_MS || 480000);
const deadline = t0 + WALL_MS;
const bounds = [RIGHT];
let b = RIGHT;
while (b > MUF) {
  b = Math.max(MUF, CROSS + (b - CROSS) / 2);
  bounds.push(b);
}
const layers = [];
let reached = RIGHT;
for (let i = 0; i + 1 < bounds.length; i++) {
  const hi = bounds[i], lo = bounds[i + 1];
  const res = coverLayer(lo, hi, 100e6, deadline, `L${i}`);
  layers.push({ lo, hi, ...res });
  console.log(JSON.stringify({ layer: i, lo, hi, ...res, elapsedS: (Date.now() - t0) / 1000 }));
  if (!res.done) break;
  reached = lo;
}
console.log("== summary ==");
console.log(JSON.stringify({
  reachedFloor: reached, targetFloor: MUF, fullBand: reached <= MUF,
  totalCells: layers.reduce((s, l) => s + l.cells, 0),
  totalLeaves: layers.reduce((s, l) => s + l.leaves, 0),
  maxDepth: Math.max(...layers.map((l) => l.maxDepthSeen)),
  worstCert: Math.min(...layers.map((l) => l.worstCert)),
  wallS: (Date.now() - t0) / 1000,
}));
