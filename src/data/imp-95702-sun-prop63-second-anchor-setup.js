/**
 * @fileoverview imp-95702 — HONEST PARTIAL of the imp-95690 second-anchor re-run.
 *
 * imp-95690 REFUTED the imp-95516 line-64 claim that the Sun Section-6 (Proposition 6.3)
 * v-integrand is rho-independent: c_odd(rho) = rho^2 * J(rho) with the rho^2 PREFACTOR
 * structurally forced (eqs 6.19-6.21, exact via the substitution t = rho/u) but the
 * v-integral factor J(rho) carrying residual rho-dependence through Q_0(v), whose
 * fractional-part moduli (1/rho, 2/rho, 2/rho+1) and per-cell leading coefficient
 * -(4/rho - 1)/2 are all hardwired to rho = 1/20. imp-95690 named the exact operations a
 * genuine second numeric anchor c_odd(rho2) requires and left them UNEXECUTED.
 *
 * SOURCE: arXiv:2609.04176 (Z.-W. Sun, single-author, unrefereed), Section 6, Prop 6.3,
 * eqs (6.1)-(6.25), carried in tmp/sun-catalan/paper.txt (lines 741-885).
 *
 * WHAT THIS MODULE DOES (two parts, split by what was actually verifiable import-light):
 *
 *  (A) CONCRETIZES the rescaled second-anchor SETUP at rho2 = 1/19 -- the structurally exact,
 *      certificate-free half of the imp-95690 operation list. Choosing rho2 = 1/m2 with integer
 *      m2 = 19 keeps every modulus of the finite-cell machinery an integer, as at the anchor:
 *        - alpha(v) = {19 v}, gamma(v) = {38 v}, beta(v) = {39 v}   (moduli 1/rho2=19, 2/rho2=38, 2/rho2+1=39);
 *        - per-cell leading coefficient of Q_0^(rho2)(v) is -(4/rho2 - 1)/2 = -75/2 = -37.5 (vs -79/2 at 1/20);
 *        - the singular coefficient A_rho2 = 2 rho2 - rho2^2/2 (eq 6.19);
 *        - the breakpoint set B (6.24) rebuilds with 18 = 1/rho2 - 1, 19 = 1/rho2, 38 = 2/rho2, 39 = 2/rho2+1.
 *      These are exact rescalings, verifiable by inspection against Prop 6.3 -- no interval
 *      certificate is needed to state them.
 *
 *  (B) States the pure-rho^2-shape NULL the second anchor tests against: if J(rho) were the
 *      constant kappa = J(1/20) = 2.51069789 (the imp-95653 shape hypothesis imp-95690 found
 *      NOT structurally forced), then c_odd(rho2) would equal kappa * rho2^2. At rho2 = 1/19
 *      that null prediction is c_odd_pred(1/19) = kappa / 361 = 0.006954841800554015. The
 *      measured deviation of a genuine anchor from this null is exactly
 *      kappa*(J(rho2)/J(1/20) - 1) = the fractional rho-variation of INT Q_0^(rho) zeta(3,1+v) dv
 *      (the imp-95653 dI, LOCATED by imp-95690 in the Q_0*zeta(3,1+v) term).
 *
 * SUB-GAP (why J(rho2)/J(1/20)-1 is NOT reported here): the fractional J-variation cannot be
 * quoted without a faithful re-evaluation of the interval certificate (6.21)-(6.22). An
 * import-light from-scratch re-implementation of the Prop-6.3 v-integrand
 * ( scratch: tmp/imp-95702-prop63-rerun.mjs ) -- Hurwitz zeta by Euler-Maclaurin plus a
 * finite-grid histogram proxy for the lowest-mass integral K_v(1+v) of eq (6.9)-(6.10) --
 * does NOT reproduce the CERTIFIED anchor c_odd(1/20) = 0.006276744728100982 (eq 6.23): the
 * reconstructed INT_0^1 (5/2 - zeta(2,1+v) + Q_0(v) zeta(3,1+v)) dv comes out with the wrong
 * sign and off by a factor of order 1.69, so the reconstructed J is not trustworthy at either
 * rho. The reproduction is blocked at exactly the machinery Prop 6.3 leans on: the 238-raw /
 * 178-merged exact cell partition of B (6.24) and the Euler-Maclaurin-through-B24 rational
 * outward-rounding enclosure (6.26) -- a finite-grid / histogram proxy is not a substitute.
 * A genuine c_odd(rho2) therefore still requires the faithful 178-cell certificate at rho2,
 * not merely the setup this module records. NAMED SUB-GAP: "faithful 178-merged-cell Q_0
 * partition + B24 Euler-Maclaurin interval certificate at rho2 (the finite-grid K_v proxy does
 * not reproduce the 1/20 anchor)".
 *
 * This module makes NO measurement of the J-variation and asserts NO reproduction of the
 * anchor. It records the exact rescaled setup and the null prediction, and names the blocking
 * sub-gap honestly. Catalan G irrationality OPEN; Sun preprint single-author, unrefereed;
 * changes no bound; NO Lambda movement; no refereed bound is changed; NO QED. NO heavy imports.
 */

