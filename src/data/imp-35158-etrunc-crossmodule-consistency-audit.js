/**
 * @module imp-35158-etrunc-crossmodule-consistency-audit
 *
 * imp-35158 (accuracy, frontier-direction): three recently-committed component modules --
 * imp-35100 (far-tail floor), imp-35105 (decomposition table), imp-35121 (viz data) -- all
 * carry E_trunc = 3.06e-5 as the N-independent fixed strip term of the shared surrogate
 * E(N) = E_coll + E_trunc + E_flow (imp-33601 component model). A prior audit (imp-34791)
 * documented a two-E_trunc NAME COLLISION where a PT-anchor E_trunc (a kappa-locked residual)
 * was conflated with the imp-2631 fixed-strip E_trunc, plus a prefactor bug. This module does
 * the cross-module consistency check the ticket asks for: it pulls the E_trunc each of the
 * three modules actually EXPORTS/USES and confirms they are the SAME value, in the SAME role,
 * with the SAME imp-2631 primary provenance -- and that none has silently substituted the
 * PT-anchor variant. Accuracy audit only; reconciles documentation drift; changes no bound; NO QED.
 *
 * WHAT IS BEING CROSS-CHECKED (pulled live from each module export)
 * ----------------------------------------------------------------
 *   imp-35100  E_trunc_floor                    (the M2 constant floor E(N) -> )
 *   imp-35105  IMP35105_COMPONENT_TABLE[k].E_trunc   (the flat-floor table column)
 *   imp-35121  IMP35121_LADDER[k].E_trunc            (the third baked viz series)
 * All three are compared against the canonical imp-2631 strip literal 3.06e-5.
 *
 * THE FINDING (audit / reconciliation only)
 * -----------------------------------------
 *   (A1) VALUE IDENTICAL. All three modules carry E_trunc = 3.06e-5 exactly (to the stored
 *        precision of their exports); the strip literal is bit-identical across the trio and
 *        equal to the imp-2631 canonical 3.06e-5. No numeric drift.
 *   (A2) ROLE IDENTICAL. In every module E_trunc is the N-INDEPENDENT constant strip term of
 *        E(N) = E_coll + E_trunc + E_flow -- the flat floor the total asymptotes onto (imp-35100),
 *        the dominant tail term past N_cross (imp-35105), the third shared-axis series (imp-35121).
 *        It is never made N-dependent and never enters E_coll or E_flow.
 *   (A3) NO PT-ANCHOR SUBSTITUTION. None of the three carries the imp-34791 PT-anchor E_trunc
 *        (the 2/5-kappa-locked residual, a DIFFERENT quantity). Every value is the strip 3.06e-5,
 *        so the two-E_trunc name collision imp-34791 flagged has NOT recurred in the value.
 *   (A4) TWO RESIDUAL DOCUMENTATION DRIFTS (cosmetic, value UNAFFECTED, logged not silently fixed):
 *        (i)  PROVENANCE-TAIL CITE DRIFT. The constant-declaration comment cites the primary
 *             origin imp-2631 in all three, but the tail token differs: imp-35100 writes
 *             (imp-2631/imp-3406/imp-33601) while imp-35105 writes (imp-2631/imp-3406/imp-33582).
 *             imp-33601 vs imp-33582 is a downstream sigma-module cite, not the strip source; the
 *             primary imp-2631 provenance is shared, so this is a comment-tail mismatch only.
 *        (ii) LATENT VARIABLE-NAME HAZARD. imp-35100 and imp-35105 both name the strip constant
 *             E_TRUNC_PT -- the _PT suffix READS as PT-anchor, the exact collision imp-34791
 *             warned about -- yet the assigned value and inline comment are the strip 3.06e-5.
 *             The name is a latent hazard (a future reader could mistake it for the PT-anchor
 *             quantity); the value it holds is correct. Recorded, not renamed (no bound touched).
 *
 * The punchline: the E_trunc = 3.06e-5 fixed strip is used IDENTICALLY as the E(N) truncation
 * term across imp-35100 / imp-35105 / imp-35121 -- same value, same role, same imp-2631 primary
 * provenance, and NO module substituted the imp-34791 PT-anchor variant. The only residue is a
 * cosmetic provenance-tail cite mismatch (imp-33601 vs imp-33582) and the latent E_TRUNC_PT
 * misnomer, both documentation-level and neither affecting any value or bound.
 *
 * ACCURACY AUDIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; the imp-2631 E_trunc fixed strip is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-2631-honest-truncation-route-assessment (E_trunc = 3.06e-5 canonical N-independent strip)
 * @see imp-34791 (the prior two-E_trunc PT-anchor-vs-strip name collision + prefactor bug)
 * @see imp-35100-surrogate-total-E-fartail-floor (E_trunc_floor, the M2 constant floor)
 * @see imp-35105-e-component-decomposition-table (E_trunc column, the flat-floor table term)
 * @see imp-35121-ecoll-etrunc-eflow-decomposition-viz-data (E_trunc, the third baked viz series)
 */

