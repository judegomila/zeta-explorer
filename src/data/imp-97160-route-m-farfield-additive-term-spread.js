/**
 * @module imp-97160-route-m-farfield-additive-term-spread
 * @fileoverview imp-97160 -- import-light MEASUREMENT: size the imp-96750 O(1) ADDITIVE-term
 *   residual to the far-field Route M conditioning ceiling F SEPARATELY from the imp-97142
 *   interior-slope band, and report the COMBINED LAYER-(ii) spread against both the slope-only
 *   band [-2.035%, +0.389%] and the ORIGINAL imp-96982 +1.37%..+8.36% band.
 *
 *   WHAT imp-97142 LEFT OPEN
 *   -----------------------------------------------
 *   imp-97142 propagated the imp-96667 interior-slope band s* in 5.66..5.80 through the
 *   F = slope-derived placement F(s_star) = F_center * (s_star over s_star_center) and an fPctVsLine
 *   INTERVAL of [-2.035%, +0.389%] (width ~2.42 pp). It EXPLICITLY flagged that the O(1) ADDITIVE
 *   term -- the intercept needed to fix F as a VALUE, not just a slope -- is a SECOND, separate
 *   residual not captured by the slope propagation, so the true LAYER-(ii) spread is AT LEAST that
 *   wide. This ticket sizes that second residual and combines the two.
 *
 *   THE SECOND RESIDUAL: the O(1) additive term of the interior second moment
 *   -----------------------------------------------
 *   The interior Frobenius second moment is Int(N) = s* log N + c1 + o(1). imp-97142 carried only
 *   the SLOPE s*; the additive intercept c1 is the imp-96750 O(1) term (Q(b) <= s0* b + O(1); the
 *   O(1) is genuinely unpinned by the reduction). The near-field OLS fit (imp-96667, eight rungs
 *   N in [250,6000], value ~ a + b log N) MEASURES this intercept:
 *       interior fit:  a_int = -14.92890   (b = 5.65640)
 *       total fit:     a_tot =  -5.48391   (b = 5.80481)  (interior + a=1 border; larger scope)
 *   Both intercepts are NEGATIVE: the additive term pulls the second-moment level -- and hence F --
 *   DOWN relative to the pure-slope estimate.
 *
 *   THE PROPAGATION (additive term as a fraction of the slope level)
 *   -----------------------------------------------
 *   At the ceiling scale N* ~ 3.775e7, log N* = 17.4465, so the pure-slope level is
 *       s*_center * log N* = 5.76 * 17.4465 = 100.492.
 *   imp-97142 propagated the slope by scaling F with s* (proportional to this level). The O(1)
 *   additive term shifts the level by c1, so its proportional contribution to F is
 *       addPct = c1 / (s*_center * log N*) * 100.
 *   Evaluating:
 *       interior intercept c1 = -14.929  ->  addPct = -14.86%   (a downward shift, 6.11x the band)
 *       total    intercept c1 =  -5.484  ->  addPct =  -5.46%   (a downward shift, 2.25x the band)
 *   vs the imp-97142 slope band, which in the SAME proportional model spans (slope width in level
 *   units = 0.14 * 17.4465 = 2.4425) => 2.43 pp. So the additive term ALONE is 2.2x..6.1x the
 *   entire slope band.
 *
 *   MODEL-INDEPENDENT RATIO (the robust part)
 *   -----------------------------------------------
 *   F depends on both parameters only through the second-moment LEVEL s* log N + c1, whether F is
 *   taken PROPORTIONAL to the level (the imp-97142 model) or read off the imp-96667 sqrt(level)
 *   conditioning crossing (fro = sqrt(s* log N + a), solveCeiling). In BOTH models the overall
 *   crossing prefactor CANCELS in the additive/slope ratio, leaving
 *       ratio = |c1| / (delta_s* * log N*)   =   14.929 / 2.4425 = 6.11 (interior)
 *                                            =    5.484 / 2.4425 = 2.25 (total).
 *   Cross-check in the imp-96667 sqrt-log crossing model (p = 1.917927): the additive term moves F
 *   by 3.82% and the slope band by 0.62% -- both ~4x smaller in absolute terms than the
 *   proportional model, but the RATIO is identically 6.11. So the "additive dominates by ~6x"
 *   conclusion is model-independent; only the absolute pp scale is model-dependent.
 *
 *   COMBINED SPREAD AND SURVIVAL VERDICT
 *   -----------------------------------------------
 *   Adding the additive shift to the slope-band width, the combined LAYER-(ii) spread is
 *       total-intercept scope:    2.43 + 5.46 =  7.89 pp
 *       interior-intercept scope: 2.43 + 14.86 = 17.29 pp
 *   i.e. COMPARABLE TO OR WIDER THAN the ORIGINAL imp-96982 band (+1.37%..+8.36%, width 6.99 pp)
 *   that this whole far-field discriminator was meant to narrow. So the imp-97142/imp-97081 value
 *   pinning is much weaker than the slope-only 2.42 pp suggested. BUT because both intercepts are
 *   NEGATIVE, the additive term pushes F FURTHER BELOW the +1.369% floor, so the imp-97118/imp-97142
 *   inside/outside verdict (outside the original band, on the LOW side; quadratic top rejected) is
 *   REINFORCED, not threatened: the qualitative bit is more robust, the exact value far less pinned.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A sensitivity MEASUREMENT that sizes the O(1) additive residual separately from the slope band
 *   and reports the model-independent ratio and combined spread. It instantiates no interval
 *   CERTIFICATE, closes no sub-gap, moves no bound, establishes no operator positivity. The O(1)
 *   term is sized by the near-field FIT intercept (measured, not certified; the imp-96750 reduction
 *   leaves the O(1) unpinned), and the near-field intercept may already be partly baked into
 *   F_center, so this is an upper-side sizing of the additive residual, not a correction to F. The
 *   only rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds
 *   first by >2600x regardless. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97142-route-m-farfield-ceiling-slope-band-interval (the slope-only band this augments)
 * @see imp-97081-route-m-farfield-ceiling-interior-anchor-discriminator (the point anchor F)
 * @see imp-96982-frobenius-holdout-quadratic-favoured-glossary-headword (the original +1.37%..+8.36% band)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (the O(1) additive residual, unpinned)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic (the measured fit intercepts a_int, a_tot)
 *
 * Ticket: imp-97160 (numerical, opus-4-8, api-pool). Measurement + additive-term sizing + combined
 * spread + survival verdict; no bound moved; NO QED; no refereed bound is changed.
 */

