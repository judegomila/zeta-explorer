/**
 * @module imp-35537-r1t-reentry-band-closure-scope
 *
 * imp-35537 (proof/assessment, S-frontier): SCOPE what CLOSING the OPEN true-dynamic
 * residue R1t (the true-dynamic half of the imp-35357 R1s/R1t pure-artifact split;
 * certificate imp-35243a OPEN) concretely requires, mirroring the imp-35475
 * sigma-fidelity closure scoping but for the REENTRY band. imp-35472/imp-35414
 * verified and formalized the R1s (surrogate) zero-residue LEMMA numerical inputs,
 * but R1t -- the claim that the TRUE collapse dynamic carries no reentry band at
 * ~10^27-10^37 -- stays OPEN and, until now, unscoped. This module enumerates the
 * closure requirements: which true dynamic input replaces the single-rate
 * contraction-map surrogate (r ~ 0.0454235), what residue error control the
 * reentry-band landmarks demand, and whether any closure is unconditional or
 * inherits the imp-486 GUE conditional.
 *
 * ASSESSMENT / SCOPING ONLY. Discharges NOTHING; changes no bound; tightens no
 * bound; establishes no operator positivity; no RH verdict, NO QED. R1t and the
 * imp-35243a certificate stay OPEN; R1s (imp-35414 lemma) is untouched. The
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643), the E_trunc = 3.06e-5 floor
 * (imp-2631) and imp-3066 K_a >= 0 are UNTOUCHED; C_mb GUE-conditional per imp-486
 * UNTOUCHED; far-tail exponent stays 1/2 (imp-3463). No refereed bound is changed.
 *
 * PART A -- THE SURROGATE MAP TO BE REPLACED (three inputs, three classes)
 * -----------------------------------------------------------------------------
 * The surrogate reentry band lives in the discrete iterate count
 *   n(seed) = ceil( xArg ),  xArg = [log(collapseDist(seed)) - log(EPS_FP)] / ln(1/r),
 * assembled from three inputs of DIFFERENT epistemic status, so a fidelity closure
 * has to treat them separately:
 *   (1) the SINGLE contraction rate r ~ 0.0454235 = |g prime (N_cross_fp)|, measured
 *       by finite difference AT the fixed point [imp-34775/imp-35109]. This is the R2
 *       target: imp-34862 showed the TRUE approach is a TWO-rate law (early-transient
 *       rate r_0 ~ 0.0403..0.0467 plus the asymptotic r), so the single-rate
 *       linearization is a MODELED input, NOT the certified true nonlinear map. This
 *       is the operative dynamical input R1t is about.
 *   (2) the HEIGHT MAP g = K log T0(N), K = (C_C/E_TRUNC)^2 with the RvM inverse
 *       T0(N) [imp-3220/imp-3406]. This is the R3 target: the truncation constants
 *       and the C_C = (1/8) sqrt(3 pi) ansatz are pinned near the ~3e12 anchor, NOT
 *       at 10^37, and this is where imp-486 enters (via the C_C-derived K).
 *   (3) the machine floor EPS_FP = 2.3e-16 [imp-34755/imp-34775]. This is the
 *       R1s-DISCHARGED input: imp-35414 proved the surrogate band recedes to
 *       seed -> +infinity as EPS_FP -> 0 (pointwise identically-zero residue). It is
 *       a surrogate artifact, NOT a true-dynamic blocker -- but it is exactly what
 *       makes the surrogate band, so R1t must replace the WHOLE floored count map,
 *       not just tune the floor.
 *
 * PART B -- WHICH TRUE DYNAMIC INPUT REPLACES THE SURROGATE (the operative swap)
 * -----------------------------------------------------------------------------
 * Closing R1t means replacing the modeled single-rate floored count map by the TRUE
 * collapse dynamic: a certified nonlinear approach map plus the true E_flow height at
 * N ~ 10^37, with an EXPLICIT residue statement (no terminal ceil band). Two routes:
 *   (i)  a RIGOROUS certified true-dynamic model -- a nonlinear-remainder bound (R2)
 *        uniform across the whole band plus a height-map fidelity certificate (R3) at
 *        10^37 -- does NOT currently exist (imp-35439: the minimal true-model
 *        requirements are unmet; imp-34862: the single rate is a two-rate model).
 *   (ii) a DATA-anchored fidelity check: measure the true dynamic directly from
 *        verified zeros at the band heights. CRUCIALLY -- and UNLIKE the imp-35475
 *        sigma landmarks, whose two heights both sit BELOW T_PT = 3e12 so a direct
 *        measurement is feasible -- the reentry band N-range [10^27.08, 10^37.17]
 *        lies ~14.6-24.7 decades ABOVE the ~3e12 verified frontier (imp-35243 D2), so
 *        NO verified datum exists within ~15 decades and route (ii) is INFEASIBLE.
 *        The data route that rescued the sigma side is CLOSED here: this is R4/D2.
 *
 * PART C -- RESIDUE ERROR CONTROL THE REENTRY-BAND LANDMARKS DEMAND
 * -----------------------------------------------------------------------------
 * The reentry band is a DISCRETE off-by-one (max abs error 1 iterate) in the terminal
 * ceil count, spanning ~10.08 decades from reentry 10^27.08 to exit 10^37.17. The
 * decisive imp-34862 EXACT-PEEL control showed the surviving off-by-one lives in the
 * TERMINAL ceil-vs-bit-collapse discretization, NOT in the early-transient rate -- so
 * a SECOND (true) rate cannot span the terminal-threshold gap; it only adds a second
 * fitted quantity. Therefore R1t does NOT need a better rate; it needs the TRUE
 * dynamic to carry NO terminal integer count at all -- the R1s structural mechanism
 * (a floor-free continuum approach whose count-to-exact-convergence is +infinity, so
 * no ceil, no off-by-one, no band) but ESTABLISHED FOR THE TRUE MAP. Concretely that
 * demands an R2 nonlinear-remainder bound holding UNIFORMLY across the full ~10.08
 * decade band together with R3 height fidelity at 10^37 -- an all-band certificate,
 * not a two-point spot check.
 *
 * PART D -- IS ANY CLOSURE UNCONDITIONAL? (GUE-CONDITIONAL AND DATA-UNREACHABLE)
 * -----------------------------------------------------------------------------
 * The height map rests on K = (C_C/E_TRUNC)^2 with the GUE-conditional C_C = (1/8)
 * sqrt(3 pi) ansatz, and the true collapse at these heights is governed by GUE
 * pair-correlation statistics (Montgomery/Odlyzko). Therefore:
 *   - route (i) (a certified/modeled true-dynamic asymptotic) INHERITS the imp-486 GUE
 *     conditional via the C_C-derived K -- it is NOT unconditional;
 *   - route (ii) (direct measurement at the band heights) would be unconditional in
 *     principle but is INFEASIBLE -- the band sits ~14.6-24.7 decades above the ~3e12
 *     verified frontier, so there is no datum to measure.
 * Net: R1t closure is STRICTLY WORSE OFF than the sigma case -- it is BOTH
 * GUE-conditional (route (i) via imp-486) AND data-unreachable (route (ii) via
 * R4/D2), whereas the sigma landmarks had a feasible unconditional route (ii). Either
 * way the closure discharges NO bound: the reentry band is a diagnostic of a
 * surrogate iterate-COUNT, not a Lambda lever, so even a perfect R1t closure leaves
 * Platt-Trudgian Lambda <= 0.2 unchanged. imp-35243a is a genuine but bounded,
 * non-bound-moving OPEN item whose data route is presently unreachable.
 *
 * The punchline: closing R1t means swapping the single-rate floored contraction map
 * (r ~ 0.0454235, floor EPS_FP = 2.3e-16) for the TRUE nonlinear collapse dynamic with
 * a certified nonlinear-remainder (R2, uniform over the ~10.08-decade band) and a
 * height-map fidelity certificate at 10^37 (R3); the residue control must target the
 * TERMINAL ceil (imp-34862: the off-by-one is terminal, not transient), not a second
 * rate; a modeled closure INHERITS imp-486 via the C_C-derived K, and -- unlike the
 * sigma landmarks -- the data route (ii) is UNREACHABLE because the band sits
 * ~14.6-24.7 decades above the ~3e12 verified frontier (R4/D2); and either way NO
 * bound moves. Assessment/scoping only; changes nothing; imp-35243a stays OPEN; NO QED.
 *
 * @see imp-35475-sigma-fidelity-closure-scope (the sigma-side scoping template this mirrors)
 * @see imp-35357-reentry-band-pure-artifact-proof-requirement (the R1s/R1t split scoped here)
 * @see imp-35414-r1s-zero-residue-surrogate-lemma (the R1s surrogate lemma R1t is isolated from)
 * @see imp-35472-r1s-baked-constants-reconstruction (verified the R1s baked numerical inputs)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (R1-R4; D2; imp-35243a certificate)
 * @see imp-34862-iters-to-floor-two-rate-law (two-rate law + exact-peel: the off-by-one is TERMINAL)
 * @see imp-35439-true-dynamic-model-minimal-requirements (the certified true-model requirements, unmet)
 * @see imp-486 (GUE-conditional caveat inherited by any C_C-derived height map)
 */

