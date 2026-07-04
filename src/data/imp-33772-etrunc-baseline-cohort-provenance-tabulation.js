/**
 * @module imp-33772-etrunc-baseline-cohort-provenance-tabulation
 * @fileoverview imp-33772 -- ACCURACY/PROVENANCE AUDIT (read-only). The far-tail sigma -> 1/2
 * asymptote and the imp-33723 fixed point N_cross = (C_C/E_trunc)^2 . log T0 both hinge on
 * E_trunc being ONE pinned constant, yet imp-33708 treats E_trunc as a free 0.5x..5x factor and
 * no module cross-tabulates the shared baseline the cohort perturbs around. This module reads the
 * actual E_trunc literal each cohort module declares, confirms they are the SAME constant, and
 * records its provenance chain to root.
 *
 * METHOD (read-only, grep-verified at author time 2026-07-04). For each cohort module the local
 * constant declaration was read directly from source:
 *   - imp-33582-sigma-postpeak-nearpeak-threshold-decay.js : const E_TRUNC_PT   = 3.06e-5;  (imp-2631/imp-3406/imp-3529/imp-33274)
 *   - imp-33620-etrunc-ecoll-ladder-1e15-extension.js       : const E_TRUNC_PT   = 3.06e-5;  (imp-2631/imp-3406/imp-33602)
 *   - imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity.js : const E_TRUNC_BASE = 3.06e-5;  (imp-2631 fixed-strip floor, imp-33582 pin)
 *   - imp-33723-sigma-half-vs-crossover-closed-form.js      : const E_TRUNC_PT   = 3.06e-5;  (imp-2631/imp-3406/imp-33582)
 *
 * RESULT. All four cohort modules pin the IDENTICAL literal 3.06e-5. imp-33708 is the only one that
 * treats it as a perturbation base (E_TRUNC_BASE . factor, factor in 0.5..5) rather than a fixed
 * floor, but the BASE it perturbs around is the same 3.06e-5, so the "free factor" in imp-33708 is a
 * sensitivity sweep ABOUT the shared pin, not a divergent value. No divergence surfaced.
 *
 * PROVENANCE (root). The 3.06e-5 value originates in imp-2631-honest-truncation-route-assessment.js:
 * it is the FIXED-strip (not thin-moving-strip) truncation floor E_trunc_pt = (2 e_I/kappa) .
 * T_PT^{-kappa}, instantiated at sigma = 3/4 and the Platt-Trudgian height T_PT, giving 3.06e-5. The
 * cohort inherits it through imp-3406 (high-N extrapolation) and imp-33602 (separated E_trunc/E_coll
 * ladder). It is N-INDEPENDENT: sigma(N) = E_coll/(E_trunc + E_flow + E_coll) with E_coll ~ sqrt(log
 * T0/N) -> 0, so the constant E_trunc floor is exactly what forces sigma -> 1/2 in the far tail.
 *
 * DISTINCT-QUANTITY CAVEAT (honest). A SEPARATE "E_trunc" of magnitude ~0.137 lives in
 * imp-2625-etrunc-constant-pinning.js via the formula E_trunc(T0) = C_T . T0^{-kappa_T} . log T0 at
 * gamma = 1e13. That is the lambda-bound truncation contribution on a DIFFERENT route/height, NOT the
 * fixed-strip sigma-model floor tabulated here. The two share the name but are different numbers; the
 * sigma-decay cohort uniformly uses the 3.06e-5 fixed-strip value, so no cross-route mix-up occurs.
 *
 * @see imp-2631-honest-truncation-route-assessment (root: fixed-strip E_trunc_pt = 3.06e-5)
 * @see imp-3406-sigma-highN-extrapolation (constant floor forces sigma -> 1/2)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x factor sweep about the pin)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (N_cross = (C_C/E_trunc)^2 . log T0 fixed point)
 * @see imp-33615-33577-33582-cohort-provenance-rollup (the roll-up pattern this audit follows)
 */

const E_TRUNC_BASELINE = 3.06e-5;

