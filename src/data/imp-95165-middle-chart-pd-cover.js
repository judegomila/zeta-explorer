/**
 * imp-95165 - RIGOROUS step -- FULL MIDDLE-CHART PD POSITIONAL COVER
 * (LEMMA CX chart-corner collapse + THEOREM MC 9-cell cover at floor
 * 0.232086): item (ii) of imp-95163-subgap-pd-positional-cover -- "the
 * full PD-based middle-chart cover run at a floor near 0.23208" -- is
 * CLOSED. The chart-wide certified floor EQUALS the imp-95163 pointwise
 * anchor record 0.232086: positional chart width costs NOTHING at this
 * certificate resolution.
 *
 * SETTING (carried verbatim from imp-95163/95164). Matern-3/2 carrier
 * g(z) = exp(-z)(1 + z). Middle chart (imp-95158 domain): u0 in [1, 2]
 * (block-0 single), heavy hull [l, r] with 4 <= l <= r <= 8 (block 1, ANY
 * packet count k >= 1, ANY nonnegative hull profile), u2 in [16, 32]
 * (block-2 single), blocks 3/4 occupancy-blind KN2 caps (imp-95162
 * THEOREM RW), blocks >= 5 absorbed below half an ULP (THEOREM TX).
 * Certifier: the imp-95164 LEMMA PI positional interval endpoint-pair cut
 * + LEMMA PN positional frame majorant + LEMMA PV vertex reduction +
 * positive-pivot Cholesky. All helper code below is carried verbatim from
 * imp-95164 except the one change stated in LEMMA CX.
 *
 * LEMMA CX (chart-corner collapse; rigorous -- a rereading of the LEMMA
 * PI hypotheses). The LEMMA PI certificate of a cell
 * C = muI x u0I x lI x rI x u2I depends on the positional intervals ONLY
 * through the tuple (u0hi, llo, rhi, u2lo, u2hi): the target majorant
 * Hstar and both axis caps read (u0hi, llo, rhi, u2lo); the projection
 * atoms sit at (L, R) = (llo, rhi); the LEMMA PN frame majorant reads
 * (u0hi, rhi, u2lo, u2hi). The opposite ends u0lo, lhi, rlo never enter.
 * For the FULL middle-chart positional box u0I = [1, 2], lI = rI = [4, 8],
 * u2I = [16, u2hi] the binding tuple (u0hi, llo, rhi, u2lo) = (2, 4, 8, 16)
 * COINCIDES with the imp-95163 anchor corner. LEMMA PI holds for ANY fixed
 * nonnegative (alpha, beta) ("soundness does not depend on the choice"),
 * so choosing them by the normal equations of the CORNER target Hstar
 * itself -- alpha, beta solving [1 gW; gW 1][alpha; beta] =
 * [Hstar(L); Hstar(R)] with gW = g(muhi(R - L)), clamped to >= 0 --
 * instead of the imp-95164 cell-midpoint target makes the cut family of
 * the full chart box IDENTICAL (bit-for-bit, asserted diff === 0) to the
 * zero-width anchor family whenever u2hi = u2lo. CONSEQUENCE: positional
 * width across the ENTIRE chart is FREE on the cut side; the only
 * wide-box cost is the two LEMMA PN tail entries g(mulo(64 - u2hi)),
 * g(mulo(256 - u2hi)), and the expected 5-D positional cover of item (ii)
 * collapses to a 2-D adaptive (mu x u2) cover with u0, l, r never split.
 *
 * THEOREM MC (middle-chart cover; measured instance of the rigorous
 * assembly). The deterministic adaptive (mu x u2) subdivision of
 * [0.232086, 0.240015] x [16, 32] (65-cut fan, ratio grids NG = 20001,
 * refined to 80001 when the mu width is below 2e-4, margin 1e-6, split
 * rule: peel u2 low-end tiles while width > 0.25, else bisect mu)
 * terminates with 9 CELLS, max depth 8, ZERO unresolved, worst certified
 * bound 0.99998710570025984, and EVERY polygon vertex of every cell
 * positive-pivot Cholesky-certified below 1 - 1e-6. The cells form an
 * exact binary partition (area defect ~2e-16). Hence every middle-chart
 * geometry -- every u0 in [1, 2], every hull [l, r] in [4, 8] with every
 * packet count and nonnegative profile, every u2 in [16, 32], KN2-capped
 * tails -- at EVERY rate mu in [0.232086, 0.240015] has frame
 * lambda_max < 1, i.e. E <= 0 on the direct middle channel. Joining the
 * imp-95162 unconditional window [0.240015, 0.24502] at the shared
 * endpoint, the DIRECT middle-position channel (even parity) is closed on
 * [0.232086, 0.24502]; the odd-parity middle configs on the band compose
 * through the carried LEMMA OP doubling into rates
 * 2 mu in [0.464172, 0.48003], all above 0.45 where the carried THEOREM
 * RW row-sum cap S(mu) < 1 closes every class witness configuration-free
 * (S(0.464172) = 0.888371 < 1).
 *
 * CHART-FLOOR LEDGER. The imp-95158 middle-chart cover floor was
 * 0.240015; this cover moves the chart floor to 0.232086 -- the distance
 * to the intrinsic k = 1 anchor crossing 0.2320720394 contracts from
 * 7.943e-3 to 1.396e-5 (factor ~569). The floor equals the imp-95163
 * 65-cut POINTWISE record 0.232086 exactly and sits 2e-6 above the
 * recorded pointwise stall 0.232084: chart-wide positional freedom is
 * certified at zero measured cost, because the chart corner IS the
 * anchor (LEMMA CX) and only the u2 tail entries feel the width.
 *
 * SKEPTICAL RECORD (what does NOT survive / what binds). (1) The floor
 * cannot pass the pointwise anchor stall 0.232084 -- the anchor is the
 * corner point OF the chart, so no cover of this chart with this
 * certificate class can go below it (imp-95163 FINDING: the 65-cut family
 * stalls there); 0.232086 is therefore certificate-sharp for this
 * architecture, and the residual 1.4e-5 to the intrinsic crossing is
 * relaxation slack of the cut family, not positional slack. (2) At
 * NG = 20001 the three deepest sub-cells FAIL (the grid-Lipschitz
 * inflation ~1e-5 exceeds their margin) and the run leaves 3 unresolved
 * cells; NG = 80001 resolves them -- both settings are individually
 * sound (the inflation is part of the certificate; larger NG only
 * tightens), so this is a resolution cost, not a soundness caveat.
 * (3) The imp-95164 midpoint (alpha, beta) choice does NOT cover the
 * chart: the full box then fails even at mu = 0.24 (measured 1.0012) --
 * the corner adaptation of LEMMA CX is load-bearing, not cosmetic.
 *
 * CONSEQUENCE (honest). Item (ii) of imp-95163-subgap-pd-positional-cover
 * is CLOSED; the sub-gap stays OPEN on item (iii) alone: the repricing of
 * the middle-chart INHERITORS (mixed pair (0,1) via imp-95161, surviving
 * frame, triple-heavy) whose collapsed matrices carry the imp-95158
 * factor-2 tail literals 2g(32mu)/2g(224mu) and therefore do NOT inherit
 * from this factor-1 cover without a domination or repricing lemma. Until
 * (iii) closes, the inheritor floor stays 0.240015 and NO class-wide
 * constant moves: class sandwich [0.2320723, 0.24502], unconditional
 * window [0.240015, 0.24502], k <= 4 ladder floor 47/200 carried
 * UNCHANGED. Changes no bound; NO QED; no refereed bound is changed.
 *
 * Import-light; zero imports; all assertions deterministic, ~1.5 s.
 */
