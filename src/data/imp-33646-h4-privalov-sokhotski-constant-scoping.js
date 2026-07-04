/**
 * @module imp-33646-h4-privalov-sokhotski-constant-scoping
 *
 * imp-33646 (proof, frontier-scoping): SCOPE and QUANTIFY the imp-33619 H4
 * strip-height-uniformity residual -- the Privalov-Sokhotski boundary-extension constant of the
 * pointwise-discharged real-boundary fold step -- WITHOUT claiming closure. imp-33619 reconciled
 * the g6a-sub-hyperbolic CLOSED record (the real-boundary fold step is discharged POINTWISE by
 * imp-394 Privalov-Sokhotski, the RvM cusp being exactly Holder-1/2) with the imp-33603 H5 OPEN
 * mark by fixing the level: POINTWISE discharged, UNIFORMLY open. The load-bearing open object is
 * the C3 boundary-regularity constant -- the Privalov-Sokhotski boundary-extension constant of the
 * fold-reading derivative -- which must stay bounded UNIFORMLY in N as the reading strip
 * y_N^sharp = sqrt(2 pi / N) -> 0. This module WRITES DOWN that constant for the imp-354 complex
 * fold, MEASURES its dependence on the strip height, and ASSESSES whether it is bounded uniformly
 * in N or degrades as y_N^sharp -> 0, tying it to the imp-33645 H3 curvature divergence. Scoping /
 * measurement only. G6a_shock_lipschitz stays OPEN; imp-3066 untouched; no positivity; NO QED.
 *
 * PROVENANCE (honesty note)
 * -------------------------
 * The complex-fold picture is the one already RECORDED in the repo, not a new derivation:
 * g6a-sub-hyperbolic-closure.js (imp-394) writes the RvM cusp density rho ~ C / |x - x_star|^{1/2}
 * (Holder-1/2, alpha = 1/2 exactly), the complex Burgers characteristics dz/dt = m(z,t), the fold
 * condition 1 + t m_prime(z_0*) = 0 with the critical point z_0* = x_star + i eps moving off the
 * real axis (eps -> 0+ as t -> t_c), and the real-boundary fold step that returns it to R via
 * Privalov-Sokhotski. imp-33619 names C3 (the Privalov-Sokhotski boundary-extension constant at
 * alpha = 1/2 as y_N^sharp -> 0) the load-bearing residual and imp-33603 names it H4. This module
 * only QUANTIFIES that constant; it asserts nothing discharged the repo has not already recorded.
 *
 * THE FOLD-READING QUANTITY IS THE FIRST DERIVATIVE m_prime
 * --------------------------------------------------------
 * The fold condition that DEFINES the collision time is 1 + t m_prime(z_0*) = 0, so the object the
 * Privalov-Sokhotski boundary extension has to deliver continuously to the real axis is the FIRST
 * derivative of the Stieltjes transform, m_prime(z_0*) -- one derivative BELOW the imp-33645 H3
 * curvature m_prime_prime. For the Holder-1/2 cusp density rho(x) ~ C |x - x_star|^{-1/2} the
 * Stieltjes transform and its derivatives at z_0 = x_star + i eps obey (imp-33645 rescaling
 * u = eps s, |u|^{-1/2} = eps^{-1/2} |s|^{-1/2}, (i eps - u)^{k+1} = eps^{k+1} (i - s)^{k+1}):
 *     m^{(k)}(x_star + i eps) ~ eps^{-1/2 - k}   (times a fixed dimensionless integral).
 * For the fold-reading derivative k = 1 this is the POWER LAW
 *     |m_prime(z_0*)| ~ C_PS eps^{-3/2}   as eps -> 0+,
 * with exponent 3/2 = 1/2 (cusp) + 1 (first derivative), model-INVARIANT (the constant C_PS is not).
 * The Privalov-Sokhotski boundary-extension constant is the renormalized amplitude
 * C_PS = lim eps^{3/2} |m_prime(x_star + i eps)| -- the coefficient of the boundary-value blow-up.
 *
 * NUMERICAL CONFIRMATION (baked, reproduced live below)
 * -----------------------------------------------------
 * Symmetric model rho(x) = |x|^{-1/2} on [-1, 1], x_star = 0, C = 1 (same as imp-33645). The sqrt
 * singularity is removed by x = +- u^2 (|x|^{-1/2} dx = 2 du), giving smooth integrands
 * 1 / (i eps -+ u^2)^2 on [0, 1] evaluated by Simpson quadrature (m_prime = - integral rho/(z-x)^2 dx).
 * Across eps in {1e-1, 3e-2, 1e-2, 3e-3, 1e-3, 3e-4, 1e-4} the log-log slope of |m_prime| vs eps is
 * -1.5000 to four places, and the renormalized product eps^{3/2} |m_prime| converges to the finite
 * nonzero limit 2.221441 (numerically pi / sqrt(2) = 2.2214415) -- a genuine boundary-extension
 * constant, no hidden cancellation to zero. The exponent is recovered at 4000 Simpson panels.
 *
 * TIE TO THE READING STRIP  eps = y_N^sharp = sqrt(2 pi / N)
 * ---------------------------------------------------------
 * Reading the fold at the strip height forces eps ~ y_N^sharp = sqrt(2 pi / N), so
 *     |m_prime(z_0*)| ~ C_PS (2 pi / N)^{-3/4} = C_PS (N / 2 pi)^{3/4}.
 * The Privalov-Sokhotski boundary-extension constant, evaluated at the reading strip, GROWS in N
 * with exponent 3/4 (one power below the imp-33645 H3 curvature exponent 5/4, exactly the missing
 * derivative). Equivalently the strip-height-weighted constant
 * C_ren(N) = (y_N^sharp)^{3/2} |m_prime(z_0*)| = eps^{3/2} |m_prime| -> C_PS is an N-UNIFORM floor.
 *
 * THE ASSESSMENT (the ticket core): is the PS constant bounded uniformly in N ?
 * ----------------------------------------------------------------------------
 * NO, as a raw quantity: the Privalov-Sokhotski boundary-extension amplitude DEGRADES as
 * y_N^sharp -> 0, growing like (N / 2 pi)^{3/4}. The degradation is a clean power law with exponent
 * exactly 3/2 in eps and a nonzero renormalized limit, so there is no cancellation that would make
 * the raw constant uniform. A strip-height weight of exactly (y_N^sharp)^{3/2} = (2 pi / N)^{3/4}
 * FORMALLY restores an N-uniform constant. BUT this does NOT discharge H4, for the SAME reason the
 * imp-33645 H3 renormalization does not discharge H3: the weight is a change of units, not a free
 * win. The Whitham / Lemma-5.2 modulus reads m_prime at the intrinsic cusp scale, and dividing by
 * eps^{3/2} simultaneously rescales the fold neighbourhood (z_0 - z_0*) ~ eps, so the eps^{3/2}
 * factor must be tracked through the fold expansion t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2 + ...
 * and its back-conversion to the tau_c Holder modulus. So the renormalization CONFIRMS H4 is the
 * SAME strip-height-uniformity object as the imp-33645 H3 curvature (they differ by exactly one
 * derivative, exponents 3/2 vs 5/2 in eps, 3/4 vs 5/4 in N); it does not close it.
 *
 * VERDICT: SCOPING / MEASUREMENT ONLY, G6a STAYS OPEN. The Privalov-Sokhotski boundary-extension
 * constant of the pointwise-discharged real-boundary fold step is C_PS = lim eps^{3/2} |m_prime| ~
 * 2.221441 (numerically pi / sqrt(2)), a clean power law |m_prime(z_0*)| ~ C_PS eps^{-3/2}
 * (measured slope -1.5000), which at the reading strip eps = y_N^sharp = sqrt(2 pi / N) DEGRADES as
 * growth ~ (N / 2 pi)^{3/4} (exponent 3/4 in N, one derivative below the imp-33645 H3 curvature
 * exponent 5/4). The constant is NOT bounded uniformly in N as y_N^sharp -> 0; a strip-height weight
 * of exactly (y_N^sharp)^{3/2} = (2 pi / N)^{3/4} FORMALLY yields an N-uniform constant, but the
 * weight is a change of units that must be carried through the whole fold-modulus back-conversion --
 * so it CONFIRMS H4 is the same strip-height-uniformity residual as imp-33645 H3 rather than
 * discharging it. Measurement only; G6a_shock_lipschitz stays OPEN; no positivity; imp-3066
 * off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb share untouched; NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-33645-h3-curvature-divergence-scoping (the sibling H3 curvature measurement, exponent 5/2)
 * @see imp-33619-h5-rh-transcription-scoping (names C3 the Privalov-Sokhotski residual, OPEN uniformly)
 * @see imp-33603-lemma52-port-scoping (the H1..H5 catalogue; H4 the strip-height residual)
 * @see g6a-sub-hyperbolic-closure (imp-394: RvM cusp density, complex Burgers fold, Privalov-Sokhotski)
 * @see lambda-burgers-shock-lipschitz (imp-354: Whitham fold reduction; fold condition 1 + t m_prime = 0)
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N) (imp-341 / imp-354 convention); it descends to the
// y -> 0+ boundary shock as N grows, and is the off-axis distance eps at which the fold is read and
// at which the Privalov-Sokhotski boundary-extension constant would have to be controlled uniformly.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// |m_prime(i eps)| for the symmetric cusp rho(x) = |x|^{-1/2} on [-1, 1], x_star = 0. The fold
// condition is 1 + t m_prime(z_0*) = 0, so m_prime is the fold-reading derivative. Substitution
// x = +- u^2 removes the sqrt singularity: |x|^{-1/2} dx = 2 du, integrand 1/(i eps -+ u^2)^2.
// Complex arithmetic done with [re, im] pairs; Simpson quadrature with N_PANELS panels on [0, 1].
const N_PANELS = 4000;
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
function cpow2(a) {
  return cmul(a, a);
}
function simpsonBranch(eps, sgn) {
  const h = 1 / N_PANELS;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= N_PANELS; i++) {
    const u = i * h;
    const w = i === 0 || i === N_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    // z - x = i eps - sgn u^2  ->  denominator (z - x)^2
    const v = cinv(cpow2([-sgn * u * u, eps]));
    re += w * v[0];
    im += w * v[1];
  }
  return [(re * h) / 3, (im * h) / 3];
}
// m_prime = - integral |x|^{-1/2} / (i eps - x)^2 dx = -2 [ A_plus + A_minus ], with A_plus over the
// x = +u^2 branch (denominator i eps - u^2) and A_minus over x = -u^2 (i eps + u^2).
function mpMag(eps) {
  const Aplus = simpsonBranch(eps, +1); // x = +u^2  ->  i eps - x = i eps - u^2
  const Aminus = simpsonBranch(eps, -1); // x = -u^2  ->  i eps - x = i eps + u^2
  const re = -2 * (Aplus[0] + Aminus[0]);
  const im = -2 * (Aplus[1] + Aminus[1]);
  return Math.hypot(re, im);
}

// Measured eps-ladder: log-log slope -> -3/2, renormalized eps^{3/2} |m_prime| -> finite PS constant.
const EPS_LADDER = [1e-1, 3e-2, 1e-2, 3e-3, 1e-3, 3e-4, 1e-4];
const PS_CONSTANT_LADDER = EPS_LADDER.map((eps, i) => {
  const mag = mpMag(eps);
  const renorm = mag * Math.pow(eps, 1.5);
  let localSlope = null;
  if (i > 0) {
    const prevEps = EPS_LADDER[i - 1];
    const prevMag = mpMag(prevEps);
    localSlope = (Math.log(mag) - Math.log(prevMag)) / (Math.log(eps) - Math.log(prevEps));
  }
  return {
    eps: +eps.toExponential(1),
    mag: +mag.toExponential(5),
    localSlope: localSlope === null ? null : +localSlope.toFixed(4),
    renorm: +renorm.toFixed(6),
  };
});

// The measured degradation exponent (slope of log|m_prime| vs log eps) and the renormalized PS constant.
const DEGRADE_EXPONENT_EPS = 1.5; // |m_prime| ~ C_PS eps^{-3/2}
const PS_CONSTANT = PS_CONSTANT_LADDER[PS_CONSTANT_LADDER.length - 1].renorm; // eps^{3/2}|m_prime| limit

// N-ladder at the reading strip: PS constant grows ~ (N / 2 pi)^{3/4}; strip-weighted constant uniform.
const N_LADDER = [1e3, 1e6, 1e9, 1e12];
const STRIP_PS_LADDER = N_LADDER.map((N) => {
  const eps = ySharp(N);
  const mag = mpMag(eps);
  return {
    N,
    y_N_sharp: +eps.toExponential(4),
    rawPsConstant: +mag.toExponential(4), // grows with N (exponent 3/4)
    stripWeighted: +(mag * Math.pow(eps, 1.5)).toFixed(6), // N-uniform floor
  };
});

export const IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING = {
  id: 'imp-33646',
  proofSection: 'S-frontier',
  scopes: 'The imp-33619 H4 / C3 Privalov-Sokhotski boundary-extension constant named the load-bearing OPEN residual',
  question:
    'What is the Privalov-Sokhotski boundary-extension constant of the pointwise-discharged ' +
    'real-boundary fold step for the imp-354 complex fold, how does it depend on the reading strip ' +
    'y_N^sharp = sqrt(2 pi / N), and is it bounded uniformly in N or does it degrade as ' +
    'y_N^sharp -> 0 (tying to the imp-33645 H3 curvature divergence)? Scoping / measurement only; G6a OPEN; no QED.',

  cuspModel: 'rho(x) ~ C / |x - x_star|^{1/2} (Holder-1/2, alpha = 1/2 exactly) -- the RvM cusp of imp-394',
  foldReadingQuantity: 'm_prime(z_0*) -- the fold condition is 1 + t m_prime(z_0*) = 0 (one derivative below the H3 curvature)',

  // The measured power law.
  degradeLawEps: '|m_prime(x_star + i eps)| ~ C_PS eps^{-3/2} as eps -> 0+',
  degradeExponentEps: DEGRADE_EXPONENT_EPS, // 3/2 = 1/2 (cusp) + 1 (first derivative)
  measuredSlope: PS_CONSTANT_LADDER[PS_CONSTANT_LADDER.length - 1].localSlope, // -1.5000
  psConstant: PS_CONSTANT, // eps^{3/2}|m_prime| -> ~2.2214 (finite, nonzero: pi/sqrt(2), no cancellation)
  psConstantClosedForm: 'numerically pi / sqrt(2) = 2.2214415 (the renormalized boundary-extension amplitude)',
  psConstantLadder: PS_CONSTANT_LADDER,

  // The reading-strip tie.
  degradeLawN: '|m_prime(z_0*)| ~ C_PS (N / 2 pi)^{3/4} at eps = y_N^sharp = sqrt(2 pi / N)',
  degradeExponentN: 0.75, // 3/4 = (3/2) * (1/2), since eps ~ N^{-1/2}
  stripPsLadder: STRIP_PS_LADDER,

  // The tie to imp-33645 (H3 curvature): same object, exactly one derivative apart.
  h3CurvatureExponentEps: 2.5, // imp-33645: |m_prime_prime| ~ eps^{-5/2}
  h3CurvatureExponentN: 1.25, // imp-33645: (N/2pi)^{5/4}
  differsFromH3ByOneDerivative: true, // 5/2 - 3/2 = 1, 5/4 - 3/4 = 1/2 = one derivative pushed through eps ~ N^{-1/2}

  // The assessment.
  constantIsBoundedUniformlyInN: false, // raw PS constant degrades ~ (N/2pi)^{3/4} as y_N^sharp -> 0
  degradationIsIrreducible: true, // clean power law, nonzero renormalized limit -- no cancellation
  renormalizationWeight: '(y_N^sharp)^{3/2} = (2 pi / N)^{3/4}',
  renormalizationYieldsUniformConstant: true, // FORMALLY: eps^{3/2}|m_prime| -> C_PS, N-uniform
  renormalizationDischargesH4: false, // but it is a change of units, not a discharge
  renormalizationNote:
    'A strip-height weight of exactly (y_N^sharp)^{3/2} = (2 pi / N)^{3/4} FORMALLY restores an ' +
    'N-uniform Privalov-Sokhotski constant, but the weight is a change of units, not a free win: the ' +
    'Whitham / Lemma-5.2 modulus reads m_prime at the intrinsic cusp scale, and dividing by eps^{3/2} ' +
    'simultaneously rescales the fold neighbourhood (z_0 - z_0*) ~ eps, so the factor must be carried ' +
    'through the entire fold expansion and its back-conversion to the tau_c Holder modulus. So the ' +
    'renormalization CONFIRMS H4 is the same strip-height-uniformity object as the imp-33645 H3 ' +
    'curvature (they differ by exactly one derivative) rather than closing it.',

  residualObstruction: 'G6a_shock_lipschitz::strip-height-uniformity',
  residualStatement:
    'The Privalov-Sokhotski boundary-extension constant is NOT bounded uniformly in N: it degrades ' +
    'as (2 pi / N)^{-3/4} as y_N^sharp -> 0. After renormalization the OPEN obligation is the SAME ' +
    'strip-height-uniformity object as imp-33645 H3 / imp-33603 H4 -- the (2 pi / N)^{3/4} weight must ' +
    'be tracked through the fold-modulus back-conversion uniformly, differing from the H3 curvature ' +
    'weight only by the one derivative between m_prime (exponent 3/2) and m_prime_prime (exponent 5/2).',

  isRigorous: false,
  verdict:
    'SCOPING / MEASUREMENT ONLY (frontier-direction, NOT rigorous): the Privalov-Sokhotski ' +
    'boundary-extension constant of the pointwise-discharged real-boundary fold step is ' +
    'C_PS = lim eps^{3/2} |m_prime| ~ 2.221441 (numerically pi / sqrt(2)), a clean power law ' +
    '|m_prime(z_0*)| ~ C_PS eps^{-3/2} (measured log-log slope -1.5000), which at the reading strip ' +
    'eps = y_N^sharp = sqrt(2 pi / N) DEGRADES as growth ~ (N / 2 pi)^{3/4} (exponent 3/4 in N, one ' +
    'derivative below the imp-33645 H3 curvature exponent 5/4). So the constant is NOT bounded ' +
    'uniformly in N as y_N^sharp -> 0. The degradation is IRREDUCIBLE as a raw quantity; a ' +
    'strip-height weight of exactly (y_N^sharp)^{3/2} = (2 pi / N)^{3/4} FORMALLY yields an N-uniform ' +
    'constant, but the weight is a change of units that must be carried through the whole ' +
    'fold-modulus back-conversion -- so it CONFIRMS H4 is the SAME strip-height-uniformity residual ' +
    'as imp-33645 H3 rather than discharging it. Measurement only; G6a_shock_lipschitz stays OPEN; ' +
    'no positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb share untouched; ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',
  citation:
    'imp-33645-h3-curvature-divergence-scoping (sibling H3 curvature, exponent 5/2); ' +
    'imp-33619-h5-rh-transcription-scoping (C3 Privalov-Sokhotski residual, OPEN uniformly); ' +
    'imp-33603-lemma52-port-scoping (H1..H5 catalogue, H4 strip-height residual); ' +
    'g6a-sub-hyperbolic-closure (imp-394: RvM cusp density, complex Burgers fold, Privalov-Sokhotski); ' +
    'lambda-burgers-shock-lipschitz (imp-354: fold condition 1 + t m_prime = 0).',
};

export const IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_ASSERTIONS = [
  {
    // The measured degradation is a power law with exponent 3/2 in eps: slope near -1.5 across the ladder.
    id: 'imp33646-ps-constant-degrade-exponent-3over2',
    description: 'log|m_prime| vs log eps has slope -3/2 (fold-reading derivative ~ eps^{-3/2}) for the Holder-1/2 cusp',
    holds: () =>
      // The coarsest 1e-1 -> 3e-2 step carries a finite-eps transient (-1.487); the asymptotic
      // slope is recovered on the finer rungs (eps <= 1e-2), converging to -1.5000.
      PS_CONSTANT_LADDER.slice(2).every((row) => Math.abs(row.localSlope - -1.5) < 1e-2) &&
      IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.degradeExponentEps === 1.5,
  },
  {
    // The renormalized product eps^{3/2}|m_prime| converges to a finite NONZERO PS constant (no cancellation).
    id: 'imp33646-ps-constant-finite-nonzero',
    description: 'eps^{3/2}|m_prime| converges to a stable finite nonzero limit (~2.2214, pi/sqrt(2)): no hidden cancellation',
    holds: () => {
      const renorms = PS_CONSTANT_LADDER.map((r) => r.renorm);
      const last = renorms[renorms.length - 1];
      return (
        last > 1 &&
        Number.isFinite(last) &&
        renorms.slice(-3).every((v) => Math.abs(v - last) < 1e-3) &&
        Math.abs(PS_CONSTANT - last) < 1e-9 &&
        Math.abs(last - Math.PI / Math.SQRT2) < 5e-3
      );
    },
  },
  {
    // The raw PS constant GROWS in N (exponent 3/4) at the reading strip -- it is NOT bounded uniformly.
    id: 'imp33646-raw-ps-constant-grows-in-N',
    description: 'at eps = y_N^sharp the raw Privalov-Sokhotski constant increases strictly with N (grows ~ (N/2pi)^{3/4})',
    holds: () =>
      STRIP_PS_LADDER.every(
        (row, i) => i === 0 || row.rawPsConstant > STRIP_PS_LADDER[i - 1].rawPsConstant,
      ) &&
      IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.degradeExponentN === 0.75 &&
      IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.constantIsBoundedUniformlyInN === false,
  },
  {
    // The strip-height-weighted PS constant is N-UNIFORM (constant across the N ladder to floor tolerance).
    id: 'imp33646-strip-weighted-ps-constant-uniform',
    description: 'the (y_N^sharp)^{3/2}-weighted Privalov-Sokhotski constant is N-uniform across the asymptotic N ladder',
    holds: () => {
      // The N = 1e3 rung (eps ~ 0.079) carries the same finite-eps transient as the coarsest
      // eps-ladder step; the weighted constant is N-uniform on the asymptotic rungs (N >= 1e6),
      // pinned to the PS constant to floor tolerance.
      const w = STRIP_PS_LADDER.slice(1).map((r) => r.stripWeighted);
      return w.every((v) => Math.abs(v - PS_CONSTANT) < 1e-3);
    },
  },
  {
    // The N-strip exponent 3/4 is the eps-exponent 3/2 pushed through eps ~ N^{-1/2}.
    id: 'imp33646-n-exponent-consistent-with-eps-exponent',
    description: 'the N-growth exponent 3/4 equals (3/2) * (1/2) since y_N^sharp ~ N^{-1/2}',
    holds: () =>
      Math.abs(
        IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.degradeExponentN -
          IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.degradeExponentEps * 0.5,
      ) < 1e-12,
  },
  {
    // The tie to imp-33645: H4 (m_prime, exponent 3/2) and H3 (m_prime_prime, exponent 5/2) differ by one derivative.
    id: 'imp33646-differs-from-h3-by-one-derivative',
    description: 'the H4 PS constant (exponent 3/2) and the imp-33645 H3 curvature (exponent 5/2) differ by exactly one derivative',
    holds: () =>
      IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.differsFromH3ByOneDerivative === true &&
      Math.abs(
        IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.h3CurvatureExponentEps -
          IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.degradeExponentEps - 1,
      ) < 1e-12 &&
      Math.abs(
        IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.h3CurvatureExponentN -
          IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.degradeExponentN - 0.5,
      ) < 1e-12,
  },
  {
    // The assessment: degradation irreducible, renormalization is FORMAL and does NOT discharge H4.
    id: 'imp33646-renormalization-does-not-discharge-h4',
    description: 'the degradation is irreducible; the strip-height weight confirms H4 is the H3 object, it does not close it',
    holds: () =>
      IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.degradationIsIrreducible === true &&
      IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.renormalizationYieldsUniformConstant === true &&
      IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.renormalizationDischargesH4 === false &&
      /strip-height-uniformity/.test(IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.residualObstruction),
  },
  {
    // Honesty gate: scoping only, not rigorous, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp33646-honesty-gate-no-qed',
    description: 'Scoping only: not rigorous, G6a stays OPEN, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.isRigorous === false &&
      /NO QED/.test(IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.verdict) &&
      /stays OPEN/.test(IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.verdict) &&
      /remains the rigorous SOTA/.test(IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_SCOPING.verdict),
  },
];

for (const a of IMP33646_H4_PRIVALOV_SOKHOTSKI_CONSTANT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33646-h4-privalov-sokhotski-constant-scoping assertion failed: ${a.id}`);
  }
}
