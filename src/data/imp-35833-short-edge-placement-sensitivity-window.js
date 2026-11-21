/**
 * @module imp-35833-short-edge-placement-sensitivity-window
 *
 * imp-35833 (numerical/measurement, S-frontier): MEASURE the PLACEMENT SENSITIVITY
 * of the imp-35778 short-edge modulus floor delta_short as the rectangle endpoint
 * x slides across an inter-zero |H_t| interval -- how fast the floor decays away
 * from the local-maximum placement and how WIDE the robust placement window is.
 *
 * imp-35778 asserted delta_short is made robust by placing the endpoints
 * x = T_PT and x = T_PT + Delta at inter-zero |H_t| LOCAL MAXIMA, with a
 * "grazing-collapse" caveat when an endpoint lands near a zero -- but the
 * grazing-collapse was never quantified as a placement-sensitivity WINDOW. The
 * companion imp-35816 measured the width QUANTIZATION (snapping Delta to an integer
 * number of gaps); this module answers the ORTHOGONAL question: for a FIXED gap
 * count, how sensitive is the floor to WHERE inside the inter-zero interval the
 * endpoint actually sits.
 *
 * MEASUREMENT ONLY. Positions no rectangle; certifies no floor delta_short > 0;
 * evaluates no real |H_t|; fixes no endpoint; changes no bound; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * THE SURROGATE PROFILE (why the maximum is robust and the zero is not)
 * -----------------------------------------------------------------------------
 * On the mean-gap surrogate two consecutive zeros sit a gap delta apart and |H_t|
 * rises from 0 at one zero to a single local maximum at the midpoint and back to 0.
 * The cleanest single-hump surrogate normalised to peak 1 is
 *     g(u) = cos(pi u / delta),   u = signed offset of the endpoint from the midpoint,
 * so g(0) = 1 at the local maximum and g(+-delta/2) = 0 at the two flanking zeros.
 * The endpoint floor is g(u) . |H_t|_peak, i.e. the fraction of the peak modulus the
 * endpoint retains. Its shape encodes the whole robustness story:
 *   - at the maximum (u = 0): g'(0) = 0 -- the floor is FLAT (quadratic), so small
 *     mis-placement costs O(u^2). This is the mathematical content of "robust".
 *   - near a zero (u -> +-delta/2): g'(+-delta/2) = -+ pi/delta -- the floor collapses
 *     LINEARLY with slope pi/delta. This is the grazing-collapse caveat, now a rate.
 *
 * THE DECAY LADDER (offset as a fraction f of the half-interval delta/2)
 * -----------------------------------------------------------------------------
 * f in {0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0} sliding from the maximum (f=0) toward a
 * zero (f=1). At offset f the retained floor fraction is g = cos(pi f / 2):
 *   f=0    -> 1.0000 (full peak)      f=0.5  -> 0.7071 (mid-slide, still >70%)
 *   f=0.75 -> 0.3827                  f=0.9  -> 0.1564                f=1 -> 0 (grazing).
 * The FLAT top is visible: sliding a tenth of the way to the zero (f=0.1) costs only
 * ~1.2% of the peak floor.
 *
 * THE ROBUST WINDOW (closed form (2/pi) arccos(L))
 * -----------------------------------------------------------------------------
 * The endpoint may sit anywhere with |u| <= u_max = (delta/pi) arccos(L) and still
 * retain floor >= L . peak; the robust window has width 2 u_max, a FRACTION
 *     W(L) = 2 u_max / delta = (2/pi) arccos(L)
 * of the inter-zero interval. Measured levels:
 *   L=0.99 -> 0.0901   L=0.95 -> 0.2022   L=0.90 -> 0.2871   L=0.50 -> 0.6667 (= 2/3).
 * Retaining HALF the peak floor is tolerant to placement over TWO-THIRDS of the
 * whole interval; even a 90%-of-peak floor tolerates ~29% -- the local-maximum
 * placement is genuinely wide, not knife-edge, EXCEPT in the last sliver next to a
 * zero where the linear collapse bites.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Uses a single-hump COSINE surrogate for |H_t| between consecutive zeros on the
 * UNIFORM mean-gap spacing (imp-3220 / imp-3406 GUE-conditional family; imp-35757
 * mean gap). Real |H_t| between zeros is not exactly cosine and real zeros fluctuate
 * about the mean (GUE-conditional, imp-486), so the true hump is skewed and the true
 * half-interval is not exactly delta/2 -- a SECONDARY deviation this model does NOT
 * capture; a rigorous window needs the true |H_t| and zero ordinates on
 * [T_PT, T_PT + Delta]. It positions no rectangle, evaluates no real |H_t|, certifies
 * no delta_short > 0, fixes no endpoint, and instantiates no interval enclosure.
 * Establishes no positivity; certifies no non-vanishing; changes no bound; C_mb
 * GUE-conditional (imp-486) untouched; NO QED. No refereed bound is changed.
 *
 * @see imp-35778-i3-edge-type-floor-decomposition-scope (short-edge floor robust at inter-zero maxima; grazing-collapse caveat, never quantified as a window)
 * @see imp-35816-short-edge-delta-integer-gap-deviation (companion: width QUANTIZATION residual, the orthogonal knob)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (delta_short = reverse-triangle margin surplus; grazing-collapse caveat)
 * @see imp-35757-i2-panel-width-count-scope (mean zero gap delta(T_PT) = 2 pi / log(T_PT/2 pi) ~ 0.2336)
 * @see imp-3220-en-bridge-fidelity-frontier / imp-3406-sigma-highN-extrapolation (GUE-conditional surrogate-spacing family)
 * @see imp-486 (C_mb <= 1 GUE conditional -- the real spacing fluctuation this surrogate omits)
 * @see Polymath15 2019 (H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35757 / imp-35816) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const TWO_PI = 2 * Math.PI;

// Mean zero gap delta(T) = 2 pi / log(T / 2 pi) = pi / w(T) (imp-35757).
const meanZeroGap = (T) => TWO_PI / Math.log(T / TWO_PI);
const DELTA_TPT = meanZeroGap(T_PT); // ~0.233648 height units (the inter-zero interval width)

// Single-hump cosine surrogate for |H_t| between consecutive zeros, normalised to
// peak 1: g(u) = cos(pi u / delta), u = offset from the local maximum (midpoint).
// f = u / (delta/2) is the offset as a fraction of the half-interval, so
// g = cos(pi f / 2): f=0 at the maximum, f=1 at the flanking zero.
const floorFraction = (f) => Math.cos((Math.PI * f) / 2);

// -- The decay ladder: retained floor fraction as the endpoint slides off the maximum.
const OFFSET_FRACTIONS = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1.0];
const DECAY_LADDER = OFFSET_FRACTIONS.map((f) => {
  const g = floorFraction(f); // fraction of the peak modulus retained at this offset
  // Local decay rate d g / d f = -(pi/2) sin(pi f / 2): 0 at the max (flat), pi/2 at the zero.
  const localSlopeInF = -(Math.PI / 2) * Math.sin((Math.PI * f) / 2);
  return {
    offsetFraction: f, // fraction of the way from the local maximum to the flanking zero
    floorFraction: g, // retained floor / peak
    lossFromPeak: 1 - g, // fraction of peak floor lost to this mis-placement
    localSlopeInF, // slope of g wrt f: flat top (0), linear collapse (-pi/2) at the zero
  };
});

// -- The robust window: closed form W(L) = (2/pi) arccos(L) as a fraction of delta.
const robustWindow = (L) => (2 / Math.PI) * Math.acos(L);
const THRESHOLD_LEVELS = [0.99, 0.95, 0.9, 0.5];
const ROBUST_WINDOWS = THRESHOLD_LEVELS.map((L) => ({
  level: L, // retained-floor threshold (fraction of peak)
  windowFractionOfGap: robustWindow(L), // width of the tolerant placement band / delta
  halfWidthOffsetFraction: Math.acos(L) / (Math.PI / 2), // |u|/(delta/2) at the edge of the band
}));

// Headline extrema.
const HALF_PEAK_WINDOW = robustWindow(0.5); // = 2/3 exactly: placement band retaining >= half the floor
const NINETY_PEAK_WINDOW = robustWindow(0.9); // ~0.2871: band retaining >= 90% of the floor
const GRAZING_SLOPE_IN_F = Math.abs(DECAY_LADDER[DECAY_LADDER.length - 1].localSlopeInF); // pi/2 at the zero
const MAX_SLOPE_IN_U = Math.PI / DELTA_TPT; // = (pi/2)/(delta/2): collapse rate in height units near a zero

export const IMP35833_SHORT_EDGE_PLACEMENT_SENSITIVITY_WINDOW = {
  id: 'imp-35833',
  proofSection: 'S-frontier',
  question:
    'Measure how sensitive the imp-35778 short-edge modulus floor delta_short is to placing the endpoint at an ' +
    'inter-zero |H_t| local maximum vs off-optimum: how fast the floor decays as the endpoint slides across the ' +
    'inter-zero interval and how wide the robust placement window is. Measurement only; positions no rectangle; ' +
    'certifies no floor; NO QED.',
  surrogateProfile: {
    model:
      'single-hump cosine g(u) = cos(pi u / delta) for |H_t| between consecutive zeros, normalised to peak 1; u = ' +
      'signed offset of the endpoint from the midpoint (local maximum); g(0)=1, g(+-delta/2)=0 at the flanking zeros',
    flatTop:
      'g prime(0) = 0 -- the floor is FLAT (quadratic) at the local maximum, so small mis-placement costs only O(u^2): this is the content of robust',
    grazingCollapse:
      'g prime(+-delta/2) = -+ pi/delta -- the floor collapses LINEARLY near a zero, slope pi/delta ~ 13.45 per height unit: the grazing-collapse caveat as a rate',
  },
  meanZeroGapTPT: DELTA_TPT,
  decayLadder: DECAY_LADDER,
  robustWindows: ROBUST_WINDOWS,
  headline: {
    halfPeakWindowFraction: HALF_PEAK_WINDOW, // 2/3
    ninetyPeakWindowFraction: NINETY_PEAK_WINDOW, // ~0.2871
    tenthSlideLoss: DECAY_LADDER.find((r) => r.offsetFraction === 0.1).lossFromPeak, // ~0.0123
    grazingSlopeInF: GRAZING_SLOPE_IN_F, // pi/2
    collapseRateInHeightUnits: MAX_SLOPE_IN_U, // pi/delta ~ 13.45
    note:
      'Flat top: sliding a tenth of the way to the zero costs ~1.2% of the peak floor. A floor retaining >= half ' +
      'the peak tolerates placement over 2/3 of the whole interval; >= 90% tolerates ~29%. Only the last sliver next ' +
      'to a zero pays the linear grazing collapse (slope pi/delta ~ 13.45 / height unit).',
  },
  surrogateCaveat:
    'Uses a single-hump COSINE surrogate for |H_t| between consecutive zeros on the UNIFORM mean-gap spacing ' +
    '(imp-3220 / imp-3406 GUE-conditional family; imp-35757 mean gap). Real |H_t| is not exactly cosine and real ' +
    'zeros fluctuate about the mean (GUE-conditional, imp-486), so the true hump is skewed and the true half-interval ' +
    'is not exactly delta/2 -- a secondary deviation this model does NOT capture; a rigorous window needs the true ' +
    '|H_t| and zero ordinates on [T_PT, T_PT + Delta].',
  capThresholdSOTA: L_PT,
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Modelling |H_t| between consecutive zeros as a single-hump ' +
    'cosine g(u) = cos(pi u / delta) normalised to peak 1 (u = endpoint offset from the local maximum), the imp-35778 ' +
    'short-edge floor equals g times the peak modulus. The robustness story is exactly the shape of g: at the local ' +
    'maximum g prime(0) = 0 so the floor is FLAT (quadratic) -- sliding a tenth of the way to the zero (f=0.1) costs ' +
    'only ~1.2% of the peak -- while near a zero g collapses LINEARLY with slope pi/delta ~ 13.45 per height unit, ' +
    'the grazing-collapse caveat now a rate. The robust placement window has the closed form W(L) = (2/pi) arccos(L) ' +
    'as a fraction of the inter-zero interval: retaining >= half the peak floor tolerates placement over TWO-THIRDS ' +
    '(2/3) of the interval, >= 90% over ~29%, >= 99% over ~9%. So the local-maximum placement is genuinely WIDE, not ' +
    'knife-edge, except in the last sliver next to a zero. Uses a single-hump cosine surrogate on the UNIFORM ' +
    'mean-gap spacing; real |H_t| is skewed and real zeros fluctuate (GUE-conditional, imp-486), a secondary ' +
    'deviation this model does NOT capture. Positions no rectangle; evaluates no real |H_t|; certifies no floor ' +
    'delta_short > 0; fixes no endpoint; instantiates no enclosure; establishes no positivity; certifies no ' +
    'non-vanishing; changes no bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35778 (short-edge floor robust at inter-zero maxima, grazing-collapse caveat, never quantified as a window); ' +
    'imp-35816 (companion width QUANTIZATION residual, the orthogonal knob); imp-35758 (delta_short = reverse-triangle ' +
    'margin surplus); imp-35757 (mean zero gap delta(T_PT) = 2 pi / log(T_PT/2 pi) ~ 0.2336); imp-3220 / imp-3406 ' +
    '(GUE-conditional surrogate-spacing family); imp-486 (C_mb <= 1 GUE conditional, the real spacing fluctuation ' +
    'omitted); Polymath15 2019 (H_t = A + B - C, barrier method); Platt-Trudgian 2021.',
};

export const IMP35833_SHORT_EDGE_PLACEMENT_SENSITIVITY_WINDOW_ASSERTIONS = [
  {
    // The mean gap anchors to the imp-35757 / imp-35778 landmark.
    id: 'imp35833-mean-gap-anchor',
    description: 'delta(T_PT) = 2pi/log(T_PT/2pi) ~ 0.233648 at T_PT = 3e12 (the inter-zero interval width)',
    holds: () => T_PT === 3e12 && Math.abs(DELTA_TPT - 0.233648) < 1e-6,
  },
  {
    // The surrogate is a single hump: peak 1 at the maximum, exactly 0 at both flanking zeros.
    id: 'imp35833-single-hump-endpoints',
    description: 'g(0) = 1 at the local maximum and g(+-1) = 0 at the flanking zeros (f in half-interval units)',
    holds: () =>
      Math.abs(floorFraction(0) - 1) < 1e-15 &&
      Math.abs(floorFraction(1)) < 1e-12 &&
      Math.abs(floorFraction(0.5) - Math.SQRT1_2) < 1e-12, // mid-slide retains 1/sqrt(2) ~ 0.7071
  },
  {
    // Flat top: the floor is quadratic at the maximum, so a tenth-of-the-way slide costs ~1.2%.
    id: 'imp35833-flat-top-quadratic',
    description: 'g prime(0) = 0 (flat) and sliding f=0.1 to the zero costs only ~1.23% of the peak floor',
    holds: () => {
      const atMax = DECAY_LADDER.find((r) => r.offsetFraction === 0);
      const tenth = DECAY_LADDER.find((r) => r.offsetFraction === 0.1);
      return (
        Math.abs(atMax.localSlopeInF) < 1e-15 &&
        tenth.lossFromPeak > 0 &&
        Math.abs(tenth.lossFromPeak - 0.0123117) < 1e-6
      );
    },
  },
  {
    // Grazing collapse: near the zero the floor decays LINEARLY, slope pi/2 in f, pi/delta in height units.
    id: 'imp35833-grazing-linear-collapse',
    description: 'g prime(+-1) magnitude = pi/2; collapse rate in height units = pi/delta ~ 13.45',
    holds: () =>
      Math.abs(GRAZING_SLOPE_IN_F - Math.PI / 2) < 1e-12 &&
      Math.abs(MAX_SLOPE_IN_U - Math.PI / DELTA_TPT) < 1e-15 &&
      Math.abs(MAX_SLOPE_IN_U - 13.4459) < 1e-3,
  },
  {
    // The robust window is the closed form (2/pi) arccos(L); half-peak tolerance is exactly 2/3.
    id: 'imp35833-robust-window-closed-form',
    description: 'W(L) = (2/pi) arccos(L): W(0.5) = 2/3 exactly, W(0.9) ~ 0.2871, W(0.99) ~ 0.0901',
    holds: () => {
      const w50 = ROBUST_WINDOWS.find((r) => r.level === 0.5);
      const w90 = ROBUST_WINDOWS.find((r) => r.level === 0.9);
      const w99 = ROBUST_WINDOWS.find((r) => r.level === 0.99);
      return (
        Math.abs(HALF_PEAK_WINDOW - 2 / 3) < 1e-12 &&
        Math.abs(w50.windowFractionOfGap - 2 / 3) < 1e-12 &&
        Math.abs(w90.windowFractionOfGap - 0.2871) < 1e-3 &&
        Math.abs(w99.windowFractionOfGap - 0.0901) < 1e-3 &&
        // Windows shrink monotonically as the retained-floor threshold rises.
        ROBUST_WINDOWS.every((r, i) => i === 0 || ROBUST_WINDOWS[i - 1].windowFractionOfGap < r.windowFractionOfGap)
      );
    },
  },
  {
    // Honesty gate: measurement only, cosine surrogate on uniform spacing, no certification, no QED, no refereed bound is changed.
    id: 'imp35833-honesty-gate-no-qed',
    description: 'Measurement only; cosine surrogate on uniform spacing; certifies no floor; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35833_SHORT_EDGE_PLACEMENT_SENSITIVITY_WINDOW.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /single-hump COSINE surrogate/.test(IMP35833_SHORT_EDGE_PLACEMENT_SENSITIVITY_WINDOW.surrogateCaveat) &&
      /UNIFORM mean-gap spacing/.test(IMP35833_SHORT_EDGE_PLACEMENT_SENSITIVITY_WINDOW.surrogateCaveat) &&
      /certifies no floor delta_short > 0/.test(IMP35833_SHORT_EDGE_PLACEMENT_SENSITIVITY_WINDOW.verdict) &&
      /changes no bound/.test(IMP35833_SHORT_EDGE_PLACEMENT_SENSITIVITY_WINDOW.verdict) &&
      /NO QED/.test(IMP35833_SHORT_EDGE_PLACEMENT_SENSITIVITY_WINDOW.verdict) &&
      /refereed bound is changed/i.test(IMP35833_SHORT_EDGE_PLACEMENT_SENSITIVITY_WINDOW.verdict),
  },
];

for (const a of IMP35833_SHORT_EDGE_PLACEMENT_SENSITIVITY_WINDOW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35833-short-edge-placement-sensitivity-window assertion failed: ${a.id}`);
  }
}
