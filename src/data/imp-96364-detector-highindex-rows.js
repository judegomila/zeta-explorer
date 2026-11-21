/**
 * @module imp-96364-detector-highindex-rows
 *
 * imp-96364 (numerical): obtain REAL higher-index Route L detector rows past k = 20
 * (gamma_5 = 77.14) to (i) pin the imp-96347 log-curvature at gamma ~ 123 and (ii) decide the
 * sign/magnitude of the imp-96346 fitted exponent gap b_det - b_C = +0.02295. Both sibling
 * residuals (imp-96347 SG-96347-curv and imp-96346 IMP96346_EXPONENT_GAP_PERSISTENCE) were
 * contingent on the SAME missing data: real detector rows between the k = 20 anchor and the
 * previously-undetected k = 40 point, extracted from only 5 rows over gamma in [14, 77]
 * (< 0.74 decade) and extrapolated many decades.
 *
 * METHOD -- identical construction to imp-96059 / route-l3-detector-reach (a = 20, exact
 * Herglotz moments c_n(a) from xi/xi Taylor data with NO zeros; replace the on-line pair at a
 * true zero gamma_0 by the off-line quadruple 1/2 +- delta +- i gamma_0; N_det = first Levinson
 * order with |kappa| >= 1, GENUINE iff e/e0 > floor). Fresh run at delta = 0.1, dps = 180
 * (floor 1e-165), NMAX = 700 in tmp/imp-96364-detector-highindex.py. Three new zero indices
 * k = 25, 30, 35 fill the gap; k = 20 is re-run as a construction cross-check and k = 40 is
 * pushed to detection.
 *
 * RESULT.
 *  - CONSTRUCTION CROSS-CHECK: k = 20 reproduces the baked row EXACTLY, N_det = 107 (GENUINE,
 *    e/e0 = 6.0e-62) -- the fresh run is bit-consistent with imp-96059.
 *  - FOUR NEW REAL, GENUINE ROWS (e/e0 far above the 1e-165 floor):
 *      k = 25 (gamma = 88.8091):  N_det = 159   (e/e0 = 8.1e-67)
 *      k = 30 (gamma = 101.3179): N_det = 237   (e/e0 = 5.6e-71)
 *      k = 35 (gamma = 111.8747): N_det = 338   (e/e0 = 2.0e-74)
 *      k = 40 (gamma = 122.9468): N_det = 449   (e/e0 = 2.7e-76)
 *    Zero 40 is now DETECTED at N_det = 449 -- previously only bounded N_det >= 400
 *    (imp-96273 IMP96273_MEASURED_LOWER_BOUND undetected through N = 400). The measured value
 *    449 sits ABOVE even the imp-96347 curvature-corrected forecast 278.4, confirming the reach
 *    is super-power relative to the fitted convexity, exactly as imp-96347 flagged.
 *
 * (i) CURVATURE PERSISTS AND STRENGTHENS. Refitting the quadratic in log-gamma
 *     ln N_det = a0 + a1 L + a2 L^2 (L = ln gamma) on the extended 9-row ladder (k = 1..40)
 *     gives a2 = +0.601253, UP from the imp-96347 baked value +0.366590. The positive
 *     log-curvature is a genuine feature that real higher-gamma rows AMPLIFY, not fit noise
 *     that washes out -- SG-96347-curv is resolved in the affirmative.
 *
 * (ii) EXPONENT GAP IS DECISIVELY POSITIVE. The single-power height fit over the extended
 *      ladder is N_det = 0.094245 gamma^1.683402 (r2 = 0.9530, DOWN from 0.9760 -- a single
 *      power law can no longer absorb the convexity), so the fitted exponent b_det rises from
 *      1.271686 (k = 1..20) to 1.683402 (k = 1..40). Against the imp-96182 Christoffel exponent
 *      b_C = 1.248736 the exponent gap b_det - b_C therefore grows from +0.022950 (baked) to
 *      +0.434666 (extended). The imp-96346 divergence verdict N_det / N_C -> +infinity is
 *      confirmed with real data: the sign is positive with high confidence, and the +0.02295
 *      value was a small-window LOWER estimate biased toward zero by the narrow low-gamma fit.
 *      IMP96346_EXPONENT_GAP_PERSISTENCE is resolved -- the gap is genuine, not fit noise.
 *
 * HONEST LIMIT. The rising single-power exponent (1.272 -> 1.683) and rising curvature
 * (a2 0.367 -> 0.601) both say the detector reach has NO single asymptotic power exponent over
 * this window -- it is convex in log-log, so the "exponent gap" is a moving quantity, not a
 * fixed asymptote; the correct statement is the qualitative sign (b_det > b_C, divergent ratio),
 * not a certified asymptotic exponent. Rows are one delta (0.1) at gamma <= 123; the asymptotic
 * gamma -> infinity exponent still needs rows across further decades.
 *
 * Measurement only; changes NO bound; the verified-zero route stays cheaper; RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see imp-96347-detector-reach-curvature-correction.js (SG-96347-curv, IMP96347_CURVATURE_CORRECTION)
 * @see imp-96346-route-l-largegamma-residual-tail.js (IMP96346_EXPONENT_GAP_PERSISTENCE)
 * @see imp-96149-route-l-detector-reach-law-fit.js (IMP96149_DETECTOR_FIT, baked k=1..20 rows)
 * @see imp-96182-christoffel-reach-law.js (Christoffel exponent b_C = 1.248736)
 *
 * Ticket: imp-96364 (numerical, high). Import-light: pure exported literals, no zeros-bundle
 * import, no self-executing throw.
 */

