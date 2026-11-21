/**
 * imp-95158 - RIGOROUS step -- FIRST POSITIONAL JET-PHANTOM COVER (LEMMA HI
 * hull inclusion + LEMMA OP parity doubling + the deterministic subdivision
 * cover): items (1) and (3) of the sub-gap imp-95154-subgap-jet-phantom-cover
 * are executed FOR THE MIDDLE-HEAVY CHART. The in-class middle-heavy frame
 * chart of the carried 5-row head/tail frame reduction --
 *   u0 in [1, 2] (block-0 single), heavy hull [hL, hR] with
 *   4 <= hL <= hR <= 8 (block 1: ANY packet count k >= 1 and ANY nonnegative
 *   hull profile via the imp-95154 jet reduction), u2 in [16, 32] (block-2
 *   single), tails pinned at 64 / 256 with weights 2 / 4 (carried majorant)
 * -- is COVERED by certified cells (imp-95156/95157 positional certifier,
 * zero unresolved) for every common rate mu in [0.240015, 0.49004]. Combined
 * with the THEOREM HS class ceiling 0.24502 and LEMMA OP, this certifies:
 * the k >= 5 SINGLE-HEAVY channel AT THE MIDDLE HEAD POSITION (at most one
 * packet in every other block) has E <= 0 for every common rate
 * mu >= 0.240015, BOTH parities -- conditional on the carried frame
 * reduction, the first k-uniform certified rate floor for that channel,
 * 4.5e-6 above the intrinsic corner crossing 0.2400105 (imp-95155), i.e.
 * essentially AT the wall that imp-95157 proved no sound certificate can
 * pass.
 *
 * LEMMA HI (hull inclusion; NEW -- makes the cover complete over degenerate
 * hulls). Every nonnegative profile supported on a sub-hull [a, b] of
 * [A, B] is a witness-class profile on [A, B]: its boundary jets
 * z = (S0L, S1L, S0R, S1R) use offsets t_i = x_i - A >= 0 and
 * s_i = B - x_i >= 0, so all four jet sign constraints hold, the exact
 * LEMMA JF/KU factorization applies verbatim, and the phantom bond region
 * of the outer hull CONTAINS that of every sub-hull; the KN tail caps price
 * hR at the cell maximum, which dominates the actual g(mu (64 - b)) since
 * g is decreasing. Hence ONE positional certificate at the outer hull
 * [hL_cellLo, hR_cellHi] covers ALL hulls in a cell -- including width-0
 * diagonal hulls (k packets at one point), which would otherwise violate
 * the W > 0 cell-validity requirement: NO sliver residual survives.
 *
 * LEMMA OP (parity doubling; NEW -- imports the odd parity for free). Odd
 * blocks sit at bases 2 x 4^b, so every position, gap, and frame literal
 * doubles (64 -> 128, 256 -> 512, 32 -> 64, 224 -> 448, 128 -> 256), and
 * the odd frame/phantom at rate mu equals the even frame/phantom at rate
 * 2 mu entrywise (asserted to 1e-15). Covering the even chart up to
 * mu = 0.49004 therefore closes the odd chart on [floor, 0.24502]: an odd
 * config at rate mu maps to the covered even evaluation at 2 mu <= 0.49004.
 *
 * PARETO FILTER (engineering, proved sound): lambda_max of the positional
 * majorant is entrywise nondecreasing in (b01, b12) (LEMMA PV), so only
 * Pareto-maximal polygon vertices can attain the max; dominated vertices
 * are skipped. Asserted lossless: the point-cell anchor values reproduce
 * the imp-95155 certified literals 1.010770 / 1.000022 / 0.989803 to 5e-6.
 *
 * MEASURED COVER LADDER (deterministic, in-sweep, escalation 9-cut/AS1 ->
 * 33-cut/AS4, depth-first subdivision, exact baked counts):
 *   floor 0.244     -> 14 cells, maxDepth 12, zero unresolved
 *   floor 0.241     -> 32 cells, maxDepth 18, zero unresolved
 *   floor 0.2401    -> 59 cells, maxDepth 37, zero unresolved
 *   floor 0.240015  -> 90 cells, maxDepth 57, zero unresolved
 * BUDGET ANSWER (item 3): the cover budget is LOGARITHMIC in the distance
 * to the intrinsic crossing 0.2400105 (roughly 13 extra cells per halved
 * distance; the failing set is a quasi-one-dimensional drill into the
 * anchor corner u0 = 2, hull [4, 8], u2 = 16, mu = floor), NOT exponential:
 * ~90 cells and ~0.4 s reach within 4.5e-6 of the wall. The 690988-cell
 * budgeting fear that motivated the offline-lane framing does not apply to
 * this chart.
 * GRAFT REPRICING (item 1): the imp-95155 close-position k = 1 failures
 * (e.g. u0 = 3.5, hull [3.75, 4]) lie OUTSIDE the in-class middle chart
 * (u0 <= 2, hull >= 4), so the standalone chart cover closes WITHOUT a
 * cap-stage graft into the imp-95150 runner; what the graft framing must
 * still own are the OTHER charts: heavy at the HEAD or HIGHEST position
 * (both neighbors on one side -- a same-side two-point jet certifier, a
 * DIFFERENT lift geometry than the middle 4-frame) and the mixed-heavy-pair
 * (two hulls, LEMMA DJ). Those are the remaining items of the sub-gap.
 *
 * NOTE ON MARGINS: the per-cell worst bound approaches 1 by construction
 * (cells certify right up to the criterion; worst 0.9999973 at the wall
 * floor) -- the margin story lives in the FLOOR (0.240015 sits 4.5e-6
 * above the certified crossing) and in the conservative per-cut nudges
 * (1e-12 relative + 1e-15) and Cholesky pivot tolerance 1e-12 carried from
 * imp-95155/95156/95157. Exact cell counts are bit-identity anchors in the
 * imp-95150 tradition, not margin claims.
 *
 * WHAT THIS RUN DOES NOT DO: NO closure of the full k >= 5 channel (head
 * and highest heavy positions and the two-hull mixed-heavy-pair channel
 * remain OPEN), NO new full-class rate constant, and every certified
 * statement is conditional on the carried imp-95154 frame reduction
 * (5-row head/tail majorant; empty-block configs are principal submatrices,
 * lambda_max monotone under deletion). Class sandwich [0.2320723, 0.24502]
 * and the k <= 4 ladder floor 47/200 carried UNCHANGED. Changes no bound;
 * NO QED; no refereed bound is changed.
 *
 * Import-light; zero imports; all assertions deterministic, ~2 s.
 */
