/**
 * @module imp-34491-en-floor-proximity-bisect
 *
 * imp-34434 (F3) reported the bridge TOTAL E(N) = E_trunc + E_flow + E_coll comes within
 * 10% of the constant E_trunc = 3.06e-5 floor "near N ~ 4.0e11" and within 1% "near
 * N ~ 4.7e13", but those two floor-proximity landmarks were quoted to only two sig figs
 * off a coarse read. This module SHARPENS them: it bisects the SAME monotone E(N) descent
 * (identical imp-3220/imp-3406 sub-term formulas -- effectiveHeightForN, C_C_PINNED, the
 * imp-398 C_F prefactor, E_trunc = 3.06e-5) to full double precision and reports each
 * crossing WITH its T0 = gamma_N and its imp-3220 conditional share sigma = E_coll/E(N).
 *
 * THE QUANTITY (identical sub-terms to imp-34434 / imp-3220 / imp-3406)
 * --------------------------------------------------------------------
 *     E(N) = E_trunc + E_flow(N) + E_coll(N),   with
 *     T0      = effectiveHeightForN(N)                 (Riemann-von Mangoldt inverse)
 *     E_trunc = 3.06e-5                                (N-INDEPENDENT floor, imp-2631)
 *     E_flow  = C_F (log T0 / T0) Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     E_coll  = C_C_PINNED sqrt(log T0 / N)            (GUE-conditional, C_H = 1/8)
 *     sigma   = E_coll / E(N)                          (imp-3220 conditional SHARE)
 * The crossing N_f solves E(N_f) - E_trunc = f * E_trunc, i.e. the aboveFloor excess is
 * exactly f of the floor. Bisection is on ln N over the monotone tail (F1: E(N) has no
 * interior minimum, so the crossing is unique).
 *
 * THE FINDING (measurement / location only -- sharpens imp-34434 F3)
 * -----------------------------------------------------------------
 *   (F1) THE 10% CROSSING is N = 4.00259e11 (imp-34434 quoted ~4.0e11 -- confirmed to
 *        three sig figs, now pinned to full precision). There T0 = 1.11291e11,
 *        log T0 = 25.4354, E(N) = 3.3660e-5, and the conditional share sigma = 9.0883e-2:
 *        even where E(N) is within 10% of the floor, E_coll still carries ~9.1% of the
 *        (already tiny) budget, and E_flow ~ 8.95e-10 is utterly spent.
 *   (F2) THE 1% CROSSING is N = 4.72184e13 (imp-34434 quoted ~4.7e13 -- confirmed, now
 *        pinned). There T0 = 1.09142e13, log T0 = 30.0211, E(N) = 3.0906e-5, and
 *        sigma = 9.9006e-3: E_coll has fallen to ~0.99% of the budget, E_flow ~ 1.28e-11
 *        is negligible, so the remaining ~1% excess is almost entirely the last of E_coll.
 *   (F3) THE FLOOR IS APPROACHED ~118x SLOWER PER DECADE OF PROXIMITY. Tightening the
 *        proximity by a factor of 10 (10% -> 1%) costs a factor N_1pct/N_10pct = 117.97
 *        in N -- consistent with the E_coll ~ 1/sqrt(N) tail: a 10x smaller excess needs
 *        ~100x more N, inflated slightly by the slowly growing log T0 numerator. This
 *        quantifies imp-34434 F3s "logarithmically slow" descent as a ~118x-per-decade law.
 *
 * MEASUREMENT ONLY. E(N) are bridge constants not the headline inequality (imp-2564);
 * the component model is the imp-3220/imp-3406 extrapolation which is NOT a rigorous
 * asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; no positivity, no bridge
 * closure, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-34434-en-bridge-total-minimum-locate (F3 approximate landmarks sharpened here)
 * @see imp-3406-sigma-highN-extrapolation (sigma share N-shape)
 * @see imp-3220-en-bridge-fidelity-frontier (conditional share sigma = E_coll/E(N))
 * @see imp-2564 (E(N) are bridge constants, NOT the headline Lambda inequality)
 * @see polymath15-constant-C-C (C_C_PINNED = (1/8) sqrt(3 pi))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip floor (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34434/imp-3220/imp-3406 exactly

// EXACT imp-3220/imp-3406/imp-34434 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  const sigma = E_coll / E_N; // imp-3220 conditional SHARE
  return { T0, L, E_flow, E_coll, E_N, sigma };
}
const EN = (N) => parts(N).E_N;

// N at which E(N) first comes within fraction f of the E_trunc floor
// (E(N) - E_trunc <= f * E_trunc). Bisection on ln N over the monotone tail (F1).
function nWithinFractionOfFloor(f) {
  let a = Math.log(1e3);
  let b = Math.log(1e40);
  const target = E_TRUNC_PT * (1 + f);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (EN(Math.exp(m)) > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

function crossing(f) {
  const N = nWithinFractionOfFloor(f);
  const p = parts(N);
  return {
    fraction: f,
    N: +N.toExponential(9),
    T0: +p.T0.toExponential(9),
    logT0: +p.L.toFixed(6),
    E_N: +p.E_N.toExponential(9),
    aboveFloor: +(p.E_N - E_TRUNC_PT).toExponential(6), // = f * E_trunc by construction
    sigma: +p.sigma.toExponential(8),
    E_flow: +p.E_flow.toExponential(4),
    E_coll: +p.E_coll.toExponential(6),
  };
}

const CROSS_10PCT = crossing(0.10); // N ~ 4.00259e11, sigma ~ 0.090883
const CROSS_1PCT = crossing(0.01); //  N ~ 4.72184e13, sigma ~ 0.0099006
const DECADE_COST = CROSS_1PCT.N / CROSS_10PCT.N; // ~117.97 (N cost per 10x proximity)

export const IMP34491_EN_FLOOR_PROXIMITY_BISECT = {
  id: 'imp-34491',
  proofSection: 'S-frontier',
  question:
    'Sharpen the imp-34434 F3 floor-proximity landmarks (E(N) within 10% near N ~ 4.0e11, ' +
    'within 1% near N ~ 4.7e13) by bisecting the SAME monotone E(N) = E_trunc + E_flow + ' +
    'E_coll descent to full precision, reporting each crossing with its T0 and imp-3220 ' +
    'conditional share sigma = E_coll/E(N). Measurement/location only; E(N) are bridge ' +
    'CONSTANTS not the headline inequality (imp-2564).',
  crossings: {
    within_10pct: CROSS_10PCT,
    within_1pct: CROSS_1PCT,
  },
  decadeCost: {
    N_1pct_over_N_10pct: +DECADE_COST.toFixed(3), // ~117.97
    note:
      'Tightening floor proximity 10x (10% -> 1%) costs ~118x in N, consistent with the ' +
      'E_coll ~ 1/sqrt(N) tail (a 10x smaller excess wants ~100x more N, inflated by the ' +
      'slowly growing log T0 numerator). Quantifies imp-34434 F3s logarithmically slow ' +
      'descent as a ~118x-per-decade-of-proximity law.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Bisecting the SAME monotone bridge ' +
    'TOTAL E(N) = E_trunc + E_flow + E_coll (identical imp-3220/imp-3406/imp-34434 ' +
    'sub-terms) to full double precision sharpens the imp-34434 F3 floor-proximity ' +
    'landmarks: E(N) is within 10% of the E_trunc = 3.06e-5 floor at N = 4.00259e11 ' +
    '(T0 = 1.11291e11, log T0 = 25.4354, sigma = 0.090883) and within 1% at N = 4.72184e13 ' +
    '(T0 = 1.09142e13, log T0 = 30.0211, sigma = 0.0099006). Both confirm imp-34434s ' +
    'two-sig-fig quotes (~4.0e11, ~4.7e13). Tightening proximity 10x costs ~118x in N -- ' +
    'the 1/sqrt(N) E_coll tail. C_mb GUE-conditional per imp-486 untouched; E(N) are bridge ' +
    'CONSTANTS not the headline inequality (imp-2564); no positivity, no bridge closure, no ' +
    'RH claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-34434 (F3 approximate floor-proximity landmarks); imp-3406 (sigma share N-shape); ' +
    'imp-3220 (conditional share sigma = E_coll/E(N)); imp-2564 (E(N) are bridge ' +
    'constants); imp-2631 (E_trunc fixed-strip floor); imp-398 (E_flow C_F prefactor); ' +
    'imp-486 (C_mb GUE-conditional); polymath15-constant-C-C (C_C_PINNED); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34491_EN_FLOOR_PROXIMITY_BISECT_ASSERTIONS = [
  {
    // Reuse gate: the bisected crossings reproduce the imp-34434 F3 two-sig-fig landmarks.
    id: 'imp34491-reproduces-imp34434-landmarks',
    description: 'Bisected 10% crossing ~4.00e11 and 1% crossing ~4.72e13 match imp-34434 F3 (~4.0e11, ~4.7e13)',
    holds: () =>
      Math.abs(CROSS_10PCT.N - 4.0e11) / 4.0e11 < 0.02 &&
      Math.abs(CROSS_1PCT.N - 4.72e13) / 4.72e13 < 0.02,
  },
  {
    // The crossing is exact: aboveFloor equals f * E_trunc to full precision by construction.
    id: 'imp34491-crossing-hits-target-excess',
    description: 'aboveFloor excess equals f * E_trunc at each crossing (0.10 and 0.01 of 3.06e-5)',
    holds: () =>
      Math.abs(CROSS_10PCT.aboveFloor - 0.10 * E_TRUNC_PT) < 1e-12 &&
      Math.abs(CROSS_1PCT.aboveFloor - 0.01 * E_TRUNC_PT) < 1e-13,
  },
  {
    // The conditional share sigma at each crossing: ~9.1% at 10%, ~0.99% at 1%.
    id: 'imp34491-sigma-at-crossings',
    description: 'sigma = E_coll/E(N) is ~0.0909 at the 10% crossing and ~0.0099 at the 1% crossing',
    holds: () =>
      Math.abs(CROSS_10PCT.sigma - 0.090883) < 1e-4 &&
      Math.abs(CROSS_1PCT.sigma - 0.0099006) < 1e-5,
  },
  {
    // Proximity-decade cost: ~118x in N per 10x tighter floor proximity (1/sqrt(N) tail).
    id: 'imp34491-decade-cost-118x',
    description: 'Tightening proximity 10x costs ~118x in N (N_1pct/N_10pct ~ 117.97)',
    holds: () => Math.abs(DECADE_COST - 117.97) < 0.5,
  },
  {
    // Ordering: the 1% crossing is deeper in the tail with the smaller share and floor gap.
    id: 'imp34491-crossings-ordered',
    description: '1% crossing sits at larger N, larger T0, smaller sigma, smaller aboveFloor than the 10% crossing',
    holds: () =>
      CROSS_1PCT.N > CROSS_10PCT.N &&
      CROSS_1PCT.T0 > CROSS_10PCT.T0 &&
      CROSS_1PCT.sigma < CROSS_10PCT.sigma &&
      CROSS_1PCT.aboveFloor < CROSS_10PCT.aboveFloor,
  },
  {
    // Honesty gate: measurement only, bridge-constant caveat present, no QED, no refereed bound is changed.
    id: 'imp34491-honesty-gate-no-qed',
    description: 'Measurement only: bridge-constant caveat (imp-2564), no QED, no refereed bound is changed',
    holds: () =>
      IMP34491_EN_FLOOR_PROXIMITY_BISECT.isRigorous === false &&
      /bridge CONSTANTS/.test(IMP34491_EN_FLOOR_PROXIMITY_BISECT.verdict) &&
      /NO QED/.test(IMP34491_EN_FLOOR_PROXIMITY_BISECT.verdict) &&
      /refereed bound is changed/i.test(IMP34491_EN_FLOOR_PROXIMITY_BISECT.verdict),
  },
];

for (const a of IMP34491_EN_FLOOR_PROXIMITY_BISECT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34491-en-floor-proximity-bisect assertion failed: ${a.id}`);
  }
}
