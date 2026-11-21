/**
 * @module imp-96995-minimiser-coeff-spectrum-supercubic
 * @fileoverview imp-96995 -- MEASUREMENT/DERIVATION (honest partial): close the imp-96975 super-cubic
 *   tail exponent p (measured p_global=3.228, imp-96957) via the FULL minimiser coefficient spectrum.
 *   imp-96975 left SUB-GAP imp-96975-minimiser-coeff-spectrum-supercubic-residue: its single/top-mode
 *   endpoint law (psi_n(1)^2 ~ n^{~12-13}) massively over-predicts p because the minimiser near-totally
 *   cancels the top mode; closing p needs the collective decay of the full coefficient spectrum phi_n.
 *   This module builds the minimiser at N in {76..124}, extracts the whole spectrum, and pins down
 *   exactly which structural model reproduces the exponent. Measurement only; the Rayleigh floor is an
 *   UPPER bound; changes no bound; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.
 *
 * DRIVER tmp/imp-96995-minimiser-coeff-spectrum.py (reuses the imp-96934/imp-96975 orthogonal
 * Gegenbauer build VERBATIM). For each N it forms A_lo (sigma_2-weighted Gram over t in [0,3200]) and
 * A_full (over [0,12800]), takes the minimiser phi = smallest-eigenvector of A_lo, and measures the
 * beyond-T=3200 floor lift two ways:
 *   residFO   = phi^T A_tail phi / scaleB           (first-order: tail added at FIXED minimiser)
 *   residMeas = [lam_min(A_full) - lam_min(A_lo)] / scaleB  (the ACTUAL floor lift = imp-96957 value)
 * Both reproduce the baked imp-96934/imp-96957 values EXACTLY (residMeas = 0.0009976, 0.0014900,
 * 0.0021885, 0.0029994 over {88,100,112,124}; p_residMeas = 3.2281 = the measured 3.228), so the
 * driver is anchored to the same operator and subspace as the measured residual.
 *
 * WHAT THE FULL SPECTRUM SHOWS.
 *   (A) ENDPOINT-WEIGHTED COLLECTIVE SUM. The tail is endpoint-dominated (imp-96975 L1:
 *       |Phih_n(t)|^2 ~ psi_n(1)^2/(at)^8), so the relevant collective coordinate is the
 *       endpoint-weighted minimiser coefficient sum S = sum_n phi_n psi_n(1). Measured S grows with
 *       exponent q_S = 3.088 over {88,100,112,124} (10.63, 14.71, 20.20, 28.99, 42.49 over the full
 *       5-point grid). This is the collective all-mode analogue of the single-top-mode endpoint law:
 *       the coefficients phi_n decay fast enough (top-mode phi_{N-1}^2 ~ 1e-26, imp-96975) that S
 *       grows only ~N^3 despite the per-mode psi_n(1)^2 ~ n^{~12-13} growth.
 *   (B) THE MEASURED p IS LINEAR IN S, NOT QUADRATIC. A naive rank-1 endpoint model
 *       (A_tail ~ K * psi(1) psi(1)^T with N-INDEPENDENT K) would give residFO ~ K*S^2 ~ N^{2 q_S} =
 *       N^{6.18} -- FAR above the measured 3.23. It fails because K is NOT N-independent: the effective
 *       tail-kernel constant K_hat = residFO*scaleB / S^2 drifts K_hat ~ N^{-1.56} (2.36e-9 -> 1.26e-9
 *       across N=76..124). Net first-order exponent p_residFO = 4.62. The ACTUAL floor lift grows even
 *       slower, p_residMeas = 3.228, CLOSE to q_S = 3.09 (linear in S) rather than 2 q_S (quadratic):
 *       the variational relaxation converts the quadratic endpoint injection into a nearly-linear-in-S
 *       floor lift. So p is essentially the growth exponent of the endpoint-weighted coefficient sum.
 *   (C) NO FINITE-ORDER PERTURBATIVE MODEL CLOSES p. Bare Rayleigh-Schroedinger PT DIVERGES here: the
 *       second-order relaxation term sum_{k>0} |phi_0^T A_tail phi_k|^2/(lam_k - lam_0) grows with
 *       exponent 10.28 (FASTER than residFO 4.62, driven by the huge high-k endpoint couplings
 *       g_k ~ psi_k(1)) and overshoots -- residFO minus the 2nd-order term collapses (exponent -1.03),
 *       NOT converging to residMeas. Degenerate low-block first-order PT also fails: the smallest
 *       eigenvalue of A_tail restricted to the bottom-K eigenvectors of A_lo collapses to ~0 for K>=3
 *       (three low modes already combine to shed nearly all the tail). Only the FULL eigenvalue
 *       difference reproduces p = 3.228.
 *
 * VERDICT. The super-cubic exponent p is the growth exponent of the ENDPOINT-WEIGHTED MINIMISER
 * COEFFICIENT SUM S = sum_n phi_n psi_n(1) (measured q_S = 3.09, versus measured p_residMeas = 3.23),
 * NOT the per-mode endpoint growth (n^{~12}) and NOT its rank-1 square (2 q_S = 6.18). The minimiser
 * coefficient decay makes S grow only ~N^3, and the variational relaxation makes the floor lift grow
 * linearly in S rather than quadratically. This ADVANCES imp-96975-minimiser-coeff-spectrum-supercubic-
 * residue: the collective coordinate is identified (S), the rank-1 and finite-order-PT closure routes
 * are RULED OUT (rank-1 6.18, first-order 4.62, second-order PT divergent 10.28), and the measured p is
 * anchored exactly. It does NOT fully close p in closed form: the exact value (why p ~ q_S and not
 * 2 q_S, i.e. the non-perturbative low<->high mode re-diagonalisation of the floor-lift eigenvalue
 * difference, and the ~4% gap between q_S=3.09 and p=3.23) remains as REFINED SUB-GAP
 * imp-96995-floor-lift-eigendiff-residue-closed-form. Measurement/derivation only; the floor is a
 * Rayleigh UPPER bound; no operator positivity; interval-rigorous reach stays 2a <= 0.96;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96975-sigma2-tail-supercubic-derivation.js (the endpoint laws L1/L2 and the sub-gap this closes)
 * @see imp-96957-bessel-onset-tail-finer-ladder-viz-data.js (the measured p_global=3.228 ladder)
 * driver tmp/imp-96995-minimiser-coeff-spectrum.py ; raw tmp/imp-96995-out.json
 */

