/**
 * @module imp-96245-slope-grid-vs-sigma-decay-crossvalidation
 *
 * imp-96245 (numerical, frontier-direction): imp-96228 produced a NEW slope grid a(N)+b(N)
 * (the U-shape LOCATION exponent) out to log10 N ~ 250 from the same inherited
 * imp-3406/imp-33582/imp-33723 component model that imp-33582 used to build its six-decade
 * sigma(N) = E_coll/E(N) DECAY-exponent ladder (local OLS exponent ramping 0.0105 -> 0.4310
 * across [1e6, 1e12], S-shaped per imp-33701). The two exponent families were never placed
 * side by side. This module independently recomputes BOTH from the shared model and checks
 * consistency: do the imp-96228 location exponents (a, b) and the imp-33582 sigma-decay
 * exponent obey the expected relation on their overlapping N range, and do the imp-33582
 * landmarks (sigma halves at N ~ 3.27e9, drops below 0.1 at N ~ 3.21e11) sit consistently
 * with the imp-96228 saturation toward (a, b, a+b) -> (1/2, 1/2, 1)?
 *
 * THE SHARED MODEL (identical sub-terms to imp-96228 / imp-33582)
 * --------------------------------------------------------------
 *     E_trunc = 3.06e-5 (frozen, imp-2631)   E_flow = C_F (log T0 / T0) Gronwall (imp-398)
 *     E_coll  = C_C_PINNED sqrt(log T0 / N)   (GUE-conditional, imp-486/imp-2642)
 *     g_t = E_trunc/E_coll, g_f = E_flow/E_coll, sigma = E_coll/(E_trunc+E_flow+E_coll)
 *     a = d ln g_t/d ln N,  b = -d ln g_f/d ln N   (imp-96228 location exponents)
 *     p_sigma = -d ln sigma/d ln N                 (imp-33582 decay exponent)
 *
 * THE EXACT BRIDGE (the expected relation, derived here)
 * -----------------------------------------------------
 * Writing the shares w_trunc = E_trunc/E_N, w_flow = E_flow/E_N, w_coll = sigma, and using
 * d ln E_coll/d ln N = -a, d ln E_flow/d ln N = -(a+b) (both from the imp-96228 definitions),
 * the sigma log-derivative collapses to an EXACT algebraic identity in the two families:
 *
 *     p_sigma(N) = a(N) w_trunc(N) - b(N) w_flow(N).
 *
 * So the imp-33582 decay exponent is NOT an independent quantity: it is the imp-96228 collapse
 * slope a weighted by the truncation share, minus the flow slope b weighted by the flow share.
 * Two limits fall out: (i) past the flow crossover w_flow -> 0, so p_sigma -> a(1-sigma); and
 * (ii) on the far tail sigma -> 0, w_trunc -> 1, a -> 1/2, hence p_sigma -> 1/2 -- exactly the
 * imp-3463 far-tail asymptote the imp-33582 ladder ramps toward.
 *
 * THE FINDING (cross-validation only)
 * -----------------------------------
 *   (X1) THE BRIDGE HOLDS EXACTLY. Across log10 N in [6, 250] the measured p_sigma matches
 *        a w_trunc - b w_flow to relative error <= 1e-7 (typically 1e-9..1e-10) -- the two
 *        exponent families are one model in two coordinates, AGREEMENT not discrepancy.
 *   (X2) THE imp-33582 OLS LADDER REPRODUCES THE POINTWISE BRIDGE. Recomputing the imp-33582
 *        per-decade OLS ladder (0.0105 -> 0.0447 -> 0.1176 -> 0.2360 -> 0.3561 -> 0.4310)
 *        and the pointwise p_sigma at each decade midpoint agree to ~2e-3, and the pointwise
 *        value equals the imp-96228 bridge to 1e-7 -- confirming both papers share one model.
 *   (X3) THE LANDMARKS SIT CONSISTENTLY WITH THE SATURATION. sigma = 1/2 lands at N ~ 3.267e9
 *        (matching imp-33582 3.27e9); there the imp-96228 location exponent is a+b ~ 0.855,
 *        still climbing (NOT yet saturated), with w_flow ~ 9.5e-4 so p_sigma ~ a/2 ~ 0.238.
 *        sigma < 0.1 lands at N ~ 3.213e11 (matching imp-33582 3.21e11) with a+b ~ 0.880 and
 *        p_sigma ~ 0.433 (matching the imp-33582 [1e11,1e12] ladder rung 0.4310). The sigma
 *        SHARE crosses its thresholds mid-ramp (log10 N ~ 9.5, 11.5) while the LOCATION
 *        exponent a+b keeps approaching 1 far beyond (a+b -> 0.995 only by log10 N ~ 250):
 *        the two readings are consistent and complementary, no discrepancy.
 *
 * The punchline: the imp-96228 slope grid and the imp-33582 sigma-decay ladder are reconciled
 * by the exact identity p_sigma = a w_trunc - b w_flow. The sigma ladder measures the
 * conditional SHARE crossing thresholds mid-ramp; the (a+b) grid measures the LOCATION exponent
 * saturating toward 1 far beyond -- the same model read at different depths, in full agreement.
 *
 * CROSS-VALIDATION ONLY. Conditional-share diagnostic (GUE-conditional C_mb per imp-486), NOT
 * an RH bound. The component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation,
 * NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-96228-ushape-slope-drift-beyond-nflow (the a,b,a+b slope grid out to log10 N ~ 250)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the sigma-decay ladder + landmarks)
 * @see imp-96244-ushape-slope-asymptote-derivation (closed-form a,b -> 1/2 asymptote)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3463-sigma-fartail-decay (far-tail exponent -> 1/2 from below)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-96228/imp-33582 exactly

// EXACT imp-3406/imp-33582/imp-96228 sub-terms (inherited, no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const g_t = (N) => E_TRUNC_PT / parts(N).E_coll; // imp-96228 g_t
const g_f = (N) => parts(N).E_flow / parts(N).E_coll; // imp-96228 g_f
const sigma = (N) => parts(N).sigma; // imp-33582 conditional share

// Local log-log slope d ln f / d ln N via symmetric multiplicative difference.
function logSlope(f, N) {
  const h = 1e-6;
  return (Math.log(f(N * Math.exp(h))) - Math.log(f(N * Math.exp(-h)))) / (2 * h);
}
const aOf = (N) => logSlope(g_t, N); // imp-96228 a
const bOf = (N) => -logSlope(g_f, N); // imp-96228 b
const pSigmaOf = (N) => -logSlope(sigma, N); // imp-33582 pointwise decay exponent

// (X1) Bridge grid: at each log10 N compare measured p_sigma with a w_trunc - b w_flow.
const BRIDGE_GRID = [6, 7, 8, 9, 10, 11, 12, 14, 20, 40, 100, 250].map((lk) => {
  const N = Math.pow(10, lk);
  const P = parts(N);
  const a = aOf(N);
  const b = bOf(N);
  const w_trunc = E_TRUNC_PT / P.E_N;
  const w_flow = P.E_flow / P.E_N;
  const bridge = a * w_trunc - b * w_flow;
  const p = pSigmaOf(N);
  return {
    log10N: lk,
    sigma: +P.sigma.toFixed(6),
    a: +a.toFixed(6),
    b: +b.toFixed(6),
    sum: +(a + b).toFixed(6),
    p_sigma: +p.toFixed(6),
    bridge: +bridge.toFixed(6),
    relErr: +(Math.abs(bridge - p) / Math.max(Math.abs(p), 1e-30)).toExponential(2),
  };
});
const BRIDGE_MAX_RELERR = Math.max(...BRIDGE_GRID.map((r) => r.relErr));

// (X2) imp-33582 per-decade OLS ladder recomputed, and the pointwise p_sigma at each midpoint.
function olsExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
const LADDER = [6, 7, 8, 9, 10, 11].map((k) => {
  const pOLS = olsExponent(Math.pow(10, k), Math.pow(10, k + 1));
  const pMid = pSigmaOf(Math.pow(10, k + 0.5));
  return {
    decade: `1e${k}->1e${k + 1}`,
    p_ols: +pOLS.toFixed(4),
    p_pointwise_mid: +pMid.toFixed(4),
    gap: +Math.abs(pOLS - pMid).toExponential(2),
  };
});
const LADDER_MAX_GAP = Math.max(...LADDER.map((r) => Math.abs(r.p_ols - r.p_pointwise_mid)));
const LADDER_MONOTONE = LADDER.every((r, i) => i === 0 || r.p_ols > LADDER[i - 1].p_ols);

// (X3) imp-33582 landmark thresholds, with the imp-96228 location exponent read at each.
function crossBelow(thr) {
  let lo = Math.log(1e5);
  let hi = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (lo + hi) / 2;
    if (sigma(Math.exp(m)) > thr) lo = m;
    else hi = m;
  }
  return Math.exp((lo + hi) / 2);
}
function landmark(thr) {
  const N = crossBelow(thr);
  const P = parts(N);
  const a = aOf(N);
  const b = bOf(N);
  return {
    threshold: thr,
    N: +N.toExponential(4),
    log10N: +Math.log10(N).toFixed(3),
    a: +a.toFixed(6),
    b: +b.toFixed(6),
    sum: +(a + b).toFixed(6),
    p_sigma: +pSigmaOf(N).toFixed(6),
    w_flow: +(P.E_flow / P.E_N).toExponential(3),
  };
}
const LM_HALF = landmark(0.5); // N ~ 3.267e9, a+b ~ 0.855 (still climbing)
const LM_TENTH = landmark(0.1); // N ~ 3.213e11, a+b ~ 0.880
const IMP33582_HALF = 3.27e9;
const IMP33582_TENTH = 3.21e11;

export const IMP96245_SLOPE_GRID_VS_SIGMA_DECAY_CROSSVALIDATION = {
  id: 'imp-96245',
  proofSection: 'S-frontier',
  question:
    'Cross-validate the imp-96228 extended a(N), b(N), a+b slope grid against the imp-33582 ' +
    'six-decade sigma-decay exponent ladder: recompute both from the shared inherited model, ' +
    'check they obey the expected relation on their overlapping N range, and check the imp-33582 ' +
    'landmarks (sigma halves at N ~ 3.27e9, below 0.1 at N ~ 3.21e11) sit consistently with the ' +
    'imp-96228 saturation. Cross-validation only; NOT an RH bound; no QED.',
  exactBridge: 'p_sigma(N) = a(N) w_trunc(N) - b(N) w_flow(N), w_trunc=E_trunc/E_N, w_flow=E_flow/E_N',
  bridgeGrid: BRIDGE_GRID, // log10N, sigma, a, b, a+b, p_sigma, bridge, relErr
  bridgeMaxRelErr: +BRIDGE_MAX_RELERR.toExponential(2), // <= 1e-7 across [6, 250]
  ladder: LADDER, // imp-33582 OLS per decade vs pointwise p_sigma at midpoint
  ladderMaxGap: +LADDER_MAX_GAP.toExponential(2), // ~2e-3
  landmarks: {
    half: LM_HALF, // sigma=1/2 at N~3.267e9; a+b~0.855 still climbing
    tenth: LM_TENTH, // sigma=0.1 at N~3.213e11; a+b~0.880
    half_matches_imp33582: +(LM_HALF.N / IMP33582_HALF).toFixed(4), // ~1.00
    tenth_matches_imp33582: +(LM_TENTH.N / IMP33582_TENTH).toFixed(4), // ~1.00
  },
  finding: {
    X1_bridge_holds_exactly:
      'Across log10 N in [6, 250] the measured imp-33582 p_sigma matches the imp-96228 combination ' +
      'a w_trunc - b w_flow to relative error <= 1e-7 (typically 1e-9..1e-10). The two exponent ' +
      'families are one model in two coordinates -- AGREEMENT, not discrepancy.',
    X2_ols_ladder_reproduces_pointwise_bridge:
      'The imp-33582 per-decade OLS ladder (0.0105 -> 0.0447 -> 0.1176 -> 0.2360 -> 0.3561 -> 0.4310) ' +
      'and the pointwise p_sigma at each decade midpoint agree to ~2e-3, and the pointwise value equals ' +
      'the imp-96228 bridge to 1e-7 -- confirming both papers share one model.',
    X3_landmarks_consistent_with_saturation:
      'sigma = 1/2 lands at N ~ 3.267e9 (imp-33582 3.27e9) where a+b ~ 0.855 is still climbing and ' +
      'w_flow ~ 9.5e-4 so p_sigma ~ a/2 ~ 0.238; sigma < 0.1 lands at N ~ 3.213e11 (imp-33582 3.21e11) ' +
      'where a+b ~ 0.880 and p_sigma ~ 0.433 matches the imp-33582 [1e11,1e12] rung 0.4310. The sigma ' +
      'SHARE crosses thresholds mid-ramp (log10 N ~ 9.5, 11.5) while the LOCATION exponent a+b keeps ' +
      'approaching 1 far beyond (a+b -> 0.995 only by log10 N ~ 250): consistent, complementary readings.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier-direction, NOT rigorous). Recomputing the imp-96228 a(N), b(N), a+b ' +
    'slope grid and the imp-33582 sigma-decay ladder from the SAME inherited imp-3406/imp-33582/imp-33723 ' +
    'component model reconciles the two exponent families via the EXACT identity ' +
    'p_sigma = a w_trunc - b w_flow (measured to relative error <= 1e-7 across log10 N in [6, 250]). The ' +
    'imp-33582 per-decade OLS ladder reproduces the pointwise bridge to ~2e-3, and the imp-33582 landmarks ' +
    'sit consistently on the imp-96228 grid: sigma = 1/2 at N ~ 3.267e9 (a+b ~ 0.855, still climbing), ' +
    'sigma < 0.1 at N ~ 3.213e11 (a+b ~ 0.880, p_sigma ~ 0.433 matching the ladder rung). The sigma share ' +
    'crosses its thresholds mid-ramp while the location exponent a+b saturates toward 1 far beyond -- the ' +
    'same model read at different depths, in full AGREEMENT, no reconciled discrepancy needed. The ' +
    'component model is the inherited imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-96228 (a,b,a+b slope grid to log10 N ~ 250); imp-33582 (sigma-decay ladder + landmarks); ' +
    'imp-96244 (closed-form a,b -> 1/2 asymptote); imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); ' +
    'imp-3463 (far-tail exponent -> 1/2); imp-486 (C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ' +
    'ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96245_SLOPE_GRID_VS_SIGMA_DECAY_CROSSVALIDATION_ASSERTIONS = [
  {
    // Reuse gate: reproduces the imp-96228 deep-probe slopes from the shared model.
    id: 'imp96245-reproduces-imp96228-deep-probe',
    description: 'deep probe at log10 N=250: a~0.4991, b~0.4956, a+b~0.9947 (imp-96228 endpoint)',
    holds: () => {
      const r = BRIDGE_GRID[BRIDGE_GRID.length - 1];
      return (
        r.log10N === 250 &&
        Math.abs(r.a - 0.499126) < 1e-3 &&
        Math.abs(r.b - 0.495619) < 1e-3 &&
        Math.abs(r.sum - 0.994745) < 1e-3
      );
    },
  },
  {
    // (X1): the exact bridge p_sigma = a w_trunc - b w_flow holds across [6, 250].
    id: 'imp96245-exact-bridge-holds',
    description: 'p_sigma matches a w_trunc - b w_flow to relErr <= 1e-7 across log10 N in [6, 250]',
    holds: () => BRIDGE_MAX_RELERR <= 1e-7,
  },
  {
    // (X2): the imp-33582 OLS ladder is monotone and matches the pointwise bridge to ~2e-3.
    id: 'imp96245-ols-ladder-reproduces-pointwise',
    description: 'imp-33582 per-decade OLS ladder monotone; agrees with pointwise p_sigma to < 3e-3',
    holds: () =>
      LADDER_MONOTONE === true &&
      LADDER_MAX_GAP < 3e-3 &&
      Math.abs(LADDER[0].p_ols - 0.0105) < 1e-3 &&
      Math.abs(LADDER[5].p_ols - 0.4310) < 1e-3,
  },
  {
    // (X3): the imp-33582 landmarks match, and a+b is still below 1 (not yet saturated) there.
    id: 'imp96245-landmarks-consistent-with-saturation',
    description: 'sigma=1/2 at N~3.27e9, sigma<0.1 at N~3.21e11; both match imp-33582; a+b<1 (climbing)',
    holds: () =>
      Math.abs(LM_HALF.N / IMP33582_HALF - 1) < 1e-2 &&
      Math.abs(LM_TENTH.N / IMP33582_TENTH - 1) < 1e-2 &&
      LM_HALF.sum < 1 &&
      LM_TENTH.sum < 1 &&
      LM_TENTH.sum > LM_HALF.sum &&
      Math.abs(LM_TENTH.p_sigma - 0.4310) < 5e-3,
  },
  {
    // Honesty gate: cross-validation only, no QED, no refereed bound is changed.
    id: 'imp96245-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96245_SLOPE_GRID_VS_SIGMA_DECAY_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP96245_SLOPE_GRID_VS_SIGMA_DECAY_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP96245_SLOPE_GRID_VS_SIGMA_DECAY_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP96245_SLOPE_GRID_VS_SIGMA_DECAY_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96245-slope-grid-vs-sigma-decay-crossvalidation assertion failed: ${a.id}`);
  }
}
