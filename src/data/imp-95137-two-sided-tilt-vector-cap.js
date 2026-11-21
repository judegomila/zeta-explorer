/**
 * imp-95137 - THEOREM VC (two-sided tilt vector cap, certified rate
 * threshold 1/4): NARROWS imp-95136-subgap-cap-simultaneity, the leg the
 * imp-95136 slack diagnosis named: each entry of the cap matrix C(mu) is
 * individually attained (all cluster mass at ONE facing edge), but a
 * middle cluster cannot hug both of its edges at once. This module
 * proves exactly the requested joint two-sided constraint - a VECTOR CAP
 * tying rho(F_b, left neighbor) and rho(F_b, right neighbor) through the
 * mass split of F_b - and consumes it in the imp-95136 spectral frame:
 * certified sharp-threshold sandwich [0.23, 0.276] -> [0.23, 1/4 = 0.25]
 * (width 0.046 -> 0.02).
 *
 * THEOREM VC. Let W be any MAJ witness of the sibling-chain class
 * (nonnegative amplitudes, free positive rates, positions
 * u_i in [2^{b_i}, 2^{b_i + 1})) that is PARITY-PURE, with ANY number of
 * packets per block. If every rate satisfies mu_i >= 1/4, then E <= 0.
 * Contrapositive: every E > 0 parity-pure witness carries a rate
 * mu_min < 1/4. Supersedes THEOREM SA (69/250) at the constant level.
 *
 * PROOF CHAIN (all unconditional; Lemma QF, the sharp cluster cap,
 * Lemma GT, Lemma OG, Perron entrywise monotonicity, and interlacing
 * are carried from imp-95132/95134/95135/95136).
 *
 * NEW LEMMA TS (tilt simultaneity - the vector cap engine). Let B be a
 * cluster (nonnegative amplitudes a_i, rates m_i >= mu, positions in
 * [L, L + W]), and let psi_L, psi_R be the imp-95134 gap-capped tilts of
 * slope mu rising over the LEFT gap of length D_L (leftward from L,
 * capped at mu D_L) and the RIGHT gap of length D_R (rightward from
 * L + W). Write M_L = |B e^{psi_L}|^2 / |B|^2 and
 * M_R = |B e^{psi_R}|^2 / |B|^2. Then
 *
 *   (M_L - 1)/(mu D_L) + (M_R - 1)/(mu D_R)  <=  1 + exp(-2 mu W),
 *
 * SHARP: a single rate-mu packet at either edge attains equality
 * (verified exactly in this module: 1 + e^{-2} on both sides at
 * mu = 1/4, W = 4). Lemma GT gives each summand <= 1 separately; TS says
 * the two tilt excesses share a budget of 1 + exp(-2 mu W) < 2 - the
 * quantitative form of "cannot hug both edges at once".
 *
 * Proof (termwise over Gram pairs, then sum with nonnegative weights
 * a_i a_j). For a packet pair (rates a <= b, s = a + b, y = s - 2mu,
 * depths d_a, d_b in [0, W] from the LEFT edge, delta = |d_a - d_b|):
 * (1) EXACT excess identity (imp-95134 Lemma GT form): the left-tilt
 *     excess is X_L^{ij} = e^{-(a d_a + b d_b)} (2mu/(y s))(1 - e^{-y D_L})
 *     (limit (2mu/s) D_L at y = 0), and symmetrically for X_R^{ij} with
 *     depths measured from the RIGHT edge.
 * (2) (1 - e^{-yD})/(yD) <= 1 gives X_L^{ij}/(mu D_L) <= (2/s) e^{-p},
 *     X_R^{ij}/(mu D_R) <= (2/s) e^{-(sW - p)}, with p = a d_a + b d_b.
 * (3) EXACT kernel factorization: K(a, b, delta)
 *     = (2/s) e^{-a delta} [1 + (a/c)(1 - e^{-c delta})], c = b - a
 *     (limit 1 + a delta at c = 0). So the termwise claim reduces to
 *       e^{-p} + e^{-(sW - p)} <= (1 + e^{-2 mu W}) e^{-a delta} (1 + G),
 *     G = (a/c)(1 - e^{-c delta}).
 * (4) p -> e^{-p} + e^{-(sW - p)} is CONVEX, so its max over the
 *     admissible range [a delta, sW - a delta] is at an endpoint; both
 *     endpoints give e^{-a delta}(1 + e^{-sW + 2a delta}). Cancel
 *     e^{-a delta}; with sW - 2a delta = s(W - delta) + c delta and
 *     s >= 2mu it remains to show
 *       e^{-2 mu W}(e^{beta delta} - 1) <= (1 + e^{-2 mu W}) G,
 *     beta = 2mu - c. If beta <= 0 the left side is <= 0. Else use
 *     G >= a delta e^{-c delta} >= mu delta e^{-c delta} (from
 *     1 - e^{-z} >= z e^{-z}), multiply through by e^{c delta}, and use
 *     e^{2 mu delta} - e^{c delta} <= e^{2 mu delta} - 1; the claim
 *     becomes psi(delta) := (1 + E) mu delta - E (e^{2 mu delta} - 1) >= 0
 *     on [0, W], E = e^{-2 mu W}. psi is CONCAVE, psi(0) = 0, and
 *     psi(W) = (1 + E) mu W - (1 - E) >= 0 is exactly
 *     tanh(mu W) <= mu W. Concavity + nonnegative endpoints finish. QED
 *
 * PAIR EXTRACTION (carried, imp-95134). For a left neighbor A (positions
 * <= L - D_L): <A, B> = e^{-mu D_L} <A e^{phi}, B e^{psi_L}> exactly
 * (gap-capped tilt cancellation), Cauchy-Schwarz + Lemma GT on A give
 *   rho(A, B) <= e^{-mu D_L} sqrt(1 + mu D_L) sqrt(M_L),
 * and symmetrically on the right. So with q_L = (M_L - 1)/(mu D_L),
 * q_R = (M_R - 1)/(mu D_R) (each in [0, 1] by Lemma GT):
 *   rho_L <= chat(mu D_L) sqrt(1 + mu D_L q_L),
 *   rho_R <= chat(mu D_R) sqrt(1 + mu D_R q_R),
 *   q_L + q_R <= 1 + exp(-2 mu W),      chat(z) = e^{-z} sqrt(1 + z).
 * This is the VECTOR CAP: the entrywise cap corner (q_L = q_R = 1) is
 * excluded whenever exp(-2 mu W) < 1.
 *
 * SPECTRAL CONSUMPTION (imp-95136 frame). Lemma QF: E > 0 over a fixed
 * cluster geometry iff lamMax(R) > 1. For the head blocks {0, 2, 4, 6}
 * (indices 0..3; gaps D in {2, 8, 14, 32, 56, 62}) parametrize by
 * alpha = q_L of cluster 1 toward block 0 (gap 2) and gamma = q_R of
 * cluster 2 toward block 6 (gap 32). Every straddling TS instance
 * (left j < b < right k) bounds the OTHER side of the same cluster:
 *   C01 = chat(mu 2) sqrt(1 + 2 mu alpha)
 *   C12 = chat(mu 8) sqrt(1 + 8 mu min(1, 1 + e_1 - alpha, 1 + e_2 - gamma))
 *   C13 = chat(mu 56) sqrt(1 + 56 mu min(1, 1 + e_1 - alpha))
 *   C02 = chat(mu 14) sqrt(1 + 14 mu min(1, 1 + e_2 - gamma))
 *   C23 = chat(mu 32) sqrt(1 + 32 mu gamma)
 *   C03 = (1 + 62 mu) e^{-62 mu}   (end clusters: no straddle)
 * with e_1 = e^{-2 mu 4} (block-2 width 4), e_2 = e^{-2 mu 16}
 * (block-4 width 16). COVERAGE: for any parity-pure witness, set
 * alpha/gamma to the actual tilt ratios; every occupied-subset matrix is
 * entrywise dominated by a principal submatrix of this family at a
 * corner parameter value (unoccupied straddle partners only delete
 * constraints that the alpha = 1 or gamma = 0 corners already relax),
 * and principal-submatrix interlacing + Perron entrywise monotonicity
 * give lamMax(R) <= max over (alpha, gamma) in [0,1]^2 of lamMax(C).
 * ODD PARITY: odd gaps AND odd widths are exactly twice the
 * index-matched even ones (Lemma OG), the constraint budget only
 * tightens (e^{-2 mu 2W} <= e^{-2 mu W}), and the parametrized entries
 * dominate: chat(2z) sqrt(1 + 2zq) <= chat(z) sqrt(1 + zq) follows from
 * e^{-2z}(1 + 2z) <= 1 and 1 + 2zq <= (1 + z)(1 + zq) for q <= 1 - so
 * even parity binds (asserted on a grid below). TAIL (Lemma HT shape,
 * re-derived at mu = 1/4): every remainder row sum is
 * <= 6 g(32) <= 198 U50^{64} = 2.5075e-12 (down-gaps >= 2^{2k-1},
 * up-entries a geometric sum dominated by twice the first via
 * g(4z)/g(z) <= 4 e^{-3z}), and lamMax is subadditive.
 *
 * GRID CERTIFICATE (mu = 1/4; entries library-free through the single
 * alternating-series constant U50 = 0.6065306597136333 >= exp(-1/2),
 * N = 20 even truncation + 1e-12 float slack, sibling convention; all
 * head exponents are integer powers U50^{D/2}, D/2 in {1,4,7,16,28,31};
 * Math.sqrt is IEEE correctly rounded and gets an explicit (1 + 1e-12)
 * factor; e_1 <= U50^4 and e_2 <= U50^{16} - upper bounds WEAKEN the
 * constraint, conservative). Partition [0,1]^2 into 200 x 200 cells; on
 * each cell take the ENTRYWISE MAXIMAL matrix (each entry is monotone in
 * alpha and gamma separately, so per-entry corner evaluation dominates
 * every matrix in the cell; no Lipschitz constant needed - Perron
 * entrywise monotonicity does the covering). Bound lamMax of each cell
 * matrix by COLLATZ-WIELANDT: for ANY positive z,
 * lamMax <= max_i (Cz)_i / z_i - valid for arbitrary z, so the float
 * power iteration that picks z needs no certification; an explicit
 * (1 + 1e-9) factor absorbs all rounding. Result: grid max
 * 0.9961553068006018, plus remainder 2.5075e-12, total < 1 with margin
 * 3.8e-3. Hence lamMax(R) < 1 for every parity-pure witness with rates
 * >= 1/4, and E <= 0 by Lemma QF. QED (theorem, not the leg).
 *
 * MEASURED COLOR (float, not certified). The vector-cap root
 * max_{alpha, gamma} lamMax = 1 sits at mu = 0.24511772303392365
 * (offline bisection, 60-grid); certified bracket asserted below:
 * maxLam(0.245) = 1.0002233714956483 > 1 > 0.9983331282761292
 * = maxLam(0.246). The binding cell is the corner (alpha, gamma) =
 * (1, 0): cluster-1 mass at its LEFT edge - the dominant (0,2) bond at
 * full cap - with clusters 2/3 coupled through the relaxed C12/C02.
 *
 * SLACK DIAGNOSIS (what survives). The surviving float interval
 * [0.2321 (imp-95135 witness saturation), 0.2451 (vector-cap root)] is
 * DEPTH-RESOLVED SIMULTANEITY: the zero-depth tilt sees WHERE the
 * cluster mass sits only through the single budget 1 + e^{-2 mu W}; at
 * the binding corner (alpha = 1) the bound charges C12 the full
 * chat sqrt(1 + 8 mu e_1) although the true correlation of a left-edge
 * cluster with block 4 is ~ g(mu(8 + 4)), exponentially smaller. NEW
 * named leg imp-95137-subgap-probe-depth-simultaneity: extend the tilt
 * INTO the block by a probe depth t (rise mu(D + t)) - the probe bound
 * rho <= e^{-mu(D+t)} sqrt(1 + mu(D+t)) sqrt(M(t)) is sharp for a
 * packet at depth t - and prove the joint (M_L(t), M_R(s)) constraint,
 * closing toward the witness saturation 0.2321.
 *
 * WHAT THIS NARROWS AND WHAT IT DOES NOT.
 * (1) imp-95136-subgap-cap-simultaneity NARROWED: the requested joint
 *     two-sided vector cap is PROVED (Lemma TS, sharp) and consumed;
 *     sandwich [0.23, 0.276] -> [0.23, 0.25]. The leg stays OPEN with
 *     the surviving slack renamed to probe-depth simultaneity.
 * (2) THEOREM SA (69/250) superseded at the constant level on the full
 *     parity-pure class. THEOREM WE (23/100 witness) untouched and
 *     consistent (23/100 < 1/4; the witness has E(1/4) < 0).
 * (3) imp-95131-subgap-rate-to-phi-pricing further upgraded: forced
 *     mu_min < 1/4 over the full parity-pure class (was < 69/250).
 * (4) Parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN.
 *
 * HONEST LIMITS. (a) Model-family constants, not the paper Section 4.5
 * packets. (b) 1/4 is the certified constant, not the sharp class
 * threshold (sandwich [0.23, 0.25]; float landmarks 0.2321 and 0.2451
 * measured only). (c) Parity-pure only. (d) Changes no bound; does NOT
 * promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) The termwise TS inequality was
 * approached on 60000 seeded pairs (rates to 21x the floor, edge-biased
 * depths, W to 20.5, gaps to 15.2): worst ratio 0.8787384631400347,
 * zero violations. (2) The cluster-level Lemma TS and the pair
 * extraction were stress-tested on 8000 seeded clusters (to 5 packets, rates
 * to 30x, lo/hi/split/none bias cycle) with left-neighbor draws: worst
 * TS ratio 0.9793850084403858, worst pair ratio 0.979072741981957, zero
 * violations; the single-edge-packet equality case reproduces
 * 1 + e^{-2} EXACTLY (rel err 0 in floats). (3) End-to-end reduction
 * attack: 1500 full-head witnesses in BOTH parities (odd draws exercise
 * the doubled gaps/widths directly), actual tilt ratios computed from
 * the exact excess identity: zero entry-bound violations, zero straddle
 * violations, zero q-range violations; max attained alpha
 * 0.9454907524404704, max gamma 0.6882989029168624 (the corner is
 * approached, confirming the parametrization is not vacuous). (4) The
 * theorem battery probes THEOREM VC directly: 6000 seeded parity-pure
 * multi-packet witnesses at rates >= 1/4: max E = -0.03544721343090412,
 * zero E > 0 draws. (5) An early one-sided route (bounding
 * M_L + M_R <= 2 + mu max(D_L, D_R) without the kernel enhancement) was
 * REFUTED in-derivation: it cannot exclude the rectangle corner at
 * delta near W; the kernel factor (1 + G) in step (3) is what makes the
 * tanh endpoint close. (6) Consistency: the certified entries dominate
 * the float entries at all six head pairs; the parametrized caps at
 * q <= 1 never exceed the imp-95136 plain caps; THEOREM WE keeps
 * E(23/100) > 0 > E(1/4). (7) Scope honesty: parity-pure, model family,
 * constant not sharp, leg and parent stay OPEN, nothing promoted.
 *
 * Import-light (no heavy bundle, no imports). The numerics cross-check
 * the theorem; the theorem is the displayed lemma chain.
 */

