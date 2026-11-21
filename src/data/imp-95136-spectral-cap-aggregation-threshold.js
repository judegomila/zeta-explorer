/**
 * imp-95136 - THEOREM SA (spectral cap aggregation, rate threshold
 * 69/250): NARROWS imp-95134-subgap-aggregation-threshold-sharpness on
 * the AGGREGATION side, [0.23, 0.4] -> [0.23, 69/250 = 0.276]. The
 * imp-95135 diagnosis located the surviving sandwich slack in the
 * AM-GM row reduction: the row majorant charges every block the full
 * sorted-gap ladder (max-row-sum = the l-infinity bound on the spectral
 * radius, float root 0.389), while E > 0 is governed by the actual
 * largest eigenvalue. This module REMOVES the aggregation slack exactly:
 * the row reduction is replaced by the exact quadratic-form (spectral)
 * bound, whose only remaining looseness is the entrywise gap between the
 * true correlation matrix and the sharp cap matrix.
 *
 * THEOREM SA. Let W be any MAJ witness of the sibling-chain class
 * (nonnegative amplitudes a_i, free positive rates mu_i, positions
 * u_i in [2^{b_i}, 2^{b_i + 1})) that is PARITY-PURE (all blocks of one
 * parity), with ANY number of packets per block. If every rate satisfies
 * mu_i >= 69/250, then E <= 0. Contrapositive: every E > 0 witness in
 * the full parity-pure class carries a rate mu_min < 69/250 = 0.276.
 * This SUPERSEDES THEOREM CC (2/5, imp-95134) on the same class at the
 * constant level; CC's sharp cluster cap is consumed as the engine here.
 *
 * PROOF CHAIN (all unconditional).
 *
 * LEMMA QF (exact spectral form of the aggregation - replaces AM-GM).
 * By Lemma L2 (carried, imp-95132) E = norm(sum_b F_b)^2
 * - 2 sum_b norm(F_b)^2 over the block-cluster functions F_b. Dropping
 * zero-norm clusters and writing v_b = norm(F_b) > 0,
 *   E = v^T R v - |v|^2 <= (lamMax(R) - 1) |v|^2,
 * where R is the zero-diagonal normalized cluster correlation matrix
 * R_{b,bp} = <F_b, F_bp> / (v_b v_bp) (entries >= 0: parity-pure cluster
 * functions are nonnegative combinations of positive two-sided
 * exponential profiles). The bound is EXACT: cluster-wise amplitude
 * scalings realize every v >= 0 at fixed R, and sup over v of E / |v|^2
 * equals lamMax(R) - 1 at the (nonnegative) Perron vector. So NO
 * aggregation slack survives this step - E > 0 is attainable over a
 * fixed cluster geometry IF AND ONLY IF lamMax(R) > 1.
 *
 * CAP DOMINATION (carried). The sharp cluster cap (imp-95134) gives
 * 0 <= R_{b,bp} <= g(mu D(b,bp)), g(z) = (1 + z) exp(-z), with
 * D(b,bp) = 2^{max} - 2^{min + 1} the facing-edge interval gap and mu
 * the global minimum rate. For symmetric entrywise-ordered nonnegative
 * matrices 0 <= A <= B, lamMax(A) <= lamMax(B) (Perron argument carried
 * from imp-95135 Corollary RM(i)). The occupied-block matrix is a
 * principal submatrix of the FULL even-lattice cap matrix C(mu) on
 * blocks {0, 2, 4, ...} (indices k -> block 2k, entries
 * C_{jk} = g(mu (2^{2 max} - 2^{2 min + 1}))), and a principal
 * submatrix of a symmetric matrix has smaller lamMax (variational).
 * LEMMA OG (odd-to-even gap doubling - exact): the odd-parity gap
 * between blocks 2j + 1 and 2k + 1 is 2^{2k + 1} - 2^{2j + 2}
 * = 2 (2^{2k} - 2^{2j + 1}), exactly TWICE the index-matched even gap,
 * so the odd cap matrix is entrywise dominated by the even one (g
 * strictly decreasing) - even parity is binding. Hence for every
 * parity-pure witness, lamMax(R) <= lamMax(C(mu)).
 *
 * LEMMA HT (head/tail split). Split C(mu) = H + T with H the 4 x 4 head
 * (blocks 0/2/4/6) padded by zeros and T the symmetric nonnegative
 * remainder (every entry with an index >= 4). At mu = 69/250 every row
 * sum of T is <= 222 U552^{64}: a tail row k >= 4 has <= k down-entries,
 * each with gap >= 2^{2k} - 2^{2k - 1} = 2^{2k - 1} >= 128, and
 * up-entries dominated by twice the first (g(4z)/g(z) <= 4 exp(-3z)),
 * so row_k <= (k + 2) g(mu 2^{2k - 1}) <= 6 g(35.328) 2^{-(k - 4)};
 * a head-coupling row j < 4 has gap to every tail block
 * >= 2^8 - 2^7 = 128, so row_j <= 2 g(35.328). Sup over rows
 * <= 12 g(35.328) <= 12 x 37 x U552^{64} = 444 U552^{64}
 * = 2.0166359895508212e-13 (with 1 + 35.328 <= 37 and
 * exp(-35.328) = (exp(-0.552))^{64} <= U552^{64}). Since lamMax is
 * subadditive on symmetric matrices and lamMax(T) <= sup row sum,
 *   lamMax(C(69/250)) <= lamMax(H) + 444 U552^{64}.
 *
 * SYLVESTER CERTIFICATE (mu = 69/250). Head entries are dominated by
 * Chat_{jk} = (1 + mu D) U552^{D / 2}, where
 * U552 = sum for n = 0..20 of (-0.552)^n / n! + 1e-12
 *      = 0.5757970638914645 >= exp(-0.552)
 * (even-N truncation of the alternating series = upper bound, term
 * magnitudes decreasing from n >= 1 at z = 0.552 < 1; the explicit 1e-12
 * float slack absorbs double rounding, sibling imp-95135 convention) and
 * mu D = 0.552 (D / 2) exactly, D / 2 an integer for every head pair
 * (D in {2, 8, 14, 32, 56, 62}). The four leading principal minors of
 * (1 - 1e-6) I - Chat are
 *   0.999999, 0.20141083509405144, 0.00232405085381185,
 *   0.0023236287039887873,
 * all > 1e-6 > 0, so by SYLVESTER's criterion (symmetric matrix,
 * positive leading principal minors <=> positive definite)
 * (1 - 1e-6) I - Chat is positive definite and lamMax(Chat) < 1 - 1e-6.
 * Entrywise H <= Chat gives lamMax(H) <= lamMax(Chat), hence
 *   lamMax(C(69/250)) < 1 - 1e-6 + 2.02e-13 < 1,
 * and by LEMMA QF every parity-pure witness with rates >= 69/250 has
 * E <= (lamMax - 1)|v|^2 <= 0. QED. (No M-matrix theory is needed: the
 * cap matrix is symmetric, so Sylvester suffices.)
 *
 * MEASURED COLOR (float, not certified). The spectral root
 * lamMax(C(mu)) = 1 sits at mu = 0.2753980121576107, SATURATED in the
 * block count (the 8-block root equals the 4-block root to machine
 * precision); bracket lamMax(C(0.275)) = 1.000747689890722 > 1 >
 * lamMax(C(0.276)) = 0.9988728085004597. The certified constant 69/250
 * sits 6e-4 above the float root - the spectral-cap method is exhausted
 * at ~0.2754 and cannot reach the witness saturation 0.2321.
 *
 * SLACK DIAGNOSIS (what survives). LEMMA QF makes the aggregation step
 * an equality (attained at the Perron vector), so the residual float
 * interval [0.2321 (imp-95135 witness chain saturation), 0.2754
 * (cap-matrix root)] is now entirely CAP-SIMULTANEITY: each entry of
 * C(mu) is individually attained (the imp-95134 cap is sharp when ALL
 * cluster mass hugs the ONE facing edge), but a middle cluster cannot
 * concentrate at both of its edges at once, so no witness realizes
 * C(mu) entrywise. NEW named leg
 * imp-95136-subgap-cap-simultaneity: prove a joint two-sided cluster
 * correlation constraint (a vector cap tying rho(F_b, left neighbor)
 * and rho(F_b, right neighbor) through the mass split of F_b) and close
 * [0.23, 0.276].
 *
 * WHAT THIS NARROWS AND WHAT IT DOES NOT.
 * (1) imp-95134-subgap-aggregation-threshold-sharpness NARROWED on the
 *     aggregation side: certified sandwich [0.23, 0.4] -> [0.23, 0.276]
 *     (width 0.17 -> 0.046). The AM-GM/row-sum aggregation lever is
 *     CLOSED (replaced by an exact spectral step); the leg stays OPEN
 *     with the surviving slack renamed to cap-simultaneity.
 * (2) THEOREM CC (2/5) superseded at the constant level on the full
 *     parity-pure class; its sharp cluster cap is the engine here.
 *     THEOREM WE (23/100 witness) untouched and consistent
 *     (23/100 < 69/250; the witness has E(69/250) < 0).
 * (3) imp-95131-subgap-rate-to-phi-pricing further upgraded: the pricing
 *     chain may now use forced mu_min < 69/250 over the full parity-pure
 *     class (was < 2/5).
 * (4) Parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN.
 *
 * HONEST LIMITS. (a) Model-family constants (sigma = 1, theta = 10,
 * beta = 1/3, c = v = D = 1), not the paper Section 4.5 packets.
 * (b) 69/250 is the certified constant, not the sharp class threshold
 * (sandwich [0.23, 0.276]; float landmarks 0.2321 and 0.2754 measured
 * only). (c) Parity-pure only. (d) Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) The reduction chain was stress-tested
 * with 3000 seeded free-floor multi-packet parity-pure witnesses
 * (2-5 blocks, up to 4 packets per block, edge-piled every third draw,
 * floors 0.05..0.55, rate spreads to 30x): zero violations of the
 * entrywise cap R <= C, zero violations of E <= (lamMax(R) - 1)|v|^2,
 * zero violations of lamMax(R) <= lamMax(C_occupied); max E / |v|^2
 * = -0.34476426497437523. (2) The Sylvester dichotomy itself was
 * approached on 2000 seeded random symmetric nonnegative matrices
 * (n = 2..5, thresholds s in 0.3..1.8): sign(all leading minors of
 * sI - B positive) agrees with sign(lamMax(B) < s) in every non-boundary
 * case. (3) LEMMA OG is exact integer arithmetic, checked for all
 * j < k <= 20. (4) The theorem battery probes THEOREM SA directly:
 * 6000 seeded parity-pure multi-packet witnesses at rates >= 69/250:
 * max E = -0.0002949516522176497, zero E > 0 draws. (5) The certificate
 * entries dominate the exact caps at all six head pairs, and the
 * numeric remainder row sums (tail rows k = 4..8, coupling rows
 * j = 0..3, blocks to 16) all sit below 222 U552^{64}. (6) Consistency:
 * lamMax(C(2/5)) <= S(2/5) = 0.980031490781631 (the spectral bound is
 * pointwise at least as strong as the imp-95134 row majorant), and the
 * THEOREM WE witness keeps E > 0 at 23/100 < 69/250. (7) Scope honesty:
 * parity-pure only, the constant is not sharp, the leg and the parent
 * sub-gap stay OPEN, nothing promoted.
 *
 * Import-light (no heavy bundle, no imports). The numerics cross-check
 * the theorem; the theorem is the displayed lemma chain.
 */

