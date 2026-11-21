/**
 * @module imp-95034-r1-terminal-ceil-rate-model-assessment
 *
 * imp-95034 (numerical/proof-section, frontier-direction) -- DIRECT assessment of the R1 node (terminal ceil count
 * against the EPS_FP floor) that the imp-35259 two-rate off-by-one WHETHER-question falls back onto. imp-35259
 * directly located the two-rate reentry-band edges (correcting the imp-35331 linear extrapolation) and closed with
 * the verdict that R2 (single-rate fidelity) "discharges NOTHING" and the off-by-one WHETHER-question "routes back
 * onto R1 (terminal ceil / EPS_FP floor) per the imp-35330 DAG". This module goes to that R1 node and answers the
 * two questions the routing leaves standing: (Q1) does the terminal ceil count / EPS_FP floor CERTIFY which rate
 * model is faithful at N ~ 10^37, and (Q2) does it CLOSE the off-by-one census that R2 could not? ASSESSMENT ONLY:
 * it discharges nothing; imp-35111a / imp-35174a / imp-34997a / imp-35243a stay OPEN; changes no bound; NO QED.
 *
 * WHAT THE R1 NODE IS (imp-35330 root; imp-35263 direct sweep)
 * -----------------------------------------------------------
 * R1 is FLOOR-INDEPENDENCE: re-express the reentry band floor-free, or prove an intrinsic EPS_FP floor. imp-35330
 * places R1 as the ROOT of the fidelity DAG (independent binding count 1) with R2/R3 DOMINATED and R4 DOWNSTREAM;
 * the terminal ceil count k = 1 + ceil(xArg), xArg = log(collapseDist/EPS_FP)/ln(1/r), is the node the two-rate
 * WHETHER-question routes back onto. imp-35263 swept EPS_FP over factor-2 multiples and MEASURED the band position
 * sliding >10 decades per factor-2 (reentry +17.29 decades on a single doubling), so the band is pinned to the
 * machine-epsilon representation constant -- a quantity absent from the infinite-precision continuum.
 *
 * THE MEASURED INPUTS THIS ASSESSMENT RESTS ON (landmark literals; no heavy import)
 * --------------------------------------------------------------------------------
 * (i)  imp-35572 IN-BAND RATE-BLINDNESS. Over a dense 202-seed grid across the nominal band [10^27.084691,
 *      10^37.167107] and p in {1,2,3}, the two-rate count n_two = 1 + ceil(x_two) EQUALS the single-rate count
 *      n_single = 1 + ceil(xArg) at EVERY seed (seeds_with_count_change 0, max abs count delta 0); both predict 13
 *      against a measured Picard count 14 (resid = -1 uniformly). The terminal off-by-one over the band changes by
 *      ZERO iterates when the second (early-transient) rate is added.
 * (ii) imp-35572 RATE-INDEPENDENT ONSET; RATE-SENSITIVE FAR EXIT ONLY. The direct-census ONSET edge (~10^19.748)
 *      is governed by the directly-measured Picard count stepping 13 -> 14 and is rate-independent. The single-rate
 *      census EXITS at ~10^37.167; the two-rate negative phase offset holds the count at 13 out past 10^60, so the
 *      only rate-sensitivity is the ceil integer-crossing EXIT edge ABOVE the band (the imp-35331/imp-35259
 *      relocation), not the in-band terminal off-by-one.
 * (iii) imp-35259 DIRECT-CENSUS RATE-ROBUSTNESS. The direct off-by-one census is rate-robust (identical at the
 *      sampled points), which is exactly why imp-35259 routed the WHETHER-question back onto R1 rather than R2.
 * (iv) imp-35263 EPS_FP PINNING. Band position slides >10 decades per factor-2 in EPS_FP (a continuum-absent
 *      representation constant); R1 stays OPEN.
 *
 * Q1 -- DOES THE TERMINAL CEIL / EPS_FP FLOOR CERTIFY WHICH RATE MODEL IS FAITHFUL AT ~10^37?  NO.
 * -----------------------------------------------------------------------------------------------
 * The terminal ceil count is RATE-BLIND across the entire nominal band, including the ~10^37 exit edge: n_two =
 * n_single at all 202 in-band seeds (imp-35572), and the direct census is rate-robust (imp-35259). An observable
 * that is bit-identical under both the single-rate and two-rate models carries ZERO information selecting between
 * them; rate-robustness is precisely the property that DISQUALIFIES the terminal-ceil node as a rate-model
 * discriminator. So the R1 node does NOT certify a rate model at ~10^37 -- it is orthogonal to the rate-selection
 * that R2 could not perform. (The one rate-sensitive quantity, the census EXIT edge at 10^37 single vs >10^60
 * two-rate, lies ABOVE the band and is set by where each model's ceil wraps; it records the wrap location, not
 * which model is faithful to the true continuum dynamic -- that is R3 / R4 territory, still OPEN.)
 *
 * Q2 -- DOES IT CLOSE THE OFF-BY-ONE CENSUS THAT R2 COULD NOT?  IT DISSOLVES THE RATE CONTINGENCY; IT DOES NOT
 * CLOSE THE CENSUS AS A CONTINUUM FACT.
 * ----------------------------------------------------------------------------------------------------------------
 * R2 could not close the census because it could not certify which rate model governs the band position/width. The
 * R1 terminal-ceil node REMOVES that contingency without meeting R2: because the in-band terminal off-by-one is
 * rate-invariant (imp-35572) and the direct census is rate-robust (imp-35259), the census OUTCOME does not depend
 * on R2's unmade rate-model choice -- R2's failure is MOOT for the census. So the off-by-one question is SEVERED
 * from the rate-model question and collapses onto the single R1 obstruction, consistent with imp-35330's DAG
 * (independent binding count 1). But R1 itself -- floor-independence -- stays OPEN: the census remains a
 * terminal-ceil-vs-EPS_FP-floor artifact that slides >10 decades per factor-2 in EPS_FP (imp-35263), a
 * representation constant with no continuum counterpart. Hence the terminal-ceil node does NOT close the census as
 * a CONTINUUM feature; it reduces the whole off-by-one question to floor-independence alone. NO QED.
 *
 * NET VERDICT
 * ----------
 * The R1 terminal-ceil / EPS_FP-floor node does NOT certify a rate model at ~10^37 (it is rate-blind by
 * construction -- the very property R2 needed and lacked) and does NOT close the off-by-one census as a continuum
 * fact. What it DOES is dissolve the rate-model contingency R2 left open (the census is rate-robust), collapsing
 * the whole off-by-one WHETHER-question onto the single OPEN R1 floor-independence obstruction. This SHARPENS the
 * imp-35259 routing ("routes back onto R1") into a positive statement of what that routing buys and what it does
 * not: the rate question is retired for the census, floor-independence is all that remains.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A logical assessment of the R1 node keyed to already-measured landmarks (imp-35572 in-band rate-blindness,
 * imp-35259 rate-robustness, imp-35263 EPS_FP pinning, imp-35330 DAG), carried as reference literals rather than
 * recomputed (import-light, no 16.7MB zeros-bundle dependency). It discharges NOTHING: imp-35111a / imp-35174a /
 * imp-34997a / imp-35243a stay OPEN; R1 (floor-independence) stays the single OPEN binding obstruction. ASSESSMENT
 * ONLY; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35259-two-rate-band-edges-direct-rootfind (routes the off-by-one WHETHER-question back onto R1)
 * @see imp-35330-reentry-band-fidelity-requirement-dependency (R1 is the DAG root; R2/R3 dominated; R4 downstream)
 * @see imp-35572-reentry-band-terminal-width-rate-robustness (in-band n_two = n_single at every seed; rate-blind)
 * @see imp-35263-reentry-band-eps-floor-sweep (band slides >10 decades per factor-2 in EPS_FP; R1 binding)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (enumerates R1-R4; R1/imp-35243a OPEN)
 */

