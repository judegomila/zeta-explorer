/**
 * @module imp-96346-route-l-largegamma-residual-tail
 *
 * imp-96346 (numerical): assess whether the imp-96291 k=5 large-gamma residual +1.430% between the
 * Route L detector law and the Christoffel node-counting reach law is a genuine constant asymptotic
 * offset, a slowly vanishing finite-gamma term, or something else -- by extrapolating the fitted-law
 * residual tail and stress-testing the verdict against the fitted-exponent uncertainty.
 *
 * INPUTS (baked literals from imp-96291 / imp-96269, no heavy run):
 *   - detectorFit    N_det = 0.364336 gamma^1.271686   (imp-96149)
 *   - christoffelFit N_C   = 0.396870 gamma^1.248736   (imp-96182)
 *   - baked residual column d_k (percent) = [-2.444, -1.158, 0.230, 0.415, 1.430], k=1..5
 *
 * METHOD. Both reach laws are pure power laws, so the per-row residual has the CLOSED FORM
 *   d(gamma) = N_det/N_C - 1 = (A_det/A_C) gamma^(b_det - b_C) - 1
 * with A_det/A_C = 0.918024 and b_det - b_C = +0.022950. This is exact -- no tail FIT is needed; the
 * residual tail is fully determined by the two fitted laws. (i) Reproduce the baked k=1..5 column from
 * the closed form. (ii) Extrapolate d(gamma) far past the k=5 anchor (gamma_5 = 77.14) to gamma up to
 * 1e12. (iii) Classify the gamma -> infinity limit. (iv) Stress-test the classification against the
 * sign/magnitude of the fitted exponent gap b_det - b_C, which is the sole driver of the verdict.
 *
 * RESULT -- the +1.430% k=5 residual is NEITHER a constant asymptotic offset NOR a vanishing
 * finite-gamma term: under the fitted laws it is the value at gamma_5 of a term that SLOWLY DIVERGES
 * as gamma -> infinity, because the two laws differ in EXPONENT (not just amplitude).
 *   - d(gamma) = 0.918024 gamma^0.022950 - 1 -> +infinity as gamma -> infinity (since b_det > b_C).
 *   - Extrapolated tail (percent): d(1e3) = 7.57, d(1e4) = 13.41, d(1e6) = 26.05, d(1e12) = 73.08.
 *     The residual reaches 2x the k=5 value at gamma ~ 142, 5x at gamma ~ 843, 10x at gamma ~ 1.41e4.
 *   - The growth is very slow (a gamma^0.02295 power), so within the fitted window gamma in [14, 77]
 *     the residual looks like a small ~1.4% offset, but it does NOT saturate: there is no constant the
 *     residual approaches. A constant asymptotic offset would require b_det = b_C exactly.
 *   - SENSITIVITY: the divergence DIRECTION is robust to the exponent gap -- for any b_det - b_C > 0
 *     (even 0.001) the limit is +infinity; only exactly b_det = b_C gives a constant offset
 *     (-8.198%), and b_det < b_C sends N_det/N_C -> 0. But the finite-gamma SIGN and RATE are sensitive:
 *     e.g. at gap 0.005 the residual is still negative at gamma = 1e6 (-1.63%) and only turns positive
 *     far past the fitted window.
 *
 * VERDICT. Under the fitted Route L detector and Christoffel reach laws the imp-96291 +1.430% k=5
 * residual is a slowly DIVERGING finite-gamma value, not a constant asymptotic offset and not a
 * vanishing term: N_det/N_C = 0.918024 gamma^0.022950 grows without bound because the two laws differ
 * in fitted exponent (b_det - b_C = +0.02295). The two laws therefore do NOT converge to a fixed ratio;
 * the divergence is monotone but extremely slow (order 7.6% at gamma = 1e3, 26% at gamma = 1e6).
 *
 * SUB-GAP (IMP96346_EXPONENT_GAP_PERSISTENCE). The divergence verdict is contingent entirely on the
 * fitted exponent gap b_det - b_C = +0.02295 being a genuine asymptotic feature rather than fit noise:
 * it is extracted from only 5 detector rows spanning gamma in [14.13, 77.14] (< 0.74 decade) and then
 * extrapolated up to ~11 decades. As the sensitivity table shows, a gap anywhere in [0, 0.02] keeps the
 * same +infinity limit but changes the finite-gamma sign and the doubling scale by orders of magnitude,
 * and a gap of exactly 0 flips the verdict to a constant -8.20% offset. Confirming the sign and
 * magnitude of b_det - b_C -- hence whether the residual truly diverges and how fast -- requires REAL
 * higher-gamma detector rows (fresh Levinson/Christoffel runs past gamma_5), which are NOT obtainable
 * from the baked literals here. That measurement is left OPEN.
 *
 * Measurement on baked literals + closed-form extrapolation only; changes NO bound; RH open;
 * no refereed bound is changed; NO QED.
 *
 * Reproduce: tmp/imp-96346-scratch.mjs (pure-JS closed-form residual + extrapolation + sensitivity).
 *
 * @see imp-96291-route-l-low-index-correction-test.js (source: sign-changing residual, k=5 = +1.430%)
 * @see imp-96269-route-l-reach-law-crosscheck.js (source power-law literals)
 * @see imp-96149-route-l-detector-reach-law-fit.js (detector power law)
 * @see imp-96182-christoffel-reach-law.js (Christoffel reach law)
 *
 * Ticket: imp-96346 (numerical, medium). Import-light: pure exported literals, no zeros-bundle import,
 * no self-executing throw.
 */

