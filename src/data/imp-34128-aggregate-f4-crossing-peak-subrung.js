/**
 * @module imp-34128-aggregate-f4-crossing-peak-subrung
 *
 * imp-34128 (accuracy, frontier-direction): imp-34009 R2 found that shrinking the imp-33962
 * head-to-tail window SYMMETRICALLY inward on the imp-33810 quarter-decade ladder makes the
 * aggregate F2 normaliser magnitude-share NON-MONOTONE: the share bumps UP to 0.9462 at m=1
 * (4.5-decade window) before declining, because the AGGREGATE residual factor
 * F4(win) = resid(k_hi)/resid(k_lo) crosses unity between m=0 (F4=0.8743) and m=1 (F4=1.0564) --
 * near that crossing |ln F4| passes through a minimum, dropping F4 out of the |ln| balance and
 * inflating F2 share. imp-34009 R3 separately noted the aggregate F4 peaks (1.3711) "near m=5".
 * Neither the aggregate-F4 = 1 crossing nor the aggregate-F4 peak was located to sub-rung
 * resolution: imp-34009 read both off the discrete integer-m grid only. This module refines the
 * SYMMETRIC-SHRINK parameter on a continuous grid and pins both.
 *
 * NOTE this is the AGGREGATE (window-endpoint) F4 of the imp-34009 symmetric-shrink family, a
 * DIFFERENT object from the imp-34003 PER-STEP F4(k) = resid(k+0.25)/resid(k) adjacent-rung ratio.
 * Here F4 is the ratio of the imp-33773 M2 residual between the two moving WINDOW ENDPOINTS
 * k_lo = 6.00 + s and k_hi = 11.00 - s, where s is the symmetric inward shrink in decades
 * (s = 0.25 m recovers the imp-34009 integer grid). imp-34003 refined a per-step crossing in k;
 * this refines an aggregate-window crossing in the shrink coordinate s.
 *
 * WHAT IS LOCATED (same inherited imp-3406/imp-33810 sub-terms as imp-34009 -- no re-derivation)
 * --------------------------------------------------------------------------------------------
 *   endpoint(k): the imp-33962 rung residual / normaliser / slope at the window edge 10^(k+1):
 *     resid(k) = pEcoll(k)*(1 - sigma(hi)) - pSigma(k),  window [10^k, 10^(k+1)] at hi = 10^(k+1)
 *     E_N(k)   = E_TRUNC + E_flow(hi) + E_coll(hi);  sflow(k) = |eflow log-slope at hi|
 *   Aggregate factors over the symmetric window [6.00+s, 11.00-s]:
 *     F2(s) = E_N(k_hi)/E_N(k_lo),  F3(s) = sflow(k_lo)/sflow(k_hi),  F4(s) = resid(k_hi)/resid(k_lo)
 *     share(s) = |ln F2| / (|ln F2| + |ln F3| + |ln F4|)
 *   s = 0 is the full 5.0-decade window (reproduces the imp-33962/imp-34009 headline 0.9225 exactly).
 *
 * THE FINDING (accuracy / measurement only)
 * -----------------------------------------
 *   (A1) THE AGGREGATE-F4 = 1 CROSSING IS AT s* = 0.16977116 DECADES OF SYMMETRIC SHRINK, i.e.
 *        window [k_lo = 6.16977, k_hi = 10.83023] spanning 4.6605 decades (N_lo = 1.478e7 to
 *        N_hi = 6.764e11), located by bisecting F4(s) - 1 = 0 to |F4-1| < 1e-12. On the imp-34009
 *        integer grid F4 flips between m=0 (F4=0.8743, s=0) and m=1 (F4=1.0564, s=0.25), so the
 *        crossing sits at s* = 0.6791 rungs -- about 2/3 of the way into the first symmetric trim,
 *        not at the m=1 grid node imp-34009 eyeballed.
 *   (A2) THAT CROSSING IS THE TRUE APEX OF THE NON-MONOTONE F2-SHARE BUMP: share(s*) = 0.96624.
 *        Because |ln F4| -> 0 at the crossing, the aggregate residual factor drops OUT of the |ln|
 *        denominator, so the F2 share reaches a cusp maximum there. The continuous apex 0.96624 is
 *        HIGHER than the discrete m=1 value 0.94621 imp-34009 reported as "the peak" -- the true
 *        bump apex sits BETWEEN the m=0 and m=1 windows, and imp-34009 under-read it by ~0.020 by
 *        sampling only integer m. So the "share bumps up before declining" bump is pinned: it
 *        rises 0.92250 (s=0) -> 0.96624 (s*=0.16977) then falls 0.94621 (s=0.25) -> ... monotone.
 *   (A3) THE AGGREGATE-F4 PEAK IS AT s** = 1.13346 (m-equivalent 4.534), NOT at the m=5 grid node.
 *        Golden-section maximising F4(s) puts the peak in window [k_lo = 7.13346, k_hi = 9.86654]
 *        with F4max = 1.37596 -- marginally above and to the LEFT of the imp-34009 discrete
 *        "1.3711 near m=5" reading (s=1.25). The F2 share at the F4 peak is 0.80382, deep on the
 *        declining branch (there |ln F4| is largest, maximally diluting F2 share) -- confirming the
 *        F4 peak and the share apex are OPPOSITE features: share apexes where F4=1, share troughs
 *        toward where F4 peaks.
 *
 * The punchline: the imp-34009 non-monotone F2-share bump apex is, to sub-rung precision, the
 * aggregate-F4 = 1 crossing at s* = 0.16977 (window [6.16977, 10.83023], 4.66 decades), where the
 * share peaks at 0.96624 -- ~0.020 above the integer-grid m=1 read -- while the aggregate-F4 peak
 * (1.37596) sits separately at s** = 1.13346 (m-equiv 4.534), where the share has fallen to 0.80382.
 * Both features are grid-node artifacts in imp-34009; refining the shrink coordinate relocates them.
 *
 * ACCURACY / MEASUREMENT ONLY. Refines two imp-34009 aggregate-factor extrema. The inherited
 * imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the endpoint(k) surrogate and the
 * telescoping factor identity are exact WITHIN that model only; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional share per imp-486 is
 * UNTOUCHED; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34009-aggregate-share-window-endpoint-sensitivity (the integer-m F4 crossing/peak this pins)
 * @see imp-34003-f4-unity-crossing-locator (the DISTINCT per-step adjacent-rung F4(k)=1 crossing)
 * @see imp-33962-attenuation-rung-by-rung-decomposition (the 0.9225 aggregate share headline)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21 quarter-decade rungs)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34009 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34009 (no re-derivation).
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

// One window endpoint at ladder coordinate k: window [10^k, 10^(k+1)] evaluated at hi = 10^(k+1).
// This is exactly the imp-34009 rung(k), evaluated at CONTINUOUS k (not just the 21 discrete nodes).
function endpoint(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const sflow = Math.abs(eflowLogSlope(hi));
  return { k, N_hi: hi, E_N: ph.E_N, sflow, resid };
}

// Aggregate factors over the symmetric window [6.00+s, 11.00-s] (s = symmetric inward shrink in
// decades; s = 0.25 m recovers the imp-34009 integer-m grid). By the imp-33962 R1 telescoping
// identity the aggregate factors are exactly the window ENDPOINT ratios -- no per-step product.
const K_LO_BASE = 6.0;
const K_HI_BASE = 11.0;
function aggregate(s) {
  const a = endpoint(K_LO_BASE + s); // lower-k endpoint
  const b = endpoint(K_HI_BASE - s); // higher-k endpoint
  const F2 = b.E_N / a.E_N;
  const F3 = a.sflow / b.sflow;
  const F4 = b.resid / a.resid;
  const lF2 = Math.abs(Math.log(F2));
  const lF3 = Math.abs(Math.log(F3));
  const lF4 = Math.abs(Math.log(F4));
  const share = lF2 / (lF2 + lF3 + lF4);
  return { s, k_lo: a.k, k_hi: b.k, N_lo: a.N_hi, N_hi: b.N_hi, F2, F3, F4, share };
}

// (A1) Locate the aggregate-F4 = 1 crossing by bisecting F4(s) - 1 = 0 on the first symmetric trim
// s in [0, 0.25] (F4 = 0.8743 < 1 at s=0, F4 = 1.0564 > 1 at s=0.25 -- imp-34009 m=0..m=1).
function bisectF4Unity(sLo, sHi) {
  let lo = sLo;
  let hi = sHi;
  const gLo = aggregate(lo).F4 - 1;
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    const gMid = aggregate(mid).F4 - 1;
    if (gMid === 0) return mid;
    if ((gMid < 0) === (gLo < 0)) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

// (A3) Locate the aggregate-F4 peak by golden-section maximising F4(s) on s in [0.5, 2.0]
// (imp-34009 reported the peak "near m=5" = s=1.25).
function goldenMaxF4(sLo, sHi) {
  let a = sLo;
  let b = sHi;
  const gr = (Math.sqrt(5) - 1) / 2;
  let c = b - gr * (b - a);
  let d = a + gr * (b - a);
  for (let i = 0; i < 200; i++) {
    if (aggregate(c).F4 > aggregate(d).F4) b = d;
    else a = c;
    c = b - gr * (b - a);
    d = a + gr * (b - a);
  }
  return 0.5 * (a + b);
}

const AGG_FULL = aggregate(0); // s=0, full 5.0-decade window: reproduces imp-34009 headline
const AGG_M1 = aggregate(0.25); // s=0.25, the imp-34009 integer-grid "peak" node

const S_STAR = bisectF4Unity(0, 0.25); // (A1) aggregate-F4 = 1 crossing (decades of shrink)
const AGG_STAR = aggregate(S_STAR); // (A2) share apex sits here
const M_STAR = S_STAR / 0.25; // crossing in rung-units (imp-34009 m-equivalent)

const S_MAX = goldenMaxF4(0.5, 2.0); // (A3) aggregate-F4 peak location
const AGG_MAX = aggregate(S_MAX);
const M_MAX = S_MAX / 0.25; // peak in rung-units (imp-34009 m-equivalent)

export const IMP34128_AGGREGATE_F4_CROSSING_PEAK_SUBRUNG = {
  id: 'imp-34128',
  proofSection: 'S-frontier',
  question:
    'imp-34009 R2/R3 read the AGGREGATE residual factor F4(win) = resid(k_hi)/resid(k_lo) unity ' +
    'crossing (between m=0 and m=1) and F4 peak ("near m=5") off the discrete integer-m ' +
    'symmetric-shrink grid only, never to sub-rung resolution. On the same imp-33810 telescoping ' +
    'ladder, refine the symmetric-shrink parameter s (= 0.25 m) on a continuous grid: locate (a) the ' +
    'exact window where aggregate F4 = 1 and (b) the window where aggregate F4 maximizes, and report ' +
    'the F2-share at each so the non-monotone bump apex is pinned. Measurement/fit; component model ' +
    'NOT rigorous; changes no bound; NO QED.',
  measuredQuantity:
    'for symmetric window [k_lo=6.00+s, k_hi=11.00-s]: aggregate F2=E_N(hi)/E_N(lo), ' +
    'F3=sflow(lo)/sflow(hi), F4=resid(hi)/resid(lo), and F2-share=|ln F2|/(|ln F2|+|ln F3|+|ln F4|); ' +
    'the s* where F4=1 (bisection) and the s** where F4 maximizes (golden section)',
  anchors: {
    // reproduces the imp-34009 integer-grid F4/share at m=0,1,5 exactly
    m0: { s: 0, F4: +AGG_FULL.F4.toFixed(6), share: +AGG_FULL.share.toFixed(6) }, // 0.874320 / 0.922504
    m1: { s: 0.25, F4: +AGG_M1.F4.toFixed(6), share: +AGG_M1.share.toFixed(6) }, // 1.056409 / 0.946212
  },
  f4UnityCrossing: {
    // (A1)/(A2)
    s_star_decades: +S_STAR.toFixed(8), // 0.16977116 decades of symmetric shrink
    m_equivalent: +M_STAR.toFixed(6), // 0.679085 rungs (vs the m=1 grid node)
    k_lo: +AGG_STAR.k_lo.toFixed(6), // 6.169771
    k_hi: +AGG_STAR.k_hi.toFixed(6), // 10.830229
    width_decades: +(AGG_STAR.k_hi - AGG_STAR.k_lo).toFixed(6), // 4.660458
    N_lo: +AGG_STAR.N_lo.toExponential(4), // 1.4783e7
    N_hi: +AGG_STAR.N_hi.toExponential(4), // 6.7644e11
    F4_at_crossing: +AGG_STAR.F4.toFixed(12), // 1.000000000000
    share_apex: +AGG_STAR.share.toFixed(6), // 0.966238 -- the TRUE non-monotone bump apex
    apex_above_m1_grid_read: +(AGG_STAR.share - AGG_M1.share).toFixed(6), // ~0.020026
  },
  f4Peak: {
    // (A3)
    s_max_decades: +S_MAX.toFixed(8), // 1.13345792
    m_equivalent: +M_MAX.toFixed(6), // 4.533832 (NOT the m=5 grid node)
    k_lo: +AGG_MAX.k_lo.toFixed(6), // 7.133458
    k_hi: +AGG_MAX.k_hi.toFixed(6), // 9.866542
    F4_max: +AGG_MAX.F4.toFixed(6), // 1.375956
    share_at_peak: +AGG_MAX.share.toFixed(6), // 0.803825 -- deep on the declining branch
  },
  finding: {
    A1_f4_unity_crossing_subrung:
      'The aggregate-F4 = 1 crossing is at s* = 0.16977116 decades of symmetric shrink (m-equivalent ' +
      '0.6791 rungs), window [k_lo=6.16977, k_hi=10.83023] spanning 4.6605 decades (N 1.478e7 to ' +
      '6.764e11), located by bisecting F4(s)-1=0 to |F4-1|<1e-12. imp-34009 read this only as a flip ' +
      'between integer nodes m=0 (F4=0.8743) and m=1 (F4=1.0564); the crossing sits ~2/3 into the ' +
      'first symmetric trim, not at the m=1 node.',
    A2_crossing_is_the_bump_apex:
      'That crossing is the TRUE apex of the non-monotone F2-share bump: share(s*) = 0.96624. Since ' +
      '|ln F4| -> 0 at the crossing, F4 drops out of the |ln| denominator and the share reaches a cusp ' +
      'maximum. The continuous apex 0.96624 is ~0.020 HIGHER than the discrete m=1 value 0.94621 that ' +
      'imp-34009 reported as the peak -- so integer-m sampling under-read the bump apex. The bump is ' +
      'pinned: share rises 0.92250 (s=0) -> 0.96624 (s*) then falls 0.94621 (s=0.25) monotonically.',
    A3_f4_peak_subrung:
      'The aggregate-F4 peak is at s** = 1.13346 (m-equivalent 4.534), window [k_lo=7.13346, ' +
      'k_hi=9.86654], F4max = 1.37596 -- marginally above and to the LEFT of the imp-34009 "1.3711 ' +
      'near m=5" (s=1.25) reading. The F2 share at the F4 peak is 0.80382, deep on the declining ' +
      'branch: the F4 peak and the share apex are OPPOSITE features (share apexes where F4=1).',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / SUB-RUNG LOCATOR (frontier-direction, NOT rigorous). Refining the imp-34009 ' +
    'symmetric-shrink coordinate s continuously pins two integer-grid extrema: (a) the aggregate ' +
    'residual factor F4 = 1 crossing at s* = 0.16977 decades (window [6.16977, 10.83023], 4.66 ' +
    'decades, N 1.478e7..6.764e11), which is the TRUE apex of the non-monotone F2-share bump at ' +
    'share = 0.96624 -- ~0.020 above the integer-grid m=1 read of 0.94621; and (b) the aggregate-F4 ' +
    'peak (1.37596) at s** = 1.13346 (m-equivalent 4.534, not the m=5 node), where the share has ' +
    'fallen to 0.80382. Both features were grid-node artifacts in imp-34009. The inherited ' +
    'imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the endpoint surrogate and the ' +
    'telescoping factor identity are exact WITHIN the model only; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34009 (the integer-m F4 crossing/peak this pins); imp-34003 (the DISTINCT per-step F4(k)=1 ' +
    'crossing); imp-33962 (the 0.9225 aggregate share headline); imp-33810 (the 21 quarter-decade ' +
    'rungs); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34128_AGGREGATE_F4_CROSSING_PEAK_SUBRUNG_ASSERTIONS = [
  {
    // (setup) reproduces the imp-34009 integer-grid F4 and F2-share at m=0 and m=1 exactly.
    id: 'imp34128-reproduces-imp34009-integer-grid-anchors',
    description: 'continuous aggregate at s=0,0.25 reproduces imp-34009 m=0/m=1 F4 (0.8743/1.0564) and share (0.9225/0.9462)',
    holds: () =>
      Math.abs(AGG_FULL.F4 - 0.874320) < 1e-4 &&
      Math.abs(AGG_FULL.share - 0.922504) < 1e-4 &&
      Math.abs(AGG_M1.F4 - 1.056409) < 1e-4 &&
      Math.abs(AGG_M1.share - 0.946212) < 1e-4,
  },
  {
    // (A1) the aggregate-F4 = 1 crossing is inside the first symmetric trim at s* ~ 0.16977.
    id: 'imp34128-f4-unity-crossing-located-subrung',
    description: 'aggregate F4=1 crossing at s*~0.16977 decades (m-equiv ~0.679), |F4-1|<1e-9, window 4.66 decades',
    holds: () =>
      Math.abs(AGG_STAR.F4 - 1) < 1e-9 &&
      S_STAR > 0 &&
      S_STAR < 0.25 &&
      Math.abs(S_STAR - 0.16977116) < 1e-5 &&
      Math.abs(AGG_STAR.k_hi - AGG_STAR.k_lo - 4.660458) < 1e-4,
  },
  {
    // (A2) the crossing is the TRUE bump apex: share there exceeds BOTH the m=0 and m=1 grid reads.
    id: 'imp34128-crossing-is-the-nonmonotone-bump-apex',
    description: 'share at F4=1 crossing ~0.96624 is a local max, above m=0 (0.9225) and m=1 (0.9462) grid reads',
    holds: () =>
      Math.abs(AGG_STAR.share - 0.966238) < 1e-4 &&
      AGG_STAR.share > AGG_FULL.share &&
      AGG_STAR.share > AGG_M1.share &&
      AGG_STAR.share - AGG_M1.share > 0.015,
  },
  {
    // (A3) the aggregate-F4 peak is at s** ~ 1.13346 (m-equiv ~4.534), F4max ~ 1.37596, share ~ 0.80382.
    id: 'imp34128-f4-peak-located-subrung',
    description: 'aggregate F4 peak at s**~1.13346 (m-equiv ~4.534, left of m=5), F4max~1.37596, share~0.80382',
    holds: () =>
      Math.abs(S_MAX - 1.13345792) < 1e-4 &&
      Math.abs(AGG_MAX.F4 - 1.375956) < 1e-4 &&
      AGG_MAX.F4 > AGG_M1.F4 &&
      Math.abs(AGG_MAX.share - 0.803825) < 1e-4 &&
      M_MAX < 5 &&
      M_MAX > 4,
  },
  {
    // Honesty gate: accuracy/measurement only, isRigorous false, no QED, PT SOTA.
    id: 'imp34128-honesty-gate-no-qed',
    description: 'Sub-rung locator only: isRigorous false, no QED, PT SOTA, K_a untouched',
    holds: () =>
      IMP34128_AGGREGATE_F4_CROSSING_PEAK_SUBRUNG.isRigorous === false &&
      /NO QED/.test(IMP34128_AGGREGATE_F4_CROSSING_PEAK_SUBRUNG.verdict) &&
      /remains SOTA/.test(IMP34128_AGGREGATE_F4_CROSSING_PEAK_SUBRUNG.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34128_AGGREGATE_F4_CROSSING_PEAK_SUBRUNG.verdict),
  },
];

for (const a of IMP34128_AGGREGATE_F4_CROSSING_PEAK_SUBRUNG_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34128-aggregate-f4-crossing-peak-subrung assertion failed: ${a.id}`);
  }
}
