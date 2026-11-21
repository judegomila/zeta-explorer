/**
 * @module imp-36247-krawczyk-r1-r6-dependency-checklist
 *
 * imp-36247 (ux, sonnet-4-6): render the imp-36154 R1-R6 Krawczyk existence/uniqueness
 * requirement list as an explicit DEPENDENCY checklist -- which requirement needs which
 * other one before it can close -- rather than a flat R1-R6 enumeration. imp-36154 named
 * the six requirements but did not lay out the edges between them; this module adds
 * exactly that: a dependsOn graph per node, plus a derived GATING count showing how many
 * of R1-R4 sit downstream of the single shared UNIMPLEMENTED primitive R5
 * (imp-34687a directed-rounding layer).
 *
 * Documentation/UX only. Restates the imp-36154 requirement labels and OPEN/UNIMPLEMENTED
 * status verbatim; adds no new math, instantiates no interval, discharges no obligation.
 * imp-34687a stays UNIMPLEMENTED; imp-34714a stays OPEN; NO QED.
 *
 * THE DEPENDENCY EDGES (read off the imp-36154 requirement text)
 * -----------------------------------------------------------------------------
 * R1 (certified residual value) and R2 (certified derivative enclosure) both need every
 * arithmetic op outward-rounded, i.e. both sit on top of R5. R3 ((H1) nonvanishing test)
 * consumes the certified [F-prime] from R2. R4 ((H2) self-map inclusion) consumes both
 * the certified value R1 and the certified derivative R2. R6 (seed bracket + final
 * assembly) waits on all of R1-R5. R5 itself (the directed-rounding layer) has NO
 * upstream dependency in this graph -- it is the base primitive -- and it is the single
 * node marked UNIMPLEMENTED, so every node reachable from R5 is transitively blocked on
 * the same missing layer.
 *
 * @see imp-36154-krawczyk-existence-uniqueness-subgap-requirements (source R1-R6 requirement text, this module's only input)
 * @see imp-36246-s-frontier-scoping-module-overview (family-level cross-walk this module's parent module feeds)
 * @see imp-34687a (the UNIMPLEMENTED directed-rounding primitive, R5)
 * @see imp-34714a (the OPEN existence/uniqueness sub-gap R1-R6 collectively targets)
 */

import { IMP36154_KRAWCZYK_EXISTENCE_UNIQUENESS_SUBGAP_REQUIREMENTS as SOURCE } from './imp-36154-krawczyk-existence-uniqueness-subgap-requirements.js';

// Dependency graph over the six imp-36154 requirements, read off their own text:
// R1/R2 need the directed-rounding layer (R5); R3 needs R2; R4 needs R1+R2; R6 needs
// all of R1-R5 (the final assembly). R5 has no upstream dependency -- it is the base
// primitive every other node in R1-R4 sits on top of.
const REQUIREMENT_CHECKLIST = Object.freeze([
  Object.freeze({
    id: 'R1',
    label: SOURCE.requirements.R1_certifiedResidualValue.split(' -- ')[0] || 'certified residual VALUE [F(m)]',
    dependsOn: Object.freeze(['R5']),
    status: 'STRUCTURE AVAILABLE (imp-36136 op-DAG); LAYER UNIMPLEMENTED (gated by R5)',
  }),
  Object.freeze({
    id: 'R2',
    label: 'certified DERIVATIVE enclosure [F-prime(m)]',
    dependsOn: Object.freeze(['R5']),
    status: 'GREENFIELD (never constructed); gated by R5',
  }),
  Object.freeze({
    id: 'R3',
    label: '(H1) nonvanishing-derivative test: 0 not in [F-prime(m)]',
    dependsOn: Object.freeze(['R2']),
    status: 'awaits certified R2; exact margin (~0.954) is large once R2 exists',
  }),
  Object.freeze({
    id: 'R4',
    label: '(H2) strict self-map inclusion K([m]) subset int([m])',
    dependsOn: Object.freeze(['R1', 'R2']),
    status: 'awaits certified R1 and R2',
  }),
  Object.freeze({
    id: 'R5',
    label: 'directed-rounding arithmetic layer (imp-34687a)',
    dependsOn: Object.freeze([]),
    status: 'UNIMPLEMENTED -- the shared base primitive gating R1-R4',
  }),
  Object.freeze({
    id: 'R6',
    label: 'certified seed bracket + (H1)+(H2) => unique-fixed-point assembly',
    dependsOn: Object.freeze(['R1', 'R2', 'R3', 'R4', 'R5']),
    status: 'lemma STATEMENT available (imp-34714); machine assembly waits on R1-R5',
  }),
]);

const CHECKLIST_BY_ID = Object.freeze(
  Object.fromEntries(REQUIREMENT_CHECKLIST.map((r) => [r.id, r]))
);

// Does `id` transitively depend on `targetId`, walking the dependsOn edges?
function dependsTransitivelyOn(id, targetId, seen = new Set()) {
  if (seen.has(id)) return false;
  seen.add(id);
  const node = CHECKLIST_BY_ID[id];
  if (!node) return false;
  if (node.dependsOn.includes(targetId)) return true;
  return node.dependsOn.some((d) => dependsTransitivelyOn(d, targetId, seen));
}

