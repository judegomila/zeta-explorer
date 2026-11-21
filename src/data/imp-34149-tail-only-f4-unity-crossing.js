/**
 * @module imp-34149-tail-only-f4-unity-crossing
 *
 * imp-34149 (numerical, frontier-direction): imp-34086 R3 found that the F4-crosses-unity event behind
 * the imp-34009 non-monotone m=1 aggregate-share bump lives ENTIRELY on the high-N tail: the tail-only
 * residual factor F4 rises monotonically through unity (0.8743 at m=0 -> 1.0881 at m=1 -> 2.7315 at
 * m=9) while the head-only F4 never crosses. But imp-34086 located that crossing only to the integer
 * bracket [0, 1]. This module bisects the SAME imp-33962 telescoping identity F4(win) = resid(hi)/
 * resid(lo) on the tail-only window [6, 11-0.25m] -- with the inherited imp-3406/imp-33810 sub-terms
 * evaluated on CONTINUOUS m -- for the fractional trim m* at which tail-only F4(m*) = 1 exactly, and
 * reports the corresponding window width and aggregate F2 share there. Companion to imp-34148, which
 * did the same for the SYMMETRIC trim (m* ~ 0.6791); here only the high endpoint moves.
 *
 * WHAT IS MEASURED (same inherited imp-3406/imp-33810/imp-33962 sub-terms -- no re-derivation)
 * -------------------------------------------------------------------------------------------
 *   TAIL-ONLY trim moves ONLY the high endpoint inward by m rungs of the imp-33810 quarter-decade
 *   ladder: window [6, 11-0.25m] -> rungs [0, 20-m] (m=0..9, width 5.0-0.25m decades). The low endpoint
 *   stays pinned at rung 0 (k=6). By the imp-33962 R1 telescoping identity the aggregate residual factor
 *   over that window is the endpoint slice
 *     F4(m) = resid(hi)/resid(lo) = resid(rung at k=11-0.25m) / resid(rung 0)
 *   Because the low endpoint is fixed, F4(m) = 1 is exactly the condition resid(rung 11-0.25m) =
 *   resid(rung 0): the moving high-endpoint residual equals the pinned low-endpoint residual. The full
 *   window (m=0) has F4 = 0.8743 < 1 (ln F4 = -0.1343); tail-only F4 rises through unity between m=0 and
 *   m=1. Bisect continuous m for ln F4(m) = 0.
 *
 * THE FINDING (numerical / measurement only)
 * ------------------------------------------
 *   (R1) TAIL-ONLY F4 CROSSES UNITY AT m* ~ 0.6063 (window k = 6.0000 .. 10.8484, width ~4.8484
 *        decades). There the moving high-endpoint residual resid(rung at k=10.8484) exactly equals the
 *        pinned low-endpoint residual resid(rung 0), so F4(m*) = 1 and |ln F4(m*)| ~ 1e-15 (bisected to
 *        double precision). This LOCATES the tail-only unity crossing imp-34086 R3 bracketed only to
 *        [0, 1]. The crossing sits ~0.073 rung EARLIER than the imp-34148 SYMMETRIC crossing (m* ~
 *        0.6791) because the tail-only trim lacks the offsetting head-down push, so its single tail-up
 *        push reaches the -0.1343 base sooner.
 *   (R2) THE WINDOW WIDTH AT THE CROSSING IS ~4.8484 DECADES (k = 6.0000 .. 10.8484), i.e. the high
 *        endpoint has retreated ~0.1516 decade from the full-window k=11. On the integer ladder the rung
 *        nearest the crossing is m=1 (F4 = 1.0881, |ln F4| = 0.0844) -- exactly the imp-34009 / imp-34086
 *        non-monotone tail share-bump rung (share 0.9386, above the 0.9225 full window).
 *   (R3) THE TAIL-ONLY AGGREGATE F2 SHARE PEAKS AT THE CROSSING. The share |ln F2|/(|ln F2|+|ln F3|+
 *        |ln F4|) is maximised where the F4 term vanishes: at m* the tail-only share reaches 0.9663 (vs
 *        0.9225 at the full window), essentially matching the imp-34148 symmetric peak (0.9662) because
 *        both maxima drop F4 out of the denominator. On the integer ladder the tail-only share peaks at
 *        the adjacent m=1 rung (0.9386), confirming the imp-34086 R2/R3 tail-driven bump is the discrete
 *        shadow of this continuous |ln F4|=0 crossing.
 *
 * The punchline: the tail-only F4 unity crossing imp-34086 R3 bracketed to [0, 1] is LOCATED at m* ~
 * 0.6063 (window k = 6.0000 .. 10.8484, width ~4.8484 decades), where the pinned-low-endpoint residual
 * is matched by the retreating high-endpoint residual, F4 = 1, and the tail-only F2 share peaks at
 * 0.9663. It falls ~0.073 rung short of the imp-34148 symmetric crossing (0.6791) because there is no
 * head-down push to offset -- the tail-up push alone reaches the base -0.1343 sooner.
 *
 * NUMERICAL / MEASUREMENT ONLY. Locating a crossing of an imp-34086 endpoint-sensitivity diagnostic,
 * NOT an RH bound. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the
 * factor identity is exact WITHIN that model only; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34086-aggregate-share-asymmetric-trim (the tail-only F4 unity crossing this locates, R3)
 * @see imp-34148-symmetric-trim-f4-cancellation (the companion symmetric-trim crossing, m* ~ 0.6791)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33884/imp-33962/imp-34009/imp-34086/imp-34148

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34148/imp-34086/imp-34009/imp-33962.
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

// TAIL-ONLY trim: only the high endpoint moves inward -> [6, 11-0.25m] (continuous m allowed); low fixed.
const kHiOf = (m) => 11 - 0.25 * m;
const LO = rungAtK(6); // pinned low endpoint (rung 0, k=6) -- shared by every tail-only window

// ln F4 over the tail-only window at trim m (imp-33962 R1 telescoping identity; low endpoint fixed).
function tailLnF4(m) {
  return Math.log(rungAtK(kHiOf(m)).resid / LO.resid);
}

// Full aggregate |ln| share over the tail-only window at trim m (imp-33962 R1 telescoping identity).
function tailWindow(m) {
  const b = rungAtK(kHiOf(m));
  const F2 = b.E_N / LO.E_N; // normaliser ratio over the window
  const F3 = LO.sflow / b.sflow; // slope ratio over the window
  const F4 = b.resid / LO.resid; // sub-leading residual ratio over the window
  const lF2 = Math.abs(Math.log(F2));
  const lF3 = Math.abs(Math.log(F3));
  const lF4 = Math.abs(Math.log(F4));
  const share = lF2 / (lF2 + lF3 + lF4);
  return {
    m,
    k_lo: 6,
    k_hi: +kHiOf(m).toFixed(4),
    width_decades: +(kHiOf(m) - 6).toFixed(4),
    agg_F4: +F4.toFixed(6),
    abs_lnF4: +Math.abs(Math.log(F4)).toFixed(6),
    agg_F2_share: +share.toFixed(6),
    _share: share,
    _lnF4: Math.log(F4),
  };
}

// The integer tail-only ladder m = 0..9 (the imp-34086 tail-only family).
const TAIL_WINDOWS = [];
for (let m = 0; m <= 9; m++) TAIL_WINDOWS.push(tailWindow(m));

// Bisect the continuous tail-only trim m* where ln F4(m*) = 0 (F4 = 1).
// The full window (m=0) has F4 < 1 (ln F4 < 0); tail-only F4 crosses unity between m=0 and m=1.
function bisectUnityCrossing() {
  let a = 0;
  let b = 1;
  // ln F4(0) < 0 and ln F4(1) > 0 -- a single sign change on [0,1].
  for (let i = 0; i < 100; i++) {
    const mid = 0.5 * (a + b);
    if (tailLnF4(mid) < 0) a = mid;
    else b = mid;
  }
  return 0.5 * (a + b);
}
const M_STAR = bisectUnityCrossing(); // ~0.606341

const STAR = tailWindow(M_STAR);
const CROSSING = {
  m_star: +M_STAR.toFixed(6), // 0.606341
  k_lo: 6, // pinned full-window low endpoint
  k_hi: +kHiOf(M_STAR).toFixed(6), // 10.848415 (high endpoint retreated ~0.1516 decade from k=11)
  width_decades: +(kHiOf(M_STAR) - 6).toFixed(6), // 4.848415
  base_lnF4_full: +tailLnF4(0).toFixed(6), // -0.134309 (full-window tail ln F4)
  net_lnF4: +tailLnF4(M_STAR).toExponential(3), // ~ -1.1e-15 (bisected to double precision)
  agg_F4: +Math.exp(tailLnF4(M_STAR)).toFixed(8), // 1.00000000
  agg_F2_share_at_star: +STAR._share.toFixed(6), // 0.966312 (share peaks where F4 drops out)
  sym_crossing_m_star_ref_imp34148: 0.679085, // imp-34148 companion symmetric crossing (baked reference)
};

// The integer rung nearest the crossing is m=1 -- the imp-34009/imp-34086 non-monotone tail share bump.
const NEAREST_INTEGER_TRIM = TAIL_WINDOWS.reduce(
  (best, w) => (Math.abs(w._lnF4) < Math.abs(best._lnF4) ? w : best),
  TAIL_WINDOWS[0],
).m; // 1

export const IMP34149_TAIL_ONLY_F4_UNITY_CROSSING = {
  id: 'imp-34149',
  proofSection: 'S-frontier',
  question:
    'imp-34086 R3 found the tail-only residual factor F4 rises monotonically through unity between m=0 ' +
    '(F4 ~ 0.8743) and m=1 (F4 ~ 1.0881) -- the event that drives the non-monotone m=1 aggregate-share ' +
    'bump -- but located the crossing only to the integer bracket [0, 1]. Bisect the SAME imp-33962 ' +
    'telescoping identity F4(win) = resid(hi)/resid(lo) on the tail-only window [6, 11-0.25m], with the ' +
    'inherited imp-3406/imp-33810 sub-terms on continuous m, for the fractional m* where tail-only ' +
    'F4(m*) = 1 exactly, and report the window width and share there. Measurement only; component model ' +
    'NOT rigorous; changes no bound; NO QED.',
  measuredQuantity:
    'tail-only aggregate residual factor F4(m) = resid(rung at k=11-0.25m)/resid(rung 0) over the window ' +
    '[6, 11-0.25m] (low endpoint pinned at rung 0), its |ln F4(m)|, the aggregate F2 share, and the ' +
    'bisected fractional trim m* where ln F4(m*) = 0 with its window width and share',
  tailWindows: TAIL_WINDOWS.map(({ _share, _lnF4, ...rest }) => rest),
  crossing: CROSSING,
  nearest_integer_trim: NEAREST_INTEGER_TRIM, // 1 (the imp-34009/imp-34086 tail m=1 share bump rung)
  finding: {
    R1_tail_only_F4_crosses_unity_at_m_star:
      'Tail-only F4 crosses unity at m* ~ 0.6063 (window k = 6.0000 .. 10.8484, width ~4.8484 decades): ' +
      'the moving high-endpoint residual resid(rung at k=10.8484) exactly equals the pinned low-endpoint ' +
      'residual resid(rung 0), so F4(m*) = 1 and |ln F4(m*)| ~ 1e-15. This LOCATES the tail-only unity ' +
      'crossing imp-34086 R3 bracketed only to [0, 1]. It sits ~0.073 rung earlier than the imp-34148 ' +
      'symmetric crossing (m* ~ 0.6791) because the tail-only trim lacks the offsetting head-down push, ' +
      'so its single tail-up push reaches the -0.1343 base sooner.',
    R2_window_width_and_nearest_integer:
      'The window width at the crossing is ~4.8484 decades (k = 6.0000 .. 10.8484): the high endpoint has ' +
      'retreated ~0.1516 decade from the full-window k=11. On the integer ladder the rung nearest the ' +
      'crossing is m=1 (F4 = 1.0881, |ln F4| = 0.0844), exactly the imp-34009/imp-34086 non-monotone tail ' +
      'share-bump rung (share 0.9386, above the 0.9225 full window).',
    R3_tail_only_share_peaks_at_the_crossing:
      'The tail-only aggregate share |ln F2|/(|ln F2|+|ln F3|+|ln F4|) is maximised where the F4 term ' +
      'vanishes: at m* the share reaches 0.9663 (vs 0.9225 full window), essentially matching the ' +
      'imp-34148 symmetric peak (0.9662) because both maxima drop F4 out of the denominator. On the ' +
      'integer ladder the tail-only share peaks at the adjacent m=1 rung (0.9386), confirming the ' +
      'imp-34086 R2/R3 tail-driven bump is the discrete shadow of this continuous |ln F4|=0 crossing.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / LOCATED CROSSING (frontier-direction, NOT rigorous). Bisecting the tail-only ' +
    'ln F4(m) = 0 condition LOCATES the imp-34086 R3 tail-only F4 unity crossing at m* ~ 0.6063 (window ' +
    'k = 6.0000 .. 10.8484, width ~4.8484 decades): the retreating high-endpoint residual matches the ' +
    'pinned low-endpoint residual resid(rung 0), driving F4 to unity (|ln F4| ~ 1e-15) and the tail-only ' +
    'aggregate F2 share to its 0.9663 peak. It falls ~0.073 rung short of the imp-34148 symmetric ' +
    'crossing (0.6791) because there is no head-down push to offset the tail-up push. The imp-34009/' +
    'imp-34086 non-monotone m=1 tail share bump (0.9386) is the discrete shadow of this continuous ' +
    '|ln F4|=0 crossing. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; ' +
    'the factor identity is exact WITHIN the model only; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34086 (the tail-only F4 unity crossing this locates, R3); imp-34148 (the companion symmetric ' +
    'crossing m* ~ 0.6791); imp-34009 (the symmetric endpoint sweep + m=1 share bump); imp-33962 (the ' +
    '0.9225 aggregate F2 share, telescoping identity); imp-33810 (the 21 quarter-decade rungs); ' +
    'lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34149_TAIL_ONLY_F4_UNITY_CROSSING_ASSERTIONS = [
  {
    // (setup) 10 tail-only windows m=0..9; the full window reproduces the imp-34086 tail F4 headline.
    id: 'imp34149-tail-ladder-reproduces-full-window-F4',
    description: 'tail-only m=0 is the full 5-decade window with F4 ~ 0.8743, m=1 ~ 1.0881 (matches imp-34086)',
    holds: () =>
      TAIL_WINDOWS.length === 10 &&
      TAIL_WINDOWS[0].width_decades === 5 &&
      TAIL_WINDOWS[9].width_decades === 2.75 &&
      Math.abs(TAIL_WINDOWS[0].agg_F4 - 0.874320) < 1e-4 &&
      Math.abs(TAIL_WINDOWS[1].agg_F4 - 1.088093) < 1e-4 &&
      Math.abs(TAIL_WINDOWS[9].agg_F4 - 2.731543) < 1e-4,
  },
  {
    // (R1) The tail-only F4 unity crossing is located at m* ~ 0.6063 with F4 = 1.
    id: 'imp34149-crossing-located-at-m-star',
    description: 'bisected tail-only trim m* ~ 0.6063 gives F4 = 1 with |ln F4| ~ 1e-15 (double precision)',
    holds: () =>
      Math.abs(M_STAR - 0.606341) < 1e-4 &&
      Math.abs(Math.exp(tailLnF4(M_STAR)) - 1) < 1e-6 &&
      Math.abs(tailLnF4(M_STAR)) < 1e-9 &&
      Math.abs(CROSSING.base_lnF4_full - -0.134309) < 1e-4,
  },
  {
    // (R2) The crossing window width is ~4.8484 decades, k_hi ~ 10.8484; it sits below the symmetric m*.
    id: 'imp34149-window-width-and-below-symmetric',
    description: 'crossing window width ~4.8484 decades (k_hi ~ 10.8484); tail m* < the imp-34148 symmetric m* ~ 0.6791',
    holds: () =>
      Math.abs(CROSSING.width_decades - 4.848415) < 1e-4 &&
      Math.abs(CROSSING.k_hi - 10.848415) < 1e-4 &&
      M_STAR < CROSSING.sym_crossing_m_star_ref_imp34148 &&
      NEAREST_INTEGER_TRIM === 1,
  },
  {
    // (R3) The tail-only share peaks at the crossing (F4 out of the denominator); integer peak is m=1.
    id: 'imp34149-share-peaks-at-crossing',
    description: 'tail-only F2 share peaks at m* (~0.9663) where F4 vanishes; integer ladder peaks at m=1 (0.9386)',
    holds: () =>
      Math.abs(CROSSING.agg_F2_share_at_star - 0.966312) < 1e-3 &&
      CROSSING.agg_F2_share_at_star > TAIL_WINDOWS[0]._share &&
      TAIL_WINDOWS[1]._share > TAIL_WINDOWS[0]._share &&
      TAIL_WINDOWS[1]._share > TAIL_WINDOWS[2]._share &&
      TAIL_WINDOWS[0]._lnF4 < 0 &&
      TAIL_WINDOWS[1]._lnF4 > 0,
  },
  {
    // Honesty gate: numerical/measurement only, isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp34149-honesty-gate-no-qed',
    description: 'Located-crossing measurement only: isRigorous false, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP34149_TAIL_ONLY_F4_UNITY_CROSSING.isRigorous === false &&
      /NO QED/.test(IMP34149_TAIL_ONLY_F4_UNITY_CROSSING.verdict) &&
      /refereed bound is changed/i.test(IMP34149_TAIL_ONLY_F4_UNITY_CROSSING.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34149_TAIL_ONLY_F4_UNITY_CROSSING.verdict),
  },
];

for (const a of IMP34149_TAIL_ONLY_F4_UNITY_CROSSING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34149-tail-only-f4-unity-crossing assertion failed: ${a.id}`);
  }
}
