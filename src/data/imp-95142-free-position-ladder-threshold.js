/**
 * imp-95142 - THEOREM FP (free-position block-ladder cap, certified
 * one-packet-per-block threshold 2901/12500 = 0.23208): every parity-pure
 * MAJ witness with AT MOST ONE packet per block - ANY finite set of
 * same-parity blocks, positions FREE inside their blocks, free rates all
 * >= 2901/12500, nonnegative amplitudes - has E <= 0. This certifies the
 * one-packet-per-block subclass threshold inside [11603/50000, 2901/12500)
 * (width 2e-5; the lower end is the carried THEOREM WS witness, which lives
 * in this subclass) and supersedes BOTH carried statements on this subclass
 * at once: THEOREM RT (imp-95131, constant 2/5 = 0.4, same class) at the
 * constant level, and COROLLARY FR (imp-95141, same constant but FIXED grid
 * positions, 3 blocks, even parity only) at the scope level.
 *
 * STRUCTURAL CONSEQUENCE (the reason this narrows the open ceiling leg):
 * any witness of the FULL parity-pure class with E > 0 at rates
 * >= 2901/12500 must place AT LEAST TWO packets in a single block. The
 * surviving certified sandwich interval [0.23208, 0.24502] (upper end
 * THEOREM HS, carried unchanged) is therefore certified MULTI-PACKET-ONLY:
 * the imp-95140-subgap-displacement-credit leg no longer needs any
 * cross-block geometry below the ladder margin - it needs exactly an
 * intra-block aggregation price. Before this step that localization was
 * measured only (position battery, 5/7-block extension landmarks).
 *
 * THEOREM FP. Class: packets i = 1..n at positions u_i in
 * [2^{b_i}, 2^{b_i + 1}) with all b_i of one parity and pairwise distinct
 * (at most one packet per block), amplitudes a_i >= 0, rates
 * m_i >= mu* = 2901/12500. Claim: E = -sum a_i^2/m_i
 * + 2 sum_{i<j} a_i a_j K(m_i, m_j, |u_i - u_j|) <= 0.
 * PROOF CHAIN (every analytic ingredient carried or elementary):
 * (1) With B_i = a_i/sqrt(m_i) >= 0,
 *     E = -|B|^2 + 2 sum_{i<j} B_i B_j rho_ij,
 *     rho_ij = sqrt(m_i m_j) K_ij <= g(min(m_i, m_j) T_ij) <= g(mu* T_ij)
 *     by the carried Lemma RC (imp-95131, full calculus proof) plus
 *     monotone decrease of g(z) = exp(-z)(1 + z) (g' = -z exp(-z)).
 * (2) EVEN-PARITY LADDER. Write blocks as ladder index b (block 2b,
 *     positions [4^b, 2*4^b)). Per-entry position sups give, for occupied
 *     ladder pair (b, b'), T > 4^{b'} - 2*4^b, EXCEPT that the middle head
 *     block b = 1 is torn between its two O(1) bonds: the (0,1) gap wants
 *     u_1 small and the (1,2) gap wants u_1 large. u_1 is the ONLY position
 *     variable shared by two O(1) entries, so ONE-DIMENSIONAL cells close
 *     it: for u_1 in a cell [a, c] subset [4, 8],
 *       (0,1) entry <= gcap(mu*(a - 2)),   (1,2) entry <= gcap(mu*(16 - c)),
 *       (0,2) entry <= gcap(mu*14), and every entry touching ladder b >= 3
 *       uses its independent facing-edge gap 4^{b'} - 2*4^b (valid
 *       per-entry sups; lossy only where the values are tiny).
 * (3) CERTIFIED ENTRY CAPS gcap(z) >= g(z): z <= 4 - N = 60 even-truncation
 *     alternating-series upper bound of exp(-z) plus additive slack 1e-8
 *     (float budget 62 * 2^{-52} * e^4 < 1e-12); 4 < z <= 15 - same with
 *     slack 1e-6 (budget 62 * 2^{-52} * e^15 < 5e-8); z > 15 - Lemma EC:
 *     g(z) <= exp(-z/2) for z >= 3 (equivalent to 1 + z <= exp(z/2): true
 *     at z = 3 since 4 < e^{1.5} = 4.4817, and the difference has positive
 *     derivative exp(z/2)/2 - 1 > 0 for z > 2 ln 2), so
 *     g(z) <= EHALF_HI^{floor(z)} * (1 + 1e-9) with the baked rational-side
 *     constant EHALF_HI = 0.60653067 > e^{-1/2}. Every inflated cap can
 *     only WEAKEN the certificate (upper caps on nonnegative entries),
 *     never fake it.
 * (4) WEIGHTED AM-GM / COLLATZ-WIELANDT (carried pattern). For any positive
 *     weight vector v on the full ladder, 2 B_i B_j <= (v_j/v_i) B_i^2
 *     + (v_i/v_j) B_j^2 gives E <= sum_i B_i^2 (R_i - 1),
 *     R_i = (1/v_i) sum_{j != i} cap_ij v_j - valid for EVERY finite
 *     occupied subset at once because dropping partners only lowers R_i.
 *     Head rows b <= 4 are computed per cell at the per-cell float Perron
 *     vector (any positive vector is valid - no certification of the
 *     iteration needed) with v_3 floored at 1e-8, v_4 floored at 1e-10 and
 *     an additive TAILSLACK 1e-19 absorbing all tail-column contributions:
 *     for b <= 4 and b' >= 5 the gap exceeds 4^5 - 2*4^4 = 512, so the sum
 *     is <= EHALF_HI^{118} * sum tail v = EHALF_HI^{118} * v_4
 *     <= 2.39e-26 < 1e-19 (tail weights v_b = v_4 * 2^{-(b-4)}).
 * (5) LEMMA TR (tail rows). For b >= 5, splitting partners below/above and
 *     using the nearest-gap monotone caps g(2 mu 4^{b-1}) and g(2 mu 4^b):
 *     R_b <= 6 * 2^{b-4} * EHALF_HI^{floor(2 mu* 4^{b-1})} / 1e-10
 *     + EHALF_HI^{floor(2 mu* 4^b)} (head components <= 1 each after
 *     normalization, tail sum <= 1, so sum of all v <= 6). Since
 *     2 mu* 4^{b-1} - 1 >= 117 * 4^{b-5} (because 1.83 * 4^{b-5} >= 1), the
 *     bound DECREASES in b (per-step factor 2 * EHALF_HI^{351} << 1) and
 *     its b = 5 value is 2.9e-15 < 1e-14 < 1. So every tail row ratio is
 *     far below 1 and the head rows carry the theorem.
 * (6) ADAPTIVE CELL COVER. Deterministic bisection of [4, 8] until every
 *     cell certifies max head ratio < 1: 14 cells, deepest depth 13,
 *     exact cover (adjacent endpoints match, first left end 4, last right
 *     end 8), worst certified bound 0.99999371029775219 at the sharp corner
 *     cell [4, 4 + 2^{-11}] - margin 6.2897e-6 with ALL slacks inside.
 * (7) LEMMA OD (odd parity by entrywise domination). Odd-parity blocks
 *     [2*4^b, 4*4^b) give every pair gap EXACTLY DOUBLE the even-ladder
 *     bound for the corresponding configuration (u_1-cell doubling
 *     included), and g is decreasing, so the odd cap matrix is entrywise
 *     <= the even one cell-by-cell and the SAME vectors certify it. QED.
 *
 * SHARPNESS. The carried THEOREM WS witness (one packet in each of blocks
 * 0/2/4, common rate 11603/50000 = 0.23206) has certified E > 0, and it
 * lies IN this subclass: the one-packet-per-block parity-pure threshold is
 * certified inside [11603/50000, 2901/12500), width 2e-5. Measured color
 * (float, not certified): the coupled-corner 5-ladder root (exact g at
 * u = (2, 4, 16) plus facing-edge borders) is 0.23207302409715935 - the
 * certified constant sits 6.98e-6 above the measured subclass sup root,
 * and 0.23208 - 0.2320730 is all that separates the certificate from the
 * subclass optimum (grid-family root 0.23206852812691425 and 3-block
 * position limit 0.23207203643507168 carried unchanged below it).
 *
 * WHAT THIS NARROWS AND WHAT IT DOES NOT.
 * (1) It does NOT move the class sandwich [0.23206, 0.24502]: the class
 *     upper end needs multi-packet blocks priced, exactly the
 *     imp-95140-subgap-displacement-credit leg, which stays OPEN.
 * (2) It converts the leg from "close [0.2321, 0.24493] for the full
 *     class" into the certified-localized form "price intra-block
 *     aggregation": cross-block one-per-block geometry is now CLOSED at
 *     2901/12500, within 7e-6 of its measured optimum.
 * (3) THEOREM RT (2/5) is superseded at the constant level on the same
 *     class; its Lemma GS and S-star machinery remain carried by other
 *     modules. COROLLARY FR (fixed positions) is superseded at the scope
 *     level at the same constant.
 * (4) Parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN.
 *
 * HONEST LIMITS. (a) Model-family constants, not the paper Section 4.5
 * packets. (b) One packet per block only - the full-class ceiling stays at
 * THEOREM HS 12251/50000. (c) The subclass threshold is bracketed, not
 * determined; 0.2320730 (coupled-corner root) is a float landmark,
 * measured only. (d) Tightening 0.23208 toward ~0.232075 was tried in
 * float and REJECTED: the binding-cell margin 6.3e-6 thins toward zero for
 * < 5e-6 of bracket width - recorded so successors do not respend it.
 * (e) Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD (in-run refutations preserved).
 * (1) The NAIVE independent facing-edge cap matrix was tried FIRST and
 *     REFUTED: taking every pair gap at its own sup simultaneously puts
 *     u_1 at both ends of its block and gives lamMax = 1.0942 > 1 at
 *     mu* - the u_1 coupling is essential and the one-dimensional cell
 *     cover is the minimal fix (recorded literal below).
 * (2) The chain-product route (g submultiplicative:
 *     g(x + y) <= g(x) g(y), tridiagonal-inverse AR structure) was derived
 *     and REFUTED as a closing lever: at the (0,2) bond it loses four
 *     orders of magnitude (g(mu 14) = 8.7e-6 vs g(mu 2) g(mu 12) = 0.053)
 *     and its row sums exceed 2 already at the first bond.
 * (3) A first cap draft used N = 24 series for z ~ 14.4 and was caught
 *     NON-CONVERGED (cap 3686x the true value; the certificate would have
 *     FAILED, not lied - inflated caps only weaken). Fixed with N = 60 and
 *     the explicit float budgets in (3) above.
 * (4) Direction-of-error audit: every approximation in the chain (series
 *     slack, EHALF crude caps, per-entry sups, cell endpoint caps,
 *     TAILSLACK, v floors) inflates entries or row ratios - the
 *     certificate can fail spuriously but cannot certify spuriously.
 * (5) Batteries (measured cross-checks, not the proof): 5961 seeded
 *     one-per-block witnesses over ladder blocks 0..10, both parities,
 *     free positions, mixed rates >= mu*, amplitude zeros allowed - max
 *     E = -0.0007081118569591425 < 0, zero E > 0; 6000 seeded position
 *     tuples confirm entrywise domination of the exact g values by the
 *     containing-cell caps (worst ratio 0.9988152535822168, zero
 *     violations).
 *
 * Import-light (no heavy bundle, no imports). The batteries are
 * CROSS-CHECKS; the theorem is the lemma chain (1)-(7) with the certified
 * cell cover recomputed by the assertions on every build.
 */

