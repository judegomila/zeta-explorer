/**
 * @module full-route-map-2026-06-19
 *
 * THE COMPLETE MAP of every route this RH / de Bruijn-Newman Lambda project has
 * tried (Opus 4.8, full-route-map workflow, 5 cluster-mappers + synthesis,
 * 2026-06-19). 36 routes classified by status and GENUINE remaining opportunity.
 * The honest, consolidated picture after the session's six caught overclaims.
 * 2026-09-02 UPDATE: a sixth cluster (permutationFreeze) records the post-freeze
 * permutation-architecture frontier (imp-95006..95011 campaign); the frozen
 * 2026-06-19 core clusters are unchanged. Total now 44 routes.
 *
 * THE ONE-LINE TRUTH: there is NO hidden shortcut below RH anywhere in the map.
 * Every route that could deliver an actual Lambda number short of RH funnels
 * into ONE object -- the C_H / G6a Holder-1/2 shock modulus -- which is RH-hard
 * at the modulus (the obvious Gronwall approach is refuted, imp-2640). Everything
 * else is rigorous-but-sharpens-the-wrong-term, a faithful RH reformulation, or
 * dead/refuted/non-binding. No refereed bound is changed
 * ; the project did not produce it.
 *
 * STATUS LEGEND:
 *   RIGOROUS-SOTA  - unconditionally established (the floor we stand on)
 *   CONDITIONAL    - rigorous modulo a NAMED unproven input
 *   ESTIMATE       - numerical, not a rigorous bound
 *   OPEN-HARD      - genuine open problem, not a reformulation
 *   RH-EQUIVALENT  - a faithful reformulation; renames RH, no shortcut
 *   DEAD-END-FORNOW       - structurally closed / 50-year wall
 *   REFUTED        - a caught overclaim, withdrawn
 *   UNDER-EXPLORED - genuine untapped thread remains
 */

import { LAMBDA_DEPENDENCY_MATRIX } from './lambda-roadmap.js';