// g(z) = exp(-z)(1 + z): sharp cluster cap profile (imp-95134)
const g = (z) => Math.exp(-z) * (1 + z);

// exact sibling Gram kernel (identical to imp-95130..95135)
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// truncated alternating exponential series: N even => upper bound of
// exp(-z) for 0 <= z < N + 2 (sibling imp-95135 convention)
function expTrunc(z, N) {
  let s = 1;
  let t = 1;
  for (let n = 1; n <= N; n++) {
    t = (t * -z) / n;
    s += t;
  }
  return s;
}

const MU_SA = 69 / 250; // certified threshold 0.276
const U552 = expTrunc(0.552, 20) + 1e-12; // >= exp(-0.552), float slack explicit

// even-lattice facing-edge gap: index i -> block 2i
const gapD = (i, j) => Math.pow(2, 2 * Math.max(i, j)) - Math.pow(2, 2 * Math.min(i, j) + 1);

// exact float cap matrix C(mu) on the first n even blocks
function capMatrix(mu, n) {
  const C = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) C[i][j] = g(mu * gapD(i, j));
    }
  }
  return C;
}

// certified head matrix Chat: entries (1 + mu D) U552^{D/2} >= g(mu D)
function capHat() {
  const C = Array.from({ length: 4 }, () => new Array(4).fill(0));
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i !== j) {
        const d = gapD(i, j);
        C[i][j] = (1 + MU_SA * d) * Math.pow(U552, d / 2);
      }
    }
  }
  return C;
}

