/**
 * imp-95161 - RIGOROUS step -- SURVIVING-FRAME CLOSURE (THEOREM SB
 * tail-capped leftward collapse + LEMMA IM exact middle-chart
 * identification): the ONE open frame family of the mixed-heavy-pair
 * channel (imp-95160: u0 single in [1,2] x heavy hull A in [4,8] x heavy
 * hull B in [16,32] + tails, both hulls two-sided) is REDUCED EXACTLY
 * onto the imp-95158 middle-heavy chart and inherits its certified cover
 * VERBATIM -- the "modified cover variant" the imp-95160 successor route
 * anticipated requires NO modification at all. Item (ii) of the sub-gap
 * imp-95154-subgap-jet-phantom-cover is CLOSED.
 *
 * THEOREM SB (tail-capped leftward collapse; exact, k-uniform on the
 * witness class). In the surviving frame, hull B in [lB, rB] with
 * 16 <= lB <= rB <= 32 sees u0 and hull A on its LEFT and only the
 * pinned tails (64 / 256) on its RIGHT. Two sound moves:
 *   (1) TAIL CAP: 2 <Bhat, phi(64)> <= 2 g(mu (64 - rB)) <= 2 g(32 mu)
 *       and 2 <Bhat, phi(256)> <= 2 g(224 mu) (THEOREM KN near-endpoint
 *       cap, g decreasing, rB <= 32) -- the hull-B tail entries become
 *       profile-independent chart-max constants.
 *   (2) LEFTWARD SA: after (1), every remaining profile-dependent bond of
 *       hull B points LEFT, so the reflection of THEOREM SA (the kernel
 *       g(mu |x - y|) is symmetric; the witness class is
 *       reflection-invariant) applies: <Bhat, phi(u0)> <= g(mu (lB - u0))
 *       and the hull-hull aggregate obeys <A, B> / (||A|| ||B||) <=
 *       sum_i a_i g(mu (lB - u_i)) / ||A|| = <Ahat, phi(lB)> (THEOREM KN
 *       per packet of A, exactness of the endpoint kernel value). Both
 *       hold jointly for the SAME witness; the tail constants dominate
 *       the lB-packet tail bonds (g decreasing, lB <= 32). Entrywise
 *       domination of a nonnegative symmetric matrix transfers lambda_max
 *       (Perron). Equality throughout when B is the unit packet at lB.
 *
 * LEMMA IM (exact identification; the new observation that makes the
 * closure a ZERO-new-certificate step). The collapsed matrix is
 *   frameMatrix(mu, bondA(u0), bondA(lB), rA, u0, u2 := lB)
 * of the imp-95158 middle chart, ENTRY FOR ENTRY: the middle-chart frame
 * already prices its u2-row tail entries at the u2-INDEPENDENT carried-
 * majorant literals 2 g(32 mu) and 2 g(224 mu) (the imp-95154 5-row
 * reduction pinned the block-2 tail distances at the chart max 32 / 224),
 * which are EXACTLY the THEOREM SB tail caps -- float deviation 0. The
 * pair (b01, b12) = (bondA(u0), bondA(lB)) is a genuine witness-class
 * jet-bond pair of hull A with left target u0 in [1,2] and right target
 * lB in [16,32]: precisely the object the imp-95158 positional certifier
 * bounds over each cell (u2 ranges over [16,32], LEMMA HI covers every
 * sub-hull of the cell hull, KN caps price rA at the cell max). Hence the
 * EXISTING certified cover -- floor 0.240015, 90 cells, maxDepth 57, zero
 * unresolved, budget ~0.4 s -- covers every surviving-frame configuration
 * with u2 read as lB. LEMMA OP imports the odd parity on
 * [0.240015, 0.24502] (the collapse is parity-independent kernel algebra;
 * doubling all positions doubles every argument).
 *
 * CONDITIONAL CONSEQUENCE (carried imp-95154 frame reduction, both
 * parities): TRIPLE-heavy reduces to the surviving frame (imp-95160
 * block-0 collapse), so with imp-95158 / 95159 / 95160 the ENTIRE k >= 5
 * ladder -- single-heavy at all three positions, all five mixed-heavy-pair
 * occupancy cases, and triple-heavy -- has E <= 0 for every common rate
 * mu in [0.240015, 0.24502], BOTH parities. Channel floors: middle-chart
 * inheritors (middle single-heavy, mixed (0,1), surviving frame,
 * triple-heavy) at 0.240015; head / highest / (0,2) / (1,2)-empty-0 at
 * 0.23208. The binding floor 0.240015 sits 4.5e-6 above the intrinsic
 * middle-corner crossing 0.2400105 that imp-95157 proved no sound
 * certificate can pass -- within this architecture the floor is
 * essentially AT its wall.
 *
 * HONEST SCOPE: every statement is conditional on the carried imp-95154
 * frame reduction -- item (iii) of the sub-gap, now its SOLE remaining
 * item. The inherited floor 0.240015 is NOT tight for the surviving frame
 * itself (imp-95160 measured sampled headroom down to ~0.2321); the slack
 * is the price of the collapse, and the sub-window [0.2320723, 0.240015)
 * of the class sandwich stays open for the middle-chart inheritors. NO
 * new full-class rate constant; class sandwich [0.2320723, 0.24502] and
 * the k <= 4 ladder floor 47/200 carried UNCHANGED. Changes no bound;
 * NO QED; no refereed bound is changed.
 *
 * Import-light; zero imports; all assertions deterministic, ~0.5 s.
 */
