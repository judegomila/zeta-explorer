/**
 * @module imp-35672-route-ii-gtrue-spotcheck-scope
 *
 * imp-35672 (proof/assessment, S-frontier): SCOPE what the route-(ii) imp-35488
 * two-height data-anchored g_true spot-check CAN and CANNOT certify for the OPEN
 * imp-35337a surrogate -> observable dictionary, now that imp-35652 has ruled the
 * route-(i) option-(a) restricted-support surrogate NON-viable (resolution-floor
 * obstruction) and left route-(ii) as the sole remaining partial.
 *
 * imp-35488 EXECUTED the route-(ii) check: at the ONE in-repo-reachable landmark
 * height (the interior flat-cap PEAK, N ~ 9.2186e5, T0_PEAK ~ 557318, matching
 * gamma_921860 to ~1.7e-6) it measured g_true -- the empirical-vs-GUE
 * nearest-neighbour spacing deviation on a 100001-real-zero RvM-unfolded window
 * (max spacing-pdf residual 0.049026, KL 0.0014321, Hellinger 0.019198, min
 * unfolded spacing 0.016794), TIGHTER than the first-10000 reference (KL 0.008118,
 * Hellinger 0.048284: GUE universality improves with height). The second landmark,
 * the E_coll = E_trunc CROSSOVER (N ~ 3.280294352e9, height ~1.14e9), sits
 * ~3280x beyond the last of the first 10^6 Odlyzko ordinates, so IN-REPO the
 * two-height check reduces to a ONE-height peak check (sub-gap imp-35488a). This
 * module scopes precisely what that measurement pins about the surrogate map.
 *
 * ASSESSMENT / SCOPING ONLY. Discharges nothing; certifies no surrogate map;
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED. The
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631)
 * and C_mb GUE-conditional (imp-486) are UNTOUCHED. imp-35337a stays OPEN.
 * No refereed bound is changed.
 *
 * WHAT THE SPOT-CHECK CAN CERTIFY
 * -----------------------------------------------------------------------------
 * At the single in-repo-reachable peak height it certifies ONE point of the
 * surrogate map: the true empirical spacing law tracks the GUE law to a bounded,
 * small DISTRIBUTIONAL (spacing-pdf) deviation (KL 0.0014321, Hellinger 0.019198),
 * tighter than the low-height reference. This spot-confirms that the GUE law the
 * sigma surrogate is built on is a good local model of the true zero statistics at
 * that height -- a consistency check, not a certification.
 *
 * WHAT THE SPOT-CHECK STRUCTURALLY CANNOT CERTIFY
 * -----------------------------------------------------------------------------
 *  (1) NOT genuinely two-height in-repo. The crossover is ~3280x beyond the
 *      10^6-zero table (imp-35488a), so only ONE height is measurable and no
 *      two-point slope/trend of the surrogate map can be fit in-repo -- there is
 *      no anchored measurement of how the map drifts with height.
 *  (2) DISTRIBUTIONAL != SIGMA-UNIT. g_true is a spacing-pdf deviation, NOT the
 *      absolute sigma-unit fidelity the flat-cap PEAK budget (~2.14e-5) or the
 *      crossover relative budget (~0.5%) asks for. Converting a spacing-pdf
 *      residual into a sigma-unit error on the collision share is exactly the
 *      surrogate -> observable dictionary the C_C = (1/8) sqrt(3 pi) ansatz encodes
 *      and imp-35337a leaves OPEN (sub-gap imp-35488b): a finite pdf residual does
 *      NOT bound the leading-constant error in sigma units.
 *  (3) NO FULL-SUPPORT GUE LAW. A finite empirical window measures the spacing pdf
 *      only up to sampling/finite-N; it cannot supply the unconditional
 *      full-support Montgomery pair-correlation law that C_mb needs, so C_mb stays
 *      GUE-conditional (imp-486) and the route-(i) full-support requirement
 *      (imp-35538/imp-35652) is untouched.
 *  (4) NOT A GLOBAL CERTIFICATION. A one/two-height spot check cannot rule out the
 *      surrogate drifting from the observable at unmeasured heights, in particular
 *      the far tail toward and beyond T_PT = 3e12.
 *
 * NET: the route-(ii) g_true spot-check MERELY spot-confirms one height of the
 * surrogate map (a bounded, small distributional GUE deviation, improving with
 * height); it neither closes imp-35337a nor narrows it to unconditional, and it
 * does NOT degrade its openness. The distributional -> sigma-unit dictionary
 * (imp-35488b), the missing second anchored height (imp-35488a) and the
 * full-support GUE law (imp-486) all remain OPEN. imp-35337a stays OPEN; C_mb
 * GUE-conditional; assessment/scoping only, changes no bound, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35488-route-ii-two-height-gtrue-spotcheck (the executed route-(ii) partial this module scopes)
 * @see imp-35652-req3-option-a-restricted-support-surrogate-scope (eliminated route-(i) option-(a); named route-(ii) as the sole viable partial)
 * @see imp-35337 (names the OPEN imp-35337a surrogate -> observable dictionary)
 * @see imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz)
 * @see imp-486 (GUE-conditional caveat inherited by C_mb)
 * Literature: Odlyzko (zero ordinates); Montgomery (1973); RvM unfolding.
 */

