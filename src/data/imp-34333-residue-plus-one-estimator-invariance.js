/**
 * @module imp-34333-residue-plus-one-estimator-invariance
 * @fileoverview imp-34333 -- ASSESS whether the imp-34247 residue-EXACTLY-+1 simple pole
 *   of the widening-slope log-derivative dy/dk = d/dk ln(eflow_over_resid) is a purely
 *   STRUCTURAL consequence of resid_exp having a SIMPLE (order-1) zero -- hence robust to
 *   the choice of finite-difference estimator that produces resid_exp -- or whether an
 *   estimator that gave resid_exp a higher-order or shifted zero would change the residue.
 *
 *   Import-light per [[no_heavy_imports_in_pages]] and [[verify_heavy_assertion_modules]]:
 *   this module imports NOTHING (no lambda-rh-height-mapping / polymath15-constant-C-C
 *   chain, no zeros bundle). It re-derives the residue on a self-contained analytic model
 *   surrogate so the estimator-invariance claim is checked by construction, not by re-running
 *   the inherited imp-34247 pipeline. The imp-34247 numeric landmark (k*-k) dy/dk -> +1.013 at
 *   k=21.275 is carried only as a baked REFERENCE literal for cross-consistency.
 *
 *   THE STRUCTURAL CLAIM (logarithmic-derivative residue = zero multiplicity).
 *   -----------------------------------------------------------------------
 *   Write y(k) = ln(eflowAttr(k)) - ln(resid_exp(k)) (eflowAttr smooth and nonzero at k*).
 *   If resid_exp has an order-m zero at k*, then near k* resid_exp(k) = c (k - k*)^m (1 + ...),
 *   so ln(resid_exp) = m ln(k - k*) + [regular], and
 *       d/dk [ -ln(resid_exp) ] = -m/(k - k*) + [regular] = +m/(k* - k) + [regular].
 *   Hence dy/dk = B(k) + m/(k* - k): the coefficient of the 1/(k* - k) pole in the LOG-DERIVATIVE
 *   channel is EXACTLY the multiplicity m of the zero -- the classical argument-principle fact that
 *   the residue of f_prime/f at a zero equals its order. Three consequences:
 *     (i)  AMPLITUDE-INVARIANT. The zero amplitude c = resid_exp derivative at k* enters ln(resid_exp)
 *          only as the additive constant ln|c|, which the derivative eliminates. The residue does NOT depend
 *          on how steeply the estimator drives resid_exp through zero.
 *     (ii) LOCATION-INVARIANT. Shifting the zero k* moves the pole LOCATION but not its coefficient m;
 *          the residue is unchanged.
 *     (iii) The residue is set ENTIRELY by m. For the imp-34247/imp-34310 estimator resid_exp has a
 *          clean SIGN-CHANGE zero (imp-34310 F2), i.e. ODD order, and the observed near-linear crossing
 *          pins m = 1 -> residue +1. Any finite-difference estimator that PRESERVES the simple,
 *          sign-changing zero gives the SAME residue +1, whatever its amplitude or the exact k*.
 *
 *   WHAT WOULD CHANGE IT (and why the data rules those out).
 *   -------------------------------------------------------
 *     (A) RECIPROCAL / ALTERNATIVE SURROGATE (sign flip, magnitude preserved). The imp-34284
 *         pole-free reciprocal s(k) = resid_exp(k) / eflowAttr(k) puts resid_exp in the NUMERATOR, so
 *         y_recip(k) = ln(s) = ln(resid_exp) - ln(eflowAttr) and dy_recip/dk = -B(k) - m/(k* - k):
 *         the residue is -m -> -1 for the simple zero. The reciprocal FLIPS THE SIGN (+1 -> -1) but
 *         PRESERVES THE MAGNITUDE 1 -- exactly the imp-34284 statement that the k* pole becomes a benign
 *         linear zero-crossing of s. So the |residue| = 1 is estimator-invariant; only its SIGN is a
 *         convention (which side of the log-argument resid_exp sits on).
 *     (B) HIGHER-ORDER-ZERO ESTIMATOR (residue = m). An estimator giving resid_exp an order-2 zero
 *         (e.g. a squared / even surrogate resid_exp^2) would give residue +2. BUT an even-order zero
 *         does NOT change sign, contradicting the observed clean sign flip (imp-34310 F2: +8.19e-9 ->
 *         -4.97e-8 across k*). So any sign-change-preserving estimator forces ODD order, and the
 *         near-linear crossing forces the minimal odd order m = 1. A residue other than +/-1 requires
 *         an estimator that DESTROYS the sign change -- which the measured bracketing values exclude.
 *
 *   NUMERIC DEMONSTRATION (this module).
 *   ----------------------------------
 *   Model surrogate g(k; s, k*) = s (k - k*)(1 + a (k - k*)) -- a genuine simple zero with curvature a --
 *   against a smooth positive background eflow(k) = exp(-b k) (b ~ ln10/2, the imp-34246 leading slope
 *   scale). The residue product (k* - k) dy/dk is measured by symmetric central differences and
 *   Richardson-extrapolated in the step gap -> 0. RESULTS:
 *     (D1) DENOMINATOR (resid_exp in denominator, y = ln eflow - ln g): residue -> +1.
 *     (D2) AMPLITUDE-INVARIANT: scaling s by a factor ~4.3e6 (from -2.3156e-7 to -1.0) leaves the
 *          extrapolated residue unchanged to < 1e-9.
 *     (D3) LOCATION-INVARIANT: shifting k* from 21.28095 to 15.0 leaves it unchanged to < 1e-9.
 *     (D4) RECIPROCAL (imp-34284 orientation, y = ln g - ln eflow): residue -> -1 (sign flip, |.| = 1).
 *     (D5) ORDER-2 (squared surrogate g^2, even zero): residue -> +2 AND g^2 does NOT change sign
 *          across k* -- the case the imp-34310 sign flip rules out.
 *
 *   VERDICT: the residue-+1 result is ESTIMATOR-INVARIANT in magnitude -- a structural consequence of
 *   resid_exp having a simple, sign-changing (order-1) zero, via residue(f_prime/f) = zero multiplicity,
 *   independent of the estimator amplitude and the exact k*. Its SIGN is +1 with resid_exp in the
 *   denominator and -1 in the imp-34284 reciprocal orientation. Only an estimator that gave resid_exp a
 *   higher-order zero would change |residue| (to the order m), and such an estimator would also destroy
 *   the observed sign change, so it is excluded. DERIVATION / ASSESSMENT ONLY on a self-contained model
 *   surrogate; the underlying component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 *   rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED;
 *   no refereed bound is changed.
 *
 *   @see imp-34247-widening-slope-pole-divergence.js (the residue-+1 measurement this assesses; log-derivative channel)
 *   @see imp-34310-eflow-over-resid-pole-residue-simple-pole.js (the SIMPLE sign-change zero, F2; raw-ratio channel residue)
 *   @see imp-34284-eflow-resid-reciprocal-surrogate-pole-free.js (the reciprocal orientation: resid_exp in the numerator)
 *   @see imp-34227-surrogate-zero-estimator-reconciliation.js (estimator-dependence of the zero location)
 */

