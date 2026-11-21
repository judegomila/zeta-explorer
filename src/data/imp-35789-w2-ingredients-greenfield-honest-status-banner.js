/**
 * @module imp-35789-w2-ingredients-greenfield-honest-status-banner
 *
 * imp-35789 (content, S-frontier): imp-35727 enumerates the imp-35681 Part B
 * graded W2 gap -- a certified argument-principle winding zero count on the
 * boundary of the transition rectangle R = [T_PT, T_PT + Delta] x [-h, h] --
 * and finds it needs FIVE ingredients (I1-I5), ALL GREENFIELD, that the held
 * winding scaffolding (imp-2696 winding-Lyapunov, imp-33923 off-axis
 * phase-winding quadrature, imp-33968 winding-rate-vs-alpha) supplies none of.
 * That five-for-five greenfield verdict has no dedicated honest-status banner
 * of its own. This module IS that banner: a standalone, prominent,
 * self-asserting companion stating the verdict without the surrounding
 * derivation, so a reader who lands only on this module gets the correction
 * first.
 *
 * DOCUMENTATION ONLY. Ports nothing; certifies nothing; counts no zeros;
 * changes no bound; adds no new claim beyond imp-35727; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * THE BANNER (restated from imp-35727; no new derivation)
 * -----------------------------------------------------------------------------
 *   "The repo holds winding scaffolding" IS NOT "the repo holds a certified
 *   winding count." The held imp-2696 / imp-33923 / imp-33968 modules are all
 *   isRigorous:false point-sampled double-precision MEASUREMENTS that unwrap a
 *   sampled phase and read a slope/count -- qualitative scaffolding only. They
 *   reduce NONE of the five ingredients a rigorous, interval-arithmetic
 *   CERTIFIED count on dR requires:
 *     I1  between-node interval ENCLOSURE of H_t = A + B - C along each edge
 *     I2  a certified per-panel argument-increment cap |Delta arg f| < pi
 *     I3  a modulus floor |f| >= delta > 0 certifying f != 0 on dR
 *     I4  closure of the accumulated increment to a UNIQUE integer
 *     I5  continuous corner composition around the closed loop
 *   All five are GREENFIELD. Held scaffolding count reduced: ZERO of five.
 *
 * The punchline: read "winding scaffolding exists" as concept-plus-experiment
 * held, NOT as certified-count progress. No bound changes; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (source: I1-I5 ledger, all GREENFIELD)
 * @see imp-2696 (winding-Lyapunov, arg H_tau sampled, isRigorous:false, held)
 * @see imp-33923 (off-axis phase-winding quadrature, model cusp, isRigorous:false, held)
 * @see imp-33968 (winding-rate-vs-alpha least-squares slope, isRigorous:false, held)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (Part B graded W2 verdict this banner restates)
 */

const L_PT = 0.2; // Platt-Trudgian 2021 bound -- unchanged by this banner
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const INGREDIENT_COUNT = 5;
const GREENFIELD_COUNT = 5;
const HELD_SCAFFOLDING_REDUCTION_COUNT = 0; // how many of the 5 ingredients the held scaffolding discharges