// -- Inputs (baked from the sibling modules; all measured, none certified). ----------------------
const LINE_NSTAR = 3.7865e7; // imp-97081 line baseline
const F_CENTER = 3.775e7; // imp-97081 interior-norm anchor F at s* = 5.76
const S_CENTER = 5.76; // s* = 2 zeta(2) s0
const SLOPE_LO = 5.66; // imp-96667 interior slope band lo
const SLOPE_HI = 5.8; // imp-96667 interior slope band hi
const A_INTERIOR = -14.9289; // imp-96667 interior OLS intercept (the O(1) additive term)
const A_TOTAL = -5.48391; // imp-96667 total OLS intercept (interior + a=1 border)
const CROSSING_P = 1.917927; // imp-96667 lam_min = A N^-p exponent (for the sqrt-log cross-check)

// The ceiling-scale log, and the pure-slope second-moment level at that scale.
const LOG_NSTAR = Math.log(F_CENTER); // 17.4465
const SLOPE_LEVEL = S_CENTER * LOG_NSTAR; // 100.492 = s* log N*
const SLOPE_BAND_LEVEL = (SLOPE_HI - SLOPE_LO) * LOG_NSTAR; // 2.4425 = width of slope band in level units

// -- The slope-only band (imp-97142) in the proportional-to-level model. -------------------------
const slopePct = (SLOPE_BAND_LEVEL / SLOPE_LEVEL) * 100; // ~2.43 pp (reproduces imp-97142 width)

// -- The additive-term contribution (this ticket): additive shift as a fraction of the level. ----
const additivePct = (c1) => (c1 / SLOPE_LEVEL) * 100; // negative => downward shift of F

export const IMP97160_ADDITIVE_TERM = Object.freeze({
  logNstar: LOG_NSTAR, // 17.4465
  slopeLevel: SLOPE_LEVEL, // 100.492 = s* log N*
  interceptInterior: A_INTERIOR, // -14.9289 (O(1) additive term, interior fit)
  interceptTotal: A_TOTAL, // -5.48391 (O(1) additive term, total fit)
  addPctInterior: additivePct(A_INTERIOR), // ~ -14.86 pp (downward)
  addPctTotal: additivePct(A_TOTAL), // ~ -5.46 pp (downward)
});

// -- Model-independent additive/slope ratio (the crossing prefactor cancels). --------------------
export const IMP97160_RATIO = Object.freeze({
  slopeBandWidthPp: slopePct, // ~2.43 pp (imp-97142 slope band, proportional model)
  ratioInterior: Math.abs(A_INTERIOR) / SLOPE_BAND_LEVEL, // ~6.11x
  ratioTotal: Math.abs(A_TOTAL) / SLOPE_BAND_LEVEL, // ~2.25x
  // sqrt-log crossing cross-check: absolute pp are ~4x smaller, but the ratio is identical.
  crossingSlopePp:
    (LOG_NSTAR / (2 * SLOPE_LEVEL * CROSSING_P + S_CENTER)) * (SLOPE_HI - SLOPE_LO) * 100, // ~0.62 pp
  crossingAddPctInterior:
    (1 / (2 * SLOPE_LEVEL * CROSSING_P + S_CENTER)) * Math.abs(A_INTERIOR) * 100, // ~3.82 pp
});

