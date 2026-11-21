/**
 * @module imp-97594-krein-route-m-sigma-frontier-leaves-cohort-index
 * @fileoverview imp-97594 -- META cross-reference index grouping the five late-frontier leaves
 *   (imp-97518, imp-97519, imp-97520, imp-97538, imp-97563) into their parent programs -- Krein
 *   (c_sharp lower-bound attack at 2a=ln3), Route-M (b/4-ceiling / MCM / bulk-profile-curvature
 *   attack), and the standalone Sigma-landmark tabulation -- with each leaf's one-line verdict,
 *   extending the imp-97527 index that stops at imp-97495..97502. Index/meta only; establishes
 *   nothing new; changes no bound; NO QED.
 *
 *   THE KREIN SUB-COHORT (two tickets, both on the c_sharp lower-bound attack at 2a=ln3;
 *   interval-rigorous certified reach stays 2a<=0.96 throughout).
 *     imp-97518 -- derives in CLOSED FORM the imp-97497 endpoint-asymptotic far profile:
 *       psi_R(t) ~ -(1/pi) g_pp(a) sin(a t)/t^3 with g_pp(a) = (8/a^2)exp(-(Ra)^2/2) EXACTLY (three
 *       IBPs of the finite cosine transform), and the next-order 1/t^4 bias, accounting for the
 *       <1e-3 error bar imp-97497 attached numerically. Derivation only; no bound moves.
 *     imp-97538 -- extends the direct Route-2 A2 projector-limit build past imp-97513's Kbig=500
 *       edge to Kbig in {560,640,720}: tightens the upper edge further to -310.692227 (bracket
 *       [-313.756,-310.692227]), but the delta ratio still has NOT plateaued (0.771 -> 0.829),
 *       still four orders below the required 0.581059.
 *
 *   THE ROUTE-M SUB-COHORT (two tickets, the MCM base-term and bulk-profile-curvature attacks).
 *     imp-97519 -- spot-checks the imp-97499 predicted 0.043 crossing by direct exact-kernel
 *       evaluation at x~1.2737e31 (fourteen-plus decades past the x=1e14 baked ladder): confirms
 *       c*x/ln x = 0.043 to 1e-67, residual = M0/ln x to 64 digits, drift genuinely 1/ln x not
 *       power-law. MCM stays VERIFIED at omega<=6, not proved.
 *     imp-97563 -- assesses the exact Bettin-Conrey reciprocity split of the cotangent sum V(b,a)
 *       (named by imp-97460 as the only route to separate kappa_smooth from the wobble): the split
 *       isolates the smooth period function psi, but psi's own cusp coefficient kappa_smooth is
 *       recoverable ONLY as a Gauss-Kuzmin AVERAGE, never pointwise -- w_sym is a quantum modular
 *       form whose value does not extend continuously to the reals.
 *
 *   THE SIGMA-LANDMARK LEAF (one ticket, a roadmap tabulation, not on either c_sharp or Route-M).
 *     imp-97520 -- tabulates the E(N) conditional-share sigma(N) = E_coll/E_N landmark ladder
 *       (interior peak ~9.22e5, below-0.9 ~2.57e7, halving ~3.27e9, below-0.1 ~3.21e11) as one
 *       strictly-increasing cross-validated object spanning ~5.54 decades, and cross-checks the
 *       halving landmark against the imp-33723 closed-form N_cross to ~0.4%, attributing the
 *       offset to the Gronwall E_flow gap (E_flow/E_trunc ~1.91e-3 at N_half).
 *
 *   WHY GROUP THESE (not re-derive). All five are late-frontier leaves committed in immediate
 *   succession that read, on their own, as an undifferentiated batch continuing past the imp-97527
 *   index's stopping point (imp-97502). Grouped by parent program, the Krein pair form one
 *   continuing c_sharp-lower-bound-attack sweep (a closed-form tail derivation, plus a deeper
 *   direct-build floor tightening), the Route-M pair settle two independent sub-questions on the
 *   sibling program (MCM base-term drift law, bulk-profile-curvature reciprocity split), and the
 *   Sigma-landmark leaf is a standalone roadmap tabulation. This index bakes that split so a future
 *   scout can find, at a glance, which of the three groups each leaf belongs to.
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket already
 *   committed).
 *   - Krein far-profile tail: closed-form psi_R(t) ~ -(1/pi) g_pp(a) sin(a t)/t^3 proved via three
 *     IBPs, g_pp(a) = (8/a^2)exp(-(Ra)^2/2) EXACTLY (imp-97518).
 *   - Krein Route-2 Kbig floor tightened to bracket [-313.756,-310.692227] at Kbig=720, ratio still
 *     rising (imp-97538); supersedes the imp-97527/imp-97513 edge -310.375499.
 *   - Route-M MCM 0.043 crossing confirmed by direct exact-kernel evaluation at x~1.2737e31, drift
 *     genuinely 1/ln x (imp-97519).
 *   - Route-M bulk-profile curvature: reciprocity split isolates the smooth period psi, but its
 *     cusp coefficient kappa_smooth is recoverable only as a Gauss-Kuzmin average, never pointwise
 *     (imp-97563).
 *   - Sigma(N) landmark ladder tabulated as one cross-validated object; halving landmark matches
 *     the imp-33723 closed form to ~0.4%, offset = Gronwall E_flow gap (imp-97520).
 *
 *   NOT ESTABLISHED (what stays open at the end of this batch).
 *   - no rigorous positive lower bound on lambda_2 anywhere in the Krein Route-2 sub-family; the
 *     floor stays negative and four orders below 0.581059.
 *   - MCM stays VERIFIED at omega<=6 only, not proved; already FALSE at omega=11 (imp-97432).
 *   - kappa_smooth stays an upper-bounded (<~1e-2), uncomputed pointwise quantity, not pinned.
 *   - interval-rigorous certified reach stays EXACTLY 2a<=0.96, unchanged by any of the five leaves.
 *
 *   STATUS: a grouping/index note over five already-completed tickets, not a new derivation. No
 *   bound changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-97518-krein-tail-endpoint-asymptotic-closed-form.js (closed-form far-profile tail)
 * @see imp-97538-krein-route2-kbig560-720-deep-floor.js (Route-2 Kbig={560,640,720}; tightens to -310.692227)
 * @see imp-97519-route-m-mcm-baseterm-043-crossing-spotcheck.js (direct-kernel 0.043 crossing spot-check)
 * @see imp-97563-route-m-bettin-conrey-reciprocity-split-assessment.js (reciprocity split: average-only separation)
 * @see imp-97520-sigma-conditional-share-landmark-ladder.js (four-landmark sigma(N) ladder + halving cross-check)
 * @see imp-97527-krein-route-m-frontier-leaves-cohort-index.js (predecessor meta index: imp-97495..97502)
 *
 * Ticket: imp-97594 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein sub-cohort

const KREIN_FRONTIER_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97518',
    step: 'derive in closed form the imp-97497 endpoint-asymptotic far-profile tail constant and its next-order bias',
    result:
      'three IBPs of the finite cosine transform prove psi_R(t) ~ -(1/pi) g_pp(a) sin(a t)/t^3 with ' +
      'g_pp(a) = (8/a^2)exp(-(Ra)^2/2) EXACTLY; the next-order 1/t^4 bias accounts for the imp-97497 < 1e-3 error bar.',
  }),
  Object.freeze({
    id: 'imp-97538',
    step: 'extend the direct Route-2 A2 projector-limit build past Kbig=500 to {560,640,720}',
    result:
      'tightens the upper edge to -310.692227 (bracket [-313.756,-310.692227]); delta ratio still RISING ' +
      '(0.771 -> 0.829), not plateaued; still four orders below the required 0.581059.',
  }),
]);

const ROUTE_M_FRONTIER_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97519',
    step: 'spot-check the imp-97499 predicted 0.043 MCM base-term crossing by direct exact-kernel evaluation at x~1.2737e31',
    result:
      'confirms c*x/ln x = 0.043 to 1e-67, residual = M0/ln x to 64 digits, fourteen-plus decades past the ' +
      'x=1e14 baked ladder; drift genuinely 1/ln x, not power-law.',
  }),
  Object.freeze({
    id: 'imp-97563',
    step: 'assess whether the exact Bettin-Conrey reciprocity split of V(b,a) separates kappa_smooth from the wobble',
    result:
      'the split isolates the smooth period function psi, but psi is a quantum modular form whose value does ' +
      'not extend continuously to the reals; kappa_smooth recoverable only as a Gauss-Kuzmin AVERAGE, never pointwise.',
  }),
]);

const SIGMA_LANDMARK_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97520',
    step: 'tabulate the sigma(N) = E_coll/E_N conditional-share landmark ladder as one cross-validated object',
    result:
      'four scattered roadmap landmarks (peak ~9.22e5, below-0.9 ~2.57e7, halving ~3.27e9, below-0.1 ~3.21e11) ' +
      'reproduce as one strictly-increasing object; halving matches the imp-33723 closed form to ~0.4%, offset ' +
      'attributed to the Gronwall E_flow gap.',
  }),
]);

export const IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX = Object.freeze({
  id: 'imp-97594',
  proofSection: 'S-frontier',
  kreinCohort: KREIN_FRONTIER_SUBCOHORT,
  routeMCohort: ROUTE_M_FRONTIER_SUBCOHORT,
  sigmaLandmarkCohort: SIGMA_LANDMARK_SUBCOHORT,
  measuredSignal:
    'five late-frontier measurement/derivation leaves (imp-97518/97519/97520/97538/97563), grouped by parent ' +
    'program: two Krein c_sharp-lower-bound-attack leaves (closed-form tail derivation, deeper Route-2 floor), ' +
    'two Route-M leaves (MCM 0.043 crossing spot-check, bulk-profile-curvature reciprocity split), and one ' +
    'standalone sigma(N) landmark tabulation.',
  namedResiduals: [
    'IMP97518_TAIL_ENDPOINT_ASYMPTOTIC_CLOSED_FORM',
    'IMP97538_ROUTE2_FLOOR_DEEP_END_STILL_EXTRAPOLATED',
    'IMP97519_MCM_BASETERM_RESIDUAL_M0_OVER_LNX_CONFIRMED_DIRECT',
    'IMP97563_KAPPA_SMOOTH_AVERAGE_ONLY_SEPARATION',
    'IMP97520_SIGMA_LANDMARK_LADDER_HALVING_CROSSVALIDATED',
  ],
  certifiedReach: 0.96,
  requiredRhoExceeds: 0.581059,
  krein97538TightenedBracket: [-313.756, -310.692227], // supersedes imp-97527/imp-97513 edge -310.375499
  krein97527PriorBracket: [-313.756, -310.375499],
  routeM97519Crossing043At: 1.27372e31,
  routeM97563KappaSmoothUpper: 1e-2,
  sigma97520HalvingRelOffset: 3.98e-3,
  lowerBoundOnLambda2Proved: false,
  coercivityConstantProved: false,
  mcmProved: false,
  kappaSmoothPinnedPointwise: false,
  anyBoundMoved: false,
  question:
    'The five late-frontier leaves imp-97518/97519/97520/97538/97563, committed after the imp-97527 index ' +
    'stopped at imp-97502, read as an undifferentiated batch. Split by program -- Krein (imp-97518/97538) ' +
    'versus Route-M (imp-97519/97563) versus the standalone Sigma-landmark leaf (imp-97520) -- does each ' +
    'group settle a distinct question with a distinct verdict, and does none move any bound?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The Krein pair (imp-97518/97538) continues the c_sharp-lower-' +
    'bound-attack sweep at 2a=ln3: the endpoint-asymptotic far-profile tail is now PROVED in closed form ' +
    '(imp-97518), and the direct Route-2 Kbig build tightens further to bracket [-313.756,-310.692227] at ' +
    'Kbig=720, still not plateaued and four orders below 0.581059 (imp-97538). The Route-M pair (imp-97519/' +
    'imp-97563) settle two independent sub-questions: the MCM 0.043 crossing is confirmed by direct exact-' +
    'kernel evaluation fourteen-plus decades past the baked ladder (imp-97519), and the Bettin-Conrey ' +
    'reciprocity split separates the smooth bulk-profile curvature from the arithmetic wobble only as a ' +
    'Gauss-Kuzmin average, never pointwise (imp-97563). The standalone Sigma-landmark leaf (imp-97520) ' +
    'tabulates the four sigma(N) landmarks as one cross-validated object, with the halving landmark matching ' +
    'the imp-33723 closed form to ~0.4%. No bound moves in any group: interval-rigorous certified reach stays ' +
    'EXACTLY 2a<=0.96, MCM stays verified-not-proved, kappa_smooth stays upper-bounded not pinned, and no ' +
    'coercivity constant or positive lambda_2 lower bound results. RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97518 (closed-form far-profile tail); imp-97538 (Route-2 Kbig={560,640,720}; tightens to ' +
    '-310.692227); imp-97519 (direct-kernel 0.043 crossing spot-check); imp-97563 (reciprocity split, ' +
    'average-only separation); imp-97520 (sigma(N) four-landmark ladder, halving cross-check).',
  ln3: LN3,
});

export default IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97594-krein-subcohort-has-both-members',
    why: 'The whole point of the split is grouping exactly these two Krein leaves; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX.kreinCohort.map((c) => c.id);
      return ids.length === 2 && ids.includes('imp-97518') && ids.includes('imp-97538');
    },
  },
  {
    id: 'imp97594-routeM-subcohort-has-both-members',
    why: 'The Route-M split must contain exactly the two MCM/reciprocity leaves, not overlap the Krein set.',
    holds: () => {
      const ids = IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX.routeMCohort.map((c) => c.id);
      return ids.length === 2 && ids.includes('imp-97519') && ids.includes('imp-97563');
    },
  },
  {
    id: 'imp97594-five-tickets-total-no-overlap',
    why: 'The index covers exactly five tickets split into three disjoint groups; an overlap or a dropped ' +
      'ticket would misreport the batch.',
    holds: () => {
      const idx = IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX;
      const kreinIds = idx.kreinCohort.map((c) => c.id);
      const routeMIds = idx.routeMCohort.map((c) => c.id);
      const sigmaIds = idx.sigmaLandmarkCohort.map((c) => c.id);
      const allIds = [...kreinIds, ...routeMIds, ...sigmaIds];
      const noOverlap = new Set(allIds).size === allIds.length;
      return (
        kreinIds.length + routeMIds.length + sigmaIds.length === 5 &&
        noOverlap &&
        sigmaIds.length === 1 &&
        sigmaIds.includes('imp-97520') &&
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 5
      );
    },
  },
  {
    id: 'imp97594-krein97538-tightens-past-97527-edge',
    why: 'imp-97538 extends the same direct Route-2 build past the imp-97527/imp-97513 edge to deeper ' +
      'Kbig, and the monotone-decreasing upper edge must strictly tighten (drop below) the prior upper edge.',
    holds: () => {
      const idx = IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX;
      return (
        idx.krein97538TightenedBracket[1] < idx.krein97527PriorBracket[1] &&
        idx.krein97538TightenedBracket[1] < idx.requiredRhoExceeds
      );
    },
  },
  {
    id: 'imp97594-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX.anyBoundMoved === false &&
      IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX.certifiedReach === 0.96 &&
      IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX.certifiedReach < IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX.ln3 &&
      /NO QED/.test(IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97594_KREIN_ROUTE_M_SIGMA_FRONTIER_LEAVES_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97594-krein-route-m-sigma-frontier-leaves-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
