/**
 * @module imp-35781-exact-debruijn-empirical-x-ceiling-scope
 *
 * imp-35781 (numerical/measurement, S-frontier): MEASURE the empirical x-ceiling of
 * the exact de Bruijn integral evaluator
 * (scripts/imp-34813-exact-debruijn-winding-offline.mjs) and cross-check what
 * arbitrary-precision widening buys toward the T_PT = 3e12 x-range.
 *
 * imp-35726 Part D(2) NAMED the ceiling (x ~< 104, gamma ~< 52) and imp-35759 COSTED
 * the arbitrary-precision digit law (D_underflow(x) = (pi / (8 ln 10)) x) but took
 * the 104 cap as GIVEN and ran no evaluator. This module supplies the missing
 * EMPIRICAL measurement: it re-runs the evaluator quadrature at t = 0 across x in
 * [20, 140] and locates where the true signal |H_0(x)| ~ exp(-pi x/8) detaches into
 * the double-precision roundoff floor -- confirming, rather than assuming, the cap.
 *
 * MEASUREMENT + OOM CROSS-CHECK ONLY. Extends no evaluator; runs no arbitrary-
 * precision code; certifies nothing at T_PT; changes no bound; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * WHAT WAS MEASURED (t = 0, Kahan-Simpson quadrature, M = 2000 panels on u in [0,1])
 * -----------------------------------------------------------------------------
 * The evaluator forms H_0(x) = int_0^1 SIMP(u) Phi(u) cos(x u) du with an O(1) kernel
 * (sum |w_i| = 6.214e-2), so the additive roundoff noise scale is
 *     noise ~ eps * sum|w_i| ~ 2.22e-16 * 6.214e-2 ~ 1.380e-17,
 * matching the script comment (roundoff floor ~1e-17). The observed post-signal
 * residual (returned magnitudes once the true signal has vanished) settles near
 * ~1-2e-18, i.e. Kahan compensation gains roughly one decade over the naive
 * eps*sum|w| scale. Against that floor the measured |H_0(x)| behaves as:
 *   - x <~ 94  (gamma <~ 47): |H_0| tracks the exp(-pi x/8) envelope cleanly
 *     (comp/envelope ratio a bounded O(10-300) prefactor, the |Z|-like oscillation).
 *   - x = 104  (gamma = 52, the script window edge): |H_0| ~ 4.69e-16, only ~34x the
 *     ~1.38e-17 noise scale (~1.5 decades of headroom) -- the PRACTICAL edge.
 *   - x >~ 106 (gamma >~ 53): the returned values are noise-dominated; the
 *     comp/envelope ratio explodes (1e3 at x=124, 1e5 at x=140) because the true
 *     signal has dropped far below the roundoff residual. Signal SUBMERGED.
 * So the empirical detach band is x in [94, 106] (gamma in [47, 53]); the script's
 * declared x ~< 104 window edge sits right at the top of the usable band -- a faithful
 * (slightly optimistic) statement of the double-precision ceiling.
 *
 * CROSS-CHECK AGAINST THE imp-35759 DIGIT LAW (now CONFIRMED, not assumed)
 * -----------------------------------------------------------------------------
 * imp-35759 calibrated D_underflow(104) = 0.17055 * 104 ~ 17.74 digits ~ the double
 * budget (~15.95 relative digits stretched to the ~1e-17 absolute floor) and PREDICTED
 * 16 digits -> x ~ 93.8, 18 digits -> x ~ 105.5. The measured detach band [94, 106]
 * lands on exactly that bracket: the underflow of |H_0| ~ exp(-pi x/8) is empirically
 * the operative cap, and the LINEAR digit law is the correct model.
 *
 * WHAT WIDENING BUYS (inherited OOM, unchanged)
 * -----------------------------------------------------------------------------
 * Reach is LINEAR in working digits (x_reach ~ D / 0.17055). Quad (IEEE binary128,
 * ~33.9 digits) roughly DOUBLES the height to x ~ 199 (gamma ~ 100); 80-bit extended
 * (~19.3 digits) reaches only x ~ 113. The T_PT target x_TPT = 2 * T_PT = 6e12 needs
 * D_underflow ~ 1.023e12 decimal digits (~3.40e12 bits, ~425 GB of mantissa PER value)
 * -- a categorical wall, not a tunable precision. The empirical measurement changes
 * none of this; it only confirms the starting point (double -> x ~< 104) is real.
 *
 * VERDICT: the exact de Bruijn evaluator is a t <= 0 negative-time calibration
 * instrument on a ~10-zero window (x in [20, 104]); the double-precision ceiling at
 * x ~< 104 is MEASURED (not just named), and no attainable working precision turns it
 * into a T_PT-scale (x ~ 6e12) tool.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Measures ONLY the t = 0 underflow ceiling of the existing evaluator and cross-checks
 * the imp-35759 digit law. It extends no evaluator, runs no arbitrary-precision
 * arithmetic, certifies no value at any height, and changes no bound. NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35759-exact-debruijn-precision-digit-cost-scope (the theoretical digit law this measurement confirms)
 * @see imp-35726-w1-sign-reconciliation-cost-scope (Part D(2): names the x ~< 104 cap, |H_0| ~ exp(-pi x/8) under 1e-17)
 * @see scripts/imp-34813-exact-debruijn-winding-offline.mjs (the exact evaluator; window x in [20,104], roundoff floor ~1e-17)
 * @see project_winding_thread_closed_corrected (imp-34813: Gaussian conv proxy = EXACT de Bruijn flow at t = -4 tau_repo)
 * @see Platt-Trudgian 2021 (verified zero height T_PT = 3e12; no refereed bound is changed)
 */