// The point of the checklist: R5 is UNIMPLEMENTED, so every node transitively
// depending on it is blocked on the same single missing primitive, not four
// independent obstructions.
const R5_GATED_NODES = Object.freeze(
  REQUIREMENT_CHECKLIST
    .filter((r) => r.id !== 'R5' && dependsTransitivelyOn(r.id, 'R5'))
    .map((r) => r.id)
);

export const IMP36247_KRAWCZYK_R1_R6_DEPENDENCY_CHECKLIST = {
  id: 'imp-36247',
  proofSection: 'S-frontier',
  question:
    'Render the imp-36154 R1-R6 Krawczyk existence/uniqueness requirement list as a dependency ' +
    'checklist -- which requirement needs which other one -- highlighting that R5 (the UNIMPLEMENTED ' +
    'imp-34687a directed-rounding layer) gates R1-R4. Documentation/UX only; instantiates no interval; ' +
    'discharges no requirement; NO QED.',
  checklist: REQUIREMENT_CHECKLIST,
  r5GatedNodes: R5_GATED_NODES,
  isRigorous: false,
  verdict:
    'DEPENDENCY CHECKLIST ONLY (navigation, not rigorous, not a measurement). Laying the imp-36154 ' +
    'R1-R6 requirements out as a dependency graph (R1 -> R5; R2 -> R5; R3 -> R2; R4 -> R1,R2; ' +
    'R6 -> R1,R2,R3,R4,R5; R5 -> none) shows that R1, R2, R3, R4, and R6 are ALL transitively blocked ' +
    'on the single UNIMPLEMENTED base primitive R5 (imp-34687a directed-rounding layer) -- five ' +
    'requirements gated by one missing layer, not five independent obstructions. This module restates ' +
    'the imp-36154 requirement text verbatim and adds only the dependency edges; it discharges no ' +
    'requirement, instantiates no interval, and changes no bound. imp-34687a stays UNIMPLEMENTED; ' +
    'imp-34714a stays OPEN; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36154 (Krawczyk existence/uniqueness R1-R6, this module’s only source of requirement ' +
    'text); imp-36246 (S-frontier scoping-module family overview, parent cross-walk); imp-34687a ' +
    '(directed-rounding layer, UNIMPLEMENTED, the gating primitive R5); imp-34714a (existence/uniqueness ' +
    'sub-gap, stays OPEN); imp-486 (C_mb GUE-conditional).',
};

export const IMP36247_KRAWCZYK_R1_R6_DEPENDENCY_CHECKLIST_ASSERTIONS = [
  {
    id: 'imp36247-six-nodes-present',
    description: 'the checklist has exactly the six R1-R6 nodes, in order',
    holds: () =>
      REQUIREMENT_CHECKLIST.length === 6 &&
      REQUIREMENT_CHECKLIST.map((r) => r.id).join(',') === 'R1,R2,R3,R4,R5,R6',
  },
  {
    id: 'imp36247-r5-is-base-primitive',
    description: 'R5 has no upstream dependency (it is the base primitive)',
    holds: () => CHECKLIST_BY_ID.R5.dependsOn.length === 0,
  },
  {
    id: 'imp36247-r1-r4-and-r6-gated-by-r5',
    description: 'R1, R2, R3, R4, and R6 are all transitively gated by R5 via the dependency graph',
    holds: () =>
      R5_GATED_NODES.length === 5 &&
      ['R1', 'R2', 'R3', 'R4', 'R6'].every((id) => R5_GATED_NODES.includes(id)),
  },
  {
    id: 'imp36247-edges-match-source-text',
    description: 'the dependency edges match what R3/R4/R6 require in the imp-36154 source text',
    holds: () =>
      CHECKLIST_BY_ID.R3.dependsOn.join(',') === 'R2' &&
      CHECKLIST_BY_ID.R4.dependsOn.join(',') === 'R1,R2' &&
      CHECKLIST_BY_ID.R6.dependsOn.join(',') === 'R1,R2,R3,R4,R5',
  },
  {
    id: 'imp36247-r5-status-unimplemented',
    description: 'R5 status names it UNIMPLEMENTED, matching the imp-36154 source finding',
    holds: () =>
      /UNIMPLEMENTED/.test(CHECKLIST_BY_ID.R5.status) &&
      /UNIMPLEMENTED/.test(SOURCE.requirements.R5_directedRoundingArithmeticLayer),
  },
  {
    id: 'imp36247-honesty-gate-no-qed',
    description: 'checklist only: not rigorous, discharges nothing, no QED, no refereed bound is changed',
    holds: () =>
      IMP36247_KRAWCZYK_R1_R6_DEPENDENCY_CHECKLIST.isRigorous === false &&
      /NO QED/.test(IMP36247_KRAWCZYK_R1_R6_DEPENDENCY_CHECKLIST.verdict) &&
      /refereed bound is changed/i.test(IMP36247_KRAWCZYK_R1_R6_DEPENDENCY_CHECKLIST.verdict),
  },
];

for (const a of IMP36247_KRAWCZYK_R1_R6_DEPENDENCY_CHECKLIST_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36247-krawczyk-r1-r6-dependency-checklist assertion failed: ${a.id}`);
  }
}

export default IMP36247_KRAWCZYK_R1_R6_DEPENDENCY_CHECKLIST;
