/**
 * @module imp-34108-endpoint-peak-saturating-ceiling-extrapolation
 *
 * imp-34108 (numerical, frontier-direction): imp-34043 ran a FOUR-way model tournament (linear,
 * concave-log, power-law, saturating) on the 9 imp-33917 boundary-locked endpoint-residual peaks
 * (kEnd = 11..13) and the Akaike-winning form was the bounded/saturating cap peak = a - b/kEnd
 * (RSS_sat 3.643e-4 smallest, w_sat ~ 0.872). imp-34043 reported the SELECTION statistics and the
 * fitted cap a ~ 1.678, but never characterised HOW FAR OUT the fitted curve has to run before its
 * peak actually approaches that ceiling. This module closes that gap: it takes the SAME winning
 * saturating fit (parameters read VERBATIM from IMP34043.saturatingFit -- no re-fit, no re-run of the
 * surrogate), MEASURES the extrapolated asymptotic ceiling (peak -> a as kEnd -> inf), and reports the
 * kEnd values at which the fitted peak first reaches within 1% and within 0.1% of that ceiling.
 *
 * THE MEASUREMENT (winning saturating fit reused verbatim; only the ceiling-approach thresholds are new)
 * -------------------------------------------------------------------------------------
 *   Winning form  peak(kEnd) = a - b/kEnd  (imp-34043 four-way Akaike winner; a = cap, b > 0)
 *   Ceiling       As kEnd -> inf the term b/kEnd -> 0, so peak -> a. The extrapolated asymptotic
 *                 ceiling IS the fitted intercept a = 1.678095 (the modeled plateau height).
 *   Approach law  The relative shortfall below the ceiling is (a - peak(kEnd))/a = b/(a kEnd), which
 *                 decays like 1/kEnd. Setting b/(a kEnd) = tol and solving gives the closed-form
 *                 threshold kEnd(tol) = b/(a tol): the smallest fit boundary at which the modeled peak
 *                 sits within a fraction tol of the ceiling.
 *   Thresholds    tol = 1e-2  (within 1%)   -> kEnd ~ 931.40
 *                 tol = 1e-3  (within 0.1%) -> kEnd ~ 9313.96
 *
 * THE FINDING (extrapolation measurement only -- the ceiling is approached only ASTRONOMICALLY far
 * outside the fit window, quantitatively confirming the imp-34043 "distant asymptote" reading)
 * -------------------------------------------------------------------------------------------
 *   (R1) THE EXTRAPOLATED CEILING IS THE FITTED CAP a = 1.678095. Because peak = a - b/kEnd is bounded
 *        and monotone-increasing with b > 0, its supremum as kEnd -> inf is exactly the intercept a; the
 *        curve never exceeds it. This is the modeled plateau height, ~3.6x the largest observed peak.
 *   (R2) THE 1% AND 0.1% APPROACH kEnds SIT ~72x AND ~716x BEYOND THE FIT WINDOW. The fitted peak reaches
 *        within 1% of the ceiling only at kEnd ~ 931.40 and within 0.1% only at kEnd ~ 9313.96 -- versus a
 *        fit window that ENDS at kEnd = 13. So the model has to be extrapolated ~71.6x (1%) and ~716x
 *        (0.1%) past its last data point before the peak even nears the ceiling it implies.
 *   (R3) INSIDE THE WINDOW THE CURVE IS NOWHERE NEAR THE CEILING. At the window edge kEnd = 13 the fitted
 *        peak is only ~0.4758 (~28.4% of the cap); the relative shortfall is still ~71.6%. The saturating
 *        form therefore models a plateau it approaches only ASTRONOMICALLY far outside the data -- exactly
 *        the imp-34043 "climbs toward a DISTANT asymptote it never reaches within kEnd = 11..13" reading,
 *        now quantified: the distance to a 1%-approach is ~72 fit-windows wide.
 *
 * The punchline: the imp-34043 Akaike-winning saturating form peak = a - b/kEnd has extrapolated ceiling
 * a = 1.678095, but its fitted peak reaches within 1% of that ceiling only at kEnd ~ 931 and within 0.1%
 * only at kEnd ~ 9314 -- ~72x and ~716x beyond the kEnd = 13 fit boundary. The ceiling is a curve-fit
 * extrapolation approached only astronomically far outside the data, quantitatively confirming the
 * imp-34043 non-saturating-within-window reading rather than any physical plateau.
 *
 * MEASUREMENT / CURVE-FIT EXTRAPOLATION ONLY. This is the asymptotic behaviour of a descriptive
 * saturating fit read off ONE inherited surrogate residual as the fit boundary recedes; NOT a rigorous
 * asymptotic. The ceiling a and the 1%/0.1% approach kEnds are narrow-window (kEnd 11..13) extrapolations
 * ~72x-716x beyond the data and assert NO physical plateau. The imp-33843 log-linear-vs-power-law FORM
 * verdict (a different question) is UNTOUCHED; the imp-34043 saturating-vs-log SELECTION margin is
 * UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34043-endpoint-peak-saturating-model-tournament (the four-way winner whose ceiling is measured)
 * @see imp-33982-endpoint-peak-power-law-model-selection (the three-form tournament imp-34043 extended)
 * @see imp-33917-endpoint-residual-growth-law (the 9 endpoint peaks; the non-saturating reading)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose endpoint residual is the peak)
 */