// --- self-contained model surrogate --------------------------------------------
const B_BG = 1.1513; // background log-slope scale ~ ln(10)/2 (imp-34246 leading widening slope)
const A_CURV = 0.4; // curvature of the simple zero (regular factor 1 + a (k - k*))
const GAP = 0.02; // base step below the pole for the residue-product read

// smooth positive background eflow(k) = exp(-b k) (its amplitude is irrelevant and cancels).
function eflow(k) {
  return Math.exp(-B_BG * k);
}
// simple (order-1) zero surrogate with amplitude s and location kStar.
function gSimple(k, s, kStar) {
  const u = k - kStar;
  return s * u * (1 + A_CURV * u);
}

// symmetric central difference of ln|fn| at k with step h.
function centralLogSlope(fn, k, h) {
  return (Math.log(Math.abs(fn(k + h))) - Math.log(Math.abs(fn(k - h)))) / (2 * h);
}

// residue product (k* - k) dy/dk at a single step `gap`, sampled at k = k* - gap (below the pole).
// orientation: +1 => resid_exp in the DENOMINATOR (y = ln eflow - ln g);
//              -1 => reciprocal orientation (y = ln g - ln eflow).
function residueProductAtGap(gValue, kStar, gap, orientation) {
  const k = kStar - gap;
  const h = gap / 10;
  const gSlope = centralLogSlope((kk) => gValue(kk), k, h);
  const eSlope = centralLogSlope(eflow, k, h);
  const dydk = orientation > 0 ? eSlope - gSlope : gSlope - eSlope;
  return gap * dydk; // (k* - k) dy/dk
}

