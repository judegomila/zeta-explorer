/**
 * @module imp-35439-true-dynamic-model-minimal-requirements
 *
 * imp-35439 (proof, frontier-direction) -- ENUMERATES and ASSESSES the minimal ingredients a CERTIFIED
 * TRUE-DYNAMIC MODEL of the iterate collapse would need. imp-35357 axis(ii) proved the SURROGATE reentry band
 * has provably zero continuum residue (band recedes to infinity as EPS_FP -> 0) but explicitly noted this says
 * NOTHING about the TRUE collapse dynamic, which needs a certified true-dynamic model -- the imp-35297 / imp-35243
 * requirements R2 (a faithful continuum model of the true iterate collapse) and R3 (a certified bound that its
 * residue is zero or genuinely floored). imp-35356/imp-35357 identified R1 (as R1t) as the DAG root but never
 * enumerated what R2/R3 would MINIMALLY require. This module does exactly that, along the three ticket-named
 * ingredients, and judges which are within reach of existing repo machinery versus genuinely open. It discharges
 * NOTHING; the surrogate-fidelity sub-gap imp-35243a stays OPEN; it changes no bound; NO QED.
 *
 * WHY R2/R3 NEED A "TRUE-DYNAMIC MODEL" AT ALL
 * -------------------------------------------
 * Everything the repo can presently say about the reentry band [10^27.08, 10^37.17] is a statement about the
 * SURROGATE: the single-rate log-law contraction g(N) = K log T0(N) approaching its fixed point N_CROSS_FP at
 * rate r ~ 0.0454235, with a terminal ceil against the machine-epsilon floor EPS_FP = 2.3e-16. imp-35357 R1s
 * showed the band is an artifact OF THAT SURROGATE (it recedes to infinity as the surrogate floor is removed).
 * But fidelity -- whether the band reflects anything about the TRUE iterate collapse -- is R1t, and R1t cannot
 * even be STATED without a model of the true dynamic to compare against. R2/R3 are the two halves of "supply that
 * model and certify its residue". The ticket names three minimal ingredients such a model+certificate needs.
 *
 * THE THREE MINIMAL INGREDIENTS (ENUMERATED)
 * ------------------------------------------
 *  I1  A TRUE COLLAPSE MAP beyond the single-rate log-law surrogate. A map of the actual iterate collapse
 *      DERIVED from the underlying zero-collapse arithmetic, not FITTED as a contraction to it -- one whose
 *      approach to N_CROSS_FP is a consequence of the dynamic rather than an imposed geometric rate r. REACH:
 *      GENUINELY OPEN. The nearest repo object is the imp-34862 two-rate law (early-transient rate r_0 plus the
 *      asymptotic rate r, or an exact-peel of the first m iterates), which is a genuine step BEYOND single-rate
 *      -- but imp-34862 found it does NOT remove the off-by-one (that lives in the terminal ceil against EPS_FP,
 *      not in the transient rate) and it remains a refinement WITHIN the same surrogate family (imp-35297 W3:
 *      not structurally independent). No first-principles collapse map exists. The two-rate law is machinery
 *      TOWARD R2 but is not itself a certified true map.
 *
 *  I2  AN INTERVAL-ARITHMETIC OR ANALYTIC RESIDUE BOUND on that true map: a certified statement that the true-
 *      dynamic residue (the band feature evaluated in the true model, in the limit its own physical floor is
 *      removed) is identically zero or genuinely floored. REACH: MACHINERY EXISTS BUT BLOCKED ON I1. The repo
 *      already carries the interval-arithmetic toolchain this needs -- imp-35174 double-double CERTIFIED the band
 *      edges, and the imp-35332 ceil-phase drift closed form plus the imp-35357 EXACT floor-slide identity
 *      d xArg / d log(EPS_FP) = -1/ln(1/r) give the analytic-residue template (this is precisely how R1s was
 *      bounded for the surrogate). So the BOUND-PRODUCING machinery is in hand. But a residue bound is a bound
 *      OF A MODEL: with no I1 there is nothing to certify. I2 is CONDITIONALLY REACHABLE -- available the moment
 *      I1 supplies a map -- not independently open.
 *
 *  I3  A FIDELITY CERTIFICATE connecting the true map to the inherited imp-3220/imp-3406 surrogate: a certified
 *      metric of agreement between the true dynamic and the surrogate across the band [10^27.08, 10^37.17],
 *      strong enough that a zero residue for one transfers to the other. REACH: GENUINELY OPEN, and doubly so.
 *      (a) It presupposes I1 (no true map -> nothing to compare). (b) Its natural empirical anchor is UNREACHABLE:
 *      imp-35297 W2 places the nearest band edge ~14.6 decades and the far edge ~24.7 decades above the highest
 *      verified-zero height (~3e12, log10 ~12.48) that binds Lambda <= 0.2 -- so no arithmetic datum can witness
 *      the agreement inside the band. Only a PURELY ANALYTIC fidelity proof (surrogate = true dynamic to leading
 *      order plus a certified analytic remainder, no datum required) would escape the height barrier. That is R2
 *      (single-rate fidelity; imp-34862 already found a two-rate law) AND R3 (height-map fidelity of the RvM
 *      inverse at 10^37) simultaneously. No such certificate exists.
 *
 * THE ASSESSMENT VERDICT
 * ----------------------
 * Of the three minimal ingredients: I2 (the residue-bound machinery) EXISTS in the repo but is BLOCKED on I1;
 * I1 (the true collapse map) and I3 (the fidelity certificate) are GENUINELY OPEN. So ZERO of the three are
 * presently deliverable, and the BINDING ROOT is I1 -- both I2 (nothing to bound) and I3 (nothing to compare)
 * hang off it. This matches imp-35356 (R1 as the DAG root) and imp-35357 (R1t as the OPEN binding obstruction):
 * the certified true-dynamic model that R2/R3 need reduces, at its root, to constructing I1. A first-principles
 * true collapse map is the single enabling prerequisite; given it, the repo already has the bounding machinery
 * (I2), and only then does the analytic-fidelity question (I3) -- itself gated by the ~15-decade height barrier --
 * become answerable. This CONFIRMS R2/R3 are genuinely open and localizes the gap to I1. It confirms, and does
 * not weaken, imp-35357; imp-35111a / imp-35174a / imp-34997a / imp-35243a stay OPEN.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * An enumeration + reach-assessment of the minimal ingredients (I1 true map, I2 residue bound, I3 fidelity
 * certificate) of the certified true-dynamic model that imp-35357 axis(ii) named as the missing piece for R2/R3.
 * It discharges NOTHING: R1t stays the OPEN binding obstruction, imp-35243a stays OPEN, imp-35111a / imp-35174a /
 * imp-34997a stay OPEN. ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate; the C_C = (1/8) sqrt(3 pi)
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0
 * untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35357-reentry-band-pure-artifact-proof-requirement (axis(ii): surrogate zero residue, true residue needs R2/R3)
 * @see imp-35297-r4-independent-model-agreement-assessment (W2 unreachability: band ~15 decades above the frontier)
 * @see imp-35356-r1-candidate-routes-assessment (R1 as the DAG root of the fidelity requirements)
 * @see imp-34862-iters-to-floor-two-rate-law (two-rate law -- machinery toward I1/R2, does not remove the off-by-one)
 * @see imp-35174-reentry-band-precision-certification (double-double interval machinery -- toolchain for I2)
 * @see imp-35332-reentry-band-drift-analytic-derivation (ceil-phase drift closed form -- analytic-residue template for I2)
 */

