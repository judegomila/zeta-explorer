/**
 * @module imp-35551-route-i-requirement-severity-ranking
 *
 * imp-35551 (proof/assessment, S-frontier): RANK the five route-(i) finite-N
 * remainder derivation requirements enumerated by imp-35538 (REQ 1 effective
 * C_H = 1/8 provenance, REQ 2 explicit-rate GUE local law, REQ 3 restricted->full
 * Fourier support, REQ 4 height regime, REQ 5 conditionality) by REACHABILITY /
 * bottleneck SEVERITY. imp-35538 listed the five ingredients but left them
 * UNRANKED; this module assesses which single unmet analytic input is the binding
 * obstruction and whether discharging it ALONE would suffice.
 *
 * ASSESSMENT / SCOPING ONLY. Derives NO remainder; discharges NOTHING; changes no
 * bound; tightens no bound; establishes no operator positivity; no RH verdict,
 * NO QED. The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643, C_H = 1/8), the
 * E_trunc = 3.06e-5 floor (imp-2631) and the imp-398 C_F prefactor are UNTOUCHED;
 * C_mb GUE-conditional per imp-486 UNTOUCHED. No refereed bound is changed.
 *
 * THE RANKING QUESTION
 * -----------------------------------------------------------------------------
 * imp-35538 already flagged REQ 2 (an explicit-rate GUE local law) as "the crux"
 * and REQ 4 (the height regime) as "astronomically out of reach", but it treated
 * the five as a flat conjunction. The sharper question is: are they INDEPENDENT
 * locks, or COUPLED? and would discharging the single hardest one collapse the
 * rest? The answer determines whether route-(i) has one nameable breakthrough
 * gate or an irreducible cluster.
 *
 * SEVERITY ORDERING (hardest bottleneck first)
 * -----------------------------------------------------------------------------
 * RANK 1 -- REQ 2 (explicit-rate GUE local law): the BINDING CRUX. It is a
 *   NONEXISTENT theorem -- the rigorous pair-correlation results (Montgomery 1973,
 *   Rudnick-Sarnak 1996) are asymptotic-only and carry no named E_GUE(T0) -- so it
 *   must be proved from scratch. Crucially it silently CARRIES REQ 4: the bound
 *   only binds the landmarks if the rate REQ 2 delivers beats the natural
 *   O(1/log T0). So the true crux is not merely "an explicit rate" but "an
 *   explicit rate FAST ENOUGH at log T0 ~ 21".
 * RANK 2 -- REQ 4 (height regime): an INDEPENDENT lock, not a consequence of REQ 2
 *   existing. On the natural O(1/log T0) rate no reachable height binds (needs
 *   log T0 >= 200 ~ 9.6x the crossover, ~7.0x log T_PT). REQ 4 is escapable ONLY
 *   by strengthening REQ 2 to a super-natural rate -- so it folds back INTO REQ 2,
 *   making the crux strictly harder rather than being separately dischargeable.
 * RANK 3 -- REQ 3 (restricted->full Fourier support): CONJECTURAL. Route (b) is
 *   the Montgomery pair-correlation conjecture; route (a) (a support-limited
 *   surrogate statistic inside |alpha| < 1) is the only non-conjectural escape and
 *   is itself unproven. Coupled to REQ 2 at full support (there, REQ 2 = an
 *   explicit-rate Montgomery conjecture).
 * RANK 4 -- REQ 1 (effective C_H = 1/8 provenance): the most REACHABLE. It is a
 *   definitional prerequisite with a KNOWN expected answer (C_H = 1/8), a concrete
 *   derivation target rather than a nonexistence; gating (without it |err(N)| is
 *   undefined) but the softest of the analytic tasks.
 * RANK 5 -- REQ 5 (conditionality): NOT a dischargeable task at all but an
 *   irreducible OUTCOME CEILING. Any GUE-based law is RH/Montgomery-conditional, so
 *   the best attainable remainder INHERITS the imp-486 conditional; REQ 5 caps the
 *   PAYOFF (never unconditional by this route) rather than blocking construction.
 *
 * BINDING-OBSTRUCTION VERDICT
 * -----------------------------------------------------------------------------
 * The binding obstruction is REQ 2, but discharging REQ 2 ALONE does NOT suffice:
 *   (a) at full support REQ 2 IS REQ 3 (the Montgomery conjecture with a rate),
 *   (b) even a discharged REQ 2 at the natural rate fails REQ 4 at the landmark
 *       heights, so REQ 2 must arrive with a super-natural rate, and
 *   (c) REQ 5 caps the outcome at imp-486-conditional no matter what.
 * So there is NO single literature-nameable input whose discharge collapses the
 * rest; the true binding obstruction is the COUPLED object {REQ 2 with a rate
 * faster than O(1/log T0), at full Fourier support} -- i.e. REQ 2 + REQ 3 + REQ 4
 * fused into one super-crux, atop the REQ 1 definitional floor and under the REQ 5
 * conditional ceiling. Route-(ii) (the imp-35488 two-height data-anchored spot
 * check, both landmark heights below T_PT = 3e12) therefore remains the only
 * viable partial for the OPEN imp-35337a. Assessment/scoping only; discharges
 * nothing; changes no bound; no positivity; NO QED. No refereed bound is changed.
 *
 * @see imp-35538-route-i-remainder-derivation-requirements (enumerates the five REQs this module ranks)
 * @see imp-35493-route-i-remainder-literature-scope (survey CONFIRMS route-(i) absent)
 * @see imp-35475-sigma-fidelity-closure-scope (Part B route-(i), Part C budgets, Part D imp-486)
 * @see imp-35488-route-ii-two-height-gtrue-spotcheck (route-(ii) partial for imp-35337a)
 * @see imp-35337-sigma-landmarks-double-double-certification (names imp-35337a)
 * @see imp-486 (GUE-conditional caveat inherited by any pair-correlation remainder)
 */

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any route-(i) requirements ranking)