// leading principal minors of s I - B (partial-pivot LU)
function leadingMinors(B, s) {
  const n = B.length;
  const M = B.map((r, i) => r.map((x, j) => (i === j ? s : 0) - x));
  const out = [];
  for (let k = 1; k <= n; k++) {
    const A = Array.from({ length: k }, (_, i) => M[i].slice(0, k));
    let det = 1;
    for (let c = 0; c < k; c++) {
      let p = c;
      for (let r = c + 1; r < k; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      if (p !== c) {
        [A[p], A[c]] = [A[c], A[p]];
        det = -det;
      }
      det *= A[c][c];
      for (let r = c + 1; r < k; r++) {
        const fct = A[r][c] / A[c][c];
        for (let cc = c; cc < k; cc++) A[r][cc] -= fct * A[c][cc];
      }
    }
    out.push(det);
  }
  return out;
}

// power iteration for lamMax of a symmetric nonnegative matrix
function lamMax(C, iters) {
  const n = C.length;
  let v = new Array(n).fill(1 / Math.sqrt(n));
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const w = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) w[i] += C[i][j] * v[j];
    }
    const nn = Math.sqrt(w.reduce((s, x) => s + x * x, 0));
    if (nn === 0) return 0;
    lam = nn;
    v = w.map((x) => x / nn);
  }
  return lam;
}