// exact sibling Gram kernel (identical to imp-95130..95136)
function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-9 * (a + b)) {
    const m = 0.5 * (a + b);
    return (Math.exp(-m * tau) * (1 + m * tau)) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// exact per-pair gap-capped tilt excess (imp-95134 Lemma GT identity):
// depths d_i, d_j >= 0 from the tilted edge, tilt slope mu, gap D
function excessPair(mi, mj, di, dj, mu, D) {
  const s = mi + mj;
  const y = s - 2 * mu;
  const h = Math.exp(-(mi * di + mj * dj));
  const f = y < 1e-12 * s ? D : (1 - Math.exp(-y * D)) / y;
  return h * ((2 * mu) / s) * f;
}

// truncated alternating exponential series: N even => upper bound of
// exp(-z) for 0 <= z < N + 2 (sibling convention)
function expTrunc(z, N) {
  let s = 1;
  let t = 1;
  for (let n = 1; n <= N; n++) {
    t = (t * -z) / n;
    s += t;
  }
  return s;
}

const MU_VC = 1 / 4; // certified threshold
const U50 = expTrunc(0.5, 20) + 1e-12; // >= exp(-1/2), float slack explicit

// ---- certified head grid certificate at mu = 1/4 ----
const SQ = (x) => Math.sqrt(x) * (1 + 1e-12);
// certified upper bound of chat(mu D) sqrt(1 + mu D q), q clamped to [0,1]
function entryCert(D, q) {
  const qq = Math.min(1, Math.max(0, q));
  return SQ(1 + MU_VC * D) * SQ(1 + MU_VC * D * qq) * Math.pow(U50, D / 2);
}
const E1_CERT = Math.pow(U50, 4); // >= e^{-2}: upper bound weakens the constraint (safe)
const E2_CERT = Math.pow(U50, 16); // >= e^{-8}
const C03_CERT = (1 + MU_VC * 62) * Math.pow(U50, 31); // >= g(15.5)

// entrywise maximal certified matrix over the cell [a0,a1] x [g0,g1]
function headCellMax(a0, a1, g0, g1) {
  const C = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  const set = (i, j, v) => {
    C[i][j] = v;
    C[j][i] = v;
  };
  set(0, 1, entryCert(2, a1)); // increasing in alpha
  set(1, 2, Math.min(entryCert(8, 1 + E1_CERT - a0), entryCert(8, 1 + E2_CERT - g0))); // decreasing in both
  set(1, 3, entryCert(56, 1 + E1_CERT - a0)); // decreasing in alpha
  set(0, 2, entryCert(14, 1 + E2_CERT - g0)); // decreasing in gamma
  set(2, 3, entryCert(32, g1)); // increasing in gamma
  set(0, 3, C03_CERT);
  return C;
}

// Collatz-Wielandt upper bound: lamMax <= max_i (Cz)_i/z_i for ANY z > 0
function cwBound(C) {
  let z = [1, 1, 1, 1];
  for (let it = 0; it < 40; it++) {
    const w = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) w[i] += C[i][j] * z[j];
    }
    const m = Math.max(...w);
    z = w.map((x) => x / m + 1e-300);
  }
  const w = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) w[i] += C[i][j] * z[j];
  }
  let r = 0;
  for (let i = 0; i < 4; i++) r = Math.max(r, w[i] / z[i]);
  return r * (1 + 1e-9);
}

