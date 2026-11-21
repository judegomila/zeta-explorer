/**
 * imp-95164 - RIGOROUS step -- POSITIONAL INTERVAL EXTENSION of the
 * endpoint-pair support-function certificate (LEMMA PI positional interval
 * cut + LEMMA PN positional frame majorant + THEOREM PW positional-cell /
 * rate-band certificate): item (i) of imp-95163-subgap-pd-positional-cover
 * -- "positional/interval rounding of the LEMMA PE cuts over chart cells
 * (u0, hull endpoints, u2, mu), the imp-95156 LEMMA IC analogue for the
 * new certifier" -- is CLOSED, and the resulting positional certifier is
 * run: the FIRST positionally certified statements BELOW the old
 * jet-phantom wall 0.2400105 exist, down to a certified cell at rate
 * 0.232149 (position half-width 5e-4), 7.7e-5 above the intrinsic k = 1
 * anchor crossing 0.2320720394.
 *
 * SETTING (carried from imp-95163). Matern-3/2 carrier g(z) =
 * exp(-z)(1 + z), reproducing kernel g(mu|x - y|) at rate mu with feature
 * map phi_mu. A hull profile is A = sum a_i phi_mu(x_i), a_i >= 0,
 * x_i in [l, r]; its bond pair is (bL, bR) = (<A, phi_mu(u0)>,
 * <A, phi_mu(u2)>)/||A||. LEMMA PD (carried): if P is any RKHS element
 * with h(x) <= lambda Phat(x) pointwise on the hull for the target
 * h(x) = c1 g(mu(x - u0)) + c2 g(mu(u2 - x)), c >= 0, then
 * c.(bL, bR) <= lambda ||P||_mu, uniformly in k and occupancy.
 *
 * LEMMA PI (positional interval endpoint-pair cut; rigorous). Fix a
 * geometry cell C = muI x u0I x lI x rI x u2I with u0hi < llo and
 * rhi < u2lo (validity), and a direction c >= 0. Write L = llo, R = rhi
 * (the widest hull), and fix ANY alpha, beta >= 0 (chosen below at the
 * cell midpoint by the LEMMA PE normal equations; soundness does not
 * depend on the choice). Define P0 = alpha phi_mu(L) + beta phi_mu(R)
 * at the ACTUAL rate mu of a geometry in the cell. Three closed-form
 * monotonicities -- all with NONNEGATIVE g-arguments, where g(mu d) is
 * strictly decreasing in mu for d > 0 (d/dmu = -d (mu d) exp(-mu d) < 0)
 * and decreasing in d -- give, for EVERY geometry in C and every x in
 * its hull [l, r] contained in [L, R]:
 *   (a) target majorant: h_geo(x) <= Hstar(x)
 *       := c1 g(mulo (x - u0hi)) + c2 g(mulo (u2lo - x)),
 *       since x - u0 >= x - u0hi > 0 and u2 - x >= u2lo - x > 0;
 *   (b) projection minorant: Phat_geo(x) = alpha g(mu(x - L)) +
 *       beta g(mu(R - x)) >= Pmin(x) := alpha g(muhi(x - L)) +
 *       beta g(muhi(R - x)), since x - L, R - x >= 0 on [L, R];
 *   (c) norm majorant: ||P0||_mu^2 = alpha^2 + beta^2 +
 *       2 alpha beta g(mu(R - L)) <= n0cell^2 with g at mulo(R - L).
 * Certify lambda >= sup_{[L,R]} Hstar/Pmin by a grid with the explicit
 * Lipschitz constants LH = (mulo/e)(c1 + c2), LP = (muhi/e)(alpha+beta)
 * (|dg/dx| <= mu/e per unit coefficient since sup z exp(-z) = 1/e): on
 * each half-spacing ball, Hstar <= Hstar(x_j) + LH dx/2 and
 * Pmin >= Pmin(x_j) - LP dx/2 > 0 (checked). Then for every geometry in
 * C and every nonnegative hull profile,
 *   c.(bL, bR) <= lambda <A, P0>/||A|| <= lambda ||P0||_mu
 *              <= lambda n0cell =: SIG(c),
 * by (a)+(b) pointwise on [l, r], LEMMA PD, Cauchy-Schwarz, and (c).
 * At zero cell width this reproduces LEMMA PE with the fixed eps
 * inflation replaced by the certified ratio sup -- measured TIGHTER than
 * the imp-95163 literals by ~1.67e-4 at every ladder rate. The KN axis
 * caps round the same way: bL <= g(mu(l - u0)) <= g(mulo(llo - u0hi)),
 * bR <= g(mulo(u2lo - rhi)).
 *
 * LEMMA PN (positional frame majorant; rigorous). Every non-bond entry
 * of the geometry frame (imp-95163 anchor block structure: u0-row,
 * hull-row, u2-row, block-3/4 occupancy-blind KN2 caps) is g(mu d) with
 * d one of {u2 - u0, 64 - u0, 256 - u0, 64 - r, 256 - r, 64 - u2,
 * 256 - u2, 128}, all positive on a valid cell (u2hi < 64). Evaluating
 * each at mulo and the MINIMAL d over the cell (u2lo - u0hi, 64 - u0hi,
 * ..., 64 - u2hi, ...) majorizes every frame in the cell entrywise;
 * lambda_max is entrywise monotone for symmetric nonnegative matrices,
 * so the carried LEMMA PV polygon-vertex reduction (entries affine
 * nondecreasing in (bL, bR), lambda_max convex + Perron monotone) plus
 * positive-pivot Cholesky at the majorant certifies EVERY geometry in
 * the cell at once. This is the imp-95156 LEMMA PM argument transported
 * to the imp-95163 factor-1 pointwise frame.
 *
 * THEOREM PW (positional-cell and rate-band certificates; measured
 * instances of the rigorous assembly). Fan of LEMMA PI cuts + rounded KN
 * axis caps bound the attainable (bL, bR) of every geometry in the cell
 * by one convex polygon; LEMMA PV + LEMMA PN certify the vertex maximum.
 * RESULTS (33 cuts): (1) RATE BAND -- the 10-tile cover of
 * mu in [0.235, 0.240] with all four positions in half-width-0.02
 * intervals around the anchor (2, [4, 8], 16) certifies every tile
 * (worst 0.9977926): the FIRST positional certificate below the old
 * jet-phantom wall 0.2400105 -- the imp-95156 positional certifier could
 * certify NOTHING below it (its record slab sat at [0.2445, 0.245]).
 * (2) LANDMARK CELLS: [0.2329, 0.2331] x half-width 0.005 certifies at
 * 0.999382387; [0.23219, 0.23221] x 0.001 at 0.999998664 (thin);
 * [0.232149, 0.232151] x 0.0005 at 0.999983826 -- 7.7e-5 above the
 * intrinsic anchor crossing 0.2320720394; the cell
 * [0.2321, 0.23211] x 0.0002 stalls (1.000036). (3) POSITIONAL PRICE:
 * loss at mu = 0.235 is 8.0012e-4 / 1.6096e-3 / 3.2067e-3 / 6.8878e-3
 * at half-width 0.005 / 0.01 / 0.02 / 0.04 -- linear (doubling ratio
 * 1.99), slope ~0.160 lambda per unit half-width, 1.45x SMALLER than the
 * jet certifier's recorded 0.233: the support-function cuts also round
 * more cheaply. mu-half-width price ~2.77 lambda per unit (5.5468e-4 at
 * 2e-4), consistent with the intrinsic ladder slope ~1.9 plus interval
 * slack. (4) MAX CERTIFYING HALF-WIDTH at mu = 0.235: bisection brackets
 * 0.035076 (vs 0.0438 for the jet certifier at its own anchor 0.245).
 *
 * SKEPTICAL RECORD (what does NOT survive). The imp-95156 LEMMA NC
 * closed-form nesting argument does NOT transport: under same-midpoint
 * cell widening the norm-majorant term g(mulo (R - L)) moves BOTH ways
 * (mulo decreases it, R - L increases it), so certified-bound
 * monotonicity in the half-width is NOT proved here -- the width
 * bisection is reported as a measured bracket (each evaluation is
 * individually sound), and the 4-rung nest is asserted as measured, not
 * as a lemma. Successors wanting a certified subdivision budget should
 * either split the norm term per mu sub-cell or prove the lam-growth
 * domination.
 *
 * CONSEQUENCE (honest). Item (i) of imp-95163-subgap-pd-positional-cover
 * is CLOSED; the sub-gap stays OPEN on (ii) the full PD-based
 * middle-chart cover run at a floor near 0.23208 (this module supplies
 * its cell certifier and prices its granularity: half-width ~0.035 at
 * margin 5.4e-3, ~1e-3 at margin 2e-5) and (iii) the inheritor
 * repricing. The certified cells remain ANCHOR-CENTERED (u0 = 2, hull
 * [4, 8], u2 = 16 midpoints): NO chart-wide floor moves, class sandwich
 * [0.2320723, 0.24502], unconditional window [0.240015, 0.24502], and
 * the k <= 4 ladder floor 47/200 carried UNCHANGED. Changes no bound;
 * NO QED; no refereed bound is changed.
 *
 * Import-light; zero imports; all assertions deterministic, ~2 s.
 */
