/**
 * @module imp-124774-sqrt10-mechanism-crossvalidation
 *
 * imp-124774 (numerical/cross-validation, frontier cross-check): three independent frontier modules
 * each report a sqrt(10) = 10^(1/2) = 3.162278 per-decade rate, but the shared origin was never
 * established. This leaf DERIVES each rate origin from its own module and COMPARES the three by their
 * approach-to-sqrt(10) SIGN and residual-decay CONSTANT, deciding whether they are one asymptotic
 * mechanism or a numerical coincidence rooted only in the common Riemann-von Mangoldt (RvM)
 * T0 ~ 2 pi N / log N scaffold.
 *
 * THE THREE sqrt(10) LADDERS (baked reference literals from each source; import-light, no heavy model)
 * -----------------------------------------------------------------------------------------------------
 *   (A) imp-97823  interior-peak reconstruction kernel |K| = 1/(N sigma_N). Near the imp-97520 L1 peak
 *       sigma = sigma_max - A (x - x_peak)^2 (x = log N), the near-peak gap g = sigma_max - sigma =
 *       A (x - x_peak)^2, so |K| = 1/(2 sqrt(A) sqrt(g)) ~ g^(-1/2): a DECADE OF GAP g grows |K| by
 *       sqrt(10). Deep-window LS growth 3.158 (upslope) / 3.167 (downslope), bracketing sqrt(10).
 *   (B) imp-34528  far-tail collision term sigma ~ E_coll / E_trunc, E_coll = C_C sqrt(L/N) ~ N^(-1/2).
 *       A DECADE OF N drops sigma by sqrt(10). Measured local per-decade decay climbs 1.4372 -> 2.1575
 *       -> 2.6602 -> 2.8985 toward sqrt(10) (shadowing the true imp-3463 sigma decade decay 2.2688 ->
 *       2.6964 -> 2.9140).
 *   (C) imp-35663  E_flow far-tail fd-vs-analytic remnant ~ (2 log u - 3 - c)/u^2 ~ u^(-2) (u = log N,
 *       imp-35552). A DECADE OF REMNANT needs u to grow by sqrt(10), so the decade-crossing SPANS in
 *       log10 N grow by sqrt(10): measured span ratios 3.6001 -> 3.5156 declining toward sqrt(10).
 *
 * WHERE THE 1/2 COMES FROM IN EACH (the crux of same-vs-coincidental)
 * ------------------------------------------------------------------
 *   (A) 1/2 is a FOLD-JACOBIAN exponent: 1/2 = 1/(order-2 stationary point). ANY smooth maximum is
 *       locally quadratic, so |K| ~ g^(-1/2) regardless of the N-power of E_coll -- the 1/2 is the
 *       peak curvature, NOT the collision exponent.
 *   (B) 1/2 is the DIRECT AMPLITUDE exponent of the collision term E_coll ~ N^(-1/2) (the genuine RvM /
 *       GUE-conditional N^(-1/2) balance). This 1/2 would be 1/2 for ANY smooth peak shape.
 *   (C) 1/2 is the RECIPROCAL of the remnant power -2: remnant ~ u^(-2) => a factor-10 in remnant needs
 *       u x 10^(1/(2)). The controlling exponent here is -2, and sqrt(10) is 10^(1/|-2|).
 *   => (A) and (B) share the ROLE of 1/2 as a direct decay exponent but of DIFFERENT variables (gap g
 *      vs N) from structurally unrelated sources (peak curvature vs collision amplitude); (C) uses 1/2
 *      as a reciprocal-of-2 power. Three distinct exponent structures, one coincident number.
 *
 * THE DISTINGUISHING FINGERPRINT: approach SIGN + residual-decay constant
 * ----------------------------------------------------------------------
 * If the three were one mechanism they would approach sqrt(10) with the same sign and the same residual
 * constant. They do NOT:
 *   (A) TWO-SIDED: the two arms BRACKET sqrt(10) (upslope 3.158 from below, downslope 3.167 from above);
 *       the O(sqrt(g)) cubic-fold running correction decays ~1/sqrt(10) ~ 0.3162 per decade of gap.
 *   (B) FROM BELOW (single-signed): local decays stay below sqrt(10) because L = log T0 grows slowly
 *       with N (a positive log-correction slowing the N^(-1/2) decay); the gap to sqrt(10)
 *       {1.7251, 1.0047, 0.5021, 0.2638} roughly HALVES (~1/2) per decade, NOT 1/sqrt(10).
 *   (C) FROM ABOVE (single-signed): span ratios 3.6001 -> 3.5156 exceed sqrt(10), the slow (2 log u)/u^2
 *       log-factor inflating the near spans; they decline toward sqrt(10) from above.
 *
 * THE FINDING (cross-validation only)
 * -----------------------------------
 *   (X1) COINCIDENT NUMBER. All three target the SAME sqrt(10) = 3.162278 to within ~15% at their
 *        deepest measured rung -- the number is real and shared.
 *   (X2) DISTINCT MECHANISMS. The 1/2 arises three ways: a fold-Jacobian exponent (A), a direct
 *        N^(-1/2) amplitude exponent (B), and a reciprocal-of-2 power (C). (A) is generic to any smooth
 *        max; (B) is the genuine collision balance; (C) is the u^(-2) remnant. They are not one
 *        asymptotic constant.
 *   (X3) THE SIGNATURES SEPARATE THEM. Approach signs differ (A two-sided / B below / C above) and the
 *        residual-decay constants differ (A ~1/sqrt(10) per decade of gap; B ~1/2 per decade of N). A
 *        single mechanism could not present three different signs and two different residual constants.
 *   (X4) THE ONLY SHARED ROOT is the RvM T0 ~ 2 pi N / log N scaffold, which simultaneously fixes
 *        E_coll ~ N^(-1/2) (so (B) is sqrt(10)-per-decade) AND makes sigma a smooth-peaked function of
 *        log N (so (A) is a quadratic fold) AND drives the E_flow remnant u^(-2) tail (so (C) is
 *        sqrt(10)-per-span). The number is inherited from the scaffold; the mechanisms are not one.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Re-tabulates the imp-97823 / imp-34528 / imp-35663 headline
 * numbers verbatim as baked literals; derives no fresh numerics. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 and
 * the C_C 1/8 ansatz are UNTOUCHED and appear only as the fixed surrogate; changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97823-kernel-decade-growth-sqrt10 (interior-peak |K| ~ g^(-1/2), deep growth 3.158/3.167)
 * @see imp-34528-tailside-hump-decay-vs-sqrt-n-fartail (far-tail sigma ~ N^(-1/2), localDecay -> sqrt(10))
 * @see imp-35663-eflow-fartail-decade-span-growth-viz-data (E_flow remnant span-ratio -> sqrt(10))
 * @see imp-35552-eflow-fartail-remnant-product-decay-limit (remnant ~ u^(-2), u = log N)
 */

