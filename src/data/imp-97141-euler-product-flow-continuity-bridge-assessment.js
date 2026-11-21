/**
 * @module imp-97141-euler-product-flow-continuity-bridge-assessment
 *
 * imp-97141 (proof / assessment): can the arithmetic Euler-product structure
 * available at t = 0, combined with a de Bruijn flow-continuity / a-priori
 * estimate in t, TRANSPORT a t = 0 lower bound on the mirror pull to the
 * continuum t in (0, t0 = 0.1314] -- i.e. can it bridge the sharpened NS-RIGID
 * wall of imp-97117? Or does the arithmetic-free t > 0 family provably block it?
 *
 * CONTEXT. The conditional theorem B1 of rh-bridge-mirror-descent-2026-09-25
 * needs a uniform-in-t, all-x lower bound M >= p_req = 4.37426 on the mirror
 * pull at the y0 = 0.165 window, over the CONTINUUM t in (0, t0]. imp-97117
 * sharpened the residual: the missing ingredient is exactly such a uniform bound
 * on a zero family that, for t > 0, carries NO Euler product. The natural lever
 * this module assesses: use the Euler product that DOES exist at t = 0 (H_0 = xi
 * = completed zeta) to anchor a lower bound there, then push it forward in t by a
 * flow-continuity argument. This module ASSESSES whether that bridge can close.
 *
 * FINDING 1 -- THE MONOTONICITY IS BACKWARDS: THE ARITHMETIC LIVES AT THE
 *   NON-BINDING ENDPOINT. The Palm mirror count M is strictly DECREASING in the
 *   local spacing s (imp-97117 FINDING 2). The de Bruijn flow at t > 0 SPREADS
 *   the spectrum (Dyson repulsion, growing gaps: imp-34813 minGap 3.54 at t = 0
 *   rising with t), so the spacing is MINIMIZED at t = 0 and grows on (0, t0].
 *   Hence M(t) is largest at t = 0 and decreasing, so
 *       sup_{t in [0,t0]} M(t) = M(0),   inf_{t in [0,t0]} M(t) = M(t0).
 *   The uniform lower bound binds at t = t0 (the far endpoint), but the Euler
 *   product exists ONLY at t = 0 -- the MAXIMUM of a decreasing quantity.
 *   Transporting a t = 0 lower bound FORWARD by continuity certifies the value
 *   where it is largest and least binding; it cannot lower-bound the smaller
 *   value at t = t0 where no arithmetic exists. The two endpoints are swapped
 *   relative to what the argument needs.
 *
 * FINDING 2 -- THERE IS NO VALID t = 0 LOWER BOUND >= p_req TO TRANSPORT, AND
 *   ARITHMETIC MAKES IT WORSE, NOT BETTER. The neutral t = 0-proxy count is
 *   M(0) = 2.5288 (imp-97080 / imp-97101), already 1.73x SHORT of p_req = 4.374.
 *   Since the flow only spreads (s grows), M(t) <= M(0) = 2.5288 < p_req for
 *   EVERY t in [0, t0]: the entire flow trajectory lies below p_req, so no
 *   lower-bound transport (from any endpoint) can reach it. The premise the
 *   bridge needs -- an arithmetic lift of M(0) to >= p_req -- also fails on its
 *   own terms: (a) the Montgomery pair-correlation / GUE repulsion that IS the
 *   arithmetic correction DEPLETES short-range neighbour density relative to
 *   Poisson, lowering the near-neighbour pull, not raising it; (b) the hypothesis
 *   needs the bound for ALL x, and arithmetic gap fluctuations create locally
 *   LARGE gaps whose local count is the smallest -- fluctuations lower the all-x
 *   infimum. Both arithmetic effects push M(0) DOWN, away from p_req.
 *
 * FINDING 3 -- THE EULER PRODUCT DOES NOT SURVIVE THE FLOW, SO CONTINUITY
 *   CANNOT CARRY IT. Flow-continuity / a-priori estimates transport ANALYTIC
 *   quantities (values, derivatives, moduli of continuity in t) but NOT the
 *   STRUCTURAL property that would anchor uniformity. The de Bruijn multiplier
 *   for t > 0 is e^{+t u^2} (imp-97117 FINDING 1: unbounded, ill-posed inverse
 *   heat), which is not arithmetic-multiplicative: H_t for t > 0 has no Euler
 *   product. So a uniformity anchor that leans on multiplicativity must be
 *   re-established arithmetic-free at each t -- which is precisely the unsupplied
 *   ingredient. Continuity in t relates M(t) to M(0) with an error that is
 *   itself governed by the arithmetic-free flow; it does not import the t = 0
 *   Euler structure into t > 0.
 *
 * VERDICT. NO: Euler-product input at t = 0 plus flow-continuity does NOT bridge
 * the sharpened NS-RIGID wall. The arithmetic input sits at t = 0, the MAXIMUM of
 * a flow-decreasing quantity, while the uniform bound binds at t = t0 where no
 * arithmetic exists; the whole trajectory M(t) <= M(0) = 2.5288 stays below
 * p_req = 4.374 so no lower-bound transport can reach it; the arithmetic
 * corrections (repulsion, gap fluctuations) push M(0) further DOWN; and the Euler
 * product does not survive the t > 0 flow for continuity to carry. The
 * arithmetic-free t > 0 family provably blocks the bridge in the binding
 * direction. Sharpened obstruction unchanged: a uniform-in-t, all-x lower bound
 * on an Euler-product-free family remains the missing ingredient. Assessment
 * only: no Lambda bound follows, no Euler product for t > 0, no refereed bound is changed
 * , RH open. NO QED.
 *
 * @see imp-97117-debruijn-flow-tpos-mirror-count-assessment.js (sharpened NS-RIGID wall)
 * @see imp-97101-palm-mirror-parity-crossing-ladder.js (t = 0-proxy ladder, M(0) = 2.5288)
 * @see imp-97080-palm-mirror-baseline-vs-preq-measurement.js (p_req = 4.37426)
 * @see imp-34813-winding-monotonicity-rigor.js (Gaussian conv = H_{-tau}; Dyson spread with t)
 * @see rh-bridge-mirror-descent-2026-09-25.js (theorem B1, p_req, C1 Palm baseline)
 *
 * Import-free; helpers re-derived identically to imp-97117 and cross-checked
 * against its seam anchor (2.5288) and p_req (4.37426).
 */