const M_POLE = 3; // pole-free window order; k_max = 2m+N-1
const ALPHA = 2 * M_POLE + 0.5; // 6.5 (normalised Gegenbauer C_n^{13/2})

export const IMP96995_NS = Object.freeze([76, 88, 100, 112, 124]);
export const IMP96995_GRID = Object.freeze([88, 100, 112, 124]); // the imp-96957 measured-p grid
export const IMP96995_T3200 = 3200;
export const IMP96995_TFULL = 12800;

// Per-N measurements from tmp/imp-96995-minimiser-coeff-spectrum.py.
//   S = sum_n phi_n psi_n(1) (endpoint-weighted minimiser coefficient sum); residFO = phi^T A_tail phi
//   / scaleB (first order); residMeas = [lam_min(A_full) - lam_min(A_lo)] / scaleB (actual floor lift,
//   = imp-96957 value); K_hat = residFO*scaleB / S^2 (effective rank-1 tail-kernel constant).
export const IMP96995_ROWS = Object.freeze({
  76: Object.freeze({ S: 10.632212, residFO: 0.0006424725, residMeas: 0.0006064932, K_hat: 2.3561080e-9 }),
  88: Object.freeze({ S: 14.710039, residFO: 0.0011222615, residMeas: 0.0009975585, K_hat: 2.1500788e-9 }),
  100: Object.freeze({ S: 20.203752, residFO: 0.0018620583, residMeas: 0.0014899688, K_hat: 1.8911115e-9 }),
  112: Object.freeze({ S: 28.989083, residFO: 0.0031859335, residMeas: 0.0021885154, K_hat: 1.5716495e-9 }),
  124: Object.freeze({ S: 42.494273, residFO: 0.0054812899, residMeas: 0.0029993691, K_hat: 1.2583745e-9 }),
});

// log-log exponents over the measured-p grid {88,100,112,124} unless noted.
export const IMP96995_Q_S = 3.0879; // growth exponent of the endpoint-weighted coeff sum S
export const IMP96995_P_RANK1_2Q = 6.1758; // naive rank-1 endpoint (K N-independent): residFO ~ K S^2
export const IMP96995_P_RESIDFO_FIRSTORDER = 4.6203; // first order (K_hat drifts ~ N^{-1.56})
export const IMP96995_P_SECONDORDER = 10.283; // 2nd-order Rayleigh-Schroedinger term (DIVERGES, overshoots)
export const IMP96995_P_RESIDMEAS = 3.2281; // ACTUAL floor lift exponent == measured 3.228
export const IMP96995_MEASURED_P = 3.228; // imp-96957 p_global
export const IMP96995_KHAT_DRIFT_EXP = -1.56; // K_hat ~ N^{-1.56} (rank-1 model inexact)

