/**
 * @module imp-97518-krein-tail-endpoint-asymptotic-closed-form
 * @fileoverview imp-97518 -- DERIVE IN CLOSED FORM the imp-97497 endpoint-asymptotic tail profile and its
 *   amplitude constant, which imp-97497 validated only numerically (ratio 0.9969 -> 0.9999 at t ~ 203..1004).
 *   Derivation only: measurement stays measurement; no operator positivity; no coercivity constant; no bound
 *   moves. This module supplies the analytic proof that the confinement far profile is
 *       psi_R(t) ~ -(1/pi) g''(a) sin(a t) / t^3,        g''(a) = (8/a^2) exp(-(R a)^2 / 2),
 *   and quantifies the endpoint-asymptotic bias (the next-order 1/t^4 term) that dominates the < 1e-3 error
 *   bar imp-97497 attached to its ~0.3 analytic tail.
 *
 * SETUP. At 2a = ln 3 the confinement family (imp-97483) is defined on the band |xi| <= a, a = (ln3)/2, by
 *       g(xi) = (1 - (xi/a)^2)^2 exp(-(R xi)^2 / 2),     psi_R(t) = (1/pi) int_0^a g(xi) cos(xi t) dxi
 *   (even, real; the code in imp-97497 computes exactly this one-sided cosine sum divided by pi). The taper
 *   (1 - (xi/a)^2)^2 vanishes to SECOND order at the band edge xi = a, which is the whole reason the far
 *   profile decays as fast as 1/t^3 rather than the generic 1/t of a hard edge.
 *
 * THE DERIVATION (three integrations by parts of the finite cosine transform). Write I(t) = int_0^a g cos(xi t).
 *   IBP #1:  I(t) = [g sin(xi t)/t]_0^a - (1/t) int_0^a g'(xi) sin(xi t) dxi.
 *            Boundary vanishes: g(a) = 0 (taper zero of order 2) and sin(0) = 0. So I(t) = -(1/t) int g' sin.
 *   IBP #2:  int_0^a g' sin(xi t) = [-g' cos(xi t)/t]_0^a + (1/t) int_0^a g'' cos(xi t) dxi.
 *            Boundary vanishes: g'(a) = 0 (order-2 zero) and g'(0) = 0 (g even). So
 *            I(t) = -(1/t^2) int_0^a g''(xi) cos(xi t) dxi.
 *   IBP #3:  int_0^a g'' cos(xi t) = [g'' sin(xi t)/t]_0^a - (1/t) int_0^a g''' sin(xi t) dxi
 *                                  = g''(a) sin(a t)/t - (1/t) int_0^a g''' sin.
 *            Now the edge term SURVIVES because g''(a) != 0. Hence
 *            I(t) = -g''(a) sin(a t)/t^3 + (1/t^3) int_0^a g'''(xi) sin(xi t) dxi.
 *   The residual integral is O(1/t) (one more IBP: its edge term is -g'''(a) cos(a t)/t), so the LEADING term is
 *       psi_R(t) = (1/pi) I(t) ~ -(1/pi) g''(a) sin(a t) / t^3,     as claimed by imp-97497.  [QED, leading order]
 *
 * THE AMPLITUDE CONSTANT (closed form). With u = 1 - (xi/a)^2 (so u' = -2 xi/a^2, u'' = -2/a^2, u''' = 0) and
 *   E = exp(-(R xi)^2/2), g = u^2 E gives g'' = 2 (u')^2 E + 2 u u'' E + 4 u u' E' + u^2 E''. At xi = a the
 *   factor u = 0 kills every term except the first, and u'(a) = -2/a, so
 *       g''(a) = 2 (u'(a))^2 E(a) = 2 (4/a^2) exp(-(R a)^2/2) = (8/a^2) exp(-(R a)^2/2),
 *   CONFIRMING the imp-97497 amplitude ANALYTICALLY (imp-97497 had it only from a numerical fit).
 *   Consequently |psi_R(t)|^2 ~ (1/pi^2) g''(a)^2 sin^2(a t) / t^6, the 1/t^6 law imp-97497 measured.
 *
 * THE ENDPOINT-ASYMPTOTIC BIAS (next order, closed form). One further IBP of the residual integral gives the
 *   1/t^4 correction:
 *       psi_R(t) = -(1/pi) [ g''(a) sin(a t)/t^3 + g'''(a) cos(a t)/t^4 ] + O(1/t^5),
 *   with the closed-form third-edge derivative (same u,E algebra: g'''(a) = 6 u' u'' E + 6 (u')^2 E',
 *   u' u'' = 4/a^3, (u')^2 = 4/a^2, E'(a) = -R^2 a E(a))
 *       g'''(a) = (24/a) (1/a^2 - R^2) exp(-(R a)^2/2).
 *   The RELATIVE next-order coefficient is g'''(a)/g''(a) = 3 (1/a - a R^2), so the leading asymptotic carries a
 *   fractional bias ~ [3 (1/a - a R^2)] * cos(a t) / (t sin(a t)); it is smallest exactly at the sin^2 PEAKS
 *   (cos -> 0), which is why imp-97497's peak validation reads 0.9969 -> 0.9999 as t grows. In |psi|^2 the
 *   next-order term is the cross piece 2 g''(a) g'''(a) sin(a t) cos(a t)/t^7 = g''(a) g'''(a) sin(2 a t)/t^7;
 *   integrated against the exact symbol sigma_2 ~ t^4 ln(t/2pi) the leading tail integrand is ~ ln t / t^2
 *   (the ln t / t law of imp-97497) while this bias integrand is the OSCILLATORY ln t / t^3, whose tail from
 *   T0 = 800 is O(1e-3) and averages toward zero -- consistent with the imp-97497 < 1e-3 error bar on the
 *   ~0.3 analytic tail (split-point self-consistency stays 2e-6).
 *
 * VERDICT. The imp-97497 far profile is now PROVED (not fitted): three integrations by parts of the finite
 *   cosine transform, with the order-2 edge zero killing the first two boundary terms and g''(a) != 0 producing
 *   the first surviving edge term, give psi_R(t) ~ -(1/pi) g''(a) sin(a t)/t^3 with g''(a) = (8/a^2)exp(-(Ra)^2/2)
 *   EXACTLY. The next-order 1/t^4 bias is -(1/pi) g'''(a) cos(a t)/t^4 with g'''(a) = (24/a)(1/a^2 - R^2)exp(-(Ra)^2/2),
 *   which is why the peak validation is so tight and why the tail-integral bias sits below 1e-3. Derivation only;
 *   measurement stays measurement; no bound moves; interval-rigorous reach stays 2a <= 0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * @see imp-97497-krein-welloptimum-tail-converged.js (numerically-validated tail model this module proves)
 * @see imp-97483-krein-well-capture-vs-farfield-cost-tradeoff.js (the confinement family)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2, w_1; reach 2a <= 0.96)
 *
 * Ticket: imp-97518 (numerical, medium, opus-4-8). Derivation only; changes no bound; NO QED;
 * no refereed bound is changed.
 */