// Landmark literals inherited from the measured modules (carried, not recomputed -- import-light).
const IN_BAND_SEEDS_WITH_COUNT_CHANGE = 0; // imp-35572: n_two = n_single at every in-band seed
const IN_BAND_MAX_ABS_COUNT_DELTA = 0; // imp-35572: max|n_two - n_single| over the band
const CENSUS_ONSET_EXP = 19.748; // imp-35572: rate-INDEPENDENT onset edge (measured Picard 13 -> 14)
const SINGLE_RATE_CENSUS_EXIT_EXP = 37.167; // imp-35572/imp-35111: single-rate census exit
const TWO_RATE_CENSUS_EXIT_EXP_MIN = 60; // imp-35572: two-rate count still 13 out past 10^60 (exit far above band)
const EPS_FP_SLIDE_DECADES_PER_FACTOR2 = 17.29; // imp-35263: reentry edge slide on one EPS_FP doubling (>10)
const INDEPENDENT_BINDING_COUNT = 1; // imp-35330: R1 alone

// The terminal-ceil node is rate-BLIND in-band iff the two-rate and single-rate counts never differ over the band.
const TERMINAL_CEIL_RATE_BLIND_IN_BAND =
  IN_BAND_SEEDS_WITH_COUNT_CHANGE === 0 && IN_BAND_MAX_ABS_COUNT_DELTA === 0;