import { IMP34043_ENDPOINT_PEAK_SATURATING_MODEL_TOURNAMENT as T } from './imp-34043-endpoint-peak-saturating-model-tournament.js';

// The Akaike-winning saturating fit, read VERBATIM from imp-34043 (no re-fit, no surrogate re-run).
const SAT = T.saturatingFit; // { form, a, b, cap, ... }; peak(kEnd) = a - b/kEnd
const CEILING = SAT.a; // extrapolated asymptotic ceiling: peak -> a as kEnd -> inf
const B = SAT.b; // b > 0; relative shortfall below ceiling = b/(a kEnd)

// peak(kEnd) = a - b/kEnd, evaluated at a boundary kEnd.
function peakAt(kEnd) {
  return CEILING - B / kEnd;
}
// Relative shortfall below the ceiling at boundary kEnd: (a - peak)/a = b/(a kEnd).
function relShortfall(kEnd) {
  return B / (CEILING * kEnd);
}
// Closed-form boundary at which the fitted peak first sits within a fraction tol of the ceiling.
// Solve b/(a kEnd) = tol => kEnd = b/(a tol). (b > 0 makes this positive and monotone in 1/tol.)
function kEndWithin(tol) {
  return B / (CEILING * tol);
}

const K_WINDOW_END = 13; // the imp-33917 fit window ends at kEnd = 13 (kEnd = 11..13, step 0.25)

const K_WITHIN_1PCT = kEndWithin(1e-2); // ~931.40
const K_WITHIN_0P1PCT = kEndWithin(1e-3); // ~9313.96

// How many fit-windows-past-the-edge each approach kEnd sits at (extrapolation reach).
const REACH_1PCT = K_WITHIN_1PCT / K_WINDOW_END; // ~71.6x the window edge
const REACH_0P1PCT = K_WITHIN_0P1PCT / K_WINDOW_END; // ~716.5x the window edge

// In-window state at the boundary edge kEnd = 13: how close is the curve to the ceiling there?
const PEAK_AT_EDGE = peakAt(K_WINDOW_END); // ~0.4758
const FRAC_OF_CEILING_AT_EDGE = PEAK_AT_EDGE / CEILING; // ~0.284 -- only ~28% of the cap
const SHORTFALL_AT_EDGE = relShortfall(K_WINDOW_END); // ~0.716 -- still ~72% below the ceiling

