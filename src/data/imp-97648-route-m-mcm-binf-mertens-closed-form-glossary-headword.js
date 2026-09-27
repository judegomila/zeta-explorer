/**
 * @module imp-97648-route-m-mcm-binf-mertens-closed-form-glossary-headword
 * @fileoverview imp-97648 -- import-light glossary/Concepts headword recording the imp-97619
 *   Route M MCM bracket limit CLOSED FORM: the imp-97601 measured bracket constant B_inf ~ 0.296789
 *   is derived in closed form as a shifted Euler-Mascheroni constant B_inf = lnA + gamma/12 =
 *   0.2968557824, with the derivation resting on the Mertens-type limit
 *   lim_{omega}(log p_{omega+1} - Sigma_omega) = gamma (from Sum_{n<=x} Lambda(n)/n = log x - gamma + o(1)).
 *   The gap-law constant refines to e^{-gamma}*(lnA + gamma/12) = 0.16667249.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97619 proved the Route M MCM per-order bracket A_omega + c*log p_{omega+1}
 *   (c = 1/12) converges to B_inf = lnA + gamma/12 = 0.2968557824422, where lnA is the
 *   Glaisher-Kinkelin log-constant and gamma is Euler-Mascheroni. The imp-97601 measured value
 *   0.296789 (at p ~ 2e6) approaches this closed-form limit from BELOW, ~6.7e-5 short -- the finite-
 *   height undershoot predicted by the o(1) tail of the Mertens-type identity.
 *   (b) WHY IT IS NEW. imp-97601 only MEASURED the bracket limit numerically through the 148933rd
 *   prime. imp-97619 identifies it in closed form and additionally refines the gap-law constant from
 *   the finite-height 0.166635 to the closed-form e^{-gamma}*(lnA + gamma/12) = 0.16667249.
 *   (c) WHY IT MATTERS. Pinning B_inf in closed form removes the only remaining numerical
 *   uncertainty in the Route M MCM per-order surrogate decrement's asymptotic constant, and shows the
 *   next-order correction to the gap law is the PNT/Mertens error term (not a clean elementary
 *   1/log^2 constant) -- a named honest sub-gap, IMP97619_GAP_LAW_NEXT_ORDER_IS_PNT_ERROR_NOT_ELEMENTARY.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. MCM stays refuted from omega=11 (imp-97432/imp-97583); the
 *   b/4 ceiling and kappa_arith are untouched; this is a constant-identification result, not a new
 *   inequality.
 *   (e) STATUS: documentation only. No bound moved; no coefficient pinned beyond the closed form
 *   itself; the rigorous anchor stays the trace ceiling; compute binds first; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   result. Not a new derivation. NO QED.
 *
 * @see imp-97619-route-m-mcm-binf-mertens-closed-form.js (source: the closed-form derivation this
 *   headword names, B_inf = lnA + gamma/12)
 * @see imp-97601-route-m-mcm-margin-collapse-rate-law.js (B_inf ~ 0.296789 measured; gap ~
 *   0.166635/log p, the finite-height values refined here)
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (surrogate closed form + primorial
 *   limit; kernel; MCM refuted from omega=11, unchanged)
 *
 * Ticket: imp-97648 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The MCM bracket-limit closed-form headword, baked verbatim (no re-import).
const ROUTE_M_MCM_BINF_MERTENS_CLOSED_FORM_HEADWORD = Object.freeze({
  key: 'route-m-mcm-binf-mertens-closed-form-imp97619',
  term:
    'Route M MCM bracket limit B_inf: the imp-97601 measured constant B_inf ~ 0.296789 identified ' +
    'in closed form as the shifted Euler-Mascheroni constant lnA + gamma/12',
  definition:
    'The Route M MCM per-order surrogate decrement bracket A_omega + c*log p_{omega+1} (c = 1/12) ' +
    'converges to B_inf = lnA + gamma/12 = 0.2968557824422, where lnA = 0.2487544770337842 is the ' +
    'Glaisher-Kinkelin log-constant and gamma = 0.5772156649015329 is the Euler-Mascheroni constant. ' +
    'The gap-law constant refines to e^{-gamma}*(lnA + gamma/12) = 0.16667249.',
  mechanism:
    'The only omega-dependent piece of the bracket is M_omega = log p_{omega+1} - Sigma_omega, where ' +
    'Sigma_omega = Sum_{p<=p_omega} log p/(p-1). Splitting log p/(p-1) = log p/p + log p/(p(p-1)) and ' +
    'applying the standard prime-sum identity Sum_{n<=x} Lambda(n)/n = log x - gamma + o(1) gives ' +
    'Sigma_omega = log p_omega - gamma + o(1), so M_omega -> gamma. Hence B_inf = lnA + (1/12)*gamma. ' +
    'The imp-97601 measured 0.296789 is the finite-height bracket at p ~ 2e6, approaching the derived ' +
    'limit from below by the slow o(1) undershoot.',
  verificationStatus:
    'Re-cited from the imp-97619 derivation module ' +
    '(src/data/imp-97619-route-m-mcm-binf-mertens-closed-form.js), with the baked bracket ladder ' +
    'monotonically increasing toward B_inf_derived across omega = 100..148933 (p up to ~2e6) and the ' +
    'gap-tail residual against the derived law strictly decreasing when scaled by log^2 p. Naming / ' +
    'glossary headword only; supplies no new bound; MCM stays refuted from omega=11; RH open; ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
});

export const IMP97648_ROUTE_M_MCM_BINF_MERTENS_CLOSED_FORM_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97648',
  proofSection: 'Route-M',
  glosses: 'imp-97619',
  question:
    'imp-97619 derived the imp-97601 measured Route M MCM bracket limit B_inf ~ 0.296789 in closed ' +
    'form as a shifted Euler-Mascheroni constant -- what is the headword for this result?',
  headword: ROUTE_M_MCM_BINF_MERTENS_CLOSED_FORM_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97619 closed-form result ' +
    'B_inf = lnA + gamma/12 = 0.2968557824 (Mertens-type: log p - Sigma_omega -> gamma), refining ' +
    'the imp-97601 measured 0.296789 and the gap-law constant to e^{-gamma}*(lnA + gamma/12) = ' +
    '0.16667249. No bound moved; MCM stays refuted from omega=11; NO QED. Platt-Trudgian Lambda <= ' +
    '0.2 remains SOTA.',
  citation:
    'imp-97619 (the closed-form derivation this glosses); imp-97601 (the finite-height measurement ' +
    'refined here); imp-97432 (the surrogate kernel and MCM refutation, unchanged).',
});

export default IMP97648_ROUTE_M_MCM_BINF_MERTENS_CLOSED_FORM_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97648_ROUTE_M_MCM_BINF_MERTENS_CLOSED_FORM_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97648-headword-names-closed-form-and-values',
    why: 'The headword must name the closed form B_inf = lnA + gamma/12 and the two refined ' +
      'numeric constants -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97648_ROUTE_M_MCM_BINF_MERTENS_CLOSED_FORM_GLOSSARY_HEADWORD.headword;
      return (
        /lnA \+ gamma\/12/.test(h.definition) &&
        /0\.2968557824/.test(h.definition) &&
        /0\.16667249/.test(h.definition) &&
        /log x - gamma \+ o\(1\)/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97648-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-97619.',
    holds: () =>
      IMP97648_ROUTE_M_MCM_BINF_MERTENS_CLOSED_FORM_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97648_ROUTE_M_MCM_BINF_MERTENS_CLOSED_FORM_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP97648_ROUTE_M_MCM_BINF_MERTENS_CLOSED_FORM_GLOSSARY_HEADWORD.verdict) &&
      IMP97648_ROUTE_M_MCM_BINF_MERTENS_CLOSED_FORM_GLOSSARY_HEADWORD.glosses === 'imp-97619',
  },
];

for (const assertion of IMP97648_ROUTE_M_MCM_BINF_MERTENS_CLOSED_FORM_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97648-route-m-mcm-binf-mertens-closed-form-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
