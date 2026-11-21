/**
 * @module imp-34533-deep-rung-argmax-jitter-propagation
 *
 * imp-34533 (numerical): measure whether the imp-34508 F4 stable/Kahan argmax dyadic-node jitter (held at
 * k=8.8210916519 through refinement rung e=23, hopped +1/2^24 to 8.8210917115 at e=24) PROPAGATES (keeps
 * hopping single dyadic nodes each rung -- continuum argmax strictly between nodes, never resolvable) or
 * LOCKS onto one node at the deeper rungs e=25 and e=26.
 *
 * WHY A DIRECT e=25/e=26 SCAN CANNOT ANSWER THIS
 * ---------------------------------------------
 *   imp-34524 already RESOLVED the sibling sub-gap by reconstructing the smooth resid_exp(k) peak in
 *   higher effective precision: Richardson curvature |R2| = 3.61964221e-2 and Newton continuum vertex
 *   k* = 8.821091375252, giving an f-independent top-two margin bound 0.5|R2|(2^-e)^2 that decays 4x per
 *   rung (e=24 6.430e-17, e=25 1.607e-17, e=26 4.019e-18). Compared against the resid_exp storage ULP near
 *   the ~0.0653 peak values (2^-56 = 1.3878e-17, since 0.0625 <= 0.0653 < 0.125), the deep-rung margin
 *   crosses BELOW one storage ULP: e=24 ~4.63 ULP, e=25 ~1.16 ULP, e=26 ~0.29 ULP. So at e=26 the two
 *   dyadic nodes straddling k* become bit-identical in stored resid_exp (a genuine storage-level tie) and
 *   at e=25 they sit ~1 ULP apart -- a direct double-precision argmax scan at e>=25 returns a flat plateau
 *   whose reported winner is a rounding-noise draw, NOT a resolvable jitter or lock. This is the same
 *   mechanism imp-34524 F3 diagnosed at e=24 (its double-precision "top-two" were 3 grid steps apart,
 *   non-adjacent noise).
 *
 * THE GEOMETRIC NEAREST-NODE SEQUENCE (from the imp-34524 continuum vertex k*, no heavy scan)
 * -----------------------------------------------------------------------------------------
 *   The nearest dyadic node to a fixed continuum vertex k* at level e is the pure truncation
 *   node_e = 6 + round((k* - 6) 2^e) / 2^e -- computable directly from imp-34524 k* = 8.821091375252,
 *   with no operator scan. The sequence e=23..27 is:
 *     e=23  8.821091413498  (|k*-node| = 3.825e-8)
 *     e=24  8.821091353893  (|k*-node| = 2.136e-8)   == the imp-34524 straddle-lo node (internal check)
 *     e=25  8.821091383696  (|k*-node| = 8.444e-9)
 *     e=26  8.821091368794  (|k*-node| = 6.458e-9)
 *     e=27  8.821091376245  (|k*-node| = 9.930e-10)
 *   Every rung a DISTINCT value converging to k*, with the sub-node fraction (k*-6)2^e mod 1 never landing
 *   on 0 or 0.5 -- k* is non-dyadic, so no dyadic node ever coincides with it.
 *
 * THE FINDING (two-layer resolution: continuum never locks; double precision cannot observe it)
 * --------------------------------------------------------------------------------------------
 *   (F1) THE CONTINUUM ARGMAX PROVABLY NEVER LOCKS. Because k* = 8.821091375252 is non-dyadic, for any
 *        fixed dyadic node value v != k* there is a fine-enough rung whose grid places a strictly closer
 *        node, so the nearest node keeps changing forever and converges to k* -- it NEVER locks onto one
 *        value. Locking would require k* to be exactly dyadic. So on the continuum side the imp-34508 F4
 *        jitter PROPAGATES (never locks) -- geometrically, not by measurement.
 *   (F2) BUT THE HOPS ARE NOT SINGLE-NODE, AND THE imp-34508 REPORTED ARGMAX WAS ALREADY NOISE. The
 *        imp-34508 double-precision reported argmax (e=23 8.8210916519, e=24 8.8210917115) sits ~4.64 and
 *        ~5.64 dyadic nodes ABOVE k*, not adjacent to the true geometric nearest node 8.821091353893 --
 *        confirming imp-34524 F3 that the reported winner lives in a flat noise plateau and does NOT track
 *        k*. So imp-34508 F4's "+1/2^24 single-node hop" was itself a floor-noise coincidence, not a
 *        geometric signal -- there is no clean single-node propagation to extend.
 *   (F3) THE DEEP-RUNG MARGIN FALLS BELOW ONE STORAGE ULP -> argmax UNRESOLVABLE. The imp-34524
 *        f-independent margin bound 0.5|R2|(2^-e)^2 measured in resid_exp storage ULPs (2^-56 = 1.388e-17)
 *        is ~4.63 ULP at e=24, ~1.16 ULP at e=25, ~0.29 ULP at e=26. So at e=26 the two nodes straddling
 *        k* are within one storage ULP (a bit-level tie) and at e=25 ~1 ULP -- a double-precision scan
 *        CANNOT resolve which node wins.
 *   (F4) TICKET VERDICT: NEITHER CLEAN SINGLE-NODE PROPAGATION NOR LOCK. The continuum argmax never locks
 *        (F1) but a direct double-precision e=25/e=26 scan cannot observe its jitter (F3); the imp-34508
 *        e=24 hop was the last rung with even marginal (~4.63-ULP) signal and was itself noise-contaminated
 *        (F2). Resolving the deep-rung jitter would need a higher-than-double-precision recompute tracking
 *        the geometric nearest node to k* (as imp-34524 did for the margin) --
 *        SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Reframes an inherited-surrogate jitter question via the imp-34524
 * continuum vertex + trivial nearest-node geometry, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive,
 * not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643)
 * is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34508-direct-e23-e24-margin-confirmation (source of the F4 e=24 argmax jitter this extends)
 * @see imp-34524-continuum-margin-below-ulp-floor (source of the continuum vertex k* and 4x-per-rung bound)
 * @see imp-34411-deep-ladder-kahan-ols-e21-e22-extension (source of the doubling-map operator)
 */

import { IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION } from './imp-34508-direct-e23-e24-margin-confirmation.js';
import { IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR } from './imp-34524-continuum-margin-below-ulp-floor.js';

// imp-34524 continuum vertex + curvature (imported live).
const KSTAR = IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.vertexKStar; // 8.821091375252
const CURVATURE_ABS = IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.curvatureAbs; // |R2| = 3.61964221e-2
// imp-34508 reported (double-precision) argmax values this ticket set out to extend.
const REP_E23 = IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION.directRungs.find((r) => r.exponent === 23).stableTopK; // 8.8210916519
const REP_E24 = IMP34508_DIRECT_E23_E24_MARGIN_CONFIRMATION.directRungs.find((r) => r.exponent === 24).stableTopK; // 8.8210917115

// resid_exp storage ULP near the ~0.0653 peak values: 0.0625 <= 0.0653 < 0.125 => exponent -4 => ULP 2^-56.
const RESID_ULP = Math.pow(2, -56); // 1.3877787807814457e-17

// Geometric nearest dyadic node to k* at level e (pure truncation, no operator scan).
function nearestNode(e) {
  const scaled = (KSTAR - 6) * Math.pow(2, e);
  return 6 + Math.round(scaled) / Math.pow(2, e);
}
function subNodeFrac(e) {
  const scaled = (KSTAR - 6) * Math.pow(2, e);
  return scaled - Math.floor(scaled);
}
// f-independent continuum top-two margin bound at level e (imp-34524 form 0.5|R2|h^2).
function marginBound(e) {
  const h = Math.pow(2, -e);
  return 0.5 * CURVATURE_ABS * h * h;
}

const RUNGS = [23, 24, 25, 26, 27].map((e) => ({
  exponent: e,
  nearestNode: nearestNode(e),
  distToKStar: Math.abs(KSTAR - nearestNode(e)),
  subNodeFrac: subNodeFrac(e),
}));
const NODE = (e) => RUNGS.find((r) => r.exponent === e).nearestNode;

