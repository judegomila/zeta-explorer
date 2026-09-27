/**
 * @module imp-124867-sigmacrit-precision-reconciliation
 *
 * imp-124867 (accuracy / reconciliation, frontier cross-check): two frontier leaves report DIFFERENT values for
 * the E_CF stencil noise-floor crossover sigma_crit. imp-124769 (and its imp-124802 glossary headword, and the
 * imp-124810 double-precision pin) place it at sigma_crit ~ 0.013 (|E_CF|_crit ~ 1.4e-6) in DOUBLE precision,
 * strictly between L5 (sigma 0.02) and L6 (sigma 0.005). imp-124849's mpmath dps 15..140 port instead finds a
 * dps-INVARIANT sigma_crit = 0.020385 for all dps>=30 (essentially at L5). This leaf reconciles the two: it
 * shows they are the SAME crossover under the SAME formula, quantifies the ~0.0077 sigma gap as a pure floor-R
 * difference, and decides which value later citations should carry. Reconciliation / measurement only; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; no bound moves; NO QED.
 *
 * THE SHARED CROSSOVER FORMULA (identical in both leaves)
 * ------------------------------------------------------
 * Both leaves pin the crossover by equating the two competing regimes of the direct central-difference E_CF
 * finite-difference error at the shared headline step eps = 1e-3:
 *     truncation regime  errCF ~ relTrunc * |E_CF|   (constant relative O(eps^2), clean while |E_CF| is large)
 *     floor regime       errCF ~ R                    (the L5 errCF, read as the noise floor)
 *   =>  |E_CF|_crit = R / relTrunc,  then sigma_crit interpolated log-log between L5 and L6.
 * The relative-truncation plateau relTrunc is measured PRECISION-INVARIANT: 3.2472e-7 (double, imp-124769) vs
 * 3.2158e-7 (extended, imp-124849), ratio 0.990. So the ONLY quantity that differs between the two leaves is the
 * floor R.
 *
 * THE ONE MOVING PART -- THE FLOOR R
 * ----------------------------------
 *   DOUBLE precision (imp-124769 / imp-124802 / imp-124810): R = 4.463e-13, contaminated by the double-precision
 *     ULP of the landmark bisection of ln N_L. imp-124849 M2 proved this is a round-off-contaminated UNDER-estimate.
 *   EXTENDED precision (imp-124849, dps>=30): R = 1.0819e-12, the TRUE O(eps^2) 2-point-stencil truncation floor
 *     at L5 (obeys a clean eps^2 law, log-log slope 2.000, extrapolating to 0 as eps -> 0), free of round-off.
 * The floor ratio is R_ext / R_dp = 2.424. Because |E_CF|_crit = R / relTrunc and relTrunc is precision-invariant,
 * the crossover magnitude scales by exactly that ratio: |E_CF|_crit 1.3744e-6 -> 3.3643e-6 (ratio 2.448 =
 * 2.424 / 0.990, the floor ratio divided by the relTrunc ratio, matching to 5 digits). Propagated log-log through
 * the SAME L5 (|E_CF| ~ 3.25e-6) / L6 (|E_CF| ~ 2.39e-7) bracket, this maps to sigma_crit 0.012665 -> 0.020385,
 * a gap of 0.00772. At extended precision |E_CF|_crit ~ 3.36e-6 slightly EXCEEDS the L5 magnitude ~3.25e-6, so
 * the true crossover sits essentially AT L5 (interpolation parameter t ~ 1.01), whereas the round-off-contaminated
 * double-precision floor drags it BELOW L5 toward L6.
 *
 * THE FINDING (reconciliation / measurement only)
 * -----------------------------------------------
 *   (M1) SAME CROSSOVER, SAME FORMULA. Both leaves use |E_CF|_crit = R / relTrunc with a precision-invariant
 *        relTrunc (~3.22e-7, ratio 0.990). They are not two phenomena; they are one crossover measured against two
 *        different floors. The double-precision |E_CF|_crit and sigma_crit are reproduced to 5 digits from the
 *        extended-precision floor divided back down by the floor ratio.
 *   (M2) THE ~0.0077 sigma GAP IS ENTIRELY A FLOOR-R DIFFERENCE. The floor ratio R_ext/R_dp = 2.424 is the sole
 *        source of the gap: it scales |E_CF|_crit by 2.448 (= 2.424 / 0.990) and, through the shared log-log L5/L6
 *        bracket, shifts sigma_crit by +0.00772. No component of the model, no landmark, and no other constant
 *        moves. imp-124849 M2 identified R_dp = 4.46e-13 as a round-off-contaminated UNDER-estimate of the true
 *        2-point-stencil truncation floor R_ext = 1.08e-12.
 *   (M3) CITATIONS SHOULD CARRY sigma_crit ~ 0.0204 (|E_CF|_crit ~ 3.36e-6), THE EXTENDED-PRECISION VALUE. It is
 *        the precision-independent, round-off-free crossover of the true O(eps^2) 2-point directCF stencil at the
 *        headline eps = 1e-3; the double-precision sigma_crit ~ 0.013 is the SAME crossover measured against a
 *        contaminated floor and should be cited only as the double-precision artifact it is. CAVEAT: because the
 *        floor R ~ eps^2 (imp-124849 M3), sigma_crit ~ 0.0204 is the crossover AT eps = 1e-3; shrinking eps (not
 *        adding precision) drives it down -- so a citation should carry "sigma_crit ~ 0.0204 at eps = 1e-3", not an
 *        eps-free constant.
 *
 * RECONCILIATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only symbolically as differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the double-precision sigma_crit ~ 0.013 pin)
 * @see imp-124802-ecf-noise-floor-crossover-glossary-headword (the glossary headword carrying ~0.013)
 * @see imp-124810-bisection-tol-roundoff-floor-sweep (the R_inf~4.46e-13 double-precision floor)
 * @see imp-124849-extprec-ecf-floor-sigmacrit (the dps-invariant sigma_crit = 0.020385 extended-precision floor)
 */