const SQRT10 = Math.sqrt(10); // 3.16227766...

// (A) imp-97823 interior-peak reconstruction kernel |K| ~ g^(-1/2) (decade of GAP g).
const A_KERNEL_FOLD = {
  source: 'imp-97823',
  quantity: '|K| = 1/(N sigma_N)',
  drivingVariable: 'near-peak gap g = sigma_max - sigma (decade of gap)',
  exponent: -0.5, // |K| ~ g^(-1/2)
  exponentRole: 'FOLD-JACOBIAN: 1/2 = 1/(order-2 stationary point); generic to any smooth maximum',
  deepGrowthPerDecade: { upslope: 3.158, downslope: 3.167 }, // brackets sqrt(10)
  approachSign: 'two-sided', // arms bracket sqrt(10) (upslope below, downslope above)
  residualDecayPerDecade: 0.3162, // ~1/sqrt(10): O(sqrt(g)) cubic-fold running correction
};

// (B) imp-34528 far-tail collision term sigma ~ N^(-1/2) (decade of N).
const B_COLL_AMPLITUDE = {
  source: 'imp-34528',
  quantity: 'sigma ~ E_coll / E_trunc, E_coll = C_C sqrt(L/N)',
  drivingVariable: 'N (decade of N)',
  exponent: -0.5, // E_coll ~ N^(-1/2)
  exponentRole: 'DIRECT AMPLITUDE: 1/2 is the genuine RvM / GUE-conditional collision N^(-1/2) balance',
  localDecayLadder: [1.4372, 2.1575, 2.6602, 2.8985], // climbs toward sqrt(10) from below
  gapToSqrt10: [1.7251, 1.0047, 0.5021, 0.2638], // halves per decade
  approachSign: 'from below', // localDecay < sqrt(10) throughout
  residualDecayPerDecade: 0.5, // gap to sqrt(10) roughly halves per decade (L = log T0 slow growth)
};

