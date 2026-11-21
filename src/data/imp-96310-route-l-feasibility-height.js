/**
 * @module imp-96310-route-l-feasibility-height
 *
 * imp-96310 (numerical): turn the imp-96287 Route L reach-band verdict
 * (band-wide not-a-lever, stated qualitatively) into an explicit
 * feasibility-HEIGHT number, by INVERTING the same log-log LSQ reach fit.
 *
 * SETUP (baked literals, no heavy run):
 *   - gamma = [14.1347, 25.0109, 37.5862, 49.7738, 77.1448] (delta = 0.1)
 *   - imp-96149 detector column N_det = [12, 20, 33, 48, 107]
 *   - imp-96182 Christoffel eps1e4 column N_C = [12, 21, 33, 48, 104]
 *   - Platt-Trudgian verified height T0 = 3.0001e12.
 *
 * The fit y = a + b x with x = ln gamma, y = ln N reproduces the imp-96287
 * baked point extrapolations to all digits (detector a = -1.009679, b = 1.271686,
 * N0 = 2.6823e15, seYhat = 2.900; Christoffel a = -0.924148, b = 1.248736,
 * N0 = 1.5111e15, seYhat = 2.548), confirming the literals.
 *
 * MEASUREMENT. imp-96287 gives the reach as REQUIRED-N at the fixed height T0.
 * Here we invert it: gamma_max(N) = exp((ln N - a) / b) is the largest verified
 * height at which the fit predicts the detector resolves N accessible points. For
 * Route L to be a Lambda LEVER it would have to EXTEND verified height, i.e. reach
 * gamma_max >= T0 at a FEASIBLE accessible-N. We sweep feasibility ceilings and
 * find the height each one buys, then compare to T0.
 *
 * RESULT.
 *   - Reachable height climbs slowly with the accessible-N budget (detector fit):
 *       N_feas = 1e2  -> gamma_max = 8.27e1   (10.56 decades below T0)
 *       N_feas = 1e3  -> gamma_max = 5.06e2   (9.77  decades below T0)
 *       N_feas = 1e6  -> gamma_max = 1.16e5   (7.41  decades below T0)
 *       N_feas = 1e9  -> gamma_max = 2.64e7   (5.06  decades below T0)
 *       N_feas = 1e13 -> gamma_max = 3.69e10  (1.91  decades below T0)
 *   - Even at the EXTREME feasibility ceiling N = 1e13 (the SOTA computed-zeros
 *     count), gamma_max = 3.69e10 (detector) / 5.39e10 (Christoffel) still FALLS
 *     1.91 / 1.75 decades SHORT of the already-verified PT height T0 = 3e12.
 *   - Equivalently, the smallest accessible-N the covariance band tolerates at T0
 *     (the 1-sigma floor) is 1.48e14 (detector) / 1.18e14 (Christoffel), i.e.
 *     ~1.1-1.2 decades ABOVE even the 1e13 feasibility ceiling.
 *
 * VERDICT. At NO feasible accessible-N does the reach fit place Route L at or above
 * the already-verified height: the height a feasible N buys is always strictly below
 * T0 (by >= 1.75 decades even at the most generous 1e13 ceiling), so Route L can only
 * ever re-detect INSIDE the already-verified region and never extends it. This is the
 * quantitative form of the imp-96287 verdict: Route L is a fixed-cost, verified-height-
 * dominated DETECTOR, NOT a Lambda lever, at every point in the band. Derivation on
 * baked literals only; changes NO bound; RH open; no refereed bound is changed
 * ; NO QED.
 *
 * Reproduce: tmp/imp-96310-feasibility-height.mjs (pure JS log-log LSQ + inversion).
 *
 * @see imp-96287-route-l-reach-band-reconciliation.js (the reach band this inverts)
 * @see imp-96149-route-l-detector-reach-law-fit.js (detector power-law fit source)
 *
 * Ticket: imp-96310 (numerical, medium). Import-light: pure exported literals, no
 * zeros-bundle import, no self-executing throw.
 */

