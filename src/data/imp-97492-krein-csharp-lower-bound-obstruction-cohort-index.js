/**
 * @module imp-97492-krein-csharp-lower-bound-obstruction-cohort-index
 * @fileoverview imp-97492 -- META cross-reference index grouping the Krein c_sharp LOWER-bound
 *   OBSTRUCTION cohort: eight tickets (imp-97399, imp-97414, imp-97415, imp-97416, imp-97440,
 *   imp-97455, imp-97457, imp-97458) that chronologically attack a rigorous positive lower bound on
 *   c_sharp = lambda_min(P_a M_{sigma_2} P_a) at the binding half-width 2a = ln3, sharpening the best
 *   finite floor step by step while every route to POSITIVE stays blocked. Distinct from the sibling
 *   imp-97429 index (five tickets, grouped BY NAMED TOOL: Temple/Beurling-Selberg/Slepian/reproducing-
 *   kernel/Lehmann-Maehly numerical) -- this index instead tracks the CHRONOLOGICAL FLOOR-SHARPENING
 *   thread that follows the reproducing-kernel floor onward: joint bathtub estimate, full-projector
 *   Lehmann-Maehly execution (both m=1 and Route-2 lambda_2), and the two named residual quantifications
 *   (bathtub realizability gap, discarded positive far field) that finally explain why the measured
 *   c_sharp ~ 0.582 is positive while every scalar floor stays negative. Index/meta only; establishes
 *   nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (eight tickets, chronological, one continuous floor-sharpening + obstruction-naming thread).
 *     imp-97399 -- reproducing-kernel (Bernstein pointwise) concentration budget. NEW finite floor
 *       c_sharp >= -3200.029, improving the naive symbol-infimum floor -4336.198 by +1136.169.
 *     imp-97414 -- BUILDS the genuine full band-projector second moment A2 and re-runs the m=1
 *       Lehmann-Maehly bracket. CLOSES that residual hope: the bracket collapses to vacuity because
 *       P_a M_sigma2 P_a is unbounded above, independent of the large (82.547) spectral gap.
 *     imp-97415 -- ASSESSES all three standard routes to a certified a-priori lower bound rho <= lambda_2
 *       needed to make the m=1 enclosure usable. All three fail; best certified rho is -4336.198, four
 *       orders below the required 0.581059.
 *     imp-97416 -- ATTEMPTS the joint bathtub / water-filling estimate (pointwise budget + mass
 *       normalisation together). NEW finite floor c_sharp >= -3065.435, improving imp-97399 by +134.594,
 *       but names the two remaining residual obstructions: unrealizability and the discarded far field.
 *     imp-97440 -- EXECUTES the imp-97415 Route-2 Lehmann-Maehly recursion for lambda_2 on the genuine
 *       full-projector A2. CONFIRMS Route 2 as an unbounded regress: best reachable rho worsens
 *       -196.863 -> -275.500 as Kbig grows 44 -> 76, never approaching 0.581059.
 *     imp-97455 -- MEASURES the Kbig -> infinity limit of that Route-2 bound. It SATURATES at a finite
 *       floor ~ -305 (bracket [-322,-306]), correcting the naive reading of unbounded divergence.
 *     imp-97457 -- MEASURES the bathtub realizability gap named by imp-97416: the best genuinely
 *       band-limited psi attains only 43.84% of the bathtub envelope, giving a realizable negative-part
 *       floor c_sharp >= -1343.796 (a measured, not interval-certified, +1721.639 above -3065.435).
 *     imp-97458 -- QUANTIFIES the discarded t^4 positive far field named by imp-97416: a finite inner
 *       positive island (2511.030, full line) plus an unbounded far tail (~T^5 ln T / 5), the term every
 *       sigma_2^- scalar floor discards and the reason the true c_sharp is positive.
 *
 *   WHY GROUP THESE (not re-derive). Read separately, these eight tickets look like eight independent
 *   attacks across different sessions. Read together they are ONE continuous thread: each ticket either
 *   sharpens the best NEGATIVE floor reached so far (imp-97399 -3200.029 -> imp-97416 -3065.435 ->
 *   imp-97457 -1343.796, the realizable reading) or closes off a named route to POSITIVE (imp-97414 closes
 *   m=1 Lehmann; imp-97415 closes the certified-rho precondition; imp-97440/97455 close Route-2 Lehmann,
 *   confirmed and then measured as a finite -305 saturation) or explains the residual gap quantitatively
 *   (imp-97457 realizability, imp-97458 far field). This index bakes that reading so a future scout does
 *   not re-attempt the m=1 or Route-2 Lehmann-Maehly enclosures expecting a different verdict, and knows
 *   the two named residual shares of the gap to the measured c_sharp ~ 0.582: realizability (+1721.639,
 *   56.2%) and the discarded far field (+1344.378, 43.8%).
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket already committed).
 *   - reproducing-kernel pointwise budget: floor -3200.029 (imp-97399).
 *   - full-projector A2 build closes the m=1 Lehmann-Maehly residual hope: vacuous, not viable (imp-97414).
 *   - all three certified-lower-bound-on-lambda_2 routes fail; best certified rho -4336.198 (imp-97415).
 *   - joint bathtub/water-filling estimate: floor -3065.435, +134.594 over imp-97399 (imp-97416).
 *   - Route-2 Lehmann-Maehly execution: confirmed unbounded regress in the finite Kbig range tried
 *     (imp-97440).
 *   - Route-2 Kbig->infinity limit: saturates at a finite floor ~-305, not a divergence (imp-97455).
 *   - bathtub realizability gap: measured realizable floor -1343.796, 43.84% of the -3065.435 envelope
 *     (imp-97457).
 *   - discarded t^4 positive far field: quantified finite inner island 2511.030 + unbounded far tail
 *     ~T^5 ln T / 5 (imp-97458).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - no rigorous positive lower bound on c_sharp exists anywhere in this cohort; every route ends at a
 *     finite NEGATIVE floor, a closed-off precondition, or a measured (not interval-certified) residual.
 *   - the best RIGOROUS (interval-style, non-realizability) floor across the cohort is -3065.435
 *     (imp-97416); the best MEASURED realizable floor is -1343.796 (imp-97457, IEEE-double, not an
 *     enclosure); the measured upper bracket stays ~0.581059-0.582 (imp-97206/97379/97405).
 *   - interval-rigorous certified reach stays EXACTLY 2a<=0.96, unchanged by this whole cohort.
 *
 *   STATUS: a grouping/index note over eight already-completed tickets, not a new derivation. No bound
 *   changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (reproducing-kernel; floor -3200.029)
 * @see imp-97414-krein-full-projector-second-moment-execution.js (full-projector A2 build; closes m=1 Lehmann)
 * @see imp-97415-krein-lambda2-certified-lower-bound-assessment.js (all three certified-rho routes fail)
 * @see imp-97416-krein-csharp-bathtub-joint-floor.js (joint bathtub estimate; floor -3065.435)
 * @see imp-97440-krein-route2-lambda2-lower-bound-execution.js (Route-2 Lehmann-Maehly; regress confirmed)
 * @see imp-97455-krein-route2-kbig-divergence-rate.js (Route-2 Kbig->inf; saturates ~-305)
 * @see imp-97457-krein-bathtub-realizability-gap.js (realizability gap; measured floor -1343.796)
 * @see imp-97458-krein-csharp-discarded-positive-far-field.js (discarded far field, quantified)
 * @see imp-97429-krein-csharp-lower-bound-attempt-cohort-index.js (sibling meta index: same target grouped BY NAMED TOOL, not chronological floor-sharpening)
 *
 * Ticket: imp-97492 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

const KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97399',
    step: 'reproducing-kernel (Bernstein pointwise) concentration budget',
    result: 'NEW finite floor c_sharp >= -3200.029, improving the naive -4336.198 floor by +1136.169.',
  }),
  Object.freeze({
    id: 'imp-97414',
    step: 'build the genuine full band-projector second moment A2; re-run the m=1 Lehmann-Maehly bracket',
    result:
      'CLOSES the m=1 residual hope: the bracket collapses to vacuity (unbounded-above operator), ' +
      'independent of the large 82.547 spectral gap.',
  }),
  Object.freeze({
    id: 'imp-97415',
    step: 'assess all three routes to a certified a-priori lower bound rho <= lambda_2',
    result:
      'all three fail; best certified rho is -4336.198, four orders below the required 0.581059 -- ' +
      'the m=1 enclosure stays unusable.',
  }),
  Object.freeze({
    id: 'imp-97416',
    step: 'joint bathtub / water-filling estimate (pointwise budget + mass normalisation together)',
    result:
      'NEW finite floor c_sharp >= -3065.435, +134.594 over imp-97399; names the realizability and ' +
      'discarded-far-field residuals.',
  }),
  Object.freeze({
    id: 'imp-97440',
    step: 'execute the Route-2 Lehmann-Maehly recursion for lambda_2 on the genuine full-projector A2',
    result:
      'CONFIRMS Route 2 as an unbounded regress: best reachable rho worsens -196.863 -> -275.500 as ' +
      'Kbig 44 -> 76.',
  }),
  Object.freeze({
    id: 'imp-97455',
    step: 'measure the Kbig -> infinity limit of the Route-2 bound',
    result: 'SATURATES at a finite floor ~-305 (bracket [-322,-306]); does not diverge.',
  }),
  Object.freeze({
    id: 'imp-97457',
    step: 'measure the imp-97416 bathtub realizability gap',
    result:
      'best realizable band-limited psi attains only 43.84% of the bathtub envelope; realizable floor ' +
      'c_sharp >= -1343.796 (measured, not interval-certified).',
  }),
  Object.freeze({
    id: 'imp-97458',
    step: 'quantify the imp-97416 discarded t^4 positive far field',
    result:
      'finite inner positive island 2511.030 (full line) plus an unbounded far tail ~T^5 ln T / 5 -- the ' +
      'term every sigma_2^- scalar floor discards.',
  }),
]);

export const IMP97492_KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT_INDEX = Object.freeze({
  id: 'imp-97492',
  proofSection: 'S-frontier',
  cohort: KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT,
  measuredSignal:
    'eight chronological tickets sharpen the best finite floor on c_sharp = lambda_min(P_a M_{sigma_2} P_a) ' +
    'at 2a=ln3 from -3200.029 (imp-97399) to -3065.435 (imp-97416, rigorous) to -1343.796 (imp-97457, ' +
    'measured realizable), while closing off both the m=1 (imp-97414) and Route-2 (imp-97440/97455) ' +
    'Lehmann-Maehly enclosures and quantifying the two residual gap shares (imp-97457, imp-97458).',
  namedResiduals: [
    'IMP97399_REPRODUCING_KERNEL_FLOOR_STILL_NEGATIVE',
    'IMP97414_M1_LEHMANN_VACUOUS_NEEDS_HIGHER_ORDER_OR_SPECTRAL_WINDOW',
    'IMP97415_ALL_CERTIFIED_RHO_ROUTES_FAIL',
    'IMP97416_BATHTUB_JOINT_FLOOR_STILL_NEGATIVE',
    'IMP97440_ROUTE2_LEHMANN_UNBOUNDED_REGRESS',
    'IMP97455_ROUTE2_KBIG_LIMIT_FINITE_FLOOR_NOT_DIVERGENT',
    'IMP97457_BATHTUB_REALIZABILITY_GAP_MEASURED_NOT_CERTIFIED',
    'IMP97458_DISCARDED_TFOURTH_FAR_FIELD_QUANTIFIED',
  ],
  certifiedReach: 0.96,
  bestRigorousFloor: -3065.435,
  bestMeasuredRealizableFloor: -1343.796,
  bestMeasuredUpperBracket: 0.581059,
  distinctFromImp97429ToolCohort: true,
  lowerBoundOnCSharpProved: false,
  question:
    'The Krein c_sharp lower-bound obstruction cohort (imp-97399/97414/97415/97416/97440/97455/97457/' +
    '97458) reads as eight separate leaves across several sessions. Read chronologically as one floor-' +
    'sharpening thread, does the record show the best rigorous floor reaching only -3065.435, the best ' +
    'measured (non-certified) realizable floor -1343.796, and both named Lehmann-Maehly routes to a ' +
    'positive lower bound closed off?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). Eight tickets chronologically sharpen the best finite ' +
    'floor on c_sharp = lambda_min(P_a M_{sigma_2} P_a) at 2a=ln3: reproducing-kernel floor -3200.029 ' +
    '(imp-97399); joint bathtub/water-filling floor -3065.435 (imp-97416, the best RIGOROUS scalar ' +
    'floor in this cohort); the measured (not interval-certified) realizable floor -1343.796 (imp-97457). ' +
    'In parallel, both the m=1 (imp-97414) and Route-2 (imp-97440, saturating at ~-305 per imp-97455) ' +
    'Lehmann-Maehly enclosures are shown non-viable, and imp-97415 shows every certified-rho precondition ' +
    'route fails. imp-97458 quantifies the discarded t^4 positive far field that finally explains why the ' +
    'measured c_sharp ~ 0.582 is positive while every scalar floor in this cohort stays negative. Distinct ' +
    'from the sibling imp-97429 index, which groups five DIFFERENT tickets by named tool rather than this ' +
    'chronological floor-sharpening thread. No rigorous positive lower bound on c_sharp exists anywhere in ' +
    'this cohort; interval-rigorous certified reach stays EXACTLY 2a<=0.96, unchanged. Establishes nothing ' +
    'new; moves no bound; RH open; NO QED. No refereed bound is changed.',
  citation:
    'imp-97399 (reproducing-kernel; floor -3200.029); imp-97414 (full-projector build; closes m=1 ' +
    'Lehmann); imp-97415 (certified-rho routes all fail); imp-97416 (joint bathtub; floor -3065.435); ' +
    'imp-97440 (Route-2 Lehmann execution; regress confirmed); imp-97455 (Route-2 Kbig->inf; saturates ' +
    '~-305); imp-97457 (realizability gap; measured floor -1343.796); imp-97458 (discarded far field, ' +
    'quantified).',
  ln3: LN3,
});

export default IMP97492_KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97492_KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97492-cohort-has-all-eight-members-in-order',
    why: 'The whole point of the index is grouping exactly these eight tickets in chronological order; a ' +
      'missing or reordered member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97492_KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT_INDEX.cohort.map((c) => c.id);
      return (
        ids.length === 8 &&
        ids[0] === 'imp-97399' &&
        ids[1] === 'imp-97414' &&
        ids[2] === 'imp-97415' &&
        ids[3] === 'imp-97416' &&
        ids[4] === 'imp-97440' &&
        ids[5] === 'imp-97455' &&
        ids[6] === 'imp-97457' &&
        ids[7] === 'imp-97458'
      );
    },
  },
  {
    id: 'imp97492-named-residuals-and-floors-present',
    why: 'The index exists to surface the open sub-gaps and the best floors by name, so future work can ' +
      'find them without re-reading all eight tickets.',
    holds: () => {
      const idx = IMP97492_KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 8 &&
        idx.distinctFromImp97429ToolCohort === true &&
        idx.lowerBoundOnCSharpProved === false &&
        idx.bestRigorousFloor === -3065.435 &&
        idx.bestRigorousFloor < 0 &&
        idx.bestMeasuredRealizableFloor === -1343.796 &&
        idx.bestMeasuredRealizableFloor > idx.bestRigorousFloor &&
        idx.bestMeasuredRealizableFloor < 0 &&
        idx.bestMeasuredUpperBracket > 0 &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach < idx.ln3
      );
    },
  },
  {
    id: 'imp97492-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97492_KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97492_KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97492_KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97492_KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97492_KREIN_CSHARP_LOWER_BOUND_OBSTRUCTION_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97492-krein-csharp-lower-bound-obstruction-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