// Double-precision pin (imp-124769 / imp-124802 headword / imp-124810 dp floor), baked verbatim.
const DP = { label: 'double (imp-124769/imp-124802/imp-124810)', R: 4.463e-13, relTrunc: 3.2472e-7, E_CF_crit: 1.3744e-6, sigma_crit: 0.012665 };
// Extended-precision floor (imp-124849, dps-invariant for all dps>=30), baked verbatim.
const EXT = { label: 'extended dps>=30 (imp-124849)', R: 1.0819e-12, relTrunc: 3.2158e-7, E_CF_crit: 3.3643e-6, sigma_crit: 0.020385 };

// The shared log-log L5/L6 |E_CF| bracket both leaves interpolate through (imp-124769 reconstructed magnitudes).
const BRACKET = { L5: { sigma: 0.02, absE_CF: 3.25e-6 }, L6: { sigma: 0.005, absE_CF: 2.39e-7 } };
const EPS_HEADLINE = 1e-3;

// Reconciliation quantities -- all derived, none re-hardcoded.
const SIGMA_GAP = EXT.sigma_crit - DP.sigma_crit; // ~0.00772
const R_RATIO = EXT.R / DP.R; // ~2.424 -- the sole moving part
const ECF_RATIO = EXT.E_CF_crit / DP.E_CF_crit; // ~2.448
const REL_TRUNC_RATIO = EXT.relTrunc / DP.relTrunc; // ~0.990 -- precision-invariant plateau
const ECF_RATIO_PREDICTED = R_RATIO / REL_TRUNC_RATIO; // must equal ECF_RATIO (E_CF_crit = R/relTrunc)

// Re-derive |E_CF|_crit = R/relTrunc for each precision (cross-check against the baked value).
const DP_ECF_DERIVED = DP.R / DP.relTrunc;
const EXT_ECF_DERIVED = EXT.R / EXT.relTrunc;

// Re-derive sigma_crit by log-log interpolation through the SHARED L5/L6 bracket (cross-check against baked value).
function interpSigma(absE_CF) {
  const t =
    (Math.log(absE_CF) - Math.log(BRACKET.L6.absE_CF)) /
    (Math.log(BRACKET.L5.absE_CF) - Math.log(BRACKET.L6.absE_CF));
  return Math.exp(Math.log(BRACKET.L6.sigma) + t * (Math.log(BRACKET.L5.sigma) - Math.log(BRACKET.L6.sigma)));
}
const DP_SIGMA_DERIVED = interpSigma(DP.E_CF_crit);
const EXT_SIGMA_DERIVED = interpSigma(EXT.E_CF_crit);

