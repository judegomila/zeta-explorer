/**
 * @module imp-routeB-flow-vs-lambda-firewall
 *
 * imp-2854 (high, accuracy): Audit the Route B lim-sup crown jewel and CERTIFY
 * that it bounds the PARTICLE FLOW, not Lambda -- a no-leak firewall.
 *
 * THE CROWN JEWEL (Route B / imp-341)
 * -----------------------------------
 * lambda-intercept-burgers-uniformity.js (imp-341) establishes UNCONDITIONALLY,
 * with NO GUE / local-law / Erdos-Schlein-Yau input:
 *
 *     a := lim sup_{N -> inf} |t_c(N)| = tau_shock(rho_inf) = 0.
 *
 * This is the genuine PCC/GUE-free rigorous result (full-route-map opp #5,
 * "RIGOROUS-SOTA"). BUT t_c(N) is the first-collision TIME of the N-particle
 * backward Calogero-Moser / Dyson flow. The statement lives entirely on the
 * PARTICLE-FLOW side: it says the collision time of the flow tends to 0. It is
 * NOT, by itself, a statement about the de Bruijn-Newman Lambda.
 *
 * THE FIREWALL QUESTION
 * ---------------------
 * full-route-map-2026-06-19 flags Route B as "genuine rigorous crown jewel
 * (PCC/GUE-free) but about the PARTICLE FLOW, not Lambda". A prior overclaim
 * pattern (six caught in the 2026-06-19 session) is to let a rigorous flow
 * result be mis-stated as a rigorous Lambda bound. So: trace EVERY edge by which
 * imp-341 attaches to a downstream node, and certify that every edge which
 * actually produces a Lambda STATEMENT passes through the C_H / G6a Holder-1/2
 * shock-modulus bridge (the single load-bearing object, RANKED_OPPORTUNITIES #1).
 * No path may turn the rigorous flow result into a rigorous Lambda bound without
 * C_H.
 *
 * THE DEPENDENCY TRACE (every DAG / module edge consuming imp-341)
 * ---------------------------------------------------------------
 * Classified by what each consumer PRODUCES:
 *
 *   FLOW-INTERNAL (refine the flow object; produce NO Lambda statement)
 *     - imp-348 (microscopic-strip rate upgrade, angle a): tightens the
 *       modulus-of-continuity psi_N by sqrt(N)/log gamma_N. A property of the
 *       flow uniformity. No Lambda.
 *     - imp-370 (rate upgrade angle b via ESY local law): psi_N from
 *       O(log gamma_N / sqrt N) to O(1/N). A property of the flow. No Lambda.
 *
 *   DIAGNOSTIC (cross-checks; not a rigorous bound)
 *     - imp-374 (10-row cross-validation table): records that every Lambda
 *       ESTIMATE agrees within eps = 0.01. Agreement of estimates, not a
 *       derivation of a rigorous Lambda bound.
 *
 *   ASSEMBLY-TO-LAMBDA (the ONLY edges that feed a Lambda statement)
 *     - imp-344 (master assembly): assembles Routes A/B/C and SURFACES
 *       G6_polymath15_bridge as the load-bearing blocker. The move from t_c to a
 *       Lambda statement is gated on that bridge -- it does not cross it.
 *     - imp-354 (G6a Holder-1/2 closure, partial): IS the C_H / G6a bridge
 *       itself (two open sub-sub-gaps). Not a bypass; the bridge under repair.
 *     - imp-1261 asymptotic-lambda-bound-2026-05-20: the ONLY place imp-341
 *       feeds an actual Lambda NUMBER (Lambda <= 3.06e-5), and it is EXPLICITLY
 *       "modulo Polymath15 bridge G6a_shock_lipschitz" (its own conditional, per
 *       lambda-roadmap step 4). The flow lim-sup is composed with the bridge;
 *       drop the bridge and the Lambda number is gone.
 *
 * THE CERTIFICATION
 * -----------------
 * Every ASSEMBLY-TO-LAMBDA edge passes through C_H / G6a. No FLOW-INTERNAL or
 * DIAGNOSTIC edge produces a Lambda bound at all. Therefore:
 *
 *     Route B ALONE (imp-341, unconditional) yields NO unconditional Lambda
 *     bound. The only unconditional thing it yields is the flow statement
 *     lim sup |t_c(N)| = 0. Every conversion into a Lambda statement is gated on
 *     the (still-open, RH-hard-at-the-modulus) C_H / G6a Holder-1/2 shock
 *     modulus. The crown-jewel rigor does NOT leak into a Lambda overclaim.
 *
 * HONESTY GUARD
 * -------------
 * This is an AUDIT / FIREWALL module. It asserts NO new bound, discharges NO
 * conditional, and changes NO Lambda value. It pins, in code, the firewall
 * predicate: for every edge E out of imp-341, NOT (E yields a rigorous Lambda
 * statement AND E does not pass through C_H). Platt-Trudgian Lambda <= 0.2 stays
 * the rigorous SOTA; this module produces nothing tighter.
 *
 * Light module: per the build-hang guidance for heavy assertion modules, source
 * facts are baked as reference literals (the consuming files transitively pull
 * the 16.7MB zeros bundle); the firewall logic is self-contained.
 *
 * @see lambda-intercept-burgers-uniformity.js (imp-341: lim sup |t_c(N)| = 0)
 * @see full-route-map-2026-06-19.js (Route B "PARTICLE FLOW, not Lambda"; opp #5)
 * @see asymptotic-lambda-bound-2026-05-20.js (imp-1261: Lambda<=3.06e-5 modulo G6a)
 * @see rh-dag.js (imp-341 consumers: imp-344/348/354/370/374)
 * @see imp-2701-ch-rigor-lock.js (C_H not rigorous; finite-N no rigorous beat)
 */

