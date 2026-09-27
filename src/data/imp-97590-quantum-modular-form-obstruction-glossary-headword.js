/**
 * @module imp-97590-quantum-modular-form-obstruction-glossary-headword
 * @fileoverview imp-97590 -- import-light glossary/Concepts headword recording the imp-97563
 *   verdict: the normalized symmetric cotangent sum w_sym(a,q) = (V(a,q)+V(q,a))/q is a QUANTUM
 *   MODULAR FORM (Estermann/Vasyunin cotangent sum, Bettin-Conrey / Zagier), so it does NOT extend
 *   continuously to real x, and the Bettin-Conrey reciprocity split can isolate the smooth Route M
 *   curvature coefficient kappa_smooth only as a Gauss-Kuzmin AVERAGE, never pointwise.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97563 assessed the exact Bettin-Conrey reciprocity cocycle
 *   h(a/q) - (q/a)^s h(qbar/a) = psi(a/q) applied to the Estermann/Vasyunin cotangent sum V(a,q)
 *   underlying w_sym. The cocycle defect psi is an ANALYTIC period function (real-analytic on R,
 *   holomorphic off R), but h itself -- and hence w_sym -- is a quantum modular form: it does NOT
 *   extend continuously to real x. Measured near x=0.1, the small-denominator convergent 1/10
 *   spikes to r/x^2 = -0.0872 while generic large-denominator neighbors (10/101, 11/109, 9/91,
 *   10/99) cluster near -0.02, a jump of O(0.06) between reduced-rational neighbors.
 *   (b) WHY IT IS NEW. imp-97460 had localized the curvature obstruction (smooth O(x^2) endpoint
 *   and arithmetic phi->1 endpoint entering at the same order) and named the reciprocity split as
 *   the only candidate route to separate them, without determining whether that split actually
 *   succeeds. imp-97563 carries the split out and reports the precise outcome: it isolates the
 *   cusp x->0 Taylor coefficient of psi as kappa_smooth (smooth by construction), but the residual
 *   after each reciprocation step is another cotangent sum of the same shape -- a Denjoy-Koksma
 *   Birkhoff sum of cot along the Gauss-map orbit, bounded but not vanishing, oscillating at the
 *   O(4e-2) amplitude set by the non-integrable cot singularity.
 *   (c) WHY POINTWISE IS IMPOSSIBLE IN PRINCIPLE. The wobble is not a finite-b truncation artifact
 *   to be resummed away: it is the intrinsic denominator-dependence of a quantum modular form. No
 *   finite number of reciprocation steps removes it, so kappa_smooth is recoverable only as a
 *   Gauss-Kuzmin average over generic (large-denominator) rationals near x -- exactly the
 *   wobble-averaged |kappa_smooth| <~1e-2 that imp-97460 measured. kappa_eff = 0.0995 (imp-97437)
 *   therefore remains a wobble amplitude, not an estimate of kappa_smooth.
 *   (d) STATUS: documentation only. No analytic constant pinned (the exact kappa_smooth is the
 *   still-uncomputed psi cusp O(x^2) coefficient); no bound moved; the rigorous anchor stays the
 *   trace ceiling T = 2.594e7 (compute binds first by >2600x); no operator positivity.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   assessment. Not a new derivation. NO QED.
 *
 * @see imp-97563-route-m-bettin-conrey-reciprocity-split-assessment.js (source: the quantum-modular-
 *   form finding and average-only isolation this headword names)
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route.js (obstruction localised; names the
 *   reciprocity split as the candidate route)
 * @see imp-97437-route-m-bulk-profile-curvature-crossover.js (kappa_eff = 0.0995, a wobble amplitude)
 *
 * Ticket: imp-97590 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The quantum-modular-form-obstruction headword, baked verbatim (no re-import).
const QUANTUM_MODULAR_FORM_OBSTRUCTION_HEADWORD = Object.freeze({
  key: 'route-m-quantum-modular-form-obstruction-imp97563',
  term:
    'quantum modular form obstruction: w_sym(a,q) is an Estermann/Vasyunin cotangent sum that does ' +
    'not extend continuously to real x, so the Bettin-Conrey reciprocity split isolates the smooth ' +
    'Route M curvature kappa_smooth only as a Gauss-Kuzmin average, never pointwise',
  definition:
    'The normalized symmetric cotangent sum w_sym(a,q) = (V(a,q)+V(q,a))/q (V the Vasyunin sum, ' +
    'scale-invariant on the reduced rational to ~1e-14) obeys the Bettin-Conrey / Zagier reciprocity ' +
    'cocycle h(a/q) - (q/a)^s h(qbar/a) = psi(a/q) with psi an ANALYTIC period function. The defining ' +
    'feature of a quantum modular form is that h itself is NOT continuous on Q as a function of the ' +
    'real argument even though the cocycle defect psi is smooth: near x = 0.1 the small-denominator ' +
    'convergent 1/10 spikes to r/x^2 = -0.0872 while generic large-denominator neighbors cluster near ' +
    '-0.02, a jump of O(0.06) between reduced-rational neighbors.',
  mechanism:
    'Iterating the cocycle down the Euclidean/continued-fraction (Gauss-map) descent isolates psi, ' +
    'whose cusp x->0 Taylor coefficient at order x^2 IS kappa_smooth (smooth by construction). But ' +
    'the residual after each reciprocation step is another cotangent sum of the same shape -- a ' +
    'Denjoy-Koksma Birkhoff sum of cot along the Gauss-map orbit, bounded but NOT vanishing, ' +
    'oscillating at the O(4e-2) amplitude set by the non-integrable cot singularity. This irreducible ' +
    'wobble is intrinsic quantum modularity, not a finite-b truncation artifact, so no finite number ' +
    'of reciprocation steps removes it: kappa_smooth is recoverable only as a Gauss-Kuzmin average ' +
    'over generic (large-denominator) rationals, matching the imp-97460 measured |kappa_smooth| <~1e-2.',
  verificationStatus:
    'Re-cited from the imp-97563 assessment module ' +
    '(src/data/imp-97563-route-m-bettin-conrey-reciprocity-split-assessment.js). kappa_eff = 0.0995 ' +
    '(imp-97437) remains a wobble amplitude, not an estimate of kappa_smooth. No analytic constant is ' +
    'pinned (exact kappa_smooth is the uncomputed psi cusp coefficient); no bound moved; the rigorous ' +
    'anchor stays the trace ceiling T = 2.594e7, compute (N ~ 9916, imp-96352) binds first by >2600x; ' +
    'no operator positivity. Naming / glossary headword only; RH open; Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA; NO QED.',
});

export const IMP97590_QUANTUM_MODULAR_FORM_OBSTRUCTION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97590',
  proofSection: 'Route-M',
  glosses: 'imp-97563',
  question:
    'imp-97563 established that w_sym is a quantum modular form whose reciprocity split isolates ' +
    'kappa_smooth only as a Gauss-Kuzmin average, never pointwise. What is the headword for this ' +
    'obstruction?',
  headword: QUANTUM_MODULAR_FORM_OBSTRUCTION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97563 quantum-modular-form ' +
    'obstruction: w_sym(a,q) is an Estermann/Vasyunin cotangent sum obeying an analytic Bettin-Conrey ' +
    'reciprocity cocycle, yet does not extend continuously to real x, so the reciprocity split ' +
    'isolates the smooth curvature kappa_smooth only as a Gauss-Kuzmin average over generic rationals ' +
    '-- pointwise separation from the O(4e-2) intrinsic wobble is impossible in principle. No bound ' +
    'moved; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97563 (the reciprocity-split assessment this glosses); imp-97460 (localises the obstruction ' +
    'and names the reciprocity route); imp-97437 (kappa_eff = 0.0995, the wobble amplitude).',
});

export default IMP97590_QUANTUM_MODULAR_FORM_OBSTRUCTION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97590_QUANTUM_MODULAR_FORM_OBSTRUCTION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97590-headword-names-quantum-modular-form-and-average',
    why: 'The headword must name the quantum-modular-form property, the analytic period function ' +
      'psi, and the average-only isolation of kappa_smooth -- the entire content of the entry.',
    holds: () => {
      const h = IMP97590_QUANTUM_MODULAR_FORM_OBSTRUCTION_GLOSSARY_HEADWORD.headword;
      return (
        /quantum modular form/.test(h.definition) &&
        /psi/.test(h.definition) &&
        /Gauss-Kuzmin/.test(h.mechanism) &&
        /0\.0872/.test(h.definition) &&
        /kappa_smooth/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97590-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-97563.',
    holds: () =>
      IMP97590_QUANTUM_MODULAR_FORM_OBSTRUCTION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97590_QUANTUM_MODULAR_FORM_OBSTRUCTION_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP97590_QUANTUM_MODULAR_FORM_OBSTRUCTION_GLOSSARY_HEADWORD.verdict) &&
      IMP97590_QUANTUM_MODULAR_FORM_OBSTRUCTION_GLOSSARY_HEADWORD.glosses === 'imp-97563',
  },
];

for (const assertion of IMP97590_QUANTUM_MODULAR_FORM_OBSTRUCTION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97590-quantum-modular-form-obstruction-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
