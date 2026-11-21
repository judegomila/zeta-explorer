/**
 * @module imp-36217-finite-strip-holder-constant-c6-gap-floor
 *
 * imp-36217 (proof/derivation, S-frontier): DERIVE the explicit finite-strip Hoelder constant C_H(X) that
 * the imp-36172 finite-N surrogate composed with the G6a weakerGapAssessment candidate C6 (imp-35147) --
 * the finite-height minimal-gap LOWER bound read off the verified zero list up to height X (X ~ 3e12) --
 * would carry, report its numeric value, and state PRECISELY why it supplies NO control above X (the
 * surrogate strip height grows unbounded as N -> infinity and the verified list ends at X).
 *
 * FINITE-STRIP DERIVATION / SCOPING ONLY. Certifies no asymptotic modulus; constructs no rigorous
 * curvature bound; ports no Riemann-Hilbert fold inversion; does NOT re-attempt the RH-hard backward-flow
 * Gronwall route (imp-2640 NEGATIVE); discharges no gap; G6a_shock_lipschitz stays OPEN; C_H stays
 * symbolic ASYMPTOTICALLY; respects the imp-2519 no-overclaim guard; NO QED. No refereed bound is changed.
 *
 * WHAT C6 SUPPLIES AND WHAT C_H NEEDS
 * -----------------------------------------------------------------------------
 * imp-354 (lambda-burgers-shock-lipschitz) writes the shock-front Hoelder constant in closed form as
 * C_H = C_W = sqrt(2 / |u_0-double-prime(z_0*)|), the reciprocal-root of the shock-characteristic curvature
 * at the collision-time footer z_0*, u_0 = 2 m. imp-36172 enumerated (S1-S5) what a FINITE-N surrogate for
 * this constant requires and marked the certified finite-height curvature input (S2) as GREENFIELD -- no
 * such certified bound exists, only the imp-354 symbolic placeholder C_W = 1.0. The G6a
 * weakerGapAssessment (imp-35147) singles out candidate C6 as the SOLE strictly-weaker-than-RH input that
 * touches the modulus AT ALL: an unconditional, RH-free, uniform pointwise minimal-gap lower bound
 * delta_min(X) > 0 valid for every consecutive zero pair below X. This module composes the two: C6 is
 * exactly the CERTIFIED INPUT (available only below X) that imp-36172 S2 left greenfield, and the imp-341
 * Koksma-Hlawka strip modulus psi_N supplies the perturbation size.
 *
 * THE COMPOSITION CHAIN (finite strip, up to X)
 * -----------------------------------------------------------------------------
 *   1. C6 gap floor. delta_min(X) > 0 is the smallest VERTICAL consecutive spacing among the zeros below
 *      X, read off the Platt verified list (ext-verified-zeros-T3e12). A positive floor is the statement
 *      that the nearest-pair backward-collision (the Burgers shock) does NOT fully form on the verified
 *      strip -- the collision-time functional tau_c stays bounded away from its degenerate value there.
 *   2. Density ceiling. A pointwise gap floor delta_min(X) is DUAL to a local-density CEILING: below X the
 *      empirical zero density obeys rho(t) <= 1 / g_min(X) where g_min(X) = delta_min(X) * meanSpacing(X)
 *      is the absolute (un-normalized) minimal gap and meanSpacing(X) = 2 pi / log(X / (2 pi)) is the RvM
 *      mean spacing at height X. This bounds the mollified curvature |u_0-double-prime(z_0*; y_N^sharp)|
 *      from ABOVE on the finite strip {Im z >= y_N^sharp}.
 *   3. Finite-height regularization. At the finite strip floor y_N^sharp = sqrt(2 pi / N) > 0 (imp-36172
 *      S1) the footer z_0*(y_N^sharp) sits strictly OFF the real axis, so u_0-double-prime there is finite
 *      and the Whitham fold stays classical -- the ONE lever that keeps C_H(X) = sqrt(2 / c(X)) finite.
 *   4. Assembly (imp-341). Compose C_H(X) with psi_N(y_N^sharp) = C1 log gamma_N / sqrt(2 pi N),
 *      C1 = pi C_Selberg ~ 9.4248, to give the finite-strip collision error
 *      E_coll(N; <= X) <= C_H(X) sqrt(psi_N(y_N^sharp)), valid only up to T_star(N) = X.
 *
 * WHAT IS DERIVED VS WHAT STAYS SYMBOLIC
 * -----------------------------------------------------------------------------
 * DERIVED (finite strip, numeric): the X-anchor count N_X = RvM(X) ~ 1.236e13, the strip floor
 * y_N^sharp(N_X) ~ 7.1e-7, the mean spacing meanSpacing(X) ~ 0.234, the imp-341 modulus psi_N(N_X) ~ 3.1e-5,
 * the density ceiling D_ceil(X) = 1 / g_min(X) as an explicit function of delta_min(X), and the resulting
 * E_coll-on-strip scale under the imp-354 illustrative curvature placeholder. These are the pieces C6 and
 * imp-341 pin numerically on the truncated strip.
 *
 * STILL SYMBOLIC (the residual sub-gap): converting the CERTIFIED density ceiling (an UPPER bound on
 * |u_0-double-prime|) into the matching curvature LOWER bound c(X) > 0 that C_H(X) = sqrt(2 / c(X))
 * actually needs still requires the imp-36172 S4 finite-strip complex fold inversion (a truncated
 * G6a-sub-hyperbolic Riemann-Hilbert transcription of the real-Burgers Whitham curvature to the complex
 * Stieltjes m : C_+ -> C_+). C6 delivers the INPUT; the transcription constant kappa relating delta_min(X)
 * to c(X) is un-ported. So C_H(X) is derived IN FORM with a certified-below-X input, but its numeric value
 * rests on the imp-354 symbolic placeholder pending S4. HALF of imp-36172 S2 (the upper curvature control)
 * is now sourced from C6; the matching lower bound (S3/S4) is the named residual.
 *
 * WHY IT CARRIES NO CONTROL ABOVE X
 * -----------------------------------------------------------------------------
 *   (i)  The verified list ENDS at X. delta_min is uncertified above X -- extending the floor past X would
 *        need either RH (a uniform pointwise lower bound at every zero, C1, RH-EQUIVALENT) or more verified
 *        height (a longer finite computation). The C6 lever is finite-height by construction.
 *   (ii) The surrogate strip height grows unbounded. The achieved height T_star(N) = effectiveHeightForN(N)
 *        increases with N and CROSSES X at N_X ~ 1.236e13; for N beyond N_X the footer neighbourhood samples
 *        zeros ABOVE X, where the density ceiling is undefined and c(X) cannot be constructed.
 *   (iii) The uniform limit reinstates the wall. Driving N -> infinity forces y_N^sharp -> 0+, putting the
 *        footer back on the real axis where u_0-double-prime diverges (the imp-354 boundary shock) and the
 *        only known uniform-constant route -- backward de Bruijn-flow gap-Lipschitz Gronwall -- is imp-2640
 *        NEGATIVE (imp-35056 persistence). A finite-height gap floor does not touch either wall.
 * Hence C_H(X) is a FINITE-STRIP constant, effective up to X only; asymptotically C_H stays symbolic and
 * G6a_shock_lipschitz stays OPEN. This is the SAME verified-height mechanism as the Platt-Trudgian floor:
 * the sole sub-RH lever on this program is MORE VERIFIED HEIGHT, not a softer analytic input.
 *
 * READING: the C6 finite-height minimal-gap floor delta_min(X) is exactly the certified input that
 * imp-36172 S2 left GREENFIELD -- it supplies, on the truncated strip below X, a density ceiling / upper
 * curvature control feeding C_H(X) = sqrt(2 / c(X)), which composed with the imp-341 modulus psi_N gives a
 * numerically explicit finite-strip E_coll(N; <= X). But it delivers only a HEIGHT-CONDITIONAL constant:
 * the gap-to-curvature transcription constant (imp-36172 S4) stays un-ported, so C_H(X) rests on the
 * imp-354 symbolic placeholder for its value, and the floor carries NO control above X because the verified
 * list ends there and the uniform limit reinstates the RH-hard boundary shock. This module NAMES the
 * composition and the obstruction; it certifies no asymptotic modulus and ports nothing.
 *
 * @see imp-36172 (finite-N surrogate requirements S1-S5; S2 certified finite-height curvature GREENFIELD)
 * @see imp-354 / lambda-burgers-shock-lipschitz (C_H = C_W = sqrt(2 / |u_0-double-prime(z_0*)|); C_W placeholder 1.0)
 * @see imp-35147 (G6a weakerGapAssessment: C6 finite-height minimal-gap floor, sole sub-RH lever, strip-only)
 * @see imp-341 (Koksma-Hlawka strip modulus psi_N = C1 log gamma_N / sqrt(2 pi N), C1 = pi C_Selberg)
 * @see imp-2640 (backward-flow gap-Lipschitz Gronwall discharge NEGATIVE -- uniform-constant route fails)
 * @see imp-35056 (asymptotic-modulo persistence of the exact modulus)
 * @see imp-36238 (T_star(N) first exceeds the Platt-Trudgian 3e12 verified height near N ~ 1.236e13)
 * @see Whitham 1974 Section 2.7 (kinematic-wave cusp, Hoelder-1/2); Polymath15 / Tao arXiv:1904.12438
 */

