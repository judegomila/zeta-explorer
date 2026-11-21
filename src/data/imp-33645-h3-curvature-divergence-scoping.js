/**
 * @module imp-33645-h3-curvature-divergence-scoping
 *
 * imp-33645 (proof, frontier-scoping): SCOPE and QUANTIFY the imp-33619 H3 complex-curvature
 * divergence -- WITHOUT claiming closure. imp-33619 marked H3 (uniform fold curvature) as
 * NEW ARGUMENT REQUIRED / OPEN: the Whitham / Lemma-5.2 modulus needs the second derivative of
 * the Stieltjes transform at the fold critical point, |m_prime_prime(z_0*)|, bounded BELOW
 * uniformly in N, but complexification makes it WORSE -- as the critical point z_0* approaches
 * the real axis the second derivative of the Stieltjes transform of the RvM cusp density
 * DIVERGES, so a uniform curvature floor is not available on its face. This module MEASURES the
 * blow-up rate, ties the off-axis distance eps = Im(z_0*) to the reading strip
 * y_N^sharp = sqrt(2 pi / N), and ASSESSES whether a strip-height-weighted (renormalized)
 * curvature yields an N-uniform floor or whether the divergence is irreducible. Scoping /
 * measurement only. G6a_shock_lipschitz stays OPEN; imp-3066 untouched; no positivity; NO QED.
 *
 * PROVENANCE (honesty note)
 * -------------------------
 * The RvM cusp density model is the one already RECORDED in the repo: g6a-sub-hyperbolic-closure.js
 * (imp-394) writes the cusp density rho ~ C / |x - x_star|^{1/2} (Holder-1/2, alpha = 1/2 exactly),
 * the complex Burgers characteristics dz/dt = m(z,t), and the fold condition
 * 1 + t m_prime(z_0*) = 0 with the critical point moving off the real axis into C_+
 * (z_0* = x_star + i eps, eps -> 0+ as t -> t_c). imp-33619 names H3 the uniform-curvature
 * obligation and records that the second derivative DIVERGES as z_0* -> R. This module only
 * QUANTIFIES that divergence; it asserts nothing discharged the repo has not already recorded.
 *
 * THE CUSP CURVATURE INTEGRAL
 * ---------------------------
 * For the Holder-1/2 cusp density rho(x) ~ C |x - x_star|^{-1/2}, the Stieltjes transform and its
 * derivatives at z_0 = x_star + i eps are
 *     m(z)          = integral rho(x) / (z - x) dx
 *     m_prime(z)    = - integral rho(x) / (z - x)^2 dx
 *     m_prime_prime = 2 integral rho(x) / (z - x)^3 dx.
 * Near the cusp put u = x - x_star and rescale u = eps s. Then |u|^{-1/2} = eps^{-1/2} |s|^{-1/2},
 * (i eps - u)^3 = eps^3 (i - s)^3, du = eps ds, so the k-th derivative scales as
 *     m^{(k)}(x_star + i eps) ~ eps^{-1/2 - k}   (times a fixed dimensionless integral),
 * because the -1/2 density exponent plus one power per derivative controls the local scale. For the
 * curvature k = 2 this is the POWER LAW  |m_prime_prime(z_0*)| ~ K eps^{-5/2}  as eps -> 0+.
 * The exponent 5/2 = 1/2 (cusp) + 2 (second derivative) is model-INVARIANT (constant K is not).
 *
 * NUMERICAL CONFIRMATION (baked, reproduced live below)
 * -----------------------------------------------------
 * Symmetric model rho(x) = |x|^{-1/2} on [-1, 1], x_star = 0, C = 1. The sqrt singularity is
 * removed by the substitution x = +- u^2 (|x|^{-1/2} dx = 2 du), giving smooth integrands
 * 1 / (i eps +- u^2)^3 on [0, 1] evaluated by Simpson quadrature. Across
 * eps in {1e-1, 3e-2, 1e-2, 3e-3, 1e-3, 3e-4, 1e-4} the log-log slope of |m_prime_prime| vs eps is
 * -2.5000 to four places, and the renormalized product eps^{5/2} |m_prime_prime| converges to the
 * finite nonzero limit 3.332162 -- a genuine floor, no hidden cancellation to zero. The exponent is
 * recovered at grid resolution as coarse as 2000 Simpson panels (used here at 4000 for margin).
 *
 * TIE TO THE READING STRIP  eps = y_N^sharp = sqrt(2 pi / N)
 * ---------------------------------------------------------
 * Reading the fold at the strip height forces eps ~ y_N^sharp = sqrt(2 pi / N), so
 *     |m_prime_prime(z_0*)| ~ K (2 pi / N)^{-5/4} = K (N / 2 pi)^{5/4}.
 * The raw curvature GROWS in N with exponent 5/4 (it is a floor going to +infinity, not a floor
 * going to 0 -- H3 fails because the curvature is not UNIFORM, not because it vanishes). Equivalently
 * the strip-height-weighted curvature  C_ren(N) = (y_N^sharp)^{5/2} |m_prime_prime(z_0*)|  is
 * eps^{5/2} |m_prime_prime| -> K, an N-UNIFORM finite floor.
 *
 * THE ASSESSMENT (the ticket core): does the renormalization discharge H3 ?
 * ------------------------------------------------------------------------
 * The divergence is IRREDUCIBLE as a raw quantity -- it is a clean power law with exponent exactly
 * 5/2 and a nonzero renormalized limit, so there is no cancellation that would make the unweighted
 * curvature uniform. A strip-height weight of exactly (y_N^sharp)^{5/2} = (2 pi / N)^{5/4}
 * FORMALLY restores an N-uniform floor. BUT this does NOT discharge H3: the weight is a change of
 * units, not a free win. The Whitham / Lemma-5.2 modulus needs the curvature LOWER bound at the
 * intrinsic scale of the cusp, and dividing by eps^{5/2} rescales the cusp WIDTH (the fold
 * neighbourhood (z_0 - z_0*) ~ eps) at the same time, so the eps^{5/2} factor must be tracked
 * through the entire fold expansion t_shock = tau_c + (1/2) alpha (z_0 - z_0*)^2 + ... and its
 * back-conversion to the tau_c Holder modulus -- exactly the strip-height book-keeping that is the
 * imp-33603 H4 / imp-33619 uniform-Privalov-Sokhotski residual. So the renormalization RELOCATES
 * H3 into the SAME strip-height-uniformity object as H4; it does not close it.
 *
 * VERDICT: SCOPING / MEASUREMENT ONLY, G6a STAYS OPEN. The imp-33619 H3 curvature divergence is a
 * clean power law |m_prime_prime(z_0*)| ~ K eps^{-5/2} (measured slope -2.5000, renormalized limit
 * 3.332162), which at the reading strip eps = sqrt(2 pi / N) becomes growth ~ (N / 2 pi)^{5/4}
 * (exponent 5/4 in N). The divergence is IRREDUCIBLE as a raw quantity; a strip-height weight of
 * exactly (y_N^sharp)^{5/2} = (2 pi / N)^{5/4} FORMALLY yields an N-uniform curvature floor, but the
 * weight is a change of units that must be carried through the whole fold-modulus back-conversion --
 * so it RELOCATES H3 into the imp-33603 H4 / imp-33619 uniform-Privalov-Sokhotski strip-height
 * residual rather than discharging it. Measurement only; G6a_shock_lipschitz stays OPEN; no
 * positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb share untouched;
 * NO QED. No refereed bound is changed.
 *
 * @see imp-33619-h5-rh-transcription-scoping (names H3 the uniform-curvature obligation, OPEN)
 * @see imp-33603-lemma52-port-scoping (the H1..H5 catalogue; H4 the strip-height residual)
 * @see g6a-sub-hyperbolic-closure (imp-394: RvM cusp density, complex Burgers fold, Privalov-Sokhotski)
 * @see lambda-burgers-shock-lipschitz (imp-354: Whitham fold reduction; fold expansion)
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N) (imp-341 / imp-354 convention); it descends to the
// y -> 0+ boundary shock as N grows, and is the off-axis distance eps at which the fold is read.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// |m_prime_prime(i eps)| for the symmetric cusp rho(x) = |x|^{-1/2} on [-1, 1], x_star = 0.
// Substitution x = +- u^2 removes the sqrt singularity: |x|^{-1/2} dx = 2 du, integrand 1/(i eps +- u^2)^3.
// Complex arithmetic done with [re, im] pairs; Simpson quadrature with N_PANELS panels on [0, 1].
const N_PANELS = 4000;
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
function cpow3(a) {
  return cmul(cmul(a, a), a);
}
function simpsonBranch(eps, sgn) {
  const h = 1 / N_PANELS;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= N_PANELS; i++) {
    const u = i * h;
    const w = i === 0 || i === N_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const v = cinv(cpow3([sgn * u * u, eps]));
    re += w * v[0];
    im += w * v[1];
  }
  return [(re * h) / 3, (im * h) / 3];
}
// m_prime_prime = 2 * integral |x|^{-1/2} / (i eps - x)^3 dx = 2 * [ 2 A_minus + 2 A_plus ], with
// A_minus over the x = -u^2 branch (denominator i eps + u^2) and A_plus over x = +u^2 (i eps - u^2).
function mppMag(eps) {
  const Aminus = simpsonBranch(eps, +1); // x = -u^2  ->  i eps - x = i eps + u^2
  const Aplus = simpsonBranch(eps, -1); // x = +u^2  ->  i eps - x = i eps - u^2
  const re = 4 * (Aminus[0] + Aplus[0]);
  const im = 4 * (Aminus[1] + Aplus[1]);
  return Math.hypot(re, im);
}

// Measured eps-ladder: log-log slope -> -5/2, renormalized eps^{5/2} |m_prime_prime| -> finite floor.
const EPS_LADDER = [1e-1, 3e-2, 1e-2, 3e-3, 1e-3, 3e-4, 1e-4];
const CURVATURE_LADDER = EPS_LADDER.map((eps, i) => {
  const mag = mppMag(eps);
  const renorm = mag * Math.pow(eps, 2.5);
  let localSlope = null;
  if (i > 0) {
    const prevEps = EPS_LADDER[i - 1];
    const prevMag = mppMag(prevEps);
    localSlope = (Math.log(mag) - Math.log(prevMag)) / (Math.log(eps) - Math.log(prevEps));
  }
  return {
    eps: +eps.toExponential(1),
    mag: +mag.toExponential(5),
    localSlope: localSlope === null ? null : +localSlope.toFixed(4),
    renorm: +renorm.toFixed(6),
  };
});

// The measured blow-up exponent (slope of log|m_prime_prime| vs log eps) and the renormalized floor.
const BLOWUP_EXPONENT_EPS = 2.5; // |m_prime_prime| ~ K eps^{-5/2}
const RENORM_FLOOR = CURVATURE_LADDER[CURVATURE_LADDER.length - 1].renorm; // eps^{5/2}|m_prime_prime| limit

// N-ladder at the reading strip: raw curvature grows ~ (N / 2 pi)^{5/4}; strip-weighted curvature uniform.
const N_LADDER = [1e3, 1e6, 1e9, 1e12];
const STRIP_CURVATURE_LADDER = N_LADDER.map((N) => {
  const eps = ySharp(N);
  const mag = mppMag(eps);
  return {
    N,
    y_N_sharp: +eps.toExponential(4),
    rawCurvature: +mag.toExponential(4), // grows with N (exponent 5/4)
    stripWeighted: +(mag * Math.pow(eps, 2.5)).toFixed(6), // N-uniform floor
  };
});

export const IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING = {
  id: 'imp-33645',
  proofSection: 'S-frontier',
  scopes: 'The imp-33619 H3 complex-curvature divergence named OPEN (new argument required)',
  question:
    'At what rate does |m_prime_prime(z_0*)| blow up as the fold critical point z_0* approaches the ' +
    'real axis for the RvM Holder-1/2 cusp density, how does that translate to the reading strip ' +
    'y_N^sharp = sqrt(2 pi / N), and does a strip-height-weighted (renormalized) curvature yield an ' +
    'N-uniform floor or is the divergence irreducible? Scoping / measurement only; G6a OPEN; no QED.',

  cuspModel: 'rho(x) ~ C / |x - x_star|^{1/2} (Holder-1/2, alpha = 1/2 exactly) -- the RvM cusp of imp-394',

  // The measured power law.
  blowupLawEps: '|m_prime_prime(x_star + i eps)| ~ K eps^{-5/2} as eps -> 0+',
  blowupExponentEps: BLOWUP_EXPONENT_EPS, // 5/2 = 1/2 (cusp) + 2 (second derivative)
  measuredSlope: CURVATURE_LADDER[CURVATURE_LADDER.length - 1].localSlope, // -2.5000
  renormFloor: RENORM_FLOOR, // eps^{5/2}|m_prime_prime| -> ~3.3322 (finite, nonzero: no cancellation)
  curvatureLadder: CURVATURE_LADDER,

  // The reading-strip tie.
  blowupLawN: '|m_prime_prime(z_0*)| ~ K (N / 2 pi)^{5/4} at eps = y_N^sharp = sqrt(2 pi / N)',
  blowupExponentN: 1.25, // 5/4 = (5/2) * (1/2), since eps ~ N^{-1/2}
  stripCurvatureLadder: STRIP_CURVATURE_LADDER,

  // The assessment.
  divergenceIsIrreducible: true, // clean power law, nonzero renormalized limit -- no cancellation
  renormalizationWeight: '(y_N^sharp)^{5/2} = (2 pi / N)^{5/4}',
  renormalizationYieldsUniformFloor: true, // FORMALLY: eps^{5/2}|m_prime_prime| -> K, N-uniform
  renormalizationDischargesH3: false, // but it is a change of units, not a discharge
  renormalizationNote:
    'A strip-height weight of exactly (y_N^sharp)^{5/2} = (2 pi / N)^{5/4} FORMALLY restores an ' +
    'N-uniform curvature floor, but the weight is a change of units, not a free win: the Whitham / ' +
    'Lemma-5.2 modulus needs the curvature lower bound at the intrinsic cusp scale, and dividing by ' +
    'eps^{5/2} simultaneously rescales the fold neighbourhood (z_0 - z_0*) ~ eps, so the factor must ' +
    'be carried through the entire fold expansion and its back-conversion to the tau_c Holder ' +
    'modulus. So the renormalization RELOCATES H3 into the strip-height book-keeping rather than ' +
    'closing it.',

  residualObstruction: 'G6a_shock_lipschitz::strip-height-uniformity',
  residualStatement:
    'After renormalization the OPEN obligation is the SAME strip-height-uniformity object as ' +
    'imp-33603 H4 / imp-33619 uniform Privalov-Sokhotski: the eps^{5/2} = (2 pi / N)^{5/4} weight ' +
    'must be tracked through the fold-modulus back-conversion uniformly as y_N^sharp -> 0.',

  isRigorous: false,
  verdict:
    'SCOPING / MEASUREMENT ONLY (frontier-direction, NOT rigorous): the imp-33619 H3 curvature ' +
    'divergence is a clean power law |m_prime_prime(z_0*)| ~ K eps^{-5/2} (measured log-log slope ' +
    '-2.5000, renormalized limit eps^{5/2}|m_prime_prime| -> ~3.3322, finite and nonzero so no ' +
    'cancellation), which at the reading strip eps = y_N^sharp = sqrt(2 pi / N) becomes growth ' +
    '~ (N / 2 pi)^{5/4} (exponent 5/4 in N). The divergence is IRREDUCIBLE as a raw quantity; a ' +
    'strip-height weight of exactly (y_N^sharp)^{5/2} = (2 pi / N)^{5/4} FORMALLY yields an ' +
    'N-uniform curvature floor, but the weight is a change of units that must be carried through the ' +
    'whole fold-modulus back-conversion -- so it RELOCATES H3 into the imp-33603 H4 / imp-33619 ' +
    'uniform Privalov-Sokhotski strip-height residual rather than discharging it. Measurement only; ' +
    'G6a_shock_lipschitz stays OPEN; no positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 ' +
    'UNTOUCHED; C_mb share untouched; NO QED. No refereed bound is changed.',
  citation:
    'imp-33619-h5-rh-transcription-scoping (H3 uniform curvature OPEN); imp-33603-lemma52-port-scoping ' +
    '(H1..H5 catalogue, H4 strip-height residual); g6a-sub-hyperbolic-closure (imp-394: RvM cusp ' +
    'density, complex Burgers fold, Privalov-Sokhotski); lambda-burgers-shock-lipschitz (imp-354).',
};

export const IMP33645_H3_CURVATURE_DIVERGENCE_ASSERTIONS = [
  {
    // The measured blow-up is a power law with exponent 5/2 in eps: slope near -2.5 across the ladder.
    id: 'imp33645-curvature-blowup-exponent-5over2',
    description: 'log|m_prime_prime| vs log eps has slope -5/2 (curvature ~ eps^{-5/2}) for the Holder-1/2 cusp',
    holds: () =>
      CURVATURE_LADDER.slice(1).every((row) => Math.abs(row.localSlope - -2.5) < 1e-2) &&
      IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING.blowupExponentEps === 2.5,
  },
  {
    // The renormalized product eps^{5/2}|m_prime_prime| converges to a finite NONZERO floor (no cancellation).
    id: 'imp33645-renorm-floor-finite-nonzero',
    description: 'eps^{5/2}|m_prime_prime| converges to a stable finite nonzero limit (~3.3322): no hidden cancellation',
    holds: () => {
      const renorms = CURVATURE_LADDER.map((r) => r.renorm);
      const last = renorms[renorms.length - 1];
      return (
        last > 1 &&
        Number.isFinite(last) &&
        renorms.slice(-3).every((v) => Math.abs(v - last) < 1e-3) &&
        Math.abs(RENORM_FLOOR - last) < 1e-9
      );
    },
  },
  {
    // The raw curvature GROWS in N (exponent 5/4) at the reading strip -- it is not a vanishing floor.
    id: 'imp33645-raw-curvature-grows-in-N',
    description: 'at eps = y_N^sharp the raw curvature increases strictly with N (grows ~ (N/2pi)^{5/4})',
    holds: () =>
      STRIP_CURVATURE_LADDER.every(
        (row, i) => i === 0 || row.rawCurvature > STRIP_CURVATURE_LADDER[i - 1].rawCurvature,
      ) && IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING.blowupExponentN === 1.25,
  },
  {
    // The strip-height-weighted curvature is N-UNIFORM (constant across the N ladder to floor tolerance).
    id: 'imp33645-strip-weighted-curvature-uniform',
    description: 'the (y_N^sharp)^{5/2}-weighted curvature is N-uniform: constant across the N ladder',
    holds: () => {
      const w = STRIP_CURVATURE_LADDER.map((r) => r.stripWeighted);
      return w.every((v) => Math.abs(v - w[0]) < 1e-3) && Math.abs(w[0] - RENORM_FLOOR) < 1e-2;
    },
  },
  {
    // The N-strip exponent 5/4 is the eps-exponent 5/2 pushed through eps ~ N^{-1/2}.
    id: 'imp33645-n-exponent-consistent-with-eps-exponent',
    description: 'the N-growth exponent 5/4 equals (5/2) * (1/2) since y_N^sharp ~ N^{-1/2}',
    holds: () =>
      Math.abs(
        IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING.blowupExponentN -
          IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING.blowupExponentEps * 0.5,
      ) < 1e-12,
  },
  {
    // The assessment: divergence irreducible, renormalization is FORMAL and does NOT discharge H3.
    id: 'imp33645-renormalization-does-not-discharge-h3',
    description: 'the divergence is irreducible; the strip-height weight relocates H3 into H4, it does not close it',
    holds: () =>
      IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING.divergenceIsIrreducible === true &&
      IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING.renormalizationYieldsUniformFloor === true &&
      IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING.renormalizationDischargesH3 === false &&
      /strip-height-uniformity/.test(IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING.residualObstruction),
  },
  {
    // Honesty gate: scoping only, not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33645-honesty-gate-no-qed',
    description: 'Scoping only: not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING.isRigorous === false &&
      /NO QED/.test(IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING.verdict) &&
      /stays OPEN/.test(IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING.verdict) &&
      /refereed bound is changed/i.test(IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33645_H3_CURVATURE_DIVERGENCE_SCOPING.verdict),
  },
];

for (const a of IMP33645_H3_CURVATURE_DIVERGENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33645-h3-curvature-divergence-scoping assertion failed: ${a.id}`);
  }
}
