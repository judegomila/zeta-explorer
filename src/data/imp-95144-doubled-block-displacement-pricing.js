/**
 * imp-95144 - THEOREM DP (doubled-block displacement pricing, certified
 * common-rate threshold 2901/12500 = 0.23208): every parity-pure MAJ
 * witness at ONE COMMON rate mu >= 2901/12500, with AT MOST TWO packets
 * in ONE block and at most one packet in every other block (any finite
 * same-parity block set, positions FREE inside their dyadic blocks,
 * nonnegative amplitudes), has E <= 0.
 *
 * WHAT THIS PRICES (the reason this narrows the open ceiling leg):
 * THEOREM DW (imp-95143) exhibited the first multi-packet witness - one
 * extra packet displaced to the far edge of the middle block - with
 * certified E > 0 at 2320723/10000000 = 0.2320723, refuting the
 * "multi-packet never helps" closing route. This module certifies the
 * OTHER side of that mechanism: one displaced packet cannot reach
 * 2901/12500. Combined, the common-rate one-doubled-block subclass
 * threshold is certified inside
 *   [2320723/10000000, 2901/12500)  =  [0.2320723, 0.23208),
 * width 7.7e-6 - the FIRST two-sided certified pricing of the
 * displacement credit named by imp-95140-subgap-displacement-credit.
 * The certified credit of the realized mechanism over the carried
 * one-per-block position-polytope limit 0.23207203643507168 (measured,
 * imp-95141/95142/95143) is therefore between +2.64e-7 (witness-realized)
 * and +7.96e-6 (this cap). Any witness with E > 0 at a common rate
 * >= 2901/12500 must now use AT LEAST THREE packets in one block or
 * double AT LEAST TWO blocks; with unequal rates the doubled-block
 * route survives only through the rate-decorrelation channel (named
 * sub-gap below).
 *
 * THEOREM DP. Class: packets at positions u_i in [2^{b_i}, 2^{b_i+1}),
 * all b_i of one parity, at most one block index repeated and that at
 * most twice; amplitudes a_i >= 0; ONE COMMON rate mu >= 2901/12500.
 * Claim: E = -sum a_i^2/mu
 * + 2 sum_{i<j} a_i a_j K(mu, mu, |u_i - u_j|) <= 0.
 *
 * PROOF CHAIN (new lemmas elementary; the rest carried from THEOREM FP):
 * (1) NEW LEMMA EP (exact effective-packet reduction). In normalized
 *     coordinates B_i = a_i/sqrt(mu), rho_ij = g(mu |u_i - u_j|),
 *     g(z) = exp(-z)(1+z), the doubled block b with packets at
 *     (wA, wB), amplitudes s(x, y), x^2 + y^2 = 1, x, y >= 0,
 *     contributes EXACTLY like one effective packet of amplitude
 *     sigma = s sqrt(1 + 2 x y rhoAB) and correlation row
 *       rhoHat_k = (x rho_Ak + y rho_Bk) / sqrt(1 + 2 x y rhoAB)
 *     - an algebraic identity on the cluster Gram form (norm(F_b)^2 =
 *     s^2 (1 + 2 x y rhoAB); cross terms are linear in F_b). At a COMMON
 *     rate rhoAB = g(mu (wB - wA)) >= g(mu width_b) > 0: the intra-block
 *     penalty has a floor. (Free rates DESTROY this floor - the mixed
 *     kernel decorrelates while the geometry stands still; this is the
 *     imp-95140 rate-aware Gram cross-term wall, and it is why the
 *     theorem is scoped to a common rate. Recorded refutation: setting
 *     the floor to 0 - the free-rate decorrelation limit - makes the
 *     frame FAIL at the DW corner, lamMax = 1.2745 > 1, literal below.)
 * (2) NEW LEMMA AY (subcone copositivity cap - the certified arc
 *     supremum). For A, B >= 0 and 0 <= G <= rhoAB a certified lower
 *     bound: f(y) = (x A + y B)/sqrt(1 + 2 x y G), x = sqrt(1 - y^2),
 *     satisfies f^2 <= C on the arc segment y in [ya, yc] iff the 2x2
 *     form Q_C = [[A^2 - C, AB - CG], [AB - CG, B^2 - C]] is <= 0 on the
 *     cone spanned by the endpoint directions e_a, e_c - checked by
 *     Q_C(e_a) <= 0, Q_C(e_c) <= 0, and (e_a Q_C e_c <= 0 OR
 *     (e_a Q_C e_c)^2 <= Q_C(e_a) Q_C(e_c)) - three sign checks with
 *     explicit float slacks. Full-arc fallback (valid on any segment):
 *     C = max(A^2, B^2, (A^2 + B^2 - 2ABG)/(1 - G^2)), proved by the
 *     same form at the quadrant edges (the discriminant identity
 *     (C - A^2)(C - B^2) - (AB - CG)^2 = C (1 - G^2)(C - C_int) with
 *     C_int the displayed ratio, and (B - AG)^2 >= 0 shows C_int
 *     dominates both squares whenever it is the max). f is increasing in
 *     A and B and decreasing in G, so corner caps gcap (upper, carried)
 *     and gLo (lower, new: N = 59 odd-truncation alternating series
 *     minus 1e-8, valid z < 61, set to the trivial floor 0 for z >= 50)
 *     feed it soundly. Lemma AY treats the numerator and denominator of
 *     the effective row JOINTLY - per-corner caps with a separately
 *     lower-bounded denominator were tried FIRST and REFUTED as a
 *     certification route (skeptical record below).
 * (3) RATE-RESOLVED CELL COVERS (adaptive bisection over positions x
 *     amplitude arc x COMMON RATE mu in [2901/12500, 3/5], warm-started
 *     Collatz-Wielandt at inherited positive vectors - any positive
 *     vector is valid, carried imp-95138/95141/95142 direction;
 *     TAILSLACK added to every head row). Per cell the positive entry
 *     caps are evaluated at the mu-cell LOWER corner (g decreasing) and
 *     the intra-block floor G = gLo(mu_hi * sepMax) at the UPPER corner
 *     (a valid lower bound of rhoAB throughout the cell). Doubled
 *     ladder 1 (even blocks 0/2/4/6/8 = ladders 0..4, doubled positions
 *     v1 <= v2 in [4, 8], amplitude arc y, rate mu): 4-D cover, 264083
 *     cells, ZERO unresolved. Doubled ladder 0 ((wA, wB) in [1, 2], torn
 *     u1 retained): 5-D, 200310 cells, ZERO unresolved. Doubled ladder 2
 *     ((wA, wB) in [16, 32]): 5-D, 141393 cells, ZERO unresolved.
 *     Doubled ladders 3/4: the (x + y) <= sqrt(2), D >= 1 crude row
 *     inflation over the carried 14-cell FP u1-cover at the mu* caps -
 *     valid for ALL mu >= mu* at once (true g decreasing; the inflation
 *     is mu-free). Doubled tail ladder b >= 5: Lemma TR arithmetic with
 *     the weight constant bumped 6 -> 9 (one column sqrt(2)-inflated) -
 *     the b = 5 value stays < 1e-13 and decreases in b; head-row tail
 *     columns absorb the sqrt(2) inside TAILSLACK
 *     (sqrt(2) EHALF^118 = 3.4e-26 << 1e-19).
 * (4) NEW LEMMA RM (high-rate closure). For mu >= 3/5 the PENALTY-FREE
 *     caps close everything: the effective row is entrywise
 *     <= sqrt(capA^2 + capB^2) (Lemma AY at G = 0, full arc), every cap
 *     g(mu t) <= g((3/5) t) by monotone decrease of g itself, and the
 *     three per-case penalty-free matrices at mu = 3/5 certify by
 *     Collatz-Wielandt (bounds 0.9453 / 0.9490 / 0.6729 < 1) - so ONE
 *     check per case covers the whole ray mu >= 3/5.
 * (5) LEMMA OD2 (odd parity by exact rate doubling). The odd-parity
 *     ladder ([2*4^b, 4*4^b)) is the image of the even ladder under
 *     v -> 2v: every width, facing gap and intra-block separation
 *     doubles EXACTLY, so an odd witness at common rate mu equals the
 *     even frame at rate 2mu >= 2 * 2901/12500 > 2901/12500 - already
 *     inside the certified rate range. No separate odd run is needed.
 * (6) Everything else carried from THEOREM FP (imp-95142): certified
 *     series caps gcap with explicit float budgets, Lemma EC for z > 15,
 *     per-entry position sups, the AM-GM/Collatz-Wielandt row reduction
 *     valid for every occupied subset at once, V3/V4 floors, TAILSLACK,
 *     Lemma TR. QED (for the stated class).
 *
 * HONEST ATTRIBUTION. The CONSTANT 2901/12500 is the THEOREM FP constant
 * reused; the certified class sandwich [0.2320723, 0.24502] does NOT
 * move (the upper end THEOREM HS is full-class; this theorem is a
 * subclass cap). The gain is scope + mechanism pricing: the doubled
 * block was previously covered by NO ceiling statement at any constant
 * below THEOREM HS 12251/50000 = 0.24502; it is now capped at 0.23208,
 * within 7.7e-6 of the certified witness floor. The 3.9e-7 sliver
 * between the DW family root 0.23207238781359468 (measured, carried) and
 * 0.23208 was NOT chased: this frame has corner root ~0.2320734
 * (measured below) and the FP-corner margin structure caps how far it
 * can be pushed; recorded so successors do not respend it.
 *
 * WHAT THIS DOES NOT DO. (a) FREE RATES: the intra-block floor
 * g(mu width) needs a common rate; the free-rate extension needs a
 * rate-aware lower bound on the intra correlation GIVEN retained cross
 * bonds (an off-rate packet decorrelates from its own block AND from its
 * bond partners at the same sqrt(mu_min/m) scale - the recorded
 * dichotomy route) - NEW sub-gap imp-95144-subgap-free-rate-displacement.
 * (b) k >= 3 packets in a block / two doubled blocks: Lemma EP
 * generalizes (effective packet over a (k-1)-sphere amplitude arc with a
 * pairwise penalty matrix) but Lemma AY needs the k-dimensional cone
 * version - NEW sub-gap imp-95144-subgap-k-packet-ladder. (c) The class
 * ceiling stays THEOREM HS 0.24502: imp-95140-subgap-displacement-credit
 * stays OPEN, NARROWED to {free rates} u {k >= 3 in a block} u {>= 2
 * doubled blocks} below 0.23208 plus the full-class interval
 * [0.23208, 0.24502] above it. (d) Model family, not the paper Section
 * 4.5 packets. (e) Changes no bound; does NOT promote Lambda <= 0.14;
 * NO QED on the parent; no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD (in-run refutations preserved).
 * (1) Per-corner numerator caps with a separately lower-bounded
 *     denominator (the direct FP-style cell cap) FAIL as a certification
 *     route: the numerator peaks at one y-endpoint and the denominator
 *     bottoms at the other (a phantom split of the shared amplitude
 *     variable), inflating every cell by ~0.77 * y-width; two cover
 *     attempts exhausted 3e6-cell budgets with hundreds of unresolved
 *     cells (one stuck at the depth-60 cap). Lemma AY removes the
 *     phantom exactly; the same covers then terminate 16x smaller with
 *     ZERO unresolved.
 * (2) SOUNDNESS BUG CAUGHT IN-RUN: the first draft evaluated the
 *     intra-block floor gLo at mu* ONLY while claiming all common rates
 *     >= mu* - REFUTED by self-check: at higher common rates the true
 *     intra correlation g(mu sep) drops BELOW the mu* floor and the
 *     denominator over-credits the penalty. Fixed by adding the rate as
 *     a cover axis ([mu*, 3/5], floor at the mu-cell upper corner) plus
 *     the Lemma RM penalty-free closure at 3/5. The positive entries
 *     never had this problem (g decreasing makes mu*-caps sound for all
 *     higher rates), which is exactly why THEOREM FP could stay
 *     single-rate - the trap is specific to the NEGATIVE-term floor.
 * (3) The penalty-free frame (G = 0, the free-rate decorrelation limit)
 *     was evaluated at the DW corner at mu* and FAILS: lamMax = 1.2745
 *     > 1 (literal asserted below) - the common-rate scope is essential,
 *     not decorative, and the free-rate sub-gap is genuine.
 * (4) Direction-of-error audit: every cap inflates (gcap up, gLo down,
 *     position corners outward, mu-corners outward per sign, AY slacks
 *     up, TAILSLACK additive, warm vectors arbitrary-positive) - the
 *     certificate can fail spuriously but cannot certify spuriously.
 * (5) Batteries (measured cross-checks, not the proof): 200000 seeded
 *     Lemma AY draws x 7 arc samples (zero violations); 4000 seeded
 *     Lemma EP identities (doubled-block E by packet form vs effective
 *     form, worst relative gap < 1e-9); 5000 seeded in-class witnesses
 *     (one doubled block among ladders 0..6, BOTH parities, free
 *     positions, zeros allowed, rate pinned at the floor every third
 *     draw): max E < 0, zero E > 0.
 *
 * Import-light (no heavy bundle, no imports). The covers and batteries
 * are recomputed by the assertions on every sweep.
 */