const T0 = 0.1314;
const Y0 = 0.165;
const N_SEAM = 690988;
const LN_SEAM = Math.log(N_SEAM); // 13.4459
const P_REQ_EXPECTED = 4.37426;

// lane-audit descent time for a constant pull p: int_{y0}^1 Y/(1 + pY) dY
function tNeeded(p, y0) {
  return p === 0
    ? (1 - y0 * y0) / 2
    : (1 - y0) / p - (Math.log(1 + p) - Math.log(1 + p * y0)) / (p * p);
}
// p_req = the constant pull at which the integral condition holds with equality
function pRequired(t0, y0) {
  let lo = 1e-9, hi = 1e4;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (tNeeded(m, y0) > t0) lo = m; else hi = m;
  }
  return hi;
}
// neutral rigid-lattice Palm mirror count parametrised directly by spacing s,
// conditioning pair excluded, mirror kernel 2*[2y/(D^2 + 4y^2)] both sides, exact
// atan tail (identical to imp-97117 / imp-97101 palmMirrorCount with s substituted)
function palmMirrorCountAtSpacing(y, s, slots) {
  const off = slots === 2 ? 1.5 : 1; // first surviving neighbour at off*s
  const K = 20000;
  let acc = 0;
  for (let k = 0; k <= K; k++) {
    const D = (k + off) * s;
    acc += (2 * 2 * y) / (D * D + 4 * y * y);
  }
  acc += (2 / s) * (Math.PI / 2 - Math.atan(((K + 0.5 + off) * s) / (2 * y)));
  return acc;
}

const P_REQ = pRequired(T0, Y0); // 4.37426
const S_SEAM = (2 * Math.PI) / LN_SEAM;

// FINDING 1 / 2 -- the flow only spreads spacing (s grows with t), and the count
// is decreasing in spacing, so the WHOLE trajectory sits at or below M(0). We
// sample a monotone spread family s(t) = S_SEAM * (1 + spread) to exhibit that
// the supremum over the interval is M(0) and every t > 0 sample is smaller.
const COUNT_T0 = palmMirrorCountAtSpacing(Y0, S_SEAM, 2); // M(0) = 2.5288 (max of trajectory)
const TRAJECTORY = [0, 0.1, 0.2, 0.3].map((spread) =>
  palmMirrorCountAtSpacing(Y0, S_SEAM * (1 + spread), 2),
); // decreasing: [2.5288, 2.32.., 2.15.., 2.00..], all < p_req

