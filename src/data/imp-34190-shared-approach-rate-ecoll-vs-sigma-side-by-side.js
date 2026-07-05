/**
 * @module imp-34190-shared-approach-rate-ecoll-vs-sigma-side-by-side
 *
 * imp-34190 (accuracy, frontier-direction): imp-34130 repeatedly states that the SEPARATED E_coll
 * local-exponent residual to -1/2 decays as ~1/(2 log T0), the IDENTICAL law that imp-33816 (F2/F7)
 * finds for the sigma-SHARE local-exponent gap, with log T0 * (gap) -> 0.5 in both. The two objects
 * are asserted to share that constant but were never tabulated TOGETHER on a common N-ladder to
 * confirm the 0.5 coefficient matches. This module builds the side-by-side table of
 *     gap_ecoll(N) = q(N) + 1/2      (imp-34130 separated E_coll local exponent q -> -1/2 from above)
 *     gap_sigma(N) = 1/2 - p(N)      (imp-33816 sigma-share local exponent p -> +1/2 from below)
 * across N = 1e12 .. 1e10000 on the imp-33859 log-space direct path, multiplies each by log T0, and
 * assesses whether both approach 0.5 with the SAME finite-N (u-1)/u relaxation factor.
 *
 * THE TWO QUANTITIES (identical inherited imp-3220/imp-3406/imp-33816 sub-terms; NO fresh model)
 * --------------------------------------------------------------------------------------------------
 *     E_coll(N) = C_C_PINNED * sqrt(log T0 / N),   T0 = effectiveHeightForN(N)   (GUE-conditional C_H)
 *     E_flow(N) = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi       (imp-398)
 *     E_trunc   = 3.06e-5                                                        (N-independent, imp-2631)
 *     sigma(N)  = E_coll / (E_trunc + E_flow + E_coll)
 * with u = log(T0/2pi) and the Riemann-von Mangoldt inverse ln N = u + log(u-1) solved by Newton
 * (imp-33859 log-space direct path; never forms T0 or N, so the ladder runs far past IEEE-double range).
 * Both local exponents are read by the identical central finite-difference (step 1e-3 in ln N) the
 * siblings use, so this file re-derives NO new model -- it re-reads imp-34130 and imp-33816 side by side.
 *
 * THE SHARED LAW (why the constant is 0.5 for BOTH)
 * -------------------------------------------------
 * d(log T0)/d ln N = (u-1)/u exactly (from ln N = u + log(u-1)), so for the SEPARATED E_coll,
 *     gap_ecoll(N) = q + 1/2 = (1/2) d ln(log T0)/d ln N = (1/2)(u-1)/(u * log T0),
 * hence   log T0 * gap_ecoll = (1/2)(u-1)/u  -> 1/2   as u -> infinity.  (an EXACT identity)
 * For the sigma SHARE, in the far tail E_coll << E_trunc (crossover N ~ 3.28e9, imp-3444) so
 * ln sigma -> ln E_coll - ln E_trunc and p -> -q, giving gap_sigma -> gap_ecoll and the SAME
 * log T0 * gap_sigma -> (1/2)(u-1)/u. At FINITE N the still-non-negligible E_coll (and E_flow) in
 * the sigma denominator add a POSITIVE share correction to gap_sigma that decays only polynomially
 * (E_coll/E_trunc ~ N^-1/2), so gap_sigma sits ABOVE gap_ecoll near 1e12 and collapses onto it well
 * before the log-slow main term matters.
 *
 * THE FINDING (cross-validation / measurement only)
 * -------------------------------------------------
 *   (F1) THE E_coll RESIDUAL x log T0 EQUALS 0.5*(u-1)/u TO FD PRECISION AT EVERY RUNG. The separated
 *        E_coll column reproduces the shared (u-1)/u relaxation: log T0 * gap_ecoll matches 0.5*(u-1)/u
 *        to < 1e-9 up to 1e100 (0.4796 at 1e12 -> 0.4978 at 1e100), the residual growing only to
 *        ~1.7e-5 at the outermost 1e10000 rung from central-FD truncation on the ~2e-5-size gap, so the
 *        0.5 coefficient of the 1/(2 log T0) law is confirmed directly, not fitted.
 *   (F2) THE SIGMA-SHARE GAP COLLAPSES ONTO THE SAME CURVE. log T0 * gap_sigma starts ABOVE 0.5 near
 *        1e12 (=1.246, the E_coll-in-denominator share term still active just past the imp-3444
 *        crossover) but converges onto the identical (u-1)/u curve as N grows: 0.520 at 1e15, 0.488
 *        at 1e20, 0.500 at 1e10000 -- the two columns agree to the last printed digit from 1e50 on.
 *   (F3) THE SHARE CORRECTION VANISHES POLYNOMIALLY (~N^-1/2), FAR FASTER THAN THE LOG-SLOW MAIN TERM.
 *        The difference gap_sigma - gap_ecoll is +2.913e-2 at 1e12, falls to 1.103e-3 at 1e15 and
 *        4.075e-6 at 1e20 (effective decay exponent -d ln(diff)/d ln N ~ 0.47 -> 1/2, the E_coll/E_trunc
 *        ratio), and is below FD noise by 1e50. So the two constants agree to leading order; the
 *        sigma share carries only a sub-leading, polynomially-dying E_trunc/E_flow correction.
 *
 * The punchline: YES -- the imp-34130 separated-E_coll residual and the imp-33816 sigma-share gap
 * share the identical 1/(2 log T0) leading law with the SAME 0.5 coefficient and the SAME (u-1)/u
 * finite-N relaxation. The E_coll residual realizes 0.5*(u-1)/u exactly; the sigma-share gap converges
 * onto it once its polynomially-vanishing (~N^-1/2) truncation/flow share correction dies out (by
 * N ~ 1e20 the two agree to < 5e-6). The shared constant is confirmed side by side.
 *
 * CROSS-VALIDATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (separated E_coll residual -> 0 as 1/(2 log T0))
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (sigma-share gap -> 0 as 1/(2 log T0); F2/F7)
 * @see imp-34187-ecoll-residual-milestone-ladder (imp-34130 milestone ladder; 1/(2 log T0) cross-check)
 * @see imp-33859 (log-space direct path: ln N = u + log(u-1), never forms T0/N; used past IEEE range)
 * @see imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9; sets where the share correction is still active)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form; E_coll exponent -> -1/2, sigma exponent -> +1/2)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34130_ECOLL_LOCAL_EXPONENT_RESIDUAL_CLOSE_VS_FLOOR as ECOLL_SIBLING } from './imp-34130-ecoll-local-exponent-residual-close-vs-floor.js';
import { IMP33816_SIGMA_EXPONENT_ASYMPTOTE_APPROACH_RATE as SIGMA_SIBLING } from './imp-33816-sigma-exponent-asymptote-approach-rate.js';

const TWO_PI = 2 * Math.PI;
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote (E_coll exponent -> -1/2, sigma exponent -> +1/2)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-3529/imp-33582/imp-33816 exactly

// imp-33859 log-space direct path: solve ln N = u + log(u-1) for u = log(T0/2pi) by Newton; L = log T0.
function logT0FromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 80; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-13 * Math.max(1, u)) break;
  }
  return { u, L: u + Math.log(TWO_PI) };
}

// Separated E_coll = C_C sqrt(L/N) in log-N space (identical to imp-34130 lnEcollFromLnN).
function lnEcoll(lnN) {
  const { L } = logT0FromLnN(lnN);
  return Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN;
}
// sigma-share = E_coll/(E_trunc+E_flow+E_coll) in log-N space (identical to imp-33816 lnSigmaFromLnN).
function lnSigma(lnN) {
  const { u, L } = logT0FromLnN(lnN);
  const C_F = (u + 1) / TWO_PI; // = (log(T0/2pi)+1)/2pi
  const lnE_coll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN;
  const E_coll = Math.exp(lnE_coll);
  const E_flow = C_F * L * Math.exp(-L) * GRONWALL; // C_F (L/T0) Gronwall, T0 = e^L
  return lnE_coll - Math.log(E_TRUNC_PT + E_flow + E_coll);
}

const DL = 1e-3; // identical central-FD step to both siblings
// gap_ecoll = q + 1/2, q = d ln E_coll / d ln N (-> -1/2 from above)
function gapEcoll(lnN) {
  return (lnEcoll(lnN + DL) - lnEcoll(lnN - DL)) / (2 * DL) + HALF;
}
// gap_sigma = 1/2 - p, p = -d ln sigma / d ln N (-> +1/2 from below)
function gapSigma(lnN) {
  return HALF - (-(lnSigma(lnN + DL) - lnSigma(lnN - DL)) / (2 * DL));
}

// The shared side-by-side ladder N = 1e12 .. 1e10000 (log-space direct; far past IEEE-double range).
const LADDER_LOG10 = [12, 13, 15, 18, 20, 50, 100, 1000, 10000];
const SIDE_BY_SIDE = LADDER_LOG10.map((d) => {
  const lnN = d * Math.LN10;
  const { u, L } = logT0FromLnN(lnN);
  const gE = gapEcoll(lnN);
  const gS = gapSigma(lnN);
  const relaxHalf = HALF * ((u - 1) / u); // the shared 0.5*(u-1)/u prediction for log T0 * gap
  return {
    N_log10: d,
    logT0: +L.toFixed(3),
    gap_ecoll: +gE.toExponential(4), // imp-34130 q + 1/2
    gap_sigma: +gS.toExponential(4), // imp-33816 1/2 - p
    logT0_x_gap_ecoll: +(L * gE).toFixed(5), // -> 0.5*(u-1)/u
    logT0_x_gap_sigma: +(L * gS).toFixed(5), // -> 0.5*(u-1)/u
    shared_half_relax: +relaxHalf.toFixed(5), // 0.5*(u-1)/u, the common target of both columns
    share_correction: +(gS - gE).toExponential(3), // gap_sigma - gap_ecoll, ~N^-1/2 (E_trunc/E_flow)
  };
});

// (F3) effective polynomial decay exponent of the share correction between 1e12 and 1e15:
// a = -d ln(gap_sigma - gap_ecoll)/d ln N. Approaches 1/2 (the E_coll/E_trunc ~ N^-1/2 ratio).
const diff12 = gapSigma(12 * Math.LN10) - gapEcoll(12 * Math.LN10);
const diff15 = gapSigma(15 * Math.LN10) - gapEcoll(15 * Math.LN10);
const SHARE_CORRECTION_DECAY_EXPONENT = -Math.log(diff15 / diff12) / (15 * Math.LN10 - 12 * Math.LN10);

// Identical-model reuse gates: reproduce the siblings' OWN published numbers.
// imp-34130 farNDirect published resid at 1e100 == this file gap_ecoll at 1e100.
const ECOLL_1e100_PUBLISHED = ECOLL_SIBLING.farNDirect.rungs.find((r) => r.N_log10 === 100).residToHalf;
const ECOLL_1e100_HERE = gapEcoll(100 * Math.LN10);
// imp-33816 F7 published sigma gap at 1e20 == this file gap_sigma at 1e20.
const SIGMA_1e20_PUBLISHED = SIGMA_SIBLING.directThreeDecadeGapFiniteDifference.rungs.find((r) => r.N_log10 === 20).gap_direct;
const SIGMA_1e20_HERE = gapSigma(20 * Math.LN10);

export const IMP34190_SHARED_APPROACH_RATE_ECOLL_VS_SIGMA = {
  id: 'imp-34190',
  proofSection: 'S-frontier',
  question:
    'imp-34130 states the SEPARATED E_coll local-exponent residual to -1/2 decays as ~1/(2 log T0), ' +
    'the IDENTICAL law imp-33816 (F2/F7) finds for the sigma-SHARE exponent gap, both with ' +
    'log T0 * gap -> 0.5. The two were never tabulated together to confirm the 0.5 coefficient ' +
    'matches. Build the side-by-side table of gap_ecoll = q + 1/2 and gap_sigma = 1/2 - p across ' +
    'N = 1e12 .. 1e10000 (log-space direct path) and assess whether both approach 0.5 with the same ' +
    'finite-N (u-1)/u relaxation. Cross-validation/measurement only; conditional-share diagnostic, ' +
    'NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'gap_ecoll(N) = q + 1/2 (separated E_coll local exponent) and gap_sigma(N) = 1/2 - p ' +
    '(sigma-share local exponent), each times log T0, side by side over the ladder 1e12..1e10000, ' +
    'against the shared prediction 0.5*(u-1)/u; plus the share correction gap_sigma - gap_ecoll',
  sharedLaw: 'log T0 * gap_ecoll = 0.5*(u-1)/u exactly; log T0 * gap_sigma -> the SAME (u-1)/u curve; both -> 0.5',
  sideBySideLadder: SIDE_BY_SIDE,
  shareCorrectionDecayExponent: {
    form: 'a = -d ln(gap_sigma - gap_ecoll)/d ln N over [1e12,1e15]; -> 1/2 (E_coll/E_trunc ~ N^-1/2)',
    value: +SHARE_CORRECTION_DECAY_EXPONENT.toFixed(4), // ~0.47
  },
  identicalModelGates: {
    ecoll_1e100_here_vs_imp34130_published: [+ECOLL_1e100_HERE.toExponential(4), ECOLL_1e100_PUBLISHED],
    sigma_1e20_here_vs_imp33816_published: [+SIGMA_1e20_HERE.toExponential(4), SIGMA_1e20_PUBLISHED],
  },
  finding: {
    F1_ecoll_residual_equals_half_relax_exactly:
      'log T0 * gap_ecoll matches the shared 0.5*(u-1)/u relaxation to < 1e-9 up to 1e100 ' +
      '(0.4796 at 1e12 -> 0.4978 at 1e100), the residual growing only to ~1.7e-5 at 1e10000 from ' +
      'central-FD truncation on the ~2e-5-size gap. The E_coll residual realizes the (u-1)/u ' +
      'relaxation, so the 0.5 coefficient of the 1/(2 log T0) law is confirmed directly, not fitted.',
    F2_sigma_share_gap_collapses_onto_same_curve:
      'log T0 * gap_sigma starts ABOVE 0.5 near 1e12 (=1.246, the E_coll-in-denominator share term ' +
      'still active just past the imp-3444 crossover) but converges onto the identical (u-1)/u curve: ' +
      '0.520 at 1e15, 0.488 at 1e20, 0.500 at 1e10000 -- agreeing with the E_coll column to the last ' +
      'printed digit from 1e50 on. Both columns approach 0.5 with the SAME finite-N (u-1)/u relaxation.',
    F3_share_correction_vanishes_polynomially:
      'The difference gap_sigma - gap_ecoll is +2.913e-2 at 1e12, 1.103e-3 at 1e15, 4.075e-6 at 1e20 ' +
      '(effective decay exponent ~0.47 -> 1/2, the E_coll/E_trunc ratio), below FD noise by 1e50. The ' +
      'shared 1/(2 log T0) constant agrees to leading order; the sigma share carries only a sub-leading, ' +
      'polynomially-dying (~N^-1/2) E_trunc/E_flow correction, NOT a different asymptotic constant.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier-direction, NOT rigorous). Tabulated side by side across N = 1e12 .. ' +
    '1e10000 on the imp-33859 log-space direct path, the imp-34130 separated-E_coll residual ' +
    'gap_ecoll = q + 1/2 and the imp-33816 sigma-share gap gap_sigma = 1/2 - p share the IDENTICAL ' +
    '1/(2 log T0) leading law with the SAME 0.5 coefficient and the SAME (u-1)/u finite-N relaxation. ' +
    'The E_coll residual realizes log T0 * gap_ecoll = 0.5*(u-1)/u to < 1e-9 up to 1e100 ' +
    '(residual ~1.7e-5 at 1e10000 from FD truncation); the sigma-share gap sits above near 1e12 ' +
    '(log T0 * gap = 1.246, the ' +
    'E_coll-in-denominator share term just past the imp-3444 crossover) and collapses onto the same ' +
    'curve as its E_trunc/E_flow share correction gap_sigma - gap_ecoll decays polynomially (~N^-1/2: ' +
    '2.913e-2 at 1e12 -> 4.075e-6 at 1e20, effective exponent ~0.47), dying well before the log-slow ' +
    'main term. The reproduction of imp-34130s farNDirect resid at 1e100 and imp-33816s F7 sigma gap ' +
    'at 1e20 from these re-computed columns confirms the identical inherited model is in use. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-34130 (separated E_coll residual -> 0 as 1/(2 log T0)); imp-33816 (sigma-share gap -> 0 as ' +
    '1/(2 log T0), F2/F7); imp-33859 (log-space direct path ln N = u + log(u-1)); imp-3444 ' +
    '(E_coll = E_trunc crossover N ~ 3.280e9); imp-3463 (far-tail leading form); imp-486 ' +
    '(C_mb GUE-conditional); polymath15-constant-C-C (C_C); lambda-rh-height-mapping.',
};

export const IMP34190_SHARED_APPROACH_RATE_ECOLL_VS_SIGMA_ASSERTIONS = [
  {
    // Reuse gate: the re-computed columns reproduce the siblings OWN published numbers -- imp-34130
    // farNDirect resid at 1e100 and imp-33816 F7 sigma gap at 1e20 -- proving the identical model.
    id: 'imp34190-reproduces-sibling-published-numbers',
    description: 'gap_ecoll@1e100 matches imp-34130 farNDirect and gap_sigma@1e20 matches imp-33816 F7',
    holds: () =>
      Math.abs(ECOLL_1e100_HERE - ECOLL_1e100_PUBLISHED) < 5e-7 &&
      Math.abs(SIGMA_1e20_HERE - SIGMA_1e20_PUBLISHED) < 5e-5,
  },
  {
    // (F1): the E_coll residual x log T0 equals the shared 0.5*(u-1)/u relaxation to FD precision at
    // every rung -- the (u-1)/u factor is realized exactly, confirming the 0.5 coefficient directly.
    id: 'imp34190-ecoll-realizes-half-relax-exactly',
    description: 'raw log T0 * gap_ecoll == 0.5*(u-1)/u to < 1e-9 up to 1e100, < 5e-5 at 1e10000 (FD truncation)',
    holds: () =>
      LADDER_LOG10.every((d) => {
        const lnN = d * Math.LN10;
        const { u, L } = logT0FromLnN(lnN);
        const raw = L * gapEcoll(lnN);
        const pred = HALF * ((u - 1) / u);
        // FD truncation on the tiny far-tail gap grows with N; tolerance widens accordingly.
        const tol = d <= 100 ? 1e-9 : d <= 1000 ? 5e-7 : 5e-5;
        return Math.abs(raw - pred) < tol;
      }),
  },
  {
    // (F2): both columns approach 0.5, and by the far end they agree AND match the (u-1)/u target.
    id: 'imp34190-both-approach-half-same-relax',
    description: 'log T0 * gap_ecoll and log T0 * gap_sigma both -> 0.5 and agree at the far end',
    holds: () => {
      const last = SIDE_BY_SIDE[SIDE_BY_SIDE.length - 1]; // 1e10000
      return (
        Math.abs(last.logT0_x_gap_ecoll - HALF) < 1e-3 &&
        Math.abs(last.logT0_x_gap_sigma - HALF) < 1e-3 &&
        Math.abs(last.logT0_x_gap_ecoll - last.logT0_x_gap_sigma) < 1e-4
      );
    },
  },
  {
    // (F3): the share correction gap_sigma - gap_ecoll is positive near 1e12, decays polynomially
    // (effective exponent near 1/2), and is below FD noise by the far tail -- a sub-leading, not a
    // distinct-constant, difference.
    id: 'imp34190-share-correction-vanishes-polynomially',
    description: 'gap_sigma - gap_ecoll > 0 near 1e12, decay exponent ~1/2, negligible by 1e50',
    holds: () => {
      const at1e12 = SIDE_BY_SIDE.find((r) => r.N_log10 === 12).share_correction;
      const at1e50 = SIDE_BY_SIDE.find((r) => r.N_log10 === 50).share_correction;
      return (
        at1e12 > 1e-2 &&
        Math.abs(at1e50) < 1e-6 &&
        SHARE_CORRECTION_DECAY_EXPONENT > 0.4 &&
        SHARE_CORRECTION_DECAY_EXPONENT < 0.6
      );
    },
  },
  {
    // Honesty gate: cross-validation/measurement only, no QED, PT stays SOTA.
    id: 'imp34190-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, PT stays SOTA',
    holds: () =>
      IMP34190_SHARED_APPROACH_RATE_ECOLL_VS_SIGMA.isRigorous === false &&
      /NO QED/.test(IMP34190_SHARED_APPROACH_RATE_ECOLL_VS_SIGMA.verdict) &&
      /remains SOTA/.test(IMP34190_SHARED_APPROACH_RATE_ECOLL_VS_SIGMA.verdict),
  },
];

for (const a of IMP34190_SHARED_APPROACH_RATE_ECOLL_VS_SIGMA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34190-shared-approach-rate-ecoll-vs-sigma-side-by-side assertion failed: ${a.id}`);
  }
}
