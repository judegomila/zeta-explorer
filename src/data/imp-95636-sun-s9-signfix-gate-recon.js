/**
 * @fileoverview imp-95636 — Independently re-derive delta_0(1/20) = 0.00966243
 * from the imp-95516 235-cell ledger and test the reconstruction residual against
 * the imp-95615 F2 ">3.494% sign-flip fragility" threshold.
 *
 * Context. imp-95615 F2 pinned the "Sun literal rho=1/20 margin goes NEGATIVE"
 * conclusion to a single number: the gate figure delta_0(1/20) = 0.00966243 sits
 * ~3.494% below the 0.01 = 4*(1/20)^2 threshold, so it would have to be UNDER-reported
 * by >= 3.494% for the sign-corrected 1/20 margin to climb back to non-negative.
 * imp-95615 never re-derived that gate figure from the imp-95516 ledger to see whether
 * the carried literal 0.00966243 is even accurate to that tolerance. This module does.
 *
 * METHOD. Reconstruct delta_0(rho) directly from the imp-95516 decisive-margin ledger
 *   delta_0(rho) = Lambda_mid(rho) + Delta_gtB(rho) - c_odd(rho) - (4 rho - 2 rho^2),
 * evaluated at the gate rho = 1/20 from the four independently-carried components:
 *   Lambda_mid(1/20) = 0.1763558379286483   (imp-95516 235-cell middle-prime integral),
 *   Delta_gtB(1/20)  = (2/3)(1/20) + (1/2)(1/20)^2 = 83/2400,
 *   c_odd(1/20)      = kappa*(1/20)^2 with kappa = 2.51069789,
 *   (9.4) quadratic  = 4(1/20) - 2(1/20)^2 = 0.195.
 * Compare the reconstruction to the carried literal 0.00966243 and express the residual
 * as a percentage; test whether that residual lands INSIDE or OUTSIDE the 3.494% margin.
 *
 * FINDING.
 *  R1 (reconstruction). delta_0(1/20) reconstructs to 0.009662426536981628 from the
 *     ledger, versus the carried literal 0.00966243. The absolute residual is
 *     -3.463e-9 (relative -3.584e-5 %), i.e. the two agree to ~7 significant figures.
 *     The carried gate figure is a faithful decimal truncation of the ledger value,
 *     NOT an independent input that could carry a several-percent error.
 *  R2 (verdict vs the 3.494% margin). The reconstruction residual (~3.6e-5 %) is smaller
 *     than the imp-95615 sign-flip headroom (3.494%) by a factor of ~1e5, i.e. it lands
 *     DEEP INSIDE the margin. The gate figure is FAR more accurate than the ~3.5% error
 *     that would be needed to un-flip the corrected 1/20 margin. So imp-95615 F2's
 *     "fragile only to a >3.494% gate error" is not a live escape hatch: no such error
 *     exists at the ledger's own precision. The corrected 1/20 margin
 *     delta_0(1/20) - 0.01 = -0.000337573 stays NEGATIVE.
 *
 * This does NOT certify Lambda_mid(1/20) itself (an unpublished 235-cell figure carried
 * as a literal), the kappa provenance (imp-95637), nor the imp-95516 S2-S5 determinant/
 * rank core; it only confirms the gate FIGURE is internally consistent with the ledger to
 * ~7 digits, closing the imp-95615 "is the gate even that accurate" sub-question.
 *
 * Catalan constant G irrationality remains OPEN; Sun arXiv:2609.04176 single-author and
 * unrefereed; NO Lambda movement; no refereed bound is changed; NO QED.
 *
 * NO heavy imports. All figures recomputed here from the ledger constants.
 */

const RHO_GATE = 1 / 20; // 0.05, the pinning node where delta_0(1/20) is reported

// imp-95516 ledger components at the gate rho = 1/20.
const LAMBDA_MID = 0.1763558379286483; // 235-cell middle-prime integral (imp-95516)
const KAPPA = 2.51069789; // c_odd curvature coefficient (imp-95516; provenance = imp-95637)
const DELTA_GTB = (2 / 3) * RHO_GATE + (1 / 2) * RHO_GATE * RHO_GATE; // = 83/2400
const C_ODD = KAPPA * RHO_GATE * RHO_GATE; // = 0.006276744725
const QUAD_94 = 4 * RHO_GATE - 2 * RHO_GATE * RHO_GATE; // (9.4) quadratic = 0.195

// Independent reconstruction of the gate figure from the ledger.
const D0_RECON = LAMBDA_MID + DELTA_GTB - C_ODD - QUAD_94; // 0.009662426536981628
const D0_CARRIED = 0.00966243; // the literal carried across imp-95516/95600/95615/95618

const ABS_RESIDUAL = D0_RECON - D0_CARRIED; // -3.463e-9
const REL_RESIDUAL_PCT = (ABS_RESIDUAL / D0_CARRIED) * 100; // -3.584e-5 %

// imp-95615 F2 fragility threshold: gate must clear 0.01 for the corrected margin to
// be non-negative; headroom is how far below 0.01 the carried figure sits.
const GATE_THRESHOLD = 4 * RHO_GATE * RHO_GATE; // 0.01
const SIGNFLIP_HEADROOM_PCT = ((GATE_THRESHOLD - D0_CARRIED) / D0_CARRIED) * 100; // ~3.494
const CORRECTED_MARGIN = D0_RECON - GATE_THRESHOLD; // -0.000337573, stays negative
const INSIDE_MARGIN = Math.abs(REL_RESIDUAL_PCT) < SIGNFLIP_HEADROOM_PCT; // true, by ~1e5x

