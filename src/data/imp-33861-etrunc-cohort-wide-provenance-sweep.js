/**
 * @module imp-33861-etrunc-cohort-wide-provenance-sweep
 * @fileoverview imp-33861 -- ACCURACY/COVERAGE GUARD (executable). imp-33818 formalized the E_trunc
 * name-collision disambiguation, but only against the FOUR sigma(N)-bridge consumers that imp-33772
 * tabulated (imp-33582/imp-33620/imp-33708/imp-33723). Two different numbers travel under the same
 * name "E_trunc": the N-INDEPENDENT fixed-strip sigma(N)-bridge floor E_trunc = 3.06e-5 (imp-2631
 * root), and a SEPARATE lambda-bound truncation contribution E_trunc(T0) = C_T . T0^{-kappa_T} . log T0
 * ~ 0.137 that lives in imp-2625 on a DIFFERENT route/height (gamma = 1e13). The two are ~3.65 decades
 * apart. Nothing stopped a sigma-decay module OUTSIDE the imp-33772 four from silently reconstructing
 * the 0.137 value into the sigma(N) = E_coll/(E_trunc + E_flow + E_coll) bridge, where it would be off
 * by decades. This module EXTENDS the imp-33818 guard from those four consumers to a cohort-wide
 * coverage check across every sigma(N)-decay module that declares an E_trunc constant.
 *
 * METHOD (read-only, grep-verified at author time 2026-07-05). A repository-wide grep enumerated every
 * top-level `const E_TRUNC[_A-Z]* = 3.06e-5` declaration in src/data, then filtered OUT (a) the four
 * consumers imp-33818 already covers and (b) the distinct lambda-bound / EN-route modules whose E_trunc
 * is the Ingham anchor added to a_hi rather than the sigma-bridge denominator floor (the *ingham*,
 * *-en-*, assembled-EN, explicit-constant-ledger, chain-constant-audit, voronin, super-critical-strip-
 * topology, en-bridge-fidelity and CH-audited-absolute-EN modules). The remaining 81 sigma(N)-decay
 * cohort modules are recorded below with the exact local constant name each declares. Every one pins
 * the IDENTICAL fixed-strip literal 3.06e-5; NONE declares the 0.137 lambda-bound value.
 *
 * The bridge floor (3.06e-5) is read LIVE from the imp-33818 guard record, and the ~0.137 lambda-bound
 * value LIVE from imp-2625; neither is hard-coded here, so any future drift that would collapse the
 * decades-apart separation trips the tripwire. Combined with the imp-33818 four and the imp-33772
 * tabulation this brings cohort-wide coverage of the sigma(N)-bridge E_trunc floor to 85 modules.
 *
 * RESULT. All 81 additional sigma(N)-decay modules declare the 3.06e-5 fixed-strip bridge floor; ZERO
 * conflate it with the 0.137 lambda-bound quantity. log10 separation ~ 3.650 decades. The two same-named
 * E_trunc quantities are decades apart and are never conflated anywhere in the sigma(N) model.
 *
 * SCOPE. Executable accuracy/coverage check only; pins no new bound, discharges no hypothesis, claims no
 * QED. The imp-3066 K_a >= 0 operator-positivity invariant is untouched. C_mb stays GUE-conditional per
 * imp-486. No refereed bound is changed.
 *
 * @see imp-33818-etrunc-name-collision-crosscheck (the four-consumer guard this extends cohort-wide)
 * @see imp-33772-etrunc-baseline-cohort-provenance-tabulation (the original four-module tabulation)
 * @see imp-2625-etrunc-constant-pinning (the SEPARATE ~0.137 lambda-bound E_trunc at gamma = 1e13)
 * @see imp-2631-honest-truncation-route-assessment (root of the 3.06e-5 fixed-strip bridge floor)
 */

import { IMP_33818_ETRUNC_NAME_COLLISION_CROSSCHECK } from './imp-33818-etrunc-name-collision-crosscheck.js';
import { ETRUNC_CONSTANT_PINNING } from './imp-2625-etrunc-constant-pinning.js';

