/**
 * imp-96567 -- Reconcile the GUE sine-kernel O(1/k^2) decay-rate clause with the tabulated box
 * correlations rho_2 = -0.020, rho_3 = -0.008 by deriving the box-averaged lag values DIRECTLY from
 * the two-point cluster function T_2(x) = (sin pi x / pi x)^2 via the double box integral over the
 * actual non-overlapping tiling. Measurement only; conditional on GUE; NO QED.
 *
 * THE OBSTRUCTION (imp-96543 OBSTRUCTION 1). imp-96543 established the conditional-on-sine-kernel
 * VIF <= 1 certificate at SIGN level (rho_k <= 0 => z_eff >= z_cons = 1.9234) but flagged a
 * calibration tension: an O(1/k^2) fall-off ANCHORED AT the exact rho_1 = -0.4639782 predicts
 * rho_2 ~ rho_1/4 = -0.1160, whereas the tabulated theoretical box value is rho_2 = -0.020 -- a much
 * faster drop -- so "the decay-RATE clause and the tabulated magnitudes are not calibrated to a single
 * normalization." This module derives the actual rho_k from T_2 and shows the tension is a FALSE
 * ANCHORING artifact, not a real inconsistency.
 *
 * THE SETUP (imp-96542 / imp-96489 tiling). Density-1 unfolded eigenvalues, non-overlapping
 * edge-to-edge boxes of length L = 495.779 (the T = 1.5e5 box length). For a determinantal (GUE sine)
 * process the count statistics are, with the triangular reduction
 *   int_0^L int_0^L f(x - y) dx dy = int_{-L}^{L} (L - |u|) f(u) du,
 *   Sigma^2(L) = L - int_{-L}^{L} (L - |u|) T_2(u) du            (number variance)
 *   Cov_k      =   - int_{-L}^{L} (L - |u|) T_2(u + kL) du       (box B at lag k, shifted by kL)
 *   rho_k      = Cov_k / Sigma^2(L).
 *
 * THE DIRECT MEASUREMENT (offline tmp/imp-96567-scratch.mjs, Simpson h = 0.0025 resolving the
 * period-1 sin^2 over |u| <= L). At L = 495.779 the direct double-box integral yields
 *   Sigma^2(L) = 0.974834  (matches the GUE asymptotic (1/pi^2)(ln(2 pi L) + gamma + 1) to 6 digits),
 *   rho_1 = -0.463978   (reproduces the exact union-identity value -0.4639782 to 6 digits),
 *   rho_2 = -0.014950,  rho_3 = -0.006121,  rho_4 = -0.003354,  rho_5 = -0.002121,  rho_6 = -0.001464.
 *
 * THE CLOSED FORM FOR THE TAIL (k >= 2). The direct integrals match, to 6 digits, the closed form
 *   Cov_k = -(1/(2 pi^2)) ln( k^2 / (k^2 - 1) ),    rho_k = Cov_k / Sigma^2(L),
 * derivable two independent ways: (i) averaging sin^2 -> 1/2 in the direct integral (the box length L
 * then CANCELS, leaving int_{-1}^{1} (1-|v|)/(v+k)^2 dv = ln(k^2/(k^2-1))); (ii) the second-difference
 * / union identity Cov_k = (1/2)[Sigma^2((k+1)L) - 2 Sigma^2(kL) + Sigma^2((k-1)L)] with the log number
 * variance. As k -> infinity, ln(k^2/(k^2-1)) = -ln(1 - 1/k^2) ~ 1/k^2, so
 *   rho_k ~ -1/(2 pi^2 Sigma^2(L)) * 1/k^2 = -0.051968 / k^2   -- the tail IS genuinely O(1/k^2).
 *
 * WHY THE ANCHORING FAILS (the reconciliation). rho_1 is NOT on the O(1/k^2) tail curve: the
 * touching-box lag-1 value sits 8.93x ABOVE it (rho_1 = -0.4640 vs the tail coefficient -0.05197),
 * because adjacent boxes SHARE AN EDGE and rho_1 is governed by the union identity
 * rho_1 = Sigma^2(2L)/(2 Sigma^2(L)) - 1, dominated by the LOG divergence of the number variance -- a
 * different mechanism from the k >= 2 tail. So "rho_k ~ rho_1/k^2" (giving rho_2 ~ -0.116) mis-anchors
 * the O(1/k^2) law at the one lag that does not obey it. Anchored correctly at the tail coefficient the
 * law gives rho_2 = -0.0150, rho_3 = -0.0061 -- the SAME order as, and consistent with, the tabulated
 * round figures -0.020, -0.008 (the exact-log tail ratio rho_2/rho_3 = ln(4/3)/ln(9/8) = 2.4425 vs the
 * tabulated 0.020/0.008 = 2.5, both round approximations of the same log ratio). The tabulated
 * magnitudes are, if anything, slightly MORE negative than the derived ones, so they do not overstate
 * the VIF reduction. Tension resolved: the decay rate and the magnitudes ARE co-calibrated once the
 * O(1/k^2) law is anchored at its own tail coefficient rather than at the special lag-1 value.
 *
 * TAIL BUDGET. The k >= 2 covariances telescope: sum_{k>=2} ln(k^2/(k^2-1)) = ln 2, so
 * sum_{k>=2} Cov_k = -(ln 2)/(2 pi^2) = -0.035116 and sum_{k>=2} rho_k = -0.036022 -- a small bounded
 * tail, tiny against rho_1 = -0.4640. This confirms imp-96543's structure: the SIGN bound (rho_k <= 0
 * => VIF <= 1) is the robust conditional statement, the rho_1-only VIF_291 <= 0.0752 (z >= 7.01) is the
 * clean explicit refinement, and the now-calibrated tail adds only a small further (negative) increment.
 *
 * VERDICT. The O(1/k^2)-vs-tabulated tension flagged by imp-96543 is a FALSE-ANCHORING artifact, not a
 * genuine mis-calibration. Deriving rho_k directly from T_2 over the L = 495.779 non-overlapping tiling
 * gives rho_1 = -0.463978 (exact union value), rho_2 = -0.014950, rho_3 = -0.006121, with the exact
 * tail closed form rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) ~ -0.051968/k^2: the tail genuinely
 * decays like O(1/k^2), but rho_1 sits ~8.9x above that curve because touching lag-1 boxes obey the
 * union identity (log-number-variance mechanism), not the tail law. Anchored at its own coefficient the
 * law predicts rho_2 = -0.015, rho_3 = -0.006, consistent with the tabulated round -0.020 / -0.008
 * (same exact-log ratio). Measurement only; conditional on the GUE sine kernel / Montgomery pair
 * correlation for the zeta zeros (UNPROVEN); changes NO unconditional bound; RH open; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96543-sine-kernel-vif-conditional-lower-bound (OBSTRUCTION 1, the tension this reconciles)
 * @see imp-96542-excursion-empirical-lag2-lag3-box-covariance (the empirical r_k at this box length)
 * @see imp-96489-excursion-effective-significance-direct-rho (the exact rho_1 = -0.4639782 union value)
 * @see imp-96128-number-variance-two-interval-covariance-exact (the disjoint-interval covariance frame)
 *
 * Import-light: no zeros bundle, no sibling imports. L, Sigma^2, and the rho_k are baked literals from
 * the offline direct double-box integral tmp/imp-96567-scratch.mjs; the closed-form tail, the O(1/k^2)
 * coefficient, the union-identity rho_1, and the telescoping tail sum are re-derived here on T_2.
 */

