/**
 * @module imp-36172-shock-lipschitz-finite-n-surrogate-requirements
 *
 * imp-36172 (proof/scoping, S-frontier): ASSESS whether the OPEN Step-4 sub-gap
 * G6a_shock_lipschitz -- the Hoelder-1/2 modulus of the backward-collision-time functional tau_c at the
 * Burgers shock, feeding the Hoelder constant C_H into E_coll (imp-354, lambda-burgers-shock-lipschitz.js) --
 * admits any FINITE-N SURROGATE certificate, and ENUMERATE what a finite-height stand-in for that modulus
 * would concretely require. Grounded in the LAMBDA_CHAIN_STEPS Step-4 rigorousUpgradeGap verdict that the
 * UNIFORM modulus is RH-HARD-CONFIRMED (imp-2640 gap-Lipschitz Gronwall discharge NEGATIVE; imp-35056
 * asymptotic-modulo persistence; ch-wall-frontier-verdict-2026-06-26).
 *
 * SCOPING / ASSESSMENT ONLY. Certifies no modulus; constructs no curvature bound; ports no Riemann-Hilbert
 * fold analysis; does NOT re-attempt the RH-hard backward-flow Gronwall route; closes nothing; discharges no
 * gap; G6a_shock_lipschitz stays OPEN. C_H stays symbolic (the imp-354 placeholder 1.0 is untouched); C_C =
 * (1/8) sqrt(3 pi) 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional (imp-486) untouched; changes no bound;
 * establishes no positivity; respects the imp-2519 no-overclaim guard; NO QED. No refereed bound is changed.
 *
 * THE MODULUS AND ITS TWO REGIMES
 * -----------------------------------------------------------------------------
 * imp-354 supplies the Whitham fold-catastrophe modulus |tau_c(m_N) - tau_c(m_infinity)| <= C_H
 * sqrt(||m_N - m_infinity||_Linf), with C_H = C_W = sqrt(2 / |u_0-double-prime(z_0*)|) the reciprocal-root of the
 * shock-characteristic curvature at the shock footer z_0*, u_0 = 2 m. Composed with the imp-341
 * Koksma-Hlawka strip bound psi_N(y_N^sharp) = C1 log gamma_N / sqrt(2 pi N) it gives E_coll(N) <= C_H
 * sqrt(psi_N(y_N^sharp)) = Theta( sqrt(log gamma_N) N^{-1/4} ). Two DISTINCT regimes for C_H:
 *
 *   UNIFORM (asymptotic) regime -- RH-HARD. To feed the UNCONDITIONAL Step-4 bound the modulus must hold as
 *   N -> infinity, i.e. as the uniformity-strip floor y_N^sharp = sqrt(2 pi / N) -> 0+. In that limit the
 *   shock footer z_0* is driven onto the REAL axis, where u_0 = 2 m_infinity diverges and u_0-double-prime is singular
 *   in the classical sense: the fold-catastrophe expansion t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2 +
 *   O(cubic) degenerates (alpha ill-defined pointwise) and the only known route to a UNIFORM constant --
 *   backward de Bruijn-flow gap-Lipschitz Gronwall stability -- is imp-2640 NEGATIVE (the gap-Lipschitz
 *   constant does not stay bounded under the backward flow). Graded RH-HARD-CONFIRMED.
 *
 *   FINITE-N (height-conditional) regime -- CONCEIVABLE. If instead the modulus is required only at the
 *   FIXED finite strip floor y_N^sharp > 0 for the achieved N, the footer z_0*(y_N^sharp) sits strictly OFF
 *   the real axis, where u_0-double-prime is finite -- so C_H(N) = sqrt(2 / |u_0-double-prime(z_0*; y_N^sharp)|) is finite and the
 *   fold stays classical. This buys a HEIGHT-CONDITIONAL E_coll(N) valid up to T_star(N) =
 *   effectiveHeightForN(N), i.e. RH-up-to-height, NOT the uniform modulus.
 *
 * THE FINITE-N SURROGATE IS BOUGHT BY NOT TAKING THE UNIFORM LIMIT
 * -----------------------------------------------------------------------------
 * The single lever separating the two regimes is the strip floor y_N^sharp = sqrt(2 pi / N): strictly
 * positive at every finite N, strictly decreasing in N, and -> 0 only in the limit. The finite-N surrogate
 * is finite PRECISELY because it holds y_N^sharp bounded away from 0; it therefore never confronts the
 * boundary-shock divergence and never invokes the RH-hard backward-flow Gronwall step. This is why a
 * finite-height stand-in is conceivable while the uniform modulus stays RH-hard -- the surrogate does not
 * strengthen the modulus, it WEAKENS the conclusion to a height-conditional one.
 *
 * REQUIREMENTS (S1-S5): what a finite-height surrogate for C_H would concretely need
 * -----------------------------------------------------------------------------
 * S1  FINITE REGULARIZATION HEIGHT. Fix the modulus at the finite uniformity-strip floor y_N^sharp =
 *     sqrt(2 pi / N) > 0 for the achieved N, so the shock footer z_0*(y_N^sharp) sits strictly OFF the real
 *     axis and u_0-double-prime there is finite. This is the ONE lever that turns the divergent uniform C_W into a
 *     finite C_H(N). AVAILABLE (the strip floor is already the imp-341 evaluation height).
 * S2  CERTIFIED FINITE-HEIGHT CURVATURE LOWER BOUND. |u_0-double-prime(z_0*; y_N^sharp)| >= c(N) > 0 with an explicit
 *     c(N), so C_H(N) = sqrt(2 / c(N)) is finite and effective. Needs a certified second-derivative estimate
 *     of the RvM density mollified at height y_N^sharp. GREENFIELD: no such bound exists; only the imp-354
 *     symbolic placeholder C_W = 1.0 (illustrative, not rigorous) stands in for it.
 * S3  FINITE-HEIGHT SIMPLE-SHOCK NON-DEGENERACY. Certify u_0-prime(z_0*) != 0 AND u_0-double-prime(z_0*) != 0 at the
 *     finite-height footer (the shock stays SIMPLE off the real axis), so the fold expansion t_shock = tau_c
 *     + (1/2) alpha (z_0 - z_0*)^2 + O(cubic) holds with alpha = u_0-double-prime(z_0*)/(u_0-prime(z_0*))^2 finite and the
 *     Hoelder exponent stays PINNED at 1/2. Classical off the axis; unverified at finite height.
 * S4  FINITE-STRIP COMPLEX FOLD INVERSION (a TRUNCATED G6a-sub-hyperbolic). The Whitham Hoelder-1/2 inversion
 *     transcribed to the COMPLEX Stieltjes m: C_+ -> C_+ but required only on the finite strip {Im z >=
 *     y_N^sharp}, not uniformly -- a Riemann-Hilbert fold analysis restricted to a compact-in-y sector.
 *     Strictly WEAKER than the uniform G6a-sub-hyperbolic (imp-354), but still un-ported. GREENFIELD.
 * S5  HEIGHT-CONDITIONAL ASSEMBLY + HONEST DOWNGRADE. Compose C_H(N) sqrt(psi_N(y_N^sharp)) into a
 *     finite-height E_coll(N) valid only up to T_star(N) = effectiveHeightForN(N), delivering an
 *     RH-up-to-height-T_star(N) conclusion, NOT the uniform/asymptotic modulus. Must be labelled
 *     height-conditional and must NOT be read as discharging G6a_shock_lipschitz. The B2-effective-height
 *     framing (imp-36173) is the natural home for the resulting T_star(N).
 *
 * THE OBSTRUCTION THAT KEEPS THE UNIFORM MODULUS RH-HARD
 * -----------------------------------------------------------------------------
 * Taking the surrogate to the uniform limit (y_N^sharp -> 0+, N -> infinity) reinstates exactly the two
 * walls the finite-N version sidesteps: (i) the shock footer returns to the real axis where u_0-double-prime diverges
 * and the classical fold degenerates (the correct substitute would be a Sobolev-H^{1/2} shock-characteristic
 * curvature, not the pointwise second derivative -- imp-354 openWork); (ii) the only known uniform-constant
 * route, backward de Bruijn-flow gap-Lipschitz Gronwall stability, is imp-2640 NEGATIVE and imp-35056 records
 * the asymptotic-modulo persistence. A finite-height surrogate does NOT touch either wall; it merely declines
 * to take the limit. Hence NECESSARY-BUT-NOT-SUFFICIENT for the unconditional Step-4 bound: S1-S5 could
 * furnish a height-conditional E_coll(N), but the uniform modulus feeding the UNCONDITIONAL Lambda bound
 * stays RH-hard.
 *
 * READING: a finite-N surrogate certificate for the Burgers-shock modulus is CONCEIVABLE -- the finite strip
 * floor y_N^sharp > 0 regularizes the divergent boundary-shock curvature and keeps the fold classical -- and
 * would require S1 (fix y_N^sharp), S2 (certified finite-height curvature lower bound; GREENFIELD), S3
 * (finite-height simple-shock non-degeneracy), S4 (finite-strip complex fold inversion; a truncated
 * G6a-sub-hyperbolic; GREENFIELD), and S5 (height-conditional assembly with an honest RH-up-to-height
 * downgrade). But it delivers only a HEIGHT-CONDITIONAL bound; it does NOT discharge G6a_shock_lipschitz and
 * leaves the RH-hard UNIFORM modulus (imp-2640 Gronwall NEGATIVE, imp-35056 persistence) untouched. This
 * module NAMES those requirements and the obstruction; it certifies no modulus and ports nothing.
 *
 * @see lambda-burgers-shock-lipschitz (imp-354: the Whitham Hoelder-1/2 modulus C_W and its two sub-sub-gaps)
 * @see lambda-polymath15-bridge (imp-345: opened G6a_shock_lipschitz as a Step-4 sub-gap of G6_polymath15_bridge)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T_star Riemann-von Mangoldt inverse, the height for S5)
 * @see imp-2640 (gap-Lipschitz Gronwall discharge NEGATIVE -- the uniform-constant route fails)
 * @see imp-35056 (asymptotic-modulo persistence of the exact modulus)
 * @see imp-36173 (B2-effective-height-Tstar: the RH-up-to-height framing that S5 feeds)
 * @see Whitham 1974 Section 2.7 (kinematic-wave cusp, Hoelder-1/2); Polymath15 / Tao arXiv:1904.12438
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

// -- Anchor + operative constants (import-light; matching imp-354 / imp-341) -------------------------
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scope
const TWO_PI = 2 * Math.PI;
const C_SELBERG = 3.0; // imp-341 Selberg constant
const C1_IMP341 = Math.PI * C_SELBERG; // Koksma-Hlawka constant C1 = pi C_Selberg ~ 9.4248
const C_H_SYMBOLIC_PLACEHOLDER = 1.0; // imp-354 illustrative C_W placeholder; NOT rigorous, untouched here

// Finite strip floor y_N^sharp = sqrt(2 pi / N): the lever that separates the two regimes.
function ySharp(N) {
  return Math.sqrt(TWO_PI / N);
}
// imp-341 strip modulus psi_N(y_N^sharp) = C1 log gamma_N / sqrt(2 pi N) (gamma_N ~ height at count N).
function psiN(N, gammaN) {
  const L = Math.log(gammaN);
  if (!(L > 0) || !(N > 0)) return null;
  return (C1_IMP341 * L) / Math.sqrt(TWO_PI * N);
}

// Height ladder witnessing the finite-N regularization: y_N^sharp > 0, strictly decreasing, -> 0 only in
// the limit. T_star(N) = effectiveHeightForN(N) is the finite height the S5 assembly would report.
const N_LADDER = [1e3, 1e4, 1e5, 4.886e5, 1e6, 1e8, 1e10];
const HEIGHT_WITNESS = N_LADDER.map((N) => {
  const T0 = effectiveHeightForN(N); // finite achieved height (RvM inverse)
  const y = ySharp(N); // strip floor: strictly positive at finite N
  const psi = psiN(N, T0); // finite-height strip modulus scale
  const eCollSurrogateScale =
    psi !== null && psi > 0 ? C_H_SYMBOLIC_PLACEHOLDER * Math.sqrt(psi) : null; // symbolic scale only
  return {
    N,
    T_star: T0,
    y_N_sharp: y,
    offRealAxis: y > 0, // footer sits strictly off the real axis => u_0-double-prime finite (S1)
    psi_N_at_y_sharp: psi,
    E_coll_surrogate_scale: eCollSurrogateScale,
  };
});

const ALL_OFF_AXIS = HEIGHT_WITNESS.every((r) => r.offRealAxis === true && r.y_N_sharp > 0);
const Y_STRICTLY_DECREASING = (() => {
  for (let i = 1; i < HEIGHT_WITNESS.length; i++) {
    if (!(HEIGHT_WITNESS[i].y_N_sharp < HEIGHT_WITNESS[i - 1].y_N_sharp)) return false;
  }
  return true;
})();
// The surrogate is finite PRECISELY because y_N^sharp stays bounded above 0: it never reaches the uniform
// limit y -> 0+ that reinstates the boundary-shock divergence.
const Y_SHRINKS_TOWARD_LIMIT =
  HEIGHT_WITNESS[HEIGHT_WITNESS.length - 1].y_N_sharp < HEIGHT_WITNESS[0].y_N_sharp;

const HOLDER_EXPONENT = 0.5; // pinned by the fold catastrophe; a finite-height surrogate does not change it
const SURROGATE_REQUIREMENT_COUNT = 5; // S1 height; S2 curvature; S3 non-degeneracy; S4 fold inversion; S5 assembly

export const IMP36172_SHOCK_LIPSCHITZ_FINITE_N_SURROGATE_REQUIREMENTS = {
  id: 'imp-36172',
  proofSection: 'S-frontier',
  question:
    'Assess whether the OPEN Step-4 sub-gap G6a_shock_lipschitz (the Hoelder-1/2 modulus of tau_c at the ' +
    'Burgers shock, feeding C_H into E_coll; UNIFORM modulus RH-HARD-CONFIRMED via imp-2640 Gronwall ' +
    'NEGATIVE and imp-35056 asymptotic-modulo persistence) admits any FINITE-N SURROGATE certificate, and ' +
    'enumerate what a finite-height stand-in for that modulus would concretely need. Scoping only; ' +
    'certifies no modulus; discharges no gap; does NOT re-attempt the RH-hard Gronwall route; NO QED.',
  moduleAnchor: {
    C_H_closedForm:
      'C_H = C_W = sqrt(2 / |u_0-double-prime(z_0*)|), u_0 = 2 m, z_0* the shock footer; composed with imp-341 ' +
      'psi_N(y_N^sharp) gives E_coll(N) <= C_H sqrt(psi_N) = Theta(sqrt(log gamma_N) N^{-1/4})',
    holderExponent: HOLDER_EXPONENT,
    stripFloorLever:
      'y_N^sharp = sqrt(2 pi / N) > 0 is the single lever: at finite N the footer z_0*(y_N^sharp) sits OFF ' +
      'the real axis (u_0-double-prime finite, fold classical); only in the limit y -> 0+ does the footer reach the ' +
      'real axis where u_0-double-prime diverges and the classical fold degenerates',
    twoRegimes:
      'UNIFORM (N -> infinity, y -> 0+): RH-HARD-CONFIRMED (imp-2640 backward-flow Gronwall NEGATIVE, ' +
      'imp-35056 persistence). FINITE-N (fixed y_N^sharp > 0): CONCEIVABLE, height-conditional only',
  },
  surrogateRequirements: {
    S1_finiteRegularizationHeight:
      'fix the modulus at the finite strip floor y_N^sharp = sqrt(2 pi / N) > 0 so the footer z_0* sits ' +
      'strictly OFF the real axis and u_0-double-prime is finite -- the ONE lever turning the divergent uniform C_W ' +
      'into a finite C_H(N). AVAILABLE (y_N^sharp is already the imp-341 evaluation height)',
    S2_certifiedFiniteHeightCurvatureLowerBound:
      'certify |u_0-double-prime(z_0*; y_N^sharp)| >= c(N) > 0 with explicit c(N) so C_H(N) = sqrt(2 / c(N)) is finite; ' +
      'needs a certified second-derivative estimate of the RvM density mollified at height y_N^sharp. ' +
      'GREENFIELD -- only the imp-354 symbolic placeholder C_W = 1.0 (illustrative) stands in',
    S3_finiteHeightSimpleShockNonDegeneracy:
      'certify u_0-double-prime(z_0*) != 0 AND u_0-prime(z_0*) != 0 at the finite-height footer (shock stays SIMPLE off the ' +
      'axis) so the fold expansion t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2 + O(cubic) holds with alpha ' +
      'finite and the Hoelder exponent PINNED at 1/2. Classical off the axis; unverified at finite height',
    S4_finiteStripComplexFoldInversion:
      'the Whitham Hoelder-1/2 inversion transcribed to the complex Stieltjes m: C_+ -> C_+ but required ' +
      'only on the finite strip {Im z >= y_N^sharp}, a Riemann-Hilbert fold analysis on a compact-in-y ' +
      'sector -- a TRUNCATED G6a-sub-hyperbolic, strictly WEAKER than the uniform version but still ' +
      'un-ported. GREENFIELD',
    S5_heightConditionalAssemblyAndHonestDowngrade:
      'compose C_H(N) sqrt(psi_N(y_N^sharp)) into a finite-height E_coll(N) valid only up to T_star(N) = ' +
      'effectiveHeightForN(N), delivering RH-up-to-height-T_star(N), NOT the uniform modulus; must be ' +
      'labelled height-conditional and NOT read as discharging G6a_shock_lipschitz (feeds the imp-36173 ' +
      'B2-effective-height framing)',
  },
  greenfieldVsAvailable: {
    available: [
      'the finite strip floor y_N^sharp = sqrt(2 pi / N) > 0 as the imp-341 evaluation height (S1)',
      'the imp-354 Whitham fold-catastrophe expansion and the classical Hoelder-1/2 statement off the axis',
      'effectiveHeightForN as the T_star(N) height inverse for the S5 assembly',
    ],
    greenfield: [
      'the certified finite-height curvature lower bound |u_0-double-prime(z_0*; y_N^sharp)| >= c(N) > 0 (S2 -- only a symbolic C_W placeholder exists)',
      'the finite-strip complex fold inversion / truncated G6a-sub-hyperbolic Riemann-Hilbert analysis (S4)',
      'the finite-height simple-shock non-degeneracy certificate at y_N^sharp (S3)',
    ],
  },
  obstruction: {
    uniformLimitReinstatesTwoWalls:
      'taking the surrogate to the uniform limit (y_N^sharp -> 0+, N -> infinity) reinstates (i) the ' +
      'boundary shock where u_0-double-prime diverges and the classical fold degenerates (correct substitute would be ' +
      'a Sobolev-H^{1/2} shock-characteristic curvature, imp-354 openWork), and (ii) the backward de ' +
      'Bruijn-flow gap-Lipschitz Gronwall route, which imp-2640 confirmed NEGATIVE (imp-35056 persistence)',
    necessaryNotSufficient:
      'S1-S5 could furnish a HEIGHT-CONDITIONAL E_coll(N), but the UNIFORM modulus feeding the ' +
      'UNCONDITIONAL Step-4 Lambda bound stays RH-hard -- a finite-N surrogate is NECESSARY-BUT-NOT-' +
      'SUFFICIENT for discharge; it declines to take the limit rather than crossing the wall',
    staysOpenNoQed:
      'this module scopes the requirements and the obstruction; it certifies no modulus and ports nothing, ' +
      'so G6a_shock_lipschitz stays OPEN and the RH-HARD-CONFIRMED uniform modulus is untouched',
  },
  heightWitness: HEIGHT_WITNESS,
  allOffRealAxis: ALL_OFF_AXIS,
  yStrictlyDecreasing: Y_STRICTLY_DECREASING,
  isRigorous: false,
  verdict:
    'SHOCK-LIPSCHITZ FINITE-N SURROGATE, REQUIREMENTS ENUMERATED (frontier, NOT rigorous). A finite-height ' +
    'stand-in for the G6a_shock_lipschitz Hoelder-1/2 modulus is CONCEIVABLE: the finite strip floor ' +
    'y_N^sharp = sqrt(2 pi / N) > 0 keeps the Burgers-shock footer z_0* strictly OFF the real axis, where ' +
    'u_0-double-prime is finite and the Whitham fold stays classical, so C_H(N) = sqrt(2 / |u_0-double-prime(z_0*; y_N^sharp)|) is ' +
    'finite. Such a surrogate would require: S1 fix the finite regularization height y_N^sharp (AVAILABLE), ' +
    'S2 a certified finite-height curvature lower bound |u_0-double-prime| >= c(N) > 0 (GREENFIELD; only the imp-354 ' +
    'symbolic C_W = 1.0 placeholder exists), S3 finite-height simple-shock non-degeneracy keeping the ' +
    'exponent PINNED at 1/2, S4 a finite-strip complex fold inversion -- a TRUNCATED G6a-sub-hyperbolic ' +
    'Riemann-Hilbert analysis, strictly weaker than the uniform version but still un-ported (GREENFIELD), ' +
    'and S5 a height-conditional assembly composing C_H(N) sqrt(psi_N) into E_coll(N) valid only up to ' +
    'T_star(N) = effectiveHeightForN(N), i.e. RH-up-to-height, NOT the uniform modulus. NECESSARY-BUT-NOT-' +
    'SUFFICIENT: taking the surrogate to the uniform limit (y_N^sharp -> 0+) reinstates the boundary-shock ' +
    'divergence AND the backward-flow gap-Lipschitz Gronwall route that imp-2640 confirmed NEGATIVE ' +
    '(imp-35056 persistence), so the UNIFORM modulus feeding the UNCONDITIONAL Lambda bound stays RH-hard. ' +
    'The surrogate is finite precisely because it declines to take the limit -- it WEAKENS the conclusion, ' +
    'it does not strengthen the modulus. SCOPING / ASSESSMENT ONLY: certifies no modulus; constructs no ' +
    'curvature bound; ports no Riemann-Hilbert analysis; does NOT re-attempt the RH-hard Gronwall route; ' +
    'closes nothing; discharges no gap; G6a_shock_lipschitz stays OPEN; C_H stays symbolic; C_C = 1/8 ' +
    '(imp-2642/2643) and C_mb GUE-conditional (imp-486) untouched; changes no bound; respects the imp-2519 ' +
    'no-overclaim guard; NO QED. No refereed bound is changed.',
  citation:
    'imp-354 / lambda-burgers-shock-lipschitz (Whitham Hoelder-1/2 modulus C_W and its sub-sub-gaps ' +
    'G6a-sub-hyperbolic, G6a-sub-constant); imp-345 / lambda-polymath15-bridge (G6a_shock_lipschitz opened ' +
    'as a Step-4 sub-gap); imp-2640 (backward-flow gap-Lipschitz Gronwall discharge NEGATIVE -- uniform ' +
    'route fails); imp-35056 (asymptotic-modulo persistence); ch-wall-frontier-verdict-2026-06-26 ' +
    '(RH-HARD-CONFIRMED grade); imp-36173 (B2-effective-height-Tstar RH-up-to-height framing S5 feeds); ' +
    'imp-341 (Koksma-Hlawka strip modulus psi_N); lambda-rh-height-mapping (effectiveHeightForN). Whitham ' +
    '1974 Section 2.7; Polymath15 / Tao arXiv:1904.12438; Platt-Trudgian 2021 (barrier base).',
};

export const IMP36172_SHOCK_LIPSCHITZ_FINITE_N_SURROGATE_REQUIREMENTS_ASSERTIONS = [
  {
    // The finite strip floor y_N^sharp is strictly positive at every finite N (footer off the real axis)
    // and strictly decreasing, reaching y -> 0+ only in the uniform limit.
    id: 'imp36172-finite-regularization-height-off-axis',
    description: 'y_N^sharp = sqrt(2 pi / N) > 0 at every ladder N (footer off the real axis, u_0 double-prime finite), strictly decreasing, -> 0 only in the limit',
    holds: () =>
      ALL_OFF_AXIS &&
      Y_STRICTLY_DECREASING &&
      Y_SHRINKS_TOWARD_LIMIT &&
      HEIGHT_WITNESS.length === N_LADDER.length &&
      HEIGHT_WITNESS.every((r) => Number.isFinite(r.T_star) && r.T_star > 0),
  },
  {
    // Five requirements S1-S5 are enumerated, each naming a concrete obligation.
    id: 'imp36172-five-surrogate-requirements',
    description: 'S1-S5 enumerated: finite height, curvature lower bound, non-degeneracy, finite-strip fold inversion, height-conditional assembly',
    holds: () => {
      const s = IMP36172_SHOCK_LIPSCHITZ_FINITE_N_SURROGATE_REQUIREMENTS.surrogateRequirements;
      return Object.keys(s).length === SURROGATE_REQUIREMENT_COUNT &&
        /y_N\^sharp/.test(s.S1_finiteRegularizationHeight) &&
        /GREENFIELD/.test(s.S2_certifiedFiniteHeightCurvatureLowerBound) &&
        /SIMPLE/.test(s.S3_finiteHeightSimpleShockNonDegeneracy) &&
        /TRUNCATED G6a-sub-hyperbolic/.test(s.S4_finiteStripComplexFoldInversion) &&
        /RH-up-to-height/.test(s.S5_heightConditionalAssemblyAndHonestDowngrade);
    },
  },
  {
    // The greenfield/available partition is populated and places the certified curvature lower bound in greenfield.
    id: 'imp36172-greenfield-vs-available-partition',
    description: 'both lists non-empty; certified finite-height curvature lower bound is GREENFIELD; the strip floor y_N^sharp is AVAILABLE',
    holds: () => {
      const g = IMP36172_SHOCK_LIPSCHITZ_FINITE_N_SURROGATE_REQUIREMENTS.greenfieldVsAvailable;
      return Array.isArray(g.available) && Array.isArray(g.greenfield) &&
        g.available.length >= 3 && g.greenfield.length >= 3 &&
        g.greenfield.some((x) => /finite-height curvature lower bound/.test(x)) &&
        g.available.some((x) => /strip floor y_N\^sharp/.test(x));
    },
  },
  {
    // The obstruction is recorded: the uniform limit reinstates the RH-hard walls; surrogate is necessary-not-sufficient.
    id: 'imp36172-obstruction-necessary-not-sufficient',
    description: 'obstruction records that the uniform limit reinstates the boundary-shock divergence + the imp-2640 NEGATIVE Gronwall route, so the surrogate is NECESSARY-BUT-NOT-SUFFICIENT',
    holds: () => {
      const o = IMP36172_SHOCK_LIPSCHITZ_FINITE_N_SURROGATE_REQUIREMENTS.obstruction;
      return /imp-2640/.test(o.uniformLimitReinstatesTwoWalls) &&
        /NEGATIVE/.test(o.uniformLimitReinstatesTwoWalls) &&
        /NECESSARY-BUT-NOT-\s*SUFFICIENT/.test(o.necessaryNotSufficient);
    },
  },
  {
    // Honesty gate: scoping only; discharges nothing; G6a_shock_lipschitz open; exponent pinned at 1/2; no QED; no refereed bound is changed.
    id: 'imp36172-honesty-gate-no-qed',
    description: 'scoping only; G6a_shock_lipschitz stays OPEN; Hoelder exponent pinned at 1/2; no QED; no refereed bound is changed',
    holds: () =>
      IMP36172_SHOCK_LIPSCHITZ_FINITE_N_SURROGATE_REQUIREMENTS.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      HOLDER_EXPONENT === 0.5 &&
      /G6a_shock_lipschitz stays OPEN/.test(IMP36172_SHOCK_LIPSCHITZ_FINITE_N_SURROGATE_REQUIREMENTS.obstruction.staysOpenNoQed) &&
      /NO QED/.test(IMP36172_SHOCK_LIPSCHITZ_FINITE_N_SURROGATE_REQUIREMENTS.verdict) &&
      /refereed bound is changed/i.test(IMP36172_SHOCK_LIPSCHITZ_FINITE_N_SURROGATE_REQUIREMENTS.verdict),
  },
];

for (const a of IMP36172_SHOCK_LIPSCHITZ_FINITE_N_SURROGATE_REQUIREMENTS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36172-shock-lipschitz-finite-n-surrogate-requirements assertion failed: ${a.id}`);
  }
}

export default IMP36172_SHOCK_LIPSCHITZ_FINITE_N_SURROGATE_REQUIREMENTS;