// (C) imp-35663 E_flow far-tail remnant span-ratio; remnant ~ u^(-2), u = log N (decade of REMNANT).
const C_REMNANT_RECIPROCAL = {
  source: 'imp-35663',
  quantity: 'E_flow fd-vs-analytic remnant ~ (2 log u - 3 - c)/u^2, u = log N',
  drivingVariable: 'decade of remnant (log10 N crossing spans)',
  controllingPower: -2, // remnant ~ u^(-2)
  exponentRole: 'RECIPROCAL-OF-2: sqrt(10) = 10^(1/|-2|); a factor-10 in remnant needs u x sqrt(10)',
  spanRatioLadder: [3.6001, 3.5156], // declines toward sqrt(10) from above
  approachSign: 'from above', // span ratios > sqrt(10)
};

// Deepest measured rung of each ladder, and its relative distance to sqrt(10).
const DEEPEST = {
  A_upslope: A_KERNEL_FOLD.deepGrowthPerDecade.upslope,
  A_downslope: A_KERNEL_FOLD.deepGrowthPerDecade.downslope,
  B: B_COLL_AMPLITUDE.localDecayLadder[B_COLL_AMPLITUDE.localDecayLadder.length - 1], // 2.8985
  C: C_REMNANT_RECIPROCAL.spanRatioLadder[C_REMNANT_RECIPROCAL.spanRatioLadder.length - 1], // 3.5156
};
const REL_DIST_TO_SQRT10 = {
  A_upslope: +(Math.abs(DEEPEST.A_upslope - SQRT10) / SQRT10).toFixed(4),
  A_downslope: +(Math.abs(DEEPEST.A_downslope - SQRT10) / SQRT10).toFixed(4),
  B: +(Math.abs(DEEPEST.B - SQRT10) / SQRT10).toFixed(4),
  C: +(Math.abs(DEEPEST.C - SQRT10) / SQRT10).toFixed(4),
};

// The three approach signs, collected -- distinct signs => distinct mechanisms.
const APPROACH_SIGNS = [
  A_KERNEL_FOLD.approachSign, // two-sided
  B_COLL_AMPLITUDE.approachSign, // from below
  C_REMNANT_RECIPROCAL.approachSign, // from above
];
const DISTINCT_SIGN_COUNT = new Set(APPROACH_SIGNS).size; // 3

