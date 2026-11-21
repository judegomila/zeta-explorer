/**
 * @module imp-124956-extprec-ecf-floor-glossary-headword
 * @fileoverview imp-124956 -- import-light glossary/Concepts headword recording the imp-124849
 *   finding: the extended-precision (mpmath dps>=30) E_CF stencil round-off floor is a
 *   dps-INVARIANT R ~ 1.0819e-12 with crossover sigma_crit ~ 0.020385, which SUPERSEDES the
 *   imp-124810 double-precision framing (R_inf ~ 4.46e-13, sigma_crit ~ 0.0127) -- the
 *   double-precision pin was a round-off-contaminated UNDER-estimate of the true O(eps^2)
 *   2-point-stencil floor, not a genuine round-off limit.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-124810 swept the landmark-bisection tolerance TOL and pinned a
 *   double-precision floor R_inf ~ 4.46e-13 / sigma_crit ~ 0.0127, calling it double-precision-
 *   limited. imp-124849 ported the same machinery to mpmath and swept the WORKING PRECISION
 *   (dps 15..140): at dps=15 it reproduces the imp-124810 pin exactly, but at every dps>=30 the
 *   floor JUMPS to a dps-invariant R = 1.0819e-12 and sigma_crit stabilizes at 0.020385 (at L5
 *   sigma=0.02, not below L6 sigma=0.005).
 *   (b) THE SUPERSEDING VALUES. R = 1.0819e-12 (dps-invariant for dps>=30), sigma_crit =
 *   0.020385, obeying a clean R ~ eps^2 law (log-log slope 2.000, 100x per eps decade) at the
 *   headline eps = 1e-3 -- the O(eps^2) truncation signature of the symmetric 2-point central
 *   difference directCF, not a round-off floor at all.
 *   (c) WHY IT IS NEW. imp-124810 attributed R to double-precision round-off and predicted
 *   extended precision could push sigma_crit below L6; imp-124849 is the first to show extended
 *   precision instead RAISES R to a dps-invariant stencil floor, refuting the imp-124810
 *   double-precision-limited premise and replacing its pin with the canonical extended-precision
 *   values.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a measurement/cross-validation diagnostic on the
 *   imp-97644/imp-97689 crossing-elasticity model's finite-difference machinery. DIAG3
 *   additivity, the C_C 1/8 ansatz, E_trunc, and the imp-398 C_F prefactor are all fixed
 *   surrogate inputs, perturbed only symbolically as differentiation axes; no operator positivity
 *   established; no RH verdict.
 *   (e) STATUS: documentation only. No bound moved; no coefficient pinned beyond re-citing the
 *   imp-124849 crossover; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a new derivation. NO QED.
 *
 * @see imp-124849-extprec-ecf-floor-sigmacrit.js (source: the extended-precision floor this headword names)
 * @see imp-124810-bisection-tol-roundoff-floor-sweep.js (the superseded double-precision pin)
 * @see imp-124919-ecf-stencil-crossover-glossary-headword.js (names the imp-124769 double-precision crossover)
 *
 * Ticket: imp-124956 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The extended-precision E_CF stencil floor headword, baked verbatim (no re-import of the heavy zeros bundle).
const ECF_EXTPREC_FLOOR_HEADWORD = Object.freeze({
  key: 'ecf-extprec-floor-imp124849',
  term:
    'E_CF extended-precision stencil floor: the dps>=30 mpmath floor R = 1.0819e-12 ' +
    '(sigma_crit = 0.020385) SUPERSEDES the imp-124810 double-precision pin ' +
    '(R_inf ~ 4.46e-13, sigma_crit ~ 0.0127), which was a round-off-contaminated under-estimate',
  definition:
    'imp-124810 swept the landmark-bisection tolerance and pinned a double-precision floor ' +
    'R_inf ~ 4.46e-13 with crossover sigma_crit ~ 0.0127, calling it double-precision-limited. ' +
    'imp-124849 ported that machinery to mpmath and swept the working precision dps in ' +
    '{15,30,45,60,80,100,140} at the shared headline eps = 1e-3: dps=15 reproduces the ' +
    'imp-124810 pin exactly (R=4.463e-13, sigma_crit=0.012665), but every dps>=30 jumps to a ' +
    'dps-invariant R = 1.0819e-12 with sigma_crit = 0.020385 -- at L5 (sigma 0.02), never ' +
    'reaching L6 (sigma 0.005).',
  mechanism:
    'Sweeping eps at fixed dps=100 shows R follows a clean eps^2 law (R = 1.0819e-10, 1.0819e-12, ' +
    '1.0819e-14, 1.0819e-16 at eps = 1e-2 .. 1e-5, log-log slope 2.000, 100x per decade -> 0): R is ' +
    'the O(eps^2) truncation signature of the symmetric 2-point central-difference directCF ' +
    'stencil, NOT a working-precision round-off floor. The imp-124810 double-precision ' +
    'R_inf = 4.46e-13 was therefore a round-off-contaminated under-estimate of the true stencil ' +
    'floor 1.0819e-12; its double-precision-limited premise is refuted, and shrinking eps -- not ' +
    'adding precision -- is the only lever that moves sigma_crit.',
  verificationStatus:
    'Re-cited from the imp-124849 measurement module ' +
    '(src/data/imp-124849-extprec-ecf-floor-sigmacrit.js): R = 1.0819e-12 (dps-invariant for ' +
    'dps>=30), sigma_crit = 0.020385, eps^2 law slope 2.000. Naming / glossary headword only; ' +
    'supplies no new bound; DIAG3 and the C_C 1/8 ansatz are untouched; RH open; no refereed bound is changed' +
    '; NO QED.',
});

export const IMP124956_EXTPREC_ECF_FLOOR_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124956',
  proofSection: 'S-frontier',
  glosses: 'imp-124849',
  question:
    'imp-124849 showed the extended-precision (dps>=30) E_CF stencil floor is dps-invariant at ' +
    'R = 1.0819e-12 / sigma_crit = 0.020385, superseding the imp-124810 double-precision pin -- ' +
    'what is the headword for this superseding extended-precision regime?',
  headword: ECF_EXTPREC_FLOOR_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124849 result: the ' +
    'extended-precision (dps>=30) E_CF stencil floor is dps-invariant at R = 1.0819e-12 with ' +
    'crossover sigma_crit = 0.020385, obeying R ~ eps^2 (slope 2.000) -- superseding the ' +
    'imp-124810 double-precision pin (R_inf ~ 4.46e-13, sigma_crit ~ 0.0127), which was a ' +
    'round-off-contaminated under-estimate. No bound moved; DIAG3 and all pinned surrogate ' +
    'constants untouched; NO QED. No refereed bound is changed.',
  citation:
    'imp-124849 (the extended-precision floor this glosses); imp-124810 (the superseded ' +
    'double-precision pin); imp-124769 (the original E_CF round-off crossover model); ' +
    'imp-124919 (the glossary headword naming the imp-124769 double-precision crossover).',
});

export default IMP124956_EXTPREC_ECF_FLOOR_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124956_EXTPREC_ECF_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124956-headword-names-superseding-values',
    why: 'The headword must name the extended-precision R / sigma_crit values and the superseded imp-124810 pin -- ' +
      'the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124956_EXTPREC_ECF_FLOOR_GLOSSARY_HEADWORD.headword;
      return (
        /1\.0819e-12/.test(h.term) &&
        /0\.020385/.test(h.term) &&
        /SUPERSEDES/.test(h.term) &&
        /4\.46e-13/.test(h.definition) &&
        /round-off-contaminated/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp124956-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-124849.',
    holds: () =>
      IMP124956_EXTPREC_ECF_FLOOR_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124956_EXTPREC_ECF_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124956_EXTPREC_ECF_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      IMP124956_EXTPREC_ECF_FLOOR_GLOSSARY_HEADWORD.glosses === 'imp-124849',
  },
];

for (const assertion of IMP124956_EXTPREC_ECF_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124956-extprec-ecf-floor-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