const MU_DP = 2901 / 12500; // certified constant 0.23208 (THEOREM FP constant, scope extended)
const MU_CAP = 3 / 5; // Lemma RM closure rate: penalty-free frames certify for all mu >= 3/5
const MU_DW = 2320723 / 10000000; // carried THEOREM DW witness rate (subclass floor)
const EHALF_HI = 0.60653067; // > exp(-1/2), carried
const TAILSLACK = 1e-19; // absorbs sqrt(2)-bumped tail columns: sqrt(2) * EHALF_HI^118 = 3.4e-26
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

// certified upper cap on g(z) - carried THEOREM FP step (3)
function gcap(z) {
  if (z <= 4) return (expTrunc(z, 60) + 1e-8) * (1 + z);
  if (z <= 15) return (expTrunc(z, 60) + 1e-6) * (1 + z);
  return Math.pow(EHALF_HI, Math.floor(z)) * (1 + 1e-9);
}

// NEW certified LOWER cap on g(z): N = 59 odd truncation is a lower bound of
// exp(-z) for 0 <= z < 61; minus 1e-8 float slack; trivial floor 0 beyond 50
function gLo(z) {
  if (z >= 50) return 0;
  const v = (expTrunc(z, 59) - 1e-8) * (1 + z);
  return Math.max(0, v);
}

