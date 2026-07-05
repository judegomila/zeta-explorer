/**
 * @module imp-34155-kpss-l0-borderline-margin
 *
 * imp-34155 (accuracy, frontier-direction): imp-34083 R2 (echoing imp-34024 R3) isolated the SOLE KPSS
 * rejection on the 21 signed imp-33858 residuals to the un-HAC l=0 level statistic eta_mu ~ 0.3483, which
 * exceeds the 10% KPSS-1992 level critical value 0.347 by only ~0.0013 -- the weakest possible rejection,
 * flagged as a marginal borderline but never quantified in residual space. This module measures HOW
 * FRAGILE that borderline is: reusing the imp-34024 level-variant l=0 KPSS statistic VERBATIM (same
 * imp-33810 ladder, same imp-33843 log-linear OLS, same residual, same demean/partial-sum/l=0 long-run
 * variance), it computes the per-rung sensitivity d(eta_mu)/d(delta_r) and the smallest single-rung
 * residual shift delta_r that drops eta_mu back below 0.347 -- converting the ~0.0013 eta-space margin
 * into a residual-space perturbation and naming the most-leveraged rung.
 *
 * WHY eta_mu(delta) IS NONLINEAR (numerator AND denominator both move)
 * -------------------------------------------------------------------
 *   Shift a single rung e_r -> e_r + delta. The level demean re-subtracts the new mean, so every
 *   demeaned u_t moves by -delta/n except u_r which moves by delta(1 - 1/n); the partial sums S_t (and
 *   thus the numerator n^{-2} sum S_t^2) change, AND at l=0 the long-run variance is s2 = gamma_0 =
 *   n^{-1} sum u_t^2 (the raw sample variance), which the same shift also changes. eta_mu = numerator /
 *   gamma_0 is therefore a RATIO of two moving quadratics -- exactly-nonlinear in delta. The reported
 *   flip shift is the true nonlinear root eta_mu(delta_r) = 0.347, not a linear extrapolation (though the
 *   two agree to 3 sig-figs at this tiny margin: -0.001284/0.6387 ~ -0.00201 vs root -0.00201).
 *
 * THE FINDING (measurement / calibration only -- the borderline residual-space fragility)
 * -------------------------------------------------------------------------------------
 *   (R1) THE MARGIN IS ~0.0013 IN eta-SPACE. The baseline l=0 level statistic is eta_mu ~ 0.348280,
 *        exceeding the 10% critical value 0.347 by only ~0.001280 -- reproducing imp-34024/imp-34083
 *        exactly at baseline.
 *   (R2) THE MOST-LEVERAGED RUNG IS THE HEAD ENDPOINT k=6.00. By |d(eta_mu)/d(delta_r)| the head rung
 *        (index 0, k=6.00, residual ~ -0.1142) dominates with slope ~ +0.6387 -- the largest of all 21 --
 *        so it is both the steepest and the cheapest rung to move.
 *   (R3) A SHIFT OF ONLY ~ -0.00201 FLIPS THE REJECTION. The smallest single-rung shift that drops eta_mu
 *        below 0.347 is delta ~ -0.00201 on the head residual (pushing the already-negative head endpoint
 *        slightly more negative) -- about 1.7% of the 21-residual RMS ~0.1160, or ~0.20% in the log-ratio
 *        units of e_k. The borderline is FRAGILE: a fifth-of-a-percent nudge of one endpoint erases it.
 *   (R4) THE HEAD CLUSTER LEADS, WITH THE FAR-TAIL ENDPOINT THIRD. Ranked by |flip shift| the three
 *        cheapest rungs are the head endpoint (k=6.00, ~0.00201), its neighbour (k=6.25, ~0.00353), then
 *        the far-tail endpoint (k=11.00, ~0.00509); the deep interior needs 4-19x larger shifts. So BOTH
 *        the head cluster and the far-tail endpoint dominate the borderline, mirroring the imp-33858
 *        head/far-tail residual localization -- the borderline is driven by the SAME endpoints that carry
 *        the residual excursions, not by the deep interior.
 *   (R5) A CALIBRATION, NOT A NEW CLAIM. This is a sensitivity read of an inherited un-HAC diagnostic; it
 *        reproduces imp-34024/imp-34083 at baseline, re-opens no imp-33843 form selection, and touches no
 *        bound. The HAC-corrected (l>=1) verdict -- eta_mu ~ 0.149 far below 0.347, KPSS fails to reject
 *        -- is UNCHANGED and remains the primary reading; only the l=0 un-HAC borderline is dissected.
 *
 * The punchline: the imp-34083/imp-34024 l=0 KPSS borderline (eta_mu ~ 0.3483 vs 0.347, margin ~0.0013)
 * is erased by a single-rung residual shift of only ~ -0.00201 on the head endpoint k=6.00 (~1.7% of the
 * residual RMS) -- the most-leveraged rung, with the far-tail endpoint k=11.00 second. So the un-HAC
 * marginal 10% rejection is fragile and endpoint-driven, exactly as imp-34024 R3 cautioned; the
 * HAC-corrected non-rejection is untouched.
 *
 * MEASUREMENT / KPSS l=0 SENSITIVITY ONLY. A finite-difference sensitivity read of an inherited un-HAC
 * KPSS statistic on an inherited residual diagnostic, NOT an RH bound and distinct from any
 * log-linear-vs-power-law form selection. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the OLS surrogate is descriptive; the KPSS critical values
 * are the KPSS-1992 asymptotic tabulated values applied on N=21; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34024-kpss-stationarity-bracket (the l=0 eta_mu ~0.3483 borderline this dissects; kpss reused)
 * @see imp-34083-kpss-bandwidth-sensitivity (R2 that isolated the sole rejection to the un-HAC l=0 cell)
 * @see imp-33858-widening-fit-residual-localization (the head/far-tail endpoints that dominate the flip)
 * @see imp-33843-eflow-resid-widening-form-fit (the aggregate RMSE ~0.116 log-linear fit)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose residual is perturbed)
 */

