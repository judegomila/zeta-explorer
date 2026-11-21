/**
 * @module imp-124883-l6-eps-step-artifact-glossary-headword
 * @fileoverview imp-124883 -- import-light glossary/Concepts headword recording the imp-124849
 *   verdict that SUPERSEDES imp-124864: the DIAG3 L6 eps-ladder non-monotonicity (imp-97821) is an
 *   eps-STEP (2-point central-difference truncation) artifact, NOT a double-precision round-off
 *   floor. imp-124810/imp-124864 called the floor "double-precision-limited"; imp-124849 ports the
 *   machinery to mpmath, sweeps working precision, and REFUTES that premise.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-124849 ported the imp-124810 landmark/elasticity/E_CF-floor machinery
 *   verbatim to mpmath and swept the working precision dps in {15,30,45,60,80,100,140} at fixed
 *   eps=1e-3. dps=15 (~double) reproduces imp-124810 exactly (R=4.463e-13, sigma_crit=0.012665),
 *   but every dps>=30 rung RISES to a dps-INVARIANT floor R=1.0819e-12 (ratio 1.000 across dps
 *   30..140) with sigma_crit stuck at 0.020385 -- at L5 (0.02), still far above L6 (0.005). A
 *   second sweep of eps in {1e-2,1e-3,1e-4,1e-5} at fixed dps=100 shows R falls as eps^2 exactly
 *   (log-log slope 2.000, 100x per decade, extrapolating to 0) with no plateau -- the signature of
 *   the O(eps^2) truncation of the symmetric 2-point central-difference directCF, not a round-off
 *   floor.
 *   (b) WHY IT IS NEW. imp-124810/imp-124864 measured only the double-precision (dps~15) solve and
 *   inferred from TOL-saturation that the floor was round-off-limited, concluding only extended
 *   precision (imp-124808) could move the L6 non-monotonicity. imp-124849 tests that inference
 *   directly by adding digits: raising dps does not lower R, it raises it to a higher,
 *   dps-invariant plateau -- the opposite of what a round-off floor would do. This REFUTES the
 *   imp-124810 double-precision-limited premise and supersedes the imp-124864 headword that
 *   restated it.
 *   (c) WHY IT MATTERS. It redirects the only live lever for the L6 non-monotonicity: SHRINKING
 *   the finite-difference step eps (not adding working-precision digits) is what drives sigma_crit
 *   down, since R ~ eps^2 extrapolates to 0 as eps -> 0 with no floor in sight. Extended precision
 *   alone, at any dps, cannot push sigma_crit past L5 (0.02), let alone below L6 (0.005).
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a precision-vs-step-size diagnostic on the
 *   inherited imp-3220/imp-3406 sigma(N) extrapolation, not a rigorous asymptotic; the C_mb
 *   GUE-conditional per imp-486 is untouched; establishes no operator positivity; imp-3066
 *   K_a >= 0 untouched.
 *   (e) STATUS: documentation only. No bound moved; no new coefficient pinned beyond re-citing the
 *   imp-124849 sweep; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement that corrects the imp-124864 headword. Not a new derivation. NO QED.
 *
 * @see imp-124849-extprec-ecf-floor-sigmacrit.js (source: the dps/eps two-axis sweep that decides
 *   this headword and refutes the imp-124810 double-precision-limited premise)
 * @see imp-124864-bisection-roundoff-floor-glossary-headword.js (the prior headword this one
 *   supersedes -- restated the now-refuted "double-precision-limited" verdict)
 * @see imp-124810-bisection-tol-roundoff-floor-sweep.js (the double-precision-only TOL sweep whose
 *   inference is refuted)
 * @see imp-97821-diag3-sixth-landmark-crossvalidation (the L6 non-monotone eps-ladder diagnosed
 *   here as an eps-step artifact)
 *
 * Ticket: imp-124883 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The L6 eps-step-artifact headword, baked verbatim (no re-import of the heavy zeros bundle).
const L6_EPS_STEP_ARTIFACT_HEADWORD = Object.freeze({
  key: 'l6-eps-step-artifact-imp124849',
  term:
    'imp-124849 L6 eps-step artifact: the DIAG3 L6 non-monotonicity is an O(eps^2) 2-point-stencil ' +
    'truncation artifact, NOT a double-precision round-off floor',
  definition:
    'Porting the imp-124810 landmark/elasticity/E_CF-floor machinery to mpmath and sweeping the ' +
    'working precision dps in {15,30,45,60,80,100,140} at fixed eps=1e-3 shows R does NOT fall ' +
    'with added precision: dps=15 reproduces the imp-124810 pin (R=4.463e-13, sigma_crit=0.012665), ' +
    'but every dps>=30 rung rises to a dps-invariant floor R=1.0819e-12 with sigma_crit stuck at ' +
    '0.020385 -- at L5 (0.02), never reaching L6 (0.005). Sweeping eps in {1e-2,1e-3,1e-4,1e-5} at ' +
    'fixed dps=100 instead shows R ~ eps^2 exactly (log-log slope 2.000, 100x per decade, ' +
    'extrapolating to 0 with no plateau): the O(eps^2) truncation signature of the symmetric ' +
    '2-point central-difference directCF stencil.',
  mechanism:
    'A genuine double-precision round-off floor would FALL as working-precision digits are added ' +
    'and eventually vanish; instead R RISES to a higher, dps-invariant plateau once dps>=30 -- the ' +
    'opposite behavior. That plateau is exactly the O(eps^2) truncation error of the 2-point ' +
    'central difference directCF at the fixed step eps=1e-3, confirmed by the clean eps^2 scaling ' +
    'law at dps=100. Because the floor tracks eps, not dps, only shrinking the finite-difference ' +
    'step eps (never adding working-precision digits) can drive sigma_crit below its current ' +
    'L5-pinned value of 0.020385 toward the L6 rung at 0.005.',
  verificationStatus:
    'Re-cited from the imp-124849 measurement module ' +
    '(src/data/imp-124849-extprec-ecf-floor-sigmacrit.js): dps=15 reproduces the imp-124810 ' +
    'double-precision pin exactly, every dps>=30 rung is bit-identical at R=1.0819e-12 / ' +
    'sigma_crit=0.020385, and the eps ladder at dps=100 fits log-log slope 2.000 with ratio ' +
    '~100x per decade. Naming / glossary headword only; supplies no new bound; the C_C 1/8 ' +
    'ansatz and E_trunc/E_flow component model are untouched; RH open; no refereed bound is changed' +
    '; NO QED.',
});

export const IMP124883_L6_EPS_STEP_ARTIFACT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124883',
  proofSection: 'S-frontier',
  glosses: 'imp-124849',
  question:
    'imp-124849 ported the imp-124810 E_CF-floor machinery to mpmath and swept working precision ' +
    '-- does the DIAG3 L6 eps-ladder non-monotonicity vanish at extended precision (confirming ' +
    'imp-124810/imp-124864 double-precision-limited), or is it something else?',
  headword: L6_EPS_STEP_ARTIFACT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124849 result, which ' +
    'SUPERSEDES the imp-124864 headword: raising working precision past dps=30 does not lower the ' +
    'E_CF-floor R -- it rises to a dps-invariant plateau R=1.0819e-12, while sweeping the ' +
    'finite-difference step eps shows R ~ eps^2 exactly (slope 2.000, 100x per decade, ' +
    'extrapolating to 0). The DIAG3 L6 eps-ladder non-monotonicity is therefore an O(eps^2) ' +
    '2-point-stencil truncation (eps-step) artifact, NOT a double-precision round-off floor; the ' +
    'imp-124810 double-precision-limited premise is REFUTED. Only shrinking eps, not adding ' +
    'precision, can move sigma_crit toward L6. No bound moved; the component model and all pinned ' +
    'surrogate constants are untouched; NO QED. No refereed bound is changed.',
  citation:
    'imp-124849 (the dps/eps two-axis sweep this glosses, deciding the imp-124810 question); ' +
    'imp-124864 (the prior headword this one supersedes); imp-124810 (the double-precision-only ' +
    'TOL sweep whose inference is refuted); imp-97821 (the L6 non-monotone eps-ladder).',
});

export default IMP124883_L6_EPS_STEP_ARTIFACT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124883_L6_EPS_STEP_ARTIFACT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124883-headword-names-dps-invariant-floor-and-eps2-law',
    why: 'The headword must name both the dps-invariant extended-precision floor and the eps^2 ' +
      'truncation law -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124883_L6_EPS_STEP_ARTIFACT_GLOSSARY_HEADWORD.headword;
      return (
        /1\.0819e-12/.test(h.definition) &&
        /eps\^2/.test(h.definition) &&
        /dps-invariant/.test(h.mechanism) &&
        /0\.020385/.test(h.definition)
      );
    },
  },
  {
    id: 'imp124883-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-124849.',
    holds: () =>
      IMP124883_L6_EPS_STEP_ARTIFACT_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124883_L6_EPS_STEP_ARTIFACT_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124883_L6_EPS_STEP_ARTIFACT_GLOSSARY_HEADWORD.verdict) &&
      IMP124883_L6_EPS_STEP_ARTIFACT_GLOSSARY_HEADWORD.glosses === 'imp-124849',
  },
  {
    id: 'imp124883-refutes-double-precision-premise',
    why: 'The verdict must explicitly state the imp-124810 double-precision-limited premise is refuted.',
    holds: () => /REFUTED/.test(IMP124883_L6_EPS_STEP_ARTIFACT_GLOSSARY_HEADWORD.verdict),
  },
];

for (const assertion of IMP124883_L6_EPS_STEP_ARTIFACT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124883-l6-eps-step-artifact-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
