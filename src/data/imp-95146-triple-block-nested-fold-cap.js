/**
 * imp-95146 - THEOREM TP (triple-block nested-fold cap, certified
 * common-rate threshold 47/200 = 0.235): every parity-pure MAJ witness
 * at ONE COMMON rate mu >= 47/200 with AT MOST THREE packets in ONE
 * block and at most ONE packet in every other block (any finite
 * same-parity block set, positions FREE inside their dyadic blocks,
 * nonnegative amplitudes) has E <= 0.
 *
 * WHAT THIS ADDS OVER THEOREM PO (imp-95145). PO capped occupancy at
 * TWO packets per block; the k >= 3 channel of
 * imp-95144-subgap-k-packet-ladder was covered by NO ceiling below the
 * full-class THEOREM HS constant 12251/50000 = 0.24502. This module
 * opens the k = 3 rung: the one-heavy-block (up to three packets)
 * subclass is capped at the SAME constant 47/200 as PO. Combined with
 * THEOREM DW (imp-95143 - the DW witness has one doubled block, hence
 * IS in this class), the common-rate one-heavy-block (<= 3) subclass
 * threshold is certified inside
 *   [2320723/10000000, 47/200) = [0.2320723, 0.235).
 * STRUCTURAL CONSEQUENCE (jointly with THEOREM PO at the same
 * constant): any full-class parity-pure witness with E > 0 at a common
 * rate >= 47/200 must place at least FOUR packets in one block, or at
 * least THREE packets in one block AND at least TWO in another.
 * Previously the consequence stopped at "at least three in one block".
 *
 * THEOREM TP. Class: packets at positions u_i in [2^{b_i}, 2^{b_i+1}),
 * all b_i of one parity, ONE block index carrying up to three packets,
 * every other block index at most once; amplitudes a_i >= 0; ONE COMMON
 * rate mu >= 47/200. Claim:
 * E = -sum a_i^2/mu + 2 sum_{i<j} s_ij a_i a_j K(mu, mu, |u_i - u_j|)
 * <= 0, s_ij = -1 for same-block pairs, +1 across blocks (the sibling
 * MAJ sign convention carried from imp-95130..95145).
 *
 * PROOF CHAIN (new lemmas elementary; everything else carried verbatim
 * from THEOREMS FP/DP/PO, imp-95142/95144/95145):
 * (1) NEW LEMMA EPN (nested effective-packet folding). A block with
 *     three packets folds EXACTLY by two applications of the carried
 *     Lemma EP identity: first the pair (2,3) folds into an inner
 *     effective packet (inner arc yI = packet-3 weight inside the
 *     pair), then packet 1 folds against it (outer effective pair).
 *     The outer pair has UNIT direction (x, y~) with
 *     y~ = yO D23 / sqrt(w1^2 + yO^2 D23^2), D23^2 = 1 + 2 w2h w3h
 *     rho23, and correlation rho1E = (w2h rho12 + w3h rho13)/D23; the
 *     block bond and norm are IDENTICALLY the 2-packet forms in these
 *     variables (regrouping of the quadratic form - verified as an
 *     identity by the battery below). Hence the carried 2-packet arc
 *     machinery (Lemma AY subcone cap, Lemma MC merge cap) applies at
 *     BOTH levels with only TWO arc axes (yO, yI) per tripled block.
 * (2) NEW LEMMA OF (folded outer floor). At a common rate the outer
 *     correlation has the cell floor
 *     rho1E >= max( min(G12, G13),
 *                   (w2hLo G12 + yIa G13) / D23hi ),
 *     with G12, G13, G23 the carried gLo floors at maximal in-cell
 *     separations and D23hi the inner-denominator cap built from the
 *     gcap of the MINIMAL (2,3) separation. Cell-exact in the fine
 *     limit. Without it the outer floor min(G12, G13) leaves an
 *     IRREDUCIBLE gap (recorded: true rho1E 0.852 vs floor 0.757 at
 *     the spread triple 4/6/8, true 0.705 vs floor 0.111 at the
 *     (1,2)-coincident L2 ridge) and the covers hit the depth cap with
 *     millions of unresolved cells.
 * (3) NEW LEMMA KC (k-cone cap - the k-dimensional cone version of
 *     Lemma AY named by imp-95144-subgap-k-packet-ladder). For caps
 *     A_i >= 0 and the equicorrelated intra floor G, the cone sup
 *     sup over w >= 0 of (A.w) / sqrt(w.((1-G)I + GJ).w)
 *     equals the max over PRIMAL-FEASIBLE supports S of
 *     sqrt(A_S.(G_S)^{-1}.A_S) (KKT on each support; every feasible
 *     support value is attained in the cone, and the maximizer has a
 *     feasible support). Closed forms: singletons A_i; pairs the
 *     carried Lemma AY full-arc form (A^2 + B^2 - 2ABG)/(1 - G^2);
 *     the triple via the equicorrelated inverse. Equal caps give
 *     Amax sqrt(k/(1 + (k-1)G)) - the k-generalization of the Lemma MC
 *     full-arc factor: -> 1 at G -> 1, sqrt(k) at G = 0. CONSEQUENCE:
 *     the tail-bond divergence that eliminated the k-uniform 1/sqrt(G)
 *     route in imp-95145 is CURED at fixed k - the inflated (b, b+1)
 *     entry is <= k gcap(2 mu 4^b), bounded and decaying (the KC
 *     factor never divides by a vanishing floor: 1 + (k-1)G >= 1).
 * (4) RATE-RESOLVED 8-D COVERS L0/L1/L2 (tripled block = 0/1/2):
 *     axes = three tripled positions x two single head positions x
 *     two arcs (yO, yI) x common rate mu in [47/200, 9/10]; positive
 *     caps at the mu-cell LOWER corner, floors at the UPPER corner
 *     (the carried sign convention); per-cell entries are entrywise
 *     minima of (a) nested aySup through the LEMMA EPN arc cells with
 *     the LEMMA OF outer floor, (b) the nested Lemma MC product cap,
 *     (c) the LEMMA KC position-uniform cap; warm-started
 *     Collatz-Wielandt, ZERO unresolved cells required and achieved:
 *     L0 3671 cells, L1 2476992 cells (deepest 63), L2 25586 cells.
 *     Rows 3/4 carry a crude sqrt(3) inflation and entry (3,4) the
 *     factor 3, so the case tripled-block-in-{3,4} (heads all single)
 *     is dominated by every cover; single/doubled heavy blocks and
 *     empty blocks are arc-boundary slices and occupied subsets of the
 *     same certificate (carried subset domination).
 * (5) NEW LEMMA RM-TP (high-rate closure). In this class every block
 *     pair has at most one tripled side, so every off-diagonal entry
 *     is <= sqrt(3) gcap(mu t) at its facing gap t penalty-free; at
 *     mu = 9/10 the 5x5 matrix certifies (bound 0.8038 < 1) and g
 *     decreasing dominates every rate >= 9/10 by ONE check.
 * (6) LEMMA OD2 (carried): odd parity = even frame at exactly 2 mu;
 *     2 x 47/200 = 0.47 lies inside the covered interval [0.235, 0.9];
 *     rates above 0.45 map into the cover + RM-TP closure.
 * (7) Tails b >= 5 (the tripled block possibly among them): carried
 *     Lemma TR arithmetic at weight 18 (6 x 3, every column possibly
 *     tripled) with the leading sqrt(3) on the tripled tail row; the
 *     b = 5 constant is 5.46e-15 < 1e-13 and decreases in b; head-row
 *     tail columns are absorbed by TAILSLACK (3 x EHALF^120 = 2.6e-26
 *     << 1e-19).
 * (8) Everything else carried: certified series caps gcap/gLo,
 *     per-entry position corner sups, CW row reduction valid for every
 *     occupied subset, V3/V4 floors. QED (for the stated class).
 *
 * SKEPTICAL SELF-CHECK RECORD (in-run refutations preserved).
 * (1) The DECOUPLED route - per-bond independent LEMMA KC sups (the
 *     naive k-generalization of Lemma AY2) - is REFUTED as a route to
 *     ANY constant at or below the HS ceiling: with floors already at
 *     their fine-cover limit (exact in-cell spreads) the decoupled
 *     capped frame at the corner geometry [[1,2,2],[4,4,8],[16,16,32]]
 *     evaluates to 1.2245 > 1 at mu = 12251/50000 = 0.24502 (asserted
 *     below), and its measured root is ~0.26. The loss is ROW
 *     CONSISTENCY: an interior block must serve both neighbors with
 *     the SAME amplitude direction; per-bond sups let it serve each
 *     with a different one. LEMMA KC alone is therefore NOT enough for
 *     k >= 3 - the nested-arc treatment (LEMMA EPN) is what carries
 *     the theorem; KC survives as the position-uniform MIN partner and
 *     as the cure of the recorded tail divergence at fixed k.
 * (2) TWO amplitude parametrizations of the tripled block STALL and
 *     are recorded so successors do not respend them: the (w2, w3) box
 *     (w1 = sqrt(1 - w2^2 - w3^2) has a derivative singularity - cells
 *     hugging the sphere shrink the w1 range only like sqrt(cell
 *     width); 58-102 unresolved at 4e6) and the polar (phi, theta) box
 *     (relative width of cos(phi) blows up at the pole; 71-74
 *     unresolved at 4e6-1e7, self-similar sliding ridge). The nested
 *     EPN arcs with the LEMMA OF floor collapse L1 to 2.48e6 cells
 *     with ZERO unresolved.
 * (3) Zero-width-cell probes at both recorded ridges: the capped frame
 *     reproduces the true frame value at points (0.9759989997 vs
 *     0.9759989371 at the spread-triple ridge; entry (0,1) exact to
 *     4e-3 relative at the displacement ridge BEFORE the D23lo corner
 *     fix and exact after it) - the caps are point-sound; every stall
 *     above was pure cell slack.
 * (4) Direction-of-error audit: every cap inflates (gcap up, gLo down,
 *     position corners outward, mu corners outward per sign, aySup/
 *     mcF/KC slacks up, D23 corners outward per sign, TAILSLACK
 *     additive, warm vectors arbitrary-positive) - the certificate can
 *     fail spuriously but cannot certify spuriously.
 * (5) CONSTANT WALL recorded: at 117/500 = 0.234 the L1 cover exhausts
 *     a 4e6-cell budget with ~51 unresolved cells on the SAME
 *     displacement ridge that walls THEOREM PO at 234/1000 - the two
 *     rungs share their budget wall (not re-run in-module; recorded).
 * (6) Batteries (measured cross-checks, not the proof): seeded LEMMA
 *     EPN identity draws (< 1e-9 relative), seeded triple-bond CELL
 *     domination draws (finite-width cells, interior samples, zero
 *     violations), seeded LEMMA KC draws (zero violations), 5000
 *     seeded in-class witnesses BOTH parities at rates >= 47/200 (zero
 *     E > 0).
 *
 * HONEST ATTRIBUTION. The constant 47/200 EQUALS the PO constant (the
 * shared displacement-ridge wall binds both); it is WEAKER than the DP
 * constant 2901/12500 = 0.23208, so the certification gap
 * [2901/12500, 47/200) now carries BOTH the >= 2-doubled-blocks and
 * the one-tripled-block channels. The class sandwich
 * [0.2320723, 0.24502] does NOT move (THEOREM HS remains the only
 * full-class ceiling). The scope here is ONE heavy block: the mixed
 * channel {>= 3 in one block AND >= 2 in another} is NOT covered (it
 * needs the tripled nested arcs PLUS the PO arcs elsewhere, a 12-D
 * cover past the recorded budget wall) and is registered as the NEW
 * sub-gap imp-95146-subgap-mixed-heavy-pair. Free rates untouched.
 *
 * Import-light (no heavy bundle, no imports). The covers and batteries
 * are recomputed by the assertions on every sweep (~30 s).
 */