const PI = Math.PI;
const LN3 = Math.log(3);
const A = LN3 / 2; // a = (ln3)/2 = 0.5493061443340548

export const IMP97518_BINDING_2A = LN3;
export const IMP97518_RIGOROUS_REACH_2A = 0.96; // unchanged

// The band-limited taper g(xi) = (1-(xi/a)^2)^2 exp(-(R xi)^2/2) on |xi| <= a.
const gTaper = (xi, R) => Math.pow(1 - Math.pow(xi / A, 2), 2) * Math.exp(-Math.pow(R * xi, 2) / 2);

// Closed-form edge derivatives derived above.
export const gppEdge = (R) => (8 / (A * A)) * Math.exp(-Math.pow(R * A, 2) / 2);
export const gpppEdge = (R) => (24 / A) * (1 / (A * A) - R * R) * Math.exp(-Math.pow(R * A, 2) / 2);

// Relative next-order coefficient g'''(a)/g''(a) = 3 (1/a - a R^2) (the endpoint-asymptotic bias slope).
export const biasRelCoeff = (R) => 3 * (1 / A - A * R * R);

// Leading + next-order endpoint asymptotic for psi_R(t).
const psiAsyLead = (R, t) => -(1 / PI) * gppEdge(R) * Math.sin(A * t) / Math.pow(t, 3);
const psiAsyTwoTerm = (R, t) =>
  psiAsyLead(R, t) - (1 / PI) * gpppEdge(R) * Math.cos(A * t) / Math.pow(t, 4);