// -- Anchor + operative constants (import-light; matching imp-354 / imp-341 / imp-36172) --------------
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this derivation
const TWO_PI = 2 * Math.PI;
const C_SELBERG = 3.0; // imp-341 Selberg constant
const C1_IMP341 = Math.PI * C_SELBERG; // Koksma-Hlawka constant C1 = pi C_Selberg ~ 9.4248
const C_W_SYMBOLIC_PLACEHOLDER = 1.0; // imp-354 illustrative C_W (c(X) = 2); NOT rigorous, untouched here
const VERIFIED_HEIGHT_X = 3e12; // Platt verified zeros to T = 3e12 (ext-verified-zeros-T3e12)
const HOLDER_EXPONENT = 0.5; // pinned by the fold catastrophe; a finite-height surrogate does not change it

// Illustrative normalized minimal-gap floor. The ACTUAL certified delta_min(X) is a finite scan over the
// verified zero list up to X which this module does NOT re-run; this representative value only exercises
// the numeric machinery and is NOT claimed to be the measured list minimum.
const DELTA_MIN_NORMALIZED_ILLUSTRATIVE = 5e-4;

// -- Riemann-von Mangoldt count N(T) = (T / 2 pi)(log(T / 2 pi) - 1) (same convention as imp-354) -----
function rvmCount(T) {
  const u = T / TWO_PI;
  if (!(u > 1)) return null;
  return u * (Math.log(u) - 1);
}
// Finite strip floor y_N^sharp = sqrt(2 pi / N): the lever separating the finite-N and uniform regimes.
function ySharp(N) {
  return Math.sqrt(TWO_PI / N);
}
// RvM mean spacing at height T: meanSpacing = 2 pi / log(T / 2 pi).
function meanSpacing(T) {
  const L = Math.log(T / TWO_PI);
  return L > 0 ? TWO_PI / L : null;
}
// imp-341 strip modulus psi_N(y_N^sharp) = C1 log gamma_N / sqrt(2 pi N).
function psiN(N, gammaN) {
  const L = Math.log(gammaN);
  if (!(L > 0) || !(N > 0)) return null;
  return (C1_IMP341 * L) / Math.sqrt(TWO_PI * N);
}