// -- The COMBINED LAYER-(ii) spread vs the slope-only band and the original imp-96982 band. -------
const ORIGINAL_BAND_WIDTH_PP = 8.356 - 1.369; // 6.987 pp (imp-96982 +1.37%..+8.36%)
export const IMP97160_COMBINED_SPREAD = Object.freeze({
  slopeOnlyWidthPp: slopePct, // ~2.43 pp (imp-97142)
  combinedTotalPp: Math.abs(slopePct) + Math.abs(additivePct(A_TOTAL)), // ~7.89 pp
  combinedInteriorPp: Math.abs(slopePct) + Math.abs(additivePct(A_INTERIOR)), // ~17.29 pp
  originalBandWidthPp: ORIGINAL_BAND_WIDTH_PP, // 6.987 pp
  // The combined spread (even the smaller total-intercept estimate) reaches/exceeds the original band.
  combinedReachesOriginalBand:
    Math.abs(slopePct) + Math.abs(additivePct(A_TOTAL)) > ORIGINAL_BAND_WIDTH_PP, // true (7.89 > 6.99)
  // Both intercepts negative => additive pushes F DOWN, further below the +1.369% floor.
  additiveDirectionDownward: A_INTERIOR < 0 && A_TOTAL < 0,
  insideOutsideVerdictReinforced: true, // downward shift reinforces "outside the band, LOW side"
  exactValuePinned: false, // combined spread ~8..17 pp; far less pinned than slope-only 2.43 pp
});