const KAPPA = 2.51069789; // J(1/20) carried literal (imp-95516/95637/95653/95690)
const C_ODD_AT_1_OVER_20 = 0.006276744728100982; // Prop 6.3, eq (6.23) certified anchor

const RHO_ANCHOR = 1 / 20; // m = 20
const RHO2 = 1 / 19; // second anchor, m2 = 19 (nearest integer-modulus choice below 20)

const A_of = (r) => 2 * r - (r * r) / 2; // singular coefficient A_rho (eq 6.19)

// (A) rescaled setup at rho2 = 1/19 -- exact, certificate-free.
const SECOND_ANCHOR_SETUP = Object.freeze({
  rho2: RHO2,
  m2: 19,
  moduli: Object.freeze({
    alpha_modulus: 19, // {19 v} = {v/rho2}
    gamma_modulus: 38, // {38 v} = {2 v/rho2}
    beta_modulus: 39, // {39 v} = {(2/rho2+1) v}
  }),
  q0LeadingCoefficient: -(4 / RHO2 - 1) / 2, // -75/2 = -37.5
  A_rho2: A_of(RHO2), // 2 rho2 - rho2^2/2
  breakpointAnchors: Object.freeze({
    oneOverRho2_minus1: 1 / RHO2 - 1, // 18
    oneOverRho2: 1 / RHO2, // 19
    twoOverRho2: 2 / RHO2, // 38
    twoOverRho2_plus1: 2 / RHO2 + 1, // 39
  }),
  comparisonAtAnchor: Object.freeze({
    moduli: Object.freeze({ alpha_modulus: 20, gamma_modulus: 40, beta_modulus: 41 }),
    q0LeadingCoefficient: -(4 / RHO_ANCHOR - 1) / 2, // -79/2 = -39.5
    A_rho: A_of(RHO_ANCHOR), // 0.09875
  }),
});

// (B) pure-rho^2-shape null prediction the second anchor tests against.
const PURE_SHAPE_NULL = Object.freeze({
  hypothesis: 'J(rho) = kappa constant (the imp-95653 shape imp-95690 found NOT structurally forced)',
  c_odd_pred_at_1over19: KAPPA * RHO2 * RHO2, // kappa / 361
  deviationLaw: 'measured c_odd(rho2) - kappa*rho2^2 = kappa*rho2^2*(J(rho2)/J(1/20) - 1); the sign/size of J(rho2)/J(1/20)-1 is the unmeasured quantity',
});