// exact sibling Gram kernel (identical to imp-95130..95141)
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

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

const MU_FP = 2901 / 12500; // certified constant 0.23208 (matches COROLLARY FR)
const MU_WS = 11603 / 50000; // carried THEOREM WS witness rate (subclass lower end)
const MU_RT = 2 / 5; // carried THEOREM RT constant, superseded here
const EHALF_HI = 0.60653067; // > exp(-1/2) = 0.6065306597...
const TAILSLACK = 1e-19; // absorbs tail-column mass EHALF_HI^118 < 2.4e-26 in head rows
const V3_FLOOR = 1e-8;
const V4_FLOOR = 1e-10;

// certified upper cap on g(z) - see proof step (3)
function gcap(z) {
  if (z <= 4) return (expTrunc(z, 60) + 1e-8) * (1 + z);
  if (z <= 15) return (expTrunc(z, 60) + 1e-6) * (1 + z);
  return Math.pow(EHALF_HI, Math.floor(z)) * (1 + 1e-9);
}

// per-cell 5x5 dominating matrix for u_1 in [a, c] subset [4, 8]
// (even ladder: block index b holds positions [4^b, 2*4^b))
function cellMatrix(a, c) {
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => {
    M[i][j] = x;
    M[j][i] = x;
  };
  set(0, 1, gcap(MU_FP * (a - 2)));
  set(0, 2, gcap(MU_FP * 14));
  set(1, 2, gcap(MU_FP * (16 - c)));
  set(0, 3, gcap(MU_FP * 62));
  set(1, 3, gcap(MU_FP * 56));
  set(2, 3, gcap(MU_FP * 32));
  set(0, 4, gcap(MU_FP * 254));
  set(1, 4, gcap(MU_FP * 248));
  set(2, 4, gcap(MU_FP * 224));
  set(3, 4, gcap(MU_FP * 128));
  return M;
}

