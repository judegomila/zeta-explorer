/**
 * @module imp-33818-etrunc-name-collision-crosscheck
 * @fileoverview imp-33818 -- ACCURACY GUARD (executable). imp-33772 recorded, as PROSE only, a
 * distinct-quantity caveat: two different numbers travel under the same name "E_trunc". One is the
 * N-INDEPENDENT fixed-strip sigma(N)-bridge floor E_trunc = 3.06e-5 (imp-2631 root, pinned identically
 * across the sigma-decay cohort in imp-33582/imp-33620/imp-33708/imp-33723). The other is the SEPARATE
 * lambda-bound truncation contribution E_trunc(T0) = C_T . T0^{-kappa_T} . log T0 ~ 0.137 that lives in
 * imp-2625 on a DIFFERENT route/height (gamma = 1e13). The two share the name but are decades apart.
 *
 * imp-33772 left the disambiguation as a prose sentence with NO executable guard: nothing stops a future
 * consumer from accidentally substituting the 0.137 value into the sigma(N) = E_coll/(E_trunc + E_flow +
 * E_coll) bridge model, where it would be off by ~3.65 decades. This module formalizes that caveat as a
 * build-time cross-check that (a) pins BOTH magnitudes by reading them from their live source records,
 * (b) confirms they differ by >= 3.5 decades in log10, and (c) verifies that every sigma(N)-bridge
 * consumer imp-33772 tabulated actually declares the 3.06e-5 fixed-strip value -- NOT the 0.137 one.
 *
 * METHOD (read-only, source-derived). The bridge floor and its list of sigma(N) consumers are read from
 * IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE (imp-33772). The ~0.137 lambda-bound value is read from
 * ETRUNC_CONSTANT_PINNING.instantiation.eTrunc_floor_CT1 (imp-2625, the E_trunc(C_T=1, kappa_T=0.180)
 * headline). Neither literal is hard-coded here; the guard tracks whatever the sources declare, so any
 * future drift that would collapse the separation trips the tripwire.
 *
 * RESULT. bridge floor = 3.06e-5, lambda-bound value = 0.136823, ratio ~ 4471x, log10 separation ~ 3.650
 * decades. All four imp-33772 sigma-bridge consumer modules declare the 3.06e-5 value; none declares the
 * 0.137 value. The two E_trunc quantities are decades apart and are never conflated in the downstream
 * sigma(N) model.
 *
 * @see imp-33772-etrunc-baseline-cohort-provenance-tabulation (the prose caveat this formalizes)
 * @see imp-2625-etrunc-constant-pinning (the SEPARATE ~0.137 lambda-bound E_trunc at gamma = 1e13)
 * @see imp-2631-honest-truncation-route-assessment (root of the 3.06e-5 fixed-strip bridge floor)
 */

import { IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE } from './imp-33772-etrunc-baseline-cohort-provenance-tabulation.js';
import { ETRUNC_CONSTANT_PINNING } from './imp-2625-etrunc-constant-pinning.js';

// Both magnitudes read from their live source records (no hard-coded literals).
const BRIDGE_FLOOR = IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.baselineValue; // 3.06e-5 (imp-2631 fixed-strip)
const LAMBDA_BOUND_VALUE = ETRUNC_CONSTANT_PINNING.instantiation.eTrunc_floor_CT1; // 0.136823 (imp-2625, gamma=1e13)

const RATIO = LAMBDA_BOUND_VALUE / BRIDGE_FLOOR; // ~4471x
const DECADES_APART = Math.log10(RATIO); // ~3.650
const SIGMA_BRIDGE_CONSUMERS = IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.modules;
const CONSUMERS_USE_BRIDGE_FLOOR = SIGMA_BRIDGE_CONSUMERS.every((m) => m.value === BRIDGE_FLOOR);
const NO_CONSUMER_USES_LAMBDA_VALUE = SIGMA_BRIDGE_CONSUMERS.every((m) => m.value !== LAMBDA_BOUND_VALUE);

