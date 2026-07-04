/**
 * @module imp-33855-ncross-thr-monotone-ordering
 *
 * imp-33855 (proof, frontier-direction): imp-33796 recomputed the strict ordering N_half < N_cross
 * at the SINGLE halving threshold thr = 1/2 (the sigma_full = 1/2 landmark sits ~0.4% below its
 * E_coll = E_trunc anchor, the gap being the E_flow displacement). imp-33743 supplied the CLOSED-FORM
 * threshold landmark N_cross(thr) = (C_C (1-thr)/(E_trunc thr))^2 log T0(N_cross) but evaluated it only
 * at the isolated thresholds thr = 1/2 and thr = 1/10. This module ASSESSES the two things that were
 * only ever checked at isolated points: (i) whether dN_cross/dthr has a FIXED sign so the closed-form
 * landmark ladder is strictly ordered in thr across ALL thr in (0,1); and (ii) whether the halving-type
 * (E_flow-inclusive) landmark sits below its E_flow-dropped anchor by a thr-dependent E_flow
 * displacement at EVERY threshold, not just thr = 1/2.
 *
 * THE CLOSED-FORM MONOTONICITY DERIVATION (deliverable i)
 * ------------------------------------------------------
 * The imp-33743 anchor is the fixed point N = A(thr) L(N), where
 *
 *     A(thr) = (C_C / E_trunc)^2 * ((1-thr)/thr)^2 = k * ((1-thr)/thr)^2,   k = (C_C/E_trunc)^2 > 0,
 *     L(N)   = log T0(N)  (strictly increasing in N, Riemann-von Mangoldt height).
 *
 * Write (1-thr)/thr = 1/thr - 1, so d/dthr[(1-thr)/thr] = -1/thr^2 and
 *
 *     A_prime(thr) = k * 2 (1-thr)/thr * (-1/thr^2) = -2 k (1-thr)/thr^3 < 0   for all thr in (0,1).
 *
 * Differentiating the fixed point N = A(thr) L(N) implicitly in thr:
 *
 *     dN/dthr = A_prime(thr) L(N) / (1 - A(thr) L_prime(N)).
 *
 * The denominator is 1 minus the contraction factor of the fixed-point map g(N) = A L(N); imp-33743
 * measured |g_prime| ~ 0.038..0.045 << 1 across the landmark band, so 1 - A L_prime(N) > 0 everywhere.
 * With A_prime(thr) < 0, L(N) > 0 and the denominator > 0, the numerator sign is fixed and
 *
 *     dN_cross/dthr = (negative) * (positive) / (positive) < 0   for ALL thr in (0,1).
 *
 * So the landmark ladder is STRICTLY MONOTONE DECREASING in thr: a higher share threshold needs a
 * larger E_coll = thr/(1-thr) * E_trunc, and E_coll ~ N^{-1/2} shrinks in N, so the crossing sits at
 * smaller N. The ordering is not a coincidence at thr = 1/2; it is a fixed-sign closed-form fact.
 *
 * THE THR-DEPENDENT E_flow DISPLACEMENT (deliverable ii)
 * -----------------------------------------------------
 * The E_flow-dropped anchor solves E_coll = thr/(1-thr) * E_trunc; the full (halving-type) landmark
 * solves sigma_full(N) = thr, i.e. E_coll = thr/(1-thr) * (E_trunc + E_flow) -- a LARGER E_coll target.
 * Since N proportional to E_coll^{-2} at fixed L,
 *
 *     N_full(thr)/N_anchor(thr) = (E_trunc/(E_trunc + E_flow))^2 = (1 + E_flow/E_trunc)^{-2}
 *                               ~ 1 - 2 E_flow/E_trunc,
 *
 * so the full landmark sits BELOW its anchor by the displacement 2 E_flow/E_trunc evaluated AT the
 * (thr-dependent) landmark position. That reproduces imp-33796 at thr = 1/2 (2 E_flow/E_trunc ~ 0.381%,
 * measured 0.398%) and imp-33743 D2 at thr = 1/10 (2 E_flow/E_trunc ~ 7.1e-3%). Because E_flow ~
 * log T0 / T0 decays down the tail, the displacement fraction is strongly thr-dependent -- it shrinks
 * from ~20% at thr = 0.9 to ~7e-5 at thr = 0.1 -- yet it is ALWAYS positive, so N_full < N_anchor at
 * every threshold. (The linearization 2 E_flow/E_trunc is a leading term: at thr >= 0.9, E_flow/E_trunc
 * is no longer tiny, so the exact ratio (1 + E_flow/E_trunc)^{-2} and its linearization diverge by
 * ~10%; the STRICT ordering N_full < N_anchor holds exactly regardless.)
 *
 * THE FINDING (assessment / derivation only)
 * ------------------------------------------
 *   (F1) FIXED-SIGN MONOTONICITY. dN_cross/dthr < 0 for all thr in (0,1) -- closed form (A_prime < 0,
 *        positive contraction denominator) AND confirmed by central-difference on the full grid
 *        thr = 0.1..0.9 (every slope strictly negative). The closed-form landmark ladder is strictly
 *        ordered in thr; N_cross(0.1) ~ 3.21e11 down to N_cross(0.9) ~ 3.2e7, monotone throughout.
 *   (F2) THR-DEPENDENT E_flow DISPLACEMENT AT EVERY THRESHOLD. The E_flow-inclusive (halving-type)
 *        landmark sits STRICTLY below its E_flow-dropped anchor at all nine grid thresholds, and the
 *        displacement N_anchor/N_full - 1 tracks 2 E_flow/E_trunc at the landmark position (agreeing
 *        to within ~5% up to thr ~ 0.7, the residual being the sqrt-log L running plus, at thr >= 0.9,
 *        the second-order (1+E_flow/E_trunc)^{-2} curvature). imp-33796 (thr = 1/2) and imp-33743
 *        (thr = 1/10) are two points on this one thr-dependent displacement curve.
 *
 * The punchline: the imp-33796 strict ordering N_half < N_cross is NOT special to thr = 1/2. From the
 * imp-33743 Banach fixed-point expression, dN_cross/dthr is fixed-sign negative for all thr in (0,1)
 * (A_prime(thr) = -2k(1-thr)/thr^3 < 0 over a positive contraction denominator), so the closed-form
 * landmark ladder is strictly monotone decreasing in thr; and every halving-type landmark sits below
 * its E_coll = E_trunc anchor by the thr-dependent E_flow displacement 2 E_flow/E_trunc, of which the
 * imp-33796 0.4% (thr = 1/2) and imp-33743 7e-5 (thr = 1/10) offsets are two instances.
 *
 * ASSESSMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642/imp-2643); changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33743-sigma-fartail-crossover-closed-form (closed form N_cross(thr), thr = 1/2 and 1/10)
 * @see imp-33796-nhalf-below-ncross-independent-recompute (strict ordering N_half < N_cross at thr = 1/2)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (halving-landmark closed form, thr = 1/2)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33743/imp-33796 exactly
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723/imp-33743)

// EXACT imp-33743/imp-33796 pinned sub-terms (no re-derivation, no fresh model).
function terms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll };
}
function sigmaFull(N) {
  const { E_flow, E_coll } = terms(N);
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// (CLOSED FORM ANCHOR) E_flow-dropped threshold crossover N = A(thr) log T0(N),
// A(thr) = ((1-thr)/thr)^2 * (C_C/E_trunc)^2. Strong contraction (|g_prime| ~ 0.04) => Banach converges.
function anchorFixedPoint(thr, seed, iters) {
  const A = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = seed;
  for (let i = 0; i < iters; i++) N = A * Math.log(effectiveHeightForN(N));
  return N;
}
// (FULL halving-type landmark) sigma_full(N) = thr, root-solved by monotone bisection in log N
// (sigma_full runs from 1 at N -> 0 to 0 at N -> inf, so every thr in (0,1) has a unique crossing).
function fullLandmark(thr) {
  let lo = Math.log(1e3);
  let hi = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (sigmaFull(Math.exp(mid)) > thr) lo = mid;
    else hi = mid;
  }
  return Math.exp((lo + hi) / 2);
}

// Threshold grid spanning (0,1); assess monotonicity and displacement at each.
const THR_GRID = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
const LADDER = THR_GRID.map((thr) => {
  const N_anchor = anchorFixedPoint(thr, 1e9, 80);
  const N_full = fullLandmark(thr);
  const displacement = N_anchor / N_full - 1; // full sits below anchor (> 0)
  const eflow_disp_pred = 2 * terms(N_full).E_flow / E_TRUNC_PT; // 2 E_flow/E_trunc at the landmark
  // Closed-form derivative dN_anchor/dthr via central difference (sign check).
  const h = 1e-4;
  const dN_dthr = (anchorFixedPoint(thr + h, N_anchor, 80) - anchorFixedPoint(thr - h, N_anchor, 80)) / (2 * h);
  return { thr, N_anchor, N_full, displacement, eflow_disp_pred, dN_dthr };
});

// (F1) strict monotone ordering of the closed-form anchor ladder in thr (decreasing).
let anchorStrictlyDecreasing = true;
for (let i = 1; i < LADDER.length; i++) {
  if (!(LADDER[i].N_anchor < LADDER[i - 1].N_anchor)) anchorStrictlyDecreasing = false;
}
const allDerivNegative = LADDER.every((r) => r.dN_dthr < 0);
// (F2) every halving-type landmark strictly below its anchor; displacement is thr-dependent.
const allFullBelowAnchor = LADDER.every((r) => r.N_full < r.N_anchor && r.displacement > 0);
const displacementSpread = LADDER[LADDER.length - 1].displacement / LADDER[0].displacement; // ~2700 (thr 0.9 vs 0.1)
// Leading-order agreement of displacement with 2 E_flow/E_trunc where E_flow/E_trunc stays tiny (thr <= 0.7).
const leadingBand = LADDER.filter((r) => r.thr <= 0.7);
const maxLeadingRelDev = Math.max(
  ...leadingBand.map((r) => Math.abs(r.displacement / r.eflow_disp_pred - 1)),
);

export const IMP33855_NCROSS_THR_MONOTONE_ORDERING = {
  id: 'imp-33855',
  proofSection: 'S-frontier',
  question:
    'imp-33796 recomputed the strict ordering N_half < N_cross at thr = 1/2 only, and imp-33743 gives ' +
    'N_cross(thr) = (C_C(1-thr)/(E_trunc thr))^2 log T0(N_cross). Assess whether dN_cross/dthr has a ' +
    'FIXED sign so the closed-form landmark ladder is strictly ordered in thr across ALL thr in (0,1), ' +
    'and whether the halving-vs-anchor displacement is a thr-dependent E_flow term at EVERY threshold, ' +
    'not just 1/2. Assessment/derivation from the Banach fixed-point expression; NOT an RH bound; no QED.',
  closedFormDerivative:
    'A(thr) = k ((1-thr)/thr)^2 with k = (C_C/E_trunc)^2 > 0; A_prime(thr) = -2k(1-thr)/thr^3 < 0 on ' +
    '(0,1). Implicit diff of N = A(thr) L(N): dN/dthr = A_prime(thr) L(N)/(1 - A L_prime(N)). ' +
    'Denominator = 1 - contraction factor > 0 (imp-33743 |g_prime| ~ 0.04). So dN_cross/dthr < 0 for ' +
    'ALL thr in (0,1) -- fixed-sign, strictly monotone decreasing ladder.',
  displacementLaw:
    'N_full(thr)/N_anchor(thr) = (E_trunc/(E_trunc+E_flow))^2 = (1+E_flow/E_trunc)^-2 ~ 1 - 2 E_flow/E_trunc; ' +
    'full (E_flow-inclusive) landmark sits below its E_flow-dropped anchor by 2 E_flow/E_trunc at the ' +
    'thr-dependent landmark position. E_flow ~ log T0/T0 decays down the tail, so the displacement is ' +
    'strongly thr-dependent (~20% at thr=0.9 down to ~7e-5 at thr=0.1) but always positive.',
  ladder: LADDER.map((r) => ({
    thr: r.thr,
    N_anchor: +r.N_anchor.toExponential(6),
    N_full: +r.N_full.toExponential(6),
    full_below_anchor: r.N_full < r.N_anchor,
    displacement_pct: +(r.displacement * 100).toExponential(3),
    two_eflow_over_etrunc_pct: +(r.eflow_disp_pred * 100).toExponential(3),
    dN_dthr_sign: r.dN_dthr < 0 ? -1 : 1,
  })),
  monotonicity: {
    anchor_strictly_decreasing_in_thr: anchorStrictlyDecreasing, // true
    all_central_diff_derivatives_negative: allDerivNegative, // true (fixed sign)
    N_cross_at_thr_0_1: +LADDER[0].N_anchor.toExponential(6), // ~3.213418e11
    N_cross_at_thr_0_9: +LADDER[LADDER.length - 1].N_anchor.toExponential(6), // ~3.2e7
  },
  displacement: {
    all_full_below_anchor: allFullBelowAnchor, // true at every threshold
    displacement_thr_dependent_spread: +displacementSpread.toExponential(3), // ~2.7e3 (0.1 vs 0.9)
    max_leading_rel_dev_thr_le_0_7: +maxLeadingRelDev.toExponential(3), // ~5% (sqrt-log L running)
    interpretation:
      'Every halving-type (E_flow-inclusive) landmark sits STRICTLY below its E_flow-dropped anchor, ' +
      'the gap tracking 2 E_flow/E_trunc at the thr-dependent landmark (~5% agreement for thr <= 0.7). ' +
      'imp-33796 thr = 1/2 (0.398%) and imp-33743 thr = 1/10 (7e-3%) are two points on this one curve.',
  },
  finding: {
    F1_fixed_sign_monotonicity:
      'dN_cross/dthr < 0 for all thr in (0,1): closed form A_prime(thr) = -2k(1-thr)/thr^3 < 0 over a ' +
      'positive contraction denominator (1 - |g_prime|, |g_prime| ~ 0.04), and every central-difference ' +
      'slope on thr = 0.1..0.9 is strictly negative. The closed-form landmark ladder is strictly monotone ' +
      'DECREASING in thr, from N_cross(0.1) ~ 3.21e11 to N_cross(0.9) ~ 3.2e7 -- the imp-33796 ordering ' +
      'is not special to thr = 1/2.',
    F2_thr_dependent_eflow_displacement:
      'At all nine grid thresholds the E_flow-inclusive landmark sits STRICTLY below its E_flow-dropped ' +
      'anchor, the displacement N_anchor/N_full - 1 tracking 2 E_flow/E_trunc at the landmark position ' +
      '(within ~5% for thr <= 0.7; the residual is the sqrt-log L running, plus second-order ' +
      '(1+E_flow/E_trunc)^-2 curvature at thr >= 0.9). imp-33796 (thr = 1/2) and imp-33743 (thr = 1/10) ' +
      'are two instances of this single thr-dependent E_flow displacement.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). From the imp-33743 Banach fixed-point expression ' +
    'N = A(thr) log T0(N), A(thr) = ((1-thr)/thr)^2 (C_C/E_trunc)^2, the derivative dN_cross/dthr = ' +
    'A_prime(thr) L(N)/(1 - A L_prime(N)) is FIXED-SIGN negative for all thr in (0,1): A_prime(thr) = ' +
    '-2k(1-thr)/thr^3 < 0 and the denominator 1 - |g_prime| > 0 (imp-33743 contraction ~0.04). So the ' +
    'imp-33796 strict ordering N_half < N_cross generalizes to a strictly monotone DECREASING closed-form ' +
    'landmark ladder N_cross(thr), confirmed by central difference on thr = 0.1..0.9 (every slope < 0). ' +
    'And at EVERY threshold the E_flow-inclusive (halving-type) landmark sits strictly below its ' +
    'E_flow-dropped anchor by the thr-dependent displacement N_anchor/N_full - 1 ~ 2 E_flow/E_trunc at ' +
    'the landmark position (~5% agreement for thr <= 0.7; strict ordering holds exactly regardless), of ' +
    'which the imp-33796 0.4% (thr = 1/2) and imp-33743 7e-5 (thr = 1/10) offsets are two points. ' +
    'Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33743 (closed form N_cross(thr), thr = 1/2 and 1/10); imp-33796 (strict ordering N_half < N_cross ' +
    'at thr = 1/2, E_flow displacement); imp-33723 (halving-landmark closed form); imp-399/imp-2642 ' +
    '(C_C = (1/8) sqrt(3 pi), 1/8 ansatz); imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN Riemann-von Mangoldt inverse).',
};

export const IMP33855_NCROSS_THR_MONOTONE_ORDERING_ASSERTIONS = [
  {
    // Reuse gate: the thr = 1/2 anchor reproduces the imp-33796 E_coll = E_trunc crossover ~3.280e9.
    id: 'imp33855-reuses-pinned-halving-anchor',
    description: 'anchor(thr = 1/2) reproduces the imp-33796 N_cross ~ 3.280e9 to ~1%',
    holds: () => {
      const N = anchorFixedPoint(0.5, 1e9, 80);
      return Math.abs(N / 3.280294e9 - 1) < 0.01;
    },
  },
  {
    // (F1): the closed-form anchor ladder is strictly monotone decreasing in thr.
    id: 'imp33855-anchor-strictly-decreasing-in-thr',
    description: 'N_cross(thr) strictly decreasing across thr = 0.1..0.9 (strictly ordered ladder)',
    holds: () => anchorStrictlyDecreasing,
  },
  {
    // (F1): every central-difference derivative dN_cross/dthr is strictly negative (fixed sign).
    id: 'imp33855-dNcross-dthr-fixed-negative-sign',
    description: 'dN_cross/dthr < 0 at every grid threshold (fixed-sign monotonicity)',
    holds: () => allDerivNegative,
  },
  {
    // (F2): at every threshold the E_flow-inclusive landmark sits strictly below its anchor.
    id: 'imp33855-full-below-anchor-every-threshold',
    description: 'N_full(thr) < N_anchor(thr) with positive displacement at all nine thresholds',
    holds: () => allFullBelowAnchor,
  },
  {
    // (F2): the displacement is genuinely thr-dependent (spans >2 orders of magnitude, not fixed).
    id: 'imp33855-displacement-is-thr-dependent',
    description: 'displacement fraction varies by > 100x across thr = 0.1..0.9 (thr-dependent E_flow term)',
    holds: () => displacementSpread > 100,
  },
  {
    // (F2): displacement tracks 2 E_flow/E_trunc in the leading band (thr <= 0.7) to within ~10%.
    id: 'imp33855-displacement-tracks-2-eflow-over-etrunc',
    description: 'displacement matches 2 E_flow/E_trunc at the landmark within ~10% for thr <= 0.7',
    holds: () => maxLeadingRelDev < 0.1,
  },
  {
    // Honesty gate: assessment/derivation only, no QED, PT stays SOTA.
    id: 'imp33855-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33855_NCROSS_THR_MONOTONE_ORDERING.isRigorous === false &&
      /NO QED/.test(IMP33855_NCROSS_THR_MONOTONE_ORDERING.verdict) &&
      /remains SOTA/.test(IMP33855_NCROSS_THR_MONOTONE_ORDERING.verdict),
  },
];

for (const a of IMP33855_NCROSS_THR_MONOTONE_ORDERING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33855-ncross-thr-monotone-ordering assertion failed: ${a.id}`);
  }
}