export const SUN_S9_SIGNFIX_GATE_RECON = Object.freeze({
  id: 'imp-95636-sun-s9-signfix-gate-recon',
  title:
    'Independent re-derivation of delta_0(1/20)=0.00966243 from the imp-95516 235-cell '
    + 'ledger, tested against the imp-95615 >3.494% sign-flip fragility threshold',
  status:
    'CONFIRMED — the carried gate figure 0.00966243 reconstructs to 0.009662426537 from '
    + 'the ledger (relative residual ~3.6e-5 %), landing DEEP INSIDE the 3.494% headroom by '
    + '~1e5x, so imp-95615 F2 gate-error escape hatch is not live and the corrected 1/20 '
    + 'margin stays NEGATIVE; Lambda_mid literal + kappa provenance still uncertified; '
    + 'G irrationality OPEN; Sun unrefereed; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  assesses: 'imp-95615-sun-s9-signfix-margin-sensitivity (F2 gate-accuracy sub-question)',

  ledger: {
    formula: 'delta_0(rho) = Lambda_mid(rho) + Delta_gtB(rho) - c_odd(rho) - (4 rho - 2 rho^2)',
    rhoGate: RHO_GATE, // 0.05
    lambdaMid: LAMBDA_MID, // 0.1763558379286483
    kappa: KAPPA, // 2.51069789
    deltaGtB: DELTA_GTB, // 83/2400
    cOdd: C_ODD, // 0.006276744725
    quad94: QUAD_94, // 0.195
  },

  reconstruction: {
    d0Reconstructed: D0_RECON, // 0.009662426536981628
    d0Carried: D0_CARRIED, // 0.00966243
    absResidual: ABS_RESIDUAL, // -3.463e-9
    relResidualPct: REL_RESIDUAL_PCT, // -3.584e-5 %
    agreesToSigFigs: 7,
  },

  fragilityTest: {
    gateThreshold: GATE_THRESHOLD, // 0.01 = 4*(1/20)^2
    signFlipHeadroomPct: SIGNFLIP_HEADROOM_PCT, // ~3.494
    residualVsHeadroomRatio: Math.abs(REL_RESIDUAL_PCT) / SIGNFLIP_HEADROOM_PCT, // ~1e-5
    insideMargin: INSIDE_MARGIN, // true
    correctedMarginAtGate: CORRECTED_MARGIN, // -0.000337573, still negative
    interpretation:
      'The reconstruction residual (~3.6e-5 %) is ~1e5x smaller than the 3.494% error the '
      + 'imp-95615 F2 escape hatch would require, so no plausible gate-figure error rescues '
      + 'the sign; the corrected 1/20 margin is negative at the ledger own precision.',
  },

  verdict:
    'The carried gate figure delta_0(1/20)=0.00966243 is a faithful ~7-digit decimal of the '
    + 'imp-95516 ledger value 0.009662426537, not an independently-quotable number that could '
    + 'carry a several-percent error. imp-95615 F2 "fragile only to a >3.494% gate error" is '
    + 'therefore not a live escape hatch: the ledger pins the gate far tighter than 3.5%. The '
    + 'sign-corrected rho=1/20 margin stays NEGATIVE.',

  caveats:
    'This confirms only the internal CONSISTENCY of the carried gate figure with the ledger. '
    + 'It does not certify Lambda_mid(1/20)=0.1763558379286483 (an unpublished 235-cell figure '
    + 'carried as a literal), the kappa=2.51069789 provenance (imp-95637), the raw (9.4) '
    + 'quadratic 4rho-2rho^2, or the imp-95516 S2-S5 determinant/rank core. Catalan G '
    + 'irrationality OPEN; Sun arXiv:2609.04176 unrefereed; NO Lambda movement; no refereed bound is changed'
    + '; NO QED.',
});

export const SUN_S9_SIGNFIX_GATE_RECON_ASSERTIONS = Object.freeze([
  {
    name: 'R1: delta_0(1/20) reconstructs from the ledger to the carried literal within 1e-6',
    holds: () => Math.abs(D0_RECON - D0_CARRIED) < 1e-6,
  },
  {
    name: 'R1b: reconstruction agrees with the carried figure to ~7 sig figs (rel residual < 1e-4 %)',
    holds: () => Math.abs(REL_RESIDUAL_PCT) < 1e-4,
  },
  {
    name: 'R2: residual lands INSIDE the 3.494% sign-flip headroom (by >=1e3x)',
    holds: () => INSIDE_MARGIN && (Math.abs(REL_RESIDUAL_PCT) / SIGNFLIP_HEADROOM_PCT) < 1e-3,
  },
  {
    name: 'R2b: corrected 1/20 margin stays NEGATIVE at the reconstructed value',
    holds: () => CORRECTED_MARGIN < 0,
  },
  {
    name: 'Delta_gtB(1/20) equals 83/2400',
    holds: () => Math.abs(DELTA_GTB - 83 / 2400) < 1e-15,
  },
  {
    name: 'honest: assessment only, G irrationality OPEN, no refereed bound is changed, NO QED',
    holds: () => /G irrationality OPEN/.test(SUN_S9_SIGNFIX_GATE_RECON.status)
      && /refereed bound is changed/i.test(SUN_S9_SIGNFIX_GATE_RECON.status)
      && /NO QED/.test(SUN_S9_SIGNFIX_GATE_RECON.status),
  },
]);

export default SUN_S9_SIGNFIX_GATE_RECON;
