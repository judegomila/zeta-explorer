/**
 * imp-95145 - THEOREM PO (pair-occupancy displacement cap, certified
 * common-rate threshold 47/200 = 0.235): every parity-pure MAJ witness
 * at ONE COMMON rate mu >= 47/200, with AT MOST TWO packets in EVERY
 * block (ANY number of blocks doubled - zero, one, or all of them; any
 * finite same-parity block set, positions FREE inside their dyadic
 * blocks, nonnegative amplitudes), has E <= 0.
 *
 * WHAT THIS ADDS OVER THEOREM DP (imp-95144). DP capped the ONE-doubled-
 * block subclass at 2901/12500 = 0.23208; witnesses with TWO OR MORE
 * doubled blocks were covered by NO ceiling below THEOREM HS
 * 12251/50000 = 0.24502. This module caps the whole pair-occupancy
 * class (arbitrarily many doubled blocks) at 47/200 = 0.235. The
 * common-rate pair-occupancy subclass threshold is certified inside
 *   [2320723/10000000, 47/200) = [0.2320723, 0.235)
 * (floor: THEOREM DW, imp-95143 - the DW witness has one doubled block,
 * hence IS pair-occupancy). STRUCTURAL CONSEQUENCE: any full-class
 * parity-pure witness with E > 0 at a common rate >= 47/200 must place
 * AT LEAST THREE packets in one block; the >= 2-doubled-blocks channel
 * of imp-95144-subgap-k-packet-ladder is CLOSED above 0.235 and
 * survives only in the certification gap [2901/12500, 47/200).
 *
 * MEASURED COLOR (float, not certified): the pair-occupancy family
 * corner root is 0.23207238946 - within 2e-8 of the ONE-doubled DW
 * family root 0.23207238781359468 (carried imp-95143/95144). Doubling
 * additional blocks does NOT stack the displacement credit in this
 * frame: only one interior block (between the two heavy neighbors) can
 * collect it; the others pay intra-block penalty on strong bonds for
 * near-zero bond gain. The certification gap [0.23208, 0.235) is a
 * budget artifact, not believed to contain pair-occupancy witnesses.
 *
 * THEOREM PO. Class: packets at positions u_i in [2^{b_i}, 2^{b_i+1}),
 * all b_i of one parity, EVERY block index repeated at most twice;
 * amplitudes a_i >= 0; ONE COMMON rate mu >= 47/200. Claim:
 * E = -sum a_i^2/mu + 2 sum_{i<j} a_i a_j K(mu, mu, |u_i - u_j|) <= 0.
 *
 * PROOF CHAIN (new lemmas elementary; the rest carried from THEOREMS
 * FP/DP, imp-95142/95144):
 * (1) LEMMA EP per block (carried identity, imp-95144): each doubled
 *     block folds exactly into one effective packet, sigma_b =
 *     s_b sqrt(1 + 2 x_b y_b rhoIntra_b), effective correlation between
 *     two doubled blocks rhoHat = (sum_{ij} x_i x_j rho_ij)/(D_b D_c).
 *     E in effective coordinates is again the one-per-block form with
 *     nonnegative effective amplitudes (multi-block folding is the same
 *     regrouping of the quadratic form; verified as an identity by the
 *     battery below). At a COMMON rate every intra-block correlation
 *     has the floor rhoIntra_b >= g(mu width_b), width_b = 4^b exact
 *     (the blocks are the actual dyadic blocks - no relabeling).
 * (2) NEW LEMMA AY2 (nested subcone cap). The doubled-doubled bond is
 *     bilinear in the two arc directions and factorizes:
 *     rhoHat = [x_P (x_Q rAA + y_Q rAB) + y_P (x_Q rBA + y_Q rBB)] /
 *     (D_P D_Q) <= aySup(supA, supB, G_P, arcP) with supA =
 *     aySup(rAA, rAB, G_Q, arcQ), supB = aySup(rBA, rBB, G_Q, arcQ) -
 *     sound by nonnegative separability (x_P, y_P >= 0 and each inner
 *     ratio is capped independently); aySup is the carried Lemma AY
 *     (imp-95144) certified arc supremum.
 * (3) NEW LEMMA MC (arc-restricted merge cap - the degeneracy killer).
 *     For a doubled block with arc cell y in [ya, yc] and intra floor
 *     G: numerator <= max(caps) (x + y), (x + y)^2 = 1 + s with
 *     s = 2xy, denominator >= sqrt(1 + s G), and (1 + s)/(1 + s G) is
 *     increasing in s, so the row factor is <= sqrt((1+s*)/(1+s*G))
 *     with s* the max attainable 2xy on the arc cell (s(y) = 2y
 *     sqrt(1-y^2), unimodal, peak 1 at y = sqrt(2)/2). TIGHT at
 *     coincidence (G -> 1 gives factor -> 1) and recovers the crude
 *     sqrt(2) at G = 0. Per cell the entry is the entrywise MIN of the
 *     AY2 cap and the MC product cap - both sound. WITHOUT Lemma MC the
 *     10-D cover STALLS: near-coincident packets make the arc redundant
 *     and the caps carry ~1e-3 irreducible slack across 10 axes (the
 *     no-MC cover at 2325/10000 exhausted 4e6- and 6e6-cell budgets
 *     with 73-78 unresolved cells at depth 69 - recorded refutation of
 *     the plain nested-AY route at that constant).
 * (4) RATE-RESOLVED 10-D COVER (adaptive bisection over the six head
 *     positions (wA0, wB0) x (v1, v2) x (w1, w2), the three arcs
 *     (y0, y1, y2), and the COMMON rate mu in [47/200, 9/10]; positive
 *     caps at the mu-cell LOWER corner, intra floors at the UPPER
 *     corner - the imp-95144 sign convention; warm-started
 *     Collatz-Wielandt at inherited positive vectors, TAILSLACK on
 *     every head row): 2743216 cells, ZERO unresolved, max depth 51.
 *     Doubled ladders 3/4 are absorbed crudely inside the same cover:
 *     their rows carry the (x + y) <= sqrt(2), D >= 1 inflation (entry
 *     (3,4) gets the full factor 2), sound at every rate with no floor.
 *     Single-packet and empty blocks are the y = 0 slices and occupied
 *     subsets of the same certificate (carried subset domination).
 * (5) NEW LEMMA RM-PO (high-rate closure). For mu >= 9/10 the
 *     penalty-free crude caps close everything: every off-diagonal
 *     entry <= 2 gcap((9/10) t) at its facing gap t (both sides
 *     doubled, D >= 1, no floor needed), the 5x5 matrix certifies by
 *     Collatz-Wielandt (bound 0.9281 < 1), and g decreasing dominates
 *     every rate >= 9/10 by ONE check.
 * (6) LEMMA OD2 (carried): odd parity = even frame at exactly 2 mu;
 *     2 x 47/200 = 0.47 lies inside the covered rate interval
 *     [47/200, 9/10] - no separate odd run.
 * (7) Tails b >= 5 (doubled or single): carried Lemma TR arithmetic
 *     with the weight constant bumped 9 -> 12 (every column possibly
 *     doubled: 6 x 2 = 12 covers both-sides inflation) and the leading
 *     sqrt(2) for the doubled tail row itself; the b = 5 constant stays
 *     below 1e-13 and decreases in b; head-row tail columns are
 *     absorbed by TAILSLACK (2 x EHALF^120 = 1.8e-26 << 1e-19).
 * (8) Everything else carried from THEOREMS FP/DP: certified series
 *     caps gcap/gLo with explicit float budgets, per-entry position
 *     corner sups, the AM-GM/Collatz-Wielandt row reduction valid for
 *     every occupied subset at once, V3/V4 floors. QED (for the stated
 *     class).
 *
 * HONEST ATTRIBUTION. The constant 47/200 = 0.235 is WEAKER than the
 * DP constant 2901/12500 = 0.23208: the pair-occupancy scope costs
 * 2.9e-3 in the constant at this certification budget. The wall is
 * measured and recorded: at 234/1000 the 10-D cover exhausts a 4e6-cell
 * budget with 45 unresolved cells (at 235/1000 it terminates with
 * 2743216, zero unresolved) - the binding ridge is the DEGENERATE
 * subspace where the frame approaches the FP/DP corner value and the
 * margin shrinks toward the DP margin, forcing depth across all 10
 * axes. The class sandwich [0.2320723, 0.24502] does NOT move (THEOREM
 * HS remains the only full-class ceiling); this is a subclass cap with
 * a wider scope and a weaker constant than DP.
 *
 * WHAT THIS DOES NOT DO. (a) k >= 3 packets in one block: OPEN - and
 * the cheap route is REFUTED here: the k-uniform phantom cap (worst
 * intra spread with best cross bonds simultaneously, row factor
 * 1/sqrt(G_b)) DIVERGES on tail bonds - the inflated (b, b+1) entry
 * g(2 mu 4^b)/sqrt(g(mu 4^b) g(mu 4^{b+1})) grows like exp(+mu 4^b / 2)
 * (literals 6.39, 1.8e3, 1.2e13 at b = 2, 3, 4, mu = 47/200), at EVERY
 * rate - so the k >= 3 case needs position-resolved joint treatment
 * (the k-dimensional cone version of Lemma AY), not a uniform
 * inflation. (b) FREE RATES: imp-95144-subgap-free-rate-displacement
 * untouched. (c) The certification gap [2901/12500, 47/200) for >= 2
 * doubled blocks - NEW sub-gap imp-95145-subgap-doubled-cert-gap
 * (routes: a leaner cover past the recorded 0.234 budget wall, or a
 * no-stacking lemma - the measured < 2e-8 root increment says the
 * second doubling buys nothing; proving it would collapse PO onto DP
 * at 0.23208). (d) Model family, not the paper Section 4.5 packets.
 * (e) Changes no bound; does NOT promote Lambda <= 0.14; NO QED on the
 * parent; no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD (in-run refutations preserved).
 * (1) The plain nested-AY cover WITHOUT Lemma MC stalls at 2325/10000
 *     (73-78 unresolved at 4e6/6e6 budgets, depth 69, excess ~1.7e-4
 *     shrinking only linearly in cell width across 10 axes) - the
 *     coincidence ridge is where both packets of a block merge and the
 *     arc variable is redundant; Lemma MC is exact there and collapses
 *     the ridge.
 * (2) The k-uniform 1/sqrt(G) route to arbitrary occupancy was derived,
 *     checked, and REFUTED (tail divergence literals asserted below) -
 *     recorded so successors do not respend it on
 *     imp-95144-subgap-k-packet-ladder.
 * (3) Zero-width-cell probe: the capped frame at points reproduces the
 *     true frame value (0.99916 at 2325/10000 at the FP corner) - the
 *     caps are point-sound; the stall was pure cell slack.
 * (4) Direction-of-error audit: every cap inflates (gcap up, gLo down,
 *     position corners outward, mu corners outward per sign, AY/AY2/MC
 *     slacks up, TAILSLACK additive, warm vectors arbitrary-positive) -
 *     the certificate can fail spuriously but cannot certify
 *     spuriously.
 * (5) Batteries (measured cross-checks, not the proof): 120000 seeded
 *     Lemma MC draws (zero violations), 60000 seeded Lemma AY2 draws x
 *     9 bilinear samples (zero violations), 3000 seeded multi-doubled
 *     Lemma EP identity draws (worst < 1e-9 relative), 5000 seeded
 *     in-class pair-occupancy witnesses BOTH parities at rates >=
 *     47/200 (zero E > 0).
 *
 * Import-light (no heavy bundle, no imports). The cover and batteries
 * are recomputed by the assertions on every sweep (~25 s).
 */

