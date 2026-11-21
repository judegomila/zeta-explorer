/**
 * @fileoverview imp-96965 -- CONTENT: a single honest-status note unifying imp-96935 (shift-m sweep)
 * and imp-96938 (certified-endpoint calibration) into one plain statement: the imp-96911
 * bounded-resolvent Ritz floor drift at 2a=ln3 is a TRUNCATION ARTIFACT of the coupled (N,T)
 * resolvent scheme -- shift-invariant (imp-96935) and scheme-generic (imp-96938) -- and therefore
 * carries NO information about the sign of lambda_1(ln3). No computation performed here; every
 * number is a verbatim citation from the two source modules. Content/organization only; no bound
 * moves; NO QED.
 *
 * WHY THIS NOTE EXISTS. imp-96935 and imp-96938 each close a DIFFERENT possible escape hatch for
 * reading the imp-96911 drift as a positivity signal, but neither module states the other's
 * conclusion, so a reader of only one could still wonder whether the drift means something. This
 * note puts both closures next to each other and states the combined verdict once.
 *
 * THE TWO CLOSURES, VERBATIM.
 *   imp-96935 (shift-invariance): sweeping the shift m over {0.25..32} at 2a=ln3 shows the floor at
 *     each Nbig rung is shift-invariant to 3-4 digits (eta ~ 1/(m+mu), so 1/eta-m recovers the
 *     underlying Ritz estimate mu independently of m); the raw eta drift collapses ~1/m but that is a
 *     scale illusion, not conditioning; the actual floor drift stays ~0.13 with only a 2.06% spread
 *     and a log-log slope of -0.0042 (~0) across a 128x change in m -- and the 2% it does move runs
 *     the WRONG way (precision loss at large m, high Nbig). SUB-GAP
 *     IMP96935_BOUNDED_RESOLVENT_FLOOR_DRIFT_IS_SHIFT_INVARIANT.
 *   imp-96938 (scheme-generic calibration): re-running the identical coupled-(N,T) measurement at the
 *     CERTIFIED-POSITIVE endpoint 2a=0.96 reproduces the exact same sign structure (eta rises
 *     monotonically with Nbig / falls with T, at BOTH endpoints) while the floor there stays >= 12.0
 *     across the entire sweep and only improves with larger T. The drift DIRECTION is therefore a
 *     generic property of the truncation scheme, not a diagnostic of the open-positivity case; the
 *     ONLY thing distinguishing the two endpoints is the absolute floor margin (order 12 at 2a=0.96
 *     vs order 0.5 at 2a=ln3), not the drift behaviour. SUB-GAP
 *     IMP96938_DRIFT_DIRECTION_IS_SCHEME_GENERIC_MARGIN_IS_THE_ONLY_DISCRIMINANT.
 *
 * THE HONEST STATUS, IN ONE SENTENCE. Two independent checks -- vary the shift, vary the endpoint --
 * both rule out the same misreading: the imp-96911 bounded-resolvent Ritz floor drift at 2a=ln3 is a
 * property of the (N,T) truncation scheme itself (shift-invariant, and present identically at a
 * certified-positive endpoint), not evidence bearing on whether lambda_1(ln3) is positive. Neither
 * closure moves the floor value or narrows the open interval 0.96 < 2a < ln3; they jointly retire the
 * "drift as a positivity signal" reading so future work does not re-litigate it.
 *
 * SCOPE. Pure content synthesis; every cited number is reproduced verbatim from imp-96935 / imp-96938;
 * no new computation, no bound moved. The interval-rigorous certificate reach stays exactly 2a<=0.96;
 * operator positivity for 0.96 < 2a < ln3 stays OPEN; no refereed bound is changed; RH
 * open; NO QED.
 *
 * @see imp-96935-krein-shift-drift-sensitivity.js (shift-invariance closure)
 * @see imp-96938-krein-drift-calibration-096.js (scheme-generic calibration closure)
 * @see imp-96911-krein-eta-nconvergence-scout.js (the original coupled-(N,T) drift measurement both closures address)
 */

export const IMP96965_TICKET = 'imp-96965';
export const IMP96965_A2_BINDING = Math.log(3); // 1.0986122886681098

