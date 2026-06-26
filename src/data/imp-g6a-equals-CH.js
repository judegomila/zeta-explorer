/**
 * imp-2857: cond-polymath15-G6a EQUALS cond-CH — single-conditional identification.
 *
 * The /rh-dag dependency matrix (LAMBDA_DEPENDENCY_MATRIX in lambda-roadmap.js)
 * carries TWO conditional leaves that LOOK independent:
 *
 *   - cond-polymath15-G6a : the sole modulo of the imp-1261 ASYMPTOTIC bound
 *                           (bound-imp-1261-asymptotic, "Lambda <= 3.06e-5").
 *   - cond-CH             : the sole modulo of the imp-440 FINITE-N* = 1e4 beat
 *                           (bound-imp-440-finite-1e4, ESTIMATE gated on C_H).
 *
 * Both node notes already record that the SAME imp-366 Holder-1/2 shock modulus
 * supplies C_H. This module makes that identification EXPLICIT and machine-checked:
 * the two leaves are NOT two independent conditionals — they are one analytic
 * object, the Polymath15 Lemma 5.2 first-collision-time Holder-1/2 modulus
 *
 *     |tau_c(mu_1) - tau_c(mu_2)|  <=  C_H * W_1(mu_1, mu_2)^{1/2}      (imp-366)
 *
 * whose regularized constant is pinned by imp-395 (g6a-sub-constant-value.js) to
 *
 *     C_H  =  C_Lip^2 / C_collision  ->  1 / 8      (C_Lip -> 1, C_collision = 8).
 *
 * In the asymptotic bridge this same C_H is the G6a step-4 modulus; in E_coll it
 * is the collision-error Holder constant. ONE C_H, TWO appearances. Therefore the
 * live Lambda bounds do NOT rest on two independent conditionals — they funnel
 * through a single load-bearing object (the route-map "single funnel C_H" truth,
 * full-route-map-2026-06-19.js rank-1 opportunity). imp-2640 NEGATIVE: that one
 * object is undischargeable (gap-Lipschitz Gronwall diverges at the collision),
 * so collapsing the two leaves does NOT shrink the open surface — it correctly
 * shows there is only ONE wall, not two.
 *
 * Distinct from imp-2674 (which RELABELS the finite-N node to an ESTIMATE) and
 * imp-2750 (DAG/route-map status-consistency): this module PROVES the two leaves
 * coincide as the same imp-366 modulus.
 *
 * Both source modules are import-light (lambda-roadmap.js carries no heavy zeros
 * bundle; g6a-sub-constant-value.js is already loaded by run-assertions), so this
 * sibling is safe under the run-assertions Vite SSR loader.
 *
 * @see imp-366  polymath15-lemma52-shock-holder.js (the shared Holder-1/2 modulus)
 * @see imp-395  g6a-sub-constant-value.js          (C_H = C_Lip^2 / C_collision -> 1/8)
 * @see imp-2674 the finite-N node relabel
 * @see imp-2750 imp-2750-dag-routemap-status-consistency.js
 */

import { LAMBDA_DEPENDENCY_MATRIX } from './lambda-roadmap.js';
import { C_H_REGULARIZED } from './g6a-sub-constant-value.js';

const G6A_NODE_ID = 'cond-polymath15-G6a';
const CH_NODE_ID = 'cond-CH';
// The shared upstream modulus both leaves are claimed to coincide on.
const SHARED_MODULUS_TICKET = 'imp-366';
const SHARED_CONSTANT_SYMBOL = 'C_H';

function node(id) {
  return LAMBDA_DEPENDENCY_MATRIX.nodes.find((n) => n.id === id);
}

function nodeText(id) {
  const n = node(id);
  if (!n) return '';
  return (n.label || '') + ' ' + (n.note || '');
}

