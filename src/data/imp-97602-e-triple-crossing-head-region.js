/**
 * @module imp-97602-e-triple-crossing-head-region
 *
 * imp-97602 (numerical, measurement): imp-97585 located the E_flow = E_trunc head
 * crossing (N ~ 1.597752e6, E_flow binding below it) but only ASSERTED -- did not
 * locate -- that the head region below it is "dominated in turn by the collision
 * term E_coll". This module maps all THREE pairwise crossings of the E(N)-bridge
 * terms across the head N in {1e2 .. 1.6e6} and pins which term is binding (largest)
 * in each sub-interval, characterising the head-side ordering of the bridge below
 * the Platt-Trudgian verified height.
 *
 * The three inherited imp-3406/imp-33582/imp-33601/imp-97520 sub-terms (identical
 * model, no re-derivation):
 *   E_trunc = 3.06e-5                              (N-independent fixed-strip route)
 *   E_flow  = C_F (log T0 / T0) e^{TC_A1}          (Gronwall flow, C_F = (log(T0/2pi)+1)/2pi)
 *   E_coll  = C_C sqrt(log T0 / N)                 (GUE-conditional collision, C_C 1/8 ansatz)
 * with T0 = effectiveHeightForN(N).
 *
 * THE ANSWER (the deliverable the ticket asks for)
 * ------------------------------------------------
 * Across the head N in {1e2 .. 1.6e6} the collision term E_coll is the BINDING
 * (largest) term at EVERY N -- the head-side of the bridge is collision-dominated
 * throughout, confirming imp-97585's asserted-but-unlocated claim. The head ladder:
 *
 *   N = 1e2   E_coll ~ 8.978e-2   E_flow ~ 1.695e-2   E_trunc = 3.06e-5   BIND E_coll
 *   N = 1e3   E_coll ~ 3.270e-2   E_flow ~ 5.222e-3   E_trunc = 3.06e-5   BIND E_coll
 *   N = 1e4   E_coll ~ 1.164e-2   E_flow ~ 1.239e-3   E_trunc = 3.06e-5   BIND E_coll
 *   N = 1e5   E_coll ~ 4.066e-3   E_flow ~ 2.477e-4   E_trunc = 3.06e-5   BIND E_coll
 *   N = 1e6   E_coll ~ 1.400e-3   E_flow ~ 4.399e-5   E_trunc = 3.06e-5   BIND E_coll
 *   N = 1.6e6 E_coll ~ 1.124e-3   E_flow ~ 3.057e-5   E_trunc = 3.06e-5   BIND E_coll
 *
 * There is NO triple-crossing point: the three terms never meet at a single N, and
 * the three pairwise crossings are widely separated -- with one absent entirely:
 *   (1) E_flow = E_trunc  at N ~ 1.597752e6  (the imp-97585 crossing; sits at the very
 *       upper edge of the head, and only swaps the SUBDOMINANT pair -- E_flow overtakes
 *       E_trunc for the 2nd/3rd rank; E_coll stays binding across it)
 *   (2) E_coll = E_trunc  at N ~ 3.280294e9  (the imp-33723/imp-97520 closed-form N_cross;
 *       far ABOVE the head, on the tail side -- this is where the binding term finally
 *       switches from E_coll to E_trunc)
 *   (3) E_flow = E_coll   NEVER: E_coll > E_flow at every N on 1e2 .. 1e12 (the ratio
 *       E_flow/E_coll peaks at ~1.888e-1 at N = 1e2 and falls; the collision term
 *       dominates the flow term uniformly, so no crossing exists).
 *
 * ORDERING TRANSITIONS (largest -> smallest), across the two real crossings:
 *   N < 1.597752e6            E_coll > E_flow > E_trunc
 *   1.597752e6 < N < 3.28e9   E_coll > E_trunc > E_flow   (flow=trunc crossing)
 *   N > 3.280294e9            E_trunc > E_coll > E_flow   (coll=trunc crossing)
 * So E_coll is binding for the whole head AND all the way up to N ~ 3.28e9; the head
 * region carries a single binding term (E_coll) with the flow/truncation reshuffle
 * happening only in the subdominant pair at the head's top edge.
 *
 * MEASUREMENT / VERIFICATION CROSS-CHECK ONLY on the inherited imp-3220/imp-3406
 * surrogate component model. C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8
 * ansatz (imp-2642/imp-2643) UNTOUCHED; changes no bound; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97585-eflow-etrunc-share-full-ladder (E_flow=E_trunc crossing; asserted E_coll head dominance)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (sigma(N)=E_coll/E_N landmark ladder, N_cross)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form N_cross = E_coll=E_trunc point)
 * @see imp-3406-sigma-highN-extrapolation (the inherited sigma(N) component model)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-97520 exactly

// EXACT inherited imp-97520 sub-terms (no re-derivation, no fresh model, no fresh constants).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_C 1/8 ansatz)
  return { T0, L, E_trunc: E_TRUNC_PT, E_flow, E_coll };
}

function bindingTerm(p) {
  if (p.E_coll >= p.E_flow && p.E_coll >= p.E_trunc) return 'E_coll';
  if (p.E_flow >= p.E_coll && p.E_flow >= p.E_trunc) return 'E_flow';
  return 'E_trunc';
}

// Head ladder N in {1e2 .. 1.6e6} with the binding term at each rung.
const HEAD_LADDER = [1e2, 1e3, 1e4, 1e5, 1e6, 1.6e6].map((N) => {
  const p = parts(N);
  return {
    N: +N.toExponential(2),
    E_trunc: +p.E_trunc.toExponential(4),
    E_flow: +p.E_flow.toExponential(4),
    E_coll: +p.E_coll.toExponential(4),
    binding: bindingTerm(p),
  };
});

// Bracketed log-N bisection for a pairwise crossing (returns null if no sign change).
function pairCross(diff, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  const fa = diff(Math.exp(a));
  const fb = diff(Math.exp(b));
  if (fa === 0) return lo;
  if (fb === 0) return hi;
  if (fa * fb > 0) return null; // no crossing in the bracket
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (diff(Math.exp(m)) * fa > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const dFlowTrunc = (N) => { const p = parts(N); return p.E_flow - p.E_trunc; };
const dCollTrunc = (N) => { const p = parts(N); return p.E_coll - p.E_trunc; };
const dFlowColl = (N) => { const p = parts(N); return p.E_flow - p.E_coll; };

const N_FLOW_EQ_TRUNC = pairCross(dFlowTrunc, 1e2, 1e9); // ~1.597752e6 (imp-97585 crossing)
const N_COLL_EQ_TRUNC = pairCross(dCollTrunc, 1e2, 1e12); // ~3.280294e9 (imp-33723 N_cross)
const N_FLOW_EQ_COLL = pairCross(dFlowColl, 1e2, 1e12); // null (E_coll > E_flow uniformly)

// Peak of E_flow/E_coll over the full ladder to certify E_coll dominates E_flow everywhere.
let maxFlowOverColl = 0;
let argmaxFlowOverColl = 0;
for (let e = 2; e <= 12 + 1e-9; e += 0.02) {
  const p = parts(Math.pow(10, e));
  const r = p.E_flow / p.E_coll;
  if (r > maxFlowOverColl) {
    maxFlowOverColl = r;
    argmaxFlowOverColl = Math.pow(10, e);
  }
}

// The head is collision-bound at every rung (the deliverable claim).
const headAllCollBound = HEAD_LADDER.every((r) => r.binding === 'E_coll');

export const IMP97602_E_TRIPLE_CROSSING_HEAD_REGION = {
  id: 'imp-97602',
  proofSection: 'S-frontier',
  title:
    'Map the E_flow/E_trunc/E_coll triple-crossing structure in the head region N < 1.6e6: ' +
    'locate all three pairwise crossings and identify the binding term in each sub-interval',
  isRigorous: false,
  model:
    'E_trunc = 3.06e-5 (N-independent); E_flow = C_F (log T0/T0) e^{TC_A1}, C_F = (log(T0/2pi)+1)/2pi; ' +
    'E_coll = C_C sqrt(log T0/N); T0 = effectiveHeightForN(N); exact inherited imp-97520 sub-terms.',
  headLadder: HEAD_LADDER,
  crossings: {
    N_flow_eq_trunc: +N_FLOW_EQ_TRUNC.toExponential(6), // ~1.597752e6 : subdominant swap at head top edge
    N_coll_eq_trunc: +N_COLL_EQ_TRUNC.toExponential(6), // ~3.280294e9 : binding term switches E_coll -> E_trunc
    N_flow_eq_coll: N_FLOW_EQ_COLL, // null : E_coll > E_flow uniformly, no crossing exists
    max_flow_over_coll: +maxFlowOverColl.toExponential(4), // ~1.888e-1 (< 1 everywhere)
    argmax_flow_over_coll: +argmaxFlowOverColl.toExponential(2), // ~1e2
  },
  binding: {
    head_all_E_coll: headAllCollBound, // true : E_coll binds the entire head
    ordering_below_1p6e6: 'E_coll > E_flow > E_trunc',
    ordering_1p6e6_to_3p28e9: 'E_coll > E_trunc > E_flow',
    ordering_above_3p28e9: 'E_trunc > E_coll > E_flow',
    no_triple_crossing: true, // the three terms never coincide at a single N
  },
  verdict:
    'Across the head N in {1e2 .. 1.6e6} the collision term E_coll is the binding (largest) E(N)-bridge ' +
    'term at every N -- the head-side of the bridge is collision-dominated throughout, confirming ' +
    'imp-97585. There is NO triple-crossing point: the three pairwise crossings are widely separated ' +
    'with one absent -- E_flow = E_trunc at N ~ 1.597752e6 (subdominant swap at the head top edge), ' +
    'E_coll = E_trunc at N ~ 3.280294e9 (where the binding term finally switches E_coll -> E_trunc, far ' +
    'above the head), and E_flow = E_coll NEVER (E_coll > E_flow uniformly, ratio peaks ~1.888e-1 at ' +
    'N = 1e2). So the head carries a single binding term E_coll all the way up to N ~ 3.28e9; only the ' +
    'subdominant flow/truncation pair reshuffles inside the head.',
  note:
    'Extends imp-97585 (which located only E_flow=E_trunc and asserted E_coll head dominance) by pinning ' +
    'all three pairwise crossings and the binding term across the head. Measurement / verification ' +
    'cross-check only on the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486; ' +
    'C_C 1/8 ansatz untouched; changes no bound; establishes no operator positivity; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
};

export const IMP97602_E_TRIPLE_CROSSING_HEAD_REGION_ASSERTIONS = [
  {
    id: 'imp97602-head-collision-bound',
    description: 'E_coll is the binding term at every head rung N in {1e2 .. 1.6e6}',
    holds: () => headAllCollBound === true,
  },
  {
    id: 'imp97602-flow-eq-trunc-crossing',
    description: 'E_flow = E_trunc crossing near N ~ 1.597752e6 (reproduces imp-97585)',
    holds: () =>
      N_FLOW_EQ_TRUNC !== null && Math.abs(N_FLOW_EQ_TRUNC / 1.597752e6 - 1) < 5e-3,
  },
  {
    id: 'imp97602-coll-eq-trunc-crossing',
    description: 'E_coll = E_trunc crossing near N ~ 3.280294e9 (reproduces imp-33723 N_cross, above the head)',
    holds: () =>
      N_COLL_EQ_TRUNC !== null &&
      Math.abs(N_COLL_EQ_TRUNC / 3.280294e9 - 1) < 5e-3 &&
      N_COLL_EQ_TRUNC > 1.6e6,
  },
  {
    id: 'imp97602-flow-eq-coll-never',
    description: 'E_flow = E_coll never occurs: E_coll > E_flow uniformly (max ratio < 1)',
    holds: () => N_FLOW_EQ_COLL === null && maxFlowOverColl < 1,
  },
  {
    id: 'imp97602-no-triple-crossing',
    description: 'the three terms never coincide at a single N (crossings widely separated, one absent)',
    holds: () =>
      IMP97602_E_TRIPLE_CROSSING_HEAD_REGION.binding.no_triple_crossing === true &&
      N_FLOW_EQ_TRUNC < N_COLL_EQ_TRUNC &&
      N_FLOW_EQ_COLL === null,
  },
  {
    id: 'imp97602-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97602_E_TRIPLE_CROSSING_HEAD_REGION.isRigorous === false &&
      /NO QED/.test(IMP97602_E_TRIPLE_CROSSING_HEAD_REGION.note) &&
      /refereed bound is changed/i.test(IMP97602_E_TRIPLE_CROSSING_HEAD_REGION.note),
  },
];

for (const a of IMP97602_E_TRIPLE_CROSSING_HEAD_REGION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97602-e-triple-crossing-head-region assertion failed: ${a.id}`);
  }
}