const MU_TP = 47 / 200; // certified triple-block constant 0.235
const MU_CL = 9 / 10; // Lemma RM-TP closure rate
const MU_HS = 12251 / 50000; // carried THEOREM HS full-class ceiling constant
const MU_DP = 2901 / 12500; // carried THEOREM DP constant (one doubled block)
const MU_DW = 2320723 / 10000000; // carried THEOREM DW witness rate (subclass floor)
const EHALF_HI = 0.60653067; // > exp(-1/2), carried
const TAILSLACK = 1e-19;
const V3_FLOOR = 1e-8;
const V4_FLOOR = 1e-10;

const gFun = (z) => Math.exp(-z) * (1 + z);

// truncated alternating exponential series (sibling convention):
// even N => upper bound of exp(-z), odd N => lower bound, for 0 <= z < N + 2
function expTrunc(z, N) {
  let s = 1;
  let t = 1;
  for (let n = 1; n <= N; n++) {
    t = (t * -z) / n;
    s += t;
  }
  return s;
}

// certified upper cap on g(z) - carried THEOREM FP step
function gcap(z) {
  if (z <= 4) return (expTrunc(z, 60) + 1e-8) * (1 + z);
  if (z <= 15) return (expTrunc(z, 60) + 1e-6) * (1 + z);
  return Math.pow(EHALF_HI, Math.floor(z)) * (1 + 1e-9);
}