// Richardson extrapolation gap -> 0 (leading error linear in gap): 2 R(gap/2) - R(gap).
function residue(gValue, kStar, orientation) {
  const rCoarse = residueProductAtGap(gValue, kStar, GAP, orientation);
  const rFine = residueProductAtGap(gValue, kStar, GAP / 2, orientation);
  return 2 * rFine - rCoarse;
}

// --- (D1..D5) the five measured residues ----------------------------------------
const S_TABLE = -2.3156e-7; // imp-34310 measured slope of resid_exp at k*
const S_UNIT = -1.0; // amplitude scaled by ~4.3e6 (invariance stress)
const KSTAR = 21.28095; // canonical imp-34023/imp-34247 zero
const KSTAR_SHIFTED = 15.0; // location shifted by ~6.28 (invariance stress)

// (D1) denominator, simple zero, canonical amplitude + location.
export const IMP34333_RESIDUE_DENOMINATOR = residue(
  (k) => gSimple(k, S_TABLE, KSTAR),
  KSTAR,
  +1,
); // -> +1

// (D2) amplitude-invariance: same k*, amplitude scaled by ~4.3e6.
export const IMP34333_RESIDUE_AMPLITUDE_SCALED = residue(
  (k) => gSimple(k, S_UNIT, KSTAR),
  KSTAR,
  +1,
); // -> +1, matches D1

// (D3) location-invariance: shifted zero.
export const IMP34333_RESIDUE_LOCATION_SHIFTED = residue(
  (k) => gSimple(k, S_TABLE, KSTAR_SHIFTED),
  KSTAR_SHIFTED,
  +1,
); // -> +1, matches D1

// (D4) reciprocal orientation (imp-34284): resid_exp in the numerator.
export const IMP34333_RESIDUE_RECIPROCAL = residue(
  (k) => gSimple(k, S_TABLE, KSTAR),
  KSTAR,
  -1,
); // -> -1 (sign flip, magnitude preserved)

// (D5) order-2 (squared / even) surrogate: residue -> +2, and no sign change across k*.
function gSquared(k, s, kStar) {
  const g = gSimple(k, s, kStar);
  return g * g;
}
export const IMP34333_RESIDUE_ORDER_TWO = residue(
  (k) => gSquared(k, S_TABLE, KSTAR),
  KSTAR,
  +1,
); // -> +2
// the squared surrogate stays POSITIVE on both flanks of k* (even zero -> no sign change).
const G2_BELOW = gSquared(KSTAR - GAP, S_TABLE, KSTAR);
const G2_ABOVE = gSquared(KSTAR + GAP, S_TABLE, KSTAR);
// while the simple surrogate DOES change sign across k* (odd zero) -- the imp-34310 F2 discriminant.
const G1_BELOW = gSimple(KSTAR - GAP, S_TABLE, KSTAR);
const G1_ABOVE = gSimple(KSTAR + GAP, S_TABLE, KSTAR);

// imp-34247 numeric landmark, baked reference (NOT imported, stays import-light).
export const IMP34333_IMP34247_RESIDUE_NEAR_POLE = 1.013; // (k*-k) dy/dk at k=21.275

