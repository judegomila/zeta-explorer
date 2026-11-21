/**
 * imp-95333: LEMMA PAIR-2 + THEOREM RZ-PEN7 + COROLLARY PEN-UNIF7 --
 * executes the PAIR-TRUNCATION leg of the imp-95331/imp-95332 surviving
 * residual, exactly as the imp-95331 routing note specified: "an
 * extension must carry the (-1, +1) and (0, +-2) pairs with exact
 * sin^2(2 pi tau) weights". Thirty-sixth leg of the seam chain. ONE
 * move: the kept-pair numerator floor C_low = 4 sin^2(pi tau) X_k
 * (pairs {0, +-1} only, imp-95331 LEMMA W-SPLIT) is extended to ALL
 * distance-1 and distance-2 unordered pairs among the shells
 * n in {-2, ..., 2}: the consecutive outer pairs {-2, -1} and {+1, +2}
 * join X_k at the SAME weight sin^2(pi tau), and the distance-2 pairs
 * {-1, +1}, {0, -2}, {0, +2} enter at the exact weight sin^2(2 pi tau)
 * = 4 sin^2(pi tau) cos^2(pi tau), so the extension is carried by a
 * SECOND monotone parameter nu = 4 cos^2(pi tau) alongside mu -- no new
 * currency, the same LEMMA ROOT-MONO exact-root floor. Floor gain over
 * RZ-PEN6 at rho = e^6: 1.2788x at r = 2 (residual looseness against
 * the exact symbol-pencil infimum 5.060 -> 3.957), 1.3040x at r =
 * e^5.9 (2.32); at r = e^3 (tau = 1/2) the distance-2 weight vanishes
 * IDENTICALLY (sin^2(2 pi tau) = 0) and only the consecutive outer
 * pairs act (1.0066x). rho in {2, 4} floors bitwise unchanged, so
 * every-octave onsets carry UNCHANGED (13.297836 / 13.071303 /
 * 12.817538). r-and-m-uniform corollary via a two-branch tau split at
 * tau0 = 3/8: A_unif7(e^6) = 6.242874427e-2 = 1.0507 x A_unif6.
 * PAIR CURRENCY NEAR-EXHAUSTED at the binding chart: keeping EVERY
 * pair of the imp-95288 identity at the true theta would raise the
 * numerator by at most 2.8 percent more (measured C_true / C_low =
 * 1.0280 at the binding chart k = 114, rho = e^6, r = 2), while the
 * capped trace overshoots the true B by 2.449x there -- the surviving
 * large-rho looseness (2.3 - 4.0x) now lives DOMINANTLY in the
 * b-uniform t3 weight, the last named leg. Changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * OBJECT (imp-95252 / imp-95288 / imp-95329 / imp-95330 / imp-95331 /
 * imp-95332 normalization, verbatim). a = ln rho in (0, 6], b = ln r
 * in (0, a), tau = b / a, s = sech(b / 2), A = 1 - s^2 =
 * tanh^2(b / 2), P(w) = (2 pi / a) sech(pi w / a), w_n = theta +
 * 2 pi n, theta in [0, pi] (evenness). Pointwise, lam_min(F, G0) is
 * the smaller root of A lam^2 - 2 B lam + C = 0 with the imp-95329
 * per-term trace cap for B (t3 increasing, P decreasing), the
 * imp-95332 per-chart tail cap c3nChart, and the imp-95288
 * cancellation-free pair identity
 *   C = sum over ordered pairs i != j of 2 sin^2(pi |i - j| tau)
 *       P_i P_j   (every term nonnegative).
 *
 * LEMMA PAIR-2 (extended kept-pair numerator floor -- UNCONDITIONAL).
 * Fix the chart I_k = [t0, t1] subset [0, pi]. For theta in I_k the
 * five shell kernels obey the endpoint lower bounds (P even, strictly
 * decreasing in |w|; the argument ranges are monotone images of
 * [t0, t1]):
 *   P_0 = P(theta)          >= P(t1),
 *   P_{-1} = P(2 pi - theta) >= P(2 pi - t0),
 *   P_{+1} = P(2 pi + theta) >= P(2 pi + t1),
 *   P_{-2} = P(4 pi - theta) >= P(4 pi - t0),
 *   P_{+2} = P(4 pi + theta) >= P(4 pi + t1).
 * Keeping in the pair identity exactly the unordered pairs at
 * distance 1 ({-2,-1}, {-1,0}, {0,+1}, {+1,+2}, weight
 * 4 sin^2(pi tau) each) and distance 2 ({-1,+1}, {0,-2}, {0,+2},
 * weight 4 sin^2(2 pi tau) each), and discarding the rest (all
 * nonnegative), gives for every theta in I_k:
 *   C >= 4 sin^2(pi tau) X7_k + 4 sin^2(2 pi tau) Y7_k,
 *   X7_k = P(t1) [P(2 pi - t0) + P(2 pi + t1)]
 *        + P(4 pi - t0) P(2 pi - t0) + P(2 pi + t1) P(4 pi + t1),
 *   Y7_k = P(2 pi - t0) P(2 pi + t1)
 *        + P(t1) [P(4 pi - t0) + P(4 pi + t1)].
 * With the double-angle identity sin^2(2 pi tau) = 4 sin^2(pi tau)
 * cos^2(pi tau) and nu = 4 cos^2(pi tau) >= 0 this is
 *   C >= C_low = 4 sin^2(pi tau) [X7_k + nu Y7_k].
 * QED. X7_k >= X_k termwise, so the floor dominates the imp-95331
 * kept-pair floor for every nu >= 0. Refinement monotonicity:
 * shrinking [t0, t1] raises every endpoint kernel lower bound, so
 * X7_k and Y7_k are nondecreasing under chart refinement.
 *
 * THEOREM RZ-PEN7 (pair-extended chart floor; 1 < r < rho <= e^6,
 * every m). On I_k, with the carried imp-95332 trace cap B <= B_up =
 * (A / 2) T6_k and LEMMA PAIR-2's C_low, LEMMA ROOT-MONO (iii)
 * (imp-95331) gives, via the same A-scaling identity as RZ-PEN5
 * (q = sin^2(pi tau), mu = q / A):
 *   lam_min(theta) >= mu Psi7_k(mu, nu),
 *   Psi7_k(mu, nu) = 4 (X7_k + nu Y7_k) /
 *     [T6_k / 2 + sqrt(T6_k^2 / 4 - 4 mu (X7_k + nu Y7_k))].
 * The carried V4_k (imp-95330), Psi5_k (imp-95331), Psi6_k (imp-95332)
 * floors hold unchanged, so with the EXACT per-(rho, r) values
 * mu = sin^2(pi tau) / tanh^2(b / 2), nu = 4 cos^2(pi tau):
 *   inf lam_min(F, G0) >= A_pen7(rho, r) = mu W7(a, mu, nu),
 *   W7(a, mu, nu) = min over k = 0..255 of
 *     max(V4_k, Psi5_k, Psi6_k(mu), Psi7_k(mu, nu)).
 * QED. Dominance A_pen7 >= A_pen6 is UNCONDITIONAL (the chartwise max
 * includes the carried floors; also Psi7 >= Psi6 pointwise since
 * X7 >= X and nu >= 0). Monotonicity: Psi7 is nondecreasing in mu at
 * fixed nu and nondecreasing in nu at fixed mu (numerator increasing,
 * discriminant decreasing -- LEMMA ROOT-MONO), and if mu_low <= mu and
 * nu_low <= nu then C >= 4 mu_low A (X7 + nu_low Y7), so
 * mu_low Psi7_k(mu_low, nu_low) is a valid floor -- the substitution
 * pair (B up, C down) stays in-domain automatically.
 *
 * COROLLARY PEN-UNIF7 (r-and-m-uniform floor; two-branch tau split at
 * tau0 = 3/8). For r in (1, sqrt(rho)], tau in (0, 1/2]:
 *   branch L (tau <= 3/8): mu >= 16 / a^2 (carried RZ-PEN chord) and
 *     nu = 4 cos^2(pi tau) >= 4 cos^2(3 pi / 8) = 2 - sqrt(2)
 *     (cos^2 decreasing on [0, 1/2]);
 *   branch H (3/8 <= tau <= 1/2): sin^2(pi tau) >= sin^2(3 pi / 8) =
 *     (2 + sqrt(2)) / 4 and tanh^2(a tau / 2) <= tanh^2(a / 4), so
 *     mu >= muH = (2 + sqrt(2)) / (4 tanh^2(a / 4)), with nu >= 0.
 * Each branch floor is valid on its sub-range by the monotone floor
 * family, so their minimum is r-uniform, and taking the max with the
 * carried A_unif6 keeps dominance unconditional:
 *   inf lam_min(F, G0) >= A_unif7(rho) = max(A_unif6(rho),
 *     min((16 / a^2) W7(a, 16 / a^2, 2 - sqrt(2)),
 *         muH W7(a, muH, 0))),  independent of r and m.
 * A_unif7(e^6) = 6.242874427e-2 = 1.0507 x A_unif6(e^6) (branch L
 * binds; branch H = 1.426e-1); A_unif7(2) = A_unif6(2) bitwise.
 *
 * MEASURED LEDGER (floor gains over RZ-PEN6, looseness = exact symbol
 * inf / A_pen7). rho = e^6: r = 2 gain 1.2788 (looseness 5.060 ->
 * 3.957), r = e^3 gain 1.0066 (tau = 1/2: the distance-2 weight is
 * identically zero, only the consecutive outer pairs act), r = e^5.9
 * gain 1.3040 (3.029 -> 2.323); rho = 10, r = 2: gain 1.0005; rho in
 * {2, 4} and the coalescence cell (2.5, 2.49771): gain 1.0000 bitwise
 * (carried-floor charts bind). Binding chart at rho = e^6 stays
 * k = 114 (interior). K-refinement at rho = e^6: K = 4096 exceeds
 * K = 256 by 0.88 percent -- chart currency stays exhausted.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) Pair-floor truth: C_low <= C at
 * 11-point in-chart grids over charts {0, 63, 114, 200, 255} and six
 * (rho, r) cells including both coalescence ends; the floor is
 * NEAR-ATTAINED (max C_low / C = 0.9926). (2) Exhaustion measurement:
 * at the binding chart (k = 114, rho = e^6, r = 2) the FULL pair
 * identity at the true theta exceeds C_low by only 1.0280x -- within
 * the numerator currency at this chart, at most 2.8 percent remains;
 * no further kept-pair extension can move the large-rho floor
 * materially. The capped trace B_up / B_true = 2.449 at the same
 * chart: the residual slack has MOVED to the b-uniform t3 weight.
 * (3) Vanishing-weight honesty: at tau = 1/2 (r = sqrt(rho)) the
 * distance-2 weight sin^2(2 pi tau) is identically zero -- the
 * extension is NOT uniformly active in r; the uniform corollary
 * handles this with the branch split, and the measured branch-H floor
 * exceeds branch L at every sampled a. (4) Floor validity: 2001-point
 * exact-symbol scans + 3 rounds of local refinement at seven (rho, r)
 * cells including both coalescence ends: no dip below A_pen7; the
 * r-uniform A_unif7 stays below the exact inf at 7 sampled tau in
 * (0, 1/2] for rho in {2, 10, e^6}. (5) Finite pencils (Gtilde_2m vs
 * blockdiag G0, m up to 6, rho in {2, 10, e^6}) resolve above A_pen7.
 * (6) Branch validity: mu(tau) >= chord and nu(tau) >= 2 - sqrt(2) on
 * (0, 3/8], mu(tau) >= muH on [3/8, 1/2], sampled at 500 tau points
 * for a in {ln 2, ln 4, ln 10, 5, 6}. (7) Onset honesty: at rho in
 * {2, 4} W7 = W6 to machine precision at the chord and certificate mu
 * (the outer-shell kernels are ~ e^(-28) relative there), so the
 * every-octave onsets carry UNCHANGED and are re-bracketed below
 * under the PEN7 denominators. (8) Convention lock: A_pen6 / A_unif6
 * recomputed from scratch match the imp-95332 baked literals.
 *
 * HONEST LIMITS. (a) Floor only; the gains live at rho > ~ 6.5 where
 * no certificate currently fires; the rho = 2 certificate anchor is
 * untouched and NO onset moves. (b) The pair-truncation leg is
 * executed and NEAR-EXHAUSTED (<= 2.8 percent numerator headroom at
 * the binding chart); the surviving large-rho looseness (2.3 - 4.0x
 * at rho = e^6) lives dominantly in the b-uniform t3 weight at
 * interior w (trace overshoot 2.449x at the binding chart) -- the
 * LAST named leg of the imp-95330 numerator-currency residual chain.
 * (c) At tau = 1/2 exactly, only the consecutive outer pairs act
 * (gain 1.0066 at rho = e^6): the distance-2 extension cannot help
 * the twin-symmetric point by construction. (d) Dyadic lattice
 * skeleton only; off-lattice rates unchanged (imp-95232 residual).
 * (e) Model family only; no mapping to paper per-window data
 * (obligation (3) gammaSL unchanged); changes NO Lambda bound of the
 * program. Sub-gap imp-95212-subgap-fresnel-airy-envelope-port STILL
 * OPEN.
 *
 * Import-light (no imports, no zeros bundle). Numerics are
 * CROSS-CHECKS of proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95333_PAIR_EXTENDED_PENCIL_FLOOR = {
  id: "imp-95333",
  title:
    "LEMMA PAIR-2 + THEOREM RZ-PEN7 + COROLLARY PEN-UNIF7: kept-pair " +
    "extension to all distance-1 and distance-2 pairs among shells " +
    "{-2..2} with exact sin^2(2 pi tau) weights (the pair-truncation " +
    "leg of the imp-95331/imp-95332 surviving residual, executed and " +
    "NEAR-EXHAUSTED)",
  lemmaPair2:
    "C >= 4 sin^2(pi tau) [X7_k + nu Y7_k] with nu = 4 cos^2(pi tau), " +
    "X7_k = X_k + P(4 pi - t0) P(2 pi - t0) + P(2 pi + t1) " +
    "P(4 pi + t1), Y7_k = P(2 pi - t0) P(2 pi + t1) + P(t1) " +
    "[P(4 pi - t0) + P(4 pi + t1)]; endpoint kernel lower bounds, " +
    "discarded pairs nonnegative, double-angle identity exact",
  theoremRzPen7: {
    statement:
      "inf lam_min(F, G0) >= A_pen7 = mu W7(a, mu, nu), W7 = min over " +
      "K = 256 charts of max(V4_k, Psi5_k, Psi6_k(mu), Psi7_k(mu, " +
      "nu)), Psi7 = the exact-root floor at (B_up = (A/2) T6_k, C_low " +
      "of LEMMA PAIR-2); A_pen7 >= A_pen6 unconditionally",
    K: 256,
    N: 12,
    aPen7RhoE6R2: 0.19781181502689443,
    aPen6RhoE6R2Ref: 0.15468748927479098,
    aPen7RhoE6Re3: 0.16797540941897807,
    aPen7RhoE6Re59: 0.0004769262098916684,
    aPen7Rho10R2: 0.0365816049741462,
    gainRhoE6R2: 1.278783539342967,
    gainRhoE6Re3: 1.0065862659286073,
    gainRhoE6Re59: 1.3039867707999881,
    gainRho10R2: 1.000523224221353,
    bindingChartRhoE6: 114,
    loosenessRhoE6R2: 3.957118732272573,
    loosenessRhoE6R2Pen6Ref: 5.06029829805588,
    cTrueOverClowBind: 1.028,
    bUpOverBTrueBind: 2.449,
    k4096OverK256RhoE6: 1.0087928479650619,
  },
  corollaryPenUnif7: {
    statement:
      "two-branch tau split at tau0 = 3/8: A_unif7 = max(A_unif6, " +
      "min((16/a^2) W7(a, 16/a^2, 2 - sqrt(2)), muH W7(a, muH, 0))), " +
      "muH = (2 + sqrt(2)) / (4 tanh^2(a/4)); independent of r and m",
    tau0: 0.375,
    nu0: 0.5857864376269052,
    aUnif7RhoE6: 0.062428744267702896,
    aUnif6RhoE6Ref: 0.059415804190528276,
    aUnif7Rho10: 0.018554908403263588,
    aUnif7Rho2: 1.9975337002300023e-9,
    gainUnifRhoE6: 1.0507094049844556,
    gainUnifRho10: 1.0002227646621427,
    branchHRhoE6: 0.14261159947482954,
  },
  onsetsUnchanged: {
    xStarUniform: 13.297836,
    xStarR13: 13.071303,
    xStarR105: 12.817538,
    note:
      "W7 = W6 to machine precision at rho in {2, 4} (outer-shell " +
      "kernels ~ e^(-28) relative there), so the SPLIT-PEN4/5/6 " +
      "onsets carry over UNCHANGED",
  },
  pairCurrencyNearExhausted:
    "at the binding chart (k = 114, rho = e^6, r = 2) the full " +
    "imp-95288 pair identity at the true theta exceeds the kept-pair " +
    "floor by only 1.0280x, while the capped trace overshoots the " +
    "true B by 2.449x: the surviving large-rho looseness (2.3 - 4.0x) " +
    "lives dominantly in the b-uniform t3 weight, the last named leg",
  honestScope:
    "floor only; gains live at rho > ~ 6.5 where no certificate " +
    "currently fires; rho = 2 floors bitwise unchanged and all " +
    "certificate onsets unchanged; at tau = 1/2 the distance-2 " +
    "weight vanishes identically (gain 1.0066 at rho = e^6, r = e^3); " +
    "dyadic skeleton only; model family only",
  verdict:
    "RIGOROUS: LEMMA PAIR-2 keeps seven explicitly named nonnegative " +
    "pairs of the imp-95288 cancellation-free identity with endpoint " +
    "kernel lower bounds (the imp-95331 LEMMA W-SPLIT monotone pair) " +
    "and the exact double-angle weight sin^2(2 pi tau) = 4 sin^2(pi " +
    "tau) cos^2(pi tau); THEOREM RZ-PEN7 composes it with the carried " +
    "imp-95332 trace cap via LEMMA ROOT-MONO; COROLLARY PEN-UNIF7 " +
    "splits tau at 3/8 with closed-form branch constants. Dominance " +
    "A_pen7 >= A_pen6 is unconditional. The pair-truncation leg is " +
    "EXECUTED and NEAR-EXHAUSTED (gain 1.2788x at rho = e^6 r = 2, " +
    "looseness 5.060 -> 3.957; at most 2.8 percent numerator headroom " +
    "remains at the binding chart); the b-uniform t3-weight leg " +
    "remains OPEN and now carries the residual. Every-octave onsets " +
    "unchanged. Changes no bound; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (self-contained, import-light; verbatim
// conventions of imp-95330/95331/95332)
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
// imp-95332 per-chart tail cap (verbatim) -- retained
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
function chartT6(a, t0, t1, N = 12) {
  const { tw } = pen3Constants(a);
  return (
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3nChart(a, t0, t1, N)
  );
}
// imp-95332 chart floor (verbatim) -- retained
function chartPsi6(a, t0, t1, mu, N = 12) {
  const X = kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
  const T = chartT6(a, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}

// LEMMA PAIR-2 kept-pair aggregates (this module)
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
// THEOREM RZ-PEN7 chart floor: exact root at (B_up, C_low of PAIR-2)
function chartPsi7(a, t0, t1, mu, nu, N = 12) {
  const { X7, Y7 } = chartXY7(a, t0, t1);
  const Xeff = X7 + nu * Y7;
  const T = chartT6(a, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * Xeff, 0);
  return (4 * Xeff) / (T / 2 + Math.sqrt(disc));
}

const prefactor = (a, b) =>
  Math.sin(PI * (b / a)) ** 2 / Math.tanh(b / 2) ** 2;
const nuExact = (a, b) => 4 * Math.cos(PI * (b / a)) ** 2;

function w6Scan(a, mu, K = 256, N = 12) {
  let worst = Infinity;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v = Math.max(
      chartV4(a, t0, t1),
      chartPsi5(a, t0, t1, mu),
      chartPsi6(a, t0, t1, mu, N),
    );
    if (v < worst) worst = v;
  }
  return worst;
}
function w7Scan(a, mu, nu, K = 256, N = 12) {
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
    );
    if (v < worst) {
      worst = v;
      kBind = k;
    }
  }
  return { W: worst, kBind };
}
const aPen6 = (a, b) => prefactor(a, b) * w6Scan(a, prefactor(a, b));
const aPen7 = (a, b) =>
  prefactor(a, b) * w7Scan(a, prefactor(a, b), nuExact(a, b)).W;
const aUnif6 = (a) => (16 / (a * a)) * w6Scan(a, 16 / (a * a));
const TAU0 = 3 / 8;
function aUnif7(a) {
  const nu0 = 4 * Math.cos(PI * TAU0) ** 2; // = 2 - sqrt(2)
  const branchL = (16 / (a * a)) * w7Scan(a, 16 / (a * a), nu0).W;
  const muH = Math.sin(PI * TAU0) ** 2 / Math.tanh(a / 4) ** 2;
  const branchH = muH * w7Scan(a, muH, 0).W;
  return Math.max(aUnif6(a), Math.min(branchL, branchH));
}

// finite-matrix pencil machinery (imp-95331/95332 conventions, verbatim)
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95333 chol: base not PD");
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

const REC = IMP95333_PAIR_EXTENDED_PENCIL_FLOOR;
const T7 = REC.theoremRzPen7;
const U7 = REC.corollaryPenUnif7;

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95333_ASSERTIONS = [
  {
    id: "imp95333-pair-floor-pointwise",
    description:
      "LEMMA PAIR-2 holds pointwise: the double-angle identity is " +
      "exact, and C_low = 4 sin^2(pi tau) [X7 + nu Y7] never exceeds " +
      "the full pair-identity C at 11-point in-chart grids over " +
      "charts {0, 63, 114, 200, 255} and six (rho, r) cells including " +
      "both coalescence ends; near-attained (max C_low / C in " +
      "[0.98, 1])",
    holds: () => {
      let worst = 0;
      for (const [a, b] of [
        [6, Math.LN2],
        [6, 3],
        [6, 5.9],
        [Math.log(10), Math.LN2],
        [Math.LN2, Math.log(1.3)],
        [Math.log(2.5), Math.log(2.49771)],
      ]) {
        const tau = b / a;
        const s1 = Math.sin(PI * tau) ** 2;
        const s2 = Math.sin(2 * PI * tau) ** 2;
        if (Math.abs(s2 - s1 * nuExact(a, b)) > 1e-14) return false;
        for (const k of [0, 63, 114, 200, 255]) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          const { X7, Y7 } = chartXY7(a, t0, t1);
          const Clow = 4 * s1 * X7 + 4 * s2 * Y7;
          for (let i = 0; i <= 10; i++) {
            const th = t0 + ((t1 - t0) * i) / 10;
            const { C } = symbols(th, a, b);
            if (Clow > C) return false;
            if (Clow / C > worst) worst = Clow / C;
          }
        }
      }
      return worst > 0.98 && worst <= 1;
    },
  },
  {
    id: "imp95333-endpoint-kernel-bounds",
    description:
      "the five endpoint kernel lower bounds of LEMMA PAIR-2 hold at " +
      "sampled in-chart theta for a in {ln 2, ln 10, 6} and charts " +
      "{0, 114, 255}",
    holds: () => {
      for (const a of [Math.LN2, Math.log(10), 6]) {
        for (const k of [0, 114, 255]) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          for (let i = 0; i <= 10; i++) {
            const th = t0 + ((t1 - t0) * i) / 10;
            if (kernelP(th, a) < kernelP(t1, a) - 1e-16) return false;
            if (kernelP(2 * PI - th, a) < kernelP(2 * PI - t0, a) - 1e-16)
              return false;
            if (kernelP(2 * PI + th, a) < kernelP(2 * PI + t1, a) - 1e-16)
              return false;
            if (kernelP(4 * PI - th, a) < kernelP(4 * PI - t0, a) - 1e-16)
              return false;
            if (kernelP(4 * PI + th, a) < kernelP(4 * PI + t1, a) - 1e-16)
              return false;
          }
        }
      }
      return true;
    },
  },
  {
    id: "imp95333-floor-literals-and-dominance",
    description:
      "recomputed floors match the baked literals to rel 1e-12, " +
      "A_pen7 >= A_pen6 on the sampled (rho, r) grid, the gains match " +
      "(1.2788 / 1.0066 / 1.3040 at rho = e^6, 1.0005 at rho = 10), " +
      "and A_pen6 / A_unif6 recomputed here match the imp-95332 baked " +
      "values (convention lock)",
    holds: () => {
      const rel = (x, y) => Math.abs(x / y - 1);
      if (rel(aPen7(6, Math.LN2), T7.aPen7RhoE6R2) > 1e-12) return false;
      if (rel(aPen7(6, 3), T7.aPen7RhoE6Re3) > 1e-12) return false;
      if (rel(aPen7(6, 5.9), T7.aPen7RhoE6Re59) > 1e-12) return false;
      if (rel(aPen7(Math.log(10), Math.LN2), T7.aPen7Rho10R2) > 1e-12)
        return false;
      if (rel(aPen6(6, Math.LN2), T7.aPen6RhoE6R2Ref) > 1e-9) return false;
      if (rel(aUnif6(6), U7.aUnif6RhoE6Ref) > 1e-9) return false;
      if (rel(aUnif7(6), U7.aUnif7RhoE6) > 1e-12) return false;
      if (rel(aUnif7(Math.log(10)), U7.aUnif7Rho10) > 1e-12) return false;
      if (
        rel(aPen7(6, Math.LN2) / aPen6(6, Math.LN2), T7.gainRhoE6R2) > 1e-9
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
        if (!(aPen7(a, b) >= aPen6(a, b) * (1 - 1e-14))) return false;
      }
      const { kBind } = w7Scan(6, prefactor(6, Math.LN2), nuExact(6, Math.LN2));
      return kBind === T7.bindingChartRhoE6;
    },
  },
  {
    id: "imp95333-symbol-scan-validity",
    description:
      "exact-symbol scans (2001 points + 3 refinement rounds) stay at " +
      "or above A_pen7 at seven (rho, r) cells including both " +
      "coalescence ends",
    holds: () => {
      for (const [a, b] of [
        [Math.LN2, Math.log(1.3)],
        [Math.log(4), Math.LN2],
        [Math.log(10), Math.LN2],
        [6, Math.LN2],
        [6, 3],
        [6, 5.9],
        [Math.log(2.5), Math.log(2.49771)],
      ]) {
        if (!(gridInfRefined(a, b, 2001) >= aPen7(a, b))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95333-uniform-two-branch",
    description:
      "COROLLARY PEN-UNIF7 branch bounds hold on a 500-point tau grid " +
      "(chord and nu0 = 2 - sqrt(2) on (0, 3/8], muH on [3/8, 1/2]) " +
      "for a in {ln 2, ln 4, ln 10, 6}; A_unif7 >= A_unif6 " +
      "everywhere sampled; and the exact symbol inf at 7 sampled tau " +
      "stays above A_unif7 for rho in {2, 10, e^6}",
    holds: () => {
      const nu0 = 4 * Math.cos(PI * TAU0) ** 2;
      if (Math.abs(nu0 - (2 - Math.SQRT2)) > 1e-14) return false;
      if (Math.abs(nu0 - U7.nu0) > 1e-14) return false;
      for (const a of [Math.LN2, Math.log(4), Math.log(10), 6]) {
        const muH = Math.sin(PI * TAU0) ** 2 / Math.tanh(a / 4) ** 2;
        const muHRef = (2 + Math.SQRT2) / (4 * Math.tanh(a / 4) ** 2);
        if (Math.abs(muH / muHRef - 1) > 1e-14) return false;
        for (let i = 1; i <= 500; i++) {
          const tau = (0.5 * i) / 500;
          const b = a * tau;
          const mu = prefactor(a, b);
          const nu = nuExact(a, b);
          if (tau <= TAU0) {
            if (mu < 16 / (a * a) - 1e-12) return false;
            if (nu < nu0 - 1e-12) return false;
          }
          if (tau >= TAU0 && mu < muH - 1e-12) return false;
        }
        if (!(aUnif7(a) >= aUnif6(a) * (1 - 1e-14))) return false;
      }
      for (const rho of [2, 10, Math.exp(6)]) {
        const a = Math.log(rho);
        const u7 = aUnif7(a);
        for (const tau of [0.02, 0.1, 0.2, 0.3, 0.375, 0.45, 0.5]) {
          if (!(gridInfRefined(a, a * tau, 801) >= u7)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95333-matrix-pencil-floor",
    description:
      "matrix level: lam_min of the finite pencil (Gtilde_2m, " +
      "blockdiag G0) >= A_pen7 at rho = 10 (m in {4, 6}, r in " +
      "{2, 3.1}), rho = e^6 (m in {3, 4}, r = 2), and rho = 2 (m = 6, " +
      "r = 1.3)",
    holds: () => {
      for (const [rho, r, ms] of [
        [10, 2, [4, 6]],
        [10, 3.1, [4, 6]],
        [Math.exp(6), 2, [3, 4]],
        [2, 1.3, [6]],
      ]) {
        const bound = aPen7(Math.log(rho), Math.log(r));
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
    id: "imp95333-onsets-unchanged",
    description:
      "onset honesty: at rho in {2, 4} the new branch is inactive " +
      "(W7 = W6 to 1e-13 at the chord and certificate mu with the " +
      "r = 1.3 nu), the uniform rho = 2 constant is unchanged, and " +
      "the carried onsets still bracket 1 under the PEN7 denominators",
    holds: () => {
      for (const a of [Math.LN2, Math.log(4)]) {
        const nu13 = nuExact(a, Math.log(1.3));
        for (const mu of [16 / (a * a), prefactor(a, Math.log(1.3))]) {
          if (Math.abs(w7Scan(a, mu, nu13).W / w6Scan(a, mu) - 1) > 1e-13)
            return false;
        }
      }
      if (Math.abs(aUnif7(Math.LN2) / aUnif6(Math.LN2) - 1) > 1e-14)
        return false;
      const a2 = Math.LN2;
      const cert = (x, r) =>
        certNumerator(x) / Math.max(aPen7(a2, Math.log(r)), A_BLK_REF);
      const certU = (x) => certNumerator(x) / aUnif7(a2);
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
    id: "imp95333-monotone-and-refinement",
    description:
      "Psi7 is nondecreasing in mu at fixed nu and in nu at fixed mu, " +
      "chart refinement does not lower it (sampled splits at a in " +
      "{ln 2, 6}), and K = 1024 does not fall below the K = 256 floor " +
      "at rho = e^6",
    holds: () => {
      const t0b = (PI * 114) / 256;
      const t1b = (PI * 115) / 256;
      let prev = -Infinity;
      for (let i = 1; i <= 12; i++) {
        const v = chartPsi7(6, t0b, t1b, i * 0.05, 2.0);
        if (v < prev - 1e-15) return false;
        prev = v;
      }
      prev = -Infinity;
      for (let i = 0; i <= 12; i++) {
        const v = chartPsi7(6, t0b, t1b, 0.4, i * 0.35);
        if (v < prev - 1e-15) return false;
        prev = v;
      }
      for (const a of [Math.LN2, 6]) {
        for (const k of [0, 114, 255]) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          const mid = (t0 + t1) / 2;
          const coarse = chartPsi7(a, t0, t1, 0.5, 1.5);
          if (chartPsi7(a, t0, mid, 0.5, 1.5) < coarse * (1 - 1e-14))
            return false;
          if (chartPsi7(a, mid, t1, 0.5, 1.5) < coarse * (1 - 1e-14))
            return false;
        }
      }
      const mu = prefactor(6, Math.LN2);
      const nu = nuExact(6, Math.LN2);
      if (!(w7Scan(6, mu, nu, 1024).W >= w7Scan(6, mu, nu, 256).W * (1 - 1e-12)))
        return false;
      return true;
    },
  },
  {
    id: "imp95333-attribution-measurement",
    description:
      "the exhaustion measurement holds at the binding chart (k = " +
      "114, rho = e^6, r = 2): the full pair identity at 3 sampled " +
      "in-chart theta exceeds C_low by at most 1.03x, while the " +
      "capped trace exceeds the true B by at least 2.4x -- the " +
      "surviving slack lives in the trace weight, not the kept pairs",
    holds: () => {
      const a = 6;
      const b = Math.LN2;
      const tau = b / a;
      const s = sechHalf(b);
      const A = 1 - s * s;
      const k = 114;
      const t0 = (PI * k) / 256;
      const t1 = (PI * (k + 1)) / 256;
      const { X7, Y7 } = chartXY7(a, t0, t1);
      const s1 = Math.sin(PI * tau) ** 2;
      const s2 = Math.sin(2 * PI * tau) ** 2;
      const Clow = 4 * s1 * X7 + 4 * s2 * Y7;
      const Bup = (A / 2) * chartT6(a, t0, t1);
      for (const frac of [0, 0.5, 1]) {
        const th = t0 + (t1 - t0) * frac;
        const { fa, br, C } = symbols(th, a, b);
        const Btrue = fa - s * br;
        if (!(C / Clow <= 1.03)) return false;
        if (!(Bup / Btrue >= 2.4)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95333-honesty-gate",
    description:
      "the verdict names the executed-and-near-exhausted pair leg, " +
      "keeps the b-uniform t3 leg open, records unchanged onsets, the " +
      "tau = 1/2 vanishing weight, and floors-only scope; promotes no " +
      "bound, NO QED, no refereed bound is changed",
    holds: () =>
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /EXECUTED and NEAR-EXHAUSTED/.test(REC.verdict) &&
      /remains OPEN/.test(REC.verdict) &&
      /Changes no bound/.test(REC.verdict) &&
      /onsets\s+unchanged/i.test(REC.verdict) &&
      /certificate onsets unchanged/.test(REC.honestScope) &&
      /rho = 2 floors bitwise unchanged/.test(REC.honestScope) &&
      /vanishes identically/.test(REC.honestScope) &&
      /b-uniform t3 weight/.test(REC.pairCurrencyNearExhausted) &&
      REC.onsetsUnchanged.xStarUniform === 13.297836,
  },
];

for (const a of IMP95333_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95333-pair-extended-pencil-floor assertion failed: ${a.id}`,
    );
  }
}

export default IMP95333_PAIR_EXTENDED_PENCIL_FLOOR;