// certified Collatz-Wielandt head-row bound at the per-cell float Perron
// vector (any positive vector is valid; floors keep tail-row constants baked)
function cwBound(M) {
  let v = [1, 1, 0.4, 1e-3, 1e-8];
  for (let it = 0; it < 500; it++) {
    const w = v.map((_, i) => M[i].reduce((s, x, j) => s + x * v[j], 0));
    const n = Math.hypot(...w);
    v = w.map((x) => x / n);
    v[3] = Math.max(v[3], V3_FLOOR);
    v[4] = Math.max(v[4], V4_FLOOR);
  }
  const r = v.map((_, i) => (M[i].reduce((s, x, j) => s + x * v[j], 0) + TAILSLACK) / v[i]);
  return { bound: Math.max(...r) * (1 + 1e-12), v };
}

// deterministic adaptive cell cover of [4, 8]
function certifyCells() {
  const cells = [];
  const stack = [[4, 8, 0]];
  let failed = false;
  let maxDepth = 0;
  while (stack.length) {
    const [a, c, d] = stack.pop();
    const { bound } = cwBound(cellMatrix(a, c));
    if (bound < 1) {
      cells.push([a, c, bound]);
      if (d > maxDepth) maxDepth = d;
      continue;
    }
    if (d >= 50) {
      failed = true;
      break;
    }
    const m = (a + c) / 2;
    stack.push([a, m, d + 1], [m, c, d + 1]);
  }
  cells.sort((x, y) => x[0] - y[0]);
  return { cells, failed, maxDepth };
}