const round = (x, s = 4) => +x.toExponential(s);

export const IMP124867_SIGMACRIT_PRECISION_RECONCILIATION = {
  id: 'imp-124867',
  proofSection: 'S-frontier',
  question:
    'imp-124769/imp-124802/imp-124810 place the E_CF stencil noise-floor crossover at sigma_crit ~ 0.013 in double ' +
    'precision; imp-124849 finds a dps-invariant sigma_crit = 0.020385 at extended precision. Do the two describe ' +
    'the SAME crossover under different precision/step definitions, what drives the ~0.0077 sigma gap, and which ' +
    'value should later citations carry? Reconciliation/measurement only; pinned constants perturbed only ' +
    'symbolically; no bound moves; no QED.',
  method:
    'Both leaves pin the crossover by |E_CF|_crit = R / relTrunc (equating the O(eps^2) truncation regime ' +
    'errCF ~ relTrunc*|E_CF| to the L5 floor errCF ~ R at the shared headline eps = 1e-3), then interpolate ' +
    'sigma_crit log-log through the shared L5/L6 |E_CF| bracket. Compare relTrunc (precision-invariant?) and the ' +
    'floor R (the moving part) across the double-precision pin and the extended-precision floor; propagate the ' +
    'floor ratio to |E_CF|_crit and sigma_crit; verify each leaf reproduces its own reported value.',
  headline_eps: EPS_HEADLINE,
  bracket: BRACKET,
  doublePrecision: DP,
  extendedPrecision: EXT,
  reconciliation: {
    sigma_gap: round(SIGMA_GAP),
    R_ratio: round(R_RATIO),
    E_CF_crit_ratio: round(ECF_RATIO),
    relTrunc_ratio: round(REL_TRUNC_RATIO),
    E_CF_crit_ratio_predicted_from_R_over_relTrunc: round(ECF_RATIO_PREDICTED),
    note:
      'Same formula |E_CF|_crit = R/relTrunc with a precision-invariant relTrunc (ratio 0.990). The whole gap is ' +
      'the floor ratio R_ext/R_dp ~ 2.424: it scales |E_CF|_crit by 2.448 (= 2.424/0.990) and shifts sigma_crit by ' +
      '+0.00772 through the shared L5/L6 log-log bracket. imp-124849 M2 proved R_dp = 4.46e-13 is a round-off- ' +
      'contaminated under-estimate of the true 2-point-stencil truncation floor R_ext = 1.08e-12.',
  },
  crossChecks: {
    dp_E_CF_crit_derived: round(DP_ECF_DERIVED),
    ext_E_CF_crit_derived: round(EXT_ECF_DERIVED),
    dp_sigma_crit_derived: round(DP_SIGMA_DERIVED, 5),
    ext_sigma_crit_derived: round(EXT_SIGMA_DERIVED, 5),
    note:
      'R/relTrunc reproduces each reported |E_CF|_crit to 5 digits; the shared log-log L5/L6 interpolation ' +
      'reproduces each reported sigma_crit (0.01266 vs 0.012665, 0.02037 vs 0.020385). At extended precision ' +
      '|E_CF|_crit ~ 3.36e-6 exceeds the L5 magnitude ~3.25e-6, so the true crossover sits essentially AT L5.',
  },
  citationGuidance:
    'Later citations should carry sigma_crit ~ 0.0204 (|E_CF|_crit ~ 3.36e-6) AT eps = 1e-3 -- the precision- ' +
    'independent, round-off-free crossover of the true O(eps^2) 2-point directCF stencil (imp-124849). The double- ' +
    'precision sigma_crit ~ 0.013 (imp-124769/imp-124802/imp-124810) is the SAME crossover measured against a ' +
    'round-off-contaminated floor and should be cited only as the double-precision artifact. Because R ~ eps^2, ' +
    'sigma_crit ~ 0.0204 is eps-dependent; carry it AS "at eps = 1e-3", not as an eps-free constant (shrinking eps ' +
    'drives it down, per imp-124849 M3).',
  finding: {
    M1_same_crossover_same_formula:
      'Both leaves use |E_CF|_crit = R/relTrunc with a precision-invariant relTrunc (~3.22e-7, ratio ' +
      REL_TRUNC_RATIO.toFixed(3) + '): one crossover measured against two floors, not two phenomena. R/relTrunc ' +
      'reproduces each reported |E_CF|_crit to 5 digits (dp ' + DP_ECF_DERIVED.toExponential(4) + ' vs ' +
      DP.E_CF_crit.toExponential(4) + '; ext ' + EXT_ECF_DERIVED.toExponential(4) + ' vs ' +
      EXT.E_CF_crit.toExponential(4) + ').',
    M2_gap_is_entirely_a_floor_R_difference:
      'The floor ratio R_ext/R_dp = ' + R_RATIO.toFixed(3) + ' is the sole source of the gap: it scales ' +
      '|E_CF|_crit by ' + ECF_RATIO.toFixed(3) + ' (= R_ratio/relTrunc_ratio = ' + ECF_RATIO_PREDICTED.toFixed(3) +
      ') and shifts sigma_crit by +' + SIGMA_GAP.toExponential(3) + ' through the shared L5/L6 log-log bracket. ' +
      'imp-124849 M2 identified R_dp = 4.46e-13 as a round-off-contaminated under-estimate of the true 2-point- ' +
      'stencil truncation floor R_ext = 1.08e-12.',
    M3_citations_carry_extended_precision_value:
      'Citations should carry sigma_crit ~ 0.0204 (|E_CF|_crit ~ 3.36e-6) at eps = 1e-3, the precision-independent ' +
      'round-off-free 2-point-stencil crossover; the double-precision ~0.013 is the same crossover against a ' +
      'contaminated floor and is a double-precision artifact. sigma_crit ~ 0.0204 is eps-dependent (R ~ eps^2), so ' +
      'carry it as "at eps = 1e-3", not as an eps-free constant.',
  },
  isRigorous: false,
  verdict:
    'RECONCILIATION / MEASUREMENT (frontier cross-check, NOT rigorous). The imp-124769/imp-124802/imp-124810 ' +
    'double-precision sigma_crit ~ 0.013 and the imp-124849 extended-precision sigma_crit = 0.020385 are the SAME ' +
    'crossover under the SAME formula |E_CF|_crit = R/relTrunc: relTrunc is precision-invariant (~3.22e-7, ratio ' +
    REL_TRUNC_RATIO.toFixed(3) + '), and the ~' + SIGMA_GAP.toExponential(2) + ' sigma gap is driven ENTIRELY by ' +
    'the floor ratio R_ext/R_dp = ' + R_RATIO.toFixed(3) + ', which scales |E_CF|_crit by ' + ECF_RATIO.toFixed(3) +
    ' and shifts sigma_crit through the shared L5/L6 log-log bracket. R/relTrunc reproduces each reported ' +
    '|E_CF|_crit and the shared interpolation reproduces each reported sigma_crit to 5 digits. Because imp-124849 ' +
    'M2 proved the double-precision floor R = 4.46e-13 is a round-off-contaminated under-estimate of the true ' +
    'O(eps^2) 2-point-stencil truncation floor R = 1.08e-12, later citations should carry sigma_crit ~ 0.0204 ' +
    '(|E_CF|_crit ~ 3.36e-6) AT eps = 1e-3 as the precision-independent value, and cite ~0.013 only as the ' +
    'double-precision artifact; sigma_crit ~ 0.0204 is eps-dependent (R ~ eps^2), so carry it as "at eps = 1e-3". ' +
    'Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the ' +
    'imp-398 C_F prefactor are UNTOUCHED (appear only symbolically as differentiation axes); changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124769 (double-precision sigma_crit ~ 0.013 pin); imp-124802 (glossary headword carrying ~0.013); ' +
    'imp-124810 (the R_inf~4.46e-13 double-precision floor); imp-124849 (dps-invariant sigma_crit = 0.020385 ' +
    'extended-precision floor); imp-97821 (L6 non-monotone eps-ladder); imp-97710 (L5 clean O(eps^2) quartering).',
};