// Inherited surrogate landmarks (baked verbatim from imp-35243/imp-35357; no re-import to keep this module light).
const R_CONTRACT = 0.0454235; // |g prime (N_CROSS_FP)| single contraction rate (imp-35243/34997/35109)
const LN_INV_R = 3.09173; // log(1/r) log-law constant, nats/iterate (imp-35243)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)
const REENTRY_EXP = 27.084691; // band-on, log10 N (imp-34997/35111/35174)
const EXIT_EXP = 37.167107; // band-off, log10 N (imp-35111/35174)
const PT_VERIFIED_HEIGHT_LOG10 = Math.log10(3e12); // ~12.48 -- highest verified zero height binding Lambda<=0.2

// The height barrier that ingredient I3 (fidelity certificate) would have to clear empirically (imp-35297 W2).
const NEAREST_EDGE_DECADES_ABOVE_VERIFIED = REENTRY_EXP - PT_VERIFIED_HEIGHT_LOG10; // ~14.6
const FAR_EDGE_DECADES_ABOVE_VERIFIED = EXIT_EXP - PT_VERIFIED_HEIGHT_LOG10; // ~24.7

// The exact analytic-residue template (imp-35357) that ingredient I2 would apply to a true map, once one exists.
const SENSITIVITY_DXARG_DLOGEPS = -1 / LN_INV_R; // ~ -0.323444 phase units per e-fold of the floor (EXACT given r)