function runGridCertificate() {
  const N = 200;
  let maxR = -Infinity;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const r = cwBound(headCellMax(i / N, (i + 1) / N, j / N, (j + 1) / N));
      if (r > maxR) maxR = r;
    }
  }
  return maxR;
}

// ---- float (measured-only) parametrized head matrix ----
const g = (z) => Math.exp(-z) * (1 + z);
const chat = (z) => Math.exp(-z) * Math.sqrt(1 + z);
function headFloat(mu, al, ga) {
  const e1 = Math.exp(-8 * mu);
  const e2 = Math.exp(-32 * mu);
  const q = (D, val) => chat(mu * D) * Math.sqrt(1 + mu * D * Math.min(1, Math.max(0, val)));
  const C = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  const set = (i, j, v) => {
    C[i][j] = v;
    C[j][i] = v;
  };
  set(0, 1, q(2, al));
  set(1, 2, Math.min(q(8, 1 + e1 - al), q(8, 1 + e2 - ga)));
  set(1, 3, q(56, 1 + e1 - al));
  set(0, 2, q(14, 1 + e2 - ga));
  set(2, 3, q(32, ga));
  set(0, 3, g(mu * 62));
  return C;
}
function lamMax4(C, iters) {
  let v = [0.5, 0.5, 0.5, 0.5];
  let lam = 0;
  for (let it = 0; it < iters; it++) {
    const w = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) w[i] += C[i][j] * v[j];
    }
    const nn = Math.sqrt(w.reduce((s, x) => s + x * x, 0));
    if (nn === 0) return 0;
    lam = nn;
    v = w.map((x) => x / nn);
  }
  return lam;
}
function maxLamFloat(mu, grid) {
  let best = -Infinity;
  for (let i = 0; i <= grid; i++) {
    for (let j = 0; j <= grid; j++) {
      best = Math.max(best, lamMax4(headFloat(mu, i / grid, j / grid), 300));
    }
  }
  return best;
}

