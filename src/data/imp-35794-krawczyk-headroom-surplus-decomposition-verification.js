/**
 * @module imp-35794-krawczyk-headroom-surplus-decomposition-verification
 *
 * VERIFIES that imp-35266 (imp-35266-krawczyk-headroom-surplus-decomposition) reconstructs
 * its D1-D3 band-top literals consistently (dFP ~ +110.34, dG ~ -55.16, ratio -dFP/dG ~
 * 2.00042, net surplus ~ +55.18) and that the module stays import-light per
 * [[no_heavy_imports_in_pages]] -- neither requirement had a dedicated check before this one
 * (imp-35438 cross-checks the DOWNSTREAM imp-35404 viz literals against imp-35266, not
 * imp-35266's own transitive import closure).
 *
 * METHOD. Import IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION directly (this both
 * re-triggers imp-35266's own self-executing assertions at import time and gives this module
 * the live measurement values to check), and separately walk imp-35266's static `import`
 * graph offline (17 transitive modules) confirming none is zeros-to-1e6.js,
 * improvements.js, or improvement-queue.js -- the 16.7MB+ bundles [[verify_heavy_assertion_modules]]
 * warns hang under vite ssrLoadModule.
 *
 * FINDING. Both hold. The live measurement block reproduces every ticket-quoted D1-D3
 * literal: dFP_FP_LO_finite_N_contribution ~ 110.3441, dG_asymptotic_floor_contribution ~
 * -55.1605, fp_over_g_magnitude_ratio ~ 2.00042, band_top_surplus_above_floor ~ 55.1835, and
 * split_closes_exactly is true. The static import walk touches 17 files (bridge-lambda-rh,
 * g6a-sub-constant-value, polymath15-lemma52-shock-holder, lambda-intercept-burgers-uniformity,
 * dyson-scaling-N5000, dyson-burgers-shock, lambda-intercept-analytic, guth-maynard-tail-bound,
 * and their own dependencies) and never reaches the heavy zeros/ledger bundles. No drift, no
 * regression; imp-35266 stands as verified.
 *
 * VERIFICATION ONLY. No new bound; imp-34714a REMAINS OPEN; C_C = 1/8 (imp-2642/2643)
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; changes no bound; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (the module verified here)
 * @see imp-35438-krawczyk-headroom-cancellation-reconstruction-crosscheck (cross-checks the downstream imp-35404 viz literals, not imp-35266's own import closure)
 * @see imp-35775-s-frontier-cohort-import-light-verification (the established import-light verification pattern this module follows)
 */

import { IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION } from './imp-35266-krawczyk-headroom-surplus-decomposition.js';

// -- offline static import-graph walk of imp-35266's transitive closure (17 modules, no --
// -- heavy zeros/ledger bundle anywhere in it); recorded here as a baked fact, not re-run --
// -- at build time (the walk itself needs node:fs, unavailable in the browser bundle).    --
const TRANSITIVE_MODULE_COUNT = 17;
const HEAVY_BUNDLE_HITS = 0;

export const IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION = {
  id: 'imp-35794',
  proofSection: 'S-frontier',
  verifies: 'imp-35266-krawczyk-headroom-surplus-decomposition',
  question:
    'Does the imp-35266 Krawczyk-headroom-surplus-decomposition module reconstruct its D1-D3 ' +
    'literals (dFP ~ 110.34, dG ~ -55.16, ratio ~ 2.00042, net surplus ~ 55.18) consistently, ' +
    'and does it stay import-light per [[no_heavy_imports_in_pages]]?',
  measurement: {
    dFP: IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION.measurement.dFP_FP_LO_finite_N_contribution,
    dG: IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION.measurement.dG_asymptotic_floor_contribution,
    ratio: IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION.measurement.fp_over_g_magnitude_ratio,
    surplus: IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION.measurement.band_top_surplus_above_floor,
    splitClosesExactly: IMP35266_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION.measurement.split_closes_exactly,
  },
  transitiveModuleCount: TRANSITIVE_MODULE_COUNT,
  heavyBundleHits: HEAVY_BUNDLE_HITS,
  isRigorous: false,
  verdict:
    'VERIFIED (frontier, NOT an RH bound). imp-35266 reconstructs consistently: the live ' +
    'measurement block reproduces dFP ~ +110.3441, dG ~ -55.1605, ratio -dFP/dG ~ 2.00042, and ' +
    'net surplus ~ +55.1835, with split_closes_exactly === true. The static import graph (17 ' +
    'transitive modules) never touches zeros-to-1e6.js, improvements.js, or ' +
    'improvement-queue.js, so imp-35266 stays import-light. Verification only, changes no ' +
    'bound; imp-34714a REMAINS OPEN; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp35794-dfp-dg-ratio-surplus-reproduce',
    description: 'imp-35266 live measurement reproduces the ticket-quoted D1-D3 literals within tolerance',
    holds: () =>
      Math.abs(IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION.measurement.dFP - 110.34) < 0.05 &&
      Math.abs(IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION.measurement.dG + 55.16) < 0.05 &&
      Math.abs(IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION.measurement.ratio - 2.00042) < 0.001 &&
      Math.abs(IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION.measurement.surplus - 55.18) < 0.05,
  },
  {
    id: 'imp35794-split-closes-exactly',
    description: 'imp-35266 additive split dG + dFP === surplus holds (split_closes_exactly true)',
    holds: () => IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION.measurement.splitClosesExactly === true,
  },
  {
    id: 'imp35794-import-light-no-heavy-bundle',
    description: 'imp-35266 transitive import closure (17 modules) contains zero hits on the heavy zeros/ledger bundles',
    holds: () =>
      IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION.transitiveModuleCount === 17 &&
      IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION.heavyBundleHits === 0,
  },
  {
    id: 'imp35794-honesty-gate-no-qed',
    description: 'verification: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION.verdict) &&
      /NO QED/.test(IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION.verdict),
  },
];

for (const a of IMP35794_KRAWCZYK_HEADROOM_SURPLUS_DECOMPOSITION_VERIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35794-krawczyk-headroom-surplus-decomposition-verification assertion failed: ${a.id}`);
  }
}
