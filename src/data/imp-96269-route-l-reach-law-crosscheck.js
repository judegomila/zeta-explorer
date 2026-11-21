/**
 * @module imp-96269-route-l-reach-law-crosscheck
 *
 * imp-96269 (numerical): cross-check the imp-96149 Route L (Li-Herglotz-CMV) detector reach
 * POWER law (gamma_det ~ 2.21 N^0.786, from N_det = 0.3643 gamma^1.272) against the imp-96182
 * genuine CMV/Verblunsky Christoffel reach law over the shared N range, and confirm both
 * extrapolate to the same N-order needed at the Platt-Trudgian verified height T0 ~ 3e12.
 *
 * INPUTS (baked literals, no heavy run):
 *   - imp-96149 IMP96149_DETECTOR_FIT: N_det = 0.364336 * gamma^1.271686 (r2 0.976), the power-law
 *     fit to the measured off-line detector column N_det = [12, 20, 33, 48, 107] at
 *     gamma = [14.1347, 25.0109, 37.5862, 49.7738, 77.1448] (delta = 0.1).
 *   - imp-96182 IMP96182_CHRISTOFFEL_REACH.eps1e4CrossColumn = [12, 21, 33, 48, 104], the order at
 *     which the genuine Christoffel function lambda_N(theta_k)/w_k first crosses 1 + 1e-4 -- the
 *     analytic (non-node-counting) reach law, at the SAME gamma points.
 *
 * METHOD. Re-fit the imp-96182 Christoffel eps1e4 reach column as a power law N_C = A * gamma^b
 * (same log-log LSQ imp-96149 used on its detector column), then compare (i) exponent/prefactor,
 * (ii) per-row predicted-order discrepancy over the shared gamma range, and (iii) the two
 * extrapolated truncation orders at the PT height T0 = 3.0001e12.
 *
 * RESULT -- the two reach laws are CONSISTENT.
 *   - Christoffel eps1e4 re-fit: N_C = 0.396870 * gamma^1.248736 (r2 0.9807), vs the imp-96149
 *     detector fit N_det = 0.364336 * gamma^1.271686. Exponents agree to 1.80% (Christoffel
 *     slightly shallower), prefactors to 8.93%.
 *   - Per-row predicted-order gap between the two power laws is <= 2.44% across the shared gamma
 *     range (largest at the k = 1 low-index end); the raw Christoffel-vs-measured column agrees to
 *     the 5% imp-96182 already reported (k = 3 off one order, k = 20 within 3%, mid-band exact).
 *   - Both extrapolate to the SAME 1e15 order at T0 = 3e12: detector 2.68e15, Christoffel 1.51e15
 *     (ratio 0.56, same order of magnitude, within a factor of two of the imp-96149 baked
 *     detectorPowerLaw nNeeded = 3.29e15 which uses the all-delta pooled exponent 1.280246).
 *
 * VERDICT. The two independent Route L reach characterizations -- the empirical detector power-law
 * fit (imp-96149) and the genuine Christoffel-saturation reach (imp-96182) -- describe the same
 * underlying reach column and land on the same N ~ (1.5..3.3)e15 order at the Platt-Trudgian
 * height, ~15 orders of magnitude beyond feasibility. Route L stays a fixed-cost, verified-height-
 * dominated detector, NOT a lever; the verified-zero route remains incomparably cheaper.
 * Cross-check of baked literals only; changes NO bound; RH open; no refereed bound is changed
 * ; NO QED.
 *
 * Reproduce: tmp/imp-96269-crosscheck.mjs (pure JS log-log power fit on the literals above).
 *
 * @see imp-96149-route-l-detector-reach-law-fit.js (detector power-law fit)
 * @see imp-96182-christoffel-reach-law.js (genuine Christoffel reach column)
 * @see imp-96165-route-l-detector-finer-grid-christoffel.js (finer-grid run, SG-96149-grid)
 *
 * Ticket: imp-96269 (numerical, medium). Import-light: pure exported literals, no zeros-bundle
 * import, no self-executing throw.
 */

export const IMP96269_REACH_LAW_CROSSCHECK = Object.freeze({
  sharedGamma: Object.freeze([14.1347, 25.0109, 37.5862, 49.7738, 77.1448]),
  measuredNdet: Object.freeze([12, 20, 33, 48, 107]),          // imp-96149 nDetFit / imp-96182 measuredNdetColumn
  christoffelEps1e4: Object.freeze([12, 21, 33, 48, 104]),     // imp-96182 eps1e4CrossColumn (analytic reach)
  // imp-96149 baked detector power-law fit: N_det = A * gamma^b
  detectorFit: Object.freeze({ form: 'N_det = A * gamma^b', A: 0.364336, b: 1.271686, r2: 0.975997 }),
  // re-fit of the imp-96182 Christoffel eps1e4 reach column as the same power law
  christoffelFit: Object.freeze({ form: 'N_C = A * gamma^b', A: 0.396870, b: 1.248736, r2: 0.980687 }),
  exponentDiscrepancy: Object.freeze({ absolute: -0.022950, relativePct: -1.8047 }),   // Christoffel shallower
  prefactorDiscrepancy: Object.freeze({ absolute: 0.032534, relativePct: 8.9296 }),
  maxRowDiscrepancyPct: 2.44,        // max |N_149 - N_182| / N_182 over the shared gamma range (at k=1)
  christoffelVsMeasuredMaxRelErrPct: 5.0,  // matches imp-96182 maxRelErrEps1e4 = 0.05 (k=3 off one order)
  // extrapolation to the Platt-Trudgian verified height
  T0: 3.0001e12,
  nNeededAtT0: Object.freeze({
    detectorPowerLaw: 2.6823e15,     // N = 0.364336 * T0^1.271686
    christoffelPowerLaw: 1.5111e15,  // N = 0.396870 * T0^1.248736
    ratio_182_over_149: 0.5634,      // same order of magnitude
    bakedAllDelta149: 3.2897e15,     // imp-96149 IMP96149_EXTRAPOLATION detectorPowerLaw (allDelta exponent)
    bothLog10: 15,                   // both O(1e15)
  }),
  consistent: true,
});

