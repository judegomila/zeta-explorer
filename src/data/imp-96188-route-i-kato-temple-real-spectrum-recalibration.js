/**
 * imp-96188 (2026-09-23) — NUMERICAL/MEASUREMENT: recalibrate the imp-96169 Kato-Temple certify-threshold
 * from the STYLIZED 5-level toy gap (0.35, 0.2, 0.12, 0.05) to the ACTUAL measured semilocal {oo,2} prolate
 * spectrum (FFT-Mellin, port module rh-route-i-sonine-excess-semilocal-port-2026-09-23.js line 221), to test
 * whether the ~1.17e-2 eigenvector-capture requirement is a toy-model artifact.
 * VERDICT: NOT an artifact — the real spectrum makes the requirement STRICTER, not looser. RH open;
 * no refereed bound is changed; NO QED. Measurement only; changes no bound; diagonalizes nothing.
 *
 * ---------------------------------------------------------------------------------------------------
 * SETUP (unchanged from imp-96169). For the self-adjoint semilocal prolate operator A = P_1 F_S P_1
 *  (S = {oo, 2}) the only variational UPPER bound on the isolated top eigenvalue lam_top from a test
 *  function psi is the Kato-Temple gap inequality: with a lower bound alpha strictly in the spectral gap
 *  (lam_2 <= alpha < lam_top = R(psi)-boundary) and R(psi) > alpha,
 *     lam_top <= U(psi) := R(psi) + sigma^2(psi) / (R(psi) - alpha),
 *     R = <psi,A psi>/<psi,psi>,  sigma^2 = <psi,A^2 psi>/<psi,psi> - R^2.
 *  imp-96169 measured on a STYLIZED model (eigs 0.9999731, 0.35, 0.2, 0.12, 0.05; anchor alpha = 0.5) that
 *  U < 1 only for a second-state overlap eps below ~1.17e-2. The open question this ticket settles:
 *  is that ~1% capture requirement an artifact of the invented gap, or does it survive on the real spectrum?
 *
 * THE REAL SEMILOCAL {oo,2} SPECTRUM (baked from the FFT-Mellin port, no dyadic truncation). Ordered by
 *  value the top of the spectrum is lam_top = 0.9999731 and the SECOND-LARGEST (signed) eigenvalue is
 *  lam_2 = 0.6202012, so the true top gap is lam_top - lam_2 = 0.379772 — SMALLER than the stylized
 *  0.9999731 - 0.35 = 0.649973. A valid Kato-Temple anchor must therefore sit in (0.6202012, 0.9999731);
 *  we take the gap midpoint alpha = 0.81008715. The decisive structural feature ABSENT from the toy model:
 *  the real spectrum has a SECOND near-modulus-1 eigenvalue lam_S(1) = -0.9927022 sitting at the BOTTOM of
 *  the spectrum (the toy's smallest was 0.05). Both twin near-modulus-1 states matter for sigma^2.
 *
 * RECALIBRATED THRESHOLDS (reproduced in the assertions below).
 *   - ADJACENT-STATE LEAK (overlap eps into the second-largest state lam_2 = 0.6202012): certify-threshold
 *     eps ~ 8.416e-3 — about 28% TIGHTER than the toy 1.174e-2, because the real top gap (0.3798) is
 *     smaller than the invented one (0.6500). Same order of magnitude: ~1% capture still required.
 *   - BOTTOM-STATE LEAK (overlap eps into the SECOND near-modulus-1 state lam_S(1) = -0.9927022, absent
 *     from the toy): certify-threshold eps ~ 1.192e-3 — an ORDER OF MAGNITUDE tighter. Leaking into the
 *     bottom twin both inflates sigma^2 (about 9.4x per unit overlap^2 vs the toy's 0.35 state, since the
 *     residual distance |lam_S(1) - lam_top| ~ 1.9927 is ~5.3x the toy's ~0.65) AND drags R down toward
 *     the anchor, shrinking R - alpha; both effects push U up. Kato-Temple even stops being VALID once the
 *     overlap reaches eps ~ 0.3245 (there R falls to alpha), long before the toy would have failed.
 *
 * NET / RESIDUAL ROUTING. The ~1.17e-2 capture requirement is NOT a toy-model artifact: on the real
 *  semilocal {oo,2} spectrum the Kato-Temple certificate is HARDER to reach (adjacent 8.4e-3; the
 *  physically-relevant bottom-twin leak 1.2e-3), because the true spectrum carries a SECOND near-modulus-1
 *  eigenvalue that any imperfect capture of the fractal Zygmund top eigenfunction can leak into. So the
 *  variational route stays obstructed — more firmly than imp-96169's toy indicated — and the strict gap
 *  stays with the analytic no-modulus-1 route (SG-96164-boundary / SG-96181-edge-octave). Nothing here
 *  diagonalizes A, moves a Lambda bound, or a verified height. RH open; no refereed bound is changed; NO QED.
 *
 * Import-light: baked real-spectrum literals + pure linear-algebra arithmetic in the eigenbasis; the
 *  only import is the port module SONINE_EXCESS_LITERALS (semilocal.lam) for the imp-96204
 *  cross-validation assertion — that chain is itself import-light (no zeros bundle). Reproduction
 *  inline in the assertions (Kato-Temple threshold recalibration + baked-spectrum transcription check).
 *
 * imp-96204 (2026-09-23) — CROSS-VALIDATION: the baked IMP_96188_REAL_SPECTRUM (24 elements) was
 *  compared element-by-element against the canonical port literals SONINE_EXCESS_LITERALS.semilocal.lam
 *  (rh-route-i-sonine-excess-semilocal-port-2026-09-23.js line 221). Result: IDENTICAL, max element-wise
 *  drift 0, lengths equal (24) — the recalibration inputs (lam_top = 0.9999731, lam_bottom = -0.9927022,
 *  lam_2 = 0.6202012, and the full dyadic tail) were transcribed EXACTLY from the port module. No
 *  transcription drift; changes no bound; RH open; NO QED. (See assertion imp96204-crossval-against-port.)
 */
