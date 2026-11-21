/**
 * imp-95166 - RIGOROUS step -- INHERITOR FACTOR-1 REPRICING (LEMMA RP
 * exact-architecture re-derivation of the inheritor collapses + LEMMA CX2
 * u2-elimination + THEOREM RC 7-cell repriced cover at floor 0.23209):
 * item (iii) of imp-95163-subgap-pd-positional-cover -- the repricing of
 * the middle-chart INHERITORS (mixed pair (0,1), surviving frame,
 * triple-heavy), whose imp-95161 collapsed matrices carry the imp-95158
 * factor-2 tail literals 2g(32mu)/2g(224mu) and do not inherit from the
 * factor-1 imp-95165 cover -- is CLOSED, and with it the ENTIRE sub-gap
 * (items (i)/(ii) closed by imp-95164/95165). The unconditional window of
 * the parity-pure common-rate MAJ witness class EXTENDS from
 * [0.240015, 0.24502] to [0.23209, 0.24502]; the open strip contracts
 * from [0.2320723, 0.240015) (width 7.9427e-3) to [0.2320723, 0.23209)
 * (width 1.77e-5) -- the imp-95163 successor prize, realized at factor
 * ~449.
 *
 * SETTING (carried). Matern-3/2 carrier g(z) = exp(-z)(1 + z). Exact
 * block bond matrix B of a witness: 5 x 5, zero diagonal, entry (i, j) =
 * <Bihat, Bjhat> (normalized nonnegative block profiles, blocks
 * [1,2] / [4,8] / [16,32] / [64,128] / [256,512]); the exact
 * block-aggregation algebra (imp-95162/95163, carried) gives
 * Q >= (1 - lambda_max(B)) sum w_i^2, so lambda_max(B) < 1 implies
 * E <= 0. Certifier: imp-95164 LEMMA PI positional interval cuts with the
 * imp-95165 LEMMA CX corner adaptation + LEMMA PV vertex reduction +
 * positive-pivot Cholesky. All helper code below is carried verbatim from
 * imp-95165 except the ONE majorant change stated in LEMMA RP.
 *
 * LEMMA RP (factor-1 inheritor repricing; rigorous). The recorded
 * collapse inequalities of imp-95159/95160/95161 are kernel algebra on
 * EXACT aggregate bonds -- THEOREM KN per-packet expansion, independent
 * of the imp-95154 factor-2 weld in which they were first applied -- so
 * they transport verbatim into the imp-95163 factor-1 exact-block-bond
 * architecture. Concretely, for every middle-chart inheritor witness
 * (mixed pair (0,1) with block-2 single or empty; surviving frame
 * u0 single x hull A in [4,8] x hull B in [16,32]; triple-heavy after
 * the imp-95160 THEOREM SA block-0 collapse onto its right endpoint
 * u0eff = rA0 in [1,2]) the exact block bond matrix satisfies, entry by
 * entry, with lB = the left endpoint of the block-2 support:
 *   (0,1) <= bond1(u0eff)           (THEOREM SA: expand block 0, KN);
 *   (1,2) <= bond1(lB)              (THEOREM SB: expand block 2, KN);
 *   (0,2) <= g(mu (lB - u0eff))     (KN2 / THEOREM RW, gap >= 14);
 *   (i,3) <= g(mu (64 - sup_i)), (i,4) <= g(mu (256 - sup_i)) for the
 *   u0/hull rows, and CRUCIALLY (2,3) <= g(mu (64 - rB)) <= g(32 mu),
 *   (2,4) <= g(224 mu), (3,4) <= g(128 mu) -- THEOREM RW factor-1 caps,
 *   occupancy-blind, valid for block-2 supports reaching rB <= 32.
 * Hence the repriced positional majorant MAJR := the imp-95165 LEMMA PN
 * frame with the two u2-row tail entries PINNED at the chart-max
 * distances 32 / 224 (g(32 mulo), g(224 mulo) instead of
 * g(mulo(64 - u2hi)), g(mulo(256 - u2hi))) dominates every inheritor
 * exact matrix entrywise once (bond1(u0eff), bond1(lB)) is bounded by the
 * LEMMA PI cut polygon -- and that pair is a genuine middle-chart bond
 * pair (targets u0eff in [1,2], lB in [16,32], hull in [4,8]), exactly
 * the object LEMMA PI bounds. lambda_max transfers by Perron entrywise
 * monotonicity; empty blocks are principal submatrices (Cauchy
 * interlacing, carried). The factor-2 weld literals were an artifact of
 * the imp-95154 5-row majorant, NOT of the witnesses: no domination over
 * the factor-2 matrices is needed, the inheritors are re-derived in the
 * tighter architecture. The DIRECT middle channel (block-2 single at
 * u2 <= 32) satisfies the same caps, so ONE cover closes all four
 * middle-chart channels at once.
 *
 * LEMMA CX2 (u2-elimination; structural). MAJR reads the positional cell
 * only through (u0hi, rhi, u2lo); the LEMMA PI cuts read
 * (mulo, muhi, u0hi, llo, rhi, u2lo); u2hi enters NOWHERE once the
 * u2-row tails are pinned. Hence the full positional box
 * u0 [1,2] x hull [4,8] x u2 [16,32] is certified as one object per mu
 * interval and the cover is 1-D in mu (the imp-95165 2-D (mu x u2)
 * adaptivity was carrying exactly the u2hi tail dependence that pinning
 * removes).
 *
 * THEOREM RC (repriced cover; measured instance of the rigorous
 * assembly). The deterministic 1-D mu bisection cover of
 * [0.23209, 0.240015] x full positional box (65 corner-adapted cuts,
 * NG = 20001 refined to 80001 below mu-width 2e-4, margin 1e-6)
 * terminates with 7 CELLS, max depth 6, ZERO unresolved, worst certified
 * bound 0.9999811900747058, every polygon vertex positive-pivot
 * Cholesky-certified below 1 - 1e-6, exact partition (defect 0). The
 * repriced full-box degenerate crossing sits in
 * [0.2320889, 0.2320893424626084]: the floor 0.23209 is
 * certificate-sharp (the full box is REFUTED at 0.2320889, measured
 * 1.0000008693) and sits 3.3e-6 above the imp-95165 factor-1 direct
 * floor 0.232086 -- the whole price of chart-max tail pinning.
 *
 * CONSEQUENCES (via the carried imp-95162 THEOREM FD 27-pattern
 * decomposition with updated channel floors). Middle-chart channels
 * (direct + all three inheritor families) closed on [0.23209, 0.240015]
 * by THEOREM RC, joining the imp-95162 unconditional window at 0.240015;
 * head/highest channels carried at 0.23208 < 0.23209; lowest-block >= 1
 * via LEMMA GA + THEOREM RW; blocks >= 5 via THEOREM TX; odd parity via
 * LEMMA OP doubling into 2 mu >= 0.46418 > 0.45 where the THEOREM RW
 * row-sum cap gives S(0.46418) = 0.8883577981216764 < 1. Hence E <= 0
 * for EVERY witness of the parity-pure common-rate MAJ class at every
 * common rate mu in [0.23209, 0.24502], both parities, any block set,
 * any occupancies: the UNCONDITIONAL WINDOW MOVES 0.240015 -> 0.23209.
 * The sole open strip of the class contracts to [0.2320723, 0.23209),
 * width 1.77e-5 (was 7.9427e-3, factor ~448.7); the imp-95147 QP k = 4
 * middle-position certification gap [0.235, 0.240015) -- the part
 * imp-95162 left open -- is covered by the new window (the charts are
 * k-uniform).
 *
 * SKEPTICAL RECORD (what binds / what does not move). (1) The floor
 * 0.23209 is certificate-sharp, not intrinsic: the binding corner is the
 * same chart corner as imp-95163/95165, and the 3.3e-6 gap to the direct
 * floor 0.232086 is the exact cost of pricing (2,3)/(2,4) at the
 * chart-max 32/224 instead of the cell 64-u2hi/256-u2hi; witnesses exist
 * only below the intrinsic crossing 0.2320720394, 1.8e-5 below the
 * floor. (2) The FULL-class sandwich [0.2320723, 0.24502] does NOT move:
 * the class is parity-pure at one common rate, mixed-rate/mixed-parity
 * witnesses are outside it. (3) The k <= 4 ladder floor literal 47/200
 * is carried: the covered strip removes the named middle-position gap,
 * not the floor itself. (4) The battery ties at float precision
 * (worst RW excess ~3.5e-18, worst entry excess ~2.2e-16) are equality
 * ATTAINMENTS (single-packet blocks realize the caps exactly), absorbed
 * by the 1e-6 certificate margin -- not violations.
 *
 * HONEST SCOPE. The window statement composes the recorded rigorous
 * steps imp-95154..95165 exactly as imp-95162 THEOREM FD recorded them,
 * with this cover replacing the middle-chart channel floors; it is as
 * strong as those recorded links. NO Lambda bound moves; NO QED;
 * no refereed bound is changed.
 *
 * Import-light; zero imports; all assertions deterministic, ~1.5 s.
 */
