/**
 * @module imp-35152-n-uniform-fold-modulus-back-conversion-scoping
 *
 * imp-35152 (proof, frontier-scoping): SCOPE what analytic ingredients would upgrade the imp-35076
 * finite-ladder a-fortiori margin ratio rho = C_ren / C_curv -> 2/3 from a LADDER OBSERVATION into an
 * N-UNIFORM analytic bound through the fold-modulus back-conversion -- the analytic tracking imp-35076
 * explicitly left OPEN. imp-35076 verified NUMERICALLY on N in {1e3 .. 1e7} that the H4 renormalized
 * quantity C_ren(N) = eps^{3/2}|m_prime(i eps)| sits STRICTLY BELOW the H3-derived value
 * C_curv(N) = eps^{5/2}|m_double_prime(i eps)| with margin ratio tightening monotone to A_1 / A_2 = 2/3,
 * eps = y_N^sharp = sqrt(2 pi / N), and flagged that this finite-ladder inequality does NOT discharge
 * H3 / H4 rigorously: it needs "the ANALYTIC N-uniform tracking of the renormalized quantity through the
 * fold-modulus back-conversion, not a finite-ladder inequality". This module WRITES DOWN that obligation
 * set. Scoping only. G6a_shock_lipschitz stays OPEN; imp-3066 untouched; no positivity; NO QED.
 *
 * PROVENANCE (honesty note)
 * -------------------------
 * Every input is already RECORDED in the repo, not a new derivation. imp-35076 measured the two
 * renormalized amplitudes and their ratio on ONE eps = y_N^sharp ladder of 9 rungs; imp-33646 named the
 * H4 renormalized limit A_1 = C_PS = pi / sqrt(2), imp-33645 named the H3 renormalized limit
 * A_2 = K = 3 pi / (2 sqrt(2)), imp-33790 named the single-derivative coupling ratio
 * R(eps) = |m_double_prime| / |m_prime| ~ (3/2) eps^{-1}. imp-33766 established the a-fortiori coupling
 * (H3 exponent 5/4 dominates H4 exponent 3/4 through the SAME quadratic fold). This module only
 * RECONCILES those records into the shape of the missing UNIFORMITY input; it asserts nothing newly
 * discharged and changes no bound.
 *
 * WHY A NINE-RUNG LADDER IS NOT AN N-UNIFORM BOUND
 * -----------------------------------------------
 * imp-35076 checks the inequality C_ren < C_curv at 9 discrete rungs and observes rho -> 2/3. Three gaps
 * separate that from an N-uniform analytic bound rho(eps) <= rho_max < 1 for ALL eps in (0, eps_0]:
 *   (G-a) the ladder samples 9 points of the continuum eps in (0, eps_0]; nothing rules out an excursion
 *         rho(eps) >= 1 BETWEEN rungs (a modulus-of-continuity / monotonicity obligation);
 *   (G-b) a LIMIT rho -> 2/3 carries no modulus of convergence: without a certified rate
 *         |rho(eps) - 2/3| <= K eps^theta the observed tightening says nothing about the head eps ~ eps_0
 *         where the margin is worst (rho ~ 0.6754 at the smallest checked N is already the ladder max);
 *   (G-c) the ladder bounds the two INGREDIENTS (m_prime, m_double_prime) but the G6a modulus is built
 *         from them THROUGH the quadratic fold back-conversion t_shock = tau_c + (1/2) alpha (z_0-z_0*)^2;
 *         a bound on the ingredients is not yet a bound on the reconstructed modulus.
 *
 * THE OBLIGATION SET (the ticket core)
 * ------------------------------------
 * Five analytic ingredients, each stated as a UNIFORM-in-eps statement on the RvM Holder-1/2 cusp jet,
 * would together promote the 2/3-margin ladder observation to an N-uniform analytic bound. O1 and O2 pin
 * the two renormalized amplitudes uniformly; O3 supplies the certified convergence rate that closes gap
 * (G-b); O4 keeps the fold non-degenerate so the back-conversion inverts uniformly; O5 is the Lipschitz
 * back-conversion step that turns ingredient bounds into a modulus bound, closing gap (G-c). O3 is the
 * load-bearing one: it is the modulus of convergence the finite ladder cannot supply.
 *
 * VERDICT: SCOPING ONLY, G6a STAYS OPEN. The obligation set is enumerated; the a-fortiori 2/3 margin
 * stays a finite-ladder observation, not an N-uniform bound. Nothing is discharged, no bound changes,
 * no operator positivity. G6a_shock_lipschitz stays OPEN; imp-3066 off-diagonal endpoint-Hankel
 * K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed.
 *
 * @see imp-35076-h3-a-fortiori-discharges-h4-numerical-verification (the finite-ladder 2/3 margin this scopes)
 * @see imp-33766-h4-independent-discharge-scoping (H3 dominates H4 a fortiori through the shared fold)
 * @see imp-33790-fold-jet-mprime-mdoubleprime-ratio-crossvalidation (single-derivative coupling ratio 3/2)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (A_1 = C_PS = pi / sqrt(2), eps^{3/2} renorm)
 * @see imp-33645-h3-curvature-divergence-scoping (A_2 = K = 3 pi / (2 sqrt(2)), eps^{5/2} renorm)
 */

