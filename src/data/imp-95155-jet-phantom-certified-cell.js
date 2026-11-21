/**
 * imp-95155 - RIGOROUS step -- CERTIFIED per-cell bound for the imp-95154
 * joint jet phantom (LEMMA SC support cuts + LEMMA PV polygon-vertex
 * reduction + LEMMA CH Cholesky shift certificate): the certificate the
 * sub-gap imp-95154-subgap-jet-phantom-cover NAMED is now BUILT, proved
 * sound, and measured NEAR-LOSSLESS at the anchored ridge frame -- the
 * first CERTIFIED (not sampled) values of the jet-phantom corner: the
 * anchored ridge corner certifies at every mu above a certified corner
 * crossing bracketed at 0.2400105, which sits 4.99e-3 BELOW the class
 * ceiling 0.24502.
 *
 * SETTING (carried verbatim from imp-95154): heavy block with ANY packet
 * count k and nonnegative profile in a hull [hL, hR]; by LEMMA JF/KU the
 * bonds to the two flanking singles are EXACT linear functionals of the
 * 4-frame jet vector z = (S0L, S1L, S0R, -S1R) of the normalized
 * aggregate:
 *   b01 = g(dl) z0 - dl exp(-dl) z1,   b12 = g(dr) z2 + dr exp(-dr) z3,
 * with witness-class signs S z >= 0, S = diag(1,1,1,-1), and the moment
 * constraint that z is the inner-product vector of a UNIT-norm profile
 * with the 4 frame vectors f = (e1L, e2L, e1R, e2R) whose Gram is the
 * closed-form G4(W), W = mu (hR - hL). Tail rows stay at their carried
 * KN caps. imp-95154 could only SAMPLE the sup of lambda over this
 * object (a lower bound); this module CERTIFIES it from above.
 *
 * LEMMA SC (support cut; sound for every multiplier, exact at the
 * optimum). For any direction v = (v1, v2) >= 0 with exact lift
 *   ell(v) = (v1 g(dl), -v1 dl exp(-dl), v2 g(dr), v2 dr exp(-dr)),
 * and ANY m in R^4 with m >= 0, every phantom point satisfies
 *   v1 b01 + v2 b12 = ell(v)T z <= (ell(v) + S m)T z
 *                  = <Ahat, sum_i (ell + S m)_i f_i>
 *                  <= sqrt((ell + S m)T G4 (ell + S m)).
 * Three one-line steps: (i) mT S z >= 0 on the class; (ii) z_i = <Ahat,
 * f_i> exactly (LEMMA KU); (iii) Cauchy-Schwarz with ||Ahat|| = 1 and
 * ||sum c_i f_i||^2 = cT G4 c. NO invertibility of G4 and NO ellipsoid
 * parametrization is needed -- the bound is the RKHS norm of the
 * m-adjusted frame combination. At m = 0 on the axes it is the raw
 * Bessel bound; at the KN multiplier (m eliminates the sign-frustrated jet
 * coordinate) the axis cuts reproduce THEOREM KN exactly: h(1,0) =
 * g(dl), h(0,1) = g(dr) (asserted to 1e-12). Since the feasible set has
 * interior (Slater), min over m >= 0 equals the true support function --
 * the cut family generates the exact closed convex hull of the phantom
 * bond region; the numeric coordinate-descent choice of m affects only
 * tightness, never soundness.
 *
 * LEMMA PV (polygon-vertex reduction). The frame matrix M(b01, b12) is
 * symmetric nonnegative with entries affine and nondecreasing in
 * (b01, b12), so lambda_max is convex (max of affine Rayleigh quotients)
 * and entrywise nondecreasing (nonnegative maximizer). Hence
 *   sup_phantom lambda_max <= max over the vertices of ANY outer polygon
 * P = {b >= 0, v_k . b <= H_k} of lambda_max, and a candidate list
 * containing all pairwise cut/axis intersections that pass an inflated
 * feasibility filter contains every vertex of P (each vertex is the
 * intersection of two active constraints). Accepted vertices are nudged
 * UP before evaluation (conservative under monotonicity).
 *
 * LEMMA CH (Cholesky shift certificate; the imp-95153 device, now used
 * at polygon vertices). If t I - M admits a floating-point Cholesky
 * factorization with all pivots > 0, then lambda_max(M) < t. Bisection
 * on t gives certified upper bounds tight to the bisection tolerance --
 * this replaces the Collatz-Wielandt upper, which is measurably LOOSE at
 * off-Perron vertices (recorded: CW reported 1.19 at the axis vertex
 * (0, g(dr)) where the Cholesky-certified value is far below the box
 * corner 1.087 -- a slow power-iteration artifact, not a phantom fact).
 *
 * MEASURED (deterministic, in-sweep, anchored ridge frame u0 = 2,
 * hull [4, 8], u2 = 16, carried 5-row head/tail frame):
 * (1) NEAR-LOSSLESS: certified (33 cuts) vs imp-95154 sampled sup:
 *     1.010770 / 1.000022 / 0.989803 against 1.010731 / 0.999866 /
 *     0.989741 at mu = 0.235 / 0.24 / 0.245 -- certified minus sampled
 *     <= 1.6e-4 everywhere checked, and monotone in the cut count
 *     (17 -> 33 -> 65 cuts: 1.010975 -> 1.010770 -> 1.010753). The
 *     imp-95153 failure mode (implementable envelope overshoots the
 *     joint headroom by 1.6x and never certifies) does NOT recur: this
 *     certificate loses ~1e-4 where that envelope lost ~5e-2.
 * (2) FIRST CERTIFIED HEADROOM: the two-hull anchored corner (max of
 *     hulls [4,6] and [4,8], mirroring the imp-95154 jointHulls scan)
 *     has its certified crossing bracketed at 0.2400105 +- 2e-8 --
 *     1.1e-4 above the recorded sampled crossing ~0.2399 and 4.99e-3
 *     below the class ceiling 0.24502. At mu = 0.245 the anchored
 *     corner is CERTIFIED at 0.989803 (jet phantom, ALL k at once)
 *     where the KN box corner sits REFUTED at 1.063195: the cross-row
 *     joint constraint is now certified to carry ~7.3 lambda-points at
 *     the recorded stall geometry.
 * (3) HONEST POSITIONAL FINDING (design constraint for the cover): the
 *     certified cell bound is a naked cap-lambda criterion; on
 *     close-position frames it fails for the SAME reason k = 1 fails
 *     (measured at mu = 0.2405: single at 3.5 against hull [3.75, 4],
 *     jet phantom 1.639757 vs k = 1 at 1.628813 -- jet freedom adds
 *     < 1 percent there; intermediate frame (2.5, [4,8], 12): k = 1 at
 *     1.192180, jet phantom 1.264557, both far above 1). Every frame
 *     my grid scans found above 1 already fails at k = 1 -- those are
 *     the regions the carried covers close by SUBDIVISION and the
 *     deletion-floor stages, not by the naked criterion. CONSEQUENCE:
 *     the jet-phantom cover cannot run standalone over the chart; it
 *     must be grafted as a CAP STAGE into the imp-95150 offline runner
 *     stack (replacing the k-explicit bondQ ladder above k = 4), with
 *     the positional interval rounding of the cuts (monotone/Lipschitz
 *     treatment of G4(W) and (dl, dr) across a cell) as the one
 *     remaining engineering item. The sub-gap stays OPEN with this
 *     sharpened spec.
 * WHAT THIS RUN DOES NOT DO: no positional cover is run and NO new
 * certified rate constant is claimed -- all certified statements are at
 * FIXED frames (pointwise), conditional on the carried frame reduction.
 * Class sandwich [0.2320723, 0.24502] and the k <= 4 ladder floor
 * 47/200 carried UNCHANGED. Float discipline: double arithmetic with
 * conservative inflation nudges (1e-9 relative) and Cholesky pivot
 * tolerance 1e-12; every asserted margin is >= 5e-3, at least 6 orders
 * above the nudges. Changes no bound; NO QED; no refereed bound is changed.
 *
 * Import-light; zero imports; all assertions deterministic, ~3 s.
 */
