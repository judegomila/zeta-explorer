/**
 * @module imp-96552-zeff-model-contingent-glossary-headword
 * @fileoverview imp-96552 -- import-light glossary/Concepts headword recording that the
 *   imp-96529 excursion z_eff climb (3.18 / 4.33 / 5.43, the AR-1/AR-2/AR-3 model figures)
 *   is MODEL-CONTINGENT, and that the best guaranteed model-free improvement over the
 *   conservative independent-window floor z_cons = 1.9234 is exactly ZERO.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96529 already proved this by exhibiting an explicit positive-semidefinite
 *   (PSD-admissible) lag-completion, matching the three imp-96509 measured
 *   autocorrelations exactly, whose finite-window variance-inflation factor VIF_291
 *   is 14.55 (>> 1), driving z BELOW the naive floor rather than above it. Consumer
 *   surfaces that only see the headline numbers 3.18 / 4.33 / 5.43 can easily misread
 *   the climb as an established tightening; this headword names the distinction so a
 *   reader is not misled into treating a model-contingent figure as a rigorous one.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   GUARANTEED (model-free) floor: z_cons = 1.9234, the independence value
 *   (VIF = 1). This is the only number a reader may cite without importing an
 *   unproven model of the tail autocorrelation structure (k >= 4).
 *   MODEL-CONTINGENT climb: z_eff = 3.1787 (AR-1), 4.3310 (AR-2), 5.4329 (AR-3).
 *   Each rests on an AR(p) closed-form resummation of the lag structure -- equivalently,
 *   on the GUE sine-kernel theorem that all box correlations are negative and decay
 *   like O(1/k^2) with no spectral mass at frequency 0. That decay/sign statement is a
 *   MODEL for the zeros, not a consequence of the three measured lags.
 *   BEST GUARANTEED MODEL-FREE IMPROVEMENT over z_cons: ZERO. The three measured
 *   cosine moments (rho_1, rho_2, rho_3) cannot certify the sign or size of the tail,
 *   so a PSD-admissible completion with VIF > 1 always exists alongside one with
 *   VIF < 1 -- the admissible VIF interval straddles 1 -- and no positive-semidefinite
 *   argument alone forces the effective variance down.
 *
 *   STATUS: a naming/classification headword restating the imp-96529 verdict, not a
 *   fresh derivation.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96529 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96529-excursion-zcons-model-free-tightening-assessment (source: proves the ZERO-improvement verdict)
 * @see imp-96509-excursion-effective-significance-ar2 (source: the AR-2/AR-3 model figures this glosses)
 * @see imp-96452-excursion-confidence-2sigma-reach (source: carries z_cons = 1.9234)
 *
 * Ticket: imp-96552 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The z_eff model-contingency headword, baked verbatim (no re-import of the
// imp-96529/imp-96509 modules, to stay import-light).
const ZEFF_MODEL_CONTINGENT_HEADWORD = Object.freeze({
  key: 'excursion-zeff-model-contingent',
  term:
    'The imp-96529 distinction between the GUARANTEED model-free excursion floor '
    + 'z_cons = 1.9234 and the MODEL-CONTINGENT z_eff climb (3.18 / 4.33 / 5.43)',
  definition:
    'The excursion significance z = relErr * sqrt(n_eff/2) depends on the effective '
    + 'window count n_eff = n_w / VIF, where VIF is the variance-inflation factor set '
    + 'by the FULL lag-autocorrelation structure. The naive floor z_cons = 1.9234 is '
    + 'exactly the VIF = 1 (independence) value -- it requires no assumption about '
    + 'correlations. The imp-96509 AR-1/AR-2/AR-3 closed-form resummations instead '
    + 'report z_eff = 3.1787 / 4.3310 / 5.4329, each assuming the unmeasured tail '
    + '(lags k >= 4) continues to decay the way the AR(p) model (equivalently the GUE '
    + 'sine-kernel universality picture) dictates.',
  mechanism:
    'imp-96529 shows the model-free (PSD-only) constraint does not settle the question: '
    + 'an explicit nonnegative spectral measure -- one atom at frequency theta = 0 plus '
    + 'four nonzero-angle atoms -- matches all three measured lags (rho_1, rho_2, rho_3) '
    + 'to 1e-9, yet its finite-window VIF_291 = 14.55 is far ABOVE 1, giving z = 0.50, '
    + 'BELOW the naive floor. Because a PSD-admissible completion with VIF > 1 exists '
    + 'alongside the AR(p) completion with VIF < 1, the admissible VIF interval '
    + 'straddles 1 and no PSD-only argument can force z above z_cons. The entire climb '
    + 'to 3.18 / 4.33 / 5.43 therefore rests on the AR(p) / sine-kernel decay MODEL, not '
    + 'on the three measured numbers alone.',
  bestModelFreeImprovement: 0,
  verificationStatus:
    'Measurement-classification headword (accuracy/honesty audit), not a rigorous '
    + 'derivation. Changes no bound; RH open; NO QED; no refereed bound is changed'
    + '.',
});

export const IMP96552_ZEFF_MODEL_CONTINGENT_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96552',
  proofSection: 'S-frontier',
  glosses: 'imp-96529',
  question:
    'How should a reader distinguish the guaranteed model-free excursion floor '
    + 'z_cons = 1.9234 from the model-contingent z_eff climb (3.18 / 4.33 / 5.43) '
    + 'reported by the imp-96509 AR(p) resummations, given the imp-96529 proof that '
    + 'the best rigorous model-free improvement over z_cons is ZERO?',
  headword: ZEFF_MODEL_CONTINGENT_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the two figures in '
    + 'the imp-96529/imp-96509 excursion-significance thread: the GUARANTEED '
    + 'model-free floor z_cons = 1.9234 (the VIF = 1 independence value, the only '
    + 'number citable without importing an unproven tail-decay model) and the '
    + 'MODEL-CONTINGENT z_eff climb 3.1787 / 4.3310 / 5.4329 (AR-1/AR-2/AR-3, resting '
    + 'on the AR(p) / GUE sine-kernel decay assumption). The best guaranteed '
    + 'model-free improvement over z_cons is exactly ZERO. Establishes nothing; '
    + 'instantiates no interval; moves no bound; NO QED. No refereed bound is changed'
    + '.',
  citation:
    'imp-96529 (proves the ZERO model-free-improvement verdict via an explicit '
    + 'PSD-admissible VIF_291 = 14.55 completion); imp-96509 (the AR-1/AR-2/AR-3 '
    + 'model figures 3.1787/4.3310/5.4329 this glosses); imp-96452 (carries the '
    + 'z_cons = 1.9234 conservative floor); imp-96489 (the exact rho_1 = -0.4639782 '
    + 'union-identity lag this all builds on).',
});

export default IMP96552_ZEFF_MODEL_CONTINGENT_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96552_ZEFF_MODEL_CONTINGENT_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96552-headword-names-both-figures',
    why: 'The headword must name both the guaranteed floor and the model-contingent '
      + 'climb, with their values, or it fails to make the distinction it exists for.',
    holds: () => {
      const h = IMP96552_ZEFF_MODEL_CONTINGENT_GLOSSARY_HEADWORD.headword;
      return (
        /z_cons = 1\.9234/.test(h.definition)
        && /3\.1787/.test(h.definition)
        && /4\.3310/.test(h.definition)
        && /5\.4329/.test(h.definition)
        && h.bestModelFreeImprovement === 0
      );
    },
  },
  {
    id: 'imp96552-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96552_ZEFF_MODEL_CONTINGENT_GLOSSARY_HEADWORD.anyBoundMoved === false
      && /NO QED/.test(IMP96552_ZEFF_MODEL_CONTINGENT_GLOSSARY_HEADWORD.verdict)
      && /refereed bound is changed/i.test(IMP96552_ZEFF_MODEL_CONTINGENT_GLOSSARY_HEADWORD.verdict)
      && IMP96552_ZEFF_MODEL_CONTINGENT_GLOSSARY_HEADWORD.glosses === 'imp-96529',
  },
];

for (const assertion of IMP96552_ZEFF_MODEL_CONTINGENT_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96552-zeff-model-contingent-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
