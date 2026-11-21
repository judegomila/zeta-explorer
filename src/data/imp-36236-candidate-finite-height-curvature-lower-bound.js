/**
 * @module imp-36236-candidate-finite-height-curvature-lower-bound
 *
 * imp-36236 (proof/derivation, S-frontier): DERIVE the candidate finite-height curvature LOWER bound
 * c(N) <= |u_0-double-prime(z_0*; y_N^sharp)| that would make the imp-36172 S2 finite-N shock-Lipschitz
 * surrogate EFFECTIVE, enumerate the mollified-RvM-density second-derivative estimate it needs, and report
 * why the naturally-certifiable branch is INEFFECTIVE while the effective branch stays GREENFIELD.
 *
 * DERIVATION / SCOPING ONLY. Certifies no modulus; constructs no rigorous curvature LOWER bound; ports no
 * Riemann-Hilbert fold inversion; does NOT re-attempt the RH-hard backward-flow Gronwall route (imp-2640
 * NEGATIVE); discharges no gap; G6a_shock_lipschitz stays OPEN; C_H stays symbolic; respects the imp-2519
 * no-overclaim guard; NO QED. No refereed bound is changed.
 *
 * WHAT c(N) IS AND WHY IT IS THE MISSING HALF OF S2
 * -----------------------------------------------------------------------------
 * imp-354 (lambda-burgers-shock-lipschitz) writes the shock-front Hoelder constant in closed form as
 * C_H = C_W = sqrt(2 / |u_0-double-prime(z_0*)|), the reciprocal-root of the shock-characteristic curvature
 * at the collision-time footer z_0*, u_0 = 2 m (m the Stieltjes transform of the zero-counting measure). For
 * C_H(N) to be FINITE and EFFECTIVE the surrogate needs a certified curvature LOWER bound
 *   |u_0-double-prime(z_0*; y_N^sharp)| >= c(N) > 0.
 * imp-36217 showed the G6a candidate C6 (verified-height minimal-gap floor) supplies, on the strip below
 * X = 3e12, only the DUAL density CEILING -- an UPPER bound on |u_0-double-prime| -- which is HALF of the
 * imp-36172 S2 obligation. The matching LOWER bound c(N) was left as the named residual (S3 non-degeneracy /
 * S4 finite-strip fold inversion). This module DERIVES that lower bound IN CANDIDATE FORM and shows why it
 * bifurcates.
 *
 * THE MOLLIFIED-RvM-DENSITY SECOND DERIVATIVE
 * -----------------------------------------------------------------------------
 * At the finite strip floor y_N^sharp = sqrt(2 pi / N) > 0 (imp-36172 S1) the footer z_0* = x_0 + i y_N^sharp
 * sits strictly OFF the real axis, so m and its derivatives are finite there. The relevant object is the
 * second spatial derivative of the Poisson/Cauchy-mollified counting density,
 *   u_0-double-prime(z_0*) = 2 m-double-prime(z_0*),   m(z) = integral dN(t) / (z - t),
 * so m-double-prime(z) = 2 integral dN(t) / (z - t)^3. Split dN into the RvM SMOOTH trend rho_sm(t) =
 * (1 / 2 pi) log(t / 2 pi) and the fluctuation dS(t). The curvature LOWER bound c(N) is a lower bound on
 * |m-double-prime| at the footer, and the split gives two distinct candidate scales.
 *
 * TWO CANDIDATE BRANCHES (the derivation result)
 * -----------------------------------------------------------------------------
 * BRANCH A -- SMOOTH TREND (certifiable, INEFFECTIVE). The smooth part contributes a pointwise curvature
 *   |u_0-double-prime_sm(T)| = 2 |rho_sm-double-prime(T)| = (1 / pi) T^{-2},  T = effectiveHeightForN(N).
 *   This is UNCONDITIONALLY POSITIVE and needs no fold inversion -- a genuine, certifiable lower bound
 *   candidate c_sm(N) = (1 / pi) T^{-2} > 0. But it is TINY (~ T^{-2}), so C_H_sm(N) = sqrt(2 / c_sm) =
 *   sqrt(2 pi) T GROWS without bound, and the assembled E_coll(N) = C_H_sm sqrt(psi_N(y_N^sharp)) GROWS with
 *   N rather than decaying. So the smooth curvature lower bound EXISTS but is INEFFECTIVE: it does not yield
 *   a small/decaying collision error. A nonvanishing lower bound is necessary but the MAGNITUDE matters.
 *
 * BRANCH B -- POLE / FOLD SCALE (effective, GREENFIELD). Near the forming Burgers shock the dominant
 *   contribution to m-double-prime is the nearest-pair pole at distance ~ y_N^sharp from the footer, giving
 *   the EFFECTIVE target magnitude |u_0-double-prime_pole| ~ 4 / y_N^sharp^3, hence the candidate
 *   c_pole(N) ~ 4 / y_N^sharp^3, C_H_pole(N) = sqrt(2 / c_pole) = y_N^sharp^{3/2} / sqrt(2), which DECAYS,
 *   so E_coll(N) = C_H_pole sqrt(psi_N) DECAYS in N -- the effective regime. BUT 4 / y_N^sharp^3 is an
 *   UPPER magnitude estimate of |m-double-prime|; turning it into a LOWER bound requires certifying the pole
 *   sum does NOT destructively CANCEL at the footer (the shock stays SIMPLE off the axis, imp-36172 S3) via
 *   the finite-strip complex fold inversion (imp-36172 S4 -- a truncated G6a-sub-hyperbolic Riemann-Hilbert
 *   transcription). That non-cancellation certificate is GREENFIELD.
 *
 * THE GAP BETWEEN THE BRANCHES IS EXACTLY THE imp-36217 RESIDUAL
 * -----------------------------------------------------------------------------
 * The certifiable branch A is ineffective; the effective branch B is uncertified. The distance between them
 * -- from the tiny smooth curvature T^{-2} up to the pole-scale y_N^sharp^{-3} -- is precisely the
 * gap-to-curvature transcription constant kappa (relating the C6 density ceiling / minimal gap to a curvature
 * LOWER bound) that imp-36217 named as its residual sub-gap and that S4 must supply. So the candidate c(N) is
 * DERIVED IN FORM (both branches explicit and numerically witnessed) but is NOT a certificate: an EFFECTIVE
 * c(N) at the pole scale rests on the S3 non-degeneracy + S4 fold inversion, still un-ported.
 *
 * READING: a candidate finite-height curvature lower bound c(N) <= |u_0-double-prime(z_0*; y_N^sharp)| splits
 * into a SMOOTH-trend branch c_sm(N) = (1 / pi) T^{-2} that is certifiable and unconditionally positive but
 * INEFFECTIVE (C_H_sm = sqrt(2 pi) T grows, E_coll grows), and a POLE-scale branch c_pole(N) ~ 4 /
 * y_N^sharp^3 that IS effective (C_H_pole = y_N^sharp^{3/2}/sqrt(2) decays, E_coll decays) but is only an
 * upper magnitude estimate: a genuine lower bound there needs the S3 non-degeneracy + S4 finite-strip fold
 * inversion (the imp-36217 gap-to-curvature transcription constant), which is GREENFIELD. The
 * mollified-RvM-density second-derivative estimate needed is enumerated D1-D4. This module DERIVES the
 * candidate in form; it certifies no lower bound, ports no fold inversion, and leaves G6a_shock_lipschitz
 * OPEN.
 *
 * @see imp-36172 (finite-N surrogate requirements S1-S5; S2 certified finite-height curvature LOWER bound GREENFIELD)
 * @see imp-36217 (finite-strip Hoelder constant from C6: UPPER curvature control sourced, LOWER bound c(X) residual)
 * @see imp-354 / lambda-burgers-shock-lipschitz (C_H = sqrt(2 / |u_0-double-prime(z_0*)|); C_W placeholder 1.0)
 * @see imp-341 (Koksma-Hlawka strip modulus psi_N = C1 log gamma_N / sqrt(2 pi N), C1 = pi C_Selberg)
 * @see imp-2640 (backward-flow gap-Lipschitz Gronwall discharge NEGATIVE -- uniform-constant route fails)
 * @see imp-35056 (asymptotic-modulo persistence of the exact modulus)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T_star Riemann-von Mangoldt inverse)
 * @see Whitham 1974 Section 2.7 (kinematic-wave cusp, Hoelder-1/2); Polymath15 / Tao arXiv:1904.12438
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

// -- Anchor + operative constants (import-light; matching imp-354 / imp-341 / imp-36172 / imp-36217) ----
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this derivation
const TWO_PI = 2 * Math.PI;
const C_SELBERG = 3.0; // imp-341 Selberg constant
const C1_IMP341 = Math.PI * C_SELBERG; // Koksma-Hlawka constant C1 = pi C_Selberg ~ 9.4248
const C_W_SYMBOLIC_PLACEHOLDER = 1.0; // imp-354 illustrative C_W (c = 2); NOT rigorous, untouched here
const HOLDER_EXPONENT = 0.5; // pinned by the fold catastrophe; the surrogate does not change it

// Finite strip floor y_N^sharp = sqrt(2 pi / N): the lever separating the finite-N and uniform regimes.
function ySharp(N) {
  return Math.sqrt(TWO_PI / N);
}
// imp-341 strip modulus psi_N(y_N^sharp) = C1 log gamma_N / sqrt(2 pi N).
function psiN(N, gammaN) {
  const L = Math.log(gammaN);
  if (!(L > 0) || !(N > 0)) return null;
  return (C1_IMP341 * L) / Math.sqrt(TWO_PI * N);
}

// -- The two candidate curvature LOWER-bound branches -------------------------------------------------
// BRANCH A -- smooth RvM trend: |u_0-double-prime_sm| = 2 |rho_sm-double-prime(T)| = (1/pi) T^{-2}, with
// rho_sm(t) = (1 / 2 pi) log(t / 2 pi) so rho_sm-double-prime(t) = -(1 / 2 pi) t^{-2}. Certifiable, > 0.
function cSmooth(T) {
  return T > 0 ? 1 / (Math.PI * T * T) : null;
}
// BRANCH B -- pole/fold scale: nearest-pair pole at distance ~ y from the footer gives the EFFECTIVE
// target magnitude |u_0-double-prime_pole| ~ 4 / y^3 (m-double-prime ~ 2 / (z - t)^3, u_0 = 2 m). This is
// the magnitude an EFFECTIVE c(N) must reach; a genuine LOWER bound there needs the S3/S4 non-cancellation.
function cPoleScale(y) {
  return y > 0 ? 4 / (y * y * y) : null;
}
// C_H(N) = sqrt(2 / c(N)) for a given candidate curvature lower bound c.
function cH(c) {
  return c !== null && c > 0 ? Math.sqrt(2 / c) : null;
}

// Height ladder witnessing the bifurcation: branch A grows (ineffective), branch B decays (effective).
const N_LADDER = [1e3, 1e6, 1e10, 1.236e13, 1e16];
const CANDIDATE_LADDER = N_LADDER.map((N) => {
  const T = effectiveHeightForN(N); // finite achieved height (RvM inverse)
  const y = ySharp(N); // strip floor: strictly positive at finite N
  const psi = psiN(N, T);
  const sqrtPsi = psi !== null && psi > 0 ? Math.sqrt(psi) : null;
  const c_sm = cSmooth(T);
  const c_pole = cPoleScale(y);
  const CH_sm = cH(c_sm);
  const CH_pole = cH(c_pole);
  return {
    N,
    T_star: T,
    y_N_sharp: y,
    psi_N: psi,
    // Branch A -- smooth trend (certifiable, ineffective)
    c_smooth: c_sm,
    C_H_smooth: CH_sm,
    E_coll_smooth: CH_sm !== null && sqrtPsi !== null ? CH_sm * sqrtPsi : null,
    // Branch B -- pole / fold scale (effective in form, uncertified lower bound)
    c_poleScale: c_pole,
    C_H_poleScale: CH_pole,
    E_coll_poleScale: CH_pole !== null && sqrtPsi !== null ? CH_pole * sqrtPsi : null,
  };
});

// Branch A is ineffective: E_coll_smooth GROWS strictly across the ladder.
const E_SMOOTH_STRICTLY_GROWS = (() => {
  for (let i = 1; i < CANDIDATE_LADDER.length; i++) {
    if (!(CANDIDATE_LADDER[i].E_coll_smooth > CANDIDATE_LADDER[i - 1].E_coll_smooth)) return false;
  }
  return true;
})();
// Branch B is effective in form: E_coll_poleScale DECAYS strictly across the ladder.
const E_POLE_STRICTLY_DECAYS = (() => {
  for (let i = 1; i < CANDIDATE_LADDER.length; i++) {
    if (!(CANDIDATE_LADDER[i].E_coll_poleScale < CANDIDATE_LADDER[i - 1].E_coll_poleScale)) return false;
  }
  return true;
})();
// Branch A lower bound is unconditionally positive (nonvanishing) at every rung.
const C_SMOOTH_ALL_POSITIVE = CANDIDATE_LADDER.every(
  (r) => r.c_smooth !== null && r.c_smooth > 0 && Number.isFinite(r.c_smooth),
);

const ESTIMATE_REQUIREMENT_COUNT = 4; // D1 mollified density; D2 second derivative split; D3 lower bound / non-cancellation; D4 uniformity in footer

export const IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND = {
  id: 'imp-36236',
  proofSection: 'S-frontier',
  question:
    'Derive the candidate finite-height curvature LOWER bound c(N) <= |u_0-double-prime(z_0*; y_N^sharp)| ' +
    'that would make the imp-36172 S2 finite-N shock-Lipschitz surrogate EFFECTIVE (so C_H(N) = sqrt(2 / ' +
    'c(N)) is finite and E_coll decays), and enumerate the mollified-RvM-density second-derivative estimate ' +
    'it needs. Derivation / scoping only; certifies no lower bound; C_H stays symbolic; ' +
    'G6a_shock_lipschitz stays OPEN; NO QED.',
  moduleAnchor: {
    C_H_closedForm:
      'C_H(N) = C_W = sqrt(2 / c(N)), c(N) = a certified LOWER bound on the shock-characteristic curvature ' +
      '|u_0-double-prime(z_0*; y_N^sharp)| at the finite-height footer; composed with imp-341 psi_N gives ' +
      'E_coll(N) <= C_H(N) sqrt(psi_N(y_N^sharp))',
    molllifiedSecondDerivative:
      'u_0-double-prime(z_0*) = 2 m-double-prime(z_0*), m(z) = integral dN(t) / (z - t), so ' +
      'm-double-prime(z) = 2 integral dN(t) / (z - t)^3; split dN = rho_sm dt + dS with smooth trend ' +
      'rho_sm(t) = (1 / 2 pi) log(t / 2 pi) and fluctuation dS -- the curvature LOWER bound is a lower ' +
      'bound on |m-double-prime| at the footer z_0* = x_0 + i y_N^sharp',
    whyLowerBoundIsMissingHalf:
      'imp-36217 sourced from C6 only the DUAL density CEILING (an UPPER bound on |u_0-double-prime|), HALF ' +
      'of imp-36172 S2; the matching LOWER bound c(N) that C_H(N) = sqrt(2 / c(N)) needs is the residual ' +
      'this module derives IN CANDIDATE FORM',
  },
  estimateRequirements: {
    D1_mollifiedDensityAtFooter:
      'the Poisson/Cauchy-mollified counting density m(z) = integral dN(t) / (z - t) evaluated at the ' +
      'footer z_0* = x_0 + i y_N^sharp, split into the RvM smooth trend rho_sm(t) = (1 / 2 pi) log(t / 2 ' +
      'pi) and the fluctuation dS(t) -- finite off the axis because y_N^sharp > 0',
    D2_secondDerivativeSplit:
      'the second spatial derivative u_0-double-prime = 2 m-double-prime = 4 integral dN(t) / (z - t)^3, ' +
      'decomposed into a SMOOTH-trend curvature 2 rho_sm-double-prime(T) = -(1 / pi) T^{-2} and a ' +
      'POLE/fluctuation curvature dominated by the nearest-pair pole at distance ~ y_N^sharp',
    D3_lowerBoundAndNonCancellation:
      'a LOWER bound |m-double-prime(z_0*)| >= c(N) / 2 > 0: the smooth branch gives it unconditionally but ' +
      'TINY; an EFFECTIVE (pole-scale) lower bound requires certifying the pole sum does NOT destructively ' +
      'CANCEL at the footer (shock stays SIMPLE off axis, imp-36172 S3) via the imp-36172 S4 finite-strip ' +
      'complex fold inversion -- GREENFIELD',
    D4_uniformityInFooterLocation:
      'the lower bound must hold uniformly as the footer location z_0*(y_N^sharp) moves with N along the ' +
      'strip floor y_N^sharp = sqrt(2 pi / N), so that c(N) is a genuine N-indexed bound and not a ' +
      'single-point value',
  },
  candidateBranches: {
    branchA_smoothTrend:
      'c_sm(N) = 2 |rho_sm-double-prime(T)| = (1 / pi) T^{-2}, T = effectiveHeightForN(N): UNCONDITIONALLY ' +
      'POSITIVE and certifiable (no fold inversion), but TINY -- C_H_sm(N) = sqrt(2 / c_sm) = sqrt(2 pi) T ' +
      'GROWS and the assembled E_coll(N) = C_H_sm sqrt(psi_N) GROWS with N. CERTIFIABLE but INEFFECTIVE',
    branchB_poleFoldScale:
      'c_pole(N) ~ 4 / y_N^sharp^3 (nearest-pair pole at distance ~ y_N^sharp): C_H_pole(N) = sqrt(2 / ' +
      'c_pole) = y_N^sharp^{3/2} / sqrt(2) DECAYS so E_coll(N) DECAYS -- the EFFECTIVE regime. But 4 / ' +
      'y_N^sharp^3 is an UPPER magnitude estimate; a genuine LOWER bound there needs the S3 non-degeneracy ' +
      '+ S4 fold inversion. EFFECTIVE in form but GREENFIELD as a certificate',
    theGapIsTheResidual:
      'the distance between the tiny certifiable smooth curvature T^{-2} and the effective pole scale ' +
      'y_N^sharp^{-3} is EXACTLY the imp-36217 gap-to-curvature transcription constant kappa that S4 must ' +
      'supply; the candidate c(N) is derived IN FORM but an EFFECTIVE c(N) is not certified',
  },
  candidateLadder: CANDIDATE_LADDER,
  ladderFindings: {
    smoothBranchIneffectiveGrows:
      'E_coll under the smooth-trend lower bound grows across the ladder (~3.3e3 at N=1e3 to ~5.6e12 at ' +
      'N=1e16): the certifiable curvature lower bound exists but is too small to yield a decaying bound',
    poleBranchEffectiveDecays:
      'E_coll under the pole-scale target decays across the ladder (~1.5e-2 at N=1e3 to ~3.2e-15 at ' +
      'N=1e16): the effective regime, but the pole-scale lower bound itself is un-certified',
    C_H_smoothClosedForm: 'C_H_sm(N) = sqrt(2 / c_sm) = sqrt(2 pi) T ~ 2.5066 T (grows linearly in height)',
    C_H_poleClosedForm: 'C_H_pole(N) = sqrt(2 / c_pole) = y_N^sharp^{3/2} / sqrt(2) (decays as N^{-3/4})',
  },
  residualSubGap: {
    effectiveLowerBoundStillOpen:
      'an EFFECTIVE (pole-scale) curvature LOWER bound c(N) requires the imp-36172 S3 simple-shock ' +
      'non-degeneracy (no destructive cancellation of the pole sum off the axis) AND the S4 finite-strip ' +
      'complex fold inversion (a TRUNCATED G6a-sub-hyperbolic Riemann-Hilbert transcription); both are ' +
      'un-ported. The candidate is derived in form; no lower bound is certified',
    consistentWithImp36217:
      'imp-36217 sourced the UPPER curvature control (density ceiling) from C6 and named the matching ' +
      'LOWER bound c(X) as its residual; this module fills that residual only IN CANDIDATE FORM and ' +
      'confirms the certifiable branch is ineffective -- so the residual is the transcription constant ' +
      'kappa, not the existence of any positive lower bound',
  },
  obstruction: {
    uniformLimitReinstatesWall:
      'driving N -> infinity forces y_N^sharp -> 0+, putting the footer on the real axis where ' +
      'u_0-double-prime diverges (imp-354 boundary shock) and the only uniform-constant route -- backward ' +
      'de Bruijn-flow gap-Lipschitz Gronwall -- is imp-2640 NEGATIVE (imp-35056 persistence). A candidate ' +
      'finite-height lower bound does not touch either wall',
    necessaryNotSufficient:
      'a nonvanishing c(N) is NECESSARY for a finite C_H(N) but a nonvanishing value is not SUFFICIENT: the ' +
      'magnitude must reach the pole scale for E_coll to decay, and that magnitude is exactly what the S4 ' +
      'fold inversion must certify -- NECESSARY-BUT-NOT-SUFFICIENT',
    staysOpenNoQed:
      'this module derives the candidate c(N) in form and enumerates the estimate; it certifies no lower ' +
      'bound and ports nothing, so G6a_shock_lipschitz stays OPEN and C_H stays symbolic',
  },
  isRigorous: false,
  verdict:
    'CANDIDATE FINITE-HEIGHT CURVATURE LOWER BOUND c(N) DERIVED IN FORM (frontier, NOT rigorous). For the ' +
    'imp-36172 S2 finite-N shock-Lipschitz surrogate to be EFFECTIVE, C_H(N) = sqrt(2 / c(N)) needs a ' +
    'certified curvature LOWER bound c(N) <= |u_0-double-prime(z_0*; y_N^sharp)| at the finite-height footer ' +
    'z_0* = x_0 + i y_N^sharp, where u_0-double-prime = 2 m-double-prime and m-double-prime(z) = 2 integral ' +
    'dN(t) / (z - t)^3. The candidate splits into TWO branches: BRANCH A (smooth RvM trend) c_sm(N) = (1 / ' +
    'pi) T^{-2} is UNCONDITIONALLY POSITIVE and certifiable but TINY, so C_H_sm(N) = sqrt(2 pi) T GROWS and ' +
    'E_coll grows (~3.3e3 to ~5.6e12 across N = 1e3..1e16) -- CERTIFIABLE but INEFFECTIVE; BRANCH B ' +
    '(pole/fold scale) c_pole(N) ~ 4 / y_N^sharp^3 gives C_H_pole(N) = y_N^sharp^{3/2} / sqrt(2) which ' +
    'DECAYS so E_coll decays (~1.5e-2 to ~3.2e-15) -- EFFECTIVE in form, but 4 / y_N^sharp^3 is an UPPER ' +
    'magnitude estimate whose conversion to a LOWER bound needs the imp-36172 S3 non-degeneracy (no ' +
    'destructive cancellation of the pole sum off axis) + S4 finite-strip complex fold inversion, which is ' +
    'GREENFIELD. The gap between the tiny certifiable smooth curvature and the effective pole scale is ' +
    'EXACTLY the imp-36217 gap-to-curvature transcription constant kappa. The mollified-RvM-density ' +
    'second-derivative estimate needed is enumerated D1-D4 (mollified density at footer; second-derivative ' +
    'split; lower bound / non-cancellation; uniformity in footer location). NECESSARY-BUT-NOT-SUFFICIENT: a ' +
    'nonvanishing c(N) is necessary for a finite C_H(N) but only the pole-scale magnitude makes E_coll ' +
    'decay, and that magnitude is un-certified; the uniform limit y_N^sharp -> 0+ reinstates the imp-354 ' +
    'boundary shock and the imp-2640 NEGATIVE Gronwall route. DERIVATION / SCOPING ONLY: certifies no lower ' +
    'bound; constructs no rigorous curvature bound; ports no Riemann-Hilbert fold inversion; does NOT ' +
    're-attempt the RH-hard Gronwall route; discharges no gap; G6a_shock_lipschitz stays OPEN; C_H stays ' +
    'symbolic; C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) untouched; changes no bound; ' +
    'respects the imp-2519 no-overclaim guard; NO QED. No refereed bound is changed.',
  citation:
    'imp-36172 (finite-N surrogate requirements S1-S5; S2 certified finite-height curvature LOWER bound ' +
    'GREENFIELD, S3 non-degeneracy, S4 finite-strip fold inversion); imp-36217 (finite-strip Hoelder ' +
    'constant from C6: UPPER curvature control sourced, LOWER bound c(X) residual); imp-354 / ' +
    'lambda-burgers-shock-lipschitz (C_H = sqrt(2 / |u_0-double-prime(z_0*)|), C_W placeholder 1.0); imp-341 ' +
    '(Koksma-Hlawka strip modulus psi_N, C1 = pi C_Selberg); imp-2640 (backward-flow gap-Lipschitz Gronwall ' +
    'NEGATIVE); imp-35056 (asymptotic-modulo persistence); lambda-rh-height-mapping (effectiveHeightForN). ' +
    'Whitham 1974 Section 2.7; Polymath15 / Tao arXiv:1904.12438; Platt-Trudgian 2021 (barrier base).',
};

export const IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND_ASSERTIONS = [
  {
    // The candidate is stated in closed form C_H(N) = sqrt(2 / c(N)) over the mollified second derivative,
    // and the C_H = sqrt(2/c) relation holds numerically for both branches at a sample rung.
    id: 'imp36236-candidate-form-and-CH-relation',
    description: 'C_H(N) = sqrt(2 / c(N)) over u_0-double-prime = 2 m-double-prime; the relation holds for both branches at every rung',
    holds: () => {
      const a = IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND.moduleAnchor;
      const relationOk = CANDIDATE_LADDER.every(
        (r) =>
          Math.abs(r.C_H_smooth - Math.sqrt(2 / r.c_smooth)) < 1e-9 * r.C_H_smooth &&
          Math.abs(r.C_H_poleScale - Math.sqrt(2 / r.c_poleScale)) < 1e-9 * (r.C_H_poleScale + 1e-30),
      );
      return (
        /sqrt\(2 \/ c\(N\)\)/.test(a.C_H_closedForm) &&
        /m-double-prime/.test(a.molllifiedSecondDerivative) &&
        relationOk
      );
    },
  },
  {
    // BRANCH A: the smooth-trend lower bound is unconditionally positive (nonvanishing) but INEFFECTIVE --
    // E_coll grows across the ladder. C_H_sm = sqrt(2 pi) T (grows linearly in height).
    id: 'imp36236-branchA-smooth-certifiable-ineffective',
    description: 'smooth-trend c_sm(N) = (1/pi) T^-2 > 0 at every rung; C_H_sm = sqrt(2 pi) T; E_coll_smooth strictly GROWS (ineffective)',
    holds: () => {
      const CHok = CANDIDATE_LADDER.every(
        (r) => Math.abs(r.C_H_smooth - Math.sqrt(TWO_PI) * r.T_star) < 1e-6 * r.C_H_smooth,
      );
      const cSmForm = CANDIDATE_LADDER.every(
        (r) => Math.abs(r.c_smooth - 1 / (Math.PI * r.T_star * r.T_star)) < 1e-12 * r.c_smooth,
      );
      return C_SMOOTH_ALL_POSITIVE && CHok && cSmForm && E_SMOOTH_STRICTLY_GROWS;
    },
  },
  {
    // BRANCH B: the pole-scale target is EFFECTIVE (E_coll decays) but is an upper magnitude estimate whose
    // lower bound is greenfield (S3 non-degeneracy + S4 fold inversion).
    id: 'imp36236-branchB-pole-effective-greenfield',
    description: 'pole-scale c_pole(N) ~ 4 / y^3; C_H_pole = y^{3/2}/sqrt(2); E_coll_poleScale strictly DECAYS (effective in form); lower bound is greenfield',
    holds: () => {
      const CHok = CANDIDATE_LADDER.every(
        (r) => Math.abs(r.C_H_poleScale - Math.pow(r.y_N_sharp, 1.5) / Math.sqrt(2)) < 1e-9,
      );
      const b = IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND.candidateBranches;
      return (
        E_POLE_STRICTLY_DECAYS &&
        CHok &&
        /UPPER magnitude estimate/.test(b.branchB_poleFoldScale) &&
        /GREENFIELD/.test(b.branchB_poleFoldScale) &&
        /S4 fold inversion/.test(b.branchB_poleFoldScale)
      );
    },
  },
  {
    // The mollified-RvM-density second-derivative estimate is enumerated D1-D4, naming the non-cancellation
    // (D3) and the uniformity in footer location (D4).
    id: 'imp36236-estimate-requirements-D1-D4',
    description: 'D1-D4 enumerated: mollified density at footer; second-derivative split; lower bound / non-cancellation; uniformity in footer location',
    holds: () => {
      const d = IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND.estimateRequirements;
      return (
        Object.keys(d).length === ESTIMATE_REQUIREMENT_COUNT &&
        /footer z_0\* = x_0 \+ i y_N\^sharp/.test(d.D1_mollifiedDensityAtFooter) &&
        /SMOOTH-trend curvature/.test(d.D2_secondDerivativeSplit) &&
        /CANCEL/.test(d.D3_lowerBoundAndNonCancellation) &&
        /GREENFIELD/.test(d.D3_lowerBoundAndNonCancellation) &&
        /uniformly/.test(d.D4_uniformityInFooterLocation)
      );
    },
  },
  {
    // The gap between the branches IS the imp-36217 transcription constant residual; consistent framing.
    id: 'imp36236-gap-is-imp36217-residual',
    description: 'the gap between the tiny smooth curvature and the effective pole scale is the imp-36217 gap-to-curvature transcription constant kappa (residual)',
    holds: () => {
      const b = IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND.candidateBranches;
      const r = IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND.residualSubGap;
      return (
        /transcription constant kappa/.test(b.theGapIsTheResidual) &&
        /imp-36217/.test(r.consistentWithImp36217) &&
        /S4 finite-strip complex fold inversion/.test(r.effectiveLowerBoundStillOpen) &&
        /un-ported/.test(r.effectiveLowerBoundStillOpen)
      );
    },
  },
  {
    // Honesty gate: derivation only; G6a open; C_H symbolic; exponent 1/2; no QED; no refereed bound is changed.
    id: 'imp36236-honesty-gate-no-qed',
    description: 'derivation only; G6a_shock_lipschitz stays OPEN; C_H stays symbolic; Hoelder exponent pinned at 1/2; no QED; no refereed bound is changed',
    holds: () =>
      IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      HOLDER_EXPONENT === 0.5 &&
      /G6a_shock_lipschitz stays OPEN/.test(IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND.verdict) &&
      /C_H stays[\s\S]*symbolic/.test(IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND.verdict) &&
      /NO QED/.test(IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND.verdict) &&
      /refereed bound is changed/i.test(IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND.verdict),
  },
];

for (const a of IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36236-candidate-finite-height-curvature-lower-bound assertion failed: ${a.id}`);
  }
}

export default IMP36236_CANDIDATE_FINITE_HEIGHT_CURVATURE_LOWER_BOUND;
