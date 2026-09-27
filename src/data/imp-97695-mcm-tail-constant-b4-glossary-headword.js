/**
 * @module imp-97695-mcm-tail-constant-b4-glossary-headword
 * @fileoverview imp-97695 -- import-light glossary/Concepts headword naming the imp-97666 derived
 *   MCM tail constant: the leading Euler-Maclaurin coefficient 1/720 = |B_4|/4! that fixes the
 *   omitted-divisor remainder R(d) ~ +1/(720 d^2) in the imp-97647/imp-97432 MCM kernel tail budget.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE CONSTANT. 1/720 is the magnitude of the fourth Bernoulli-number Euler-Maclaurin
 *   coefficient B_4/4! for f(x) = x log x (whose partial sums Sum_{k=1}^m f(k) = log H(m), the
 *   hyperfactorial). Since B_4 = -1/30 and f'''(x) = -1/x^2, the term
 *   B_4/4! . f'''(n) = (-1/720).(-1/n^2) = +1/(720 n^2) is exactly the FIRST Euler-Maclaurin term
 *   left over once the n^2 log n, n log n, and log n pieces of GKmain(m) (the Glaisher-Kinkelin
 *   main asymptotic) are subtracted off.
 *   (b) WHY IT MATTERS. imp-97647 RESULT 2 had ASSERTED R(d) ~ +1/(720 d^2) to bound the tail
 *   Sum_{d>cut} 1/(720 d^3) of omitted divisors and justify the d <= 1000 numeric cap. imp-97666
 *   DERIVES that same 1/720 from first principles via the Euler-Maclaurin expansion, so the
 *   imp-97647 tail budget (< 5.69e-11 gap shift over all omitted divisors) now rests on a derived
 *   constant rather than an asserted one.
 *   (c) THE NEXT ORDER. The following (B_6) term gives Rexact(m).720.m^2 = 1 - (1/7)/m^2 + O(m^-4),
 *   confirmed numerically to ~1e-6 over m = 10..100 and to log-log slope -1.99994 (pinning the
 *   m^-2 power).
 *   (d) STATUS: documentation only. Onset stays omega = 11, MCM refuted, no bound moves; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   derivation. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97666-route-m-mcm-tail-constant-euler-maclaurin.js (source: the Euler-Maclaurin
 *   derivation of the 1/720 = |B_4|/4! leading tail constant)
 * @see imp-97647 (the RESULT-2 tail budget that had asserted, rather than derived, the same
 *   1/720 constant this headword names)
 *
 * Ticket: imp-97695 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

import { IMP97666_DERIVATION } from './imp-97666-route-m-mcm-tail-constant-euler-maclaurin.js';

// The headword, baked verbatim (no re-import of the derivation prose).
const MCM_TAIL_CONSTANT_B4_HEADWORD = Object.freeze({
  key: 'mcm-tail-constant-b4-over-4fact-imp97666',
  term:
    'MCM tail constant 1/720 = |B_4|/4!: the derived leading Euler-Maclaurin coefficient fixing ' +
    'the omitted-divisor remainder R(d) ~ +1/(720 d^2) in the imp-97647/imp-97432 MCM kernel tail ' +
    'budget',
  definition:
    'For f(x) = x log x (whose partial sums Sum_{k=1}^m f(k) = log H(m), the hyperfactorial), the ' +
    'first Euler-Maclaurin term left over after subtracting the Glaisher-Kinkelin main asymptotic ' +
    'GKmain(m) is B_4/4! . f_ppp(n), with B_4 = -1/30 and f_ppp(x) = -1/x^2. This gives ' +
    '(-1/720).(-1/n^2) = +1/(720 n^2), so the leading tail constant is |B_4|/4! = (1/30)/24 = 1/720.',
  mechanism:
    'imp-97647 RESULT 2 had asserted R(d) ~ +1/(720 d^2) to bound the omitted-divisor tail ' +
    'Sum_{d>cut} 1/(720 d^3) and justify the d <= 1000 numeric cap on the exact MCM kernel sum. ' +
    'imp-97666 derives that same 1/720 from the Euler-Maclaurin expansion of Sum k log k, placing ' +
    'the imp-97647 tail budget (< 5.69e-11 gap shift over all omitted divisors) on a derived rather ' +
    'than asserted footing. The next (B_6) term gives the scaled correction ' +
    'Rexact(m).720.m^2 = 1 - (1/7)/m^2 + O(m^-4), confirmed numerically to ~1e-6 over m = 10..100 ' +
    'with log-log slope -1.99994 pinning the m^-2 power.',
  verificationStatus:
    'Re-cited from the imp-97666 derivation module ' +
    '(src/data/imp-97666-route-m-mcm-tail-constant-euler-maclaurin.js), whose self-executing ' +
    'assertions recompute the B_4/B_6 Euler-Maclaurin coefficients and reproduce the baked ' +
    'clean-regime Rexact(m) ladder (m <= 100). Naming / glossary headword only; supplies no new ' +
    'bound; onset stays omega = 11; MCM refuted; RH open; Platt-Trudgian Lambda <= 0.2 remains ' +
    'SOTA; NO QED.',
});

export const IMP97695_MCM_TAIL_CONSTANT_B4_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97695',
  proofSection: 'Route-M',
  glosses: 'imp-97666',
  question:
    'imp-97666 derived the imp-97647/imp-97432 MCM omitted-divisor tail constant 1/720 from the ' +
    'Euler-Maclaurin expansion of Sum k log k rather than asserting it. What is the headword for ' +
    'this derived constant?',
  headword: MCM_TAIL_CONSTANT_B4_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97666 derived MCM tail ' +
    'constant 1/720 = |B_4|/4!, the leading Euler-Maclaurin coefficient of Sum k log k (hyperfactorial ' +
    '/ Glaisher-Kinkelin) fixing the omitted-divisor remainder R(d) ~ +1/(720 d^2). No bound moved; ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97666 (the Euler-Maclaurin derivation of the 1/720 constant this glosses); imp-97647 ' +
    '(the RESULT-2 tail budget that had asserted the same constant).',
});

export default IMP97695_MCM_TAIL_CONSTANT_B4_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97695_MCM_TAIL_CONSTANT_B4_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97695-headword-names-constant-and-derivation',
    why: 'The headword must name the 1/720 = |B_4|/4! constant, its Euler-Maclaurin provenance, ' +
      'and the source derivation it glosses.',
    holds: () => {
      const h = IMP97695_MCM_TAIL_CONSTANT_B4_GLOSSARY_HEADWORD.headword;
      return (
        /1\/720/.test(h.term) &&
        /B_4/.test(h.definition) &&
        /hyperfactorial/.test(h.definition) &&
        /Euler-Maclaurin/.test(h.mechanism) &&
        IMP97695_MCM_TAIL_CONSTANT_B4_GLOSSARY_HEADWORD.glosses === 'imp-97666'
      );
    },
  },
  {
    id: 'imp97695-constant-matches-source-derivation',
    why: 'The headword must reproduce the exact leading constant and power carried by the ' +
      'imp-97666 derivation module, not a re-typed copy.',
    holds: () =>
      Math.abs(IMP97666_DERIVATION.leadingConstant - 1 / 720) < 1e-18 &&
      IMP97666_DERIVATION.power === -2,
  },
  {
    id: 'imp97695-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present.',
    holds: () =>
      IMP97695_MCM_TAIL_CONSTANT_B4_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97695_MCM_TAIL_CONSTANT_B4_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP97695_MCM_TAIL_CONSTANT_B4_GLOSSARY_HEADWORD.verdict),
  },
];

for (const assertion of IMP97695_MCM_TAIL_CONSTANT_B4_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97695-mcm-tail-constant-b4-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