// certified LOWER cap on g(z) - carried imp-95144
function gLo(z) {
  if (z >= 50) return 0;
  const v = (expTrunc(z, 59) - 1e-8) * (1 + z);
  return Math.max(0, v);
}

const sqrtHi = (w) => Math.sqrt(Math.max(0, w)) * (1 + 1e-12);
const R3 = sqrtHi(3);

// NEW LEMMA KC: cone-restricted Rayleigh sup with equicorrelated floor G,
// caps A (k <= 3). Max over primal-feasible supports of the restricted
// KKT value; tolerant inclusion (x* >= -1e-9) plus the (1 + 1e-9) pad
// keeps it an upper cap under float error.
function kcSup(A, G) {
  let best2 = 0;
  for (const a of A) if (a * a > best2) best2 = a * a;
  const n = A.length;
  if (G < 1) {
    const den = 1 - G * G;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = A[i];
        const b = A[j];
        const xi = a - b * G;
        const xj = b - a * G;
        if (xi >= -1e-9 && xj >= -1e-9) {
          const v = (a * a + b * b - 2 * a * b * G) / den;
          if (v > best2) best2 = v;
        }
      }
    }
    if (n === 3) {
      const d = 1 - G;
      const t = 1 + 2 * G;
      const S1 = A[0] + A[1] + A[2];
      const x = A.map((a) => (a - (G / t) * S1) / d);
      if (x.every((v) => v >= -1e-9)) {
        const v = A[0] * x[0] + A[1] * x[1] + A[2] * x[2];
        if (v > best2) best2 = v;
      }
    }
  }
  return sqrtHi(best2) * (1 + 1e-9);
}

// carried LEMMA AY (imp-95144/95145): certified sup over the amplitude arc cell
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
// carried LEMMA MC (imp-95145): arc-restricted merge cap
function mcF(G, ya, yc) {
  let s;
  const sAt = (y) => 2 * y * Math.sqrt(Math.max(0, 1 - y * y));
  const yStar = Math.SQRT1_2;
  if (ya <= yStar && yStar <= yc) s = 1;
  else s = Math.max(sAt(ya), sAt(yc));
  return sqrtHi((1 + s) / (1 + s * G)) * (1 + 1e-12);
}

// certified Collatz-Wielandt ratio at ANY positive vector (carried direction)
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
      let s = 0;
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

// per-cell dominating matrix for ladder case T (tripled block = 0, 1 or 2).
// axes: [q1, q2, q3 (tripled positions, ordered), uA, uB (single head
// positions), yO, yI (LEMMA EPN arcs), mu]. Positive caps at the mu-cell
// LOWER corner, floors at the UPPER corner (carried sign convention).
function makeCell(T) {
  const others = [0, 1, 2].filter((b) => b !== T);
  return function cellTP(b) {
    const [q1a, q2a, q3a, uAa, uBa, yOa, yIa, ma] = b.lo;
    const [q1c, q2c, q3c, uAc, uBc, yOc, yIc, mc] = b.hi;
    // LEMMA EPN: fold packets (2,3) into an inner effective packet (inner arc
    // yI = packet-3 weight inside the pair), then fold packet 1 against it
    // (outer effective arc). Each level uses the carried aySup/mcF caps.
    const G12 = gLo(mc * Math.min(16, Math.max(0, q2c - q1a)));
    const G13 = gLo(mc * Math.min(16, Math.max(0, q3c - q1a)));
    const G23 = gLo(mc * Math.min(16, Math.max(0, q3c - q2a)));
    const Gmin = Math.min(G12, G13, G23);
    const FI = mcF(G23, yIa, yIc);
    // inner-pair correlation cap (min separation, mu-lo corner) for D23 upper
    const G23hi = Math.min(1, gcap(ma * Math.max(0, q3a - q2c)));
    const D23hi = sqrtHi(1 + 2 * Math.sqrt(Math.max(0, 1 - yIa * yIa)) * yIc * G23hi);
    // LEMMA OF: folded outer floor - numerator terms floored, denominator
    // capped (cell-exact in the fine limit); min(G12, G13) kept as fallback
    const w2Ilo = Math.sqrt(Math.max(0, 1 - yIc * yIc));
    const Gout = Math.max(Math.min(G12, G13), ((w2Ilo * G12 + yIa * G13) / D23hi) * (1 - 1e-12));
    // outer effective arc cell: ty = y*D23 / hypot(w1, y*D23), monotone corners
    const w1hi = sqrtHi(1 - yOa * yOa);
    const w1lo = Math.sqrt(Math.max(0, 1 - yOc * yOc));
    const D23lo = Math.sqrt(1 + 2 * w2Ilo * yIa * G23) * (1 - 1e-12);
    const nHi = yOc * D23hi;
    const nLo = yOa * D23lo;
    const tyHi = Math.min(1, (nHi / Math.hypot(w1lo, nHi)) * (1 + 1e-12));
    const tyLo = Math.max(0, (nLo / Math.hypot(w1hi, nLo)) * (1 - 1e-12));
    const FO = mcF(Gout, tyLo, tyHi);
    const qlo = [q1a, q2a, q3a];
    const qhi = [q1c, q2c, q3c];
    const bondT = (caps) => {
      const [r1, r2, r3] = caps;
      const rE = Math.min(aySup(r2, r3, G23, yIa, yIc), FI * Math.max(r2, r3));
      return (
        Math.min(aySup(r1, rE, Gout, tyLo, tyHi), FO * Math.max(r1, rE), kcSup(caps, Gmin)) *
        (1 + 1e-12)
      );
    };
    const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
    const set = (i, j, x) => {
      M[i][j] = x;
      M[j][i] = x;
    };
    const singles = { [others[0]]: [uAa, uAc], [others[1]]: [uBa, uBc] };
    const headIdx = [0, 1, 2];
    for (let x = 0; x < 3; x++) {
      for (let y = x + 1; y < 3; y++) {
        const bL = headIdx[x];
        const bR = headIdx[y];
        if (bL === T) {
          const [sLo] = singles[bR];
          const caps = [0, 1, 2].map((i) => gcap(ma * Math.max(0, sLo - qhi[i])));
          set(bL, bR, bondT(caps));
        } else if (bR === T) {
          const sHi = singles[bL][1];
          const caps = [0, 1, 2].map((i) => gcap(ma * Math.max(0, qlo[i] - sHi)));
          set(bL, bR, bondT(caps));
        } else {
          const sHi = singles[bL][1];
          const sLo = singles[bR][0];
          set(bL, bR, gcap(ma * Math.max(0, sLo - sHi)));
        }
      }
    }
    for (const c of [3, 4]) {
      const edge = BLOCKS[c][0];
      for (const bh of [0, 1, 2]) {
        if (bh === T) {
          const caps = [0, 1, 2].map((i) => gcap(ma * Math.max(0, edge - qhi[i])));
          set(bh, c, R3 * bondT(caps));
        } else {
          const sHi = singles[bh][1];
          set(bh, c, R3 * gcap(ma * Math.max(0, edge - sHi)));
        }
      }
    }
    set(3, 4, 3 * gcap(ma * (BLOCKS[4][0] - BLOCKS[3][1])));
    return M;
  };
}