const R_CONTRACT = 0.0454235; // single contraction rate |g prime (N_cross_fp)| (imp-34775/imp-35109/imp-35357)
const LN_INV_R = 3.09173; // log(1/r), > 0 (imp-35357)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/imp-34775)
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // (1/8) sqrt(3 pi) ~ 0.38374752 (imp-2642/imp-2643 ansatz)
const E_TRUNC_PT = 3.06e-5; // fixed floor (imp-2631)
const K_AMPL = (C_C / E_TRUNC_PT) ** 2; // ~1.5727e8 height-map amplitude K = (C_C/E_TRUNC)^2 (imp-3220/imp-34775)
const T_PT = 3e12; // Platt-Trudgian 2021 verified height
const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any R1t closure)

// The reentry-band edges, log10 N (imp-34997/imp-35111/imp-35357), and its width.
const REENTRY_LOG10_N = 27.084691; // band-on reentry edge
const EXIT_LOG10_N = 37.167107; // band-off exit edge
const BAND_WIDTH_DECADES = EXIT_LOG10_N - REENTRY_LOG10_N; // ~10.08 decades

// D2 gap (imp-35243): the band N-range sits this many decades above the ~3e12 verified frontier.
const LOG10_TPT = Math.log10(T_PT); // ~12.477
const REENTRY_DECADES_ABOVE_TPT = REENTRY_LOG10_N - LOG10_TPT; // ~14.6
const EXIT_DECADES_ABOVE_TPT = EXIT_LOG10_N - LOG10_TPT; // ~24.7