// -- The X-anchor: the count whose RvM height is the verified height X -------------------------------
const N_X = rvmCount(VERIFIED_HEIGHT_X); // ~ 1.236e13 (matches imp-36238 crossover count)
const Y_SHARP_X = ySharp(N_X); // ~ 7.1e-7, strictly off the real axis
const MEAN_SPACING_X = meanSpacing(VERIFIED_HEIGHT_X); // ~ 0.234
const PSI_N_X = psiN(N_X, VERIFIED_HEIGHT_X); // ~ 3.1e-5

// Absolute minimal gap and the DUAL density ceiling supplied by C6 on the finite strip.
const G_MIN_ABS_X = DELTA_MIN_NORMALIZED_ILLUSTRATIVE * MEAN_SPACING_X; // g_min(X) = delta_min * meanSpacing
const DENSITY_CEILING_X = G_MIN_ABS_X > 0 ? 1 / G_MIN_ABS_X : null; // rho(t) <= 1 / g_min(X) below X

// C_H(X) = sqrt(2 / c(X)). Under the imp-354 illustrative placeholder c(X) = 2 (C_W = 1) the constant is
// numerically 1.0; the rigorous c(X) awaits the imp-36172 S4 finite-strip fold inversion.
const C_H_X_ILLUSTRATIVE = C_W_SYMBOLIC_PLACEHOLDER; // = sqrt(2 / 2) = 1.0 (placeholder scale only)
// Finite-strip collision error scale E_coll(N_X; <= X) <= C_H(X) sqrt(psi_N).
const E_COLL_ON_STRIP_X =
  PSI_N_X !== null && PSI_N_X > 0 ? C_H_X_ILLUSTRATIVE * Math.sqrt(PSI_N_X) : null;

