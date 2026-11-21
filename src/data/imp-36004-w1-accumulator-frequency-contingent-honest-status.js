/**
 * @module imp-36004-w1-accumulator-frequency-contingent-honest-status
 * @fileoverview imp-36004 -- standalone HONEST-STATUS note (imp-36003-style restatement pattern)
 *   recording the imp-35949 finding that the imp-35890 O(1) running-accumulator magnitude
 *   max_i|S_i| ~ 1.05 for the oscillatory term family t_k = cos(alpha k + beta sqrt(k)) / sqrt(k)
 *   is NOT a generic property of that family: it is FREQUENCY-CONTINGENT. At the q=1 resonant
 *   corner (alpha = 2 pi, beta = 0, i.e. cos(alpha k) = 1 for every integer k) the accumulator
 *   ratio r = max_i|S_i| / Sum|t_k| collapses to 1, so the imp-35890 running-accumulator a-priori
 *   bound gamma_{N-1} * r degenerates onto the classic pessimistic Higham gamma_{N-1} bound --
 *   recovering NONE of the ~3.2 magnitude-scale orders it enjoys at the imp-35812 baseline. Read-
 *   only note: imports the imp-35949 module verbatim (no re-derivation, no new numerics) and
 *   states the honesty boundary plainly for a reader who lands on this ticket without reading
 *   imp-35949 in full -- a certified engine cannot ASSUME the O(1) accumulator a priori and must
 *   MONITOR it at run time.
 *
 *   Ticket: imp-36004 (content, low). Note only; re-reads nothing new; changes no bound;
 *   C_mb GUE-conditional (imp-486) untouched; no refereed bound is changed; NO QED.
 *
 *   @see imp-35949-w1-accumulator-frequency-grid-robustness.js (source module this note restates)
 *   @see imp-35890-w1-running-accumulator-apriori-bound.js (the O(1)/flat claim imp-35949 stress-tests)
 *   @see imp-35812-w1-summation-scheme-measured-cost (baseline (alpha,beta) term family)
 *   @see imp-36003-i2-i3-off-axis-proxy-honest-status.js (the restatement pattern this note follows)
 */

import { IMP35949_W1_ACCUMULATOR_FREQUENCY_GRID_ROBUSTNESS } from './imp-35949-w1-accumulator-frequency-grid-robustness.js';

const SRC = IMP35949_W1_ACCUMULATOR_FREQUENCY_GRID_ROBUSTNESS;