const MU_PO = 47 / 200; // certified pair-occupancy constant 0.235
const MU_CL = 9 / 10; // Lemma RM-PO closure rate
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

// certified LOWER cap on g(z) - carried imp-95144 (odd truncation minus slack)
function gLo(z) {
  if (z >= 50) return 0;
  const v = (expTrunc(z, 59) - 1e-8) * (1 + z);
  return Math.max(0, v);
}

const sqrtHi = (w) => Math.sqrt(Math.max(0, w)) * (1 + 1e-12);

// carried LEMMA AY (imp-95144): certified sup over the amplitude arc cell
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

// NEW LEMMA AY2: nested cap for the doubled-doubled bond (nonneg separability)
function ay2Sup(rAA, rAB, rBA, rBB, GP, GQ, yPa, yPc, yQa, yQc) {
  const supA = aySup(rAA, rAB, GQ, yQa, yQc);
  const supB = aySup(rBA, rBB, GQ, yQa, yQc);
  return aySup(supA, supB, GP, yPa, yPc);
}

// NEW LEMMA MC (arc-restricted merge cap): row factor sqrt((1+s)/(1+sG))
// with s = max attainable 2xy on the arc cell; tight at coincidence G -> 1
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

const R2 = sqrtHi(2);

// per-cell dominating matrix, all head ladders doubled.
// axes: [wA0, wB0, v1, v2, w1, w2, y0, y1, y2, mu]
// ladders 0/1/2 exact (positions + arcs), ladders 3/4 crude sqrt(2) rows.
// Positive caps at the mu-cell LOWER corner (g decreasing), intra floors
// at the UPPER corner (valid lower bound throughout the cell).
function cellPO(b) {
  const [wA0a, wB0a, v1a, v2a, w1a, w2a, y0a, y1a, y2a, ma] = b.lo;
  const [wA0c, wB0c, v1c, v2c, w1c, w2c, y0c, y1c, y2c, mc] = b.hi;
  const G0 = gLo(mc * Math.min(1, Math.max(0, wB0c - wA0a)));
  const G1 = gLo(mc * Math.min(4, Math.max(0, v2c - v1a)));
  const G2 = gLo(mc * Math.min(16, Math.max(0, w2c - w1a)));
  const F0 = mcF(G0, y0a, y0c),
    F1 = mcF(G1, y1a, y1c),
    F2 = mcF(G2, y2a, y2c);
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => {
    M[i][j] = x;
    M[j][i] = x;
  };
  const r01 = [gcap(ma * (v1a - wA0c)), gcap(ma * (v2a - wA0c)), gcap(ma * (v1a - wB0c)), gcap(ma * (v2a - wB0c))];
  set(0, 1, Math.min(
    ay2Sup(r01[0], r01[1], r01[2], r01[3], G0, G1, y0a, y0c, y1a, y1c),
    F0 * F1 * Math.max(...r01)));
  const r02 = [gcap(ma * (w1a - wA0c)), gcap(ma * (w2a - wA0c)), gcap(ma * (w1a - wB0c)), gcap(ma * (w2a - wB0c))];
  set(0, 2, Math.min(
    ay2Sup(r02[0], r02[1], r02[2], r02[3], G0, G2, y0a, y0c, y2a, y2c),
    F0 * F2 * Math.max(...r02)));
  const r12 = [gcap(ma * (w1a - v1c)), gcap(ma * (w2a - v1c)), gcap(ma * (w1a - v2c)), gcap(ma * (w2a - v2c))];
  set(1, 2, Math.min(
    ay2Sup(r12[0], r12[1], r12[2], r12[3], G1, G2, y1a, y1c, y2a, y2c),
    F1 * F2 * Math.max(...r12)));
  const far = (cap, G, F, ya, yc) => R2 * Math.min(aySup(cap, cap, G, ya, yc), F * cap);
  set(0, 3, far(gcap(ma * (64 - wB0c)), G0, F0, y0a, y0c));
  set(0, 4, far(gcap(ma * (256 - wB0c)), G0, F0, y0a, y0c));
  set(1, 3, far(gcap(ma * (64 - v2c)), G1, F1, y1a, y1c));
  set(1, 4, far(gcap(ma * (256 - v2c)), G1, F1, y1a, y1c));
  set(2, 3, far(gcap(ma * (64 - w2c)), G2, F2, y2a, y2c));
  set(2, 4, far(gcap(ma * (256 - w2c)), G2, F2, y2a, y2c));
  set(3, 4, 2 * gcap(ma * 128));
  return M;
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

// ---- run the rate-resolved 10-D pair-occupancy cover ----
const CERT_PO = cover(
  cellPO,
  { lo: [1, 1, 4, 4, 16, 16, 0, 0, 0, MU_PO], hi: [2, 2, 8, 8, 32, 32, 1, 1, 1, MU_CL] },
  [2, 2, 8, 8, 32, 32, 1, 1, 1, 0.35],
  4e6,
  [[0, 1], [2, 3], [4, 5]]
);

// LEMMA RM-PO closure: all-pairs-doubled penalty-free matrix at mu = 9/10.
// Every entry 2 gcap((9/10) t) dominates the crude both-sides-doubled bond
// (numerators (x+y) <= sqrt(2) each, D >= 1) at every rate >= 9/10 (g decreasing).
const RM_PO = (() => {
  const t = [
    [0, 2, 14, 62, 254],
    [2, 0, 8, 56, 248],
    [14, 8, 0, 32, 224],
    [62, 56, 32, 0, 128],
    [254, 248, 224, 128, 0],
  ];
  const M = t.map((row) => row.map((x) => (x === 0 ? 0 : 2 * gcap(MU_CL * x))));
  const v = polish(M, [0.7, 0.7, 0.14, 1e-3, 1e-8], 400);
  return cwRatio(M, v);
})();

// tail arithmetic: carried Lemma TR, weight constant bumped to 12 (every
// column possibly both-sides doubled), leading sqrt(2) for the doubled tail row
const TR5_PO =
  Math.SQRT2 * ((12 * Math.pow(2, 5 - 4)) / V4_FLOOR) * Math.pow(EHALF_HI, Math.floor(2 * MU_PO * Math.pow(4, 4))) +
  Math.SQRT2 * Math.pow(EHALF_HI, Math.floor(2 * MU_PO * Math.pow(4, 5)));
const TAILCOL_PO = 2 * Math.pow(EHALF_HI, Math.floor(2 * MU_PO * Math.pow(4, 4))); // must stay < TAILSLACK

// in-run refutation literals: the k-uniform phantom cap (row factor 1/sqrt(G))
// DIVERGES on tail bonds - g(2 mu 4^b)/sqrt(g(mu 4^b) g(mu 4^{b+1}))
const KUNIF = [2, 3, 4].map((b) => {
  const z = MU_PO * Math.pow(4, b);
  return gFun(2 * z) / Math.sqrt(gFun(z) * gFun(4 * z));
});

// measured color (float, not certified): pair-occupancy family corner root
// via light coordinate ascent over the five arcs at the edge-corner geometry
const POS5 = [
  [1, 2],
  [4, 8],
  [16, 32],
  [64, 128],
  [256, 512],
];
function lamAllPO(mu, ys) {
  const g = gFun;
  const xs = ys.map((y) => [Math.sqrt(1 - y * y), y]);
  const D = POS5.map((p, b2) => Math.sqrt(1 + 2 * xs[b2][0] * xs[b2][1] * g(mu * (p[1] - p[0]))));
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  for (let b2 = 0; b2 < 5; b2++) {
    for (let c = b2 + 1; c < 5; c++) {
      let s = 0;
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) s += xs[b2][i] * xs[c][j] * g(mu * Math.abs(POS5[c][j] - POS5[b2][i]));
      }
      M[b2][c] = M[c][b2] = s / (D[b2] * D[c]);
    }
  }
  let v = [0.7, 0.7, 0.14, 1e-3, 1e-8];
  let l = 0;
  for (let it = 0; it < 300; it++) {
    const w = v.map((_, i) => M[i].reduce((sm, x2, j) => sm + x2 * v[j], 0));
    const n = Math.hypot(...w);
    l = n / Math.hypot(...v);
    v = w.map((x2) => x2 / n);
  }
  return l;
}
function supPO(mu) {
  let ys = [0.001, 0.002, 0.001, 0.001, 0.001];
  let best = lamAllPO(mu, ys);
  for (let round = 0; round < 4; round++) {
    for (let b2 = 0; b2 < 5; b2++) {
      let by = ys[b2];
      let bl = best;
      for (let k = 0; k <= 40; k++) {
        const y = k <= 20 ? (k / 20) * 0.01 : 0.01 + ((k - 20) / 20) * 0.99;
        const t = ys.slice();
        t[b2] = y;
        const l = lamAllPO(mu, t);
        if (l > bl) {
          bl = l;
          by = y;
        }
      }
      ys[b2] = by;
      best = bl;
    }
  }
  return best;
}
const ROOT_PO = (() => {
  let lo = 0.23206;
  let hi = 0.23209;
  for (let i = 0; i < 26; i++) {
    const m = (lo + hi) / 2;
    if (supPO(m) > 1) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
})();

// carried float landmarks (measured only)
const ROOT_DW_FAMILY_CARRIED = 0.23207238781359468; // one-doubled DW family root (imp-95143/95144)
const ROOT_PO_LIT = 0.23207238946117456; // pair-occupancy family root (this module, measured)

// ---- seeded batteries (deterministic LCG, per-battery reseed) ----
let seedState = 0;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}