const sqrtHi = (w) => Math.sqrt(Math.max(0, w)) * (1 + 1e-12);

// LEMMA AY: certified sup over {x, y >= 0, x^2 + y^2 = 1, y in [ya, yc]} of
// f = (x A + y B)/sqrt(1 + 2 x y G), for A, B >= 0, 0 <= G < 1.
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

// adaptive bisection cover with warm-started vectors; ZERO unresolved required
function cover(cellFn, box0, scales, maxCells, tri) {
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
    for (const c of [c1, c2]) if (!tri || !(c.lo[tri[0]] > c.hi[tri[1]])) stack.push(c);
  }
  return { cells: n, worst, maxDepth, unresolved };
}

// per-cell dominating matrices (even 5-ladder head; ladders 0..4 = blocks
// 0/2/4/6/8, positions [4^b, 2*4^b); facing-edge gaps as THEOREM FP).
// Positive entries at the mu-cell LOWER corner (g decreasing), the intra
// floor G at the mu-cell UPPER corner (valid lower bound throughout).
// axes: (v1, v2, y, mu)
function cellL1(b) {
  const [v1a, v2a, ya, ma] = b.lo;
  const [v1c, v2c, yc, mc] = b.hi;
  const G = gLo(mc * Math.min(4, Math.max(0, v2c - v1a)));
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => {
    M[i][j] = x;
    M[j][i] = x;
  };
  set(0, 1, aySup(gcap(ma * (v1a - 2)), gcap(ma * (v2a - 2)), G, ya, yc));
  set(1, 2, aySup(gcap(ma * (16 - v1c)), gcap(ma * (16 - v2c)), G, ya, yc));
  set(1, 3, aySup(gcap(ma * 56), gcap(ma * 56), G, ya, yc));
  set(1, 4, aySup(gcap(ma * 248), gcap(ma * 248), G, ya, yc));
  set(0, 2, gcap(ma * 14));
  set(0, 3, gcap(ma * 62));
  set(0, 4, gcap(ma * 254));
  set(2, 3, gcap(ma * 32));
  set(2, 4, gcap(ma * 224));
  set(3, 4, gcap(ma * 128));
  return M;
}
// axes: (wA, wB, u1, y, mu)
function cellL0(b) {
  const [wAa, wBa, u1a, ya, ma] = b.lo;
  const [wAc, wBc, u1c, yc, mc] = b.hi;
  const G = gLo(mc * Math.min(1, Math.max(0, wBc - wAa)));
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => {
    M[i][j] = x;
    M[j][i] = x;
  };
  set(0, 1, aySup(gcap(ma * (u1a - wAc)), gcap(ma * (u1a - wBc)), G, ya, yc));
  set(0, 2, aySup(gcap(ma * (16 - wAc)), gcap(ma * (16 - wBc)), G, ya, yc));
  set(0, 3, aySup(gcap(ma * 62), gcap(ma * 62), G, ya, yc));
  set(0, 4, aySup(gcap(ma * 254), gcap(ma * 254), G, ya, yc));
  set(1, 2, gcap(ma * (16 - u1c)));
  set(1, 3, gcap(ma * 56));
  set(1, 4, gcap(ma * 248));
  set(2, 3, gcap(ma * 32));
  set(2, 4, gcap(ma * 224));
  set(3, 4, gcap(ma * 128));
  return M;
}
// axes: (wA, wB, u1, y, mu)
function cellL2(b) {
  const [wAa, wBa, u1a, ya, ma] = b.lo;
  const [wAc, wBc, u1c, yc, mc] = b.hi;
  const G = gLo(mc * Math.min(16, Math.max(0, wBc - wAa)));
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => {
    M[i][j] = x;
    M[j][i] = x;
  };
  set(0, 2, aySup(gcap(ma * (wAa - 2)), gcap(ma * (wBa - 2)), G, ya, yc));
  set(1, 2, aySup(gcap(ma * (wAa - u1c)), gcap(ma * (wBa - u1c)), G, ya, yc));
  set(2, 3, aySup(gcap(ma * (64 - wAc)), gcap(ma * (64 - wBc)), G, ya, yc));
  set(2, 4, aySup(gcap(ma * 224), gcap(ma * 224), G, ya, yc));
  set(0, 1, gcap(ma * (u1a - 2)));
  set(0, 3, gcap(ma * 62));
  set(0, 4, gcap(ma * 254));
  set(1, 3, gcap(ma * 56));
  set(1, 4, gcap(ma * 248));
  set(3, 4, gcap(ma * 128));
  return M;
}
// doubled ladder 3 or 4: crude (x + y) <= sqrt(2), D >= 1 row inflation over
// the carried 1-D FP u1-cover at the mu* caps - valid for ALL mu >= mu*
function cellL34(b, which) {
  const [u1a] = b.lo;
  const [u1c] = b.hi;
  const R2 = sqrtHi(2);
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => {
    M[i][j] = x;
    M[j][i] = x;
  };
  set(0, 1, gcap(MU_DP * (u1a - 2)));
  set(1, 2, gcap(MU_DP * (16 - u1c)));
  set(0, 2, gcap(MU_DP * 14));
  set(0, 3, gcap(MU_DP * 62));
  set(0, 4, gcap(MU_DP * 254));
  set(1, 3, gcap(MU_DP * 56));
  set(1, 4, gcap(MU_DP * 248));
  set(2, 3, gcap(MU_DP * 32));
  set(2, 4, gcap(MU_DP * 224));
  set(3, 4, gcap(MU_DP * 128));
  for (let j = 0; j < 5; j++) {
    if (j !== which) {
      M[which][j] *= R2;
      M[j][which] *= R2;
    }
  }
  return M;
}