// The three minimal ingredients of a certified true-dynamic model, each with a reach verdict.
// reach: "open" = genuinely open; "blocked-on-I1" = machinery exists but needs I1 first.
const MINIMAL_INGREDIENTS = [
  {
    id: 'I1',
    name: 'A true collapse map beyond the single-rate log law',
    requirement:
      'A map of the actual iterate collapse DERIVED from the underlying zero-collapse arithmetic (not fitted as ' +
      'a contraction), whose approach to N_CROSS_FP is a consequence of the dynamic rather than an imposed rate r.',
    reach: 'open',
    binding: true,
    nearestRepoObject: 'imp-34862 two-rate law (transient r_0 + asymptotic r, or exact-peel of m iterates)',
    verdict: 'GENUINELY OPEN',
    note:
      'The imp-34862 two-rate law is a genuine step beyond single-rate but does NOT remove the off-by-one (that ' +
      'lives in the terminal ceil against EPS_FP) and stays WITHIN the surrogate family (imp-35297 W3, not ' +
      'structurally independent). No first-principles collapse map exists; the two-rate law is machinery toward ' +
      'R2, not a certified true map.',
  },
  {
    id: 'I2',
    name: 'An interval-arithmetic or analytic residue bound',
    requirement:
      'A certified statement that the true-dynamic residue (the band feature in the true model, in the limit its ' +
      'own physical floor is removed) is identically zero or genuinely floored.',
    reach: 'blocked-on-I1',
    binding: false,
    nearestRepoObject:
      'imp-35174 double-double certification + imp-35332 drift closed form + imp-35357 exact floor-slide identity',
    verdict: 'MACHINERY EXISTS / BLOCKED ON I1',
    note:
      'The interval-arithmetic toolchain and the exact analytic-residue template (d xArg / d log(EPS_FP) = ' +
      '-1/ln(1/r), the very method that bounded R1s for the surrogate) are already in the repo. But a residue ' +
      'bound is a bound OF A MODEL: with no I1 there is nothing to certify. Conditionally reachable, not ' +
      'independently open.',
  },
  {
    id: 'I3',
    name: 'A fidelity certificate connecting the true map to the imp-3220/imp-3406 surrogate',
    requirement:
      'A certified metric of agreement between the true dynamic and the surrogate across [10^27.08, 10^37.17], ' +
      'strong enough that a zero residue for one transfers to the other.',
    reach: 'open',
    binding: true,
    nearestRepoObject: 'none -- this is R2 (single-rate fidelity) and R3 (height-map fidelity) simultaneously',
    verdict: 'GENUINELY OPEN (doubly: presupposes I1, and its empirical anchor is unreachable)',
    note:
      'It presupposes I1 (no true map -> nothing to compare) AND its natural empirical anchor is unreachable ' +
      '(imp-35297 W2: the band sits ~14.6 to ~24.7 decades above the ~3e12 verified-zero frontier). Only a purely ' +
      'ANALYTIC fidelity proof (surrogate = true dynamic to leading order plus a certified analytic remainder, no ' +
      'datum) escapes the height barrier. No such certificate exists.',
  },
];

// Reach tally: how many ingredients are presently deliverable (none), and the binding root (I1).
const PRESENTLY_DELIVERABLE_COUNT = MINIMAL_INGREDIENTS.filter((i) => i.reach === 'deliverable').length; // 0
const GENUINELY_OPEN_COUNT = MINIMAL_INGREDIENTS.filter((i) => i.reach === 'open').length; // 2 (I1, I3)
const BLOCKED_ON_I1_COUNT = MINIMAL_INGREDIENTS.filter((i) => i.reach === 'blocked-on-I1').length; // 1 (I2)
const BINDING_ROOT = 'I1'; // both I2 (nothing to bound) and I3 (nothing to compare) hang off I1