export const FULL_ROUTE_MAP = {
  date: 'frozen 2026-06-19 core + post-freeze frontier cluster added 2026-09-02',
  totalRoutes: 44, // 38 frozen-core routes (synthesis cited ~36) + 6 post-freeze permutationFreeze routes
  clusters: {
    lambdaUpper: [
      { name: 'Route A finite-N*=1e4 beat', status: 'ESTIMATE', opp: 3, note: 'gated on C_H; PT-comparable IF C_H lands' },
      { name: 'Route B Burgers lim-sup t_c->0 (imp-341)', status: 'RIGOROUS-SOTA', opp: 5, note: 'genuine rigorous crown jewel (PCC/GUE-free) but about the PARTICLE FLOW, not Lambda' },
      { name: 'Route C density squeeze / G3a', status: 'DEAD-END-FORNOW', opp: 1, note: 'GUE extremal scaling R_N~N^4/3 eliminates it; dissolves into A/B' },
      { name: 'Thin-strip E_trunc / kappa_T (imp-2622)', status: 'REFUTED', opp: 0, note: 'frozen-kappa height-mismatch artifact (imp-2630)' },
      { name: 'Step-4 bridge / Polymath15 G6a', status: 'OPEN-HARD', opp: 4, note: 'THE critical lever = C_H; RH-hard at the modulus' },
      { name: 'Theta-trap rigorous t_c^part bound', status: 'CONDITIONAL', opp: 6, note: 'rigorous but NEGATIVE for the headline (sign algebra; buys nothing on Lambda)' },
    ],
    directRH: [
      { name: 'Volterra ||V||<=1 collapse (imp-1258)', status: 'RH-EQUIVALENT', opp: 1, note: 'ELIMINATED as reduction; 5000x margin was a homogeneity artifact' },
      { name: 'Normalized-R / Conj-26.3', status: 'RH-EQUIVALENT', opp: 2, note: 'least-ruled-out direct target but information-preservingly RH-equivalent' },
      { name: 'Beurling-Nyman (imp-1312)', status: 'RH-EQUIVALENT', opp: 1, note: 'strict equivalence; d_N~1/sqrt(log N) astronomically slow' },
      { name: 'de Branges / CDB-Exist (imp-1340)', status: 'RH-EQUIVALENT', opp: 1, note: 'vacuous without Hermite-Biehler positivity = RH' },
      { name: 'ESY / Selberg-trace closure (imp-1184)', status: 'DEAD-END-FORNOW', opp: 2, note: 'Montgomery PCC 50-year wall' },
      { name: 'Hidden-square §15-27 program', status: 'RH-EQUIVALENT', opp: 2, note: '§25.5 symmetry missing; raw diagonal cannot dominate' },
    ],
    machineryCrossvalLower: [
      { name: 'Heat-discriminant exact t_c (imp-2563)', status: 'RIGOROUS-SOTA', opp: 7, note: 'rigorous non-dynamical instrument; redirect at E(N)' },
      { name: 'Theta-trap theorems (general tool)', status: 'RIGOROUS-SOTA', opp: 8, note: 'rigorous CM-flow algebra; the right instrument for E(N) constants' },
      { name: 'Min-gap sandwich theorem (imp-2563 R_B)', status: 'CONDITIONAL', opp: 5, note: 'two-sided bracket throttled by an unproven field bound beta' },
      { name: 'Heat-flow Lambda cross-val (imp-292)', status: 'ESTIMATE', opp: 3, note: 'cross-check only' },
      { name: 'Barrier extrapolation (imp-299)', status: 'ESTIMATE', opp: 2, note: 'cross-check only' },
      { name: 'Kernel-hack analytical (imp-360)', status: 'ESTIMATE', opp: 2, note: 'cross-check only' },
      { name: 'DP5 second-integrator (imp-2466)', status: 'RIGOROUS-SOTA', opp: 4, note: 'rigorous numeric cross-check instrument' },
      { name: 'CSV / Lehmer-pair lower bound', status: 'DEAD-END-FORNOW', opp: 2, note: 'dominated by Rodgers-Tao' },
      { name: 'Rodgers-Tao Lambda>=0 (cited)', status: 'RIGOROUS-SOTA', opp: 1, note: 'closes the lower side; sharp under RH' },
      { name: 'Krein SSF (imp-2425)', status: 'RH-EQUIVALENT', opp: 3, note: 'Conj 18.4 IS RH' },
    ],
    literaturePCC: [
      { name: 'Guth-Maynard 2024 (imp-1332)', status: 'DEAD-END-FORNOW', opp: 1, note: 'E_trunc non-binding (261x below L_cond)' },
      { name: 'Soundararajan-Tao 2024 (imp-1331)', status: 'REFUTED', opp: 0, note: 'PHANTOM citation; wrong object' },
      { name: 'Bui-Soundararajan port', status: 'CONDITIONAL', opp: 1, note: 'non-binding E_trunc' },
      { name: 'Goldston-Gonek 2pt PCC (imp-1302)', status: 'DEAD-END-FORNOW', opp: 1, note: '50-year wall; fabricated citation flagged' },
      { name: 'Maynard sieve PCC (imp-1318)', status: 'DEAD-END-FORNOW', opp: 1, note: '50-year wall' },
      { name: 'Selberg-trace PCC (imp-1297)', status: 'DEAD-END-FORNOW', opp: 1, note: 'arithmetic dichotomy' },
      { name: 'Conrey-Snaith moments (imp-1126)', status: 'CONDITIONAL', opp: 2, note: 'RMT-conditional' },
    ],
    originalIdeas: [
      { name: 'Zeta-as-supercritical-fluid thermodynamics', status: 'ESTIMATE', opp: 4, note: 'bulk order-parameter EMPIRICALLY eliminated (imp-2323, no transition in (1/2,1)); pressure families = RH-equivalent' },
      { name: 'Topological surface tension = quantized winding', status: 'DEAD-END-FORNOW', opp: 1, note: 'CLOSED (was UNDER-EXPLORED): experiment run (imp-2673/2696/2859), interpretation CORRECTED by imp-34813 -- the Gaussian proxy was the EXACT flow in negative de Bruijn time (conv identity ~1e-9), the "artifact" drop was genuine zeros-leaving-the-line; monotonicity is classical (de Bruijn Thm 13 + jet lemma); ceiling refined: lower side hard-capped (Lambda>0 iff RH false), upper side = the existing Lambda<=0.2 architecture; no new bound' },
      { name: 'Selberg S(T) super-critical (imp-1333)', status: 'RH-EQUIVALENT', opp: 1, note: 'circular Lambda link' },
      { name: 'Levinson-Conrey mollifier (imp-1336)', status: 'DEAD-END-FORNOW', opp: 1, note: 'symmetry-locked to the line' },
      { name: 'Berry-Keating H=xp (Hilbert-Polya)', status: 'OPEN-HARD', opp: 3, note: 'genuinely open but the missing piece IS the PCC wall; heavily approached in literature' },
      { name: 'Connes adelic / Weil-positivity', status: 'RH-EQUIVALENT', opp: 2, note: 'Weil positivity = RH across all sub-routes' },
      { name: 'Voronin universality', status: 'RH-EQUIVALENT', opp: 1, note: 'Bagchi strong-recurrence = RH; nonvanishing is where RH hides' },
      { name: 'Twin-ladder multiplicative deformation', status: 'DEAD-END-FORNOW', opp: 1, note: 'does not reach Lambda; only descendant (Volterra) eliminated' },
      { name: 'Prime-caustic / phase-crystal', status: 'DEAD-END-FORNOW', opp: 2, note: 'visualization/metaphor, sigma-independent' },
    ],
    // Post-freeze frontier (added 2026-09-02): the permutation-architecture campaign
    // opened AFTER the 2026-06-19 freeze. Statuses grounded in the imp-95006..95011
    // gate-ranking / weld-chain / Rouche-pilot closure notes. The Lambda<=0.14
    // completion contract is a contract, not a bound.
    permutationFreeze: [
      { name: 'Gate-2 producer (18-moment carrier) / the one open family', status: 'OPEN-HARD', opp: 8, note: 'the Λ≤0.14 contract reduces to |C_E,17| < 0.2797 on 690988≤N≤54799999; Gate 2 ranked most promotable (imp-95007); REAL oscillation probe queued (evaluator = pointwise E97, anchor 0.2141254901198318)' },
      { name: '[B_v,Π_p] weld alias bracket (imp-95008 chain)', status: 'CONDITIONAL', opp: 7, note: '20-continuation rigorous chain drove the far-bracket gap 41x -> 2.81x; refereed SOUND-WITH-CAVEATS (fix bundle queued); dominant remaining slack = parity AM-GM factor 2' },
      { name: 'Conditional Λ≤0.1399 row (Thm 4.5 two-task split)', status: 'CONDITIONAL', opp: 5, note: 'explicit target: rectangular-slab inheritance + new final-time tail; PARKED pending the dependency-direction check (does it presuppose the open family?)' },
      { name: 'Graph-compression correlated isometry (eq. 30/31)', status: 'OPEN-HARD', opp: 4, note: 'the ONE permutation family with possible gain; ceiling conditional on (G) representation (zero-free-strip-equivalent) — parked below unconditional lanes' },
      { name: 'Moving-reference Rouché gluing (eq. 44)', status: 'DEAD-END-FORNOW', opp: 2, note: 'pilot chart cover valid (winding 0) but does NOT relax the open-family budget (imp-95010)' },
      { name: 'Inertia × pair-correlation synergy (external 2/3 method)', status: 'UNDER-EXPLORED', opp: 6, note: 'Christoffel-diagonal/von Neumann trace Q measurement rides the Gate-2 evaluator; L2 detection-modulus formalization queued' },
    ],
  },
};