export const IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER = {
  id: 'imp-35789',
  proofSection: 'S-frontier',
  bannerLevel: 'PROMINENT',
  headline: 'HELD WINDING SCAFFOLDING (imp-2696/imp-33923/imp-33968) REDUCES NONE OF THE FIVE W2 GREENFIELD INGREDIENTS',
  statements: {
    S1_scaffolding_is_not_a_count: {
      claim:
        'The repo holds the winding CONCEPT and qualitative experimental code (imp-2696, imp-33923, imp-33968), ' +
        'but every one of them is an isRigorous:false point-sampled double-precision MEASUREMENT that unwraps a ' +
        'sampled phase and reads a slope/count. Holding this scaffolding is NOT the same as holding a certified ' +
        'winding count on the transition-rectangle boundary dR.',
    },
    S2_five_ingredients_all_greenfield: {
      claim:
        'A rigorous, interval-arithmetic-CERTIFIED count needs FIVE ingredients per imp-35727: (I1) between-node ' +
        'interval enclosure of H_t = A + B - C along each edge, (I2) a certified per-panel argument-increment cap ' +
        '|Delta arg f| < pi, (I3) a modulus floor |f| >= delta > 0 on dR, (I4) closure of the accumulated ' +
        'increment to a UNIQUE integer, (I5) continuous corner composition around the closed loop. ALL FIVE are ' +
        'GREENFIELD.',
      ingredientCount: INGREDIENT_COUNT,
      greenfieldIngredientCount: GREENFIELD_COUNT,
    },
    S3_held_scaffolding_reduces_none: {
      claim:
        'The held imp-2696/imp-33923/imp-33968 scaffolding reduces ZERO of the five greenfield ingredients: none ' +
        'brackets the phase between samples (I1), none certifies a per-panel argument cap (I2), none ' +
        'lower-bounds |f| off zero on a contour (I3), none closes the read to a certified integer (I4), and none ' +
        'traverses a closed rectangle to test corner composition (I5).',
      heldScaffoldingReductionCount: HELD_SCAFFOLDING_REDUCTION_COUNT,
    },
  },
  isRigorous: false,
  verdict:
    'HONEST-STATUS BANNER (documentation, NOT a new claim). Restates imp-35727 prominently so "the repo holds ' +
    'winding scaffolding" is never mistaken for "the repo holds a certified winding count": all five ingredients ' +
    '(I1-I5) a rigorous interval-arithmetic count on the transition-rectangle boundary requires are GREENFIELD, ' +
    'and the held imp-2696/imp-33923/imp-33968 experimental scaffolding reduces ZERO of them. Ports nothing; ' +
    'certifies nothing; counts no zeros; changes no bound; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35727 (source: I1-I5 certified-count ingredient ledger, all GREENFIELD); imp-2696/imp-33923/imp-33968 ' +
    '(held isRigorous:false winding scaffolding); imp-35681 Part B (graded W2 verdict this banner restates).',
};

export const IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER_ASSERTIONS = [
  {
    // The banner must be flagged prominent and carry the reduces-none headline verbatim.
    id: 'imp35789-banner-is-prominent',
    description: 'Banner is flagged PROMINENT with a headline stating the scaffolding reduces none of the ingredients',
    holds: () =>
      IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER.bannerLevel === 'PROMINENT' &&
      /REDUCES NONE OF THE FIVE/.test(IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER.headline),
  },
  {
    // S1: scaffolding-is-not-a-count statement names all three held modules as isRigorous:false.
    id: 'imp35789-scaffolding-not-a-count',
    description: 'S1 states the held scaffolding is isRigorous:false and not a certified count',
    holds: () =>
      /isRigorous:false/.test(IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER.statements.S1_scaffolding_is_not_a_count.claim) &&
      /NOT the same as holding a certified/.test(
        IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER.statements.S1_scaffolding_is_not_a_count.claim,
      ),
  },
  {
    // S2: five ingredients, all greenfield, counts match the imp-35727 ledger.
    id: 'imp35789-five-greenfield-ingredients',
    description: 'S2 states five ingredients (I1-I5), all GREENFIELD, matching imp-35727',
    holds: () => {
      const s2 = IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER.statements.S2_five_ingredients_all_greenfield;
      return (
        s2.ingredientCount === 5 &&
        s2.greenfieldIngredientCount === 5 &&
        /ALL FIVE are/.test(s2.claim) &&
        /GREENFIELD/.test(s2.claim)
      );
    },
  },
  {
    // S3: held scaffolding reduces exactly zero of the five ingredients.
    id: 'imp35789-held-scaffolding-reduces-zero',
    description: 'S3 states the held scaffolding reduces ZERO of the five ingredients',
    holds: () =>
      IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER.statements.S3_held_scaffolding_reduces_none
        .heldScaffoldingReductionCount === 0 &&
      /ZERO of the five/.test(
        IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER.statements.S3_held_scaffolding_reduces_none.claim,
      ),
  },
  {
    // Honesty gate: documentation only, no QED, PT stays SOTA at Lambda <= 0.2, T_PT = 3e12.
    id: 'imp35789-honesty-gate-no-qed',
    description: 'Documentation only: no new claim, no QED, no refereed bound is changed',
    holds: () =>
      IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      T_PT === 3e12 &&
      /HONEST-STATUS BANNER/.test(IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER.verdict) &&
      /NOT a new claim/.test(IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER.verdict) &&
      /NO QED/.test(IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER.verdict) &&
      /refereed bound is changed/i.test(IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER.verdict),
  },
];

for (const a of IMP35789_W2_INGREDIENTS_GREENFIELD_HONEST_STATUS_BANNER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35789-w2-ingredients-greenfield-honest-status-banner assertion failed: ${a.id}`);
  }
}