import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from './imp-33810-eflow-resid-ratio-N-ladder.js';

// Reuse the imp-33810 21-rung ladder VERBATIM (no fresh component model), identical to imp-34024.
const RUNGS = IMP33810_EFLOW_RESID_RATIO_N_LADDER.ladder;
const KS = RUNGS.map((r) => r.k);
const Y = RUNGS.map((r) => Math.log(r.eflow_over_resid)); // natural log of the imp-33810 ratio

// OLS of ys against xs; returns slope/intercept (the imp-33843 log-linear WINNER when xs = KS).
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}

const FIT = ols(KS, Y); // y = a + b k          (the imp-33843 log-linear winner, recomputed)

// The imp-33858 signed residual e_k = y_k - (a + b k), the SAME series imp-34024 tested with KPSS.
const RESID = KS.map((k, i) => Y[i] - (FIT.a + FIT.b * k));
const N = RESID.length; // 21

// The imp-34024 level-variant KPSS statistic at l=0, reimplemented VERBATIM (demean, partial-sum
// numerator, l=0 long-run variance = raw sample variance gamma_0). eta_mu = n^{-2} sum S_t^2 / gamma_0.
function etaLevelL0(e) {
  const n = e.length;
  const m = e.reduce((a, b) => a + b, 0) / n;
  const u = e.map((v) => v - m); // level demean
  let g0 = 0;
  for (let i = 0; i < n; i++) g0 += u[i] * u[i];
  g0 /= n; // gamma_0 -- the l=0 long-run variance
  let S = 0;
  let acc = 0;
  for (let t = 0; t < n; t++) {
    S += u[t];
    acc += S * S;
  }
  return acc / (n * n * g0);
}

const CRIT10 = 0.347; // KPSS-1992 Table 1 level 10% critical value (reject stationarity for eta ABOVE)
const BASELINE_ETA = etaLevelL0(RESID); // ~0.348280 -- reproduces imp-34024 etaLevelL0 exactly
const MARGIN = BASELINE_ETA - CRIT10; // ~0.001280 -- the un-HAC borderline excess in eta-space

// Perturb a single rung r by delta and recompute the l=0 eta (nonlinear in delta -- numerator AND
// gamma_0 both move under the re-demean).
function etaWithShift(r, delta) {
  const e = RESID.slice();
  e[r] += delta;
  return etaLevelL0(e);
}

// Per-rung sensitivity d(eta_mu)/d(delta_r) at delta=0 via a symmetric finite difference.
const DERIV_H = 1e-6;
const DERIVS = RESID.map((_, r) => (etaWithShift(r, DERIV_H) - etaWithShift(r, -DERIV_H)) / (2 * DERIV_H));