// Ranked GENUINE opportunities (NOT RH-reformulations), highest first.
export const RANKED_OPPORTUNITIES = [
  { rank: 1, target: 'C_H / G6a Holder-1/2 shock modulus (Step-4 bridge)', why: 'THE single load-bearing object: an N-uniform bound makes E_coll rigorous (Route A -> rigorous finite beat) AND composes Route B lim-sup into Lambda<=E(N)->0 (RH). A concrete analytic estimate on a specific PDE shock, NOT a rename of RH. Gated: RH-hard at the modulus; naive Gronwall refuted (imp-2640: int 2/g^2 diverges at collision).' },
  { rank: 2, target: 'Redirect Theta-trap R1/R2 + heat-discriminant ladder at E(N) constants', why: 'The linchpin resolution freed this rigorous CM-flow machinery from chasing the wrong t_c term; pointed at E_coll/E_flow it is the live non-RH-equivalent move. Sharpens constants; does not cross the C_H wall alone.' },
  { rank: 3, target: 'Normalized-R endpoint-bridge mu^pass construction (Conj-26.3)', why: 'Least-ruled-out direct target; mu^pass is genuinely unconstructed and not proven impossible. Capped: any success is a faithful RH reformulation (section26-verdict) -- structural/expository upside only.' },
  { rank: 4, target: 'Min-gap sandwich theorem conditional on beta', why: 'Two-sided bracket stronger than the A1 pinch; links to opportunity 2; throttled by an unproven uniform field bound. Same E(N)-only ceiling.' },
  { rank: 5, target: 'Supercritical-fluid quantized-winding-under-heat-flow experiment', why: 'The one genuinely under-explored original idea: is d(winding(arg H_tau))/d(tau) a monotone Lyapunov quantity? Realistic ceiling = a topological re-derivation of Lambda>=0; will NOT beat PT. Worth ONE time-boxed pass. [RESOLVED: passes imp-2673/2696/2859; deep-dive imp-34813 CORRECTED the artifact interpretation (proxy = exact negative-time flow) and refined the ceiling (lower hard-capped Lambda>0 iff RH false; upper = existing PT-0.2 architecture). Thread closed, no new bound.]' },
];