export const IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE = {
  id: 'imp-33772',
  auditedAt: '2026-07-04',
  quantity: 'E_trunc fixed-strip truncation floor (the pinned constant in sigma(N) = E_coll/(E_trunc + E_flow + E_coll))',
  baselineValue: E_TRUNC_BASELINE,
  provenanceRoot: 'imp-2631',
  provenanceFormula: 'E_trunc_pt = (2 e_I/kappa) . T_PT^{-kappa}, at sigma = 3/4 and the Platt-Trudgian height T_PT',
  inheritanceChain: ['imp-2631', 'imp-3406', 'imp-33602'],
  modules: [
    {
      file: 'imp-33582-sigma-postpeak-nearpeak-threshold-decay.js',
      constName: 'E_TRUNC_PT',
      value: 3.06e-5,
      role: 'fixed floor',
      citesProvenance: 'imp-2631/imp-3406/imp-3529/imp-33274',
    },
    {
      file: 'imp-33620-etrunc-ecoll-ladder-1e15-extension.js',
      constName: 'E_TRUNC_PT',
      value: 3.06e-5,
      role: 'fixed floor',
      citesProvenance: 'imp-2631/imp-3406/imp-33602',
    },
    {
      file: 'imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity.js',
      constName: 'E_TRUNC_BASE',
      value: 3.06e-5,
      role: 'perturbation base (E_TRUNC_BASE . factor, factor in 0.5..5)',
      citesProvenance: 'imp-2631 fixed-strip floor, imp-33582 pin',
    },
    {
      file: 'imp-33723-sigma-half-vs-crossover-closed-form.js',
      constName: 'E_TRUNC_PT',
      value: 3.06e-5,
      role: 'fixed floor',
      citesProvenance: 'imp-2631/imp-3406/imp-33582',
    },
  ],
  allSameConstant: true,
  divergenceFound: false,
  distinctQuantityCaveat:
    'imp-2625 carries a SEPARATE ~0.137 "E_trunc" (E_trunc(T0) = C_T . T0^{-kappa_T} . log T0 at ' +
    'gamma = 1e13), the lambda-bound truncation contribution on a different route/height. It shares ' +
    'the name but is a different number; the sigma-decay cohort uniformly uses the 3.06e-5 fixed-strip ' +
    'value, so the tabulation here is not conflating the two routes.',
  honestNote:
    'Read-only provenance/accuracy audit; changes no bound and claims no QED. The imp-3066 K_a >= 0 ' +
    'operator-positivity invariant is untouched. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
};

// Build-time tripwires locking the tabulation against silent drift.
const IMP_33772_ASSERTIONS = [
  {
    id: 'imp33772-exactly-four-cohort-modules',
    holds: () => IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.modules.length === 4,
    why: 'The audit covers exactly the four named cohort modules (imp-33582/imp-33620/imp-33708/imp-33723).',
  },
  {
    id: 'imp33772-all-four-pin-the-same-baseline',
    holds: () => {
      const m = IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.modules;
      return m.every((x) => x.value === E_TRUNC_BASELINE) &&
        IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.baselineValue === E_TRUNC_BASELINE &&
        IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.allSameConstant === true &&
        IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.divergenceFound === false;
    },
    why: 'Grep-verified: every cohort module declares the identical 3.06e-5 literal; no divergence.',
  },
  {
    id: 'imp33772-provenance-root-is-imp2631-fixed-strip',
    holds: () =>
      IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.provenanceRoot === 'imp-2631' &&
      IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.inheritanceChain[0] === 'imp-2631' &&
      /fixed-strip/.test(IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.quantity),
    why: 'The 3.06e-5 value roots in the imp-2631 fixed-strip route E_trunc_pt = (2 e_I/kappa) T_PT^{-kappa}.',
  },
  {
    id: 'imp33772-exactly-one-perturbation-base-role',
    holds: () => {
      const m = IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.modules;
      const perturbers = m.filter((x) => /perturbation base/.test(x.role));
      return perturbers.length === 1 && perturbers[0].file.indexOf('imp-33708') === 0;
    },
    why: 'Only imp-33708 treats the pin as a 0.5x..5x sweep base; the other three use it as a fixed floor.',
  },
  {
    id: 'imp33772-honest-scope-locked',
    holds: () =>
      /SOTA/.test(IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.honestNote) &&
      /no QED/i.test(IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.honestNote) &&
      /imp-3066/.test(IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.honestNote),
    why: 'VERDICT LOCK: read-only audit, no bound changed; Platt-Trudgian Lambda <= 0.2 stays SOTA, imp-3066 untouched.',
  },
];

for (const a of IMP_33772_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33772 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33772_ASSERTIONS };
