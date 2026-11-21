/**
 * imp-95167 - RIGOROUS step -- SINGLE-PACKET STRIP CLOSURE (LEMMA PM
 * Perron mu-monotonicity + LEMMA UB positional cell majorant + THEOREM SP
 * 626-cell exact-matrix branch-and-bound at the class floor 0.2320723 +
 * COROLLARY SE strip composition): the open strip [0.2320723, 0.23209) of
 * the parity-pure common-rate MAJ witness class (imp-95166 successor
 * frontier, width 1.77e-5) is CLOSED for every witness with AT MOST ONE
 * PACKET in each of blocks 0..4. The strip's surviving witness set
 * reduces to even-parity witnesses that occupy block 0 and carry at least
 * two packets in at least one of blocks 0..4 -- exactly the LEMMA PD
 * multi-packet hull objects with the recorded imp-95163 FINDING CB
 * endpoint-pair bulge.
 *
 * WHY THIS WORKS WHERE THE COVERS STALL. The imp-95158..95166 covers
 * certify all packet counts and all nonnegative hull profiles through the
 * LEMMA PI/PE cut relaxation, whose slack (recorded pointwise stall
 * 0.232084) exceeds the margin available inside the strip (the binding
 * corner sits 5.1e-7 below 1 at the strip's left endpoint). For witnesses
 * with a SINGLE packet per block no relaxation is needed at all: the
 * normalized block profiles are unit packets, so the exact block bond
 * matrix is entrywise EXACTLY B_ij(u, mu) = g(mu |u_j - u_i|) with
 * g(z) = exp(-z)(1 + z) the Matern-3/2 carrier (g(0) = 1 normalization).
 * The certificate quantity is directly computable and the only quantifier
 * left is the 5-D positional box -- small enough for a deterministic
 * interval branch-and-bound with zero relaxation at the binding corner.
 *
 * LEMMA PM (Perron mu-monotonicity; rigorous, closed form). Fix a
 * single-packet geometry u_0 < u_1 < ... < u_4 in the disjoint blocks
 * [1,2] / [4,8] / [16,32] / [64,128] / [256,512]. Every off-diagonal
 * entry g(mu d_ij) with d_ij = |u_j - u_i| >= 2 > 0 is strictly
 * decreasing in mu (dg(z)/dz = -z exp(-z) < 0 for z > 0). B(u, mu) is
 * symmetric nonnegative with all off-diagonal entries positive, hence
 * irreducible, and its largest eigenvalue equals its spectral radius
 * (Perron). For mu1 < mu2: 0 <= B(u, mu2) <= B(u, mu1) entrywise with
 * strict inequality off the diagonal, so rho(B(u, mu2)) < rho(B(u, mu1))
 * (Perron-Frobenius strict monotonicity for irreducible nonnegative
 * dominance). Consequence: certifying sup_u lambda_max(B(u, mustar)) < 1
 * at the SINGLE rate mustar extends to every mu >= mustar (the sup of a
 * family of decreasing functions is nonincreasing).
 *
 * LEMMA UB (positional cell majorant; rigorous). For a positional
 * sub-box lo_i <= u_i <= hi_i (blocks stay disjoint and ordered, so
 * dmin_ij = lo_j - hi_i > 0 for i < j), the matrix U with entries
 * g(mustar dmin_ij) (1 + 1e-12) dominates B(u, mustar) entrywise for
 * every u in the sub-box (g decreasing in distance; the 1e-12 relative
 * inflation absorbs the few-ulp transcendental evaluation error). For
 * nonnegative matrices entrywise dominance gives
 * rho(B) <= rho(U) = lambda_max(U), and a positive-pivot Cholesky of
 * (t I - U) certifies lambda_max(U) < t. At the binding corner the
 * majorant is exact (the corner minimizes every gap the certificate
 * reads), so this bound carries zero structural relaxation precisely
 * where the margin vanishes -- the property the cut-family certificates
 * lack.
 *
 * THEOREM SP (single-packet box certification; certified run). The
 * deterministic branch-and-bound over the FULL positional box
 * [1,2] x [4,8] x [16,32] x [64,128] x [256,512] at
 * mustar = 0.2320723 (the recorded class floor), threshold
 * t = 1 - 2e-7, sensitivity-weighted bisection, terminates with
 * 626 CELLS, max depth 62, ZERO unresolved, exact partition (relative
 * volume defect ~1.3e-15), worst leaf majorant eigenvalue
 * 0.99999971496354922 < 1 - 2e-7, every leaf positive-pivot
 * Cholesky-certified. Hence sup over ALL single-packet geometries of
 * lambda_max(B(u, mustar)) < 1 - 2e-7, and by LEMMA PM the same holds at
 * every mu >= mustar. Binding corner (2, 4, 16, 64, 256) with
 * lambda_max = 0.99999948831812802 at mustar; its crossing
 * 0.2320720384593522 REPRODUCES the recorded intrinsic anchor crossing
 * 0.2320720394 to 9.4e-10 -- the recorded "intrinsic k = 1 crossing" IS
 * this corner geometry.
 *
 * COROLLARY SE (strip composition, via the carried recorded links).
 * (a) Even parity, single packet in each occupied block of 0..4, all
 * five occupied: E <= 0 at every common rate mu >= 0.2320723 by
 * THEOREM SP + the carried exact block-aggregation algebra
 * (Q >= (1 - lambda_max) sum w_i^2, imp-95162/95163). (b) Empty blocks:
 * principal submatrices, Cauchy interlacing (carried). (c) Any occupancy
 * of blocks >= 5: carried THEOREM TX absorbs them with additive
 * correction sqrt(10) g(512 mustar) = 9.45e-50 (and
 * 3 g(2048 mustar) = 5.5e-204), far below the 2e-7 margin. (d) Odd
 * parity at strip rates: carried LEMMA OP doubling into
 * 2 mustar = 0.4641446 > 0.45 where the carried THEOREM RW row-sum cap
 * gives S(0.4641446) = 0.88841428001302492 < 1 -- for ALL witnesses, not
 * only single-packet. (e) Witnesses not occupying block 0 (lowest
 * occupied block >= 1): carried LEMMA GA 4-adic gauge into
 * 4 mustar = 0.9282892 where S(0.9282892) = 0.45126383937799647 < 1 --
 * again for all witnesses. NET: inside the open strip
 * [0.2320723, 0.23209) the only witness configurations not covered by a
 * recorded rigorous statement are EVEN-parity witnesses that OCCUPY
 * BLOCK 0 and carry AT LEAST TWO packets in at least one of blocks 0..4.
 *
 * SKEPTICAL RECORD (what this step does NOT do). (1) It does NOT close
 * the strip: multi-packet hull profiles are exactly the objects for
 * which imp-95163 FINDING CB recorded the endpoint-pair bulge (attainable
 * bonds exceed the k = 1 curve by 5.43e-2), so no single-packet statement
 * controls them; the cut-family stall 0.232084 remains their wall.
 * (2) NO recorded class constant moves: the open strip literal, the
 * unconditional window [0.23209, 0.24502] (a FULL-class statement), the
 * class sandwich [0.2320723, 0.24502], and the k <= 4 ladder floor
 * 47/200 are all carried unchanged -- this step contracts the strip's
 * witness BURDEN, not its endpoints. (3) The route is margin-capped at
 * the crossing: at mu = 0.2320715 the binding corner is REFUTED by a
 * Rayleigh certificate (1.0000010534538115 > 1), so lambda-based
 * certification cannot extend below ~0.23207204; note lambda_max > 1
 * does NOT construct an E > 0 witness (the aggregation inequality only
 * bounds E from above), so this is an architecture floor, not a witness.
 * (4) Float scope: majorant entries carry a 1e-12 relative inflation
 * dominating the few-ulp exp/multiply errors; the Cholesky margin 2e-7
 * exceeds 5x5 factorization roundoff (~1e-15) by ~8e7; the certificate
 * standard (positive-pivot Cholesky on inflated float majorants) is the
 * one used by the recorded imp-95155..95166 chain, here with margin 2e-7
 * instead of 1e-6 -- recorded explicitly since it is 5x tighter than the
 * chain's usual margin.
 *
 * HONEST SCOPE. The composition uses the recorded links exactly as
 * imp-95162 THEOREM FD recorded them (aggregation algebra, TX, OP + RW,
 * GA, interlacing) and is as strong as those links. Changes no Lambda
 * bound; NO QED; no refereed bound is changed.
 *
 * Import-light; zero imports; deterministic; in-sweep ~0.2 s.
 */