// Cross-check of the route map against the project's other views (DAG, roadmap).
// Flags where an older view still asserts something the map's verdicts refute.
export const ROUTE_MAP_CROSS_CHECK = {
  date: '2026-06-19',
  checkedAgainst: ['LAMBDA_DEPENDENCY_MATRIX (the /rh-dag DAG)', 'lambda-roadmap OPEN_GAPS + currentStatus'],
  inconsistencies: [
    {
      view: 'DAG: LAMBDA_DEPENDENCY_MATRIX node bound-imp-440-finite-1e4',
      asserts: '"Lambda(1e4) <= 0.02 rigorous unconditional (measured)" with note "No conditional in its closure -- unconditional finite-N* beat"',
      mapVerdict: 'ESTIMATE-not-rigorous: E_coll constant C_H is undischargeable (imp-2640 NEGATIVE, Gronwall diverges at collision); |t_c_proj| is OLS not rigorous (imp-2632)',
      fix: 'relabel the DAG node to ESTIMATE / rigorous-modulo-C_H, and add a cond-CH (Holder-modulus) conditional leaf the node depends on -- it does NOT have an empty conditional closure',
      severity: 'high',
      resolution: 'reconciled',
      resolvedBy: 'imp-2674 + imp-2750',
    },
    {
      view: 'DAG: bound-imp-1261-asymptotic note "Sole modulo conditional: cond-polymath15-G6a"',
      asserts: 'G6a modelled as a single closable leaf conditional',
      mapVerdict: 'G6a = C_H is RH-hard at the modulus; the obvious Gronwall discharge route is REFUTED (imp-2640) -- not a routinely closable leaf',
      fix: 'annotate cond-polymath15-G6a with the imp-2640 NEGATIVE status so the DAG does not read as "one small lemma away"',
      severity: 'medium',
      resolution: 'reconciled',
      resolvedBy: 'imp-2674 + imp-2750',
    },
  ],
  consistent: [
    'roadmap currentStatus tripwire already forbids "RH follows unconditionally" (imp-2519) -- consistent with the map',
    'roadmap asymptotic bound is labelled "rigorous-modulo-polymath15-G6a" -- consistent (modulo wording), though the map sharpens G6a to RH-hard',
    'Rodgers-Tao Lambda>=0 and PT Lambda<=0.2 as the rigorous floor -- consistent across DAG, roadmap, and map',
  ],
  netVerdict: 'The DAG finite-beat node WAS the stale view; reconciled by imp-2674/imp-2750 — all views now agree the finite-N*=1e4 beat is an ESTIMATE gated on C_H, not a rigorous-unconditional result.',
};