import { SONINE_EXCESS_LITERALS } from './rh-route-i-sonine-excess-semilocal-port-2026-09-23.js';

// Real measured semilocal {oo,2} prolate spectrum (FFT-Mellin; baked from the port module, line 221).
export const IMP_96188_REAL_SPECTRUM = Object.freeze([
  0.9999731, -0.9927022, 0.6202012, -0.5609467, 0.436057, -0.416793, 0.4125347, -0.3542198,
  0.3469027, 0.3027032, -0.2962492, -0.2526804, 0.250556, 0.2499853, -0.2499786, -0.2485739,
  0.2448905, 0.2142883, -0.2090059, -0.1803552, 0.1781371, 0.1767981, -0.1767971, 0.1767767,
]);

export const IMP_96188_LAM_TOP = 0.9999731;      // top of the semilocal spectrum (< 1)
export const IMP_96188_LAM_SECOND_SIGNED = 0.6202012;  // second-largest SIGNED eigenvalue (sets the top gap)
export const IMP_96188_LAM_BOTTOM = -0.9927022;  // second near-modulus-1 eigenvalue (bottom of spectrum)
export const IMP_96188_ANCHOR = 0.81008715;      // gap midpoint (lam_2, lam_top): valid Kato-Temple anchor

/** Kato-Temple UPPER bound on the top eigenvalue from a 2-level test function [1, eps] on {lam_top, lamC} */
export function katoTempleUpperTwoLevel(eps, lamC, alpha = IMP_96188_ANCHOR, lamTop = IMP_96188_LAM_TOP) {
  const s0 = 1 + eps * eps;
  const s1 = lamTop + eps * eps * lamC;
  const s2 = lamTop * lamTop + eps * eps * lamC * lamC;
  const R = s1 / s0;
  const sigma2 = s2 / s0 - R * R;
  return { R, sigma2, U: R + sigma2 / (R - alpha), valid: R > alpha };
}