// float spectral root of lamMax(C(mu, n)) = 1 (measured landmark only)
function spectralRoot(n) {
  let lo = 0.2;
  let hi = 0.5;
  for (let it = 0; it < 100; it++) {
    const m = (lo + hi) / 2;
    if (lamMax(capMatrix(m, n), 3000) > 1) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// seeded LCG (deterministic batteries)
let seedState = 424242;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}
function mkClusterIn(lo, hi, mMax, rateLo, rateHi, edge, edgeAt) {
  const m = 1 + Math.floor(rnd() * mMax);
  const us = [];
  const as = [];
  const mus = [];
  for (let i = 0; i < m; i++) {
    const frac = edge ? rnd() * rnd() * rnd() : rnd();
    us.push(edgeAt === "hi" ? hi - frac * (hi - lo) : lo + frac * (hi - lo));
    as.push(rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd()));
    mus.push(rateLo * Math.pow(rateHi / rateLo, rnd() * rnd()));
  }
  return { us, as, mus };
}
function gram(us, as, mus) {
  let s = 0;
  for (let i = 0; i < us.length; i++) {
    for (let j = 0; j < us.length; j++) {
      s += as[i] * as[j] * kernelK(mus[i], mus[j], Math.abs(us[i] - us[j]));
    }
  }
  return s;
}
function clusterIP(c1, c2) {
  let s = 0;
  for (let i = 0; i < c1.us.length; i++) {
    for (let j = 0; j < c2.us.length; j++) {
      s += c1.as[i] * c2.as[j] * kernelK(c1.mus[i], c2.mus[j], Math.abs(c1.us[i] - c2.us[j]));
    }
  }
  return s;
}

// battery A (seed 424242): the reduction chain E <= (lamMax(R) - 1)|v|^2,
// R <= C entrywise, lamMax(R) <= lamMax(C_occupied), free rate floors
function runReductionBattery() {
  seedState = 424242;
  let worstCapViol = 0;
  let redViol = 0;
  let chainViol = 0;
  let maxRatio = -Infinity;
  let count = 0;
  for (let t = 0; t < 3000; t++) {
    const parity = t % 2;
    const nbk = 2 + Math.floor(rnd() * 4);
    const bs = [];
    while (bs.length < nbk) {
      const b = parity + 2 * Math.floor(rnd() * 8);
      if (!bs.includes(b)) bs.push(b);
    }
    bs.sort((x, y) => x - y);
    const mu0 = 0.05 + rnd() * 0.5;
    const clusters = bs.map((b) =>
      mkClusterIn(Math.pow(2, b), Math.pow(2, b + 1), 4, mu0, mu0 * 30, t % 3 === 0, rnd() < 0.5 ? "hi" : "lo"),
    );
    const norms = clusters.map((c) => gram(c.us, c.as, c.mus));
    const keep = norms.map((nv, i) => (nv > 1e-300 ? i : -1)).filter((i) => i >= 0);
    if (keep.length < 2) continue;
    const v = keep.map((i) => Math.sqrt(norms[i]));
    const muAll = Math.min(...keep.flatMap((i) => clusters[i].mus));
    const n = keep.length;
    const R = Array.from({ length: n }, () => new Array(n).fill(0));
    const C = Array.from({ length: n }, () => new Array(n).fill(0));
    let E = -norms.reduce((x, y) => x + y, 0);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const bi = bs[keep[i]];
        const bj = bs[keep[j]];
        const ip = clusterIP(clusters[keep[i]], clusters[keep[j]]);
        E += 2 * ip;
        R[i][j] = R[j][i] = ip / (v[i] * v[j]);
        const d = Math.pow(2, Math.max(bi, bj)) - Math.pow(2, Math.min(bi, bj) + 1);
        C[i][j] = C[j][i] = g(muAll * d);
        if (R[i][j] > C[i][j] * (1 + 1e-9)) worstCapViol++;
      }
    }
    const lamR = lamMax(R, 2000);
    const lamC = lamMax(C, 2000);
    const v2 = v.reduce((s, x) => s + x * x, 0);
    if (E > (lamR - 1) * v2 + 1e-9 * Math.abs((lamR - 1) * v2) + 1e-12) redViol++;
    if (lamR > lamC * (1 + 1e-9)) chainViol++;
    if (E / v2 > maxRatio) maxRatio = E / v2;
    count++;
  }
  return { worstCapViol, redViol, chainViol, maxRatio, count };
}

