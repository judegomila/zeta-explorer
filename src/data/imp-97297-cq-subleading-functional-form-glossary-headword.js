/**
 * @module imp-97297-cq-subleading-functional-form-glossary-headword
 * @fileoverview imp-97297 -- import-light glossary/Concepts headword recording the imp-97261
 *   form decision for the sub-leading content of the interior Frobenius second moment
 *       Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2 / a^2 = s0 b + g(b) + r(b), s0 ~ 1.766.
 *   imp-97207 had assumed g(b) = cQ, a range-independent CONSTANT; imp-97241 then measured that
 *   ansatz drifting monotonically (cQ = -14.3 at b>=100 -> -28.2 at b>=1000). imp-97261 decided
 *   the trichotomy analytically via the exact relation m(bLo) = c * rho_h(bLo) between a candidate
 *   sub-leading form h(b) and the imp-97241 measured two-parameter OLS slope: the implied
 *   coefficient c is range-INDEPENDENT only for GROWING forms. A constant is the WORST-drifting
 *   basis (65.5% relative spread -- it IS the imp-97241 drift), single log b still drifts 41.1%,
 *   while the drift collapses to 11-16% for the two collinear co-leading forms b^(1/2) (c ~ -1.4)
 *   and log^2 b (c ~ -0.7), which the bounded range b<=2000 cannot separate.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE TRICHOTOMY IS DECIDED QUALITATIVELY, NOT QUANTITATIVELY. g(b) is neither a
 *   range-independent constant nor constant + single log b -- it is a slowly-varying SUB-b
 *   GROWING term with NEGATIVE coefficient, best matched over b<=2000 by g(b) ~ -1.4 b^(1/2) or
 *   equivalently g(b) ~ -0.7 log^2 b. The two forms are collinear at this reach and not separable.
 *   (b) A CONSTANT IS THE WORST BASIS, BY CONSTRUCTION. Forcing h=1 to absorb a genuinely growing
 *   g(b) is exactly what produces the imp-97241 -14.3 -> -28.2 drift (rho_const = 1 identically, so
 *   the implied c EQUALS the measured slope at every cutoff).
 *   (c) log^2 b IS MECHANISTICALLY MOTIVATED. By I(a,b)=I(b,a) and the rigorous a=1 border
 *   asymptotic I(1,b) = (1/2) log b + O(1) (imp-96667), each fixed small a contributes
 *   I(a,b)^2/a^2 ~ (kappa_a^2/a^2) log^2 b, injecting a POSITIVE Sum_a kappa_a^2/a^2 log^2 b term.
 *   The MEASURED net coefficient is NEGATIVE, so g(b) is a cancellation between this small-a piece
 *   and a negative bulk correction -- the sign is not pinned by this decision alone.
 *   (d) CONSEQUENCE: the imp-97207 intercept constituent (B) = 2 cQ (zeta(2)-5/4) is ILL-POSED (no
 *   range-independent cQ exists) and must be replaced by the convergent functional
 *   (B*) = 2 Sum_{b>=3} g(b)/b^2, which still converges for both candidate forms (log^2 b/b^2 and
 *   b^(-3/2) are both summable), so the intercept stays finite though its VALUE is not pinned here.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording a measured/decided
 *   functional-form result. Not a proof, no coefficient value pinned, no bound moved. NO QED.
 *
 * @see imp-97261-route-m-cq-subleading-functional-form.js (source form decision: rho_h diagnostic,
 *   implied-coefficient bands, the log^2 b mechanism, the (B*) replacement)
 * @see imp-97241-route-m-cq-subleading-finer-ladder.js (measured the pointwise drift + log
 *   instability this decides; the still-open sub-gap)
 * @see imp-97207-route-m-farfield-intercept-derivation.js (c1_T decomposition; constituent (B)
 *   originally assumed cQ constant, now shown ill-posed)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic.js (the rigorous a=1 border
 *   I(1,b) = (1/2) log b + O(1) driving the log^2 b mechanism)
 *
 * Ticket: imp-97297 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The Q(b) sub-leading-form headword, baked verbatim (no re-import).
const CQ_SUBLEADING_FUNCTIONAL_FORM_HEADWORD = Object.freeze({
  key: 'q-subleading-functional-form-imp97261-subb-power-not-constant',
  term:
    'imp-97261 Q(b) sub-leading functional-form decision: the interior Frobenius second moment ' +
    'Q(b) = s0 b + g(b) + r(b) has a sub-leading term g(b) that is a NEGATIVE sub-b growing term ' +
    '(b^(1/2), c ~ -1.4, or the collinear log^2 b, c ~ -0.7 over b<=2000), NOT the range-independent ' +
    'constant the imp-97207 ansatz assumed',
  definition:
    'Using the exact relation m(bLo) = c * rho_h(bLo) between a candidate sub-leading form h(b) ' +
    'and the imp-97241 measured two-parameter OLS slope m(bLo), the implied coefficient c is ' +
    'range-independent only for GROWING forms: a constant (rel-spread 65.5%, cmin -28.16, cmax ' +
    '-14.27) and single log b (rel-spread 41.1%) both drift, while b^(1/2) (rel-spread 11.2%, c in ' +
    '[-1.52,-1.36]) and log^2 b (rel-spread 15.7%, c in [-0.74,-0.63]) stabilise -- the two ' +
    'collinear co-leading forms this range cannot separate.',
  mechanism:
    'A constant is the worst basis by construction: rho_const = 1 identically, so forcing h=1 to ' +
    'absorb a genuinely growing g(b) IS the imp-97241 -14.3 -> -28.2 drift. log^2 b is ' +
    'mechanistically natural: I(a,b)=I(b,a) plus the rigorous border I(1,b) = (1/2) log b + O(1) ' +
    '(imp-96667) means each fixed small a contributes I(a,b)^2/a^2 ~ (kappa_a^2/a^2) log^2 b, a ' +
    'POSITIVE term -- but the measured net coefficient is NEGATIVE, so g(b) is a small-a-vs-bulk ' +
    'cancellation whose sign is not pinned by this decision.',
  verificationStatus:
    'Re-cited from the imp-97261 measurement module ' +
    '(src/data/imp-97261-route-m-cq-subleading-functional-form.js), which recomputes rho_h(bLo) and ' +
    'the implied-coefficient bands in-module from the imp-97241 baked slopes. Naming / glossary ' +
    'headword only; pins no coefficient value; the imp-97207 constituent (B) is shown ill-posed and ' +
    'replaced by the convergent (B*) = 2 Sum g(b)/b^2, itself unvalued; no bound moved; RH open; ' +
    'no refereed bound is changed; NO QED.',
});

export const IMP97297_CQ_SUBLEADING_FUNCTIONAL_FORM_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97297',
  proofSection: 'Route-M',
  glosses: 'imp-97261',
  question:
    'imp-97261 decided that the imp-97241 measured drift in the Q(b) sub-leading term is best ' +
    'explained by a growing sub-b form (b^(1/2) or log^2 b) rather than the imp-97207 constant ' +
    'ansatz. What is the headword for this functional-form decision, and does it pin a value or ' +
    'move any bound?',
  headword: CQ_SUBLEADING_FUNCTIONAL_FORM_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97261 decision: the ' +
    'Q(b) sub-leading term g(b) is a NEGATIVE sub-b growing term (b^(1/2) with c ~ -1.4, or the ' +
    'collinear log^2 b with c ~ -0.7), not a range-independent constant -- the constant ansatz is ' +
    'the worst-drifting basis (65.5%), exactly reproducing the imp-97241 drift. The imp-97207 ' +
    'intercept constituent (B) = 2 cQ (zeta(2)-5/4) is ill-posed and replaced by the convergent ' +
    '(B*) = 2 Sum g(b)/b^2. No coefficient value pinned; no bound moved; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97261 (the form-decision this glosses: rho_h diagnostic, implied-coefficient bands, the ' +
    'log^2 b mechanism, the (B*) replacement); imp-97241 (the measured pointwise drift being ' +
    'explained); imp-97207 (the constant ansatz shown ill-posed); imp-96667 (the rigorous a=1 ' +
    'border asymptotic driving the log^2 b mechanism).',
});

export default IMP97297_CQ_SUBLEADING_FUNCTIONAL_FORM_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97297_CQ_SUBLEADING_FUNCTIONAL_FORM_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97297-headword-cites-forms-and-mechanism',
    why: 'The headword must name the two co-leading candidate forms and their implied coefficients, ' +
      'plus the log^2 b mechanism -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97297_CQ_SUBLEADING_FUNCTIONAL_FORM_GLOSSARY_HEADWORD.headword;
      return (
        /b\^\(1\/2\)/.test(h.definition) &&
        /log\^2 b/.test(h.definition) &&
        /-1\.4|-1\.5[0-9]|-1\.3[0-9]/.test(h.definition) &&
        /I\(1,b\)/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97297-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no coefficient value pinned, no-refereed-bound-change line ' +
      'present, correctly glosses imp-97261.',
    holds: () =>
      IMP97297_CQ_SUBLEADING_FUNCTIONAL_FORM_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97297_CQ_SUBLEADING_FUNCTIONAL_FORM_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97297_CQ_SUBLEADING_FUNCTIONAL_FORM_GLOSSARY_HEADWORD.verdict) &&
      IMP97297_CQ_SUBLEADING_FUNCTIONAL_FORM_GLOSSARY_HEADWORD.glosses === 'imp-97261',
  },
];

for (const assertion of IMP97297_CQ_SUBLEADING_FUNCTIONAL_FORM_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97297-cq-subleading-functional-form-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