// adaptive bisection cover with warm-started vectors; ZERO unresolved required
function cover(cellFn, box0, scales, maxCells, tris) {
  const v0 = [0.7, 0.7, 0.14, 1e-3, 1e-8];
  const stack = [{ lo: box0.lo, hi: box0.hi, d: 0, v: v0 }];
  let n = 0;
  let worst = -1;
  let maxDepth = 0;
  let unresolved = 0;
  while (stack.length) {
    const b = stack.pop();
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
    if (b.d >= 90 || n + stack.length > maxCells) {
      unresolved++;
      continue;
    }
    let ax = 0;
    let wmax = -1;
    for (let k = 0; k < b.lo.length; k++) {
      const w = (b.hi[k] - b.lo[k]) / scales[k];
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
      if (tris) {
        for (const [a1, a2] of tris) {
          if (c.lo[a1] > c.hi[a2]) {
            ok = false;
            break;
          }
        }
      }
      if (ok) stack.push(c);
    }
  }
  return { cells: n, worst, maxDepth, unresolved };
}

// ---- run the three rate-resolved 8-D ladder covers ----
function runLadder(T) {
  const [Blo, Bhi] = BLOCKS[T];
  const others = [0, 1, 2].filter((b) => b !== T);
  const lo = [Blo, Blo, Blo, BLOCKS[others[0]][0], BLOCKS[others[1]][0], 0, 0, MU_TP];
  const hi = [Bhi, Bhi, Bhi, BLOCKS[others[0]][1], BLOCKS[others[1]][1], 1, 1, MU_CL];
  const w = Bhi - Blo;
  const scales = [
    w,
    w,
    w,
    BLOCKS[others[0]][1] - BLOCKS[others[0]][0],
    BLOCKS[others[1]][1] - BLOCKS[others[1]][0],
    1,
    1,
    0.35,
  ];
  return cover(makeCell(T), { lo, hi }, scales, 4e6, [
    [0, 1],
    [1, 2],
  ]);
}
const CERT_L0 = runLadder(0);
const CERT_L1 = runLadder(1);
const CERT_L2 = runLadder(2);

// LEMMA RM-TP closure: at most one tripled side per pair, penalty-free at 9/10
const RM_TP = (() => {
  const t = [
    [0, 2, 14, 62, 254],
    [2, 0, 8, 56, 248],
    [14, 8, 0, 32, 224],
    [62, 56, 32, 0, 128],
    [254, 248, 224, 128, 0],
  ];
  const M = t.map((row) => row.map((x) => (x === 0 ? 0 : R3 * gcap(MU_CL * x))));
  const v = polish(M, [0.7, 0.7, 0.14, 1e-3, 1e-8], 400);
  return cwRatio(M, v);
})();

// tail arithmetic: carried Lemma TR, weight 18 (every column possibly
// tripled), leading sqrt(3) for the tripled tail row
const TR5_TP =
  Math.sqrt(3) * ((18 * Math.pow(2, 5 - 4)) / V4_FLOOR) * Math.pow(EHALF_HI, Math.floor(2 * MU_TP * Math.pow(4, 4))) +
  Math.sqrt(3) * Math.pow(EHALF_HI, Math.floor(2 * MU_TP * Math.pow(4, 5)));
const TAILCOL_TP = 3 * Math.pow(EHALF_HI, Math.floor(2 * MU_TP * Math.pow(4, 4))); // must stay < TAILSLACK

// in-run refutation literal: the DECOUPLED per-bond LEMMA KC route at the
// fine-cover limit (floors at exact in-cell spreads) at the corner geometry -
// evaluates ABOVE 1 at the THEOREM HS constant, so no cover budget can make
// the decoupled route certify a constant at or below the full-class ceiling
const DECOUPLED_GEOM = [
  [1, 2, 2],
  [4, 4, 8],
  [16, 16, 32],
];
function decoupledLam(mu) {
  const us = DECOUPLED_GEOM;
  const Gm = us.map((u) => gFun(mu * (u[2] - u[0])));
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => {
    M[i][j] = x;
    M[j][i] = x;
  };
  for (let b = 0; b < 3; b++) {
    for (let c = b + 1; c < 3; c++) {
      const A = [0, 1, 2].map((i) => kcSup([0, 1, 2].map((j) => gFun(mu * Math.abs(us[c][j] - us[b][i]))), Gm[c]));
      set(b, c, kcSup(A, Gm[b]));
    }
  }
  for (let b = 0; b < 3; b++) {
    for (const c of [3, 4]) {
      const A = [0, 1, 2].map((i) => gFun(mu * (BLOCKS[c][0] - us[b][i])));
      set(b, c, R3 * kcSup(A, Gm[b]));
    }
  }
  set(3, 4, 3 * gFun(mu * (BLOCKS[4][0] - BLOCKS[3][1])));
  let v = [0.7, 0.7, 0.14, 1e-3, 1e-8];
  let l = 0;
  for (let it = 0; it < 400; it++) {
    const w = v.map((_, i) => M[i].reduce((s, x, j) => s + x * v[j], 0));
    const n2 = Math.hypot(...w);
    l = n2 / Math.hypot(...v);
    v = w.map((x) => x / n2);
  }
  return l;
}
const DECOUPLED_AT_HS = decoupledLam(MU_HS);

// ---- seeded batteries (deterministic LCG, per-battery reseed) ----
let seedState = 0;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}

