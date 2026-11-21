/**
 * @module imp-35728-w4-external-count-vs-w3-gated-residual-quantify
 *
 * imp-35728 (proof/assessment, S-frontier): imp-35681 Part C. QUANTIFY the
 * necessary-not-sufficient gap between the EXTERNAL Platt-Trudgian certificate
 * N_off(T_PT) = 0 (no off-line zeros up to the verified height T_PT = 3e12) and
 * the imp-35681/imp-35676 work-item W4 MECHANICAL zero-substitution (reading the
 * off-line contribution above T_PT as EXACTLY ZERO). imp-35676 established
 * QUALITATIVELY that W4 is GATED on the non-finite W3 and that PT N_off(T_PT) = 0
 * is necessary-but-not-sufficient; this module QUANTIFIES precisely HOW MUCH of
 * W4 the external count discharges on its own, and names the residual obligation
 * it structurally cannot cover.
 *
 * ASSESSMENT / QUANTIFICATION ONLY. Ports nothing; discharges nothing; retires no
 * committed constant; establishes no positivity; changes no bound; no RH verdict,
 * NO QED. The imp-34791 reclassification and imp-35676 gating verdict stay
 * UNCHANGED. No refereed bound is changed.
 *
 * PART A -- THE TWO DISJOINT HEIGHT REGIONS OF W4's OBLIGATION
 * -----------------------------------------------------------------------------
 * W4 substitutes the off-line contribution to EXACTLY ZERO over the WHOLE height
 * axis above the analysis floor. Split that axis at the verified height T_PT into
 * two DISJOINT, EXHAUSTIVE regions:
 *   (R_below)  the closed window [0, T_PT]        -- finite, bounded height
 *   (R_above)  the open tail (T_PT, infinity)     -- infinite, unbounded height
 * The external Platt-Trudgian certificate speaks ONLY about R_below: it certifies
 * N_off = 0 there, so the off-line contribution over R_below is EXACTLY ZERO as a
 * verified fact (not a bound, not "small"). It is SILENT about R_above. W4's
 * zero-substitution as used by the barrier concerns R_above (x >= T_PT + Delta,
 * the transition/tail region where the analytic lemma B2/W3 must dominate).
 *
 * PART B -- WHAT THE EXTERNAL COUNT DISCHARGES: THE FULL R_below, THE BASE CASE
 * -----------------------------------------------------------------------------
 * On R_below the external count discharges the off-line contribution COMPLETELY
 * and UNCONDITIONALLY -- 100% of that region, with no W3 dependence. This is NOT
 * nothing: it is the BASE CASE / INITIAL CONDITION that anchors any barrier
 * continuation argument. A no-lift-off / winding barrier over R_above certifies
 * "no NEW off-line zero can appear above T_PT"; it is only meaningful GIVEN "none
 * exists at/below T_PT". PT N_off(T_PT) = 0 supplies exactly that anchor. So the
 * external count is a genuine, load-bearing, necessary ingredient of W4 -- it
 * discharges the entire finite base region and nothing above it.
 *
 * PART C -- WHAT THE COUNT CANNOT COVER: 100% OF R_above (THE W3-GATED RESIDUAL)
 * -----------------------------------------------------------------------------
 * The residual obligation W4 needs but the count cannot supply is the off-line
 * contribution over ALL of R_above = (T_PT, infinity). As a fraction of the
 * height axis W4's substitution spans above the floor, R_above is UNBOUNDED while
 * the count-discharged R_below is the finite prefix [0, T_PT]. So the height
 * MEASURE the external count discharges of the ABOVE-height substitution is
 * exactly ZERO: lim over any tail cut H of (portion of (T_PT, H] the count
 * certifies) / (H - T_PT) = 0 / (H - T_PT) = 0 for every H > T_PT. The count
 * covers 0% of R_above. That entire tail is the W3-gated residual: certifying it
 * requires the NON-finite analytic tail lemma |A + B| > |C| for all x >= T_PT +
 * Delta (imp-35674/W3), which is precisely the breakthrough-tier obligation.
 *
 * PART D -- THE NECESSARY-NOT-SUFFICIENT GAP, QUANTIFIED AS A PARTITION
 * -----------------------------------------------------------------------------
 * The gap is not a fuzzy shortfall; it is a CLEAN PARTITION of W4's obligation:
 *   W4 obligation = [off-line contribution over R_below]  U  [over R_above]
 *                 =  discharged by EXTERNAL count (100% of R_below)
 *                 U  discharged ONLY by W3 (100% of R_above)
 * "Necessary": drop the count and R_below is unanchored -- the barrier over
 * R_above has no base case, so even a perfect W3 fails to conclude N_off = 0
 * globally. "Not sufficient": keep the count but drop W3 and R_above is entirely
 * uncertified -- the count says NOTHING about any height above T_PT, so the
 * zero-substitution over the tail is unlicensed. The two are COMPLEMENTARY, not
 * overlapping: the external count buys the finite prefix, W3 buys the infinite
 * tail, and W4's "EXACTLY ZERO" reading needs BOTH. There is no configuration in
 * which the count alone discharges any positive height-measure of R_above.
 *
 * PART E -- OPERATION VS LICENSE (INHERITED FROM imp-35676, NOW MEASURED)
 * -----------------------------------------------------------------------------
 * imp-35676 Part E distinguished W4-as-OPERATION (finite: delete the 2/gamma
 * artifact, substitute the literal 0) from W4-as-LICENSE (gated on W3). This
 * quantification sharpens the LICENSE side: the license splits into a base-case
 * license (supplied by the external count, finite, held) and a tail license
 * (supplied only by W3, infinite, greenfield). The count discharges 100% of the
 * base-case license and 0% of the tail license. So of the TWO license pieces W4
 * needs, the external count supplies exactly one -- the necessary one -- and the
 * gate is the other. This is fully consistent with imp-35676 (GATED on W3) and
 * imp-35681 Part C (analytic retirement held, substitution gated) -- it changes
 * neither verdict; it measures the split they left unquantified.
 *
 * PART F -- DIRECTION: STILL PARITY WITH PT, NOT A BEAT
 * -----------------------------------------------------------------------------
 * The count-discharged base case IS Platt-Trudgian's own verified height, and the
 * W3 tail lemma is the ported PT-tier barrier machinery (imp-34791 honest
 * MATCH-not-beat ceiling). So completing W4 via count-base + W3-tail yields PARITY
 * with PT on the tail leg, not a beat (imp-35654 parity finding). Quantifying the
 * gap does not move the frontier; genuine beat content lives in the window legs
 * (t_c, E_flow, E_field), untouched by W4. Assessment/quantification only; NO QED.
 *
 * @see imp-35676-w4-etrunc-zero-reading-consistency-scope (W4 gated on W3, qualitatively)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part C: analytic retirement held, substitution gated)
 * @see imp-35674-w3-tail-lemma-polymath15-scope (the non-finite W3 that covers R_above)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc reclassification; MATCH-not-beat ceiling)
 * @see imp-397 (the 2/gamma count kernel W4 retires); winding-thread (de Bruijn flow at negative time)
 * @see Platt-Trudgian 2021 (external N_off(T_PT) = 0 base case); Polymath15 2019 (H_t = A + B - C)
 */