export const SUN_PROP63_SECOND_ANCHOR_SETUP = Object.freeze({
  id: 'imp-95702-sun-prop63-second-anchor-setup',
  title:
    'Honest partial of the imp-95690 second-anchor re-run: concrete rho2=1/19 rescaled Prop-6.3 '
    + 'setup (moduli 19/38/39, leading -75/2, A_rho2) and the pure-rho^2 null prediction, with the '
    + 'J(rho2)/J(1/20)-1 measurement flagged blocked by the 178-cell interval certificate',
  status:
    'PARTIAL -- rescaled setup at rho2=1/19 CONCRETIZED (moduli 1/rho2=19, 2/rho2=38, 2/rho2+1=39; '
    + 'leading coeff -(4/rho2-1)/2=-75/2; A_rho2=2rho2-rho2^2/2); pure-shape null c_odd_pred(1/19)=kappa/361 '
    + 'RECORDED. The fractional J-variation J(rho2)/J(1/20)-1 is NOT measured: an import-light Prop-6.3 '
    + 'v-integral re-implementation does NOT reproduce the certified anchor c_odd(1/20)=0.006276744728100982 '
    + '(wrong sign, factor ~1.69 off), so a faithful 178-merged-cell + B24 Euler-Maclaurin certificate at '
    + 'rho2 is still required. G irrationality OPEN; Sun unrefereed; changes no bound; no refereed bound is changed; NO QED',
  preprint: 'arXiv:2609.04176 (single-author, unrefereed)',
  source: 'tmp/sun-catalan/paper.txt Section 6, Proposition 6.3, eqs (6.1)-(6.25)',
  builtOn: 'imp-95690 (rho-independence verdict + named operation list), imp-95516/95653 (kappa*rho^2 shape test)',

  secondAnchorSetup: SECOND_ANCHOR_SETUP,
  pureShapeNull: PURE_SHAPE_NULL,

  reproductionStatus: Object.freeze({
    anchorReproduced: false,
    scratch: 'tmp/imp-95702-prop63-rerun.mjs',
    method:
      'Hurwitz zeta(2,1+v)/zeta(3,1+v) by direct sum + Euler-Maclaurin tail; Q_0(v) via eq (6.18) with a '
      + 'finite-grid histogram proxy for the lowest-mass integral K_v(1+v) of eqs (6.9)-(6.10); midpoint '
      + 'v-quadrature.',
    observedFailure:
      'reconstructed INT_0^1 (5/2 - zeta(2,1+v) + Q_0(v) zeta(3,1+v)) dv has the WRONG SIGN and is off by a '
      + 'factor of order 1.69 vs the value -c_odd(1/20)/rho^2 = -2.5107 implied by eq (6.23); the finite-grid '
      + 'K_v proxy does not resolve the 238-raw / 178-merged exact cell partition of B (6.24).',
    namedSubGap:
      'faithful 178-merged-cell Q_0 partition + B24 Euler-Maclaurin interval certificate at rho2 (the '
      + 'finite-grid K_v proxy does not reproduce the 1/20 anchor); this is the remaining blocker for a '
      + 'genuine c_odd(rho2) and hence for measuring J(rho2)/J(1/20)-1.',
  }),

  caveats:
    'Records the exact rescaled setup and the null prediction only; makes NO J-variation measurement and '
    + 'asserts NO reproduction of c_odd. Catalan G irrationality OPEN; Sun single-author, unrefereed; NO '
    + 'Lambda movement; no refereed bound is changed; NO QED.',
});

export const SUN_PROP63_SECOND_ANCHOR_SETUP_ASSERTIONS = Object.freeze([
  {
    name: 'rho2=1/19 moduli are exactly 1/rho2, 2/rho2, 2/rho2+1 (19, 38, 39)',
    holds: () =>
      SECOND_ANCHOR_SETUP.moduli.alpha_modulus === 19
      && SECOND_ANCHOR_SETUP.moduli.gamma_modulus === 38
      && SECOND_ANCHOR_SETUP.moduli.beta_modulus === 39,
  },
  {
    name: 'rho2 per-cell leading coefficient is -(4/rho2-1)/2 = -75/2 = -37.5',
    holds: () => Math.abs(SECOND_ANCHOR_SETUP.q0LeadingCoefficient - (-37.5)) < 1e-12,
  },
  {
    name: 'A_rho2 = 2rho2 - rho2^2/2 at rho2=1/19',
    holds: () => Math.abs(SECOND_ANCHOR_SETUP.A_rho2 - (2 / 19 - (1 / 361) / 2)) < 1e-15,
  },
  {
    name: 'anchor comparison retains the 1/20 moduli (20,40,41) and -79/2 leading coefficient',
    holds: () =>
      SECOND_ANCHOR_SETUP.comparisonAtAnchor.moduli.beta_modulus === 41
      && Math.abs(SECOND_ANCHOR_SETUP.comparisonAtAnchor.q0LeadingCoefficient - (-39.5)) < 1e-12,
  },
  {
    name: 'pure-shape null prediction is kappa*rho2^2 = kappa/361',
    holds: () => Math.abs(PURE_SHAPE_NULL.c_odd_pred_at_1over19 - KAPPA / 361) < 1e-15,
  },
  {
    name: 'honest: anchor NOT reproduced, J-variation NOT measured, sub-gap named, no refereed bound is changed, NO QED',
    holds: () =>
      SUN_PROP63_SECOND_ANCHOR_SETUP.reproductionStatus.anchorReproduced === false
      && /NOT measured/.test(SUN_PROP63_SECOND_ANCHOR_SETUP.status)
      && /178-merged-cell/.test(SUN_PROP63_SECOND_ANCHOR_SETUP.reproductionStatus.namedSubGap)
      && /refereed bound is changed/i.test(SUN_PROP63_SECOND_ANCHOR_SETUP.status)
      && /NO QED/.test(SUN_PROP63_SECOND_ANCHOR_SETUP.status),
  },
]);

export default SUN_PROP63_SECOND_ANCHOR_SETUP;