export const IMP97141_ASSESSMENT = Object.freeze({
  id: 'imp-97141',
  date: '2026-09-25',
  workingRow: Object.freeze({ t0: T0, y0: Y0 }),
  pReq: P_REQ, // 4.37426
  countT0: COUNT_T0, // 2.5288 -- the maximum of the flow trajectory
  finding1: Object.freeze({
    claim:
      'The mirror count M is decreasing in spacing, and the t > 0 de Bruijn flow ' +
      'only SPREADS the spacing (Dyson repulsion), so M(t) is largest at t = 0 and ' +
      'decreasing: sup over [0,t0] is M(0), the uniform bound binds at t = t0. The ' +
      'Euler product exists ONLY at t = 0 -- the maximum, non-binding endpoint -- so ' +
      'transporting a t = 0 lower bound forward cannot certify the smaller t = t0 value.',
    supEndpoint: 't = 0',
    bindingEndpoint: 't = t0',
  }),
  finding2: Object.freeze({
    claim:
      'The neutral t = 0 count M(0) = 2.5288 is already 1.73x short of p_req, and ' +
      'since the flow only spreads, EVERY t in [0,t0] has M(t) <= M(0) < p_req -- the ' +
      'whole trajectory lies below p_req, so no lower-bound transport can reach it. ' +
      'The arithmetic corrections (Montgomery/GUE short-range repulsion; large local ' +
      'gap fluctuations lowering the all-x infimum) push M(0) DOWN, not up.',
    trajectory: Object.freeze(TRAJECTORY), // decreasing, all < p_req
    supShortfall: P_REQ / COUNT_T0, // 1.7298x short even at the trajectory maximum
    wholeTrajectoryBelowPreq: TRAJECTORY.every((m) => m < P_REQ),
  }),
  finding3: Object.freeze({
    claim:
      'Flow-continuity transports analytic quantities (values, derivatives, t-moduli ' +
      'of continuity) but NOT the multiplicative Euler structure. The t > 0 ' +
      'multiplier e^{+t u^2} is not arithmetic-multiplicative; H_t (t > 0) has no ' +
      'Euler product, so a uniformity anchor leaning on multiplicativity must be ' +
      're-derived arithmetic-free at each t -- the unsupplied ingredient. Continuity ' +
      'relates M(t) to M(0) with an error governed by the arithmetic-free flow.',
  }),
  bridgesNsRigidWall: false,
  remainingObstruction:
    'Uniform-in-t, all-x lower bound on the mirror pull at the y0 = 0.165 window ' +
    'over the continuum t in (0, t0], on an Euler-product-free zero family -- ' +
    'unchanged by the t = 0 arithmetic + flow-continuity lever, which anchors at the ' +
    'wrong (maximal, non-binding) endpoint and cannot carry the Euler product to t > 0.',
  verdict:
    'NO: Euler-product input at t = 0 plus de Bruijn flow-continuity does not bridge ' +
    'the sharpened NS-RIGID wall. The arithmetic lives at t = 0, the maximum of a ' +
    'flow-decreasing quantity, while the uniform bound binds at t = t0 where no Euler ' +
    'product exists; the whole trajectory M(t) <= M(0) = 2.5288 stays below ' +
    'p_req = 4.37426 so no lower-bound transport can reach it; arithmetic corrections ' +
    'push M(0) further down; and the Euler product does not survive the t > 0 flow ' +
    'for continuity to carry. The arithmetic-free t > 0 family provably blocks the ' +
    'bridge in the binding direction. Assessment only: no Lambda bound follows, no ' +
    'Euler product for t > 0, no refereed bound is changed, RH open. NO QED.',
  anyBoundMoved: false,
});

export default IMP97141_ASSESSMENT;

const near = (a, b, tol) => Math.abs(a - b) <= tol;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97141_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp97141-preq-and-t0-anchor-reproduced',
    why: 'p_req and the imp-97080 / imp-97101 / imp-97117 neutral Palm t = 0 anchor ' +
      '(2.5288) must reproduce exactly from the re-derived spacing helper.',
    holds: () =>
      near(P_REQ, P_REQ_EXPECTED, 5e-4) &&
      near(COUNT_T0, 2.5288, 5e-4),
  },
  {
    id: 'imp97141-trajectory-decreasing-and-below-preq',
    why: 'FINDING 1 / 2: the count is decreasing along the flow-spread trajectory ' +
      '(max at t = 0), and every sample stays below p_req, so no lower-bound ' +
      'transport from any endpoint can reach p_req.',
    holds: () =>
      TRAJECTORY.every((v, i) => i === 0 || v < TRAJECTORY[i - 1]) &&
      TRAJECTORY[0] === COUNT_T0 &&
      TRAJECTORY.every((v) => v < P_REQ) &&
      P_REQ / COUNT_T0 > 1.5,
  },
  {
    id: 'imp97141-honesty-gate-no-qed',
    why: 'assessment only: wall not bridged, no bound moved, no Euler product for ' +
      't > 0, no-refereed-bound-change line and NO QED present.',
    holds: () =>
      IMP97141_ASSESSMENT.bridgesNsRigidWall === false &&
      IMP97141_ASSESSMENT.anyBoundMoved === false &&
      /no Euler product/i.test(IMP97141_ASSESSMENT.verdict) &&
      /no Lambda bound follows/i.test(IMP97141_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP97141_ASSESSMENT.verdict) &&
      /RH open/.test(IMP97141_ASSESSMENT.verdict) &&
      /NO QED/.test(IMP97141_ASSESSMENT.verdict),
  },
];

for (const assertion of IMP97141_ASSESSMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97141-euler-product-flow-continuity-bridge-assessment assertion failed: ${assertion.id}`,
    );
  }
}