// LEMMA RM closure: penalty-free (G = 0) per-case matrices at mu = 3/5.
// Every entry cap g((3/5) t) dominates g(mu t) for mu >= 3/5 (g decreasing),
// and sqrt(capA^2 + capB^2) dominates the effective row for every y, G >= 0.
function rmClosure(kind) {
  const mu = MU_CAP;
  const s2 = (A, B) => sqrtHi(A * A + B * B) * (1 + 1e-9);
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => {
    M[i][j] = x;
    M[j][i] = x;
  };
  set(0, 1, gcap(mu * 2));
  set(1, 2, gcap(mu * 8));
  set(0, 2, gcap(mu * 14));
  set(0, 3, gcap(mu * 62));
  set(0, 4, gcap(mu * 254));
  set(1, 3, gcap(mu * 56));
  set(1, 4, gcap(mu * 248));
  set(2, 3, gcap(mu * 32));
  set(2, 4, gcap(mu * 224));
  set(3, 4, gcap(mu * 128));
  if (kind === 1) {
    set(0, 1, s2(gcap(mu * 2), gcap(mu * 2)));
    set(1, 2, s2(gcap(mu * 8), gcap(mu * 8)));
    set(1, 3, s2(gcap(mu * 56), gcap(mu * 56)));
    set(1, 4, s2(gcap(mu * 248), gcap(mu * 248)));
  } else if (kind === 0) {
    set(0, 1, s2(gcap(mu * 2), gcap(mu * 2)));
    set(0, 2, s2(gcap(mu * 14), gcap(mu * 14)));
    set(0, 3, s2(gcap(mu * 62), gcap(mu * 62)));
    set(0, 4, s2(gcap(mu * 254), gcap(mu * 254)));
  } else {
    set(0, 2, s2(gcap(mu * 14), gcap(mu * 14)));
    set(1, 2, s2(gcap(mu * 8), gcap(mu * 8)));
    set(2, 3, s2(gcap(mu * 32), gcap(mu * 32)));
    set(2, 4, s2(gcap(mu * 224), gcap(mu * 224)));
  }
  const v = polish(M, [0.7, 0.7, 0.14, 1e-3, 1e-8], 400);
  return cwRatio(M, v);
}

// ---- run the rate-resolved covers over mu in [mu*, 3/5] ----
const CERT_L1 = cover(cellL1, { lo: [4, 4, 0, MU_DP], hi: [8, 8, 1, MU_CAP] }, [8, 8, 1, 0.18], 3e7, [0, 1]);
const CERT_L0 = cover(cellL0, { lo: [1, 1, 4, 0, MU_DP], hi: [2, 2, 8, 1, MU_CAP] }, [2, 2, 8, 1, 0.18], 3e7, [0, 1]);
const CERT_L2 = cover(cellL2, { lo: [16, 16, 4, 0, MU_DP], hi: [32, 32, 8, 1, MU_CAP] }, [32, 32, 8, 1, 0.18], 3e7, [0, 1]);
const CERT_L3 = cover((b) => cellL34(b, 3), { lo: [4], hi: [8] }, [4], 1e5, null);
const CERT_L4 = cover((b) => cellL34(b, 4), { lo: [4], hi: [8] }, [4], 1e5, null);
const RM_L0 = rmClosure(0);
const RM_L1 = rmClosure(1);
const RM_L2 = rmClosure(2);