export const IMP96965_CLOSURES = Object.freeze([
  {
    id: 'imp-96935',
    mechanism: 'shift-invariance',
    finding: 'Floor at each Nbig rung is shift-invariant to 3-4 digits across m in {0.25..32}; floor drift stays ~0.13 (2.06% spread, log-log slope -0.0042 ~ 0); the tiny movement runs the wrong way (large-m precision loss).',
    subGap: 'IMP96935_BOUNDED_RESOLVENT_FLOOR_DRIFT_IS_SHIFT_INVARIANT',
  },
  {
    id: 'imp-96938',
    mechanism: 'scheme-generic calibration',
    finding: 'The identical drift sign structure (eta up with Nbig / down with T) reproduces at the certified-positive 2a=0.96 endpoint, where the floor stays >= 12.0 throughout; only the absolute margin (order 12 vs order 0.5), not the drift behaviour, distinguishes the two endpoints.',
    subGap: 'IMP96938_DRIFT_DIRECTION_IS_SCHEME_GENERIC_MARGIN_IS_THE_ONLY_DISCRIMINANT',
  },
]);

export const IMP96965_VERDICT = Object.freeze({
  ticket: 'imp-96965',
  question: 'do the imp-96935 (shift sweep) and imp-96938 (endpoint calibration) closures jointly settle whether the imp-96911 bounded-resolvent Ritz floor drift at 2a=ln3 carries any information about the sign of lambda_1(ln3)?',
  a2_binding: IMP96965_A2_BINDING,
  closures: IMP96965_CLOSURES,
  driftIsShiftInvariant: true,
  driftIsSchemeGeneric: true,
  driftIsTruncationArtifact: true,
  driftIsPositivitySignal: false,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96965_BOUNDED_RESOLVENT_DRIFT_IS_TRUNCATION_ARTIFACT_NOT_POSITIVITY_SIGNAL -- the imp-96911 coupled-(N,T) Ritz floor drift at 2a=ln3 is shift-invariant (imp-96935: ~0.13 drift, 2.06% spread across a 128x shift change) and scheme-generic (imp-96938: identical sign structure at the certified-positive 2a=0.96 endpoint, where the floor stays >= 12.0 throughout); jointly these rule out reading the drift as evidence for or against lambda_1(ln3) positivity -- it is a truncation-scheme artifact, and only the absolute floor margin (not its drift) distinguishes settled from open endpoints. Interval-rigorous certificate reach stays 2a<=0.96; operator positivity for 0.96 < 2a < ln3 stays OPEN; RH open; no refereed bound is changed; NO QED.',
  qed: false,
});
export default IMP96965_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96965_ASSERTIONS = [
  {
    id: 'imp96965-both-closures-present-in-order',
    holds: () =>
      IMP96965_CLOSURES.length === 2 &&
      IMP96965_CLOSURES.map((c) => c.id).join(',') === 'imp-96935,imp-96938' &&
      IMP96965_CLOSURES[0].mechanism === 'shift-invariance' &&
      IMP96965_CLOSURES[1].mechanism === 'scheme-generic calibration',
    why: 'the unifying note must cite both closures -- the shift-invariance check (imp-96935) and the certified-endpoint calibration (imp-96938) -- in the order they were established.',
  },
  {
    id: 'imp96965-subgaps-match-source-modules',
    holds: () =>
      IMP96965_CLOSURES[0].subGap === 'IMP96935_BOUNDED_RESOLVENT_FLOOR_DRIFT_IS_SHIFT_INVARIANT' &&
      IMP96965_CLOSURES[1].subGap === 'IMP96938_DRIFT_DIRECTION_IS_SCHEME_GENERIC_MARGIN_IS_THE_ONLY_DISCRIMINANT',
    why: 'the cited sub-gap identifiers must match the source modules verbatim so the reference chain stays auditable.',
  },
  {
    id: 'imp96965-verdict-locked-not-a-positivity-signal',
    holds: () =>
      IMP96965_VERDICT.driftIsShiftInvariant === true &&
      IMP96965_VERDICT.driftIsSchemeGeneric === true &&
      IMP96965_VERDICT.driftIsTruncationArtifact === true &&
      IMP96965_VERDICT.driftIsPositivitySignal === false &&
      /TRUNCATION_ARTIFACT_NOT_POSITIVITY_SIGNAL/.test(IMP96965_VERDICT.subGap),
    why: 'VERDICT LOCK: the combined reading is that the drift is a truncation-scheme artifact (shift-invariant + scheme-generic), not a positivity signal -- this is the single sentence the note exists to state.',
  },
  {
    id: 'imp96965-honest-scope-locked',
    holds: () =>
      IMP96965_VERDICT.operatorPositivityProved === false &&
      IMP96965_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      Math.abs(IMP96965_A2_BINDING - Math.log(3)) < 1e-12 &&
      IMP96965_VERDICT.qed === false,
    why: 'content synthesis only: no operator positivity is established, the interval-rigorous certificate reach stays exactly 2a<=0.96, the binding point stays ln3, and NO QED.',
  },
];

for (const a of IMP96965_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96965 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
