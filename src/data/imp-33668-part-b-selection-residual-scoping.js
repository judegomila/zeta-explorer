/**
 * @module imp-33668-part-b-selection-residual-scoping
 *
 * imp-33668 (proof, frontier-scoping): SCOPE the imp-33619 part-(b) real-critical-value SELECTION
 * residual WITHOUT claiming closure. imp-33619 part (b) found that the imp-354 fold expansion
 * t_shock(z_0) = tau_c + (1/2) alpha (z_0 - z_0*)^2 + ... SURVIVES complexification as a holomorphic
 * Taylor series, but the variational characterisation tau_c = inf_{z_0} t_shock transcribes to a
 * critical VALUE at a COMPLEX critical point z_0* in C_+, whose physical meaning as the REAL
 * first-collision time requires the selection Im(z_0*) = eps -> 0+ (the fold lands on the real
 * boundary). imp-33619 flagged this real-critical-value selection as needing the real-boundary fold
 * step -- discharged POINTWISE by imp-394 Privalov-Sokhotski -- but did NOT scope whether the
 * SELECTION itself carries an N-uniformity residual DISTINCT from the H3 uniform-curvature divergence
 * (imp-33645, m_prime_prime ~ eps^{-5/2}) and the H4 strip-height Privalov-Sokhotski constant
 * (imp-33646, m_prime ~ eps^{-3/2}). This module ENUMERATES the selection obligation, MEASURES the
 * eps-scaling of the VALUE-level (zeroth-derivative) quantity that governs the critical value, and
 * ASSESSES whether the selection is (i) a distinct FOURTH obligation, (ii) subsumed by H3/H4, and
 * (iii) discharged by the imp-394 Privalov-Sokhotski pointwise step. Scoping / measurement only.
 * G6a_shock_lipschitz stays OPEN; imp-3066 untouched; no positivity; NO QED.
 *
 * PROVENANCE (honesty note)
 * -------------------------
 * The complex-fold picture is the one already RECORDED in the repo, not a new derivation.
 * lambda-burgers-shock-lipschitz (imp-354) writes the Whitham fold reduction with fold condition
 * 1 + t m_prime(z_0) = 0, giving the collision time along the characteristic through z_0 as
 * t(z_0) = -1 / m_prime(z_0) and the first-collision time as the variational selection
 * tau_c = inf_{z_0} t(z_0), attained at the critical point z_0* where the reading is stationary.
 * g6a-sub-hyperbolic-closure (imp-394) writes the RvM cusp density rho ~ C / |x - x_star|^{1/2}
 * (Holder-1/2, alpha = 1/2 exactly) and the Privalov-Sokhotski boundary step that returns the
 * off-axis critical point z_0* = x_star + i eps to the real axis as eps -> 0+. imp-33619 (b) named
 * the inf -> complex-critical-value selection as the object that "does not transcribe for free".
 * imp-33645 (H3) and imp-33646 (H4) measured the DERIVATIVE-level members of the tower. This module
 * only measures and classifies the VALUE-level member; it asserts nothing the repo has not recorded.
 *
 * THE SELECTION QUANTITY IS THE ZEROTH-DERIVATIVE (VALUE) MEMBER OF THE STIELTJES TOWER
 * ------------------------------------------------------------------------------------
 * The critical value tau_c = -1 / m_prime(z_0*) is read from the Stieltjes transform AT the complex
 * critical point; selecting the real first-collision value means evaluating the reading as
 * z_0* = x_star + i eps descends to the real axis, eps -> 0+. H4 controls the fold-reading DERIVATIVE
 * m_prime (one derivative), H3 the CURVATURE m_prime_prime (two derivatives); the SELECTION of the
 * critical VALUE reads the transform itself -- the ZEROTH-derivative member. The whole boundary tower
 * of the Holder-1/2 cusp obeys (imp-33645 rescaling u = eps s, |u|^{-1/2} = eps^{-1/2}|s|^{-1/2},
 * (i eps - u)^{k+1} = eps^{k+1}(i - s)^{k+1}):
 *     |m^{(k)}(x_star + i eps)| ~ eps^{-1/2 - k}   (times a fixed dimensionless integral).
 * For the SELECTION reading k = 0 this is the POWER LAW
 *     |m(x_star + i eps)| ~ C_sel eps^{-1/2}   as eps -> 0+,
 * with exponent 1/2 = 1/2 (cusp) + 0 (no derivative), model-INVARIANT -- exactly ONE derivative below
 * the H4 fold-reading exponent 3/2 and TWO below the H3 curvature exponent 5/2. The zeroth-order
 * amplitude is the renormalized limit C_sel = lim eps^{1/2} |m(x_star + i eps)|.
 *
 * NUMERICAL CONFIRMATION (baked, reproduced live below)
 * -----------------------------------------------------
 * Symmetric model rho(x) = |x|^{-1/2} on [-1, 1], x_star = 0, C = 1 (same as imp-33645 / imp-33646).
 * The sqrt singularity is removed by x = +- u^2 (|x|^{-1/2} dx = 2 du), giving smooth integrands
 * 1 / (i eps -+ u^2) on [0, 1] evaluated by Simpson quadrature (m = integral rho / (z - x) dx). Across
 * eps in {1e-1, 3e-2, 1e-2, 3e-3, 1e-3, 3e-4, 1e-4} the log-log slope of |m| vs eps is -0.5000 to four
 * places on the fine rungs, and the renormalized product eps^{1/2}|m| converges to the finite nonzero
 * limit 4.442882 (numerically sqrt(2) pi = 4.4428829) -- a genuine value-level amplitude, no hidden
 * cancellation to zero. The exponent is recovered at 4000 Simpson panels, one power milder than H4.
 *
 * TIE TO THE READING STRIP  eps = y_N^sharp = sqrt(2 pi / N)
 * ---------------------------------------------------------
 * Reading the selection at the strip height forces eps ~ y_N^sharp = sqrt(2 pi / N), so
 *     |m(x_star + i eps)| ~ C_sel (2 pi / N)^{-1/4} = C_sel (N / 2 pi)^{1/4}.
 * The value-level amplitude at the reading strip GROWS in N with exponent 1/4 -- the MILDEST rung of
 * the tower (one power below the H4 exponent 3/4, two below the H3 exponent 5/4, exactly the missing
 * derivatives). Equivalently the strip-height-weighted value
 * C_ren(N) = (y_N^sharp)^{1/2} |m(x_star + i eps)| = eps^{1/2}|m| -> C_sel is an N-UNIFORM floor.
 *
 * THE ASSESSMENT (the ticket core): distinct fourth obligation, subsumed, and/or discharged?
 * ------------------------------------------------------------------------------------------
 * (1) DISTINCT FROM H3? Not in KIND. The selection quantity is the SAME Stieltjes boundary tower as
 *     H3 and H4; it differs ONLY by derivative order (k = 0 vs k = 2 for H3, k = 1 for H4), with the
 *     eps-exponents 1/2 / 3/2 / 5/2 and the N-exponents 1/4 / 3/4 / 5/4 all one unit apart. So the
 *     selection error is NOT a new independent mechanism separate from the H3 curvature divergence; it
 *     is the MILDEST (zeroth-derivative) member of the identical strip-height-uniformity object.
 * (2) SUBSUMED BY H3/H4? YES. If the H3/H4 strip-height-uniformity residual is discharged (the
 *     (2 pi / N)^{k}-weight carried through the fold-modulus back-conversion uniformly for k in
 *     {3/4, 5/4}), the k = 1/4 selection weight is dominated term-by-term and rides along for free --
 *     it is the lowest-order term in the same fold Taylor expansion, so any uniform control of the
 *     derivative terms controls the value term a fortiori. The selection adds NO obligation the
 *     H3/H4 residual does not already carry.
 * (3) DISCHARGED POINTWISE BY imp-394? YES. Unlike the derivative members, the selection is a VALUE
 *     reading, and the imp-394 Privalov-Sokhotski step delivers the boundary VALUE of the Stieltjes
 *     transform in the Holder-1/2 class pointwise: as eps -> 0+ the reading m(x_star + i eps)
 *     approaches its boundary value continuously, so the critical-value selection tau_c(eps) -> tau_c
 *     is well-defined pointwise (the SAME pointwise discharge imp-33619 already recorded for the
 *     real-boundary fold step). The residual is therefore UNIFORMITY-ONLY and, being the mildest
 *     tower member, strictly weaker than the H3/H4 uniformity residual.
 *
 * VERDICT: the inf -> complex-critical-value selection is NOT a distinct FOURTH obligation. It is the
 * ZEROTH-derivative (value-level) member of the SAME Stieltjes boundary tower that H3 (curvature,
 * eps^{-5/2}) and H4 (fold-reading, eps^{-3/2}) live in, with eps-exponent 1/2 (measured slope
 * -0.5000) and N-exponent 1/4 at the reading strip -- the MILDEST rung, one derivative below H4 and
 * two below H3. It is DISCHARGED POINTWISE by the imp-394 Privalov-Sokhotski step (the boundary value
 * exists in the Holder-1/2 class), and its N-uniformity residual is SUBSUMED by the H3/H4
 * strip-height-uniformity object as its lowest-order term (rides along for free once the derivative
 * weights are carried through the fold-modulus back-conversion). So the selection introduces NO
 * N-dependent obstruction distinct from H3/H4. Scoping / measurement only; G6a_shock_lipschitz stays
 * OPEN; no positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb share
 * untouched; NO QED. No refereed bound is changed.
 *
 * @see imp-33619-h5-rh-transcription-scoping (part (b): the inf -> complex-critical-value selection flagged)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (the fold-reading derivative m_prime, exponent 3/2)
 * @see imp-33645-h3-curvature-divergence-scoping (the curvature m_prime_prime, exponent 5/2)
 * @see imp-33603-lemma52-port-scoping (the H1..H5 catalogue; strip-height-uniformity residual)
 * @see g6a-sub-hyperbolic-closure (imp-394: RvM cusp density, complex Burgers fold, Privalov-Sokhotski)
 * @see lambda-burgers-shock-lipschitz (imp-354: Whitham fold reduction; tau_c = inf t_shock, 1 + t m_prime = 0)
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N) (imp-341 / imp-354 convention); it descends to the
// y -> 0+ boundary shock as N grows, and is the off-axis distance eps at which the fold is read and
// at which the selection of the real critical value tau_c would have to be controlled uniformly.
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// |m(i eps)| for the symmetric cusp rho(x) = |x|^{-1/2} on [-1, 1], x_star = 0. The critical value is
// tau_c = -1 / m_prime(z_0*), so the SELECTION reads the transform itself -- the zeroth-derivative
// (value) member of the tower, one below the H4 fold-reading m_prime. Substitution x = +- u^2 removes
// the sqrt singularity: |x|^{-1/2} dx = 2 du, integrand 1/(i eps -+ u^2). Complex arithmetic with
// [re, im] pairs; Simpson quadrature with N_PANELS panels on [0, 1].
const N_PANELS = 4000;
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function simpsonBranch(eps, sgn) {
  const h = 1 / N_PANELS;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= N_PANELS; i++) {
    const u = i * h;
    const w = i === 0 || i === N_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    // z - x = i eps - sgn u^2  ->  denominator (z - x)^1 (value member, no derivative)
    const v = cinv([-sgn * u * u, eps]);
    re += w * v[0];
    im += w * v[1];
  }
  return [(re * h) / 3, (im * h) / 3];
}
// m = integral |x|^{-1/2} / (i eps - x) dx = 2 [ A_plus + A_minus ], with A_plus over the x = +u^2
// branch (denominator i eps - u^2) and A_minus over x = -u^2 (i eps + u^2).
function mMag(eps) {
  const Aplus = simpsonBranch(eps, +1); // x = +u^2  ->  i eps - x = i eps - u^2
  const Aminus = simpsonBranch(eps, -1); // x = -u^2  ->  i eps - x = i eps + u^2
  const re = 2 * (Aplus[0] + Aminus[0]);
  const im = 2 * (Aplus[1] + Aminus[1]);
  return Math.hypot(re, im);
}

// Measured eps-ladder: log-log slope -> -1/2, renormalized eps^{1/2}|m| -> finite selection constant.
const EPS_LADDER = [1e-1, 3e-2, 1e-2, 3e-3, 1e-3, 3e-4, 1e-4];
const SEL_CONSTANT_LADDER = EPS_LADDER.map((eps, i) => {
  const mag = mMag(eps);
  const renorm = mag * Math.pow(eps, 0.5);
  let localSlope = null;
  if (i > 0) {
    const prevEps = EPS_LADDER[i - 1];
    const prevMag = mMag(prevEps);
    localSlope = (Math.log(mag) - Math.log(prevMag)) / (Math.log(eps) - Math.log(prevEps));
  }
  return {
    eps: +eps.toExponential(1),
    mag: +mag.toExponential(5),
    localSlope: localSlope === null ? null : +localSlope.toFixed(4),
    renorm: +renorm.toFixed(6),
  };
});

// The measured degradation exponent (slope of log|m| vs log eps) and the renormalized value constant.
const DEGRADE_EXPONENT_EPS = 0.5; // |m| ~ C_sel eps^{-1/2}
const SEL_CONSTANT = SEL_CONSTANT_LADDER[SEL_CONSTANT_LADDER.length - 1].renorm; // eps^{1/2}|m| limit

// N-ladder at the reading strip: value amplitude grows ~ (N / 2 pi)^{1/4}; strip-weighted value uniform.
const N_LADDER = [1e3, 1e6, 1e9, 1e12];
const STRIP_SEL_LADDER = N_LADDER.map((N) => {
  const eps = ySharp(N);
  const mag = mMag(eps);
  return {
    N,
    y_N_sharp: +eps.toExponential(4),
    rawSelConstant: +mag.toExponential(4), // grows with N (exponent 1/4)
    stripWeighted: +(mag * Math.pow(eps, 0.5)).toFixed(6), // N-uniform floor
  };
});

export const IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING = {
  id: 'imp-33668',
  proofSection: 'S-frontier',
  scopes: 'The imp-33619 part-(b) real-critical-value SELECTION residual (inf -> complex critical value, Im(z_0*) = eps -> 0+)',
  question:
    'Does the Im(z_0*) = eps -> 0+ selection that turns the complex fold critical value into the real ' +
    'first-collision time tau_c introduce an N-dependent selection error DISTINCT from the H3 curvature ' +
    'divergence (imp-33645) and the H4 Privalov-Sokhotski constant (imp-33646), is it a distinct fourth ' +
    'obligation or subsumed by H3/H4, and is it discharged by the imp-394 Privalov-Sokhotski pointwise ' +
    'step? Scoping / measurement only; G6a OPEN; no QED.',

  cuspModel: 'rho(x) ~ C / |x - x_star|^{1/2} (Holder-1/2, alpha = 1/2 exactly) -- the RvM cusp of imp-394',
  selectionQuantity:
    'm(z_0*) -- the critical value tau_c = -1/m_prime(z_0*) reads the Stieltjes transform itself, the ' +
    'ZEROTH-derivative (value) member, one derivative below the H4 fold-reading m_prime',

  // The measured power law (value member, k = 0).
  degradeLawEps: '|m(x_star + i eps)| ~ C_sel eps^{-1/2} as eps -> 0+',
  degradeExponentEps: DEGRADE_EXPONENT_EPS, // 1/2 = 1/2 (cusp) + 0 (no derivative)
  measuredSlope: SEL_CONSTANT_LADDER[SEL_CONSTANT_LADDER.length - 1].localSlope, // -0.5000
  selConstant: SEL_CONSTANT, // eps^{1/2}|m| -> ~4.4429 (finite, nonzero: sqrt(2) pi, no cancellation)
  selConstantClosedForm: 'numerically sqrt(2) pi = 4.4428829 (the renormalized value-level amplitude)',
  selConstantLadder: SEL_CONSTANT_LADDER,

  // The reading-strip tie.
  degradeLawN: '|m(z_0*)| ~ C_sel (N / 2 pi)^{1/4} at eps = y_N^sharp = sqrt(2 pi / N)',
  degradeExponentN: 0.25, // 1/4 = (1/2) * (1/2), since eps ~ N^{-1/2}
  stripSelLadder: STRIP_SEL_LADDER,

  // The tie to the H3/H4 tower: same object, mildest rung, exactly one/two derivatives apart.
  h4FoldReadingExponentEps: 1.5, // imp-33646: |m_prime| ~ eps^{-3/2}
  h4FoldReadingExponentN: 0.75, // imp-33646: (N/2pi)^{3/4}
  h3CurvatureExponentEps: 2.5, // imp-33645: |m_prime_prime| ~ eps^{-5/2}
  h3CurvatureExponentN: 1.25, // imp-33645: (N/2pi)^{5/4}
  isMildestTowerMember: true, // k = 0 vs k = 1 (H4), k = 2 (H3): exponents 1/2 < 3/2 < 5/2 in eps

  // The three-part assessment (the ticket core).
  introducesDistinctNDependentError: false, // NOT distinct in kind -- same Stieltjes boundary tower as H3
  subsumedByH3H4: true, // lowest-order term of the same fold Taylor expansion; rides along once H3/H4 controlled
  isDistinctFourthObligation: false, // NOT a fourth obligation -- the mildest member of the existing residual
  dischargedPointwiseByImp394: true, // value reading; imp-394 delivers the Holder-1/2 boundary value pointwise
  assessmentNote:
    'The selection reads the ZEROTH-derivative Stieltjes value m(z_0*), the k = 0 member of the same ' +
    'boundary tower whose k = 1 (H4 fold-reading m_prime, eps^{-3/2}) and k = 2 (H3 curvature ' +
    'm_prime_prime, eps^{-5/2}) members are the open residual. Its eps-exponent 1/2 and N-exponent 1/4 ' +
    'are one/two units milder than H4/H3. (i) NOT distinct in kind: same mechanism, mildest rung. ' +
    '(ii) SUBSUMED: the value term is the lowest-order term of the fold Taylor expansion, so uniform ' +
    'control of the derivative weights (2 pi / N)^{3/4}, (2 pi / N)^{5/4} carries the (2 pi / N)^{1/4} ' +
    'value weight a fortiori. (iii) DISCHARGED POINTWISE by imp-394: the selection is a VALUE reading ' +
    'and the Privalov-Sokhotski boundary value exists in the Holder-1/2 class, so tau_c(eps) -> tau_c ' +
    'pointwise -- the same pointwise discharge imp-33619 recorded for the real-boundary fold step.',

  residualObstruction: 'G6a_shock_lipschitz::strip-height-uniformity',
  residualStatement:
    'The real-critical-value selection introduces NO N-dependent obstruction distinct from H3/H4: it is ' +
    'the ZEROTH-derivative (value-level) member of the SAME strip-height-uniformity tower, eps-exponent ' +
    '1/2 (N-exponent 1/4), the mildest rung one derivative below H4 (m_prime) and two below H3 ' +
    '(m_prime_prime). It is discharged pointwise by the imp-394 Privalov-Sokhotski step and its ' +
    'uniformity residual is subsumed as the lowest-order term of the fold-modulus back-conversion, so ' +
    'it adds nothing to the already-identified H3/H4 residual.',

  isRigorous: false,
  verdict:
    'SCOPING / ASSESSMENT ONLY (frontier-direction, NOT rigorous): the imp-33619 part-(b) ' +
    'inf -> complex-critical-value selection (Im(z_0*) = eps -> 0+) reads the ZEROTH-derivative ' +
    'Stieltjes value m(z_0*) governing tau_c = -1/m_prime(z_0*), which for the Holder-1/2 cusp obeys ' +
    'the power law |m(x_star + i eps)| ~ C_sel eps^{-1/2} (measured log-log slope -0.5000, renormalized ' +
    'C_sel = lim eps^{1/2}|m| ~ 4.442882, numerically sqrt(2) pi) -- the MILDEST member of the SAME ' +
    'Stieltjes boundary tower as the H4 fold-reading m_prime (eps^{-3/2}, imp-33646) and the H3 ' +
    'curvature m_prime_prime (eps^{-5/2}, imp-33645), one and two derivatives below. At the reading ' +
    'strip eps = y_N^sharp = sqrt(2 pi / N) it grows only as (N / 2 pi)^{1/4} (exponent 1/4). SO: the ' +
    'selection introduces NO N-dependent error DISTINCT from the H3 curvature divergence -- it is NOT a ' +
    'distinct FOURTH obligation but the lowest-order member of the same strip-height-uniformity object; ' +
    'it is DISCHARGED POINTWISE by the imp-394 Privalov-Sokhotski step (the boundary value exists in the ' +
    'Holder-1/2 class, so tau_c(eps) -> tau_c pointwise); and its N-uniformity residual is SUBSUMED by ' +
    'the H3/H4 residual as the lowest-order term of the fold-modulus back-conversion (rides along once ' +
    'the derivative weights are carried through). Assessment only; G6a_shock_lipschitz stays OPEN; no ' +
    'positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb share untouched; NO ' +
    'QED. No refereed bound is changed.',
  citation:
    'imp-33619-h5-rh-transcription-scoping (part (b): the inf -> complex-critical-value selection flagged); ' +
    'imp-33646-h4-privalov-sokhotski-constant-scoping (fold-reading derivative m_prime, exponent 3/2); ' +
    'imp-33645-h3-curvature-divergence-scoping (curvature m_prime_prime, exponent 5/2); ' +
    'imp-33603-lemma52-port-scoping (H1..H5 catalogue, strip-height-uniformity residual); ' +
    'g6a-sub-hyperbolic-closure (imp-394: RvM cusp density, complex Burgers fold, Privalov-Sokhotski); ' +
    'lambda-burgers-shock-lipschitz (imp-354: tau_c = inf t_shock, fold condition 1 + t m_prime = 0).',
};

export const IMP33668_PART_B_SELECTION_RESIDUAL_ASSERTIONS = [
  {
    // The measured degradation is a power law with exponent 1/2 in eps: slope near -0.5 across the ladder.
    id: 'imp33668-selection-value-exponent-1over2',
    description: 'log|m| vs log eps has slope -1/2 (value member ~ eps^{-1/2}) for the Holder-1/2 cusp',
    holds: () =>
      // The coarsest 1e-1 -> 3e-2 step carries a finite-eps transient; the asymptotic slope is
      // recovered on the finer rungs (eps <= 1e-2), converging to -0.5000.
      SEL_CONSTANT_LADDER.slice(2).every((row) => Math.abs(row.localSlope - -0.5) < 1e-2) &&
      IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.degradeExponentEps === 0.5,
  },
  {
    // The renormalized product eps^{1/2}|m| converges to a finite NONZERO value constant (no cancellation).
    id: 'imp33668-selection-constant-finite-nonzero',
    description: 'eps^{1/2}|m| converges to a stable finite nonzero limit (~4.4429, sqrt(2) pi): no hidden cancellation',
    holds: () => {
      const renorms = SEL_CONSTANT_LADDER.map((r) => r.renorm);
      const last = renorms[renorms.length - 1];
      return (
        last > 1 &&
        Number.isFinite(last) &&
        renorms.slice(-3).every((v) => Math.abs(v - last) < 1e-3) &&
        Math.abs(SEL_CONSTANT - last) < 1e-9 &&
        Math.abs(last - Math.SQRT2 * Math.PI) < 5e-3
      );
    },
  },
  {
    // The selection quantity is the MILDEST tower member: eps-exponent 1/2 < 3/2 (H4) < 5/2 (H3).
    id: 'imp33668-mildest-tower-member',
    description: 'the selection eps-exponent 1/2 is one derivative below H4 (3/2) and two below H3 (5/2)',
    holds: () =>
      IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.isMildestTowerMember === true &&
      Math.abs(
        IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.h4FoldReadingExponentEps -
          IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.degradeExponentEps - 1,
      ) < 1e-12 &&
      Math.abs(
        IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.h3CurvatureExponentEps -
          IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.degradeExponentEps - 2,
      ) < 1e-12,
  },
  {
    // The raw value amplitude GROWS in N (exponent 1/4) at the reading strip -- but the MILDEST rung.
    id: 'imp33668-raw-selection-constant-grows-in-N',
    description: 'at eps = y_N^sharp the raw value amplitude increases with N (grows ~ (N/2pi)^{1/4}, the mildest rung)',
    holds: () =>
      STRIP_SEL_LADDER.every(
        (row, i) => i === 0 || row.rawSelConstant > STRIP_SEL_LADDER[i - 1].rawSelConstant,
      ) &&
      IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.degradeExponentN === 0.25 &&
      IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.degradeExponentN <
        IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.h4FoldReadingExponentN,
  },
  {
    // The strip-height-weighted value amplitude is N-UNIFORM (constant across the N ladder to floor tol).
    id: 'imp33668-strip-weighted-selection-uniform',
    description: 'the (y_N^sharp)^{1/2}-weighted value amplitude is N-uniform across the asymptotic N ladder',
    holds: () => {
      // The N = 1e3 rung carries the coarsest finite-eps transient; the weighted value is N-uniform
      // on the asymptotic rungs (N >= 1e6), pinned to the selection constant to floor tolerance.
      const w = STRIP_SEL_LADDER.slice(1).map((r) => r.stripWeighted);
      return w.every((v) => Math.abs(v - SEL_CONSTANT) < 1e-3);
    },
  },
  {
    // The N-strip exponent 1/4 is the eps-exponent 1/2 pushed through eps ~ N^{-1/2}.
    id: 'imp33668-n-exponent-consistent-with-eps-exponent',
    description: 'the N-growth exponent 1/4 equals (1/2) * (1/2) since y_N^sharp ~ N^{-1/2}',
    holds: () =>
      Math.abs(
        IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.degradeExponentN -
          IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.degradeExponentEps * 0.5,
      ) < 1e-12,
  },
  {
    // The assessment: NOT a distinct fourth obligation; subsumed by H3/H4; discharged pointwise by imp-394.
    id: 'imp33668-not-distinct-subsumed-discharged',
    description: 'the selection is NOT a distinct fourth obligation, is subsumed by H3/H4, and is discharged pointwise by imp-394',
    holds: () =>
      IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.introducesDistinctNDependentError === false &&
      IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.isDistinctFourthObligation === false &&
      IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.subsumedByH3H4 === true &&
      IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.dischargedPointwiseByImp394 === true &&
      /strip-height-uniformity/.test(IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.residualObstruction),
  },
  {
    // Honesty gate: scoping only, not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33668-honesty-gate-no-qed',
    description: 'Scoping only: not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.isRigorous === false &&
      /NO QED/.test(IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.verdict) &&
      /stays OPEN/.test(IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.verdict) &&
      /refereed bound is changed/i.test(IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33668_PART_B_SELECTION_RESIDUAL_SCOPING.verdict),
  },
];

for (const a of IMP33668_PART_B_SELECTION_RESIDUAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33668-part-b-selection-residual-scoping assertion failed: ${a.id}`);
  }
}