// tail-doubling arithmetic: Lemma TR with the weight constant bumped 6 -> 9
// (one column sqrt(2)-inflated), times sqrt(2) for the doubled tail row itself
const TR5_DP =
  Math.SQRT2 *
  ((9 * Math.pow(2, 5 - 4)) / V4_FLOOR) *
  Math.pow(EHALF_HI, Math.floor(2 * MU_DP * Math.pow(4, 4))) +
  Math.SQRT2 * Math.pow(EHALF_HI, Math.floor(2 * MU_DP * Math.pow(4, 5)));
const TAILCOL_DP = Math.SQRT2 * Math.pow(EHALF_HI, 118); // must stay < TAILSLACK

// in-run refutation literal: the penalty-free frame (G = 0, the free-rate
// decorrelation limit) at the DW corner AT mu* fails
const NAIVE_DP_BOUND = (() => {
  const mu = MU_DP;
  const M = cellL1({ lo: [4, 8, 0, mu], hi: [4, 8, 1, mu] });
  const set = (i, j, x) => {
    M[i][j] = x;
    M[j][i] = x;
  };
  set(0, 1, aySup(gcap(mu * 2), gcap(mu * 6), 0, 0, 1));
  set(1, 2, aySup(gcap(mu * 12), gcap(mu * 8), 0, 0, 1));
  let v = [0.7, 0.7, 0.14, 1e-3, 1e-8];
  let lam = 0;
  for (let it = 0; it < 800; it++) {
    const w = v.map((_, i) => M[i].reduce((s, x, j) => s + x * v[j], 0));
    const n = Math.hypot(...w);
    lam = n / Math.hypot(...v);
    v = w.map((x) => x / n);
  }
  return lam;
})();

// measured color (float, not certified): doubled-frame corner root
function lamCorner(mu, y) {
  const g = gFun;
  const x = Math.sqrt(1 - y * y);
  const D = Math.sqrt(1 + 2 * x * y * g(mu * 4));
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, val) => {
    M[i][j] = val;
    M[j][i] = val;
  };
  set(0, 1, (x * g(mu * 2) + y * g(mu * 6)) / D);
  set(1, 2, (x * g(mu * 12) + y * g(mu * 8)) / D);
  set(1, 3, ((x + y) * g(mu * 56)) / D);
  set(1, 4, ((x + y) * g(mu * 248)) / D);
  set(0, 2, g(mu * 14));
  set(0, 3, g(mu * 62));
  set(0, 4, g(mu * 254));
  set(2, 3, g(mu * 32));
  set(2, 4, g(mu * 224));
  set(3, 4, g(mu * 128));
  let v = [0.7, 0.7, 0.14, 1e-3, 1e-8];
  let lam = 0;
  for (let it = 0; it < 1200; it++) {
    const w = v.map((_, i) => M[i].reduce((s, x2, j) => s + x2 * v[j], 0));
    const n = Math.hypot(...w);
    lam = n / Math.hypot(...v);
    v = w.map((x2) => x2 / n);
  }
  return lam;
}
function cornerSup(mu) {
  let best = -1;
  for (let i = 0; i <= 800; i++) {
    const l = lamCorner(mu, (i * 0.01) / 800);
    if (l > best) best = l;
  }
  return best;
}
const FRAME_ROOT_DP = (() => {
  let lo = 0.2320;
  let hi = 0.2322;
  for (let i = 0; i < 45; i++) {
    const m = (lo + hi) / 2;
    if (cornerSup(m) > 1) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
})();

// carried float landmarks (measured only)
const ROOT_EDGE_ONEPER_CARRIED = 0.23207203643507168; // one-per-block position limit
const ROOT_DW_FAMILY_CARRIED = 0.23207238781359468; // DW-geometry edge limit (imp-95143)

// ---- seeded batteries (deterministic LCG, per-battery reseed) ----
let seedState = 0;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}

// battery AY (seed 424242): certified arc caps dominate sampled exact values
function runAyBattery() {
  seedState = 424242;
  let viol = 0;
  let worst = -Infinity;
  for (let t = 0; t < 200000; t++) {
    const A = rnd() * 1.2;
    const B = rnd() * 1.2;
    const G = rnd() * 0.999;
    let ya = rnd();
    let yc = rnd();
    if (ya > yc) {
      const s = ya;
      ya = yc;
      yc = s;
    }
    const cap = aySup(A, B, G, ya, yc);
    for (let k = 0; k <= 6; k++) {
      const y = ya + ((yc - ya) * k) / 6;
      const r = Math.sqrt(fsqAt(y, A, B, G)) / cap;
      if (r > 1 + 1e-9) viol++;
      if (r > worst) worst = r;
    }
  }
  return { viol, worst };
}

