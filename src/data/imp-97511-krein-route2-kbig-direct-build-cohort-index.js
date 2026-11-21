/**
 * @module imp-97511-krein-route2-kbig-direct-build-cohort-index
 * @fileoverview imp-97511 -- META cohort-index note grouping the Krein Route-2 Kbig DIRECT-BUILD
 *   finite-floor EXECUTION sub-family: four tickets (imp-97414, imp-97440, imp-97455, imp-97482) that
 *   build the genuine full band-projector second moment A2 = <P_a M_sigma2 P_a phi_i, P_a M_sigma2 P_a
 *   phi_j> at 2a=ln3, execute the Route-2 Lehmann-Maehly recursion for a certified lower bound on
 *   lambda_2 on it, and then measure the Kbig->infinity limit of that bound directly (not merely by
 *   extrapolation). Narrower and more specific than the sibling imp-97492 eight-ticket obstruction
 *   cohort (which spans the WHOLE c_sharp lower-bound attack, m=1 AND Route-2, plus bathtub and far-field
 *   residuals) -- this index tracks only the ONE continuous Route-2 A2-build-and-measure thread. Index/
 *   meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE SUB-FAMILY (four tickets, chronological, one continuous build-then-measure thread).
 *     imp-97414 -- BUILDS the genuine full band-projector second moment A2 (enlarged-basis
 *       reproducing-kernel projection A2 = A1_{NxKbig} G_{Kbig}^{-1} A1_{KbigxN}, Kbig->infinity the full
 *       projector limit). Re-runs the m=1 Lehmann-Maehly bracket on it: CLOSES that residual hope, the
 *       bracket collapses to vacuity because P_a M_sigma2 P_a is unbounded above.
 *     imp-97440 -- EXECUTES the Route-2 Lehmann-Maehly recursion for a certified lower bound on lambda_2
 *       on that same A2. Kbig=N reproduces the circular Ritz value exactly; past Kbig=N the bound goes
 *       hopelessly negative and worsens MONOTONICALLY: -196.863 (Kbig=44) -> -245.345 (60) -> -275.500
 *       (76).
 *     imp-97455 -- MEASURES the Kbig->infinity behaviour of that worsening sequence by extending the
 *       sweep to {44..140}. It SATURATES at a finite floor (bracket [-322.065,-305.866]), correcting the
 *       naive reading of an unbounded regress into a convergent one.
 *     imp-97482 -- VERIFIES the imp-97455 saturation by extending the SAME direct A2 build past Kbig=140
 *       to {140,180,220,260}, reading the floor directly rather than by geometric extrapolation. Confirms
 *       the finite floor and TIGHTENS the bracket to [-313.756,-308.745].
 *
 *   WHY GROUP THESE (not re-derive). Read separately, these four tickets look like four independent
 *   numerical runs. Read together they are ONE continuous thread on a single executed A2 build: imp-97414
 *   builds the primitive and closes m=1; imp-97440 turns Route-2 into measured numbers on it; imp-97455
 *   asks what happens as Kbig grows without bound and finds saturation, not divergence; imp-97482 checks
 *   that saturation claim by building further rather than trusting the extrapolation, and tightens the
 *   bracket. This index bakes that reading so a future scout does not re-attempt the m=1 or Route-2
 *   Lehmann-Maehly enclosures on this A2 expecting a different verdict, and knows the floor tightened
 *   monotonically across the sub-family: -305 (imp-97455 central) -> [-313.756,-308.745] (imp-97482).
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket already committed).
 *   - full-projector A2 build closes the m=1 Lehmann-Maehly residual hope: vacuous, not viable (imp-97414).
 *   - Route-2 Lehmann-Maehly execution on that A2: confirmed unbounded-looking regress in the finite Kbig
 *     range first tried, 44->76 (imp-97440).
 *   - Route-2 Kbig->infinity limit: SATURATES at a finite floor, bracket [-322.065,-305.866], not a
 *     divergence (imp-97455).
 *   - direct build past Kbig=140 to 260: CONFIRMS saturation and TIGHTENS the bracket to
 *     [-313.756,-308.745], strictly inside the imp-97455 bracket (imp-97482).
 *
 *   NOT ESTABLISHED (what stays open at the end of this sub-family).
 *   - no rigorous positive lower bound on lambda_2 exists anywhere in this sub-family; Route-2 ends at a
 *     finite NEGATIVE floor, roughly four orders below the required 0.581059.
 *   - the converged Kbig->infinity floor is still not pinned exactly: the imp-97482 tightened bracket
 *     [-313.756,-308.745] rests on a directly-measured upper edge (-308.745, rigorous given monotonicity)
 *     plus two extrapolators for the lower edge, named residual
 *     IMP97482_ROUTE2_FLOOR_STILL_EXTRAPOLATED_BELOW_KBIG260.
 *   - interval-rigorous certified reach stays EXACTLY 2a<=0.96, unchanged by this whole sub-family.
 *   - later tickets (imp-97495, imp-97513, and the imp-97547/imp-97555 status updates) continue pushing
 *     this same Route-2 Kbig direct-build past Kbig=260 and tighten the floor further (toward ~-310.375);
 *     this index covers only the imp-97414/97440/97455/97482 sub-family as named by the ticket, not that
 *     later continuation.
 *
 *   STATUS: a grouping/index note over four already-completed tickets, not a new derivation. No bound
 *   changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-97414-krein-full-projector-second-moment-execution.js (builds A2; closes m=1 Lehmann)
 * @see imp-97440-krein-route2-lambda2-lower-bound-execution.js (Route-2 Lehmann execution on A2)
 * @see imp-97455-krein-route2-kbig-divergence-rate.js (Kbig->inf saturation; bracket [-322.065,-305.866])
 * @see imp-97482-krein-route2-kbig-direct-projector-floor.js (direct build past 140; tightens to [-313.756,-308.745])
 * @see imp-97492-krein-csharp-lower-bound-obstruction-cohort-index.js (sibling meta index: broader eight-ticket obstruction cohort spanning m=1, Route-2, bathtub, far-field)
 *
 * Ticket: imp-97511 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

const KREIN_ROUTE2_KBIG_DIRECT_BUILD_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97414',
    step: 'build the genuine full band-projector second moment A2; re-run the m=1 Lehmann-Maehly bracket',
    result:
      'CLOSES the m=1 residual hope: the bracket collapses to vacuity (P_a M_sigma2 P_a unbounded above), ' +
      'independent of the large 82.547 spectral gap.',
  }),
  Object.freeze({
    id: 'imp-97440',
    step: 'execute the Route-2 Lehmann-Maehly recursion for lambda_2 on the genuine full-projector A2',
    result:
      'CONFIRMS an apparently unbounded regress in the range first tried: best reachable bound worsens ' +
      '-196.863 -> -245.345 -> -275.500 as Kbig 44 -> 60 -> 76.',
  }),
  Object.freeze({
    id: 'imp-97455',
    step: 'measure the Kbig -> infinity behaviour of that worsening sequence, extending the sweep to {44..140}',
    result: 'SATURATES at a finite floor (bracket [-322.065,-305.866]); does not diverge to -infinity.',
  }),
  Object.freeze({
    id: 'imp-97482',
    step: 'verify by extending the SAME direct A2 build past Kbig=140 to {140,180,220,260}',
    result:
      'CONFIRMS the finite floor and TIGHTENS the bracket to [-313.756,-308.745], strictly inside the ' +
      'imp-97455 bracket.',
  }),
]);

export const IMP97511_KREIN_ROUTE2_KBIG_DIRECT_BUILD_COHORT_INDEX = Object.freeze({
  id: 'imp-97511',
  proofSection: 'S-frontier',
  cohort: KREIN_ROUTE2_KBIG_DIRECT_BUILD_COHORT,
  measuredSignal:
    'four chronological tickets build the genuine full-projector A2 at 2a=ln3, execute the Route-2 ' +
    'Lehmann-Maehly recursion on it, and measure the Kbig->infinity limit of the best-reachable lower ' +
    'bound on lambda_2 by DIRECT extension of the same build (not extrapolation alone), tightening the ' +
    'floor from an apparent unbounded regress (imp-97440) to a converged bracket [-313.756,-308.745] ' +
    '(imp-97482).',
  namedResiduals: [
    'IMP97414_M1_LEHMANN_VACUOUS_NEEDS_HIGHER_ORDER_OR_SPECTRAL_WINDOW',
    'IMP97440_ROUTE2_LEHMANN_UNBOUNDED_REGRESS',
    'IMP97455_ROUTE2_KBIG_LIMIT_FINITE_FLOOR_NOT_DIVERGENT',
    'IMP97482_ROUTE2_FLOOR_STILL_EXTRAPOLATED_BELOW_KBIG260',
  ],
  certifiedReach: 0.96,
  requiredRhoExceeds: 0.581059,
  imp97455Bracket: [-322.065, -305.866],
  imp97482TightenedBracket: [-313.756, -308.745],
  bracketTightensMonotonically: true,
  lowerBoundOnLambda2Proved: false,
  distinctFromImp97492ObstructionCohort: true,
  continuedByLaterTickets: true, // imp-97495/97513/97547/97555 push this same thread past Kbig=260
  question:
    'The Krein Route-2 Kbig direct-build finite-floor execution sub-family (imp-97414/97440/97455/97482) ' +
    'reads as four separate numerical leaves. Read chronologically as one build-then-measure thread on a ' +
    'single executed A2, does the record show an apparent unbounded regress (imp-97440) resolving into a ' +
    'directly-verified finite floor bracket [-313.756,-308.745] (imp-97482), still four orders below the ' +
    'required 0.581059?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). Four tickets chronologically build the genuine ' +
    'full-projector A2 at 2a=ln3 (imp-97414, which also closes the m=1 Lehmann-Maehly route to vacuity), ' +
    'execute the Route-2 Lehmann-Maehly recursion for lambda_2 on it (imp-97440, an apparent unbounded ' +
    'regress -196.863 -> -275.500 over Kbig 44->76), measure the Kbig->infinity limit of that sequence ' +
    '(imp-97455, saturates at a finite floor bracket [-322.065,-305.866]), and verify that saturation by ' +
    'DIRECTLY extending the same build past Kbig=140 to 260 (imp-97482, tightening the bracket to ' +
    '[-313.756,-308.745]). No rigorous positive lower bound on lambda_2 results anywhere in this ' +
    'sub-family; the floor stays roughly four orders below the required 0.581059. Distinct from the ' +
    'broader sibling imp-97492 eight-ticket obstruction cohort, which also covers the m=1-only tickets, ' +
    'the bathtub estimate, and the far-field residual. Later tickets continue this same Route-2 build ' +
    'past Kbig=260 (not covered by this index). Interval-rigorous certified reach stays EXACTLY 2a<=0.96, ' +
    'unchanged. Establishes nothing new; moves no bound; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97414 (full-projector A2 build; closes m=1 Lehmann); imp-97440 (Route-2 Lehmann execution; ' +
    'apparent regress); imp-97455 (Kbig->inf; saturates [-322.065,-305.866]); imp-97482 (direct build ' +
    'past 140; tightens to [-313.756,-308.745]).',
  ln3: LN3,
});

export default IMP97511_KREIN_ROUTE2_KBIG_DIRECT_BUILD_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97511_KREIN_ROUTE2_KBIG_DIRECT_BUILD_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97511-cohort-has-all-four-members-in-order',
    why: 'The whole point of the index is grouping exactly these four tickets in chronological order; a ' +
      'missing or reordered member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97511_KREIN_ROUTE2_KBIG_DIRECT_BUILD_COHORT_INDEX.cohort.map((c) => c.id);
      return (
        ids.length === 4 &&
        ids[0] === 'imp-97414' &&
        ids[1] === 'imp-97440' &&
        ids[2] === 'imp-97455' &&
        ids[3] === 'imp-97482'
      );
    },
  },
  {
    id: 'imp97511-brackets-tighten-and-nest',
    why: 'The index exists to surface that the floor tightened, not merely repeated, across the ' +
      'sub-family, so future work knows the current best bracket without re-reading all four tickets.',
    holds: () => {
      const idx = IMP97511_KREIN_ROUTE2_KBIG_DIRECT_BUILD_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 4 &&
        idx.imp97482TightenedBracket[0] > idx.imp97455Bracket[0] &&
        idx.imp97482TightenedBracket[1] < idx.imp97455Bracket[1] &&
        idx.imp97482TightenedBracket[0] < idx.imp97482TightenedBracket[1] &&
        idx.imp97482TightenedBracket[1] < idx.requiredRhoExceeds &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach < idx.ln3 &&
        idx.lowerBoundOnLambda2Proved === false &&
        idx.distinctFromImp97492ObstructionCohort === true
      );
    },
  },
  {
    id: 'imp97511-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97511_KREIN_ROUTE2_KBIG_DIRECT_BUILD_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97511_KREIN_ROUTE2_KBIG_DIRECT_BUILD_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97511_KREIN_ROUTE2_KBIG_DIRECT_BUILD_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97511_KREIN_ROUTE2_KBIG_DIRECT_BUILD_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97511_KREIN_ROUTE2_KBIG_DIRECT_BUILD_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97511-krein-route2-kbig-direct-build-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
