/**
 * imp-95157 - RIGOROUS step -- EXACT W-PROFILE tightening of the imp-95156
 * positional jet-phantom certifier (LEMMA EW + LEMMA AS) PLUS the honest
 * repricing of the remaining lever (FINDING ID): the imp-95156 successor
 * hint ("tighten the dl-W coupling, not PM") is REPRICED -- roughly 70
 * percent of the measured positional price is INTRINSIC (the true phantom
 * sup at the worst corner frame of the cell genuinely grows), so interval
 * tightening can buy at most ~25 percent more certifying width, and the
 * subdivision granularity of the future cap-stage graft is governed by the
 * corner geometry, not by interval-arithmetic quality.
 *
 * LEMMA EW (exact W-profile; replaces the sign-majorized Gram interval of
 * LEMMA IC step (iii) with an EXACT scalar sup). Every W-dependent entry
 * of the jet Gram G4(W) is exp(-W) times an affine function of W:
 *   g(W) = exp(-W)(1+W),  phi(W) = W exp(-W),  psi(W) = (1-W) exp(-W).
 * Hence at ANY fixed vector a the quadratic form collapses in closed form:
 *   aT G4(W) a = |a|^2 + 2 [ cg g(W) + cphi phi(W) + cpsi psi(W) ]
 *              = |a|^2 + 2 exp(-W) (alpha + beta W),
 * with cg = a0 a2, cphi = a1 a2 - a0 a3, cpsi = a1 a3, alpha = cg + cpsi,
 * beta = cg + cphi - cpsi. The map h(W) = exp(-W)(alpha + beta W) has
 * derivative exp(-W)(beta - alpha - beta W), which vanishes at the SINGLE
 * point Wstar = 1 - alpha/beta when beta is nonzero (and h is monotone
 * when beta = 0), so the sup of h over [Wlo, Whi] is EXACTLY the max of h
 * at { Wlo, Whi, Wstar if interior } -- a continuous function on a compact
 * interval attains its max at an endpoint or an interior stationary point.
 * DOMINANCE (proved, then asserted): the imp-95156 sign-majorized value
 * bounds each of the three terms by its own max over the exact range of
 * the carrier on [Wlo, Whi], i.e. it allows each term to pick its OWN W;
 * the exact profile takes the max of the SUM at a COMMON W, and
 * sup_W (sum) <= sum of per-term sups, so qEW <= qSM at every a-box
 * vertex, hence for every cut. The positional certificate with EW cuts is
 * therefore sound (same superset + convexity-at-vertex chain as LEMMA IC,
 * with step (iii) exact instead of majorized) and never weaker.
 *
 * LEMMA AS (argument subdivision; covering refinement of the a-box).
 * The reachable (dl, dr) argument set of a cell is contained in the
 * rectangle [dlLo, dlHi] x [drLo, drHi]; splitting that rectangle into an
 * ns x ns grid of sub-rectangles and taking the max of the LEMMA EW
 * vertex bound over the sub-rectangles (same multiplier m -- LEMMA SC is
 * pointwise-sound for every m -- and the full W interval, a superset) is
 * sound because a union of supersets covers the cell, and is monotone
 * nonincreasing along nested grids (ns = 1, 2, 4, 8): each finer box is
 * contained in its parent, so every enclosure shrinks. ns = 1 IS the
 * LEMMA EW bound; ns -> infinity leaves only the residual (dl,dr)-to-W
 * decoupling and the per-component dl (and dr) coupling inside the box.
 *
 * FINDING ID (intrinsic decomposition of the positional price; this is
 * the honest headline). Write the positional price of a cell as
 *   cellBound - fixed = (sampledCornerSup - fixed) + (cellBound - sampledCornerSup).
 * The first term is UNAVOIDABLE for every sound certificate: the sampled
 * corner sup is an ATTAINED value of the jet-phantom object at the
 * gap-shrinking corner frame (u0 + w, hL - w, hR + w, u2 - w), and any
 * sound cell bound must dominate the true sup over the cell, which is at
 * least that attained value. MEASURED at the anchor (mu = 0.245, 33 cuts):
 * the intrinsic share is ~0.70 at every half-width (0.700 / 0.704 / 0.698
 * at w = 0.02 / 0.05 / 0.10) and EW+AS8 removes ~17-18 percent of the
 * REMOVABLE slack (not of the price). CEILING BRACKET (two point facts,
 * no monotonicity assumed): at w = 0.0619 the certified corner value is
 * 0.999988 < 1, and at w = 0.0624 the SAMPLED corner sup is 1.000009 > 1
 * -- the true phantom sup at that corner exceeds 1, so NO sound cell
 * certificate (however tight its interval arithmetic) can certify a cell
 * containing it. The maximal certifying half-width at the anchor is
 * therefore < 0.0624 for every possible successor, while EW+AS8 already
 * carries 0.0462 (74 percent of the ceiling; the imp-95156 SM certifier
 * carried 0.0438, 70 percent). CONSEQUENCE: the "tighten the interval
 * cuts" lever is capped at ~25 percent more width at the anchor; the cap-
 * stage graft (item 1 of the sub-gap) should budget subdivision cells at
 * the INTRINSIC scale (corner growth ~0.164 lambda per unit half-width at
 * the anchor margin 1.02e-2), not wait for sharper interval arithmetic.
 *
 * MEASURED (deterministic, in-sweep, anchored ridge frame, 33 cuts):
 * (1) DEGENERATE COLLAPSE: zero-width EW/AS cells reproduce the imp-95155
 *     fixed-frame certified values 1.010770 / 1.000022 / 0.989803 at
 *     mu 0.235 / 0.24 / 0.245 to 5e-6 (the exact profile changes nothing
 *     at width zero, as it must: a point interval has one W).
 * (2) LADDER IMPROVEMENT: positional loss at mu 0.245 drops from
 *     2.325e-3 / 4.650e-3 / 1.163e-2 / 2.330e-2 (imp-95156 SM literals,
 *     reproduced to 5e-6) to 2.199e-3 / 4.400e-3 / 1.102e-2 / 2.210e-2
 *     under EW+AS8 at half-width 0.01 / 0.02 / 0.05 / 0.10 -- a ~5.3
 *     percent price cut, uniform in w.
 * (3) CERTIFYING WIDTH: max certifying half-width at mu 0.245 moves
 *     0.04383 (SM) -> 0.04628 (EW+AS8); whole-cell point check at
 *     half-width 0.0462 certifies at 0.999981 < 1.
 * (4) SLAB: the imp-95156 certified slab (mu in [0.2445, 0.245] x
 *     half-width 0.02) improves 0.995504 -> 0.995242 under EW+AS4
 *     (margin 4.50e-3 -> 4.76e-3).
 * (5) SOUNDNESS BATTERIES: the closed-form collapse matches the direct
 *     quadratic form to 1e-11 on 2000 random (a, W) pairs; the exact sup
 *     dominates a dense W-grid to 1e-12; qEW <= qSM on 500 random cut
 *     configurations; 300 random coupled (frame, m, v) points never
 *     exceed the AS8 bound; AS is monotone along ns = 1, 2, 4, 8 on 60
 *     random configurations with zero violations.
 * NOTE ON THIN MARGINS: the three ceiling-bracket point facts sit
 * deliberately NEAR the crossing (margins 1.2e-5 / 9e-6 / 1.9e-5); they
 * are landmark reproducibility checks on a fully deterministic seeded
 * code path, not certified-margin claims -- the headline slab and ladder
 * assertions keep the carried >= 4e-3 margin discipline.
 * WHAT THIS RUN DOES NOT DO: no positional COVER is run, NO new certified
 * rate constant, and the intrinsic ceiling bracket is at the ANCHOR
 * geometry only. The sub-gap imp-95154-subgap-jet-phantom-cover stays
 * OPEN with items (1) (cap-stage graft into the imp-95150 offline runner
 * stack) and (3) (cover budget at a floor mu-star in
 * (0.2400105, 0.24502)) remaining; the imp-95156 successor hint is
 * REPLACED by the FINDING ID repricing. Class sandwich
 * [0.2320723, 0.24502] and the k <= 4 ladder floor 47/200 carried
 * UNCHANGED. Float discipline carried: 1e-9 relative inflation nudges,
 * Cholesky pivot tolerance 1e-12. Changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * Import-light; zero imports; all assertions deterministic, ~5 s.
 */
