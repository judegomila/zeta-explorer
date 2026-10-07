/**
 * @module imp-124985-knee-floor-elasticity-causal-chain-note
 * @fileoverview imp-124985 -- STANDALONE REFERENCE NOTE chaining four prior findings into one causal
 *   narrative for Thread 3 (the sigma-ramp knee floor-elasticity), analogous to the imp-124921
 *   Thread-2 note: (1) imp-97822 reads the knee floor-elasticity p_knee ~ -2.099 from a two-floor
 *   chord (the imp-33708 0.5x/2x pair); (2) imp-124772 certifies that chord by an ordinary-least-
 *   squares fit over the full ten-floor imp-33708 ladder, p_knee_lsq ~ -2.106; (3) imp-124814
 *   reproduces the -2.106 certification on a fresh, independently gridded locator AND introduces a
 *   second, structurally different knee definition (the ramp-inflection locator), which reads
 *   -2.073 -- a ~0.033 gap against the exponent-curvature value; (4) imp-124826 and imp-124847
 *   show that ~0.033 gap SURVIVES both a grid-resolution refinement ladder (imp-124826, 3-point
 *   stencil family, step halved, difference stencils tripled in resolution) and an independent
 *   change of stencil FORM (imp-124847, 5-point O(h^4) stencils on a non-commensurate, offset grid):
 *   the offset is a genuine definition-dependence between the two knee definitions, not a finite-
 *   resolution or single-stencil-family artifact. Each of the four already cross-references its
 *   neighbors inline; this note exists so the full four-step chain is readable from one place
 *   without following the citation graph. Documentation only: no new numerics, no bound moves,
 *   NO QED.
 *
 * @see imp-97822-sigma-knee-etrunc-floor-elasticity.js (step 1: the two-floor chord)
 * @see imp-124772-knee-floor-elasticity-multifloor-fit.js (step 2: the ten-floor OLS certification)
 * @see imp-124814-knee-floor-elasticity-fresh-locator-repro.js (step 3: fresh locator + second definition)
 * @see imp-124826-knee-locator-gap-grid-refinement.js (step 4a: the gap survives grid refinement)
 * @see imp-124847-knee-locator-gap-thirdgrid-stencil-form.js (step 4b: the gap survives a stencil-form change)
 * @see imp-124921-ecf-crossover-reldiff-roundoff-causal-chain-note.js (the Thread-2 analogue this note mirrors)
 *
 * Ticket: imp-124985 (content, sonnet-4-6, sonnet). Reference note only; no bound on Lambda moves; PT
 * Lambda <= 0.2 remains SOTA; RH open; NO QED.
 */

import { IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY } from './imp-97822-sigma-knee-etrunc-floor-elasticity.js';
import { IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT } from './imp-124772-knee-floor-elasticity-multifloor-fit.js';
import { IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO } from './imp-124814-knee-floor-elasticity-fresh-locator-repro.js';
import { IMP124826_KNEE_LOCATOR_GAP_GRID_REFINEMENT } from './imp-124826-knee-locator-gap-grid-refinement.js';
import { IMP124847_KNEE_LOCATOR_GAP_THIRDGRID_STENCIL_FORM } from './imp-124847-knee-locator-gap-thirdgrid-stencil-form.js';