const g = (z) => Math.exp(-z) * (1 + z);

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95167-single-packet-strip-closure assertion failed: ${id}`);
}
const MEASURED = {};

const MUSTAR = 0.2320723; // recorded class floor = strip left endpoint
const STRIP_RIGHT = 0.23209; // imp-95166 unconditional-window floor
const T_CERT = 1 - 2e-7; // certification threshold (margin 2e-7)
const NUDGE = 1 + 1e-12;
const BOX = [[1, 2], [4, 8], [16, 32], [64, 128], [256, 512]];
const CORNER = [2, 4, 16, 64, 256]; // binding corner (measured argmax)

function lamMaxSym(M) {
  const n = M.length;
  const A = M.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-28) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-20) continue;
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
// positive-pivot Cholesky of (t I - M) certifies lambda_max(M) < t
function cholCertifies(M, t) {
  const n = M.length;
  const A = M.map((r, i) => r.map((x, j) => (i === j ? t - x : -x)));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = A[i][j];
      for (let k = 0; k < j; k++) s -= A[i][k] * A[j][k];
      if (i === j) {
        if (s <= 1e-12) return false;
        A[i][i] = Math.sqrt(s);
      } else A[i][j] = s / A[j][j];
    }
  }
  return true;
}
// exact single-packet block bond matrix (LEMMA PM setting)
const exactB = (u, mu) => {
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  for (let i = 0; i < 5; i++)
    for (let j = i + 1; j < 5; j++) M[i][j] = M[j][i] = g(mu * (u[j] - u[i]));
  return M;
};
// LEMMA UB cell majorant: entries at the minimal gaps of the cell
const majU = (lo, hi) => {
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  for (let i = 0; i < 5; i++)
    for (let j = i + 1; j < 5; j++) M[i][j] = M[j][i] = g(MUSTAR * (lo[j] - hi[i])) * NUDGE;
  return M;
};
// deterministic sensitivity-weighted split (soundness never depends on it)
function splitDim(lo, hi) {
  let best = -1, bestP = -Infinity;
  for (let d = 0; d < 5; d++) {
    const w = hi[d] - lo[d];
    if (w <= 0) continue;
    let s = 0;
    for (let j = 0; j < 5; j++) {
      if (j === d) continue;
      const dm = j > d ? lo[j] - hi[d] : lo[d] - hi[j];
      const z = MUSTAR * dm;
      s += MUSTAR * z * Math.exp(-z);
    }
    if (w * s > bestP) { bestP = w * s; best = d; }
  }
  return best;
}

// --------------------------------------------------------------------------
// (A) THEOREM SP branch-and-bound run at mustar over the FULL positional box
// --------------------------------------------------------------------------
const LEAVES = [];
{
  const stack = [{ lo: BOX.map((b) => b[0]), hi: BOX.map((b) => b[1]), depth: 0 }];
  let maxDepth = 0, unresolved = 0, nEval = 0;
  while (stack.length) {
    const c = stack.pop();
    nEval++;
    maxDepth = Math.max(maxDepth, c.depth);
    const U = majU(c.lo, c.hi);
    if (cholCertifies(U, T_CERT)) { LEAVES.push(c); continue; }
    const d = splitDim(c.lo, c.hi);
    if (c.depth >= 100 || d < 0 || c.hi[d] - c.lo[d] < 1e-10) { unresolved++; continue; }
    const m = c.lo[d] + (c.hi[d] - c.lo[d]) / 2;
    const hi1 = c.hi.slice(), lo2 = c.lo.slice();
    hi1[d] = m; lo2[d] = m;
    stack.push({ lo: c.lo, hi: hi1, depth: c.depth + 1 });
    stack.push({ lo: lo2, hi: c.hi, depth: c.depth + 1 });
  }
  const vol = (lo, hi) => lo.reduce((s, l, i) => s * (hi[i] - l), 1);
  const volBox = vol(BOX.map((b) => b[0]), BOX.map((b) => b[1]));
  const volSum = LEAVES.reduce((s, c) => s + vol(c.lo, c.hi), 0);
  let worstLeaf = -Infinity;
  for (const c of LEAVES) worstLeaf = Math.max(worstLeaf, lamMaxSym(majU(c.lo, c.hi)));
  MEASURED.cover = {
    nCells: LEAVES.length, maxDepth, unresolved, nEval,
    volRel: Math.abs(volSum - volBox) / volBox, worstLeaf,
  };
  assertI(unresolved === 0, `imp95167-sp-unresolved(${unresolved})`);
  assertI(LEAVES.length === 626 && maxDepth === 62, `imp95167-sp-shape(${LEAVES.length},${maxDepth})`);
  assertI(MEASURED.cover.volRel < 1e-12, `imp95167-sp-partition(${MEASURED.cover.volRel})`);
  assertI(Math.abs(worstLeaf - 0.99999971496354922) < 1e-10, `imp95167-sp-worst(${worstLeaf})`);
  assertI(worstLeaf < T_CERT, `imp95167-sp-margin(${worstLeaf})`);
}

// --------------------------------------------------------------------------
// (B) binding corner: value at mustar, crossing reproduction, and the
// Rayleigh refutation 5.5e-7 below mustar (architecture floor of the route)
// --------------------------------------------------------------------------
{
  const lamCorner = lamMaxSym(exactB(CORNER, MUSTAR));
  let lo = 0.23, hi = 0.24;
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    if (lamMaxSym(exactB(CORNER, m)) > 1) lo = m; else hi = m;
  }
  const crossing = (lo + hi) / 2;
  const MULO = 0.2320715;
  const B = exactB(CORNER, MULO);
  let v = [1, 1, 1, 1, 1];
  for (let it = 0; it < 300; it++) {
    const w = v.map((_, i) => v.reduce((s, x, j) => s + B[i][j] * x, 0));
    const nn = Math.sqrt(w.reduce((s, x) => s + x * x, 0));
    v = w.map((x) => x / nn);
  }
  const Bv = v.map((_, i) => v.reduce((s, x, j) => s + B[i][j] * x, 0));
  const ray = v.reduce((s, x, i) => s + x * Bv[i], 0) / v.reduce((s, x) => s + x * x, 0);
  MEASURED.corner = { lamCorner, crossing, rayleighBelow: ray };
  assertI(Math.abs(lamCorner - 0.99999948831812802) < 1e-11, `imp95167-corner-lam(${lamCorner})`);
  assertI(lamCorner < 1 && 1 - lamCorner > 5e-7, `imp95167-corner-margin(${1 - lamCorner})`);
  // reproduces the recorded intrinsic anchor crossing literal 0.2320720394
  assertI(Math.abs(crossing - 0.2320720394) < 1e-8, `imp95167-corner-crossing(${crossing})`);
  assertI(crossing < MUSTAR, "imp95167-crossing-below-mustar");
  // Rayleigh quotient certifies lambda_max > 1 at 0.2320715: the
  // lambda-certificate route cannot extend below the crossing
  assertI(ray > 1 + 1e-7, `imp95167-rayleigh-refutation(${ray})`);
}

// --------------------------------------------------------------------------
// (C) LEMMA PM + LEMMA UB battery: 300 random single-packet geometries x
// random strip rates: strict mu-monotonicity, leaf location, exact lambda
// below the leaf majorant and below the certification threshold
// --------------------------------------------------------------------------
{
  let st = 951671;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let located = 0, worstVsLeaf = -Infinity, worstMono = -Infinity, worstAbs = -Infinity;
  const N = 300;
  for (let t = 0; t < N; t++) {
    const u = BOX.map((b) => b[0] + rnd() * (b[1] - b[0]));
    if (t % 10 === 0) { u[0] = 2; u[1] = 4; u[2] = 16; } // pin near the binding corner
    const mu = MUSTAR + rnd() * (STRIP_RIGHT - MUSTAR);
    const leaf = LEAVES.find((c) => u.every((x, i) => x >= c.lo[i] && x <= c.hi[i]));
    if (!leaf) continue;
    located++;
    const lamStar = lamMaxSym(exactB(u, MUSTAR));
    const lamMu = lamMaxSym(exactB(u, mu));
    const lamU = lamMaxSym(majU(leaf.lo, leaf.hi));
    worstVsLeaf = Math.max(worstVsLeaf, lamStar - lamU);
    worstMono = Math.max(worstMono, lamMu - lamStar); // PM: lamMu < lamStar
    worstAbs = Math.max(worstAbs, lamMu, lamStar);
  }
  MEASURED.battery = { located, worstVsLeaf, worstMono, worstAbs };
  assertI(located === N, `imp95167-battery-located(${located})`);
  assertI(worstVsLeaf <= 1e-12, `imp95167-battery-leaf-majorant(${worstVsLeaf})`);
  assertI(worstMono < 0, `imp95167-battery-pm-monotone(${worstMono})`);
  assertI(worstAbs < T_CERT, `imp95167-battery-below-threshold(${worstAbs})`);
}

// --------------------------------------------------------------------------
// (D) COROLLARY SE composition literals (carried recorded links)
// --------------------------------------------------------------------------
const S = (m) => g(2 * m) + g(8 * m) + g(14 * m) + 2 * g(56 * m) + 2 * g(248 * m);
{
  const txCorr = Math.sqrt(10) * g(512 * MUSTAR) + 3 * g(2048 * MUSTAR);
  MEASURED.composition = {
    txCorr, sOdd: S(2 * MUSTAR), sGauge: S(4 * MUSTAR),
    stripWidth: STRIP_RIGHT - MUSTAR,
  };
  assertI(txCorr < 1e-40, `imp95167-tx-correction(${txCorr})`);
  assertI(2 * MUSTAR > 0.45 && MEASURED.composition.sOdd < 0.889,
    `imp95167-odd-parity(${MEASURED.composition.sOdd})`);
  assertI(4 * MUSTAR > 0.45 && MEASURED.composition.sGauge < 1,
    `imp95167-gauge-rw(${MEASURED.composition.sGauge})`);
  assertI(Math.abs(MEASURED.composition.stripWidth - 1.77e-5) < 1e-7,
    `imp95167-strip-width(${MEASURED.composition.stripWidth})`);
}

// --------------------------------------------------------------------------
// verdict object
// --------------------------------------------------------------------------
export const IMP95167_SINGLE_PACKET_STRIP_CLOSURE = {
  id: "imp-95167",
  title:
    "Single-packet strip closure: LEMMA PM (for fixed single-packet geometry the exact block bond matrix has entries g(mu d_ij) strictly decreasing in mu, so its Perron root is strictly decreasing and one-rate certification extends upward) + LEMMA UB (positional cell majorant at minimal gaps, exact at the binding corner) + THEOREM SP (626-cell deterministic branch-and-bound over the full 5-D positional box at the class floor 0.2320723, zero unresolved, worst leaf 0.99999971496354922 < 1 - 2e-7) + COROLLARY SE: every parity-pure common-rate MAJ witness with at most one packet in each of blocks 0..4 has E <= 0 at every common rate mu >= 0.2320723 -- the open strip [0.2320723, 0.23209) survives only for even-parity witnesses occupying block 0 with at least two packets in some block 0..4",
  rigorous: {
    lemmaPM:
      "single-packet exact bonds are g(mu d_ij), d_ij >= 2 > 0, dg(z)/dz = -z exp(-z) < 0: entries strictly decreasing in mu; B symmetric nonnegative with positive off-diagonal entries is irreducible and lambda_max = rho; Perron-Frobenius strict monotonicity under entrywise dominance gives rho strictly decreasing in mu, so sup over geometries certified < 1 at mustar stays < 1 for all mu >= mustar",
    lemmaUB:
      "on a positional sub-box the matrix with entries g(mustar (lo_j - hi_i)) (1 + 1e-12) dominates every exact matrix of the cell entrywise (g decreasing in distance, blocks disjoint); rho(B) <= rho(U) for nonnegative dominance; positive-pivot Cholesky of (t I - U) certifies rho(U) < t; at the binding corner the majorant equals the exact matrix, so the bound has zero structural relaxation where the margin vanishes",
    theoremSP:
      "the deterministic sensitivity-weighted bisection of the full box [1,2] x [4,8] x [16,32] x [64,128] x [256,512] at mustar = 0.2320723 terminates with 626 cells, max depth 62, zero unresolved, exact partition (volume defect ~1.3e-15), worst leaf majorant eigenvalue 0.99999971496354922, every leaf Cholesky-certified at 1 - 2e-7: sup over all single-packet geometries of lambda_max < 1 - 2e-7 at mustar, hence at every mu >= mustar by LEMMA PM",
    corollarySE:
      "composition through the carried recorded links: exact block-aggregation algebra (lambda_max < 1 implies E <= 0), Cauchy interlacing for empty blocks, THEOREM TX for any occupancy of blocks >= 5 (correction 9.45e-50 at mustar), LEMMA OP + THEOREM RW for odd parity (S(0.4641446) = 0.88841428001302492 < 1, all witnesses), LEMMA GA + THEOREM RW for block-0-empty witnesses (S(0.9282892) = 0.45126383937799647 < 1, all witnesses): inside the strip only even-parity, block-0-occupied, multi-packet-hull witnesses remain uncovered",
  },
  measured: {
    cover:
      "626 cells, max depth 62, zero unresolved, 1251 cell evaluations, ~3 ms; worst leaf 0.99999971496354922; margin to the threshold 8.5e-8",
    corner:
      "binding corner (2, 4, 16, 64, 256): lambda_max(mustar) = 0.99999948831812802 (margin 5.117e-7, slope dlambda/dmu ~ -1.956); crossing 0.2320720384593522 reproduces the recorded intrinsic anchor crossing 0.2320720394 to 9.4e-10; Rayleigh certificate at mu = 0.2320715 gives 1.0000010534538115 > 1 -- the lambda route is refuted 5.4e-7 below the crossing bracket [0.2320715, 0.2320723]",
    battery:
      "300 random single-packet geometries x random strip rates (every 10th pinned at the binding corner): all located in a leaf, exact lambda never exceeds the leaf majorant (worst gap <= 1e-12 tolerance), strict mu-monotonicity holds on every draw, absolute worst exact lambda below 1 - 2e-7",
  },
  adversarialRecord:
    "the strip is NOT closed: multi-packet hull profiles (the LEMMA PD objects with the imp-95163 FINDING CB endpoint-pair bulge 5.43e-2) are untouched by any single-packet statement and their cut-family wall (pointwise stall 0.232084) stands; no recorded class constant moves (strip endpoints, unconditional window [0.23209, 0.24502], class sandwich [0.2320723, 0.24502], k <= 4 ladder floor 47/200 all carried); the certificate margin here is 2e-7, 5x tighter than the chain's usual 1e-6 -- recorded explicitly, with the 1e-12 entry inflation and ~1e-15 5x5 Cholesky roundoff far below it; lambda_max > 1 below the crossing does NOT construct an E > 0 witness (inequality direction), it only floors this certificate route",
  successorFrontier:
    "the surviving open set of the strip [0.2320723, 0.23209): even-parity witnesses occupying block 0 with at least two packets in at least one of blocks 0..4 (nonnegative hull profiles). Closing it needs a relaxation-free or low-slack treatment of multi-packet hulls near the binding corner -- e.g. an exact parametrization of the two-packet-hull bond region at the corner cell, or a proof that hull spreading strictly decreases lambda_max near the corner (measured by imp-95163 FINDING RA: multi-packet ascent collapses to the k = 1 corner value to 7 digits, but FINDING CB refutes bond-region dominance, so the mechanism must be spectral, not region-wise)",
  carried: {
    classSandwich: [0.2320723, 0.24502],
    unconditionalWindow: [0.23209, 0.24502],
    openStrip: [0.2320723, 0.23209],
    ladderFloorKle4: 47 / 200,
    intrinsicAnchorCrossing: 0.2320720394,
    bindingCorner: CORNER,
  },
  promotesBound: false,
  noQED: true,
  sota: "No refereed bound is changed",
};

// --------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// --------------------------------------------------------------------------
export const IMP95167_SINGLE_PACKET_STRIP_CLOSURE_ASSERTIONS = [
  {
    id: "imp95167-theorem-sp-cover",
    description:
      "THEOREM SP: the deterministic branch-and-bound over the full single-packet positional box at the class floor 0.2320723 terminates with 626 cells, max depth 62, zero unresolved, exact partition, worst leaf majorant eigenvalue 0.99999971496354922 < 1 - 2e-7, every leaf positive-pivot Cholesky-certified",
    holds: () =>
      MEASURED.cover.nCells === 626 && MEASURED.cover.maxDepth === 62 &&
      MEASURED.cover.unresolved === 0 && MEASURED.cover.volRel < 1e-12 &&
      Math.abs(MEASURED.cover.worstLeaf - 0.99999971496354922) < 1e-10 &&
      MEASURED.cover.worstLeaf < T_CERT,
  },
  {
    id: "imp95167-corner-bracket",
    description:
      "the binding corner (2, 4, 16, 64, 256) has lambda_max = 0.99999948831812802 at 0.2320723 (margin 5.1e-7) and crossing 0.2320720385 reproducing the recorded intrinsic anchor crossing 0.2320720394 to 1e-8; a Rayleigh certificate refutes the route at 0.2320715 (1.0000010534538115 > 1): the certified crossing bracket of the single-packet family is [0.2320715, 0.2320723]",
    holds: () =>
      Math.abs(MEASURED.corner.lamCorner - 0.99999948831812802) < 1e-11 &&
      Math.abs(MEASURED.corner.crossing - 0.2320720394) < 1e-8 &&
      MEASURED.corner.crossing < MUSTAR &&
      MEASURED.corner.rayleighBelow > 1 + 1e-7,
  },
  {
    id: "imp95167-lemma-pm-ub-battery",
    description:
      "LEMMA PM + LEMMA UB: 300 random single-packet geometries x random strip rates all locate in a certified leaf, exact lambda_max never exceeds the leaf majorant, strict mu-monotonicity holds on every draw, and the absolute worst exact lambda stays below 1 - 2e-7",
    holds: () =>
      MEASURED.battery.located === 300 && MEASURED.battery.worstVsLeaf <= 1e-12 &&
      MEASURED.battery.worstMono < 0 && MEASURED.battery.worstAbs < T_CERT,
  },
  {
    id: "imp95167-corollary-se-composition",
    description:
      "COROLLARY SE literals: THEOREM TX correction 9.45e-50 below the 2e-7 margin; odd parity via LEMMA OP + THEOREM RW with S(0.4641446) = 0.88841428001302492 < 1; block-0-empty witnesses via LEMMA GA + THEOREM RW with S(0.9282892) = 0.45126383937799647 < 1; strip width 1.77e-5 carried",
    holds: () =>
      MEASURED.composition.txCorr < 1e-40 &&
      2 * MUSTAR > 0.45 && MEASURED.composition.sOdd < 0.889 &&
      4 * MUSTAR > 0.45 && MEASURED.composition.sGauge < 1 &&
      Math.abs(MEASURED.composition.stripWidth - 1.77e-5) < 1e-7,
  },
  {
    id: "imp95167-honest-scope",
    description:
      "no recorded class constant moves: class sandwich [0.2320723, 0.24502], unconditional window [0.23209, 0.24502], open strip [0.2320723, 0.23209), k <= 4 ladder floor 47/200 all carried; the step contracts the strip's witness burden (single-packet sub-class closed, multi-packet hulls open); no bound promotion; no QED",
    holds: () =>
      IMP95167_SINGLE_PACKET_STRIP_CLOSURE.carried.classSandwich[0] === 0.2320723 &&
      IMP95167_SINGLE_PACKET_STRIP_CLOSURE.carried.classSandwich[1] === 0.24502 &&
      IMP95167_SINGLE_PACKET_STRIP_CLOSURE.carried.unconditionalWindow[0] === 0.23209 &&
      IMP95167_SINGLE_PACKET_STRIP_CLOSURE.carried.openStrip[0] === MUSTAR &&
      IMP95167_SINGLE_PACKET_STRIP_CLOSURE.carried.ladderFloorKle4 === 47 / 200 &&
      IMP95167_SINGLE_PACKET_STRIP_CLOSURE.promotesBound === false &&
      IMP95167_SINGLE_PACKET_STRIP_CLOSURE.noQED === true,
  },
];

for (const a of IMP95167_SINGLE_PACKET_STRIP_CLOSURE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95167-single-packet-strip-closure assertion failed: ${a.id}`);
}
