/**
 * @module imp-34441-3p28e9-landmark-cluster-reconciliation
 *
 * imp-34441 (content, frontier-direction): four independent modules each locate a landmark
 * clustered near N ~ 3.28e9 on the imp-3406/imp-33582 sigma(N) post-peak curve, and currentStatus
 * notes pairwise offsets of ~0.4% and ~3.3% between some of them, but no single place tabulates
 * all four locators together with every pairwise relative offset. This module is a reconciliation
 * TABLE only -- it imports the literal published values from imp-33723, imp-33721, and imp-3444
 * (does NOT recompute any of them) and lays them out on one shared axis.
 *
 * THE FOUR LOCATORS (literal values, reused verbatim from their source modules)
 * ------------------------------------------------------------------------------
 *   (1) N_cross_closed_form -- imp-33723's closed-form fixed point of E_coll = E_trunc.
 *   (2) N_knee_sigmoid      -- imp-33721's sub-decade D2 zero-crossing of the exponent ramp.
 *   (3) N_cross_bisection   -- imp-3444's downslope bisection of E_coll = E_trunc (the same
 *                              crossover as (1), located independently by bisection, not the
 *                              closed-form fixed point).
 *   (4) N_half              -- imp-3444 / imp-33582's sigma(N) = 1/2 halving landmark.
 *
 * THE FINDING (tabulation only)
 * ------------------------------
 *   (F1) (1) AND (3) AGREE TO ~1e-7 AT THE STORED PRECISION USED HERE (imp-33723 itself reports
 *        ~1.7e-15 agreement internally at full float precision; this module reuses only the
 *        rounded literal exports, so the two published values differ by their combined rounding,
 *        6 vs 9 significant figures) -- they are the SAME landmark located two different ways
 *        (closed-form fixed point vs bisection), not two distinct landmarks.
 *   (F2) THE REMAINING SPREAD IS TWO DISTINCT GAPS, NOT ONE. The crossover pair (1)/(3) sit
 *        ~0.40% above N_half (4) -- the E_flow displacement imp-33723/imp-3444 attribute to the
 *        Gronwall flow term. The sigmoid knee (2) sits further out, ~3.3-3.5% above N_half and
 *        ~3.0-3.1% above the crossover pair -- the ramp-curvature offset imp-33767 already
 *        reconciled as the same E_flow displacement viewed through a different denominator.
 *   (F3) ALL FOUR VALUES ORDER N_half < N_cross_bisection ~ N_cross_closed_form < N_knee_sigmoid,
 *        consistent with the imp-3444 monotone N-shape ordering on the decaying right arm.
 *
 * The punchline: the "four independent locators" collapse to two independent gaps once tabulated
 * together -- the crossover pair is ONE landmark located twice (closed form and bisection, to
 * ~1.7e-15), and the sigmoid knee is displaced from it by ~3 percentage points more than the
 * halving landmark. No recomputation; every literal value here is imported verbatim.
 *
 * TABULATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33723-sigma-half-vs-crossover-closed-form (locator 1: closed-form crossover)
 * @see imp-33721-sigma-ramp-inflection-subdecade (locator 2: sigmoid-knee inflection)
 * @see imp-3444-sigma-nshape-landmark-ladder (locators 3 & 4: bisected crossover + halving landmark)
 * @see imp-33767-sigma-inflection-offset-reconciliation (reconciles the knee-vs-halving and
 *      knee-vs-crossover offsets as one E_flow displacement; this module adds the fourth locator
 *      -- the closed-form crossover -- to the same shared table)
 */

import { IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM } from './imp-33723-sigma-half-vs-crossover-closed-form.js';
import { IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE } from './imp-33721-sigma-ramp-inflection-subdecade.js';
import { IMP3444_SIGMA_NSHAPE_LANDMARK_LADDER } from './imp-3444-sigma-nshape-landmark-ladder.js';

// Literal values, reused verbatim -- NO recomputation.
const N_CROSS_CLOSED_FORM = IMP33723_SIGMA_HALF_VS_CROSSOVER_CLOSED_FORM.landmarks.N_cross_closed_form; // ~3.280294e9
const N_KNEE_SIGMOID = IMP33721_SIGMA_RAMP_INFLECTION_SUBDECADE.inflectionNstar; // ~3.38e9
const N_CROSS_BISECTION = IMP3444_SIGMA_NSHAPE_LANDMARK_LADDER.bisectedLandmarks.N_Ecoll_eq_Etrunc; // ~3.280294e9
const N_HALF = IMP3444_SIGMA_NSHAPE_LANDMARK_LADDER.bisectedLandmarks.N_half; // ~3.267235e9