// battery MC (seed 737373): the merge cap dominates sampled exact row factors
function runMcBattery() {
  seedState = 737373;
  let viol = 0;
  let worst = -Infinity;
  for (let t = 0; t < 120000; t++) {
    const A = rnd() * 1.2;
    const B = rnd() * 1.2;
    const Gfloor = rnd() * 0.999;
    const Gtrue = Gfloor + (1 - Gfloor) * rnd();
    let ya = rnd();
    let yc = rnd();
    if (ya > yc) {
      const s = ya;
      ya = yc;
      yc = s;
    }
    const cap = mcF(Gfloor, ya, yc) * Math.max(A, B);
    for (let k = 0; k <= 4; k++) {
      const y = ya + ((yc - ya) * k) / 4;
      const r = Math.sqrt(fsqAt(y, A, B, Gtrue)) / Math.max(cap, 1e-30);
      if (r > 1 + 1e-9) viol++;
      if (r > worst) worst = r;
    }
  }
  return { viol, worst };
}

// battery AY2 (seed 848484): the nested cap dominates sampled bilinear bonds
function runAy2Battery() {
  seedState = 848484;
  let viol = 0;
  let worst = -Infinity;
  for (let t = 0; t < 60000; t++) {
    const r = [rnd() * 1.2, rnd() * 1.2, rnd() * 1.2, rnd() * 1.2];
    const GP = rnd() * 0.999;
    const GQ = rnd() * 0.999;
    let yPa = rnd();
    let yPc = rnd();
    if (yPa > yPc) {
      const s = yPa;
      yPa = yPc;
      yPc = s;
    }
    let yQa = rnd();
    let yQc = rnd();
    if (yQa > yQc) {
      const s = yQa;
      yQa = yQc;
      yQc = s;
    }
    const cap = ay2Sup(r[0], r[1], r[2], r[3], GP, GQ, yPa, yPc, yQa, yQc);
    for (let a = 0; a <= 2; a++) {
      for (let c = 0; c <= 2; c++) {
        const yP = yPa + ((yPc - yPa) * a) / 2;
        const yQ = yQa + ((yQc - yQa) * c) / 2;
        const xP = Math.sqrt(Math.max(0, 1 - yP * yP));
        const xQ = Math.sqrt(Math.max(0, 1 - yQ * yQ));
        const num = xP * (xQ * r[0] + yQ * r[1]) + yP * (xQ * r[2] + yQ * r[3]);
        const den = Math.sqrt(1 + 2 * xP * yP * GP) * Math.sqrt(1 + 2 * xQ * yQ * GQ);
        const ratio = num / den / Math.max(cap, 1e-30);
        if (ratio > 1 + 1e-9) viol++;
        if (ratio > worst) worst = ratio;
      }
    }
  }
  return { viol, worst };
}

