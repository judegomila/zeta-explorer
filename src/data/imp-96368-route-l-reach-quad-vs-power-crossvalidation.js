/**
 * @module imp-96368-route-l-reach-quad-vs-power-crossvalidation
 *
 * imp-96368 (accuracy): cross-validate the two sibling extrapolations of the Route L detector reach
 * against each other. imp-96347 fits ln N_det QUADRATIC in ln gamma (positive curvature
 * a2 = +0.366590, a super-power law); imp-96346 uses a FIXED power law N_det = 0.364336 gamma^1.271686
 * (fixed exponent b_det = 1.271686). Both are calibrated on the SAME five detected fit zeros
 * (gamma in [14.13, 77.14]). The question: do the two reach models agree or conflict at gamma ~ 123
 * (zero 40) and at gamma ~ 1e3 / 1e4, and is the imp-96347 running exponent consistent with the
 * imp-96346 fixed b_det.
 *
 * MODELS.
 *   power (imp-96346 / imp-96149):  N_pow(gamma)  = A gamma^b,   A = 0.364336, b = 1.271686
 *   quad  (imp-96347):              N_quad(gamma) = exp(a0 + a1 L + a2 L^2),  L = ln gamma,
 *                                   a0 = 3.318598, a1 = -1.283809, a2 = +0.366590
 * The quadratic has a RUNNING local exponent b_eff(gamma) = d ln N / d ln gamma = a1 + 2 a2 L, which
 * GROWS without bound; the power law has the constant exponent b_det. That is the whole conflict.
 *
 * FINDINGS.
 * (1) The running exponent equals the fixed exponent at exactly ONE height: a1 + 2 a2 L = b_det gives
 *     L = (b_det - a1) / (2 a2) = 3.4855, i.e. gamma = 32.64 -- the CENTRE of the fit window. Below it
 *     the quadratic is sub-power (b_eff < b_det), above it super-power (b_eff > b_det). A power law is
 *     the chord of the quadratic through the window; they cross once, so within-window agreement is
 *     structural, not evidence the two forms agree.
 * (2) Within the fit window (gamma 14..77) the two reaches agree to ~15% (ratio N_quad/N_pow in
 *     [0.889, 1.157]) -- both fit the same five rows. This is the ONLY regime where the sibling
 *     extrapolations are consistent.
 * (3) At zero 40 (gamma_0 = 122.9468, the first EXTRAPOLATED target) they already CONFLICT: b_eff =
 *     2.2441 (76% above the fixed b_det = 1.2717), and the reaches split by 1.68x
 *     (N_pow = 165.6, N_quad = 278.4). This is exactly the imp-96347 correction factor C = 1.6812 --
 *     re-derived here as the ratio of the two sibling laws.
 * (4) Beyond the window the divergence is catastrophic: ratio N_quad/N_pow = 64.6 at gamma = 1e3,
 *     1.46e5 at 1e4, 8.6e16 at 1e6, 5.8e92 at 1e12; the quadratic running exponent reaches 3.78 at
 *     1e3 and 18.97 at 1e12. The two extrapolations do NOT describe the same underlying reach past the
 *     calibration window -- they are functionally incompatible (fixed vs unboundedly-running exponent).
 *
 * CONSEQUENCE for imp-96346. imp-96346 reads a +1.430% detector-vs-Christoffel residual as a slow
 * gamma^0.02295 divergence driven by a fixed exponent gap b_det - b_C = +0.02295. But if the detector
 * reach genuinely has the imp-96347 positive log-curvature, then a single fixed b_det is only the
 * window-averaged chord slope, NOT an asymptotic exponent, and the 0.02295 detector-vs-Christoffel
 * exponent gap is itself a chord-averaging artifact of fitting a curving law over < 0.74 decade. The
 * two siblings therefore encode INCOMPATIBLE premises: imp-96346 assumes a fixed asymptotic exponent,
 * imp-96347 assumes the exponent runs. They agree only where both are pinned to the same data
 * (gamma < ~ window) and diverge without bound above it.
 *
 * VERDICT. The imp-96347 quadratic-in-log reach and the imp-96346 fixed-power reach are consistent
 * ONLY inside the shared fit window (gamma 14..77, agreement ~15%), crossing exactly once at the
 * window centre gamma ~ 32.6. They CONFLICT at every extrapolated height: already 1.68x apart at zero
 * 40 (gamma ~ 123) and diverging to 64x at 1e3, ~1.5e5 at 1e4, and far beyond -- because the quadratic
 * has an unboundedly-running local exponent (b_eff = a1 + 2 a2 ln gamma) while the power law is fixed
 * at b_det = 1.2717. The two sibling extrapolations do NOT describe the same underlying reach outside
 * the calibration window, and the imp-96347 super-power finding, if genuine, demotes imp-96346's fixed
 * b_det (and hence its 0.02295 detector-vs-Christoffel exponent gap) to a window-chord artifact.
 * Both share the SAME open sub-gap: only real detector rows past k = 20 / gamma_5 = 77.14 can decide
 * fixed-exponent (power) vs running-exponent (quadratic). Accuracy cross-check on baked literals only;
 * changes NO bound; verified-zero route stays cheaper; RH open; no refereed bound is changed
 * ; NO QED.
 *
 * Reproduce: tmp/imp-96368-scratch.mjs (pure-JS: both laws, running exponent, crossover, ratio ladder).
 *
 * @see imp-96347-detector-reach-curvature-correction.js (IMP96347_CURVATURE_CORRECTION, quadratic-in-log)
 * @see imp-96346-route-l-largegamma-residual-tail.js (IMP96346_LARGEGAMMA_RESIDUAL_TAIL, fixed power law)
 *
 * Ticket: imp-96368 (accuracy, medium). Import-light: pure exported literals, no zeros-bundle import,
 * no self-executing throw.
 */