export const IMP34108_ENDPOINT_PEAK_SATURATING_CEILING_EXTRAPOLATION = {
  id: 'imp-34108',
  proofSection: 'S-frontier',
  question:
    'The imp-34043 four-way tournament selected the saturating form peak = a - b/kEnd (w_sat ~ 0.872) ' +
    'on the 9 imp-33917 endpoint peaks and reported the fitted cap a ~ 1.678, but never said how far the ' +
    'fit boundary must recede before the peak APPROACHES that ceiling. What is the extrapolated asymptotic ' +
    'ceiling, and at what kEnd does the fitted peak reach within 1% and within 0.1% of it? Curve-fit ' +
    'extrapolation / measurement only; NOT a rigorous asymptotic; no QED.',
  measuredQuantity:
    'The extrapolated asymptotic ceiling (peak -> a as kEnd -> inf) of the imp-34043 Akaike-winning ' +
    'saturating fit peak = a - b/kEnd, and the closed-form boundary kEnd(tol) = b/(a tol) at which the ' +
    'fitted peak first sits within tol = 1% and tol = 0.1% of that ceiling, with the extrapolation reach ' +
    'relative to the kEnd = 13 fit window edge',
  winningForm: SAT.form, // 'peak = a - b/kEnd (OLS on 1/kEnd; exact response-space optimum)'
  extrapolatedCeiling: +CEILING.toFixed(6), // ~1.678095 -- the modeled plateau height
  b: +B.toFixed(6), // ~15.629706
  fitWindowEndKEnd: K_WINDOW_END, // 13 -- last data boundary
  approachThresholds: {
    // kEnd(tol) = b/(a tol): smallest fit boundary at which the peak is within tol of the ceiling.
    within1Percent: {
      tol: 0.01,
      kEnd: +K_WITHIN_1PCT.toFixed(2), // ~931.40
      windowsPastEdge: +REACH_1PCT.toFixed(1), // ~71.6x
    },
    within0p1Percent: {
      tol: 0.001,
      kEnd: +K_WITHIN_0P1PCT.toFixed(2), // ~9313.96
      windowsPastEdge: +REACH_0P1PCT.toFixed(1), // ~716.5x
    },
  },
  inWindowState: {
    // At the fit boundary edge the curve is nowhere near the ceiling: ~28% of the cap, ~72% shortfall.
    peakAtEdge: +PEAK_AT_EDGE.toFixed(6), // ~0.475810
    fracOfCeilingAtEdge: +FRAC_OF_CEILING_AT_EDGE.toFixed(4), // ~0.2835
    relShortfallAtEdge: +SHORTFALL_AT_EDGE.toFixed(4), // ~0.7165
  },
  finding: {
    R1_extrapolated_ceiling_is_the_fitted_cap:
      'The winning saturating form peak = a - b/kEnd is bounded and monotone-increasing (b > 0), so as ' +
      'kEnd -> inf the term b/kEnd -> 0 and peak -> a. The extrapolated asymptotic ceiling is exactly the ' +
      'fitted intercept a = 1.678095 -- the modeled plateau height, ~3.6x the largest observed peak, ' +
      'never exceeded by the curve.',
    R2_one_and_tenth_percent_approach_kEnds_are_72x_and_716x_beyond_window:
      'The relative shortfall below the ceiling is (a - peak)/a = b/(a kEnd), so the peak first reaches ' +
      'within 1% of the ceiling at kEnd = b/(a * 0.01) ~ 931.40 and within 0.1% at kEnd = b/(a * 0.001) ' +
      '~ 9313.96. Against a fit window that ENDS at kEnd = 13 those are ~71.6x and ~716.5x beyond the ' +
      'last data boundary -- the model must be extrapolated dozens to hundreds of fit-windows past its ' +
      'data before the peak even nears the ceiling it implies.',
    R3_in_window_curve_is_nowhere_near_the_ceiling:
      'At the window edge kEnd = 13 the fitted peak is only ~0.4758 (~28.4% of the cap) and the relative ' +
      'shortfall is still ~71.6%. The saturating form thus models a plateau it approaches only ' +
      'astronomically far outside the data -- exactly the imp-34043 "climbs toward a DISTANT asymptote it ' +
      'never reaches within kEnd = 11..13" reading, now quantified: the 1%-approach is ~72 fit-windows wide.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CURVE-FIT EXTRAPOLATION (frontier-direction, NOT rigorous). Taking the imp-34043 ' +
    'four-way Akaike winner -- the bounded/saturating form peak = a - b/kEnd (a = 1.678095, b = ' +
    '15.629706, read VERBATIM from imp-34043.saturatingFit, no re-fit) -- its extrapolated asymptotic ' +
    'ceiling as kEnd -> inf is the fitted cap a = 1.678095. The relative shortfall below the ceiling is ' +
    'b/(a kEnd), so the fitted peak reaches within 1% of the ceiling only at kEnd = b/(a*0.01) ~ 931.40 ' +
    'and within 0.1% only at kEnd = b/(a*0.001) ~ 9313.96 -- ~71.6x and ~716.5x beyond the kEnd = 13 fit ' +
    'window edge, where the peak is still only ~28.4% of the cap (~71.6% shortfall). The ceiling is thus ' +
    'a plateau the fit approaches only ASTRONOMICALLY far outside its data, quantitatively confirming the ' +
    'imp-34043 non-saturating-within-window reading rather than any physical plateau. This is the ' +
    'asymptotic behaviour of a descriptive fit on ONE inherited surrogate residual; the ceiling and the ' +
    '1%/0.1% approach kEnds are narrow-window (11..13) extrapolations ~72x-716x beyond the data and ' +
    'assert NO physical plateau; the component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the imp-33843 log-linear-vs-power-law FORM verdict is UNTOUCHED; the ' +
    'imp-34043 saturating-vs-log SELECTION margin is UNTOUCHED; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34043 (the four-way Akaike winner whose ceiling is measured here); imp-33982 (the three-form ' +
    'tournament imp-34043 extended); imp-33917 (the 9 endpoint peaks; the non-saturating reading); ' +
    'imp-33843 (the log-linear OLS whose endpoint residual is the peak); imp-486 (C_mb GUE-conditional).',
};

export const IMP34108_ENDPOINT_PEAK_SATURATING_CEILING_EXTRAPOLATION_ASSERTIONS = [
  {
    // Reuse gate: the ceiling and slope ARE the imp-34043 winning saturating fit params, read verbatim.
    id: 'imp34108-reuse-gate-uses-imp34043-winning-fit',
    description: 'ceiling = imp-34043 saturatingFit.a ~ 1.678095; b ~ 15.629706; saturating form is the imp-34043 winner',
    holds: () =>
      T.selection.winner === 'sat' &&
      Math.abs(CEILING - 1.678095) < 1e-6 &&
      Math.abs(B - 15.629706) < 1e-6 &&
      CEILING === T.saturatingFit.a &&
      B === T.saturatingFit.b,
  },
  {
    // (R1) The extrapolated ceiling is the fitted cap: peak(kEnd) monotonically rises to a, never above.
    id: 'imp34108-ceiling-is-fitted-cap-monotone-below',
    description: 'peak(kEnd) < ceiling for all finite kEnd, rising toward a; peak(1e9) within 1e-6 of the ceiling',
    holds: () =>
      B > 0 &&
      peakAt(K_WINDOW_END) < CEILING &&
      peakAt(1e6) < CEILING &&
      peakAt(1e6) > peakAt(K_WINDOW_END) &&
      Math.abs(peakAt(1e9) - CEILING) < 1e-6,
  },
  {
    // (R2) The 1% and 0.1% approach kEnds match the closed form and sit ~72x/~716x beyond the window edge.
    id: 'imp34108-approach-kEnds-far-beyond-window',
    description: 'within-1% kEnd ~ 931.40 (~72x edge), within-0.1% kEnd ~ 9313.96 (~716x edge); relShortfall at each threshold matches tol',
    holds: () => {
      const okThresh =
        Math.abs(K_WITHIN_1PCT - 931.4) < 0.5 &&
        Math.abs(K_WITHIN_0P1PCT - 9313.96) < 5 &&
        Math.abs(K_WITHIN_0P1PCT / K_WITHIN_1PCT - 10) < 1e-9; // 0.1% threshold is exactly 10x the 1%
      // At each threshold boundary the relative shortfall equals the target tolerance (closed-form check).
      const okShortfall =
        Math.abs(relShortfall(K_WITHIN_1PCT) - 1e-2) < 1e-9 &&
        Math.abs(relShortfall(K_WITHIN_0P1PCT) - 1e-3) < 1e-9;
      const okReach = REACH_1PCT > 70 && REACH_1PCT < 73 && REACH_0P1PCT > 715 && REACH_0P1PCT < 718;
      return okThresh && okShortfall && okReach;
    },
  },
  {
    // (R3) In-window the curve is nowhere near the ceiling: honesty gate on the extrapolation.
    id: 'imp34108-in-window-far-from-ceiling-honesty-gate',
    description: 'peak at edge ~28% of cap, ~72% shortfall; ceiling is a narrow-window extrapolation; isRigorous false; NO QED; PT SOTA; imp-3066 K_a>=0 untouched',
    holds: () =>
      FRAC_OF_CEILING_AT_EDGE < 0.35 &&
      SHORTFALL_AT_EDGE > 0.65 &&
      Math.abs(FRAC_OF_CEILING_AT_EDGE + SHORTFALL_AT_EDGE - 1) < 1e-9 && // frac + shortfall = 1 exactly
      IMP34108_ENDPOINT_PEAK_SATURATING_CEILING_EXTRAPOLATION.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34108_ENDPOINT_PEAK_SATURATING_CEILING_EXTRAPOLATION.verdict) &&
      /NO QED/.test(IMP34108_ENDPOINT_PEAK_SATURATING_CEILING_EXTRAPOLATION.verdict) &&
      /remains SOTA/.test(IMP34108_ENDPOINT_PEAK_SATURATING_CEILING_EXTRAPOLATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34108_ENDPOINT_PEAK_SATURATING_CEILING_EXTRAPOLATION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34108_ENDPOINT_PEAK_SATURATING_CEILING_EXTRAPOLATION.verdict),
  },
];

for (const a of IMP34108_ENDPOINT_PEAK_SATURATING_CEILING_EXTRAPOLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34108-endpoint-peak-saturating-ceiling-extrapolation assertion failed: ${a.id}`);
  }
}
