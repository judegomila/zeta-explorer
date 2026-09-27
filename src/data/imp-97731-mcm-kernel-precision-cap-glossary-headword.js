/**
 * @module imp-97731-mcm-kernel-precision-cap-glossary-headword
 * @fileoverview imp-97731 -- import-light glossary/Concepts headword recording the imp-97704
 *   MCM kernel-precision cap result: the imp-97685 RESULT 3 divisor-sum cap d <= 1000 is
 *   PRECISION-LIMITED (set by IEEE-double Gexact-GKmain cancellation SNR), not tail-term-limited,
 *   so the trustworthy exact-Rexact d-range scales as d*(eps) proportional to eps^{-1/4}: a dps=30
 *   kernel eval would extend it from d <= 1000 to ~2.7-3.2e6, a ~3247x extension. But the
 *   cap-independent rigorous 1/(720 d^3) tail budget (< 5.69e-11) already bounds any cap-to-infinity
 *   gap shift a million-fold below the +7.520579e-5 omega=10 gap, so the extension moves no
 *   conclusion.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97704 confirmed the noise-ratio cancellation model (measured exponent 3.93
 *   against the theoretical 4, from |Gexact(d)| ~ d^2 log d cancelling against R(d) ~ 1/(720 d^2)),
 *   derived the cap-scaling law d*(eps) proportional to eps^{-1/4}, and showed that raising the
 *   kernel evaluation precision from IEEE double (eps ~ 1.11e-16) to dps=30 (eps ~ 1e-30) would
 *   extend the trustworthy exact-Rexact divisor-sum range from d <= 1000 to ~2.7e6-3.2e6.
 *   (b) WHY IT IS NEW. imp-97685 RESULT 3 only established WHY more analytic Euler-Maclaurin tail
 *   terms cannot extend the cap (it is a cancellation-precision ceiling, not a tail-truncation
 *   ceiling). imp-97704 supplies the missing complementary half: precision (not tail-term count) IS
 *   the correct lever, and quantifies exactly how far it moves the cap.
 *   (c) WHY IT MATTERS. It settles that the d <= 1000 cap is an artifact of using IEEE-double
 *   arithmetic in the exact kernel evaluation, not a fundamental limit of the Route M MCM
 *   divisor-sum method.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. Extending the exact sum to the dps=30 cap only replaces the
 *   rigorous 1/(720 d^3) tail BOUND on 1000 < d <= d*_30 with a smaller exact signed contribution,
 *   whose magnitude is still capped by that same cap-independent budget (< 5.69e-11). Since the
 *   +7.520579e-5 omega=10 gap exceeds this budget by a factor of ~1.32e6, the primorial p_10# stays
 *   the strict minimiser and the MCM onset stays exactly omega=11 no matter how far the cap is pushed.
 *   (e) STATUS: documentation only. No bound moved; no new inequality; the rigorous anchor stays the
 *   1/(720 d^3) tail budget; MCM stays refuted from omega=11; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   result. Not a new derivation. NO QED.
 *
 * @see imp-97704-mcm-kernel-precision-cap-scaling.js (source: the eps^{-1/4} cap-scaling law and the
 *   dps=30 extension estimate this headword names)
 * @see imp-97685-mcm-tail-budget-two-term-euler-maclaurin.js (the d <= 1000 cap this result explains
 *   as precision-limited rather than tail-term-limited)
 * @see imp-97647-route-m-mcm-omega10-cap-robustness.js (the measured double noise ratios and the
 *   +7.52e-5 omega=10 gap re-checked here)
 *
 * Ticket: imp-97731 (content, low, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The MCM kernel-precision cap headword, baked verbatim (no re-import).
const MCM_KERNEL_PRECISION_CAP_HEADWORD = Object.freeze({
  key: 'mcm-kernel-precision-cap-imp97704',
  term:
    'MCM kernel-precision cap: the imp-97685 exact-Rexact divisor-sum cap d <= 1000 scales as ' +
    'd*(eps) proportional to eps^{-1/4}, precision-limited rather than tail-term-limited',
  definition:
    'The Route M MCM exact double-kernel divisor sum Rexact(d) = Gexact(d) - GKmain(d) is trustworthy ' +
    'only up to a cap d*(eps) set by cancellation noise, not by how many analytic Euler-Maclaurin tail ' +
    'terms are carried. Because |Gexact(d)| ~ (d^2/2) log d while the true remainder R(d) ~ 1/(720 d^2), ' +
    'evaluating at precision eps leaves signal-to-noise ratio proportional to 1/(d^4 log d * eps), so the ' +
    'trustworthy cap scales as d*(eps) proportional to eps^{-1/4} (log-corrected). Dropping eps from the ' +
    'IEEE-double ~1.11e-16 to a dps=30 eval (~1e-30) would multiply the cap by (1.11e14)^{1/4} ~ 3247, ' +
    'extending it from d <= 1000 to ~2.7e6-3.2e6.',
  mechanism:
    'The imp-97647 measured double noise ratios (139.5 at d=2000, 5096.2 at d=5000) sit on a power law ' +
    'with exponent ln(5096.2/139.5)/ln(2.5) = 3.93, matching the theoretical 4 from the cancellation ' +
    'model |Gexact| ~ d^2 log d against R ~ 1/(720 d^2). Extending the exact sum past the double cap only ' +
    'replaces the rigorous 1/(720 d^3) tail BOUND on d > 1000 with a smaller exact signed contribution ' +
    'still capped by the same cap-independent budget: Sum_{d>1000} 1/(720 d^3) < 5.69e-11 (primorial + ' +
    'competitor combined), a million-fold below the +7.520579e-5 omega=10 gap, so no cap extension can ' +
    'flip the primorial ordering or move the omega=11 MCM onset.',
  verificationStatus:
    'Re-cited from the imp-97704 derivation module (src/data/imp-97704-mcm-kernel-precision-cap-scaling.js), ' +
    'with the measured noise exponent (3.93) checked against the theoretical 4, the extension factor ' +
    '(~3247) checked against the eps^{-1/4} law, and the extended-cap gap re-check confirming the omega=10 ' +
    'gap (7.520578537e-5) is unchanged to within the cap-independent tail budget. Naming / glossary ' +
    'headword only; supplies no new bound; MCM stays refuted from omega=11; RH open; Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA; NO QED.',
});

export const IMP97731_MCM_KERNEL_PRECISION_CAP_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97731',
  proofSection: 'Route-M',
  glosses: 'imp-97704',
  question:
    'imp-97704 showed the imp-97685 exact-Rexact divisor-sum cap d <= 1000 is precision-limited and ' +
    'scales as d*(eps) proportional to eps^{-1/4} -- what is the headword for this result?',
  headword: MCM_KERNEL_PRECISION_CAP_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97704 result that the exact ' +
    'kernel divisor-sum cap d <= 1000 is precision-limited (d*(eps) proportional to eps^{-1/4}), so a ' +
    'dps=30 eval would extend it ~3247x to ~2.7e6-3.2e6, but the cap-independent rigorous 1/(720 d^3) ' +
    'tail budget (< 5.69e-11) bounds any cap-to-infinity gap shift a million-fold below the +7.520579e-5 ' +
    'omega=10 gap. No bound moved; MCM stays refuted from omega=11; NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-97704 (the cap-scaling derivation this glosses); imp-97685 (the RESULT 3 cap this refines); ' +
    'imp-97647 (the measured double noise ratios and the +7.52e-5 gap re-checked here).',
});

export default IMP97731_MCM_KERNEL_PRECISION_CAP_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97731_MCM_KERNEL_PRECISION_CAP_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97731-headword-names-scaling-law-and-values',
    why: 'The headword must name the eps^{-1/4} cap-scaling law and the two refined numeric ' +
      'quantities -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97731_MCM_KERNEL_PRECISION_CAP_GLOSSARY_HEADWORD.headword;
      return (
        /eps\^\{-1\/4\}/.test(h.definition) &&
        /3247/.test(h.definition) &&
        /5\.69e-11/.test(h.mechanism) &&
        /7\.52057/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97731-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-97704.',
    holds: () =>
      IMP97731_MCM_KERNEL_PRECISION_CAP_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97731_MCM_KERNEL_PRECISION_CAP_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP97731_MCM_KERNEL_PRECISION_CAP_GLOSSARY_HEADWORD.verdict) &&
      IMP97731_MCM_KERNEL_PRECISION_CAP_GLOSSARY_HEADWORD.glosses === 'imp-97704',
  },
];

for (const assertion of IMP97731_MCM_KERNEL_PRECISION_CAP_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97731-mcm-kernel-precision-cap-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
