/**
 * @module imp-96287-route-l-reach-band-reconciliation
 *
 * imp-96287 (numerical): reconcile the three imp-96269 Route L PT-height reach
 * extrapolations -- detector 2.6823e15, Christoffel 1.5111e15, baked all-delta
 * pooled 3.2897e15 -- into a SINGLE honest reach band by propagating the log-log
 * LSQ fit-parameter covariance into the extrapolation at the Platt-Trudgian
 * height T0 = 3.0001e12.
 *
 * INPUTS (baked literals, no heavy run):
 *   - imp-96149 detector column N_det = [12, 20, 33, 48, 107]
 *   - imp-96182 Christoffel eps1e4 column N_C = [12, 21, 33, 48, 104]
 *     both at gamma = [14.1347, 25.0109, 37.5862, 49.7738, 77.1448] (delta = 0.1).
 *
 * METHOD. For each column re-run the same log-log LSQ (x = ln gamma, y = ln N,
 * y = a + b x) and form the ordinary prediction variance of the MEAN response at
 * x0 = ln T0:  Var(yhat0) = s^2 [1/n + (x0 - xbar)^2 / Sxx], with s^2 = SSE/(n-2),
 * n = 5, df = 3. This is exactly the fit-parameter covariance of (a, b) --
 * Var(a) = s^2 (1/n + xbar^2/Sxx), Var(b) = s^2/Sxx, Cov = -s^2 xbar/Sxx --
 * propagated to the single linear combination a + b x0. The band is
 * exp(yhat0 +/- k * seYhat) with k = 1 (68%) and the t(df=3) 95% factor 3.1824.
 *
 * RESULT.
 *   - Both fits reproduce the imp-96269 baked point extrapolations to all digits
 *     (detector A = 0.364336, b = 1.271686, N0 = 2.6823e15; Christoffel
 *     A = 0.396870, b = 1.248736, N0 = 1.5111e15), confirming the literals.
 *   - The THREE reported point numbers span only a factor 2.18 (1.51e15 .. 3.29e15),
 *     all O(1e15): as POINT estimates they already agree at the order of magnitude.
 *     Their geometric-mean center is 2.68e15 (log10 = 15.43).
 *   - The dominant uncertainty is NOT the fit-form choice but the ~10.4-decade
 *     gamma extrapolation from only 5 points. Propagated seYhat (natural log) is
 *     2.900 (detector) and 2.548 (Christoffel) -- a 1-sigma multiplicative reach of
 *     ~18x / ~13x per side. The covariance-propagated statistical bands are:
 *       1-sigma:  detector [1.48e14, 4.87e16], Christoffel [1.18e14, 1.93e16]
 *       95% t3:   detector [2.63e11, 2.73e19], Christoffel [4.54e11, 5.03e18]
 *   - Envelope over both 95% prediction intervals: [2.63e11, 2.73e19] (8.02 decades),
 *     which contains the baked pooled 3.29e15.
 *
 * VERDICT. Reported as point estimates the three numbers reconcile to a single
 * order-of-magnitude reach N ~ 1e15 at the PT height (log10 = 15.2 +/- 0.2 across
 * the three), but the honest covariance-propagated statistical band is far wider:
 * ~[1e14, 5e16] at 1-sigma, ~[3e11, 3e19] at 95%. Even the tightest (1-sigma) band
 * lower endpoint ~1e14 stays ~14 orders beyond feasibility, so the reconciliation
 * changes nothing operationally: Route L is a fixed-cost, verified-height-dominated
 * detector, NOT a lever, at every point in the band. Derivation on baked literals
 * only; changes NO bound; RH open; no refereed bound is changed; NO QED.
 *
 * Reproduce: tmp/imp-96287-band.mjs (pure JS log-log LSQ + prediction variance).
 *
 * @see imp-96269-route-l-reach-law-crosscheck.js (the three source point numbers)
 * @see imp-96149-route-l-detector-reach-law-fit.js (detector power-law fit)
 *
 * Ticket: imp-96287 (numerical, medium). Import-light: pure exported literals, no
 * zeros-bundle import, no self-executing throw.
 */

