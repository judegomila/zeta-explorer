/**
 * @fileoverview imp-95600 — ASSESSMENT: does the imp-95516 interior margin hardening
 * (rho* = 1/50, delta_0 ~ 0.038723, quoted 4.01x) survive Sun's flagged Section 9
 * WRONG-SIGN B-squared correction?
 *
 * Context. imp-95516-sun-catalan-objective-verdict re-optimized Sun's free ratio
 * rho = S/B away from his fixed 1/20 to an interior optimum rho* = 1/50, reporting
 * delta_0 ~ 0.038723 (a ~4.01x hardening of the razor-thin rho=1/20 margin
 * delta_0 ~ 0.00966243). Its own attribution banner warns that Sun's Section 9
 * carries a WRONG-SIGN B-squared term, so the rho-optimization "hardens a broken
 * ledger". This module re-derives the margin under the sign correction and records
 * whether the interior positive-margin optimum, and the hardening, survive.
 *
 * The ledger (from imp-95516):
 *   delta_0(rho) = Lambda_mid(rho) + Delta_gtB(rho) - c_odd(rho) - (4 rho - 2 rho^2)
 *   Delta_gtB(rho) = (2/3) rho + (1/2) rho^2
 *   c_odd(rho)     = kappa rho^2,  kappa = 2.51069789
 *   Lambda_mid(1/20) = 0.1763558379286483  (validation gate)
 *
 * The correction. The (9.4) quadratic 4 rho - 2 rho^2 is where the B-squared term
 * enters (rho^2 = S^2 / B^2). A wrong-sign B-squared means the -2 rho^2 term should
 * have been +2 rho^2, i.e. the corrected coefficient is 4 rho + 2 rho^2. Subtracting
 * the larger term, the corrected margin is a pure quadratic downshift:
 *   delta_0_corr(rho) = delta_0(rho) - 4 rho^2.
 *
 * Local model. Lambda_mid(rho) is only published at rho=1/20, so delta_0(rho) is
 * modelled locally as the parabola pinned by the three reported facts:
 *   delta_0(1/50) = 0.038723 (optimum value), delta_0-prime(1/50) = 0 (stationarity),
 *   delta_0(1/20) = 0.00966243. This gives curvature A = -32.28952 and reproduces the
 *   ledger reconstruction of delta_0(1/20) exactly.
 *
 * FINDINGS under the sign correction:
 *  - Sun's LITERAL rho=1/20 margin flips NEGATIVE: delta_0_corr(1/20) = -0.00033757.
 *    The proof-as-written (fixed rho=1/20) fails once the B-squared sign is repaired.
 *  - The interior positive-margin optimum SURVIVES, shifting from rho*=1/50 to
 *    rho* ~ 0.017796 (~ 1/56), with delta_0_corr ~ 0.037299 — only ~3.68% below the
 *    uncorrected optimum value.
 *  - The "4.01x hardening" framing is DESTROYED as a ratio: its baseline (the rho=1/20
 *    margin) is now negative, so there is no positive quantity to be 4x hardened over.
 *    What the correction reveals instead is that the rho-optimization is now
 *    LOAD-BEARING, not cosmetic: it is the only thing rescuing a positive margin.
 *
 * VERDICT: the sign correction does not destroy the interior optimum (it barely moves
 * it and barely lowers its value), but it destroys the "hardens Sun by 4x" reading,
 * because Sun's own rho=1/20 margin goes negative under the correction. The optimized
 * margin ~0.0373 stands ONLY as a conditional statement about the corrected ledger,
 * and ONLY if the imp-95516 sub-gap (the uncertified S2-S5 determinant/rank core and
 * the raw quadratic coefficient of (9.4)) is sound. This is an assessment atop a
 * LOCAL parabolic model of an unpublished Lambda_mid(rho) and one interpretation of
 * "wrong-sign B-squared" (namely -2 rho^2 to +2 rho^2); it is neither a re-derivation
 * of Sun's Section 9 from primary source nor a certification of it.
 *
 * Catalan constant G irrationality remains OPEN; Sun arXiv:2609.04176 single-author
 * and unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.
 *
 * NO heavy imports. All figures baked as literals / recomputed from the ledger.
 */

const KAPPA = 2.51069789;
const LAMBDA_MID_AT_1_OVER_20 = 0.1763558379286483;

// Known (rho-explicit) part of the ORIGINAL ledger: Delta_gtB - c_odd - (4rho - 2rho^2).
function knownPartOriginal(rho) {
  const deltaB = (2 / 3) * rho + (1 / 2) * rho * rho;
  const cOdd = KAPPA * rho * rho;
  return deltaB - cOdd - (4 * rho - 2 * rho * rho);
}

// Local parabola model of delta_0(rho), pinned at the imp-95516 optimum + the gate.
const RHO_OPT_ORIG = 1 / 50; // 0.02
const D0_OPT_ORIG = 0.038723;
const D0_AT_1_OVER_20 = 0.00966243;
const PARABOLA_A =
  (D0_AT_1_OVER_20 - D0_OPT_ORIG) / Math.pow(1 / 20 - RHO_OPT_ORIG, 2); // ~ -32.28952

function delta0Model(rho) {
  return PARABOLA_A * Math.pow(rho - RHO_OPT_ORIG, 2) + D0_OPT_ORIG;
}