export const IMP96269_VERDICT =
  'Route L reach cross-check: the imp-96182 genuine Christoffel eps1e4 reach column re-fits as '
  + 'N_C = 0.396870 * gamma^1.248736 (r2 0.9807), agreeing with the imp-96149 detector power law '
  + 'N_det = 0.364336 * gamma^1.271686 to 1.80% in exponent and 8.93% in prefactor; the two reach '
  + 'laws differ by at most 2.44% in predicted order across the shared gamma range, and the raw '
  + 'Christoffel column matches the measured N_det to the 5% imp-96182 already reported. Extrapolated '
  + 'to the Platt-Trudgian height T0 = 3.0001e12 both land at the SAME 1e15 order (detector 2.68e15, '
  + 'Christoffel 1.51e15, within a factor two of the baked 3.29e15), ~15 orders beyond feasibility. '
  + 'The empirical fit and the analytic Christoffel-saturation reach are consistent; Route L stays a '
  + 'fixed-cost detector, NOT a lever, and the verified-height route stays incomparably cheaper. '
  + 'Cross-check of baked literals only; changes no bound; RH open; no refereed bound is changed'
  + '; NO QED.';

// imp-96421 (numerical): robustness of the imp-96269 Christoffel eps1e4 re-fit to
// DROPPING the k=3 one-order-off outlier row (imp-96182 flagged k=3 as the raw
// Christoffel-vs-measured off-by-one row; in the shared 5-point subset it is the
// gamma=37.5862 point, the second-largest negative log residual of the full fit).
// Re-fitting the remaining 4 points (same log-log LSQ) barely moves the law and
// STRENGTHENS every imp-96269 conclusion. Measurement only; changes NO bound; NO QED.
// Reproduce: tmp/imp-96421-scratch.mjs.
export const IMP96421_K3_DROP_ROBUSTNESS = Object.freeze({
  droppedRow: Object.freeze({ k: 3, gamma: 37.5862, christoffelEps1e4: 33, fullFitRelPct: -10.24 }),
  fullFit: Object.freeze({ A: 0.396870, b: 1.248736, r2: 0.980687 }),          // all 5 points (imp-96269 christoffelFit)
  dropK3Fit: Object.freeze({ A: 0.398919, b: 1.254930, r2: 0.986146 }),        // 4 points, k=3 removed
  exponentMove: Object.freeze({ absolute: 0.006193, relativePct: 0.496 }),     // full -> drop, negligible
  prefactorMove: Object.freeze({ absolute: 0.002049, relativePct: 0.516 }),
  // after dropping k=3 the Christoffel exponent moves TOWARD the imp-96149 detector b=1.271686
  exponentVsDetectorPct: Object.freeze({ full: -1.8047, dropK3: -1.318 }),     // agreement tightens 1.80 -> 1.32
  prefactorVsDetectorPct: Object.freeze({ full: 8.9296, dropK3: 9.492 }),      // essentially unchanged
  // PT-height extrapolation at T0 = 3.0001e12
  nNeededAtT0: Object.freeze({
    christoffelFull: 1.5111e15,
    christoffelDropK3: 1.8147e15,
    ratioDropOverFull: 1.2009,          // stays the same 1e15 order
    ratioDropOverDetector: 0.6766,      // in [0.5, 2] -> detector/Christoffel factor-of-two agreement SURVIVES
    bothLog10: 15,
  }),
  robust: true,   // exponent/prefactor move < 0.6%, factor-of-two agreement survives, r2 improves
});

export const IMP96421_VERDICT =
  'imp-96269 re-fit is robust to the k=3 outlier: dropping the gamma=37.5862 row (imp-96182 one-'
  + 'order-off k=3) and re-fitting the remaining 4 Christoffel eps1e4 points gives N_C = 0.398919 * '
  + 'gamma^1.254930 (r2 0.9861, up from 0.9807), moving the exponent 0.50% and prefactor 0.52% from '
  + 'the full fit. The PT-height order is unchanged (1.81e15 vs 1.51e15, still 1e15, ratio 1.20), the '
  + 'detector/Christoffel factor-of-two agreement survives (ratio 0.68 in [0.5,2]), and the exponent-'
  + 'vs-detector agreement even tightens (1.80% -> 1.32%). Every imp-96269 conclusion holds; Route L '
  + 'stays a fixed-cost detector, NOT a lever; changes no bound; RH open; no refereed bound is changed'
  + '; NO QED.';

export const IMP96269_SCRIPTS = Object.freeze(['tmp/imp-96269-crosscheck.mjs', 'tmp/imp-96421-scratch.mjs']);