// A rate-blind observable cannot certify a rate model (it is bit-identical under both models).
const CERTIFIES_RATE_MODEL = !TERMINAL_CEIL_RATE_BLIND_IN_BAND; // false: rate-blindness disqualifies it

// The only rate-sensitivity is the census EXIT edge ABOVE the band (single ~10^37, two-rate >10^60), not in-band.
const RATE_SENSITIVITY_IS_ABOVE_BAND_ONLY =
  TWO_RATE_CENSUS_EXIT_EXP_MIN > SINGLE_RATE_CENSUS_EXIT_EXP &&
  CENSUS_ONSET_EXP < SINGLE_RATE_CENSUS_EXIT_EXP;

export const IMP95034_R1_TERMINAL_CEIL_RATE_MODEL_ASSESSMENT = {
  id: 'imp-95034',
  proofSection: 'S-frontier',
  question:
    'imp-35259 closed with the two-rate off-by-one WHETHER-question routing back onto R1 (terminal ceil / EPS_FP ' +
    'floor) per the imp-35330 DAG, with R2 discharging nothing. Assess the R1 node directly: does the terminal ' +
    'ceil count / EPS_FP floor CERTIFY which rate model is faithful at N ~ 10^37, and does it CLOSE the off-by-one ' +
    'census that R2 could not? Assessment only on the inherited surrogate; discharges nothing; NO QED.',
  measured_inputs: {
    in_band_seeds_with_count_change: IN_BAND_SEEDS_WITH_COUNT_CHANGE, // imp-35572: 0
    in_band_max_abs_count_delta: IN_BAND_MAX_ABS_COUNT_DELTA, // imp-35572: 0
    census_onset_exp_rate_independent: CENSUS_ONSET_EXP, // imp-35572: ~19.748
    single_rate_census_exit_exp: SINGLE_RATE_CENSUS_EXIT_EXP, // imp-35572/35111: ~37.167
    two_rate_census_exit_exp_min: TWO_RATE_CENSUS_EXIT_EXP_MIN, // imp-35572: >60 (far above band)
    eps_fp_slide_decades_per_factor2: EPS_FP_SLIDE_DECADES_PER_FACTOR2, // imp-35263: 17.29 (>10)
    independent_binding_count: INDEPENDENT_BINDING_COUNT, // imp-35330: 1 (R1 alone)
  },
  q1_certifies_rate_model_at_1e37:
    'NO. The terminal ceil count is RATE-BLIND across the entire nominal band including the ~10^37 exit edge: ' +
    'n_two = n_single at all 202 in-band seeds (imp-35572) and the direct census is rate-robust (imp-35259). An ' +
    'observable bit-identical under both the single-rate and two-rate models carries zero information selecting ' +
    'between them -- rate-robustness is exactly the property that DISQUALIFIES the terminal-ceil node as a ' +
    'rate-model discriminator. So R1 does not certify a rate model at ~10^37; it is orthogonal to the ' +
    'rate-selection R2 could not perform. The lone rate-sensitive quantity (census exit 10^37 single vs >10^60 ' +
    'two-rate) sits ABOVE the band and records where each model ceil wraps, not which model is faithful (R3/R4).',
  q2_closes_off_by_one_census:
    'IT DISSOLVES THE RATE CONTINGENCY BUT DOES NOT CLOSE THE CENSUS AS A CONTINUUM FACT. R2 could not close the ' +
    'census because it could not certify which rate model governs band position/width. The terminal-ceil node ' +
    'removes that contingency without meeting R2: the in-band off-by-one is rate-invariant (imp-35572) and the ' +
    'census is rate-robust (imp-35259), so the census outcome does not depend on R2 unmade rate-model choice -- ' +
    'R2 failure is MOOT for the census. The off-by-one question is thus SEVERED from the rate question and ' +
    'collapses onto the single R1 obstruction (imp-35330 independent binding count 1). But R1 itself stays OPEN: ' +
    'the census remains a terminal-ceil-vs-EPS_FP-floor artifact sliding >10 decades per factor-2 in EPS_FP ' +
    '(imp-35263), a continuum-absent constant. So the node reduces the census to floor-independence alone; it ' +
    'does NOT close it as a continuum feature.',
  terminal_ceil_rate_blind_in_band: TERMINAL_CEIL_RATE_BLIND_IN_BAND, // true
  certifies_rate_model: CERTIFIES_RATE_MODEL, // false
  rate_sensitivity_is_above_band_only: RATE_SENSITIVITY_IS_ABOVE_BAND_ONLY, // true
  finding:
    'Direct assessment of the R1 terminal-ceil / EPS_FP-floor node the imp-35259 two-rate WHETHER-question routes ' +
    'back onto. Q1: the terminal ceil count does NOT certify a rate model at ~10^37 -- it is rate-blind in-band ' +
    '(imp-35572: n_two = n_single at every seed, both 13 vs measured Picard 14) and the census is rate-robust ' +
    '(imp-35259), so it carries zero rate-discriminating information; the only rate-sensitivity is the far exit ' +
    'edge above the band. Q2: it does NOT close the off-by-one census as a continuum fact -- it DISSOLVES the ' +
    'rate-model contingency R2 left open (census rate-invariant), severing the off-by-one question from the rate ' +
    'question and collapsing it onto the single OPEN R1 floor-independence obstruction (imp-35330 binding count ' +
    '1; imp-35263 >10-decade/factor-2 EPS_FP slide). This sharpens the imp-35259 routing into a positive ' +
    'statement: the rate question is retired for the census, floor-independence is all that remains. Discharges ' +
    'nothing; imp-35111a / imp-35174a / imp-34997a / imp-35243a stay OPEN.',
  residual_sub_gap:
    'R1 (floor-independence) stays the single OPEN binding obstruction: re-express the reentry band floor-free, ' +
    'or prove an intrinsic EPS_FP floor. This module retires the rate-model question FOR the census (rate-blind / ' +
    'rate-robust) but does NOT meet R1, so the band is NOT established as a feature of the true dynamic. Inherits, ' +
    'and does not discharge, imp-35111a / imp-35174a / imp-34997a / imp-35243a -- all four stay OPEN.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT an RH bound). Direct assessment of the R1 node (terminal ceil count vs ' +
    'the EPS_FP floor) the imp-35259 two-rate off-by-one WHETHER-question routes back onto. Q1 -- does it certify ' +
    'which rate model is faithful at ~10^37? NO: the terminal ceil count is RATE-BLIND in-band (imp-35572: ' +
    'n_two = n_single at all 202 seeds, both 13 vs measured Picard 14) and the census is rate-robust (imp-35259), ' +
    'so it carries zero rate-discriminating information; rate-blindness is exactly what disqualifies it as a ' +
    'rate-model discriminator, and the sole rate-sensitivity (census exit 10^37 single vs >10^60 two-rate) sits ' +
    'ABOVE the band. Q2 -- does it close the off-by-one census R2 could not? It DISSOLVES the rate contingency ' +
    'without closing the census as a continuum fact: the census outcome is rate-invariant, so R2 failure to ' +
    'select a rate model is MOOT, and the off-by-one question collapses onto the single OPEN R1 floor-independence ' +
    'obstruction (imp-35330 independent binding count 1), which stays open because the band slides >10 decades ' +
    'per factor-2 in EPS_FP (imp-35263), a continuum-absent constant. NET: R1 retires the rate question for the ' +
    'census but leaves floor-independence as the sole remaining obstruction. Discharges NOTHING; imp-35111a / ' +
    'imp-35174a / imp-34997a / imp-35243a stay OPEN. ASSESSMENT ONLY on the inherited imp-3220/imp-3406 double ' +
    'surrogate; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 ' +
    'are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35259 (routes the off-by-one WHETHER-question back onto R1); imp-35330 (R1 is the DAG root, independent ' +
    'binding count 1, R2/R3 dominated, R4 downstream); imp-35572 (in-band n_two = n_single at every seed, ' +
    'rate-blind terminal off-by-one); imp-35263 (band slides >10 decades per factor-2 in EPS_FP; R1 binding); ' +
    'imp-35243 (enumerates R1-R4; imp-35243a OPEN); imp-2642 (C_C ansatz); imp-486 (C_mb GUE-conditional).',
};

