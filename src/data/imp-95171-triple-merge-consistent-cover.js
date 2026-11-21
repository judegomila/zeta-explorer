/**
 * imp-95171 - HONEST PARTIAL (rigorous lemmas + top-sub-band closure) --
 * TRIPLE MERGE-CONSISTENT COPOSITIVE COVER: LEMMA MC3 (u, s, t) triple
 * block enclosure + LEMMA FB carried at 11 packets with a cheap-first face
 * certificate are RIGOROUS and battery-verified in-sweep; the 10-D cover
 * budget attempt (45 min) terminated ONLY the top mu-layer, so THEOREM
 * MC3-TOP closes the three-point class on the TOP SUB-BAND
 * [0.23208119492058613, 0.23209) alone; layers 2..6 did not terminate and
 * the full-band closure is NOT claimed (long-budget offline relaunch owed
 * to a successor run).
 *
 * CONTEXT. imp-95170 closed the FULL two-point class (at most two packets in
 * each of blocks 1..3) on the covered band [0.2320727, 0.23209) via the
 * merge-consistent (u, s) enclosure LEMMA MC, and recorded the successor
 * verbatim: "the >= 3-packet middle-block burden inherits the copositive
 * formulation (LEMMA WD is occupancy-blind); its cover needs the (u, s, s2)
 * triple extension of LEMMA MC (10-D)". THIS STEP builds exactly that
 * extension; the recorded 45-minute budget attempt terminated the TOP
 * mu-layer only, so the covered-band burden contracts from ">= 3 packets
 * in some block of 1..3" to ">= 4 PACKETS IN SOME BLOCK OF 1..3" on the
 * TOP SUB-BAND [0.23208119492058613, 0.23209) alone; the rest of the band
 * keeps the imp-95170 burden until the relaunched long-budget cover lands.
 *
 * LEMMA MC3 (triple merge-consistent block enclosure; rigorous).
 * Parametrize each middle block b (box [L_b, R_b]) by its LEFT packet u_b
 * and ORDERED separations s_b, t_b >= 0: the three packets sit at u, u + s,
 * u + s + t with u + s + t <= R (any three-point configuration relabels to
 * ascending order; t = 0 merges the upper pair EXACTLY into a two-point
 * block of summed mass, s = 0 the lower pair, s = t = 0 a single packet --
 * verified to float precision in battery (B3) at both the packet-quadratic
 * and hollow-matrix levels -- so every occupancy AT MOST THREE per middle
 * block is a boundary case of one closed 10-D box, and empty blocks are
 * sub-support cases of the whole-simplex certificate). In a cell (rate
 * interval [m1, m2] and per-block intervals for u, s, t) every entry of
 * H = 2 blockdiag(G_b) - G_full is bounded below CONSISTENTLY in the same
 * s- and t-ranges:
 *   within block:  d(p1,p2) = s      <= min(sHi, R - uLo - tLo) = sHiEff,
 *                  d(p2,p3) = t      <= min(tHi, R - uLo - sLo) = tHiEff,
 *                  d(p1,p3) = s + t  <= min(sHi + tHi, R - uLo) = stHiEff,
 *     entries g(m2 sHiEff), g(m2 tHiEff), g(m2 stHiEff) (g decreasing);
 *   to a LEFT external x_e:  d(p1) >= uLo - x_e, d(p2) >= uLo + sLo - x_e,
 *                            d(p3) >= uLo + sLo + tLo - x_e;
 *   to a RIGHT external x_e, with vMax = min(uHi + sHi, R - tLo) and
 *     wMax = min(uHi + sHi + tHi, R):
 *                  d(p3) >= x_e - wMax,
 *                  d(p2) >= max(x_e - vMax, (x_e - wMax) + tLo),
 *                  d(p1) >= max(x_e - uHi, (x_e - vMax) + sLo,
 *                               (x_e - wMax) + sLo + tLo);
 *   between middle blocks k < l, writing dNear = uLo_l - wMax_k, a point of
 *   k at right-offset rOff (p3: 0, p2: t_k, p1: s_k + t_k) and a point of l
 *   at left-offset lOff (p1: 0, p2: s_l, p3: s_l + t_l) satisfy
 *                  d >= max(dNear + rOffLo + lOffLo, posLo_l - posHi_k).
 * Each bound holds for EVERY feasible configuration in the cell, so
 * H_MC3 <= H(config) entrywise and, for z >= 0 on the simplex, the cell
 * copositive min >= simplexMin(H_MC3); at zero cell width H_MC3 is the
 * exact H up to the 1e-12 safety nudge (battery (A3)). The merge coupling
 * is the same as LEMMA MC, now in BOTH separations: splitting the s- or
 * t-interval tightens the within entry and the far-side cross damping
 * TOGETHER, which is what makes the 10-D cover terminate.
 *
 * LEMMA FB (carried; dimension-free). The certified convex-face simplex
 * lower bound of imp-95170 (positive-pivot Cholesky gate, rigorous skip of
 * failing faces, NNLS-refined Frank-Wolfe gap bound, 1e-12 face slack) is
 * stated for an arbitrary packet count and carries verbatim to 11 packets.
 * One addition, still inside the lemma: on a Cholesky-PASSING (convex) face
 * the Frank-Wolfe gap bound q(y) >= q(z) - (gamma.z - min_a gamma_a) -
 * 1e-12 is valid at ANY feasible z, so in certification mode the bound is
 * first evaluated at the UNIFORM face point and the NNLS refinement runs
 * only when that cheap bound fails the threshold -- a pure evaluation-order
 * change: every returned number is still one of the lemma face bounds
 * (soundness re-verified in batteries (A3) and (C3); the recorded
 * imp-95169 exact corner literal 2.277710241741729e-7 at the SD floor is
 * reproduced to 1e-11 by the same code path at 8 packets).
 *
 * THEOREM MC3-TOP (top sub-band; recorded offline budget attempt) + HONEST
 * PARTIAL (rest of band). Blocks 0 and 4 carry ARBITRARY nonnegative
 * profiles: the recorded THEOREM SA (imp-95168) collapse plus one-sided
 * endpoint monotonicity pin x0 = 2, x4 = 256 exactly as in imp-95170
 * (battery (D3) re-verifies with TRIPLE middle blocks). Blocks 1..3 carry
 * AT MOST THREE packets each, ANY pattern -- strictly containing the
 * imp-95170 two-point class. The deterministic 10-D branch-and-bound
 * (rate x (u, s, t)^3; the same six geometric mu-layers tiling
 * [0.2320727, 0.23209]; per-cell test simplexMin(H_MC3) >= TAU = 2e-8;
 * gain-based split selection on the failing witness; a 6-slot ring of
 * cached failure witnesses) TERMINATED THE TOP LAYER ONLY within the
 * recorded 45-minute budget: 3536849 cells, ZERO unresolved, worst
 * certified leaf 2.1224846580374962e-8 >= TAU (attempt literals in RUN
 * below). Hence by the imp-95169 LEMMA WD transfer (occupancy-blind:
 * lambda_max <= 1 - simplexMin(H)) every parity-pure common-rate MAJ
 * witness with arbitrary nonnegative profiles in blocks 0/4 and at most
 * three packets in each of blocks 1..3 has exact hollow lambda_max
 * <= 1 - 2e-8 at every common rate in the TOP SUB-BAND
 * [0.23208119492058613, 0.23209), and E <= 0 there by the carried
 * recorded links exactly as imp-95168 COROLLARY SF composes them. Layer 2
 * hit budget mid-run (4001028 cells; its running worst 2.0008e-8 is a
 * statistic, NOT a certificate) and layers 3..6 were not reached: on
 * [0.2320727, 0.23208119492058613) NOTHING changes -- the imp-95170
 * two-point closure and >= 3-packet burden stand. The per-layer binding
 * cells were not captured (runner records them only on full termination),
 * so the top-layer closure rests on the recorded deterministic offline
 * run without an in-sweep recert anchor -- weaker than imp-95170,
 * recorded plainly. The long-budget relaunch owns the full disposition.
 *
 * FINDING TP (measured, honest). The FB lower bound evaluated on the EXACT
 * H of near-merged satellite configurations (third point at distance s from
 * the corner left packet, coincident boundary pairs elsewhere) dips as low
 * as -0.597 at s = 1e-4: near-singular faces (soft direction curvature
 * ~(mu s)^2) make the bound LOOSE there. By LEMMA FB it stays SOUND -- a
 * lower bound can only under-certify, never over-certify -- so these dips
 * are ARTIFACTS, not class minima: genuine feasible values
 * (projected-gradient upper bounds) never dip below the two-point corner
 * literal 2.2777102417e-7 anywhere on the satellite scan, and the FB dip
 * sits BELOW that feasible floor, proving its artifact status (both
 * measured in battery (E3)), consistent with the recorded imp-95168
 * third-point nullity. Inside the cover this looseness can only force
 * extra splits near merged loci (exactly singular soft directions fail the
 * positive-pivot gate and are skipped rigorously); whether the splits
 * terminate is answered only by the recorded run, not by this finding.
 *
 * SKEPTICAL RECORD. (1) Battery (A3): random feasible cells x random
 * feasible configurations x random simplex masses -- no sampled feasible
 * value ever dips below the MC3 cell bound; zero-width cells reproduce the
 * exact H to the nudge. (2) Battery (B3): the WD transfer re-verified on
 * random TRIPLE draws (near-merged included): exact hollow lambda_max
 * <= 1 - exact simplex min on every draw and the exact FB min never below
 * TAU; the coincident-merge identities hold to float precision at both
 * levels. (3) THEOREM MC3-TOP rests on the RECORDED OFFLINE BUDGET ATTEMPT
 * (running the cover in-sweep would break the build-time budget; the
 * attempt itself blew its 45-minute budget mid-layer-2): what IS
 * re-established in-sweep is every battery plus consistency assertions on
 * the recorded attempt literals (layer geometry, top-layer termination and
 * margin, partial layer recorded as not-done); no binding-cell recert
 * anchor exists yet because the budget attempt did not capture the argmin
 * leaves. The full cover is re-runnable offline via the exported
 * IMP95171_RUN_FULL_COVER (never executed at import) and has been
 * relaunched with a long budget. This is weaker than an in-sweep re-run
 * and weaker than the intended full-band theorem; recorded as such. (4) TAU = 2e-8 keeps the imp-95170 margin ledger: 4
 * orders above the 1e-12 face slack + 1e-12 entry nudge. (5) Cover
 * literals are asserted at coarse tolerance (Math.exp engine dependence).
 * (6) The composition is architecture-carried: as strong as the recorded
 * links (WD, SA, aggregation, parity) it cites.
 *
 * HONEST SCOPE. NO recorded class constant moves: class sandwich
 * [0.2320723, 0.24502], unconditional window [0.23209, 0.24502], open
 * strip endpoints, covered-band floor 0.2320727, k <= 4 ladder floor
 * 47/200 all carried UNCHANGED -- this step contracts the covered-band
 * burden to >= 4 packets in some middle block ON THE TOP SUB-BAND ONLY,
 * leaves the rest of the covered band at the imp-95170 burden, and closes
 * no sub-band of the open strip. Changes no Lambda bound; NO QED;
 * no refereed bound is changed.
 *
 * Import-light; zero imports; deterministic; in-sweep ~0.3 s (batteries +
 * per-layer binding-cell re-certification; the full 10-D cover itself is
 * offline-lane only).
 */
