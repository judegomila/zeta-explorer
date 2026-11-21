/**
 * imp-95170 - RIGOROUS step -- MERGE-CONSISTENT COPOSITIVE COVER: TWO-POINT
 * CLASS CLOSED ON THE COVERED BAND (LEMMA MC merge-consistent block
 * enclosure + LEMMA FB certified convex-face bound + THEOREM MC 55,398-cell
 * terminating cover at floor 0.2320727, re-run in-sweep on every build).
 *
 * CONTEXT. imp-95169 proved (LEMMA WD) that the >= 2-doubled two-point
 * burden on the covered band [0.2320727, 0.23209) is EXACTLY a positional
 * copositivity question -- sup over ALL nonnegative block mass profiles of
 * the exact hollow block-bond lambda_max is < 1 iff H = 2 blockdiag(G_b)
 * - G_full is strictly copositive, with the quantitative transfer
 * lambda_max <= 1 - simplexMin(H) -- and relocated the successor wall to
 * the NEAR-MERGE POSITIONAL INCONSISTENCY of the entrywise cell enclosure:
 * a cell wide in a doubled block prices that block Gram at maximal width
 * while its cross entries sit at minimal distances, faking an extra
 * independent packet (the certified cover did not terminate at 2.86M
 * cells). THIS STEP builds the merge-consistent enclosure imp-95169 named
 * as the successor, and the cover TERMINATES: 55,398 cells, zero
 * unresolved, in about one second.
 *
 * LEMMA MC (merge-consistent block enclosure; rigorous). Parametrize each
 * doubled middle block b (box [L_b, R_b]) by its LEFT packet u_b and
 * separation s_b >= 0, right packet v_b = u_b + s_b <= R_b (any two-point
 * configuration relabels to u <= v; a coincident pair s = 0 is EXACTLY a
 * single packet of summed mass in the quadratic form, so single-packet and
 * empty middle blocks are boundary cases of the same cover -- empty blocks
 * because the certificate holds on the WHOLE simplex, so every
 * sub-support inherits it). In a cell (rate and (u_b, s_b) intervals per
 * block) every entry of H is bounded below CONSISTENTLY in the same
 * s-ranges:
 *   within block b:            g(mu s)          >= g(m2 sHiEff),
 *   u_b to a left external:    d = u - x_e      >= uLo - x_e,
 *   v_b to a left external:    d = u + s - x_e  >= uLo + sLo - x_e,
 *   v_b to a right external:   d = x_e - v      >= x_e - vMax,
 *   u_b to a right external:   d = (x_e - v)+s  >= max(x_e - uHi, (x_e - vMax) + sLo),
 * and between two doubled blocks k < l with dNear = uLo_l - vMax_k the
 * four pair entries add sLo_k, sLo_l, or both. Each bound holds for EVERY
 * feasible configuration in the cell, so H_MC <= H(config) entrywise and,
 * for z >= 0, cell copositive min >= simplexMin(H_MC); at zero cell width
 * H_MC is the exact H (battery: worst deviation = the 1e-12 safety nudge).
 * This is exactly the coupling the imp-95169 entrywise enclosure lacked:
 * the within entry g(mu s) and the far-packet cross damping g(mu (d + s))
 * now tighten TOGETHER when the s-interval splits. (Honesty: at FULL-width
 * s-cells with sLo = 0 the enclosure coincides with the old one -- the
 * recorded imp-95169 pocket cell still bounds at -1.098e-3, re-verified
 * in-module; the gain is that s-splits are now effective, which is what
 * turns the unterminating 2.86M-cell cover into a terminating 55k one.)
 *
 * LEMMA FB (certified convex-face bound; rigorous). The simplex minimum of
 * z^T H z equals the minimum over supports S of the minimum over the
 * closed face F_S. Per face: (i) if the reduced Hessian Hr(S) fails the
 * positive-pivot float Cholesky, the face is skippable -- true Hr
 * indefinite puts the face minimum strictly on a smaller support; true Hr
 * PSD with lambda_min = eps admits an interior dip below the boundary
 * value only if the gradient component along the near-null direction is
 * <= eps (else the dip point leaves the simplex), so the dip is <= eps
 * <= 1e-15, absorbed by the 1e-12 face slack; (ii) if Cholesky succeeds,
 * the form is convex on the face (up to the same absorbed 1e-15), and for
 * ANY feasible z on the face with gamma = 2 Hss z the Frank-Wolfe gap
 * bound q(y) >= q(z) - (gamma.z - min_a gamma_a) - 1e-12 holds for every y
 * in F_S; z is produced by an NNLS-style active-set walk, so at the
 * constrained face optimum the gap is ~0, and an ill-conditioned or bailed
 * refinement only LOOSENS the bound (splits the cell) -- it can never
 * overcertify. A feasible point with value < TAU is an exact fail (values
 * upper-bound the min). This replaces the imp-95169 refused-pivot
 * heuristic with a bound that is certified at every leaf; it reproduces
 * the recorded exact corner literal 2.277710241741729e-7 at the SD floor
 * to 1e-12 (the face slack), asserted in-module.
 *
 * THEOREM MC (certified cover; RE-RUN IN-SWEEP on every build). Blocks 0
 * and 4 carry ARBITRARY nonnegative profiles: the recorded THEOREM SA
 * (imp-95168) collapses each onto a single packet at its inner occupied
 * endpoint, and moving that packet to the box inner endpoint (2 resp. 256)
 * raises every off-diagonal bond entry (g decreasing, all other blocks on
 * one side), so Perron monotonicity pins x0 = 2, x4 = 256 (battery (D)).
 * Blocks 1..3 carry AT MOST TWO packets each, ANY doubling pattern -- the
 * full two-point class, strictly containing the imp-95168 single-doubled
 * class. The deterministic 7-D branch-and-bound (rate, u1, s1, u2, s2, u3,
 * s3; six geometric mu-layers from 0.23209 down to the floor 0.2320727;
 * per-cell test simplexMin(H_MC) >= TAU = 2e-8; split dim chosen by the
 * bound gain of the failing witness) TERMINATES with ZERO unresolved
 * cells: 55,398 cells, 27,702 leaves, max depth 61, worst certified leaf
 * minimum 2.118e-8 >= TAU, in ~1.1 s. Hence by LEMMA WD (imp-95169
 * transfer) every witness of the class has exact hollow lambda_max
 * <= 1 - 2e-8 < 1 at every common rate in [0.2320727, 0.23209), and E <= 0
 * there by the carried recorded links exactly as imp-95168 COROLLARY SF
 * composes them (aggregation algebra; THEOREM TX blocks >= 5; LEMMA OP +
 * THEOREM RW odd parity; LEMMA GA + RW block-0-empty; empty middle blocks
 * are direct sub-support cases here, no interlacing needed).
 *
 * CONSEQUENCE (burden contraction, no constant moves). On the covered band
 * [0.2320727, 0.23209) the witness burden of the parity-pure common-rate
 * MAJ class contracts from "at least TWO doubled blocks among 1..3 or at
 * least THREE packets in some middle block" (imp-95168/95169 record) to
 * exactly: AT LEAST THREE PACKETS IN SOME BLOCK OF 1..3. The >= 2-doubled
 * two-point burden is CLOSED; the imp-95169 relocated wall (near-merge
 * positional inconsistency) is DISSOLVED by LEMMA MC. LEMMA WD being
 * occupancy-blind, the >= 3-packet burden inherits the same copositive
 * formulation; its cover needs the (u, s, s2)-triple extension of LEMMA MC
 * -- the successor.
 *
 * SKEPTICAL RECORD. (1) Soundness battery (A): random cells x random
 * feasible configurations -- the exact copositive min never dips below the
 * MC cell bound; zero-width cells reproduce the exact H to the nudge. (2)
 * Battery (B): random multi-doubled witnesses at band rates -- exact
 * hollow lambda_max <= 1 - exact simplex min on every draw (LEMMA WD
 * transfer direction re-verified) and the exact min never below TAU. (3)
 * Battery (D): random multi-packet blocks 0/4 -- pinning (2, 256) never
 * decreases lambda_max. (4) The certified margin TAU = 2e-8 sits 4 orders
 * above the 1e-12 face slack + 1e-12 entry nudge and ~7 above float
 * roundoff -- one order tighter than the recorded 2e-7/1e-12 ratio of
 * imp-95167, stated explicitly. (5) The cover literals (cells, depth,
 * worst leaf) are ASSERTED with coarse tolerances because Math.exp is
 * engine-dependent at 1 ulp; the THEOREM itself (termination, zero
 * unresolved, worst >= TAU) is re-established by the in-sweep run, not
 * carried as a baked literal. (6) The statement is architecture-composed:
 * as strong as the recorded links it cites (SA, WD, aggregation, parity).
 * (7) Below the floor nothing changes: the certified crossing bracket
 * (0.232072389, 0.2320727) and the refuted sub-strip [0.2320723,
 * 0.232072389] stand as recorded.
 *
 * HONEST SCOPE. NO recorded class constant moves: class sandwich
 * [0.2320723, 0.24502], unconditional window [0.23209, 0.24502], open
 * strip endpoints, covered-band floor 0.2320727, k <= 4 ladder floor
 * 47/200 all carried UNCHANGED -- this step contracts the covered-band
 * burden, it closes no sub-band of the open strip. Changes no Lambda
 * bound; NO QED; no refereed bound is changed.
 *
 * Import-light; zero imports; deterministic; in-sweep ~2.5 s (the full
 * 55k-cell certified cover plus four batteries).
 */