export const IMP96368_REACH_MODELS = Object.freeze({
  powerLaw: Object.freeze({ form: 'N_pow = A gamma^b', A: 0.364336, b: 1.271686, source: 'imp-96346 / imp-96149' }),
  quadraticLog: Object.freeze({
    form: 'ln N_quad = a0 + a1 L + a2 L^2,  L = ln gamma',
    a0: 3.318598, a1: -1.283809, a2: 0.366590, source: 'imp-96347',
    runningExponent: 'b_eff(gamma) = a1 + 2 a2 ln gamma (grows without bound)',
  }),
});

// The single height where the quadratic running exponent equals the fixed power exponent.
export const IMP96368_RUNNING_EQUALS_FIXED = Object.freeze({
  Lcross: 3.4855,          // (b - a1) / (2 a2)
  gammaCross: 32.64,       // exp(Lcross) -- centre of the fit window gamma in [14.13, 77.14]
  note: 'sub-power below gammaCross, super-power above; the two laws cross exactly once, so '
    + 'within-window agreement is structural (power law = chord of the quadratic), not independent confirmation',
});

// Ratio ladder N_quad / N_pow and the quadratic running exponent across the reach.
export const IMP96368_DIVERGENCE_LADDER = Object.freeze([
  Object.freeze({ gamma: 14.1347, bEff: 0.6581, nPow: 10.576, nQuad: 12.061, ratioQuadOverPow: 1.1405, regime: 'in-window' }),
  Object.freeze({ gamma: 25.0109, bEff: 1.0765, nPow: 21.852, nQuad: 19.785, ratioQuadOverPow: 0.9054, regime: 'in-window' }),
  Object.freeze({ gamma: 37.5862, bEff: 1.3752, nPow: 36.681, nQuad: 32.598, ratioQuadOverPow: 0.8887, regime: 'in-window' }),
  Object.freeze({ gamma: 49.7738, bEff: 1.5811, nPow: 52.427, nQuad: 49.373, ratioQuadOverPow: 0.9417, regime: 'in-window' }),
  Object.freeze({ gamma: 77.1448, bEff: 1.9024, nPow: 91.530, nQuad: 105.91, ratioQuadOverPow: 1.1571, regime: 'in-window (edge)' }),
  Object.freeze({ gamma: 122.9468, bEff: 2.2441, nPow: 165.56, nQuad: 278.35, ratioQuadOverPow: 1.6812, regime: 'zero-40 extrapolated' }),
  Object.freeze({ gamma: 1e3, bEff: 3.7808, nPow: 2379.9, nQuad: 1.5373e5, ratioQuadOverPow: 64.596, regime: 'far extrapolated' }),
  Object.freeze({ gamma: 1e4, bEff: 5.4690, nPow: 4.4488e4, nQuad: 6.4817e9, ratioQuadOverPow: 1.4569e5, regime: 'far extrapolated' }),
  Object.freeze({ gamma: 1e6, bEff: 8.8454, nPow: 1.5546e7, nQuad: 1.3371e24, ratioQuadOverPow: 8.6009e16, regime: 'far extrapolated' }),
  Object.freeze({ gamma: 1e12, bEff: 18.9747, nPow: 6.6334e14, nQuad: 3.8602e107, ratioQuadOverPow: 5.8194e92, regime: 'far extrapolated' }),
]);