export const IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE = {
  id: 'imp-35537',
  proofSection: 'S-frontier',
  question:
    'imp-35472/imp-35414 verified and formalized the R1s (surrogate) zero-residue lemma numerical inputs, but ' +
    'R1t -- the TRUE-dynamic residue half of the imp-35357 R1s/R1t split (certificate imp-35243a OPEN) -- stays ' +
    'OPEN and unscoped. Following the imp-35475 template, enumerate what closing R1t requires: which true dynamic ' +
    'input replaces the single-rate contraction-map surrogate (r ~ 0.0454235), what residue error control the ' +
    'reentry-band landmarks demand, and whether any closure is unconditional or inherits the imp-486 GUE ' +
    'conditional. Assessment/scoping only; imp-35243a stays OPEN; NO QED.',
  surrogateMapInputs: {
    contractionRate:
      'the SINGLE contraction rate r ~ 0.0454235 = |g prime (N_cross_fp)|, measured by finite difference AT the ' +
      'fixed point (imp-34775/imp-35109): the R2 target. imp-34862 showed the TRUE approach is a TWO-rate law ' +
      '(early-transient r_0 ~ 0.0403..0.0467 plus asymptotic r), so the single-rate linearization is a MODELED ' +
      'input, NOT the certified true nonlinear map. This is the operative dynamical input R1t is about.',
    heightMap:
      'the HEIGHT MAP g = K log T0(N), K = (C_C/E_TRUNC)^2 with the RvM inverse T0(N) (imp-3220/imp-3406): the R3 ' +
      'target. The truncation constants and the C_C = (1/8) sqrt(3 pi) ansatz are pinned near the ~3e12 anchor, ' +
      'NOT at 10^37; this is where imp-486 enters, via the C_C-derived K.',
    machineFloor:
      'the machine floor EPS_FP = 2.3e-16 (imp-34755/imp-34775): the R1s-DISCHARGED input. imp-35414 proved the ' +
      'surrogate band recedes to seed -> +infinity as EPS_FP -> 0 (pointwise identically-zero residue). It is a ' +
      'surrogate artifact, not a true-dynamic blocker -- but it is exactly what MANUFACTURES the band, so R1t ' +
      'must replace the WHOLE floored count map, not just tune the floor.',
    r_contract: R_CONTRACT, // ~0.0454235
    ln_inv_r: LN_INV_R, // ~3.09173
    eps_fp: EPS_FP, // 2.3e-16
    K_ampl: +K_AMPL.toExponential(4), // ~1.5727e8
    C_C: +C_C.toPrecision(8), // 0.38374752
  },
  operativeSwap: {
    replaceSurrogateBy:
      'the TRUE collapse dynamic: a certified nonlinear approach map plus the true E_flow height at N ~ 10^37, ' +
      'with an EXPLICIT residue statement (the true continuum count carries no terminal ceil band).',
    routeI:
      'a RIGOROUS certified true-dynamic model -- an R2 nonlinear-remainder bound uniform across the whole band ' +
      'plus an R3 height-map fidelity certificate at 10^37 -- does NOT currently exist (imp-35439 minimal ' +
      'true-model requirements unmet; imp-34862 the single rate is a two-rate model).',
    routeII:
      'a DATA-anchored fidelity check at the band heights. UNLIKE the imp-35475 sigma landmarks (both heights ' +
      'BELOW T_PT = 3e12, so measurable), the reentry band N-range [10^27.08, 10^37.17] lies ~14.6-24.7 decades ' +
      'ABOVE the ~3e12 verified frontier (imp-35243 D2), so NO verified datum exists within ~15 decades and ' +
      'route (ii) is INFEASIBLE -- the data route that rescued the sigma side is CLOSED (this is R4/D2).',
    reentry_log10_N: REENTRY_LOG10_N, // 27.084691
    exit_log10_N: EXIT_LOG10_N, // 37.167107
    reentryDecadesAboveT_PT: +REENTRY_DECADES_ABOVE_TPT.toPrecision(4), // ~14.6
    exitDecadesAboveT_PT: +EXIT_DECADES_ABOVE_TPT.toPrecision(4), // ~24.7
    bandHeightsAboveT_PT: true, // route (ii) INFEASIBLE (opposite of the sigma case)
  },
  landmarkResidueControl: {
    terminalNotTransient:
      'The reentry band is a DISCRETE off-by-one (max abs error 1 iterate) in the terminal ceil count. The ' +
      'imp-34862 EXACT-PEEL control showed the surviving off-by-one lives in the TERMINAL ceil-vs-bit-collapse ' +
      'discretization, NOT the early-transient rate, so a SECOND (true) rate cannot span the terminal-threshold ' +
      'gap. R1t does not need a better rate; it needs the TRUE dynamic to carry NO terminal integer count.',
    allBandNotTwoPoint:
      'The required residue control is the R1s structural mechanism (floor-free continuum count-to-exact-' +
      'convergence is +infinity, so no ceil, no off-by-one, no band) but ESTABLISHED FOR THE TRUE MAP: an R2 ' +
      'nonlinear-remainder bound holding UNIFORMLY across the full ~10.08-decade band plus R3 height fidelity at ' +
      '10^37 -- an all-band certificate, not a two-point spot check.',
    band_width_decades: +BAND_WIDTH_DECADES.toPrecision(4), // ~10.08
    max_off_by_one: 1, // the band is a single-iterate ceil discretization (imp-34862/imp-34845)
  },
  unconditionalOrGUE: {
    routeIInheritsImp486:
      'The height map rests on K = (C_C/E_TRUNC)^2 with the GUE-conditional C_C = (1/8) sqrt(3 pi) ansatz and the ' +
      'true collapse is governed by GUE pair-correlation statistics (Montgomery/Odlyzko), so a certified/modeled ' +
      'true-dynamic asymptotic (route (i)) INHERITS the imp-486 GUE conditional via the C_C-derived K -- NOT ' +
      'unconditional.',
    routeIIUnreachable:
      'Direct measurement at the band heights (route (ii)) would be unconditional in principle but is INFEASIBLE: ' +
      'the band sits ~14.6-24.7 decades above the ~3e12 verified frontier, so there is no datum to measure (R4/D2).',
    strictlyWorseThanSigma:
      'R1t closure is STRICTLY WORSE OFF than the imp-35475 sigma case -- it is BOTH GUE-conditional (route (i) ' +
      'via imp-486) AND data-unreachable (route (ii) via R4/D2), whereas the sigma landmarks had a feasible ' +
      'unconditional route (ii).',
    noBoundMoves:
      'The reentry band is a diagnostic of a surrogate iterate-COUNT, not a Lambda lever: even a PERFECT R1t ' +
      'closure leaves Platt-Trudgian Lambda <= 0.2 unchanged. imp-35243a is a genuine but bounded, ' +
      'non-bound-moving OPEN item whose data route is presently unreachable.',
    L_pt_unchanged: L_PT, // 0.2
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). Closing R1t (true-dynamic residue of the reentry ' +
    'band [10^27.08, 10^37.17]) means: (A) treating the three surrogate inputs by class -- the single rate ' +
    'r ~ 0.0454235 is the R2 target (imp-34862 found a two-rate law), the C_C-derived height map g = K log T0(N) ' +
    'is the R3 target (pinned near ~3e12, not 10^37, and where imp-486 enters), the machine floor EPS_FP is the ' +
    'R1s-discharged artifact; (B) swapping the modeled single-rate floored count map for the TRUE nonlinear ' +
    'collapse dynamic with a certified nonlinear-remainder (R2) and height fidelity at 10^37 (R3), via either a ' +
    'rigorous certified true-model (does not exist; imp-35439/imp-34862) or a data check at the band heights ' +
    '(INFEASIBLE -- the band sits ~14.6-24.7 decades above the ~3e12 frontier, so route (ii) is UNREACHABLE, ' +
    'unlike the imp-35475 sigma landmarks which both sat below T_PT); (C) controlling the residue at the TERMINAL ' +
    'ceil (imp-34862 exact-peel: the off-by-one is terminal, not transient, so a second rate cannot span it) ' +
    'uniformly across the full ~10.08-decade band, not at two points; (D) accepting that a modeled closure ' +
    'INHERITS the imp-486 GUE conditional via the C_C-derived K AND its data route is unreachable -- strictly ' +
    'worse than the sigma case, which had a feasible unconditional route (ii). Either way the reentry band is a ' +
    'diagnostic iterate-COUNT, not a Lambda lever, so NO bound moves. Discharges NOTHING; changes no bound; ' +
    'establishes no operator positivity; R1t and the imp-35243a certificate stay OPEN; R1s (imp-35414) is ' +
    'untouched; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631), imp-3066 K_a >= 0 and ' +
    'C_mb GUE-conditional (imp-486) are UNTOUCHED; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  residual_sub_gap:
    'imp-35243a stays OPEN: certify surrogate-vs-true-dynamics fidelity for the reentry band by discharging R1t ' +
    '(true dynamic has no band) -- which needs R2 (a certified nonlinear-remainder uniform over the ~10.08-decade ' +
    'band; imp-34862 two-rate law), R3 (height-map fidelity at 10^37) and R4 (independent-model / verified-height ' +
    'agreement, presently UNREACHABLE at ~14.6-24.7 decades above ~3e12). R1s (imp-35414) does not close R1t.',
  citation:
    'imp-35475 (sigma-side scoping template mirrored here); imp-35357 (R1s/R1t split); imp-35414 (R1s surrogate ' +
    'lemma); imp-35472 (verified R1s baked inputs); imp-35243 (R1-R4, D2, imp-35243a certificate); imp-34862 ' +
    '(two-rate law + exact-peel: the off-by-one is TERMINAL); imp-35439 (certified true-model requirements, ' +
    'unmet); imp-2642/imp-2643 (C_C = (1/8) sqrt(3 pi) ansatz); imp-2631 (E_trunc floor); imp-486 (GUE-conditional ' +
    'caveat inherited by the C_C-derived K); Platt-Trudgian 2021 (T_PT = 3e12); Montgomery/Odlyzko (GUE ' +
    'pair-correlation).',
};

export const IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE_ASSERTIONS = [
  {
    // Part A/B: the reentry band sits ABOVE T_PT = 3e12 (opposite of the sigma landmarks), so route (ii) is INFEASIBLE.
    id: 'imp35537-band-heights-above-tpt-route-ii-infeasible',
    description: 'the reentry band [10^27.08, 10^37.17] sits ~14.6-24.7 decades ABOVE T_PT = 3e12, so the data route (ii) is infeasible',
    holds: () =>
      IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE.operativeSwap.bandHeightsAboveT_PT === true &&
      REENTRY_LOG10_N > LOG10_TPT &&
      REENTRY_DECADES_ABOVE_TPT > 14 && REENTRY_DECADES_ABOVE_TPT < 15 &&
      EXIT_DECADES_ABOVE_TPT > 24 && EXIT_DECADES_ABOVE_TPT < 25 &&
      Math.abs(C_C - 0.38374752) < 1e-6, // C_C = (1/8) sqrt(3 pi) reproduces the ansatz constant
  },
  {
    // Part C: the band is a single-iterate TERMINAL off-by-one spanning ~10.08 decades; residue control is all-band.
    id: 'imp35537-terminal-off-by-one-all-band',
    description: 'the band is a single-iterate terminal off-by-one spanning ~10.08 decades; R1t needs an all-band residue certificate not a two-point check',
    holds: () =>
      IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE.landmarkResidueControl.max_off_by_one === 1 &&
      BAND_WIDTH_DECADES > 10 && BAND_WIDTH_DECADES < 10.2 &&
      R_CONTRACT > 0 && R_CONTRACT < 1 && LN_INV_R > 0 && // surrogate is a genuine contraction
      /TERMINAL/.test(IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE.landmarkResidueControl.terminalNotTransient),
  },
  {
    // Part D honesty gate: modeled closure inherits imp-486 AND is data-unreachable, no bound moves, imp-35243a OPEN, NO QED.
    id: 'imp35537-inherits-imp486-data-unreachable-no-bound-moves-no-qed',
    description: 'R1t closure is BOTH GUE-conditional (imp-486) AND data-unreachable, sigma is not a lever so no bound moves, imp-35243a OPEN, no refereed bound is changed, NO QED',
    holds: () =>
      Math.abs(L_PT - 0.2) < 1e-15 &&
      IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE.isRigorous === false &&
      /imp-486/.test(IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE.verdict) &&
      /NO bound moves/.test(IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE.verdict) &&
      /imp-35243a/.test(IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE.residual_sub_gap) &&
      /R1t and the imp-35243a certificate stay OPEN/.test(IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE.verdict) &&
      /NO QED/.test(IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE.verdict),
  },
];

for (const a of IMP35537_R1T_REENTRY_BAND_CLOSURE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35537-r1t-reentry-band-closure-scope assertion failed: ${a.id}`);
  }
}