/** smallest overlap eps at which Kato-Temple stops certifying U < 1 for a leak into eigenvalue lamC */
export function recalibratedThreshold(lamC, alpha = IMP_96188_ANCHOR, lamTop = IMP_96188_LAM_TOP) {
  let lo = 0, hi = 0.324; // hi below the R = alpha validity boundary of the bottom-state leak
  for (let k = 0; k < 200; k++) {
    const m = (lo + hi) / 2;
    const { U, valid } = katoTempleUpperTwoLevel(m, lamC, alpha, lamTop);
    if (valid && U < 1) lo = m; else hi = m;
  }
  return lo;
}

export const IMP_96188_LITERALS = Object.freeze({
  lamTop: 0.9999731,
  lamSecondSigned: 0.6202012,     // second-largest signed eigenvalue
  lamBottomTwin: -0.9927022,      // second near-modulus-1 eigenvalue (absent from the toy)
  anchor: 0.81008715,             // valid Kato-Temple anchor in (0.6202012, 0.9999731)
  realTopGap: 0.3797719,          // lam_top - lam_2 (< toy gap 0.6499731)
  toyTopGap: 0.6499731,           // stylized 0.9999731 - 0.35
  toyThresholdEps: 0.011744840,   // imp-96169 stylized certify-threshold
  adjacentThresholdEps: 0.008415876,  // real spectrum, leak into lam_2 = 0.6202012 (~28% tighter)
  bottomTwinThresholdEps: 0.001192419, // real spectrum, leak into lam_S(1) = -0.9927022 (~10x tighter)
  ktValidityBoundaryEps: 0.324544,     // bottom-twin leak: R falls to alpha here, Kato-Temple invalid beyond
  sigma2AmplificationBottom: 9.40,     // sigma^2 per unit overlap^2, bottom-twin leak vs toy 0.35 state
  verdict: 'NOT a toy-model artifact — real semilocal {oo,2} spectrum makes the Kato-Temple capture requirement STRICTER (adjacent 8.4e-3, bottom-twin 1.2e-3) because a SECOND near-modulus-1 eigenvalue lam_S(1) = -0.9927022 inflates sigma^2 under imperfect capture of the fractal top eigenfunction',
});