export const IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS = Object.freeze({
  id: 'imp-36004',
  proofSection: 'S-frontier',
  title:
    'Honest-status note: the imp-35890 O(1) running-accumulator flatness is NOT a generic ' +
    'property of the W1 term family -- it COLLAPSES onto the classic Higham gamma_{N-1} at the ' +
    'q=1 resonance, so a certified engine must MONITOR the accumulator at run time',
  sourceModule: 'imp-35949-w1-accumulator-frequency-grid-robustness.js',

  baselineRatio: SRC.baseline.ratio,
  resonantRatio: SRC.resonantCornerBreakdown.alphaNearZeroNoDrift.ratio,
  ordersRecoveredBaseline: SRC.ordersRecoveredBaselineVsResonant.baseline,
  ordersRecoveredResonant: SRC.ordersRecoveredBaselineVsResonant.resonant,
  classicPessimisticBoundAtR1: SRC.classicPessimisticBoundAtR1.value,
  isRigorous: SRC.isRigorous,

  honestyBoundary:
    'The imp-35890 O(1) running-accumulator magnitude max_i|S_i| ~ 1.05 is confirmed only at the ' +
    'imp-35812 baseline (alpha, beta) = (golden-ratio fraction, golden angle), where the recovered- ' +
    'pessimism ratio r = max_i|S_i| / Sum|t_k| ~ 1.2e-3. At the Q=1 RESONANT CORNER (alpha = 2 pi, ' +
    'beta = 0), cos(alpha k) = 1 for every integer k, so the running accumulator never de-phases: ' +
    'r -> 1, max_i|S_i| climbs to Sum|t_k| ~ 1398, and the imp-35890 running-accumulator a-priori ' +
    'bound gamma_{N-1} * r COLLAPSES onto the classic pessimistic Higham bound gamma_{N-1}, ' +
    'recovering NONE of the ~2.9 magnitude-scale orders it recovers at baseline. Restoring a ' +
    'moderate sqrt-drift beta at the SAME resonant alpha restores cancellation (r drops by orders) ' +
    '-- it is the sqrt drift, not any special alpha, that buys the O(1) accumulator. So the O(1) ' +
    'flatness is FREQUENCY-CONTINGENT, not a family-level constant, and a certified engine cannot ' +
    'assume r << 1 a priori.',

  conclusion:
    'imp-35949 measures the imp-35890 O(1) running-accumulator claim across an (alpha, beta) ' +
    'frequency grid at fixed N ~ 488602 and finds it CONFIRMED at the imp-35812 baseline but NOT ' +
    'generic: the q=1 resonant corner drives the recovered-pessimism ratio r to 1, collapsing the ' +
    'running-accumulator bound onto the classic pessimistic gamma_{N-1}. Even at that full ' +
    'collapse, precision remains NOT the binding constraint (classic gamma_{N-1} ~ 5.4e-11 stays ' +
    '~4 orders under the imp-35760 barrier margin); the obstruction stays the ENGINEERING of the ' +
    'certified length-N interval sum, which remains GREENFIELD (imp-35681 Part A) and MECHANICAL ' +
    '(imp-35725). This note changes no bound and certifies nothing new.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    isGenericProperty: false,
    mustMonitorAtRuntime: true,
    changesAnyBound: false,
    reDerivesAnything: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT-ONLY restatement of imp-35949: the imp-35890 O(1) running-accumulator flatness ' +
    '(max_i|S_i| ~ 1.05, r ~ 1.2e-3 at the imp-35812 baseline) is NOT a generic property of the ' +
    'W1 oscillatory term family -- it COLLAPSES onto the classic pessimistic Higham gamma_{N-1} ' +
    'bound at the q=1 resonance (alpha = 2 pi, beta = 0, r -> 1). A certified engine must MONITOR ' +
    'the running accumulator at run time rather than assume r << 1 a priori. Precision stays NOT ' +
    'the binding constraint even at full collapse; the obstruction stays the ENGINEERING of the ' +
    'certified length-N interval sum (GREENFIELD / MECHANICAL). Restatement only; changes no ' +
    'bound; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
});

export const IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36004-source-is-not-rigorous',
    why: 'The core claim of this note is that the imp-35949 finding is a measurement, not a certified result -- the source module must itself be marked isRigorous:false.',
    holds: () =>
      IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS.isRigorous === false &&
      SRC.isRigorous === false,
  },
  {
    id: 'imp36004-baseline-ratio-matches-source',
    why: 'The recorded baseline ratio must match the imp-35949 source literal (~1.2e-3, strong cancellation).',
    holds: () =>
      Math.abs(
        IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS.baselineRatio - SRC.baseline.ratio
      ) < 1e-15 && IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS.baselineRatio < 0.01,
  },
  {
    id: 'imp36004-resonant-ratio-collapses-to-one',
    why: 'The recorded resonant-corner ratio must match the imp-35949 source finding that r -> 1 at the q=1 resonance.',
    holds: () => IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS.resonantRatio > 0.999,
  },
  {
    id: 'imp36004-honesty-boundary-mentions-q1-resonance',
    why: 'The honesty-boundary text must plainly name the q=1 resonance and the bound collapse, distinguishing it from the generic baseline claim.',
    holds: () =>
      /Q=1 RESONANT CORNER/.test(
        IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS.honestyBoundary
      ) &&
      /COLLAPSES onto the classic pessimistic Higham bound/.test(
        IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS.honestyBoundary
      ),
  },
  {
    id: 'imp36004-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim the accumulator flatness is generic, nor claim a bound change.',
    holds: () =>
      IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS.honestCaveat.isGenericProperty === false &&
      IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS.honestCaveat.mustMonitorAtRuntime === true &&
      IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36004-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36004-w1-accumulator-frequency-contingent-honest-status assertion failed: ${assertion.id}`
    );
  }
}

export default IMP36004_W1_ACCUMULATOR_FREQUENCY_CONTINGENT_HONEST_STATUS;