const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // (1/8) sqrt(3 pi) ~ 0.38374752 (imp-2642/imp-2643 ansatz)
const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any route-(ii) scoping)

// The two route-(ii) landmark heights (imp-35488), taken as given.
const N_PEAK = 9.2186e5; // interior flat-cap sigma PEAK -- the ONE in-repo-reachable height
const N_CROSS = 3.280294352e9; // E_coll = E_trunc CROSSOVER -- ~3280x beyond the 10^6-zero table
const TABLE_ZEROS = 1e6; // first 10^6 Odlyzko ordinates (last at height ~6.0027e5)
const CROSSOVER_BEYOND_TABLE = N_CROSS / TABLE_ZEROS; // ~3280.29x (sub-gap imp-35488a)

// The imp-35488 peak-height g_true reading (spacing-pdf deviation) and the low-height reference.
const G_TRUE_PEAK_KL = 0.0014321;
const G_TRUE_PEAK_HELLINGER = 0.019198;
const G_TRUE_PEAK_MAX_RESIDUAL = 0.049026;
const G_TRUE_PEAK_MIN_SPACING = 0.016794;
const REF_10000_KL = 0.008118; // first-10000 reference (looser -> universality improves with height)
const REF_10000_HELLINGER = 0.048284;

// The sigma-unit budgets the surrogate -> observable dictionary would have to meet (imp-35475 Part C).
const FLAT_CAP_PEAK_BUDGET = 2.14e-5; // absolute sigma-unit flat-cap PEAK budget
const CROSSOVER_REL_BUDGET = 0.005; // ~0.5% relative CROSSOVER budget
const E_COLL_PEAK = 1.453810e-3; // surrogate E_coll at the peak
const E_COLL_CROSS = 3.060000e-5; // surrogate E_coll at the crossover (reproduces E_coll = E_trunc)

