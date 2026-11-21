/**
 * imp-96630 -- Two-term N^{-1/3}(1+c/logN) vs shifted-power N^{-1/3+eps} refit of the imp-96616
 * g_min(N)/y_N extreme-gap ladder, to decide whether the measured -0.3953 exponent is a slow
 * pre-asymptotic logarithmic drift toward the GUE sine-kernel -1/3 or a genuinely steeper power.
 * Accuracy assessment only; conditional on GUE; NO QED. No refereed bound is changed.
 *
 * SETUP. imp-96616 reports a single free-power fit log(ratio) = a + b logN with b = -0.3953,
 * steeper than the GUE extreme-gap law -1/3 = -0.3333, and a ratioOverGue that oscillates
 * 0.90..2.21 with NO monotone trend across N = 50..1e6. A pure power fit cannot separate a
 * genuinely steeper exponent from a slow logarithmic correction that decays to -1/3. We refit the
 * baked 14-rung ladder (GMIN_RATIO_EXTREME_GAP_DECAY.ladder) against two 2-parameter models on the
 * common log(ratio) response scale and compare by SSE and AICc:
 *   Model S (shifted power):  ratio = A N^{-1/3+eps}      -- reproduces the imp-96616 free power.
 *   Model T (two-term):       ratio = A N^{-1/3}(1+c/logN) -- fixed GUE exponent, log correction.
 * Model T is linearized by regressing ratio*N^{1/3} on 1/logN, so A = intercept, c = slope/A.
 * The running-min ladder repeats the ratio at 4 rungs where the argmin zero has not yet moved
 * (N = 100, 20000, 200000, 1e6 duplicate their predecessor); we run BOTH the full 14-rung fit and
 * a DEDUPED 10-rung fit that keeps one point per distinct argmin, since the plateaus are not
 * independent observations.
 *
 * FINDING.
 *   - Model S and Model T fit the ladder EQUALLY WELL. Full 14-rung: SSE_S = 0.6823, SSE_T = 0.6865
 *     (dAICc = AICc_T - AICc_S = +0.09); deduped 10-rung: SSE_S = 0.5652, SSE_T = 0.6174
 *     (dAICc = +0.88). Both |dAICc| are far below the ~2 threshold for a meaningful preference, so
 *     the 14 rungs CANNOT distinguish the two models -- exactly the ambiguity imp-96616 left open.
 *   - Model T fits with c = +6.54 (full) / +6.74 (deduped), i.e. c > 0: the finite-N ratio sits
 *     ABOVE the pure -1/3 line and DECAYS toward it. Its local log-log slope
 *     -1/3 - c/(logN^2 + c logN) equals -0.357 at N = 1e6 and -> -1/3 as N -> infinity. So a model
 *     with the EXACT GUE cube-root asymptotic plus a positive 1/logN pre-asymptotic correction
 *     reproduces the data as well as the steeper free power does.
 *   - The pure single-parameter cube-root A N^{-1/3} (no correction) is worse: dAICc(pure-cube - T)
 *     = +5.02 (full), +1.49 (deduped). It is decisively rejected on the full ladder but only mildly
 *     disfavored once the plateaus are removed -- the running-min plateaus, not real signal, drive
 *     most of the apparent steepening.
 *   - VERDICT: the measured -0.3953 is CONSISTENT with a pre-asymptotic drift toward the GUE -1/3
 *     and is NOT established as genuinely steeper. The data neither confirm nor exclude convergence
 *     to -1/3; a two-term model with fixed -1/3 and c > 0 is statistically tied with the free power.
 *     This does not change the imp-96616 consequence: beating the surrogate 1/log^2 envelope still
 *     demands the (unproved) GUE cube-root small-gaps decay g_min(N)/y_N -> 0.
 */

export const GMIN_TWOTERM_VS_SHIFTED_FIT = {
  id: 'imp-96630',
  source: {
    ladderFrom: 'imp-96616 GMIN_RATIO_EXTREME_GAP_DECAY.ladder (14 rungs, N=50..1e6)',
    reproScript: 'tmp/imp-96630-twoterm-fit.mjs',
    responseScale: 'log(ratio); both models 2 params; AICc = n ln(SSE/n)+2k+2k(k+1)/(n-k-1)',
    plateauNote:
      'running-min repeats ratio at N=100,20000,200000,1e6 (argmin zero unchanged) -- not independent; deduped fit removes them',
  },
  models: {
    shiftedPower: { form: 'A N^{-1/3+eps}', note: 'reproduces imp-96616 free power' },
    twoTerm: { form: 'A N^{-1/3}(1+c/logN)', note: 'fixed GUE exponent, 1/logN correction' },
    pureCube: { form: 'A N^{-1/3}', note: '1 param, pure GUE cube-root, no correction' },
  },
  full14: {
    n: 14,
    shifted: { exponent: -0.3953, eps: -0.062, A: 2.1147, sseLog: 0.68226, aicc: -37.209 },
    twoTerm: { A: 0.687, c: 6.5389, localExponentAt1e6: -0.3566, sseLog: 0.68651, aicc: -37.122 },
    pureCube: { sseLog: 1.1966, aicc: -32.101 },
    dAiccTwoTermMinusShifted: 0.087,
    dAiccPureCubeMinusTwoTerm: 5.021,
  },
  dedup10: {
    n: 10,
    shifted: { exponent: -0.408, eps: -0.0747, A: 2.2463, sseLog: 0.56521, aicc: -23.017 },
    twoTerm: { A: 0.6611, c: 6.7357, localExponentAt1e6: -0.3571, sseLog: 0.61742, aicc: -22.134 },
    pureCube: { sseLog: 0.98811, aicc: -20.646 },
    dAiccTwoTermMinusShifted: 0.884,
    dAiccPureCubeMinusTwoTerm: 1.488,
  },
  verdict: {
    modelsDistinguishable: false,
    dAiccThreshold: 2,
    twoTermCsign: 'positive (c approx +6.5..+6.7) -- ratio above -1/3 line, decays toward it',
    consistentWithMinusOneThird: true,
    genuinelySteeperEstablished: false,
  },
  reading:
    'A two-term A N^{-1/3}(1+c/logN) with the EXACT GUE cube-root asymptotic and a positive log ' +
    'correction (c approx +6.5) fits the imp-96616 ladder as well as the free power N^{-0.3953} ' +
    '(|dAICc| = 0.09 full / 0.88 deduped, both below 2). The measured -0.3953 is therefore ' +
    'consistent with a pre-asymptotic drift toward GUE -1/3 and is NOT established as genuinely ' +
    'steeper; the two-term local exponent is -0.357 at N=1e6 and tends to -1/3. Accuracy only; NO QED.',
};

export default GMIN_TWOTERM_VS_SHIFTED_FIT;