const g = (z) => Math.exp(-z) * (1 + z);
const phi = (z) => z * Math.exp(-z);
const psi = (z) => (1 - z) * Math.exp(-z);

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95157-jet-phantom-exact-wprofile assertion failed: ${id}`);
}
const MEASURED = {};

// --------------------------------------------------------------------------
// machinery carried VERBATIM from imp-95154/95155/95156 (enclosures, frame,
// Gram, cut optimizer, Cholesky certificate, polygon assembly, sampled sup)
// --------------------------------------------------------------------------
const encG = (lo, hi) => [g(hi), g(lo)];
const encPhi = (lo, hi) => [
  Math.min(phi(lo), phi(hi)),
  lo <= 1 && 1 <= hi ? phi(1) : Math.max(phi(lo), phi(hi)),
];
const encPsi = (lo, hi) => [
  lo <= 2 && 2 <= hi ? psi(2) : Math.min(psi(lo), psi(hi)),
  Math.max(psi(lo), psi(hi)),
];
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
function G4Interval(Wlo, Whi) {
  const c = (x) => [x, x];
  const g13 = encG(Wlo, Whi);
  const p = encPhi(Wlo, Whi);
  const g14 = [-p[1], -p[0]];
  const g24 = encPsi(Wlo, Whi);
  return [
    [c(1), c(0), g13, g14],
    [c(0), c(1), p, g24],
    [g13, p, c(1), c(0)],
    [g14, g24, c(0), c(1)],
  ];
}
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
// imp-95156 sign-majorized vertex bound (kept as the dominated baseline)
function supQuadSM(aB, GI) {
  let best = 0;
  for (let mask = 0; mask < 16; mask++) {
    const a = aB.map((iv, i) => iv[(mask >> i) & 1]);
    let s = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const c = a[i] * a[j];
        s += c >= 0 ? c * GI[i][j][1] : c * GI[i][j][0];
      }
    }
    if (s > best) best = s;
  }
  return best;
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

// --------------------------------------------------------------------------
// NEW: LEMMA EW exact W-profile + LEMMA AS argument subdivision
// --------------------------------------------------------------------------
// exact sup over W in [Wlo, Whi] of h(W) = exp(-W)(alpha + beta W):
// single stationary point Wstar = 1 - alpha/beta (beta nonzero), so the
// max over the compact interval is attained at an endpoint or at Wstar
function supHW(alpha, beta, Wlo, Whi) {
  const h = (W) => Math.exp(-W) * (alpha + beta * W);
  let m = Math.max(h(Wlo), h(Whi));
  if (beta !== 0) {
    const Ws = 1 - alpha / beta;
    if (Ws > Wlo && Ws < Whi) m = Math.max(m, h(Ws));
  }
  return m;
}
// LEMMA EW vertex bound: max over the 16 a-box vertices of the EXACT
// W-profile sup (diagonal |a|^2 is W-free; the whole cross part collapses
// to exp(-W)(alpha + beta W))
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
// LEMMA AS: ns x ns covering of the (dl, dr) rectangle; same multiplier m
// (pointwise-sound) and full W interval (superset) per sub-rectangle
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
// positional cell certifier with a pluggable cut bound:
// mode "SM" reproduces imp-95156 exactly; mode "AS" uses LEMMA EW + LEMMA AS
function certifiedCellPositional(muI, u0I, hLI, hRI, u2I, nDir, mode, ns = 1) {
  const WI = [muI[0] * (hRI[0] - hLI[1]), muI[1] * (hRI[1] - hLI[0])];
  const dlI = [muI[0] * (hLI[0] - u0I[1]), muI[1] * (hLI[1] - u0I[0])];
  const drI = [muI[0] * (u2I[0] - hRI[1]), muI[1] * (u2I[1] - hRI[0])];
  assertI(WI[0] > 0 && dlI[0] > 0 && drI[0] > 0 && hRI[1] < 64 && u0I[1] < 64,
    "imp95157-cell-validity");
  const GI = G4Interval(WI[0], WI[1]);
  const mid = (I) => (I[0] + I[1]) / 2;
  const Gmid = G4(mid(muI) * (mid(hRI) - mid(hLI)));
  const dlm = mid(muI) * (mid(hLI) - mid(u0I)), drm = mid(muI) * (mid(u2I) - mid(hRI));
  const cuts = [];
  for (let k = 0; k < nDir; k++) {
    const th = (k / (nDir - 1)) * (Math.PI / 2);
    const v = [Math.cos(th), Math.sin(th)];
    const m = optimizeCut(Gmid, lift(v[0], v[1], dlm, drm));
    const q = mode === "SM"
      ? supQuadSM(aBox(v[0], v[1], dlI, drI, m), GI)
      : supQuadAS(v[0], v[1], dlI, drI, m, WI[0], WI[1], ns);
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
  let worst = -Infinity;
  for (const [x, y] of cand) {
    if (x < -1e-12 || y < -1e-12) continue;
    let ok = true;
    for (const c of cuts) {
      if (c.v[0] * x + c.v[1] * y > c.H * (1 + 1e-9) + 1e-12) { ok = false; break; }
    }
    if (!ok) continue;
    const bx = Math.max(0, x) * (1 + 1e-9), by = Math.max(0, y) * (1 + 1e-9);
    const lam = lamMaxUpper(majorantMatrix(muI[0], u0I, hRI, u2I, bx, by));
    if (lam > worst) worst = lam;
  }
  return worst;
}
const degen = (x) => [x, x];
const ANCHOR = (w) => [[2 - w, 2 + w], [4 - w, 4 + w], [8 - w, 8 + w], [16 - w, 16 + w]];
const cellAt = (muI, w, mode, ns) =>
  certifiedCellPositional(muI, ...ANCHOR(w), 33, mode, ns);
// certified fixed-frame value at the gap-shrinking corner of a half-width-w
// anchor cell (u0 + w, hL - w, hR + w, u2 - w keeps dl, dr minimal)
const cornerCertified = (w) =>
  certifiedCellPositional(degen(0.245), degen(2 + w), degen(4 - w), degen(8 + w), degen(16 - w), 33, "SM");
const cornerSampled = (w, nDraw, seed) =>
  jointSup(0.245, 4 - w, 8 + w, 2 + w, 16 - w, nDraw, seed);

// --------------------------------------------------------------------------
// (A) LEMMA EW: closed-form collapse identity + exact-sup battery
// --------------------------------------------------------------------------
{
  let st = 17;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstCollapse = 0, worstSup = -Infinity;
  for (let t = 0; t < 2000; t++) {
    const a = [rnd() * 4 - 2, rnd() * 4 - 2, rnd() * 4 - 2, rnd() * 4 - 2];
    const Wlo = rnd() * 3, Whi = Wlo + rnd() * 3;
    const cg = a[0] * a[2], cphi = a[1] * a[2] - a[0] * a[3], cpsi = a[1] * a[3];
    const alpha = cg + cpsi, beta = cg + cphi - cpsi;
    const sup = supHW(alpha, beta, Wlo, Whi);
    for (let s = 0; s <= 30; s++) {
      const W = Wlo + ((Whi - Wlo) * s) / 30;
      const direct = quadForm(G4(W), a);
      const closed = a[0] ** 2 + a[1] ** 2 + a[2] ** 2 + a[3] ** 2
        + 2 * Math.exp(-W) * (alpha + beta * W);
      worstCollapse = Math.max(worstCollapse, Math.abs(direct - closed));
      worstSup = Math.max(worstSup, Math.exp(-W) * (alpha + beta * W) - sup);
    }
  }
  MEASURED.ew = { worstCollapse, worstSup };
  assertI(worstCollapse < 1e-11, `imp95157-ew-collapse(${worstCollapse})`);
  assertI(worstSup <= 1e-12, `imp95157-ew-exact-sup(${worstSup})`);
}

// --------------------------------------------------------------------------
// (B) dominance battery: qEW <= qSM on random cut configurations, and
// (C) coupled soundness + nested-ns monotonicity for LEMMA AS
// --------------------------------------------------------------------------
{
  let st = 7;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstDom = -Infinity;
  for (let t = 0; t < 500; t++) {
    const w = rnd() * 0.1, mu = 0.235 + rnd() * 0.01;
    const muI = [mu, mu + rnd() * 0.005];
    const [u0I, hLI, hRI, u2I] = ANCHOR(w);
    const WI = [muI[0] * (hRI[0] - hLI[1]), muI[1] * (hRI[1] - hLI[0])];
    const dlI = [muI[0] * (hLI[0] - u0I[1]), muI[1] * (hLI[1] - u0I[0])];
    const drI = [muI[0] * (u2I[0] - hRI[1]), muI[1] * (u2I[1] - hRI[0])];
    const GI = G4Interval(WI[0], WI[1]);
    const th = (rnd() * Math.PI) / 2;
    const v = [Math.cos(th), Math.sin(th)];
    const m = [rnd(), rnd(), rnd(), rnd()];
    const aB = aBox(v[0], v[1], dlI, drI, m);
    worstDom = Math.max(worstDom, supQuadEW(aB, WI[0], WI[1]) - supQuadSM(aB, GI));
  }
  MEASURED.dominance = { worstDom };
  assertI(worstDom <= 1e-12, `imp95157-ew-dominates-sm(${worstDom})`);

  let worstCoupled = -Infinity, monoBad = 0;
  st = 4242;
  for (let t = 0; t < 300; t++) {
    const w = 0.01 + rnd() * 0.09;
    const muI = [0.24 + rnd() * 0.004, 0.2445 + rnd() * 0.0005];
    const [u0I, hLI, hRI, u2I] = ANCHOR(w);
    const WI = [muI[0] * (hRI[0] - hLI[1]), muI[1] * (hRI[1] - hLI[0])];
    const dlI = [muI[0] * (hLI[0] - u0I[1]), muI[1] * (hLI[1] - u0I[0])];
    const drI = [muI[0] * (u2I[0] - hRI[1]), muI[1] * (u2I[1] - hRI[0])];
    const th = (rnd() * Math.PI) / 2;
    const v = [Math.cos(th), Math.sin(th)];
    const m = [rnd(), rnd(), rnd(), rnd()];
    const bound8 = supQuadAS(v[0], v[1], dlI, drI, m, WI[0], WI[1], 8);
    // random coupled frame point inside the cell
    const mu = muI[0] + rnd() * (muI[1] - muI[0]);
    const u0 = u0I[0] + rnd() * (u0I[1] - u0I[0]), hL = hLI[0] + rnd() * (hLI[1] - hLI[0]);
    const hR = hRI[0] + rnd() * (hRI[1] - hRI[0]), u2 = u2I[0] + rnd() * (u2I[1] - u2I[0]);
    const dl = mu * (hL - u0), dr = mu * (u2 - hR), W = mu * (hR - hL);
    const a = lift(v[0], v[1], dl, dr).map((x, i) => x + SDIAG[i] * m[i]);
    worstCoupled = Math.max(worstCoupled, quadForm(G4(W), a) - bound8);
    if (t < 60) {
      const q1 = supQuadAS(v[0], v[1], dlI, drI, m, WI[0], WI[1], 1);
      const q2 = supQuadAS(v[0], v[1], dlI, drI, m, WI[0], WI[1], 2);
      const q4 = supQuadAS(v[0], v[1], dlI, drI, m, WI[0], WI[1], 4);
      if (!(q2 <= q1 + 1e-12 && q4 <= q2 + 1e-12 && bound8 <= q4 + 1e-12)) monoBad++;
    }
  }
  MEASURED.as = { worstCoupled, monoBad };
  assertI(worstCoupled <= 1e-12, `imp95157-as-coupled-soundness(${worstCoupled})`);
  assertI(monoBad === 0, `imp95157-as-nested-monotone(${monoBad})`);
}

// --------------------------------------------------------------------------
// (D) degenerate collapse + (E) ladder improvement over the SM literals
// --------------------------------------------------------------------------
{
  const IMP95155 = { 0.235: 1.010770, 0.24: 1.000022, 0.245: 0.989803 };
  const collapse = {};
  for (const mu of [0.235, 0.24, 0.245]) {
    collapse[mu] = cellAt(degen(mu), 0, "AS", 4);
    assertI(Math.abs(collapse[mu] - IMP95155[mu]) < 5e-6, `imp95157-degenerate-collapse(${mu})`);
  }
  const SM_LADDER = { 0.01: 2.325e-3, 0.02: 4.650e-3, 0.05: 1.163e-2, 0.1: 2.330e-2 };
  const ladderSM = {}, ladderAS = {};
  for (const w of [0.01, 0.02, 0.05, 0.1]) {
    ladderSM[w] = cellAt(degen(0.245), w, "SM") - IMP95155[0.245];
    ladderAS[w] = cellAt(degen(0.245), w, "AS", 8) - IMP95155[0.245];
    assertI(Math.abs(ladderSM[w] - SM_LADDER[w]) < 5e-6, `imp95157-sm-ladder-anchor(${w})`);
    const cut = (ladderSM[w] - ladderAS[w]) / ladderSM[w];
    assertI(cut > 0.03 && cut < 0.08, `imp95157-ladder-price-cut(${w}:${cut})`);
  }
  MEASURED.ladder = { collapse, ladderSM, ladderAS };
}

// --------------------------------------------------------------------------
// (F) FINDING ID: intrinsic decomposition + two-sided ceiling bracket
// --------------------------------------------------------------------------
{
  const FIXED = 0.989803;
  const shares = {};
  for (const w of [0.02, 0.05, 0.1]) {
    const sm = cellAt(degen(0.245), w, "SM");
    const as8 = cellAt(degen(0.245), w, "AS", 8);
    const corner = cornerSampled(w, 800, 31337);
    const price = sm - FIXED;
    const intrinsicShare = (corner - FIXED) / price;
    const slackRemoved = (sm - as8) / (sm - corner);
    shares[w] = { sm, as8, corner, intrinsicShare, slackRemoved };
    assertI(intrinsicShare > 0.65 && intrinsicShare < 0.75,
      `imp95157-intrinsic-share(${w}:${intrinsicShare})`);
    assertI(slackRemoved > 0.12 && slackRemoved < 0.25,
      `imp95157-slack-removed(${w}:${slackRemoved})`);
  }
  // two point facts bracketing the intrinsic ceiling (no monotonicity input):
  // certified corner still below 1 at 0.0619; SAMPLED (attained) corner sup
  // above 1 at 0.0624 -- no sound certificate covers a cell containing it
  const certAt0619 = cornerCertified(0.0619);
  const sampAt0624 = cornerSampled(0.0624, 800, 31337);
  const as8At0462 = cellAt(degen(0.245), 0.0462, "AS", 8);
  MEASURED.finding = { shares, certAt0619, sampAt0624, as8At0462 };
  assertI(certAt0619 < 1 && Math.abs(certAt0619 - 0.999988) < 5e-5,
    `imp95157-ceiling-cert-point(${certAt0619})`);
  assertI(sampAt0624 > 1 && Math.abs(sampAt0624 - 1.000009) < 5e-5,
    `imp95157-ceiling-sampled-point(${sampAt0624})`);
  assertI(as8At0462 < 1 && Math.abs(as8At0462 - 0.999981) < 5e-5,
    `imp95157-as8-width-point(${as8At0462})`);
}

// --------------------------------------------------------------------------
// (G) slab improvement (headline margins keep the >= 4e-3 discipline)
// --------------------------------------------------------------------------
{
  const slabSM = cellAt([0.2445, 0.245], 0.02, "SM");
  const slabAS = cellAt([0.2445, 0.245], 0.02, "AS", 4);
  MEASURED.slab = { slabSM, slabAS };
  assertI(slabAS <= slabSM - 2e-4, `imp95157-slab-improves(${slabSM},${slabAS})`);
  assertI(slabAS < 1 - 4.5e-3, `imp95157-slab-margin(${slabAS})`);
}

// --------------------------------------------------------------------------
// verdict object
// --------------------------------------------------------------------------
export const IMP95157_JET_PHANTOM_EXACT_WPROFILE = {
  id: "imp-95157",
  title:
    "Exact W-profile tightening of the positional jet-phantom certifier (LEMMA EW: the Gram cross-form collapses to exp(-W)(alpha + beta W) with a single stationary point, so the W-sup is exact; LEMMA AS: sound nested argument subdivision) plus FINDING ID: ~70 percent of the positional price is intrinsic corner growth, capping all future interval tightening at the anchor",
  rigorous: {
    lemmaEW:
      "every W-dependent Gram entry is exp(-W) times an affine function of W, so at any fixed a-box vertex aT G4(W) a = |a|^2 + 2 exp(-W)(alpha + beta W) with alpha = a0a2 + a1a3, beta = a0a2 + a1a2 - a0a3 - a1a3; the profile has one stationary point Wstar = 1 - alpha/beta, so its sup over [Wlo, Whi] is exactly the max at the endpoints and Wstar -- and sup of the sum at a common W never exceeds the sum of per-term sups, so the EW cut dominates the imp-95156 sign-majorized cut at every vertex",
    lemmaAS:
      "the reachable (dl, dr) set is covered by an ns x ns grid of sub-rectangles; per sub-rectangle the same multiplier (pointwise-sound) and the full W interval give a superset, so the max of the EW vertex bound over the grid bounds the cell sup and is monotone nonincreasing along nested grids",
    findingID:
      "the positional price decomposes as (attained corner sup - fixed value) + certificate slack; the first term is unavoidable for EVERY sound certificate because the gap-shrinking corner frame is in the cell -- measured share ~0.70 at all half-widths, and at half-width 0.0624 the ATTAINED corner sup exceeds 1, so no sound cell certificate at the anchor can carry half-width 0.0624 regardless of interval quality",
  },
  measured: {
    ladder:
      "positional loss at mu 0.245 drops 2.325e-3 / 4.650e-3 / 1.163e-2 / 2.330e-2 (SM, reproduced to 5e-6) -> 2.199e-3 / 4.400e-3 / 1.102e-2 / 2.210e-2 (EW+AS8) at half-width 0.01 / 0.02 / 0.05 / 0.10 (~5.3 percent price cut); EW+AS8 removes ~17-18 percent of the REMOVABLE slack",
    certifyingWidth:
      "max certifying half-width at mu 0.245 moves 0.04383 (SM) -> 0.04628 (EW+AS8); point check: the whole half-width-0.0462 cell certifies at 0.999981",
    ceilingBracket:
      "certified corner value 0.999988 < 1 at half-width 0.0619; attained (sampled) corner sup 1.000009 > 1 at 0.0624 -- the intrinsic ceiling on ANY sound cell certificate at the anchor lies in [0.0619, 0.0624]; EW+AS8 already carries 74 percent of it (SM carried 70 percent)",
    slab:
      "the imp-95156 certified slab (mu in [0.2445, 0.245] x half-width 0.02) improves 0.995504 -> 0.995242 under EW+AS4 (margin 4.50e-3 -> 4.76e-3)",
  },
  openSubGap: {
    name: "imp-95154-subgap-jet-phantom-cover",
    status: "OPEN",
    update:
      "SHARPENED by imp-95157: the imp-95156 successor hint (tighten the dl-W coupling) is REPRICED by FINDING ID -- ~70 percent of the positional price is intrinsic corner growth, the interval-tightening lever is capped at ~25 percent more certifying width at the anchor (ceiling bracket [0.0619, 0.0624], EW+AS8 already at 0.0463), so the cap-stage graft (item 1) should budget subdivision cells at the intrinsic scale (~0.164 lambda per unit half-width corner slope at the anchor margin 1.02e-2) instead of waiting for sharper interval arithmetic. Remaining items: (1) graft the positional certifier as a cap stage into the imp-95150 offline runner stack; (3) budget the cover at a candidate floor mu-star in (0.2400105, 0.24502).",
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
export const IMP95157_JET_PHANTOM_EXACT_WPROFILE_ASSERTIONS = [
  {
    id: "imp95157-ew-collapse-and-exact-sup",
    description:
      "LEMMA EW: the closed-form collapse aT G4(W) a = |a|^2 + 2 exp(-W)(alpha + beta W) matches the direct quadratic form to 1e-11 on 2000 random (a, W-interval) pairs, and the stationary-point sup dominates a dense W-grid to 1e-12",
    holds: () => MEASURED.ew.worstCollapse < 1e-11 && MEASURED.ew.worstSup <= 1e-12,
  },
  {
    id: "imp95157-ew-dominates-sign-majorized",
    description:
      "The exact W-profile cut never exceeds the imp-95156 sign-majorized cut on 500 random cut configurations (sup of the sum at a common W <= sum of per-term sups)",
    holds: () => MEASURED.dominance.worstDom <= 1e-12,
  },
  {
    id: "imp95157-as-sound-and-nested-monotone",
    description:
      "LEMMA AS: 300 random coupled (frame, direction, multiplier) points inside a cell never exceed the ns = 8 subdivision bound, and the bound is monotone nonincreasing along the nested grids ns = 1, 2, 4, 8 with zero violations",
    holds: () => MEASURED.as.worstCoupled <= 1e-12 && MEASURED.as.monoBad === 0,
  },
  {
    id: "imp95157-degenerate-collapse",
    description:
      "Zero-width EW+AS cells reproduce the imp-95155 fixed-frame certified values (1.010770 / 1.000022 / 0.989803 at mu 0.235 / 0.24 / 0.245) to 5e-6",
    holds: () =>
      Math.abs(MEASURED.ladder.collapse[0.235] - 1.010770) < 5e-6 &&
      Math.abs(MEASURED.ladder.collapse[0.24] - 1.000022) < 5e-6 &&
      Math.abs(MEASURED.ladder.collapse[0.245] - 0.989803) < 5e-6,
  },
  {
    id: "imp95157-ladder-price-cut",
    description:
      "EW+AS8 cuts the positional price by 3-8 percent at every half-width in {0.01, 0.02, 0.05, 0.1} against the reproduced imp-95156 SM ladder (anchored to its literals to 5e-6)",
    holds: () =>
      [0.01, 0.02, 0.05, 0.1].every((w) => {
        const cut = (MEASURED.ladder.ladderSM[w] - MEASURED.ladder.ladderAS[w]) / MEASURED.ladder.ladderSM[w];
        return cut > 0.03 && cut < 0.08;
      }),
  },
  {
    id: "imp95157-intrinsic-share",
    description:
      "FINDING ID: the attained corner sup accounts for 65-75 percent of the SM positional price at half-widths 0.02 / 0.05 / 0.1 -- the intrinsic part dominates and EW+AS8 removes 12-25 percent of the removable slack",
    holds: () =>
      [0.02, 0.05, 0.1].every((w) => {
        const s = MEASURED.finding.shares[w];
        return s.intrinsicShare > 0.65 && s.intrinsicShare < 0.75 &&
          s.slackRemoved > 0.12 && s.slackRemoved < 0.25;
      }),
  },
  {
    id: "imp95157-ceiling-bracket-points",
    description:
      "Two-sided intrinsic ceiling bracket at the anchor: certified corner 0.999988 < 1 at half-width 0.0619, attained corner sup 1.000009 > 1 at 0.0624 (so no sound cell certificate can carry 0.0624), and the EW+AS8 certifier carries the whole half-width-0.0462 cell at 0.999981 < 1 (deterministic landmark points near the crossings; margins intentionally thin)",
    holds: () =>
      MEASURED.finding.certAt0619 < 1 &&
      MEASURED.finding.sampAt0624 > 1 &&
      MEASURED.finding.as8At0462 < 1 &&
      Math.abs(MEASURED.finding.certAt0619 - 0.999988) < 5e-5 &&
      Math.abs(MEASURED.finding.sampAt0624 - 1.000009) < 5e-5 &&
      Math.abs(MEASURED.finding.as8At0462 - 0.999981) < 5e-5,
  },
  {
    id: "imp95157-slab-improves",
    description:
      "The certified mu-slab (mu in [0.2445, 0.245] x half-width 0.02) improves by at least 2e-4 under EW+AS4 and keeps a margin above 4.5e-3",
    holds: () =>
      MEASURED.slab.slabAS <= MEASURED.slab.slabSM - 2e-4 &&
      MEASURED.slab.slabAS < 1 - 4.5e-3,
  },
  {
    id: "imp95157-honest-record-literals",
    description:
      "No constant moves: class sandwich and the k <= 4 ladder floor 47/200 carried unchanged; no bound promotion; no QED; the cover sub-gap stays OPEN (items 1 and 3 remain; the imp-95156 successor hint is repriced, not the sub-gap closed)",
    holds: () =>
      IMP95157_JET_PHANTOM_EXACT_WPROFILE.carried.classSandwich[0] === 0.2320723 &&
      IMP95157_JET_PHANTOM_EXACT_WPROFILE.carried.classSandwich[1] === 0.24502 &&
      IMP95157_JET_PHANTOM_EXACT_WPROFILE.carried.ladderFloorKle4 === 47 / 200 &&
      IMP95157_JET_PHANTOM_EXACT_WPROFILE.promotesBound === false &&
      IMP95157_JET_PHANTOM_EXACT_WPROFILE.noQED === true &&
      IMP95157_JET_PHANTOM_EXACT_WPROFILE.openSubGap.status === "OPEN",
  },
];

for (const a of IMP95157_JET_PHANTOM_EXACT_WPROFILE_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95157-jet-phantom-exact-wprofile assertion failed: ${a.id}`);
}