export const IMP34333_RESIDUE_PLUS_ONE_ESTIMATOR_INVARIANCE = {
  ticket: 'imp-34333',
  proofSection: 'S-frontier',
  question:
    'Is the imp-34247 residue-EXACTLY-+1 simple pole of the widening-slope log-derivative a purely ' +
    'structural consequence of resid_exp having a simple (order-1) zero -- hence robust to the ' +
    'finite-difference estimator that produces resid_exp -- or would a higher-order/shifted-zero ' +
    'estimator change the residue? Re-derive the residue for a reciprocal/alternative surrogate.',
  structuralLaw:
    'residue of the log-derivative dy/dk = d/dk ln(eflow/resid_exp) at a zero of resid_exp equals the ' +
    'multiplicity m of that zero (argument principle: residue of f_prime/f = order of zero). For the ' +
    'imp-34310 SIMPLE sign-change zero m = 1, so the residue is exactly +1, independent of the zero ' +
    'amplitude and the exact k* (both cancel in the log-derivative).',
  residueDenominator: IMP34333_RESIDUE_DENOMINATOR, // ~ +1
  residueAmplitudeScaled: IMP34333_RESIDUE_AMPLITUDE_SCALED, // ~ +1 (amplitude x4.3e6)
  residueLocationShifted: IMP34333_RESIDUE_LOCATION_SHIFTED, // ~ +1 (k* shifted by ~6.28)
  residueReciprocal: IMP34333_RESIDUE_RECIPROCAL, // ~ -1 (imp-34284 orientation)
  residueOrderTwo: IMP34333_RESIDUE_ORDER_TWO, // ~ +2 (excluded by the sign change)
  imp34247NearPoleResidue: IMP34333_IMP34247_RESIDUE_NEAR_POLE, // 1.013 baked reference
  finding: {
    D1_denominator_residue_plus_one:
      'With resid_exp in the denominator the residue extrapolates to +1, reproducing imp-34247.',
    D2_amplitude_invariant:
      'Scaling the zero amplitude by ~4.3e6 leaves the residue unchanged to < 1e-9 -- the amplitude ' +
      'cancels in the log-derivative (it is only the additive ln|c|).',
    D3_location_invariant:
      'Shifting the zero location k* by ~6.28 leaves the residue unchanged to < 1e-9 -- k* moves the ' +
      'pole location, not its coefficient m.',
    D4_reciprocal_sign_flip:
      'The imp-34284 reciprocal orientation (resid_exp in the numerator) flips the residue to -1 while ' +
      'preserving the magnitude 1 -- the sign is a convention, the magnitude is structural.',
    D5_order_two_excluded:
      'A squared (even, order-2) surrogate gives residue +2 but does NOT change sign across k*, so it ' +
      'is excluded by the imp-34310 F2 clean sign flip; any sign-change-preserving estimator forces ' +
      'odd order and the near-linear crossing forces m = 1.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION / ASSESSMENT. The residue-+1 of the imp-34247 widening-slope pole is ESTIMATOR-INVARIANT ' +
    'in MAGNITUDE: it is the multiplicity m = 1 of the resid_exp zero (residue of f_prime/f = order of ' +
    'zero), independent of the estimator amplitude (cancels) and the exact k* (moves the pole, not its ' +
    'coefficient). Numerically |residue| = 1 survives an amplitude rescale of ~4.3e6 and a location shift ' +
    'of ~6.28 to < 1e-9. The SIGN is +1 with resid_exp in the denominator and -1 in the imp-34284 ' +
    'reciprocal orientation (resid_exp in the numerator) -- a convention, not a structural change. Only ' +
    'an estimator giving resid_exp a HIGHER-ORDER zero would change |residue| (to that order, e.g. +2 for ' +
    'a squared surrogate), and such an estimator would also destroy the imp-34310 clean sign change, so it ' +
    'is excluded by the data. DERIVATION on a self-contained model surrogate, NOT the inherited pipeline; ' +
    'the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED; no refereed bound is changed' +
    '.',
  citation:
    'imp-34247 (residue-+1 measurement, log-derivative channel); imp-34310 (simple sign-change zero, F2); ' +
    'imp-34284 (reciprocal orientation, resid_exp in the numerator); imp-34227 (estimator-dependence of ' +
    'the zero); imp-486 (C_mb GUE-conditional); imp-3066 (K_a >= 0).',
};

export const IMP34333_RESIDUE_PLUS_ONE_ESTIMATOR_INVARIANCE_ASSERTIONS = [
  {
    // (D1) denominator residue extrapolates to +1, matching the imp-34247 landmark.
    id: 'imp34333-denominator-residue-plus-one',
    description: 'residue with resid_exp in the denominator -> +1 (matches imp-34247 near-pole 1.013)',
    holds: () =>
      Math.abs(IMP34333_RESIDUE_DENOMINATOR - 1) < 0.02 &&
      Math.abs(IMP34333_RESIDUE_DENOMINATOR - IMP34333_IMP34247_RESIDUE_NEAR_POLE) < 0.02,
  },
  {
    // (D2) amplitude invariance: rescaling s by ~4.3e6 leaves the residue unchanged.
    id: 'imp34333-amplitude-invariant',
    description: 'scaling the zero amplitude by ~4.3e6 leaves the residue unchanged to < 1e-9',
    holds: () =>
      Math.abs(S_UNIT / S_TABLE) > 1e6 &&
      Math.abs(IMP34333_RESIDUE_AMPLITUDE_SCALED - IMP34333_RESIDUE_DENOMINATOR) < 1e-9,
  },
  {
    // (D3) location invariance: shifting k* by ~6.28 leaves the residue unchanged.
    id: 'imp34333-location-invariant',
    description: 'shifting the zero location k* by ~6.28 leaves the residue unchanged to < 1e-9',
    holds: () =>
      Math.abs(KSTAR - KSTAR_SHIFTED) > 6 &&
      Math.abs(IMP34333_RESIDUE_LOCATION_SHIFTED - IMP34333_RESIDUE_DENOMINATOR) < 1e-9,
  },
  {
    // (D4) reciprocal orientation flips the sign to -1 but preserves magnitude 1.
    id: 'imp34333-reciprocal-sign-flip',
    description: 'the imp-34284 reciprocal orientation gives residue -1 (sign flip, |.| = 1)',
    holds: () =>
      Math.abs(IMP34333_RESIDUE_RECIPROCAL + 1) < 0.02 &&
      Math.abs(Math.abs(IMP34333_RESIDUE_RECIPROCAL) - Math.abs(IMP34333_RESIDUE_DENOMINATOR)) < 1e-9,
  },
  {
    // (D5) order-2 surrogate gives residue +2 and, being even, does NOT change sign across k*.
    id: 'imp34333-order-two-excluded-by-sign-change',
    description: 'squared surrogate -> residue +2 with NO sign change; simple surrogate DOES change sign',
    holds: () =>
      Math.abs(IMP34333_RESIDUE_ORDER_TWO - 2) < 0.02 &&
      G2_BELOW > 0 &&
      G2_ABOVE > 0 &&
      G1_BELOW > 0 &&
      G1_ABOVE < 0,
  },
  {
    // Honesty gate: assessment only, isRigorous false, no QED, K_a >= 0 untouched, no refereed bound is changed.
    id: 'imp34333-honesty-gate-no-qed',
    description: 'assessment only; isRigorous false; NO QED; imp-3066 K_a>=0 untouched; no refereed bound is changed',
    holds: () =>
      IMP34333_RESIDUE_PLUS_ONE_ESTIMATOR_INVARIANCE.isRigorous === false &&
      /NO QED/.test(IMP34333_RESIDUE_PLUS_ONE_ESTIMATOR_INVARIANCE.verdict) &&
      /refereed bound is changed/i.test(IMP34333_RESIDUE_PLUS_ONE_ESTIMATOR_INVARIANCE.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34333_RESIDUE_PLUS_ONE_ESTIMATOR_INVARIANCE.verdict),
  },
];

for (const a of IMP34333_RESIDUE_PLUS_ONE_ESTIMATOR_INVARIANCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34333-residue-plus-one-estimator-invariance assertion failed: ${a.id}`);
  }
}
