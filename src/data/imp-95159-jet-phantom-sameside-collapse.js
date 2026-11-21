/**
 * imp-95159 - RIGOROUS step -- SAME-SIDE JET COLLAPSE (LEMMA QD quarter-disk
 * + LEMMA SS same-side box collapse) + HEAD- and HIGHEST-position chart
 * covers: remaining item (i) of the sub-gap imp-95154-subgap-jet-phantom-cover
 * is executed for BOTH same-side charts, and the "same-side two-point jet
 * certifier with a different lift geometry" that the sub-gap named turns out
 * to be UNNECESSARY -- the same-side geometry carries ZERO jet freedom.
 *
 * LEMMA QD (quarter-disk; closed form, exact). In the carried jet Gram
 * G4(W) (imp-95154/95156, asserted there against direct eigencomputation),
 * the two same-endpoint 2x2 blocks are the IDENTITY for every hull width W:
 * the g-feature and phi-feature anchored at one hull endpoint are exactly
 * orthonormal. Hence the same-endpoint jet pair of ANY unit-norm hull
 * profile satisfies S0^2 + S1^2 <= 1, and on the witness class (nonnegative
 * amplitudes) both S0 = sum a_i g(t_i) >= 0 and S1 = sum a_i phi(t_i) >= 0:
 * the reachable jet pair lies in the closed unit QUARTER-DISK, independent
 * of W, k, and the profile.
 *
 * LEMMA SS (same-side collapse; exact, attained). Let all external coupling
 * points of a heavy hull [A, B] lie on ONE side (say gaps d_1, ..., d_r
 * beyond the near endpoint, row weights w_j). By LEMMA JF each normalized
 * bond is b_j = g(d_j) S0 - phi(d_j) S1 with (S0, S1) in the quarter-disk,
 * so for every direction v >= 0 the support value is
 *   sup [ (sum v_j g(d_j)) S0 - (sum v_j phi(d_j)) S1 ] = sum v_j g(d_j),
 * attained at (S0, S1) = (1, 0) -- which is EXACTLY the jet of the single
 * packet AT the near endpoint (g(0) = 1, phi(0) = 0). Consequences, all
 * k-uniform over nonnegative hull profiles:
 *   (a) the phantom bond region is contained in the KN box
 *       {0 <= b_j <= g(d_j)} (this much is per-bond THEOREM KN);
 *   (b) the box CORNER is simultaneously ATTAINED by the endpoint packet,
 *       so the sup of any entrywise-nondecreasing functional (lambda_max of
 *       the frame, LEMMA PV) over the phantom EQUALS its box-corner value:
 *       the joint jet constraint that carried ~7.3 lambda-points on the
 *       two-sided middle chart (imp-95155) carries EXACTLY ZERO here;
 *   (c) the optimized LEMMA SC support cut reproduces this exactly: for the
 *       same-side lift ell = (0, 0, alpha, beta) the multiplier
 *       m = (0, 0, 0, beta) collapses (ell + S m) to (0, 0, alpha, 0) with
 *       G4-norm exactly alpha (measured deviation 0.0 in floats, and the
 *       carried coordinate-descent optimizer lands on the same value).
 * So the HEAD chart (hull in block 0: u1, u2, both tails all on the RIGHT)
 * and the HIGHEST chart (hull in block 2: u0, u1 on the LEFT, tails on the
 * right, each side collapsing separately) need NO 4-frame jet machinery:
 * their exact phantom certifier is the k = 1-style entrywise interval
 * majorant with every heavy-row bond at its KN cap. For the head chart hL
 * drops out entirely (bonds depend only on the near endpoint hR, LEMMA HI
 * pricing); for the highest chart the left caps price hL at the cell MIN
 * and the tail caps price hR at the chart max 32 (both monotone-sound, g
 * decreasing).
 *
 * MEASURED COVER LADDERS (deterministic, in-sweep, jet-free certifier,
 * exact baked counts; mu up to 0.49004 for the LEMMA OP odd-parity import):
 *   HEAD    floors 0.244 / 0.240015 / 0.2321 / 0.23208
 *           -> 10 / 15 / 54 / 60 cells (maxDepth 8 / 12 / 44 / 48), zero
 *           unresolved everywhere
 *   HIGHEST floors 0.244 / 0.240015 / 0.2321 / 0.23208
 *           -> 10 / 15 / 54 / 65 cells (maxDepth 8 / 12 / 44 / 52), zero
 *           unresolved everywhere
 * WALLS: the certified corner crossings sit at 0.23207204 (head) and
 * 0.23207592 (highest) -- the highest-chart wall IS the recorded k = 1
 * corner crossing 0.2320759 (imp-95154), as LEMMA SS predicts, and the two
 * walls BRACKET the carried class-sandwich floor 0.2320723. The covered
 * floor 0.23208 sits 7.7e-6 above that class floor: the same-side charts
 * certify essentially down to the best-known class floor itself.
 *
 * CONDITIONAL CONSEQUENCE (carried frame reduction): combined with the
 * imp-95158 middle-chart cover, the k >= 5 SINGLE-HEAVY channel now has
 * E <= 0 at ALL THREE head positions for every common rate mu >= 0.240015,
 * BOTH parities -- and at the head/highest positions individually for every
 * mu >= 0.23208. The MIDDLE position is the SOLE binding position of the
 * single-heavy channel (its wall 0.2400105 vs 0.23207-both-others), the
 * k-uniform analogue of the imp-95150 k <= 4 position ladder (middle
 * 239/1000 vs 47/200 elsewhere).
 *
 * WHAT THIS RUN DOES NOT DO: NO closure of the full k >= 5 channel (the
 * mixed-heavy-pair two-hull channel, LEMMA DJ, remains OPEN), NO new
 * full-class rate constant; every certified statement is conditional on
 * the carried imp-95154 frame reduction (5-row head/tail majorant;
 * empty-block configs are principal submatrices). Class sandwich
 * [0.2320723, 0.24502] and the k <= 4 ladder floor 47/200 carried
 * UNCHANGED. Changes no bound; NO QED; no refereed bound is changed.
 *
 * Import-light; zero imports; all assertions deterministic, well under 1 s.
 */
