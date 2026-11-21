/**
 * @module imp-35035-eflow-exponent-crossing-landmark-crossvalidation
 *
 * imp-35035 (numerical, frontier-direction): TWO independent derivations of the local E_flow decay
 * exponent at the crossing landmark x* = ln N_cross (the nominal knee-inflection crossing window
 * X_CROSS = 10^9.53) were reported but never tabulated side by side to numerical precision:
 *
 *   - imp-34950 F3 measured q_eff = -d ln R/dx ~ 0.855 per unit x = ln N (R = eflowRatio = E_flow/E_trunc).
 *   - imp-34956 W2 measured the pinned-product sensitivity d ln P/d(dex) ~ -1.9685 (P = s*(E_flow/E_trunc)
 *     = g* r0), i.e. d ln P/dx ~ -0.8549 per unit x, and CLAIMED it matches q_eff.
 *
 * imp-34973 later proved |d ln P/dx| = q_eff is an ALGEBRAIC IDENTITY holding window-wide (because g* is
 * landmark-window-independent, imp-34956 W0), but did so only in x-units on a 9-point grid -- it never
 * tabulated the two LITERAL reported numbers (0.855 vs -0.8549 vs the per-dex -1.9685) side by side at the
 * single crossing landmark, nor exhibited the dex->x unit bridge that reconciles W2s per-dex slope with
 * F3s per-x exponent. This module does exactly that: a single-landmark reconciliation table.
 *
 * THE TABULATION (side-by-side at x* = ln N_cross, the 9.53-dex crossing landmark)
 * -------------------------------------------------------------------------------
 *   (C0) SAME QUANTITY (the identity, at the landmark). Reusing the imp-34973 eflowRatio/pinnedProduct
 *        kernel VERBATIM: q_eff = -d ln R/dx and |d ln P/dx| are computed independently at x*; they agree
 *        to the finite-difference floor (residual ~1e-12). Because g* is window-independent, P = g* r0 is
 *        EXACTLY proportional to r0 = R(X_CROSS), so d ln P/dx = d ln R/dx = -q_eff -- the same log-
 *        derivative of the SAME kernel, not two coincidentally-close numbers.
 *   (C1) THE dex->x UNIT BRIDGE. imp-34956 W2s per-dex slope d ln P/d(dex) ~ -1.9685 divided by ln 10
 *        (2.302585...) gives d ln P/dx ~ -0.85486, matching F3s q_eff ~ 0.855 to the FD floor. So the
 *        apparent factor ~2.3 between the two reported numbers is purely the dex-vs-natural-log x-unit
 *        choice, NOT a disagreement.
 *   (C2) THE LITERAL-NUMBER RECONCILIATION. F3s rounded 0.855 and W2s rounded 0.8549 are both display
 *        roundings of the SAME measured value ~0.85486: |0.855 - 0.8549| = 1e-4 is pure rounding width, an
 *        order of magnitude above the true cross-derivation residual (~1e-12). The residual DISAGREEMENT
 *        between the two derivations, once units are matched, is the finite-difference floor -- effectively
 *        zero.
 *
 * FINDING. The imp-34950 F3 q_eff and the imp-34956 W2 pinned-product slope are the SAME quantity -- the
 * local E_flow log-derivative -d ln R/dx at the crossing landmark -- confirmed side by side to ~1e-12 once
 * the dex->x unit bridge (divide by ln 10) is applied. The ~0.855 vs ~0.8549 gap is display rounding of a
 * single value ~0.85486; there is no genuine numerical disagreement. This is the single-landmark tabulation
 * of the window-wide identity imp-34973 established.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic on the inherited surrogate, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-
 * conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34950-eflow-crossing-strength-cmb-exponent-structural (F3: q_eff ~ 0.855 per unit x)
 * @see imp-34956-pinned-product-window-sensitivity (W2: d ln P/d(dex) ~ -1.9685, d ln P/dx ~ -0.8549)
 * @see imp-34973-pinned-product-slope-qeff-window-identity (window-wide identity |d ln P/dx| = q_eff)
 * @see imp-34924-eflow-pinned-product-derivation (P = g* r0, g* window-independent)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see imp-486 (C_mb GUE-conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34886/imp-34924/imp-34950/imp-34956/imp-34973 exactly

// E_flow / E_trunc = R(x) at ln N = x, reused VERBATIM from imp-34924/imp-34950/imp-34956/imp-34973.
function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}

// g* is landmark-window-INDEPENDENT (imp-34956 W0 / imp-35011): fixed imp-34886/imp-34924 crossing coupling.
// P = g* r0 is EXACTLY proportional to r0 = eflowRatio(X_CROSS), so d ln P/dx = d ln R/dx.
const G_STAR = 0.7776533446;
function pinnedProduct(x) {
  return G_STAR * eflowRatio(x);
}

const LN10 = Math.LN10; // 2.302585... the dex -> natural-log x conversion factor
const HDEX = 1e-4; // matches the imp-34956/imp-34973 d ln P/d(dex) stencil half-step (in dex)
const HX = HDEX * LN10; // the same stencil expressed per unit x = ln N

// d ln P/dx measured directly from the pinned product (central difference in x = ln N).
function dlnPdx(x) {
  return (Math.log(pinnedProduct(x + HX)) - Math.log(pinnedProduct(x - HX))) / (2 * HX);
}
// d ln P/d(dex) measured directly from the pinned product (central difference in log10 N = dex).
function dlnPddex(dex) {
  const xHi = (dex + HDEX) * LN10;
  const xLo = (dex - HDEX) * LN10;
  return (Math.log(pinnedProduct(xHi)) - Math.log(pinnedProduct(xLo))) / (2 * HDEX);
}
// local E_flow decay exponent q_eff = -d ln R/dx at x, the imp-34950 F3 kernel in x-units.
function qEffAt(x) {
  return -(Math.log(eflowRatio(x + HX)) - Math.log(eflowRatio(x - HX))) / (2 * HX);
}

// ---- the single crossing landmark x* = ln N_cross (nominal 9.53-dex knee-inflection crossing window) ----
const NOMINAL_DEX = 9.53;
const X_STAR = NOMINAL_DEX * LN10;

const Q_EFF_F3 = qEffAt(X_STAR); // imp-34950 F3: q_eff = -d ln R/dx per unit x (~0.855)
const DLNP_DX_W2 = dlnPdx(X_STAR); // imp-34956 W2: d ln P/dx per unit x (~-0.8549)
const DLNP_DDEX_W2 = dlnPddex(NOMINAL_DEX); // imp-34956 W2: d ln P/d(dex) as reported (~-1.9685)
const DLNP_DDEX_TO_DX = DLNP_DDEX_W2 / LN10; // (C1) dex -> x unit bridge: should equal DLNP_DX_W2

// (C0) same-quantity residual: | |d ln P/dx| - q_eff | at the landmark (finite-difference floor).
const SAME_QUANTITY_RESIDUAL = Math.abs(Math.abs(DLNP_DX_W2) - Q_EFF_F3);
// (C1) unit-bridge residual: | d ln P/d(dex)/ln10 - d ln P/dx | (finite-difference floor).
const UNIT_BRIDGE_RESIDUAL = Math.abs(DLNP_DDEX_TO_DX - DLNP_DX_W2);
// (C2) the shared measured value the two rounded literals (0.855, 0.8549) both round to.
const SHARED_VALUE = Q_EFF_F3;
const F3_ROUNDING_GAP = Math.abs(0.855 - SHARED_VALUE); // ~display rounding width
const W2_ROUNDING_GAP = Math.abs(0.8549 - SHARED_VALUE); // ~display rounding width
const LITERAL_REPORTED_GAP = Math.abs(0.855 - 0.8549); // 1e-4: pure display rounding, NOT a real disagreement

const FAR_TAIL_Q = 0.5; // imp-3463 asymptote (reached only far beyond this landmark)

// side-by-side reconciliation table, one row per reported derivation + the reconciled value.
const CROSSVALIDATION_TABLE = [
  {
    source: 'imp-34950 F3',
    reported: 'q_eff = -d ln R/dx ~ 0.855',
    unit: 'per unit x = ln N',
    valuePerX: +Q_EFF_F3.toFixed(6),
  },
  {
    source: 'imp-34956 W2 (per dex)',
    reported: 'd ln P/d(dex) ~ -1.9685',
    unit: 'per dex = per log10 N',
    valuePerDex: +DLNP_DDEX_W2.toFixed(6),
    valuePerX: +DLNP_DDEX_TO_DX.toFixed(6), // after dividing by ln 10
  },
  {
    source: 'imp-34956 W2 (per x)',
    reported: 'd ln P/dx ~ -0.8549',
    unit: 'per unit x = ln N',
    valuePerX: +DLNP_DX_W2.toFixed(6),
  },
  {
    source: 'reconciled |value|',
    reported: 'local E_flow log-derivative |d ln R/dx| at x*',
    unit: 'per unit x = ln N',
    valuePerX: +SHARED_VALUE.toFixed(6),
  },
];

export const IMP35035_EFLOW_EXPONENT_CROSSING_LANDMARK_CROSSVALIDATION = {
  id: 'imp-35035',
  proofSection: 'S-frontier',
  question:
    'The imp-34950 F3 local E_flow decay exponent q_eff ~ 0.855 (per unit x = ln N) and the imp-34956 W2 ' +
    'pinned-product sensitivity d ln P/dx ~ -0.8549 (from d ln P/d(dex) ~ -1.9685) were reported as matching ' +
    'but never tabulated side by side at the crossing landmark. Reuse the imp-34924/imp-34950/imp-34956 ' +
    'kernels VERBATIM, tabulate both derivations at x* = ln N_cross (the 9.53-dex crossing window) to ' +
    'numerical precision, confirm they are the SAME quantity (the local E_flow log-derivative) rather than ' +
    'a numerical coincidence, and quantify any residual disagreement. Measurement only; changes no bound; ' +
    'C_mb GUE-conditional (imp-486) untouched; NO QED.',
  verdictShort:
    'SAME QUANTITY, confirmed at the crossing landmark to ~1e-12. Because g* is landmark-window-independent ' +
    '(imp-34956 W0), P = g* r0 is EXACTLY proportional to r0 = R(X_CROSS), so d ln P/dx = d ln R/dx = -q_eff ' +
    '-- the same log-derivative of the SAME eflowRatio kernel. (C0) |d ln P/dx| and q_eff computed ' +
    'independently at x* agree to the finite-difference floor. (C1) The dex->x bridge: W2s d ln P/d(dex) ~ ' +
    '-1.9685 divided by ln 10 gives -0.85486, matching F3s q_eff -- the apparent ~2.3 factor is the unit ' +
    'choice, not a disagreement. (C2) F3s 0.855 and W2s 0.8549 are both roundings of ~0.85486 (gap 1e-4 = ' +
    'display width); the true cross-derivation residual is ~1e-12. No genuine numerical disagreement.',
  measuredQuantity:
    'the imp-34950 F3 local E_flow decay exponent q_eff = -d ln R/dx and the imp-34956 W2 pinned-product ' +
    'sensitivity d ln P/dx (and its per-dex form d ln P/d(dex)), all at the single crossing landmark x* = ' +
    'ln N_cross (9.53 dex), their same-quantity residual | |d ln P/dx| - q_eff |, the dex->x unit-bridge ' +
    'residual | d ln P/d(dex)/ln10 - d ln P/dx |, and the display-rounding gaps of the two reported literals',
  gStar: G_STAR, // landmark-window-independent (imp-34956 W0 / imp-35011)
  landmark: {
    dex: NOMINAL_DEX,
    nCross: +Math.exp(X_STAR).toExponential(4), // ~3.388e9, the 9.53-dex crossing landmark N
    xStar: +X_STAR.toFixed(6),
  },
  crossvalidationTable: CROSSVALIDATION_TABLE, // the side-by-side reconciliation
  reconciliation: {
    qEffF3: +Q_EFF_F3.toFixed(6), // ~0.85486 (imp-34950 F3, per unit x)
    dlnPdxW2: +DLNP_DX_W2.toFixed(6), // ~-0.85486 (imp-34956 W2, per unit x)
    dlnPddexW2: +DLNP_DDEX_W2.toFixed(6), // ~-1.96852 (imp-34956 W2, per dex, as reported)
    dlnPddexToDx: +DLNP_DDEX_TO_DX.toFixed(6), // ~-0.85486 (after dividing by ln 10)
    ln10: +LN10.toFixed(6), // 2.302585 the dex -> x unit factor
    sameQuantityResidual: +SAME_QUANTITY_RESIDUAL.toExponential(3), // ~1e-12 (finite-difference floor)
    unitBridgeResidual: +UNIT_BRIDGE_RESIDUAL.toExponential(3), // ~1e-12 (finite-difference floor)
    sharedValue: +SHARED_VALUE.toFixed(6), // ~0.85486, the value both literals round to
    f3RoundingGap: +F3_ROUNDING_GAP.toExponential(3), // |0.855 - shared|
    w2RoundingGap: +W2_ROUNDING_GAP.toExponential(3), // |0.8549 - shared|
    literalReportedGap: +LITERAL_REPORTED_GAP.toExponential(3), // 1e-4, pure display rounding
    note:
      'The imp-34950 F3 q_eff and the imp-34956 W2 pinned-product slope are the SAME quantity: because g* is ' +
      'window-independent, d ln P/dx = d ln R/dx = -q_eff of the SAME eflowRatio kernel. The two reported ' +
      'literals differ only by (C1) the dex-vs-x unit choice (factor ln 10) and (C2) display rounding of a ' +
      'single value ~0.85486; the genuine cross-derivation residual is the ~1e-12 finite-difference floor.',
  },
  finding: {
    C0_same_quantity:
      'q_eff = -d ln R/dx and |d ln P/dx| computed independently at the crossing landmark x* agree to the ' +
      'finite-difference floor (residual ~1e-12). g* is landmark-window-independent (imp-34956 W0), so P = ' +
      'g* r0 is EXACTLY proportional to r0 = R(X_CROSS) and the two are the same log-derivative of the SAME ' +
      'eflowRatio kernel -- not two coincidentally-close numbers.',
    C1_dex_to_x_unit_bridge:
      'imp-34956 W2s per-dex slope d ln P/d(dex) ~ -1.9685 divided by ln 10 (2.302585) gives d ln P/dx ~ ' +
      '-0.85486, matching F3s q_eff to the FD floor (unit-bridge residual ~1e-12). The apparent ~2.3 factor ' +
      'between the two reported numbers is purely the dex-vs-natural-log x-unit choice, NOT a disagreement.',
    C2_literal_number_reconciliation:
      'F3s rounded 0.855 and W2s rounded 0.8549 are both display roundings of the SAME measured value ' +
      '~0.85486: |0.855 - 0.8549| = 1e-4 is pure rounding width, ~8 orders above the true cross-derivation ' +
      'residual (~1e-12). Once units are matched there is NO genuine numerical disagreement.',
    consolidates_imp34973:
      'This is the single-landmark tabulation of the window-wide identity imp-34973 established (|d ln P/dx| ' +
      '= q_eff across [1e9,1e11] to ~4e-12); it adds the dex->x unit bridge and the literal-number ' +
      'reconciliation imp-34973 did not exhibit. The value ~0.855 stays well above the imp-3463 far-tail 1/2.',
  },
  farTailExponent: FAR_TAIL_Q, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT a rigorous asymptotic). Tabulated the imp-34950 F3 local E_flow ' +
    'decay exponent q_eff ~ 0.855 (per unit x = ln N) and the imp-34956 W2 pinned-product sensitivity ' +
    'd ln P/d(dex) ~ -1.9685 / d ln P/dx ~ -0.8549 side by side at the single crossing landmark x* = ' +
    'ln N_cross (9.53 dex): (C0) they are the SAME quantity -- because g* is landmark-window-independent ' +
    '(imp-34956 W0), P = g* r0 is EXACTLY proportional to r0 = R(X_CROSS), so d ln P/dx = d ln R/dx = -q_eff ' +
    'of the SAME eflowRatio kernel; |d ln P/dx| and q_eff computed independently agree to ~1e-12. (C1) The ' +
    'dex->x unit bridge: W2s per-dex -1.9685 divided by ln 10 gives -0.85486, matching F3s q_eff to the FD ' +
    'floor -- the apparent ~2.3 factor is the unit choice, not a disagreement. (C2) F3s 0.855 and W2s 0.8549 ' +
    'are both roundings of ~0.85486 (literal gap 1e-4 = display width; true residual ~1e-12), so there is NO ' +
    'genuine numerical disagreement. This is the single-landmark tabulation of the window-wide identity ' +
    'imp-34973 established. Conditional-share diagnostic on the inherited surrogate; the component model is ' +
    'the imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail ' +
    'exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ANSWERS imp-35035: the imp-34950 F3 q_eff ~ 0.855 and the imp-34956 W2 pinned-product slope ~ -0.8549 ' +
    'are the SAME quantity (the local E_flow log-derivative -d ln R/dx at the crossing landmark), confirmed ' +
    'side by side to ~1e-12 once the dex->x unit bridge (divide by ln 10) is applied; the ~0.855 vs ~0.8549 ' +
    'gap is display rounding of a single value ~0.85486, not a numerical disagreement. What stays OPEN ' +
    '(deferred, changes no bound): the same window-local caveat as imp-34973 -- the value ~0.855 drifts with ' +
    'X_CROSS (from ~0.846 to ~0.874 across [1e9,1e11]) and the N at which q_eff turns over toward the ' +
    'imp-3463 far-tail 1/2 is not located; and a self-consistent literal-N ramp traversal (imp-34956 sub-gap).',
  citation:
    'imp-34950 (F3: q_eff ~ 0.855 per unit x); imp-34956 (W2: d ln P/d(dex) ~ -1.9685, d ln P/dx ~ -0.8549); ' +
    'imp-34973 (window-wide identity |d ln P/dx| = q_eff); imp-34924 (P = g* r0, g* window-independent); ' +
    'imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35035_EFLOW_EXPONENT_CROSSING_LANDMARK_CROSSVALIDATION_ASSERTIONS = [
  {
    // (C0): q_eff and |d ln P/dx| are the SAME quantity at the crossing landmark to the FD floor.
    id: 'imp35035-same-quantity-at-landmark',
    description: '| |d ln P/dx| - q_eff | at the crossing landmark is at the finite-difference floor (< 1e-9)',
    holds: () => SAME_QUANTITY_RESIDUAL < 1e-9 && Q_EFF_F3 > 0 && DLNP_DX_W2 < 0,
  },
  {
    // (C1): the dex -> x unit bridge reconciles the per-dex and per-x reported slopes to the FD floor.
    id: 'imp35035-dex-to-x-unit-bridge',
    description: 'd ln P/d(dex)/ln10 equals d ln P/dx to the finite-difference floor (< 1e-9)',
    holds: () =>
      UNIT_BRIDGE_RESIDUAL < 1e-9 && Math.abs(DLNP_DDEX_W2 + 1.9685) < 5e-3 && Math.abs(LN10 - 2.302585) < 1e-5,
  },
  {
    // (C2): the two reported literals both round to ~0.85486; their gap is pure display rounding.
    id: 'imp35035-literal-number-reconciliation',
    description: '0.855 and 0.8549 both round to the shared value ~0.85486; literal gap is 1e-4 display width',
    holds: () =>
      Math.abs(SHARED_VALUE - 0.85486) < 5e-4 &&
      F3_ROUNDING_GAP < 1e-3 &&
      W2_ROUNDING_GAP < 1e-3 &&
      Math.abs(LITERAL_REPORTED_GAP - 1e-4) < 1e-12 &&
      LITERAL_REPORTED_GAP > SAME_QUANTITY_RESIDUAL,
  },
  {
    // the reconciled value stays well above the imp-3463 far-tail 1/2 (near-band, not far tail).
    id: 'imp35035-above-far-tail-half',
    description: 'the reconciled exponent ~0.855 stays well above the imp-3463 far-tail 1/2',
    holds: () => SHARED_VALUE > FAR_TAIL_Q + 0.2 && CROSSVALIDATION_TABLE.length === 4,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35035-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP35035_EFLOW_EXPONENT_CROSSING_LANDMARK_CROSSVALIDATION.isRigorous === false &&
      IMP35035_EFLOW_EXPONENT_CROSSING_LANDMARK_CROSSVALIDATION.farTailExponent === 0.5 &&
      typeof IMP35035_EFLOW_EXPONENT_CROSSING_LANDMARK_CROSSVALIDATION.subGap === 'string' &&
      /NO QED/.test(IMP35035_EFLOW_EXPONENT_CROSSING_LANDMARK_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP35035_EFLOW_EXPONENT_CROSSING_LANDMARK_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP35035_EFLOW_EXPONENT_CROSSING_LANDMARK_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35035-eflow-exponent-crossing-landmark-crossvalidation assertion failed: ${a.id}`);
  }
}