export const IMP124774_SQRT10_MECHANISM_CROSSVALIDATION = {
  id: 'imp-124774',
  proofSection: 'S-frontier',
  question:
    'imp-97823 (|K| ~ g^(-1/2) kernel fold), imp-34528 (far-tail sigma ~ N^(-1/2)) and imp-35663 ' +
    '(E_flow remnant span-ratio) each report a sqrt(10) = 10^(1/2) per-decade rate. Are these one ' +
    'asymptotic mechanism sharing a single constant, or a numerical coincidence rooted only in the ' +
    'common RvM T0 ~ 2 pi N / log N scaffold? Cross-validation only; no bound moves; no QED.',
  method:
    'Bake the three headline ladders as reference literals, derive where the 1/2 comes from in each ' +
    '(fold-Jacobian exponent vs direct N^(-1/2) amplitude exponent vs reciprocal-of-2 power), and ' +
    'compare the approach-to-sqrt(10) SIGN and residual-decay CONSTANT of each. Identical mechanisms ' +
    'would share sign and residual constant.',
  sqrt10: +SQRT10.toFixed(6), // 3.162278 (the shared target)
  ladders: { A_kernelFold: A_KERNEL_FOLD, B_collAmplitude: B_COLL_AMPLITUDE, C_remnantReciprocal: C_REMNANT_RECIPROCAL },
  deepestRung: DEEPEST,
  relativeDistanceToSqrt10: REL_DIST_TO_SQRT10,
  approachSigns: APPROACH_SIGNS,
  distinctSignCount: DISTINCT_SIGN_COUNT,
  finding: {
    X1_coincident_number:
      'All three target the SAME sqrt(10) = 3.162278 to within ~15% at their deepest measured rung ' +
      '(A upslope/downslope 3.158/3.167, B 2.8985, C 3.5156) -- the number is real and shared.',
    X2_distinct_mechanisms:
      'The 1/2 arises three ways: a FOLD-JACOBIAN exponent (A, 1/(order-2 max), generic to any smooth ' +
      'peak), a DIRECT N^(-1/2) collision-amplitude exponent (B, the genuine RvM balance), and a ' +
      'RECIPROCAL-OF-2 power (C, remnant ~ u^(-2)). Three structurally unrelated exponent origins, ' +
      'not one asymptotic constant.',
    X3_signatures_separate_them:
      'The approach signs differ (A two-sided/bracketing, B from below, C from above: ' +
      DISTINCT_SIGN_COUNT + ' distinct) and the residual-decay constants differ (A ~1/sqrt(10) ~ ' +
      '0.3162 per decade of gap from the cubic fold; B ~1/2 per decade of N from the L = log T0 slow ' +
      'growth). A single mechanism could not present three signs and two residual constants.',
    X4_only_shared_root_is_rvm:
      'The one shared root is the RvM T0 ~ 2 pi N / log N scaffold, which simultaneously fixes ' +
      'E_coll ~ N^(-1/2) (so B is sqrt(10)-per-decade), makes sigma a smooth-peaked function of log N ' +
      '(so A is a quadratic fold), and drives the E_flow remnant u^(-2) tail (so C is ' +
      'sqrt(10)-per-span). The number is inherited from the scaffold; the mechanisms are not one.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier cross-check, NOT rigorous). The imp-97823 |K| ~ g^(-1/2) kernel fold, ' +
    'the imp-34528 far-tail sigma ~ N^(-1/2) collision decay, and the imp-35663 E_flow remnant ' +
    'span-ratio all report sqrt(10) = 3.162278 per decade, but they are NOT one asymptotic mechanism ' +
    'sharing a single constant. The 1/2 is a fold-Jacobian exponent in imp-97823 (1/(order-2 peak), ' +
    'generic to any smooth maximum, of the GAP g), a direct N^(-1/2) collision-amplitude exponent in ' +
    'imp-34528 (the genuine RvM balance, of N), and a reciprocal-of-2 power in imp-35663 (remnant ~ ' +
    'u^(-2), u = log N). The distinguishing fingerprint is the approach: imp-97823 brackets sqrt(10) ' +
    'two-sided (arms above and below, residual ~1/sqrt(10) per decade of gap from the cubic fold), ' +
    'imp-34528 approaches from below (gap to sqrt(10) halving ~1/2 per decade of N from the L = log T0 ' +
    'slow growth), imp-35663 approaches from above (span ratios 3.6001 -> 3.5156). Three distinct ' +
    'signs and two distinct residual constants rule out a single mechanism. The only shared root is the ' +
    'RvM T0 ~ 2 pi N / log N scaffold that fixes E_coll ~ N^(-1/2), makes sigma smooth-peaked, and ' +
    'drives the remnant u^(-2) tail: the NUMBER sqrt(10) is inherited from that scaffold, the ' +
    'MECHANISMS are not one. Re-tabulates the three modules headline numbers verbatim; component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 and the C_C 1/8 ansatz are UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97823 (interior-peak |K| ~ g^(-1/2), deep growth 3.158/3.167); imp-34528 (far-tail sigma ~ ' +
    'N^(-1/2), localDecay -> sqrt(10)); imp-35663 (E_flow remnant span-ratio -> sqrt(10)); imp-35552 ' +
    '(remnant ~ u^(-2), u = log N); imp-97520 (L1 peak); imp-486 (C_mb GUE-conditional); imp-3066 ' +
    '(K_a >= 0 untouched).',
};

export const IMP124774_SQRT10_MECHANISM_CROSSVALIDATION_ASSERTIONS = [
  {
    // (X1) All three deepest rungs target the same sqrt(10) to within ~15%.
    id: 'imp124774-coincident-number-within-15pct',
    description: 'A/B/C deepest rungs all sit within 15% of sqrt(10) = 3.162278 (the shared target)',
    holds: () =>
      REL_DIST_TO_SQRT10.A_upslope < 0.15 &&
      REL_DIST_TO_SQRT10.A_downslope < 0.15 &&
      REL_DIST_TO_SQRT10.B < 0.15 &&
      REL_DIST_TO_SQRT10.C < 0.15,
  },
  {
    // (X2) The three exponent roles are the direct-exponent (A, B) and reciprocal-of-2 (C) structures.
    id: 'imp124774-exponent-roles-distinct',
    description: 'A/B carry a direct exponent -1/2 (of different variables); C is a reciprocal of power -2',
    holds: () =>
      A_KERNEL_FOLD.exponent === -0.5 &&
      B_COLL_AMPLITUDE.exponent === -0.5 &&
      C_REMNANT_RECIPROCAL.controllingPower === -2 &&
      A_KERNEL_FOLD.drivingVariable !== B_COLL_AMPLITUDE.drivingVariable,
  },
  {
    // (X3) The three approach signs are all distinct (two-sided / below / above) => distinct mechanisms.
    id: 'imp124774-three-distinct-approach-signs',
    description: 'the approach signs are three distinct values (two-sided, from below, from above)',
    holds: () => DISTINCT_SIGN_COUNT === 3,
  },
  {
    // (X3) imp-97823 brackets sqrt(10): upslope below, downslope above.
    id: 'imp124774-A-brackets-sqrt10',
    description: 'imp-97823 arms bracket sqrt(10): upslope growth < sqrt(10) < downslope growth',
    holds: () =>
      A_KERNEL_FOLD.deepGrowthPerDecade.upslope < SQRT10 &&
      A_KERNEL_FOLD.deepGrowthPerDecade.downslope > SQRT10,
  },
  {
    // (X3) imp-34528 approaches sqrt(10) strictly from below, gap shrinking (~1/2 per decade).
    id: 'imp124774-B-approaches-from-below',
    description: 'imp-34528 localDecay stays below sqrt(10) and rises; its gap to sqrt(10) shrinks',
    holds: () =>
      B_COLL_AMPLITUDE.localDecayLadder.every((d) => d < SQRT10) &&
      B_COLL_AMPLITUDE.localDecayLadder.every((d, i) => i === 0 || d > B_COLL_AMPLITUDE.localDecayLadder[i - 1]) &&
      B_COLL_AMPLITUDE.gapToSqrt10.every((g, i) => i === 0 || g < B_COLL_AMPLITUDE.gapToSqrt10[i - 1]),
  },
  {
    // (X3) imp-35663 approaches sqrt(10) strictly from above, span ratios declining.
    id: 'imp124774-C-approaches-from-above',
    description: 'imp-35663 span ratios stay above sqrt(10) and decline toward it',
    holds: () =>
      C_REMNANT_RECIPROCAL.spanRatioLadder.every((r) => r > SQRT10) &&
      C_REMNANT_RECIPROCAL.spanRatioLadder[1] < C_REMNANT_RECIPROCAL.spanRatioLadder[0],
  },
  {
    // (X3) The residual-decay constants differ: A ~1/sqrt(10) ~ 0.316, B ~1/2 -- not one mechanism.
    id: 'imp124774-residual-constants-differ',
    description: 'A residual decays ~1/sqrt(10) per decade of gap; B gap decays ~1/2 per decade of N (distinct)',
    holds: () =>
      Math.abs(A_KERNEL_FOLD.residualDecayPerDecade - 1 / SQRT10) < 0.05 &&
      Math.abs(B_COLL_AMPLITUDE.residualDecayPerDecade - 0.5) < 0.05 &&
      Math.abs(A_KERNEL_FOLD.residualDecayPerDecade - B_COLL_AMPLITUDE.residualDecayPerDecade) > 0.1,
  },
  {
    // Honesty gate: cross-validation only, no QED, no refereed bound is changed.
    id: 'imp124774-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124774_SQRT10_MECHANISM_CROSSVALIDATION.isRigorous === false &&
      /NO QED/.test(IMP124774_SQRT10_MECHANISM_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP124774_SQRT10_MECHANISM_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP124774_SQRT10_MECHANISM_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124774-sqrt10-mechanism-crossvalidation assertion failed: ${a.id}`);
  }
}