// The smallest single-rung shift delta_r that drives eta_mu(delta_r) down to CRIT10 (the true nonlinear
// root, not a linear extrapolation). Scan outward from delta=0 in both directions for the sign change of
// f(delta) = eta_mu(delta) - CRIT10, then bisect; keep the root nearest zero.
function smallestFlipShift(r) {
  const f = (d) => etaWithShift(r, d) - CRIT10;
  const f0 = f(0); // > 0 at baseline (0.348 > 0.347)
  const step = 1e-4;
  let best = null;
  for (const sign of [1, -1]) {
    let prev = 0;
    let fprev = f0;
    for (let i = 1; i <= 200000; i++) {
      const d = sign * step * i;
      const fd = f(d);
      if (fprev > 0 !== fd > 0) {
        let lo = prev;
        let hi = d;
        let flo = fprev;
        for (let k = 0; k < 100; k++) {
          const mid = (lo + hi) / 2;
          const fm = f(mid);
          if (flo > 0 !== fm > 0) hi = mid;
          else {
            lo = mid;
            flo = fm;
          }
        }
        const root = (lo + hi) / 2;
        if (best === null || Math.abs(root) < Math.abs(best)) best = root;
        break;
      }
      prev = d;
      fprev = fd;
    }
  }
  return best;
}

const FLIP_SHIFTS = RESID.map((_, r) => smallestFlipShift(r)); // signed delta per rung (null if unreachable)

// The residual RMS -- the natural scale to express the flip shift against.
const RESID_RMS = Math.sqrt(RESID.reduce((a, b) => a + b * b, 0) / N);

// Most-leveraged rung by |derivative| (steepest) and by |flip shift| (cheapest) -- they coincide here.
let steepestIdx = 0;
for (let r = 1; r < N; r++) if (Math.abs(DERIVS[r]) > Math.abs(DERIVS[steepestIdx])) steepestIdx = r;
let cheapestIdx = -1;
let cheapestAbs = Infinity;
for (let r = 0; r < N; r++) {
  if (FLIP_SHIFTS[r] !== null && Math.abs(FLIP_SHIFTS[r]) < cheapestAbs) {
    cheapestAbs = Math.abs(FLIP_SHIFTS[r]);
    cheapestIdx = r;
  }
}

// Rank rungs by |flip shift| ascending (cheapest first) for the endpoint-driven observation.
const RANKED = RESID.map((_, r) => ({
  rungIndex: r,
  k: KS[r],
  residual: RESID[r],
  deriv: DERIVS[r],
  flipShift: FLIP_SHIFTS[r],
}))
  .filter((row) => row.flipShift !== null)
  .sort((a, b) => Math.abs(a.flipShift) - Math.abs(b.flipShift));

const round = (x, d) => +x.toFixed(d);