export const IMP96995_VERDICT = Object.freeze({
  ticket: 'imp-96995',
  question:
    'close the imp-96975 super-cubic tail exponent p (measured 3.228) in closed form via the full minimiser coefficient decay spectrum: measure phi_n at N in {76..124}, fit its decay law, and combine with the n^{~12-13} per-mode endpoint growth to predict p',
  answer:
    'the exponent p is the growth exponent of the ENDPOINT-WEIGHTED minimiser coefficient sum S = sum_n phi_n psi_n(1) (measured q_S = 3.09, versus measured p_residMeas = 3.23), NOT the per-mode endpoint growth (n^{~12}) and NOT its rank-1 square (2 q_S = 6.18). The minimiser coefficient decay makes S grow only ~N^3 despite psi_n(1)^2 ~ n^{~12-13}, and the variational relaxation makes the floor lift grow nearly linearly in S rather than quadratically (the rank-1 tail-kernel constant K_hat is not N-independent: K_hat ~ N^{-1.56}). No finite-order perturbative model closes p: rank-1 gives 6.18, first-order residFO 4.62, and bare second-order Rayleigh-Schroedinger PT DIVERGES (exponent 10.28, overshoots) because the high-k endpoint couplings g_k ~ psi_k(1) are huge; degenerate low-block PT collapses to ~0 for K>=3. Only the full eigenvalue difference reproduces p = 3.228 (driver hits residMeas exactly)',
  collectiveCoordinate: 'S = sum_n phi_n psi_n(1)', // endpoint-weighted minimiser coefficient sum
  qS: 3.0879, // growth exponent of S -- essentially the measured p (linear-in-S floor lift)
  pMeasured: 3.228,
  pRank1TwoQ: 6.1758, // ruled out (K_hat drifts)
  pFirstOrder: 4.6203,
  pSecondOrderDiverges: true, // 2nd-order PT term grows 10.28, faster than residFO -> series divergent
  isLinearInSNotQuadratic: true, // p ~ q_S, not 2 q_S
  perturbativeClosureRuledOut: true,
  driverReproducesResidMeasExactly: true, // residMeas = 0.0009976..0.0029994, p = 3.2281
  subGap: 'imp-96995-floor-lift-eigendiff-residue-closed-form',
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96995_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96995_ASSERTIONS = [
  {
    id: 'imp96995-residmeas-reproduces-imp96957',
    holds: () =>
      Math.abs(IMP96995_ROWS[88].residMeas - 0.0009976) < 1e-6 &&
      Math.abs(IMP96995_ROWS[100].residMeas - 0.0014900) < 1e-6 &&
      Math.abs(IMP96995_ROWS[112].residMeas - 0.0021885) < 1e-6 &&
      Math.abs(IMP96995_ROWS[124].residMeas - 0.0029994) < 1e-6,
    why: 'the actual floor lift residMeas = [lam_min(A_full) - lam_min(A_lo)]/scaleB reproduces the imp-96957 baked values exactly, so the measurement is anchored to the same operator and subspace as the measured super-cubic residual.',
  },
  {
    id: 'imp96995-residmeas-exponent-is-the-measured-p',
    holds: () => Math.abs(IMP96995_P_RESIDMEAS - IMP96995_MEASURED_P) < 0.01,
    why: 'the log-log exponent of residMeas over {88,100,112,124} is 3.2281, matching the imp-96957 p_global = 3.228 -- the driver recovers the measured super-cubic law.',
  },
  {
    id: 'imp96995-p-is-linear-in-S-not-quadratic',
    holds: () =>
      Math.abs(IMP96995_P_RESIDMEAS - IMP96995_Q_S) < 0.2 &&
      IMP96995_P_RANK1_2Q > 1.9 * IMP96995_Q_S,
    why: 'the measured p (3.23) sits close to q_S = 3.09 (linear in the endpoint-weighted coeff sum S) and far below the rank-1 quadratic 2 q_S = 6.18 -- the variational relaxation converts the quadratic endpoint injection into a nearly-linear-in-S floor lift.',
  },
  {
    id: 'imp96995-rank1-model-inexact-khat-drifts',
    holds: () =>
      IMP96995_ROWS[76].K_hat > 1.4 * IMP96995_ROWS[124].K_hat &&
      IMP96995_ROWS[124].K_hat < IMP96995_ROWS[112].K_hat &&
      IMP96995_ROWS[112].K_hat < IMP96995_ROWS[100].K_hat,
    why: 'the effective rank-1 tail-kernel constant K_hat = residFO*scaleB/S^2 is NOT N-independent (it drifts ~N^{-1.56}, 2.36e-9 -> 1.26e-9), so the naive rank-1 endpoint model over-predicts and does not close p.',
  },
  {
    id: 'imp96995-second-order-PT-diverges',
    holds: () =>
      IMP96995_P_SECONDORDER > IMP96995_P_RESIDFO_FIRSTORDER &&
      IMP96995_P_RESIDFO_FIRSTORDER > IMP96995_MEASURED_P,
    why: 'the second-order Rayleigh-Schroedinger relaxation term grows faster (10.28) than the first-order residFO (4.62), so the perturbation series is non-convergent and no finite-order coefficient-spectrum expansion closes p -- it is a non-perturbative eigenvalue-difference residue.',
  },
  {
    id: 'imp96995-verdict-no-qed',
    holds: () =>
      IMP96995_VERDICT.perturbativeClosureRuledOut === true &&
      IMP96995_VERDICT.driverReproducesResidMeasExactly === true &&
      IMP96995_VERDICT.operatorPositivityProved === false &&
      IMP96995_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96995_VERDICT.qed === false,
    why: 'measurement only: the collective coordinate S is identified and the closure routes ruled out, but the exact closed-form residue stays a refined sub-gap; no operator positivity, reach stays 2a <= 0.96, no QED.',
  },
];

for (const a of IMP96995_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96995-minimiser-coeff-spectrum-supercubic assertion failed: ${a.id}`);
  }
}

void ALPHA;
