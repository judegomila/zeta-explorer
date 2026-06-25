/**
 * imp-2750: DAG / route-map status-consistency cross-tripwire.
 *
 * full-route-map-2026-06-19.js (ROUTE_MAP_CROSS_CHECK.netVerdict) named the
 * /rh-dag dependency matrix as the ONE stale view that still presented the
 * finite-N*=1e4 beat as "rigorous unconditional with an empty conditional
 * closure", contradicting the C_H finding (E_coll constant undischargeable,
 * imp-2640 NEGATIVE). The content reconcile (imp-2674) downgraded the DAG node
 * bound-imp-440-finite-1e4 to an ESTIMATE gated on cond-CH. This module is the
 * CHECK that the two views can never silently disagree again: it FAILS the
 * build if the DAG node ever re-acquires a rigorous-unconditional framing while
 * carrying an empty conditional closure, the exact stale-view contradiction the
 * route map flagged.
 *
 * Both source modules are import-light (no heavy zeros bundle), so this sibling
 * is safe under the run-assertions Vite SSR loader.
 */

import { LAMBDA_DEPENDENCY_MATRIX } from './lambda-roadmap.js';
import { ROUTE_MAP_CROSS_CHECK } from './full-route-map-2026-06-19.js';

const FINITE_BEAT_NODE_ID = 'bound-imp-440-finite-1e4';

function finiteBeatNode() {
  return LAMBDA_DEPENDENCY_MATRIX.nodes.find((n) => n.id === FINITE_BEAT_NODE_ID);
}

// The node "presents as rigorous-unconditional" when its label/note asserts an
// unconditional standing WITHOUT any downgrade qualifier (ESTIMATE / modulo /
// gated / downgraded). The reconciled note mentions "rigorous-unconditional"
// only to describe the downgrade, so the qualifier guard prevents a false hit.
function presentsRigorousUnconditional(node) {
  const text = ((node.label || '') + ' ' + (node.note || '')).toLowerCase();
  const hasUnconditionalClaim = /\bunconditional\b/.test(text);
  const hasDowngradeQualifier = /estimate|modulo|gated|downgrad/.test(text);
  return hasUnconditionalClaim && !hasDowngradeQualifier;
}

// "Empty conditional closure" = no conditional (cond-*) leaf among the nodes
// the finite beat depends on. The route-map fix explicitly required a cond-CH
// leaf so the node does NOT have an empty conditional closure.
function hasEmptyConditionalClosure(node) {
  const deps = node.dependsOn || [];
  return !deps.some((d) => /^cond-/.test(d));
}

export const DAG_ROUTEMAP_STATUS_CONSISTENCY_ASSERTIONS = [
  {
    id: 'dag-routemap-finite-beat-node-present',
    description: 'The finite-N*=1e4 beat node still exists in LAMBDA_DEPENDENCY_MATRIX (premise of the tripwire).',
    holds: () => Boolean(finiteBeatNode()),
  },
  {
    id: 'dag-routemap-crosscheck-flags-finite-beat-as-estimate',
    description: 'ROUTE_MAP_CROSS_CHECK still flags the finite beat DAG node with an ESTIMATE / gated-on-C_H map verdict (anchors what the DAG view must agree with).',
    why: 'Route-map cross-check must keep naming the finite beat as ESTIMATE-not-rigorous gated on C_H.',
    holds: () => {
      const inc = (ROUTE_MAP_CROSS_CHECK.inconsistencies || []).find(
        (e) => typeof e.view === 'string' && e.view.includes(FINITE_BEAT_NODE_ID)
      );
      if (!inc) return false;
      const verdict = (inc.mapVerdict || '').toLowerCase();
      return /estimate/.test(verdict) && /c_h/.test(verdict);
    },
  },
  {
    id: 'dag-routemap-finite-beat-not-stale-rigorous-unconditional',
    description: 'The DAG finite-beat node must NOT present as rigorous-unconditional while carrying an empty conditional closure — the exact stale-view contradiction full-route-map netVerdict flagged.',
    why: 'rh-dag node bound-imp-440-finite-1e4 silently disagrees with the route map: rigorous-unconditional with no cond-* leaf, contradicting the ESTIMATE/gated-on-C_H verdict.',
    holds: () => {
      const node = finiteBeatNode();
      if (!node) return false;
      const stale = presentsRigorousUnconditional(node) && hasEmptyConditionalClosure(node);
      return !stale;
    },
  },
  {
    id: 'dag-routemap-finite-beat-keeps-conditional-leaf',
    description: 'The reconciled finite-beat node keeps a conditional (cond-*) dependency, matching the route-map fix that it does NOT have an empty conditional closure.',
    why: 'The finite beat dropped its cond-* conditional leaf, reverting to the empty-conditional-closure framing the route map refuted.',
    holds: () => {
      const node = finiteBeatNode();
      return Boolean(node) && !hasEmptyConditionalClosure(node);
    },
  },
];