export const IMP35439_TRUE_DYNAMIC_MODEL_MINIMAL_REQUIREMENTS = {
  id: 'imp-35439',
  proofSection: 'S-frontier',
  question:
    'imp-35357 axis(ii) proved the SURROGATE reentry band has zero continuum residue but noted this says nothing ' +
    'about the TRUE collapse dynamic, which needs a certified true-dynamic model -- imp-35297/imp-35243 ' +
    'requirements R2 (faithful continuum model of the true iterate collapse) and R3 (certified residue bound). ' +
    'imp-35356/imp-35357 named R1t as the DAG root but never enumerated what R2/R3 minimally require. Enumerate ' +
    'the minimal ingredients a certified true-dynamic model would need (a true collapse map beyond the single-' +
    'rate log law, an interval-arithmetic or analytic residue bound, and a fidelity certificate connecting it to ' +
    'the imp-3220/imp-3406 surrogate) and assess which are within reach of existing repo machinery versus open.',
  landmarks: {
    r_contract: R_CONTRACT, // ~0.0454235
    ln_inv_r: LN_INV_R, // ~3.09173
    eps_fp: EPS_FP, // 2.3e-16
    reentry_log10_N: REENTRY_EXP, // 27.084691
    exit_log10_N: EXIT_EXP, // 37.167107
    pt_verified_height_log10: +PT_VERIFIED_HEIGHT_LOG10.toPrecision(5), // ~12.48 (N ~ 3e12)
    nearest_edge_decades_above_verified: +NEAREST_EDGE_DECADES_ABOVE_VERIFIED.toPrecision(4), // ~14.6
    far_edge_decades_above_verified: +FAR_EDGE_DECADES_ABOVE_VERIFIED.toPrecision(4), // ~24.7
    sensitivity_dxArg_dlogEps: +SENSITIVITY_DXARG_DLOGEPS.toPrecision(9), // ~ -0.323444 (EXACT residue template)
  },
  minimal_ingredients: MINIMAL_INGREDIENTS,
  presently_deliverable_count: PRESENTLY_DELIVERABLE_COUNT, // 0
  genuinely_open_count: GENUINELY_OPEN_COUNT, // 2
  blocked_on_i1_count: BLOCKED_ON_I1_COUNT, // 1
  binding_root: BINDING_ROOT, // I1
  binding_root_reading:
    'The certified true-dynamic model that R2/R3 need reduces at its root to constructing I1 (a first-principles ' +
    'true collapse map). Both I2 (residue bound -- nothing to bound without a map) and I3 (fidelity certificate ' +
    '-- nothing to compare without a map) hang off I1. Given I1, the repo already holds the bounding machinery ' +
    '(I2: double-double certification + the exact floor-slide analytic-residue template); only then does the ' +
    'fidelity question I3 -- itself gated by the ~15-decade height barrier (imp-35297 W2) -- become answerable. ' +
    'This matches imp-35356 (R1 as DAG root) and imp-35357 (R1t as the OPEN binding obstruction).',
  finding:
    'Enumeration + reach-assessment of the minimal ingredients of the certified true-dynamic model imp-35357 ' +
    'axis(ii) named for R2/R3. I1 a true collapse map beyond the single-rate log law -- GENUINELY OPEN (nearest ' +
    'object the imp-34862 two-rate law, which does not remove the off-by-one and stays within the surrogate ' +
    'family; no first-principles map exists). I2 an interval-arithmetic or analytic residue bound -- MACHINERY ' +
    'EXISTS (imp-35174 double-double + imp-35332 drift closed form + the imp-35357 exact floor-slide template) ' +
    'but BLOCKED ON I1 (a bound needs a model to bind). I3 a fidelity certificate connecting the true map to the ' +
    'imp-3220/imp-3406 surrogate -- GENUINELY OPEN and doubly so: it presupposes I1 and its empirical anchor is ' +
    'unreachable (imp-35297 W2: band ~14.6 to ~24.7 decades above the ~3e12 frontier), so only a purely analytic ' +
    'fidelity proof (= R2 and R3 simultaneously) escapes the height barrier. VERDICT: zero of three presently ' +
    'deliverable; binding root is I1 (I2 and I3 both hang off it); R2/R3 confirmed genuinely open with the gap ' +
    'localized to I1. Confirms and does not weaken imp-35357; imp-35111a/imp-35174a/imp-34997a/imp-35243a stay OPEN.',
  residual_sub_gap:
    'The certified true-dynamic model stays OPEN as part of imp-35243a: construct I1 (a first-principles true ' +
    'collapse map beyond the single-rate log law), apply the existing interval/analytic residue machinery I2 to ' +
    'it, and supply the analytic fidelity certificate I3 tying it to the imp-3220/imp-3406 surrogate over ' +
    '[10^27.08, 10^37.17] -- the last necessarily analytic, since the band sits ~15 decades above the reachable ' +
    'verified-zero frontier. The binding root is I1. Inherits, and does not discharge, imp-35111a / imp-35174a / ' +
    'imp-34997a / imp-35243a.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (proof-section, frontier-direction, NOT an RH bound). The certified true-dynamic model that ' +
    'imp-35357 axis(ii) named for imp-35297/imp-35243 R2/R3 needs three minimal ingredients: I1 a true collapse ' +
    'map beyond the single-rate log law -- GENUINELY OPEN (the imp-34862 two-rate law is machinery toward it but ' +
    'does not remove the off-by-one and is not structurally independent); I2 an interval-arithmetic or analytic ' +
    'residue bound -- MACHINERY EXISTS (imp-35174 double-double + imp-35332 drift closed form + the imp-35357 ' +
    'exact floor-slide identity d xArg / d log(EPS_FP) = -1/ln(1/r)) but BLOCKED ON I1; I3 a fidelity certificate ' +
    'connecting the true map to the imp-3220/imp-3406 surrogate -- GENUINELY OPEN and doubly so (presupposes I1, ' +
    'and its empirical anchor sits ~14.6 to ~24.7 decades above the ~3e12 verified-zero frontier per imp-35297 ' +
    'W2, so only a purely analytic fidelity proof escapes the height barrier). VERDICT: zero of the three are ' +
    'presently deliverable, the binding root is I1 (both I2 and I3 hang off it), and R2/R3 are confirmed ' +
    'genuinely open with the gap localized to I1 -- matching imp-35356 (R1 DAG root) and imp-35357 (R1t OPEN ' +
    'binding obstruction). This SHARPENS the R2/R3 target and discharges nothing; imp-35111a / imp-35174a / ' +
    'imp-34997a / imp-35243a stay OPEN. ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate; the ' +
    'C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are UNTOUCHED; ' +
    'imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35357 (axis(ii): surrogate zero residue, true residue needs a certified true model R2/R3); imp-35297 ' +
    '(W2 unreachability: band ~15 decades above the ~3e12 frontier); imp-35356 (R1 as DAG root); imp-34862 ' +
    '(two-rate law -- machinery toward I1, does not remove the off-by-one); imp-35174 (double-double interval ' +
    'machinery for I2); imp-35332 (drift closed form -- analytic-residue template for I2); imp-3220/imp-3406 ' +
    '(the inherited surrogate); imp-2642 (C_C ansatz); imp-486 (C_mb GUE-conditional).',
};