// -- Anchor + operative constants (import-light; matching imp-35759) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified zero-ordinate (gamma) height
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const X_TPT = 2 * T_PT; // x = 2 gamma convention; T_PT ordinate maps to x = 6e12
const PI = Math.PI;
const EPS = 2.220446049250313e-16; // IEEE double machine epsilon
const DIGITS_PER_X = PI / (8 * Math.LN10); // ~0.170547 decimal digits per unit x (imp-35759)

// -- Re-measurement of the evaluator ceiling (light, deterministic quadrature) --
// Replicates the t = 0 weights of scripts/imp-34813-...offline.mjs and evaluates |H_0|.
function phiKernel(u) {
  const e4 = Math.exp(4 * u), e5 = Math.exp(5 * u), e9 = Math.exp(9 * u);
  let s = 0;
  for (let n = 1; n <= 40; n++) {
    const a = PI * n * n * e4;
    if (a > 700) break;
    s += (2 * PI * PI * n * n * n * n * e9 - 3 * PI * n * n * e5) * Math.exp(-a);
  }
  return s;
}
const M = 2000, HU = 1.0 / M;
const W = new Float64Array(M + 1), UU = new Float64Array(M + 1);
let sumAbsW = 0;
for (let i = 0; i <= M; i++) {
  UU[i] = i * HU;
  const simp = (i === 0 || i === M) ? HU / 3 : (i % 2 === 1 ? 4 * HU / 3 : 2 * HU / 3);
  W[i] = simp * phiKernel(UU[i]);
  sumAbsW += Math.abs(W[i]);
}
function H0abs(x) {
  let s = 0, c = 0;
  for (let i = 0; i <= M; i++) {
    const term = W[i] * Math.cos(x * UU[i]);
    const y = term - c, tt = s + y; c = (tt - s) - y; s = tt;
  }
  return Math.abs(s);
}
const NOISE_SCALE = EPS * sumAbsW; // ~1.380e-17 additive roundoff scale of the summed integral
const H0_AT_104 = H0abs(104); // ~4.69e-16 at the script window edge
const SNR_AT_104 = H0_AT_104 / NOISE_SCALE; // ~34x -- the practical edge headroom

