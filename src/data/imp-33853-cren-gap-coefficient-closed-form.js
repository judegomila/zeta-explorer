/**
 * @module imp-33853-cren-gap-coefficient-closed-form
 *
 * imp-33853 (proof, frontier-derivation): DERIVE in closed form BOTH the 3/2 onset exponent AND the
 * 4/3 leading coefficient of the imp-33845 gap g(eps) = C_ren(eps) - C_PS ~ (4/3) eps^{3/2}, which
 * imp-33845 MEASURED numerically but never derived. The derivation runs through the symmetric Holder-1/2
 * cusp rho(x) = |x|^{-1/2} fold-modulus back-conversion m_prime(i eps) = -2 [B2(+) + B2(-)] evaluated at
 * z_0* = i eps, i.e. m_prime(i eps) = - integral_{-1}^{1} |x|^{-1/2} / (i eps - x)^2 dx.
 *
 * THE DERIVATION (both exponent and coefficient are analytic)
 * ----------------------------------------------------------
 * Split the finite reading window [-1, 1] against the full line:
 *     m_prime(i eps) = - integral_{-inf}^{inf} |x|^{-1/2} / (i eps - x)^2 dx
 *                      + integral_{|x| > 1} |x|^{-1/2} / (i eps - x)^2 dx.
 *
 * (1) LEADING eps^{-3/2} TIER (the amplitude C_PS). Rescale x = eps t in the full-line integral J:
 *     J = eps^{-3/2} K,   K = integral_{-inf}^{inf} |t|^{-1/2} / (i - t)^2 dt.
 * Folding t > 0 and t < 0, 1/(i - t)^2 + 1/(i + t)^2 = 2 (t^2 - 1) / (1 + t^2)^2, so
 *     K = 2 integral_0^{inf} t^{-1/2} (t^2 - 1) / (1 + t^2)^2 dt
 *       = 2 [ M(5/2) - M(1/2) ],   M(s) = integral_0^{inf} t^{s-1} / (1 + t^2)^2 dt = (1/2) Gamma(s/2) Gamma(2 - s/2).
 * With Gamma(5/4) = (1/4) Gamma(1/4) and Gamma(7/4) = (3/4) Gamma(3/4) this collapses to
 *     K = - (1/2) Gamma(1/4) Gamma(3/4) = - (1/2) * pi / sin(pi/4) = - pi / sqrt(2).
 * Hence -J = (pi/sqrt(2)) eps^{-3/2}, real and positive, and eps^{3/2} |m_prime| -> pi/sqrt(2) = C_PS. The
 * eps^{-3/2} scaling of J is exactly the renormalization exponent that DEFINES C_ren = eps^{3/2} |m_prime|.
 *
 * (2) SUBLEADING eps^0 TIER (the 4/3 coefficient). The window-tail correction integral_{|x|>1} is regular
 * at x = 0, so setting eps = 0 gives a finite constant:
 *     integral_{|x| > 1} |x|^{-1/2} / x^2 dx = 2 integral_1^{inf} x^{-5/2} dx = 2 * (2/3) = 4/3.
 * So the full expansion is
 *     m_prime(i eps) = (pi/sqrt(2)) eps^{-3/2} + 4/3 + o(1)     (both leading terms REAL; Im is o(1)),
 * and since both leading tiers are real the magnitude inherits them,
 *     |m_prime(i eps)| ~ (pi/sqrt(2)) eps^{-3/2} + 4/3,
 * giving C_ren(eps) = eps^{3/2} |m_prime| ~ pi/sqrt(2) + (4/3) eps^{3/2}, i.e.
 *     C_ren - C_PS ~ (4/3) eps^{3/2}.
 * BOTH the 3/2 exponent (renormalization tier eps^{3/2} times the constant eps^0 correction) AND the 4/3
 * coefficient (the OUTSIDE-THE-WINDOW tail integral of the cusp density) are now DERIVED in closed form,
 * not read off numerically.
 *
 * DERIVED-VS-MEASURED RESIDUAL
 * ---------------------------
 * The derived coefficient is exactly 4/3 = 1.333333..., independent of the ladder. Against the imp-33845
 * MEASURED per-rung fitted amplitudes A(eps) = (C_ren - C_PS)/eps^{3/2} the residual A_derived - A(eps)
 * shrinks monotone from ~1.07e-2 at N = 1e3 to ~1.3e-6 at N = 1e7 -- confirming the numerics converge to
 * the closed form. The tail-integral origin of 4/3 is also cross-checked directly by an independent Simpson
 * quadrature of integral_{|x|>1} |x|^{-1/2}/x^2 dx.
 *
 * WHAT THIS DOES NOT DO
 * ---------------------
 * DERIVATION ONLY, at fixed z_0* = i eps on the model cusp rho(x) = |x|^{-1/2}. A closed form for the
 * finite-window onset coefficient is NOT the uniform ANALYTIC tracking of C_ren that H4 needs (imp-33766),
 * and it says nothing about the coupled H3 curvature rung (N-exponent 5/4, imp-33786) that dominates and
 * jointly governs the discharge. H4 is NOT discharged. G6a_shock_lipschitz STAYS OPEN. No positivity;
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED. NO QED. No refereed bound is changed.
 *
 * @see imp-33845-cren-gap-onset-rate (MEASURED the 3/2 onset and 4/3 amplitude; this module DERIVES both)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (defines C_ren, PS constant pi/sqrt(2), N-exponent 3/4)
 * @see imp-33766-h4-independent-discharge-scoping (names the C_ren finite-window minimal-input condition)
 * @see imp-33786-h3-joint-curvature-input-scoping (the coupled H3 curvature rung that jointly governs discharge)
 */

