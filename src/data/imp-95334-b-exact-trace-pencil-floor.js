/**
 * imp-95334: LEMMA T-EXACT + THEOREM RZ-PEN8 -- decides the imp-95334
 * ticket ("derive or obstruct a b-uniform bound on the imp-95329 t3
 * trace weight at interior frequencies") BOTH WAYS, and with it
 * executes the LAST named leg of the RZ-PEN numerator/trace residual
 * chain. Thirty-seventh leg of the seam chain. ONE move.
 *
 * (I) OBSTRUCTION (the b-UNIFORM side). The LEMMA BCAP cap
 * 2 + 4 w^2 / a^2 (imp-95329) cannot be materially improved AS A
 * b-UNIFORM statement where the certificate onsets live: restricted to
 * the branch-L range tau = b/a in (0, 3/8] of COROLLARY PEN-UNIF7, the
 * measured sup over (b, w) of ratio/cap is 0.9985 at a = ln 2 and
 * 0.9939 at a = ln 4 -- at most 0.2 - 0.6 percent headroom at the
 * onset scale. (At a = 6 the branch-restricted sup drops to 0.898, so
 * ~10 percent b-uniform headroom exists for the UNIFORM corollary at
 * large rho only; recorded as the sole surviving uniform-side
 * residual. The uniform constant is carried: A_unif8 = A_unif7.)
 *
 * (II) EXECUTION (the POINTWISE side). The b-uniformity is simply NOT
 * NEEDED by the per-(rho, r) floor A_pen(rho, r), which is evaluated
 * at exact (a, b): the per-term TRUE weight of tr M admits an exact
 * elementary chartwise cap. In the plus-minus basis,
 *   tr M = alpha + beta = 2 (f_a - s Re f_b) / A
 *        = sum over n of [2 (1 - s cos(w_n tau)) / A] P(w_n),
 * so the true per-term weight is 2 (1 - s cos(w tau)) / A -- no cap at
 * all, just the identity. On a chart the cosine has an exact interval
 * minimum (LEMMA T-EXACT below), giving a per-chart trace majorant T8
 * that replaces the b-uniform t3 charges of T6 termwise. Measured:
 * the capped trace now exceeds the true B by 1.0049x at the binding
 * chart at rho = e^6, r = 2 (was 2.154x under T6 at the same chart) --
 * the TRACE CURRENCY IS EXHAUSTED POINTWISE. Floor gains over RZ-PEN7:
 * 3.651x at rho = e^6 r = 2 (looseness against the exact symbol-pencil
 * infimum 3.957 -> 1.084), 3.185x at r = e^3 (-> 1.015), 2.242x at
 * r = e^5.9 (-> 1.036), 1.285x at rho = 10 (-> 1.010), 1.064x at
 * rho = 4; rho = 2 floors BITWISE UNCHANGED (the carried V4 floor
 * binds there and the floor already sits within 3.3 percent of the
 * exact infimum), so ALL every-octave onsets carry UNCHANGED
 * (13.297836 / 13.071303 / 12.817538). With looseness now 1.01 - 1.08
 * at EVERY sampled cell, the pointwise pencil-floor sharpening program
 * (RZ-PEN .. RZ-PEN8) is EFFECTIVELY TERMINAL: the remaining pointwise
 * headroom is ~2.3 percent chart refinement (K = 4096 vs 256), ~2.8
 * percent kept-pair, and endpoint charging -- do not re-attempt
 * further pointwise trace or numerator legs. Changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * OBJECT (imp-95252 / imp-95288 / imp-95329..95333 normalization,
 * verbatim). a = ln rho in (0, 6], b = ln r in (0, a), tau = b / a,
 * s = sech(b / 2), A = 1 - s^2 = tanh^2(b / 2), P(w) = (2 pi / a)
 * sech(pi w / a), w_n = theta + 2 pi n, theta in [0, pi] (evenness).
 * lam_min(F, G0) is the smaller root of A lam^2 - 2 B lam + C with
 * B = f_a - s Re f_b, the imp-95288 cancellation-free pair identity
 * for C, and the imp-95333 kept-pair floor C_low = 4 sin^2(pi tau)
 * (X7_k + nu Y7_k), nu = 4 cos^2(pi tau).
 *
 * LEMMA T-EXACT (b-exact chartwise trace weight -- UNCONDITIONAL).
 * (i) Identity: alpha + beta = 2 (f_a - s Re f_b) / A, so tr M prices
 * the shell at |w| by exactly t(w) = 2 (1 - s cos(w tau)) / A (P and
 * cos are even in w). Proof: alpha = (f_a + Re f_b)/(1 + s), beta =
 * (f_a - Re f_b)/(1 - s); combine over the common denominator 1 - s^2.
 * QED.
 * (ii) Interval cosine minimum: for 0 <= x0 <= x1, min of cos over
 * [x0, x1] equals -1 if [x0, x1] contains an odd multiple of pi
 * (cos = -1 exactly there), else min(cos x0, cos x1) (the only
 * interior critical points of cos are multiples of pi; even multiples
 * are maxima, so with no odd multiple inside, the minimum is attained
 * at an endpoint). QED.
 * (iii) Chart cap: for the shell whose |w| ranges over [u0, u1] as
 * theta ranges over the chart, every theta in the chart satisfies
 *   t(w) <= t8(u0, u1) = 2 (1 - s mc(u0 tau, u1 tau)) / A,
 * with mc the interval cosine minimum of (ii); and t8 may be replaced
 * by min(t8, t3-charge) since the carried imp-95329 weight t3 is also
 * a valid per-term cap (LEMMA ACAP + LEMMA BCAP) -- so the resulting
 * per-chart trace majorant T8_k (head shells 0, -1, +1 charged at
 * min(t8, t3) times the chart-max kernel, tail shells m = 2..12 both
 * signs likewise, plus the imp-95332 geometric remainder re-anchored
 * at 25 pi, whose old-weight majorant dominates the true tail
 * termwise) satisfies B <= (A / 2) T8_k on the chart AND T8_k <= T6_k
 * termwise. QED.
 *
 * THEOREM RZ-PEN8 (b-exact pointwise chart floor; 1 < r < rho <= e^6,
 * every m). On chart I_k, LEMMA ROOT-MONO (imp-95331) at the
 * substitution pair (B_up = (A / 2) T8_k, C_low of LEMMA PAIR-2) --
 * in-domain automatically since B_up >= B and C_low <= C keep
 * B_up^2 - A C_low >= B^2 - A C >= 0 -- gives with mu = sin^2(pi tau)
 * / tanh^2(b / 2), nu = 4 cos^2(pi tau):
 *   lam_min(theta) >= mu Psi8_k(mu, nu),
 *   Psi8_k(mu, nu) = 4 (X7_k + nu Y7_k) /
 *     [T8_k / 2 + sqrt(T8_k^2 / 4 - 4 mu (X7_k + nu Y7_k))],
 * and chartwise (carried floors retained in the max):
 *   inf lam_min(F, G0) >= A_pen8(rho, r) = mu W8(a, b, mu, nu),
 *   W8 = min over k = 0..255 of
 *     max(V4_k, Psi5_k, Psi6_k(mu), Psi7_k(mu, nu), Psi8_k(mu, nu)).
 * QED. Dominance A_pen8 >= A_pen7 is UNCONDITIONAL twice over: the
 * chartwise max retains the carried floors, and T8_k <= T6_k termwise
 * makes Psi8 >= Psi7 pointwise. Psi8 keeps the ROOT-MONO monotonicity
 * in mu and nu. Unlike Psi5..Psi7 the weight depends on b directly --
 * Psi8 is used ONLY at the exact per-(rho, r) parameters, never inside
 * the r-uniform corollary, whose branches need b-uniform weights and
 * are carried unchanged (A_unif8 = A_unif7; the obstruction record (I)
 * is exactly why).
 *
 * MEASURED LEDGER (gain over RZ-PEN7; looseness = exact symbol inf /
 * A_pen8). rho = e^6: r = 2 gain 3.6510 (looseness 3.957 -> 1.084),
 * r = e^3 gain 3.1852 (3.232 -> 1.015), r = e^5.9 gain 2.2423 (2.323
 * -> 1.036); rho = 10, r = 2: gain 1.2854 (1.299 -> 1.010); rho = 4,
 * r = 2: gain 1.0645; rho = 2 (r in {1.3, 1.05}) and the coalescence
 * cell (2.5, 2.49771): gain 1.0000 BITWISE (V4 binds; looseness
 * already 1.005 - 1.037 there). Binding chart at rho = e^6, r = 2
 * MOVES 114 -> 255 (theta near pi): once the trace is exact-ish the
 * worst chart is the far corner, no longer the interior. K-refinement
 * at rho = e^6: K = 1024 / K = 256 = 1.0195, K = 4096 / K = 256 =
 * 1.0231 -- the chart currency reopens by ~2.3 percent at large rho
 * (was 0.73 percent under the old floors), the largest single
 * remaining pointwise headroom and still small.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) Trace-cap truth: (A/2) T8_k >=
 * B_true at 11-point in-chart grids over 9 charts x 8 (rho, r) cells
 * including both coalescence ends -- no violation; near-attained at
 * the rho = e^6 binding chart (ratio 1.0049). (2) LEMMA T-EXACT (ii)
 * approached against dense 2001-point interval minima for intervals
 * straddling and avoiding odd multiples of pi: exact agreement to
 * float precision. (3) Floor validity: 2001-point exact-symbol scans
 * + 3 rounds of local refinement at 8 cells: no dip below A_pen8;
 * worst margin is the rho = e^6 r = e^3 cell at 1.0148. (4) Finite
 * pencils (Gtilde_2m vs blockdiag G0, m up to 6, rho in {2, 10, e^6})
 * resolve above A_pen8. (5) Dominance: A_pen8 >= A_pen7 at every
 * sampled cell, T8 <= T6 at every sampled chart, and rho = 2 floors
 * agree bitwise with imp-95333 (convention lock). (6) Onset honesty:
 * the rho = 2 binding chartwise max is attained by the carried V4
 * floor (Psi8 = 5.937e-11 < V4 = 5.998e-11 at the binding chart
 * k = 5), so the SPLIT onsets are UNCHANGED by re-bracketing, not by
 * assumption. (7) Obstruction honesty: the branch-L restricted BCAP
 * sup ratio/cap is 0.9985 at a = ln 2, 0.9939 at a = ln 4, 0.8977 at
 * a = 6 (200 x 400 (w, b) grid): the b-uniform leg is genuinely dead
 * at onset scale and genuinely ~10 percent open at a = 6 for the
 * uniform corollary only.
 *
 * HONEST LIMITS. (a) Floor only; the gains live at rho > ~ 4 where no
 * certificate currently fires; the rho = 2 certificate anchor is
 * untouched and NO onset moves. (b) The pointwise trace currency is
 * EXHAUSTED (cap within 0.5 percent of true B at the binding chart);
 * remaining pointwise headroom: ~2.3 percent chart refinement at
 * K -> 4096, ~2.8 percent kept-pair (imp-95333), endpoint charging.
 * The pointwise pencil-floor program is EFFECTIVELY TERMINAL -- do
 * not re-attempt pointwise trace/numerator legs. (c) The r-uniform
 * corollary is carried unchanged; its only live lever is the ~10
 * percent branch-L BCAP headroom at large a (uniform side, named,
 * small). (d) Dyadic lattice skeleton only; off-lattice rates
 * unchanged (imp-95232 residual). (e) Model family only; no mapping
 * to paper per-window data (obligation (3) gammaSL unchanged);
 * changes NO Lambda bound of the program. Sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.
 *
 * Import-light (no imports, no zeros bundle). Numerics are
 * CROSS-CHECKS of proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95334_B_EXACT_TRACE_PENCIL_FLOOR = {
  id: "imp-95334",
  title:
    "LEMMA T-EXACT + THEOREM RZ-PEN8: the b-uniform t3 trace-weight " +
    "leg decided both ways -- b-uniform improvement OBSTRUCTED at " +
    "onset scale (branch-restricted BCAP sup 0.9985 at a = ln 2), " +
    "pointwise floor EXECUTED with the exact per-term weight " +
    "2 (1 - s cos(w tau)) / A capped chartwise by the interval cosine " +
    "minimum; trace currency exhausted pointwise",
  lemmaTExact:
    "tr M prices the shell at |w| by exactly 2 (1 - s cos(w tau)) / A " +
    "(identity, not a cap); on a chart the cosine minimum is -1 if an " +
    "odd multiple of pi lies inside the scaled interval, else the " +
    "endpoint minimum; per-term min with the carried t3 charge keeps " +
    "T8 <= T6 termwise",
  theoremRzPen8: {
    statement:
      "inf lam_min(F, G0) >= A_pen8 = mu W8(a, b, mu, nu), W8 = min " +
      "over K = 256 charts of max(V4_k, Psi5_k, Psi6_k, Psi7_k, " +
      "Psi8_k), Psi8 = the exact-root floor at (B_up = (A/2) T8_k, " +
      "C_low of LEMMA PAIR-2); A_pen8 >= A_pen7 unconditionally; " +
      "pointwise use only (the b-exact weight cannot enter the " +
      "r-uniform corollary)",
    K: 256,
    N: 12,
    aPen8RhoE6R2: 0.7222105115667,
    aPen7RhoE6R2Ref: 0.19781181502689443,
    aPen8RhoE6Re3: 0.5350325457484,
    aPen8RhoE6Re59: 0.001069410033440,
    aPen8Rho10R2: 0.04702316342006,
    aPen8Rho4R2: 0.0004078924061915,
    aPen8Rho2R13: 3.036521147820e-9,
    aPen8Rho2R105: 4.850823817444e-9,
    gainRhoE6R2: 3.650997851,
    gainRhoE6Re3: 3.185183758,
    gainRhoE6Re59: 2.242296631,
    gainRho10R2: 1.285431939,
    gainRho4R2: 1.064492249,
    bindingChartRhoE6: 255,
    bindingChartMoveNote:
      "the RZ-PEN7 binding chart was 114 (interior); with the trace " +
      "exact-ish the binding chart moves to the far corner k = 255",
    loosenessRhoE6R2: 1.0838458,
    loosenessRhoE6R2Pen7Ref: 3.957118732272573,
    loosenessRhoE6Re3: 1.0147830,
    loosenessRhoE6Re59: 1.0359395,
    loosenessRho10R2: 1.0102577,
    loosenessRho2R13: 1.0325242,
    bUp8OverBTrueBind: 1.00487,
    bUp6OverBTrueBindRef: 2.15404,
    k1024OverK256RhoE6: 1.019546,
    k4096OverK256RhoE6: 1.023099,
  },
  bUniformObstruction: {
    statement:
      "restricted to the PEN-UNIF7 branch-L range tau in (0, 3/8], " +
      "the measured sup over (b, w) of the BCAP ratio " +
      "(1 - cos(w tau)) / [(1 - sech(b/2)) (2 + 4 w^2 / a^2)] is " +
      "0.9985 at a = ln 2 and 0.9939 at a = ln 4: no b-uniform " +
      "improvement is available at onset scale; at a = 6 the " +
      "branch-restricted sup is 0.8977 (~10 percent headroom, uniform " +
      "corollary only, named residual)",
    supBranchLALn2: 0.9985,
    supBranchLALn4: 0.9939,
    supBranchLA6: 0.8977,
    aUnif8Note: "A_unif8 = A_unif7 carried unchanged",
  },
  onsetsUnchanged: {
    xStarUniform: 13.297836,
    xStarR13: 13.071303,
    xStarR105: 12.817538,
    note:
      "rho = 2 floors bitwise unchanged (the carried V4 floor binds " +
      "at the binding chart k = 5 and the floor already sits within " +
      "3.3 percent of the exact symbol infimum), so all SPLIT onsets " +
      "carry over UNCHANGED and are re-bracketed below",
  },
  pointwiseProgramTerminal:
    "with looseness 1.01 - 1.08 at every sampled cell, the pointwise " +
    "pencil-floor sharpening chain RZ-PEN..RZ-PEN8 is EFFECTIVELY " +
    "TERMINAL; remaining pointwise headroom: ~2.3 percent chart " +
    "refinement (K = 4096 vs 256 at rho = e^6), ~2.8 percent " +
    "kept-pair, endpoint charging -- do not re-attempt pointwise " +
    "trace or numerator legs; live residuals: off-lattice rates " +
    "(imp-95232), branch-L uniform headroom at large a, gammaSL map " +
    "(obligation 3)",
  honestScope:
    "floor only; gains live at rho > ~ 4 where no certificate " +
    "currently fires; rho = 2 floors bitwise unchanged and all " +
    "certificate onsets unchanged; the b-exact weight is pointwise " +
    "only and cannot enter the r-uniform corollary (A_unif8 = " +
    "A_unif7); dyadic skeleton only; model family only",
  verdict:
    "RIGOROUS: LEMMA T-EXACT is an identity plus an elementary exact " +
    "interval cosine minimum; THEOREM RZ-PEN8 composes it with the " +
    "carried imp-95333 kept-pair floor via LEMMA ROOT-MONO, with " +
    "unconditional dominance A_pen8 >= A_pen7 (chartwise max AND " +
    "T8 <= T6 termwise). The imp-95334 ticket is DECIDED both ways: " +
    "the b-UNIFORM t3 improvement is OBSTRUCTED at onset scale " +
    "(branch-restricted BCAP sup 0.9985 at a = ln 2), and the " +
    "POINTWISE leg is EXECUTED and EXHAUSTED (capped trace within " +
    "0.5 percent of the true B at the binding chart; looseness at " +
    "rho = e^6 collapses 3.957 -> 1.084). Every-octave onsets " +
    "unchanged. The pointwise pencil-floor program is EFFECTIVELY " +
    "TERMINAL. Changes no bound; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (self-contained, import-light; verbatim
// conventions of imp-95330/95331/95332/95333)
// ---------------------------------------------------------------------------

const PI = Math.PI;
const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, a) => (2 * PI) / a / Math.cosh((PI * w) / a);

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
function pencilSymbolMin(theta, a, b) {
  const s = sechHalf(b);
  const A = 1 - s * s;
  const { fa, br, C } = symbols(theta, a, b);
  const Bp = fa - s * br;
  return C / (Bp + Math.sqrt(Math.max(Bp * Bp - A * C, 0)));
}
function gridInfRefined(a, b, Ngrid) {
  let inf = Infinity;
  let thBest = 0;
  for (let i = 0; i <= Ngrid; i++) {
    const th = -PI + (2 * PI * i) / Ngrid;
    const v = pencilSymbolMin(th, a, b);
    if (v < inf) {
      inf = v;
      thBest = th;
    }
  }
  let lo = thBest - (2 * PI) / Ngrid;
  let hi = thBest + (2 * PI) / Ngrid;
  for (let round = 0; round < 3; round++) {
    let best = Infinity;
    let tb = lo;
    for (let i = 0; i <= 200; i++) {
      const th = lo + ((hi - lo) * i) / 200;
      const v = pencilSymbolMin(th, a, b);
      if (v < best) {
        best = v;
        tb = th;
      }
    }
    inf = Math.min(inf, best);
    const w = (hi - lo) / 200;
    lo = tb - w;
    hi = tb + w;
  }
  return inf;
}

// imp-95288 base + imp-95329 per-term weight and uniform tail (verbatim)
function baseConstants(a) {
  const c = Math.cosh(a / 2);
  const pi2 = PI * PI;
  const kap = (4 * c) / (a * a);
  const e2 = Math.exp((-2 * pi2) / a);
  const e3 = Math.exp((-3 * pi2) / a);
  const tA = (((8 * PI) / a) * e3) / (1 - e2);
  const tQ = (((200 * PI ** 3) / a) * e3) / (1 - 4 * e2);
  return { kap, tA, tQ };
}
function pen3Constants(a) {
  const { kap, tA, tQ } = baseConstants(a);
  const kap2 = 4 / (a * a);
  const cAlpha = 2 / (1 + sechHalf(a));
  const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + kap2 * w * w);
  const c3n = cAlpha * tA + Math.min(kap * tQ, 2 * tA + kap2 * tQ);
  return { tw, c3n, kap, kap2, cAlpha };
}
const sideSum = (th, a) => kernelP(2 * PI - th, a) + kernelP(2 * PI + th, a);

// imp-95330 chart floor (verbatim) -- retained chartwise in the max
function chartV4(a, t0, t1) {
  const { tw, c3n } = pen3Constants(a);
  const P1 = kernelP(t1, a);
  const S0 = sideSum(t0, a);
  return (4 * P1 * S0) / (tw(t1) * P1 + tw(2 * PI + t1) * S0 + c3n);
}
// imp-95331 split-weight exact-root chart floor (verbatim) -- retained
function chartPsi5(a, t0, t1, mu) {
  const { tw, c3n } = pen3Constants(a);
  const X = kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
  const T =
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3n;
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}
// imp-95332 per-chart tail cap (verbatim, split into sum + remainder)
function c3nChartParts(a, t0, t1, N = 12) {
  const { tw, kap, kap2, cAlpha } = pen3Constants(a);
  let s = 0;
  for (let m = 2; m <= N; m++) {
    s += tw(2 * PI * m + t1) * kernelP(2 * PI * m + t0, a);
    s += tw(2 * PI * m - t0) * kernelP(2 * PI * m - t1, a);
  }
  const pi2 = PI * PI;
  const e2 = Math.exp((-2 * pi2) / a);
  const eA = Math.exp((-(2 * N + 1) * pi2) / a);
  const tAr = (((8 * PI) / a) * eA) / (1 - e2);
  const tQr = (((8 * (2 * N + 3) ** 2 * PI ** 3) / a) * eA) / (1 - 4 * e2);
  const rem = cAlpha * tAr + Math.min(kap * tQr, 2 * tAr + kap2 * tQr);
  return { s, rem };
}
function chartT6(a, t0, t1, N = 12) {
  const { tw } = pen3Constants(a);
  const { s, rem } = c3nChartParts(a, t0, t1, N);
  return (
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    s +
    rem
  );
}
// imp-95332 chart floor (verbatim) -- retained
function chartPsi6(a, t0, t1, mu, N = 12) {
  const X = kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
  const T = chartT6(a, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}
// imp-95333 kept-pair aggregates and chart floor (verbatim) -- retained
function chartXY7(a, t0, t1) {
  const P0 = kernelP(t1, a);
  const Pm1 = kernelP(2 * PI - t0, a);
  const Pp1 = kernelP(2 * PI + t1, a);
  const Pm2 = kernelP(4 * PI - t0, a);
  const Pp2 = kernelP(4 * PI + t1, a);
  const X7 = P0 * (Pm1 + Pp1) + Pm2 * Pm1 + Pp1 * Pp2;
  const Y7 = Pm1 * Pp1 + P0 * (Pm2 + Pp2);
  return { X7, Y7 };
}
function chartPsi7(a, t0, t1, mu, nu, N = 12) {
  const { X7, Y7 } = chartXY7(a, t0, t1);
  const Xeff = X7 + nu * Y7;
  const T = chartT6(a, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * Xeff, 0);
  return (4 * Xeff) / (T / 2 + Math.sqrt(disc));
}

// LEMMA T-EXACT (this module): interval cosine minimum and b-exact weight
function minCosOver(x0, x1) {
  const j0 = Math.ceil((x0 / PI - 1) / 2);
  const crit = (2 * j0 + 1) * PI;
  if (crit <= x1) return -1;
  return Math.min(Math.cos(x0), Math.cos(x1));
}
function t8weight(a, b, u0, u1) {
  const tau = b / a;
  const s = sechHalf(b);
  const A = 1 - s * s;
  const mc = minCosOver(u0 * tau, u1 * tau);
  return (2 * (1 - s * mc)) / A;
}
// THEOREM RZ-PEN8 per-chart trace majorant: per-term min(t8, t3-charge)
function chartT8(a, b, t0, t1, N = 12) {
  const { tw } = pen3Constants(a);
  let T =
    Math.min(t8weight(a, b, t0, t1), tw(t1)) * kernelP(t0, a) +
    Math.min(t8weight(a, b, 2 * PI - t1, 2 * PI - t0), tw(2 * PI - t0)) *
      kernelP(2 * PI - t1, a) +
    Math.min(t8weight(a, b, 2 * PI + t0, 2 * PI + t1), tw(2 * PI + t1)) *
      kernelP(2 * PI + t0, a);
  for (let m = 2; m <= N; m++) {
    T +=
      Math.min(t8weight(a, b, 2 * PI * m + t0, 2 * PI * m + t1), tw(2 * PI * m + t1)) *
      kernelP(2 * PI * m + t0, a);
    T +=
      Math.min(t8weight(a, b, 2 * PI * m - t1, 2 * PI * m - t0), tw(2 * PI * m - t0)) *
      kernelP(2 * PI * m - t1, a);
  }
  const { rem } = c3nChartParts(a, t0, t1, N);
  return T + rem;
}
function chartPsi8(a, b, t0, t1, mu, nu, N = 12) {
  const { X7, Y7 } = chartXY7(a, t0, t1);
  const Xeff = X7 + nu * Y7;
  const T = chartT8(a, b, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * Xeff, 0);
  return (4 * Xeff) / (T / 2 + Math.sqrt(disc));
}

const prefactor = (a, b) =>
  Math.sin(PI * (b / a)) ** 2 / Math.tanh(b / 2) ** 2;
const nuExact = (a, b) => 4 * Math.cos(PI * (b / a)) ** 2;

function w7Scan(a, mu, nu, K = 256, N = 12) {
  let worst = Infinity;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v = Math.max(
      chartV4(a, t0, t1),
      chartPsi5(a, t0, t1, mu),
      chartPsi6(a, t0, t1, mu, N),
      chartPsi7(a, t0, t1, mu, nu, N),
    );
    if (v < worst) worst = v;
  }
  return worst;
}
function w8Scan(a, b, mu, nu, K = 256, N = 12) {
  let worst = Infinity;
  let kBind = -1;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v = Math.max(
      chartV4(a, t0, t1),
      chartPsi5(a, t0, t1, mu),
      chartPsi6(a, t0, t1, mu, N),
      chartPsi7(a, t0, t1, mu, nu, N),
      chartPsi8(a, b, t0, t1, mu, nu, N),
    );
    if (v < worst) {
      worst = v;
      kBind = k;
    }
  }
  return { W: worst, kBind };
}
const aPen7 = (a, b) =>
  prefactor(a, b) * w7Scan(a, prefactor(a, b), nuExact(a, b));
const aPen8 = (a, b) =>
  prefactor(a, b) * w8Scan(a, b, prefactor(a, b), nuExact(a, b)).W;

// finite-matrix pencil machinery (imp-95331/95332/95333 conventions, verbatim)
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95334 chol: base not PD");
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
const transpose = (A) => A[0].map((_, j) => A.map((row) => row[j]));
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

// SPLIT onset re-bracketing on the dyadic skeleton (imp-95227 coalLaw)
const coalLaw = (x) =>
  Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
function certNumerator(x) {
  let s = 0;
  for (let k = 0; k < 60; k++) s += coalLaw(2 ** k * x);
  return s;
}
const A_BLK_REF = 1.344996021179e-11; // imp-95252 A_blk(2, 1.3)

const REC = IMP95334_B_EXACT_TRACE_PENCIL_FLOOR;
const T8R = REC.theoremRzPen8;
const OBS = REC.bUniformObstruction;

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95334_ASSERTIONS = [
  {
    id: "imp95334-trace-identity",
    description:
      "LEMMA T-EXACT (i): the per-term identity tr M = sum of " +
      "2 (1 - s cos(w_n tau)) / A P(w_n) matches alpha + beta " +
      "computed from the plus-minus basis directly, to rel 1e-12, at " +
      "sampled (rho, r, theta)",
    holds: () => {
      for (const [a, b] of [
        [6, Math.LN2],
        [Math.LN2, Math.log(1.3)],
        [Math.log(10), Math.LN2],
      ]) {
        const tau = b / a;
        const s = sechHalf(b);
        const A = 1 - s * s;
        for (const th of [0.1, 1.0, 2.2, 3.0]) {
          const { fa, br } = symbols(th, a, b);
          const alpha = (fa + br) / (1 + s);
          const beta = (fa - br) / (1 - s);
          let direct = 0;
          for (let n = -14; n <= 14; n++) {
            const w = th + 2 * PI * n;
            direct +=
              ((2 * (1 - s * Math.cos(w * tau))) / A) * kernelP(w, a);
          }
          if (Math.abs(direct / (alpha + beta) - 1) > 1e-12) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95334-interval-cos-min",
    description:
      "LEMMA T-EXACT (ii): minCosOver agrees with a dense 2001-point " +
      "interval minimum (within float slack, never above it) for " +
      "intervals straddling and avoiding odd multiples of pi",
    holds: () => {
      const cases = [
        [0.1, 0.2],
        [0.0, 3.0],
        [2.9, 3.3],
        [3.2, 6.0],
        [6.0, 6.4],
        [9.1, 9.6],
        [15.6, 15.8],
        [0.0, 40.0],
        [21.9, 22.0],
      ];
      for (const [x0, x1] of cases) {
        let dense = Infinity;
        for (let i = 0; i <= 2000; i++) {
          dense = Math.min(dense, Math.cos(x0 + ((x1 - x0) * i) / 2000));
        }
        const mc = minCosOver(x0, x1);
        if (mc > dense + 1e-12) return false;
        if (dense - mc > 1e-6 && mc !== -1) return false;
      }
      return true;
    },
  },
  {
    id: "imp95334-trace-cap-validity",
    description:
      "trace-cap truth: (A/2) T8_k >= B_true at 11-point in-chart " +
      "grids over 9 charts x 8 (rho, r) cells including both " +
      "coalescence ends, and near-attained at the rho = e^6 binding " +
      "chart (Bup8/Btrue in [1, 1.01] there)",
    holds: () => {
      for (const [a, b] of [
        [6, Math.LN2],
        [6, 3],
        [6, 5.9],
        [Math.log(10), Math.LN2],
        [Math.LN2, Math.log(1.3)],
        [Math.LN2, Math.log(1.05)],
        [Math.log(2.5), Math.log(2.49771)],
        [Math.log(4), Math.LN2],
      ]) {
        const s = sechHalf(b);
        const A = 1 - s * s;
        for (const k of [0, 40, 63, 100, 114, 128, 180, 200, 255]) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          const Bup = (A / 2) * chartT8(a, b, t0, t1);
          for (let i = 0; i <= 10; i++) {
            const th = t0 + ((t1 - t0) * i) / 10;
            const { fa, br } = symbols(th, a, b);
            if (Bup < fa - s * br) return false;
          }
        }
      }
      const a = 6;
      const b = Math.LN2;
      const s = sechHalf(b);
      const A = 1 - s * s;
      const kB = w8Scan(a, b, prefactor(a, b), nuExact(a, b)).kBind;
      if (kB !== T8R.bindingChartRhoE6) return false;
      const t0 = (PI * kB) / 256;
      const t1 = (PI * (kB + 1)) / 256;
      const th = (t0 + t1) / 2;
      const { fa, br } = symbols(th, a, b);
      const ratio8 = ((A / 2) * chartT8(a, b, t0, t1)) / (fa - s * br);
      const ratio6 = ((A / 2) * chartT6(a, t0, t1)) / (fa - s * br);
      return ratio8 >= 1 && ratio8 <= 1.01 && ratio6 >= 2.1;
    },
  },
  {
    id: "imp95334-floor-literals-and-dominance",
    description:
      "recomputed floors match the baked literals to rel 1e-12, " +
      "A_pen8 >= A_pen7 on the sampled grid with T8 <= T6 at every " +
      "sampled chart, the gains match (3.651 / 3.185 / 2.242 at " +
      "rho = e^6, 1.285 at rho = 10, 1.064 at rho = 4), and " +
      "aPen7(e^6, 2) recomputed here matches the imp-95333 baked " +
      "value (convention lock)",
    holds: () => {
      const rel = (x, y) => Math.abs(x / y - 1);
      if (rel(aPen8(6, Math.LN2), T8R.aPen8RhoE6R2) > 1e-12) return false;
      if (rel(aPen8(6, 3), T8R.aPen8RhoE6Re3) > 1e-12) return false;
      if (rel(aPen8(6, 5.9), T8R.aPen8RhoE6Re59) > 1e-12) return false;
      if (rel(aPen8(Math.log(10), Math.LN2), T8R.aPen8Rho10R2) > 1e-12)
        return false;
      if (rel(aPen8(Math.log(4), Math.LN2), T8R.aPen8Rho4R2) > 1e-12)
        return false;
      if (rel(aPen8(Math.LN2, Math.log(1.3)), T8R.aPen8Rho2R13) > 1e-12)
        return false;
      if (rel(aPen8(Math.LN2, Math.log(1.05)), T8R.aPen8Rho2R105) > 1e-12)
        return false;
      if (rel(aPen7(6, Math.LN2), T8R.aPen7RhoE6R2Ref) > 1e-9) return false;
      if (rel(aPen8(6, Math.LN2) / aPen7(6, Math.LN2), T8R.gainRhoE6R2) > 1e-9)
        return false;
      if (
        rel(
          aPen8(Math.log(10), Math.LN2) / aPen7(Math.log(10), Math.LN2),
          T8R.gainRho10R2,
        ) > 1e-9
      )
        return false;
      for (const [a, b] of [
        [Math.LN2, Math.log(1.3)],
        [Math.log(4), Math.LN2],
        [Math.log(10), Math.LN2],
        [6, Math.LN2],
        [6, 3],
        [6, 5.9],
        [Math.log(2.5), Math.log(2.49771)],
      ]) {
        if (!(aPen8(a, b) >= aPen7(a, b) * (1 - 1e-14))) return false;
        for (let k = 0; k < 256; k += 17) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          if (chartT8(a, b, t0, t1) > chartT6(a, t0, t1) * (1 + 1e-14))
            return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95334-symbol-scan-validity",
    description:
      "exact-symbol scans (2001 points + 3 refinement rounds) stay at " +
      "or above A_pen8 at eight (rho, r) cells including both " +
      "coalescence ends, and the looseness ledger matches the baked " +
      "values to rel 1e-6",
    holds: () => {
      const rel = (x, y) => Math.abs(x / y - 1);
      const cells = [
        [6, Math.LN2, T8R.loosenessRhoE6R2],
        [6, 3, T8R.loosenessRhoE6Re3],
        [6, 5.9, T8R.loosenessRhoE6Re59],
        [Math.log(10), Math.LN2, T8R.loosenessRho10R2],
        [Math.LN2, Math.log(1.3), T8R.loosenessRho2R13],
        [Math.log(4), Math.LN2, null],
        [Math.LN2, Math.log(1.05), null],
        [Math.log(2.5), Math.log(2.49771), null],
      ];
      for (const [a, b, loose] of cells) {
        const inf = gridInfRefined(a, b, 2001);
        const p8 = aPen8(a, b);
        if (!(inf >= p8)) return false;
        if (loose !== null && rel(inf / p8, loose) > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95334-matrix-pencil-floor",
    description:
      "matrix level: lam_min of the finite pencil (Gtilde_2m, " +
      "blockdiag G0) >= A_pen8 at rho = 10 (m in {4, 6}, r in " +
      "{2, 3.1}), rho = e^6 (m in {3, 4}, r = 2), and rho = 2 (m = 6, " +
      "r = 1.3)",
    holds: () => {
      for (const [rho, r, ms] of [
        [10, 2, [4, 6]],
        [10, 3.1, [4, 6]],
        [Math.exp(6), 2, [3, 4]],
        [2, 1.3, [6]],
      ]) {
        const bound = aPen8(Math.log(rho), Math.log(r));
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
    id: "imp95334-onsets-unchanged",
    description:
      "onset honesty: rho = 2 floors are bitwise-level unchanged " +
      "(rel 1e-13 vs A_pen7, and at the rho = 2 binding chart the " +
      "carried V4 floor strictly exceeds Psi8), and the carried " +
      "onsets still bracket 1 under the PEN8 denominators",
    holds: () => {
      const a2 = Math.LN2;
      for (const r of [1.3, 1.05]) {
        const b = Math.log(r);
        if (Math.abs(aPen8(a2, b) / aPen7(a2, b) - 1) > 1e-13) return false;
      }
      const b13 = Math.log(1.3);
      const mu = prefactor(a2, b13);
      const nu = nuExact(a2, b13);
      let worst = Infinity;
      let kB = -1;
      for (let k = 0; k < 256; k++) {
        const t0 = (PI * k) / 256;
        const t1 = (PI * (k + 1)) / 256;
        const v = Math.max(
          chartV4(a2, t0, t1),
          chartPsi5(a2, t0, t1, mu),
          chartPsi6(a2, t0, t1, mu),
          chartPsi7(a2, t0, t1, mu, nu),
          chartPsi8(a2, b13, t0, t1, mu, nu),
        );
        if (v < worst) {
          worst = v;
          kB = k;
        }
      }
      const t0 = (PI * kB) / 256;
      const t1 = (PI * (kB + 1)) / 256;
      if (!(chartV4(a2, t0, t1) > chartPsi8(a2, b13, t0, t1, mu, nu)))
        return false;
      const cert = (x, r) =>
        certNumerator(x) / Math.max(aPen8(a2, Math.log(r)), A_BLK_REF);
      const O = REC.onsetsUnchanged;
      if (!(cert(O.xStarR13 - 1e-3, 1.3) > 1)) return false;
      if (!(cert(O.xStarR13 + 1e-3, 1.3) < 1)) return false;
      if (!(cert(O.xStarR105 - 1e-3, 1.05) > 1)) return false;
      if (!(cert(O.xStarR105 + 1e-3, 1.05) < 1)) return false;
      return true;
    },
  },
  {
    id: "imp95334-b-uniform-obstruction",
    description:
      "obstruction measurement: the branch-L (tau <= 3/8) restricted " +
      "BCAP sup of ratio/cap on a 200 x 400 (w, b) grid is >= 0.998 " +
      "at a = ln 2 and >= 0.99 at a = ln 4 (no b-uniform headroom at " +
      "onset scale) and <= 0.92 at a = 6 (uniform-side headroom " +
      "exists only at large a); the cap itself is never exceeded",
    holds: () => {
      const supL = (a) => {
        let sup = 0;
        for (let iw = 1; iw <= 200; iw++) {
          const w = (4 * PI * iw) / 200;
          const cap = 2 + (4 * w * w) / (a * a);
          for (let ib = 1; ib <= 400; ib++) {
            const b = (a * 0.5 * ib) / 400;
            const tau = b / a;
            if (tau > 0.375) continue;
            const ratio = (1 - Math.cos(w * tau)) / (1 - sechHalf(b));
            if (ratio > cap * (1 + 1e-12)) return Infinity;
            sup = Math.max(sup, ratio / cap);
          }
        }
        return sup;
      };
      const sLn2 = supL(Math.LN2);
      const sLn4 = supL(Math.log(4));
      const s6 = supL(6);
      if (!(sLn2 >= 0.998 && sLn2 <= 1)) return false;
      if (!(sLn4 >= 0.99 && sLn4 <= 1)) return false;
      if (!(s6 <= 0.92)) return false;
      if (Math.abs(sLn2 - OBS.supBranchLALn2) > 5e-4) return false;
      if (Math.abs(s6 - OBS.supBranchLA6) > 5e-4) return false;
      return true;
    },
  },
  {
    id: "imp95334-monotone-and-refinement",
    description:
      "Psi8 is nondecreasing in mu at fixed nu and in nu at fixed mu " +
      "at the binding chart, K = 1024 and K = 4096 do not fall below " +
      "the K = 256 floor at rho = e^6, and the K-refinement headroom " +
      "matches the baked ledger (1.0195 / 1.0231) to 1e-4",
    holds: () => {
      const a = 6;
      const b = Math.LN2;
      const t0b = (PI * 255) / 256;
      const t1b = PI;
      let prev = -Infinity;
      for (let i = 1; i <= 12; i++) {
        const v = chartPsi8(a, b, t0b, t1b, i * 0.05, 2.0);
        if (v < prev - 1e-15) return false;
        prev = v;
      }
      prev = -Infinity;
      for (let i = 0; i <= 12; i++) {
        const v = chartPsi8(a, b, t0b, t1b, 0.4, i * 0.35);
        if (v < prev - 1e-15) return false;
        prev = v;
      }
      const mu = prefactor(a, b);
      const nu = nuExact(a, b);
      const w256 = w8Scan(a, b, mu, nu, 256).W;
      const w1024 = w8Scan(a, b, mu, nu, 1024).W;
      const w4096 = w8Scan(a, b, mu, nu, 4096).W;
      if (!(w1024 >= w256 * (1 - 1e-12))) return false;
      if (!(w4096 >= w256 * (1 - 1e-12))) return false;
      if (Math.abs(w1024 / w256 - T8R.k1024OverK256RhoE6) > 1e-4)
        return false;
      if (Math.abs(w4096 / w256 - T8R.k4096OverK256RhoE6) > 1e-4)
        return false;
      return true;
    },
  },
  {
    id: "imp95334-honesty-gate",
    description:
      "the verdict decides the ticket both ways (b-uniform OBSTRUCTED " +
      "at onset scale, pointwise EXECUTED and EXHAUSTED), records " +
      "unchanged onsets, declares the pointwise program effectively " +
      "terminal, keeps floors-only scope; promotes no bound, NO QED, " +
      "no refereed bound is changed",
    holds: () =>
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /OBSTRUCTED at onset scale/.test(REC.verdict) &&
      /EXECUTED and EXHAUSTED/.test(REC.verdict) &&
      /EFFECTIVELY\s+TERMINAL/.test(REC.verdict) &&
      /Changes no bound/.test(REC.verdict) &&
      /onsets\s+unchanged/i.test(REC.verdict) &&
      /certificate onsets unchanged/.test(REC.honestScope) &&
      /pointwise only/.test(REC.honestScope) &&
      /A_unif8 = A_unif7/.test(OBS.aUnif8Note) &&
      /off-lattice rates/.test(REC.pointwiseProgramTerminal) &&
      REC.onsetsUnchanged.xStarUniform === 13.297836,
  },
];

for (const a of IMP95334_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95334-b-exact-trace-pencil-floor assertion failed: ${a.id}`,
    );
  }
}

export default IMP95334_B_EXACT_TRACE_PENCIL_FLOOR;
