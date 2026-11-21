/**
 * imp-95168 - RIGOROUS step -- SATELLITE BULGE ARCHITECTURE FLOOR + SINGLE-
 * DOUBLED-BLOCK STRIP COVER (FINDING SB explicit multi-packet witness with
 * exact hollow-matrix lambda_max > 1 inside the strip + THEOREM SR
 * Perron-interval continuum refutation + LEMMA TS exact two-point interval
 * supremum + THEOREM SD three-channel certified cover at floor 0.2320727 +
 * COROLLARY SF strip composition).
 *
 * CONTEXT. imp-95167 closed the open strip [0.2320723, 0.23209) of the
 * parity-pure common-rate MAJ witness class for single-packet-per-block
 * witnesses and named the surviving burden: even-parity, block-0-occupied
 * witnesses with at least two packets in some block of 0..4. Its
 * successorFrontier proposed proving that hull spreading strictly
 * DECREASES lambda_max near the binding corner. THIS STEP REFUTES THAT
 * MECHANISM and replaces it with a two-sided certified bracket.
 *
 * FINDING SB (satellite bulge; rigorous refutation by explicit witness).
 * Put unit packets at the imp-95167 binding corner (2, 4, 16, 64, 256) and
 * move a small satellite mass eps to the RIGHT END of block 1: the block-1
 * profile becomes (1 - eps) phi(4) + eps phi(8). At the strip left
 * endpoint mu = 0.2320723 the exact normalized hollow block bond matrix of
 * this witness has lambda_max = 1.0000001759857156 > 1 at
 * eps* = 0.0020642307302 -- 6.8767e-7 ABOVE the recorded corner value
 * 0.99999948831812802 (reproduced here bit-consistently), certified by an
 * explicit Rayleigh vector (quotient > 1 + 1.7e-7, float error ~1e-15,
 * eight orders below the margin). Satellites in blocks 2 and 3 produce
 * gain <= 1e-13 (measured null), a third point adds <= 1e-9 on a probe
 * grid (measured null), and the maximizing family is one-dimensional in
 * eps at the corner geometry.
 *
 * THEOREM SR (continuum refutation; rigorous). For a FIXED configuration,
 * every numerator kernel term g(mu d) is strictly decreasing in mu, and
 * every block norm n(mu) is nonincreasing in mu (its Gram entries are
 * g(mu w)); hence on a rate interval [m1, m2] the matrix Mlo with
 * numerators evaluated at m2 and norms evaluated at m1 satisfies
 * 0 <= Mlo <= M(mu) entrywise for every mu in [m1, m2], and Perron
 * monotonicity gives lambda_max(M(mu)) >= lambda_max(Mlo) >= Rayleigh(Mlo).
 * An adaptive bisection of [0.2320723, 0.232072389] into intervals whose
 * Mlo Rayleigh quotient exceeds 1 certifies: the satellite witness has
 * lambda_max > 1 at EVERY rate in that sub-strip. CONSEQUENCE: no
 * certificate that upper-bounds E via lambda_max of the exact 5-block
 * normalized bond matrix (the entire imp-95154..95167 architecture,
 * including every cut family and every relaxation-free treatment) can
 * close the sub-strip [0.2320723, 0.232072389] -- the recorded cut-family
 * stall 0.232084 is therefore NOT pure relaxation slack: at least the
 * bottom 9e-8 of the strip is intrinsic to the architecture. The measured
 * crossing of the satellite family (max over eps) is
 * muSAT = 0.23207238984, 3.5e-7 ABOVE the recorded single-packet intrinsic
 * crossing 0.2320720385: the multi-packet architecture floor sits INSIDE
 * the strip. Note lambda_max > 1 does NOT construct an E > 0 witness (the
 * aggregation inequality bounds E from above only): the witness side, the
 * class sandwich, and all recorded class constants are untouched.
 *
 * LEMMA TS (exact two-point interval supremum; rigorous, elementary
 * calculus). For a, b > 0, c in [0, 1), the one-parameter normalized bond
 * f(s) = (s a + (1 - s) b) / sqrt(1 - 2 s (1 - s)(1 - c)) is smooth on
 * [0, 1] (the denominator is >= (1 + c)/2 > 0) and its derivative
 * vanishes where 2 N' D = N D' with N linear and D quadratic; the
 * quadratic terms cancel identically and the critical equation is LINEAR
 * with the single root s* = (a - b c) / ((1 - c)(a + b)). Hence
 * sup over [s_lo, s_hi] of f = max of f at the two endpoints and at s*
 * when it is interior -- closed form, exact. Applied entrywise with
 * kernel values at cell-minimal distances (numerator upper), Gram entry
 * at cell-maximal width (denominator lower), and the recorded KN2
 * support-gap cap as a pointwise min, this gives a positional-interval
 * majorant of every exact two-point block bond that is EXACT at
 * zero-width cells -- the enclosure THEOREM SD certifies with. (A
 * 2000-draw dense-grid battery cross-checks the implementation.)
 *
 * THEOREM SD (single-doubled-block cover; certified run). Class: blocks 0
 * and 4 carry ARBITRARY nonnegative profiles (collapsed exactly onto
 * their inner endpoint packets by the recorded THEOREM SA -- both blocks
 * are one-sided in the 5-block geometry, so every row entry is dominated,
 * for the same witness, by the nearest-endpoint packet row, and Perron
 * monotonicity transfers lambda_max); blocks 1..3 carry at most two
 * packets each, with AT MOST ONE of blocks 1..3 doubled (ratio symmetry
 * (u, v, t) -> (v, u, 1 - t) reduces to t in [1/2, 1]). The deterministic
 * branch-and-bound over rate x positions x satellite ratio at floor
 * MUF = 0.2320727, threshold 1 - 2e-7, terminates for ALL THREE channels
 * with ZERO unresolved cells (block-1 satellite: 99990 leaves, the bulge
 * channel; block-2: 52; block-3: 48), exact partitions, worst leaf
 * 0.9999997999946019 < 1 - 2e-7. Hence every witness of this class has
 * exact hollow lambda_max < 1 at every rate in [0.2320727, 0.23209), and
 * E <= 0 there by the carried aggregation algebra; the recorded
 * unconditional window continues the statement to [0.23209, 0.24502].
 *
 * COROLLARY SF (strip composition, carried recorded links: aggregation
 * algebra, Cauchy interlacing for empty blocks, THEOREM TX for blocks
 * >= 5 (correction 9.45e-50), LEMMA OP + THEOREM RW odd parity
 * (S(0.4641446) = 0.8884142800 < 1), LEMMA GA + THEOREM RW block-0-empty
 * (S(0.9282892) = 0.4512638394 < 1)). The open strip now splits in three:
 * (i) [0.2320723, 0.232072389]: hollow-lambda certification REFUTED for
 * the class (THEOREM SR witness) -- closing it requires a different
 * E-reduction (finer than 5-block bond aggregation), for every multi-
 * packet burden configuration; (ii) (0.232072389, 0.2320727): certified
 * crossing bracket of the single-doubled-block family, width 3.1e-7,
 * lambda-route neither refuted nor achieved; (iii) [0.2320727, 0.23209):
 * closed for the single-doubled class -- the burden there contracts to
 * even-parity block-0-occupied witnesses with at least TWO doubled blocks
 * among 1..3 or at least THREE packets in some block of 1..3.
 *
 * SKEPTICAL RECORD. (1) FINDING SB corrects two recorded readings: the
 * imp-95167 successorFrontier spectral-decrease hope is FALSE (spreading
 * strictly increases lambda at the corner), and imp-95163 FINDING RA
 * ("multi-packet ascent collapses to the k = 1 corner value to 7 digits")
 * was true only to its 7-digit resolution -- the 8th digit carries the
 * bulge. (2) The FULL two-point class (two or three doubled blocks) stays
 * OPEN on [0.2320727, 0.23209): the direct 12-D branch-and-bound was
 * measured intractable (3M cells without termination at floor 0.232085;
 * the binding slack is cross-entry ratio decoupling, which an entrywise
 * majorant cannot avoid) -- a successor needs a center-form/Lipschitz
 * enclosure or a new reduction. (3) The refuted sub-strip statement is
 * architecture-scoped: it eliminates hollow-lambda certificates of the 5-block
 * aggregation, not the E <= 0 truth (batteries again found no E > 0
 * witness). (4) Float scope: chain-standard positive-pivot Cholesky on
 * 1e-12-inflated majorants, margins >= 2e-7, Rayleigh margins >= 1.7e-8
 * with ~1e-15 roundoff; in-sweep cost ~5 s (the 200k-cell bulge-channel
 * cover; heaviest module of the chain, recorded).
 *
 * HONEST SCOPE. No recorded class constant moves: class sandwich
 * [0.2320723, 0.24502], unconditional window [0.23209, 0.24502], open
 * strip endpoints, k <= 4 ladder floor 47/200 all carried UNCHANGED.
 * Composition is as strong as the recorded links it cites. Changes no
 * Lambda bound; NO QED; no refereed bound is changed.
 *
 * Import-light; zero imports; deterministic; in-sweep ~5 s.
 */
