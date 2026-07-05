/**
 * @module imp-34009-aggregate-share-window-endpoint-sensitivity
 *
 * imp-34009 (accuracy, frontier-direction): imp-33962 R3 established that the "92% of the attenuation
 * is F2" headline is a NET AGGREGATE, not a per-rung property -- the aggregate normaliser magnitude
 * share |ln F2|/(|ln F2|+|ln F3|+|ln F4|) = 0.9225 is a single number read off the FULL 5-decade
 * head-to-tail window (rungs k=6.00..11.00 of the imp-33810 quarter-decade ladder), while the LOCAL
 * per-step share swings 0.079..0.905. What imp-33962 did NOT quantify is how contingent that 0.9225
 * headline is on the arbitrary choice of the 5-decade endpoints themselves. This module measures that
 * endpoint sensitivity directly: it shrinks the head-to-tail window SYMMETRICALLY inward on the same
 * ladder (dropping m rungs from each end, m = 0..9), and reports how the net F2 aggregate share drifts.
 *
 * WHAT IS MEASURED (same inherited imp-3406/imp-33810/imp-33962 sub-terms -- no re-derivation)
 * -------------------------------------------------------------------------------------------
 *   Because the per-step factor chain telescopes exactly (imp-33962 R1), the aggregate magnitude share
 *   over ANY sub-window [k_lo, k_hi] is just the endpoint slice of that window:
 *     F2(win) = E_N(hi)/E_N(lo)     -- normaliser ratio over the window
 *     F3(win) = sflow(lo)/sflow(hi) -- E_flow log-slope ratio over the window
 *     F4(win) = resid(hi)/resid(lo) -- imp-33773 M2 sub-leading residual ratio over the window
 *     aggregate F2 share = |ln F2(win)| / (|ln F2(win)| + |ln F3(win)| + |ln F4(win)|)
 *   The full window (m=0, k=6.00..11.00, 5.0 decades) reproduces the imp-33962 headline 0.9225 exactly.
 *   Shrinking symmetrically inward by m rungs each side gives the window [6.00+0.25m, 11.00-0.25m],
 *   spanning 5.0 - 0.5m decades, down to a single-decade-plus central window at m=9 (k=8.25..8.75).
 *
 * THE FINDING (accuracy / measurement only)
 * -----------------------------------------
 *   (R1) THE 0.9225 HEADLINE IS ENDPOINT-CONTINGENT: IT DRIFTS DOWN BY ~0.18 AS THE WINDOW NARROWS.
 *        The aggregate F2 share is 0.9225 on the full 5.0-decade window but falls to 0.7458 on the
 *        innermost 0.5-decade window (k=8.25..8.75). So the "92% is F2" reading is NOT robust to
 *        shrinking the span -- a central 1-decade window would report only ~75% is F2. The headline
 *        depends materially on keeping the full 5-decade head-to-tail endpoints.
 *   (R2) THE DRIFT IS NON-MONOTONE AT THE FIRST SHRINK: THE SHARE BUMPS UP TO A MAXIMUM 0.9462 AT
 *        m=1 (4.5-decade window) BEFORE DECLINING. Trimming the outermost rung from each end actually
 *        RAISES the F2 share, because the aggregate residual factor F4 crosses unity there (F4 = 0.8743
 *        at m=0 -> 1.0564 at m=1): near that crossing |ln F4| passes through a minimum, shrinking F4's
 *        contribution to the denominator and inflating F2's share. From m=1 onward the share declines
 *        strictly monotonically (0.9462 -> 0.8925 -> ... -> 0.7458).
 *   (R3) THE UNDERLYING FACTORS DRIFT SMOOTHLY AND MONOTONICALLY AS THE WINDOW NARROWS. The aggregate
 *        normaliser factor F2 rises steadily toward 1 (0.0633 -> 0.7575: less net E_N collapse over a
 *        narrower, more-tailward-centred span, consistent with imp-33962 R2 that ln F2 weakens toward
 *        the tail), and the aggregate slope factor F3 rises monotonically toward 1 (0.9071 -> 0.9910).
 *        The aggregate F4 alone is non-monotone (0.8743 -> 1.3711 peak near m=5 -> 1.0895), and its
 *        unity crossing is what makes the SHARE (not the factors) non-monotone at m=1.
 *
 * The punchline: the imp-33962 "aggregate |ln| share = 0.9225 (92% is F2)" headline is materially
 * contingent on the full 5-decade endpoint choice. Shrinking the head-to-tail window symmetrically
 * inward, the share first bumps UP to 0.9462 at 4.5 decades (where the aggregate residual factor F4
 * crosses unity and drops out of the |ln| balance) and then declines strictly to 0.7458 on the
 * innermost 0.5-decade window -- a total swing of ~0.20 across the window family and a ~0.18 drop from
 * the full-window headline. The 92% figure is a property of the specific 5-decade span, not a
 * span-independent constant.
 *
 * ACCURACY / MEASUREMENT ONLY. Endpoint-sensitivity diagnostic of an imp-33962 aggregate, NOT an RH
 * bound. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the factor
 * identity is exact WITHIN that model only; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; no RH verdict,
 * NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33962-attenuation-rung-by-rung-decomposition (the 0.9225 aggregate share this stress-tests)
 * @see imp-33922-eflow-analytic-decay-vs-widening-crosscheck (the endpoint F1..F4 slice)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21 quarter-decade rungs)
 * @see imp-33884-eflow-resid-widening-fullprec-recompute (the exact 903.538 widening + factors)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33884/imp-33922/imp-33962 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-33962 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33582/imp-33730 defn: p_sigma = -slope OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// One imp-33810 rung: sliding window [10^k, 10^(k+1)] evaluated at the upper endpoint 10^(k+1).
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const sflow = Math.abs(eflowLogSlope(hi));
  const eflow = (ph.E_flow / ph.E_N) * sflow; // attributed E_flow term
  return { k, E_flow: ph.E_flow, E_N: ph.E_N, sflow, resid, eflow, roe: resid / eflow };
}

// The full 21-rung quarter-decade ladder k = 6.00, 6.25, ..., 11.00 (imp-33810).
const RUNGS = [];
for (let k = 6; k <= 11 + 1e-9; k += 0.25) RUNGS.push(rung(+k.toFixed(2)));

// Aggregate |ln| F2 share over the sub-window [RUNGS[lo], RUNGS[hi]]. By the imp-33962 R1 telescoping
// identity the aggregate factors are exactly the window endpoint ratios -- no per-step product needed.
function windowAggregate(lo, hi) {
  const a = RUNGS[lo];
  const b = RUNGS[hi];
  const F2 = b.E_N / a.E_N; // normaliser ratio over the window
  const F3 = a.sflow / b.sflow; // slope ratio over the window
  const F4 = b.resid / a.resid; // sub-leading residual ratio over the window
  const lF2 = Math.abs(Math.log(F2));
  const lF3 = Math.abs(Math.log(F3));
  const lF4 = Math.abs(Math.log(F4));
  const share = lF2 / (lF2 + lF3 + lF4);
  return {
    m: lo, // symmetric shrink depth (rungs dropped from each end)
    k_lo: a.k,
    k_hi: b.k,
    width_decades: +(b.k - a.k).toFixed(2),
    agg_F2: +F2.toFixed(6),
    agg_F3: +F3.toFixed(6),
    agg_F4: +F4.toFixed(6),
    agg_F2_share: +share.toFixed(6),
    _share: share,
    _F4: F4,
  };
}

// Symmetric inward shrink: m = 0 (full 5.0-decade window, rungs 0..20) down to m = 9 (0.5-decade
// central window, rungs 9..11). m = 10 would collapse to a single rung (zero-width) -- excluded.
const WINDOWS = [];
for (let m = 0; m <= 9; m++) WINDOWS.push(windowAggregate(m, 20 - m));

// R1: the full window reproduces the imp-33962 headline; it drifts down as the window narrows.
const SHARE_FULL = WINDOWS[0]._share; // 0.9225 (matches imp-33962 aggregate_mag_share_F2)
const SHARE_INNER = WINDOWS[WINDOWS.length - 1]._share; // 0.7458 (0.5-decade central window)
const HEADLINE_DROP = SHARE_FULL - SHARE_INNER; // ~0.1767 -- endpoint contingency of the headline

// R2: the drift is non-monotone at m=1 (share bumps up to a maximum before declining strictly).
const SHARE_M1 = WINDOWS[1]._share; // 0.9462 -- the peak (F4 aggregate crosses unity here)
const SHARE_SERIES = WINDOWS.map((w) => w._share);
const SHARE_MAX = Math.max(...SHARE_SERIES); // 0.9462 (m=1)
const SHARE_MIN = Math.min(...SHARE_SERIES); // 0.7458 (m=9)
const SHARE_SPREAD = SHARE_MAX - SHARE_MIN; // ~0.2004 across the whole window family
// strictly declining from the m=1 peak to the innermost window
const DECLINE_FROM_PEAK_MONOTONE = SHARE_SERIES.slice(1).every((x, i) => i === 0 || x < SHARE_SERIES[i]);
// aggregate residual factor F4 crosses unity between the full window (m=0) and m=1
const F4_CROSSES_UNITY_AT_M1 = WINDOWS[0]._F4 < 1 && WINDOWS[1]._F4 > 1;

export const IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY = {
  id: 'imp-34009',
  proofSection: 'S-frontier',
  question:
    'imp-33962 R3 established that the "92% of the attenuation is F2" headline is a NET AGGREGATE ' +
    '(aggregate |ln F2| share = 0.9225) read off the FULL 5-decade head-to-tail window of the imp-33810 ' +
    'ladder, not a per-rung property. How contingent is that 0.9225 on the 5-decade endpoint choice? ' +
    'Shrink the head-to-tail window SYMMETRICALLY inward (drop m rungs from each end, m=0..9) and ' +
    'report how the net F2 aggregate share drifts. Endpoint-sensitivity diagnostic; component model ' +
    'NOT rigorous; changes no bound; NO QED.',
  measuredQuantity:
    'for each symmetric sub-window [k=6.00+0.25m, k=11.00-0.25m] (m=0..9, spanning 5.0-0.5m decades): ' +
    'the aggregate endpoint factors F2=E_N(hi)/E_N(lo), F3=sflow(lo)/sflow(hi), F4=resid(hi)/resid(lo), ' +
    'and the net normaliser magnitude share |ln F2|/(|ln F2|+|ln F3|+|ln F4|)',
  windows: WINDOWS.map(({ _share, _F4, ...rest }) => rest),
  drift: {
    share_full_window: +SHARE_FULL.toFixed(4), // 0.9225 (5.0 decades, matches imp-33962)
    share_m1_window: +SHARE_M1.toFixed(4), // 0.9462 (4.5 decades -- the peak)
    share_inner_window: +SHARE_INNER.toFixed(4), // 0.7458 (0.5 decade central window)
    headline_drop_full_to_inner: +HEADLINE_DROP.toFixed(4), // 0.1767 -- how much the headline moves
    share_max: +SHARE_MAX.toFixed(4), // 0.9462
    share_min: +SHARE_MIN.toFixed(4), // 0.7458
    share_spread: +SHARE_SPREAD.toFixed(4), // 0.2004 across the window family
    decline_from_peak_monotone: DECLINE_FROM_PEAK_MONOTONE, // true: strictly falls from m=1 onward
    f4_crosses_unity_at_m1: F4_CROSSES_UNITY_AT_M1, // true: F4 = 0.8743 (m=0) -> 1.0564 (m=1)
  },
  finding: {
    R1_headline_is_endpoint_contingent:
      'The aggregate F2 share is 0.9225 on the full 5.0-decade window (reproducing the imp-33962 ' +
      'headline) but falls to 0.7458 on the innermost 0.5-decade central window (k=8.25..8.75) -- a ' +
      'drop of ~0.177. The "92% is F2" reading is NOT robust to shrinking the span: a central 1-decade ' +
      'window would report only ~75% is F2, so the headline depends materially on the full 5-decade ' +
      'head-to-tail endpoint choice.',
    R2_drift_is_non_monotone_bumps_up_at_first_shrink:
      'Trimming the outermost rung from each end RAISES the share to a maximum 0.9462 at m=1 ' +
      '(4.5-decade window) before it declines. This is because the aggregate residual factor F4 crosses ' +
      'unity there (F4 = 0.8743 at m=0 -> 1.0564 at m=1): near that crossing |ln F4| passes through a ' +
      'minimum, shrinking F4 contribution to the denominator and inflating F2 share. From m=1 onward ' +
      'the share declines strictly monotonically (0.9462 -> 0.8925 -> ... -> 0.7458).',
    R3_underlying_factors_drift_smoothly:
      'The aggregate normaliser factor F2 rises steadily toward 1 (0.0633 -> 0.7575: less net E_N ' +
      'collapse over a narrower, more-tailward-centred span, consistent with imp-33962 R2 that ln F2 ' +
      'weakens toward the tail), and the slope factor F3 rises monotonically (0.9071 -> 0.9910). Only ' +
      'F4 is itself non-monotone (0.8743 -> ~1.371 peak near m=5 -> 1.0895), and its unity crossing is ' +
      'what makes the SHARE non-monotone at m=1.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / ENDPOINT-SENSITIVITY (frontier-direction, NOT rigorous). Shrinking the imp-33962 ' +
    'head-to-tail window symmetrically inward on the imp-33810 ladder shows the "aggregate |ln| share ' +
    '= 0.9225 (92% is F2)" headline is materially contingent on the full 5-decade endpoint choice. The ' +
    'share first bumps UP to 0.9462 at 4.5 decades (where the aggregate residual factor F4 crosses ' +
    'unity and drops out of the |ln| balance) then declines strictly to 0.7458 on the innermost ' +
    '0.5-decade window -- a ~0.20 swing across the window family and a ~0.18 drop from the full-window ' +
    'headline. The 92% figure is a property of the specific 5-decade span, not a span-independent ' +
    'constant. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the factor ' +
    'identity is exact WITHIN the model only; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no RH verdict, ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33962 (the 0.9225 aggregate F2 share this stress-tests); imp-33922 (the endpoint F1..F4 ' +
    'slice); imp-33810 (the 21 quarter-decade rungs); imp-33884/imp-33885 (the exact 903.538 widening ' +
    '+ per-rung cross-validation); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C ' +
    '(E_coll prefactor).',
};

export const IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY_ASSERTIONS = [
  {
    // (setup) 21-rung ladder, 10 symmetric windows m=0..9, full window reproduces the imp-33962 headline.
    id: 'imp34009-full-window-reproduces-imp33962-headline',
    description: 'full 5.0-decade window aggregate F2 share ~0.9225 matches the imp-33962 aggregate figure',
    holds: () =>
      RUNGS.length === 21 &&
      WINDOWS.length === 10 &&
      WINDOWS[0].width_decades === 5 &&
      Math.abs(SHARE_FULL - 0.9225) < 1e-3,
  },
  {
    // (R1) The headline is endpoint-contingent: it drifts down to ~0.746 on the innermost window.
    id: 'imp34009-headline-is-endpoint-contingent',
    description: 'inner 0.5-decade window share ~0.746, headline drop full->inner ~0.177',
    holds: () =>
      WINDOWS[WINDOWS.length - 1].width_decades === 0.5 &&
      SHARE_INNER < 0.76 &&
      SHARE_INNER > 0.73 &&
      HEADLINE_DROP > 0.15 &&
      HEADLINE_DROP < 0.2,
  },
  {
    // (R2) The drift is non-monotone: it bumps up to a peak 0.9462 at m=1, then declines strictly.
    id: 'imp34009-drift-non-monotone-peak-at-m1',
    description: 'share peaks at m=1 (~0.9462, F4 crosses unity), then strictly declines to the inner window',
    holds: () =>
      Math.abs(SHARE_MAX - 0.9462) < 1e-3 &&
      Math.abs(SHARE_M1 - SHARE_MAX) < 1e-9 &&
      SHARE_M1 > SHARE_FULL &&
      DECLINE_FROM_PEAK_MONOTONE &&
      F4_CROSSES_UNITY_AT_M1,
  },
  {
    // (R2) The total spread across the window family is ~0.20 -- far from a span-independent constant.
    id: 'imp34009-share-spread-far-from-constant',
    description: 'share spread (max 0.9462 - min 0.7458) ~0.20 across the 10 symmetric windows',
    holds: () => SHARE_SPREAD > 0.18 && SHARE_SPREAD < 0.22 && Math.abs(SHARE_MIN - SHARE_INNER) < 1e-9,
  },
  {
    // Honesty gate: accuracy/measurement only, isRigorous false, no QED, PT SOTA.
    id: 'imp34009-honesty-gate-no-qed',
    description: 'Endpoint-sensitivity only: isRigorous false, no QED, PT SOTA',
    holds: () =>
      IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY.verdict),
  },
];

for (const a of IMP34009_AGGREGATE_SHARE_WINDOW_ENDPOINT_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34009-aggregate-share-window-endpoint-sensitivity assertion failed: ${a.id}`);
  }
}