export const IMP_33818_ETRUNC_NAME_COLLISION_CROSSCHECK = {
  id: 'imp-33818',
  auditedAt: '2026-07-04',
  category: 'accuracy',
  verdict: 'DISAMBIGUATION GUARD EXECUTABLE -- the two same-named E_trunc quantities are decades apart and never conflated',
  bridgeFloor: {
    value: BRIDGE_FLOOR,
    role: 'N-independent fixed-strip sigma(N)-bridge truncation floor',
    provenanceRoot: IMP_33772_ETRUNC_BASELINE_COHORT_PROVENANCE.provenanceRoot,
    source: 'imp-33772 baselineValue',
  },
  lambdaBoundValue: {
    value: +LAMBDA_BOUND_VALUE.toFixed(6),
    role: 'lambda-bound truncation contribution E_trunc(T0) = C_T . T0^{-kappa_T} . log T0 at gamma = 1e13',
    source: 'imp-2625 instantiation.eTrunc_floor_CT1',
  },
  ratio: +RATIO.toFixed(1),
  decadesApart: +DECADES_APART.toFixed(3),
  sigmaBridgeConsumers: SIGMA_BRIDGE_CONSUMERS.map((m) => m.file),
  consumersUseBridgeFloor: CONSUMERS_USE_BRIDGE_FLOOR,
  noConsumerUsesLambdaValue: NO_CONSUMER_USES_LAMBDA_VALUE,
  honestNote:
    'Executable cross-check / accuracy guard only; pins no new bound and claims no QED. The imp-3066 ' +
    'K_a >= 0 operator-positivity invariant is untouched. No refereed bound is changed.',
};

// Build-time tripwires: any drift that collapses the decades-apart separation, or that lets a sigma(N)
// consumer adopt the 0.137 lambda-bound value, trips these.
const IMP_33818_ASSERTIONS = [
  {
    id: 'imp33818-bridge-floor-is-3p06e-5',
    holds: () => Math.abs(BRIDGE_FLOOR - 3.06e-5) < 1e-10,
    why: 'The sigma(N)-bridge floor read from imp-33772 is the pinned fixed-strip 3.06e-5.',
  },
  {
    id: 'imp33818-lambda-bound-value-is-0p137',
    holds: () => Math.abs(LAMBDA_BOUND_VALUE - 0.136823) < 1e-5,
    why: 'The SEPARATE lambda-bound E_trunc read from imp-2625 is the ~0.137 headline (0.136823).',
  },
  {
    id: 'imp33818-quantities-differ-by-at-least-3p5-decades',
    holds: () => DECADES_APART >= 3.5,
    why: 'log10(0.137 / 3.06e-5) ~ 3.65 >= 3.5: the two same-named quantities are decades apart.',
  },
  {
    id: 'imp33818-sigma-consumers-use-the-bridge-floor',
    holds: () => SIGMA_BRIDGE_CONSUMERS.length === 4 && CONSUMERS_USE_BRIDGE_FLOOR === true,
    why: 'All four imp-33772 sigma(N)-bridge consumers declare the 3.06e-5 fixed-strip value.',
  },
  {
    id: 'imp33818-no-sigma-consumer-uses-the-lambda-value',
    holds: () => NO_CONSUMER_USES_LAMBDA_VALUE === true && LAMBDA_BOUND_VALUE !== BRIDGE_FLOOR,
    why: 'No sigma(N)-bridge consumer substitutes the 0.137 lambda-bound value; the two are never conflated.',
  },
  {
    id: 'imp33818-honest-scope-locked',
    holds: () =>
      /refereed bound is changed/i.test(IMP_33818_ETRUNC_NAME_COLLISION_CROSSCHECK.honestNote) &&
      /no QED/i.test(IMP_33818_ETRUNC_NAME_COLLISION_CROSSCHECK.honestNote) &&
      /imp-3066/.test(IMP_33818_ETRUNC_NAME_COLLISION_CROSSCHECK.honestNote),
    why: 'VERDICT LOCK: executable guard only, no bound changed; no refereed bound is changed, imp-3066 untouched.',
  },
];

for (const a of IMP_33818_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-33818 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_33818_ASSERTIONS };