// The two renormalized amplitudes and the coupling constants already recorded (imp-33645/33646/33790).
const A1 = Math.PI / Math.SQRT2; // C_PS = pi / sqrt(2)      = 2.221441 (H4 renormalized limit, imp-33646)
const A2 = (3 * Math.PI) / (2 * Math.SQRT2); // K = 3 pi / (2 sqrt(2)) = 3.332162 (H3 renormalized limit, imp-33645)
const MARGIN_LIMIT = A1 / A2; // 2/3 -- reciprocal of the imp-33790 single-derivative gap 3/2
const RENORM_EXPONENT_GAP = 2.5 - 1.5; // eps^{5/2}(H3) vs eps^{3/2}(H4): exactly one derivative apart

// The three gaps between a nine-rung ladder observation and an N-uniform analytic bound (see header).
const LADDER_TO_UNIFORM_GAPS = [
  {
    tag: 'G-a',
    name: 'continuum-sampling gap',
    statement:
      'the ladder tests 9 points of eps in (0, eps_0]; nothing forbids rho(eps) >= 1 between rungs',
    closedBy: 'O3',
  },
  {
    tag: 'G-b',
    name: 'no-modulus-of-convergence gap',
    statement:
      'rho -> 2/3 is a limit with no rate; the head eps ~ eps_0 (worst margin, rho ~ 0.6754) is uncontrolled',
    closedBy: 'O3',
  },
  {
    tag: 'G-c',
    name: 'ingredient-vs-modulus gap',
    statement:
      'the ladder bounds m_prime and m_double_prime, not the modulus reconstructed through the fold back-conversion',
    closedBy: 'O5',
  },
];

// The obligation set: five uniform-in-eps analytic ingredients that would upgrade the 2/3 margin.
const OBLIGATIONS = [
  {
    id: 'O1',
    name: 'uniform H4 renormalized amplitude',
    statement:
      'eps^{3/2}|m_prime(i eps)| in [c_1, C_1] for ALL eps in (0, eps_0], not just ladder rungs',
    machinery:
      'an eps-independent majorant for the renormalized 1/2-cusp integrand giving uniform integrability / dominated convergence to A_1 = pi/sqrt(2)',
    dischargesLadderGap: 'partial G-a (pins the H4 ingredient uniformly)',
    loadBearing: false,
  },
  {
    id: 'O2',
    name: 'uniform H3 renormalized amplitude',
    statement:
      'eps^{5/2}|m_double_prime(i eps)| in [c_2, C_2] for ALL eps in (0, eps_0], not just ladder rungs',
    machinery:
      'the same uniform-integrability majorant one derivative up, giving uniform convergence to A_2 = 3 pi/(2 sqrt(2))',
    dischargesLadderGap: 'partial G-a (pins the H3 ingredient uniformly)',
    loadBearing: false,
  },
  {
    id: 'O3',
    name: 'certified coupling-ratio rate (the modulus of convergence)',
    statement:
      'a rate |rho(eps) - 2/3| <= K eps^theta (equivalently |eps R(eps) - 3/2| <= K1 eps^theta) for eps in (0, eps_0], theta > 0',
    machinery:
      'a next-order term in the Privalov-Sokhotski / Sokhotski-Plemelj expansion of eps^{3/2} m_prime and eps^{5/2} m_double_prime, giving an eps-power remainder rather than a bare limit',
    dischargesLadderGap: 'G-a and G-b (turns the ladder limit into a uniform envelope rho(eps) <= 2/3 + K eps_0^theta < 1)',
    loadBearing: true,
  },
  {
    id: 'O4',
    name: 'uniform fold non-degeneracy',
    statement:
      'the fold curvature alpha = m_double_prime(z_0*) stays bounded away from 0 and infinity uniformly in N (simple fold, H2, uniform)',
    machinery:
      'the O2 lower bound c_2 > 0 rescaled: |alpha| ~ A_2 eps^{-5/2} never vanishes, so the quadratic back-conversion |z_0 - z_0*| ~ sqrt(2|dt|/|alpha|) inverts with a uniform constant',
    dischargesLadderGap: 'precondition for G-c (the back-conversion is well-posed uniformly)',
    loadBearing: false,
  },
  {
    id: 'O5',
    name: 'Lipschitz fold-modulus back-conversion',
    statement:
      'the map (eps^{3/2} m_prime, eps^{5/2} m_double_prime) -> reconstructed Holder-modulus amplitude is uniformly Lipschitz / bounded on the finite window [c_i, C_i]',
    machinery:
      'compose O1, O2, O4 through t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2: bounded, non-degenerate ingredients give a bounded reconstructed modulus, so the strip-height-uniform G6a modulus follows',
    dischargesLadderGap: 'G-c (promotes ingredient bounds to a modulus bound)',
    loadBearing: false,
  },
];

