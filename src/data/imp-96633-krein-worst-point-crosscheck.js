/**
 * @fileoverview imp-96633 -- INDEPENDENT re-evaluation of the two Krein sigma_2 certificates
 * (rh-route-i-toeplitz-krein-certificate-payload-2026-09-24.js) at their reported worst points,
 * OUTSIDE the mpmath.iv verifier tmp/toeplitz-krein-verify4.py.
 *
 * METHOD. sigma_2(t) = (t^2 + 1/4)^2 (Re psi(1/4 + i t/2) - ln pi - sqrt2 ln2 cos(t ln2)) was
 * recomputed with mpmath's built-in high-precision digamma (mp.dps=40) -- a completely different
 * code path from verify4's hand-rolled shifted-Stirling + Binet interval routine. The certificate
 * trig-polynomial sum_k sum_j c_k[j] t^k trig_k(xs[j] t) (trig_k = cos even k, sin odd k) was
 * re-summed independently from the baked xs / c0..c4 arrays. F(t) = sigma_2(t) + trig-poly was then
 * evaluated at the reported worst point, over a fine neighborhood, and on a coarse global scan
 * [0,60] step 0.05. Driver: tmp/imp-96633-crosscheck.py + tmp/imp-96633-probe.py. Numeric check
 * only; no interval upgrade, NO QED.
 *
 * FINDINGS.
 *   1. 2a=0.9 certificate (a=0.45, eps=20): reported worstFm=20.00000001587965 at t=0.273 is
 *      reproduced EXACTLY -- independent F(0.273)=20.000000 (delta 0.0e0). There sigma_2(0.273)
 *      = -0.569 is small and the fixed atoms c0[0]=20.075, c1[0]=16.427 dominate, so no cancellation
 *      sensitivity. Global scan: min raw F = 20.000000 at t=1.700; zero cells with F<=0; zero cells
 *      below eps+eps_rel sigma_2^+ over 1201 nodes. Positivity margin CONFIRMED independently.
 *
 *   2. 2a=0.96 certificate (a=0.48, eps=8): reported worstFm=7.39398412783612 at t=11.095 does NOT
 *      reproduce as a single-abscissa F value -- independent F(11.095)=14.2975 (sigma_2=6218.458,
 *      trig=-6204.160), flat 14.29..14.31 across the whole coarse cell. The reported 7.394 is a
 *      MIXED-ABSCISSA verifier diagnostic: worstFm = sigma_2(m) + nu(nf/2 fine point), i.e. sigma_2
 *      held at the cell midpoint m while nu is taken at a fine point offset ~ +0.0005. Because
 *      sigma_2 ~ +6218 and nu ~ -6204 nearly cancel, that 0.0005 offset swings the diagnostic ~7
 *      units: verified numerically sigma_2(11.095) + nu(11.095 + 0.0005) = 7.3940, matching the
 *      reported anchor to 4 sig-figs. The diagnostic is inconsistent (pessimistic), NOT a real point
 *      value and NOT a spurious near-failure of the rigorous test.
 *
 *   3. The rigorous certification is unaffected. verify4 passes/fails on the per-cell Taylor lower
 *      bound Flow>0 (which evaluates sigma_2 and nu on a CONSISTENT abscissa with rigorous C2/M2
 *      curvature slack) plus the tail bracket and the zero failing-cells count -- not on the
 *      worstFm monitor number. Independent positivity holds: global raw-F min ~ 8.001 at t=0
 *      (approx eps=8), F>0 across all 1201 scan nodes on [0,60], zero nodes below eps+eps_rel sigma_2^+.
 *
 * READING. Both Krein sigma_2 certificates are independently confirmed positive at and around their
 * worst points and on a coarse global scan; the 2a=0.9 anchor is exact. The one caveat is cosmetic:
 * the 2a=0.96 verification.worstFm=7.394 field is a mixed-abscissa monitor artifact of the near-exact
 * sigma_2/nu cancellation, not the true F(11.095)=14.30; it under-reports (errs safe) and does not
 * bear on the pass/fail decision. SUB-GAP IMP96633_WORSTFM_DIAGNOSTIC: the worstFm/worstAt monitor
 * in verify4 should evaluate sigma_2 and nu at the SAME abscissa (report min over the fine grid of
 * sigma_2(tf)+nu(tf)) so the anchor number is a genuine point value; this cross-check does not
 * change any certificate coefficient or the interval-verified positivity conclusion.
 */
export const KREIN_WORST_POINT_CROSSCHECK = Object.freeze({
  ticket: 'imp-96633',
  method: 'independent mp.digamma sigma_2 + re-summed trig-poly (mp.dps=40), NOT the mpmath.iv verifier',
  scripts: ['tmp/imp-96633-crosscheck.py', 'tmp/imp-96633-probe.py'],
  cert090: Object.freeze({
    twoA: 0.9, a: 0.45, eps: 20, worstAt: 0.273,
    reportedWorstFm: 20.00000001587965, independentF: 20.000000, delta: 0.0,
    sigma2AtWorst: -0.569153, globalScanMinF: 20.000000, globalScanMinAt: 1.700,
    cellsFleq0: 0, cellsBelowThreshold: 0, scanNodes: 1201, positivityConfirmed: true,
  }),
  cert096: Object.freeze({
    twoA: 0.96, a: 0.48, eps: 8, worstAt: 11.095,
    reportedWorstFm: 7.39398412783612, independentFSingleAbscissa: 14.2975,
    sigma2AtWorst: 6218.4578, trigAtWorst: -6204.1602,
    mixedAbscissaReproduction: 'sigma2(11.095) + nu(11.095 + 0.0005) = 7.3940',
    globalScanMinF: 8.001030, globalScanMinAt: 0.0,
    cellsFleq0: 0, cellsBelowThreshold: 0, scanNodes: 1201, positivityConfirmed: true,
  }),
  subGap: 'IMP96633_WORSTFM_DIAGNOSTIC -- verify4 worstFm mixes sigma_2(m) with nu(fine point); report min sigma_2(tf)+nu(tf) at a single abscissa instead. Cosmetic; positivity conclusion unchanged.',
  interval: false,
  qed: false,
});
export default KREIN_WORST_POINT_CROSSCHECK;