// Corrected margin = original minus an extra 4 rho^2 (the -2rho^2 term becomes +2rho^2).
function delta0Corrected(rho) {
  return delta0Model(rho) - 4 * rho * rho;
}

// Corrected optimum: d/drho [ A (rho - rho_opt)^2 + D0_opt - 4 rho^2 ] = 0.
const RHO_STAR_CORRECTED = (2 * PARABOLA_A * RHO_OPT_ORIG) / (2 * PARABOLA_A - 8);
const D0_CORRECTED_OPT = delta0Corrected(RHO_STAR_CORRECTED);

export const SUN_S9_SIGNFIX_RHO_MARGIN_ASSESSMENT = Object.freeze({
  id: 'imp-95600-sun-s9-signfix-rho-margin-assessment',
  title:
    'Assessment: does the rho*=1/50 delta_0~0.038723 hardening survive Sun Section 9 wrong-sign B-squared correction?',
  status:
    'ASSESSMENT — interior optimum SURVIVES (rho*~1/56, delta_0~0.03730, -3.68%); '
    + '"4.01x hardening" DESTROYED (Sun literal rho=1/20 margin goes NEGATIVE); '
    + 'model-based; G irrationality OPEN; Sun unrefereed; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  correctionInterpretation:
    'wrong-sign B-squared = the (9.4) quadratic 4rho - 2rho^2 should read 4rho + 2rho^2; '
    + 'equivalently delta_0_corr(rho) = delta_0(rho) - 4 rho^2.',
  kappa: KAPPA,
  lambdaMidAt_1over20: LAMBDA_MID_AT_1_OVER_20,
  parabolaCurvatureA: PARABOLA_A,

  original: {
    rhoStar: '1/50',
    d0_at_optimum: D0_OPT_ORIG,
    d0_at_1over20: D0_AT_1_OVER_20,
    quotedHardening: '4.01x (0.038723 / 0.00966243)',
  },

  corrected: {
    d0_at_1over20: delta0Corrected(1 / 20), // ~ -0.00033757 (NEGATIVE)
    d0_at_1over50: delta0Corrected(1 / 50), // ~ 0.037123 (still positive)
    rhoStar: RHO_STAR_CORRECTED, // ~ 0.017796 (~ 1/56)
    d0_at_optimum: D0_CORRECTED_OPT, // ~ 0.037299
    optimumReductionPct: ((D0_OPT_ORIG - D0_CORRECTED_OPT) / D0_OPT_ORIG) * 100, // ~ 3.68%
  },

  verdict:
    'The interior positive-margin optimum is robust to the sign correction: it moves '
    + 'only from rho*=1/50 to rho*~1/56 and its value drops only ~3.68% to ~0.0373. But '
    + 'the "4.01x hardening of Sun" reading is destroyed: under the correction Sun literal '
    + 'rho=1/20 margin is NEGATIVE (-0.00034), so there is no positive baseline to harden. '
    + 'The rho-optimization is thereby reclassified from cosmetic to LOAD-BEARING — it is '
    + 'the only thing keeping the corrected ledger positive at all.',

  caveats:
    'LOCAL parabolic model of an unpublished Lambda_mid(rho) (pinned at the gate + the '
    + 'imp-95516 optimum), and ONE reading of "wrong-sign B-squared" (-2rho^2 to +2rho^2). '
    + 'Not a primary-source re-derivation of Section 9 nor a certification of it. The '
    + 'imp-95516 sub-gap (uncertified S2-S5 determinant/rank core and the raw (9.4) '
    + 'coefficient) is untouched; Catalan G irrationality OPEN; NO Lambda movement.',
});

export const SUN_S9_SIGNFIX_RHO_MARGIN_ASSERTIONS = Object.freeze([
  {
    name: 'original ledger self-consistent: delta_0(1/20) reconstructs to 0.00966243',
    holds: () =>
      Math.abs((LAMBDA_MID_AT_1_OVER_20 + knownPartOriginal(1 / 20)) - D0_AT_1_OVER_20) < 1e-6,
  },
  {
    name: 'sign correction flips Sun literal rho=1/20 margin NEGATIVE',
    holds: () => delta0Corrected(1 / 20) < 0 && Math.abs(delta0Corrected(1 / 20) + 0.00033757) < 1e-6,
  },
  {
    name: 'interior optimum survives near rho*~1/56 (0.0178) inside (0, 0.02)',
    holds: () => RHO_STAR_CORRECTED > 0.017 && RHO_STAR_CORRECTED < 0.02,
  },
  {
    name: 'corrected optimum margin ~0.0373 stays positive, ~3.68% below uncorrected',
    holds: () => {
      const c = SUN_S9_SIGNFIX_RHO_MARGIN_ASSESSMENT.corrected;
      return c.d0_at_optimum > 0.037 && c.d0_at_optimum < 0.038
        && Math.abs(c.optimumReductionPct - 3.68) < 0.1;
    },
  },
  {
    name: 'honest: assessment only, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () => /G irrationality OPEN/.test(SUN_S9_SIGNFIX_RHO_MARGIN_ASSESSMENT.status)
      && /refereed bound is changed/i.test(SUN_S9_SIGNFIX_RHO_MARGIN_ASSESSMENT.status)
      && /NO QED/.test(SUN_S9_SIGNFIX_RHO_MARGIN_ASSESSMENT.status),
  },
]);

export default SUN_S9_SIGNFIX_RHO_MARGIN_ASSESSMENT;
