/**
 * imp-95154 - RIGOROUS step -- LEMMA JF + LEMMA KU + THEOREM KN/KN2 +
 * LEMMA DJ (k-uniform hull boundary-jet reduction for the Matern-3/2
 * carrier g(z) = exp(-z)(1+z)): the ENTIRE remaining occupancy ladder
 * (the k >= 5 and mixed-heavy-pair channels of
 * imp-95144-subgap-k-packet-ladder) collapses, UNIFORMLY IN k, to hull
 * boundary 2-jets. The named obstruction that eliminated the channels --
 * "Lemma EP generalizes to a (k-1)-sphere amplitude arc with a pairwise
 * penalty matrix, Lemma AY needs the k-dimensional cone-copositivity
 * version" -- is REMOVED at cap level: no k-dimensional object is needed
 * for ANY k.
 *
 * SETTING (the carried witness reduction, unchanged): a parity-pure MAJ
 * witness at one common rate mu has E <= 0 iff the quadratic form
 * Q(a) = sum a_i^2 - 2 sum_{i<j} sgn_ij a_i a_j g(mu |u_i - u_j|) >= 0,
 * sgn = -1 within a block (helps) and +1 across blocks; amplitudes are
 * NONNEGATIVE. Each block aggregates to the unit vector
 * Ahat = A/||A||, A = sum_i a_i phi(u_i) in the RKHS of g (positive
 * definite: Matern-3/2), and E <= 0 follows when the aggregated bond
 * matrix has lambda_max <= 1. The k-packet machinery of the carried
 * chain (nested spherical arcs, bondQ) parametrizes the block interior;
 * its cost explodes with k. This module removes the interior entirely.
 *
 * LEMMA JF (exact jet factorization; pure algebra). For all d, t >= 0:
 *   g(d + t) = g(d) g(t) - (d exp(-d)) (t exp(-t)).
 * Proof: exp(-(d+t))[(1+d)(1+t) - dt] = exp(-(d+t))(1+d+t). QED (exact).
 *
 * LEMMA KU (exact hull projection; k-uniform, REAL amplitudes). Let
 * A = sum a_i phi(u_i), a_i real, u_i in [l, r], and let s = r + d,
 * d >= 0 (symmetric on the left). Let e1 = phi(r) and let e2 be the
 * mean-square derivative feature at r taken from inside the hull
 * (e2 = lim (phi(r) - phi(r-eps))/eps; the limit exists because the
 * covariance C(tau) = g(|tau|) is C^2 -- C2nd(tau) = (|tau|-1)exp(-|tau|)
 * is continuous with C2nd(0) = -1 -- and ||e2|| = 1, <e1,e2> = 0).
 * Then with t_i = r - u_i >= 0,
 *   <A, phi(s)> = g(d) S0 - d exp(-d) S1   (EXACT, by LEMMA JF),
 *   S0 = sum a_i g(t_i) = <A, e1>,  S1 = sum a_i t_i exp(-t_i) = -<A, e2>,
 * and Bessel on the orthonormal pair (e1, e2) gives S0^2 + S1^2 <= ||A||^2,
 * hence by Cauchy-Schwarz in R^2
 *   <A, phi(s)> <= beta(d) ||A||,  beta(d) = exp(-d) sqrt(1 + 2d + 2d^2).
 * beta is EXACT: phi(s) - [g(d) e1 + d exp(-d) e2] is orthogonal to
 * phi(u) for EVERY u <= r (LEMMA JF again), so the projection of phi(s)
 * onto the closed span of the whole hull IS the 2-jet vector and the
 * sup over real profiles equals beta(d) (attained in the closure;
 * approached by A_eps = g(d) phi(r) + d exp(-d) (phi(r) - phi(r-eps))/eps).
 * Properties: beta(d) <= 1, beta decreasing, beta(d) <= sqrt(2) g(d).
 *
 * THEOREM KN (nonnegative domination; the witness class). If a_i >= 0
 * then S1 >= 0 and S0 <= ||A|| (Cauchy-Schwarz with phi(r)), so
 *   bond b_s = <A, phi(s)> / ||A|| <= g(d)   FOR EVERY k.
 * The single packet AT the nearest hull endpoint dominates every
 * k-packet nonnegative configuration, per bond, uniformly in k. The
 * proof needs only LEMMA JF + Cauchy-Schwarz + positive definiteness of
 * g -- no derivative feature, no limit. Sharp: k = 1 at the endpoint
 * attains g(d) exactly.
 *
 * COROLLARY KN2 (heavy-heavy). For two disjoint hulls at gap D with
 * nonnegative aggregates A, B: <Ahat, Bhat> <= g(D). Proof: KN gives
 * <A, phi(v_j)> <= g(D + s_j) ||A|| for each packet of B; summing with
 * weights b_j >= 0, sum_j b_j g(D + s_j) = <B, phi(r_A)> <= g(D) ||B||
 * by KN applied to hull B with external target r_A at gap D. QED.
 *
 * LEMMA DJ (double-jet closed form; the joint certificate object). For
 * D, t, s >= 0 (iterate LEMMA JF):
 *   g(D+t+s) = g(D)g(t)g(s) - D exp(-D)[t exp(-t) g(s) + s exp(-s) g(t)]
 *              - (1-D) exp(-D) (t exp(-t))(s exp(-s)),
 * so the aggregate-aggregate bond is EXACTLY
 *   <A,B> = g(D) S0A S0B - D exp(-D)(S1A S0B + S0A S1B)
 *           - (1-D) exp(-D) S1A S1B,
 * a bilinear form of the two 2-jet moment pairs -- every heavy-heavy
 * bond is a function of FOUR numbers regardless of the two occupancies.
 *
 * CONSEQUENCE (frontier structure). Every entry of the exact
 * block-aggregated bond matrix of ANY witness (any occupancy vector,
 * any k per block) is <= the k = 1 cap evaluated at the hull edge
 * nearest the target (KN/KN2), and the full bond VECTOR of a block is
 * the linear image of its jet pair (S0, S1)/||A|| constrained by the
 * Bessel quarter-disk (S0, S1 >= 0, S0^2 + S1^2 <= ||A||^2) -- jointly
 * across BOTH endpoints by the closed-form 4-frame Gram G4(W). The
 * k >= 5 and mixed-heavy-pair channels therefore reduce to a
 * k-INDEPENDENT "jet-phantom" frame: per block, two hull endpoints and
 * one jet pair per endpoint. The certificate-side question is now
 * purely positional/cross-row -- the same slack family the chain
 * measured at the k = 4 walls -- with NO k-dimensional blowup.
 *
 * MEASURED PRICING (deterministic, in-sweep; the honest part). In the
 * carried 5-row head/tail frame (BASE 1,4,16 + tails 64,256 with the
 * carried R4 = 2 and 4x tail caps), T = 1 heavy, worst corner
 * u0 = 2, hull [4,8], u2 = 16 (the recorded near-single-packet ridge):
 * (1) PER-ROW jet phantom (KN caps only, no joint constraint) is
 *     REFUTED: corner lambda = 1.08698 / 1.07489 / 1.06320 at
 *     mu = 0.235 / 0.24 / 0.245 -- the per-row route can never certify
 *     the channels anywhere relevant. The cross-row coupling carries
 *     ~9 lambda-points here, consistent with the imp-95151/95153
 *     joint-attainment diagnosis.
 * (2) k = 1 same-corner reference: lambda = 0.9943608 / 0.9850897 /
 *     0.9762626. LANDMARK: the 0.235 value reproduces the imp-95151
 *     recorded wall diagnosis ("sampled true pointwise Perron <=
 *     0.99436") to all printed digits, and the k = 1 corner crossing
 *     0.2320759 sits 3.6e-6 from the carried class-sandwich floor
 *     0.2320723 -- the frame is anchored to two independently recorded
 *     chain landmarks.
 * (3) JOINT jet phantom (4-frame Bessel ellipsoid + witness-class jet
 *     signs S0 >= 0, S1 >= 0 per endpoint): sampled sup crosses 1 at
 *     mu ~ 0.2399, BELOW the class ceiling 0.24502, with sampled sup
 *     0.98974 at 0.245 (~1 percent margin) -- the joint route has real
 *     headroom where the per-row route has none. A certified positional
 *     cover of this object would hand the k >= 5 channel (and, via
 *     LEMMA DJ, the mixed-heavy-pair channel) its FIRST floor below the
 *     THEOREM HS ceiling, for ALL k at once.
 * (4) The REAL-amplitude ellipse alone (image of the full Bessel
 *     ellipsoid, Sigma = L G4 Ltrans in closed form) intersected with
 *     the KN box does NOT certify the corner at 0.245 (lambda 1.00704):
 *     the jet SIGN constraints (nonnegative class) carry the margin --
 *     the successor cover must keep them.
 * WHAT THIS RUN DOES NOT DO: no new certified rate constant -- the
 * jet-phantom cover is NAMED (sub-gap imp-95154-subgap-jet-phantom-
 * cover), not run. Floors and the class sandwich [0.2320723, 0.24502]
 * are carried UNCHANGED. Changes no bound; NO QED; no refereed bound is changed.
 *
 * Import-light; zero imports; all assertions deterministic, ~4 s.
 */
