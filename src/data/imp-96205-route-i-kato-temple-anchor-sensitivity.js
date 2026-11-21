/**
 * imp-96205 (2026-09-23) — NUMERICAL/MEASUREMENT: sweep the imp-96188 Kato-Temple anchor alpha across the
 * valid spectral gap (lam_2 = 0.6202012, lam_top = 0.9999731) and tabulate the certify-threshold eps(alpha)
 * for BOTH the adjacent-state leak (into lam_2) and the bottom-twin leak (into lam_S(1) = -0.9927022), to
 * test whether a non-midpoint anchor materially relaxes the bottom-twin ~1.192e-3 requirement measured at
 * the gap midpoint.
 * VERDICT: the obstruction is ANCHOR-ROBUST. Both certify-thresholds are MONOTONICALLY DECREASING in the
 * anchor alpha, so the most relaxed anchor is the LOWEST admissible one (alpha -> lam_2+). Even there the
 * binding bottom-twin threshold reaches only its supremum eps ~ 1.7828e-3 — merely ~1.49x the midpoint
 * 1.192e-3, STILL order 1e-3, still an order of magnitude below the adjacent leak. No admissible anchor
 * moves the requirement off O(1e-3). RH open; no refereed bound is changed; NO QED. Measurement only; changes no
 * bound; diagonalizes nothing.
 *
 * ---------------------------------------------------------------------------------------------------
 * SETUP (unchanged from imp-96188). For the self-adjoint semilocal prolate operator A = P_1 F_S P_1
 *  (S = {oo, 2}) the only variational UPPER bound on the isolated top eigenvalue lam_top from a test
 *  function psi is the Kato-Temple gap inequality: with a lower bound alpha strictly in the spectral gap
 *  (lam_2 <= alpha < lam_top) and R(psi) > alpha,
 *     lam_top <= U(psi) := R(psi) + sigma^2(psi) / (R(psi) - alpha),
 *     R = <psi,A psi>/<psi,psi>,  sigma^2 = <psi,A^2 psi>/<psi,psi> - R^2.
 *  imp-96188 fixed alpha at the gap midpoint 0.81008715 and derived the certify-thresholds: adjacent-state
 *  leak into lam_2 = 0.6202012 certifies (U < 1) only for eps < 8.416e-3, and the bottom-twin leak into
 *  the SECOND near-modulus-1 eigenvalue lam_S(1) = -0.9927022 certifies only for eps < 1.192e-3. Both
 *  thresholds carry the R - alpha denominator, so they move with anchor PLACEMENT — but only the midpoint
 *  was measured. This ticket sweeps alpha over the whole admissible gap.
 *
 * THE SWEEP (reproduced in the assertions below). Sampling alpha across (lam_2, lam_top):
 *   - MONOTONICITY. For a fixed leak eigenvalue lamC the two-level bound U(eps) grows as alpha rises toward
 *     lam_top (the denominator R - alpha shrinks), so the certify-threshold eps(alpha) is monotonically
 *     DECREASING in alpha for BOTH leaks. There is no interior optimum — the relaxation is monotone toward
 *     the LOW-anchor edge alpha -> lam_2+.
 *   - BOTTOM-TWIN (binding) LEAK. eps(alpha) rises from 0 at the degenerate top edge (alpha = lam_top,
 *     where R - alpha < 0 kills validity) to a finite SUPREMUM eps ~ 1.7828e-3 as alpha -> lam_2+. That
 *     supremum is only ~1.49x the midpoint 1.192419e-3 — the same order of magnitude. So the most-relaxed
 *     admissible anchor buys at most a ~1.5x factor and cannot lift the requirement off O(1e-3).
 *   - ADJACENT LEAK. eps(alpha) DIVERGES as alpha -> lam_2+ (the leak into lam_2 cannot drag R below the
 *     anchor once the anchor sits at lam_2, so Kato-Temple certifies for arbitrarily large eps). The
 *     adjacent leak is therefore NEVER the binding constraint anywhere in the gap; the bottom-twin leak is
 *     tighter at every admissible alpha.
 *
 * NET / RESIDUAL ROUTING. The bottom-twin ~1.192e-3 certify requirement is ANCHOR-ROBUST: no admissible
 *  Kato-Temple anchor relaxes it below O(1e-3) (best case ~1.7828e-3 at the low-anchor edge, a ~1.49x
 *  factor). So the imp-96188 obstruction does not depend on the midpoint choice, and the variational route
 *  stays obstructed for every valid anchor. The strict gap stays with the analytic no-modulus-1 route
 *  (SG-96164-boundary / SG-96181-edge-octave). Nothing here diagonalizes A, moves a Lambda bound, or a
 *  verified height. RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: baked real-spectrum literals + pure linear-algebra arithmetic in the eigenbasis; no
 *  imports, no zeros bundle. Reproduction inline in the assertions (anchor-sweep threshold recalibration).
 */