// ---- seeded batteries (deterministic LCG, per-battery reseed) ----
let seedState = 0;
function rnd() {
  seedState = (seedState * 1103515245 + 12345) & 0x7fffffff;
  return seedState / 0x7fffffff;
}
function mkClusterAt(lo, hi, mu, rateMax, nMax, bias) {
  const n = 1 + Math.floor(rnd() * nMax);
  const us = [];
  const as = [];
  const ms = [];
  for (let i = 0; i < n; i++) {
    let frac = rnd();
    if (bias === "lo") frac = rnd() * rnd() * rnd();
    if (bias === "hi") frac = 1 - rnd() * rnd() * rnd();
    if (bias === "split") frac = rnd() < 0.5 ? rnd() * rnd() * rnd() : 1 - rnd() * rnd() * rnd();
    us.push(lo + frac * (hi - lo));
    as.push(rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd()));
    ms.push(mu * Math.pow(rateMax, rnd() * rnd()));
  }
  return { us, as, ms };
}
function gram(c1, c2) {
  let s = 0;
  for (let i = 0; i < c1.us.length; i++) {
    for (let j = 0; j < c2.us.length; j++) {
      s += c1.as[i] * c2.as[j] * kernelK(c1.ms[i], c2.ms[j], Math.abs(c1.us[i] - c2.us[j]));
    }
  }
  return s;
}
function tiltExcess(c, edge, side, mu, D) {
  let s = 0;
  for (let i = 0; i < c.us.length; i++) {
    for (let j = 0; j < c.us.length; j++) {
      const di = side === "L" ? c.us[i] - edge : edge - c.us[i];
      const dj = side === "L" ? c.us[j] - edge : edge - c.us[j];
      s += c.as[i] * c.as[j] * excessPair(c.ms[i], c.ms[j], di, dj, mu, D);
    }
  }
  return s;
}

// battery T (seed 246810): termwise joint inequality approach
function runTermwiseBattery() {
  seedState = 246810;
  let worst = -Infinity;
  let viol = 0;
  for (let t = 0; t < 60000; t++) {
    const mu = 0.05 + rnd() * 0.6;
    const W = 0.5 + rnd() * 20;
    const DL = 0.2 + rnd() * 15;
    const DR = 0.2 + rnd() * 15;
    const mi = mu * (1 + rnd() * rnd() * 20);
    const mj = mu * (1 + rnd() * rnd() * 20);
    const di = rnd() < 0.4 ? rnd() * rnd() * rnd() * W : rnd() * W;
    const dj =
      rnd() < 0.4 ? (rnd() < 0.5 ? rnd() * rnd() * rnd() * W : W * (1 - rnd() * rnd() * rnd())) : rnd() * W;
    const Kij = kernelK(mi, mj, Math.abs(di - dj));
    const lhs =
      excessPair(mi, mj, di, dj, mu, DL) / (mu * DL * Kij) +
      excessPair(mi, mj, W - di, W - dj, mu, DR) / (mu * DR * Kij);
    const r = lhs / (1 + Math.exp(-2 * mu * W));
    if (r > worst) worst = r;
    if (r > 1 + 1e-9) viol++;
  }
  return { worst, viol };
}