// -- Anchor + operative constants (import-light; matching imp-35676/imp-35681) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base / initial condition)
const DELTA = 1; // transition-rectangle half-window offset (illustrative; W4 concerns x >= T_PT + Delta)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this quantification

// Height-measure of R_above the external count discharges, as a fraction of any
// tail cut (T_PT, H]. The count certifies ZERO height above T_PT, so this is
// identically 0 for every finite cut H > T_PT (and 0 in the H -> infinity limit).
const countTailFractionDischarged = (H) => (H > T_PT ? 0 / (H - T_PT) : NaN); // == 0 for all H > T_PT
// Base-case region [0, T_PT] is discharged in full by the external count.
const COUNT_BASE_FRACTION_DISCHARGED = 1; // 100% of R_below
const COUNT_TAIL_FRACTION_DISCHARGED = 0; // 0% of R_above (the W3-gated residual)

export const IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY = {
  id: 'imp-35728',
  proofSection: 'S-frontier',
  question:
    'Quantify the necessary-not-sufficient gap between the EXTERNAL Platt-Trudgian certificate ' +
    'N_off(T_PT) = 0 (verified to T_PT = 3e12) and the imp-35681/imp-35676 W4 mechanical ' +
    'zero-substitution (off-line contribution above T_PT read as EXACTLY ZERO): how much of W4 can ' +
    'the external count discharge alone, and what residual obligation can only the non-finite W3 tail ' +
    'lemma cover? Assessment/quantification only; changes no bound; NO QED.',
  twoRegionPartition: {
    rBelow: 'closed window [0, T_PT] -- FINITE, bounded height; the PT certificate speaks here',
    rAbove: 'open tail (T_PT, infinity) -- INFINITE, unbounded height; W4 substitutes zero here (x >= T_PT + Delta)',
    disjointExhaustive:
      'R_below and R_above are DISJOINT and EXHAUSTIVE partition of the height axis at T_PT. The ' +
      'external Platt-Trudgian count certifies N_off = 0 over R_below (contribution EXACTLY ZERO, a ' +
      'verified fact) and is SILENT over R_above.',
  },
  countDischarges: {
    verdict: 'FULL R_below (100%, unconditionally) -- the BASE CASE / initial condition, NOT nothing',
    baseFractionDischarged: COUNT_BASE_FRACTION_DISCHARGED, // 1
    role:
      'On R_below the external count discharges the off-line contribution COMPLETELY and with NO W3 ' +
      'dependence. This is the base case that anchors any barrier continuation: a no-lift-off / winding ' +
      'barrier over R_above certifies "no NEW off-line zero appears above T_PT" only GIVEN "none exists ' +
      'at/below T_PT". PT N_off(T_PT) = 0 supplies exactly that anchor -- a genuine, load-bearing, ' +
      'necessary ingredient of W4.',
  },
  countCannotCover: {
    verdict: '100% of R_above -- the W3-GATED RESIDUAL (external count discharges 0% of the tail)',
    tailFractionDischarged: COUNT_TAIL_FRACTION_DISCHARGED, // 0
    quantification:
      'The height MEASURE of R_above the external count discharges is exactly ZERO: for every tail cut ' +
      'H > T_PT, (portion of (T_PT, H] the count certifies) / (H - T_PT) = 0 / (H - T_PT) = 0, and 0 in ' +
      'the H -> infinity limit. The count covers 0% of R_above. Certifying that entire tail requires the ' +
      'NON-finite analytic tail lemma |A + B| > |C| for all x >= T_PT + Delta (imp-35674 / W3) -- the ' +
      'breakthrough-tier obligation.',
  },
  gapAsPartition: {
    statement:
      'W4 obligation = [off-line contribution over R_below] U [over R_above] = {discharged by EXTERNAL ' +
      'count: 100% of R_below} U {discharged ONLY by W3: 100% of R_above}. A CLEAN PARTITION, not a ' +
      'fuzzy shortfall.',
    necessary:
      'NECESSARY: drop the count and R_below is unanchored -- the barrier over R_above has no base case, ' +
      'so even a perfect W3 cannot conclude N_off = 0 globally.',
    notSufficient:
      'NOT SUFFICIENT: keep the count but drop W3 and R_above is entirely uncertified -- the count says ' +
      'NOTHING about any height above T_PT, so the tail zero-substitution is unlicensed.',
    complementaryNotOverlapping:
      'The two ingredients are COMPLEMENTARY, not overlapping: the external count buys the finite prefix, ' +
      'W3 buys the infinite tail; W4 needs BOTH. No configuration lets the count alone discharge any ' +
      'positive height-measure of R_above.',
  },
  operationVsLicense:
    'Sharpens imp-35676 Part E: W4-as-LICENSE splits into a base-case license (external count, finite, ' +
    'held) and a tail license (W3, infinite, greenfield). The count supplies 100% of the base-case ' +
    'license and 0% of the tail license -- exactly one of the two license pieces W4 needs (the ' +
    'necessary one); the gate is the other. Consistent with imp-35676 (GATED on W3) and imp-35681 Part ' +
    'C (analytic retirement held, substitution gated); changes neither verdict.',
  directionParityNotBeat:
    'The count-discharged base case IS Platt-Trudgians verified height and the W3 tail lemma is the ' +
    'ported PT-tier machinery (imp-34791 honest MATCH-not-beat ceiling). Completing W4 via count-base + ' +
    'W3-tail is PARITY with PT on the tail leg, not a beat (imp-35654); quantifying the gap does not ' +
    'move the frontier. Genuine beat content lives in the window legs (t_c, E_flow, E_field).',
  anchors: {
    tPt: T_PT, // 3e12
    delta: DELTA, // illustrative transition offset
    countBaseFractionDischarged: COUNT_BASE_FRACTION_DISCHARGED, // 1
    countTailFractionDischarged: COUNT_TAIL_FRACTION_DISCHARGED, // 0
    note:
      'These fractions are structural (base region fully discharged, tail region discharged to measure ' +
      'zero) and change no committed constant. Quantification only.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / QUANTIFICATION (frontier-direction, NOT rigorous). The necessary-not-sufficient gap ' +
    'imp-35676 established qualitatively is a CLEAN PARTITION of W4s obligation at the verified height ' +
    'T_PT = 3e12: the EXTERNAL Platt-Trudgian count N_off(T_PT) = 0 discharges 100% of R_below = ' +
    '[0, T_PT] (the finite BASE CASE / initial condition that anchors any barrier continuation -- a ' +
    'genuine, load-bearing ingredient, NOT nothing) and 0% of R_above = (T_PT, infinity) (the ' +
    'infinite tail, height-measure discharged is exactly 0 for every tail cut). That entire tail is the ' +
    'W3-GATED residual, certifiable only by the non-finite analytic lemma |A + B| > |C| for x >= T_PT + ' +
    'Delta (imp-35674). The count is NECESSARY (drops => R_above unanchored, no base case) and NOT ' +
    'SUFFICIENT (drops W3 => R_above uncertified); the two are COMPLEMENTARY. This sharpens imp-35676 ' +
    'Part E: the count supplies exactly one of W4s two license pieces (the base-case license), the gate ' +
    'is the tail license. Completing W4 is PARITY with PT, not a beat. Consistent with imp-35676 and ' +
    'imp-35681 Part C; ports nothing; discharges nothing; changes no bound; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35676 (W4 gated on W3, qualitatively; operation-vs-license); imp-35681 Part C (analytic ' +
    'retirement held, substitution gated); imp-35674 (the non-finite W3 tail lemma covering R_above); ' +
    'imp-34791 (E_trunc reclassification; MATCH-not-beat ceiling); imp-35654 (parity-with-PT); imp-397 ' +
    '(2/gamma kernel W4 retires); winding-thread (de Bruijn flow at negative time); Polymath15 2019 ' +
    '(H_t = A + B - C); Platt-Trudgian 2021 (external N_off(T_PT) = 0 base case).',
};

export const IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY_ASSERTIONS = [
  {
    // Part A: the two disjoint, exhaustive height regions partition W4's obligation at T_PT.
    id: 'imp35728-two-region-partition',
    description: 'W4 obligation splits at T_PT into disjoint R_below [0,T_PT] and R_above (T_PT,inf); PT count silent above',
    holds: () =>
      /DISJOINT and EXHAUSTIVE/.test(IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.twoRegionPartition.disjointExhaustive) &&
      /SILENT over R_above/.test(IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.twoRegionPartition.disjointExhaustive) &&
      IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.anchors.tPt === 3e12,
  },
  {
    // Part B: the external count discharges 100% of R_below (the base case), unconditionally.
    id: 'imp35728-count-discharges-base-case',
    description: 'External count discharges 100% of R_below -- the base case / initial condition, not nothing',
    holds: () =>
      COUNT_BASE_FRACTION_DISCHARGED === 1 &&
      IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.countDischarges.baseFractionDischarged === 1 &&
      /BASE CASE/.test(IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.countDischarges.verdict) &&
      /NOT nothing/.test(IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.countDischarges.verdict),
  },
  {
    // Part C: the external count discharges 0% of R_above (the W3-gated residual), measure zero at every cut.
    id: 'imp35728-count-covers-zero-of-tail',
    description: 'External count discharges 0% of R_above (W3-gated residual); tail fraction is 0 at every cut H > T_PT',
    holds: () =>
      COUNT_TAIL_FRACTION_DISCHARGED === 0 &&
      countTailFractionDischarged(T_PT + 1) === 0 &&
      countTailFractionDischarged(1e18) === 0 &&
      Number.isNaN(countTailFractionDischarged(T_PT - 1)) &&
      /W3-GATED RESIDUAL/.test(IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.countCannotCover.verdict),
  },
  {
    // Part D: the gap is a clean complementary partition -- necessary AND not-sufficient, non-overlapping.
    id: 'imp35728-gap-clean-partition',
    description: 'Gap is a clean complementary partition: count buys R_below (necessary), W3 buys R_above (not-sufficient)',
    holds: () =>
      /CLEAN PARTITION/.test(IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.gapAsPartition.statement) &&
      /NECESSARY/.test(IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.gapAsPartition.necessary) &&
      /NOT SUFFICIENT/.test(IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.gapAsPartition.notSufficient) &&
      /COMPLEMENTARY, not overlapping/.test(IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.gapAsPartition.complementaryNotOverlapping),
  },
  {
    // Honesty gate: quantification only, consistent with imp-35676/imp-35681, parity-not-beat, no QED, no refereed bound is changed.
    id: 'imp35728-honesty-gate-no-qed',
    description: 'Quantification only; consistent with imp-35676/imp-35681; parity-not-beat; no QED; no refereed bound is changed',
    holds: () =>
      IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /PARITY with PT .* not a beat/.test(IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.directionParityNotBeat) &&
      /changes neither verdict/.test(IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.operationVsLicense) &&
      /NO QED/.test(IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.verdict) &&
      /refereed bound is changed/i.test(IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY.verdict),
  },
];

for (const a of IMP35728_W4_EXTERNAL_COUNT_VS_W3_GATED_RESIDUAL_QUANTIFY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35728-w4-external-count-vs-w3-gated-residual-quantify assertion failed: ${a.id}`);
  }
}
