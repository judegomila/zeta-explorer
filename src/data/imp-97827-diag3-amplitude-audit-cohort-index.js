/**
 * @module imp-97827-diag3-amplitude-audit-cohort-index
 * @fileoverview imp-97827 -- META cross-reference index grouping the diag3 three-axis amplitude-audit
 *   cohort: imp-97668 (first-order six-probe audit of the imp-97644 STRUCTURE (1) degree-0 homogeneity),
 *   imp-97720 (second-order mixed-Hessian extension), and imp-97710/imp-97721 (far-landmark and
 *   peak-straddling cross-validations of the first-order DIAG3 == 0 identity). Index/meta only;
 *   establishes nothing new; changes no bound; NO QED.
 *
 *   THE FIRST-ORDER AUDIT (one ticket, whether any inherited model constant enters E_N non-linearly).
 *     imp-97668 -- audits all six constants of the full imp-3406/imp-33582 component model (including
 *       the two that sit inside a non-linear wrapper: C_KH via sqrt, the Gronwall exponent via exp) and
 *       confirms every constant elasticity lies in span{E_CC, E_ET, E_CF}; DIAG3 = E_CC + E_ET + E_CF
 *       == 0 (machine-zero) for both the term-prefactor triple and a degenerate triple -- no hidden
 *       non-linear amplitude breaks the exact scaling symmetry.
 *
 *   THE SECOND-ORDER EXTENSION (one ticket, whether the homogeneity forces second-order couplings too).
 *     imp-97720 -- computes the full 3x3 mixed log-Hessian of ln sigma and finds the off-diagonal
 *       entries (H_ce, H_cf, H_ef) are all NONZERO (order-1 couplings, e.g. H_ce = +2.495e-1 at L3),
 *       matching an exact closed form; what DOES vanish is the diagonal CONTRACTION (row/column sums,
 *       the second-order Euler relation d/du_i(DIAG3) = 0) -- the homogeneity survives beyond first
 *       order as a contraction identity, not as vanishing mixed couplings.
 *
 *   THE FAR-LANDMARK / PEAK CROSS-VALIDATION SUB-COHORT (two tickets, testing the first-order DIAG3 == 0
 *   identity away from its original three anchor landmarks).
 *     imp-97710 -- adds a fourth, far-downslope landmark L5 (sigma = 0.02, ~34x past L4): the closed-form
 *       partial sum and reconstructed elasticity sum stay machine-zero, the reconstruction matches a
 *       direct measurement to < 1e-8 relative, and the direct DIAG3 quarters with eps to the O(eps^2)
 *       stencil floor -- confirming the identity is not an artefact of the three original anchors.
 *     imp-97721 -- straddles the L1 interior PEAK on both arms, where imp-97662 showed each individual
 *       crossing elasticity DIVERGES (a square-root fold, |K| ~ sqrt(10) per decade of gap); the exact
 *       cancellation RECON_SUM = K*NUM survives the blow-up (machine-zero), and the DIRECT diagonal
 *       (scaling) DIAG3 stays at the bisection floor -- confirming DIAG3 == 0 is a SCALING SYMMETRY
 *       (sigma is degree-0 homogeneous, invariant to ~1 ULP at the peak), not a transversality artefact
 *       of the downslope landmarks.
 *
 *   WHY GROUP THESE (not re-derive). All four tickets probe the same object -- the imp-97644 STRUCTURE
 *   (1) degree-0 homogeneity of sigma = E_coll/E_N in the three amplitudes (C_C, E_trunc, C_F) -- from
 *   four different angles: which constants could break it (imp-97668), whether it also kills second-order
 *   couplings (imp-97720, answer: no, only the contraction), and whether it survives away from its
 *   original anchors (imp-97710 far downslope, imp-97721 at the individual-elasticity fold). Read in
 *   isolation each reads as an independent frontier leaf; grouped, they form one settled picture: the
 *   scaling symmetry is exact everywhere tested, at every order tested, and its individual single-axis
 *   derivatives can diverge (at the fold) or couple nonlinearly (at second order) without ever breaking
 *   the sum/contraction that the symmetry actually forces.
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket already committed).
 *   - all six audited model constants (four linear term-prefactors, two non-linear wrappers) collapse
 *     onto span{E_CC, E_ET, E_CF}; DIAG3 machine-zero for both triples tested (imp-97668).
 *   - the 3x3 mixed log-Hessian has nonzero off-diagonal couplings (order-1) but its row/column sums
 *     vanish to the O(h^2) stencil floor, the exact second-order Euler contraction (imp-97720).
 *   - DIAG3 == 0 cross-validated at a fourth, far-downslope landmark (~34x past L4) to the O(eps^2)
 *     stencil floor, matching a direct measurement to < 1e-8 relative (imp-97710).
 *   - DIAG3 == 0 cross-validated straddling the interior peak on both arms, surviving the imp-97662
 *     individual-elasticity square-root fold; confirmed as a scaling symmetry via the sigma
 *     diagonal-invariance test (~1 ULP at the peak) (imp-97721).
 *
 *   NOT ESTABLISHED (what stays open at the end of this batch).
 *   - no coefficient is newly pinned (C_C 1/8 ansatz, E_trunc 3.06e-5, imp-398 C_F prefactor all
 *     untouched, perturbed only as probes/differentiation axes).
 *   - the component model itself stays the inherited imp-3220/imp-3406 extrapolation, not a rigorous
 *     asymptotic; the C_mb GUE-conditional per imp-486 is untouched.
 *   - no interval-rigorous certified reach moves; certified reach stays EXACTLY 2a<=0.96.
 *
 *   STATUS: a grouping/index note over four already-completed tickets, not a new derivation. No bound
 *   changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-97668-nonlinear-amplitude-audit.js (first-order six-probe audit; all constants collapse onto span{E_CC,E_ET,E_CF})
 * @see imp-97720-diag3-second-order-hessian.js (second-order mixed-Hessian; nonzero couplings, contraction vanishes)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation.js (DIAG3 == 0 at a fourth, far-downslope landmark)
 * @see imp-97721-diag3-peak-upslope-crossvalidation.js (DIAG3 == 0 survives the individual-elasticity peak fold)
 * @see imp-97644-three-axis-additivity-flow-prefactor.js (MEASURED first-order DIAG3 == 0, the audited claim)
 * @see imp-97689-diag3-additivity-euler-derivation.js (analytic Euler degree-0 derivation of DIAG3 == 0)
 *
 * Ticket: imp-97827 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- reference constant carried from the imp-97734 predecessor index

const FIRST_ORDER_AUDIT_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97668',
    step: 'audit all six constants of the full imp-3406/imp-33582 component model, including two non-linear wrappers',
    result:
      'every constant elasticity lies in span{E_CC, E_ET, E_CF}: four are strict LINEAR term-prefactors ' +
      '(C_H, E_trunc, C_F, Gronwall factor) and two enter via a non-linear wrapper (C_KH via sqrt, the ' +
      'Gronwall exponent via exp) yet collapse onto a single existing axis at a fixed scalar weight ' +
      '(0.5*E_CC and TC_A1_TRAP*E_CF); DIAG3 machine-zero for both the term-prefactor triple and a ' +
      'degenerate triple.',
  }),
]);

const SECOND_ORDER_HESSIAN_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97720',
    step: 'compute the full 3x3 mixed log-Hessian of ln sigma in the three log-amplitude axes at L2/L3/L4',
    result:
      'the off-diagonal entries H_ce, H_cf, H_ef are all NONZERO (order-1 couplings, e.g. H_ce = ' +
      '+8.11e-2/+2.495e-1/+9.00e-2 at L2/L3/L4), matching an exact closed form H_ij = ' +
      'delta_ij(a_i-b_i)-(a_i a_j-b_i b_j) to < 3e-7 relative; the row/column sums (the second-order ' +
      'Euler contraction d/du_i(DIAG3) = 0) DO vanish, to the O(h^2) stencil floor -- degree-0 ' +
      'homogeneity survives beyond first order as a contraction, not as vanishing couplings.',
  }),
]);

const FAR_LANDMARK_PEAK_CROSSVALIDATION_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97710',
    step: 'cross-validate the first-order DIAG3 == 0 identity at a fourth, far-downslope landmark L5 (sigma=0.02, ~34x past L4)',
    result:
      'the closed-form partial sum and reconstructed elasticity sum stay machine-zero; the reconstructed ' +
      'E_CC/E_ET reproduce a direct central-difference measurement to < 1e-8 relative; the direct DIAG3 ' +
      'quarters with eps (O(eps^2) truncation) down to round-off -- confirming the identity is not an ' +
      'artefact of the three original imp-97520 anchor landmarks.',
  }),
  Object.freeze({
    id: 'imp-97721',
    step: 'cross-validate DIAG3 == 0 straddling the L1 interior peak on both arms, where imp-97662 showed individual elasticities diverge',
    result:
      'the reconstructed single-axis elasticities blow up (shared kernel |K| grows ~sqrt(10) per decade of ' +
      'gap, the imp-97662 square-root fold) yet RECON_SUM = K*NUM stays machine-zero and the DIRECT ' +
      'diagonal (scaling) DIAG3 stays at the bisection floor on both arms -- confirming DIAG3 == 0 is a ' +
      'SCALING SYMMETRY (sigma degree-0 homogeneous, invariant to ~1 ULP at the peak), not a ' +
      'transversality artefact of the downslope landmarks.',
  }),
]);

export const IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX = Object.freeze({
  id: 'imp-97827',
  proofSection: 'S-frontier',
  firstOrderAuditCohort: FIRST_ORDER_AUDIT_SUBCOHORT,
  secondOrderHessianCohort: SECOND_ORDER_HESSIAN_SUBCOHORT,
  crossValidationCohort: FAR_LANDMARK_PEAK_CROSSVALIDATION_SUBCOHORT,
  measuredSignal:
    'four diag3 three-axis amplitude-audit leaves (imp-97668/97710/97720/97721), grouped by role: one ' +
    'first-order six-probe audit, one second-order mixed-Hessian extension, and two cross-validations of ' +
    'the first-order identity away from its original anchors (far downslope and at the individual-' +
    'elasticity peak fold).',
  namedResiduals: [
    'IMP97668_ALL_SIX_CONSTANTS_COLLAPSE_ONTO_SPAN_ECC_EET_ECF',
    'IMP97720_SECOND_ORDER_COUPLINGS_NONZERO_CONTRACTION_VANISHES',
    'IMP97710_DIAG3_HOLDS_AT_FOURTH_FAR_DOWNSLOPE_LANDMARK',
    'IMP97721_DIAG3_SURVIVES_PEAK_FOLD_AS_SCALING_SYMMETRY',
  ],
  certifiedReach: 0.96,
  diag3_97668_termPrefactorCount: 4,
  diag3_97668_nonlinearWrapperCount: 2,
  diag3_97720_hCeAtL3: 0.2495,
  diag3_97720_contractionIsZero: true,
  diag3_97710_landmarkBeyondL4Factor: 34,
  diag3_97721_kernelDecadeGrowth: Math.sqrt(10),
  diag3_97721_peakInvarianceUlp: true,
  lowerBoundOnLambda2Proved: false,
  coercivityConstantProved: false,
  anyBoundMoved: false,
  question:
    'The diag3 three-axis amplitude-audit leaves imp-97668 (first-order six-probe audit), imp-97720 ' +
    '(second-order Hessian), and imp-97710/imp-97721 (far-landmark and peak cross-validations) each probe ' +
    'the imp-97644 STRUCTURE (1) degree-0 homogeneity of sigma = E_coll/E_N from a different angle. Grouped ' +
    'by role -- what could break it (imp-97668), does it survive to second order (imp-97720), and does it ' +
    'survive away from its original anchors (imp-97710/imp-97721) -- does each settle a distinct question, ' +
    'and does none move any bound?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-97668 audits every constant of the inherited component ' +
    'model and confirms none breaks the exact degree-0 homogeneity (DIAG3 == 0 machine-zero for two ' +
    'distinct triples). imp-97720 extends the audit to second order and finds the homogeneity does NOT ' +
    'force the mixed second elasticities to zero -- only their diagonal contraction (the second-order ' +
    'Euler relation). imp-97710 cross-validates the first-order identity at a fourth landmark far past the ' +
    'three original anchors, and imp-97721 cross-validates it straddling the interior peak, where each ' +
    'individual elasticity diverges -- in both cases the exact cancellation survives, in the second case ' +
    'confirming it is a scaling symmetry (pointwise sigma invariance) rather than an artefact of ' +
    'transversal downslope crossings. No bound moves in any leaf: interval-rigorous certified reach stays ' +
    'EXACTLY 2a<=0.96, and no model coefficient is newly pinned. RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97668 (first-order six-probe audit); imp-97720 (second-order mixed-Hessian extension); ' +
    'imp-97710 (fourth, far-downslope landmark cross-validation); imp-97721 (peak-straddling ' +
    'cross-validation surviving the individual-elasticity fold); imp-97644 (the audited MEASURED first-' +
    'order DIAG3 == 0 claim); imp-97689 (analytic Euler degree-0 derivation); imp-97662 (the individual-' +
    'elasticity square-root fold near the peak).',
  ln3: LN3,
});

export default IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97827-first-order-subcohort-has-its-one-member',
    why: 'The first-order-audit split must contain exactly the imp-97668 leaf.',
    holds: () => {
      const ids = IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX.firstOrderAuditCohort.map((c) => c.id);
      return ids.length === 1 && ids.includes('imp-97668');
    },
  },
  {
    id: 'imp97827-second-order-subcohort-has-its-one-member',
    why: 'The second-order-Hessian split must contain exactly the imp-97720 leaf.',
    holds: () => {
      const ids = IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX.secondOrderHessianCohort.map((c) => c.id);
      return ids.length === 1 && ids.includes('imp-97720');
    },
  },
  {
    id: 'imp97827-crossvalidation-subcohort-has-both-members',
    why: 'The far-landmark/peak cross-validation split must contain exactly the imp-97710 and imp-97721 leaves.',
    holds: () => {
      const ids = IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX.crossValidationCohort.map((c) => c.id);
      return ids.length === 2 && ids.includes('imp-97710') && ids.includes('imp-97721');
    },
  },
  {
    id: 'imp97827-four-tickets-total-no-overlap',
    why: 'The index covers exactly four tickets split into three disjoint groups; an overlap or a dropped ' +
      'ticket would misreport the cohort.',
    holds: () => {
      const idx = IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX;
      const allIds = [
        ...idx.firstOrderAuditCohort.map((c) => c.id),
        ...idx.secondOrderHessianCohort.map((c) => c.id),
        ...idx.crossValidationCohort.map((c) => c.id),
      ];
      const noOverlap = new Set(allIds).size === allIds.length;
      return (
        allIds.length === 4 &&
        noOverlap &&
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 4
      );
    },
  },
  {
    id: 'imp97827-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX.anyBoundMoved === false &&
      IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX.certifiedReach === 0.96 &&
      IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX.certifiedReach < IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX.ln3 &&
      /NO QED/.test(IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97827_DIAG3_AMPLITUDE_AUDIT_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97827-diag3-amplitude-audit-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