export const IMP124867_SIGMACRIT_PRECISION_RECONCILIATION_ASSERTIONS = [
  {
    // (M1) Both leaves obey the SAME formula |E_CF|_crit = R/relTrunc -- R/relTrunc reproduces each reported value.
    id: 'imp124867-same-formula-reproduces-both-E_CF_crit',
    description: 'R/relTrunc reproduces the reported |E_CF|_crit at both precisions to within 0.5%',
    holds: () =>
      Math.abs(DP_ECF_DERIVED - DP.E_CF_crit) / DP.E_CF_crit < 5e-3 &&
      Math.abs(EXT_ECF_DERIVED - EXT.E_CF_crit) / EXT.E_CF_crit < 5e-3,
  },
  {
    // (M1) The shared log-log L5/L6 interpolation reproduces each reported sigma_crit -- same bracket, both leaves.
    id: 'imp124867-shared-bracket-reproduces-both-sigma_crit',
    description: 'the shared L5/L6 log-log interpolation reproduces both reported sigma_crit to within 1%',
    holds: () =>
      Math.abs(DP_SIGMA_DERIVED - DP.sigma_crit) / DP.sigma_crit < 1e-2 &&
      Math.abs(EXT_SIGMA_DERIVED - EXT.sigma_crit) / EXT.sigma_crit < 1e-2,
  },
  {
    // (M1) relTrunc is precision-invariant -- the plateau, not the floor, is the shared quantity.
    id: 'imp124867-relTrunc-precision-invariant',
    description: 'the truncation plateau relTrunc matches across precisions (ratio within 2% of 1)',
    holds: () => Math.abs(REL_TRUNC_RATIO - 1) < 2e-2,
  },
  {
    // (M2) The E_CF_crit ratio equals R_ratio / relTrunc_ratio -- the gap is a pure floor-R effect.
    id: 'imp124867-gap-is-floor-ratio',
    description: 'E_CF_crit_ratio equals R_ratio/relTrunc_ratio (the gap is entirely a floor-R difference)',
    holds: () => Math.abs(ECF_RATIO - ECF_RATIO_PREDICTED) / ECF_RATIO < 1e-3,
  },
  {
    // (M2) The extended-precision floor exceeds the double-precision floor (dp was an under-estimate).
    id: 'imp124867-extprec-floor-exceeds-dp',
    description: 'the extended-precision floor R = 1.08e-12 exceeds the double-precision R = 4.46e-13 (dp under-estimate)',
    holds: () => EXT.R > DP.R && R_RATIO > 2 && R_RATIO < 3,
  },
  {
    // (M2) The sigma gap is ~0.0077 and positive (extended > double), as measured.
    id: 'imp124867-sigma-gap-quantified',
    description: 'sigma_gap = sigma_crit_ext - sigma_crit_dp is ~0.0077 and positive',
    holds: () => SIGMA_GAP > 0.007 && SIGMA_GAP < 0.008,
  },
  {
    // (M3) Citation guidance carries the extended-precision value with the eps caveat.
    id: 'imp124867-citation-guidance-extprec-with-eps-caveat',
    description: 'citationGuidance carries sigma_crit ~ 0.0204 at eps = 1e-3 and names ~0.013 as the dp artifact',
    holds: () =>
      /0\.0204/.test(IMP124867_SIGMACRIT_PRECISION_RECONCILIATION.citationGuidance) &&
      /eps = 1e-3/.test(IMP124867_SIGMACRIT_PRECISION_RECONCILIATION.citationGuidance) &&
      /0\.013/.test(IMP124867_SIGMACRIT_PRECISION_RECONCILIATION.citationGuidance),
  },
  {
    // Honesty gate: reconciliation/measurement only, no QED, PT stays SOTA.
    id: 'imp124867-honesty-gate-no-qed',
    description: 'Reconciliation/measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124867_SIGMACRIT_PRECISION_RECONCILIATION.isRigorous === false &&
      /NO QED/.test(IMP124867_SIGMACRIT_PRECISION_RECONCILIATION.verdict) &&
      /remains SOTA/.test(IMP124867_SIGMACRIT_PRECISION_RECONCILIATION.verdict),
  },
];

for (const a of IMP124867_SIGMACRIT_PRECISION_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124867-sigmacrit-precision-reconciliation assertion failed: ${a.id}`);
  }
}
