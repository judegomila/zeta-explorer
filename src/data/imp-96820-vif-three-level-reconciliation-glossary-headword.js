/**
 * @module imp-96820-vif-three-level-reconciliation-glossary-headword
 * @fileoverview imp-96820 -- import-light glossary/Concepts headword reconciling the
 *   three imp-96593 Route M variance-inflation-factor (VIF) levels: the soft
 *   z_eff = 13.71 tabulated level, the rigorous two-lag z >= 10.52 level, and the
 *   actual finite-window z ~ 26.0 value.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96543/imp-96571 left a SOFT z_eff >= 13.71 (VIF_291 <= 0.0197) refinement
 *   resting on uncalibrated tabulated lag magnitudes rho_2 = -0.020, rho_3 = -0.008.
 *   imp-96567 derived the EXACT closed-form tail rho_k = -(1/(2 pi^2 Sigma^2))
 *   ln(k^2/(k^2-1)). imp-96593 substituted that exact tail and found the calibrated
 *   magnitudes (rho_2 = -0.014950, rho_3 = -0.006121) are LESS negative than the
 *   tabulated ones -- so the soft 13.71 level was mildly ANTI-conservative, not a
 *   valid upper bound at all. This headword bakes that three-way reconciliation
 *   verbatim (no re-import of the imp-96593 module, to stay import-light) as a
 *   standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Three distinct numbers answer three distinct questions about the same lag-2/3
 *   Bartlett-weighted VIF calculation, and they must not be conflated:
 *     (1) SOFT tabulated (z = 13.71, VIF <= 0.0197): uses uncalibrated tabulated
 *         magnitudes rho_2 = -0.020, rho_3 = -0.008, drops k >= 4. MIS-CALIBRATED --
 *         the tabulated magnitudes are MORE negative than the calibrated truth,
 *         which pushes VIF too LOW and z too HIGH. Not a valid upper-bound level.
 *     (2) RIGOROUS two-lag (z >= 10.52, VIF <= 0.0334): uses the calibrated
 *         closed-form rho_2 = -0.014950, rho_3 = -0.006121 for the same two lags,
 *         drops the certified-nonpositive k >= 4 tail (safe, bound-enlarging). A
 *         clean rigorous conditional upper bound, LOWER than the soft 13.71 because
 *         the honest magnitudes are milder.
 *     (3) ACTUAL finite-window (z ~ 26.0, VIF ~ 0.0055): sums the exact closed-form
 *         tail across the WHOLE Bartlett window k = 2..290 (nothing dropped) -- the
 *         true conditional value, not an upper bound construction.
 *   Ordering: VIF_ACTUAL < VIF_SOFT < VIF_RIGOROUS_2LAG (equivalently Z_ACTUAL >
 *   Z_SOFT > Z_RIGOROUS_2LAG). The 13.71 figure sits BETWEEN the rigorous bound and
 *   the true value only because two independent errors (a too-negative rho_2 and a
 *   too-negative rho_3) partially cancel against the truncation of k >= 4 -- an
 *   artifact, not a genuine bracket.
 *
 *   STATUS: the residual obstruction MIGRATES from CALIBRATION to NUMERICAL
 *   ENCLOSURE -- full rigor still needs an interval-certified Sigma^2(L), a
 *   certified one-sided bound that the closed form is >= the true finite-L box
 *   correlation, and GUE throughout. Conditional on the GUE sine kernel / Montgomery
 *   pair correlation (UNPROVEN); changes no unconditional bound.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96593 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96593-vif-exact-tail-rigor-upgrade-assessment.js (source: the three-level split this glosses)
 * @see imp-96571-vif-rho1-bound-rigor-assessment (confined the softness to the z >= 13.71 level)
 * @see imp-96567-box-averaged-sine-kernel-lag-decay (the exact closed-form tail and Sigma^2(L))
 * @see imp-96543-sine-kernel-vif-conditional-lower-bound (the three-level certificate and OBSTRUCTION)
 *
 * Ticket: imp-96820 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The VIF three-level reconciliation headword, baked verbatim (no re-import).
const VIF_THREE_LEVEL_HEADWORD = Object.freeze({
  key: 'route-m-vif-three-level-reconciliation-soft-rigorous-actual',
  term:
    'imp-96593 verdict: the soft z_eff = 13.71 tabulated VIF level is a ' +
    'mis-calibration artifact (mildly anti-conservative, not a valid upper bound); ' +
    'the honest rigorous two-lag level is z >= 10.52 (VIF <= 0.0334); the actual ' +
    'finite-window value is z ~ 26.0 (VIF ~ 0.0055)',
  definition:
    'imp-96543/imp-96571 left a soft z_eff >= 13.71 (VIF_291 <= 0.0197) refinement ' +
    'resting on uncalibrated tabulated lag-2/3 magnitudes rho_2 = -0.020, ' +
    'rho_3 = -0.008. Substituting the imp-96567 exact closed-form tail ' +
    'rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)) shows the calibrated magnitudes ' +
    '(rho_2 = -0.014950, rho_3 = -0.006121) are LESS negative than the tabulated ' +
    'ones -- so the tabulated inputs pushed VIF too low and z too high. The exact ' +
    'tail does not ratify 13.71; it splits it into a rigorous bound and a true value.',
  mechanism:
    'Three distinct numbers from the same lag-2/3 Bartlett-weighted calculation: ' +
    '(1) SOFT tabulated z = 13.71, VIF <= 0.0197 -- uncalibrated magnitudes, ' +
    'MIS-CALIBRATED, not a valid upper bound; (2) RIGOROUS two-lag z >= 10.52, ' +
    'VIF <= 0.0334 -- calibrated closed-form rho_2/rho_3, certified-nonpositive ' +
    'k >= 4 tail dropped (safe), a clean conditional upper bound; (3) ACTUAL ' +
    'finite-window z ~ 26.0, VIF ~ 0.0055 -- exact closed-form tail summed across ' +
    'the whole k = 2..290 Bartlett window, the true conditional value. Ordering: ' +
    'VIF_ACTUAL (0.0055) < VIF_SOFT (0.0197) < VIF_RIGOROUS_2LAG (0.0334); the soft ' +
    'level sits between the other two only because a too-negative rho_2/rho_3 ' +
    'partially cancels against dropping k >= 4 -- an artifact, not a genuine bracket.',
  verificationStatus:
    'Reconciliation of an existing three-way split, not a new bound: all three ' +
    'levels are conditional on the GUE sine kernel / Montgomery pair correlation for ' +
    'the zeta zeros (UNPROVEN, GRH-flavored). The residual obstruction migrates from ' +
    'calibration to numerical enclosure -- full rigor on levels (2)/(3) still needs ' +
    'an interval-certified Sigma^2(L), a certified one-sided bound that the closed ' +
    'form is >= the true finite-L box correlation, and GUE throughout. Changes no ' +
    'unconditional bound; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96820_VIF_THREE_LEVEL_RECONCILIATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96820',
  proofSection: 'S-frontier',
  glosses: 'imp-96593',
  question:
    'imp-96593 found that the exact imp-96567 closed-form tail neither ratifies nor ' +
    'refutes the soft imp-96571 z_eff = 13.71 level outright, but SPLITS it into a ' +
    'rigorous bound (z >= 10.52) and a true value (z ~ 26.0). Does a single glossary ' +
    'headword make that three-way reconciliation (soft / rigorous / actual) navigable ' +
    'without re-deriving the calculation?',
  headword: VIF_THREE_LEVEL_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96593 ' +
    'verdict: the soft z_eff = 13.71 (VIF <= 0.0197) tabulated level is a ' +
    'mis-calibration artifact -- mildly ANTI-conservative because its tabulated ' +
    'rho_2/rho_3 magnitudes are MORE negative than the calibrated closed-form truth ' +
    '-- and was never a valid upper-bound level. The honest rigorous two-lag bound ' +
    'from the same lags, dropping the certified-nonpositive k >= 4 tail, is ' +
    'z >= 10.52 (VIF <= 0.0334); the actual finite-window value from the full exact ' +
    'tail is z ~ 26.0 (VIF ~ 0.0055). Ordering VIF_ACTUAL < VIF_SOFT < ' +
    'VIF_RIGOROUS_2LAG shows the soft level was never a genuine bracket midpoint, ' +
    'just an artifact of two partially-cancelling calibration errors. Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96593 (the three-level split this glosses); imp-96571 (confined the ' +
    'softness to z >= 13.71); imp-96567 (the exact closed-form tail and Sigma^2(L)); ' +
    'imp-96543 (the three-level certificate and OBSTRUCTION).',
});

export default IMP96820_VIF_THREE_LEVEL_RECONCILIATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96820_VIF_THREE_LEVEL_RECONCILIATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96820-headword-has-required-fields',
    why: 'The headword must name all three VIF/z levels (soft 13.71, rigorous ' +
      '10.52, actual 26.0) and their VIF counterparts -- the entire point of the ' +
      'reconciliation.',
    holds: () => {
      const h = IMP96820_VIF_THREE_LEVEL_RECONCILIATION_GLOSSARY_HEADWORD.headword;
      return (
        /13\.71/.test(h.mechanism) &&
        /10\.52/.test(h.mechanism) &&
        /26\.0/.test(h.mechanism) &&
        /0\.0197/.test(h.mechanism) &&
        /0\.0334/.test(h.mechanism) &&
        /0\.0055/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96820-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96820_VIF_THREE_LEVEL_RECONCILIATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96820_VIF_THREE_LEVEL_RECONCILIATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96820_VIF_THREE_LEVEL_RECONCILIATION_GLOSSARY_HEADWORD.verdict) &&
      IMP96820_VIF_THREE_LEVEL_RECONCILIATION_GLOSSARY_HEADWORD.glosses === 'imp-96593',
  },
];

for (const assertion of IMP96820_VIF_THREE_LEVEL_RECONCILIATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96820-vif-three-level-reconciliation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