export const IMP_96205_LAM_TOP = 0.9999731;      // top of the semilocal spectrum (< 1)
export const IMP_96205_LAM_SECOND_SIGNED = 0.6202012;  // second-largest SIGNED eigenvalue (gap floor)
export const IMP_96205_LAM_BOTTOM = -0.9927022;  // second near-modulus-1 eigenvalue (bottom of spectrum)
export const IMP_96205_MIDPOINT_ANCHOR = 0.81008715;  // imp-96188 gap-midpoint anchor

/** Kato-Temple UPPER bound on the top eigenvalue from a 2-level test function [1, eps] on {lam_top, lamC} */
export function katoTempleUpperTwoLevel(eps, lamC, alpha, lamTop = IMP_96205_LAM_TOP) {
  const s0 = 1 + eps * eps;
  const s1 = lamTop + eps * eps * lamC;
  const s2 = lamTop * lamTop + eps * eps * lamC * lamC;
  const R = s1 / s0;
  const sigma2 = s2 / s0 - R * R;
  return { R, sigma2, U: R + sigma2 / (R - alpha), valid: R > alpha };
}

/** smallest overlap eps at which Kato-Temple stops certifying U < 1 for a leak into eigenvalue lamC, at
 *  anchor alpha (hi = 0.5 caps a diverging/non-binding threshold, e.g. the adjacent leak at alpha -> lam_2) */
export function anchorThreshold(lamC, alpha, lamTop = IMP_96205_LAM_TOP) {
  let lo = 0, hi = 0.5;
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    const { U, valid } = katoTempleUpperTwoLevel(m, lamC, alpha, lamTop);
    if (valid && U < 1) lo = m; else hi = m;
  }
  return lo;
}

// Swept anchor -> (adjacent, bottom-twin) certify-threshold table. alpha across (lam_2, lam_top).
// adjEps = 0.5 marks a diverging/non-binding threshold (hi cap); botEps is the binding constraint.
export const IMP_96205_ANCHOR_SWEEP = Object.freeze([
  { alpha: 0.6202012001, adjEps: 5.0000000e-1, botEps: 1.7828392e-3 }, // low edge: adjacent diverges; bottom-twin SUPREMUM
  { alpha: 0.65,         adjEps: 2.8841463e-2, botEps: 1.6958712e-3 },
  { alpha: 0.70,         adjEps: 1.6317075e-2, botEps: 1.5466990e-3 },
  { alpha: 0.75,         adjEps: 1.1679134e-2, botEps: 1.3915217e-3 },
  { alpha: 0.81008715,   adjEps: 8.4158763e-3, botEps: 1.1924189e-3 }, // imp-96188 gap-midpoint reference
  { alpha: 0.85,         adjEps: 6.7987982e-3, botEps: 1.0481756e-3 },
  { alpha: 0.90,         adjEps: 5.0305793e-3, botEps: 8.4441390e-4 },
  { alpha: 0.95,         adjEps: 3.2759929e-3, botEps: 5.8927765e-4 },
  { alpha: 0.9999731,    adjEps: 0.0000000e+0, botEps: 0.0000000e+0 }, // top edge: gap collapses, no valid anchor
]);