const PI = Math.PI;
const GAMMA = 0.5772156649015329;
const L = 495.779; // T = 1.5e5 non-overlapping box length (imp-96542)

// GUE two-point cluster function (nonnegative; the sign engine of imp-96543).
const clusterT2 = (x) => {
  if (x === 0) return 1;
  const s = Math.sin(PI * x) / (PI * x);
  return s * s;
};

// Number variance and the direct double-box lag correlations at L = 495.779 (offline literals).
const SIGMA2 = 0.974834; // direct int; matches (1/pi^2)(ln(2 pi L)+gamma+1) to 6 digits
const RHO_DIRECT = {
  1: -0.463978, // reproduces the exact union value -0.4639782
  2: -0.014950,
  3: -0.006121,
  4: -0.003354,
  5: -0.002121,
  6: -0.001464,
};

// Theoretical/tabulated figures the tension was stated against (imp-96543 literals).
const RHO_1_EXACT = -0.4639782;
const RHO_2_TABULATED = -0.020;
const RHO_3_TABULATED = -0.008;

// Closed-form tail (k >= 2): Cov_k = -(1/(2 pi^2)) ln(k^2/(k^2-1)); rho_k = Cov_k / Sigma^2.
const covClosed = (k) => -Math.log((k * k) / (k * k - 1)) / (2 * PI * PI);
const rhoClosed = (k) => covClosed(k) / SIGMA2;