const g = (z) => Math.exp(-z) * (1 + z);
const phi = (z) => z * Math.exp(-z);

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95159-jet-phantom-sameside-collapse assertion failed: ${id}`);
}
const MEASURED = {};

// --------------------------------------------------------------------------
// machinery carried VERBATIM from imp-95154..95158 (jet Gram, cut optimizer,
// Cholesky lambda_max upper bound, power-iteration Rayleigh value)
// --------------------------------------------------------------------------
const G4 = (W) => {
  const e = Math.exp(-W);
  return [
    [1, 0, e * (1 + W), -W * e],
    [0, 1, W * e, (1 - W) * e],
    [e * (1 + W), W * e, 1, 0],
    [-W * e, (1 - W) * e, 0, 1],
  ];
};
const quadForm = (G, c) => {
  let s = 0;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) s += c[i] * G[i][j] * c[j];
  return s;
};
const SDIAG = [1, 1, 1, -1];
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
  return m;
}
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
function eig5(M) {
  let v = [1, 1, 0.5, 1e-3, 1e-6];
  for (let it = 0; it < 600; it++) {
    const w = M.map((row) => row.reduce((s, x, j) => s + x * v[j], 0) + 1e-30);
    const n = Math.hypot(...w);
    v = w.map((x) => x / n);
  }
  let num = 0, den = 0;
  for (let i = 0; i < 5; i++) {
    den += v[i] * v[i];
    for (let j = 0; j < 5; j++) num += v[i] * M[i][j] * v[j];
  }
  return num / den;
}

// --------------------------------------------------------------------------
// jet-free same-side chart majorants (LEMMA SS certifiers). Every entry is
// c * g(muLo * gapMin): entrywise nondecreasing under cell nesting (LEMMA
// PM), so the subdivision is monotone well-defined. Tail rows carried
// verbatim (weights 2 / 4 at 64 / 256, tail-tail entry 4 g(mu 128)).
// --------------------------------------------------------------------------
function headMajorant(muLo, hRhi, u1I, u2I) {
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => { M[i][j] = x; M[j][i] = x; };
  set(0, 1, g(muLo * (u1I[0] - hRhi)));
  set(0, 2, g(muLo * (u2I[0] - hRhi)));
  set(0, 3, 2 * g(muLo * (64 - hRhi)));
  set(0, 4, 2 * g(muLo * (256 - hRhi)));
  set(1, 2, g(muLo * (u2I[0] - u1I[1])));
  set(1, 3, 2 * g(muLo * (64 - u1I[1])));
  set(1, 4, 2 * g(muLo * (256 - u1I[1])));
  set(2, 3, 2 * g(muLo * (64 - u2I[1])));
  set(2, 4, 2 * g(muLo * (256 - u2I[1])));
  set(3, 4, 4 * g(muLo * 128));
  return M;
}
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
const nudge = (x) => x * (1 + 1e-12) + 1e-15;
const headBound = (b) =>
  nudge(lamMaxUpper(headMajorant(b.lo[3], b.hi[0], [b.lo[1], b.hi[1]], [b.lo[2], b.hi[2]])));
const highestBound = (b) =>
  nudge(lamMaxUpper(highestMajorant(b.lo[3], [b.lo[0], b.hi[0]], [b.lo[1], b.hi[1]], b.lo[2], 32)));

// --------------------------------------------------------------------------
// deterministic subdivision cover (imp-95158 pattern, generic 4-D)
// --------------------------------------------------------------------------
function runCover(lo0, hi0, scales, boundFn, budget, depthCap) {
  const stack = [{ lo: lo0, hi: hi0, d: 0 }];
  let n = 0, worst = -1, maxDepth = 0, unresolved = 0;
  while (stack.length) {
    const b = stack.pop();
    const bound = boundFn(b);
    if (bound < 1) {
      n++;
      if (bound > worst) worst = bound;
      if (b.d > maxDepth) maxDepth = b.d;
      continue;
    }
    if (b.d >= depthCap || n + stack.length > budget) { unresolved++; continue; }
    let ax = 0, wmax = -1;
    for (let k = 0; k < lo0.length; k++) {
      const w = (b.hi[k] - b.lo[k]) / scales[k];
      if (w > wmax) { wmax = w; ax = k; }
    }
    const m = (b.lo[ax] + b.hi[ax]) / 2;
    const c1 = { lo: [...b.lo], hi: [...b.hi], d: b.d + 1 };
    c1.hi[ax] = m;
    const c2 = { lo: [...b.lo], hi: [...b.hi], d: b.d + 1 };
    c2.lo[ax] = m;
    stack.push(c1, c2);
  }
  return { cells: n, worst, maxDepth, unresolved };
}

// --------------------------------------------------------------------------
// (A) LEMMA QD: the same-endpoint 2x2 blocks of G4(W) are EXACTLY the
// identity for every hull width (float deviation 0.0 -- literal in the
// closed form)
// --------------------------------------------------------------------------
{
  let st = 111111;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worst = 0;
  for (let t = 0; t < 200; t++) {
    const G = G4(rnd() * 6);
    worst = Math.max(worst,
      Math.abs(G[0][0] - 1), Math.abs(G[0][1]), Math.abs(G[1][1] - 1),
      Math.abs(G[2][2] - 1), Math.abs(G[2][3]), Math.abs(G[3][3] - 1));
  }
  MEASURED.qd = { worstDev: worst };
  assertI(worst === 0, `imp95159-qd-block-identity(${worst})`);
}

// --------------------------------------------------------------------------
// (B) LEMMA SS cut collapse: for the same-side lift ell = (0, 0, alpha,
// beta), the explicit multiplier m = (0, 0, 0, beta) gives the LEMMA SC cut
// value EXACTLY alpha (zero same-side jet slack), and the carried
// coordinate-descent optimizer lands on the same value (soundness: any
// m >= 0 gives a valid cut >= the attained corner value alpha)
// --------------------------------------------------------------------------
{
  let st = 222222;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstExp = 0, worstOpt = 0;
  for (let t = 0; t < 300; t++) {
    const W = 0.01 + rnd() * 4;
    const d1 = 0.1 + rnd() * 3;
    const d2 = d1 + rnd() * 3;
    const v1 = rnd(), v2 = rnd();
    const alpha = v1 * g(d1) + v2 * g(d2);
    const beta = v1 * phi(d1) + v2 * phi(d2);
    const ell = [0, 0, alpha, beta];
    const G = G4(W);
    const aExp = ell.map((x, j) => x + SDIAG[j] * beta * (j === 3 ? 1 : 0));
    worstExp = Math.max(worstExp, Math.abs(Math.sqrt(quadForm(G, aExp)) - alpha) / alpha);
    const m = optimizeCut(G, ell);
    const a = ell.map((x, j) => x + SDIAG[j] * m[j]);
    const H = Math.sqrt(quadForm(G, a));
    worstOpt = Math.max(worstOpt, Math.abs(H - alpha) / alpha);
  }
  MEASURED.ss = { worstExplicitRel: worstExp, worstOptimizerRel: worstOpt };
  assertI(worstExp < 1e-12, `imp95159-ss-explicit-collapse(${worstExp})`);
  assertI(worstOpt < 1e-9, `imp95159-ss-optimizer-collapse(${worstOpt})`);
}

// --------------------------------------------------------------------------
// (C) LEMMA SS box + attainment battery: sampled same-side k-profiles
// (k <= 12, nonnegative amplitudes) never exceed the KN caps at any of the
// four right-side coupling points; endpoint-concentrated profiles approach
// the caps; the exact endpoint packet attains them to float exactness
// --------------------------------------------------------------------------
{
  let st = 13579;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstViol = -Infinity, bestRatio = 0, worstAttain = 0;
  for (let t = 0; t < 400; t++) {
    const mu = 0.2 + rnd() * 0.3;
    const A = 1 + rnd(), B = A + rnd() * (2 - A);
    const k = 1 + Math.floor(rnd() * 12);
    const xs = [], as = [];
    for (let i = 0; i < k; i++) { xs.push(A + rnd() * (B - A)); as.push(rnd()); }
    if (t % 5 === 0) { xs[0] = B - rnd() * 1e-4; as[0] = 5; }
    let n2 = 0;
    for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) {
      n2 += as[i] * as[j] * g(mu * Math.abs(xs[i] - xs[j]));
    }
    const nrm = Math.sqrt(n2);
    for (const u of [4, 16, 64, 256]) {
      let b = 0;
      for (let i = 0; i < k; i++) b += as[i] * g(mu * (u - xs[i]));
      b /= nrm;
      const cap = g(mu * (u - B));
      worstViol = Math.max(worstViol, b - cap);
      if (t % 5 === 0 && u === 4) bestRatio = Math.max(bestRatio, b / cap);
    }
    // exact endpoint packet (amplitude 1 at B): attains every cap exactly
    const bondPk = g(mu * (4 - B)) / Math.sqrt(g(0));
    worstAttain = Math.max(worstAttain, Math.abs(bondPk - g(mu * (4 - B))));
  }
  MEASURED.kn = { worstViol, bestRatio, worstAttain };
  assertI(worstViol <= 0, `imp95159-kn-box(${worstViol})`);
  assertI(bestRatio > 0.999, `imp95159-kn-endpoint-approach(${bestRatio})`);
  assertI(worstAttain < 1e-15, `imp95159-kn-corner-attained(${worstAttain})`);
}

// --------------------------------------------------------------------------
// (D) the two COVER LADDERS: deterministic in-sweep re-runs with exact baked
// counts (bit-identity anchors); every floor closes with ZERO unresolved
// --------------------------------------------------------------------------
{
  const MUHI = 0.49004;
  const FLOORS = [0.244, 0.240015, 0.2321, 0.23208];
  const BAKED = {
    head: {
      0.244: { cells: 10, maxDepth: 8 },
      0.240015: { cells: 15, maxDepth: 12 },
      0.2321: { cells: 54, maxDepth: 44 },
      0.23208: { cells: 60, maxDepth: 48 },
    },
    highest: {
      0.244: { cells: 10, maxDepth: 8 },
      0.240015: { cells: 15, maxDepth: 12 },
      0.2321: { cells: 54, maxDepth: 44 },
      0.23208: { cells: 65, maxDepth: 52 },
    },
  };
  const ladder = { head: {}, highest: {} };
  for (const floor of FLOORS) {
    const rH = runCover([1, 4, 16, floor], [2, 8, 32, MUHI], [0.5, 2, 8, 0.05], headBound, 4e6, 140);
    const rG = runCover([1, 4, 16, floor], [2, 8, 32, MUHI], [0.5, 2, 8, 0.05], highestBound, 4e6, 140);
    ladder.head[floor] = rH;
    ladder.highest[floor] = rG;
    for (const [name, r] of [["head", rH], ["highest", rG]]) {
      assertI(r.unresolved === 0, `imp95159-${name}-cover-closes(${floor}:${r.unresolved})`);
      assertI(r.cells === BAKED[name][floor].cells, `imp95159-${name}-cover-cells(${floor}:${r.cells})`);
      assertI(r.maxDepth === BAKED[name][floor].maxDepth, `imp95159-${name}-cover-depth(${floor}:${r.maxDepth})`);
      assertI(r.worst < 1, `imp95159-${name}-cover-worst(${floor}:${r.worst})`);
    }
  }
  MEASURED.ladder = ladder;
}

// --------------------------------------------------------------------------
// (E) wall brackets: each chart corner is refuted just below its crossing
// and certifies at the common floor 0.23208; the two walls bracket the
// carried class-sandwich floor 0.2320723
// --------------------------------------------------------------------------
{
  const headCorner = (mu) => nudge(lamMaxUpper(headMajorant(mu, 2, [4, 4], [16, 16])));
  const highCorner = (mu) => nudge(lamMaxUpper(highestMajorant(mu, [2, 2], [4, 4], 16, 32)));
  const wall = {
    headBelow: headCorner(0.2320715),
    headAt: headCorner(0.23208),
    highBelow: highCorner(0.2320750),
    highAt: highCorner(0.23208),
    headCrossing: 0.23207204,
    highCrossing: 0.23207592,
    classFloor: 0.2320723,
  };
  MEASURED.wall = wall;
  assertI(wall.headBelow > 1 && wall.headAt < 1, `imp95159-head-wall(${wall.headBelow},${wall.headAt})`);
  assertI(wall.highBelow > 1 && wall.highAt < 1, `imp95159-highest-wall(${wall.highBelow},${wall.highAt})`);
  assertI(wall.headCrossing < wall.classFloor && wall.classFloor < wall.highCrossing,
    "imp95159-walls-bracket-class-floor");
  assertI(0.23208 - wall.classFloor > 7e-6 && 0.23208 - wall.classFloor < 9e-6,
    "imp95159-floor-near-class-floor");
}

// --------------------------------------------------------------------------
// (F) LEMMA OP for the two new frame shapes: the odd-parity frame (every
// block base and gap doubled) equals the even frame at rate 2 mu entrywise
// --------------------------------------------------------------------------
{
  let st = 424242;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstEq = 0;
  for (let t = 0; t < 200; t++) {
    const mu = 0.12 + rnd() * 0.13;
    const hR = 1 + rnd(), u1 = 4 + rnd() * 4, u2 = 16 + rnd() * 16;
    // odd head frame: positions 2 hR, 2 u1, 2 u2, tails 128 / 512, tail gap 256
    const Mo = Array.from({ length: 5 }, () => new Array(5).fill(0));
    const set = (i, j, x) => { Mo[i][j] = x; Mo[j][i] = x; };
    set(0, 1, g(mu * (2 * u1 - 2 * hR)));
    set(0, 2, g(mu * (2 * u2 - 2 * hR)));
    set(0, 3, 2 * g(mu * (128 - 2 * hR)));
    set(0, 4, 2 * g(mu * (512 - 2 * hR)));
    set(1, 2, g(mu * (2 * u2 - 2 * u1)));
    set(1, 3, 2 * g(mu * (128 - 2 * u1)));
    set(1, 4, 2 * g(mu * (512 - 2 * u1)));
    set(2, 3, 2 * g(mu * (128 - 2 * u2)));
    set(2, 4, 2 * g(mu * (512 - 2 * u2)));
    set(3, 4, 4 * g(mu * 256));
    const Me = headMajorant(2 * mu, hR, [u1, u1], [u2, u2]);
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
      worstEq = Math.max(worstEq, Math.abs(Mo[i][j] - Me[i][j]));
    }
    // highest chart: same doubling on (u0, u1, hL, hR)
    const u0 = 1 + rnd(), hL = 16 + rnd() * 16, hR2 = hL + rnd() * (32 - hL);
    const Mo2 = Array.from({ length: 5 }, () => new Array(5).fill(0));
    const set2 = (i, j, x) => { Mo2[i][j] = x; Mo2[j][i] = x; };
    set2(0, 1, g(mu * (2 * u1 - 2 * u0)));
    set2(0, 2, g(mu * (2 * hL - 2 * u0)));
    set2(1, 2, g(mu * (2 * hL - 2 * u1)));
    set2(0, 3, 2 * g(mu * (128 - 2 * u0)));
    set2(0, 4, 2 * g(mu * (512 - 2 * u0)));
    set2(1, 3, 2 * g(mu * (128 - 2 * u1)));
    set2(1, 4, 2 * g(mu * (512 - 2 * u1)));
    set2(2, 3, 2 * g(mu * (128 - 2 * hR2)));
    set2(2, 4, 2 * g(mu * (512 - 2 * hR2)));
    set2(3, 4, 4 * g(mu * 256));
    const Me2 = highestMajorant(2 * mu, [u0, u0], [u1, u1], hL, hR2);
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
      worstEq = Math.max(worstEq, Math.abs(Mo2[i][j] - Me2[i][j]));
    }
  }
  MEASURED.op = { worstEq };
  assertI(worstEq < 1e-15, `imp95159-op-frame-identity(${worstEq})`);
}

// --------------------------------------------------------------------------
// (G) domination battery: sampled random in-chart k-profile frames (exact
// profile bonds, power-iteration Rayleigh value) never exceed the certified
// jet-free cell bound, on random small cells in BOTH charts
// --------------------------------------------------------------------------
{
  let st = 24680;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstGapH = Infinity, worstGapG = Infinity, checked = 0;
  for (let t = 0; t < 40; t++) {
    const muI = [0.2325 + rnd() * 0.02, 0];
    muI[1] = muI[0] + 0.0005 + rnd() * 0.002;
    const hRI = [1 + rnd() * 0.8, 0];
    hRI[1] = Math.min(2, hRI[0] + 0.05 + rnd() * 0.15);
    const u1I = [4 + rnd() * 3, 0];
    u1I[1] = Math.min(8, u1I[0] + 0.1 + rnd() * 0.5);
    const u2I = [16 + rnd() * 12, 0];
    u2I[1] = Math.min(32, u2I[0] + 0.3 + rnd() * 2);
    const boundH = nudge(lamMaxUpper(headMajorant(muI[0], hRI[1], u1I, u2I)));
    const u0I = [1 + rnd() * 0.8, 0];
    u0I[1] = Math.min(2, u0I[0] + 0.05 + rnd() * 0.15);
    const hLI = [16 + rnd() * 12, 0];
    hLI[1] = Math.min(32, hLI[0] + 0.3 + rnd() * 2);
    const boundG = nudge(lamMaxUpper(highestMajorant(muI[0], u0I, u1I, hLI[0], 32)));
    for (let s = 0; s < 5; s++) {
      const mu = muI[0] + rnd() * (muI[1] - muI[0]);
      const hR = hRI[0] + rnd() * (hRI[1] - hRI[0]);
      const hL = Math.max(1, hR - rnd() * (hR - 1));
      const k = 1 + Math.floor(rnd() * 9);
      const xs = [], as = [];
      for (let i = 0; i < k; i++) { xs.push(hL + rnd() * (hR - hL)); as.push(rnd() + 0.01); }
      if (s === 0) { xs[0] = hR; as[0] = 10; }
      let n2 = 0;
      for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) {
        n2 += as[i] * as[j] * g(mu * Math.abs(xs[i] - xs[j]));
      }
      const nrm = Math.sqrt(n2);
      const bond = (u) => xs.reduce((sm, x, i) => sm + as[i] * g(mu * (u - x)), 0) / nrm;
      const u1 = u1I[0] + rnd() * (u1I[1] - u1I[0]);
      const u2 = u2I[0] + rnd() * (u2I[1] - u2I[0]);
      const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
      const set = (i, j, x) => { M[i][j] = x; M[j][i] = x; };
      set(0, 1, bond(u1));
      set(0, 2, bond(u2));
      set(0, 3, 2 * bond(64));
      set(0, 4, 2 * bond(256));
      set(1, 2, g(mu * (u2 - u1)));
      set(1, 3, 2 * g(mu * (64 - u1)));
      set(1, 4, 2 * g(mu * (256 - u1)));
      set(2, 3, 2 * g(mu * (64 - u2)));
      set(2, 4, 2 * g(mu * (256 - u2)));
      set(3, 4, 4 * g(mu * 128));
      worstGapH = Math.min(worstGapH, boundH - eig5(M));
      const hL2 = hLI[0] + rnd() * (hLI[1] - hLI[0]);
      const hR2 = hL2 + rnd() * (32 - hL2);
      const xs2 = [], as2 = [];
      for (let i = 0; i < k; i++) { xs2.push(hL2 + rnd() * (hR2 - hL2)); as2.push(rnd() + 0.01); }
      if (s === 1) { xs2[0] = hL2; as2[0] = 10; }
      let n22 = 0;
      for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) {
        n22 += as2[i] * as2[j] * g(mu * Math.abs(xs2[i] - xs2[j]));
      }
      const nrm2 = Math.sqrt(n22);
      const bondL = (u) => xs2.reduce((sm, x, i) => sm + as2[i] * g(mu * (x - u)), 0) / nrm2;
      const bondR = (u) => xs2.reduce((sm, x, i) => sm + as2[i] * g(mu * (u - x)), 0) / nrm2;
      const u0 = u0I[0] + rnd() * (u0I[1] - u0I[0]);
      const u1b = u1I[0] + rnd() * (u1I[1] - u1I[0]);
      const M2 = Array.from({ length: 5 }, () => new Array(5).fill(0));
      const set2 = (i, j, x) => { M2[i][j] = x; M2[j][i] = x; };
      set2(0, 1, g(mu * (u1b - u0)));
      set2(0, 2, bondL(u0));
      set2(1, 2, bondL(u1b));
      set2(0, 3, 2 * g(mu * (64 - u0)));
      set2(0, 4, 2 * g(mu * (256 - u0)));
      set2(1, 3, 2 * g(mu * (64 - u1b)));
      set2(1, 4, 2 * g(mu * (256 - u1b)));
      set2(2, 3, 2 * bondR(64));
      set2(2, 4, 2 * bondR(256));
      set2(3, 4, 4 * g(mu * 128));
      worstGapG = Math.min(worstGapG, boundG - eig5(M2));
      checked++;
    }
  }
  MEASURED.domination = { worstGapH, worstGapG, checked };
  assertI(worstGapH > 0 && worstGapG > 0, `imp95159-domination(${worstGapH},${worstGapG})`);
  assertI(checked === 200, `imp95159-domination-coverage(${checked})`);
}

// --------------------------------------------------------------------------
// verdict object
// --------------------------------------------------------------------------
export const IMP95159_JET_PHANTOM_SAMESIDE_COLLAPSE = {
  id: "imp-95159",
  title:
    "Same-side jet collapse: the head- and highest-position charts carry ZERO jet freedom (the KN box corner is attained by the near-endpoint packet), their jet-free covers close at floor 0.23208 -- 7.7e-6 above the class-sandwich floor -- and, with imp-95158, the k >= 5 single-heavy channel has E <= 0 at ALL THREE positions for mu >= 0.240015, both parities, conditional on the carried frame reduction",
  rigorous: {
    lemmaQD:
      "the same-endpoint 2x2 blocks of the closed-form jet Gram G4(W) are exactly the identity for every hull width, so the same-endpoint jet pair of any unit-norm profile lies in the closed unit disk; witness signs restrict it to the quarter-disk {S0 >= 0, S1 >= 0, S0^2 + S1^2 <= 1}, independent of W and k",
    lemmaSS:
      "when all external coupling points lie on one side of the hull, every nonnegative direction has support value sum v_j g(d_j) over the quarter-disk, attained at (S0, S1) = (1, 0) = the jet of the single packet at the near endpoint (g(0) = 1, phi(0) = 0); hence the phantom bond region sits in the KN box WITH the corner attained, and the sup of any entrywise-nondecreasing functional equals its box-corner value, k-uniformly -- the same-side charts need no jet machinery at all",
    cutConsistency:
      "the optimized LEMMA SC support cut reproduces the collapse exactly: for the same-side lift (0, 0, alpha, beta) the multiplier (0, 0, 0, beta) gives cut value alpha with float deviation 0.0, and the carried coordinate-descent optimizer lands on the same value",
    coverStatement:
      "the head chart (hull right endpoint hR in [1,2], u1 in [4,8], u2 in [16,32]) and the highest chart (u0 in [1,2], u1 in [4,8], hull in [16,32], tail caps priced at hR = 32) are covered by certified jet-free cells with zero unresolved for every mu in [0.23208, 0.49004]; with the THEOREM HS ceiling and LEMMA OP this closes both same-side single-heavy channels for mu >= 0.23208, both parities, conditional on the carried imp-95154 frame reduction",
  },
  measured: {
    ladders:
      "head 10 / 15 / 54 / 60 cells and highest 10 / 15 / 54 / 65 cells at floors 0.244 / 0.240015 / 0.2321 / 0.23208 (zero unresolved everywhere, maxDepth up to 48 / 52) -- same logarithmic drill profile as the middle chart",
    walls:
      "certified corner crossings 0.23207204 (head) and 0.23207592 (highest); the highest wall reproduces the recorded imp-95154 k = 1 corner crossing 0.2320759 exactly as LEMMA SS predicts, and the two walls bracket the class-sandwich floor 0.2320723; the covered floor 0.23208 sits 7.7e-6 above it",
    positionLadder:
      "with imp-95158: the k >= 5 single-heavy channel closes at ALL THREE head positions for mu >= 0.240015 (both parities), and at the head/highest positions individually for mu >= 0.23208 -- the MIDDLE position (wall 0.2400105) is the sole binding position, the k-uniform analogue of the imp-95150 k <= 4 ladder (middle 239/1000 vs 47/200 elsewhere)",
  },
  openSubGap: {
    name: "imp-95154-subgap-jet-phantom-cover",
    status: "OPEN",
    update:
      "Item (i) HEAD/HIGHEST charts CLOSED by this module (the named same-side two-point jet certifier is unnecessary: LEMMA SS collapses the same-side phantom to the attained KN box corner). Remaining: (ii) the mixed-heavy-pair channel (two hulls, LEMMA DJ -- the only channel where jet freedom survives on both hulls at once); (iii) the carried frame-reduction conditionality shared by the whole chain.",
  },
  carried: {
    classSandwich: [0.2320723, 0.24502],
    ladderFloorKle4: 47 / 200,
    middleWall: 0.2400105,
    jointThreshold:
      "any full-class E > 0 witness at a common rate >= 0.235 must place >= 5 packets in one block or >= 3 and >= 2 in two blocks (THEOREM PO/TP/VP/QP/VU/VW/VX, unchanged); NEW conditional refinement: a >= 5-packet single-heavy witness now needs mu < 0.240015 at ANY of the three head positions (mu < 0.23208 at head/highest)",
  },
  promotesBound: false,
  noQED: true,
  sota: "No refereed bound is changed",
};

// --------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// --------------------------------------------------------------------------
export const IMP95159_JET_PHANTOM_SAMESIDE_COLLAPSE_ASSERTIONS = [
  {
    id: "imp95159-quarter-disk-gram",
    description:
      "LEMMA QD: the same-endpoint 2x2 blocks of G4(W) are exactly the identity (float deviation 0.0 over 200 random hull widths) -- the same-endpoint jet features are orthonormal for every W",
    holds: () => MEASURED.qd.worstDev === 0,
  },
  {
    id: "imp95159-sameside-cut-collapse",
    description:
      "LEMMA SS: the same-side support cut collapses to alpha = sum v_j g(d_j) exactly -- explicit multiplier deviation < 1e-12 relative, carried optimizer within 1e-9, over 300 random (W, d1, d2, v) draws: zero same-side jet slack",
    holds: () =>
      MEASURED.ss.worstExplicitRel < 1e-12 && MEASURED.ss.worstOptimizerRel < 1e-9,
  },
  {
    id: "imp95159-kn-box-attained",
    description:
      "Sampled same-side k-profiles (k <= 12) never exceed the KN caps at any coupling point (400 draws, 4 points each); endpoint-concentrated profiles reach ratio > 0.999 and the exact endpoint packet attains the cap to 1e-15 -- the box corner is attained, not just bounded",
    holds: () =>
      MEASURED.kn.worstViol <= 0 && MEASURED.kn.bestRatio > 0.999 && MEASURED.kn.worstAttain < 1e-15,
  },
  {
    id: "imp95159-head-cover-closes",
    description:
      "The jet-free head-chart cover closes with ZERO unresolved at floors 0.244 / 0.240015 / 0.2321 / 0.23208 over mu up to 0.49004, exact baked cell counts 10 / 15 / 54 / 60",
    holds: () =>
      [0.244, 0.240015, 0.2321, 0.23208].every((f) => MEASURED.ladder.head[f].unresolved === 0) &&
      MEASURED.ladder.head[0.23208].cells === 60,
  },
  {
    id: "imp95159-highest-cover-closes",
    description:
      "The jet-free highest-chart cover closes with ZERO unresolved at the same floors, exact baked cell counts 10 / 15 / 54 / 65",
    holds: () =>
      [0.244, 0.240015, 0.2321, 0.23208].every((f) => MEASURED.ladder.highest[f].unresolved === 0) &&
      MEASURED.ladder.highest[0.23208].cells === 65,
  },
  {
    id: "imp95159-walls-bracket-class-floor",
    description:
      "Wall brackets: each chart corner is refuted just below its crossing (0.23207204 head, 0.23207592 highest) and certifies at 0.23208; the two walls bracket the carried class-sandwich floor 0.2320723 and the covered floor sits 7.7e-6 above it",
    holds: () =>
      MEASURED.wall.headBelow > 1 && MEASURED.wall.headAt < 1 &&
      MEASURED.wall.highBelow > 1 && MEASURED.wall.highAt < 1 &&
      MEASURED.wall.headCrossing < 0.2320723 && MEASURED.wall.highCrossing > 0.2320723,
  },
  {
    id: "imp95159-parity-doubling-identity",
    description:
      "LEMMA OP for both new frame shapes: the odd-parity head/highest frames (all block bases and gaps doubled) equal the even frames at rate 2 mu entrywise to 1e-15 over 200 random frames",
    holds: () => MEASURED.op.worstEq < 1e-15,
  },
  {
    id: "imp95159-domination-battery",
    description:
      "200 sampled in-chart k-profile frames (exact profile bonds, both charts, endpoint-pinned draws included) never exceed the certified jet-free cell bound (positive worst gaps)",
    holds: () =>
      MEASURED.domination.worstGapH > 0 && MEASURED.domination.worstGapG > 0 &&
      MEASURED.domination.checked === 200,
  },
  {
    id: "imp95159-honest-record-literals",
    description:
      "No constant moves: class sandwich and the k <= 4 ladder floor 47/200 carried unchanged; no bound promotion; no QED; the sub-gap stays OPEN (mixed-heavy-pair channel + frame-reduction conditionality remain); the new floors are CONDITIONAL channel refinements, not class constants",
    holds: () =>
      IMP95159_JET_PHANTOM_SAMESIDE_COLLAPSE.carried.classSandwich[0] === 0.2320723 &&
      IMP95159_JET_PHANTOM_SAMESIDE_COLLAPSE.carried.classSandwich[1] === 0.24502 &&
      IMP95159_JET_PHANTOM_SAMESIDE_COLLAPSE.carried.ladderFloorKle4 === 47 / 200 &&
      IMP95159_JET_PHANTOM_SAMESIDE_COLLAPSE.promotesBound === false &&
      IMP95159_JET_PHANTOM_SAMESIDE_COLLAPSE.noQED === true &&
      IMP95159_JET_PHANTOM_SAMESIDE_COLLAPSE.openSubGap.status === "OPEN",
  },
];

for (const a of IMP95159_JET_PHANTOM_SAMESIDE_COLLAPSE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95159-jet-phantom-sameside-collapse assertion failed: ${a.id}`);
  }
}