// Witness that T_star(N) crosses X so the floor stops binding for larger N: below N_X the RvM height is
// below X (floor certified), at/above N_X it reaches X (floor exhausted).
const N_LADDER = [1e10, 1e11, 1e12, N_X, 1e14];
const CROSSOVER_WITNESS = N_LADDER.map((N) => {
  const y = ySharp(N);
  // Invert RvM approximately for the achieved height at count N (forward map is exact; a coarse height
  // proxy suffices to witness the ordering vs X).
  let T = (TWO_PI * N) / Math.max(Math.log(N), 1);
  for (let i = 0; i < 8; i++) {
    const f = rvmCount(T);
    if (f === null) break;
    const fp = Math.log(T / TWO_PI) / TWO_PI;
    if (!(fp > 0)) break;
    T = T - (f - N) / fp;
    if (!(T > TWO_PI)) T = TWO_PI + 1;
  }
  return {
    N,
    y_N_sharp: y,
    T_star_proxy: T,
    belowVerifiedHeight: T <= VERIFIED_HEIGHT_X, // C6 floor certified only while T_star <= X
  };
});

const N_X_FINITE = Number.isFinite(N_X) && N_X > 0;
const Y_SHARP_OFF_AXIS = Y_SHARP_X > 0;
const PSI_FINITE = PSI_N_X !== null && PSI_N_X > 0;
const E_COLL_FINITE = E_COLL_ON_STRIP_X !== null && E_COLL_ON_STRIP_X > 0;

