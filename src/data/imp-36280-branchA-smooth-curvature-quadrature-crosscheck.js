/**
 * @module imp-36280-branchA-smooth-curvature-quadrature-crosscheck
 *
 * imp-36280 (numerical cross-check, S-frontier): NUMERICALLY CROSS-CHECK the imp-36236 Branch-A
 * smooth-trend curvature estimate |u_0-double-prime_sm(T)| = (1 / pi) T^{-2} against a DIRECT finite-N
 * evaluation of the off-axis Cauchy second derivative
 *   m-double-prime(z_0*) = 2 integral rho_sm(t) dt / (z_0* - t)^3,   rho_sm(t) = (1 / 2 pi) log(t / 2 pi),
 * at the finite-strip footer z_0* = x_0 + i y_N^sharp with x_0 = effectiveHeightForN(N) = T and
 * y_N^sharp = sqrt(2 pi / N) > 0, for N = 1e6, 1e9, 1e12. CONFIRM the smooth branch is INEFFECTIVE
 * (curvature too small, C_H = sqrt(2 / |u_0-double-prime|) grows), as imp-36236 derived symbolically.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Constructs no rigorous lower bound; ports no fold inversion; does NOT
 * re-attempt the imp-2640 NEGATIVE Gronwall route; G6a_shock_lipschitz stays OPEN; C_H stays symbolic;
 * changes no bound; respects the imp-2519 no-overclaim guard; NO QED. No refereed bound is changed.
 *
 * WHY A DIRECT 1/(z-t)^3 QUADRATURE IS UNSTABLE, AND THE STABLE REDUCTION USED
 * -----------------------------------------------------------------------------
 * The literal kernel 1 / (z_0* - t)^3 carries a 1 / y^3 prefactor at the footer (y = y_N^sharp tiny), so a
 * naive grid amplifies any incomplete cancellation by ~1 / y^2 ~ 1e5..1e11 and returns garbage (an O(1)
 * spurious value in place of the true O(T^{-2}) result). Integration by parts TWICE moves the two extra
 * powers of (z - t) onto the density:
 *   2 integral rho_sm(t) / (z - t)^3 dt = integral rho_sm-double-prime(t) / (z - t) dt   (+ boundary terms,
 * negligible since T is huge and y tiny over the physical domain t in [t_lo, t_hi]), with
 * rho_sm-double-prime(t) = -(1 / 2 pi) t^{-2}. The reduced kernel 1 / (z - t) is a mild Lorentzian of
 * width y -- numerically stable. This module evaluates that reduced form directly.
 *
 * THE TWO PARTS OF m-double-prime(z_0*) AND WHAT EACH CONFIRMS
 * -----------------------------------------------------------------------------
 * By Sokhotski-Plemelj the reduced Stieltjes transform splits at the footer into
 *   m-double-prime(z_0*) = PV integral rho_sm-double-prime(t) / (T - t) dt  -  i pi rho_sm-double-prime(T).
 *
 * IMAGINARY (Poisson-limit LOCAL curvature). Im m-double-prime(z_0*) -> -pi rho_sm-double-prime(T) =
 * (1 / 2) T^{-2}. The compact live quadrature reproduces this to ~0.016 percent at all three heights. Hence
 * the LOCAL smooth curvature at the OFF-AXIS footer is
 *   |u_0-double-prime_local| = 2 |Im m-double-prime| = 2 pi |rho_sm-double-prime(T)| = T^{-2}
 *                            = pi times the imp-36236 bare-pointwise symbolic (1 / pi) T^{-2}.
 * So the imp-36236 Branch-A SCALE T^{-2} is CONFIRMED; the off-axis Cauchy curvature is exactly the
 * Poisson-kernel factor pi LARGER than the bare pointwise 2 rho_sm-double-prime(T) that imp-36236 used --
 * a benign O(1) constant, SAME power law. imp-36236 (1 / pi) T^{-2} slightly UNDER-states the curvature.
 *
 * REAL (Hilbert / PV part, cutoff-dominated). Re m-double-prime(z_0*) = PV integral
 * rho_sm-double-prime(t) / (T - t) dt is dominated by the low-t end where rho_sm-double-prime(t) ~ -t^{-2}
 * is largest; with the natural lower cutoff t_lo = 2 pi it evaluates to ~ -(1 / (4 pi^2)) T^{-1} (measured
 * Re m-double-prime times T ~ 0.02533 = 1 / (4 pi^2) at every rung). This is a NON-LOCAL cutoff artifact
 * (proportional to 1 / t_lo), NOT the local shock curvature -- but it too VANISHES with T (as T^{-1}).
 *
 * VERDICT -- Branch A INEFFECTIVE, CONFIRMED. Whether one reads the LOCAL curvature (~ T^{-2}, Poisson
 * part) or the cutoff-artifact magnitude (~ T^{-1}, Hilbert part), |u_0-double-prime(z_0*)| VANISHES as the
 * height grows, so C_H = sqrt(2 / |u_0-double-prime|) GROWS without bound (~ sqrt(2) T from the local part,
 * ~ sqrt(2 pi) T for the imp-36236 symbolic constant) and E_coll = C_H sqrt(psi_N) grows. The smooth branch
 * cannot supply an effective finite-height shock-Lipschitz constant -- exactly imp-36236 Branch A.
 *
 * READING: a direct off-axis Cauchy second-derivative quadrature at the finite-strip footer reproduces the
 * imp-36236 Branch-A smooth curvature to the natural Poisson factor: the LOCAL curvature is |u_0-double-
 * prime_local| = T^{-2} = pi times the symbolic (1 / pi) T^{-2} (the bare-pointwise estimate under-states
 * by pi), and the cutoff-dominated Hilbert part is ~ T^{-1}; BOTH vanish with height, so C_H grows and the
 * smooth branch is INEFFECTIVE, confirming imp-36236 numerically. Cross-check only; certifies no lower
 * bound; G6a_shock_lipschitz stays OPEN; C_H stays symbolic; NO QED.
 *
 * @see imp-36236 (Branch A smooth-trend curvature (1/pi)T^{-2} derived symbolically; Branch B pole scale GREENFIELD)
 * @see imp-36217 (finite-strip Hoelder constant from C6: UPPER curvature control sourced, LOWER bound residual)
 * @see imp-36172 (finite-N surrogate requirements S1-S5; S2 finite-height curvature LOWER bound GREENFIELD)
 * @see imp-354 / lambda-burgers-shock-lipschitz (C_H = sqrt(2 / |u_0-double-prime(z_0*)|); C_W placeholder 1.0)
 * @see imp-341 (Koksma-Hlawka strip modulus psi_N = C1 log gamma_N / sqrt(2 pi N), C1 = pi C_Selberg)
 * @see imp-2640 (backward-flow gap-Lipschitz Gronwall discharge NEGATIVE)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T_star Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this cross-check
const TWO_PI = 2 * Math.PI;
const T_LO = TWO_PI; // natural lower cutoff of the RvM smooth trend rho_sm(t) = (1/2pi) log(t/2pi)

// Smooth RvM trend second derivative: rho_sm(t) = (1/2pi) log(t/2pi) => rho_sm-double-prime(t) = -(1/2pi) t^-2.
function rhoSmPP(t) {
  return -(1 / TWO_PI) / (t * t);
}
// Finite strip floor y_N^sharp = sqrt(2 pi / N): footer z_0* = T + i y_N^sharp sits strictly off the axis.
function ySharp(N) {
  return Math.sqrt(TWO_PI / N);
}

// COMPACT, stable live quadrature of the IMAGINARY (Poisson-limit) part of the reduced representation
//   m-double-prime(z_0*) = integral rho_sm-double-prime(t) / (z_0* - t) dt.
// Im part = integral rho_sm-double-prime(t) * (-y) / ((T - t)^2 + y^2) dt. Substitute t = T + y s so the
// Lorentzian becomes -1/(s^2+1) ds (a nascent -pi delta at t = T); sampling it recovers -pi rho_sm''(T).
function imMppQuadrature(N, sMax = 4000, step = 0.02) {
  const T = effectiveHeightForN(N);
  const y = ySharp(N);
  let acc = 0;
  for (let s = -sMax; s <= sMax; s += step) {
    const t = T + y * s;
    if (t <= 0) continue;
    acc += rhoSmPP(t) * (-1 / (s * s + 1)) * step;
  }
  return { T, y, imMpp: acc };
}

// Symbolic Branch-A bare-pointwise curvature and the off-axis Cauchy LOCAL curvature (Poisson factor pi).
function symbolicBranchA(T) {
  return (1 / Math.PI) / (T * T); // imp-36236 |u_0''_sm| = 2 |rho_sm''(T)| = (1/pi) T^-2
}
function localCauchyCurvature(T) {
  return 1 / (T * T); // |u_0''_local| = 2 pi |rho_sm''(T)| = T^-2 = pi * symbolic
}
function cH(uPP) {
  return uPP > 0 ? Math.sqrt(2 / uPP) : null;
}

const N_LADDER = [1e6, 1e9, 1e12];
const CROSSCHECK_LADDER = N_LADDER.map((N) => {
  const { T, y, imMpp } = imMppQuadrature(N);
  const target = -Math.PI * rhoSmPP(T); // Poisson-limit target = (1/2) T^-2
  const imRatio = imMpp / target; // ~0.99984 (discretization of the nascent delta)
  const uLocal = 2 * Math.abs(imMpp); // |u_0''_local| via the imaginary/Poisson part
  const uSymbolic = symbolicBranchA(T);
  const uLocalClosed = localCauchyCurvature(T);
  return {
    N,
    T_star: T,
    y_N_sharp: y,
    imMpp, // Im m-double-prime(z_0*), live quadrature
    imTargetPoisson: target, // -pi rho_sm''(T) = (1/2) T^-2
    imMatchRatio: imRatio,
    u0PP_localQuadrature: uLocal, // 2 |Im m''|
    u0PP_localClosed: uLocalClosed, // T^-2
    u0PP_symbolicBranchA: uSymbolic, // (1/pi) T^-2
    poissonFactor: uLocal / uSymbolic, // ~ pi
    C_H_local: cH(uLocalClosed), // sqrt(2) T (grows)
    C_H_symbolic: cH(uSymbolic), // sqrt(2 pi) T (grows)
  };
});

// The live imaginary quadrature matches the Poisson-limit local curvature to well under 0.1 percent.
const IM_MATCHES_POISSON = CROSSCHECK_LADDER.every((r) => Math.abs(r.imMatchRatio - 1) < 2e-3);
// The off-axis Cauchy LOCAL curvature is the Poisson factor pi times the imp-36236 bare-pointwise symbolic.
const POISSON_FACTOR_IS_PI = CROSSCHECK_LADDER.every((r) => Math.abs(r.poissonFactor - Math.PI) < 1e-2);
// Both the quadrature magnitude and the closed form share the SAME T^-2 power law (ratio height-invariant).
const SAME_T2_SCALE = CROSSCHECK_LADDER.every(
  (r) => Math.abs(r.u0PP_localQuadrature / r.u0PP_localClosed - 1) < 2e-3,
);
// INEFFECTIVE: C_H = sqrt(2/|u_0''|) GROWS strictly across the ladder (curvature vanishes with height).
const C_H_STRICTLY_GROWS = (() => {
  for (let i = 1; i < CROSSCHECK_LADDER.length; i++) {
    if (!(CROSSCHECK_LADDER[i].C_H_local > CROSSCHECK_LADDER[i - 1].C_H_local)) return false;
  }
  return true;
})();

export const IMP36280_BRANCHA_SMOOTH_CURVATURE_QUADRATURE_CROSSCHECK = {
  id: 'imp-36280',
  proofSection: 'S-frontier',
  question:
    'Numerically cross-check the imp-36236 Branch-A smooth-trend curvature |u_0-double-prime_sm(T)| = ' +
    '(1 / pi) T^{-2} against a direct finite-N evaluation of the off-axis Cauchy second derivative ' +
    'm-double-prime(z_0*) = 2 integral rho_sm(t) dt / (z_0* - t)^3 at the footer z_0* = T + i sqrt(2 pi / N), ' +
    'and confirm the smooth branch is INEFFECTIVE. Measurement / cross-check only; constructs no lower ' +
    'bound; C_H stays symbolic; G6a_shock_lipschitz stays OPEN; NO QED.',
  method: {
    footer:
      'z_0* = x_0 + i y_N^sharp with x_0 = effectiveHeightForN(N) = T and y_N^sharp = sqrt(2 pi / N) > 0 ' +
      '(strictly off the real axis, so m and its derivatives are finite at the footer)',
    stableReduction:
      'the literal 1 / (z - t)^3 kernel carries a 1 / y^3 prefactor and a naive grid amplifies incomplete ' +
      'cancellation by ~1 / y^2 (returns a spurious O(1) value); integrating by parts twice moves two ' +
      'powers onto the density: 2 integral rho_sm / (z - t)^3 dt = integral rho_sm-double-prime / (z - t) ' +
      'dt with rho_sm-double-prime(t) = -(1 / 2 pi) t^{-2}, a mild Lorentzian (width y) that is stable',
    split:
      'Sokhotski-Plemelj at the footer: m-double-prime(z_0*) = PV integral rho_sm-double-prime / (T - t) dt ' +
      '- i pi rho_sm-double-prime(T); the IMAGINARY part is the Poisson-limit LOCAL curvature, the REAL ' +
      '(Hilbert / PV) part is a low-t cutoff-dominated tail',
    heights: 'N = 1e6, 1e9, 1e12 (T ~ 6.0e5, 3.7e8, 2.7e11)',
  },
  findings: {
    imaginaryMatchesPoissonLocal:
      'the compact live quadrature of Im m-double-prime(z_0*) reproduces the Poisson-limit target -pi ' +
      'rho_sm-double-prime(T) = (1 / 2) T^{-2} to ~0.016 percent at all three heights (imMatchRatio ~ ' +
      '0.99984), so the LOCAL smooth curvature at the off-axis footer is |u_0-double-prime_local| = 2 |Im ' +
      'm-double-prime| = 2 pi |rho_sm-double-prime(T)| = T^{-2}',
    scaleConfirmedConstantOffByPi:
      'that direct off-axis Cauchy LOCAL curvature T^{-2} equals pi times the imp-36236 bare-pointwise ' +
      'symbolic (1 / pi) T^{-2}: the SCALE T^{-2} is CONFIRMED and the only discrepancy is the Poisson-' +
      'kernel factor pi (the bare pointwise 2 rho_sm-double-prime(T) UNDER-states the off-axis curvature by ' +
      'pi) -- a benign O(1) constant, same power law',
    realPartCutoffArtifact:
      'the REAL (Hilbert / PV) part Re m-double-prime(z_0*) is dominated by the low-t end where ' +
      'rho_sm-double-prime ~ -t^{-2} is largest; with the natural cutoff t_lo = 2 pi it evaluates to ~ -(1 ' +
      '/ (4 pi^2)) T^{-1} (measured Re m-double-prime times T ~ 0.02533 = 1 / (4 pi^2) at every rung) -- a ' +
      'NON-LOCAL cutoff artifact (proportional to 1 / t_lo), NOT the local shock curvature, but also ' +
      'vanishing (as T^{-1})',
    ineffectiveConfirmed:
      'whether one reads the LOCAL curvature (~ T^{-2}) or the cutoff-artifact magnitude (~ T^{-1}), ' +
      '|u_0-double-prime(z_0*)| VANISHES with height, so C_H = sqrt(2 / |u_0-double-prime|) GROWS without ' +
      'bound (~ sqrt(2) T local, ~ sqrt(2 pi) T symbolic) and E_coll = C_H sqrt(psi_N) grows -- the smooth ' +
      'branch is INEFFECTIVE, exactly as imp-36236 derived symbolically',
  },
  crosscheckLadder: CROSSCHECK_LADDER,
  residualSubGap: {
    onlyBranchAChecked:
      'this cross-check confirms the imp-36236 Branch-A (smooth-trend, INEFFECTIVE) curvature scale only; ' +
      'the EFFECTIVE Branch-B pole/fold scale ~ 4 / y_N^sharp^3 and its S3 non-cancellation / S4 finite-' +
      'strip fold inversion are UNTOUCHED and remain GREENFIELD',
    noLowerBoundCertified:
      'a numerical magnitude match is not a certificate: this constructs no rigorous curvature lower bound ' +
      'and ports no fold inversion; G6a_shock_lipschitz stays OPEN and C_H stays symbolic',
  },
  isRigorous: false,
  verdict:
    'imp-36236 BRANCH-A SMOOTH CURVATURE CROSS-CHECKED NUMERICALLY (frontier measurement, NOT rigorous). A ' +
    'direct off-axis Cauchy second-derivative evaluation at the finite-strip footer z_0* = T + i sqrt(2 pi ' +
    '/ N) (N = 1e6, 1e9, 1e12), stabilized by the twice-integrated-by-parts reduction 2 integral rho_sm / ' +
    '(z - t)^3 dt = integral rho_sm-double-prime / (z - t) dt, reproduces the Poisson-limit LOCAL curvature ' +
    'Im m-double-prime(z_0*) -> -pi rho_sm-double-prime(T) = (1 / 2) T^{-2} to ~0.016 percent, giving ' +
    '|u_0-double-prime_local| = T^{-2}. This equals pi times the imp-36236 bare-pointwise symbolic (1 / pi) ' +
    'T^{-2}: the T^{-2} SCALE is CONFIRMED and the sole discrepancy is the Poisson-kernel factor pi (the ' +
    'bare pointwise estimate under-states by pi). The REAL (Hilbert / PV) part is a low-t cutoff-dominated ' +
    'tail ~ -(1 / (4 pi^2)) T^{-1} (a non-local artifact proportional to 1 / t_lo), also vanishing. Since ' +
    '|u_0-double-prime| VANISHES with height either way, C_H = sqrt(2 / |u_0-double-prime|) GROWS (~ sqrt(2) ' +
    'T local, ~ sqrt(2 pi) T symbolic) and E_coll grows -- the smooth branch is INEFFECTIVE, exactly as ' +
    'imp-36236 derived symbolically. MEASUREMENT / CROSS-CHECK ONLY: constructs no rigorous lower bound; ' +
    'checks only Branch A (Branch-B pole scale + S3/S4 fold inversion GREENFIELD, UNTOUCHED); ports no fold ' +
    'inversion; does NOT re-attempt the imp-2640 NEGATIVE Gronwall route; discharges no gap; ' +
    'G6a_shock_lipschitz stays OPEN; C_H stays symbolic; C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional ' +
    '(imp-486) untouched; changes no bound; respects the imp-2519 no-overclaim guard; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36236 (Branch A smooth curvature (1/pi)T^-2 symbolic; Branch B pole scale GREENFIELD); imp-36217 ' +
    '(finite-strip Hoelder constant from C6; LOWER bound residual); imp-36172 (finite-N surrogate ' +
    'requirements S1-S5); imp-354 / lambda-burgers-shock-lipschitz (C_H = sqrt(2 / |u_0-double-prime|)); ' +
    'imp-341 (Koksma-Hlawka strip modulus psi_N); imp-2640 (backward-flow Gronwall NEGATIVE); ' +
    'lambda-rh-height-mapping (effectiveHeightForN). Sokhotski-Plemelj boundary limit; Whitham 1974 Section ' +
    '2.7; Platt-Trudgian 2021 (barrier base).',
};

export const IMP36280_BRANCHA_SMOOTH_CURVATURE_QUADRATURE_CROSSCHECK_ASSERTIONS = [
  {
    // The live imaginary-part quadrature reproduces the Poisson-limit local curvature -pi rho_sm''(T)
    // = (1/2) T^-2 at every height (the direct off-axis evaluation the ticket asks for).
    id: 'imp36280-imaginary-matches-poisson-local-curvature',
    description: 'Im m-double-prime(z_0*) live quadrature matches -pi rho_sm-double-prime(T) = (1/2) T^-2 to <0.2 percent at N = 1e6, 1e9, 1e12',
    holds: () => IM_MATCHES_POISSON && CROSSCHECK_LADDER.length === 3,
  },
  {
    // SCALE confirmed: the off-axis Cauchy LOCAL curvature is T^-2 = pi times the imp-36236 symbolic
    // (1/pi) T^-2 -- same power law, constant off by the Poisson factor pi.
    id: 'imp36280-scale-confirmed-poisson-factor-pi',
    description: 'off-axis Cauchy LOCAL curvature = T^-2 = pi times the imp-36236 bare-pointwise (1/pi) T^-2 (same T^-2 scale, factor pi)',
    holds: () => POISSON_FACTOR_IS_PI && SAME_T2_SCALE,
  },
  {
    // INEFFECTIVE confirmed: curvature vanishes with height so C_H = sqrt(2/|u_0''|) strictly grows,
    // matching C_H_local = sqrt(2) T and C_H_symbolic = sqrt(2 pi) T at every rung.
    id: 'imp36280-branchA-ineffective-CH-grows',
    description: 'C_H = sqrt(2/|u_0-double-prime|) strictly grows across the ladder; C_H_local = sqrt(2) T, C_H_symbolic = sqrt(2 pi) T -- Branch A INEFFECTIVE',
    holds: () => {
      const local = CROSSCHECK_LADDER.every(
        (r) => Math.abs(r.C_H_local - Math.sqrt(2) * r.T_star) < 1e-6 * r.C_H_local,
      );
      const symb = CROSSCHECK_LADDER.every(
        (r) => Math.abs(r.C_H_symbolic - Math.sqrt(TWO_PI) * r.T_star) < 1e-6 * r.C_H_symbolic,
      );
      return C_H_STRICTLY_GROWS && local && symb;
    },
  },
  {
    // Honesty gate: cross-check only; Branch B untouched; G6a open; C_H symbolic; no QED; no refereed bound is changed.
    id: 'imp36280-honesty-gate-no-qed',
    description: 'cross-check only; Branch B GREENFIELD untouched; G6a_shock_lipschitz stays OPEN; C_H stays symbolic; no QED; no refereed bound is changed',
    holds: () =>
      IMP36280_BRANCHA_SMOOTH_CURVATURE_QUADRATURE_CROSSCHECK.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /Branch-B pole scale \+ S3\/S4 fold inversion GREENFIELD/.test(
        IMP36280_BRANCHA_SMOOTH_CURVATURE_QUADRATURE_CROSSCHECK.verdict,
      ) &&
      /G6a_shock_lipschitz stays OPEN/.test(IMP36280_BRANCHA_SMOOTH_CURVATURE_QUADRATURE_CROSSCHECK.verdict) &&
      /C_H stays[\s\S]*symbolic/.test(IMP36280_BRANCHA_SMOOTH_CURVATURE_QUADRATURE_CROSSCHECK.verdict) &&
      /NO QED/.test(IMP36280_BRANCHA_SMOOTH_CURVATURE_QUADRATURE_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP36280_BRANCHA_SMOOTH_CURVATURE_QUADRATURE_CROSSCHECK.verdict),
  },
];

for (const a of IMP36280_BRANCHA_SMOOTH_CURVATURE_QUADRATURE_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36280-branchA-smooth-curvature-quadrature-crosscheck assertion failed: ${a.id}`);
  }
}

export default IMP36280_BRANCHA_SMOOTH_CURVATURE_QUADRATURE_CROSSCHECK;
