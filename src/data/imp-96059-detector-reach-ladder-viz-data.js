/**
 * @module imp-96059-detector-reach-ladder-viz-data
 *
 * imp-96059 (ux): lightweight, import-light viz-data module for a chart of the Route L
 * (rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js, ROUTE_L.detector) measured
 * detector reach law: replacing the true zero gamma_0 by an off-line FE-symmetric quadruple
 * 1/2 +/- delta +/- i*gamma_0 in the exact Herglotz moments, N_det = first Levinson order at
 * which the CMV Toeplitz form goes indefinite (|alpha| >= 1) detecting the displacement. The
 * measured law is N_det ~ N_res(gamma_0) + O(log 1/delta), nearly delta-independent: zero 1
 * detected at N = 9-14, zero 20 at N = 96-115, zero 40 undetected through N = 400. The reach is a
 * POWER law gamma_det(N) ~ 2.21 * N^0.786 (imp-96149 fit) -- the earlier "linear in N, gamma_{N/10}"
 * characterization below is STALE/REFUTED, corrected here per imp-96149/imp-96178.
 *
 * Reference literals are copied verbatim from ROUTE_L.detector.rows / .law / .reach -- no
 * re-derivation here. Presentation only; changes no bound; NO QED.
 *
 * @see rh-routes-jkl-non-statmech-external-input-hunt-2026-09-23.js (source module: ROUTE_L.detector)
 * @see imp-96149-route-l-detector-reach-law-fit.js (power-law refit correcting the stale linear string)
 *
 * Ticket: imp-96059 (ux, low). RH-equivalent; no refereed bound is changed; NO QED.
 */

// [zero index k, gamma_0, delta, N_det (null = not detected by N=400), e_{N_det-1}/e_0]
export const IMP96059_DETECTOR_ROWS = [
  [1, 14.1347, 0.4, 9, 2.6e-2], [1, 14.1347, 0.2, 11, 1.9e-3], [1, 14.1347, 0.1, 12, 1.6e-3], [1, 14.1347, 0.05, 13, 9.8e-4], [1, 14.1347, 0.025, 14, 4.4e-4],
  [3, 25.0109, 0.4, 17, 2.0e-5], [3, 25.0109, 0.2, 19, 1.1e-6], [3, 25.0109, 0.1, 20, 6.1e-7], [3, 25.0109, 0.05, 22, 1.2e-8], [3, 25.0109, 0.025, 23, 6.3e-9],
  [6, 37.5862, 0.4, 29, 4.6e-13], [6, 37.5862, 0.2, 31, 4.5e-14], [6, 37.5862, 0.1, 33, 1.1e-15], [6, 37.5862, 0.05, 34, 2.6e-16], [6, 37.5862, 0.025, 35, 4.6e-17],
  [10, 49.7738, 0.4, 45, 6.7e-26], [10, 49.7738, 0.2, 47, 7.1e-29], [10, 49.7738, 0.1, 48, 8.0e-29], [10, 49.7738, 0.05, 49, 1.2e-29], [10, 49.7738, 0.025, 50, 1.5e-30],
  [20, 77.1448, 0.4, 96, 1.4e-59], [20, 77.1448, 0.2, 102, 1.2e-61], [20, 77.1448, 0.1, 107, 6.0e-62], [20, 77.1448, 0.05, 112, 1.7e-62], [20, 77.1448, 0.025, 115, 1.1e-62],
  [40, 122.9468, 0.4, null, 5.0e-75], [40, 122.9468, 0.2, null, 5.3e-75], [40, 122.9468, 0.1, null, 5.3e-75], [40, 122.9468, 0.05, null, 5.3e-75], [40, 122.9468, 0.025, null, 5.3e-75],
];

// N_det range (min, max over delta = 0.4..0.025) per zero index, for detected zeros only.
export const IMP96059_NDET_RANGE_BY_ZERO = [
  { k: 1, gamma0: 14.1347, nDetMin: 9, nDetMax: 14, detected: true },
  { k: 3, gamma0: 25.0109, nDetMin: 17, nDetMax: 23, detected: true },
  { k: 6, gamma0: 37.5862, nDetMin: 29, nDetMax: 35, detected: true },
  { k: 10, gamma0: 49.7738, nDetMin: 45, nDetMax: 50, detected: true },
  { k: 20, gamma0: 77.1448, nDetMin: 96, nDetMax: 115, detected: true },
  { k: 40, gamma0: 122.9468, nDetMin: null, nDetMax: null, detected: false },
];

// [N, resolved count among the first 40 zeros] from ROUTE_L.a20.resolvedFirst40 -- the
// order-vs-resolved-count curve for the detector reach (power law gamma_det ~ 2.21 * N^0.786,
// imp-96149; a SEPARATE, coarser count than the per-zero detector rows above).
export const IMP96059_RESOLVED_FIRST_40 = [
  [50, 11], [100, 21], [150, 26], [200, 28], [300, 33], [400, 39],
];

export const IMP96059_A = 20;
export const IMP96059_NMAX = 400;
export const IMP96059_LAW =
  'N_det ~ N_res(gamma_0) + O(log 1/delta): detection happens when the Gauss-Szego quadrature resolves the displaced zero; nearly delta-independent. The pre-test prediction N_det ~ gamma_0^2/(4*a*delta) (from |z_rho|^n drift) is REFUTED (measured/predicted ranges 1.44 -> 0.039).';
export const IMP96059_REACH =
  'height reach ~ 2.21 * N^0.786 (POWER law, imp-96149 fit; the earlier "gamma_{N/10} linear in N" string was stale and is corrected here). Certifying RH to the Platt-Trudgian height 3e12 would need N ~ 3e15 orders -- the verified-zero route is incomparably cheaper. The finite certificate is verified-height-dominated.';