// battery C (seed 135791): cluster-level Lemma TS + pair-extraction approach
function runClusterBattery() {
  seedState = 135791;
  let worstTS = -Infinity;
  let violTS = 0;
  let worstPB = -Infinity;
  let violPB = 0;
  for (let t = 0; t < 8000; t++) {
    const mu = 0.05 + rnd() * 0.6;
    const W = 0.5 + rnd() * 16;
    const DL = 0.2 + rnd() * 12;
    const DR = 0.2 + rnd() * 12;
    const bias = ["lo", "hi", "split", "none"][t % 4];
    const B = mkClusterAt(0, W, mu, 30, 5, bias);
    const nB = gram(B, B);
    if (nB < 1e-280) continue;
    const XL = tiltExcess(B, 0, "L", mu, DL);
    const XR = tiltExcess(B, W, "R", mu, DR);
    const r = (XL / (mu * DL * nB) + XR / (mu * DR * nB)) / (1 + Math.exp(-2 * mu * W));
    if (r > worstTS) worstTS = r;
    if (r > 1 + 1e-9) violTS++;
    const WA = 0.5 + rnd() * 8;
    const A = mkClusterAt(-DL - WA, -DL, mu, 30, 4, rnd() < 0.5 ? "hi" : "none");
    const nA = gram(A, A);
    if (nA < 1e-280) continue;
    const rho = gram(A, B) / Math.sqrt(nA * nB);
    const bound = Math.exp(-mu * DL) * Math.sqrt(1 + mu * DL) * Math.sqrt(1 + XL / nB);
    const rp = rho / bound;
    if (rp > worstPB) worstPB = rp;
    if (rp > 1 + 1e-9) violPB++;
  }
  return { worstTS, violTS, worstPB, violPB };
}

// battery R (seed 424243): end-to-end head reduction approach, BOTH parities
function runReductionBattery() {
  seedState = 424243;
  const D = [
    [0, 2, 14, 62],
    [2, 0, 8, 56],
    [14, 8, 0, 32],
    [62, 56, 32, 0],
  ];
  let violEntry = 0;
  let violStraddle = 0;
  let violRange = 0;
  let maxAlpha = -Infinity;
  let maxGamma = -Infinity;
  let count = 0;
  for (let t = 0; t < 1500; t++) {
    const parity = t % 2;
    const bs = [0, 2, 4, 6].map((b) => b + parity);
    const scale = parity === 1 ? 2 : 1; // odd parity doubles gaps and widths (Lemma OG)
    const clusters = bs.map((b, idx) =>
      mkClusterAt(2 ** b, 2 ** (b + 1), MU_VC, 100, 4, ["lo", "hi", "split", "none"][(t + idx) % 4]),
    );
    const norms = clusters.map((c) => gram(c, c));
    if (norms.some((n) => n < 1e-280)) continue;
    const rho = (i, j) => gram(clusters[i], clusters[j]) / Math.sqrt(norms[i] * norms[j]);
    const edgeL = (idx) => 2 ** bs[idx];
    const edgeR = (idx) => 2 ** (bs[idx] + 1);
    const q = (idx, side, Dgap) => {
      const X = tiltExcess(clusters[idx], side === "L" ? edgeL(idx) : edgeR(idx), side, MU_VC, Dgap);
      return X / (MU_VC * Dgap * norms[idx]);
    };
    const e1 = Math.exp(-2 * MU_VC * (edgeR(1) - edgeL(1)));
    const e2 = Math.exp(-2 * MU_VC * (edgeR(2) - edgeL(2)));
    const alpha = q(1, "L", D[0][1] * scale);
    const qR12 = q(1, "R", D[1][2] * scale);
    const qR13 = q(1, "R", D[1][3] * scale);
    const qL02 = q(2, "L", D[0][2] * scale);
    const qL12 = q(2, "L", D[1][2] * scale);
    const gamma = q(2, "R", D[2][3] * scale);
    for (const v of [alpha, qR12, qR13, qL02, qL12, gamma]) {
      if (v < -1e-12 || v > 1 + 1e-9) violRange++;
    }
    if (alpha + qR12 > 1 + e1 + 1e-9) violStraddle++;
    if (alpha + qR13 > 1 + e1 + 1e-9) violStraddle++;
    if (qL02 + gamma > 1 + e2 + 1e-9) violStraddle++;
    if (qL12 + gamma > 1 + e2 + 1e-9) violStraddle++;
    const ent = (Dg, qq) => chat(MU_VC * Dg) * Math.sqrt(1 + MU_VC * Dg * qq);
    if (rho(0, 1) > ent(D[0][1] * scale, alpha) * (1 + 1e-9)) violEntry++;
    if (rho(1, 2) > Math.min(ent(D[1][2] * scale, qR12), ent(D[1][2] * scale, qL12)) * (1 + 1e-9)) violEntry++;
    if (rho(1, 3) > ent(D[1][3] * scale, qR13) * (1 + 1e-9)) violEntry++;
    if (rho(0, 2) > ent(D[0][2] * scale, qL02) * (1 + 1e-9)) violEntry++;
    if (rho(2, 3) > ent(D[2][3] * scale, gamma) * (1 + 1e-9)) violEntry++;
    if (alpha > maxAlpha) maxAlpha = alpha;
    if (gamma > maxGamma) maxGamma = gamma;
    count++;
  }
  return { violEntry, violStraddle, violRange, maxAlpha, maxGamma, count };
}

// battery W (seed 555777): THEOREM VC direct approach at rates >= 1/4
function runTheoremBattery() {
  seedState = 555777;
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
    const clusters = bs.map((b) => {
      const m = 1 + Math.floor(rnd() * 5);
      const us = [];
      const as = [];
      const mus = [];
      const lo = 2 ** b;
      const hi = 2 ** (b + 1);
      const edge = t % 3 === 0;
      const at = rnd() < 0.5 ? "hi" : "lo";
      for (let i = 0; i < m; i++) {
        const frac = edge ? rnd() * rnd() * rnd() : rnd();
        us.push(at === "hi" ? hi - frac * (hi - lo) : lo + frac * (hi - lo));
        as.push(rnd() < 0.1 ? 0 : Math.pow(10, -2 + 4 * rnd()));
        mus.push(MU_VC * Math.pow(100, rnd() * rnd()));
      }
      return { us, as, ms: mus };
    });
    const norms = clusters.map((c) => gram(c, c));
    let E = -norms.reduce((x, y) => x + y, 0);
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) E += 2 * gram(clusters[i], clusters[j]);
    }
    if (E > maxE) maxE = E;
    if (E > 0) viol++;
  }
  return { maxE, viol };
}

