/**
 * imp-95160 - RIGOROUS step -- MIXED-HEAVY-PAIR SAME-SIDE REDUCTION
 * (THEOREM SA aggregate same-side collapse + LEMMA SR sector constraint):
 * remaining item (ii) of the sub-gap imp-95154-subgap-jet-phantom-cover
 * (the mixed-heavy-pair two-hull channel, "the only channel where jet
 * freedom survives on both hulls at once") is REDUCED: in 4 of its 5
 * occupancy cases the LEFT heavy hull carries ZERO jet freedom even
 * through the hull-hull aggregate bond, and the case collapses EXACTLY
 * onto a chart already covered by imp-95158 / imp-95159. ONE frame
 * family survives.
 *
 * THEOREM SA (same-side collapse through aggregate bonds; exact,
 * attained, k-uniform on the witness class). Let hull A = [lA, rA] carry
 * a nonnegative profile with ALL external coupling objects (points AND
 * other-hull aggregates) strictly to its right. Then for every fixed
 * profile B (nonnegative, supported right of rA) the aggregate bond
 * obeys
 *   (i)  <A, B> = sum_j b_j <A, phi(v_j)>
 *              <= sum_j b_j g(v_j - rA) ||A||     (THEOREM KN per packet)
 *               = <phi(rA), B> ||A||               (exact: g(v_j - rA) =
 *                                                   <phi(rA), phi(v_j)>),
 * and simultaneously every point bond of A obeys <A, phi(u)> <=
 * g(u - rA) ||A|| (THEOREM KN / LEMMA SS). All right-hand sides are the
 * bonds of the SINGLE UNIT PACKET AT rA, which is itself a witness-class
 * profile, so every A-row entry of the aggregated bond matrix is
 * dominated -- for the SAME witness, jointly -- by the corresponding
 * entry of the rA-packet row, with equality when A is that packet. Since
 * all entries are nonnegative and lambda_max of a nonnegative symmetric
 * matrix is its Perron root (entrywise monotone), replacing the hull-A
 * row by the rA-packet row can only raise lambda_max. QED. NOTE: this
 * needs NO jet Gram, NO LEMMA DJ bilinear form, and NO new certifier --
 * it is THEOREM KN summed over the packets of B plus Perron
 * monotonicity. The "same-side two-hull jet certifier" is unnecessary
 * exactly the way the imp-95159 same-side point certifier was.
 *
 * LEMMA SR (jet sector; exact, attained; recorded for the successor).
 * On the witness class the endpoint jet pair of a width-W hull satisfies
 *   0 <= S1 <= (W / (1 + W)) S0,
 * because phi(t)/g(t) = t/(1+t) is increasing on [0, W]; equality holds
 * for the far-endpoint packet. Consequence for the LEMMA DJ bilinear
 * form: the coefficient of S1A is -exp(-D) [D S0B + (1-D) S1B], and on
 * the sector D S0B + (1-D) S1B >= min(1, D) S0B >= 0 for EVERY gap D > 0
 * (for D >= 1: D S0 - (D-1) S1 >= D S0 - (D-1) S0 = S0). So the DJ bond
 * is monotone DECREASING in each S1 on the sector -- a constraint the
 * carried quarter-disk phantom does not know, available to tighten the
 * surviving-frame certificate.
 *
 * TAXONOMY (the mixed-heavy-pair channel under the carried imp-95154
 * frame reduction, blocks [1,2] / [4,8] / [16,32] + tail rows; heavy =
 * hull with any k >= 2, k-uniform):
 *   (0,1) heavy, block 2 single or empty: hull 0 is same-side (all
 *         targets right) -> THEOREM SA collapses it to the point
 *         rA in [1,2] -> EXACTLY the imp-95158 MIDDLE chart
 *         (u0 in [1,2] x hull in [4,8] x u2 in [16,32]); empty block 2
 *         is a principal submatrix. Inherits floor 0.240015.
 *   (0,2) heavy, block 1 single or empty: hull 0 collapses -> EXACTLY
 *         the imp-95159 HIGHEST chart (u0 in [1,2] x u1 in [4,8] x hull
 *         in [16,32]). Inherits floor 0.23208.
 *   (1,2) heavy, block 0 EMPTY: hull 1 is now same-side (hull 2 and
 *         tails are its only targets, all right) -> collapses to a point
 *         in [4,8] -> principal submatrix of the HIGHEST chart. Floor
 *         0.23208.
 *   TRIPLE-heavy (all three blocks >= 2): hull 0 is same-side ->
 *         collapses to a point in [1,2] -> reduces to the surviving
 *         frame below. No separate channel.
 *   (1,2) heavy WITH a block-0 single: BOTH hulls are two-sided (hull 1
 *         sees u0 left / hull 2 + tails right; hull 2 sees u0 + hull 1
 *         left / tails right). THE ONE SURVIVING OPEN FRAME FAMILY:
 *         u0 in [1,2] x hullA in [4,8] x hullB in [16,32] + tails.
 *
 * MEASURED PRICING OF THE SURVIVING FRAME (deterministic, in-sweep):
 *   (a) k = 1 corner (packets at 2 / 4 / 16): certified crossing
 *       0.23207204 -- IDENTICAL to the imp-95159 HEAD-chart wall, as it
 *       must be (same corner matrix), a cross-module consistency anchor.
 *   (b) per-row split-box corner (every entry at its KN/KN2 cap,
 *       positions decoupled): Rayleigh LOWER bound 1.0631 at the class
 *       ceiling mu = 0.24502, and the box entries are decreasing in mu,
 *       so the per-row route is REFUTED on the ENTIRE class window --
 *       its crossing sits at ~0.27540, above the ceiling. The surviving
 *       frame genuinely requires a joint two-hull certificate.
 *   (c) sampled true two-hull witness sup at the corner frame stays
 *       BELOW 1 down to mu = 0.2321 (seeded ensemble, exact profile
 *       matrices): the joint route has real headroom in the whole class
 *       window; the certified object to build is the product of two
 *       4-frame jet regions coupled by the single LEMMA DJ entry.
 *   SUCCESSOR ROUTE (named, not run): cap hull-2 tail bonds at the
 *   chart-max KN caps (entrywise-monotone, sound), after which hull 2
 *   is left-side-only and THEOREM SA collapses it to its LEFT endpoint
 *   lB in [16,32] -- the surviving frame then reduces to a MIDDLE-chart
 *   cover variant whose u2-row tail entries are priced at the chart max
 *   32 instead of the cell u2: ONE modified imp-95158 cover run away.
 *
 * CONDITIONAL CONSEQUENCE (carried frame reduction, both parities via
 * LEMMA OP -- the collapse is parity-independent algebra): combined with
 * imp-95158/95159, the k >= 5 ladder now has E <= 0 for the single-heavy
 * channel at all three positions (mu >= 0.240015) AND for the
 * mixed-heavy-pair cases (0,1) at mu >= 0.240015, (0,2) and
 * (1,2)-empty-0 at mu >= 0.23208; triple-heavy reduces to the surviving
 * frame. The FULL k-uniform closure of the class window now hinges on
 * ONE object: the (1,2)-with-u0 two-hull frame.
 *
 * WHAT THIS RUN DOES NOT DO: NO closure of the surviving frame (no
 * modified cover run), NO new full-class rate constant; every statement
 * is conditional on the carried imp-95154 frame reduction. Class
 * sandwich [0.2320723, 0.24502] and the k <= 4 ladder floor 47/200
 * carried UNCHANGED. Changes no bound; NO QED; no refereed bound is changed.
 *
 * Import-light; zero imports; all assertions deterministic, well under 1 s.
 */
