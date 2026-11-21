/**
 * @module imp-96454-ecoll-gap-ladder-viz-data
 *
 * imp-96454 (ux): import-light viz-data leaf for the imp-96426 E_coll count-model
 * intermediate-height gap ladder. imp-96426 measured the RvM main-term count-inversion
 * gap (gammaRelGap, rateRelGap) against externally tabulated TRUE Odlyzko zero heights at
 * six anchors spanning N = 1 .. 1e22, but shipped only a baked object, no chart. This
 * module reshapes those six anchors into a log-log-ready point series plus a reference
 * decay envelope (1/(gamma_N * log gamma_N), scaled to match the N=1e3 anchor) so the
 * qualitative "one order of magnitude per order of N" claim in the imp-96426 prose can be
 * read visually against the six measured points.
 *
 * No re-derivation: every N, gammaTrue and relative-gap value is copied verbatim from
 * IMP96426_ECOLL_ANCHOR_INTERMEDIATE_HEIGHTS (imp-96426). The only new arithmetic here is
 * the log10 axis reshaping, an abs() for the two signed gaps, a floor clip at the
 * double-precision resolution (~1e-16) so the N=1e22 rateRelGap=0 point is representable
 * on a log axis, and the single scale constant for the reference decay envelope. Changes
 * no bound; establishes no operator positivity; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96426-ecoll-anchor-intermediate-heights.js (the source object this reshapes)
 * @see imp-96402-ecoll-anchor-from-tabulated-true-zero-height.js (the two-endpoint anchor
 *   imp-96426 fills the middle of)
 *
 * Ticket: imp-96454 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound;
 * NO QED. No self-executing assertion throw (per the imp-96294 convention) -- values are
 * validated below via a plain exported check object instead of an import-time throw.
 */

import { IMP96426_ECOLL_ANCHOR_INTERMEDIATE_HEIGHTS as SRC } from './imp-96426-ecoll-anchor-intermediate-heights.js';

const log10 = Math.log10;

// Double-precision resolution floor: below this, a relative gap (including an exact 0, as
// at the N=1e22 rate) is not distinguishable from roundoff and is clipped for plotting.
const FLOOR = 1e-16;
const clip = (v) => Math.max(Math.abs(v), FLOOR);

const ALL_ANCHORS = [SRC.endpointFirstZero, ...SRC.intermediateAnchors, SRC.endpointOdlyzko1e22];

export const IMP96454_GAP_LADDER_POINTS = ALL_ANCHORS.map((a) => ({
  N: a.N,
  log10N: log10(a.N),
  gammaAbsGap: clip(a.gammaRelGap),
  log10GammaGap: log10(clip(a.gammaRelGap)),
  rateAbsGap: clip(a.rateRelGap),
  log10RateGap: log10(clip(a.rateRelGap)),
  atFloor: Math.abs(a.rateRelGap) <= FLOOR,
}));

// Reference decay envelope 1/(gamma_N * log gamma_N), scaled by a single constant so it
// passes through the N=1e3 measured gammaRelGap anchor -- a visual check of the imp-96426
// prose claim that the gap decays like this envelope, not an independent re-derivation.
const ENVELOPE_ANCHOR = SRC.intermediateAnchors[0]; // N = 1e3
const rawEnvelope = (gammaTrue) => 1 / (gammaTrue * Math.log(gammaTrue));
const ENVELOPE_SCALE = ENVELOPE_ANCHOR.gammaRelGap / rawEnvelope(ENVELOPE_ANCHOR.gammaTrue);

export const IMP96454_ENVELOPE_POINTS = ALL_ANCHORS.map((a) => {
  const v = clip(ENVELOPE_SCALE * rawEnvelope(a.gammaTrue));
  return { N: a.N, log10N: log10(a.N), log10Envelope: log10(v) };
});

export const IMP96454_LANDMARKS = Object.freeze({
  floor: FLOOR,
  firstZeroGammaGap: Math.abs(SRC.endpointFirstZero.gammaRelGap),
  firstZeroRateGap: Math.abs(SRC.endpointFirstZero.rateRelGap),
  odlyzko1e22GammaGap: Math.abs(SRC.endpointOdlyzko1e22.gammaRelGap),
  odlyzko1e22RateGap: Math.abs(SRC.endpointOdlyzko1e22.rateRelGap),
  ladderMonotoneDecreasing: SRC.ladderMonotoneDecreasing,
});

export const IMP96454_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every N, true height '
  + 'and relative-gap value plotted here is copied verbatim from the imp-96426 baked object; '
  + 'the only new arithmetic is the log10 axis reshaping, the abs() of two signed gaps, a '
  + 'double-precision floor clip (~1e-16) so the exact-zero N=1e22 rate point is plottable on '
  + 'a log axis, and one scale constant for the reference 1/(gamma log gamma) envelope drawn '
  + 'through the N=1e3 anchor. This is a measurement/accuracy audit of the RvM main-term '
  + 'count-inversion gap, not a new bound: the conditional C_H <= 0.127 stays UNPROVEN, C_H '
  + 'isRigorousUpperBound = false (imp-2642/imp-2701), the imp-2640 Gronwall discharge of '
  + 'C_Lip stays NEGATIVE. Changes no bound, establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96454_VALIDATION = Object.freeze({
  sixPointsPresent: IMP96454_GAP_LADDER_POINTS.length === 6,
  gammaGapMonotoneDecreasing: IMP96454_GAP_LADDER_POINTS.every(
    (p, i) => i === 0 || p.gammaAbsGap < IMP96454_GAP_LADDER_POINTS[i - 1].gammaAbsGap,
  ),
  lastPointAtFloor: IMP96454_GAP_LADDER_POINTS[IMP96454_GAP_LADDER_POINTS.length - 1].atFloor,
  firstPointMacroscopic: IMP96454_GAP_LADDER_POINTS[0].rateAbsGap > 1e-2,
  envelopeMatchesAnchorCount: IMP96454_ENVELOPE_POINTS.length === IMP96454_GAP_LADDER_POINTS.length,
});