// THEOREM WE witness (positions/amplitudes exactly as in imp-95135/95136)
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

const GRID_MAX = runGridCertificate();
const REMAINDER = 6 * (1 + 32) * Math.pow(U50, 64);
const BAT_T = runTermwiseBattery();
const BAT_C = runClusterBattery();
const BAT_R = runReductionBattery();
const BAT_W = runTheoremBattery();

// baked literals (recomputed by the assertions)
const U50_LIT = 0.6065306597136333;
const GRID_MAX_LIT = 0.9961553068006018;
const REMAINDER_LIT = 2.507504778985199e-12;
const LAM_0245_LIT = 1.0002233714956483;
const LAM_0246_LIT = 0.9983331282761292;
const BAT_T_WORST_LIT = 0.8787384631400347;
const BAT_C_WORST_TS_LIT = 0.9793850084403858;
const BAT_C_WORST_PB_LIT = 0.979072741981957;
const BAT_R_MAX_ALPHA_LIT = 0.9454907524404704;
const BAT_R_MAX_GAMMA_LIT = 0.6882989029168624;
const BAT_R_COUNT_LIT = 1385;
const BAT_W_MAX_E_LIT = -0.03544721343090412;
const E_WE_23_LIT = 17796.715801475395;
const E_WE_VC_LIT = -135059.37605989102;

export const IMP95137_TWO_SIDED_TILT_VECTOR_CAP = {
  ticket:
    "imp-95137 (THEOREM VC: two-sided tilt vector cap, certified rate threshold 1/4 over the FULL parity-pure MAJ witness class - E > 0 forces mu_min < 1/4 = 0.25; NARROWS imp-95136-subgap-cap-simultaneity by PROVING the requested joint two-sided vector cap (Lemma TS, sharp) and consuming it in the imp-95136 spectral frame: certified sandwich [0.23, 0.276] -> [0.23, 0.25])",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; consumes the imp-95132 Lemma L2 cluster geometry, the imp-95134 gap-capped tilt + sharp cluster cap + Lemma GT, and the imp-95136 Lemma QF spectral frame with Lemma OG parity reduction and Lemma HT head/tail split; directly progresses imp-95130-subgap-phi-conditional-odd-mass.",
  theoremVC:
    "Any parity-pure MAJ witness of the sibling-chain class with ANY number of packets per block and all rates mu_i >= 1/4 has E <= 0. Contrapositive: E > 0 forces mu_min < 1/4 (supersedes THEOREM SA 69/250 at the constant level). Proof chain: NEW Lemma TS (tilt simultaneity: (M_L - 1)/(mu D_L) + (M_R - 1)/(mu D_R) <= 1 + exp(-2 mu W), sharp at an edge packet) + pair extraction rho <= chat(mu D) sqrt(1 + mu D q) + Lemma QF spectral frame + two-parameter (alpha, gamma) head family with coverage over all occupied subsets and both parities + 200x200 entrywise-max cell grid with Collatz-Wielandt bounds: grid max 0.9961553068006018 + remainder 198 U50^64 = 2.5075e-12 < 1, margin 3.8e-3.",
  lemmaTS:
    "For any cluster B (rates >= mu, positions in [L, L+W]) with gap-capped tilts psi_L (gap D_L, leftward) and psi_R (gap D_R, rightward): the two tilted-norm excesses share a budget, (M_L - 1)/(mu D_L) + (M_R - 1)/(mu D_R) <= 1 + exp(-2 mu W), while Lemma GT caps each summand at 1 separately. SHARP: a single rate-mu packet at either edge attains equality (this module reproduces 1 + e^{-2} exactly). Proof: termwise over Gram pairs via the exact Lemma GT excess identity, the exact kernel factorization K = (2/s) e^{-a delta}(1 + (a/c)(1 - e^{-c delta})), convexity of p -> e^{-p} + e^{-(sW-p)} (edge configurations extremal), and the concave endpoint inequality tanh(mu W) <= mu W.",
  vectorCap:
    "With q_L = (M_L - 1)/(mu D_L) and q_R = (M_R - 1)/(mu D_R): rho_L <= chat(mu D_L) sqrt(1 + mu D_L q_L), rho_R <= chat(mu D_R) sqrt(1 + mu D_R q_R), q_L, q_R in [0, 1], q_L + q_R <= 1 + exp(-2 mu W). The entrywise cap corner q_L = q_R = 1 (both neighbors simultaneously at the sharp imp-95134 cap) is excluded whenever exp(-2 mu W) < 1 - exactly the cap-simultaneity constraint the imp-95136 leg requested.",
  gridCertificate:
    "Head blocks {0,2,4,6} parametrized by alpha (cluster-1 left tilt ratio toward block 0) and gamma (cluster-2 right tilt ratio toward block 6); every straddling Lemma TS instance relaxes the other side of the same cluster. Certified entries through U50 = 0.6065306597136333 >= exp(-1/2) (integer powers U50^{D/2}), e_1 <= U50^4, e_2 <= U50^16 (upper bounds weaken constraints - conservative), IEEE sqrt with explicit (1+1e-12) slack. 200x200 cells, per-cell ENTRYWISE MAXIMAL matrix (per-entry monotonicity), Collatz-Wielandt bound (valid for ANY positive test vector, so the float power iteration needs no certification) with explicit (1+1e-9) slack: grid max 0.9961553068006018; remainder rows <= 198 U50^64 = 2.507504778985199e-12; total < 1.",
  thresholdSandwich:
    "Certified sharp-threshold sandwich for the full parity-pure class: [23/100, 1/4] = [0.23, 0.25] (was [0.23, 0.276]). Float landmarks (measured, NOT certified): witness chain saturation 0.2321 (imp-95135) and vector-cap root 0.24511772303392365 (offline bisection; certified bracket maxLam(0.245) = 1.0002233714956483 > 1 > 0.9983331282761292 = maxLam(0.246)).",
  slackDiagnosis:
    "The zero-depth vector cap is consumed; the surviving float interval [0.2321, 0.2451] is DEPTH-RESOLVED SIMULTANEITY: at the binding corner (alpha, gamma) = (1, 0) the bound charges C12 the full chat(2) sqrt(1 + 2 mu e_1) although the true correlation of a left-edge block-2 cluster with block 4 is ~ g(mu(8+4)), exponentially smaller - the zero-depth tilt sees the mass split only through the single budget 1 + exp(-2 mu W).",
  subGaps: [
    "imp-95137-subgap-probe-depth-simultaneity - OPEN: extend the gap tilt INTO the block by a probe depth t (rise mu(D+t); the probe bound rho <= exp(-mu(D+t)) sqrt(1+mu(D+t)) sqrt(M(t)) is sharp for a packet at depth t) and prove the joint (M_L(t), M_R(s)) constraint, closing [0.23, 0.25] toward the witness saturation 0.2321.",
  ],
  openResiduals: [
    "imp-95130-subgap-phi-conditional-odd-mass remains OPEN: this module sharpens the forced-rate constant to mu_min < 1/4; the phi-conditional odd-mass bound itself is not established",
    "imp-95136-subgap-cap-simultaneity stays OPEN, narrowed to [0.23, 0.25] with the surviving slack renamed probe-depth simultaneity (imp-95137-subgap-probe-depth-simultaneity)",
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
  ],
  isRigorous: true,
  rigorScope:
    "THEOREM VC is unconditional given the sibling-chain witness conventions: Lemma TS is proved termwise from the exact imp-95134 excess identity plus three elementary steps (the kernel factorization is exact algebra, the p-convexity endpoint evaluation is exact, and the closing inequality is concavity with the tanh(mu W) <= mu W endpoint), the pair extraction is the carried imp-95134 gap-capped-tilt Cauchy-Schwarz, the spectral frame and parity/tail reductions are carried from imp-95136 (with the odd-parity entry domination re-proved for parametrized entries: e^{-2z}(1+2z) <= 1 and 1 + 2zq <= (1+z)(1+zq) for q <= 1), and the head certificate is a 200x200 entrywise-max cell grid bounded by Collatz-Wielandt through the single alternating-series constant U50 >= exp(-1/2) with explicit float slacks. The batteries and grids are CROSS-CHECKS; the theorem is the displayed lemma chain. Scope: parity-pure, model-family constants; the certified constant 1/4 is not the sharp threshold (sandwich [0.23, 0.25]; float landmarks 0.2321 and 0.2451 measured only); the cap-simultaneity leg stays OPEN under the probe-depth residual; parent imp-95130-subgap-phi-conditional-odd-mass stays OPEN; floors and ceilings untouched; changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
  promotesBound: false,
};