export const FULL_ROUTE_MAP_NEXT_MOVE = {
  primary: 'Focused independently-refereed push on C_H, framed as "sharpen E(N) toward a CONDITIONAL rigorous beat" (NOT "prove Lambda<0.2"): can the Theta/isolation machinery + exact discriminant ladder supply a COLLISION-REGULARIZED replacement for the divergent Gronwall integral, bounding the shock modulus near the collision where Gronwall blows up? Fails cleanly -> definitively retires the finite-N beat to ESTIMATE.',
  secondary: 'Time-boxed supercritical-fluid winding-under-heat-flow numerical experiment (d(winding)/d(tau) monotonicity).',
  doNotInvest: 'PCC approaches, zero-density / literature ports (non-binding E_trunc), re-running the Volterra bare-V pilot.',
};

export const FULL_ROUTE_MAP_ASSERTIONS = [
  {
    id: 'route-map-36-routes-5-clusters',
    description: 'The map enumerates 44 routes across 6 clusters (38 frozen-core + 6 post-freeze permutationFreeze)',
    holds: () => {
      const n = Object.values(FULL_ROUTE_MAP.clusters).reduce((s, c) => s + c.length, 0);
      return n === FULL_ROUTE_MAP.totalRoutes && Object.keys(FULL_ROUTE_MAP.clusters).length === 6;
    },
  },
  {
    id: 'route-map-CH-is-the-funnel',
    description: 'The top ranked opportunity is C_H, the single load-bearing object',
    holds: () => RANKED_OPPORTUNITIES[0].rank === 1 && /C_H/.test(RANKED_OPPORTUNITIES[0].target),
  },
  {
    id: 'route-map-supercritical-winding-is-the-original-thread',
    description: 'The quantized-winding thread (formerly the one UNDER-EXPLORED original idea) is now CLOSED with the imp-34813 interpretation correction recorded',
    holds: () => FULL_ROUTE_MAP.clusters.originalIdeas.some((r) => r.status === 'DEAD-END-FORNOW' && /winding/.test(r.name) && /imp-34813/.test(r.note) && /negative de Bruijn time/.test(r.note)),
  },
  {
    id: 'route-map-no-shortcut-pt-sota',
    description: 'No shortcut below RH; no refereed bound is changed (recorded in the next-move discipline)',
    holds: () => /CONDITIONAL rigorous beat/.test(FULL_ROUTE_MAP_NEXT_MOVE.primary) && /non-binding/.test(FULL_ROUTE_MAP_NEXT_MOVE.doNotInvest),
  },
  {
    id: 'route-map-cross-check-dag-nodes-exist',
    description: 'Every DAG node ID referenced in ROUTE_MAP_CROSS_CHECK.inconsistencies exists in LAMBDA_DEPENDENCY_MATRIX',
    holds: () => {
      const nodeIds = new Set(LAMBDA_DEPENDENCY_MATRIX.nodes.map((n) => n.id));
      return (
        nodeIds.has('bound-imp-440-finite-1e4') &&
        nodeIds.has('bound-imp-1261-asymptotic') &&
        nodeIds.has('cond-polymath15-G6a')
      );
    },
  },
  {
    // Regression tripwire (imp-2738): the 6 caught overclaims must keep their
    // honest withdrawn status. A silent regrade to a false rigorous/reduction
    // status (the exact failure mode that produced these overclaims) fails the
    // build. Each row is found by name-regex across all clusters; its .status
    // must sit in the allowed honest set -- never 'RIGOROUS' or 'REDUCTION'.
    id: 'route-map-caught-overclaims-stay-honest',
    description: 'The 6 caught overclaims keep their honest withdrawn status (no silent re-promotion to RIGOROUS/REDUCTION)',
    holds: () => {
      const FORBIDDEN = new Set(['RIGOROUS', 'REDUCTION']);
      const PINS = [
        { nameRe: /thin-strip|kappa_T/i, allowed: ['REFUTED'], who: 'imp-2622 thin-strip kappa_T' },
        { nameRe: /Soundararajan-Tao/i, allowed: ['REFUTED'], who: 'imp-1331 Soundararajan-Tao' },
        { nameRe: /Volterra/i, allowed: ['RH-EQUIVALENT'], who: 'imp-1258 Volterra collapse' },
        { nameRe: /Beurling-Nyman/i, allowed: ['RH-EQUIVALENT'], who: 'Beurling-Nyman' },
        { nameRe: /de Branges|CDB-Exist/i, allowed: ['RH-EQUIVALENT'], who: 'de Branges / CDB-Exist' },
        { nameRe: /Hidden-square|15-27/i, allowed: ['RH-EQUIVALENT'], who: 'hidden-square 15-27 program' },
      ];
      const allRows = Object.values(FULL_ROUTE_MAP.clusters).flat();
      for (const pin of PINS) {
        const row = allRows.find((r) => pin.nameRe.test(r.name));
        if (!row) throw new Error(`overclaim pin row not found: ${pin.who}`);
        if (FORBIDDEN.has(row.status) || !pin.allowed.includes(row.status)) {
          throw new Error(`caught overclaim re-promoted: ${pin.who} is now '${row.status}', expected one of [${pin.allowed.join(', ')}]`);
        }
      }
      return true;
    },
  },
  {
    // Overclaim tripwire (imp-2754): the three heuristic Lambda cross-checks --
    // heat-flow (imp-292), barrier extrapolation (imp-299), kernel-hack (imp-360)
    // -- are EXPLICITLY estimates, not bounds. Each must keep status 'ESTIMATE'
    // and a 'cross-check' note, and must NOT acquire a rigorous / bound /
    // proves-Lambda framing in its name, status, or note. This blocks a future
    // edit silently promoting a cross-validation estimator into a load-bearing
    // rigorous claim (a classic overclaim vector).
    id: 'route-map-estimator-crosschecks-stay-estimate',
    description: 'The 3 heuristic cross-checks (heat-flow imp-292, barrier imp-299, kernel-hack imp-360) stay status ESTIMATE / cross-check only (no promotion to a rigorous bound)',
    holds: () => {
      const FORBIDDEN = /\b(rigorous|RIGOROUS|bound|BOUND|proves[- ]?Lambda)\b/;
      const PINS = [
        { nameRe: /Heat-flow.*imp-292/i, who: 'heat-flow Lambda cross-val (imp-292)' },
        { nameRe: /Barrier extrapolation.*imp-299/i, who: 'barrier extrapolation (imp-299)' },
        { nameRe: /Kernel-hack.*imp-360/i, who: 'kernel-hack analytical (imp-360)' },
      ];
      const allRows = Object.values(FULL_ROUTE_MAP.clusters).flat();
      for (const pin of PINS) {
        const row = allRows.find((r) => pin.nameRe.test(r.name));
        if (!row) throw new Error(`estimator cross-check pin row not found: ${pin.who}`);
        if (row.status !== 'ESTIMATE') {
          throw new Error(`estimator cross-check promoted: ${pin.who} is now status '${row.status}', expected 'ESTIMATE'`);
        }
        if (!/cross-check/i.test(row.note || '')) {
          throw new Error(`estimator cross-check lost its cross-check note: ${pin.who} note='${row.note}'`);
        }
        if (FORBIDDEN.test(row.name) || FORBIDDEN.test(row.status) || FORBIDDEN.test(row.note || '')) {
          throw new Error(`estimator cross-check acquired a rigorous/bound framing: ${pin.who}`);
        }
      }
      return true;
    },
  },
];

for (const a of FULL_ROUTE_MAP_ASSERTIONS) {
  if (!a.holds()) throw new Error(`full-route-map assertion failed: ${a.id}`);
}