// battery KC (seed 262626): LEMMA KC approached directly - the cone sup cap
// dominates sampled cone directions against true correlations >= the floor
function runKcBattery() {
  seedState = 262626;
  let viol = 0;
  let worst = -Infinity;
  for (let t = 0; t < 60000; t++) {
    const A = [rnd() * 1.2, rnd() * 1.2, rnd() * 1.2];
    const Gfloor = rnd() * 0.999;
    const G12 = Gfloor + (1 - Gfloor) * rnd();
    const G13 = Gfloor + (1 - Gfloor) * rnd();
    const G23 = Gfloor + (1 - Gfloor) * rnd();
    const cap = kcSup(A, Gfloor);
    for (let k = 0; k < 6; k++) {
      const w = [rnd(), rnd(), rnd()];
      const n = Math.hypot(...w);
      if (n < 1e-9) continue;
      const wn = w.map((x) => x / n);
      const num = A[0] * wn[0] + A[1] * wn[1] + A[2] * wn[2];
      const den = Math.sqrt(
        1 + 2 * (wn[0] * wn[1] * G12 + wn[0] * wn[2] * G13 + wn[1] * wn[2] * G23)
      );
      const r = num / den / Math.max(cap, 1e-30);
      if (r > 1 + 1e-9) viol++;
      if (r > worst) worst = r;
    }
  }
  return { viol, worst };
}

// battery EPN (seed 373737): the nested triple fold is an IDENTITY - the
// direct 3-packet block bond/norm equals the outer-pair form in the LEMMA
// EPN variables (y~, rho1E, rE) for seeded positions, arcs and rates
function runEpnBattery() {
  seedState = 373737;
  let worstRel = 0;
  let count = 0;
  for (let t = 0; t < 4000; t++) {
    const mu = MU_TP * (1 + 2 * rnd());
    const base = Math.pow(4, 1 + Math.floor(rnd() * 2));
    let q = [base * (1 + rnd()), base * (1 + rnd()), base * (1 + rnd())].sort((a, b) => a - b);
    const yO = rnd();
    const yI = rnd();
    const w1 = Math.sqrt(1 - yO * yO);
    const w2h = Math.sqrt(1 - yI * yI);
    const w3h = yI;
    const w = [w1, yO * w2h, yO * w3h];
    const tgt = base * 4 * (1 + rnd());
    const rho = (a, b2) => gFun(mu * Math.abs(a - b2));
    // direct forms
    const normDir = Math.sqrt(
      1 +
        2 *
          (w[0] * w[1] * rho(q[0], q[1]) + w[0] * w[2] * rho(q[0], q[2]) + w[1] * w[2] * rho(q[1], q[2]))
    );
    const bondDir = (w[0] * rho(q[0], tgt) + w[1] * rho(q[1], tgt) + w[2] * rho(q[2], tgt)) / normDir;
    // nested LEMMA EPN forms
    const D23 = Math.sqrt(1 + 2 * w2h * w3h * rho(q[1], q[2]));
    const rho1E = (w2h * rho(q[0], q[1]) + w3h * rho(q[0], q[2])) / D23;
    const rE = (w2h * rho(q[1], tgt) + w3h * rho(q[2], tgt)) / D23;
    const N = Math.hypot(w1, yO * D23);
    const tx = w1 / N;
    const ty = (yO * D23) / N;
    const normNest = N * Math.sqrt(1 + 2 * tx * ty * rho1E);
    const bondNest = (N * (tx * rho(q[0], tgt) + ty * rE)) / normNest;
    const relN = Math.abs(normDir - normNest) / normDir;
    const relB = Math.abs(bondDir - bondNest) / Math.max(1e-30, Math.abs(bondDir));
    const rel = Math.max(relN, relB);
    if (rel > worstRel) worstRel = rel;
    count++;
  }
  return { worstRel, count };
}

// battery CELL (seed 484848): finite-width triple-bond cells approached with
// interior samples - the cellTP nested cap dominates every sampled true bond
function runCellBattery() {
  seedState = 484848;
  let viol = 0;
  let worst = -Infinity;
  let count = 0;
  const cellFn = makeCell(1);
  for (let t = 0; t < 4000; t++) {
    // random cell inside the L1 box
    const qs = [4 + rnd() * 3.6, 4 + rnd() * 3.6, 4 + rnd() * 3.6].sort((a, b) => a - b);
    const dq = 0.01 + rnd() * 0.3;
    const yO0 = rnd() * 0.9;
    const yI0 = rnd() * 0.9;
    const dy = 0.01 + rnd() * 0.1;
    const u00 = 1 + rnd() * 0.9;
    const u20 = 16 + rnd() * 15;
    const m0 = MU_TP + rnd() * (MU_CL - MU_TP) * 0.9;
    const dm = 0.001 + rnd() * 0.02;
    const lo = [qs[0], qs[1], qs[2], u00, u20, yO0, yI0, m0];
    const hi = [
      Math.min(8, qs[0] + dq),
      Math.min(8, qs[1] + dq),
      Math.min(8, qs[2] + dq),
      Math.min(2, u00 + 0.05),
      Math.min(32, u20 + 0.5),
      Math.min(1, yO0 + dy),
      Math.min(1, yI0 + dy),
      Math.min(MU_CL, m0 + dm),
    ];
    // keep ordering feasible
    if (lo[1] > hi[2] || lo[0] > hi[1]) continue;
    const M = cellFn({ lo, hi });
    // interior samples
    for (let k = 0; k < 4; k++) {
      const q1 = lo[0] + rnd() * (hi[0] - lo[0]);
      const q2 = Math.max(q1, lo[1] + rnd() * (hi[1] - lo[1]));
      const q3 = Math.max(q2, lo[2] + rnd() * (hi[2] - lo[2]));
      const u0 = lo[3] + rnd() * (hi[3] - lo[3]);
      const u2 = lo[4] + rnd() * (hi[4] - lo[4]);
      const yO = lo[5] + rnd() * (hi[5] - lo[5]);
      const yI = lo[6] + rnd() * (hi[6] - lo[6]);
      const mu = lo[7] + rnd() * (hi[7] - lo[7]);
      const w1 = Math.sqrt(1 - yO * yO);
      const w2 = yO * Math.sqrt(1 - yI * yI);
      const w3 = yO * yI;
      const w = [w1, w2, w3];
      const q = [q1, q2, q3];
      const rho = (a, b2) => gFun(mu * Math.abs(a - b2));
      const D1 = Math.sqrt(
        1 + 2 * (w[0] * w[1] * rho(q[0], q[1]) + w[0] * w[2] * rho(q[0], q[2]) + w[1] * w[2] * rho(q[1], q[2]))
      );
      const bond = (tgt) => (w[0] * rho(q[0], tgt) + w[1] * rho(q[1], tgt) + w[2] * rho(q[2], tgt)) / D1;
      const checks = [
        [bond(u0), M[0][1]],
        [bond(u2), M[1][2]],
        [bond(64), M[1][3] / R3],
        [bond(256), M[1][4] / R3],
      ];
      for (const [tr, cap] of checks) {
        const r = tr / Math.max(cap, 1e-30);
        if (r > 1 + 1e-9) viol++;
        if (r > worst) worst = r;
      }
      count++;
    }
  }
  return { viol, worst, count };
}