// battery B (seed 777001): THEOREM SA direct approach at rates >= 69/250
function runTheoremBattery() {
  seedState = 777001;
  let maxE = -Infinity;
  let viol = 0;
  for (let t = 0; t < 6000; t++) {
    const parity = t % 2;
    const nbk = 2 + Math.floor(rnd() * 4);
    const bs = [];
    while (bs.length < nbk) {
      const b = parity + 2 * Math.floor(rnd() * 10);
      if (!bs.includes(b)) bs.push(b);
    }
    bs.sort((x, y) => x - y);
    const clusters = bs.map((b) =>
      mkClusterIn(Math.pow(2, b), Math.pow(2, b + 1), 5, MU_SA, MU_SA * 100, t % 3 === 0, rnd() < 0.5 ? "hi" : "lo"),
    );
    const norms = clusters.map((c) => gram(c.us, c.as, c.mus));
    let E = -norms.reduce((x, y) => x + y, 0);
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) E += 2 * clusterIP(clusters[i], clusters[j]);
    }
    if (E > maxE) maxE = E;
    if (E > 0) viol++;
  }
  return { maxE, viol };
}

// battery C (seed 313131): Sylvester dichotomy approach - minors of sI - B
// all positive iff lamMax(B) < s, on random symmetric nonnegative B
function runSylvesterBattery() {
  seedState = 313131;
  let disagree = 0;
  for (let t = 0; t < 2000; t++) {
    const n = 2 + Math.floor(rnd() * 4);
    const B = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        B[i][j] = B[j][i] = rnd() * 0.8;
      }
    }
    const s = 0.3 + rnd() * 1.5;
    const mins = leadingMinors(B, s);
    const allPos = mins.every((m) => m > 1e-12);
    const lam = lamMax(B, 3000);
    if (Math.abs(lam - s) < 1e-6) continue;
    if (allPos !== (lam < s)) disagree++;
  }
  return { disagree };
}

// THEOREM WE witness (positions/amplitudes exactly as in imp-95135)
const P_WE = 999983;
const K_WE = [499992, 249995, 62498];
const U_WE = K_WE.map((k) => P_WE / k);
const A_WE = [675, 685, 276];
function eWitnessWE(mu) {
  let E = -(A_WE[0] * A_WE[0] + A_WE[1] * A_WE[1] + A_WE[2] * A_WE[2]) / mu;
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      E += 2 * A_WE[i] * A_WE[j] * kernelK(mu, mu, Math.abs(U_WE[i] - U_WE[j]));
    }
  }
  return E;
}

const BAT_RED = runReductionBattery();
const BAT_SA = runTheoremBattery();
const BAT_SYL = runSylvesterBattery();

// baked literals (recomputed by the assertions)
const U552_LIT = 0.5757970638914645;
const MINOR1_LIT = 0.999999;
const MINOR2_LIT = 0.20141083509405144;
const MINOR3_LIT = 0.00232405085381185;
const MINOR4_LIT = 0.0023236287039887873;
const REMAINDER_LIT = 2.0166359895508212e-13;
const LAM_HAT_LIT = 0.998872808503416;
const LAM_0275_LIT = 1.000747689890722;
const LAM_0276_LIT = 0.9988728085004597;
const SPECTRAL_ROOT_LIT = 0.2753980121576107;
const S_MUSTAR_LIT = 0.980031490781631; // imp-95134 row-majorant S(2/5)
const BAT_RED_MAXRATIO_LIT = -0.34476426497437523;
const BAT_RED_COUNT_LIT = 2931;
const BAT_SA_MAX_E_LIT = -0.0002949516522176497;
const E_WE_23_LIT = 17796.715801475395;
const E_WE_SA_LIT = -279683.10607569374;

