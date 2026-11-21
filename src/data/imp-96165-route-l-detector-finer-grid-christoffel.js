/**
 * @module imp-96165-route-l-detector-finer-grid-christoffel
 *
 * imp-96165 (numerical): work the imp-96149 sub-gap SG-96149-grid on TWO fronts, measurement only.
 *
 *   (1) PER-DELTA detector exponents. imp-96149 fitted the Route L detector reach with a single
 *       canonical fit (delta = 0.1: N_det = 0.3643 * gamma^1.2717) plus one pooled all-delta fit
 *       (b = 1.2802). Here each delta column of ROUTE_L.detector.rows is fitted separately over the
 *       five detected zero indices (zero 40 is undetected, excluded). The result: the exponent b is
 *       NOT delta-independent -- it drifts MONOTONICALLY from 1.3862 (delta = 0.4) down to 1.2074
 *       (delta = 0.025), a spread of 0.1788, while the prefactor A rises 0.2087 -> 0.5023. This is
 *       exactly the additive "O(log 1/delta)" term in the detector law N_det = N_res(gamma) + O(log 1/delta)
 *       re-expressed as an exponent tilt when a pure power law is forced through it: the pooled fit
 *       (mean b = 1.28025) simply averages the tilt away. So the detector reach is delta-near-independent
 *       only in the pooled sense; the finer grid resolves a clean, systematic delta trend.
 *
 *   (2) CHRISTOFFEL-COUNTING analytic reach form. The named sub-gap asks whether N_res(gamma) equals a
 *       Christoffel function of the measure nu_a. nu_a is the symmetric atomic measure on the unit
 *       circle with atoms at theta_k = pi - 2 atan(gamma_k / a) (a = 20) and weights
 *       w_k = 4a^2/(a^2 + gamma_k^2) (the nodes400 weight column, matched to 8 digits), total mass
 *       c0 = Sum_rho 4a^2/(a^2+gamma^2) = 53.323962 (both signs of gamma; the positive-gamma partial
 *       sum to height 1e6 is 26.65669 = c0/2, tail beyond 1e6 accounts for 0.0106). Under the
 *       Cayley/atomic map the zero-counting density and the Jacobian combine so the smeared measure
 *       density in theta is (a/pi) log(gamma/2pi) -- a slow (log) background. For an a.c. background
 *       the Szego-quadrature node-counting measure tracks nu_a, giving the closed counting form
 *
 *           N_res(gamma_k) = k * c0 / W(gamma_k),   W(gamma_k) = Sum_{j<=k} w_j  (positive side),
 *
 *       i.e. the order at which the k-th atom picks up its own node (equivalently 1/Christoffel-number
 *       scaled by rank). Measured against the delta = 0.1 detector column this matches within ~7% only
 *       in the mid-band (k = 6: 34.4 vs 33; k = 10: 44.8 vs 48) and DIVERGES at both ends -- it
 *       over-predicts at low index (k = 1: 20.0 vs 12, +67%; k = 3: 26.1 vs 20, +31%) where atom
 *       discreteness dominates, and UNDER-predicts at k = 20 (69.1 vs 107, -35%) where the measured
 *       reach grows faster than the log-background counting proxy. VERDICT: the Christoffel-counting
 *       form is DIRECTIONALLY correct (monotone increasing, right order of magnitude, exact mid-band)
 *       but is NOT a tight analytic reach law across the range; the residual (low-index discreteness
 *       plus a faster-than-a.c. growth past k ~ 15) is the part of SG-96149-grid that still needs the
 *       genuine CMV/Verblunsky Christoffel function lambda_N(theta_k) = 1/K_N at high dps.
 *
 * Reproduce: tmp/imp-96165-scratch.mjs (per-delta power fits on the ROUTE_L.detector.rows literals;
 * exact atom weights w_j = 4a^2/(a^2+gamma_j^2) summed over ZEROS_EXTENDED for W and the c0 check).
 *
 * @see imp-96149-route-l-detector-reach-law-fit.js (parent fit; sub-gap SG-96149-grid)
 * @see rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js (ROUTE_L.detector.rows, a20.nodes400, a20.c0)
 *
 * Ticket: imp-96165 (numerical, medium). Measurement/fit only; changes NO bound; RH open;
 * no refereed bound is changed; NO QED. The sub-gap is ADVANCED, not closed.
 */