const g = (z) => Math.exp(-z) * (1 + z);
const mid = (I) => (I[0] + I[1]) / 2;

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95164-pe-positional-interval-cut assertion failed: ${id}`);
}
const MEASURED = {};

function lamMaxSym(M) {
  const n = M.length;
  const A = M.map((r) => r.slice());
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-26) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-19) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p], akq = A[k][q];
          A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k], aqk = A[q][k];
          A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk;
        }
      }
  }
  let lam = -Infinity;
  for (let i = 0; i < n; i++) lam = Math.max(lam, A[i][i]);
  return lam;
}
// positive-pivot Cholesky of (t I - M) certifies lambda_max(M) < t
function cholCertifies(M, t) {
  const n = M.length;
  const A = M.map((r, i) => r.map((x, j) => (i === j ? t - x : -x)));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = A[i][j];
      for (let k = 0; k < j; k++) s -= A[i][k] * A[j][k];
      if (i === j) {
        if (s <= 1e-12) return false;
        A[i][i] = Math.sqrt(s);
      } else A[i][j] = s / A[j][j];
    }
  }
  return true;
}

// geometry frame (imp-95163 anchor block structure, positions free)
function frameGeo(mu, bL, bR, u0, r, u2) {
  const e = (d) => g(mu * d);
  return [
    [0, bL, e(u2 - u0), e(64 - u0), e(256 - u0)],
    [bL, 0, bR, e(64 - r), e(256 - r)],
    [e(u2 - u0), bR, 0, e(64 - u2), e(256 - u2)],
    [e(64 - u0), e(64 - r), e(64 - u2), 0, e(128)],
    [e(256 - u0), e(256 - r), e(256 - u2), e(128), 0],
  ];
}
// LEMMA PN: entrywise cell majorant (mulo + minimal gaps)
function majFrame(cell, bL, bR) {
  const mulo = cell.muI[0];
  const u0hi = cell.u0I[1], rhi = cell.rI[1], u2lo = cell.u2I[0], u2hi = cell.u2I[1];
  const e = (d) => g(mulo * d);
  return [
    [0, bL, e(u2lo - u0hi), e(64 - u0hi), e(256 - u0hi)],
    [bL, 0, bR, e(64 - rhi), e(256 - rhi)],
    [e(u2lo - u0hi), bR, 0, e(64 - u2hi), e(256 - u2hi)],
    [e(64 - u0hi), e(64 - rhi), e(64 - u2hi), 0, e(128)],
    [e(256 - u0hi), e(256 - rhi), e(256 - u2hi), e(128), 0],
  ];
}

// LEMMA PI: interval endpoint-pair cut over a geometry cell
function cellCut(cell, c1, c2, NG) {
  const [mulo, muhi] = cell.muI;
  const L = cell.lI[0], R = cell.rI[1];
  const u0hi = cell.u0I[1], u2lo = cell.u2I[0];
  const Hstar = (x) => c1 * g(mulo * (x - u0hi)) + c2 * g(mulo * (u2lo - x));
  // fixed nonnegative coefficients from the midpoint LEMMA PE normal
  // equations (any fixed choice is sound; the midpoint keeps lambda near 1)
  const mum = mid(cell.muI);
  const hmid = (x) => c1 * g(mum * (x - mid(cell.u0I))) + c2 * g(mum * (mid(cell.u2I) - x));
  const gWm = g(mum * (R - L));
  const hl = hmid(L), hr = hmid(R);
  let al = (hl - gWm * hr) / (1 - gWm * gWm);
  let be = (hr - gWm * hl) / (1 - gWm * gWm);
  if (al < 0) { al = 0; be = hr; }
  if (be < 0) { be = 0; al = hl; }
  const Pmin = (x) => al * g(muhi * (x - L)) + be * g(muhi * (R - x));
  const LH = (mulo / Math.E) * (c1 + c2);
  const LP = (muhi / Math.E) * (al + be);
  const dx = (R - L) / (NG - 1), half = dx / 2;
  let lam = 0, ok = true;
  for (let q = 0; q < NG; q++) {
    const x = L + q * dx;
    const num = Hstar(x) + LH * half;
    const den = Pmin(x) - LP * half;
    if (den <= 0) { ok = false; break; }
    if (num / den > lam) lam = num / den;
  }
  const n0cell = Math.sqrt(al * al + be * be + 2 * al * be * g(mulo * (R - L)));
  return { c1, c2, al, be, lam, n0cell, sig: lam * n0cell * (1 + 1e-9), ok };
}

// THEOREM PW assembly: certified bound over the whole cell (all geometries,
// all packet counts k, all nonnegative hull profiles)
function certifyCell(cell, nCuts, NG) {
  assertI(
    cell.u0I[1] < cell.lI[0] && cell.rI[1] < cell.u2I[0] && cell.u2I[1] < 64 && cell.muI[0] > 0,
    "imp95164-cell-validity"
  );
  const nudge = 1e-9;
  const axL = g(cell.muI[0] * (cell.lI[0] - cell.u0I[1])) * (1 + nudge);
  const axR = g(cell.muI[0] * (cell.u2I[0] - cell.rI[1])) * (1 + nudge);
  const cuts = [];
  let allOk = true;
  for (let t = 1; t <= nCuts; t++) {
    const th = (Math.PI / 2) * (t / (nCuts + 1));
    const r = cellCut(cell, Math.cos(th), Math.sin(th), NG);
    if (!r.ok) { allOk = false; continue; }
    cuts.push(r);
  }
  const all = cuts.concat([{ c1: 1, c2: 0, sig: axL }, { c1: 0, c2: 1, sig: axR }]);
  // candidate vertices: origin, axis intercepts, all pairwise intersections;
  // over-inclusive feasibility tolerance keeps every true vertex (sound side)
  const feas = (b) => b[0] >= -1e-9 && b[1] >= -1e-9 && all.every((c) => c.c1 * b[0] + c.c2 * b[1] <= c.sig + 1e-9);
  const verts = [[0, 0]];
  for (const c of all) {
    if (c.c1 > 1e-12) verts.push([c.sig / c.c1, 0]);
    if (c.c2 > 1e-12) verts.push([0, c.sig / c.c2]);
  }
  for (let i = 0; i < all.length; i++)
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i], b = all[j];
      const det = a.c1 * b.c2 - a.c2 * b.c1;
      if (Math.abs(det) < 1e-12) continue;
      verts.push([(a.sig * b.c2 - b.sig * a.c2) / det, (a.c1 * b.sig - b.c1 * a.sig) / det]);
    }
  const fv = verts.filter(feas);
  let worst = -Infinity;
  const mats = [];
  for (const v of fv) {
    const M = majFrame(cell, Math.max(0, v[0]), Math.max(0, v[1]));
    mats.push(M);
    const lam = lamMaxSym(M);
    if (lam > worst) worst = lam;
  }
  return { worst, allOk, cuts: all, mats, nVerts: fv.length };
}
const box = (c, w) => [c - w, c + w];
const deg = (c) => [c, c];
const cellAt = (muI, w) => ({ muI, u0I: box(2, w), lI: box(4, w), rI: box(8, w), u2I: box(16, w) });

// --------------------------------------------------------------------------
// (A) degenerate collapse: zero-width cells reproduce the imp-95163 THEOREM
// PC ladder, TIGHTER by ~1.67e-4 (certified ratio sup replaces the fixed eps)
// --------------------------------------------------------------------------
const PC_LADDER = [
  { mu: 0.2322, lit: 0.999977163 },
  { mu: 0.2325, lit: 0.999388433 },
  { mu: 0.233, lit: 0.998411414 },
  { mu: 0.235, lit: 0.994555027 },
  { mu: 0.238, lit: 0.988923545 },
  { mu: 0.24, lit: 0.985267626 },
];
{
  let worstAbove = -Infinity, minTight = Infinity, maxTight = -Infinity;
  for (const row of PC_LADDER) {
    const r = certifyCell(cellAt(deg(row.mu), 0), 33, 20001);
    assertI(r.allOk, `imp95164-collapse-fan(${row.mu})`);
    worstAbove = Math.max(worstAbove, r.worst - row.lit);
    minTight = Math.min(minTight, row.lit - r.worst);
    maxTight = Math.max(maxTight, row.lit - r.worst);
  }
  MEASURED.collapse = { worstAbove, minTight, maxTight };
  assertI(worstAbove < 0, `imp95164-collapse-tighter(${worstAbove})`);
  assertI(minTight > 1.2e-4 && maxTight < 3e-4, `imp95164-collapse-band(${minTight},${maxTight})`);
}

// --------------------------------------------------------------------------
// (B) soundness battery: 400 random geometries x nonnegative profiles inside
// a wide cell never violate any cut, and their exact geometry-frame lambda
// stays below the certified cell bound
// --------------------------------------------------------------------------
{
  const cell = cellAt([0.234, 0.236], 0.05);
  const cert = certifyCell(cell, 33, 20001);
  let st = 951641;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstCut = -Infinity, worstLam = -Infinity;
  for (let t = 0; t < 400; t++) {
    const mu = cell.muI[0] + rnd() * (cell.muI[1] - cell.muI[0]);
    const u0 = cell.u0I[0] + rnd() * (cell.u0I[1] - cell.u0I[0]);
    const l = cell.lI[0] + rnd() * (cell.lI[1] - cell.lI[0]);
    const r = cell.rI[0] + rnd() * (cell.rI[1] - cell.rI[0]);
    const u2 = cell.u2I[0] + rnd() * (cell.u2I[1] - cell.u2I[0]);
    const k = 1 + Math.floor(rnd() * 12);
    const us = [], as = [];
    for (let i = 0; i < k; i++) { us.push(l + rnd() * (r - l)); as.push(0.05 + rnd()); }
    if (t % 5 === 0) { us[0] = l; as[0] = 3; }
    if (t % 7 === 0) us[k - 1] = r;
    let n2 = 0;
    for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) n2 += as[i] * as[j] * g(mu * Math.abs(us[i] - us[j]));
    const n = Math.sqrt(n2);
    const bL = us.reduce((s, u, i) => s + as[i] * g(mu * (u - u0)), 0) / n;
    const bR = us.reduce((s, u, i) => s + as[i] * g(mu * (u2 - u)), 0) / n;
    for (const c of cert.cuts) worstCut = Math.max(worstCut, c.c1 * bL + c.c2 * bR - c.sig);
    worstLam = Math.max(worstLam, lamMaxSym(frameGeo(mu, bL, bR, u0, r, u2)) - cert.worst);
  }
  MEASURED.battery = { worstCut, worstLam, cellBound: cert.worst };
  assertI(worstCut <= 1e-12, `imp95164-battery-cuts(${worstCut})`);
  assertI(worstLam <= 1e-9, `imp95164-battery-lambda(${worstLam})`);
}

// --------------------------------------------------------------------------
// (C) positional and rate widths are priced linearly and MORE CHEAPLY than
// the jet certifier (recorded slope 0.233 per unit position half-width)
// --------------------------------------------------------------------------
{
  const base = certifyCell(cellAt(deg(0.235), 0), 33, 20001).worst;
  const lossW = {};
  for (const w of [0.005, 0.01, 0.02, 0.04]) lossW[w] = certifyCell(cellAt(deg(0.235), w), 33, 20001).worst - base;
  const lossMu = {};
  for (const dw of [0.0002, 0.0005, 0.001]) lossMu[dw] = certifyCell(cellAt([0.235 - dw, 0.235 + dw], 0), 33, 20001).worst - base;
  MEASURED.price = { base, lossW, lossMu };
  const dbl = lossW[0.02] / lossW[0.01];
  const slope = lossW[0.02] / 0.02;
  assertI(dbl > 1.9 && dbl < 2.1, `imp95164-price-linear(${dbl})`);
  assertI(slope > 0.14 && slope < 0.18, `imp95164-price-slope(${slope})`);
  assertI(slope < 0.233 * 0.8, `imp95164-price-beats-jet(${slope})`);
  const muDbl = lossMu[0.001] / lossMu[0.0005];
  assertI(muDbl > 1.9 && muDbl < 2.1, `imp95164-price-mu-linear(${muDbl})`);
}

// --------------------------------------------------------------------------
// (D) THEOREM PW rate band: 10 tiles cover mu in [0.235, 0.240] at position
// half-width 0.02 -- every tile certifies (worst 0.9977926), every vertex
// Cholesky-certified; the whole band sits BELOW the old jet wall 0.2400105
// --------------------------------------------------------------------------
{
  let allC = true, worstB = -Infinity, allChol = true;
  for (let i = 0; i < 10; i++) {
    const muI = [0.235 + i * 5e-4, 0.235 + (i + 1) * 5e-4];
    const r = certifyCell(cellAt(muI, 0.02), 33, 20001);
    if (!r.allOk || r.worst >= 1 - 1e-4) allC = false;
    for (const M of r.mats) if (!cholCertifies(M, 1 - 1e-4)) allChol = false;
    worstB = Math.max(worstB, r.worst);
  }
  MEASURED.band = { allC, allChol, worstB };
  assertI(allC && allChol, "imp95164-band-certifies");
  assertI(Math.abs(worstB - 0.9977926) < 1e-6, `imp95164-band-literal(${worstB})`);
  assertI(0.235 < 0.2400105 && 0.24 <= 0.2400105, "imp95164-band-below-old-wall");
}

// --------------------------------------------------------------------------
// (E) landmark cells and the stall: certified positional cells down to rate
// 0.232149 (half-width 5e-4), stall at [0.2321, 0.23211] x 2e-4
// --------------------------------------------------------------------------
{
  const c1 = certifyCell(cellAt([0.2329, 0.2331], 0.005), 33, 40001);
  const c2 = certifyCell(cellAt([0.23219, 0.23221], 0.001), 33, 40001);
  const c3 = certifyCell(cellAt([0.232149, 0.232151], 0.0005), 33, 40001);
  const st = certifyCell(cellAt([0.2321, 0.23211], 0.0002), 33, 40001);
  let chol = c1.allOk && c2.allOk && c3.allOk;
  for (const M of c1.mats) if (!cholCertifies(M, 1 - 1e-4)) chol = false;
  for (const M of c2.mats) if (!cholCertifies(M, 1 - 1e-6)) chol = false;
  for (const M of c3.mats) if (!cholCertifies(M, 1 - 1e-5)) chol = false;
  MEASURED.landmarks = { c1: c1.worst, c2: c2.worst, c3: c3.worst, stall: st.worst, chol };
  assertI(chol, "imp95164-landmark-cholesky");
  assertI(Math.abs(c1.worst - 0.999382387) < 1e-6, `imp95164-landmark-2330(${c1.worst})`);
  assertI(Math.abs(c2.worst - 0.999998664) < 1e-6, `imp95164-landmark-2322(${c2.worst})`);
  assertI(Math.abs(c3.worst - 0.999983826) < 1e-6, `imp95164-landmark-23215(${c3.worst})`);
  assertI(st.worst > 1, `imp95164-landmark-stall(${st.worst})`);
  // the deepest certified cell sits 7.7e-5 above the intrinsic anchor
  // crossing and 7.85e-3 below the old jet wall
  assertI(0.232149 - 0.2320720394 > 7.6e-5 && 0.232149 - 0.2320720394 < 7.8e-5, "imp95164-landmark-intrinsic-gap");
  assertI(0.2400105 - 0.232151 > 7.8e-3, "imp95164-landmark-below-old-wall");
}

// --------------------------------------------------------------------------
// (F) max certifying position half-width at mu = 0.235 (measured bracket;
// each bisection evaluation is individually sound -- NO nesting lemma is
// claimed, see the skeptical record) + measured 4-rung nest
// --------------------------------------------------------------------------
{
  const nest = [0.005, 0.01, 0.02, 0.04].map((w) => certifyCell(cellAt(deg(0.235), w), 33, 8001).worst);
  let lo = 0, hi = 0.1;
  for (let i = 0; i < 20; i++) {
    const w = (lo + hi) / 2;
    if (certifyCell(cellAt(deg(0.235), w), 33, 20001).worst < 1) lo = w; else hi = w;
  }
  MEASURED.width = { nest, lo, hi };
  assertI(nest.every((x, i) => i === 0 || x >= nest[i - 1]), "imp95164-nest-measured-monotone");
  assertI(lo > 0.0345 && hi < 0.0355, `imp95164-width-bracket(${lo},${hi})`);
}

// --------------------------------------------------------------------------
// verdict object
// --------------------------------------------------------------------------
export const IMP95164_PE_POSITIONAL_INTERVAL_CUT = {
  id: "imp-95164",
  title:
    "Positional interval extension of the endpoint-pair support-function certificate: LEMMA PI (interval PE cut -- three closed-form monotonicities in (mu, u0, l, r, u2) turn one grid-plus-Lipschitz-verified ratio into a cut valid for EVERY geometry in a cell, every packet count, every nonnegative hull profile) + LEMMA PN (positional frame majorant at mulo and minimal gaps, Perron entrywise monotonicity) + THEOREM PW (first positionally certified statements below the old jet-phantom wall: a 10-tile rate band [0.235, 0.240] x half-width 0.02, landmark cells down to rate 0.232149, 7.7e-5 above the intrinsic anchor crossing)",
  rigorous: {
    lemmaPI:
      "for a valid cell and fixed alpha, beta >= 0: (a) h_geo <= Hstar (target at mulo, u0hi, u2lo -- every g-argument positive, g(mu d) decreasing in both mu and d), (b) Phat_geo >= Pmin (projection atoms at the widest hull endpoints, evaluated at muhi), (c) ||P0||_mu <= n0cell (Gram overlap at mulo); a grid-plus-Lipschitz certificate of lambda >= sup Hstar/Pmin (explicit constants (mu/e) per unit coefficient) then gives c.(bL,bR) <= lambda n0cell for every geometry in the cell and every nonnegative profile, by LEMMA PD + Cauchy-Schwarz; zero cell width reproduces LEMMA PE with the fixed eps replaced by the certified ratio (measured ~1.67e-4 TIGHTER than the imp-95163 ladder literals)",
    lemmaPN:
      "every non-bond entry of the geometry frame is g(mu d) with d positive on a valid cell; evaluating at mulo and the minimal d over the cell majorizes every frame entrywise, and lambda_max is entrywise monotone for symmetric nonnegative matrices -- the carried LEMMA PV polygon-vertex reduction plus positive-pivot Cholesky at the majorant certifies the whole cell",
    theoremPW:
      "fan of LEMMA PI cuts + rounded KN axis caps bound the attainable bond region of every geometry in the cell by one convex polygon; LEMMA PV + LEMMA PN certify the vertex maximum -- run as a 10-tile band cover and at landmark cells (all vertices positive-pivot Cholesky below 1)",
  },
  measured: {
    band:
      "10 tiles of mu-width 5e-4 cover [0.235, 0.240] at position half-width 0.02 around the anchor; every tile certifies, worst 0.9977926 -- the FIRST positional certificate below the old jet-phantom wall 0.2400105 (the imp-95156 positional certifier record slab sat at [0.2445, 0.245])",
    landmarks:
      "certified cells [0.2329, 0.2331] x 0.005 (0.999382387), [0.23219, 0.23221] x 0.001 (0.999998664, thin), [0.232149, 0.232151] x 0.0005 (0.999983826 -- rate 7.7e-5 above the intrinsic anchor crossing 0.2320720394, 7.85e-3 below the old wall); stall at [0.2321, 0.23211] x 0.0002 (1.000036)",
    price:
      "positional loss at mu 0.235: 8.0012e-4 / 1.6096e-3 / 3.2067e-3 / 6.8878e-3 at half-width 0.005 / 0.01 / 0.02 / 0.04 -- linear (doubling 1.99), slope ~0.160 per unit half-width, 1.45x below the jet certifier recorded 0.233; mu-half-width loss 5.5468e-4 / 1.3839e-3 / 2.7679e-3 at 2e-4 / 5e-4 / 1e-3 -- linear, ~2.77 per unit, consistent with the intrinsic ladder slope plus interval slack",
    width:
      "max certifying position half-width at mu 0.235 bracketed at 0.035076 (vs 0.0438 for the jet certifier at its own anchor 0.245); the cover granularity for item (ii) is priced: half-width ~0.035 at margin 5.4e-3, ~1e-3 at margin 2e-5",
    collapse:
      "zero-width cells reproduce the imp-95163 THEOREM PC ladder at all six rates, uniformly TIGHTER by 1.63e-4 .. 1.68e-4 (the certified ratio sup replaces the fixed 2e-4 eps inflation)",
  },
  adversarialRecord:
    "the imp-95156 LEMMA NC closed-form nesting does NOT transport to this certifier: under same-midpoint widening the norm-majorant term g(mulo (R - L)) moves both ways (mulo down, R - L up), so no monotonicity lemma is claimed -- the width bisection is a measured bracket of individually sound evaluations, and the 4-rung nest is asserted as measured only",
  openSubGap: {
    name: "imp-95163-subgap-pd-positional-cover",
    status: "OPEN",
    update:
      "item (i) -- positional/interval rounding of the LEMMA PE cuts over chart cells -- is CLOSED by LEMMA PI/PN + THEOREM PW; remaining: (ii) the full PD-based middle-chart cover run at a floor near 0.23208 (this module supplies the cell certifier and its granularity pricing) and (iii) the repricing of the middle-chart inheritors (mixed pair (0,1), surviving frame, triple-heavy) onto the factor-1 pointwise frame",
  },
  carried: {
    classSandwich: [0.2320723, 0.24502],
    unconditionalWindow: [0.240015, 0.24502],
    ladderFloorKle4: 47 / 200,
    oldJetWall: 0.2400105,
    intrinsicAnchorCrossing: 0.2320720394,
    openStrip: [0.2320723, 0.240015],
  },
  promotesBound: false,
  noQED: true,
  sota: "No refereed bound is changed",
};

// --------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// --------------------------------------------------------------------------
export const IMP95164_PE_POSITIONAL_INTERVAL_CUT_ASSERTIONS = [
  {
    id: "imp95164-lemma-pi-collapse-tighter",
    description:
      "LEMMA PI at zero cell width reproduces the imp-95163 THEOREM PC ladder at all six rates and is uniformly TIGHTER (by 1.2e-4 .. 3e-4): the certified ratio sup replaces the fixed eps inflation losslessly",
    holds: () => MEASURED.collapse.worstAbove < 0 && MEASURED.collapse.minTight > 1.2e-4 && MEASURED.collapse.maxTight < 3e-4,
  },
  {
    id: "imp95164-soundness-battery",
    description:
      "400 random (geometry, nonnegative profile) draws inside the wide test cell (mu in [0.234, 0.236], position half-width 0.05) never violate any interval cut (excess <= 1e-12) and their exact geometry-frame lambda stays below the certified cell bound",
    holds: () => MEASURED.battery.worstCut <= 1e-12 && MEASURED.battery.worstLam <= 1e-9,
  },
  {
    id: "imp95164-positional-price",
    description:
      "the positional loss is linear in the half-width (doubling ratio in (1.9, 2.1)) with slope ~0.160 per unit half-width -- 1.45x cheaper than the jet certifier recorded slope 0.233; the mu-width loss is linear as well",
    holds: () => {
      const dbl = MEASURED.price.lossW[0.02] / MEASURED.price.lossW[0.01];
      const slope = MEASURED.price.lossW[0.02] / 0.02;
      const muDbl = MEASURED.price.lossMu[0.001] / MEASURED.price.lossMu[0.0005];
      return dbl > 1.9 && dbl < 2.1 && slope > 0.14 && slope < 0.18 && slope < 0.233 * 0.8 && muDbl > 1.9 && muDbl < 2.1;
    },
  },
  {
    id: "imp95164-theorem-pw-band",
    description:
      "THEOREM PW rate band: all 10 tiles of the [0.235, 0.240] x half-width-0.02 cover certify with margin >= 1e-4 (every vertex positive-pivot Cholesky), worst tile 0.9977926 -- the first positional certificate below the old jet-phantom wall 0.2400105",
    holds: () => MEASURED.band.allC && MEASURED.band.allChol && Math.abs(MEASURED.band.worstB - 0.9977926) < 1e-6,
  },
  {
    id: "imp95164-landmark-cells",
    description:
      "certified landmark cells at rates 0.2330 / 0.2322 / 0.23215 (position half-widths 0.005 / 0.001 / 0.0005) reproduce the baked literals to 1e-6 and Cholesky-certify; the cell [0.2321, 0.23211] x 0.0002 stalls above 1; the deepest certified rate sits 7.7e-5 above the intrinsic anchor crossing",
    holds: () =>
      MEASURED.landmarks.chol &&
      Math.abs(MEASURED.landmarks.c1 - 0.999382387) < 1e-6 &&
      Math.abs(MEASURED.landmarks.c2 - 0.999998664) < 1e-6 &&
      Math.abs(MEASURED.landmarks.c3 - 0.999983826) < 1e-6 &&
      MEASURED.landmarks.stall > 1,
  },
  {
    id: "imp95164-width-bracket-measured",
    description:
      "the max certifying position half-width at mu 0.235 is bracketed inside (0.0345, 0.0355) by bisection of individually sound evaluations, and the 4-rung nest is monotone as MEASURED (no nesting lemma claimed -- the norm-majorant term blocks the imp-95156 LEMMA NC transport)",
    holds: () =>
      MEASURED.width.nest.every((x, i) => i === 0 || x >= MEASURED.width.nest[i - 1]) &&
      MEASURED.width.lo > 0.0345 && MEASURED.width.hi < 0.0355,
  },
  {
    id: "imp95164-honest-record-literals",
    description:
      "No constant moves: class sandwich [0.2320723, 0.24502], unconditional window [0.240015, 0.24502], k<=4 ladder floor 47/200 carried unchanged; certified cells are anchor-centered, no chart-wide floor is claimed; sub-gap item (i) closed, items (ii)/(iii) OPEN; no bound promotion; no QED",
    holds: () =>
      IMP95164_PE_POSITIONAL_INTERVAL_CUT.carried.classSandwich[0] === 0.2320723 &&
      IMP95164_PE_POSITIONAL_INTERVAL_CUT.carried.classSandwich[1] === 0.24502 &&
      IMP95164_PE_POSITIONAL_INTERVAL_CUT.carried.unconditionalWindow[0] === 0.240015 &&
      IMP95164_PE_POSITIONAL_INTERVAL_CUT.carried.ladderFloorKle4 === 47 / 200 &&
      IMP95164_PE_POSITIONAL_INTERVAL_CUT.openSubGap.status === "OPEN" &&
      IMP95164_PE_POSITIONAL_INTERVAL_CUT.promotesBound === false &&
      IMP95164_PE_POSITIONAL_INTERVAL_CUT.noQED === true,
  },
];

for (const a of IMP95164_PE_POSITIONAL_INTERVAL_CUT_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95164-pe-positional-interval-cut assertion failed: ${a.id}`);
}