// battery EP (seed 515151): the effective-packet reduction is an identity -
// E by the direct packet form equals E by the effective form
function runEpBattery() {
  seedState = 515151;
  let worstRel = 0;
  let count = 0;
  for (let t = 0; t < 4000; t++) {
    const odd = t % 2 === 1;
    const mu = MU_DP * (1 + rnd());
    const bDouble = Math.floor(rnd() * 3);
    const occ = [0, 1, 2].filter((b) => b === bDouble || rnd() < 0.8);
    const base = (b) => Math.pow(4, b) * (odd ? 2 : 1);
    const us = [];
    const as = [];
    const blocks = [];
    for (const b of occ) {
      us.push(base(b) * (1 + rnd()));
      as.push(Math.pow(10, -1 + 2 * rnd()));
      blocks.push(b);
      if (b === bDouble) {
        us.push(base(b) * (1 + rnd()));
        as.push(Math.pow(10, -1 + 2 * rnd()));
        blocks.push(b);
      }
    }
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
    const iA = blocks.indexOf(bDouble);
    const iB = blocks.lastIndexOf(bDouble);
    const s = Math.hypot(as[iA], as[iB]);
    const x = as[iA] / s;
    const y = as[iB] / s;
    const rAB = rho(iA, iB);
    const den = Math.sqrt(1 + 2 * x * y * rAB);
    const sigma = s * den;
    let Eeff = -sigma * sigma;
    const others = [];
    for (let i = 0; i < n; i++) if (i !== iA && i !== iB) others.push(i);
    for (const i of others) Eeff -= as[i] * as[i];
    for (const i of others) {
      const rhoHat = (x * rho(iA, i) + y * rho(iB, i)) / den;
      Eeff += 2 * sigma * as[i] * rhoHat;
    }
    for (let a = 0; a < others.length; a++) {
      for (let b = a + 1; b < others.length; b++) {
        Eeff += 2 * as[others[a]] * as[others[b]] * rho(others[a], others[b]);
      }
    }
    const rel = Math.abs(Edir - Eeff) / Math.max(1e-30, Math.abs(Edir));
    if (rel > worstRel) worstRel = rel;
    count++;
  }
  return { worstRel, count };
}