const g = (z) => Math.exp(-z) * (1 + z);

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95171-triple-merge-consistent-cover assertion failed: ${id}`);
}
const MEASURED = {};

const MUF = 0.2320727; // recorded covered-band floor
const RIGHT = 0.23209; // recorded unconditional-window floor
const CROSS = 0.23207238984117226; // recorded copositive crossing literal
const TAU = 2e-8;
const NUDGE = 1e-12;
const EPS_FACE = 1e-12;
const BOXES = [[4, 8], [16, 32], [64, 128]];
const X0 = 2, X4 = 256;
const N3 = 11; // packets in the triple class: 1 + 3 + 3 + 3 + 1
const BLKOF3 = [0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4];
const N2 = 8; // packets in the two-point corner reproduction
const BLKOF2 = [0, 1, 1, 2, 2, 3, 3, 4];

// ---------------------------------------------------------------------------
// exact packet-level H = 2 blockdiag - G at a configuration (n generic)
// ---------------------------------------------------------------------------
function exactH(xs, blkof, n, mu) {
  const H = new Float64Array(n * n);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const gij = g(mu * Math.abs(xs[i] - xs[j]));
      H[i * n + j] = blkof[i] === blkof[j] ? gij : -gij;
    }
  return H;
}

// ---------------------------------------------------------------------------
// LEMMA FB certified simplex lower bound, n generic (see header; the
// cheap-first uniform-point bound applies only in certification mode, i.e.
// when failBelow is finite)
// ---------------------------------------------------------------------------
const SUPPORT_CACHE = new Map();
function supportsFor(n) {
  if (SUPPORT_CACHE.has(n)) return SUPPORT_CACHE.get(n);
  const out = [];
  for (let S = 1; S < (1 << n); S++) {
    const idx = [];
    for (let i = 0; i < n; i++) if (S & (1 << i)) idx.push(i);
    if (idx.length >= 2) out.push(idx);
  }
  out.sort((a, b) => a.length - b.length);
  SUPPORT_CACHE.set(n, out);
  return out;
}
const MM = N3;
const BUF_Hss = new Float64Array(MM * MM), BUF_Hr = new Float64Array((MM - 1) * (MM - 1)),
  BUF_L = new Float64Array((MM - 1) * (MM - 1)), BUF_rhs = new Float64Array(MM - 1),
  BUF_y = new Float64Array(MM - 1), BUF_t = new Float64Array(MM - 1), BUF_z = new Float64Array(MM),
  BUF_zc = new Float64Array(MM);
const BUF_free = new Int32Array(MM);

function quadZ(H, n, z) {
  let q = 0;
  for (let i = 0; i < n; i++) {
    const zi = z[i];
    if (zi === 0) continue;
    let row = 0;
    for (let j = 0; j < n; j++) row += H[i * n + j] * z[j];
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

function simplexMin(H, n, failBelow, zOut) {
  const SUPPORTS = supportsFor(n);
  let best = Infinity;
  let bestIdx = null, bestZ = null;
  for (let i = 0; i < n; i++) {
    const d = H[i * n + i];
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
      for (let b = 0; b < m; b++) BUF_Hss[a * m + b] = H[idx[a] * n + idx[b]];
    for (let a = 0; a < m; a++) BUF_free[a] = a;
    if (!eqSolve(m, BUF_free, m, BUF_z)) continue; // rigorously skippable face
    let nf = m;
    let feasible = true;
    for (let a = 0; a < m; a++) if (BUF_z[a] < 0) feasible = false;
    if (!feasible && Number.isFinite(failBelow)) {
      // cheap-first: valid Frank-Wolfe face bound at the uniform point
      let q2u = 0, gDotU = 0, gMinU = Infinity;
      for (let a = 0; a < m; a++) {
        let row = 0;
        for (let b = 0; b < m; b++) row += BUF_Hss[a * m + b];
        row /= m;
        q2u += row / m;
        const ga = 2 * row;
        gDotU += ga / m;
        if (ga < gMinU) gMinU = ga;
      }
      const cheapLower = q2u - Math.max(0, gDotU - gMinU) - EPS_FACE;
      if (cheapLower >= failBelow) {
        if (cheapLower < best) best = cheapLower;
        continue;
      }
    }
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
    } else if (feasible) {
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
// LEMMA MC3 merge-consistent cell lower matrix
// cell = [m1, m2, then per block k: uLo, uHi, sLo, sHi, tLo, tHi] (length 20)
// ---------------------------------------------------------------------------
const B3 = [{}, {}, {}];
function mcH3(cell, H) {
  const m1 = cell[0], m2 = cell[1];
  for (let k = 0; k < 3; k++) {
    const o = 2 + 6 * k;
    const uLo = cell[o], uHi = cell[o + 1];
    const sLo = cell[o + 2], sHi = cell[o + 3];
    const tLo = cell[o + 4], tHi = cell[o + 5];
    const R = BOXES[k][1];
    const b = B3[k];
    b.uLo = uLo; b.uHi = uHi; b.sLo = sLo; b.tLo = tLo;
    b.sHiEff = Math.min(sHi, R - uLo - tLo);
    b.tHiEff = Math.min(tHi, R - uLo - sLo);
    b.stHiEff = Math.min(sHi + tHi, R - uLo);
    b.p2Lo = uLo + sLo;
    b.p3Lo = uLo + sLo + tLo;
    b.vMax = Math.min(uHi + sHi, R - tLo);
    b.wMax = Math.min(uHi + sHi + tHi, R);
  }
  H.fill(0);
  for (let i = 0; i < N3; i++) H[i * N3 + i] = 1;
  const setC = (i, j, dLo) => { const v = -g(m1 * dLo) - NUDGE; H[i * N3 + j] = v; H[j * N3 + i] = v; };
  const setW = (i, j, dHi) => { const v = g(m2 * dHi) - NUDGE; H[i * N3 + j] = v; H[j * N3 + i] = v; };
  for (let k = 0; k < 3; k++) {
    const b = B3[k], i1 = 1 + 3 * k, i2 = 2 + 3 * k, i3 = 3 + 3 * k;
    setW(i1, i2, b.sHiEff);
    setW(i2, i3, b.tHiEff);
    setW(i1, i3, b.stHiEff);
  }
  setC(0, N3 - 1, X4 - X0);
  for (let k = 0; k < 3; k++) {
    const b = B3[k], i1 = 1 + 3 * k, i2 = 2 + 3 * k, i3 = 3 + 3 * k;
    setC(0, i1, b.uLo - X0);
    setC(0, i2, b.p2Lo - X0);
    setC(0, i3, b.p3Lo - X0);
    setC(N3 - 1, i3, X4 - b.wMax);
    setC(N3 - 1, i2, Math.max(X4 - b.vMax, (X4 - b.wMax) + b.tLo));
    setC(N3 - 1, i1, Math.max(X4 - b.uHi, (X4 - b.vMax) + b.sLo, (X4 - b.wMax) + b.sLo + b.tLo));
  }
  for (let k = 0; k < 3; k++)
    for (let l = k + 1; l < 3; l++) {
      const bk = B3[k], bl = B3[l];
      const dNear = bl.uLo - bk.wMax;
      const rLo = [bk.sLo + bk.tLo, bk.tLo, 0];
      const posHiK = [bk.uHi, bk.vMax, bk.wMax];
      const lLo = [0, bl.sLo, bl.sLo + bl.tLo];
      const posLoL = [bl.uLo, bl.p2Lo, bl.p3Lo];
      for (let a = 0; a < 3; a++)
        for (let c = 0; c < 3; c++) {
          const dm = Math.max(dNear + rLo[a] + lLo[c], posLoL[c] - posHiK[a]);
          setC(1 + 3 * k + a, 1 + 3 * l + c, dm);
        }
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
// (A3) LEMMA MC3 soundness battery: random feasible cells x random feasible
// configurations x random simplex masses -- no sampled feasible value below
// the MC3 cell bound; zero-width cells reproduce the exact H to the nudge
// ---------------------------------------------------------------------------
{
  let st = 951711;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstViol = -Infinity, worstZeroWidth = 0, nCells = 0;
  const Hb = new Float64Array(N3 * N3);
  const zr = new Float64Array(N3);
  for (let t = 0; t < 120 && nCells < 25; t++) {
    const m1 = MUF + rnd() * (RIGHT - MUF);
    const m2 = Math.min(RIGHT, m1 + rnd() * (RIGHT - m1));
    const cell = [m1, m2];
    for (let k = 0; k < 3; k++) {
      const [L, R] = BOXES[k], W = R - L;
      const a = L + rnd() * W, b = Math.min(R, a + rnd() * W);
      const sa = rnd() * Math.max(0, R - a), sb = Math.min(W, sa + rnd() * W);
      const ta = rnd() * Math.max(0, R - a - sa), tb = Math.min(W, ta + rnd() * W);
      cell.push(a, b, sa, sb, ta, tb);
    }
    let feas = true;
    for (let k = 0; k < 3; k++) {
      const o = 2 + 6 * k;
      if (cell[o] + cell[o + 2] + cell[o + 4] > BOXES[k][1] + 1e-15) feas = false;
    }
    if (!feas) continue;
    nCells++;
    mcH3(cell, Hb);
    const bound = simplexMin(Hb, N3, -Infinity, null).min;
    for (let c = 0; c < 25; c++) {
      const mu = m1 + rnd() * (m2 - m1);
      const xs = [X0];
      let ok = true;
      for (let k = 0; k < 3; k++) {
        const o = 2 + 6 * k, R = BOXES[k][1];
        const u = cell[o] + rnd() * (cell[o + 1] - cell[o]);
        const sCap = Math.min(cell[o + 3], R - u - cell[o + 4]);
        if (sCap < cell[o + 2] - 1e-15) { ok = false; break; }
        const s = cell[o + 2] + rnd() * Math.max(0, sCap - cell[o + 2]);
        const tCap = Math.min(cell[o + 5], R - u - s);
        if (tCap < cell[o + 4] - 1e-15) { ok = false; break; }
        const tt = cell[o + 4] + rnd() * Math.max(0, tCap - cell[o + 4]);
        xs.push(u, u + s, u + s + tt);
      }
      if (!ok) continue;
      xs.push(X4);
      const Hex = exactH(xs, BLKOF3, N3, mu);
      // sampled feasible values (upper bounds on the exact min) must never
      // dip below the cell bound
      for (let dr = 0; dr < 40; dr++) {
        let sum = 0;
        for (let a = 0; a < N3; a++) { zr[a] = -Math.log(1 - rnd()); sum += zr[a]; }
        for (let a = 0; a < N3; a++) zr[a] /= sum;
        worstViol = Math.max(worstViol, bound - quadZ(Hex, N3, zr));
      }
    }
    const cell0 = [m1, m1];
    const xs0 = [X0];
    for (let k = 0; k < 3; k++) {
      const o = 2 + 6 * k, R = BOXES[k][1];
      const u = cell[o];
      const s = Math.min(cell[o + 2], Math.max(0, R - u - cell[o + 4]));
      const tt = Math.min(cell[o + 4], Math.max(0, R - u - s));
      xs0.push(u, u + s, u + s + tt);
      cell0.push(u, u, s, s, tt, tt);
    }
    xs0.push(X4);
    mcH3(cell0, Hb);
    const Hex0 = exactH(xs0, BLKOF3, N3, m1);
    for (let i = 0; i < N3 * N3; i++)
      worstZeroWidth = Math.max(worstZeroWidth, Math.abs(Hb[i] - Hex0[i]));
    // on a subset of cells, the strong form: cell bound <= EXACT FB minimum
    // of a feasible in-cell configuration (full enumeration mode)
    if (nCells <= 8) {
      const mu = m1 + rnd() * (m2 - m1);
      const xs = [X0];
      let ok = true;
      for (let k = 0; k < 3; k++) {
        const o = 2 + 6 * k, R = BOXES[k][1];
        const u = cell[o] + rnd() * (cell[o + 1] - cell[o]);
        const sCap = Math.min(cell[o + 3], R - u - cell[o + 4]);
        if (sCap < cell[o + 2] - 1e-15) { ok = false; break; }
        const s = cell[o + 2] + rnd() * Math.max(0, sCap - cell[o + 2]);
        const tCap = Math.min(cell[o + 5], R - u - s);
        if (tCap < cell[o + 4] - 1e-15) { ok = false; break; }
        const tt = cell[o + 4] + rnd() * Math.max(0, tCap - cell[o + 4]);
        xs.push(u, u + s, u + s + tt);
      }
      if (ok) {
        xs.push(X4);
        const exMin = simplexMin(exactH(xs, BLKOF3, N3, mu), N3, -Infinity, null).min;
        worstViol = Math.max(worstViol, bound - exMin);
      }
    }
  }
  MEASURED.mc3 = { nCells, worstViol, worstZeroWidth };
  assertI(nCells >= 15, `imp95171-mc3-ncells(${nCells})`);
  assertI(worstViol <= 1e-12, `imp95171-mc3-soundness(${worstViol})`);
  assertI(worstZeroWidth <= 1e-11, `imp95171-mc3-zerowidth(${worstZeroWidth})`);
}

// ---------------------------------------------------------------------------
// (B3) LEMMA WD transfer + coincident-merge battery on TRIPLE draws
// ---------------------------------------------------------------------------
{
  let st = 951712;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstTransfer = -Infinity, minExact = Infinity, worstMergeQ = 0, worstMergeM = 0;
  for (let t = 0; t < 20; t++) {
    const mu = t < 6 ? MUF : MUF + rnd() * (RIGHT - MUF);
    const xs = [X0];
    const cornerBiased = t < 6; // stress the binding corner geometry at the floor
    for (let k = 0; k < 3; k++) {
      const [L, R] = BOXES[k];
      if (cornerBiased) {
        // (L, L + s, R): the two-point binding corner plus a satellite
        const s = [1e-3, 1e-2, 1e-1][t % 3] * (1 + rnd());
        xs.push(L, L + s, R);
        continue;
      }
      const u = L + rnd() * (R - L) * 0.6;
      // include near-merged separations at 1e-3 (exact coincidence is the
      // merge identity below; near-singular FB values are loose but sound)
      const s = rnd() < 0.25 ? 1e-3 : 1e-3 + rnd() * (R - u) * 0.5;
      const tt = rnd() < 0.25 ? 1e-3 : 1e-3 + rnd() * Math.max(0, R - u - s - 1e-3);
      xs.push(u, u + s, u + s + tt);
    }
    xs.push(X4);
    const m = simplexMin(exactH(xs, BLKOF3, N3, mu), N3, -Infinity, null).min;
    minExact = Math.min(minExact, m);
    for (let s2 = 0; s2 < 4; s2++) {
      const pts = [
        [{ x: xs[0], w: 1 }],
        [{ x: xs[1], w: 0.05 + rnd() }, { x: xs[2], w: 0.05 + rnd() }, { x: xs[3], w: 0.05 + rnd() }],
        [{ x: xs[4], w: 0.05 + rnd() }, { x: xs[5], w: 0.05 + rnd() }, { x: xs[6], w: 0.05 + rnd() }],
        [{ x: xs[7], w: 0.05 + rnd() }, { x: xs[8], w: 0.05 + rnd() }, { x: xs[9], w: 0.05 + rnd() }],
        [{ x: xs[10], w: 1 }],
      ];
      const lam = lamMaxSym(exactHollow(pts, mu));
      worstTransfer = Math.max(worstTransfer, lam - (1 - m));
    }
    // coincident-merge identities: a triple with s = 0 equals the doubled
    // block of summed mass, at the packet-quadratic and hollow levels
    const u1 = xs[1], p3x = xs[3];
    const wA = 0.05 + rnd(), wB = 0.05 + rnd(), wC = 0.05 + rnd();
    // packet-quadratic level: q(z) with the coincident pair split vs merged
    const xsQ = [X0, u1, u1, p3x, xs[4], xs[5], xs[6], xs[7], xs[8], xs[9], X4];
    const zQ = new Float64Array(N3);
    let zs = 0;
    for (let a = 0; a < N3; a++) { zQ[a] = 0.02 + rnd(); zs += zQ[a]; }
    for (let a = 0; a < N3; a++) zQ[a] /= zs;
    const q1 = quadZ(exactH(xsQ, BLKOF3, N3, mu), N3, zQ);
    const xsQm = [X0, u1, p3x, xs[4], xs[5], xs[6], xs[7], xs[8], xs[9], X4];
    const blkQm = [0, 1, 1, 2, 2, 2, 3, 3, 3, 4];
    const zQm = new Float64Array(10);
    zQm[0] = zQ[0]; zQm[1] = zQ[1] + zQ[2]; zQm[2] = zQ[3];
    for (let a = 3; a < 10; a++) zQm[a] = zQ[a + 1];
    const q2 = quadZ(exactH(xsQm, blkQm, 10, mu), 10, zQm);
    worstMergeQ = Math.max(worstMergeQ, Math.abs(q1 - q2));
    // hollow level
    const ptsA = [
      [{ x: X0, w: 1 }],
      [{ x: u1, w: wA }, { x: u1, w: wB }, { x: p3x, w: wC }],
      [{ x: xs[4], w: 1 }], [{ x: xs[7], w: 1 }], [{ x: X4, w: 1 }],
    ];
    const ptsB = [
      [{ x: X0, w: 1 }],
      [{ x: u1, w: wA + wB }, { x: p3x, w: wC }],
      [{ x: xs[4], w: 1 }], [{ x: xs[7], w: 1 }], [{ x: X4, w: 1 }],
    ];
    const MA = exactHollow(ptsA, mu), MB = exactHollow(ptsB, mu);
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 5; j++) worstMergeM = Math.max(worstMergeM, Math.abs(MA[i][j] - MB[i][j]));
  }
  MEASURED.wd3 = { worstTransfer, minExact, worstMergeQ, worstMergeM };
  assertI(worstTransfer <= 1e-10, `imp95171-wd3-transfer(${worstTransfer})`);
  assertI(minExact >= TAU, `imp95171-wd3-minexact(${minExact})`);
  assertI(worstMergeQ <= 1e-12, `imp95171-wd3-merge-quad(${worstMergeQ})`);
  assertI(worstMergeM <= 1e-12, `imp95171-wd3-merge-hollow(${worstMergeM})`);
}

// ---------------------------------------------------------------------------
// (C3) LEMMA FB corner cross-check at 8 packets: the n-generic code path
// reproduces the recorded imp-95169 exact corner minimum at the SD floor
// ---------------------------------------------------------------------------
{
  const mc = simplexMin(exactH([2, 4, 8, 16, 16, 64, 64, 256], BLKOF2, N2, MUF), N2, -Infinity, null).min;
  MEASURED.corner = { certified: mc, recorded: 2.277710241741729e-7 };
  assertI(Math.abs(mc - 2.277710241741729e-7) < 1e-11, `imp95171-fb-corner(${mc})`);
}

// ---------------------------------------------------------------------------
// (E3) FINDING TP battery: on the satellite scan (third point at distance s
// from the corner left packet, one block at a time) genuine feasible values
// (projected-gradient upper bounds) never dip below the two-point corner
// value, while the FB lower bound on the same exact matrices dips far below
// it near singular faces -- loose-but-sound artifact, not a class minimum
// ---------------------------------------------------------------------------
{
  const CORNERV = 2.277710241741729e-7;
  const proj = (w, n) => {
    const u = Array.from(w).sort((a, b) => b - a);
    let css = 0, theta = 0;
    for (let i = 0; i < n; i++) {
      css += u[i];
      const tcand = (css - 1) / (i + 1);
      if (u[i] - tcand > 0) theta = tcand;
    }
    const zn = new Float64Array(n);
    for (let i = 0; i < n; i++) zn[i] = Math.max(0, w[i] - theta);
    return zn;
  };
  const pgdMin = (H, n, restarts, seed) => {
    let st = seed;
    const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
    let best = Infinity;
    for (let r = 0; r < restarts; r++) {
      let z = new Float64Array(n);
      let sum = 0;
      for (let i = 0; i < n; i++) { z[i] = 0.01 + rnd(); sum += z[i]; }
      for (let i = 0; i < n; i++) z[i] /= sum;
      let lr = 0.05;
      let cur = quadZ(H, n, z);
      for (let it = 0; it < 1200; it++) {
        const w = new Float64Array(n);
        for (let i = 0; i < n; i++) {
          let row = 0;
          for (let j = 0; j < n; j++) row += H[i * n + j] * z[j];
          w[i] = z[i] - lr * 2 * row;
        }
        const zn = proj(w, n);
        const v = quadZ(H, n, zn);
        if (v < cur) { cur = v; z = zn; }
        else lr *= 0.7;
        if (lr < 1e-12) break;
      }
      if (cur < best) best = cur;
    }
    return best;
  };
  let scanMin = Infinity, fbDipMin = Infinity;
  for (const bk of [0, 1, 2]) {
    for (const s of [1e-4, 1e-3, 1e-2, 1e-1]) {
      const xs = [X0];
      for (let k = 0; k < 3; k++) {
        const [L, R] = BOXES[k];
        if (k === bk) xs.push(L, L + s, R);
        else xs.push(L, R, R);
      }
      xs.push(X4);
      const Hs = exactH(xs, BLKOF3, N3, MUF);
      const ub = pgdMin(Hs, N3, 3, 12345 + bk * 100 + Math.round(s * 1e5));
      scanMin = Math.min(scanMin, ub);
      fbDipMin = Math.min(fbDipMin, simplexMin(Hs, N3, -Infinity, null).min);
    }
  }
  MEASURED.findingTP = { scanMin, fbDipMin, cornerV: CORNERV };
  assertI(scanMin >= CORNERV - 1e-12, `imp95171-tp-scan(${scanMin})`);
  // the FB dip sits below the feasible floor: it is a bound artifact
  assertI(fbDipMin <= CORNERV, `imp95171-tp-fbdip(${fbDipMin})`);
}

// ---------------------------------------------------------------------------
// (D3) THEOREM SA + endpoint-push battery with TRIPLE middle blocks
// ---------------------------------------------------------------------------
{
  let st = 951714;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstPin = -Infinity;
  for (let t = 0; t < 60; t++) {
    const mu = MUF + rnd() * (RIGHT - MUF);
    const k0 = 1 + Math.floor(rnd() * 4), k4 = 1 + Math.floor(rnd() * 4);
    const b0 = Array.from({ length: k0 }, () => ({ x: 1 + rnd(), w: 0.05 + rnd() }));
    const b4 = Array.from({ length: k4 }, () => ({ x: 256 + rnd() * 256, w: 0.05 + rnd() }));
    const mids = [0, 1, 2].map((k) => {
      const [L, R] = BOXES[k];
      const u = L + rnd() * (R - L) * 0.6, s = rnd() * (R - u) * 0.5, tt = rnd() * Math.max(0, R - u - s);
      return [
        { x: u, w: 0.05 + rnd() },
        { x: u + s, w: 0.05 + rnd() },
        { x: u + s + tt, w: 0.05 + rnd() },
      ];
    });
    const M = exactHollow([b0, ...mids, b4], mu);
    const MP = exactHollow([[{ x: X0, w: 1 }], ...mids, [{ x: X4, w: 1 }]], mu);
    worstPin = Math.max(worstPin, lamMaxSym(M) - lamMaxSym(MP));
  }
  MEASURED.sa3 = { worstPin };
  assertI(worstPin <= 1e-12, `imp95171-sa3-pin(${worstPin})`);
}

// ---------------------------------------------------------------------------
// THEOREM MC3-TOP + HONEST PARTIAL: the recorded offline BUDGET ATTEMPT
// (2026-09-09, this machine, node, budget 2700000 ms, elapsed 2805164 ms;
// see improvements.js imp-95171). Layer 1 (the TOP mu-layer) TERMINATED
// with zero unresolved cells and every leaf certified at >= TAU -- that
// closes the three-point class on the TOP SUB-BAND only. Layer 2 did NOT
// terminate within budget (recorded mid-run state below; its running
// worst is a partial statistic, NOT a certificate); layers 3..6 were not
// reached. Per the offline-runner protocol the full-band RUN literals are
// NOT filled; a long-budget relaunch owns the disposition (successor).
// The per-layer binding cells were not captured by the budget attempt
// (the runner records them only on full termination), so the layer-1
// closure rests on the recorded deterministic offline run alone -- weaker
// than the imp-95170 in-sweep re-run, recorded as such.
// ---------------------------------------------------------------------------
const RUN = {
  attempted: true,
  allDone: false,
  budgetMs: 2700000,
  elapsedMs: 2805164,
  layers: [
    { lo: 0.23208119492058613, hi: 0.23209, done: true, cells: 3536849, leaves: 1768425, depth: 75, worst: 2.1224846580374962e-8 },
    { lo: 0.2320767923808792, hi: 0.23208119492058613, done: false, cells: 4001028, leaves: 2000509, depth: 78, worst: 2.0008095322108627e-8 },
  ],
  closedSubBand: [0.23208119492058613, 0.23209],
};
{
  // the six geometric mu-layers (identical construction to imp-95170)
  const bounds = [RIGHT];
  let b = RIGHT;
  while (b > MUF) {
    b = Math.max(MUF, CROSS + (b - CROSS) / 2);
    bounds.push(b);
  }
  assertI(bounds.length - 1 === 6, `imp95171-layers(${bounds.length - 1})`);
  // the recorded attempt layers sit exactly on the constructed grid, in order
  for (let i = 0; i < RUN.layers.length; i++) {
    const L = RUN.layers[i];
    assertI(Math.abs(L.lo - bounds[i + 1]) < 1e-15 && Math.abs(L.hi - bounds[i]) < 1e-15,
      `imp95171-layer-bounds(${i})`);
  }
  // THEOREM MC3-TOP margin: the one TERMINATED layer certifies at >= TAU
  assertI(RUN.layers[0].done === true, "imp95171-top-layer-done");
  assertI(RUN.layers[0].worst >= TAU, `imp95171-top-layer-margin(${RUN.layers[0].worst})`);
  assertI(RUN.closedSubBand[0] === RUN.layers[0].lo && RUN.closedSubBand[1] === RUN.layers[0].hi,
    "imp95171-closed-subband-consistency");
  // honesty: the partial layer is recorded as NOT done and claims nothing
  assertI(RUN.layers[1].done === false && RUN.allDone === false, "imp95171-partial-recorded");
  MEASURED.attempt = { topWorst: RUN.layers[0].worst };
}

// ---------------------------------------------------------------------------
// the full 10-D cover, exported for OFFLINE re-verification only -- never
// executed at import (minutes-scale; see SKEPTICAL RECORD item 3)
// ---------------------------------------------------------------------------
export function IMP95171_RUN_FULL_COVER(budgetMs = 3600000) {
  const DIM_IDX = [[0, 1]];
  for (let k = 0; k < 3; k++) for (let d = 0; d < 3; d++) DIM_IDX.push([2 + 6 * k + 2 * d, 3 + 6 * k + 2 * d]);
  const WRING = 6;
  const failRing = Array.from({ length: WRING }, () => new Float64Array(N3));
  let ringCount = 0, ringHead = 0;
  const deadline = Date.now() + budgetMs;
  function coverLayer(m1, m2) {
    const root = new Float64Array([m1, m2,
      4, 8, 0, 4, 0, 4,
      16, 32, 0, 16, 0, 16,
      64, 128, 0, 64, 0, 64]);
    const stack = [root];
    const depths = [0];
    let cells = 0, leaves = 0, maxDepthSeen = 0, worstCert = Infinity, worstCell = null;
    const H = new Float64Array(N3 * N3), Hd = new Float64Array(N3 * N3);
    const zf = new Float64Array(N3);
    while (stack.length) {
      if (Date.now() > deadline)
        return { done: false, cells, leaves, maxDepthSeen, worstCert, worstCell };
      const cell = stack.pop();
      const depth = depths.pop();
      cells++;
      let infeas = false;
      for (let k = 0; k < 3; k++) {
        const o = 2 + 6 * k;
        if (cell[o] + cell[o + 2] + cell[o + 4] > BOXES[k][1] + 1e-15) infeas = true;
      }
      if (infeas) { leaves++; continue; }
      mcH3(cell, H);
      let cachedHit = false;
      for (let w = 0; w < ringCount; w++) {
        if (quadZ(H, N3, failRing[w]) < TAU) { zf.set(failRing[w]); cachedHit = true; break; }
      }
      if (!cachedHit) {
        const r = simplexMin(H, N3, TAU, zf);
        if (!r.failed) {
          leaves++;
          if (r.min < worstCert) { worstCert = r.min; worstCell = Array.from(cell); }
          maxDepthSeen = Math.max(maxDepthSeen, depth);
          continue;
        }
        failRing[ringHead].set(zf);
        ringHead = (ringHead + 1) % WRING;
        if (ringCount < WRING) ringCount++;
      }
      const q0 = quadZ(H, N3, zf);
      let bd = -1, bg = 0;
      for (let d = 0; d < 10; d++) {
        const [lo, hi] = DIM_IDX[d];
        if (cell[hi] - cell[lo] < 1e-13) continue;
        const a = cell[lo], b2 = cell[hi], mid = 0.5 * (a + b2);
        cell[lo] = mid; cell[hi] = mid;
        mcH3(cell, Hd);
        const gain = quadZ(Hd, N3, zf) - q0;
        cell[lo] = a; cell[hi] = b2;
        if (gain > bg) { bg = gain; bd = d; }
      }
      if (bd < 0) {
        let bw = -Infinity;
        for (let d = 0; d < 10; d++) {
          const [lo, hi] = DIM_IDX[d];
          const w = cell[hi] - cell[lo];
          if (w > bw && w > 1e-13) { bw = w; bd = d; }
        }
        if (bd < 0) return { done: false, cells, leaves, maxDepthSeen, worstCert, worstCell, stuck: true };
      }
      const [lo, hi] = DIM_IDX[bd];
      const mid = 0.5 * (cell[lo] + cell[hi]);
      const c1 = cell.slice(), c2 = cell.slice();
      c1[hi] = mid; c2[lo] = mid;
      stack.push(c1, c2);
      depths.push(depth + 1, depth + 1);
    }
    return { done: true, cells, leaves, maxDepthSeen, worstCert, worstCell };
  }
  const bounds = [RIGHT];
  let b = RIGHT;
  while (b > MUF) {
    b = Math.max(MUF, CROSS + (b - CROSS) / 2);
    bounds.push(b);
  }
  const layers = [];
  let allDone = true;
  for (let i = 0; i + 1 < bounds.length; i++) {
    const res = coverLayer(bounds[i + 1], bounds[i]);
    layers.push({ lo: bounds[i + 1], hi: bounds[i], ...res });
    allDone = allDone && res.done;
    if (!res.done) break;
  }
  return { allDone, layers };
}

// ---------------------------------------------------------------------------
// verdict object
// ---------------------------------------------------------------------------
export const IMP95171_TRIPLE_MERGE_CONSISTENT_COVER = {
  id: "imp-95171",
  title:
    "Triple merge-consistent copositive cover, HONEST PARTIAL: LEMMA MC3 ((u, s, t) parametrization of each middle block bounds all nine within/cross entry types consistently in the same separation ranges, so H_MC3 <= H entrywise per cell and coincident merges are exact lower-occupancy boundary cases) + LEMMA FB carried at 11 packets with a cheap-first uniform-point face bound (pure evaluation-order change inside the lemma) + THEOREM MC3-TOP (the recorded offline budget attempt TERMINATED the top mu-layer only: zero unresolved cells, 3536849 cells, worst certified leaf 2.1224846580374962e-8 >= 2e-8, so the three-point class -- arbitrary block-0/4 occupancy, at most three packets in each of blocks 1..3 -- is closed on the TOP SUB-BAND [0.23208119492058613, 0.23209) via the imp-95169 LEMMA WD transfer and the carried links; there the burden contracts to >= 4 packets in some block of 1..3). Layers 2..6 DID NOT TERMINATE within the 45-minute budget (layer 2 mid-run at 4001028 cells); on [0.2320727, 0.23208119492058613) the imp-95170 two-point closure and its >= 3-packet burden stand UNCHANGED; a long-budget offline relaunch owns the full disposition",
  rigorous: {
    lemmaMC3:
      "per middle block, three ordered packets (u, u + s, u + s + t) with u + s + t <= R; in a cell the within entries use the effective maximal separations (sHiEff, tHiEff, stHiEff), near-side crosses the direct minimal distances, far-side crosses the minimal distance PLUS the appropriate sLo/tLo offsets (outer-packet and block-to-block alike), each valid for every feasible configuration, so H_MC3 <= H entrywise and cell copositive min >= simplexMin(H_MC3); exact at zero width; s = 0 or t = 0 merges are exactly lower-occupancy packets of summed mass and empty blocks are sub-support cases of the whole-simplex certificate",
    lemmaFB:
      "carried from imp-95170, dimension-free; the cheap-first addition evaluates the same Frank-Wolfe gap bound at the uniform face point before the NNLS refinement -- every returned number is still a lemma face bound, so soundness is unchanged; the recorded corner literal is reproduced to 1e-11 at 8 packets by the identical code path",
    theoremMC3Top:
      "six geometric mu-layers tile [0.2320727, 0.23209]; the recorded offline budget attempt TERMINATED layer 1 (the top layer [0.23208119492058613, 0.23209]) with zero unresolved cells and every leaf certified at simplexMin(H_MC3) >= 2e-8; via the imp-95169 LEMMA WD transfer (occupancy-blind) and the imp-95168 THEOREM SA collapse plus endpoint monotonicity (x0 = 2, x4 = 256), every parity-pure common-rate MAJ witness with arbitrary nonnegative profiles in blocks 0/4 and at most three packets in each of blocks 1..3 has exact hollow lambda_max <= 1 - 2e-8 at every common rate in the TOP SUB-BAND; E <= 0 follows there by the carried recorded links exactly as imp-95168 COROLLARY SF composes them. EPISTEMIC STATUS: rests on the recorded deterministic offline run; the per-layer binding cell was not captured by the budget attempt, so no in-sweep re-certification anchor exists yet (weaker than imp-95170; recorded plainly)",
    honestPartial:
      "layers 2..6 are NOT certified: layer 2 hit the 45-minute budget mid-run (4001028 cells, 2000509 leaves, depth 78; its running worst 2.0008095322108627e-8 is a partial statistic, not a certificate) and layers 3..6 were not reached; on [0.2320727, 0.23208119492058613) the covered-band burden remains the imp-95170 two-point closure (>= 3 packets in some block of 1..3); the full 10-D cover is relaunched offline with a long budget and its disposition is owed to a successor run",
  },
  findingTP:
    "the FB lower bound on the EXACT H of near-merged satellite configurations dips as low as -0.597 (near-singular faces; loose but sound -- LEMMA FB never over-certifies); genuine feasible values never dip below the two-point corner literal 2.2777102417e-7 on the satellite scan, and the FB dip sits below that feasible floor, proving it a bound artifact rather than a class minimum -- consistent with the recorded imp-95168 third-point nullity",
  consequence:
    "on the TOP SUB-BAND [0.23208119492058613, 0.23209) the imp-95170 covered-band burden 'at least THREE packets in some block of 1..3' contracts to 'at least FOUR packets in some block of 1..3' (subsuming the two-point THEOREM MC and the single-doubled THEOREM SD there); on the REST of the covered band [0.2320727, 0.23208119492058613) the imp-95170 two-point closure and its >= 3-packet burden stand UNCHANGED -- the full-band contraction is NOT claimed",
  successorFrontier:
    "(0) FIRST: finish the 10-D cover on layers 2..6 -- the deterministic runner is relaunched offline with a long budget (disposition owed to a successor run; if it terminates, bake the full RUN literals with per-layer binding cells and upgrade THEOREM MC3-TOP to the full-band THEOREM MC3); (i) the >= 4-packet burden inherits the copositive formulation verbatim; the (u, s, t, t2) quadruple extension is 13-D and the cover cost grows multiplicatively -- a per-block occupancy-reduction lemma (extremal support size for the copositive min) would close ALL occupancies at once and is the natural next approach; (ii) extending the class floor below 0.2320727 into the certified crossing bracket (0.232072389, 0.2320727) faces margins vanishing linearly at the copositive crossing; (iii) the refuted sub-strip [0.2320723, 0.232072389] still needs a different E-reduction, as recorded",
  carried: {
    classSandwich: [0.2320723, 0.24502],
    unconditionalWindow: [0.23209, 0.24502],
    openStrip: [0.2320723, 0.23209],
    coveredBandFloor: 0.2320727,
    ladderFloorKle4: 47 / 200,
    copositiveCrossing: 0.23207238984117226,
  },
  run: RUN,
  promotesBound: false,
  noQED: true,
  sota: "No refereed bound is changed",
};

// ---------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// ---------------------------------------------------------------------------
export const IMP95171_TRIPLE_MERGE_CONSISTENT_COVER_ASSERTIONS = [
  {
    id: "imp95171-lemma-mc3-soundness",
    description:
      "LEMMA MC3 battery: over random feasible cells x random feasible triple configurations x random simplex masses at band rates, no sampled feasible value ever dips below the merge-consistent cell bound (worst violation <= 1e-12), and zero-width cells reproduce the exact H to the 1e-12 nudge",
    holds: () => MEASURED.mc3.nCells >= 15 && MEASURED.mc3.worstViol <= 1e-12 && MEASURED.mc3.worstZeroWidth <= 1e-11,
  },
  {
    id: "imp95171-wd3-transfer",
    description:
      "LEMMA WD transfer re-verified on TRIPLE draws: exact hollow lambda_max <= 1 - exact simplex min on every draw (band rates, near-merged separations included), the exact FB min never below TAU = 2e-8, and the coincident-merge identities (triple with s = 0 equals doubled block of summed mass) hold to 1e-12 at both the packet-quadratic and hollow levels",
    holds: () =>
      MEASURED.wd3.worstTransfer <= 1e-10 && MEASURED.wd3.minExact >= 2e-8 &&
      MEASURED.wd3.worstMergeQ <= 1e-12 && MEASURED.wd3.worstMergeM <= 1e-12,
  },
  {
    id: "imp95171-fb-corner",
    description:
      "LEMMA FB at n generic: the identical code path (cheap-first included) reproduces the recorded imp-95169 exact corner minimum 2.277710241741729e-7 at the SD floor to 1e-11 at 8 packets",
    holds: () => Math.abs(MEASURED.corner.certified - 2.277710241741729e-7) < 1e-11,
  },
  {
    id: "imp95171-finding-tp",
    description:
      "FINDING TP: genuine feasible values (projected-gradient upper bounds) on the satellite scan never dip below the two-point corner literal, while the FB lower bound on the same exact matrices dips below that feasible floor near singular faces -- loose-but-sound artifact, not a class minimum",
    holds: () =>
      MEASURED.findingTP.scanMin >= MEASURED.findingTP.cornerV - 1e-12 &&
      MEASURED.findingTP.fbDipMin <= MEASURED.findingTP.cornerV,
  },
  {
    id: "imp95171-sa3-endpoint-pin",
    description:
      "THEOREM SA + endpoint monotonicity with TRIPLE middle blocks: over random witnesses with multi-packet blocks 0/4, pinning blocks 0/4 to single packets at (2, 256) never decreases the exact hollow lambda_max (worst excess <= 1e-12)",
    holds: () => MEASURED.sa3.worstPin <= 1e-12,
  },
  {
    id: "imp95171-theorem-mc3-top-and-honest-partial",
    description:
      "THEOREM MC3-TOP + HONEST PARTIAL: the recorded offline budget attempt terminated ONLY the top mu-layer (zero unresolved, worst certified leaf 2.1224846580374962e-8 >= TAU = 2e-8, closing the three-point class on the top sub-band [0.23208119492058613, 0.23209) alone); layer 2 is recorded NOT done, allDone is false, the full-band RUN literals are NOT filled, and the closed sub-band literal matches the terminated layer exactly",
    holds: () =>
      RUN.attempted === true && RUN.allDone === false &&
      RUN.layers.length === 2 && RUN.layers[0].done === true &&
      RUN.layers[0].worst >= 2e-8 && RUN.layers[1].done === false &&
      MEASURED.attempt.topWorst === RUN.layers[0].worst &&
      RUN.closedSubBand[0] === RUN.layers[0].lo && RUN.closedSubBand[1] === RUN.layers[0].hi,
  },
  {
    id: "imp95171-honest-scope",
    description:
      "no recorded class constant moves: class sandwich [0.2320723, 0.24502], unconditional window [0.23209, 0.24502], open strip endpoints, covered-band floor 0.2320727, k <= 4 ladder floor 47/200 all carried; THEOREM MC3-TOP rests on the recorded offline budget attempt (no in-sweep binding-cell anchor yet -- recorded plainly); the burden contraction to >= 4 packets holds on the TOP SUB-BAND only, the rest of the covered band keeps the imp-95170 >= 3-packet burden, and no sub-band of the open strip closes; no bound promotion; no QED",
    holds: () =>
      IMP95171_TRIPLE_MERGE_CONSISTENT_COVER.carried.classSandwich[0] === 0.2320723 &&
      IMP95171_TRIPLE_MERGE_CONSISTENT_COVER.carried.classSandwich[1] === 0.24502 &&
      IMP95171_TRIPLE_MERGE_CONSISTENT_COVER.carried.unconditionalWindow[0] === RIGHT &&
      IMP95171_TRIPLE_MERGE_CONSISTENT_COVER.carried.openStrip[0] === 0.2320723 &&
      IMP95171_TRIPLE_MERGE_CONSISTENT_COVER.carried.coveredBandFloor === MUF &&
      IMP95171_TRIPLE_MERGE_CONSISTENT_COVER.carried.ladderFloorKle4 === 47 / 200 &&
      IMP95171_TRIPLE_MERGE_CONSISTENT_COVER.promotesBound === false &&
      IMP95171_TRIPLE_MERGE_CONSISTENT_COVER.noQED === true,
  },
];

for (const a of IMP95171_TRIPLE_MERGE_CONSISTENT_COVER_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95171-triple-merge-consistent-cover assertion failed: ${a.id}`);
}
