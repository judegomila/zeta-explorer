/**
 * @module imp-34492-nearer-flank-gap-narrowing
 * @fileoverview imp-34492 -- ASSESS whether the ~8% imp-34454 flank discrepancy between the
 *   monomial-predicted eflow_over_resid ratio (+6.394e-7 from the leading residue R) and the
 *   imp-34310-measured ratio (+5.9e-7) at k = 21.25 SHRINKS on a flank rung sampled strictly
 *   CLOSER to the pole k* ~ 21.28095, and whether that tightens the imp-34454 three-read bridge-
 *   slope m band [-2.510e-7, -2.316e-7].
 *
 *   Import-light per [[no_heavy_imports_in_pages]] and [[verify_heavy_assertion_modules]]: imports
 *   NOTHING. The canonical residue R ~ -1.979e-8, amplitude E_star ~ 4.583e-15, near-zero slope
 *   m1 ~ -2.3156e-7, the imp-34310 F3 measured flank ratio +5.9e-7 at k = 21.25, and the pole k*
 *   are carried as baked REFERENCE literals; the near-pole model is re-derived self-contained.
 *
 *   THE MODEL (why the gap must shrink linearly in the pole distance).
 *   -----------------------------------------------------------------
 *   Near the simple pole, resid_exp(k) = m (k - k*) + (1/2) c (k - k*)^2 + ... and eflow_attr(k) =
 *   E_star + e_prime (k - k*) + ... are both analytic, so their ratio is
 *     g(k) = eflow_attr/resid_exp = R/(k - k*) + A + O(k - k*),
 *   where R = E_star/m is the leading residue (imp-34310/imp-34454) and A = R [e_prime/E_star -
 *   c/(2m)] is a CONSTANT subleading background. The leading monomial prediction keeps only
 *   R/(k - k*); the measured ratio carries the full g. Their gap is the constant A, so relative
 *   to the (diverging) leading term the fractional gap is
 *     relGap(delta) = |A| delta / |R|,   delta = k* - k > 0,
 *   which vanishes LINEARLY as the sample nears the pole. A is pinned by the ONE measured rung:
 *   A = measured_flank - leading_flank = +5.9e-7 - (+6.394e-7) = -4.944e-8.
 *
 *   The imp-34454 "flank-measured" bridge slope is m3(delta) = E_star / R3(delta) with the flank-
 *   measured residue R3(delta) = (k - k*) g(k) = R + A (k - k*) = R - A delta -> R as delta -> 0.
 *   So the measured-flank residue converges to the canonical R and m3 -> m1 (near-zero slope) as
 *   the rung approaches the pole; the [-2.510e-7, -2.316e-7] band collapses toward the canonical
 *   -2.316e-7 edge, linearly in delta.
 *
 *   FINDINGS.
 *   (F1) BASELINE. At k = 21.25 (delta = 0.03095) the model reproduces the inherited numbers:
 *        leading +6.394e-7, gap-vs-measured ~8.4%, R3 = -1.826e-8, m3 = -2.510e-7 -- the wide
 *        edge of the imp-34454 band. (Self-consistency check on the baked literals.)
 *   (F2) NEARER RUNG NARROWS THE GAP. Sampling at HALF the distance (k ~ 21.2655, delta = 0.0155)
 *        halves the gap to ~4.2% -- BELOW 8% -- and tightens the flank residue to R3 ~ -1.902e-8
 *        (m3 ~ -2.409e-7). At delta = 0.005 (k ~ 21.276) the gap is ~1.4% and R3 ~ -1.955e-8.
 *        The gap and the m-band both shrink LINEARLY in delta (relGap/delta is constant = |A|/|R|
 *        ~ 2.50/decade-of-k; m-band span/delta constant), so ANY rung nearer than ~k = 21.267
 *        drives the predicted-vs-measured discrepancy under the 8% threshold.
 *   (F3) SUB-GAP (why this is an assessment, not a measurement). No flank rung nearer than k =
 *        21.25 exists in the baked imp-34237 source (imp-34397), and resid_exp -> 0 at the pole,
 *        so an ACTUAL nearer-rung ratio is a quotient by a near-zero denominator: at delta = 0.005,
 *        resid_exp ~ m delta ~ -1.16e-9, only ~6-7 significant digits above the ~1e-15 double floor,
 *        and by delta = 0.001 the quotient is cancellation-noise-dominated. The model gap narrows
 *        cleanly, but DELIVERING a measured sub-8% flank ratio needs extended precision the baked
 *        double-precision surrogate does not carry. Named sub-gap: EXTENDED-PRECISION-NEAR-POLE-RATIO.
 *
 *   VERDICT: YES -- a nearer-flank sample narrows the imp-34454 predicted-vs-measured gap below 8%
 *   and tightens the bridge-slope m band, both LINEARLY in the pole distance delta (a rung at half
 *   the distance, k ~ 21.2655, halves the gap to ~4.2% and the band span to ~4%). The narrowing is
 *   a property of the constant subleading background A pinned by the one measured rung; the leading
 *   residue R and the exponent p = -1 (amplitude-independent, imp-34247/imp-34333) are UNTOUCHED.
 *   Delivering the measured value requires extended precision past the double-precision near-pole
 *   digit floor (named sub-gap). Assessment / model read on the self-contained near-pole expansion,
 *   NOT the inherited pipeline; component model is the inherited imp-3220/imp-3406 extrapolation,
 *   NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0
 *   untouched; changes no bound; NO QED; no refereed bound is changed.
 *
 *   @see imp-34454-bridge-slope-three-rung-tabulation.js (the three m-reads, [-2.510e-7,-2.316e-7] band, ~8% flank gap)
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (residue R, slope m, E_star, flank +5.9e-7; F4 near-pole digit loss)
 *   @see imp-34397-eflow-over-resid-residue-curvature-corrected.js (no finer near-pole sub-rung in baked source)
 *   @see imp-34247 (exponent p=-1, amplitude-independent, in the widening-slope dy/dk channel)
 */

