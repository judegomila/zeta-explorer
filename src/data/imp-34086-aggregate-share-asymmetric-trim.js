/**
 * @module imp-34086-aggregate-share-asymmetric-trim
 *
 * imp-34086 (accuracy, frontier-direction): imp-34009 stress-tested the imp-33962 "92% of the
 * attenuation is F2" headline (aggregate |ln F2| share = 0.9225 on the full 5-decade head-to-tail
 * window k=6.00..11.00 of the imp-33810 quarter-decade ladder) by shrinking that window SYMMETRICALLY
 * inward -- dropping m rungs from BOTH ends at once -- and found the share is endpoint-contingent
 * (drifts down to 0.7458 at the innermost 0.5-decade window, with a non-monotone bump UP to 0.9462 at
 * m=1 where the aggregate residual factor F4 crosses unity). What imp-34009 could NOT separate is WHICH
 * end drives that behaviour, because it always moved both endpoints together. This module measures the
 * ONE-sided variants: trim only the low-N head [6+0.25m, 11] and only the high-N tail [6, 11-0.25m]
 * (m=0..9 each), and attributes the ~0.18 symmetric drift and the m=1 bump to the head vs the tail.
 *
 * WHAT IS MEASURED (same inherited imp-3406/imp-33810/imp-33962 sub-terms -- no re-derivation)
 * -------------------------------------------------------------------------------------------
 *   By the imp-33962 R1 telescoping identity the aggregate magnitude share over ANY sub-window
 *   [k_lo, k_hi] is the endpoint slice of that window:
 *     F2(win) = E_N(hi)/E_N(lo)     -- normaliser ratio over the window
 *     F3(win) = sflow(lo)/sflow(hi) -- E_flow log-slope ratio over the window
 *     F4(win) = resid(hi)/resid(lo) -- imp-33773 M2 sub-leading residual ratio over the window
 *     aggregate F2 share = |ln F2(win)| / (|ln F2(win)| + |ln F3(win)| + |ln F4(win)|)
 *   HEAD-ONLY trim moves ONLY the low endpoint inward: [6.00+0.25m, 11.00] (m=0..9, 5.0-0.25m decades).
 *   TAIL-ONLY trim moves ONLY the high endpoint inward: [6.00, 11.00-0.25m] (m=0..9, 5.0-0.25m decades).
 *   Both families reproduce the imp-33962 headline 0.9225 exactly at m=0 (the shared full window).
 *
 * THE FINDING (accuracy / measurement only)
 * -----------------------------------------
 *   (R1) THE SHARE DROP IS HEAD-DOMINATED. Trimming the low-N head alone collapses the share from
 *        0.9225 to 0.4191 (a drop of ~0.503), roughly TWICE the tail-only drop of ~0.245 (0.9225 ->
 *        0.6772). So the aggregate F2 share is materially more sensitive to WHERE the low-N head sits
 *        than to where the high-N tail sits. Strikingly, BOTH one-sided drops EXCEED the imp-34009
 *        symmetric drop of ~0.177: the symmetric window is the MILDEST because the two ends push the
 *        residual factor F4 in OPPOSITE directions (head trim drives F4 down, tail trim drives it up),
 *        so |ln F4| stays small under symmetric shrink and keeps F2 share artificially elevated.
 *   (R2) THE m=1 NON-MONOTONE BUMP IS TAIL-DRIVEN. Trimming only the tail RAISES the share at m=1 to
 *        0.9386 (> the 0.9225 full window), whereas trimming only the head LOWERS it monotonically to
 *        0.9082 at m=1. So the imp-34009 symmetric bump-up (0.9225 -> 0.9462) inherits its SIGN from
 *        the tail side; the head contributes only a monotone decline. The tail-only share is the only
 *        one of the three families (head, tail, symmetric) whose interior is non-monotone by itself.
 *   (R3) THE F4-CROSSES-UNITY EVENT LIVES ENTIRELY ON THE TAIL. The tail-only residual factor F4 rises
 *        monotonically through unity (0.8743 at m=0 -> 1.0881 at m=1 -> 2.7315 at m=9), while the
 *        head-only F4 falls monotonically and NEVER crosses unity (0.8743 -> 0.3487). Moving the high
 *        endpoint inward pulls resid(hi) toward the deeper interior residual (raising F4); moving the
 *        low endpoint inward raises resid(lo) (lowering F4). The imp-34009 "F4 crosses unity at m=1"
 *        that inflated the symmetric share is therefore the high-N tail endpoint's doing, not the head.
 *
 * The punchline: the imp-34009 symmetric endpoint sensitivity decomposes cleanly by side. The share
 * LEVEL is head-dominated (head-only drop ~0.503 vs tail-only ~0.245, both larger than the symmetric
 * ~0.177 because the ends partially cancel in F4), while the NON-MONOTONE m=1 bump and the F4 unity
 * crossing behind it are entirely tail-driven (tail-only F4 crosses unity, head-only never does). The
 * 92% figure's fragility is thus attributable: its magnitude to the low-N head, its non-monotonicity to
 * the high-N tail.
 *
 * ACCURACY / MEASUREMENT ONLY. Directional attribution of an imp-34009 endpoint-sensitivity diagnostic,
 * NOT an RH bound. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the
 * factor identity is exact WITHIN that model only; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34009-aggregate-share-window-endpoint-sensitivity (the symmetric sweep this attributes)
 * @see imp-33962-attenuation-rung-by-rung-decomposition (the 0.9225 aggregate share)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33884/imp-33922/imp-33962/imp-34009 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34009/imp-33962 (no re-derivation).
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
  return { k, E_N: ph.E_N, sflow, resid };
}

// The full 21-rung quarter-decade ladder k = 6.00, 6.25, ..., 11.00 (imp-33810).
const RUNGS = [];
for (let k = 6; k <= 11 + 1e-9; k += 0.25) RUNGS.push(rung(+k.toFixed(2)));

// Aggregate |ln| F2 share over the sub-window [RUNGS[lo], RUNGS[hi]] (imp-33962 R1 telescoping identity).
function windowAggregate(lo, hi, m, side) {
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
    side, // "head" (low endpoint moves) or "tail" (high endpoint moves)
    m, // rungs trimmed off the one moving end
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

// HEAD-ONLY: move only the low endpoint inward, [6+0.25m, 11] -> rungs [m, 20], m=0..9.
const HEAD_WINDOWS = [];
for (let m = 0; m <= 9; m++) HEAD_WINDOWS.push(windowAggregate(m, 20, m, 'head'));
// TAIL-ONLY: move only the high endpoint inward, [6, 11-0.25m] -> rungs [0, 20-m], m=0..9.
const TAIL_WINDOWS = [];
for (let m = 0; m <= 9; m++) TAIL_WINDOWS.push(windowAggregate(0, 20 - m, m, 'tail'));

const SHARE_FULL = HEAD_WINDOWS[0]._share; // 0.9225 (m=0 shared full window, matches imp-33962/imp-34009)

// R1: attribution of the drift LEVEL -- head-only drop vs tail-only drop vs the imp-34009 symmetric drop.
const HEAD_SHARE_INNER = HEAD_WINDOWS[9]._share; // 0.4191 (2.75-decade window k=8.25..11)
const TAIL_SHARE_INNER = TAIL_WINDOWS[9]._share; // 0.6772 (2.75-decade window k=6..8.75)
const HEAD_DROP = SHARE_FULL - HEAD_SHARE_INNER; // ~0.5034 -- head-only endpoint contingency
const TAIL_DROP = SHARE_FULL - TAIL_SHARE_INNER; // ~0.2453 -- tail-only endpoint contingency
const HEAD_DOMINATES_DROP = HEAD_DROP > TAIL_DROP; // true: head end drives ~2x the drop
const SYM_DROP_INNER = 0.176732; // imp-34009 symmetric drop full(0.9225)->inner(0.7458), baked reference
const BOTH_ONE_SIDED_EXCEED_SYM = HEAD_DROP > SYM_DROP_INNER && TAIL_DROP > SYM_DROP_INNER; // true

// R2: attribution of the m=1 non-monotone bump -- tail-only rises at m=1, head-only falls.
const HEAD_DELTA_M1 = HEAD_WINDOWS[1]._share - SHARE_FULL; // ~-0.0143 (head DECLINES)
const TAIL_DELTA_M1 = TAIL_WINDOWS[1]._share - SHARE_FULL; // ~+0.0161 (tail RISES -- the bump)
const BUMP_IS_TAIL_DRIVEN = TAIL_DELTA_M1 > 0 && HEAD_DELTA_M1 < 0; // true

// R3: the F4-crosses-unity event is tail-only.
const TAIL_F4_CROSSES_UNITY_AT_M1 = TAIL_WINDOWS[0]._F4 < 1 && TAIL_WINDOWS[1]._F4 > 1; // true
const HEAD_F4_NEVER_CROSSES_UNITY = HEAD_WINDOWS.every((w) => w._F4 < 1); // true (all below unity)

export const IMP34086_AGGREGATE_SHARE_ASYMMETRIC_TRIM = {
  id: 'imp-34086',
  proofSection: 'S-frontier',
  question:
    'imp-34009 shrank the imp-33962 5-decade head-to-tail window SYMMETRICALLY and found the 0.9225 ' +
    'aggregate F2 share is endpoint-contingent (down to 0.7458, with a non-monotone bump to 0.9462 at ' +
    'm=1 where F4 crosses unity), but could not separate which END drives it. Trim ONE side at a time -- ' +
    'head-only [6+0.25m, 11] and tail-only [6, 11-0.25m], m=0..9 -- and attribute the ~0.18 drift and ' +
    'the m=1 bump to head vs tail. Directional attribution; component model NOT rigorous; changes no ' +
    'bound; NO QED.',
  measuredQuantity:
    'for each one-sided sub-window the aggregate endpoint factors F2=E_N(hi)/E_N(lo), F3=sflow(lo)/' +
    'sflow(hi), F4=resid(hi)/resid(lo) and the net share |ln F2|/(|ln F2|+|ln F3|+|ln F4|), for the ' +
    'head-only family [6+0.25m,11] and the tail-only family [6,11-0.25m] (m=0..9)',
  headWindows: HEAD_WINDOWS.map(({ _share, _F4, ...rest }) => rest),
  tailWindows: TAIL_WINDOWS.map(({ _share, _F4, ...rest }) => rest),
  attribution: {
    share_full_window: +SHARE_FULL.toFixed(4), // 0.9225 (shared m=0)
    head_share_inner: +HEAD_SHARE_INNER.toFixed(4), // 0.4191 (head-only k=8.25..11)
    tail_share_inner: +TAIL_SHARE_INNER.toFixed(4), // 0.6772 (tail-only k=6..8.75)
    head_only_drop: +HEAD_DROP.toFixed(4), // 0.5034
    tail_only_drop: +TAIL_DROP.toFixed(4), // 0.2453
    symmetric_drop_ref_imp34009: SYM_DROP_INNER, // 0.1767 (imp-34009 full->inner)
    head_dominates_drop: HEAD_DOMINATES_DROP, // true
    both_one_sided_exceed_symmetric: BOTH_ONE_SIDED_EXCEED_SYM, // true (ends partly cancel in F4)
    head_delta_at_m1: +HEAD_DELTA_M1.toFixed(4), // -0.0143 (head declines)
    tail_delta_at_m1: +TAIL_DELTA_M1.toFixed(4), // +0.0161 (tail rises -- the bump)
    bump_is_tail_driven: BUMP_IS_TAIL_DRIVEN, // true
    tail_F4_crosses_unity_at_m1: TAIL_F4_CROSSES_UNITY_AT_M1, // true (0.8743 -> 1.0881)
    head_F4_never_crosses_unity: HEAD_F4_NEVER_CROSSES_UNITY, // true (0.8743 -> 0.3487, all < 1)
  },
  finding: {
    R1_share_drop_is_head_dominated:
      'Trimming the low-N head alone collapses the share from 0.9225 to 0.4191 (drop ~0.503), roughly ' +
      'TWICE the tail-only drop of ~0.245 (0.9225 -> 0.6772). The aggregate F2 share level is much more ' +
      'sensitive to the low-N head endpoint than to the high-N tail. BOTH one-sided drops EXCEED the ' +
      'imp-34009 symmetric drop of ~0.177: the symmetric window is the mildest because the two ends push ' +
      'the residual factor F4 in opposite directions and partially cancel, keeping |ln F4| small.',
    R2_m1_bump_is_tail_driven:
      'Trimming only the tail RAISES the share at m=1 to 0.9386 (above the 0.9225 full window), while ' +
      'trimming only the head LOWERS it to 0.9082. So the imp-34009 symmetric bump-up (0.9225 -> 0.9462) ' +
      'takes its SIGN from the tail side; the head contributes only a monotone decline. Tail-only is the ' +
      'only one-sided family whose interior is non-monotone by itself.',
    R3_F4_unity_crossing_is_tail_only:
      'The tail-only residual factor F4 rises monotonically through unity (0.8743 at m=0 -> 1.0881 at ' +
      'm=1 -> 2.7315 at m=9), whereas the head-only F4 falls monotonically and NEVER crosses unity ' +
      '(0.8743 -> 0.3487). Moving the high endpoint inward pulls resid(hi) toward the deeper interior ' +
      'residual (F4 up); moving the low endpoint inward raises resid(lo) (F4 down). The imp-34009 ' +
      '"F4 crosses unity at m=1" behind the symmetric bump is therefore the high-N tail endpoint doing.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / DIRECTIONAL ATTRIBUTION (frontier-direction, NOT rigorous). Splitting the imp-34009 ' +
    'symmetric window-endpoint sensitivity into head-only [6+0.25m,11] and tail-only [6,11-0.25m] trims ' +
    'attributes the two effects to opposite ends: the SHARE LEVEL is head-dominated (head-only drop ' +
    '~0.503 vs tail-only ~0.245, both larger than the symmetric ~0.177 because the ends partially cancel ' +
    'in F4), while the NON-MONOTONE m=1 bump and the F4 unity crossing behind it are entirely tail-driven ' +
    '(tail-only F4 crosses unity 0.8743 -> 1.0881, head-only F4 never crosses, staying 0.8743 -> 0.3487). ' +
    'The 92% figure fragility is thus split: its magnitude to the low-N head, its non-monotonicity to the ' +
    'high-N tail. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the factor ' +
    'identity is exact WITHIN the model only; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-34009 (the symmetric endpoint sensitivity this attributes); imp-33962 (the 0.9225 aggregate F2 ' +
    'share); imp-33810 (the 21 quarter-decade rungs); imp-33884/imp-33885 (the exact 903.538 widening + ' +
    'per-rung cross-validation); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C ' +
    '(E_coll prefactor).',
};

export const IMP34086_AGGREGATE_SHARE_ASYMMETRIC_TRIM_ASSERTIONS = [
  {
    // (setup) 21-rung ladder, 10 head + 10 tail windows, both m=0 reproduce the imp-33962 headline.
    id: 'imp34086-full-window-reproduces-imp33962-headline',
    description: 'both one-sided m=0 windows are the full 5-decade window with share ~0.9225',
    holds: () =>
      RUNGS.length === 21 &&
      HEAD_WINDOWS.length === 10 &&
      TAIL_WINDOWS.length === 10 &&
      HEAD_WINDOWS[0].width_decades === 5 &&
      TAIL_WINDOWS[0].width_decades === 5 &&
      Math.abs(HEAD_WINDOWS[0].agg_F2_share - 0.9225) < 1e-3 &&
      Math.abs(TAIL_WINDOWS[0].agg_F2_share - 0.9225) < 1e-3,
  },
  {
    // (R1) The share drop is head-dominated: head-only ~0.503 > tail-only ~0.245, both > symmetric ~0.177.
    id: 'imp34086-drop-is-head-dominated',
    description: 'head-only drop ~0.503 exceeds tail-only ~0.245, and both exceed the imp-34009 symmetric ~0.177',
    holds: () =>
      Math.abs(HEAD_DROP - 0.5034) < 2e-3 &&
      Math.abs(TAIL_DROP - 0.2453) < 2e-3 &&
      HEAD_DOMINATES_DROP &&
      HEAD_DROP > 2 * TAIL_DROP - 0.02 &&
      BOTH_ONE_SIDED_EXCEED_SYM,
  },
  {
    // (R2) The m=1 non-monotone bump is tail-driven: tail rises at m=1, head declines.
    id: 'imp34086-m1-bump-is-tail-driven',
    description: 'tail-only share rises at m=1 (~+0.016) while head-only falls (~-0.014): the bump is tail-driven',
    holds: () =>
      TAIL_DELTA_M1 > 0 &&
      HEAD_DELTA_M1 < 0 &&
      Math.abs(TAIL_DELTA_M1 - 0.0161) < 2e-3 &&
      Math.abs(HEAD_DELTA_M1 - -0.0143) < 2e-3 &&
      BUMP_IS_TAIL_DRIVEN,
  },
  {
    // (R3) The F4 unity crossing is tail-only: tail F4 crosses at m=1, head F4 never crosses.
    id: 'imp34086-F4-unity-crossing-is-tail-only',
    description: 'tail-only F4 crosses unity at m=1 (0.874->1.088) while head-only F4 stays below unity throughout',
    holds: () =>
      TAIL_F4_CROSSES_UNITY_AT_M1 &&
      HEAD_F4_NEVER_CROSSES_UNITY &&
      TAIL_WINDOWS[9].agg_F4 > 2.5 &&
      HEAD_WINDOWS[9].agg_F4 < 0.5,
  },
  {
    // Honesty gate: accuracy/measurement only, isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34086-honesty-gate-no-qed',
    description: 'Directional-attribution only: isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34086_AGGREGATE_SHARE_ASYMMETRIC_TRIM.isRigorous === false &&
      /NO QED/.test(IMP34086_AGGREGATE_SHARE_ASYMMETRIC_TRIM.verdict) &&
      /refereed bound is changed/i.test(IMP34086_AGGREGATE_SHARE_ASYMMETRIC_TRIM.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34086_AGGREGATE_SHARE_ASYMMETRIC_TRIM.verdict),
  },
];

for (const a of IMP34086_AGGREGATE_SHARE_ASYMMETRIC_TRIM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34086-aggregate-share-asymmetric-trim assertion failed: ${a.id}`);
  }
}