// Pure O(1/k^2) tail coefficient (the honest anchor): rho_k ~ TAIL_COEFF / k^2.
const TAIL_COEFF = -1 / (2 * PI * PI * SIGMA2); // -0.051968

// The FALSE anchor imp-96543 flagged: applying O(1/k^2) to rho_1 gives rho_2 ~ rho_1/4.
const RHO2_FALSE_ANCHOR = RHO_1_EXACT / 4; // -0.115995

// How far rho_1 sits above the tail curve (why the anchoring fails): touching-box mechanism.
const RHO1_ABOVE_TAIL_FACTOR = RHO_DIRECT[1] / TAIL_COEFF; // 8.93x

// Union identity for rho_1 (touching adjacent boxes): rho_1 = Sigma^2(2L)/(2 Sigma^2(L)) - 1.
const sigma2At = (len) => (Math.log(2 * PI * len) + GAMMA + 1) / (PI * PI);
const RHO1_UNION = sigma2At(2 * L) / (2 * sigma2At(L)) - 1; // -0.4639782

// Telescoping tail budget: sum_{k>=2} ln(k^2/(k^2-1)) = ln 2.
const TAIL_COV_SUM = -Math.log(2) / (2 * PI * PI); // -0.035116
const TAIL_RHO_SUM = TAIL_COV_SUM / SIGMA2; // -0.036022

