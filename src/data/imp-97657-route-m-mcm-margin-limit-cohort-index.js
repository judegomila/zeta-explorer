/**
 * @module imp-97657-route-m-mcm-margin-limit-cohort-index
 * @fileoverview imp-97657 -- META cross-reference index grouping the five Route-M MCM
 *   margin/limit tickets (imp-97432, imp-97583, imp-97601, imp-97606, imp-97619) by role in
 *   a single narrative chain -- refutation+onset, extremality-robustness, margin-collapse-rate,
 *   and B_inf closed-form -- so the cohort is mutually discoverable. Index/meta only;
 *   establishes nothing new; changes no bound; NO QED.
 *
 *   THE CHAIN (one hypothesis, refuted, then its failure margin measured, stress-tested, and
 *   pinned in closed form). imp-97422 reduced the omega>=4 b/4-ceiling condition to a
 *   non-negativity hypothesis MCM on iterated multiplicative differences of h(m) = g(m)/m
 *   (g the Glaisher-Kinkelin hyperfactorial log-remainder). This cohort settles MCM's fate end
 *   to end:
 *
 *   1) ONSET SUB-COHORT (imp-97432, imp-97583) -- MCM is FALSE, and exactly WHERE.
 *      imp-97432 proves an EXACT reweighted-mean / exponential-tilt characterization of the
 *      surrogate differences (zero sign mismatches over 1e5 configs), shows the surrogate
 *      itself first goes negative at order 10, and that the bounded R-correction (saturates at
 *      +1.0186e-3) cannot rescue it past order 10: the first full counterexample is
 *      b = p_11# = 200560490130, T(p_11#) = -9.624e-4 < 0 -- MCM REFUTED, but the b/4 ceiling
 *      survives untouched (|T| = 9.7e-4, deep inside [-1/4, 1/4]). imp-97583 then MEASURES the
 *      exact onset directly across omega = 6..15 with the same kernel, confirming the onset is
 *      exactly omega = 11 (refuting a "somewhere in {7,8,9,10,11}" premise), tabulating the
 *      margin ladder T(p_omega#) = +1.00e-2, +6.82e-3, +4.18e-3, +2.10e-3, +4.78e-4 (last
 *      holding), -9.62e-4 (first failing).
 *
 *   2) EXTREMALITY SUB-COHORT (imp-97606) -- the razor-thin omega=10 margin is ROBUST.
 *      imp-97606 broadens the imp-97583 two-alternative primorial-extremality check at the
 *      thin omega=10 margin (T = +4.782772e-4) to a 20,437-set family (single-prime
 *      substitutions, shift-up families, two-prime substitutions, and a 20,000-trial offline
 *      sweep): confirms the primorial p_10# is the STRICT minimiser (smallest non-primorial
 *      T = +5.534829e-4, gap +7.52e-5 above), so no competitor crosses zero and the onset
 *      stays exactly omega = 11.
 *
 *   3) MARGIN-COLLAPSE-RATE SUB-COHORT (imp-97601) -- the ~2.1e-3/order drop is NOT constant.
 *      imp-97601 derives the EXACT closed-form per-order surrogate decrement
 *      dS(omega) = -(Pi_omega/p_{omega+1})(A_omega + c log p_{omega+1}) (matches the direct
 *      difference to 1e-15) and shows the imp-97583 "roughly-constant ~2.1e-3/order" reading is
 *      REVISED: the rate DRIFTS DOWNWARD, because the bracket converges to a constant
 *      B_inf ~ 0.296789 (measured through p ~ 2e6) while the prefactor decays like
 *      e^{-gamma}/(p_omega log p_omega) (Mertens third theorem). The gap to the primorial limit
 *      -e^{-gamma}/12 closes only LOGARITHMICALLY (gap ~ 0.166635/log p_omega), so the margin
 *      never reaches the limit at any finite order.
 *
 *   4) B_INF CLOSED-FORM SUB-COHORT (imp-97619) -- the measured bracket constant, DERIVED.
 *      imp-97619 derives the imp-97601 measured bracket limit B_inf ~ 0.296789 in closed form as
 *      a SHIFTED EULER-MASCHERONI CONSTANT, B_inf = lnA + gamma/12 = 0.2968557824422 (via the
 *      prime-sum identity Sum Lambda(n)/n = log x - gamma + o(1)), refines the gap-law constant
 *      to e^{-gamma}(lnA + gamma/12) = 0.16667249, and shows the next-order gap term is the
 *      PNT/Mertens error, NOT an elementary 1/log^2 constant (named sub-gap, not closed).
 *
 *   WHY GROUP THESE (not re-derive). All five tickets attack the same b/4-ceiling MCM residual
 *   in immediate succession and, read individually, look like an undifferentiated refutation
 *   batch. Split by role -- onset (what/where it fails), extremality (is the thin margin real),
 *   rate law (how fast the margin collapses), closed form (what the rate's limiting constant
 *   actually is) -- this index bakes that split so a future scout can find, at a glance, which
 *   question each leaf answers.
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket committed).
 *   - MCM REFUTED at b = p_11# = 200560490130, T = -9.624e-4 < 0; b/4 ceiling untouched
 *     (imp-97432).
 *   - Onset located exactly at omega = 11 (last holding omega = 10, margin +4.782772e-4)
 *     (imp-97583).
 *   - omega=10 primorial is the strict minimiser over a 20,437-set broadened family; onset
 *     stays 11 (imp-97606).
 *   - Exact closed-form decrement dS(omega); collapse rate DRIFTS (not constant); gap closes
 *     only logarithmically, no finite-order arrival at the limit (imp-97601).
 *   - B_inf = lnA + gamma/12 = 0.2968557824422 derived in closed form; gap-law constant refined
 *     to 0.16667249; next-order term is PNT/Mertens error, not elementary (imp-97619).
 *
 *   NOT ESTABLISHED (what stays open at the end of this batch).
 *   - MCM stays FALSE from omega=11 (this is settled), but the b/4 ceiling itself for
 *     omega >= 11 still needs the weaker two-sided band -1/4 <= T <= 1/4 proved directly
 *     (imp-97432 subgap), not via MCM.
 *   - the gap-law next-order term (beyond e^{-gamma} B_inf/log p) has no elementary closed form
 *     (imp-97619 named sub-gap).
 *   - no bound on Lambda moves anywhere in this cohort.
 *
 *   STATUS: a grouping/index note over five already-completed tickets, not a new derivation. No
 *   bound changes: b/4 ceiling untouched; MCM refuted-not-rescued; RH open; NO QED.
 *   Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (MCM refuted at b = p_11#; ceiling survives)
 * @see imp-97583-route-m-mcm-onset-omega11-primorial.js (onset located exactly at omega = 11)
 * @see imp-97606-route-m-mcm-omega10-primorial-extremality-broadened.js (omega=10 margin robust over 20,437 sets)
 * @see imp-97601-route-m-mcm-margin-collapse-rate-law.js (exact decrement law; rate drifts, not constant)
 * @see imp-97619-route-m-mcm-binf-mertens-closed-form.js (B_inf = lnA + gamma/12, closed form)
 *
 * Ticket: imp-97657 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * Platt-Trudgian Lambda <= 0.2 SOTA.
 */

