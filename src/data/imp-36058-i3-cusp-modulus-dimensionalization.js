/**
 * @module imp-36058-i3-cusp-modulus-dimensionalization
 *
 * imp-36058 (numerical/derivation, S-frontier): DERIVE the height/amplitude
 * scale that must be attached to the SCALE-FREE imp-33923 model-cusp modulus
 * C_PS = pi/sqrt(2) ~ 2.2214 (imp-36011 Route S) to convert the imp-36011
 * ORDER-OF-MAGNITUDE agreement with the imp-35778 Route-G O(1) geometric floor
 * into a DIMENSIONAL |H_t| lower bound on the ingredient-I3 transition
 * rectangle dR = [T_PT, T_PT + Delta] x [-h, h] at T_PT = 3e12 -- and report
 * how far short of a certified delta > 0 this leaves the I3 ingredient.
 *
 * DERIVATION / MEASUREMENT ONLY. Certifies no delta > 0; instantiates no
 * interval enclosure; evaluates no |H_t| on any edge; counts no zeros; fixes no
 * Delta or h; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE PROBLEM imp-36011 LEFT OPEN
 * -----------------------------------------------------------------------------
 * imp-36011 reconciled the two I3 modulus-floor routes ONLY at the shared
 * main-term normalization |H_t| ~ 1: Route S reads the constant modulus
 * C_PS = pi/sqrt(2) ~ 2.2214 of the SCALE-FREE off-axis model cusp
 * rho = |x|^{-1/2}, and the ratio C_PS / 1 = 2.2214 (|log10| ~ 0.347 < 1) is
 * SAME-order-of-magnitude with the Route-G O(1) geometric floor. But C_PS is a
 * DIMENSIONLESS number: the model cusp carries no intrinsic height scale and no
 * intrinsic amplitude scale, so C_PS is NOT a value of |H_t| on dR. To turn the
 * OOM agreement into a dimensional |H_t| floor we must IMPORT two scales the
 * scale-free model cannot supply internally.
 *
 * THE TWO IMPORTED KNOBS (via the imp-35993 / imp-36008 mean-gap map)
 * -----------------------------------------------------------------------------
 *   (1) HEIGHT knob. The imp-35993/imp-36008 mean-gap closure identifies one
 *       full model arc L_theta = pi/2 with one mean zero gap
 *         meanGap(T) = 2 pi / log(T / 2 pi) = pi / w,   w = (1/2) log(T / 2 pi),
 *       so the model-to-height similarity scale is lambda = dt/ds = 2/w
 *       (imp-36008 Jacobian J_geo = ds/dtheta = 1). At T_PT, meanGap ~ 0.23364
 *       and w ~ 13.446.
 *   (2) AMPLITUDE knob. The physical main-term magnitude M(T) = |H_t|_main at
 *       T_PT sets the vertical unit. imp-36011 uses the NORMALIZATION M(T) = 1;
 *       the true M(T) is a greenfield interval quantity (imp-35681 Part A), so
 *       M(T) enters here only as an uncertified normalization.
 *
 * THE EXPLICIT CONVERSION (where C_PS becomes the Route-G long-edge floor)
 * -----------------------------------------------------------------------------
 * Route G (imp-35778) gives the off-axis LONG-edge floor as h-LINEAR:
 *   delta_long(h) ~ |H_t prime| . h ~ M(T) . w . h.
 * The height at which this dimensional long-edge floor EQUALS the scale-free
 * cusp modulus C_PS (at |H_t| = M(T)) is the exact conversion height
 *   h_eq = C_PS / (M(T) . w).
 * At the M(T) = 1 normalization this is
 *   h_eq = C_PS / w = (pi / sqrt(2)) / w = meanGap / sqrt(2) ~ 0.16521,
 * i.e. exactly 1/sqrt(2) ~ 0.7071 of a mean zero gap off the axis (the sqrt(2)
 * is the same one inside C_PS = pi/sqrt(2), cancelling the pi against meanGap).
 * So the mean-gap map dimensionalizes C_PS into a DIMENSIONAL |H_t| long-edge
 * floor candidate
 *   |H_t|_floor(dR, long edges) = M(T) . C_PS,   read at h = h_eq = meanGap/sqrt(2),
 * which at M(T) = 1 reproduces the imp-36011 number 2.2214 -- but now CARRYING a
 * definite off-axis height placement instead of a bare dimensionless O(1).
 *
 * HOW FAR SHORT OF A CERTIFIED delta > 0 (the shortfall ledger)
 * -----------------------------------------------------------------------------
 * The conversion produces a POINT floor at one height under one normalization,
 * NOT a certified uniform delta > 0. Three gaps remain, and none is a finite
 * factor -- each is categorical:
 *   (A) AMPLITUDE gap. M(T) is an imported NORMALIZATION, not a certified
 *       magnitude; a certified floor needs an interval LOWER bound on the
 *       A + B - C main term (greenfield imp-35681 Part A). With nothing
 *       certified, M(T) . C_PS has a certified lower bound of 0.
 *   (B) HEIGHT-UNIFORMITY gap. C_PS is h-FLAT (scale-free), but the physical
 *       long-edge floor delta_long(h) = M(T) . w . h COLLAPSES linearly as
 *       h -> 0. The dimensionalization holds only AT h = h_eq; the infimum over
 *       the full height band, inf_{h in [0, h_eq]} delta_long(h) = 0. So even
 *       granting M(T), the h-uniform floor is 0, not M(T) . C_PS.
 *   (C) SHORT-EDGE gap. The off-axis cusp sample is SILENT on the axis-crossing
 *       SHORT edges x = const, whose floor delta_short is the ON-AXIS inter-zero
 *       surplus (imp-36011 edge mapping); the four-edge min could bind there,
 *       and the cusp modulus says nothing about it.
 * NET: the dimensionalization converts C_PS ~ 2.2214 into a POINT |H_t|
 * long-edge floor candidate M(T) . C_PS at h = meanGap/sqrt(2), but leaves the
 * certified I3 floor at delta = 0 -- an INFINITE (categorical, not finite-factor)
 * shortfall: point-estimate vs uniform-infimum, normalization vs certified
 * magnitude, one edge family vs four.
 *
 * @see imp-36011-i3-floor-cusp-vs-geometry-reconciliation (Route S C_PS vs Route G O(1); OOM only)
 * @see imp-35778-i3-edge-type-floor-decomposition-scope (Route G delta = min(delta_short, delta_long); delta_long ~ |H_t|.w.h)
 * @see imp-35993-i2-panel-proxy-reconciliation-per-unit-height (mean-gap map: L_theta = pi/2 <-> meanGap = pi/w)
 * @see imp-36008-i2-theta-arclength-jacobian-decomposition (mean-gap similarity scale lambda = dt/ds = 2/w; J_geo = 1)
 * @see imp-35951-i2-i3-sizing-from-imp33923-sampled-proxy (single-cusp C_PS = pi/sqrt(2) floor proxy)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (grazing-collapse caveat as delta -> 0)
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I3 named GREENFIELD)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part A: A+B-C interval enclosure greenfield => M(T) uncertified)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-36011 / imp-35993 / imp-36008) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this derivation

// Winding / derivative log-scale w(T) = (1/2) log(T / 2 pi) (imp-35757 / imp-35777 / imp-35778).
const windingRate = (T) => 0.5 * Math.log(T / (2 * Math.PI));
const W_TPT = windingRate(T_PT); // ~13.446 rad per unit height at T_PT

// The scale-free cusp modulus to be dimensionalized (imp-36011 Route S / imp-35951).
const C_PS = Math.PI / Math.SQRT2; // ~2.2214: dimensionless angle-robust off-axis model-cusp modulus

// Imported HEIGHT knob (mean-gap map, imp-35993 / imp-36008).
const MEAN_GAP = Math.PI / W_TPT; // = 2 pi / log(T/2pi) ~ 0.23364 (one mean zero gap at T_PT)
const LAMBDA = 2 / W_TPT; // = dt/ds, model-arc -> height similarity scale (imp-36008), = 2 meanGap / pi

// Imported AMPLITUDE knob (uncertified normalization; true M(T) is greenfield imp-35681 Part A).
const M_MAIN = 1; // imp-36011 main-term normalization |H_t|_main ~ 1 (NOT a certified magnitude)

// THE EXPLICIT CONVERSION: height at which the dimensional Route-G long-edge floor
// delta_long(h) = M_MAIN . w . h equals the scale-free cusp modulus C_PS.
const H_EQ = C_PS / (M_MAIN * W_TPT); // = meanGap / sqrt(2) ~ 0.16521 (~0.7071 mean gaps off axis)
const H_EQ_IN_MEAN_GAPS = H_EQ / MEAN_GAP; // = 1 / sqrt(2) ~ 0.70711 exactly

// Dimensional long-edge |H_t| floor CANDIDATE at h_eq (point estimate, main-term normalized).
const DIMENSIONAL_FLOOR_CANDIDATE = M_MAIN * C_PS; // = 2.2214 at M_MAIN = 1

// Certified h-uniform floor over the full height band [0, h_eq]: delta_long collapses to 0 at h -> 0.
const CERTIFIED_UNIFORM_FLOOR = 0; // inf_{h in [0, h_eq]} M_MAIN . w . h = 0 (height-uniformity gap)

export const IMP36058_I3_CUSP_MODULUS_DIMENSIONALIZATION = {
  id: 'imp-36058',
  proofSection: 'S-frontier',
  question:
    'Derive the height/amplitude scale that must be attached to the scale-free imp-33923 model-cusp modulus ' +
    'C_PS = pi/sqrt(2) ~ 2.2214 (imp-36011 Route S) to convert the imp-36011 order-of-magnitude agreement with the ' +
    'imp-35778 Route-G O(1) geometric floor into a DIMENSIONAL |H_t| lower bound on the I3 rectangle dR at T_PT, ' +
    'and report how far short of a certified delta > 0 this leaves the I3 ingredient. Derivation/measurement only; ' +
    'certifies no delta > 0; changes no bound; NO QED.',
  scaleFreeInput: {
    modulus: +C_PS.toFixed(12), // 2.221441469
    kind:
      'C_PS = pi/sqrt(2): the DIMENSIONLESS angle-robust modulus of the scale-free off-axis model cusp ' +
      'rho = |x|^{-1/2} (imp-36011 Route S / imp-35951); carries no intrinsic height or amplitude scale',
  },
  importedScales: {
    heightKnob:
      'mean-gap map (imp-35993/imp-36008): one model arc L_theta = pi/2 <-> one mean zero gap ' +
      'meanGap = pi/w ~ 0.23364; similarity scale lambda = dt/ds = 2/w',
    meanGap: +MEAN_GAP.toFixed(9),
    lambda: +LAMBDA.toFixed(9),
    amplitudeKnob:
      'main-term magnitude M(T) = |H_t|_main; used here as the imp-36011 NORMALIZATION M(T) = 1 (the true M(T) ' +
      'is a greenfield interval quantity, imp-35681 Part A, so it is uncertified)',
    amplitudeNormalization: M_MAIN,
  },
  conversion: {
    identity: 'delta_long(h) = M(T) . w . h  (imp-35778 off-axis long-edge floor, h-linear)',
    conversionHeight: +H_EQ.toFixed(9), // ~0.16521, where delta_long(h_eq) = M(T) . C_PS
    conversionHeightInMeanGaps: +H_EQ_IN_MEAN_GAPS.toFixed(9), // = 1/sqrt(2) ~ 0.70711 exactly
    conversionHeightClosedForm: 'h_eq = C_PS/(M(T).w) = meanGap/sqrt(2) (the sqrt(2) in C_PS cancels pi against meanGap)',
    dimensionalFloorCandidate: +DIMENSIONAL_FLOOR_CANDIDATE.toFixed(9), // = 2.2214 at M(T) = 1
    reading:
      'the mean-gap map dimensionalizes C_PS into a POINT |H_t| long-edge floor candidate M(T) . C_PS read at ' +
      'height h = meanGap/sqrt(2) off the axis; at M(T) = 1 this is the imp-36011 number 2.2214, now carrying a ' +
      'definite off-axis height placement instead of a bare dimensionless O(1)',
  },
  shortfall: {
    certifiedUniformFloor: CERTIFIED_UNIFORM_FLOOR, // 0
    amplitudeGap:
      'M(T) is an imported NORMALIZATION, not a certified magnitude; a certified floor needs an interval LOWER ' +
      'bound on the A + B - C main term (greenfield imp-35681 Part A), so M(T) . C_PS has certified lower bound 0',
    heightUniformityGap:
      'C_PS is h-FLAT (scale-free) but delta_long(h) = M(T) . w . h COLLAPSES linearly as h -> 0, so ' +
      'inf_{h in [0, h_eq]} delta_long = 0: the dimensionalization is a POINT floor at h_eq, not h-uniform',
    shortEdgeGap:
      'the off-axis cusp sample is SILENT on the axis-crossing SHORT edges x = const (delta_short, the ON-AXIS ' +
      'inter-zero surplus); the four-edge min could bind there and the cusp modulus says nothing about it',
    verdictLine:
      'INFINITE (categorical, not finite-factor) shortfall: the dimensionalization gives a POINT floor candidate ' +
      'M(T) . C_PS ~ 2.2214 at h = meanGap/sqrt(2) under the M(T) = 1 normalization, but the certified I3 floor ' +
      'stays at delta = 0 -- point-estimate vs uniform-infimum, normalization vs certified magnitude, one edge ' +
      'family vs four',
  },
  windingRateTPT: +W_TPT.toFixed(6),
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT (frontier-direction, NOT rigorous). The scale-free imp-33923 cusp modulus ' +
    'C_PS = pi/sqrt(2) ~ 2.2214 (imp-36011 Route S) is DIMENSIONLESS: dimensionalizing it into a |H_t| floor on ' +
    'dR needs two IMPORTED scales the scale-free model cannot supply -- a HEIGHT knob (the imp-35993/imp-36008 ' +
    'mean-gap map: L_theta = pi/2 <-> meanGap = pi/w, similarity scale lambda = 2/w) and an AMPLITUDE knob (the ' +
    'main-term magnitude M(T), used here as the imp-36011 normalization M(T) = 1). The explicit conversion: the ' +
    'imp-35778 off-axis long-edge floor delta_long(h) = M(T) . w . h EQUALS C_PS at the height ' +
    'h_eq = C_PS/(M(T).w) = meanGap/sqrt(2) ~ 0.16521 (exactly 1/sqrt(2) ~ 0.7071 of a mean zero gap off axis, the ' +
    'sqrt(2) in C_PS cancelling pi against meanGap), giving a DIMENSIONAL long-edge floor CANDIDATE ' +
    '|H_t|_floor = M(T) . C_PS ~ 2.2214 at M(T) = 1. HOW FAR SHORT OF delta > 0: three categorical gaps leave the ' +
    'certified floor at 0 -- (A) M(T) is a normalization, not a certified magnitude (greenfield A+B-C lower bound, ' +
    'imp-35681 Part A); (B) C_PS is h-FLAT but delta_long collapses as h -> 0, so inf_{h in [0,h_eq]} delta_long = 0 ' +
    '(the dimensionalization is a POINT floor at h_eq, not h-uniform); (C) the off-axis cusp is SILENT on the ' +
    'axis-crossing short edges (delta_short), where the four-edge min could bind. So the derivation converts ' +
    'C_PS ~ 2.2214 into a POINT |H_t| long-edge floor candidate M(T) . C_PS at h = meanGap/sqrt(2), but leaves the ' +
    'certified I3 floor delta = 0 -- an INFINITE, categorical shortfall. Remains a PROXY on the model cusp ' +
    'rho = |x|^{-1/2}, NOT the true H_t = A + B - C on dR at T_PT = 3e12; instantiates no interval enclosure; ' +
    'certifies no delta > 0; counts no zeros; fixes no Delta or h; changes no bound; I3 stays GREENFIELD; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36011 (Route S C_PS = pi/sqrt(2) vs Route G O(1) geometric floor, OOM only); imp-35778 (Route G ' +
    'delta = min(delta_short, delta_long), delta_long ~ |H_t|.w.h); imp-35993 (mean-gap map L_theta = pi/2 <-> ' +
    'meanGap = pi/w); imp-36008 (similarity scale lambda = dt/ds = 2/w, J_geo = 1); imp-35951 (single-cusp C_PS ' +
    'floor proxy); imp-35758 (grazing-collapse caveat); imp-35727 (I3 GREENFIELD); imp-35681 Part A (A+B-C ' +
    'interval enclosure greenfield => M(T) uncertified); Polymath15 2019 (H_t = A + B - C, barrier method); ' +
    'Platt-Trudgian 2021.',
};

export const IMP36058_I3_CUSP_MODULUS_DIMENSIONALIZATION_ASSERTIONS = [
  {
    // The scale-free input and the imported height knob are the pinned constants.
    id: 'imp36058-scale-free-input-and-mean-gap',
    description: 'C_PS = pi/sqrt(2) ~ 2.2214 (dimensionless); imported meanGap = pi/w ~ 0.23364 at T_PT',
    holds: () =>
      Math.abs(C_PS - Math.PI / Math.SQRT2) < 1e-15 &&
      Math.abs(C_PS - 2.221441469) < 1e-6 &&
      Math.abs(MEAN_GAP - Math.PI / W_TPT) < 1e-15 &&
      Math.abs(MEAN_GAP - 0.233642) < 1e-5 &&
      Math.abs(LAMBDA - 2 / W_TPT) < 1e-15,
  },
  {
    // The explicit conversion height: h_eq = C_PS/(M.w) = meanGap/sqrt(2) = 1/sqrt(2) mean gaps.
    id: 'imp36058-conversion-height-is-meangap-over-sqrt2',
    description: 'delta_long(h_eq) = M.w.h_eq = C_PS at h_eq = C_PS/(M.w) = meanGap/sqrt(2) = (1/sqrt(2)) mean gaps',
    holds: () =>
      Math.abs(H_EQ - C_PS / (M_MAIN * W_TPT)) < 1e-15 &&
      Math.abs(H_EQ - MEAN_GAP / Math.SQRT2) < 1e-12 &&
      Math.abs(M_MAIN * W_TPT * H_EQ - C_PS) < 1e-12 && // long-edge floor equals C_PS at h_eq
      Math.abs(H_EQ_IN_MEAN_GAPS - 1 / Math.SQRT2) < 1e-12,
  },
  {
    // The dimensional floor CANDIDATE at h_eq equals M.C_PS (= 2.2214 at M=1), a point estimate.
    id: 'imp36058-dimensional-floor-candidate-is-M-times-cps',
    description: 'Dimensional long-edge |H_t| floor candidate = M(T).C_PS = 2.2214 at M=1 (point estimate at h_eq)',
    holds: () =>
      Math.abs(DIMENSIONAL_FLOOR_CANDIDATE - M_MAIN * C_PS) < 1e-15 &&
      Math.abs(DIMENSIONAL_FLOOR_CANDIDATE - 2.221441469) < 1e-6 &&
      Math.abs(IMP36058_I3_CUSP_MODULUS_DIMENSIONALIZATION.conversion.dimensionalFloorCandidate - C_PS) < 1e-6,
  },
  {
    // The shortfall: certified h-uniform floor is 0 (delta_long collapses as h -> 0), a categorical gap.
    id: 'imp36058-certified-uniform-floor-is-zero',
    description: 'inf_{h in [0,h_eq]} delta_long = 0 (h-flat C_PS vs h-linear delta_long collapse) => certified floor 0',
    holds: () =>
      CERTIFIED_UNIFORM_FLOOR === 0 &&
      Math.abs(M_MAIN * W_TPT * 0 - CERTIFIED_UNIFORM_FLOOR) < 1e-15 && // delta_long(0) = 0
      /INFINITE/.test(IMP36058_I3_CUSP_MODULUS_DIMENSIONALIZATION.shortfall.verdictLine) &&
      /uniform-infimum/.test(IMP36058_I3_CUSP_MODULUS_DIMENSIONALIZATION.shortfall.verdictLine),
  },
  {
    // Honesty gate: derivation only, model-cusp proxy, no certification, greenfield, no QED, no refereed bound is changed.
    id: 'imp36058-honesty-gate-no-qed',
    description: 'Derivation only; model-cusp PROXY; certifies no delta>0; I3 GREENFIELD; NO QED; no refereed bound is changed',
    holds: () =>
      IMP36058_I3_CUSP_MODULUS_DIMENSIONALIZATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      T_PT === 3e12 &&
      /PROXY on the model cusp/.test(IMP36058_I3_CUSP_MODULUS_DIMENSIONALIZATION.verdict) &&
      /certifies no delta > 0/.test(IMP36058_I3_CUSP_MODULUS_DIMENSIONALIZATION.verdict) &&
      /I3 stays GREENFIELD/.test(IMP36058_I3_CUSP_MODULUS_DIMENSIONALIZATION.verdict) &&
      /NO QED/.test(IMP36058_I3_CUSP_MODULUS_DIMENSIONALIZATION.verdict) &&
      /refereed bound is changed/i.test(IMP36058_I3_CUSP_MODULUS_DIMENSIONALIZATION.verdict),
  },
];

for (const a of IMP36058_I3_CUSP_MODULUS_DIMENSIONALIZATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36058-i3-cusp-modulus-dimensionalization assertion failed: ${a.id}`);
  }
}