export const IMP95137_TWO_SIDED_TILT_VECTOR_CAP_ASSERTIONS = [
  {
    id: "imp95137-vc-series-and-grid-certificate",
    description:
      "U50 = 0.6065306597136333 dominates exp(-1/2), and the 200x200 entrywise-max cell grid of the certified (alpha, gamma) head family has Collatz-Wielandt max 0.9961553068006018; adding the remainder 198 U50^64 = 2.507504778985199e-12 keeps the total < 1 (margin 3.8e-3), which is THEOREM VC at mu = 1/4",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(U50, U50_LIT, 1e-15) &&
        U50 >= Math.exp(-0.5) &&
        rel(GRID_MAX, GRID_MAX_LIT, 1e-12) &&
        rel(REMAINDER, REMAINDER_LIT, 1e-12) &&
        GRID_MAX + REMAINDER < 1
      );
    },
  },
  {
    id: "imp95137-vc-certified-entry-domination",
    description:
      "the certified entries dominate the exact float caps at all six head pairs across the q range (the U50^{D/2} powers and sqrt slacks are genuine upper bounds), and the parametrized caps at q <= 1 never exceed the imp-95136 plain caps (1 + mu D) exp(-mu D)",
    holds: () => {
      for (const D of [2, 8, 14, 32, 56, 62]) {
        for (let k = 0; k <= 10; k++) {
          const q = k / 10;
          const exact = chat(MU_VC * D) * Math.sqrt(1 + MU_VC * D * q);
          if (entryCert(D, q) < exact) return false;
          if (exact > g(MU_VC * D) * (1 + 1e-12)) return false;
        }
      }
      return C03_CERT >= g(MU_VC * 62) && E1_CERT >= Math.exp(-2) && E2_CERT >= Math.exp(-8);
    },
  },
  {
    id: "imp95137-vc-edge-attainment",
    description:
      "Lemma TS is SHARP: a single rate-mu packet at the left edge (mu = 1/4, W = 4, D_L = 2, D_R = 8) attains the budget exactly - the two normalized excesses sum to 1 + e^{-2} with zero float error via the exact excess identity",
    holds: () => {
      const B = { us: [0], as: [1], ms: [MU_VC] };
      const nB = gram(B, B);
      const lhs =
        tiltExcess(B, 0, "L", MU_VC, 2) / (MU_VC * 2 * nB) + tiltExcess(B, 4, "R", MU_VC, 8) / (MU_VC * 8 * nB);
      return Math.abs(lhs - (1 + Math.exp(-2))) <= 1e-12 * (1 + Math.exp(-2));
    },
  },
  {
    id: "imp95137-vc-termwise-battery",
    description:
      "the termwise Lemma TS inequality approached on 60000 seeded Gram pairs (rates to 21x the floor, edge-biased depths): worst ratio 0.8787384631400347 < 1, zero violations",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return BAT_T.viol === 0 && BAT_T.worst < 1 && rel(BAT_T.worst, BAT_T_WORST_LIT, 1e-6);
    },
  },
  {
    id: "imp95137-vc-cluster-battery",
    description:
      "cluster-level Lemma TS and the pair extraction approached on 8000 seeded clusters (to 5 packets, rates to 30x, lo/hi/split/none bias cycle) with left-neighbor draws: worst TS ratio 0.9793850084403858, worst pair ratio 0.979072741981957, zero violations of either",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT_C.violTS === 0 &&
        BAT_C.violPB === 0 &&
        rel(BAT_C.worstTS, BAT_C_WORST_TS_LIT, 1e-6) &&
        rel(BAT_C.worstPB, BAT_C_WORST_PB_LIT, 1e-6)
      );
    },
  },
  {
    id: "imp95137-vc-reduction-battery",
    description:
      "end-to-end head reduction approached on 1500 full-head witnesses in BOTH parities (odd draws exercise the doubled gaps/widths; 1385 evaluable): zero entry-bound violations, zero straddle violations, zero q-range violations; max attained alpha 0.9454907524404704 and gamma 0.6882989029168624 show the parametrization is approached, not vacuous",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        BAT_R.violEntry === 0 &&
        BAT_R.violStraddle === 0 &&
        BAT_R.violRange === 0 &&
        BAT_R.count === BAT_R_COUNT_LIT &&
        rel(BAT_R.maxAlpha, BAT_R_MAX_ALPHA_LIT, 1e-6) &&
        rel(BAT_R.maxGamma, BAT_R_MAX_GAMMA_LIT, 1e-6)
      );
    },
  },
  {
    id: "imp95137-vc-theorem-battery",
    description:
      "THEOREM VC approached directly: 6000 seeded parity-pure multi-packet witnesses at rates >= 1/4 (2-5 blocks, up to 5 packets per block, edge-piled every third draw, both parities) - max E = -0.03544721343090412 strictly negative, zero E > 0 draws",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return BAT_W.viol === 0 && BAT_W.maxE < 0 && rel(BAT_W.maxE, BAT_W_MAX_E_LIT, 1e-6);
    },
  },
  {
    id: "imp95137-vc-root-landmarks",
    description:
      "float landmarks (measured, not certified): max over the (alpha, gamma) square of lamMax at mu = 0.245 is 1.0002233714956483 > 1 > 0.9983331282761292 at mu = 0.246, bracketing the vector-cap root 0.24512 strictly below the imp-95136 plain-cap root 0.2754",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      const l245 = maxLamFloat(0.245, 60);
      const l246 = maxLamFloat(0.246, 60);
      return rel(l245, LAM_0245_LIT, 1e-9) && l245 > 1 && rel(l246, LAM_0246_LIT, 1e-9) && l246 < 1;
    },
  },
  {
    id: "imp95137-vc-odd-parity-domination",
    description:
      "the parametrized odd-parity entries are dominated by the even ones at the same q: chat(2z) sqrt(1+2zq) <= chat(z) sqrt(1+zq) on a (z, q) grid, via e^{-2z}(1+2z) <= 1 and 1+2zq <= (1+z)(1+zq) for q <= 1; and Lemma OG gap doubling holds exactly for all j < k <= 20",
    holds: () => {
      for (let zi = 1; zi <= 40; zi++) {
        const z = zi * 0.25;
        if (Math.exp(-2 * z) * (1 + 2 * z) > 1 + 1e-12) return false;
        for (let k = 0; k <= 10; k++) {
          const q = k / 10;
          if (1 + 2 * z * q > (1 + z) * (1 + z * q) * (1 + 1e-12)) return false;
          const odd = chat(2 * z) * Math.sqrt(1 + 2 * z * q);
          const even = chat(z) * Math.sqrt(1 + z * q);
          if (odd > even * (1 + 1e-12)) return false;
        }
      }
      for (let j = 0; j < 20; j++) {
        for (let k = j + 1; k <= 20; k++) {
          const dOdd = Math.pow(2, 2 * k + 1) - Math.pow(2, 2 * j + 2);
          const dEven = Math.pow(2, 2 * k) - Math.pow(2, 2 * j + 1);
          if (dOdd !== 2 * dEven) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95137-vc-consistency",
    description:
      "consistency: the THEOREM WE witness keeps E(23/100) = 17796.715801475395 > 0 with 23/100 < 1/4 (two-sided sandwich [0.23, 0.25]) and E(1/4) = -135059.37605989102 < 0; 1/4 < 69/250 supersedes THEOREM SA at the constant level",
    holds: () => {
      const rel = (x, lit, t) => Math.abs(x - lit) <= t * Math.abs(lit);
      return (
        rel(eWitnessWE(23 / 100), E_WE_23_LIT, 1e-9) &&
        eWitnessWE(23 / 100) > 0 &&
        23 / 100 < MU_VC &&
        rel(eWitnessWE(MU_VC), E_WE_VC_LIT, 1e-9) &&
        eWitnessWE(MU_VC) < 0 &&
        MU_VC < 69 / 250
      );
    },
  },
  {
    id: "imp95137-vc-honesty-gate",
    description:
      "the verdict is scoped: parity-pure, model family, 1/4 certified not sharp, the cap-simultaneity leg stays OPEN under the probe-depth residual, parent sub-gap stays OPEN; promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95137_TWO_SIDED_TILT_VECTOR_CAP.promotesBound === false &&
      /NO QED/.test(IMP95137_TWO_SIDED_TILT_VECTOR_CAP.rigorScope) &&
      /refereed bound is changed/i.test(IMP95137_TWO_SIDED_TILT_VECTOR_CAP.rigorScope) &&
      /stays OPEN/.test(IMP95137_TWO_SIDED_TILT_VECTOR_CAP.rigorScope) &&
      /remains OPEN/.test(IMP95137_TWO_SIDED_TILT_VECTOR_CAP.openResiduals[0]) &&
      /stays OPEN, narrowed/.test(IMP95137_TWO_SIDED_TILT_VECTOR_CAP.openResiduals[1]) &&
      IMP95137_TWO_SIDED_TILT_VECTOR_CAP.subGaps.length === 1 &&
      IMP95137_TWO_SIDED_TILT_VECTOR_CAP.openResiduals.length === 3 &&
      /parity-pure/.test(IMP95137_TWO_SIDED_TILT_VECTOR_CAP.rigorScope),
  },
];

for (const a of IMP95137_TWO_SIDED_TILT_VECTOR_CAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95137-two-sided-tilt-vector-cap assertion failed: ${a.id}`);
  }
}

export default IMP95137_TWO_SIDED_TILT_VECTOR_CAP;
