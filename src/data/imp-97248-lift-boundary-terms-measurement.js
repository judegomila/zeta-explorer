/**
 * @module imp-97248-lift-boundary-terms-measurement
 * @fileoverview imp-97248 -- MEASUREMENT (numerical) of the imp-97182 STEP-2 lift boundary terms at
 *   2a = ln3. imp-97182 STEP 2 reduces sigma_2-coercivity to w_1-coercivity on lifted data h = A g,
 *   A = (-D^2 + 1/4), via the exact Fourier identity
 *       <T_a[sigma_2] g, g> = (1/2pi) int (t^2+1/4)^2 w_1 |ghat|^2 dt
 *                           = (1/2pi) int w_1 |hhat|^2 dt
 *                           = <T[w_1] h_int, h_int> + (boundary terms),
 *   "up to boundary terms" -- the distributional jumps of g, g' at +-a produced by the local
 *   differential lift. This leaf SIZES those boundary terms for representative band-limited g.
 *
 * FOURIER BOOKKEEPING (integration by parts twice, exact). For g zero-extended off [-a,a],
 *       (t^2+1/4) ghat(t) = hhat_int(t) + B(t),
 *       hhat_int(t) = FT of the CLASSICAL interior lift (-g'' + g/4) restricted to (-a,a),
 *       B(t) = g prime(a) e^{-ita} - g prime(-a) e^{ita} + g(a)(it)e^{-ita} - g(-a)(it)e^{ita}.
 *   For EVEN g this is the real symbol  B(t) = 2 g prime(a) cos(ta) + 2 t g(a) sin(ta).
 *   The boundary contribution to the sigma_2 quadratic form is then Boundary = LHS - Interior with
 *       LHS(T)      = (1/pi) int_0^T w_1 (t^2+1/4)^2 |ghat|^2 dt   (= <T_a[sigma_2] g,g>),
 *       Interior(T) = (1/pi) int_0^T w_1 |hhat_int|^2 dt           (= <T[w_1] h_int, h_int>).
 *   w_1(t) = Re psi(1/4 + i t/2) - ln pi - sqrt(2) ln2 cos(t ln2).
 *
 * DRIVER: tmp/imp-97248-lift-boundary-terms.py (/tmp/rhvenv, numpy 2.5.3 + scipy 1.18.1; ghat by
 *   adaptive x-quadrature, T-ladder by cumulative trapezoid on a 16001-pt grid to T=800). Every literal
 *   below is verbatim from that run. The integration-by-parts identity was cross-checked against the
 *   closed forms ghat3 = 2 sin(ta)/t and hhat_int3 = sin(ta)/(2t) to machine precision (see CROSSCHECK).
 *
 * THE MEASURED RESULT (three representative g at 2a = ln3, a = ln3/2 = 0.5493061443340549):
 *   1. FORM-DOMAIN DATA -> BOUNDARY IS IDENTICALLY ZERO. For g = (a^2 - x^2)^2 (both g and g prime
 *      vanish at +-a) the boundary symbol B(t) == 0 at every grid t (max|B| = 0.0), so Boundary = 0 to
 *      machine precision (<= 2.1e-16 relative) at every T, and the FULL sigma_2 form is carried by the
 *      interior w_1-form (LHS = Interior = 0.7349 at T=800, both convergent). The STEP-2 reduction is
 *      EXACT -- not merely negligible -- on the natural form domain.
 *   2. NON-FORM-DOMAIN DATA (g prime jump, delta boundary): g = a^2 - x^2 has g(+-a)=0 but
 *      g prime(+-a) = -/+2a, so B(t) = -4a cos(ta), max|B| = 2.1972. Here Boundary is nonzero BUT the
 *      sigma_2 form LHS itself DIVERGES with the cutoff (44.6 -> 2367 as T: 50 -> 800), growing together
 *      with Boundary while the interior w_1-form stays finite (Interior -> -9.88). Ratio Boundary/LHS -> 1.
 *   3. NON-FORM-DOMAIN DATA (g jump, delta prime boundary): g = 1 (indicator) has g(+-a)=1, so
 *      B(t) = 2 t sin(ta), max|B| = 1595.6. LHS diverges as a power (5.19e4 -> 4.91e8 over the same
 *      ladder) while Interior -> -0.1466; Boundary/LHS = 1.000 throughout.
 *
 * INTERPRETATION (measurement only; NO positivity, NO bound moves). The boundary terms are NOT a small
 * unsized residual that could hide part of the coercivity margin: they are EXACTLY ZERO on the sigma_2
 * form domain (test data with g, g prime -> 0 at +-a), and they are nonzero ONLY for data OUTSIDE that
 * form domain -- precisely the data for which <T_a[sigma_2] g,g> itself is divergent (|ghat|^2 decays too
 * slowly against sigma_2 ~ t^4 ln t). For such inadmissible data the interior w_1-form remains finite and
 * the entire divergence is the boundary piece, so "does the boundary carry margin?" is vacuous there. Net:
 * on all admissible test data the imp-97182 STEP-2 reduction <T_a[sigma_2] g,g> = <T[w_1] h_int, h_int>
 * holds with ZERO boundary defect, which SHARPENS the imp-97182 "mod boundary terms" caveat to "exact",
 * and confirms STEP 3 -- the whole margin question is genuinely the first-order w_1 (sigma_1) object with
 * no boundary escape hatch. Establishes no positivity; pins no margin; interval-rigorous reach stays
 * 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97182-krein-fejer-riesz-margin-factorisation-attempt.js (STEP 2 lift; the "mod boundary terms" caveat sized here)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (w_1, sigma_1, sigma_2 symbols; reach 2a <= 0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098
export const IMP97248_A = LN3 / 2; // 0.5493061443340549 -- half-width at the binding 2a = ln3

// Cross-check of the integration-by-parts identity (t^2+1/4)ghat = hhat_int + B against closed forms.
export const IMP97248_CROSSCHECK = Object.freeze({
  t: 3.7,
  ghat3_quad: 0.4839593611976116,
  ghat3_analytic: 0.4839593611976117, // 2 sin(ta)/t
  ghat3_absdiff: 5.551115123125783e-17,
  hint3_from_identity: 0.1209898402994023, // (t^2+1/4)ghat - B
  hint3_analytic: 0.12098984029940292, // sin(ta)/(2t)
  hint3_absdiff: 6.245004513516506e-16,
});

// Verbatim from tmp/imp-97248-lift-boundary-terms.py. LHS = <T_a[sigma_2]g,g>, Interior = <T[w_1]h_int,h_int>,
// Boundary = LHS - Interior, all as (1/pi) int_0^T ... dt on the 16001-pt grid.
export const IMP97248_BOUNDARY_MEASUREMENT = Object.freeze({
  binding2a: LN3,
  a: LN3 / 2,
  w1AtZero: -6.352441562694213,
  cases: Object.freeze([
    Object.freeze({
      g: '(a^2 - x^2)^2',
      class: 'form-domain (g and g prime vanish at +-a)',
      maxAbsB: 0.0, // boundary symbol identically zero
      ladder: Object.freeze([
        { T: 50, LHS: 5.387728e-1, Interior: 5.387728e-1, Boundary: -1.110223e-16, ratio: -2.061e-16 },
        { T: 100, LHS: 6.222208e-1, Interior: 6.222208e-1, Boundary: 0.0, ratio: 0.0 },
        { T: 200, LHS: 6.792176e-1, Interior: 6.792176e-1, Boundary: 0.0, ratio: 0.0 },
        { T: 400, LHS: 7.142048e-1, Interior: 7.142048e-1, Boundary: 0.0, ratio: 0.0 },
        { T: 800, LHS: 7.349094e-1, Interior: 7.349094e-1, Boundary: 0.0, ratio: 0.0 },
      ]),
      note: 'LHS = Interior to machine precision at every T; sigma_2 form convergent; boundary carries ZERO margin.',
    }),
    Object.freeze({
      g: 'a^2 - x^2',
      class: 'non-form-domain (g prime jump; delta boundary), B(t) = -4a cos(ta)',
      maxAbsB: 2.197224574021297,
      ladder: Object.freeze([
        { T: 50, LHS: 4.463113e1, Interior: -1.001653e1, Boundary: 5.464767e1, ratio: 1.224 },
        { T: 100, LHS: 1.413948e2, Interior: -9.959365, Boundary: 1.513541e2, ratio: 1.070 },
        { T: 200, LHS: 3.836915e2, Interior: -9.920223, Boundary: 3.936117e2, ratio: 1.026 },
        { T: 400, LHS: 9.741795e2, Interior: -9.896214, Boundary: 9.840757e2, ratio: 1.010 },
        { T: 800, LHS: 2.367677e3, Interior: -9.882002, Boundary: 2.377559e3, ratio: 1.004 },
      ]),
      note: 'sigma_2 form LHS DIVERGES with the cutoff (out of form domain); Interior finite (-> -9.88); Boundary/LHS -> 1.',
    }),
    Object.freeze({
      g: '1 (indicator)',
      class: 'non-form-domain (g jump; delta prime boundary), B(t) = 2 t sin(ta)',
      maxAbsB: 1595.5901815806726,
      ladder: Object.freeze([
        { T: 50, LHS: 5.190484e4, Interior: -1.486784e-1, Boundary: 5.190499e4, ratio: 1.0 },
        { T: 100, LHS: 5.150111e5, Interior: -1.477853e-1, Boundary: 5.150112e5, ratio: 1.0 },
        { T: 200, LHS: 5.293703e6, Interior: -1.471737e-1, Boundary: 5.293704e6, ratio: 1.0 },
        { T: 400, LHS: 5.181882e7, Interior: -1.467986e-1, Boundary: 5.181882e7, ratio: 1.0 },
        { T: 800, LHS: 4.907666e8, Interior: -1.465766e-1, Boundary: 4.907666e8, ratio: 1.0 },
      ]),
      note: 'sigma_2 form LHS DIVERGES as a power (out of form domain); Interior finite (-> -0.1466); Boundary/LHS = 1.',
    }),
  ]),
});

export const IMP97248_VERDICT = Object.freeze({
  ticket: 'imp-97248',
  question:
    'how large is the imp-97182 STEP-2 lift boundary-term contribution to <T_a[sigma_2]g,g> = <T[w_1]h,h> + boundary at 2a = ln3, and does it carry part of the coercivity margin?',
  answer:
    'The boundary terms are IDENTICALLY ZERO on the sigma_2 form domain. For test data with g and g prime vanishing at +-a (e.g. g=(a^2-x^2)^2) the boundary symbol B(t)=2 g prime(a)cos(ta)+2 t g(a)sin(ta) is exactly 0, so <T_a[sigma_2]g,g> = <T[w_1]h_int,h_int> holds with zero boundary defect (measured Boundary/LHS <= 2e-16 at every cutoff). Boundary terms are nonzero ONLY for data outside the form domain (g or g prime nonzero at +-a), and for exactly that data the sigma_2 quadratic form itself DIVERGES with the cutoff (measured LHS grows 44.6->2367 for the g prime-jump parabola, 5.19e4->4.91e8 for the indicator, over T=50->800) while the interior w_1-form stays finite -- so the boundary is the entire divergent part and the margin question is vacuous there. The imp-97182 STEP-2 reduction is therefore EXACT (not merely negligible) on all admissible test data, sharpening the "mod boundary terms" caveat and confirming STEP 3: the whole margin sits in the first-order w_1 (sigma_1) object with no boundary escape hatch.',
  boundaryZeroOnFormDomain: true,
  boundaryNonzeroImpliesFormDivergent: true,
  reductionExactOnAdmissibleData: true,
  carriesMargin: false,
  establishesPositivity: false, // measurement only
  boundMoved: false,
  rigorousReach2a: 0.96,
  ptLambdaSOTA: 0.2,
  rhOpen: true,
  noQED: true,
});