const PT_BOUND = 0.2; // Platt-Trudgian 2021 rigorous unconditional Lambda SOTA.

// The Route B unconditional flow statement -- a property of t_c, NOT of Lambda.
const ROUTE_B_FLOW_STATEMENT = {
  id: 'imp-341',
  object: 't_c(N) = first-collision time of the N-particle backward Calogero-Moser / Dyson flow',
  statement: 'a := lim sup_{N -> inf} |t_c(N)| = tau_shock(rho_inf) = 0',
  unconditional: true,
  usesGUEorLocalLaw: false, // PCC/GUE-free crown jewel
  isLambdaStatement: false, // about the PARTICLE FLOW, not Lambda
};

// Every edge out of imp-341 in the DAG / module graph, classified by what it
// PRODUCES and whether the t_c -> Lambda conversion routes through C_H / G6a.
// kind: flow-internal | diagnostic | assembly-to-lambda
const ATTACHMENT_EDGES = [
  {
    consumer: 'imp-348',
    kind: 'flow-internal',
    produces: 'tighter modulus-of-continuity psi_N (rate upgrade, angle a)',
    yieldsLambdaStatement: false,
    passesThroughCH: false, // n/a -- never reaches a Lambda statement
  },
  {
    consumer: 'imp-370',
    kind: 'flow-internal',
    produces: 'psi_N from O(log gamma_N / sqrt N) to O(1/N) via ESY local law',
    yieldsLambdaStatement: false,
    passesThroughCH: false,
  },
  {
    consumer: 'imp-374',
    kind: 'diagnostic',
    produces: 'cross-validation that Lambda ESTIMATES agree within eps = 0.01',
    yieldsLambdaStatement: false, // agreement of estimates, not a rigorous bound
    passesThroughCH: false,
  },
  {
    consumer: 'imp-344',
    kind: 'assembly-to-lambda',
    produces: 'master assembly of Routes A/B/C; surfaces G6_polymath15_bridge as blocker',
    yieldsLambdaStatement: true,
    passesThroughCH: true, // gated on the surfaced G6 bridge -- does not cross it unconditionally
  },
  {
    consumer: 'imp-354',
    kind: 'assembly-to-lambda',
    produces: 'the C_H / G6a Holder-1/2 closure itself (partial, two sub-sub-gaps)',
    yieldsLambdaStatement: true,
    passesThroughCH: true, // IS the bridge, not a bypass
  },
  {
    consumer: 'imp-1261 (asymptotic-lambda-bound-2026-05-20)',
    kind: 'assembly-to-lambda',
    produces: 'Lambda <= 3.06e-5 asymptotic, EXPLICITLY modulo Polymath15 G6a_shock_lipschitz',
    yieldsLambdaStatement: true,
    passesThroughCH: true, // the only Lambda NUMBER; drops to nothing without C_H
  },
];