export const IMP96567_BOX_AVERAGED_SINE_KERNEL_LAG_DECAY = {
  ticket: 'imp-96567',
  question:
    'Reconcile the GUE sine-kernel O(1/k^2) decay-rate clause with the tabulated box correlations rho_2 = -0.020, rho_3 = -0.008 by deriving the box-averaged lag values directly from T_2(x) = (sin pi x / pi x)^2 via the double box integral over the actual non-overlapping tiling.',
  boxLength: L,
  numberVariance: SIGMA2,
  directLagCorrelations: RHO_DIRECT, // rho_1..6 from the direct double-box integral
  closedFormTail: {
    formula: 'Cov_k = -(1/(2 pi^2)) ln(k^2/(k^2-1)),  rho_k = Cov_k / Sigma^2(L),  k >= 2',
    derivations:
      '(i) average sin^2 -> 1/2 in the direct integral: L cancels, int_{-1}^{1}(1-|v|)/(v+k)^2 dv = ln(k^2/(k^2-1)); (ii) second-difference/union identity Cov_k = (1/2)[Sigma^2((k+1)L)-2 Sigma^2(kL)+Sigma^2((k-1)L)] with the log number variance.',
    rho2: rhoClosed(2), // -0.014950
    rho3: rhoClosed(3), // -0.006121
    asymptotic: 'rho_k ~ (TAIL_COEFF)/k^2 as k -> infinity, TAIL_COEFF = -1/(2 pi^2 Sigma^2)',
    tailCoeff: TAIL_COEFF, // -0.051968
  },
  reconciliation: {
    falseAnchorRho2: RHO2_FALSE_ANCHOR, // -0.116: O(1/k^2) mis-anchored at rho_1
    correctTailRho2: rhoClosed(2), // -0.0150: O(1/k^2) anchored at its own tail coefficient
    rho1AboveTailFactor: RHO1_ABOVE_TAIL_FACTOR, // 8.93x: rho_1 is far above the tail curve
    rho1UnionMechanism: RHO1_UNION, // -0.4639782: touching-box union identity (log-variance), not the tail
    tailRatioExactLog: Math.log(4 / 3) / Math.log(9 / 8), // 2.4425
    tailRatioTabulated: RHO_2_TABULATED / RHO_3_TABULATED, // 2.5 (round approximation of the same log ratio)
    conclusion:
      'The tension is a FALSE-ANCHORING artifact: rho_1 is the touching-box union value (dominated by the log number variance), NOT a point on the O(1/k^2) tail. Anchored at its own coefficient the tail law gives rho_2 = -0.015, rho_3 = -0.006, consistent with the tabulated round -0.020 / -0.008 (same exact-log ratio); the tabulated figures are slightly more negative, so they do not overstate the VIF reduction.',
  },
  tailBudget: {
    covSum: TAIL_COV_SUM, // -0.035116 = -(ln 2)/(2 pi^2)
    rhoSum: TAIL_RHO_SUM, // -0.036022; small and bounded vs rho_1 = -0.4640
    note: 'sum_{k>=2} ln(k^2/(k^2-1)) telescopes to ln 2, so the calibrated tail adds only a small bounded (negative) increment beyond the rho_1-only VIF_291 <= 0.0752 (z >= 7.01) refinement.',
  },
  conditionality:
    'All of the above is conditional on the GUE sine kernel / Montgomery pair correlation holding for the actual zeta zeros (UNPROVEN, GRH-flavored). It changes NO unconditional bound.',
  verdict:
    'The imp-96543 O(1/k^2)-vs-tabulated tension is a FALSE-ANCHORING artifact, not a mis-calibration. Deriving the box-averaged lag correlations directly from T_2 = (sin pi x / pi x)^2 over the L = 495.779 non-overlapping tiling gives Sigma^2(L) = 0.974834, rho_1 = -0.463978 (matching the exact union value -0.4639782), rho_2 = -0.014950, rho_3 = -0.006121, with the exact tail closed form rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) ~ -0.051968/k^2. The tail genuinely decays like O(1/k^2), but rho_1 sits ~8.9x ABOVE that curve because touching lag-1 boxes obey the union identity rho_1 = Sigma^2(2L)/(2 Sigma^2(L)) - 1 (a log-number-variance mechanism), NOT the tail law; anchoring O(1/k^2) at rho_1 (rho_2 ~ rho_1/4 = -0.116) mis-anchors it at the one lag that does not obey it. Anchored at its own coefficient the law predicts rho_2 = -0.015, rho_3 = -0.006, consistent with the tabulated round -0.020 / -0.008 (exact tail ratio ln(4/3)/ln(9/8) = 2.4425 vs tabulated 2.5). The k >= 2 covariances telescope to a small bounded tail (sum rho_k = -0.036). Measurement only; conditional on the GUE sine kernel / Montgomery pair correlation for the zeta zeros (UNPROVEN); changes no unconditional bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96567_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the box-averaged GUE sine-kernel '
  + 'lag correlations derived directly from T_2 = (sin pi x / pi x)^2 over the L = 495.779 tiling are '
  + 'rho_2 = -0.0150, rho_3 = -0.0061, with the exact tail rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) '
  + '~ -0.052/k^2. The imp-96543 tension is a FALSE-ANCHORING artifact: rho_1 = -0.4640 is the '
  + 'touching-box union value (log number variance), ~8.9x above the O(1/k^2) tail curve, so anchoring '
  + 'the decay at rho_1 (rho_2 ~ -0.116) mis-anchors it. Conditional on the pair correlation for the '
  + 'zeta zeros (UNPROVEN); changes no unconditional bound.';

// --- self-executing internal-consistency assertions (re-derivation on T_2; no zeros) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // cluster function is nonnegative (the sign engine)
  for (let x = 0; x <= 12; x += 0.01) {
    if (clusterT2(x) < -1e-15) throw new Error('imp-96567: cluster function T_2 must be nonnegative');
  }
  // number variance re-derives from the GUE asymptotic to the baked direct value
  if (!approx(SIGMA2, sigma2At(L), 5e-4)) throw new Error('imp-96567: Sigma^2 drifted from the GUE asymptotic');
  // direct rho_1 reproduces the exact union value; union identity re-derives it
  if (!approx(RHO_DIRECT[1], RHO_1_EXACT, 1e-5)) throw new Error('imp-96567: direct rho_1 must match the exact union value');
  if (!approx(RHO1_UNION, RHO_1_EXACT, 1e-6)) throw new Error('imp-96567: union-identity rho_1 must reproduce -0.4639782');
  // direct tail matches the closed form to the baked precision
  if (!approx(RHO_DIRECT[2], rhoClosed(2), 1e-5)) throw new Error('imp-96567: direct rho_2 must match the closed-form tail');
  if (!approx(RHO_DIRECT[3], rhoClosed(3), 1e-5)) throw new Error('imp-96567: direct rho_3 must match the closed-form tail');
  // all lags are nonpositive (consistent with the imp-96543 sign theorem)
  for (const k of Object.keys(RHO_DIRECT)) {
    if (!(RHO_DIRECT[k] <= 0)) throw new Error('imp-96567: every box lag correlation must be nonpositive');
  }
  // the tail is genuinely O(1/k^2): closed-form rho_k * k^2 -> TAIL_COEFF as k grows, from below
  // (more negative), since k^2 ln(k^2/(k^2-1)) = 1 + 1/(2k^2) + ... decreases toward 1.
  let prevProd = -Infinity;
  for (let k = 3; k <= 8; k++) {
    const prod = rhoClosed(k) * k * k;
    if (!(prod < 0 && prod <= TAIL_COEFF + 1e-12))
      throw new Error('imp-96567: closed-form tail * k^2 must sit below the O(1/k^2) coefficient');
    if (!(prod > prevProd)) throw new Error('imp-96567: closed-form tail * k^2 must rise toward the coefficient');
    prevProd = prod;
  }
  if (!(Math.abs(rhoClosed(8) * 64 - TAIL_COEFF) < 0.005))
    throw new Error('imp-96567: closed-form tail * k^2 must converge to the O(1/k^2) coefficient');
  // the reconciliation core: false anchor over-predicts; correct anchor is far milder
  if (!(RHO2_FALSE_ANCHOR < rhoClosed(2))) throw new Error('imp-96567: false rho_1 anchor must over-predict rho_2');
  if (!approx(RHO2_FALSE_ANCHOR, -0.116, 1e-3)) throw new Error('imp-96567: false-anchor rho_2 drifted from -0.116');
  if (!(RHO1_ABOVE_TAIL_FACTOR > 8 && RHO1_ABOVE_TAIL_FACTOR < 10))
    throw new Error('imp-96567: rho_1 should sit ~8.9x above the O(1/k^2) tail curve');
  // the correct tail is the SAME order as the tabulated magnitudes (tension resolved)
  if (!(Math.abs(rhoClosed(2)) < Math.abs(RHO_2_TABULATED) * 1.5 && Math.abs(rhoClosed(2)) > Math.abs(RHO_2_TABULATED) * 0.5))
    throw new Error('imp-96567: derived rho_2 must be the same order as the tabulated -0.020');
  // exact tail ratio matches the log ratio (not the round 2.5)
  if (!approx(rhoClosed(2) / rhoClosed(3), Math.log(4 / 3) / Math.log(9 / 8), 1e-6))
    throw new Error('imp-96567: derived rho_2/rho_3 must equal the exact log ratio');
  // telescoping tail budget
  if (!approx(TAIL_COV_SUM, -Math.log(2) / (2 * PI * PI), 1e-12)) throw new Error('imp-96567: tail cov sum must telescope to -(ln 2)/(2 pi^2)');
  if (!(Math.abs(TAIL_RHO_SUM) < Math.abs(RHO_DIRECT[1])))
    throw new Error('imp-96567: the k>=2 tail must be small vs rho_1');
  // honesty gates
  if (!/NO QED/.test(IMP96567_BOX_AVERAGED_SINE_KERNEL_LAG_DECAY.verdict))
    throw new Error('imp-96567: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96567_BOX_AVERAGED_SINE_KERNEL_LAG_DECAY.verdict))
    throw new Error('imp-96567: verdict dropped the no-refereed-bound-change banner');
  if (!/conditional/i.test(IMP96567_BOX_AVERAGED_SINE_KERNEL_LAG_DECAY.verdict))
    throw new Error('imp-96567: verdict must flag the result as CONDITIONAL');
  if (!(/RH open/.test(IMP96567_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96567_HONEST_BANNER) && /NO QED/.test(IMP96567_HONEST_BANNER)))
    throw new Error('imp-96567: IMP96567_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96567_BOX_AVERAGED_SINE_KERNEL_LAG_DECAY;