// Actual landmark / anchor log-heights from imp-35538 (taken as given; no recompute).
const LOG_T0_CROSS = 20.8576; // crossover landmark log-height
const LOG_T_PT = 28.7296; // Platt-Trudgian anchor log-height
const LOG_T0_NEEDED = 200; // log T0 the natural O(1/log T0) rate needs for the 0.5% budget

export const IMP35551_ROUTE_I_REQUIREMENT_SEVERITY_RANKING = {
  id: 'imp-35551',
  proofSection: 'S-frontier',
  question:
    'imp-35538 enumerated FIVE route-(i) finite-N remainder derivation requirements (REQ 1 effective ' +
    'C_H = 1/8 provenance, REQ 2 explicit-rate GUE local law, REQ 3 restricted->full Fourier support, ' +
    'REQ 4 height regime, REQ 5 conditionality) but did NOT rank them. Rank the five by reachability / ' +
    'bottleneck severity: which single unmet analytic input is the binding obstruction, and would ' +
    'discharging it alone suffice? Ranking / scoping only; derives no remainder; NO QED.',
  // severityRank 1 = hardest bottleneck; reachability = how close the input is to existing mathematics.
  ranking: [
    {
      req: 'REQ 2',
      name: 'explicit-rate GUE local law',
      severityRank: 1,
      reachability: 'nonexistent-theorem',
      coupledWith: ['REQ 3', 'REQ 4'],
      note:
        'THE BINDING CRUX. A named E_GUE(T0) with |true - GUE| <= E_GUE(T0) does not exist (Montgomery ' +
        '1973 / Rudnick-Sarnak 1996 are asymptotic-only); must be proved from scratch, and silently ' +
        'carries REQ 4 (the delivered rate must beat the natural O(1/log T0) to bind at log T0 ~ 21).',
    },
    {
      req: 'REQ 4',
      name: 'height regime where the bound binds',
      severityRank: 2,
      reachability: 'unreachable-on-natural-rate',
      coupledWith: ['REQ 2'],
      note:
        'An INDEPENDENT lock, not a consequence of REQ 2 existing. On the natural O(1/log T0) rate no ' +
        'reachable height binds (needs log T0 >= 200, ~9.6x the crossover log-height ~20.86, ~7.0x ' +
        'log T_PT ~ 28.73). Escapable only by strengthening REQ 2 to a super-natural rate -- so it folds ' +
        'back into REQ 2 rather than being separately dischargeable.',
    },
    {
      req: 'REQ 3',
      name: 'restricted->full Fourier support',
      severityRank: 3,
      reachability: 'conjectural',
      coupledWith: ['REQ 2'],
      note:
        'Route (b) is the Montgomery pair-correlation conjecture; route (a) (a support-limited surrogate ' +
        'inside |alpha| < 1) is the only non-conjectural escape and is itself unproven. At full support ' +
        'REQ 2 IS an explicit-rate Montgomery conjecture, so REQ 2 and REQ 3 fuse there.',
    },
    {
      req: 'REQ 1',
      name: 'effective C_H = 1/8 provenance',
      severityRank: 4,
      reachability: 'definitional-prerequisite',
      coupledWith: [],
      note:
        'The most REACHABLE analytic task: a definitional prerequisite with a KNOWN expected answer ' +
        '(C_H = 1/8), a concrete derivation target rather than a nonexistence. Gating (without it ' +
        '|err(N)| is undefined) but the softest of the four analytic requirements.',
    },
    {
      req: 'REQ 5',
      name: 'conditionality',
      severityRank: 5,
      reachability: 'irreducible-outcome-ceiling',
      coupledWith: [],
      note:
        'NOT a dischargeable task but a ceiling: any GUE-based law is RH/Montgomery-conditional, so the ' +
        'best attainable remainder INHERITS the imp-486 conditional. Caps the payoff (never unconditional ' +
        'by this route) rather than blocking construction.',
    },
  ],
  bindingObstruction:
    'REQ 2 (an explicit-rate GUE local law), but as a FUSED super-crux {REQ 2 with a rate faster than ' +
    'O(1/log T0), at full Fourier support} = REQ 2 + REQ 3 + REQ 4 -- not REQ 2 in isolation.',
  singleDischargeSuffices: false,
  singleDischargeVerdict:
    'NO. Discharging REQ 2 alone does not collapse the rest: (a) at full support REQ 2 IS REQ 3 (the ' +
    'Montgomery conjecture with a rate); (b) a discharged REQ 2 at the natural rate still fails REQ 4 at ' +
    'the landmark heights, forcing a super-natural rate; (c) REQ 5 caps the outcome at imp-486-conditional ' +
    'regardless. There is no single literature-nameable input whose discharge suffices.',
  heights: {
    logT0Cross: LOG_T0_CROSS,
    logT_PT: LOG_T_PT,
    logT0NeededForHalfPctBudget: LOG_T0_NEEDED,
  },
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'ASSESSMENT / RANKING (frontier-direction severity ordering, NOT rigorous). The five imp-35538 ' +
    'requirements rank by bottleneck severity as REQ 2 > REQ 4 > REQ 3 > REQ 1 > REQ 5. REQ 2 (an ' +
    'explicit-rate GUE local law) is the binding crux -- a nonexistent theorem that must be proved from ' +
    'scratch -- but discharging it ALONE would NOT suffice: it is coupled to REQ 3 (at full support it IS ' +
    'the Montgomery conjecture) and to REQ 4 (its rate must beat the natural O(1/log T0) to bind at ' +
    'log T0 ~ 21), atop the REQ 1 definitional floor and under the irreducible REQ 5 imp-486 conditional ' +
    'ceiling. The true binding obstruction is the fused super-crux {REQ 2 + REQ 3 + REQ 4}; no single ' +
    'nameable input collapses the rest. Route-(ii) (the imp-35488 two-height data-anchored spot check, ' +
    'both landmark heights below T_PT = 3e12) remains the only viable partial for the OPEN imp-35337a. ' +
    'Derives NO remainder; discharges NOTHING; changes no bound; establishes no operator positivity; ' +
    'C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631), the imp-398 C_F prefactor ' +
    'and C_mb GUE-conditional (imp-486) are UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35538 (enumerates the five REQs ranked here); imp-35493 (literature survey CONFIRMS route-(i) ' +
    'absent); imp-35475 (Part B route-(i), Part C budgets, Part D imp-486); imp-35488 (route-(ii) ' +
    'two-height partial for imp-35337a); imp-35337 (names imp-35337a); imp-2642/imp-2643 (C_C = (1/8) ' +
    'sqrt(3 pi), C_H = 1/8); imp-2631 (E_trunc floor); imp-398 (E_flow C_F prefactor); imp-486 ' +
    '(GUE-conditional caveat). Literature: Montgomery (1973); Rudnick-Sarnak (1996).',
};

