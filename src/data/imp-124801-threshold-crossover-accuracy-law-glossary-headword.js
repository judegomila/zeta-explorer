/**
 * @module imp-124801-threshold-crossover-accuracy-law-glossary-headword
 * @fileoverview imp-124801 -- import-light glossary/Concepts headword recording the imp-97838
 *   THRESHOLD-CROSSOVER ACCURACY LAW: the imp-33743 leading closed-form threshold crossover
 *   N_cross(thr) = ((1-thr)/thr)^2 (C_C/E_trunc)^2 log T0(N_cross) has a closed-form-vs-empirical
 *   residual rel(thr) that is set, to leading order, by a SINGLE dimensionless ratio --
 *   2*E_flow/E_trunc evaluated at the crossing -- across the ENTIRE threshold family
 *   (thr = 0.9, 0.5, 0.1, 0.01), not just at the single thr = 0.1 far-tail landmark imp-33743
 *   originally reported.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97838 measured rel(thr) = (N_cross - N_emp)/N_emp at four thresholds and
 *   found it falls monotonically as thr drops: 0.24584 (thr=0.9) -> 0.003997 (thr=0.5) ->
 *   7.3777e-5 (thr=0.1) -> 8.793e-7 (thr=0.01), tracking the linear predictor 2*E_flow/E_trunc =
 *   0.21846 -> 0.0038115 -> 7.0976e-5 -> 8.5103e-7 to within 3-13% at every rung (ratio
 *   rel/predictor = 1.1253, 1.0487, 1.0395, 1.0332 -- inflated only where E_flow/E_trunc ~ 0.11
 *   is no longer tiny, near the peak). Restoring E_flow in the threshold balance (the D2
 *   flow-inclusive fixed point) closes the residual to floating-point zero (< 6e-15) at EVERY
 *   threshold, so the single ratio 2*E_flow/E_trunc IS the accuracy law of the leading closed form,
 *   not a coincidence of the thr = 0.1 landmark.
 *   (b) WHY IT IS NEW. imp-33743 evaluated the closed form ONLY at thr = 0.1 (far-tail) and noted
 *   its ~54x tighter residual than the thr = 0.5 halving landmark (imp-33723) without identifying
 *   the governing quantity. imp-97838 extends to a near-peak thr = 0.9 and a deep-tail thr = 0.01,
 *   turning the two-landmark contrast into a four-point monotone curve and identifying the single
 *   predictor 2*E_flow/E_trunc that governs it across ~5.5 decades.
 *   (c) WHY IT MATTERS. It reframes accuracy as a ONE-PARAMETER law of the threshold rather than
 *   per-landmark folklore: the leading closed form is worst near the sigma peak (~25% error) and
 *   best deep in the tail (~1e-4 % error), and any future threshold landmark's accuracy can be
 *   read off from E_flow/E_trunc at that crossing without a fresh bisection.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a diagnostic of the LEADING (E_flow-dropped)
 *   closed form's own error against the flow-inclusive fixed point, not a new inequality; the
 *   component model stays the inherited imp-3220/imp-3406 extrapolation, C_C's 1/8 ansatz
 *   (imp-2642/imp-2643) and the C_mb GUE-conditional (imp-486) are untouched, and no operator
 *   positivity or RH verdict is established.
 *   (e) STATUS: documentation only. No bound moved; no new derivation; NO QED. No refereed bound is changed.
 *
 * @see imp-97838-threshold-landmark-residual-trend.js (source: the four-threshold residual trend
 *   and the 2*E_flow/E_trunc predictor this headword names)
 * @see imp-33743-sigma-fartail-crossover-closed-form.js (thr = 0.1 far-tail landmark this extends)
 * @see imp-33723-sigma-half-vs-crossover-closed-form.js (thr = 0.5 halving landmark, the other anchor)
 *
 * Ticket: imp-124801 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The threshold-crossover accuracy-law headword, baked verbatim (no re-import).
const THRESHOLD_CROSSOVER_ACCURACY_LAW_HEADWORD = Object.freeze({
  key: 'threshold-crossover-accuracy-law-imp97838',
  term:
    'Threshold-crossover accuracy law: the imp-33743 leading closed-form crossover residual is set ' +
    'by a single ratio, 2*E_flow/E_trunc, across the entire threshold family',
  definition:
    'For the leading (E_flow-dropped) closed-form threshold crossover N_cross(thr) = ' +
    '((1-thr)/thr)^2 (C_C/E_trunc)^2 log T0(N_cross), the relative offset rel(thr) = ' +
    '(N_cross - N_emp)/N_emp against the empirical (bisected) crossing tracks the single ' +
    'dimensionless predictor 2*E_flow/E_trunc (evaluated at the crossing) to within 3-13% at ' +
    'every threshold tested: rel = 0.24584 / 0.003997 / 7.3777e-5 / 8.793e-7 versus predictor ' +
    '0.21846 / 0.0038115 / 7.0976e-5 / 8.5103e-7 at thr = 0.9 / 0.5 / 0.1 / 0.01.',
  mechanism:
    'Both N_cross and N_emp scale as E_coll^-2 near the crossing (sigma = E_coll/E_N = thr), so ' +
    'dropping E_flow from the denominator perturbs N by a factor (1 + E_flow/E_trunc)^-2 relative ' +
    'to the true balance, giving rel ~ 2*E_flow/E_trunc to leading order (Taylor expansion in the ' +
    'small ratio). E_flow ~ C_F*(log T0/T0)*Gronwall shrinks with N (hence with thr as the crossing ' +
    'walks down the tail), so rel shrinks in lockstep. The ratio rel/(2*E_flow/E_trunc) is 1.1253 ' +
    'at thr=0.9 (E_flow/E_trunc ~ 0.109, curvature visible), relaxing to 1.0332 by thr=0.01 (ratio ' +
    'tiny, expansion nearly exact); restoring E_flow in the balance (the D2 flow-inclusive fixed ' +
    'point) closes the residual to < 6e-15 relative at every threshold, confirming the law is exact ' +
    'apart from the higher-order curvature near the peak.',
  verificationStatus:
    'Re-cited from the imp-97838 measurement module ' +
    '(src/data/imp-97838-threshold-landmark-residual-trend.js), which tabulates four thresholds ' +
    '(thr = 0.9, 0.5, 0.1, 0.01) via Banach-iterated fixed points against downslope bisection of ' +
    'sigma(N), with the residual-falls-monotonically and predictor-tracking claims covered by ' +
    'tripwire assertions in that module. Naming / glossary headword only; supplies no new bound; ' +
    'the E_trunc/C_C/C_mb inputs are untouched; RH open; no refereed bound is changed; ' +
    'NO QED.',
});

export const IMP124801_THRESHOLD_CROSSOVER_ACCURACY_LAW_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124801',
  proofSection: 'S-frontier',
  glosses: 'imp-97838',
  question:
    'imp-97838 showed the imp-33743 leading closed-form threshold-crossover residual falls ' +
    'monotonically across a four-point threshold family, tracking 2*E_flow/E_trunc alone -- what ' +
    'is the headword for this accuracy law?',
  headword: THRESHOLD_CROSSOVER_ACCURACY_LAW_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97838 result that the ' +
    'imp-33743 leading closed-form threshold-crossover residual rel(thr) is governed, to leading ' +
    'order, by the single ratio 2*E_flow/E_trunc at the crossing -- falling 0.24584 -> 0.003997 -> ' +
    '7.3777e-5 -> 8.793e-7 across thr = 0.9/0.5/0.1/0.01, tracking the predictor to within 3-13% ' +
    'and closing to < 6e-15 once E_flow is restored. No bound moved; component model and C_C/C_mb ' +
    'inputs untouched; NO QED. No refereed bound is changed.',
  citation:
    'imp-97838 (the four-threshold residual trend this glosses); imp-33743 (the thr = 0.1 far-tail ' +
    'closed form being extended); imp-33723 (the thr = 0.5 halving landmark, the other original anchor).',
});

export default IMP124801_THRESHOLD_CROSSOVER_ACCURACY_LAW_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124801_THRESHOLD_CROSSOVER_ACCURACY_LAW_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124801-headword-names-predictor-and-values',
    why: 'The headword must name the 2*E_flow/E_trunc predictor and the four measured residual ' +
      'values -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124801_THRESHOLD_CROSSOVER_ACCURACY_LAW_GLOSSARY_HEADWORD.headword;
      return (
        /2\*E_flow\/E_trunc/.test(h.definition) &&
        /0\.24584/.test(h.definition) &&
        /8\.793e-7/.test(h.definition) &&
        /Taylor expansion/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp124801-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-97838.',
    holds: () =>
      IMP124801_THRESHOLD_CROSSOVER_ACCURACY_LAW_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124801_THRESHOLD_CROSSOVER_ACCURACY_LAW_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124801_THRESHOLD_CROSSOVER_ACCURACY_LAW_GLOSSARY_HEADWORD.verdict) &&
      IMP124801_THRESHOLD_CROSSOVER_ACCURACY_LAW_GLOSSARY_HEADWORD.glosses === 'imp-97838',
  },
];

for (const assertion of IMP124801_THRESHOLD_CROSSOVER_ACCURACY_LAW_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124801-threshold-crossover-accuracy-law-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