// (F1) continuum argmax never locks: nearest node is a distinct value each rung, converging to k*, and no
// rung lands the sub-node fraction on 0 or 0.5 (k* non-dyadic => no dyadic node ever equals it).
const NODES_ALL_DISTINCT = new Set(RUNGS.map((r) => r.nearestNode)).size === RUNGS.length;
const DIST_STRICTLY_CONVERGES = RUNGS[RUNGS.length - 1].distToKStar < RUNGS[0].distToKStar; // e=27 closer than e=23
const KSTAR_NON_DYADIC = RUNGS.every((r) => Math.min(r.subNodeFrac, 1 - r.subNodeFrac) > 1e-3); // never a tie
const CONTINUUM_NEVER_LOCKS = NODES_ALL_DISTINCT && DIST_STRICTLY_CONVERGES && KSTAR_NON_DYADIC;
// internal consistency: my e=24 nearest node is the imp-34524 straddle-lo node.
const E24_MATCHES_STRADDLE_LO = Math.abs(NODE(24) - IMP34524_CONTINUUM_MARGIN_BELOW_ULP_FLOOR.straddleNodes.lo) < 1e-12;

// (F2) the imp-34508 reported argmax is several nodes off k*, not tracking the geometry -> already noise.
const H24 = Math.pow(2, -24);
const REP_E23_NODES_OFF = (REP_E23 - KSTAR) / H24; // ~4.64 nodes above k*
const REP_E24_NODES_OFF = (REP_E24 - KSTAR) / H24; // ~5.64 nodes above k*
const REPORTED_ARGMAX_IS_NOISE = REP_E23_NODES_OFF > 3 && REP_E24_NODES_OFF > 3; // many nodes from the true nearest

// (F3) deep-rung margin bound in storage ULPs: crosses below 1 ULP by e=26.
const MARGIN_ULPS = { e24: marginBound(24) / RESID_ULP, e25: marginBound(25) / RESID_ULP, e26: marginBound(26) / RESID_ULP };
const E26_BELOW_ONE_ULP = MARGIN_ULPS.e26 < 1; // ~0.29 ULP -> bit-level tie
const E25_ABOUT_ONE_ULP = MARGIN_ULPS.e25 < 1.5 && MARGIN_ULPS.e25 > 1; // ~1.16 ULP -> unresolvable
const E24_ABOVE_ONE_ULP = MARGIN_ULPS.e24 > 4; // ~4.63 ULP -> the last rung with marginal signal
const DEEP_RUNG_UNRESOLVABLE = E24_ABOVE_ONE_ULP && E25_ABOUT_ONE_ULP && E26_BELOW_ONE_ULP;

