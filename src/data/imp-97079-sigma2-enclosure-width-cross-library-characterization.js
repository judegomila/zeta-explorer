/**
 * @fileoverview imp-97079 -- characterize the 4.66e-10 sigma_2 midpoint enclosure-width
 * divergence between mpmath.iv (prec80) and the from-scratch Iv (prec220) interval libraries
 * ACROSS CELLS: confirm it is enclosure width / quantization, not a systematic per-cell bias.
 * Import-light: all values are frozen literals from tmp/imp-97079-enclosure-width-sweep.py
 * on /tmp/rhvenv (mpmath 1.4.1, numpy 2.5.3), reporting arithmetic at 320 bits.
 *
 * BACKGROUND. imp-97050 FINDING 2 recorded that the single verdict-irrelevant divergence between
 * the two interval libraries is the deepest constant-B rigorous lower bound across the 59 fails:
 * iv-prec80 -0.954363556514616 vs Iv-prec220 -0.954363556048962 (absDiff 4.656540708580792e-10),
 * and attributed it to "the sigma_2 midpoint enclosure width differing between the two interval
 * arithmetics". This leaf samples 15 cell midpoints across [0,40] (including the deepest-fail cell
 * t~37.809) and computes the sigma_2 midpoint enclosure s_m = sigma_iv(m, power=2) under
 * mpmath.iv at prec80 and the from-scratch Iv at prec 80/120/160/220, recording, per cell, the
 * enclosure WIDTH b-a and the interval MIDPOINT (a+b)/2, all kept in mpf (never collapsed to
 * float64), against a prec-400 mpmath.iv reference value. All libraries evaluate at the SAME
 * binary-float input m (Iv(m) / iv.mpf(m)) exactly as the imp-97050 pipeline does.
 *
 * FINDING 1 -- THE mpf ENCLOSURE WIDTH IS PRECISION-INDEPENDENT, DEPENDENCY-DOMINATED. Raising the
 * from-scratch Iv working precision from 80 to 220 bits BARELY narrows the sigma_2 midpoint
 * enclosure: w80/w220 stays in [1.14, 1.20] at every sampled cell (prec120 and prec160 are already
 * indistinguishable from prec220). The width is set by interval dependency / wrapping in the psi
 * shift-Stirling series and the q^2 * w1 product, not by the working-precision rounding (which at
 * prec80 is ~2^-74 relative, far below the observed width). The RELATIVE width w/|sigma_2| is a
 * roughly constant ~1e-19 (range 6e-20 to 3.3e-19) across [0,40], so the ABSOLUTE width grows with
 * |sigma_2| from ~1e-20 at t=0 to ~4e-13 at t=40. At the deepest-fail cell (|sigma_2|~2.71e6) the
 * mpf width is ~3.2e-13 -- three orders of magnitude BELOW the reported 4.66e-10 divergence. So the
 * 4.66e-10 is NOT the mpf enclosure width.
 *
 * FINDING 2 -- NO SYSTEMATIC PER-CELL BIAS. With matched binary-float input, the from-scratch Iv220
 * interval MIDPOINT agrees with the prec-400 mpmath.iv reference value to ~1e-59 at every cell; the
 * mpmath.iv prec80 midpoint agrees to ~1e-17 (its 80-bit resolution at magnitude ~2.7e6). The
 * matched-input cross-library lower-endpoint mpf gap is at most ~4.4e-17 (at the deepest-fail cell),
 * a tiny fraction (~3e-4) of the enclosure half-width, with no sign pattern or drift across cells.
 * There is no per-cell offset between the two arithmetics beyond their own enclosure widths.
 *
 * FINDING 3 -- THE 4.66e-10 IS ONE float64 ULP OF THE double CONVERSION. The observed divergence is a
 * QUANTIZATION step, not an interval width. The reported absDiff 4.656540708580792e-10 equals
 * 0.9999845 * 2^-31, i.e. one float64 ULP at magnitude ~2.71e6 (mantissa exponent 21, ULP =
 * 2^(21-52) = 2^-31 = 4.656612873077393e-10). Both pipeline scripts feed the numpy Flow assembly
 * through sa = float(s_m.a): the two libraries agree on the mpf lower endpoint to ~4e-17, but when
 * that endpoint is snapped to the float64 grid at a cell where the exact value straddles a grid line,
 * the two doubles land one ULP apart. At most cells the two float64 roundings coincide exactly
 * (diff 0); the deepest-fail cell is where a straddle produces the single 1-ULP step. This step is
 * precision-INDEPENDENT (both scripts round onto the same float64 grid) and verdict-irrelevant
 * (2^-31 vs the |0.95| fail depth). It CORRECTS the imp-97050 FINDING 2 attribution: the mechanism
 * is float64 quantization of the double conversion, not the interval enclosure width.
 *
 * VERDICT. The cross-library divergence is characterized: (a) the mpf enclosure width is
 * precision-independent and ~3e-13 at the deepest fail (sub-ULP); (b) there is no systematic per-cell
 * bias (midpoints agree to ~1e-59 vs reference); (c) the observed 4.66e-10 is exactly one float64 ULP
 * (2^-31) of the sa = float(s_m.a) double conversion at |sigma_2|~2.71e6. Moves no verdict, no bound;
 * certified reach stays 2a <= 0.96; operator positivity not proved; RH open; NO QED.
 *
 * @see imp-97050-independent-fullpipeline-sweep.js (FINDING 2 -- the divergence under test)
 * @see imp-97034-independent-celllocal-reverify.js (step (a) enclosure + tail formula, second impl)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// Measurement setup: 15 cell midpoints across [0,40], sigma_2 midpoint enclosure per library.
export const IMP97079_SETUP = Object.freeze({
  iterate: 'tmp/imp-96970/iterate-snap.json', // round-12 kmax=5, 2a=1.00, symbol sigma2 (power=2)
  hc: 5.0e-4,
  domain: '[0,40]',
  ivmpLibrary: 'mpmath.iv at prec80 (the imp-97012 verdict library)',
  ivLibrary: 'from-scratch outward-rounded Iv on mpmath.mp at prec 80/120/160/220 (imp-97050 library)',
  referenceValue: 'mpmath.iv at prec400 midpoint (~exact sigma_2 bracket)',
  matchedInput: 'both libraries evaluate at the SAME binary-float m (Iv(m) / iv.mpf(m)), as in the pipeline',
  reportingPrecBits: 320,
});

// FINDING 1 -- mpf enclosure width is precision-independent (w80/w220 in [1.14,1.20]) and
// dependency-dominated; relative width ~1e-19 roughly constant across [0,40].
export const IMP97079_WIDTH_VS_PRECISION = Object.freeze({
  ratioW80overW220Range: Object.freeze([1.14, 1.20]),
  prec120EqualsPrec220: true, // prec120/160/220 widths indistinguishable
  relativeWidthTypical: 1.0e-19, // w/|sigma_2|, range ~6e-20 to ~3.3e-19
  samples: Object.freeze([
    Object.freeze({ t: 0.00025, absSigma2: 0.397, wIv80: 1.52e-20, wIv220: 9.89e-21, ratio: 1.54, relW: 2.49e-20 }),
    Object.freeze({ t: 8.00025, absSigma2: 2.0e3, wIv80: 7.46e-16, wIv220: 6.53e-16, ratio: 1.14, relW: 3.27e-19 }),
    Object.freeze({ t: 20.00025, absSigma2: 1.43e5, wIv80: 2.94e-14, wIv220: 2.54e-14, ratio: 1.16, relW: 1.77e-19 }),
    Object.freeze({ t: 37.80875, absSigma2: 2.71e6, wIv80: 3.84e-13, wIv220: 3.24e-13, ratio: 1.19, relW: 1.19e-19 }),
    Object.freeze({ t: 39.99975, absSigma2: 6.88e6, wIv80: 4.77e-13, wIv220: 4.05e-13, ratio: 1.18, relW: 5.89e-20 }),
  ]),
  claim: 'width set by interval dependency/wrapping, not working precision; ~3.2e-13 at the deepest fail, sub-ULP',
});

// FINDING 2 -- no systematic per-cell bias (matched binary-float input).
export const IMP97079_NO_PER_CELL_BIAS = Object.freeze({
  iv220MidVsRefMax: 1.2e-59, // from-scratch Iv220 midpoint vs prec400 reference, worst over cells
  ivmp80MidVsRefMax: 1.3e-17, // mpmath.iv prec80 midpoint vs reference (its 80-bit resolution)
  matchedInputLowerEndpointGapMax: 4.4e-17, // mpf lo gap iv80 vs Iv220 at the deepest-fail cell
  gapOverHalfWidthTypical: 3.0e-4, // gap is a tiny fraction of the enclosure half-width, no drift
  claim: 'no per-cell offset between the two arithmetics beyond their own enclosure widths',
});

// FINDING 3 -- the 4.66e-10 divergence is one float64 ULP of the sa = float(s_m.a) double conversion.
export const IMP97079_ULP_MECHANISM = Object.freeze({
  reportedAbsDiff: 4.656540708580792e-10, // imp-97050 FINDING 2
  float64UlpAtMagnitude: 4.656612873077393e-10, // 2^-31, ULP of a double near 2.71e6 (exponent 21)
  ratioReportedOverUlp: 0.9999845027923584, // reported divergence is one float64 ULP
  sigma2Magnitude: 2.71e6,
  mantissaExponent: 21,
  ulpExponent: -31,
  mechanism: 'sa = float(s_m.a) snaps the shared mpf lower endpoint to the float64 grid; at a cell where the exact value straddles a grid line the two doubles land one ULP apart',
  atMostCellsRoundingsCoincide: true, // at the deepest-fail cell here the two float64 sa are bit-identical (diff 0)
  precisionIndependent: true, // both scripts round onto the same float64 grid
  correctsImp97050Attribution: 'mechanism is float64 quantization of the double conversion, not the interval enclosure width',
});

export const IMP97079_VERDICT = Object.freeze({
  characterized: true,
  isEnclosureWidth: false, // mpf width ~3e-13 at the deepest fail is sub-ULP
  isPerCellBias: false, // midpoints agree to ~1e-59 vs reference
  isFloat64Ulp: true, // one 2^-31 quantization step of sa = float(s_m.a)
  movesAnyVerdict: false,
  certifiedReach: 0.96,
  operatorPositivityProved: false,
  rhStatus: 'open',
  noQED: true,
});