const g = (z) => Math.exp(-z) * (1 + z);
const phi = (z) => z * Math.exp(-z);

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95158-jet-phantom-midheavy-cover assertion failed: ${id}`);
}
const MEASURED = {};

// --------------------------------------------------------------------------
// machinery carried VERBATIM from imp-95155/95156/95157 (Gram, cuts, EW/AS
// bounds, Cholesky certificate, positional majorant, sampled joint sup)
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
const matVec = (G, c) => G.map((row) => row.reduce((s, x, j) => s + x * c[j], 0));
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
    const b01 = g(dl) * z[0] - phi(dl) * z[1];
    const b12 = g(dr) * z[2] + phi(dr) * z[3];
    return eig5(frameMatrix(mu, b01, b12, hR, u0, u2));
  };
  // deterministic feasible seeds (z-signs hold for any W >= 0), then draws
  for (const c of [[1, 0, 1, 0], [1, 0, 0, 0], [0, 0, 1, 0], [1, 0.2, 1, -0.2]]) {
    const v = evalC(c);
    if (v > best) { best = v; bestC = c.slice(); }
  }
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
// positional cell certifier (imp-95157 "AS" mode) with the Pareto filter:
// lambda_max is entrywise nondecreasing in (b01, b12) (LEMMA PV), so only
// Pareto-maximal polygon vertices can attain the max
// --------------------------------------------------------------------------
function certifiedCellPositional(muI, u0I, hLI, hRI, u2I, nDir, ns) {
  const WI = [muI[0] * (hRI[0] - hLI[1]), muI[1] * (hRI[1] - hLI[0])];
  const dlI = [muI[0] * (hLI[0] - u0I[1]), muI[1] * (hLI[1] - u0I[0])];
  const drI = [muI[0] * (u2I[0] - hRI[1]), muI[1] * (u2I[1] - hRI[0])];
  assertI(WI[0] > 0 && dlI[0] > 0 && drI[0] > 0 && hRI[1] < 64 && u0I[1] < 64,
    "imp95158-cell-validity");
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

// --------------------------------------------------------------------------
// LEMMA HI cell bound: the outer hull [hL_cellLo, hR_cellHi] dominates every
// hull in the cell (width-0 diagonal hulls included); degenerate outer hulls
// widen by 1e-9 inside the block (hull enlargement is monotone-safe)
// --------------------------------------------------------------------------
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

// --------------------------------------------------------------------------
// deterministic subdivision cover of the middle-heavy chart (verbatim from
// scripts/imp-95158-jet-phantom-midheavy-cover.mjs)
// --------------------------------------------------------------------------
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

const degen = (x) => [x, x];

// --------------------------------------------------------------------------
// (A) anchor reproduction: the Pareto-filtered certifier reproduces the
// imp-95155 fixed-frame certified literals at zero width (filter lossless)
// --------------------------------------------------------------------------
{
  const IMP95155 = { 0.235: 1.010770, 0.24: 1.000022, 0.245: 0.989803 };
  const repro = {};
  for (const mu of [0.235, 0.24, 0.245]) {
    repro[mu] = certifiedCellPositional(degen(mu), degen(2), degen(4), degen(8), degen(16), 33, 4);
    assertI(Math.abs(repro[mu] - IMP95155[mu]) < 5e-6, `imp95158-anchor-repro(${mu})`);
  }
  MEASURED.anchor = repro;
}

// --------------------------------------------------------------------------
// (B) LEMMA HI battery: sampled joint phantom sups of random SUB-hulls never
// exceed the certified outer-hull cell bound (including near-degenerate
// sub-hulls, which the pre-HI certifier could not enclose at all)
// --------------------------------------------------------------------------
{
  let st = 909090;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstGap = Infinity, checked = 0, narrowChecked = 0;
  for (let t = 0; t < 10; t++) {
    const u0I = [1 + rnd() * 0.7, 0], hLI = [4 + rnd() * 2, 0], hRI = [0, 0], u2I = [16 + rnd() * 8, 0];
    u0I[1] = Math.min(2, u0I[0] + 0.1 + rnd() * 0.3);
    hLI[1] = Math.min(8, hLI[0] + 0.2 + rnd() * 0.8);
    hRI[0] = hLI[0] + rnd() * (8 - hLI[0]) * 0.5;
    hRI[1] = Math.min(8, hRI[0] + 0.2 + rnd() * 0.8);
    u2I[1] = Math.min(32, u2I[0] + 0.5 + rnd() * 2);
    const muI = [0.241 + rnd() * 0.003, 0];
    muI[1] = muI[0] + 0.0005 + rnd() * 0.001;
    const cell = { lo: [u0I[0], hLI[0], hRI[0], u2I[0], muI[0]], hi: [u0I[1], hLI[1], hRI[1], u2I[1], muI[1]] };
    if (cell.lo[1] > cell.hi[2]) continue;
    const bound = cellBoundHI(cell, 33, 4);
    const A = hLI[0], B = Math.max(hRI[1], hLI[0]);
    for (let s = 0; s < 4; s++) {
      // random sub-hull of the outer hull, incl a near-degenerate one
      const a = A + rnd() * (B - A) * 0.9;
      const wid = s === 0 ? 1e-4 : rnd() * (B - a);
      const bb = Math.min(B, a + Math.max(1e-4, wid));
      const u0 = u0I[0] + rnd() * (u0I[1] - u0I[0]);
      const u2 = u2I[0] + rnd() * (u2I[1] - u2I[0]);
      const mu = muI[0] + rnd() * (muI[1] - muI[0]);
      const samp = jointSup(mu, a, bb, u0, u2, 300, 1000 + t * 17 + s);
      const gap = bound - samp;
      if (gap < worstGap) worstGap = gap;
      checked++;
      if (bb - a < 1e-3) narrowChecked++;
    }
  }
  MEASURED.hi = { worstGap, checked, narrowChecked };
  assertI(worstGap > 0, `imp95158-hi-dominates(${worstGap})`);
  assertI(checked >= 30 && narrowChecked >= 8, `imp95158-hi-coverage(${checked},${narrowChecked})`);
}

// --------------------------------------------------------------------------
// (C) LEMMA OP: the odd-parity frame (all block literals doubled) equals the
// even frame at rate 2 mu entrywise, and the phantom arguments double
// --------------------------------------------------------------------------
{
  const frameMatrixOdd = (mu, b01, b12, hRo, u0o, u2o) => {
    const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
    const set = (i, j, x) => { M[i][j] = x; M[j][i] = x; };
    set(0, 1, Math.max(0, b01));
    set(1, 2, Math.max(0, b12));
    set(0, 2, g(mu * (u2o - u0o)));
    set(0, 3, 2 * g(mu * (128 - u0o)));
    set(1, 3, 2 * g(mu * (128 - hRo)));
    set(2, 3, 2 * g(mu * 64));
    set(0, 4, 2 * g(mu * (512 - u0o)));
    set(1, 4, 2 * g(mu * (512 - hRo)));
    set(2, 4, 2 * g(mu * 448));
    set(3, 4, 4 * g(mu * 256));
    return M;
  };
  let st = 424242;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstEq = 0, worstArg = 0;
  for (let t = 0; t < 200; t++) {
    const mu = 0.12 + rnd() * 0.13;
    const u0 = 1 + rnd(), hL = 4 + rnd() * 4, hR = hL + rnd() * (8 - hL), u2 = 16 + rnd() * 16;
    const b01 = rnd(), b12 = rnd();
    const Mo = frameMatrixOdd(mu, b01, b12, 2 * hR, 2 * u0, 2 * u2);
    const Me = frameMatrix(2 * mu, b01, b12, hR, u0, u2);
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
      worstEq = Math.max(worstEq, Math.abs(Mo[i][j] - Me[i][j]));
    }
    // phantom arguments: dl, dr, W all double under parity doubling
    worstArg = Math.max(
      worstArg,
      Math.abs(mu * (2 * hL - 2 * u0) - 2 * mu * (hL - u0)),
      Math.abs(mu * (2 * u2 - 2 * hR) - 2 * mu * (u2 - hR)),
      Math.abs(mu * (2 * hR - 2 * hL) - 2 * mu * (hR - hL))
    );
  }
  MEASURED.op = { worstEq, worstArg };
  assertI(worstEq < 1e-15, `imp95158-op-frame-identity(${worstEq})`);
  assertI(worstArg < 1e-15, `imp95158-op-argument-doubling(${worstArg})`);
}

// --------------------------------------------------------------------------
// (D) the COVER LADDER: deterministic in-sweep re-runs with exact baked
// counts (bit-identity anchors in the imp-95150 tradition); every floor
// closes with ZERO unresolved cells
// --------------------------------------------------------------------------
{
  const MUHI = 0.49004;
  const BAKED = {
    0.244: { cells: 14, maxDepth: 12 },
    0.241: { cells: 32, maxDepth: 18 },
    0.2401: { cells: 59, maxDepth: 37 },
    0.240015: { cells: 90, maxDepth: 57 },
  };
  const ladder = {};
  for (const floor of [0.244, 0.241, 0.2401, 0.240015]) {
    const r = runCover(floor, MUHI, 4e6, 140);
    ladder[floor] = r;
    assertI(r.unresolved === 0, `imp95158-cover-closes(${floor}:${r.unresolved})`);
    assertI(r.cells === BAKED[floor].cells, `imp95158-cover-cells(${floor}:${r.cells})`);
    assertI(r.maxDepth === BAKED[floor].maxDepth, `imp95158-cover-depth(${floor}:${r.maxDepth})`);
    assertI(r.worst < 1, `imp95158-cover-worst(${floor}:${r.worst})`);
  }
  // logarithmic budget: 4.5e-6 from the crossing costs 90 cells, and each
  // roughly-halved distance to the wall adds a bounded number of cells
  assertI(ladder[0.240015].cells - ladder[0.2401].cells < 40, "imp95158-budget-log-tail");
  assertI(ladder[0.240015].cells <= 90, "imp95158-budget-total");
  MEASURED.ladder = ladder;
}

// --------------------------------------------------------------------------
// (E) wall consistency: the certified corner crossing carried from imp-95155
// separates a refuted point (below) from the covered floor (above)
// --------------------------------------------------------------------------
{
  const CROSSING = 0.2400105;
  const below = certifiedCellPositional(degen(0.24001), degen(2), degen(4), degen(8), degen(16), 33, 4);
  const above = certifiedCellPositional(degen(0.240015), degen(2), degen(4), degen(8), degen(16), 33, 4);
  MEASURED.wall = { CROSSING, below, above, floorMinusCrossing: 0.240015 - CROSSING };
  assertI(below > 1, `imp95158-wall-below-refuted(${below})`);
  assertI(above < 1, `imp95158-wall-above-certifies(${above})`);
  assertI(0.240015 - CROSSING > 4e-6 && 0.240015 - CROSSING < 5e-6,
    "imp95158-floor-sits-at-wall");
}

// --------------------------------------------------------------------------
// verdict object
// --------------------------------------------------------------------------
export const IMP95158_JET_PHANTOM_MIDHEAVY_COVER = {
  id: "imp-95158",
  title:
    "First positional jet-phantom cover: the in-class middle-heavy chart closes at floor 0.240015 (90 cells, zero unresolved, both parities via LEMMA OP), 4.5e-6 above the intrinsic corner crossing -- the k >= 5 single-heavy middle channel carries its first k-uniform certified rate floor, conditional on the carried frame reduction",
  rigorous: {
    lemmaHI:
      "every nonnegative profile on a sub-hull of [A, B] is a witness-class profile on [A, B] (offsets t_i = x_i - A >= 0 and s_i = B - x_i >= 0 keep all four jet sign constraints; LEMMA JF/KU apply verbatim; KN tail caps price hR at the cell max, dominating g(mu (64 - b)) since g is decreasing), so one outer-hull certificate covers every hull in a cell including width-0 diagonal hulls -- no sliver residual",
    lemmaOP:
      "odd-parity blocks at 2 x 4^b double every position and frame literal, so the odd frame/phantom at rate mu equals the even frame/phantom at rate 2 mu entrywise (asserted to 1e-15); covering the even chart up to 0.49004 closes the odd chart on [floor, 0.24502]",
    paretoFilter:
      "lambda_max of the positional majorant is entrywise nondecreasing in (b01, b12), so only Pareto-maximal polygon vertices can attain the max; asserted lossless against the imp-95155 anchor literals to 5e-6",
    coverStatement:
      "the middle-heavy chart u0 in [1,2] x {4 <= hL <= hR <= 8} x u2 in [16,32] x mu in [0.240015, 0.49004] is covered by certified cells with zero unresolved; with the THEOREM HS ceiling 0.24502 and LEMMA OP: the k >= 5 single-heavy middle channel (at most one packet per other block) has E <= 0 for every common rate mu >= 0.240015, both parities, conditional on the carried imp-95154 frame reduction",
  },
  measured: {
    ladder:
      "cells 14 / 32 / 59 / 90 at floors 0.244 / 0.241 / 0.2401 / 0.240015 (maxDepth 12 / 18 / 37 / 57, zero unresolved everywhere) -- the budget is logarithmic in the distance to the crossing 0.2400105, not exponential: the failing set is a quasi-one-dimensional drill into the anchor corner",
    graftRepricing:
      "the imp-95155 close-position k = 1 failures lie outside the in-class middle chart (u0 <= 2, hL >= 4), so the standalone chart cover closes without a cap-stage graft into the imp-95150 runner; the graft framing now owns only the head/highest-position charts and the two-hull channel",
    wall:
      "certified corner value above 1 at mu 0.24001 and below 1 at 0.240015: the floor sits 4.5e-6 above the carried crossing 0.2400105, essentially at the imp-95157 intrinsic wall",
  },
  openSubGap: {
    name: "imp-95154-subgap-jet-phantom-cover",
    status: "OPEN",
    update:
      "MIDDLE-CHART COMPONENT CLOSED by imp-95158 (items 1 and 3 executed for the middle-heavy chart: no graft needed in-class, budget measured logarithmic, floor 0.240015 certified). Remaining: (i) the HEAD- and HIGHEST-position charts, where both neighbors sit on one side of the hull -- a same-side two-point jet certifier with a different lift geometry than the middle 4-frame; (ii) the mixed-heavy-pair channel (two hulls, LEMMA DJ); (iii) the carried frame-reduction conditionality shared by the whole chain.",
  },
  carried: {
    classSandwich: [0.2320723, 0.24502],
    ladderFloorKle4: 47 / 200,
    cornerCrossing: 0.2400105,
    jointThreshold:
      "any full-class E > 0 witness at a common rate >= 0.235 must place >= 5 packets in one block or >= 3 and >= 2 in two blocks (THEOREM PO/TP/VP/QP/VU/VW/VX, unchanged); NEW conditional refinement: a >= 5-packet single-heavy witness at the MIDDLE position needs mu < 0.240015",
  },
  promotesBound: false,
  noQED: true,
  sota: "No refereed bound is changed",
};

// --------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// --------------------------------------------------------------------------
export const IMP95158_JET_PHANTOM_MIDHEAVY_COVER_ASSERTIONS = [
  {
    id: "imp95158-anchor-reproduction",
    description:
      "The Pareto-filtered certifier reproduces the imp-95155 fixed-frame certified anchor literals 1.010770 / 1.000022 / 0.989803 at mu 0.235 / 0.24 / 0.245 to 5e-6 (the filter is lossless)",
    holds: () =>
      Math.abs(MEASURED.anchor[0.235] - 1.010770) < 5e-6 &&
      Math.abs(MEASURED.anchor[0.24] - 1.000022) < 5e-6 &&
      Math.abs(MEASURED.anchor[0.245] - 0.989803) < 5e-6,
  },
  {
    id: "imp95158-hull-inclusion-dominates",
    description:
      "LEMMA HI: sampled joint phantom sups of 30+ random sub-hulls (including near-degenerate width-1e-4 hulls) never exceed the certified outer-hull cell bound",
    holds: () =>
      MEASURED.hi.worstGap > 0 && MEASURED.hi.checked >= 30 && MEASURED.hi.narrowChecked >= 8,
  },
  {
    id: "imp95158-parity-doubling-identity",
    description:
      "LEMMA OP: the odd-parity frame (all block literals doubled) equals the even frame at rate 2 mu entrywise to 1e-15 on 200 random frames, and the phantom arguments (dl, dr, W) double exactly",
    holds: () => MEASURED.op.worstEq < 1e-15 && MEASURED.op.worstArg < 1e-15,
  },
  {
    id: "imp95158-cover-ladder-closes",
    description:
      "The deterministic subdivision cover of the full middle-heavy chart closes with ZERO unresolved cells at every floor in {0.244, 0.241, 0.2401, 0.240015} over mu up to 0.49004, with exact baked cell counts 14 / 32 / 59 / 90 (bit-identity anchors)",
    holds: () =>
      [0.244, 0.241, 0.2401, 0.240015].every((f) => MEASURED.ladder[f].unresolved === 0) &&
      MEASURED.ladder[0.244].cells === 14 &&
      MEASURED.ladder[0.241].cells === 32 &&
      MEASURED.ladder[0.2401].cells === 59 &&
      MEASURED.ladder[0.240015].cells === 90,
  },
  {
    id: "imp95158-budget-logarithmic",
    description:
      "Item (3) budget answer: reaching within 4.5e-6 of the intrinsic crossing costs 90 cells total, and the last distance-halving stretch (0.2401 -> 0.240015) adds fewer than 40 cells -- logarithmic drill, not exponential blowup",
    holds: () =>
      MEASURED.ladder[0.240015].cells <= 90 &&
      MEASURED.ladder[0.240015].cells - MEASURED.ladder[0.2401].cells < 40,
  },
  {
    id: "imp95158-wall-bracket",
    description:
      "The covered floor sits at the wall: the anchor corner is refuted (certified value > 1) at mu 0.24001 and certifies (< 1) at the floor 0.240015, 4.5e-6 above the carried crossing 0.2400105",
    holds: () =>
      MEASURED.wall.below > 1 && MEASURED.wall.above < 1 &&
      MEASURED.wall.floorMinusCrossing > 4e-6 && MEASURED.wall.floorMinusCrossing < 5e-6,
  },
  {
    id: "imp95158-honest-record-literals",
    description:
      "No constant moves: class sandwich and the k <= 4 ladder floor 47/200 carried unchanged; no bound promotion; no QED; the sub-gap stays OPEN (head/highest charts + mixed-heavy-pair + frame-reduction conditionality remain); the new floor is a CONDITIONAL channel refinement, not a class constant",
    holds: () =>
      IMP95158_JET_PHANTOM_MIDHEAVY_COVER.carried.classSandwich[0] === 0.2320723 &&
      IMP95158_JET_PHANTOM_MIDHEAVY_COVER.carried.classSandwich[1] === 0.24502 &&
      IMP95158_JET_PHANTOM_MIDHEAVY_COVER.carried.ladderFloorKle4 === 47 / 200 &&
      IMP95158_JET_PHANTOM_MIDHEAVY_COVER.promotesBound === false &&
      IMP95158_JET_PHANTOM_MIDHEAVY_COVER.noQED === true &&
      IMP95158_JET_PHANTOM_MIDHEAVY_COVER.openSubGap.status === "OPEN",
  },
];

for (const a of IMP95158_JET_PHANTOM_MIDHEAVY_COVER_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95158-jet-phantom-midheavy-cover assertion failed: ${a.id}`);
}