// (1) Per-delta detector power-law fits N_det = A * gamma^b over the five detected zero indices
// (1, 3, 6, 10, 20; zero 40 undetected, excluded). Exponent b drifts monotonically with delta.
export const IMP96165_PER_DELTA_FIT = Object.freeze({
  form: 'N_det = A * gamma^b (per delta, 5 detected zeros)',
  rows: Object.freeze([
    // [delta, A, b, r2]
    [0.4,   0.208722, 1.386232, 0.989483],
    [0.2,   0.314128, 1.298261, 0.980249],
    [0.1,   0.364336, 1.271686, 0.975997],
    [0.05,  0.434129, 1.237607, 0.971086],
    [0.025, 0.502324, 1.207443, 0.965670],
  ]),
  bSpread: 0.178788,       // max b - min b: monotone tilt, NOT delta-independent
  bMean: 1.280246,         // equals the imp-96149 pooled all-delta exponent (cross-check)
  bMonotoneDecreasingInDelta: true,
  aMonotoneIncreasingAsDeltaShrinks: true,
  note: 'the O(log 1/delta) additive term in N_det = N_res(gamma) + O(log 1/delta) shows up as a clean monotone exponent tilt (b: 1.386 -> 1.207) that the imp-96149 pooled fit (b = 1.28025) averages away; delta-near-independence holds only in the pooled sense.',
});

// (2) Christoffel-counting analytic reach form N_res(gamma_k) = k * c0 / W(gamma_k) vs measured N_det
// (delta = 0.1). a = 20, c0 = 53.323962 (both signs of gamma). W = cumulative positive-side weight.
export const IMP96165_CHRISTOFFEL_COUNTING = Object.freeze({
  form: 'N_res(gamma_k) = k * c0 / W(gamma_k), W(gamma_k) = Sum_{j<=k} 4a^2/(a^2+gamma_j^2)',
  a: 20,
  c0: 53.32396191198801,
  c0PosHalfTo1e6: 26.65669207,   // positive-gamma partial sum to height 1e6 = c0/2 within the 1e6 tail
  c0TailBeyond1e6: 0.0106,
  smearedThetaDensity: '(a/pi) * log(gamma/2pi)',  // weight cancels the Cayley Jacobian: slow log background
  rows: Object.freeze([
    // [zero index k, gamma_k, W(gamma_k), N_res predicted, N_det measured (delta=0.1), ratio N_res/N_det]
    [1,  14.1347,  2.66760, 19.99, 12,  1.6658],
    [3,  25.0109,  6.12815, 26.10, 20,  1.3052],
    [6,  37.5862,  9.29538, 34.42, 33,  1.0430],
    [10, 49.7738, 11.91698, 44.75, 48,  0.9322],
    [20, 77.1448, 15.43622, 69.09, 107, 0.6457],
  ]),
  midBandMatchWithin: 0.07,      // k = 6, 10: ~7 percent
  overPredictsLowIndex: true,    // k = 1, 3: +67 / +31 percent (atom discreteness)
  underPredictsHighIndex: true,  // k = 20: -35 percent (measured reach grows faster than log background)
  verdict: 'the Christoffel-counting (nodes ~ N dnu_a) form is directionally correct and exact in the mid-band (k = 6, 10 within 7 percent) but NOT a tight analytic reach law: low-index discreteness over-predicts and the k = 20 reach under-predicts by 35 percent. Sub-gap SG-96149-grid ADVANCED, not closed; the tight law still needs the genuine CMV Christoffel function lambda_N(theta_k) = 1/K_N at high dps.',
});

export const IMP96165_VERDICT =
  'Finer Route L detector grid (SG-96149-grid): per-delta exponents DRIFT monotonically b = 1.386 (delta 0.4) '
  + '-> 1.207 (delta 0.025), spread 0.179, mean 1.28025 = the imp-96149 pooled exponent -- the delta-near-independence '
  + 'is only pooled, the log(1/delta) term is a clean exponent tilt. The Christoffel-counting reach form '
  + 'N_res(gamma_k) = k * c0 / W(gamma_k) (c0 = 53.324, atom weights 4a^2/(a^2+gamma^2)) matches measured N_det '
  + 'within ~7 percent in the mid-band (k = 6, 10) but over-predicts at low index (+67/+31 percent) and under-predicts '
  + 'at k = 20 (-35 percent): directionally right, not tight. Sub-gap ADVANCED, not closed. '
  + 'Measurement/fit only; RH open; no refereed bound is changed; NO QED.';

export const IMP96165_SCRIPTS = Object.freeze(['tmp/imp-96165-scratch.mjs']);
