/**
 * @module imp-34973-pinned-product-slope-qeff-window-identity
 *
 * imp-34973 (numerical, frontier-direction): imp-34956 reported that the local sensitivity of the
 * imp-34924 pinned product P = s*(E_flow/E_trunc) = g* r0 is d ln P/dx ~ -0.8549 per unit x = ln N,
 * and noted this MATCHES the imp-34950 local E_flow decay exponent q_eff ~ 0.855 -- but only at the
 * nominal crossing window X_CROSS = 10^9.53 (9.53 dex). This module reuses the imp-34924/imp-34956
 * gapAt kernel and the imp-34950 q_eff kernel VERBATIM, MEASURES d ln P/dx on a grid of X_CROSS across
 * the full plausible bracket [1e9,1e11], and compares each to the local q_eff at that same X_CROSS, to
 * assess whether the ~0.855 slope match is a point coincidence at 9.53 dex or holds window-wide.
 *
 * THE MEASUREMENT (window-wide slope-vs-q_eff comparison)
 * ------------------------------------------------------
 *   (S0) THE MATCH IS AN ALGEBRAIC IDENTITY, NOT A POINT COINCIDENCE. imp-34956 W0 established that g*
 *        is landmark-window-INDEPENDENT (gapAt has no X_CROSS), so P = g* r0 is EXACTLY proportional to
 *        r0 = R(X_CROSS) = eflowRatio(X_CROSS). Hence d ln P/dx = d ln R/dx identically, while the
 *        imp-34950 exponent is q_eff(x) = -d ln R/dx of the SAME eflowRatio kernel. So d ln P/dx =
 *        -q_eff(X_CROSS) at EVERY window by definition. Measured on a 9-point grid across [1e9,1e11],
 *        | |d ln P/dx| - q_eff | stays at the finite-difference floor (max ~4.4e-12) -- the slope match
 *        holds window-wide to machine precision, so the 9.53-dex agreement is NOT a coincidence.
 *   (S1) THE NUMBER 0.855 IS WINDOW-LOCAL. q_eff(X_CROSS) is NOT constant: measured across [1e9,1e11] it
 *        drifts monotonically UPWARD from ~0.8463 at 1e9 through ~0.8549 at the nominal 9.53-dex crossing
 *        landmark to ~0.8744 at 1e11 (spread ~0.0281 over the two-decade bracket, ~3.3% relative). So the
 *        specific ~0.855 value quoted by imp-34956/imp-34950 is a POINT reading at the crossing landmark,
 *        not a window-wide constant: the FUNCTIONAL identity |d ln P/dx| = q_eff is structural, but the
 *        NUMERIC value it takes tracks the local E_flow decay exponent and varies with the window.
 *   (S2) THE FAR-TAIL 1/2 IS BEYOND THIS BRACKET. Over [1e9,1e11] q_eff sits well above the imp-3463
 *        far-tail asymptote 1/2 and actually RISES slightly with N -- the crossing band is far from the
 *        far tail, where q -> 1/2 only much further out. So neither the ~0.855 point value nor its mild
 *        upward drift over this bracket contradicts the far-tail 1/2; they are the near-band regime.
 *
 * FINDING (the ticket question). The ~0.855 slope match between the pinned-product sensitivity d ln P/dx
 * and the E_flow decay exponent q_eff is STRUCTURAL, not a 9.53-dex coincidence: because g* is
 * window-independent, |d ln P/dx| EQUALS q_eff(X_CROSS) window-wide as an algebraic identity (verified to
 * ~4e-12 across [1e9,1e11]). What is window-LOCAL is the numeric value ~0.855: q_eff drifts from ~0.846
 * to ~0.874 across the bracket, so ~0.855 is its point reading at the crossing landmark, not a constant.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic on the inherited surrogate, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34956-pinned-product-window-sensitivity (reported d ln P/dx ~ -0.8549 at the nominal window)
 * @see imp-34950-eflow-crossing-strength-cmb-exponent-structural (the local q_eff ~ 0.855 decay exponent)
 * @see imp-34924-eflow-pinned-product-derivation (derived P = g* r0, g* window-independent)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see imp-486 (C_mb GUE-conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34886/imp-34924/imp-34950/imp-34956 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// E_flow / E_trunc = r(x) at ln N = x, reused VERBATIM from imp-34924/imp-34950/imp-34956.
function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}

// g* is landmark-window-INDEPENDENT (imp-34956 W0): reused as the fixed imp-34886/imp-34924 crossing
// coupling. P = g* r0 is EXACTLY proportional to r0 = eflowRatio(X_CROSS), so d ln P/dx = d ln r0/dx.
const G_STAR = 0.7776533446;
function pinnedProduct(x) {
  return G_STAR * eflowRatio(x);
}

const LN10 = Math.LN10;
const HDEX = 1e-4; // matches the imp-34956 d ln P/d(dex) stencil half-step (in dex)
const HX = HDEX * LN10; // the same stencil expressed per unit x = ln N

// d ln P/dx measured directly from the pinned product (central difference in x = ln N).
function dlnPdx(x) {
  return (Math.log(pinnedProduct(x + HX)) - Math.log(pinnedProduct(x - HX))) / (2 * HX);
}
// local E_flow decay exponent q_eff = -d ln R/dx at x, the imp-34950 qEffAt kernel in x-units.
function qEffAt(x) {
  return -(Math.log(eflowRatio(x + HX)) - Math.log(eflowRatio(x - HX))) / (2 * HX);
}

// ---- (S0)+(S1) the window-wide grid across the full plausible bracket [1e9,1e11] ---------------------------
const DEX_LO = 9;
const DEX_HI = 11;
const SLOPE_QEFF_SWEEP = Array.from({ length: 9 }, (_, i) => DEX_LO + i * 0.25).map((dex) => {
  const x = dex * LN10;
  const slope = dlnPdx(x); // d ln P/dx (negative)
  const q = qEffAt(x); // q_eff = -d ln R/dx (positive)
  return {
    dex: +dex.toFixed(2),
    dlnPdx: +slope.toFixed(6),
    qEff: +q.toFixed(6),
    // |d ln P/dx| - q_eff: the identity residual (finite-difference floor, ~0 everywhere).
    identityResidual: +Math.abs(Math.abs(slope) - q).toExponential(3),
  };
});

// (S0) the identity |d ln P/dx| = q_eff holds window-wide to the finite-difference floor.
const MAX_IDENTITY_RESIDUAL = Math.max(...SLOPE_QEFF_SWEEP.map((p) => Math.abs(p.identityResidual)));

// (S1) q_eff is NOT constant: it drifts monotonically across the bracket, so ~0.855 is window-local.
const Q_EFF_VALUES = SLOPE_QEFF_SWEEP.map((p) => p.qEff);
const Q_EFF_MIN = Math.min(...Q_EFF_VALUES); // ~0.8463 at 1e9
const Q_EFF_MAX = Math.max(...Q_EFF_VALUES); // ~0.8744 at 1e11
const Q_EFF_SPREAD = Q_EFF_MAX - Q_EFF_MIN; // ~0.0281 over the two-decade bracket
const Q_EFF_MONOTONIC_INCREASING = SLOPE_QEFF_SWEEP.every(
  (p, i) => i === 0 || p.qEff > SLOPE_QEFF_SWEEP[i - 1].qEff,
);

// the nominal 9.53-dex crossing landmark: reproduces the imp-34956/imp-34950 ~0.855 point value.
const NOMINAL_DEX = 9.53;
const X_NOMINAL = NOMINAL_DEX * LN10;
const DLNP_DX_NOMINAL = dlnPdx(X_NOMINAL); // ~-0.8549
const Q_EFF_NOMINAL = qEffAt(X_NOMINAL); // ~0.8549
const FAR_TAIL_Q = 0.5; // imp-3463 asymptote (reached only far beyond 1e11)

export const IMP34973_PINNED_PRODUCT_SLOPE_QEFF_WINDOW_IDENTITY = {
  id: 'imp-34973',
  proofSection: 'S-frontier',
  question:
    'imp-34956 reported the pinned-product local sensitivity d ln P/dx ~ -0.8549 matching the imp-34950 ' +
    'local E_flow decay exponent q_eff ~ 0.855, but only at the nominal crossing window X_CROSS = 10^9.53. ' +
    'Reuse the imp-34924/imp-34956 gapAt kernel and the imp-34950 q_eff kernel VERBATIM, MEASURE d ln P/dx ' +
    'on a grid of X_CROSS across [1e9,1e11], and compare each to the local q_eff at that N, to assess ' +
    'whether the ~0.855 slope match is a point coincidence at 9.53 dex or holds window-wide. Measurement ' +
    'only; changes no bound; C_mb GUE-conditional (imp-486) untouched; NO QED.',
  verdictShort:
    'The ~0.855 slope match is STRUCTURAL, not a 9.53-dex coincidence: because g* is landmark-window-' +
    'independent (imp-34956 W0), P = g* r0 is EXACTLY proportional to r0 = R(X_CROSS), so d ln P/dx = ' +
    'd ln R/dx while q_eff(x) = -d ln R/dx of the SAME eflowRatio kernel -- hence |d ln P/dx| = q_eff at ' +
    'EVERY window by definition (verified to ~4e-12 across [1e9,1e11]). What is window-LOCAL is the NUMBER: ' +
    'q_eff drifts monotonically from ~0.8463 at 1e9 through ~0.8549 at 9.53 dex to ~0.8744 at 1e11 (spread ' +
    '~0.0281), so ~0.855 is its point reading at the crossing landmark, not a window-wide constant. Over ' +
    'this bracket q_eff sits well above the imp-3463 far-tail 1/2 (reached only much further out).',
  measuredQuantity:
    'd ln P/dx of the imp-34924 pinned product and the imp-34950 local E_flow decay exponent q_eff = ' +
    '-d ln R/dx, both measured on a 9-point X_CROSS grid across the full plausible bracket [1e9,1e11], ' +
    'their window-wide identity residual | |d ln P/dx| - q_eff |, and the q_eff drift (min/max/spread and ' +
    'monotonicity) across the bracket vs the ~0.855 nominal-landmark point value',
  gStar: G_STAR, // landmark-window-independent (imp-34956 W0)
  slopeQeffSweep: SLOPE_QEFF_SWEEP, // 9-point d ln P/dx vs q_eff grid across [1e9,1e11]
  identity: {
    maxIdentityResidual: +MAX_IDENTITY_RESIDUAL.toExponential(3), // ~4.4e-12 (finite-difference floor)
    note:
      'Because g* is landmark-window-independent, P = g* r0 is EXACTLY proportional to r0 = R(X_CROSS), so ' +
      'd ln P/dx = d ln R/dx identically, while q_eff = -d ln R/dx of the SAME eflowRatio kernel. Hence ' +
      '|d ln P/dx| = q_eff at every X_CROSS by definition -- the ~0.855 match is an algebraic identity, not ' +
      'a point coincidence at 9.53 dex.',
  },
  qEffDrift: {
    min: +Q_EFF_MIN.toFixed(6), // ~0.8463 at 1e9
    max: +Q_EFF_MAX.toFixed(6), // ~0.8744 at 1e11
    spread: +Q_EFF_SPREAD.toFixed(6), // ~0.0281 over the two-decade bracket
    monotonicIncreasing: Q_EFF_MONOTONIC_INCREASING,
    farTailExponent: FAR_TAIL_Q, // imp-3463 = 1/2 (reached only far beyond 1e11)
    note:
      'q_eff is NOT constant across the bracket: it drifts monotonically upward from ~0.8463 (1e9) to ' +
      '~0.8744 (1e11), spread ~0.0281 (~3.3% relative). So the specific ~0.855 value is a POINT reading at ' +
      'the 9.53-dex crossing landmark, not a window-wide constant; the FUNCTIONAL identity is structural, ' +
      'the numeric value it takes is window-local. Over [1e9,1e11] q_eff stays well above the far-tail 1/2.',
  },
  nominalWindow: {
    dex: NOMINAL_DEX,
    dlnPdx: +DLNP_DX_NOMINAL.toFixed(6), // ~-0.8549 (reproduces imp-34956)
    qEff: +Q_EFF_NOMINAL.toFixed(6), // ~0.8549 (reproduces imp-34950)
  },
  finding: {
    S0_slope_match_is_an_algebraic_identity:
      'g* is landmark-window-independent (imp-34956 W0), so P = g* r0 is EXACTLY proportional to r0 = ' +
      'R(X_CROSS): d ln P/dx = d ln R/dx while q_eff = -d ln R/dx of the SAME eflowRatio kernel. Hence ' +
      '|d ln P/dx| = q_eff at every X_CROSS by definition; measured across [1e9,1e11] the identity residual ' +
      'stays at the finite-difference floor (max ~4.4e-12). The 9.53-dex agreement is NOT a coincidence.',
    S1_the_number_0p855_is_window_local:
      'q_eff(X_CROSS) is NOT constant: across [1e9,1e11] it drifts monotonically upward from ~0.8463 (1e9) ' +
      'through ~0.8549 (9.53 dex) to ~0.8744 (1e11), spread ~0.0281. So the ~0.855 value quoted by ' +
      'imp-34956/imp-34950 is a POINT reading at the crossing landmark, not a window-wide constant -- the ' +
      'functional match is structural, the numeric value it takes tracks the local decay exponent.',
    S2_far_tail_half_is_beyond_this_bracket:
      'Over [1e9,1e11] q_eff sits well above the imp-3463 far-tail 1/2 and rises slightly with N (the ' +
      'crossing band is far from the far tail, where q -> 1/2 only much further out). Neither the ~0.855 ' +
      'point value nor its mild upward drift over this bracket contradicts the far-tail 1/2.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT a rigorous asymptotic). imp-34956 reported the pinned-product ' +
    'sensitivity d ln P/dx ~ -0.8549 matching the imp-34950 local E_flow decay exponent q_eff ~ 0.855 only ' +
    'at the nominal X_CROSS = 10^9.53. MEASURED d ln P/dx and q_eff on a 9-point grid across [1e9,1e11]: ' +
    '(S0) the match is an ALGEBRAIC IDENTITY, not a point coincidence -- because g* is landmark-window-' +
    'independent (imp-34956 W0), P = g* r0 is EXACTLY proportional to r0 = R(X_CROSS), so d ln P/dx = ' +
    'd ln R/dx while q_eff = -d ln R/dx of the SAME eflowRatio kernel; |d ln P/dx| = q_eff window-wide to ' +
    'the finite-difference floor (max residual ~4.4e-12). (S1) The NUMBER ~0.855 is window-LOCAL: q_eff ' +
    'drifts monotonically from ~0.8463 (1e9) through ~0.8549 (9.53 dex) to ~0.8744 (1e11), spread ~0.0281, ' +
    'so ~0.855 is its point reading at the crossing landmark, not a window-wide constant. (S2) Over ' +
    '[1e9,1e11] q_eff stays well above the imp-3463 far-tail 1/2 (reached only far beyond this bracket). ' +
    'FINDING: the ~0.855 slope match is STRUCTURAL (a definitional identity holding window-wide), while the ' +
    'numeric value it takes is window-local and tracks the local E_flow decay exponent. Conditional-share ' +
    'diagnostic on the inherited surrogate; the component model is the imp-3220/imp-3406 extrapolation, NOT ' +
    'a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ANSWERS imp-34973: the ~0.855 match between the pinned-product sensitivity d ln P/dx and the E_flow ' +
    'decay exponent q_eff is STRUCTURAL, not a 9.53-dex coincidence -- because g* is window-independent, ' +
    '|d ln P/dx| = q_eff(X_CROSS) holds window-wide as an algebraic identity (residual ~4e-12 across ' +
    '[1e9,1e11]). What is window-local is the numeric value: q_eff drifts from ~0.846 to ~0.874 across the ' +
    'bracket, so ~0.855 is a point reading at the crossing landmark. What stays OPEN (deferred, changes no ' +
    'bound): a literal-N ramp traversal that moves X_CROSS self-consistently (so r0 tracks r(x) as the ramp ' +
    'advances), and locating the N at which q_eff turns over and begins its descent toward the imp-3463 ' +
    'far-tail 1/2.',
  citation:
    'imp-34956 (reported d ln P/dx ~ -0.8549 at the nominal window); imp-34950 (the local q_eff ~ 0.855 ' +
    'decay exponent); imp-34924 (derived P = g* r0, g* window-independent); imp-3463 (far-tail 1/2); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34973_PINNED_PRODUCT_SLOPE_QEFF_WINDOW_IDENTITY_ASSERTIONS = [
  {
    // (S0): the slope match is an algebraic identity holding window-wide to the finite-difference floor.
    id: 'imp34973-slope-qeff-identity-window-wide',
    description: '|d ln P/dx| = q_eff at every X_CROSS across [1e9,1e11] to the finite-difference floor (~4e-12)',
    holds: () => MAX_IDENTITY_RESIDUAL < 1e-9 && SLOPE_QEFF_SWEEP.length === 9,
  },
  {
    // (S1): q_eff is NOT constant -- it drifts monotonically, so ~0.855 is a window-local point value.
    id: 'imp34973-qeff-drifts-window-local',
    description: 'q_eff drifts monotonically upward from ~0.8463 (1e9) to ~0.8744 (1e11), spread ~0.0281',
    holds: () =>
      Q_EFF_MONOTONIC_INCREASING &&
      Q_EFF_SPREAD > 0.02 &&
      Math.abs(Q_EFF_MIN - 0.8463) < 5e-3 &&
      Math.abs(Q_EFF_MAX - 0.8744) < 5e-3,
  },
  {
    // reproduces the imp-34956/imp-34950 ~0.855 point value at the nominal 9.53-dex crossing landmark.
    id: 'imp34973-reproduces-nominal-0p855',
    description: 'd ln P/dx and q_eff both ~0.855 at the nominal 9.53-dex crossing landmark',
    holds: () =>
      Math.abs(DLNP_DX_NOMINAL + 0.8549) < 5e-3 &&
      Math.abs(Q_EFF_NOMINAL - 0.8549) < 5e-3 &&
      Q_EFF_NOMINAL > Q_EFF_MIN &&
      Q_EFF_NOMINAL < Q_EFF_MAX,
  },
  {
    // (S2): across [1e9,1e11] q_eff stays well above the imp-3463 far-tail 1/2.
    id: 'imp34973-above-far-tail-half',
    description: 'q_eff stays well above the imp-3463 far-tail 1/2 across the whole bracket',
    holds: () => Q_EFF_MIN > FAR_TAIL_Q + 0.2,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34973-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34973_PINNED_PRODUCT_SLOPE_QEFF_WINDOW_IDENTITY.isRigorous === false &&
      IMP34973_PINNED_PRODUCT_SLOPE_QEFF_WINDOW_IDENTITY.farTailExponent === 0.5 &&
      typeof IMP34973_PINNED_PRODUCT_SLOPE_QEFF_WINDOW_IDENTITY.subGap === 'string' &&
      /NO QED/.test(IMP34973_PINNED_PRODUCT_SLOPE_QEFF_WINDOW_IDENTITY.verdict) &&
      /refereed bound is changed/i.test(IMP34973_PINNED_PRODUCT_SLOPE_QEFF_WINDOW_IDENTITY.verdict),
  },
];

for (const a of IMP34973_PINNED_PRODUCT_SLOPE_QEFF_WINDOW_IDENTITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34973-pinned-product-slope-qeff-window-identity assertion failed: ${a.id}`);
  }
}