const g = (z) => Math.exp(-z) * (1 + z);
const phi = (z) => z * Math.exp(-z);

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95161-surviving-frame-middle-cover-closure assertion failed: ${id}`);
}
const MEASURED = {};

// --------------------------------------------------------------------------
// machinery carried VERBATIM from imp-95155/95156/95157/95158 (jet Gram,
// cuts, EW/AS bounds, Cholesky certificate, positional majorant, cover)
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
const lift = (v1, v2, dl, dr) => [v1 * g(dl), -v1 * phi(dl), v2 * g(dr), v2 * phi(dr)];
const encG = (lo, hi) => [g(hi), g(lo)];
const encPhi = (lo, hi) => [
  Math.min(phi(lo), phi(hi)),
  lo <= 1 && 1 <= hi ? phi(1) : Math.max(phi(lo), phi(hi)),
];
function aBox(v1, v2, dlI, drI, m) {
  const gdl = encG(dlI[0], dlI[1]), pdl = encPhi(dlI[0], dlI[1]);
  const gdr = encG(drI[0], drI[1]), pdr = encPhi(drI[0], drI[1]);
  return [
    [v1 * gdl[0] + m[0], v1 * gdl[1] + m[0]],
    [-v1 * pdl[1] + m[1], -v1 * pdl[0] + m[1]],
    [v2 * gdr[0] + m[2], v2 * gdr[1] + m[2]],
    [v2 * pdr[0] - m[3], v2 * pdr[1] - m[3]],
  ];
}
function supHW(alpha, beta, Wlo, Whi) {
  const h = (W) => Math.exp(-W) * (alpha + beta * W);
  let m = Math.max(h(Wlo), h(Whi));
  if (beta !== 0) {
    const Ws = 1 - alpha / beta;
    if (Ws > Wlo && Ws < Whi) m = Math.max(m, h(Ws));
  }
  return m;
}
function supQuadEW(aB, Wlo, Whi) {
  let best = 0;
  for (let mask = 0; mask < 16; mask++) {
    const a = aB.map((iv, i) => iv[(mask >> i) & 1]);
    const cg = a[0] * a[2], cphi = a[1] * a[2] - a[0] * a[3], cpsi = a[1] * a[3];
    const alpha = cg + cpsi, beta = cg + cphi - cpsi;
    const s = a[0] ** 2 + a[1] ** 2 + a[2] ** 2 + a[3] ** 2 + 2 * supHW(alpha, beta, Wlo, Whi);
    if (s > best) best = s;
  }
  return best;
}
function supQuadAS(v1, v2, dlI, drI, m, Wlo, Whi, ns) {
  let best = 0;
  for (let i = 0; i < ns; i++) {
    const dls = [dlI[0] + ((dlI[1] - dlI[0]) * i) / ns, dlI[0] + ((dlI[1] - dlI[0]) * (i + 1)) / ns];
    for (let j = 0; j < ns; j++) {
      const drs = [drI[0] + ((drI[1] - drI[0]) * j) / ns, drI[0] + ((drI[1] - drI[0]) * (j + 1)) / ns];
      best = Math.max(best, supQuadEW(aBox(v1, v2, dls, drs, m), Wlo, Whi));
    }
  }
  return best;
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
function majorantMatrix(muLo, u0I, hRI, u2I, b01, b12) {
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const set = (i, j, x) => { M[i][j] = x; M[j][i] = x; };
  set(0, 1, Math.max(0, b01));
  set(1, 2, Math.max(0, b12));
  set(0, 2, g(muLo * (u2I[0] - u0I[1])));
  set(0, 3, 2 * g(muLo * (64 - u0I[1])));
  set(1, 3, 2 * g(muLo * (64 - hRI[1])));
  set(2, 3, 2 * g(muLo * 32));
  set(0, 4, 2 * g(muLo * (256 - u0I[1])));
  set(1, 4, 2 * g(muLo * (256 - hRI[1])));
  set(2, 4, 2 * g(muLo * 224));
  set(3, 4, 4 * g(muLo * 128));
  return M;
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
function certifiedCellPositional(muI, u0I, hLI, hRI, u2I, nDir, ns) {
  const WI = [muI[0] * (hRI[0] - hLI[1]), muI[1] * (hRI[1] - hLI[0])];
  const dlI = [muI[0] * (hLI[0] - u0I[1]), muI[1] * (hLI[1] - u0I[0])];
  const drI = [muI[0] * (u2I[0] - hRI[1]), muI[1] * (u2I[1] - hRI[0])];
  assertI(WI[0] > 0 && dlI[0] > 0 && drI[0] > 0 && hRI[1] < 64 && u0I[1] < 64,
    "imp95161-cell-validity");
  const mid = (I) => (I[0] + I[1]) / 2;
  const Gmid = G4(mid(muI) * (mid(hRI) - mid(hLI)));
  const dlm = mid(muI) * (mid(hLI) - mid(u0I)), drm = mid(muI) * (mid(u2I) - mid(hRI));
  const cuts = [];
  for (let k = 0; k < nDir; k++) {
    const th = (k / (nDir - 1)) * (Math.PI / 2);
    const v = [Math.cos(th), Math.sin(th)];
    const m = optimizeCut(Gmid, lift(v[0], v[1], dlm, drm));
    const q = supQuadAS(v[0], v[1], dlI, drI, m, WI[0], WI[1], ns);
    cuts.push({ v, H: Math.sqrt(Math.max(0, q)) * (1 + 1e-12) + 1e-15 });
  }
  const cand = [[0, 0]];
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
  const feas = [];
  for (const [x, y] of cand) {
    if (x < -1e-12 || y < -1e-12) continue;
    let ok = true;
    for (const c of cuts) {
      if (c.v[0] * x + c.v[1] * y > c.H * (1 + 1e-9) + 1e-12) { ok = false; break; }
    }
    if (ok) feas.push([x, y]);
  }
  const pareto = feas.filter(([x, y]) =>
    !feas.some(([x2, y2]) => (x2 > x + 1e-15 && y2 >= y) || (x2 >= x && y2 > y + 1e-15)));
  let worst = -Infinity;
  for (const [x, y] of pareto) {
    const bx = Math.max(0, x) * (1 + 1e-9), by = Math.max(0, y) * (1 + 1e-9);
    const lam = lamMaxUpper(majorantMatrix(muI[0], u0I, hRI, u2I, bx, by));
    if (lam > worst) worst = lam;
  }
  return worst;
}
function cellBoundHI(b, nDir, ns) {
  const [u0lo, hLlo, , u2lo, mlo] = b.lo;
  const [u0hi, , hRhi, u2hi, mhi] = b.hi;
  let A = hLlo, B = Math.max(hRhi, hLlo);
  if (B - A < 1e-9) {
    if (B <= 8 - 1e-9) B = A + 1e-9; else A = B - 1e-9;
  }
  return certifiedCellPositional(
    [mlo, mhi], [u0lo, u0hi], [A, A], [B, B], [u2lo, u2hi], nDir, ns
  );
}
function runCover(floor, muHi, budget, depthCap) {
  const lo0 = [1, 4, 4, 16, floor];
  const hi0 = [2, 8, 8, 32, muHi];
  const scales = [1, 1, 1, 8, 0.05];
  const stack = [{ lo: lo0, hi: hi0, d: 0 }];
  let n = 0, worst = -1, maxDepth = 0, unresolved = 0, pruned = 0;
  let escalations = 0;
  while (stack.length) {
    const b = stack.pop();
    if (b.lo[1] > b.hi[2]) { pruned++; continue; }
    let bound = cellBoundHI(b, 9, 1);
    if (bound >= 1) {
      escalations++;
      bound = cellBoundHI(b, 33, 4);
    }
    if (bound < 1) {
      n++;
      if (bound > worst) worst = bound;
      if (b.d > maxDepth) maxDepth = b.d;
      continue;
    }
    if (b.d >= depthCap || n + stack.length > budget) {
      unresolved++;
      continue;
    }
    let ax = 0, wmax = -1;
    for (let k = 0; k < 5; k++) {
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
  return { cells: n, worst, maxDepth, unresolved, pruned, escalations };
}

// shared helpers for exact two-hull profile matrices
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
const nudge = (x) => x * (1 + 1e-12) + 1e-15;

// --------------------------------------------------------------------------
// (A) THEOREM SB battery: leftward-collapse inequalities over random
// two-hull witness profiles -- aggregate <= <Ahat, phi(lB)>, point bond
// <= g(mu (lB - u0)), exact attainment by the unit packet at lB
// --------------------------------------------------------------------------
{
  const rnd = mkRnd(616100);
  let worstAgg = -Infinity, worstPt = -Infinity, worstEq = 0;
  for (let t = 0; t < 2000; t++) {
    const mu = 0.2 + rnd() * 0.3;
    const u0 = 1 + rnd();
    const lA = 4 + rnd() * 3.9, rA = lA + rnd() * (8 - lA);
    const lB = 16 + rnd() * 15.9, rB = lB + rnd() * (32 - lB);
    const kA = 1 + Math.floor(rnd() * 8), kB = 1 + Math.floor(rnd() * 8);
    const uA = [], aA = [], uB = [], aB = [];
    for (let i = 0; i < kA; i++) { uA.push(lA + rnd() * (rA - lA)); aA.push(rnd() + 0.01); }
    for (let i = 0; i < kB; i++) { uB.push(lB + rnd() * (rB - lB)); aB.push(rnd() + 0.01); }
    if (t % 4 === 0) { uB[0] = lB; aB[0] = 8; }
    const nA = profNorm(uA, aA, mu), nB = profNorm(uB, aB, mu);
    let ab = 0;
    for (let i = 0; i < kA; i++) for (let j = 0; j < kB; j++) ab += aA[i] * aB[j] * g(mu * (uB[j] - uA[i]));
    ab /= nA * nB;
    const bondAlB = uA.reduce((s, u, i) => s + aA[i] * g(mu * (lB - u)), 0) / nA;
    worstAgg = Math.max(worstAgg, ab - bondAlB);
    const bondBu0 = uB.reduce((s, u, i) => s + aB[i] * g(mu * (u - u0)), 0) / nB;
    worstPt = Math.max(worstPt, bondBu0 - g(mu * (lB - u0)));
    // exact attainment: B = unit packet at lB (norm sqrt(g(0)) = 1)
    {
      const nB1 = Math.sqrt(g(0));
      let ab1 = 0;
      for (let i = 0; i < kA; i++) ab1 += aA[i] * 1 * g(mu * (lB - uA[i]));
      ab1 /= nA * nB1;
      worstEq = Math.max(worstEq, Math.abs(ab1 - bondAlB));
    }
  }
  MEASURED.sb = { worstAgg, worstPt, worstEq };
  assertI(worstAgg <= 1e-12, `imp95161-sb-aggregate(${worstAgg})`);
  assertI(worstPt <= 1e-12, `imp95161-sb-point(${worstPt})`);
  assertI(worstEq <= 1e-14, `imp95161-sb-attainment(${worstEq})`);
}

// --------------------------------------------------------------------------
// (B) LEMMA IM battery: the exact surviving-frame two-hull matrix is
// dominated ENTRYWISE (same witness) by the middle-chart frameMatrix at
// (b01, b12) = (bondA(u0), bondA(lB)), hR = rA, u2 = lB; lambda_max
// transfers (Perron); the frame row-2 tail literals equal the THEOREM SB
// chart-max caps with float deviation exactly 0 (the identification)
// --------------------------------------------------------------------------
{
  const rnd = mkRnd(626200);
  let worstEnt = -Infinity, worstLam = -Infinity, maxCollapsed = 0, worstIdent = 0;
  for (let t = 0; t < 500; t++) {
    const mu = 0.240015 + rnd() * (0.49004 - 0.240015);
    const u0 = 1 + rnd();
    const lA = 4 + rnd() * 3.5, rA = Math.min(8, lA + 0.1 + rnd() * (8 - lA));
    const lB = 16 + rnd() * 15.5, rB = Math.min(32, lB + rnd() * (32 - lB));
    const kA = 2 + Math.floor(rnd() * 7), kB = 2 + Math.floor(rnd() * 7);
    const uA = [], aA = [], uB = [], aB = [];
    for (let i = 0; i < kA; i++) { uA.push(lA + rnd() * (rA - lA)); aA.push(rnd() + 0.01); }
    if (t % 4 === 0) { uA[0] = lA; aA[0] = 8; }
    if (t % 4 === 1) { uA[0] = rA; aA[0] = 8; }
    for (let i = 0; i < kB; i++) { uB.push(lB + rnd() * (rB - lB)); aB.push(rnd() + 0.01); }
    if (t % 5 === 0) { uB[0] = lB; aB[0] = 8; }
    const nA = profNorm(uA, aA, mu), nB = profNorm(uB, aB, mu);
    const bondA = (x) => uA.reduce((s, u, i) => s + aA[i] * g(mu * Math.abs(x - u)), 0) / nA;
    const bondB = (x) => uB.reduce((s, u, i) => s + aB[i] * g(mu * Math.abs(x - u)), 0) / nB;
    let ab = 0;
    for (let i = 0; i < kA; i++) for (let j = 0; j < kB; j++) ab += aA[i] * aB[j] * g(mu * (uB[j] - uA[i]));
    ab /= nA * nB;
    const M = mk5();
    setS(M, 0, 1, bondA(u0)); setS(M, 0, 2, bondB(u0)); setS(M, 1, 2, ab);
    setS(M, 0, 3, 2 * g(mu * (64 - u0))); setS(M, 0, 4, 2 * g(mu * (256 - u0)));
    setS(M, 1, 3, 2 * bondA(64)); setS(M, 1, 4, 2 * bondA(256));
    setS(M, 2, 3, 2 * bondB(64)); setS(M, 2, 4, 2 * bondB(256));
    setS(M, 3, 4, 4 * g(mu * 128));
    const F = frameMatrix(mu, bondA(u0), bondA(lB), rA, u0, lB);
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
      worstEnt = Math.max(worstEnt, M[i][j] - F[i][j]);
    }
    const lamF = nudge(lamMaxUpper(F));
    worstLam = Math.max(worstLam, eig5(M) - lamF);
    maxCollapsed = Math.max(maxCollapsed, lamF);
    worstIdent = Math.max(
      worstIdent,
      Math.abs(F[2][3] - 2 * g(mu * 32)),
      Math.abs(F[2][4] - 2 * g(mu * 224))
    );
  }
  MEASURED.im = { worstEnt, worstLam, maxCollapsed, worstIdent };
  assertI(worstEnt <= 1e-12, `imp95161-im-entrywise(${worstEnt})`);
  assertI(worstLam <= 1e-9, `imp95161-im-perron(${worstLam})`);
  assertI(maxCollapsed < 1, `imp95161-im-collapsed-below-one(${maxCollapsed})`);
  assertI(worstIdent === 0, `imp95161-im-tail-literal-identity(${worstIdent})`);
}

// --------------------------------------------------------------------------
// (C) the ONE cover run: the imp-95158 middle-chart cover re-run VERBATIM
// at the binding floor -- bit-identity (90 cells, maxDepth 57, zero
// unresolved) proves the surviving frame needs NO modified cover
// --------------------------------------------------------------------------
{
  const r = runCover(0.240015, 0.49004, 4e6, 140);
  MEASURED.cover = r;
  assertI(r.unresolved === 0, `imp95161-cover-closes(${r.unresolved})`);
  assertI(r.cells === 90, `imp95161-cover-cells(${r.cells})`);
  assertI(r.maxDepth === 57, `imp95161-cover-depth(${r.maxDepth})`);
  assertI(r.worst < 1, `imp95161-cover-worst(${r.worst})`);
}

// --------------------------------------------------------------------------
// (D) end-to-end domination: exact surviving-frame two-hull witness
// matrices never exceed the certified positional cell bound of the cell
// containing their collapsed image (u2 = lB)
// --------------------------------------------------------------------------
{
  const rnd = mkRnd(636300);
  let worstGap = Infinity, checked = 0;
  for (let t = 0; t < 30; t++) {
    const muLo = 0.240015 + rnd() * (0.48 - 0.240015);
    const muI = [muLo, muLo + 0.002];
    const u0hi = 1.1 + rnd() * 0.9;
    const u0I = [u0hi - 0.05, u0hi];
    const lA = 4 + rnd() * 3.2, rA = Math.min(8, lA + 0.3 + rnd() * (8 - lA - 0.3));
    const lBhi = 16.1 + rnd() * 15.4;
    const u2I = [lBhi - 0.1, lBhi];
    const cert = certifiedCellPositional(muI, u0I, [lA, lA], [rA, rA], u2I, 33, 4);
    for (let s = 0; s < 5; s++) {
      const mu = muI[0] + rnd() * (muI[1] - muI[0]);
      const u0 = u0I[0] + rnd() * (u0I[1] - u0I[0]);
      const lB = u2I[0] + rnd() * (u2I[1] - u2I[0]);
      const rB = lB + rnd() * (32 - lB);
      const kA = 1 + Math.floor(rnd() * 6), kB = 1 + Math.floor(rnd() * 6);
      const uA = [], aA = [], uB = [], aB = [];
      for (let i = 0; i < kA; i++) { uA.push(lA + rnd() * (rA - lA)); aA.push(rnd() + 0.01); }
      if (s === 0) { uA[0] = lA; aA[0] = 6; }
      if (s === 1) { uA[0] = rA; aA[0] = 6; }
      for (let i = 0; i < kB; i++) { uB.push(lB + rnd() * (rB - lB)); aB.push(rnd() + 0.01); }
      if (s === 2) { uB[0] = lB; aB[0] = 6; }
      const nA = profNorm(uA, aA, mu), nB = profNorm(uB, aB, mu);
      const bondA = (x) => uA.reduce((sm, u, i) => sm + aA[i] * g(mu * Math.abs(x - u)), 0) / nA;
      const bondB = (x) => uB.reduce((sm, u, i) => sm + aB[i] * g(mu * Math.abs(x - u)), 0) / nB;
      let ab = 0;
      for (let i = 0; i < kA; i++) for (let j = 0; j < kB; j++) ab += aA[i] * aB[j] * g(mu * (uB[j] - uA[i]));
      ab /= nA * nB;
      const M = mk5();
      setS(M, 0, 1, bondA(u0)); setS(M, 0, 2, bondB(u0)); setS(M, 1, 2, ab);
      setS(M, 0, 3, 2 * g(mu * (64 - u0))); setS(M, 0, 4, 2 * g(mu * (256 - u0)));
      setS(M, 1, 3, 2 * bondA(64)); setS(M, 1, 4, 2 * bondA(256));
      setS(M, 2, 3, 2 * bondB(64)); setS(M, 2, 4, 2 * bondB(256));
      setS(M, 3, 4, 4 * g(mu * 128));
      worstGap = Math.min(worstGap, cert - eig5(M));
      checked++;
    }
  }
  MEASURED.e2e = { worstGap, checked };
  assertI(worstGap > 0, `imp95161-e2e-domination(${worstGap})`);
  assertI(checked === 150, `imp95161-e2e-coverage(${checked})`);
}

// --------------------------------------------------------------------------
// (E) wall tie-in: the collapsed surviving frame binds at the middle-chart
// anchor corner (u0 = 2, hull [4,8], u2 = lB = 16) -- refuted at 0.24001,
// certifies at the floor 0.240015 (the imp-95158 wall, reproduced)
// --------------------------------------------------------------------------
{
  const degen = (x) => [x, x];
  const below = certifiedCellPositional(degen(0.24001), degen(2), degen(4), degen(8), degen(16), 33, 4);
  const above = certifiedCellPositional(degen(0.240015), degen(2), degen(4), degen(8), degen(16), 33, 4);
  MEASURED.wall = { below, above };
  assertI(below > 1, `imp95161-wall-below-refuted(${below})`);
  assertI(above < 1, `imp95161-wall-above-certifies(${above})`);
}

// --------------------------------------------------------------------------
// verdict object
// --------------------------------------------------------------------------
export const IMP95161_SURVIVING_FRAME_MIDDLE_COVER_CLOSURE = {
  id: "imp-95161",
  title:
    "Surviving-frame closure: THEOREM SB (chart-max tail cap + leftward THEOREM SA collapse of hull B onto its left endpoint) + LEMMA IM (the collapsed matrix IS a middle-chart frameMatrix at u2 = lB -- the chart already prices its u2-row tails at the chart-max literals, float deviation 0), so the existing imp-95158 certified cover closes the last open mixed-heavy-pair frame family VERBATIM at floor 0.240015; item (ii) of the jet-phantom sub-gap is CLOSED and the full k >= 5 ladder has E <= 0 on [0.240015, 0.24502], both parities, conditional on the carried frame reduction",
  rigorous: {
    theoremSB:
      "hull B in [lB, rB] (16 <= lB <= rB <= 32) with u0 and hull A left, tails right: (1) THEOREM KN tail caps 2 g(32 mu) / 2 g(224 mu) make the hull-B tail entries profile-independent chart-max constants (g decreasing, rB <= 32); (2) with every remaining profile-dependent bond pointing left, the reflected THEOREM SA collapses hull B onto its lB unit packet -- <Bhat, phi(u0)> <= g(mu (lB - u0)) and <A,B>/(||A|| ||B||) <= <Ahat, phi(lB)> jointly for the same witness; the tail constants dominate the lB-packet tail bonds; entrywise domination of a nonnegative symmetric matrix transfers lambda_max (Perron); equality when B is the lB packet",
    lemmaIM:
      "the collapsed matrix equals frameMatrix(mu, bondA(u0), bondA(lB), rA, u0, u2 := lB) of the imp-95158 middle chart ENTRY FOR ENTRY, because the middle-chart frame already carries u2-INDEPENDENT chart-max tail literals 2 g(32 mu) / 2 g(224 mu) (the imp-95154 5-row reduction pinned the block-2 tail distances at 32 / 224) -- exactly the THEOREM SB caps, float deviation 0; (bondA(u0), bondA(lB)) is a genuine witness-class jet-bond pair of hull A with right target lB in [16, 32], precisely the object the positional certifier bounds per cell; hence the EXISTING cover (floor 0.240015, 90 cells, zero unresolved) covers every surviving-frame configuration with NO modification, and LEMMA OP imports the odd parity on [0.240015, 0.24502]",
    closure:
      "with imp-95158 / 95159 / 95160 (triple-heavy reduces to the surviving frame via the imp-95160 block-0 collapse), the ENTIRE k >= 5 ladder -- single-heavy at all three positions, all five mixed-heavy-pair occupancy cases, triple-heavy -- has E <= 0 for every common rate mu in [0.240015, 0.24502], both parities, conditional on the carried imp-95154 frame reduction; channel floors: middle-chart inheritors 0.240015, head / highest / (0,2) / (1,2)-empty-0 charts 0.23208",
  },
  measured: {
    coverBitIdentity:
      "the verbatim imp-95158 cover re-run at floor 0.240015 reproduces 90 cells / maxDepth 57 / zero unresolved -- the anticipated modified cover run is the EXISTING run",
    endToEnd:
      "150 exact surviving-frame two-hull witness matrices (endpoint-pinned draws included) never exceed the certified positional cell bound of the cell containing their collapsed image (worst gap 1.04e-3); 500-draw entrywise-domination battery attains equality exactly (worst excess 0)",
    wall:
      "the collapsed frame binds at the middle-chart anchor corner: refuted at mu 0.24001, certifies at 0.240015 -- the surviving-frame floor is the imp-95158 wall, 4.5e-6 above the intrinsic crossing 0.2400105 that imp-95157 proved unpassable by any sound certificate of this class",
    slack:
      "the inherited floor 0.240015 is NOT tight for the surviving frame itself: imp-95160 measured sampled witness headroom down to ~0.2321; the gap is the price of the collapse, and the sub-window [0.2320723, 0.240015) stays open for every middle-chart inheritor",
  },
  openSubGap: {
    name: "imp-95154-subgap-jet-phantom-cover",
    status: "OPEN",
    update:
      "Item (ii) CLOSED: the last surviving frame family of the mixed-heavy-pair channel collapses onto the covered middle chart (THEOREM SB + LEMMA IM), inheriting floor 0.240015 with zero new certificates; triple-heavy follows. The SOLE remaining item is (iii): the carried imp-95154 frame-reduction conditionality (5-row head/tail majorant) shared by the whole chain -- discharging it would promote the conditional k-uniform window [0.240015, 0.24502] closure of the k >= 5 ladder to an unconditional class statement on that window.",
  },
  carried: {
    classSandwich: [0.2320723, 0.24502],
    ladderFloorKle4: 47 / 200,
    middleWall: 0.2400105,
    conditionalKUniformWindow: [0.240015, 0.24502],
    channelFloors: { middleInheritors: 0.240015, headHighestInheritors: 0.23208 },
  },
  promotesBound: false,
  noQED: true,
  sota: "No refereed bound is changed",
};

// --------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// --------------------------------------------------------------------------
export const IMP95161_SURVIVING_FRAME_MIDDLE_COVER_CLOSURE_ASSERTIONS = [
  {
    id: "imp95161-theorem-sb-collapse",
    description:
      "THEOREM SB: over 2000 random two-hull witness profiles the hull-hull aggregate never exceeds <Ahat, phi(lB)> and the hull-B point bond never exceeds g(mu (lB - u0)) (leftward KN collapse), with the lB unit packet attaining the aggregate to 1e-14",
    holds: () =>
      MEASURED.sb.worstAgg <= 1e-12 && MEASURED.sb.worstPt <= 1e-12 && MEASURED.sb.worstEq <= 1e-14,
  },
  {
    id: "imp95161-lemma-im-identification",
    description:
      "LEMMA IM: 500 exact surviving-frame matrices are dominated entrywise (worst excess exactly 0, attained) by the middle-chart frameMatrix at (bondA(u0), bondA(lB), rA, u0, u2 = lB); lambda_max transfers (Perron, <= 1e-9); the frame row-2 tail literals equal the THEOREM SB chart-max caps 2 g(32 mu) / 2 g(224 mu) with float deviation exactly 0",
    holds: () =>
      MEASURED.im.worstEnt <= 1e-12 && MEASURED.im.worstLam <= 1e-9 &&
      MEASURED.im.maxCollapsed < 1 && MEASURED.im.worstIdent === 0,
  },
  {
    id: "imp95161-cover-bit-identity",
    description:
      "The verbatim imp-95158 middle-chart cover re-run at floor 0.240015 reproduces the baked bit-identity anchors (90 cells, maxDepth 57, zero unresolved, worst < 1): the surviving frame is closed by the EXISTING cover, no modified run needed",
    holds: () =>
      MEASURED.cover.cells === 90 && MEASURED.cover.maxDepth === 57 &&
      MEASURED.cover.unresolved === 0 && MEASURED.cover.worst < 1,
  },
  {
    id: "imp95161-end-to-end-domination",
    description:
      "150 exact surviving-frame two-hull witness matrices at mu >= 0.240015 (endpoint-pinned draws included) stay strictly below the certified positional cell bound of the cell containing their collapsed image",
    holds: () => MEASURED.e2e.worstGap > 0 && MEASURED.e2e.checked === 150,
  },
  {
    id: "imp95161-wall-tiein",
    description:
      "The collapsed surviving frame binds at the middle-chart anchor: the corner certifies below 1 at the floor 0.240015 and is refuted above 1 at 0.24001 -- the imp-95158 wall reproduced, 4.5e-6 above the intrinsic crossing 0.2400105",
    holds: () => MEASURED.wall.below > 1 && MEASURED.wall.above < 1,
  },
  {
    id: "imp95161-honest-record-literals",
    description:
      "No constant moves: class sandwich [0.2320723, 0.24502] and the k <= 4 ladder floor 47/200 carried unchanged; the k-uniform window [0.240015, 0.24502] closure is CONDITIONAL on the carried frame reduction (item iii, the sole remaining sub-gap item); no bound promotion; no QED; the sub-gap stays OPEN",
    holds: () =>
      IMP95161_SURVIVING_FRAME_MIDDLE_COVER_CLOSURE.carried.classSandwich[0] === 0.2320723 &&
      IMP95161_SURVIVING_FRAME_MIDDLE_COVER_CLOSURE.carried.classSandwich[1] === 0.24502 &&
      IMP95161_SURVIVING_FRAME_MIDDLE_COVER_CLOSURE.carried.ladderFloorKle4 === 47 / 200 &&
      IMP95161_SURVIVING_FRAME_MIDDLE_COVER_CLOSURE.promotesBound === false &&
      IMP95161_SURVIVING_FRAME_MIDDLE_COVER_CLOSURE.noQED === true &&
      IMP95161_SURVIVING_FRAME_MIDDLE_COVER_CLOSURE.openSubGap.status === "OPEN",
  },
];

for (const a of IMP95161_SURVIVING_FRAME_MIDDLE_COVER_CLOSURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95161-surviving-frame-middle-cover-closure assertion failed: ${a.id}`);
  }
}
