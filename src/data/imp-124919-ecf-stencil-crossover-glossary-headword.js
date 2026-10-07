/**
 * @module imp-124919-ecf-stencil-crossover-glossary-headword
 * @fileoverview imp-124919 -- import-light glossary/Concepts headword recording the imp-124769
 *   finding: the direct central-difference E_CF crossing-elasticity measurement at the shared
 *   headline step eps = 1e-3 switches from a clean O(eps^2) truncation power law to a
 *   landmark-bisection round-off floor once |E_CF| falls below |E_CF|_crit ~ 1.4e-6, equivalently
 *   sigma_crit ~ 0.013, pinning the imp-97821 qualitative L6 non-monotone-ladder observation to a
 *   magnitude and a sigma.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97710 saw the DIAG3 eps-ladder quarter cleanly at landmark L5
 *   (sigma = 0.02); imp-97821 saw it turn non-monotone at L6 (sigma = 0.005). imp-124769 pins WHY:
 *   the direct E_CF finite-difference error errCF(1e-3) follows a stable O(eps^2) truncation
 *   plateau (relTrunc ~ 3.3e-7) while |E_CF| is large, then bottoms at a landmark-bisection
 *   round-off floor R ~ 4.5e-13 and turns back up once |E_CF| shrinks below the crossover.
 *   (b) THE CROSSOVER VALUES. Equating relTrunc * |E_CF|_crit = R pins |E_CF|_crit ~ 1.4e-6,
 *   interpolated in log-log between L5 and L6 to sigma_crit ~ 0.013 -- strictly between L5
 *   (sigma 0.02, truncation-clean) and L6 (sigma 0.005, round-off-dominated).
 *   (c) WHY IT IS NEW. imp-97821 reported the L6 breakdown only qualitatively ("becomes
 *   non-monotone"); imp-124769 is the first to attribute it to a named error-regime crossover and
 *   give it a magnitude (|E_CF|_crit) and a sigma (sigma_crit).
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a measurement/cross-validation diagnostic on the
 *   imp-97644/imp-97689 crossing-elasticity model's finite-difference machinery. DIAG3 additivity,
 *   the C_C 1/8 ansatz, E_trunc, and the imp-398 C_F prefactor are all fixed surrogate inputs,
 *   perturbed only symbolically as differentiation axes; no operator positivity established; no RH
 *   verdict.
 *   (e) STATUS: documentation only. No bound moved; no coefficient pinned beyond re-citing the
 *   imp-124769 crossover; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a new derivation. NO QED.
 *
 * @see imp-124769-ecf-stencil-noise-floor-crossover.js (source: the crossover this headword names)
 * @see imp-97821-diag3-sixth-landmark-crossvalidation (the qualitative L6 non-monotone ladder)
 * @see imp-97710-diag3-fourth-landmark-crossvalidation (the L5 clean O(eps^2) quartering)
 *
 * Ticket: imp-124919 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The E_CF stencil round-off crossover headword, baked verbatim (no re-import of the heavy zeros bundle).
const ECF_STENCIL_CROSSOVER_HEADWORD = Object.freeze({
  key: 'ecf-stencil-crossover-imp124769',
  term:
    'E_CF stencil round-off crossover: the direct central-difference E_CF measurement at the ' +
    'shared headline step eps = 1e-3 switches from clean O(eps^2) truncation to a ' +
    'landmark-bisection round-off floor once |E_CF| falls below |E_CF|_crit ~ 1.4e-6 ' +
    '(sigma_crit ~ 0.013)',
  definition:
    'imp-97821 observed that the direct DIAG3 = E_CC + E_ET + E_CF eps-ladder loses its clean ' +
    'O(eps^2) quartering and becomes non-monotone at landmark L6 (sigma = 0.005), while imp-97710 ' +
    'found it still quartered cleanly at L5 (sigma = 0.02). imp-124769 pins the crossover exactly: ' +
    'the finite-difference error errCF(1e-3) = |E_CF^direct - E_CF^recon| follows a stable relative ' +
    'O(eps^2) truncation law (relTrunc ~ 3.3e-7) while |E_CF| is large, then bottoms at a ' +
    'landmark-bisection round-off floor R ~ 4.5e-13 once |E_CF| shrinks enough that the round-off ' +
    'dominates the truncation.',
  mechanism:
    'Equating the two regimes, relTrunc * |E_CF|_crit = R, gives |E_CF|_crit = R / relTrunc ~ ' +
    '1.4e-6. Interpolating in log-log between the bracketing rungs L5 (sigma 0.02, |E_CF| ~ ' +
    '3.25e-6, still truncation-clean) and L6 (sigma 0.005, |E_CF| ~ 2.39e-7, round-off-dominated) ' +
    'places the crossover at sigma_crit ~ 0.013. Below |E_CF|_crit the direct stencil measurement ' +
    'is round-off-limited, not truncation-limited -- this is why the DIAG3 eps-ladder stays clean ' +
    'through L5 and turns non-monotone at L6, exactly as imp-97821 reported qualitatively.',
  verificationStatus:
    'Re-cited from the imp-124769 measurement module ' +
    '(src/data/imp-124769-ecf-stencil-noise-floor-crossover.js): |E_CF|_crit ~ 1.4e-6, ' +
    'sigma_crit ~ 0.013, strictly between the L5 (0.02) and L6 (0.005) landmarks. Naming / ' +
    'glossary headword only; supplies no new bound; DIAG3 and the C_C 1/8 ansatz are untouched; ' +
    'RH open; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
});

export const IMP124919_ECF_STENCIL_CROSSOVER_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124919',
  proofSection: 'S-frontier',
  glosses: 'imp-124769',
  question:
    'imp-124769 pinned the sigma (equivalently the E_CF magnitude) at which the direct central-' +
    'difference E_CF finite-difference error switches from a clean O(eps^2) truncation power law ' +
    'to a landmark-bisection round-off floor -- what is the headword for this crossover term?',
  headword: ECF_STENCIL_CROSSOVER_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124769 result: the direct ' +
    'E_CF stencil error crosses from O(eps^2) truncation (relTrunc ~ 3.3e-7) to a round-off floor ' +
    '(R ~ 4.5e-13) at |E_CF|_crit ~ 1.4e-6 (sigma_crit ~ 0.013), strictly between L5 (sigma 0.02) ' +
    'and L6 (sigma 0.005). No bound moved; DIAG3 and all pinned surrogate constants untouched; ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124769 (the stencil round-off crossover this glosses); imp-97821 (the qualitative L6 ' +
    'non-monotone ladder); imp-97710 (the L5 clean O(eps^2) quartering).',
});

export default IMP124919_ECF_STENCIL_CROSSOVER_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124919_ECF_STENCIL_CROSSOVER_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124919-headword-names-crit-values',
    why: 'The headword must name the |E_CF|_crit and sigma_crit crossover values -- the entire ' +
      'content of the glossary entry.',
    holds: () => {
      const h = IMP124919_ECF_STENCIL_CROSSOVER_GLOSSARY_HEADWORD.headword;
      return (
        /1\.4e-6/.test(h.term) &&
        /0\.013/.test(h.term) &&
        /relTrunc/.test(h.definition) &&
        /round-off floor/.test(h.definition) &&
        /sigma_crit ~ 0\.013/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp124919-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-124769.',
    holds: () =>
      IMP124919_ECF_STENCIL_CROSSOVER_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124919_ECF_STENCIL_CROSSOVER_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP124919_ECF_STENCIL_CROSSOVER_GLOSSARY_HEADWORD.verdict) &&
      IMP124919_ECF_STENCIL_CROSSOVER_GLOSSARY_HEADWORD.glosses === 'imp-124769',
  },
];

for (const assertion of IMP124919_ECF_STENCIL_CROSSOVER_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124919-ecf-stencil-crossover-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