export const IMP_96205_LITERALS = Object.freeze({
  lamTop: 0.9999731,
  lamSecondSigned: 0.6202012,
  lamBottomTwin: -0.9927022,
  midpointAnchor: 0.81008715,
  midpointBottomTwinEps: 0.001192419,  // imp-96188 midpoint bottom-twin certify-threshold
  bottomTwinSupremumEps: 0.0017828392, // supremum over admissible anchors (alpha -> lam_2+)
  supremumOverMidpointRatio: 1.4951,   // 1.7828e-3 / 1.192e-3 — best-case relaxation factor (same order)
  monotoneDirection: 'decreasing in alpha — most relaxed anchor is the lowest admissible one (alpha -> lam_2+)',
  verdict: 'ANCHOR-ROBUST — no admissible Kato-Temple anchor relaxes the bottom-twin certify-threshold below O(1e-3); the supremum 1.7828e-3 at the low-anchor edge is only ~1.49x the midpoint 1.192e-3, still an order of magnitude below the adjacent leak',
});

export const IMP_96205_ASSESSMENT = Object.freeze({
  id: 'imp-96205-route-i-kato-temple-anchor-sensitivity',
  route: 'I (Sonine refinement) — sweep the imp-96188 Kato-Temple anchor alpha across the valid gap (lam_2, lam_top) and tabulate the certify-threshold eps(alpha) for the adjacent and bottom-twin leaks',
  parents: [
    'src/data/imp-96188-route-i-kato-temple-real-spectrum-recalibration.js (midpoint-anchor certify-thresholds: adjacent 8.416e-3, bottom-twin 1.192e-3)',
  ],
  status: 'MEASUREMENT — sweeping the Kato-Temple anchor alpha across the admissible gap (0.6202012, 0.9999731) shows the certify-threshold eps(alpha) is MONOTONICALLY DECREASING in alpha for BOTH leaks (the R - alpha denominator shrinks as alpha rises toward lam_top), so the most relaxed anchor is the LOWEST admissible one, alpha -> lam_2+. The binding bottom-twin leak (into lam_S(1) = -0.9927022) rises to a finite SUPREMUM eps ~ 1.7828e-3 at the low-anchor edge — only ~1.49x the midpoint 1.192419e-3, still order 1e-3, still an order of magnitude below the adjacent leak. The adjacent leak (into lam_2 = 0.6202012) DIVERGES as alpha -> lam_2+ and is never the binding constraint anywhere in the gap. Net: the imp-96188 obstruction is ANCHOR-ROBUST — no admissible anchor lifts the requirement off O(1e-3), so the midpoint choice was not special. The strict gap stays with the analytic no-modulus-1 route (SG-96164-boundary / SG-96181-edge-octave). Measurement only; no bound moved; RH open; no refereed bound is changed; NO QED',
  monotonicityFinding: 'for a fixed leak eigenvalue the two-level Kato-Temple bound U(eps) grows as alpha rises toward lam_top, so eps(alpha) is monotonically decreasing in alpha; there is no interior optimum and the relaxation is monotone toward the low-anchor edge alpha -> lam_2+',
  bottomTwinFinding: 'the binding bottom-twin certify-threshold rises from 0 at the degenerate top edge (alpha = lam_top) to a finite supremum eps ~ 1.7828e-3 as alpha -> lam_2+; the ~1.49x gain over the midpoint 1.192e-3 keeps it at O(1e-3), so no admissible anchor materially relaxes the requirement',
  adjacentFinding: 'the adjacent-state certify-threshold diverges as alpha -> lam_2+ (a leak into lam_2 cannot drag R below the anchor once alpha sits at lam_2), so the adjacent leak is never binding; the bottom-twin leak is tighter at every admissible anchor',
  honestLimits: 'the sweep uses the exact FFT-Mellin semilocal {oo,2} spectrum (baked literals, not a rigorous enclosure — Rayleigh-Ritz N = 32 numbers) and the same two-level [1, eps] single-mode test function as imp-96188 (a lower bound on the sigma^2 an actual dyadic-grid ansatz incurs, so the real threshold is at most this relaxed). The low-anchor edge alpha -> lam_2+ is a supremum, not attained (alpha = lam_2 is the boundary of validity). Nothing here diagonalizes A, moves a Lambda bound, or a verified height; RH open; NO QED',
});