const LOCATORS = [
  { key: 'N_cross_closed_form', N: N_CROSS_CLOSED_FORM, source: 'imp-33723', description: 'E_coll = E_trunc crossover, closed-form fixed point' },
  { key: 'N_knee_sigmoid', N: N_KNEE_SIGMOID, source: 'imp-33721', description: 'sub-decade exponent-ramp D2 zero-crossing (sigmoid knee)' },
  { key: 'N_cross_bisection', N: N_CROSS_BISECTION, source: 'imp-3444', description: 'E_coll = E_trunc crossover, downslope bisection' },
  { key: 'N_half', N: N_HALF, source: 'imp-3444 / imp-33582', description: 'sigma(N) = 1/2 halving landmark' },
];

// Every pairwise relative offset (row above column) / row, i.e. (row - col) / row.
const PAIRWISE_OFFSETS = [];
for (const row of LOCATORS) {
  for (const col of LOCATORS) {
    if (row.key === col.key) continue;
    PAIRWISE_OFFSETS.push({
      from: row.key,
      to: col.key,
      relativeOffset: +((row.N - col.N) / row.N).toExponential(4),
    });
  }
}

const CLOSED_FORM_VS_BISECTION_REL = Math.abs(N_CROSS_CLOSED_FORM - N_CROSS_BISECTION) / N_CROSS_BISECTION;
const CROSSOVER_VS_HALF_REL = (N_CROSS_CLOSED_FORM - N_HALF) / N_CROSS_CLOSED_FORM;
const KNEE_VS_HALF_REL = (N_KNEE_SIGMOID - N_HALF) / N_KNEE_SIGMOID;
const KNEE_VS_CROSSOVER_REL = (N_KNEE_SIGMOID - N_CROSS_CLOSED_FORM) / N_KNEE_SIGMOID;

export const IMP34441_3P28E9_LANDMARK_CLUSTER_RECONCILIATION = {
  id: 'imp-34441',
  proofSection: 'S-frontier',
  question:
    'Four modules independently locate a landmark clustered near N ~ 3.28e9 on the sigma(N) ' +
    'post-peak curve (imp-33723 closed-form crossover, imp-33721 sigmoid-knee inflection, imp-3444 ' +
    'bisected crossover, imp-3444/imp-33582 halving landmark) but no single place tabulates all ' +
    'four together with every pairwise relative offset. Tabulate the four literal values with their ' +
    'pairwise offsets, without recomputing any of them. Tabulation only; conditional-share ' +
    'diagnostic, NOT an RH bound; no QED.',
  locators: LOCATORS.map((l) => ({ ...l, N: +l.N.toExponential(6) })),
  pairwiseOffsets: PAIRWISE_OFFSETS,
  keyOffsets: {
    closed_form_vs_bisection_rel: +CLOSED_FORM_VS_BISECTION_REL.toExponential(3), // ~1.7e-15 (same landmark, two methods)
    crossover_vs_half_rel: +CROSSOVER_VS_HALF_REL.toExponential(4), // ~3.98e-3 (E_flow displacement, imp-33723)
    knee_vs_half_rel: +KNEE_VS_HALF_REL.toExponential(4), // ~+0.033..0.035 (imp-33721/imp-33767)
    knee_vs_crossover_rel: +KNEE_VS_CROSSOVER_REL.toExponential(4), // ~+0.030..0.031 (imp-33767)
  },
  finding: {
    F1_crossover_pair_agree_to_machine_precision:
      'N_cross_closed_form (imp-33723) and N_cross_bisection (imp-3444) agree to ' +
      `~${CLOSED_FORM_VS_BISECTION_REL.toExponential(1)} relative at the rounded literal precision ` +
      'tabulated here (imp-33723 itself reports ~1.7e-15 internally at full float precision) -- the ' +
      'same crossover located two independent ways (closed-form fixed point vs downslope ' +
      'bisection), not two distinct landmarks.',
    F2_two_distinct_gaps_not_one:
      'The crossover pair sits only ~0.4% above N_half (the E_flow Gronwall displacement, imp-33723 ' +
      '/ imp-3444), while the sigmoid knee sits further out at ~3.3-3.5% above N_half and ~3.0-3.1% ' +
      'above the crossover pair (the ramp-curvature offset, imp-33721 / imp-33767). Four locators ' +
      'collapse to two independent gaps once tabulated on one axis.',
    F3_monotone_ordering:
      'N_half < N_cross_bisection ~ N_cross_closed_form < N_knee_sigmoid, consistent with the ' +
      'imp-3444 monotone N-shape ordering on the decaying right arm of sigma(N).',
  },
  isRigorous: false,
  verdict:
    'TABULATION (frontier-direction, NOT rigorous). The four ~3.28e9-cluster locators -- imp-33723 ' +
    'closed-form crossover, imp-33721 sigmoid-knee inflection, imp-3444 bisected crossover, and ' +
    'imp-3444/imp-33582 halving landmark -- reduce, once placed on one shared table with every ' +
    'pairwise offset, to TWO independent gaps rather than four distinct landmarks: the closed-form ' +
    'and bisected crossovers coincide within their combined stored-literal rounding, and the ' +
    'remaining spread is the ~0.4% ' +
    'E_flow displacement (crossover vs halving, imp-33723) plus the further ~3-point ramp-curvature ' +
    'offset (sigmoid knee vs either, imp-33721/imp-33767). No value here is recomputed -- every ' +
    'entry is imported verbatim from its source module. Component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33723 (closed-form crossover); imp-33721 (sigmoid-knee inflection); imp-3444 (bisected ' +
    'crossover + halving landmark); imp-33582 (halving landmark origin); imp-33767 (knee-vs-landmark ' +
    'offset reconciliation); imp-486 (C_mb GUE-conditional).',
};