export const IMP96310_FEASIBILITY_HEIGHT = Object.freeze({
  T0: 3.0001e12,
  T0Log10: 12.4772,
  n: 5,
  df: 3,
  // fit params (x = ln gamma, y = ln N), reproducing imp-96287 baked N0 exactly
  fit: Object.freeze({
    detector: Object.freeze({ a: -1.009679, b: 1.271686, seYhatLn: 2.9000, N0: 2.6823e15 }),
    christoffel: Object.freeze({ a: -0.924148, b: 1.248736, seYhatLn: 2.5483, N0: 1.5111e15 }),
  }),
  // gamma_max(N_feas) = exp((ln N_feas - a)/b): height a feasible accessible-N buys
  heightForFeasibleN: Object.freeze([
    Object.freeze({ Nfeas: 1e2, gammaMaxDetector: 8.270e1, log10: 1.92, gapBelowT0Decades: 10.56 }),
    Object.freeze({ Nfeas: 1e3, gammaMaxDetector: 5.057e2, log10: 2.70, gapBelowT0Decades: 9.77 }),
    Object.freeze({ Nfeas: 1e6, gammaMaxDetector: 1.156e5, log10: 5.06, gapBelowT0Decades: 7.41 }),
    Object.freeze({ Nfeas: 1e9, gammaMaxDetector: 2.643e7, log10: 7.42, gapBelowT0Decades: 5.06 }),
    Object.freeze({ Nfeas: 1e13, gammaMaxDetector: 3.694e10, log10: 10.57, gapBelowT0Decades: 1.91 }),
  ]),
  // lever test at the most generous feasibility ceiling N = 1e13 (SOTA computed-zeros)
  extremeFeasibilityCeiling: 1e13,
  leverTestAt1e13: Object.freeze({
    detector: Object.freeze({ gammaMax: 3.694e10, reachesT0: false, decadesShort: 1.91 }),
    christoffel: Object.freeze({ gammaMax: 5.394e10, reachesT0: false, decadesShort: 1.75 }),
  }),
  // inverse view: smallest accessible-N the band tolerates AT T0 (1-sigma floor on N)
  smallestToleratedNatT0: Object.freeze({
    detector: Object.freeze({ N: 1.476e14, log10: 14.17, decadesAbove1e13Ceiling: 1.2 }),
    christoffel: Object.freeze({ N: 1.182e14, log10: 14.07, decadesAbove1e13Ceiling: 1.1 }),
  }),
  anyFeasibleNReachesT0: false,
});

export const IMP96310_VERDICT =
  'Route L feasibility-height inversion: inverting the imp-96287 log-log reach fit '
  + 'to gamma_max(N) = exp((ln N - a)/b) shows the verified height a FEASIBLE accessible-N '
  + 'buys climbs only slowly (detector: N=1e6 -> gamma 1.16e5, N=1e9 -> gamma 2.64e7, '
  + 'N=1e13 -> gamma 3.69e10). Even at the extreme feasibility ceiling N=1e13 (the SOTA '
  + 'computed-zeros count) gamma_max = 3.69e10 (detector) / 5.39e10 (Christoffel) still '
  + 'falls 1.91 / 1.75 decades SHORT of the already-verified PT height T0 = 3e12, and the '
  + 'smallest accessible-N the covariance band tolerates at T0 (1-sigma floor 1.48e14 / '
  + '1.18e14) sits ~1.1-1.2 decades above that ceiling. At NO feasible accessible-N does '
  + 'the fit place Route L at or above the verified height, so it can only ever re-detect '
  + 'inside the already-verified region -- the quantitative form of the imp-96287 verdict: '
  + 'Route L is a fixed-cost, verified-height-dominated DETECTOR, NOT a Lambda lever, at '
  + 'every point in the band. Baked literals only; changes no bound; RH open; no refereed bound is changed'
  + '; NO QED.';

export const IMP96310_SCRIPTS = Object.freeze(['tmp/imp-96310-feasibility-height.mjs']);
