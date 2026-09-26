/**
 * @module imp-97527-krein-route-m-frontier-leaves-cohort-index
 * @fileoverview imp-97527 -- META cross-reference index grouping six late-frontier leaves
 *   (imp-97495, imp-97496, imp-97497, imp-97498, imp-97499, imp-97502) into their two parent
 *   programs -- Krein (c_sharp lower-bound attack at 2a=ln3) and Route-M (b/4-ceiling attack) --
 *   with each leaf's one-line verdict, so a future scout does not have to re-open six separate
 *   modules to see which program each belongs to and what it settled. Index/meta only;
 *   establishes nothing new; changes no bound; NO QED.
 *
 *   THE KREIN SUB-COHORT (four tickets, all measurements on the c_sharp lower-bound attack
 *   at the binding point 2a=ln3; interval-rigorous certified reach stays 2a<=0.96 throughout).
 *     imp-97495 -- extends the Route-2 Kbig direct-projector build past Kbig=260 to {300,340,380}:
 *       TIGHTENS the upper edge to -309.931066 and REFUTES the imp-97482 geometric-tail estimate
 *       (measured delta ratios rise 0.63->0.70, not the assumed 0.54); corrected-tail central
 *       estimate ~-310.55, bracket [-313.8,-309.931].
 *     imp-97496 -- computes the explicit crossing Y*=73,612,801 by exact finite sieve and names
 *       the witness b* with T(b*) = -0.25000000 < -1/4, rigorously witnessing the imp-97481
 *       b/4-ceiling lower-edge refutation (this leaf is filed under Route-M, see below, but is
 *       listed here in ticket-id order per the source ticket).
 *     imp-97497 -- tail-converges the imp-97483 well-capture scalar optimum via an endpoint-
 *       asymptotic far-tail model: optimum is 7.53 +- 0.01 at R*~3.36, correcting the informal
 *       "~7.3" upward by ~0.2 (ratio to c_sharp~0.582 is 12.9x, an order of magnitude above the
 *       spectral optimum).
 *     imp-97498 -- re-reads the imp-97484 c_sharp upper bracket on a COMMON fixed T*=8000 column
 *       (non-sliding): confirms strict N-monotone decrease at identical resolution and shows the
 *       pure N-effect (0.002560) is LARGER than the sliding reading suggested (0.002150).
 *     imp-97502 -- assesses four NAMED concentration/uncertainty inequalities (Nazarov, Turan/
 *       Amrein-Berthier, Donoho-Stark, Paneah/Logvinenko-Sereda): NONE supplies a positive
 *       coercivity constant c>0, blocked by the same two structural walls as imp-97161 (Wall A:
 *       depth -4336.198 needs an absurd theta_max<1.15e-4; Wall B: all four bound Lebesgue mass,
 *       never the signed sigma_2 weight).
 *
 *   THE ROUTE-M SUB-COHORT (two tickets, the b/4-ceiling and MCM-base-term attacks).
 *     imp-97496 -- see above (grouped here by program): explicit witness b* closes the b/4-ceiling
 *       lower-edge line as an explicitly-witnessed dead route.
 *     imp-97499 -- extends the imp-97478 scaled MCM base term c*x/ln x to x=1e7..1e14: residual
 *       equals M0/ln x = 0.09549610599/ln x to all shown digits (two-term-law deviation sharpens
 *       1.8e-15 at 1e6 -> 8.4e-32 at 1e14); approach to K0=1/24 is genuinely 1/ln x (still 0.044629
 *       at x=1e14, never crossing); MCM stays VERIFIED at omega<=6, not proved (FALSE at omega=11
 *       per imp-97432).
 *
 *   WHY GROUP THESE (not re-derive). All six are late-frontier measurement/assessment leaves
 *   committed in immediate succession (imp-97495..97502) that read, on their own, as an
 *   undifferentiated batch. Grouped by parent program, the Krein four form one continuous
 *   c_sharp-lower-bound-attack sweep (tightening Route-2's negative floor, tail-converging a
 *   competing scalar estimate, isolating the pure N-effect in the c_sharp upper bracket, and
 *   closing off the last four named concentration-inequality candidates for coercivity), while
 *   the Route-M two are a b/4-ceiling closure (explicit witness) and an MCM base-term measurement
 *   (logarithmic approach law) on the sibling program. This index bakes that split so a future
 *   scout can find, at a glance, which of the two live programs each leaf belongs to without
 *   re-reading all six.
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket already
 *   committed).
 *   - Krein Route-2 Kbig floor tightened to bracket [-313.8,-309.931066] (imp-97495); still four
 *     orders below the required 0.581059.
 *   - Krein well-capture scalar optimum tail-converges to 7.53+-0.01, an order of magnitude above
 *     c_sharp~0.582 (imp-97497).
 *   - Krein c_sharp fixed-T*=8000 column confirms strict N-monotone decrease, pure N-effect
 *     0.002560 > sliding-read 0.002150 (imp-97498).
 *   - Krein: no named concentration inequality supplies c>0 for de Branges coercivity (imp-97502).
 *   - Route-M b/4-ceiling lower edge has an explicit witness b* with T(b*)<-1/4 (imp-97496).
 *   - Route-M MCM base term approaches K0=1/24 at a confirmed 1/ln x rate, residual exactly
 *     M0/ln x (imp-97499).
 *
 *   NOT ESTABLISHED (what stays open at the end of this batch).
 *   - no rigorous positive lower bound on lambda_2 anywhere in the Krein Route-2 sub-family; the
 *     floor stays negative and four orders below 0.581059.
 *   - no coercivity constant c>0 established for the de Branges route; all four newly-assessed
 *     named tools join the imp-97161 Beurling-Selberg/Slepian-prolate obstruction.
 *   - MCM stays VERIFIED at omega<=6 only, not proved; already FALSE at omega=11 (imp-97432).
 *   - interval-rigorous certified reach stays EXACTLY 2a<=0.96, unchanged by any of the six leaves.
 *
 *   STATUS: a grouping/index note over six already-completed tickets, not a new derivation. No
 *   bound changes: interval-rigorous certified reach stays 2a<=0.96; RH open; NO QED.
 *   Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * @see imp-97495-krein-route2-kbig300-380-direct-floor.js (Route-2 Kbig={300,340,380}; tightens to -309.931066)
 * @see imp-97496-route-m-quarter-ceiling-explicit-crossing-window.js (explicit witness b*, T(b*)<-1/4)
 * @see imp-97497-krein-welloptimum-tail-converged.js (well-capture scalar optimum tail-converges to 7.53+-0.01)
 * @see imp-97498-krein-csharp-fixedT-common-column.js (fixed T*=8000 column isolates the pure N-effect)
 * @see imp-97499-route-m-mcm-baseterm-scaled-approach-K0.js (residual = M0/ln x, 1/ln x approach to K0)
 * @see imp-97502-krein-named-concentration-inequality-assessment.js (four named tools, none supply c>0)
 * @see imp-97511-krein-route2-kbig-direct-build-cohort-index.js (sibling meta index: the earlier Kbig<=260 sub-family)
 * @see imp-97492-krein-csharp-lower-bound-obstruction-cohort-index.js (sibling meta index: broader eight-ticket obstruction cohort)
 *
 * Ticket: imp-97527 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * Platt-Trudgian Lambda <= 0.2 SOTA.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein sub-cohort

const KREIN_FRONTIER_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97495',
    step: 'extend the Route-2 Kbig direct-projector build past Kbig=260 to {300,340,380}',
    result:
      'TIGHTENS the upper edge to -309.931066 and REFUTES the imp-97482 geometric-tail estimate ' +
      '(-309.781); corrected-tail central estimate ~-310.55, bracket [-313.8,-309.931066].',
  }),
  Object.freeze({
    id: 'imp-97497',
    step: 'tail-converge the imp-97483 well-capture scalar optimum via an endpoint-asymptotic far-tail model',
    result:
      'optimum is 7.53 +- 0.01 at R*~3.36, correcting the informal "~7.3" upward by ~0.2; ratio to ' +
      'c_sharp~0.582 is 12.9x.',
  }),
  Object.freeze({
    id: 'imp-97498',
    step: 're-read the imp-97484 c_sharp upper bracket on a COMMON fixed T*=8000 column (non-sliding)',
    result:
      'confirms strict N-monotone decrease at identical resolution; pure N-effect (0.002560) is ' +
      'LARGER than the sliding reading (0.002150).',
  }),
  Object.freeze({
    id: 'imp-97502',
    step: 'assess four NAMED concentration/uncertainty inequalities for the de Branges coercivity primitive',
    result:
      'NONE supplies c>0 (Nazarov, Turan/Amrein-Berthier, Donoho-Stark, Paneah/Logvinenko-Sereda all ' +
      'blocked by Wall A depth and Wall B sign/weight).',
  }),
]);

const ROUTE_M_FRONTIER_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97496',
    step: 'compute the explicit b/4-ceiling crossing Y* by exact finite sieve and name the witness b*',
    result:
      'b* = Prod_{379<=p<=73,612,801} p, T(b*) = -0.25000000 < -1/4: an explicit, rigorously-verified ' +
      'witness to the imp-97481 lower-edge refutation.',
  }),
  Object.freeze({
    id: 'imp-97499',
    step: 'extend the imp-97478 scaled MCM base term c*x/ln x to x=1e7..1e14',
    result:
      'residual equals M0/ln x = 0.09549610599/ln x to all shown digits; approach to K0=1/24 is ' +
      'genuinely 1/ln x, never crossing (still 0.044629 at x=1e14); MCM stays VERIFIED at omega<=6.',
  }),
]);

export const IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX = Object.freeze({
  id: 'imp-97527',
  proofSection: 'S-frontier',
  kreinCohort: KREIN_FRONTIER_SUBCOHORT,
  routeMCohort: ROUTE_M_FRONTIER_SUBCOHORT,
  measuredSignal:
    'six late-frontier measurement/assessment leaves (imp-97495/97496/97497/97498/97499/97502), grouped ' +
    'by parent program: four Krein c_sharp-lower-bound-attack leaves (Route-2 Kbig floor tightening, ' +
    'well-capture scalar tail-convergence, fixed-T* N-effect isolation, four named-inequality assessment) ' +
    'and two Route-M leaves (explicit b/4-ceiling witness, MCM base-term 1/ln x approach law).',
  namedResiduals: [
    'IMP97495_ROUTE2_FLOOR_BRACKET_313P8_309P931',
    'IMP97496_LOWER_EDGE_EXPLICIT_WITNESS_VERIFIED',
    'IMP97497_TAILCONVERGED_SCALAR_OPTIMUM_7P53_STILL_ORDER_ABOVE_CSHARP',
    'IMP97498_FIXEDT_PURE_N_EFFECT_LARGER_THAN_SLIDING',
    'IMP97499_MCM_BASETERM_RESIDUAL_M0_OVER_LNX',
    'IMP97502_NO_NAMED_CONCENTRATION_TOOL_SUPPLIES_C',
  ],
  certifiedReach: 0.96,
  requiredRhoExceeds: 0.581059,
  krein97495TightenedBracket: [-313.8, -309.931066],
  krein97497TailConvergedOptimum: 7.53,
  krein97498FixedTPureNEffect: 0.00256,
  routeM97496WitnessTValue: -0.25,
  routeM97499LimitK0: 1 / 24,
  lowerBoundOnLambda2Proved: false,
  coercivityConstantProved: false,
  mcmProved: false,
  bFourthCeilingLowerEdgeRefutedWithWitness: true,
  anyBoundMoved: false,
  question:
    'The six late-frontier leaves imp-97495/97496/97497/97498/97499/97502, read together as an ' +
    'undifferentiated commit batch, obscure which parent program each belongs to. Split by program -- ' +
    'Krein (imp-97495/97497/97498/97502) versus Route-M (imp-97496/97499) -- does each sub-cohort settle ' +
    'a distinct question with a distinct verdict, and does neither move any bound?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The Krein sub-cohort (imp-97495/97497/97498/97502) is one ' +
    'continuous c_sharp-lower-bound-attack sweep at 2a=ln3: Route-2 Kbig floor tightens to ' +
    '[-313.8,-309.931066] (imp-97495, four orders below 0.581059); the well-capture scalar optimum ' +
    'tail-converges to 7.53+-0.01, an order of magnitude above c_sharp (imp-97497); the fixed-T* column ' +
    'isolates a pure N-effect larger than the sliding reading suggested (imp-97498); and the last four ' +
    'named concentration inequalities all fail to supply a coercivity constant c>0 (imp-97502). The ' +
    'Route-M sub-cohort (imp-97496/97499) settles two independent questions on the sibling program: the ' +
    'b/4-ceiling lower edge now has an explicit rigorously-verified witness (imp-97496), and the MCM base ' +
    'term is confirmed to approach K0=1/24 at a genuine 1/ln x rate with residual exactly M0/ln x ' +
    '(imp-97499). No bound moves in either sub-cohort: interval-rigorous certified reach stays EXACTLY ' +
    '2a<=0.96, MCM stays verified-not-proved, and no coercivity constant or positive lambda_2 lower bound ' +
    'results. RH open; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97495 (Route-2 Kbig={300,340,380}; tightens to -309.931066); imp-97496 (explicit witness b*, ' +
    'T(b*)<-1/4); imp-97497 (well-capture scalar optimum tail-converges to 7.53+-0.01); imp-97498 (fixed ' +
    'T*=8000 column isolates pure N-effect); imp-97499 (MCM base-term residual = M0/ln x); imp-97502 (four ' +
    'named concentration tools, none supply c>0).',
  ln3: LN3,
});

export default IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97527-krein-subcohort-has-all-four-members',
    why: 'The whole point of the split is grouping exactly these four Krein leaves; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX.kreinCohort.map((c) => c.id);
      return (
        ids.length === 4 &&
        ids.includes('imp-97495') &&
        ids.includes('imp-97497') &&
        ids.includes('imp-97498') &&
        ids.includes('imp-97502')
      );
    },
  },
  {
    id: 'imp97527-routeM-subcohort-has-both-members',
    why: 'The Route-M split must contain exactly the two b/4-ceiling / MCM leaves, not overlap the Krein set.',
    holds: () => {
      const ids = IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX.routeMCohort.map((c) => c.id);
      return ids.length === 2 && ids.includes('imp-97496') && ids.includes('imp-97499');
    },
  },
  {
    id: 'imp97527-six-tickets-total-no-overlap',
    why: 'The index covers exactly six tickets split into two disjoint sub-cohorts; an overlap or a ' +
      'dropped ticket would misreport the batch.',
    holds: () => {
      const idx = IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX;
      const kreinIds = idx.kreinCohort.map((c) => c.id);
      const routeMIds = idx.routeMCohort.map((c) => c.id);
      const overlap = kreinIds.some((id) => routeMIds.includes(id));
      return (
        kreinIds.length + routeMIds.length === 6 &&
        !overlap &&
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 6
      );
    },
  },
  {
    id: 'imp97527-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, PT SOTA line present.',
    holds: () =>
      IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX.anyBoundMoved === false &&
      IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX.certifiedReach === 0.96 &&
      IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX.certifiedReach < IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX.ln3 &&
      /NO QED/.test(IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX.verdict) &&
      /remains SOTA/.test(IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97527_KREIN_ROUTE_M_FRONTIER_LEAVES_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97527-krein-route-m-frontier-leaves-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