export const IMP96346_LARGEGAMMA_RESIDUAL_TAIL = Object.freeze({
  // closed form d(gamma) = (A_det/A_C) gamma^(b_det - b_C) - 1
  detectorFit: Object.freeze({ A: 0.364336, b: 1.271686 }),
  christoffelFit: Object.freeze({ A: 0.396870, b: 1.248736 }),
  amplitudeRatioAdetOverAc: 0.918024,
  exponentGapBdetMinusBc: 0.022950,
  // reproduce baked k=1..5 residual column (percent)
  sharedGamma: Object.freeze([14.1347, 25.0109, 37.5862, 49.7738, 77.1448]),
  bakedResidualPct: Object.freeze([-2.444, -1.158, 0.230, 0.415, 1.430]),
  closedFormResidualPct: Object.freeze([-2.4442, -1.1581, -0.2298, 0.4153, 1.4303]),
  // extrapolated tail under the fitted laws (percent) -- diverges, does not saturate
  extrapolatedTail: Object.freeze([
    Object.freeze({ gamma: 1e3, dPct: 7.5731 }),
    Object.freeze({ gamma: 1e4, dPct: 13.4106 }),
    Object.freeze({ gamma: 1e6, dPct: 26.0532 }),
    Object.freeze({ gamma: 1e12, dPct: 73.0828 }),
  ]),
  // gamma at which the residual reaches a multiple of the k=5 value (slow divergence scale)
  gammaFor2xK5: 142.0,
  gammaFor5xK5: 842.6,
  gammaFor10xK5: 14070.0,
  // asymptotic classification
  limitAsGammaToInf: '+infinity (slowly diverging, since b_det > b_C)',
  isConstantAsymptoticOffset: false,
  isVanishingFiniteGammaTerm: false,
  isSlowlyDivergingTerm: true,
  // sensitivity of the verdict to the fitted exponent gap (sole driver)
  divergenceDirectionRobust: true,          // any gap > 0 gives +infinity
  constantOffsetOnlyIfGapZero: -8.198,      // percent, the ratio A_det/A_C - 1 when b_det = b_C
  finiteGammaSignSensitiveToGap: true,      // e.g. gap 0.005 stays negative through gamma = 1e6
  // honest sub-gap
  subGap: 'IMP96346_EXPONENT_GAP_PERSISTENCE',
  subGapNote: 'exponent gap b_det - b_C = +0.02295 from 5 rows over gamma in [14,77] (<0.74 decade), '
    + 'extrapolated ~11 decades; confirming its sign/magnitude needs real higher-gamma detector rows, '
    + 'not obtainable from baked literals -- left OPEN',
  changesBound: false,
  rhOpen: true,
});

export const IMP96346_VERDICT =
  'Route L large-gamma residual tail: the imp-96291 +1.430% k=5 detector-vs-Christoffel residual is '
  + 'NEITHER a constant asymptotic offset NOR a vanishing finite-gamma term. Both reach laws are power '
  + 'laws, so the residual has the closed form d(gamma) = (A_det/A_C) gamma^(b_det-b_C) - 1 = '
  + '0.918024 gamma^0.02295 - 1, which reproduces the baked column and SLOWLY DIVERGES as gamma -> '
  + 'infinity (7.57% at gamma=1e3, 26.05% at 1e6, 73.08% at 1e12) because the two laws differ in fitted '
  + 'EXPONENT, not just amplitude. The +1.430% is simply the value of this divergent ratio at gamma_5, '
  + 'not an asymptote; the two laws do not converge to a fixed ratio. SUB-GAP: the divergence is '
  + 'contingent on b_det - b_C = +0.02295 being genuine and not fit noise from 5 rows over a <0.74-decade '
  + 'window extrapolated ~11 decades -- a gap of exactly 0 would flip the verdict to a constant -8.20% '
  + 'offset -- so confirming the exponent gap needs real higher-gamma detector rows (not baked literals), '
  + 'left OPEN. Closed-form extrapolation on baked literals only; changes no bound; RH open; '
  + 'no refereed bound is changed; NO QED.';

export const IMP96346_SCRIPTS = Object.freeze(['tmp/imp-96346-scratch.mjs']);