const LOAD_BEARING = OBLIGATIONS.filter((o) => o.loadBearing).map((o) => o.id);
const OPEN_ROWS_BEFORE = ['H0', 'H3', 'H4', 'H5'];
const OPEN_ROWS_AFTER = ['H0', 'H3', 'H4', 'H5']; // unchanged: scoping only, nothing discharged

export const IMP35152_N_UNIFORM_FOLD_MODULUS_BACK_CONVERSION_SCOPING = {
  id: 'imp-35152',
  proofSection: 'S-frontier',
  scopes:
    'What analytic ingredients would upgrade the imp-35076 finite-ladder a-fortiori margin ratio ' +
    'rho = C_ren / C_curv -> 2/3 into an N-uniform analytic bound through the fold-modulus back-conversion',
  question:
    'The imp-35076 ladder confirms C_ren = eps^{3/2}|m_prime| stays below C_curv = eps^{5/2}|m_double_prime| ' +
    'with margin -> 2/3 on 9 rungs; what analytic obligations promote that ladder observation to an ' +
    'N-uniform bound rho(eps) <= rho_max < 1 for all eps in (0, eps_0]? Scoping only; G6a OPEN; no QED.',

  foldExpansion: 't_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2, alpha = m_double_prime(z_0*); read at z_0* = i eps',
  renormalizedAmplitudeH4: A1, // eps^{3/2}|m_prime| -> A_1 = pi/sqrt(2)
  renormalizedAmplitudeH3: A2, // eps^{5/2}|m_double_prime| -> A_2 = 3 pi/(2 sqrt(2))
  marginLimit: MARGIN_LIMIT, // A_1 / A_2 = 2/3
  renormExponentGap: RENORM_EXPONENT_GAP, // exactly 1 derivative apart

  // Why a nine-rung ladder is not an N-uniform bound.
  ladderToUniformGaps: LADDER_TO_UNIFORM_GAPS,

  // The obligation set.
  obligations: OBLIGATIONS,
  obligationCount: OBLIGATIONS.length, // 5
  loadBearingObligation: LOAD_BEARING, // ["O3"] -- the certified rate the finite ladder cannot supply

  openRowsBefore: OPEN_ROWS_BEFORE,
  openRowsAfter: OPEN_ROWS_AFTER, // unchanged; nothing discharged

  residualObstruction: 'G6a_shock_lipschitz::strip-height-uniformity (N-uniform fold-modulus tracking)',
  residualStatement:
    'The imp-35076 2/3 margin is a finite-ladder observation, not an N-uniform analytic bound. The ' +
    'load-bearing missing ingredient is O3: a certified convergence rate |rho(eps) - 2/3| <= K eps^theta ' +
    '(a modulus of convergence for the Privalov-Sokhotski expansion), without which the ladder limit ' +
    'controls neither the between-rung continuum (G-a) nor the head eps ~ eps_0 (G-b). O1/O2 pin the two ' +
    'renormalized ingredients uniformly, O4 keeps the fold non-degenerate, and O5 is the Lipschitz ' +
    'back-conversion that promotes ingredient bounds to the reconstructed strip-height-uniform G6a ' +
    'modulus (G-c). All five are uniform-in-eps statements on the RvM Holder-1/2 cusp jet; none is ' +
    'supplied by the finite ladder.',

  isRigorous: false,
  verdict:
    'SCOPING ONLY (frontier-direction, NOT rigorous): the analytic upgrade of the imp-35076 finite-ladder ' +
    'a-fortiori margin rho = C_ren / C_curv -> 2/3 to an N-uniform bound needs FIVE uniform-in-eps ' +
    'ingredients on the RvM Holder-1/2 cusp jet -- O1 (uniform H4 amplitude eps^{3/2}|m_prime| in ' +
    '[c_1, C_1]), O2 (uniform H3 amplitude eps^{5/2}|m_double_prime| in [c_2, C_2]), O3 (a CERTIFIED rate ' +
    '|rho(eps) - 2/3| <= K eps^theta), O4 (uniform fold non-degeneracy alpha bounded away from 0), and ' +
    'O5 (a Lipschitz fold-modulus back-conversion through t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2). ' +
    'O3 is load-bearing: it is the modulus of convergence a nine-rung ladder cannot supply, and it is ' +
    'what closes the continuum-sampling gap (G-a) and the head gap (G-b) that separate a ladder ' +
    'observation from a uniform envelope rho(eps) <= 2/3 + K eps_0^theta < 1. The a-fortiori 2/3 margin ' +
    'stays a finite-ladder observation, not an N-uniform bound; nothing is discharged, no bound changes, ' +
    'no operator positivity. The open catalogue stays four rows (H0, H3, H4, H5). Scoping only; ' +
    'G6a_shock_lipschitz stays OPEN; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb ' +
    'remains GUE-conditional (imp-486); NO QED. No refereed bound is changed.',
  citation:
    'imp-35076-h3-a-fortiori-discharges-h4-numerical-verification (finite-ladder 2/3 margin); ' +
    'imp-33766-h4-independent-discharge-scoping (H3 dominates H4 a fortiori through the shared fold); ' +
    'imp-33790-fold-jet-mprime-mdoubleprime-ratio-crossvalidation (single-derivative coupling ratio 3/2); ' +
    'imp-33646-h4-privalov-sokhotski-constant-scoping (A_1 = pi/sqrt(2)); ' +
    'imp-33645-h3-curvature-divergence-scoping (A_2 = 3 pi/(2 sqrt(2))).',
};