const g = (z) => Math.exp(-z) * (1 + z);

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95170-merge-consistent-copositive-cover assertion failed: ${id}`);
}
const MEASURED = {};

const MUF = 0.2320727; // recorded covered-band floor
const RIGHT = 0.23209; // recorded unconditional-window floor
const CROSS = 0.23207238984117226; // imp-95169 copositive crossing literal
const TAU = 2e-8; // certificate threshold
const NUDGE = 1e-12;
const EPS_FACE = 1e-12;
const BOXES = [[4, 8], [16, 32], [64, 128]];
const X0 = 2, X4 = 256;
const N = 8;
const BLKOF = [0, 1, 1, 2, 2, 3, 3, 4];

// ---------------------------------------------------------------------------
// exact packet-level H = 2D - G at a configuration (flat 8x8)
// ---------------------------------------------------------------------------
function exactH(xs, mu) {
  const H = new Float64Array(N * N);
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      const gij = g(mu * Math.abs(xs[i] - xs[j]));
      H[i * N + j] = BLKOF[i] === BLKOF[j] ? gij : -gij;
    }
  return H;
}

// ---------------------------------------------------------------------------
// LEMMA FB certified simplex lower bound (convex-face enumeration with
// NNLS-refined Frank-Wolfe gap bounds; see header)
// ---------------------------------------------------------------------------
const SUPPORTS = [];
for (let S = 1; S < (1 << N); S++) {
  const idx = [];
  for (let i = 0; i < N; i++) if (S & (1 << i)) idx.push(i);
  if (idx.length >= 2) SUPPORTS.push(idx);
}
const BUF_Hss = new Float64Array(64), BUF_Hr = new Float64Array(49),
  BUF_L = new Float64Array(49), BUF_rhs = new Float64Array(7),
  BUF_y = new Float64Array(7), BUF_t = new Float64Array(7), BUF_z = new Float64Array(8),
  BUF_zc = new Float64Array(8);
const BUF_free = new Int32Array(8);

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
    for (let a = 0; a < m; a++) BUF_free[a] = a;
    if (!eqSolve(m, BUF_free, m, BUF_z)) continue; // rigorously skippable face
    let nf = m;
    let feasible = true;
    for (let a = 0; a < m; a++) if (BUF_z[a] < 0) feasible = false;
    if (!feasible) {
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
        if (!eqSolve(m, BUF_free, nf, BUF_z)) break; // bail: bound from current point
        let ok = true;
        for (let a = 0; a < nf; a++) if (BUF_z[BUF_free[a]] < 0) ok = false;
        if (ok) {
          for (let a = 0; a < m; a++) BUF_zc[a] = 0;
          for (let a = 0; a < nf; a++) BUF_zc[BUF_free[a]] = BUF_z[BUF_free[a]];
          break;
        }
      }
    } else {
      for (let a = 0; a < m; a++) BUF_zc[a] = BUF_z[a];
    }
    let sum = 0;
    for (let a = 0; a < m; a++) { if (BUF_zc[a] < 0) BUF_zc[a] = 0; sum += BUF_zc[a]; }
    if (!(sum > 0)) continue;
    for (let a = 0; a < m; a++) BUF_zc[a] /= sum;
    let q2 = 0, gDot = 0, gMin = Infinity;
    for (let a = 0; a < m; a++) {
      let row = 0;
      for (let b = 0; b < m; b++) row += BUF_Hss[a * m + b] * BUF_zc[b];
      q2 += BUF_zc[a] * row;
      const ga = 2 * row;
      gDot += ga * BUF_zc[a];
      if (ga < gMin) gMin = ga;
    }
    const faceLower = q2 - Math.max(0, gDot - gMin) - EPS_FACE;
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
// LEMMA MC merge-consistent cell lower matrix
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
// exact hollow normalized block bond matrix + Jacobi lambda_max (batteries)
// ---------------------------------------------------------------------------
function lamMaxSym(Min) {
  const n = Min.length;
  const A = Min.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-22) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const tt = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(tt * tt + 1), s = tt * c;
        for (let k = 0; k < n; k++) {
          const kp = A[k][p], kq = A[k][q];
          A[k][p] = c * kp - s * kq; A[k][q] = s * kp + c * kq;
        }
        for (let k = 0; k < n; k++) {
          const pk = A[p][k], qk = A[q][k];
          A[p][k] = c * pk - s * qk; A[q][k] = s * pk + c * qk;
        }
      }
  }
  let lam = -Infinity;
  for (let i = 0; i < n; i++) lam = Math.max(lam, A[i][i]);
  return lam;
}
function exactHollow(pts, mu) {
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const norms = pts.map((P) => {
    let s = 0;
    for (const a of P) for (const c of P) s += a.w * c.w * g(mu * Math.abs(a.x - c.x));
    return Math.sqrt(s);
  });
  for (let i = 0; i < 5; i++)
    for (let j = i + 1; j < 5; j++) {
      let s = 0;
      for (const a of pts[i]) for (const c of pts[j]) s += a.w * c.w * g(mu * Math.abs(c.x - a.x));
      M[i][j] = M[j][i] = s / (norms[i] * norms[j]);
    }
  return M;
}

// ---------------------------------------------------------------------------
// (A) LEMMA MC soundness battery: random cells x random feasible configs
// never dip below the MC cell bound; zero-width cells exact to the nudge
// ---------------------------------------------------------------------------
{
  let st = 951701;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstViol = -Infinity, worstZeroWidth = 0, nCells = 0;
  const Hb = new Float64Array(N * N);
  for (let t = 0; t < 400 && nCells < 60; t++) {
    const m1 = MUF + rnd() * (RIGHT - MUF);
    const m2 = Math.min(RIGHT, m1 + rnd() * (RIGHT - m1));
    const cell = [m1, m2];
    for (let k = 0; k < 3; k++) {
      const [L, R] = BOXES[k], W = R - L;
      const a = L + rnd() * W, b = Math.min(R, a + rnd() * W);
      const sa = rnd() * Math.max(0, R - a), sb = Math.min(W, sa + rnd() * W);
      cell.push(a, b, sa, sb);
    }
    nCells++;
    mcH(cell, Hb);
    const bound = simplexMin(Hb, -Infinity, null).min;
    for (let c = 0; c < 40; c++) {
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
    const xs0 = [X0];
    const cell0 = [m1, m1];
    for (let k = 0; k < 3; k++) {
      const u = cell[2 + 4 * k];
      const s = Math.min(cell[4 + 4 * k], BOXES[k][1] - u);
      xs0.push(u, u + s);
      cell0.push(u, u, s, s);
    }
    xs0.push(X4);
    mcH(cell0, Hb);
    const Hex0 = exactH(xs0, m1);
    for (let i = 0; i < N * N; i++)
      worstZeroWidth = Math.max(worstZeroWidth, Math.abs(Hb[i] - Hex0[i]));
  }
  MEASURED.mc = { nCells, worstViol, worstZeroWidth };
  assertI(nCells >= 40, `imp95170-mc-ncells(${nCells})`);
  assertI(worstViol <= 1e-12, `imp95170-mc-soundness(${worstViol})`);
  assertI(worstZeroWidth <= 1e-11, `imp95170-mc-zerowidth(${worstZeroWidth})`);
}

// ---------------------------------------------------------------------------
// (B) LEMMA WD transfer + coincident-pair battery on multi-doubled draws:
// exact hollow lambda_max <= 1 - exact simplex min at band rates, the exact
// min never below TAU, and a coincident pair equals a single summed packet
// ---------------------------------------------------------------------------
{
  let st = 951702;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstTransfer = -Infinity, minExact = Infinity, worstMerge = 0;
  for (let t = 0; t < 80; t++) {
    const mu = MUF + rnd() * (RIGHT - MUF);
    const xs = [X0];
    for (let k = 0; k < 3; k++) {
      const [L, R] = BOXES[k];
      const u = L + rnd() * (R - L);
      // include near-merged pairs at s = 1e-3 (exact-coincident s = 0 makes
      // the face solves singular so the certified LOWER bound goes loose --
      // sound but not a tight value; the s = 0 case is covered exactly by
      // the merge identity below)
      const s = rnd() < 0.2 ? Math.min(1e-3, R - u) : rnd() * (R - u);
      xs.push(u, u + s);
    }
    xs.push(X4);
    const m = simplexMin(exactH(xs, mu), -Infinity, null).min;
    minExact = Math.min(minExact, m);
    for (let s2 = 0; s2 < 6; s2++) {
      const pts = [
        [{ x: xs[0], w: 1 }],
        [{ x: xs[1], w: 0.05 + rnd() }, { x: xs[2], w: 0.05 + rnd() }],
        [{ x: xs[3], w: 0.05 + rnd() }, { x: xs[4], w: 0.05 + rnd() }],
        [{ x: xs[5], w: 0.05 + rnd() }, { x: xs[6], w: 0.05 + rnd() }],
        [{ x: xs[7], w: 1 }],
      ];
      const lam = lamMaxSym(exactHollow(pts, mu));
      worstTransfer = Math.max(worstTransfer, lam - (1 - m));
    }
    // coincident pair in block 1 == single packet of summed mass
    const p = 0.05 + rnd(), q = 0.05 + rnd();
    const ptsA = [
      [{ x: X0, w: 1 }],
      [{ x: xs[1], w: p }, { x: xs[1], w: q }],
      [{ x: xs[3], w: 1 }], [{ x: xs[5], w: 1 }], [{ x: X4, w: 1 }],
    ];
    const ptsB = [
      [{ x: X0, w: 1 }],
      [{ x: xs[1], w: p + q }],
      [{ x: xs[3], w: 1 }], [{ x: xs[5], w: 1 }], [{ x: X4, w: 1 }],
    ];
    const MA = exactHollow(ptsA, mu), MB = exactHollow(ptsB, mu);
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 5; j++) worstMerge = Math.max(worstMerge, Math.abs(MA[i][j] - MB[i][j]));
  }
  MEASURED.wd = { worstTransfer, minExact, worstMerge };
  assertI(worstTransfer <= 1e-10, `imp95170-wd-transfer(${worstTransfer})`);
  assertI(minExact >= TAU, `imp95170-wd-minexact(${minExact})`);
  assertI(worstMerge <= 1e-12, `imp95170-wd-merge(${worstMerge})`);
}

// ---------------------------------------------------------------------------
// (C) LEMMA FB corner cross-check: the certified bound reproduces the
// recorded imp-95169 exact corner minimum at the SD floor to the face slack
// ---------------------------------------------------------------------------
{
  const mc = simplexMin(exactH([2, 4, 8, 16, 16, 64, 64, 256], MUF), -Infinity, null).min;
  MEASURED.corner = { certified: mc, recorded: 2.277710241741729e-7 };
  assertI(Math.abs(mc - 2.277710241741729e-7) < 1e-11, `imp95170-fb-corner(${mc})`);
  // and dense random simplex sampling never undercuts the certified bound
  let st = 951703;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  const Hc = exactH([2, 4, 8, 16, 16, 64, 64, 256], MUF);
  let sampMin = Infinity;
  for (let s2 = 0; s2 < 4000; s2++) {
    const zr = new Float64Array(N);
    let sum = 0;
    for (let a = 0; a < N; a++) { zr[a] = -Math.log(1 - rnd()); sum += zr[a]; }
    for (let a = 0; a < N; a++) zr[a] /= sum;
    sampMin = Math.min(sampMin, quadZ(Hc, zr));
  }
  MEASURED.corner.sampMin = sampMin;
  assertI(sampMin >= mc, `imp95170-fb-sampling(${sampMin})`);
}

// ---------------------------------------------------------------------------
// (D) THEOREM SA + endpoint-push battery: arbitrary multi-packet blocks 0/4
// are dominated by the pinned (2, 256) single packets for the same middles
// ---------------------------------------------------------------------------
{
  let st = 951704;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstPin = -Infinity;
  for (let t = 0; t < 100; t++) {
    const mu = MUF + rnd() * (RIGHT - MUF);
    const k0 = 1 + Math.floor(rnd() * 4), k4 = 1 + Math.floor(rnd() * 4);
    const b0 = Array.from({ length: k0 }, () => ({ x: 1 + rnd(), w: 0.05 + rnd() }));
    const b4 = Array.from({ length: k4 }, () => ({ x: 256 + rnd() * 256, w: 0.05 + rnd() }));
    const mids = [0, 1, 2].map((k) => {
      const [L, R] = BOXES[k];
      const u = L + rnd() * (R - L), s = rnd() * (R - u);
      return [{ x: u, w: 0.05 + rnd() }, { x: u + s, w: 0.05 + rnd() }];
    });
    const M = exactHollow([b0, ...mids, b4], mu);
    const MP = exactHollow([[{ x: X0, w: 1 }], ...mids, [{ x: X4, w: 1 }]], mu);
    worstPin = Math.max(worstPin, lamMaxSym(M) - lamMaxSym(MP));
  }
  MEASURED.sa = { worstPin };
  assertI(worstPin <= 1e-12, `imp95170-sa-pin(${worstPin})`);
}

// ---------------------------------------------------------------------------
// (E) pocket honesty: at the recorded imp-95169 FINDING CT pocket cell
// (full-width s-ranges in blocks 2/3) the MC bound coincides with the old
// entrywise bound -- the gain of LEMMA MC is split-effectiveness, not the
// full-width per-cell number
// ---------------------------------------------------------------------------
{
  const u1a = 5.5127, u1b = 5.5127 + 6.1e-5;
  const v1a = 7.99707, v1b = 7.99707 + 1.22e-4;
  const cell = [MUF, MUF + 4.32e-6,
    u1a, u1b, v1a - u1b, v1b - u1a,
    16, 32, 0, 16,
    64, 128, 0, 64];
  const Hb = new Float64Array(N * N);
  mcH(cell, Hb);
  const r = simplexMin(Hb, -Infinity, null);
  MEASURED.pocket = { mcBound: r.min, oldEntrywiseBound: -0.001097825340166787 };
  assertI(r.min < 0, `imp95170-pocket-still-negative(${r.min})`);
  assertI(Math.abs(r.min - (-0.001097825340166787)) < 1e-5, `imp95170-pocket-coincide(${r.min})`);
}

// ---------------------------------------------------------------------------
// (F) THEOREM MC: the certified cover, RE-RUN in-sweep
// ---------------------------------------------------------------------------
const lastFailZ = new Float64Array(N);
let haveFailZ = false;
function coverLayer(m1, m2) {
  const root = new Float64Array([m1, m2, 4, 8, 0, 4, 16, 32, 0, 16, 64, 128, 0, 64]);
  const stack = [root];
  const depths = [0];
  let cells = 0, leaves = 0, maxDepthSeen = 0, worstCert = Infinity;
  const H = new Float64Array(N * N), Hd = new Float64Array(N * N);
  const zf = new Float64Array(N);
  const CELL_CAP = 400000; // ~7x the observed full-cover size: hard stop
  while (stack.length) {
    if (cells >= CELL_CAP) return { done: false, cells, leaves, maxDepthSeen, worstCert };
    const cell = stack.pop();
    const depth = depths.pop();
    cells++;
    let infeas = false;
    for (let k = 0; k < 3; k++)
      if (cell[2 + 4 * k] + cell[4 + 4 * k] > BOXES[k][1] + 1e-15) infeas = true;
    if (infeas) { leaves++; continue; }
    mcH(cell, H);
    if (haveFailZ && quadZ(H, lastFailZ) < TAU) {
      zf.set(lastFailZ);
    } else {
      const r = simplexMin(H, TAU, zf);
      if (!r.failed) {
        leaves++; worstCert = Math.min(worstCert, r.min);
        maxDepthSeen = Math.max(maxDepthSeen, depth);
        continue;
      }
      lastFailZ.set(zf); haveFailZ = true;
    }
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
      let bw = -Infinity;
      for (let d = 0; d < 7; d++) {
        const lo = d === 0 ? 0 : 2 * d, hi = lo + 1;
        const w = cell[hi] - cell[lo];
        if (w > bw && w > 1e-13) { bw = w; bd = d; }
      }
      if (bd < 0) return { done: false, cells, leaves, maxDepthSeen, worstCert };
    }
    const lo = bd === 0 ? 0 : 2 * bd, hi = lo + 1;
    const mid = 0.5 * (cell[lo] + cell[hi]);
    const c1 = cell.slice(), c2 = cell.slice();
    c1[hi] = mid; c2[lo] = mid;
    stack.push(c1, c2);
    depths.push(depth + 1, depth + 1);
  }
  return { done: true, cells, leaves, maxDepthSeen, worstCert };
}
{
  const bounds = [RIGHT];
  let b = RIGHT;
  while (b > MUF) {
    b = Math.max(MUF, CROSS + (b - CROSS) / 2);
    bounds.push(b);
  }
  let allDone = true, totalCells = 0, totalLeaves = 0, maxDepth = 0, worstCert = Infinity;
  const layers = [];
  for (let i = 0; i + 1 < bounds.length; i++) {
    const res = coverLayer(bounds[i + 1], bounds[i]);
    layers.push({ lo: bounds[i + 1], hi: bounds[i], cells: res.cells, worst: res.worstCert });
    allDone = allDone && res.done;
    totalCells += res.cells; totalLeaves += res.leaves;
    maxDepth = Math.max(maxDepth, res.maxDepthSeen);
    worstCert = Math.min(worstCert, res.worstCert);
    if (!res.done) break;
  }
  MEASURED.cover = { allDone, nLayers: layers.length, totalCells, totalLeaves, maxDepth, worstCert, layers };
  // the THEOREM: termination with zero unresolved cells and certified margin
  assertI(allDone, "imp95170-theorem-mc-terminates");
  assertI(layers.length === bounds.length - 1, `imp95170-theorem-mc-layers(${layers.length})`);
  assertI(worstCert >= TAU, `imp95170-theorem-mc-margin(${worstCert})`);
  // recorded run literals, coarse tolerances (Math.exp is engine-dependent
  // at 1 ulp; the theorem is the re-run above, not these literals)
  assertI(Math.abs(totalCells - 55398) <= 6000, `imp95170-cover-cells(${totalCells})`);
  assertI(Math.abs(maxDepth - 61) <= 8, `imp95170-cover-depth(${maxDepth})`);
  assertI(Math.abs(worstCert - 2.118052171662755e-8) < 1e-9, `imp95170-cover-worst(${worstCert})`);
}

// ---------------------------------------------------------------------------
// verdict object
// ---------------------------------------------------------------------------
export const IMP95170_MERGE_CONSISTENT_COPOSITIVE_COVER = {
  id: "imp-95170",
  title:
    "Merge-consistent copositive cover: LEMMA MC ((u, s) block parametrization couples the within-block Gram entry g(mu s) and the far-packet cross damping g(mu (d + s)) in one consistent cell enclosure, dissolving the imp-95169 near-merge positional inconsistency wall) + LEMMA FB (certified convex-face simplex lower bound: NNLS-refined Frank-Wolfe gap on Cholesky-passing faces, rigorous skip otherwise; reproduces the recorded corner literal to 1e-12) + THEOREM MC (the 7-D branch-and-bound over the FULL two-point class -- arbitrary block-0/4 occupancy via THEOREM SA + endpoint monotonicity, at most two packets in each of blocks 1..3, any doubling pattern -- TERMINATES: 55,398 cells, zero unresolved, worst certified min 2.118e-8 >= 2e-8, re-run in-sweep every build): every such witness has exact hollow lambda_max <= 1 - 2e-8 at every rate in [0.2320727, 0.23209), hence E <= 0 there by the carried links; the covered-band burden contracts to witnesses with >= 3 packets in some block of 1..3",
  rigorous: {
    lemmaMC:
      "per doubled middle block, positions (u, v) relabel to (u, s = v - u >= 0); in a cell the five bound types (within g(m2 sHiEff); near-side cross at direct minimal distance; far-side cross at minimal distance PLUS sLo, on both the outer-packet and block-to-block entries) are each valid for every feasible configuration, so H_MC <= H entrywise and cell copositive min >= simplexMin(H_MC); exact at zero width; coincident pairs (s = 0) are exactly single packets of summed mass and empty blocks are sub-support cases of the whole-simplex certificate",
    lemmaFB:
      "true simplex min = min over closed faces; faces failing positive-pivot Cholesky are rigorously skippable (indefinite: boundary attainment on a smaller support; near-singular PSD: interior dip <= lambda_min <= 1e-15, absorbed); faces passing are convex, so the Frank-Wolfe gap bound q(y) >= q(z) - (gamma.z - min gamma) - 1e-12 from the NNLS-refined feasible z certifies; ill-conditioning only loosens (splits), never overcertifies; feasible values below TAU are exact fails",
    theoremMC:
      "six geometric mu-layers tile [0.2320727, 0.23209]; the branch-and-bound with gain-based split selection terminates with zero unresolved cells and every leaf certified at simplexMin(H_MC) >= 2e-8; via the imp-95169 LEMMA WD transfer and the imp-95168 THEOREM SA collapse plus one-sided endpoint monotonicity (x0 = 2, x4 = 256 dominate entrywise, Perron transfers), every parity-pure common-rate MAJ witness with arbitrary nonnegative profiles in blocks 0/4 and at most two packets in each of blocks 1..3 has exact hollow lambda_max <= 1 - 2e-8 at every common rate in the band; E <= 0 follows by the carried recorded links exactly as imp-95168 COROLLARY SF composes them",
  },
  consequence:
    "the imp-95168/95169 covered-band burden 'at least TWO doubled blocks among 1..3 or at least THREE packets in some middle block' contracts to 'at least THREE packets in some block of 1..3': the >= 2-doubled two-point burden is CLOSED on [0.2320727, 0.23209), subsuming the imp-95168 single-doubled THEOREM SD; the imp-95169 relocated wall (near-merge positional inconsistency, 2.86M-cell non-termination) is DISSOLVED (55,398 cells, ~1 s)",
  successorFrontier:
    "(i) the >= 3-packet middle-block burden inherits the copositive formulation verbatim (LEMMA WD is occupancy-blind); its cover needs the (u, s, s2) triple extension of LEMMA MC per block (10-D); (ii) extending the class floor below 0.2320727 into the certified crossing bracket (0.232072389, 0.2320727) faces margins vanishing linearly at the copositive crossing; (iii) the refuted sub-strip [0.2320723, 0.232072389] still needs a different E-reduction, as recorded",
  carried: {
    classSandwich: [0.2320723, 0.24502],
    unconditionalWindow: [0.23209, 0.24502],
    openStrip: [0.2320723, 0.23209],
    coveredBandFloor: 0.2320727,
    ladderFloorKle4: 47 / 200,
    copositiveCrossing: 0.23207238984117226,
  },
  promotesBound: false,
  noQED: true,
  sota: "No refereed bound is changed",
};

// ---------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// ---------------------------------------------------------------------------
export const IMP95170_MERGE_CONSISTENT_COPOSITIVE_COVER_ASSERTIONS = [
  {
    id: "imp95170-lemma-mc-soundness",
    description:
      "LEMMA MC battery: over random cells x random feasible configurations at band rates, the exact copositive min never dips below the merge-consistent cell bound (worst violation <= 1e-12), and zero-width cells reproduce the exact H to the 1e-12 nudge",
    holds: () => MEASURED.mc.nCells >= 40 && MEASURED.mc.worstViol <= 1e-12 && MEASURED.mc.worstZeroWidth <= 1e-11,
  },
  {
    id: "imp95170-lemma-fb-corner",
    description:
      "LEMMA FB: the certified convex-face simplex bound reproduces the recorded imp-95169 exact corner minimum 2.277710241741729e-7 at the SD floor to 1e-11 (the 1e-12 face slack), and 4000-draw dense random simplex sampling never undercuts it",
    holds: () =>
      Math.abs(MEASURED.corner.certified - 2.277710241741729e-7) < 1e-11 &&
      MEASURED.corner.sampMin >= MEASURED.corner.certified,
  },
  {
    id: "imp95170-wd-transfer",
    description:
      "LEMMA WD transfer re-verified on multi-doubled draws: exact hollow lambda_max <= 1 - exact simplex min on every draw (band rates, coincident pairs included), the exact min never below TAU = 2e-8, and a coincident pair is exactly a single packet of summed mass (entrywise <= 1e-12)",
    holds: () =>
      MEASURED.wd.worstTransfer <= 1e-10 && MEASURED.wd.minExact >= 2e-8 && MEASURED.wd.worstMerge <= 1e-12,
  },
  {
    id: "imp95170-sa-endpoint-pin",
    description:
      "THEOREM SA + endpoint monotonicity: over random witnesses with multi-packet blocks 0/4 and doubled middle blocks, pinning blocks 0/4 to single packets at (2, 256) never decreases the exact hollow lambda_max (worst excess <= 1e-12)",
    holds: () => MEASURED.sa.worstPin <= 1e-12,
  },
  {
    id: "imp95170-theorem-mc-cover",
    description:
      "THEOREM MC re-run in-sweep: the six-layer 7-D branch-and-bound over the FULL two-point class on [0.2320727, 0.23209] terminates with zero unresolved cells, every leaf certified at simplexMin >= 2e-8 (worst 2.118e-8), ~55,398 cells, max depth ~61 -- the imp-95169 wall (2.86M cells, unterminated) is dissolved",
    holds: () =>
      MEASURED.cover.allDone && MEASURED.cover.nLayers === 6 && MEASURED.cover.worstCert >= 2e-8 &&
      Math.abs(MEASURED.cover.totalCells - 55398) <= 6000 &&
      Math.abs(MEASURED.cover.worstCert - 2.118052171662755e-8) < 1e-9,
  },
  {
    id: "imp95170-pocket-honesty",
    description:
      "honesty: at the recorded imp-95169 pocket cell (full-width s-ranges) the MC bound still equals the old entrywise bound (-1.098e-3 < 0) -- LEMMA MC gains nothing at full width; its gain is that s-splits are effective, which is what makes the cover terminate",
    holds: () =>
      MEASURED.pocket.mcBound < 0 && Math.abs(MEASURED.pocket.mcBound - MEASURED.pocket.oldEntrywiseBound) < 1e-5,
  },
  {
    id: "imp95170-honest-scope",
    description:
      "no recorded class constant moves: class sandwich [0.2320723, 0.24502], unconditional window [0.23209, 0.24502], open strip endpoints, covered-band floor 0.2320727, k <= 4 ladder floor 47/200 all carried; the step contracts the covered-band burden to >= 3 packets in some middle block and closes no sub-band of the open strip; no bound promotion; no QED",
    holds: () =>
      IMP95170_MERGE_CONSISTENT_COPOSITIVE_COVER.carried.classSandwich[0] === 0.2320723 &&
      IMP95170_MERGE_CONSISTENT_COPOSITIVE_COVER.carried.classSandwich[1] === 0.24502 &&
      IMP95170_MERGE_CONSISTENT_COPOSITIVE_COVER.carried.unconditionalWindow[0] === RIGHT &&
      IMP95170_MERGE_CONSISTENT_COPOSITIVE_COVER.carried.openStrip[0] === 0.2320723 &&
      IMP95170_MERGE_CONSISTENT_COPOSITIVE_COVER.carried.coveredBandFloor === MUF &&
      IMP95170_MERGE_CONSISTENT_COPOSITIVE_COVER.carried.ladderFloorKle4 === 47 / 200 &&
      IMP95170_MERGE_CONSISTENT_COPOSITIVE_COVER.promotesBound === false &&
      IMP95170_MERGE_CONSISTENT_COPOSITIVE_COVER.noQED === true,
  },
];

for (const a of IMP95170_MERGE_CONSISTENT_COPOSITIVE_COVER_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95170-merge-consistent-copositive-cover assertion failed: ${a.id}`);
}