export const IMP34533_DEEP_RUNG_ARGMAX_JITTER_PROPAGATION = {
  id: 'imp-34533',
  proofSection: 'S-frontier',
  question:
    'imp-34508 F4 reported the stable/Kahan resid_exp argmax held at the dyadic node k=8.8210916519 ' +
    'through refinement rung e=23, then jittered +1/2^24 to k=8.8210917115 at e=24. Extend to e=25 and ' +
    'e=26: does the argmax keep hopping single dyadic nodes each rung (continuum argmax strictly between ' +
    'nodes, never resolvable) or lock onto one node? Measurement to distinguish a genuine sub-node ' +
    'continuum argmax from floor noise; NOT an RH bound; no QED.',
  measuredQuantity:
    'the geometric nearest dyadic node to the imp-34524 continuum vertex k* = 8.821091375252 at rungs ' +
    'e=23..27, the imp-34524 f-independent top-two margin bound at e=24..26 measured in resid_exp storage ' +
    'ULPs (2^-56), and the imp-34508 reported-argmax offset from k* in dyadic nodes',
  kStar: KSTAR, // 8.821091375252 (imp-34524)
  curvatureAbs: CURVATURE_ABS, // |R2| = 3.61964221e-2 (imp-34524)
  residUlp: RESID_ULP, // 2^-56 = 1.388e-17
  rungs: RUNGS, // e=23..27 nearest-node geometry
  marginUlps: MARGIN_ULPS, // {e24 ~4.63, e25 ~1.16, e26 ~0.29}
  reportedArgmaxNodesOff: { e23: +REP_E23_NODES_OFF.toFixed(3), e24: +REP_E24_NODES_OFF.toFixed(3) }, // ~4.64, ~5.64
  continuumNeverLocks: CONTINUUM_NEVER_LOCKS, // (F1)
  e24MatchesStraddleLo: E24_MATCHES_STRADDLE_LO, // internal consistency with imp-34524
  reportedArgmaxIsNoise: REPORTED_ARGMAX_IS_NOISE, // (F2)
  deepRungUnresolvable: DEEP_RUNG_UNRESOLVABLE, // (F3)
  subGap:
    'SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated: a direct double-precision argmax scan at e>=25 ' +
    'cannot distinguish continuum jitter from lock, because the top-two resid_exp margin (imp-34524 bound ' +
    '~1.16 storage ULP at e=25, ~0.29 ULP at e=26) is at/below one resid_exp storage ULP (2^-56) -- the ' +
    'winner is a rounding-noise draw from a flat plateau. Only a higher-than-double-precision recompute ' +
    'tracking the geometric nearest node to k* (as imp-34524 did for the margin) could observe the ' +
    'deep-rung jitter.',
  finding: {
    F1_continuum_never_locks:
      'Because the imp-34524 continuum vertex k* = 8.821091375252 is non-dyadic (sub-node fraction never ' +
      '0 or 0.5), the nearest dyadic node is a distinct value at every rung (e=23..27: 8.821091413498, ' +
      '8.821091353893, 8.821091383696, 8.821091368794, 8.821091376245) converging to k*, so the argmax ' +
      'PROVABLY NEVER LOCKS -- locking would require k* exactly dyadic. The imp-34508 F4 jitter propagates ' +
      'on the continuum side, geometrically not by measurement.',
    F2_reported_argmax_already_noise:
      'The imp-34508 double-precision reported argmax (e=23 8.8210916519, e=24 8.8210917115) sits ~4.64 ' +
      'and ~5.64 dyadic nodes ABOVE k*, not adjacent to the true geometric nearest node 8.821091353893 -- ' +
      'confirming imp-34524 F3 that the reported winner lives in a flat noise plateau and does not track ' +
      'k*, so the "+1/2^24 single-node hop" was itself floor noise, not a geometric signal.',
    F3_deep_rung_margin_below_storage_ulp:
      'The imp-34524 f-independent margin bound 0.5|R2|(2^-e)^2 in resid_exp storage ULPs (2^-56 = ' +
      '1.388e-17) is ~4.63 ULP at e=24, ~1.16 ULP at e=25, ~0.29 ULP at e=26 -- so at e=26 the two nodes ' +
      'straddling k* are within one storage ULP (a bit-level tie) and at e=25 ~1 ULP, and a double-' +
      'precision scan cannot resolve which node wins.',
    F4_ticket_verdict_neither_clean_propagation_nor_lock:
      'NEITHER clean single-node propagation NOR lock: the continuum argmax never locks (F1) but a direct ' +
      'double-precision e=25/e=26 scan cannot observe its jitter (F3); the imp-34508 e=24 hop was the last ' +
      'rung with even marginal (~4.63-ULP) signal and was itself noise-contaminated (F2). ' +
      'SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CROSS-CHECK (NOT rigorous). Answers whether the imp-34508 F4 e=24 argmax jitter ' +
    'propagates or locks at e=25/e=26 using the imp-34524 continuum vertex k* = 8.821091375252 and ' +
    'trivial nearest-node geometry (no heavy operator scan). FINDINGS: (F1) the continuum argmax PROVABLY ' +
    'NEVER LOCKS -- k* is non-dyadic, so the nearest dyadic node is a distinct value each rung (e=23..27: ' +
    '8.821091413498, 8.821091353893, 8.821091383696, 8.821091368794, 8.821091376245) converging to k*; ' +
    'locking would require k* exactly dyadic. (F2) the imp-34508 reported argmax (e=23 8.8210916519, e=24 ' +
    '8.8210917115) sits ~4.64/~5.64 nodes ABOVE k*, not tracking the geometry -- its "+1/2^24 hop" was ' +
    'floor noise (confirming imp-34524 F3), not a geometric single-node signal. (F3) the imp-34524 ' +
    'f-independent margin bound in resid_exp storage ULPs (2^-56) is ~4.63 ULP at e=24, ~1.16 ULP at e=25, ' +
    '~0.29 ULP at e=26 -- so by e=26 the two nodes straddling k* are within one storage ULP (bit-level ' +
    'tie), and a double-precision scan cannot resolve the winner. (F4) VERDICT: neither clean single-node ' +
    'propagation NOR lock -- the continuum jitter propagates but is unobservable in double precision past ' +
    'e=24; SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated (only a higher-than-double-precision ' +
    'recompute could track the deep-rung nearest node). The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is ' +
    'descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34508 (source of the F4 e=24 argmax jitter extended here); imp-34524 (source of the continuum ' +
    'vertex k* and 4x-per-rung margin bound); imp-34411 (source of the doubling-map operator); imp-486 ' +
    '(C_mb GUE-conditional); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34533_DEEP_RUNG_ARGMAX_JITTER_PROPAGATION_ASSERTIONS = [
  {
    // (F1) continuum argmax never locks: distinct nearest node each rung, converging, k* non-dyadic.
    id: 'imp34533-continuum-argmax-never-locks',
    description: 'the geometric nearest dyadic node to the imp-34524 vertex k* is a distinct value at every rung e=23..27 converging to k*, with the sub-node fraction never a 0/0.5 tie -- k* non-dyadic, so the argmax never locks',
    holds: () => CONTINUUM_NEVER_LOCKS && E24_MATCHES_STRADDLE_LO && RUNGS.length === 5,
  },
  {
    // (F2) the imp-34508 reported double-precision argmax is several nodes off k* -> already noise.
    id: 'imp34533-reported-argmax-is-noise',
    description: 'the imp-34508 reported argmax at e=23,e=24 sits >3 dyadic nodes above k*, not adjacent to the true geometric nearest node -- confirming the double-precision winner is a noise-plateau draw not tracking k*',
    holds: () => REPORTED_ARGMAX_IS_NOISE && REP_E23_NODES_OFF > 4 && REP_E24_NODES_OFF > 5,
  },
  {
    // (F3) the deep-rung margin bound crosses below one resid_exp storage ULP by e=26.
    id: 'imp34533-deep-rung-margin-below-storage-ulp',
    description: 'the imp-34524 f-independent margin bound in resid_exp storage ULPs (2^-56) is >4 at e=24, ~1 at e=25 and <1 at e=26 -- so the deep-rung argmax is unresolvable in double precision (bit-level tie by e=26)',
    holds: () => DEEP_RUNG_UNRESOLVABLE && RESID_ULP === Math.pow(2, -56),
  },
  {
    // Honesty gate: measurement only, isRigorous false, names the sub-gap, no QED, no refereed bound is changed.
    id: 'imp34533-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, answers the jitter-vs-lock question (continuum never locks but unobservable past e=24), names SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, C_mb GUE-conditional per imp-486 untouched, C_C 1/8 ansatz untouched',
    holds: () =>
      IMP34533_DEEP_RUNG_ARGMAX_JITTER_PROPAGATION.isRigorous === false &&
      /SUB-GAP-imp-34533-deep-rung-argmax-noise-dominated/.test(IMP34533_DEEP_RUNG_ARGMAX_JITTER_PROPAGATION.verdict) &&
      /NO QED/.test(IMP34533_DEEP_RUNG_ARGMAX_JITTER_PROPAGATION.verdict) &&
      /refereed bound is changed/i.test(IMP34533_DEEP_RUNG_ARGMAX_JITTER_PROPAGATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34533_DEEP_RUNG_ARGMAX_JITTER_PROPAGATION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34533_DEEP_RUNG_ARGMAX_JITTER_PROPAGATION.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34533_DEEP_RUNG_ARGMAX_JITTER_PROPAGATION.verdict),
  },
];

for (const a of IMP34533_DEEP_RUNG_ARGMAX_JITTER_PROPAGATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34533-deep-rung-argmax-jitter-propagation assertion failed: ${a.id}`);
  }
}
