/**
 * @module imp-97364-friable-partial-sum-reformulation-glossary-headword
 * @fileoverview imp-97364 -- import-light glossary/Concepts headword recording the imp-97332
 *   exact finite reformulation of the imp-97309 RESULT 5 interchange conjecture as a
 *   FRIABLE-PARTIAL-SUM question, T_k = Integral_0^inf g(t) [ e^t M_k(t) - 1 ] dt with M_k the
 *   P_k-friable partial sum of the Moebius series M, plus the rigorous localization of the
 *   entire interchange defect to the t -> 0 boundary layer.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) EXACT FINITE FORM. T_k := Sum_{e | b_k, e>=2} mu(e) J(e-1) (the divisor-restricted
 *   Moebius-Binet sum over the primorial b_k = p_1...p_k) rewrites EXACTLY, via termwise Binet
 *   integration J(n) = Integral_0^inf g(t) e^{-n t} dt, as
 *       T_k = Integral_0^inf g(t) [ e^t M_k(t) - 1 ] dt,   M_k(t) := Sum_{e | b_k} mu(e) e^{-e t}.
 *   (b) M_k IS THE FRIABLE PARTIAL SUM. Since mu(e) = 0 off squarefree e and every squarefree e
 *   with largest prime factor P^+(e) <= p_k divides b_k, M_k(t) is exactly the P_k-FRIABLE
 *   (smooth) partial sum of the full series M(t) = Sum_{n>=1} mu(n) e^{-n t}. The interchange
 *   conjecture lim_k T_k = Integral g(t)(e^t M(t)-1) dt is therefore exactly the statement that
 *   the friable partial sums M_k converge to M UNDER the integral against g(t) e^t -- a
 *   friable-partial-sum question, not a naive termwise limit.
 *   (c) THE INTERCHANGE DEFECT IS ENTIRELY A BOUNDARY-LAYER PHENOMENON. Writing D_k := (limit) -
 *   T_k = Integral_0^inf g(t) e^t [M(t) - M_k(t)] dt, the tail t >= tau is O(e^{-p_{k+1} tau}) for
 *   any fixed tau>0 (pointwise geometric rate |M-M_k| <= e^{-p_{k+1}t}/(1-e^{-t})), so
 *   lim sup_k |D_k| = lim sup_k |Integral_0^tau g(t) e^t [M-M_k] dt| for every tau>0: the whole
 *   interchange question is carried by the shrinking window t in (0, tau) near the origin.
 *   (d) STATUS: this headword records an exact reformulation + a rigorous localization, not a
 *   resolution. The friable-Mertens bound sup_t |M_k(t)| = o(p_k) needed to close the interchange
 *   (IMP97332_INTERCHANGE_SUBGAP) is left OPEN.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an exact reformulation
 *   and a rigorous localization result. Not a proof of the interchange, no bound moved. NO QED.
 *
 * @see imp-97332-route-m-tail-interchange-assessment.js (source: RESULT 1 finite reformulation,
 *   RESULT 2 pointwise rate, RESULT 3 boundary-layer localization, IMP97332_INTERCHANGE_SUBGAP)
 * @see imp-97309-route-m-arith-tail-cancellation-assessment.js (RESULT 5 interchange conjecture
 *   being reformulated here)
 * @see imp-97289-route-m-arith-tail-o1-proof.js (IMP97289_TAIL_O1_SUBGAP, the reduction this
 *   interchange feeds into if eventually justified)
 *
 * Ticket: imp-97364 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The friable-partial-sum reformulation headword, baked verbatim (no re-import).
const FRIABLE_PARTIAL_SUM_REFORMULATION_HEADWORD = Object.freeze({
  key: 'friable-partial-sum-reformulation-imp97332-boundary-layer',
  term:
    'imp-97332 friable-partial-sum reformulation: T_k = Integral_0^inf g(t) [ e^t M_k(t) - 1 ] dt ' +
    'with M_k the P_k-friable partial sum of the Moebius series M, and the entire imp-97309 ' +
    'RESULT 5 interchange defect localized to the t -> 0 boundary layer',
  definition:
    'The divisor-restricted Moebius-Binet sum T_k = Sum_{e|b_k,e>=2} mu(e) J(e-1) (b_k the k-th ' +
    'primorial) rewrites exactly as T_k = Integral_0^inf g(t) [e^t M_k(t) - 1] dt, where ' +
    'M_k(t) = Sum_{e|b_k} mu(e) e^{-et} is exactly the P_k-FRIABLE (largest-prime-factor <= p_k) ' +
    'partial sum of the full series M(t) = Sum_{n>=1} mu(n) e^{-nt}. The interchange conjecture ' +
    'lim_k T_k = Integral g(t)(e^t M(t)-1)dt is thus exactly friable-partial-sum convergence of M ' +
    'under the integral against g(t) e^t, not a naive termwise limit.',
  mechanism:
    'Writing the interchange defect D_k = Integral_0^inf g(t) e^t [M(t)-M_k(t)] dt, the pointwise ' +
    'geometric rate |M(t)-M_k(t)| <= e^{-p_{k+1}t}/(1-e^{-t}) (every P_k-rough index e >= p_{k+1}) ' +
    'makes the tail t>=tau contribute only O(e^{-p_{k+1}tau}) for any fixed tau>0. Hence ' +
    'lim sup_k |D_k| = lim sup_k |Integral_0^tau g(t) e^t [M-M_k] dt| for every tau>0: the entire ' +
    'interchange defect is carried by the shrinking t -> 0 boundary layer window (0,tau), where the ' +
    'exact non-uniformity M_k(0+)=0 (for every finite k) vs M(0+)=-2 lives.',
  verificationStatus:
    'Re-cited from the imp-97332 measurement/proof module ' +
    '(src/data/imp-97332-route-m-tail-interchange-assessment.js): RESULT 1 (exact finite ' +
    'reformulation) and RESULT 3 (boundary-layer localization) are rigorous; the friable-Mertens ' +
    'bound sup_t |M_k(t)| = o(p_k) needed to actually justify the interchange ' +
    '(IMP97332_INTERCHANGE_SUBGAP) remains OPEN. Naming / glossary headword only; no bound moved; ' +
    'RH open; no refereed bound is changed; NO QED.',
});

export const IMP97364_FRIABLE_PARTIAL_SUM_REFORMULATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97364',
  proofSection: 'Route-M',
  glosses: 'imp-97332',
  question:
    'imp-97332 rewrote the imp-97309 RESULT 5 interchange conjecture as an exact friable-partial-' +
    'sum statement T_k = Integral g(t)(e^t M_k(t)-1) dt and localized its entire defect to the ' +
    't -> 0 boundary layer. What is the headword for this reformulation, and does it move any bound?',
  headword: FRIABLE_PARTIAL_SUM_REFORMULATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97332 exact finite ' +
    'reformulation T_k = Integral g(t)(e^t M_k(t)-1) dt with M_k the P_k-friable partial sum of ' +
    'M, and the rigorous localization of the whole interchange defect to the t -> 0 boundary ' +
    'layer. No bound moved; the friable-Mertens sub-gap IMP97332_INTERCHANGE_SUBGAP stays open; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-97332 (the finite reformulation and boundary-layer localization this glosses); ' +
    'imp-97309 (the RESULT 5 interchange conjecture being reformulated); imp-97289 (the tail-o1 ' +
    'sub-gap this interchange feeds if justified).',
});

export default IMP97364_FRIABLE_PARTIAL_SUM_REFORMULATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97364_FRIABLE_PARTIAL_SUM_REFORMULATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97364-headword-cites-finite-form-and-localization',
    why: 'The headword must name the exact finite reformulation and the boundary-layer ' +
      'localization -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97364_FRIABLE_PARTIAL_SUM_REFORMULATION_GLOSSARY_HEADWORD.headword;
      return (
        /M_k\(t\)/.test(h.definition) &&
        /P_k-FRIABLE/.test(h.definition) &&
        /boundary layer|t -> 0/.test(h.mechanism) &&
        /p_\{k\+1\}/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97364-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, sub-gap left open, no QED, no-refereed-bound-change line ' +
      'present.',
    holds: () =>
      IMP97364_FRIABLE_PARTIAL_SUM_REFORMULATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97364_FRIABLE_PARTIAL_SUM_REFORMULATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97364_FRIABLE_PARTIAL_SUM_REFORMULATION_GLOSSARY_HEADWORD.verdict) &&
      IMP97364_FRIABLE_PARTIAL_SUM_REFORMULATION_GLOSSARY_HEADWORD.glosses === 'imp-97332',
  },
];

for (const assertion of IMP97364_FRIABLE_PARTIAL_SUM_REFORMULATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97364-friable-partial-sum-reformulation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