// exact sibling Gram kernel (identical to imp-95130..95143) for the witness battery
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// battery W (seed 626262): THEOREM DP approached directly - seeded in-class
// witnesses (one doubled block among ladders 0..6, both parities, free
// positions, common rate >= mu*, zeros allowed)
function runWitnessBattery() {
  seedState = 626262;
  let maxE = -Infinity;
  let viol = 0;
  let count = 0;
  for (let t = 0; t < 5000; t++) {
    const odd = t % 2 === 1;
    const mu = t % 3 === 0 ? MU_DP : MU_DP * (1 + 2 * rnd());
    const bDouble = Math.floor(rnd() * 7);
    const occ = [];
    for (let b = 0; b < 7; b++) if (b === bDouble || rnd() < 0.5) occ.push(b);
    const us = [];
    const as = [];
    const blocks = [];
    for (const b of occ) {
      const base = Math.pow(4, b) * (odd ? 2 : 1);
      const reps = b === bDouble ? 2 : 1;
      for (let r = 0; r < reps; r++) {
        us.push(base * (1 + rnd()));
        as.push(rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd()));
        blocks.push(b);
      }
    }
    if (as.every((v) => v === 0)) continue;
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

const BAT_AY = runAyBattery();
const BAT_EP = runEpBattery();
const BAT_W = runWitnessBattery();

// baked literals (recomputed by the assertions)
const L1_CELLS_LIT = 264083;
const L0_CELLS_LIT = 200310;
const L2_CELLS_LIT = 141393;
const L34_CELLS_LIT = 14;
const FRAME_ROOT_LIT = 0.23207337675787754; // measured only, corner root of this frame

export const IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING = {
  ticket:
    "imp-95144 (THEOREM DP: doubled-block displacement pricing - every parity-pure MAJ witness at one COMMON rate >= 2901/12500 = 0.23208 with at most TWO packets in ONE block and at most one in every other block, any finite same-parity block set, free positions, nonnegative amplitudes, has E <= 0. Combined with THEOREM DW (imp-95143): the common-rate one-doubled-block subclass threshold is certified inside [2320723/10000000, 2901/12500) = [0.2320723, 0.23208), width 7.7e-6 - the FIRST two-sided certified pricing of the displacement credit; any E > 0 witness at a common rate >= 0.23208 now needs >= 3 packets in a block or >= 2 doubled blocks, and unequal rates survive only through the rate-decorrelation channel)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes THEOREM FP (imp-95142) machinery (gcap caps, torn-variable cell covers, CW at any positive vector, TAILSLACK, Lemma TR), THEOREM DW (imp-95143) as the subclass floor, and the imp-95136 cluster-sign conventions; directly narrows imp-95140-subgap-displacement-credit.",
  theoremDP:
    "Class: at most two packets in one block, at most one in every other, all blocks one parity, positions free, amplitudes nonnegative, ONE COMMON rate >= 2901/12500. Claim: E <= 0. Proof: NEW LEMMA EP (exact effective-packet reduction - the doubled block folds into one effective packet with row (x rhoA + y rhoB)/sqrt(1 + 2xy rhoAB), an algebraic identity on the cluster Gram form; the intra-block correlation floor rhoAB >= g(mu width) needs the COMMON rate) + NEW LEMMA AY (subcone copositivity cap: the certified sup of the effective row over any amplitude-arc cell via three sign checks on a 2x2 form; full-arc closed form max(A^2, B^2, (A^2+B^2-2ABG)/(1-G^2))) + RATE-RESOLVED adaptive warm-started Collatz-Wielandt covers over positions x amplitude arc x common rate mu in [2901/12500, 3/5] (positive caps at the mu-cell lower corner, intra floor at the upper corner; L1 4-D 264083 cells / L0 5-D 200310 / L2 5-D 141393, ZERO unresolved each; L3/L4 by sqrt(2) row inflation over the carried 14-cell FP cover, mu-free; tails by Lemma TR with the weight constant bumped to 9) + NEW LEMMA RM (high-rate closure: the penalty-free per-case frames at mu = 3/5 certify - 0.9453/0.9490/0.6729 < 1 - and dominate every mu >= 3/5 by monotone decrease of g) + LEMMA OD2 (odd parity = even frame at exactly 2mu >= 2 * 2901/12500, already inside the certified rate range - no separate odd run).",
  displacementBracket:
    "Common-rate one-doubled-block subclass threshold certified inside [2320723/10000000, 2901/12500) - width 7.7e-6. Floor: THEOREM DW witness (certified E > 0 at 0.2320723, IN this class: common rate, one doubled block). Cap: this module. The certified displacement credit over the carried one-per-block position limit 0.23207203643507168 (measured) is between +2.64e-7 and +7.96e-6. Measured color (float only): this frame has corner root 0.2320733768 at the DW geometry, 9.9e-7 above the DW family root 0.23207238781359468 (carried) - the 3.9e-7 sliver to 0.23208 was not chased (FP-corner margin structure caps the frame).",
  structuralConsequence:
    "Any FULL-class parity-pure witness with E > 0 at a common rate >= 2901/12500 must place at least THREE packets in one block or double at least TWO blocks; with free rates the doubled-block route additionally survives only through the rate-decorrelation channel (the penalty-free frame fails at the DW corner, lamMax = 1.2745 > 1, so the credit cannot be collected without paying the intra-block penalty at comparable rates). imp-95140-subgap-displacement-credit is NARROWED to exactly these channels below 0.23208, plus the untouched full-class interval [0.23208, 0.24502] above it.",
  honestAttribution:
    "The CONSTANT 2901/12500 is the THEOREM FP constant reused at a wider scope; the certified class sandwich [0.2320723, 0.24502] does NOT move (THEOREM HS 12251/50000 remains the only full-class ceiling). The doubled-block class was previously covered by NO ceiling below 0.24502; it is now capped at 0.23208. The lemma gains are EP (exact reduction) and AY (the subcone cap that made certification terminate: the per-corner phantom route exhausted 3e6-cell budgets with unresolved cells and was REFUTED as a certification route). A SOUNDNESS BUG in the first draft (intra-block floor evaluated at mu* only) was caught by in-run self-check and fixed with the rate-resolved covers plus the Lemma RM closure - recorded plainly.",
  subGaps: [
    "imp-95144-subgap-free-rate-displacement - NEW: extend THEOREM DP to free rates >= 2901/12500; needs a rate-aware lower bound on the intra-block correlation GIVEN retained cross bonds (off-rate packets decorrelate from their own block and from bond partners at the same sqrt(mu_min/m) scale - quantify the dichotomy and case-split); this is the imp-95140 rate-aware Gram cross-term wall restated at the subclass level.",
    "imp-95144-subgap-k-packet-ladder - NEW: k >= 3 packets in one block and >= 2 doubled blocks; Lemma EP generalizes to a (k-1)-sphere amplitude arc with a pairwise penalty matrix, Lemma AY needs the k-dimensional cone-copositivity version.",
    "imp-95140-subgap-displacement-credit - OPEN, NARROWED: below 0.23208 the surviving witness channels are exactly {free rates} u {k >= 3 in a block} u {>= 2 doubled blocks}; the full-class interval [0.23208, 0.24502] above it is untouched (THEOREM HS carried).",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this is a subclass ceiling step; the phi-conditional odd-mass bound is untouched",
    "the class sandwich [0.2320723, 0.24502] is carried unchanged - the full-class ceiling needs the surviving channels priced, not just the one-doubled-block common-rate slice",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM DP is unconditional given the carried THEOREM FP machinery: Lemma EP is an algebraic identity (verified as an identity on 4000 seeded draws to < 1e-9 relative), Lemma AY is elementary 2x2 cone copositivity with explicit float slacks (every branch a sound upper cap; 200000-draw battery, zero violations), the covers are deterministic bisection over positions, the amplitude arc AND the common rate (positive caps at the mu-cell lower corner, the intra floor at the upper corner) with Collatz-Wielandt at arbitrary positive vectors, ZERO unresolved cells in every cover, Lemma RM closes the ray mu >= 3/5 with penalty-free frames that dominate by monotone decrease of g, Lemma OD2 folds odd parity into the same certificate at 2mu, and the tail constants are explicit (TR bumped to 9, TAILSLACK absorbs the sqrt(2) column bump). Every approximation inflates caps - the certificate can fail spuriously but cannot certify spuriously. Scope: parity-pure model family, ONE COMMON RATE, AT MOST ONE DOUBLED BLOCK (two packets); free rates, k >= 3 packets and multiple doubled blocks are named sub-gaps, not covered; the class sandwich [0.2320723, 0.24502] is carried unchanged; float landmarks (frame root 0.2320733768, DW family root 0.23207238781359468, one-per-block limit 0.23207203643507168) are measured only; the imp-95140-subgap-displacement-credit leg stays OPEN (narrowed, not closed); parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN; floors and ceilings of the Lambda program untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED on the parent; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING_ASSERTIONS = [
  {
    id: "imp95144-rate-resolved-covers-certify",
    description:
      "the three rate-resolved doubled-block covers over mu in [2901/12500, 3/5] terminate with ZERO unresolved cells (L1 4-D 264083 cells, L0 5-D 200310, L2 5-D 141393), worst certified bounds strictly below 1, and the L3/L4 sqrt(2)-inflated 14-cell u1-covers (mu-free) certify",
    holds: () =>
      CERT_L1.unresolved === 0 &&
      CERT_L0.unresolved === 0 &&
      CERT_L2.unresolved === 0 &&
      CERT_L1.cells === L1_CELLS_LIT &&
      CERT_L0.cells === L0_CELLS_LIT &&
      CERT_L2.cells === L2_CELLS_LIT &&
      CERT_L1.worst < 1 &&
      CERT_L0.worst < 1 &&
      CERT_L2.worst < 1 &&
      CERT_L3.unresolved === 0 &&
      CERT_L4.unresolved === 0 &&
      CERT_L3.cells === L34_CELLS_LIT &&
      CERT_L4.cells === L34_CELLS_LIT &&
      CERT_L3.worst < 1 &&
      CERT_L4.worst < 1,
  },
  {
    id: "imp95144-rm-closure-certifies",
    description:
      "Lemma RM: the penalty-free per-case frames at mu = 3/5 certify (bounds in (0.6, 0.96), each < 1) and dominate every common rate >= 3/5 by monotone decrease of the exact g - closing the rate ray above the covered interval; Lemma OD2 folds odd parity in at 2mu >= 2 * 2901/12500 > 2901/12500",
    holds: () =>
      RM_L0 < 0.96 &&
      RM_L0 > 0.6 &&
      RM_L1 < 0.96 &&
      RM_L1 > 0.6 &&
      RM_L2 < 0.96 &&
      RM_L2 > 0.6 &&
      MU_CAP > MU_DP &&
      2 * MU_DP > MU_DP,
  },
  {
    id: "imp95144-ay-battery",
    description:
      "Lemma AY approached directly: 200000 seeded (A, B, G, arc-cell) draws, 7 arc samples each - every certified cap dominates every sampled exact value (zero violations)",
    holds: () => BAT_AY.viol === 0 && BAT_AY.worst <= 1 + 1e-9 && BAT_AY.worst > 0.99,
  },
  {
    id: "imp95144-ep-identity",
    description:
      "Lemma EP approached directly: 4000 seeded doubled-block configurations (both parities, mixed amplitudes) - E by the direct packet form and E by the effective-packet form agree to < 1e-9 relative (it is an identity, not a bound)",
    holds: () => BAT_EP.count === 4000 && BAT_EP.worstRel < 1e-9,
  },
  {
    id: "imp95144-witness-battery",
    description:
      "THEOREM DP approached directly: 5000 seeded in-class witnesses (one doubled block among ladders 0..6, BOTH parities, free positions, common rate >= 2901/12500 pinned at the floor every third draw, amplitude zeros allowed) - zero E > 0 draws",
    holds: () => BAT_W.viol === 0 && BAT_W.maxE < 0 && BAT_W.count > 4900,
  },
  {
    id: "imp95144-free-rate-refutation",
    description:
      "in-run refutation preserved: the penalty-free frame (G = 0, the free-rate decorrelation limit) FAILS at the DW corner at mu* - lamMax in (1.2, 1.35) - so the common-rate scope is essential and the free-rate sub-gap is genuine",
    holds: () => NAIVE_DP_BOUND > 1.2 && NAIVE_DP_BOUND < 1.35,
  },
  {
    id: "imp95144-bracket-ordering",
    description:
      "displacement-credit bracket anchors: 0.23207203643507168 (one-per-block limit, carried) < 2320723/10000000 (DW certified floor) < DW family root 0.23207238781359468 (carried) < frame corner root (recomputed, 0.23207337675787754 to 1e-8) < 2901/12500; bracket width 2901/12500 - 2320723/1e7 = 7.7e-6 exactly",
    holds: () => {
      const width = MU_DP - MU_DW;
      return (
        ROOT_EDGE_ONEPER_CARRIED < MU_DW &&
        MU_DW < ROOT_DW_FAMILY_CARRIED &&
        ROOT_DW_FAMILY_CARRIED < FRAME_ROOT_DP &&
        Math.abs(FRAME_ROOT_DP - FRAME_ROOT_LIT) < 1e-8 &&
        FRAME_ROOT_DP < MU_DP &&
        Math.abs(width - 0.0000077) < 1e-12
      );
    },
  },
  {
    id: "imp95144-tail-arithmetic",
    description:
      "tail-doubling arithmetic: the sqrt(2)-bumped Lemma TR constant at b = 5 stays below 1e-13 (weight constant 9, decreasing in b), and the sqrt(2)-bumped head-row tail-column mass 3.4e-26 stays far inside TAILSLACK = 1e-19",
    holds: () =>
      TR5_DP < 1e-13 && TR5_DP > 0 && TAILCOL_DP < TAILSLACK && TAILCOL_DP < 4e-26 && 2 * MU_DP * Math.pow(4, 4) - 1 >= 117,
  },
  {
    id: "imp95144-glo-validity",
    description:
      "the new lower cap gLo is valid: gLo(z) <= g(z) on a 400-point grid over [0, 49.9] and gLo is 0 beyond 50; gcap(z) >= g(z) on the same grid (carried direction); the intra-floor arguments used by the covers (mu-cell max times block width) stay below 50 at the closure rate",
    holds: () => {
      for (let i = 0; i <= 400; i++) {
        const z = (i * 49.9) / 400;
        if (!(gLo(z) <= gFun(z))) return false;
        if (!(gcap(z) >= gFun(z))) return false;
      }
      return gLo(50) === 0 && gLo(120) === 0 && MU_CAP * 16 < 50 && MU_CAP * 4 < 50 && MU_CAP * 1 < 50;
    },
  },
  {
    id: "imp95144-honesty-gate",
    description:
      "the verdict is scoped: COMMON RATE only, at most one doubled block, class sandwich carried unchanged, displacement-credit leg OPEN (narrowed not closed), free-rate and k-packet sub-gaps named, the caught soundness bug recorded, parent sub-gap OPEN, float landmarks measured only; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING.promotesBound === false &&
      /NO QED/.test(IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING.rigorScope) &&
      /refereed bound is changed/i.test(IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING.rigorScope) &&
      /ONE COMMON RATE/.test(IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING.rigorScope) &&
      /narrowed, not closed/.test(IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING.rigorScope) &&
      /measured only/.test(IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING.rigorScope) &&
      /SOUNDNESS BUG/.test(IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING.honestAttribution) &&
      /carried unchanged/.test(IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING.openResiduals[1]) &&
      /remains OPEN/.test(IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING.openResiduals[0]) &&
      IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING.subGaps.length === 3 &&
      IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING.openResiduals.length === 3,
  },
];

for (const a of IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95144-doubled-block-displacement-pricing assertion failed: ${a.id}`);
  }
}

export default IMP95144_DOUBLED_BLOCK_DISPLACEMENT_PRICING;