// Exact one-sided cosine transform psi_R(t) = (1/pi) int_0^a g cos(xi t) dxi (matches imp-97497 makePsi).
function psiExact(R, t, nXi = 200000) {
  const h = A / nXi;
  let s = 0;
  for (let i = 0; i < nXi; i++) s += gTaper((i + 0.5) * h, R) * Math.cos((i + 0.5) * h * t);
  return (s * h) / PI;
}

// Central finite differences of the taper at the band edge (for verifying the closed-form derivatives).
function fdEdge(R, order, h = 1e-4) {
  const f = (xi) => gTaper(xi, R);
  if (order === 2) return (f(A + h) - 2 * f(A) + f(A - h)) / (h * h);
  return (f(A + 2 * h) - 2 * f(A + h) + 2 * f(A - h) - f(A - 2 * h)) / (2 * h * h * h);
}

// Closed-form constants at the imp-97497 optima R = 3.35 (finite-T argmin) and R* ~ 3.36 (T -> inf argmin).
export const IMP97518_EDGE_CONSTANTS = Object.freeze([
  Object.freeze({ R: 3.35, gpp: gppEdge(3.35), gppp: gpppEdge(3.35), biasRel: biasRelCoeff(3.35) }),
  Object.freeze({ R: 3.36, gpp: gppEdge(3.36), gppp: gpppEdge(3.36), biasRel: biasRelCoeff(3.36) }),
]);