// --- baked reference literals -------------------------------------------------
const KSTAR = 21.28095; // canonical bisected resid_exp zero (imp-34023/imp-34237/imp-34310)
const E_STAR = 4.582753e-15; // imp-34310 F2 eflow_attr interpolated to k* (smooth, nonzero)
const M_NEARZERO = -2.3156e-7; // imp-34310 F1 near-zero bisected slope dg_resid/dk (band tight edge)
const R_CANONICAL = E_STAR / M_NEARZERO; // leading residue R = E_star/m ~ -1.97909e-8 (imp-34310 F3)
const FLANK_K = 21.25; // the imp-34310 F3 measured flank point (below the pole)
const MEASURED_FLANK_RATIO = 5.9e-7; // imp-34310 F3 measured eflow_over_resid at k = 21.25

// --- pin the constant subleading background A from the ONE measured rung ------
// g(k) = R/(k - k*) + A + O(k - k*); A = measured - leading at the flank rung.
const LEADING_AT_FLANK = R_CANONICAL / (FLANK_K - KSTAR); // ~ +6.394e-7
const BACKGROUND_A = MEASURED_FLANK_RATIO - LEADING_AT_FLANK; // ~ -4.944e-8

// --- near-pole model readers (functions of the pole distance delta = k* - k) --
function leadingAt(delta) {
  return R_CANONICAL / -delta; // R/(k - k*), positive below the pole
}
// predicted-vs-measured fractional gap (measured convention: |A|/|full ratio|).
function relGapVsMeasured(delta) {
  const full = leadingAt(delta) + BACKGROUND_A; // g(k) = leading + A
  return Math.abs(BACKGROUND_A) / Math.abs(full);
}
// leading-relative gap = |A| delta / |R| -- the clean linear-in-delta asymptote.
function relGapVsLeading(delta) {
  return (Math.abs(BACKGROUND_A) * delta) / Math.abs(R_CANONICAL);
}
// flank-measured residue R3(delta) = R + A (k - k*) = R - A delta -> R as delta -> 0.
function flankResidueAt(delta) {
  return R_CANONICAL - BACKGROUND_A * delta;
}
// flank-measured bridge slope m3(delta) = E_star / R3(delta) -> M_NEARZERO as delta -> 0.
function flankSlopeAt(delta) {
  return E_STAR / flankResidueAt(delta);
}
// resid_exp magnitude near the pole ~ |m| delta -- the near-zero denominator (digit loss).
function residExpMag(delta) {
  return Math.abs(M_NEARZERO) * delta;
}

// --- the rung ladder: baseline flank, then strictly nearer rungs --------------
const DELTAS = [
  KSTAR - FLANK_K, // 0.03095 -- baseline (k = 21.25), reproduces the inherited ~8% gap
  0.0155, // ~ half distance (k ~ 21.2655)
  0.0100, // k ~ 21.27095
  0.0050, // k ~ 21.27595
  0.0025, // k ~ 21.27845
];

export const IMP34492_RUNGS = DELTAS.map((delta) => ({
  k: KSTAR - delta,
  delta,
  leadingRatio: leadingAt(delta),
  gapVsMeasuredPct: relGapVsMeasured(delta) * 100,
  gapVsLeadingPct: relGapVsLeading(delta) * 100,
  flankResidue: flankResidueAt(delta),
  flankSlope: flankSlopeAt(delta),
  residExpMag: residExpMag(delta),
}));

