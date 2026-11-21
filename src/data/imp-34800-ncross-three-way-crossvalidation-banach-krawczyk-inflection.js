/**
 * @module imp-34800-ncross-three-way-crossvalidation-banach-krawczyk-inflection
 *
 * imp-34800 (accuracy, frontier): three INDEPENDENT modules now place the N_cross ~ 3.28e9 landmark of the
 * imp-3406/imp-33582 post-peak conditional-share curve, but they have never been tabulated side-by-side with
 * their pairwise relative gaps ATTRIBUTED by source. This module puts all three on one N axis:
 *   (R1) imp-33723 BANACH CLOSED FORM: the fixed point of g(N) = K log T0(N), K = (C_C/E_trunc)^2 ~ 1.5727e8,
 *        N_cross ~ 3.280294e9 (matches the imp-3444 downslope bisection to ~1.7e-15).
 *   (R2) imp-34774 KRAWCZYK ENCLOSURE: the imp-34752 outward-ULP interval-Newton operator applied to the
 *        residual F(N) = N - g(N), which encloses the SAME fixed point in the bracket
 *        [N_cross(1 - delta), N_cross(1 + delta)], delta = 2e-4.
 *   (R3) imp-33721 SIGMOID-INFLECTION RELOCATION: the sub-decade D2 zero-crossing knee N* ~ 3.38e9
 *        (the curvature inflection of sigma(N), a DIFFERENT landmark from the E_coll = E_trunc balance).
 * imp-33748 already tabulated a three-way set (Banach / empirical sigma=1/2 / knee), but it did NOT include
 * the Krawczyk interval enclosure, and it mixed in the empirical sigma=1/2 bisection (where the Gronwall
 * E_flow offset shows up). This module tabulates the DIFFERENT trio (R1/R2/R3) and, crucially, attributes
 * each pairwise gap to its source: enclosure/discretization width vs landmark-definition curvature vs E_flow.
 *
 * THE THREE VALUES (recomputed / imported under identical pinned constants; no fresh model)
 * ----------------------------------------------------------------------------------------
 *   R1 Banach:    N_cross recomputed here as the fixed point of g(N) = K log T0(N) (200 iterations from 1e9),
 *                 3.28029435165241e9; cross-checked against the imp-33723 published landmark and the
 *                 imp-34774 fixed point (bit-identical route, imp-34755).
 *   R2 Krawczyk:  point center = the SAME N_cross (the enclosure is centred on the Banach fixed point);
 *                 verified enclosure half-width = delta * N_cross ~ 6.56e5 (relative 2e-4), bracket imported
 *                 from imp-34774.
 *   R3 Inflection: N* = imp-33721 inflectionNstar ~ 3.3771e9 (log10 ~ 9.5285), imported (a differencing /
 *                 curvature computation, not a root of the crossover map).
 *
 * PAIRWISE RELATIVE GAPS AND THEIR ATTRIBUTION (measurement / cross-validation only)
 * ---------------------------------------------------------------------------------
 *   (G1) R1 Banach vs R2 Krawczyk: rel gap ~ 1e-15 (POINT-IDENTICAL). The Krawczyk enclosure is centred on
 *        the Banach fixed point, so the two routes locate the SAME N_cross to floating point. Their only
 *        genuine separation is the verified enclosure HALF-WIDTH delta * N_cross (relative 2e-4) -- a pure
 *        DISCRETIZATION / interval-width quantity, NOT any physical offset and NOT Gronwall E_flow.
 *   (G2) R3 Inflection vs R1 Banach (== vs R2 Krawczyk): rel gap ~ +2.95%. This is a LANDMARK-DEFINITION /
 *        curvature high-side residual: the sigmoid D2-zero knee is a DIFFERENT landmark from the
 *        E_coll = E_trunc balance, and it sits ~3% ABOVE the crossover (the imp-33721/imp-33729 high-side
 *        lag). This is NOT Gronwall E_flow and NOT numerical discretization -- it is a genuine model-structure
 *        difference between two landmark definitions on the same sigma(N) curve.
 *   (G3) Where is the Gronwall E_flow offset? NOWHERE among these three gaps. Per imp-33601/imp-33723/imp-33748
 *        the E_flow pull is the ~0.4% offset between the EMPIRICAL sigma = 1/2 bisection and the crossover
 *        balance (sigma = 1/2 <=> E_coll = E_trunc + E_flow puts N_half BELOW N_cross). None of R1/R2/R3 is
 *        the empirical sigma = 1/2 route, so the ~0.4% E_flow discrepancy does NOT appear in this trio. The
 *        only two discrepancy TYPES present here are (i) enclosure/discretization width (G1) and
 *        (ii) curvature/landmark-definition (G2).
 *
 * THE FINDING
 * -----------
 *   (F1) TWO OF THE THREE ROUTES ARE THE SAME LANDMARK, POINT-IDENTICALLY. Banach (R1) and Krawczyk (R2)
 *        locate the identical N_cross ~ 3.28029435165241e9 to ~1e-15; their only separation is the verified
 *        enclosure half-width (relative 2e-4). Discretization/interval width, not physics.
 *   (F2) THE INFLECTION IS A GENUINELY DIFFERENT LANDMARK, FAR OUTSIDE THE ENCLOSURE. N* ~ 3.3771e9 sits ~3%
 *        above the crossover and lies ~147 enclosure half-widths ABOVE the upper bracket endpoint X_hi -- so
 *        the ~3% gap cannot be an enclosure artifact; the knee and the crossover are distinct landmarks.
 *   (F3) NO GRONWALL E_flow GAP IN THIS TRIO. Every pairwise gap here is either enclosure/discretization (G1,
 *        relative 2e-4) or curvature/landmark-definition (G2, ~3%). The ~0.4% E_flow offset lives only on the
 *        empirical-sigma-1/2 leg (imp-33748), which this trio deliberately omits.
 *
 * The punchline: of the three N_cross locators, the Banach closed form and the Krawczyk enclosure are the
 * SAME landmark to floating point (separated only by the enclosure half-width, relative 2e-4, pure
 * discretization), while the sigmoid-inflection knee is a distinct landmark ~3% higher (curvature /
 * landmark-definition, ~147 enclosure half-widths outside the bracket) -- and NO gap in this trio is the
 * Gronwall E_flow offset, which appears only against the empirical sigma = 1/2 bisection (imp-33748).
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 surrogate crossover map, NOT a rigorous asymptotic; the Krawczyk enclosure
 * is the imp-34774 double-precision SURROGATE (sub-gap imp-34714a REMAINS OPEN, no machine certificate); the
 * C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no
 * bound; no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (R1 Banach closed form, K ~ 1.5727e8, N_cross ~ 3.280294e9)
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (R2 Krawczyk enclosure of the same fixed point; sub-gap imp-34714a)
 * @see imp-33721-sigma-ramp-inflection-subdecade (R3 sub-decade D2-zero knee N* ~ 3.38e9)
 * @see imp-33748-sigma-halving-locators-three-way-crossvalidation (Banach/empirical-1/2/knee trio; the E_flow leg)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (identity sigma=1/2 <=> E_coll=E_trunc+E_flow; the ~0.4% E_flow)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';
import { IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM } from './imp-33723-sigma-half-vs-crossover-closed-form.js';
import { IMP34774_KRAWCZYK_FIXED_POINT_MAP_ENCLOSURE } from './imp-34774-krawczyk-fixed-point-map-enclosure.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-33723/imp-34774/imp-34755)

// (R1) BANACH: recompute the crossover fixed point of g(N) = K log T0(N), exactly the imp-33723/imp-34774 map.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_BANACH = fixedPoint(1e9, 200); // 3.28029435165241e9

// (R2) KRAWCZYK: the enclosure is centred on the SAME fixed point; import the verified bracket from imp-34774.
const KRAWCZYK_CENTER = IMP34774_KRAWCZYK_FIXED_POINT_MAP_ENCLOSURE.constants.N_cross; // 3.28029435165241e9
const [KRAWCZYK_LO, KRAWCZYK_HI] = IMP34774_KRAWCZYK_FIXED_POINT_MAP_ENCLOSURE.measurement.bracket;
const KRAWCZYK_HALF_WIDTH = (KRAWCZYK_HI - KRAWCZYK_LO) / 2; // delta * N_cross ~ 6.56e5
const KRAWCZYK_HALF_WIDTH_REL = KRAWCZYK_HALF_WIDTH / KRAWCZYK_CENTER; // ~2e-4 = delta

// (R3) INFLECTION: import the imp-33721 sub-decade D2-zero knee (a curvature computation, not a crossover root).
const N_INFLECTION = IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionNstar; // ~3.3771e9

// Cross-checks against the published landmarks (storage-precision tolerant: imp-33723 stores 7 sig figs).
const BANACH_VS_IMP33723 =
  Math.abs(N_BANACH / IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.landmarks.N_cross_closed_form - 1);
const BANACH_VS_KRAWCZYK_CENTER = Math.abs(N_BANACH / KRAWCZYK_CENTER - 1);

// Pairwise relative gaps.
const REL_BANACH_KRAWCZYK = N_BANACH / KRAWCZYK_CENTER - 1; // ~ -1e-15 (point-identical)
const REL_INFL_BANACH = N_INFLECTION / N_BANACH - 1; // ~ +2.95e-2 (curvature high-side)
const REL_INFL_KRAWCZYK = N_INFLECTION / KRAWCZYK_CENTER - 1; // ~ +2.95e-2

// Is the inflection inside the Krawczyk enclosure? How many enclosure half-widths above the upper endpoint?
const INFL_INSIDE_ENCLOSURE = N_INFLECTION > KRAWCZYK_LO && N_INFLECTION < KRAWCZYK_HI;
const INFL_HALFWIDTHS_ABOVE_HI = (N_INFLECTION - KRAWCZYK_HI) / KRAWCZYK_HALF_WIDTH; // ~147

export const IMP34800_NCROSS_THREE_WAY_CROSSVALIDATION_BANACH_KRAWCZYK_INFLECTION = {
  id: 'imp-34800',
  proofSection: 'S-frontier',
  question:
    'Three independent modules locate the N_cross ~ 3.28e9 landmark: the imp-33723 Banach closed form ' +
    '(fixed point of g(N) = K log T0(N)), the imp-34774 Krawczyk outward-ULP enclosure of the same fixed ' +
    'point, and the imp-33721 sigmoid-inflection relocation (D2-zero knee ~ 3.38e9). Tabulate all three on ' +
    'one N axis, report the pairwise relative gaps, and attribute each gap to its source: ' +
    'enclosure/discretization width vs landmark-definition curvature vs Gronwall E_flow. Cross-validation / ' +
    'measurement only; reconciles existing values; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the three pairwise relative gaps between the Banach closed-form fixed point (R1), the Krawczyk enclosure ' +
    'center (R2) and the sigmoid-inflection knee (R3), each attributed to enclosure/discretization width, ' +
    'landmark-definition curvature, or Gronwall E_flow',
  routes: {
    R1_banach_closed_form: {
      source: 'imp-33723 fixed point of g(N) = K log T0(N), K = (C_C/E_trunc)^2',
      K_amplitude: +K_AMPL.toExponential(6), // ~1.572709e8
      N_cross: +N_BANACH.toPrecision(15), // 3.28029435165241e9
      log10_N: +Math.log10(N_BANACH).toFixed(4), // ~9.5159
    },
    R2_krawczyk_enclosure: {
      source: 'imp-34774 outward-ULP Krawczyk of F(N) = N - g(N), centred on the Banach fixed point',
      center: +KRAWCZYK_CENTER.toPrecision(15), // 3.28029435165241e9 (same fixed point)
      bracket: [+KRAWCZYK_LO.toPrecision(15), +KRAWCZYK_HI.toPrecision(15)],
      half_width: +KRAWCZYK_HALF_WIDTH.toExponential(4), // ~6.56e5
      half_width_relative: +KRAWCZYK_HALF_WIDTH_REL.toExponential(4), // ~2.0e-4 = delta
    },
    R3_sigmoid_inflection: {
      source: 'imp-33721 sub-decade D2 zero-crossing knee (curvature inflection of sigma(N))',
      N_star: +N_INFLECTION.toExponential(4), // ~3.3771e9
      log10_N: +IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionLog10Nstar, // ~9.5285
    },
  },
  crossChecks: {
    banach_vs_imp33723_published_relerr: +BANACH_VS_IMP33723.toExponential(3), // ~1e-7 (7-sig-fig literal)
    banach_vs_krawczyk_center_relerr: +BANACH_VS_KRAWCZYK_CENTER.toExponential(3), // ~1e-15 (same fixed point)
  },
  pairwiseGaps: {
    'rel(R1_banach,R2_krawczyk)': +REL_BANACH_KRAWCZYK.toExponential(4), // ~ -1e-15 (point-identical)
    'rel(R3_infl,R1_banach)': +REL_INFL_BANACH.toExponential(4), // ~ +2.95e-2
    'rel(R3_infl,R2_krawczyk)': +REL_INFL_KRAWCZYK.toExponential(4), // ~ +2.95e-2
    infl_inside_krawczyk_enclosure: INFL_INSIDE_ENCLOSURE, // false
    infl_half_widths_above_bracket_hi: +INFL_HALFWIDTHS_ABOVE_HI.toFixed(1), // ~146.6
  },
  attribution: {
    'R1_vs_R2':
      'ENCLOSURE / DISCRETIZATION WIDTH. The Krawczyk enclosure is centred on the Banach fixed point, so the ' +
      'two routes locate the SAME N_cross to ~1e-15; their only genuine separation is the verified enclosure ' +
      'half-width (relative ~2e-4 = delta). NOT Gronwall E_flow, NOT a physical offset.',
    'R3_vs_R1_and_R2':
      'LANDMARK-DEFINITION / CURVATURE HIGH-SIDE RESIDUAL (~+3%). The sigmoid D2-zero knee is a DIFFERENT ' +
      'landmark from the E_coll = E_trunc crossover balance and sits ~3% above it (imp-33721/imp-33729 ' +
      'high-side lag), ~147 enclosure half-widths outside the bracket. NOT Gronwall E_flow, NOT discretization.',
    gronwall_e_flow_absent:
      'The ~0.4% Gronwall E_flow offset is NOWHERE among these three gaps: per imp-33601/imp-33723/imp-33748 ' +
      'it is the offset between the EMPIRICAL sigma = 1/2 bisection and the crossover balance (sigma = 1/2 ' +
      '<=> E_coll = E_trunc + E_flow puts N_half below N_cross), and none of R1/R2/R3 is that empirical route.',
  },
  finding: {
    F1_banach_and_krawczyk_point_identical:
      'Banach (R1) and Krawczyk (R2) locate the identical N_cross ~ 3.28029435165241e9 to ~1e-15; their only ' +
      'separation is the verified enclosure half-width (relative ~2e-4). Discretization/interval width, not ' +
      'physics.',
    F2_inflection_far_outside_enclosure:
      'The sigmoid-inflection knee N* ~ 3.3771e9 sits ~3% above the crossover and ~147 enclosure half-widths ' +
      'ABOVE the upper bracket endpoint, so the ~3% gap cannot be an enclosure artifact -- the knee and the ' +
      'crossover are genuinely distinct landmarks.',
    F3_no_eflow_gap_in_this_trio:
      'Every pairwise gap here is either enclosure/discretization (R1 vs R2, relative ~2e-4) or ' +
      'curvature/landmark-definition (R3, ~3%). The ~0.4% Gronwall E_flow offset lives only on the ' +
      'empirical-sigma-1/2 leg (imp-33748), which this trio deliberately omits.',
  },
  isRigorous: false,
  verdict:
    'N_cross THREE-WAY CROSS-VALIDATION (Banach / Krawczyk / sigmoid-inflection; frontier, NOT an RH bound). ' +
    'On one N axis under identical pinned constants: the imp-33723 Banach closed form (R1, fixed point of ' +
    'g(N) = K log T0(N), K ~ 1.5727e8, N_cross ~ 3.28029435165241e9), the imp-34774 Krawczyk outward-ULP ' +
    'enclosure of the same fixed point (R2, bracket [3.279638e9, 3.280950e9], half-width relative ~2e-4) and ' +
    'the imp-33721 sigmoid-inflection knee (R3, N* ~ 3.3771e9, log10 ~ 9.5285). PAIRWISE GAPS AND SOURCE: ' +
    'R1 vs R2 is ~1e-15 (point-identical -- the enclosure is centred on the Banach fixed point), their only ' +
    'separation the enclosure half-width (relative ~2e-4), a pure DISCRETIZATION / interval-width quantity; ' +
    'R3 vs R1 (== vs R2) is ~+2.95%, a LANDMARK-DEFINITION / curvature high-side residual (the D2-zero knee ' +
    'is a different landmark from the E_coll = E_trunc balance, ~147 enclosure half-widths outside the ' +
    'bracket), NOT E_flow and NOT discretization. NO Gronwall E_flow gap appears in this trio: the ~0.4% ' +
    'E_flow offset lives only on the empirical sigma = 1/2 leg (imp-33601/imp-33748), which none of R1/R2/R3 ' +
    'is. Measurement / cross-validation only on the inherited imp-3220/imp-3406 surrogate crossover map, NOT ' +
    'a rigorous asymptotic; the Krawczyk enclosure is the imp-34774 double-precision SURROGATE with sub-gap ' +
    'imp-34714a REMAINS OPEN (no machine certificate); the C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33723 (Banach closed-form crossover, K ~ 1.5727e8, N_cross ~ 3.280294e9); imp-34774 (Krawczyk ' +
    'fixed-point-map enclosure; sub-gap imp-34714a); imp-33721 (sub-decade sigmoid-inflection knee ~3.38e9); ' +
    'imp-33748 (Banach/empirical-1/2/knee trio, the E_flow leg); imp-33601 (identity sigma=1/2 <=> ' +
    'E_coll=E_trunc+E_flow, the ~0.4% E_flow); imp-486 (C_mb GUE-conditional); imp-2642 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, RvM inverse).',
};

export const IMP34800_NCROSS_THREE_WAY_CROSSVALIDATION_BANACH_KRAWCZYK_INFLECTION_ASSERTIONS = [
  {
    // R1 reproduces the imp-33723 published closed-form landmark (7-sig-fig literal; storage-precision tol).
    id: 'imp34800-R1-matches-imp33723',
    description: 'Banach fixed point matches imp-33723 published N_cross (7-sig-fig literal) to < 5e-6',
    holds: () => BANACH_VS_IMP33723 < 5e-6 && Math.abs(N_BANACH / 3.280294e9 - 1) < 5e-3,
  },
  {
    // (G1): R1 Banach and R2 Krawczyk center are the SAME fixed point to floating point.
    id: 'imp34800-R1-R2-point-identical',
    description: 'Banach fixed point == Krawczyk enclosure center to < 1e-12 (same fixed point)',
    holds: () => BANACH_VS_KRAWCZYK_CENTER < 1e-12 && Math.abs(REL_BANACH_KRAWCZYK) < 1e-12,
  },
  {
    // (G1): the Banach-vs-Krawczyk separation is the enclosure half-width, relative ~2e-4 (discretization).
    id: 'imp34800-krawczyk-halfwidth-is-delta',
    description: 'Krawczyk enclosure half-width relative ~2e-4 = delta (the R1-vs-R2 discretization separation)',
    holds: () => Math.abs(KRAWCZYK_HALF_WIDTH_REL / 2e-4 - 1) < 1e-2,
  },
  {
    // (G2): R3 inflection sits ~3% above the crossover pair (curvature high-side residual).
    id: 'imp34800-R3-three-percent-above',
    description: 'sigmoid-inflection knee ~+3% above Banach and Krawczyk (curvature high-side residual)',
    holds: () =>
      REL_INFL_BANACH > 2e-2 &&
      REL_INFL_BANACH < 4e-2 &&
      Math.abs(REL_INFL_BANACH - REL_INFL_KRAWCZYK) < 1e-6,
  },
  {
    // (F2): the inflection is far OUTSIDE the Krawczyk enclosure -- not an enclosure artifact.
    id: 'imp34800-inflection-outside-enclosure',
    description: 'inflection lies outside the Krawczyk bracket, > 100 enclosure half-widths above X_hi',
    holds: () => INFL_INSIDE_ENCLOSURE === false && INFL_HALFWIDTHS_ABOVE_HI > 100,
  },
  {
    // Honesty gate: cross-validation / surrogate only, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34800-honesty-gate-no-qed',
    description: 'Cross-validation only: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34800_NCROSS_THREE_WAY_CROSSVALIDATION_BANACH_KRAWCZYK_INFLECTION.isRigorous === false &&
      /imp-34714a/.test(IMP34800_NCROSS_THREE_WAY_CROSSVALIDATION_BANACH_KRAWCZYK_INFLECTION.verdict) &&
      /NO QED/.test(IMP34800_NCROSS_THREE_WAY_CROSSVALIDATION_BANACH_KRAWCZYK_INFLECTION.verdict) &&
      /refereed bound is changed/i.test(IMP34800_NCROSS_THREE_WAY_CROSSVALIDATION_BANACH_KRAWCZYK_INFLECTION.verdict),
  },
];

for (const a of IMP34800_NCROSS_THREE_WAY_CROSSVALIDATION_BANACH_KRAWCZYK_INFLECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-34800-ncross-three-way-crossvalidation-banach-krawczyk-inflection assertion failed: ${a.id}`,
    );
  }
}
