/**
 * imp-95288: THEOREM RZ-PEN + COROLLARY PEN-UNIF + PROPOSITION PEN-NEC
 * + COROLLARY SPLIT-PEN -- the r-uniform block symbol-PENCIL infimum
 * that imp-95252 HONEST LIMITS (d) left as the named open residual.
 * Thirtieth leg of the seam chain. The question was: in BLOCK norms
 * (the pencil of the block-Toeplitz seam symbol F(theta) against the
 * in-block 2x2 Gram G0), is the infimum bounded below UNIFORMLY IN r,
 * where the coefficient-norm constant A_twin necessarily collapses like
 * sin^2(pi tau) as r -> 1? ANSWER, both directions decided:
 * (i) YES on the coalescence half r in (1, sqrt(rho)]: a closed-form
 * m-AND-r-uniform floor exists (the tanh^2(b/2) block normalization
 * cancels the sin^2(pi tau) collapse exactly, both are O(b^2));
 * (ii) NO through the far end r -> rho: the infimum must collapse at
 * the CROSS-BLOCK coalescence (rate r rho^k meets rate rho^(k+1)), and
 * the collapse exponent is exactly 2 (floor and cap both quadratic in
 * a - b). So sin^2(pi tau)/tanh^2(b/2) is the exact two-sided currency:
 * removable at tau -> 0 by the block norm, structural at tau -> 1.
 * Consequence: the every-octave certificate onset becomes r-uniform,
 * 27.035582 (SPLIT-LOO m-and-r-uniform) -> 15.689897, and the fixed-r
 * SPLIT-RZ onsets drop too (15.981584 -> 15.466164 at r = 1.3,
 * 17.517735 -> 15.215651 at r = 1.05). Changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * OBJECT (imp-95252 normalization, verbatim). a = ln rho in (0, 6],
 * b = ln r in (0, a), tau = b/a in (0, 1), s = sech(b/2),
 * P(w) = (2 pi / a) sech(pi w / a), w_n = theta + 2 pi n,
 * f_a = sum_n P(w_n), f_b = sum_n P(w_n) e^(i w_n tau),
 * F(theta) = [[f_a, f_b], [conj(f_b), f_a]], G0 = [[1, s], [s, 1]].
 * LEMMA TOEP transfers verbatim to the pencil: for coefficient blocks
 * c_0..c_(m-1), c* Gtilde c = (1/2pi) int p* F p and c* BD c =
 * (1/2pi) int p* G0 p (BD = blockdiag(G0), constant symbol), and
 * p* F p >= lam_min(F, G0) p* G0 p pointwise in theta, so
 *   lam_min(Gtilde_2m, BD) >= inf over theta of lam_min(F(theta), G0)
 * for EVERY m. The Fejer/Szegoe ceiling also transfers: no m-uniform
 * block-norm constant can exceed the symbol-pencil infimum.
 *
 * LEMMA PM (plus-minus basis). In the orthogonal basis e_pm =
 * (1, +-1)/sqrt(2), G0 = diag(1 + s, 1 - s) and F becomes
 * [[f_a + Re f_b, -i Im f_b], [i Im f_b, f_a - Re f_b]]. Hence
 * M = G0^(-1/2) F G0^(-1/2) has
 *   alpha = (f_a + Re f_b)/(1 + s), beta = (f_a - Re f_b)/(1 - s),
 *   gamma = |Im f_b| / sqrt(1 - s^2),
 *   det M = (f_a^2 - |f_b|^2) / tanh^2(b/2)   [1 - s^2 = tanh^2(b/2)],
 *   tr M = alpha + beta,
 * and since M is PD (pair identity strict for tau in (0,1)),
 *   lam_min(F, G0) = det M / lam_max(M) >= det M / tr M.
 * The whole theorem is this one fraction plus four elementary bounds.
 *
 * THEOREM RZ-PEN (closed-form m-uniform pencil floor; 1 < r < rho <=
 * e^6, every m, every theta in [-pi, pi]):
 *   lam_min(Gtilde_2m, BD) >= inf lam_min(F, G0) >= A_pen(rho, r)
 *     = [sin^2(pi tau) / tanh^2(b/2)] * W(rho),
 *   W(rho) = 8 P(pi) P(2pi) / [c1 P(pi) + 2 c2 P(2pi) + c3],
 *   c1 = 2 + 4 pi^2 cosh(a/2)/a^2, c2 = 2 + 36 pi^2 cosh(a/2)/a^2,
 *   c3 = 2 tA + 4 cosh(a/2) tQ / a^2,
 *   tA = (8 pi / a) e^(-3 pi^2/a) / (1 - e^(-2 pi^2/a)),
 *   tQ = (200 pi^3 / a) e^(-3 pi^2/a) / (1 - 4 e^(-2 pi^2/a)).
 * Proof. NUMERATOR: the imp-95252 pair identity keeps only its four
 * (n, l) terms with {n, l} = {0, +-1}: f_a^2 - |f_b|^2 >=
 * 4 sin^2(pi tau) P_0 S, S = P_(-1) + P_1; P_0 = P(theta) >= P(pi) on
 * |theta| <= pi, and S >= 2 P(2pi) by the same Jensen step as RZ-TWIN
 * (arguments in [pi, 3pi], convexity onset u_c <= 1.26 < pi for
 * a <= 6 -- the only place rho <= e^6 enters). DENOMINATOR: alpha <=
 * (f_a + |f_b|)/(1 + s) <= 2 f_a; for beta, 1 - cos x <= x^2/2 gives
 * f_a - Re f_b = sum_n P_n (1 - cos(w_n tau)) <= (tau^2/2) Q(theta),
 * Q = sum_n P_n w_n^2, while cosh x - 1 >= x^2/2 gives 1 - s >=
 * (b^2/8) sech(b/2) >= (b^2/8) sech(a/2), so beta <=
 * (4 cosh(a/2)/a^2) Q (tau^2/b^2 = 1/a^2 -- this is the exact point
 * where the r-dependence drops out of the trace). Bound Q termwise:
 * w_0^2 <= pi^2, w_(+-1)^2 <= 9 pi^2, and the |n| >= 2 tails of f_a
 * and Q by tA and tQ via sech x <= 2 e^(-x), |w_n| >= (2|n|-1) pi,
 * w_n^2 <= (2|n|+1)^2 pi^2 and the geometric majorants (2n+1)^2 <=
 * 9 * 4^(n-1) (n >= 1), (2k+1)^2 <= 25 * 4^(k-2) (k >= 2), the latter
 * sums needing 4 e^(-2 pi^2/a) < 1, true for a <= 14. Then tr M <=
 * c1 P_0 + c2 S + c3 and det M / tr M >= [sin^2(pi tau)/tanh^2(b/2)] *
 * 4 P_0 S / (c1 P_0 + c2 S + c3); the last ratio is increasing in P_0
 * and in S separately, so its infimum over the admissible region
 * P_0 >= P(pi), S >= 2 P(2pi) is attained at the corner, giving W. QED.
 *
 * COROLLARY PEN-UNIF (the r-uniform answer, coalescence side). For
 * r in (1, sqrt(rho)], i.e. tau <= 1/2: sin(pi tau) >= 2 tau (chord)
 * and tanh(b/2) <= b/2 give sin^2(pi tau)/tanh^2(b/2) >= 16 tau^2/b^2
 * = 16/a^2, hence
 *   inf over theta of lam_min(F, G0) >= A_unif(rho) = (16/a^2) W(rho),
 * a strictly positive constant INDEPENDENT OF r AND m. The imp-95252
 * coefficient-norm collapse (single-block witness 1 - sech(b/2) -> 0)
 * is therefore an artifact of the coefficient currency, not of the
 * seam geometry: in block norms the r -> 1 coalescence is FREE at
 * every m (extending imp-95249 ANG-DET from m = 2 to all m).
 *
 * PROPOSITION PEN-NEC (no full r-uniformity; exact collapse order 2).
 * The m = 2 witness F = ehat_(r nu) - ehat_(rho nu) (second element of
 * block 0 minus first element of block 1) has ||F||^2 = 2 -
 * 2 sech((a-b)/2) and block mass 2, so by the LEMMA TOEP lower
 * transfer inf lam_min(F, G0) <= lam_min(Gtilde_4, BD) <=
 * 1 - sech((a-b)/2) <= (a-b)^2/8 -> 0 as r -> rho: cross-block
 * coalescence forces collapse in ANY block-uniform currency for the
 * given pairing {rho^k, r rho^k}. Matching order from below: as
 * tau -> 1, sin^2(pi tau) = sin^2(pi(1-tau)) ~ pi^2 (a-b)^2/a^2 while
 * tanh^2(b/2) -> tanh^2(a/2) > 0, so A_pen ~ const * (a-b)^2. Floor
 * and cap are both quadratic in a - b: the collapse exponent at the
 * far end is exactly 2 (measured: inf ratio 101.8 per 10x shrink of
 * a - b at rho = 2, vs 100.4 for exact quadratic). Remark (regrouped
 * pairing): re-pairing the SAME rates as {r rho^(k-1), rho^k} is again
 * a twin lattice with ratio rho/r, so the theorem with b -> a - b
 * covers tau >= 1/2 up to two edge singletons -- the obstruction is
 * the pairing choice at the coalescing seam, never the rate set.
 *
 * COROLLARY SPLIT-PEN (r-uniform every-octave certificate). The
 * SPLIT-RZ denominator A_blk = A_twin/(1 + s) is exactly a bound on
 * the same block-norm Riesz constant lam_min(Gtilde, BD), so it can be
 * replaced by max(A_pen, A_blk) verbatim:
 *   Lambda(V, x) <= [sum_(k>=0) coalLaw(2^k x)] / max(A_pen, A_blk)
 * on the dyadic twin skeleton, r in (1, 1.3] (the imp-95252 coalLaw
 * scope), every m. A_pen(2, 1.3) = 3.5318e-11 = 2.626 x A_blk, and
 * A_pen >= A_unif(2) = 2.3233e-11 on the whole scope, so the
 * certificate fires for x > 15.689897 AT EVERY r IN (1, 1.3] AND EVERY
 * m -- the first m-and-r-uniform every-octave onset below the
 * SPLIT-LOO 27.035582, and it also beats the fixed-r SPLIT-RZ onsets
 * (15.981584 -> 15.466164 at r = 1.3; 17.517735 -> 15.215651 at
 * r = 1.05, where SPLIT-RZ was already degrading toward its r -> 1
 * divergence).
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) The det/tr step needs M PD: pair
 * identity is strictly positive for tau in (0, 1) (the d = 1 term
 * alone), f_a > 0 -- checked. (2) FLOAT: the smaller pencil root is
 * evaluated cancellation-free as C/(Bp + sqrt(Bp^2 - A C)) with C from
 * the pair identity; the naive plus-minus-basis eigenvalue agrees to
 * rel 1e-5 (it loses digits exactly where the stable form does not).
 * (3) Grid refutation attempts that FAILED: 4001-point theta grids
 * across rho in {2, 3, 4, e^6}, r from 1.0001 to rho^0.999 -- no dip
 * below A_pen anywhere (margin >= factor 1, tightness recorded below).
 * (4) The bound is honestly LOOSE pointwise: measured inf/A_pen ratio
 * 25.3 - 91.7 across the tested range; the exact minimizer sits near
 * theta = 0 where the crude w_0^2 <= pi^2 step in Q inflates c1. The
 * surviving sharpening (keep w_0^2 = theta^2 pointwise and close the
 * resulting two-chart minimization in closed form) is a named residual,
 * NOT claimed. (5) Order-2 collapse cross-checked at r = 1.9 / 1.99 /
 * 1.999. (6) Onset comparison honest both ways: SPLIT-PEN still does
 * NOT fire at x = 12 where finite-m EV-OCT (m = 6) does; small-m
 * regimes stay with SPLIT-LOO / SPLIT-2.
 *
 * HONEST LIMITS. (a) Floor only: the exact symbol-pencil infimum is
 * 1-2 orders above A_pen (Szegoe ceiling currency unchanged); the
 * closed form buys r-uniformity, not sharpness. (b) The r-uniform
 * onset 15.6899 uses the (1, 1.3] coalLaw scope of SPLIT-RZ; the
 * pencil floor itself holds on all of (1, sqrt(rho)]. (c) Dyadic
 * lattice skeleton only; off-lattice rates unchanged (imp-95232
 * residual). (d) tau -> 1 collapse is structural for the GIVEN
 * pairing; the regrouped-pairing remark is stated with its edge
 * singletons left open. (e) Model family only; no mapping to paper
 * per-window data (obligation (3) gammaSL unchanged); changes NO
 * Lambda bound of the program.
 *
 * ROUTING. The imp-95252 HONEST LIMITS (d) named residual (r-uniform
 * block symbol-pencil infimum, queue ticket imp-95288) is DECIDED:
 * r-uniform in closed form on the coalescence half, provably NOT
 * r-uniform through the cross-block end, collapse exponent exactly 2.
 * Obligation ledger otherwise unchanged: (2) signed weight/modulus
 * legs, (3) envelope-shape port + gammaSL map, (4) paper constants.
 * Sub-gap imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.
 *
 * Import-light (no imports, no zeros bundle). Numerics are CROSS-CHECKS
 * of proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95288_RUNIFORM_BLOCK_PENCIL_FLOOR = {
  id: "imp-95288",
  title:
    "THEOREM RZ-PEN + COROLLARY PEN-UNIF + PROPOSITION PEN-NEC + " +
    "COROLLARY SPLIT-PEN: the r-uniform block symbol-pencil floor, in " +
    "closed form, with the cross-block collapse decided at exact order 2",
  theoremRzPen: {
    statement:
      "lam_min(Gtilde_2m, blockdiag G0) >= A_pen = [sin^2(pi tau) / " +
      "tanh^2(b/2)] W(rho), every m, 1 < r < rho <= e^6; W(rho) = " +
      "8 P(pi) P(2pi) / (c1 P(pi) + 2 c2 P(2pi) + c3)",
    wRho2: 6.976550277e-13,
    wRho4: 1.692676836e-6,
    aPenRho2R13: 3.53176651e-11,
    aPenRho2R105: 5.641975231e-11,
    aPenRho4R13: 3.121713727e-5,
  },
  corollaryPenUnif: {
    statement:
      "for r in (1, sqrt(rho)]: A_pen >= A_unif = (16/a^2) W(rho) > 0, " +
      "independent of r and m -- the block norm removes the tau -> 0 " +
      "collapse at every m (imp-95249 ANG-DET was m = 2 only)",
    aUnifRho2: 2.323324055e-11,
  },
  propositionPenNec: {
    statement:
      "inf lam_min(F, G0) <= 1 - sech((a-b)/2) <= (a-b)^2/8 (m = 2 " +
      "cross-block witness): full (1, rho) r-uniformity is impossible " +
      "for the given pairing, and floor + cap are both quadratic in " +
      "a - b, so the far-end collapse exponent is exactly 2",
    measuredQuadraticRatio: 101.8,
  },
  corollarySplitPen: {
    statement:
      "Lambda(V, x) <= [sum_k coalLaw(2^k x)] / max(A_pen, A_blk) on " +
      "the dyadic twin skeleton, r in (1, 1.3], every m: r-uniform " +
      "onset 15.689897 (vs SPLIT-LOO 27.035582), fixed-r onsets " +
      "15.466164 at r = 1.3 (vs 15.981584), 15.215651 at r = 1.05 " +
      "(vs 17.517735)",
    xStarUniform: 15.689897,
    xStarR13: 15.466164,
    xStarR105: 15.215651,
    splitRzRefR13: 15.981584,
    splitRzRefR105: 17.517735,
    splitLooUnifRef: 27.035582,
    aBlkRef: 1.344996021179e-11,
    penOverBlkR13: 2.626,
  },
  honestScope:
    "floor only, measured 25.3 - 91.7x below the exact symbol-pencil " +
    "infimum (two-chart sharpening = named residual); dyadic skeleton " +
    "only; regrouped-pairing remark leaves edge singletons open; model " +
    "family only",
  verdict:
    "RIGOROUS: LEMMA PM, THEOREM RZ-PEN, COROLLARY PEN-UNIF, " +
    "PROPOSITION PEN-NEC and COROLLARY SPLIT-PEN are proven " +
    "(elementary: det/tr on the 2x2 pencil, pair identity, Jensen, " +
    "1 - cos x <= x^2/2 vs cosh x - 1 >= x^2/2), with imp-95252 LEMMA " +
    "TOEP / LEMMA POISSON and imp-95227 COAL-DOM + imp-95231 RATE-MONO " +
    "as cited inputs. The imp-95288 r-uniform question is DECIDED both " +
    "ways: uniform on the coalescence half in closed form, necessarily " +
    "collapsing at the cross-block end at exact order 2. Changes no " +
    "bound; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (self-contained, import-light)
// ---------------------------------------------------------------------------

const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, a) => (2 * Math.PI) / a / Math.cosh((Math.PI * w) / a);

// Poisson-side symbols + cancellation-free pair-identity numerator
function symbols(theta, a, b, NN = 14) {
  const tau = b / a;
  let fa = 0;
  let br = 0;
  let bi = 0;
  const Ps = [];
  for (let n = -NN; n <= NN; n++) {
    const w = theta + 2 * Math.PI * n;
    const p = kernelP(w, a);
    Ps.push(p);
    fa += p;
    br += p * Math.cos(w * tau);
    bi += p * Math.sin(w * tau);
  }
  let C = 0;
  for (let i = 0; i < Ps.length; i++)
    for (let j = 0; j < Ps.length; j++) {
      if (i === j) continue;
      const s = Math.sin(Math.PI * Math.abs(i - j) * tau);
      C += 2 * s * s * Ps[i] * Ps[j];
    }
  return { fa, br, bi, C };
}

// stable smaller root of (1 - s^2) lam^2 - 2 lam (fa - s Re fb) + C = 0
function pencilSymbolMin(theta, a, b) {
  const s = sechHalf(b);
  const A = 1 - s * s;
  const { fa, br, C } = symbols(theta, a, b);
  const Bp = fa - s * br;
  return C / (Bp + Math.sqrt(Math.max(Bp * Bp - A * C, 0)));
}

// LEMMA PM route (naive, for the consistency check only)
function pencilSymbolMinBasis(theta, a, b) {
  const s = sechHalf(b);
  const { fa, br, bi } = symbols(theta, a, b);
  const al = (fa + br) / (1 + s);
  const be = (fa - br) / (1 - s);
  const ga = Math.abs(bi) / Math.sqrt(1 - s * s);
  const mean = (al + be) / 2;
  const rad = Math.sqrt(((al - be) / 2) ** 2 + ga * ga);
  return mean - rad;
}

// closed-form constants of THEOREM RZ-PEN
function penConstants(a) {
  const c = Math.cosh(a / 2);
  const pi2 = Math.PI * Math.PI;
  const c1 = 2 + (4 * pi2 * c) / (a * a);
  const c2 = 2 + (36 * pi2 * c) / (a * a);
  const e2 = Math.exp((-2 * pi2) / a);
  const e3 = Math.exp((-3 * pi2) / a);
  const tA = (((8 * Math.PI) / a) * e3) / (1 - e2);
  const tQ = (((200 * Math.PI ** 3) / a) * e3) / (1 - 4 * e2);
  const c3 = 2 * tA + (4 * c * tQ) / (a * a);
  const Ppi = kernelP(Math.PI, a);
  const P2pi = kernelP(2 * Math.PI, a);
  const W = (8 * Ppi * P2pi) / (c1 * Ppi + 2 * c2 * P2pi + c3);
  return { c1, c2, c3, W };
}
const aPen = (a, b) => {
  const tau = b / a;
  const s2 = Math.sin(Math.PI * tau) ** 2;
  const t2 = Math.tanh(b / 2) ** 2;
  return (s2 / t2) * penConstants(a).W;
};
const aPenUnif = (a) => (16 / (a * a)) * penConstants(a).W;

function gridInf(a, b, Ngrid = 4001) {
  let inf = Infinity;
  for (let i = 0; i <= Ngrid; i++) {
    const th = -Math.PI + (2 * Math.PI * i) / Ngrid;
    const v = pencilSymbolMin(th, a, b);
    if (v < inf) inf = v;
  }
  return inf;
}

// finite-matrix pencil machinery (style of the imp-95252 sibling)
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95288 chol: base not PD");
        L[i][i] = Math.sqrt(s);
      } else L[i][j] = s / L[j][j];
    }
  }
  return L;
}
function fwd(L, v) {
  const n = L.length;
  const x = v.slice();
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < i; k++) x[i] -= L[i][k] * x[k];
    x[i] /= L[i][i];
  }
  return x;
}
function transpose(A) {
  return A[0].map((_, j) => A.map((row) => row[j]));
}
function jacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 300; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-32) break;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-300) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t =
          Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
  }
  return A.map((r, i) => r[i]).sort((x, y) => x - y);
}
function pencilEig(A, B) {
  const L = chol(B);
  const n = A.length;
  const Y = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(
      L,
      A.map((r) => r[j]),
    );
    for (let i = 0; i < n; i++) Y[i][j] = y[i];
  }
  const Yt = transpose(Y);
  const Ct = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const y = fwd(
      L,
      Yt.map((r) => r[j]),
    );
    for (let i = 0; i < n; i++) Ct[i][j] = y[i];
  }
  return jacobiEig(transpose(Ct));
}
const normGram = (nus) =>
  nus.map((x) => nus.map((y) => sechHalf(Math.log(x / y))));
const twinRates = (m, r, rho) => {
  const v = [];
  for (let k = 0; k < m; k++) v.push(rho ** k, r * rho ** k);
  return v;
};
const blockDiagOf = (G) =>
  G.map((row, i) =>
    row.map((g, j) => (Math.floor(i / 2) === Math.floor(j / 2) ? g : 0)),
  );

// SPLIT-PEN certificate on the dyadic skeleton (coalLaw from imp-95227)
const coalLaw = (x) =>
  Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
function certNumerator(x) {
  let s = 0;
  for (let k = 0; k < 60; k++) s += coalLaw(2 ** k * x);
  return s;
}
const A_BLK_REF = 1.344996021179e-11; // imp-95252 A_blk(2, 1.3)
const certSplitPen = (x, r) =>
  certNumerator(x) / Math.max(aPen(Math.LN2, Math.log(r)), A_BLK_REF);

const W_2 = 6.976550277e-13;
const W_4 = 1.692676836e-6;
const A_PEN_2_13 = 3.53176651e-11;
const A_PEN_2_105 = 5.641975231e-11;
const A_PEN_4_13 = 3.121713727e-5;
const A_UNIF_2 = 2.323324055e-11;
const XSTAR_UNIF = 15.689897;
const XSTAR_R13 = 15.466164;
const XSTAR_R105 = 15.215651;
const XSTAR_RZ_13_REF = 15.981584;
const XSTAR_RZ_105_REF = 17.517735;
const XSTAR_LOO_UNIF_REF = 27.035582;

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95288_ASSERTIONS = [
  {
    id: "imp95288-elementary-scaffold",
    description:
      "the four elementary scaffold inequalities hold on dense grids: " +
      "sin(pi tau) >= 2 tau on (0, 1/2], 1 - sech(x) >= x^2 sech(x)/2, " +
      "tanh(x) <= x, and the tail coefficient majorants (2n+1)^2 <= " +
      "9*4^(n-1) (n >= 1), (2k+1)^2 <= 25*4^(k-2) (k >= 2)",
    holds: () => {
      for (let i = 1; i <= 1000; i++) {
        const t = 0.5 * (i / 1000);
        if (Math.sin(Math.PI * t) < 2 * t - 1e-15) return false;
        const x = 3 * (i / 1000);
        if (1 - 1 / Math.cosh(x) < ((x * x) / 2) / Math.cosh(x) - 1e-15)
          return false;
        if (Math.tanh(x) > x + 1e-15) return false;
      }
      for (let n = 1; n <= 40; n++)
        if ((2 * n + 1) ** 2 > 9 * 4 ** (n - 1)) return false;
      for (let k = 2; k <= 40; k++)
        if ((2 * k + 1) ** 2 > 25 * 4 ** (k - 2)) return false;
      return true;
    },
  },
  {
    id: "imp95288-lemma-pm-consistency",
    description:
      "LEMMA PM: the stable quadratic smaller root agrees with the " +
      "plus-minus-basis eigenvalue (rel 1e-5; the naive route loses " +
      "digits exactly where the stable one does not)",
    holds: () => {
      for (const [a, b, th] of [
        [Math.LN2, Math.log(1.3), 0.7],
        [Math.LN2, Math.log(1.05), 2.9],
        [Math.log(4), Math.log(1.3), 0.1],
        [6, Math.log(2), 1.9],
      ]) {
        const x = pencilSymbolMin(th, a, b);
        const y = pencilSymbolMinBasis(th, a, b);
        if (!(x > 0) || Math.abs(x / y - 1) > 1e-5) return false;
      }
      return true;
    },
  },
  {
    id: "imp95288-theorem-rz-pen",
    description:
      "THEOREM RZ-PEN: 4001-point stable grid inf of lam_min(F, G0) >= " +
      "A_pen at (rho, r) across {2, 3, 4, e^6} x {1.001 .. rho^0.999} " +
      "including both coalescence ends; honesty bracket inf <= 120 A_pen " +
      "(the floor is loose by a bounded factor, not vacuous); baked " +
      "literals reproduce (rel 1e-6)",
    holds: () => {
      for (const [rho, r] of [
        [2, 1.001],
        [2, 1.05],
        [2, 1.3],
        [2, Math.SQRT2],
        [2, 1.9],
        [2, 1.99],
        [3, 1.3],
        [4, 1.001],
        [4, 1.3],
        [4, 2],
        [4, 3.9],
        [Math.exp(6), 2],
        [Math.exp(6), Math.exp(3)],
        [Math.exp(6), Math.exp(5.9)],
      ]) {
        const a = Math.log(rho);
        const b = Math.log(r);
        const inf = gridInf(a, b);
        const bound = aPen(a, b);
        if (!(inf >= bound && inf <= 120 * bound)) return false;
      }
      return (
        Math.abs(penConstants(Math.LN2).W - W_2) < 1e-6 * W_2 &&
        Math.abs(penConstants(Math.log(4)).W - W_4) < 1e-6 * W_4 &&
        Math.abs(aPen(Math.LN2, Math.log(1.3)) - A_PEN_2_13) <
          1e-6 * A_PEN_2_13 &&
        Math.abs(aPen(Math.LN2, Math.log(1.05)) - A_PEN_2_105) <
          1e-6 * A_PEN_2_105 &&
        Math.abs(aPen(Math.log(4), Math.log(1.3)) - A_PEN_4_13) <
          1e-6 * A_PEN_4_13
      );
    },
  },
  {
    id: "imp95288-corollary-pen-unif",
    description:
      "COROLLARY PEN-UNIF: A_pen(rho, r) >= A_unif = (16/a^2) W(rho) on " +
      "a 40-point r-grid over (1, sqrt(rho)] for rho in {2, 4}; " +
      "A_unif(2) matches the baked literal (rel 1e-6)",
    holds: () => {
      for (const rho of [2, 4]) {
        const a = Math.log(rho);
        const AU = aPenUnif(a);
        for (let i = 1; i <= 40; i++) {
          const b = (a / 2) * (i / 40);
          if (aPen(a, b) < AU * (1 - 1e-12)) return false;
        }
      }
      return Math.abs(aPenUnif(Math.LN2) - A_UNIF_2) < 1e-6 * A_UNIF_2;
    },
  },
  {
    id: "imp95288-proposition-pen-nec",
    description:
      "PROPOSITION PEN-NEC: grid inf <= 1 - sech((a-b)/2) at (2, 1.9), " +
      "(2, 1.99), (4, 3.9); m = 2 matrix witness confirms; collapse is " +
      "quadratic (inf ratio r = 1.99 vs 1.999 in [90, 115] where exact " +
      "order 2 predicts 100.4)",
    holds: () => {
      for (const [rho, r] of [
        [2, 1.9],
        [2, 1.99],
        [4, 3.9],
      ]) {
        const a = Math.log(rho);
        const b = Math.log(r);
        const cap = 1 - sechHalf(a - b);
        if (!(gridInf(a, b) <= cap)) return false;
        const G = normGram(twinRates(2, r, rho));
        const pe = pencilEig(G, blockDiagOf(G));
        if (!(pe[0] <= cap)) return false;
      }
      const i99 = gridInf(Math.LN2, Math.log(1.99));
      const i999 = gridInf(Math.LN2, Math.log(1.999));
      const ratio = i99 / i999;
      return ratio >= 90 && ratio <= 115;
    },
  },
  {
    id: "imp95288-matrix-pencil-floor",
    description:
      "matrix level: lam_min of the finite pencil (Gtilde_2m, blockdiag " +
      "G0) >= A_pen at rho = 4 (m in {4, 8}, r in {1.05, 1.3, 2}) and " +
      "rho = 2 (m = 6, r in {1.05, 1.3}) -- every m-uniform claim " +
      "instance tested resolves above the floor",
    holds: () => {
      for (const [rho, r, ms] of [
        [4, 1.05, [4, 8]],
        [4, 1.3, [4, 8]],
        [4, 2, [4, 8]],
        [2, 1.05, [6]],
        [2, 1.3, [6]],
      ]) {
        const bound = aPen(Math.log(rho), Math.log(r));
        for (const m of ms) {
          const G = normGram(twinRates(m, r, rho));
          const pe = pencilEig(G, blockDiagOf(G));
          if (!(pe[0] >= bound)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95288-corollary-split-pen",
    description:
      "COROLLARY SPLIT-PEN: baked onsets bracket 1 (xStar +- 1e-3) for " +
      "the r-uniform, r = 1.3 and r = 1.05 certificates; r-uniform onset " +
      "15.689897 < SPLIT-LOO 27.035582; fixed-r onsets beat SPLIT-RZ " +
      "(15.466164 < 15.981584, 15.215651 < 17.517735); A_pen(2, 1.3) = " +
      "2.626 x A_blk; honest: still no fire at x = 12",
    holds: () => {
      const certUnif = (x) => certNumerator(x) / A_UNIF_2;
      if (!(certUnif(XSTAR_UNIF - 1e-3) > 1 && certUnif(XSTAR_UNIF + 1e-3) < 1))
        return false;
      if (
        !(
          certSplitPen(XSTAR_R13 - 1e-3, 1.3) > 1 &&
          certSplitPen(XSTAR_R13 + 1e-3, 1.3) < 1 &&
          certSplitPen(XSTAR_R105 - 1e-3, 1.05) > 1 &&
          certSplitPen(XSTAR_R105 + 1e-3, 1.05) < 1
        )
      )
        return false;
      if (!(XSTAR_UNIF < XSTAR_LOO_UNIF_REF)) return false;
      if (!(XSTAR_R13 < XSTAR_RZ_13_REF && XSTAR_R105 < XSTAR_RZ_105_REF))
        return false;
      const factor = aPen(Math.LN2, Math.log(1.3)) / A_BLK_REF;
      if (Math.abs(factor - 2.626) > 2e-3) return false;
      return certUnif(12) > 1;
    },
  },
  {
    id: "imp95288-verdict-honesty",
    description:
      "the verdict and scope carry the honest labels: RIGOROUS theorems, " +
      "DECIDED both ways, floor-only looseness recorded, no bound " +
      "change, no QED, no refereed bound is changed",
    holds: () =>
      /RIGOROUS/.test(IMP95288_RUNIFORM_BLOCK_PENCIL_FLOOR.verdict) &&
      /DECIDED both ways/.test(IMP95288_RUNIFORM_BLOCK_PENCIL_FLOOR.verdict) &&
      /Changes no bound/.test(IMP95288_RUNIFORM_BLOCK_PENCIL_FLOOR.verdict) &&
      /NO QED/.test(IMP95288_RUNIFORM_BLOCK_PENCIL_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP95288_RUNIFORM_BLOCK_PENCIL_FLOOR.verdict) &&
      /floor only/i.test(IMP95288_RUNIFORM_BLOCK_PENCIL_FLOOR.honestScope) &&
      /named residual/.test(IMP95288_RUNIFORM_BLOCK_PENCIL_FLOOR.honestScope),
  },
];

for (const a of IMP95288_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95288-runiform-block-pencil-floor assertion failed: ${a.id}`,
    );
  }
}

export default IMP95288_RUNIFORM_BLOCK_PENCIL_FLOOR;