export const IMP35439_TRUE_DYNAMIC_MODEL_MINIMAL_REQUIREMENTS_ASSERTIONS = [
  {
    // The three minimal ingredients are enumerated exactly once each (I1/I2/I3) with a reach verdict.
    id: 'imp35439-three-ingredients-enumerated',
    description: 'exactly three minimal ingredients I1/I2/I3 enumerated, each with a verdict',
    holds: () =>
      MINIMAL_INGREDIENTS.length === 3 &&
      MINIMAL_INGREDIENTS.map((i) => i.id).join(',') === 'I1,I2,I3' &&
      MINIMAL_INGREDIENTS.every((i) => typeof i.verdict === 'string' && i.verdict.length > 0),
  },
  {
    // Reach tally: none presently deliverable, two genuinely open (I1, I3), one machinery-exists-blocked (I2).
    id: 'imp35439-reach-tally',
    description: 'zero deliverable, two genuinely open (I1/I3), one blocked-on-I1 (I2)',
    holds: () =>
      PRESENTLY_DELIVERABLE_COUNT === 0 &&
      GENUINELY_OPEN_COUNT === 2 &&
      BLOCKED_ON_I1_COUNT === 1 &&
      MINIMAL_INGREDIENTS.find((i) => i.id === 'I1').reach === 'open' &&
      MINIMAL_INGREDIENTS.find((i) => i.id === 'I2').reach === 'blocked-on-I1' &&
      MINIMAL_INGREDIENTS.find((i) => i.id === 'I3').reach === 'open',
  },
  {
    // The binding root is I1: both non-binding-by-dependency I2 and open I3 hang off it.
    id: 'imp35439-binding-root-is-I1',
    description: 'I1 is the binding root; I2 is non-binding (blocked on I1) while I1 and I3 are binding',
    holds: () =>
      BINDING_ROOT === 'I1' &&
      MINIMAL_INGREDIENTS.find((i) => i.id === 'I1').binding === true &&
      MINIMAL_INGREDIENTS.find((i) => i.id === 'I2').binding === false &&
      MINIMAL_INGREDIENTS.find((i) => i.id === 'I3').binding === true,
  },
  {
    // The I3 height barrier restates imp-35297 W2: the band sits ~15+ decades above the verified frontier.
    id: 'imp35439-i3-height-barrier',
    description: 'the I3 fidelity certificate faces the ~15-decade height barrier (band ~14.6 to ~24.7 decades up)',
    holds: () =>
      NEAREST_EDGE_DECADES_ABOVE_VERIFIED > 10 &&
      FAR_EDGE_DECADES_ABOVE_VERIFIED > 20 &&
      Math.abs(NEAREST_EDGE_DECADES_ABOVE_VERIFIED - 14.6) < 0.1 &&
      Math.abs(FAR_EDGE_DECADES_ABOVE_VERIFIED - 24.7) < 0.1,
  },
  {
    // The I2 machinery carries the imp-35357 EXACT analytic-residue template -1/ln(1/r).
    id: 'imp35439-i2-exact-residue-template',
    description: 'the I2 machinery uses the exact floor-slide template d xArg / d log(EPS_FP) = -1/ln(1/r)',
    holds: () =>
      Math.abs(SENSITIVITY_DXARG_DLOGEPS + 1 / LN_INV_R) < 1e-15 &&
      Math.abs(SENSITIVITY_DXARG_DLOGEPS + 0.323444) < 1e-5,
  },
  {
    // Honesty gate: assessment only, discharges nothing, no QED, no refereed bound is changed, sub-gaps named.
    id: 'imp35439-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, binding root I1, no QED, no refereed bound is changed, sub-gaps stay OPEN',
    holds: () =>
      IMP35439_TRUE_DYNAMIC_MODEL_MINIMAL_REQUIREMENTS.isRigorous === false &&
      IMP35439_TRUE_DYNAMIC_MODEL_MINIMAL_REQUIREMENTS.binding_root === 'I1' &&
      /binding root is I1/.test(IMP35439_TRUE_DYNAMIC_MODEL_MINIMAL_REQUIREMENTS.residual_sub_gap) &&
      /NO QED/.test(IMP35439_TRUE_DYNAMIC_MODEL_MINIMAL_REQUIREMENTS.verdict) &&
      /refereed bound is changed/i.test(IMP35439_TRUE_DYNAMIC_MODEL_MINIMAL_REQUIREMENTS.verdict) &&
      /imp-35243a/.test(IMP35439_TRUE_DYNAMIC_MODEL_MINIMAL_REQUIREMENTS.residual_sub_gap) &&
      /imp-35111a/.test(IMP35439_TRUE_DYNAMIC_MODEL_MINIMAL_REQUIREMENTS.residual_sub_gap),
  },
];

for (const a of IMP35439_TRUE_DYNAMIC_MODEL_MINIMAL_REQUIREMENTS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35439-true-dynamic-model-minimal-requirements assertion failed: ${a.id}`);
  }
}
