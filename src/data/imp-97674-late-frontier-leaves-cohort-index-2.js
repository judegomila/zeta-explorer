/**
 * @module imp-97674-late-frontier-leaves-cohort-index-2
 * @fileoverview imp-97674 -- META cross-reference index grouping the six late-frontier leaves
 *   (imp-97640, imp-97642, imp-97643, imp-97644, imp-97645, imp-97647) into their parent programs --
 *   Sigma-landmark elasticity, Krein c_sharp lower-bound attack at 2a=ln3, and Route-M MCM/bulk-profile --
 *   with each leaf's one-line verdict, extending the imp-97594 index that stops at imp-97563.
 *   Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE SIGMA-LANDMARK ELASTICITY SUB-COHORT (two tickets, both on the imp-3406/imp-33582 crossing
 *   relation's C_C-elasticity closed form across the sigma landmarks L2/L3/L4).
 *     imp-97642 -- INDEPENDENTLY re-derives the imp-97622 unified C_C-elasticity closed form with a
 *       higher-order 5-point stencil and a refined eps ladder: confirms E = +2.55535443 (L2),
 *       +2.10234724 (L3), +2.07902469 (L4), shows the imp-97598 4-digit match was a finite-eps=0.01
 *       overshoot (the true eps->0 limit is the closed form), and confirms the E_flow flow-share term
 *       is the sole reason L2 is steeper than L3/L4.
 *     imp-97644 -- extends the imp-97623 two-axis (C_C/E_trunc) additivity to a THIRD axis (the C_F
 *       flow prefactor): proves DIAG3==0 EXACTLY (sigma is degree-0 homogeneous in the three
 *       amplitudes), which forces E_CC+E_ET+E_CF==0 by additivity, and shows E_CF enters linearly
 *       (E_CF/E_ET = E_flow/E_trunc to ~2e-7 relative at every landmark) -- the flow term does not
 *       break additivity, it participates in the scaling symmetry.
 *
 *   THE KREIN EDGE-FLOOR SUB-COHORT (one ticket, an independent high-precision cross-check of the
 *   c_sharp lower-bound attack's far-field edge amplitudes at 2a=ln3).
 *     imp-97643 -- recomputes g_pp(a), g_ppp(a) and the relBias(3.36) sign-change at mpmath dps=40:
 *       validates the three-IBP closed forms to relerr 1.14e-8/2.42e-9, confirms the EXACT
 *       relBias(3.36) = -2.72717e-5 sits ~2.7e4x above the operational IEEE-double floor and
 *       ~7.25e7x above the INTRINSIC hi-prec floor (3.76e-13, far below the imp-97625 ~1e-9
 *       estimate), and confirms the sign-change radius at Rc=1/a stays unresolvable below the floor.
 *
 *   THE ROUTE-M CAP/GAP-LAW SUB-COHORT (three tickets, the MCM base-term gap-law decay rate, the
 *   w_lin arithmetic-wobble linear coefficient, and the omega=10 primorial-extremality cap robustness).
 *     imp-97640 -- quantifies the imp-97619 gap-law next-order residual decay rate: local exponent
 *       q ~ 7-9 that CLIMBS with height (6.839 -> 8.713), outrunning every fixed inverse power of
 *       log p (no clean 1/log^3 term); the correction is PNT/Mertens strength. HONEST sub-gap: the
 *       ladder is precision-limited past p~2e6 (7-sig-fig cancellation).
 *     imp-97645 -- re-runs the imp-97618 Vasyunin double-sum limit at larger b (1e6, 2e6): the
 *       w_lin(x) linear-coefficient error does NOT tighten toward -1/pi (non-monotone, plateaus at
 *       ~6e-3) because w(x) is already b-converged at b=400000 -- the gap is the imp-97460 O(x^2)
 *       arithmetic wobble sampled on the fixed small-x fit grid, not a finite-b truncation artifact.
 *     imp-97647 -- re-evaluates the imp-97606 omega=10 primorial-extremality gap (+7.520579e-5) at
 *       divisor caps d<=5000/10000 with the exact 1/(720 d^3) tail bound: the gap is ROBUST (shifts by
 *       only ~-1.3e-10 across the cap sweep, and the cap->infinity budget is <5.69e-11, ~1.3e6x
 *       smaller than the gap); MCM onset stays exactly omega=11.
 *
 *   WHY GROUP THESE (not re-derive). All six are late-frontier leaves committed in immediate
 *   succession that read, on their own, as an undifferentiated batch continuing past the imp-97594
 *   index's stopping point (imp-97563). Grouped by parent program, the Sigma-landmark pair extend the
 *   crossing-elasticity closed form to a third axis and prove it an exact scaling symmetry, the Krein
 *   leaf independently validates the far-field edge-floor at high precision, and the Route-M trio
 *   settle three independent sub-questions on the sibling program (gap-law decay rate, w_lin wobble
 *   isolation, omega=10 cap robustness). This index bakes that split so a future scout can find, at a
 *   glance, which of the three groups each leaf belongs to.
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket already committed).
 *   - Sigma-landmark C_C-elasticity closed form confirmed at 5-point precision: +2.55535443 (L2),
 *     +2.10234724 (L3), +2.07902469 (L4) (imp-97642).
 *   - Three-axis diagonal DIAG3==0 exactly (scaling symmetry) forces E_CC+E_ET+E_CF==0; E_CF enters
 *     linearly via E_CF/E_ET = E_flow/E_trunc (imp-97644).
 *   - Krein edge-amplitude ratio validated to relerr ~1e-8/1e-9 at dps=40; relBias(3.36) sign
 *     resolvable ~7.25e7x above the intrinsic floor (imp-97643).
 *   - Route-M gap-law residual decay exponent q~7-9, climbing with height, PNT/Mertens strength, not
 *     a fixed inverse power (imp-97640).
 *   - w_lin linear-coefficient gap (~6e-3) is arithmetic-wobble contamination, not finite-b truncation
 *     (imp-97645).
 *   - omega=10 primorial-extremality gap (+7.52e-5) robust to divisor cap by >1.3e6x margin; MCM onset
 *     stays omega=11 (imp-97647).
 *
 *   NOT ESTABLISHED (what stays open at the end of this batch).
 *   - no new coercivity constant or positive lambda_2 lower bound anywhere in the Krein sub-family;
 *     interval-rigorous certified reach stays EXACTLY 2a<=0.96.
 *   - MCM stays verified-not-proved; onset stays omega=11, unchanged by imp-97647's robustness check.
 *   - the w_lin linear coefficient stays isolated only to ~6e-3, not pinned to -1/pi; the imp-97597
 *     RESULT 3 mixed-kernel sub-gap STANDS.
 *   - the imp-97640 gap-law residual ladder stays precision-limited past p~2e6 (IMP97640_RESIDUAL_
 *     DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6, unresolved by this batch).
 *
 *   STATUS: a grouping/index note over six already-completed tickets, not a new derivation. No bound
 *   changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-97642-l2-cc-elasticity-independent-verify.js (5-point stencil re-derivation of the C_C-elasticity closed form)
 * @see imp-97644-three-axis-additivity-flow-prefactor.js (DIAG3==0 scaling symmetry; forces E_CC+E_ET+E_CF==0)
 * @see imp-97643-krein-edge-floor-hiprec-crosscheck.js (dps=40 edge-amplitude and relBias(3.36) sign cross-check)
 * @see imp-97640-route-m-gap-law-residual-decay-exponent.js (gap-law residual decay exponent q~7-9, climbing)
 * @see imp-97645-wlin-largeb-linear-coeff-crossval.js (w_lin linear-coefficient wobble isolation at larger b)
 * @see imp-97647-route-m-mcm-omega10-cap-robustness.js (omega=10 primorial-extremality cap robustness)
 * @see imp-97594-krein-route-m-sigma-frontier-leaves-cohort-index.js (predecessor meta index: imp-97518..97563)
 *
 * Ticket: imp-97674 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein sub-cohort

const SIGMA_LANDMARK_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97642',
    step: 'independently re-derive the imp-97622 unified C_C-elasticity closed form with a 5-point stencil and refined eps ladder',
    result:
      'confirms E = +2.55535443 (L2), +2.10234724 (L3), +2.07902469 (L4); the imp-97598 4-digit match ' +
      'was a finite eps=0.01 overshoot, the true eps->0 limit is the closed form; E_flow flow share is ' +
      'the sole reason L2 is steeper than L3/L4.',
  }),
  Object.freeze({
    id: 'imp-97644',
    step: 'extend the imp-97623 two-axis (C_C/E_trunc) additivity to a third axis (the C_F flow prefactor)',
    result:
      'the three-axis diagonal DIAG3==0 EXACTLY (sigma is degree-0 homogeneous), which forces ' +
      'E_CC+E_ET+E_CF==0 by additivity; E_CF enters linearly via E_CF/E_ET = E_flow/E_trunc to ~2e-7 ' +
      'relative at every landmark -- the flow term does not break additivity, it completes the symmetry.',
  }),
]);

const KREIN_EDGE_FLOOR_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97643',
    step: 'recompute the far-field edge amplitudes g_pp(a), g_ppp(a) and the relBias(3.36) sign-change at mpmath dps=40',
    result:
      'validates the three-IBP closed forms to relerr 1.14e-8 (g_pp) / 2.42e-9 (g_ppp); the EXACT ' +
      'relBias(3.36) = -2.72717e-5 sits ~2.7e4x above the operational IEEE-double floor and ~7.25e7x ' +
      'above the INTRINSIC hi-prec floor (3.76e-13); the sign-change radius at Rc=1/a stays unresolvable below the floor.',
  }),
]);

const ROUTE_M_CAP_GAP_LAW_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97640',
    step: 'quantify the imp-97619 gap-law next-order residual decay rate q in |residual| ~ C/(log p)^q',
    result:
      'local exponent q ~ 7-9, CLIMBING with height (6.839 -> 8.713), outrunning every fixed inverse ' +
      'power of log p; correction is PNT/Mertens strength; ladder precision-limited past p~2e6.',
  }),
  Object.freeze({
    id: 'imp-97645',
    step: 're-run the imp-97618 Vasyunin double-sum limit at larger b (1e6, 2e6) to test the w_lin linear-coefficient isolation',
    result:
      'linear-coefficient error does NOT tighten toward -1/pi (non-monotone, plateaus at ~6e-3); w(x) ' +
      'is already b-converged at b=400000 -- the gap is arithmetic-wobble contamination on the fixed ' +
      'small-x fit grid, not a finite-b truncation artifact.',
  }),
  Object.freeze({
    id: 'imp-97647',
    step: 're-evaluate the imp-97606 omega=10 primorial-extremality gap at divisor caps d<=5000/10000 with the exact 1/(720 d^3) tail bound',
    result:
      'gap (+7.520579e-5) is ROBUST: shifts by only ~-1.3e-10 across the cap sweep, cap->infinity ' +
      'budget <5.69e-11 (~1.3e6x smaller than the gap); MCM onset stays exactly omega=11.',
  }),
]);

export const IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2 = Object.freeze({
  id: 'imp-97674',
  proofSection: 'S-frontier',
  sigmaLandmarkCohort: SIGMA_LANDMARK_SUBCOHORT,
  kreinCohort: KREIN_EDGE_FLOOR_SUBCOHORT,
  routeMCohort: ROUTE_M_CAP_GAP_LAW_SUBCOHORT,
  measuredSignal:
    'six late-frontier measurement/derivation leaves (imp-97640/97642/97643/97644/97645/97647), ' +
    'grouped by parent program: two Sigma-landmark elasticity leaves (5-point stencil re-derivation, ' +
    'three-axis scaling-symmetry proof), one Krein edge-floor leaf (dps=40 independent cross-check), ' +
    'and three Route-M leaves (gap-law decay-rate exponent, w_lin wobble isolation, omega=10 cap robustness).',
  namedResiduals: [
    'IMP97642_L2_CC_ELASTICITY_5POINT_CONFIRMED',
    'IMP97644_DIAG3_SCALING_SYMMETRY_FORCES_SUM_ZERO',
    'IMP97643_KREIN_EDGE_FLOOR_HIPREC_VALIDATED',
    'IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6',
    'IMP97645_WLIN_LINEAR_COEFF_WOBBLE_NOT_FINITE_B',
    'IMP97647_OMEGA10_CAP_GAP_ROBUST_TO_INFINITY',
  ],
  certifiedReach: 0.96,
  krein97643RelBiasExact336: -2.72717e-5,
  krein97643IntrinsicFloor: 3.76e-13,
  routeM97647GapAtCap1000: 7.520578537e-5,
  routeM97647MaxGapShiftCapToInfinity: 5.6805e-11,
  routeM97647OnsetOmega: 11,
  sigma97644DiagonalIsExactlyZero: true,
  sigma97642L2Elasticity: 2.55535443,
  lowerBoundOnLambda2Proved: false,
  coercivityConstantProved: false,
  mcmProved: false,
  wLinLinearCoefficientPinned: false,
  anyBoundMoved: false,
  question:
    'The six late-frontier leaves imp-97640/97642/97643/97644/97645/97647, committed after the ' +
    'imp-97594 index stopped at imp-97563, read as an undifferentiated batch. Split by program -- ' +
    'Sigma-landmark elasticity (imp-97642/97644) versus Krein edge-floor (imp-97643) versus Route-M ' +
    'cap/gap-law (imp-97640/97645/97647) -- does each group settle a distinct question with a distinct ' +
    'verdict, and does none move any bound?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The Sigma-landmark pair (imp-97642/97644) extends the ' +
    'C_C-elasticity closed form to a 5-point-stencil confirmation and then to a third (flow-prefactor) ' +
    'axis, proving the three-axis diagonal is an EXACT scaling symmetry (DIAG3==0) that forces the ' +
    'elasticity sum to vanish. The Krein leaf (imp-97643) independently validates the far-field edge ' +
    'amplitudes and the relBias(3.36) sign at mpmath dps=40, confirming the sign is resolvable ~7.25e7x ' +
    'above the intrinsic floor. The Route-M trio (imp-97640/97645/97647) settle three independent sub-' +
    'questions: the gap-law residual decay exponent climbs with height (PNT/Mertens strength, not a ' +
    'fixed power), the w_lin linear-coefficient gap is arithmetic-wobble contamination rather than ' +
    'finite-b truncation, and the omega=10 primorial-extremality gap is robust to the divisor cap by a ' +
    '~1.3e6x margin. No bound moves in any group: interval-rigorous certified reach stays EXACTLY ' +
    '2a<=0.96, MCM stays verified-not-proved with onset unchanged at omega=11, and the w_lin linear ' +
    'coefficient stays isolated only to ~6e-3, not pinned. RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97642 (5-point C_C-elasticity re-derivation); imp-97644 (three-axis DIAG3==0 scaling symmetry); ' +
    'imp-97643 (dps=40 Krein edge-floor cross-check); imp-97640 (gap-law residual decay exponent q~7-9); ' +
    'imp-97645 (w_lin linear-coefficient wobble isolation); imp-97647 (omega=10 cap robustness).',
  ln3: LN3,
});

export default IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2_ASSERTIONS = [
  {
    id: 'imp97674-sigma-landmark-subcohort-has-both-members',
    why: 'The whole point of the split is grouping exactly these two sigma-landmark leaves; a missing ' +
      'member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2.sigmaLandmarkCohort.map((c) => c.id);
      return ids.length === 2 && ids.includes('imp-97642') && ids.includes('imp-97644');
    },
  },
  {
    id: 'imp97674-krein-subcohort-has-the-one-member',
    why: 'The Krein split must contain exactly the one edge-floor leaf, not overlap the other groups.',
    holds: () => {
      const ids = IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2.kreinCohort.map((c) => c.id);
      return ids.length === 1 && ids.includes('imp-97643');
    },
  },
  {
    id: 'imp97674-routeM-subcohort-has-all-three-members',
    why: 'The Route-M split must contain exactly the three cap/gap-law leaves.',
    holds: () => {
      const ids = IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2.routeMCohort.map((c) => c.id);
      return (
        ids.length === 3 &&
        ids.includes('imp-97640') &&
        ids.includes('imp-97645') &&
        ids.includes('imp-97647')
      );
    },
  },
  {
    id: 'imp97674-six-tickets-total-no-overlap',
    why: 'The index covers exactly six tickets split into three disjoint groups; an overlap or a ' +
      'dropped ticket would misreport the batch.',
    holds: () => {
      const idx = IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2;
      const sigmaIds = idx.sigmaLandmarkCohort.map((c) => c.id);
      const kreinIds = idx.kreinCohort.map((c) => c.id);
      const routeMIds = idx.routeMCohort.map((c) => c.id);
      const allIds = [...sigmaIds, ...kreinIds, ...routeMIds];
      const noOverlap = new Set(allIds).size === allIds.length;
      return (
        sigmaIds.length + kreinIds.length + routeMIds.length === 6 &&
        noOverlap &&
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 6
      );
    },
  },
  {
    id: 'imp97674-routeM97647-gap-shift-far-below-gap',
    why: 'imp-97647 established the cap->infinity gap shift budget is orders of magnitude below the ' +
      'gap itself; the index must not misreport that margin.',
    holds: () => {
      const idx = IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2;
      return (
        idx.routeM97647MaxGapShiftCapToInfinity < idx.routeM97647GapAtCap1000 / 1e5 &&
        idx.routeM97647OnsetOmega === 11
      );
    },
  },
  {
    id: 'imp97674-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2.anyBoundMoved === false &&
      IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2.certifiedReach === 0.96 &&
      IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2.certifiedReach < IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2.ln3 &&
      /NO QED/.test(IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2.verdict) &&
      /refereed bound is changed/i.test(IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2.verdict) &&
      /2a<=0\.96/.test(IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2.verdict),
  },
];

for (const assertion of IMP97674_LATE_FRONTIER_LEAVES_COHORT_INDEX_2_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97674-late-frontier-leaves-cohort-index-2 assertion failed: ${assertion.id}`,
    );
  }
}
