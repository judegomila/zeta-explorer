/**
 * @module imp-96330-route-l-floor-reconciliation
 *
 * imp-96330 (accuracy): reconcile the imp-96310 Route L 1-sigma feasibility
 * FLOOR (smallest accessible-N the covariance band tolerates at the PT height
 * T0) against the imp-96287/imp-96320 band 1-sigma LOWER EDGE. The two 1.18e14
 * figures should coincide by construction; this audit confirms they do and
 * quantifies the detector-vs-Christoffel floor gap.
 *
 * THE TWO OBJECTS.
 *   - imp-96310 smallestToleratedNatT0 (inverse of the reach fit at T0):
 *       detector    N = 1.476e14
 *       christoffel N = 1.182e14
 *   - imp-96287 band1sigma lower endpoint (exp(yhat0 - 1*seYhat) at x0 = ln T0):
 *       detector    lo = 1.48e14
 *       christoffel lo = 1.18e14   (= envelopeLo, the lower of the two)
 *     imp-96320 is the viz mirror of the same imp-96287 band literals.
 *
 * WHY THEY COINCIDE BY CONSTRUCTION. Both are the SAME linear-combination
 * quantity evaluated at x0 = ln T0. The band lower edge is
 *   lo = exp(yhat0 - seYhat) = N0 * exp(-seYhat),
 * and the inverted-fit floor is the smallest N whose predicted gamma_max reaches
 * T0 at the 1-sigma boundary, which inverts to the identical N0 * exp(-seYhat).
 * There is no second computation -- the feasibility "floor" and the band "lower
 * edge" are one number viewed from the N-axis vs the reach-axis.
 *
 * VERIFICATION (baked literals, no heavy run):
 *   detector    N0 * exp(-se) = 2.6823e15 * exp(-2.900) = 1.4759e14
 *               vs imp-96310 1.476e14 (rel diff 7.6e-5), imp-96287 lo 1.48e14
 *   christoffel N0 * exp(-se) = 1.5111e15 * exp(-2.548) = 1.1823e14
 *               vs imp-96310 1.182e14 (rel diff 2.2e-4), imp-96287 lo 1.18e14
 *   Both agree to the reported 3-4 significant figures: the floor IS the band
 *   lower edge. Same 1-sigma object confirmed.
 *
 * DETECTOR-VS-CHRISTOFFEL FLOOR GAP (1.48e14 vs 1.18e14). The two floors differ
 * by a factor 1.2484 (0.0963 decades), and that gap decomposes EXACTLY:
 *   point-estimate ratio  N0_det / N0_chr        = 1.7751 (detector reach higher)
 *   band-width ratio      exp(-se_det)/exp(-se_chr) = 0.7033 (detector band wider)
 *   product               1.7751 * 0.7033          = 1.2484  (= floor ratio)
 * i.e. the detector's higher central reach is almost entirely cancelled at the
 * lower edge by its wider 1-sigma band (seYhat 2.900 vs 2.548). The Christoffel
 * floor is the lower of the two, so it -- not the detector floor -- sets the
 * imp-96287 envelope lower edge 1.18e14; imp-96310 and imp-96287/imp-96320
 * therefore report the SAME envelope floor.
 *
 * VERDICT. The imp-96310 inverted-fit 1-sigma floor and the imp-96287/imp-96320
 * band 1-sigma lower edge are the same object (N0 * exp(-seYhat) at ln T0),
 * agreeing to <=2.2e-4 relative per column; the detector-Christoffel floor gap
 * (factor 1.248) is fully explained by the higher-reach/wider-band trade-off and
 * is NOT a discrepancy between modules. Accuracy audit only; changes NO bound;
 * Route L stays a fixed-cost, verified-height-dominated DETECTOR, not a Lambda
 * lever; RH open; no refereed bound is changed; NO QED.
 *
 * Reproduce: tmp/imp-96330-recon.mjs (pure JS: N0 * exp(-seYhat) vs baked floors).
 *
 * @see imp-96310-route-l-feasibility-height.js (inverted-fit floor source)
 * @see imp-96287-route-l-reach-band-reconciliation.js (band 1-sigma lower edge)
 * @see imp-96320-route-l-reach-band-viz-data.js (viz mirror of the same band)
 *
 * Ticket: imp-96330 (accuracy, medium). Import-light: pure exported literals, no
 * zeros-bundle import, no self-executing throw.
 */

export const IMP96330_FLOOR_RECONCILIATION = Object.freeze({
  T0: 3.0001e12,
  x0IsLnT0: true,
  // the two objects claimed to coincide, per column
  columns: Object.freeze({
    detector: Object.freeze({
      N0: 2.6823e15,
      seYhatLn: 2.900,
      imp96310Floor: 1.476e14,          // smallestToleratedNatT0.detector.N
      imp96287BandLo: 1.48e14,          // band1sigma.detector.lo
      recomputedFloor: 1.4759e14,       // N0 * exp(-seYhat)
      relDiffVs96310: 7.6e-5,
    }),
    christoffel: Object.freeze({
      N0: 1.5111e15,
      seYhatLn: 2.548,
      imp96310Floor: 1.182e14,          // smallestToleratedNatT0.christoffel.N
      imp96287BandLo: 1.18e14,          // band1sigma.christoffel.lo = envelopeLo
      recomputedFloor: 1.1823e14,       // N0 * exp(-seYhat)
      relDiffVs96310: 2.2e-4,
    }),
  }),
  sameObject: true,                     // floor == band lower edge == N0*exp(-seYhat)
  // detector-vs-Christoffel floor gap, decomposed
  floorGap: Object.freeze({
    ratioDetOverChr: 1.2484,
    decades: 0.0963,
    pointEstimateRatio: 1.7751,         // N0_det / N0_chr (detector reach higher)
    bandWidthRatio: 0.7033,             // exp(-se_det)/exp(-se_chr) (detector wider)
    product: 1.2484,                    // pointEstimateRatio * bandWidthRatio == ratio
    envelopeFloorSetBy: 'christoffel',  // lower of the two -> imp-96287 envelopeLo 1.18e14
  }),
  changesBound: false,
  routeLStaysDetectorNotLever: true,
});

export const IMP96330_VERDICT =
  'Route L 1-sigma floor reconciliation: the imp-96310 inverted-fit feasibility '
  + 'floor (detector 1.476e14 / Christoffel 1.182e14) and the imp-96287/imp-96320 '
  + 'band 1-sigma lower edge (1.48e14 / 1.18e14) are the SAME object -- both equal '
  + 'N0 * exp(-seYhat) evaluated at x0 = ln T0 -- and agree to <=2.2e-4 relative per '
  + 'column, so the two 1.18e14 figures coincide by construction. The detector-vs-'
  + 'Christoffel floor gap (factor 1.2484, 0.096 decades) decomposes exactly as the '
  + 'detector 1.775x higher central reach times its 0.703x tighter (wider) band, so it '
  + 'is a reach/width trade-off, not a module discrepancy; the Christoffel floor, being '
  + 'the lower of the two, sets the shared envelope lower edge 1.18e14. Accuracy audit '
  + 'only; changes no bound; Route L stays a fixed-cost, verified-height-dominated '
  + 'detector, not a lever; RH open; no refereed bound is changed; NO QED.';

export const IMP96330_SCRIPTS = Object.freeze(['tmp/imp-96330-recon.mjs']);
