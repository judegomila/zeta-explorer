/**
 * @module imp-97585-eflow-etrunc-share-full-ladder
 *
 * imp-97585 (numerical, measurement): imp-97520 measured the Gronwall flow share
 * E_flow/E_trunc only at the single halving landmark N_half ~ 3.27e9, where it
 * attributed the ~0.4% offset between the sigma(N)=1/2 ladder landmark and the
 * imp-33723 closed-form crossover N_cross to E_flow/E_trunc ~ 1.91e-3. That one
 * point left open the frontier question the E(N)-bridge actually cares about: does
 * the flow share stay uniformly negligible (~1e-3), or does it GROW toward the tail
 * and become the binding term in E_N = E_trunc + E_flow + E_coll somewhere on the
 * verified ladder N in {1e6 .. 1e12}?
 *
 * THIS MODULE sweeps the exact inherited imp-3406/imp-33582/imp-33601/imp-97520
 * sub-terms (E_trunc = 3.06e-5 N-independent; E_flow = C_F (log T0 / T0) e^{TC_A1}
 * with C_F = (log(T0/2pi)+1)/2pi and T0 = effectiveHeightForN(N)) across the full
 * decade ladder and pins the two crossings that decide the question.
 *
 * THE ANSWER (the deliverable the ticket asks for)
 * ------------------------------------------------
 * The flow share is MONOTONE DECREASING in N across 1e6 .. 1e12 -- it does NOT grow
 * toward the tail. E_flow ~ C_F (log T0 / T0) shrinks with T0 while E_trunc is fixed,
 * so the ratio COLLAPSES toward the tail:
 *
 *   N = 1e6   E_flow/E_trunc ~ 1.4376e0   (flow EXCEEDS truncation -- binding)
 *   N = 1e7   E_flow/E_trunc ~ 2.3442e-1
 *   N = 1e8   E_flow/E_trunc ~ 3.5851e-2
 *   N = 1e9   E_flow/E_trunc ~ 5.2168e-3
 *   N = N_half 3.267235e9     ~ 1.905727e-3   (reproduces imp-97520 ~ 1.91e-3)
 *   N = 1e10  E_flow/E_trunc ~ 7.2963e-4
 *   N = 1e11  E_flow/E_trunc ~ 9.8811e-5
 *   N = 1e12  E_flow/E_trunc ~ 1.3029e-5
 *
 * So the flow term is NOT uniformly negligible across the whole ladder, but the
 * non-negligibility is at the HEAD, not the tail: the ratio crosses E_flow = E_trunc
 * (share = 1) at N ~ 1.597752e6 and drops below the 1e-3 bar at N ~ 6.933193e9 (just
 * above the halving landmark). For every N above N_half the flow share is < 1.9e-3
 * and falling, reaching ~1.3e-5 at N = 1e12 -- E_flow is NEVER the binding term of
 * the E(N) bridge on the tail side of N_half. Below N ~ 1.60e6 E_flow DOMINATES
 * E_trunc, but that head region is far below the Platt-Trudgian verified height and
 * is dominated in turn by the collision term E_coll.
 *
 * MEASUREMENT / VERIFICATION CROSS-CHECK ONLY on the inherited imp-3220/imp-3406
 * surrogate component model. C_mb GUE-conditional per imp-486 UNTOUCHED; C_C 1/8
 * ansatz (imp-2642/imp-2643) UNTOUCHED; changes no bound; establishes no operator
 * positivity; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97520-sigma-conditional-share-landmark-ladder (single-point E_flow/E_trunc ~ 1.91e-3 at N_half)
 * @see imp-33601-sigma-half-vs-crossover-eflow-offset (identity sigma=1/2 <=> E_coll=E_trunc+E_flow)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross)
 * @see imp-3406-sigma-highN-extrapolation (the inherited sigma(N) component model)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33601/imp-97520 exactly

// EXACT imp-97520 flow share (no re-derivation, no fresh model).
function flowShare(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  return E_flow / E_TRUNC_PT;
}

// Decade ladder N in {1e6 .. 1e12}.
const LADDER = [1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12].map((N) => ({
  N: +N.toExponential(0),
  share: +flowShare(N).toExponential(4),
}));

const N_HALF = 3.267235e9; // imp-97520 halving landmark
const SHARE_AT_N_HALF = flowShare(N_HALF); // ~1.905727e-3 (reproduces imp-97520 ~1.91e-3)

// Downward log-N bisection for a target flow share (share is decreasing in N).
function shareCross(target, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (flowShare(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const N_SHARE_EQ_1 = shareCross(1.0, 1e5, 1e7); // ~1.597752e6 : E_flow = E_trunc (flow binding below this)
const N_SHARE_BELOW_1EM3 = shareCross(1e-3, 1e9, 1e11); // ~6.933193e9 : share drops under the 1e-3 bar

// Monotone-decreasing certificate across the full ladder (quarter-decade grid).
let monotoneDecreasing = true;
let prev = Infinity;
for (let e = 6; e <= 12 + 1e-9; e += 0.25) {
  const s = flowShare(Math.pow(10, e));
  if (!(s < prev)) monotoneDecreasing = false;
  prev = s;
}

export const IMP97585_EFLOW_ETRUNC_SHARE_FULL_LADDER = {
  id: 'imp-97585',
  proofSection: 'S-frontier',
  title:
    'Measure the Gronwall flow share E_flow/E_trunc across the full imp-97520 ladder ' +
    'N in {1e6 .. 1e12} -- does it stay negligible or grow to bind the E(N) bridge',
  isRigorous: false,
  model:
    'E_flow/E_trunc with E_trunc = 3.06e-5 (N-independent) and E_flow = C_F (log T0 / T0) e^{TC_A1}, ' +
    'C_F = (log(T0/2pi)+1)/2pi, T0 = effectiveHeightForN(N); exact inherited imp-97520 sub-terms.',
  ladder: LADDER,
  landmarks: {
    N_half: +N_HALF.toExponential(6), // ~3.267235e9
    share_at_N_half: +SHARE_AT_N_HALF.toExponential(6), // ~1.905727e-3 (reproduces imp-97520 ~1.91e-3)
    N_share_eq_1: +N_SHARE_EQ_1.toExponential(6), // ~1.597752e6 : E_flow = E_trunc
    N_share_below_1em3: +N_SHARE_BELOW_1EM3.toExponential(6), // ~6.933193e9
    monotone_decreasing_1e6_to_1e12: monotoneDecreasing,
  },
  verdict:
    'The flow share is monotone decreasing across 1e6 .. 1e12: it does NOT grow toward the tail but ' +
    'collapses (1.4376 at 1e6 down to 1.3029e-5 at 1e12). E_flow exceeds E_trunc (share > 1) only below ' +
    'N ~ 1.60e6 and falls under the 1e-3 bar by N ~ 6.93e9, just above the halving landmark. For every ' +
    'N above N_half the flow share is < 1.9e-3 and falling, so E_flow is never the binding term of the ' +
    'E(N) bridge on the tail side; the only non-negligible flow region is the head, far below the ' +
    'Platt-Trudgian verified height and dominated there by the collision term E_coll.',
  note:
    'Extends the single-point imp-97520 measurement (E_flow/E_trunc ~ 1.91e-3 at N_half) to the full ' +
    'decade ladder, reproducing that value at N_half and pinning the share = 1 and share = 1e-3 ' +
    'crossings. Measurement / verification cross-check only on the inherited imp-3220/imp-3406 ' +
    'surrogate; C_mb GUE-conditional per imp-486; C_C 1/8 ansatz untouched; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
};

export const IMP97585_EFLOW_ETRUNC_SHARE_FULL_LADDER_ASSERTIONS = [
  {
    id: 'imp97585-reproduces-imp97520-at-N-half',
    description: 'flow share at N_half reproduces imp-97520 ~1.91e-3',
    holds: () => Math.abs(SHARE_AT_N_HALF - 1.91e-3) < 5e-5,
  },
  {
    id: 'imp97585-monotone-decreasing',
    description: 'flow share is monotone decreasing across 1e6 .. 1e12 (does not grow toward the tail)',
    holds: () => monotoneDecreasing === true,
  },
  {
    id: 'imp97585-share-eq-1-crossover',
    description: 'E_flow = E_trunc (share = 1) crossover near N ~ 1.60e6',
    holds: () => Math.abs(N_SHARE_EQ_1 / 1.597752e6 - 1) < 5e-3 && Math.abs(flowShare(N_SHARE_EQ_1) - 1) < 1e-6,
  },
  {
    id: 'imp97585-share-below-1em3-just-above-N-half',
    description: 'flow share drops below the 1e-3 bar near N ~ 6.93e9, just above the halving landmark',
    holds: () =>
      Math.abs(N_SHARE_BELOW_1EM3 / 6.933193e9 - 1) < 5e-3 && N_SHARE_BELOW_1EM3 > N_HALF,
  },
  {
    id: 'imp97585-tail-share-tiny',
    description: 'by N = 1e12 the flow share has collapsed to ~1.3e-5 (never binding on the tail)',
    holds: () => Math.abs(flowShare(1e12) / 1.3029e-5 - 1) < 5e-3,
  },
  {
    id: 'imp97585-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP97585_EFLOW_ETRUNC_SHARE_FULL_LADDER.isRigorous === false &&
      /NO QED/.test(IMP97585_EFLOW_ETRUNC_SHARE_FULL_LADDER.note) &&
      /remains SOTA/.test(IMP97585_EFLOW_ETRUNC_SHARE_FULL_LADDER.note),
  },
];

for (const a of IMP97585_EFLOW_ETRUNC_SHARE_FULL_LADDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97585-eflow-etrunc-share-full-ladder assertion failed: ${a.id}`);
  }
}