// exact sibling Gram kernel (identical to imp-95130..95145) for the witness battery
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// battery W (seed 595959): THEOREM TP approached directly - seeded in-class
// witnesses (ONE block of ladders 0..6 carrying up to three packets, all
// others at most one, both parities, free positions, common rate >= 47/200)
function runWitnessBattery() {
  seedState = 595959;
  let maxE = -Infinity;
  let viol = 0;
  let count = 0;
  for (let t = 0; t < 5000; t++) {
    const odd = t % 2 === 1;
    const mu = t % 3 === 0 ? MU_TP : MU_TP * (1 + 2 * rnd());
    const heavy = Math.floor(rnd() * 7);
    const us = [];
    const as = [];
    const blocks = [];
    for (let b = 0; b < 7; b++) {
      if (rnd() < 0.3) continue;
      const base = Math.pow(4, b) * (odd ? 2 : 1);
      const reps = b === heavy ? 1 + Math.floor(rnd() * 3) : 1;
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
  return { maxE, viol, count };
}

const BAT_KC = runKcBattery();
const BAT_EPN = runEpnBattery();
const BAT_CELL = runCellBattery();
const BAT_W = runWitnessBattery();

// baked literals (recomputed by the assertions)
const L0_CELLS_LIT = 3671;
const L1_CELLS_LIT = 2476992;
const L2_CELLS_LIT = 25586;

export const IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP = {
  ticket:
    "imp-95146 (THEOREM TP: triple-block nested-fold cap - every parity-pure MAJ witness at one COMMON rate >= 47/200 = 0.235 with at most THREE packets in ONE block and at most one in every other block, any finite same-parity block set, free positions, nonnegative amplitudes, has E <= 0. Combined with THEOREM DW (imp-95143): the common-rate one-heavy-block subclass threshold is certified inside [2320723/10000000, 47/200). Jointly with THEOREM PO at the same constant: any E > 0 witness at a common rate >= 0.235 now needs >= 4 packets in one block, or >= 3 in one block and >= 2 in another - the k >= 3 channel of imp-95144-subgap-k-packet-ladder is opened and narrowed to its mixed-heavy remainder)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes THEOREM FP/DP/PO machinery (gcap/gLo caps, Lemma EP folding, Lemma AY arc sup, Lemma MC merge cap, rate-resolved covers, CW at any positive vector, TAILSLACK, Lemma TR, Lemma OD2) and THEOREM DW (imp-95143) as the subclass floor; delivers the k-dimensional cone tool named by imp-95144-subgap-k-packet-ladder.",
  theoremTP:
    "Class: at most three packets in ONE block, at most one in every other block, all blocks one parity, positions free, amplitudes nonnegative, ONE COMMON rate >= 47/200. Claim: E <= 0. Proof: NEW LEMMA EPN (nested effective-packet folding: the tripled block folds exactly by two applications of the carried Lemma EP identity, so the 2-packet arc machinery applies at both levels with two arc axes yO, yI) + NEW LEMMA OF (folded outer floor (w2hLo G12 + yIa G13)/D23hi, cell-exact in the fine limit - without it the covers hit the depth cap on two recorded ridges) + NEW LEMMA KC (cone-restricted Rayleigh sup by feasible-support enumeration; equal caps give sqrt(k/(1+(k-1)G)); position-uniform MIN partner; cures the recorded k-uniform tail divergence at fixed k) + rate-resolved 8-D adaptive warm-started Collatz-Wielandt covers L0/L1/L2 over three tripled positions x two single head positions x two EPN arcs x common rate in [47/200, 9/10] (3671 / 2476992 / 25586 cells, ZERO unresolved each; rows 3/4 sqrt(3)-inflated, entry (3,4) factor 3) + NEW LEMMA RM-TP (penalty-free closure at 9/10, at most one tripled side per pair, bound 0.8038 < 1, dominates every rate >= 9/10 by monotone decrease of g) + LEMMA OD2 (odd parity = even frame at 2mu = 0.47, inside the covered interval) + carried Lemma TR tails at weight 18 with the leading sqrt(3).",
  tripleBracket:
    "Common-rate one-heavy-block (<= 3 packets) subclass threshold certified inside [2320723/10000000, 47/200). Floor: THEOREM DW witness (one doubled block - in this class). Cap: this module. The constant EQUALS the THEOREM PO constant: the same displacement ridge walls both covers (at 117/500 = 0.234 the L1 cover exhausts a 4e6-cell budget with ~51 unresolved - recorded, matching the PO wall at 234/1000).",
  structuralConsequence:
    "Jointly with THEOREM PO (at most two everywhere, same constant): any FULL-class parity-pure witness with E > 0 at a common rate >= 47/200 must place at least FOUR packets in one block, OR at least THREE packets in one block AND at least TWO in another. The mixed channel {>= 3 in one AND >= 2 in another} is the NEW sub-gap imp-95146-subgap-mixed-heavy-pair (needs the tripled nested arcs PLUS the PO arcs elsewhere - a 12-D cover past the recorded budget wall). Below 47/200 the certification gap [2901/12500, 47/200) still carries the >= 2-doubled and one-tripled channels; free rates survive separately (imp-95144-subgap-free-rate-displacement untouched).",
  honestAttribution:
    "The constant 47/200 equals the PO constant and is WEAKER than the DP constant 2901/12500 - the shared displacement-ridge budget wall is recorded plainly (L1 at 0.234: ~51 unresolved at 4e6 cells). The class sandwich [0.2320723, 0.24502] does NOT move; THEOREM HS remains the only full-class ceiling. The lemma gains are EPN (nested folding - two arc axes instead of a 2-sphere patch), OF (the folded outer floor that makes the nested caps cell-exact), and KC (the k-cone closed form). The DECOUPLED per-bond KC route is REFUTED as a route to any constant at or below the HS ceiling: 1.2245 > 1 at mu = 0.24502 with fine-limit floors at the corner geometry (asserted); its measured root ~0.26. Two amplitude parametrizations (the (w2, w3) box and the polar (phi, theta) box) STALL with irreducible sqrt-singularity or relative-width ridges - recorded so successors do not respend them.",
  subGaps: [
    "imp-95146-subgap-mixed-heavy-pair - NEW: the {>= 3 packets in one block AND >= 2 in another} common-rate channel above 47/200; route: tripled nested arcs plus PO arcs elsewhere (12-D cover, past the recorded budget wall) or a sharper joint treatment; below 0.24502 only this and {>= 4 in one block} survive at common rates.",
    "imp-95144-subgap-k-packet-ladder - NARROWED again: the requested k-dimensional cone tool is DELIVERED (LEMMA KC) and shown INSUFFICIENT alone (decoupled refutation - row consistency is the binding structure); k = 3 one-heavy-block is CLOSED above 47/200 by this module; surviving: {>= 4 in one block} (a third EPN nesting level adds one position and one arc axis per extra packet - route named, not run) plus the mixed-heavy-pair channel and the certification gap [2901/12500, 47/200).",
    "imp-95145-subgap-doubled-cert-gap - OPEN, untouched: the >= 2-doubled-blocks channel inside [2901/12500, 47/200).",
    "imp-95144-subgap-free-rate-displacement - OPEN, untouched: the intra-block floors used here exist only at a common rate.",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this is a subclass ceiling step; the phi-conditional odd-mass bound is untouched",
    "the class sandwich [0.2320723, 0.24502] is carried unchanged - the full-class ceiling needs the mixed-heavy and k >= 4 channels priced, and the free-rate channel is untouched",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM TP is unconditional given the carried THEOREM FP/DP/PO machinery: Lemma EPN is two applications of the exact Lemma EP identity (verified on 4000 seeded draws to < 1e-9 relative), Lemma OF is an elementary monotone corner bound (numerator terms floored, denominator capped), Lemma KC is the exact cone sup by feasible-support enumeration with tolerant inclusion so float error can only inflate (60000-draw battery, zero violations), the 8-D covers are deterministic bisection with Collatz-Wielandt at arbitrary positive vectors and ZERO unresolved cells (positive caps at the mu-cell lower corner, floors at the upper corner), the finite-width cell caps are battery-attacked with interior samples (zero violations), Lemma RM-TP closes the ray mu >= 9/10 penalty-free (no intra floor used, so no rate trap), Lemma OD2 folds odd parity in at 2mu inside the covered interval, and the tail constants are explicit (TR weight 18, TAILSLACK absorbs the tripled tail columns). Every approximation inflates caps - the certificate can fail spuriously but cannot certify spuriously. Scope: parity-pure model family, ONE COMMON RATE, at most THREE packets in ONE block and at most one in every other; the mixed-heavy channel {>= 3 and >= 2}, k >= 4 occupancy, and free rates are named sub-gaps, not covered; the constant 47/200 equals the PO constant and is weaker than the DP constant; the class sandwich [0.2320723, 0.24502] is carried unchanged; the decoupled-route value 1.2245 at 0.24502 and its ~0.26 root are refutation records (float, measured only); imp-95140-subgap-displacement-credit and parent imp-95130-subgap-phi-conditional-odd-mass stay OPEN; floors and ceilings of the Lambda program untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED on the parent; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP_ASSERTIONS = [
  {
    id: "imp95146-covers-certify",
    description:
      "the three rate-resolved 8-D ladder covers over [47/200, 9/10] terminate with ZERO unresolved cells (3671 / 2476992 / 25586 cells, depth < 90), worst certified bounds strictly below 1",
    holds: () =>
      CERT_L0.unresolved === 0 &&
      CERT_L1.unresolved === 0 &&
      CERT_L2.unresolved === 0 &&
      CERT_L0.cells === L0_CELLS_LIT &&
      CERT_L1.cells === L1_CELLS_LIT &&
      CERT_L2.cells === L2_CELLS_LIT &&
      CERT_L0.worst < 1 &&
      CERT_L1.worst < 1 &&
      CERT_L2.worst < 1 &&
      CERT_L1.worst > 0.9 &&
      CERT_L0.maxDepth < 90 &&
      CERT_L1.maxDepth < 90 &&
      CERT_L2.maxDepth < 90,
  },
  {
    id: "imp95146-rm-tp-closure",
    description:
      "Lemma RM-TP: the at-most-one-tripled-side penalty-free frame at mu = 9/10 certifies (bound in (0.75, 0.85), < 1) and dominates every common rate >= 9/10 by monotone decrease of g; Lemma OD2 folds odd parity in at 2 x 47/200 = 0.47 inside the covered interval [47/200, 9/10]",
    holds: () => RM_TP < 0.85 && RM_TP > 0.75 && 2 * MU_TP > MU_TP && 2 * MU_TP < MU_CL,
  },
  {
    id: "imp95146-decoupled-route-refuted",
    description:
      "in-run refutation preserved: the DECOUPLED per-bond LEMMA KC route (no row consistency) evaluates ABOVE 1.2 at the THEOREM HS constant 12251/50000 even with floors at their fine-cover limit at the corner geometry - no cover budget can certify the k = 3 rung below the full-class ceiling through decoupled bonds",
    holds: () => DECOUPLED_AT_HS > 1.2 && DECOUPLED_AT_HS < 1.3,
  },
  {
    id: "imp95146-kc-battery",
    description:
      "LEMMA KC approached directly: 60000 seeded (3 caps, floor, 3 true correlations >= floor) draws x 6 cone samples - the feasible-support cone sup dominates every sampled ratio (zero violations)",
    holds: () => BAT_KC.viol === 0 && BAT_KC.worst <= 1 + 1e-9 && BAT_KC.worst > 0.9,
  },
  {
    id: "imp95146-kc-closed-forms",
    description:
      "LEMMA KC closed-form anchors: equal caps reproduce sqrt(k/(1+(k-1)G)) (k = 3, G = 1/2 gives sqrt(3/2) up to pads), G = 0 gives the Euclidean norm, G -> 1 with equal caps gives the single-cap value, the k = 2 FEASIBLE support matches the Lemma AY interior form, and an INFEASIBLE interior point truncates to the singleton - the cone sup is strictly SHARPER there than the AY full-arc fallback",
    holds: () => {
      const eq = kcSup([1, 1, 1], 0.5);
      const anchor = Math.sqrt(3 / 2);
      const zero = kcSup([0.3, 0.4, 1.2], 0);
      const norm = Math.hypot(0.3, 0.4, 1.2);
      const near1 = kcSup([0.7, 0.7, 0.7], 0.999999);
      const ayF = kcSup([0.9, 0.8], 0.6);
      const ayFLit = Math.sqrt((0.81 + 0.64 - 2 * 0.9 * 0.8 * 0.6) / (1 - 0.36));
      const ayT = kcSup([0.9, 0.5], 0.6); // x2* = 0.5 - 0.54 < 0: infeasible pair
      const ayTFallback = Math.sqrt((0.81 + 0.25 - 2 * 0.9 * 0.5 * 0.6) / (1 - 0.36));
      return (
        Math.abs(eq - anchor) < 1e-6 &&
        Math.abs(zero - norm) < 1e-6 &&
        Math.abs(near1 - 0.7) < 1e-4 &&
        Math.abs(ayF - ayFLit) < 1e-6 &&
        Math.abs(ayT - 0.9) < 1e-6 &&
        ayT < ayTFallback
      );
    },
  },
  {
    id: "imp95146-kc-tail-divergence-cured",
    description:
      "the recorded imp-95145 tail divergence is CURED at fixed k by LEMMA KC: the KC row factor sqrt(3/(1+2G)) stays <= sqrt(3) at every floor, so the inflated (b, b+1) tail entry is <= 3 g(2 mu 4^b) - explicitly below 2e-2 / 4e-6 / 2e-21 at b = 2, 3, 4 (mu = 47/200), strictly decreasing, where the 1/sqrt(G) phantom route diverged (6.39 / 1.8e3 / 1.2e13)",
    holds: () => {
      const vals = [2, 3, 4].map((b) => 3 * gFun(2 * MU_TP * Math.pow(4, b)));
      return (
        vals[0] < 2e-2 && vals[1] < 4e-6 && vals[2] < 2e-21 && vals[0] > vals[1] && vals[1] > vals[2] &&
        kcSup([1, 1, 1], 0) <= Math.sqrt(3) * (1 + 1e-8)
      );
    },
  },
  {
    id: "imp95146-epn-identity",
    description:
      "LEMMA EPN approached directly: 4000 seeded tripled-block configurations - the direct 3-packet block bond and norm equal the nested outer-pair forms in the EPN variables to < 1e-9 relative (identity, not a bound)",
    holds: () => BAT_EPN.count === 4000 && BAT_EPN.worstRel < 1e-9,
  },
  {
    id: "imp95146-cell-battery",
    description:
      "the finite-width cell caps approached directly: 4000 seeded L1 cells x 4 interior samples x 4 bonds - the nested aySup/mcF/KC entry caps dominate every sampled true bond (zero violations)",
    holds: () => BAT_CELL.viol === 0 && BAT_CELL.worst <= 1 + 1e-9 && BAT_CELL.worst > 0.9 && BAT_CELL.count > 12000,
  },
  {
    id: "imp95146-witness-battery",
    description:
      "THEOREM TP approached directly: 5000 seeded in-class witnesses (one heavy block of ladders 0..6 with up to three packets, all others at most one, BOTH parities, free positions, common rate >= 47/200 pinned at the floor every third draw, amplitude zeros allowed) - zero E > 0 draws",
    holds: () => BAT_W.viol === 0 && BAT_W.maxE < 0 && BAT_W.count > 4800,
  },
  {
    id: "imp95146-bracket-ordering",
    description:
      "bracket anchors: DW certified floor 2320723/10000000 (in-class: one doubled block) < DP constant 2901/12500 < 47/200 = PO constant = this constant < HS ceiling 12251/50000; the closure rate 9/10 exceeds the doubled odd rate 0.47",
    holds: () => MU_DW < MU_DP && MU_DP < MU_TP && MU_TP < MU_HS && MU_HS < MU_CL && 2 * MU_TP < MU_CL,
  },
  {
    id: "imp95146-tail-arithmetic",
    description:
      "tail arithmetic: the weight-18 tripled-tails Lemma TR constant at b = 5 stays below 1e-13 (5.46e-15), and the tripled head-row tail-column mass 3 x EHALF^120 stays far inside TAILSLACK = 1e-19",
    holds: () =>
      TR5_TP < 1e-13 && TR5_TP > 0 && TAILCOL_TP < TAILSLACK && TAILCOL_TP < 3e-26 && Math.floor(2 * MU_TP * 256) === 120,
  },
  {
    id: "imp95146-cap-validity",
    description:
      "cap validity: gLo(z) <= g(z) <= gcap(z) on a 400-point grid over [0, 49.9]; gLo is 0 beyond 50; the floor arguments used by the covers stay below 50 at the closure rate; mcF is at most sqrt(2)(1 + 1e-9) and tends to 1 as G tends to 1 on the full arc",
    holds: () => {
      for (let i = 0; i <= 400; i++) {
        const z = (i * 49.9) / 400;
        if (!(gLo(z) <= gFun(z))) return false;
        if (!(gcap(z) >= gFun(z))) return false;
      }
      return (
        gLo(50) === 0 &&
        MU_CL * 16 < 50 &&
        mcF(0, 0, 1) < Math.SQRT2 * (1 + 1e-9) &&
        mcF(0.999999, 0, 1) < 1 + 1e-5
      );
    },
  },
  {
    id: "imp95146-honesty-gate",
    description:
      "the verdict is scoped: COMMON RATE only, one heavy block with at most three packets, constant equals PO and is weaker than DP, budget wall and refuted routes recorded, class sandwich carried unchanged, mixed-heavy / k >= 4 / free-rate sub-gaps OPEN; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP.promotesBound === false &&
      /NO QED/.test(IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP.rigorScope) &&
      /refereed bound is changed/i.test(IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP.rigorScope) &&
      /ONE COMMON RATE/.test(IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP.rigorScope) &&
      /weaker than the DP constant/.test(IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP.rigorScope) &&
      /measured only/.test(IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP.rigorScope) &&
      /NEW sub-gap imp-95146-subgap-mixed-heavy-pair/.test(
        IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP.structuralConsequence
      ) &&
      /recorded plainly/.test(IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP.honestAttribution) &&
      /carried unchanged/.test(IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP.openResiduals[1]) &&
      /remains OPEN/.test(IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP.openResiduals[0]) &&
      IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP.subGaps.length === 4 &&
      IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP.openResiduals.length === 3,
  },
];

for (const a of IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95146-triple-block-nested-fold-cap assertion failed: ${a.id}`);
  }
}

export default IMP95146_TRIPLE_BLOCK_NESTED_FOLD_CAP;