// Fresh Route L detector rows (a = 20, delta = 0.1, dps = 180, NMAX = 700).
// k = 20 is a construction cross-check (reproduces the baked N_det = 107); k = 25/30/35 are new;
// k = 40 is pushed past the old N = 400 non-detection to its real first-detection order.
export const IMP96364_DETECTOR_ROWS = Object.freeze([
  Object.freeze({ k: 20, gamma0: 77.1448, nDet: 107, eFrac: 6.0e-62, kind: 'GENUINE', role: 'cross-check (matches baked)' }),
  Object.freeze({ k: 25, gamma0: 88.8091, nDet: 159, eFrac: 8.1e-67, kind: 'GENUINE', role: 'new' }),
  Object.freeze({ k: 30, gamma0: 101.3179, nDet: 237, eFrac: 5.6e-71, kind: 'GENUINE', role: 'new' }),
  Object.freeze({ k: 35, gamma0: 111.8747, nDet: 338, eFrac: 2.0e-74, kind: 'GENUINE', role: 'new' }),
  Object.freeze({ k: 40, gamma0: 122.9468, nDet: 449, eFrac: 2.7e-76, kind: 'GENUINE', role: 'zero-40 now DETECTED (was N_det >= 400)' }),
]);

// (i) Log-curvature: quadratic-in-log-gamma refit on the extended 9-row ladder (k = 1..40).
export const IMP96364_CURVATURE_PERSISTENCE = Object.freeze({
  form: 'ln N_det = a0 + a1*L + a2*L^2,  L = ln(gamma)',
  a2Baked: 0.366590,   // imp-96347, k = 1..20
  a2Extended: 0.601253, // k = 1..40, real rows added
  strengthens: true,
  subGapResolved: 'SG-96347-curv',
  note: 'positive log-curvature persists and grows with real higher-gamma rows: it is a genuine feature, not a narrow-window artifact.',
});

// (ii) Exponent gap b_det - b_C: single-power height fit, baked vs extended, against b_C.
export const IMP96364_EXPONENT_GAP = Object.freeze({
  form: 'N_det = A * gamma^b',
  bDetBaked: 1.271686,   // k = 1..20 (imp-96149 / imp-96346)
  bDetExtended: 1.683402, // k = 1..40
  r2Baked: 0.975997,
  r2Extended: 0.952980,  // single power can no longer absorb the convexity
  bChristoffel: 1.248736, // imp-96182
  gapBaked: 0.022950,
  gapExtended: 0.434666,
  signPositive: true,
  subGapResolved: 'IMP96346_EXPONENT_GAP_PERSISTENCE',
  note: 'exponent gap is decisively positive with real data; +0.02295 was a small-window lower estimate. The rising exponent and curvature mean the reach is convex (no single asymptotic power exponent over this window), so the certified statement is the qualitative sign b_det > b_C (divergent N_det/N_C), not a fixed asymptote.',
});

export const IMP96364_VERDICT =
  'Fresh Route L detector rows past k = 20 (delta = 0.1, dps = 180, NMAX = 700): k = 20 '
  + 'reproduces the baked N_det = 107 exactly, and four new GENUINE rows land at k = 25/30/35/40 '
  + '-> N_det = 159/237/338/449, with zero 40 now DETECTED at 449 (was only bounded >= 400, and '
  + 'above the imp-96347 curvature forecast 278.4). (i) The imp-96347 log-curvature PERSISTS and '
  + 'STRENGTHENS: the quadratic-in-log a2 rises from +0.3666 (k=1..20) to +0.6013 (k=1..40), '
  + 'resolving SG-96347-curv -- the positive curvature is genuine, not a narrow-window artifact. '
  + '(ii) The imp-96346 exponent gap is DECISIVELY POSITIVE: the single-power height exponent rises '
  + 'from 1.2717 to 1.6834, so b_det - b_C grows from +0.02295 to +0.4347 (b_C = 1.2487), resolving '
  + 'IMP96346_EXPONENT_GAP_PERSISTENCE in favor of the divergence verdict N_det/N_C -> +infinity; '
  + 'the +0.02295 was a small-window lower estimate. HONEST LIMIT: the rising exponent/curvature mean '
  + 'the reach is convex (no single asymptotic power over gamma <= 123 at one delta), so the certified '
  + 'result is the qualitative sign (b_det > b_C), not a fixed asymptotic exponent. Measurement only; '
  + 'changes NO bound; verified-zero route stays cheaper; RH open; no refereed bound is changed; NO QED.';

export const IMP96364_SCRIPTS = Object.freeze(['tmp/imp-96364-detector-highindex.py']);
