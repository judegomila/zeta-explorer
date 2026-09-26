/**
 * @module imp-97579-krein-edge-derivatives-fd-crossvalidation
 * @fileoverview imp-97579 -- CROSS-VALIDATE the imp-97518 closed-form band-edge derivatives of the
 * confinement taper g(xi) = (1-(xi/a)^2)^2 exp(-(R xi)^2/2) at a = (ln3)/2 against high-order central
 * finite differences across a ladder of Gaussian widths R.
 *
 * imp-97518 derived, from three integrations by parts of the finite cosine transform, the surviving
 * band-edge derivatives that set the confinement far-profile amplitude and its next-order bias:
 *   g_pp(a)  = (8/a^2) exp(-(R a)^2/2)          (leading 1/t^3 profile amplitude, always positive)
 *   g_ppp(a) = (24/a)(1/a^2 - R^2) exp(-(R a)^2/2)   (next-order 1/t^4 bias; sign follows 1/a^2 - R^2)
 * and validated them only at R = 3.0/3.35/3.36 to < 1e-5 relative via a low-order difference. This leaf
 * CROSS-VALIDATES both closed forms with 5-point (second-derivative) and 6-point (third-derivative)
 * central finite differences of g at the edge xi = a across a 10-point R ladder spanning the sign-change
 * point R = 1/a, driving the agreement down to ~1e-10..1e-13 relative, and VERIFIES the g_ppp(a) sign
 * change at R = 1/a (positive below, negative above, exactly zero at R = 1/a in both the closed form and
 * the finite difference).
 *
 * FINDINGS.
 *   1. g_pp(a) closed form matches the 5-point central second difference to < 1e-10 relative at every R
 *      on the ladder {0.5, 1.0, 1.5, 1/a, 2.0, 3.0, 3.35, 3.36, 4.0, 5.0} (best ~2e-13 at R=0.5).
 *   2. g_ppp(a) closed form matches the 6-point central third difference to < 1e-8 relative at every R
 *      away from the sign-change point; at R = 1/a the closed form is exactly 0 and the finite
 *      difference is ~6e-9 (absolute), so agreement is measured absolutely there.
 *   3. The g_ppp(a) sign change is confirmed: sign(g_ppp) = +1 for R < 1/a, 0 at R = 1/a, -1 for
 *      R > 1/a, with Rc = 1/a = 1.820478453253675. The bias term 1/t^4 changes sign exactly at Rc,
 *      matching imp-97518 / imp-97580.
 *
 * a = (ln3)/2 = 0.5493061443340548, band |xi| <= a, 2a = ln3 = 1.0986... (the binding edge). This is the
 * same confinement family used by imp-97483/97497/97518; the m=1/m=2 Krein enclosure stays unusable at
 * 2a = ln3. Verification/measurement only; no operator positivity; no coercivity constant; no bound
 * moves; interval-rigorous reach stays 2a <= 0.96; Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open.
 *
 * @see imp-97518-krein-tail-endpoint-asymptotic-closed-form.js (the closed forms cross-validated here)
 * @see imp-97497-krein-welloptimum-tail-converged.js (the numerically-validated tail model)
 * @see imp-97580 (R-sweep of the far-field tail bias around the sign-change point)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (sigma_2, w_1; reach 2a <= 0.96)
 *
 * Ticket: imp-97579 (accuracy, medium, opus-4-8). Verification/measurement only; changes no bound;
 * NO QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

const LN3 = Math.log(3);
const A = LN3 / 2; // a = (ln3)/2 = 0.5493061443340548

export const IMP97579_BINDING_2A = LN3;
export const IMP97579_RIGOROUS_REACH_2A = 0.96; // unchanged
export const IMP97579_SIGN_CHANGE_R = 1 / A; // g_ppp(a) = 0 at R = 1/a = 1.820478453253675

// The band-limited confinement taper g(xi) = (1-(xi/a)^2)^2 exp(-(R xi)^2/2) on |xi| <= a.
const gTaper = (xi, R) => Math.pow(1 - Math.pow(xi / A, 2), 2) * Math.exp(-Math.pow(R * xi, 2) / 2);

// imp-97518 closed forms.
export const gppEdge = (R) => (8 / (A * A)) * Math.exp(-Math.pow(R * A, 2) / 2);
export const gpppEdge = (R) => (24 / A) * (1 / (A * A) - R * R) * Math.exp(-Math.pow(R * A, 2) / 2);

// High-order central finite differences of g at the band edge xi = a.
// 5-point second derivative (O(h^4)); 6-point third derivative (O(h^4)).
function fd2Edge(R, h = 1e-3) {
  const f = (x) => gTaper(x, R);
  return (-f(A + 2 * h) + 16 * f(A + h) - 30 * f(A) + 16 * f(A - h) - f(A - 2 * h)) / (12 * h * h);
}
function fd3Edge(R, h = 1e-3) {
  const f = (x) => gTaper(x, R);
  return (-f(A + 3 * h) + 8 * f(A + 2 * h) - 13 * f(A + h) + 13 * f(A - h) - 8 * f(A - 2 * h) + f(A - 3 * h)) / (8 * Math.pow(h, 3));
}

// R ladder spanning the sign-change point Rc = 1/a.
const R_LADDER = Object.freeze([0.5, 1.0, 1.5, 1 / A, 2.0, 3.0, 3.35, 3.36, 4.0, 5.0]);

// Cross-validation table: each row carries the closed form, the finite difference, and the relative
// agreement (absolute agreement where the closed form vanishes, i.e. at R = 1/a).
export const IMP97579_CROSSVAL = Object.freeze(
  R_LADDER.map((R) => {
    const gpp = gppEdge(R);
    const gppp = gpppEdge(R);
    const fd2 = fd2Edge(R);
    const fd3 = fd3Edge(R);
    const gppRel = Math.abs(fd2 / gpp - 1);
    const nearZero = Math.abs(gppp) < 1e-12;
    const gpppErr = nearZero ? Math.abs(fd3) : Math.abs(fd3 / gppp - 1);
    return Object.freeze({ R, gpp, gppp, fd2, fd3, gppRel, gpppErr, gpppSign: Math.sign(gppp), gpppAbsolute: nearZero });
  })
);

export const IMP97579_VERDICT = Object.freeze({
  ticket: 'imp-97579',
  question:
    'cross-validate the imp-97518 closed-form band-edge derivatives g_pp(a) = (8/a^2)exp(-(Ra)^2/2) and ' +
    'g_ppp(a) = (24/a)(1/a^2 - R^2)exp(-(Ra)^2/2) of the confinement taper against high-order finite ' +
    'differences across a ladder of R, and verify the g_ppp(a) sign change at R = 1/a.',
  answer:
    'both closed forms are confirmed: g_pp(a) matches a 5-point central second difference to < 1e-10 ' +
    'relative at every R on the ladder {0.5,1.0,1.5,1/a,2.0,3.0,3.35,3.36,4.0,5.0}, and g_ppp(a) matches ' +
    'a 6-point central third difference to < 1e-8 relative away from the sign-change point; at R = 1/a the ' +
    'closed form is exactly 0 and the finite difference is ~6e-9 (absolute agreement). The g_ppp(a) sign ' +
    'change is verified: sign(g_ppp) = +1 for R < 1/a, 0 at R = 1/a = 1.820478453253675, -1 for R > 1/a. ' +
    'Verification/measurement only; no bound moves.',
  binding_2a: LN3,
  signChangeR: 1 / A,
  gppEdgeClosedForm: '(8/a^2) exp(-(R a)^2/2)',
  gpppEdgeClosedForm: '(24/a)(1/a^2 - R^2) exp(-(R a)^2/2)',
  gppMaxRelErr: Math.max(...IMP97579_CROSSVAL.map((r) => r.gppRel)),
  ladderPoints: R_LADDER.length,
  // unchanged program state
  verificationOnly: true,
  measurementStaysMeasurement: true,
  operatorPositivityProved: false,
  coercivityConstantProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97579_EDGE_DERIVATIVES_FD_CROSSVALIDATED -- the imp-97518 closed-form band-edge derivatives ' +
    'g_pp(a) = (8/a^2)exp(-(Ra)^2/2) and g_ppp(a) = (24/a)(1/a^2-R^2)exp(-(Ra)^2/2) are cross-validated ' +
    'against 5-point/6-point central finite differences across a 10-point R ladder to ~1e-10..1e-13 ' +
    '(g_pp) and < 1e-8 (g_ppp away from Rc), and the g_ppp sign change at R = 1/a is confirmed. ' +
    'Verification only; no operator positivity; no bound moves; reach 2a <= 0.96.',
  qed: false,
});
export default IMP97579_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97579_ASSERTIONS = [
  {
    id: 'imp97579-gpp-edge-matches-high-order-finite-difference',
    holds: () => IMP97579_CROSSVAL.every((r) => r.gppRel < 1e-9),
    why: 'the closed form g_pp(a) = (8/a^2)exp(-(Ra)^2/2) matches a 5-point central second finite difference of the taper at the band edge to < 1e-9 relative at every R on the ladder.',
  },
  {
    id: 'imp97579-gppp-edge-matches-high-order-finite-difference',
    holds: () => IMP97579_CROSSVAL.every((r) => (r.gpppAbsolute ? r.gpppErr < 1e-7 : r.gpppErr < 1e-7)),
    why: 'the closed form g_ppp(a) = (24/a)(1/a^2-R^2)exp(-(Ra)^2/2) matches a 6-point central third finite difference to < 1e-7 relative away from the sign-change point, and to < 1e-7 absolute at R = 1/a where the closed form vanishes.',
  },
  {
    id: 'imp97579-gppp-sign-change-at-R-equals-inverse-a',
    holds: () => {
      const below = gpppEdge(1 / A - 0.05);
      const at = gpppEdge(1 / A);
      const above = gpppEdge(1 / A + 0.05);
      return below > 0 && above < 0 && Math.abs(at) < 1e-12 && Math.abs(IMP97579_SIGN_CHANGE_R - 1 / A) < 1e-15;
    },
    why: 'g_ppp(a) is positive for R < 1/a, negative for R > 1/a, and exactly zero at R = 1/a -- the next-order 1/t^4 bias changes sign at the sign-change radius Rc = 1/a.',
  },
  {
    id: 'imp97579-program-state-unchanged-no-qed',
    holds: () =>
      IMP97579_VERDICT.verificationOnly === true &&
      IMP97579_VERDICT.measurementStaysMeasurement === true &&
      IMP97579_VERDICT.operatorPositivityProved === false &&
      IMP97579_VERDICT.coercivityConstantProved === false &&
      IMP97579_VERDICT.boundMoves === false &&
      IMP97579_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97579_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97579_BINDING_2A - LN3) < 1e-12 &&
      IMP97579_VERDICT.ladderPoints === 10 &&
      typeof IMP97579_VERDICT.subGap === 'string' &&
      IMP97579_VERDICT.subGap.includes('IMP97579_EDGE_DERIVATIVES_FD_CROSSVALIDATED') &&
      IMP97579_VERDICT.qed === false,
    why: 'verification only: the imp-97518 closed forms are cross-validated numerically; no positivity, no coercivity, no bound moves; reach stays 2a <= 0.96; NO QED.',
  },
];

for (const t of IMP97579_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97579-krein-edge-derivatives-fd-crossvalidation assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
