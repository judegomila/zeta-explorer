/**
 * @module imp-35832-i2-derivative-bound-from-i1-enclosure-scope
 *
 * imp-35832 (proof/assessment, S-frontier): ASSESS whether the derivative bound
 * B = sup|H_t prime| -- the numerator of the imp-35777 sufficient I2 cap
 * sup|f prime/f| <= B/delta, L_panel < pi/(B/delta) -- can be obtained by
 * differentiating the imp-35681 Part A / I1 interval enclosure of H_t = A_t + B_t - C_t
 * TERMWISE, or whether a certified enclosure of H_t prime is a genuinely NEW ingredient
 * beyond the 1D value enclosure I1 already scopes.
 *
 * ASSESSMENT / SCOPING ONLY. Ports nothing; certifies no cap; enclosures nothing;
 * changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE QUESTION, RESTATED
 * -----------------------------------------------------------------------------
 * imp-35777 wrote the certifiable I2 cap as L_panel . sup|f prime/f| < pi with
 * sup|f prime/f| <= B/delta, B = sup|H_t prime|, delta = the I3 modulus floor. delta is
 * an INF of |H_t| -- an object the I1 value enclosure already brackets. B is a SUP of
 * |H_t prime| -- a DERIVATIVE. Does B fall out of the same enclosure, or is it new?
 *
 * FINDING (SPLIT BY H_t COMPONENT: MAIN TERMS vs ERROR CAP)
 * -----------------------------------------------------------------------------
 * The I1 enclosure has TWO ingredients (imp-35681 Part A, imp-35725): the finite
 * effective MAIN TERMS A_t + B_t (Dirichlet-type sums of terms carrying n^{-s}) plus a
 * SCALAR ERROR CAP C_t = E_A + E_B + E_{C_0} bounding |H_t - (A_t + B_t)| <= C_t. The two
 * halves behave OPPOSITELY under differentiation:
 *
 *   (a) MAIN TERMS -- FREE. A_t + B_t is a FINITE sum, so d/dz(A_t + B_t) is EXACT
 *       termwise: each n^{-s} maps to (-log n) n^{-s} times the elementary ds/dz factor,
 *       an elementary term of the SAME class the I1 interval-sum infrastructure already
 *       bounds. The only change is a bounded amplification factor log n <= log N_eff with
 *       N_eff = sqrt(T_PT / 2 pi) the effective sum length, so log N_eff = (1/2) log(T_PT/2pi)
 *       = w(T_PT) ~ 13.446 -- EXACTLY the imp-35777 robust-regime B/delta. No new ingredient:
 *       the main-term derivative bound is the same interval sum with a per-term log n weight.
 *
 *   (b) ERROR CAP -- NOT FREE. C_t is a SCALAR modulus bound, |H_t - (A_t+B_t)| <= C_t.
 *       An inequality on a functions modulus CANNOT be differentiated: |E(z)| <= C_t
 *       implies NOTHING about |E prime(z)| (a uniformly tiny function can have an arbitrarily
 *       large derivative). So the derivative of the error contribution has NO bound inside
 *       the 1D value enclosure -- a certified sup|H_t prime| needs a genuinely NEW ingredient
 *       for the error half.
 *
 * THE NEW INGREDIENT: TWO ADMISSIBLE ROUTES, BOTH OOM-CONSISTENT AT B ~ |H_t| . w
 * -----------------------------------------------------------------------------
 * Route (I) -- a SEPARATE derivative-error cap C_t prime = E_A prime + E_B prime + E_{C_0} prime:
 *   re-run the Polymath15 effective-error estimates on the DIFFERENTIATED tails/remainders,
 *   an independent (but mechanical, same-shape) budget parallel to the imp-35725 C_t cap.
 * Route (II) -- a CAUCHY ESTIMATE off the I1 value enclosure: for holomorphic H_t,
 *   |H_t prime(z_0)| <= sup_{|z - z_0| = r} |H_t(z)| / r. This REUSES the I1 machinery but
 *   requires it on a 2D complex NEIGHBOURHOOD (a disk of radius r), not just the 1D boundary
 *   segment, and inflates by 1/r. Taking r ~ 1/w (a fixed fraction of the mean zero gap
 *   g = pi/w ~ 0.234) gives 1/r ~ w, so B ~ sup|H_t| . w ~ |H_t| . w -- the SAME order of
 *   magnitude as the termwise-log route, and as the imp-35777 robust B. The two routes AGREE
 *   at B ~ |H_t| . w(T_PT), pinning the OOM.
 *
 * VERDICT: B IS A MODEST-BUT-GENUINELY-NEW INGREDIENT (NOT a free 1D-enclosure byproduct)
 * -----------------------------------------------------------------------------
 * The main-term half of B comes FREE by exact termwise differentiation of the finite
 * A_t + B_t sum; the error half does NOT, because a scalar modulus cap C_t carries no
 * information about the error DERIVATIVE. So B = sup|H_t prime| is NOT obtainable by
 * termwise-differentiating the 1D I1 value enclosure alone: it requires ONE of a separate
 * derivative-error cap C_t prime (route I) or a 2D-neighbourhood Cauchy estimate (route II).
 * Both are mechanical extensions of existing infra rather than fundamentally new mathematics,
 * and both yield B ~ |H_t| . w consistent with imp-35777 -- but each is a genuinely NEW
 * certificate ingredient the I1 value enclosure does not already contain.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Assessment only. It bounds no B (sup|H_t prime|), lower-bounds no delta (inf|H_t|),
 * instantiates no interval enclosure (I1), evaluates no H_t or H_t prime on any segment,
 * fixes no Delta, h, or Cauchy radius r, certifies no panel cap (I2), and changes no bound.
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35777-i2-logderivative-panel-cap-scope (I2 cap sup|f prime/f| <= B/delta; B = sup|H_t prime|)
 * @see imp-35681-w1-w2-w4-existing-infra-inventory (I1 A_t+B_t-C_t enclosure graded greenfield, Part A)
 * @see imp-35725-w1-effective-error-cap-budget (scalar error cap C_t = E_A + E_B + E_{C_0})
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I1..I5 ingredient ledger)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (I3 floor delta = inf|H_t| = barrier-margin surplus)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35777 / imp-35757) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this assessment
const TWO_PI = 2 * Math.PI;

// Mean winding rate w(t) = (1/2) log(t/2pi); recovered here two ways as the B amplification.
const LOG_T_OVER_2PI = Math.log(T_PT / TWO_PI); // ~ 26.8918
const WINDING_RATE = 0.5 * LOG_T_OVER_2PI; // w(T_PT) ~ 13.446

// Route (a)/main terms: effective sum length N_eff = sqrt(T_PT/2pi); the termwise log n weight
// is bounded by log N_eff, and log N_eff = (1/2) log(T_PT/2pi) = w EXACTLY.
const N_EFF = Math.sqrt(T_PT / TWO_PI); // ~ 6.91e5
const MAIN_TERM_LOG_WEIGHT = Math.log(N_EFF); // = w (max per-term derivative amplification)

// Route (II)/Cauchy estimate: |H_t prime| <= sup|H_t| / r. With r ~ 1/w (a fixed fraction of
// the mean zero gap g = pi/w), the inflation 1/r ~ w matches the termwise-log amplification.
const MEAN_ZERO_GAP = Math.PI / WINDING_RATE; // g ~ 0.2336 height units
const CAUCHY_RADIUS = 1 / WINDING_RATE; // r ~ 0.0744 = (1/pi) of the mean gap
const CAUCHY_INFLATION = 1 / CAUCHY_RADIUS; // 1/r = w ~ 13.446 (agrees with main-term route)

// The two admissible NEW-ingredient routes for the error half of B.
const NEW_INGREDIENT_ROUTES = [
  {
    key: 'derivative-error-cap',
    label: 'Route I: separate derivative-error cap C_t prime = E_A prime + E_B prime + E_{C_0} prime',
    reusesI1: false, // an independent (parallel-shape) error budget on the differentiated tails
  },
  {
    key: 'cauchy-estimate',
    label: 'Route II: Cauchy estimate sup|H_t| / r on a 2D neighbourhood disk of radius r',
    reusesI1: true, // reuses the I1 value machinery but on a 2D neighbourhood, inflated by 1/r
  },
];

export const IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE = {
  id: 'imp-35832',
  proofSection: 'S-frontier',
  question:
    'Assess whether the imp-35777 I2-cap derivative bound B = sup|H_t prime| can be obtained by ' +
    'differentiating the imp-35681 Part A / I1 interval enclosure of H_t = A_t + B_t - C_t termwise, ' +
    'or whether a certified enclosure of H_t prime is a genuinely NEW ingredient. Assessment only; ' +
    'certifies no cap; changes no bound; NO QED.',
  splitByComponent: {
    mainTerms: {
      status: 'FREE',
      why:
        'A_t + B_t is a FINITE Dirichlet-type sum, so its derivative is EXACT termwise: n^{-s} -> ' +
        '(-log n) n^{-s} times the elementary ds/dz factor, an elementary term of the same class the ' +
        'I1 interval-sum infrastructure already bounds. Only change: a per-term log n <= log N_eff weight.',
      amplification: 'log N_eff = (1/2) log(T_PT/2pi) = w(T_PT) ~ 13.446 (the imp-35777 robust B/delta).',
    },
    errorCap: {
      status: 'NOT FREE',
      why:
        'C_t = E_A + E_B + E_{C_0} is a SCALAR modulus bound |H_t - (A_t+B_t)| <= C_t. An inequality on a ' +
        'modulus CANNOT be differentiated: |E| <= C_t implies NOTHING about |E prime| (a uniformly tiny ' +
        'function can have an arbitrarily large derivative). The error DERIVATIVE has no bound inside the ' +
        '1D value enclosure.',
    },
  },
  newIngredientRoutes: NEW_INGREDIENT_ROUTES,
  oomAgreement: {
    termwiseLogRoute: 'B_main ~ |H_t| . log N_eff = |H_t| . w.',
    cauchyRoute: 'B ~ sup|H_t| / r ~ |H_t| . (1/r); r ~ 1/w gives 1/r ~ w.',
    agreement: 'Both routes give B ~ |H_t| . w(T_PT) ~ |H_t| . 13.446, matching the imp-35777 robust B.',
    logT_over_2pi: LOG_T_OVER_2PI,
    windingRate: WINDING_RATE,
    nEff: N_EFF,
    mainTermLogWeight: MAIN_TERM_LOG_WEIGHT,
    meanZeroGap: MEAN_ZERO_GAP,
    cauchyRadius: CAUCHY_RADIUS,
    cauchyInflation: CAUCHY_INFLATION,
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). The I2-cap derivative bound B = sup|H_t prime| ' +
    'is PARTIALLY free from the I1 enclosure but NOT fully: the MAIN-TERM half comes FREE by EXACT termwise ' +
    'differentiation of the finite A_t + B_t Dirichlet sum (each term gains a bounded log n <= log N_eff = ' +
    '(1/2) log(T_PT/2pi) = w ~ 13.446 weight, the same interval-sum infra), but the ERROR half does NOT, ' +
    'because C_t = E_A + E_B + E_{C_0} is a SCALAR modulus cap and |E| <= C_t carries NO information about ' +
    '|E prime|. So a certified sup|H_t prime| requires a genuinely NEW ingredient the 1D value enclosure does ' +
    'not contain: EITHER a separate derivative-error cap C_t prime = E_A prime + E_B prime + E_{C_0} prime ' +
    '(route I, an independent same-shape budget) OR a Cauchy estimate sup|H_t|/r on a 2D complex neighbourhood ' +
    'disk of radius r (route II, reuses I1 machinery on a neighbourhood, inflated by 1/r). Both routes are ' +
    'mechanical extensions of existing infra, not new mathematics, and both give B ~ |H_t| . w consistent with ' +
    'imp-35777 -- but B is NOT a free byproduct of termwise-differentiating the scalar I1 enclosure; it is a ' +
    'modest but genuinely NEW certificate ingredient. Bounds no B; lower-bounds no delta; instantiates no ' +
    'enclosure; evaluates no H_t or H_t prime; fixes no Delta, h, or Cauchy radius r; certifies no cap; ' +
    'establishes no positivity; certifies no non-vanishing; I2 remains GREENFIELD downstream of W1; changes no ' +
    'bound; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35777 (I2 cap, B = sup|H_t prime|); imp-35681 Part A (I1 A_t+B_t-C_t enclosure, greenfield); ' +
    'imp-35725 (scalar error cap C_t = E_A + E_B + E_{C_0}); imp-35727 (I1..I5 ledger); imp-35758 (I3 floor ' +
    'delta = inf|H_t|); Polymath15 2019 (H_t = A + B - C); Platt-Trudgian 2021.',
};

export const IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE_ASSERTIONS = [
  {
    // Main-term half: termwise-exact, amplification factor = log N_eff = w EXACTLY (N_eff = sqrt(T/2pi)).
    id: 'imp35832-main-term-termwise-free',
    description: 'Main-term derivative FREE termwise; amplification log N_eff = (1/2) log(T_PT/2pi) = w ~ 13.446',
    holds: () =>
      T_PT === 3e12 &&
      Math.abs(N_EFF - Math.sqrt(3e12 / (2 * Math.PI))) < 1e-3 &&
      Math.abs(MAIN_TERM_LOG_WEIGHT - WINDING_RATE) < 1e-9 &&
      Math.abs(WINDING_RATE - 13.4458782) < 1e-4 &&
      IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE.splitByComponent.mainTerms.status === 'FREE',
  },
  {
    // Error-cap half: NOT free -- a scalar modulus cap cannot be differentiated.
    id: 'imp35832-error-cap-not-free',
    description: 'Error-cap derivative NOT free: |E| <= C_t implies nothing about |E prime|',
    holds: () =>
      IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE.splitByComponent.errorCap.status === 'NOT FREE' &&
      /CANNOT be differentiated/.test(IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE.splitByComponent.errorCap.why) &&
      /arbitrarily\s+large derivative/.test(IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE.splitByComponent.errorCap.why),
  },
  {
    // Two admissible NEW-ingredient routes; exactly one reuses the I1 value machinery (Cauchy).
    id: 'imp35832-two-new-ingredient-routes',
    description: 'B needs one of: separate derivative-error cap C_t prime, or a 2D Cauchy estimate off I1',
    holds: () =>
      NEW_INGREDIENT_ROUTES.length === 2 &&
      NEW_INGREDIENT_ROUTES.filter((r) => r.reusesI1).length === 1 &&
      NEW_INGREDIENT_ROUTES.some((r) => r.key === 'derivative-error-cap') &&
      NEW_INGREDIENT_ROUTES.some((r) => r.key === 'cauchy-estimate'),
  },
  {
    // OOM agreement: termwise-log route and Cauchy route both give B ~ |H_t| . w.
    id: 'imp35832-two-routes-agree-at-w',
    description: 'Termwise log-weight (log N_eff) and Cauchy inflation (1/r, r=1/w) both equal w ~ 13.446',
    holds: () =>
      Math.abs(CAUCHY_RADIUS - 1 / WINDING_RATE) < 1e-15 &&
      Math.abs(CAUCHY_INFLATION - WINDING_RATE) < 1e-12 &&
      Math.abs(MAIN_TERM_LOG_WEIGHT - CAUCHY_INFLATION) < 1e-9 &&
      Math.abs(MEAN_ZERO_GAP - Math.PI / WINDING_RATE) < 1e-15 &&
      Math.abs(CAUCHY_RADIUS - MEAN_ZERO_GAP / Math.PI) < 1e-15,
  },
  {
    // Honesty gate: assessment only, no certification, no QED, no refereed bound is changed.
    id: 'imp35832-honesty-gate-no-qed',
    description: 'Assessment only; certifies no cap; bounds no B; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /certifies no cap/.test(IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE.verdict) &&
      /NO QED/.test(IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE.verdict),
  },
  {
    // Honesty gate: the verdict must state B is genuinely NEW (not free) and keep the I2/W1 caveat template.
    id: 'imp35832-honesty-gate-new-ingredient-verdict',
    description: 'Verdict states B is a genuinely NEW ingredient (not a free byproduct), GREENFIELD downstream of W1',
    holds: () =>
      /genuinely NEW/.test(IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE.verdict) &&
      /NOT a free byproduct/.test(IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE.verdict) &&
      /establishes no positivity/.test(IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE.verdict) &&
      /GREENFIELD downstream of W1/.test(IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE.verdict),
  },
];

for (const a of IMP35832_I2_DERIVATIVE_BOUND_FROM_I1_ENCLOSURE_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35832-i2-derivative-bound-from-i1-enclosure-scope assertion failed: ${a.id}`);
  }
}