export const IMP95136_SPECTRAL_CAP_AGGREGATION_THRESHOLD = {
  ticket:
    "imp-95136 (THEOREM SA: spectral cap aggregation, certified rate threshold 69/250 over the FULL parity-pure MAJ witness class - E > 0 forces mu_min < 69/250 = 0.276; NARROWS imp-95134-subgap-aggregation-threshold-sharpness on the aggregation side, sandwich [0.23, 0.4] -> [0.23, 0.276], and CLOSES the AM-GM/row-sum aggregation lever by replacing it with an exact quadratic-form step)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the imp-95132 Lemma L2 cluster geometry, the imp-95134 sharp cluster cap (1 + mu D) exp(-mu D), and the imp-95135 Perron entrywise-monotonicity step; directly progresses imp-95130-subgap-phi-conditional-odd-mass.",
  theoremSA:
    "Any parity-pure MAJ witness of the sibling-chain class with ANY number of packets per block and all rates mu_i >= 69/250 has E <= 0. Contrapositive: E > 0 forces mu_min < 69/250 = 0.276 (supersedes THEOREM CC 2/5 at the constant level). Proof chain: Lemma QF (E = v^T R v - |v|^2 <= (lamMax(R) - 1)|v|^2, exact at the Perron vector - the AM-GM row reduction replaced by its spectral completion) + cap domination (sharp cluster cap + entrywise Perron monotonicity + principal-submatrix interlacing + Lemma OG odd-to-even gap doubling) + Lemma HT (head/tail split, remainder rows <= 444 U552^64 = 2.0166359895508212e-13) + the Sylvester certificate: minors of (1 - 1e-6) I - Chat all positive with Chat_{jk} = (1 + mu D) U552^{D/2}, U552 = 0.5757970638914645 >= exp(-0.552).",
  lemmaQF:
    "Exact spectral aggregation: over occupied clusters with v_b = norm(F_b), E = v^T R v - |v|^2 where R is the zero-diagonal normalized cluster correlation matrix (nonnegative entries), so sup over amplitude scalings of E / |v|^2 = lamMax(R) - 1 exactly - E > 0 is attainable over a fixed cluster geometry iff lamMax(R) > 1. This removes ALL aggregation slack; the surviving looseness is only R < C entrywise (cap simultaneity).",
  sylvesterCertificate:
    "Head cap matrix on blocks 0/2/4/6 at mu = 69/250, entries (1 + mu D) U552^{D/2} with D in {2, 8, 14, 32, 56, 62} and mu D = 0.552 (D/2) exactly; leading principal minors of (1 - 1e-6) I - Chat: 0.999999, 0.20141083509405144, 0.00232405085381185, 0.0023236287039887873, all positive, so by Sylvester the matrix is positive definite and lamMax(Chat) < 1 - 1e-6; adding the certified remainder 444 U552^64 keeps lamMax(C(69/250)) < 1.",
  thresholdSandwich:
    "Certified sharp-threshold sandwich for the full parity-pure class: [23/100, 69/250] = [0.23, 0.276] (was [0.23, 0.4]). Float landmarks (measured, NOT certified): witness chain saturation 0.2321 (imp-95135) and cap-matrix spectral root 0.2753980121576107 (block-count saturated; bracket lamMax(C(0.275)) = 1.000747689890722 > 1 > lamMax(C(0.276)) = 0.9988728085004597).",
  slackDiagnosis:
    "The aggregation lever is CLOSED (Lemma QF is an equality at the Perron vector). The surviving float interval [0.2321, 0.2754] is entirely CAP-SIMULTANEITY: each cap-matrix entry is individually attained (all cluster mass at the one facing edge) but a middle cluster cannot hug both of its edges at once, so no witness realizes C(mu) entrywise.",
  subGaps: [
    "imp-95136-subgap-cap-simultaneity - OPEN: prove a joint two-sided cluster correlation constraint (a vector cap tying rho(F_b, left) and rho(F_b, right) through the mass split of F_b) and close the residual [0.23, 0.276].",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this module sharpens the forced-rate constant to mu_min < 69/250; the phi-conditional odd-mass bound itself is not established",
    "imp-95134-subgap-aggregation-threshold-sharpness stays OPEN, narrowed to [0.23, 0.276] with the surviving slack renamed cap-simultaneity (imp-95136-subgap-cap-simultaneity)",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM SA is unconditional given the sibling-chain witness conventions: Lemma QF is the exact quadratic-form identity on the Lemma L2 cluster geometry (no inequality beyond lamMax), the cap domination chain carries the imp-95134 sharp cluster cap and the imp-95135 Perron step, Lemma OG is exact integer arithmetic, Lemma HT is a row-sum bound with explicit rational-power domination, and the head certificate is Sylvester's criterion on a 4x4 matrix whose entries dominate the exact caps through the single alternating-series constant U552 >= exp(-0.552) (explicit 1e-12 float slack, sibling convention). The batteries and grids are CROSS-CHECKS; the theorem is the displayed lemma chain. Scope: parity-pure, model-family constants; the certified constant 69/250 is not the sharp threshold (sandwich [0.23, 0.276]); the aggregation leg stays OPEN under the cap-simultaneity residual; parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN; floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95136_SPECTRAL_CAP_AGGREGATION_THRESHOLD_ASSERTIONS = [
  {
    id: "imp95136-sa-series-domination",
    description:
      "U552 = 0.5757970638914645 dominates exp(-0.552), and every certified head entry (1 + mu D) U552^{D/2} dominates the exact cap g(mu D) at all six head pairs (D in {2, 8, 14, 32, 56, 62}, mu = 69/250)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      if (!(rel(U552, U552_LIT, 1e-15) && U552 >= Math.exp(-0.552))) return false;
      const CH = capHat();
      for (let i = 0; i < 4; i++) {
        for (let j = i + 1; j < 4; j++) {
          if (CH[i][j] < g(MU_SA * gapD(i, j))) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95136-sa-sylvester-certificate",
    description:
      "the four leading principal minors of (1 - 1e-6) I - Chat are 0.999999, 0.20141083509405144, 0.00232405085381185, 0.0023236287039887873 - all > 1e-6 > 0, so by Sylvester lamMax(Chat) < 1 - 1e-6; the smallest minor margin 2.3e-3 dwarfs the 1e-12 series slack and float rounding",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const mins = leadingMinors(capHat(), 1 - 1e-6);
      return (
        mins.length === 4 &&
        rel(mins[0], MINOR1_LIT, 1e-12) &&
        rel(mins[1], MINOR2_LIT, 1e-9) &&
        rel(mins[2], MINOR3_LIT, 1e-9) &&
        rel(mins[3], MINOR4_LIT, 1e-9) &&
        mins.every((m) => m > 1e-6) &&
        lamMax(capHat(), 5000) < 1 - 1e-6 &&
        rel(lamMax(capHat(), 5000), LAM_HAT_LIT, 1e-9)
      );
    },
  },
  {
    id: "imp95136-sa-remainder-bound",
    description:
      "the certified remainder 444 U552^64 = 2.0166359895508212e-13 < 1e-9, and the numeric remainder row sums (tail rows k = 4..8 and coupling rows j = 0..3 against blocks to index 16) all sit below the tighter 222 U552^64",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const rem = 444 * Math.pow(U552, 64);
      if (!(rel(rem, REMAINDER_LIT, 1e-12) && rem < 1e-9)) return false;
      const half = 222 * Math.pow(U552, 64);
      for (let k = 4; k <= 8; k++) {
        let rs = 0;
        for (let j = 0; j <= 16; j++) {
          if (j !== k) rs += g(MU_SA * gapD(j, k));
        }
        if (rs > half) return false;
      }
      for (let j = 0; j < 4; j++) {
        let rs = 0;
        for (let k = 4; k <= 16; k++) rs += g(MU_SA * gapD(j, k));
        if (rs > half) return false;
      }
      return true;
    },
  },
  {
    id: "imp95136-sa-spectral-root-landmarks",
    description:
      "float landmarks (measured, not certified): lamMax(C(0.275)) = 1.000747689890722 > 1 > lamMax(C(0.276)) = 0.9988728085004597, spectral root 0.2753980121576107, and the root is block-count saturated (4-block vs 8-block roots agree to 1e-12)",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const l275 = lamMax(capMatrix(0.275, 4), 5000);
      const l276 = lamMax(capMatrix(0.276, 4), 5000);
      const r4 = spectralRoot(4);
      const r8 = spectralRoot(8);
      return (
        rel(l275, LAM_0275_LIT, 1e-9) &&
        l275 > 1 &&
        rel(l276, LAM_0276_LIT, 1e-9) &&
        l276 < 1 &&
        rel(r4, SPECTRAL_ROOT_LIT, 1e-9) &&
        Math.abs(r4 - r8) < 1e-12
      );
    },
  },
  {
    id: "imp95136-sa-odd-parity-doubling",
    description:
      "Lemma OG exactly: the odd-parity facing-edge gap between blocks 2j+1 and 2k+1 equals TWICE the index-matched even gap for all j < k <= 20 (integer arithmetic), so the even cap matrix is binding",
    holds: () => {
      for (let j = 0; j < 20; j++) {
        for (let k = j + 1; k <= 20; k++) {
          const dOdd = Math.pow(2, 2 * k + 1) - Math.pow(2, 2 * j + 2);
          if (dOdd !== 2 * gapD(j, k)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95136-sa-reduction-battery",
    description:
      "the reduction chain approached on 3000 seeded free-floor multi-packet parity-pure witnesses (2931 evaluable): zero entrywise cap violations R <= C, zero violations of E <= (lamMax(R) - 1)|v|^2, zero violations of lamMax(R) <= lamMax(C_occupied); max E/|v|^2 = -0.34476426497437523",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT_RED.worstCapViol === 0 &&
        BAT_RED.redViol === 0 &&
        BAT_RED.chainViol === 0 &&
        BAT_RED.count === BAT_RED_COUNT_LIT &&
        rel(BAT_RED.maxRatio, BAT_RED_MAXRATIO_LIT, 1e-6)
      );
    },
  },
  {
    id: "imp95136-sa-theorem-battery",
    description:
      "THEOREM SA approached directly: 6000 seeded parity-pure multi-packet witnesses at rates >= 69/250 (2-5 blocks, up to 5 packets per block, edge-piled every third draw, both parities) - max E = -0.0002949516522176497 strictly negative, zero E > 0 draws",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return BAT_SA.viol === 0 && BAT_SA.maxE < 0 && rel(BAT_SA.maxE, BAT_SA_MAX_E_LIT, 1e-6);
    },
  },
  {
    id: "imp95136-sa-sylvester-dichotomy",
    description:
      "the Sylvester criterion itself approached on 2000 seeded random symmetric nonnegative matrices (n = 2..5, thresholds s in 0.3..1.8): all-leading-minors-positive agrees with lamMax < s in every non-boundary case",
    holds: () => BAT_SYL.disagree === 0,
  },
  {
    id: "imp95136-sa-consistency",
    description:
      "consistency: the THEOREM WE witness keeps E(23/100) = 17796.715801475395 > 0 with 23/100 < 69/250 (two-sided sandwich [0.23, 0.276]) and E(69/250) = -279683.10607569374 < 0; the spectral bound is pointwise at least as strong as the imp-95134 row majorant at 2/5 (lamMax(C(2/5)) <= S(2/5) = 0.980031490781631); 69/250 < 2/5 supersedes THEOREM CC at the constant level",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(eWitnessWE(23 / 100), E_WE_23_LIT, 1e-9) &&
        eWitnessWE(23 / 100) > 0 &&
        23 / 100 < MU_SA &&
        rel(eWitnessWE(MU_SA), E_WE_SA_LIT, 1e-9) &&
        eWitnessWE(MU_SA) < 0 &&
        lamMax(capMatrix(0.4, 4), 5000) <= S_MUSTAR_LIT &&
        MU_SA < 2 / 5
      );
    },
  },
  {
    id: "imp95136-sa-honesty-gate",
    description:
      "the verdict is scoped: parity-pure, model family, 69/250 certified not sharp, aggregation leg stays OPEN under the cap-simultaneity residual, parent sub-gap stays OPEN; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95136_SPECTRAL_CAP_AGGREGATION_THRESHOLD.promotesBound === false &&
      /NO QED/.test(IMP95136_SPECTRAL_CAP_AGGREGATION_THRESHOLD.rigorScope) &&
      /refereed bound is changed/i.test(IMP95136_SPECTRAL_CAP_AGGREGATION_THRESHOLD.rigorScope) &&
      /stays OPEN/.test(IMP95136_SPECTRAL_CAP_AGGREGATION_THRESHOLD.rigorScope) &&
      /remains OPEN/.test(IMP95136_SPECTRAL_CAP_AGGREGATION_THRESHOLD.openResiduals[0]) &&
      /stays OPEN, narrowed/.test(IMP95136_SPECTRAL_CAP_AGGREGATION_THRESHOLD.openResiduals[1]) &&
      IMP95136_SPECTRAL_CAP_AGGREGATION_THRESHOLD.subGaps.length === 1 &&
      IMP95136_SPECTRAL_CAP_AGGREGATION_THRESHOLD.openResiduals.length === 3 &&
      /parity-pure/.test(IMP95136_SPECTRAL_CAP_AGGREGATION_THRESHOLD.rigorScope),
  },
];

for (const a of IMP95136_SPECTRAL_CAP_AGGREGATION_THRESHOLD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95136-spectral-cap-aggregation-threshold assertion failed: ${a.id}`);
  }
}

export default IMP95136_SPECTRAL_CAP_AGGREGATION_THRESHOLD;
