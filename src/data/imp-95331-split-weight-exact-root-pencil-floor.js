/**
 * imp-95331: LEMMA ROOT-MONO + LEMMA W-SPLIT + THEOREM RZ-PEN5 +
 * COROLLARY PEN-UNIF5 -- executes the imp-95330 named residual (the
 * large-rho numerator currency) on its reachable half, and REFUTES the
 * standalone det-over-trace attribution recorded there. Thirty-fourth
 * leg of the seam chain. Two moves, one chart-floor formula:
 * (1) SPLIT SIDE WEIGHTS: the RZ-PEN4 trace cap charged BOTH side terms
 * w_{-1} = theta - 2 pi and w_{+1} = theta + 2 pi at the far weight
 * t3(2 pi + t1); near theta = pi the dominant side term has
 * |w_{-1}| = 2 pi - theta -> pi where the true weight is t3(pi)
 * (a ~2.8x overweight on a full-size P(pi) term at rho = e^6) -- the
 * split assigns t3(2 pi - t0) and t3(2 pi + t1) separately, with
 * two-sided chart bounds on each kernel occurrence; (2) EXACT ROOT: the
 * det-over-trace lower bound lam_min >= det/tr is replaced by the exact
 * smaller quadratic root evaluated at the capped trace and truncated
 * numerator, floor-safe by LEMMA ROOT-MONO. Floor gain over RZ-PEN4:
 * 1.6695x at rho = 10 (r = 2), 1.5389x at rho = e^6 (r = 2); residual
 * looseness against the exact symbol-pencil infimum at rho = e^6:
 * 9.32x -> 6.09x (r = 2), 6.00x -> 3.92x (r = e^3), 5.43x -> 3.61x
 * (r = e^5.9); rho <= 4 unchanged (the RZ-PEN4 charts still bind there;
 * activation crossover rho ~ 6.5). SKEPTICAL REFUTATION recorded: the
 * exact-root step STANDALONE (without the split) gains at most 1.006x,
 * and ON TOP of the split at most 1.025x -- the imp-95330 attribution
 * "det/tr would remove up to 1.66x" is only visible at the TRUE (B, C)
 * values and is unreachable while the trace is capped and the numerator
 * truncated: the two legs are COUPLED through the discriminant
 * B^2 - A C. Every-octave onsets UNCHANGED (13.297836 / 13.071303 /
 * 12.817538): the certificate anchor rho = 2 is below the activation
 * crossover. Changes no bound; NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95252 / imp-95288 / imp-95329 / imp-95330 normalization,
 * verbatim). a = ln rho in (0, 6], b = ln r in (0, a), tau = b / a,
 * s = sech(b / 2), A = 1 - s^2 = tanh^2(b / 2),
 * P(w) = (2 pi / a) sech(pi w / a), w_n = theta + 2 pi n,
 * theta in [0, pi] (evenness, imp-95330). Pointwise in theta the
 * generalized eigenvalue lam_min(F, G0) is the SMALLER root of
 *   A lam^2 - 2 B lam + C = 0,  B = f_a - s Re f_b > 0,
 *   C = sum over ordered pairs i != j of 2 sin^2(pi |i - j| tau)
 *     P_i P_j  (cancellation-free; imp-95288 pair identity),
 * with the imp-95329 per-term trace cap
 *   2 B / A = tr M <= sum over n of t3(|w_n|) P_n,
 *   t3(w) = c_alpha + min(kappa w^2, 2 + 4 w^2 / a^2), t3 increasing
 *   on w >= 0, and c3n the theta-uniform tail majorant for |n| >= 2.
 *
 * LEMMA ROOT-MONO. Fix A > 0 and let h(B, C) = C / (B + sqrt(B^2 - AC))
 * = (B - sqrt(B^2 - AC)) / A on the domain B > 0, 0 <= C <= B^2 / A.
 * Then (i) h is nonincreasing in B and nondecreasing in C; (ii)
 * h(B, C) >= C / (2 B) (the det-over-trace floor), since
 * sqrt(B^2 - AC) <= B; (iii) if B* <= B_up and C* >= C_low with
 * (B*, C*) in the domain, then (B_up, C_low) is in the domain
 * automatically (both substitutions increase the discriminant), and
 * h(B*, C*) >= h(B_up, C_low). Proof of (i): for fixed C the
 * denominator B + sqrt(B^2 - AC) is increasing in B; for fixed B,
 * raising C decreases the sqrt, so the denominator decreases while the
 * numerator increases. (iii) chains (i) twice. QED.
 *
 * LEMMA W-SPLIT (split side-weight chart caps). On the chart
 * I_k = [t0, t1] (t0 = pi k / K, t1 = pi (k + 1) / K, K = 256), with
 * x = P(theta), y1 = P(2 pi - theta), y2 = P(2 pi + theta):
 *   x  in [P(t1), P(t0)],   y1 in [P(2 pi - t0), P(2 pi - t1)],
 *   y2 in [P(2 pi + t1), P(2 pi + t0)]   (P even, decreasing in |w|),
 *   t3(theta) <= t3(t1),  t3(2 pi - theta) <= t3(2 pi - t0),
 *   t3(2 pi + theta) <= t3(2 pi + t1)    (t3 increasing on w >= 0),
 * so pointwise on I_k:
 *   B <= B_up = (A / 2) T_k,  T_k = t3(t1) P(t0)
 *     + t3(2 pi - t0) P(2 pi - t1) + t3(2 pi + t1) P(2 pi + t0) + c3n,
 *   C >= C_low = 4 sin^2(pi tau) X_k,
 *     X_k = P(t1) [P(2 pi - t0) + P(2 pi + t1)]
 * (kept ordered pairs (0, +-1) and (+-1, 0); discarded terms
 * nonnegative). QED. The RZ-PEN4 cap charged both side weights at
 * t3(2 pi + t1); the split charges w_{-1} at t3(2 pi - t0), which near
 * theta = pi is t3(~pi) instead of t3(~3 pi).
 *
 * THEOREM RZ-PEN5 (split-weight exact-root chart floor;
 * 1 < r < rho <= e^6, every m). With mu = sin^2(pi tau) / tanh^2(b/2)
 * and, per chart,
 *   Psi_k(mu) = 4 X_k / [T_k / 2 + sqrt(T_k^2 / 4 - 4 mu X_k)],
 * LEMMA ROOT-MONO (iii) applied to (B_up, C_low) of LEMMA W-SPLIT gives
 * lam_min(theta) >= h(B_up, C_low) = mu Psi_k(mu) on I_k (the A-scaling
 * identity: h((A/2) T, 4 q X) = (q / A) 4X / [T/2 + sqrt(T^2/4 -
 * 4 (q/A) X)], q = sin^2(pi tau)). The imp-95330 chart floor mu V4_k
 * holds unchanged, so
 *   inf lam_min(F, G0) >= A_pen5(rho, r) = mu W5(a, mu),
 *   W5(a, mu) = min over k = 0..255 of max(V4_k, Psi_k(mu)).
 * QED. Dominance A_pen5 >= A_pen4 is UNCONDITIONAL (the max includes
 * V4_k chartwise). Refinement monotonicity: for a fine chart inside a
 * coarse one every cap tightens (t3 terms decrease, upper kernels
 * decrease, lower kernels increase), so Psi_fine >= Psi_coarse by
 * ROOT-MONO and the K-refinement is monotone as in imp-95330.
 *
 * COROLLARY PEN-UNIF5 (r-and-m-uniform floor). Both mu V4_k and
 * mu Psi_k(mu) = 4 X_k mu / [T_k/2 + sqrt(T_k^2/4 - 4 mu X_k)] are
 * nondecreasing in mu (numerator increasing, denominator decreasing;
 * the discriminant only grows as mu shrinks, so every intermediate mu
 * is in-domain). With the RZ-PEN chord step mu >= 16 / a^2 for
 * r in (1, sqrt(rho)]:
 *   inf lam_min(F, G0) >= A_unif5(rho) = (16 / a^2) W5(a, 16 / a^2),
 * independent of r and m. A_unif5(e^6) = 4.971465357e-2
 * = 1.5179 x A_unif4(e^6); A_unif5(2) = A_unif4(2) (inactive there).
 *
 * MEASURED LEDGER (floor gains over RZ-PEN4 and residual looseness
 * inf / A_pen5): rho = 10, r = 2: gain 1.6695, looseness 2.17 -> 1.30;
 * rho = e^6: r = 2 gain 1.5389 (9.32 -> 6.09), r = e^3 gain 1.5416
 * (6.00 -> 3.92), r = e^5.9 gain 1.5051 (5.43 -> 3.61); rho in {2, 4}:
 * gain 1.0000 (binding charts k = 5 / k = 9 are V4-charts; activation
 * crossover a ~ 1.875, rho ~ 6.5). Binding chart at rho = e^6 moves
 * k = 255 (far corner) -> k = 114 (interior): the far corner is no
 * longer binding, i.e. the side-weight overweight WAS the corner slack.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) REFUTATION OF THE PLANNED STEP
 * (recorded as the run finding): the exact-root substitution executed
 * FIRST, without the split (two-sided bounds on the unsplit RZ-PEN4
 * cap), gains at most 1.006x anywhere sampled -- with the truncated
 * numerator and unsplit capped trace the discriminant B_up^2 - A C_low
 * stays close to B_up^2 and the root degenerates to det/tr. The
 * imp-95330 attribution ("det/tr step ... exact quadratic root would
 * remove up to 1.66x") measured the gap at the TRUE (B, C) and is NOT
 * standalone-reachable; the legs couple through the discriminant.
 * (2) Hand decomposition at theta = pi, rho = e^6, r = 2: true
 * B ~ 0.111 vs unsplit cap ~ 0.488 (the t3(3 pi) ~ 13.7 weight on the
 * full-size P(pi) side term plus the c3n ~ 1.09 tail are the corner
 * slack); truncation there only ~1.3x. The split cap ~ 0.29 recovers
 * the diagnosed factor. (3) Floor validity: 8001-point scan + 3 rounds
 * of local refinement (final width ~1e-5) at 11 (rho, r) cells
 * including both coalescence ends: no dip below A_pen5; worst margin
 * 1.005 at (2.5, 2.49771) -- the floor stays essentially ATTAINED at
 * the r -> rho end. (4) Finite pencils (m up to 6 at rho in
 * {2, 10, e^6}) resolve above A_pen5. (5) Root marginal ON TOP of the
 * split: 1.005 (rho = 10) to 1.025 (rho = e^6) -- kept because it is
 * free and rigorous, reported because it is small. (6) Onset honesty:
 * SPLIT-PEN5 onsets are IDENTICAL to SPLIT-PEN4 (13.297836 /
 * 13.071303 / 12.817538) since rho = 2 is below the activation
 * crossover; no onset improvement is claimed. (7) K-convergence at
 * rho = e^6: K = 4096 exceeds K = 256 by 0.76% -- chart currency
 * remains exhausted for the new floor.
 *
 * HONEST LIMITS. (a) Floor only; the surviving large-rho looseness
 * (3.6 - 6.1x at rho = e^6) now lives in the {0, +-1} pair-identity
 * truncation, the c3n tail majorant (~30x above the true tail at
 * a = 6 while contributing ~20% of the capped trace), and the residual
 * b-uniformity of the t3 weight at the new interior binding chart --
 * named residual, NOT claimed. (b) The det/tr leg of the imp-95330
 * residual is EXECUTED AND CLOSED with a near-vacuous measured payoff
 * (<= 2.5%); do not re-attempt it standalone. (c) rho <= 4 floors and
 * all certificate onsets unchanged. (d) Dyadic lattice skeleton only;
 * off-lattice rates unchanged (imp-95232 residual). (e) Model family
 * only; no mapping to paper per-window data (obligation (3) gammaSL
 * unchanged); changes NO Lambda bound of the program.
 *
 * ROUTING. imp-95330 named residual (large-rho numerator currency):
 * det/tr leg EXECUTED (near-vacuous standalone, <= 2.5% coupled);
 * side-weight corner slack EXECUTED (this module, the actual carrier
 * of the diagnosed 1.37 - 1.66x); surviving legs = pair-identity
 * truncation beyond {0, +-1} (now binding at the INTERIOR chart, so an
 * extension must carry the (-1, +1) and (0, +-2) pairs with exact
 * sin^2(2 pi tau) weights), c3n tail sharpening, and the b-uniform t3
 * weight at interior w. Obligation ledger otherwise unchanged:
 * (2) signed weight / modulus legs, (3) envelope-shape port + gammaSL
 * map, (4) paper constants. Sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.
 *
 * Import-light (no imports, no zeros bundle). Numerics are CROSS-CHECKS
 * of proven statements, never the claim itself.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95331_SPLIT_WEIGHT_EXACT_ROOT_PENCIL_FLOOR = {
  id: "imp-95331",
  title:
    "LEMMA ROOT-MONO + LEMMA W-SPLIT + THEOREM RZ-PEN5 + COROLLARY " +
    "PEN-UNIF5: split side-weight exact-root chart floor (the reachable " +
    "half of the imp-95330 large-rho numerator-currency residual, " +
    "executed; the standalone det/tr attribution refuted)",
  lemmaRootMono:
    "h(B, C) = C / (B + sqrt(B^2 - AC)) is nonincreasing in B and " +
    "nondecreasing in C on B > 0, 0 <= C <= B^2 / A, dominates the " +
    "det-over-trace floor C / (2B), and the substitution (B up, C down) " +
    "keeps the discriminant nonnegative automatically",
  lemmaWSplit:
    "per-chart trace cap with SEPARATE side weights t3(2 pi - t0) and " +
    "t3(2 pi + t1) for w_{-1} and w_{+1} plus two-sided kernel bounds; " +
    "RZ-PEN4 charged both sides at t3(2 pi + t1), a ~2.8x overweight " +
    "on the full-size P(pi) term near theta = pi at rho = e^6",
  theoremRzPen5: {
    statement:
      "inf lam_min(F, G0) >= A_pen5 = mu W5(a, mu), mu = sin^2(pi tau) " +
      "/ tanh^2(b/2), W5 = min over K = 256 charts of max(V4_k, " +
      "Psi_k(mu)), Psi_k(mu) = 4 X_k / [T_k/2 + sqrt(T_k^2/4 - 4 mu " +
      "X_k)]; A_pen5 >= A_pen4 unconditionally (chartwise max)",
    K: 256,
    w5Mu0Rho2: 5.998256792e-11,
    w5Mu0Rho4: 4.257558333e-5,
    w5Mu0Rho10: 6.140610862e-3,
    w5Mu0RhoE6: 1.118579705e-1,
    gainRho10R2: 1.6695,
    gainRhoE6R2: 1.5389,
    gainRhoE6Re3: 1.5416,
    gainRhoE6Re59: 1.5051,
    aPen5Rho10R2: 3.65079087e-2,
    aPen5RhoE6R2: 1.286383219e-1,
    bindingChartRho2: 5,
    bindingChartRhoE6: 114,
    bindingChartRhoE6Pen4Ref: 255,
    activationCrossoverA: 1.875,
    loosenessRhoE6R2: 6.085,
    loosenessRhoE6R2Pen4Ref: 9.3179,
  },
  corollaryPenUnif5: {
    statement:
      "for r in (1, sqrt(rho)]: inf lam_min(F, G0) >= A_unif5 = " +
      "(16 / a^2) W5(a, 16 / a^2), independent of r and m (mu-monotone " +
      "floor family + chord step)",
    aUnif5RhoE6: 4.971465357e-2,
    aUnif4RhoE6Ref: 3.275194425e-2,
    aUnif5Rho2: 1.9975337e-9,
    aUnif4Rho2Ref: 1.9975337e-9,
  },
  refutationRecord:
    "the imp-95330 det/tr leg is NOT a standalone 1.37 - 1.66x lever: " +
    "exact-root without the split gains <= 1.006x, and on top of the " +
    "split <= 1.025x; the 1.66x gap was measured at the true (B, C), " +
    "unreachable while the trace is capped and the numerator truncated " +
    "(discriminant coupling B^2 - AC). The actual carrier of the " +
    "diagnosed corner slack is the side-weight split.",
  onsetsUnchanged: {
    xStarUniform: 13.297836,
    xStarR13: 13.071303,
    xStarR105: 12.817538,
    note:
      "identical to SPLIT-PEN4: rho = 2 sits below the activation " +
      "crossover rho ~ 6.5, so the certificate numerator and " +
      "denominator are both unchanged there",
  },
  honestScope:
    "floor only; gains live at rho > ~6.5 where no certificate " +
    "currently fires, and the rho = 2 onsets are unchanged; surviving " +
    "large-rho looseness 3.6 - 6.1x = pair-identity truncation (now " +
    "binding at an INTERIOR chart) + c3n tail majorant + b-uniform t3 " +
    "weight; dyadic skeleton only; model family only",
  verdict:
    "RIGOROUS: LEMMA ROOT-MONO and LEMMA W-SPLIT are elementary, " +
    "THEOREM RZ-PEN5 composes them with the imp-95288 pair identity, " +
    "the imp-95329 per-term trace cap, and the imp-95330 chart floor " +
    "as cited inputs; dominance A_pen5 >= A_pen4 is unconditional. The " +
    "side-weight half of the imp-95330 large-rho residual is EXECUTED " +
    "(gain 1.6695x at rho = 10, 1.5389x at rho = e^6, looseness 9.32 " +
    "-> 6.09); the det/tr half is EXECUTED AND REFUTED as a standalone " +
    "lever (<= 1.006x alone, <= 1.025x coupled). Every-octave onsets " +
    "unchanged; the truncation, c3n tail, and interior t3 legs remain " +
    "OPEN. Changes no bound; NO QED; no refereed bound is changed" +
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

// imp-95343 cross-validation: DIRECT 2x2 generalized-eigenvalue solve of the
// pencil (F(theta), G0) with F = [[f_a, f_b], [conj(f_b), f_a]],
// G0 = [[1, s], [s, 1]]. Uses the LEMMA PM plus-minus diagonalization of G0
// and the exact 2x2 Hermitian eigenvalue formula, so the numerator is built
// straight from f_a and f_b (Re and Im) and NEVER touches the imp-95288
// ordered-pair identity that pencilSymbolMin above uses for C. Independent
// code path: agreement validates both the pair identity and the smaller-root
// pricing simultaneously.
function pencilDirectMin(theta, a, b, NN = 14) {
  const tau = b / a;
  const s = sechHalf(b);
  let fa = 0;
  let br = 0;
  let bi = 0;
  for (let n = -NN; n <= NN; n++) {
    const w = theta + 2 * PI * n;
    const p = kernelP(w, a);
    fa += p;
    br += p * Math.cos(w * tau);
    bi += p * Math.sin(w * tau);
  }
  const alpha = (fa + br) / (1 + s);
  const beta = (fa - br) / (1 - s);
  const gamma = Math.abs(bi) / Math.sqrt(1 - s * s);
  const mid = (alpha + beta) / 2;
  const rad = Math.sqrt(((alpha - beta) / 2) ** 2 + gamma * gamma);
  return mid - rad;
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
  return { kap, tA, tQ };
}

// imp-95329 per-term weight and tail (verbatim)
function pen3Constants(a) {
  const { kap, tA, tQ } = baseConstants(a);
  const kap2 = 4 / (a * a);
  const cAlpha = 2 / (1 + sechHalf(a));
  const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + kap2 * w * w);
  const c3n = cAlpha * tA + Math.min(kap * tQ, 2 * tA + kap2 * tQ);
  return { tw, c3n };
}

const sideSum = (th, a) => kernelP(2 * PI - th, a) + kernelP(2 * PI + th, a);

// imp-95330 chart floor (verbatim) -- retained chartwise in the max
function chartV4(a, t0, t1) {
  const { tw, c3n } = pen3Constants(a);
  const P1 = kernelP(t1, a);
  const S0 = sideSum(t0, a);
  return (4 * P1 * S0) / (tw(t1) * P1 + tw(2 * PI + t1) * S0 + c3n);
}

// THEOREM RZ-PEN5 chart floor: split side weights + two-sided kernel
// bounds + exact root (this module)
function chartPsiSplit(a, t0, t1, mu) {
  const { tw, c3n } = pen3Constants(a);
  const xLo = kernelP(t1, a);
  const y1Lo = kernelP(2 * PI - t0, a);
  const y2Lo = kernelP(2 * PI + t1, a);
  const T =
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3n;
  const X = xLo * (y1Lo + y2Lo);
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}

// unsplit exact-root variant (refutation record only, NOT the theorem)
function chartPsiUnsplit(a, t0, t1, mu) {
  const { tw, c3n } = pen3Constants(a);
  const X = kernelP(t1, a) * sideSum(t0, a);
  const T =
    tw(t1) * kernelP(t0, a) + tw(2 * PI + t1) * sideSum(t1, a) + c3n;
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}

const prefactor = (a, b) =>
  Math.sin(PI * (b / a)) ** 2 / Math.tanh(b / 2) ** 2;

function w4Scan(a, K = 256) {
  let worst = Infinity;
  for (let k = 0; k < K; k++) {
    const v = chartV4(a, (PI * k) / K, (PI * (k + 1)) / K);
    if (v < worst) worst = v;
  }
  return worst;
}
function w5Scan(a, mu, K = 256) {
  let worst = Infinity;
  let kBind = -1;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v = Math.max(chartV4(a, t0, t1), chartPsiSplit(a, t0, t1, mu));
    if (v < worst) {
      worst = v;
      kBind = k;
    }
  }
  return { W: worst, kBind };
}
const aPen4 = (a, b) => prefactor(a, b) * w4Scan(a);
const aPen5 = (a, b) => prefactor(a, b) * w5Scan(a, prefactor(a, b)).W;
const aUnif5 = (a) => (16 / (a * a)) * w5Scan(a, 16 / (a * a)).W;

// finite-matrix pencil machinery (style of the imp-95330 sibling)
function chol(B) {
  const n = B.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = B[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      if (i === j) {
        if (s <= 0) throw new Error("imp-95331 chol: base not PD");
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

// SPLIT-PEN5 onset check on the dyadic skeleton (coalLaw from imp-95227)
const coalLaw = (x) =>
  Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));
function certNumerator(x) {
  let s = 0;
  for (let k = 0; k < 60; k++) s += coalLaw(2 ** k * x);
  return s;
}
const A_BLK_REF = 1.344996021179e-11; // imp-95252 A_blk(2, 1.3)

const REC = IMP95331_SPLIT_WEIGHT_EXACT_ROOT_PENCIL_FLOOR;
const T5 = REC.theoremRzPen5;

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95331_ASSERTIONS = [
  {
    id: "imp95331-lemma-root-mono",
    description:
      "LEMMA ROOT-MONO: h(B, C) = C / (B + sqrt(B^2 - AC)) is " +
      "nonincreasing in B, nondecreasing in C, and >= C / (2B) on " +
      "in-domain grids for A in {0.1, 0.5, 1}; the substitution " +
      "(B up, C down) never leaves the domain",
    holds: () => {
      const h = (A, B, C) =>
        C / (B + Math.sqrt(Math.max(B * B - A * C, 0)));
      for (const A of [0.1, 0.5, 1]) {
        for (const B of [0.5, 1, 2, 5]) {
          const Cmax = (B * B) / A;
          for (let i = 1; i <= 20; i++) {
            const C = (Cmax * i) / 21;
            for (let j = 1; j <= 10; j++) {
              const dB = (B * j) / 10;
              if (h(A, B + dB, C) > h(A, B, C) + 1e-15) return false;
              if ((B + dB) * (B + dB) - A * C < 0) return false;
            }
            const Cdown = C * 0.7;
            if (h(A, B, Cdown) > h(A, B, C) + 1e-15) return false;
            if (h(A, B, C) < C / (2 * B) - 1e-15) return false;
          }
        }
      }
      return true;
    },
  },
  {
    id: "imp95331-lemma-w-split-inputs",
    description:
      "LEMMA W-SPLIT chart caps hold pointwise: on sampled charts and " +
      "interior theta, t3(2 pi - theta) <= t3(2 pi - t0), " +
      "t3(2 pi + theta) <= t3(2 pi + t1), and each kernel occurrence " +
      "lies inside its two-sided chart bracket; the split w_{-1} " +
      "weight at the last chart is strictly below the unsplit " +
      "t3(2 pi + t1) charge (the RZ-PEN4 overweight is real)",
    holds: () => {
      for (const a of [Math.LN2, Math.log(4), Math.log(10), 6]) {
        const { tw } = pen3Constants(a);
        for (const k of [0, 5, 63, 114, 200, 255]) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          for (let i = 0; i <= 10; i++) {
            const th = t0 + ((t1 - t0) * i) / 10;
            if (tw(2 * PI - th) > tw(2 * PI - t0) + 1e-14) return false;
            if (tw(2 * PI + th) > tw(2 * PI + t1) + 1e-14) return false;
            if (tw(th) > tw(t1) + 1e-14) return false;
            const x = kernelP(th, a);
            if (x < kernelP(t1, a) - 1e-16) return false;
            if (x > kernelP(t0, a) + 1e-16) return false;
            const y1 = kernelP(2 * PI - th, a);
            if (y1 < kernelP(2 * PI - t0, a) - 1e-18) return false;
            if (y1 > kernelP(2 * PI - t1, a) + 1e-18) return false;
            const y2 = kernelP(2 * PI + th, a);
            if (y2 < kernelP(2 * PI + t1, a) - 1e-18) return false;
            if (y2 > kernelP(2 * PI + t0, a) + 1e-18) return false;
          }
        }
        const t0last = (PI * 255) / 256;
        if (!(tw(2 * PI - t0last) < tw(2 * PI + PI))) return false;
      }
      return true;
    },
  },
  {
    id: "imp95331-theorem-rz-pen5",
    description:
      "THEOREM RZ-PEN5: 4001-point stable grid inf of lam_min(F, G0) " +
      ">= A_pen5 across 17 (rho, r) cells including both coalescence " +
      "ends; baked literals (W5 anchors, gains, A_pen5, binding " +
      "charts, looseness) reproduce",
    holds: () => {
      for (const [rho, r] of [
        [2, 1.001],
        [2, 1.05],
        [2, 1.3],
        [2, Math.SQRT2],
        [2, 1.9],
        [2, 1.99],
        [2.5, 2.49771],
        [3, 1.3],
        [4, 1.001],
        [4, 1.3],
        [4, 3.9],
        [10, 2],
        [10, 3.1],
        [10, 9.9],
        [Math.exp(6), 2],
        [Math.exp(6), Math.exp(3)],
        [Math.exp(6), Math.exp(5.9)],
      ]) {
        const a = Math.log(rho);
        const b = Math.log(r);
        if (!(gridInf(a, b) >= aPen5(a, b))) return false;
      }
      const rel = (x, y) => Math.abs(x / y - 1);
      const mu0 = (a) => 16 / (a * a);
      const s2 = w5Scan(Math.LN2, mu0(Math.LN2));
      const s4 = w5Scan(Math.log(4), mu0(Math.log(4)));
      const s10 = w5Scan(Math.log(10), mu0(Math.log(10)));
      const s6 = w5Scan(6, mu0(6));
      const gain = (rho, r) => {
        const a = Math.log(rho);
        const b = Math.log(r);
        return aPen5(a, b) / aPen4(a, b);
      };
      const loose = (rho, r) => {
        const a = Math.log(rho);
        const b = Math.log(r);
        return gridInf(a, b) / aPen5(a, b);
      };
      return (
        rel(s2.W, T5.w5Mu0Rho2) < 1e-7 &&
        rel(s4.W, T5.w5Mu0Rho4) < 1e-7 &&
        rel(s10.W, T5.w5Mu0Rho10) < 1e-7 &&
        rel(s6.W, T5.w5Mu0RhoE6) < 1e-7 &&
        s2.kBind === T5.bindingChartRho2 &&
        s6.kBind === T5.bindingChartRhoE6 &&
        rel(aPen5(Math.log(10), Math.LN2), T5.aPen5Rho10R2) < 1e-7 &&
        rel(aPen5(6, Math.LN2), T5.aPen5RhoE6R2) < 1e-7 &&
        Math.abs(gain(10, 2) - T5.gainRho10R2) < 1e-4 &&
        Math.abs(gain(Math.exp(6), 2) - T5.gainRhoE6R2) < 1e-4 &&
        Math.abs(gain(Math.exp(6), Math.exp(3)) - T5.gainRhoE6Re3) <
          1e-4 &&
        Math.abs(gain(Math.exp(6), Math.exp(5.9)) - T5.gainRhoE6Re59) <
          1e-4 &&
        Math.abs(loose(Math.exp(6), 2) - T5.loosenessRhoE6R2) < 1e-3
      );
    },
  },
  {
    id: "imp95331-dominance-and-refinement",
    description:
      "unconditional dominance A_pen5 >= A_pen4 at every sampled " +
      "(rho, r); chartwise Psi refinement monotonicity: fine charts " +
      "dominate their coarse parent (K = 512 vs 256) at rho in " +
      "{2, 10, e^6}; W5 nested-K monotone (1024 >= 256 >= 64)",
    holds: () => {
      for (const [rho, r] of [
        [2, 1.05],
        [2, 1.3],
        [4, 1.3],
        [10, 2],
        [Math.exp(6), 2],
        [Math.exp(6), Math.exp(5.9)],
      ]) {
        const a = Math.log(rho);
        const b = Math.log(r);
        if (!(aPen5(a, b) >= aPen4(a, b) * (1 - 1e-12))) return false;
      }
      for (const a of [Math.LN2, Math.log(10), 6]) {
        const mu = 16 / (a * a);
        for (let k = 0; k < 256; k += 7) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          const coarse = chartPsiSplit(a, t0, t1, mu);
          const tm = (t0 + t1) / 2;
          if (chartPsiSplit(a, t0, tm, mu) < coarse * (1 - 1e-12))
            return false;
          if (chartPsiSplit(a, tm, t1, mu) < coarse * (1 - 1e-12))
            return false;
        }
        if (!(w5Scan(a, mu, 1024).W >= w5Scan(a, mu, 256).W * (1 - 1e-12)))
          return false;
        if (!(w5Scan(a, mu, 256).W >= w5Scan(a, mu, 64).W * (1 - 1e-12)))
          return false;
      }
      return true;
    },
  },
  {
    id: "imp95331-corollary-pen-unif5",
    description:
      "COROLLARY PEN-UNIF5: mu -> mu max(V4_k, Psi_k(mu)) is " +
      "nondecreasing on sampled charts; A_pen5(rho, r) >= A_unif5 on a " +
      "40-point r-grid over (1, sqrt(rho)] for rho in {2, 10, e^6}; " +
      "baked A_unif5(e^6) reproduces and equals 1.5179x the RZ-PEN4 " +
      "reference; A_unif5(2) unchanged from RZ-PEN4",
    holds: () => {
      for (const a of [Math.LN2, Math.log(10), 6]) {
        for (let k = 0; k < 256; k += 13) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          let prev = -Infinity;
          for (let i = 1; i <= 40; i++) {
            const mu = (16 / (a * a)) * (0.4 + i * 0.25);
            const v =
              mu *
              Math.max(chartV4(a, t0, t1), chartPsiSplit(a, t0, t1, mu));
            if (v < prev * (1 - 1e-12)) return false;
            prev = v;
          }
        }
        const AU = aUnif5(a);
        for (let i = 1; i <= 40; i++) {
          const b = (a / 2) * (i / 40);
          if (aPen5(a, b) < AU * (1 - 1e-12)) return false;
        }
      }
      const R = REC.corollaryPenUnif5;
      return (
        Math.abs(aUnif5(6) / R.aUnif5RhoE6 - 1) < 1e-7 &&
        Math.abs(R.aUnif5RhoE6 / R.aUnif4RhoE6Ref - 1.5179) < 2e-3 &&
        Math.abs(aUnif5(Math.LN2) / R.aUnif5Rho2 - 1) < 1e-7 &&
        Math.abs(R.aUnif5Rho2 / R.aUnif4Rho2Ref - 1) < 1e-12
      );
    },
  },
  {
    id: "imp95331-refutation-record",
    description:
      "the refutation is real both ways: the UNSPLIT exact-root floor " +
      "gains <= 1.006x over W4 at rho in {2, 4, 10, e^6}; the root " +
      "marginal ON TOP of the split is <= 1.025x at mu(rho, r) for the " +
      "large-rho anchors, i.e. the split carries the gain",
    holds: () => {
      for (const a of [Math.LN2, Math.log(4), Math.log(10), 6]) {
        const mu = 16 / (a * a);
        let wUnsplit = Infinity;
        for (let k = 0; k < 256; k++) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          const v = Math.max(
            chartV4(a, t0, t1),
            chartPsiUnsplit(a, t0, t1, mu),
          );
          if (v < wUnsplit) wUnsplit = v;
        }
        if (!(wUnsplit / w4Scan(a) <= 1.006)) return false;
      }
      for (const [rho, r] of [
        [10, 2],
        [Math.exp(6), 2],
        [Math.exp(6), Math.exp(3)],
      ]) {
        const a = Math.log(rho);
        const mu = prefactor(a, Math.log(r));
        const wRoot = w5Scan(a, mu).W;
        const wDT = w5Scan(a, 0).W;
        if (!(wRoot / wDT >= 1 && wRoot / wDT <= 1.025)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95331-matrix-pencil-floor",
    description:
      "matrix level: lam_min of the finite pencil (Gtilde_2m, blockdiag " +
      "G0) >= A_pen5 at rho = 10 (m in {4, 6}, r in {2, 3.1}), " +
      "rho = e^6 (m in {3, 4}, r = 2), and rho = 2 (m = 6, r = 1.3)",
    holds: () => {
      for (const [rho, r, ms] of [
        [10, 2, [4, 6]],
        [10, 3.1, [4, 6]],
        [Math.exp(6), 2, [3, 4]],
        [2, 1.3, [6]],
      ]) {
        const bound = aPen5(Math.log(rho), Math.log(r));
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
    id: "imp95331-onsets-unchanged",
    description:
      "onset honesty: at rho = 2 the split-root floor is INACTIVE " +
      "(W5 = W4 to 1e-12, same at rho = 4), so the SPLIT-PEN4 onsets " +
      "are carried over UNCHANGED; the baked onsets still bracket 1 " +
      "under the RZ-PEN5 denominator; activation crossover sits in " +
      "a in (1.8, 1.95)",
    holds: () => {
      for (const a of [Math.LN2, Math.log(4)]) {
        const mu = 16 / (a * a);
        if (Math.abs(w5Scan(a, mu).W / w4Scan(a) - 1) > 1e-12)
          return false;
      }
      const a2 = Math.LN2;
      const cert = (x, r) =>
        certNumerator(x) /
        Math.max(aPen5(a2, Math.log(r)), A_BLK_REF);
      const certU = (x) => certNumerator(x) / aUnif5(a2);
      const O = REC.onsetsUnchanged;
      if (!(certU(O.xStarUniform - 1e-3) > 1)) return false;
      if (!(certU(O.xStarUniform + 1e-3) < 1)) return false;
      if (!(cert(O.xStarR13 - 1e-3, 1.3) > 1)) return false;
      if (!(cert(O.xStarR13 + 1e-3, 1.3) < 1)) return false;
      if (!(cert(O.xStarR105 - 1e-3, 1.05) > 1)) return false;
      if (!(cert(O.xStarR105 + 1e-3, 1.05) < 1)) return false;
      const active = (a) =>
        w5Scan(a, 16 / (a * a)).W > w4Scan(a) * (1 + 1e-9);
      return !active(1.8) && active(1.95);
    },
  },
  {
    id: "imp95331-verdict-honesty",
    description:
      "the verdict and scope carry the honest labels: RIGOROUS lemmas " +
      "and theorem, side-weight leg EXECUTED, det/tr leg EXECUTED AND " +
      "REFUTED as standalone, onsets unchanged, surviving legs OPEN, " +
      "no bound change, no QED, no refereed bound is changed",
    holds: () =>
      /RIGOROUS/.test(REC.verdict) &&
      /EXECUTED/.test(REC.verdict) &&
      /REFUTED/.test(REC.verdict) &&
      /onsets unchanged/i.test(REC.verdict) &&
      /remain OPEN/.test(REC.verdict) &&
      /Changes no bound/.test(REC.verdict) &&
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /floor only/i.test(REC.honestScope) &&
      /model family only/.test(REC.honestScope) &&
      /NOT a standalone/.test(REC.refutationRecord),
  },
  {
    id: "imp95343-direct-2x2-gev-crossvalidation",
    description:
      "imp-95343: the closed-form smaller root pencilSymbolMin (numerator C " +
      "via the imp-95288 ordered-pair identity) LOWER-BOUNDS the true " +
      "lam_min of the directly assembled 2x2 pencil (F, G0), solved by an " +
      "independent path (LEMMA PM diagonalization of G0 + exact 2x2 " +
      "Hermitian eigenvalue built from f_a and f_b directly, no pair " +
      "identity): over a 401-point theta grid at 9 (rho, r) cells spanning " +
      "both coalescence ends, pencilSymbolMin <= lam_min_direct + 1e-7 " +
      "everywhere (the residual is sign-noise ~1e-8 at the r -> 1 corner " +
      "where both values are ~1e-9), and the two agree to < 5e-7 relative " +
      "wherever lam_min_direct > 1e-6 (machine precision at the floor scale)",
    holds: () => {
      for (const [rho, r] of [
        [2, 1.001],
        [2, 1.3],
        [2, 1.99],
        [2.5, 2.49771],
        [4, 1.3],
        [10, 2],
        [10, 9.9],
        [Math.exp(6), 2],
        [Math.exp(6), Math.exp(5.9)],
      ]) {
        const a = Math.log(rho);
        const b = Math.log(r);
        for (let i = 0; i <= 400; i++) {
          const th = -PI + (2 * PI * i) / 400;
          const cf = pencilSymbolMin(th, a, b);
          const dir = pencilDirectMin(th, a, b);
          // lower-bound direction (exact equality up to grid + truncation)
          if (cf > dir + 1e-7) return false;
          // relative agreement where the eigenvalue is not near-zero
          if (dir > 1e-6 && Math.abs(cf / dir - 1) > 5e-7) return false;
        }
      }
      return true;
    },
  },
];

for (const a of IMP95331_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95331-split-weight-exact-root-pencil-floor assertion failed: ${a.id}`,
    );
  }
}
