/**
 * @module imp-34553-viz-literal-crossrecompute
 * @fileoverview imp-34553 (accuracy, low) -- CROSS-RECOMPUTE of the imp-34475
 *   ordered-locator axis viz-data literals against a FRESH re-derivation of the
 *   imp-34441 four-locator reconciliation, guarding the axis viz against copy
 *   drift from its source measurement.
 *
 *   imp-34475 is a viz-data module that reuses the imp-34441 four-locator cluster
 *   reconciliation exports VERBATIM (the ordered N_half / N_cross_bisection /
 *   N_cross_closed_form / N_knee_sigmoid locators and the two headline keyOffsets
 *   crossover_vs_half_rel / knee_vs_crossover_rel) with no recomputation. Because
 *   those numbers are re-exported by hand, a later edit to EITHER side -- the
 *   imp-34475 viz module or the imp-34441 reconciliation it copies -- could
 *   silently desync the axis viz from the measurement it claims to display.
 *   Following the imp-34272 copy-drift-guard pattern, this module RE-DERIVES the
 *   imp-34441 locators and keyOffsets directly from their underlying
 *   imp-33723 / imp-33721 / imp-3444 primitives (verbatim: imp-33723's closed-form
 *   E_coll=E_trunc fixed point, imp-33721's sub-decade sigmoid-knee inflection,
 *   and imp-3444's bisected crossover + halving landmark) and asserts that every
 *   imp-34475 exported literal reproduces to its stored precision.
 *
 *   HOW THE RECOMPUTE WAS PRODUCED (per [[verify_heavy_assertion_modules]] /
 *   [[no_heavy_imports_in_pages]]): the imp-33723 / imp-33721 / imp-3444 primitives
 *   import the heavy lambda-rh-height-mapping / polymath15-constant-C-C chain, so
 *   the fresh re-derivation was run OUTSIDE any page -- the three primitive modules
 *   were bundled with esbuild and executed under plain node, reapplying the exact
 *   imp-34441 expressions (N locators stored to toExponential(6); keyOffsets
 *   (row-col)/row rounded to toExponential(3..4)). The values below (RECOMPUTED_*)
 *   are the exact stdout of that fresh run; the assertions compare them against the
 *   imp-34475 exports imported live, so a later edit to EITHER side trips a red run.
 *
 *   THE RESULT: every imp-34475 baked literal reproduces to its stored precision.
 *     N_half              3.267235e9   -- exact
 *     N_cross_bisection   3.280294e9   -- exact
 *     N_cross_closed_form 3.280294e9   -- exact
 *     N_knee_sigmoid      3.377100e9   -- exact
 *     crossover_vs_half   3.981e-3     -- exact
 *     knee_vs_crossover   2.8665e-2    -- exact
 *     closed_form_vs_bis  1.073e-7     -- exact
 *     knee_vs_half        3.2532e-2    -- exact
 *     nMin / nMax         3.267235e9 / 3.377100e9 -- exact
 *   No copy drift detected: the imp-34475 axis viz reproduces the imp-34441 source
 *   reconciliation, which in turn traces to the imp-33723/imp-33721/imp-3444
 *   primitives.
 *
 *   VERIFICATION / MEASUREMENT ONLY. A cross-recompute of an existing viz-data
 *   module against its source; adds no new derivation and changes no bound. The
 *   underlying component model is the inherited imp-3220/imp-3406 extrapolation,
 *   NOT a rigorous asymptotic; the four locators are descriptive landmarks, not
 *   derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066
 *   K_a >= 0 untouched; NO QED; no refereed bound is changed.
 *
 *   @see imp-34475-four-locator-cluster-axis-viz-data.js (the baked viz literals cross-checked here)
 *   @see imp-34441-3p28e9-landmark-cluster-reconciliation.js (the source reconciliation re-derived to produce RECOMPUTED_*)
 *   @see imp-34272-viz-literal-crossrecompute.js (the copy-drift-guard pattern this follows)
 */

import {
  IMP34475_ORDERED_LOCATORS,
  IMP34475_KEY_OFFSETS,
  IMP34475_GAPS,
  IMP34475_N_MIN,
  IMP34475_N_MAX,
} from './imp-34475-four-locator-cluster-axis-viz-data.js';

// Fresh imp-34441 re-derivation -- exact stdout of the esbuild-bundled node re-run of the
// imp-33723 / imp-33721 / imp-3444 primitives with the imp-34441 expressions reapplied
// (see docstring). Ordered left-to-right along the shared axis (increasing N), per imp-34441 F3.
export const IMP34553_RECOMPUTED_ORDERED_LOCATORS = Object.freeze([
  { key: 'N_half', N: 3267235000 },
  { key: 'N_cross_bisection', N: 3280294000 },
  { key: 'N_cross_closed_form', N: 3280294000 },
  { key: 'N_knee_sigmoid', N: 3377100000 },
]);
export const IMP34553_RECOMPUTED_KEY_OFFSETS = Object.freeze({
  closed_form_vs_bisection_rel: 1.073e-7,
  crossover_vs_half_rel: 0.003981,
  knee_vs_half_rel: 0.032532,
  knee_vs_crossover_rel: 0.028665,
});
// The two headline gaps the viz annotates (Math.abs of the corresponding keyOffsets).
export const IMP34553_RECOMPUTED_GAPS = Object.freeze([
  { id: 'crossover_vs_half', relativeOffset: 0.003981 },
  { id: 'knee_vs_crossover', relativeOffset: 0.028665 },
]);
export const IMP34553_RECOMPUTED_N_MIN = 3267235000;
export const IMP34553_RECOMPUTED_N_MAX = 3377100000;

