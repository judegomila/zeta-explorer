/**
 * @module imp-34648-plateau-drift-large-dp-truncation-sweet-spot
 * @fileoverview imp-34648 -- MEASUREMENT ONLY: locate the intermediate finite-difference step (dp)
 *   bracket that MAXIMIZES the resolved 2nd-order truncation exponent of the imp-34630 large-dp drift
 *   arm. imp-34630 F1 found the D_inf-free triple-ratio local order of the 2nd-order q3-share drift
 *   climbing toward the predicted 2 -- ~1.74 on the r = 2 triple {6e-2, 1.2e-1, 2.4e-1} and ~1.94 on
 *   {7.5e-2, 1.5e-1, 3e-1} -- but NEVER reaching 2, reading the shortfall as "higher-order
 *   contamination that only clears as dp -> 0" (which re-enters the imp-34630 F3 roundoff valley).
 *   imp-34630 measured only those two coarse brackets. This module sweeps the local order across a FINE
 *   geometric dp grid and pins the bracket where the resolved exponent is closest to 2, quantifying the
 *   truncation/roundoff sweet spot and comparing it to the imp-34587 Richardson node.
 *
 *   METHOD (D_inf-free local order estimate, imp-34630 primitives VERBATIM)
 *   ---------------------------------------------------------------------
 *   Reusing the imp-34611/imp-34630 2nd-order 5-point q3-share stencil and drift definition VERBATIM
 *   (reproduced inline; imports NOTHING), the residual drift is modelled as
 *   drift(dp) = D_inf + A dp^2 + higher order. For a geometric triple {dp, r dp, r^2 dp} the additive
 *   D_inf cancels in the successive-difference ratio
 *     rho = [drift(r^2 dp) - drift(r dp)] / [drift(r dp) - drift(dp)] = r^k (+ higher order),
 *   so the LOCAL order k = ln(rho)/ln(r) needs no knowledge of the plateau value D_inf. We evaluate k
 *   on a FINE geometric grid of r = 2 anchors (step 2^(1/12)) across dp = 3.5e-2 .. 1.05e-1 -- finer
 *   than imp-34630 two coarse brackets -- and select the anchor argmin over |k - 2|.
 *
 *   THE FINDING (the sweet spot is a BROAD dp ~ 7e-2 plateau at exactly 2, NOT the imp-34587 node)
 *   --------------------------------------------------------------------------------------------
 *   (F1) THE RESOLVED 2nd-ORDER EXPONENT REACHES 2 AT dp ~ 7e-2. The imp-34630 coarse brackets are
 *        reproduced (6e-2 -> ~1.74, 7.5e-2 -> ~1.94), and on the fine grid the local order lands
 *        essentially exactly on the predicted 2 at the r = 2 triple anchored at dp ~ 7.0e-2
 *        ({7e-2, 1.4e-1, 2.8e-1}), where k ~ 2.0006 (|k - 2| ~ 6e-4). So imp-34630 ~1.94 shortfall was
 *        simply that its topmost measured bracket (anchor 7.5e-2) sat just BELOW the sweet spot; a
 *        slightly larger anchor lands the resolved exponent ON 2. The O(dp^2) truncation IS fully
 *        resolvable within the accessible large-dp arm -- one does NOT have to push dp -> 0.
 *   (F2) THE SWEET SPOT IS A BROAD PLATEAU NEAR 2, NOT A SHARP INTERIOR PEAK. Across dp ~ 7e-2 .. 1e-1
 *        the local order stays within ~1.98 .. 2.05 with NO upturn toward 4 -- the higher-order O(dp^4)
 *        contamination stays below the noise floor across the whole reachable arm (consistent with
 *        imp-34630 F2, which found the 4th-order truncation undetectable). Below dp ~ 3.5e-2 the order
 *        estimate is noise (NaN / negative) -- the imp-34630 F3 roundoff valley. So the sweet spot is
 *        bounded below by the roundoff valley (< ~3.5e-2) and NOT bounded above by a resolvable
 *        contamination ceiling within reach. This REFINES imp-34630 F1 stated mechanism: the approach
 *        to 2 is from BELOW as dp GROWS (1.74 -> 1.94 -> 2.00), i.e. lingering small-dp conditioning
 *        being shed, NOT higher-order contamination (which would push k AWAY from 2 at large dp).
 *   (F3) THE SWEET SPOT DOES NOT COINCIDE WITH THE imp-34587 RICHARDSON NODE. The dp ~ 7e-2 truncation
 *        sweet spot of the large-dp arm sits ~23x ABOVE the imp-34587 optimal/Richardson step
 *        dp ~ 3e-3 (the well-conditioned node imp-34587 extrapolated from). The two live on different
 *        dp scales by construction: imp-34587 works the well-conditioned SMALL-dp step of the
 *        drift-MAGNITUDE observable, while the imp-34630 large-dp arm deliberately sits ABOVE the
 *        roundoff valley on a much coarser step. So the truncation sweet spot of the large-dp arm is a
 *        distinct, coarser optimum -- it is NOT the imp-34587 node.
 *
 *   MEASUREMENT ONLY. This re-aggregates the already-certified imp-34611/imp-34630 decomposition through
 *   a finer local scaling-exponent grid; it changes NO bound. Reproduces the
 *   imp-34446/imp-34531/imp-34543/imp-34573 primitives inline (imports NOTHING -- no
 *   lambda-rh-height-mapping, no polymath15 constant module, no zeros bundle), following the
 *   no-heavy-imports directive. q1,q2,q3 are inherited central differences, NOT fresh analytic closed
 *   forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is
 *   inherited as-is (this locates a sweet spot ON that regime, it does not rehabilitate it). The -2
 *   asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb
 *   GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; the inherited surrogate
 *   is NOT rigorous; no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34630-plateau-drift-large-dp-scaling-order.js (the 2nd-order arm order ~1.94, sharpened here)
 *   @see imp-34611-plateau-drift-independent-stencil-crosscheck.js (q3-share stencils reproduced verbatim)
 *   @see imp-34587-drift-share-drift-richardson-dp-extrapolation.js (the dp ~ 3e-3 Richardson node compared)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma < 0.01)
 *
 *   Ticket: imp-34648 (numerical, medium). Fine-grid truncation sweet-spot locator; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34573 primitives (imports NOTHING),
//    reproduced VERBATIM from imp-34630 so the stencil and q3-share are identical: --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- the mid/deep boundary

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

function eColl(N) {
  return C_C * Math.sqrt(Math.log(heightForN(N)) / N);
}

const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N

// imp-34611/imp-34630 2nd-order 5-point central-difference q3-share (verbatim; q1^2 cancels).
function share2nd(N, dp) {
  const p = Math.log(N);
  const f0 = qOfP(p);
  const fp = qOfP(p + dp);
  const fm = qOfP(p - dp);
  const fpp = qOfP(p + 2 * dp);
  const fmm = qOfP(p - 2 * dp);
  const q2 = (fp - 2 * f0 + fm) / (dp * dp);
  const q3 = (fpp - 2 * fp + 2 * fm - fmm) / (2 * dp * dp * dp);
  return q3 / 6 / (-q2 / 2 + q3 / 6);
}

// Same MID/DEEP landmark partition and drift as imp-34573/imp-34587/imp-34611/imp-34630.
const MID_LADDER = [Math.pow(10, 12.0), Math.pow(10, 12.5), Math.pow(10, 13.0), Math.pow(10, 13.333)];
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];

const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;

function driftAt(dp) {
  const midMean = mean(MID_LADDER.map((N) => share2nd(N, dp)));
  const deepMean = mean(DEEP_LADDER.map((N) => share2nd(N, dp)));
  return (deepMean - midMean) / midMean;
}

// D_inf-free local order estimate on a geometric triple {a, ra, r^2 a} (imp-34630 verbatim):
//   rho = [drift(r^2 a) - drift(r a)] / [drift(r a) - drift(a)]  ->  r^k, so order = ln(rho)/ln(r).
// Returns NaN when rho <= 0 (non-monotone / sign-indefinite -> no single power law here).
function localOrder(a, r) {
  const da = driftAt(a);
  const db = driftAt(r * a);
  const dc = driftAt(r * r * a);
  const rho = (dc - db) / (db - da);
  return rho > 0 ? Math.log(rho) / Math.log(r) : NaN;
}

const PREDICTED_ORDER = 2; // O(dp^2) truncation of the 2nd-order 5-point stencil
const R = 2; // geometric triple ratio (matches imp-34630 arm)

// (F1) reproduce the imp-34630 two coarse brackets so the sharpening is anchored to their finding.
const ORDER_6e2 = localOrder(6e-2, R); // ~1.739 (imp-34630 F1 triple {6e-2, 1.2e-1, 2.4e-1})
const ORDER_7p5e2 = localOrder(7.5e-2, R); // ~1.938 (imp-34630 F1 triple {7.5e-2, 1.5e-1, 3e-1})

// FINE geometric anchor grid (step 2^(1/12)) across dp = 3.5e-2 .. ~1.05e-1 -- finer than imp-34630.
const ANCHOR_GRID = (() => {
  const g = [];
  for (let a = 3.5e-2; a <= 1.06e-1; a *= Math.pow(2, 1 / 12)) g.push(a);
  return g;
})();

// Sweep the local order over the fine grid and select the anchor argmin over |order - 2|.
const GRID_ROWS = ANCHOR_GRID.map((a) => {
  const o = localOrder(a, R);
  return { anchor: a, order: o, dist: Number.isFinite(o) ? Math.abs(o - PREDICTED_ORDER) : Infinity };
});

const SWEET = GRID_ROWS.reduce((best, row) => (row.dist < best.dist ? row : best), {
  anchor: NaN,
  order: NaN,
  dist: Infinity,
});
const SWEET_ANCHOR = SWEET.anchor; // ~7.0e-2 -- span {7e-2, 1.4e-1, 2.8e-1}
const SWEET_ORDER = SWEET.order; // ~2.0006 -- essentially exactly the predicted 2
const SWEET_DIST = SWEET.dist; // ~6e-4

// (F2) plateau check: across dp ~ 7e-2 .. 1e-1 the order stays near 2 with no upturn toward 4.
const PLATEAU_ANCHORS = GRID_ROWS.filter((r) => r.anchor >= 6.8e-2 && r.anchor <= 1.02e-1);
const PLATEAU_ORDERS = PLATEAU_ANCHORS.map((r) => r.order).filter((o) => Number.isFinite(o));
const PLATEAU_MAX = Math.max(...PLATEAU_ORDERS); // ~2.05 (no upturn toward 4)
const PLATEAU_MIN = Math.min(...PLATEAU_ORDERS); // ~1.98

// (F2) roundoff valley below dp ~ 3.4e-2: the order estimate is noise (NaN / negative).
const VALLEY_STEPS = (() => {
  const g = [];
  for (let a = 1.5e-2; a < 3.4e-2; a *= Math.pow(2, 1 / 6)) g.push(a);
  return g;
})();
const VALLEY_ORDERS = VALLEY_STEPS.map((a) => localOrder(a, R));
const VALLEY_IS_NOISE = VALLEY_ORDERS.every((o) => !(Number.isFinite(o) && o > 1.5)); // no clean ~2

// (F3) compare the sweet spot to the imp-34587 Richardson node (its optimal/extrapolated step ~ 3e-3).
const IMP34587_RICHARDSON_NODE_DP = 3e-3; // midpoint of imp-34587 (2e-3, 4e-3) truncation pair
const SWEET_VS_34587_NODE_RATIO = SWEET_ANCHOR / IMP34587_RICHARDSON_NODE_DP; // ~23x above the node

export const IMP34648_PLATEAU_DRIFT_LARGE_DP_TRUNCATION_SWEET_SPOT = Object.freeze({
  id: 'imp-34648',
  proofSection: 'S-frontier',
  claim_measured:
    'Sweep the D_inf-free local scaling exponent of the imp-34630 2nd-order q3-share large-dp drift ' +
    'arm across a FINE geometric dp grid and locate the bracket where the resolved 2nd-order ' +
    'truncation exponent is closest to the predicted 2, quantifying the truncation/roundoff sweet ' +
    'spot and comparing it to the imp-34587 Richardson node -- a fine-grid locator on the inherited ' +
    'component model, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  method: 'D_inf-free geometric-triple order rho = ln([d3-d2]/[d2-d1])/ln(r), r = 2; argmin over |order - 2|',
  predicted_order: PREDICTED_ORDER,
  order_at_6e2_imp34630: +ORDER_6e2.toFixed(4), // ~1.739 (reproduces imp-34630 F1)
  order_at_7p5e2_imp34630: +ORDER_7p5e2.toFixed(4), // ~1.938 (reproduces imp-34630 F1)
  fine_grid_step: '2^(1/12)',
  fine_grid_range_dp: Object.freeze([+(3.5e-2).toExponential(2), +(1.06e-1).toExponential(2)]),
  sweet_spot_anchor_dp: +SWEET_ANCHOR.toExponential(4), // ~7.000e-2
  sweet_spot_triple_span_dp: Object.freeze([
    +SWEET_ANCHOR.toExponential(2),
    +(R * SWEET_ANCHOR).toExponential(2),
    +(R * R * SWEET_ANCHOR).toExponential(2),
  ]), // ~{7e-2, 1.4e-1, 2.8e-1}
  sweet_spot_resolved_order: +SWEET_ORDER.toFixed(6), // ~2.000625 -- essentially exactly 2
  sweet_spot_dist_from_2: +SWEET_DIST.toExponential(3), // ~6.25e-4
  plateau_order_min: +PLATEAU_MIN.toFixed(4), // ~1.98 (broad plateau near 2)
  plateau_order_max: +PLATEAU_MAX.toFixed(4), // ~2.05 (no upturn toward 4)
  roundoff_valley_below_dp: +(3.4e-2).toExponential(2), // below ~3.4e-2 the order is noise
  roundoff_valley_is_noise: VALLEY_IS_NOISE, // true -> no clean ~2 in the valley
  imp34587_richardson_node_dp: +IMP34587_RICHARDSON_NODE_DP.toExponential(2), // 3e-3
  sweet_spot_vs_imp34587_node_ratio: +SWEET_VS_34587_NODE_RATIO.toFixed(1), // ~23.3x above the node
  sweet_spot_coincides_with_imp34587_node: SWEET_VS_34587_NODE_RATIO < 3, // false -> distinct optima
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Fine geometric-grid locator of the intermediate dp bracket that ' +
    'maximizes the resolved 2nd-order truncation exponent of the imp-34630 large-dp q3-share drift arm ' +
    '[2nd-order 5-point q3-share of C_th, deep = N >= N* ~ 4.62e13 vs mid = N < N*, D_inf-free triple ' +
    'ratio order = ln([d3-d2]/[d2-d1])/ln(r), r = 2]. (F1) The imp-34630 coarse brackets are ' +
    'reproduced (6e-2 -> ~1.74, 7.5e-2 -> ~1.94), and on the fine grid the local order lands ' +
    'essentially exactly on the predicted 2 at the triple anchored at dp ~ 7.0e-2 ({7e-2, 1.4e-1, ' +
    '2.8e-1}), order ~2.0006 (|order - 2| ~ 6e-4). So imp-34630 ~1.94 shortfall was merely its topmost ' +
    'bracket (anchor 7.5e-2) sitting just below the sweet spot; a slightly larger anchor lands the ' +
    'resolved exponent ON 2 -- the O(dp^2) truncation IS fully resolvable within the accessible ' +
    'large-dp arm, without pushing dp -> 0. (F2) The sweet spot is a BROAD PLATEAU near 2, not a sharp ' +
    'interior peak: across dp ~ 7e-2 .. 1e-1 the order stays within ~1.98 .. 2.05 with NO upturn toward ' +
    '4 (the O(dp^4) contamination stays below the noise floor, consistent with imp-34630 F2), while ' +
    'below dp ~ 3.5e-2 the order estimate is noise (NaN / negative) -- the imp-34630 F3 roundoff ' +
    'valley. So the sweet spot is bounded below by the roundoff valley and NOT bounded above by any ' +
    'resolvable contamination ceiling within reach; the approach to 2 is from BELOW as dp GROWS ' +
    '(1.74 -> 1.94 -> 2.00), i.e. lingering small-dp conditioning being shed, REFINING imp-34630 F1 ' +
    '"contamination clears as dp -> 0" mechanism. (F3) The dp ~ 7e-2 sweet spot does NOT coincide with ' +
    'the imp-34587 Richardson node dp ~ 3e-3 -- it sits ~23x ABOVE it. The two live on different dp ' +
    'scales by construction: imp-34587 works the well-conditioned small-dp step of the drift-MAGNITUDE ' +
    'observable, while the imp-34630 large-dp arm deliberately sits above the roundoff valley on a much ' +
    'coarser step, so the truncation sweet spot of the large-dp arm is a distinct, coarser optimum. ' +
    'q1,q2,q3 are inherited central differences, NOT fresh analytic closed forms, so the sigma -> 1 ' +
    'deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is inherited as-is -- this ' +
    'locates a sweet spot ON that regime, it does not rehabilitate it. The -2 asymptote and ' +
    'C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share ' +
    'per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; the inherited surrogate is NOT rigorous; ' +
    'changes no bound; no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34630 (2nd-order large-dp arm order ~1.94, sharpened here); imp-34611 (q3-share stencils ' +
    'reproduced verbatim); imp-34587 (Richardson node dp ~ 3e-3, compared); imp-34573 (deep-tail ' +
    'q3-share error, 2nd-order stencil); imp-34543 (q2/q3 shares as ladder aggregates); imp-34531 ' +
    '(F2 O(h^2) coefficient certification); imp-34446 (central-difference exponent); imp-33620 ' +
    '(deep-tail landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34648_ASSERTIONS = [
  {
    id: 'imp34648-reproduces-imp34630-coarse-brackets',
    holds: () =>
      Number.isFinite(ORDER_6e2) &&
      Number.isFinite(ORDER_7p5e2) &&
      ORDER_6e2 > 1.6 &&
      ORDER_6e2 < 1.85 &&
      ORDER_7p5e2 > 1.85 &&
      ORDER_7p5e2 < 2.0 &&
      ORDER_7p5e2 > ORDER_6e2, // order climbs toward 2 as dp grows
    why: 'F1: the imp-34630 F1 coarse brackets are reproduced (6e-2 -> ~1.74, 7.5e-2 -> ~1.94), the order climbing toward 2 as dp grows.',
  },
  {
    id: 'imp34648-sweet-spot-hits-2',
    holds: () =>
      Number.isFinite(SWEET_ORDER) &&
      SWEET_DIST < 5e-3 && // resolved exponent within ~0.005 of the predicted 2
      SWEET_ANCHOR > 5e-2 &&
      SWEET_ANCHOR < 1e-1, // an intermediate large-dp anchor, above the valley, below the top edge
    why: 'F1: on the fine grid the resolved 2nd-order exponent lands within ~0.005 of 2 at an intermediate anchor dp ~ 7e-2 -- the sweet spot imp-34630 two coarse brackets missed.',
  },
  {
    id: 'imp34648-broad-plateau-no-upturn',
    holds: () =>
      PLATEAU_ORDERS.length >= 3 &&
      PLATEAU_MIN > 1.9 &&
      PLATEAU_MAX < 2.3 && // stays near 2 across dp ~ 7e-2..1e-1, no upturn toward 4
      VALLEY_IS_NOISE, // and below ~3.4e-2 the order is noise (the roundoff valley)
    why: 'F2: the sweet spot is a broad plateau near 2 (dp ~ 7e-2..1e-1, order ~1.98..2.05, no upturn toward 4) bounded below by the roundoff valley (< ~3.4e-2 is noise), not a sharp interior peak.',
  },
  {
    id: 'imp34648-sweet-spot-not-imp34587-node',
    holds: () =>
      SWEET_VS_34587_NODE_RATIO > 10 && // sweet spot sits well above the imp-34587 dp ~ 3e-3 node
      IMP34648_PLATEAU_DRIFT_LARGE_DP_TRUNCATION_SWEET_SPOT.sweet_spot_coincides_with_imp34587_node === false,
    why: 'F3: the dp ~ 7e-2 truncation sweet spot sits ~23x above the imp-34587 Richardson node dp ~ 3e-3 -- a distinct, coarser optimum, not the same node.',
  },
  {
    id: 'imp34648-honesty-gate-no-qed',
    holds: () =>
      IMP34648_PLATEAU_DRIFT_LARGE_DP_TRUNCATION_SWEET_SPOT.isRigorous === false &&
      /NO QED/.test(IMP34648_PLATEAU_DRIFT_LARGE_DP_TRUNCATION_SWEET_SPOT.verdict) &&
      /refereed bound is changed/i.test(IMP34648_PLATEAU_DRIFT_LARGE_DP_TRUNCATION_SWEET_SPOT.verdict) &&
      /UNTOUCHED/.test(IMP34648_PLATEAU_DRIFT_LARGE_DP_TRUNCATION_SWEET_SPOT.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34648_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34648-plateau-drift-large-dp-truncation-sweet-spot assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34648_PLATEAU_DRIFT_LARGE_DP_TRUNCATION_SWEET_SPOT;