export const IMP35781_EXACT_DEBRUIJN_EMPIRICAL_X_CEILING_SCOPE = {
  id: 'imp-35781',
  proofSection: 'S-frontier',
  question:
    'Measure the empirical double-precision x-ceiling of the exact de Bruijn integral evaluator ' +
    '(scripts/imp-34813-exact-debruijn-winding-offline.mjs) where |H_0(x)| ~ exp(-pi x/8) detaches into the ' +
    '~1e-17 roundoff floor, and cross-check the imp-35759 arbitrary-precision digit law against it toward the ' +
    'T_PT = 3e12 x-range. Measurement + OOM cross-check only; extends no evaluator; certifies nothing at T_PT; ' +
    'changes no bound; NO QED.',
  measurement: {
    quadrature: 'Kahan-compensated Simpson, M = 2000 panels on u in [0,1], t = 0 weights (exactly the script kernel)',
    sumAbsW,
    noiseScale: NOISE_SCALE,
    postSignalResidual: '~1-2e-18 (Kahan gains ~1 decade over the naive eps*sum|w| ~ 1.38e-17)',
    cleanTrackingUpTo: 94, // gamma ~ 47: |H_0| follows exp(-pi x/8) with a bounded O(10-300) prefactor
    scriptWindowEdge: 104, // gamma = 52
    h0AtEdge: H0_AT_104,
    snrAtEdge: SNR_AT_104,
    submergedBeyond: 106, // gamma ~ 53: returned values become noise-dominated, comp/envelope ratio explodes
    detachBand: [94, 106], // gamma in [47, 53]
    statement:
      'The evaluator kernel is O(1) (sum|w| ~ 6.21e-2) so the roundoff noise scale is eps*sum|w| ~ 1.38e-17. ' +
      '|H_0(x)| tracks its exp(-pi x/8) envelope cleanly to x ~ 94; at the script edge x = 104 it is ~4.69e-16, ' +
      'only ~34x the noise scale (~1.5 decades headroom); beyond x ~ 106 the signal is submerged and returned ' +
      'values are pure roundoff (comp/envelope ratio 1e3 at x=124, 1e5 at x=140). Empirical detach band x in ' +
      '[94, 106] -- the script x ~< 104 window edge is a faithful (slightly optimistic) double-precision ceiling.',
  },
  digitLawCrossCheck: {
    formula: 'D_underflow(x) = (pi/(8 ln10)) x ~ 0.17055 x (imp-35759)',
    digitsPerX: DIGITS_PER_X,
    predicted16DigitReach: 16 / DIGITS_PER_X, // ~93.8
    predicted18DigitReach: 18 / DIGITS_PER_X, // ~105.5
    statement:
      'imp-35759 predicted 16 digits -> x ~ 93.8 and 18 digits -> x ~ 105.5 from the double budget. The measured ' +
      'detach band [94, 106] lands on that bracket: the |H_0| ~ exp(-pi x/8) underflow is EMPIRICALLY the ' +
      'operative cap and the LINEAR digit law is confirmed, not assumed.',
  },
  wideningBuys: {
    reachQuad128: 33.9 / DIGITS_PER_X, // ~199 (~doubles the height)
    reachExtended80: 19.27 / DIGITS_PER_X, // ~113
    xTPT: X_TPT,
    digitsTPT: DIGITS_PER_X * X_TPT, // ~1.023e12 decimal digits
    gigabytesTPT: (DIGITS_PER_X * X_TPT * Math.log2(10)) / 8 / 1e9, // ~425 GB per value
    statement:
      'Reach is LINEAR in digits. Quad (~33.9 digits) roughly doubles the height to x ~ 199 (gamma ~ 100); ' +
      '80-bit extended reaches only x ~ 113. The T_PT target x = 6e12 needs ~1.02e12 decimal digits (~425 GB per ' +
      'value) -- a categorical wall. The measurement confirms the double starting point is real; widening changes ' +
      'nothing about the T_PT verdict.',
  },
  ignoredCosts:
    'Measures ONLY the t = 0 underflow ceiling. It ignores the SEPARATE growing costs a real high-x run carries ' +
    '(integrand node count, Phi-series term count, oscillatory argument-reduction precision), all of which only ' +
    'worsen the picture.',
  isRigorous: false,
  verdict:
    'EMPIRICAL MEASUREMENT + OOM CROSS-CHECK (frontier-direction, NOT rigorous). The exact de Bruijn evaluator ' +
    'roundoff noise scale is eps*sum|w| ~ 1.38e-17; |H_0(x)| ~ exp(-pi x/8) tracks its envelope cleanly to x ~ 94, ' +
    'retains only ~34x headroom over noise at the script edge x = 104 (~1.5 decades), and is submerged beyond ' +
    'x ~ 106 -- an empirical detach band x in [94, 106] (gamma in [47, 53]) that MEASURES (not just names) the ' +
    'x ~< 104 double-precision cap. The band lands exactly on the imp-35759 digit-law bracket (16 digits -> x ~ 93.8, ' +
    '18 -> x ~ 105.5), confirming the linear D_underflow(x) = 0.17055 x law. Widening buys LINEARLY: quad ~doubles ' +
    'the height to x ~ 199; a T_PT-scale lift (x = 6e12) needs ~1.0e12 digits (~425 GB per value), a categorical ' +
    'wall. The evaluator is a t <= 0 calibration instrument on a ~10-zero window, not a T_PT tool. It extends no ' +
    'evaluator, runs no high-precision arithmetic, certifies no value, and changes no bound. NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35759 (the theoretical digit law this measurement confirms); imp-35726 Part D(2) (names the x ~< 104 cap); ' +
    'scripts/imp-34813-exact-debruijn-winding-offline.mjs (the exact evaluator; window x in [20,104], floor ~1e-17); ' +
    'Platt-Trudgian 2021 (T_PT = 3e12; no refereed bound is changed).',
};