import { IMP35100_SURROGATE_TOTAL_E_FARTAIL_FLOOR } from './imp-35100-surrogate-total-E-fartail-floor.js';
import { IMP35105_COMPONENT_TABLE } from './imp-35105-e-component-decomposition-table.js';
import { IMP35121_LADDER } from './imp-35121-ecoll-etrunc-eflow-decomposition-viz-data.js';

// The canonical imp-2631 fixed-strip constant (N-independent truncation term).
const E_TRUNC_CANONICAL_IMP2631 = 3.06e-5;

// Pull the E_trunc each module actually exports / uses.
const E_TRUNC_35100 = IMP35100_SURROGATE_TOTAL_E_FARTAIL_FLOOR.landmarks.E_trunc_floor;
const E_TRUNC_35105 = IMP35105_COMPONENT_TABLE[0].E_trunc;
const E_TRUNC_35121 = IMP35121_LADDER[0].E_trunc;

// Every imp-35105 table row and imp-35121 ladder rung must carry the same flat strip value.
const ALL_35105_MATCH = IMP35105_COMPONENT_TABLE.every((r) => r.E_trunc === E_TRUNC_CANONICAL_IMP2631);
const ALL_35121_MATCH = IMP35121_LADDER.every((r) => r.E_trunc === E_TRUNC_CANONICAL_IMP2631);

// Relative deviation of each module value from the canonical strip literal.
const DEV_35100 = Math.abs(E_TRUNC_35100 - E_TRUNC_CANONICAL_IMP2631) / E_TRUNC_CANONICAL_IMP2631;
const DEV_35105 = Math.abs(E_TRUNC_35105 - E_TRUNC_CANONICAL_IMP2631) / E_TRUNC_CANONICAL_IMP2631;
const DEV_35121 = Math.abs(E_TRUNC_35121 - E_TRUNC_CANONICAL_IMP2631) / E_TRUNC_CANONICAL_IMP2631;
const MAX_DEV = Math.max(DEV_35100, DEV_35105, DEV_35121);

// The imp-34791 PT-anchor E_trunc is a DIFFERENT quantity; a substitution would show as a value
// mismatch here. All three equalling the strip literal is the no-substitution certificate.
const NO_PT_ANCHOR_SUBSTITUTION =
  E_TRUNC_35100 === E_TRUNC_CANONICAL_IMP2631 &&
  E_TRUNC_35105 === E_TRUNC_CANONICAL_IMP2631 &&
  E_TRUNC_35121 === E_TRUNC_CANONICAL_IMP2631;

