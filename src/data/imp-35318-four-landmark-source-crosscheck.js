/**
 * @module imp-35318-four-landmark-source-crosscheck
 *
 * imp-35318 (numerical, verification): the imp-35210 four-E-component-landmark viz module bakes
 * the four literals L1/L2/L3/L4 and their decade-gap + ordering annotations, but until now NO
 * ticket tied those baked values back to the imp-35153/imp-35154/imp-33723 source constants. This
 * LIGHT STANDALONE module supplies that tie: it re-declares the four source literals verbatim from
 * their citing modules (independent of the imp-35210 array), imports ONLY the imp-35210 landmark
 * object for comparison, and confirms (a) each imp-35210 literal reproduces its source with no
 * drift beyond 7-sig-fig storage rounding, and (b) the decade-gap and strict-ordering annotations
 * recompute from the literals to the imp-35154 reported figures (~2.0044 below N_cross, ~0.7283
 * above N_cross).
 *
 * THE FOUR SOURCE LITERALS
 * ------------------------
 *   L1  N_flow_eq_trunc  = 1.597752e6   E_flow = E_trunc crossover   (imp-35153 closed form; imp-35105 measured)
 *   L2  N_1pct           = 3.246862e7   E_flow drops below 1% share  (imp-35154 M2 N_flow_below_1pct)
 *   L3  N_cross          = 3.280294e9   E_coll = E_trunc crossover   (imp-33723 closed-form fixed point)
 *   L4  N_0p1pct         = 1.754552e10  E_flow drops below 0.1% share (imp-35154 M3 N_flow_below_0p1pct)
 *
 * VERIFICATION / ACCURACY CROSS-CHECK ONLY. No new bound; no recomputation of the underlying
 * component model (inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic); C_mb
 * GUE-conditional per imp-486 UNTOUCHED; establishes no operator positivity; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35210-four-e-component-landmarks-viz-data (the baked L1-L4 array under test)
 * @see imp-35153-eflow-etrunc-crossover-closed-form (L1: N ~ 1.597752e6)
 * @see imp-35154-eflow-negligible-threshold (L2: N ~ 3.246862e7; L4: N ~ 1.754552e10)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (L3: N_cross ~ 3.280294e9)
 */

import { IMP35210_LANDMARKS } from './imp-35210-four-e-component-landmarks-viz-data.js';

// Source literals re-declared verbatim from their citing modules (see @see chain above). These are
// the 7-sig-fig stored values the imp-35210 array must reproduce.
const SRC = {
  L1: 1.597752e6, // imp-35153 N_flow_eq_trunc_closed_form / imp-35105 measurement
  L2: 3.246862e7, // imp-35154 N_flow_below_1pct
  L3: 3.280294e9, // imp-33723 N_cross closed-form fixed point
  L4: 1.754552e10, // imp-35154 N_flow_below_0p1pct
};

// imp-35210 bakes the landmarks in strict N-order [L1, L2, L3, L4].
const BAKED = {
  L1: IMP35210_LANDMARKS[0].N,
  L2: IMP35210_LANDMARKS[1].N,
  L3: IMP35210_LANDMARKS[2].N,
  L4: IMP35210_LANDMARKS[3].N,
};

const relDrift = (a, b) => Math.abs(a / b - 1);
const MAX_DRIFT = Math.max(
  relDrift(BAKED.L1, SRC.L1),
  relDrift(BAKED.L2, SRC.L2),
  relDrift(BAKED.L3, SRC.L3),
  relDrift(BAKED.L4, SRC.L4),
);

// Decade annotations recomputed from the baked literals (imp-35210 convention: signed log10 gaps).
const log10 = (x) => Math.log10(x);
const L2_DECADES_BELOW_NCROSS = +(log10(BAKED.L3) - log10(BAKED.L2)).toFixed(4); // imp-35154: 2.0044
const L4_DECADES_ABOVE_NCROSS = +(log10(BAKED.L4) - log10(BAKED.L3)).toFixed(4); // imp-35154: 0.7283
const STRICTLY_INCREASING =
  BAKED.L1 < BAKED.L2 && BAKED.L2 < BAKED.L3 && BAKED.L3 < BAKED.L4;

export const IMP35318_FOUR_LANDMARK_SOURCE_CROSSCHECK = {
  id: 'imp-35318',
  title:
    'Cross-check the imp-35210 four-E-component landmark literals (L1-L4) and decade/ordering ' +
    'annotations reproduce from their imp-35153/imp-35154/imp-33723 sources',
  isRigorous: false,
  results: {
    src: SRC,
    baked: BAKED,
    max_literal_rel_drift: +MAX_DRIFT.toExponential(3),
    L2_decades_below_Ncross: L2_DECADES_BELOW_NCROSS,
    L4_decades_above_Ncross: L4_DECADES_ABOVE_NCROSS,
    strictly_increasing: STRICTLY_INCREASING,
  },
  note:
    'All four imp-35210 baked literals reproduce their imp-35153/imp-35154/imp-33723 source ' +
    'constants exactly (max relative drift 0, well within 7-sig-fig storage rounding), and the ' +
    'decade-gap annotations recompute to the imp-35154 reported 2.0044 (L2 below N_cross) and ' +
    '0.7283 (L4 above N_cross) with the strict ordering L1 < L2 < L3 < L4 holding. Verification ' +
    'cross-check only on the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per ' +
    'imp-486; changes no bound; NO QED; no refereed bound is changed.',
};

export const IMP35318_FOUR_LANDMARK_SOURCE_CROSSCHECK_ASSERTIONS = [
  {
    id: 'imp35318-literals-reproduce-sources',
    description: 'each imp-35210 baked landmark reproduces its cited source literal with no drift beyond storage rounding',
    holds: () => MAX_DRIFT < 1e-6,
  },
  {
    id: 'imp35318-L2-decades-below-ncross',
    // imp-35508: tightened from 1e-3 to 1e-4 -- the recompute reproduces the imp-35154
    // figure to all 4 baked decimal places (verified diff 0), so 1e-3 was 10x looser
    // than the precision this assertion is actually meant to guard.
    description: 'L2 recomputes to ~2.00 decades below N_cross (imp-35154 reports 2.0044)',
    holds: () => Math.abs(L2_DECADES_BELOW_NCROSS - 2.0044) < 1e-4,
  },
  {
    id: 'imp35318-L4-decades-above-ncross',
    // imp-35508: same tightening as the L2 check above (1e-3 -> 1e-4).
    description: 'L4 recomputes to ~0.73 decades above N_cross (imp-35154 reports 0.7283)',
    holds: () => Math.abs(L4_DECADES_ABOVE_NCROSS - 0.7283) < 1e-4,
  },
  {
    id: 'imp35318-strict-ordering',
    description: 'the four landmarks are strictly increasing in N (L1 < L2 < L3 < L4)',
    holds: () => STRICTLY_INCREASING === true,
  },
  {
    id: 'imp35318-no-qed-honesty',
    description: 'verification-only: not rigorous and no bound change is claimed',
    holds: () =>
      IMP35318_FOUR_LANDMARK_SOURCE_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP35318_FOUR_LANDMARK_SOURCE_CROSSCHECK.note),
  },
];

for (const a of IMP35318_FOUR_LANDMARK_SOURCE_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35318-four-landmark-source-crosscheck assertion failed: ${a.id}`);
  }
}
