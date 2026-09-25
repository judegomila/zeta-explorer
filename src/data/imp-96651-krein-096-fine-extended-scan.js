/**
 * @fileoverview imp-96651 -- INDEPENDENT finer + extended global positivity scan of the
 * 2a=0.96 Krein sigma_2 certificate (rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js),
 * refining imp-96633 which used only a COARSE [0,60] step-0.05 scan (1201 nodes).
 *
 * METHOD. Same independent code path as imp-96633: sigma_2(t) = (t^2 + 1/4)^2 (Re psi(1/4 + i t/2)
 * - ln pi - sqrt2 ln2 cos(t ln2)) via mpmath built-in high-precision digamma (mp.dps=40), NOT the
 * mpmath.iv verifier verify4. The certificate trig-polynomial sum_k sum_j c_k[j] t^k trig_k(xs[j] t)
 * (trig_k = cos even k, sin odd k) was re-summed from the baked xs / c0..c4 arrays; F = sigma_2 + trig.
 * Refinements over imp-96633: (a) global step 0.01 on [0,60] (6001 nodes); (b) ultra-fine step 0.001
 * across the sigma_2/nu near-cancellation window [10,12]; (c) EXTENDED [60,80] step 0.01 past T=60,
 * where verify4 tail bracket takes over, to check the independent point value into the tail regime.
 * Driver: tmp/imp-96651-fine-extended-scan.py. Numeric confirmation only; no interval upgrade, NO QED.
 *
 * FINDINGS.
 *   1. POSITIVITY CONFIRMED, and unchanged from imp-96633: raw F > 0 on every node of all three
 *      finer/extended grids (below0 = 0 on [0,60] step0.01, on [10,12] step0.001, and on [60,80]).
 *      The infimum of raw F is far from 0: min F ~ 7.9867 at t ~ 9.025 (refined step 2e-4), robust
 *      positivity margin ~ 7.99. In the extended tail regime the point value grows fast
 *      (F ~ 8.72e6 at t=63.2), consistent with the sigma_2 ~ t^4 growth the verify4 tail bracket bounds.
 *
 *   2. DESIGN-MARGIN DIP the coarse grid missed. The finer step-0.01 grid reveals raw F dips
 *      MARGINALLY BELOW the nominal design margin eps=8.0 near t=9.025 (min F 7.9867 < 8), and the
 *      full design condition F >= eps + eps_rel sigma_2^+ is violated at 21 of 6001 nodes on [0,60]
 *      (worst margin F-(eps+eps_rel sigma_2^+) = -2.72 at t=12.48, where raw F=38.85 but eps_rel*sigma_2
 *      inflates the threshold to 41.75). imp-96633 reported globalScanMinF=8.001030 and 0 sub-threshold
 *      cells because the 0.05 step landed between these narrow sub-margin dips.
 *
 *   3. This does NOT bear on the certified conclusion. verify4 certifies F > 0 (equivalently
 *      T_a[sigma_2] >= 0) via its per-cell rigorous Taylor lower bound Flow > 0 plus the tail bracket
 *      and zero failing-cell count; the parameter eps enters verify4 only as the fine-grid RESOLUTION
 *      tolerance (tol = 0.1(eps + eps_rel sigma_2^+) sets rf), NOT as an acceptance threshold. So the
 *      sub-eps dip near t=9 is a cosmetic design-margin observation, not a positivity failure.
 *
 * READING. Refining imp-96633 from step 0.05 to step 0.01 (plus ultra-fine 0.001 near the t~11
 * near-cancellation window and an extension to t=80 past the T=60 tail handoff) independently
 * re-confirms the 2a=0.96 certificate positivity F > 0 everywhere (min F ~ 7.99), including the tail
 * regime. The only new observation is that raw F dips just below the design margin eps=8 near t=9.025
 * -- a narrow sub-margin dip the coarse grid stepped over -- which does not affect the verify4
 * positivity conclusion because eps is a resolution parameter there, not a pass/fail threshold.
 * SUB-GAP IMP96651_DESIGN_MARGIN_DIP: the LP margin eps=8 is not uniformly met by the emitted
 * coefficients near t~9 (raw F 7.987); a re-solve with a small headroom bump, or reporting the
 * achieved margin ~7.987 instead of the nominal 8, would tighten the design record. Cosmetic;
 * positivity and the interval-verified conclusion unchanged.
 */
export const KREIN_096_FINE_EXTENDED_SCAN = Object.freeze({
  ticket: 'imp-96651',
  cert: 'rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js (2a=0.96)',
  method: 'independent mp.digamma sigma_2 + re-summed trig-poly (mp.dps=40), NOT the mpmath.iv verifier verify4',
  script: 'tmp/imp-96651-fine-extended-scan.py',
  refinesTicket: 'imp-96633',
  twoA: 0.96, a: 0.48, eps: 8.0, eps_rel: 0.001, kmax: 4, atoms: 154,
  grids: Object.freeze({
    fine_0_60_step0p01: Object.freeze({
      nodes: 6001, minF: 7.987226, minFat: 9.03, below0: 0, belowThreshold: 21,
      minMargin: -2.719563, minMarginAt: 12.48,
    }),
    ultra_10_12_step0p001: Object.freeze({
      nodes: 2001, minF: 8.001056, minFat: 10.418, below0: 0, belowThreshold: 0,
    }),
    extended_60_80_step0p01: Object.freeze({
      nodes: 2001, minF: 8723115.8, minFat: 63.2, below0: 0, belowThreshold: 0,
    }),
  }),
  refinedInfimum: Object.freeze({ rawFmin: 7.9867, at: 9.0254, positive: true, step: 2e-4 }),
  coarseComparison: 'imp-96633 step0.05 reported globalScanMinF=8.001030 (0 sub-threshold cells); finer step0.01 finds raw F dips to 7.987 near t=9.025',
  positivityConfirmed: true,
  designMarginMet: false,
  subGap: 'IMP96651_DESIGN_MARGIN_DIP -- raw F dips to 7.987 < eps=8 near t=9.025 (21/6001 nodes below eps+eps_rel sigma_2^+ on [0,60]); the coarse step-0.05 scan stepped over it. eps is a verify4 resolution parameter not an acceptance threshold, so positivity F>0 (T_a[sigma_2]>=0) is unaffected.',
  interval: false,
  qed: false,
});
export default KREIN_096_FINE_EXTENDED_SCAN;