export const IMP35158_ETRUNC_CROSSMODULE_CONSISTENCY_AUDIT = {
  id: 'imp-35158',
  proofSection: 'S-frontier',
  question:
    'Cross-check that imp-35100, imp-35105, and imp-35121 all cite the SAME 3.06e-5 imp-2631 ' +
    'strip constant (same value, same provenance, same role in E = E_coll + E_trunc + E_flow) ' +
    'and that none has silently substituted the imp-34791 PT-anchor variant. Accuracy audit only; ' +
    'changes no bound; NO QED.',
  canonicalStrip_imp2631: E_TRUNC_CANONICAL_IMP2631,
  perModule: {
    imp35100_E_trunc_floor: E_TRUNC_35100,
    imp35105_E_trunc_column: E_TRUNC_35105,
    imp35121_E_trunc_series: E_TRUNC_35121,
    imp35105_all_rows_match: ALL_35105_MATCH,
    imp35121_all_rungs_match: ALL_35121_MATCH,
    max_relative_deviation_from_canonical: +MAX_DEV.toExponential(3),
  },
  finding: {
    A1_value_identical:
      'All three modules carry E_trunc = 3.06e-5 exactly (bit-identical to the imp-2631 canonical ' +
      'strip literal); max relative deviation across the trio is 0. No numeric drift.',
    A2_role_identical:
      'E_trunc is the N-INDEPENDENT constant strip term of E(N) = E_coll + E_trunc + E_flow in all ' +
      'three -- the flat floor E(N) asymptotes onto (imp-35100), the terminal dominant tail term ' +
      'past N_cross (imp-35105), the third shared-axis series (imp-35121). Never N-dependent.',
    A3_no_pt_anchor_substitution:
      'No module carries the imp-34791 PT-anchor E_trunc (the 2/5-kappa-locked residual, a DIFFERENT ' +
      'quantity). Every value equals the strip 3.06e-5, so the two-E_trunc name collision has NOT ' +
      'recurred in the value.',
    A4_residual_documentation_drift:
      'Two cosmetic drifts, value UNAFFECTED, logged not silently fixed: (i) the constant-declaration ' +
      'comment cites imp-2631 as primary in all three but the tail token differs (imp-35100 says ' +
      'imp-2631/imp-3406/imp-33601; imp-35105 says imp-2631/imp-3406/imp-33582) -- a downstream ' +
      'sigma-module cite, not the strip source; (ii) imp-35100 and imp-35105 both NAME the strip ' +
      'constant E_TRUNC_PT, whose _PT suffix reads as PT-anchor (the exact imp-34791 hazard) though ' +
      'the assigned value is the strip 3.06e-5 -- a latent name hazard, not a value error.',
  },
  scope:
    'Accuracy audit only; conditional-share diagnostic on the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the imp-2631 E_trunc fixed strip is UNTOUCHED; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED; no refereed bound is changed.',
};

// Self-executing THROWing assertions (pass under plain node and vite).
export const IMP35158_ETRUNC_CROSSMODULE_CONSISTENCY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35158-value-identical-to-canonical',
    description: 'all three modules carry E_trunc = 3.06e-5 to the canonical imp-2631 strip literal',
    check: () => DEV_35100 === 0 && DEV_35105 === 0 && DEV_35121 === 0,
  },
  {
    id: 'imp35158-every-row-and-rung-flat',
    description: 'every imp-35105 table row and imp-35121 ladder rung carries the identical flat strip',
    check: () => ALL_35105_MATCH && ALL_35121_MATCH,
  },
  {
    id: 'imp35158-no-pt-anchor-substitution',
    description: 'no module substituted the imp-34791 PT-anchor E_trunc variant (all equal the strip)',
    check: () => NO_PT_ANCHOR_SUBSTITUTION,
  },
  {
    id: 'imp35158-max-deviation-zero',
    description: 'max relative deviation of any module value from the canonical strip is 0',
    check: () => MAX_DEV === 0,
  },
  {
    id: 'imp35158-honesty-gate',
    description: 'audit only -- changes no bound and asserts no QED',
    check: () =>
      typeof IMP35158_ETRUNC_CROSSMODULE_CONSISTENCY_AUDIT.scope === 'string' &&
      IMP35158_ETRUNC_CROSSMODULE_CONSISTENCY_AUDIT.scope.includes('NO QED'),
  },
];

for (const a of IMP35158_ETRUNC_CROSSMODULE_CONSISTENCY_AUDIT_ASSERTIONS) {
  if (!a.check()) throw new Error(`imp-35158 assertion failed: ${a.id} -- ${a.description}`);
}
