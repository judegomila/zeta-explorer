/**
 * @module imp-96407-route-l-reach-spread-decomposition
 *
 * imp-96407 (numerical): decompose the imp-96269 PT-height N-needed spread between the two Route L
 * reach laws -- detector (imp-96149) N_det = 0.364336 * gamma^1.271686 and Christoffel (imp-96182)
 * N_C = 0.396870 * gamma^1.248736 -- into the part driven by the ~0.023 EXPONENT gap and the part
 * driven by the PREFACTOR gap, and test whether the spread is HEIGHT-AMPLIFIED out of the shared
 * measured gamma range.
 *
 * INPUTS (baked literals from imp-96269-route-l-reach-law-crosscheck.js, no heavy run):
 *   detectorFit    A = 0.364336, b = 1.271686
 *   christoffelFit A = 0.396870, b = 1.248736
 *   T0 = 3.0001e12 (Platt-Trudgian verified height); shared gamma range [14.1347 .. 77.1448].
 *
 * METHOD. Write the extrapolated ratio at T0 as a product of a prefactor factor and an exponent
 * factor:  N_det / N_C = (A_det/A_C) * T0^(b_det - b_C). Take log10 so the two contributions add,
 * and read each term as a fraction of the total log10 spread. Then evaluate the exponent factor
 * gamma^(b_det-b_C) at the two ends of the measured range and at T0 to see how far the tiny
 * exponent gap is levered by the extrapolation distance.
 *
 * RESULT -- the spread is EXPONENT-GAP-DRIVEN and HEIGHT-AMPLIFIED; the prefactor gap works AGAINST it.
 *   - Total N-needed spread at T0: N_det/N_C = 1.7750 (equivalently the baked N_C/N_det = 0.5634),
 *     i.e. log10 spread = 0.249204.
 *   - Log10 decomposition: exponent-gap term = +0.286350 (114.9% of the total spread), prefactor-gap
 *     term = -0.037146 (-14.9%). The 0.022950 exponent gap alone would give a factor 1.9335; the
 *     prefactor ratio A_det/A_C = 0.918024 pulls the ratio back toward 1, partially CANCELLING rather
 *     than adding to the exponent-driven spread. So >100% of the spread comes from the exponent gap.
 *   - Height amplification: over the shared measured range the exponent gap produces only a small
 *     divergence -- 6.27% at gamma = 14.1347, 10.49% at gamma = 77.1448 -- but extrapolating the
 *     10.590 further decades from the measured top (gamma = 77.1448) to T0 = 3e12 balloons it to a
 *     93.35% divergence (a further factor 1.7500 of amplification). The 182/149 fan is thus a genuine
 *     consequence of the tiny measured exponent difference levered over ~10.6 decades, NOT a robust
 *     separation visible in the measured data.
 *
 * VERDICT. The imp-96269 182-vs-149 PT-height N-needed spread (Christoffel 1.51e15 vs detector
 * 2.68e15) is entirely the ~0.023 exponent gap height-amplified across the ~10.6-decade extrapolation
 * to T0; the 8.2% prefactor gap is height-independent and offsets ~15% of it. Both laws still land at
 * the same 1e15 order, so the decomposition sharpens WHY the fan opens (an over-levered exponent
 * micro-difference) without moving either conclusion. Measurement of baked literals only; changes NO
 * bound; RH open; no refereed bound is changed; NO QED.
 *
 * Reproduce: tmp/imp-96407-spread-decomposition.mjs (pure JS, no imports).
 *
 * @see imp-96269-route-l-reach-law-crosscheck.js (source detector/Christoffel fits + baked ratio)
 * @see imp-96149-route-l-detector-reach-law-fit.js (detector power-law fit)
 * @see imp-96182-christoffel-reach-law.js (genuine Christoffel reach column)
 *
 * Ticket: imp-96407 (numerical, medium). Import-light: pure exported literals, no zeros-bundle
 * import, no self-executing throw.
 */

export const IMP96407_REACH_SPREAD_DECOMPOSITION = Object.freeze({
  T0: 3.0001e12,
  sharedGamma: Object.freeze({ min: 14.1347, max: 77.1448 }),
  detectorFit: Object.freeze({ A: 0.364336, b: 1.271686 }),      // imp-96149
  christoffelFit: Object.freeze({ A: 0.396870, b: 1.248736 }),   // imp-96182 re-fit
  exponentGap: 0.022950,        // b_det - b_C
  prefactorRatio: 0.918024,     // A_det / A_C
  nNeededAtT0: Object.freeze({ detector: 2.6823e15, christoffel: 1.5111e15 }),
  spread: Object.freeze({
    ratio_det_over_C: 1.7750,      // N_det / N_C
    ratio_C_over_det: 0.5634,      // matches imp-96269 ratio_182_over_149
    log10Total: 0.249204,
    log10ExponentTerm: 0.286350,   // 114.9% of the total spread
    log10PrefactorTerm: -0.037146, // -14.9% (partial cancellation)
    exponentSharePct: 114.9,
    prefactorSharePct: -14.9,
  }),
  heightAmplification: Object.freeze({
    expFactorAtGammaMin: 1.0627,   // 6.27% divergence at gamma = 14.1347
    expFactorAtGammaMax: 1.1049,   // 10.49% divergence at gamma = 77.1448
    expFactorAtT0: 1.9335,         // 93.35% divergence at T0
    leverDecadesGammaMaxToT0: 10.5898,
    amplificationT0OverGammaMax: 1.7500,
  }),
  exponentDriven: true,
  heightAmplified: true,
});

export const IMP96407_VERDICT =
  'Route L PT-height N-needed spread decomposition: the imp-96269 182-vs-149 fan (Christoffel 1.51e15 '
  + 'vs detector 2.68e15, ratio 0.5634) decomposes in log10 into an exponent-gap term +0.286350 '
  + '(114.9% of the 0.249204 total spread) and a prefactor-gap term -0.037146 (-14.9%). The 0.022950 '
  + 'exponent gap alone gives a factor 1.9335; the 8.2% prefactor gap (A_det/A_C = 0.918024) partially '
  + 'CANCELS it rather than adding, so the spread is >100% exponent-driven. It is height-amplified: the '
  + 'gap causes only 6.3%-10.5% divergence across the shared gamma range but 93.4% at T0, a further '
  + 'factor 1.75 over the 10.59-decade extrapolation from gamma = 77.1448 to T0 = 3e12. The fan is an '
  + 'over-levered exponent micro-difference, not a robust separation; both laws still land at 1e15. '
  + 'Measurement of baked literals only; changes no bound; RH open; no refereed bound is changed'
  + '; NO QED.';

export const IMP96407_SCRIPTS = Object.freeze(['tmp/imp-96407-spread-decomposition.mjs']);