const g = (z) => Math.exp(-z) * (1 + z);

function assertI(cond, id) {
  if (!cond) throw new Error(`imp-95168-satellite-bulge-architecture-floor assertion failed: ${id}`);
}
const MEASURED = {};

const MUSTAR = 0.2320723; // recorded class floor = strip left endpoint
const STRIP_RIGHT = 0.23209; // recorded unconditional-window floor
const MUF = 0.2320727; // THEOREM SD certification floor
const REF_HI = 0.232072389; // THEOREM SR continuum-refutation upper end
const T_CERT = 1 - 2e-7;
const NUDGE = 1 + 1e-12;
const BOX = [[1, 2], [4, 8], [16, 32], [64, 128], [256, 512]];
const CORNER_LAM = 0.99999948831812802; // imp-95167 binding-corner literal

function lamMaxSym(Min) {
  const n = Min.length;
  const A = Min.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-22) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const tt = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(tt * tt + 1), s = tt * c;
        for (let k = 0; k < n; k++) {
          const kp = A[k][p], kq = A[k][q];
          A[k][p] = c * kp - s * kq; A[k][q] = s * kp + c * kq;
        }
        for (let k = 0; k < n; k++) {
          const pk = A[p][k], qk = A[q][k];
          A[p][k] = c * pk - s * qk; A[q][k] = s * pk + c * qk;
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
// exact hollow normalized block bond matrix for multi-point blocks
// pts[b] = [{x, w}, ...] with nonnegative weights
function exactHollow(pts, mu) {
  const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
  const norms = pts.map((P) => {
    let s = 0;
    for (const a of P) for (const c of P) s += a.w * c.w * g(mu * Math.abs(a.x - c.x));
    return Math.sqrt(s);
  });
  for (let i = 0; i < 5; i++)
    for (let j = i + 1; j < 5; j++) {
      let s = 0;
      for (const a of pts[i]) for (const c of pts[j]) s += a.w * c.w * g(mu * Math.abs(c.x - a.x));
      M[i][j] = M[j][i] = s / (norms[i] * norms[j]);
    }
  return M;
}
// satellite family: corner packets + minority mass eps at the block-1 right end
const famPts = (eps) => [
  [{ x: 2, w: 1 }],
  [{ x: 4, w: 1 - eps }, { x: 8, w: eps }],
  [{ x: 16, w: 1 }], [{ x: 64, w: 1 }], [{ x: 256, w: 1 }],
];
const famLam = (eps, mu) => lamMaxSym(exactHollow(famPts(eps), mu));
function goldenMax(f, lo, hi, iters) {
  const phi = (Math.sqrt(5) - 1) / 2;
  let a = lo, b = hi, c = b - phi * (b - a), d = a + phi * (b - a);
  let fc = f(c), fd = f(d);
  for (let i = 0; i < iters; i++) {
    if (fc > fd) { b = d; d = c; fd = fc; c = b - phi * (b - a); fc = f(c); }
    else { a = c; c = d; fc = fd; d = a + phi * (b - a); fd = f(d); }
  }
  const x = (a + b) / 2;
  return { x, v: f(x) };
}
// explicit Rayleigh certificate: power iteration then exact quotient
function rayleighOf(M) {
  let v = [1, 1, 1, 1, 1];
  for (let it = 0; it < 500; it++) {
    const w = v.map((_, i) => v.reduce((s, x, j) => s + M[i][j] * x, 0) + 2 * v[i]);
    const nn = Math.sqrt(w.reduce((s, x) => s + x * x, 0));
    v = w.map((x) => x / nn);
  }
  const Mv = v.map((_, i) => v.reduce((s, x, j) => s + M[i][j] * x, 0));
  return v.reduce((s, x, i) => s + x * Mv[i], 0) / v.reduce((s, x) => s + x * x, 0);
}

// --------------------------------------------------------------------------
// (A) FINDING SB: the satellite witness crosses 1 inside the strip
// --------------------------------------------------------------------------
{
  const corner = famLam(0, MUSTAR);
  const opt = goldenMax((e) => famLam(e, MUSTAR), 0, 0.02, 120);
  const ray = rayleighOf(exactHollow(famPts(opt.x), MUSTAR));
  // crossing of the family (max over eps) in mu
  let lo = MUSTAR, hi = 0.2320728;
  for (let i = 0; i < 45; i++) {
    const m = (lo + hi) / 2;
    if (goldenMax((e) => famLam(e, m), 0, 0.02, 90).v > 1) lo = m; else hi = m;
  }
  MEASURED.sb = { corner, epsStar: opt.x, lamStar: opt.v, ray, muSatLo: lo, muSatHi: hi };
  assertI(Math.abs(corner - CORNER_LAM) < 1e-12, `imp95168-sb-corner(${corner})`);
  assertI(Math.abs(opt.v - 1.0000001759857156) < 1e-12, `imp95168-sb-lamstar(${opt.v})`);
  assertI(Math.abs(opt.x - 0.0020642307302) < 1e-8, `imp95168-sb-epsstar(${opt.x})`);
  assertI(ray > 1 + 1.7e-7, `imp95168-sb-rayleigh(${ray})`);
  assertI(lo > MUSTAR && hi < MUF && Math.abs(lo - 0.23207238984) < 1e-10,
    `imp95168-sb-crossing(${lo},${hi})`);
  // satellite gain sits ABOVE the recorded single-packet intrinsic crossing
  assertI(lo - 0.2320720385 > 3e-7, "imp95168-sb-floor-moved-up");
  // measured nulls: block-2 / block-3 satellites and a third point add nothing
  const sat2 = goldenMax((e) => lamMaxSym(exactHollow([
    [{ x: 2, w: 1 }], [{ x: 4, w: 1 }],
    [{ x: 16, w: 1 - e }, { x: 32, w: e }], [{ x: 64, w: 1 }], [{ x: 256, w: 1 }],
  ], MUSTAR)), 0, 0.05, 90).v;
  const sat3 = goldenMax((e) => lamMaxSym(exactHollow([
    [{ x: 2, w: 1 }], [{ x: 4, w: 1 }], [{ x: 16, w: 1 }],
    [{ x: 64, w: 1 - e }, { x: 128, w: e }], [{ x: 256, w: 1 }],
  ], MUSTAR)), 0, 0.05, 90).v;
  let best3 = -Infinity;
  for (let xi = 0; xi <= 20; xi++)
    for (const w of [0.0005, 0.002, 0.01]) {
      const pts = famPts(MEASURED.sb.epsStar).map((P) => P.map((q) => ({ ...q })));
      pts[1].push({ x: 4 + (xi / 20) * 4, w });
      best3 = Math.max(best3, lamMaxSym(exactHollow(pts, MUSTAR)));
    }
  MEASURED.sb.sat2Gain = sat2 - corner;
  MEASURED.sb.sat3Gain = sat3 - corner;
  MEASURED.sb.thirdPointGain = best3 - MEASURED.sb.lamStar;
  assertI(MEASURED.sb.sat2Gain < 1e-12 && MEASURED.sb.sat3Gain < 1e-12,
    `imp95168-sb-null-sats(${MEASURED.sb.sat2Gain},${MEASURED.sb.sat3Gain})`);
  assertI(MEASURED.sb.thirdPointGain < 1e-9, `imp95168-sb-null-third(${MEASURED.sb.thirdPointGain})`);
}

// --------------------------------------------------------------------------
// (B) THEOREM SR: Perron-interval continuum refutation on [MUSTAR, REF_HI]
// numerators at the interval right end, norms at the left end give an
// entrywise LOWER matrix for every rate in the interval
// --------------------------------------------------------------------------
{
  const eps = MEASURED.sb.epsStar;
  const pts = famPts(eps);
  const lowerM = (m1, m2) => {
    const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
    const normsHi = pts.map((P) => {
      let s = 0;
      for (const a of P) for (const c of P) s += a.w * c.w * g(m1 * Math.abs(a.x - c.x));
      return Math.sqrt(s);
    });
    for (let i = 0; i < 5; i++)
      for (let j = i + 1; j < 5; j++) {
        let s = 0;
        for (const a of pts[i]) for (const c of pts[j]) s += a.w * c.w * g(m2 * Math.abs(c.x - a.x));
        M[i][j] = M[j][i] = s / (normsHi[i] * normsHi[j]);
      }
    return M;
  };
  let intervals = 0, worstMargin = Infinity, unresolved = 0;
  const stack = [[MUSTAR, REF_HI]];
  while (stack.length) {
    const [m1, m2] = stack.pop();
    const r = rayleighOf(lowerM(m1, m2));
    if (r > 1 + 1e-12) { intervals++; worstMargin = Math.min(worstMargin, r - 1); continue; }
    if (m2 - m1 < 1e-13) { unresolved++; continue; }
    const mm = (m1 + m2) / 2;
    stack.push([m1, mm], [mm, m2]);
  }
  MEASURED.sr = { intervals, worstMargin, unresolved, refHi: REF_HI };
  assertI(unresolved === 0, `imp95168-sr-unresolved(${unresolved})`);
  assertI(worstMargin > 1e-10, `imp95168-sr-margin(${worstMargin})`);
}

// --------------------------------------------------------------------------
// (C) LEMMA TS: exact interval supremum of the two-point normalized bond
// --------------------------------------------------------------------------
function fSup(a, b, c, lo, hi) {
  const f = (s) => (s * a + (1 - s) * b) / Math.sqrt(1 - 2 * s * (1 - s) * (1 - c));
  let m = Math.max(f(lo), f(hi));
  const e = 1 - c;
  if (e > 1e-15) {
    const sStar = (a - b * c) / (e * (a + b));
    if (sStar > lo && sStar < hi) m = Math.max(m, f(sStar));
  }
  return m;
}
{
  let st = 951681;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worst = -Infinity;
  for (let t = 0; t < 2000; t++) {
    const a = 0.01 + rnd(), b = 0.01 + rnd(), c = rnd() * 0.999999;
    let lo = rnd(), hi = rnd();
    if (lo > hi) { const q = lo; lo = hi; hi = q; }
    const sup = fSup(a, b, c, lo, hi);
    for (let i = 0; i <= 200; i++) {
      const s = lo + (i / 200) * (hi - lo);
      const f = (s * a + (1 - s) * b) / Math.sqrt(1 - 2 * s * (1 - s) * (1 - c));
      worst = Math.max(worst, f - sup);
    }
  }
  MEASURED.ts = { worstExcess: worst };
  assertI(worst <= 1e-12, `imp95168-ts-battery(${worst})`);
}

// --------------------------------------------------------------------------
// (D) THEOREM SD: three-channel single-doubled-block cover at MUF
// dims: 0=mu 1=u0 [2,3,4]=block1(u,v,t) [5,6,7]=block2 [8,9,10]=block3 11=u4
// --------------------------------------------------------------------------
function makeCellBound(pairMask) {
  const idx = [[1], [2, 3, 4], [5, 6, 7], [8, 9, 10], [11]];
  return function cellBoundMatrix(lo, hi) {
    const muLo = lo[0], muHi = hi[0];
    const blocks = [], tIv = [];
    for (let b = 0; b < 5; b++) {
      if (idx[b].length === 1 || !pairMask[b]) {
        blocks.push([{ lo: lo[idx[b][0]], hi: hi[idx[b][0]] }]);
        tIv.push(null);
      } else {
        const [iu, iv, it] = idx[b];
        blocks.push([{ lo: lo[iu], hi: hi[iu] }, { lo: lo[iv], hi: hi[iv] }]);
        tIv.push([lo[it], hi[it]]);
      }
    }
    const cLoOf = blocks.map((B) => {
      if (B.length === 1) return null;
      const wHi = Math.max(B[1].hi - B[0].lo, B[0].hi - B[1].lo, 0);
      return g(muHi * wHi);
    });
    const M = Array.from({ length: 5 }, () => new Array(5).fill(0));
    for (let i = 0; i < 5; i++)
      for (let j = i + 1; j < 5; j++) {
        const A = blocks[i], B = blocks[j];
        const K = A.map((p) => B.map((q) => g(muLo * (q.lo - p.hi))));
        const dminSup = Math.min(...B.map((q) => q.lo)) - Math.max(...A.map((p) => p.hi));
        const kn2 = g(muLo * dminSup); // recorded KN2 occupancy-blind support-gap cap
        let bound;
        if (A.length === 1 && B.length === 1) bound = K[0][0];
        else if (A.length === 1) bound = Math.min(fSup(K[0][0], K[0][1], cLoOf[j], tIv[j][0], tIv[j][1]), kn2);
        else if (B.length === 1) bound = Math.min(fSup(K[0][0], K[1][0], cLoOf[i], tIv[i][0], tIv[i][1]), kn2);
        else {
          const r0 = fSup(K[0][0], K[0][1], cLoOf[j], tIv[j][0], tIv[j][1]);
          const r1 = fSup(K[1][0], K[1][1], cLoOf[j], tIv[j][0], tIv[j][1]);
          bound = Math.min(fSup(r0, r1, cLoOf[i], tIv[i][0], tIv[i][1]), kn2);
        }
        M[i][j] = M[j][i] = bound * NUDGE;
      }
    return M;
  };
}
function runCover(satBlock) {
  const pairMask = [false, satBlock === 1, satBlock === 2, satBlock === 3, false];
  const cellBound = makeCellBound(pairMask);
  const lo0 = [MUF], hi0 = [STRIP_RIGHT];
  for (let b = 0; b < 5; b++) {
    if (b === 0 || b === 4) { lo0.push(BOX[b][0]); hi0.push(BOX[b][1]); continue; }
    if (pairMask[b]) { lo0.push(BOX[b][0], BOX[b][0], 0.5); hi0.push(BOX[b][1], BOX[b][1], 1); }
    else { lo0.push(BOX[b][0], BOX[b][0], 1); hi0.push(BOX[b][1], BOX[b][0], 1); }
  }
  const active = [];
  for (let d = 0; d < 12; d++) if (hi0[d] - lo0[d] > 0) active.push(d);
  const leaves = [];
  const stack = [{ lo: lo0, hi: hi0, depth: 0 }];
  let maxDepth = 0, unresolved = 0, nEval = 0, worst = -Infinity;
  while (stack.length) {
    const c = stack.pop();
    nEval++;
    maxDepth = Math.max(maxDepth, c.depth);
    const U = cellBound(c.lo, c.hi);
    if (cholCertifies(U, T_CERT)) {
      leaves.push(c);
      worst = Math.max(worst, lamMaxSym(U));
      continue;
    }
    let best = -1, bestScore = -Infinity;
    for (const d of active) {
      if (c.hi[d] - c.lo[d] <= 1e-13) continue;
      const m = c.lo[d] + (c.hi[d] - c.lo[d]) / 2;
      const h1 = c.hi.slice(); h1[d] = m;
      const l2 = c.lo.slice(); l2[d] = m;
      const s = 0.5 * (lamMaxSym(cellBound(c.lo, h1)) + lamMaxSym(cellBound(l2, c.hi)));
      if (-s > bestScore) { bestScore = -s; best = d; }
    }
    if (c.depth >= 300 || best < 0) { unresolved++; continue; }
    const m = c.lo[best] + (c.hi[best] - c.lo[best]) / 2;
    const h1 = c.hi.slice(); h1[best] = m;
    const l2 = c.lo.slice(); l2[best] = m;
    stack.push({ lo: c.lo, hi: h1, depth: c.depth + 1 });
    stack.push({ lo: l2, hi: c.hi, depth: c.depth + 1 });
  }
  const vol = (lo, hi) => active.reduce((s, d) => s * (hi[d] - lo[d]), 1);
  const volSum = leaves.reduce((s, c) => s + vol(c.lo, c.hi), 0);
  const volRel = Math.abs(volSum - vol(lo0, hi0)) / vol(lo0, hi0);
  return { leaves, maxDepth, unresolved, nEval, worst, volRel, cellBound, active };
}
const COVERS = { 1: runCover(1), 2: runCover(2), 3: runCover(3) };
{
  MEASURED.sd = {};
  for (const b of [1, 2, 3]) {
    const c = COVERS[b];
    MEASURED.sd[`ch${b}`] = {
      leaves: c.leaves.length, maxDepth: c.maxDepth, unresolved: c.unresolved,
      nEval: c.nEval, worst: c.worst, volRel: c.volRel,
    };
    assertI(c.unresolved === 0, `imp95168-sd-unresolved-ch${b}(${c.unresolved})`);
    assertI(c.worst < T_CERT, `imp95168-sd-worst-ch${b}(${c.worst})`);
    assertI(c.volRel < 1e-9, `imp95168-sd-partition-ch${b}(${c.volRel})`);
  }
  assertI(MEASURED.sd.ch1.leaves === 99990 && MEASURED.sd.ch1.maxDepth === 95,
    `imp95168-sd-shape-ch1(${MEASURED.sd.ch1.leaves},${MEASURED.sd.ch1.maxDepth})`);
  assertI(Math.abs(MEASURED.sd.ch1.worst - 0.9999997999946019) < 1e-10,
    `imp95168-sd-worst-literal(${MEASURED.sd.ch1.worst})`);
  assertI(MEASURED.sd.ch2.leaves === 52 && MEASURED.sd.ch3.leaves === 48,
    `imp95168-sd-shape-ch23(${MEASURED.sd.ch2.leaves},${MEASURED.sd.ch3.leaves})`);
}

// --------------------------------------------------------------------------
// (E) THEOREM SA outer-block collapse battery (blocks 0/4 arbitrary
// occupancy -> inner endpoint packets dominate, for the same witness)
// --------------------------------------------------------------------------
{
  let st = 951682;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  let worstLam = -Infinity, worstEntry = -Infinity;
  for (let t = 0; t < 400; t++) {
    const k0 = 1 + Math.floor(rnd() * 5), k4 = 1 + Math.floor(rnd() * 5);
    const b0 = Array.from({ length: k0 }, () => ({ x: 1 + rnd(), w: 0.05 + rnd() }));
    const b4 = Array.from({ length: k4 }, () => ({ x: 256 + rnd() * 256, w: 0.05 + rnd() }));
    const mids = [1, 2, 3].map((b) => [{ x: BOX[b][0] + rnd() * (BOX[b][1] - BOX[b][0]), w: 1 }]);
    const mu = MUF + rnd() * (STRIP_RIGHT - MUF);
    const pts = [b0, ...mids, b4];
    const M = exactHollow(pts, mu);
    const r0 = Math.max(...b0.map((p) => p.x));
    const l4 = Math.min(...b4.map((p) => p.x));
    const ptsC = [[{ x: r0, w: 1 }], ...mids, [{ x: l4, w: 1 }]];
    const MC = exactHollow(ptsC, mu);
    for (let i = 0; i < 5; i++)
      for (let j = 0; j < 5; j++) if (i !== j) worstEntry = Math.max(worstEntry, M[i][j] - MC[i][j]);
    worstLam = Math.max(worstLam, lamMaxSym(M) - lamMaxSym(MC));
  }
  MEASURED.sa = { worstEntry, worstLam };
  assertI(worstEntry <= 1e-12, `imp95168-sa-entry(${worstEntry})`);
  assertI(worstLam <= 1e-12, `imp95168-sa-lam(${worstLam})`);
}

// --------------------------------------------------------------------------
// (F) cover-location battery: random single-doubled witnesses at covered
// rates locate in a certified leaf and never exceed its majorant
// --------------------------------------------------------------------------
{
  let st = 951683;
  const rnd = () => { st = (st * 1103515245 + 12345) & 0x7fffffff; return st / 0x7fffffff; };
  const N = 150;
  let located = 0, worstVsLeaf = -Infinity, worstAbs = -Infinity;
  for (let t = 0; t < N; t++) {
    const sat = 1 + (t % 3);
    const mu = MUF + rnd() * (STRIP_RIGHT - MUF);
    const x = [mu];
    for (let b = 0; b < 5; b++) {
      if (b === 0 || b === 4) { x.push(BOX[b][0] + rnd() * (BOX[b][1] - BOX[b][0])); continue; }
      if (b === sat) {
        x.push(BOX[b][0] + rnd() * (BOX[b][1] - BOX[b][0]),
          BOX[b][0] + rnd() * (BOX[b][1] - BOX[b][0]), 0.5 + rnd() * 0.5);
      } else x.push(BOX[b][0] + rnd() * (BOX[b][1] - BOX[b][0]), BOX[b][0], 1);
    }
    if (t % 10 === 0) {
      // pin near the satellite bulge geometry at the floor
      x[0] = MUF; x[1] = 2;
      if (sat === 1) { x[2] = 4; x[3] = 8; x[4] = 1 - 0.0020642307302; }
    }
    const cover = COVERS[sat];
    const leaf = cover.leaves.find((c) => x.every((v, d) =>
      (cover.active.includes(d) ? v >= c.lo[d] - 1e-12 && v <= c.hi[d] + 1e-12 : true)));
    if (!leaf) continue;
    located++;
    const pts = [
      [{ x: x[1], w: 1 }],
      sat === 1 ? [{ x: x[2], w: x[4] }, { x: x[3], w: 1 - x[4] }] : [{ x: x[2], w: 1 }],
      sat === 2 ? [{ x: x[5], w: x[7] }, { x: x[6], w: 1 - x[7] }] : [{ x: x[5], w: 1 }],
      sat === 3 ? [{ x: x[8], w: x[10] }, { x: x[9], w: 1 - x[10] }] : [{ x: x[8], w: 1 }],
      [{ x: x[11], w: 1 }],
    ];
    const lamExact = lamMaxSym(exactHollow(pts, x[0]));
    const lamLeaf = lamMaxSym(cover.cellBound(leaf.lo, leaf.hi));
    worstVsLeaf = Math.max(worstVsLeaf, lamExact - lamLeaf);
    worstAbs = Math.max(worstAbs, lamExact);
  }
  MEASURED.battery = { located, worstVsLeaf, worstAbs };
  assertI(located === N, `imp95168-battery-located(${located})`);
  assertI(worstVsLeaf <= 1e-12, `imp95168-battery-leaf(${worstVsLeaf})`);
  assertI(worstAbs < T_CERT, `imp95168-battery-abs(${worstAbs})`);
}

// --------------------------------------------------------------------------
// (G) COROLLARY SF composition literals (carried recorded links)
// --------------------------------------------------------------------------
const S = (m) => g(2 * m) + g(8 * m) + g(14 * m) + 2 * g(56 * m) + 2 * g(248 * m);
{
  const txCorr = Math.sqrt(10) * g(512 * MUSTAR) + 3 * g(2048 * MUSTAR);
  MEASURED.composition = {
    txCorr, sOdd: S(2 * MUSTAR), sGauge: S(4 * MUSTAR),
    refutedWidth: REF_HI - MUSTAR,
    bracketWidth: MUF - MEASURED.sb.muSatHi,
    coveredWidth: STRIP_RIGHT - MUF,
  };
  assertI(txCorr < 1e-40, `imp95168-tx(${txCorr})`);
  assertI(MEASURED.composition.sOdd < 0.889 && MEASURED.composition.sGauge < 1,
    `imp95168-op-ga(${MEASURED.composition.sOdd},${MEASURED.composition.sGauge})`);
  assertI(MEASURED.composition.refutedWidth > 8e-8 && MEASURED.composition.bracketWidth < 3.2e-7,
    `imp95168-widths(${MEASURED.composition.refutedWidth},${MEASURED.composition.bracketWidth})`);
}

// --------------------------------------------------------------------------
// verdict object
// --------------------------------------------------------------------------
export const IMP95168_SATELLITE_BULGE_ARCHITECTURE_FLOOR = {
  id: "imp-95168",
  title:
    "Satellite bulge architecture floor + single-doubled-block strip cover: FINDING SB (an explicit two-packet-block witness -- corner packets plus minority mass 0.00206 at the block-1 right end -- has exact hollow block-bond lambda_max = 1.0000001759857156 > 1 at the strip left endpoint 0.2320723, Rayleigh-certified) + THEOREM SR (Perron-interval continuum refutation: lambda_max > 1 at EVERY rate in [0.2320723, 0.232072389], so no 5-block hollow-lambda certificate can close the strip bottom) + LEMMA TS (closed-form exact interval supremum of the two-point normalized bond; the critical equation is linear) + THEOREM SD (three-channel certified branch-and-bound at floor 0.2320727: every witness with arbitrary nonnegative profiles in blocks 0/4 and at most one doubled block among 1..3 has E <= 0 at every common rate in [0.2320727, 0.23209)) + COROLLARY SF (the strip splits into refuted / bracket / covered sub-strips)",
  rigorous: {
    findingSB:
      "explicit witness: packets at (2, 4, 16, 64, 256) with satellite mass eps* = 0.0020642307302 at 8; exact hollow lambda_max at mu = 0.2320723 is 1.0000001759857156, exceeding the recorded corner value 0.99999948831812802 by 6.877e-7; certified by an explicit Rayleigh vector with quotient > 1 + 1.7e-7 (float roundoff ~1e-15); the family crossing (max over eps) is muSAT = 0.23207238984, which is 3.5e-7 ABOVE the recorded single-packet intrinsic crossing 0.2320720385 and INSIDE the open strip",
    theoremSR:
      "for a fixed configuration every numerator term g(mu d) decreases in mu and every block norm decreases in mu, so numerators at the right end and norms at the left end of a rate interval give an entrywise nonnegative LOWER matrix; Perron monotonicity turns one Rayleigh certificate per interval into lambda_max > 1 for every rate in the interval; the adaptive partition of [0.2320723, 0.232072389] certifies with zero unresolved intervals: the hollow-lambda architecture (imp-95154..95167, cut families included) cannot close the sub-strip",
    lemmaTS:
      "f(s) = (s a + (1 - s) b)/sqrt(1 - 2 s (1 - s)(1 - c)) is smooth (denominator >= (1 + c)/2) and d(f^2)/ds = 0 reduces to a LINEAR equation (the quadratic terms cancel identically) with root s* = (a - b c)/((1 - c)(a + b)); the interval supremum is the max of f at the endpoints and at interior s* -- exact, closed form; applied with kernel values at cell-minimal distances, Gram entry at cell-maximal width, and the recorded KN2 support-gap cap, it majorizes every exact two-point block bond and is exact at zero-width cells",
    theoremSD:
      "the recorded THEOREM SA collapses blocks 0 and 4 (one-sided in the 5-block geometry) onto their inner endpoint packets for ANY nonnegative occupancy, jointly per witness with Perron transfer; ratio relabeling reduces to t in [1/2, 1]; the deterministic branch-and-bound at floor 0.2320727, threshold 1 - 2e-7, terminates with zero unresolved cells in all three channels (block-1 satellite 99990 leaves / depth 95 / worst 0.9999997999946019; block-2 52 leaves; block-3 48 leaves), exact partitions: every single-doubled-block witness has exact hollow lambda_max < 1 - 2e-7 on [0.2320727, 0.23209), hence E <= 0 there by the carried aggregation algebra",
    corollarySF:
      "with the carried recorded links (aggregation algebra, interlacing, THEOREM TX 9.45e-50, LEMMA OP + THEOREM RW S(0.4641446) = 0.888414 < 1, LEMMA GA + THEOREM RW S(0.9282892) = 0.451264 < 1) the strip splits: [0.2320723, 0.232072389] hollow-lambda REFUTED for the class; (0.232072389, 0.2320727) certified crossing bracket of the single-doubled family, width 3.1e-7; [0.2320727, 0.23209) closed for the single-doubled class, burden contracts to >= 2 doubled blocks among 1..3 or >= 3 packets in some block of 1..3 (even parity, block 0 occupied)",
  },
  measured: {
    coverStats:
      "channel 1 (bulge): 99990 leaves, max depth 95, ~200k cell evaluations; channels 2/3: 52/48 leaves; worst leaf 0.9999997999946019; in-sweep ~5 s total",
    nulls:
      "block-2 and block-3 satellites gain <= 1e-13 over the corner at the strip left endpoint; a third block-1 point gains <= 1e-9 on the probe grid; the bulge is a one-parameter block-1 phenomenon at the corner geometry",
    intractable:
      "the direct 12-D full two-point branch-and-bound (all three blocks doubled simultaneously) did NOT terminate within 3M cells at floor 0.232085: the binding slack is cross-entry ratio decoupling, intrinsic to entrywise majorants -- recorded as the successor wall",
  },
  adversarialRecord:
    "lambda_max > 1 does NOT construct an E > 0 witness (the aggregation inequality bounds E from above only): the class sandwich, the witness floors, and every recorded class constant are carried UNCHANGED; FINDING SB refutes the imp-95167 successorFrontier mechanism (hull spreading does NOT strictly decrease lambda_max near the corner -- it strictly increases it) and sharpens imp-95163 FINDING RA (the recorded 7-digit collapse was true only to its resolution; the 8th digit carries the bulge); the refuted sub-strip statement is architecture-scoped (5-block hollow-lambda certificates), not a truth statement about E; the full two-point and >= 3-packet burdens stay open on the covered band",
  successorFrontier:
    "(i) the sub-strip [0.2320723, 0.232072389] now needs a DIFFERENT E-reduction (finer than 5-block bond aggregation -- e.g. packet-level welds or direct quadratic-form certificates) for every multi-packet burden configuration; (ii) the bracket gap (0.232072389, 0.2320727), width 3.1e-7, closes by either pushing THEOREM SD down (tree grows ~25% per 1e-7 of floor) or refining THEOREM SR upward; (iii) the multi-doubled/multi-packet burden on [0.2320727, 0.23209) needs a center-form or Lipschitz enclosure to break the cross-entry decoupling wall measured at 3M cells",
  carried: {
    classSandwich: [0.2320723, 0.24502],
    unconditionalWindow: [0.23209, 0.24502],
    openStrip: [0.2320723, 0.23209],
    ladderFloorKle4: 47 / 200,
    singlePacketCrossing: 0.2320720385,
    satelliteFamilyCrossing: 0.23207238984,
    coverFloor: MUF,
  },
  promotesBound: false,
  noQED: true,
  sota: "No refereed bound is changed",
};

// --------------------------------------------------------------------------
// sweep-countable assertions (same claims, re-expressed over MEASURED)
// --------------------------------------------------------------------------
export const IMP95168_SATELLITE_BULGE_ARCHITECTURE_FLOOR_ASSERTIONS = [
  {
    id: "imp95168-finding-sb",
    description:
      "FINDING SB: the block-1 satellite witness (eps* = 0.0020642307302 at position 8 over the binding corner) has exact hollow lambda_max = 1.0000001759857156 > 1 at the strip left endpoint 0.2320723, Rayleigh-certified with margin > 1.7e-7; its family crossing 0.23207238984 sits inside the strip, 3.5e-7 above the single-packet intrinsic crossing; block-2/3 satellites and third points are measured null",
    holds: () =>
      Math.abs(MEASURED.sb.lamStar - 1.0000001759857156) < 1e-12 &&
      MEASURED.sb.ray > 1 + 1.7e-7 &&
      Math.abs(MEASURED.sb.muSatLo - 0.23207238984) < 1e-10 &&
      MEASURED.sb.muSatLo - 0.2320720385 > 3e-7 &&
      MEASURED.sb.sat2Gain < 1e-12 && MEASURED.sb.sat3Gain < 1e-12 &&
      MEASURED.sb.thirdPointGain < 1e-9,
  },
  {
    id: "imp95168-theorem-sr-continuum",
    description:
      "THEOREM SR: the Perron-interval partition of [0.2320723, 0.232072389] certifies lambda_max > 1 for the satellite witness at EVERY rate in the sub-strip (zero unresolved intervals, worst interval Rayleigh margin > 1e-10): no 5-block hollow-lambda certificate can close the strip bottom",
    holds: () => MEASURED.sr.unresolved === 0 && MEASURED.sr.worstMargin > 1e-10,
  },
  {
    id: "imp95168-lemma-ts-battery",
    description:
      "LEMMA TS: the closed-form interval supremum of the two-point normalized bond (linear critical equation, root (a - bc)/((1 - c)(a + b))) dominates a 201-point dense grid on 2000 random (a, b, c, interval) draws with zero violations",
    holds: () => MEASURED.ts.worstExcess <= 1e-12,
  },
  {
    id: "imp95168-theorem-sd-cover",
    description:
      "THEOREM SD: the three-channel single-doubled-block branch-and-bound at floor 0.2320727 terminates with zero unresolved cells (channel 1: 99990 leaves, depth 95, worst 0.9999997999946019; channels 2/3: 52/48 leaves), exact partitions, every leaf positive-pivot Cholesky-certified below 1 - 2e-7",
    holds: () =>
      MEASURED.sd.ch1.unresolved === 0 && MEASURED.sd.ch2.unresolved === 0 &&
      MEASURED.sd.ch3.unresolved === 0 &&
      MEASURED.sd.ch1.leaves === 99990 && MEASURED.sd.ch1.maxDepth === 95 &&
      Math.abs(MEASURED.sd.ch1.worst - 0.9999997999946019) < 1e-10 &&
      MEASURED.sd.ch2.leaves === 52 && MEASURED.sd.ch3.leaves === 48 &&
      MEASURED.sd.ch1.worst < T_CERT && MEASURED.sd.ch2.worst < T_CERT &&
      MEASURED.sd.ch3.worst < T_CERT &&
      MEASURED.sd.ch1.volRel < 1e-9 && MEASURED.sd.ch2.volRel < 1e-9 &&
      MEASURED.sd.ch3.volRel < 1e-9,
  },
  {
    id: "imp95168-sa-collapse-battery",
    description:
      "THEOREM SA application: over 400 random witnesses with multi-packet blocks 0 and 4, collapsing each onto its inner endpoint packet never decreases any off-diagonal entry or the hollow lambda_max (worst excess <= 1e-12): blocks 0/4 carry arbitrary nonnegative occupancy in THEOREM SD",
    holds: () => MEASURED.sa.worstEntry <= 1e-12 && MEASURED.sa.worstLam <= 1e-12,
  },
  {
    id: "imp95168-location-battery",
    description:
      "150 random single-doubled witnesses at covered rates (every 10th pinned at the bulge geometry at the floor) all locate in a certified leaf of their channel, never exceed the leaf majorant, and stay below 1 - 2e-7",
    holds: () =>
      MEASURED.battery.located === 150 && MEASURED.battery.worstVsLeaf <= 1e-12 &&
      MEASURED.battery.worstAbs < T_CERT,
  },
  {
    id: "imp95168-honest-scope",
    description:
      "no recorded class constant moves: class sandwich [0.2320723, 0.24502], unconditional window [0.23209, 0.24502], open strip endpoints, k <= 4 ladder floor 47/200 all carried; the step splits the strip burden (refuted 9e-8 / bracket 3.1e-7 / covered 1.73e-5 sub-strips) without constructing any E > 0 witness; no bound promotion; no QED",
    holds: () =>
      IMP95168_SATELLITE_BULGE_ARCHITECTURE_FLOOR.carried.classSandwich[0] === MUSTAR &&
      IMP95168_SATELLITE_BULGE_ARCHITECTURE_FLOOR.carried.classSandwich[1] === 0.24502 &&
      IMP95168_SATELLITE_BULGE_ARCHITECTURE_FLOOR.carried.unconditionalWindow[0] === STRIP_RIGHT &&
      IMP95168_SATELLITE_BULGE_ARCHITECTURE_FLOOR.carried.openStrip[0] === MUSTAR &&
      IMP95168_SATELLITE_BULGE_ARCHITECTURE_FLOOR.carried.ladderFloorKle4 === 47 / 200 &&
      MEASURED.composition.txCorr < 1e-40 &&
      IMP95168_SATELLITE_BULGE_ARCHITECTURE_FLOOR.promotesBound === false &&
      IMP95168_SATELLITE_BULGE_ARCHITECTURE_FLOOR.noQED === true,
  },
];

for (const a of IMP95168_SATELLITE_BULGE_ARCHITECTURE_FLOOR_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95168-satellite-bulge-architecture-floor assertion failed: ${a.id}`);
}