// The firewall predicate, evaluated per edge: a LEAK is an edge that yields a
// rigorous Lambda statement WITHOUT passing through C_H / G6a.
const LEAKS = ATTACHMENT_EDGES.filter(
  (e) => e.yieldsLambdaStatement && !e.passesThroughCH,
);

// Edges that actually produce a Lambda statement -- every one must route through C_H.
const LAMBDA_EDGES = ATTACHMENT_EDGES.filter((e) => e.yieldsLambdaStatement);
const ALL_LAMBDA_EDGES_THROUGH_CH = LAMBDA_EDGES.every((e) => e.passesThroughCH);

// Edges that stay on the flow side (no Lambda statement at all).
const FLOW_SIDE_EDGES = ATTACHMENT_EDGES.filter((e) => !e.yieldsLambdaStatement);

export const ROUTE_B_FLOW_VS_LAMBDA_FIREWALL = {
  id: 'imp-2854',
  question:
    'Does the Route B crown jewel (imp-341 lim sup |t_c(N)| = 0, RIGOROUS-SOTA) bound the ' +
    'PARTICLE FLOW or Lambda? Trace every edge by which imp-341 attaches downstream and ' +
    'certify that every edge yielding a Lambda statement passes through the C_H / G6a bridge ' +
    '(no path turns the rigorous flow result into a rigorous Lambda bound without C_H).',
  routeBFlowStatement: ROUTE_B_FLOW_STATEMENT,
  attachmentEdges: ATTACHMENT_EDGES,
  trace: {
    flowSideConsumers: FLOW_SIDE_EDGES.map((e) => e.consumer), // imp-348, imp-370, imp-374
    lambdaSideConsumers: LAMBDA_EDGES.map((e) => e.consumer), // imp-344, imp-354, imp-1261
    bridgeObject:
      'C_H / G6a Holder-1/2 shock modulus (C_H = C_shock * C_Lip / 4); the single ' +
      'load-bearing object, RANKED_OPPORTUNITIES #1, RH-hard at the modulus (Gronwall ' +
      'route refuted, imp-2640 / imp-2839).',
  },
  certification: {
    everyLambdaEdgePassesThroughCH: ALL_LAMBDA_EDGES_THROUGH_CH, // true
    leakCount: LEAKS.length, // 0
    leaks: LEAKS, // []
    verdict:
      'NO LEAK. Every edge out of imp-341 that yields a Lambda statement (imp-344 assembly, ' +
      'imp-354 the bridge itself, imp-1261 the only Lambda number) passes through the C_H / G6a ' +
      'bridge. The remaining edges (imp-348, imp-370 rate upgrades; imp-374 cross-val) stay on ' +
      'the PARTICLE-FLOW side and produce no Lambda bound. Route B ALONE yields NO unconditional ' +
      'Lambda bound -- only the flow statement lim sup |t_c(N)| = 0.',
  },
  status: 'FIREWALL-CERTIFIED-NO-LEAK',
  changesAnyBound: false,
  ptBound: PT_BOUND,
  verdict:
    'CERTIFIED: the Route B crown jewel bounds the PARTICLE FLOW (t_c), not Lambda. Its only ' +
    'unconditional output is lim sup |t_c(N)| = 0; every conversion into a Lambda statement is ' +
    'gated on the still-open C_H / G6a Holder-1/2 shock modulus. The rigorous flow result does ' +
    'NOT leak into a rigorous Lambda overclaim. Audit only -- changes no bound. Platt-Trudgian ' +
    'Lambda <= 0.2 stays SOTA.',
  citation:
    'imp-341 lambda-intercept-burgers-uniformity.js (lim sup |t_c| = 0, PCC/GUE-free); ' +
    'full-route-map-2026-06-19 (Route B "PARTICLE FLOW, not Lambda", opp #5); ' +
    'imp-1261 asymptotic-lambda-bound-2026-05-20 (Lambda<=3.06e-5 modulo G6a)',
};

