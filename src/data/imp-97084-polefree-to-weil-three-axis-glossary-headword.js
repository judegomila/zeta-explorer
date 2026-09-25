/**
 * @module imp-97084-polefree-to-weil-three-axis-glossary-headword
 * @fileoverview imp-97084 -- import-light glossary/Concepts headword for the imp-97049
 *   completeness result: the gap between the interval-verified T_a[sigma_2] >= 0 certificate
 *   (pole-free Weil positivity, 2a <= 0.96) and FULL Weil / operator positivity decomposes into
 *   THREE orthogonal axes -- REACH, POLE TERM, CRITERION COMPLETENESS -- not the two blockers
 *   (Rayleigh-direction problem; 0.96-1.00 LP-conditioning wall) that a ticket title or casual
 *   read might treat as the whole obstruction.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97036 assembled the pole-free-to-Weil obstruction as one object but explicitly left open
 *   whether its named blockers (Rayleigh direction + LP wall) were the ONLY obstructions.
 *   imp-97049 answered that: both named blockers are two FACES of a single axis (REACH -- no
 *   rigorous lower bound survives past 2a=0.96), and two further INDEPENDENT axes separate the
 *   certificate from the target regardless of whether Axis I is ever cleared. This headword bakes
 *   that three-axis enumeration verbatim (no re-import of imp-97049) so a reader does not
 *   conflate "the two named blockers" with "the full gap to Weil positivity."
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   AXIS I -- REACH. Extend the certified support past 2a=0.96. Contains BOTH named blockers,
 *   which are two faces of ONE obstruction, not two independent ones: (I-a) the 0.96-1.00 LP
 *   double-precision conditioning wall (HiGHS status 4 once eps <= lambda_min), and (I-b) the
 *   Rayleigh/Courant-Fischer direction problem (a finite Galerkin family bounds lambda_min only
 *   from the wrong-signed side; the coercive extremal state is the fractal Zygmund eigenfunction
 *   with no dyadic-grid convergence rate).
 *   AXIS II -- POLE TERM. Pole-free Weil positivity is not the FULL Weil form (which also
 *   controls the archimedean/pole term). The only assembled bridge (semilocal Sonine/excess
 *   D_S <= L_S) is obstructed at 2a=ln2=0.6931 -- strictly INSIDE the certified 0.96 reach -- and
 *   is not gap-free below ln3 either (remainder is 96.7-99.71% of the trace on the minimiser).
 *   Axis II is unresolved even WHERE Axis I already holds, so pushing reach does nothing for it.
 *   AXIS III -- CRITERION COMPLETENESS. Weil-Guinand positivity for RH quantifies over ALL
 *   admissible test functions of EVERY support; a per-support certificate is one slice of that
 *   cone. This axis carries a PROVEN no-go, not merely an open task: the unconditional
 *   flow-blindness result shows the RH-true profile sits exactly on the boundary of every soft
 *   class, so no soft/estimate-only strategy can close it -- arithmetic input is required.
 *   COMPLETENESS. The three axes {reach, pole term, quantifier-over-the-cone} are the full
 *   structural difference between the certified object and the target (same weight sigma_2, same
 *   Paley-Wiener space, same quadratic form) -- axis-level enumeration is complete, though the
 *   SPECIFIC blockers within each axis are the currently-known instances, not provably the only
 *   ones within that axis.
 *
 *   STATUS: an axis-level completeness assessment over already-committed findings, not a new
 *   computation or a positivity theorem. Certified reach stays 2a <= 0.96. NO QED. Platt-Trudgian
 *   Lambda <= 0.2 SOTA; RH open.
 *
 * @see imp-97049-polefree-to-weil-obstruction-enumeration.js (source: the three-axis enumeration
 *   and exhaustiveness verdict this glosses)
 * @see imp-97036-taplsigma2-to-weil-interpretive-obstruction.js (the two named blockers this
 *   headword warns readers not to mistake for the full gap)
 *
 * Ticket: imp-97084 (content, medium, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The three-axis obstruction headword, baked verbatim (no re-import).
const POLEFREE_TO_WEIL_THREE_AXIS_HEADWORD = Object.freeze({
  key: 'polefree-to-weil-three-orthogonal-obstruction-axes-not-two-named-blockers',
  term:
    'imp-97049 finding: the gap between the T_a[sigma_2] >= 0 pole-free certificate (2a <= 0.96) ' +
    'and full Weil positivity spans THREE orthogonal axes -- REACH, POLE TERM, CRITERION ' +
    'COMPLETENESS -- not just the two named blockers (Rayleigh direction; 0.96-1.00 LP wall), ' +
    'which both live on Axis I alone',
  definition:
    'AXIS I (REACH, extend past 2a=0.96) contains both named blockers as two faces of one ' +
    'obstruction: the 0.96-1.00 LP double-precision conditioning wall, and the Rayleigh/' +
    'Courant-Fischer direction problem (finite Galerkin bounds lambda_min only from the ' +
    'wrong-signed side). AXIS II (POLE TERM, pole-free -> full Weil form) is independent and ' +
    'omitted by the named-blocker pair: the only assembled bridge (semilocal Sonine/excess ' +
    'D_S <= L_S) is obstructed at 2a=ln2=0.6931, strictly inside the 0.96 certified reach, and is ' +
    'not gap-free below ln3 (remainder 96.7-99.71% of the trace on the minimiser). AXIS III ' +
    '(CRITERION COMPLETENESS, per-support slice -> the full Weil cone over every support) carries ' +
    'a proven no-go: the unconditional flow-blindness result shows the RH-true profile sits on ' +
    'the boundary of every soft class, so no soft/estimate-only strategy closes it.',
  mechanism:
    'Because both named blockers act on the same coordinate (how far the reach certificate can be ' +
    'pushed), they cannot, even in principle, exhaust a gap that also differs in the pole-term ' +
    'coordinate (pole-free vs full Weil form) and the quantifier coordinate (one support vs the ' +
    'full cone over all supports). The three axes are the coordinates of the DIFFERENCE between ' +
    'the certified and target objects (same weight family sigma_2=(t^2+1/4)^2 w_1, same ' +
    'Paley-Wiener space, same quadratic form), so any further obstruction must refine WITHIN one ' +
    'of the three axes, not add a fourth orthogonal direction.',
  verificationStatus:
    'Axis-level completeness assessment assembled from already-committed, previously-verified ' +
    'sibling modules (imp-97036, the Toeplitz/Krein certificate, the Rayleigh direction ' +
    'assessment, the semilocal Sonine excess port, the flow-blindness no-go); no new numerical ' +
    'computation. Certified reach unchanged at 2a <= 0.96; establishes no positivity theorem; ' +
    'PT Lambda <= 0.2 remains SOTA; RH open; NO QED.',
});

export const IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97084',
  proofSection: 'S-frontier',
  glosses: 'imp-97049',
  question:
    'imp-97036 named two blockers to bridging the pole-free T_a[sigma_2] >= 0 certificate to ' +
    'full Weil positivity (the Rayleigh-upper-bound direction problem; the 0.96-1.00 LP-' +
    'conditioning wall). Do those two blockers exhaust the gap to full Weil positivity, or does ' +
    'the gap span additional independent obstructions?',
  headword: POLEFREE_TO_WEIL_THREE_AXIS_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97049 finding: the two ' +
    'named blockers are both faces of a single axis (REACH); two further INDEPENDENT axes -- ' +
    'POLE TERM (Sonine bridge obstructed at 2a=ln2, inside the certified 0.96 reach) and ' +
    'CRITERION COMPLETENESS (per-support slice vs the full Weil cone, carrying the proven ' +
    'flow-blindness no-go) -- also separate the certificate from full Weil positivity. Readers ' +
    'should not treat clearing the two named blockers as sufficient to close the gap. Certified ' +
    'reach stays 2a <= 0.96; establishes nothing new; moves no bound; NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97049 (the three-axis enumeration and exhaustiveness verdict this glosses); imp-97036 ' +
    '(the two named blockers this headword contextualises).',
});

export default IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97084-headword-names-three-axes',
    why: 'The headword must name all three axes and the two-named-blockers-are-one-axis ' +
      'distinction -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD.headword;
      return (
        /AXIS I/.test(h.definition) &&
        /AXIS II/.test(h.definition) &&
        /AXIS III/.test(h.definition) &&
        /THREE/i.test(h.term) &&
        /ln2/.test(h.definition)
      );
    },
  },
  {
    id: 'imp97084-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present.',
    holds: () =>
      IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD.verdict) &&
      IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD.glosses === 'imp-97049',
  },
];

for (const assertion of IMP97084_POLEFREE_TO_WEIL_THREE_AXIS_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97084-polefree-to-weil-three-axis-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