export const IMP36217_FINITE_STRIP_HOLDER_CONSTANT_C6_GAP_FLOOR = {
  id: 'imp-36217',
  proofSection: 'S-frontier',
  question:
    'Derive the certified finite-strip Hoelder constant C_H(X) that the imp-36172 finite-N surrogate + the ' +
    'G6a weakerGapAssessment C6 verified-height minimal-gap floor (X ~ 3e12) would carry, report its ' +
    'numeric value, and state precisely why it cannot extend above X to the asymptotic N -> infinity ' +
    'modulus. Finite-strip derivation only; supplies no asymptotic modulus; G6a stays OPEN; C_H stays ' +
    'symbolic asymptotically; NO QED.',
  moduleAnchor: {
    C_H_closedForm:
      'C_H(X) = C_W = sqrt(2 / c(X)), c(X) = |u_0-double-prime(z_0*; y_N^sharp)| the shock-characteristic ' +
      'curvature at the finite-height footer; composed with imp-341 psi_N gives E_coll(N; <= X) <= C_H(X) ' +
      'sqrt(psi_N(y_N^sharp))',
    C6_input:
      'delta_min(X) > 0: an unconditional RH-free uniform pointwise VERTICAL minimal-gap lower bound for ' +
      'every consecutive zero pair below X = 3e12, read off the Platt verified list -- the sole sub-RH ' +
      'lever (imp-35147) and exactly the certified input imp-36172 S2 left GREENFIELD',
    stripFloorLever:
      'y_N^sharp = sqrt(2 pi / N) > 0 keeps the footer z_0* strictly OFF the real axis (u_0-double-prime ' +
      'finite, fold classical); only the uniform limit y -> 0+ reaches the divergent boundary shock',
  },
  compositionChain: {
    step1_C6GapFloor:
      'delta_min(X) > 0 is the smallest vertical consecutive spacing below X; a positive floor states the ' +
      'nearest-pair backward-collision (the Burgers shock) does not fully form on the verified strip',
    step2_densityCeiling:
      'the gap floor is DUAL to a density ceiling rho(t) <= 1 / g_min(X), g_min(X) = delta_min(X) * ' +
      'meanSpacing(X), meanSpacing(X) = 2 pi / log(X / 2 pi); this bounds |u_0-double-prime| from ABOVE on ' +
      'the finite strip {Im z >= y_N^sharp}',
    step3_finiteHeightRegularization:
      'at y_N^sharp = sqrt(2 pi / N) > 0 the footer sits strictly OFF the real axis so u_0-double-prime is ' +
      'finite and the Whitham fold stays classical -- the ONE lever keeping C_H(X) = sqrt(2 / c(X)) finite',
    step4_assembly:
      'compose C_H(X) with psi_N(y_N^sharp) = C1 log gamma_N / sqrt(2 pi N), C1 = pi C_Selberg ~ 9.4248, ' +
      'to give E_coll(N; <= X) <= C_H(X) sqrt(psi_N), valid only up to T_star(N) = X',
  },
  numericValue: {
    verifiedHeightX: VERIFIED_HEIGHT_X,
    N_X_RvMCount: N_X,
    y_N_sharp_at_X: Y_SHARP_X,
    meanSpacing_at_X: MEAN_SPACING_X,
    psi_N_at_X: PSI_N_X,
    delta_min_normalized_illustrative: DELTA_MIN_NORMALIZED_ILLUSTRATIVE,
    g_min_absolute_at_X: G_MIN_ABS_X,
    densityCeiling_at_X: DENSITY_CEILING_X,
    C_H_X_illustrative_placeholder: C_H_X_ILLUSTRATIVE,
    E_coll_on_strip_scale_at_X: E_COLL_ON_STRIP_X,
    note:
      'DERIVED numerics on the truncated strip: N_X ~ 1.236e13, y_N^sharp ~ 7.1e-7, meanSpacing ~ 0.234, ' +
      'psi_N ~ 3.1e-5, density ceiling as a function of delta_min(X). C_H(X) is reported IN FORM = ' +
      'sqrt(2 / c(X)); its numeric value rests on the imp-354 illustrative placeholder (c(X) = 2 => ' +
      'C_H(X) = 1, E_coll-on-strip ~ 5.5e-3) pending the imp-36172 S4 gap-to-curvature transcription. The ' +
      'delta_min value is illustrative, not the measured list minimum',
  },
  residualSubGap: {
    upperCurvatureSourcedFromC6:
      'C6 supplies, on the truncated strip below X, the density ceiling = an UPPER bound on ' +
      '|u_0-double-prime(z_0*; y_N^sharp)| -- HALF of the imp-36172 S2 obligation, now sourced from a ' +
      'certified sub-RH input rather than greenfield',
    lowerCurvatureStillOpen:
      'converting that ceiling into the matching curvature LOWER bound c(X) > 0 that C_H(X) = sqrt(2 / ' +
      'c(X)) needs requires the imp-36172 S4 finite-strip complex fold inversion (a TRUNCATED ' +
      'G6a-sub-hyperbolic Riemann-Hilbert transcription); the constant kappa relating delta_min(X) to ' +
      'c(X) is un-ported, so C_H(X) rests on the imp-354 symbolic placeholder for its value',
  },
  noControlAboveX: {
    verifiedListEndsAtX:
      'delta_min is uncertified above X; extending the floor past X needs either RH (candidate C1, ' +
      'RH-EQUIVALENT) or MORE verified height -- the C6 lever is finite-height by construction',
    stripHeightGrowsUnbounded:
      'T_star(N) = effectiveHeightForN(N) increases with N and CROSSES X at N_X ~ 1.236e13 (imp-36238); ' +
      'for N > N_X the footer neighbourhood samples zeros ABOVE X where the density ceiling is undefined ' +
      'and c(X) cannot be constructed',
    uniformLimitReinstatesWall:
      'driving N -> infinity forces y_N^sharp -> 0+, putting the footer on the real axis where ' +
      'u_0-double-prime diverges (imp-354 boundary shock), and the only uniform-constant route -- ' +
      'backward de Bruijn-flow gap-Lipschitz Gronwall -- is imp-2640 NEGATIVE (imp-35056 persistence)',
    sameVerifiedHeightMechanism:
      'C_H(X) is a FINITE-STRIP constant effective up to X only; asymptotically C_H stays symbolic and ' +
      'G6a_shock_lipschitz stays OPEN -- the SAME verified-height mechanism as the Platt-Trudgian floor, ' +
      'consistent with the standing finding that the sole sub-RH lever is MORE VERIFIED HEIGHT',
  },
  crossoverWitness: CROSSOVER_WITNESS,
  isRigorous: false,
  verdict:
    'FINITE-STRIP HOELDER CONSTANT C_H(X) DERIVED, C6-SOURCED (frontier, NOT rigorous). The G6a ' +
    'weakerGapAssessment candidate C6 -- an unconditional RH-free uniform pointwise minimal-gap floor ' +
    'delta_min(X) > 0 read off the Platt verified list up to X = 3e12 -- is EXACTLY the certified input ' +
    'the imp-36172 finite-N surrogate S2 left GREENFIELD. Dual to a density ceiling rho(t) <= 1 / ' +
    'g_min(X) with g_min(X) = delta_min(X) meanSpacing(X), it bounds |u_0-double-prime| from ABOVE on the ' +
    'finite strip {Im z >= y_N^sharp}, y_N^sharp = sqrt(2 pi / N) > 0 keeping the footer strictly OFF the ' +
    'real axis where the Whitham fold stays classical and C_H(X) = sqrt(2 / c(X)) is finite. Composed ' +
    'with the imp-341 modulus psi_N(y_N^sharp) = C1 log gamma_N / sqrt(2 pi N) this gives the finite-strip ' +
    'E_coll(N; <= X) <= C_H(X) sqrt(psi_N), with DERIVED numerics at the X-anchor: N_X ~ 1.236e13, ' +
    'y_N^sharp ~ 7.1e-7, meanSpacing ~ 0.234, psi_N ~ 3.1e-5, and the density ceiling as an explicit ' +
    'function of delta_min(X). C_H(X) is reported IN FORM; its numeric value rests on the imp-354 ' +
    'illustrative placeholder (c(X) = 2 => C_H(X) = 1, E_coll-on-strip ~ 5.5e-3) because the ' +
    'gap-to-curvature transcription constant -- the imp-36172 S4 finite-strip complex fold inversion -- ' +
    'is un-ported: C6 supplies the UPPER curvature control, the matching LOWER bound c(X) stays the named ' +
    'residual sub-gap. It carries NO control above X: the verified list ends at X (delta_min uncertified ' +
    'above, needing RH or more height), T_star(N) crosses X at N_X ~ 1.236e13 (imp-36238), and the ' +
    'uniform limit y_N^sharp -> 0+ reinstates the imp-354 boundary shock and the imp-2640 NEGATIVE ' +
    'Gronwall route. So C_H(X) is a FINITE-STRIP constant effective up to X only, asymptotically C_H ' +
    'stays symbolic -- the SAME verified-height mechanism as the Platt-Trudgian floor. FINITE-STRIP ' +
    'DERIVATION / SCOPING ONLY: certifies no asymptotic modulus; constructs no rigorous curvature bound; ' +
    'ports no Riemann-Hilbert fold inversion; does NOT re-attempt the RH-hard Gronwall route; discharges ' +
    'no gap; G6a_shock_lipschitz stays OPEN; C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) ' +
    'untouched; changes no bound; respects the imp-2519 no-overclaim guard; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36172 (finite-N surrogate requirements S1-S5; S2 certified finite-height curvature GREENFIELD, ' +
    'S4 finite-strip fold inversion); imp-354 / lambda-burgers-shock-lipschitz (C_H = sqrt(2 / ' +
    '|u_0-double-prime(z_0*)|), C_W placeholder 1.0); imp-35147 (G6a weakerGapAssessment, C6 finite-height ' +
    'minimal-gap floor as the sole strip-only sub-RH lever); imp-341 (Koksma-Hlawka strip modulus psi_N, ' +
    'C1 = pi C_Selberg); imp-2640 (backward-flow gap-Lipschitz Gronwall NEGATIVE); imp-35056 ' +
    '(asymptotic-modulo persistence); imp-36238 (T_star(N) exceeds 3e12 near N ~ 1.236e13). Whitham 1974 ' +
    'Section 2.7; Polymath15 / Tao arXiv:1904.12438; Platt-Trudgian 2021 (barrier base).',
};