export const IMP35672_ROUTE_II_GTRUE_SPOTCHECK_SCOPE = {
  id: 'imp-35672',
  proofSection: 'S-frontier',
  question:
    'Now that imp-35652 has ruled the route-(i) option-(a) restricted-support surrogate NON-viable and named the ' +
    'route-(ii) imp-35488 two-height data-anchored g_true spot-check the SOLE remaining viable partial for the OPEN ' +
    'imp-35337a surrogate -> observable dictionary, scope concretely what that spot-check CAN pin, what it ' +
    'structurally CANNOT (no genuine two-height in-repo, no distributional -> sigma-unit conversion, no full-support ' +
    'GUE law, no unconditional C_mb), and whether it degrades the imp-35337a openness or merely spot-confirms it. ' +
    'Assessment/scoping only; discharges nothing; NO QED.',
  whatItCanCertify:
    'At the ONE in-repo-reachable peak height (N ~ 9.2186e5, T0_PEAK ~ 557318) the spot-check certifies ONE point ' +
    'of the surrogate map: the true empirical nearest-neighbour spacing law tracks the GUE law to a bounded, small ' +
    'DISTRIBUTIONAL (spacing-pdf) deviation (KL 0.0014321, Hellinger 0.019198, max pdf residual 0.049026), TIGHTER ' +
    'than the first-10000 reference (KL 0.008118, Hellinger 0.048284) -- GUE universality improving with height. ' +
    'This spot-confirms the GUE law underlying the sigma surrogate as a good LOCAL model at that height; it is a ' +
    'consistency check, not a certification.',
  whatItCannotCertify: [
    'NOT genuinely two-height in-repo: the crossover (N ~ 3.28e9, height ~1.14e9) is ~3280x beyond the 10^6-zero ' +
      'table (sub-gap imp-35488a), so only ONE height is measurable and no two-point slope/trend of the surrogate ' +
      'map can be fit in-repo.',
    'DISTRIBUTIONAL != SIGMA-UNIT: g_true is a spacing-pdf deviation, NOT the absolute sigma-unit fidelity the ' +
      'flat-cap PEAK budget (~2.14e-5) or the crossover relative budget (~0.5%) asks for; converting a pdf residual ' +
      'into a sigma-unit collision-share error is the surrogate -> observable dictionary imp-35337a leaves OPEN ' +
      '(sub-gap imp-35488b), and a finite pdf residual does NOT bound the C_C = (1/8) sqrt(3 pi) leading-constant ' +
      'error in sigma units.',
    'NO FULL-SUPPORT GUE LAW: a finite empirical window measures the spacing pdf only up to sampling/finite-N; it ' +
      'cannot supply the unconditional full-support Montgomery pair-correlation law C_mb needs, so C_mb stays ' +
      'GUE-conditional (imp-486).',
    'NOT A GLOBAL CERTIFICATION: a one/two-height spot check cannot rule out the surrogate drifting from the ' +
      'observable at unmeasured heights, in particular the far tail toward and beyond T_PT = 3e12.',
  ],
  spotCheckLiterals: {
    reachableHeight: { N: N_PEAK, gTrueKL: G_TRUE_PEAK_KL, gTrueHellinger: G_TRUE_PEAK_HELLINGER, maxResidual: G_TRUE_PEAK_MAX_RESIDUAL, minUnfoldedSpacing: G_TRUE_PEAK_MIN_SPACING },
    lowHeightReference: { KL: REF_10000_KL, Hellinger: REF_10000_HELLINGER },
    unreachableHeight: { N: N_CROSS, beyondTableFactor: +CROSSOVER_BEYOND_TABLE.toFixed(2) }, // ~3280.29x (imp-35488a)
    sigmaUnitBudgets: { flatCapPeak: FLAT_CAP_PEAK_BUDGET, crossoverRelative: CROSSOVER_REL_BUDGET },
    surrogateEColl: { peak: E_COLL_PEAK, cross: E_COLL_CROSS },
  },
  degradesImp35337aOpenness: false,
  merelySpotConfirms: true,
  certifiesSurrogateMap: false,
  isRigorous: false,
  isUnconditional: false,
  C_C: +C_C.toPrecision(8), // 0.38374752 (untouched)
  verdict:
    'ASSESSMENT / SCOPING (NOT rigorous). The route-(ii) imp-35488 g_true spot-check MERELY spot-confirms ONE height ' +
    'of the surrogate map -- a bounded, small distributional GUE deviation (KL 0.0014321, Hellinger 0.019198) that ' +
    'improves with height. It CANNOT certify the surrogate -> observable dictionary: it is not genuinely two-height ' +
    'in-repo (crossover ~3280x beyond the 10^6-zero table, imp-35488a), g_true is a distributional deviation NOT the ' +
    'sigma-unit fidelity the ~2.14e-5 flat-cap / ~0.5% crossover budgets demand (imp-35488b), a finite window ' +
    'supplies no full-support Montgomery pair-correlation law so C_mb stays GUE-conditional (imp-486), and one/two ' +
    'heights are not a global certification across the far tail toward T_PT = 3e12. So it neither closes nor narrows ' +
    'imp-35337a and does NOT degrade its openness -- it merely spot-confirms. imp-35488a/imp-35488b and the ' +
    'full-support law remain OPEN. Discharges nothing; certifies no surrogate map; changes no bound; establishes no ' +
    'operator positivity; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and C_mb ' +
    'GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35488 (executed route-(ii) two-height g_true spot-check; sub-gaps imp-35488a crossover-out-of-table, ' +
    'imp-35488b observable -> sigma dictionary); imp-35652 (eliminated route-(i) option-(a), named route-(ii) sole ' +
    'viable partial); imp-35337 (names OPEN imp-35337a); imp-35475 (Part C sigma-unit budgets); imp-2642/imp-2643 ' +
    '(C_C = (1/8) sqrt(3 pi)); imp-2631 (E_trunc floor); imp-486 (GUE-conditional caveat). Literature: Odlyzko ' +
    'ordinates; Montgomery (1973); RvM unfolding. Platt-Trudgian 2021 (T_PT = 3e12).',
};