const ONSET_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97432',
    step: 'attempt to prove the imp-97422 MCM hypothesis (non-negativity of iterated multiplicative differences of h = g/m)',
    result:
      'exact reweighted-mean/exponential-tilt characterization proved (0 sign mismatches over 1e5 configs); ' +
      'MCM REFUTED at b = p_11# = 200560490130, T(p_11#) = -9.624e-4 < 0; the b/4 ceiling survives untouched ' +
      '(|T| = 9.7e-4 inside [-1/4, 1/4]).',
  }),
  Object.freeze({
    id: 'imp-97583',
    step: 'measure the exact MCM onset directly across omega = 6..15 with the imp-97432 kernel',
    result:
      'onset located exactly at omega = 11 (refutes a "{7,8,9,10,11}" premise); last holding margin ' +
      'T(p_10#) = +4.782772e-4; margin ladder +1.00e-2, +6.82e-3, +4.18e-3, +2.10e-3, +4.78e-4, then ' +
      '-9.624e-4.',
  }),
]);

const EXTREMALITY_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97606',
    step: 'broaden the imp-97583 two-alternative omega=10 primorial-extremality check to a wide family',
    result:
      'across 20,437 tested squarefree 10-sets (single-prime substitutions, shift-up families, two-prime ' +
      'substitutions, 20,000-trial offline sweep), the primorial p_10# is the STRICT minimiser (smallest ' +
      'non-primorial T = +5.534829e-4, gap +7.520579e-5 above); onset stays exactly omega = 11.',
  }),
]);