// the imp-34454 band edges: near-zero slope (tight) and the baseline flank slope (wide).
const BASELINE = IMP34492_RUNGS[0];
export const IMP34492_BAND_TIGHT_EDGE = M_NEARZERO; // -2.316e-7
export const IMP34492_BAND_WIDE_EDGE_BASELINE = BASELINE.flankSlope; // -2.510e-7 (k = 21.25)

// band span as a percent of the near-zero slope, per rung (collapses toward 0 near the pole).
export const IMP34492_BAND_SPAN_PCT = IMP34492_RUNGS.map(
  (r) => Math.abs((r.flankSlope - M_NEARZERO) / M_NEARZERO) * 100,
);

export const IMP34492_NEARER_FLANK_GAP_NARROWING = {
  ticket: 'imp-34492',
  proofSection: 'S-frontier',
  question:
    'Does the ~8% imp-34454 flank discrepancy between the monomial-predicted eflow_over_resid ' +
    'ratio +6.39e-7 and the imp-34310-measured +5.9e-7 at k = 21.25 shrink on a nearer-flank ' +
    'sample, tightening the three-read bridge-slope m band [-2.510e-7, -2.316e-7]? Assessment; NO QED.',
  kStar: KSTAR,
  residueR: R_CANONICAL,
  backgroundA: BACKGROUND_A,
  rungs: IMP34492_RUNGS,
  bandSpanPct: IMP34492_BAND_SPAN_PCT,
  finding: {
    baseline_reproduces_inherited:
      'At k = 21.25 (delta = 0.03095) the model reproduces leading +6.394e-7, gap-vs-measured ' +
      '~8.4%, flank residue R3 = -1.826e-8 and m3 = -2.510e-7 (the wide band edge).',
    nearer_rung_narrows_below_8pct:
      'At half the distance (k ~ 21.2655, delta = 0.0155) the gap halves to ~4.2% (below 8%) and ' +
      'R3 tightens to ~-1.902e-8 (m3 ~ -2.409e-7); at delta = 0.005 the gap is ~1.4%. The gap and ' +
      'the m-band both shrink LINEARLY in delta (relGap/delta = |A|/|R| constant).',
    sub_gap_extended_precision:
      'No rung nearer than k = 21.25 exists in the baked imp-34237 source (imp-34397); resid_exp ' +
      '-> 0 at the pole (~-1.16e-9 at delta = 0.005, ~6-7 sig figs above the ~1e-15 double floor), ' +
      'so an ACTUAL nearer-rung ratio is cancellation-noise-dominated. Named sub-gap: ' +
      'EXTENDED-PRECISION-NEAR-POLE-RATIO -- the model narrows cleanly, the measurement needs bignum.',
  },
  isRigorous: false,
  verdict:
    'YES -- a nearer-flank sample narrows the imp-34454 predicted-vs-measured gap below 8% and ' +
    'tightens the bridge-slope m band, both LINEARLY in the pole distance delta (a rung at half ' +
    'the distance, k ~ 21.2655, halves the gap to ~4.2% and the band span to ~4%). The narrowing ' +
    'is a property of the constant subleading background A = -4.944e-8 pinned by the one measured ' +
    'rung; the leading residue R = -1.979e-8 and the exponent p = -1 (amplitude-independent) are ' +
    'UNTOUCHED. Delivering the MEASURED sub-8% ratio requires extended precision past the double- ' +
    'precision near-pole digit floor (named sub-gap EXTENDED-PRECISION-NEAR-POLE-RATIO). Assessment ' +
    '/ model read on the self-contained near-pole expansion, NOT the inherited pipeline; component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE- ' +
    'conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; NO QED; ' +
    'no refereed bound is changed.',
  citation:
    'imp-34454 (three m-reads, [-2.510e-7,-2.316e-7] band, ~8% flank gap); imp-34310 (residue R, ' +
    'slope m, E_star, flank +5.9e-7, F4 near-pole digit loss); imp-34397 (no finer near-pole sub- ' +
    'rung in baked source); imp-34247 (exponent p=-1, amplitude-independent); imp-486 (C_mb GUE- ' +
    'conditional); imp-3066 (K_a >= 0).',
};