const CERT = certifyCells();
const WORST_BOUND = Math.max(...CERT.cells.map((c) => c[2]));

// Lemma TR tail-row constant at b = 5 (decreasing in b - proof step (5))
const TR5 =
  ((6 * Math.pow(2, 5 - 4)) / V4_FLOOR) * Math.pow(EHALF_HI, Math.floor(2 * MU_FP * Math.pow(4, 4))) +
  Math.pow(EHALF_HI, Math.floor(2 * MU_FP * Math.pow(4, 5)));
const TAILCOL = Math.pow(EHALF_HI, 118); // head-row tail-column bound, must be < TAILSLACK

// ---- measured color (float, not certified) ----
function lam5exact(mu) {
  const G = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => {
    G[i][j] = x;
    G[j][i] = x;
  };
  set(0, 1, gFun(mu * 2));
  set(0, 2, gFun(mu * 14));
  set(1, 2, gFun(mu * 12));
  set(0, 3, gFun(mu * 62));
  set(1, 3, gFun(mu * 56));
  set(2, 3, gFun(mu * 32));
  set(0, 4, gFun(mu * 254));
  set(1, 4, gFun(mu * 248));
  set(2, 4, gFun(mu * 224));
  set(3, 4, gFun(mu * 128));
  let v = [1, 1, 0.4, 1e-3, 1e-8];
  let lam = 0;
  for (let it = 0; it < 800; it++) {
    const w = v.map((_, i) => G[i].reduce((s, x, j) => s + x * v[j], 0));
    const n = Math.hypot(...w);
    lam = n / Math.hypot(...v);
    v = w.map((x) => x / n);
  }
  return lam;
}
const ROOT5 = (() => {
  let lo = 0.23;
  let hi = 0.235;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (lam5exact(m) > 1) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
})();

// carried float landmarks (imp-95141, measured only)
const ROOT_GRID_CARRIED = 0.23206852812691425;
const ROOT_EDGE_CARRIED = 0.23207203643507168;

// ---- seeded batteries (deterministic LCG, per-battery reseed) ----
let seedState = 0;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}

