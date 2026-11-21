/**
 * @module imp-34212-head-only-f4-noncrossing-floor
 *
 * imp-34212 (numerical, frontier-direction): imp-34149 located the TAIL-ONLY F4 unity crossing at
 * m* ~ 0.6063 (only the high endpoint moves inward) and imp-34148 the SYMMETRIC crossing at m* ~ 0.6791
 * (both endpoints move), each noting in passing that the HEAD-ONLY F4 (only the low endpoint moves
 * inward) "never crosses" unity -- but neither tabulated the head-only F4 or measured how far below unity
 * it stays. This module completes the trio: it tabulates the head-only residual factor F4(m) =
 * resid(hi pinned)/resid(lo moving) over the SAME imp-33962 telescoping identity on the head-only window
 * [6+0.25m, 11], with the inherited imp-3406/imp-33810 sub-terms on CONTINUOUS m, and measures its
 * monotone descent, its global floor, and its asymptotic recovery toward unity FROM BELOW as the window
 * collapses -- confirming and quantifying that the head-down push alone can never reach, let alone cross,
 * F4 = 1.
 *
 * WHAT IS MEASURED (same inherited imp-3406/imp-33810/imp-33962 sub-terms -- no re-derivation)
 * -------------------------------------------------------------------------------------------
 *   HEAD-ONLY trim moves ONLY the low endpoint inward by m rungs of the imp-33810 quarter-decade ladder:
 *   window [6+0.25m, 11] -> rungs [m, 20] (m=0..9, width 5.0-0.25m decades). The high endpoint stays
 *   pinned at rung 20 (k=11). By the imp-33962 R1 telescoping identity the aggregate residual factor over
 *   that window is the endpoint slice
 *     F4(m) = resid(hi)/resid(lo) = resid(rung 20, k=11) / resid(rung at k=6+0.25m)
 *   Because the HIGH endpoint is fixed at resid(k=11) = 0.020884 -- itself BELOW the full-window low
 *   endpoint resid(k=6) = 0.023886, which is why the full window already has F4 = 0.8743 < 1 -- moving the
 *   low endpoint inward only RAISES the denominator resid(rung at k=6+0.25m) as it climbs toward the
 *   interior resid peak, driving F4 DOWN, away from unity. F4(m) = 1 would require resid(rung at k=6+0.25m)
 *   = resid(k=11); with resid rising off its k=6 value the ratio only falls further below unity.
 *
 * THE FINDING (numerical / measurement only -- an HONEST NEGATIVE, a floor not a crossing)
 * ---------------------------------------------------------------------------------------
 *   (R1) HEAD-ONLY F4 IS MONOTONE DECREASING ACROSS THE INTEGER LADDER, NEVER RISING. F4(m) falls
 *        strictly from 0.8743 at m=0 (the full 5-decade window, ln F4 = -0.1343, matching the imp-34148/
 *        imp-34149 shared base) to 0.3487 at m=9 (width 2.75 decades, ln F4 = -1.0535). There is no sign
 *        change: unlike the tail-only F4 (which rises through unity between m=0 and m=1) the head-only F4
 *        moves AWAY from unity with every head rung trimmed. The integer-ladder minimum is at m=9.
 *   (R2) THE HEAD-ONLY F4 GLOBAL FLOOR IS ~0.3196 AT TRIM m* ~ 11.2844 (k_lo ~ 8.8211, width ~2.1789
 *        decades). Continuing past the integer ladder, F4(m) bottoms out where the moving low-endpoint
 *        residual resid(rung at k=8.8211) is MAXIMISED (~0.06534, the interior resid peak); there
 *        F4 = resid(k=11)/resid(k=8.8211) = 0.3196 (ln F4 = -1.1406). Past the floor F4 RECOVERS toward
 *        unity as the low endpoint keeps climbing toward the pinned high endpoint -- but only FROM BELOW:
 *        in the degenerate window-collapse limit k_lo -> 11 the ratio resid(k=11)/resid(k_lo) -> 1 from
 *        below (0.991 at k_lo = 10.99, 0.9991 at k_lo = 10.999), touching unity only as the window
 *        vanishes. So the head-only F4 stays STRICTLY below unity for every non-degenerate window and
 *        never crosses.
 *   (R3) WHY THE HEAD-DOWN PUSH ALONE CANNOT REACH F4 = 1. The head-only aggregate F2 share
 *        |ln F2|/(|ln F2|+|ln F3|+|ln F4|) is MONOTONE DECREASING (0.9225 at m=0 -> 0.4191 at m=9) --
 *        the exact MIRROR of the tail-only/symmetric behaviour, where the share PEAKS at the crossing
 *        because F4 drops out of the denominator. Here trimming the head GROWS |ln F4|, swelling the
 *        denominator and shrinking the share. The full-window deficit ln F4 = -0.1343 can be erased only
 *        by a tail-UP push that lifts resid(hi); the head-DOWN push lifts resid(lo) instead, deepening the
 *        deficit -- exactly why the tail-only (imp-34149, m* ~ 0.6063) and symmetric (imp-34148, m* ~
 *        0.6791) trims cross unity while the head-only trim never does.
 *
 * The punchline: the head-only F4 that imp-34148/imp-34149 asserted "never crosses" unity is TABULATED and
 * quantified here -- it descends monotonically from the 0.8743 full-window base to a global floor of
 * ~0.3196 at trim m* ~ 11.2844 (k_lo ~ 8.8211, the interior resid peak), then recovers toward unity ONLY
 * FROM BELOW as the window collapses. It never reaches, let alone crosses, F4 = 1: the head-down push
 * lifts the low-endpoint residual (widening the deficit) whereas only a tail-up push can lift the
 * high-endpoint residual to erase it. This CLOSES the trio of asymmetric-trim F4 diagnostics.
 *
 * NUMERICAL / MEASUREMENT ONLY. Tabulating a floor of an imp-34086 endpoint-sensitivity diagnostic, NOT an
 * RH bound. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the factor
 * identity is exact WITHIN that model only; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34149-tail-only-f4-unity-crossing (the tail-only crossing this complements, m* ~ 0.6063)
 * @see imp-34148-symmetric-trim-f4-cancellation (the symmetric crossing, m* ~ 0.6791)
 * @see imp-34086-aggregate-share-asymmetric-trim (the tail/head endpoint-sensitivity family)
 * @see imp-34009-aggregate-share-window-endpoint-sensitivity (the symmetric sweep + m=1 share bump)
 * @see imp-33962-attenuation-rung-by-rung-decomposition (the 0.9225 aggregate share, telescoping id)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21 quarter-decade rungs)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33962/imp-34009/imp-34086/imp-34148/imp-34149

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34149/imp-34148/imp-34086/imp-33962.
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

// One imp-33810 rung at (continuous) ladder position k: window [10^k, 10^(k+1)] read at the upper end.
function rungAtK(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const sflow = Math.abs(eflowLogSlope(hi));
  return { k, E_N: ph.E_N, sflow, resid };
}

// HEAD-ONLY trim: only the LOW endpoint moves inward -> [6+0.25m, 11] (continuous m allowed); high fixed.
const kLoOf = (m) => 6 + 0.25 * m;
const HI = rungAtK(11); // pinned high endpoint (rung 20, k=11) -- shared by every head-only window

// ln F4 over the head-only window at trim m (imp-33962 R1 telescoping identity; high endpoint fixed).
function headLnF4(m) {
  return Math.log(HI.resid / rungAtK(kLoOf(m)).resid);
}

// Full aggregate |ln| share over the head-only window at trim m (imp-33962 R1 telescoping identity).
function headWindow(m) {
  const a = rungAtK(kLoOf(m));
  const F2 = HI.E_N / a.E_N; // normaliser ratio over the window
  const F3 = a.sflow / HI.sflow; // slope ratio over the window
  const F4 = HI.resid / a.resid; // sub-leading residual ratio over the window
  const lF2 = Math.abs(Math.log(F2));
  const lF3 = Math.abs(Math.log(F3));
  const lF4 = Math.abs(Math.log(F4));
  const share = lF2 / (lF2 + lF3 + lF4);
  return {
    m,
    k_lo: +kLoOf(m).toFixed(4),
    k_hi: 11,
    width_decades: +(11 - kLoOf(m)).toFixed(4),
    agg_F4: +F4.toFixed(6),
    abs_lnF4: +Math.abs(Math.log(F4)).toFixed(6),
    agg_F2_share: +share.toFixed(6),
    _share: share,
    _lnF4: Math.log(F4),
  };
}

// The integer head-only ladder m = 0..9 (the imp-34086 head-only family).
const HEAD_WINDOWS = [];
for (let m = 0; m <= 9; m++) HEAD_WINDOWS.push(headWindow(m));

// The head-only F4 has NO unity crossing: it descends monotonically then bottoms at a global floor where
// the moving low-endpoint residual resid(rung at k=6+0.25m) is MAXIMISED. Locate that floor (min F4 =
// max resid_lo) by ternary search on the low-endpoint position k_lo in [6, 11] (interior resid peak).
function locateFloor() {
  let a = 6;
  let b = 11;
  for (let i = 0; i < 200; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (rungAtK(m1).resid < rungAtK(m2).resid) a = m1;
    else b = m2;
  }
  return 0.5 * (a + b);
}
const K_LO_FLOOR = locateFloor(); // ~8.821092 (interior resid peak; low endpoint here)
const M_STAR_FLOOR = (K_LO_FLOOR - 6) / 0.25; // ~11.284367 (trim beyond the m=0..9 integer ladder)

const FLOOR = {
  m_star: +M_STAR_FLOOR.toFixed(6), // 11.284367 (past the integer ladder)
  k_lo: +K_LO_FLOOR.toFixed(6), // 8.821092 (interior resid peak)
  k_hi: 11, // pinned full-window high endpoint
  width_decades: +(11 - K_LO_FLOOR).toFixed(6), // 2.178908
  resid_lo_max: +rungAtK(K_LO_FLOOR).resid.toFixed(8), // 0.06533660 (max moving low-endpoint residual)
  resid_hi_pinned: +HI.resid.toFixed(8), // 0.02088393 (pinned high endpoint, k=11)
  agg_F4_floor: +Math.exp(headLnF4(M_STAR_FLOOR)).toFixed(6), // 0.319636 (global minimum, strictly < 1)
  lnF4_floor: +headLnF4(M_STAR_FLOOR).toFixed(6), // -1.140572
  base_lnF4_full: +headLnF4(0).toFixed(6), // -0.134309 (full-window base, matches imp-34148/imp-34149)
  tail_crossing_m_star_ref_imp34149: 0.606341, // imp-34149 tail-only crossing (baked reference)
  sym_crossing_m_star_ref_imp34148: 0.679085, // imp-34148 symmetric crossing (baked reference)
};

// The window-collapse limit: as k_lo -> 11 the ratio resid(k=11)/resid(k_lo) -> 1 FROM BELOW (never above).
const COLLAPSE_APPROACH = [10.9, 10.99, 10.999].map((kLo) => ({
  k_lo: kLo,
  agg_F4: +(HI.resid / rungAtK(kLo).resid).toFixed(6),
}));

// The integer rung with the smallest F4 (deepest below unity) is m=9 -- the head-only ladder minimum.
const DEEPEST_INTEGER_TRIM = HEAD_WINDOWS.reduce(
  (best, w) => (w._lnF4 < best._lnF4 ? w : best),
  HEAD_WINDOWS[0],
).m; // 9

export const IMP34212_HEAD_ONLY_F4_NONCROSSING_FLOOR = {
  id: 'imp-34212',
  proofSection: 'S-frontier',
  question:
    'imp-34149 (tail-only, m* ~ 0.6063) and imp-34148 (symmetric, m* ~ 0.6791) each noted that the ' +
    'HEAD-ONLY F4 -- where only the low endpoint of the window [6+0.25m, 11] moves inward -- "never ' +
    'crosses" unity, but neither tabulated it. Tabulate the head-only F4(m) = resid(rung 20)/resid(rung ' +
    'at k=6+0.25m) over the SAME imp-33962 telescoping identity with the inherited imp-3406/imp-33810 ' +
    'sub-terms on continuous m, and measure its monotone descent, its global floor, and its asymptotic ' +
    'recovery toward unity from below, confirming and quantifying that the head-down push alone cannot ' +
    'reach F4 = 1. Measurement only; component model NOT rigorous; changes no bound; NO QED.',
  measuredQuantity:
    'head-only aggregate residual factor F4(m) = resid(rung 20, k=11)/resid(rung at k=6+0.25m) over the ' +
    'window [6+0.25m, 11] (high endpoint pinned at rung 20), its |ln F4(m)|, the aggregate F2 share, the ' +
    'global floor min_m F4(m) at the interior resid peak, and the window-collapse recovery toward unity',
  headWindows: HEAD_WINDOWS.map(({ _share, _lnF4, ...rest }) => rest),
  floor: FLOOR,
  collapseApproach: COLLAPSE_APPROACH,
  deepest_integer_trim: DEEPEST_INTEGER_TRIM, // 9 (the integer-ladder minimum F4)
  finding: {
    R1_head_only_F4_monotone_decreasing_no_crossing:
      'Head-only F4(m) is monotone decreasing across the integer ladder, never rising: from 0.8743 at ' +
      'm=0 (the full 5-decade window, ln F4 = -0.1343, matching the imp-34148/imp-34149 shared base) to ' +
      '0.3487 at m=9 (width 2.75 decades, ln F4 = -1.0535). No sign change -- unlike the tail-only F4 ' +
      '(which rises through unity between m=0 and m=1) the head-only F4 moves AWAY from unity with every ' +
      'head rung trimmed. The integer-ladder minimum is at m=9.',
    R2_head_only_F4_global_floor:
      'The head-only F4 global floor is ~0.3196 at trim m* ~ 11.2844 (k_lo ~ 8.8211, width ~2.1789 ' +
      'decades), where the moving low-endpoint residual resid(rung at k=8.8211) is maximised (~0.06534, ' +
      'the interior resid peak): there F4 = resid(k=11)/resid(k=8.8211) = 0.3196 (ln F4 = -1.1406). Past ' +
      'the floor F4 recovers toward unity as the low endpoint climbs toward the pinned high endpoint -- ' +
      'but only FROM BELOW: in the window-collapse limit k_lo -> 11 the ratio -> 1 from below (0.991 at ' +
      'k_lo = 10.99, 0.9991 at k_lo = 10.999), touching unity only as the window vanishes. The head-only ' +
      'F4 stays strictly below unity for every non-degenerate window and never crosses.',
    R3_why_head_push_cannot_reach_unity:
      'The head-only aggregate F2 share |ln F2|/(|ln F2|+|ln F3|+|ln F4|) is monotone decreasing (0.9225 ' +
      'at m=0 -> 0.4191 at m=9) -- the exact mirror of the tail-only/symmetric behaviour, where the ' +
      'share peaks at the crossing because F4 drops out of the denominator. Trimming the head GROWS ' +
      '|ln F4|, swelling the denominator and shrinking the share. The full-window deficit ln F4 = -0.1343 ' +
      'can be erased only by a tail-UP push that lifts resid(hi); the head-DOWN push lifts resid(lo) ' +
      'instead, deepening the deficit -- exactly why the tail-only (imp-34149, m* ~ 0.6063) and symmetric ' +
      '(imp-34148, m* ~ 0.6791) trims cross unity while the head-only trim never does.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASURED FLOOR, HONEST NEGATIVE (frontier-direction, NOT rigorous). Tabulating the ' +
    'head-only F4(m) = resid(rung 20)/resid(rung at k=6+0.25m) confirms it NEVER crosses unity: it ' +
    'descends monotonically from the 0.8743 full-window base (ln F4 = -0.1343, shared with imp-34148/' +
    'imp-34149) to a global floor of ~0.3196 at trim m* ~ 11.2844 (k_lo ~ 8.8211, the interior resid ' +
    'peak where resid_lo ~ 0.06534 is maximised), then recovers toward unity ONLY FROM BELOW as the ' +
    'window collapses (k_lo -> 11). The head-down push lifts the low-endpoint residual (widening the ' +
    'deficit) whereas only a tail-up push can lift the high-endpoint residual to erase it -- which is ' +
    'why the tail-only (imp-34149, m* ~ 0.6063) and symmetric (imp-34148, m* ~ 0.6791) trims cross ' +
    'unity but the head-only trim does not. This CLOSES the trio of asymmetric-trim F4 diagnostics. The ' +
    'inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the factor identity is ' +
    'exact WITHIN the model only; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34149 (the tail-only F4 unity crossing this complements, m* ~ 0.6063); imp-34148 (the symmetric ' +
    'crossing m* ~ 0.6791); imp-34086 (the tail/head endpoint-sensitivity family); imp-34009 (the ' +
    'symmetric sweep + m=1 share bump); imp-33962 (the 0.9225 aggregate F2 share, telescoping identity); ' +
    'imp-33810 (the 21 quarter-decade rungs); lambda-rh-height-mapping (RvM height law); ' +
    'polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34212_HEAD_ONLY_F4_NONCROSSING_FLOOR_ASSERTIONS = [
  {
    // (setup) 10 head-only windows m=0..9; the full window reproduces the imp-34148/imp-34149 shared base.
    id: 'imp34212-head-ladder-reproduces-full-window-base',
    description: 'head-only m=0 is the full 5-decade window with F4 ~ 0.8743 (matches the imp-34148/imp-34149 base)',
    holds: () =>
      HEAD_WINDOWS.length === 10 &&
      HEAD_WINDOWS[0].width_decades === 5 &&
      HEAD_WINDOWS[9].width_decades === 2.75 &&
      Math.abs(HEAD_WINDOWS[0].agg_F4 - 0.874320) < 1e-4 &&
      Math.abs(HEAD_WINDOWS[0].abs_lnF4 - 0.134309) < 1e-4 &&
      Math.abs(HEAD_WINDOWS[9].agg_F4 - 0.348716) < 1e-4,
  },
  {
    // (R1) Head-only F4 is monotone DECREASING across the integer ladder -- no unity crossing.
    id: 'imp34212-monotone-decreasing-no-crossing',
    description: 'head-only F4(m) strictly decreases m=0..9 (never rises), all ln F4 < 0, deepest integer trim m=9',
    holds: () => {
      for (let m = 1; m <= 9; m++) {
        if (!(HEAD_WINDOWS[m].agg_F4 < HEAD_WINDOWS[m - 1].agg_F4)) return false;
        if (!(HEAD_WINDOWS[m]._lnF4 < 0)) return false;
      }
      return HEAD_WINDOWS[0]._lnF4 < 0 && DEEPEST_INTEGER_TRIM === 9;
    },
  },
  {
    // (R2) The head-only F4 global floor ~0.3196 at trim m* ~ 11.2844 (k_lo ~ 8.8211); strictly below unity.
    id: 'imp34212-global-floor-below-unity',
    description: 'head-only F4 floor ~0.3196 at k_lo ~ 8.8211 (trim m* ~ 11.28); strictly < 1 and recovers from below',
    holds: () =>
      Math.abs(FLOOR.k_lo - 8.821092) < 1e-3 &&
      Math.abs(FLOOR.agg_F4_floor - 0.319636) < 1e-3 &&
      FLOOR.agg_F4_floor < 1 &&
      FLOOR.agg_F4_floor < HEAD_WINDOWS[9].agg_F4 &&
      COLLAPSE_APPROACH.every((c) => c.agg_F4 < 1) &&
      COLLAPSE_APPROACH[2].agg_F4 > COLLAPSE_APPROACH[0].agg_F4,
  },
  {
    // (R3) The head-only F2 share is monotone DECREASING (mirror of the tail-only/symmetric peak).
    id: 'imp34212-share-monotone-decreasing-mirror',
    description: 'head-only F2 share decreases monotonically 0.9225 -> 0.4191 (mirror of the crossing-peak siblings)',
    holds: () => {
      for (let m = 1; m <= 9; m++) {
        if (!(HEAD_WINDOWS[m]._share < HEAD_WINDOWS[m - 1]._share)) return false;
      }
      return (
        Math.abs(HEAD_WINDOWS[0]._share - 0.922504) < 1e-4 &&
        Math.abs(HEAD_WINDOWS[9]._share - 0.419102) < 1e-4
      );
    },
  },
  {
    // Honesty gate: numerical/measurement only, isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34212-honesty-gate-no-qed',
    description: 'Measured floor / honest negative only: isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34212_HEAD_ONLY_F4_NONCROSSING_FLOOR.isRigorous === false &&
      /NO QED/.test(IMP34212_HEAD_ONLY_F4_NONCROSSING_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP34212_HEAD_ONLY_F4_NONCROSSING_FLOOR.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34212_HEAD_ONLY_F4_NONCROSSING_FLOOR.verdict),
  },
];

for (const a of IMP34212_HEAD_ONLY_F4_NONCROSSING_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34212-head-only-f4-noncrossing-floor assertion failed: ${a.id}`);
  }
}
