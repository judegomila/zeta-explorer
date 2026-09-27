/**
 * @module imp-97749-fartail-diagnostic-rvm-slope-glossary-headword
 * @fileoverview imp-97749 -- import-light glossary/Concepts headword recording the imp-97723
 *   result: the imp-97702 far-tail diagnostic (1/2 - p) * 2 log T0 is exactly the Riemann-von
 *   Mangoldt log-derivative slope d ln T0/d ln N = 1 - 1/log(T0/2pi), so it converges to EXACTLY
 *   1 (not a ~0.98 floor), with next-order coefficient c = -1 and 1/L^2 coefficient -ln(2pi).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. Deep in the sigma far tail (sigma -> 0), the diagnostic
 *   (1/2 - p) * 2 log T0 reduces to (1 - sigma)(1 - 1/log(T0/2pi)) + sigma*log T0, which is the
 *   exact Riemann-von Mangoldt log-derivative slope d ln T0/d ln N = 1 - 1/log(T0/2pi). This
 *   settles imp-97702's open question: the ~0.98 value seen out to 1e24 is the finite-height
 *   value of this slope, not a constant offset -- the true limit is EXACTLY 1, reached only
 *   logarithmically (0.9805 at 1e24, 0.9989 at 1e300, crossing 0.99 only near 1e45).
 *   (b) THE NEXT-ORDER TERM. Writing the log-saturation coefficient as
 *   a = (1/(2 log T0))(1 + c/log T0 + ...), the exact slope gives c(L) = -L/(L - ln 2pi), so
 *   c -> -1 FROM BELOW and the 1/L^2 coefficient is -ln(2pi) ~ -1.838. The negative sign of c is
 *   exactly the mechanism by which the diagnostic approaches 1 from below.
 *   (c) WHY IT MATTERS. It reclassifies a numerically-ambiguous "~0.98 plateau" as a fully
 *   understood, closed-form asymptotic identity in the inherited RvM height map, closing the
 *   case-(i)-vs-case-(ii) question imp-97702 left open with no new computation beyond extending
 *   the existing grid and fitting the already-known slope formula.
 *   (d) STATUS: documentation only. Conditional-share diagnostic (sigma model), NOT an RH bound;
 *   no operator positivity; no bound moves.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   result. Not a new derivation. NO QED.
 *
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one.js (source: the RvM-slope identity and
 *   two-term c-coefficient fit this headword names)
 * @see imp-97702-sigma-fartail-exponent-residual-half-loglaw.js (left open whether ~0.98 is a
 *   floor or an unreached asymptote; resolved here as the latter)
 * @see imp-97738-fartail-a-coefficient-closedform-crossval.js (independent cross-validation of
 *   c = -1 and the 1/L^2 coefficient -ln(2pi) via a differencing-free log-space path)
 *
 * Ticket: imp-97749 (content, medium, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The far-tail-diagnostic-is-the-RvM-slope headword, baked verbatim (no re-import).
const FARTAIL_DIAGNOSTIC_RVM_SLOPE_HEADWORD = Object.freeze({
  key: 'sigma-fartail-diagnostic-rvm-slope-imp97723',
  term:
    'far-tail diagnostic = RvM log-derivative slope: the imp-97702 (1/2 - p) * 2 log T0 ' +
    'diagnostic equals the exact Riemann-von Mangoldt slope d ln T0/d ln N and converges to ' +
    'EXACTLY 1, not a ~0.98 floor',
  definition:
    'Deep in the sigma far tail, the diagnostic (1/2 - p) * 2 log T0 reduces to ' +
    '(1 - sigma)(1 - 1/log(T0/2pi)) + sigma*log T0, the Riemann-von Mangoldt log-derivative ' +
    'slope 1 - 1/log(T0/2pi) coming from N = (T0/2pi)(log(T0/2pi) - 1). It climbs monotonically ' +
    'toward 1 only logarithmically: 0.9805 at 1e24, 0.9846 at 1e30, 0.9926 at 1e60, 0.9989 at ' +
    '1e300, crossing 0.99 near 1e45 and 0.995 near 1e89.',
  mechanism:
    'Writing the log-saturation coefficient a = (1/(2 log T0))(1 + c/log T0 + ...), the exact ' +
    'slope gives the closed form c(L) = -L/(L - ln 2pi), matching the measured ' +
    'L*(2L*a - 1) to round-off (-1.0358 at 1e24 -> -1.0040 at 1e200) and converging to -1 from ' +
    'below; the 1/L^2 coefficient is -ln(2pi) ~ -1.838. The negative sign of c is exactly why the ' +
    'diagnostic approaches its limit of 1 from below rather than from above.',
  verificationStatus:
    'Re-cited from the imp-97723 derivation module ' +
    '(src/data/imp-97723-sigma-fartail-diagnostic-asymptote-one.js), matched to the ' +
    'central-difference floor (< 3e-6) on [1e18,1e300] and independently cross-validated by ' +
    'imp-97738 via a differencing-free closed-form path to full double precision. Conditional-' +
    'share diagnostic (sigma component model), NOT an RH bound; no operator positivity; naming / ' +
    'glossary headword only; supplies no new bound; RH open; Platt-Trudgian Lambda <= 0.2 remains ' +
    'SOTA; NO QED.',
});

export const IMP97749_FARTAIL_DIAGNOSTIC_RVM_SLOPE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97749',
  proofSection: 'S-frontier',
  glosses: 'imp-97723',
  question:
    'imp-97723 decided that the imp-97702 far-tail diagnostic (1/2 - p) * 2 log T0 is exactly the ' +
    'Riemann-von Mangoldt log-derivative slope 1 - 1/log(T0/2pi), converging to EXACTLY 1 (not a ' +
    '~0.98 floor), with next-order coefficient c -> -1 and 1/L^2 coefficient -ln(2pi). What is the ' +
    'headword for this result?',
  headword: FARTAIL_DIAGNOSTIC_RVM_SLOPE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97723 identification of ' +
    'the imp-97702 far-tail diagnostic with the exact Riemann-von Mangoldt log-derivative slope ' +
    '1 - 1/log(T0/2pi), settling that it converges to EXACTLY 1 (reached only logarithmically, ' +
    'crossing 0.99 near 1e45) rather than floors at ~0.98, with next-order coefficient c -> -1 and ' +
    '1/L^2 coefficient -ln(2pi). No bound moved; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97723 (the RvM-slope identity and two-term c-coefficient fit this glosses); imp-97702 ' +
    '(the diagnostic that left case-(i)-vs-case-(ii) open); imp-97738 (independent cross-' +
    'validation of c = -1 and 1/L^2 coefficient -ln(2pi)).',
});

export default IMP97749_FARTAIL_DIAGNOSTIC_RVM_SLOPE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97749_FARTAIL_DIAGNOSTIC_RVM_SLOPE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97749-headword-names-slope-identity-and-coefficient',
    why: 'The headword must name the RvM-slope identity, the limit of exactly 1, and the ' +
      'next-order coefficient c and its 1/L^2 term -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP97749_FARTAIL_DIAGNOSTIC_RVM_SLOPE_GLOSSARY_HEADWORD.headword;
      return (
        /1 - 1\/log\(T0\/2pi\)/.test(h.definition) &&
        /0\.9989/.test(h.definition) &&
        /-L\/\(L - ln 2pi\)/.test(h.mechanism) &&
        /-1\.838/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97749-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-97723.',
    holds: () =>
      IMP97749_FARTAIL_DIAGNOSTIC_RVM_SLOPE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97749_FARTAIL_DIAGNOSTIC_RVM_SLOPE_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP97749_FARTAIL_DIAGNOSTIC_RVM_SLOPE_GLOSSARY_HEADWORD.verdict) &&
      IMP97749_FARTAIL_DIAGNOSTIC_RVM_SLOPE_GLOSSARY_HEADWORD.glosses === 'imp-97723',
  },
];

for (const assertion of IMP97749_FARTAIL_DIAGNOSTIC_RVM_SLOPE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97749-fartail-diagnostic-rvm-slope-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