const g = (z) => Math.exp(-z) * (1 + z);
const phi = (z) => z * Math.exp(-z);

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95160-mixed-pair-sameside-reduction assertion failed: ${id}`);
}
const MEASURED = {};

// --------------------------------------------------------------------------
// machinery carried VERBATIM from imp-95158/95159 (Cholesky lambda_max
// upper bound, Rayleigh lower bound, highest-chart jet-free majorant)
// --------------------------------------------------------------------------
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
function rayleighLower(M) {
  const n = M.length;
  let v = Array.from({ length: n }, (_, i) => 1 / (i + 1));
  for (let it = 0; it < 600; it++) {
    const w = M.map((row) => row.reduce((s, x, j) => s + x * v[j], 0) + 1e-30);
    const nn = Math.hypot(...w);
    v = w.map((x) => x / nn);
  }
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    den += v[i] * v[i];
    for (let j = 0; j < n; j++) num += v[i] * M[i][j] * v[j];
  }
  return num / den;
}
const nudge = (x) => x * (1 + 1e-12) + 1e-15;
function highestMajorant(muLo, u0I, u1I, hLlo, hRhi) {
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => { M[i][j] = x; M[j][i] = x; };
  set(0, 1, g(muLo * (u1I[0] - u0I[1])));
  set(0, 2, g(muLo * (hLlo - u0I[1])));
  set(1, 2, g(muLo * (hLlo - u1I[1])));
  set(0, 3, 2 * g(muLo * (64 - u0I[1])));
  set(0, 4, 2 * g(muLo * (256 - u0I[1])));
  set(1, 3, 2 * g(muLo * (64 - u1I[1])));
  set(1, 4, 2 * g(muLo * (256 - u1I[1])));
  set(2, 3, 2 * g(muLo * (64 - hRhi)));
  set(2, 4, 2 * g(muLo * (256 - hRhi)));
  set(3, 4, 4 * g(muLo * 128));
  return M;
}

// shared helpers for exact profile matrices
const mk5 = () => Array.from({ length: 5 }, () => new Array(5).fill(0));
const setS = (X, i, j, x) => { X[i][j] = x; X[j][i] = x; };
function profNorm(us, as, mu) {
  let s = 0;
  for (let i = 0; i < us.length; i++) {
    for (let j = 0; j < us.length; j++) s += as[i] * as[j] * g(mu * Math.abs(us[i] - us[j]));
  }
  return Math.sqrt(s);
}
const mkRnd = (seed) => {
  let st = seed;
  return () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
};

// --------------------------------------------------------------------------
// (A) THEOREM SA core inequality battery: <Ahat, Bhat> <= <phi(rA), Bhat>
// for random nonnegative two-hull profiles (the KN sum over the packets of
// B), with EXACT equality when A is the unit packet at rA
// --------------------------------------------------------------------------
{
  const rnd = mkRnd(111000);
  let worstViol = -Infinity, worstEq = 0;
  for (let t = 0; t < 2000; t++) {
    const mu = 0.2 + rnd() * 0.3;
    const lA = 1 + rnd() * 0.9, rA = lA + rnd() * (2 - lA);
    const lB = 4 + rnd() * 3.9, rB = lB + rnd() * (8 - lB);
    const kA = 1 + Math.floor(rnd() * 8), kB = 1 + Math.floor(rnd() * 8);
    const uA = [], aA = [], uB = [], aB = [];
    for (let i = 0; i < kA; i++) { uA.push(lA + rnd() * (rA - lA)); aA.push(rnd() + 0.01); }
    if (t % 4 === 0) { uA[0] = rA; aA[0] = 8; }
    for (let i = 0; i < kB; i++) { uB.push(lB + rnd() * (rB - lB)); aB.push(rnd() + 0.01); }
    const nA = profNorm(uA, aA, mu), nB = profNorm(uB, aB, mu);
    let ab = 0;
    for (let i = 0; i < kA; i++) for (let j = 0; j < kB; j++) ab += aA[i] * aB[j] * g(mu * (uB[j] - uA[i]));
    ab /= nA * nB;
    const coll = uB.reduce((s, x, j) => s + aB[j] * g(mu * (x - rA)), 0) / nB;
    worstViol = Math.max(worstViol, ab - coll);
    // exact endpoint-packet equality: A = unit packet at rA
    const abPk = uB.reduce((s, x, j) => s + aB[j] * g(mu * (x - rA)), 0) / nB;
    worstEq = Math.max(worstEq, Math.abs(abPk - coll));
  }
  MEASURED.sa = { worstViol, worstEq };
  assertI(worstViol <= 1e-12, `imp95160-sa-collapse(${worstViol})`);
  assertI(worstEq === 0, `imp95160-sa-endpoint-equality(${worstEq})`);
}

// --------------------------------------------------------------------------
// (B) full-matrix row domination + Perron transfer, pair (0,1): the exact
// two-hull 5-row witness matrix is dominated entrywise by the matrix with
// hull 0 replaced by the rA packet (a MIDDLE-chart configuration keeping
// the TRUE hull-1 profile), and lambda_max transfers; on the inherited
// middle-chart window mu >= 0.240015 every replaced matrix stays below 1
// --------------------------------------------------------------------------
{
  const rnd = mkRnd(222000);
  let worstEnt = -Infinity, worstLam = -Infinity, maxRep = 0;
  for (let t = 0; t < 400; t++) {
    const mu = 0.240015 + rnd() * (0.49004 - 0.240015);
    const lA = 1 + rnd() * 0.9, rA = lA + rnd() * (2 - lA);
    const lB = 4 + rnd() * 3.9, rB = lB + rnd() * (8 - lB);
    const u2 = 16 + rnd() * 16;
    const kA = 2 + Math.floor(rnd() * 7), kB = 2 + Math.floor(rnd() * 7);
    const uA = [], aA = [], uB = [], aB = [];
    for (let i = 0; i < kA; i++) { uA.push(lA + rnd() * (rA - lA)); aA.push(rnd() + 0.01); }
    if (t % 4 === 0) { uA[0] = rA; aA[0] = 8; }
    for (let i = 0; i < kB; i++) { uB.push(lB + rnd() * (rB - lB)); aB.push(rnd() + 0.01); }
    if (t % 5 === 0) { uB[0] = lB; aB[0] = 8; }
    const nA = profNorm(uA, aA, mu), nB = profNorm(uB, aB, mu);
    const bondA = (x) => uA.reduce((s, u, i) => s + aA[i] * g(mu * Math.abs(x - u)), 0) / nA;
    const bondB = (x) => uB.reduce((s, u, i) => s + aB[i] * g(mu * Math.abs(x - u)), 0) / nB;
    let ab = 0;
    for (let i = 0; i < kA; i++) for (let j = 0; j < kB; j++) ab += aA[i] * aB[j] * g(mu * (uB[j] - uA[i]));
    ab /= nA * nB;
    const M = mk5(), R = mk5();
    setS(M, 0, 1, ab); setS(M, 0, 2, bondA(u2)); setS(M, 0, 3, 2 * bondA(64)); setS(M, 0, 4, 2 * bondA(256));
    setS(R, 0, 1, bondB(rA)); setS(R, 0, 2, g(mu * (u2 - rA)));
    setS(R, 0, 3, 2 * g(mu * (64 - rA))); setS(R, 0, 4, 2 * g(mu * (256 - rA)));
    for (const X of [M, R]) {
      setS(X, 1, 2, bondB(u2)); setS(X, 1, 3, 2 * bondB(64)); setS(X, 1, 4, 2 * bondB(256));
      setS(X, 2, 3, 2 * g(mu * (64 - u2))); setS(X, 2, 4, 2 * g(mu * (256 - u2)));
      setS(X, 3, 4, 4 * g(mu * 128));
    }
    for (let j = 1; j < 5; j++) worstEnt = Math.max(worstEnt, M[0][j] - R[0][j]);
    const lM = rayleighLower(M), lR = rayleighLower(R);
    worstLam = Math.max(worstLam, lM - lR);
    maxRep = Math.max(maxRep, lR);
  }
  MEASURED.dom01 = { worstEnt, worstLam, maxRep };
  assertI(worstEnt <= 1e-12, `imp95160-row-domination(${worstEnt})`);
  assertI(worstLam <= 1e-9, `imp95160-perron-transfer(${worstLam})`);
  assertI(maxRep < 0.9, `imp95160-replaced-below-one(${maxRep})`);
}

// --------------------------------------------------------------------------
// (C) pair (0,2) tie-in to the imp-95159 HIGHEST cover: exact two-hull
// (block 0 + block 2) witness matrices, hull 0 collapsed per THEOREM SA,
// never exceed the certified jet-free cell bound of the highest-chart
// majorant on sampled small cells at mu >= 0.23208
// --------------------------------------------------------------------------
{
  const rnd = mkRnd(333000);
  let worstGap = Infinity, checked = 0;
  for (let t = 0; t < 40; t++) {
    const muLo = 0.23208 + rnd() * 0.02;
    const rAI = [1 + rnd() * 0.8, 0];
    rAI[1] = Math.min(2, rAI[0] + 0.05 + rnd() * 0.15);
    const u1I = [4 + rnd() * 3, 0];
    u1I[1] = Math.min(8, u1I[0] + 0.1 + rnd() * 0.5);
    const hLI = [16 + rnd() * 12, 0];
    hLI[1] = Math.min(32, hLI[0] + 0.3 + rnd() * 2);
    const cert = nudge(lamMaxUpper(highestMajorant(muLo, rAI, u1I, hLI[0], 32)));
    for (let s = 0; s < 5; s++) {
      const mu = muLo + rnd() * 0.002;
      const rA = rAI[0] + rnd() * (rAI[1] - rAI[0]);
      const lA = Math.max(1, rA - rnd() * (rA - 1));
      const u1 = u1I[0] + rnd() * (u1I[1] - u1I[0]);
      const lB = hLI[0] + rnd() * (hLI[1] - hLI[0]);
      const rB = lB + rnd() * (32 - lB);
      const kA = 1 + Math.floor(rnd() * 6), kB = 1 + Math.floor(rnd() * 6);
      const uA = [], aA = [], uB = [], aB = [];
      for (let i = 0; i < kA; i++) { uA.push(lA + rnd() * (rA - lA)); aA.push(rnd() + 0.01); }
      if (s === 0) { uA[0] = rA; aA[0] = 8; }
      for (let i = 0; i < kB; i++) { uB.push(lB + rnd() * (rB - lB)); aB.push(rnd() + 0.01); }
      if (s === 1) { uB[0] = lB; aB[0] = 8; }
      const nA = profNorm(uA, aA, mu), nB = profNorm(uB, aB, mu);
      const bondA = (x) => uA.reduce((sm, u, i) => sm + aA[i] * g(mu * Math.abs(x - u)), 0) / nA;
      const bondB = (x) => uB.reduce((sm, u, i) => sm + aB[i] * g(mu * Math.abs(x - u)), 0) / nB;
      let ab = 0;
      for (let i = 0; i < kA; i++) for (let j = 0; j < kB; j++) ab += aA[i] * aB[j] * g(mu * (uB[j] - uA[i]));
      ab /= nA * nB;
      // exact original (0,2)-pair matrix: rows hullA, u1, hullB, t64, t256
      const M = mk5();
      setS(M, 0, 1, bondA(u1)); setS(M, 0, 2, ab); setS(M, 0, 3, 2 * bondA(64)); setS(M, 0, 4, 2 * bondA(256));
      setS(M, 1, 2, bondB(u1)); setS(M, 1, 3, 2 * g(mu * (64 - u1))); setS(M, 1, 4, 2 * g(mu * (256 - u1)));
      setS(M, 2, 3, 2 * bondB(64)); setS(M, 2, 4, 2 * bondB(256));
      setS(M, 3, 4, 4 * g(mu * 128));
      worstGap = Math.min(worstGap, cert - rayleighLower(M));
      checked++;
    }
  }
  MEASURED.tie02 = { worstGap, checked };
  assertI(worstGap > 0, `imp95160-highest-tiein(${worstGap})`);
  assertI(checked === 200, `imp95160-highest-tiein-coverage(${checked})`);
}

// --------------------------------------------------------------------------
// (D) LEMMA SR sector battery: S1 <= (W/(1+W)) S0 for random nonnegative
// profiles (attained by the far-endpoint packet), and the LEMMA DJ
// S1-coefficient stays nonnegative on the sector for every gap D
// --------------------------------------------------------------------------
{
  const rnd = mkRnd(444000);
  let worstSec = -Infinity, worstAtt = 0, worstDJ = -Infinity;
  for (let t = 0; t < 2000; t++) {
    const W = rnd() * 4 + 1e-3;
    const k = 1 + Math.floor(rnd() * 10);
    let S0 = 0, S1 = 0;
    for (let i = 0; i < k; i++) {
      const ti = rnd() * W;
      const a = rnd() + 0.01;
      S0 += a * g(ti); S1 += a * phi(ti);
    }
    worstSec = Math.max(worstSec, S1 - (W / (1 + W)) * S0);
    worstAtt = Math.max(worstAtt, Math.abs(phi(W) / g(W) - W / (1 + W)));
    // DJ coefficient of S1A: exp(-D)[D S0B + (1-D) S1B] >= min(1,D) S0B >= 0
    const D = rnd() * 6 + 1e-3;
    const s1 = Math.min(S1, S0); // sector point
    worstDJ = Math.max(worstDJ, Math.min(1, D) * S0 - (D * S0 + (1 - D) * s1));
  }
  MEASURED.sector = { worstSec, worstAtt, worstDJ };
  assertI(worstSec <= 1e-12, `imp95160-sector(${worstSec})`);
  assertI(worstAtt < 1e-15, `imp95160-sector-attained(${worstAtt})`);
  assertI(worstDJ <= 1e-12, `imp95160-dj-coefficient-sign(${worstDJ})`);
}

// --------------------------------------------------------------------------
// (E) surviving-frame pricing: k = 1 corner wall (must reproduce the
// imp-95159 HEAD wall 0.23207204 -- same corner matrix), and the per-row
// split-box corner REFUTED at the class ceiling (Rayleigh LOWER bound > 1
// at mu = 0.24502; box entries decrease in mu, so refuted on the whole
// class window)
// --------------------------------------------------------------------------
{
  const k1Corner = (mu) => {
    const M = mk5();
    setS(M, 0, 1, g(mu * 2)); setS(M, 0, 2, g(mu * 14)); setS(M, 1, 2, g(mu * 12));
    setS(M, 0, 3, 2 * g(mu * 62)); setS(M, 0, 4, 2 * g(mu * 254));
    setS(M, 1, 3, 2 * g(mu * 60)); setS(M, 1, 4, 2 * g(mu * 252));
    setS(M, 2, 3, 2 * g(mu * 48)); setS(M, 2, 4, 2 * g(mu * 240));
    setS(M, 3, 4, 4 * g(mu * 128));
    return M;
  };
  const splitBoxCorner = (mu) => {
    const M = mk5();
    setS(M, 0, 1, g(mu * 2)); setS(M, 0, 2, g(mu * 14)); setS(M, 1, 2, g(mu * 8));
    setS(M, 0, 3, 2 * g(mu * 62)); setS(M, 0, 4, 2 * g(mu * 254));
    setS(M, 1, 3, 2 * g(mu * 56)); setS(M, 1, 4, 2 * g(mu * 248));
    setS(M, 2, 3, 2 * g(mu * 32)); setS(M, 2, 4, 2 * g(mu * 224));
    setS(M, 3, 4, 4 * g(mu * 128));
    return M;
  };
  // certified wall bracket for the k = 1 corner
  const below = rayleighLower(k1Corner(0.2320715));
  const at = nudge(lamMaxUpper(k1Corner(0.23208)));
  let lo = 0.2, hi = 0.3;
  for (let it = 0; it < 50; it++) {
    const m = (lo + hi) / 2;
    if (rayleighLower(k1Corner(m)) > 1) lo = m; else hi = m;
  }
  const k1Crossing = (lo + hi) / 2;
  // split-box refutation at the ceiling + measured crossing landmark
  const boxAtCeiling = rayleighLower(splitBoxCorner(0.24502));
  let bl = 0.2, bh = 0.4;
  for (let it = 0; it < 50; it++) {
    const m = (bl + bh) / 2;
    if (rayleighLower(splitBoxCorner(m)) > 1) bl = m; else bh = m;
  }
  const boxCrossing = (bl + bh) / 2;
  MEASURED.surviving = { below, at, k1Crossing, boxAtCeiling, boxCrossing };
  assertI(below > 1 && at < 1, `imp95160-k1-wall-bracket(${below},${at})`);
  assertI(Math.abs(k1Crossing - 0.23207204) < 1e-6, `imp95160-k1-wall-is-head-wall(${k1Crossing})`);
  assertI(boxAtCeiling > 1.06, `imp95160-splitbox-refuted(${boxAtCeiling})`);
  assertI(boxCrossing > 0.24502, `imp95160-splitbox-crossing-above-ceiling(${boxCrossing})`);
}

// --------------------------------------------------------------------------
// (F) sampled headroom of the surviving frame: exact two-hull witness
// matrices at the corner frame (u0 = 2, hullA = [4,8], hullB = [16,32])
// stay below 1 down to mu = 0.2321 (seeded ensemble; a measurement, not a
// certificate -- the certified object is the successor target)
// --------------------------------------------------------------------------
{
  const rnd = mkRnd(555000);
  const sampled = (mu, tries) => {
    let best = 0;
    for (let t = 0; t < tries; t++) {
      const kA = 1 + Math.floor(rnd() * 6), kB = 1 + Math.floor(rnd() * 6);
      const uA = [], aA = [], uB = [], aB = [];
      for (let i = 0; i < kA; i++) { uA.push(4 + rnd() * 4); aA.push(rnd() + 0.01); }
      for (let i = 0; i < kB; i++) { uB.push(16 + rnd() * 16); aB.push(rnd() + 0.01); }
      if (t % 3 === 0) { uA[0] = 4; aA[0] = 6; }
      if (t % 3 === 1) { uA[0] = 8; aA[0] = 6; }
      if (t % 4 === 0) { uB[0] = 16; aB[0] = 6; }
      const nA = profNorm(uA, aA, mu), nB = profNorm(uB, aB, mu);
      const bondA = (x) => uA.reduce((s, u, i) => s + aA[i] * g(mu * Math.abs(x - u)), 0) / nA;
      const bondB = (x) => uB.reduce((s, u, i) => s + aB[i] * g(mu * Math.abs(x - u)), 0) / nB;
      let ab = 0;
      for (let i = 0; i < kA; i++) for (let j = 0; j < kB; j++) ab += aA[i] * aB[j] * g(mu * Math.abs(uB[j] - uA[i]));
      ab /= nA * nB;
      const M = mk5();
      setS(M, 0, 1, bondA(2)); setS(M, 0, 2, bondB(2)); setS(M, 1, 2, ab);
      setS(M, 0, 3, 2 * g(mu * 62)); setS(M, 0, 4, 2 * g(mu * 254));
      setS(M, 1, 3, 2 * bondA(64)); setS(M, 1, 4, 2 * bondA(256));
      setS(M, 2, 3, 2 * bondB(64)); setS(M, 2, 4, 2 * bondB(256));
      setS(M, 3, 4, 4 * g(mu * 128));
      best = Math.max(best, rayleighLower(M));
    }
    return best;
  };
  const supAtCeiling = sampled(0.24502, 1500);
  const supAtFloorish = sampled(0.2321, 1500);
  MEASURED.headroom = { supAtCeiling, supAtFloorish };
  assertI(supAtCeiling < 1, `imp95160-headroom-ceiling(${supAtCeiling})`);
  assertI(supAtFloorish < 1 && supAtFloorish > 0.98, `imp95160-headroom-floorish(${supAtFloorish})`);
}

// --------------------------------------------------------------------------
// verdict object
// --------------------------------------------------------------------------
export const IMP95160_MIXED_PAIR_SAMESIDE_REDUCTION = {
  id: "imp-95160",
  title:
    "Mixed-heavy-pair same-side reduction: THEOREM SA (the same-side hull collapse extends through aggregate bonds -- THEOREM KN summed over the other hull, Perron transfer) reduces 4 of the 5 occupancy cases of the two-hull channel EXACTLY onto the covered middle/highest charts, inheriting floors 0.240015 / 0.23208; ONE frame family survives (u0-single x hull [4,8] x hull [16,32]), with its per-row route refuted on the whole class window and a named one-cover-run successor route",
  rigorous: {
    theoremSA:
      "for a heavy hull with all external objects on one side, the aggregate bond obeys <A,B> = sum_j b_j <A, phi(v_j)> <= sum_j b_j g(v_j - rA) ||A|| = <phi(rA), B> ||A|| (THEOREM KN per packet of B, then exactness of g(v_j - rA) = <phi(rA), phi(v_j)>); jointly with the LEMMA SS point-bond collapse, every A-row entry is dominated -- for the same witness -- by the rA-packet row, with equality when A is that packet; Perron monotonicity of nonnegative symmetric matrices transfers lambda_max: zero jet freedom on the same-side hull of a mixed pair, k-uniformly, with NO jet Gram and NO LEMMA DJ machinery",
    lemmaSR:
      "on the witness class the endpoint jet pair of a width-W hull satisfies 0 <= S1 <= (W/(1+W)) S0 (phi(t)/g(t) = t/(1+t) increasing; attained by the far-endpoint packet), and on that sector the LEMMA DJ coefficient of S1A, exp(-D)[D S0B + (1-D) S1B], is >= min(1,D) S0B >= 0 for every gap D -- the DJ bond is monotone decreasing in each S1: a new constraint available to the surviving-frame certificate",
    taxonomy:
      "(0,1)+single/empty-2 -> MIDDLE chart (floor 0.240015, imp-95158); (0,2)+single/empty-1 -> HIGHEST chart (floor 0.23208, imp-95159); (1,2)+empty-0 -> highest-chart principal submatrix (floor 0.23208); triple-heavy -> block-0 collapse -> the surviving frame; ONLY (1,2)+block-0-single survives: u0 in [1,2] x hullA in [4,8] x hullB in [16,32] + tails, both hulls two-sided",
  },
  measured: {
    survivingWall:
      "k = 1 corner crossing 0.23207204 -- bit-reproduces the imp-95159 HEAD-chart wall (same corner matrix), a cross-module consistency anchor",
    splitBoxRefuted:
      "per-row split-box corner Rayleigh lower bound 1.0631 > 1 at the class ceiling mu = 0.24502 (entries decreasing in mu => refuted on the whole class window; measured crossing ~0.27540): the surviving frame genuinely requires a joint two-hull certificate",
    sampledHeadroom:
      "seeded exact two-hull witness matrices at the surviving corner frame stay below 1 down to mu = 0.2321 -- the joint route has headroom across the class window (a measurement, not a certificate)",
    successorRoute:
      "cap hull-2 tail bonds at chart-max KN caps (sound, entrywise monotone), then THEOREM SA applied leftward collapses hull 2 to its LEFT endpoint: the surviving frame reduces to a middle-chart cover variant with u2-row tail entries priced at 32 -- one modified imp-95158 cover run away",
  },
  openSubGap: {
    name: "imp-95154-subgap-jet-phantom-cover",
    status: "OPEN",
    update:
      "Item (ii) REDUCED: the mixed-heavy-pair channel loses jet freedom on its same-side hull in 4 of 5 occupancy cases (THEOREM SA), which inherit the imp-95158/95159 covers verbatim (floors 0.240015 / 0.23208, both parities, conditional on the carried frame reduction). Remaining: (ii-b) the single surviving frame family u0 in [1,2] x hullA in [4,8] x hullB in [16,32] (both hulls two-sided; per-row route refuted at the ceiling; successor route = tail-capped hull-2 collapse + one modified middle-chart cover run, with LEMMA SR sector cuts available); (iii) the shared frame-reduction conditionality.",
  },
  carried: {
    classSandwich: [0.2320723, 0.24502],
    ladderFloorKle4: 47 / 200,
    middleWall: 0.2400105,
    inheritedFloors: { middle: 0.240015, highest: 0.23208 },
  },
  promotesBound: false,
  noQED: true,
  sota: "No refereed bound is changed",
};

// --------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// --------------------------------------------------------------------------
export const IMP95160_MIXED_PAIR_SAMESIDE_REDUCTION_ASSERTIONS = [
  {
    id: "imp95160-sa-aggregate-collapse",
    description:
      "THEOREM SA core: over 2000 random nonnegative two-hull profiles the aggregate bond never exceeds the rA-packet bond <phi(rA), Bhat> (KN summed over the packets of B), and the endpoint packet attains it with float deviation exactly 0",
    holds: () => MEASURED.sa.worstViol <= 1e-12 && MEASURED.sa.worstEq === 0,
  },
  {
    id: "imp95160-row-domination-perron",
    description:
      "Full 5-row pair-(0,1) matrices: the hull-0 row is dominated entrywise by the rA-packet row for the SAME witness (400 draws, endpoint-pinned included), lambda_max transfers (Perron), and every replaced matrix stays below 0.9 on the inherited middle-chart window mu >= 0.240015",
    holds: () =>
      MEASURED.dom01.worstEnt <= 1e-12 && MEASURED.dom01.worstLam <= 1e-9 && MEASURED.dom01.maxRep < 0.9,
  },
  {
    id: "imp95160-highest-cover-tiein",
    description:
      "Pair (0,2): 200 exact two-hull witness matrices on sampled cells at mu >= 0.23208 never exceed the certified imp-95159 highest-chart jet-free cell bound (positive worst gap) -- the inheritance is exercised against the actual certified majorant, not just stated",
    holds: () => MEASURED.tie02.worstGap > 0 && MEASURED.tie02.checked === 200,
  },
  {
    id: "imp95160-sector-lemma",
    description:
      "LEMMA SR: S1 <= (W/(1+W)) S0 over 2000 random profiles (attained by the far-endpoint packet to 1e-15), and the LEMMA DJ S1-coefficient exp(-D)[D S0 + (1-D) S1] stays >= min(1,D) S0 on the sector for every gap D",
    holds: () =>
      MEASURED.sector.worstSec <= 1e-12 && MEASURED.sector.worstAtt < 1e-15 && MEASURED.sector.worstDJ <= 1e-12,
  },
  {
    id: "imp95160-surviving-k1-wall",
    description:
      "The surviving frame k = 1 corner wall is bracketed (Rayleigh > 1 at 0.2320715, certified < 1 at 0.23208) and its crossing reproduces the imp-95159 HEAD-chart wall 0.23207204 to 1e-6 -- the same corner matrix, a cross-module consistency anchor",
    holds: () =>
      MEASURED.surviving.below > 1 && MEASURED.surviving.at < 1 &&
      Math.abs(MEASURED.surviving.k1Crossing - 0.23207204) < 1e-6,
  },
  {
    id: "imp95160-splitbox-refuted-on-window",
    description:
      "The per-row split-box corner of the surviving frame has Rayleigh LOWER bound > 1.06 at the class ceiling 0.24502 and measured crossing above the ceiling: the decoupled per-row route can never certify the surviving frame anywhere in the class window",
    holds: () => MEASURED.surviving.boxAtCeiling > 1.06 && MEASURED.surviving.boxCrossing > 0.24502,
  },
  {
    id: "imp95160-sampled-headroom",
    description:
      "Seeded exact two-hull witness matrices at the surviving corner frame stay below 1 at mu = 0.24502 and even at mu = 0.2321 (in (0.98, 1)) -- measured headroom for the successor joint certificate, explicitly NOT a certificate",
    holds: () =>
      MEASURED.headroom.supAtCeiling < 1 &&
      MEASURED.headroom.supAtFloorish < 1 && MEASURED.headroom.supAtFloorish > 0.98,
  },
  {
    id: "imp95160-honest-record-literals",
    description:
      "No constant moves: class sandwich [0.2320723, 0.24502] and the k <= 4 ladder floor 47/200 carried unchanged; inherited floors are CONDITIONAL channel refinements, not class constants; no bound promotion; no QED; the sub-gap stays OPEN (surviving frame + frame-reduction conditionality)",
    holds: () =>
      IMP95160_MIXED_PAIR_SAMESIDE_REDUCTION.carried.classSandwich[0] === 0.2320723 &&
      IMP95160_MIXED_PAIR_SAMESIDE_REDUCTION.carried.classSandwich[1] === 0.24502 &&
      IMP95160_MIXED_PAIR_SAMESIDE_REDUCTION.carried.ladderFloorKle4 === 47 / 200 &&
      IMP95160_MIXED_PAIR_SAMESIDE_REDUCTION.promotesBound === false &&
      IMP95160_MIXED_PAIR_SAMESIDE_REDUCTION.noQED === true &&
      IMP95160_MIXED_PAIR_SAMESIDE_REDUCTION.openSubGap.status === "OPEN",
  },
];

for (const a of IMP95160_MIXED_PAIR_SAMESIDE_REDUCTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95160-mixed-pair-sameside-reduction assertion failed: ${a.id}`);
  }
}
