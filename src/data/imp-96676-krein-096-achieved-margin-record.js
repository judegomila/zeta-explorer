/**
 * @fileoverview imp-96676 -- ACHIEVED-MARGIN record for the 2a=0.96 Krein sigma_2 certificate
 * (rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js), correcting the nominal design
 * record eps=8.0 to the margin the emitted coefficients actually achieve, per SUB-GAP
 * IMP96651_DESIGN_MARGIN_DIP.
 *
 * BACKGROUND. imp-96651 (finer step-0.01 [0,60] scan, 6001 nodes) found raw F = sigma_2 + trig
 * dips MARGINALLY below the nominal LP design margin eps=8 near t~9.025 (min raw F 7.9867, refined
 * step 2e-4), and the full design condition F >= eps + eps_rel sigma_2^+ (eps_rel=0.001) is violated
 * at 21 of 6001 nodes on [0,60]. The coarse step-0.05 imp-96633 scan (globalScanMinF 8.001030, 0
 * sub-threshold cells) stepped over these narrow dips. This ticket records the ACHIEVED margins in
 * place of the nominal eps=8 -- the OR branch of the sub-gap (record achieved margin rather than
 * re-solve the LP with a headroom bump).
 *
 * WHY RECORD, NOT RE-SOLVE. eps enters the mpmath.iv verifier verify4 ONLY as the fine-grid
 * RESOLUTION tolerance (tol = 0.1(eps + eps_rel sigma_2^+) sets rf), NOT as an acceptance threshold.
 * verify4 certifies F > 0 (equivalently T_a[sigma_2] >= 0) via its per-cell rigorous Taylor lower
 * bound Flow > 0 plus the tail bracket and a zero failing-cell count. Re-baking coefficients from a
 * headroom-bumped LP would change the certified payload and its verify4 resolution behaviour for a
 * purely cosmetic gain, so we DO NOT touch the payload eps=8.0; positivity F>0 is unchanged either way.
 *
 * ACHIEVED MARGINS (from the imp-96651 step-0.01 [0,60] scan, mp.dps=40 independent digamma path):
 *   - Raw-F floor near t~9: inf raw F = 7.9867 at t=9.0254 (nominal eps=8; shortfall 0.0133, 0.166%).
 *     This is the narrow sub-margin dip the coarse grid missed; raw F stays > 0 throughout (below0=0).
 *   - Full design-condition floor: inf (F - eps_rel sigma_2^+) = eps + minMargin = 8 + (-2.719563)
 *     = 5.280437 at t=12.48 (where raw F=38.85 but eps_rel*sigma_2^+ inflates the threshold to 41.75).
 *     So the coefficients meet F >= eps_achieved + eps_rel sigma_2^+ uniformly on [0,60] with the
 *     CORRECTED achieved design margin eps_achieved = 5.2804 (not the nominal 8.0).
 *
 * READING. The 2a=0.96 certificate is design-record-correct at eps_achieved=5.2804 (full design
 * condition, worst at t=12.48) and raw-F floor 7.9867 (worst at t~9.025); both are strictly positive,
 * so the verify4-certified conclusion T_a[sigma_2] >= 0 is untouched. The nominal eps=8 baked in the
 * payload overstated the uniformly-achieved margin; this record supersedes it for design bookkeeping.
 * Cosmetic design-record tightening; positivity and the interval-verified conclusion unchanged; NO QED.
 */
export const KREIN_096_ACHIEVED_MARGIN = Object.freeze({
  ticket: 'imp-96676',
  cert: 'rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js (2a=0.96)',
  subGap: 'IMP96651_DESIGN_MARGIN_DIP',
  branch: 'record-achieved-margin (payload eps=8.0 left untouched; LP not re-solved)',
  twoA: 0.96, a: 0.48, eps_rel: 0.001, kmax: 4, atoms: 154,
  nominal: Object.freeze({ eps: 8.0, source: 'payload design record / imp-96633 coarse scan' }),
  achieved: Object.freeze({
    rawFfloor: Object.freeze({ value: 7.9867, at: 9.0254, step: 2e-4, positive: true,
      shortfallVsNominal: 0.0133, shortfallPct: 0.166,
      note: 'narrow sub-margin dip missed by the coarse step-0.05 grid; raw F > 0 everywhere' }),
    designConditionFloor: Object.freeze({ epsAchieved: 5.280437, at: 12.48,
      formula: 'eps + minMargin = 8.0 + (-2.719563); inf over [0,60] of (F - eps_rel sigma_2^+)',
      belowThresholdNodes: 21, totalNodes: 6001, positive: true,
      note: 'threshold inflation by eps_rel*sigma_2^+ dominates here (raw F=38.85, threshold~41.75)' }),
  }),
  positivityConfirmed: true,
  positivityUnchanged: true,
  epsIsResolutionParam: true,
  supersedesNominalEps: true,
  interval: false,
  qed: false,
});
export default KREIN_096_ACHIEVED_MARGIN;