export const IMP97160_VERDICT = Object.freeze({
  id: 'imp-97160',
  proofSection: 'Route-M',
  sizes: 'imp-97142 LAYER (ii) O(1) additive residual',
  question:
    'Sizing the imp-96750 O(1) ADDITIVE-term residual SEPARATELY from the imp-97142 interior-slope ' +
    'band, how large is its contribution to the far-field ceiling F, and what is the COMBINED ' +
    'LAYER-(ii) spread against the slope-only band [-2.035%, +0.389%] and the original imp-96982 ' +
    '+1.37%..+8.36% band?',
  additiveDominatesSlopeBand: true, // 2.25x..6.11x, model-independent ratio
  ratioInterior: Math.abs(A_INTERIOR) / SLOPE_BAND_LEVEL, // ~6.11x
  ratioTotal: Math.abs(A_TOTAL) / SLOPE_BAND_LEVEL, // ~2.25x
  ratioModelIndependent: true, // same in proportional and sqrt-log crossing models
  combinedSpreadReachesOriginalBand: true, // ~7.89..17.29 pp vs original 6.99 pp
  additiveShiftDownward: true, // negative intercepts push F below, reinforcing outside-low
  insideOutsideVerdictReinforced: true,
  exactValuePinned: false,
  anyBoundMoved: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x regardless
  conclusion:
    'The imp-96750 O(1) ADDITIVE term -- the intercept needed to fix F as a VALUE not a slope -- is ' +
    'the SECOND, separate LAYER-(ii) residual imp-97142 flagged but did not size. The near-field ' +
    'imp-96667 fit measures it as the OLS intercept: interior a = -14.929, total a = -5.484 (both ' +
    'NEGATIVE). Propagated as a fraction of the pure-slope level s* log N* = 100.49, it contributes ' +
    'addPct = -14.86% (interior) or -5.46% (total) to F -- i.e. 2.25x..6.11x the entire imp-97142 ' +
    'slope band (2.43 pp). This additive/slope ratio ~6.11x is MODEL-INDEPENDENT (identical in the ' +
    'imp-97142 proportional-to-level model and the imp-96667 sqrt(level) conditioning crossing; the ' +
    'crossing prefactor cancels in the ratio). The COMBINED LAYER-(ii) spread is therefore ~7.89 pp ' +
    '(total intercept) to ~17.29 pp (interior intercept) -- COMPARABLE TO OR WIDER THAN the original ' +
    'imp-96982 band (6.99 pp) this discriminator was meant to narrow: the exact far-field value is ' +
    'much LESS pinned than the slope-only 2.42 pp suggested. But because both intercepts are ' +
    'NEGATIVE, the additive term pushes F FURTHER BELOW the +1.369% floor, so the imp-97118/imp-97142 ' +
    'inside/outside verdict (outside the original band, LOW side; quadratic top rejected) is ' +
    'REINFORCED -- the qualitative bit is more robust, the exact value far less pinned. Measurement ' +
    'only; the O(1) term is sized by the near-field FIT intercept (measured, not certified; the ' +
    'imp-96750 reduction leaves the O(1) unpinned); instantiates no interval certificate; the ' +
    'rigorous anchor stays T = 2.594e7; compute (N ~ 9916) binds first by >2600x; changes no bound; ' +
    'no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97160_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the imp-96750 O(1) ADDITIVE ' +
  'term (near-field fit intercept a = -14.929 interior / -5.484 total, both negative) contributes ' +
  'addPct = -14.86% / -5.46% to the far-field ceiling F -- 2.25x..6.11x the imp-97142 slope band ' +
  '(2.43 pp), a ratio that is model-independent (same in the proportional and sqrt-log crossing ' +
  'models). The COMBINED slope+additive LAYER-(ii) spread is ~7.89..17.29 pp, comparable to or ' +
  'wider than the original imp-96982 band (6.99 pp): the exact value is far less pinned than the ' +
  'slope-only 2.42 pp. Because the additive term is negative it pushes F further below the ' +
  '+1.369% floor, so the outside-low inside/outside verdict is REINFORCED. The O(1) term is sized ' +
  'by a measured (not certified) fit intercept; the only rigorous anchor is the trace ceiling ' +
  'T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x. No bound is claimed moved.';

export default IMP97160_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97160_ASSERTIONS = [
  {
    id: 'imp97160-slope-band-reproduces-imp97142-width',
    why: 'the proportional-model slope band width computed here must reproduce the imp-97142 ' +
      'slope-only band width (~2.42 pp) -- the additive sizing is layered on the SAME model.',
    holds: () =>
      Math.abs(IMP97160_RATIO.slopeBandWidthPp - 2.43) < 0.02 &&
      IMP97160_RATIO.slopeBandWidthPp > 2.3 &&
      IMP97160_RATIO.slopeBandWidthPp < 2.5,
  },
  {
    id: 'imp97160-additive-negative-and-downward',
    why: 'both measured fit intercepts must be NEGATIVE, so the additive term shifts F DOWNWARD, ' +
      'the basis for the outside-low verdict being reinforced rather than threatened.',
    holds: () =>
      IMP97160_ADDITIVE_TERM.interceptInterior < 0 &&
      IMP97160_ADDITIVE_TERM.interceptTotal < 0 &&
      IMP97160_ADDITIVE_TERM.addPctInterior < 0 &&
      IMP97160_ADDITIVE_TERM.addPctTotal < 0 &&
      IMP97160_COMBINED_SPREAD.additiveDirectionDownward === true,
  },
  {
    id: 'imp97160-additive-dominates-slope-band-model-independent',
    why: 'the additive/slope ratio must exceed 2x (total) and reach ~6x (interior), and the ' +
      'sqrt-log crossing cross-check must give the SAME ratio (crossing prefactor cancels).',
    holds: () => {
      const ratioCrossing =
        IMP97160_RATIO.crossingAddPctInterior / IMP97160_RATIO.crossingSlopePp;
      return (
        IMP97160_RATIO.ratioTotal > 2.0 &&
        IMP97160_RATIO.ratioInterior > 5.5 &&
        IMP97160_RATIO.ratioInterior < 6.5 &&
        Math.abs(ratioCrossing - IMP97160_RATIO.ratioInterior) < 1e-6
      );
    },
  },
  {
    id: 'imp97160-combined-spread-reaches-original-band',
    why: 'the combined slope+additive spread (even the smaller total-intercept estimate) must ' +
      'reach/exceed the original imp-96982 band width (6.99 pp): the value is far less pinned.',
    holds: () =>
      IMP97160_COMBINED_SPREAD.combinedTotalPp > IMP97160_COMBINED_SPREAD.originalBandWidthPp &&
      IMP97160_COMBINED_SPREAD.combinedInteriorPp > 15.0 &&
      IMP97160_COMBINED_SPREAD.combinedReachesOriginalBand === true &&
      IMP97160_COMBINED_SPREAD.exactValuePinned === false &&
      IMP97160_COMBINED_SPREAD.insideOutsideVerdictReinforced === true,
  },
  {
    id: 'imp97160-honesty-gate-no-qed',
    why: 'measurement only: no bound moved, exact value not pinned, additive dominates, compute ' +
      'binds first, and the honesty markers plus the sizing verdict are present.',
    holds: () =>
      IMP97160_VERDICT.anyBoundMoved === false &&
      IMP97160_VERDICT.exactValuePinned === false &&
      IMP97160_VERDICT.additiveDominatesSlopeBand === true &&
      IMP97160_VERDICT.ratioModelIndependent === true &&
      IMP97160_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97160_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97160_HONEST_BANNER) &&
      /imp-96750/.test(IMP97160_VERDICT.conclusion),
  },
];

for (const a of IMP97160_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97160-route-m-farfield-additive-term-spread assertion failed: ${a.id}`,
    );
  }
}

export { IMP97160_ASSERTIONS };