export const IMP35551_ROUTE_I_REQUIREMENT_SEVERITY_RANKING_ASSERTIONS = [
  {
    // (1) all five REQs are ranked with distinct severity 1..5, and REQ 2 is the RANK 1 binding crux.
    id: 'imp35551-five-requirements-ranked',
    description: 'the ranking covers REQ 1-5 with distinct severityRank 1..5 and REQ 2 (explicit-rate GUE local law) at rank 1 as the binding crux',
    holds: () => {
      const r = IMP35551_ROUTE_I_REQUIREMENT_SEVERITY_RANKING.ranking;
      const ranks = r.map((x) => x.severityRank).sort((a, b) => a - b);
      const reqs = new Set(r.map((x) => x.req));
      const rank1 = r.find((x) => x.severityRank === 1);
      return (
        r.length === 5 &&
        JSON.stringify(ranks) === JSON.stringify([1, 2, 3, 4, 5]) &&
        reqs.size === 5 &&
        ['REQ 1', 'REQ 2', 'REQ 3', 'REQ 4', 'REQ 5'].every((q) => reqs.has(q)) &&
        rank1.req === 'REQ 2' &&
        /explicit-rate GUE local law/.test(rank1.name)
      );
    },
  },
  {
    // (2) binding-obstruction verdict: no single discharge suffices; the crux is a fused REQ2+REQ3+REQ4 super-crux.
    id: 'imp35551-no-single-discharge-suffices',
    description: 'discharging REQ 2 alone does not suffice -- it is coupled to REQ 3 and REQ 4 into a fused super-crux, so singleDischargeSuffices is false',
    holds: () => {
      const o = IMP35551_ROUTE_I_REQUIREMENT_SEVERITY_RANKING;
      const req2 = o.ranking.find((x) => x.req === 'REQ 2');
      const req4 = o.ranking.find((x) => x.req === 'REQ 4');
      return (
        o.singleDischargeSuffices === false &&
        /REQ 2/.test(o.bindingObstruction) &&
        /REQ 3/.test(o.bindingObstruction) &&
        /REQ 4/.test(o.bindingObstruction) &&
        req2.coupledWith.includes('REQ 3') &&
        req2.coupledWith.includes('REQ 4') &&
        req4.severityRank === 2 &&
        LOG_T0_NEEDED > LOG_T_PT && LOG_T_PT > LOG_T0_CROSS
      );
    },
  },
  {
    // (3) honesty gate: not rigorous, inherits imp-486, no bound moves, no refereed bound is changed, imp-35337a named; NO QED.
    id: 'imp35551-conditional-no-bound-moves-no-qed',
    description: 'the ranking is not rigorous / not unconditional, inherits imp-486, changes no bound, PT 0.2 unchanged, imp-35337a named, NO QED',
    holds: () => {
      const o = IMP35551_ROUTE_I_REQUIREMENT_SEVERITY_RANKING;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        o.isRigorous === false &&
        o.isUnconditional === false &&
        /imp-486/.test(o.singleDischargeVerdict) &&
        /imp-35337a/.test(o.citation) &&
        /NO QED/.test(o.verdict) &&
        /refereed bound is changed/i.test(o.verdict)
      );
    },
  },
];

for (const a of IMP35551_ROUTE_I_REQUIREMENT_SEVERITY_RANKING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35551-route-i-requirement-severity-ranking assertion failed: ${a.id}`);
  }
}