// battery EP-PO (seed 959595): the MULTI-block effective-packet folding is an
// identity - E by the direct packet form equals E by the fully folded form
function runEpPoBattery() {
  seedState = 959595;
  let worstRel = 0;
  let count = 0;
  for (let t = 0; t < 3000; t++) {
    const odd = t % 2 === 1;
    const mu = MU_PO * (1 + rnd());
    const us = [];
    const as = [];
    const blocks = [];
    for (let b = 0; b < 4; b++) {
      if (rnd() < 0.2) continue;
      const base = Math.pow(4, b) * (odd ? 2 : 1);
      const reps = rnd() < 0.6 ? 2 : 1;
      for (let r = 0; r < reps; r++) {
        us.push(base * (1 + rnd()));
        as.push(Math.pow(10, -1 + 2 * rnd()));
        blocks.push(b);
      }
    }
    if (us.length < 2) continue;
    const n = us.length;
    const rho = (i, j) => gFun(mu * Math.abs(us[i] - us[j]));
    let Edir = 0;
    for (let i = 0; i < n; i++) Edir -= as[i] * as[i];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const sgn = blocks[i] === blocks[j] ? -1 : 1;
        Edir += 2 * sgn * as[i] * as[j] * rho(i, j);
      }
    }
    // fold every doubled block into its effective packet
    const occ = [...new Set(blocks)];
    const fold = {};
    for (const b of occ) {
      const idx = [];
      for (let i = 0; i < n; i++) if (blocks[i] === b) idx.push(i);
      if (idx.length === 2) {
        const s = Math.hypot(as[idx[0]], as[idx[1]]);
        const x = as[idx[0]] / s;
        const y = as[idx[1]] / s;
        const den = Math.sqrt(1 + 2 * x * y * rho(idx[0], idx[1]));
        fold[b] = { idx, w: [x, y], sigma: s * den, den };
      } else {
        fold[b] = { idx, w: [1], sigma: as[idx[0]], den: 1 };
      }
    }
    let Eeff = 0;
    for (const b of occ) Eeff -= fold[b].sigma * fold[b].sigma;
    for (let a = 0; a < occ.length; a++) {
      for (let c = a + 1; c < occ.length; c++) {
        const P = fold[occ[a]];
        const Q = fold[occ[c]];
        let num = 0;
        for (let i = 0; i < P.idx.length; i++) {
          for (let j = 0; j < Q.idx.length; j++) num += P.w[i] * Q.w[j] * rho(P.idx[i], Q.idx[j]);
        }
        const rhoHat = num / (P.den * Q.den);
        Eeff += 2 * P.sigma * Q.sigma * rhoHat;
      }
    }
    const rel = Math.abs(Edir - Eeff) / Math.max(1e-30, Math.abs(Edir));
    if (rel > worstRel) worstRel = rel;
    count++;
  }
  return { worstRel, count };
}