const MARGIN_RATE_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97601',
    step: 'derive the exact per-order surrogate decrement and settle whether the imp-97583 ~2.1e-3/order collapse rate is constant',
    result:
      'exact closed form dS(omega) = -(Pi_omega/p_{omega+1})(A_omega + c log p_{omega+1}) (matches direct ' +
      'difference to 1e-15); the rate DRIFTS DOWNWARD, not constant, because the bracket converges to ' +
      'B_inf ~ 0.296789 while the prefactor decays like e^{-gamma}/(p_omega log p_omega); gap to the ' +
      '-e^{-gamma}/12 limit closes only logarithmically (~0.166635/log p_omega), no finite-order arrival.',
  }),
]);

const BINF_CLOSED_FORM_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97619',
    step: 'derive the imp-97601 measured bracket limit B_inf ~ 0.296789 in closed form',
    result:
      'B_inf = lnA + gamma/12 = 0.2968557824422 (shifted Euler-Mascheroni constant, via ' +
      'Sum Lambda(n)/n = log x - gamma + o(1)); gap-law constant refined to e^{-gamma}(lnA + gamma/12) = ' +
      '0.16667249; next-order gap term is the PNT/Mertens error, NOT an elementary 1/log^2 constant (named sub-gap).',
  }),
]);

export const IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX = Object.freeze({
  id: 'imp-97657',
  proofSection: 'Route-M',
  onsetCohort: ONSET_SUBCOHORT,
  extremalityCohort: EXTREMALITY_SUBCOHORT,
  marginRateCohort: MARGIN_RATE_SUBCOHORT,
  binfClosedFormCohort: BINF_CLOSED_FORM_SUBCOHORT,
  measuredSignal:
    'five Route-M MCM tickets (imp-97432/97583/97601/97606/97619), grouped by role: onset (refutation + ' +
    'exact omega=11 location), extremality (omega=10 margin robust over 20,437 sets), margin-collapse-rate ' +
    '(exact decrement law, rate drifts not constant), and B_inf closed form (shifted Euler-Mascheroni ' +
    'constant, gap-law constant refined).',
  namedResiduals: [
    'IMP97432_QUARTER_CEILING_OMEGA_GE_11_TWO_SIDED_BAND_WITHOUT_MCM',
    'IMP97583_ONSET_OMEGA11_CONFIRMED',
    'IMP97606_OMEGA10_EXTREMALITY_ROBUST_OVER_BROAD_FAMILY',
    'IMP97601_MARGIN_RATE_DRIFTS_NOT_CONSTANT',
    'IMP97619_GAP_LAW_NEXT_ORDER_IS_PNT_ERROR_NOT_ELEMENTARY',
  ],
  mcmOnsetOmega: 11,
  mcmLastHoldingOmega: 10,
  mcmLastHoldingMargin: 4.782772e-4,
  mcmFirstFailValue: -9.623658e-4,
  omega10MinNonPrimorialT: 5.534829e-4,
  omega10GapAbovePrimorial: 7.520579e-5,
  binfMeasured: 0.296789,
  binfDerived: 0.2968557824422,
  gapLawConstMeasured: 0.166635,
  gapLawConstDerived: 0.16667249,
  primorialLimitTfull: -0.04577,
  bQuarterCeiling: 0.25,
  mcmProved: false,
  mcmRefuted: true,
  ceilingRefuted: false,
  binfClosedFormExact: true,
  marginRateConstant: false,
  gapLawNextOrderElementary: false,
  anyBoundMoved: false,
  question:
    'The five Route-M MCM margin/limit tickets imp-97432/97583/97601/97606/97619, committed in immediate ' +
    'succession on the same b/4-ceiling residual, read as an undifferentiated batch. Split by role -- onset ' +
    '(imp-97432/97583), extremality (imp-97606), margin-collapse-rate (imp-97601), B_inf closed form ' +
    '(imp-97619) -- does each answer a distinct question, and does none move any bound?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The onset pair (imp-97432/imp-97583) proves MCM FALSE and ' +
    'locates the exact onset at omega = 11 (last holding margin +4.782772e-4 at omega = 10, first failure ' +
    '-9.623658e-4 at b = p_11# = 200560490130); the b/4 ceiling survives untouched. The extremality leaf ' +
    '(imp-97606) confirms the thin omega=10 margin is robust: the primorial is the strict minimiser over a ' +
    '20,437-set broadened family, gap +7.52e-5 above the nearest competitor. The margin-collapse-rate leaf ' +
    '(imp-97601) derives the exact per-order decrement in closed form and shows the collapse rate DRIFTS ' +
    'downward rather than staying constant, with the gap to the primorial limit closing only ' +
    'logarithmically. The B_inf closed-form leaf (imp-97619) derives the rate law\'s limiting bracket ' +
    'constant B_inf = lnA + gamma/12 = 0.2968557824422 (a shifted Euler-Mascheroni constant) and refines the ' +
    'gap-law constant to 0.16667249, while leaving the next-order gap term as a named, non-elementary ' +
    'sub-gap (the PNT/Mertens error). No bound moves in any leaf: b/4 ceiling untouched, MCM stays refuted-' +
    'not-rescued, RH open; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97432 (MCM refuted at b = p_11#, ceiling survives); imp-97583 (onset located exactly at omega = 11); ' +
    'imp-97606 (omega=10 extremality confirmed over 20,437 sets); imp-97601 (exact decrement law, rate ' +
    'drifts not constant); imp-97619 (B_inf = lnA + gamma/12 closed form, gap-law constant refined).',
});