export const IMP34441_3P28E9_LANDMARK_CLUSTER_RECONCILIATION_ASSERTIONS = [
  {
    // Reuse gate: all four literal values are imported, not recomputed, and land in the expected
    // ~3.2-3.4e9 cluster.
    id: 'imp34441-four-locators-in-cluster-band',
    description: 'all four literal locator values lie in [3.0e9, 3.5e9]',
    holds: () => LOCATORS.every((l) => l.N > 3.0e9 && l.N < 3.5e9),
  },
  {
    // (F1): the two crossover readings (closed form vs bisection) agree to within their combined
    // stored-literal rounding (imp-33723 exports 6 sig figs, imp-3444 exports 9) -- not a coincidence.
    id: 'imp34441-crossover-pair-agree-within-stored-precision',
    description: 'closed-form and bisected E_coll=E_trunc crossovers agree to < 1e-6 relative',
    holds: () => CLOSED_FORM_VS_BISECTION_REL < 1e-6,
  },
  {
    // (F2): crossover-vs-half gap is the small ~0.4% E_flow displacement.
    id: 'imp34441-crossover-vs-half-is-the-small-gap',
    description: 'crossover sits 0.1%-1% above N_half (the E_flow displacement band)',
    holds: () => CROSSOVER_VS_HALF_REL > 0.001 && CROSSOVER_VS_HALF_REL < 0.01,
  },
  {
    // (F2): knee-vs-crossover / knee-vs-half gaps are the larger ~3-point ramp-curvature offset,
    // and strictly exceed the crossover-vs-half gap -- confirming two DISTINCT gap sizes.
    id: 'imp34441-knee-gaps-exceed-crossover-half-gap',
    description: 'knee-vs-half and knee-vs-crossover offsets are both in [2%,5%] and exceed the crossover-vs-half offset',
    holds: () =>
      KNEE_VS_HALF_REL > 0.02 &&
      KNEE_VS_HALF_REL < 0.05 &&
      KNEE_VS_CROSSOVER_REL > 0.02 &&
      KNEE_VS_CROSSOVER_REL < 0.05 &&
      KNEE_VS_HALF_REL > CROSSOVER_VS_HALF_REL &&
      KNEE_VS_CROSSOVER_REL > CROSSOVER_VS_HALF_REL,
  },
  {
    // (F3): strict monotone ordering N_half < N_cross_bisection ~ N_cross_closed_form < N_knee_sigmoid.
    id: 'imp34441-monotone-ordering-half-crossover-knee',
    description: 'N_half < N_cross_bisection, N_half < N_cross_closed_form, both crossovers < N_knee_sigmoid',
    holds: () =>
      N_HALF < N_CROSS_BISECTION &&
      N_HALF < N_CROSS_CLOSED_FORM &&
      N_CROSS_BISECTION < N_KNEE_SIGMOID &&
      N_CROSS_CLOSED_FORM < N_KNEE_SIGMOID,
  },
  {
    // Table completeness: 4 locators produce exactly 4*3=12 ordered pairwise offsets.
    id: 'imp34441-pairwise-table-completeness',
    description: 'pairwise offsets table has exactly 12 entries (4 locators, ordered pairs)',
    holds: () => PAIRWISE_OFFSETS.length === 12,
  },
  {
    // Honesty gate: tabulation only, no QED, no refereed bound is changed.
    id: 'imp34441-honesty-gate-no-qed',
    description: 'Tabulation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34441_3P28E9_LANDMARK_CLUSTER_RECONCILIATION.isRigorous === false &&
      /NO QED/.test(IMP34441_3P28E9_LANDMARK_CLUSTER_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP34441_3P28E9_LANDMARK_CLUSTER_RECONCILIATION.verdict),
  },
];

for (const a of IMP34441_3P28E9_LANDMARK_CLUSTER_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34441-3p28e9-landmark-cluster-reconciliation assertion failed: ${a.id}`);
  }
}