export const ROUTE_B_FLOW_VS_LAMBDA_FIREWALL_ASSERTIONS = [
  {
    id: 'imp2854-routeB-statement-is-flow-not-lambda',
    description: 'The imp-341 unconditional output is a PARTICLE-FLOW statement (lim sup |t_c| = 0), NOT a Lambda statement',
    holds: () =>
      ROUTE_B_FLOW_STATEMENT.unconditional === true &&
      ROUTE_B_FLOW_STATEMENT.isLambdaStatement === false &&
      ROUTE_B_FLOW_STATEMENT.usesGUEorLocalLaw === false &&
      /t_c/.test(ROUTE_B_FLOW_STATEMENT.object) &&
      /lim sup/.test(ROUTE_B_FLOW_STATEMENT.statement),
  },
  {
    id: 'imp2854-every-lambda-edge-passes-through-CH',
    description: 'Every attachment edge that yields a Lambda statement passes through the C_H / G6a bridge',
    holds: () =>
      LAMBDA_EDGES.length === 3 &&
      ALL_LAMBDA_EDGES_THROUGH_CH === true &&
      LAMBDA_EDGES.every((e) => e.passesThroughCH === true),
  },
  {
    id: 'imp2854-no-leak-routeB-alone-no-lambda-bound',
    description: 'FIREWALL: no edge turns the rigorous flow result into a rigorous Lambda bound without C_H (leak count 0)',
    holds: () =>
      LEAKS.length === 0 &&
      ROUTE_B_FLOW_VS_LAMBDA_FIREWALL.certification.everyLambdaEdgePassesThroughCH === true &&
      /FIREWALL-CERTIFIED-NO-LEAK/.test(ROUTE_B_FLOW_VS_LAMBDA_FIREWALL.status),
  },
  {
    id: 'imp2854-flow-side-edges-produce-no-lambda',
    description: 'The flow-internal / diagnostic consumers (imp-348, imp-370, imp-374) produce NO Lambda statement',
    holds: () =>
      FLOW_SIDE_EDGES.length === 3 &&
      FLOW_SIDE_EDGES.every((e) => e.yieldsLambdaStatement === false) &&
      FLOW_SIDE_EDGES.some((e) => e.consumer === 'imp-374' && e.kind === 'diagnostic'),
  },
  {
    id: 'imp2854-audit-only-no-bound-change-pt-sota',
    description: 'HONESTY: firewall is audit-only, changes no bound, keeps Platt-Trudgian Lambda <= 0.2 SOTA',
    holds: () =>
      ROUTE_B_FLOW_VS_LAMBDA_FIREWALL.changesAnyBound === false &&
      ROUTE_B_FLOW_VS_LAMBDA_FIREWALL.ptBound === 0.2 &&
      /stays SOTA/.test(ROUTE_B_FLOW_VS_LAMBDA_FIREWALL.verdict),
  },
];

for (const a of ROUTE_B_FLOW_VS_LAMBDA_FIREWALL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-routeB-flow-vs-lambda-firewall assertion failed: ${a.id}`);
  }
}