export const IMP96287_REACH_BAND = Object.freeze({
  T0: 3.0001e12,
  n: 5,
  df: 3,
  gammaLog10ExtrapolationDecades: 10.4,   // ln T0 vs data range, in decades of gamma
  // point estimates being reconciled (from imp-96269)
  points: Object.freeze({
    detectorPowerLaw: 2.6823e15,
    christoffelPowerLaw: 1.5111e15,
    bakedAllDeltaPooled: 3.2897e15,
    spanFactor: 2.18,               // max/min of the three
    geoMeanCenter: 2.6823e15,       // geometric mean of detector & Christoffel points
    geoMeanLog10: 15.43,
    allSameOrder1e15: true,
  }),
  // covariance-propagated prediction std of ln N at x0 = ln T0 (mean response)
  seYhatLn: Object.freeze({ detector: 2.900, christoffel: 2.548 }),
  oneSigmaFactorPerSide: Object.freeze({ detector: 18.2, christoffel: 12.8 }),
  // fit-parameter-covariance-propagated bands
  band1sigma: Object.freeze({
    detector: Object.freeze({ lo: 1.48e14, hi: 4.87e16 }),
    christoffel: Object.freeze({ lo: 1.18e14, hi: 1.93e16 }),
    envelopeLo: 1.18e14,
    envelopeHi: 4.87e16,
    envelopeLog10: Object.freeze({ lo: 14.07, hi: 16.69 }),
  }),
  band95: Object.freeze({
    tFactorDf3: 3.1824,
    detector: Object.freeze({ lo: 2.63e11, hi: 2.73e19 }),
    christoffel: Object.freeze({ lo: 4.54e11, hi: 5.03e18 }),
    envelopeLo: 2.63e11,
    envelopeHi: 2.73e19,
    envelopeDecades: 8.02,
    envelopeLog10: Object.freeze({ lo: 11.42, hi: 19.44 }),
    containsBakedPooled: true,
  }),
  // single honest reported reach
  reportedReach: Object.freeze({
    centralOrder: 1e15,
    centralLog10: 15.2,
    pointSpreadLog10PlusMinus: 0.2,       // across the three point estimates
    statistical1sigmaLog10: Object.freeze({ lo: 14.07, hi: 16.69 }),
    tightestLowerEndpoint: 1.18e14,        // 1-sigma envelope floor
    ordersBeyondFeasibilityAtFloor: 14,    // even the 1-sigma floor is ~14 orders out
  }),
});

export const IMP96287_VERDICT =
  'Route L PT-height reach reconciliation: the three imp-96269 point numbers '
  + '(detector 2.68e15, Christoffel 1.51e15, baked pooled 3.29e15) span only a factor '
  + '2.18 and all sit at O(1e15) (geometric center 2.68e15, log10 15.43), so as point '
  + 'estimates they already agree at the order of magnitude. Propagating the log-log LSQ '
  + 'fit-parameter covariance into the ~10.4-decade extrapolation (n = 5, df = 3) gives a '
  + 'natural-log prediction std of 2.90 (detector) / 2.55 (Christoffel), i.e. a 1-sigma '
  + 'multiplicative reach of ~18x / ~13x per side: the honest bands are ~[1e14, 5e16] at '
  + '1-sigma and ~[3e11, 3e19] (8 decades, containing 3.29e15) at 95%. The reconciled '
  + 'single reach is N ~ 1e15 (log10 15.2 +/- 0.2 as a point estimate) with a statistical '
  + '1-sigma envelope [1.18e14, 4.87e16]; even the 1-sigma floor ~1e14 is ~14 orders beyond '
  + 'feasibility, so Route L stays a fixed-cost, verified-height-dominated detector, NOT a '
  + 'lever, across the whole band. Derivation on baked literals only; changes no bound; RH '
  + 'open; no refereed bound is changed; NO QED.';

export const IMP96287_SCRIPTS = Object.freeze(['tmp/imp-96287-band.mjs']);