export const IMP35672_ROUTE_II_GTRUE_SPOTCHECK_SCOPE_ASSERTIONS = [
  {
    // (1) CAN-certify side: the reachable peak reading is a small distributional deviation, TIGHTER than
    //     the low-height reference (universality improves with height), and only spot-confirms locally.
    id: 'imp35672-can-certify-one-height-distributional',
    description: 'the reachable peak g_true is a bounded distributional deviation tighter than the first-10000 reference (universality improves with height), certifying ONE local point of the surrogate map',
    holds: () => {
      const r = IMP35672_ROUTE_II_GTRUE_SPOTCHECK_SCOPE;
      return (
        /DISTRIBUTIONAL/.test(r.whatItCanCertify) &&
        /consistency check, not a certification/.test(r.whatItCanCertify) &&
        G_TRUE_PEAK_KL < REF_10000_KL && // peak KL tighter than the low-height reference
        G_TRUE_PEAK_HELLINGER < REF_10000_HELLINGER &&
        r.certifiesSurrogateMap === false
      );
    },
  },
  {
    // (2) CANNOT-certify side: all four structural gaps enumerated (one-height, dist!=sigma, no full-support, not global),
    //     and the crossover-beyond-table factor reproduces ~3280x.
    id: 'imp35672-cannot-certify-four-structural-gaps',
    description: 'the four structural non-certifications (not two-height in-repo, distributional != sigma-unit, no full-support GUE law, not global) are enumerated and the crossover sits ~3280x beyond the 10^6-zero table',
    holds: () => {
      const r = IMP35672_ROUTE_II_GTRUE_SPOTCHECK_SCOPE;
      const blob = r.whatItCannotCertify.join(' ');
      return (
        r.whatItCannotCertify.length === 4 &&
        /NOT genuinely two-height/.test(blob) &&
        /DISTRIBUTIONAL != SIGMA-UNIT/.test(blob) &&
        /NO FULL-SUPPORT GUE LAW/.test(blob) &&
        /NOT A GLOBAL CERTIFICATION/.test(blob) &&
        CROSSOVER_BEYOND_TABLE > 3200 && CROSSOVER_BEYOND_TABLE < 3300 &&
        Math.abs(CROSSOVER_BEYOND_TABLE - 3280.294352) < 1e-3
      );
    },
  },
  {
    // (3) sigma-unit gap arithmetic: the distributional Hellinger deviation is orders of magnitude ABOVE
    //     the flat-cap sigma-unit budget, so a pdf residual cannot double as a sigma-unit certificate.
    id: 'imp35672-distributional-far-above-sigma-budget',
    description: 'the peak spacing-pdf Hellinger deviation (~0.0192) dwarfs the sigma-unit flat-cap budget (~2.14e-5), so g_true cannot double as a sigma-unit fidelity certificate (imp-35488b)',
    holds: () =>
      G_TRUE_PEAK_HELLINGER > FLAT_CAP_PEAK_BUDGET && // 0.0192 >> 2.14e-5
      G_TRUE_PEAK_HELLINGER / FLAT_CAP_PEAK_BUDGET > 100 &&
      E_COLL_CROSS === 3.06e-5, // surrogate crossover reproduces E_coll = E_trunc
  },
  {
    // (4) verdict gate: merely spot-confirms, does NOT degrade openness, does NOT certify the map.
    id: 'imp35672-merely-spot-confirms-not-degraded',
    description: 'the spot-check merely spot-confirms one height, does NOT degrade the imp-35337a openness, and does NOT certify the surrogate map',
    holds: () => {
      const r = IMP35672_ROUTE_II_GTRUE_SPOTCHECK_SCOPE;
      return (
        r.merelySpotConfirms === true &&
        r.degradesImp35337aOpenness === false &&
        r.certifiesSurrogateMap === false &&
        /MERELY spot-confirms/.test(r.verdict) &&
        /does NOT degrade its openness/.test(r.verdict)
      );
    },
  },
  {
    // (5) honesty gate: conditional, changes no bound, C_mb GUE-conditional (imp-486), imp-35337a OPEN, no refereed bound is changed, NO QED.
    id: 'imp35672-conditional-no-bound-moves-no-qed',
    description: 'the assessment is not rigorous / not unconditional, changes no bound, keeps C_mb GUE-conditional (imp-486), leaves imp-35337a OPEN, PT 0.2 unchanged, NO QED',
    holds: () => {
      const r = IMP35672_ROUTE_II_GTRUE_SPOTCHECK_SCOPE;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        Math.abs(C_C - 0.38374752) < 1e-6 &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a stays OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP35672_ROUTE_II_GTRUE_SPOTCHECK_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35672-route-ii-gtrue-spotcheck-scope assertion failed: ${a.id}`);
  }
}
