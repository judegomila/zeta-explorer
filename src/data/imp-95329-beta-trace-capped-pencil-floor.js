/**
 * imp-95329: LEMMA BCAP + LEMMA ACAP + THEOREM RZ-PEN3 + COROLLARY
 * PEN-UNIF3 + COROLLARY SPLIT-PEN3 -- executes the imp-95328 named
 * residual (the beta trace currency): replace the crude
 * 1 - cos(w tau) <= w^2 tau^2 / 2 step and the alpha <= 2 f_a step in
 * the symbol-pencil trace majorant by two closed-form caps, and
 * re-close the two-chart corners. Thirty-second leg of the seam chain.
 * The imp-95328 floor A_pen2 was recorded 37.8 - 65.2x below the exact
 * symbol-pencil infimum at rho = e^6, with the residual looseness
 * attributed to the beta trace bound (the quadratic 1 - cos step
 * inflates every trace weight by cosh(a/2), which is ~10.07 at a = 6).
 * The fix is one elementary uniform-in-b cap (LEMMA BCAP below) whose
 * two branches cross in closed form, plus keeping the exact 1 + s
 * denominator of the alpha diagonal (LEMMA ACAP). Measured floor gain:
 * 6.073x at rho = e^6 (residual looseness 37.8 - 65.2x down to
 * 6.2 - 10.7x), 1.199x at rho = 4, 1.119x at rho = 2. Every-octave
 * onsets (dyadic skeleton, r in (1, 1.3], every m): m-and-r-uniform
 * 14.302669 -> 14.242145, r = 1.3: 14.077435 -> 14.016839, r = 1.05:
 * 13.825182 -> 13.764502. Changes no bound; NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95252 / imp-95288 / imp-95328 normalization, verbatim).
 * a = ln rho in (0, 6], b = ln r in (0, a), tau = b/a, s = sech(b/2),
 * P(w) = (2 pi / a) sech(pi w / a), w_n = theta + 2 pi n, theta in
 * [-pi, pi]. In the plus-minus basis (imp-95288 LEMMA PM) the scaled
 * symbol M = G0^(-1/2) F G0^(-1/2) has
 *   alpha = (f_a + Re f_b) / (1 + s),  beta = (f_a - Re f_b) / (1 - s),
 *   det M >= [4 sin^2(pi tau) / tanh^2(b/2)] P_0 S,
 *   lam_min(F, G0) >= det M / tr M,   tr M = alpha + beta,
 * with P_0 = P(theta), S = P(2pi - |theta|) + P(2pi + |theta|). The
 * RZ-PEN / RZ-PEN2 trace majorant priced every finite term at
 * 2 + kappa w^2 with kappa = 4 cosh(a/2) / a^2: the "2" from
 * alpha <= 2 f_a, the kappa w^2 from 1 - cos(w tau) <= w^2 tau^2 / 2
 * against 1 - s >= (b^2 / 8) sech(a/2). Both steps are replaced here.
 *
 * LEMMA BCAP (uniform-in-b beta cap). For every a > 0, b > 0, w real:
 *   (1 - cos(w b / a)) / (1 - sech(b/2)) <= 2 + 4 w^2 / a^2.
 * Proof. Write c = cosh(b/2) > 1. Branch (i): 1 - cos x <= x^2 / 2 and
 * cosh y - 1 >= y^2 / 2 give 1 - sech(b/2) = (c - 1)/c >= b^2 / (8c),
 * so the ratio is <= (w^2 b^2 / (2 a^2)) (8 c / b^2) = 4 w^2 c / a^2,
 * strictly increasing in c. Branch (ii): 1 - cos x <= 2 gives the
 * ratio <= 2c / (c - 1) = 2 + 2 / (c - 1), strictly decreasing in c.
 * The branches cross exactly at c* = 1 + a^2 / (2 w^2), where BOTH
 * equal 2 + 4 w^2 / a^2 (algebraic identity). For c <= c* branch (i)
 * is <= its value at c*; for c >= c* branch (ii) is <= its value at
 * c*; either way the ratio is <= 2 + 4 w^2 / a^2. QED. (w = 0 is
 * trivial: left side 0.) The cap is essentially sharp: the measured
 * supremum of ratio / cap over a dense (a, b, w) grid is 0.9998.
 *
 * LEMMA ACAP (alpha cap). For b in (0, a]: alpha <= c_alpha f_a with
 * c_alpha = 2 / (1 + sech(a/2)). Proof: |Re f_b| <= sum_n P_n = f_a,
 * and s = sech(b/2) >= sech(a/2) since sech is decreasing on [0, inf)
 * and b <= a; so alpha <= 2 f_a / (1 + s) <= c_alpha f_a. QED.
 *
 * NEW PER-TERM TRACE WEIGHT. With kappa = 4 cosh(a/2) / a^2 (the old
 * currency, valid per-term since cosh(b/2) <= cosh(a/2)) and
 * kappa2 = 4 / a^2, every finite symbol term of tr M is priced at
 *   t3(w) = c_alpha + min(kappa w^2, 2 + kappa2 w^2),
 * which is (a) a valid per-term majorant of the alpha + beta split by
 * LEMMA ACAP and LEMMA BCAP (BCAP is uniform in b; the kappa branch
 * needs b <= a), (b) increasing in |w| (both branches are), and (c)
 * <= the RZ-PEN2 weight 2 + kappa w^2 for every w (c_alpha <= 2 and
 * min <= first argument), so the new floor dominates the old one
 * unconditionally. Tails (|n| >= 2): alpha tail <= c_alpha tA; beta
 * tail <= min(kappa tQ, 2 tA + kappa2 tQ) since a sum of pointwise
 * minima is <= the minimum of the sums; tA, tQ are the RZ-PEN tail
 * majorants unchanged. c3n = c_alpha tA + min(kappa tQ, 2 tA +
 * kappa2 tQ) <= c3.
 *
 * THEOREM RZ-PEN3 (beta-capped two-chart pencil floor; 1 < r < rho <=
 * e^6, every m, every split point t in (0, pi]):
 *   lam_min(Gtilde_2m, BD) >= inf lam_min(F, G0) >= A_pen3(rho, r; t)
 *     = [sin^2(pi tau) / tanh^2(b/2)] min(V_N3(t), V_F3(t)),
 *   V_N3(t) = 8 P(t) P(2pi) / [t3(t) P(t) + 2 t3(2pi + t) P(2pi) + c3n],
 *   V_F3(t) = 4 P(pi) S(t) / [t3(pi) P(pi) + t3(3pi) S(t) + c3n],
 *   S(t) = P(2pi - t) + P(2pi + t).
 * Proof. Identical two-chart corner reduction to THEOREM RZ-PEN2
 * (imp-95328), with the per-term weight 2 + kappa w^2 replaced by
 * t3(w): NEAR CHART |theta| <= t caps the center weight at t3(t) and
 * both side weights at t3(2pi + t) (side arguments lie in
 * [2pi - t, 2pi + t] and t3 is increasing in |w|), then P_0 >= P(t),
 * S >= S(0) = 2 P(2pi) by LEMMA S-MONO and the monotone corner LEMMA
 * CHART (both imp-95328, cited); FAR CHART t <= |theta| <= pi caps at
 * t3(pi) and t3(3pi) with P_0 >= P(pi), S >= S(t). Combine with the
 * inherited determinant floor and lam_min >= det M / tr M. QED.
 * DOMINANCE: t3(w) <= 2 + kappa w^2 and c3n <= c3 give V_N3 >= V_N2
 * and V_F3 >= V_F2 at every split point, hence A_pen3 >= A_pen2 >=
 * A_pen unconditionally, and the t = pi endpoint still dominates the
 * RZ-PEN corner. W3(rho) = max over the explicit 256-point split scan
 * T256 of min(V_N3, V_F3) -- a maximum of closed-form floors, hence
 * itself a rigorous floor (same honest-form note as imp-95328: the
 * optimal split point is scan-selected, not a root formula).
 *
 * COROLLARY PEN-UNIF3 (r-and-m-uniform floor, coalescence half). For
 * r in (1, sqrt(rho)]: sin^2(pi tau) / tanh^2(b/2) >= 16 / a^2
 * (RZ-PEN chord step, unchanged), so inf lam_min(F, G0) >=
 * A_unif3(rho) = (16 / a^2) W3(rho), independent of r and m.
 * A_unif3(2) = 3.465048673e-10 = 1.1192 x A_unif2(2).
 *
 * COROLLARY SPLIT-PEN3 (every-octave certificate). On the dyadic twin
 * skeleton, r in (1, 1.3] (the imp-95252 coalLaw scope), every m:
 *   Lambda(V, x) <= [sum over k of coalLaw(2^k x)] / max(A_pen3, A_blk),
 * onsets: m-and-r-uniform 14.302669 -> 14.242145; r = 1.3:
 * 14.077435 -> 14.016839; r = 1.05: 13.825182 -> 13.764502.
 * A_pen3(2, 1.3) = 5.267342209e-10 = 39.16 x A_blk.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) LEMMA BCAP approached on a dense
 * grid (6 a-values incl. a = 11 outside the theorem scope, b up to 2a,
 * w up to 4pi): no violation; worst ratio 0.9998 -- the lemma is
 * nearly attained, so this currency is exhausted, not merely improved.
 * (2) The crossover algebra c* = 1 + a^2 / (2 w^2) makes both branches
 * equal 2 + 4 w^2 / a^2: checked to rel 1e-12. (3) Grid refutation
 * attempts FAILED: 4001-point stable theta grids across rho in
 * {2, 3, 4, e^6}, r from 1.001 to rho^0.999 including both coalescence
 * ends -- no dip below A_pen3 anywhere; worst measured inf / A_pen3 =
 * 3.845 (floor valid with margin). (4) Where the gain lives is as
 * diagnosed: 6.073x at rho = e^6 vs 1.119x at rho = 2 -- the BCAP cap
 * only beats the quadratic branch when kappa w^2 > 2 + kappa2 w^2,
 * i.e. for cosh(a/2) meaningfully above 1; at small a the min() falls
 * back to the RZ-PEN2 branch and the only gain is c_alpha < 2.
 * (5) Finite-matrix check: the m = 6 (rho = 2) and m = 4, 8 (rho = 4)
 * block pencils resolve above A_pen3. (6) Onset honesty both ways:
 * SPLIT-PEN3 still does NOT fire at x = 12 where finite-m EV-OCT
 * (m = 6) does; the onset improvements are small (~0.06) because at
 * rho = 2 the trace currency was never the binding slack. (7) The
 * PEN-NEC cross-block collapse is untouched: A_pen3 -> 0 as r -> rho
 * at the same exact order 2.
 *
 * HONEST LIMITS. (a) Floor only: the exact symbol-pencil infimum is
 * still 3.8 - 10.7x above A_pen3; with the trace currency now
 * essentially sharp per-term, the remaining looseness lives in the
 * NUMERATOR currency (the pair-identity truncation to the {0, +-1}
 * terms), the det/tr step (det over lam_max would be exact), and the
 * two-chart corner reduction -- named residual, NOT claimed. (b) The
 * onsets use the (1, 1.3] coalLaw scope; the floor itself holds on all
 * of (1, rho). (c) Dyadic lattice skeleton only; off-lattice rates
 * unchanged (imp-95232 residual). (d) Split point scan-selected among
 * 256 exact floors (imp-95328 honest-form note applies verbatim).
 * (e) Model family only; no mapping to paper per-window data
 * (obligation (3) gammaSL unchanged); changes NO Lambda bound of the
 * program.
 *
 * ROUTING. The imp-95328 named residual (beta trace currency) is
 * EXECUTED: the 1 - cos quadratic step and the alpha <= 2 f_a step are
 * both replaced by closed-form caps that are numerically near-sharp.
 * New named residual: the numerator currency (pair-identity truncation
 * + det/tr step + corner reduction; the trace side is exhausted).
 * Obligation ledger otherwise unchanged: (2) signed weight / modulus
 * legs, (3) envelope-shape port + gammaSL map, (4) paper constants.
 * Sub-gap imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.
 *
 * Import-light (no imports, no zeros bundle). Numerics are CROSS-CHECKS
 * of proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95329_BETA_TRACE_CAPPED_PENCIL_FLOOR = {
  id: "imp-95329",
  title:
    "LEMMA BCAP + LEMMA ACAP + THEOREM RZ-PEN3 + COROLLARY PEN-UNIF3 + " +
    "COROLLARY SPLIT-PEN3: the beta trace currency of the block " +
    "symbol-pencil floor (the imp-95328 named residual, executed)",
  lemmaBcap:
    "(1 - cos(w b / a)) / (1 - sech(b/2)) <= 2 + 4 w^2 / a^2 for all " +
    "a, b > 0 and real w; two monotone branches (quadratic in c = " +
    "cosh(b/2) increasing, capped 2 + 2/(c - 1) decreasing) crossing " +
    "at c* = 1 + a^2/(2 w^2) where both equal the cap; near-sharp " +
    "(measured sup ratio 0.9998)",
  lemmaAcap:
    "alpha <= 2 f_a / (1 + sech(a/2)) for b in (0, a] (sech decreasing " +
    "keeps the exact 1 + s denominator instead of dropping it to 1)",
  theoremRzPen3: {
    statement:
      "inf lam_min(F, G0) >= A_pen3 = [sin^2(pi tau)/tanh^2(b/2)] W3, " +
      "W3 = max over the 256-point split scan of min(V_N3, V_F3) with " +
      "per-term trace weight t3(w) = c_alpha + min(kappa w^2, " +
      "2 + 4 w^2 / a^2); A_pen3 >= A_pen2 unconditionally",
    w3Rho2: 1.040495674e-11,
    w3Rho4: 1.115455338e-5,
    w3RhoE6: 6.431310215e-2,
    gainRho2: 1.1192,
    gainRho4: 1.1993,
    gainRhoE6: 6.0731,
    aPen3Rho2R13: 5.267342209e-10,
    aPen3Rho2R105: 8.414546712e-10,
    aPen3Rho4R13: 2.057174864e-4,
    tStarRho2: 0.748583,
  },
  corollaryPenUnif3: {
    statement:
      "for r in (1, sqrt(rho)]: inf lam_min(F, G0) >= A_unif3 = " +
      "(16/a^2) W3(rho), independent of r and m",
    aUnif3Rho2: 3.465048673e-10,
    aUnif2Rho2Ref: 3.096089329e-10,
  },
  corollarySplitPen3: {
    statement:
      "Lambda(V, x) <= [sum_k coalLaw(2^k x)] / max(A_pen3, A_blk) on " +
      "the dyadic twin skeleton, r in (1, 1.3], every m: r-uniform " +
      "onset 14.242145 (was 14.302669), 14.016839 at r = 1.3 (was " +
      "14.077435), 13.764502 at r = 1.05 (was 13.825182)",
    xStarUniform3: 14.242145,
    xStarR13: 14.016839,
    xStarR105: 13.764502,
    xStarUniformRef: 14.302669,
    xStarR13Ref: 14.077435,
    xStarR105Ref: 13.825182,
    aBlkRef: 1.344996021179e-11,
    pen3OverBlkR13: 39.1625,
  },
  honestScope:
    "floor only, measured 3.8 - 10.7x below the exact symbol-pencil " +
    "infimum (was up to 65.2x at rho = e^6); the trace currency is now " +
    "near-sharp per-term, so the surviving named residual is the " +
    "numerator currency (pair-identity truncation, det/tr step, corner " +
    "reduction); split point scan-selected among 256 exact floors; " +
    "dyadic skeleton only; model family only",
  verdict:
    "RIGOROUS: LEMMA BCAP (two-branch crossover cap, elementary and " +
    "uniform in b), LEMMA ACAP and THEOREM RZ-PEN3 are proven, with " +
    "the imp-95288 LEMMA PM / pair identity / tail majorants and the " +
    "imp-95328 LEMMA S-MONO / LEMMA CHART two-chart reduction as cited " +
    "inputs; COROLLARY PEN-UNIF3 and COROLLARY SPLIT-PEN3 follow " +
    "verbatim. The imp-95328 beta-trace-currency residual is EXECUTED: " +
    "floor gain 6.073x at rho = e^6 (looseness 37.8 - 65.2x -> " +
    "6.2 - 10.7x), every-octave onsets 14.302669 -> 14.242145 " +
    "(m-and-r-uniform), 14.077435 -> 14.016839 (r = 1.3), 13.825182 " +
    "-> 13.764502 (r = 1.05). Changes no bound; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (self-contained, import-light)
// ---------------------------------------------------------------------------

const PI = Math.PI;
const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, a) => (2 * PI) / a / Math.cosh((PI * w) / a);

// Poisson-side symbols + cancellation-free pair-identity numerator
function symbols(theta, a, b, NN = 14) {
  const tau = b / a;
  let fa = 0;
  let br = 0;
  const Ps = [];
  for (let n = -NN; n <= NN; n++) {
    const w = theta + 2 * PI * n;
    const p = kernelP(w, a);
    Ps.push(p);
    fa += p;
    br += p * Math.cos(w * tau);
  }
  let C = 0;
  for (let i = 0; i < Ps.length; i++)
    for (let j = 0; j < Ps.length; j++) {
      if (i === j) continue;
      const s = Math.sin(PI * Math.abs(i - j) * tau);
      C += 2 * s * s * Ps[i] * Ps[j];
    }
  return { fa, br, C };
}

// stable smaller root of (1 - s^2) lam^2 - 2 lam (fa - s Re fb) + C = 0
function pencilSymbolMin(theta, a, b) {
  const s = sechHalf(b);
  const A = 1 - s * s;
  const { fa, br, C } = symbols(theta, a, b);
  const Bp = fa - s * br;
  return C / (Bp + Math.sqrt(Math.max(Bp * Bp - A * C, 0)));
}

function gridInf(a, b, Ngrid = 4001) {
  let inf = Infinity;
  for (let i = 0; i <= Ngrid; i++) {
    const th = -PI + (2 * PI * i) / Ngrid;
    const v = pencilSymbolMin(th, a, b);
    if (v < inf) inf = v;
  }
  return inf;
}

// shared tail majorants (imp-95288, verbatim)
function baseConstants(a) {
  const c = Math.cosh(a / 2);
  const pi2 = PI * PI;
  const kap = (4 * c) / (a * a);
  const e2 = Math.exp((-2 * pi2) / a);
  const e3 = Math.exp((-3 * pi2) / a);
  const tA = (((8 * PI) / a) * e3) / (1 - e2);
  const tQ = (((200 * PI ** 3) / a) * e3) / (1 - 4 * e2);
  return { kap, tA, tQ, pi2 };
}

// RZ-PEN2 charts (imp-95328, verbatim) for the dominance comparison
function pen2Constants(a) {
  const { kap, tA, tQ, pi2 } = baseConstants(a);
  const c1 = 2 + kap * pi2;
  const c2 = 2 + 9 * kap * pi2;
  const c3 = 2 * tA + kap * tQ;
  return { kap, c1, c2, c3 };
}
function chartVN2(a, t) {
  const { kap, c3 } = pen2Constants(a);
  const Pt = kernelP(t, a);
  const P2pi = kernelP(2 * PI, a);
  const c2N = 2 + kap * (2 * PI + t) ** 2;
  return (8 * Pt * P2pi) / ((2 + kap * t * t) * Pt + 2 * c2N * P2pi + c3);
}
function chartVF2(a, t) {
  const { c1, c2, c3 } = pen2Constants(a);
  const Ppi = kernelP(PI, a);
  const St = kernelP(2 * PI - t, a) + kernelP(2 * PI + t, a);
  return (4 * Ppi * St) / (c1 * Ppi + c2 * St + c3);
}
function w2Scan(a) {
  let best = 0;
  for (let k = 1; k <= 256; k++) {
    const t = (PI * k) / 256;
    const v = Math.min(chartVN2(a, t), chartVF2(a, t));
    if (v > best) best = v;
  }
  return best;
}

// RZ-PEN3 constants and charts (this module)
function pen3Constants(a) {
  const { kap, tA, tQ } = baseConstants(a);
  const kap2 = 4 / (a * a);
  const cAlpha = 2 / (1 + sechHalf(a));
  const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + kap2 * w * w);
  const c3n = cAlpha * tA + Math.min(kap * tQ, 2 * tA + kap2 * tQ);
  return { kap, kap2, cAlpha, tw, c3n };
}
function chartVN3(a, t) {
  const { tw, c3n } = pen3Constants(a);
  const Pt = kernelP(t, a);
  const P2pi = kernelP(2 * PI, a);
  return (8 * Pt * P2pi) / (tw(t) * Pt + 2 * tw(2 * PI + t) * P2pi + c3n);
}
function chartVF3(a, t) {
  const { tw, c3n } = pen3Constants(a);
  const Ppi = kernelP(PI, a);
  const St = kernelP(2 * PI - t, a) + kernelP(2 * PI + t, a);
  return (4 * Ppi * St) / (tw(PI) * Ppi + tw(3 * PI) * St + c3n);
}
function w3Scan(a) {
  let best = 0;
  let bestT = 0;
  for (let k = 1; k <= 256; k++) {
    const t = (PI * k) / 256;
    const v = Math.min(chartVN3(a, t), chartVF3(a, t));
    if (v > best) {
      best = v;
      bestT = t;
    }
  }
  return { W3: best, tStar: bestT };
}
const prefactor = (a, b) =>
  Math.sin(PI * (b / a)) ** 2 / Math.tanh(b / 2) ** 2;
const aPen2 = (a, b) => prefactor(a, b) * w2Scan(a);
const aPen3 = (a, b) => prefactor(a, b) * w3Scan(a).W3;
const aUnif3 = (a) => (16 / (a * a)) * w3Scan(a).W3;

// finite-matrix pencil machinery (style of the imp-95328 sibling)
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95329 chol: base not PD");
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

// SPLIT-PEN3 certificate on the dyadic skeleton (coalLaw from imp-95227)
const coalLaw = (x) =>
  Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
function certNumerator(x) {
  let s = 0;
  for (let k = 0; k < 60; k++) s += coalLaw(2 ** k * x);
  return s;
}
const A_BLK_REF = 1.344996021179e-11; // imp-95252 A_blk(2, 1.3)

const REC = IMP95329_BETA_TRACE_CAPPED_PENCIL_FLOOR;
const T = REC.theoremRzPen3;
const XSTAR3_UNIF = REC.corollarySplitPen3.xStarUniform3;
const XSTAR3_R13 = REC.corollarySplitPen3.xStarR13;
const XSTAR3_R105 = REC.corollarySplitPen3.xStarR105;

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95329_ASSERTIONS = [
  {
    id: "imp95329-lemma-bcap",
    description:
      "LEMMA BCAP: (1 - cos(w b / a)) / (1 - sech(b/2)) <= 2 + " +
      "4 w^2 / a^2 on a dense grid (a in {0.1, ln 2, ln 4, 3, 6, 11}, " +
      "b up to 2a, w up to 4pi); the crossover algebra holds to rel " +
      "1e-12 (both branches equal the cap at c* = 1 + a^2 / (2 w^2)); " +
      "the branch inequalities 1 - cos x <= min(x^2 / 2, 2) and " +
      "1 - sech(y/2) >= y^2 / (8 cosh(y/2)) hold on grids",
    holds: () => {
      for (let i = 0; i <= 2000; i++) {
        const x = (i / 2000) * 30;
        if (1 - Math.cos(x) > Math.min((x * x) / 2, 2) + 1e-12)
          return false;
        const y = (i / 2000) * 12 + 1e-6;
        if (1 - sechHalf(y) < (y * y) / (8 * Math.cosh(y / 2)) - 1e-15)
          return false;
      }
      for (const a of [0.1, Math.LN2, Math.log(4), 3, 6, 11]) {
        for (let iw = 1; iw <= 120; iw++) {
          const w = (iw / 120) * 4 * PI;
          const cap = 2 + (4 * w * w) / (a * a);
          const d = (a * a) / (2 * w * w);
          const cStar = 1 + d;
          const branchQuad = (4 * w * w * cStar) / (a * a);
          const branchCap = 2 + 2 / d;
          if (Math.abs(branchQuad / cap - 1) > 1e-12) return false;
          if (Math.abs(branchCap / cap - 1) > 1e-12) return false;
          for (let ib = 1; ib <= 240; ib++) {
            const b = (ib / 240) * 2 * a;
            const lhs = (1 - Math.cos((w * b) / a)) / (1 - sechHalf(b));
            if (lhs > cap * (1 + 1e-12)) return false;
          }
        }
      }
      return true;
    },
  },
  {
    id: "imp95329-lemma-acap",
    description:
      "LEMMA ACAP: sech(b/2) >= sech(a/2) on b in (0, a], and the " +
      "alpha diagonal (f_a + Re f_b) / (1 + sech(b/2)) <= c_alpha f_a " +
      "over dense theta at (rho, r) in {(2, 1.3), (4, 2), (e^6, e^3)}",
    holds: () => {
      for (const a of [Math.LN2, 3, 6]) {
        for (let i = 1; i <= 200; i++) {
          const b = (a * i) / 200;
          if (sechHalf(b) < sechHalf(a) - 1e-15) return false;
        }
      }
      for (const [rho, r] of [
        [2, 1.3],
        [4, 2],
        [Math.exp(6), Math.exp(3)],
      ]) {
        const a = Math.log(rho);
        const b = Math.log(r);
        const cAlpha = 2 / (1 + sechHalf(a));
        const s = sechHalf(b);
        for (let i = 0; i <= 800; i++) {
          const th = -PI + (2 * PI * i) / 800;
          const { fa, br } = symbols(th, a, b);
          if ((fa + br) / (1 + s) > cAlpha * fa * (1 + 1e-12))
            return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95329-per-term-dominance",
    description:
      "the new per-term weight t3(w) = c_alpha + min(kappa w^2, 2 + " +
      "4 w^2 / a^2) is <= the RZ-PEN2 weight 2 + kappa w^2 and " +
      "increasing in |w| (w-grids, a in {ln 2, ln 4, 3, 6}); c3n <= " +
      "c3; hence W3 >= W2 and A_pen3 >= A_pen2 at sampled (rho, r)",
    holds: () => {
      for (const a of [Math.LN2, Math.log(4), 3, 6]) {
        const { kap, tw, c3n } = pen3Constants(a);
        const { c3 } = pen2Constants(a);
        if (!(c3n <= c3 * (1 + 1e-12))) return false;
        let prev = -Infinity;
        for (let i = 0; i <= 400; i++) {
          const w = (i / 400) * 4 * PI;
          const t3 = tw(w);
          if (t3 > 2 + kap * w * w + 1e-12) return false;
          if (t3 < prev - 1e-12) return false;
          prev = t3;
        }
        if (!(w3Scan(a).W3 >= w2Scan(a) * (1 - 1e-12))) return false;
      }
      for (const [rho, r] of [
        [2, 1.05],
        [2, 1.3],
        [4, 1.3],
        [Math.exp(6), 2],
      ]) {
        const a = Math.log(rho);
        const b = Math.log(r);
        if (!(aPen3(a, b) >= aPen2(a, b) * (1 - 1e-12))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95329-theorem-rz-pen3",
    description:
      "THEOREM RZ-PEN3: 4001-point stable grid inf of lam_min(F, G0) " +
      ">= A_pen3 >= A_pen2 at (rho, r) across {2, 3, 4, e^6} x " +
      "{1.001 .. rho^0.999} including both coalescence ends; honesty " +
      "bracket inf <= 12 A_pen3; baked literals reproduce (rel 1e-7)",
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
        const A3 = aPen3(a, b);
        const A2 = aPen2(a, b);
        if (!(inf >= A3 && A3 >= A2 * (1 - 1e-12) && inf <= 12 * A3))
          return false;
      }
      const rel = (x, y) => Math.abs(x / y - 1);
      return (
        rel(w3Scan(Math.LN2).W3, T.w3Rho2) < 1e-7 &&
        rel(w3Scan(Math.log(4)).W3, T.w3Rho4) < 1e-7 &&
        rel(w3Scan(6).W3, T.w3RhoE6) < 1e-7 &&
        rel(aPen3(Math.LN2, Math.log(1.3)), T.aPen3Rho2R13) < 1e-7 &&
        rel(aPen3(Math.LN2, Math.log(1.05)), T.aPen3Rho2R105) < 1e-7 &&
        rel(aPen3(Math.log(4), Math.log(1.3)), T.aPen3Rho4R13) < 1e-7 &&
        rel(w3Scan(Math.LN2).W3 / w2Scan(Math.LN2), T.gainRho2) < 1e-4 &&
        rel(w3Scan(Math.log(4)).W3 / w2Scan(Math.log(4)), T.gainRho4) <
          1e-4 &&
        rel(w3Scan(6).W3 / w2Scan(6), T.gainRhoE6) < 1e-4 &&
        Math.abs(w3Scan(Math.LN2).tStar - T.tStarRho2) < 1e-5
      );
    },
  },
  {
    id: "imp95329-large-a-residual-executed",
    description:
      "the gain lives where the imp-95328 residual said it does: " +
      "6.073x at rho = e^6 vs 1.119x at rho = 2, and the measured " +
      "looseness inf / A_pen3 at rho = e^6 is within [1, 10.8] " +
      "(was 37.8 - 65.2x for A_pen2)",
    holds: () => {
      if (!(w3Scan(6).W3 / w2Scan(6) > 6)) return false;
      if (!(w3Scan(Math.LN2).W3 / w2Scan(Math.LN2) < 1.2)) return false;
      for (const r of [2, Math.exp(3), Math.exp(5.9)]) {
        const b = Math.log(r);
        const inf = gridInf(6, b);
        const ratio = inf / aPen3(6, b);
        if (!(ratio >= 1 && ratio <= 10.8)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95329-corollary-pen-unif3",
    description:
      "COROLLARY PEN-UNIF3: A_pen3(rho, r) >= A_unif3 = (16/a^2) W3 " +
      "on a 40-point r-grid over (1, sqrt(rho)] for rho in {2, 4}; " +
      "A_unif3(2) matches the baked literal (rel 1e-7) and is 1.1192x " +
      "the imp-95328 A_unif2(2)",
    holds: () => {
      for (const rho of [2, 4]) {
        const a = Math.log(rho);
        const AU = aUnif3(a);
        for (let i = 1; i <= 40; i++) {
          const b = (a / 2) * (i / 40);
          if (aPen3(a, b) < AU * (1 - 1e-12)) return false;
        }
      }
      const R = REC.corollaryPenUnif3;
      return (
        Math.abs(aUnif3(Math.LN2) / R.aUnif3Rho2 - 1) < 1e-7 &&
        Math.abs(R.aUnif3Rho2 / R.aUnif2Rho2Ref - 1.1192) < 2e-3
      );
    },
  },
  {
    id: "imp95329-matrix-pencil-floor",
    description:
      "matrix level: lam_min of the finite pencil (Gtilde_2m, blockdiag " +
      "G0) >= A_pen3 at rho = 4 (m in {4, 8}, r in {1.05, 1.3, 2}) and " +
      "rho = 2 (m = 6, r in {1.05, 1.3})",
    holds: () => {
      for (const [rho, r, ms] of [
        [4, 1.05, [4, 8]],
        [4, 1.3, [4, 8]],
        [4, 2, [4, 8]],
        [2, 1.05, [6]],
        [2, 1.3, [6]],
      ]) {
        const bound = aPen3(Math.log(rho), Math.log(r));
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
    id: "imp95329-corollary-split-pen3",
    description:
      "COROLLARY SPLIT-PEN3: baked onsets bracket 1 (xStar +- 1e-3); " +
      "every new onset beats its imp-95328 reference (14.242145 < " +
      "14.302669, 14.016839 < 14.077435, 13.764502 < 13.825182); " +
      "A_pen3(2, 1.3) = 39.16 x A_blk; honest: still no fire at x = 12",
    holds: () => {
      const certUnif = (x) => certNumerator(x) / aUnif3(Math.LN2);
      const cert = (x, r) =>
        certNumerator(x) /
        Math.max(aPen3(Math.LN2, Math.log(r)), A_BLK_REF);
      if (
        !(
          certUnif(XSTAR3_UNIF - 1e-3) > 1 &&
          certUnif(XSTAR3_UNIF + 1e-3) < 1 &&
          cert(XSTAR3_R13 - 1e-3, 1.3) > 1 &&
          cert(XSTAR3_R13 + 1e-3, 1.3) < 1 &&
          cert(XSTAR3_R105 - 1e-3, 1.05) > 1 &&
          cert(XSTAR3_R105 + 1e-3, 1.05) < 1
        )
      )
        return false;
      const C = REC.corollarySplitPen3;
      if (!(XSTAR3_UNIF < C.xStarUniformRef)) return false;
      if (!(XSTAR3_R13 < C.xStarR13Ref)) return false;
      if (!(XSTAR3_R105 < C.xStarR105Ref)) return false;
      const factor = aPen3(Math.LN2, Math.log(1.3)) / A_BLK_REF;
      if (Math.abs(factor - C.pen3OverBlkR13) > 5e-3) return false;
      return certUnif(12) > 1;
    },
  },
  {
    id: "imp95329-verdict-honesty",
    description:
      "the verdict and scope carry the honest labels: RIGOROUS lemmas " +
      "and theorem, residual EXECUTED not oversold, floor-only " +
      "looseness recorded, surviving numerator-currency residual " +
      "named, no bound change, no QED, no refereed bound is changed",
    holds: () =>
      /RIGOROUS/.test(REC.verdict) &&
      /EXECUTED/.test(REC.verdict) &&
      /Changes no bound/.test(REC.verdict) &&
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /floor only/i.test(REC.honestScope) &&
      /named residual/.test(REC.honestScope) &&
      /scan-selected/.test(REC.honestScope),
  },
];

for (const a of IMP95329_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95329-beta-trace-capped-pencil-floor assertion failed: ${a.id}`,
    );
  }
}