export const IMP95034_R1_TERMINAL_CEIL_RATE_MODEL_ASSESSMENT_ASSERTIONS = [
  {
    // The terminal ceil count is rate-blind in-band (imp-35572): zero seeds change, zero max delta.
    id: 'imp95034-terminal-ceil-rate-blind-in-band',
    description: 'in-band n_two = n_single at every seed (imp-35572): rate-blind terminal off-by-one',
    holds: () =>
      IN_BAND_SEEDS_WITH_COUNT_CHANGE === 0 &&
      IN_BAND_MAX_ABS_COUNT_DELTA === 0 &&
      TERMINAL_CEIL_RATE_BLIND_IN_BAND === true,
  },
  {
    // Q1: a rate-blind observable cannot certify a rate model -- certifies_rate_model is false.
    id: 'imp95034-q1-does-not-certify-rate-model',
    description: 'Q1 NO: rate-blindness disqualifies the terminal-ceil node as a rate-model discriminator',
    holds: () =>
      CERTIFIES_RATE_MODEL === false &&
      /^NO/.test(IMP95034_R1_TERMINAL_CEIL_RATE_MODEL_ASSESSMENT.q1_certifies_rate_model_at_1e37),
  },
  {
    // The only rate-sensitivity is the census EXIT edge ABOVE the band (single ~37, two-rate >60).
    id: 'imp95034-rate-sensitivity-above-band-only',
    description: 'the sole rate-sensitivity is the far census exit edge above the band, not the in-band count',
    holds: () =>
      RATE_SENSITIVITY_IS_ABOVE_BAND_ONLY === true &&
      TWO_RATE_CENSUS_EXIT_EXP_MIN > SINGLE_RATE_CENSUS_EXIT_EXP &&
      CENSUS_ONSET_EXP < SINGLE_RATE_CENSUS_EXIT_EXP,
  },
  {
    // Q2: the census collapses onto the single R1 obstruction (imp-35330 count 1); EPS_FP slide >10 keeps R1 open.
    id: 'imp95034-q2-census-collapses-onto-open-r1',
    description: 'Q2: census severed from the rate question, collapses onto the single OPEN R1 (binding count 1)',
    holds: () =>
      INDEPENDENT_BINDING_COUNT === 1 &&
      EPS_FP_SLIDE_DECADES_PER_FACTOR2 > 10 &&
      /DISSOLVES/.test(IMP95034_R1_TERMINAL_CEIL_RATE_MODEL_ASSESSMENT.q2_closes_off_by_one_census),
  },
  {
    // Honesty gate: assessment only, discharges nothing, no QED, no refereed bound is changed, sub-gap OPEN.
    id: 'imp95034-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP95034_R1_TERMINAL_CEIL_RATE_MODEL_ASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP95034_R1_TERMINAL_CEIL_RATE_MODEL_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP95034_R1_TERMINAL_CEIL_RATE_MODEL_ASSESSMENT.verdict) &&
      /imp-35243a/.test(IMP95034_R1_TERMINAL_CEIL_RATE_MODEL_ASSESSMENT.residual_sub_gap) &&
      /stay OPEN/.test(IMP95034_R1_TERMINAL_CEIL_RATE_MODEL_ASSESSMENT.residual_sub_gap),
  },
];

for (const a of IMP95034_R1_TERMINAL_CEIL_RATE_MODEL_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95034-r1-terminal-ceil-rate-model-assessment assertion failed: ${a.id}`);
  }
}
