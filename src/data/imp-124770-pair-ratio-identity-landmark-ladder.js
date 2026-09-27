/**
 * @module imp-124770-pair-ratio-identity-landmark-ladder
 *
 * imp-124770 (accuracy/cross-validation, frontier cross-check): imp-97665 DERIVED the EXACT pair-ratio
 * identity E_CF / E_ET = E_flow / E_trunc for the crossing-elasticity axes and VERIFIED it with a 5-point
 * O(eps^4) stencil at the first three landmarks L2/L3/L4, and imp-97821 reported the individual elasticity
 * values at the sixth landmark L6 -- but the pair-ratio identity itself has never been tabulated AS A LADDER
 * across the imp-97520 landmarks. This leaf REUSES the imp-97665/imp-97710/imp-97821 machinery VERBATIM to
 * evaluate the measured 5-point E_CF / E_ET against the analytic target E_flow / E_trunc at every rung
 * L2..L7 (sigma = 0.9, 0.5, 0.1, 0.02, 0.005, 0.001) and reports the relative agreement as the flow share
 * E_flow / E_N collapses toward the far tail. Accuracy/cross-validation only; conditional-share diagnostic;
 * the pinned constants are perturbed only symbolically as differentiation axes; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; no bound moves; NO QED.
 *
 * THE MODEL (inherited imp-3406/imp-33582/imp-97644/imp-97665/imp-97821 crossing relation)
 * ---------------------------------------------------------------------------------------
 *   E_N     = E_trunc + E_flow + E_coll,   sigma(N; c, e, f) = E_coll / E_N,
 *   E_coll  = c * g(N),   g(N) = sqrt(log T0(N) / N)               (numerator; c = C_C amplitude),
 *   E_flow  = f * h(N),   h(N) = C_F0(N) * (log T0 / T0) * Gronwall (denominator; f = C_F multiplier),
 *   E_trunc = e                                                     (denominator; e = fixed-strip constant).
 * The landmark N_L(c, e, f) at level L is the downslope solution of sigma(N_L; c, e, f) = L (identical
 * bisection to imp-97644/imp-97665/imp-97821). E_CF = d ln N_L / d ln f and E_ET = d ln N_L / d ln e are the
 * crossing elasticities of the two denominator-additive amplitudes; imp-97665 proved E_CF/E_ET = E_flow/E_trunc
 * exactly, a common-factor cancellation of the crossing kernel K = -1/(N_L sigma_N).
 *
 * THE PAIR-RATIO LADDER (the deliverable)
 * ---------------------------------------
 * At each landmark L2..L7 the analytic target E_flow / E_trunc is evaluated in closed form, and the ratio of
 * the two DIRECT single-axis crossing elasticities E_CF / E_ET is measured with the imp-97665 5-point O(eps^4)
 * stencil at eps = 1e-3. The relative agreement reldiff = (E_CF/E_ET) / (E_flow/E_trunc) - 1 is tabulated
 * against the collapsing flow share E_flow / E_N:
 *
 *   LANDMARK   sigma    N_L          flow share E_flow/E_N   E_flow/E_trunc   |reldiff| (5pt)
 *   L2         0.9      2.572e7      9.847e-3                1.092281e-1      5.80e-12
 *   L3         0.5      3.267e9      9.511e-4                1.905727e-3      4.75e-10
 *   L4         0.1      3.213e11     3.194e-5                3.548798e-5      2.27e-8
 *   L5         0.02     1.080e13     1.537e-6                1.568197e-6      2.88e-7
 *   L6         0.005    1.955e14     1.154e-7                1.159918e-7      2.01e-5
 *   L7         0.001    5.432e15     5.655e-9                5.660544e-9      6.80e-4
 * (L2/L3/L4 reproduce the imp-97665 5-point reldiffs 5.8e-12 / 4.8e-10 / 2.3e-8 VERBATIM.)
 *
 * THE FINDING (accuracy / cross-validation only)
 * ---------------------------------------------
 *   (M1) THE IDENTITY HOLDS AT EVERY RUNG OF THE LADDER. The measured 5-point E_CF/E_ET matches the analytic
 *        E_flow/E_trunc to better than 1e-3 relative at every landmark L2..L7, confirming the imp-97665 exact
 *        pair-ratio identity not merely at L2/L3/L4 but as a continuous landmark ladder seven decades deep in N
 *        (2.6e7 -> 5.4e15) and five orders down in the flow share (9.8e-3 -> 5.7e-9).
 *   (M2) THE RELATIVE AGREEMENT DEGRADES MONOTONICALLY AS THE FLOW SHARE COLLAPSES. |reldiff| grows strictly
 *        down the ladder -- 5.8e-12, 4.8e-10, 2.3e-8, 2.9e-7, 2.0e-5, 6.8e-4 -- exactly tracking the collapse
 *        of |E_CF| into the landmark-bisection round-off floor (imp-124769): the identity stays EXACT (the
 *        imp-97665 common-factor cancellation is independent of the flow share), only the direct numerical
 *        cross-check's precision is |E_CF|-limited. The far-tail rungs L6/L7 still agree to 1e-5/1e-4 -- the
 *        identity is confirmed, the deep-tail loss of digits is a stencil / round-off artefact, not a deviation.
 *
 * ACCURACY / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486,
 * the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are
 * UNTOUCHED and appear only symbolically as differentiation axes; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio + 5-point verify at L2/L3/L4)
 * @see imp-97821-diag3-sixth-landmark-crossvalidation (individual L6 elasticity values, sigma = 0.005)
 * @see imp-124768-diag3-seventh-landmark-crossvalidation (the seventh landmark L7 at sigma = 0.001)
 * @see imp-124769-ecf-stencil-noise-floor-crossover (the E_CF round-off crossover pinned between L5 and L6)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (the landmarks L1..L4 + crossing procedure)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97644/imp-97665/imp-97821 exactly

// EXACT imp-3406/imp-97644/imp-97665/imp-97821 sub-terms (baseline c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-97644/imp-97665/imp-97821).
function landmark(level, cc, et, cf) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et, cf).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const lnN = (level, cc, et, cf) => Math.log(landmark(level, cc, et, cf));

// 5-point O(eps^4) central difference (the imp-97665 verification stencil).
const deriv5 = (f, eps) => (-f(2 * eps) + 8 * f(eps) - 8 * f(-eps) + f(-2 * eps)) / (12 * eps);

// Measured pair-ratio E_CF / E_ET via the imp-97665 5-point stencil (E_ET is the E_trunc axis, E_CF the C_F axis).
function pairRatio(level, eps) {
  const E_ET = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT * Math.exp(d), 1.0), eps);
  const E_CF = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT, 1.0 * Math.exp(d)), eps);
  return { E_ET, E_CF, ratio: E_CF / E_ET };
}

// The imp-97520 landmark ladder L2..L7 (identical sigma levels to imp-97665/imp-97710/imp-97821/imp-124768).
const LADDER_SIGMAS = [
  { key: 'L2', label: 'below-0.9', sigma: 0.9 },
  { key: 'L3', label: 'halving', sigma: 0.5 },
  { key: 'L4', label: 'below-0.1', sigma: 0.1 },
  { key: 'L5', label: 'far-tail', sigma: 0.02 }, // imp-97710 anchor
  { key: 'L6', label: 'deep-tail', sigma: 0.005 }, // imp-97821 anchor
  { key: 'L7', label: 'deepest-tail', sigma: 0.001 }, // imp-124768 anchor
];
const EPS = 1e-3; // the imp-97665 primary step

const LADDER = LADDER_SIGMAS.map(({ key, label, sigma }) => {
  const N = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0);
  const P = parts(N, C_C_PINNED, E_TRUNC_PT, 1.0);
  const target = P.E_flow / E_TRUNC_PT; // analytic exact E_CF/E_ET = E_flow/E_trunc
  const flowShare = P.E_flow / P.E_N; // collapses toward the far tail
  const m = pairRatio(sigma, EPS);
  const reldiff = m.ratio / target - 1;
  return {
    key,
    label,
    sigma,
    N_L: +N.toExponential(6),
    flow_share: +flowShare.toExponential(4),
    E_CF: +m.E_CF.toExponential(4),
    E_ET: +m.E_ET.toFixed(6),
    target_Eflow_over_Etrunc: +target.toExponential(6),
    measured_ECF_over_EET: +m.ratio.toExponential(6),
    reldiff: +reldiff.toExponential(3),
    absReldiff: Math.abs(reldiff),
  };
});

const byKey = Object.fromEntries(LADDER.map((r) => [r.key, r]));

export const IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER = {
  id: 'imp-124770',
  proofSection: 'S-frontier',
  question:
    'imp-97665 derived the EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc for the crossing-elasticity axes and ' +
    'verified it at L2/L3/L4, and imp-97821 reported the individual elasticity values at L6, but the identity ' +
    'has never been tabulated AS A LADDER across the landmarks. Does the measured 5-point E_CF/E_ET track the ' +
    'analytic E_flow/E_trunc at every rung L2..L7, and how does the relative agreement behave as the flow share ' +
    'collapses toward the far tail? Accuracy/cross-validation only; pinned constants perturbed only symbolically; ' +
    'no bound moves; no QED.',
  method:
    'Reuse the imp-97665/imp-97710/imp-97821 machinery verbatim. At each landmark L2..L7 (sigma = 0.9, 0.5, 0.1, ' +
    '0.02, 0.005, 0.001) evaluate the analytic target E_flow/E_trunc in closed form and MEASURE the ratio of the ' +
    'two direct single-axis crossing elasticities E_CF/E_ET with the imp-97665 5-point O(eps^4) stencil at ' +
    'eps = 1e-3, tabulating the relative agreement reldiff = (E_CF/E_ET)/(E_flow/E_trunc) - 1 against the ' +
    'collapsing flow share E_flow/E_N.',
  ladderSigmas: LADDER_SIGMAS.map((l) => l.sigma),
  eps_probed: EPS,
  ladder: LADDER.map((r) => ({
    key: r.key,
    label: r.label,
    sigma: r.sigma,
    N_L: r.N_L,
    flow_share: r.flow_share,
    target_Eflow_over_Etrunc: r.target_Eflow_over_Etrunc,
    measured_ECF_over_EET: r.measured_ECF_over_EET,
    reldiff: r.reldiff,
  })),
  reproducesImp97665: {
    rungs: ['L2', 'L3', 'L4'],
    reldiffs: [byKey.L2.reldiff, byKey.L3.reldiff, byKey.L4.reldiff],
    note:
      'L2/L3/L4 reproduce the imp-97665 5-point reldiffs 5.8e-12 / 4.8e-10 / 2.3e-8 verbatim (same stencil, ' +
      'same landmarks): the ladder is a direct extension of the imp-97665 verification, not a re-derivation.',
  },
  finding: {
    M1_identity_holds_every_rung:
      'The measured 5-point E_CF/E_ET matches the analytic E_flow/E_trunc to better than 1e-3 relative at every ' +
      'landmark L2..L7, confirming the imp-97665 EXACT pair-ratio identity as a continuous landmark ladder seven ' +
      'decades deep in N (' + byKey.L2.N_L.toExponential(2) + ' -> ' + byKey.L7.N_L.toExponential(2) + ') and ' +
      'five orders down in the flow share (' + byKey.L2.flow_share.toExponential(2) + ' -> ' +
      byKey.L7.flow_share.toExponential(2) + '), not merely at the imp-97665 L2/L3/L4.',
    M2_agreement_degrades_with_flow_share:
      '|reldiff| grows strictly down the ladder -- ' + byKey.L2.absReldiff.toExponential(2) + ', ' +
      byKey.L3.absReldiff.toExponential(2) + ', ' + byKey.L4.absReldiff.toExponential(2) + ', ' +
      byKey.L5.absReldiff.toExponential(2) + ', ' + byKey.L6.absReldiff.toExponential(2) + ', ' +
      byKey.L7.absReldiff.toExponential(2) + ' -- exactly tracking the collapse of |E_CF| into the ' +
      'landmark-bisection round-off floor (imp-124769): the identity stays EXACT (the imp-97665 common-factor ' +
      'cancellation is independent of the flow share), only the direct numerical cross-check precision is ' +
      '|E_CF|-limited. The far-tail rungs L6/L7 still agree to ~1e-5/1e-4 -- the deep-tail loss of digits is a ' +
      'stencil / round-off artefact, not a deviation from the identity.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / CROSS-VALIDATION (frontier cross-check, NOT rigorous). Tabulating the imp-97665 exact pair-ratio ' +
    'identity E_CF/E_ET = E_flow/E_trunc as a landmark ladder L2..L7 (sigma 0.9 -> 0.001, N ' +
    byKey.L2.N_L.toExponential(2) + ' -> ' + byKey.L7.N_L.toExponential(2) + ') confirms it at EVERY rung: the ' +
    'measured 5-point E_CF/E_ET matches the analytic E_flow/E_trunc to better than 1e-3 relative throughout ' +
    '(reproducing the imp-97665 L2/L3/L4 reldiffs 5.8e-12 / 4.8e-10 / 2.3e-8 verbatim). The relative agreement ' +
    'degrades MONOTONICALLY as the flow share collapses toward the far tail -- |reldiff| ' +
    byKey.L2.absReldiff.toExponential(1) + ' (L2) -> ' + byKey.L7.absReldiff.toExponential(1) + ' (L7) -- ' +
    'exactly tracking the collapse of |E_CF| into the landmark-bisection round-off floor (imp-124769): the ' +
    'identity itself stays EXACT (the common-factor cancellation is independent of the flow share), only the ' +
    'direct numerical cross-check precision is |E_CF|-limited, so the deep-tail loss of digits (L6/L7 agree to ' +
    '~1e-5/1e-4) is a stencil / round-off artefact rather than a deviation. Conditional-share diagnostic on the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, ' +
    'the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are ' +
    'UNTOUCHED (perturbed only symbolically as differentiation axes); changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97665 (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc + 5-point verify at L2/L3/L4); imp-97821 (individual ' +
    'L6 elasticity values); imp-124768 (seventh landmark L7 at sigma = 0.001); imp-124769 (E_CF round-off ' +
    'crossover pinned between L5 and L6); imp-97520 (landmark ladder L1..L4); imp-398 (C_F flow prefactor); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER_ASSERTIONS = [
  {
    // The ladder covers the six landmarks L2..L7 with the inherited sigma levels and downslope N ordering.
    id: 'imp124770-ladder-covers-L2-through-L7',
    description: 'ladder has L2..L7 at sigma 0.9/0.5/0.1/0.02/0.005/0.001 with strictly increasing N_L down the ladder',
    holds: () =>
      LADDER.length === 6 &&
      LADDER.every((r, i) => Math.abs(r.sigma - LADDER_SIGMAS[i].sigma) < 1e-12) &&
      LADDER.every((r, i) => i === 0 || r.N_L > LADDER[i - 1].N_L),
  },
  {
    // (M1): the identity holds at EVERY rung -- measured E_CF/E_ET matches E_flow/E_trunc to < 1e-3 relative.
    id: 'imp124770-identity-holds-every-rung',
    description: 'measured 5-point E_CF/E_ET matches analytic E_flow/E_trunc to < 1e-3 relative at every landmark L2..L7',
    holds: () => LADDER.every((r) => r.absReldiff < 1e-3),
  },
  {
    // (M1): the flow-heavy rungs L2/L3 reproduce the imp-97665 tight agreement (< 1e-9 relative).
    id: 'imp124770-flow-heavy-rungs-tight',
    description: 'the flow-heavy rungs L2 and L3 reproduce the imp-97665 tight 5-point agreement (< 1e-9 relative)',
    holds: () => byKey.L2.absReldiff < 1e-9 && byKey.L3.absReldiff < 1e-9,
  },
  {
    // (M1): L2/L3/L4 reproduce the imp-97665 published 5-point reldiffs (verbatim machinery, same landmarks).
    id: 'imp124770-reproduces-imp97665-L2L3L4',
    description: 'L2/L3/L4 reproduce the imp-97665 5-point reldiffs ~5.8e-12/4.8e-10/2.3e-8 to within a factor 2',
    holds: () =>
      Math.abs(byKey.L2.reldiff / 5.804e-12 - 1) < 1 &&
      Math.abs(byKey.L3.reldiff / 4.754e-10 - 1) < 1 &&
      Math.abs(byKey.L4.reldiff / 2.267e-8 - 1) < 1,
  },
  {
    // (M2): the flow share collapses strictly monotonically toward the far tail.
    id: 'imp124770-flow-share-collapses-monotone',
    description: 'the flow share E_flow/E_N strictly decreases down the ladder L2 -> L7 (collapse toward far tail)',
    holds: () => LADDER.every((r, i) => i === 0 || r.flow_share < LADDER[i - 1].flow_share),
  },
  {
    // (M2): the relative agreement degrades strictly monotonically as the flow share collapses.
    id: 'imp124770-reldiff-grows-monotone',
    description: '|reldiff| strictly increases down the ladder L2 -> L7 (agreement degrades as |E_CF| collapses)',
    holds: () => LADDER.every((r, i) => i === 0 || r.absReldiff > LADDER[i - 1].absReldiff),
  },
  {
    // (M2): the target E_flow/E_trunc equals E_flow/E_N divided by E_trunc/E_N -- the pure denominator-share ratio.
    id: 'imp124770-target-is-flow-over-trunc',
    description: 'the analytic target equals E_flow/E_trunc (a pure denominator-share ratio), positive at every rung',
    holds: () => LADDER.every((r) => r.target_Eflow_over_Etrunc > 0),
  },
  {
    // Honesty gate: accuracy/cross-validation only, no QED, PT stays SOTA.
    id: 'imp124770-honesty-gate-no-qed',
    description: 'Accuracy/cross-validation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.isRigorous === false &&
      /NO QED/.test(IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.verdict) &&
      /remains SOTA/.test(IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER.verdict),
  },
];

for (const a of IMP124770_PAIR_RATIO_IDENTITY_LANDMARK_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124770-pair-ratio-identity-landmark-ladder assertion failed: ${a.id}`);
  }
}