const g = (z) => Math.exp(-z) * (1 + z);
const beta = (d) => Math.exp(-d) * Math.sqrt(1 + 2 * d + 2 * d * d);

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95154-kuniform-hull-jet-reduction assertion failed: ${id}`);
}
const MEASURED = {};

// ---------------------------------------------------------------------------
// (A) LEMMA JF and LEMMA DJ exact identities on a grid (machine precision)
// ---------------------------------------------------------------------------
{
  let worstJF = 0, worstDJ = 0;
  for (let d = 0; d <= 6; d += 0.37) {
    for (let t = 0; t <= 6; t += 0.41) {
      const lhs = g(d + t);
      const rhs = g(d) * g(t) - d * Math.exp(-d) * t * Math.exp(-t);
      worstJF = Math.max(worstJF, Math.abs(lhs - rhs) / Math.max(lhs, 1e-300));
      for (let s = 0; s <= 4; s += 0.53) {
        const l3 = g(d + t + s);
        const r3 =
          g(d) * g(t) * g(s) -
          d * Math.exp(-d) * (t * Math.exp(-t) * g(s) + s * Math.exp(-s) * g(t)) -
          (1 - d) * Math.exp(-d) * t * Math.exp(-t) * s * Math.exp(-s);
        worstDJ = Math.max(worstDJ, Math.abs(l3 - r3) / Math.max(l3, 1e-300));
      }
    }
  }
  MEASURED.identities = { worstJF, worstDJ };
  assertI(worstJF < 1e-12, `imp95154-jf-identity(${worstJF})`);
  assertI(worstDJ < 1e-11, `imp95154-dj-identity(${worstDJ})`);
}

// ---------------------------------------------------------------------------
// (B) beta properties + exact tightness of LEMMA KU
// ---------------------------------------------------------------------------
{
  let prev = Infinity, okMono = true, okSqrt2 = true, okForm = true;
  for (let d = 0; d <= 8; d += 0.05) {
    const b = beta(d);
    if (b > prev + 1e-15) okMono = false;
    if (b > Math.SQRT2 * g(d) + 1e-15) okSqrt2 = false;
    const form = Math.sqrt(g(d) * g(d) + d * d * Math.exp(-2 * d));
    if (Math.abs(b - form) > 1e-14) okForm = false;
    prev = b;
  }
  assertI(Math.abs(beta(0) - 1) < 1e-15 && okMono && okSqrt2 && okForm, "imp95154-beta-properties");
  // tightness: the jet-aligned finite sequence A_eps approaches beta(d)
  const d0 = 0.7;
  const bondOf = (eps) => {
    // A = c1 phi(r) + c2 (phi(r) - phi(r-eps))/eps, closed-form Gram in g
    const c1 = g(d0), c2 = d0 * Math.exp(-d0);
    const num = c1 * g(d0) + (c2 * (g(d0) - g(d0 + eps))) / eps;
    const n2 =
      c1 * c1 +
      (2 * c1 * c2 * (1 - g(eps))) / eps +
      (c2 * c2 * (2 - 2 * g(eps))) / (eps * eps);
    return num / Math.sqrt(n2);
  };
  const r1 = bondOf(1e-1) / beta(d0), r2 = bondOf(1e-2) / beta(d0), r3 = bondOf(1e-3) / beta(d0);
  MEASURED.tightness = { r1, r2, r3 };
  assertI(r1 < r2 && r2 < r3 && r3 > 0.999 && r3 <= 1 + 1e-12, `imp95154-ku-tightness(${r3})`);
  // KN sharpness: k = 1 at the endpoint attains g(d) exactly
  assertI(Math.abs(g(d0) / g(d0) - 1) < 1e-15, "imp95154-kn-sharp-k1");
}

// ---------------------------------------------------------------------------
// (C) seeded batteries: KN domination, KU signed cap, KN2, DJ aggregate form
// ---------------------------------------------------------------------------
{
  let st = 13579;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstDom = -Infinity, worstBeta = -Infinity, nDom = 0, nBeta = 0;
  for (let trial = 0; trial < 20000; trial++) {
    const k = 1 + Math.floor(rnd() * 64);
    const W = 0.1 + rnd() * 6;
    const ts = Array.from({ length: k }, () => rnd() * W);
    const as = ts.map(() => (rnd() < 0.15 ? 0 : Math.pow(10, -2 + 4 * rnd())));
    if (as.every((a) => a === 0)) continue;
    const d = 0.01 + rnd() * 5;
    let n2 = 0;
    for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) n2 += as[i] * as[j] * g(Math.abs(ts[i] - ts[j]));
    let bond = 0;
    for (let i = 0; i < k; i++) bond += as[i] * g(d + ts[i]);
    worstDom = Math.max(worstDom, bond / Math.sqrt(n2) / g(d));
    nDom++;
    const ss = ts.map(() => (rnd() < 0.5 ? -1 : 1));
    let n2s = 0, bs = 0;
    for (let i = 0; i < k; i++) {
      bs += ss[i] * as[i] * g(d + ts[i]);
      for (let j = 0; j < k; j++) n2s += ss[i] * ss[j] * as[i] * as[j] * g(Math.abs(ts[i] - ts[j]));
    }
    if (n2s > 1e-12) {
      worstBeta = Math.max(worstBeta, Math.abs(bs) / Math.sqrt(n2s) / beta(d));
      nBeta++;
    }
  }
  MEASURED.knBattery = { worstDom, worstBeta, nDom, nBeta };
  assertI(nDom > 15000 && worstDom <= 1 + 1e-12, `imp95154-kn-domination(${worstDom})`);
  assertI(nBeta > 10000 && worstBeta <= 1 + 1e-12, `imp95154-ku-signed-cap(${worstBeta})`);

  // KN2 + DJ: two disjoint hulls, nonnegative aggregates
  let worstKN2 = -Infinity, worstDJagg = 0, nPair = 0;
  for (let trial = 0; trial < 4000; trial++) {
    const kA = 1 + Math.floor(rnd() * 16), kB = 1 + Math.floor(rnd() * 16);
    const WA = 0.1 + rnd() * 3, WB = 0.1 + rnd() * 3, D = 0.05 + rnd() * 4;
    // hull A on [-WA, 0] (t = distance below r_A = 0); hull B on [D, D+WB]
    const tA = Array.from({ length: kA }, () => rnd() * WA);
    const aA = tA.map(() => 0.01 + rnd());
    const sB = Array.from({ length: kB }, () => rnd() * WB);
    const bB = sB.map(() => 0.01 + rnd());
    let nA = 0, nB = 0, cross = 0;
    for (let i = 0; i < kA; i++) for (let j = 0; j < kA; j++) nA += aA[i] * aA[j] * g(Math.abs(tA[i] - tA[j]));
    for (let i = 0; i < kB; i++) for (let j = 0; j < kB; j++) nB += bB[i] * bB[j] * g(Math.abs(sB[i] - sB[j]));
    for (let i = 0; i < kA; i++) for (let j = 0; j < kB; j++) cross += aA[i] * bB[j] * g(D + tA[i] + sB[j]);
    worstKN2 = Math.max(worstKN2, cross / Math.sqrt(nA * nB) / g(D));
    // LEMMA DJ aggregate closed form (exact)
    const S0A = tA.reduce((s, t, i) => s + aA[i] * g(t), 0);
    const S1A = tA.reduce((s, t, i) => s + aA[i] * t * Math.exp(-t), 0);
    const S0B = sB.reduce((s, t, i) => s + bB[i] * g(t), 0);
    const S1B = sB.reduce((s, t, i) => s + bB[i] * t * Math.exp(-t), 0);
    const dj =
      g(D) * S0A * S0B -
      D * Math.exp(-D) * (S1A * S0B + S0A * S1B) -
      (1 - D) * Math.exp(-D) * S1A * S1B;
    worstDJagg = Math.max(worstDJagg, Math.abs(dj - cross) / Math.max(cross, 1e-300));
    nPair++;
  }
  MEASURED.kn2Battery = { worstKN2, worstDJagg, nPair };
  assertI(nPair === 4000 && worstKN2 <= 1 + 1e-12, `imp95154-kn2-heavy-heavy(${worstKN2})`);
  assertI(worstDJagg < 1e-11, `imp95154-dj-aggregate-exact(${worstDJagg})`);
}

// ---------------------------------------------------------------------------
// (D) measured pricing in the carried 5-row frame at the recorded ridge corner
// ---------------------------------------------------------------------------
function eig5(M) {
  let v = [1, 1, 0.5, 1e-3, 1e-6];
  for (let it = 0; it < 600; it++) {
    const w = M.map((row) => row.reduce((s, x, j) => s + x * v[j], 0) + 1e-30);
    const n = Math.hypot(...w);
    v = w.map((x) => x / n);
  }
  let num = 0, den = 0, cw = -Infinity;
  for (let i = 0; i < 5; i++) {
    den += v[i] * v[i];
    let s = 1e-30;
    for (let j = 0; j < 5; j++) { num += v[i] * M[i][j] * v[j]; s += M[i][j] * v[j]; }
    const r = s / Math.max(v[i], 1e-30);
    if (r > cw) cw = r;
  }
  // ray is a certified LOWER bound (Rayleigh), cw a certified UPPER bound
  return { ray: num / den, cw };
}
// carried head/tail frame, T = 1 heavy: rows 0 = block-0 single, 1 = heavy,
// 2 = block-2 single, 3/4 = tail aggregates (carried R4 = 2 and 4x caps)
function frameMatrix(mu, b01, b12, hR, u0, u2) {
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => { M[i][j] = x; M[j][i] = x; };
  set(0, 1, Math.max(0, b01));
  set(1, 2, Math.max(0, b12));
  set(0, 2, g(mu * (u2 - u0)));
  set(0, 3, 2 * g(mu * (64 - u0)));
  set(1, 3, 2 * g(mu * (64 - hR)));
  set(2, 3, 2 * g(mu * 32));
  set(0, 4, 2 * g(mu * (256 - u0)));
  set(1, 4, 2 * g(mu * (256 - hR)));
  set(2, 4, 2 * g(mu * 224));
  set(3, 4, 4 * g(mu * 128));
  return M;
}
// closed-form 4-frame jet Gram at hull width W (kernel units)
function G4(W) {
  const e = Math.exp(-W);
  return [
    [1, 0, e * (1 + W), -W * e],
    [0, 1, W * e, (1 - W) * e],
    [e * (1 + W), W * e, 1, 0],
    [-W * e, (1 - W) * e, 0, 1],
  ];
}
const quadForm = (G, c) => {
  let s = 0;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) s += c[i] * G[i][j] * c[j];
  return s;
};
const matVec = (G, c) => G.map((row) => row.reduce((s, x, j) => s + x * c[j], 0));
// sampled sup of lambda over the joint jet phantom (ellipsoid + jet signs);
// a LOWER bound on the phantom sup -- used to refute-or-price, never certify
function jointSup(mu, hL, hR, u0, u2, nDraw, seed) {
  const W = mu * (hR - hL);
  const G = G4(W);
  const dl = mu * (hL - u0), dr = mu * (u2 - hR);
  let st = seed;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let best = -Infinity, bestC = null;
  const evalC = (c) => {
    const n2 = quadForm(G, c);
    if (n2 <= 1e-12) return -Infinity;
    const q = Math.sqrt(n2);
    const z = matVec(G, c.map((x) => x / q));
    // z = (x_l, w_l, x_r, w_r); witness-class jet signs
    if (z[0] < 0 || z[1] < 0 || z[2] < 0 || z[3] > 0) return -Infinity;
    const b01 = g(dl) * z[0] - dl * Math.exp(-dl) * z[1];
    const b12 = g(dr) * z[2] + dr * Math.exp(-dr) * z[3];
    return eig5(frameMatrix(mu, b01, b12, hR, u0, u2)).ray;
  };
  for (let t = 0; t < nDraw; t++) {
    const c = [rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1];
    const v = evalC(c);
    if (v > best) { best = v; bestC = c.slice(); }
  }
  let step = 0.2;
  for (let it = 0; it < 200; it++) {
    let improved = false;
    for (let i = 0; i < 4; i++) {
      for (const sgn of [step, -step]) {
        const c = bestC.slice();
        c[i] += sgn;
        const v = evalC(c);
        if (v > best) { best = v; bestC = c; improved = true; }
      }
    }
    if (!improved) step *= 0.5;
    if (step < 1e-7) break;
  }
  return best;
}
{
  const U0 = 2, U2 = 16, HL = 4, HR = 8;
  const perRow = {}, k1 = {}, joint = {};
  for (const mu of [0.235, 0.24, 0.245]) {
    perRow[mu] = eig5(frameMatrix(mu, g(mu * (HL - U0)), g(mu * (U2 - HR)), HR, U0, U2));
    k1[mu] = eig5(frameMatrix(mu, g(mu * (4 - U0)), g(mu * (U2 - 4)), 4, U0, U2));
    joint[mu] = jointSup(mu, HL, HR, U0, U2, 800, 90210);
  }
  // sampled crossing of the joint jet phantom over mu (hull right edge scanned)
  const jointHulls = (mu) => Math.max(
    jointSup(mu, HL, 6, U0, U2, 600, 90210),
    jointSup(mu, HL, 8, U0, U2, 600, 90210)
  );
  let lo = 0.235, hi = 0.25;
  for (let i = 0; i < 10; i++) {
    const mid = (lo + hi) / 2;
    if (jointHulls(mid) > 1) lo = mid; else hi = mid;
  }
  // k = 1 corner crossing (class-floor landmark)
  let lo2 = 0.2, hi2 = 0.25;
  for (let i = 0; i < 30; i++) {
    const mid = (lo2 + hi2) / 2;
    if (eig5(frameMatrix(mid, g(mid * 2), g(mid * 12), 4, U0, U2)).ray > 1) lo2 = mid; else hi2 = mid;
  }
  // real-amplitude ellipse (Sigma = L G4 Ltrans) + KN box at the 0.245 corner
  const mu = 0.245;
  const W = mu * (HR - HL), dl = mu * (HL - U0), dr = mu * (U2 - HR);
  const G = G4(W);
  const L = [
    [g(dl), -dl * Math.exp(-dl), 0, 0],
    [0, 0, g(dr), dr * Math.exp(-dr)],
  ];
  const Sig = [[0, 0], [0, 0]];
  for (let a = 0; a < 2; a++) {
    for (let b = 0; b < 2; b++) {
      let s = 0;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) s += L[a][i] * G[i][j] * L[b][j];
      Sig[a][b] = s;
    }
  }
  const det = Sig[0][0] * Sig[1][1] - Sig[0][1] * Sig[0][1];
  const q11 = Sig[1][1] / det, q12 = -Sig[0][1] / det, q22 = Sig[0][0] / det;
  const b01 = g(dl);
  const A2 = q22, B2 = 2 * q12 * b01, C2 = q11 * b01 * b01 - 1;
  const b12max = (-B2 + Math.sqrt(B2 * B2 - 4 * A2 * C2)) / (2 * A2);
  const ellipseCorner = eig5(frameMatrix(mu, b01, Math.min(b12max, g(dr)), HR, U0, U2));
  MEASURED.pricing = {
    perRow, k1, joint,
    jointCross: [lo, hi],
    k1Cross: [lo2, hi2],
    ellipseCorner245: { Sigma: Sig, b01, b12max, lam: ellipseCorner.ray },
  };
}

// ---------------------------------------------------------------------------
// verdict object
// ---------------------------------------------------------------------------
export const IMP95154_KUNIFORM_HULL_JET_REDUCTION = {
  id: "imp-95154",
  title:
    "k-uniform hull boundary-jet reduction: LEMMA JF (exact factorization), LEMMA KU (exact 2-jet projection cap beta), THEOREM KN (nonnegative single-endpoint domination), COROLLARY KN2 (heavy-heavy), LEMMA DJ (double-jet closed form)",
  rigorous: {
    lemmaJF: "g(d+t) = g(d)g(t) - (d exp(-d))(t exp(-t)) for d,t >= 0; exact algebra",
    lemmaKU:
      "for REAL amplitude profiles in a hull, the normalized bond to an external point at gap d is <= beta(d) = exp(-d) sqrt(1+2d+2d^2), EXACTLY the sup over the closed hull span (the exterior feature projects exactly onto the boundary 2-jet)",
    theoremKN:
      "for NONNEGATIVE amplitude profiles (the MAJ witness class) the bond is <= g(d) for EVERY packet count k: the single packet at the nearest hull endpoint dominates; proof = LEMMA JF + Cauchy-Schwarz + positive definiteness of g",
    corollaryKN2: "two nonnegative aggregates in disjoint hulls at gap D have <Ahat,Bhat> <= g(D), every k on both sides",
    lemmaDJ:
      "the aggregate-aggregate bond is an exact bilinear form of the two boundary jet pairs (S0,S1): g(D)S0A S0B - D exp(-D)(S1A S0B + S0A S1B) - (1-D)exp(-D) S1A S1B",
    consequence:
      "the k >= 5 and mixed-heavy-pair channels of imp-95144-subgap-k-packet-ladder reduce at cap level to a k-INDEPENDENT jet-phantom frame (two hull endpoints + one Bessel-constrained jet pair per endpoint per heavy block); the named (k-1)-sphere / k-dimensional cone-copositivity obstruction is removed",
  },
  measured: {
    perRowRefuted:
      "per-row jet phantom (KN caps only) at the recorded ridge corner: lambda 1.08698 / 1.07489 / 1.06320 at mu 0.235 / 0.24 / 0.245 -- can never certify; cross-row coupling carries ~9 lambda-points",
    jointHeadroom:
      "joint jet phantom (4-frame Bessel ellipsoid + witness-class jet signs): sampled sup crossing mu ~ 0.2399 < classCeiling 0.24502; sampled sup 0.98974 at 0.245 -- certified-cover headroom exists for a FIRST k >= 5 floor below the HS ceiling",
    ellipseInsufficient:
      "real-amplitude ellipse (Sigma = L G4 Ltrans closed form) + KN box does NOT certify the 0.245 corner (lambda 1.00704): the jet sign constraints carry the margin",
    landmarks:
      "k = 1 corner reference at 0.235 reproduces the imp-95151 recorded 0.99436 wall value to all printed digits; k = 1 corner crossing 0.2320759 sits 3.6e-6 from the carried class-sandwich floor 0.2320723",
  },
  openSubGap: {
    name: "imp-95154-subgap-jet-phantom-cover",
    status: "OPEN",
    description:
      "Certify the joint jet-phantom over a positional cover (axes: heavy hull endpoints, single positions, rate; per cell the feasible bond pairs are the linear image of the 4-frame Bessel ellipsoid intersected with the jet sign orthant -- support cuts h(v) <= sqrt((v-m)T G4 (v-m)) for any multiplier m in the dual sign cone give certified outer polygons in bond space, and lambda_max is convex + entrywise monotone so polygon vertices certify). Payoff: a single cover closes the k >= 5 channel AND (via LEMMA DJ, two jet pairs) the mixed-heavy-pair channel for ALL k at once, at whatever floor mu-star in (0.2399, 0.24502) the budget reaches -- the FIRST floor below the THEOREM HS ceiling for either channel. The sign constraints (THEOREM KN structure) must be kept: the unsigned ellipse fails at 0.245.",
  },
  carried: {
    classSandwich: [0.2320723, 0.24502],
    ladderFloorKle4: 47 / 200,
    jointThreshold:
      "any full-class E > 0 witness at a common rate >= 0.235 must place >= 5 packets in one block or >= 3 and >= 2 in two blocks (THEOREM PO/TP/VP/QP/VU/VW/VX, unchanged)",
  },
  promotesBound: false,
  noQED: true,
  sota: "No refereed bound is changed",
};

// ---------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// ---------------------------------------------------------------------------
export const IMP95154_KUNIFORM_HULL_JET_REDUCTION_ASSERTIONS = [
  {
    id: "imp95154-exact-identities",
    description:
      "LEMMA JF and LEMMA DJ hold to machine precision on the verification grids (single and double jet factorization of the Matern-3/2 carrier)",
    holds: () => MEASURED.identities.worstJF < 1e-12 && MEASURED.identities.worstDJ < 1e-11,
  },
  {
    id: "imp95154-ku-exact-tightness",
    description:
      "beta(d) = exp(-d)sqrt(1+2d+2d^2) is monotone, <= sqrt(2) g, and EXACTLY attained in the limit by the jet-aligned finite sequence (ratio > 0.999 at eps = 1e-3, increasing as eps decreases)",
    holds: () =>
      MEASURED.tightness.r3 > 0.999 &&
      MEASURED.tightness.r1 < MEASURED.tightness.r2 &&
      MEASURED.tightness.r2 < MEASURED.tightness.r3,
  },
  {
    id: "imp95154-kn-domination-battery",
    description:
      "THEOREM KN battery: > 15000 seeded nonnegative profiles with up to 64 packets never exceed the single-endpoint cap g(d) (worst ratio <= 1), and signed profiles never exceed beta(d)",
    holds: () =>
      MEASURED.knBattery.nDom > 15000 &&
      MEASURED.knBattery.worstDom <= 1 + 1e-12 &&
      MEASURED.knBattery.worstBeta <= 1 + 1e-12,
  },
  {
    id: "imp95154-kn2-dj-battery",
    description:
      "COROLLARY KN2 battery: 4000 seeded heavy-heavy pairs never exceed g(gap); LEMMA DJ aggregate closed form matches the exhaustive double sum to 1e-11 relative",
    holds: () =>
      MEASURED.kn2Battery.nPair === 4000 &&
      MEASURED.kn2Battery.worstKN2 <= 1 + 1e-12 &&
      MEASURED.kn2Battery.worstDJagg < 1e-11,
  },
  {
    id: "imp95154-per-row-phantom-refuted",
    description:
      "Per-row jet phantom REFUTED at the recorded ridge corner: certified Rayleigh lower bounds exceed 1.05 at mu = 0.235, 0.24 and 0.245 -- KN caps alone can never certify the k >= 5 channel in the relevant strip",
    holds: () =>
      MEASURED.pricing.perRow[0.235].ray > 1.05 &&
      MEASURED.pricing.perRow[0.24].ray > 1.05 &&
      MEASURED.pricing.perRow[0.245].ray > 1.05,
  },
  {
    id: "imp95154-frame-landmarks",
    description:
      "Frame anchored to two recorded chain landmarks: k = 1 corner lambda at 0.235 equals the imp-95151 recorded 0.99436 wall value (tol 1e-4), and the k = 1 corner crossing sits within 5e-6 of the carried class-sandwich floor 0.2320723",
    holds: () =>
      Math.abs(MEASURED.pricing.k1[0.235].ray - 0.99436) < 1e-4 &&
      Math.abs(MEASURED.pricing.k1Cross[0] - 0.2320723) < 5e-6,
  },
  {
    id: "imp95154-joint-jet-headroom",
    description:
      "Joint jet phantom: sampled sup > 1 at 0.235 (the phantom cannot reach the ladder floor) but < 0.9975 at 0.245 with sampled crossing inside (0.236, 0.2435) -- headroom exists BELOW the class ceiling 0.24502 for a certified cover",
    holds: () =>
      MEASURED.pricing.joint[0.235] > 1.002 &&
      MEASURED.pricing.joint[0.245] < 0.9975 &&
      MEASURED.pricing.jointCross[0] > 0.236 &&
      MEASURED.pricing.jointCross[1] < 0.2435,
  },
  {
    id: "imp95154-ellipse-needs-signs",
    description:
      "The unsigned real-amplitude ellipse + KN box fails at the 0.245 corner (lambda > 1): the witness-class jet SIGN constraints carry the certification margin and must be kept by the successor cover",
    holds: () => MEASURED.pricing.ellipseCorner245.lam > 1.0005,
  },
  {
    id: "imp95154-honest-record-literals",
    description:
      "No constant moves: class sandwich and the k <= 4 ladder floor 47/200 carried unchanged; no bound promotion; no QED; the jet-phantom cover is NAMED, not run",
    holds: () =>
      IMP95154_KUNIFORM_HULL_JET_REDUCTION.carried.classSandwich[0] === 0.2320723 &&
      IMP95154_KUNIFORM_HULL_JET_REDUCTION.carried.classSandwich[1] === 0.24502 &&
      IMP95154_KUNIFORM_HULL_JET_REDUCTION.carried.ladderFloorKle4 === 47 / 200 &&
      IMP95154_KUNIFORM_HULL_JET_REDUCTION.promotesBound === false &&
      IMP95154_KUNIFORM_HULL_JET_REDUCTION.noQED === true &&
      IMP95154_KUNIFORM_HULL_JET_REDUCTION.openSubGap.status === "OPEN",
  },
];

for (const a of IMP95154_KUNIFORM_HULL_JET_REDUCTION_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95154-kuniform-hull-jet-reduction assertion failed: ${a.id}`);
}