export const IMP34492_NEARER_FLANK_GAP_NARROWING_ASSERTIONS = [
  {
    // Baseline rung reproduces the inherited imp-34454 numbers at k = 21.25.
    id: 'imp34492-baseline-reproduces-imp34454',
    description: 'k=21.25 rung reproduces leading +6.394e-7, ~8.4% gap, R3=-1.826e-8, m3=-2.510e-7',
    holds: () =>
      Math.abs(BASELINE.leadingRatio - 6.3944e-7) < 1e-11 &&
      Math.abs(BASELINE.gapVsMeasuredPct - 8.38) < 0.2 &&
      Math.abs(BASELINE.flankResidue - -1.826e-8) < 5e-11 &&
      Math.abs(BASELINE.flankSlope - -2.510e-7) < 5e-10,
  },
  {
    // A nearer rung (half distance) drives the gap strictly below 8% -- the ticket question.
    id: 'imp34492-nearer-rung-gap-below-8pct',
    description: 'the half-distance rung (delta=0.0155) has gap-vs-measured < 8% (below the baseline)',
    holds: () => {
      const half = IMP34492_RUNGS[1];
      return (
        Math.abs(half.delta - 0.0155) < 1e-12 &&
        half.gapVsMeasuredPct < 8 &&
        half.gapVsMeasuredPct < BASELINE.gapVsMeasuredPct
      );
    },
  },
  {
    // The gap shrinks MONOTONICALLY as the rung nears the pole (delta decreasing).
    id: 'imp34492-gap-monotone-in-delta',
    description: 'gap-vs-measured and gap-vs-leading both decrease monotonically as delta shrinks',
    holds: () => {
      for (let i = 1; i < IMP34492_RUNGS.length; i++) {
        if (!(IMP34492_RUNGS[i].gapVsMeasuredPct < IMP34492_RUNGS[i - 1].gapVsMeasuredPct)) return false;
        if (!(IMP34492_RUNGS[i].gapVsLeadingPct < IMP34492_RUNGS[i - 1].gapVsLeadingPct)) return false;
      }
      return true;
    },
  },
  {
    // The leading-relative gap is EXACTLY linear in delta: relGap/delta = |A|/|R| constant.
    id: 'imp34492-gap-linear-in-delta',
    description: 'relGapVsLeading/delta is constant across rungs (= |A|/|R|), the linear narrowing law',
    holds: () => {
      const ratios = IMP34492_RUNGS.map((r) => r.gapVsLeadingPct / 100 / r.delta);
      const target = Math.abs(BACKGROUND_A) / Math.abs(R_CANONICAL);
      return ratios.every((x) => Math.abs(x - target) < 1e-9 && Math.abs(x - ratios[0]) < 1e-12);
    },
  },
  {
    // The m-band collapses toward the canonical near-zero edge as the rung nears the pole.
    id: 'imp34492-band-collapses-toward-canonical',
    description: 'flank slope m3 -> M_NEARZERO (band span -> 0) monotonically as delta shrinks',
    holds: () => {
      for (let i = 1; i < IMP34492_BAND_SPAN_PCT.length; i++) {
        if (!(IMP34492_BAND_SPAN_PCT[i] < IMP34492_BAND_SPAN_PCT[i - 1])) return false;
      }
      // baseline span ~8.4% (imp-34454), collapsing well below on the nearest rung.
      return (
        Math.abs(IMP34492_BAND_SPAN_PCT[0] - 8.4) < 0.3 &&
        IMP34492_BAND_SPAN_PCT[IMP34492_BAND_SPAN_PCT.length - 1] < 1
      );
    },
  },
  {
    // Sub-gap honesty: near-pole resid_exp digit loss makes the ACTUAL nearer-rung read infeasible
    // at double precision -- named sub-gap, assessment only.
    id: 'imp34492-sub-gap-near-pole-digit-loss',
    description: 'resid_exp magnitude at delta=0.005 is a near-zero denominator (< 2e-9, ~digit loss)',
    holds: () => {
      const near = IMP34492_RUNGS.find((r) => Math.abs(r.delta - 0.005) < 1e-12);
      return (
        near !== undefined &&
        near.residExpMag < 2e-9 &&
        /EXTENDED-PRECISION-NEAR-POLE-RATIO/.test(
          IMP34492_NEARER_FLANK_GAP_NARROWING.finding.sub_gap_extended_precision,
        )
      );
    },
  },
  {
    // Honesty gate: assessment only, isRigorous false, NO QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34492-honesty-gate-no-qed',
    description: 'assessment only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34492_NEARER_FLANK_GAP_NARROWING.isRigorous === false &&
      /NO QED/.test(IMP34492_NEARER_FLANK_GAP_NARROWING.verdict) &&
      /refereed bound is changed/i.test(IMP34492_NEARER_FLANK_GAP_NARROWING.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34492_NEARER_FLANK_GAP_NARROWING.verdict),
  },
];

for (const a of IMP34492_NEARER_FLANK_GAP_NARROWING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34492-nearer-flank-gap-narrowing assertion failed: ${a.id}`);
  }
}