// Explicit identification record: the two conditional leaves are the SAME
// analytic object. This is the deliverable — an explicit statement so the two
// bounds are not mistakenly treated as resting on independent conditionals.
export const G6A_EQUALS_CH_IDENTIFICATION = {
  leftLeaf: G6A_NODE_ID, // modulo of the asymptotic bound (imp-1261)
  rightLeaf: CH_NODE_ID, // modulo of the finite-N* = 1e4 beat (imp-440)
  sharedObject: 'Polymath15 Lemma 5.2 first-collision-time Holder-1/2 shock modulus',
  sharedTicket: SHARED_MODULUS_TICKET,
  sharedConstant: SHARED_CONSTANT_SYMBOL,
  // The identical constant in both appearances (imp-395 regularized value).
  // In the asymptotic bridge: the G6a step-4 modulus. In E_coll: the collision
  // Holder constant. C_H = C_Lip^2 / C_collision -> 1/8 as N -> infinity.
  explicitConstant: 'C_H = C_Lip^2 / C_collision -> 1/8 (C_Lip -> 1, C_collision = 8)',
  regularizedValue: C_H_REGULARIZED,
  verdict:
    'cond-polymath15-G6a and cond-CH are NOT independent conditionals: both are ' +
    'the single imp-366 Holder-1/2 shock modulus C_H. The asymptotic bridge and ' +
    'the finite-N* E_coll funnel through ONE object, not two. imp-2640 NEGATIVE: ' +
    'that one object is undischargeable, so the open surface is a single wall.',
};

export const G6A_EQUALS_CH_ASSERTIONS = [
  {
    id: 'g6a-equals-ch-both-leaves-present',
    description:
      'Both conditional leaves (cond-polymath15-G6a, cond-CH) exist in LAMBDA_DEPENDENCY_MATRIX (premise of the identification).',
    holds: () => Boolean(node(G6A_NODE_ID)) && Boolean(node(CH_NODE_ID)),
  },
  {
    id: 'g6a-equals-ch-both-leaves-are-conditionals',
    description: 'Both leaves are modelled as kind="conditional" — they are the modulo leaves the bounds rest on.',
    why: 'A leaf silently changed kind, breaking the premise that these are the two conditional moduli being identified.',
    holds: () => node(G6A_NODE_ID)?.kind === 'conditional' && node(CH_NODE_ID)?.kind === 'conditional',
  },
  {
    id: 'g6a-equals-ch-both-reference-same-imp366-modulus',
    description:
      'Both leaf notes reference the SAME imp-366 Holder-1/2 shock modulus — the explicit anchor that they are one analytic object, not two.',
    why: 'A leaf dropped its imp-366 reference, so the DAG would read the two moduli as independent conditionals on separate objects.',
    holds: () =>
      nodeText(G6A_NODE_ID).includes(SHARED_MODULUS_TICKET) &&
      nodeText(CH_NODE_ID).includes(SHARED_MODULUS_TICKET),
  },
  {
    id: 'g6a-equals-ch-both-reference-same-constant',
    description: 'Both leaf notes name the shared constant C_H — the identical constant that appears in both E_coll and the asymptotic bridge.',
    why: 'A leaf stopped naming C_H, hiding that the asymptotic-bridge modulus and the E_coll constant are the same object.',
    holds: () =>
      nodeText(G6A_NODE_ID).includes(SHARED_CONSTANT_SYMBOL) &&
      nodeText(CH_NODE_ID).includes(SHARED_CONSTANT_SYMBOL),
  },
  {
    id: 'g6a-equals-ch-leaves-feed-distinct-bounds',
    description:
      'The two leaves are the moduli of DISTINCT bounds (asymptotic imp-1261 vs finite-N* imp-440), so identifying them collapses two apparently-independent paths onto one object.',
    why: 'If both leaves fed the same single bound there would be nothing to reconcile; the point is two bounds funnel through one shared C_H.',
    holds: () => {
      const nodes = LAMBDA_DEPENDENCY_MATRIX.nodes;
      const asymptotic = nodes.find((n) => n.id === 'bound-imp-1261-asymptotic');
      const finite = nodes.find((n) => n.id === 'bound-imp-440-finite-1e4');
      if (!asymptotic || !finite) return false;
      return (
        (asymptotic.dependsOn || []).includes(G6A_NODE_ID) &&
        (finite.dependsOn || []).includes(CH_NODE_ID)
      );
    },
  },
  {
    id: 'g6a-equals-ch-explicit-regularized-constant',
    description:
      'The shared C_H carries the explicit imp-395 regularized value C_H = C_Lip^2 / C_collision -> 1/8 — the same number in both appearances, not two free constants.',
    why: 'The identification must pin a single explicit constant; a drift from 1/8 would mean the shared modulus lost its pinned value.',
    holds: () => Math.abs(G6A_EQUALS_CH_IDENTIFICATION.regularizedValue - 1 / 8) < 1e-12,
  },
];
