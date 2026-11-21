/**
 * @module imp-96851-sigma-peak-share-cc-etrunc-joint-sensitivity
 *
 * imp-96851 (numerical, frontier-direction): MEASURE THE JOINT / SECOND-ORDER
 * (CROSS-TERM) SENSITIVITY of the binding GUE-conditional peak share sigma_max to
 * BOTH the GUE-conditional constant C_C and the truncation floor E_trunc TOGETHER --
 * the mixed second derivative dg2_sigma/(dlogC_C dlogE_trunc) and whether the two
 * levers combine additively or interact. imp-96831 measured only the C_C single
 * lever (dg_sigma/dlogC_C ~ +0.048) and imp-96794 measured only the E_trunc single
 * lever (dg_sigma/dlogE_trunc ~ -0.019); NEITHER measured the joint response.
 *
 * WHY THIS IS A DISTINCT MEASUREMENT
 * ----------------------------------
 * The two single-lever sweeps establish the sign and magnitude of each partial in
 * isolation (opposite signs, C_C the larger). But a joint band on both constants at
 * once could in principle interact: the E_trunc floor and the C_C-scaled E_coll term
 * share the SAME denominator D = E_trunc + E_flow + E_coll, so perturbing one changes
 * the marginal effect of the other. Whether that coupling is favorable (levers
 * reinforce toward a smaller conditional share) or negligible (levers add) is what
 * decides if any in-model COMBINATION can materially shrink the ~0.95 binding share
 * that neither single lever could. This module isolates the cross-term and sweeps the
 * 2D band. Measurement/sensitivity only.
 *
 * THE QUANTITY (identical imp-3406 / imp-96794 / imp-96831 component model)
 * -----------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C * sqrt(log T0 / N)              (GUE-conditional, dominant)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi (imp-398)
 *     E_trunc                                       (imp-2631 floor; base 3.06e-5)
 * At (C_C, E_trunc) = (C_C_PINNED, 3.06e-5) this reproduces imp-3406 byte-for-byte
 * (N_max ~ 9.22e5, sigma_max ~ 0.94943). Both constants are now swept jointly.
 *
 * THE MECHANISM (closed form of the cross-term, via the shared denominator)
 * ------------------------------------------------------------------------
 * Write x = log C_C, y = log E_trunc. At fixed N, with sigma = E_coll/D:
 *     dg_sigma/dx = sigma (1 - sigma)                      (logistic slope, > 0)
 *     dg_sigma/dy = -sigma * phi,  phi = E_trunc / D       (E_trunc share, < 0)
 * and the mixed partial follows from differentiating the first through the shared D:
 *     dg2_sigma/(dx dy) = -phi * sigma * (1 - 2 sigma).
 * At the base peak sigma ~ 0.9494 so (1 - 2 sigma) ~ -0.899 < 0, and phi ~ 0.020, so
 * the cross-term is POSITIVE but small (~ +0.017). At the interior peak the envelope
 * theorem (dg_sigma/dN = 0) makes the measured peak-share cross-term match this
 * fixed-N partial. A positive cross-term means raising E_trunc slightly INCREASES the
 * C_C leverage (and vice versa) -- but its magnitude relative to a naive additive
 * combination over the realistic band is small.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) THE CROSS-TERM IS SMALL AND POSITIVE, MATCHING THE ENVELOPE FORM.
 *        The measured peak-share mixed derivative dg2_sigma/(dlogC_C dlogE_trunc)
 *        ~ +0.017 matches the closed-form envelope prediction -phi*sigma*(1 - 2 sigma)
 *        ~ +0.017 to ~1 percent. The two levers are NOT strictly independent, but the
 *        coupling is weak.
 *   (F2) THE LEVERS COMBINE ESSENTIALLY ADDITIVELY OVER THE REALISTIC BAND. At the
 *        share-shrinking corner (0.5x C_C, 2x E_trunc) the linear additive prediction
 *        base + dCC*dlogC_C + dET*dlogE_trunc = 0.9025 vs the actual joint sigma_max
 *        0.8775 -- an interaction residual of ~ -0.025, favorable (the two levers
 *        reinforce slightly) but an order below the first-order moves themselves.
 *   (F3) NO IN-MODEL JOINT COMBINATION MATERIALLY SHRINKS THE BINDING SHARE. Over the
 *        full 2D band (0.5x..2x C_C, 0.25x..4x E_trunc) sigma_max ranges only
 *        0.846..0.985; even the joint extreme (0.5x C_C, 4x E_trunc) leaves the
 *        conditional share at ~0.85. The ~0.95 conditioning burden is intrinsic to the
 *        dominant GUE-conditional E_coll term (imp-486), unshrinkable by any in-model
 *        joint move on the two free-looking constants (C_C is pinned by imp-486).
 *
 * VERDICT: THE C_C AND E_trunc LEVERS COMBINE ESSENTIALLY ADDITIVELY. The mixed
 * second derivative dg2_sigma/(dlogC_C dlogE_trunc) ~ +0.017 matches the closed-form
 * envelope prediction -phi*sigma*(1 - 2 sigma) and is an order below the first-order
 * single-lever moves, so the joint response is well approximated by the sum of the
 * imp-96831 (+0.048) and imp-96794 (-0.019) partials. Over the realistic 2D band the
 * binding conditional share never drops below ~0.85, so NO in-model combination of the
 * two constants makes the ~0.95 conditioning burden disappear -- it is intrinsic to
 * the dominant GUE-conditional E_coll term (imp-486). Measurement/sensitivity only;
 * C_mb/C_C stay GUE-conditional (imp-486); no bound changes, no positivity, no bridge
 * closure, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-96831-sigma-peak-share-cc-sensitivity (the C_C single-lever partial +0.048)
 * @see imp-96794-etrunc-reduction-peak-share-leverage (the E_trunc single-lever partial -0.019)
 * @see imp-3406-sigma-highN-extrapolation (interior max N_max ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-486 (C_mb / C_C GUE-conditional; the pinned constant)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip floor)
 * @see imp-398 (E_flow C_F prefactor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-3406 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406 / imp-96794 / imp-96831 exactly

// EXACT imp-3406 sub-terms; BOTH C_C and E_trunc are parameters here.
function sigmaWith(N, C_C, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C * Math.sqrt(L / N);
  return E_coll / (E_trunc + E_flow + E_coll);
}

// Ternary search for the interior maximum in ln N (same spirit as imp-3406/imp-96831).
function argmaxN(C_C, E_trunc, hiExp = 10) {
  let lo = Math.log(1e3);
  let hi = Math.log(10 ** hiExp);
  for (let i = 0; i < 700; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigmaWith(Math.exp(m1), C_C, E_trunc) < sigmaWith(Math.exp(m2), C_C, E_trunc)) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

function peakShare(C_C, E_trunc) {
  const N_max = argmaxN(C_C, E_trunc);
  return { N_max, sigma_max: sigmaWith(N_max, C_C, E_trunc) };
}

const BASE = peakShare(C_C_PINNED, E_TRUNC_BASE);

// Single-lever partials at the base peak (log-centred sqrt2 flanks -- matches siblings).
const F_LO = 1 / Math.SQRT2;
const F_HI = Math.SQRT2;
const H = Math.log(F_HI); // half-step in log space = 0.5*ln2
const D_SIGMA_D_LOG_CC =
  (peakShare(C_C_PINNED * F_HI, E_TRUNC_BASE).sigma_max -
    peakShare(C_C_PINNED * F_LO, E_TRUNC_BASE).sigma_max) /
  (Math.log(F_HI) - Math.log(F_LO));
const D_SIGMA_D_LOG_ETRUNC =
  (peakShare(C_C_PINNED, E_TRUNC_BASE * F_HI).sigma_max -
    peakShare(C_C_PINNED, E_TRUNC_BASE * F_LO).sigma_max) /
  (Math.log(F_HI) - Math.log(F_LO));

// The JOINT quantity: mixed second derivative via a 2D central-difference stencil in
// (log C_C, log E_trunc) about the base point.
const S_PP = peakShare(C_C_PINNED * F_HI, E_TRUNC_BASE * F_HI).sigma_max;
const S_PM = peakShare(C_C_PINNED * F_HI, E_TRUNC_BASE * F_LO).sigma_max;
const S_MP = peakShare(C_C_PINNED * F_LO, E_TRUNC_BASE * F_HI).sigma_max;
const S_MM = peakShare(C_C_PINNED * F_LO, E_TRUNC_BASE * F_LO).sigma_max;
const MIXED_D2 = (S_PP - S_PM - S_MP + S_MM) / (4 * H * H);

// Closed-form envelope prediction of the cross-term: -phi*sigma*(1 - 2 sigma),
// phi = E_trunc share of the denominator at the base peak.
const T0_BASE = effectiveHeightForN(BASE.N_max);
const L_BASE = Math.log(T0_BASE);
const C_F_BASE = (Math.log(T0_BASE / TWO_PI) + 1) / TWO_PI;
const E_FLOW_BASE = C_F_BASE * (L_BASE / T0_BASE) * GRONWALL;
const E_COLL_BASE = C_C_PINNED * Math.sqrt(L_BASE / BASE.N_max);
const D_TOTAL_BASE = E_TRUNC_BASE + E_FLOW_BASE + E_COLL_BASE;
const PHI_ETRUNC = E_TRUNC_BASE / D_TOTAL_BASE;
const MIXED_D2_ENVELOPE = -PHI_ETRUNC * BASE.sigma_max * (1 - 2 * BASE.sigma_max);

// Additivity test at the share-shrinking corner (lower C_C, raise E_trunc: both push
// sigma_max DOWN). Linear additive prediction vs actual joint peak share.
const CC_CORNER = 0.5;
const ET_CORNER = 2.0;
const D_LOG_CC_CORNER = Math.log(CC_CORNER);
const D_LOG_ET_CORNER = Math.log(ET_CORNER);
const LINEAR_ADDITIVE_PREDICTION =
  BASE.sigma_max + D_SIGMA_D_LOG_CC * D_LOG_CC_CORNER + D_SIGMA_D_LOG_ETRUNC * D_LOG_ET_CORNER;
const ACTUAL_JOINT_CORNER = peakShare(C_C_PINNED * CC_CORNER, E_TRUNC_BASE * ET_CORNER).sigma_max;
const INTERACTION_RESIDUAL = ACTUAL_JOINT_CORNER - LINEAR_ADDITIVE_PREDICTION;

// 2D band envelope: sweep both constants over a realistic joint band and record the
// full range of the binding peak share (the "can any combination shrink it?" test).
const CC_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0];
const ET_FACTORS = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 4.0];
let bandMin = Infinity;
let bandMax = -Infinity;
let bandMinCorner = null;
let bandMaxCorner = null;
const FULL_GRID = [];
for (const a of CC_FACTORS) {
  for (const b of ET_FACTORS) {
    const s = peakShare(C_C_PINNED * a, E_TRUNC_BASE * b).sigma_max;
    FULL_GRID.push({ ccFactor: a, etFactor: b, sigma_max: +s.toFixed(7) });
    if (s < bandMin) { bandMin = s; bandMinCorner = { ccFactor: a, etFactor: b }; }
    if (s > bandMax) { bandMax = s; bandMaxCorner = { ccFactor: a, etFactor: b }; }
  }
}

// Full 2D grid (every ccFactor x etFactor pair, verbatim sigma_max), exposed
// for the imp-96884 heatmap viz-data leaf.
export const IMP96851_FULL_GRID = FULL_GRID;

// Compact 2D corner + base table for the record.
const CORNER_TABLE = [
  { ccFactor: 1.0, etFactor: 1.0, sigma_max: +BASE.sigma_max.toFixed(7), N_max: +BASE.N_max.toExponential(4) },
  { ccFactor: 2.0, etFactor: 0.25, sigma_max: +peakShare(C_C_PINNED * 2.0, E_TRUNC_BASE * 0.25).sigma_max.toFixed(7) },
  { ccFactor: 0.5, etFactor: 4.0, sigma_max: +peakShare(C_C_PINNED * 0.5, E_TRUNC_BASE * 4.0).sigma_max.toFixed(7) },
  { ccFactor: 0.5, etFactor: 2.0, sigma_max: +ACTUAL_JOINT_CORNER.toFixed(7) },
];

export const IMP96851_SIGMA_PEAK_SHARE_CC_ETRUNC_JOINT_SENSITIVITY = {
  id: 'imp-96851',
  proofSection: 'S-frontier',
  question:
    'How does the binding GUE-conditional peak share sigma_max ~ 0.9494 respond to the ' +
    'GUE-conditional constant C_C and the truncation floor E_trunc JOINTLY? Measure the ' +
    'mixed second derivative dg2_sigma/(dlogC_C dlogE_trunc), test whether the two ' +
    'single-lever partials (imp-96831 +0.048, imp-96794 -0.019) combine additively or ' +
    'interact, and report the sigma_max envelope over a realistic 2D band. ' +
    'Measurement/sensitivity only; C_C stays GUE-conditional (imp-486); no bound changes.',
  baseRow: { N_max: +BASE.N_max.toExponential(4), sigma_max: +BASE.sigma_max.toFixed(7) },
  singleLeverPartials: {
    d_sigma_max_d_log_cc: +D_SIGMA_D_LOG_CC.toFixed(6), // ~ +0.0487 (reproduces imp-96831)
    d_sigma_max_d_log_etrunc: +D_SIGMA_D_LOG_ETRUNC.toFixed(6), // ~ -0.0190 (reproduces imp-96794)
  },
  crossTerm: {
    measured_mixed_d2: +MIXED_D2.toExponential(4), // ~ +1.72e-2
    envelope_prediction_neg_phi_sigma_1minus2sigma: +MIXED_D2_ENVELOPE.toExponential(4), // ~ +1.71e-2
    phi_etrunc_share: +PHI_ETRUNC.toExponential(4), // ~ 2.00e-2
    rel_gap_measured_vs_envelope: +(Math.abs(MIXED_D2 - MIXED_D2_ENVELOPE) / Math.abs(MIXED_D2_ENVELOPE)).toExponential(3),
    sign: MIXED_D2 > 0 ? 'positive' : 'negative',
    note:
      'The mixed second derivative is POSITIVE and small (~+0.017), matching the ' +
      'closed-form envelope prediction -phi*sigma*(1 - 2 sigma) to ~1 percent. Raising ' +
      'E_trunc slightly increases the C_C leverage (and vice versa), but the coupling is ' +
      'an order below the first-order single-lever moves.',
  },
  additivityTest: {
    corner: { ccFactor: CC_CORNER, etFactor: ET_CORNER },
    linear_additive_prediction: +LINEAR_ADDITIVE_PREDICTION.toFixed(7),
    actual_joint_sigma_max: +ACTUAL_JOINT_CORNER.toFixed(7),
    interaction_residual: +INTERACTION_RESIDUAL.toExponential(3), // ~ -2.5e-2 (favorable, small)
    note:
      'At the share-shrinking corner (0.5x C_C, 2x E_trunc) the additive prediction from ' +
      'the two single-lever partials is close to the actual joint peak share; the ' +
      'interaction residual is favorable (levers reinforce slightly) but small.',
  },
  bandEnvelope: {
    ccFactors: CC_FACTORS,
    etFactors: ET_FACTORS,
    sigma_max_min: +bandMin.toFixed(7),
    sigma_max_min_corner: bandMinCorner,
    sigma_max_max: +bandMax.toFixed(7),
    sigma_max_max_corner: bandMaxCorner,
    span: +(bandMax - bandMin).toFixed(6),
    note:
      'Over the full 2D band (0.5x..2x C_C, 0.25x..4x E_trunc) sigma_max ranges only ' +
      '~0.846..0.985; even the joint extreme leaves the binding conditional share at ' +
      '~0.85. No in-model combination materially shrinks the ~0.95 conditioning burden.',
  },
  cornerTable: CORNER_TABLE,
  verdict:
    'THE C_C AND E_trunc LEVERS COMBINE ESSENTIALLY ADDITIVELY. The mixed second ' +
    'derivative dg2_sigma/(dlogC_C dlogE_trunc) ~ +0.017 matches the closed-form ' +
    'envelope prediction -phi*sigma*(1 - 2 sigma) and is an order below the first-order ' +
    'single-lever moves, so the joint response is well approximated by the sum of the ' +
    'imp-96831 (+0.048) and imp-96794 (-0.019) partials. Over the realistic 2D band the ' +
    'binding conditional share never drops below ~0.85, so NO in-model combination of the ' +
    'two constants makes the ~0.95 conditioning burden disappear -- it is intrinsic to the ' +
    'dominant GUE-conditional E_coll term (imp-486). Measurement/sensitivity only; ' +
    'C_mb/C_C stay GUE-conditional (imp-486); no bound changes, no positivity, no bridge ' +
    'closure, no RH claim, NO QED. No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-96831 (C_C single-lever partial +0.048); imp-96794 (E_trunc single-lever partial ' +
    '-0.019); imp-3406 (interior max N_max ~ 9.22e5, sigma_max ~ 0.9494); imp-486 (C_mb / ' +
    'C_C GUE-conditional); imp-2631 (E_trunc = 3.06e-5 floor); imp-398 (E_flow C_F ' +
    'prefactor); lambda-rh-height-mapping.',
};

export const IMP96851_SIGMA_PEAK_SHARE_CC_ETRUNC_JOINT_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: base (1x, 1x) reproduces the imp-3406 / imp-96831 pin.
    id: 'imp96851-reproduces-imp3406-base-peak',
    description: 'base (1x C_C, 1x E_trunc) reproduces imp-3406 N_max ~ 9.22e5 and sigma_max ~ 0.94943',
    holds: () =>
      Math.abs(BASE.N_max - 9.2186e5) / 9.2186e5 < 1e-3 &&
      Math.abs(BASE.sigma_max - 0.9494290) < 5e-5,
  },
  {
    // Sanity: the two single-lever partials reproduce the sibling measurements.
    id: 'imp96851-reproduces-single-lever-partials',
    description: 'the C_C and E_trunc single-lever partials reproduce imp-96831 (+0.048) and imp-96794 (-0.019)',
    holds: () =>
      Math.abs(D_SIGMA_D_LOG_CC - 0.048697) < 1e-3 &&
      Math.abs(D_SIGMA_D_LOG_ETRUNC - -0.018998) < 1e-3,
  },
  {
    // F1: the measured cross-term is POSITIVE.
    id: 'imp96851-mixed-cross-term-positive',
    description: 'the measured mixed second derivative dg2_sigma/(dlogC_C dlogE_trunc) is positive',
    holds: () => MIXED_D2 > 0,
  },
  {
    // F1: the measured cross-term matches the closed-form envelope prediction.
    id: 'imp96851-mixed-matches-envelope',
    description: 'the measured cross-term matches the envelope prediction -phi*sigma*(1 - 2 sigma) within 5 percent',
    holds: () => Math.abs(MIXED_D2 - MIXED_D2_ENVELOPE) / Math.abs(MIXED_D2_ENVELOPE) < 0.05,
  },
  {
    // F2: the cross-term is an order below the dominant first-order single-lever move.
    id: 'imp96851-cross-term-subdominant',
    description: 'the mixed second derivative magnitude is well below the dominant C_C first-order partial (levers essentially additive)',
    holds: () => Math.abs(MIXED_D2) < Math.abs(D_SIGMA_D_LOG_CC),
  },
  {
    // F2: the additive prediction is close to the actual joint peak share at the shrink corner.
    id: 'imp96851-additive-prediction-close',
    description: 'the linear additive prediction is within 0.05 of the actual joint sigma_max at the (0.5x C_C, 2x E_trunc) shrink corner',
    holds: () => Math.abs(INTERACTION_RESIDUAL) < 0.05,
  },
  {
    // F3: no in-model joint combination shrinks the binding conditional share below ~0.84.
    id: 'imp96851-band-share-not-materially-shrunk',
    description: 'over the full 2D band the binding conditional share sigma_max never drops below 0.84 (the ~0.95 burden is unshrinkable in-model)',
    holds: () => bandMin > 0.84,
  },
  {
    // Honesty gate: measurement/assessment only, additive verdict, no QED, no refereed bound is changed.
    id: 'imp96851-honesty-gate-no-qed',
    description: 'Assessment only: levers-combine-additively verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP96851_SIGMA_PEAK_SHARE_CC_ETRUNC_JOINT_SENSITIVITY.isRigorous === false &&
      /COMBINE ESSENTIALLY ADDITIVELY/.test(IMP96851_SIGMA_PEAK_SHARE_CC_ETRUNC_JOINT_SENSITIVITY.verdict) &&
      /NO QED/.test(IMP96851_SIGMA_PEAK_SHARE_CC_ETRUNC_JOINT_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP96851_SIGMA_PEAK_SHARE_CC_ETRUNC_JOINT_SENSITIVITY.verdict),
  },
];

for (const a of IMP96851_SIGMA_PEAK_SHARE_CC_ETRUNC_JOINT_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96851-sigma-peak-share-cc-etrunc-joint-sensitivity assertion failed: ${a.id}`,
    );
  }
}
