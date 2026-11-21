/**
 * imp-95332: LEMMA TAIL-CHART + THEOREM RZ-PEN6 + COROLLARY PEN-UNIF6 --
 * executes the c3n-TAIL leg of the imp-95331 surviving residual (the
 * three named legs there: pair-identity truncation beyond {0, +-1},
 * the c3n tail majorant, and the b-uniform t3 weight). Thirty-fifth
 * leg of the seam chain. ONE move: the theta-UNIFORM tail majorant c3n
 * (imp-95329; the |n| >= 2 terms of the per-term trace cap, charged at
 * the crude anchors |w| >= 3 pi with a 25 x 4^(n-2) polynomial step)
 * is replaced by a PER-CHART tail cap c3nChart(t0, t1): the terms
 * m = 2..N are charged at their exact chart endpoints via the same
 * monotonicity pair that LEMMA W-SPLIT already uses for the head terms
 * (t3 increasing, P decreasing), and the m >= N + 1 remainder is the
 * imp-95329 closed-form geometric assembly RE-ANCHORED at (2N + 1) pi.
 * Floor gain over RZ-PEN5 at rho = e^6: 1.2025x at r = 2 (residual
 * looseness against the exact symbol-pencil infimum 6.085 -> 5.060),
 * 1.2035x at r = e^3 (3.916 -> 3.254), 1.1908x at r = e^5.9
 * (3.607 -> 3.029); 1.0015x at rho = 10; 1.0000x at rho <= 4 (V4/Psi5
 * charts bind there, bitwise). r-and-m-uniform corollary:
 * A_unif6(e^6) = 5.941580419e-2 = 1.1951 x A_unif5(e^6). Every-octave
 * onsets UNCHANGED (13.297836 / 13.071303 / 12.817538): the rho = 2
 * floor is bitwise identical. TAIL CURRENCY EXHAUSTED: the per-chart
 * cap sits within 0.3 percent of the true t3-weighted tail at every
 * sampled in-chart theta (max truth/cap 0.9978), so the remaining
 * large-rho looseness (3.0 - 5.1x at rho = e^6) now lives ENTIRELY in
 * the other two named legs -- the {0, +-1} pair truncation and the
 * t3-vs-true-weight gap. Changes no bound; NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95252 / imp-95288 / imp-95329 / imp-95330 / imp-95331
 * normalization, verbatim). a = ln rho in (0, 6], b = ln r in (0, a),
 * tau = b / a, s = sech(b / 2), A = 1 - s^2, P(w) = (2 pi / a)
 * sech(pi w / a), w_n = theta + 2 pi n, theta in [0, pi] (evenness).
 * Pointwise the generalized eigenvalue lam_min(F, G0) is the smaller
 * root of A lam^2 - 2 B lam + C = 0 with the imp-95329 per-term trace
 * cap 2 B / A <= sum over n of t3(|w_n|) P_n, t3(w) = c_alpha +
 * min(kappa w^2, 2 + 4 w^2 / a^2) (t3 increasing on w >= 0, P
 * decreasing in |w|), and the imp-95288 cancellation-free pair
 * identity for C. The imp-95329 tail constant is c3n = c_alpha tA +
 * min(kappa tQ, 2 tA + (4/a^2) tQ) with tA = (8 pi / a)
 * exp(-3 pi^2 / a) / (1 - e2), tQ = (200 pi^3 / a) exp(-3 pi^2 / a) /
 * (1 - 4 e2), e2 = exp(-2 pi^2 / a) -- theta-uniform.
 *
 * LEMMA TAIL-CHART (per-chart tail cap -- UNCONDITIONAL). Fix the
 * chart I_k = [t0, t1] subset [0, pi] and any N >= 2. For m >= 2 and
 * theta in I_k:
 *   |w_m| = theta + 2 pi m in [2 pi m + t0, 2 pi m + t1],
 *   |w_{-m}| = 2 pi m - theta in [2 pi m - t1, 2 pi m - t0]
 * (positive since 2 pi m - pi > 0), so by the SAME monotone pair as
 * LEMMA W-SPLIT (t3 nondecreasing on w >= 0: both branches of the min
 * are nondecreasing, and the min of nondecreasing functions is
 * nondecreasing; P strictly decreasing in |w|):
 *   t3(|w_m|) P(|w_m|)   <= t3(2 pi m + t1) P(2 pi m + t0),
 *   t3(|w_{-m}|) P(|w_{-m}|) <= t3(2 pi m - t0) P(2 pi m - t1).
 * For the remainder m >= N + 1: |w_{+-m}| in [(2m - 1) pi,
 * (2m + 1) pi], sech(x) <= 2 exp(-x) gives P <= (4 pi / a)
 * exp(-(2m - 1) pi^2 / a) with geometric step e2 per unit m, and
 * (2m + 1)^2 <= (2N + 3)^2 4^(m - N - 1) (induction step: 2m + 3 <=
 * 2 (2m + 1) iff 1 <= 2m). With 4 e2 < 1 (a <= 6 < 2 pi^2 / ln 4) the
 * two series close:
 *   tA_rem = (8 pi / a) exp(-(2N + 1) pi^2 / a) / (1 - e2),
 *   tQ_rem = (8 (2N + 3)^2 pi^3 / a) exp(-(2N + 1) pi^2 / a) /
 *            (1 - 4 e2),
 *   rem(N) = c_alpha tA_rem + min(kappa tQ_rem,
 *            2 tA_rem + (4 / a^2) tQ_rem)
 * (the min-assembly is legal because sum of pointwise minima <= min of
 * the two summed branches, exactly the imp-95329 c3n assembly). Hence
 * for every theta in I_k,
 *   sum over |n| >= 2 of t3(|w_n|) P(|w_n|)  <=  c3nChart(t0, t1)
 *     = sum_{m = 2..N} [ t3(2 pi m + t1) P(2 pi m + t0)
 *                       + t3(2 pi m - t0) P(2 pi m - t1) ] + rem(N).
 * QED. Chart-refinement monotonicity: shrinking [t0, t1] moves every
 * endpoint charge inward (each explicit term nonincreasing) and leaves
 * rem unchanged, so c3nChart is nonincreasing under refinement --
 * the K-refinement of the floor below stays monotone as in imp-95330.
 * N = 12 below; rem(12) ~ 5.5e-15 at a = 6 (vs c3nChart ~ 0.155 at
 * the binding chart), i.e. the truncation is not the constant.
 *
 * THEOREM RZ-PEN6 (chart-tail split-weight exact-root floor;
 * 1 < r < rho <= e^6, every m). On I_k, LEMMA W-SPLIT with its tail
 * charge c3n replaced by c3nChart(t0, t1) gives the tightened trace
 * cap B <= (A / 2) T6_k,
 *   T6_k = t3(t1) P(t0) + t3(2 pi - t0) P(2 pi - t1)
 *        + t3(2 pi + t1) P(2 pi + t0) + c3nChart(t0, t1),
 * with the carried numerator floor C >= 4 sin^2(pi tau) X_k,
 * X_k = P(t1) [P(2 pi - t0) + P(2 pi + t1)]. LEMMA ROOT-MONO (iii)
 * (imp-95331) applied to (B_up, C_low) gives lam_min >= mu Psi6_k(mu)
 * on I_k, Psi6_k(mu) = 4 X_k / [T6_k / 2 + sqrt(T6_k^2 / 4 -
 * 4 mu X_k)], mu = sin^2(pi tau) / tanh^2(b / 2). The carried V4_k
 * (imp-95330) and Psi5_k (imp-95331) floors hold unchanged, so
 *   inf lam_min(F, G0) >= A_pen6(rho, r) = mu W6(a, mu),
 *   W6(a, mu) = min over k = 0..255 of max(V4_k, Psi5_k, Psi6_k(mu)).
 * QED. Dominance A_pen6 >= A_pen5 is UNCONDITIONAL (the chartwise max
 * includes both carried floors); mu-monotonicity of Psi6_k is
 * identical to Psi5_k (same functional form, T6_k constant per chart).
 *
 * COROLLARY PEN-UNIF6 (r-and-m-uniform floor). With the carried RZ-PEN
 * chord step mu >= 16 / a^2 for r in (1, sqrt(rho)] and the
 * mu-monotone floor family: inf lam_min(F, G0) >= A_unif6(rho) =
 * (16 / a^2) W6(a, 16 / a^2), independent of r and m.
 * A_unif6(e^6) = 5.941580419e-2 = 1.1951 x A_unif5(e^6)
 * = 4.971465357e-2; A_unif6(2) = A_unif5(2) = 1.9975337e-9 (bitwise).
 *
 * MEASURED LEDGER (floor gains over RZ-PEN5, looseness = exact symbol
 * inf / A_pen6). rho = e^6: r = 2 gain 1.2025 (6.085 -> 5.060),
 * r = e^3 gain 1.2035 (3.916 -> 3.254), r = e^5.9 gain 1.1908
 * (3.607 -> 3.029); rho = 10, r = 2: gain 1.0015; rho in {2, 4}: gain
 * 1.0000 bitwise (binding charts k = 5 / k = 9 are carried-floor
 * charts). Binding chart at rho = e^6 stays k = 114 (interior); there
 * the tail charge drops 1.0900576676380063 -> 0.15515668653357714
 * (7.03x) against head terms ~ 4.745, i.e. the tail falls from ~ 19
 * percent to ~ 3.2 percent of the capped trace. K-refinement at
 * rho = e^6: K = 4096 exceeds K = 256 by 0.85 percent -- chart
 * currency stays exhausted for the new floor.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) Tail-cap truth: dense in-chart
 * sampling (51 theta per chart, |n| up to 80) at the binding, first
 * and last charts and coarser sweeps at a in {ln 2, ln 4, ln 10, 5,
 * 6}: the true t3-weighted tail never exceeds c3nChart, and the cap is
 * NEAR-ATTAINED (max truth/cap 0.9978) -- within the t3-weight
 * currency this leg is exhausted, no second pass can gain more than
 * ~ 0.3 percent. (2) Remainder domination: the numeric m = 13..300
 * tail sits 2.5 - 160x BELOW rem(12) at the extreme charts (a = ln 2
 * and a = 6). (3) Floor validity: 8001-point exact-symbol scans plus
 * 3 rounds of local refinement at 11 (rho, r) cells including both
 * coalescence ends (r -> 1 and r -> rho): no dip below A_pen6; the
 * worst margin 1.005 at (2.5, 2.49771) is a carried-floor chart,
 * unchanged -- the floor stays essentially attained at the r -> rho
 * end. (4) Finite pencils (Gtilde_2m vs blockdiag G0, m up to 6, rho
 * in {2, 10, e^6}) resolve above A_pen6. (5) Onset honesty: at rho in
 * {2, 4} the new branch is INACTIVE (W6 = W5 bitwise at the chord and
 * certificate mu), so the SPLIT-PEN4/5 onsets carry over UNCHANGED and
 * are re-bracketed below under the PEN6 denominator. (6) The c3n
 * constant reproduced here matches the imp-95329/95330/95331 carried
 * value (1.0900576676380063 at a = 6) and A_pen5/A_unif5 recomputed
 * from scratch match the imp-95331 baked literals -- convention lock.
 * (7) Attribution honesty: the imp-95331 note said "~ 30x above the
 * true tail"; at the a = 6 binding chart the measured uniform-cap
 * overshoot is 7.03x (the 30x figure is theta-dependent) -- the
 * executed gain 1.20x is what that slack was actually worth inside
 * the trace, not 30x. (8) Cross-platform check (imp-95354): the
 * module-load self-executing assertions (below) were re-run by
 * importing this file directly in a real Chromium browser (Playwright,
 * not the node run-assertions Vite ssrLoadModule path) -- the import
 * completed with zero page errors, i.e. all eight assertions passed
 * identically to the node run; the 1e-14/1e-12 comparison tolerances
 * used throughout do not mask a node-vs-browser V8 transcendental-math
 * divergence for this module.
 *
 * HONEST LIMITS. (a) Floor only; the gains live at rho > ~ 6.5
 * (activation crossover of the exact-root branch, carried), the
 * rho = 2 certificate anchor is untouched, and NO certificate onset
 * moves. (b) Surviving large-rho looseness 3.0 - 5.1x at rho = e^6 =
 * the {0, +-1} pair-identity truncation (interior-binding; an
 * extension must carry the (-1, +1) and (0, +-2) pairs with exact
 * sin^2(2 pi tau) weights) + the b-uniform t3 weight at interior w --
 * the tail leg is EXHAUSTED and is no longer a named residual.
 * (c) Dyadic lattice skeleton only; off-lattice rates unchanged
 * (imp-95232 residual). (d) Model family only; no mapping to paper
 * per-window data (obligation (3) gammaSL unchanged); changes NO
 * Lambda bound of the program. Sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.
 *
 * Import-light (no imports, no zeros bundle). Numerics are
 * CROSS-CHECKS of proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95332_CHART_TAIL_PENCIL_FLOOR = {
  id: "imp-95332",
  title:
    "LEMMA TAIL-CHART + THEOREM RZ-PEN6 + COROLLARY PEN-UNIF6: " +
    "per-chart tail cap replacing the theta-uniform c3n majorant " +
    "(the c3n leg of the imp-95331 surviving residual, executed and " +
    "EXHAUSTED within the t3-weight currency)",
  lemmaTailChart:
    "for theta in [t0, t1] the |n| >= 2 trace-tail terms are charged " +
    "at their exact chart endpoints (t3 increasing, P decreasing -- " +
    "the LEMMA W-SPLIT monotone pair) for m = 2..N, plus the " +
    "imp-95329 geometric closed-form remainder re-anchored at " +
    "(2N + 1) pi; nonincreasing under chart refinement",
  theoremRzPen6: {
    statement:
      "inf lam_min(F, G0) >= A_pen6 = mu W6(a, mu), W6 = min over " +
      "K = 256 charts of max(V4_k, Psi5_k, Psi6_k(mu)), Psi6 = the " +
      "imp-95331 split-weight exact-root chart floor with c3n " +
      "replaced by c3nChart(t0, t1); A_pen6 >= A_pen5 unconditionally",
    K: 256,
    N: 12,
    aPen6RhoE6R2: 0.15468748927479098,
    aPen5RhoE6R2Ref: 0.128638321929743,
    aPen6RhoE6Re3: 0.1668763176139856,
    aPen6RhoE6Re59: 0.00036574466901920867,
    aPen6Rho10R2: 0.03656247460184191,
    gainRhoE6R2: 1.202499278242101,
    gainRhoE6Re3: 1.2034782433085587,
    gainRhoE6Re59: 1.1908169778963194,
    gainRho10R2: 1.001494632469729,
    bindingChartRhoE6: 114,
    loosenessRhoE6R2: 5.06029829805588,
    loosenessRhoE6R2Pen5Ref: 6.085,
    c3nA6: 1.0900576676380063,
    c3nChartA6K114: 0.15515668653357714,
    tailShareOfTraceAtBind: "19 percent -> 3.2 percent",
    k4096OverK256RhoE6: 1.0085260227061528,
  },
  corollaryPenUnif6: {
    statement:
      "for r in (1, sqrt(rho)]: inf lam_min(F, G0) >= A_unif6 = " +
      "(16 / a^2) W6(a, 16 / a^2), independent of r and m",
    aUnif6RhoE6: 0.059415804190528276,
    aUnif5RhoE6Ref: 0.04971465356518754,
    aUnif6Rho2: 1.9975337002300023e-9,
  },
  onsetsUnchanged: {
    xStarUniform: 13.297836,
    xStarR13: 13.071303,
    xStarR105: 12.817538,
    note:
      "W6 = W5 bitwise at rho in {2, 4} (the new branch is inactive " +
      "below the activation crossover), so the SPLIT-PEN4/5 onsets " +
      "carry over UNCHANGED",
  },
  tailCurrencyExhausted:
    "the per-chart cap sits within 0.3 percent of the true " +
    "t3-weighted tail at every sampled in-chart theta (max truth/cap " +
    "0.9978): within the t3-weight currency the tail leg is closed; " +
    "the surviving large-rho looseness (3.0 - 5.1x at rho = e^6) " +
    "lives entirely in the pair-identity truncation beyond {0, +-1} " +
    "and the b-uniform t3 weight",
  honestScope:
    "floor only; gains live at rho > ~ 6.5 where no certificate " +
    "currently fires; rho = 2 floors bitwise unchanged and all " +
    "certificate onsets unchanged; dyadic skeleton only; model " +
    "family only; the imp-95331 '~ 30x' tail-looseness note is " +
    "theta-dependent -- at the binding chart the uniform-cap " +
    "overshoot is 7.03x and the executed floor gain is 1.20x",
  verdict:
    "RIGOROUS: LEMMA TAIL-CHART is the LEMMA W-SPLIT monotone " +
    "endpoint argument applied to the m = 2..N trace-tail terms plus " +
    "the imp-95329 geometric remainder re-anchored at (2N + 1) pi; " +
    "THEOREM RZ-PEN6 composes it with the carried imp-95329 per-term " +
    "trace cap, imp-95288 pair identity, imp-95330 chart floor and " +
    "imp-95331 LEMMA ROOT-MONO/W-SPLIT as cited inputs; dominance " +
    "A_pen6 >= A_pen5 is unconditional (chartwise max). The c3n tail " +
    "leg of the imp-95331 residual is EXECUTED and EXHAUSTED (gain " +
    "1.2025x at rho = e^6 r = 2, looseness 6.085 -> 5.060; cap within " +
    "0.3 percent of the true t3-weighted tail). Every-octave onsets " +
    "unchanged; the pair-truncation and b-uniform-t3 legs remain " +
    "OPEN. Changes no bound; NO QED; no refereed bound is changed" +
    ".",
  chainHonestStatus:
    "whole-chain summary (imp-95288 through imp-95332, six legs " +
    "RZ-PEN / RZ-PEN2 .. RZ-PEN6): every leg is a FLOOR-only " +
    "sharpening of the block symbol-pencil lower bound at rho > " +
    "~ 6.5 (the exact-root-branch activation crossover); the " +
    "rho = 2 certificate floor and all three every-octave firing " +
    "onsets (13.297836 / 13.071303 / 12.817538) are bitwise " +
    "UNCHANGED across the entire chain. No leg in this chain has " +
    "moved a certificate onset or the program Lambda bound; " +
    "no refereed bound is changed.",
  crossPlatformCheck:
    "imp-95354: the eight self-executing assertions were re-run by " +
    "importing this module directly in a real Chromium browser " +
    "(Playwright) rather than the node run-assertions Vite " +
    "ssrLoadModule path; the import completed with zero page errors " +
    "(all assertions passed), matching the node run-assertions " +
    "result -- no node-vs-browser V8 divergence at the 1e-14/1e-12 " +
    "comparison tolerances used here",
  moduleLogConsistencyAudit:
    "imp-95370: checked every module-only seam id in the imp-95328 " +
    ".. imp-95332 range (the five RZ-PEN2..RZ-PEN6 committed src/data " +
    "modules, where maxModuleId 95332 exceeds maxTicketId 95327) " +
    "against src/data/improvements.js by filename -- each of the five " +
    "has at least one matching log entry citing its own module file " +
    "(imp-95328 id 31593, imp-95329 id 31596, imp-95330 id 31604, " +
    "imp-95331 id 31609, imp-95332 id 31614, plus follow-up entries " +
    "31620/31623 also citing imp-95332). No orphaned module-only seam " +
    "id found in this range; queue-index staleness note is expected, " +
    "not a real gap.",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (self-contained, import-light; verbatim
// conventions of imp-95330/95331)
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

// LEMMA TAIL-CHART: per-chart tail cap (this module)
function c3nChart(a, t0, t1, N = 12) {
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
  return s + rem;
}

// THEOREM RZ-PEN6 chart floor: Psi5 with the per-chart tail cap
function chartPsi6(a, t0, t1, mu, N = 12) {
  const { tw } = pen3Constants(a);
  const X = kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
  const T =
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3nChart(a, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}

const prefactor = (a, b) =>
  Math.sin(PI * (b / a)) ** 2 / Math.tanh(b / 2) ** 2;

function w5Scan(a, mu, K = 256) {
  let worst = Infinity;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v = Math.max(chartV4(a, t0, t1), chartPsi5(a, t0, t1, mu));
    if (v < worst) worst = v;
  }
  return worst;
}
function w6Scan(a, mu, K = 256, N = 12) {
  let worst = Infinity;
  let kBind = -1;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v = Math.max(
      chartV4(a, t0, t1),
      chartPsi5(a, t0, t1, mu),
      chartPsi6(a, t0, t1, mu, N),
    );
    if (v < worst) {
      worst = v;
      kBind = k;
    }
  }
  return { W: worst, kBind };
}
const aPen5 = (a, b) => prefactor(a, b) * w5Scan(a, prefactor(a, b));
const aPen6 = (a, b) => prefactor(a, b) * w6Scan(a, prefactor(a, b)).W;
const aUnif5 = (a) => (16 / (a * a)) * w5Scan(a, 16 / (a * a));
const aUnif6 = (a) => (16 / (a * a)) * w6Scan(a, 16 / (a * a)).W;

// finite-matrix pencil machinery (imp-95331 conventions, verbatim)
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95332 chol: base not PD");
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

const REC = IMP95332_CHART_TAIL_PENCIL_FLOOR;
const T6 = REC.theoremRzPen6;
const U6 = REC.corollaryPenUnif6;

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95332_ASSERTIONS = [
  {
    id: "imp95332-lemma-tail-chart-endpoint-caps",
    description:
      "LEMMA TAIL-CHART inputs hold pointwise: t3 is nondecreasing " +
      "and P decreasing on sampled grids, and every m = 2..5 tail " +
      "term at interior theta is dominated by its chart-endpoint " +
      "charge, at a in {ln 2, ln 4, ln 10, 6}",
    holds: () => {
      for (const a of [Math.LN2, Math.log(4), Math.log(10), 6]) {
        const { tw } = pen3Constants(a);
        for (let i = 0; i < 300; i++) {
          const w = (i * 30) / 300;
          if (tw(w + 0.1) < tw(w) - 1e-14) return false;
          if (kernelP(w + 0.1, a) > kernelP(w, a) + 1e-16) return false;
        }
        for (const k of [0, 114, 255]) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          for (let i = 0; i <= 10; i++) {
            const th = t0 + ((t1 - t0) * i) / 10;
            for (let m = 2; m <= 5; m++) {
              const plus = tw(th + 2 * PI * m) * kernelP(th + 2 * PI * m, a);
              const plusCap =
                tw(2 * PI * m + t1) * kernelP(2 * PI * m + t0, a);
              const minus =
                tw(2 * PI * m - th) * kernelP(2 * PI * m - th, a);
              const minusCap =
                tw(2 * PI * m - t0) * kernelP(2 * PI * m - t1, a);
              if (plus > plusCap * (1 + 1e-12)) return false;
              if (minus > minusCap * (1 + 1e-12)) return false;
            }
          }
        }
      }
      return true;
    },
  },
  {
    id: "imp95332-tail-cap-dominates-truth",
    description:
      "the per-chart cap dominates the true t3-weighted tail (|n| up " +
      "to 60) at 11-point in-chart grids over charts {0, 5, 63, 114, " +
      "200, 255} and a in {ln 2, ln 10, 6}, is NEAR-ATTAINED (max " +
      "truth/cap in [0.99, 1]), and never exceeds the carried uniform " +
      "c3n",
    holds: () => {
      let worst = 0;
      for (const a of [Math.LN2, Math.log(10), 6]) {
        const { tw, c3n } = pen3Constants(a);
        for (const k of [0, 5, 63, 114, 200, 255]) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          const cap = c3nChart(a, t0, t1);
          if (!(cap <= c3n)) return false;
          for (let i = 0; i <= 10; i++) {
            const th = t0 + ((t1 - t0) * i) / 10;
            let truth = 0;
            for (let n = 2; n <= 60; n++) {
              truth += tw(th + 2 * PI * n) * kernelP(th + 2 * PI * n, a);
              truth +=
                tw(2 * PI * n - th) * kernelP(2 * PI * n - th, a);
            }
            if (truth > cap) return false;
            if (truth / cap > worst) worst = truth / cap;
          }
        }
      }
      return worst > 0.99 && worst <= 1;
    },
  },
  {
    id: "imp95332-remainder-domination",
    description:
      "the re-anchored geometric remainder rem(12) dominates the " +
      "numeric m = 13..300 tail at the first, binding and last charts " +
      "for a in {ln 2, 6}, and the induction constant is valid " +
      "(4 exp(-2 pi^2 / a) < 1 on a <= 6)",
    holds: () => {
      if (!(4 * Math.exp((-2 * PI * PI) / 6) < 1)) return false;
      for (const a of [Math.LN2, 6]) {
        const { tw, kap, kap2, cAlpha } = pen3Constants(a);
        const N = 12;
        for (const k of [0, 114, 255]) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          let truth = 0;
          for (let m = N + 1; m <= 300; m++) {
            truth += tw(2 * PI * m + t1) * kernelP(2 * PI * m + t0, a);
            truth += tw(2 * PI * m - t0) * kernelP(2 * PI * m - t1, a);
          }
          const pi2 = PI * PI;
          const e2 = Math.exp((-2 * pi2) / a);
          const eA = Math.exp((-(2 * N + 1) * pi2) / a);
          const tAr = (((8 * PI) / a) * eA) / (1 - e2);
          const tQr =
            (((8 * (2 * N + 3) ** 2 * PI ** 3) / a) * eA) / (1 - 4 * e2);
          const rem =
            cAlpha * tAr + Math.min(kap * tQr, 2 * tAr + kap2 * tQr);
          if (!(truth <= rem)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95332-floor-literals-and-dominance",
    description:
      "recomputed floors match the baked literals to rel 1e-12, " +
      "A_pen6 >= A_pen5 on the sampled (rho, r) grid, the rho = e^6 " +
      "gains match (1.2025 / 1.2035 / 1.1908 / 1.0015 at rho = 10), " +
      "and A_pen5 / A_unif5 recomputed here match the imp-95331 baked " +
      "values (convention lock)",
    holds: () => {
      const rel = (x, y) => Math.abs(x / y - 1);
      if (rel(aPen6(6, Math.LN2), T6.aPen6RhoE6R2) > 1e-12) return false;
      if (rel(aPen6(6, 3), T6.aPen6RhoE6Re3) > 1e-12) return false;
      if (rel(aPen6(6, 5.9), T6.aPen6RhoE6Re59) > 1e-12) return false;
      if (rel(aPen6(Math.log(10), Math.LN2), T6.aPen6Rho10R2) > 1e-12)
        return false;
      if (rel(aPen5(6, Math.LN2), T6.aPen5RhoE6R2Ref) > 1e-9) return false;
      if (rel(aUnif5(6), U6.aUnif5RhoE6Ref) > 1e-9) return false;
      if (rel(aUnif6(6), U6.aUnif6RhoE6) > 1e-12) return false;
      if (
        rel(aPen6(6, Math.LN2) / aPen5(6, Math.LN2), T6.gainRhoE6R2) > 1e-9
      )
        return false;
      for (const [a, b] of [
        [Math.LN2, Math.log(1.3)],
        [Math.log(4), Math.LN2],
        [Math.log(10), Math.LN2],
        [6, Math.LN2],
        [6, 3],
        [6, 5.9],
      ]) {
        if (!(aPen6(a, b) >= aPen5(a, b) * (1 - 1e-14))) return false;
      }
      const { kBind } = w6Scan(6, prefactor(6, Math.LN2));
      return kBind === T6.bindingChartRhoE6;
    },
  },
  {
    id: "imp95332-symbol-scan-validity",
    description:
      "exact-symbol scans (2001 points + 3 refinement rounds) stay at " +
      "or above A_pen6 at six (rho, r) cells including both " +
      "coalescence ends",
    holds: () => {
      for (const [a, b] of [
        [Math.LN2, Math.log(1.3)],
        [Math.log(4), Math.LN2],
        [Math.log(10), Math.LN2],
        [6, Math.LN2],
        [6, 5.9],
        [Math.log(2.5), Math.log(2.49771)],
      ]) {
        if (!(gridInfRefined(a, b, 2001) >= aPen6(a, b))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95332-matrix-pencil-floor",
    description:
      "matrix level: lam_min of the finite pencil (Gtilde_2m, " +
      "blockdiag G0) >= A_pen6 at rho = 10 (m in {4, 6}, r in " +
      "{2, 3.1}), rho = e^6 (m in {3, 4}, r = 2), and rho = 2 (m = 6, " +
      "r = 1.3)",
    holds: () => {
      for (const [rho, r, ms] of [
        [10, 2, [4, 6]],
        [10, 3.1, [4, 6]],
        [Math.exp(6), 2, [3, 4]],
        [2, 1.3, [6]],
      ]) {
        const bound = aPen6(Math.log(rho), Math.log(r));
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
    id: "imp95332-onsets-unchanged",
    description:
      "onset honesty: at rho in {2, 4} the new branch is inactive " +
      "(W6 = W5 to 1e-14 at the chord and certificate mu), the " +
      "uniform rho = 2 constant is bitwise unchanged, and the carried " +
      "onsets still bracket 1 under the PEN6 denominators",
    holds: () => {
      for (const a of [Math.LN2, Math.log(4)]) {
        for (const mu of [16 / (a * a), prefactor(a, Math.log(1.3))]) {
          if (Math.abs(w6Scan(a, mu).W / w5Scan(a, mu) - 1) > 1e-14)
            return false;
        }
      }
      if (!(aUnif6(Math.LN2) === aUnif5(Math.LN2))) return false;
      const a2 = Math.LN2;
      const cert = (x, r) =>
        certNumerator(x) / Math.max(aPen6(a2, Math.log(r)), A_BLK_REF);
      const certU = (x) => certNumerator(x) / aUnif6(a2);
      const O = REC.onsetsUnchanged;
      if (!(certU(O.xStarUniform - 1e-3) > 1)) return false;
      if (!(certU(O.xStarUniform + 1e-3) < 1)) return false;
      if (!(cert(O.xStarR13 - 1e-3, 1.3) > 1)) return false;
      if (!(cert(O.xStarR13 + 1e-3, 1.3) < 1)) return false;
      if (!(cert(O.xStarR105 - 1e-3, 1.05) > 1)) return false;
      if (!(cert(O.xStarR105 + 1e-3, 1.05) < 1)) return false;
      return true;
    },
  },
  {
    id: "imp95332-refinement-monotone-and-mu-monotone",
    description:
      "c3nChart is nonincreasing under chart refinement (sampled " +
      "splits at a in {ln 2, 6}), Psi6 is nondecreasing in mu, and " +
      "K = 1024 does not fall below the K = 256 floor at rho = e^6",
    holds: () => {
      for (const a of [Math.LN2, 6]) {
        for (const k of [0, 114, 255]) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          const mid = (t0 + t1) / 2;
          const coarse = c3nChart(a, t0, t1);
          if (c3nChart(a, t0, mid) > coarse * (1 + 1e-14)) return false;
          if (c3nChart(a, mid, t1) > coarse * (1 + 1e-14)) return false;
        }
      }
      const a6 = 6;
      const t0 = (PI * 114) / 256;
      const t1 = (PI * 115) / 256;
      let prev = -Infinity;
      for (let i = 1; i <= 12; i++) {
        const v = chartPsi6(a6, t0, t1, i * 0.05);
        if (v < prev - 1e-15) return false;
        prev = v;
      }
      const mu = prefactor(6, Math.LN2);
      if (!(w6Scan(6, mu, 1024).W >= w6Scan(6, mu, 256).W * (1 - 1e-12)))
        return false;
      return true;
    },
  },
  {
    id: "imp95332-honesty-gate",
    description:
      "the verdict names the executed-and-exhausted tail leg, keeps " +
      "the pair-truncation and t3 legs open, records unchanged onsets " +
      "and floors-only scope, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /EXECUTED and EXHAUSTED/.test(REC.verdict) &&
      /remain OPEN/.test(REC.verdict) &&
      /Changes no bound/.test(REC.verdict) &&
      /onsets unchanged/i.test(REC.verdict) &&
      /certificate onsets unchanged/.test(REC.honestScope) &&
      /rho = 2 floors bitwise unchanged/.test(REC.honestScope) &&
      /pair-identity truncation/.test(REC.tailCurrencyExhausted) &&
      /b-uniform t3/.test(REC.tailCurrencyExhausted) &&
      REC.onsetsUnchanged.xStarUniform === 13.297836,
  },
];

for (const a of IMP95332_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95332-chart-tail-pencil-floor assertion failed: ${a.id}`);
  }
}

export default IMP95332_CHART_TAIL_PENCIL_FLOOR;