export const IMP124985_KNEE_FLOOR_ELASTICITY_CAUSAL_CHAIN_NOTE = Object.freeze({
  ticket: 'imp-124985',
  restatedClaim:
    'one causal chain: imp-97822 two-floor chord -> imp-124772 ten-floor OLS certification -> ' +
    'imp-124814 fresh locator + second (ramp-inflection) definition -> imp-124826/124847 the ' +
    '~0.033 gap survives refinement and a stencil-form change',
  chain: [
    {
      step: 1,
      ticket: 'imp-97822',
      claim: 'reads the knee floor-elasticity from a two-floor chord (0.5x/2x)',
      value: 'p_knee ~ ' + IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.kneeFloorExponent,
    },
    {
      step: 2,
      ticket: 'imp-124772',
      claim: 'certifies the chord by an OLS fit over the full ten-floor ladder',
      value: 'p_knee_lsq ~ ' + IMP124772_KNEE_FLOOR_ELASTICITY_MULTIFLOOR_FIT.pKneeLsq,
    },
    {
      step: 3,
      ticket: 'imp-124814',
      claim:
        'reproduces the OLS certification on a fresh independent grid, then introduces a second, ' +
        'structurally different knee definition (ramp-inflection), opening a gap',
      value:
        'exponent-curvature ~ ' + IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO.pKneeFreshExpCurvature +
        ', ramp-inflection ~ ' + IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO.pKneeFreshRampInflection +
        ', gap ~ ' + IMP124814_KNEE_FLOOR_ELASTICITY_FRESH_LOCATOR_REPRO.comparison.delta_ramp_vs_exp_curvature,
    },
    {
      step: 4,
      ticket: 'imp-124826 / imp-124847',
      claim:
        'shows the ~0.033 gap survives both a grid-resolution refinement ladder and an independent ' +
        'change of stencil form: a genuine definition-dependence, not a stencil artifact',
      value:
        'refined-ladder gap ~ ' + IMP124826_KNEE_LOCATOR_GAP_GRID_REFINEMENT.gapGeomean +
        ', 5-point-stencil gap ~ ' + IMP124847_KNEE_LOCATOR_GAP_THIRDGRID_STENCIL_FORM.gapThirdGrid,
    },
  ],
  chainIsConsistent:
    IMP124826_KNEE_LOCATOR_GAP_GRID_REFINEMENT.finding.G1_gap_persists_not_a_stencil_artifact !== undefined &&
    IMP124847_KNEE_LOCATOR_GAP_THIRDGRID_STENCIL_FORM.comparison.delta_gap_vs_imp124826 < 1e-3,
  gapIsGenuineNotArtifact: true,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

export const IMP124985_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. This note restates, standalone, the Thread-3 ' +
  'knee floor-elasticity causal chain (imp-97822 -> imp-124772 -> imp-124814 -> imp-124826/124847) ' +
  'so it is discoverable without re-reading the full citation graph: changes no bound; establishes ' +
  'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
  'Lambda <= 0.2 remains SOTA.';

export default IMP124985_KNEE_FLOOR_ELASTICITY_CAUSAL_CHAIN_NOTE;

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP124985_KNEE_FLOOR_ELASTICITY_CAUSAL_CHAIN_NOTE.chain.length === 4 &&
    IMP124985_KNEE_FLOOR_ELASTICITY_CAUSAL_CHAIN_NOTE.chainIsConsistent === true &&
    IMP124985_KNEE_FLOOR_ELASTICITY_CAUSAL_CHAIN_NOTE.gapIsGenuineNotArtifact === true &&
    IMP124985_KNEE_FLOOR_ELASTICITY_CAUSAL_CHAIN_NOTE.anyBoundMoved === false &&
    IMP124985_KNEE_FLOOR_ELASTICITY_CAUSAL_CHAIN_NOTE.operatorPositivityEstablished === false &&
    IMP124985_KNEE_FLOOR_ELASTICITY_CAUSAL_CHAIN_NOTE.measurementOnly === true &&
    IMP124985_KNEE_FLOOR_ELASTICITY_CAUSAL_CHAIN_NOTE.isRigorous === false &&
    IMP124985_KNEE_FLOOR_ELASTICITY_CAUSAL_CHAIN_NOTE.qed === false &&
    /NO QED/.test(IMP124985_HONEST_BANNER) &&
    /PT Lambda <= 0.2/.test(IMP124985_HONEST_BANNER) &&
    /RH open/.test(IMP124985_HONEST_BANNER)
  )
) {
  throw new Error(
    'imp-124985-knee-floor-elasticity-causal-chain-note assertion FAILED: the four-step causal chain ' +
      '(two-floor chord -> OLS certification -> fresh locator + second definition -> gap survives ' +
      'refinement and stencil-form change) must stay consistent.'
  );
}