// exact sibling Gram kernel (identical to imp-95130..95144) for the witness battery
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// battery W (seed 161616): THEOREM PO approached directly - seeded in-class
// pair-occupancy witnesses (any subset of ladders 0..6 doubled, both
// parities, free positions, common rate >= 47/200, zeros allowed)
function runWitnessBattery() {
  seedState = 161616;
  let maxE = -Infinity;
  let viol = 0;
  let count = 0;
  for (let t = 0; t < 5000; t++) {
    const odd = t % 2 === 1;
    const mu = t % 3 === 0 ? MU_PO : MU_PO * (1 + 2 * rnd());
    const us = [];
    const as = [];
    const blocks = [];
    for (let b = 0; b < 7; b++) {
      if (rnd() < 0.35) continue;
      const base = Math.pow(4, b) * (odd ? 2 : 1);
      const reps = rnd() < 0.55 ? 2 : 1;
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

const BAT_MC = runMcBattery();
const BAT_AY2 = runAy2Battery();
const BAT_EP = runEpPoBattery();
const BAT_W = runWitnessBattery();

// baked literals (recomputed by the assertions)
const PO_CELLS_LIT = 2743216;

export const IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP = {
  ticket:
    "imp-95145 (THEOREM PO: pair-occupancy displacement cap - every parity-pure MAJ witness at one COMMON rate >= 47/200 = 0.235 with at most TWO packets in EVERY block (any number of doubled blocks), any finite same-parity block set, free positions, nonnegative amplitudes, has E <= 0. Combined with THEOREM DW (imp-95143): the common-rate pair-occupancy subclass threshold is certified inside [2320723/10000000, 47/200) = [0.2320723, 0.235). Any E > 0 witness at a common rate >= 0.235 now needs >= 3 packets in one block; the >= 2-doubled-blocks channel of imp-95144-subgap-k-packet-ladder is CLOSED above 47/200)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes THEOREM FP/DP (imp-95142/95144) machinery (gcap/gLo caps, Lemma EP folding, Lemma AY arc sup, rate-resolved covers, CW at any positive vector, TAILSLACK, Lemma TR, Lemma OD2) and THEOREM DW (imp-95143) as the subclass floor; directly narrows imp-95144-subgap-k-packet-ladder.",
  theoremPO:
    "Class: at most two packets in every block (any number of blocks doubled), all blocks one parity, positions free, amplitudes nonnegative, ONE COMMON rate >= 47/200. Claim: E <= 0. Proof: LEMMA EP per doubled block (carried exact folding; multi-block folding verified as an identity) + NEW LEMMA AY2 (nested subcone cap for the doubled-doubled bond - the bilinear bond factorizes and the inner arc sups feed the outer Lemma AY soundly by nonnegative separability) + NEW LEMMA MC (arc-restricted merge cap sqrt((1+s)/(1+sG)) with s the max attainable 2xy on the arc cell - exact at packet coincidence, recovers sqrt(2) at G = 0; entrywise MIN with AY2) + RATE-RESOLVED 10-D adaptive warm-started Collatz-Wielandt cover over six head positions x three arcs x common rate in [47/200, 9/10] (2743216 cells, ZERO unresolved, depth 51; ladders 3/4 doubled crudely inside the same cover via sqrt(2) row inflation, entry (3,4) factor 2) + NEW LEMMA RM-PO (penalty-free all-doubled closure at 9/10: bound 0.9281 < 1 dominates every rate >= 9/10 by monotone decrease of g) + LEMMA OD2 (odd parity = even frame at 2mu = 0.47, inside the covered rate interval) + carried Lemma TR tails with the weight constant bumped to 12.",
  pairOccupancyBracket:
    "Common-rate pair-occupancy subclass threshold certified inside [2320723/10000000, 47/200). Floor: THEOREM DW witness (one doubled block, in-class). Cap: this module. Measured color (float only): the pair-occupancy family corner root is 0.23207238946117456, within 2e-8 of the one-doubled DW family root 0.23207238781359468 - additional doublings do NOT stack the displacement credit in this frame (only one interior block can collect it); the certification gap [2901/12500, 47/200) for >= 2 doubled blocks is a budget artifact of the 10-D cover (the 234/1000 run exhausts 4e6 cells with 45 unresolved - recorded), not a believed witness region.",
  structuralConsequence:
    "Any FULL-class parity-pure witness with E > 0 at a common rate >= 47/200 must place at least THREE packets in one block. Below 47/200 the surviving common-rate channels are: >= 3 packets in one block (all rates down to the class floor), and >= 2 doubled blocks only inside the certification gap [2901/12500, 47/200) (one doubled block is closed at 2901/12500 by THEOREM DP). Free rates survive separately (imp-95144-subgap-free-rate-displacement untouched).",
  honestAttribution:
    "The constant 47/200 is WEAKER than the DP constant 2901/12500 = 0.23208: the pair-occupancy scope costs 2.9e-3 at this certification budget, and the wall is recorded plainly (10-D cover at 234/1000: 45 unresolved at a 4e6-cell budget; at 235/1000: 2743216 cells, zero unresolved). The class sandwich [0.2320723, 0.24502] does NOT move; THEOREM HS remains the only full-class ceiling. The lemma gains are AY2 (nested arc cap) and MC (the arc-restricted merge cap that collapses the coincidence ridge: without it the cover stalls at 2325/10000 with 73-78 unresolved cells - the plain nested-AY route is REFUTED as a certification route at that constant). The k-uniform 1/sqrt(G) route to k >= 3 occupancy was derived and REFUTED in-run (tail bond inflation diverges like exp(mu 4^b / 2); literals asserted).",
  subGaps: [
    "imp-95145-subgap-doubled-cert-gap - NEW: close the certification gap [2901/12500, 47/200) for >= 2 doubled blocks; routes: a leaner cover past the recorded 234/1000 budget wall, or a no-stacking lemma (the measured root increment < 2e-8 says the second doubling buys nothing; proving it collapses THEOREM PO onto the DP constant).",
    "imp-95144-subgap-k-packet-ladder - NARROWED: the >= 2-doubled-blocks half is CLOSED above 47/200 by this module; surviving: k >= 3 packets in one block (needs the k-dimensional cone version of Lemma AY - the k-uniform phantom inflation is REFUTED here by tail divergence), plus the certification gap above.",
    "imp-95144-subgap-free-rate-displacement - OPEN, untouched: the intra-block floors used here exist only at a common rate.",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this is a subclass ceiling step; the phi-conditional odd-mass bound is untouched",
    "the class sandwich [0.2320723, 0.24502] is carried unchanged - the full-class ceiling needs the k >= 3 channel priced, and the free-rate channel is untouched",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM PO is unconditional given the carried THEOREM FP/DP machinery: Lemma EP folding is an algebraic identity (verified on 3000 seeded multi-doubled draws to < 1e-9 relative), Lemma AY2 is sound by nonnegative separability over the carried Lemma AY (60000-draw battery, zero violations), Lemma MC is an elementary monotone bound with the arc-restricted s (120000-draw battery, zero violations), the 10-D cover is deterministic bisection with Collatz-Wielandt at arbitrary positive vectors and ZERO unresolved cells (positive caps at the mu-cell lower corner, intra floors at the upper corner - the imp-95144 sign convention), Lemma RM-PO closes the ray mu >= 9/10 penalty-free (no intra floor used, so no rate trap), Lemma OD2 folds odd parity in at 2mu inside the covered interval, and the tail constants are explicit (TR weight 12, TAILSLACK absorbs the doubled tail columns). Every approximation inflates caps - the certificate can fail spuriously but cannot certify spuriously. Scope: parity-pure model family, ONE COMMON RATE, AT MOST TWO PACKETS PER BLOCK; k >= 3 packets in a block and free rates are named sub-gaps, not covered; the constant 47/200 is weaker than the DP constant and the gap [2901/12500, 47/200) for >= 2 doubled blocks is a recorded certification gap; the class sandwich [0.2320723, 0.24502] is carried unchanged; float landmarks (pair-occupancy root 0.23207238946117456, DW family root 0.23207238781359468) are measured only; imp-95140-subgap-displacement-credit and parent imp-95130-subgap-phi-conditional-odd-mass stay OPEN; floors and ceilings of the Lambda program untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED on the parent; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP_ASSERTIONS = [
  {
    id: "imp95145-po-cover-certifies",
    description:
      "the rate-resolved 10-D pair-occupancy cover over [47/200, 9/10] terminates with ZERO unresolved cells (2743216 cells, depth < 90), worst certified bound strictly below 1",
    holds: () =>
      CERT_PO.unresolved === 0 &&
      CERT_PO.cells === PO_CELLS_LIT &&
      CERT_PO.worst < 1 &&
      CERT_PO.worst > 0.9 &&
      CERT_PO.maxDepth < 90,
  },
  {
    id: "imp95145-rm-po-closure",
    description:
      "Lemma RM-PO: the all-pairs-doubled penalty-free frame at mu = 9/10 certifies (bound in (0.9, 0.95), < 1) and dominates every common rate >= 9/10 by monotone decrease of g; Lemma OD2 folds odd parity in at 2 x 47/200 = 0.47 inside the covered interval [47/200, 9/10]",
    holds: () => RM_PO < 0.95 && RM_PO > 0.9 && 2 * MU_PO > MU_PO && 2 * MU_PO < MU_CL,
  },
  {
    id: "imp95145-mc-battery",
    description:
      "Lemma MC approached directly: 120000 seeded (A, B, G-floor, G-true, arc-cell) draws x 5 arc samples - the arc-restricted merge cap dominates every sampled exact row factor (zero violations)",
    holds: () => BAT_MC.viol === 0 && BAT_MC.worst <= 1 + 1e-9 && BAT_MC.worst > 0.9,
  },
  {
    id: "imp95145-ay2-battery",
    description:
      "Lemma AY2 approached directly: 60000 seeded (4 caps, 2 floors, 2 arc-cells) draws x 9 bilinear samples - the nested cap dominates every sampled doubled-doubled bond (zero violations)",
    holds: () => BAT_AY2.viol === 0 && BAT_AY2.worst <= 1 + 1e-9 && BAT_AY2.worst > 0.9,
  },
  {
    id: "imp95145-ep-multi-identity",
    description:
      "multi-block Lemma EP approached directly: 3000 seeded configurations with several doubled blocks (both parities) - E by the direct packet form and E by the fully folded effective form agree to < 1e-9 relative (identity, not a bound)",
    holds: () => BAT_EP.count > 2800 && BAT_EP.worstRel < 1e-9,
  },
  {
    id: "imp95145-witness-battery",
    description:
      "THEOREM PO approached directly: 5000 seeded in-class pair-occupancy witnesses (any subset of ladders 0..6 doubled, BOTH parities, free positions, common rate >= 47/200 pinned at the floor every third draw, amplitude zeros allowed) - zero E > 0 draws",
    holds: () => BAT_W.viol === 0 && BAT_W.maxE < 0 && BAT_W.count > 4800,
  },
  {
    id: "imp95145-kuniform-divergence",
    description:
      "in-run refutation preserved: the k-uniform phantom inflation 1/sqrt(G) makes the inflated tail bond g(2 mu 4^b)/sqrt(g(mu 4^b) g(mu 4^{b+1})) DIVERGE (values > 6, > 1.8e3, > 1e13 at b = 2, 3, 4 and strictly increasing) - the uniform-inflation route to k >= 3 occupancy is dead at every rate",
    holds: () => KUNIF[0] > 6 && KUNIF[1] > 1.8e3 && KUNIF[2] > 1e13 && KUNIF[0] < KUNIF[1] && KUNIF[1] < KUNIF[2],
  },
  {
    id: "imp95145-bracket-ordering",
    description:
      "pair-occupancy bracket anchors: DW certified floor 2320723/10000000 < DW family root 0.23207238781359468 (carried) < pair-occupancy family root (recomputed to 2e-8, stacking increment < 2e-8) < DP constant 2901/12500 < 47/200; the closure rate 9/10 exceeds the doubled odd rate",
    holds: () =>
      MU_DW < ROOT_DW_FAMILY_CARRIED &&
      ROOT_DW_FAMILY_CARRIED < ROOT_PO &&
      Math.abs(ROOT_PO - ROOT_PO_LIT) < 2e-8 &&
      ROOT_PO - ROOT_DW_FAMILY_CARRIED < 2e-8 &&
      ROOT_PO < MU_DP &&
      MU_DP < MU_PO &&
      MU_PO < MU_CL,
  },
  {
    id: "imp95145-tail-arithmetic",
    description:
      "tail arithmetic: the weight-12 doubled-tails Lemma TR constant at b = 5 stays below 1e-13 (decreasing in b), and the doubled head-row tail-column mass 2 x EHALF^120 stays far inside TAILSLACK = 1e-19",
    holds: () =>
      TR5_PO < 1e-13 && TR5_PO > 0 && TAILCOL_PO < TAILSLACK && TAILCOL_PO < 2e-26 && Math.floor(2 * MU_PO * 256) === 120,
  },
  {
    id: "imp95145-cap-validity",
    description:
      "cap validity: gLo(z) <= g(z) <= gcap(z) on a 400-point grid over [0, 49.9]; gLo is 0 beyond 50; the intra-floor arguments used by the cover (mu-cell max times block width) stay below 50 at the closure rate; mcF is at most sqrt(2)(1 + 1e-9) and tends to 1 as G tends to 1 on the full arc",
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
    id: "imp95145-honesty-gate",
    description:
      "the verdict is scoped: COMMON RATE only, at most two packets per block, constant weaker than DP recorded, certification gap named, class sandwich carried unchanged, k >= 3 and free-rate sub-gaps OPEN, float landmarks measured only; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP.promotesBound === false &&
      /NO QED/.test(IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP.rigorScope) &&
      /refereed bound is changed/i.test(IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP.rigorScope) &&
      /ONE COMMON RATE/.test(IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP.rigorScope) &&
      /weaker than the DP constant/.test(IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP.rigorScope) &&
      /measured only/.test(IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP.rigorScope) &&
      /certification gap/.test(IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP.structuralConsequence) &&
      /recorded plainly/.test(IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP.honestAttribution) &&
      /carried unchanged/.test(IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP.openResiduals[1]) &&
      /remains OPEN/.test(IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP.openResiduals[0]) &&
      IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP.subGaps.length === 3 &&
      IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP.openResiduals.length === 3,
  },
];

for (const a of IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95145-pair-occupancy-displacement-cap assertion failed: ${a.id}`);
  }
}

export default IMP95145_PAIR_OCCUPANCY_DISPLACEMENT_CAP;
