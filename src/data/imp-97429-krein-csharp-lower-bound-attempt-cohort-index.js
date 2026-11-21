/**
 * @module imp-97429-krein-csharp-lower-bound-attempt-cohort-index
 * @fileoverview imp-97429 -- META cross-reference index note grouping the Krein c_sharp
 *   LOWER-bound ATTEMPT cohort: five tickets (imp-97136, imp-97161, imp-97350, imp-97399, imp-97400)
 *   that each try a DIFFERENT named tool to certify a positive lower bound on
 *   c_sharp = lambda_min(P_a M_{sigma_2} P_a) at the binding half-width 2a = ln3, and each ends in a
 *   FINITE-NEGATIVE-FLOOR-ONLY verdict -- never a positive certificate. Distinct from the sibling
 *   imp-97411 index, which groups the SAME two named routes (Temple/Lehmann-Maehly and de Branges
 *   coercivity) as a two-step SYNTHESIS chain showing they share one missing primitive. This index
 *   instead groups the attempts BY TOOL, tracking the best finite floor each one reaches. Index/meta
 *   only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (five tools, chronological, each a separate attempt at the same target).
 *     imp-97136 -- Temple / Kato-Temple / Lehmann-Maehly feasibility check. Needs an a-priori
 *       beta with mu < beta <= lambda_2, unobtainable from Rayleigh-Ritz (wrong-direction bound
 *       lambda_2 <= beta_Ritz only). Declared infeasible with committed objects.
 *     imp-97161 -- assesses Beurling-Selberg extremal functions and flat Slepian prolate
 *       concentration eigenvalues as tools to supply the de Branges coercivity constant. Both
 *       REJECTED: Beurling-Selberg is circular (the minorant route reduces to the same Toeplitz
 *       positivity) or answers the wrong (full-band) functional; Slepian eigenvalues do not apply to
 *       the non-flat sigma_2 weight. No constant produced.
 *     imp-97350 -- synthesis showing the two surviving named routes (Lehmann-Maehly, de Branges
 *       coercivity) are not independent: both reduce to ONE missing quantitative band-limited (PW_a)
 *       concentration inequality against the confined negative sigma_2 well.
 *     imp-97399 -- EXECUTES a third tool, the reproducing-kernel (Bernstein pointwise) budget, on
 *       that shared primitive. Delivers a NEW finite floor c_sharp >= -3200.029 (via the confined-well
 *       correction + pointwise cap (a/pi)*18301.61), improving on the naive symbol-infimum floor
 *       -4336.198 by +1136.169 -- still negative.
 *     imp-97400 -- EXECUTES the Lehmann-Maehly enclosure numerically. Finds the spectral gap
 *       lambda_2 - lambda_1 = 82.547 is LARGE (not the binding wall, correcting imp-97136's worry),
 *       but both second-moment surrogates fail: the uncompressed one is vacuous (eta=11192.8 vs
 *       break-even 6.695), the trial-space one is circular (returns the Ritz upper bracket exactly).
 *
 *   WHY GROUP THESE (not re-derive). Five tickets, five different named tools -- Temple/Kato-Temple/
 *   Lehmann-Maehly feasibility, Beurling-Selberg extremal functions, Slepian prolate concentration,
 *   reproducing-kernel pointwise budgets, and Lehmann-Maehly numerical execution -- all aimed at one
 *   target, c_sharp = lambda_min(P_a M_{sigma_2} P_a) at 2a=ln3. Read separately they look like
 *   unrelated proof attempts across different sessions; read together they are the SAME finite-
 *   negative-floor-only-so-far family: every tool either fails outright (imp-97136, imp-97161) or
 *   succeeds only at sharpening a still-negative floor (imp-97399 to -3200.029; imp-97400 pins the
 *   large gap but the second-moment object stays out of reach). This index bakes that reading so a
 *   future scout does not re-attempt Beurling-Selberg/Slepian expecting a different verdict, and knows
 *   the current best certified floor is -3200.029 (imp-97399), not -4336.198.
 *
 *   MEASURED/DERIVED (all attempt verdicts; no new numerics beyond what each ticket already committed).
 *   - Temple/Kato-Temple/Lehmann-Maehly feasibility: infeasible, needs an unobtainable a-priori
 *     lambda_2 lower bound (imp-97136).
 *   - Beurling-Selberg and flat Slepian concentration tools: both rejected, neither supplies c>0
 *     (imp-97161).
 *   - the two surviving named routes share one missing primitive (imp-97350).
 *   - reproducing-kernel pointwise budget: NEW finite floor c_sharp >= -3200.029, better than the
 *     naive -4336.198 by +1136.169, still negative (imp-97399).
 *   - Lehmann-Maehly numerical execution: gap lambda_2-lambda_1 = 82.547 is large and not binding;
 *     both A2 second-moment surrogates fail (vacuous / circular); no lower bound produced (imp-97400).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - no rigorous positive lower bound on c_sharp exists; every tool in this cohort ends at a finite
 *     NEGATIVE floor or a rejected/circular method.
 *   - the best certified floor across the whole cohort is -3200.029 (imp-97399); the measured upper
 *     bracket is ~0.581059 (imp-97400/97206/97355/97379); the gap between them is unclosed.
 *   - interval-rigorous certified reach stays EXACTLY 2a<=0.96, unchanged by this whole cohort.
 *
 *   STATUS: a grouping/index note over five already-completed tickets, not a new derivation. No bound
 *   changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED. No refereed bound is changed.
 *
 * @see imp-97136-krein-temple-lower-bound-feasibility.js (Temple/Kato-Temple/Lehmann-Maehly; infeasible)
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (Beurling-Selberg + Slepian; both rejected)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (synthesis: routes share one primitive)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (reproducing-kernel; new floor -3200.029)
 * @see imp-97400-krein-lehmann-maehly-lower-bracket-execution.js (Lehmann-Maehly execution; gap large, A2 fails)
 * @see imp-97411-krein-csharp-two-routes-synthesis-chain-cohort-index.js (sibling meta index: the two-route synthesis chain, not the by-tool cohort)
 *
 * Ticket: imp-97429 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

const KREIN_CSHARP_LOWER_BOUND_ATTEMPT_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97136',
    tool: 'Temple / Kato-Temple / Lehmann-Maehly feasibility',
    result:
      'INFEASIBLE with committed objects: needs an a-priori beta with mu < beta <= lambda_2, but ' +
      'Rayleigh-Ritz supplies only the wrong-direction lambda_2 <= beta_Ritz.',
  }),
  Object.freeze({
    id: 'imp-97161',
    tool: 'Beurling-Selberg extremal functions + Slepian prolate concentration eigenvalues',
    result:
      'BOTH REJECTED: Beurling-Selberg is circular (minorant route) or answers the wrong full-band ' +
      'functional; Slepian flat-eigenvalue theory does not apply to the non-flat sigma_2 weight.',
  }),
  Object.freeze({
    id: 'imp-97350',
    tool: 'synthesis of the two surviving named routes',
    result:
      'Lehmann-Maehly/spectral-gap and de Branges coercivity are NOT independent: both reduce to one ' +
      'missing band-limited (PW_a) concentration inequality against the confined negative sigma_2 well.',
  }),
  Object.freeze({
    id: 'imp-97399',
    tool: 'reproducing-kernel (Bernstein pointwise) concentration budget',
    result:
      'NEW finite floor c_sharp >= -3200.029 (confined-well correction + pointwise cap ' +
      '(a/pi)*18301.61), improving the naive -4336.198 floor by +1136.169; still negative.',
  }),
  Object.freeze({
    id: 'imp-97400',
    tool: 'Lehmann-Maehly numerical enclosure execution',
    result:
      'spectral gap lambda_2-lambda_1 = 82.547 is large, not binding; BOTH A2 second-moment ' +
      'surrogates fail (uncompressed: vacuous eta=11192.8; trial-space: circular, returns Ritz upper).',
  }),
]);

export const IMP97429_KREIN_CSHARP_LOWER_BOUND_ATTEMPT_COHORT_INDEX = Object.freeze({
  id: 'imp-97429',
  proofSection: 'S-frontier',
  cohort: KREIN_CSHARP_LOWER_BOUND_ATTEMPT_COHORT,
  measuredSignal:
    'five distinct named tools (Temple/Kato-Temple/Lehmann-Maehly feasibility, Beurling-Selberg, ' +
    'Slepian prolate concentration, reproducing-kernel pointwise budget, Lehmann-Maehly numerical ' +
    'execution) all aimed at c_sharp = lambda_min(P_a M_{sigma_2} P_a) at 2a=ln3; every one ends in a ' +
    'finite-negative-floor-only verdict, never a positive certificate.',
  namedResiduals: [
    'IMP97136_TEMPLE_NEEDS_APRIORI_SPECTRAL_GAP',
    'IMP97161_BEURLING_SELBERG_AND_SLEPIAN_BOTH_REJECTED',
    'IMP97350_LOWER_BOUND_ROUTES_SHARE_BAND_LIMITED_CONCENTRATION_PRIMITIVE',
    'IMP97399_REPRODUCING_KERNEL_FLOOR_STILL_NEGATIVE',
    'IMP97400_LEHMANN_MAEHLY_NEEDS_FULL_PROJECTOR_SECOND_MOMENT',
  ],
  certifiedReach: 0.96,
  bestCertifiedFloor: -3200.029,
  bestMeasuredUpperBracket: 0.581059,
  distinctFromImp97411SynthesisChain: true,
  lowerBoundOnCSharpProved: false,
  question:
    'The Krein c_sharp lower-bound cohort (imp-97136/97161/97350/97399/97400) reads as five separate ' +
    'proof attempts across different sessions using different named tools. Grouped by tool, does the ' +
    'record show that every attempt so far reaches at best a finite NEGATIVE floor, never a positive ' +
    'lower bound, and is the best such floor currently -3200.029?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). Five named tools were tried against ' +
    'c_sharp = lambda_min(P_a M_{sigma_2} P_a) at 2a=ln3: Temple/Kato-Temple/Lehmann-Maehly feasibility ' +
    'is infeasible (imp-97136); Beurling-Selberg and flat Slepian prolate concentration are both ' +
    'rejected as tools (imp-97161); the two surviving named routes are shown to share one missing ' +
    'primitive (imp-97350); the reproducing-kernel pointwise budget delivers a NEW finite floor ' +
    '-3200.029, still negative (imp-97399); and the Lehmann-Maehly numerical execution finds the ' +
    'spectral gap is large (not binding) but both A2 second-moment surrogates fail, vacuous or ' +
    'circular (imp-97400). Distinct from the sibling imp-97411 index, which groups the same two named ' +
    'routes as a two-step SYNTHESIS chain rather than tracking best-floor-by-tool. No rigorous ' +
    'positive lower bound on c_sharp exists; interval-rigorous certified reach stays EXACTLY 2a<=0.96, ' +
    'unchanged by this whole cohort. Future work on this thread should treat all five tools as closed ' +
    'or floor-only, and use -3200.029 (not -4336.198) as the current best certified floor when framing ' +
    'the remaining gap to the measured upper bracket ~0.581059. Establishes nothing new; moves no ' +
    'bound; RH open; NO QED. No refereed bound is changed.',
  citation:
    'imp-97136 (Temple/Kato-Temple/Lehmann-Maehly feasibility; infeasible); imp-97161 (Beurling-' +
    'Selberg + Slepian assessment; both rejected); imp-97350 (synthesis: routes share one primitive); ' +
    'imp-97399 (reproducing-kernel execution; new floor -3200.029); imp-97400 (Lehmann-Maehly ' +
    'numerical execution; gap large, A2 fails).',
  ln3: LN3,
});

export default IMP97429_KREIN_CSHARP_LOWER_BOUND_ATTEMPT_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97429_KREIN_CSHARP_LOWER_BOUND_ATTEMPT_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97429-cohort-has-all-five-members-in-order',
    why: 'The whole point of the index is grouping exactly these five tickets by tool; a missing or ' +
      'reordered member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97429_KREIN_CSHARP_LOWER_BOUND_ATTEMPT_COHORT_INDEX.cohort.map((c) => c.id);
      return (
        ids.length === 5 &&
        ids[0] === 'imp-97136' &&
        ids[1] === 'imp-97161' &&
        ids[2] === 'imp-97350' &&
        ids[3] === 'imp-97399' &&
        ids[4] === 'imp-97400'
      );
    },
  },
  {
    id: 'imp97429-named-residuals-and-floor-present',
    why: 'The index exists to surface the open sub-gaps and the best floor by name, so future work ' +
      'can find them without re-reading all five tickets.',
    holds: () => {
      const idx = IMP97429_KREIN_CSHARP_LOWER_BOUND_ATTEMPT_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 5 &&
        idx.distinctFromImp97411SynthesisChain === true &&
        idx.lowerBoundOnCSharpProved === false &&
        idx.bestCertifiedFloor === -3200.029 &&
        idx.bestCertifiedFloor < 0 &&
        idx.bestMeasuredUpperBracket > 0 &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach < idx.ln3
      );
    },
  },
  {
    id: 'imp97429-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97429_KREIN_CSHARP_LOWER_BOUND_ATTEMPT_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97429_KREIN_CSHARP_LOWER_BOUND_ATTEMPT_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97429_KREIN_CSHARP_LOWER_BOUND_ATTEMPT_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97429_KREIN_CSHARP_LOWER_BOUND_ATTEMPT_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97429_KREIN_CSHARP_LOWER_BOUND_ATTEMPT_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97429-krein-csharp-lower-bound-attempt-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