export const IMP_96188_ASSESSMENT = Object.freeze({
  id: 'imp-96188-route-i-kato-temple-real-spectrum-recalibration',
  route: 'I (Sonine refinement) — recalibrate the imp-96169 Kato-Temple certify-threshold from the stylized toy gap to the ACTUAL measured semilocal {oo,2} prolate spectrum',
  parents: [
    'src/data/imp-96169-route-i-rayleigh-variational-topstate-assessment.js (stylized 5-level Kato-Temple threshold eps ~ 1.17e-2)',
    'src/data/rh-route-i-sonine-excess-semilocal-port-2026-09-23.js (the exact FFT-Mellin semilocal {oo,2} prolate spectrum, line 221)',
  ],
  status: 'MEASUREMENT — recalibrating the Kato-Temple certify-threshold U = R + sigma^2/(R - alpha) < 1 from the imp-96169 stylized gap (lam_2 = 0.35, alpha = 0.5, threshold eps ~ 1.174e-2) to the ACTUAL measured semilocal {oo,2} prolate spectrum shows the ~1.17e-2 requirement is NOT a toy artifact. The real top gap lam_top - lam_2 = 0.9999731 - 0.6202012 = 0.379772 is SMALLER than the toy 0.649973, so with a valid anchor alpha = 0.81009 (gap midpoint) a leak into the adjacent second-largest state certifies only for eps < 8.416e-3 (~28% tighter). The decisive real-spectrum feature absent from the toy is a SECOND near-modulus-1 eigenvalue lam_S(1) = -0.9927022 at the bottom: a leak into it inflates sigma^2 ~9.4x per unit overlap^2 and drags R toward alpha, so the certify-threshold collapses to eps < 1.192e-3 (~10x tighter), and Kato-Temple even ceases to be valid past eps ~ 0.3245. Net: the variational route stays obstructed MORE firmly than the toy indicated; the strict gap stays with the analytic no-modulus-1 route (SG-96164-boundary / SG-96181-edge-octave). Measurement only; no bound moved; RH open; no refereed bound is changed; NO QED',
  adjacentFinding: 'leak into the second-largest signed eigenvalue lam_2 = 0.6202012 (the toy analog): real certify-threshold eps ~ 8.416e-3 vs toy 1.174e-2 — ~28% tighter because the true top gap 0.3798 < toy 0.6500, but same order of magnitude, so the ~1% capture requirement survives',
  bottomTwinFinding: 'leak into the SECOND near-modulus-1 eigenvalue lam_S(1) = -0.9927022 (absent from the toy): certify-threshold eps ~ 1.192e-3 — an order of magnitude tighter. The residual distance |lam_S(1) - lam_top| ~ 1.9927 (~5.3x the toy 0.65) inflates sigma^2 ~9.4x per unit overlap^2 AND pulls R toward the anchor, and Kato-Temple loses validity (R < alpha) past eps ~ 0.3245 — so imperfect capture of the fractal Zygmund top eigenfunction that leaks into the bottom twin is punished far harder than the toy suggested',
  honestLimits: 'the recalibration uses the exact FFT-Mellin semilocal {oo,2} spectrum (baked literals, not a rigorous enclosure — Rayleigh-Ritz N = 32 numbers from the port module) and a valid anchor alpha at the true gap midpoint; the two-level [1, eps] test function models imperfect capture of the fractal top eigenfunction (single-mode leak, a lower bound on the sigma^2 an actual dyadic-grid ansatz incurs). The DIRECTION fact (Rayleigh lower-bounds lam_max; upper bound = Kato-Temple needing small sigma^2) is unchanged from imp-96169; this ticket only measures how the THRESHOLD moves under the real gap. Nothing here diagonalizes A, moves a Lambda bound, or a verified height; RH open; NO QED',
});