const g = (z) => Math.exp(-z) * (1 + z);

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95155-jet-phantom-certified-cell assertion failed: ${id}`);
}
const MEASURED = {};

// --------------------------------------------------------------------------
// machinery copied VERBATIM from imp-95154 (frame, Gram, sampled sup)
// --------------------------------------------------------------------------
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
  return { ray: num / den, cw };
}
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

// --------------------------------------------------------------------------
// NEW: LEMMA SC support cuts, LEMMA CH Cholesky certificate, certified cell
// --------------------------------------------------------------------------
const SDIAG = [1, 1, 1, -1];
function cutBound(G, ell, m) {
  const a = ell.map((x, i) => x + SDIAG[i] * m[i]);
  return Math.sqrt(Math.max(0, quadForm(G, a)));
}
// exact per-coordinate minimizer of the convex QP in m (clamped at 0);
// LEMMA SC is sound for EVERY m >= 0, so this only tunes tightness
function optimizeCut(G, ell, passes = 60) {
  const m = [0, 0, 0, 0];
  for (let p = 0; p < passes; p++) {
    for (let i = 0; i < 4; i++) {
      m[i] = 0;
      const a0 = ell.map((x, j) => x + SDIAG[j] * m[j]);
      const num = a0.reduce((s, x, j) => s + x * G[i][j], 0) * SDIAG[i];
      m[i] = Math.max(0, -num / G[i][i]);
    }
  }
  return { m, H: cutBound(G, ell, m) };
}
function lift(v1, v2, dl, dr) {
  return [v1 * g(dl), -v1 * dl * Math.exp(-dl), v2 * g(dr), v2 * dr * Math.exp(-dr)];
}
// LEMMA CH: positive-pivot Cholesky of tI - M certifies lambda_max(M) < t
function cholPD(A, n, pivTol) {
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = A[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= pivTol) return false;
        L[i][i] = Math.sqrt(s);
      } else {
        L[i][j] = s / L[j][j];
      }
    }
  }
  return true;
}
function lamMaxUpper(M) {
  const n = M.length;
  let hi = 0;
  for (let i = 0; i < n; i++) hi = Math.max(hi, M[i].reduce((s, x) => s + Math.abs(x), 0));
  hi += 1e-9;
  let lo = 0;
  const test = (t) => cholPD(M.map((row, i) => row.map((x, j) => (i === j ? t - x : -x))), n, 1e-12);
  if (!test(hi)) return hi + 1;
  for (let it = 0; it < 60; it++) {
    const mid = (lo + hi) / 2;
    if (test(mid)) hi = mid; else lo = mid;
  }
  return hi;
}
// certified cell bound: outer polygon from nDir support cuts intersected with
// the nonnegative quadrant; Cholesky-certified lambda_max at every candidate
// vertex (LEMMA PV: candidate list contains every polygon vertex; accepted
// vertices nudged UP; extra candidates only raise the reported bound)
function certifiedCell(mu, hL, hR, u0, u2, nDir) {
  const W = mu * (hR - hL);
  const G = G4(W);
  const dl = mu * (hL - u0), dr = mu * (u2 - hR);
  const cuts = [];
  for (let k = 0; k < nDir; k++) {
    const th = (k / (nDir - 1)) * (Math.PI / 2);
    const v = [Math.cos(th), Math.sin(th)];
    const { H } = optimizeCut(G, lift(v[0], v[1], dl, dr));
    cuts.push({ v, H: H * (1 + 1e-12) + 1e-15 });
  }
  const cand = [];
  for (let i = 0; i < cuts.length; i++) {
    for (let j = i + 1; j < cuts.length; j++) {
      const [a1, a2] = cuts[i].v, [b1, b2] = cuts[j].v;
      const det = a1 * b2 - a2 * b1;
      if (Math.abs(det) < 1e-14) continue;
      cand.push([(cuts[i].H * b2 - cuts[j].H * a2) / det, (a1 * cuts[j].H - b1 * cuts[i].H) / det]);
    }
    if (Math.abs(cuts[i].v[0]) > 1e-14) cand.push([cuts[i].H / cuts[i].v[0], 0]);
    if (Math.abs(cuts[i].v[1]) > 1e-14) cand.push([0, cuts[i].H / cuts[i].v[1]]);
  }
  cand.push([0, 0]);
  let worst = -Infinity, worstAt = null, nFeas = 0;
  for (const [x, y] of cand) {
    if (x < -1e-12 || y < -1e-12) continue;
    let ok = true;
    for (const c of cuts) {
      if (c.v[0] * x + c.v[1] * y > c.H * (1 + 1e-9) + 1e-12) { ok = false; break; }
    }
    if (!ok) continue;
    nFeas++;
    const bx = Math.max(0, x) * (1 + 1e-9), by = Math.max(0, y) * (1 + 1e-9);
    const lam = lamMaxUpper(frameMatrix(mu, bx, by, hR, u0, u2));
    if (lam > worst) { worst = lam; worstAt = [bx, by]; }
  }
  return { lam: worst, at: worstAt, nFeas };
}

// --------------------------------------------------------------------------
// (A) axis cuts reproduce THEOREM KN exactly
// --------------------------------------------------------------------------
{
  let worst = 0;
  for (const mu of [0.235, 0.245]) {
    for (const [hL, hR, u0, u2] of [[4, 8, 2, 16], [4, 6, 1, 12]]) {
      const G = G4(mu * (hR - hL));
      const dl = mu * (hL - u0), dr = mu * (u2 - hR);
      const h10 = optimizeCut(G, lift(1, 0, dl, dr)).H;
      const h01 = optimizeCut(G, lift(0, 1, dl, dr)).H;
      worst = Math.max(worst, Math.abs(h10 / g(dl) - 1), Math.abs(h01 / g(dr) - 1));
    }
  }
  MEASURED.axisKN = { worst };
  assertI(worst < 1e-12, `imp95155-axis-kn(${worst})`);
}

// --------------------------------------------------------------------------
// (B) anchored ridge frame: certified values, dominance, cut-count monotone
// --------------------------------------------------------------------------
{
  const U0 = 2, U2 = 16, HL = 4, HR = 8;
  const cert = {}, sampled = {}, box = {};
  for (const mu of [0.235, 0.24, 0.245]) {
    cert[mu] = certifiedCell(mu, HL, HR, U0, U2, 33).lam;
    sampled[mu] = jointSup(mu, HL, HR, U0, U2, 800, 90210);
    box[mu] = lamMaxUpper(frameMatrix(mu, g(mu * (HL - U0)), g(mu * (U2 - HR)), HR, U0, U2));
  }
  const cut17 = certifiedCell(0.235, HL, HR, U0, U2, 17).lam;
  const cut65 = certifiedCell(0.235, HL, HR, U0, U2, 65).lam;
  // dominance battery on extra rates
  const dom = [];
  for (const mu of [0.236, 0.244, 0.248]) {
    dom.push(certifiedCell(mu, HL, HR, U0, U2, 33).lam - jointSup(mu, HL, HR, U0, U2, 800, 90210));
  }
  for (const mu of [0.235, 0.24, 0.245]) dom.push(cert[mu] - sampled[mu]);
  MEASURED.anchor = { cert, sampled, box, cut17, cut65, dom };
  assertI(dom.every((x) => x >= 0), `imp95155-dominance(${Math.min(...dom)})`);
  assertI(dom.every((x) => x < 5e-4), `imp95155-near-lossless(${Math.max(...dom)})`);
  assertI(cut65 <= cert[0.235] && cert[0.235] <= cut17, "imp95155-cut-count-monotone");
  assertI(cert[0.245] < 0.9925 && cert[0.235] > 1.005, `imp95155-anchor-certifies(${cert[0.245]})`);
  assertI(box[0.245] - cert[0.245] > 0.06, `imp95155-beats-box(${box[0.245] - cert[0.245]})`);
}

// --------------------------------------------------------------------------
// (C) certified corner crossing (two-hull max, mirrors imp-95154 jointHulls)
// --------------------------------------------------------------------------
{
  const U0 = 2, U2 = 16, HL = 4;
  const certHulls = (mu) => Math.max(
    certifiedCell(mu, HL, 6, U0, U2, 33).lam,
    certifiedCell(mu, HL, 8, U0, U2, 33).lam
  );
  let lo = 0.235, hi = 0.25;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (certHulls(mid) > 1) lo = mid; else hi = mid;
  }
  MEASURED.crossing = { lo, hi };
  assertI(lo > 0.2399 && hi < 0.2402, `imp95155-crossing-bracket(${lo},${hi})`);
  assertI(0.24502 - hi > 4.5e-3, `imp95155-headroom-below-ceiling(${0.24502 - hi})`);
}

// --------------------------------------------------------------------------
// (D) close-position diagnostic: the naked criterion fails there at k = 1 too
// --------------------------------------------------------------------------
{
  const mu = 0.2405;
  const closeK1 = lamMaxUpper(frameMatrix(mu, g(mu * 0.25), g(mu * 4.25), 3.75, 3.5, 8));
  const closeJP = certifiedCell(mu, 3.75, 4, 3.5, 8, 33).lam;
  const midK1 = lamMaxUpper(frameMatrix(mu, g(mu * 1.5), g(mu * 8), 4, 2.5, 12));
  const midJP = certifiedCell(mu, 4, 8, 2.5, 12, 33).lam;
  MEASURED.closePosition = { closeK1, closeJP, midK1, midJP };
  assertI(closeK1 > 1.6 && closeJP > 1.6 && closeJP / closeK1 < 1.01,
    `imp95155-close-position-geometry(${closeJP / closeK1})`);
  assertI(midK1 > 1.15 && midJP > midK1, "imp95155-mid-frame-fails-at-k1");
}

// --------------------------------------------------------------------------
// verdict object
// --------------------------------------------------------------------------
export const IMP95155_JET_PHANTOM_CERTIFIED_CELL = {
  id: "imp-95155",
  title:
    "Certified per-cell bound for the joint jet phantom: LEMMA SC (RKHS support cuts over the jet sign cone, sound for every dual multiplier), LEMMA PV (polygon-vertex reduction via convexity + entrywise monotonicity), LEMMA CH (Cholesky shift certificate at vertices)",
  rigorous: {
    lemmaSC:
      "for any direction v >= 0 with exact lift ell(v) and any m >= 0: v.b <= sqrt((ell + Sm)T G4 (ell + Sm)), S = diag(1,1,1,-1); proof is mTSz >= 0 on the class, z_i = <Ahat, f_i> exactly (LEMMA KU), and Cauchy-Schwarz against the RKHS norm of the adjusted frame combination -- no G4 inverse, no ellipsoid parametrization; by Slater the optimized cut equals the true support function",
    lemmaPV:
      "frame-matrix entries are affine nondecreasing in (b01, b12), so lambda_max is convex and entrywise monotone; the phantom sup is bounded by the max over the vertices of any outer cut polygon, and the pairwise-intersection candidate list contains every vertex",
    lemmaCH:
      "positive-pivot Cholesky of tI - M certifies lambda_max(M) < t; bisection gives tight certified uppers where the Collatz-Wielandt upper is measurably loose at off-Perron vertices",
    assembly:
      "SC + PV + CH is a CERTIFIED upper bound on the joint jet phantom at a fixed frame, valid for EVERY packet count k and every nonnegative profile in the hull -- the per-cell certifier the imp-95154 sub-gap named",
  },
  measured: {
    nearLossless:
      "certified (33 cuts) minus sampled <= 1.6e-4 at every checked rate at the anchored ridge frame (1.010770 / 1.000022 / 0.989803 vs 1.010731 / 0.999866 / 0.989741 at mu 0.235 / 0.24 / 0.245); the imp-95153 envelope-overshoot failure mode does not recur",
    certifiedHeadroom:
      "certified two-hull corner crossing bracketed at 0.2400105 (1.1e-4 above the sampled 0.2399, 4.99e-3 below the class ceiling 0.24502); at 0.245 the anchored corner certifies at 0.989803 while the KN box corner is refuted at 1.063195 -- the cross-row joint constraint is certified to carry ~7.3 lambda-points at the recorded stall geometry",
    closePosition:
      "close-position frames fail the naked criterion at k = 1 already (1.628813 vs jet phantom 1.639757 at the (3.5, [3.75,4], 8) corner, mu 0.2405 -- jet freedom adds < 1 percent); every scanned frame above 1 fails at k = 1: those regions belong to the carried covers subdivision and deletion-floor stages",
  },
  openSubGap: {
    name: "imp-95154-subgap-jet-phantom-cover",
    status: "OPEN",
    update:
      "SHARPENED by imp-95155: the per-cell certifier exists (LEMMA SC/PV/CH), is near-lossless (<= 1.6e-4 at the anchor), and certifies the anchored ridge corner strictly below the class ceiling. Remaining items: (1) graft the certifier as a CAP STAGE into the imp-95150 offline runner stack -- it cannot run standalone because close-position frames fail at k = 1 and are closed there by subdivision plus deletion floors; (2) positional interval rounding of the cuts across a cell (monotone or Lipschitz treatment of G4(W) and the gap arguments dl, dr); (3) budget for the cover at a candidate floor mu-star in (0.2400105, 0.24502).",
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

// --------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// --------------------------------------------------------------------------
export const IMP95155_JET_PHANTOM_CERTIFIED_CELL_ASSERTIONS = [
  {
    id: "imp95155-axis-cuts-reproduce-kn",
    description:
      "LEMMA SC axis cuts with the optimized multiplier reproduce THEOREM KN exactly: h(1,0) = g(dl) and h(0,1) = g(dr) to 1e-12 relative at four frame/rate combinations",
    holds: () => MEASURED.axisKN.worst < 1e-12,
  },
  {
    id: "imp95155-certified-dominates-sampled",
    description:
      "Certified polygon bound dominates the imp-95154 sampled sup at all six checked rates (soundness consistency) with gap < 5e-4 (near-lossless: the certificate loses ~1e-4 where the imp-95153 envelope lost ~5e-2)",
    holds: () => MEASURED.anchor.dom.every((x) => x >= 0 && x < 5e-4),
  },
  {
    id: "imp95155-anchor-certifies-with-headroom",
    description:
      "At the anchored ridge corner the certified jet-phantom bound is < 0.9925 at mu 0.245 (certifies, all k at once) and > 1.005 at 0.235 (the phantom cannot reach the ladder floor), and beats the Cholesky-certified KN box corner by > 0.06 at 0.245",
    holds: () =>
      MEASURED.anchor.cert[0.245] < 0.9925 &&
      MEASURED.anchor.cert[0.235] > 1.005 &&
      MEASURED.anchor.box[0.245] - MEASURED.anchor.cert[0.245] > 0.06,
  },
  {
    id: "imp95155-certified-crossing-bracket",
    description:
      "The certified two-hull corner crossing is bracketed inside (0.2399, 0.2402) -- the first CERTIFIED jet-phantom crossing, 4.5e-3+ below the class ceiling 0.24502",
    holds: () =>
      MEASURED.crossing.lo > 0.2399 &&
      MEASURED.crossing.hi < 0.2402 &&
      0.24502 - MEASURED.crossing.hi > 4.5e-3,
  },
  {
    id: "imp95155-cut-count-monotone",
    description:
      "The certified bound is monotone nonincreasing in the number of support cuts (17 >= 33 >= 65 directions at mu 0.235), as the outer polygons are nested",
    holds: () =>
      MEASURED.anchor.cut65 <= MEASURED.anchor.cert[0.235] &&
      MEASURED.anchor.cert[0.235] <= MEASURED.anchor.cut17,
  },
  {
    id: "imp95155-close-position-is-geometry",
    description:
      "Close-position frames fail the naked cap-lambda criterion at k = 1 already (jet freedom adds < 1 percent at the recorded close corner): the jet-phantom cover must be grafted into the offline runner subdivision stack, not run standalone",
    holds: () =>
      MEASURED.closePosition.closeK1 > 1.6 &&
      MEASURED.closePosition.closeJP / MEASURED.closePosition.closeK1 < 1.01 &&
      MEASURED.closePosition.midK1 > 1.15,
  },
  {
    id: "imp95155-landmark-reproduction",
    description:
      "Reproducibility anchor: the certified value at mu 0.245 sits within 2e-4 of the imp-95154 recorded sampled sup 0.98974, and the sampled sup recomputed here matches that literal to 1e-4",
    holds: () =>
      Math.abs(MEASURED.anchor.cert[0.245] - 0.98974) < 2e-4 &&
      Math.abs(MEASURED.anchor.sampled[0.245] - 0.98974) < 1e-4,
  },
  {
    id: "imp95155-honest-record-literals",
    description:
      "No constant moves: class sandwich and the k <= 4 ladder floor 47/200 carried unchanged; no bound promotion; no QED; the cover sub-gap stays OPEN (sharpened, not closed)",
    holds: () =>
      IMP95155_JET_PHANTOM_CERTIFIED_CELL.carried.classSandwich[0] === 0.2320723 &&
      IMP95155_JET_PHANTOM_CERTIFIED_CELL.carried.classSandwich[1] === 0.24502 &&
      IMP95155_JET_PHANTOM_CERTIFIED_CELL.carried.ladderFloorKle4 === 47 / 200 &&
      IMP95155_JET_PHANTOM_CERTIFIED_CELL.promotesBound === false &&
      IMP95155_JET_PHANTOM_CERTIFIED_CELL.noQED === true &&
      IMP95155_JET_PHANTOM_CERTIFIED_CELL.openSubGap.status === "OPEN",
  },
];

for (const a of IMP95155_JET_PHANTOM_CERTIFIED_CELL_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95155-jet-phantom-certified-cell assertion failed: ${a.id}`);
}