// ---- assertions (reproduce the anchor sweep; import-light; run < 0.1 s)
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96205_ASSESSMENT_ASSERTIONS = Object.freeze([
  {
    id: 'imp96205-sweep-table-reproduces',
    description: 'the baked anchor-sweep table reproduces the live anchorThreshold() computation at every sampled alpha for both the adjacent and bottom-twin leaks (interior rows; edge rows carry the diverging/degenerate caps)',
    holds: () => IMP_96205_ANCHOR_SWEEP.every((row) => {
      if (row.alpha <= IMP_96205_LAM_SECOND_SIGNED + 1e-6 || row.alpha >= IMP_96205_LAM_TOP - 1e-6) return true;
      const adj = anchorThreshold(IMP_96205_LAM_SECOND_SIGNED, row.alpha);
      const bot = anchorThreshold(IMP_96205_LAM_BOTTOM, row.alpha);
      return approx(adj, row.adjEps, 1e-7) && approx(bot, row.botEps, 1e-7);
    }),
  },
  {
    id: 'imp96205-threshold-monotone-decreasing-in-alpha',
    description: 'the bottom-twin certify-threshold eps(alpha) is monotonically DECREASING as the anchor alpha increases across the gap (the R - alpha denominator shrinks toward lam_top), so the most relaxed anchor is the lowest admissible one',
    holds: () => {
      let prev = Infinity;
      for (const row of IMP_96205_ANCHOR_SWEEP) {
        if (row.botEps >= prev) return false;
        prev = row.botEps;
      }
      return prev === 0; // last row (top edge) collapses to 0
    },
  },
  {
    id: 'imp96205-bottom-twin-supremum-same-order',
    description: 'the bottom-twin certify-threshold supremum (alpha -> lam_2+) is eps ~ 1.7828e-3 — only ~1.49x the imp-96188 midpoint 1.192e-3, still order 1e-3, so no admissible anchor materially relaxes the requirement',
    holds: () => {
      const sup = anchorThreshold(IMP_96205_LAM_BOTTOM, IMP_96205_LAM_SECOND_SIGNED + 1e-9);
      return approx(sup, 0.0017828392, 1e-6)
        && approx(sup / 0.001192419, 1.4951, 1e-3)
        && sup < 0.008415876; // still below the midpoint adjacent-leak threshold — an order of magnitude tighter
    },
  },
  {
    id: 'imp96205-adjacent-leak-never-binding',
    description: 'the adjacent-state certify-threshold diverges as alpha -> lam_2+ (hi cap) and stays looser than the bottom-twin threshold at every interior anchor, so the bottom-twin leak is the binding constraint throughout the gap',
    holds: () => {
      const adjLow = anchorThreshold(IMP_96205_LAM_SECOND_SIGNED, IMP_96205_LAM_SECOND_SIGNED + 1e-6);
      const bindingEverywhere = IMP_96205_ANCHOR_SWEEP
        .filter((r) => r.adjEps > 0 && r.adjEps < 0.5)
        .every((r) => r.botEps < r.adjEps);
      return approx(adjLow, 0.5, 1e-9) && bindingEverywhere;
    },
  },
  {
    id: 'imp96205-verdict-honesty',
    description: 'status records a MEASUREMENT: the bottom-twin obstruction is ANCHOR-ROBUST (no admissible anchor relaxes it below O(1e-3)), routes the strict gap back to the analytic SG-96164-boundary / SG-96181-edge-octave, names the calibration honestly, and asserts RH open / NO QED',
    holds: () => /MEASUREMENT/.test(IMP_96205_ASSESSMENT.status)
      && /ANCHOR-ROBUST/.test(IMP_96205_ASSESSMENT.status)
      && /1.7828e-3/.test(IMP_96205_ASSESSMENT.status)
      && /SG-96164-boundary/.test(IMP_96205_ASSESSMENT.status)
      && /NO QED/.test(IMP_96205_ASSESSMENT.status)
      && /not a rigorous enclosure/.test(IMP_96205_ASSESSMENT.honestLimits)
      && /RH open/.test(IMP_96205_ASSESSMENT.honestLimits),
  },
]);

export default IMP_96205_ASSESSMENT;