// battery A (seed 727272): one-per-block witnesses, ladder blocks 0..10,
// both parities, free positions, mixed rates >= mu*, amplitude zeros allowed
function runWitnessBattery() {
  seedState = 727272;
  let maxE = -Infinity;
  let viol = 0;
  let count = 0;
  for (let t = 0; t < 6000; t++) {
    const odd = t % 2 === 1;
    const occ = [];
    for (let b = 0; b < 11; b++) if (rnd() < 0.5) occ.push(b);
    if (occ.length < 2) continue;
    const u = [];
    const a = [];
    const mu = [];
    for (const b of occ) {
      const base = Math.pow(4, b) * (odd ? 2 : 1);
      u.push(base * (1 + rnd()));
      a.push(rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd()));
      mu.push(t % 3 === 0 ? MU_FP : MU_FP * Math.pow(100, rnd() * rnd()));
    }
    if (a.every((x) => x === 0)) continue;
    let E = 0;
    for (let i = 0; i < occ.length; i++) E -= (a[i] * a[i]) / mu[i];
    for (let i = 0; i < occ.length; i++) {
      for (let j = i + 1; j < occ.length; j++) {
        E += 2 * a[i] * a[j] * kernelK(mu[i], mu[j], Math.abs(u[i] - u[j]));
      }
    }
    if (E > maxE) maxE = E;
    if (E > 0) viol++;
    count++;
  }
  return { maxE, viol, count };
}

// battery B (seed 838384): entrywise domination of exact g values by the
// containing-cell caps at random positions
function runDominationBattery() {
  seedState = 838384;
  let viol = 0;
  let worst = -Infinity;
  let count = 0;
  for (let t = 0; t < 6000; t++) {
    const us = [1 + rnd(), 4 + 4 * rnd(), 16 + 16 * rnd(), 64 + 64 * rnd(), 256 + 256 * rnd()];
    const cell = CERT.cells.find((c) => us[1] >= c[0] && us[1] <= c[1]);
    if (!cell) {
      viol++;
      continue;
    }
    const M = cellMatrix(cell[0], cell[1]);
    for (let i = 0; i < 5; i++) {
      for (let j = i + 1; j < 5; j++) {
        const ratio = gFun(MU_FP * (us[j] - us[i])) / M[i][j];
        if (ratio > 1 + 1e-12) viol++;
        if (ratio > worst) worst = ratio;
      }
    }
    count++;
  }
  return { viol, worst, count };
}

const BAT_A = runWitnessBattery();
const BAT_B = runDominationBattery();

// carried THEOREM WS witness (sharpness anchor - float cross-check of the
// certified E > 0 statement at 11603/50000)
const P_WS = 999983;
const K_WS = [499992, 249995, 62498];
const U_WS = K_WS.map((k) => P_WS / k);
const A_WS = [6756, 6854, 2716];
function eWitnessWS(mu) {
  let E = -(A_WS[0] * A_WS[0] + A_WS[1] * A_WS[1] + A_WS[2] * A_WS[2]) / mu;
  E +=
    2 *
    (A_WS[0] * A_WS[1] * kernelK(mu, mu, U_WS[1] - U_WS[0]) +
      A_WS[0] * A_WS[2] * kernelK(mu, mu, U_WS[2] - U_WS[0]) +
      A_WS[1] * A_WS[2] * kernelK(mu, mu, U_WS[2] - U_WS[1]));
  return E;
}
const E_WS = eWitnessWS(MU_WS);

// in-run refutation literal: the naive independent facing-edge cap matrix
// (u_1 at BOTH ends of its block simultaneously) fails at mu*
const NAIVE_M = cellMatrix(4, 8);
NAIVE_M[0][1] = gcap(MU_FP * 2);
NAIVE_M[1][0] = NAIVE_M[0][1];
NAIVE_M[1][2] = gcap(MU_FP * 8);
NAIVE_M[2][1] = NAIVE_M[1][2];
const NAIVE_BOUND = (() => {
  let v = [1, 1, 0.4, 1e-3, 1e-8];
  let lam = 0;
  for (let it = 0; it < 800; it++) {
    const w = v.map((_, i) => NAIVE_M[i].reduce((s, x, j) => s + x * v[j], 0));
    const n = Math.hypot(...w);
    lam = n / Math.hypot(...v);
    v = w.map((x) => x / n);
  }
  return lam;
})();

// baked literals (recomputed by the assertions)
const WORST_BOUND_LIT = 0.99999371029775219;
const CELLS_LIT = 14;
const MAX_DEPTH_LIT = 13;
const FIRST_CELL_RIGHT_LIT = 4.00048828125; // 4 + 2^{-11}
const ROOT5_LIT = 0.23207302409715935;
const BAT_A_MAX_E_LIT = -0.0007081118569591425;
const BAT_A_COUNT_LIT = 5961;
const BAT_B_WORST_LIT = 0.9988152535822168;
const E_WS_LIT = 7187.41735804081;