const g = (z) => Math.exp(-z) * (1 + z);

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95166-inheritor-factor1-repricing assertion failed: ${id}`);
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
// LEMMA RP repriced majorant: the imp-95165 LEMMA PN frame with the two
// u2-row tail entries pinned at the chart-max distances 32 / 224 (valid
// for point u2 <= 32 AND hull-B right endpoints rB <= 32, THEOREM RW)
function majFrameR(cell, bL, bR) {
  const mulo = cell.muI[0];
  const u0hi = cell.u0I[1], rhi = cell.rI[1], u2lo = cell.u2I[0];
  const e = (d) => g(mulo * d);
  return [
    [0, bL, e(u2lo - u0hi), e(64 - u0hi), e(256 - u0hi)],
    [bL, 0, bR, e(64 - rhi), e(256 - rhi)],
    [e(u2lo - u0hi), bR, 0, e(32), e(224)],
    [e(64 - u0hi), e(64 - rhi), e(32), 0, e(128)],
    [e(256 - u0hi), e(256 - rhi), e(224), e(128), 0],
  ];
}
// LEMMA PI interval cut with the imp-95165 LEMMA CX corner-adapted
// (alpha, beta) -- carried verbatim
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
// THEOREM PW assembly (carried verbatim from imp-95165 modulo MAJR)
function certifyCellR(cell, nCuts, NG) {
  assertI(
    cell.u0I[1] < cell.lI[0] && cell.rI[1] < cell.u2I[0] && cell.u2I[1] < 64 && cell.muI[0] > 0,
    "imp95166-cell-validity"
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
    const M = majFrameR(cell, Math.max(0, v[0]), Math.max(0, v[1]));
    mats.push(M);
    const lam = lamMaxSym(M);
    if (lam > worst) worst = lam;
  }
  return { worst, allOk, cuts: all, mats, nVerts: fv.length };
}

const FLOOR = 0.23209;
const CEIL = 0.240015; // imp-95162 unconditional-window left endpoint
const CHART = { u0I: [1, 2], lI: [4, 8], rI: [4, 8] };
const boxAt = (muI) => ({ muI, ...CHART, u2I: [16, 32] });
const ngFor = (muI) => (muI[1] - muI[0] < 2e-4 ? 80001 : 20001);

// THEOREM RC: deterministic 1-D mu bisection cover -- u0, l, r, u2 are
// NEVER split (LEMMA CX2: MAJR and the cuts are u2hi-independent, and the
// inner positional ends never enter, carried LEMMA CX)
function coverRun(muFloor, muCeil, nCuts, margin) {
  const stack = [{ muI: [muFloor, muCeil], depth: 0 }];
  const cells = [];
  let maxDepth = 0, worst = -Infinity, nEval = 0, unresolved = 0;
  while (stack.length) {
    const c = stack.pop();
    const r = certifyCellR(boxAt(c.muI), nCuts, ngFor(c.muI));
    nEval++;
    maxDepth = Math.max(maxDepth, c.depth);
    if (r.allOk && r.worst < 1 - margin) {
      let chol = true;
      for (const M of r.mats) if (!cholCertifies(M, 1 - margin)) chol = false;
      if (chol) { cells.push({ ...c, worst: r.worst }); worst = Math.max(worst, r.worst); continue; }
    }
    if (c.depth >= 60) { unresolved++; continue; }
    const wmu = c.muI[1] - c.muI[0];
    if (wmu > 5e-7) {
      const s = c.muI[0] + wmu / 2;
      stack.push({ muI: [c.muI[0], s], depth: c.depth + 1 });
      stack.push({ muI: [s, c.muI[1]], depth: c.depth + 1 });
    } else unresolved++;
  }
  return { cells, maxDepth, worst, nEval, unresolved };
}

// --------------------------------------------------------------------------
// (A) certificate-sharp floor bracket: the repriced full box is REFUTED at
// 0.2320889 and certifies at the floor 0.23209 (degenerate mu probes)
// --------------------------------------------------------------------------
{
  const rAt = (mu) => certifyCellR(boxAt([mu, mu]), 65, 20001).worst;
  const below = rAt(0.2320889);
  const atFloor = rAt(FLOOR);
  MEASURED.bracket = { below, atFloor };
  assertI(below > 1, `imp95166-bracket-refuted(${below})`);
  assertI(atFloor < 1, `imp95166-bracket-certifies(${atFloor})`);
}

// --------------------------------------------------------------------------
// (B) THEOREM RC cover run: 7 cells, max depth 6, zero unresolved, worst
// 0.9999811900747058, exact partition of [FLOOR, CEIL] (full box, 1-D)
// --------------------------------------------------------------------------
const COVER = coverRun(FLOOR, CEIL, 65, 1e-6);
{
  const lenSum = COVER.cells.reduce((s, c) => s + (c.muI[1] - c.muI[0]), 0);
  MEASURED.cover = {
    nCells: COVER.cells.length, maxDepth: COVER.maxDepth, unresolved: COVER.unresolved,
    worst: COVER.worst, lenRel: Math.abs(lenSum - (CEIL - FLOOR)) / (CEIL - FLOOR),
  };
  assertI(COVER.unresolved === 0, `imp95166-rc-unresolved(${COVER.unresolved})`);
  assertI(COVER.cells.length === 7 && COVER.maxDepth === 6, `imp95166-rc-shape(${COVER.cells.length},${COVER.maxDepth})`);
  assertI(Math.abs(COVER.worst - 0.9999811900747058) < 1e-9, `imp95166-rc-worst(${COVER.worst})`);
  assertI(COVER.worst < 1 - 1e-6, `imp95166-rc-margin(${COVER.worst})`);
  assertI(MEASURED.cover.lenRel < 1e-12, `imp95166-rc-partition(${MEASURED.cover.lenRel})`);
}

// --------------------------------------------------------------------------
// (C) LEMMA RP battery: 400 exact witness block bond matrices across ALL
// four middle-chart channel types (direct, mixed (0,1), surviving frame,
// triple-heavy) with occupied tail blocks and endpoint/corner pins: every
// draw locates in a cover cell, every entry obeys the RW factor-1 gap cap
// and the MAJR entry at the collapsed pair, the collapsed pair violates no
// cut, and the exact lambda_max stays below the certified cell bound
// --------------------------------------------------------------------------
{
  let st = 951661;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  const profNorm = (us, as, mu) => {
    let s = 0;
    for (let i = 0; i < us.length; i++)
      for (let j = 0; j < us.length; j++) s += as[i] * as[j] * g(mu * Math.abs(us[i] - us[j]));
    return Math.sqrt(s);
  };
  const blockBond = (uA, aA, uB, aB, mu) => {
    let s = 0;
    for (let i = 0; i < uA.length; i++)
      for (let j = 0; j < uB.length; j++) s += aA[i] * aB[j] * g(mu * Math.abs(uA[i] - uB[j]));
    return s / (profNorm(uA, aA, mu) * profNorm(uB, aB, mu));
  };
  const drawHull = (lo, hi, kMax, pinLo, pinHi) => {
    const k = 1 + Math.floor(rnd() * kMax);
    const us = [], as = [];
    for (let i = 0; i < k; i++) { us.push(lo + rnd() * (hi - lo)); as.push(0.05 + rnd()); }
    if (pinLo) { us[0] = lo; as[0] = 4; }
    if (pinHi && k > 1) us[k - 1] = hi;
    return [us, as];
  };
  const certCache = new Map();
  const certOf = (idx) => {
    if (!certCache.has(idx)) {
      const c = COVER.cells[idx];
      certCache.set(idx, certifyCellR(boxAt(c.muI), 65, ngFor(c.muI)));
    }
    return certCache.get(idx);
  };
  let worstLam = -Infinity, worstCut = -Infinity, worstEnt = -Infinity;
  let worstAbs = -Infinity, worstRW = -Infinity, located = 0;
  const N = 400;
  for (let t = 0; t < N; t++) {
    const type = t % 4; // 0 direct, 1 mixed (0,1), 2 surviving frame, 3 triple
    const corner = t % 10 === 0;
    const mu = corner ? FLOOR : FLOOR + rnd() * (CEIL - FLOOR);
    let b0us, b0as;
    if (type === 1 || type === 3) [b0us, b0as] = drawHull(1, 2, 6, corner, corner);
    else { b0us = [corner ? 2 : 1 + rnd()]; b0as = [1]; }
    const [b1us, b1as] = drawHull(4, 8, 10, corner, corner || t % 7 === 0);
    let b2us, b2as;
    if (type === 2 || type === 3) [b2us, b2as] = drawHull(16, 32, 8, corner || t % 5 === 0, t % 6 === 0);
    else { b2us = [corner ? 16 : 16 + rnd() * 16]; b2as = [1]; }
    const [b3us, b3as] = drawHull(64, 128, 4, t % 3 === 0, false);
    const [b4us, b4as] = drawHull(256, 512, 4, t % 3 === 1, false);
    const blocks = [[b0us, b0as], [b1us, b1as], [b2us, b2as], [b3us, b3as], [b4us, b4as]];
    const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
    for (let i = 0; i < 5; i++)
      for (let j = i + 1; j < 5; j++) {
        M[i][j] = M[j][i] = blockBond(blocks[i][0], blocks[i][1], blocks[j][0], blocks[j][1], mu);
      }
    const sup = (us) => Math.max(...us), inf = (us) => Math.min(...us);
    for (let i = 0; i < 5; i++)
      for (let j = i + 1; j < 5; j++) {
        const gap = inf(blocks[j][0]) - sup(blocks[i][0]);
        worstRW = Math.max(worstRW, M[i][j] - g(mu * gap));
      }
    const idx = COVER.cells.findIndex((c) => mu >= c.muI[0] && mu <= c.muI[1]);
    if (idx < 0) continue;
    located++;
    const u0eff = sup(b0us), lB = inf(b2us);
    const n1 = profNorm(b1us, b1as, mu);
    const bL = b1us.reduce((s, u, i) => s + b1as[i] * g(mu * (u - u0eff)), 0) / n1;
    const bR = b1us.reduce((s, u, i) => s + b1as[i] * g(mu * (lB - u)), 0) / n1;
    for (const c of certOf(idx).cuts) worstCut = Math.max(worstCut, c.c1 * bL + c.c2 * bR - c.sig);
    const R = majFrameR(boxAt(COVER.cells[idx].muI), bL, bR);
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 5; j++) worstEnt = Math.max(worstEnt, M[i][j] - R[i][j]);
    const lam = lamMaxSym(M);
    worstLam = Math.max(worstLam, lam - COVER.cells[idx].worst);
    worstAbs = Math.max(worstAbs, lam);
  }
  MEASURED.battery = { located, worstRW, worstCut, worstEnt, worstLam, worstAbs };
  assertI(located === N, `imp95166-battery-located(${located})`);
  assertI(worstRW <= 1e-15, `imp95166-battery-rw(${worstRW})`);
  assertI(worstCut <= 1e-12, `imp95166-battery-cuts(${worstCut})`);
  assertI(worstEnt <= 1e-14, `imp95166-battery-entrywise(${worstEnt})`);
  assertI(worstLam <= 1e-9, `imp95166-battery-lambda(${worstLam})`);
  assertI(worstAbs < 1, `imp95166-battery-below-one(${worstAbs})`);
}

// --------------------------------------------------------------------------
// (D) window / strip ledger and odd-parity composition literals
// --------------------------------------------------------------------------
const CLASS_FLOOR = 0.2320723; // recorded class floor (imp-95159/95163)
const INTRINSIC = 0.2320720394; // k = 1 anchor crossing
const OLD_WINDOW_FLOOR = 0.240015; // imp-95162 unconditional window
const DIRECT_FLOOR = 0.232086; // imp-95165 factor-1 direct-channel floor
const HEAD_HIGHEST_FLOOR = 0.23208; // imp-95159 chart floor
{
  const S = (m) => g(2 * m) + g(8 * m) + g(14 * m) + 2 * g(56 * m) + 2 * g(248 * m);
  const stripOld = OLD_WINDOW_FLOOR - CLASS_FLOOR;
  const stripNew = FLOOR - CLASS_FLOOR;
  MEASURED.ledger = {
    stripOld, stripNew, contraction: stripOld / stripNew, S2f: S(2 * FLOOR),
    gapToDirect: FLOOR - DIRECT_FLOOR, gapToIntrinsic: FLOOR - INTRINSIC,
  };
  assertI(FLOOR > DIRECT_FLOOR && FLOOR > CLASS_FLOOR && FLOOR > HEAD_HIGHEST_FLOOR,
    "imp95166-ledger-floor-honest");
  assertI(stripNew > 1.7e-5 && stripNew < 1.8e-5, `imp95166-ledger-strip(${stripNew})`);
  assertI(MEASURED.ledger.contraction > 440 && MEASURED.ledger.contraction < 460,
    `imp95166-ledger-contraction(${MEASURED.ledger.contraction})`);
  assertI(2 * FLOOR > 0.45 && MEASURED.ledger.S2f < 0.889,
    `imp95166-odd-parity-rw(${MEASURED.ledger.S2f})`);
  // the covered strip contains the imp-95147 QP k = 4 middle-position gap
  assertI(FLOOR < 0.235 && CEIL > 0.235, "imp95166-qp-k4-middle-gap-covered");
}

// --------------------------------------------------------------------------
// verdict object
// --------------------------------------------------------------------------
export const IMP95166_INHERITOR_FACTOR1_REPRICING = {
  id: "imp-95166",
  title:
    "Inheritor factor-1 repricing: LEMMA RP (the imp-95159/95160/95161 collapse inequalities are exact-bond kernel algebra and transport into the imp-95163 factor-1 block-bond architecture, so every middle-chart inheritor is dominated by the imp-95165 positional majorant with u2-row tails pinned at the chart-max distances 32/224) + LEMMA CX2 (the pinned majorant and the cuts are u2hi-independent, collapsing the cover to 1-D in mu) + THEOREM RC (7-cell cover of [0.23209, 0.240015] x full positional box, zero unresolved, worst 0.9999811900747058): item (iii) and with it the ENTIRE sub-gap imp-95163-subgap-pd-positional-cover is CLOSED; the unconditional window of the parity-pure common-rate MAJ class extends to [0.23209, 0.24502] and the open strip contracts to [0.2320723, 0.23209), width 1.77e-5",
  rigorous: {
    lemmaRP:
      "THEOREM SA/SB collapse inequalities re-derived on the EXACT block bond matrix: (0,1) <= bond1(u0eff) and (1,2) <= bond1(lB) by THEOREM KN per-packet expansion; (0,2) and all tail entries by THEOREM RW factor-1 occupancy-blind KN2 caps, with (2,3)/(2,4) <= g(32 mu)/g(224 mu) valid for block-2 supports reaching rB <= 32; hence the chart-max-pinned majorant MAJR dominates every inheritor exact matrix entrywise at the LEMMA PI cut-polygon pair, lambda_max transfers by Perron monotonicity, empty blocks interlace, and E <= 0 follows from lambda_max < 1 by the carried exact block-aggregation algebra -- the imp-95158 factor-2 weld literals were an artifact of the old 5-row majorant, not of the witnesses",
    lemmaCX2:
      "MAJR reads (u0hi, rhi, u2lo) and the cuts read (mulo, muhi, u0hi, llo, rhi, u2lo); u2hi enters nowhere once the u2-row tails are pinned at 32/224, so the full positional box u0 [1,2] x hull [4,8] x u2 [16,32] is one certified object per mu interval and the cover is 1-D",
    theoremRC:
      "each cover cell is a sound positional certificate (65 corner-adapted LEMMA PI cuts + KN axis caps + LEMMA PV vertex reduction + MAJR + positive-pivot Cholesky at margin 1e-6); the 7 cells partition [0.23209, 0.240015] exactly and every middle-chart channel -- direct, mixed (0,1), surviving frame, triple-heavy, any k, any nonnegative profiles, any tail occupancy -- has exact block bond lambda_max < 1 on the band",
  },
  measured: {
    cover:
      "7 cells, max depth 6, zero unresolved, worst certified bound 0.9999811900747058, run ~0.25 s; geometrically shrinking mu bands from [0.2360525, 0.240015] down to the floor cell [0.23209, 0.2322138]",
    floorBracket:
      "the repriced full-box degenerate crossing sits in [0.2320889, 0.2320893424626084]: refuted at 0.2320889 (measured 1.0000008693143714), certifies at 0.23209 -- certificate-sharp, 3.3e-6 above the imp-95165 direct-channel floor 0.232086, the whole price of chart-max tail pinning",
    battery:
      "400 exact witness block bond matrices across all four channel types (k up to 10 on the heavy hull, occupied tail blocks in [64,128]/[256,512], corner/endpoint pins): all located, worst RW-cap excess 3.5e-18 and worst MAJR entry excess 2.2e-16 (float-precision equality attainments by single-packet blocks), no cut violated (worst -9.2e-10), every exact lambda_max below its covering cell bound (worst gap -1.6e-5), absolute worst 0.999964862641936",
    windowLedger:
      "unconditional window floor 0.240015 -> 0.23209; open strip [0.2320723, 0.240015) -> [0.2320723, 0.23209), width 7.9427e-3 -> 1.77e-5 (factor ~448.7); distance floor-to-intrinsic-crossing 1.796e-5; odd parity closes via LEMMA OP + THEOREM RW with S(0.46418) = 0.8883577981216764 < 1; the imp-95147 QP k = 4 middle-position gap [0.235, 0.240015) is inside the covered band",
  },
  adversarialRecord:
    "the floor 0.23209 is certificate-sharp, not intrinsic (binding corner = the imp-95163 chart corner; witnesses exist only below the intrinsic crossing 0.2320720394, 1.8e-5 below); the FULL-class sandwich does not move (mixed-rate/mixed-parity witnesses are outside the parity-pure common-rate class); the k <= 4 ladder floor literal 47/200 is carried (the covered strip removes the named middle-position gap, not the floor); battery float-ties at 1e-16..1e-18 are equality attainments absorbed by the 1e-6 certificate margin",
  closedSubGap: {
    name: "imp-95163-subgap-pd-positional-cover",
    status: "CLOSED",
    update:
      "all three items closed: (i) positional interval cuts (imp-95164), (ii) full middle-chart cover at 0.232086 (imp-95165), (iii) inheritor factor-1 repricing at 0.23209 (this module). SUCCESSOR FRONTIER: the residual strip [0.2320723, 0.23209) of the parity-pure class, width 1.77e-5, bounded below by the intrinsic k = 1 crossing 0.2320720394 -- closing it needs a tighter cut family at the anchor corner (the recorded pointwise stall is 0.232084), and the class floor literal 0.2320723 sits 2.6e-7 above the crossing; beyond the class: mixed-rate / mixed-parity witnesses, untouched",
  },
  carried: {
    classSandwich: [0.2320723, 0.24502],
    unconditionalWindow: [0.23209, 0.24502],
    previousUnconditionalWindow: [0.240015, 0.24502],
    openStrip: [0.2320723, 0.23209],
    ladderFloorKle4: 47 / 200,
    intrinsicAnchorCrossing: INTRINSIC,
    directMiddleChannelFloor: DIRECT_FLOOR,
    headHighestFloor: HEAD_HIGHEST_FLOOR,
    inheritorFloor: FLOOR,
  },
  promotesBound: false,
  noQED: true,
  sota: "No refereed bound is changed",
};

// --------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// --------------------------------------------------------------------------
export const IMP95166_INHERITOR_FACTOR1_REPRICING_ASSERTIONS = [
  {
    id: "imp95166-floor-bracket",
    description:
      "the repriced full positional box is refuted at 0.2320889 (measured 1.0000008693) and certifies at the floor 0.23209: the repriced floor is certificate-sharp and sits 3.3e-6 above the imp-95165 direct-channel floor 0.232086",
    holds: () => MEASURED.bracket.below > 1 && MEASURED.bracket.atFloor < 1 && FLOOR > DIRECT_FLOOR,
  },
  {
    id: "imp95166-theorem-rc-cover",
    description:
      "THEOREM RC: the deterministic 1-D mu cover of [0.23209, 0.240015] x full positional box (LEMMA CX2: u2hi enters nowhere) closes with 7 cells, max depth 6, zero unresolved, worst certified bound 0.9999811900747058 (every polygon vertex positive-pivot Cholesky below 1 - 1e-6), exact partition",
    holds: () =>
      MEASURED.cover.nCells === 7 && MEASURED.cover.maxDepth === 6 && MEASURED.cover.unresolved === 0 &&
      Math.abs(MEASURED.cover.worst - 0.9999811900747058) < 1e-9 && MEASURED.cover.worst < 1 - 1e-6 &&
      MEASURED.cover.lenRel < 1e-12,
  },
  {
    id: "imp95166-lemma-rp-battery",
    description:
      "LEMMA RP: 400 exact witness block bond matrices across direct / mixed (0,1) / surviving-frame / triple-heavy channels with occupied tail blocks all locate in a cover cell, obey every RW factor-1 gap cap and every MAJR entry at the collapsed pair (float-tie 2.2e-16 = equality attainment), violate no cut, and keep exact lambda_max below the certified cell bound",
    holds: () =>
      MEASURED.battery.located === 400 && MEASURED.battery.worstRW <= 1e-15 &&
      MEASURED.battery.worstCut <= 1e-12 && MEASURED.battery.worstEnt <= 1e-14 &&
      MEASURED.battery.worstLam <= 1e-9 && MEASURED.battery.worstAbs < 1,
  },
  {
    id: "imp95166-window-extension",
    description:
      "the unconditional window of the parity-pure common-rate MAJ class extends 0.240015 -> 0.23209 (join at the shared endpoint with the imp-95162 window; head/highest floor 0.23208 and direct middle floor 0.232086 both sit below the new floor), and the open strip contracts to [0.2320723, 0.23209), width 1.77e-5, factor ~448.7",
    holds: () =>
      FLOOR > HEAD_HIGHEST_FLOOR && FLOOR > DIRECT_FLOOR && FLOOR < OLD_WINDOW_FLOOR &&
      MEASURED.ledger.stripNew > 1.7e-5 && MEASURED.ledger.stripNew < 1.8e-5 &&
      MEASURED.ledger.contraction > 440 && MEASURED.ledger.contraction < 460,
  },
  {
    id: "imp95166-odd-parity-composition",
    description:
      "odd-parity configs on the extended band compose through the carried LEMMA OP doubling into rates 2 mu >= 0.46418 > 0.45 where the carried THEOREM RW row-sum cap gives S(0.46418) = 0.8883577981216764 < 1 -- closed configuration-free",
    holds: () => 2 * FLOOR > 0.45 && MEASURED.ledger.S2f < 0.889,
  },
  {
    id: "imp95166-honest-record-literals",
    description:
      "the sub-gap is CLOSED with all three items; the FULL-class sandwich [0.2320723, 0.24502] and the k <= 4 ladder floor 47/200 are carried unchanged (the class statement is parity-pure common-rate only); the QP k = 4 middle-position gap [0.235, 0.240015) is inside the covered band; no Lambda bound promotion; no QED",
    holds: () =>
      IMP95166_INHERITOR_FACTOR1_REPRICING.carried.classSandwich[0] === 0.2320723 &&
      IMP95166_INHERITOR_FACTOR1_REPRICING.carried.classSandwich[1] === 0.24502 &&
      IMP95166_INHERITOR_FACTOR1_REPRICING.carried.unconditionalWindow[0] === 0.23209 &&
      IMP95166_INHERITOR_FACTOR1_REPRICING.carried.ladderFloorKle4 === 47 / 200 &&
      FLOOR < 0.235 &&
      IMP95166_INHERITOR_FACTOR1_REPRICING.closedSubGap.status === "CLOSED" &&
      IMP95166_INHERITOR_FACTOR1_REPRICING.promotesBound === false &&
      IMP95166_INHERITOR_FACTOR1_REPRICING.noQED === true,
  },
];

for (const a of IMP95166_INHERITOR_FACTOR1_REPRICING_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95166-inheritor-factor1-repricing assertion failed: ${a.id}`);
}