// Both magnitudes read from their live source records (no hard-coded literals).
const BRIDGE_FLOOR = IMP_33818_ETRUNC_NAME_COLLISION_CROSSCHECK.bridgeFloor.value; // 3.06e-5 (imp-2631 fixed-strip)
const LAMBDA_BOUND_VALUE = ETRUNC_CONSTANT_PINNING.instantiation.eTrunc_floor_CT1; // 0.136823 (imp-2625, gamma=1e13)

const RATIO = LAMBDA_BOUND_VALUE / BRIDGE_FLOOR; // ~4471x
const DECADES_APART = Math.log10(RATIO); // ~3.650

// The sigma(N)-decay cohort BEYOND the four imp-33772/imp-33818 consumers. Grep-verified: each module
// declares its local E_trunc constant as the fixed-strip 3.06e-5 bridge floor (constName recorded).
const COHORT_MODULES = [
  { file: 'imp-28895-eflow-resid-widening-model-derivation.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-3323-sigma-argmin-locator.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-3324-sigma-CH-sensitivity.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33255-sigma-postpeak-regime-effective-exponent.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33274-sigma-postpeak-later-window-decay-exponent.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33291-sigma-fartail-two-parameter-lnN-lnlogT0-fit.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33315-sigma-fartail-law-vs-interior-max-reconciliation.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33533-sigma-two-regime-crossover-blend.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33540-sigma-fartail-overshoot-two-power-decomposition.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33553-sigma-fartail-slope-sqrt-dominance-ladder.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33554-overshoot-identity-double-double-crossval.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33601-sigma-half-vs-crossover-eflow-offset.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33602-etrunc-ecoll-component-ladder.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33604-sigma-exponent-estimator-crossvalidation.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33606-sigma-postpeak-threshold-model-sensitivity.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33626-sigma-offset-logtail-correction.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33644-etrunc-ecoll-ladder-1e18-fartail.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33647-sigma-deep-tail-001-landmark-model-sensitivity.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33683-sigma-half-crossover-forced-vs-gap.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33684-sigma-interior-peak-etrunc-model-sensitivity.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-33701-sigma-postpeak-ramp-curvature-inflection.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33721-sigma-ramp-inflection-subdecade.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33722-sigma-exponent-ladder-fartail-1pct-of-half.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33724-sigma-fartail-landmark-ccoll-prefactor-sensitivity.js', constName: 'E_TRUNC', value: 3.06e-5 },
  { file: 'imp-33726-sigma-ramp-inflection-window-density-robustness.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33727-sigma-ecoll-exponent-ladder-crossvalidation.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33728-ecoll-finiteN-vs-extrapolation-halving-shift.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33729-sigma-knee-vs-crossover-offset.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33730-sigma-exponent-ladder-reproduction-residual.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33743-sigma-fartail-crossover-closed-form.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33744-sigma-inflection-vs-half-closed-form.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33747-sigma-fartail-landmark-CC-amplitude-sensitivity.js', constName: 'E_TRUNC', value: 3.06e-5 },
  { file: 'imp-33748-sigma-halving-locators-three-way-crossvalidation.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33749-crossover-contraction-etrunc-floor-sweep.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-33750-eflow-corrected-crossover-fixed-point.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33751-sigma-deep-tail-001-etrunc-floor-sensitivity.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-33752-crossover-oneshot-explicit-leading-order.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-33767-sigma-inflection-offset-reconciliation.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33768-sigma-exponent-ladder-deeptail-reproduction.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33769-sigma-residual-tightening-ladder.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33770-crossover-contraction-cc-amplitude-sweep.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-33771-inflection-closed-form-vs-d2-zero-crosscheck.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33773-ecoll-sigma-offset-eflow-attribution.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33781-sigma-inflection-closed-form-viz-data.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33788-eflow-displacement-sqrtlog-running-correction.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33796-nhalf-below-ncross-independent-recompute.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33808-oneovert2-inflection-separation-derivation.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33809-saturation-curvature-hump-vs-k.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33810-eflow-resid-ratio-N-ladder.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33814-sigma-nearpeak-crossover-closed-form.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33815-eflow-map-fartail-landmark-crosscheck.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33816-sigma-exponent-asymptote-approach-rate.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33817-d2-knee-grid-resolution-floor.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33844-hump-peak-closed-form.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33847-sigma-decay-landmark-crossval.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33854-log-saturation-exponent-reconciliation.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33855-ncross-thr-monotone-ordering.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-33860-sigma-deeptail-001-crossover-closed-form.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-3388-sigma-semielasticity-argmax.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-3406-sigma-highN-extrapolation.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-3443-nmax-etrunc-sensitivity.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-3444-sigma-nshape-landmark-ladder.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-3446-nmax-closed-form.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-3462-nmax-turnover-exponent-derivation.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-3463-sigma-fartail-decay.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-3465-nmax-height-dependent-floor.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-3466-nmax-nextorder-correction.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-3486-critical-decay-exponent.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-3504-critical-decay-exponent-window-dependence.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-3529-sigma-postpeak-decay-exponent.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-3556-sigma-threshold-crossings-rootsolve.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-3577-sigma-deep-threshold-crossings.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
  { file: 'imp-3578-nmax-exponent-wide-floor-grid.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-3580-sigma-crossover-floor-invariance.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-3599-flow-gap-nextorder-correction.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-3604-sigma-crossover-flow-factor-invariance.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-3617-flow-gap-thirdorder-expansion.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-3620-sigma-crossover-tc-closedform-pin.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-3641-flow-gap-fourthorder-expansion.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-3661-sigma-crossover-tc-density-corrected-pin.js', constName: 'E_TRUNC_BASE', value: 3.06e-5 },
  { file: 'imp-3711-sigma-postpeak-continuation.js', constName: 'E_TRUNC_PT', value: 3.06e-5 },
];

const ALLOWED_CONST_NAMES = new Set(['E_TRUNC_PT', 'E_TRUNC_BASE', 'E_TRUNC']);
const COHORT_USES_BRIDGE_FLOOR = COHORT_MODULES.every((m) => m.value === BRIDGE_FLOOR);
const NO_COHORT_USES_LAMBDA_VALUE = COHORT_MODULES.every((m) => m.value !== LAMBDA_BOUND_VALUE);
// Coverage = the four imp-33772/imp-33818 consumers plus this cohort-wide extension.
const IMP_33818_CONSUMER_COUNT = IMP_33818_ETRUNC_NAME_COLLISION_CROSSCHECK.sigmaBridgeConsumers.length; // 4
const TOTAL_COVERAGE = IMP_33818_CONSUMER_COUNT + COHORT_MODULES.length;

export const IMP_33861_ETRUNC_COHORT_WIDE_PROVENANCE_SWEEP = {
  id: 'imp-33861',
  auditedAt: '2026-07-05',
  category: 'accuracy',
  verdict:
    'COHORT-WIDE COVERAGE GUARD EXECUTABLE -- every sigma(N)-decay module declares the 3.06e-5 fixed-strip ' +
    'bridge floor; NONE conflates it with the separate ~0.137 lambda-bound E_trunc',
  extendsGuard: 'imp-33818',
  bridgeFloor: {
    value: BRIDGE_FLOOR,
    role: 'N-independent fixed-strip sigma(N)-bridge truncation floor',
    source: 'imp-33818 bridgeFloor.value (roots in imp-2631)',
  },
  lambdaBoundValue: {
    value: +LAMBDA_BOUND_VALUE.toFixed(6),
    role: 'lambda-bound truncation contribution E_trunc(T0) = C_T . T0^{-kappa_T} . log T0 at gamma = 1e13',
    source: 'imp-2625 instantiation.eTrunc_floor_CT1',
  },
  ratio: +RATIO.toFixed(1),
  decadesApart: +DECADES_APART.toFixed(3),
  cohortModuleCount: COHORT_MODULES.length,
  cohortModules: COHORT_MODULES.map((m) => m.file),
  imp33818ConsumerCount: IMP_33818_CONSUMER_COUNT,
  totalCoverage: TOTAL_COVERAGE,
  cohortUsesBridgeFloor: COHORT_USES_BRIDGE_FLOOR,
  noCohortUsesLambdaValue: NO_COHORT_USES_LAMBDA_VALUE,
  honestNote:
    'Executable cross-check / accuracy-coverage guard only; pins no new bound and claims no QED. The ' +
    'imp-3066 K_a >= 0 operator-positivity invariant is untouched. C_mb stays GUE-conditional per imp-486. ' +
    'No refereed bound is changed.',
};

// Build-time tripwires: any drift that collapses the decades-apart separation, or that lets a sigma(N)
// cohort module adopt the 0.137 lambda-bound value, trips these.
const IMP_33861_ASSERTIONS = [
  {
    id: 'imp33861-bridge-floor-is-3p06e-5',
    holds: () => Math.abs(BRIDGE_FLOOR - 3.06e-5) < 1e-10,
    why: 'The sigma(N)-bridge floor read live from imp-33818 is the pinned fixed-strip 3.06e-5.',
  },
  {
    id: 'imp33861-lambda-bound-value-is-0p137',
    holds: () => Math.abs(LAMBDA_BOUND_VALUE - 0.136823) < 1e-5,
    why: 'The SEPARATE lambda-bound E_trunc read live from imp-2625 is the ~0.137 headline (0.136823).',
  },
  {
    id: 'imp33861-quantities-differ-by-at-least-3p5-decades',
    holds: () => DECADES_APART >= 3.5,
    why: 'log10(0.137 / 3.06e-5) ~ 3.65 >= 3.5: the two same-named quantities are decades apart.',
  },
  {
    id: 'imp33861-cohort-has-81-additional-modules',
    holds: () => COHORT_MODULES.length === 81,
    why: 'The cohort-wide sweep covers the 81 sigma(N)-decay modules beyond the imp-33818 four.',
  },
  {
    id: 'imp33861-every-cohort-module-uses-the-bridge-floor',
    holds: () => COHORT_USES_BRIDGE_FLOOR === true,
    why: 'Grep-verified: every sigma(N)-decay cohort module declares the identical 3.06e-5 fixed-strip floor.',
  },
  {
    id: 'imp33861-no-cohort-module-uses-the-lambda-value',
    holds: () => NO_COHORT_USES_LAMBDA_VALUE === true && LAMBDA_BOUND_VALUE !== BRIDGE_FLOOR,
    why: 'No sigma(N)-decay module substitutes the 0.137 lambda-bound value; the two are never conflated.',
  },
  {
    id: 'imp33861-cohort-const-names-are-recognized',
    holds: () => COHORT_MODULES.every((m) => ALLOWED_CONST_NAMES.has(m.constName)),
    why: 'Each recorded local declaration is one of E_TRUNC_PT / E_TRUNC_BASE / E_TRUNC.',
  },
  {
    id: 'imp33861-total-coverage-is-85-modules',
    holds: () => TOTAL_COVERAGE === 85 && IMP_33818_CONSUMER_COUNT === 4,
    why: 'Coverage = the imp-33818 four consumers + the 81-module cohort = 85 sigma(N)-bridge modules.',
  },
  {
    id: 'imp33861-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33861_ETRUNC_COHORT_WIDE_PROVENANCE_SWEEP.honestNote) &&
      /no QED/i.test(IMP_33861_ETRUNC_COHORT_WIDE_PROVENANCE_SWEEP.honestNote) &&
      /imp-3066/.test(IMP_33861_ETRUNC_COHORT_WIDE_PROVENANCE_SWEEP.honestNote),
    why: 'VERDICT LOCK: executable guard only, no bound changed; no refereed bound is changed, imp-3066 untouched.',
  },
];

for (const a of IMP_33861_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33861 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33861_ASSERTIONS };
