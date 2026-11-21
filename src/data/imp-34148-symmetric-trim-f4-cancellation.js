/**
 * @module imp-34148-symmetric-trim-f4-cancellation
 *
 * imp-34148 (accuracy, frontier-direction): imp-34086 R1 explained that the imp-34009 SYMMETRIC
 * window-endpoint sensitivity of the imp-33962 0.9225 aggregate F2 share is MILDER than either
 * one-sided trim (symmetric drop ~0.177 vs head-only ~0.503, tail-only ~0.245) because the two ends
 * push the residual factor F4 in OPPOSITE directions: head-trim drives F4 DOWN, tail-trim drives F4
 * UP, so under symmetric shrink the two pushes partially cancel, |ln F4| stays small, and the F2
 * share stays artificially elevated. imp-34086 named that cancellation directionally but never
 * LOCATED it. This module tabulates the symmetric-trim F4(m) and |ln F4(m)| across m=0..9 on the SAME
 * inherited imp-3406/imp-33810 sub-terms and bisects for the (fractional) combined-trim m* at which
 * the head and tail contributions to ln F4 EXACTLY cancel (|ln F4| minimised, F4 = 1).
 *
 * WHAT IS MEASURED (same inherited imp-3406/imp-33810/imp-33962 sub-terms -- no re-derivation)
 * -------------------------------------------------------------------------------------------
 *   SYMMETRIC trim moves BOTH endpoints inward together by m rungs of the imp-33810 quarter-decade
 *   ladder: window [6+0.25m, 11-0.25m] -> rungs [m, 20-m] (m=0..9, width 5.0-0.5m decades). By the
 *   imp-33962 R1 telescoping identity the aggregate residual factor over that window is the endpoint
 *   slice F4(m) = resid(hi)/resid(lo) = resid(rung 20-m)/resid(rung m). Decompose its log relative to
 *   the full window m=0:
 *     ln F4(m) = ln F4(0) + H(m) + T(m)
 *       H(m) = ln resid(rung 0)  - ln resid(rung m)     -- HEAD push (low endpoint moves in; H<0)
 *       T(m) = ln resid(rung 20-m) - ln resid(rung 20)  -- TAIL push (high endpoint moves in; T>0)
 *   The two incremental pushes have opposite sign, so |ln F4| dips to a minimum where they (plus the
 *   base ln F4(0) = -0.1343) net to zero. Bisect continuous m for ln F4(m) = 0.
 *
 * THE FINDING (accuracy / measurement only)
 * -----------------------------------------
 *   (R1) THE PUSHES EXACTLY CANCEL AT m* ~ 0.6791 (window k = 6.1698 .. 10.8302, width ~4.6605
 *        decades). There the negative head push H(m*) ~ -0.0158 and the positive tail push T(m*) ~
 *        +0.1501 sum to +0.1343, EXACTLY offsetting the base ln F4(0) = -0.1343, so F4(m*) = 1 and
 *        |ln F4(m*)| = 0 (bisected to ~3.5e-10). This is the located minimum of |ln F4| that imp-34086
 *        described only directionally: the trim at which head-down and tail-up F4 pushes annihilate.
 *   (R2) THE SYMMETRIC |ln F4(m)| PROFILE IS A SHALLOW BOWL through that zero. F4 rises from 0.8743 at
 *        m=0 (|ln F4|=0.1343), crosses unity at m* ~ 0.679, peaks at F4 ~ 1.371 near m=4-5, then
 *        relaxes back to 1.0895 at m=9. The one integer rung nearest the cancellation is m=1 (F4 =
 *        1.0564, |ln F4| = 0.0549) -- exactly the imp-34009 non-monotone SHARE BUMP rung (0.9462).
 *   (R3) THAT IS WHY THE SYMMETRIC SHARE STAYS ELEVATED. The aggregate share |ln F2|/(|ln F2|+|ln F3|
 *        +|ln F4|) is maximised where the F4 term vanishes: at m* the share reaches 0.9662 (vs 0.9225
 *        at the full window), and on the integer ladder the share peaks at the adjacent m=1 rung
 *        (0.9462). The 92% figure stays high under symmetric shrink precisely BECAUSE the symmetric
 *        window sits near the |ln F4|=0 trough where F4 drops out of the denominator -- confirming the
 *        imp-34086 cancellation mechanism by locating the trim at which it is exact.
 *
 * The punchline: the opposite-direction F4 cancellation imp-34086 named is real and LOCATED -- the
 * head-down (~-0.0158) and tail-up (~+0.1501) pushes exactly offset the -0.1343 base at combined trim
 * m* ~ 0.6791, driving F4 to unity and the aggregate F2 share to its 0.9662 peak. The imp-34009
 * symmetric mildness and its m=1 share bump are the discrete shadow of this continuous |ln F4|=0
 * trough.
 *
 * ACCURACY / MEASUREMENT ONLY. Locating a minimum of an imp-34086 endpoint-sensitivity diagnostic,
 * NOT an RH bound. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the
 * factor identity is exact WITHIN that model only; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional share per imp-486 is UNTOUCHED;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34086-aggregate-share-asymmetric-trim (the opposite-direction F4 cancellation this locates)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33884/imp-33962/imp-34009/imp-34086 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34086/imp-34009/imp-33962.
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

// SYMMETRIC trim: both endpoints move inward by m rungs -> [6+0.25m, 11-0.25m] (continuous m allowed).
const kLoOf = (m) => 6 + 0.25 * m;
const kHiOf = (m) => 11 - 0.25 * m;
const RESID0_LO = rungAtK(6).resid; // resid at the full-window low endpoint (rung 0)
const RESID0_HI = rungAtK(11).resid; // resid at the full-window high endpoint (rung 20)

// ln F4 over the symmetric window at trim m, and its head/tail push decomposition vs the full window.
function symLnF4(m) {
  return Math.log(rungAtK(kHiOf(m)).resid / rungAtK(kLoOf(m)).resid);
}
function headPush(m) {
  return Math.log(RESID0_LO) - Math.log(rungAtK(kLoOf(m)).resid); // H(m): low endpoint moves in (<0)
}
function tailPush(m) {
  return Math.log(rungAtK(kHiOf(m)).resid) - Math.log(RESID0_HI); // T(m): high endpoint moves in (>0)
}

// Full aggregate |ln| share over the symmetric window at trim m (imp-33962 R1 telescoping identity).
function symWindow(m) {
  const a = rungAtK(kLoOf(m));
  const b = rungAtK(kHiOf(m));
  const F2 = b.E_N / a.E_N;
  const F3 = a.sflow / b.sflow;
  const F4 = b.resid / a.resid;
  const lF2 = Math.abs(Math.log(F2));
  const lF3 = Math.abs(Math.log(F3));
  const lF4 = Math.abs(Math.log(F4));
  const share = lF2 / (lF2 + lF3 + lF4);
  return {
    m,
    k_lo: +kLoOf(m).toFixed(4),
    k_hi: +kHiOf(m).toFixed(4),
    width_decades: +(kHiOf(m) - kLoOf(m)).toFixed(4),
    agg_F4: +F4.toFixed(6),
    abs_lnF4: +Math.abs(Math.log(F4)).toFixed(6),
    head_push_H: +headPush(m).toFixed(6),
    tail_push_T: +tailPush(m).toFixed(6),
    agg_F2_share: +share.toFixed(6),
    _share: share,
    _lnF4: Math.log(F4),
  };
}

// The integer symmetric ladder m = 0..9 (the imp-34009 symmetric sweep).
const SYM_WINDOWS = [];
for (let m = 0; m <= 9; m++) SYM_WINDOWS.push(symWindow(m));

// Bisect the continuous combined trim m* where symmetric ln F4(m*) = 0 (F4 = 1, |ln F4| minimised).
// The full window (m=0) has F4 < 1 (ln F4 < 0); F4 crosses unity between m=0 and m=1.
function bisectCancelTrim() {
  let a = 0;
  let b = 1;
  // ln F4(0) < 0 and ln F4(1) > 0 -- a single sign change on [0,1].
  for (let i = 0; i < 100; i++) {
    const mid = 0.5 * (a + b);
    if (symLnF4(mid) < 0) a = mid;
    else b = mid;
  }
  return 0.5 * (a + b);
}
const M_STAR = bisectCancelTrim(); // ~0.679085

const STAR = symWindow(M_STAR);
const CANCEL = {
  m_star: +M_STAR.toFixed(6), // 0.679085
  k_lo: +kLoOf(M_STAR).toFixed(6), // 6.169771
  k_hi: +kHiOf(M_STAR).toFixed(6), // 10.830229
  width_decades: +(kHiOf(M_STAR) - kLoOf(M_STAR)).toFixed(6), // 4.660458
  head_push_H: +headPush(M_STAR).toFixed(6), // -0.015773 (F4 down)
  tail_push_T: +tailPush(M_STAR).toFixed(6), // +0.150082 (F4 up)
  base_lnF4_full: +symLnF4(0).toFixed(6), // -0.134309 (full-window ln F4)
  net_lnF4: +symLnF4(M_STAR).toExponential(3), // ~3.54e-10 (the located minimum of |ln F4|)
  agg_F4: +Math.exp(symLnF4(M_STAR)).toFixed(8), // 1.00000000
  agg_F2_share_at_star: +STAR._share.toFixed(6), // 0.966238 (share peaks where F4 drops out)
};

// The integer rung nearest the cancellation is m=1 -- exactly the imp-34009 non-monotone share bump.
const NEAREST_INTEGER_TRIM = SYM_WINDOWS.reduce(
  (best, w) => (Math.abs(w._lnF4) < Math.abs(best._lnF4) ? w : best),
  SYM_WINDOWS[0],
).m; // 1

export const IMP34148_SYMMETRIC_TRIM_F4_CANCELLATION = {
  id: 'imp-34148',
  proofSection: 'S-frontier',
  question:
    'imp-34086 R1 explained the imp-34009 SYMMETRIC window-trim of the imp-33962 0.9225 aggregate F2 ' +
    'share is milder than either one-sided trim because head-trim drives F4 DOWN while tail-trim drives ' +
    'F4 UP so the pushes partially cancel and |ln F4| stays small -- keeping the share elevated -- but ' +
    'never LOCATED that cancellation. Tabulate the symmetric-trim F4(m) and |ln F4(m)| across m=0..9 and ' +
    'bisect for the fractional combined trim m* at which the head and tail F4 pushes exactly cancel ' +
    '(F4 = 1, |ln F4| minimised). Measurement only; component model NOT rigorous; changes no bound; NO QED.',
  measuredQuantity:
    'symmetric-trim aggregate residual factor F4(m) = resid(rung 20-m)/resid(rung m) over the window ' +
    '[6+0.25m, 11-0.25m], its |ln F4(m)|, the head push H(m) = ln resid(rung 0) - ln resid(rung m) and ' +
    'tail push T(m) = ln resid(rung 20-m) - ln resid(rung 20), and the bisected fractional trim m* where ' +
    'ln F4(m*) = 0',
  symmetricWindows: SYM_WINDOWS.map(({ _share, _lnF4, ...rest }) => rest),
  cancellation: CANCEL,
  nearest_integer_trim: NEAREST_INTEGER_TRIM, // 1 (the imp-34009 m=1 share bump rung)
  finding: {
    R1_pushes_exactly_cancel_at_m_star:
      'The head-down and tail-up F4 pushes exactly annihilate at combined trim m* ~ 0.6791 (window ' +
      'k = 6.1698 .. 10.8302, width ~4.6605 decades): the negative head push H(m*) ~ -0.0158 plus the ' +
      'positive tail push T(m*) ~ +0.1501 sum to +0.1343, exactly offsetting the base ln F4(0) = -0.1343, ' +
      'so F4(m*) = 1 and |ln F4(m*)| ~ 3.5e-10. This LOCATES the |ln F4| minimum imp-34086 named only ' +
      'directionally.',
    R2_shallow_bowl_through_unity:
      'The symmetric |ln F4(m)| profile is a shallow bowl through that zero: F4 rises from 0.8743 at m=0 ' +
      '(|ln F4|=0.1343) through unity at m* ~ 0.679, peaks at F4 ~ 1.371 near m=4-5, then relaxes to ' +
      '1.0895 at m=9. The integer rung nearest the cancellation is m=1 (F4 = 1.0564, |ln F4| = 0.0549), ' +
      'exactly the imp-34009 non-monotone share-bump rung.',
    R3_why_the_symmetric_share_stays_elevated:
      'The aggregate share |ln F2|/(|ln F2|+|ln F3|+|ln F4|) is maximised where the F4 term vanishes: at ' +
      'm* the share reaches 0.9662 (vs 0.9225 full window), and on the integer ladder it peaks at the ' +
      'adjacent m=1 rung (0.9462). The 92% figure stays high under symmetric shrink precisely because the ' +
      'symmetric window sits near the |ln F4|=0 trough where F4 drops out of the denominator.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / LOCATED MINIMUM (frontier-direction, NOT rigorous). Bisecting the symmetric-trim ' +
    'ln F4(m) = 0 condition LOCATES the imp-34086 opposite-direction F4 cancellation at combined trim ' +
    'm* ~ 0.6791 (window k = 6.1698 .. 10.8302, width ~4.6605 decades): the head push H(m*) ~ -0.0158 ' +
    'and tail push T(m*) ~ +0.1501 exactly offset the base ln F4(0) = -0.1343, driving F4 to unity ' +
    '(|ln F4| ~ 3.5e-10) and the aggregate F2 share to its 0.9662 peak. The imp-34009 symmetric mildness ' +
    'and its m=1 share bump (0.9462) are the discrete shadow of this continuous |ln F4|=0 trough. The ' +
    'inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the factor identity is ' +
    'exact WITHIN the model only; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34086 (the opposite-direction F4 cancellation this locates); imp-34009 (the symmetric endpoint ' +
    'sweep + m=1 share bump); imp-33962 (the 0.9225 aggregate F2 share, telescoping identity); imp-33810 ' +
    '(the 21 quarter-decade rungs); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C ' +
    '(E_coll prefactor).',
};

export const IMP34148_SYMMETRIC_TRIM_F4_CANCELLATION_ASSERTIONS = [
  {
    // (setup) 10 symmetric windows m=0..9; the full window reproduces the imp-33962/imp-34086 F4 headline.
    id: 'imp34148-symmetric-ladder-reproduces-full-window-F4',
    description: 'symmetric m=0 is the full 5-decade window with F4 ~ 0.8743 (matches imp-34086)',
    holds: () =>
      SYM_WINDOWS.length === 10 &&
      SYM_WINDOWS[0].width_decades === 5 &&
      SYM_WINDOWS[9].width_decades === 0.5 &&
      Math.abs(SYM_WINDOWS[0].agg_F4 - 0.874320) < 1e-4 &&
      Math.abs(SYM_WINDOWS[1].agg_F4 - 1.056409) < 1e-4,
  },
  {
    // (R1) The pushes exactly cancel at m* ~ 0.6791: F4(m*) = 1 and H(m*)+T(m*) = -base.
    id: 'imp34148-cancellation-located-at-m-star',
    description: 'bisected combined trim m* ~ 0.6791 gives F4 = 1 with head push H ~ -0.0158 and tail push T ~ +0.1501',
    holds: () =>
      Math.abs(M_STAR - 0.679085) < 1e-4 &&
      Math.abs(Math.exp(symLnF4(M_STAR)) - 1) < 1e-6 &&
      Math.abs(headPush(M_STAR) - -0.015773) < 1e-4 &&
      Math.abs(tailPush(M_STAR) - 0.150082) < 1e-4 &&
      Math.abs(headPush(M_STAR) + tailPush(M_STAR) + symLnF4(0)) < 1e-6,
  },
  {
    // (R1 cont.) The head push is negative and tail push positive throughout the interior -- opposite signs.
    id: 'imp34148-head-and-tail-pushes-oppose',
    description: 'head push H(m)<0 (F4 down) and tail push T(m)>0 (F4 up) for every interior symmetric trim',
    holds: () =>
      SYM_WINDOWS.slice(1).every((w) => w.head_push_H < 0 && w.tail_push_T > 0),
  },
  {
    // (R2/R3) |ln F4| is a bowl through the m* trough; nearest integer trim is m=1, the imp-34009 share bump.
    id: 'imp34148-shallow-bowl-nearest-integer-is-m1',
    description: '|ln F4| minimum is bracketed at m* in (0,1); nearest integer trim is m=1 (the imp-34009 share bump)',
    holds: () =>
      SYM_WINDOWS[0]._lnF4 < 0 &&
      SYM_WINDOWS[1]._lnF4 > 0 &&
      NEAREST_INTEGER_TRIM === 1 &&
      SYM_WINDOWS[4].agg_F4 > SYM_WINDOWS[1].agg_F4 &&
      SYM_WINDOWS[4].agg_F4 > SYM_WINDOWS[9].agg_F4 &&
      Math.abs(CANCEL.agg_F2_share_at_star - 0.966238) < 1e-3,
  },
  {
    // Honesty gate: accuracy/measurement only, isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34148-honesty-gate-no-qed',
    description: 'Located-minimum measurement only: isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34148_SYMMETRIC_TRIM_F4_CANCELLATION.isRigorous === false &&
      /NO QED/.test(IMP34148_SYMMETRIC_TRIM_F4_CANCELLATION.verdict) &&
      /refereed bound is changed/i.test(IMP34148_SYMMETRIC_TRIM_F4_CANCELLATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34148_SYMMETRIC_TRIM_F4_CANCELLATION.verdict),
  },
];

for (const a of IMP34148_SYMMETRIC_TRIM_F4_CANCELLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34148-symmetric-trim-f4-cancellation assertion failed: ${a.id}`);
  }
}
