// imp-95158 offline cover runner (heavy-compute lane; single-threaded,
// deterministic, bit-reproducible - no randomness in the cover path).
//
// FIRST POSITIONAL JET-PHANTOM COVER: item (1)+(3) of the sub-gap
// imp-95154-subgap-jet-phantom-cover. Covers the in-class MIDDLE-HEAVY
// frame chart of the carried 5-row head/tail frame reduction:
//   u0 in [1, 2]   (block-0 single),
//   [hL, hR] the heavy hull, 4 <= hL <= hR <= 8 (block 1, ANY packet count
//   k and ANY nonnegative hull profile via the imp-95154 jet reduction),
//   u2 in [16, 32] (block-2 single),
//   mu in [FLOOR, MUHI]  (common rate),
// with tails pinned at 64 / 256 (weights 2 / 4, carried majorant).
//
// Per-cell certificate: the imp-95156/95157 positional certifier (LEMMA SC
// support cuts + LEMMA EW exact W-profile + LEMMA AS argument subdivision +
// LEMMA PM positional matrix majorant + LEMMA PV polygon vertices + LEMMA CH
// Cholesky shift), applied through LEMMA HI (hull inclusion, NEW):
//   every nonnegative profile supported on a sub-hull [a, b] of [A, B] is a
//   witness-class profile on [A, B] with the same frame, and the jet-sign
//   constraints only need packet positions inside [A, B]; the KN tail caps
//   are monotone under hull enlargement (gap shrinks, g decreasing, the
//   majorant already prices hR at its cell max). So the phantom bond region
//   of the OUTER hull contains that of every sub-hull, and one certificate
//   at the outer hull [hL_cellLo, hR_cellHi] covers ALL hulls in the cell,
//   including degenerate (width-0) hulls on the diagonal - no sliver.
// LEMMA OP (parity doubling, NEW): odd-parity blocks sit at doubled bases
// (2*4^b), so every gap doubles and the odd frame/phantom at rate mu equals
// the even frame/phantom at rate 2*mu entrywise. Covering the even chart on
// [FLOOR, 0.49004] therefore closes the odd chart on [FLOOR, 0.24502] too
// (rates above the THEOREM HS class ceiling 0.24502 are closed classwide).
//
// PARETO FILTER (soundness note): lambda_max of the positional majorant is
// entrywise nondecreasing in (b01, b12) (LEMMA PV), so only Pareto-maximal
// polygon vertices can attain the max; dominated vertices are skipped.
//
// Usage: node scripts/imp-95158-jet-phantom-midheavy-cover.mjs FLOOR MUHI BUDGET DEPTH
//   FLOOR = rate floor (must be > 0.2400105, the certified corner crossing)
//   MUHI  = rate top (0.49004 to import odd parity via LEMMA OP)
//   BUDGET = max cells, DEPTH = max subdivision depth
const argv = process.argv.slice(2);
const FLOOR = parseFloat(argv[0] ?? "0.241");
const MUHI = parseFloat(argv[1] ?? "0.49004");
const BUDGET = parseFloat(argv[2] ?? "2e6");
const DEPTHCAP = parseInt(argv[3] ?? "60", 10);

// ---------------------------------------------------------------------------
// machinery carried VERBATIM from imp-95155/95156/95157
// ---------------------------------------------------------------------------
const g = (z) => Math.exp(-z) * (1 + z);
const phi = (z) => z * Math.exp(-z);
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
// positional cell certifier: imp-95157 "AS" mode with a Pareto filter on the
// polygon vertices (lambda_max entrywise nondecreasing in (b01, b12), so
// dominated vertices never attain the max)
function certifiedCellPositional(muI, u0I, hLI, hRI, u2I, nDir, ns) {
  const WI = [muI[0] * (hRI[0] - hLI[1]), muI[1] * (hRI[1] - hLI[0])];
  const dlI = [muI[0] * (hLI[0] - u0I[1]), muI[1] * (hLI[1] - u0I[0])];
  const drI = [muI[0] * (u2I[0] - hRI[1]), muI[1] * (u2I[1] - hRI[0])];
  if (!(WI[0] > 0 && dlI[0] > 0 && drI[0] > 0 && hRI[1] < 64 && u0I[1] < 64)) {
    throw new Error("imp-95158 cell validity violated");
  }
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
  // Pareto filter: keep only vertices not dominated in BOTH coordinates
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

// ---------------------------------------------------------------------------
// LEMMA HI cell bound: the outer hull [hL_cellLo, hR_cellHi] dominates every
// hull in the cell (including width-0 diagonal hulls); hR degenerate cells
// widen by 1e-9 inside the block (hull enlargement is monotone-safe)
// ---------------------------------------------------------------------------
function cellBoundHI(b, nDir, ns) {
  const [u0lo, hLlo, hRlo, u2lo, mlo] = b.lo;
  const [u0hi, hLhi, hRhi, u2hi, mhi] = b.hi;
  let A = hLlo, B = Math.max(hRhi, hLlo);
  if (B - A < 1e-9) {
    if (B <= 8 - 1e-9) B = A + 1e-9; else A = B - 1e-9;
  }
  return certifiedCellPositional(
    [mlo, mhi], [u0lo, u0hi], [A, A], [B, B], [u2lo, u2hi], nDir, ns
  );
}

export { cellBoundHI, certifiedCellPositional, majorantMatrix, lamMaxUpper, g, phi, G4 };

// ---------------------------------------------------------------------------
// deterministic subdivision cover of the middle-heavy chart
// ---------------------------------------------------------------------------
function runCover(floor, muHi, budget, depthCap) {
  const lo0 = [1, 4, 4, 16, floor];
  const hi0 = [2, 8, 8, 32, muHi];
  const scales = [1, 1, 1, 8, 0.05];
  const stack = [{ lo: lo0, hi: hi0, d: 0 }];
  let n = 0, worst = -1, maxDepth = 0, unresolved = 0, pruned = 0;
  let escalations = 0;
  const dumps = [];
  while (stack.length) {
    const b = stack.pop();
    if (b.lo[1] > b.hi[2]) { pruned++; continue; } // hL <= hR infeasible
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
      if (dumps.length < 6) dumps.push({ lo: b.lo, hi: b.hi, bound });
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
  return { cells: n, worst, maxDepth, unresolved, pruned, escalations, dumps };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const t0 = Date.now();
  const res = runCover(FLOOR, MUHI, BUDGET, DEPTHCAP);
  const { dumps, ...rest } = res;
  console.log(JSON.stringify({
    floor: FLOOR, muHi: MUHI, budget: BUDGET, depthCap: DEPTHCAP,
    ...rest, secs: (Date.now() - t0) / 1000,
  }));
  for (const d of dumps) console.log("UNRESOLVED:", JSON.stringify(d));
}