export default IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97657-onset-subcohort-has-both-members',
    why: 'The onset split must contain exactly the refutation and onset-measurement leaves; a missing ' +
      'member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX.onsetCohort.map((c) => c.id);
      return ids.length === 2 && ids.includes('imp-97432') && ids.includes('imp-97583');
    },
  },
  {
    id: 'imp97657-five-tickets-total-no-overlap',
    why: 'The index covers exactly five tickets split into four disjoint role groups; an overlap or a ' +
      'dropped ticket would misreport the cohort.',
    holds: () => {
      const idx = IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX;
      const onsetIds = idx.onsetCohort.map((c) => c.id);
      const extremIds = idx.extremalityCohort.map((c) => c.id);
      const rateIds = idx.marginRateCohort.map((c) => c.id);
      const binfIds = idx.binfClosedFormCohort.map((c) => c.id);
      const allIds = [...onsetIds, ...extremIds, ...rateIds, ...binfIds];
      const noOverlap = new Set(allIds).size === allIds.length;
      return (
        onsetIds.length + extremIds.length + rateIds.length + binfIds.length === 5 &&
        noOverlap &&
        extremIds.length === 1 && extremIds.includes('imp-97606') &&
        rateIds.length === 1 && rateIds.includes('imp-97601') &&
        binfIds.length === 1 && binfIds.includes('imp-97619') &&
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 5
      );
    },
  },
  {
    id: 'imp97657-onset-ladder-consistent',
    why: 'The last-holding and first-fail margins must match what imp-97583 measured, and the last-holding ' +
      'margin must sit inside the b/4 ceiling band.',
    holds: () => {
      const idx = IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX;
      return (
        idx.mcmOnsetOmega === 11 &&
        idx.mcmLastHoldingOmega === 10 &&
        idx.mcmLastHoldingMargin > 0 &&
        idx.mcmFirstFailValue < 0 &&
        Math.abs(idx.mcmLastHoldingMargin) < idx.bQuarterCeiling &&
        Math.abs(idx.mcmFirstFailValue) < idx.bQuarterCeiling
      );
    },
  },
  {
    id: 'imp97657-omega10-extremality-gap-positive',
    why: 'The broadened extremality check must strictly favour the primorial (positive gap), otherwise the ' +
      'onset would not stay at omega = 11.',
    holds: () => {
      const idx = IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX;
      return (
        idx.omega10GapAbovePrimorial > 0 &&
        Math.abs(idx.omega10MinNonPrimorialT - idx.mcmLastHoldingMargin - idx.omega10GapAbovePrimorial) < 1e-9
      );
    },
  },
  {
    id: 'imp97657-binf-derived-close-to-measured',
    why: 'The imp-97619 closed form must actually match the imp-97601 finite-height measurement (from ' +
      'below, within the stated ~6.7e-5 undershoot), not an unrelated number.',
    holds: () => {
      const idx = IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX;
      return (
        idx.binfDerived > idx.binfMeasured &&
        idx.binfDerived - idx.binfMeasured < 1e-3 &&
        idx.gapLawConstDerived > idx.gapLawConstMeasured &&
        idx.gapLawConstDerived - idx.gapLawConstMeasured < 1e-2
      );
    },
  },
  {
    id: 'imp97657-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, PT SOTA line present.',
    holds: () =>
      IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX.anyBoundMoved === false &&
      IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX.mcmProved === false &&
      IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX.mcmRefuted === true &&
      IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX.ceilingRefuted === false &&
      /NO QED/.test(IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX.verdict) &&
      /remains SOTA/.test(IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97657_ROUTE_M_MCM_MARGIN_LIMIT_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97657-route-m-mcm-margin-limit-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