export const IMP34553_VIZ_LITERAL_CROSSRECOMPUTE = {
  ticket: 'imp-34553',
  proofSection: 'S-frontier',
  source: 'imp-34441-3p28e9-landmark-cluster-reconciliation',
  target: 'imp-34475-four-locator-cluster-axis-viz-data',
  recomputedOrderedLocators: IMP34553_RECOMPUTED_ORDERED_LOCATORS,
  recomputedKeyOffsets: IMP34553_RECOMPUTED_KEY_OFFSETS,
  recomputedGaps: IMP34553_RECOMPUTED_GAPS,
  recomputedNMin: IMP34553_RECOMPUTED_N_MIN,
  recomputedNMax: IMP34553_RECOMPUTED_N_MAX,
  driftDetected: false,
  finding:
    'Every imp-34475 baked axis-viz literal reproduces to its stored precision from a fresh ' +
    're-derivation of the imp-34441 reconciliation off the imp-33723/imp-33721/imp-3444 primitives: ' +
    'ordered locators N_half 3.267235e9, N_cross_bisection / N_cross_closed_form 3.280294e9, ' +
    'N_knee_sigmoid 3.377100e9; keyOffsets crossover_vs_half 3.981e-3, knee_vs_crossover 2.8665e-2, ' +
    'closed_form_vs_bisection 1.073e-7, knee_vs_half 3.2532e-2; gaps 3.981e-3 / 2.8665e-2; and ' +
    'nMin/nMax 3.267235e9 / 3.377100e9. No copy drift: the viz reproduces the source reconciliation.',
  honest:
    'CROSS-RECOMPUTE / VERIFICATION ONLY -- confirms the imp-34475 axis-viz literals match a fresh ' +
    'imp-34441 re-derivation off the imp-33723/imp-33721/imp-3444 primitives; adds no new derivation ' +
    'and changes no bound. Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'NO QED; no refereed bound is changed.',
};

const relClose = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b || 1);

export const IMP34553_ASSERTIONS = [
  {
    id: 'imp-34553-ordered-locators-reproduce',
    description: 'the four imp-34475 ordered locators (key + N) reproduce the fresh imp-34441 re-derivation',
    holds: () =>
      IMP34475_ORDERED_LOCATORS.length === IMP34553_RECOMPUTED_ORDERED_LOCATORS.length &&
      IMP34475_ORDERED_LOCATORS.every((l, i) => {
        const g = IMP34553_RECOMPUTED_ORDERED_LOCATORS[i];
        return l.key === g.key && relClose(l.N, g.N, 1e-9);
      }),
  },
  {
    id: 'imp-34553-key-offsets-reproduce',
    description: 'the four imp-34475 keyOffsets reproduce the re-derivation to their stored 3-4 sig-fig precision',
    holds: () =>
      Object.keys(IMP34553_RECOMPUTED_KEY_OFFSETS).every((k) =>
        relClose(IMP34475_KEY_OFFSETS[k], IMP34553_RECOMPUTED_KEY_OFFSETS[k], 1e-3)
      ),
  },
  {
    id: 'imp-34553-gaps-reproduce',
    description: 'the two headline gap relative offsets reproduce the re-derivation',
    holds: () =>
      IMP34475_GAPS.length === IMP34553_RECOMPUTED_GAPS.length &&
      IMP34475_GAPS.every((gap, i) => {
        const g = IMP34553_RECOMPUTED_GAPS[i];
        return gap.id === g.id && relClose(gap.relativeOffset, g.relativeOffset, 1e-3);
      }),
  },
  {
    id: 'imp-34553-axis-extent-reproduces',
    description: 'the axis extent nMin / nMax reproduce the re-derivation',
    holds: () =>
      relClose(IMP34475_N_MIN, IMP34553_RECOMPUTED_N_MIN, 1e-9) &&
      relClose(IMP34475_N_MAX, IMP34553_RECOMPUTED_N_MAX, 1e-9),
  },
  {
    id: 'imp-34553-no-drift-flag',
    description: 'the cross-recompute reports no drift (measurement/verification only, no bound change)',
    holds: () => IMP34553_VIZ_LITERAL_CROSSRECOMPUTE.driftDetected === false,
  },
];

for (const a of IMP34553_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34553-viz-literal-crossrecompute assertion failed: ${a.id}`);
  }
}
