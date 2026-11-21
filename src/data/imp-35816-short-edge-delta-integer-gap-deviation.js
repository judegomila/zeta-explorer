/**
 * @module imp-35816-short-edge-delta-integer-gap-deviation
 *
 * imp-35816 (accuracy/measurement, S-frontier): MEASURE the deviation of the
 * imp-35778 short-edge rectangle width Delta from an EXACT integer number of mean
 * zero gaps delta(T_PT) = 2 pi / log(T_PT / 2 pi) ~ 0.2336, quantifying the
 * endpoint-placement QUANTIZATION residual on the mean-gap surrogate spacing
 * (imp-3220 / imp-3406 GUE-conditional spacing family; imp-35757 mean gap).
 *
 * imp-35778 stated that the short-edge modulus floor delta_short is made robust by
 * placing the rectangle endpoints x = T_PT and x = T_PT + Delta at inter-zero
 * |H_t| local maxima, and that this QUANTIZES Delta to "near an integer number of
 * mean zero gaps delta(T_PT) ~ 0.2336" -- but it never measured HOW near, i.e. the
 * residual between a naively chosen width and the nearest realizable integer-gap
 * width. This module supplies that measurement.
 *
 * MEASUREMENT ONLY. Positions no rectangle; certifies no floor delta_short > 0;
 * evaluates no |H_t|; fixes no Delta; changes no bound; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * THE QUANTIZATION (why a naive Delta cannot be used verbatim)
 * -----------------------------------------------------------------------------
 * Both short edges must land at inter-zero |H_t| maxima. On the mean-gap surrogate
 * (uniform spacing delta apart) the maxima sit one gap apart, so the ONLY realizable
 * widths are integer multiples Delta_q = k . delta, k = 1, 2, 3, ... A naively chosen
 * target width W must therefore be SNAPPED to the nearest such multiple:
 *     k       = round(W / delta),   Delta_q = k . delta,
 *     residual = W - Delta_q,       |residual| <= delta / 2.
 * The absolute snap residual is bounded by HALF a mean gap (delta/2 ~ 0.1168 height
 * units) INDEPENDENTLY of the target width -- it is the quantization step, not a
 * growing error. The RELATIVE residual |residual| / W <= delta / (2 W) = 1 / (2 k)
 * therefore DECAYS inversely with the width in gaps: a one-gap rectangle pays up to
 * 50% relative quantization, a k-gap rectangle at most 1/(2k). So the "near an
 * integer number of gaps" language is quantitatively a delta/2 absolute / 1/(2k)
 * relative endpoint-placement cost, cheap for wide rectangles.
 *
 * THE LADDER (naive target widths W around T_PT = 3e12)
 * -----------------------------------------------------------------------------
 * W in {0.5, 1, 2, 4, 8, 16} height units (~2 .. ~68 mean gaps). For each: the exact
 * gap count W/delta, the snapped integer count k, the realizable width k.delta, the
 * signed residual W - k.delta (snapping can ENLARGE or SHRINK Delta -- e.g. W=2
 * rounds UP from 8.56 to 9 gaps, residual -0.1028), the relative residual, and the
 * residual as a fraction of one gap (always <= 0.5). The worst measured absolute
 * residual across the ladder (~0.1120 at W=16) stays under the delta/2 ~ 0.1168
 * ceiling, and every relative residual stays under its 1/(2k) bound.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Uses the UNIFORM mean-gap SURROGATE spacing (imp-3220 / imp-3406 GUE-conditional
 * family; imp-35757 mean gap). REAL zeros fluctuate about the mean (spacing is
 * GUE-conditional, imp-486), so the actual k-th inter-zero maximum sits at k.delta
 * PLUS an accumulated spacing fluctuation -- a SECONDARY deviation this mean-gap
 * model does NOT capture; a rigorous prescription needs the true zero ordinates on
 * [T_PT, T_PT + Delta]. It positions no rectangle, evaluates no |H_t|, certifies no
 * delta_short > 0, fixes no Delta or h, and instantiates no interval enclosure.
 * Establishes no positivity; certifies no non-vanishing; changes no bound; C_mb
 * GUE-conditional (imp-486) untouched; NO QED. No refereed bound is changed.
 *
 * @see imp-35778-i3-edge-type-floor-decomposition-scope (short-edge Delta quantized to ~integer mean gaps; asserted, never measured)
 * @see imp-35757-i2-panel-width-count-scope (mean zero gap delta(T_PT) = 2 pi / log(T_PT/2 pi) ~ 0.2336)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (delta_short = reverse-triangle margin surplus; grazing-collapse caveat)
 * @see imp-35815-panel-width-mean-gap-agreement-table (mean gap = pi / w route reconciliation)
 * @see imp-3220-en-bridge-fidelity-frontier / imp-3406-sigma-highN-extrapolation (GUE-conditional surrogate-spacing family)
 * @see imp-486 (C_mb <= 1 GUE conditional -- the real spacing fluctuation this surrogate omits)
 * @see Polymath15 2019 (H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35757 / imp-35778) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const TWO_PI = 2 * Math.PI;

// Mean zero gap delta(T) = 2 pi / log(T / 2 pi) = pi / w(T) (imp-35757).
const meanZeroGap = (T) => TWO_PI / Math.log(T / TWO_PI);
const DELTA_TPT = meanZeroGap(T_PT); // ~0.233648 height units
const HALF_GAP = DELTA_TPT / 2; // ~0.116824: the quantization half-step (absolute residual ceiling)

// Naive target rectangle widths (height units) spanning ~2 .. ~68 mean gaps.
const NAIVE_WIDTHS = [0.5, 1, 2, 4, 8, 16];

// Snap each naive width to the nearest realizable integer-gap width and measure the residual.
const QUANTIZATION_TABLE = NAIVE_WIDTHS.map((W) => {
  const exactGaps = W / DELTA_TPT; // fractional number of mean gaps
  const k = Math.round(exactGaps); // nearest integer number of gaps (endpoints at maxima)
  const quantizedWidth = k * DELTA_TPT; // the realizable width Delta_q = k . delta
  const residual = W - quantizedWidth; // signed snap residual (can enlarge or shrink Delta)
  const absResidual = Math.abs(residual);
  const relativeResidual = absResidual / W; // <= 1 / (2 k)
  const residualInGaps = absResidual / DELTA_TPT; // <= 0.5 (fraction of one mean gap)
  const relativeBound = 1 / (2 * k); // the delta / (2 W) = 1/(2k) relative ceiling
  return {
    naiveWidth: W,
    exactGaps,
    k,
    quantizedWidth,
    residual,
    absResidual,
    relativeResidual,
    residualInGaps,
    relativeBound,
  };
});

// Headline: worst absolute residual across the ladder (must stay under the delta/2 ceiling).
const MAX_ABS_RESIDUAL = Math.max(...QUANTIZATION_TABLE.map((r) => r.absResidual));
// Worst relative residual (largest for the narrowest rectangle, the single-gap-scale regime).
const MAX_REL_RESIDUAL = Math.max(...QUANTIZATION_TABLE.map((r) => r.relativeResidual));

export const IMP35816_SHORT_EDGE_DELTA_INTEGER_GAP_DEVIATION = {
  id: 'imp-35816',
  proofSection: 'S-frontier',
  question:
    'Measure the deviation of the imp-35778 short-edge rectangle width Delta from an EXACT integer number of mean ' +
    'zero gaps delta(T_PT) = 2 pi / log(T_PT/2 pi) ~ 0.2336, quantifying the endpoint-placement quantization on the ' +
    'mean-gap surrogate spacing. Measurement only; positions no rectangle; certifies no floor; NO QED.',
  quantization: {
    rule:
      'both short edges must land at inter-zero |H_t| maxima; on the uniform mean-gap surrogate the maxima are one ' +
      'gap apart, so realizable widths are integer multiples Delta_q = k . delta. A naive width W snaps to k = ' +
      'round(W/delta), residual = W - k . delta.',
    absoluteCeiling:
      '|residual| <= delta/2 ~ 0.1168 height units INDEPENDENTLY of the width -- the quantization half-step, not a growing error',
    relativeDecay:
      '|residual|/W <= delta/(2 W) = 1/(2 k): a one-gap rectangle pays up to 50% relative quantization, a k-gap rectangle at most 1/(2k)',
  },
  meanZeroGapTPT: DELTA_TPT,
  halfGap: HALF_GAP,
  table: QUANTIZATION_TABLE,
  headline: {
    maxAbsResidual: MAX_ABS_RESIDUAL,
    maxRelResidual: MAX_REL_RESIDUAL,
    note:
      'Worst absolute snap residual ~0.1120 (at W=16) stays under the delta/2 ~ 0.1168 ceiling; worst relative ' +
      'residual ~0.0654 sits at the narrowest rectangle. Snapping can ENLARGE (W=2: 8.56 -> 9 gaps) or SHRINK Delta.',
  },
  surrogateCaveat:
    'Uses the UNIFORM mean-gap surrogate spacing (imp-3220 / imp-3406 GUE-conditional family; imp-35757 mean gap). ' +
    'Real zeros fluctuate about the mean (GUE-conditional, imp-486), so the k-th inter-zero maximum sits at k . delta ' +
    'PLUS an accumulated spacing fluctuation this mean-gap model does NOT capture; a rigorous Delta needs the true ' +
    'zero ordinates on [T_PT, T_PT + Delta].',
  capThresholdSOTA: L_PT,
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-35778 short-edge width Delta is quantized because both ' +
    'endpoints must sit at inter-zero |H_t| maxima, which on the uniform mean-gap surrogate are one gap delta(T_PT) ~ ' +
    '0.2336 apart -- so the realizable widths are integer multiples Delta_q = k . delta and a naive target W must snap ' +
    'to k = round(W/delta). MEASURED over W in {0.5..16} height units (~2..~68 gaps): the ABSOLUTE snap residual is ' +
    'bounded by half a mean gap (delta/2 ~ 0.1168) independently of the width (worst ~0.1120 at W=16), and the ' +
    'RELATIVE residual |residual|/W <= delta/(2 W) = 1/(2 k) DECAYS inversely with the width in gaps (worst ~0.0654 ' +
    'at the narrowest rectangle; snapping can enlarge W=2 upward from 8.56 to 9 gaps or shrink it). So imp-35778s ' +
    '"near an integer number of gaps" is quantitatively a delta/2 absolute / 1/(2k) relative endpoint-placement cost, ' +
    'cheap for wide rectangles. Uses the UNIFORM mean-gap surrogate; real zeros fluctuate about the mean ' +
    '(GUE-conditional, imp-486), adding a secondary deviation this model does NOT capture. Positions no rectangle; ' +
    'evaluates no |H_t|; certifies no floor delta_short > 0; fixes no Delta or h; instantiates no enclosure; ' +
    'establishes no positivity; certifies no non-vanishing; changes no bound; C_mb GUE-conditional (imp-486) ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35778 (short-edge Delta quantized to ~integer mean gaps, asserted never measured); imp-35757 (mean zero gap ' +
    'delta(T_PT) = 2 pi / log(T_PT/2 pi) ~ 0.2336); imp-35758 (delta_short = reverse-triangle margin surplus); ' +
    'imp-35815 (mean gap = pi/w route reconciliation); imp-3220 / imp-3406 (GUE-conditional surrogate-spacing ' +
    'family); imp-486 (C_mb <= 1 GUE conditional, the real spacing fluctuation omitted); Polymath15 2019 ' +
    '(H_t = A + B - C, barrier method); Platt-Trudgian 2021.',
};

export const IMP35816_SHORT_EDGE_DELTA_INTEGER_GAP_DEVIATION_ASSERTIONS = [
  {
    // The mean gap and its half-step anchor to the imp-35757 / imp-35778 landmark.
    id: 'imp35816-mean-gap-anchor',
    description: 'delta(T_PT) = 2pi/log(T_PT/2pi) ~ 0.233648 and half-step delta/2 ~ 0.116824 at T_PT = 3e12',
    holds: () =>
      T_PT === 3e12 &&
      Math.abs(DELTA_TPT - 0.233648) < 1e-6 &&
      Math.abs(HALF_GAP - DELTA_TPT / 2) < 1e-15 &&
      Math.abs(HALF_GAP - 0.116824) < 1e-6,
  },
  {
    // The ladder snaps each naive width to the nearest integer gap count via round(W/delta).
    id: 'imp35816-ladder-shape',
    description: 'Six naive widths {0.5,1,2,4,8,16}; each k = round(W/delta) and Delta_q = k . delta exactly',
    holds: () =>
      QUANTIZATION_TABLE.length === 6 &&
      QUANTIZATION_TABLE[0].naiveWidth === 0.5 &&
      QUANTIZATION_TABLE[QUANTIZATION_TABLE.length - 1].naiveWidth === 16 &&
      QUANTIZATION_TABLE.every(
        (r) =>
          r.k === Math.round(r.naiveWidth / DELTA_TPT) &&
          Math.abs(r.quantizedWidth - r.k * DELTA_TPT) < 1e-15 &&
          Math.abs(r.residual - (r.naiveWidth - r.quantizedWidth)) < 1e-15,
      ),
  },
  {
    // Absolute residual ceiling: every snap residual stays under half a mean gap.
    id: 'imp35816-absolute-half-gap-ceiling',
    description: 'Every |residual| <= delta/2; worst measured ~0.1120 (at W=16) < delta/2 ~ 0.1168',
    holds: () =>
      QUANTIZATION_TABLE.every((r) => r.absResidual <= HALF_GAP + 1e-12 && r.residualInGaps <= 0.5 + 1e-12) &&
      MAX_ABS_RESIDUAL <= HALF_GAP + 1e-12 &&
      Math.abs(MAX_ABS_RESIDUAL - 0.1119860) < 1e-6,
  },
  {
    // Relative residual decays as 1/(2k): every row respects its own 1/(2k) bound.
    id: 'imp35816-relative-decay-bound',
    description: 'Every |residual|/W <= 1/(2k); worst relative ~0.0654 at the narrowest rectangle, decaying with width',
    holds: () =>
      QUANTIZATION_TABLE.every((r) => r.relativeResidual <= r.relativeBound + 1e-12) &&
      Math.abs(MAX_REL_RESIDUAL - 0.0654109) < 1e-6 &&
      // Wide rectangles are cheap: the widest (W=16) relative residual is under 1%.
      QUANTIZATION_TABLE[QUANTIZATION_TABLE.length - 1].relativeResidual < 0.01,
  },
  {
    // Snapping is two-sided: it can enlarge (W=2 rounds 8.56 up to 9 gaps, negative residual) or shrink Delta.
    id: 'imp35816-two-sided-snap',
    description: 'W=2 snaps UP from 8.56 to k=9 gaps (residual < 0, Delta enlarged); some rows snap down (residual > 0)',
    holds: () => {
      const w2 = QUANTIZATION_TABLE.find((r) => r.naiveWidth === 2);
      return (
        w2.k === 9 &&
        Math.abs(w2.exactGaps - 8.5599) < 1e-3 &&
        w2.residual < 0 &&
        Math.abs(w2.residual - -0.1028254) < 1e-6 &&
        QUANTIZATION_TABLE.some((r) => r.residual > 0)
      );
    },
  },
  {
    // Honesty gate: measurement only, uniform surrogate, no certification, no QED, no refereed bound is changed.
    id: 'imp35816-honesty-gate-no-qed',
    description: 'Measurement only; uniform mean-gap surrogate; certifies no floor; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35816_SHORT_EDGE_DELTA_INTEGER_GAP_DEVIATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /UNIFORM mean-gap surrogate/.test(IMP35816_SHORT_EDGE_DELTA_INTEGER_GAP_DEVIATION.surrogateCaveat) &&
      /certifies no floor delta_short > 0/.test(IMP35816_SHORT_EDGE_DELTA_INTEGER_GAP_DEVIATION.verdict) &&
      /changes no bound/.test(IMP35816_SHORT_EDGE_DELTA_INTEGER_GAP_DEVIATION.verdict) &&
      /NO QED/.test(IMP35816_SHORT_EDGE_DELTA_INTEGER_GAP_DEVIATION.verdict) &&
      /refereed bound is changed/i.test(IMP35816_SHORT_EDGE_DELTA_INTEGER_GAP_DEVIATION.verdict),
  },
];

for (const a of IMP35816_SHORT_EDGE_DELTA_INTEGER_GAP_DEVIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35816-short-edge-delta-integer-gap-deviation assertion failed: ${a.id}`);
  }
}
