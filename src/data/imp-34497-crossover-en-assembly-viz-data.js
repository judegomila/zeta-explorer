/**
 * @module imp-34497-crossover-en-assembly-viz-data
 * @fileoverview viz-data companion to imp-34453. imp-34453 assembled the full headline
 *   E(N) = E_trunc + E_flow + E_coll at the imp-3444 E_coll = E_trunc crossover N ~ 3.28e9,
 *   finding the headline is, to 0.19%, exactly TWICE the truncation floor, and that it sits a
 *   factor ~1975 BELOW the unconditional finite-height beat L_pt ~ 0.121 -- but had no
 *   accompanying visualization. This module reshapes the imp-34453 exports VERBATIM (no
 *   recomputation) into a three-term stack (E_trunc, E_flow, E_coll summing to E(N)) and the
 *   log-scale E(N) vs L_pt comparison.
 *
 *   Import-light: reuses only the imp-34453 IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT export
 *   (no 16.7MB zeros bundle), per [[no_heavy_imports_in_pages]].
 *
 *   NO QED. Viz-data reshaping only; the imp-34453 headline assembly is UNCHANGED; C_mb
 *   GUE-conditional per imp-486 UNTOUCHED; changes no bound; no refereed bound is changed.
 *
 *   @see imp-34453-crossover-en-headline-slack-vs-lpt.js (source of the headline assembly)
 */

import { IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT } from './imp-34453-crossover-en-headline-slack-vs-lpt.js';

const H = IMP34453_CROSSOVER_EN_HEADLINE_SLACK_VS_LPT;

export const IMP34497_STACK_TERMS = [
  { key: 'E_trunc', label: 'E_trunc', value: H.crossoverHeadline.E_trunc, color: '#38bdf8' },
  { key: 'E_flow', label: 'E_flow', value: H.crossoverHeadline.E_flow, color: '#4ade80' },
  { key: 'E_coll', label: 'E_coll', value: H.crossoverHeadline.E_coll, color: '#f59e0b' },
];

export const IMP34497_E_N = H.crossoverHeadline.E_N;
export const IMP34497_E_N_OVER_E_TRUNC = H.twiceTruncFloor.E_N_over_E_trunc;
export const IMP34497_L_PT = H.vsFiniteHeightBeat.L_pt;
export const IMP34497_L_PT_OVER_E_N = H.vsFiniteHeightBeat.L_pt_over_E_N;
export const IMP34497_N_CROSS = H.crossoverHeadline.N_cross;
export const IMP34497_SIGMA = H.crossoverHeadline.sigma;

export const IMP34497_CROSSOVER_EN_ASSEMBLY_VIZ_DATA = {
  id: 'imp-34497',
  stackTerms: IMP34497_STACK_TERMS,
  E_N: IMP34497_E_N,
  E_N_over_E_trunc: IMP34497_E_N_OVER_E_TRUNC,
  L_pt: IMP34497_L_PT,
  L_pt_over_E_N: IMP34497_L_PT_OVER_E_N,
  N_cross: IMP34497_N_CROSS,
  sigma: IMP34497_SIGMA,
  isRigorous: false,
};

export const IMP34497_ASSERTIONS = [
  {
    id: 'imp-34497-stack-terms-reproduce-imp34453-verbatim',
    description: 'the three stack terms reproduce the imp-34453 crossoverHeadline export exactly (===)',
    holds: () =>
      IMP34497_STACK_TERMS[0].value === H.crossoverHeadline.E_trunc &&
      IMP34497_STACK_TERMS[1].value === H.crossoverHeadline.E_flow &&
      IMP34497_STACK_TERMS[2].value === H.crossoverHeadline.E_coll,
  },
  {
    id: 'imp-34497-stack-sums-to-headline-en',
    description: 'the three stacked terms sum to the headline E(N) within float tolerance',
    holds: () =>
      Math.abs(
        IMP34497_STACK_TERMS.reduce((s, t) => s + t.value, 0) - IMP34497_E_N
      ) / IMP34497_E_N < 1e-3,
  },
  {
    id: 'imp-34497-headline-is-twice-etrunc',
    description: 'the headline E(N) / E_trunc ratio reproduces the imp-34453 ~2.0019 finding',
    holds: () => Math.abs(IMP34497_E_N_OVER_E_TRUNC - 2.001899) < 1e-4,
  },
  {
    id: 'imp-34497-lpt-ratio-matches-imp34453',
    description: 'L_pt / E(N) reproduces the imp-34453 ~1975.2 finding and E(N) < L_pt',
    holds: () =>
      Math.abs(IMP34497_L_PT_OVER_E_N - 1975.2) < 1.0 && IMP34497_E_N < IMP34497_L_PT,
  },
];

for (const a of IMP34497_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34497-crossover-en-assembly-viz-data assertion failed: ${a.id}`);
  }
}