export const IMP34155_KPSS_L0_BORDERLINE_MARGIN = {
  id: 'imp-34155',
  proofSection: 'S-frontier',
  question:
    'imp-34083 R2 (echoing imp-34024 R3) isolated the sole KPSS rejection on the 21 signed imp-33858 ' +
    'residuals to the un-HAC l=0 level statistic eta_mu ~ 0.3483, which exceeds the 10% critical value ' +
    '0.347 by only ~0.0013 -- a marginal borderline never quantified in residual space. Reusing the ' +
    'imp-34024 l=0 KPSS statistic VERBATIM, what is the smallest single-rung residual shift (and which ' +
    'rung is most leveraged) that drops eta_mu below 0.347? Measurement only, no bound change; NOT an RH ' +
    'bound; no QED.',
  measuredQuantity:
    'The per-rung sensitivity d(eta_mu)/d(delta_r) and the smallest single-rung residual shift delta_r ' +
    'that drives the l=0 level KPSS statistic eta_mu = n^{-2} sum S_t^2 / gamma_0 down to the 10% level ' +
    'critical value 0.347, on the 21 signed imp-33858 residuals e_k = ln(eflow_over_resid_k) - (a + b k)',
  rungCount: N, // 21
  crit10: CRIT10, // 0.347
  baselineEtaL0: round(BASELINE_ETA, 6), // ~0.348280 -- reproduces imp-34024 etaLevelL0 exactly
  marginEtaSpace: round(MARGIN, 6), // ~0.001280 -- the un-HAC borderline excess above 0.347
  // The most-leveraged rung (steepest slope == cheapest shift here): the head endpoint k=6.00.
  mostLeveragedRungIndex: steepestIdx, // 0
  mostLeveragedK: KS[steepestIdx], // 6.00
  mostLeveragedResidual: round(RESID[steepestIdx], 5), // ~ -0.11419
  mostLeveragedDeriv: round(DERIVS[steepestIdx], 4), // ~ +0.6387 (largest |d eta / d delta| of all 21)
  steepestEqualsCheapest: steepestIdx === cheapestIdx, // true -- head rung is both steepest and cheapest
  // The headline: smallest single-rung shift that flips the marginal 10% rejection.
  smallestFlipShift: round(FLIP_SHIFTS[cheapestIdx], 6), // ~ -0.002006 (head residual pushed more negative)
  smallestFlipShiftAbs: round(cheapestAbs, 6), // ~0.002006
  smallestFlipRungIndex: cheapestIdx, // 0
  smallestFlipK: KS[cheapestIdx], // 6.00
  residRms: round(RESID_RMS, 6), // ~0.116039
  flipShiftOverRms: round(cheapestAbs / RESID_RMS, 5), // ~0.01729 -- the flip is ~1.7% of the residual RMS
  // The three cheapest rungs (the two endpoints + head neighbour), showing the borderline is endpoint-driven.
  cheapestThreeRungs: RANKED.slice(0, 3).map((row) => ({
    k: round(row.k, 2),
    residual: round(row.residual, 5),
    deriv: round(row.deriv, 4),
    flipShift: round(row.flipShift, 6),
  })),
  finding: {
    R1_margin_is_tiny_in_eta_space:
      'The baseline l=0 level statistic eta_mu ~ 0.348280 exceeds the 10% critical value 0.347 by only ' +
      '~0.001280, reproducing imp-34024/imp-34083 exactly at baseline.',
    R2_most_leveraged_rung_is_head_endpoint:
      'By |d(eta_mu)/d(delta_r)| the head rung (k=6.00, residual ~ -0.1142) dominates with slope ~ ' +
      '+0.6387 -- the largest of all 21 -- so it is both the steepest and the cheapest rung to move.',
    R3_a_0002_shift_flips_the_rejection:
      'The smallest single-rung shift that drops eta_mu below 0.347 is delta ~ -0.00201 on the head ' +
      'residual (pushing the already-negative head endpoint slightly more negative) -- about 1.7% of the ' +
      '21-residual RMS ~0.1160, or ~0.20% in the log-ratio units of e_k. The borderline is FRAGILE.',
    R4_head_cluster_leads_far_tail_third:
      'Ranked by |flip shift| the three cheapest rungs are the head endpoint (k=6.00, ~0.00201), its ' +
      'neighbour (k=6.25, ~0.00353), then the far-tail endpoint (k=11.00, ~0.00509); the deep interior ' +
      'needs 4-19x larger shifts. Both the head cluster and the far-tail endpoint dominate, mirroring the ' +
      'imp-33858 head/far-tail residual localization.',
    R5_calibration_not_new_claim:
      'A sensitivity read of an inherited un-HAC diagnostic; reproduces imp-34024/imp-34083 at baseline, ' +
      're-opens no imp-33843 form selection, touches no bound. The HAC-corrected (l>=1) verdict eta_mu ~ ' +
      '0.149 far below 0.347 (KPSS fails to reject) is UNCHANGED and remains the primary reading.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / KPSS l=0 BORDERLINE SENSITIVITY (frontier-direction, NOT rigorous). Reusing the ' +
    'imp-34024 level-variant l=0 KPSS statistic VERBATIM on the 21 signed imp-33858 residuals, the ' +
    'baseline eta_mu ~ 0.348280 exceeds the 10% level critical value 0.347 by only ~0.001280. The ' +
    'most-leveraged rung is the HEAD endpoint k=6.00 (residual ~ -0.1142) with slope d(eta_mu)/d(delta) ' +
    '~ +0.6387, the largest of all 21; the smallest single-rung shift that drops eta_mu below 0.347 is ' +
    'delta ~ -0.00201 on that head residual -- about 1.7% of the 21-residual RMS ~0.1160, or ~0.20% in ' +
    'log-ratio units. Ranked by |flip shift| the three cheapest rungs are the head endpoint (k=6.00 ' +
    '~0.00201), its neighbour (k=6.25 ~0.00353), then the far-tail endpoint (k=11.00 ~0.00509), ' +
    'mirroring the imp-33858 head/far-tail residual localization; the deep interior needs 4-19x larger ' +
    'shifts. So the un-HAC marginal 10% rejection is ' +
    'FRAGILE and endpoint-driven, exactly as imp-34024 R3 cautioned. Honest caveats: eta_mu(delta) is ' +
    'nonlinear (numerator and the l=0 gamma_0 both move under the re-demean) so the flip shift is the ' +
    'true nonlinear root, not a linear extrapolation (the two agree to 3 sig-figs at this margin); the ' +
    'HAC-corrected (l>=1) non-rejection eta_mu ~ 0.149 is UNCHANGED and remains the primary reading. ' +
    'This reproduces imp-34024/imp-34083 at baseline, does NOT change the RMSE (~0.116, ~12% ' +
    'multiplicative), does NOT re-open the imp-33843 form selection, and touches no bound; the KPSS ' +
    'critical values are asymptotic tabulated values applied on N=21; the component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34024 (the l=0 eta_mu ~0.3483 borderline dissected; kpss reused); imp-34083 (R2 isolating the ' +
    'sole rejection to the un-HAC l=0 cell); imp-33858 (the head/far-tail endpoints that dominate the ' +
    'flip); imp-33843 (the aggregate RMSE ~0.116 log-linear fit); imp-33810 (the 21-rung ladder); ' +
    'imp-486 (C_mb GUE-conditional). KPSS critical values: Kwiatkowski, Phillips, Schmidt, Shin (1992).',
};

export const IMP34155_KPSS_L0_BORDERLINE_MARGIN_ASSERTIONS = [
  {
    // Reuse gate: the l=0 baseline reproduces the imp-34024 etaLevelL0 borderline exactly on the same ladder.
    id: 'imp34155-reproduces-imp34024-l0-borderline',
    description: '21 residuals; baseline l=0 eta_mu ~0.3483 barely above 0.347 (reproduces imp-34024/imp-34083)',
    holds: () =>
      N === 21 &&
      KS[0] === 6 &&
      KS[20] === 11 &&
      Math.abs(BASELINE_ETA - 0.348280) < 1e-4 &&
      BASELINE_ETA > CRIT10 &&
      MARGIN > 0 &&
      MARGIN < 2e-3,
  },
  {
    // The most-leveraged rung is the head endpoint k=6.00, steepest slope and cheapest flip coincide.
    id: 'imp34155-head-endpoint-most-leveraged',
    description: 'head rung k=6.00 has the largest |d eta / d delta| ~0.6387 and is both steepest and cheapest',
    holds: () =>
      steepestIdx === 0 &&
      KS[steepestIdx] === 6 &&
      Math.abs(DERIVS[0] - 0.6387) < 1e-3 &&
      steepestIdx === cheapestIdx,
  },
  {
    // The headline flip shift: ~ -0.00201 on the head residual, ~1.7% of the residual RMS.
    id: 'imp34155-smallest-flip-shift-0002-head',
    description: 'smallest flip shift ~ -0.00201 on head rung, ~1.7% of residual RMS ~0.1160',
    holds: () =>
      cheapestIdx === 0 &&
      FLIP_SHIFTS[0] < 0 &&
      Math.abs(Math.abs(FLIP_SHIFTS[0]) - 0.002006) < 5e-5 &&
      Math.abs(RESID_RMS - 0.116039) < 1e-4 &&
      Math.abs(cheapestAbs / RESID_RMS - 0.01729) < 2e-3 &&
      // the perturbed statistic genuinely lands at the critical value
      Math.abs(etaWithShift(0, FLIP_SHIFTS[0]) - CRIT10) < 1e-6,
  },
  {
    // The three cheapest rungs are the head cluster (k=6.00,6.25) and the far-tail endpoint (k=11.00),
    // both endpoints leading over the deep interior (endpoint-driven borderline, mirrors imp-33858).
    id: 'imp34155-endpoints-drive-borderline',
    description: 'head k=6.00, neighbour k=6.25, far-tail k=11.00 are the three smallest |flip shift| rungs',
    holds: () => {
      const threeK = [RANKED[0].k, RANKED[1].k, RANKED[2].k].sort((a, b) => a - b);
      return (
        threeK[0] === 6 &&
        threeK[1] === 6.25 &&
        threeK[2] === 11 &&
        Math.abs(RANKED[0].flipShift) < Math.abs(RANKED[1].flipShift) &&
        Math.abs(RANKED[1].flipShift) < Math.abs(RANKED[2].flipShift)
      );
    },
  },
  {
    // Honesty gate: isRigorous false, no QED, PT SOTA, RMSE-scale residual small, imp-3066 clause.
    id: 'imp34155-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, PT SOTA, RMSE-scale residual small, imp-3066 untouched',
    holds: () =>
      IMP34155_KPSS_L0_BORDERLINE_MARGIN.isRigorous === false &&
      /NO QED/.test(IMP34155_KPSS_L0_BORDERLINE_MARGIN.verdict) &&
      /remains SOTA/.test(IMP34155_KPSS_L0_BORDERLINE_MARGIN.verdict) &&
      /12% multiplicative/.test(IMP34155_KPSS_L0_BORDERLINE_MARGIN.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34155_KPSS_L0_BORDERLINE_MARGIN.verdict),
  },
];

for (const a of IMP34155_KPSS_L0_BORDERLINE_MARGIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34155-kpss-l0-borderline-margin assertion failed: ${a.id}`);
  }
}