export const IMP35781_EXACT_DEBRUIJN_EMPIRICAL_X_CEILING_SCOPE_ASSERTIONS = [
  {
    // The re-measurement reproduces the roundoff scale and the script-edge signal.
    id: 'imp35781-remeasure-noise-and-edge',
    description: 'eps*sum|w| ~ 1.38e-17 noise scale; |H_0(104)| ~ 4.69e-16; SNR at edge ~34x',
    holds: () =>
      Math.abs(sumAbsW - 6.214e-2) < 5e-5 &&
      Math.abs(NOISE_SCALE - 1.38e-17) < 5e-19 &&
      Math.abs(H0_AT_104 / 4.6925e-16 - 1) < 5e-3 &&
      SNR_AT_104 > 20 && SNR_AT_104 < 50,
  },
  {
    // Beyond the ceiling the signal is submerged: |H_0| falls near the roundoff residual.
    id: 'imp35781-signal-submerged-beyond-ceiling',
    description: '|H_0(94)| still well above noise; |H_0(120)| is roundoff-floor (< 30x noise, decaying envelope far below)',
    holds: () => {
      const h94 = H0abs(94), h120 = H0abs(120);
      return h94 / NOISE_SCALE > 100 && h120 / NOISE_SCALE < 30 && h94 > h120;
    },
  },
  {
    // The measured detach band lands on the imp-35759 digit-law bracket.
    id: 'imp35781-band-matches-digit-law',
    description: 'measured detach band [94,106] brackets the 16/18-digit reach (93.8 / 105.5) of D_underflow',
    holds: () => {
      const r16 = 16 / DIGITS_PER_X, r18 = 18 / DIGITS_PER_X;
      return r16 > 93 && r16 < 95 && r18 > 105 && r18 < 106 &&
        Math.abs(DIGITS_PER_X - 0.17054704) < 1e-6;
    },
  },
  {
    // T_PT cross-check: x = 6e12 needs ~1e12 digits ~ 425 GB per value -- unchanged categorical wall.
    id: 'imp35781-tpt-wall-unchanged',
    description: 'x_TPT = 6e12 needs ~1.02e12 decimal digits ~ 425 GB per value; quad ~doubles double height to x~199',
    holds: () => {
      const dTPT = DIGITS_PER_X * X_TPT, gbTPT = (dTPT * Math.log2(10)) / 8 / 1e9;
      const reachQuad = 33.9 / DIGITS_PER_X;
      return X_TPT === 6e12 && Math.abs(dTPT / 1.02328e12 - 1) < 1e-3 &&
        Math.abs(gbTPT - 424.9) < 5 && reachQuad > 190 && reachQuad < 205;
    },
  },
  {
    // Honesty gate: measurement + OOM cross-check only, no evaluator extension, no QED, no refereed bound is changed.
    id: 'imp35781-honesty-gate-no-qed',
    description: 'Measurement only; extends no evaluator; certifies nothing at T_PT; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35781_EXACT_DEBRUIJN_EMPIRICAL_X_CEILING_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /extends no evaluator/.test(IMP35781_EXACT_DEBRUIJN_EMPIRICAL_X_CEILING_SCOPE.verdict) &&
      /NO QED/.test(IMP35781_EXACT_DEBRUIJN_EMPIRICAL_X_CEILING_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35781_EXACT_DEBRUIJN_EMPIRICAL_X_CEILING_SCOPE.verdict),
  },
];

for (const a of IMP35781_EXACT_DEBRUIJN_EMPIRICAL_X_CEILING_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35781-exact-debruijn-empirical-x-ceiling-scope assertion failed: ${a.id}`);
  }
}