const g = (z) => Math.exp(-z) * (1 + z);

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95165-middle-chart-pd-cover assertion failed: ${id}`);
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
// LEMMA PN majorant frame (carried verbatim from imp-95164)
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
// LEMMA PI interval cut, with the LEMMA CX corner-adapted (alpha, beta):
// the ONLY change vs the imp-95164 cellCut is that the normal equations
// are solved for the corner target Hstar itself (any fixed nonnegative
// choice is sound per LEMMA PI)
function cellCutCorner(cell, c1, c2, NG) {
  const [mulo, muhi] = cell.muI;
  const L = cell.lI[0], R = cell.rI[1];
  const u0hi = cell.u0I[1], u2lo = cell.u2I[0];
  const Hstar = (x) => c1 * g(mulo * (x - u0hi)) + c2 * g(mulo * (u2lo - x));
  const gW = g(muhi * (R - L));
  const hl = Hstar(L), hr = Hstar(R);
  let al = (hl - gW * hr) / (1 - gW * gW);
  let be = (hr - gW * hl) / (1 - gW * gW);
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
// THEOREM PW assembly (carried verbatim from imp-95164 modulo LEMMA CX)
function certifyCell(cell, nCuts, NG) {
  assertI(
    cell.u0I[1] < cell.lI[0] && cell.rI[1] < cell.u2I[0] && cell.u2I[1] < 64 && cell.muI[0] > 0,
    "imp95165-cell-validity"
  );
  const nudge = 1e-9;
  const axL = g(cell.muI[0] * (cell.lI[0] - cell.u0I[1])) * (1 + nudge);
  const axR = g(cell.muI[0] * (cell.u2I[0] - cell.rI[1])) * (1 + nudge);
  const cuts = [];
  let allOk = true;
  for (let t = 1; t <= nCuts; t++) {
    const th = (Math.PI / 2) * (t / (nCuts + 1));
    const r = cellCutCorner(cell, Math.cos(th), Math.sin(th), NG);
    if (!r.ok) { allOk = false; continue; }
    cuts.push(r);
  }
  const all = cuts.concat([{ c1: 1, c2: 0, sig: axL }, { c1: 0, c2: 1, sig: axR }]);
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

const FLOOR = 0.232086;
const CEIL = 0.240015; // imp-95162 unconditional-window left endpoint
const CHART = { u0I: [1, 2], lI: [4, 8], rI: [4, 8] };
const boxAt = (muI, u2I) => ({ muI, ...CHART, u2I });
const ngFor = (muI) => (muI[1] - muI[0] < 2e-4 ? 80001 : 20001);

// THEOREM MC: deterministic adaptive (mu x u2) cover -- u0, l, r are never
// split (LEMMA CX: the certificate does not depend on their inner ends)
function coverRun(muFloor, muCeil, nCuts, margin) {
  const stack = [{ muI: [muFloor, muCeil], u2I: [16, 32], depth: 0 }];
  const cells = [];
  let maxDepth = 0, worst = -Infinity, nEval = 0, unresolved = 0;
  while (stack.length) {
    const c = stack.pop();
    const r = certifyCell(boxAt(c.muI, c.u2I), nCuts, ngFor(c.muI));
    nEval++;
    maxDepth = Math.max(maxDepth, c.depth);
    if (r.allOk && r.worst < 1 - margin) {
      let chol = true;
      for (const M of r.mats) if (!cholCertifies(M, 1 - margin)) chol = false;
      if (chol) { cells.push({ ...c, worst: r.worst }); worst = Math.max(worst, r.worst); continue; }
    }
    if (c.depth >= 60) { unresolved++; continue; }
    const wu2 = c.u2I[1] - c.u2I[0], wmu = c.muI[1] - c.muI[0];
    if (wu2 > 0.25 && (c.u2I[0] === 16 || wmu < 1e-5)) {
      const s = c.u2I[0] + Math.min(wu2 / 2, Math.max(0.25, wu2 / 8));
      stack.push({ muI: c.muI, u2I: [c.u2I[0], s], depth: c.depth + 1 });
      stack.push({ muI: c.muI, u2I: [s, c.u2I[1]], depth: c.depth + 1 });
    } else if (wmu > 5e-7) {
      const s = c.muI[0] + wmu / 2;
      stack.push({ muI: [c.muI[0], s], u2I: c.u2I, depth: c.depth + 1 });
      stack.push({ muI: [s, c.muI[1]], u2I: c.u2I, depth: c.depth + 1 });
    } else { unresolved++; }
  }
  return { cells, maxDepth, worst, nEval, unresolved };
}

// --------------------------------------------------------------------------
// (A) LEMMA CX bit-identity: the FULL positional chart box with degenerate
// u2 equals the zero-width anchor point cell, certificate-for-certificate
// --------------------------------------------------------------------------
{
  let worstDiff = 0;
  for (const mu of [FLOOR, 0.2325, 0.236, CEIL]) {
    const full = certifyCell(boxAt([mu, mu], [16, 16]), 65, 20001).worst;
    const anch = certifyCell({ muI: [mu, mu], u0I: [2, 2], lI: [4, 4], rI: [8, 8], u2I: [16, 16] }, 65, 20001).worst;
    worstDiff = Math.max(worstDiff, Math.abs(full - anch));
  }
  MEASURED.bitIdentity = { worstDiff };
  assertI(worstDiff === 0, `imp95165-cx-bit-identity(${worstDiff})`);
}

// --------------------------------------------------------------------------
// (B) THEOREM MC cover run: 9 cells, max depth 8, zero unresolved, worst
// 0.99998710570025984, exact partition of [FLOOR, CEIL] x [16, 32]
// --------------------------------------------------------------------------
const COVER = coverRun(FLOOR, CEIL, 65, 1e-6);
{
  const totA = (CEIL - FLOOR) * 16;
  const sumA = COVER.cells.reduce((s, c) => s + (c.muI[1] - c.muI[0]) * (c.u2I[1] - c.u2I[0]), 0);
  MEASURED.cover = {
    nCells: COVER.cells.length, maxDepth: COVER.maxDepth, unresolved: COVER.unresolved,
    worst: COVER.worst, areaRel: Math.abs(sumA - totA) / totA,
  };
  assertI(COVER.unresolved === 0, `imp95165-mc-unresolved(${COVER.unresolved})`);
  assertI(COVER.cells.length === 9 && COVER.maxDepth === 8, `imp95165-mc-shape(${COVER.cells.length},${COVER.maxDepth})`);
  assertI(Math.abs(COVER.worst - 0.99998710570025984) < 1e-9, `imp95165-mc-worst(${COVER.worst})`);
  assertI(COVER.worst < 1 - 1e-6, `imp95165-mc-margin(${COVER.worst})`);
  assertI(MEASURED.cover.areaRel < 1e-12, `imp95165-mc-partition(${MEASURED.cover.areaRel})`);
}

// --------------------------------------------------------------------------
// (C) soundness battery: 400 random middle-chart geometries x nonnegative
// profiles across the WHOLE chart and band (every 10th draw pinned at the
// binding corner mu = FLOOR, u0 = 2, hull [4, 8], u2 = 16): every draw is
// located in exactly one cover cell, violates no cut of that cell, and its
// exact degenerate-frame lambda stays below the certified cell bound
// --------------------------------------------------------------------------
{
  let st = 951651;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  const certCache = new Map();
  const certOf = (idx) => {
    if (!certCache.has(idx)) {
      const c = COVER.cells[idx];
      certCache.set(idx, certifyCell(boxAt(c.muI, c.u2I), 65, ngFor(c.muI)));
    }
    return certCache.get(idx);
  };
  let worstCut = -Infinity, worstLam = -Infinity, worstAbs = -Infinity, located = 0;
  for (let t = 0; t < 400; t++) {
    const corner = t % 10 === 0;
    const mu = corner ? FLOOR : FLOOR + rnd() * (CEIL - FLOOR);
    const u0 = corner ? 2 : 1 + rnd();
    let l = corner ? 4 : 4 + rnd() * 4, r = corner ? 8 : 4 + rnd() * 4;
    if (l > r) { const tt = l; l = r; r = tt; }
    const u2 = corner ? 16 : 16 + rnd() * 16;
    const idx = COVER.cells.findIndex((c) => mu >= c.muI[0] && mu <= c.muI[1] && u2 >= c.u2I[0] && u2 <= c.u2I[1]);
    if (idx < 0) continue;
    located++;
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
    for (const c of certOf(idx).cuts) worstCut = Math.max(worstCut, c.c1 * bL + c.c2 * bR - c.sig);
    const lam = lamMaxSym(majFrame({ muI: [mu, mu], u0I: [u0, u0], lI: [l, l], rI: [r, r], u2I: [u2, u2] }, bL, bR));
    worstLam = Math.max(worstLam, lam - COVER.cells[idx].worst);
    worstAbs = Math.max(worstAbs, lam);
  }
  MEASURED.battery = { located, worstCut, worstLam, worstAbs };
  assertI(located === 400, `imp95165-battery-located(${located})`);
  assertI(worstCut <= 1e-12, `imp95165-battery-cuts(${worstCut})`);
  assertI(worstLam <= 1e-9, `imp95165-battery-lambda(${worstLam})`);
  assertI(worstAbs < 1, `imp95165-battery-below-one(${worstAbs})`);
}

// --------------------------------------------------------------------------
// (D) floor ledger and odd-parity composition literals
// --------------------------------------------------------------------------
const INTRINSIC = 0.2320720394; // k = 1 anchor crossing (imp-95159/95163)
const OLD_CHART_FLOOR = 0.240015; // imp-95158 middle-chart cover floor
const POINTWISE_STALL = 0.232084; // imp-95163 65-cut anchor stall
{
  const gapNew = FLOOR - INTRINSIC, gapOld = OLD_CHART_FLOOR - INTRINSIC;
  const S = (m) => g(2 * m) + g(8 * m) + g(14 * m) + 2 * g(56 * m) + 2 * g(248 * m);
  MEASURED.ledger = { gapNew, gapOld, contraction: gapOld / gapNew, S2f: S(2 * FLOOR) };
  assertI(gapNew > 1.39e-5 && gapNew < 1.4e-5, `imp95165-ledger-gap-new(${gapNew})`);
  assertI(MEASURED.ledger.contraction > 560 && MEASURED.ledger.contraction < 580, `imp95165-ledger-contraction(${MEASURED.ledger.contraction})`);
  assertI(FLOOR > POINTWISE_STALL && FLOOR > 0.2320723, "imp95165-ledger-floor-honest");
  assertI(2 * FLOOR > 0.45 && MEASURED.ledger.S2f < 0.889, `imp95165-odd-parity-rw(${MEASURED.ledger.S2f})`);
}

// --------------------------------------------------------------------------
// verdict object
// --------------------------------------------------------------------------
export const IMP95165_MIDDLE_CHART_PD_COVER = {
  id: "imp-95165",
  title:
    "Full middle-chart PD positional cover: LEMMA CX (the LEMMA PI certificate depends on the positional cell only through (u0hi, llo, rhi, u2lo, u2hi), and the full-chart box corner (2, 4, 8, 16) IS the imp-95163 anchor, so with corner-adapted projection coefficients the chart-wide cut family equals the zero-width anchor family bit-for-bit and the 5-D positional cover collapses to a 2-D (mu x u2) cover) + THEOREM MC (9-cell adaptive cover of [0.232086, 0.240015] x u2 [16, 32], zero unresolved, worst 0.99998710570025984, every vertex Cholesky-certified below 1 - 1e-6): item (ii) of imp-95163-subgap-pd-positional-cover is CLOSED at a chart-wide floor EQUAL to the pointwise record 0.232086",
  rigorous: {
    lemmaCX:
      "structural rereading of LEMMA PI: the cut reads (u0hi, llo, rhi, u2lo), the atoms sit at (llo, rhi), the LEMMA PN majorant reads (u0hi, rhi, u2lo, u2hi); u0lo, lhi, rlo never enter, and (alpha, beta) may be fixed by the CORNER-target normal equations because LEMMA PI soundness is independent of the choice -- hence the full middle-chart positional box is certified exactly as strongly as the zero-width anchor cell, modulo only the two u2hi tail entries",
    theoremMC:
      "each cover cell is a sound THEOREM PW instance (LEMMA PI cuts + KN axis caps + LEMMA PV vertex reduction + LEMMA PN majorant + positive-pivot Cholesky), the cells partition the band exactly, and the union statement -- every middle-chart geometry, every k, every nonnegative hull profile, every mu in [0.232086, 0.240015] has frame lambda_max < 1 -- follows cell by cell",
  },
  measured: {
    cover:
      "9 cells, max depth 8, zero unresolved, worst certified bound 0.99998710570025984, run ~0.3 s: two u2 tiles [16, 16.25] / [16.25, 18] / [18, 32] handle the whole band above mu 0.2360505, and 7 geometrically shrinking mu bands on the u2 in [16, 16.25] tile reach the floor; area partition defect ~2e-16",
    floorLedger:
      "chart floor moves 0.240015 (imp-95158 cover) to 0.232086 -- equal to the imp-95163 pointwise 65-cut record, 2e-6 above the recorded pointwise stall 0.232084; distance to the intrinsic anchor crossing 0.2320720394 contracts from 7.943e-3 to 1.396e-5 (factor ~569)",
    battery:
      "400 random full-chart draws (u0 in [1,2], hull in [4,8] with k up to 12, u2 in [16,32], every 10th pinned at the binding corner at the floor): all located in a cover cell, no cut violated (worst excess -9.2e-10), every exact degenerate-frame lambda below its covering cell bound (worst gap -1.4e-5), absolute worst 0.999972689",
    oddParity:
      "2 x 0.232086 = 0.464172 > 0.45 and the carried THEOREM RW row-sum cap gives S(0.464172) = 0.888371 < 1: odd-parity middle configs on the band close through LEMMA OP + THEOREM RW configuration-free",
  },
  adversarialRecord:
    "the floor is certificate-sharp, not intrinsic: it cannot pass the pointwise anchor stall 0.232084 because the anchor is the chart corner itself, and the residual 1.4e-5 to the intrinsic crossing is cut-family relaxation slack; at NG = 20001 the three deepest cells fail on grid-Lipschitz inflation and need NG = 80001 (both settings sound -- resolution cost only); the imp-95164 midpoint (alpha, beta) choice does NOT cover the chart (full box fails at mu = 0.24, measured 1.0012) -- the LEMMA CX corner adaptation is load-bearing",
  openSubGap: {
    name: "imp-95163-subgap-pd-positional-cover",
    status: "OPEN",
    update:
      "items (i) and (ii) are CLOSED (imp-95164 positional interval cuts; this module, the full middle-chart cover at floor 0.232086); remaining: item (iii) ONLY -- the repricing of the middle-chart inheritors (mixed pair (0,1), surviving frame, triple-heavy), whose imp-95161 collapsed matrices carry the imp-95158 factor-2 tail literals 2g(32mu)/2g(224mu) and do not inherit from this factor-1 cover without a domination or repricing lemma; until then the inheritor floor stays 0.240015",
  },
  carried: {
    classSandwich: [0.2320723, 0.24502],
    unconditionalWindow: [0.240015, 0.24502],
    ladderFloorKle4: 47 / 200,
    intrinsicAnchorCrossing: INTRINSIC,
    pointwiseStall: POINTWISE_STALL,
    oldChartFloor: OLD_CHART_FLOOR,
    newChartFloor: FLOOR,
    directMiddleChannelClosed: [FLOOR, 0.24502],
  },
  promotesBound: false,
  noQED: true,
  sota: "No refereed bound is changed",
};

// --------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// --------------------------------------------------------------------------
export const IMP95165_MIDDLE_CHART_PD_COVER_ASSERTIONS = [
  {
    id: "imp95165-lemma-cx-bit-identity",
    description:
      "LEMMA CX: the FULL middle-chart positional box (u0 [1,2] x hull [4,8] x degenerate u2 = 16) produces a certificate bit-identical (diff exactly 0) to the zero-width anchor point cell at four band rates -- chart positional width is free on the cut side",
    holds: () => MEASURED.bitIdentity.worstDiff === 0,
  },
  {
    id: "imp95165-theorem-mc-cover",
    description:
      "THEOREM MC: the deterministic adaptive (mu x u2) cover of [0.232086, 0.240015] x [16, 32] closes with 9 cells, max depth 8, zero unresolved, worst certified bound 0.99998710570025984 (every polygon vertex positive-pivot Cholesky below 1 - 1e-6), and the cells partition the band exactly",
    holds: () =>
      MEASURED.cover.nCells === 9 && MEASURED.cover.maxDepth === 8 && MEASURED.cover.unresolved === 0 &&
      Math.abs(MEASURED.cover.worst - 0.99998710570025984) < 1e-9 && MEASURED.cover.worst < 1 - 1e-6 &&
      MEASURED.cover.areaRel < 1e-12,
  },
  {
    id: "imp95165-soundness-battery",
    description:
      "400 random full-chart (geometry, nonnegative profile) draws -- including corner-pinned draws at the binding corner at the floor -- are all located in a cover cell, violate no interval cut (excess <= 1e-12), and their exact degenerate-frame lambda stays below the certified bound of the covering cell",
    holds: () =>
      MEASURED.battery.located === 400 && MEASURED.battery.worstCut <= 1e-12 &&
      MEASURED.battery.worstLam <= 1e-9 && MEASURED.battery.worstAbs < 1,
  },
  {
    id: "imp95165-floor-ledger",
    description:
      "the chart-wide floor 0.232086 equals the imp-95163 pointwise record, sits above the pointwise stall 0.232084 and above the class floor 0.2320723, and contracts the chart-floor distance to the intrinsic anchor crossing from 7.943e-3 (old floor 0.240015) to 1.396e-5 -- factor ~569",
    holds: () =>
      MEASURED.ledger.gapNew > 1.39e-5 && MEASURED.ledger.gapNew < 1.4e-5 &&
      MEASURED.ledger.contraction > 560 && MEASURED.ledger.contraction < 580 &&
      FLOOR > POINTWISE_STALL && FLOOR > 0.2320723,
  },
  {
    id: "imp95165-odd-parity-composition",
    description:
      "odd-parity middle configs on the covered band compose through the carried LEMMA OP doubling into rates 2 mu >= 0.464172 > 0.45 where the carried THEOREM RW row-sum cap S is below 1 (S(0.464172) = 0.888371) -- closed configuration-free",
    holds: () => 2 * FLOOR > 0.45 && MEASURED.ledger.S2f < 0.889,
  },
  {
    id: "imp95165-honest-record-literals",
    description:
      "No class constant moves: class sandwich [0.2320723, 0.24502], unconditional window [0.240015, 0.24502], k<=4 ladder floor 47/200 carried unchanged; only the DIRECT middle-chart channel floor moves to 0.232086 -- inheritors stay at 0.240015 pending item (iii), which is the sole remaining sub-gap item; no bound promotion; no QED",
    holds: () =>
      IMP95165_MIDDLE_CHART_PD_COVER.carried.classSandwich[0] === 0.2320723 &&
      IMP95165_MIDDLE_CHART_PD_COVER.carried.classSandwich[1] === 0.24502 &&
      IMP95165_MIDDLE_CHART_PD_COVER.carried.unconditionalWindow[0] === 0.240015 &&
      IMP95165_MIDDLE_CHART_PD_COVER.carried.ladderFloorKle4 === 47 / 200 &&
      IMP95165_MIDDLE_CHART_PD_COVER.openSubGap.status === "OPEN" &&
      IMP95165_MIDDLE_CHART_PD_COVER.promotesBound === false &&
      IMP95165_MIDDLE_CHART_PD_COVER.noQED === true,
  },
];

for (const a of IMP95165_MIDDLE_CHART_PD_COVER_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95165-middle-chart-pd-cover assertion failed: ${a.id}`);
}