export const IMP96368_CROSSVALIDATION = Object.freeze({
  agreeInWindow: true,                 // ratio in [0.889, 1.157] over gamma 14..77
  windowRatioRange: Object.freeze([0.8887, 1.1571]),
  crossOnce: true, gammaCross: 32.64,  // running exponent = fixed exponent at one height only
  conflictAtZero40: true, zero40Gamma: 122.9468, zero40Ratio: 1.6812, zero40BEff: 2.2441, fixedBdet: 1.271686,
  conflictFarField: true,
  ratioAt1e3: 64.596, ratioAt1e4: 1.4569e5,
  runningExponentUnbounded: true,      // b_eff = a1 + 2 a2 ln gamma -> infinity
  fixedExponentConstant: true,         // b_det = 1.271686 for all gamma
  sameUnderlyingReachOutsideWindow: false,
  imp96346ExponentGapDemotedToChordArtifactIfCurvatureGenuine: true,
  sharedSubGap: 'need real detector rows past k=20 / gamma_5=77.14 to decide fixed vs running exponent',
  changesBound: false,
  rhOpen: true,
});

export const IMP96368_VERDICT =
  'Cross-validation of the two sibling Route L reach extrapolations: the imp-96347 quadratic-in-log '
  + '(running exponent b_eff = a1 + 2 a2 ln gamma, positive curvature) and the imp-96346 fixed power law '
  + '(constant b_det = 1.2717) AGREE only inside the shared fit window (gamma 14..77, ratio in '
  + '[0.889, 1.157]), where they cross exactly once at the window centre gamma ~ 32.6 -- the power law is '
  + 'the chord of the quadratic, so within-window agreement is structural, not independent confirmation. '
  + 'They CONFLICT at every extrapolated height: already 1.68x apart at zero 40 (gamma ~ 123, b_eff = '
  + '2.244 vs 1.272), then 64.6x at gamma = 1e3 and 1.46e5 at 1e4, because the quadratic exponent runs '
  + 'without bound while the power exponent is fixed. Outside the calibration window the two do NOT '
  + 'describe the same reach; and if the imp-96347 positive log-curvature is genuine, imp-96346s fixed '
  + 'b_det (and its 0.02295 detector-vs-Christoffel exponent gap) is only a window-averaged chord slope. '
  + 'Both siblings share the SAME open sub-gap: only real detector rows past k = 20 / gamma_5 = 77.14 can '
  + 'decide fixed-exponent vs running-exponent reach. Accuracy cross-check on baked literals only; '
  + 'changes NO bound; verified-zero route stays cheaper; RH open; no refereed bound is changed; NO QED.';

export const IMP96368_SCRIPTS = Object.freeze(['tmp/imp-96368-scratch.mjs']);