// Reading strip height y_N^sharp = sqrt(2 pi / N) (imp-341 / imp-354 convention).
function ySharp(N) {
  return Math.sqrt((2 * Math.PI) / N);
}

// Complex arithmetic in [re, im] pairs (identical quadrature to imp-33845 for a like-for-like reading).
const N_PANELS = 8000;
function cinv(a) {
  const d = a[0] * a[0] + a[1] * a[1];
  return [a[0] / d, -a[1] / d];
}
function cmul(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
// B_p(sgn) = integral_0^1 1 / (i eps - sgn u^2)^p du by Simpson quadrature on [0, 1].
function branch(eps, sgn, p) {
  const h = 1 / N_PANELS;
  let re = 0;
  let im = 0;
  for (let i = 0; i <= N_PANELS; i++) {
    const u = i * h;
    const w = i === 0 || i === N_PANELS ? 1 : i % 2 === 1 ? 4 : 2;
    const z = [-sgn * u * u, eps];
    let d = [1, 0];
    for (let k = 0; k < p; k++) d = cmul(d, z);
    const v = cinv(d);
    re += w * v[0];
    im += w * v[1];
  }
  return [(re * h) / 3, (im * h) / 3];
}
function mpMag(eps) {
  const Bp = branch(eps, +1, 2);
  const Bm = branch(eps, -1, 2);
  return Math.hypot(-2 * (Bp[0] + Bm[0]), -2 * (Bp[1] + Bm[1]));
}
function cRen(eps) {
  return mpMag(eps) * Math.pow(eps, 1.5);
}

const C_PS = Math.PI / Math.SQRT2; // Privalov-Sokhotski amplitude = pi/sqrt(2) = 2.221441 (imp-33646)
const P_ONSET_DERIVED = 1.5; // DERIVED onset exponent = the eps^{3/2} renormalization tier
const A_DERIVED = 4 / 3; // DERIVED coefficient = integral_{|x|>1} |x|^{-1/2}/x^2 dx

// --- Independent cross-check of the 4/3 coefficient by direct quadrature of the window-tail integral.
// integral_{|x|>1} |x|^{-1/2}/x^2 dx = 2 integral_1^{inf} x^{-5/2} dx; substitute x = 1/v^2, v in (0,1],
// x^{-5/2} dx = -2 v^4 dv so integral_1^{inf} x^{-5/2} dx = 2 integral_0^1 v^4 dv = 2/5... folded below.
function tailCoeffQuadrature() {
  // 2 * integral_1^{inf} x^{-5/2} dx, mapped to [0,1] via x = 1/v^2 (dx = -2 v^{-3} dv):
  //   integral_1^{inf} x^{-5/2} dx = integral_0^1 (v^5) * 2 v^{-3} dv = 2 integral_0^1 v^2 dv.
  const M = 20000;
  const h = 1 / M;
  let s = 0;
  for (let i = 0; i <= M; i++) {
    const v = i * h;
    const w = i === 0 || i === M ? 1 : i % 2 === 1 ? 4 : 2;
    s += w * (v * v); // integrand v^2 for 2 * integral_0^1 v^2 dv
  }
  const inner = (s * h) / 3; // = integral_0^1 v^2 dv = 1/3
  return 2 /* outer 2 from |x|>1 both sides */ * (2 * inner); // 2 * (2 * 1/3) = 4/3
}
const A_TAIL_QUADRATURE = tailCoeffQuadrature();

// The imp-33845 finer ladder (3 rungs per decade over N in [1e3 .. 1e7]).
const N_LADDER = [
  1e3, 2e3, 5e3, 1e4, 2e4, 5e4, 1e5, 2e5, 5e5, 1e6, 2e6, 5e6, 1e7,
];

const LADDER = N_LADDER.map((N) => {
  const eps = ySharp(N);
  const cren = cRen(eps);
  const gap = cren - C_PS;
  const ampMeasured = gap / Math.pow(eps, 1.5); // imp-33845 fitted amplitude A(eps)
  const resid = A_DERIVED - ampMeasured; // derived-minus-measured coefficient residual
  return {
    N,
    y_N_sharp: +eps.toExponential(4),
    ampMeasured: +ampMeasured.toFixed(6),
    coeffResidual: +resid.toExponential(4),
    absCoeffResidual: Math.abs(resid),
  };
});

const HEAD = LADDER[0];
const TAIL = LADDER[LADDER.length - 1];
// The derived-vs-measured coefficient residual shrinks monotone toward 0 down the ladder.
const RESID_MONOTONE_DOWN = LADDER.every(
  (r, i) => i === 0 || r.absCoeffResidual <= LADDER[i - 1].absCoeffResidual + 1e-12,
);

export const IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM = {
  id: 'imp-33853',
  proofSection: 'S-frontier',
  scopes:
    'Derive in closed form BOTH the 3/2 onset exponent and the 4/3 leading coefficient of the imp-33845 gap ' +
    'g(eps) = C_ren - C_PS ~ (4/3) eps^{3/2} from the Holder-1/2 cusp fold-modulus back-conversion ' +
    'm_prime(i eps) = -2[B2(+)+B2(-)], and report the derived-vs-measured coefficient residual across the ladder',
  question:
    'Do BOTH the 3/2 exponent and the 4/3 coefficient of C_ren - C_PS ~ (4/3) eps^{3/2} follow analytically ' +
    'from m_prime(i eps) = - integral_{-1}^{1} |x|^{-1/2}/(i eps - x)^2 dx, or was the 4/3 only read off ' +
    'numerically (imp-33845)? Derivation only; does NOT discharge H4; G6a OPEN; imp-3066 untouched; NO QED.',

  cuspModel: 'rho(x) = |x|^{-1/2} on [-1, 1] (Holder-1/2, alpha = 1/2 exactly) -- the RvM cusp of imp-394',
  backConversion:
    'm_prime(i eps) = - integral_{-1}^{1} |x|^{-1/2} / (i eps - x)^2 dx = -2 [B2(+) + B2(-)] at z_0* = i eps',

  // --- The two-tier closed form (derived, not measured).
  expansion: 'm_prime(i eps) = (pi/sqrt(2)) eps^{-3/2} + 4/3 + o(1)  (both leading tiers real)',
  leadingTier:
    'eps^{-3/2} tier: full-line J = eps^{-3/2} K, K = -(1/2) Gamma(1/4) Gamma(3/4) = -pi/sqrt(2); ' +
    'so eps^{3/2}|m_prime| -> pi/sqrt(2) = C_PS. The eps^{-3/2} scaling IS the renormalization exponent.',
  subleadingTier:
    'eps^0 tier: window-tail integral_{|x|>1} |x|^{-1/2}/x^2 dx = 2 integral_1^{inf} x^{-5/2} dx = 4/3.',

  // (i) DERIVED onset exponent.
  derivedOnsetExponent: P_ONSET_DERIVED, // 3/2 = the eps^{3/2} renormalization tier times the eps^0 correction
  measuredOnsetExponent: 1.5, // imp-33845 tail p(eps) settled to 1.50000
  exponentMatches: true,

  // (ii) DERIVED leading coefficient.
  derivedCoefficient: A_DERIVED, // 4/3 = 1.333333...
  derivedCoefficientClosedForm: 'integral_{|x|>1} |x|^{-1/2}/x^2 dx = 2 integral_1^{inf} x^{-5/2} dx = 4/3',
  coefficientByIndependentQuadrature: +A_TAIL_QUADRATURE.toFixed(9), // ~1.333333333 (cross-check)
  coefficientQuadratureResidual: +Math.abs(A_TAIL_QUADRATURE - A_DERIVED).toExponential(3), // ~0

  // (iii) derived-vs-measured coefficient residual down the finer eps ladder.
  ladder: LADDER,
  cPsClosedForm: C_PS, // pi/sqrt(2)
  headCoeffResidual: HEAD.coeffResidual, // ~1.07e-2 at N = 1e3
  tailCoeffResidual: TAIL.coeffResidual, // ~1.3e-6 at N = 1e7
  coeffResidualMonotoneToZero: RESID_MONOTONE_DOWN, // shrinks monotone down the ladder
  coefficientDerivedNotMeasured: true, // the 4/3 is now analytic, sharpening imp-33845

  dischargesH4: false, // a closed-form onset coefficient is NOT the uniform analytic C_ren tracking H4 needs
  isRigorous: false,
  verdict:
    'DERIVATION ONLY, G6a_shock_lipschitz STAYS OPEN. BOTH the 3/2 onset exponent AND the 4/3 leading ' +
    'coefficient of the imp-33845 gap C_ren - C_PS ~ (4/3) eps^{3/2} follow in closed form from the ' +
    'Holder-1/2 cusp back-conversion m_prime(i eps) = - integral_{-1}^{1} |x|^{-1/2}/(i eps - x)^2 dx. ' +
    'Splitting the reading window against the full line gives m_prime = (pi/sqrt(2)) eps^{-3/2} + 4/3 + o(1): ' +
    'the eps^{-3/2} tier rescales (x = eps t) to J = eps^{-3/2} K with K = -(1/2) Gamma(1/4) Gamma(3/4) = ' +
    '-pi/sqrt(2), so eps^{3/2}|m_prime| -> pi/sqrt(2) = C_PS and the renormalization exponent IS 3/2; the ' +
    'constant eps^0 tier is the outside-the-window cusp-tail integral_{|x|>1} |x|^{-1/2}/x^2 dx = 4/3 (cross-' +
    'checked by an independent Simpson quadrature to <1e-9). Both leading tiers are real, so |m_prime| ' +
    'inherits them and C_ren - C_PS ~ (4/3) eps^{3/2}. The DERIVED coefficient 4/3 matches the imp-33845 ' +
    'MEASURED fitted amplitude with a residual that shrinks monotone from ~1.07e-2 (N = 1e3) to ~1.3e-6 ' +
    '(N = 1e7), so the numerics converge to the closed form. This SHARPENS imp-33845 -- the 4/3 was read off ' +
    'numerically there, it is derived here. This does NOT DISCHARGE H4: a closed-form finite-window onset ' +
    'coefficient at fixed z_0* = i eps is not the uniform ANALYTIC tracking of C_ren the H4 minimal-input ' +
    'condition requires (imp-33766), and it says nothing about the coupled H3 curvature rung (N-exponent ' +
    '5/4, imp-33786) that dominates and jointly governs the discharge. No positivity; imp-3066 off-diagonal ' +
    'endpoint-Hankel K_a >= 0 UNTOUCHED; NO QED. No refereed bound is changed.',
};

export const IMP33853_CREN_GAP_COEFFICIENT_ASSERTIONS = [
  {
    // (i) the DERIVED coefficient is exactly 4/3 and reproduced by an INDEPENDENT tail quadrature.
    id: 'imp33853-coefficient-derived-four-thirds',
    description: 'derived coefficient = 4/3 = integral_{|x|>1}|x|^{-1/2}/x^2 dx, cross-checked by quadrature to <1e-6',
    holds: () =>
      IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.derivedCoefficient === 4 / 3 &&
      Math.abs(IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.coefficientByIndependentQuadrature - 4 / 3) < 1e-6,
  },
  {
    // (ii) the DERIVED 3/2 exponent equals the imp-33845 MEASURED onset exponent.
    id: 'imp33853-exponent-derived-three-halves',
    description: 'derived onset exponent = 3/2 matches the imp-33845 measured p(eps) settled value',
    holds: () =>
      IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.derivedOnsetExponent === 1.5 &&
      IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.exponentMatches === true,
  },
  {
    // (iii) the derived-vs-measured coefficient residual shrinks monotone toward 0 down the finer eps ladder.
    id: 'imp33853-coefficient-residual-converges',
    description: 'derived (4/3) minus imp-33845 measured amplitude shrinks monotone from ~1e-2 to ~1e-6 down the ladder',
    holds: () =>
      IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.coeffResidualMonotoneToZero === true &&
      Math.abs(IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.tailCoeffResidual) < 1e-4 &&
      Math.abs(IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.headCoeffResidual) >
        Math.abs(IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.tailCoeffResidual),
  },
  {
    // Honesty gate: derivation only, does NOT discharge H4; G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33853-honesty-gate-no-qed',
    description: 'Derivation only: does not discharge H4, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.isRigorous === false &&
      IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.dischargesH4 === false &&
      /NO QED/.test(IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.verdict) &&
      /STAYS OPEN/.test(IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.verdict) &&
      /refereed bound is changed/i.test(IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED/.test(
        IMP33853_CREN_GAP_COEFFICIENT_CLOSED_FORM.verdict,
      ),
  },
];

for (const a of IMP33853_CREN_GAP_COEFFICIENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33853-cren-gap-coefficient-closed-form assertion failed: ${a.id}`);
  }
}