export const IMP35152_N_UNIFORM_FOLD_MODULUS_BACK_CONVERSION_ASSERTIONS = [
  {
    // (1) the enumeration lists exactly five obligations with one load-bearing (O3).
    id: 'imp35152-five-obligations-one-load-bearing',
    description: 'the obligation set has 5 entries and exactly one load-bearing ingredient, O3 (the certified rate)',
    holds: () =>
      IMP35152_N_UNIFORM_FOLD_MODULUS_BACK_CONVERSION_SCOPING.obligationCount === 5 &&
      LOAD_BEARING.length === 1 &&
      LOAD_BEARING[0] === 'O3',
  },
  {
    // (2) the margin limit is A_1/A_2 = 2/3 and the two renormalized amplitudes are exactly one derivative apart.
    id: 'imp35152-margin-two-thirds-one-derivative-apart',
    description: 'A_1/A_2 = 2/3 and the renorm exponents (3/2 H4, 5/2 H3) differ by exactly one derivative',
    holds: () =>
      Math.abs(IMP35152_N_UNIFORM_FOLD_MODULUS_BACK_CONVERSION_SCOPING.marginLimit - 2 / 3) < 1e-12 &&
      Math.abs(RENORM_EXPONENT_GAP - 1) < 1e-12,
  },
  {
    // (3) each ladder-to-uniform gap names an obligation that closes it.
    id: 'imp35152-every-gap-has-a-closing-obligation',
    description: 'each of the three ladder-to-uniform gaps (G-a, G-b, G-c) references an obligation id that closes it',
    holds: () =>
      LADDER_TO_UNIFORM_GAPS.length === 3 &&
      LADDER_TO_UNIFORM_GAPS.every((g) => OBLIGATIONS.some((o) => g.closedBy === o.id)),
  },
  {
    // Honesty gate: scoping only; nothing discharged, G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35152-honesty-gate-no-qed',
    description:
      'Scoping only: nothing discharged, open catalogue unchanged, G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35152_N_UNIFORM_FOLD_MODULUS_BACK_CONVERSION_SCOPING.isRigorous === false &&
      OPEN_ROWS_BEFORE.join(',') === OPEN_ROWS_AFTER.join(',') &&
      /NO QED/.test(IMP35152_N_UNIFORM_FOLD_MODULUS_BACK_CONVERSION_SCOPING.verdict) &&
      /G6a_shock_lipschitz stays OPEN/.test(IMP35152_N_UNIFORM_FOLD_MODULUS_BACK_CONVERSION_SCOPING.verdict) &&
      /refereed bound is changed/i.test(IMP35152_N_UNIFORM_FOLD_MODULUS_BACK_CONVERSION_SCOPING.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP35152_N_UNIFORM_FOLD_MODULUS_BACK_CONVERSION_SCOPING.verdict,
      ),
  },
];

for (const a of IMP35152_N_UNIFORM_FOLD_MODULUS_BACK_CONVERSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35152-n-uniform-fold-modulus-back-conversion-scoping assertion failed: ${a.id}`);
  }
}