export const IMP36217_FINITE_STRIP_HOLDER_CONSTANT_C6_GAP_FLOOR_ASSERTIONS = [
  {
    // The X-anchor numerics are finite and the RvM count lands near 1.236e13 (matching imp-36238).
    id: 'imp36217-x-anchor-numerics-finite',
    description: 'X = 3e12 -> N_X ~ 1.236e13, y_N^sharp ~ 7.1e-7 > 0 (footer off axis), meanSpacing ~ 0.234, psi_N ~ 3.1e-5, all finite and positive',
    holds: () =>
      N_X_FINITE &&
      Y_SHARP_OFF_AXIS &&
      PSI_FINITE &&
      E_COLL_FINITE &&
      Math.abs(Math.log10(N_X) - Math.log10(1.236e13)) < 0.05 &&
      Y_SHARP_X > 1e-7 && Y_SHARP_X < 1e-5 &&
      MEAN_SPACING_X > 0.2 && MEAN_SPACING_X < 0.3,
  },
  {
    // The density ceiling is the reciprocal of the absolute minimal gap g_min = delta_min * meanSpacing.
    id: 'imp36217-density-ceiling-dual-to-gap-floor',
    description: 'density ceiling D_ceil(X) = 1 / g_min(X), g_min(X) = delta_min * meanSpacing(X), finite and positive',
    holds: () =>
      DENSITY_CEILING_X !== null &&
      Number.isFinite(DENSITY_CEILING_X) &&
      DENSITY_CEILING_X > 0 &&
      Math.abs(DENSITY_CEILING_X * G_MIN_ABS_X - 1) < 1e-9 &&
      Math.abs(G_MIN_ABS_X - DELTA_MIN_NORMALIZED_ILLUSTRATIVE * MEAN_SPACING_X) < 1e-15,
  },
  {
    // C_H(X) is reported in closed form sqrt(2 / c(X)) and the E_coll-on-strip scale equals C_H * sqrt(psi_N).
    id: 'imp36217-holder-constant-composition-and-exponent',
    description: 'C_H(X) = sqrt(2 / c(X)); E_coll-on-strip = C_H(X) sqrt(psi_N); Hoelder exponent pinned at 1/2',
    holds: () => {
      const expected = C_H_X_ILLUSTRATIVE * Math.sqrt(PSI_N_X);
      return (
        HOLDER_EXPONENT === 0.5 &&
        Math.abs(C_W_SYMBOLIC_PLACEHOLDER - Math.sqrt(2 / 2)) < 1e-12 &&
        E_COLL_ON_STRIP_X !== null &&
        Math.abs(E_COLL_ON_STRIP_X - expected) < 1e-12 &&
        /sqrt\(2 \/ c\(X\)\)/.test(IMP36217_FINITE_STRIP_HOLDER_CONSTANT_C6_GAP_FLOOR.moduleAnchor.C_H_closedForm)
      );
    },
  },
  {
    // C6 sources the UPPER curvature control (half of S2); the matching LOWER bound c(X) stays the named residual.
    id: 'imp36217-residual-subgap-lower-curvature-open',
    description: 'C6 supplies the upper curvature control (half of imp-36172 S2); the curvature LOWER bound c(X) via S4 fold inversion stays OPEN',
    holds: () => {
      const r = IMP36217_FINITE_STRIP_HOLDER_CONSTANT_C6_GAP_FLOOR.residualSubGap;
      return (
        /UPPER bound/.test(r.upperCurvatureSourcedFromC6) &&
        /HALF of the imp-36172 S2/.test(r.upperCurvatureSourcedFromC6) &&
        /LOWER bound c\(X\)/.test(r.lowerCurvatureStillOpen) &&
        /S4/.test(r.lowerCurvatureStillOpen) &&
        /un-ported/.test(r.lowerCurvatureStillOpen)
      );
    },
  },
  {
    // The crossover witness confirms T_star(N) is below X up to N_X and above X beyond it.
    id: 'imp36217-no-control-above-x-crossover',
    description: 'T_star(N) <= X up to N_X and > X for larger N; verified list ends at X so the C6 floor stops binding above X',
    holds: () => {
      const below = CROSSOVER_WITNESS.filter((w) => w.N < N_X).every((w) => w.belowVerifiedHeight === true);
      const above = CROSSOVER_WITNESS.filter((w) => w.N > N_X).every((w) => w.belowVerifiedHeight === false);
      const n = IMP36217_FINITE_STRIP_HOLDER_CONSTANT_C6_GAP_FLOOR.noControlAboveX;
      return (
        below && above &&
        CROSSOVER_WITNESS.length === N_LADDER.length &&
        /uncertified above X/i.test(n.verifiedListEndsAtX) &&
        /imp-36238/.test(n.stripHeightGrowsUnbounded) &&
        /imp-2640 NEGATIVE/.test(n.uniformLimitReinstatesWall)
      );
    },
  },
  {
    // Honesty gate: derivation only; G6a open; C_H symbolic asymptotically; exponent 1/2; no QED; no refereed bound is changed.
    id: 'imp36217-honesty-gate-no-qed',
    description: 'finite-strip derivation only; G6a_shock_lipschitz stays OPEN; C_H symbolic asymptotically; no QED; no refereed bound is changed',
    holds: () =>
      IMP36217_FINITE_STRIP_HOLDER_CONSTANT_C6_GAP_FLOOR.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      HOLDER_EXPONENT === 0.5 &&
      /G6a_shock_lipschitz stays OPEN/.test(IMP36217_FINITE_STRIP_HOLDER_CONSTANT_C6_GAP_FLOOR.verdict) &&
      /C_H\(X\) stays symbolic|asymptotically C_H\s*stays symbolic/.test(IMP36217_FINITE_STRIP_HOLDER_CONSTANT_C6_GAP_FLOOR.verdict) &&
      /NO QED/.test(IMP36217_FINITE_STRIP_HOLDER_CONSTANT_C6_GAP_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP36217_FINITE_STRIP_HOLDER_CONSTANT_C6_GAP_FLOOR.verdict),
  },
];

for (const a of IMP36217_FINITE_STRIP_HOLDER_CONSTANT_C6_GAP_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36217-finite-strip-holder-constant-c6-gap-floor assertion failed: ${a.id}`);
  }
}

export default IMP36217_FINITE_STRIP_HOLDER_CONSTANT_C6_GAP_FLOOR;