export const IMP97518_VERDICT = Object.freeze({
  ticket: 'imp-97518',
  question:
    'derive in closed form the imp-97497 endpoint-asymptotic tail constant g_pp(a) and the 1/t^3 confinement profile psi_R(t) ~ -(1/pi) g_pp(a) sin(a t)/t^3, currently validated only numerically to 0.01%, and quantify the endpoint-asymptotic bias behind the < 1e-3 error bar on the ~0.3 tail.',
  answer:
    'three integrations by parts of the finite cosine transform psi_R(t) = (1/pi) int_0^a g cos(xi t) dxi prove the profile: the order-2 edge zero of the taper kills the first two boundary terms (g(a) = g_prime(a) = 0), and the first surviving edge term (g_pp(a) != 0) gives psi_R(t) ~ -(1/pi) g_pp(a) sin(a t)/t^3 with g_pp(a) = (8/a^2) exp(-(R a)^2/2) EXACTLY, hence |psi|^2 ~ (1/pi^2) g_pp(a)^2 sin^2(a t)/t^6. The next-order 1/t^4 bias is -(1/pi) g_ppp(a) cos(a t)/t^4 with g_ppp(a) = (24/a)(1/a^2 - R^2) exp(-(R a)^2/2); its relative coefficient g_ppp(a)/g_pp(a) = 3 (1/a - a R^2) vanishes against sin at the sin^2 peaks (explaining the 0.9969 -> 0.9999 peak validation), and in |psi|^2 it appears as the oscillatory cross term g_pp g_ppp sin(2 a t)/t^7, whose tail integral against sigma_2 ~ t^4 ln(t/2pi) is the ln t/t^3 piece bounded below 1e-3 -- matching the imp-97497 error bar. Derivation only; no bound moves.',
  binding_2a: LN3,
  gppEdgeClosedForm: '(8/a^2) exp(-(R a)^2/2)',
  gpppEdgeClosedForm: '(24/a)(1/a^2 - R^2) exp(-(R a)^2/2)',
  leadingProfile: 'psi_R(t) ~ -(1/pi) g_pp(a) sin(a t)/t^3',
  nextOrderProfile: '-(1/pi) g_ppp(a) cos(a t)/t^4',
  integrationsByParts: 3,
  edgeZeroOrder: 2,
  // unchanged program state
  derivationOnly: true,
  measurementStaysMeasurement: true,
  operatorPositivityProved: false,
  coercivityConstantProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97518_TAIL_ENDPOINT_ASYMPTOTIC_CLOSED_FORM -- the imp-97497 far profile is now PROVED analytically: ' +
    'three IBPs of the finite cosine transform (order-2 edge zero kills two boundary terms, g_pp(a) != 0 gives ' +
    'the surviving edge term) yield psi_R(t) ~ -(1/pi) g_pp(a) sin(a t)/t^3 with g_pp(a) = (8/a^2)exp(-(Ra)^2/2) ' +
    'EXACTLY, the next-order 1/t^4 bias -(1/pi) g_ppp(a) cos(a t)/t^4 with g_ppp(a) = (24/a)(1/a^2-R^2)exp(-(Ra)^2/2) ' +
    'accounting for the < 1e-3 tail error bar. Derivation only; no operator positivity; no bound moves; reach 2a <= 0.96.',
  qed: false,
});
export default IMP97518_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97518_ASSERTIONS = [
  {
    id: 'imp97518-gpp-edge-closed-form-matches-finite-difference',
    holds: () =>
      [3.0, 3.35, 3.36].every((R) => Math.abs(fdEdge(R, 2) / gppEdge(R) - 1) < 1e-5),
    why: 'the closed form g_pp(a) = (8/a^2) exp(-(R a)^2/2) matches a central second finite difference of the taper at the band edge to < 1e-5 relative for R = 3.0/3.35/3.36.',
  },
  {
    id: 'imp97518-gppp-edge-closed-form-matches-finite-difference',
    holds: () =>
      [3.0, 3.35, 3.36].every((R) => Math.abs(fdEdge(R, 3) / gpppEdge(R) - 1) < 1e-5),
    why: 'the closed form g_ppp(a) = (24/a)(1/a^2 - R^2) exp(-(R a)^2/2) matches a central third finite difference of the taper at the band edge to < 1e-5 relative.',
  },
  {
    id: 'imp97518-two-term-asymptotic-improves-on-leading-and-converges',
    holds: () => {
      const R = 3.35;
      // the two-term endpoint asymptotic matches the exact cosine transform ever more tightly as t grows,
      // and beats the leading-only term (its residual to exact is smaller) -- confirming the 1/t^4 bias model.
      let ok = true;
      for (const t of [403, 1004, 2000]) {
        const ex = psiExact(R, t);
        const rLead = Math.abs(ex - psiAsyLead(R, t));
        const rTwo = Math.abs(ex - psiAsyTwoTerm(R, t));
        ok = ok && rTwo < rLead && Math.abs(psiAsyTwoTerm(R, t) / ex - 1) < 1e-3;
      }
      return ok;
    },
    why: 'the two-term endpoint asymptotic (leading 1/t^3 plus next-order 1/t^4 bias) beats the leading-only term against the exact cosine transform and lands within 1e-3 relative by t ~ 400 -- validating the bias closed form.',
  },
  {
    id: 'imp97518-bias-relative-coefficient-closed-form',
    holds: () =>
      [3.0, 3.35, 3.36].every((R) => Math.abs(biasRelCoeff(R) - gpppEdge(R) / gppEdge(R)) < 1e-9),
    why: 'the endpoint-asymptotic bias slope g_ppp(a)/g_pp(a) equals the closed form 3 (1/a - a R^2) exactly.',
  },
  {
    id: 'imp97518-program-state-unchanged-no-qed',
    holds: () =>
      IMP97518_VERDICT.derivationOnly === true &&
      IMP97518_VERDICT.measurementStaysMeasurement === true &&
      IMP97518_VERDICT.operatorPositivityProved === false &&
      IMP97518_VERDICT.coercivityConstantProved === false &&
      IMP97518_VERDICT.boundMoves === false &&
      IMP97518_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97518_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97518_BINDING_2A - LN3) < 1e-12 &&
      IMP97518_VERDICT.integrationsByParts === 3 &&
      IMP97518_VERDICT.edgeZeroOrder === 2 &&
      typeof IMP97518_VERDICT.subGap === 'string' &&
      IMP97518_VERDICT.subGap.includes('IMP97518_TAIL_ENDPOINT_ASYMPTOTIC_CLOSED_FORM') &&
      IMP97518_VERDICT.qed === false,
    why: 'derivation only: the far profile is proved analytically; no positivity, no coercivity, no bound moves; reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97518_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97518-krein-tail-endpoint-asymptotic-closed-form assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