// ---- assertions (reproduce the recalibrated thresholds; import-light; run < 0.1 s)
const approx = (x, y, tol) => Math.abs(x - y) <= tol;
export const IMP_96188_ASSESSMENT_ASSERTIONS = Object.freeze([
  {
    id: 'imp96188-real-top-gap-smaller-than-toy',
    description: 'the ACTUAL semilocal {oo,2} top gap lam_top - lam_2 = 0.9999731 - 0.6202012 = 0.379772 is SMALLER than the imp-96169 stylized gap 0.9999731 - 0.35 = 0.649973, and the anchor alpha = 0.81009 sits validly in (lam_2, lam_top)',
    holds: () => {
      const gap = IMP_96188_LAM_TOP - IMP_96188_LAM_SECOND_SIGNED;
      return approx(gap, 0.3797719, 1e-6) && gap < 0.6499731
        && IMP_96188_LAM_SECOND_SIGNED < IMP_96188_ANCHOR && IMP_96188_ANCHOR < IMP_96188_LAM_TOP;
    },
  },
  {
    id: 'imp96188-adjacent-threshold-tighter',
    description: 'leak into the adjacent second-largest state lam_2 = 0.6202012 recalibrates the Kato-Temple certify-threshold to eps ~ 8.416e-3 — ~28% TIGHTER than the toy 1.174e-2, so ~1% capture is still required (not a toy artifact)',
    holds: () => {
      const thr = recalibratedThreshold(IMP_96188_LAM_SECOND_SIGNED);
      return approx(thr, 0.008415876, 1e-6) && thr < 0.011744840
        && katoTempleUpperTwoLevel(thr * 0.5, IMP_96188_LAM_SECOND_SIGNED).U < 1
        && katoTempleUpperTwoLevel(thr * 2, IMP_96188_LAM_SECOND_SIGNED).U > 1;
    },
  },
  {
    id: 'imp96188-bottom-twin-threshold-order-tighter',
    description: 'leak into the SECOND near-modulus-1 eigenvalue lam_S(1) = -0.9927022 (absent from the toy) collapses the certify-threshold to eps ~ 1.192e-3 — an order of magnitude tighter than the toy — because sigma^2 is inflated ~9.4x per unit overlap^2 and R is dragged toward the anchor',
    holds: () => {
      const thr = recalibratedThreshold(IMP_96188_LAM_BOTTOM);
      const s2Bottom = katoTempleUpperTwoLevel(0.01, IMP_96188_LAM_BOTTOM).sigma2;
      const s2Toy = (() => { // toy 0.35 leak at eps = 0.01, alpha = 0.5
        const e = 0.01, s0 = 1 + e * e, R = (0.9999731 + e * e * 0.35) / s0;
        return (0.9999731 * 0.9999731 + e * e * 0.35 * 0.35) / s0 - R * R;
      })();
      return approx(thr, 0.001192419, 1e-6) && thr < 0.008415876
        && approx(s2Bottom / s2Toy, 9.40, 0.1);
    },
  },
  {
    id: 'imp96188-katotemple-validity-boundary',
    description: 'the bottom-twin leak also breaks Kato-Temple VALIDITY (R falls to the anchor) at eps ~ 0.3245 — a hard ceiling absent from the toy, where the negative near-modulus-1 eigenvalue drags R below alpha',
    holds: () => {
      const epsB = Math.sqrt((IMP_96188_ANCHOR - IMP_96188_LAM_TOP) / (IMP_96188_LAM_BOTTOM - IMP_96188_ANCHOR));
      return approx(epsB, 0.324544, 1e-5)
        && katoTempleUpperTwoLevel(epsB * 0.99, IMP_96188_LAM_BOTTOM).valid
        && !katoTempleUpperTwoLevel(epsB * 1.01, IMP_96188_LAM_BOTTOM).valid;
    },
  },
  {
    id: 'imp96204-crossval-against-port',
    description: 'imp-96204: the baked IMP_96188_REAL_SPECTRUM matches the canonical port literals SONINE_EXCESS_LITERALS.semilocal.lam (port line 221) element-by-element (max element-wise drift 0, equal length 24), confirming the recalibration inputs (lam_top 0.9999731, lam_bottom -0.9927022, lam_2 0.6202012) were transcribed exactly with no drift',
    holds: () => {
      const port = SONINE_EXCESS_LITERALS.semilocal.lam;
      if (!Array.isArray(port) || port.length !== IMP_96188_REAL_SPECTRUM.length) return false;
      const drift = IMP_96188_REAL_SPECTRUM.reduce((m, x, i) => Math.max(m, Math.abs(x - port[i])), 0);
      return drift === 0
        && port[0] === IMP_96188_LAM_TOP && port[1] === IMP_96188_LAM_BOTTOM
        && port[2] === IMP_96188_LAM_SECOND_SIGNED;
    },
  },
  {
    id: 'imp96188-verdict-honesty',
    description: 'status records a MEASUREMENT: the ~1.17e-2 capture requirement is NOT a toy-model artifact (real spectrum is stricter: adjacent 8.4e-3, bottom-twin 1.2e-3), routes the strict gap back to the analytic SG-96164-boundary / SG-96181-edge-octave, names the calibration honestly, and asserts RH open / NO QED',
    holds: () => /MEASUREMENT/.test(IMP_96188_ASSESSMENT.status)
      && /NOT a toy artifact/.test(IMP_96188_ASSESSMENT.status)
      && /-0.9927022/.test(IMP_96188_ASSESSMENT.status)
      && /SG-96164-boundary/.test(IMP_96188_ASSESSMENT.status)
      && /NO QED/.test(IMP_96188_ASSESSMENT.status)
      && /not a rigorous enclosure/.test(IMP_96188_ASSESSMENT.honestLimits)
      && /RH open/.test(IMP_96188_ASSESSMENT.honestLimits),
  },
]);

export default IMP_96188_ASSESSMENT;