export const IMP95142_FREE_POSITION_LADDER_THRESHOLD = {
  ticket:
    "imp-95142 (THEOREM FP: free-position block-ladder cap - every parity-pure MAJ witness with at most one packet per block, ANY finite set of same-parity blocks, FREE positions and free rates all >= 2901/12500 = 0.23208 has E <= 0; certified by Lemma RC + per-entry position sups + a 14-cell one-dimensional Collatz-Wielandt cover of the single torn position variable u_1 + analytic tail lemmas. Subclass threshold certified in [11603/50000, 2901/12500), width 2e-5; supersedes THEOREM RT (2/5) at the constant level and COROLLARY FR (fixed positions) at the scope level; certifies the surviving class ceiling interval [0.23208, 0.24502] as MULTI-PACKET-ONLY)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the imp-95131 Lemma RC (mixed-rate cap) and AM-GM row-reduction pattern, the imp-95138/95141 any-positive-vector Collatz-Wielandt direction, and the imp-95141 THEOREM WS witness as the subclass lower end; carries THEOREM HS (12251/50000) and the class sandwich [0.23206, 0.24502] unchanged.",
  theoremFP:
    "Class: at most one packet per block, all blocks one parity, positions free in their dyadic blocks, amplitudes nonnegative, rates all >= 2901/12500. Claim: E <= 0. Proof: entrywise caps rho_ij <= g(mu* T_ij) (Lemma RC + g decreasing); per-entry position sups reduce everything to facing-edge gaps EXCEPT the single torn variable u_1 (middle head block), closed by a deterministic 14-cell adaptive cover of [4, 8] with certified per-cell caps (N = 60 even-truncation series with explicit float budgets for z <= 15; Lemma EC g(z) <= exp(-z/2) via EHALF_HI powers beyond) and per-cell Collatz-Wielandt at float Perron vectors (valid for any positive vector); tail columns absorbed by TAILSLACK 1e-19 >> EHALF_HI^118 = 2.4e-26; tail rows by Lemma TR (b = 5 value 2.9e-15, decreasing). Odd parity by Lemma OD (exactly-doubled gaps, entrywise domination, same vectors). Worst certified cell bound 0.99999371029775219 < 1 (margin 6.2897e-6, all slacks inside).",
  subclassBracket:
    "One-packet-per-block parity-pure threshold certified inside [11603/50000, 2901/12500) - width 2e-5. Lower end: the carried THEOREM WS witness (blocks 0/2/4, certified E > 0 at 0.23206) lies in this subclass. Upper end: this module. Measured color (float only): coupled-corner 5-ladder root 0.23207302409715935, so the certificate sits 6.98e-6 above the measured subclass optimum; carried landmarks 0.23206852812691425 (grid family root) and 0.23207203643507168 (3-block position limit) sit below it.",
  structuralConsequence:
    "Any FULL-class parity-pure witness with E > 0 at rates >= 2901/12500 must place at least two packets in one block. The surviving certified sandwich interval [0.23208, 0.24502] is therefore MULTI-PACKET-ONLY: the imp-95140-subgap-displacement-credit leg is localized to an intra-block aggregation price - cross-block one-per-block geometry is closed at 2901/12500, within 7e-6 of its measured optimum. Before this step the localization was measured only.",
  supersedes:
    "THEOREM RT (imp-95131, same class, constant 2/5 = 0.4) at the constant level; COROLLARY FR (imp-95141, same constant, fixed grid positions, 3 blocks, even parity) at the scope level. THEOREM HS (12251/50000, full class) is NOT touched; the class sandwich [0.23206, 0.24502] is unchanged.",
  honestAttribution:
    "The constant 2901/12500 was already certified by COROLLARY FR at three FIXED positions; the gain here is scope (free positions, any number of blocks, both parities) - the free-position/multi-block coverage was previously measured-only evidence (position battery, 5/7-block extension landmarks). The class sandwich does not move; the step is a certified localization of the surviving ceiling interval onto intra-block aggregation.",
  subGaps: [
    "imp-95140-subgap-displacement-credit - OPEN, now certified-localized: close [0.23208, ~0.24493] for the full class by pricing INTRA-BLOCK multi-packet aggregation against the one-per-block ladder margin (this module closes the cross-block geometry at 2901/12500); the rate-aware Gram cross-term lower bound or the exact four-region in-ramp tilted pair excess remain the named routes.",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this module certifies the one-per-block subclass at 0.23208; the phi-conditional odd-mass bound itself is not established",
    "the multi-packet aggregation price (at least two packets in one block) is the entire surviving obstruction between 2901/12500 and the THEOREM HS constant 12251/50000 - untouched here",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM FP is unconditional given the carried Lemma RC (imp-95131, full calculus proof): the reduction is entrywise domination with nonnegative amplitudes plus weighted AM-GM at explicit positive vectors (valid for ANY positive vector - the float Perron iterations need no certification), the entry caps are N = 60 even-truncation upper bounds with explicit float budgets (62 * 2^{-52} * e^15 < 5e-8 << the 1e-6 slack) and the elementary Lemma EC g(z) <= exp(-z/2) for z >= 3, the u_1 cell cover is a deterministic exact cover of [4, 8] recomputed at build, and the tail is closed by Lemma TR and the TAILSLACK head-row absorption with explicit constants. Every approximation inflates caps or ratios - the certificate can fail spuriously but cannot certify spuriously. Scope: parity-pure model family, AT MOST ONE PACKET PER BLOCK; the full-class sandwich [0.23206, 0.24502] is carried unchanged; the subclass bracket does not determine the class threshold; float landmarks 0.2320730, 0.2320720, 0.2320685 measured only; the imp-95140-subgap-displacement-credit leg stays OPEN (localized, not closed); parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN; floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95142_FREE_POSITION_LADDER_THRESHOLD_ASSERTIONS = [
  {
    id: "imp95142-cell-cover-certifies",
    description:
      "the deterministic adaptive cover of u_1 in [4, 8] certifies: no failure, 14 cells, deepest depth 13, exact cover (first left end 4, last right end 8, adjacent endpoints match), worst certified Collatz-Wielandt bound 0.99999371029775219 < 1 with margin > 6e-6",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const cs = CERT.cells;
      return (
        !CERT.failed &&
        cs.length === CELLS_LIT &&
        CERT.maxDepth === MAX_DEPTH_LIT &&
        cs[0][0] === 4 &&
        cs[cs.length - 1][1] === 8 &&
        cs.every((c, i) => i === 0 || Math.abs(c[0] - cs[i - 1][1]) < 1e-12) &&
        cs[0][1] === FIRST_CELL_RIGHT_LIT &&
        rel(WORST_BOUND, WORST_BOUND_LIT, 1e-9) &&
        WORST_BOUND < 1 &&
        1 - WORST_BOUND > 6e-6
      );
    },
  },
  {
    id: "imp95142-cap-validity",
    description:
      "certified cap validity: EHALF_HI strictly exceeds exp(-1/2); every series argument used is <= 15 < 62 = N + 2 (even N = 60); the ten per-cell z values reproduce gcap >= exact g at 40 spot arguments including all entry arguments; Lemma EC grid check 1 + z <= exp(z/2) on [3, 43] plus the exact endpoint 4 < exp(1.5)",
    holds: () => {
      if (!(EHALF_HI > Math.exp(-0.5))) return false;
      const zs = [
        MU_FP * 2,
        MU_FP * 6,
        MU_FP * 14,
        MU_FP * 8,
        MU_FP * 12,
        MU_FP * 62,
        MU_FP * 56,
        MU_FP * 32,
        MU_FP * 254,
        MU_FP * 248,
        MU_FP * 224,
        MU_FP * 128,
      ];
      for (const z of zs) {
        if (z <= 15 && !(z < 62)) return false;
        if (!(gcap(z) >= gFun(z))) return false;
      }
      for (let i = 0; i <= 27; i++) {
        const z = 0.1 + i * 2.2;
        if (!(gcap(z) >= gFun(z))) return false;
      }
      for (let i = 0; i <= 4000; i++) {
        const z = 3 + i * 0.01;
        if (1 + z > Math.exp(z / 2)) return false;
      }
      return 4 < Math.exp(1.5);
    },
  },
  {
    id: "imp95142-tail-lemmas",
    description:
      "analytic tail constants: head-row tail-column mass EHALF_HI^118 = 2.4e-26 < TAILSLACK = 1e-19; Lemma TR tail-row bound at b = 5 is 2.9e-15 < 1e-14 with the baked floors (v_4 >= 1e-10, total weight <= 6); the per-step decrease arithmetic 1.83 * 4^{b-5} >= 1 holds at b = 5",
    holds: () =>
      TAILCOL < TAILSLACK &&
      TAILCOL < 3e-26 &&
      TR5 < 1e-14 &&
      TR5 > 0 &&
      2 * MU_FP * Math.pow(4, 4) - 1 >= 117 &&
      1.83 * Math.pow(4, 0) >= 1,
  },
  {
    id: "imp95142-naive-cap-refuted",
    description:
      "in-run refutation preserved: the naive independent facing-edge cap matrix (u_1 simultaneously at both ends of its block) has lamMax = 1.0942 > 1 at mu* - the u_1 cell coupling is essential, not decorative",
    holds: () => NAIVE_BOUND > 1.09 && NAIVE_BOUND < 1.1,
  },
  {
    id: "imp95142-subclass-bracket",
    description:
      "bracket ordering and sharpness anchors: 11603/50000 < grid-root 0.23206852812691425 < 3-block edge limit 0.23207203643507168 < coupled-corner 5-ladder root 0.23207302409715935 (measured, recomputed) < 2901/12500 < 2/5; the carried THEOREM WS witness has E = 7187.41735804081 > 0 at 11603/50000 (float cross-check of the certified statement)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        MU_WS < ROOT_GRID_CARRIED &&
        ROOT_GRID_CARRIED < ROOT_EDGE_CARRIED &&
        ROOT_EDGE_CARRIED < ROOT5 &&
        rel(ROOT5, ROOT5_LIT, 1e-12) &&
        ROOT5 < MU_FP &&
        MU_FP - ROOT5 > 6e-6 &&
        MU_FP < MU_RT &&
        rel(E_WS, E_WS_LIT, 1e-9) &&
        E_WS > 0
      );
    },
  },
  {
    id: "imp95142-witness-battery",
    description:
      "THEOREM FP approached directly: 5961 seeded one-per-block witnesses over ladder blocks 0..10, BOTH parities, free positions, mixed rates >= 2901/12500 (rate-pinned at the floor every third draw), amplitude zeros allowed - max E = -0.0007081118569591425 strictly negative, zero E > 0 draws",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT_A.viol === 0 &&
        BAT_A.maxE < 0 &&
        BAT_A.count === BAT_A_COUNT_LIT &&
        rel(BAT_A.maxE, BAT_A_MAX_E_LIT, 1e-6)
      );
    },
  },
  {
    id: "imp95142-domination-battery",
    description:
      "entrywise domination approached directly: 6000 seeded 5-block position tuples - every exact g value is dominated by its containing-cell cap (worst ratio 0.9988152535822168, zero violations, every u_1 draw found a containing cell)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT_B.viol === 0 &&
        BAT_B.count === 6000 &&
        BAT_B.worst <= 1 + 1e-12 &&
        rel(BAT_B.worst, BAT_B_WORST_LIT, 1e-6)
      );
    },
  },
  {
    id: "imp95142-honesty-gate",
    description:
      "the verdict is scoped: one packet per block only, class sandwich carried unchanged, displacement-credit leg OPEN (localized not closed), parent sub-gap OPEN, float landmarks measured only, attribution states the FR-constant reuse plainly; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95142_FREE_POSITION_LADDER_THRESHOLD.promotesBound === false &&
      /NO QED/.test(IMP95142_FREE_POSITION_LADDER_THRESHOLD.rigorScope) &&
      /refereed bound is changed/i.test(IMP95142_FREE_POSITION_LADDER_THRESHOLD.rigorScope) &&
      /localized, not closed/.test(IMP95142_FREE_POSITION_LADDER_THRESHOLD.rigorScope) &&
      /measured only/.test(IMP95142_FREE_POSITION_LADDER_THRESHOLD.rigorScope) &&
      /AT MOST ONE PACKET PER BLOCK/.test(IMP95142_FREE_POSITION_LADDER_THRESHOLD.rigorScope) &&
      /measured-only/.test(IMP95142_FREE_POSITION_LADDER_THRESHOLD.honestAttribution) &&
      /remains OPEN/.test(IMP95142_FREE_POSITION_LADDER_THRESHOLD.openResiduals[0]) &&
      /untouched here/.test(IMP95142_FREE_POSITION_LADDER_THRESHOLD.openResiduals[1]) &&
      IMP95142_FREE_POSITION_LADDER_THRESHOLD.subGaps.length === 1 &&
      IMP95142_FREE_POSITION_LADDER_THRESHOLD.openResiduals.length === 3,
  },
];

for (const a of IMP95142_FREE_POSITION_LADDER_THRESHOLD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95142-free-position-ladder-threshold assertion failed: ${a.id}`);
  }
}

export default IMP95142_FREE_POSITION_LADDER_THRESHOLD;
